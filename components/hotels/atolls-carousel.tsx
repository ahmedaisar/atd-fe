"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react"
import { useState } from "react"

export function AtollsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const atolls = [
    {
      id: 1,
      name: "North Malé Atoll",
      description: "Home to the capital and main airport",
      hotelCount: 45,
      averagePrice: 299,
      image: "/placeholder.svg?height=300&width=400",
      highlights: ["Airport Access", "Capital City", "Luxury Resorts"],
    },
    {
      id: 2,
      name: "South Malé Atoll",
      description: "Perfect blend of luxury and accessibility",
      hotelCount: 32,
      averagePrice: 399,
      image: "/placeholder.svg?height=300&width=400",
      highlights: ["Pristine Beaches", "Water Sports", "Spa Resorts"],
    },
    {
      id: 3,
      name: "Ari Atoll",
      description: "Famous for whale shark encounters",
      hotelCount: 28,
      averagePrice: 459,
      image: "/placeholder.svg?height=300&width=400",
      highlights: ["Whale Sharks", "Diving", "Overwater Villas"],
    },
    {
      id: 4,
      name: "Baa Atoll",
      description: "UNESCO Biosphere Reserve",
      hotelCount: 18,
      averagePrice: 599,
      image: "/placeholder.svg?height=300&width=400",
      highlights: ["UNESCO Site", "Manta Rays", "Eco-Luxury"],
    },
    {
      id: 5,
      name: "Lhaviyani Atoll",
      description: "Untouched natural beauty",
      hotelCount: 12,
      averagePrice: 699,
      image: "/placeholder.svg?height=300&width=400",
      highlights: ["Secluded", "Pristine Reefs", "Exclusive"],
    },
  ]

  const itemsPerView = 3
  const maxIndex = Math.max(0, atolls.length - itemsPerView)

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
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
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg hover:bg-gray-50"
            onClick={nextSlide}
            disabled={currentIndex === maxIndex}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>

          {/* Carousel Container */}
          <div className="overflow-hidden mx-12">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
            >
              {atolls.map((atoll) => (
                <div key={atoll.id} className="w-1/3 flex-shrink-0 px-3">
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer border-0 bg-white/80 backdrop-blur-sm">
                    <div className="relative">
                      <img
                        src={atoll.image || "/placeholder.svg"}
                        alt={atoll.name}
                        className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-white/90 text-gray-800">{atoll.hotelCount} hotels</Badge>
                      </div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-xl font-bold mb-1">{atoll.name}</h3>
                        <p className="text-sm text-gray-200">{atoll.description}</p>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span className="text-sm">Maldives</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm text-gray-600">From</span>
                          <div className="text-xl font-bold text-teal-600">${atoll.averagePrice}</div>
                          <span className="text-xs text-gray-500">per night</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {atoll.highlights.map((highlight, index) => (
                          <Badge key={index} variant="secondary" className="text-xs bg-teal-50 text-teal-700">
                            {highlight}
                          </Badge>
                        ))}
                      </div>

                      <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">Explore {atoll.name}</Button>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? "bg-teal-600" : "bg-gray-300"
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
