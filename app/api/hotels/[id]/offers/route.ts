import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import type { ApiResponse } from '@/types/price-aggregator';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params;
  // Load hotels from sample-api-response.json
  const filePath = process.cwd() + '/public/sample-api-response.json';
  const file = await fs.readFile(filePath, 'utf-8');
  const apiRes = JSON.parse(file);
  const hotels = apiRes.data?.records || [];
  const hotel = hotels.find((h: any) => String(h.hs_id) === id);
  if (!hotel || !hotel.offers || !Array.isArray(hotel.offers) || hotel.offers.length === 0) {
    return NextResponse.json({ error: 'Hotel offers not found' }, { status: 404 });
  }
  // Sort offers by price (ascending)
  const sortedOffers = [...hotel.offers].sort((a, b) => a.price - b.price);
  const response: ApiResponse = {
    _meta: {
      status: 'SUCCESS',
      cached: true,
      count: 1,
      debug: {
        ticket: {
          ticket_id: `agoda_clone_${id}_${Date.now()}`,
          created_at: Date.now() / 1000,
          loop: null,
          snapped_at: null,
          snapshot_id: null,
          snapshot_ttl: 300,
          executions: 1,
          progress: 1,
          save_errors: []
        },
        properties_total: 1
      }
    },
    data: {
      records: [{ ...hotel, offers: sortedOffers }],
      filters: apiRes.data?.filters || {},
      query: { pos: 'agoda_clone' }
    }
  };
  return NextResponse.json(response);
}
