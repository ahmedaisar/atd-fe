"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DayPicker } from "react-day-picker"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Users, Shield, Star, MapPin, TrendingDown, ExternalLink } from "lucide-react"
import { format } from "date-fns"
import type { ApiResponse } from '@/types/price-aggregator'

interface BookingWidgetProps {
  hotel: {
    name: string
    rating?: number
    review?: { score: number; count: number }
    location: { 
      city?: string
      country?: string
    }
    id?: string
  }
}

export function BookingWidget({ hotel }: BookingWidgetProps) {
  const [checkIn, setCheckIn] = useState<Date | undefined>(new Date(2024, 6, 23))
  const [checkOut, setCheckOut] = useState<Date | undefined>(new Date(2024, 6, 24))
  const [guests, setGuests] = useState("2-adults")
  const [bestOffer, setBestOffer] = useState<{ price: number; partner: string; savings: number } | null>(null)
  const [loading, setLoading] = useState(true)

  const rating = hotel.rating || hotel.review?.score || 0
  const reviewCount = hotel.review?.count || 0
  const locationStr = hotel.location?.city && hotel.location?.country 
    ? `${hotel.location.city}, ${hotel.location.country}`
    : 'Location not specified'

  // Fetch best price from offers API
  useEffect(() => {
    if (!hotel.id) return
    
    const fetchBestPrice = async () => {
      try {
        const response = await fetch(`/api/hotels/${hotel.id}/offers`)
        if (response.ok) {
          const data: ApiResponse = await response.json()
          const hotelRecord = data.data.records[0]
          
          if (hotelRecord) {
            const savings = Math.round(((hotelRecord.worst_offer - hotelRecord.best_offer) / hotelRecord.worst_offer) * 100)
            setBestOffer({
              price: hotelRecord.best_offer,
              partner: hotelRecord.hero_offer.partner_name,
              savings
            })
          }
        }
      } catch (error) {
        console.error('Failed to fetch best price:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchBestPrice()
  }, [hotel.id])

  const handleCompareAllDeals = () => {
    // Scroll to price comparison section
    const priceSection = document.querySelector('[data-section="price-comparison"]')
    if (priceSection) {
      priceSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <Card className="sticky top-6">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2 mb-2">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{rating}</span>
          </div>
          <span className="text-sm text-gray-600">({reviewCount} reviews)</span>
        </div>
        <CardTitle className="text-lg">{hotel.name}</CardTitle>
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{locationStr}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Price Display */}
        <div className="text-center py-4 bg-blue-50 rounded-lg">
          {loading ? (
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-20 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-16 mx-auto"></div>
            </div>
          ) : bestOffer ? (
            <>
              <div className="text-3xl font-bold text-blue-600">${bestOffer.price}</div>
              <div className="text-sm text-gray-600">per night</div>
              {bestOffer.savings > 0 && (
                <Badge className="mt-2 bg-green-500 text-white">
                  <TrendingDown className="w-3 h-3 mr-1" />
                  Save {bestOffer.savings}%
                </Badge>
              )}
              <div className="text-xs text-gray-500 mt-1">
                Best price from {bestOffer.partner}
              </div>
            </>
          ) : (
            <>
              <div className="text-3xl font-bold text-blue-600">$185</div>
              <div className="text-sm text-gray-600">per night</div>
            </>
          )}
        </div>

        {/* Booking Form */}
        <div className="space-y-4">
          {/* Check-in Date */}
          <div>
            <Label className="text-sm font-medium">Check-in</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full h-11 mt-1 justify-start text-left font-normal bg-transparent"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkIn ? format(checkIn, "MMM dd, yyyy") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-3" align="start">
                <DayPicker
                  mode="single"
                  selected={checkIn}
                  onSelect={(date) => date && setCheckIn(date)}
                  disabled={{ before: new Date() }}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Check-out Date */}
          <div>
            <Label className="text-sm font-medium">Check-out</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full h-11 mt-1 justify-start text-left font-normal bg-transparent"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkOut ? format(checkOut, "MMM dd, yyyy") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-3" align="start">
                <DayPicker
                  mode="single"
                  selected={checkOut}
                  onSelect={(date) => date && setCheckOut(date)}
                  disabled={{ before: checkIn ? new Date(checkIn.getTime() + 24 * 60 * 60 * 1000) : new Date() }}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Guests */}
          <div>
            <Label className="text-sm font-medium">Guests</Label>
            <Select value={guests} onValueChange={setGuests}>
              <SelectTrigger className="w-full h-11 mt-1 bg-transparent">
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-adult">1 Adult</SelectItem>
                <SelectItem value="2-adults">2 Adults</SelectItem>
                <SelectItem value="3-adults">3 Adults</SelectItem>
                <SelectItem value="4-adults">4 Adults</SelectItem>
                <SelectItem value="family">2 Adults, 2 Children</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="space-y-2 pt-4 border-t">
          {bestOffer ? (
            <>
              <div className="flex justify-between text-sm">
                <span>${bestOffer.price} × 1 night</span>
                <span>${bestOffer.price}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Best price available</span>
                <span>Included</span>
              </div>
              <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                <span>Total</span>
                <span>${bestOffer.price}</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between text-sm">
                <span>$185 × 1 night</span>
                <span>$185</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Taxes and fees</span>
                <span>$28</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Service fee</span>
                <span>$15</span>
              </div>
              <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                <span>Total</span>
                <span>$228</span>
              </div>
            </>
          )}
        </div>

        {/* Benefits */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm text-green-600">
            <Shield className="w-4 h-4" />
            <span>Best Price Guarantee</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-blue-600">
            <ExternalLink className="w-4 h-4" />
            <span>Direct booking with partners</span>
          </div>
        </div>

        {/* Compare Button */}
        <Button 
          onClick={handleCompareAllDeals}
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-lg font-semibold"
        >
          Compare All Deals
        </Button>

        <p className="text-xs text-gray-500 text-center">You won't be charged yet</p>

        {/* Trust Signals */}
        <div className="flex justify-center space-x-4 pt-4 border-t">
          <Badge variant="outline" className="text-xs">
            Best Price Guarantee
          </Badge>
          <Badge variant="outline" className="text-xs">
            Secure Booking
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
