import { NextResponse } from 'next/server'
import { loadMergedHotels } from '@/lib/data/merge-hotels'

export const runtime = 'nodejs'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const refresh = searchParams.get('refresh') === '1'
  const checkin = searchParams.get('checkin') || undefined
  const checkout = searchParams.get('checkout') || undefined
  const limit = searchParams.get('limit')
  const offset = searchParams.get('offset')
  // const toa = searchParams.get('toa')
  // const stars = searchParams.get('stars')
  // const minQuality = searchParams.get('minQuality')
  // const maxQuality = searchParams.get('maxQuality')
  // const minDiscount = searchParams.get('minDiscount')

  let items = await loadMergedHotels({
    refresh,
    checkin,
    checkout,
    // toa: toa || undefined,
    // // stars: stars ? Number(stars) : undefined,
    // // minQuality: minQuality ? Number(minQuality) : undefined,
    // // maxQuality: maxQuality ? Number(maxQuality) : undefined,
    // // minDiscount: minDiscount ? Number(minDiscount) : undefined,
    limit: limit ? Number(limit) : undefined,
    offset: offset ? Number(offset) : undefined,
  })

  // // Optional filters
  // if (toa) items = items.filter(h => (h.base?.toa ?? h.details?.toa) === toa)
  // if (stars) items = items.filter(h => Number(h.base?.quality?.stars ?? h.details?.data?.records[0]?.quality?.stars) === Number(stars))
  // if (minQuality) items = items.filter(h =>
  //   Number(h.base?.quality?.review_rating ?? h.details?.data?.records[0]?.quality?.review_rating ?? 0) >= Number(minQuality)
  // )
  // if (maxQuality) items = items.filter(h =>
  //   Number(h.base?.quality?.review_rating ?? h.details?.data?.records[0]?.review_rating ?? 0) <= Number(maxQuality)
  // )
  // if (minDiscount !== null) {
  //   const min = Number(minDiscount)
  //   items = items.filter(h => {
  //     const d = (h.details as any)?.discount ?? (h.base as any)?.discount ?? (h.details as any)?.hero_offer?.discount ?? (h.base as any)?.hero_offer?.discount
  //     const n = typeof d === 'number' ? d : Number.parseFloat(String(d))
  //     return Number.isFinite(n) && n >= min
  //   })
  // }

  // // Sort by quality.review_rating descending (fallback to base.review_rating)
  // items.sort((a, b) => {
  //   const qa = Number(a.base?.quality?.review_rating ?? a.base?.quality?.review_rating ?? a.details?.data?.records[0]?.quality?.review_rating ?? a.details?.review_rating ?? 0)
  //   const qb = Number(b.base?.quality?.review_rating ?? b.base?.quality?.review_rating ?? b.details?.data?.records[0]?.quality?.review_rating ?? b.details?.review_rating ?? 0)
  //   return qb - qa
  // })

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
