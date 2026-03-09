import Link from 'next/link'
import PopularPosts from './PopularPosts'
import { Tag } from 'lucide-react'

interface Post {
  id: string
  title: string
  slug: string
  viewCount?: number
  publishedAt?: Date | string | null
}

interface Category {
  id: string
  name: string
  slug: string
  _count?: { posts: number }
}

interface TagType {
  id: string
  name: string
  slug: string
  _count?: { posts: number }
}

interface SidebarProps {
  popularPosts?: Post[]
  categories?: Category[]
  tags?: TagType[]
}

export default function Sidebar({ popularPosts = [], categories = [], tags = [] }: SidebarProps) {
  return (
    <aside className="space-y-6">
      {popularPosts.length > 0 && <PopularPosts posts={popularPosts} />}
      
      {categories.length > 0 && (
        <div className="bg-[#1a1a2e] border border-[#2d2d5e] rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">カテゴリー</h3>
          <ul className="space-y-2">
            {categories.map(cat => (
              <li key={cat.id}>
                <Link href={`/category/${cat.slug}`} className="flex items-center justify-between text-gray-300 hover:text-purple-400 transition-colors text-sm py-1">
                  <span>{cat.name}</span>
                  {cat._count && <span className="text-gray-600 text-xs">({cat._count.posts})</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tags.length > 0 && (
        <div className="bg-[#1a1a2e] border border-[#2d2d5e] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Tag className="w-4 h-4 text-purple-400" />
            <h3 className="text-white font-semibold">タグ</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <Link
                key={tag.id}
                href={`/tag/${tag.slug}`}
                className="px-3 py-1 bg-[#16213e] border border-[#2d2d5e] rounded-full text-xs text-gray-400 hover:text-purple-400 hover:border-purple-500/50 transition-all"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  )
}
