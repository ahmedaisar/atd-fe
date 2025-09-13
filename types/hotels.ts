export interface HotelOffer {
  id: string
  title: string
  description: string
  originalPrice: number
  discountedPrice: number
  discountPercentage: number
  image: string
  location: string
  validUntil: Date
  badge?: string
  features: string[]
}

export interface TripType {
  id: string
  name: string
  description: string
  image: string
  icon: string
  popularDestinations: string[]
  averagePrice: number
  duration: string
}

export interface Atoll {
  id: string
  name: string
  country: string
  description: string
  image: string
  hotelCount: number
  averagePrice: number
  rating: number
  highlights: string[]
  bestTime: string
  coordinates: {
    lat: number
    lng: number
  }
}
