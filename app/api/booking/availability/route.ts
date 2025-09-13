import { NextRequest, NextResponse } from 'next/server'
import rooms from '@/data/fixtures/rooms.json'
import { simulatePriceFluctuation } from '@/lib/api-utils'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })

  const { hotelId, rooms: selections } = body || {}
  const rec = (rooms as any[]).find((r) => r.hotelId === hotelId)
  if (!rec) return NextResponse.json({ hotelId, availability: [] })

  const availability = selections.map((sel: any) => {
    const room = rec.rooms.find((rm: any) => rm.id === sel.roomTypeId)
    const rate = room?.rates.find((rt: any) => rt.id === sel.rateId)
    if (!room || !rate) return { ...sel, available: false }
    const newPrice = simulatePriceFluctuation(rate.pricePerNight, 0.08)
    const priceChanged = newPrice !== rate.pricePerNight
    return {
      ...sel,
      available: rate.availability > 0,
      pricePerNight: newPrice,
      currency: rate.currency,
      priceChanged,
    }
  })

  return NextResponse.json({ hotelId, availability })
}
