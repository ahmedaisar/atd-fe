"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function HotelCardSkeleton({ viewMode = "list" }: { viewMode?: "list" | "grid" }) {
  if (viewMode === "grid") {
    return (
      <Card className="overflow-hidden">
        <div className="relative">
          <Skeleton className="h-48 w-full" />
        </div>
        <CardContent className="p-4">
          <div className="space-y-3">
            <Skeleton className="h-6 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex flex-wrap gap-1">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-20" />
            </div>
            <div className="flex items-end justify-between pt-3 border-t">
              <div>
                <Skeleton className="h-6 w-16" />
              </div>
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // List view skeleton
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <Skeleton className="md:w-80 h-60 md:h-full flex-shrink-0" />
          <div className="flex-1 p-6">
            <div className="flex flex-col h-full">
              <div className="flex-1 space-y-4">
                <div>
                  <Skeleton className="h-7 w-4/5 mb-2" />
                  <Skeleton className="h-5 w-3/5 mb-2" />
                  <div className="flex items-center space-x-2 mb-3">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-24" />
                </div>
                <div className="flex flex-wrap gap-4 mb-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-5 w-24" />
                  ))}
                </div>
              </div>
              <div className="flex items-end justify-between pt-4 border-t">
                <div className="space-y-1">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-12 w-32" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}