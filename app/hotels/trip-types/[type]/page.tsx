import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MobileNavigation } from "@/components/mobile-navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Users, Plane, Camera, Coffee, Mountain, Wine, Briefcase, Backpack } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const tripTypeData: { [key: string]: any } = {
  family: {
    name: "Family Vacations",
    description: "Create unforgettable memories with your loved ones at family-friendly resorts designed for all ages.",
    icon: Users,
    color: "bg-green-600",
    heroImage: "/placeholder.svg?height=500&width=1200&text=Family+Resort",
    features: [
      "Kids' clubs and supervised activities",
      "Family suites and connecting rooms",
      "Child-friendly dining options",
      "Safe swimming areas and water parks",
      "Entertainment for all ages",
      "Babysitting services available",
    ],
    popularDestinations: [
      { name: "Orlando, Florida", price: 189, image: "/placeholder.svg?height=200&width=300&text=Orlando" },
      { name: "Phuket, Thailand", price: 145, image: "/placeholder.svg?height=200&width=300&text=Phuket" },
      { name: "Gold Coast, Australia", price: 220, image: "/placeholder.svg?height=200&width=300&text=Gold+Coast" },
    ],
    tips: [
      "Book connecting rooms for larger families",
      "Look for resorts with kids' clubs",
      "Consider all-inclusive packages",
      "Check for family discounts",
    ],
    bestTime: "School holidays and summer months",
    averageStay: "5-7 nights",
    budgetRange: "$150-400 per night",
  },
  romantic: {
    name: "Romantic Getaways",
    description: "Escape to intimate settings perfect for couples seeking romance and relaxation.",
    icon: Heart,
    color: "bg-pink-600",
    heroImage: "/placeholder.svg?height=500&width=1200&text=Romantic+Resort",
    features: [
      "Adults-only properties",
      "Private dining experiences",
      "Couples' spa treatments",
      "Sunset views and beach access",
      "Honeymoon suites with special amenities",
      "Romantic excursions and activities",
    ],
    popularDestinations: [
      { name: "Santorini, Greece", price: 350, image: "/placeholder.svg?height=200&width=300&text=Santorini" },
      { name: "Maldives", price: 599, image: "/placeholder.svg?height=200&width=300&text=Maldives" },
      { name: "Bali, Indonesia", price: 180, image: "/placeholder.svg?height=200&width=300&text=Bali" },
    ],
    tips: [
      "Book honeymoon packages for special perks",
      "Consider overwater bungalows",
      "Look for adults-only resorts",
      "Plan romantic dining experiences",
    ],
    bestTime: "Shoulder seasons for fewer crowds",
    averageStay: "4-6 nights",
    budgetRange: "$200-800 per night",
  },
  adventure: {
    name: "Adventure Travel",
    description: "Fuel your wanderlust with thrilling experiences and outdoor adventures.",
    icon: Mountain,
    color: "bg-orange-600",
    heroImage: "/placeholder.svg?height=500&width=1200&text=Adventure+Resort",
    features: [
      "Outdoor activity centers",
      "Guided adventure tours",
      "Equipment rental services",
      "Expert local guides",
      "Eco-friendly accommodations",
      "Flexible booking for weather",
    ],
    popularDestinations: [
      { name: "Queenstown, New Zealand", price: 280, image: "/placeholder.svg?height=200&width=300&text=Queenstown" },
      { name: "Costa Rica", price: 165, image: "/placeholder.svg?height=200&width=300&text=Costa+Rica" },
      { name: "Swiss Alps", price: 320, image: "/placeholder.svg?height=200&width=300&text=Swiss+Alps" },
    ],
    tips: [
      "Pack appropriate gear",
      "Check weather conditions",
      "Book activities in advance",
      "Consider travel insurance",
    ],
    bestTime: "Depends on activity and destination",
    averageStay: "3-5 nights",
    budgetRange: "$120-350 per night",
  },
  business: {
    name: "Business Travel",
    description: "Professional accommodations with all the amenities needed for successful business trips.",
    icon: Briefcase,
    color: "bg-blue-600",
    heroImage: "/placeholder.svg?height=500&width=1200&text=Business+Hotel",
    features: [
      "High-speed WiFi and business centers",
      "Meeting rooms and conference facilities",
      "Express check-in/out services",
      "24/7 room service",
      "Airport shuttle services",
      "Loyalty program benefits",
    ],
    popularDestinations: [
      { name: "Singapore", price: 245, image: "/placeholder.svg?height=200&width=300&text=Singapore" },
      { name: "Tokyo, Japan", price: 189, image: "/placeholder.svg?height=200&width=300&text=Tokyo" },
      { name: "London, UK", price: 280, image: "/placeholder.svg?height=200&width=300&text=London" },
    ],
    tips: [
      "Join hotel loyalty programs",
      "Book flexible rates",
      "Choose hotels near business districts",
      "Utilize mobile check-in",
    ],
    bestTime: "Year-round based on business needs",
    averageStay: "2-4 nights",
    budgetRange: "$150-500 per night",
  },
  luxury: {
    name: "Luxury Escapes",
    description: "Indulge in the finest accommodations with world-class service and premium amenities.",
    icon: Wine,
    color: "bg-purple-600",
    heroImage: "/placeholder.svg?height=500&width=1200&text=Luxury+Resort",
    features: [
      "5-star accommodations and service",
      "Private butler and concierge",
      "Michelin-starred dining",
      "Exclusive spa and wellness",
      "Private beaches and pools",
      "Helicopter and yacht transfers",
    ],
    popularDestinations: [
      { name: "Dubai, UAE", price: 450, image: "/placeholder.svg?height=200&width=300&text=Dubai" },
      { name: "French Riviera", price: 650, image: "/placeholder.svg?height=200&width=300&text=French+Riviera" },
      { name: "Aspen, Colorado", price: 580, image: "/placeholder.svg?height=200&width=300&text=Aspen" },
    ],
    tips: [
      "Book well in advance",
      "Consider package deals",
      "Ask about complimentary upgrades",
      "Utilize concierge services",
    ],
    bestTime: "Peak seasons for best experience",
    averageStay: "4-7 nights",
    budgetRange: "$400-2000+ per night",
  },
  backpacker: {
    name: "Budget Travel",
    description: "Affordable accommodations perfect for budget-conscious travelers and backpackers.",
    icon: Backpack,
    color: "bg-teal-600",
    heroImage: "/placeholder.svg?height=500&width=1200&text=Hostel",
    features: [
      "Shared and private room options",
      "Common areas and kitchens",
      "Social atmosphere",
      "Local travel information",
      "Luggage storage",
      "Free WiFi and basic amenities",
    ],
    popularDestinations: [
      { name: "Bangkok, Thailand", price: 25, image: "/placeholder.svg?height=200&width=300&text=Bangkok" },
      { name: "Prague, Czech Republic", price: 35, image: "/placeholder.svg?height=200&width=300&text=Prague" },
      { name: "Lisbon, Portugal", price: 40, image: "/placeholder.svg?height=200&width=300&text=Lisbon" },
    ],
    tips: [
      "Book hostels with good reviews",
      "Bring a padlock for lockers",
      "Respect shared spaces",
      "Join hostel activities",
    ],
    bestTime: "Off-peak seasons for best rates",
    averageStay: "2-4 nights",
    budgetRange: "$15-80 per night",
  },
}

