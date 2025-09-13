"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BookingSteps } from "@/components/booking-steps"
import { RoomSelectionStep } from "@/components/booking/room-selection-step"
import { GuestDetailsStep } from "@/components/booking/guest-details-step"
import { PaymentStep } from "@/components/booking/payment-step"
import { BookingConfirmation } from "@/components/booking/booking-confirmation"
import { BookingSummary } from "@/components/booking/booking-summary"

export interface BookingData {
  rooms: Array<{
    id: number
    name: string
    quantity: number
    price: number
    nights: number
  }>
  dates: {
    checkIn: Date
    checkOut: Date
    nights: number
  }
  guests: {
    adults: number
    children: number
  }
  guestDetails: {
    firstName: string
    lastName: string
    email: string
    phone: string
    specialRequests?: string
  }
  payment: {
    method: string
    cardNumber?: string
    expiryDate?: string
    cvv?: string
    billingAddress?: {
      street: string
      city: string
      country: string
      postalCode: string
    }
  }
  totalPrice: number
  bookingId?: string
}

const initialBookingData: BookingData = {
  rooms: [],
  dates: {
    checkIn: new Date(2024, 6, 23),
    checkOut: new Date(2024, 6, 24),
    nights: 1,
  },
  guests: {
    adults: 2,
    children: 0,
  },
  guestDetails: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  },
  payment: {
    method: "",
  },
  totalPrice: 0,
}

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [bookingData, setBookingData] = useState<BookingData>(initialBookingData)
  const [isLoading, setIsLoading] = useState(false)
  const [initialized, setInitialized] = useState(false)
  const searchParams = useSearchParams()

  const getRoomName = useCallback((roomId: number) => {
    const roomNames = {
      1: "Deluxe Room",
      2: "Premier Room",
      3: "Suite",
    }
    return roomNames[roomId as keyof typeof roomNames] || "Unknown Room"
  }, [])

  const getRoomPrice = useCallback((roomId: number) => {
    const roomPrices = {
      1: 185,
      2: 245,
      3: 385,
    }
    return roomPrices[roomId as keyof typeof roomPrices] || 0
  }, [])

  useEffect(() => {
    if (initialized) return

    const roomId = searchParams.get("roomId")
    const quantity = searchParams.get("quantity")
    const rooms = searchParams.get("rooms")

    if (roomId && quantity) {
      // Single room selection
      const room = {
        id: Number.parseInt(roomId),
        name: getRoomName(Number.parseInt(roomId)),
        quantity: Number.parseInt(quantity),
        price: getRoomPrice(Number.parseInt(roomId)),
        nights: 1,
      }
      setBookingData((prev) => ({
        ...prev,
        rooms: [room],
        totalPrice: room.price * room.quantity * room.nights,
      }))
      setCurrentStep(2) // Skip room selection
    } else if (rooms) {
      // Multiple rooms selection
      try {
        const selectedRooms = JSON.parse(decodeURIComponent(rooms))
        const roomsArray = Object.entries(selectedRooms).map(([roomId, quantity]) => ({
          id: Number.parseInt(roomId),
          name: getRoomName(Number.parseInt(roomId)),
          quantity: quantity as number,
          price: getRoomPrice(Number.parseInt(roomId)),
          nights: 1,
        }))
        const total = roomsArray.reduce((sum, room) => sum + room.price * room.quantity * room.nights, 0)
        setBookingData((prev) => ({
          ...prev,
          rooms: roomsArray,
          totalPrice: total,
        }))
        setCurrentStep(2) // Skip room selection
      } catch (error) {
        console.error("Error parsing rooms data:", error)
      }
    }

    setInitialized(true)
  }, [searchParams, getRoomName, getRoomPrice, initialized])

  const updateBookingData = useCallback((updates: Partial<BookingData>) => {
    setBookingData((prev) => ({ ...prev, ...updates }))
  }, [])

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => (prev < 4 ? prev + 1 : prev))
  }, [])

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => (prev > 1 ? prev - 1 : prev))
  }, [])

  const completeBooking = useCallback(async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const bookingId = `AGD${Date.now().toString().slice(-6)}`
    updateBookingData({ bookingId })
    setIsLoading(false)
    nextStep()
  }, [updateBookingData, nextStep])

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <RoomSelectionStep bookingData={bookingData} updateBookingData={updateBookingData} onNext={nextStep} />
      case 2:
        return (
          <GuestDetailsStep
            bookingData={bookingData}
            updateBookingData={updateBookingData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )
      case 3:
        return (
          <PaymentStep
            bookingData={bookingData}
            updateBookingData={updateBookingData}
            onNext={completeBooking}
            onPrev={prevStep}
            isLoading={isLoading}
          />
        )
      case 4:
        return <BookingConfirmation bookingData={bookingData} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Booking</h1>
          <p className="text-gray-600">The Sukhothai Bangkok</p>
        </div>

        <BookingSteps currentStep={currentStep} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">{renderCurrentStep()}</div>
          <div className="lg:col-span-1">
            <BookingSummary bookingData={bookingData} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
