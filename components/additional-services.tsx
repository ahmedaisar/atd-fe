import { Button } from "@/components/ui/button"
import { Car, Bus, Train, Ship, Plane } from "lucide-react"

export function AdditionalServices() {
  const services = [
    {
      id: 1,
      title: "Airport Transfer",
      icon: Plane,
      description: "Book reliable airport transfers",
    },
    {
      id: 2,
      title: "Car Rental",
      icon: Car,
      description: "Rent a car for your trip",
    },
    {
      id: 3,
      title: "Buses",
      icon: Bus,
      description: "Find bus tickets",
    },
    {
      id: 4,
      title: "Trains",
      icon: Train,
      description: "Book train journeys",
    },
    {
      id: 5,
      title: "Ferries",
      icon: Ship,
      description: "Ferry bookings available",
    },
  ]

  return (
    <section className="bg-blue-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-4">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <Button
                key={service.id}
                variant="ghost"
                className="flex items-center space-x-3 text-white hover:bg-blue-800 px-6 py-3 h-auto"
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{service.title}</span>
              </Button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
