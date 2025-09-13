import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, MapPin, Shield, Star } from "lucide-react"
import type { BookingData } from "@/app/booking/page"

interface BookingSummaryProps {
  bookingData: BookingData
}

export function BookingSummary({ bookingData }: BookingSummaryProps) {
  const taxes = Math.round(bookingData.totalPrice * 0.15)
  const grandTotal = bookingData.totalPrice + taxes

  return (
    <div className="sticky top-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5" />
            <span>Booking Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Hotel Info */}
          <div>
            <h3 className="font-semibold text-lg mb-2">The Sukhothai Bangkok</h3>
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">4.8</span>
              </div>
              <span className="text-sm text-gray-600">(2,847 reviews)</span>
            </div>
            <p className="text-sm text-gray-600">Sathorn, Bangkok, Thailand</p>
          </div>

          {/* Dates and Guests */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <div className="font-medium">
                  {bookingData.dates.checkIn.toLocaleDateString()} - {bookingData.dates.checkOut.toLocaleDateString()}
                </div>
                <div className="text-sm text-gray-600">
                  {bookingData.dates.nights} night{bookingData.dates.nights !== 1 ? "s" : ""}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Users className="w-5 h-5 text-gray-400" />
              <div>
                <div className="font-medium">
                  {bookingData.guests.adults} adult{bookingData.guests.adults !== 1 ? "s" : ""}
                  {bookingData.guests.children > 0 &&
                    `, ${bookingData.guests.children} child${bookingData.guests.children !== 1 ? "ren" : ""}`}
                </div>
              </div>
            </div>
          </div>

          {/* Selected Rooms */}
          {bookingData.rooms.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3">Selected Rooms</h4>
              <div className="space-y-3">
                {bookingData.rooms.map((room) => (
                  <div key={room.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium mb-1">{room.name}</div>
                    <div className="text-sm text-gray-600 mb-2">
                      {room.quantity} room{room.quantity !== 1 ? "s" : ""} × {room.nights} night
                      {room.nights !== 1 ? "s" : ""}
                    </div>
                    <div className="text-right font-semibold">${room.price * room.quantity * room.nights}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Price Breakdown */}
          {bookingData.totalPrice > 0 && (
            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span>Room total</span>
                <span>${bookingData.totalPrice}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Taxes and fees</span>
                <span>${taxes}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                <span>Total</span>
                <span>${grandTotal}</span>
              </div>
            </div>
          )}

          {/* Benefits */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-green-600">
              <Shield className="w-4 h-4" />
              <span>Free cancellation until 24h before check-in</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-blue-600">
              <span>💳</span>
              <span>No payment needed today</span>
            </div>
          </div>

          {/* Trust Signals */}
          <div className="flex justify-center space-x-2 pt-4 border-t">
            <Badge variant="outline" className="text-xs">
              Best Price Guarantee
            </Badge>
            <Badge variant="outline" className="text-xs">
              Secure Booking
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
