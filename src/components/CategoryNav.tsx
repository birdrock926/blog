import Link from 'next/link'

interface Category {
  id: string
  name: string
  slug: string
  color?: string | null
  _count?: { posts: number }
}

export default function CategoryNav({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <Link
        href="/blog"
        className="px-4 py-2 bg-[#1a1a2e] border border-[#2d2d5e] rounded-full text-sm text-gray-300 hover:text-white hover:border-purple-500/50 transition-all"
      >
        すべて
      </Link>
      {categories.map(cat => (
        <Link
          key={cat.id}
          href={`/category/${cat.slug}`}
          className="px-4 py-2 bg-[#1a1a2e] border border-[#2d2d5e] rounded-full text-sm text-gray-300 hover:text-white hover:border-purple-500/50 transition-all"
        >
          {cat.name}
          {cat._count && <span className="ml-1 text-gray-500 text-xs">({cat._count.posts})</span>}
        </Link>
      ))}
    </div>
  )
}
