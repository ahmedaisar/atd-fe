#!/usr/bin/env ts-node
/**
 * Fetch MAP hotel data from the dynamic worker endpoint server-side ONLY and persist to local JSON.
 * NEVER import this file into client bundles.
 */
import fs from 'fs'
import path from 'path'
import https from 'https'
import { buildIndex, HotelRawRecord, FetchHotelsBundle } from '../../types/hotel'

interface EnvConfig {
  DYNAMIC_WORKER_URL?: string
  CHECKIN_DATE?: string
  CHECKOUT_DATE?: string
  OUTPUT_DIR?: string
}

const env: EnvConfig = {
  DYNAMIC_WORKER_URL: process.env.DYNAMIC_WORKER_URL,
  CHECKIN_DATE: process.env.CHECKIN_DATE,
  CHECKOUT_DATE: process.env.CHECKOUT_DATE,
  OUTPUT_DIR: process.env.OUTPUT_DIR || 'data/generated'
}

function assert(condition: any, message: string): asserts condition {
  if (!condition) throw new Error(message)
}

async function fetchJson(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      if (res.statusCode && res.statusCode >= 400) {
        reject(new Error(`Request failed: ${res.statusCode}`))
        return
      }
      const chunks: Buffer[] = []
      res.on('data', d => chunks.push(d))
      res.on('end', () => {
        try {
          const raw = Buffer.concat(chunks).toString('utf8')
          resolve(JSON.parse(raw))
        } catch (e) {
          reject(e)
        }
      })
    }).on('error', reject)
  })
}

async function main() {
  assert(env.DYNAMIC_WORKER_URL, 'DYNAMIC_WORKER_URL env var required')
  assert(env.CHECKIN_DATE, 'CHECKIN_DATE env var required')
  assert(env.CHECKOUT_DATE, 'CHECKOUT_DATE env var required')

  const baseUrl = env.DYNAMIC_WORKER_URL!.replace(/\/$/, '')
  // Compose final URL (assuming pattern shown in provided example; adjust if needed)
  const url = `${baseUrl}/checkin=${env.CHECKIN_DATE}&checkout=${env.CHECKOUT_DATE}`
  console.log('[fetch-remote-hotels] Fetching:', url)
  const data = await fetchJson(url)

  // Heuristic: try to locate hotel records (MAP portion). Adjust these paths as real shape becomes known.
  let hotels: HotelRawRecord[] = []
  if (Array.isArray(data)) {
    hotels = data as HotelRawRecord[]
  } else if (Array.isArray(data.hotels)) {
    hotels = data.hotels as HotelRawRecord[]
  } else if (data.map && Array.isArray(data.map.hotels)) {
    hotels = data.map.hotels as HotelRawRecord[]
  } else if (data.results && Array.isArray(data.results)) {
    hotels = data.results as HotelRawRecord[]
  } else {
    // fallback: gather any array fields with objects containing an id & name
    for (const k of Object.keys(data)) {
      const v = (data as any)[k]
      if (Array.isArray(v) && v.length && typeof v[0] === 'object' && ('id' in v[0] || 'name' in v[0])) {
        hotels = v as HotelRawRecord[]
        break
      }
    }
  }

  if (!hotels.length) {
    console.warn('[fetch-remote-hotels] No hotel records detected. Writing raw payload only.')
  }

  const index = buildIndex(hotels)
  const bundle: FetchHotelsBundle = {
    meta: {
      fetchedAt: new Date().toISOString(),
      source: url,
      total: hotels.length,
      notes: 'Structure inferred heuristically; adjust parsing logic when schema is confirmed.'
    },
    hotels,
    index
  }

  const outDir = path.resolve(process.cwd(), env.OUTPUT_DIR!)
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

  const rawPath = path.join(outDir, 'hotels-raw.json')
  const indexPath = path.join(outDir, 'hotels-index.json')
  const bundlePath = path.join(outDir, 'hotels-bundle.json')

  fs.writeFileSync(rawPath, JSON.stringify(hotels, null, 2), 'utf8')
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2), 'utf8')
  fs.writeFileSync(bundlePath, JSON.stringify(bundle, null, 2), 'utf8')

  console.log(`[fetch-remote-hotels] Wrote ${hotels.length} records.`)
  console.log(`[fetch-remote-hotels] Files:`)
  console.log('  -', path.relative(process.cwd(), rawPath))
  console.log('  -', path.relative(process.cwd(), indexPath))
  console.log('  -', path.relative(process.cwd(), bundlePath))
}

main().catch(err => {
  console.error('[fetch-remote-hotels] ERROR:', err)
  process.exit(1)
})
