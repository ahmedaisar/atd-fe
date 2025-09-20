import { NextResponse } from 'next/server'
import { getAtollmvCached, clearAtollmvCache } from '@/lib/atollmv-cache'
import { corsHeaders } from '@/lib/cors'

export const runtime = 'nodejs'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const origin = req.headers.get('origin')
    const wantsRefresh = searchParams.get('refresh') === '1'
    const wantsClear = searchParams.get('clear') === '1'

    // Handle cache clear first
    if (wantsClear) {
      const info = clearAtollmvCache()
      if (wantsRefresh) {
        // Clear and immediately rebuild
        const { body, cacheStatus } = await getAtollmvCached(true)
        const resp = NextResponse.json({ ...body, _cache: { action: 'cleared+refreshed', info } })
        resp.headers.set('X-Atollmv-Cache', cacheStatus)
        resp.headers.set('Cache-Control', 'no-store')
        const ch = corsHeaders(origin)
        for (const [k, v] of Object.entries(ch)) resp.headers.set(k, v)
        return resp
      }
      // Only clear, return empty body
      const empty = { total: 0, items: [] as any[] }
      const resp = NextResponse.json({ ...empty, _cache: { action: 'cleared', info } })
      resp.headers.set('X-Atollmv-Cache', 'MISS')
      resp.headers.set('Cache-Control', 'no-store')
      const ch = corsHeaders(origin)
      for (const [k, v] of Object.entries(ch)) resp.headers.set(k, v)
      return resp
    }

    // Refresh cache if requested, but return the latest available body immediately.
    // If refresh is requested, kick it off without blocking the response.
    let cacheStatus: 'HIT' | 'MISS' = 'HIT'
    let body
    if (wantsRefresh) {
      // Start refresh asynchronously; ignore result
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      getAtollmvCached(true)
      const latest = await getAtollmvCached(false)
      body = latest.body
      cacheStatus = latest.cacheStatus
    } else {
      const res = await getAtollmvCached(false)
      body = res.body
      cacheStatus = res.cacheStatus
    }

    const resp = NextResponse.json(body)
    resp.headers.set('X-Atollmv-Cache', cacheStatus)
    resp.headers.set('Cache-Control', 'public, max-age=30, s-maxage=300, stale-while-revalidate=60')
    const ch = corsHeaders(origin)
    for (const [k, v] of Object.entries(ch)) resp.headers.set(k, v)
    return resp
  } catch (e: any) {
    const origin = req.headers.get('origin')
    const resp = NextResponse.json({ error: true, message: e?.message || 'Failed to load data' }, { status: 500 })
    const ch = corsHeaders(origin)
    for (const [k, v] of Object.entries(ch)) resp.headers.set(k, v)
    return resp
  }
}

export async function OPTIONS(req: Request) {
  const origin = req.headers.get('origin')
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) })
}
