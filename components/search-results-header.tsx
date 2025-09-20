"use client"

import { useEffect, useMemo, useState, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DayPicker } from "react-day-picker"
import { Search, CalendarIcon, Users, MapPin, X, TrendingUp, Pencil, ArrowUpNarrowWide } from "lucide-react"
import { format, addDays } from "date-fns"
import { useDebounce } from "@/hooks/use-debounce"

// Helper to parse yyyy-MM-dd safely in local time
function parseDateYMD(ymd?: string | null): Date | null {
  if (!ymd) return null
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd)
  if (!m) return null
  const y = Number(m[1])
  const mo = Number(m[2]) - 1
  const d = Number(m[3])
  return new Date(y, mo, d)
}

export function SearchResultsHeader() {
  const router = useRouter()
  const sp = useSearchParams()

  // Read existing params
  const destinationParam = sp.get("destination") || ""
  const destinationId = sp.get("destinationId") || ""
  const checkInParam = sp.get("checkIn")
  const checkOutParam = sp.get("checkOut")
  const adultsParam = sp.get("adults") || "2"
  const childrenParam = sp.get("children") || "0"
  const roomsParam = sp.get("rooms") || "1"

  const [destination, setDestination] = useState<string>("")
  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined)
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined)
  const [adults, setAdults] = useState<number>(Number(adultsParam) || 2)
  const [children, setChildren] = useState<number>(Number(childrenParam) || 0)
  const [rooms, setRooms] = useState<number>(Number(roomsParam) || 1)
  // Desktop popovers
  const [openRange, setOpenRange] = useState(false)
  const [openGuests, setOpenGuests] = useState(false)
  // Mobile popovers (separate so desktop state doesn't block them)
  const [openRangeMobile, setOpenRangeMobile] = useState(false)
  const [openGuestsMobile, setOpenGuestsMobile] = useState(false)
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false)
  // Mobile suggestions state (separate to avoid desktop positioning logic)
  const [showMobileSuggestions, setShowMobileSuggestions] = useState(false)
  const [mobileHighlight, setMobileHighlight] = useState(-1)
  const mobileDestRef = useRef<HTMLDivElement | null>(null)
  const [apiSuggestions, setApiSuggestions] = useState<Array<{ id: string; name: string; country: string }>>([])
  const [highlightIndex, setHighlightIndex] = useState(-1)
  const whereWrapperRef = useRef<HTMLDivElement | null>(null)
  const [desktopSuggestPos, setDesktopSuggestPos] = useState<{ left: number; top: number; width: number } | null>(null)
  const debouncedQuery = useDebounce(destination, 250)

  useEffect(() => {
    setDestination(destinationParam)
    const ci = parseDateYMD(checkInParam) || new Date()
    const co = parseDateYMD(checkOutParam) || addDays(ci, 1)
    setCheckIn(ci)
    setCheckOut(co)
  }, [destinationParam, checkInParam, checkOutParam])

  // Popular fallback (simple) – could be extended
  const popularDestinations = useMemo(() => [
    { name: 'Malé', country: 'Maldives', id: 'male' }
  ], [])

  const getDestinationSuggestions = (input: string) => {
    if (!input.trim()) return popularDestinations
    return apiSuggestions.length ? apiSuggestions : popularDestinations.filter(d => d.name.toLowerCase().includes(input.toLowerCase()))
  }

  // Fetch API suggestions
  useEffect(() => {
    let ignore = false
    const run = async () => {
      if (!debouncedQuery.trim()) { setApiSuggestions([]); return }
      try {
        const res = await fetch(`/api/search/destinations?q=${encodeURIComponent(debouncedQuery)}`)
        if (!res.ok) return
        const data = await res.json()
        if (!ignore) setApiSuggestions(data)
      } catch { /* silent */ }
    }
    run();
    return () => { ignore = true }
  }, [debouncedQuery])

  // Position update for fixed suggestions
  const updateDesktopSuggestPos = () => {
    if (whereWrapperRef.current) {
      const rect = whereWrapperRef.current.getBoundingClientRect()
      setDesktopSuggestPos({ left: rect.left + window.scrollX, top: rect.bottom + window.scrollY, width: rect.width })
    }
  }

  useEffect(() => {
    if (showDestinationSuggestions) {
      updateDesktopSuggestPos()
      window.addEventListener('resize', updateDesktopSuggestPos)
      window.addEventListener('scroll', updateDesktopSuggestPos, true)
      return () => {
        window.removeEventListener('resize', updateDesktopSuggestPos)
        window.removeEventListener('scroll', updateDesktopSuggestPos, true)
      }
    }
  }, [showDestinationSuggestions])

  // Outside click
  useEffect(() => {
    if (!showDestinationSuggestions) return
    const handler = (e: MouseEvent) => {
      if (whereWrapperRef.current && !whereWrapperRef.current.contains(e.target as Node)) {
        setShowDestinationSuggestions(false)
        setHighlightIndex(-1)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showDestinationSuggestions])

  // Outside click for mobile suggestions
  useEffect(() => {
    if (!showMobileSuggestions) return
    const handler = (e: MouseEvent) => {
      if (mobileDestRef.current && !mobileDestRef.current.contains(e.target as Node)) {
        setShowMobileSuggestions(false)
        setMobileHighlight(-1)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showMobileSuggestions])

  const handleDestinationSelect = (d: { name: string; country: string; id?: string }) => {
    setDestination(`${d.name}, ${d.country}`)
    setShowDestinationSuggestions(false)
    setHighlightIndex(-1)
  setShowMobileSuggestions(false)
  setMobileHighlight(-1)
  }

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 1
    const diff = (checkOut.getTime() - checkIn.getTime()) / 86400000
    return Math.max(1, Math.round(diff))
  }, [checkIn, checkOut])

  const handleSearch = () => {
    const params = new URLSearchParams(sp.toString())
    if (destination) params.set("destination", destination)
    else params.delete("destination")
    if (destinationId) params.set("destinationId", destinationId)
    if (checkIn) params.set("checkIn", format(checkIn, "yyyy-MM-dd"))
    if (checkOut) params.set("checkOut", format(checkOut, "yyyy-MM-dd"))
    params.set("adults", String(adults))
    params.set("children", String(children))
    params.set("rooms", String(rooms))
    router.push(`/search?${params.toString()}`)
  }

  // Mobile summary state only
  const [isEditingMobile, setIsEditingMobile] = useState(false)
  const dateRangeLabel = useMemo(() => {
    if (!checkIn || !checkOut) return 'Add dates'
    return `${format(checkIn,'MMM d')} - ${format(checkOut,'MMM d')}`
  }, [checkIn, checkOut])
  const guestsLabel = useMemo(() => {
    const total = adults + children
    return `${total} traveler${total!==1?'s':''}, ${rooms} room${rooms!==1?'s':''}`
  }, [adults, children, rooms])
  const compactDestination = destination || destinationParam || 'Destination'
  const propertyCountLabel = 'We have found 300+ Hotels in Maldives'
  // Map chip keys to actual sort param values expected by backend
  const sortKeyToParam: Record<string,string> = {
    popular: 'recommended',
    price: 'price',
    guestRating: 'rating',
    amenities: 'amenities',
    themes: 'themes'
  }
  const sortParam = sp.get('sort') || 'recommended'
  // Reverse map to chip key (default to 'popular' when recommended)
  const paramToSortKey: Record<string,string> = Object.fromEntries(Object.entries(sortKeyToParam).map(([k,v])=>[v,k]))
  const derivedActiveSortKey = paramToSortKey[sortParam] || 'popular'
  const [activeSort, setActiveSort] = useState(derivedActiveSortKey)
  // Keep activeSort in sync with URL changes (back/forward navigation)
  useEffect(() => {
    if (activeSort !== derivedActiveSortKey) setActiveSort(derivedActiveSortKey)
  }, [derivedActiveSortKey])
  const [activeFilter, setActiveFilter] = useState('popular')
  const filterChips = [
    { key: '$', label: '$', inactive: true },
    { key: 'popular', label: 'Popular' },
    { key: 'price', label: 'Price' },
    { key: 'guestRating', label: 'Guest rating' },
    { key: 'amenities', label: 'Amenities' },
    { key: 'themes', label: 'Themes' }
  ]
  // Carousel refs/state for mobile chips
  const chipsScrollRef = useRef<HTMLDivElement | null>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const updateChipScrollState = () => {
    const el = chipsScrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }

  useEffect(() => {
    updateChipScrollState()
    const el = chipsScrollRef.current
    if (!el) return
    const handle = () => updateChipScrollState()
    el.addEventListener('scroll', handle, { passive: true })
    window.addEventListener('resize', handle)
    return () => { el.removeEventListener('scroll', handle); window.removeEventListener('resize', handle) }
  }, [])

  const scrollChips = (dir: 1 | -1) => {
    const el = chipsScrollRef.current
    if (!el) return
    const amount = Math.round(el.clientWidth * 0.65) * dir
    el.scrollBy({ left: amount, behavior: 'smooth' })
  }

  return (
    <div className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        {/* Desktop (original, unchanged) */}
        <div className="hidden md:flex items-stretch bg-white border-2 border-black-600 rounded-md h-14 relative">
          {/* Destination */}
          <div ref={whereWrapperRef} className="flex-1 flex flex-col justify-center px-4 cursor-text" onClick={() => { setShowDestinationSuggestions(true) }}>
            <span className="text-[11px] uppercase tracking-wide text-gray-500 leading-none mb-1">Where</span>
            <div className="flex items-center gap-2 min-w-0">
              <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
              <div className="relative flex-1 flex items-center">
                <Input
                  value={destination}
                  onFocus={() => setShowDestinationSuggestions(true)}
                  onChange={e => { setDestination(e.target.value); if (!showDestinationSuggestions) setShowDestinationSuggestions(true); setHighlightIndex(-1) }}
                  placeholder="Search destinations"
                  className="border-0 bg-transparent h-auto p-0 focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-offset-0 shadow-none text-sm"
                  onKeyDown={(e) => {
                    const list = getDestinationSuggestions(destination)
                    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlightIndex(i => Math.min(i + 1, list.length - 1)) }
                    else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlightIndex(i => Math.max(i - 1, 0)) }
                    else if (e.key === 'Enter') {
                      if (highlightIndex >= 0) { const sel = list[highlightIndex]; if (sel) handleDestinationSelect(sel) } else setShowDestinationSuggestions(false)
                    } else if (e.key === 'Escape') { setShowDestinationSuggestions(false); setHighlightIndex(-1) }
                  }}
                />
                {destination && (
                  <button aria-label="Clear destination" onClick={() => setDestination("")}
                    className="absolute right-0 text-gray-400 hover:text-gray-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
            {showDestinationSuggestions && desktopSuggestPos && (
              <div
                style={{
                  position: 'fixed',
                  left: desktopSuggestPos.left,
                  top: desktopSuggestPos.top + 4,
                  minWidth: Math.max(260, desktopSuggestPos.width),
                  width: destination.trim() ? 'auto' : desktopSuggestPos.width,
                  maxWidth: 'min(640px, calc(100vw - 40px))'
                }}
                className="bg-white shadow-xl border border-gray-200 rounded-lg z-50 max-h-96 overflow-auto"
              >
                <div className="p-3 border-b flex items-center space-x-2 sticky top-0 bg-white z-10">
                  <TrendingUp className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Popular Destinations</span>
                </div>
                <div className="p-2 space-y-1">
                  {getDestinationSuggestions(destination).map((d, idx) => (
                    <button
                      key={d.id || d.name}
                      onClick={() => handleDestinationSelect(d)}
                      className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-3 transition-colors ${highlightIndex === idx ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                      onMouseEnter={() => setHighlightIndex(idx)}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{d.name}</p>
                        <p className="text-xs text-gray-500 truncate">{d.country}</p>
                      </div>
                    </button>
                  ))}
                  {getDestinationSuggestions(destination).length === 0 && (
                    <div className="text-sm text-gray-500 py-6 text-center">No matches</div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="w-px bg-gray-200 my-2" />
          {/* Dates */}
          <Popover open={openRange} onOpenChange={setOpenRange}>
            <PopoverTrigger asChild>
              <button className="flex-1 flex flex-col justify-center px-4 text-left hover:bg-gray-50">
                <span className="text-[11px] uppercase tracking-wide text-gray-500 leading-none mb-1">Dates</span>
                <span className="flex items-center text-sm text-gray-700 truncate">
                  <CalendarIcon className="w-4 h-4 mr-2 text-gray-400" />
                  {checkIn && checkOut ? `${format(checkIn, 'EEE, MMM dd')}  -  ${format(checkOut, 'EEE, MMM dd')}` : 'Add dates'}
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="p-3 w-auto" align="start">
              <DayPicker
                mode="range"
                selected={checkIn && checkOut ? { from: checkIn, to: checkOut } : undefined}
                onSelect={(range: any) => {
                  if (range?.from) setCheckIn(range.from)
                  if (range?.to) setCheckOut(range.to)
                }}
                disabled={{ before: new Date() }}
              />
            </PopoverContent>
          </Popover>
          {/* Nights badge with label */}
          <div className="flex flex-col justify-center px-3">
            <span className="text-[11px] uppercase tracking-wide text-gray-500 leading-none mb-1">Nights</span>
            <span className="text-[11px] bg-gray-100 rounded-full px-3 py-1 font-medium text-gray-600 whitespace-nowrap">{nights} night{nights>1?'s':''}</span>
          </div>
          <div className="w-px bg-gray-200 my-2" />
          {/* Guests */}
          <Popover open={openGuests} onOpenChange={setOpenGuests}>
            <PopoverTrigger asChild>
              <button className="flex-1 flex flex-col justify-center px-4 text-left hover:bg-gray-50">
                <span className="text-[11px] uppercase tracking-wide text-gray-500 leading-none pb-2">Guests</span>
                <span className="flex items-center text-sm text-gray-700 truncate mb-1">
                  <Users className="w-4 h-4 mr-2 text-gray-400" />
                  {rooms} room, {adults + children} guest{adults+children>1?'s':''}
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="start">
              <div className="space-y-4 text-sm">
                {[{label:'Adults', value:adults, set:setAdults, min:1, max:16, helper:'Ages 13+'},{label:'Children', value:children, set:setChildren, min:0, max:16, helper:'Ages 0-12'},{label:'Rooms', value:rooms, set:setRooms, min:1, max:8, helper:'Max 8'}].map(row => (
                  <div className="flex items-center justify-between" key={row.label}>
                    <div>
                      <p className="font-medium">{row.label}</p>
                      <p className="text-xs text-gray-500">{row.helper}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button variant="outline" size="sm" disabled={row.value<=row.min} onClick={() => row.set(Math.max(row.min, row.value-1))}>-</Button>
                      <span className="w-6 text-center">{row.value}</span>
                      <Button variant="outline" size="sm" disabled={row.value>=row.max} onClick={() => row.set(Math.min(row.max, row.value+1))}>+</Button>
                    </div>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          {/* Search button */}
          <div className="flex items-center pr-2 pl-2">
            <Button onClick={handleSearch} className="h-10 px-6 border-black-600 sm:bg-gold-100 hover:bg-gold-100-hover"><Search className="w-4 h-4 mr-2" /> Search</Button>
          </div>
        </div>
        {/* Mobile summary card */}
        <div className="md:hidden">
          {!isEditingMobile && (
            <>
              <div className="inline-flex flex-col gap-2 bg-white border border-gray-300 shadow-sm rounded-xl px-4 pt-3 pb-3 w-full">
                <div className="flex items-start justify-between">
                  <h2 className="text-[15px] font-semibold leading-tight tracking-tight text-gray-900 truncate max-w-[80%]">{compactDestination}</h2>
                  <button aria-label="Edit search" onClick={()=>setIsEditingMobile(true)} className="p-1 text-gray-500 hover:text-gray-800"><Pencil className="w-4 h-4"/></button>
                </div>
                <div className="text-[11px] font-medium text-gray-600 flex flex-wrap gap-1">
                  <span>{dateRangeLabel}</span>
                  <span className="px-1 text-gray-400">|</span>
                  <span>{guestsLabel}</span>
                </div>
              </div>
              {/* Mobile sort/filter chips */}
              <div className="mt-4 px-2 relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 w-6 from-white to-transparent bg-gradient-to-r" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-6 from-white to-transparent bg-gradient-to-l" />
                <div className="flex items-center gap-2 overflow-x-auto pb-1 -ml-1 pr-2 text-[11px] scroll-smooth snap-x snap-mandatory scrollbar-hide">
                  <button
                    aria-label="Open filters"
                    onClick={() => {
                      const trigger = document.getElementById('mobile-filters-trigger') as HTMLButtonElement | null
                      if (trigger) trigger.click()
                    }}
                    className="px-3 h-7 flex-shrink-0 inline-flex items-center rounded-full border font-medium bg-gray-900 border-gray-900 text-white transition-colors snap-start"
                  >
                    Filters
                  </button>
      {['popular','price','guestRating','amenities','themes'].map(key => (
                    <button
                      key={key}
                      aria-label={`Sort by ${key}`}
                      onClick={() => {
        if (activeSort === key) return
        setActiveSort(key)
        const params = new URLSearchParams(sp.toString())
        params.set('sort', sortKeyToParam[key] || 'recommended')
        router.push(`/search?${params.toString()}`)
                      }}
                      className={`px-3 h-7 flex-shrink-0 inline-flex items-center rounded-full border font-medium transition-colors snap-start ${activeSort === key ? 'bg-gold-100 border-gold-100 text-white' : 'border-gray-300 text-gray-700 hover:border-gray-400'}`}
                    >
            <ArrowUpNarrowWide className="w-3.5 h-3.5 mr-1" />
            {key === 'guestRating' ? 'Guest rating' : key.charAt(0).toUpperCase() + key.slice(1)}
                    </button>
                  ))}
                </div>
                <div className="text-[11px] text-gray-500 font-medium mt-1">{propertyCountLabel}</div>
              </div>
            </>
          )}
          {isEditingMobile && (
            <div className="rounded-md p-3 space-y-3 border border-gray-200 mt-3">{/* mobile edit container */}
              {/* Destination row */}
              <div className="relative" ref={mobileDestRef}>
            <MapPin className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              aria-label="Destination"
              value={destination}
              placeholder="Destination"
  className="pl-9 pr-7 h-10 text-sm font-semibold border border-black-600  focus-visible:ring-black-600 focus-visible:border-black-600 transition-colors"
              onFocus={() => { setShowMobileSuggestions(true) }}
              onChange={e => { setDestination(e.target.value); if (!showMobileSuggestions) setShowMobileSuggestions(true); setMobileHighlight(-1) }}
              onKeyDown={(e) => {
                const list = getDestinationSuggestions(destination)
                if (e.key === 'ArrowDown') { e.preventDefault(); setMobileHighlight(i => Math.min(i + 1, list.length - 1)) }
                else if (e.key === 'ArrowUp') { e.preventDefault(); setMobileHighlight(i => Math.max(i - 1, 0)) }
                else if (e.key === 'Enter') { if (mobileHighlight >= 0) { const sel = list[mobileHighlight]; if (sel) handleDestinationSelect(sel) } else setShowMobileSuggestions(false) }
                else if (e.key === 'Escape') { setShowMobileSuggestions(false); setMobileHighlight(-1) }
              }}
            />
            {destination && <button aria-label="Clear destination" onClick={() => setDestination('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"><X className="w-4 h-4" /></button>}
            {showMobileSuggestions && (
              <div className="absolute left-0 right-0 mt-2 bg-white border border-black-600 rounded-md shadow-lg z-40 max-h-80 overflow-auto" role="listbox">
                <div className="p-2 space-y-1">
                  {getDestinationSuggestions(destination).map((d, idx) => (
                    <button
                      key={d.id || d.name}
                      role="option"
                      aria-selected={mobileHighlight === idx}
                      className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-3 transition-colors ${mobileHighlight === idx ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                      onMouseEnter={() => setMobileHighlight(idx)}
                      onClick={() => handleDestinationSelect(d)}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{d.name}</p>
                        <p className="text-xs text-gray-500 truncate">{d.country}</p>
                      </div>
                    </button>
                  ))}
                  {getDestinationSuggestions(destination).length === 0 && (
                    <div className="text-sm text-gray-500 py-6 text-center">No matches</div>
                  )}
                </div>
              </div>
            )}
          </div>
          {/* Date range row */}
          <div>
            <Popover open={openRangeMobile} onOpenChange={(v)=>{ setOpenRangeMobile(v); if(v){ setOpenGuestsMobile(false); setShowMobileSuggestions(false)} }}>
              <PopoverTrigger asChild>
                <button aria-label="Select dates" className="w-full h-10 rounded-md border border-black-600 px-3 flex items-center text-sm text-left"
                  onClick={() => { setShowMobileSuggestions(false); setOpenGuestsMobile(false) }}
                >
                  <CalendarIcon className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="flex-1 truncate font-semibold">{checkIn && checkOut ? `${format(checkIn,'MMM dd')} - ${format(checkOut,'MMM dd')}` : 'Dates'}</span>
                  {checkIn && checkOut && <span className="ml-2 text-[10px] bg-gray-100 px-2 py-0.5 rounded-full text-gray-700 font-semibold tracking-wide uppercase">{nights} NIGHT{nights>1?'S':''}</span>}
                </button>
              </PopoverTrigger>
              <PopoverContent className="p-3 w-auto z-[120]" align="start">
                <DayPicker
                  mode="range"
                  selected={checkIn && checkOut ? { from: checkIn, to: checkOut } : undefined}
                  onSelect={(range: any, selectedDay: Date) => {
                    if (range?.from) setCheckIn(range.from)
                    if (range?.to) {
                      setCheckOut(range.to)
                      // Close after full selection
                      setTimeout(() => setOpenRangeMobile(false), 50)
                    } else {
                      setCheckOut(undefined)
                    }
                  }}
                  disabled={{ before: new Date() }}
                />
              </PopoverContent>
            </Popover>
          </div>
          {/* Guests row */}
          <div>
            <Popover open={openGuestsMobile} onOpenChange={(v)=>{ setOpenGuestsMobile(v); if(v){ setOpenRangeMobile(false); setShowMobileSuggestions(false)} }}>
              <PopoverTrigger asChild>
                <button aria-label="Select guests" className="w-full h-10 rounded-md border border-black-600 px-3 flex items-center text-sm text-left">
                  <Users className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="flex-1 truncate font-semibold">{rooms} room, {adults + children} guest{adults+children>1?'s':''}</span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-4 z-[120]" align="start">
                <div className="space-y-4 text-sm">
                  {[{label:'Adults', value:adults, set:setAdults, min:1, max:16},{label:'Children', value:children, set:setChildren, min:0, max:16},{label:'Rooms', value:rooms, set:setRooms, min:1, max:8}].map(row => (
                    <div key={row.label} className="flex items-center justify-between">
                      <span className="font-medium">{row.label}</span>
                      <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm" disabled={row.value<=row.min} onClick={()=>row.set(Math.max(row.min,row.value-1))}>-</Button>
                        <span className="w-6 text-center">{row.value}</span>
                        <Button variant="outline" size="sm" disabled={row.value>=row.max} onClick={()=>row.set(Math.min(row.max,row.value+1))}>+</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex gap-2 pt-1">
            <Button variant="outline" className="flex-1 h-11" onClick={()=>setIsEditingMobile(false)}>Cancel</Button>
            <Button onClick={()=>{ handleSearch(); setIsEditingMobile(false) }} className="flex-1 h-11 sm:bg-gold-100 hover:bg-gold-100-hover text-white text-sm font-medium"><Search className="w-4 h-4 mr-2"/>Search</Button>
          </div>
        </div>
        )}
        </div>
      </div>
    </div>
  )
}
