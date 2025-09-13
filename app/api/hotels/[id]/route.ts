import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  // Load hotels from sample-api-response.json
  const filePath = process.cwd() + '/public/sample-api-response.json';
  const file = await fs.readFile(filePath, 'utf-8');
  const apiRes = JSON.parse(file);
  const hotels = apiRes.data?.records || [];
  const hotel = hotels.find((h: any) => String(h.hs_id) === id);
  if (!hotel) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(hotel);
}
