"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Gift, Star, Plane, Activity, Building, Percent } from "lucide-react"

export function PromotionalOffers() {
  const offers = [
    {
      id: 1,
      title: "Up to 10% off",
      subtitle: "First hotel booking",
      discount: "10%",
      icon: Building,
      color: "bg-orange-500",
      buttonText: "Collect",
    },
    {
      id: 2,
      title: "VIP Platinum trial",
      subtitle: "Up to 25% off",
      discount: "25%",
      icon: Star,
      color: "bg-gray-800",
      buttonText: "Use",
    },
    {
      id: 3,
      title: "Up to 10% off (App)",
      subtitle: "Flight booking",
      discount: "10%",
      icon: Plane,
      color: "bg-blue-500",
      buttonText: "Use",
    },
    {
      id: 4,
      title: "Up to 15% off (App)",
      subtitle: "Activities booking",
      discount: "15%",
      icon: Activity,
      color: "bg-green-500",
      buttonText: "Use",
    },
    {
      id: 5,
      title: "Up to 5% off",
      subtitle: "Second hotel booking",
      discount: "5%",
      icon: Building,
      color: "bg-purple-500",
      buttonText: "Use",
    },
    {
      id: 6,
      title: "Up to 7% off",
      subtitle: "Third hotel booking",
      discount: "7%",
      icon: Percent,
      color: "bg-teal-500",
      buttonText: "Use",
    },
  ]

  return (
    <section className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Gift className="w-6 h-6 text-black" />
            <h2 className="text-2xl font-bold text-black">Welcome gift pack!</h2>
            <Badge variant="secondary" className="bg-red-500 text-black border-0">
              New
            </Badge>
          </div>
          <Button
            variant="outline"
            className="text-black border-white hover:bg-white hover:text-blue-600 bg-transparent"
          >
            Explore more
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {offers.map((offer) => {
            const Icon = offer.icon
            return (
              <Card key={offer.id} className="bg-white hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2 rounded-lg ${offer.color}`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {offer.discount}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{offer.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{offer.subtitle}</p>
                  <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                    {offer.buttonText}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
