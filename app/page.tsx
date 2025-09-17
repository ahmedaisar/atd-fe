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
// no headers needed; build API base from env or localhost



async function getTopRatedFromApi(): Promise<TopRatedHotel[]> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const url = `${base}/api/merged-hotels?toa=resort&stars=5&minQuality=90&maxQuality=99&limit=15`
  try {
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) return []
    const data = await res.json() as { items?: any[] }
    const items = Array.isArray(data?.items) ? data.items : []
    // Keep only hotels that have a discount >= 1
    const filtered = items.filter((it: any) => {
      const b = it?.base || {}
      const d = it?.details || {}
      const primary = d?.data?.records?.[0]?.discount
      let n = Number.parseFloat(String(primary))
      if (Number.isNaN(n)) {
        const fallback = d?.discount ?? b?.discount ?? d?.hero_offer?.discount ?? b?.hero_offer?.discount
        n = Number.parseFloat(String(fallback))
      }
      return !Number.isNaN(n) && n >= 1
    })

    const mapped: TopRatedHotel[] = filtered.map((it: any) => {
      const b = it?.base || {}
      const d = it?.details || {}
      const id = String(b.hs_id ?? it?.id ?? d.hs_id ?? '')
      const name = b.name ?? d.name ?? 'Unnamed Hotel'
      const slug = b.slug ?? d.slug ?? id
      const imgId = b.images?.[0]?.image_id ?? d.images?.[0]?.image_id
      const heroImage = imgId ? `//img1.hotelscan.com/640_440/1/${imgId}.jpg` : '/images/hotels/placeholder.jpg'
      const hotelStars = b.stars ?? d.stars ?? 0
      const qualityReviewRating = b.quality?.review_rating ?? d.quality?.review_rating ?? b.review_rating ?? d.review_rating ?? 0
      const qualityReviewCount = b.quality?.review_count ?? d.quality?.review_count ?? b.review_count ?? d.review_count ?? 0
      const location = b.location?.address || b.location?.city || d.location?.address || d.location?.city || 'Maldives'
      const price = Number(d.best_offer ?? b.best_offer ?? d.hero_offer?.price ?? 0) || 0
      const currency = '$'
      const badge = hotelStars >= 5 ? 'Luxury' : hotelStars >= 4 ? 'Popular' : undefined
  const hero_offer = d.hero_offer ?? b.hero_offer
  // Choose discount prioritizing details.data.records[0].discount
  const primaryDisc = d?.data?.records?.[0]?.discount
  let discountNum = Number.parseFloat(String(primaryDisc))
  if (Number.isNaN(discountNum)) {
    const fb = d?.discount ?? b?.discount ?? d?.hero_offer?.discount ?? b?.hero_offer?.discount
    discountNum = Number.parseFloat(String(fb))
  }
  const discount = Number.isNaN(discountNum) ? 0 : discountNum
      const short_description = d.short_description ?? b.short_description
      return { id, name, slug, heroImage, hotelStars, qualityReviewRating, qualityReviewCount, location, price, currency, badge, hero_offer, discount, short_description }
    })
    return mapped
  } catch {
    return []
  }
}

export default async function HomePage() {
  const sampleTopRated = await getTopRatedFromApi()
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
       
        {/* Membership Sign-in Full Width Card */}
        <section className="px-4 sm:px-6 lg:px-8 mt-10">
          <div className="max-w-7xl mx-auto">
            <div className="bg-black-100 rounded-xl flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 px-5 sm:px-8 py-5 md:py-6 shadow-sm">
              <div className="flex items-center gap-4 md:gap-5 w-full md:w-auto">
                <div className="h-8 w-8 sm:h-12 sm:w-12 md:h-11 md:w-11 rounded-lg flex items-center justify-center text-xl font-bold bg-gold-100-sm sm:bg-gold-100 hover:bg-gold-100-hover text-white-100 shrink-0">★</div>

                <div className="flex-1">
                  <h3 className="text-[15px] capitalize sm:text-base md:text-[18px] font-bold tracking-tight text-gold-900 leading-snug">Sign in to access Atoll Direct Member Prices</h3>
                  <p className="text-xs sm:text-sm text-white-800 mt-1 font-bold leading-snug hidden sm:block">Exclusive savings on selected hotels in the Maldives!</p>
                </div>
              </div>
                <div className="w-full md:w-auto flex md:justify-end md:ml-auto">
                <button className="inline-flex w-full md:w-auto items-center justify-center rounded-lg bg-gold-100-sm sm:bg-gold-100 hover:bg-gold-100-hover text-white text-xs sm:text-sm font-medium h-9 sm:h-10 px-5 sm:px-6 shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 transition-colors">Sign in</button>
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
