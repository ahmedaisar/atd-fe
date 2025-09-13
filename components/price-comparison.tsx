"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Star, 
  ExternalLink, 
  Trophy,
  TrendingUp,
  Shield,
  Coffee,
  CreditCard,
  Users,
  MessageSquare,
  Phone,
  Mail,
  ChevronRight,
  Award
} from "lucide-react"
import Image from "next/image"
import type { 
  ApiResponse, 
  HotelRecord, 
  Offer, 
  GroupedOffers,
  PriceComparisonProps,
  ConversionEvent 
} from '@/types/price-aggregator'

const formatCurrency = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount)
}

const getPartnerInfo = (vendor: string, partnerName: string) => {
  const partnerMap: { [key: string]: { name: string, color: string, fallbackBg: string } } = {
    'drbs': { name: 'Hotel Direct', color: 'text-blue-700', fallbackBg: 'bg-blue-100' },
    'bkng': { name: 'Booking.com', color: 'text-blue-600', fallbackBg: 'bg-blue-50' },
    'agda': { name: 'Agoda', color: 'text-red-600', fallbackBg: 'bg-red-50' },
    'expd': { name: 'Expedia', color: 'text-yellow-600', fallbackBg: 'bg-yellow-50' },
    'ctrp': { name: 'Trip.com', color: 'text-orange-600', fallbackBg: 'bg-orange-50' },
    'last': { name: 'lastminute.com', color: 'text-pink-600', fallbackBg: 'bg-pink-50' },
    'ostr': { name: 'Zenhotels', color: 'text-purple-600', fallbackBg: 'bg-purple-50' }
  }
  
  return partnerMap[vendor] || { 
    name: partnerName, 
    color: 'text-gray-700', 
    fallbackBg: 'bg-gray-100' 
  }
}

const getOfferIcon = (flagKey: string) => {
  const iconMap: { [key: string]: any } = {
    'breakfast': Coffee,
    'refundable': Shield,
    'pay_at_hotel': CreditCard
  }
  
  const Icon = iconMap[flagKey] || Shield
  return <Icon className="w-4 h-4" />
}

// Enhanced conversion tracking function
const trackConversion = (eventType: string, data: any) => {
  // In production, this would integrate with analytics services like:
  // - Google Analytics 4
  // - Adobe Analytics  
  // - Custom analytics API
  // - Partner tracking pixels
  
  try {
    // Track with multiple analytics providers
    
    // 1. Google Analytics 4 (gtag)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventType, {
        custom_parameter_1: data.hotel_id,
        custom_parameter_2: data.vendor || data.source,
        custom_parameter_3: data.price || 0,
        value: data.price || 0,
        currency: data.currency || 'USD',
        event_category: 'hotel_booking',
        event_label: `${data.hotel_name} - ${data.partner_name || data.source}`
      })
    }
    
    // 2. Facebook Pixel  
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', eventType === 'booking_click' ? 'Lead' : 'CustomEvent', {
        content_name: data.hotel_name,
        content_category: 'hotel',
        content_ids: [data.hotel_id],
        value: data.price || 0,
        currency: data.currency || 'USD'
      })
    }
    
    // 3. Console logging for development
    console.log(`🎯 Conversion Tracked: ${eventType}`, data)
    
    // 4. Local storage for debugging and demo
    if (typeof window !== 'undefined') {
      const trackingEvents = JSON.parse(localStorage.getItem('price_comparison_events') || '[]')
      trackingEvents.push({
        event: eventType,
        data,
        timestamp: new Date().toISOString()
      })
      // Keep only last 50 events
      localStorage.setItem('price_comparison_events', JSON.stringify(trackingEvents.slice(-50)))
    }
  } catch (error) {
    console.error('Error tracking conversion:', error)
  }
}

interface OfferCardProps {
  offer: Offer
  isHero?: boolean
  onBookClick: (offer: Offer) => void
  savings?: number
  rank: number
}

