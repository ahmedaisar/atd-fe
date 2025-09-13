"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Star, 
  ThumbsUp, 
  User, 
  Camera, 
  Shield,
  TrendingUp,
  Filter,
  Calendar,
  Users,
  Bed,
  MapPin,
  Coffee,
  Sparkles,
  CheckCircle,
  Heart,
  MessageCircle,
  Briefcase
} from "lucide-react"
import Image from "next/image"

interface Review {
  id: string
  author: string
  country: string
  avatar?: string
  rating: number
  date: string
  title: string
  content: string
  helpful: number
  roomType: string
  stayDuration: string
  travellerType: 'business' | 'family' | 'couple' | 'solo' | 'friends'
  verified: boolean
  photos?: string[]
  categoryRatings: {
    cleanliness: number
    service: number
    location: number
    facilities: number
    value: number
    comfort: number
  }
  pros: string[]
  cons: string[]
}

const reviewStats = {
  overall: 4.8,
  totalReviews: 2847,
  breakdown: {
    5: 1823,
    4: 712,
    3: 234,
    2: 56,
    1: 22,
  },
  categories: {
    cleanliness: 4.9,
    service: 4.8,
    location: 4.7,
    facilities: 4.6,
    value: 4.6,
    comfort: 4.8,
  },
  travellerTypes: {
    couple: 45,
    family: 28,
    business: 18,
    friends: 6,
    solo: 3
  },
  monthlyTrend: [
    { month: 'Jan', rating: 4.7 },
    { month: 'Feb', rating: 4.8 },
    { month: 'Mar', rating: 4.9 },
    { month: 'Apr', rating: 4.8 },
    { month: 'May', rating: 4.8 },
    { month: 'Jun', rating: 4.7 }
  ]
}

const reviews: Review[] = [
  {
    id: "rev-1",
    author: "Sarah Mitchell",
    country: "United States",
    avatar: "/placeholder-user.jpg",
    rating: 5,
    date: "2024-01-15",
    title: "Exceptional luxury experience - exceeded all expectations!",
    content: "The Sukhothai Bangkok exceeded all expectations. From the moment we arrived, the service was impeccable. Our room was spacious and beautifully appointed with traditional Thai touches. The staff went above and beyond to make our stay memorable. The spa was absolutely divine and the breakfast buffet had incredible variety. The location is perfect for exploring the city.",
    helpful: 23,
    roomType: "Premier Room",
    stayDuration: "3 nights",
    travellerType: "couple",
    verified: true,
    photos: ["/placeholder.jpg", "/placeholder.jpg"],
    categoryRatings: {
      cleanliness: 5,
      service: 5,
      location: 5,
      facilities: 5,
      value: 4,
      comfort: 5
    },
    pros: ["Exceptional service", "Beautiful rooms", "Great location", "Amazing spa"],
    cons: ["Slightly expensive"]
  },
  {
    id: "rev-2",
    author: "James Rodriguez",
    country: "United Kingdom",
    rating: 5,
    date: "2024-01-10",
    title: "Perfect for business travelers",
    content: "Stayed here for a business trip and couldn't be happier. The business center facilities are top-notch, WiFi is excellent throughout the property, and the concierge service helped arrange all my meetings efficiently. The executive lounge breakfast was perfect for early morning meetings.",
    helpful: 18,
    roomType: "Executive Suite",
    stayDuration: "2 nights", 
    travellerType: "business",
    verified: true,
    categoryRatings: {
      cleanliness: 5,
      service: 5,
      location: 5,
      facilities: 5,
      value: 5,
      comfort: 4
    },
    pros: ["Excellent business facilities", "Fast WiFi", "Professional service", "Great location"],
    cons: []
  },
  {
    id: "rev-3",
    author: "Maria Garcia",
    country: "Germany",
    rating: 4,
    date: "2024-01-08",
    title: "Wonderful family vacation with minor issues",
    content: "Overall a wonderful stay with our two children. The pool area is beautiful and the kids loved it. The breakfast buffet has great variety and accommodates different dietary needs. The family room was spacious. Only minor complaint is that the air conditioning was a bit noisy at night, but didn't significantly impact our sleep.",
    helpful: 12,
    roomType: "Family Suite",
    stayDuration: "4 nights",
    travellerType: "family",
    verified: true,
    photos: ["/placeholder.jpg"],
    categoryRatings: {
      cleanliness: 4,
      service: 4,
      location: 4,
      facilities: 5,
      value: 4,
      comfort: 3
    },
    pros: ["Great for families", "Beautiful pool", "Good breakfast", "Spacious rooms"],
    cons: ["AC was noisy", "Could be more child-friendly amenities"]
  },
  {
    id: "rev-4",
    author: "Chen Wei",
    country: "Singapore",
    rating: 5,
    date: "2024-01-05",
    title: "Authentic Thai luxury at its finest",
    content: "This hotel perfectly captures the essence of Thai hospitality. The traditional architecture combined with modern amenities creates a unique atmosphere. The Thai restaurant on-site serves some of the best pad thai I've ever had. Staff are incredibly welcoming and knowledgeable about local attractions.",
    helpful: 31,
    roomType: "Deluxe Room",
    stayDuration: "5 nights",
    travellerType: "couple",
    verified: true,
    photos: ["/placeholder.jpg", "/placeholder.jpg", "/placeholder.jpg"],
    categoryRatings: {
      cleanliness: 5,
      service: 5,
      location: 4,
      facilities: 4,
      value: 5,
      comfort: 5
    },
    pros: ["Authentic Thai experience", "Excellent food", "Welcoming staff", "Beautiful architecture"],
    cons: []
  }
]

