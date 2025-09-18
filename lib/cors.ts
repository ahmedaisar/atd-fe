export function getAllowedOrigin(origin: string | null): string | null {
  const env = process.env.ALLOWED_ORIGINS || ''
  const list = env.split(',').map(s => s.trim()).filter(Boolean)
  if (!origin) return list[0] || null
  if (list.length === 0) return origin // allow any if not configured
  return list.includes(origin) ? origin : null
}

export function corsHeaders(origin: string | null) {
  const allow = getAllowedOrigin(origin)
  const headers: Record<string, string> = {
    'Vary': 'Origin',
  }
  if (allow) {
    headers['Access-Control-Allow-Origin'] = allow
    headers['Access-Control-Allow-Methods'] = 'GET, OPTIONS'
    headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    headers['Access-Control-Expose-Headers'] = 'X-Atollmv-Cache'
    headers['Access-Control-Max-Age'] = '86400'
  }
  return headers
}
