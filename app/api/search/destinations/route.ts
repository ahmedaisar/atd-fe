import { NextRequest, NextResponse } from 'next/server'
import destinations from '@/data/fixtures/destinations.json'

function normalize(str: string) {
  return str.toLowerCase().normalize('NFKD')
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = (searchParams.get('q') || '').trim()
  const geoloc = searchParams.get('geoloc') === 'true'

  let results = destinations

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
      .sort((a: any, b: any) => b.score - a.score || b.popularityScore - a.popularityScore)
      .slice(0, 10)
  } else {
    // Popular suggestions fallback
    results = results.sort((a: any, b: any) => b.popularityScore - a.popularityScore).slice(0, 10)
  }

  // Geolocation mock: prioritize first result to have nearby flag
  // Geolocation mock: could reorder by proximity; for now, keep results as-is to preserve types

  return NextResponse.json(results)
}
