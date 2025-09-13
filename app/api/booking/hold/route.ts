import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })

  // In-memory style response (no persistence yet)
  const holdId = `hold_${Math.random().toString(36).slice(2, 10)}`
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString()
  return NextResponse.json({ holdId, expiresAt })
}
