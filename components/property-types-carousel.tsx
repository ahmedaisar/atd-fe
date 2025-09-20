"use client";
import Image from 'next/image'
import Carousel from '@/components/ui/carousel'

// Static data for now – previously ATOLL_TYPES
const PROPERTY_TYPES = [
  { key: 'bed_and_breakfast', label: 'B&Bs', img: '/images/property-types/b&bs.jpg' },
  { key: 'resort', label: 'Resorts', img: '/images/property-types/resorts.jpg' },
  { key: 'hotel', label: 'Hotels', img: '/images/property-types/hotels.jpg' },
  { key: 'guest_house', label: 'Guest Houses', img: '/images/property-types/guesthouses.jpg' },
]

// Hotel type counts (provided)
const HOTEL_TYPE_COUNTS: Record<string, number> = {
  bed_and_breakfast: 55,
  guest_house: 441,
  hotel: 262,
  resort: 144,
}

export function PropertyTypesCarousel() {
  const formatCount = (key: string) => {
    const c = HOTEL_TYPE_COUNTS[key] || 0
    return `${c} ${c === 1 ? 'Property' : 'Properties'}`
  }

  return (
    <section className="px-4 sm:px-6 lg:px-8 mt-8">
      <div className="max-w-7xl mx-auto bg-white rounded-md md:rounded-lg relative">
        {/* Header row */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-xl sm:text-m font-semibold text-gray-900">Explore Stays Across the Maldives</h3>
        </div>
        {/* Mobile carousel (<= md) */}
        <div className="md:hidden relative">
          {/* Gradient edges */}
          <div className="pointer-events-none absolute left-0 top-10 bottom-0 w-6 bg-gradient-to-r from-white to-transparent" />
            <div className="pointer-events-none absolute right-0 top-10 bottom-0 w-6 bg-gradient-to-l from-white to-transparent" />
          <Carousel className="px-1" viewportClassName="" containerClassName="pb-2 pr-2" options={{ loop: false, align: 'start', dragFree: true }}>
            {PROPERTY_TYPES.map(type => (
              <button key={type.key} className="group relative flex-shrink-0 w-[85%] max-w-[320px] outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-2xl overflow-hidden">
                <div className="relative h-56 w-full rounded-2xl overflow-hidden">
                  <Image
                    src={type.img}
                    alt={type.label}
                    fill
                    sizes="(max-width:768px) 85vw, 320px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-black/10 group-hover:ring-black/20" />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/10 to-black/90" />
                  <div className="absolute left-3 right-3 bottom-3 space-y-0.5">
                    <span className="text-xl text-left font-semibold text-white drop-shadow-sm leading-tight block truncate">{type.label}</span>
                    <span className="text-xs text-left font-semibold text-white/90 drop-shadow-sm leading-tight block truncate">{formatCount(type.key)}</span>
                  </div>
                </div>
              </button>
            ))}
          </Carousel>
        </div>

        {/* Desktop layout (>= md): grid of 4, no carousel */}
        <div className="hidden md:grid grid-cols-4 gap-5">
          {PROPERTY_TYPES.map(type => (
            <div key={type.key} className="group relative rounded-2xl overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
              <div className="relative h-72 w-full rounded-2xl overflow-hidden">
                <Image
                  src={type.img}
                  alt={type.label}
                  fill
                  sizes="(min-width:768px) 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-black/10 group-hover:ring-black/20" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/10 to-black/90" />
                <div className="absolute left-3 right-3 bottom-3 space-y-0.5">
                  <span className="text-m text-left font-semibold text-white drop-shadow-sm leading-tight block truncate">{type.label}</span>
                  <span className="text-xs text-left font-semibold text-white/90 drop-shadow-sm leading-tight block truncate">{formatCount(type.key)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PropertyTypesCarousel
