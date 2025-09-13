import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MobileNavigation } from "@/components/mobile-navigation"
import { EnhancedPricingDisplay } from "@/components/enhanced-pricing-display"
import { RoomDetailsComponent as EnhancedRoomDetailsComponent } from "@/components/enhanced-room-details"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  Star,
  Wifi,
  Car,
  Coffee,
  Dumbbell,
  Waves,
  Utensils,
  Shield,
  Phone,
  Mail,
  Calendar,
  Camera,
  Heart,
  Share2,
} from "lucide-react"
import Image from "next/image"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

// Mock data for the hotel offer
const hotelOffer = {
  id: "offer-1",
  name: "Maldives Paradise Resort",
  location: "North Malé Atoll, Maldives",
  rating: 4.8,
  reviewCount: 1247,
  images: [
    "/placeholder.svg?height=600&width=800&text=Resort+Exterior",
    "/placeholder.svg?height=600&width=800&text=Overwater+Villa",
    "/placeholder.svg?height=600&width=800&text=Beach+View",
    "/placeholder.svg?height=600&width=800&text=Pool+Area",
    "/placeholder.svg?height=600&width=800&text=Restaurant",
    "/placeholder.svg?height=600&width=800&text=Spa",
  ],
  description:
    "Experience the ultimate luxury at Maldives Paradise Resort, where pristine white beaches meet crystal-clear turquoise waters. This exclusive resort offers overwater villas with private pools, world-class dining, and unparalleled service in one of the world's most beautiful destinations.",
  highlights: [
    "Overwater villas with private pools",
    "All-inclusive luxury experience",
    "World-class spa and wellness center",
    "Multiple dining options",
    "Water sports and diving center",
    "Butler service available",
  ],
  amenities: [
    { icon: "wifi", name: "Free WiFi", description: "High-speed internet throughout the resort" },
    { icon: "car", name: "Airport Transfer", description: "Complimentary seaplane transfers" },
    { icon: "coffee", name: "All-Inclusive", description: "All meals and beverages included" },
    { icon: "dumbbell", name: "Fitness Center", description: "24/7 gym with ocean views" },
    { icon: "waves", name: "Water Sports", description: "Kayaking, snorkeling, diving" },
    { icon: "utensils", name: "Fine Dining", description: "5 restaurants and 3 bars" },
  ],
  offer: {
    originalPrice: 850,
    discountedPrice: 599,
    discountPercentage: 30,
    validUntil: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    terms: [
      "Valid for stays between March 1 - May 31, 2024",
      "Minimum 3 nights stay required",
      "Subject to availability",
      "Cannot be combined with other offers",
      "Free cancellation up to 48 hours before check-in",
    ],
  },
  contact: {
    phone: "+960 664-2626",
    email: "reservations@maldivesparadise.com",
    website: "www.maldivesparadise.com",
  },
}

const enhancedPricing = {
  basePrice: 599,
  taxes: 89,
  fees: {
    resort: 45,
    service: 25,
  },
  totalPrice: 758,
  pricePerNight: 599,
  savingsAmount: 251,
  priceComparison: {
    otherSites: [
      { siteName: "Booking.com", price: 825, available: true },
      { siteName: "Expedia", price: 799, available: true },
      { siteName: "Hotels.com", price: 850, available: false },
    ],
  },
  priceHistory: {
    trend: "down" as const,
    lowestPrice30Days: 599,
    averagePrice30Days: 750,
    priceChangePercentage: -20,
  },
  memberPricing: {
    memberPrice: 549,
    memberSavings: 50,
    loyaltyPoints: 1200,
  },
  dynamicPricing: {
    demandLevel: "high" as const,
    urgencyMessage: "Only 2 villas left at this price!",
    priceValidUntil: new Date(Date.now() + 6 * 60 * 60 * 1000),
  },
}

