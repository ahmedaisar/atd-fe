#!/usr/bin/env node
/** CommonJS version: fetch full hotels array and write to data/hotels-fetched.json */
const fs = require('fs')
const path = require('path')
const https = require('https')

const CHECKIN = process.env.CHECKIN_DATE || '2025-11-11'
const CHECKOUT = process.env.CHECKOUT_DATE || '2025-11-12'
const BASE = (process.env.DYNAMIC_WORKER_URL || 'https://oroicttchemqjentqelq.supabase.co/functions/v1/dynamic-worker').replace(/\/$/, '')
const OUT_PATH = path.resolve(process.cwd(), 'data', 'hotels-fetched.json')

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      if (res.statusCode && res.statusCode >= 400) {
        reject(new Error('HTTP ' + res.statusCode))
        return
      }
      const chunks = []
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
  console.log('[fetch-full-hotels.cjs] GET', url)
  const payload = await fetchJson(url)
  let hotels = []
  // Extraction logic: hotels array lives at payload.data.map according to provided schema screenshot.
  // Accept a few shapes:
  // 1. payload.data.map is already an array
  // 2. payload.data.map is an object whose values are hotel objects (convert to array)
  // 3. Legacy fallbacks (response / map.response) retained just in case
  if (Array.isArray(payload?.data?.map)) {
    hotels = payload.data.map
  } else if (payload?.data?.map && typeof payload.data.map === 'object') {
    const values = Object.values(payload.data.map)
    // Heuristic: ensure objects with at least one known field (e.g., id or name) else ignore
    if (values.length && values.every(v => typeof v === 'object')) hotels = values
  } else if (Array.isArray(payload?.data?.response)) {
    hotels = payload.data.response
  } else if (Array.isArray(payload?.data?.map?.response)) {
    hotels = payload.data.map.response
  }

  if (!hotels.length) {
    console.warn('[fetch-full-hotels.cjs] No hotels at expected paths, writing diagnostic wrapper.')
    const diag = { source: url, fetchedAt: new Date().toISOString(), diagnostic: true, topLevelKeys: Object.keys(payload || {}), dataKeys: Object.keys(payload?.data || {}), sample: JSON.stringify(payload?.data, null, 2).slice(0, 1000) }
    fs.writeFileSync(OUT_PATH, JSON.stringify(diag, null, 2), 'utf8')
    return
  }

  const wrapper = { source: url, fetchedAt: new Date().toISOString(), total: hotels.length, hotels }
  fs.writeFileSync(OUT_PATH, JSON.stringify(wrapper, null, 2), 'utf8')
  console.log(`[fetch-full-hotels.cjs] Wrote ${hotels.length} hotels -> ${path.relative(process.cwd(), OUT_PATH)}`)
}
run().catch(e => { console.error('[fetch-full-hotels.cjs] ERROR', e); process.exit(1) })
