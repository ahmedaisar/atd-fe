import fs from 'fs/promises';
import path from 'path';
import https from 'https';

// Config
const SOURCE_URL = 'https://oroicttchemqjentqelq.supabase.co/functions/v1/dynamic-worker/checkin=2025-11-11&checkout=2025-11-12';
const OUT_DIR = path.join(process.cwd(), 'data', 'generated');
const HOTELS_FILE = path.join(OUT_DIR, 'hotels-fetched.json');
const ATOLLS_FILE = path.join(OUT_DIR, 'atolls.json');

function fetchJson<T>(url: string): Promise<T> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode && res.statusCode >= 400) {
        reject(new Error(`Request failed: ${res.statusCode}`));
        return;
      }
      const chunks: Buffer[] = [];
      res.on('data', (d) => chunks.push(d));
      res.on('end', () => {
        try {
          const raw = Buffer.concat(chunks).toString('utf8');
          const json = JSON.parse(raw);
          resolve(json as T);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

interface HotelRecord {
  id?: string | number;
  hs_id?: string | number;
  name?: string;
  address?: string;
  location?: { atoll?: string; country?: string; address?: string } | null;
  [k: string]: any;
}

(async () => {
  try {
    console.log('[fetch-hotels] Fetching source JSON...');
    const data: any = await fetchJson<any>(SOURCE_URL);

    // Attempt to locate hotel records in common shapes
    const hotels: HotelRecord[] = data?.data?.records || data?.records || data?.hotels || [];
    if (!Array.isArray(hotels) || hotels.length === 0) {
      console.warn('[fetch-hotels] No hotel records found in response shape. Writing raw file for inspection.');
    }

    await fs.mkdir(OUT_DIR, { recursive: true });
    await fs.writeFile(HOTELS_FILE, JSON.stringify(hotels, null, 2), 'utf8');
    console.log(`[fetch-hotels] Wrote ${hotels.length} hotels to ${HOTELS_FILE}`);

    // Derive atoll/address labels
    const atollSet = new Set<string>();
    for (const h of hotels) {
      const parts: string[] = [];
      if (h.location?.atoll) parts.push(h.location.atoll);
      if (h.location?.address) parts.push(h.location.address);
      if (h.address) parts.push(h.address);
      // Fallback to name if no address components
      const candidate = parts.find(Boolean) || h.name || String(h.id || h.hs_id || '');
      if (candidate) atollSet.add(candidate.trim());
    }

    const atolls = Array.from(atollSet).filter(Boolean).sort((a, b) => a.localeCompare(b));
    await fs.writeFile(ATOLLS_FILE, JSON.stringify(atolls, null, 2), 'utf8');
    console.log(`[fetch-hotels] Extracted ${atolls.length} atoll/address labels to ${ATOLLS_FILE}`);
  } catch (err: any) {
    console.error('[fetch-hotels] Failed:', err.message);
    process.exitCode = 1;
  }
})();
