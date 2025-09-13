import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MobileNavigation } from "@/components/mobile-navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MapPin,
  Star,
  Thermometer,
  Plane,
  Camera,
  Waves,
  Fish,
  Compass,
  Users,
  Calendar,
  Globe,
  Heart,
} from "lucide-react"
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

const atollData: { [key: string]: any } = {
  "north-male": {
    name: "North Malé Atoll",
    country: "Maldives",
    description:
      "The most accessible and developed atoll in the Maldives, home to the capital city and international airport. Perfect blend of luxury resorts and cultural experiences.",
    heroImage: "/placeholder.svg?height=500&width=1200&text=North+Male+Atoll",
    coordinates: { lat: 4.1755, lng: 73.5093 },
    climate: {
      temperature: "26-30°C year-round",
      rainfall: "Dry season: Dec-Apr, Wet season: May-Nov",
      humidity: "75-85%",
      bestTime: "December to April",
    },
    geography: {
      islands: 50,
      resortIslands: 8,
      localIslands: 10,
      area: "1,565 km²",
      population: "150,000+",
    },
    highlights: [
      "Close proximity to Velana International Airport",
      "Home to Malé, the capital city",
      "Excellent diving and snorkeling sites",
      "Luxury overwater villa resorts",
      "Rich marine biodiversity",
      "Cultural attractions and local islands",
    ],
    divingSites: [
      {
        name: "Manta Point",
        depth: "5-30m",
        difficulty: "Beginner to Advanced",
        highlights: ["Manta rays", "Whale sharks", "Coral gardens"],
      },
      {
        name: "Banana Reef",
        depth: "5-30m",
        difficulty: "Beginner to Intermediate",
        highlights: ["Colorful corals", "Tropical fish", "Caves and overhangs"],
      },
      {
        name: "HP Reef",
        depth: "8-30m",
        difficulty: "Intermediate",
        highlights: ["Grey reef sharks", "Napoleon wrasse", "Barracuda schools"],
      },
    ],
    resorts: [
      {
        name: "Paradise Island Resort & Spa",
        rating: 4.5,
        price: 450,
        image: "/placeholder.svg?height=200&width=300&text=Paradise+Resort",
        features: ["Overwater Villas", "Spa", "Multiple Restaurants", "Diving Center"],
      },
      {
        name: "Kurumba Maldives",
        rating: 4.3,
        price: 380,
        image: "/placeholder.svg?height=200&width=300&text=Kurumba+Resort",
        features: ["Beach Villas", "Water Sports", "Kids Club", "Cultural Activities"],
      },
      {
        name: "Bandos Island Resort",
        rating: 4.2,
        price: 320,
        image: "/placeholder.svg?height=200&width=300&text=Bandos+Resort",
        features: ["Beach Access", "Diving", "Restaurants", "Spa Services"],
      },
    ],
    transportation: {
      airport: "Velana International Airport (MLE)",
      transfer: "Speedboat (15-45 minutes) or Seaplane (15-20 minutes)",
      localTransport: "Dhoni boats between islands",
    },
    localInfo: {
      currency: "Maldivian Rufiyaa (MVR) / USD accepted",
      language: "Dhivehi (English widely spoken)",
      timezone: "Maldives Time (MVT) - UTC+5",
      voltage: "230V, Type D, G, J, K, L plugs",
    },
    activities: [
      "Snorkeling and diving",
      "Dolphin watching",
      "Sunset fishing",
      "Island hopping",
      "Cultural tours of Malé",
      "Water sports",
    ],
  },
  "south-male": {
    name: "South Malé Atoll",
    country: "Maldives",
    description:
      "A pristine atoll known for its luxury resorts and excellent diving sites. Less crowded than North Malé but equally beautiful.",
    heroImage: "/placeholder.svg?height=500&width=1200&text=South+Male+Atoll",
    coordinates: { lat: 3.85, lng: 73.53 },
    climate: {
      temperature: "26-30°C year-round",
      rainfall: "Dry season: Dec-Apr, Wet season: May-Nov",
      humidity: "75-85%",
      bestTime: "December to April",
    },
    geography: {
      islands: 30,
      resortIslands: 17,
      localIslands: 3,
      area: "1,200 km²",
      population: "8,000+",
    },
    highlights: [
      "World-class luxury resorts",
      "Pristine coral reefs",
      "Excellent diving conditions",
      "Secluded and peaceful atmosphere",
      "Award-winning spas",
      "Gourmet dining experiences",
    ],
    divingSites: [
      {
        name: "Cocoa Thila",
        depth: "12-35m",
        difficulty: "Advanced",
        highlights: ["Grey reef sharks", "Eagle rays", "Strong currents"],
      },
      {
        name: "Embudu Express",
        depth: "8-30m",
        difficulty: "Intermediate to Advanced",
        highlights: ["Drift diving", "Pelagic species", "Coral formations"],
      },
      {
        name: "Kandooma Thila",
        depth: "6-30m",
        difficulty: "Beginner to Advanced",
        highlights: ["Diverse marine life", "Cleaning stations", "Night diving"],
      },
    ],
    resorts: [
      {
        name: "OBLU SELECT at Sangeli",
        rating: 4.6,
        price: 520,
        image: "/placeholder.svg?height=200&width=300&text=OBLU+Resort",
        features: ["All-Inclusive", "Overwater Villas", "Seaplane Access", "Premium Dining"],
      },
      {
        name: "Taj Exotica Resort & Spa",
        rating: 4.7,
        price: 680,
        image: "/placeholder.svg?height=200&width=300&text=Taj+Exotica",
        features: ["Luxury Villas", "Award-winning Spa", "Fine Dining", "Butler Service"],
      },
      {
        name: "Anantara Dhigu Maldives Resort",
        rating: 4.5,
        price: 590,
        image: "/placeholder.svg?height=200&width=300&text=Anantara+Resort",
        features: ["Overwater Suites", "Spa", "Multiple Restaurants", "Kids Club"],
      },
    ],
    transportation: {
      airport: "Velana International Airport (MLE)",
      transfer: "Speedboat (30-60 minutes) or Seaplane (20-30 minutes)",
      localTransport: "Resort boats and seaplanes",
    },
    localInfo: {
      currency: "Maldivian Rufiyaa (MVR) / USD accepted",
      language: "Dhivehi (English widely spoken)",
      timezone: "Maldives Time (MVT) - UTC+5",
      voltage: "230V, Type D, G, J, K, L plugs",
    },
    activities: [
      "World-class diving",
      "Snorkeling with marine life",
      "Spa and wellness treatments",
      "Romantic dining experiences",
      "Water sports and excursions",
      "Photography tours",
    ],
  },
}

