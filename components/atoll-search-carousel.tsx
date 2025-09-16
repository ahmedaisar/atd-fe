"use client";
import Image from 'next/image'
import { useRef, useEffect, useState, useMemo } from 'react'
import atollLabels from '@/data/generated/atolls.json'

// Transform imported labels into objects with placeholder images (can be refined later)
const ATOLL_TYPES = (atollLabels as string[]).slice(0, 30).map((label, idx) => ({
  key: `atoll-${idx}`,
  label,
  img: '/images/atoll-types/castle.jpg' // TODO: map to real image per atoll
}))

export function AtollSearchCarousel() {
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const update = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 8)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8)
  }

  useEffect(() => {
    update()
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => { el.removeEventListener('scroll', update); window.removeEventListener('resize', update) }
  }, [])

  const scrollByAmount = (dir: 1 | -1) => {
    const el = scrollRef.current
    if (!el) return
    const amt = Math.round(el.clientWidth * 0.6) * dir
    el.scrollBy({ left: amt, behavior: 'smooth' })
  }

  return (
    <section className="px-4 sm:px-6 lg:px-8 mt-8">
      <div className="max-w-7xl mx-auto bg-white rounded-md md:rounded-lg  relative">
        <h3 className="text-xl sm:text-m font-semibold text-gray-900 mb-3 sm:mb-4">Discover Maldives by Atolls</h3>
        {/* Gradient edges */}
        <div className="pointer-events-none absolute left-0 top-10 bottom-0 w-6 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute right-0 top-10 bottom-0 w-6 bg-gradient-to-l from-white to-transparent" />
        <div className="relative ">
          {/* Scroll container */}
          <div ref={scrollRef} className="flex gap-3 lg:gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-1 pr-1 px-1 -mx-1 lg:px-4 lg:-mx-4">
            {ATOLL_TYPES.map(type => (
              <button key={type.key} className="group relative flex-shrink-0 w-[138px] sm:w-[150px] md:w-[180px] lg:w-[210px] xl:w-[220px] snap-start outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-2xl overflow-hidden">
                <div className="relative h-[178px] sm:h-[190px] md:h-[210px] lg:h-[230px] xl:h-[240px] w-full rounded-2xl overflow-hidden">
                  <Image
                    src={type.img}
                    alt={type.label}
                    fill
                    sizes="(max-width:640px) 138px, (max-width:768px) 150px, (max-width:1024px) 180px, (max-width:1280px) 210px, 220px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-black/10 group-hover:ring-black/20" />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/10 to-black/40" />
                  <div className="absolute left-2 right-2 bottom-2">
                    <span className="text-[11px] md:text-[12px] font-semibold text-white drop-shadow-sm leading-tight block truncate">{type.label}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
          {/* Nav buttons (desktop) */}
          <div className="hidden md:block">
            {canScrollLeft && (
              <button
                aria-label="Scroll left"
                onClick={() => scrollByAmount(-1)}
                className="absolute -left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow rounded-full w-8 h-8 flex items-center justify-center border border-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              </button>
            )}
            {canScrollRight && (
              <button
                aria-label="Scroll right"
                onClick={() => scrollByAmount(1)}
                className="absolute -right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow rounded-full w-8 h-8 flex items-center justify-center border border-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default AtollSearchCarousel
