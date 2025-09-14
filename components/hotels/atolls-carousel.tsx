"use client"

import React, { useState, useEffect } from "react"
import "keen-slider/keen-slider.min.css"
import { useKeenSlider } from "keen-slider/react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react"
import { extractAtollInfo } from "@/lib/atoll-utils"

export function AtollsCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [atolls, setAtolls] = useState<{ name: string; hotelCount: number; image?: string; highlights?: string[] }[]>([])

  // Always call useKeenSlider at the top level, but only enable when atolls are loaded
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    atolls.length > 0
      ? {
          initial: 0,
          slideChanged(s) {
            setCurrentSlide(s.track.details.rel)
          },
          breakpoints: {
            "(max-width: 640px)": {
              slides: { perView: 1, spacing: 12 },
            },
            "(max-width: 1024px)": {
              slides: { perView: 1, spacing: 16 },
            },
          },
          slides: { perView: 3, spacing: 24 },
          drag: true,
          loop: false,
        }
      : undefined
  )

  useEffect(() => {
    async function fetchAtolls() {
      try {
        const res = await fetch("/api/search/hotels")
        const data = await res.json()
        const hotels = data?.data?.records || []
        setAtolls(extractAtollInfo(hotels))
      } catch (e) {
        setAtolls([])
      }
    }
    fetchAtolls()
  }, [])


  // Helper to get perView based on window width (matches keen-slider breakpoints)
  const getPerView = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth <= 640) return 1
      if (window.innerWidth <= 1024) return 1
    }
    return 3
  }

  const [perView, setPerView] = useState(3)
  useEffect(() => {
    const updatePerView = () => setPerView(getPerView())
    updatePerView()
    window.addEventListener("resize", updatePerView)
    return () => window.removeEventListener("resize", updatePerView)
  }, [])

  const maxIndex = Math.max(0, atolls.length - perView)
  const nextSlide = () => {
    if (instanceRef && instanceRef.current) {
      instanceRef.current.next()
    }
  }
  const prevSlide = () => {
    if (instanceRef && instanceRef.current) {
      instanceRef.current.prev()
    }
  }

  if (atolls.length === 0) {
    return null;
  }
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-teal-100 text-teal-700 border-teal-200">🏝️ Maldives Collection</Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Discover Paradise by Atoll</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Each atoll offers unique experiences, from vibrant coral reefs to luxury overwater bungalows. Find your
            perfect island escape.
          </p>
        </div>

        <div className="relative">
          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg hover:bg-gray-50"
            onClick={prevSlide}
            disabled={currentSlide === 0}
            aria-label="Previous"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg hover:bg-gray-50"
            onClick={nextSlide}
            disabled={currentSlide >= maxIndex}
            aria-label="Next"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>

          {/* Carousel Container */}
          <div className="overflow-visible mx-0 sm:mx-6 lg:mx-12">
            <div ref={sliderRef} className="keen-slider">
              {atolls.map((atoll, idx) => (
                <div key={idx} className="keen-slider__slide px-2 sm:px-3 lg:px-4">
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer border-0 bg-white/80 backdrop-blur-sm h-[480px] flex flex-col">
                    <div className="relative h-56">
                      <img
                        src={atoll.image || "/placeholder.svg"}
                        alt={atoll.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-white/90 text-gray-800">{atoll.hotelCount} hotels</Badge>
                      </div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-xl font-bold mb-1">{atoll.name}</h3>
                      </div>
                    </div>

                    <CardContent className="p-6 flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span className="text-sm">Maldives</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {(Array.isArray(atoll.highlights) ? atoll.highlights : []).map((highlight, index) => (
                          <Badge key={index} variant="secondary" className="text-xs bg-teal-50 text-teal-700 whitespace-nowrap">
                            {highlight.toUpperCase()}
                          </Badge>
                        ))}
                      </div>

                      <div className="mt-auto">
                        <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">Explore {atoll.name}</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: Math.max(1, atolls.length - perView + 1) }).map((_, idx) => (
              <button
                key={idx}
                className={`w-3 h-3 rounded-full transition-colors ${
                  idx === currentSlide ? "bg-teal-600" : "bg-gray-300"
                }`}
                onClick={() => instanceRef && instanceRef.current && instanceRef.current.moveToIdx(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