export default function AtollPage({ params }: { params: { atoll: string } }) {
  const atoll = atollData[params.atoll]

  if (!atoll) {
    return <div>Atoll not found</div>
  }

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
                  <BreadcrumbLink href="/hotels#atolls">Atolls</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{atoll.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative h-96 md:h-[500px] overflow-hidden">
          <Image src={atoll.heroImage || "/placeholder.svg"} alt={atoll.name} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />

          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-2xl">
                <Badge className="bg-teal-600 text-white mb-4">
                  <Globe className="w-4 h-4 mr-2" />
                  {atoll.country}
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{atoll.name}</h1>
                <p className="text-xl text-white/90 mb-8 leading-relaxed">{atoll.description}</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href={`/search?atoll=${params.atoll}`}>
                    <Button size="lg" className="bg-teal-600 hover:bg-teal-700">
                      <MapPin className="w-5 h-5 mr-2" />
                      Find Resorts
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
              {/* Overview */}
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6">About {atoll.name}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Total Islands</span>
                        <span className="font-semibold">{atoll.geography.islands}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Resort Islands</span>
                        <span className="font-semibold">{atoll.geography.resortIslands}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Local Islands</span>
                        <span className="font-semibold">{atoll.geography.localIslands}</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Total Area</span>
                        <span className="font-semibold">{atoll.geography.area}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Population</span>
                        <span className="font-semibold">{atoll.geography.population}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Coordinates</span>
                        <span className="font-semibold text-sm">
                          {atoll.coordinates.lat}°, {atoll.coordinates.lng}°
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">Highlights</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {atoll.highlights.map((highlight: string, index: number) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-teal-600 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-gray-700">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tabs for detailed information */}
              <Tabs defaultValue="resorts" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="resorts">Resorts</TabsTrigger>
                  <TabsTrigger value="diving">Diving</TabsTrigger>
                  <TabsTrigger value="activities">Activities</TabsTrigger>
                  <TabsTrigger value="transport">Transport</TabsTrigger>
                </TabsList>

                <TabsContent value="resorts" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Featured Resorts</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {atoll.resorts.map((resort: any, index: number) => (
                          <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="relative h-48">
                              <Image
                                src={resort.image || "/placeholder.svg"}
                                alt={resort.name}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute top-3 right-3">
                                <Badge className="bg-white/90 text-gray-900">
                                  <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                                  {resort.rating}
                                </Badge>
                              </div>
                            </div>
                            <CardContent className="p-4">
                              <h3 className="font-semibold text-lg mb-2">{resort.name}</h3>
                              <div className="flex flex-wrap gap-1 mb-3">
                                {resort.features.slice(0, 2).map((feature: string) => (
                                  <Badge key={feature} variant="outline" className="text-xs">
                                    {feature}
                                  </Badge>
                                ))}
                                {resort.features.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{resort.features.length - 2}
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="text-2xl font-bold text-teal-600">${resort.price}</span>
                                  <span className="text-gray-500 text-sm">/night</span>
                                </div>
                                <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                                  View Details
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="diving" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Fish className="w-5 h-5 text-teal-600" />
                        <span>Diving Sites</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {atoll.divingSites.map((site: any, index: number) => (
                          <Card key={index} className="border-l-4 border-l-teal-600">
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between mb-4">
                                <div>
                                  <h3 className="text-lg font-semibold">{site.name}</h3>
                                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                    <span className="flex items-center">
                                      <Compass className="w-4 h-4 mr-1" />
                                      Depth: {site.depth}
                                    </span>
                                    <span className="flex items-center">
                                      <Users className="w-4 h-4 mr-1" />
                                      {site.difficulty}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2">Highlights:</h4>
                                <div className="flex flex-wrap gap-2">
                                  {site.highlights.map((highlight: string, idx: number) => (
                                    <Badge key={idx} variant="secondary" className="text-xs">
                                      {highlight}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="activities" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Things to Do</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {atoll.activities.map((activity: string, index: number) => (
                          <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                            <Waves className="w-5 h-5 text-teal-600 flex-shrink-0" />
                            <span className="text-gray-700">{activity}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="transport" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Plane className="w-5 h-5 text-teal-600" />
                        <span>Getting There</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-semibold mb-3">Airport</h3>
                          <p className="text-gray-700">{atoll.transportation.airport}</p>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-3">Transfer Options</h3>
                          <p className="text-gray-700">{atoll.transportation.transfer}</p>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-3">Local Transport</h3>
                        <p className="text-gray-700">{atoll.transportation.localTransport}</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Climate Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Thermometer className="w-5 h-5 text-orange-500" />
                    <span>Climate</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Temperature</span>
                    <span className="font-medium">{atoll.climate.temperature}</span>
                  </div>
                  <div className="flex items-start justify-between">
                    <span className="text-gray-600">Rainfall</span>
                    <span className="font-medium text-right text-sm">{atoll.climate.rainfall}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Humidity</span>
                    <span className="font-medium">{atoll.climate.humidity}</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex items-center space-x-2 text-green-600">
                      <Calendar className="w-4 h-4" />
                      <span className="font-medium">Best Time: {atoll.climate.bestTime}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Local Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Local Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Currency</span>
                    <span className="font-medium text-right">{atoll.localInfo.currency}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Language</span>
                    <span className="font-medium text-right">{atoll.localInfo.language}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Timezone</span>
                    <span className="font-medium text-right">{atoll.localInfo.timezone}</span>
                  </div>
                  <div className="flex items-start justify-between">
                    <span className="text-gray-600">Voltage</span>
                    <span className="font-medium text-right">{atoll.localInfo.voltage}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-teal-600 text-white">
                <CardContent className="p-6 text-center">
                  <MapPin className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Explore {atoll.name}</h3>
                  <p className="text-teal-100 mb-4">Discover luxury resorts and pristine waters</p>
                  <Link href={`/search?atoll=${params.atoll}`}>
                    <Button className="w-full bg-white text-teal-600 hover:bg-gray-100 mb-3">Search Resorts</Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full border-white text-white hover:bg-white hover:text-teal-600 bg-transparent"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Save to Wishlist
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
