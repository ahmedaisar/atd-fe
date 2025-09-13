"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Bell,
  ExternalLink,
  Star,
  Clock,
  AlertTriangle,
  Shield,
  Gift,
} from "lucide-react"
import type { EnhancedPricing } from "@/types/enhanced-pricing"

interface EnhancedPricingDisplayProps {
  pricing: EnhancedPricing
  hotelName: string
}

export function EnhancedPricingDisplay({ pricing, hotelName }: EnhancedPricingDisplayProps) {
  const [showPriceAlert, setShowPriceAlert] = useState(false)
  const [timeLeft, setTimeLeft] = useState<string>("")

  useEffect(() => {
    if (pricing.dynamicPricing?.priceValidUntil) {
      const timer = setInterval(() => {
        const now = new Date().getTime()
        const until = pricing.dynamicPricing?.priceValidUntil?.getTime()
        const distance = (until ?? 0) - now

        if (distance > 0) {
          const hours = Math.floor(distance / (1000 * 60 * 60))
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
          setTimeLeft(`${hours}h ${minutes}m`)
        }
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [pricing.dynamicPricing?.priceValidUntil])

  const getPriceIcon = () => {
    if (!pricing.priceHistory) return <Minus className="w-4 h-4" />

    switch (pricing.priceHistory.trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-red-500" />
      case "down":
        return <TrendingDown className="w-4 h-4 text-green-500" />
      default:
        return <Minus className="w-4 h-4 text-gray-500" />
    }
  }

  const getDemandColor = () => {
    switch (pricing.dynamicPricing?.demandLevel) {
      case "high":
        return "text-red-600 bg-red-50"
      case "medium":
        return "text-orange-600 bg-orange-50"
      default:
        return "text-green-600 bg-green-50"
    }
  }

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{hotelName}</CardTitle>
          {pricing.memberPricing && (
            <Badge className="bg-purple-100 text-purple-800">
              <Star className="w-3 h-3 mr-1" />
              Member Price
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Dynamic Pricing Alert */}
        {pricing.dynamicPricing && (
          <div className={`p-3 rounded-lg ${getDemandColor()}`}>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">
                {pricing.dynamicPricing.urgencyMessage ||
                  `${pricing.dynamicPricing.demandLevel.charAt(0).toUpperCase() + pricing.dynamicPricing.demandLevel.slice(1)} demand`}
              </span>
            </div>
            {timeLeft && (
              <div className="flex items-center space-x-1 mt-1 text-xs">
                <Clock className="w-3 h-3" />
                <span>Price valid for {timeLeft}</span>
              </div>
            )}
          </div>
        )}

        <Tabs defaultValue="pricing" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="comparison">Compare</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="pricing" className="space-y-4">
            {/* Main Price Display */}
            <div className="text-center py-4 bg-blue-50 rounded-lg">
              {pricing.memberPricing ? (
                <div>
                  <div className="text-sm text-gray-500 line-through">${pricing.basePrice}</div>
                  <div className="text-3xl font-bold text-purple-600">${pricing.memberPricing.memberPrice}</div>
                  <div className="text-sm text-purple-600">Member saves ${pricing.memberPricing.memberSavings}</div>
                </div>
              ) : (
                <div>
                  <div className="text-3xl font-bold text-blue-600">${pricing.basePrice}</div>
                  <div className="text-sm text-gray-600">per night</div>
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Base price × 1 night</span>
                <span>${pricing.basePrice}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Taxes and fees</span>
                <span>${pricing.taxes}</span>
              </div>
              {Object.entries(pricing.fees).map(
                ([key, value]) =>
                  value && (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="capitalize">{key} fee</span>
                      <span>${value}</span>
                    </div>
                  ),
              )}
              <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                <span>Total</span>
                <span>${pricing.totalPrice}</span>
              </div>
            </div>

            {/* Savings Display */}
            {pricing.savingsAmount && (
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2 text-green-700">
                  <Gift className="w-4 h-4" />
                  <span className="font-medium">You save ${pricing.savingsAmount}</span>
                </div>
              </div>
            )}

            {/* Member Benefits */}
            {pricing.memberPricing && (
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2 text-purple-700 mb-2">
                  <Star className="w-4 h-4" />
                  <span className="font-medium">Member Benefits</span>
                </div>
                <div className="text-sm text-purple-600">Earn {pricing.memberPricing.loyaltyPoints} points</div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="comparison" className="space-y-4">
            {pricing.priceComparison ? (
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Compare with other sites:</h4>
                {pricing.priceComparison.otherSites.map((site, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{site.siteName}</span>
                      {!site.available && (
                        <Badge variant="outline" className="text-xs">
                          Sold Out
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`font-medium ${site.price > pricing.totalPrice ? "text-red-600" : "text-green-600"}`}
                      >
                        ${site.price}
                      </span>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                ))}
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-sm text-blue-700 font-medium">✓ Best price guaranteed on our site</div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Price comparison not available</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {pricing.priceHistory ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Price Trend (30 days)</span>
                  <div className="flex items-center space-x-1">
                    {getPriceIcon()}
                    <span
                      className={`text-sm ${
                        pricing.priceHistory.trend === "up"
                          ? "text-red-600"
                          : pricing.priceHistory.trend === "down"
                            ? "text-green-600"
                            : "text-gray-600"
                      }`}
                    >
                      {pricing.priceHistory.priceChangePercentage > 0 ? "+" : ""}
                      {pricing.priceHistory.priceChangePercentage}%
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Lowest price (30 days)</span>
                    <span className="font-medium text-green-600">${pricing.priceHistory.lowestPrice30Days}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Average price (30 days)</span>
                    <span>${pricing.priceHistory.averagePrice30Days}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Current price</span>
                    <span className="font-medium">${pricing.basePrice}</span>
                  </div>
                </div>

                <Progress
                  value={
                    ((pricing.basePrice - pricing.priceHistory.lowestPrice30Days) /
                      pricing.priceHistory.lowestPrice30Days) *
                    100
                  }
                  className="h-2"
                />

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent"
                  onClick={() => setShowPriceAlert(!showPriceAlert)}
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Set Price Alert
                </Button>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Price history not available</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Trust Signals */}
        <div className="flex items-center justify-center space-x-4 pt-4 border-t">
          <div className="flex items-center space-x-1 text-xs text-gray-600">
            <Shield className="w-3 h-3" />
            <span>Secure Booking</span>
          </div>
          <div className="flex items-center space-x-1 text-xs text-gray-600">
            <Clock className="w-3 h-3" />
            <span>Free Cancellation</span>
          </div>
        </div>

        {/* Book Button */}
        <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-lg font-semibold">Reserve Now</Button>

        <p className="text-xs text-gray-500 text-center">You won't be charged yet</p>
      </CardContent>
    </Card>
  )
}