export default function TripTypePage({ params }: { params: { type: string } }) {
  const tripType = tripTypeData[params.type]

  if (!tripType) {
    return <div>Trip type not found</div>
  }

  const IconComponent = tripType.icon

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
                  <BreadcrumbLink href="/hotels#trip-types">Trip Types</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{tripType.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative h-96 md:h-[500px] overflow-hidden">
          <Image src={tripType.heroImage || "/placeholder.svg"} alt={tripType.name} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />

          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-2xl">
                <div
                  className={`inline-flex items-center space-x-2 ${tripType.color} text-white px-4 py-2 rounded-full mb-4`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="font-medium">Trip Type</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{tripType.name}</h1>
                <p className="text-xl text-white/90 mb-8 leading-relaxed">{tripType.description}</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href={`/search?tripType=${params.type}`}>
                    <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                      <Plane className="w-5 h-5 mr-2" />
                      Find Hotels
                    </Button>
                  </Link>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-gray-900 bg-transparent"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    View Gallery
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Features */}
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6">What to Expect</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tripType.features.map((feature: string, index: number) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className={`w-2 h-2 ${tripType.color} rounded-full mt-2 flex-shrink-0`} />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Popular Destinations */}
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6">Popular Destinations</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {tripType.popularDestinations.map((destination: any, index: number) => (
                      <div key={index} className="group cursor-pointer">
                        <div className="relative h-48 rounded-lg overflow-hidden mb-3">
                          <Image
                            src={destination.image || "/placeholder.svg"}
                            alt={destination.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                          <div className="absolute bottom-3 left-3 right-3">
                            <h3 className="text-white font-semibold">{destination.name}</h3>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">From</span>
                          <span className="text-xl font-bold text-blue-600">${destination.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Travel Tips */}
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6">Travel Tips</h2>
                  <div className="space-y-4">
                    {tripType.tips.map((tip: string, index: number) => (
                      <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                        <div
                          className={`w-6 h-6 ${tripType.color} rounded-full flex items-center justify-center flex-shrink-0`}
                        >
                          <span className="text-white text-sm font-bold">{index + 1}</span>
                        </div>
                        <span className="text-gray-700">{tip}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Quick Info */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Quick Info</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Best Time</span>
                      <span className="font-medium">{tripType.bestTime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Average Stay</span>
                      <span className="font-medium">{tripType.averageStay}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Budget Range</span>
                      <span className="font-medium">{tripType.budgetRange}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* CTA Card */}
              <Card className={`${tripType.color} text-white`}>
                <CardContent className="p-6 text-center">
                  <IconComponent className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Ready to Book?</h3>
                  <p className="text-white/90 mb-4">
                    Find the perfect accommodation for your {tripType.name.toLowerCase()}
                  </p>
                  <Link href={`/search?tripType=${params.type}`}>
                    <Button className="w-full bg-white text-gray-900 hover:bg-gray-100">Search Hotels</Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Contact Support */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Need Help Planning?</h3>
                  <p className="text-gray-600 mb-4">Our travel experts are here to help you plan the perfect trip.</p>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Coffee className="w-4 h-4 mr-2" />
                    Chat with Expert
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
