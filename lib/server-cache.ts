import { getRedis, isRedisEnabled } from '@/lib/redis'

type Json = any

// Simple in-memory fallback cache (per-process)
const mem = new Map<string, { v: Json; exp?: number }>()

export async function getJSON<T = any>(key: string): Promise<T | null> {
  if (isRedisEnabled()) {
    try {
      const redis = await getRedis()
      if (redis) {
        const v = await redis.get(key)
        if (v != null) {
          try { return JSON.parse(v) as T } catch { return v as T }
        }
      }
    } catch {}
  }
  const m = mem.get(key)
  if (!m) return null
  if (m.exp && Date.now() > m.exp) {
    mem.delete(key)
    return null
  }
  return m.v as T
}

export async function setJSON<T = any>(key: string, val: T, ttlSeconds?: number): Promise<void> {
  if (isRedisEnabled()) {
    try {
      const redis = await getRedis()
      if (redis) {
        const payload = typeof val === 'string' ? val : JSON.stringify(val)
        if (ttlSeconds && ttlSeconds > 0) {
          await redis.set(key, payload, { EX: ttlSeconds })
        } else {
          await redis.set(key, payload)
        }
      }
    } catch {}
  }
  const exp = ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined
  mem.set(key, { v: val as Json, exp })
}

export async function delKey(key: string): Promise<void> {
  if (isRedisEnabled()) {
    try {
      const redis = await getRedis()
      if (redis) await redis.del(key)
    } catch {}
  }
  mem.delete(key)
}
