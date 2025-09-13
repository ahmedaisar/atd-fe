import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })

  // Fake validation
  const ok = body?.guest?.email && body?.card?.number && body?.billing?.country
  if (!ok) return NextResponse.json({ success: false, message: 'Validation failed' }, { status: 400 })

  // Randomly fail 10% of the time
  if (Math.random() < 0.1) return NextResponse.json({ success: false, message: 'Payment failed' }, { status: 402 })

  return NextResponse.json({ success: true })
}
