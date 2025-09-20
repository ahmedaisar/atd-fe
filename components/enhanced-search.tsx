"use client"

import { useState, useEffect, useMemo, useRef } from "react"
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
  id?: string
  name: string
  country: string
  image: string
  deals: number
  rating: number
  priceFrom: number
}

type Suggestion = { id: string; name: string; country: string }

export function EnhancedSearch({ suggestions }: { suggestions?: Suggestion[] }) {
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
  // Desktop suggestions (fixed positioned). For mobile we now use a separate state to avoid Popover focus issues.
  const [showDestinationSuggestionsMobile, setShowDestinationSuggestionsMobile] = useState(false)
  const [showGuestSelector, setShowGuestSelector] = useState(false) // mobile
  const [showGuestSelectorDesktop, setShowGuestSelectorDesktop] = useState(false)
  const [destinationInput, setDestinationInput] = useState("")
  const debouncedQuery = useDebounce(destinationInput, 250)
  const [apiSuggestions, setApiSuggestions] = useState<Array<{ id: string; name: string; country: string }>>([])
  const [highlightIndex, setHighlightIndex] = useState<number>(-1)
  const destinationInputRef = useRef<HTMLInputElement | null>(null)
  const whereWrapperRef = useRef<HTMLDivElement | null>(null)
  const mobileWhereRef = useRef<HTMLDivElement | null>(null)
  const [desktopSuggestPos, setDesktopSuggestPos] = useState<{ left: number; top: number; width: number } | null>(null)
  const [isDesktop, setIsDesktop] = useState(false)

  // Track desktop breakpoint to avoid rendering mobile popover portal on desktop
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const handler = () => setIsDesktop(mq.matches)
    handler()
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Close desktop suggestions on outside click
  useEffect(() => {
    function handleDocMouseDown(e: MouseEvent) {
      if (whereWrapperRef.current && !whereWrapperRef.current.contains(e.target as Node)) {
        setShowDestinationSuggestions(false)
        setHighlightIndex(-1)
      }
    }
    document.addEventListener('mousedown', handleDocMouseDown)
    return () => document.removeEventListener('mousedown', handleDocMouseDown)
  }, [])

  // Close mobile suggestions on outside click
  useEffect(() => {
    if (!showDestinationSuggestionsMobile) return
    function handleClick(e: MouseEvent) {
      if (mobileWhereRef.current && !mobileWhereRef.current.contains(e.target as Node)) {
        setShowDestinationSuggestionsMobile(false)
        setHighlightIndex(-1)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [showDestinationSuggestionsMobile])

  // Update dropdown position (desktop)
  const updateDesktopSuggestPos = () => {
    if (whereWrapperRef.current) {
      const rect = whereWrapperRef.current.getBoundingClientRect()
      setDesktopSuggestPos({ left: rect.left + window.scrollX, top: rect.bottom + window.scrollY, width: rect.width })
    }
  }

  useEffect(() => {
    if (showDestinationSuggestions) {
      updateDesktopSuggestPos()
      window.addEventListener('scroll', updateDesktopSuggestPos, true)
      window.addEventListener('resize', updateDesktopSuggestPos)
      return () => {
        window.removeEventListener('scroll', updateDesktopSuggestPos, true)
        window.removeEventListener('resize', updateDesktopSuggestPos)
      }
    }
  }, [showDestinationSuggestions])

  // Popular destinations data
  const popularDestinations: PopularDestination[] = [
    // Keep Malé, Maldives first
    {
      name: "Malé",
      country: "Maldives", 
      image: "/placeholder.svg?height=60&width=60&text=Male",
      deals: 892,
      rating: 4.7,
      priceFrom: 85,
    },
    {
      name: "Maldives",
      country: "Maldives",
      image: "/placeholder.svg?height=60&width=60&text=Maldives",
      deals: 1156,
      rating: 4.4,
      priceFrom: 35,
    },
    {
      name: "Bangkok",
      country: "Thailand",
      image: "/placeholder.svg?height=60&width=60&text=Bangkok",
      deals: 1247,
      rating: 4.5,
      priceFrom: 25,
    },
    {
      name: "Thailand",
      country: "Thailand",
      image: "/placeholder.svg?height=60&width=60&text=Thailand",
      deals: 654,
      rating: 4.6,
      priceFrom: 95,
    },
  ]

  // Destination suggestions based on input
  const getDestinationSuggestions = (input: string) => {
    const source: Suggestion[] = suggestions && suggestions.length ? suggestions : apiSuggestions
    // Prepare an injected preset for "Malé, Maldives"
    const malePreset = popularDestinations.find(
      (p) => (p.name || '').toLowerCase() === 'malé' && (p.country || '').toLowerCase() === 'maldives'
    ) || {
      id: 'male-maldives',
      name: 'Malé',
      country: 'Maldives',
      image: '/placeholder.svg?height=60&width=60&text=Male',
      deals: 892,
      rating: 4.7,
      priceFrom: 85,
    }
    if (!input && source.length === 0) {
      // Always inject Malé, Maldives on top of popular fallback and dedupe
      const withInjected = [malePreset as any, ...popularDestinations]
      const seen = new Set<string>()
      const deduped = withInjected.filter((c) => {
        const key = `${(c.name || '').toLowerCase()}|${(c.country || '').toLowerCase()}`
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
      return deduped.slice(0, 20)
    }
    const lowered = input.toLowerCase()
    let base = lowered
      ? source.filter((s) => s.name.toLowerCase().includes(lowered) || (s.country || '').toLowerCase().includes(lowered))
      : source.slice(0, 12)
    // Pin Maldives to the top (exact match highest, then partial) within base
    const pinScore = (s: Suggestion) => {
      const n = (s.name || '').toLowerCase()
      const c = (s.country || '').toLowerCase()
      if (n === 'maldives' || c === 'maldives') return 2
      if (n.includes('maldives') || c.includes('maldives')) return 1
      return 0
    }
    base = base.slice().sort((a, b) => pinScore(b) - pinScore(a))

    const toCard = (s: Suggestion) => ({
      id: s.id,
      name: s.name,
      country: s.country,
      image: "/placeholder.svg?height=60&width=60&text=" + encodeURIComponent(s.name),
      deals: Math.floor(Math.random() * 1000) + 100,
      rating: 4 + Math.random(),
      priceFrom: Math.floor(Math.random() * 150) + 20,
    })

    // Always inject "Malé, Maldives" at the very top

    let cards = base.slice(0, 20).map(toCard)
    cards = [malePreset as any, ...cards]

    // Dedupe by name+country, keep first (ensures injected Maldives stays on top)
    const seen = new Set<string>()
    cards = cards.filter((c) => {
      const key = `${(c.name || '').toLowerCase()}|${(c.country || '').toLowerCase()}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })

    return cards.slice(0, 20)
  }
  // If no server-provided suggestions, fallback to API search for destinations
  useEffect(() => {
    if (suggestions && suggestions.length) return
    let ignore = false
    const fetchSuggestions = async () => {
      if (!debouncedQuery) { setApiSuggestions([]); return }
      try {
        const res = await fetch(`/api/search/destinations?q=${encodeURIComponent(debouncedQuery)}`)
        if (!res.ok) return
        const data = await res.json()
        if (!ignore) setApiSuggestions(data)
      } catch {}
    }
    fetchSuggestions()
    return () => { ignore = true }
  }, [debouncedQuery, suggestions])

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
    <div className="p-4 lg:p-3 space-y-3 w-80 lg:w-72">
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
    <Card className="w-full rounded-2xl sm: lg:rounded max-w-8xl lg:max-w-8xl mx-auto shadow-[0_0_8px_rgba(255,255,255,0.8)] sm:shadow-lg ">
  <CardContent className="p-3 lg:p-0 lg:w-full">
        {/* Unified desktop inline bar */}
  <div className="hidden lg:flex items-stretch w-full bg-white rounded-md  overflow-hidden h-14 relative z-10">
          {/* Where (desktop custom autocomplete – no Popover) */}
          <div
            ref={whereWrapperRef}
            className="flex-1 flex flex-col justify-center px-4 text-left hover:bg-gray-50 focus-within:bg-gray-50 cursor-text relative"
            onClick={() => {
              destinationInputRef.current?.focus()
              setShowDestinationSuggestions(true)
            }}
          >
            <span className="text-[11px] uppercase tracking-wide text-gray-500 leading-none mb-1">Where</span>
            <div className="flex items-center text-sm text-gray-700 gap-2 min-w-0">
              <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <input
                ref={destinationInputRef}
                type="text"
                className="bg-transparent outline-none flex-1 min-w-0 placeholder:text-gray-400"
                placeholder="Enter a destination"
                value={destinationInput}
                autoComplete="off"
                autoCorrect="off"
                onFocus={() => setShowDestinationSuggestions(true)}
                onChange={(e) => {
                  setDestinationInput(e.target.value)
                  setSearchData({ ...searchData, destination: e.target.value })
                  if (!showDestinationSuggestions) setShowDestinationSuggestions(true)
                  setHighlightIndex(-1)
                }}
                onKeyDown={(e) => {
                  const list = getDestinationSuggestions(destinationInput)
                  if (e.key === 'ArrowDown') { e.preventDefault(); setHighlightIndex(i => Math.min(i + 1, list.length - 1)) }
                  else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlightIndex(i => Math.max(i - 1, 0)) }
                  else if (e.key === 'Enter') {
                    if (highlightIndex >= 0) {
                      const sel = list[highlightIndex]; if (sel) handleDestinationSelect(sel as any)
                    } else {
                      setShowDestinationSuggestions(false)
                    }
                  } else if (e.key === 'Escape') {
                    setShowDestinationSuggestions(false); setHighlightIndex(-1)
                  }
                }}
              />
            </div>
            {showDestinationSuggestions && desktopSuggestPos && (
                <div
                style={{
                  position: 'fixed',
                  left: desktopSuggestPos.left,
                  top: desktopSuggestPos.top + 4,
                  // Keep at least input width or 250px (whichever is larger)
                  minWidth: Math.max(500, desktopSuggestPos.width),
                  // When user has typed something, allow auto width based on content; otherwise lock to field width
                  width: destinationInput.trim() ? 'auto' : desktopSuggestPos.width,
                  // Prevent overflowing viewport
                  maxWidth: 'min(640px, calc(100vw - 40px))',
                }}
                className="max-h-96 min-w-auto bg-white shadow-xl border border-gray-200 rounded-lg z-[100] overflow-hidden inline-block"
                >
                <div className="p-3 border-b flex items-center space-x-2 sticky top-0 bg-white z-10">
                  <TrendingUp className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Popular Destinations</span>
                </div>
                <div className="p-3 space-y-2">
                  {getDestinationSuggestions(destinationInput).map((destination, idx) => (
                    <button
                      key={destination.id || destination.name}
                      onClick={() => handleDestinationSelect(destination as any)}
                      className={`w-full text-left p-3 rounded-md transition-colors ${highlightIndex === idx ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                      onMouseEnter={() => setHighlightIndex(idx)}
                    >
                      <div className="flex items-center space-x-3">
                        <img src={destination.image || '/placeholder.svg'} alt={destination.name} className="w-12 h-12 rounded-md object-cover" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium truncate pr-2">{destination.name}</span>
                          </div>
                          <p className="text-xs text-gray-500">{destination.country}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                  {getDestinationSuggestions(destinationInput).length === 0 && (
                    <div className="text-sm text-gray-500 py-4 text-center">No matches</div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="w-px bg-gray-200 my-2" />

          {/* Dates range */}
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex-1 flex flex-col justify-center px-4 text-left hover:bg-gray-50 focus:outline-none">
                  <span className="text-[11px] uppercase tracking-wide text-gray-500 leading-none mb-1">Dates</span>
                  <span className="flex items-center text-sm text-gray-700 truncate">
                    <CalendarIcon className="w-3.5 h-3.5 mr-2 text-gray-400" />
                    {searchData.checkIn && searchData.checkOut
                      ? `${format(searchData.checkIn, "MMM dd")} - ${format(searchData.checkOut, "MMM dd")}`
                      : <span className="text-gray-400">Sep 15 - Sep 16</span>}
                  </span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white shadow-lg border rounded-lg" align="start">
                <div className="p-3">
                  <DayPicker
                    mode="range"
                    selected={searchData.checkIn && searchData.checkOut ? { from: searchData.checkIn, to: searchData.checkOut } : undefined}
                    onSelect={(range) => {
                      if (!range) return
                      const from = (range as any).from as Date | undefined
                      const to = (range as any).to as Date | undefined
                      setSearchData({ ...searchData, checkIn: from, checkOut: to })
                    }}
                    disabled={{ before: new Date() }}
                  />
                </div>
              </PopoverContent>
            </Popover>

          <div className="w-px bg-gray-200 my-2" />

      {/* Guests (desktop) */}
      <Popover open={showGuestSelectorDesktop} onOpenChange={setShowGuestSelectorDesktop}>
            <PopoverTrigger asChild>
              <button
                type="button"
        aria-haspopup="dialog"
        aria-expanded={showGuestSelectorDesktop}
        onClick={(e) => { e.preventDefault(); setShowGuestSelectorDesktop(v => !v) }}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setShowGuestSelectorDesktop(v => !v) } }}
        className="flex-1 flex flex-col justify-center px-4 text-left hover:bg-gray-50 focus:outline-none cursor-pointer select-none"
              >
                <span className="text-[11px] uppercase tracking-wide text-gray-500 leading-none mb-1">Guests</span>
                <span className="flex items-center text-sm text-gray-700 truncate">
                  <Users className="w-3.5 h-3.5 mr-2 text-gray-400" />
                  {searchData.guests.rooms} Room, {searchData.guests.adults + searchData.guests.children} Guests
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 lg:w-80" align="start">
              <div className="lg:w-80">
                <GuestSelector />
              </div>
            </PopoverContent>
          </Popover>

          {/* Search icon */}
          <div className="flex items-center pr-2 pl-2">
            <Button onClick={handleSearch} size="lg" className="w-10 h-10 p-0 flex items-center justify-center rounded-md bg-gold-100-sm  hover:bg-gold-100-hover">
              <Search className="h-4 w-4 text-white" />
            </Button>
          </div>
        </div>

        {/* Original (mobile / small) layout */}
  <div className="grid grid-cols-1 gap-3 lg:hidden text-[13px]">
          {/* Destination */}
          <div className="relative">
            <Label htmlFor="destination" className="sr-only">Where</Label>
            {!isDesktop && (
              <div ref={mobileWhereRef} className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                <Input
                  id="destination"
                  placeholder="Enter a destination"
                  value={destinationInput}
                  onFocus={() => setShowDestinationSuggestionsMobile(true)}
                  onChange={(e) => {
                    setDestinationInput(e.target.value)
                    setSearchData({ ...searchData, destination: e.target.value })
                    if (!showDestinationSuggestionsMobile) setShowDestinationSuggestionsMobile(true)
                  }}
                  onKeyDown={(e) => {
                    const list = getDestinationSuggestions(destinationInput)
                    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlightIndex(i => Math.min(i + 1, list.length - 1)) }
                    else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlightIndex(i => Math.max(i - 1, 0)) }
                    else if (e.key === 'Enter') {
                      if (highlightIndex >= 0) { const sel = list[highlightIndex]; if (sel) handleDestinationSelect(sel as any) }
                      else setShowDestinationSuggestionsMobile(false)
                    } else if (e.key === 'Escape') { setShowDestinationSuggestionsMobile(false); setHighlightIndex(-1) }
                  }}
                  className="pl-10 h-11 rounded-md"
                />
                {showDestinationSuggestionsMobile && (
                  <div className="absolute left-0 right-0 mt-2 bg-white border rounded-md shadow-lg z-30 max-h-96 w-auto overflow-y-auto">
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
                              onClick={() => { handleRecentSearchSelect(search); setShowDestinationSuggestionsMobile(false) }}
                              className="w-full text-left p-2 hover:bg-gray-50 rounded-md transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-medium">{search.destination}</span>
                                <span className="text-xs text-gray-500">{format(search.checkIn, 'MMM dd')} - {format(search.checkOut, 'MMM dd')}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <TrendingUp className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Popular Destinations</span>
                      </div>
                      <div className="space-y-2">
                        {getDestinationSuggestions(destinationInput).map((destination, idx) => (
                          <button
                            key={destination.id || destination.name}
                            onClick={() => { handleDestinationSelect(destination as any); setShowDestinationSuggestionsMobile(false) }}
                            className={`w-full text-left p-3 rounded-md transition-colors ${highlightIndex === idx ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                            onMouseEnter={() => setHighlightIndex(idx)}
                          >
                            <div className="flex items-center space-x-3">
                              <img src={destination.image || '/placeholder.svg'} alt={destination.name} className="w-12 h-12 rounded-md object-cover" />
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
                        {getDestinationSuggestions(destinationInput).length === 0 && (
                          <div className="text-sm text-gray-500 py-4 text-center">No matches</div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Dates (mobile: single date-range picker) */}
          <div>
            <Label className="sr-only">Dates</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full h-11 justify-start text-left font-normal bg-transparent">
                  <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                  {searchData.checkIn && searchData.checkOut
                    ? `${format(searchData.checkIn, 'dd MMM')} - ${format(searchData.checkOut, 'dd MMM')}`
                    : 'Select dates'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white shadow-lg border rounded-lg" align="start">
                <div className="p-3">
                  <DayPicker
                    mode="range"
                    selected={searchData.checkIn && searchData.checkOut ? { from: searchData.checkIn, to: searchData.checkOut } : undefined}
                    onSelect={(range: any) => {
                      if (!range) return
                      const from = range.from as Date | undefined
                      const to = range.to as Date | undefined
                      setSearchData({ ...searchData, checkIn: from, checkOut: to })
                    }}
                    disabled={{ before: new Date() }}
                  />
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Guests */}
          <div>
            <Label className="sr-only">Guests</Label>
            <Popover open={showGuestSelector} onOpenChange={setShowGuestSelector}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full h-11 justify-start text-left font-normal bg-transparent">
                  <Users className="mr-2 h-4 w-4 text-gray-500" />
                  {searchData.guests.adults + searchData.guests.children} guests, {searchData.guests.rooms} room{searchData.guests.rooms > 1 ? "s" : ""}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 lg:w-80" align="start">
                <div className="lg:w-80">
                  <GuestSelector />
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Search Button - Desktop inline, Mobile below */}
          <div className="flex items-end space-x-2">
            {/* Mobile: full-width text button */}
            <div className="flex-1 lg:hidden">
              <Button onClick={handleSearch} size="sm" className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-[13px] font-medium">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>

            {/* Desktop: compact square icon button */}
            <div className="hidden lg:block">
              <Button onClick={handleSearch} size="lg" className="w-10 h-10 p-0 flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700">
                <Search className="h-4 w-4 text-white" />
              </Button>
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  )
}
