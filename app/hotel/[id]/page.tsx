import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HotelImageGallery } from "@/components/hotel-image-gallery"
import { HotelInfo } from "@/components/hotel-info"
import { PriceComparison } from "@/components/price-comparison"
import { HotelAmenities } from "@/components/hotel-amenities"
import { HotelReviews } from "@/components/hotel-reviews"
import { HotelLocation } from "@/components/hotel-location"
import { BookingWidget } from "@/components/booking-widget"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { notFound } from "next/navigation"

async function getHotel(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/hotels/${id}`, {
    cache: 'no-store' // Fresh data for each request
  })
  
  if (!res.ok) {
    if (res.status === 404) {
      notFound()
    }
    throw new Error('Failed to fetch hotel data')
  }
  
  return res.json()
}

export default async function HotelDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const hotelData = await getHotel(id)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main>
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 py-3">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/search">
                    {hotelData.location?.city || 'Hotels'}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{hotelData.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <HotelImageGallery images={hotelData.images} hotelName={hotelData.name} />
              <HotelInfo hotel={hotelData} />
              <PriceComparison hotelId={id} />
              <HotelAmenities amenities={hotelData.amenitiesDetailed} />
              <HotelReviews />
              <HotelLocation hotel={hotelData} />
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <BookingWidget hotel={{...hotelData, id}} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
