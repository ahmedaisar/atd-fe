import { Suspense } from "react"
import { SearchResultsHeader } from "@/components/search-results-header"
import { HotelListings } from "@/components/hotel-listings"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AdvancedSearchFilters } from "@/components/advanced-search-filters"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { SearchResultsSkeleton, FiltersSkeletonSidebar } from "@/components/search-results-skeleton"

// Types for search params and results
type HotelSearchParams = {
  destination?: string
  destinationId?: string
  checkIn?: string
  checkOut?: string
  adults?: string
  children?: string
  childrenAges?: string
  rooms?: string
  page?: string
  pageSize?: string  // Added for API compatibility
  sort?: string
  minStar?: string
  maxPrice?: string
  amenity?: string[]
  freeCancellation?: string
  payAtProperty?: string
  instantConfirmation?: string
  distanceFromCenter?: string
}

async function fetchHotels(searchParams: HotelSearchParams) {
  // Convert searchParams object to URLSearchParams
  const params = new URLSearchParams()
  
  Object.entries(searchParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(v => params.append(key, v))
    } else if (value !== undefined) {
      params.append(key, value)
    }
  })
  
  // Add a small artificial delay to demonstrate the streaming
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Fetch from the API - using absolute URL for SSR
  const url = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/search/hotels?${params.toString()}`
  const res = await fetch(url, { cache: 'no-store' }) // Don't cache so we get fresh results
  
  if (!res.ok) {
    throw new Error(`Error fetching hotels: ${res.status}`)
  }
  
  // Map API response to expected structure for HotelListings and filters
  const apiRes = await res.json();
  // Defensive: handle both new and legacy API shapes
  if (apiRes && apiRes.data && Array.isArray(apiRes.data.records)) {
    return {
      items: apiRes.data.records,
      total: apiRes.data.records.length,
      pages: 1 // TODO: add real pagination if needed
    };
  }
  return { items: [], total: 0, pages: 1 };
}

// Server Component for hotel results
async function HotelResults({ searchParams }: { searchParams: HotelSearchParams }) {
  const { destination, destinationId, sort = 'recommended', page = '1' } = searchParams
  
  const results = await fetchHotels(searchParams)
  
  return (
    <HotelListings 
      initialHotels={results.items} 
      initialSort={sort} 
      destinationLabel={destination || destinationId || 'All Destinations'} 
      totalCount={results.total}
      page={Number(page)}
      totalPages={results.pages}
    />
  )
}

// Server Component for filters sidebar
async function FiltersSidebar({ searchParams }: { searchParams: HotelSearchParams }) {
  // Get the total count and filters from API
  const results = await fetchHotels({ 
    ...searchParams,
    page: '1', 
    pageSize: '1' // Just need the count, not all results
  })
  // Fetch filters from the API directly (simulate as in /api/search/hotels)
  const url = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/search/hotels`;
  const res = await fetch(url, { cache: 'no-store' });
  const apiRes = await res.json();
  const filters = apiRes?.data?.filters || {};
  return (
    <AdvancedSearchFilters
      resultsCount={results.total}
      initialFilters={searchParams}
      filters={filters}
    />
  )
}

export default async function SearchResultsPage({ 
  searchParams 
}: { 
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  // Await the searchParams in Next.js 15
  const params = await searchParams
  
  // Type-safe search params
  const typedParams: HotelSearchParams = {
    destination: params.destination as string | undefined,
    destinationId: params.destinationId as string | undefined,
    checkIn: params.checkIn as string | undefined,
    checkOut: params.checkOut as string | undefined,
    adults: params.adults as string | undefined,
    children: params.children as string | undefined,
    childrenAges: params.childrenAges as string | undefined,
    rooms: params.rooms as string | undefined,
    page: params.page as string | undefined,
    sort: params.sort as string | undefined,
    minStar: params.minStar as string | undefined,
    maxPrice: params.maxPrice as string | undefined,
    amenity: params.amenity as string[] | undefined,
    freeCancellation: params.freeCancellation as string | undefined,
    payAtProperty: params.payAtProperty as string | undefined,
    instantConfirmation: params.instantConfirmation as string | undefined,
    distanceFromCenter: params.distanceFromCenter as string | undefined,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <SearchResultsHeader />
        {/* Mobile filters trigger */}
        <div className="lg:hidden sticky top-0 z-30 bg-gray-50/80 backdrop-blur supports-[backdrop-filter]:bg-gray-50/60 border-b">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full">Filters</Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:max-w-md p-0">
                <SheetHeader className="px-4 py-3 border-b">
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="h-[calc(100vh-56px)] overflow-auto p-4">
                  <Suspense fallback={<FiltersSkeletonSidebar />}>
                    <FiltersSidebar searchParams={typedParams} />
                  </Suspense>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <aside className="hidden lg:block lg:w-80 flex-shrink-0">
              <Suspense fallback={<FiltersSkeletonSidebar />}>
                <FiltersSidebar searchParams={typedParams} />
              </Suspense>
            </aside>
            <div className="flex-1">
              <Suspense fallback={<SearchResultsSkeleton />}>
                <HotelResults searchParams={typedParams} />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
