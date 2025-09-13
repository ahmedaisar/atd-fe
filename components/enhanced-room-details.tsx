"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import {
  Maximize,
  Users,
  Bed,
  Eye,
  Map,
  Camera,
  Play,
  Wifi,
  Coffee,
  Car,
  Accessibility,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react"
import Image from "next/image"
import type { EnhancedRoomDetails as RoomDetails } from "@/types/enhanced-pricing"

interface RoomDetailsProps {
  room: RoomDetails
}

export function RoomDetailsComponent({ room }: RoomDetailsProps) {
  const [selectedImageCategory, setSelectedImageCategory] = useState<keyof typeof room.images>("main")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [showVirtualTour, setShowVirtualTour] = useState(false)

  const currentImages = room.images[selectedImageCategory]

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % currentImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + currentImages.length) % currentImages.length)
  }

  const getAmenityIcon = (iconName: string) => {
    const icons: { [key: string]: any } = {
      wifi: Wifi,
      coffee: Coffee,
      car: Car,
      accessibility: Accessibility,
    }
    const IconComponent = icons[iconName] || Star
    return <IconComponent className="w-4 h-4" />
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{room.name}</CardTitle>
          <div className="flex space-x-2">
            {room.virtualTour && (
              <Button variant="outline" size="sm" onClick={() => setShowVirtualTour(true)}>
                <Play className="w-4 h-4 mr-2" />
                Virtual Tour
              </Button>
            )}
            {room.floorPlan && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Map className="w-4 h-4 mr-2" />
                    Floor Plan
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <Image
                    src={room.floorPlan || "/placeholder.svg"}
                    alt="Floor Plan"
                    width={800}
                    height={600}
                    className="w-full h-auto"
                  />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="images" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="amenities">Amenities</TabsTrigger>
            <TabsTrigger value="availability">Availability</TabsTrigger>
          </TabsList>

          <TabsContent value="images" className="space-y-4">
            {/* Image Gallery */}
            <div className="relative">
              <div className="relative h-80 rounded-lg overflow-hidden">
                <Image
                  src={currentImages[currentImageIndex] || "/placeholder.svg"}
                  alt={`${room.name} - ${selectedImageCategory}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />

                {/* Navigation Arrows */}
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90"
                  onClick={prevImage}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90"
                  onClick={nextImage}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
                  {currentImageIndex + 1} / {currentImages.length}
                </div>
              </div>

              {/* Image Category Tabs */}
              <div className="flex space-x-2 mt-4">
                {Object.entries(room.images).map(
                  ([category, images]) =>
                    images.length > 0 && (
                      <Button
                        key={category}
                        variant={selectedImageCategory === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setSelectedImageCategory(category as keyof typeof room.images)
                          setCurrentImageIndex(0)
                        }}
                        className="capitalize"
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        {category} ({images.length})
                      </Button>
                    ),
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            {/* Room Features */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Maximize className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                <div className="text-sm font-medium">Size</div>
                <div className="text-lg font-bold">{room.roomFeatures.size} m²</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Users className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                <div className="text-sm font-medium">Max Guests</div>
                <div className="text-lg font-bold">
                  {room.roomFeatures.maxOccupancy.adults + room.roomFeatures.maxOccupancy.children}
                </div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Eye className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                <div className="text-sm font-medium">View</div>
                <div className="text-sm font-bold">{room.roomFeatures.view}</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Bed className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                <div className="text-sm font-medium">Floor</div>
                <div className="text-sm font-bold">{room.roomFeatures.floor}</div>
              </div>
            </div>

            {/* Bed Configuration */}
            <div>
              <h4 className="font-semibold mb-3">Bed Configuration</h4>
              <div className="space-y-2">
                {room.roomFeatures.bedTypes.map((bed, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Bed className="w-4 h-4 text-gray-600" />
                      <span className="font-medium">
                        {bed.count}x {bed.type}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600">{bed.size}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Occupancy Details */}
            <div>
              <h4 className="font-semibold mb-3">Maximum Occupancy</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{room.roomFeatures.maxOccupancy.adults}</div>
                  <div className="text-sm text-gray-600">Adults</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{room.roomFeatures.maxOccupancy.children}</div>
                  <div className="text-sm text-gray-600">Children</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{room.roomFeatures.maxOccupancy.infants}</div>
                  <div className="text-sm text-gray-600">Infants</div>
                </div>
              </div>
            </div>

            {/* Accessibility */}
            {room.roomFeatures.accessibility.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3">Accessibility Features</h4>
                <div className="flex flex-wrap gap-2">
                  {room.roomFeatures.accessibility.map((feature) => (
                    <Badge key={feature} variant="outline" className="flex items-center space-x-1">
                      <Accessibility className="w-3 h-3" />
                      <span>{feature}</span>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="amenities" className="space-y-6">
            {room.amenities.map((category) => (
              <div key={category.category}>
                <h4 className="font-semibold mb-3 capitalize">{category.category}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {category.items.map((amenity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 mt-0.5">{getAmenityIcon(amenity.icon)}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{amenity.name}</span>
                          {amenity.premium && (
                            <Badge variant="secondary" className="text-xs">
                              Premium
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{amenity.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="availability" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Calendar */}
              <div>
                <h4 className="font-semibold mb-3">Select Date</h4>
                <Calendar
                  mode="single"
                  required
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </div>

              {/* Availability Info */}
              <div className="space-y-4">
                <h4 className="font-semibold">Availability & Pricing</h4>

                {selectedDate && (
                  <div className="space-y-3">
                    {Object.entries(room.availabilityCalendar)
                      .filter(([date]) => new Date(date).toDateString() === selectedDate.toDateString())
                      .map(([date, info]) => (
                        <Card key={date} className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{new Date(date).toLocaleDateString()}</span>
                            <Badge variant={info.available ? "default" : "destructive"}>
                              {info.available ? "Available" : "Sold Out"}
                            </Badge>
                          </div>

                          {info.available && (
                            <>
                              <div className="text-2xl font-bold text-blue-600 mb-2">
                                ${info.price}
                                <span className="text-sm text-gray-500 font-normal">/night</span>
                              </div>

                              {info.minStay && (
                                <div className="text-sm text-gray-600 mb-2">Minimum stay: {info.minStay} nights</div>
                              )}

                              {info.restrictions && info.restrictions.length > 0 && (
                                <div className="space-y-1">
                                  <div className="text-sm font-medium text-gray-700">Restrictions:</div>
                                  {info.restrictions.map((restriction, index) => (
                                    <div key={index} className="text-xs text-gray-600">
                                      • {restriction}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </>
                          )}
                        </Card>
                      ))}
                  </div>
                )}

                {/* Policies */}
                <div className="space-y-3 pt-4 border-t">
                  <h5 className="font-medium">Room Policies</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Check-in:</span>
                      <span>{room.policies.checkIn}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Check-out:</span>
                      <span>{room.policies.checkOut}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cancellation:</span>
                      <span className="text-green-600">{room.policies.cancellation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Smoking:</span>
                      <span className={room.policies.smoking ? "text-orange-600" : "text-green-600"}>
                        {room.policies.smoking ? "Allowed" : "Non-smoking"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pets:</span>
                      <span className={room.policies.pets ? "text-green-600" : "text-red-600"}>
                        {room.policies.pets ? "Allowed" : "Not allowed"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Virtual Tour Modal */}
        {showVirtualTour && room.virtualTour && (
          <Dialog open={showVirtualTour} onOpenChange={setShowVirtualTour}>
            <DialogContent className="max-w-6xl h-[80vh]">
              <iframe src={room.virtualTour} className="w-full h-full rounded-lg" title="Virtual Tour" />
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  )
}
