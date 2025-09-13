"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

export function TripTypeCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const tripTypes = [
    {
      id: 1,
      title: "Beach & Resort",
      description: "Relax by the ocean with luxury amenities",
      image: "/placeholder.svg?height=250&width=350",
      count: "2,450+ hotels",
    },
    {
      id: 2,
      title: "City Break",
      description: "Explore vibrant cities and urban attractions",
      image: "/placeholder.svg?height=250&width=350",
      count: "5,680+ hotels",
    },
    {
      id: 3,
      title: "Mountain Retreat",
      description: "Escape to peaceful mountain landscapes",
      image: "/placeholder.svg?height=250&width=350",
      count: "1,230+ hotels",
    },
    {
      id: 4,
      title: "Adventure Travel",
      description: "Perfect base for outdoor activities",
      image: "/placeholder.svg?height=250&width=350",
      count: "890+ hotels",
    },
    {
      id: 5,
      title: "Romantic Getaway",
      description: "Intimate settings for couples",
      image: "/placeholder.svg?height=250&width=350",
      count: "1,560+ hotels",
    },
    {
      id: 6,
      title: "Family Vacation",
      description: "Kid-friendly hotels with family amenities",
      image: "/placeholder.svg?height=250&width=350",
      count: "3,240+ hotels",
    },
  ]

  const itemsPerView = 3
  const maxIndex = Math.max(0, tripTypes.length - itemsPerView)

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
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Find Hotels by Trip Type</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Whether you're planning a romantic getaway or a family adventure, we have the perfect hotel for every type
            of trip.
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
              {tripTypes.map((tripType) => (
                <div key={tripType.id} className="w-1/3 flex-shrink-0 px-3">
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer">
                    <div className="relative">
                      <img
                        src={tripType.image || "/placeholder.svg"}
                        alt={tripType.title}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-xl font-bold mb-1">{tripType.title}</h3>
                        <p className="text-sm text-gray-200 mb-2">{tripType.description}</p>
                        <span className="text-xs bg-white/20 px-2 py-1 rounded">{tripType.count}</span>
                      </div>
                    </div>
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
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? "bg-blue-600" : "bg-gray-300"
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
