"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Flame, Tag, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { HotelOffer } from "@/types/hotels"

const offers: HotelOffer[] = [
  {
    id: "offer-1",
    title: "Maldives Paradise Resort",
    description: "Overwater villa with private pool and butler service. All-inclusive luxury experience.",
    originalPrice: 850,
    discountedPrice: 599,
    discountPercentage: 30,
    image: "/placeholder.svg?height=300&width=400&text=Maldives+Resort",
    location: "North Malé Atoll, Maldives",
    validUntil: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    badge: "Limited Time",
    features: ["Overwater Villa", "Private Pool", "All-Inclusive", "Butler Service"],
  },
  {
    id: "offer-2",
    title: "Bangkok Luxury Suite",
    description: "5-star hotel in the heart of Bangkok with rooftop infinity pool and spa.",
    originalPrice: 320,
    discountedPrice: 199,
    discountPercentage: 38,
    image: "/placeholder.svg?height=300&width=400&text=Bangkok+Hotel",
    location: "Sukhumvit, Bangkok, Thailand",
    validUntil: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    badge: "Flash Sale",
    features: ["City Center", "Rooftop Pool", "Spa Access", "Airport Transfer"],
  },
  {
    id: "offer-3",
    title: "Bali Beach Resort",
    description: "Beachfront resort with traditional Balinese architecture and world-class amenities.",
    originalPrice: 450,
    discountedPrice: 299,
    discountPercentage: 34,
    image: "/placeholder.svg?height=300&width=400&text=Bali+Resort",
    location: "Seminyak, Bali, Indonesia",
    validUntil: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    badge: "Hot Deal",
    features: ["Beachfront", "Traditional Design", "Spa", "Multiple Restaurants"],
  },
  {
    id: "offer-4",
    title: "Tokyo Modern Hotel",
    description: "Contemporary hotel in Shibuya with panoramic city views and premium amenities.",
    originalPrice: 280,
    discountedPrice: 189,
    discountPercentage: 32,
    image: "/placeholder.svg?height=300&width=400&text=Tokyo+Hotel",
    location: "Shibuya, Tokyo, Japan",
    validUntil: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
    badge: "Best Value",
    features: ["City Views", "Modern Design", "Premium Location", "Business Center"],
  },
]

function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = targetDate.getTime() - now

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <div className="flex items-center space-x-2 text-sm">
      <Clock className="w-4 h-4 text-red-500" />
      <span className="text-red-600 font-medium">
        {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
      </span>
    </div>
  )
}

export function LatestOffers() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Flame className="w-6 h-6 text-red-500" />
            <Badge variant="destructive" className="bg-red-500">
              Limited Time Offers
            </Badge>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Hottest Hotel Deals</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don't miss out on these incredible limited-time offers. Book now and save up to 40% on luxury accommodations
            worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {offers.map((offer) => (
            <Card key={offer.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="relative">
                <Image
                  src={offer.image || "/placeholder.svg"}
                  alt={offer.title}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <Badge className="bg-red-500 hover:bg-red-600">
                    <Tag className="w-3 h-3 mr-1" />
                    {offer.discountPercentage}% OFF
                  </Badge>
                </div>
                <div className="absolute top-3 right-3">
                  <Badge variant="secondary" className="bg-white/90 text-gray-900">
                    {offer.badge}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {offer.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      {offer.location}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{offer.description}</p>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {offer.features.slice(0, 2).map((feature) => (
                      <Badge key={feature} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {offer.features.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{offer.features.length - 2} more
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-blue-600">${offer.discountedPrice}</span>
                        <span className="text-sm text-gray-500 line-through ml-2">${offer.originalPrice}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">per night</div>
                      </div>
                    </div>

                    <CountdownTimer targetDate={offer.validUntil} />
                  </div>

                  <Link href={`/hotels/offers/${offer.id}`}>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 group">
                      View Deal
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/hotels/offers">
            <Button
              size="lg"
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white bg-transparent"
            >
              View All Offers
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
