"use client"
import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ArrowLeft, ArrowRight } from 'lucide-react'

export type CarouselProps = {
  children: React.ReactNode
  className?: string
  viewportClassName?: string
  containerClassName?: string
  showControls?: boolean
  prevLabel?: string
  nextLabel?: string
  options?: any
}

export function Carousel({
  children,
  className,
  viewportClassName,
  containerClassName,
  showControls = true,
  prevLabel = 'Prev',
  nextLabel = 'Next',
  options,
}: CarouselProps) {
  const [viewportRef, emblaApi] = useEmblaCarousel(options)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setCanPrev(emblaApi.canScrollPrev())
    setCanNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
  }, [emblaApi, onSelect])

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  return (
    <div className={className}>
      {showControls && (
        <div className="flex items-center justify-end gap-2 mb-2">
          <button
            aria-label={prevLabel}
            onClick={scrollPrev}
            disabled={!canPrev}
            className="w-8 h-8 rounded-full border border-gray-200 bg-white text-gray-700 shadow disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            aria-label={nextLabel}
            onClick={scrollNext}
            disabled={!canNext}
            className="w-8 h-8 rounded-full border border-gray-200 bg-white text-gray-700 shadow disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      )}
      <div className={"overflow-hidden "+(viewportClassName||"")} ref={viewportRef}>
        <div className={"flex gap-4 "+(containerClassName||"")}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Carousel
