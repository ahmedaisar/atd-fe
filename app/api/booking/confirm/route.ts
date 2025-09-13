import { NextRequest, NextResponse } from 'next/server'
import bookings from '@/data/fixtures/bookings.json'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body?.holdId) return NextResponse.json({ error: 'Missing holdId' }, { status: 400 })

  const reference = `AG${Math.random().toString(36).slice(2, 8).toUpperCase()}`
  const record = { reference, createdAt: new Date().toISOString(), holdId: body.holdId }

  // Note: not persisting to file; just echoing back
  return NextResponse.json({ reference, record })
}
