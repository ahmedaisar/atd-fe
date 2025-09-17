export type OfferFlagsInput = unknown

function humanize(s: string): string {
  const cleaned = s.replace(/[_.-]+/g, ' ').replace(/\s+/g, ' ').trim()
  if (!cleaned) return ''
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
}

function sameNormalized(a: string, b: string): boolean {
  const na = a.replace(/[_.-]+/g, '').toLowerCase()
  const nb = b.replace(/[_.-]+/g, '').toLowerCase()
  return na === nb
}

/**
 * Normalize offer flags into an array of displayable label strings.
 * Accepts arrays of strings/objects, or objects with string/boolean values.
 * - If a value equals its key (e.g., pay_at_hotel: 'pay_at_hotel'), we humanize the key.
 * - For boolean true/1 values, we humanize the key.
 */
export function normalizeOfferFlags(input: OfferFlagsInput): string[] {
  if (!input) return []

  const out: string[] = []

  // If already an array: extract strings or object labels
  if (Array.isArray(input)) {
    for (const item of input) {
      if (typeof item === 'string') {
        const s = item.trim()
        if (s) out.push(humanize(s))
      } else if (item && typeof item === 'object') {
        const label = (item as any).label ?? (item as any).name ?? (item as any).title
        if (typeof label === 'string' && label.trim()) out.push(humanize(label.trim()))
      }
    }
  } else if (typeof input === 'object') {
    const obj = input as Record<string, unknown>
    for (const [k, v] of Object.entries(obj)) {
      if (typeof v === 'string') {
        const trimmed = v.trim()
        if (!trimmed) continue
        // If the value equals the key (normalized), humanize the key; otherwise use the value
        out.push(sameNormalized(k, trimmed) ? humanize(k) : humanize(trimmed))
      } else if (v === true || (typeof v === 'number' && v === 1)) {
        out.push(humanize(k))
      } else if (v && typeof v === 'object') {
        const label = (v as any).label ?? (v as any).name ?? (v as any).title
        if (typeof label === 'string' && label.trim()) {
          const trimmed = label.trim()
          out.push(sameNormalized(k, trimmed) ? humanize(k) : humanize(trimmed))
        }
      }
    }
  }

  // Deduplicate while preserving order
  const seen = new Set<string>()
  const deduped: string[] = []
  for (const s of out) {
    if (!seen.has(s)) { seen.add(s); deduped.push(s) }
  }
  return deduped
}
