import { promises as fs } from 'fs'
import path from 'path'

export type AnyObj = Record<string, any>

const ROOT = process.cwd()
const FETCHED_PATH = path.join(ROOT, 'data', 'hotels-fetched.json')
const DETAILS_DIR = path.join(ROOT, 'data', 'hotels')

function getIdFrom(h: AnyObj | null | undefined): string | undefined {
  if (!h) return undefined
  const id =
    h.hs_id ??
    h.id ??
    h.hotel_id ??
    (typeof h.slug === 'string' && h.slug.match(/(?:-mv-)?(\d+)$/)?.[1])
  return id ? String(id) : undefined
}

async function readJSON(filePath: string) {
  const txt = await fs.readFile(filePath, 'utf8')
  return JSON.parse(txt)
}

async function loadFetchedHotels(): Promise<AnyObj[]> {
  const data = await readJSON(FETCHED_PATH)
  if (Array.isArray(data)) return data
  if (Array.isArray(data.hotels)) return data.hotels
  if (Array.isArray(data.data?.map)) return data.data.map
  if (Array.isArray(data.map)) return data.map
  throw new Error('hotels-fetched.json does not contain an array (checked: root, .hotels, .data.map, .map)')
}

async function exists(p: string) {
  try { await fs.access(p); return true } catch { return false }
}

async function loadHotelDetails(ids: string[]) {
  const details = new Map<string, AnyObj>()
  let i = 0
  const concurrency = Math.min(24, Math.max(4, 8))
  async function worker() {
    while (i < ids.length) {
      const id = ids[i++]
      const p = path.join(DETAILS_DIR, `${id}.json`)
      if (!(await exists(p))) continue
      try { details.set(id, await readJSON(p)) } catch { /* ignore bad file */ }
    }
  }
  await Promise.all(Array.from({ length: concurrency }, () => worker()))
  return details
}

export interface MergedHotel {
  id: string
  base: AnyObj
  details: AnyObj | null
}

let cache: { at: number; items: MergedHotel[] } | null = null

export async function loadMergedHotels(refresh = false): Promise<MergedHotel[]> {
  if (!refresh && cache?.items) return cache.items

  const baseHotels = await loadFetchedHotels()
  const ids = baseHotels.map(getIdFrom).filter(Boolean) as string[]
  const detailsMap = await loadHotelDetails(ids)

  const merged: MergedHotel[] = baseHotels.map((b) => {
    const id = getIdFrom(b)!
    const details = detailsMap.get(id) ?? null
    return { id, base: b, details }
  })

  cache = { at: Date.now(), items: merged }
  return merged
}
