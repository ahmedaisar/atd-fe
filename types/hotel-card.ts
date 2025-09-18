import type { Offer } from "./price-aggregator";

export interface HotelCardDetails {
  id: string | number
  name: string
  images: string[]
  rating: number
  description: string
  reviewCount: number
  price: number
  originalPrice?: number
  location: string
  distance: string
  amenities: string[]
  badges: string[]
  coordinates: { lat: number; lng: number }
  // Enhanced properties
  chainBrand?: string
  propertyType?: string
  starRating: number
  sustainabilityCertified: boolean
  freeCancellation: boolean
  payAtProperty: boolean
  instantConfirmation: boolean
  lastBooked?: string
  popularityScore: number
  reviewScoreByCategory: {
    cleanliness: number
    location: number
    service: number
    value: number
  }
  nearbyLandmarks: Array<{
    name: string
    distance: string
    type: string
  }>
  roomsLeft?: number
  dealExpiry?: string
  urgency?: {
    viewing?: number
    lastBooked?: string
    percentBooked?: number
    message?: string
  }
  specialOffer?: {
    type: 'discount' | 'freebies' | 'package'
    description: string
    expiresAt?: string
  }
  paymentOptions: string[]
  distanceFromPopularLocations: Array<{
    name: string
    distance: string
    transportOptions?: string[]
  }>
  hostLanguages?: string[]
  offers?: Offer[]
}