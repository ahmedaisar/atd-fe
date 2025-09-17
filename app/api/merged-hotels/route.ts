import { NextResponse } from 'next/server'
import { loadMergedHotels } from '@/lib/data/merge-hotels'

export const runtime = 'nodejs'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const refresh = searchParams.get('refresh') === '1'
  const limit = searchParams.get('limit')
  const offset = searchParams.get('offset')
  const toa = searchParams.get('toa')
  const stars = searchParams.get('stars')
  const minQuality = searchParams.get('minQuality')
  const maxQuality = searchParams.get('maxQuality')
  const minDiscount = searchParams.get('minDiscount')

  let items = await loadMergedHotels(refresh)

  // Optional filters
  if (toa) items = items.filter(h => (h.base?.toa ?? h.details?.toa) === toa)
  if (stars) items = items.filter(h => Number(h.base?.stars ?? h.details?.stars) === Number(stars))
  if (minQuality) items = items.filter(h =>
    Number(h.base?.quality?.review_rating ?? h.details?.quality?.review_rating ?? 0) >= Number(minQuality)
  )
  if (maxQuality) items = items.filter(h =>
    Number(h.base?.quality?.review_rating ?? h.details?.quality?.review_rating ?? 0) <= Number(maxQuality)
  )
  if (minDiscount !== null) {
    const min = Number(minDiscount)
    items = items.filter(h => {
      const d = (h.details as any)?.discount ?? (h.base as any)?.discount ?? (h.details as any)?.hero_offer?.discount ?? (h.base as any)?.hero_offer?.discount
      const n = typeof d === 'number' ? d : Number.parseFloat(String(d))
      return Number.isFinite(n) && n >= min
    })
  }

  // Sort by quality.review_rating descending (fallback to base.review_rating)
  items.sort((a, b) => {
    const qa = Number(a.base?.quality?.review_rating ?? a.base?.review_rating ?? a.details?.quality?.review_rating ?? a.details?.review_rating ?? 0)
    const qb = Number(b.base?.quality?.review_rating ?? b.base?.review_rating ?? b.details?.quality?.review_rating ?? b.details?.review_rating ?? 0)
    return qb - qa
  })

  const o = offset ? Number(offset) : 0
  const l = limit ? Number(limit) : undefined
  const page = items.slice(o, l ? o + l : undefined)

  return NextResponse.json({
    total: items.length,
    offset: o,
    limit: l ?? items.length,
    items: page,
  })
}
