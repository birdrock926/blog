import { prisma } from '@/lib/prisma'
import ArticleGrid from '@/components/ArticleGrid'
import PaginationNav from '@/components/PaginationNav'
import CategoryNav from '@/components/CategoryNav'
import Sidebar from '@/components/Sidebar'
import BreadCrumb from '@/components/BreadCrumb'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '記事一覧',
  description: '最新のゲーム情報、レビュー、攻略情報をまとめています',
}

const POSTS_PER_PAGE = 12

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const params = await searchParams
  const page = parseInt(params.page || '1')
  const skip = (page - 1) * POSTS_PER_PAGE

  const [posts, total, categories, popularPosts, tags] = await Promise.all([
    prisma.post.findMany({
      where: { status: 'published' },
      include: {
        author: { select: { id: true, name: true, avatar: true } },
        categories: true,
        tags: true,
      },
      orderBy: [{ isSticky: 'desc' }, { publishedAt: 'desc' }],
      skip,
      take: POSTS_PER_PAGE,
    }),
    prisma.post.count({ where: { status: 'published' } }),
    prisma.category.findMany({ include: { _count: { select: { posts: true } } } }),
    prisma.post.findMany({
      where: { status: 'published' },
      orderBy: { viewCount: 'desc' },
      take: 5,
      select: { id: true, title: true, slug: true, viewCount: true, publishedAt: true },
    }),
    prisma.tag.findMany({ include: { _count: { select: { posts: true } } }, take: 20 }),
  ])

  const totalPages = Math.ceil(total / POSTS_PER_PAGE)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BreadCrumb items={[{ label: '記事一覧' }]} />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">記事一覧</h1>
        <p className="text-gray-400">全{total}件の記事</p>
      </div>

      <CategoryNav categories={categories} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <ArticleGrid posts={posts} columns={3} />
          <PaginationNav currentPage={page} totalPages={totalPages} basePath="/blog" />
        </div>
        <div className="lg:col-span-1">
          <Sidebar popularPosts={popularPosts} categories={categories} tags={tags} />
        </div>
      </div>
    </div>
  )
}
