"use client"

import { OfferImage } from "./offer-image"

export function HomeSpecialOffersCards() {
  return (
    <>
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
    </>
  )
}

export default HomeSpecialOffersCards