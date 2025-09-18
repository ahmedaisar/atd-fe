import { getAtollmvCache } from '@/lib/atollmv-cache'
import type { TopRatedHotel } from '@/components/hotels/top-rated-hotels'

export function getTopRatedFromCache(): TopRatedHotel[] {
  const { body } = getAtollmvCache()
  const items = Array.isArray(body?.items) ? body!.items : []
  return items.slice(0, 15).map((it: any) => {
    const b = it?.base || {}
    const d = it?.details || {}
    const id = String(it?.id ?? b.hs_id ?? d.hs_id ?? '')
    const name = b.name ?? d.name ?? 'Unnamed Hotel'
    const slug = b.slug ?? d.slug ?? id
    const imgId = b.images?.[0]?.image_id ?? d.images?.[0]?.image_id
    const heroImage = imgId ? `//img1.hotelscan.com/640_440/1/${imgId}.jpg` : '/images/hotels/placeholder.jpg'
  const hotelStars = Number(b.quality?.stars ?? d.quality?.stars ?? b.stars ?? d.stars ?? 0) || 0
    const qualityReviewRating = Number(b.quality?.review_rating ?? d.quality?.review_rating ?? b.review_rating ?? d.review_rating ?? 0) || 0
    const qualityReviewCount = Number(b.quality?.review_count ?? d.quality?.review_count ?? b.review_count ?? d.review_count ?? 0) || 0
    const location = b.location?.address || b.location?.city || d.location?.address || d.location?.city || 'Maldives'
    const price = Number(d.best_offer ?? b.best_offer ?? d.hero_offer?.price ?? 0) || 0
    const currency = '$'
    const badge = hotelStars >= 5 ? 'Luxury' : hotelStars >= 4 ? 'Popular' : undefined
    const hero_offer = d.hero_offer ?? b.hero_offer
    const primaryDisc = d?.data?.records?.[0]?.discount
    let discountNum = Number.parseFloat(String(primaryDisc))
    if (Number.isNaN(discountNum)) {
      const fb = d?.discount ?? b?.discount ?? d?.hero_offer?.discount ?? b?.hero_offer?.discount
      discountNum = Number.parseFloat(String(fb))
    }
    const discount = Number.isNaN(discountNum) ? 0 : discountNum
    const short_description = d.short_description ?? b.short_description
    return { id, name, slug, heroImage, stars: hotelStars, qualityReviewRating, qualityReviewCount, location, price, currency, badge, hero_offer, discount, short_description }
  })
}
