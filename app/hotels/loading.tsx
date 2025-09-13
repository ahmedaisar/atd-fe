import { Skeleton } from "@/components/ui/skeleton"

export default function HotelsLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Skeleton className="h-6 w-64" />
        </div>
      </div>

      {/* Hero Skeleton */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Skeleton className="h-8 w-48 mx-auto mb-6 bg-white/20" />
          <Skeleton className="h-12 w-96 mx-auto mb-4 bg-white/20" />
          <Skeleton className="h-6 w-128 mx-auto mb-8 bg-white/20" />

          <div className="bg-white/95 rounded-2xl p-6 max-w-4xl mx-auto mb-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
            <Skeleton className="h-12 w-full mt-4" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white/10 rounded-xl p-6">
                <Skeleton className="h-8 w-16 mx-auto mb-2 bg-white/20" />
                <Skeleton className="h-4 w-24 mx-auto bg-white/20" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Sections Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {Array.from({ length: 3 }).map((_, sectionIndex) => (
          <div key={sectionIndex} className="mb-16">
            <div className="text-center mb-12">
              <Skeleton className="h-6 w-32 mx-auto mb-4" />
              <Skeleton className="h-10 w-96 mx-auto mb-4" />
              <Skeleton className="h-6 w-128 mx-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, cardIndex) => (
                <div key={cardIndex} className="bg-white rounded-lg overflow-hidden shadow-sm">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
