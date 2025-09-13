import { NextRequest, NextResponse } from 'next/server'

export async function GET(_req: NextRequest, { params }: { params: { reference: string } }) {
  // No persistence: return a mock booking payload for demo
  return NextResponse.json({
    reference: params.reference,
    hotelId: 'htl-reef-001',
    total: { amount: 640, currency: 'USD' },
    policy: 'Free cancellation before 3 days',
    summary: {
      hotelId: 'htl-reef-001',
      checkIn: new Date().toISOString().slice(0, 10),
      checkOut: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
      rooms: [{ roomTypeId: 'rm-reef-deluxe', rateId: 'rate-bb', quantity: 1 }],
    },
  })
}
