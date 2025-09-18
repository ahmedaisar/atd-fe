// Server-side shared cache and fetcher for AtollMV data (single implementation)
import fs from 'fs'
import path from 'path'

type AnyObj = Record<string, any>

const DEFAULT_EDGE = 'https://oroicttchemqjentqelq.supabase.co/functions/v1'
const EDGE_BASE = (process.env.NEXT_PUBLIC_SUPABASE_EDGE_URL || process.env.SUPABASE_EDGE_URL || DEFAULT_EDGE).replace(/\/$/, '')
const LIST_PATH_QS = 'dynamic-worker?checkin=2025-11-11&checkout=2025-11-12'
const LIST_PATH_STYLE = 'dynamic-worker/checkin=2025-11-11&checkout=2025-11-12'
const DETAIL_BASE = `${EDGE_BASE}/hotel`
const DETAIL_QS = 'checkin=2025-12-08&checkout=2025-12-14'

const ENV_TTL = Number.parseInt(process.env.ATOLLMV_CACHE_TTL_MS || '', 10)
const CACHE_TTL_MS = Number.isFinite(ENV_TTL) && ENV_TTL > 0 ? ENV_TTL : 5 * 60 * 1000
const ENV_CAP = Number.parseInt(process.env.ATOLLMV_DETAILS_CAP || '', 10)
const DETAILS_CAP = Number.isFinite(ENV_CAP) && ENV_CAP > 0 ? ENV_CAP : 20

function getIdFrom(h: AnyObj | null | undefined): string | undefined {
  if (!h) return undefined
  const id = h.hs_id || h.id || h.hotel_id || (typeof h.slug === 'string' && h.slug.match(/(?:-mv-)?(\d+)$/)?.[1])
  return id ? String(id) : undefined
}

function extractList(data: any): AnyObj[] {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.hotels)) return data.hotels
  if (Array.isArray(data?.data?.records)) return data.data.records
  if (Array.isArray(data?.records)) return data.records
  if (Array.isArray(data?.data?.map)) return data.data.map
  if (Array.isArray(data?.map)) return data.map
  if (Array.isArray(data?.data?.response)) return data.data.response
  return []
}

async function fetchJson(url: string, timeoutMs = 60000): Promise<any> {
  const ctl = new AbortController()
  const t = setTimeout(() => ctl.abort(), timeoutMs)
  try {
    const res = await fetch(url, { signal: ctl.signal, headers: { accept: 'application/json' } as any, cache: 'no-store' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } finally { clearTimeout(t) }
}

async function fetchDetailsFor(ids: string[]): Promise<Map<string, AnyObj>> {
  const out = new Map<string, AnyObj>()
  const concurrency = Math.min(12, Math.max(6, 8))
  let idx = 0
  async function worker() {
    while (idx < ids.length) {
      const id = ids[idx++]
      const url = `${DETAIL_BASE}/${encodeURIComponent(id)}?${DETAIL_QS}`
      try {
        const data = await fetchJson(url, 45000)
        out.set(id, data)
      } catch {
        // ignore individual failures; details may be missing
      }
    }
  }
  await Promise.all(Array.from({ length: concurrency }, () => worker()))
  return out
}

type Body = { total: number; items: Array<{ id: string; base: AnyObj; details: AnyObj | null }> }
type CacheEntry = { stamped: number; body: Body }
let cache: CacheEntry | null = null
let warming = false

// Disk persistence: allow reading cached body across process restarts
const DISK_PATHS = [
  path.join(process.cwd(), '.next', 'cache', 'atollmv-cache.json'),
  path.join(process.cwd(), 'atollmv-cache.json'),
]

function readDiskCacheSync(): Body | null {
  for (const p of DISK_PATHS) {
    try {
      if (fs.existsSync(p)) {
        const s = fs.readFileSync(p, 'utf8')
        const j = JSON.parse(s)
        if (j && Array.isArray(j.items)) return j as Body
      }
    } catch {}
  }
  return null
}

function writeDiskCache(body: Body) {
  for (const p of DISK_PATHS) {
    try {
      fs.mkdirSync(path.dirname(p), { recursive: true })
      fs.writeFileSync(p, JSON.stringify(body))
    } catch {}
  }
}

export function getAtollmvCache(): { body: Body | null; ageMs: number } {
  if (!cache) {
    const disk = readDiskCacheSync()
    if (disk) {
      cache = { stamped: Date.now(), body: disk }
      return { body: cache.body, ageMs: 0 }
    }
    return { body: null, ageMs: Infinity }
  }
  return { body: cache.body, ageMs: Date.now() - cache.stamped }
}

export async function getAtollmvCached(refresh = false): Promise<{ body: Body; cacheStatus: 'HIT' | 'MISS' }> {
  const now = Date.now()
  if (!refresh && cache && (now - cache.stamped) < CACHE_TTL_MS) {
    return { body: cache.body, cacheStatus: 'HIT' }
  }

  // Fetch list with fallback URL shapes
  const listUrls = [
    `${EDGE_BASE}/${LIST_PATH_STYLE}`,
    `${EDGE_BASE}/${LIST_PATH_QS}`,
  ]
  let listPayload: any | null = null
  let lastErr: any = null
  for (const u of listUrls) {
    // Try each URL up to 2 attempts (simple retry) with a slightly longer timeout.
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        listPayload = await fetchJson(u, 90000)
        break
      } catch (e) {
        lastErr = e
        // small delay between retries
        await new Promise(r => setTimeout(r, 300))
      }
    }
    if (listPayload) break
  }
  if (!listPayload) {
    // If we already have a cache, return it instead of empty to keep UI populated.
    if (cache) return { body: cache.body, cacheStatus: 'HIT' }
    const body: Body = { total: 0, items: [] }
    cache = { stamped: Date.now(), body }
    return { body, cacheStatus: 'MISS' }
  }
  const list = extractList(listPayload)

  // Details cap and merge
  const idsAll = list.map(getIdFrom).filter(Boolean) as string[]
  const ids = idsAll.slice(0, DETAILS_CAP)
  const detailsMap = await fetchDetailsFor(ids)
  const items = list.map((base: AnyObj) => {
    const id = getIdFrom(base)!
    const details = detailsMap.get(id) ?? null
    return { id, base, details }
  })

  const body: Body = { total: items.length, items }
  cache = { stamped: Date.now(), body }
  // Persist to disk for cross-process reuse
  try { writeDiskCache(body) } catch {}
  return { body, cacheStatus: 'MISS' }
}

// Background warm-up once per process (non-blocking). This does not run from the homepage,
// honoring the no-HTTP requirement there, but initializes the cache soon after server starts.
async function warmOnce() {
  if (warming) return
  warming = true
  try { await getAtollmvCached(false) } catch { /* ignore */ }
}
// Schedule without blocking import time
// In dev, multiple reloads may re-import; guard with `warming` flag above.
setTimeout(() => { warmOnce() }, 0)