const roomDetails = {
  id: "overwater-villa",
  name: "Overwater Villa with Private Pool",
  images: {
    main: [
      "/placeholder.svg?height=400&width=600&text=Villa+Exterior",
      "/placeholder.svg?height=400&width=600&text=Villa+Interior",
      "/placeholder.svg?height=400&width=600&text=Private+Pool",
    ],
    bathroom: [
      "/placeholder.svg?height=400&width=600&text=Bathroom+1",
      "/placeholder.svg?height=400&width=600&text=Bathroom+2",
    ],
    view: [
      "/placeholder.svg?height=400&width=600&text=Ocean+View",
      "/placeholder.svg?height=400&width=600&text=Sunset+View",
    ],
    amenities: [
      "/placeholder.svg?height=400&width=600&text=Private+Deck",
      "/placeholder.svg?height=400&width=600&text=Outdoor+Shower",
    ],
  },
  virtualTour: "https://example.com/virtual-tour",
  floorPlan: "/placeholder.svg?height=600&width=800&text=Floor+Plan",
  roomFeatures: {
    size: 120,
    bedTypes: [{ type: "King Bed", count: 1, size: "180cm x 200cm" }],
    maxOccupancy: {
      adults: 2,
      children: 1,
      infants: 1,
    },
    accessibility: ["Wheelchair accessible", "Grab bars in bathroom"],
    view: "Ocean View",
    floor: "Over Water",
  },
  availabilityCalendar: {
    "2024-03-15": { available: true, price: 599, minStay: 3 },
    "2024-03-16": { available: true, price: 599, minStay: 3 },
    "2024-03-17": { available: false, price: 0 },
  },
  amenities: [
    {
      category: "bedroom",
      items: [
        { name: "King Size Bed", description: "Premium mattress with ocean views", icon: "bed" },
        { name: "Private Balcony", description: "Overwater deck with direct ocean access", icon: "balcony" },
      ],
    },
    {
      category: "bathroom",
      items: [
        { name: "Rain Shower", description: "Indoor and outdoor shower options", icon: "shower" },
        { name: "Luxury Toiletries", description: "Premium spa products", icon: "toiletries" },
      ],
    },
  ],
  policies: {
    checkIn: "15:00",
    checkOut: "12:00",
    cancellation: "Free cancellation up to 48 hours",
    smoking: false,
    pets: false,
    children: "Children welcome with additional charges",
  },
}

export default function HotelOfferPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <MobileNavigation />

      <main>
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/hotels">Hotels</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/hotels/offers">Offers</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{hotelOffer.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative h-96 md:h-[500px] overflow-hidden">
          <Image src={hotelOffer.images[0] || "/placeholder.svg"} alt={hotelOffer.name} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Offer Badge */}
          <div className="absolute top-6 left-6">
            <Badge className="bg-red-500 text-white text-lg px-4 py-2">
              {hotelOffer.offer.discountPercentage}% OFF - Limited Time
            </Badge>
          </div>

          {/* Action Buttons */}
          <div className="absolute top-6 right-6 flex space-x-2">
            <Button variant="outline" size="sm" className="bg-white/90">
              <Heart className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" className="bg-white/90">
              <Share2 className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" className="bg-white/90">
              <Camera className="w-4 h-4" />
            </Button>
          </div>

          {/* Hotel Info Overlay */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{hotelOffer.name}</h1>
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(hotelOffer.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="font-semibold ml-1">{hotelOffer.rating}</span>
                      <span className="text-gray-600 text-sm">({hotelOffer.reviewCount} reviews)</span>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{hotelOffer.location}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500 line-through">${hotelOffer.offer.originalPrice}</div>
                  <div className="text-3xl font-bold text-red-600">${hotelOffer.offer.discountedPrice}</div>
                  <div className="text-sm text-gray-600">per night</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">About This Offer</h2>
                  <p className="text-gray-700 leading-relaxed mb-6">{hotelOffer.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {hotelOffer.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full" />
                        <span className="text-gray-700">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Amenities */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Resort Amenities</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {hotelOffer.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          {amenity.icon === "wifi" && <Wifi className="w-5 h-5 text-blue-600" />}
                          {amenity.icon === "car" && <Car className="w-5 h-5 text-blue-600" />}
                          {amenity.icon === "coffee" && <Coffee className="w-5 h-5 text-blue-600" />}
                          {amenity.icon === "dumbbell" && <Dumbbell className="w-5 h-5 text-blue-600" />}
                          {amenity.icon === "waves" && <Waves className="w-5 h-5 text-blue-600" />}
                          {amenity.icon === "utensils" && <Utensils className="w-5 h-5 text-blue-600" />}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{amenity.name}</h3>
                          <p className="text-sm text-gray-600">{amenity.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Room Details */}
              <EnhancedRoomDetailsComponent room={roomDetails} />

              {/* Terms & Conditions */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Offer Terms & Conditions</h2>
                  <div className="space-y-3">
                    {hotelOffer.offer.terms.map((term, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <Shield className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{term}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Need Assistance?</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="font-medium">Call Us</div>
                        <div className="text-sm text-gray-600">{hotelOffer.contact.phone}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="font-medium">Email</div>
                        <div className="text-sm text-gray-600">{hotelOffer.contact.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="font-medium">24/7 Support</div>
                        <div className="text-sm text-gray-600">Available anytime</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <EnhancedPricingDisplay pricing={enhancedPricing} hotelName={hotelOffer.name} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
