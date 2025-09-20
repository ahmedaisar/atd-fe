import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
// import { PromotionalOffers } from "@/components/promotional-offers"
// import { AdditionalServices } from "@/components/additional-services"
import { Footer } from "@/components/footer"
// import { AtollsCarousel } from "@/components/hotels/atolls-carousel" // Commented out per request
// import { LatestOffers } from "@/components/hotels/latest-offers" // Hottest Hotel Deals removed per request
import { PropertyTypesCarousel } from "@/components/property-types-carousel"
import TopRatedHotels from "@/components/hotels/top-rated-hotels"
import AboutUs from "@/components/about-us"
import { getAtollmvCache } from "@/lib/atollmv-cache"
import { buildAutoSuggestions } from "@/lib/hotels"
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Mapping moved into TopRatedHotels component

export default async function HomePage(props?: { searchParams?: any }) {
  // Use the server-side cached payload directly; do NOT perform any fetch from here.
  const { body } = getAtollmvCache()
  const rawItems: any[] = Array.isArray(body?.items) ? body!.items : []

  // Build autocomplete suggestions from cached hotel names (unique)
  const autoSuggestions = buildAutoSuggestions(rawItems)

  // Do not sort or limit on the server; TopRatedHotels will handle ordering and limiting on the client.
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection suggestions={autoSuggestions} />
        {/* <HomeSpecialOffersCards />      */}
        <PropertyTypesCarousel />
        {/* <LatestOffers /> */}
        <TopRatedHotels rawItems={rawItems} />
        {/* <PromotionalOffers />       */}
        {/* <AdditionalServices /> */}
        <AboutUs />
      </main>
      <Footer />
  
 
    
    </div>
  )
}
