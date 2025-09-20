"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapView } from "@/components/map-view"
import { Grid, List, Map, SortAsc } from "lucide-react"
import { EnhancedHotelCard } from "@/components/enhanced-hotel-card"
import { HotelCardDetails } from "@/types/hotel-card"

type ListingItem = HotelCardDetails

export function HotelListings({ 
  initialHotels, 
  initialSort = "recommended", 
  destinationLabel,
  totalCount,
  page = 1,
  totalPages = 1
}: { 
  initialHotels: any[]; 
  initialSort?: string; 
  destinationLabel?: string;
  totalCount?: number;
  page?: number;
  totalPages?: number;
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  
  // Get view mode and sort from URL if available
  const urlViewMode = searchParams.get("viewMode") as "list" | "grid" | "map" | null
  const urlSortBy = searchParams.get("sort")
  const urlPage = searchParams.get("page")
  
  const [viewMode, setViewMode] = useState<"list" | "grid" | "map">(urlViewMode || "list")
  const [sortBy, setSortBy] = useState(urlSortBy || initialSort)
  const [currentPage, setCurrentPage] = useState(urlPage ? parseInt(urlPage) : page)
  const [hoveredHotelId, setHoveredHotelId] = useState<string | number | null>(null)
  
  // Update URL when view mode, sort, or page changes
  const updateURL = useCallback((params: { viewMode?: string; sort?: string; page?: number }) => {
    const newParams = new URLSearchParams(searchParams.toString())
    
    if (params.viewMode) {
      newParams.set("viewMode", params.viewMode)
    }
    
    if (params.sort) {
      newParams.set("sort", params.sort)
    }
    
    if (params.page) {
      newParams.set("page", params.page.toString())
    }
    
    router.push(`${pathname}?${newParams.toString()}`, { scroll: false })
  }, [searchParams, pathname, router])
  
  // Update view mode and URL
  const handleViewModeChange = useCallback((mode: "list" | "grid" | "map") => {
    setViewMode(mode)
    updateURL({ viewMode: mode })
  }, [updateURL])
  
  // Update sort and URL
  const handleSortChange = useCallback((sort: string) => {
    setSortBy(sort)
    updateURL({ sort })
  }, [updateURL])
  
  // Update page and URL
  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage)
    updateURL({ page: newPage })
  }, [updateURL])

  const ITEMS_PER_PAGE = 10;
  const hotels: ListingItem[] = useMemo(() => {
    // Map HotelRecord (API) to EnhancedHotelCard shape
    if (!Array.isArray(initialHotels)) return [];
  return initialHotels.map((h) => ({
      // API response fields
      hs_id: h.hs_id,
      slug: h.slug,
      name: h.name,
      toa: h.toa,
      covid_safe: h.covid_safe,
      amenities: h.amenities || {},
      short_description: h.short_description,
      themes: h.themes || [],
      ty_id: h.ty_id,
      chain: h.chain,
      brand: h.brand,
      rank: h.rank,
      descriptions: h.descriptions || {},
      chain_code: h.chain_code,
      position: h.position,
      bids: h.bids,
      offers: h.offers || [],
      worst_offer: h.worst_offer,
      best_offer: h.best_offer,
      best_offer_ota: h.best_offer_ota,
      best_offer_mota: h.best_offer_mota,
      discount: h.discount,
      offers_count: h.offers_count,
      distance: h.distance,
      images: h.images || [],
      neighborhood: h.neighborhood,
      badge: h.badge,
      distances: h.distances || [],
      specs: h.specs || {},
      toa_label: h.toa_label,
      top_amenities: h.top_amenities || [],
      quality: h.quality,
      location: h.location,
      hero_offer: h.hero_offer,
      ctrl_srt: h.ctrl_srt,
      test_srt: h.test_srt,

      // Legacy/compatibility fields (mapped from API)
      id: h.hs_id,
      description: h.short_description || '',
      rating: h.quality?.review_rating ? h.quality.review_rating / 10 : 0,
      reviewCount: h.quality?.review_count || 0,
      price: h.best_offer || h.hero_offer?.price || 0,
      originalPrice: h.worst_offer || undefined,
      badges: [
        h.hero_offer?.offer_flags_new?.refundable ? 'Free Cancellation' : '',
        h.discount > 15 ? 'Hot Deal' : '',
        h.offers_count <= 3 ? 'Limited Offers' : '',
      ].filter(Boolean) as string[],
      coordinates: h.location?.coordinates || { lat: 0, lng: 0 },
      chainBrand: h.brand || undefined,
      propertyType: h.toa_label || 'Hotel',
      starRating: h.quality?.stars || 0,
      sustainabilityCertified: false,
      freeCancellation: !!h.hero_offer?.offer_flags_new?.refundable,
      payAtProperty: !!h.hero_offer?.offer_flags_new?.pay_at_hotel,
      instantConfirmation: false,
      lastBooked: undefined,
      popularityScore: Math.round((h.quality?.review_rating || 0) * 10),
      reviewScoreByCategory: {
        cleanliness: 4 + Math.random(),
        location: 4 + Math.random(),
        service: 4 + Math.random(),
        value: 4 + Math.random(),
      },
  nearbyLandmarks: h.distances?.map((d: { from: string; distance: number }) => ({ name: d.from, distance: `${d.distance} km`, type: '' })) || [],
      roomsLeft: undefined,
      dealExpiry: undefined,
      urgency: {},
      specialOffer: h.badge ? { type: 'discount', description: h.badge } : undefined,
      paymentOptions: [],
  distanceFromPopularLocations: h.distances?.map((d: { from: string; distance: number }) => ({ name: d.from, distance: `${d.distance} km` })) || [],
  hostLanguages: undefined,
    }))
  }, [initialHotels])

  const sortedHotels = useMemo(() => {
    const arr = [...hotels]
    switch (sortBy) {
      case "price-low":
        arr.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        arr.sort((a, b) => b.price - a.price)
        break
      case "rating":
        arr.sort((a, b) => b.rating - a.rating)
        break
      case "star-rating":
        arr.sort((a, b) => b.starRating - a.starRating)
        break
      case "review-count":
        arr.sort((a, b) => b.reviewCount - a.reviewCount)
        break
      case "distance": {
        arr.sort((a, b) => (a.distance || 0) - (b.distance || 0))
        break
      }
      case "recommended":
      default:
        arr.sort((a, b) => b.popularityScore - a.popularityScore)
        break
    }
    return arr;
  }, [hotels, sortBy]);

  // Calculate total pages
  const calculatedTotalPages = useMemo(() => {
    return Math.max(1, Math.ceil((totalCount || sortedHotels.length) / ITEMS_PER_PAGE));
  }, [totalCount, sortedHotels.length]);

  // Slice hotels for current page
  const displayHotels = useMemo(() => {
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedHotels.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  }, [sortedHotels, currentPage]);

  return (
    <div className="space-y-4">
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-sm">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            {destinationLabel || 'Results'}: {totalCount?.toLocaleString() || displayHotels.length.toLocaleString()} properties found
          </h1>
          <p className="text-sm text-gray-600">Page {currentPage} of {totalPages || 1}</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Sort */}
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-48">
              <SortAsc className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recommended">Recommended</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Guest Rating</SelectItem>
              <SelectItem value="star-rating">Star Rating</SelectItem>
              <SelectItem value="distance">Distance</SelectItem>
              <SelectItem value="review-count">Most Reviewed</SelectItem>
            </SelectContent>
          </Select>

          {/* View Toggle */}
          <div className="flex items-center border rounded-lg">
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleViewModeChange("list")}
              className="rounded-r-none"
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleViewModeChange("grid")}
              className="rounded-none border-x"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "map" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleViewModeChange("map")}
              className="rounded-l-none"
            >
              <Map className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      {viewMode === "map" ? (
        <MapView 
          hotels={displayHotels as any} 
          hoveredHotelId={hoveredHotelId}
          onHoverMarker={(id) => setHoveredHotelId(id)}
          onMarkerClick={(id) => {
            // When clicking a marker, navigate to list view and scroll to the card (simple version)
            updateURL({ viewMode: "list" })
            setViewMode("list")
            // Optionally we could set hash or state to focus a card
          }}
        />
      ) : (
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-4"}>
          {displayHotels.map((hotel) => (
            <div
              key={hotel.id}
              onMouseEnter={() => setHoveredHotelId(hotel.id)}
              onMouseLeave={() => setHoveredHotelId(null)}
            >
              <EnhancedHotelCard hotel={hotel} viewMode={viewMode} />
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="text-center py-8">
        <nav className="inline-flex items-center justify-center gap-2" aria-label="Pagination">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full px-3"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            &laquo;
          </Button>
          {Array.from({ length: calculatedTotalPages }).map((_, i) => (
            <Button
              key={i}
              variant={currentPage === i + 1 ? "default" : "ghost"}
              size="sm"
              className={`rounded-full px-3 ${currentPage === i + 1 ? "font-bold" : ""}`}
              onClick={() => handlePageChange(i + 1)}
              disabled={currentPage === i + 1}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full px-3"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= calculatedTotalPages}
          >
            &raquo;
          </Button>
        </nav>
        <p className="text-sm text-gray-500 mt-2">
          Showing {displayHotels.length} of {totalCount || sortedHotels.length} properties
        </p>
      </div>
    </div>
  )
}
