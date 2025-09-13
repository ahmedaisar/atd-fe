import type { DateRange } from "@/components/ui/calendar"

export interface SearchSuggestion {
  type: "city" | "hotel" | "landmark" | "airport"
  name: string
  country: string
  popularityScore: number
  coordinates?: { lat: number; lng: number }
  image?: string
}

export interface FlexibleDateOptions {
  exactDates: boolean
  flexibleDays: number // ±1, ±2, ±3 days
  weekendOnly: boolean
  monthView: boolean
}

export interface RecentSearch {
  id: string
  destination: string
  checkIn: Date
  checkOut: Date
  guests: {
    adults: number
    children: number
    rooms: number
    childrenAges: number[]
  }
  timestamp: Date
}

export interface AdvancedFilters {
  // Price & Rating
  priceRange: [number, number]
  starRating: number[]
  
  // Property characteristics
  propertyType: string[]
  chainBrands: string[]
  propertyAge: "new" | "renovated" | "any"
  sustainabilityCertified: boolean
  amenities: string[]
  
  // Location-based
  distanceFromCenter: [number, number]
  nearbyLandmarks: string[]
  neighborhoodTypes: string[]

  // Booking flexibility & Deals
  freeCancellation: boolean
  payAtProperty: boolean
  instantConfirmation: boolean
  deals: string[]

  // Guest experience
  reviewScoreByCategory: {
    cleanliness: number
    location: number
    service: number
    value: number
  }
}
