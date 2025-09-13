"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { HotelCardSkeleton } from "@/components/hotel-card-skeleton"

export function SearchResultsSkeleton() {
  return (
    <>
      {/* Results Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-sm mb-6">
        <div>
          <Skeleton className="h-7 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>

        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-28" />
        </div>
      </div>

      {/* Hotel Cards Skeletons */}
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <HotelCardSkeleton key={i} />
        ))}
      </div>
    </>
  )
}

export function FiltersSkeletonSidebar() {
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <Skeleton className="h-5 w-48 mb-4" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </div>
        </CardContent>
      </Card>
      
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="py-4 px-6">
            <Skeleton className="h-5 w-40 mb-4" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </CardContent>
        </Card>
      ))}
      
      <Card>
        <CardContent className="p-4 flex flex-col items-center">
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-32" />
        </CardContent>
      </Card>
    </div>
  )
}