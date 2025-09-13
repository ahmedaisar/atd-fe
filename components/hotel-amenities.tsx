import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Wifi,
  Car,
  Utensils,
  Waves,
  Dumbbell,
  SpadeIcon as Spa,
  Users,
  Briefcase,
  Baby,
  Accessibility,
  Shield,
  Headphones,
  Coffee,
  Shirt,
  Plane,
  MapPin,
  Star,
  Clock,
  Building,
} from "lucide-react"

interface HotelAmenitiesProps {
  amenities?: Record<string, string[]>
}

const getAmenityIcon = (amenityName: string) => {
  const name = amenityName.toLowerCase()
  if (name.includes('wifi')) return Wifi
  if (name.includes('restaurant') || name.includes('dining')) return Utensils
  if (name.includes('pool') || name.includes('swimming')) return Waves
  if (name.includes('fitness') || name.includes('gym')) return Dumbbell
  if (name.includes('spa') || name.includes('massage')) return Spa
  if (name.includes('parking') || name.includes('car')) return Car
  if (name.includes('business') || name.includes('meeting')) return Briefcase
  if (name.includes('concierge') || name.includes('front desk')) return Users
  if (name.includes('airport') || name.includes('shuttle')) return Plane
  if (name.includes('laundry') || name.includes('dry cleaning')) return Shirt
  return Star
}

export function HotelAmenities({ amenities }: HotelAmenitiesProps) {
  // Default amenities if none provided
  const defaultAmenities = {
    "Popular": ["Free WiFi", "Swimming Pool", "Fitness Center", "Restaurant", "Room Service"],
    "Business": ["Business Center", "Meeting Rooms", "Conference Facilities", "High-speed Internet"],
    "Wellness": ["Spa", "Sauna", "Massage", "Yoga Classes", "Hot Tub"],
    "Activities": ["Water Sports", "Diving Center", "Snorkeling", "Excursions", "Entertainment"],
    "Services": ["24/7 Front Desk", "Concierge", "Laundry", "Airport Shuttle", "Valet Parking"]
  }

  const amenityData = amenities || defaultAmenities

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Amenities & Services</h2>
        <p className="text-gray-600 mb-6">Enjoy a wide range of facilities and services during your stay</p>
      </div>

      {/* Amenity Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(amenityData).map(([categoryName, categoryAmenities]) => (
          <Card key={categoryName}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                {categoryName === "Popular" && <Star className="w-5 h-5 text-yellow-500" />}
                {categoryName === "Business" && <Briefcase className="w-5 h-5 text-blue-500" />}
                {categoryName === "Wellness" && <Spa className="w-5 h-5 text-green-500" />}
                {categoryName === "Activities" && <Waves className="w-5 h-5 text-cyan-500" />}
                {categoryName === "Services" && <Clock className="w-5 h-5 text-gray-500" />}
                <span>{categoryName}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categoryAmenities.map((amenity) => {
                  const AmenityIcon = getAmenityIcon(amenity)
                  return (
                    <div key={amenity} className="flex items-center space-x-3">
                      <AmenityIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <span className="text-sm">{amenity}</span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Popular Amenities Highlight */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-4 text-blue-900">Most Popular Amenities</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(amenityData.Popular || []).slice(0, 4).map((amenity) => {
              const Icon = getAmenityIcon(amenity)
              return (
                <div key={amenity} className="flex items-center space-x-2 text-blue-800">
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{amenity}</span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}