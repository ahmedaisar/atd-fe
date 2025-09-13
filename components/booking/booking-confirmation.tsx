import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Calendar, MapPin, Users, Mail, Phone, Download, Share } from "lucide-react"
import Link from "next/link"
import type { BookingData } from "@/app/booking/page"

interface BookingConfirmationProps {
  bookingData: BookingData
}

export function BookingConfirmation({ bookingData }: BookingConfirmationProps) {
  return (
    <div className="space-y-6">
      {/* Success Header */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-6 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-green-900 mb-2">Booking Confirmed!</h1>
          <p className="text-green-700 mb-4">
            Your reservation has been successfully confirmed. A confirmation email has been sent to{" "}
            <strong>{bookingData.guestDetails.email}</strong>
          </p>
          <Badge className="bg-green-600 text-white text-lg px-4 py-2">Booking ID: {bookingData.bookingId}</Badge>
        </CardContent>
      </Card>

      {/* Booking Details */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Hotel Info */}
          <div className="flex items-start space-x-4 pb-4 border-b">
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">The Sukhothai Bangkok</h3>
              <p className="text-gray-600">13/3 South Sathorn Road, Sathorn, Bangkok 10120, Thailand</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {bookingData.dates.checkIn.toLocaleDateString()} - {bookingData.dates.checkOut.toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>
                    {bookingData.guests.adults} adult{bookingData.guests.adults !== 1 ? "s" : ""}
                    {bookingData.guests.children > 0 &&
                      `, ${bookingData.guests.children} child${bookingData.guests.children !== 1 ? "ren" : ""}`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Room Details */}
          <div>
            <h4 className="font-semibold mb-3">Room Details</h4>
            <div className="space-y-3">
              {bookingData.rooms.map((room) => (
                <div key={room.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{room.name}</div>
                    <div className="text-sm text-gray-600">
                      {room.quantity} room{room.quantity !== 1 ? "s" : ""} × {room.nights} night
                      {room.nights !== 1 ? "s" : ""}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${room.price * room.quantity * room.nights}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Guest Details */}
          <div>
            <h4 className="font-semibold mb-3">Guest Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="font-medium">
                    {bookingData.guestDetails.firstName} {bookingData.guestDetails.lastName}
                  </div>
                  <div className="text-sm text-gray-600">Primary Guest</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="font-medium">{bookingData.guestDetails.email}</div>
                  <div className="text-sm text-gray-600">Email Address</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="font-medium">{bookingData.guestDetails.phone}</div>
                  <div className="text-sm text-gray-600">Phone Number</div>
                </div>
              </div>
            </div>
            {bookingData.guestDetails.specialRequests && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="font-medium text-blue-900 mb-1">Special Requests</div>
                <div className="text-sm text-blue-700">{bookingData.guestDetails.specialRequests}</div>
              </div>
            )}
          </div>

          {/* Payment Summary */}
          <div className="pt-4 border-t">
            <h4 className="font-semibold mb-3">Payment Summary</h4>
            <div className="space-y-2">
              {bookingData.rooms.map((room) => (
                <div key={room.id} className="flex justify-between text-sm">
                  <span>
                    {room.name} × {room.quantity} × {room.nights} night{room.nights !== 1 ? "s" : ""}
                  </span>
                  <span>${room.price * room.quantity * room.nights}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm">
                <span>Taxes and fees</span>
                <span>${Math.round(bookingData.totalPrice * 0.15)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                <span>Total Paid</span>
                <span>${Math.round(bookingData.totalPrice * 1.15)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Information */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <h3 className="font-semibold text-blue-900 mb-3">Important Information</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Check-in: 3:00 PM | Check-out: 12:00 PM</li>
            <li>• Free cancellation until 24 hours before check-in</li>
            <li>• Please bring a valid ID and credit card for check-in</li>
            <li>• Contact the hotel directly for any special arrangements</li>
          </ul>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
          <Download className="w-4 h-4 mr-2" />
          Download Confirmation
        </Button>
        <Button variant="outline" className="flex-1 bg-transparent">
          <Share className="w-4 h-4 mr-2" />
          Share Booking
        </Button>
        <Button variant="outline" className="flex-1 bg-transparent">
          <Mail className="w-4 h-4 mr-2" />
          Email Confirmation
        </Button>
      </div>

      {/* Next Steps */}
      <div className="text-center space-y-4">
        <p className="text-gray-600">What would you like to do next?</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/dashboard">
            <Button variant="outline" className="bg-transparent">
              View My Bookings
            </Button>
          </Link>
          <Link href="/search">
            <Button variant="outline" className="bg-transparent">
              Book Another Hotel
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="bg-transparent">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
