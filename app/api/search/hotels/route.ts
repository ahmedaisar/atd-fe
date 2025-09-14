
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { promises as fs } from 'fs';

export async function GET(req: NextRequest) {
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
  return NextResponse.json(res);
}
