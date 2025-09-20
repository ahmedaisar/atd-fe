"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Star,
  MapPin,
  Wifi,
  Car,
  Utensils,
  Waves,
  Heart,
  ChevronDown,
  Shield,
  CreditCard,
  Zap,
  Leaf,
  Clock,
  Eye,
  Flame,
  Percent,
  Gift,
  Languages,
  Coffee,
  Tv,
  Wind,
  Bath,
  Package,
  Share2,
  Check,
  ChevronRight
} from "lucide-react";
// ...existing code...
import Link from "next/link";
import { HotelCardDetails } from "@/types/hotel-card";

// For expandable offers
import { Offer } from "@/types/price-aggregator";

// --- OfferCard style for offers expansion (from hotel details page) ---
import Image from "next/image";
import { Award, ExternalLink } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

// Import reusable components
import { HotelImageSection } from "./hotel-card/hotel-image-section";
import { HotelInfoSection, HotelBadgesSection } from "./hotel-card/hotel-info-section";
import { HotelPriceSection, OffersToggleButton } from "./hotel-card/hotel-price-section";

function getOfferIcon(flagKey: string) {
  const iconMap: { [key: string]: any } = {
    breakfast: Coffee,
    refundable: Shield,
    pay_at_hotel: CreditCard,
  };
  const Icon = iconMap[flagKey] || Shield;
  return <Icon className="w-4 h-4" />;
}

