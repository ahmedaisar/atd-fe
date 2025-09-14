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
    <section className="relative  lg:h-[400px] bg-[url('/mv-header.jpg')] bg-cover text-white">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="text-center mb-8">
          <h1 className="text-2xl lg:text-4xl font-bold mb-2 text-shadow-lg">Same Destination, Better Rates</h1>
          <p className="text-1xs lg:text-xl font-bold text-white-100 text-shadow-lg max-w-2xl mx-auto ">Search, compare & book at the best prices!</p>
        </div>

        {/* Search Tabs */}
        <div className="max-w-4xl mx-3 lg:mx-auto">
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
