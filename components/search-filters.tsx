"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Star, Wifi, Car, Utensils, Waves, Dumbbell, X } from "lucide-react"

export function SearchFilters() {
  const [priceRange, setPriceRange] = useState([50, 500])
  const [selectedRating, setSelectedRating] = useState<number[]>([])
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])

  const amenities = [
    { id: "wifi", label: "Free WiFi", icon: Wifi, count: 1247 },
    { id: "parking", label: "Free Parking", icon: Car, count: 892 },
    { id: "restaurant", label: "Restaurant", icon: Utensils, count: 654 },
    { id: "pool", label: "Swimming Pool", icon: Waves, count: 423 },
    { id: "gym", label: "Fitness Center", icon: Dumbbell, count: 321 },
  ]

  const propertyTypes = [
    { id: "hotel", label: "Hotel", count: 1543 },
    { id: "resort", label: "Resort", count: 234 },
    { id: "apartment", label: "Apartment", count: 456 },
    { id: "villa", label: "Villa", count: 123 },
    { id: "hostel", label: "Hostel", count: 89 },
  ]

  const districts = [
    { id: "sukhumvit", label: "Sukhumvit", count: 456 },
    { id: "silom", label: "Silom", count: 234 },
    { id: "khao-san", label: "Khao San Road", count: 123 },
    { id: "chatuchak", label: "Chatuchak", count: 89 },
    { id: "siam", label: "Siam", count: 167 },
  ]

  const toggleAmenity = (amenityId: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenityId) ? prev.filter((id) => id !== amenityId) : [...prev, amenityId],
    )
  }

  const toggleRating = (rating: number) => {
    setSelectedRating((prev) => (prev.includes(rating) ? prev.filter((r) => r !== rating) : [...prev, rating]))
  }

  return (
    <div className="space-y-6">
      {/* Active Filters */}
      {(selectedAmenities.length > 0 || selectedRating.length > 0) && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Active Filters</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedAmenities([])
                  setSelectedRating([])
                }}
                className="text-blue-600 hover:text-blue-700"
              >
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {selectedAmenities.map((amenityId) => {
                const amenity = amenities.find((a) => a.id === amenityId)
                return (
                  <Badge key={amenityId} variant="secondary" className="flex items-center gap-1">
                    {amenity?.label}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => toggleAmenity(amenityId)} />
                  </Badge>
                )
              })}
              {selectedRating.map((rating) => (
                <Badge key={rating} variant="secondary" className="flex items-center gap-1">
                  {rating}+ Stars
                  <X className="w-3 h-3 cursor-pointer" onClick={() => toggleRating(rating)} />
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Price Range */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Price per night</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Slider value={priceRange} onValueChange={setPriceRange} max={1000} min={0} step={10} className="w-full" />
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}+</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Star Rating */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Star Rating</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-3">
                <Checkbox
                  id={`rating-${rating}`}
                  checked={selectedRating.includes(rating)}
                  onCheckedChange={() => toggleRating(rating)}
                />
                <label htmlFor={`rating-${rating}`} className="flex items-center space-x-1 cursor-pointer flex-1">
                  <div className="flex">
                    {Array.from({ length: rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    {Array.from({ length: 5 - rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-gray-300" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-auto">({Math.floor(Math.random() * 500) + 100})</span>
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Property Type */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Property Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {propertyTypes.map((type) => (
              <div key={type.id} className="flex items-center space-x-3">
                <Checkbox id={`type-${type.id}`} />
                <label htmlFor={`type-${type.id}`} className="flex items-center justify-between cursor-pointer flex-1">
                  <span className="text-sm">{type.label}</span>
                  <span className="text-sm text-gray-500">({type.count})</span>
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Amenities */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Amenities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {amenities.map((amenity) => {
              const Icon = amenity.icon
              return (
                <div key={amenity.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={`amenity-${amenity.id}`}
                    checked={selectedAmenities.includes(amenity.id)}
                    onCheckedChange={() => toggleAmenity(amenity.id)}
                  />
                  <label
                    htmlFor={`amenity-${amenity.id}`}
                    className="flex items-center space-x-2 cursor-pointer flex-1"
                  >
                    <Icon className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{amenity.label}</span>
                    <span className="text-sm text-gray-500 ml-auto">({amenity.count})</span>
                  </label>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Districts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Districts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {districts.map((district) => (
              <div key={district.id} className="flex items-center space-x-3">
                <Checkbox id={`district-${district.id}`} />
                <label
                  htmlFor={`district-${district.id}`}
                  className="flex items-center justify-between cursor-pointer flex-1"
                >
                  <span className="text-sm">{district.label}</span>
                  <span className="text-sm text-gray-500">({district.count})</span>
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
