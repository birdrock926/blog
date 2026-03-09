import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'

interface Post {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  featuredImage?: string | null
  publishedAt?: Date | string | null
  categories?: Array<{ id: string; name: string; slug: string }>
  readingTime?: number | null
}

export default function RelatedPosts({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null

  return (
    <section className="mt-12 pt-12 border-t border-[#2d2d5e]">
      <h2 className="text-xl font-bold text-white mb-6">関連記事</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {posts.map(post => (
          <Link key={post.id} href={`/blog/${post.slug}`} className="group bg-[#1a1a2e] border border-[#2d2d5e] rounded-xl overflow-hidden hover:border-purple-500/50 transition-all">
            <div className="relative h-32 bg-[#16213e]">
              {post.featuredImage ? (
                <Image src={post.featuredImage} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl">🎮</span>
                </div>
              )}
            </div>
            <div className="p-3">
              <h3 className="text-white text-sm font-medium line-clamp-2 group-hover:text-purple-400 transition-colors">
                {post.title}
              </h3>
              {post.publishedAt && (
                <p className="text-gray-500 text-xs mt-1">{formatDate(post.publishedAt)}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
