import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ArticleGrid from '@/components/ArticleGrid'
import PaginationNav from '@/components/PaginationNav'
import BreadCrumb from '@/components/BreadCrumb'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const tag = await prisma.tag.findUnique({ where: { slug } })
  if (!tag) return { title: 'タグが見つかりません' }
  return { title: `#${tag.name}`, description: `${tag.name}に関する記事一覧` }
}

const POSTS_PER_PAGE = 12

export default async function TagPage({ params, searchParams }: Props) {
  const { slug } = await params
  const sp = await searchParams
  const page = parseInt(sp.page || '1')

  const tag = await prisma.tag.findUnique({ where: { slug } })
  if (!tag) notFound()

  const skip = (page - 1) * POSTS_PER_PAGE
  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: { status: 'published', tags: { some: { slug } } },
      include: {
        author: { select: { id: true, name: true, avatar: true } },
        categories: true,
        tags: true,
      },
      orderBy: { publishedAt: 'desc' },
      skip,
      take: POSTS_PER_PAGE,
    }),
    prisma.post.count({ where: { status: 'published', tags: { some: { slug } } } }),
  ])

  const totalPages = Math.ceil(total / POSTS_PER_PAGE)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BreadCrumb items={[{ label: '記事一覧', href: '/blog' }, { label: `#${tag.name}` }]} />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">#{tag.name}</h1>
        <p className="text-gray-500 text-sm">全{total}件の記事</p>
      </div>

      <ArticleGrid posts={posts} columns={3} />
      <PaginationNav currentPage={page} totalPages={totalPages} basePath={`/tag/${slug}`} />
    </div>
  )
}
