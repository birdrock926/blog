import Link from 'next/link'
import { TrendingUp } from 'lucide-react'

interface Post {
  id: string
  title: string
  slug: string
  viewCount?: number
  publishedAt?: Date | string | null
}

export default function PopularPosts({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null

  return (
    <div className="bg-[#1a1a2e] border border-[#2d2d5e] rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-4 h-4 text-amber-400" />
        <h3 className="text-white font-semibold">人気記事</h3>
      </div>
      <ol className="space-y-3">
        {posts.map((post, i) => (
          <li key={post.id} className="flex gap-3 items-start">
            <span className="text-2xl font-bold text-purple-600/50 leading-none w-6 flex-shrink-0">
              {i + 1}
            </span>
            <Link href={`/blog/${post.slug}`} className="text-gray-300 text-sm hover:text-purple-400 transition-colors line-clamp-2">
              {post.title}
            </Link>
          </li>
        ))}
      </ol>
    </div>
  )
}
