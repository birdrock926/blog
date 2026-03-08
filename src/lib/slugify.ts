import slugifyLib from 'slugify'

export function createSlug(text: string): string {
  return slugifyLib(text, {
    lower: true,
    strict: true,
    locale: 'ja',
    trim: true,
  })
}

export function createUniqueSlug(text: string, suffix?: string): string {
  const base = createSlug(text)
  if (suffix) return `${base}-${suffix}`
  return base
}
