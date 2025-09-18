"use client";

import { Button } from "@/components/ui/button";

interface HotelPriceSectionProps {
  originalPrice?: number;
  price: number;
  hasOffers: boolean;
  offersDrawerOpen: boolean;
  onToggleOffers: () => void;
  viewMode: "grid" | "list";
}

export function HotelPriceSection({
  originalPrice,
  price,
  hasOffers,
  offersDrawerOpen,
  onToggleOffers,
  viewMode,
}: HotelPriceSectionProps) {
  const isGridView = viewMode === "list";

  if (!isGridView) {
    return null; // Price is handled in HotelInfoSection for list view
  }

  return (
    <div className="flex items-end justify-between mt-3 md:mt-4 pt-3 border-t">
      <div>
        {originalPrice && (
          <span className="text-gray-500 line-through text-sm">${originalPrice}</span>
        )}
        <div className="flex items-baseline space-x-1">
          <span className="text-xl md:text-2xl font-bold text-blue-600">${price}</span>
          <span className="text-xs md:text-sm text-gray-600">/night</span>
        </div>
      </div>
      {hasOffers && (
        <Button 
          size="sm" 
          className="rounded-full px-3 md:px-4"
          onClick={onToggleOffers}
        >
          {offersDrawerOpen ? 'Hide prices' : 'Show prices'}
        </Button>
      )}
    </div>
  );
}

interface OffersToggleButtonProps {
  hasOffers: boolean;
  offersDrawerOpen: boolean;
  onToggleOffers: () => void;
}

export function OffersToggleButton({
  hasOffers,
  offersDrawerOpen,
  onToggleOffers,
}: OffersToggleButtonProps) {
  if (!hasOffers) {
    return <div className="mt-3 md:mt-4 text-sm text-gray-400">No offers available</div>;
  }

  return (
    <div className="mt-3 md:mt-4">
      <div className="flex items-center justify-between">
        <div className="font-medium text-sm">Prices</div>
        <Button 
          size="sm" 
          className="rounded-full px-3 md:px-4"
          onClick={onToggleOffers}
        >
          {offersDrawerOpen ? 'Hide' : 'Show'} prices
        </Button>
      </div>
    </div>
  );
}