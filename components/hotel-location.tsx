import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, Clock } from "lucide-react"

interface HotelLocationProps {
  hotel: {
    name: string
    address: string
    coordinates: { lat: number; lng: number }
  }
}

const nearbyAttractions = [
  { name: "Lumpini Park", distance: "0.5 km", walkTime: "6 min", type: "Park" },
  { name: "Silom Road", distance: "0.8 km", walkTime: "10 min", type: "Shopping" },
  { name: "BTS Sala Daeng", distance: "0.3 km", walkTime: "4 min", type: "Transport" },
  { name: "Patpong Night Market", distance: "1.2 km", walkTime: "15 min", type: "Entertainment" },
  { name: "Siam Paragon", distance: "2.1 km", walkTime: "25 min", type: "Shopping" },
  { name: "Grand Palace", distance: "4.5 km", walkTime: "8 min by car", type: "Attraction" },
]

const transportOptions = [
  { name: "Suvarnabhumi Airport", distance: "32 km", time: "45 min by car" },
  { name: "Don Mueang Airport", distance: "28 km", time: "40 min by car" },
  { name: "BTS Sala Daeng Station", distance: "0.3 km", time: "4 min walk" },
  { name: "MRT Silom Station", distance: "0.6 km", time: "8 min walk" },
]

export function HotelLocation({ hotel }: HotelLocationProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Location & Nearby</h2>

      {/* Address */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start space-x-3 mb-4">
            <MapPin className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <h3 className="font-semibold mb-1">Hotel Address</h3>
              <p className="text-gray-700">{hotel.address}</p>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Interactive Map</p>
              <p className="text-sm text-gray-500">View hotel location and nearby attractions</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nearby Attractions */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-4">What's Nearby</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nearbyAttractions.map((attraction, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Navigation className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="font-medium">{attraction.name}</div>
                    <div className="text-sm text-gray-600 flex items-center space-x-2">
                      <span>{attraction.distance}</span>
                      <span>•</span>
                      <Clock className="w-3 h-3" />
                      <span>{attraction.walkTime}</span>
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {attraction.type}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Transportation */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-4">Transportation</h3>
          <div className="space-y-3">
            {transportOptions.map((transport, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    {transport.name.includes("Airport") ? "✈️" : "🚇"}
                  </div>
                  <div>
                    <div className="font-medium">{transport.name}</div>
                    <div className="text-sm text-gray-600">{transport.distance}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{transport.time}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
