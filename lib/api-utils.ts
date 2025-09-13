export function paginate<T>(items: T[], page: number, pageSize: number) {
  const total = items.length
  const pages = Math.max(1, Math.ceil(total / pageSize))
  const current = Math.min(Math.max(1, page), pages)
  const start = (current - 1) * pageSize
  const end = start + pageSize
  return {
    items: items.slice(start, end),
    page: current,
    pageSize,
    total,
    pages,
  }
}

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

export function pct(n: number, total: number) {
  return total === 0 ? 0 : (n / total) * 100
}

export function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function simulatePriceFluctuation(base: number, variancePct = 0.05) {
  const delta = base * variancePct
  const sign = Math.random() > 0.5 ? 1 : -1
  return Math.max(1, Math.round(base + sign * Math.random() * delta))
}
