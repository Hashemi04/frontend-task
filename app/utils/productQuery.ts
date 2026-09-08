import type { Product } from '~/types/product'

export const SORT_KEYS = [
  'count-asc',
  'count-desc',
  'rating-desc',
  'rating-asc',
] as const
export type SortKey = (typeof SORT_KEYS)[number]
export const DEFAULT_SORT: SortKey = 'count-asc'
export const PAGE_SIZE = 9
export const CATALOG_PATH = '/'

export function catalogQuerySource(
  path: string,
  currentQuery: Record<string, unknown>,
) {
  return path === CATALOG_PATH ? { ...currentQuery } : {}
}

export function queryString(value: unknown) {
  if (typeof value === 'string') {
    return value.trim()
  }

  if (Array.isArray(value) && typeof value[0] === 'string') {
    return value[0].trim()
  }

  return ''
}

export function isSortKey(value: string): value is SortKey {
  return (SORT_KEYS as readonly string[]).includes(value)
}

export function parseSort(value: unknown): SortKey {
  const raw = queryString(value)
  return isSortKey(raw) ? raw : DEFAULT_SORT
}

export function parseAppliedSort(value: unknown): SortKey | null {
  const raw = queryString(value)
  return isSortKey(raw) ? raw : null
}

export function parsePage(value: unknown) {
  const n = Number(queryString(value))
  if (!Number.isInteger(n) || n < 1) {
    return 1
  }

  return n
}

export function clampPage(requested: number, totalPages: number) {
  return Math.min(requested, Math.max(1, totalPages))
}

export function parseAvailable(value: unknown) {
  return queryString(value) === "1";
}

export function parseCategories(value: unknown, allowed: string[]) {
  const raw = queryString(value)
  if (!raw) {
    return []
  }

  const allowedSet = new Set(allowed)
  return raw.split(',').map(item => item.trim()).filter(item => allowedSet.has(item))
}

export function compareProducts(a: Product, b: Product, sort: SortKey) {
  if (sort === 'count-asc') {
    return a.rating.count - b.rating.count
  }

  if (sort === 'count-desc') {
    return b.rating.count - a.rating.count
  }

  if (sort === 'rating-asc') {
    return a.rating.rate - b.rating.rate
  }

  return b.rating.rate - a.rating.rate
}

export function applyQueryUpdates(
  current: Record<string, unknown>,
  updates: Record<string, string | undefined>,
) {
  const omit = new Set<string>()
  if (!('page' in updates)) {
    omit.add('page')
  }
  for (const [key, value] of Object.entries(updates)) {
    if (!value) {
      omit.add(key)
    }
  }

  const next: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(current)) {
    if (!omit.has(key)) {
      next[key] = value
    }
  }
  for (const [key, value] of Object.entries(updates)) {
    if (value) {
      next[key] = value
    }
  }

  return next
}

export function appliedFilterCount(options: {
  query: string
  sort: SortKey | null
  categories: string[]
  available: boolean
}) {
  return (
    (options.query.trim() ? 1 : 0) +
    (options.sort ? 1 : 0) +
    options.categories.length +
    (options.available ? 1 : 0)
  )
}
