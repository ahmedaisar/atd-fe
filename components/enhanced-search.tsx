"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DayPicker } from "react-day-picker"
import { MapPin, Users, Search, Clock, TrendingUp, Star, Plane, Building, Car, CalendarIcon } from "lucide-react"
import { format, addDays } from "date-fns"
import { useDebounce } from "@/hooks/use-debounce"

interface SearchData {
  destination: string
  destinationId?: string | null
  checkIn?: Date
  checkOut?: Date
  guests: {
    adults: number
    children: number
    rooms: number
    childrenAges: number[]
  }
}

interface RecentSearch {
  id: string
  destination: string
  checkIn: Date
  checkOut: Date
  guests: { adults: number; children: number; rooms: number; childrenAges?: number[] }
  timestamp: Date
}

interface PopularDestination {
  name: string
  country: string
  image: string
  deals: number
  rating: number
  priceFrom: number
}

export function EnhancedSearch() {
  const router = useRouter()
  const [searchData, setSearchData] = useState<SearchData>({
    destination: "",
    destinationId: null,
    checkIn: undefined,
    checkOut: undefined,
    guests: { adults: 2, children: 0, rooms: 1, childrenAges: [] },
  })

  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([])
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false)
  const [showGuestSelector, setShowGuestSelector] = useState(false)
  const [destinationInput, setDestinationInput] = useState("")
  const debouncedQuery = useDebounce(destinationInput, 250)
  const [apiSuggestions, setApiSuggestions] = useState<Array<{ id: string; name: string; country: string }>>([])
  const [highlightIndex, setHighlightIndex] = useState<number>(-1)

  // Popular destinations data
  const popularDestinations: PopularDestination[] = [
    {
      name: "Bangkok",
      country: "Thailand",
      image: "/placeholder.svg?height=60&width=60&text=Bangkok",
      deals: 1247,
      rating: 4.5,
      priceFrom: 25,
    },
    {
      name: "Malé",
      country: "Maldives", 
      image: "/placeholder.svg?height=60&width=60&text=Male",
      deals: 892,
      rating: 4.7,
      priceFrom: 85,
    },
    {
      name: "Thailand",
      country: "Thailand",
      image: "/placeholder.svg?height=60&width=60&text=Thailand",
      deals: 654,
      rating: 4.6,
      priceFrom: 95,
    },
    {
      name: "Maldives",
      country: "Maldives",
      image: "/placeholder.svg?height=60&width=60&text=Maldives",
      deals: 1156,
      rating: 4.4,
      priceFrom: 35,
    },
  ]

  // Destination suggestions based on input
  const getDestinationSuggestions = (input: string) => {
    if (!input && apiSuggestions.length === 0) return popularDestinations
    return apiSuggestions.map((s) => ({
      id: s.id,
      name: s.name,
      country: s.country,
      image: "/placeholder.svg?height=60&width=60&text=" + encodeURIComponent(s.name),
      deals: Math.floor(Math.random() * 1000) + 100,
      rating: 4 + Math.random(),
      priceFrom: Math.floor(Math.random() * 150) + 20,
    }))
  }

  useEffect(() => {
    let ignore = false
    const fetchSuggestions = async () => {
      if (!debouncedQuery) {
        setApiSuggestions([])
        return
      }
      try {
        const res = await fetch(`/api/search/destinations?q=${encodeURIComponent(debouncedQuery)}`)
        if (!res.ok) return
        const data = await res.json()
        if (!ignore) setApiSuggestions(data)
      } catch {}
    }
    fetchSuggestions()
    return () => {
      ignore = true
    }
  }, [debouncedQuery])

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches")
    if (saved) {
      const parsed = JSON.parse(saved).map((search: any) => ({
        ...search,
        checkIn: new Date(search.checkIn),
        checkOut: new Date(search.checkOut),
        timestamp: new Date(search.timestamp),
      }))
      setRecentSearches(parsed)
    }
  }, [])

  // Save recent search
  const saveRecentSearch = () => {
    if (!searchData.destination || !searchData.checkIn || !searchData.checkOut) return

    const newSearch: RecentSearch = {
      id: Date.now().toString(),
      destination: searchData.destination,
      checkIn: searchData.checkIn,
      checkOut: searchData.checkOut,
      guests: searchData.guests,
      timestamp: new Date(),
    }

    const updated = [newSearch, ...recentSearches.filter((s) => s.destination !== searchData.destination)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem("recentSearches", JSON.stringify(updated))
  }

  // Handle search
  const handleSearch = () => {
    if (!searchData.destination || !searchData.checkIn || !searchData.checkOut) {
      alert("Please fill in all required fields")
      return
    }

    saveRecentSearch()

    // Construct search URL with parameters
    const params = new URLSearchParams({
      destination: searchData.destination,
      checkIn: format(searchData.checkIn, "yyyy-MM-dd"),
      checkOut: format(searchData.checkOut, "yyyy-MM-dd"),
      adults: searchData.guests.adults.toString(),
      children: searchData.guests.children.toString(),
      rooms: searchData.guests.rooms.toString(),
    })
    if (searchData.destinationId) params.set("destinationId", searchData.destinationId)
    if (searchData.guests.children > 0 && searchData.guests.childrenAges.length) {
      params.set("childrenAges", searchData.guests.childrenAges.join(","))
    }

    router.push(`/search?${params.toString()}`)
  }

  // Handle destination selection
  const handleDestinationSelect = (destination: PopularDestination & { id?: string }) => {
    setSearchData({
      ...searchData,
      destination: `${destination.name}, ${destination.country}`,
      destinationId: (destination as any).id || null,
    })
    setDestinationInput(`${destination.name}, ${destination.country}`)
    setShowDestinationSuggestions(false)
  }

  // Handle recent search selection
  const handleRecentSearchSelect = (search: RecentSearch) => {
    setSearchData({
      destination: search.destination,
      checkIn: search.checkIn,
      checkOut: search.checkOut,
      guests: { ...search.guests, childrenAges: Array.from({ length: search.guests.children }).map(() => 8) },
    })
    setDestinationInput(search.destination)
  }

  // Guest selector component
  const GuestSelector = () => (
    <div className="p-4 space-y-4 w-80">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">Adults</p>
          <p className="text-sm text-gray-500">Ages 13 or above</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setSearchData({
                ...searchData,
                guests: { ...searchData.guests, adults: Math.max(1, searchData.guests.adults - 1) },
              })
            }
            disabled={searchData.guests.adults <= 1}
          >
            -
          </Button>
          <span className="w-8 text-center">{searchData.guests.adults}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setSearchData({
                ...searchData,
                guests: { ...searchData.guests, adults: Math.min(16, searchData.guests.adults + 1) },
              })
            }
          >
            +
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">Children</p>
          <p className="text-sm text-gray-500">Ages 0-12</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setSearchData({
                ...searchData,
                guests: {
                  ...searchData.guests,
                  children: Math.max(0, searchData.guests.children - 1),
                  childrenAges: searchData.guests.childrenAges.slice(0, Math.max(0, searchData.guests.children - 1)),
                },
              })
            }
            disabled={searchData.guests.children <= 0}
          >
            -
          </Button>
          <span className="w-8 text-center">{searchData.guests.children}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setSearchData({
                ...searchData,
                guests: {
                  ...searchData.guests,
                  children: Math.min(8 * searchData.guests.rooms * 2, searchData.guests.children + 1),
                  childrenAges: [...searchData.guests.childrenAges, 8],
                },
              })
            }
          >
            +
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">Rooms</p>
          <p className="text-sm text-gray-500">Number of rooms</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setSearchData({
                ...searchData,
                guests: { ...searchData.guests, rooms: Math.max(1, searchData.guests.rooms - 1) },
              })
            }
            disabled={searchData.guests.rooms <= 1}
          >
            -
          </Button>
          <span className="w-8 text-center">{searchData.guests.rooms}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setSearchData({
                ...searchData,
                guests: { ...searchData.guests, rooms: Math.min(8, searchData.guests.rooms + 1) },
              })
            }
          >
            +
          </Button>
        </div>
      </div>
      {searchData.guests.children > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Children ages</p>
          {Array.from({ length: searchData.guests.children }).map((_, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <span className="text-sm">Child {idx + 1}</span>
              <select
                className="border rounded px-2 py-1 text-sm"
                value={searchData.guests.childrenAges[idx] ?? 8}
                onChange={(e) => {
                  const val = Number(e.target.value)
                  const ages = [...searchData.guests.childrenAges]
                  ages[idx] = val
                  setSearchData({ ...searchData, guests: { ...searchData.guests, childrenAges: ages } })
                }}
              >
                {Array.from({ length: 18 }).map((_, age) => (
                  <option key={age} value={age}>
                    {age}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <Card className="w-full max-w-6xl mx-auto shadow-lg">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Destination */}
          <div className="relative">
            <Label htmlFor="destination" className="text-sm font-medium text-gray-700 mb-2 block">
              Where are you going?
            </Label>
            <Popover open={showDestinationSuggestions} onOpenChange={setShowDestinationSuggestions}>
              <PopoverTrigger asChild>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="destination"
                    placeholder="City, hotel, landmark..."
                    value={destinationInput}
                    onChange={(e) => {
                      setDestinationInput(e.target.value)
                      setSearchData({ ...searchData, destination: e.target.value })
                      setShowDestinationSuggestions(true)
                    }}
                    onKeyDown={(e) => {
                      const list = getDestinationSuggestions(destinationInput)
                      if (e.key === "ArrowDown") {
                        e.preventDefault()
                        setHighlightIndex((i) => Math.min(i + 1, list.length - 1))
                      } else if (e.key === "ArrowUp") {
                        e.preventDefault()
                        setHighlightIndex((i) => Math.max(i - 1, 0))
                      } else if (e.key === "Enter" && highlightIndex >= 0) {
                        e.preventDefault()
                        const sel = list[highlightIndex]
                        if (sel) handleDestinationSelect(sel as any)
                      }
                    }}
                    className="pl-10 h-12"
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-96 p-0" align="start">
                <div className="max-h-96 overflow-y-auto">
                  {/* Recent Searches */}
                  {recentSearches.length > 0 && (
                    <div className="p-4 border-b">
                      <div className="flex items-center space-x-2 mb-3">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Recent Searches</span>
                      </div>
                      <div className="space-y-2">
                        {recentSearches.slice(0, 3).map((search) => (
                          <button
                            key={search.id}
                            onClick={() => handleRecentSearchSelect(search)}
                            className="w-full text-left p-2 hover:bg-gray-50 rounded-md transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{search.destination}</span>
                              <span className="text-xs text-gray-500">
                                {format(search.checkIn, "MMM dd")} - {format(search.checkOut, "MMM dd")}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Popular Destinations */}
                  <div className="p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <TrendingUp className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Popular Destinations</span>
                    </div>
                    <div className="space-y-2">
                      {getDestinationSuggestions(destinationInput).map((destination, idx) => (
                        <button
                          key={destination.name}
                          onClick={() => handleDestinationSelect(destination)}
                          className={`w-full text-left p-3 rounded-md transition-colors ${
                            highlightIndex === idx ? "bg-gray-100" : "hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <img
                              src={destination.image || "/placeholder.svg"}
                              alt={destination.name}
                              className="w-12 h-12 rounded-md object-cover"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">{destination.name}</span>
                                <div className="flex items-center space-x-1">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  <span className="text-xs">{destination.rating}</span>
                                </div>
                              </div>
                              <p className="text-sm text-gray-500">{destination.country}</p>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-xs text-gray-500">{destination.deals} properties</span>
                                <span className="text-xs font-medium">From ${destination.priceFrom}</span>
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Check-in Date */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">Check-in</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full h-12 justify-start text-left font-normal bg-transparent"
                >
                  <CalendarIcon className="m-1 h-2 w-2" />
                  {searchData.checkIn ? format(searchData.checkIn, "MMM dd, yyyy") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-3" align="start">
                <DayPicker
                  mode="single"
                  selected={searchData.checkIn}
                  onSelect={(date) => {
                    setSearchData((prev) => {
                      const next = { ...prev, checkIn: date }
                      // if (date && (!prev.checkOut || date >= prev.checkOut)) {
                      //   next.checkOut = addDays(date, 1)
                      // }
                      return next
                    })
                  }}
                  disabled={{ before: new Date() }}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Check-out Date */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">Check-out</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full h-12 justify-start text-left font-normal bg-transparent"
                  disabled={!searchData.checkIn}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {searchData.checkOut ? format(searchData.checkOut, "MMM dd, yyyy") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white shadow-lg border rounded-lg" align="start">
                <DayPicker
                  mode="single"
                  selected={searchData.checkOut}
                  onSelect={(date) => setSearchData({ ...searchData, checkOut: date })}
                  disabled={searchData.checkIn ? { before: addDays(searchData.checkIn, 1) } : { before: new Date() }}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Guests */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">Guests & Rooms</Label>
            <Popover open={showGuestSelector} onOpenChange={setShowGuestSelector}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full h-12 justify-start text-left font-normal bg-transparent">
                  <Users className="mr-2 h-4 w-4" />
                  {searchData.guests.adults + searchData.guests.children} guests, {searchData.guests.rooms} room
                  {searchData.guests.rooms > 1 ? "s" : ""}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <GuestSelector />
              </PopoverContent>
            </Popover>
          </div>

          {/* Search Button - Desktop inline, Mobile below */}
          <div className="flex items-end">
            <Button onClick={handleSearch} size="lg" className="w-full h-12 bg-blue-600 hover:bg-blue-700">
              <Search className="mr-2 h-5 w-5" />
              SEARCH
            </Button>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="mt-6 flex flex-wrap gap-2 justify-center">
          <Badge variant="outline" className="cursor-pointer hover:bg-gray-50">
            <Building className="w-3 h-3 mr-1" />
            Hotels
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-gray-50">
            <Plane className="w-3 h-3 mr-1" />
            Flights + Hotels
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-gray-50">
            <Car className="w-3 h-3 mr-1" />
            Car Rentals
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