const travellerTypeLabels = {
  couple: 'Couple',
  family: 'Family',
  business: 'Business',
  friends: 'Friends',
  solo: 'Solo'
}

const travellerTypeIcons = {
  couple: Heart,
  family: Users,
  business: Briefcase,
  friends: Users,
  solo: User
}

export function HotelReviews() {
  const [activeTab, setActiveTab] = useState("all")
  const [sortBy, setSortBy] = useState("recent")
  const [filterRating, setFilterRating] = useState("all")
  const [showAllReviews, setShowAllReviews] = useState(false)
  const [likedReviews, setLikedReviews] = useState<Set<string>>(new Set())

  const handleLikeReview = (reviewId: string) => {
    setLikedReviews(prev => {
      const newSet = new Set(prev)
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId)
      } else {
        newSet.add(reviewId)
      }
      return newSet
    })
  }

  const filteredReviews = reviews.filter(review => {
    if (filterRating !== "all" && review.rating !== parseInt(filterRating)) {
      return false
    }
    return true
  })

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case "helpful":
        return b.helpful - a.helpful
      case "rating-high":
        return b.rating - a.rating
      case "rating-low":
        return a.rating - b.rating
      case "recent":
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime()
    }
  })

  const visibleReviews = showAllReviews ? sortedReviews : sortedReviews.slice(0, 3)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Guest Reviews</h2>
        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
          <Star className="w-3 h-3 mr-1 fill-current" />
          {reviewStats.overall} ({reviewStats.totalReviews} reviews)
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Reviews</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="photos">With Photos</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Overall Rating */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span>Overall Rating</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="text-5xl font-bold text-blue-600 mb-2">{reviewStats.overall}</div>
                  <div className="flex justify-center mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-6 h-6 ${
                          i < Math.floor(reviewStats.overall) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-gray-600 text-lg">Based on {reviewStats.totalReviews} reviews</div>
                </div>

                {/* Rating Breakdown */}
                <div className="space-y-3">
                  {Object.entries(reviewStats.breakdown)
                    .reverse()
                    .map(([rating, count]) => (
                      <div key={rating} className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1 w-12">
                          <span className="text-sm">{rating}</span>
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        </div>
                        <Progress value={(count / reviewStats.totalReviews) * 100} className="flex-1 h-3" />
                        <span className="text-sm text-gray-600 w-16 text-right">{count}</span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Category Ratings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <span>Category Breakdown</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(reviewStats.categories).map(([category, rating]) => (
                    <div key={category} className="flex items-center justify-between">
                      <span className="capitalize font-medium text-gray-700">{category}</span>
                      <div className="flex items-center space-x-3">
                        <Progress value={(rating / 5) * 100} className="w-20 h-2" />
                        <span className="font-semibold text-blue-600 w-8">{rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Traveller Types */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-purple-500" />
                  <span>Traveller Types</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(reviewStats.travellerTypes).map(([type, percentage]) => {
                    const Icon = travellerTypeIcons[type as keyof typeof travellerTypeIcons]
                    return (
                      <div key={type} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Icon className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-700">{travellerTypeLabels[type as keyof typeof travellerTypeLabels]}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Progress value={percentage} className="w-20 h-2" />
                          <span className="text-sm text-gray-600 w-8">{percentage}%</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Monthly Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <span>Rating Trend</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reviewStats.monthlyTrend.map((month) => (
                    <div key={month.month} className="flex items-center justify-between">
                      <span className="text-gray-700">{month.month} 2024</span>
                      <div className="flex items-center space-x-3">
                        <Progress value={(month.rating / 5) * 100} className="w-20 h-2" />
                        <span className="font-semibold text-blue-600 w-8">{month.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="photos" className="mt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {reviews
              .filter(review => review.photos && review.photos.length > 0)
              .flatMap(review => 
                review.photos!.map((photo, index) => (
                  <div key={`${review.id}-${index}`} className="relative group cursor-pointer">
                    <Image
                      src={photo}
                      alt={`Photo by ${review.author}`}
                      width={200}
                      height={150}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all rounded-lg" />
                    <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                      by {review.author}
                    </div>
                  </div>
                ))
              )}
          </div>
        </TabsContent>

        <TabsContent value="all" className="mt-6">
          {/* Filters and Sorting */}
          <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium">Filter & Sort:</span>
            </div>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="helpful">Most Helpful</SelectItem>
                <SelectItem value="rating-high">Highest Rating</SelectItem>
                <SelectItem value="rating-low">Lowest Rating</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterRating} onValueChange={setFilterRating}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>

            <Badge variant="outline" className="ml-auto">
              {visibleReviews.length} of {reviewStats.totalReviews} reviews
            </Badge>
          </div>

          {/* Individual Reviews */}
          <div className="space-y-6">
            {visibleReviews.map((review) => {
              const TravellerIcon = travellerTypeIcons[review.travellerType]
              const isLiked = likedReviews.has(review.id)
              
              return (
                <Card key={review.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    {/* Review Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                            {review.avatar ? (
                              <Image src={review.avatar} alt={review.author} width={48} height={48} className="w-full h-full object-cover" />
                            ) : (
                              <User className="w-6 h-6 text-blue-600" />
                            )}
                          </div>
                          {review.verified && (
                            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                              <CheckCircle className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold">{review.author}</span>
                            {review.verified && (
                              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                                <Shield className="w-3 h-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <MapPin className="w-3 h-3" />
                            <span>{review.country}</span>
                            <span>•</span>
                            <TravellerIcon className="w-3 h-3" />
                            <span>{travellerTypeLabels[review.travellerType]}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center space-x-1 mb-1">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                          <span className="ml-2 font-semibold text-blue-600">{review.rating}</span>
                        </div>
                        <div className="text-sm text-gray-500">{review.date}</div>
                      </div>
                    </div>

                    {/* Review Title */}
                    <h4 className="font-semibold text-lg mb-3">{review.title}</h4>

                    {/* Review Content */}
                    <p className="text-gray-700 mb-4 leading-relaxed">{review.content}</p>

                    {/* Pros and Cons */}
                    {(review.pros.length > 0 || review.cons.length > 0) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {review.pros.length > 0 && (
                          <div>
                            <h5 className="font-medium text-green-700 mb-2 flex items-center">
                              <Sparkles className="w-4 h-4 mr-1" />
                              Loved
                            </h5>
                            <ul className="space-y-1">
                              {review.pros.map((pro, index) => (
                                <li key={index} className="text-sm text-gray-600 flex items-center">
                                  <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                                  {pro}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {review.cons.length > 0 && (
                          <div>
                            <h5 className="font-medium text-orange-700 mb-2 flex items-center">
                              <MessageCircle className="w-4 h-4 mr-1" />
                              Could improve
                            </h5>
                            <ul className="space-y-1">
                              {review.cons.map((con, index) => (
                                <li key={index} className="text-sm text-gray-600 flex items-center">
                                  <span className="w-3 h-3 bg-orange-200 rounded-full mr-2 flex-shrink-0" />
                                  {con}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Review Photos */}
                    {review.photos && review.photos.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center space-x-2 mb-3">
                          <Camera className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700">Photos from this stay</span>
                        </div>
                        <div className="flex space-x-2 overflow-x-auto">
                          {review.photos.map((photo, index) => (
                            <Image
                              key={index}
                              src={photo}
                              alt={`Photo ${index + 1} by ${review.author}`}
                              width={100}
                              height={75}
                              className="w-24 h-18 object-cover rounded-lg flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Review Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Bed className="w-4 h-4" />
                          <span>{review.roomType}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{review.stayDuration}</span>
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLikeReview(review.id)}
                        className={`flex items-center space-x-1 ${isLiked ? 'text-blue-600' : 'text-gray-500'}`}
                      >
                        <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                        <span>Helpful ({review.helpful + (isLiked ? 1 : 0)})</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            {!showAllReviews && sortedReviews.length > 3 && (
              <div className="text-center">
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => setShowAllReviews(true)} 
                  className="bg-white hover:bg-gray-50"
                >
                  Show All {reviewStats.totalReviews} Reviews
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
