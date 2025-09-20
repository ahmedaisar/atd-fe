"use client"
import Image from 'next/image'
import { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { normalizeOfferFlags } from '../../lib/normalize-offer-flags'
import type { TopRatedHotel } from '@/types/hotels'
import { mapAtollToTopRated, filterHotelsWithPricedHeroOffer } from '@/lib/hotels'
import Carousel from '@/components/ui/carousel'

interface TopRatedHotelsPropsBase {
  title?: string
}

type RawItem = any

type TopRatedHotelsProps =
  | (TopRatedHotelsPropsBase & { hotels: TopRatedHotel[]; rawItems?: never })
  | (TopRatedHotelsPropsBase & { rawItems: RawItem[]; hotels?: never })

// mapping moved to lib/hotels.ts

export function TopRatedHotels({ title = 'Top Rated Hotels', hotels, rawItems }: TopRatedHotelsProps) {
  const sp = useSearchParams()

  const mappedHotels = useMemo<TopRatedHotel[]>(() => {
    if (Array.isArray(hotels)) return hotels
    if (Array.isArray(rawItems)) return mapAtollToTopRated(rawItems)
    return []
  }, [hotels, rawItems])

  const filteredHotels = useMemo(() => {
    try {
      // Looser defaults to ensure cached data renders even if not fully enriched
      const DEFAULTS = { toa: 'resort', stars: '5', rrMin: 90, rrMax: 99, needDiscount: true, limit: 15 }
      const toa = sp.get('toa') || DEFAULTS.toa
      const stars = sp.get('stars') ?? String(DEFAULTS.stars)
      const rrMin = sp.get('review_ratingmin') ?? String(DEFAULTS.rrMin)
      const rrMax = sp.get('review_ratingmax') ?? String(DEFAULTS.rrMax)
      const minDiscount = sp.get('minDiscount') ?? (DEFAULTS.needDiscount ? '1' : '')
      const limit = sp.get('limit') ?? String(DEFAULTS.limit)

      const wantStars = stars != null && stars !== '' ? Number.parseInt(stars, 10) : undefined
  const min = rrMin != null && rrMin !== '' ? Number.parseFloat(rrMin) : DEFAULTS.rrMin
  const max = rrMax != null && rrMax !== '' ? Number.parseFloat(rrMax) : DEFAULTS.rrMax
      const needDiscount = minDiscount === '1' || minDiscount === 'true'
      const effLimit = limit != null && limit !== '' ? Math.max(1, Math.min(1000, Number.parseInt(limit, 10) || DEFAULTS.limit)) : DEFAULTS.limit

      const hasToa = (h: TopRatedHotel, t?: string) => {
        if (!t) return true
        const lc = t.toLowerCase()
        const val = Array.isArray(h.toa) ? h.toa.map(v => String(v).toLowerCase()) : [String(h.toa ?? '').toLowerCase()]
        return val.some(v => v.includes(lc))
      }

      let out = filterHotelsWithPricedHeroOffer(mappedHotels)
        .filter(h => hasToa(h, toa))
        .filter(h => (wantStars == null ? true : (Number(h.stars || 0) === wantStars)))
        .filter(h => {
          const r = Number(h.qualityReviewRating || 0)
          if (r < min) return false
          if (r > max) return false
          return true
        })
        .filter(h => (needDiscount ? (Number.parseFloat(String(h.discount ?? 0)) > 0) : true))

      // Always sort by review rating descending for Top Rated
      out = out.slice().sort((a, b) => Number(b.qualityReviewRating || 0) - Number(a.qualityReviewRating || 0))

      // Hard limit to 15 on the client side regardless of URL-specified limit
      return out.slice(0, DEFAULTS.limit)
    } catch {
      return mappedHotels.slice(0, 15)
    }
  }, [sp, mappedHotels])

  const topHotels = filteredHotels

  // Scrolling and drag logic replaced by shared Embla Carousel wrapper

  const stars = (stars: number | undefined, qualityRating: number, qualityCount: number) => {
    const fiveScale = qualityRating / 20 // guest rating converted to 0-5 for numeric value
    const guestRatingRounded = Math.round(fiveScale * 10) / 10
    const countStars = stars || 0
    return (
      <div className="flex items-center gap-1" aria-label={`${countStars} star hotel. Guest rating ${guestRatingRounded.toFixed(1)} out of 5`}>
        <div className="flex items-center gap-0.5" aria-hidden>
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              className="w-4 h-4"
              viewBox="0 0 20 20"
              fill={i < countStars ? '#FBBF24' : '#E5E7EB'}>
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <span className="h-5 w-12 rounded bg-black-100 flex items-center justify-center text-xs font-bold text-gray-900 shrink-0">{qualityRating}/100</span>
        <span className="ml-0.5 text-sm font-medium text-gray-700">({Intl.NumberFormat().format(qualityCount)} Reviews)</span>
      </div>
    )
  }

  const discountLabel = (discount: TopRatedHotel['discount']): string | null => {
    if (discount == null) return null
    if (typeof discount === 'number' && !Number.isNaN(discount)) {
      if (discount <= 0) return null
      const pct = Math.round(discount)
      return `${pct}% lower than other sites`
    }
    const n = Number.parseFloat(String(discount))
    if (!Number.isNaN(n)) {
      if (n <= 0) return null
      return `${Math.round(n)}% lower than other sites`
    }
    // fallback to raw string
    return String(discount)
  }

  return (
    <section className="px-4 sm:px-6 lg:px-8 mt-10">
      <div className="max-w-7xl mx-auto relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          {/* Mobile controls are provided by Carousel wrapper */}
        </div>
        {/* Mobile carousel */}
        <div className="md:hidden">
          <Carousel className="" viewportClassName="-mx-1 px-1" containerClassName="gap-4 pb-2" options={{ loop: false, align: 'start', dragFree: true }}>
           {topHotels.map(h => {
              const isTruncated = h.name.length > 37
              const mobileName = isTruncated ? h.name.slice(0, 32) + '...' : h.name
              return (
              <div key={h.id} className="group relative flex-shrink-0 w-[85%] max-w-[320px] bg-white rounded-xl border border-gray-300 overflow-hidden shadow-sm">
                <div className="relative h-48 w-full overflow-hidden">
                  <Image src={h.heroImage} alt={h.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width:768px) 85vw, 340px" />
                  {h.badge && <div className="absolute top-2 left-2 bg-white/90 text-[11px] font-medium px-2 py-1 rounded-full shadow">{h.badge}</div>}
                </div>
                <div className="p-4 ">
                  <h4 className="text-[15px] font-semibold leading-snug text-gray-900 line-clamp-2" title={isTruncated ? h.name : undefined}>{mobileName}</h4>
                  <div className="flex items-center text-[11px] text-gray-600">
                    <span className="truncate">{h.location}</span>
                  </div>
                  {stars(h.stars, h.qualityReviewRating, h.qualityReviewCount)}
                  <div className="mt-5 relative border border-gray-800 rounded-lg p-3 bg-white shadow-sm">
                    {/* Discount badge top-center */}
                    {(() => { const label = discountLabel(h.discount); return label ? (
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-rose-700 text-white text-xxs font-semibold px-2 py-0.5 rounded-full shadow ">
                        {label}
                      </div>
                    ) : 0 })()}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        
                        <div className="pt-2 leading-tight">
                          <div className="text-[11px] text-gray-500">per night</div>
                          <div className="text-lg font-bold text-gray-900">{(h.hero_offer?.currency || h.currency || '$')}{Math.round(Number(h.hero_offer?.price ?? h.price))}</div>
                        </div>
                      </div>
                      {/* Offer flags right */}
                        {(() => {
                        const flags = normalizeOfferFlags(h.hero_offer?.offer_flags)
                        return flags.length ? (
                          <ul className="text-[11px] text-gray-700 space-y-1 text-right ml-2 mt-1">
                          {flags.slice(0, 2).map((label: string, idx: number) => (
                            <li key={idx} className="whitespace-nowrap">✓ {label}</li>
                          ))}
                          </ul>
                        ) : null
                        })()}
                    </div>
                    <div className="mt-1">
                      <Link href={`#`} className="inline-flex w-full items-center justify-center rounded-md bg-gold-100-sm  hover:bg-gold-1000 text-white text-xs font-semibold h-9 px-4 shadow-sm">
                        Check deal <span className="ml-1">→</span>
                      </Link>
                    </div>
                    
                  </div>
                </div>
              </div>
            )})}
          </Carousel>
        </div>
        {/* Desktop carousel */}
        <div className="hidden md:block relative">
          <Carousel className="" viewportClassName="" containerClassName="gap-6 pb-2" options={{ loop: false, align: 'start' }}>
            {topHotels.map(h => {
              const isTruncated = h.name.length > 30
              const desktopName = isTruncated ? h.name.slice(0, 28) + '...' : h.name
              return (
              <div key={h.id} className="group flex-shrink-0 w-[305px] bg-white rounded-xl border border-gray-300 overflow-hidden shadow-sm hover:shadow transition-all">
                <div className="relative h-56 w-full overflow-hidden">
                  <Image src={h.heroImage} alt={h.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(min-width:768px) 340px" />
                  {h.badge && <div className="absolute top-3 left-3 bg-white/90 text-[11px] font-medium px-2 py-1 rounded-full shadow">{h.badge}</div>}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h4 className="text-base font-semibold leading-snug text-gray-900 mb-1" title={isTruncated ? h.name : undefined}>{desktopName}</h4>
                  {stars(h.stars, h.qualityReviewRating, h.qualityReviewCount)}
                  <div className="mt-2 text-[12px] text-gray-600 flex items-center flex-wrap gap-1"><span className="truncate">{h.location}</span></div>
                  <div className="mt-4 relative border border-gray-900 rounded-lg p-4 bg-white shadow-sm">
                    {/* Discount badge top-center */}
                    {(() => { const label = discountLabel(h.discount); return label ? (
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-rose-700 text-white text-discount-xs font-semibold px-2 py-0.5 rounded-full shadow border border-white">
                        {label}
                      </div>
                    ) : null })()}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                       
                        <div className="leading-tight">
                          <div className="text-[11px] text-gray-500">per night</div>
                          <div className="text-xl font-bold text-gray-900">{(h.hero_offer?.currency || h.currency || '$')}{h.hero_offer?.price ?? h.price}</div>
                        </div>
                      </div>
                        {(() => {
                        const flags = normalizeOfferFlags(h.hero_offer?.offer_flags)
                        return flags.length ? (
                          <ul className="text-[12px] text-gray-700 space-y-1 text-right ml-2">
                          {flags.slice(0, 2).map((label: string, idx: number) => (
                            <li key={idx} className="whitespace-nowrap">✓ {label}</li>
                          ))}
                          </ul>
                        ) : null
                        })()}
                    
                    </div>
                    <div className="mt-4">
                      <Link href={`#`} className="inline-flex w-full items-center justify-center rounded-md bg-gold-100-sm  hover:bg-gold-100-hover text-white text-xs font-semibold h-9 px-4 shadow-sm">
                        Check deal <span className="ml-1">→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )})}
          </Carousel>
          {/* Desktop nav buttons are provided by the Carousel wrapper */}
        </div>
      </div>
    </section>
  )
}

export default TopRatedHotels
