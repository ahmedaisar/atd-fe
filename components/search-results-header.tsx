"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DayPicker } from "react-day-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, CalendarIcon, Users, MapPin, SlidersHorizontal } from "lucide-react"
import { format, addDays } from "date-fns"

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
  const adultsParam = sp.get("adults")
  const childrenParam = sp.get("children")
  const roomsParam = sp.get("rooms")

  const [destination, setDestination] = useState<string>("")
  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined)
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [guestsOption, setGuestsOption] = useState<string>("2-adults")

  useEffect(() => {
    setDestination(destinationParam)
    const ci = parseDateYMD(checkInParam) || new Date()
    const co = parseDateYMD(checkOutParam) || addDays(ci, 1)
    setCheckIn(ci)
    setCheckOut(co)

    const adults = Number(adultsParam || "2")
    const children = Number(childrenParam || "0")
    if (children > 0) setGuestsOption("family")
    else if (adults >= 4) setGuestsOption("4-adults")
    else setGuestsOption("2-adults")
  }, [destinationParam, checkInParam, checkOutParam, adultsParam, childrenParam])

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 1
    const diff = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
    return Math.max(1, Math.round(diff))
  }, [checkIn, checkOut])

  const handleSearch = () => {
    const params = new URLSearchParams(sp.toString())
    if (destination) params.set("destination", destination)
    else params.delete("destination")
    if (destinationId) params.set("destinationId", destinationId)
    if (checkIn) params.set("checkIn", format(checkIn, "yyyy-MM-dd"))
    if (checkOut) params.set("checkOut", format(checkOut, "yyyy-MM-dd"))

    // Optionally adjust adults/children from quick selector
    const currentRooms = roomsParam || "1"
    if (guestsOption === "2-adults") {
      params.set("adults", "2")
      params.set("children", "0")
    } else if (guestsOption === "4-adults") {
      params.set("adults", "4")
      params.set("children", "0")
    } else if (guestsOption === "family") {
      params.set("adults", "2")
      params.set("children", "2")
    }
    if (!params.get("rooms")) params.set("rooms", currentRooms)

    router.push(`/search?${params.toString()}`)
  }

  return (
    <div className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Refined Search Bar */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4">
          <div className="md:col-span-2">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Bangkok, Thailand"
                className="pl-10 h-11 border-gray-300 focus:border-blue-500"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full h-11 justify-start text-left font-normal border-gray-300 hover:border-blue-500 bg-transparent"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkIn ? format(checkIn, "MMM dd") : "Check-in"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-3" align="start">
                <DayPicker
                  mode="single"
                  selected={checkIn}
                  onSelect={(d) => {
                    if (!d) return
                    setCheckIn(d)
                    if (!checkOut || d >= checkOut) setCheckOut(addDays(d, 1))
                  }}
                  disabled={{ before: new Date() }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full h-11 justify-start text-left font-normal border-gray-300 hover:border-blue-500 bg-transparent"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkOut ? format(checkOut, "MMM dd") : "Check-out"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-3" align="start">
                <DayPicker
                  mode="single"
                  selected={checkOut}
                  onSelect={(d) => d && setCheckOut(d)}
                  disabled={checkIn ? { before: addDays(checkIn, 1) } : { before: new Date() }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Select value={guestsOption} onValueChange={setGuestsOption}>
              <SelectTrigger className="w-full h-11 border-gray-300 focus:border-blue-500">
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2-adults">2 Adults</SelectItem>
                <SelectItem value="4-adults">4 Adults</SelectItem>
                <SelectItem value="family">2 Adults, 2 Children</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Button className="bg-blue-600 hover:bg-blue-700 px-8" onClick={handleSearch}>
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </div>
    </div>
  )
}
