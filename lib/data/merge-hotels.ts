import { promises as fs } from 'fs'
import path from 'path'

export type AnyObj = Record<string, any>

// Live API endpoints and defaults
const DYN_BASE = (process.env.DYNAMIC_WORKER_URL || 'https://oroicttchemqjentqelq.supabase.co/functions/v1/dynamic-worker').replace(/\/$/, '')
const HOTEL_BASE = (process.env.HOTEL_DETAILS_URL || 'https://oroicttchemqjentqelq.supabase.co/functions/v1/hotel').replace(/\/$/, '')
const DEFAULT_LIST_CHECKIN = process.env.CHECKIN_DATE || '2025-11-11'
const DEFAULT_LIST_CHECKOUT = process.env.CHECKOUT_DATE || '2025-11-12'
const DEFAULT_DETAIL_CHECKIN = process.env.DETAIL_CHECKIN || '2025-12-08'
const DEFAULT_DETAIL_CHECKOUT = process.env.DETAIL_CHECKOUT || '2025-12-14'

// Fallback local files (offline/dev)
const ROOT = process.cwd()
const FETCHED_PATH = path.join(ROOT, 'data', 'hotels-fetched.json')

function getIdFrom(h: AnyObj | null | undefined): string | undefined {
  if (!h) return undefined
  const id =
    h.hs_id ||
    h.id ||
    h.hotel_id ||
    (typeof h.slug === 'string' && h.slug.match(/(?:-mv-)?(\d+)$/)?.[1])
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

async function fetchJson(url: string, timeoutMs = 30000): Promise<any> {
  const ctl = new AbortController()
  const t = setTimeout(() => ctl.abort(), timeoutMs)
  try {
    const res = await fetch(url, { signal: ctl.signal, headers: { 'accept': 'application/json' } as any })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } finally {
    clearTimeout(t)
  }
}

async function loadBaseHotelsRemote(checkin?: string, checkout?: string): Promise<AnyObj[]> {
  const ci = checkin || DEFAULT_LIST_CHECKIN
  const co = checkout || DEFAULT_LIST_CHECKOUT
  const url = `${DYN_BASE}/checkin=${encodeURIComponent(ci)}&checkout=${encodeURIComponent(co)}`
  const data = await fetchJson(url)
  const list = extractList(data)
  if (Array.isArray(list) && list.length) return list
  throw new Error('Remote list returned no hotels in expected shapes')
}

async function loadBaseHotelsFromFile(): Promise<AnyObj[]> {
  const txt = await fs.readFile(FETCHED_PATH, 'utf8').catch(() => 'null')
  const data = JSON.parse(txt)
  const list = extractList(data)
  if (Array.isArray(list) && list.length) return list
  throw new Error('Local hotels-fetched.json did not contain hotels array')
}

async function fetchDetailsForIds(ids: string[], checkin?: string, checkout?: string): Promise<Map<string, AnyObj>> {
  const ci = checkin || DEFAULT_DETAIL_CHECKIN
  const co = checkout || DEFAULT_DETAIL_CHECKOUT
  const extra = 'country=US&rooms=2&mobile=0&loop=3&ef=1&deviceNetwork=4g&deviceCpu=4&deviceMemory=4'
  const concurrency = Math.min(16, Math.max(4, 8))
  let idx = 0
  const out = new Map<string, AnyObj>()
  async function worker() {
    while (idx < ids.length) {
      const id = ids[idx++]
      const url = `${HOTEL_BASE}/${encodeURIComponent(id)}?checkin=${encodeURIComponent(ci)}&checkout=${encodeURIComponent(co)}&${extra}`
      try {
        const data = await fetchJson(url, 35000)
        out.set(id, data)
      } catch {
        // ignore failed detail; leave as missing
      }
    }
  }
  await Promise.all(Array.from({ length: concurrency }, () => worker()))
  return out
}

export interface MergedHotel {
  id: string
  base: AnyObj
  details: AnyObj | null
}

type CacheKey = string
const mergeCache = new Map<CacheKey, { at: number; items: MergedHotel[] }>()
const CACHE_TTL_MS = 3 * 60 * 1000 // 3 minutes

export interface LoadMergedOptions {
  refresh?: boolean
  checkin?: string
  checkout?: string
  limit?: number
  offset?: number
}

export async function loadMergedHotels(refreshOrOpts: boolean | LoadMergedOptions = false): Promise<MergedHotel[]> {
  const opts: LoadMergedOptions = typeof refreshOrOpts === 'boolean' ? { refresh: refreshOrOpts } : (refreshOrOpts || {})
  const refresh = !!opts.refresh
  const ci = opts.checkin
  const co = opts.checkout

  const key: CacheKey = `${ci || DEFAULT_LIST_CHECKIN}|${co || DEFAULT_LIST_CHECKOUT}|${opts.limit || ''}|${opts.offset || ''}`
  const cached = mergeCache.get(key)
  if (!refresh && cached && (Date.now() - cached.at) < CACHE_TTL_MS) return cached.items

  let baseHotels: AnyObj[] = []
  try {
    baseHotels = await loadBaseHotelsRemote(ci, co)
  } catch {
    // Fallback to local file if remote fails
    baseHotels = await loadBaseHotelsFromFile().catch(() => [])
  }

  // No base-level filtering; keep the list as-is
  let baseFiltered = baseHotels

  // Decide how many to fetch details for (fetch a wider pool than final limit)
  const desired = Math.max(1, opts.limit || 20)
  const FETCH_BATCH = Math.min(baseFiltered.length, Math.max(desired * 12, 120))
  const candidateSlice = baseFiltered.slice(opts.offset || 0, (opts.offset || 0) + FETCH_BATCH)

  const ids = candidateSlice.map(getIdFrom).filter(Boolean) as string[]
  const detailsMap = await fetchDetailsForIds(ids, ci, co)

  const mergedAll: MergedHotel[] = candidateSlice.map((b) => {
    const id = getIdFrom(b)!
    const details = detailsMap.get(id) ?? null
    return { id, base: b, details }
  })

  // No detailed filtering; return merged set as-is
  let merged = mergedAll

  // Apply limit after filtering
  const l = opts.limit && opts.limit > 0 ? opts.limit : merged.length
  merged = merged.slice(0, l)

  mergeCache.set(key, { at: Date.now(), items: merged })
  return merged
}
