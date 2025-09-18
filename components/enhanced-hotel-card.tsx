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
}: {
  isOpen: boolean
  onClose: () => void
  hotelName: string
  offers: Offer[]
  onBookClick: (offer: Offer) => void
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

  // Group offers by vendor
  const groupedOffers = filteredOffers.reduce((acc: { [key: string]: Offer[] }, offer) => {
    if (!acc[offer.partner_name]) {
      acc[offer.partner_name] = []
    }
    acc[offer.partner_name].push(offer)
    return acc
  }, {})

  const vendorNames = Object.keys(groupedOffers).sort((a, b) => {
    const aPrice = Math.min(...groupedOffers[a].map(o => o.price || 0))
    const bPrice = Math.min(...groupedOffers[b].map(o => o.price || 0))
    return aPrice - bPrice
  })

  const handleFilterChange = (filterKey: keyof typeof filters) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: !prev[filterKey]
    }))
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Share2 className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-gray-600">Share</span>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 max-w-md">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="prices" className="text-sm">Prices</TabsTrigger>
            <TabsTrigger value="photos" className="text-sm">Photos</TabsTrigger>
            <TabsTrigger value="reviews" className="text-sm">Reviews</TabsTrigger>
            <TabsTrigger value="info" className="text-sm">Info</TabsTrigger>
          </TabsList>
        </Tabs>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <span className="text-lg">×</span>
        </button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsContent value="prices" className="mt-0">
          {/* Filter checkboxes */}
          <div className="flex flex-wrap gap-4 p-4 bg-gray-50 border-b border-gray-200">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox 
                checked={filters.breakfastIncluded}
                onCheckedChange={() => handleFilterChange('breakfastIncluded')}
              />
              <span>Breakfast included</span>
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox 
                checked={filters.freeCancellation}
                onCheckedChange={() => handleFilterChange('freeCancellation')}
              />
              <span>Free cancellation</span>
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox 
                checked={filters.halfBoard}
                onCheckedChange={() => handleFilterChange('halfBoard')}
              />
              <span>Half board</span>
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox 
                checked={filters.allInclusive}
                onCheckedChange={() => handleFilterChange('allInclusive')}
              />
              <span>All-inclusive</span>
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox 
                checked={filters.fullBoard}
                onCheckedChange={() => handleFilterChange('fullBoard')}
              />
              <span>Full board</span>
            </label>
          </div>

          {/* Offers list */}
          <div className="p-4 space-y-3">
            {vendorNames.map((vendorName, index) => {
              const vendorOffers = groupedOffers[vendorName]
              const mainOffer = vendorOffers[0]
              const isLowestPrice = index === 0
              const additionalOffers = vendorOffers.slice(1)
              
              return (
                <VendorOfferCard
                  key={vendorName}
                  vendor={vendorName}
                  mainOffer={mainOffer}
                  additionalOffers={additionalOffers}
                  isLowestPrice={isLowestPrice}
                  onBookClick={onBookClick}
                />
              )
            })}
          </div>

          {/* Show all prices button */}
          <div className="p-4 border-t border-gray-200">
            <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded text-sm font-medium hover:bg-gray-200">
              Show all prices ∨
            </button>
          </div>
        </TabsContent>

        <TabsContent value="photos" className="p-4">
          <div className="text-center text-gray-500">
            Photos content would go here
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="p-4">
          <div className="text-center text-gray-500">
            Reviews content would go here
          </div>
        </TabsContent>

        <TabsContent value="info" className="p-4">
          <div className="text-center text-gray-500">
            Info content would go here
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

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
        "border rounded-lg p-4",
        isLowestPrice ? "bg-green-50 border-green-200" : "bg-white border-gray-200"
      )}>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            {/* Vendor logo */}
            <div className="w-8 h-6 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {vendor === "Priceline" && "P"}
                {vendor === "Hotels.com" && "H"}
                {vendor === "Agoda" && "A"}
                {vendor === "ATD Direct" && "ATD"}
                {vendor === "Trip.com" && "T"}
              </span>
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{vendor}</span>
                {vendor === "Priceline" && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Featured</span>
                )}
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

              {/* Show more link */}
              {additionalOffers.length > 0 && (
                <button
                  onClick={() => setShowMore(!showMore)}
                  className="text-blue-600 text-xs mt-2 hover:underline flex items-center gap-1"
                >
                  <ChevronDown className={cn("w-3 h-3 transition-transform", showMore && "rotate-180")} />
                  Show {additionalOffers.length} more prices from {vendor}
                </button>
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
              className="mt-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm px-4 py-1"
            >
              Visit site →
            </Button>
          </div>
        </div>
      </div>

      {/* Expandable table for additional offers */}
      {showMore && additionalOffers.length > 0 && (
        <div className="ml-8 bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
            <h4 className="text-sm font-medium text-gray-700">More prices from {vendor}</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room Type</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amenities</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total (4 nights)</th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {additionalOffers.map((offer, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900">{offer.room_name}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {includesBreakfast(offer) && (
                          <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                            <Check className="w-3 h-3" />
                            Breakfast
                          </span>
                        )}
                        {isRefundable(offer) && (
                          <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                            <Shield className="w-3 h-3" />
                            Free cancel
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="text-lg font-bold text-gray-900">{formatCurrency(offer.price || 0)}</div>
                      <div className="text-xs text-gray-500">per night</div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="text-sm font-medium text-gray-900">{formatCurrency((offer.price || 0) * 4)}</div>
                      <div className="text-xs text-gray-500">Includes all fees</div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Button
                        onClick={() => onBookClick(offer)}
                        className="bg-green-600 hover:bg-green-700 text-white rounded text-xs px-3 py-1"
                      >
                        Visit site
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
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
  // List view layout - pixel-perfect match to attached design
  return (
    <>
      <Card className="overflow-hidden border border-gray-200 shadow-sm">
        <div className="flex min-h-[160px]">
          {/* Left: Hotel Image Section - Fixed width matching screenshot */}
          <div className="relative w-60 flex-shrink-0">
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

          {/* Middle: Hotel Information - Takes remaining space */}
          <div className="flex-1 p-4">
            <div className="flex h-full">
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  {/* Hotel name and star rating */}
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                      {hotel.name}
                    </h3>
                    <div className="ml-2 flex items-center">
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
                <div className="flex items-center">
                  <div className="bg-green-600 text-white text-sm font-bold px-2 py-1 rounded mr-2">
                    9.7
                  </div>
                  <span className="text-sm font-medium text-gray-900">Excellent</span>
                  <span className="text-sm text-gray-600 ml-1">({hotel.reviewCount || '52'} ratings)</span>
                </div>
              </div>

              {/* Right: Pricing Section - Fixed width */}
              <div className="w-48 bg-green-50 border border-green-200 rounded-lg p-3 ml-4 flex flex-col">
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
                  <div className="text-sm text-gray-700">4 nights for ${(hotel.price * 4).toLocaleString()}</div>
                  <div className="text-xs text-gray-600 mt-1">includes all fees (excludes taxes)</div>
                </div>

                {/* View Deal button */}
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg mb-3">
                  View Deal →
                </Button>

                {/* Additional vendor prices */}
                <div className="space-y-1">
                  {/* <div className="flex justify-between text-sm">
                    <span className="text-gray-700">${hotel.offers?.[1]?.price || 602}</span>
                    <span className="text-gray-600">Hotels.com</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">${hotel.offers?.[2]?.price || 682}</span>
                    <span className="text-gray-600">Agoda</span>
                  </div> */}
                  
                  {/* Show more prices dropdown */}
                  {hotel.offers && hotel.offers.length > 0 && (
                    <div className="text-center pt-2">
                       {/* View All button */}
                      <Button
                        className="w-full font-medium py-2 rounded-lg mb-3 text-white"
                        style={{
                          background: "radial-gradient(circle at center -59px, #ffd178 0, #b5842d 83%, #a37220 100%)",
                        }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLButtonElement).style.background =
                            "radial-gradient(circle at center -59px, #e2b45c 0, #8c6a1c 83%, #7a5a13 100%)";
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLButtonElement).style.background =
                            "radial-gradient(circle at center -59px, #ffd178 0, #b5842d 83%, #a37220 100%)";
                        }}
                        onClick={() => setOffersDrawerOpen(!offersDrawerOpen)}
                      >
                        View All →
                      </Button>
                    </div>
                  )}
                </div>
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
          />
        </div>
      )}
    </>
  );
}
