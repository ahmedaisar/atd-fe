"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Star, X, ChevronDown, MapPin, Shield, CreditCard, Zap, Building, Leaf, DollarSign, Sparkles } from "lucide-react"
import type { AdvancedFilters } from "@/types/search"



  // TODO: Map these from API if available
  const landmarks: string[] = [];
  const neighborhoods: string[] = [];
  const hotelChains: string[] = [];

interface AdvancedSearchFiltersProps {
  onFiltersChange?: (filters: Partial<AdvancedFilters>) => void
  resultsCount: number
  initialFilters?: Record<string, string | string[] | undefined>
  filters?: any // API filters object
}

export function AdvancedSearchFilters({ onFiltersChange, resultsCount, initialFilters, filters: apiFilters }: AdvancedSearchFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  
  const [filters, setFilters] = useState<AdvancedFilters>({
    priceRange: initialFilters?.priceRange 
      ? (initialFilters.priceRange as string).split(',').map(Number) as [number, number] 
      : [0, 1000],
    starRating: initialFilters?.starRating 
      ? (initialFilters.starRating as string).split(',').map(Number) as number[] 
      : [],
    propertyType: initialFilters?.propertyType
      ? (Array.isArray(initialFilters.propertyType) ? initialFilters.propertyType : [initialFilters.propertyType])
      : [],
    distanceFromCenter: initialFilters?.distanceFromCenter 
      ? (initialFilters.distanceFromCenter as string).split(',').map(Number) as [number, number] 
      : [0, 10],
    nearbyLandmarks: initialFilters?.nearbyLandmarks ? 
      (Array.isArray(initialFilters.nearbyLandmarks) ? initialFilters.nearbyLandmarks : [initialFilters.nearbyLandmarks]) as string[] : 
      [],
    neighborhoodTypes: initialFilters?.neighborhoodTypes ? 
      (Array.isArray(initialFilters.neighborhoodTypes) ? initialFilters.neighborhoodTypes : [initialFilters.neighborhoodTypes]) as string[] : 
      [],
    freeCancellation: initialFilters?.freeCancellation === 'true',
    payAtProperty: initialFilters?.payAtProperty === 'true',
    instantConfirmation: initialFilters?.instantConfirmation === 'true',
    chainBrands: initialFilters?.chainBrands ? 
      (Array.isArray(initialFilters.chainBrands) ? initialFilters.chainBrands : [initialFilters.chainBrands]) as string[] : 
      [],
    propertyAge: (initialFilters?.propertyAge as "new" | "renovated" | "any") || "any",
    sustainabilityCertified: initialFilters?.sustainabilityCertified === 'true',
    deals: initialFilters?.deals ? 
      (Array.isArray(initialFilters.deals) ? initialFilters.deals : [initialFilters.deals]) as string[] : 
      [],
    amenities: initialFilters?.amenities ? 
      (Array.isArray(initialFilters.amenities) ? initialFilters.amenities : [initialFilters.amenities]) as string[] : 
      [],
    reviewScoreByCategory: {
      cleanliness: Number(initialFilters?.cleanlinessScore) || 0,
      location: Number(initialFilters?.locationScore) || 0,
      service: Number(initialFilters?.serviceScore) || 0,
      value: Number(initialFilters?.valueScore) || 0,
    },
  })

  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [expandedSections, setExpandedSections] = useState<string[]>(["price", "rating"])

  // Helper to toggle expanded/collapsed state for filter sections
  const toggleSection = (section: string) => {
    setExpandedSections((prev: string[]) =>
      prev.includes(section)
        ? prev.filter((s: string) => s !== section)
        : [...prev, section]
    )
  }

  // Update URL when filters change
  const updateURL = useCallback((newFilters: AdvancedFilters) => {
    const params = new URLSearchParams(searchParams.toString())
    
    // Handle price range
    if (newFilters.priceRange && (newFilters.priceRange[0] > 0 || newFilters.priceRange[1] < 1000)) {
      params.delete('priceRange')
    }
    
    // Handle star rating
    if (newFilters.starRating && newFilters.starRating.length > 0) {
      params.set('starRating', newFilters.starRating.join(','))
    } else {
      params.delete('starRating')
    }
    
    // Handle property type
    if (newFilters.propertyType && newFilters.propertyType.length > 0) {
      params.delete('propertyType')
      newFilters.propertyType.forEach(type => {
        params.append('propertyType', type)
      })
    } else {
      params.delete('propertyType')
    }
    
    // Handle amenities
    if (newFilters.amenities && newFilters.amenities.length > 0) {
      params.delete('amenities')
      newFilters.amenities.forEach(amenity => {
        params.append('amenities', amenity)
      })
    } else {
      params.delete('amenities')
    }
    
    // Handle distance from center
    if (newFilters.distanceFromCenter && (newFilters.distanceFromCenter[0] > 0 || newFilters.distanceFromCenter[1] < 10)) {
      params.set('distanceFromCenter', newFilters.distanceFromCenter.join(','))
    } else {
      params.delete('distanceFromCenter')
    }
    
    // Handle nearby landmarks
    if (newFilters.nearbyLandmarks && newFilters.nearbyLandmarks.length > 0) {
      params.delete('nearbyLandmarks')
      newFilters.nearbyLandmarks.forEach(landmark => {
        params.append('nearbyLandmarks', landmark)
      })
    } else {
      params.delete('nearbyLandmarks')
    }
    
    // Handle neighborhood types
    if (newFilters.neighborhoodTypes && newFilters.neighborhoodTypes.length > 0) {
      params.delete('neighborhoodTypes')
      newFilters.neighborhoodTypes.forEach(neighborhood => {
        params.append('neighborhoodTypes', neighborhood)
      })
    } else {
      params.delete('neighborhoodTypes')
    }
    
    // Handle boolean filters
    params.set('freeCancellation', newFilters.freeCancellation.toString())
    params.set('payAtProperty', newFilters.payAtProperty.toString())
    params.set('instantConfirmation', newFilters.instantConfirmation.toString())
    params.set('sustainabilityCertified', newFilters.sustainabilityCertified.toString())
    
    // Handle chain brands
    if (newFilters.chainBrands && newFilters.chainBrands.length > 0) {
      params.delete('chainBrands')
      newFilters.chainBrands.forEach(brand => {
        params.append('chainBrands', brand)
      })
    } else {
      params.delete('chainBrands')
    }
    
    // Handle deals
    if (newFilters.deals && newFilters.deals.length > 0) {
      params.delete('deals')
      newFilters.deals.forEach(deal => {
        params.append('deals', deal)
      })
    } else {
      params.delete('deals')
    }
    
    // Handle property age
    if (newFilters.propertyAge && newFilters.propertyAge !== 'any') {
      params.set('propertyAge', newFilters.propertyAge)
    } else {
      params.delete('propertyAge')
    }
    
    // Handle review scores
    const { reviewScoreByCategory } = newFilters
    if (reviewScoreByCategory.cleanliness > 0) params.set('cleanlinessScore', reviewScoreByCategory.cleanliness.toString())
    else params.delete('cleanlinessScore')
    
    if (reviewScoreByCategory.location > 0) params.set('locationScore', reviewScoreByCategory.location.toString())
    else params.delete('locationScore')
    
    if (reviewScoreByCategory.service > 0) params.set('serviceScore', reviewScoreByCategory.service.toString())
    else params.delete('serviceScore')
    
    if (reviewScoreByCategory.value > 0) params.set('valueScore', reviewScoreByCategory.value.toString())
    else params.delete('valueScore')
    
    // Update URL without refreshing the page
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }, [searchParams, pathname, router])

  const updateFilter = useCallback(
    <K extends keyof AdvancedFilters>(key: K, value: AdvancedFilters[K]) => {
      const newFilters = { ...filters, [key]: value }
      setFilters(newFilters)
  onFiltersChange?.(newFilters)
      updateURL(newFilters)
      
      // Update active filters tracking
      if (key === 'freeCancellation' || key === 'payAtProperty' || key === 'instantConfirmation' || key === 'sustainabilityCertified') {
        if (value && !activeFilters.includes(key)) {
          setActiveFilters(prev => [...prev, key])
        } else if (!value && activeFilters.includes(key)) {
          setActiveFilters(prev => prev.filter(f => f !== key))
        }
      } else if (key === 'priceRange' && (value as [number, number])[0] > 0 || (value as [number, number])[1] < 1000) {
        if (!activeFilters.includes('priceRange')) {
          setActiveFilters(prev => [...prev, 'priceRange'])
        }
      } else if (key === 'starRating' && (value as number[]).length > 0) {
        if (!activeFilters.includes('starRating')) {
          setActiveFilters(prev => [...prev, 'starRating'])
        } else if ((value as number[]).length === 0 && activeFilters.includes('starRating')) {
          setActiveFilters(prev => prev.filter(f => f !== 'starRating'))
        }
      }
    },
    [filters, onFiltersChange, activeFilters, updateURL],
  )

  const toggleArrayFilter = useCallback(
    (
      key: keyof Pick<AdvancedFilters, "nearbyLandmarks" | "neighborhoodTypes" | "chainBrands" | "propertyType" | "deals" | "amenities" | "starRating">,
      value: string | number,
    ) => {
      const currentArray = filters[key] as unknown as any[]
      const v = value as any
      const newArray = currentArray.includes(v)
        ? currentArray.filter((item) => item !== v)
        : [...currentArray, v]

      updateFilter(key as any, newArray as any)

      // Update active filters
      const k = String(key)
      if (newArray.length > 0 && !activeFilters.includes(k)) {
        setActiveFilters((prev) => [...prev, k])
      } else if (newArray.length === 0) {
        setActiveFilters((prev) => prev.filter((f) => f !== k))
      }
    },
    [filters, updateFilter, activeFilters],
  )

  const clearAllFilters = () => {
    const clearedFilters: AdvancedFilters = {
      priceRange: [0, 1000],
      starRating: [],
      propertyType: [],
      distanceFromCenter: [0, 10],
      nearbyLandmarks: [],
      neighborhoodTypes: [],
      freeCancellation: false,
      payAtProperty: false,
      instantConfirmation: false,
      chainBrands: [],
      propertyAge: "any",
      sustainabilityCertified: false,
      deals: [],
      amenities: [],
      reviewScoreByCategory: {
        cleanliness: 0,
        location: 0,
        service: 0,
        value: 0,
      },
    }
    setFilters(clearedFilters)
    setActiveFilters([])
    onFiltersChange?.(clearedFilters)
    updateURL(clearedFilters)
  }

  return (
    <div className="space-y-4">
      {/* Active Filters Summary */}
      {activeFilters.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium text-sm">Active Filters ({activeFilters.length})</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-blue-600 hover:text-blue-700 h-auto p-0"
              >
                Clear All
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.priceRange[0] > 0 || filters.priceRange[1] < 1000 && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  ${filters.priceRange[0]}-${filters.priceRange[1]}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter("priceRange", [0, 1000])} />
                </Badge>
              )}
              
              {filters.starRating.map((rating) => (
                <Badge key={rating} variant="secondary" className="flex items-center gap-1">
                  {rating} Stars
                  <X className="w-3 h-3 cursor-pointer" onClick={() => toggleArrayFilter("starRating", rating)} />
                </Badge>
              ))}
              
              {filters.propertyType.map((type) => (
                <Badge key={type} variant="secondary" className="flex items-center gap-1">
                  {type}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => toggleArrayFilter("propertyType", type)} />
                </Badge>
              ))}
              
              {filters.amenities.map((amenity) => (
                <Badge key={amenity} variant="secondary" className="flex items-center gap-1">
                  {amenity}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => toggleArrayFilter("amenities", amenity)} />
                </Badge>
              ))}
              
              {filters.freeCancellation && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Free Cancellation
                  <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter("freeCancellation", false)} />
                </Badge>
              )}
              {filters.payAtProperty && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Pay at Property
                  <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter("payAtProperty", false)} />
                </Badge>
              )}
              {filters.sustainabilityCertified && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Eco-Friendly
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => updateFilter("sustainabilityCertified", false)}
                  />
                </Badge>
              )}
              {filters.nearbyLandmarks.map((landmark) => (
                <Badge key={landmark} variant="secondary" className="flex items-center gap-1">
                  Near {landmark}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => toggleArrayFilter("nearbyLandmarks", landmark)}
                  />
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Price Range Filter */}
      <Collapsible open={expandedSections.includes("price")} onOpenChange={() => toggleSection("price")}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50 pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span>Price Range</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${expandedSections.includes("price") ? "rotate-180" : ""}`}
                />
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="space-y-4">
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) => updateFilter("priceRange", value as [number, number])}
                  max={1000}
                  min={0}
                  step={50}
                  className="w-full"
                />
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>${filters.priceRange[0]}</span>
                  <span>${filters.priceRange[1]}+</span>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
      
      {/* Star Rating Filter (dynamic) */}
      <Collapsible open={expandedSections.includes("rating")} onOpenChange={() => toggleSection("rating")}> 
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50 pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>Star Rating</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${expandedSections.includes("rating") ? "rotate-180" : ""}`}
                />
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {(apiFilters?.stars || [5,4,3,2,1]).slice().reverse().map((rating: number) => (
                  <div key={rating} className="flex items-center space-x-3">
                    <Checkbox
                      id={`star-rating-${rating}`}
                      checked={filters.starRating.includes(rating)}
                      onCheckedChange={() => toggleArrayFilter("starRating", rating)}
                    />
                    <label htmlFor={`star-rating-${rating}`} className="flex items-center space-x-1 cursor-pointer flex-1">
                      <div className="flex">
                        {Array.from({ length: rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                        {Array.from({ length: 5 - rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-gray-300" />
                        ))}
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
      
      {/* Property Type Filter (dynamic) */}
      <Collapsible open={expandedSections.includes("propertyType")} onOpenChange={() => toggleSection("propertyType")}> 
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50 pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Building className="w-4 h-4 text-blue-600" />
                  <span>Property Type</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${expandedSections.includes("propertyType") ? "rotate-180" : ""}`}
                />
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {(apiFilters?.toas || []).map((type: string) => (
                  <div key={type} className="flex items-center space-x-3">
                    <Checkbox
                      id={`property-type-${type}`}
                      checked={filters.propertyType.includes(type)}
                      onCheckedChange={() => toggleArrayFilter("propertyType", type)}
                    />
                    <label
                      htmlFor={`property-type-${type}`}
                      className="flex items-center justify-between cursor-pointer flex-1"
                    >
                      <span className="text-sm">{type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Deals & Promotions */}
      <Collapsible open={expandedSections.includes("deals")} onOpenChange={() => toggleSection("deals")}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50 pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>Deals & Promotions</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${expandedSections.includes("deals") ? "rotate-180" : ""}`}
                />
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {[
                  { id: "special-deal", label: "Special Deals", count: 243 },
                  { id: "mobile-only", label: "Mobile Only Rates", count: 156 },
                  { id: "member-rate", label: "Member Rates", count: 324 },
                  { id: "free-breakfast", label: "Free Breakfast", count: 210 },
                  { id: "free-airport-transfer", label: "Free Airport Transfer", count: 67 },
                ].map((deal) => (
                  <div key={deal.id} className="flex items-center space-x-3">
                    <Checkbox
                      id={`deal-${deal.id}`}
                      checked={filters.deals.includes(deal.id)}
                      onCheckedChange={() => toggleArrayFilter("deals", deal.id)}
                    />
                    <label
                      htmlFor={`deal-${deal.id}`}
                      className="flex items-center justify-between cursor-pointer flex-1"
                    >
                      <span className="text-sm">{deal.label}</span>
                      <span className="text-sm text-gray-500">({deal.count})</span>
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
      
      {/* Amenities Filter */}
      <Collapsible open={expandedSections.includes("amenities")} onOpenChange={() => toggleSection("amenities")}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50 pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>Amenities</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${expandedSections.includes("amenities") ? "rotate-180" : ""}`}
                />
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {[
                  { id: "wifi", label: "WiFi", count: 1247 },
                  { id: "parking", label: "Free Parking", count: 892 },
                  { id: "pool", label: "Swimming Pool", count: 423 },
                  { id: "gym", label: "Fitness Center", count: 321 },
                  { id: "restaurant", label: "Restaurant", count: 654 },
                  { id: "ac", label: "Air Conditioning", count: 1043 },
                  { id: "bar", label: "Bar", count: 432 },
                  { id: "spa", label: "Spa", count: 211 },
                ].map((amenity) => (
                  <div key={amenity.id} className="flex items-center space-x-3">
                    <Checkbox
                      id={`amenity-${amenity.id}`}
                      checked={filters.amenities.includes(amenity.id)}
                      onCheckedChange={() => toggleArrayFilter("amenities", amenity.id)}
                    />
                    <label
                      htmlFor={`amenity-${amenity.id}`}
                      className="flex items-center justify-between cursor-pointer flex-1"
                    >
                      <span className="text-sm">{amenity.label}</span>
                      <span className="text-sm text-gray-500">({amenity.count})</span>
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Distance from Center */}
      <Collapsible open={expandedSections.includes("distance")} onOpenChange={() => toggleSection("distance")}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50 pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>Distance from City Center</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${expandedSections.includes("distance") ? "rotate-180" : ""}`}
                />
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="space-y-4">
                <Slider
                  value={filters.distanceFromCenter}
                  onValueChange={(value) => updateFilter("distanceFromCenter", value as [number, number])}
                  max={20}
                  min={0}
                  step={0.5}
                  className="w-full"
                />
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{filters.distanceFromCenter[0]} km</span>
                  <span>{filters.distanceFromCenter[1]} km+</span>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Nearby Landmarks */}
      <Collapsible open={expandedSections.includes("landmarks")} onOpenChange={() => toggleSection("landmarks")}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50 pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-purple-600" />
                  <span>Nearby Landmarks</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${expandedSections.includes("landmarks") ? "rotate-180" : ""}`}
                />
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {landmarks.map((landmark) => (
                  <div key={landmark} className="flex items-center space-x-3">
                    <Checkbox
                      id={`landmark-${landmark}`}
                      checked={filters.nearbyLandmarks.includes(landmark)}
                      onCheckedChange={() => toggleArrayFilter("nearbyLandmarks", landmark)}
                    />
                    <label htmlFor={`landmark-${landmark}`} className="text-sm cursor-pointer flex-1">
                      {landmark}
                    </label>
                    <span className="text-xs text-gray-500">({Math.floor(Math.random() * 200) + 50})</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Neighborhoods */}
      <Collapsible
        open={expandedSections.includes("neighborhoods")}
        onOpenChange={() => toggleSection("neighborhoods")}
      >
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50 pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Building className="w-4 h-4 text-green-600" />
                  <span>Neighborhoods</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${expandedSections.includes("neighborhoods") ? "rotate-180" : ""}`}
                />
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-3">
                {neighborhoods.map((neighborhood) => (
                  <div key={neighborhood} className="flex items-center space-x-2">
                    <Checkbox
                      id={`neighborhood-${neighborhood}`}
                      checked={filters.neighborhoodTypes.includes(neighborhood)}
                      onCheckedChange={() => toggleArrayFilter("neighborhoodTypes", neighborhood)}
                    />
                    <label htmlFor={`neighborhood-${neighborhood}`} className="text-sm cursor-pointer">
                      {neighborhood}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Booking Flexibility */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center space-x-2">
            <Shield className="w-4 h-4 text-green-600" />
            <span>Booking Flexibility</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="free-cancellation"
                checked={filters.freeCancellation}
                onCheckedChange={(checked) => updateFilter("freeCancellation", checked as boolean)}
              />
              <label htmlFor="free-cancellation" className="text-sm cursor-pointer flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span>Free Cancellation</span>
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="pay-at-property"
                checked={filters.payAtProperty}
                onCheckedChange={(checked) => updateFilter("payAtProperty", checked as boolean)}
              />
              <label htmlFor="pay-at-property" className="text-sm cursor-pointer flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-blue-500" />
                <span>Pay at Property</span>
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="instant-confirmation"
                checked={filters.instantConfirmation}
                onCheckedChange={(checked) => updateFilter("instantConfirmation", checked as boolean)}
              />
              <label htmlFor="instant-confirmation" className="text-sm cursor-pointer flex items-center space-x-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span>Instant Confirmation</span>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Property Characteristics */}
      <Collapsible open={expandedSections.includes("property")} onOpenChange={() => toggleSection("property")}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50 pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Building className="w-4 h-4 text-gray-600" />
                  <span>Property Characteristics</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${expandedSections.includes("property") ? "rotate-180" : ""}`}
                />
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Property Age</label>
                <Select
                  value={filters.propertyAge}
                  onValueChange={(value) => updateFilter("propertyAge", value as "new" | "renovated" | "any")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Age</SelectItem>
                    <SelectItem value="new">New Properties (Built in last 5 years)</SelectItem>
                    <SelectItem value="renovated">Recently Renovated</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="sustainability"
                  checked={filters.sustainabilityCertified}
                  onCheckedChange={(checked) => updateFilter("sustainabilityCertified", checked as boolean)}
                />
                <label htmlFor="sustainability" className="text-sm cursor-pointer flex items-center space-x-2">
                  <Leaf className="w-4 h-4 text-green-500" />
                  <span>Eco-Friendly Certified</span>
                </label>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Hotel Chains</label>
                <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                  {hotelChains.map((chain) => (
                    <div key={chain} className="flex items-center space-x-2">
                      <Checkbox
                        id={`chain-${chain}`}
                        checked={filters.chainBrands.includes(chain)}
                        onCheckedChange={() => toggleArrayFilter("chainBrands", chain)}
                      />
                      <label htmlFor={`chain-${chain}`} className="text-sm cursor-pointer">
                        {chain}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Guest Experience Ratings */}
      <Collapsible open={expandedSections.includes("ratings")} onOpenChange={() => toggleSection("ratings")}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50 pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>Guest Experience Ratings</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${expandedSections.includes("ratings") ? "rotate-180" : ""}`}
                />
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-4">
              {Object.entries(filters.reviewScoreByCategory).map(([category, score]) => (
                <div key={category}>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium capitalize">{category}</label>
                    <span className="text-sm text-gray-600">{score}+ stars</span>
                  </div>
                  <Slider
                    value={[score]}
                    onValueChange={(value) =>
                      updateFilter("reviewScoreByCategory", {
                        ...filters.reviewScoreByCategory,
                        [category]: value[0],
                      })
                    }
                    max={5}
                    min={0}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              ))}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Results Summary */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4 text-center">
          <div className="text-lg font-semibold text-blue-900">{(resultsCount ?? 0).toLocaleString()} properties found</div>
          <div className="text-sm text-blue-700">Matching your search criteria</div>
        </CardContent>
      </Card>
    </div>
  )
}