// Standalone Offers Drawer Component - pixel perfect clone of screenshot
function OffersDrawer({
  isOpen,
  onClose,
  hotelName,
  offers,
  onBookClick,
  hotel,
}: {
  isOpen: boolean
  onClose: () => void
  hotelName: string
  offers: Offer[]
  onBookClick: (offer: Offer) => void
  hotel: HotelCardDetails & { images: HotelImage[] }
}) {
  const [activeTab, setActiveTab] = useState("prices")
  const [filters, setFilters] = useState({
    breakfastIncluded: false,
    freeCancellation: false,
    halfBoard: false,
    allInclusive: false,
    fullBoard: false,
  })

  if (!isOpen) return null;

  const formatCurrency = (amount: number, currency = "USD") =>
    new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount)

  // Filter offers based on selected filters
  const filteredOffers = offers.filter(offer => {
    if (filters.breakfastIncluded && !(offer.offer_flags_new && offer.offer_flags_new.breakfast)) return false
    if (filters.freeCancellation && !(offer.offer_flags_new && (offer.offer_flags_new.refundable || offer.free_cancellation))) return false
    // Add more filter logic as needed
    return true
  })

  // Sort all offers by price ascending
  const sortedOffers = filteredOffers.slice().sort((a, b) => (a.price || 0) - (b.price || 0));
  const [showAll, setShowAll] = useState(false);
  const visibleOffers = showAll ? sortedOffers : sortedOffers.slice(0, 3);

  const handleFilterChange = (filterKey: keyof typeof filters) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: !prev[filterKey]
    }))
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 md:p-4 border-b border-gray-200 gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Share2 className="w-4 h-4 text-gray-600 flex-shrink-0" />
          <span className="text-sm text-gray-600 truncate">Share</span>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto sm:flex-1 sm:max-w-md">
          <TabsList className="grid w-full grid-cols-4 h-9 md:h-10">
            <TabsTrigger value="prices" className="text-xs md:text-sm px-1 md:px-3">Prices</TabsTrigger>
            <TabsTrigger value="photos" className="text-xs md:text-sm px-1 md:px-3">Photos</TabsTrigger>
            <TabsTrigger value="reviews" className="text-xs md:text-sm px-1 md:px-3">Reviews</TabsTrigger>
            <TabsTrigger value="info" className="text-xs md:text-sm px-1 md:px-3">Info</TabsTrigger>
          </TabsList>
        </Tabs>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 flex-shrink-0 ml-2">
          <span className="text-lg md:text-xl">×</span>
        </button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsContent value="prices" className="mt-0 p-3 md:p-4">
          {/* Filter checkboxes */}
          <div className="flex flex-wrap gap-2 md:gap-4 p-3 md:p-4 bg-gray-50 border-b border-gray-200 rounded-t-lg">
            <label className="flex items-center gap-2 text-xs md:text-sm cursor-pointer">
              <Checkbox 
                checked={filters.breakfastIncluded}
                onCheckedChange={() => handleFilterChange('breakfastIncluded')}
                className="w-4 h-4 md:w-5 md:h-5"
              />
              <span>Breakfast included</span>
            </label>
            <label className="flex items-center gap-2 text-xs md:text-sm cursor-pointer">
              <Checkbox 
                checked={filters.freeCancellation}
                onCheckedChange={() => handleFilterChange('freeCancellation')}
                className="w-4 h-4 md:w-5 md:h-5"
              />
              <span>Free cancellation</span>
            </label>
            <label className="flex items-center gap-2 text-xs md:text-sm cursor-pointer">
              <Checkbox 
                checked={filters.halfBoard}
                onCheckedChange={() => handleFilterChange('halfBoard')}
                className="w-4 h-4 md:w-5 md:h-5"
              />
              <span>Half board</span>
            </label>
            <label className="flex items-center gap-2 text-xs md:text-sm cursor-pointer">
              <Checkbox 
                checked={filters.allInclusive}
                onCheckedChange={() => handleFilterChange('allInclusive')}
                className="w-4 h-4 md:w-5 md:h-5"
              />
              <span>All-inclusive</span>
            </label>
            <label className="flex items-center gap-2 text-xs md:text-sm cursor-pointer">
              <Checkbox 
                checked={filters.fullBoard}
                onCheckedChange={() => handleFilterChange('fullBoard')}
                className="w-4 h-4 md:w-5 md:h-5"
              />
              <span>Full board</span>
            </label>
          </div>

          {/* Offers list - show first 3, expand for all */}
          <div className="p-3 md:p-4 space-y-4">
            {visibleOffers.map((offer, index) => {
              // Use partner_name for display if available
              const displayName = offer.partner_name || offer.vendor;
              return (
                <VendorOfferCard
                  key={offer.partner_name + offer.price + index}
                  vendor={displayName}
                  mainOffer={offer}
                  additionalOffers={[]}
                  isLowestPrice={index === 0}
                  onBookClick={onBookClick}
                />
              );
            })}
          </div>

          {/* Show all prices button */}
          {sortedOffers.length > 3 && (
            <div className="p-3 md:p-4 border-t border-gray-200">
              <button
                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-xl text-base font-semibold hover:bg-gray-200 flex items-center justify-center"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? 'Hide prices' : `Show ${sortedOffers.length - 3} more prices`}
                <ChevronDown className={cn("ml-2 w-4 h-4 transition-transform", showAll && "rotate-180")} />
              </button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="photos" className="p-3 md:p-4">
          <div className="text-center text-gray-500">
            <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4">
              {hotel?.images && hotel.images.length > 0 ? (
                hotel.images.slice(0, 5).map((img: any, idx: number) => {
                  let url = '';
                  if (typeof img === 'object' && img !== null && 'image_id' in img && img.image_id) {
                    url = `//img1.hotelscan.com/640_440/1/${img.image_id}.jpg`;
                  } else if (typeof img === 'string' && img.match(/^\d+$/)) {
                    url = `//img1.hotelscan.com/640_440/1/${img}.jpg`;
                  } else if (typeof img === 'string' && img.startsWith('https')) {
                    url = img;
                  } else {
                    url = '/placeholder.svg';
                  }
                  return (
                    <div
                      key={idx}
                      className="rounded-lg md:rounded-xl -mr-2 md:-mr-4 mt-2 md:mt-4 p-1 bg-white dark:bg-neutral-800 dark:border-neutral-700 border border-neutral-100 shrink-0 overflow-hidden"
                      tabIndex={0}
                      style={{ transform: `rotate(${(Math.random() * 5 - 2.5).toFixed(6)}deg)`, zIndex: "auto" }}
                    >
                      <img
                        alt={`hotel image ${idx + 1}`}
                        width={500}
                        height={500}
                        className="rounded-md md:rounded-lg h-16 w-16 md:h-20 md:w-20 lg:h-32 lg:w-32 xl:h-40 xl:w-40 object-cover shrink-0"
                        src={url}
                      />
                    </div>
                  );
                })
              ) : (
                <div className="text-gray-400 text-sm md:text-base">No images available</div>
              )}
            </div>
            {hotel?.images && hotel.images.length > 6 && (
              <div className="mt-4">
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View all {hotel.images.length} photos
                </button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="p-4">
          <div className="space-y-6">
            {/* Review Rating Summary Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="text-4xl md:text-5xl font-bold text-gray-900">
                    {hotel.quality ? (hotel.quality.review_rating / 10).toFixed(1) : '0.0'}
                  </div>
                  <div className="text-lg text-gray-600">/ 10</div>
                </div>

                <div className="flex items-center justify-center mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 md:w-6 md:h-6 ${
                        i < Math.floor((hotel.quality?.stars || 0))
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'fill-gray-200 text-gray-200'
                      }`}
                    />
                  ))}
                </div>

                <div className="text-sm md:text-base text-gray-600 mb-4">
                  Based on {hotel.quality?.review_count || 0} reviews
                </div>

                <div className="text-center">
                  <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors">
                    <Eye className="w-4 h-4" />
                    View All Reviews
                  </button>
                </div>
              </div>
            </div>

            {/* Review Source */}
            {hotel.quality?.review_source && (
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  Reviews sourced from {hotel.quality.review_source}
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="info" className="p-3 md:p-4">
          <div className="space-y-4 md:space-y-6">
            {/* Hotel Description */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2 text-sm md:text-base">About this hotel</h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                {hotel.short_description?.trim() 
                  ? hotel.short_description 
                  : hotel.description?.trim() 
                    ? hotel.description 
                    : 'No description available.'}
              </p>
            </div>

            {/* Hotel Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-600">Location</span>
                </div>
                <p className="text-sm text-gray-900 ml-6">
                  {typeof hotel.location === 'object' ? hotel.location.address : hotel.location}
                </p>
                <p className="text-sm text-gray-600 ml-6">
                  {typeof hotel.location === 'object' ? hotel.location.city : 'City not specified'}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-600">Rating</span>
                </div>
                <p className="text-sm text-gray-900 ml-6">
                  {hotel.starRating || hotel.quality?.stars || 'Not rated'} stars
                </p>
                <p className="text-sm text-gray-600 ml-6">
                  {hotel.toa_label || 'Hotel'}
                </p>
              </div>
            </div>

            {/* Distance & Travel */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3 text-sm md:text-base">Location & Travel</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">Distance from city center</span>
                  <span className="text-sm text-gray-900">
                    {hotel.distance ? `${hotel.distance} km` : hotel.distance}
                  </span>
                </div>
                {hotel.distances && hotel.distances.length > 0 && (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">Travel time by car</span>
                    <span className="text-sm text-gray-900">
                      {Math.round(hotel.distances[0].time / 60)} minutes
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Hotel Features */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3 text-sm md:text-base">Hotel Features</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {hotel.specs?.bedrooms && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                    <span className="text-sm text-gray-700">
                      {hotel.specs.bedrooms} bedrooms
                    </span>
                  </div>
                )}
                {hotel.chain && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                    <span className="text-sm text-gray-700">
                      Part of {hotel.chain} chain
                    </span>
                  </div>
                )}
                {hotel.themes && hotel.themes.length > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                    <span className="text-sm text-gray-700">
                      {Array.isArray(hotel.themes) ? hotel.themes.join(', ') : hotel.themes}
                    </span>
                  </div>
                )}
                {hotel.badge && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                    <span className="text-sm text-gray-700">
                      {hotel.badge} certified
                    </span>
                  </div>
                )}
                {hotel.offers && hotel.offers.some((offer: any) => offer.free_cancellation) && (
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Free cancellation</span>
                  </div>
                )}
                {hotel.payAtProperty && (
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Pay at property</span>
                  </div>
                )}
              </div>
            </div>

            {/* Amenities */}
            {hotel.amenities && Object.keys(hotel.amenities).length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3 text-sm md:text-base">Amenities</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {Object.keys(hotel.amenities).slice(0, 8).map((amenityKey, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{amenityKey}</span>
                    </div>
                  ))}
                  {Object.keys(hotel.amenities).length > 8 && (
                    <div className="text-sm text-blue-600 col-span-1 sm:col-span-2">
                      +{Object.keys(hotel.amenities).length - 8} more amenities
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Policies */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3 text-sm md:text-base">Important Information</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Check-in time: 2:00 PM - 12:00 AM</p>
                <p>• Check-out time: 12:00 PM</p>
                <p>• Pets are not allowed</p>
                <p>• Children of all ages are welcome</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Vendor logo mapping (SVGs from public/vendors)
const vendorLogos: Record<string, string> = {
  "agda": "/vendors/agda-logo.svg",
  "booking.com": "/vendors/bkng-logo.svg",
  "Trip.com": "/vendors/ctrp-logo.svg",
  "Expedia": "/vendors/expd-logo.svg",
  "Hotels.com": "/vendors/htls-logo.svg",
  "Ostrovok": "/vendors/ostr-logo.svg",
  "Stayflexi": "/vendors/stfl-logo.svg",
};

// Individual vendor offer card component
function VendorOfferCard({
  vendor,
  mainOffer,
  additionalOffers,
  isLowestPrice,
  onBookClick,
}: {
  vendor: string
  mainOffer: Offer
  additionalOffers: Offer[]
  isLowestPrice: boolean
  onBookClick: (offer: Offer) => void
}) {
  const [showMore, setShowMore] = useState(false)
  const formatCurrency = (amount: number) => `$${amount}`

  const includesBreakfast = (offer: Offer) => !!(offer.offer_flags_new && offer.offer_flags_new.breakfast)
  const isRefundable = (offer: Offer) => !!(offer.offer_flags_new && (offer.offer_flags_new.refundable || offer.free_cancellation))

  return (
    <div className="space-y-2">
      {/* Main offer */}
      <div className={cn(
        "rounded-xl shadow-sm p-4 border",
        isLowestPrice ? "bg-green-50 border-green-200" : "bg-white border-gray-200"
      )}>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            {/* Vendor logo from API or text fallback */}
            <div className="w-16 h-10 rounded flex items-center justify-center bg-transparent">
              {mainOffer.partner_logo ? (
                <Image src={mainOffer.partner_logo} alt={mainOffer.partner_name || vendor} width={64} height={32} className="object-contain max-h-10 max-w-full drop-shadow-sm" />
              ) : (
                <span className="text-gray-700 text-base font-semibold px-2 py-1 bg-gray-50 rounded-lg">{mainOffer.partner_name || vendor}</span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{vendor}</span>
                {isLowestPrice && (
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">Our lowest price</span>
                )}
              </div>
              <div className="text-xs text-gray-600 mt-1">{mainOffer.room_name}</div>
              {/* Amenities */}
              <div className="flex items-center gap-3 mt-2">
                {isRefundable(mainOffer) && (
                  <div className="flex items-center gap-1 text-green-600 text-xs">
                    <Check className="w-3 h-3" />
                    <span>Free cancellation before Sep 21</span>
                  </div>
                )}
                {includesBreakfast(mainOffer) && (
                  <div className="flex items-center gap-1 text-green-600 text-xs">
                    <Check className="w-3 h-3" />
                    <span>Breakfast included</span>
                  </div>
                )}
              </div>
                {/* Collapsible for additional offers */}
                {additionalOffers.length > 0 && (
                  <Collapsible open={showMore} onOpenChange={setShowMore} className="mt-2">
                    <CollapsibleTrigger asChild>
                      <button
                        type="button"
                        className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-xl text-base font-semibold hover:bg-gray-200 flex items-center justify-center border border-gray-200"
                        aria-expanded={showMore}
                        style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
                      >
                        Show {additionalOffers.length} more prices from {vendor}
                        <ChevronDown className={cn("ml-2 w-4 h-4 transition-transform", showMore && "rotate-180")} />
                      </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent forceMount>
                      <div className="mt-2">
                        {additionalOffers.map((offer, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 border-b last:border-b-0 bg-gray-50 rounded-lg mb-2">
                            <div>
                              <div className="font-medium text-sm text-gray-900">{offer.room_name}</div>
                              <div className="flex items-center gap-2 mt-1">
                                {isRefundable(offer) && (
                                  <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded">
                                    <Check className="w-3 h-3" /> Free cancel
                                  </span>
                                )}
                                {includesBreakfast(offer) && (
                                  <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded">
                                    <Check className="w-3 h-3" /> Breakfast
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-gray-900">{formatCurrency(offer.price || 0)}</div>
                              <div className="text-xs text-gray-500">4 nights for {formatCurrency((offer.price || 0) * 4)}</div>
                              <Button
                                onClick={() => onBookClick(offer)}
                                className="sm:bg-gold-100 hover:bg-gold-100-hover text-white rounded text-xs px-3 py-1 mt-2"
                              >
                                Visit site
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                )}
            </div>
          </div>
          {/* Price and button */}
          <div className="text-right">
            <div className="text-2xl font-bold">{formatCurrency(mainOffer.price || 0)}</div>
            <div className="text-xs text-gray-600 mt-1">
              4 nights for {formatCurrency((mainOffer.price || 0) * 4)}
            </div>
            <div className="text-xs text-gray-500">Includes all fees (excludes taxes)</div>
            <Button
              onClick={() => onBookClick(mainOffer)}
              className="mt-2 sm:bg-gold-100 hover:bg-gold-100-hover text-white rounded text-sm px-4 py-1"
            >
              Visit site →
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

  function OfferCard({ offer, isHero, savings, rank, onBookClick, showDetailsBtn, hotelId }: {
    offer: Offer;
    isHero?: boolean;
    savings?: number;
    rank: number;
    onBookClick: (offer: Offer) => void;
    showDetailsBtn?: boolean;
    hotelId?: string | number;
  }) {
  return (
  <div className={`relative p-3 md:p-4 rounded-lg border bg-white shadow-sm mb-3 ${isHero ? 'ring-2 ring-blue-500 bg-gradient-to-br from-blue-50 to-white' : ''}`}>
      {/* Header: Logo + Partner/Badge on left, Price on right */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-8 relative bg-gray-100 rounded flex items-center justify-center flex-shrink-0 border border-gray-200">
            <Image src={offer.partner_logo} alt={offer.partner_name} width={48} height={32} className="max-w-full max-h-full object-contain rounded" />
          </div>
          <div className="min-w-0">
            <div className="font-bold text-sm md:text-base text-gray-800 line-clamp-1 flex items-center gap-2">
              {offer.partner_name}
              {rank <= 3 && (
                <span className={`ml-1 md:ml-2 px-1.5 md:px-2 py-0.5 rounded text-[10px] md:text-xs flex items-center gap-1 ${rank === 1 ? 'bg-yellow-500 text-white' : rank === 2 ? 'bg-gray-400 text-white' : 'bg-orange-500 text-white'}`}>
                  <Award className="w-3 h-3" />#{rank} Best Price
                </span>
              )}
            </div>
            <div className="text-[11px] md:text-xs text-gray-500 line-clamp-2">{offer.room_name}</div>
          </div>
        </div>
        <div className="text-right shrink-0">
          {savings && savings > 5 && (
            <div className="bg-green-100 text-green-700 text-[10px] md:text-xs px-2 py-0.5 rounded mb-1 inline-block">{savings}% OFF</div>
          )}
          <div className="text-xl md:text-2xl font-bold text-blue-700">${offer.price}</div>
        </div>
      </div>

      {/* Flags */}
      <div className="flex flex-wrap gap-1.5 md:gap-2 mt-2">
        {offer.offer_flags_new && Object.entries(offer.offer_flags_new).map(([key, value]) => (
          <span key={key} className="inline-flex items-center gap-1 text-[10px] md:text-xs text-blue-700 bg-blue-50 rounded px-1.5 md:px-2 py-0.5 whitespace-nowrap">
            {getOfferIcon(key)}
            {value}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-3">
        <button
          onClick={() => onBookClick(offer)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm flex items-center gap-1 w-full justify-center"
        >
          Book <ExternalLink className="w-4 h-4" />
        </button>
        {showDetailsBtn && hotelId && (
          <a href={`/hotel/${hotelId}`} target="_blank" rel="noopener noreferrer" className="w-full">
            <button className="bg-gray-100 hover:bg-gray-200 text-blue-700 px-4 py-2 rounded text-sm border border-blue-200 flex items-center gap-1 w-full justify-center">
              View Details
            </button>
          </a>
        )}
      </div>
    </div>
  );
}

type HotelImage = string | { image_id: string };
interface EnhancedHotelCardProps {
  hotel: HotelCardDetails & { images: HotelImage[] };
  viewMode: "list" | "grid";
}


export function EnhancedHotelCard({ hotel, viewMode }: EnhancedHotelCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [offersDrawerOpen, setOffersDrawerOpen] = useState(false);

  // Process offers for grouping by vendor
  const offers = hotel.offers as Offer[] || []
  const groupedOffers = offers.reduce((acc: Offer[][], offer) => {
    const existingGroup = acc.find(group => group[0].partner_name === offer.partner_name)
    if (existingGroup) {
      existingGroup.push(offer)
    } else {
      acc.push([offer])
    }
    return acc
  }, []).sort((a, b) => (a[0].price || 0) - (b[0].price || 0))

  // Handle booking analytics
  const handleBookingClick = (offer: Offer) => {
    // Analytics tracking
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'book_hotel', {
        event_category: 'hotel_booking',
        event_label: `${hotel.name} - ${offer.partner_name}`,
        value: offer.price,
      })
    }
    
    // Open booking URL
    if (offer.booking_url) {
      window.open(offer.booking_url, '_blank')
    }
  }

  // Always map images to an array of URLs for rendering
  const imageUrls: string[] = Array.isArray(hotel.images)
    ? hotel.images.map((img: any) => {
        if (typeof img === 'object' && img !== null && 'image_id' in img && img.image_id) {
          return `//img1.hotelscan.com/640_440/1/${img.image_id}.jpg`;
        } else if (typeof img === 'string' && img.match(/^\d+$/)) {
          // If string and looks like an image_id
          return `//img1.hotelscan.com/640_440/1/${img}.jpg`;
        } else if (typeof img === 'string' && img.startsWith('https')) {
          // If already a full URL
          return img;
        } else {
          return '/placeholder.svg';
        }
      })
    : ['/placeholder.svg'];

  const amenityIcons: Record<string, any> = {
    "WiFi": Wifi,
    "Free WiFi": Wifi,
    "Pool": Waves,
    "Swimming Pool": Waves,
    "Restaurant": Utensils,
    "Free Parking": Car,
    "Parking": Car,
    "Breakfast": Coffee,
    "AC": Wind,
    "Air Conditioning": Wind,
    "TV": Tv,
    "Bathtub": Bath
  };

  // Discount calculation based on aggregator fields
  const discount = hotel.originalPrice && hotel.originalPrice > hotel.price
    ? Math.round(((hotel.originalPrice - hotel.price) / hotel.originalPrice) * 100)
    : 0;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % imageUrls.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);
  };


  // List view layout - pixel-perfect match to attached design
  return (
    <>
      <Card className="overflow-hidden border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row min-h-[160px]">
          {/* Image section - full width on mobile, fixed on desktop */}
          <div className="relative w-full h-48 sm:h-56 md:w-60 md:h-auto flex-shrink-0">
            <HotelImageSection
              imageUrls={imageUrls}
              hotelName={hotel.name}
              discount={discount}
              starRating={hotel.starRating}
              isWishlisted={isWishlisted}
              onWishlistToggle={() => setIsWishlisted(!isWishlisted)}
              isListView={true}
            />
          </div>

          {/* Info and price - stack vertically on mobile, horizontally on desktop */}
          <div className="flex-1 p-4 flex flex-col md:flex-row gap-4">
            {/* Info section */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                {/* Hotel name and star rating */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                    {hotel.name}
                  </h3>
                  <div className="mt-2 md:mt-0 flex items-center">
                    {/* Star rating display */}
                    <div className="flex items-center text-orange-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3 h-3 ${
                            i < Math.floor(hotel.starRating || 5) 
                              ? 'fill-orange-400' 
                              : 'fill-gray-200'
                          }`} 
                        />
                      ))}
                    </div>
                    <span className="ml-1 text-xs text-gray-600">Resort</span>
                  </div>
                </div>

                {/* Hotel features */}
                <div className="text-sm text-gray-700 mb-2">
                  <div className="flex items-start">
                    <span className="mr-2 mt-0.5">+</span>
                    <span>Thatched-Roof Villas with Ocean Views, Two Turquoise Pools and Waterside Lounge</span>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>11.8 miles to City center</span>
                </div>
              </div>

              {/* Rating score - positioned at bottom */}
              <div className="flex items-center mt-2">
                <div className="bg-green-600 text-white text-sm font-bold px-2 py-1 rounded mr-2">
                  {hotel.quality?.review_rating
                    ? (hotel.quality.review_rating / 10).toFixed(1)
                    : "0.0"}
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {hotel.quality?.review_rating
                    ? hotel.quality.review_rating >= 90
                      ? "Excellent"
                      : hotel.quality.review_rating >= 80
                      ? "Very Good"
                      : hotel.quality.review_rating >= 70
                      ? "Good"
                      : "Average"
                    : "No reviews"}
                </span>
                <span className="text-sm text-gray-600 ml-1">
                  ({hotel.quality?.review_count ?? "0"} ratings)
                </span>
              </div>
            </div>

            {/* Price section - full width on mobile, fixed on desktop */}
            <div className="w-full md:w-48 bg-green-50 border border-green-200 rounded-lg p-3 flex flex-col justify-between">
              {/* "Our lowest price" badge */}
              <div className="text-center mb-3">
                <div className="inline-block bg-white border border-red-400 text-red-600 text-xs font-medium px-3 py-1 rounded-full mb-2">
                  Our lowest price
                </div>
              </div>

              {/* Vendor name */}
              <div className="text-center mb-2">
                <div className="text-sm font-medium text-gray-900">Priceline</div>
              </div>

              {/* Breakfast included check */}
              <div className="flex items-center justify-center text-green-700 text-sm mb-3">
                <Check className="w-4 h-4 mr-1" />
                <span>Breakfast included</span>
              </div>

              {/* Price display */}
              <div className="text-center mb-4 flex-1 flex flex-col justify-center">
                <div className="text-3xl font-bold text-gray-900">${hotel.price}</div>
                <div className="text-sm text-gray-700">4 nights for {(hotel.price * 4).toLocaleString()}</div>
                <div className="text-xs text-gray-600 mt-1">includes all fees (excludes taxes)</div>
              </div>

              {/* View Deal button */}
              <Button onClick={() => setOffersDrawerOpen(!offersDrawerOpen)} className="w-full sm:bg-gold-100 hover:bg-gold-100-hover text-white font-medium py-2 rounded-lg mb-3">
                View Deals →
              </Button>


              {/* Additional vendor prices */}
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">${hotel.offers?.[1]?.price || 602}</span>
                    <span className="text-gray-600">{hotel.offers?.[1]?.partner_name || ""}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">${hotel.offers?.[2]?.price || 682}</span>
                  <span className="text-gray-600">{hotel.offers?.[2]?.partner_name || ""}</span>
                </div>
                {/* Show more prices dropdown */}
                {/* {hotel.offers && hotel.offers.length > 0 && (
                  <div className="text-center pt-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-gray-600 hover:text-gray-800 p-0 h-auto"
                      onClick={() => setOffersDrawerOpen(!offersDrawerOpen)}
                    >
                      <ChevronDown className={`w-4 h-4 transition-transform ${offersDrawerOpen ? 'rotate-180' : ''}`} />
                    </Button>
                  </div>
                )} */}
              </div>
            </div>
          </div>
        </div>
      </Card>
      {/* Standalone Offers Drawer */}
      {hotel.offers && hotel.offers.length > 0 && offersDrawerOpen && (
        <div className="mt-2 mb-4">
          <OffersDrawer
            isOpen={offersDrawerOpen}
            onClose={() => setOffersDrawerOpen(false)}
            hotelName={hotel.name}
            offers={offers}
            onBookClick={handleBookingClick}
            hotel={hotel}
          />
        </div>
      )}
    </>
  );
}
