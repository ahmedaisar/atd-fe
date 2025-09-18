"use client";

import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Shield, CreditCard, Flame, Eye, Leaf, Zap } from "lucide-react";
import { HotelCardDetails } from "@/types/hotel-card";

interface HotelInfoSectionProps {
  hotel: HotelCardDetails;
  viewMode: "grid" | "list";
}

export function HotelInfoSection({ hotel, viewMode }: HotelInfoSectionProps) {
  const isGridView = viewMode === "grid";

  return (
    <div className={isGridView ? "" : ""}>
      <div>
        <div className={`flex items-center ${isGridView ? "justify-between" : ""}`}>
          <h3 className={`font-semibold ${isGridView ? "text-base md:text-lg" : "text-lg md:text-xl"} line-clamp-2`}>
            {hotel.name}
          </h3>
          {isGridView && (
            <div className="flex items-center gap-2">
              {hotel.starRating > 0 && (
                <span className="flex items-center gap-1 text-yellow-500 text-xs">
                  <Star className="w-3 h-3" />
                  {hotel.starRating}
                </span>
              )}
              {hotel.rating && (
                <span className="text-green-700 font-bold text-xs">{hotel.rating}</span>
              )}
            </div>
          )}
        </div>
        
        <div className={`text-xs text-gray-600 mt-1 ${isGridView ? "" : "flex items-center space-x-2 text-sm mt-2"}`}>
          {!isGridView && <MapPin className="w-4 h-4" />}
          <span>{hotel.location}</span>
        </div>
        
        {isGridView && hotel.description && (
          <div className="text-xs text-gray-600 mt-1">{hotel.description}</div>
        )}
        
        {!isGridView && (
          <div className="flex items-center space-x-2 mt-2">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{hotel.rating || hotel.starRating}</span>
            </div>
            <span className="text-sm text-gray-600">({hotel.reviewCount || '6929'} reviews)</span>
          </div>
        )}
        
        {!isGridView && (
          <div className="mt-2 text-sm text-gray-600">
            <span className="text-green-600 font-medium">Excellent</span> rating
          </div>
        )}
        
        {!isGridView && hotel.description && (
          <div className="text-sm text-gray-600 mt-2 line-clamp-2">{hotel.description}</div>
        )}
      </div>
    </div>
  );
}

interface HotelBadgesSectionProps {
  hotel: HotelCardDetails;
}

export function HotelBadgesSection({ hotel }: HotelBadgesSectionProps) {
  return (
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
  );
}