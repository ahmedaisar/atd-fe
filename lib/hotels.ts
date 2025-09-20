import type { TopRatedHotel } from '@/types/hotels'

type Any = any

export function mapAtollToTopRated(items: Any[]): TopRatedHotel[] {
  return (Array.isArray(items) ? items : []).map((it: Any) => {
    const b = it?.base || {}
    const d = it?.details || {}
    const id = String(b.hs_id ?? it?.id ?? d?.hs_id ?? b.id ?? d.id ?? '')
    const name = b.name ?? d.name ?? 'Unnamed Hotel'
    const slug = b.slug ?? d.slug ?? id
    const imgId = b.images?.[0]?.image_id ?? d.images?.[0]?.image_id
    const heroImage = imgId ? `//img1.hotelscan.com/640_440/1/${imgId}.jpg` : '/images/hotels/placeholder.jpg'
  const hotelStars = Number(b.quality?.stars ?? d.quality?.stars ?? b.stars ?? d.stars ?? 0) || 0
    const qualityReviewRating = Number(b.quality?.review_rating ?? d.quality?.review_rating ?? b.review_rating ?? d.review_rating ?? 0) || 0
    const qualityReviewCount = Number(b.quality?.review_count ?? d.quality?.review_count ?? b.review_count ?? d.review_count ?? 0) || 0
    const location = b.location?.address || b.location?.city || d.location?.address || d.location?.city || 'Maldives'
    const price = Number(d.hero_offer?.price ?? d.best_offer ?? b.best_offer ?? 0) || 0
    const currency = '$'
    const badge = hotelStars >= 5 ? 'Luxury' : hotelStars >= 4 ? 'Popular' : undefined
    // Ensure hero_offer is present if we have a valid price, so downstream filters see a priced offer
    const hero_offer = (d.hero_offer ?? b.hero_offer) ?? (price > 0 ? { price, currency } : undefined)
    const primaryDisc = d?.data?.records?.[0]?.discount
    let discountNum = Number.parseFloat(String(primaryDisc))
    if (Number.isNaN(discountNum)) {
      const fb = d?.discount ?? b?.discount ?? d?.hero_offer?.discount ?? b?.hero_offer?.discount
      discountNum = Number.parseFloat(String(fb))
    }
    const discount = Number.isNaN(discountNum) ? 0 : discountNum
    const short_description = d.short_description ?? b.short_description
    const toa = b.toa ?? d.toa ?? b.type ?? d.type ?? b.category ?? d.category
    return { id, name, slug, heroImage, stars: hotelStars, qualityReviewRating, qualityReviewCount, location, price, currency, badge, hero_offer, discount, short_description, toa }
  })
}

export function buildAutoSuggestions(rawItems: Any[]): Array<{ id: string; name: string; country: string }> {
  const seenNames = new Set<string>()
  return (Array.isArray(rawItems) ? rawItems : [])
    .map((it: Any) => {
      const b = it?.base || {}
      const d = it?.details || {}
      const id = String(b.hs_id ?? it?.id ?? d.hs_id ?? b.id ?? d.id ?? '')
      const name = String(b.name ?? d.name ?? '').trim()
      const country = String(b?.location?.country ?? d?.location?.country ?? 'Maldives')
      return { id, name, country }
    })
    .filter((s) => !!s.name)
    .filter((s) => {
      const key = s.name.toLowerCase()
      if (seenNames.has(key)) return false
      seenNames.add(key)
      return true
    })
    .slice(0, 500)
}

export function filterHotelsWithPricedHeroOffer<T extends { hero_offer?: any }>(arr: T[]): T[] {
  return (arr || []).filter(h => {
    const p = Number(h?.hero_offer?.price)
    return Number.isFinite(p) && p > 0
  })
}
