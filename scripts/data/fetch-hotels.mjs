import fs from 'fs/promises';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_URL = 'https://oroicttchemqjentqelq.supabase.co/functions/v1/dynamic-worker/checkin=2025-11-11&checkout=2025-11-12';
const OUT_DIR = path.join(process.cwd(), 'data', 'generated');
const HOTELS_FILE = path.join(OUT_DIR, 'hotels-fetched.json');
const ATOLLS_FILE = path.join(OUT_DIR, 'atolls.json');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode && res.statusCode >= 400) {
        reject(new Error(`Request failed: ${res.statusCode}`));
        return;
      }
      const chunks = [];
      res.on('data', (d) => chunks.push(d));
      res.on('end', () => {
        try {
          const raw = Buffer.concat(chunks).toString('utf8');
            const json = JSON.parse(raw);
            resolve(json);
        } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log('[fetch-hotels] Fetching source JSON...');
  let data;
  try {
    data = await fetchJson(SOURCE_URL);
  } catch (err) {
    console.error('[fetch-hotels] Fetch failed:', err.message);
    process.exitCode = 1;
    return;
  }

  const hotels = data?.data?.records || data?.records || data?.hotels || [];
  if (!Array.isArray(hotels)) {
    console.warn('[fetch-hotels] Unexpected format; writing raw.json');
    await fs.mkdir(OUT_DIR, { recursive: true });
    await fs.writeFile(path.join(OUT_DIR, 'raw.json'), JSON.stringify(data, null, 2));
    return;
  }

  await fs.mkdir(OUT_DIR, { recursive: true });
  await fs.writeFile(HOTELS_FILE, JSON.stringify(hotels, null, 2));
  console.log(`[fetch-hotels] Wrote ${hotels.length} hotels -> ${HOTELS_FILE}`);

  const atollSet = new Set();
  for (const h of hotels) {
    const parts = [];
    if (h?.location?.atoll) parts.push(h.location.atoll);
    if (h?.location?.address) parts.push(h.location.address);
    if (h?.address) parts.push(h.address);
    const candidate = parts.find(Boolean) || h?.name || String(h?.id || h?.hs_id || '');
    if (candidate) atollSet.add(String(candidate).trim());
  }
  const atolls = Array.from(atollSet).filter(Boolean).sort((a,b)=>a.localeCompare(b));
  await fs.writeFile(ATOLLS_FILE, JSON.stringify(atolls, null, 2));
  console.log(`[fetch-hotels] Extracted ${atolls.length} atoll labels -> ${ATOLLS_FILE}`);
}

main().catch(e => { console.error(e); process.exitCode = 1; });
