"use client"

import { useEffect, useMemo, useState, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DayPicker } from "react-day-picker"
import { Search, CalendarIcon, Users, MapPin, X, TrendingUp, Star } from "lucide-react"
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
    { name: 'Malé', country: 'Maldives', id: 'male' },
    { name: 'Bangkok', country: 'Thailand', id: 'bkk' },
    { name: 'Phuket', country: 'Thailand', id: 'hkt' },
    { name: 'Singapore', country: 'Singapore', id: 'sin' },
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

  return (
    <div className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        {/* Desktop */}
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
            <Button onClick={handleSearch} className="h-10 px-6 border-black-600 hover:bg-gold-100 text-white text-sm font-medium"> <Search className="w-4 h-4 mr-2" /> Search</Button>
          </div>
        </div>
        {/* Mobile */}
        <div className="md:hidden  rounded-md p-3 space-y-3">{/* mobile container */}
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
          <Button onClick={handleSearch} className="w-full h-11 bg-black-100 hover:bg-white-100 text-white text-sm font-medium"><Search className="w-4 h-4 mr-2"/>Search</Button>
        </div>
      </div>
    </div>
  )
}
