import type { Offer } from "./price-aggregator";

export interface HotelImage {
  image_id: string;
  label: string;
}

export interface HotelQuality {
  review_count: number;
  review_rating: number;
  stars: number;
  stars_is_estimated: boolean;
  review_source: string;
}

export interface HotelLocation {
  coordinates: { lat: number; lng: number };
  address: string;
  city: string;
}

export interface HotelPosition {
  sorting: number;
  avail: number;
  "re-sorted": number;
}

export interface HotelBids {
  agda: string;
  expd: string;
  bkng: string;
  drbs: string;
  ctrp: string;
}

export interface HotelDistance {
  from: string;
  distance: number;
  time: number;
  means: string;
  means_type: string;
}

export interface HotelSpecs {
  bathrooms: number | null;
  beds: number | null;
  bedrooms: number | null;
  guests: number | null;
  square_meters: number | null;
}

export interface HotelOffer {
  price: number;
  brt?: string;
  rf?: string;
  brf?: number;
  rt?: number;
  vendor: string;
  vendor_id_raw: string;
  mota_code: string | null;
  direct_offer?: boolean;
  offer_flags?: string[];
  jc_code: string;
  ranking_index?: number;
  chain: string;
  free_cancellation?: boolean;
  special?: boolean;
  room_name: string;
  rooms?: Array<{ name: string; flags: string[] }>;
  offer_flags_new?: {
    breakfast?: string;
    refundable?: string;
  };
  partner_name: string;
  partner_logo: string;
}

export interface HotelCardDetails {
  // API response fields
  hs_id: number;
  slug: string;
  name: string;
  toa: string;
  covid_safe: boolean;
  amenities: Record<string, any>; // Object from API
  short_description: string;
  themes: string[];
  ty_id: string;
  chain: string;
  brand: string;
  rank: number;
  descriptions: Record<string, any>;
  chain_code: string | null;
  position: HotelPosition;
  bids: HotelBids;
  offers: HotelOffer[];
  worst_offer: number;
  best_offer: number;
  best_offer_ota: string;
  best_offer_mota: string | null;
  discount: number;
  offers_count: number;
  distance: number;
  images: HotelImage[];
  neighborhood: string | null;
  badge: string;
  distances: HotelDistance[];
  specs: HotelSpecs;
  toa_label: string;
  top_amenities: string[];
  quality: HotelQuality;
  location: HotelLocation;
  hero_offer: HotelOffer;
  ctrl_srt?: string;
  test_srt?: string;

  // Legacy/compatibility fields (mapped from API)
  id: string | number; // Maps to hs_id
  rating: number; // Maps to quality.review_rating
  description: string; // Maps to short_description
  reviewCount: number; // Maps to quality.review_count
  price: number; // Maps to best_offer
  originalPrice?: number; // Maps to worst_offer
  badges: string[]; // Maps to themes
  coordinates: { lat: number; lng: number }; // Maps to location.coordinates
  // Enhanced properties
  chainBrand?: string; // Maps to brand
  propertyType?: string; // Maps to toa
  starRating: number; // Maps to quality.stars
  sustainabilityCertified: boolean;
  freeCancellation: boolean; // Maps to hero_offer.free_cancellation
  payAtProperty: boolean;
  instantConfirmation: boolean;
  lastBooked?: string;
  popularityScore: number; // Maps to rank
  reviewScoreByCategory: {
    cleanliness: number;
    location: number;
    service: number;
    value: number;
  };
  nearbyLandmarks: Array<{
    name: string;
    distance: string;
    type: string;
  }>;
  roomsLeft?: number;
  dealExpiry?: string;
  urgency?: {
    viewing?: number;
    lastBooked?: string;
    percentBooked?: number;
    message?: string;
  };
  specialOffer?: {
    type: 'discount' | 'freebies' | 'package';
    description: string;
    expiresAt?: string;
  };
  paymentOptions: string[];
  distanceFromPopularLocations: Array<{
    name: string;
    distance: string;
    transportOptions?: string[];
  }>;
  hostLanguages?: string[];
}