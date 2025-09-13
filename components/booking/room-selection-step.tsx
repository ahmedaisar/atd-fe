"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Users, Bed, Maximize, Coffee, Shield } from "lucide-react"
import Image from "next/image"
import type { BookingData } from "@/app/booking/page"
import { useCallback } from "react"

interface RoomSelectionStepProps {
  bookingData: BookingData
  updateBookingData: (updates: Partial<BookingData>) => void
  onNext: () => void
}

const availableRooms = [
  {
    id: 1,
    name: "Deluxe Room",
    size: "35 sqm",
    bedType: "1 King Bed",
    maxGuests: 2,
    images: ["/placeholder.svg?height=200&width=300&text=Deluxe+Room"],
    amenities: ["Free WiFi", "Air Conditioning", "Minibar", "Safe"],
    price: 185,
    originalPrice: 220,
    availability: 3,
    cancellation: "Free cancellation",
    breakfast: false,
    description: "Spacious and elegantly appointed room with modern amenities and city views.",
  },
  {
    id: 2,
    name: "Premier Room",
    size: "42 sqm",
    bedType: "1 King Bed",
    maxGuests: 2,
    images: ["/placeholder.svg?height=200&width=300&text=Premier+Room"],
    amenities: ["Free WiFi", "Air Conditioning", "Minibar", "Safe", "Balcony"],
    price: 245,
    originalPrice: 290,
    availability: 2,
    cancellation: "Free cancellation",
    breakfast: true,
    description: "Enhanced room with private balcony and premium amenities.",
  },
  {
    id: 3,
    name: "Suite",
    size: "65 sqm",
    bedType: "1 King Bed + Living Area",
    maxGuests: 3,
    images: ["/placeholder.svg?height=200&width=300&text=Suite"],
    amenities: ["Free WiFi", "Air Conditioning", "Minibar", "Safe", "Living Room", "Bathtub"],
    price: 385,
    originalPrice: 450,
    availability: 1,
    cancellation: "Free cancellation",
    breakfast: true,
    description: "Luxurious suite with separate living area and premium bathroom amenities.",
  },
]

export function RoomSelectionStep({ bookingData, updateBookingData, onNext }: RoomSelectionStepProps) {
  const updateRoomQuantity = useCallback(
    (roomId: number, quantity: number) => {
      const existingRooms = bookingData.rooms.filter((room) => room.id !== roomId)
      const room = availableRooms.find((r) => r.id === roomId)

      if (room && quantity > 0) {
        const newRoom = {
          id: roomId,
          name: room.name,
          quantity,
          price: room.price,
          nights: bookingData.dates.nights,
        }
        const updatedRooms = [...existingRooms, newRoom]
        const totalPrice = updatedRooms.reduce((sum, r) => sum + r.price * r.quantity * r.nights, 0)

        updateBookingData({
          rooms: updatedRooms,
          totalPrice,
        })
      } else if (quantity === 0) {
        const totalPrice = existingRooms.reduce((sum, r) => sum + r.price * r.quantity * r.nights, 0)
        updateBookingData({
          rooms: existingRooms,
          totalPrice,
        })
      }
    },
    [bookingData.rooms, bookingData.dates.nights, updateBookingData],
  )

  const getSelectedQuantity = useCallback(
    (roomId: number) => {
      const room = bookingData.rooms.find((r) => r.id === roomId)
      return room ? room.quantity : 0
    },
    [bookingData.rooms],
  )

  const hasSelectedRooms = bookingData.rooms.length > 0

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Select Your Rooms</CardTitle>
          <p className="text-gray-600">
            {bookingData.dates.checkIn.toLocaleDateString()} - {bookingData.dates.checkOut.toLocaleDateString()} •{" "}
            {bookingData.dates.nights} night{bookingData.dates.nights !== 1 ? "s" : ""} • {bookingData.guests.adults}{" "}
            adult{bookingData.guests.adults !== 1 ? "s" : ""}
            {bookingData.guests.children > 0 &&
              `, ${bookingData.guests.children} child${bookingData.guests.children !== 1 ? "ren" : ""}`}
          </p>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        {availableRooms.map((room) => (
          <Card key={room.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-80 flex-shrink-0">
                  <Image
                    src={room.images[0] || "/placeholder.svg"}
                    alt={room.name}
                    width={320}
                    height={240}
                    className="w-full h-60 lg:h-full object-cover"
                  />
                </div>

                <div className="flex-1 p-6">
                  <div className="flex flex-col h-full">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">{room.name}</h3>
                          <p className="text-gray-600 mb-3">{room.description}</p>

                          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                            <div className="flex items-center space-x-1">
                              <Maximize className="w-4 h-4" />
                              <span>{room.size}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Bed className="w-4 h-4" />
                              <span>{room.bedType}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="w-4 h-4" />
                              <span>Up to {room.maxGuests} guests</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {room.amenities.map((amenity) => (
                              <Badge key={amenity} variant="outline" className="text-xs">
                                {amenity}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center space-x-1 text-green-600">
                              <Shield className="w-4 h-4" />
                              <span>{room.cancellation}</span>
                            </div>
                            {room.breakfast && (
                              <div className="flex items-center space-x-1 text-orange-600">
                                <Coffee className="w-4 h-4" />
                                <span>Breakfast included</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-end justify-between pt-4 border-t">
                      <div>
                        {room.originalPrice && (
                          <span className="text-gray-500 line-through text-sm">${room.originalPrice}</span>
                        )}
                        <div className="flex items-baseline space-x-1">
                          <span className="text-2xl font-bold text-blue-600">${room.price}</span>
                          <span className="text-gray-600">/night</span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {room.availability} room{room.availability !== 1 ? "s" : ""} left
                        </p>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Select
                          value={getSelectedQuantity(room.id).toString()}
                          onValueChange={(value) => updateRoomQuantity(room.id, Number.parseInt(value))}
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">0</SelectItem>
                            {Array.from({ length: room.availability }, (_, i) => (
                              <SelectItem key={i + 1} value={(i + 1).toString()}>
                                {i + 1}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {hasSelectedRooms && (
        <div className="flex justify-end">
          <Button onClick={onNext} size="lg" className="bg-blue-600 hover:bg-blue-700">
            Continue to Guest Details
          </Button>
        </div>
      )}
    </div>
  )
}
