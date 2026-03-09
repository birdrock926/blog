import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationNavProps {
  currentPage: number
  totalPages: number
  basePath: string
}

export default function PaginationNav({ currentPage, totalPages, basePath }: PaginationNavProps) {
  if (totalPages <= 1) return null

  const pages = []
  const delta = 2
  const left = currentPage - delta
  const right = currentPage + delta + 1

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= left && i < right)) {
      pages.push(i)
    }
  }

  const pagesWithDots: (number | string)[] = []
  let prev: number | null = null
  for (const page of pages) {
    if (prev !== null && page - prev > 1) {
      pagesWithDots.push('...')
    }
    pagesWithDots.push(page)
    prev = page
  }

  const getHref = (page: number) => {
    if (page === 1) return basePath
    return `${basePath}?page=${page}`
  }

  return (
    <nav className="flex items-center justify-center gap-2 mt-12">
      {currentPage > 1 && (
        <Link
          href={getHref(currentPage - 1)}
          className="flex items-center gap-1 px-3 py-2 bg-[#1a1a2e] border border-[#2d2d5e] rounded-lg text-gray-400 hover:text-white hover:border-purple-500/50 transition-all text-sm"
        >
          <ChevronLeft className="w-4 h-4" /> 前へ
        </Link>
      )}

      {pagesWithDots.map((page, i) => (
        page === '...' ? (
          <span key={`dots-${i}`} className="px-2 text-gray-600">...</span>
        ) : (
          <Link
            key={page}
            href={getHref(page as number)}
            className={`w-10 h-10 flex items-center justify-center rounded-lg border text-sm font-medium transition-all ${
              page === currentPage
                ? 'bg-purple-600 border-purple-600 text-white'
                : 'bg-[#1a1a2e] border-[#2d2d5e] text-gray-400 hover:text-white hover:border-purple-500/50'
            }`}
          >
            {page}
          </Link>
        )
      ))}

      {currentPage < totalPages && (
        <Link
          href={getHref(currentPage + 1)}
          className="flex items-center gap-1 px-3 py-2 bg-[#1a1a2e] border border-[#2d2d5e] rounded-lg text-gray-400 hover:text-white hover:border-purple-500/50 transition-all text-sm"
        >
          次へ <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </nav>
  )
}
