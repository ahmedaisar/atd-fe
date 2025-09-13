"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Wifi, Car, Utensils, Waves, Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Hotel {
  id: number
  name: string
  image: string
  rating: number
  reviewCount: number
  price: number
  originalPrice?: number
  location: string
  distance: string
  amenities: string[]
  badges: string[]
  coordinates: { lat: number; lng: number }
}

interface HotelCardProps {
  hotel: Hotel
  viewMode: "list" | "grid"
}

export function HotelCard({ hotel, viewMode }: HotelCardProps) {
  const amenityIcons = {
    "Free WiFi": Wifi,
    Pool: Waves,
    Restaurant: Utensils,
    "Free Parking": Car,
  }

  const discount = hotel.originalPrice
    ? Math.round(((hotel.originalPrice - hotel.price) / hotel.originalPrice) * 100)
    : 0

  if (viewMode === "grid") {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
        <div className="relative">
          <Image
            src={hotel.image || "/placeholder.svg"}
            alt={hotel.name}
            width={300}
            height={200}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <Button variant="ghost" size="sm" className="absolute top-2 right-2 bg-white/80 hover:bg-white">
            <Heart className="w-4 h-4" />
          </Button>
          {discount > 0 && <Badge className="absolute top-2 left-2 bg-red-500 text-white">-{discount}%</Badge>}
        </div>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-lg line-clamp-2">{hotel.name}</h3>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                <MapPin className="w-4 h-4" />
                <span>{hotel.location}</span>
              </div>
              <div className="flex items-center space-x-2 mb-3">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{hotel.rating}</span>
                </div>
                <span className="text-sm text-gray-600">({hotel.reviewCount} reviews)</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mb-3">
              {hotel.badges.slice(0, 2).map((badge) => (
                <Badge key={badge} variant="secondary" className="text-xs">
                  {badge}
                </Badge>
              ))}
            </div>

            <div className="flex items-end justify-between">
              <div>
                {hotel.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">${hotel.originalPrice}</span>
                )}
                <div className="flex items-baseline space-x-1">
                  <span className="text-2xl font-bold text-blue-600">${hotel.price}</span>
                  <span className="text-sm text-gray-600">/night</span>
                </div>
              </div>
              <Link href={`/hotel/${hotel.id}`}>
                <Button className="bg-blue-600 hover:bg-blue-700">Book Now</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="relative md:w-80 flex-shrink-0">
            <Image
              src={hotel.image || "/placeholder.svg"}
              alt={hotel.name}
              width={320}
              height={240}
              className="w-full h-60 md:h-full object-cover"
            />
            <Button variant="ghost" size="sm" className="absolute top-3 right-3 bg-white/80 hover:bg-white">
              <Heart className="w-4 h-4" />
            </Button>
            {discount > 0 && <Badge className="absolute top-3 left-3 bg-red-500 text-white">-{discount}%</Badge>}
          </div>

          <div className="flex-1 p-6">
            <div className="flex flex-col h-full">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{hotel.name}</h3>
                    <div className="flex items-center space-x-2 text-gray-600 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>{hotel.location}</span>
                      <span>•</span>
                      <span>{hotel.distance}</span>
                    </div>
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{hotel.rating}</span>
                      </div>
                      <span className="text-gray-600">({hotel.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {hotel.badges.map((badge) => (
                    <Badge key={badge} variant="secondary">
                      {badge}
                    </Badge>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4 mb-4">
                  {hotel.amenities.slice(0, 4).map((amenity) => {
                    const Icon = amenityIcons[amenity as keyof typeof amenityIcons]
                    return (
                      <div key={amenity} className="flex items-center space-x-1 text-sm text-gray-600">
                        {Icon && <Icon className="w-4 h-4" />}
                        <span>{amenity}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  {hotel.originalPrice && <span className="text-gray-500 line-through">${hotel.originalPrice}</span>}
                  <div className="flex items-baseline space-x-1">
                    <span className="text-3xl font-bold text-blue-600">${hotel.price}</span>
                    <span className="text-gray-600">/night</span>
                  </div>
                  <p className="text-sm text-gray-500">Includes taxes and fees</p>
                </div>
                <Link href={`/hotel/${hotel.id}`}>
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    View Details
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
