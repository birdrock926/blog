import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Clock } from 'lucide-react'
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

export default function HeroSection({ featuredPost }: { featuredPost: Post | null }) {
  if (!featuredPost) {
    return (
      <div className="relative min-h-[500px] bg-gradient-to-br from-[#0f0f1a] via-[#1a1a2e] to-[#16213e] flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-6">🎮</div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-amber-400 bg-clip-text text-transparent">
            GameLog
          </h1>
          <p className="text-gray-400 text-lg mb-8">ゲーム情報・レビュー・攻略情報をお届け</p>
          <Link href="/blog" className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-purple-500/30">
            記事を見る <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-[500px] overflow-hidden">
      {featuredPost.featuredImage && (
        <div className="absolute inset-0">
          <Image src={featuredPost.featuredImage} alt={featuredPost.title} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f1a] via-[#0f0f1a]/60 to-transparent" />
        </div>
      )}
      {!featuredPost.featuredImage && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f0f1a] via-[#1a1a2e] to-[#16213e]">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #7c3aed 0%, transparent 70%)' }} />
        </div>
      )}
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <div className="max-w-3xl">
          {featuredPost.categories && featuredPost.categories.length > 0 && (
            <Link href={`/category/${featuredPost.categories[0].slug}`} className="inline-block px-3 py-1 bg-purple-600/80 text-white text-sm rounded-full mb-4 hover:bg-purple-500 transition-colors">
              {featuredPost.categories[0].name}
            </Link>
          )}
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
            {featuredPost.title}
          </h1>
          {featuredPost.excerpt && (
            <p className="text-gray-300 text-lg mb-6 leading-relaxed line-clamp-3">
              {featuredPost.excerpt}
            </p>
          )}
          <div className="flex items-center gap-4 mb-8 text-gray-400 text-sm">
            {featuredPost.publishedAt && <span>{formatDate(featuredPost.publishedAt)}</span>}
            {featuredPost.readingTime && (
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" /> {featuredPost.readingTime}分で読める
              </span>
            )}
          </div>
          <Link href={`/blog/${featuredPost.slug}`} className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-purple-500/30">
            記事を読む <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
