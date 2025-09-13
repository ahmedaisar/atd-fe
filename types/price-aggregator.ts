// Price Aggregator Types based on API response structure

export interface ApiMeta {
  status: string
  cached: boolean
  count: number
  debug: {
    ticket: {
      ticket_id: string
      created_at: number
      loop: any
      snapped_at: any
      snapshot_id: any
      snapshot_ttl: number
      executions: number
      progress: number
      save_errors: any[]
    }
    properties_total: number
  }
}

export interface OfferFlags {
  breakfast?: string
  refundable?: string
  pay_at_hotel?: string
}

export interface Room {
  name: string
  flags: string[]
}

export interface Offer {
  price: number
  brt?: string
  rf?: string
  brf?: number
  rt?: number
  vendor: string
  vendor_id_raw: string
  mota_code?: string
  direct_offer?: boolean
  offer_flags?: string[] | OfferFlags
  jc_code?: string
  ranking_index?: number
  chain?: string
  free_cancellation?: boolean
  special?: boolean
  room_name: string
  rooms?: Room[]
  booking_url? : string
  offer_flags_new?: OfferFlags
  partner_name: string
  partner_logo: string
}

export interface HeroOffer extends Offer {
  offer_flags: OfferFlags // Required for hero offer, but can be object format
}

export interface HotelImage {
  image_id: string
  label: string
}

export interface Distance {
  from: string
  distance: number
  time: number
  means: string
  means_type: string
}

export interface Specs {
  bathrooms?: number
  beds?: number
  bedrooms?: number
  guests?: number
  square_meters?: number
}

export interface Quality {
  review_count: number
  review_rating: number
  stars: number
  stars_is_estimated: boolean
  review_source: string
}

export interface Coordinates {
  lat: number
  lng: number
}

export interface Location {
  coordinates: Coordinates
  address: string
  city: string
}

export interface Building {
  room_num: number
}

export interface Bids {
  [key: string]: string
}

export interface HotelRecord {
  hs_id: number
  slug: string
  name: string
  toa: string
  covid_safe: boolean
  amenities: Record<string, any>
  building: Building
  short_description: string
  chain: string
  brand: string
  rank: number
  descriptions: Record<string, any>
  chain_code?: string | null
  position: {
    sorting: number
    avail: number
    "re-sorted": number
  }
  bids: Bids
  offers: Offer[]
  worst_offer: number
  best_offer: number
  best_offer_ota: string
  best_offer_mota?: string | null
  discount: number
  offers_count: number
  distance: number
  images: HotelImage[]
  neighborhood?: string | null
  badge?: string | null
  distances: Distance[]
  specs: Specs
  toa_label: string
  top_amenities: string[]
  quality: Quality
  location: Location
  hero_offer: HeroOffer
  ctrl_srt?: string
  test_srt?: string
}

export interface PriceFilter {
  lower: number
  current_lower: number
  upper: number
  current_upper: number
  avg: number
  values: Array<{
    x0: number
    x: number
    y: number
  }>
}

export interface DistanceFilter {
  lower: number
  upper: number
}

export interface Filters {
  rating: number[]
  stars: number[]
  toas: string[]
  extra_filters: string[]
  price: PriceFilter
  distance: DistanceFilter
}

export interface QueryInfo {
  pos: string
}

export interface ApiResponse {
  _meta: ApiMeta
  data: {
    records: HotelRecord[]
    filters: Filters
    query: QueryInfo
  }
}

// UI Component Types
export interface GroupedOffers {
  [roomType: string]: Offer[]
}

export interface PriceComparisonProps {
  hotelId: string
}

export interface OfferCardProps {
  offer: Offer
  isHero?: boolean
  onBookClick: (offer: Offer) => void
  savings?: number
}

export interface CustomQuoteProps {
  hotelName: string
  onQuoteRequest: () => void
}

// Conversion tracking
export interface ConversionEvent {
  hotel_id: string
  vendor: string
  price: number
  room_type: string
  timestamp: number
  user_session?: string
}