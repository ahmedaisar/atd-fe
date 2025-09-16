"use client"
import Image from 'next/image'
import { useRef, useEffect, useState, useMemo } from 'react'
import Link from 'next/link'

export interface TopRatedHotel {
  id: string
  name: string
  slug: string
  heroImage: string
  hotelStars?: number // integer stars from dataset
  qualityReviewRating: number // 0-100 scale original quality.review_rating
  qualityReviewCount: number
  location: string
  price: number // nightly price
  currency?: string
  badge?: string
}

interface TopRatedHotelsProps {
  title?: string
  hotels: TopRatedHotel[]
}

export function TopRatedHotels({ title = 'Top Rated Hotels', hotels }: TopRatedHotelsProps) {
  const mobileRef = useRef<HTMLDivElement>(null)
  const desktopRef = useRef<HTMLDivElement>(null)
  const [mCanLeft, setMCanLeft] = useState(false)
  const [mCanRight, setMCanRight] = useState(false)
  const [dCanLeft, setDCanLeft] = useState(false)
  const [dCanRight, setDCanRight] = useState(false)

  const topHotels = useMemo(() => hotels.slice(0, 15), [hotels])

  const update = () => {
    const m = mobileRef.current
    if (m) {
      setMCanLeft(m.scrollLeft > 8)
      setMCanRight(m.scrollLeft + m.clientWidth < m.scrollWidth - 8)
    }
    const d = desktopRef.current
    if (d) {
      setDCanLeft(d.scrollLeft > 8)
      setDCanRight(d.scrollLeft + d.clientWidth < d.scrollWidth - 8)
    }
  }
  useEffect(() => {
    update()
    const m = mobileRef.current
    const d = desktopRef.current
    m?.addEventListener('scroll', update, { passive: true })
    d?.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    // Enable drag / swipe scrolling for both mobile & desktop containers
    const attachDrag = (el: HTMLDivElement | null) => {
      if (!el) return () => {}
      let isDown = false
      let startX = 0
      let scrollStart = 0
      let moved = false

      const pointerDown = (e: PointerEvent) => {
        isDown = true
        moved = false
        startX = e.clientX
        scrollStart = el.scrollLeft
        el.setPointerCapture(e.pointerId)
        el.classList.add('drag-active')
      }
      const pointerMove = (e: PointerEvent) => {
        if (!isDown) return
        const delta = e.clientX - startX
        if (Math.abs(delta) > 4) moved = true
        el.scrollLeft = scrollStart - delta
      }
      const pointerUp = (e: PointerEvent) => {
        if (!isDown) return
        isDown = false
        el.releasePointerCapture(e.pointerId)
        setTimeout(() => { moved = false }, 0)
        el.classList.remove('drag-active')
      }
      const pointerLeave = (e: PointerEvent) => {
        if (!isDown) return
        isDown = false
        try { el.releasePointerCapture(e.pointerId) } catch {}
        el.classList.remove('drag-active')
      }
      const clickBlock = (e: MouseEvent) => {
        if (moved) {
          e.preventDefault()
          e.stopPropagation()
        }
      }
      el.addEventListener('pointerdown', pointerDown)
      el.addEventListener('pointermove', pointerMove)
      el.addEventListener('pointerup', pointerUp)
      el.addEventListener('pointerleave', pointerLeave)
      el.addEventListener('click', clickBlock, true)
      return () => {
        el.removeEventListener('pointerdown', pointerDown)
        el.removeEventListener('pointermove', pointerMove)
        el.removeEventListener('pointerup', pointerUp)
        el.removeEventListener('pointerleave', pointerLeave)
        el.removeEventListener('click', clickBlock, true)
      }
    }
    const detachM = attachDrag(m)
    const detachD = attachDrag(d)
    return () => { m?.removeEventListener('scroll', update); d?.removeEventListener('scroll', update); window.removeEventListener('resize', update) }
  }, [])

  const scroll = (ref: React.RefObject<HTMLDivElement | null>, dir: 1 | -1) => {
    const el = ref.current
    if (!el) return
    el.scrollBy({ left: dir * Math.round(el.clientWidth * 0.7), behavior: 'smooth' })
  }

  const stars = (hotelStars: number | undefined, qualityRating: number, qualityCount: number) => {
    const fiveScale = qualityRating / 20 // guest rating converted to 0-5 for numeric value
    const guestRatingRounded = Math.round(fiveScale * 10) / 10
    const countStars = hotelStars || 0
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
        <span className="h-5 w-12 rounded bg-black-100 flex items-center justify-center text-xs font-bold text-white shrink-0">{qualityRating}/100</span>
        <span className="ml-0.5 text-sm font-medium text-gray-700">({Intl.NumberFormat().format(qualityCount)} Reviews)</span>
      </div>
    )
  }

  return (
    <section className="px-4 sm:px-6 lg:px-8 mt-10">
      <div className="max-w-7xl mx-auto relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <div className="flex gap-2 md:hidden">
            <button aria-label="Scroll left" onClick={() => scroll(mobileRef, -1)} disabled={!mCanLeft} className="w-9 h-9 rounded-full border border-gray-200 bg-white shadow flex items-center justify-center disabled:opacity-30"><span className="sr-only">Prev</span><svg className="w-4 h-4" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg></button>
            <button aria-label="Scroll right" onClick={() => scroll(mobileRef, 1)} disabled={!mCanRight} className="w-9 h-9 rounded-full border border-gray-200 bg-white shadow flex items-center justify-center disabled:opacity-30"><span className="sr-only">Next</span><svg className="w-4 h-4" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></button>
          </div>
        </div>
        {/* Mobile carousel */}
        <div className="md:hidden" ref={mobileRef}>
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 -mx-1 px-1 scrollbar-hide select-none cursor-grab active:cursor-grabbing">
            {topHotels.map(h => (
              <div key={h.id} className="group relative flex-shrink-0 w-[85%] max-w-[340px] snap-start bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="relative h-48 w-full overflow-hidden">
                  <Image src={h.heroImage} alt={h.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width:768px) 85vw, 340px" />
                  {h.badge && <div className="absolute top-2 left-2 bg-white/90 text-[11px] font-medium px-2 py-1 rounded-full shadow">{h.badge}</div>}
                </div>
                <div className="p-4 space-y-2">
                  <h4 className="text-[15px] font-semibold leading-snug text-gray-900 line-clamp-2">{h.name}</h4>
                  <div className="flex items-center text-[11px] text-gray-600">
                    <span className="truncate">{h.location}</span>
                  </div>
                  {stars(h.hotelStars, h.qualityReviewRating, h.qualityReviewCount)}
                  <div className="mt-2 border rounded-lg p-3 flex items-end justify-between bg-gray-50">
                    <div>
                      <div className="text-[11px] text-gray-500">from</div>
                      <div className="text-lg font-bold text-gray-900">{h.currency || '$'}{h.price}</div>
                      <div className="text-[10px] text-gray-500">per night</div>
                    </div>
                    <Link href={`/hotels/${h.slug}`} className="inline-flex items-center text-xs font-medium text-blue-600 hover:text-blue-700">View<span className="ml-1">→</span></Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Desktop carousel */}
        <div className="hidden md:block relative">
          {/* Gradient edges */}
          <div ref={desktopRef} className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2 select-none cursor-grab active:cursor-grabbing">
            {topHotels.map(h => {
              const isTruncated = h.name.length > 37
              const desktopName = isTruncated ? h.name.slice(0, 34) + '...' : h.name
              return (
              <div key={h.id} className="group snap-start flex-shrink-0 w-[340px] bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow transition-all">
                <div className="relative h-56 w-full overflow-hidden">
                  <Image src={h.heroImage} alt={h.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(min-width:768px) 340px" />
                  {h.badge && <div className="absolute top-3 left-3 bg-white/90 text-[11px] font-medium px-2 py-1 rounded-full shadow">{h.badge}</div>}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h4 className="text-base font-semibold leading-snug text-gray-900 mb-1" title={isTruncated ? h.name : undefined}>{desktopName}</h4>
                  {stars(h.hotelStars, h.qualityReviewRating, h.qualityReviewCount)}
                  <div className="mt-2 text-[12px] text-gray-600 flex items-center flex-wrap gap-1"><span className="truncate">{h.location}</span></div>
                  <div className="mt-4 border border-gray-300 rounded-lg p-4 bg-gray-50 flex items-end justify-between">
                    <div>
                      <div className="text-[11px] text-gray-500">from</div>
                      <div className="text-xl font-bold text-gray-900">{h.currency || '$'}{h.price}</div>
                      <div className="text-[11px] text-gray-500">per night</div>
                    </div>
                    <Link href={`/hotels/${h.slug}`} className="inline-flex items-center text-xs font-medium text-blue-600 hover:text-blue-700">View<span className="ml-1">→</span></Link>
                  </div>
                </div>
              </div>
            )})}
          </div>
          {/* Desktop nav buttons */}
          <div className="hidden md:flex absolute -top-14 right-0 gap-2 z-20">
            <button aria-label="Scroll left" onClick={() => scroll(desktopRef, -1)} disabled={!dCanLeft} className="w-9 h-9 rounded-full border border-gray-200 bg-white shadow flex items-center justify-center disabled:opacity-30"><svg className="w-4 h-4" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg></button>
            <button aria-label="Scroll right" onClick={() => scroll(desktopRef, 1)} disabled={!dCanRight} className="w-9 h-9 rounded-full border border-gray-200 bg-white shadow flex items-center justify-center disabled:opacity-30"><svg className="w-4 h-4" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TopRatedHotels
