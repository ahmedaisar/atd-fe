"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Users, 
  Bed, 
  Maximize, 
  Coffee, 
  Shield, 
  Wifi,
  Car,
  Tv,
  AirVent,
  Bath,
  Wine,
  Briefcase,
  TreePine,
  Crown,
  UtensilsCrossed,
  Waves,
  Camera,
  AlertTriangle,
  Star,
  Clock,
  Check,
  X
} from "lucide-react"
import Image from "next/image"

interface Rate {
  id: string
  name: string
  inclusions: string[]
  cancellation: string
  pricePerNight: number
  currency: string
  availability: number
  priceBreakdown: {
    basePrice: number
    taxes: number
    serviceFee: number
    totalPrice: number
  }
  available: boolean
  urgencyMessage?: string
  popularChoice?: boolean
  savings?: number
}

interface Room {
  id: string
  name: string
  images: string[]
  sizeSqm: number
  bed: { type: string; count: number }
  maxOccupancy: { adults: number; children: number }
  amenities: string[]
  rates: Rate[]
}

interface RoomData {
  hotelId: string
  rooms: Room[]
  checkIn: string
  checkOut: string
  nights: number
  guests: {
    adults: number
    children: number
  }
}

const getAmenityIcon = (amenity: string) => {
  const iconMap: { [key: string]: any } = {
    'WiFi': Wifi,
    'Sea View': Waves,
    'City View': Camera,
    'River View': Waves,
    'Beach Access': TreePine,
    'Private Deck': Camera,
    'Private Garden': TreePine,
    'Private Pool': Waves,
    'Mini Bar': Wine,
    'Work Desk': Briefcase,
    'Bathtub': Bath,
    'Air Conditioning': AirVent,
    'TV': Tv,
    'Butler Service': Crown,
    'Jacuzzi': Bath,
    'Separate Living Area': Briefcase,
    'Club Lounge Access': Crown
  }
  
  const Icon = iconMap[amenity] || Check
  return <Icon className="w-4 h-4" />
}

const getBedIcon = (bedType: string) => {
  return <Bed className="w-4 h-4" />
}

