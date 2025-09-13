import { NextRequest, NextResponse } from 'next/server'
import reviews from '@/data/fixtures/reviews.json'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1', 10)
  const pageSize = parseInt(searchParams.get('pageSize') || '10', 10)

  const rec = (reviews as any[]).find((r) => r.hotelId === params.id)
  if (!rec) return NextResponse.json({ hotelId: params.id, overall: 0, categories: {}, reviews: [] })

  const start = (page - 1) * pageSize
  const end = start + pageSize
  const items = rec.reviews.slice(start, end)
  return NextResponse.json({
    hotelId: params.id,
    overall: rec.overall,
    categories: rec.categories,
    total: rec.reviews.length,
    page,
    pageSize,
    items,
  })
}
