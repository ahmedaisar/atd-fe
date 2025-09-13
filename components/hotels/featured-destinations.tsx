"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star, TrendingUp, ArrowRight, Plane, Camera } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const destinations = [
  {
    id: "maldives",
    name: "Maldives",
    country: "Indian Ocean",
    image: "/placeholder.svg?height=400&width=600&text=Maldives+Paradise",
    hotelCount: 180,
    averagePrice: 450,
    rating: 4.8,
    trending: true,
    description: "Pristine white beaches, crystal-clear waters, and luxury overwater villas",
    highlights: ["Overwater Villas", "World-class Diving", "Luxury Spas", "Private Islands"],
    badge: "Trending",
  },
  {
    id: "bali",
    name: "Bali",
    country: "Indonesia",
    image: "/placeholder.svg?height=400&width=600&text=Bali+Temple",
    hotelCount: 320,
    averagePrice: 180,
    rating: 4.6,
    trending: true,
    description: "Tropical paradise with rich culture, stunning temples, and beautiful beaches",
    highlights: ["Beach Resorts", "Cultural Sites", "Yoga Retreats", "Rice Terraces"],
    badge: "Popular",
  },
  {
    id: "thailand",
    name: "Thailand",
    country: "Southeast Asia",
    image: "/placeholder.svg?height=400&width=600&text=Thailand+Beach",
    hotelCount: 450,
    averagePrice: 120,
    rating: 4.5,
    trending: false,
    description: "Land of smiles with exotic beaches, vibrant cities, and delicious cuisine",
    highlights: ["Street Food", "Island Hopping", "Ancient Temples", "Night Markets"],
    badge: "Best Value",
  },
  {
    id: "dubai",
    name: "Dubai",
    country: "UAE",
    image: "/placeholder.svg?height=400&width=600&text=Dubai+Skyline",
    hotelCount: 280,
    averagePrice: 350,
    rating: 4.7,
    trending: true,
    description: "Modern metropolis with luxury shopping, stunning architecture, and desert adventures",
    highlights: ["Luxury Shopping", "Desert Safari", "Modern Architecture", "Fine Dining"],
    badge: "Luxury",
  },
  {
    id: "japan",
    name: "Japan",
    country: "East Asia",
    image: "/placeholder.svg?height=400&width=600&text=Japan+Cherry+Blossom",
    hotelCount: 380,
    averagePrice: 220,
    rating: 4.6,
    trending: true,
    description: "Perfect blend of ancient traditions and cutting-edge technology",
    highlights: ["Cherry Blossoms", "Traditional Ryokans", "Modern Cities", "Hot Springs"],
    badge: "Cultural",
  },
  {
    id: "greece",
    name: "Greece",
    country: "Europe",
    image: "/placeholder.svg?height=400&width=600&text=Santorini+Sunset",
    hotelCount: 220,
    averagePrice: 280,
    rating: 4.5,
    trending: false,
    description: "Ancient history, stunning islands, and Mediterranean charm",
    highlights: ["Island Hopping", "Ancient History", "Mediterranean Cuisine", "Sunset Views"],
    badge: "Romantic",
  },
]

export function FeaturedDestinations() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Plane className="w-6 h-6 text-blue-600" />
            <Badge className="bg-blue-100 text-blue-800">Featured Destinations</Badge>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Explore Amazing Destinations</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the world's most beautiful destinations with our curated selection of hotels and resorts. From
            tropical paradises to cultural capitals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((destination) => (
            <Card key={destination.id} className="group hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <div className="relative">
                <Image
                  src={destination.image || "/placeholder.svg"}
                  alt={destination.name}
                  width={600}
                  height={400}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                <div className="absolute top-4 left-4">
                  <Badge
                    className={`
                    ${destination.badge === "Trending" ? "bg-red-500" : ""}
                    ${destination.badge === "Popular" ? "bg-orange-500" : ""}
                    ${destination.badge === "Best Value" ? "bg-green-500" : ""}
                    ${destination.badge === "Luxury" ? "bg-purple-500" : ""}
                    ${destination.badge === "Cultural" ? "bg-blue-500" : ""}
                    ${destination.badge === "Romantic" ? "bg-pink-500" : ""}
                  `}
                  >
                    {destination.trending && <TrendingUp className="w-3 h-3 mr-1" />}
                    {destination.badge}
                  </Badge>
                </div>

                <div className="absolute top-4 right-4">
                  <div className="flex items-center space-x-1 bg-white/90 rounded-full px-2 py-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{destination.rating}</span>
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-bold text-white mb-1">{destination.name}</h3>
                  <div className="flex items-center text-white/90 text-sm mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    {destination.country}
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="space-y-4">
                  <p className="text-gray-600 text-sm leading-relaxed">{destination.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {destination.highlights.slice(0, 3).map((highlight) => (
                      <Badge key={highlight} variant="outline" className="text-xs">
                        {highlight}
                      </Badge>
                    ))}
                    {destination.highlights.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{destination.highlights.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500">{destination.hotelCount} hotels</div>
                      <div className="text-lg font-bold text-blue-600">From ${destination.averagePrice}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" className="p-2 bg-transparent">
                        <Camera className="w-4 h-4" />
                      </Button>
                      <Link href={`/search?destination=${destination.id}`}>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          Explore
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/destinations">
            <Button
              size="lg"
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white bg-transparent"
            >
              View All Destinations
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
