// Lightweight Redis client using node-redis; optional at runtime if REDIS_URL is missing
let client: any | null = null
let initPromise: Promise<any> | null = null
let lastFailAt = 0
const CONNECT_BACKOFF_MS = 15_000

export function isRedisEnabled() {
  return !!process.env.REDIS_URL
}

export async function getRedis(): Promise<any | null> {
  if (!isRedisEnabled()) return null
  if (client) return client
  if (initPromise) return initPromise
  // If recent failure, back off to avoid spamming logs and connection attempts
  const now = Date.now()
  if (now - lastFailAt < CONNECT_BACKOFF_MS) return null
  try {
    // Lazy require to avoid build-time dependency if not installed
    // eslint-disable-next-line no-eval
    const req: any = eval('require')
    const { createClient } = req('redis')
    client = createClient({ url: process.env.REDIS_URL })
    initPromise = client.connect().then(() => {
      initPromise = null
      return client
    }).catch((err: any) => {
      // eslint-disable-next-line no-console
      console.warn('Redis connect failed:', err?.message || err)
      client = null
      initPromise = null
      lastFailAt = Date.now()
      return null
    })
    return initPromise
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Redis module not available:', (e as any)?.message || e)
    client = null
    lastFailAt = Date.now()
    return null
  }
}
