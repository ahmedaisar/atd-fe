import { NextResponse } from 'next/server'
import { isRedisEnabled, getRedis } from '@/lib/redis'
import { getAtollmvCache } from '@/lib/atollmv-cache'

export const runtime = 'nodejs'

export async function GET() {
  const redisEnabled = isRedisEnabled()
  let redisOk = false
  let atollmvTtlSec: number | null = null
  try {
    if (redisEnabled) {
      const r = await getRedis()
      if (r) {
        try { await r.ping() } catch {}
        try {
          const ttl = await r.ttl('atollmv:cache:v1')
          if (typeof ttl === 'number') atollmvTtlSec = ttl
        } catch {}
        redisOk = true
      }
    }
  } catch {
    redisOk = false
  }

  const { body, ageMs } = getAtollmvCache()
  const items = Array.isArray(body?.items) ? body!.items : []
  const res = {
    redis: {
      enabled: redisEnabled,
      ok: redisOk,
    },
    atollmv: {
      cached: !!body,
      ageMs: Number.isFinite(ageMs) ? Math.round(ageMs) : null,
      total: body?.total ?? 0,
      items: items.length,
      redisTtlSec: atollmvTtlSec,
    },
  }
  return NextResponse.json(res)
}
