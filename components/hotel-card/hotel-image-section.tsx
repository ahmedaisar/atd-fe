"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ChevronDown, Star } from "lucide-react";

interface HotelImageSectionProps {
  imageUrls: string[];
  hotelName: string;
  discount?: number;
  starRating?: number;
  isWishlisted: boolean;
  onWishlistToggle: () => void;
  isListView?: boolean;
}

export function HotelImageSection({
  imageUrls,
  hotelName,
  discount,
  starRating,
  isWishlisted,
  onWishlistToggle,
  isListView = false,
}: HotelImageSectionProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % imageUrls.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);
  };

  return (
    <div className={`relative overflow-hidden ${
      isListView 
        ? "w-60 h-full min-h-[160px]" 
        : "h-48 md:h-full md:min-h-[280px]"
    }`}>
      <Image
        src={imageUrls[currentImageIndex] || "/placeholder.svg"}
        alt={hotelName}
        fill
        className="object-cover"
      />
      
      {/* Image counter - positioned exactly like in screenshot */}
      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
        {currentImageIndex + 1} / {imageUrls.length}
      </div>

      {/* Wishlist button */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 bg-white/80 hover:bg-white p-1"
        onClick={onWishlistToggle}
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
      </Button>

      {/* Popular choice badge - positioned exactly like in screenshot */}
      {isListView && (
        <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs font-medium px-2 py-1">
          Popular choice
        </Badge>
      )}

      {/* Discount badge for grid view */}
      {!isListView && discount && discount > 0 && (
        <Badge className="absolute top-2 left-2 bg-red-500 text-white">-{discount}%</Badge>
      )}
      
      {/* Star rating badge for grid view */}
      {!isListView && starRating && starRating > 0 && (
        <Badge className="absolute bottom-12 left-2 bg-yellow-500/90 text-white">
          {Array.from({ length: Math.min(5, Math.round(starRating)) }).map((_, i) => (
            <Star key={i} className="w-3 h-3 fill-white" />
          ))}
        </Badge>
      )}

      {/* Navigation arrows - subtle for list view */}
      {imageUrls.length > 1 && (
        <>
          <button 
            onClick={prevImage} 
            className="absolute left-2 top-1/2 -translate-y-1/2 p-1 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 hover:opacity-100 transition-opacity"
            aria-label="Previous image"
          >
            <ChevronDown className="w-3 h-3 rotate-90" />
          </button>
          <button 
            onClick={nextImage} 
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 hover:opacity-100 transition-opacity"
            aria-label="Next image"
          >
            <ChevronDown className="w-3 h-3 -rotate-90" />
          </button>
        </>
      )}
    </div>
  );
}