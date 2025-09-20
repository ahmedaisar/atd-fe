"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, ShoppingCart, User, Globe } from "lucide-react"
import Link from "next/link"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <img 
              src="/logo.svg" 
              alt="Atoll Discovery Maldives" 
              className="h-16 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          {/* <nav className="hidden md:flex items-center space-x-8">
            <Link href="/hotels" className="text-gray-700 hover:text-blue-600 font-medium">
              Hotels
            </Link>
             <Link href="/flights" className="text-gray-700 hover:text-blue-600 font-medium">
              Flights
            </Link> 
            <Link href="/packages" className="text-gray-700 hover:text-blue-600 font-medium">
              Packages
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 font-medium">
              About
            </Link>
          </nav> */}

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-gray-700">
              <Globe className="w-4 h-4 mr-2" />
              EN
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-700">
              USD
            </Button>
            {/* <Button variant="ghost" size="sm" className="text-gray-700">
              <ShoppingCart className="w-4 h-4" />
            </Button> */}
            <Button variant="ghost" size="sm" className="text-gray-700">
              <User className="w-4 h-4 mr-2" />
              Sign In
            </Button>
            <Button size="sm" className="bg-gold-100-sm  hover:bg-gold-100-hover">
              Register
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg border-t">
            <nav className="px-4 py-4 space-y-4">
              <Link href="/hotels" className="block text-gray-700 hover:text-blue-600 font-medium">
                Hotels
              </Link>
              <Link href="/flights" className="block text-gray-700 hover:text-blue-600 font-medium">
                Maldives
              </Link>
              <Link href="/activities" className="block text-gray-700 hover:text-blue-600 font-medium">
                Company
              </Link>
              <Link href="/car-rental" className="block text-gray-700 hover:text-blue-600 font-medium">
                Contact
              </Link>
              <div className="pt-4 border-t space-y-2">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
                <Button className="w-full bg-gold-100-sm  hover:bg-gold-100-hover">Register</Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
