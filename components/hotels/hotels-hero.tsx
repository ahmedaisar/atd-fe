"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Calendar, Users, TrendingUp, Award, Globe } from "lucide-react"
import Image from "next/image"

export function HotelsHero() {
  const stats = [
    { label: "Hotels Worldwide", value: "2.8M+", icon: Globe },
    { label: "Countries", value: "220+", icon: MapPin },
    { label: "Happy Guests", value: "50M+", icon: Users },
    { label: "Awards Won", value: "150+", icon: Award },
  ]

  return (
    <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-teal-600 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black/10">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1200&text=Hotel+Background')] bg-cover bg-center opacity-20" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                <TrendingUp className="w-4 h-4 mr-2" />
                Best Deals Available
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Discover Your Perfect
                <span className="block text-yellow-300">Hotel Stay</span>
              </h1>
              <p className="text-xl text-blue-100 max-w-lg">
                From luxury resorts to cozy boutique hotels, find the perfect accommodation for your next adventure with
                unbeatable prices and exclusive deals.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8">
                <Search className="w-5 h-5 mr-2" />
                Search Hotels
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
              >
                <Calendar className="w-5 h-5 mr-2" />
                View Deals
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <stat.icon className="w-8 h-8 mx-auto mb-2 text-yellow-300" />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-blue-100">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/placeholder.svg?height=600&width=500&text=Luxury+Hotel"
                alt="Luxury Hotel"
                width={500}
                height={600}
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <Card className="bg-white/95 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">Featured Deal</h3>
                        <p className="text-sm text-gray-600">Luxury Resort in Maldives</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">$299</div>
                        <div className="text-sm text-gray-500 line-through">$450</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
