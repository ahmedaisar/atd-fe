import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { PromotionalOffers } from "@/components/promotional-offers"
import { AdditionalServices } from "@/components/additional-services"
import { Footer } from "@/components/footer"
import { AtollsCarousel } from "@/components/hotels/atolls-carousel"
import { LatestOffers } from "@/components/hotels/latest-offers"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <AtollsCarousel />
        <PromotionalOffers />
        <LatestOffers />
        <AdditionalServices />
      </main>
      <Footer />
    </div>
  )
}
