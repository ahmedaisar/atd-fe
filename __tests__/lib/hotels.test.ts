import { describe, it, expect } from 'vitest'
import { mapAtollToTopRated } from '@/lib/hotels'

describe('mapAtollToTopRated', () => {
  it('maps minimal item with base fields', () => {
    const items = [{ id: '123', base: { name: 'Test Hotel', images: [{ image_id: 'img1' }], quality: { stars: 5, review_rating: 95, review_count: 120 } }, details: null }]
    const out = mapAtollToTopRated(items)
    expect(out).toHaveLength(1)
    expect(out[0]).toMatchObject({ id: '123', name: 'Test Hotel', stars: 5, qualityReviewRating: 95, qualityReviewCount: 120 })
    expect(out[0].heroImage).toContain('img1')
  })

  it('handles missing ratings and images gracefully', () => {
    const items = [{ id: '1', base: { name: 'No Rating' }, details: {} }]
    const out = mapAtollToTopRated(items)
    expect(out[0].qualityReviewRating).toBe(0)
    expect(out[0].heroImage).toContain('placeholder')
  })

  it('extracts discount from nested records when available', () => {
    const items = [{ id: '2', base: { name: 'Disc Hotel' }, details: { data: { records: [{ discount: 12.3 }] } } }]
    const out = mapAtollToTopRated(items)
    expect(Number(out[0].discount)).toBeCloseTo(12.3)
  })
})
