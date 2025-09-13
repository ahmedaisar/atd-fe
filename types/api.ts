// Core API types for route handlers

export type Currency = 'USD' | 'EUR' | 'THB' | 'MVR'

export interface HotelListItem {
  id: string
  name: string
  starRating: number
  location: {
    city: string
    country: string
    distanceFromCenterKm: number
    coordinates: { lat: number; lng: number }
  }
  review: { score: number; count: number }
  images: string[]
  amenities: string[]
  policies: { cancellation: string; checkIn: string; checkOut: string }
  startingPrice: { original: number; current: number; currency: Currency; discountPercentage?: number }
  urgency?: { viewing?: number; lastRooms?: number }
  destinationId: string
}

export interface RoomRatePlan {
  id: string
  name: string
  inclusions: string[]
  cancellation: string
  pricePerNight: number
  currency: Currency
  availability: number
}

export interface RoomType {
  id: string
  name: string
  images: string[]
  sizeSqm: number
  bed: { type: string; count: number }
  maxOccupancy: { adults: number; children: number }
  amenities: string[]
  rates: RoomRatePlan[]
}

export interface HotelRooms {
  hotelId: string
  rooms: RoomType[]
}

export interface HotelReviews {
  hotelId: string
  overall: number
  categories: { cleanliness: number; location: number; service: number; value: number }
  reviews: Array<{
    id: string
    author: string
    rating: number
    title: string
    text: string
    travelerType: string
    language: string
    verified: boolean
  }>
}

export interface BookingSelection {
  hotelId: string
  checkIn: string
  checkOut: string
  rooms: Array<{ roomTypeId: string; rateId: string; quantity: number }>
}

export interface BookingHold {
  holdId: string
  expiresAt: string
}

export interface CheckoutPayload {
  guest: { firstName: string; lastName: string; email: string; phone: string }
  billing: { country: string; city: string; address: string; postalCode: string }
  card: { number: string; expMonth: number; expYear: number; cvc: string }
}

export interface BookingConfirmation {
  reference: string
  hotelId: string
  total: { amount: number; currency: Currency }
  policy: string
  summary: BookingSelection
}
