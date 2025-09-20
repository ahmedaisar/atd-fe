import { NextRequest, NextResponse } from 'next/server'
import { getJSON, setJSON } from '@/lib/server-cache'
import destinations from '@/data/fixtures/destinations.json'
import hotels from '@/data/fixtures/hotels.json'

function normalize(str: string) {
  return str.toLowerCase().normalize('NFKD')
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = (searchParams.get('q') || '').trim()
  const geoloc = searchParams.get('geoloc') === 'true'

  const key = `search:destinations:${searchParams.toString()}`
  const cached = await getJSON<any[]>(key)
  if (cached) return NextResponse.json(cached)

  // Build a unified list including Maldives hotels as individual selectable items (type: hotel)
  const maldivesHotels = (hotels as any[])
    .filter(h => h.location?.country === 'Maldives')
    .map(h => ({
      id: h.id,
      type: 'hotel',
      name: h.name,
      country: h.location.country,
      popularityScore: Math.round((h.review?.score || 0) * 10),
      image: h.images?.[0] || '/placeholder.jpg'
    }))

  let results: any[] = [...destinations as any[], ...maldivesHotels]

  if (q) {
    const nq = normalize(q)
    results = results
      .map((d: any) => ({
        ...d,
        score:
          (d.name && normalize(d.name).includes(nq) ? 2 : 0) +
          (d.country && normalize(d.country).includes(nq) ? 1 : 0) +
          (d.id && normalize(d.id).includes(nq) ? 0.5 : 0),
      }))
      .filter((d: any) => d.score > 0)
      .sort((a: any, b: any) => {
        // Maldives priority first
        const aM = a.country === 'Maldives' ? 1 : 0
        const bM = b.country === 'Maldives' ? 1 : 0
        if (aM !== bM) return bM - aM
        return b.score - a.score || b.popularityScore - a.popularityScore
      })
      .slice(0, 15)
  } else {
    // Popular suggestions fallback with Maldives first
    results = results
      .sort((a: any, b: any) => {
        const aM = a.country === 'Maldives' ? 1 : 0
        const bM = b.country === 'Maldives' ? 1 : 0
        if (aM !== bM) return bM - aM
        return b.popularityScore - a.popularityScore
      })
      .slice(0, 15)
  }

  // Geolocation mock: prioritize first result to have nearby flag
  // Geolocation mock: could reorder by proximity; for now, keep results as-is to preserve types

  // very short TTL for autocomplete (e.g., 30s)
  await setJSON(key, results, 30)
  return NextResponse.json(results)
}
