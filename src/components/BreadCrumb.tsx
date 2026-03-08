import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadCrumbProps {
  items: BreadcrumbItem[]
}

export default function BreadCrumb({ items }: BreadCrumbProps) {
  return (
    <nav aria-label="パンくずリスト" className="flex items-center gap-1 text-sm text-gray-500 mb-6 flex-wrap">
      <Link href="/" className="hover:text-purple-400 transition-colors flex items-center">
        <Home className="w-4 h-4" />
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          <ChevronRight className="w-4 h-4 text-gray-600" />
          {item.href ? (
            <Link href={item.href} className="hover:text-purple-400 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-300">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
