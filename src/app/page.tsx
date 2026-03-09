import { prisma } from '@/lib/prisma'
import HeroSection from '@/components/HeroSection'
import FeaturedPosts from '@/components/FeaturedPosts'
import ArticleGrid from '@/components/ArticleGrid'
import CategoryNav from '@/components/CategoryNav'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const revalidate = 60

export default async function HomePage() {
  const [featuredPosts, latestPosts, categories] = await Promise.all([
    prisma.post.findMany({
      where: { status: 'published', isFeatured: true },
      include: {
        author: { select: { id: true, name: true, avatar: true } },
        categories: true,
        tags: true,
      },
      orderBy: { publishedAt: 'desc' },
      take: 5,
    }),
    prisma.post.findMany({
      where: { status: 'published' },
      include: {
        author: { select: { id: true, name: true, avatar: true } },
        categories: true,
        tags: true,
      },
      orderBy: { publishedAt: 'desc' },
      take: 9,
    }),
    prisma.category.findMany({
      include: { _count: { select: { posts: true } } },
      orderBy: { name: 'asc' },
    }),
  ])

  const heroPost = featuredPosts[0] || latestPosts[0] || null
  const featuredGrid = featuredPosts.slice(1, 3)

  return (
    <div>
      <HeroSection featuredPost={heroPost} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {featuredGrid.length > 0 && (
          <FeaturedPosts posts={featuredGrid} />
        )}

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">最新記事</h2>
            <Link href="/blog" className="flex items-center gap-1 text-purple-400 hover:text-purple-300 text-sm transition-colors">
              すべて見る <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <CategoryNav categories={categories} />
          <ArticleGrid posts={latestPosts} columns={3} />
        </div>
      </div>
    </div>
  )
}
