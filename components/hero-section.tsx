"use client"

import { useState } from "react"
import { MapPin, Plane, Activity } from "lucide-react"
import { EnhancedSearch } from "@/components/enhanced-search"

export function HeroSection() {
  const [activeTab, setActiveTab] = useState("hotels")
  const [checkIn, setCheckIn] = useState<Date>()
  const [checkOut, setCheckOut] = useState<Date>()
  const [destination, setDestination] = useState("")

  const tabs = [
    { id: "hotels", label: "Hotels", icon: MapPin }
    // { id: "flights", label: "Flights", icon: Plane },
    // { id: "activities", label: "Activities", icon: Activity },
  ]

  return (
    <section className="relative bg-gradient-to-br from-blue-500 via-blue-600 to-teal-500 text-white">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-5xl font-bold mb-4">Same Destination, Better Rates</h1>
          <p className="text-lg lg:text-xl text-blue-100 max-w-2xl mx-auto">
            Search, Compare & book at the best prices!
          </p>
        </div>

        {/* Search Tabs */}
        <div className="max-w-4xl mx-auto">
          {/* <div className="flex flex-wrap justify-center mb-6">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-t-lg font-medium transition-colors ${
                    activeTab === tab.id ? "bg-white text-blue-600" : "bg-blue-600/50 text-white hover:bg-blue-600/70"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div> */}

          <EnhancedSearch />
        </div>
      </div>
    </section>
  )
}
