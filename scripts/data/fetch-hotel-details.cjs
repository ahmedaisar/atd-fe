/* eslint-disable no-console */
const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

const ROOT = process.cwd();
const INPUT = path.join(ROOT, 'data', 'hotels-fetched.json');
const OUT_DIR = path.join(ROOT, 'data', 'hotels');
const BASE = 'https://oroicttchemqjentqelq.supabase.co/functions/v1/hotel';

// Dates can be overridden via env
const CHECKIN = process.env.CHECKIN || '2025-12-08';
const CHECKOUT = process.env.CHECKOUT || '2025-12-14';

// Concurrency and range controls
const CONCURRENCY = Number(process.env.CONCURRENCY || 6);
const START = Number(process.env.START || 0);         // start index in the list
const LIMIT = process.env.LIMIT ? Number(process.env.LIMIT) : undefined; // limit how many to fetch in this run
const FORCE = process.env.FORCE === '1';              // overwrite existing files if true

function unique(arr) {
  return Array.from(new Set(arr));
}

function ensureDir(dir) {
  return fsp.mkdir(dir, { recursive: true });
}

function getIdFromHotel(h) {
  if (!h || typeof h !== 'object') return undefined;
  return (
    h.hs_id ||
    h.id ||
    h.hotel_id ||
    // Try parse numeric id at the end of slug (e.g., ...-mv-690866602)
    (typeof h.slug === 'string' && (h.slug.match(/(?:-mv-)?(\d+)$/)?.[1])) ||
    undefined
  );
}

async function loadHotels() {
  const raw = await fsp.readFile(INPUT, 'utf8');
  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    throw new Error(`Failed to parse ${INPUT}: ${e.message}`);
  }
  // Support multiple shapes
  const list =
    (Array.isArray(data) && data) ||
    (Array.isArray(data.hotels) && data.hotels) ||
    (Array.isArray(data.data?.map) && data.data.map) ||
    (Array.isArray(data.map) && data.map);

  if (!Array.isArray(list)) {
    throw new Error('Could not find hotels array in hotels-fetched.json (checked: root array, .hotels, .data.map, .map)');
  }
  return list;
}

async function fetchWithRetry(url, { tries = 3, timeoutMs = 30000 } = {}) {
  let lastErr;
  for (let i = 1; i <= tries; i++) {
    try {
      const ctl = new AbortController();
      const t = setTimeout(() => ctl.abort('timeout'), timeoutMs);
      const res = await fetch(url, { signal: ctl.signal, headers: { 'accept': 'application/json' } });
      clearTimeout(t);
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`HTTP ${res.status} ${res.statusText} - ${text.slice(0, 200)}`);
      }
      return await res.json();
    } catch (err) {
      lastErr = err;
      const backoff = 500 * i + Math.floor(Math.random() * 300);
      await new Promise(r => setTimeout(r, backoff));
    }
  }
  throw lastErr;
}

async function main() {
  await ensureDir(OUT_DIR);

  const hotels = await loadHotels();
  const ids = unique(
    hotels
      .map(getIdFromHotel)
      .filter(Boolean)
      .map(String)
  );

  const sliced = ids.slice(START, LIMIT ? START + LIMIT : undefined);
  console.log(`Found ${ids.length} unique hotel IDs. Fetching ${sliced.length} (start=${START}${LIMIT ? `, limit=${LIMIT}` : ''}).`);

  let inFlight = 0;
  let index = 0;
  let done = 0;
  const errors = [];

  async function next() {
    if (index >= sliced.length) return;
    if (inFlight >= CONCURRENCY) return;

    const id = sliced[index++];
    inFlight++;

    const outPath = path.join(OUT_DIR, `${id}.json`);
    try {
      if (!FORCE && fs.existsSync(outPath)) {
        console.log(`SKIP ${id} (exists)`);
      } else {
        const url = `${BASE}/${id}?checkin=${encodeURIComponent(CHECKIN)}&checkout=${encodeURIComponent(CHECKOUT)}&country=US&rooms=2&mobile=0&loop=3&ef=1&deviceNetwork=4g&deviceCpu=4&deviceMemory=4`;
        const json = await fetchWithRetry(url, { tries: 4, timeoutMs: 35000 });
        await fsp.writeFile(outPath, JSON.stringify(json, null, 2), 'utf8');
        console.log(`OK   ${id} -> ${path.relative(ROOT, outPath)}`);
      }
      done++;
    } catch (e) {
      console.error(`ERR  ${id}: ${e.message}`);
      errors.push({ id, error: String(e.message) });
    } finally {
      inFlight--;
      await next(); // fill the slot
    }
  }

  // Kick off
  const starters = Array.from({ length: CONCURRENCY }, () => next());
  await Promise.all(starters);

  console.log(`Done. Wrote ${done} files${errors.length ? `, ${errors.length} errors` : ''}.`);
  if (errors.length) {
    const logPath = path.join(OUT_DIR, '__errors__.json');
    await fsp.writeFile(logPath, JSON.stringify(errors, null, 2), 'utf8');
    console.log(`Errors logged to ${path.relative(ROOT, logPath)}`);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});