function OfferCard({ offer, isHero = false, onBookClick, savings, rank }: OfferCardProps) {
  const partnerInfo = getPartnerInfo(offer.vendor, offer.partner_name)
  
  const handleBookClick = () => {
    onBookClick(offer)
  }

  return (
    <Card className={`relative overflow-hidden transition-all duration-200 ${
      isHero 
        ? 'ring-2 ring-blue-500 shadow-xl bg-gradient-to-br from-blue-50 to-white' 
        : 'hover:shadow-lg hover:scale-[1.02] border-gray-200'
    }`}>
      {/* Badges positioned with better spacing */}
      <div className="absolute top-2 left-2 right-2 flex justify-between items-start pointer-events-none z-10">
        {isHero && (
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs px-2.5 py-1 rounded-full flex items-center space-x-1 shadow-lg">
            <Trophy className="w-3 h-3" />
            <span className="font-medium">Best Deal</span>
          </div>
        )}
        <div className="flex items-center space-x-2">
          {savings && savings > 5 && (
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs px-2 py-1 rounded-md shadow-md">
              <span className="font-semibold">{savings}% OFF</span>
            </div>
          )}
        </div>
      </div>
      
      <CardContent className="p-4 pt-8">{/* Increased top padding to account for badges */}
        {/* Partner Info Section */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div className={`w-16 h-10 relative ${partnerInfo.fallbackBg} rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-200 shadow-sm`}>
              <Image
                src={offer.partner_logo}
                alt={offer.partner_name}
                width={60}
                height={36}
                className="max-w-full max-h-full object-contain rounded"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  target.nextElementSibling?.classList.remove('hidden')
                }}
              />
              <span className={`hidden text-xs font-bold ${partnerInfo.color} text-center px-1`}>
                {offer.vendor.toUpperCase()}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <div className={`font-bold text-base ${partnerInfo.color} truncate`}>
                {partnerInfo.name}
              </div>
              <div className="text-sm text-gray-600 truncate">{offer.room_name}</div>
              {offer.direct_offer && (
                <Badge variant="outline" className="text-xs mt-2 border-green-500 text-green-700 bg-green-50 font-medium">
                  Direct Booking
                </Badge>
              )}
            </div>
          </div>
          
          <div className="text-right flex-shrink-0">
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(offer.price)}
            </div>
            <div className="text-sm text-gray-500 font-medium">per night</div>
          </div>
        </div>

        {/* Offer Flags */}
        {offer.offer_flags_new && Object.keys(offer.offer_flags_new).length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.entries(offer.offer_flags_new).map(([key, value]) => (
              <Badge key={key} variant="secondary" className="text-xs flex items-center space-x-1.5 bg-gray-100 hover:bg-gray-200 transition-colors px-2.5 py-1">
                {getOfferIcon(key)}
                <span>{value}</span>
              </Badge>
            ))}
          </div>
        )}

        {/* Action Button */}
        <div className="space-y-3">
          <Button 
            onClick={handleBookClick}
            className={`w-full font-semibold py-3 rounded-lg ${
              isHero 
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg text-white' 
                : 'bg-gray-800 hover:bg-gray-900 text-white'
            } transition-all duration-200 flex items-center justify-center space-x-2`}
          >
            <span>Book Now</span>
            <ExternalLink className="w-4 h-4" />
          </Button>
          
          {rank <= 3 && (
            <div className="flex items-center justify-center">
              <Badge className={`${
                rank === 1 ? 'bg-yellow-500 text-white' :
                rank === 2 ? 'bg-gray-400 text-white' :
                'bg-orange-500 text-white'
              } flex items-center space-x-1 px-3 py-1`}>
                <Award className="w-3 h-3" />
                <span>#{rank} Best Price</span>
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface CustomQuoteCardProps {
  hotelName: string
  onQuoteRequest: () => void
}

function CustomQuoteCard({ hotelName, onQuoteRequest }: CustomQuoteCardProps) {
  return (
    <Card className="border-2 border-dashed border-orange-300 bg-orange-50">
      <CardContent className="p-6 text-center">
        <div className="mb-4">
          <Phone className="w-8 h-8 text-orange-600 mx-auto mb-2" />
          <h3 className="font-semibold text-lg">Need a Custom Quote?</h3>
          <p className="text-sm text-gray-600 mt-1">
            Our travel experts can find you exclusive deals for {hotelName}
          </p>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
            <Shield className="w-4 h-4 text-green-500" />
            <span>Best Price Guarantee</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
            <Users className="w-4 h-4 text-blue-500" />
            <span>Group Discounts Available</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <Button onClick={onQuoteRequest} className="w-full bg-orange-600 hover:bg-orange-700">
            <MessageSquare className="w-4 h-4 mr-2" />
            Get Custom Quote
          </Button>
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Phone className="w-3 h-3" />
              <span>+1-800-TRAVEL</span>
            </div>
            <div className="flex items-center space-x-1">
              <Mail className="w-3 h-3" />
              <span>quotes@agoda.com</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function PriceComparison({ hotelId }: PriceComparisonProps) {
  const [hotelData, setHotelData] = useState<HotelRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTab, setSelectedTab] = useState("all")

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/api/hotels/${hotelId}/offers`, {
          headers: {
            'Content-Type': 'application/json',
          },
          // Add timeout
          signal: AbortSignal.timeout(10000) // 10 second timeout
        })
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Hotel offers not found. Please check the hotel ID.')
          } else if (response.status >= 500) {
            throw new Error('Server error. Please try again later.')
          } else {
            throw new Error(`Failed to fetch offers (${response.status})`)
          }
        }
        
        const data: ApiResponse = await response.json()
        
        if (!data.data || !data.data.records || data.data.records.length === 0) {
          throw new Error('No offers available for this hotel.')
        }
        
        setHotelData(data.data.records[0])
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          setError('Request timed out. Please check your connection and try again.')
        } else {
          setError(err instanceof Error ? err.message : 'Failed to load offers')
        }
        console.error('Error fetching hotel offers:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchOffers()
  }, [hotelId])

  const handleBookOffer = (offer: Offer) => {
    // Enhanced conversion tracking with detailed metrics
    const conversionData = {
      hotel_id: hotelId,
      hotel_name: hotelData?.name,
      offer_id: (offer as any).id || `${offer.vendor}_${offer.room_name}`,
      vendor: offer.vendor,
      partner_name: offer.partner_name,
      room_name: offer.room_name,
      price: offer.price,
      currency: (offer as any).currency || 'USD',
      is_hero_offer: offer === hotelData?.hero_offer,
      source: 'price_comparison',
      timestamp: new Date().toISOString(),
      session_id: generateSessionId(),
      user_agent: navigator.userAgent,
      referrer: document.referrer,
      current_tab: selectedTab
    }
    
    trackConversion('booking_click', conversionData)
    
    // Generate partner-specific booking URL with tracking parameters
    const trackingParams = new URLSearchParams({
      utm_source: 'agoda_clone',
      utm_medium: 'price_comparison',
      utm_campaign: 'hotel_booking',
      utm_content: offer.vendor,
      hotel_id: hotelId,
      offer_id: ((offer as any).id || `${offer.vendor}_${offer.room_name}`),
      session_id: conversionData.session_id
    }).toString()
    
    const bookingUrl = offer.booking_url 
      ? `${offer.booking_url}?${trackingParams}`
      : `https://${offer.vendor}.com/hotel/${hotelId}?${trackingParams}`
    
    // Open in new tab with proper security attributes
    const newWindow = window.open(bookingUrl, '_blank', 'noopener,noreferrer')
    
    // Fallback if popup blocked
    if (!newWindow) {
      window.location.href = bookingUrl
    }
    
    // Track successful redirect
    trackConversion('partner_redirect', {
      ...conversionData,
      redirect_url: bookingUrl
    })
  }

  // Generate session ID for tracking
  const generateSessionId = (): string => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  const handleCustomQuote = () => {
    // Enhanced custom quote tracking
    const quoteData = {
      hotel_id: hotelId,
      hotel_name: hotelData?.name || '',
      source: 'price_comparison',
      timestamp: new Date().toISOString(),
      current_offers_count: (hotelData?.offers.length || 0).toString(),
      lowest_price: hotelData?.hero_offer?.price?.toString() || '',
      highest_price: Math.max(...(hotelData?.offers.map(o => o.price) || [0])).toString(),
      session_id: generateSessionId()
    }
    
    trackConversion('custom_quote_request', quoteData)
    
    // In a real implementation, this would open a custom quote form modal
    // or redirect to a dedicated quote request page
    const quoteFormUrl = `/quote-request?hotel=${hotelId}&${new URLSearchParams(quoteData).toString()}`
    
    // For now, show an alert with the functionality
    alert(`Custom quote request initiated for ${hotelData?.name}. In production, this would open a quote form or redirect to: ${quoteFormUrl}`)
    
    // Log for development
    console.log('Custom quote request:', quoteData)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <Skeleton className="w-6 h-6 rounded" />
            <Skeleton className="h-6 w-48" />
          </div>
          <Skeleton className="h-32 w-full rounded-lg" />
        </Card>
        
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="w-12 h-8 rounded" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <div className="text-right">
                    <Skeleton className="h-6 w-16 mb-1" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                </div>
                <Skeleton className="h-10 w-full" />
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error || !hotelData) {
    return (
      <div className="space-y-6">
        <Card className="p-8 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <ExternalLink className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {error ? 'Unable to Load Offers' : 'No Offers Available'}
              </h3>
              <p className="text-gray-600 mb-4 max-w-md mx-auto">
                {error || 'There are currently no offers available for this hotel.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button 
                  onClick={() => window.location.reload()}
                  variant="outline"
                >
                  Try Again
                </Button>
                <Button 
                  variant="default"
                  onClick={handleCustomQuote}
                >
                  Get Custom Quote
                </Button>
              </div>
            </div>
          </div>
        </Card>
        
        <CustomQuoteCard 
          hotelName={hotelData?.name || "this hotel"}
          onQuoteRequest={handleCustomQuote}
        />
      </div>
    )
  }

  // Group offers by room type
  const groupedOffers: GroupedOffers = hotelData.offers.reduce((acc, offer) => {
    const roomType = offer.room_name
    if (!acc[roomType]) {
      acc[roomType] = []
    }
    acc[roomType].push(offer)
    return acc
  }, {} as GroupedOffers)

  // Sort each group by price
  Object.keys(groupedOffers).forEach(roomType => {
    groupedOffers[roomType].sort((a, b) => a.price - b.price)
  })

  const allOffers = hotelData.offers.sort((a, b) => a.price - b.price)
  const highestPrice = Math.max(...allOffers.map(o => o.price))

  return (
    <div className="space-y-8" data-section="price-comparison">
      {/* Enhanced Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold flex items-center space-x-3">
              <span className="text-gray-900">Compare Prices</span>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 px-3 py-1 text-sm font-medium">
                {hotelData.offers_count} sites
              </Badge>
            </h2>
            <div className="flex items-center space-x-2 text-lg">
              <span className="text-gray-600">
                {formatCurrency(hotelData.best_offer)} - {formatCurrency(hotelData.worst_offer)}
              </span>
              <span className="text-gray-500 text-base">per night</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {hotelData.discount > 0 && (
              <Badge className="bg-green-500 text-white flex items-center space-x-1 px-3 py-2">
                <TrendingUp className="w-4 h-4" />
                <span className="font-semibold">Up to {hotelData.discount}% off</span>
              </Badge>
            )}
            
            <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="font-medium">{hotelData.quality?.review_rating || 'N/A'}</span>
              <span>({(hotelData.quality?.review_count || 0).toLocaleString()} reviews)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Hero Offer */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-full">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-blue-900">Best Deal Available</h3>
              <p className="text-sm text-blue-700">Lowest price across all booking sites</p>
            </div>
          </div>
          <div className="bg-white px-4 py-2 rounded-full text-sm text-blue-700 border-2 border-blue-300 self-start sm:self-center shadow-sm">
            <span className="font-bold">Lowest Price Found</span>
          </div>
        </div>
        
        <OfferCard
          offer={hotelData.hero_offer}
          isHero={true}
          onBookClick={handleBookOffer}
          savings={Math.round(((highestPrice - hotelData.hero_offer.price) / highestPrice) * 100)}
          rank={1}
        />
      </div>

      {/* Price Comparison Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger 
            value="all"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all duration-200 text-sm"
          >
            <span className="hidden sm:inline">All Offers</span>
            <span className="sm:hidden">All</span>
          </TabsTrigger>
          <TabsTrigger 
            value="rooms"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all duration-200 text-sm"
          >
            <span className="hidden sm:inline">By Room Type</span>
            <span className="sm:hidden">Rooms</span>
          </TabsTrigger>
          <TabsTrigger 
            value="partners"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all duration-200 text-sm"
          >
            <span className="hidden sm:inline">By Partner</span>
            <span className="sm:hidden">Partners</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {/* Table-like UI for All Offers */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="w-4 h-4 rounded" />
                  <span className="text-sm text-gray-600">Free cancellation</span>
                </div>
                <div className="text-sm text-gray-600">Price per night ↓</div>
              </div>
            </div>
            
            {/* Table Rows */}
            <div className="divide-y divide-gray-100">
              {allOffers.map((offer, index) => {
                const savings = Math.round(((highestPrice - offer.price) / highestPrice) * 100)
                const partnerInfo = getPartnerInfo(offer.vendor, offer.partner_name)
                
                return (
                  <div key={`${offer.vendor}-${offer.room_name}-${index}`} 
                       className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      {/* Left side - Partner info */}
                      <div className="flex items-center space-x-4 flex-1">
                        <div className={`w-12 h-8 relative ${partnerInfo.fallbackBg} rounded flex items-center justify-center flex-shrink-0 border border-gray-200`}>
                          <Image
                            src={offer.partner_logo}
                            alt={offer.partner_name}
                            width={48}
                            height={32}
                            className="max-w-full max-h-full object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = 'none'
                              target.nextElementSibling?.classList.remove('hidden')
                            }}
                          />
                          <span className={`hidden text-xs font-bold ${partnerInfo.color}`}>
                            {offer.vendor.toUpperCase()}
                          </span>
                        </div>
                        
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center space-x-2">
                            <div className={`font-medium text-sm ${partnerInfo.color}`}>
                              {partnerInfo.name}
                            </div>
                            {index < 3 && (
                              <Badge className={`text-xs ${
                                index === 0 ? 'bg-yellow-500 text-white' :
                                index === 1 ? 'bg-gray-400 text-white' :
                                'bg-orange-500 text-white'
                              } flex items-center space-x-1`}>
                                <Award className="w-3 h-3" />
                                <span>#{index + 1} Best Price</span>
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-gray-500">{offer.room_name}</div>
                          
                          {/* Offer flags in a compact format */}
                          {offer.offer_flags_new && Object.keys(offer.offer_flags_new).length > 0 && (
                            <div className="flex items-center space-x-2 mt-1">
                              {Object.entries(offer.offer_flags_new).slice(0, 3).map(([key, value]) => (
                                <span key={key} className="text-xs text-blue-600 flex items-center space-x-1">
                                  {getOfferIcon(key)}
                                  <span className="hidden sm:inline">{value}</span>
                                </span>
                              ))}
                              {Object.keys(offer.offer_flags_new).length > 3 && (
                                <span className="text-xs text-gray-400">+{Object.keys(offer.offer_flags_new).length - 3} more</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Right side - Price and action */}
                      <div className="flex items-center space-x-4">
                        {savings > 5 && (
                          <div className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                            {savings}% OFF
                          </div>
                        )}
                        
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">
                            {formatCurrency(offer.price)}
                          </div>
                          <div className="text-xs text-gray-500">per night</div>
                        </div>
                        
                        <Button 
                          onClick={() => handleBookOffer(offer)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-sm"
                        >
                          View deal
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            
            {/* Show more offers button */}
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <Button variant="ghost" className="w-full text-blue-600 hover:text-blue-700">
                Show more offers ↓
              </Button>
            </div>
          </div>
          
          {/* Custom Quote Card */}
          <div className="mt-6">
            <CustomQuoteCard 
              hotelName={hotelData.name}
              onQuoteRequest={handleCustomQuote}
            />
          </div>
        </TabsContent>

        <TabsContent value="rooms" className="mt-6">
          <div className="space-y-6">
            {Object.entries(groupedOffers).map(([roomType, offers]) => (
              <div key={roomType}>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <span>{roomType}</span>
                  <Badge variant="outline" className="ml-2">
                    {offers.length} offer{offers.length !== 1 ? 's' : ''}
                  </Badge>
                </h3>
                
                {/* Table-like UI for Room Type Offers */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  {/* Table Header */}
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" className="w-4 h-4 rounded" />
                        <span className="text-sm text-gray-600">Free cancellation</span>
                      </div>
                      <div className="text-sm text-gray-600">Price per night ↓</div>
                    </div>
                  </div>
                  
                  {/* Table Rows */}
                  <div className="divide-y divide-gray-100">
                    {offers.map((offer, index) => {
                      const savings = Math.round(((highestPrice - offer.price) / highestPrice) * 100)
                      const partnerInfo = getPartnerInfo(offer.vendor, offer.partner_name)
                      
                      return (
                        <div key={`${offer.vendor}-${index}`} 
                             className="p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center justify-between">
                            {/* Left side - Partner info */}
                            <div className="flex items-center space-x-4 flex-1">
                              <div className={`w-12 h-8 relative ${partnerInfo.fallbackBg} rounded flex items-center justify-center flex-shrink-0 border border-gray-200`}>
                                <Image
                                  src={offer.partner_logo}
                                  alt={offer.partner_name}
                                  width={48}
                                  height={32}
                                  className="max-w-full max-h-full object-contain"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement
                                    target.style.display = 'none'
                                    target.nextElementSibling?.classList.remove('hidden')
                                  }}
                                />
                                <span className={`hidden text-xs font-bold ${partnerInfo.color}`}>
                                  {offer.vendor.toUpperCase()}
                                </span>
                              </div>
                              
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center space-x-2">
                                  <div className={`font-medium text-sm ${partnerInfo.color}`}>
                                    {partnerInfo.name}
                                  </div>
                                  {index < 3 && (
                                    <Badge className={`text-xs ${
                                      index === 0 ? 'bg-yellow-500 text-white' :
                                      index === 1 ? 'bg-gray-400 text-white' :
                                      'bg-orange-500 text-white'
                                    } flex items-center space-x-1`}>
                                      <Award className="w-3 h-3" />
                                      <span>#{index + 1} Best Price</span>
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-xs text-gray-500">{offer.room_name}</div>
                                
                                {/* Offer flags in a compact format */}
                                {offer.offer_flags_new && Object.keys(offer.offer_flags_new).length > 0 && (
                                  <div className="flex items-center space-x-2 mt-1">
                                    {Object.entries(offer.offer_flags_new).slice(0, 3).map(([key, value]) => (
                                      <span key={key} className="text-xs text-blue-600 flex items-center space-x-1">
                                        {getOfferIcon(key)}
                                        <span className="hidden sm:inline">{value}</span>
                                      </span>
                                    ))}
                                    {Object.keys(offer.offer_flags_new).length > 3 && (
                                      <span className="text-xs text-gray-400">+{Object.keys(offer.offer_flags_new).length - 3} more</span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {/* Right side - Price and action */}
                            <div className="flex items-center space-x-4">
                              {savings > 5 && (
                                <div className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                                  {savings}% OFF
                                </div>
                              )}
                              
                              <div className="text-right">
                                <div className="text-lg font-bold text-gray-900">
                                  {formatCurrency(offer.price)}
                                </div>
                                <div className="text-xs text-gray-500">per night</div>
                              </div>
                              
                              <Button 
                                onClick={() => handleBookOffer(offer)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-sm"
                              >
                                View deal
                              </Button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="partners" className="mt-6">
          {/* Table-like UI for Partners */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="w-4 h-4 rounded" />
                  <span className="text-sm text-gray-600">Free cancellation</span>
                </div>
                <div className="text-sm text-gray-600">Best price per partner ↓</div>
              </div>
            </div>
            
            {/* Table Rows */}
            <div className="divide-y divide-gray-100">
              {/* Group by partner and show best offer per partner */}
              {Object.values(
                allOffers.reduce((acc, offer) => {
                  if (!acc[offer.vendor] || acc[offer.vendor].price > offer.price) {
                    acc[offer.vendor] = offer
                  }
                  return acc
                }, {} as { [vendor: string]: Offer })
              ).sort((a, b) => a.price - b.price).map((offer, index) => {
                const savings = Math.round(((highestPrice - offer.price) / highestPrice) * 100)
                const partnerInfo = getPartnerInfo(offer.vendor, offer.partner_name)
                
                return (
                  <div key={offer.vendor} 
                       className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      {/* Left side - Partner info */}
                      <div className="flex items-center space-x-4 flex-1">
                        <div className={`w-12 h-8 relative ${partnerInfo.fallbackBg} rounded flex items-center justify-center flex-shrink-0 border border-gray-200`}>
                          <Image
                            src={offer.partner_logo}
                            alt={offer.partner_name}
                            width={48}
                            height={32}
                            className="max-w-full max-h-full object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = 'none'
                              target.nextElementSibling?.classList.remove('hidden')
                            }}
                          />
                          <span className={`hidden text-xs font-bold ${partnerInfo.color}`}>
                            {offer.vendor.toUpperCase()}
                          </span>
                        </div>
                        
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center space-x-2">
                            <div className={`font-medium text-sm ${partnerInfo.color}`}>
                              {partnerInfo.name}
                            </div>
                            {index < 3 && (
                              <Badge className={`text-xs ${
                                index === 0 ? 'bg-yellow-500 text-white' :
                                index === 1 ? 'bg-gray-400 text-white' :
                                'bg-orange-500 text-white'
                              } flex items-center space-x-1`}>
                                <Award className="w-3 h-3" />
                                <span>#{index + 1} Best Price</span>
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-gray-500">{offer.room_name}</div>
                          
                          {/* Offer flags in a compact format */}
                          {offer.offer_flags_new && Object.keys(offer.offer_flags_new).length > 0 && (
                            <div className="flex items-center space-x-2 mt-1">
                              {Object.entries(offer.offer_flags_new).slice(0, 3).map(([key, value]) => (
                                <span key={key} className="text-xs text-blue-600 flex items-center space-x-1">
                                  {getOfferIcon(key)}
                                  <span className="hidden sm:inline">{value}</span>
                                </span>
                              ))}
                              {Object.keys(offer.offer_flags_new).length > 3 && (
                                <span className="text-xs text-gray-400">+{Object.keys(offer.offer_flags_new).length - 3} more</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Right side - Price and action */}
                      <div className="flex items-center space-x-4">
                        {savings > 5 && (
                          <div className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                            {savings}% OFF
                          </div>
                        )}
                        
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">
                            {formatCurrency(offer.price)}
                          </div>
                          <div className="text-xs text-gray-500">per night</div>
                        </div>
                        
                        <Button 
                          onClick={() => handleBookOffer(offer)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-sm"
                        >
                          View deal
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Custom Quote Section */}
      <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 sm:p-6 border border-purple-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-purple-900 mb-2 flex items-center space-x-2">
              <MessageSquare className="w-5 h-5" />
              <span>Need a Custom Quote?</span>
            </h3>
            <p className="text-purple-700 text-sm">
              Looking for group bookings, extended stays, or special requirements? 
              Get a personalized quote tailored to your needs.
            </p>
          </div>
          <Button 
            variant="outline" 
            className="border-purple-300 text-purple-700 hover:bg-purple-100 hover:border-purple-400 transition-colors flex items-center space-x-2 whitespace-nowrap"
            onClick={() => {
              // Track custom quote request
              trackConversion('custom_quote_request', {
                hotel_id: hotelData.hs_id,
                source: 'price_comparison'
              })
              // Open custom quote form or navigate to contact page
              console.log('Custom quote requested for hotel:', hotelData.hs_id)
            }}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Request Quote</span>
          </Button>
        </div>
      </div>
    </div>
  )
}