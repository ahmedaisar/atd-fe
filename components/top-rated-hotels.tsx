"use client";
import Image from 'next/image'
import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'

// Types
export interface TopRatedHotel {
  id: string
  name: string
  rating: number // e.g. 8.9
  ratingLabel: string // e.g. Excellent
  reviewsCount: number // e.g. 3097
  location: string // "Philadelphia, USA"
  image: string
  dealBadge?: string // e.g. "11% lower than other sites"
  provider?: string // e.g. "Sofitel"
  freeCancellation?: boolean
  price: number // current price
  dateRange?: string // e.g. "Nov 5 - Nov 6"
  ctaHref?: string
}

interface Props {
  title?: string
  seeMoreHref?: string
  hotels: TopRatedHotel[]
}

export function TopRatedHotels({ title = 'Hot hotel deals right now', seeMoreHref = '#', hotels }: Props) {
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(false)

  const update = () => {
    const el = scrollRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 8)
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8)
  }
  useEffect(() => {
    update();
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => { el.removeEventListener('scroll', update); window.removeEventListener('resize', update) }
  }, [])

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir * Math.round(el.clientWidth * 0.75), behavior: 'smooth' })
  }

  return (
    <section className="px-4 sm:px-6 lg:px-8 mt-10">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <Link href={seeMoreHref} className="text-sm text-blue-600 hover:underline flex items-center gap-1">
              See more deals <span aria-hidden>→</span>
            </Link>
          </div>

          {/* Desktop Grid (>= md) */}
          <div className="hidden md:grid grid-cols-3 gap-4">
            {hotels.slice(0, 3).map(h => (
              <div key={h.id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col">
                {/* Image */}
                <div className="relative w-full h-40 overflow-hidden">
                  <Image src={h.image} alt={h.name} fill className="object-cover" />
                </div>
                {/* Content */}
                <div className="p-3 space-y-2 flex flex-col flex-1">
                  <div>
                    <div className="text-sm font-semibold text-gray-900 truncate">{h.name}</div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="inline-flex items-center rounded px-2 py-0.5 bg-green-600 text-white text-xs font-bold">{h.rating.toFixed(1)}</span>
                      <span className="text-xs text-gray-700 font-medium">{h.ratingLabel}</span>
                      <span className="text-[10px] text-gray-500">({h.reviewsCount.toLocaleString()})</span>
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-xs text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-6-4.35-9-9A9 9 0 0 1 12 3a9 9 0 0 1 9 9c-3 4.65-9 9-9 9Z" /></svg>
                      {h.location}
                    </div>
                  </div>
                  {h.dealBadge && (
                    <div className="inline-block rounded bg-red-600 text-white text-[10px] font-semibold px-2 py-0.5">{h.dealBadge}</div>
                  )}
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-700">
                    {h.provider && <span>{h.provider}</span>}
                    {h.freeCancellation && <span className="flex items-center gap-1">✔ <span>Free cancellation</span></span>}
                  </div>
                  <div className="mt-auto flex items-end justify-between">
                    <div>
                      <div className="text-xl font-bold text-gray-900">${h.price}</div>
                      <div className="text-xs text-gray-500 -mt-0.5">per night</div>
                    </div>
                    {h.dateRange && <div className="text-xs text-gray-500 text-right">{h.dateRange}</div>}
                  </div>
                  <Link href={h.ctaHref || '#'} className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded flex items-center justify-center gap-1">
                    Check deal <span aria-hidden>→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Carousel (< md) */}
          <div className="md:hidden relative">
            <div className="flex items-center justify-end gap-2 mb-2">
              <button aria-label="Prev" onClick={() => scrollBy(-1)} disabled={!canLeft} className="w-8 h-8 rounded-full border border-gray-200 bg-white text-gray-700 shadow disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center">◀</button>
              <button aria-label="Next" onClick={() => scrollBy(1)} disabled={!canRight} className="w-8 h-8 rounded-full border border-gray-200 bg-white text-gray-700 shadow disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center">▶</button>
            </div>
            <div ref={scrollRef} className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {hotels.map(h => (
                <div key={h.id} className="snap-start w-[85%] max-w-[330px] bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition overflow-hidden flex-shrink-0 flex flex-col">
                  <div className="relative w-full h-40 overflow-hidden">
                    <Image src={h.image} alt={h.name} fill className="object-cover" />
                  </div>
                  <div className="p-3 space-y-2 flex flex-col flex-1">
                    <div>
                      <div className="text-sm font-semibold text-gray-900 truncate">{h.name}</div>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="inline-flex items-center rounded px-2 py-0.5 bg-green-600 text-white text-xs font-bold">{h.rating.toFixed(1)}</span>
                        <span className="text-xs text-gray-700 font-medium">{h.ratingLabel}</span>
                        <span className="text-[10px] text-gray-500">({h.reviewsCount.toLocaleString()})</span>
                      </div>
                      <div className="mt-1 flex items-center gap-1 text-xs text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-6-4.35-9-9A9 9 0 0 1 12 3a9 9 0 0 1 9 9c-3 4.65-9 9-9 9Z" /></svg>
                        {h.location}
                      </div>
                    </div>
                    {h.dealBadge && (
                      <div className="inline-block rounded bg-red-600 text-white text-[10px] font-semibold px-2 py-0.5">{h.dealBadge}</div>
                    )}
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-700">
                      {h.provider && <span>{h.provider}</span>}
                      {h.freeCancellation && <span className="flex items-center gap-1">✔ <span>Free cancellation</span></span>}
                    </div>
                    <div className="mt-auto flex items-end justify-between">
                      <div>
                        <div className="text-xl font-bold text-gray-900">${h.price}</div>
                        <div className="text-xs text-gray-500 -mt-0.5">per night</div>
                      </div>
                      {h.dateRange && <div className="text-xs text-gray-500 text-right">{h.dateRange}</div>}
                    </div>
                    <Link href={h.ctaHref || '#'} className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded flex items-center justify-center gap-1">
                      Check deal <span aria-hidden>→</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TopRatedHotels
