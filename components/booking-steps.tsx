import { Check } from "lucide-react"

interface BookingStepsProps {
  currentStep: number
}

const steps = [
  { id: 1, name: "Room Selection", description: "Choose your room" },
  { id: 2, name: "Guest Details", description: "Enter your information" },
  { id: 3, name: "Payment", description: "Complete your booking" },
  { id: 4, name: "Confirmation", description: "Booking confirmed" },
]

export function BookingSteps({ currentStep }: BookingStepsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <nav aria-label="Progress">
        <ol className="flex items-center justify-between">
          {steps.map((step, stepIdx) => (
            <li key={step.id} className={`relative ${stepIdx !== steps.length - 1 ? "flex-1" : ""}`}>
              <div className="flex items-center">
                <div className="relative flex items-center justify-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                      step.id < currentStep
                        ? "bg-blue-600 text-white"
                        : step.id === currentStep
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {step.id < currentStep ? <Check className="w-5 h-5" /> : step.id}
                  </div>
                </div>
                <div className="ml-4 min-w-0">
                  <p className={`text-sm font-medium ${step.id <= currentStep ? "text-blue-600" : "text-gray-500"}`}>
                    {step.name}
                  </p>
                  <p className="text-sm text-gray-500">{step.description}</p>
                </div>
              </div>
              {stepIdx !== steps.length - 1 && (
                <div className="absolute top-5 left-10 w-full h-0.5 bg-gray-200">
                  <div
                    className={`h-full transition-all duration-300 ${
                      step.id < currentStep ? "bg-blue-600 w-full" : "bg-gray-200 w-0"
                    }`}
                  />
                </div>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  )
}