export function RoomTypes({ hotelId }: { hotelId: string }) {
  const router = useRouter()
  const [roomData, setRoomData] = useState<RoomData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedRooms, setSelectedRooms] = useState<{ [roomId: string]: { [rateId: string]: number } }>({})

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch(`/api/hotels/${hotelId}/rooms`)
        const data = await response.json()
        setRoomData(data)
      } catch (error) {
        console.error('Failed to fetch rooms:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRooms()
  }, [hotelId])

  const updateRoomSelection = (roomId: string, rateId: string, quantity: number) => {
    setSelectedRooms(prev => ({
      ...prev,
      [roomId]: {
        ...prev[roomId],
        [rateId]: quantity
      }
    }))
  }

  const getTotalPrice = () => {
    if (!roomData) return 0
    
    let total = 0
    Object.entries(selectedRooms).forEach(([roomId, rates]) => {
      Object.entries(rates).forEach(([rateId, quantity]) => {
        const room = roomData.rooms.find(r => r.id === roomId)
        const rate = room?.rates.find(r => r.id === rateId)
        if (rate) {
          total += rate.priceBreakdown.totalPrice * quantity
        }
      })
    })
    return total
  }

  const getTotalRooms = () => {
    return Object.values(selectedRooms).reduce((total, rates) => {
      return total + Object.values(rates).reduce((rateTotal, quantity) => rateTotal + quantity, 0)
    }, 0)
  }

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  const handleContinueToBook = () => {
    // Prepare booking data
    const bookingData = {
      hotelId,
      checkIn: roomData?.checkIn,
      checkOut: roomData?.checkOut,
      nights: roomData?.nights,
      guests: roomData?.guests,
      rooms: selectedRooms,
      totalPrice: getTotalPrice()
    }
    
    // Encode the booking data as URL parameters
    const searchParams = new URLSearchParams({
      hotelId,
      bookingData: JSON.stringify(bookingData)
    })
    
    // Navigate to booking page
    router.push(`/booking?${searchParams.toString()}`)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row">
                  <Skeleton className="lg:w-80 h-60 lg:h-full" />
                  <div className="flex-1 p-6 space-y-4">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!roomData) {
    return <div className="text-center py-8">Failed to load rooms</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Choose Your Room</h2>
          <p className="text-gray-600 mt-1">
            {roomData.checkIn} - {roomData.checkOut} • {roomData.nights} night{roomData.nights !== 1 ? 's' : ''} • {roomData.guests.adults} adult{roomData.guests.adults !== 1 ? 's' : ''}
            {roomData.guests.children > 0 && `, ${roomData.guests.children} child${roomData.guests.children !== 1 ? 'ren' : ''}`}
          </p>
        </div>
        {getTotalRooms() > 0 && (
          <div className="text-right">
            <div className="text-sm text-gray-600">{getTotalRooms()} room{getTotalRooms() !== 1 ? 's' : ''} selected</div>
            <div className="text-lg font-bold text-blue-600">{formatCurrency(getTotalPrice())}</div>
            <div className="text-xs text-gray-500">for {roomData.nights} nights</div>
          </div>
        )}
      </div>

      <div className="space-y-8">
        {roomData.rooms.map((room) => (
          <Card key={room.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              <div className="flex flex-col xl:flex-row">
                {/* Room Images */}
                <div className="xl:w-72 2xl:w-80 flex-shrink-0 relative">
                  <Image
                    src={room.images[0] || "/placeholder.svg"}
                    alt={room.name}
                    width={320}
                    height={240}
                    className="w-full h-56 xl:h-full object-cover"
                  />
                  {room.images.length > 1 && (
                    <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
                      +{room.images.length - 1} more
                    </div>
                  )}
                </div>

                {/* Room Details */}
                <div className="flex-1 p-6 xl:p-8">
                  <div className="mb-6">
                    <h3 className="text-xl xl:text-2xl font-semibold mb-4 text-gray-900">{room.name}</h3>

                    {/* Room Specs */}
                    <div className="flex flex-wrap gap-6 text-sm text-gray-600 mb-6">
                      <div className="flex items-center space-x-2">
                        <Maximize className="w-4 h-4" />
                        <span>{room.sizeSqm} sqm</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getBedIcon(room.bed.type)}
                        <span>{room.bed.count} {room.bed.type} Bed{room.bed.count !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span>Up to {room.maxOccupancy.adults} adult{room.maxOccupancy.adults !== 1 ? 's' : ''}</span>
                        {room.maxOccupancy.children > 0 && (
                          <span>, {room.maxOccupancy.children} child{room.maxOccupancy.children !== 1 ? 'ren' : ''}</span>
                        )}
                      </div>
                    </div>

                    {/* Amenities */}
                    <div className="mb-6">
                      <h4 className="font-medium mb-3 text-gray-900">Room amenities</h4>
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                        {room.amenities.map((amenity) => (
                          <div key={amenity} className="flex items-center space-x-2 text-sm text-gray-600">
                            {getAmenityIcon(amenity)}
                            <span>{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Rate Options */}
                  <div className="space-y-4 border-t pt-4">
                    <h4 className="font-medium text-lg mb-4">Rate options</h4>
                    {room.rates.map((rate) => (
                      <div key={rate.id} className={`border border-gray-200 rounded-lg p-5 relative bg-white hover:border-blue-200 transition-colors ${(selectedRooms[room.id]?.[rate.id] || 0) > 0 ? 'border-blue-300 bg-blue-50' : ''}`}>
                        {rate.popularChoice && (
                          <div className="absolute -top-2 left-4 bg-orange-500 text-white text-xs px-2 py-1 rounded-full shadow-sm">
                            <Star className="w-3 h-3 inline mr-1" />
                            Popular Choice
                          </div>
                        )}
                        {rate.savings && (
                          <div className="absolute -top-2 right-4 bg-green-500 text-white text-xs px-2 py-1 rounded-full shadow-sm">
                            {rate.savings}% Off
                          </div>
                        )}
                        {(selectedRooms[room.id]?.[rate.id] || 0) > 0 && (
                          <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs px-2 py-1 rounded-full shadow-sm flex items-center">
                            <Check className="w-3 h-3 mr-1" />
                            {selectedRooms[room.id]?.[rate.id]} selected
                          </div>
                        )}
                        
                        <div className="space-y-4">
                          {/* Rate Header */}
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-3">
                                <h5 className="font-semibold text-gray-900">{rate.name}</h5>
                                {rate.urgencyMessage && (
                                  <Badge variant="destructive" className="text-xs">
                                    <AlertTriangle className="w-3 h-3 mr-1" />
                                    {rate.urgencyMessage}
                                  </Badge>
                                )}
                              </div>
                              
                              {/* Inclusions */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 mb-3">
                                {rate.inclusions.map((inclusion) => (
                                  <div key={inclusion} className="flex items-center space-x-2 text-sm text-gray-600">
                                    <Check className="w-3 h-3 text-green-500 flex-shrink-0" />
                                    <span>{inclusion}</span>
                                  </div>
                                ))}
                              </div>

                              {/* Cancellation Policy */}
                              <div className="flex items-center space-x-2 text-sm">
                                {rate.cancellation.includes('Free') ? (
                                  <Shield className="w-4 h-4 text-green-500" />
                                ) : (
                                  <X className="w-4 h-4 text-red-500" />
                                )}
                                <span className={rate.cancellation.includes('Free') ? 'text-green-600' : 'text-red-600'}>
                                  {rate.cancellation}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Price and Selection Row */}
                          <div className="flex items-end justify-between pt-3 border-t border-gray-100">
                            {/* Price Breakdown */}
                            <div className="text-left">
                              <div className="text-2xl font-bold text-blue-600 mb-1">
                                {formatCurrency(rate.priceBreakdown.totalPrice, rate.currency)}
                              </div>
                              <div className="text-xs text-gray-500 mb-1">
                                {formatCurrency(rate.priceBreakdown.basePrice, rate.currency)} + {formatCurrency(rate.priceBreakdown.taxes + rate.priceBreakdown.serviceFee, rate.currency)} taxes & fees
                              </div>
                              <div className="text-xs text-gray-500">for {roomData.nights} nights</div>
                            </div>

                            {/* Quantity Selector and Button */}
                            <div className="flex items-center space-x-3 ml-4">
                              <div className="text-sm text-gray-600">Rooms:</div>
                              <Select
                                value={selectedRooms[room.id]?.[rate.id]?.toString() || "0"}
                                onValueChange={(value) => updateRoomSelection(room.id, rate.id, parseInt(value))}
                                disabled={!rate.available}
                              >
                                <SelectTrigger className="w-16 h-9">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="0">0</SelectItem>
                                  {Array.from({ length: Math.min(rate.availability, 5) }, (_, i) => (
                                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                                      {i + 1}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              
                              <Button 
                                onClick={() => {
                                  const currentQuantity = selectedRooms[room.id]?.[rate.id] || 0
                                  if (currentQuantity === 0) {
                                    updateRoomSelection(room.id, rate.id, 1)
                                  } else {
                                    updateRoomSelection(room.id, rate.id, currentQuantity + 1)
                                  }
                                }}
                                disabled={!rate.available || (selectedRooms[room.id]?.[rate.id] || 0) >= Math.min(rate.availability, 5)}
                                className="bg-blue-600 hover:bg-blue-700 px-6"
                                size="sm"
                              >
                                {!rate.available ? 'Unavailable' : 
                                 (selectedRooms[room.id]?.[rate.id] || 0) >= Math.min(rate.availability, 5) ? 'Max Reached' : 
                                 (selectedRooms[room.id]?.[rate.id] || 0) > 0 ? `Add Another (+1)` : 'Select'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {getTotalRooms() > 0 && (
        <div className="sticky bottom-4 z-10">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">Your Selection</h3>
                  <p className="text-gray-700 font-medium">
                    {getTotalRooms()} room{getTotalRooms() !== 1 ? 's' : ''} for {roomData.nights} night{roomData.nights !== 1 ? 's' : ''}
                  </p>
                  <div className="text-sm text-gray-600 mt-1">
                    Includes taxes and fees
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{formatCurrency(getTotalPrice())}</div>
                  <Button 
                    size="lg" 
                    className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-base font-semibold shadow-md"
                    onClick={handleContinueToBook}
                  >
                    Continue to Book
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
