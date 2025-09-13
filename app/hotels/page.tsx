import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HotelsHero } from "@/components/hotels/hotels-hero"
import { LatestOffers } from "@/components/hotels/latest-offers"
import { TripTypeCarousel } from "@/components/hotels/trip-type-carousel"
import { AtollsCarousel } from "@/components/hotels/atolls-carousel"
import { FeaturedDestinations } from "@/components/hotels/featured-destinations"

export default function HotelsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <HotelsHero />
        <LatestOffers />
        <TripTypeCarousel />
        <AtollsCarousel />
        <FeaturedDestinations />
      </main>
      <Footer />
    </div>
  )
}
