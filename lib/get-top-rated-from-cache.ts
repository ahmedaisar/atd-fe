import { getAtollmvCache } from '@/lib/atollmv-cache'
import type { TopRatedHotel } from '@/types/hotels'
import { mapAtollToTopRated, filterHotelsWithPricedHeroOffer } from '@/lib/hotels'

export function getTopRatedFromCache(): TopRatedHotel[] {
  const { body } = getAtollmvCache()
  const items = Array.isArray(body?.items) ? body!.items : []
  return filterHotelsWithPricedHeroOffer(mapAtollToTopRated(items)).slice(0, 15)
}
