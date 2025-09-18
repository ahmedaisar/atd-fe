"use client"
import React from 'react'

export function AboutUs() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 mt-12 mb-10">{/* spacing tuned to match visual */}
      <div className="max-w-7xl mx-auto">
        <div
          className="rounded-2xl border border-black/10 bg-gradient-to-r from-indigo-50 via-rose-50 to-amber-50 shadow-sm overflow-hidden"
        >
          {/* Top row: three feature columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-black/10">
            <Feature
              icon={
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="text-gray-900">
                  <path d="M3 9h18"/>
                  <rect x="4" y="9" width="16" height="10" rx="2"/>
                  <path d="M8 9V7a4 4 0 0 1 8 0v2"/>
                </svg>
              }
              title="We find exclusive deals"
              subtitle="with discounts up to 45%"
            />
            <Feature
              icon={
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="text-gray-900">
                  <path d="M12 2l2.39 4.84 5.34.78-3.86 3.76.91 5.32L12 14.77 7.22 16.7l.91-5.32L4.27 7.62l5.34-.78L12 2z"/>
                </svg>
              }
              title="And compare top travel sites"
              subtitle="like Expedia and Agoda"
            />
            <Feature
              icon={
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="text-gray-900">
                  <path d="M7 21V10M12 21V6M17 21V14"/>
                  <path d="M3 21h18"/>
                </svg>
              }
              title="Then you book the best"
              subtitle="with us or another site"
            />
          </div>

          {/* Bottom callout row */}
          <div className="bg-white/40 backdrop-blur-[1px]">
            <div className="px-5 sm:px-8 py-5 md:py-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <h4 className="text-[15px] sm:text-base md:text-[18px] font-semibold tracking-tight text-gray-900">
                  Access our best deals on our app
                </h4>
                <div className="flex items-center gap-3">
                  <AppStoreBadge />
                  <PlayStoreBadge />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Feature({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="p-6 sm:p-8 flex items-start gap-4">
      <div className="h-11 w-11 rounded-xl bg-white/80 text-gray-900 flex items-center justify-center shadow-sm">
        {icon}
      </div>
      <div>
        <div className="text-[15px] sm:text-base font-semibold text-gray-900 leading-snug">{title}</div>
        <div className="text-xs sm:text-[13px] text-gray-600 mt-1 leading-snug">{subtitle}</div>
      </div>
    </div>
  )
}

function AppStoreBadge() {
  return (
    <a
      href="#"
      className="group inline-flex items-center gap-2 rounded-lg bg-black text-white h-10 px-3 pl-3.5 shadow transition-transform hover:scale-[1.01]"
      aria-label="Download on the App Store"
    >
      {/* Apple logo */}
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="opacity-90">
        <path d="M19.67 17.79c-.33.78-.72 1.48-1.18 2.08-.63.79-1.15 1.34-1.54 1.65-.62.57-1.28.86-1.97.87-.5 0-1.1-.14-1.81-.42-.71-.28-1.37-.42-1.98-.42-.62 0-1.3.14-2.05.42-.75.28-1.35.43-1.8.44-.67.03-1.34-.28-2.02-.92-.43-.37-.99-1.01-1.66-1.93-.71-1-.1-2.47.53-3.28.35-.45.78-.8 1.28-1.05.5-.25 1.04-.39 1.61-.43.49-.04 1.06.1 1.72.42.66.32 1.09.48 1.3.48.15 0 .6-.17 1.34-.51.72-.33 1.39-.47 2.01-.42.75.06 1.39.26 1.92.6-.76.46-1.26 1.11-1.48 1.96-.22.86-.11 1.67.34 2.42.24.42.56.8.96 1.13.4.33.83.54 1.29.62.03 0 .1.01.22.03zm-3.6-13.98c0 .66-.24 1.27-.71 1.83-.57.68-1.25 1.07-2.01 1.01-.02-.08-.03-.16-.03-.23 0-.64.28-1.31.77-1.89.25-.3.56-.56.92-.78.36-.22.72-.34 1.08-.37.01.14.02.28.02.43z"/>
      </svg>
      <div className="leading-tight">
        <div className="text-[10px] tracking-wide opacity-80">Download on the</div>
        <div className="text-sm font-semibold -mt-0.5">App Store</div>
      </div>
    </a>
  )
}

function PlayStoreBadge() {
  return (
    <a
      href="#"
      className="group inline-flex items-center gap-2 rounded-lg bg-black text-white h-10 px-3 shadow transition-transform hover:scale-[1.01]"
      aria-label="Get it on Google Play"
    >
      {/* Google Play glyph */}
      <svg width="18" height="18" viewBox="0 0 512 512" fill="currentColor" className="opacity-90">
        <path d="M325.3 234.3L104.5 13.5c-6.2-6.2-16.9-1.8-16.9 7v471c0 8.8 10.7 13.2 16.9 7l220.8-220.8c9.4-9.4 9.4-24.6 0-33.9zM353.1 206.5l68.4-39.5c10.9-6.3 24.5 1.6 24.5 14.1v149.9c0 12.5-13.6 20.3-24.5 14.1l-68.4-39.5-27.8-16.1c-4.7-2.7-10.5-2.7-15.2 0l-24.6 14.2"/>
      </svg>
      <div className="leading-tight">
        <div className="text-[10px] tracking-wide opacity-80">GET IT ON</div>
        <div className="text-sm font-semibold -mt-0.5">Google Play</div>
      </div>
    </a>
  )
}

export default AboutUs
