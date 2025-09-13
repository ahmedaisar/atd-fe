import { NextRequest, NextResponse } from 'next/server'
import roomsData from '@/data/fixtures/rooms.json'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  
  // Find rooms for this hotel
  const hotelRooms = roomsData.find(hotel => hotel.hotelId === id)
  
  if (!hotelRooms) {
    return NextResponse.json({ error: 'Hotel not found' }, { status: 404 })
  }
  
  // Add some dynamic availability and pricing with more variety
  let enhancedRooms = hotelRooms.rooms.map(room => {
    return {
      ...room,
      images: [
        "/placeholder.jpg",
        "/placeholder.jpg", 
        "/placeholder.jpg"
      ]
    }
  })
  
  // Add more room types based on hotel type
  if (id === "htl-reef-001") {
    enhancedRooms.push(
      {
        id: "rm-reef-beach",
        name: "Beach Villa",
        images: ["/placeholder.jpg", "/placeholder.jpg"],
        sizeSqm: 65,
        bed: { type: "Queen", count: 1 },
        maxOccupancy: { adults: 2, children: 1 },
        amenities: ["Beach Access", "Private Garden", "WiFi", "Mini Bar"],
        rates: [
          {
            id: "rate-bb",
            name: "Bed & Breakfast",
            inclusions: ["Breakfast"],
            cancellation: "Free before 3 days",
            pricePerNight: 280,
            currency: "USD",
            availability: 4
          },
          {
            id: "rate-ai",
            name: "All Inclusive",
            inclusions: ["All Meals", "Drinks", "Activities"],
            cancellation: "Free before 7 days",
            pricePerNight: 450,
            currency: "USD",
            availability: 2
          }
        ]
      },
      {
        id: "rm-reef-suite",
        name: "Presidential Overwater Suite",
        images: ["/placeholder.jpg", "/placeholder.jpg", "/placeholder.jpg"],
        sizeSqm: 120,
        bed: { type: "King", count: 1 },
        maxOccupancy: { adults: 3, children: 2 },
        amenities: ["Sea View", "Private Pool", "Butler Service", "WiFi", "Jacuzzi"],
        rates: [
          {
            id: "rate-lux",
            name: "Luxury Package",
            inclusions: ["All Meals", "Premium Drinks", "Spa Credits", "Airport Transfer"],
            cancellation: "Free before 7 days",
            pricePerNight: 850,
            currency: "USD",
            availability: 1
          }
        ]
      }
    )
  } else if (id === "htl-bkk-002") {
    enhancedRooms.push(
      {
        id: "rm-bkk-deluxe",
        name: "Deluxe Room",
        images: ["/placeholder.jpg", "/placeholder.jpg"],
        sizeSqm: 35,
        bed: { type: "King", count: 1 },
        maxOccupancy: { adults: 2, children: 1 },
        amenities: ["City View", "WiFi", "Mini Bar", "Work Desk"],
        rates: [
          {
            id: "rate-std",
            name: "Standard Rate",
            inclusions: ["WiFi"],
            cancellation: "Free before 1 day",
            pricePerNight: 125,
            currency: "USD",
            availability: 8
          },
          {
            id: "rate-bb",
            name: "Bed & Breakfast",
            inclusions: ["WiFi", "Breakfast"],
            cancellation: "Free before 1 day",
            pricePerNight: 145,
            currency: "USD",
            availability: 6
          }
        ]
      },
      {
        id: "rm-bkk-suite",
        name: "Executive Suite",
        images: ["/placeholder.jpg", "/placeholder.jpg", "/placeholder.jpg"],
        sizeSqm: 55,
        bed: { type: "King", count: 1 },
        maxOccupancy: { adults: 3, children: 2 },
        amenities: ["River View", "Separate Living Area", "WiFi", "Mini Bar", "Work Desk", "Bathtub"],
        rates: [
          {
            id: "rate-exec",
            name: "Executive Rate",
            inclusions: ["WiFi", "Breakfast", "Club Lounge Access"],
            cancellation: "Free before 1 day",
            pricePerNight: 220,
            currency: "USD",
            availability: 3
          }
        ]
      }
    )
  }
  
  // Enhanced room data with dynamic pricing and availability
  const finalRooms = enhancedRooms.map(room => ({
    ...room,
    rates: room.rates.map(rate => {
      const nights = 3 // Assuming 3 nights for demo
      const basePrice = rate.pricePerNight * nights
      const taxes = Math.round(basePrice * 0.15) // 15% taxes
      const serviceFee = Math.round(basePrice * 0.05) // 5% service fee
      
      return {
        ...rate,
        priceBreakdown: {
          basePrice,
          taxes,
          serviceFee,
          totalPrice: basePrice + taxes + serviceFee
        },
        available: rate.availability > 0,
        urgencyMessage: rate.availability <= 2 ? `Only ${rate.availability} left!` : 
                      rate.availability <= 5 ? `${rate.availability} rooms left` : null,
        popularChoice: rate.name.includes('Breakfast') || rate.name.includes('All Inclusive'),
        savings: rate.name === 'Non-refundable' ? 15 : null // 15% savings for non-refundable
      }
    })
  }))
  
  return NextResponse.json({
    hotelId: id,
    rooms: finalRooms,
    checkIn: "2024-12-20",
    checkOut: "2024-12-23",
    nights: 3,
    guests: {
      adults: 2,
      children: 0
    }
  })
}
