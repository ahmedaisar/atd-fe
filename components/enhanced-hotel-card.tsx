"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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
  Package
} from "lucide-react";
// ...existing code...
import Link from "next/link";
import { HotelCardDetails } from "@/types/hotel-card";

// For expandable offers
import { Offer } from "@/types/price-aggregator";

// --- OfferCard style for offers expansion (from hotel details page) ---
import Image from "next/image";
import { Award, ExternalLink } from "lucide-react";

function getOfferIcon(flagKey: string) {
  const iconMap: { [key: string]: any } = {
    breakfast: Coffee,
    refundable: Shield,
    pay_at_hotel: CreditCard,
  };
  const Icon = iconMap[flagKey] || Shield;
  return <Icon className="w-4 h-4" />;
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
  <div className={`relative flex flex-col md:flex-row items-center gap-3 md:gap-4 p-3 md:p-4 rounded-lg border bg-white shadow-sm mb-3 ${isHero ? 'ring-2 ring-blue-500 bg-gradient-to-br from-blue-50 to-white' : ''}`}>
      <div className="flex items-center gap-3 min-w-0 flex-1 w-full">
        <div className="w-12 h-8 relative bg-gray-100 rounded flex items-center justify-center flex-shrink-0 border border-gray-200">
          <Image src={offer.partner_logo} alt={offer.partner_name} width={48} height={32} className="max-w-full max-h-full object-contain rounded" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-bold text-sm md:text-base text-gray-800 truncate flex items-center gap-2">
            {offer.partner_name}
            {rank <= 3 && (
              <span className={`ml-2 px-1.5 md:px-2 py-0.5 rounded text-[10px] md:text-xs flex items-center gap-1 ${rank === 1 ? 'bg-yellow-500 text-white' : rank === 2 ? 'bg-gray-400 text-white' : 'bg-orange-500 text-white'}`}>
                <Award className="w-3 h-3" />#{rank} Best Price
              </span>
            )}
          </div>
          <div className="text-[11px] md:text-xs text-gray-500 truncate">{offer.room_name}</div>
          <div className="flex flex-wrap gap-1.5 md:gap-2 mt-1">
            {offer.offer_flags_new && Object.entries(offer.offer_flags_new).map(([key, value]) => (
              <span key={key} className="inline-flex items-center gap-1 text-[10px] md:text-xs text-blue-700 bg-blue-50 rounded px-1.5 md:px-2 py-0.5 whitespace-nowrap">
                {getOfferIcon(key)}
                {value}
              </span>
            ))}
          </div>
        </div>
      </div>
  <div className="flex w-full md:w-auto flex-col items-end md:items-end gap-2">
        {savings && savings > 5 && (
          <span className="bg-green-100 text-green-700 text-[10px] md:text-xs px-2 py-0.5 rounded mb-1 self-start md:self-auto">{savings}% OFF</span>
        )}
        <div className="text-xl md:text-lg font-bold text-blue-700">${offer.price}</div>
        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={() => onBookClick(offer)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-sm flex items-center gap-1 w-full md:w-auto justify-center"
          >
            Book <ExternalLink className="w-4 h-4" />
          </button>
          {showDetailsBtn && hotelId && (
            <a href={`/hotel/${hotelId}`} target="_blank" rel="noopener noreferrer">
              <button className="bg-gray-100 hover:bg-gray-200 text-blue-700 px-4 py-1.5 rounded text-sm border border-blue-200 flex items-center gap-1 w-full md:w-auto justify-center mt-0">
                View Details
              </button>
            </a>
          )}
        </div>
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


  // Grid view layout (refactored for aggregator data, expandable offers placeholder)
  if (viewMode === "grid") {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
        <div className="relative">
          {/* ...existing image and badge code... */}
          <div className="relative h-48 overflow-hidden">
            <Image
              src={imageUrls[currentImageIndex] || "/placeholder.svg"}
              alt={hotel.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute bottom-0 left-0 right-0 p-2 flex justify-between items-center">
              <button 
                onClick={prevImage} 
                className="p-1 bg-white/70 rounded-full hover:bg-white"
                aria-label="Previous image"
              >
                <ChevronDown className="w-4 h-4 rotate-90" />
              </button>
              <span className="text-xs bg-black/60 text-white px-2 py-1 rounded-full">
                {currentImageIndex + 1}/{imageUrls.length}
              </span>
              <button 
                onClick={nextImage} 
                className="p-1 bg-white/70 rounded-full hover:bg-white"
                aria-label="Next image"
              >
                <ChevronDown className="w-4 h-4 -rotate-90" />
              </button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 bg-white/80 hover:bg-white"
              onClick={() => setIsWishlisted(!isWishlisted)}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
            {discount > 0 && <Badge className="absolute top-2 left-2 bg-red-500 text-white">-{discount}%</Badge>}
            {hotel.starRating > 0 && (
              <Badge className="absolute bottom-12 left-2 bg-yellow-500/90 text-white">
                {Array.from({ length: Math.min(5, Math.round(hotel.starRating)) }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-white" />
                ))}
              </Badge>
            )}
          </div>
        </div>
        <CardContent className="p-3 md:p-4">
          <h3 className="font-semibold text-base md:text-lg line-clamp-2">{hotel.name}</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600 mt-2">
            <MapPin className="w-4 h-4" />
            <span>{hotel.location}</span>
          </div>
          <div className="flex items-center space-x-2 mt-1 md:mt-2">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{hotel.rating}</span>
            </div>
            <span className="text-sm text-gray-600">({hotel.reviewCount} reviews)</span>
          </div>
          <div className="flex flex-wrap gap-1.5 md:gap-2 mt-2 md:mt-3">
            {hotel.freeCancellation && (
              <Badge variant="outline" className="text-xs text-green-600 border-green-200">
                <Shield className="w-3 h-3 mr-1" />
                Free Cancellation
              </Badge>
            )}
            {hotel.payAtProperty && (
              <Badge variant="outline" className="text-xs text-blue-600 border-blue-200">
                <CreditCard className="w-3 h-3 mr-1" />
                Pay Later
              </Badge>
            )}
            {hotel.urgency?.percentBooked && hotel.urgency.percentBooked > 70 && (
              <Badge variant="outline" className="text-xs text-red-600 border-red-200">
                <Flame className="w-3 h-3 mr-1" />
                {hotel.urgency.percentBooked}% Booked
              </Badge>
            )}
          </div>
          {hotel.amenities && hotel.amenities.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {hotel.amenities.slice(0, 3).map((amenity) => {
                const Icon = amenityIcons[amenity as keyof typeof amenityIcons];
                return (
                  <div key={amenity} className="flex items-center space-x-1 text-xs text-gray-600">
                    {Icon && <Icon className="w-3 h-3" />}
                    <span>{amenity}</span>
                  </div>
                );
              })}
            </div>
          )}
          <div className="flex items-end justify-between mt-3 md:mt-4 pt-3 border-t">
            <div>
              {hotel.originalPrice && (
                <span className="text-gray-500 line-through text-sm">${hotel.originalPrice}</span>
              )}
              <div className="flex items-baseline space-x-1">
                <span className="text-xl md:text-2xl font-bold text-blue-600">${hotel.price}</span>
                <span className="text-xs md:text-sm text-gray-600">/night</span>
              </div>
            </div>
          </div>
          {/* Expandable offers section - OfferCard style */}
          <div className="mt-3 md:mt-4">
            <Collapsible>
              <div className="flex items-center justify-between border-b pb-2">
                <div className="font-medium text-sm">Best Offer</div>
                <div className="flex items-center gap-1.5 md:gap-2">
                  <Link href={`/hotel/${hotel.id}`}>
                    <Button variant="outline" size="sm" className="text-[11px] md:text-xs px-2 md:px-3">Hotel Details</Button>
                  </Link>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-[11px] md:text-xs px-2 md:px-3">
                      View All Offers
                      <ChevronDown className="w-3 h-3 ml-1" />
                    </Button>
                  </CollapsibleTrigger>
                </div>
              </div>
              {/* Best offer summary (first offer) */}
              {hotel.offers && hotel.offers.length > 0 && (
                <OfferCard
                  offer={hotel.offers[0]}
                  isHero={true}
                  savings={undefined}
                  rank={1}
                  onBookClick={(offer) => {
                    if (offer.booking_url) window.open(offer.booking_url, '_blank', 'noopener,noreferrer');
                  }}
                  showDetailsBtn={false}
                  hotelId={hotel.id}
                />
              )}
              {/* Expandable offers list */}
              <CollapsibleContent>
                <div className="mt-2">
                  {hotel.offers && hotel.offers.length > 0 ? (
                    hotel.offers.map((offer: Offer, idx: number) => (
                      <OfferCard
                        key={idx}
                        offer={offer}
                        isHero={idx === 0}
                        savings={undefined}
                        rank={idx + 1}
                        onBookClick={(offer) => {
                          if (offer.booking_url) window.open(offer.booking_url, '_blank', 'noopener,noreferrer');
                        }}
                        showDetailsBtn={false}
                        hotelId={hotel.id}
                      />
                    ))
                  ) : (
                    <div className="text-center py-2 text-gray-400">No offers available</div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </CardContent>
      </Card>
    );
  }

  // List view layout with OfferCard style for offers expansion
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="flex flex-col md:flex-row">
        <div className="relative w-full md:w-1/3 lg:w-1/4">
          <div className="relative h-44 md:h-full overflow-hidden">
            <Image
              src={imageUrls[currentImageIndex] || "/placeholder.svg"}
              alt={hotel.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute bottom-0 left-0 right-0 p-2 flex justify-between items-center">
              <button 
                onClick={prevImage} 
                className="p-1 bg-white/70 rounded-full hover:bg-white"
                aria-label="Previous image"
              >
                <ChevronDown className="w-4 h-4 rotate-90" />
              </button>
              <span className="text-xs bg-black/60 text-white px-2 py-1 rounded-full">
                {currentImageIndex + 1}/{imageUrls.length}
              </span>
              <button 
                onClick={nextImage} 
                className="p-1 bg-white/70 rounded-full hover:bg-white"
                aria-label="Next image"
              >
                <ChevronDown className="w-4 h-4 -rotate-90" />
              </button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 bg-white/80 hover:bg-white"
              onClick={() => setIsWishlisted(!isWishlisted)}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
            {discount > 0 && <Badge className="absolute top-2 left-2 bg-red-500 text-white">-{discount}%</Badge>}
            {hotel.starRating > 0 && (
              <Badge className="absolute bottom-12 left-2 bg-yellow-500/90 text-white">
                {Array.from({ length: Math.min(5, Math.round(hotel.starRating)) }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-white" />
                ))}
              </Badge>
            )}
          </div>
        </div>

  <div className="flex-1 p-3 md:p-4">
          <div className="flex flex-col md:flex-row md:justify-between">
            <div>
              <h3 className="font-semibold text-lg md:text-xl">{hotel.name}</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-600 mt-2">
                <MapPin className="w-4 h-4" />
                <span>{hotel.location}</span>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{hotel.rating}</span>
                </div>
                <span className="text-sm text-gray-600">({hotel.reviewCount} reviews)</span>
              </div>
            </div>
            <div className="mt-3 md:mt-0 md:text-right">
              {hotel.originalPrice && (
                <span className="text-gray-500 line-through text-sm">${hotel.originalPrice}</span>
              )}
              <div className="flex items-baseline space-x-1 md:justify-end">
                <span className="text-2xl font-bold text-blue-600">${hotel.price}</span>
                <span className="text-sm text-gray-600">/night</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 md:gap-2 mt-2 md:mt-3">
            {hotel.freeCancellation && (
              <Badge variant="outline" className="text-xs text-green-600 border-green-200">
                <Shield className="w-3 h-3 mr-1" />
                Free Cancellation
              </Badge>
            )}
            {hotel.payAtProperty && (
              <Badge variant="outline" className="text-xs text-blue-600 border-blue-200">
                <CreditCard className="w-3 h-3 mr-1" />
                Pay Later
              </Badge>
            )}
            {hotel.sustainabilityCertified && (
              <Badge variant="outline" className="text-xs text-green-600 border-green-200">
                <Leaf className="w-3 h-3 mr-1" />
                Eco-Certified
              </Badge>
            )}
            {hotel.instantConfirmation && (
              <Badge variant="outline" className="text-xs text-purple-600 border-purple-200">
                <Zap className="w-3 h-3 mr-1" />
                Instant Confirmation
              </Badge>
            )}
            {hotel.urgency?.percentBooked && hotel.urgency.percentBooked > 70 && (
              <Badge variant="outline" className="text-xs text-red-600 border-red-200">
                <Flame className="w-3 h-3 mr-1" />
                {hotel.urgency.percentBooked}% Booked
              </Badge>
            )}
            {hotel.urgency?.viewing && hotel.urgency.viewing > 0 && (
              <Badge variant="outline" className="text-xs text-amber-600 border-amber-200">
                <Eye className="w-3 h-3 mr-1" />
                {hotel.urgency.viewing} viewing now
              </Badge>
            )}
          </div>
          {/* Expandable offers section - OfferCard style */}
          <div className="mt-3 md:mt-4">
            <Collapsible>
              <div className="flex items-center justify-between border-b pb-2">
                <div className="font-medium text-sm">Best Offer</div>
                
                <div className="flex items-center gap-1.5 md:gap-2">
                  <Link href={`/hotel/${hotel.id}`}>
                    <Button variant="outline" size="sm" className="text-[11px] md:text-xs px-2 md:px-3">Hotel Details</Button>
                  </Link>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-[11px] md:text-xs px-2 md:px-3">
                      View All Offers
                      <ChevronDown className="w-3 h-3 ml-1" />
                    </Button>
                  </CollapsibleTrigger>
                </div>
              </div>
              {/* Best offer summary (first offer) */}
              {hotel.offers && hotel.offers.length > 0 && (
                <OfferCard
                  offer={hotel.offers[0]}
                  isHero={true}
                  savings={undefined}
                  rank={1}
                  onBookClick={(offer) => {
                    if (offer.booking_url) window.open(offer.booking_url, '_blank', 'noopener,noreferrer');
                  }}
                  showDetailsBtn={false}
                  hotelId={hotel.id}
                />
              )}
              {/* Expandable offers list */}
              <CollapsibleContent>
                <div className="mt-2">
                  {hotel.offers && hotel.offers.length > 0 ? (
                    hotel.offers.map((offer: Offer, idx: number) => (
                      <OfferCard
                        key={idx}
                        offer={offer}
                        isHero={idx === 0}
                        savings={undefined}
                        rank={idx + 1}
                        onBookClick={(offer) => {
                          if (offer.booking_url) window.open(offer.booking_url, '_blank', 'noopener,noreferrer');
                        }}
                        showDetailsBtn={false}
                        hotelId={hotel.id}
                      />
                    ))
                  ) : (
                    <div className="text-center py-2 text-gray-400">No offers available</div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </div>
    </Card>
  );
}
