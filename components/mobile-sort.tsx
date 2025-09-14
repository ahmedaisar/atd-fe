"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { SortAsc } from "lucide-react"

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: "recommended", label: "Recommended" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Guest Rating" },
  { value: "star-rating", label: "Star Rating" },
  { value: "distance", label: "Distance" },
  { value: "review-count", label: "Most Reviewed" },
]

export function MobileSort() {
  const router = useRouter()
  const sp = useSearchParams()
  const pathname = usePathname()

  const current = sp.get("sort") || "recommended"

  const updateSort = (value: string) => {
    const params = new URLSearchParams(sp.toString())
    params.set("sort", value)
    // reset page when sort changes
    params.delete("page")
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-center">
          <SortAsc className="w-4 h-4 mr-2" />
          Sort
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {SORT_OPTIONS.map(opt => (
          <DropdownMenuItem key={opt.value} onClick={() => updateSort(opt.value)} className={current === opt.value ? "font-semibold" : ""}>
            {opt.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default MobileSort
