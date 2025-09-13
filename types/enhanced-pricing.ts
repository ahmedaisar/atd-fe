export interface EnhancedPricing {
  basePrice: number
  taxes: number
  fees: {
    resort?: number
    cleaning?: number
    service?: number
    booking?: number
  }
  totalPrice: number
  pricePerNight: number
  savingsAmount?: number
  priceComparison?: {
    otherSites: Array<{
      siteName: string
      price: number
      available: boolean
    }>
  }
  priceHistory?: {
    trend: "up" | "down" | "stable"
    lowestPrice30Days: number
    averagePrice30Days: number
    priceChangePercentage: number
  }
  memberPricing?: {
    memberPrice: number
    memberSavings: number
    loyaltyPoints: number
  }
  dynamicPricing?: {
    demandLevel: "low" | "medium" | "high"
    urgencyMessage?: string
    priceValidUntil?: Date
  }
}

export interface EnhancedRoomDetails {
  id: string
  name: string
  images: {
    main: string[]
    bathroom: string[]
    view: string[]
    amenities: string[]
  }
  virtualTour?: string
  floorPlan?: string
  roomFeatures: {
    size: number
    bedTypes: Array<{
      type: string
      count: number
      size: string
    }>
    maxOccupancy: {
      adults: number
      children: number
      infants: number
    }
    accessibility: string[]
    view: string
    floor: string
  }
  availabilityCalendar: Record<
    string,
    {
      available: boolean
      price: number
      restrictions?: string[]
      minStay?: number
    }
  >
  amenities: {
    category: string
    items: Array<{
      name: string
      description: string
      icon: string
      premium?: boolean
    }>
  }[]
  policies: {
    checkIn: string
    checkOut: string
    cancellation: string
    smoking: boolean
    pets: boolean
    children: string
  }
}
