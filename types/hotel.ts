// Hotel related type definitions derived from MAP data structure (placeholder until real schema known)
export interface HotelRawRecord {
  id: string | number
  name: string
  rating?: number
  stars?: number
  latitude?: number
  longitude?: number
  address?: string
  country?: string
  city?: string
  region?: string
  thumbnailUrl?: string
  images?: string[]
  minPrice?: number
  currency?: string
  facilities?: string[]
  [key: string]: any // tolerate unknown fields from upstream
}

export interface HotelIndexRecord {
  id: string
  name: string
  rating: number | null
  stars: number | null
  lat: number | null
  lon: number | null
  minPrice: number | null
  currency: string | null
}

export interface FetchHotelsResultMeta {
  fetchedAt: string
  source: string
  total: number
  notes?: string
}

export interface FetchHotelsBundle {
  meta: FetchHotelsResultMeta
  hotels: HotelRawRecord[]
  index: HotelIndexRecord[]
}

export function buildIndex(records: HotelRawRecord[]): HotelIndexRecord[] {
  return records.map(r => ({
    id: String(r.id),
    name: r.name ?? '',
    rating: typeof r.rating === 'number' ? r.rating : null,
    stars: typeof r.stars === 'number' ? r.stars : null,
    lat: typeof r.latitude === 'number' ? r.latitude : null,
    lon: typeof r.longitude === 'number' ? r.longitude : null,
    minPrice: typeof r.minPrice === 'number' ? r.minPrice : null,
    currency: typeof r.currency === 'string' ? r.currency : null,
  }))
}
