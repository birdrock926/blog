import Link from 'next/link'
import Image from 'next/image'
import { Clock, Eye } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Post {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  featuredImage?: string | null
  publishedAt?: Date | string | null
  readingTime?: number | null
  viewCount?: number
  categories?: Array<{ id: string; name: string; slug: string; color?: string | null }>
  author?: { name?: string | null; avatar?: string | null }
}

interface ArticleCardProps {
  post: Post
  variant?: 'default' | 'horizontal' | 'compact'
}

export default function ArticleCard({ post, variant = 'default' }: ArticleCardProps) {
  if (variant === 'horizontal') {
    return (
      <Link href={`/blog/${post.slug}`} className="group flex gap-4 bg-[#1a1a2e] border border-[#2d2d5e] rounded-xl p-4 hover:border-purple-500/50 transition-all card-hover">
        {post.featuredImage && (
          <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
            <Image src={post.featuredImage} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-sm line-clamp-2 group-hover:text-purple-400 transition-colors">
            {post.title}
          </h3>
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
            {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
            {post.readingTime && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> {post.readingTime}分
              </span>
            )}
          </div>
        </div>
      </Link>
    )
  }

  if (variant === 'compact') {
    return (
      <Link href={`/blog/${post.slug}`} className="group block">
        <h3 className="text-gray-300 text-sm hover:text-purple-400 transition-colors line-clamp-2">
          {post.title}
        </h3>
        {post.publishedAt && (
          <p className="text-gray-500 text-xs mt-1">{formatDate(post.publishedAt)}</p>
        )}
      </Link>
    )
  }

  return (
    <article className="group bg-[#1a1a2e] border border-[#2d2d5e] rounded-xl overflow-hidden hover:border-purple-500/50 transition-all card-hover">
      <Link href={`/blog/${post.slug}`}>
        <div className="relative h-48 overflow-hidden bg-[#16213e]">
          {post.featuredImage ? (
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-blue-900/30 flex items-center justify-center">
              <span className="text-4xl">🎮</span>
            </div>
          )}
          {post.categories && post.categories.length > 0 && (
            <div className="absolute top-3 left-3">
              <span className="px-2 py-1 bg-purple-600/90 text-white text-xs rounded-md font-medium backdrop-blur-sm">
                {post.categories[0].name}
              </span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h2 className="text-white font-semibold text-base line-clamp-2 group-hover:text-purple-400 transition-colors mb-2">
            {post.title}
          </h2>
          {post.excerpt && (
            <p className="text-gray-400 text-sm line-clamp-2 mb-3">
              {post.excerpt}
            </p>
          )}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-3">
              {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
              {post.readingTime && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {post.readingTime}分
                </span>
              )}
            </div>
            {typeof post.viewCount === 'number' && (
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" /> {post.viewCount.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  )
}
