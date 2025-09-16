import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { PromotionalOffers } from "@/components/promotional-offers"
import { AdditionalServices } from "@/components/additional-services"
import { Footer } from "@/components/footer"
// import { AtollsCarousel } from "@/components/hotels/atolls-carousel" // Commented out per request
// import { LatestOffers } from "@/components/hotels/latest-offers" // Hottest Hotel Deals removed per request
import { PropertyTypesCarousel } from "@/components/property-types-carousel"
import { OfferImage } from "@/components/offer-image"
import TopRatedHotels, { TopRatedHotel } from "@/components/hotels/top-rated-hotels"
import hotelsData from '@/data/hotels-fetched.json'



// Build top rated hotels: only 5-star resorts with quality.review_rating >= 90
const sampleTopRated: TopRatedHotel[] = (hotelsData?.hotels || [])
  .filter(h => h.toa === 'resort' && h.stars === 5 && (h.quality?.review_rating ?? 0) >= 90 && h.best_offer)
  .sort((a,b) => ((b.quality?.review_rating ?? 0) - (a.quality?.review_rating ?? 0)) || ((b.quality?.review_count ?? 0) - (a.quality?.review_count ?? 0)))
  .slice(0, 15)
  .map(h => {
    const firstImgId = h.images?.[0]?.image_id
    const heroImage = firstImgId ? `//img1.hotelscan.com/640_440/1/${firstImgId}.jpg` : '/images/hotels/placeholder.jpg'
    const mapped: TopRatedHotel = {
      id: String(h.hs_id),
      name: h.name,
      slug: h.slug,
      heroImage,
      hotelStars: h.stars || 0,
      qualityReviewRating: h.quality?.review_rating ?? h.review_rating ?? 0,
      qualityReviewCount: h.quality?.review_count ?? h.review_count ?? 0,
      location: h.location?.address || h.location?.city || 'Maldives',
      price: Number(h.best_offer) || 0,
      currency: '$',
      badge: h.stars >= 5 ? 'Luxury' : h.stars >= 4 ? 'Popular' : undefined
    }
    return mapped
  })

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
       
        {/* Membership Sign-in Full Width Card */}
        <section className="px-4 sm:px-6 lg:px-8 mt-10">
          <div className="max-w-7xl mx-auto">
            <div className="bg-black-gradient rounded-xl flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 px-5 sm:px-8 py-5 md:py-6 shadow-sm">
              <div className="flex items-center gap-4 md:gap-5 w-full md:w-auto">
                <div className="h-12 w-12 rounded-lg bg-white flex items-center justify-center text-xl font-bold text-gold-900 shrink-0">★</div>
                <div className="flex-1">
                  <h3 className="text-[12px] uppercase sm:text-base md:text-[17px] font-bold tracking-tight text-white-900 leading-snug">Sign in to access Atoll Direct Member Prices</h3>
                  <p className="text-xs sm:text-sm text-white-800 mt-1 leading-snug hidden sm:block">Exclusive savings on selected hotels in the Maldives.</p>
                </div>
              </div>
              <div className="w-full md:w-auto flex md:justify-end">
                <button className="inline-flex w-full md:w-auto items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium h-9 sm:h-10 px-5 sm:px-6 shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 transition-colors">Sign in</button>
              </div>
            </div>
          </div>
        </section>
        {/* Special Offers Cards Row */}
        <section className="px-4 sm:px-6 lg:px-8 mt-6 mb-4">
          <div className="max-w-7xl mx-auto">
            {/* Mobile Carousel (one card at a time) */}
            <div className="block sm:hidden">
              <div className="relative">
          {/* Nav top right */}
          <div className="absolute top-2 right-2 z-10 flex items-center gap-2 bg-black/40 backdrop-blur px-2 py-1 rounded-full">
            <a href="#m-offer-1" className="h-2.5 w-2.5 rounded-full bg-white/70 hover:bg-white transition" aria-label="Go to offer 1"></a>
            <a href="#m-offer-2" className="h-2.5 w-2.5 rounded-full bg-white/30 hover:bg-white/70 transition" aria-label="Go to offer 2"></a>
            <a href="#m-offer-3" className="h-2.5 w-2.5 rounded-full bg-white/30 hover:bg-white/70 transition" aria-label="Go to offer 3"></a>
          </div>

          <div className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth gap-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {/* Slide 1 */}
            <div id="m-offer-1" className="min-w-full snap-start">
              <div className="group bg-black-gradient rounded-xl flex flex-col shadow-sm hover:shadow transition-all overflow-hidden">
                <OfferImage src="/images/offers/bundle-save.jpg" alt="Bundle & Save" aspect="aspect-[5/2]" radius="rounded-none" sizes="100vw" />
                <div className="p-5 flex flex-col flex-1">
            <h4 className="text-sm font-semibold text-white-900 leading-snug">You can Bundle & Save up to $974 with package deals!</h4>
            <p className="text-xs text-white-700 mt-2 mb-4 leading-snug">Explore flights + stays and get instant savings.</p>
            <div className="mt-auto flex items-center text-xs font-medium text-white-900">Explore packages <span className="ml-1">→</span></div>
                </div>
              </div>
            </div>
            {/* Slide 2 */}
            <div id="m-offer-2" className="min-w-full snap-start">
              <div className="group bg-black-gradient rounded-xl flex flex-col shadow-sm hover:shadow transition-all overflow-hidden">
                <OfferImage src="/images/offers/couples-special.jpg" alt="Couples Special Getaway" aspect="aspect-[5/2]" radius="rounded-none" sizes="100vw" />
                <div className="p-5 flex flex-col flex-1">
            <h4 className="text-sm font-semibold text-white-900 leading-snug">Get our best deals on flights with Price Drop Protection</h4>
            <p className="text-xs text-white-700 mt-2 mb-4 leading-snug">We refund the difference if the price drops.</p>
            <div className="mt-auto flex items-center text-xs font-medium text-white-900">Learn more <span className="ml-1">→</span></div>
                </div>
              </div>
            </div>
            {/* Slide 3 */}
            <div id="m-offer-3" className="min-w-full snap-start">
              <div className="group bg-black-gradient rounded-xl flex flex-col shadow-sm hover:shadow transition-all overflow-hidden">
                <OfferImage src="/images/offers/member-savings.jpg" alt="Member Savings" aspect="aspect-[5/2]" radius="rounded-none" sizes="100vw" />
                <div className="p-5 flex flex-col flex-1">
            <h4 className="text-sm font-semibold text-white-900 leading-snug">Members save 10% or more on over 100,000 hotels worldwide</h4>
            <p className="text-xs text-white-700 mt-2 mb-4 leading-snug">Unlock instant savings on select stays.</p>
            <div className="mt-auto flex items-center text-xs font-medium text-white-900">Treat yourself <span className="ml-1">→</span></div>
                </div>
              </div>
            </div>
          </div>
              </div>
            </div>

            {/* Desktop / Tablet Grid */}
            <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {/* Offer Card 1 */}
              <div className="group bg-black-gradient rounded-xl flex flex-col shadow-sm hover:shadow cursor-pointer transition-all overflow-hidden">
          <OfferImage src="/images/offers/bundle-save.jpg" alt="Bundle & Save" aspect="aspect-[5/2]" radius="rounded-none" sizes="(max-width:1024px) 50vw, 33vw" />
          <div className="p-6 flex flex-col flex-1">
            <h4 className="text-sm font-semibold text-white-900 leading-snug">You can Bundle & Save up to $974 with package deals!</h4>
            <p className="text-xs text-white-700 mt-2 mb-4 leading-snug">Explore flights + stays and get instant savings.</p>
            <div className="mt-auto flex items-center text-xs font-medium text-white-900">Explore packages <span className="ml-1">→</span></div>
          </div>
              </div>
              {/* Offer Card 2 */}
              <div className="group bg-black-gradient rounded-xl flex flex-col shadow-sm hover:shadow cursor-pointer transition-all overflow-hidden">
          <OfferImage src="/images/offers/couples-special.jpg" alt="Couples Special Getaway" aspect="aspect-[5/2]" radius="rounded-none" sizes="(max-width:1024px) 50vw, 33vw" />
          <div className="p-6 flex flex-col flex-1">
            <h4 className="text-sm font-semibold text-white-900 leading-snug">Get our best deals on flights with Price Drop Protection</h4>
            <p className="text-xs text-white-700 mt-2 mb-4 leading-snug">We refund the difference if the price drops.</p>
            <div className="mt-auto flex items-center text-xs font-medium text-white-900">Learn more <span className="ml-1">→</span></div>
          </div>
              </div>
              {/* Offer Card 3 */}
              <div className="group bg-black-gradient rounded-xl flex flex-col shadow-sm hover:shadow cursor-pointer transition-all overflow-hidden">
          <OfferImage src="/images/offers/member-savings.jpg" alt="Member Savings" aspect="aspect-[5/2]" radius="rounded-none" sizes="(max-width:1024px) 50vw, 33vw" />
          <div className="p-6 flex flex-col flex-1">
            <h4 className="text-sm font-semibold text-white-900 leading-snug">Members save 10% or more on over 100,000 hotels worldwide</h4>
            <p className="text-xs text-white-700 mt-2 mb-4 leading-snug">Unlock instant savings on select stays.</p>
            <div className="mt-auto flex items-center text-xs font-medium text-white-900">Treat yourself <span className="ml-1">→</span></div>
          </div>
              </div>
            </div>
          </div>
        </section>
        
  <PropertyTypesCarousel />
  {/* <LatestOffers /> */}
  <TopRatedHotels hotels={sampleTopRated} />
        {/* <PromotionalOffers />       */}
        <AdditionalServices />
       
      </main>
      <Footer />
    </div>
  )
}
