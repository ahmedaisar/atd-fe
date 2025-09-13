"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Home, Search, Heart, User, Menu, Bell, MapPin, Calendar, CreditCard } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function MobileNavigation() {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const pathname = usePathname()

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== "undefined") {
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
          setIsVisible(false)
        } else {
          setIsVisible(true)
        }
        setLastScrollY(window.scrollY)
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar)
      return () => {
        window.removeEventListener("scroll", controlNavbar)
      }
    }
  }, [lastScrollY])

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/search", icon: Search, label: "Search" },
    { href: "/favorites", icon: Heart, label: "Saved", badge: 3 },
    { href: "/bookings", icon: Calendar, label: "Trips" },
    { href: "/profile", icon: User, label: "Profile" },
  ]

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div
        className={`
        fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 
        transition-transform duration-300 md:hidden
        ${isVisible ? "translate-y-0" : "translate-y-full"}
      `}
      >
        <div className="grid grid-cols-5 h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={`
                    h-full w-full flex flex-col items-center justify-center space-y-1 rounded-none
                    ${isActive ? "text-blue-600 bg-blue-50" : "text-gray-600"}
                  `}
                >
                  <div className="relative">
                    <item.icon className="w-5 h-5" />
                    {item.badge && (
                      <Badge className="absolute -top-2 -right-2 h-4 w-4 p-0 text-xs bg-red-500">{item.badge}</Badge>
                    )}
                  </div>
                  <span className="text-xs font-medium">{item.label}</span>
                </Button>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Mobile Top Bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 md:hidden">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="p-2">
              <Menu className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-bold text-lg text-blue-600">Agoda</h1>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="p-2 relative">
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs bg-red-500">2</Badge>
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <MapPin className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Floating Action Button for Quick Search */}
      <div className="fixed bottom-20 right-4 z-40 md:hidden">
        <Link href="/search">
          <Button size="lg" className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg">
            <Search className="w-6 h-6" />
          </Button>
        </Link>
      </div>

      {/* Mobile Payment Quick Access */}
      <div className="fixed bottom-20 left-4 z-40 md:hidden">
        <Button size="sm" variant="outline" className="bg-white shadow-lg border-gray-300">
          <CreditCard className="w-4 h-4 mr-2" />
          Pay
        </Button>
      </div>

      {/* Bottom padding for mobile navigation */}
      <div className="h-16 md:hidden" />
    </>
  )
}
