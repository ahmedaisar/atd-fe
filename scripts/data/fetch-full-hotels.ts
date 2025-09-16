#!/usr/bin/env ts-node
/**
 * Fetch full hotels array from dynamic worker endpoint and store raw array only.
 * Uses fixed dates or env overrides.
 */
import fs from 'fs'
import path from 'path'
import https from 'https'

const CHECKIN = process.env.CHECKIN_DATE || '2025-11-11'
const CHECKOUT = process.env.CHECKOUT_DATE || '2025-11-12'
const BASE = (process.env.DYNAMIC_WORKER_URL || 'https://oroicttchemqjentqelq.supabase.co/functions/v1/dynamic-worker').replace(/\/$/, '')
const OUT_PATH = path.resolve(process.cwd(), 'data', 'hotels-fetched.json')

function fetchJson(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      if (res.statusCode && res.statusCode >= 400) {
        reject(new Error('HTTP ' + res.statusCode))
        return
      }
      const chunks: Buffer[] = []
      res.on('data', d => chunks.push(d))
      res.on('end', () => {
        try {
          const raw = Buffer.concat(chunks).toString('utf8')
          resolve(JSON.parse(raw))
        } catch (e) { reject(e) }
      })
    }).on('error', reject)
  })
}

async function run() {
  const url = `${BASE}/checkin=${CHECKIN}&checkout=${CHECKOUT}`
  console.log('[fetch-full-hotels] GET', url)
  const payload = await fetchJson(url)

  // Path: expecting shape { _meta, data: { meta, data?, response: [...] , map? } } from sample snippet
  let hotels: any[] = []
  if (payload?.data?.response && Array.isArray(payload.data.response)) {
    hotels = payload.data.response
  } else if (Array.isArray(payload?.response)) {
    hotels = payload.response
  } else if (Array.isArray(payload)) {
    hotels = payload
  }

  if (!hotels.length) {
    console.warn('[fetch-full-hotels] WARNING: No hotels found at expected path. Writing root payload for inspection.')
    fs.writeFileSync(OUT_PATH, JSON.stringify(payload, null, 2), 'utf8')
    console.log('[fetch-full-hotels] Wrote raw payload to', path.relative(process.cwd(), OUT_PATH))
    return
  }

  const wrapper = {
    source: url,
    fetchedAt: new Date().toISOString(),
    total: hotels.length,
    hotels
  }
  fs.writeFileSync(OUT_PATH, JSON.stringify(wrapper, null, 2), 'utf8')
  console.log(`[fetch-full-hotels] Wrote ${hotels.length} hotels to ${path.relative(process.cwd(), OUT_PATH)}`)
}

run().catch(e => { console.error('[fetch-full-hotels] ERROR', e); process.exit(1) })
