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
  Bath
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { HotelCardDetails } from "@/types/hotel-card";

interface EnhancedHotelCardProps {
  hotel: HotelCardDetails;
  viewMode: "list" | "grid";
}

export function EnhancedHotelCard({ hotel, viewMode }: EnhancedHotelCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

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

  const discount = hotel.originalPrice
    ? Math.round(((hotel.originalPrice - hotel.price) / hotel.originalPrice) * 100)
    : 0;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % hotel.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + hotel.images.length) % hotel.images.length);
  };

  if (viewMode === "grid") {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
        <div className="relative">
          {/* Image Carousel */}
          <div className="relative h-48 overflow-hidden">
            <Image
              src={hotel.images[currentImageIndex] || "/placeholder.svg"}
              alt={hotel.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {/* Image Navigation */}
            {hotel.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronDown className="w-4 h-4 rotate-90" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronDown className="w-4 h-4 -rotate-90" />
                </button>

                {/* Image Dots */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
                  {hotel.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex ? "bg-white" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Overlay Elements */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 bg-white/80 hover:bg-white"
            onClick={() => setIsWishlisted(!isWishlisted)}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
          </Button>

          {discount > 0 && <Badge className="absolute top-2 left-2 bg-red-500 text-white">-{discount}%</Badge>}

          {hotel.sustainabilityCertified && (
            <Badge className="absolute top-8 left-2 bg-green-500 text-white">
              <Leaf className="w-3 h-3 mr-1" />
              Eco
            </Badge>
          )}
          
          {hotel.starRating > 0 && (
            <Badge className="absolute bottom-2 left-2 bg-yellow-500/90 text-white">
              {Array.from({ length: Math.min(5, Math.round(hotel.starRating)) }).map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-white" />
              ))}
            </Badge>
          )}
          
          {hotel.urgency?.viewing && hotel.urgency.viewing > 0 && (
            <Badge className="absolute bottom-2 right-2 bg-blue-600/90 text-white flex items-center">
              <Eye className="w-3 h-3 mr-1" />
              {hotel.urgency.viewing} viewing
            </Badge>
          )}
        </div>

        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg line-clamp-2">{hotel.name}</h3>
                  {hotel.chainBrand && <p className="text-sm text-gray-500">{hotel.chainBrand}</p>}
                </div>
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                <MapPin className="w-4 h-4" />
                <span>{hotel.location}</span>
              </div>

              <div className="flex items-center space-x-2 mb-3">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{hotel.rating}</span>
                </div>
                <span className="text-sm text-gray-600">({hotel.reviewCount} reviews)</span>
                {hotel.popularityScore > 85 && (
                  <Badge variant="outline" className="text-xs">
                    Popular
                  </Badge>
                )}
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-1 mb-3">
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
              {hotel.instantConfirmation && (
                <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-200">
                  <Zap className="w-3 h-3 mr-1" />
                  Instant
                </Badge>
              )}
            </div>

  // List view implementation
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="relative md:w-80 flex-shrink-0">
            <div className="relative h-60 md:h-full overflow-hidden">
              <Image
                src={hotel.images[currentImageIndex] || "/placeholder.svg"}
                alt={hotel.name}
                fill
                className="object-cover"
              />

              {/* Image Navigation */}
              {hotel.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronDown className="w-4 h-4 rotate-90" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronDown className="w-4 h-4 -rotate-90" />
                  </button>
                </>
              )}
            </div>

            {/* Overlay Elements */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-3 right-3 bg-white/80 hover:bg-white"
              onClick={() => setIsWishlisted(!isWishlisted)}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
            </Button>

            {discount > 0 && <Badge className="absolute top-3 left-3 bg-red-500 text-white">-{discount}%</Badge>}

            {hotel.sustainabilityCertified && (
              <Badge className="absolute top-10 left-3 bg-green-500 text-white">
                <Leaf className="w-3 h-3 mr-1" />
                Eco
              </Badge>
            )}
            
            {hotel.starRating > 0 && (
              <Badge className="absolute bottom-3 left-3 bg-yellow-500/90 text-white">
                {Array.from({ length: Math.min(5, Math.round(hotel.starRating)) }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-white" />
                ))}
              </Badge>
            )}
          </div>

          {/* Content Section */}
          <div className="flex-1 p-6">
            <div className="flex flex-col h-full">
              <div className="flex-1">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1">{hotel.name}</h3>
                    {hotel.chainBrand && <p className="text-sm text-gray-500 mb-2">{hotel.chainBrand}</p>}

                    <div className="flex items-center space-x-2 text-gray-600 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>{hotel.location}</span>
                      <span>•</span>
                      <span>{hotel.distance}</span>
                    </div>

                    <div className="flex items-center space-x-2 mb-4">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{hotel.rating}</span>
                      </div>
                      <span className="text-gray-600">({hotel.reviewCount} reviews)</span>
                      {hotel.popularityScore > 85 && (
                        <Badge variant="outline" className="text-xs">
                          Popular
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
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
                  {hotel.instantConfirmation && (
                    <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-200">
                      <Zap className="w-3 h-3 mr-1" />
                      Instant
                    </Badge>
                  )}
                </div>

                {/* Amenities */}
                {hotel.amenities && hotel.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-4 mb-4">
                    {hotel.amenities.slice(0, 4).map((amenity) => {
                      const Icon = amenityIcons[amenity as keyof typeof amenityIcons];
                      return (
                        <div key={amenity} className="flex items-center space-x-1 text-sm text-gray-600">
                          {Icon && <Icon className="w-4 h-4" />}
                          <span>{amenity}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Social Proof */}
                {(hotel.lastBooked || hotel.roomsLeft) && (
                  <div className="text-sm text-gray-600 space-y-1 mb-4">
                    {hotel.lastBooked && (
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>Last booked {hotel.lastBooked}</span>
                      </div>
                    )}
                    {hotel.roomsLeft && hotel.roomsLeft <= 5 && (
                      <div className="text-red-600 font-medium">Only {hotel.roomsLeft} rooms left!</div>
                    )}
                  </div>
                )}

                {/* Progressive Disclosure - Details */}
                <Collapsible open={showDetails} onOpenChange={setShowDetails}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between p-0 h-auto text-sm text-blue-600 mb-4">
                      {showDetails ? "Show less" : "Show more details"}
                      <ChevronDown className={`w-4 h-4 transition-transform ${showDetails ? "rotate-180" : ""}`} />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 mb-4">
                    {/* Detailed Ratings */}
                    {hotel.reviewScoreByCategory && Object.keys(hotel.reviewScoreByCategory).length > 0 && (
                      <div className="grid grid-cols-2 gap-3">
                        {Object.entries(hotel.reviewScoreByCategory).map(([category, score]) => (
                          <div key={category} className="flex justify-between text-sm">
                            <span className="capitalize text-gray-600">{category}:</span>
                            <span className="font-medium">{score.toFixed(1)}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Nearby Landmarks */}
                    {hotel.nearbyLandmarks && hotel.nearbyLandmarks.length > 0 && (
                      <div>
                        <p className="font-medium mb-2">Nearby:</p>
                        <div className="space-y-1">
                          {hotel.nearbyLandmarks.slice(0, 3).map((landmark, index) => (
                            <div key={index} className="flex justify-between text-sm text-gray-600">
                              <span>{landmark.name}</span>
                              <span>{landmark.distance}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CollapsibleContent>
                </Collapsible>
              </div>

              {/* Price and CTA */}
              <div className="flex items-end justify-between pt-4 border-t">
                <div>
                  {hotel.originalPrice && <span className="text-gray-500 line-through">${hotel.originalPrice}</span>}
                  <div className="flex items-baseline space-x-1">
                    <span className="text-3xl font-bold text-blue-600">${hotel.price}</span>
                    <span className="text-gray-600">/night</span>
                  </div>
                  <p className="text-sm text-gray-500">Includes taxes and fees</p>
                  {hotel.dealExpiry && <p className="text-xs text-red-600">Deal expires {hotel.dealExpiry}</p>}
                </div>
                <Link href={`/hotel/${hotel.id}`}>
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    View Details
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

        <div className="flex items-end justify-between mt-4 pt-3 border-t">
          <div>
            {hotel.originalPrice && (
              <span className="text-gray-500 line-through text-sm">${hotel.originalPrice}</span>
            )}
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-bold text-blue-600">${hotel.price}</span>
              <span className="text-sm text-gray-600">/night</span>
            </div>
          </div>
          <Link href={`/hotel/${hotel.id}`}>
            <Button className="bg-blue-600 hover:bg-blue-700">
              {viewMode === "list" ? "View Details" : "Book Now"}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
