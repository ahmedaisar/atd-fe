"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Shield, Lock, AlertCircle } from "lucide-react"
import type { BookingData } from "@/app/booking/page"

interface PaymentStepProps {
  bookingData: BookingData
  updateBookingData: (updates: Partial<BookingData>) => void
  onNext: () => void
  onPrev: () => void
  isLoading: boolean
}

export function PaymentStep({ bookingData, updateBookingData, onNext, onPrev, isLoading }: PaymentStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [paymentMethod, setPaymentMethod] = useState("credit-card")
  const [saveCard, setSaveCard] = useState(false)

  const handlePaymentChange = useCallback(
    (field: string, value: string) => {
      if (field.startsWith("billing.")) {
        const billingField = field.replace("billing.", "")
        updateBookingData({
          payment: {
            ...bookingData.payment,
            billingAddress: {
              street: bookingData.payment.billingAddress?.street || "",
              city: bookingData.payment.billingAddress?.city || "",
              country: bookingData.payment.billingAddress?.country || "",
              postalCode: bookingData.payment.billingAddress?.postalCode || "",
              [billingField]: value,
            },
          },
        })
      } else {
        updateBookingData({
          payment: {
            ...bookingData.payment,
            [field]: value,
          },
        })
      }
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }))
      }
    },
    [bookingData.payment, updateBookingData, errors],
  )

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {}

    if (paymentMethod === "credit-card") {
      if (!bookingData.payment.cardNumber?.trim()) {
        newErrors.cardNumber = "Card number is required"
      }
      if (!bookingData.payment.expiryDate?.trim()) {
        newErrors.expiryDate = "Expiry date is required"
      }
      if (!bookingData.payment.cvv?.trim()) {
        newErrors.cvv = "CVV is required"
      }
      if (!bookingData.payment.billingAddress?.street?.trim()) {
        newErrors.street = "Street address is required"
      }
      if (!bookingData.payment.billingAddress?.city?.trim()) {
        newErrors.city = "City is required"
      }
      if (!bookingData.payment.billingAddress?.country?.trim()) {
        newErrors.country = "Country is required"
      }
      if (!bookingData.payment.billingAddress?.postalCode?.trim()) {
        newErrors.postalCode = "Postal code is required"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [paymentMethod, bookingData.payment])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (validateForm()) {
        updateBookingData({
          payment: {
            ...bookingData.payment,
            method: paymentMethod,
          },
        })
        onNext()
      }
    },
    [validateForm, updateBookingData, bookingData.payment, paymentMethod, onNext],
  )

  const formatCardNumber = useCallback((value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }, [])

  const formatExpiryDate = useCallback((value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }
    return v
  }, [])

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Method Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                paymentMethod === "credit-card" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setPaymentMethod("credit-card")}
            >
              <div className="flex items-center space-x-3">
                <CreditCard className="w-5 h-5" />
                <div>
                  <div className="font-medium">Credit/Debit Card</div>
                  <div className="text-sm text-gray-500">Visa, Mastercard, Amex</div>
                </div>
              </div>
            </div>
            <div
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                paymentMethod === "paypal" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setPaymentMethod("paypal")}
            >
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-blue-600 rounded"></div>
                <div>
                  <div className="font-medium">PayPal</div>
                  <div className="text-sm text-gray-500">Pay with PayPal</div>
                </div>
              </div>
            </div>
            <div
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                paymentMethod === "bank-transfer"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setPaymentMethod("bank-transfer")}
            >
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-green-600 rounded"></div>
                <div>
                  <div className="font-medium">Bank Transfer</div>
                  <div className="text-sm text-gray-500">Direct bank transfer</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Credit Card Form */}
      {paymentMethod === "credit-card" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5" />
              <span>Card Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="cardNumber">Card Number *</Label>
              <Input
                id="cardNumber"
                value={bookingData.payment.cardNumber || ""}
                onChange={(e) => handlePaymentChange("cardNumber", formatCardNumber(e.target.value))}
                className={errors.cardNumber ? "border-red-500" : ""}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
              {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate">Expiry Date *</Label>
                <Input
                  id="expiryDate"
                  value={bookingData.payment.expiryDate || ""}
                  onChange={(e) => handlePaymentChange("expiryDate", formatExpiryDate(e.target.value))}
                  className={errors.expiryDate ? "border-red-500" : ""}
                  placeholder="MM/YY"
                  maxLength={5}
                />
                {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
              </div>
              <div>
                <Label htmlFor="cvv">CVV *</Label>
                <Input
                  id="cvv"
                  value={bookingData.payment.cvv || ""}
                  onChange={(e) => handlePaymentChange("cvv", e.target.value.replace(/\D/g, ""))}
                  className={errors.cvv ? "border-red-500" : ""}
                  placeholder="123"
                  maxLength={4}
                />
                {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="saveCard"
                checked={saveCard}
                onCheckedChange={(checked) => setSaveCard(checked as boolean)}
              />
              <label htmlFor="saveCard" className="text-sm cursor-pointer">
                Save this card for future bookings
              </label>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Billing Address */}
      {paymentMethod === "credit-card" && (
        <Card>
          <CardHeader>
            <CardTitle>Billing Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="street">Street Address *</Label>
              <Input
                id="street"
                value={bookingData.payment.billingAddress?.street || ""}
                onChange={(e) => handlePaymentChange("billing.street", e.target.value)}
                className={errors.street ? "border-red-500" : ""}
                placeholder="Enter your street address"
              />
              {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={bookingData.payment.billingAddress?.city || ""}
                  onChange={(e) => handlePaymentChange("billing.city", e.target.value)}
                  className={errors.city ? "border-red-500" : ""}
                  placeholder="Enter your city"
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
              </div>
              <div>
                <Label htmlFor="postalCode">Postal Code *</Label>
                <Input
                  id="postalCode"
                  value={bookingData.payment.billingAddress?.postalCode || ""}
                  onChange={(e) => handlePaymentChange("billing.postalCode", e.target.value)}
                  className={errors.postalCode ? "border-red-500" : ""}
                  placeholder="Enter postal code"
                />
                {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="country">Country *</Label>
              <Select
                value={bookingData.payment.billingAddress?.country || ""}
                onValueChange={(value) => handlePaymentChange("billing.country", value)}
              >
                <SelectTrigger className={errors.country ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select your country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="US">United States</SelectItem>
                  <SelectItem value="CA">Canada</SelectItem>
                  <SelectItem value="GB">United Kingdom</SelectItem>
                  <SelectItem value="TH">Thailand</SelectItem>
                  <SelectItem value="SG">Singapore</SelectItem>
                  <SelectItem value="JP">Japan</SelectItem>
                  <SelectItem value="AU">Australia</SelectItem>
                </SelectContent>
              </Select>
              {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Notice */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-green-900">Secure Payment</h3>
              <p className="text-sm text-green-700 mt-1">
                Your payment information is encrypted and secure. We use industry-standard SSL encryption to protect
                your data.
              </p>
              <div className="flex items-center space-x-4 mt-2">
                <Badge variant="outline" className="text-green-700 border-green-300">
                  <Lock className="w-3 h-3 mr-1" />
                  SSL Encrypted
                </Badge>
                <Badge variant="outline" className="text-green-700 border-green-300">
                  PCI Compliant
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Notice */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-yellow-900">Important Notice</h3>
              <p className="text-sm text-yellow-700 mt-1">
                You will not be charged until your booking is confirmed. Free cancellation is available until 24 hours
                before check-in.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onPrev}>
          Back to Guest Details
        </Button>
        <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
          {isLoading ? "Processing..." : `Complete Booking - $${bookingData.totalPrice}`}
        </Button>
      </div>
    </form>
  )
}
