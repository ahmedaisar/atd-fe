
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { promises as fs } from 'fs';
import { getJSON, setJSON } from '@/lib/server-cache'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const key = `search:hotels:${url.searchParams.toString()}`
  const cached = await getJSON<any>(key)
  if (cached) return NextResponse.json(cached)

  // Read the sample API response JSON from the public directory
  const filePath = process.cwd() + '/public/sample-api-response.json';
  const file = await fs.readFile(filePath, 'utf-8');
  const apiRes = JSON.parse(file);

  // Map filters, hotels, and meta from the sample API response
  const filters = apiRes.data?.filters || {};
  const hotels = apiRes.data?.records || [];
  const meta = apiRes.data?.meta || {};

  // Compose the response in the expected format, including meta
  const res = {
    _meta: apiRes._meta,
    data: {
      records: hotels,
      filters,
      meta, // <-- include meta for atoll counts
      query: apiRes.data?.query || {},
    },
  };
  // cache for a short duration (e.g., 60s)
  await setJSON(key, res, 60)
  return NextResponse.json(res);
}
