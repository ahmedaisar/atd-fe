"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ChevronRight, Check } from "lucide-react"
import type { Offer } from "@/types/price-aggregator"

export type OfferRowProps = {
  offer: Offer
  nights?: number
  currency?: string
  totalFromVendorCount?: number
  isHighlighted?: boolean
  className?: string
  onBookClick: (offer: Offer) => void
}

const formatCurrency = (amount: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount)

const includesBreakfast = (o: Offer) => !!(o.offer_flags_new && o.offer_flags_new.breakfast)
const isRefundable = (o: Offer) => !!(o.offer_flags_new && (o.offer_flags_new.refundable || o.free_cancellation))

export function OfferRow({ offer, nights = 1, currency = "USD", totalFromVendorCount = 1, isHighlighted = false, className, onBookClick }: OfferRowProps) {
  const total = (offer.price || 0) * nights

  return (
    <div
      className={cn(
        "rounded-lg border p-4 md:p-5 transition-colors",
        isHighlighted
          ? "bg-green-50/80 border-green-200 shadow-[inset_0_0_0_1px_rgba(22,163,74,0.15)]"
          : "bg-white border-gray-200",
        className
      )}
    >
      <div className="flex items-start gap-4">
        {/* Left: Logo + meta */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3">
            <div className="w-10 h-7 md:w-12 md:h-8 relative bg-gray-50 border border-gray-200 rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
              <Image
                src={offer.partner_logo}
                alt={offer.partner_name}
                width={48}
                height={32}
                className="object-contain"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-gray-900 font-medium text-sm md:text-base truncate">
                <span className="truncate">{offer.partner_name}</span>
                {isHighlighted && (
                  <span className="text-[11px] md:text-xs px-2 py-0.5 rounded-full border border-rose-300 text-rose-600 bg-rose-50">
                    Our lowest price
                  </span>
                )}
              </div>
              <div className="text-xs md:text-sm text-gray-600 mt-0.5 truncate">{offer.room_name}</div>
              <div className="flex items-center gap-2 text-xs text-gray-700 mt-2">
                {includesBreakfast(offer) && (
                  <span className="inline-flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-600"/>Breakfast included</span>
                )}
                {isRefundable(offer) && (
                  <span className="inline-flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-600"/>Free cancellation</span>
                )}
              </div>

              {totalFromVendorCount > 1 && (
                <button className="mt-3 text-sm text-sky-700 hover:underline inline-flex items-center">
                  <span className="truncate">Show {totalFromVendorCount - 1} more prices from {offer.partner_name}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right: Price + CTA */}
        <div className="shrink-0 text-right flex flex-col items-end gap-2">
          <div className="text-xl md:text-2xl font-bold text-gray-900">{formatCurrency(offer.price, currency)}</div>
          <div className="text-[11px] md:text-xs text-gray-600">
            {nights} {nights === 1 ? "night" : "nights"} for {formatCurrency(total, currency)}
          </div>
          <div className="text-[10px] md:text-[11px] text-gray-500">Includes all fees (excludes taxes)</div>
          <Button onClick={() => onBookClick(offer)} className="mt-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-4 md:px-5 py-1.5 md:py-2 flex items-center gap-2">
            Visit site <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default OfferRow
