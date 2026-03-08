import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string, formatStr = 'yyyy年MM月dd日') {
  return format(new Date(date), formatStr, { locale: ja })
}

export function formatDateRelative(date: Date | string) {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ja })
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 400
  const text = content.replace(/<[^>]*>/g, '')
  const wordCount = text.length
  return Math.ceil(wordCount / wordsPerMinute)
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

export function getAbsoluteUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  return `${baseUrl}${path}`
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '')
}
