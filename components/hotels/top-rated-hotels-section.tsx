import TopRatedHotels from "@/components/hotels/top-rated-hotels"
import { getTopRatedFromCache } from "@/lib/get-top-rated-from-cache"

export default async function TopRatedHotelsSection() {
  const hotels = getTopRatedFromCache()
  return <TopRatedHotels hotels={hotels} />
}
