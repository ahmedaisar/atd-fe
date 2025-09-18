import { NextResponse } from 'next/server'
import { getAtollmvCached } from '@/lib/atollmv-cache'
import { corsHeaders } from '@/lib/cors'

export const runtime = 'nodejs'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const origin = req.headers.get('origin')
    const wantsRefresh = searchParams.get('refresh') === '1'
    const { body, cacheStatus } = await getAtollmvCached(!!wantsRefresh)
    const limitParam = searchParams.get('limit')
    const limit = limitParam ? Math.max(0, Math.min(1000, Number.parseInt(limitParam, 10) || 0)) : 0
    const payload = limit > 0 && Array.isArray(body.items)
      ? { ...body, items: body.items.slice(0, limit) }
      : body
    const resp = NextResponse.json(payload)
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
