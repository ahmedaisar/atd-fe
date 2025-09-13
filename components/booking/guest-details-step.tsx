"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Mail, Phone, MessageSquare } from "lucide-react"
import type { BookingData } from "@/app/booking/page"

interface GuestDetailsStepProps {
  bookingData: BookingData
  updateBookingData: (updates: Partial<BookingData>) => void
  onNext: () => void
  onPrev: () => void
}

export function GuestDetailsStep({ bookingData, updateBookingData, onNext, onPrev }: GuestDetailsStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(false)

  const handleInputChange = useCallback(
    (field: keyof BookingData["guestDetails"], value: string) => {
      updateBookingData({
        guestDetails: {
          ...bookingData.guestDetails,
          [field]: value,
        },
      })
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }))
      }
    },
    [bookingData.guestDetails, updateBookingData, errors],
  )

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {}

    if (!bookingData.guestDetails.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }
    if (!bookingData.guestDetails.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }
    if (!bookingData.guestDetails.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(bookingData.guestDetails.email)) {
      newErrors.email = "Please enter a valid email address"
    }
    if (!bookingData.guestDetails.phone.trim()) {
      newErrors.phone = "Phone number is required"
    }
    if (!agreeToTerms) {
      newErrors.terms = "You must agree to the terms and conditions"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [bookingData.guestDetails, agreeToTerms])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (validateForm()) {
        onNext()
      }
    },
    [validateForm, onNext],
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Guest Information</span>
          </CardTitle>
          <p className="text-gray-600">Please provide the details for the primary guest</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={bookingData.guestDetails.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className={errors.firstName ? "border-red-500" : ""}
                placeholder="Enter your first name"
              />
              {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={bookingData.guestDetails.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className={errors.lastName ? "border-red-500" : ""}
                placeholder="Enter your last name"
              />
              {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="email" className="flex items-center space-x-1">
              <Mail className="w-4 h-4" />
              <span>Email Address *</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={bookingData.guestDetails.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={errors.email ? "border-red-500" : ""}
              placeholder="Enter your email address"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            <p className="text-sm text-gray-500 mt-1">Your booking confirmation will be sent to this email</p>
          </div>

          <div>
            <Label htmlFor="phone" className="flex items-center space-x-1">
              <Phone className="w-4 h-4" />
              <span>Phone Number *</span>
            </Label>
            <div className="flex space-x-2">
              <Select defaultValue="+1">
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="+1">+1</SelectItem>
                  <SelectItem value="+44">+44</SelectItem>
                  <SelectItem value="+66">+66</SelectItem>
                  <SelectItem value="+86">+86</SelectItem>
                  <SelectItem value="+81">+81</SelectItem>
                </SelectContent>
              </Select>
              <Input
                id="phone"
                value={bookingData.guestDetails.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className={`flex-1 ${errors.phone ? "border-red-500" : ""}`}
                placeholder="Enter your phone number"
              />
            </div>
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5" />
            <span>Special Requests</span>
          </CardTitle>
          <p className="text-gray-600">Any special requests or preferences? (Optional)</p>
        </CardHeader>
        <CardContent>
          <Textarea
            value={bookingData.guestDetails.specialRequests || ""}
            onChange={(e) => handleInputChange("specialRequests", e.target.value)}
            placeholder="e.g., High floor room, early check-in, dietary requirements..."
            rows={4}
          />
          <p className="text-sm text-gray-500 mt-2">
            Special requests are subject to availability and may incur additional charges
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="terms"
                checked={agreeToTerms}
                onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                className={errors.terms ? "border-red-500" : ""}
              />
              <div className="text-sm">
                <label htmlFor="terms" className="cursor-pointer">
                  I agree to the{" "}
                  <a href="/terms" className="text-blue-600 hover:underline">
                    Terms and Conditions
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </a>{" "}
                  *
                </label>
                {errors.terms && <p className="text-red-500 mt-1">{errors.terms}</p>}
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="newsletter"
                checked={subscribeNewsletter}
                onCheckedChange={(checked) => setSubscribeNewsletter(checked as boolean)}
              />
              <label htmlFor="newsletter" className="text-sm cursor-pointer">
                Subscribe to our newsletter for exclusive deals and travel tips
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onPrev}>
          Back to Room Selection
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          Continue to Payment
        </Button>
      </div>
    </form>
  )
}
