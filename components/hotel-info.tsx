"use client"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Clock, Shield, Users, Cigarette, Plane, Train, Car, Building, Camera, Utensils, ShoppingBag, TreePine } from "lucide-react"

interface HotelInfoProps {
  hotel: {
    name: string
    rating?: number
    review?: { score: number; count: number }
    location: { 
      city?: string
      country?: string
      distanceFromCenterKm?: number
    }
    address?: string
    description: string
    policies?: {
      cancellation?: string
      children?: string
      pets?: string
      smoking?: string
      checkIn?: string
      checkOut?: string
    }
    nearbyAttractions?: Array<{
      name: string
      distance: string
      type: string
    }>
    transportation?: Array<{
      type: string
      duration: string
      description: string
    }>
  }
}

const getAttractionIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'shopping': return ShoppingBag
    case 'transport': return Train
    case 'cultural': return Building
    case 'food': return Utensils
    case 'nature': return TreePine
    case 'activity': return Camera
    default: return MapPin
  }
}

const getTransportIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'seaplane': return Plane
    case 'speedboat': return Car
    case 'bts skytrain': 
    case 'airport rail link': return Train
    case 'taxi': return Car
    default: return Car
  }
}

export function HotelInfo({ hotel }: HotelInfoProps) {
  const rating = hotel.rating || hotel.review?.score || 0
  const reviewCount = hotel.review?.count || 0
  const locationStr = hotel.location?.city && hotel.location?.country 
    ? `${hotel.location.city}, ${hotel.location.country}`
    : 'Location not specified'

  return (
    <div className="space-y-6">
      {/* Hotel Header */}
      <div id="overview">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{hotel.name}</h1>
            <div className="flex items-center space-x-4 mb-3">
              <div className="flex items-center space-x-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="font-semibold text-lg ml-2">{rating.toFixed(1)}</span>
              </div>
              <span className="text-gray-600">({reviewCount.toLocaleString()} reviews)</span>
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{locationStr}</span>
              {hotel.location?.distanceFromCenterKm && (
                <span className="ml-2 text-sm">• {hotel.location.distanceFromCenterKm} km from center</span>
              )}
            </div>
          </div>
          <div className="flex space-x-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Excellent Location
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Luxury
            </Badge>
          </div>
        </div>

        <p className="text-gray-700 leading-relaxed">{hotel.description}</p>
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="text-sm font-medium">Check-in</div>
            <div className="text-lg font-semibold">{hotel.policies?.checkIn || "15:00"}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="text-sm font-medium">Check-out</div>
            <div className="text-lg font-semibold">{hotel.policies?.checkOut || "12:00"}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Shield className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="text-sm font-medium">Cancellation</div>
            <div className="text-sm text-green-600">Free until 24h</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <div className="text-sm font-medium">Children</div>
            <div className="text-sm text-purple-600">All ages welcome</div>
          </CardContent>
        </Card>
      </div>

      {/* Nearby Attractions */}
      {hotel.nearbyAttractions && hotel.nearbyAttractions.length > 0 && (
        <Card id="nearby-attractions">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <span>Nearby Attractions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hotel.nearbyAttractions.map((attraction, index) => {
                const Icon = getAttractionIcon(attraction.type)
                return (
                  <div key={index} className="flex items-center space-x-3">
                    <Icon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="font-medium">{attraction.name}</div>
                      <div className="text-sm text-gray-600">{attraction.distance} • {attraction.type}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transportation */}
      {hotel.transportation && hotel.transportation.length > 0 && (
        <Card id="transportation">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Train className="w-5 h-5 text-blue-600" />
              <span>Transportation</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {hotel.transportation.map((transport, index) => {
                const Icon = getTransportIcon(transport.type)
                return (
                  <div key={index} className="flex items-start space-x-3">
                    <Icon className="w-5 h-5 text-gray-500 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <div className="font-medium">{transport.type}</div>
                      <div className="text-sm text-gray-600 mb-1">{transport.duration}</div>
                      <div className="text-sm text-gray-500">{transport.description}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Policies */}
      {hotel.policies && (
        <Card id="policies">
          <CardHeader>
            <CardTitle>Important Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hotel.policies.cancellation && (
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <div className="font-medium">Cancellation Policy</div>
                    <div className="text-sm text-gray-600">{hotel.policies.cancellation}</div>
                  </div>
                </div>
              )}
              {hotel.policies.children && (
                <div className="flex items-start space-x-3">
                  <Users className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-medium">Children Policy</div>
                    <div className="text-sm text-gray-600">{hotel.policies.children}</div>
                  </div>
                </div>
              )}
              {hotel.policies.smoking && (
                <div className="flex items-start space-x-3">
                  <Cigarette className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <div className="font-medium">Smoking Policy</div>
                    <div className="text-sm text-gray-600">{hotel.policies.smoking}</div>
                  </div>
                </div>
              )}
              {hotel.policies.pets && (
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 text-orange-600 mt-0.5">🐕</div>
                  <div>
                    <div className="font-medium">Pet Policy</div>
                    <div className="text-sm text-gray-600">{hotel.policies.pets}</div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
