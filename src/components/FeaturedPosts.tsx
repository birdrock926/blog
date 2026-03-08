import Link from 'next/link'
import Image from 'next/image'
import { Star, Clock } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Post {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  featuredImage?: string | null
  publishedAt?: Date | string | null
  readingTime?: number | null
  categories?: Array<{ id: string; name: string; slug: string }>
}

export default function FeaturedPosts({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null

  return (
    <section className="mb-12">
      <div className="flex items-center gap-2 mb-6">
        <Star className="w-5 h-5 text-amber-400" />
        <h2 className="text-xl font-bold text-white">おすすめ記事</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post, i) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className={`group relative overflow-hidden rounded-xl border border-[#2d2d5e] hover:border-purple-500/50 transition-all card-hover ${
              i === 0 ? 'md:col-span-2' : ''
            }`}
          >
            <div className={`relative ${i === 0 ? 'h-64' : 'h-48'} bg-[#16213e]`}>
              {post.featuredImage ? (
                <Image src={post.featuredImage} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-blue-900/30 flex items-center justify-center">
                  <span className="text-5xl">🎮</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f1a]/90 to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4">
                {post.categories && post.categories.length > 0 && (
                  <span className="inline-block px-2 py-1 bg-purple-600/80 text-white text-xs rounded mb-2">
                    {post.categories[0].name}
                  </span>
                )}
                <h3 className={`text-white font-bold group-hover:text-purple-300 transition-colors ${i === 0 ? 'text-xl' : 'text-base'} line-clamp-2`}>
                  {post.title}
                </h3>
                <div className="flex items-center gap-3 mt-2 text-gray-400 text-xs">
                  {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
                  {post.readingTime && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {post.readingTime}分
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
