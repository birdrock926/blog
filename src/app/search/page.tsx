import { prisma } from '@/lib/prisma'
import ArticleGrid from '@/components/ArticleGrid'
import SearchBar from '@/components/SearchBar'
import BreadCrumb from '@/components/BreadCrumb'
import type { Metadata } from 'next'

interface Props {
  searchParams: Promise<{ q?: string }>
}

export const metadata: Metadata = {
  title: '検索',
  robots: { index: false },
}

export default async function SearchPage({ searchParams }: Props) {
  const sp = await searchParams
  const query = sp.q || ''

  let posts: any[] = []
  let total = 0

  if (query.length >= 2) {
    const where = {
      status: 'published',
      OR: [
        { title: { contains: query } },
        { excerpt: { contains: query } },
        { content: { contains: query } },
      ],
    }

    ;[posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: { select: { id: true, name: true, avatar: true } },
          categories: true,
          tags: true,
        },
        orderBy: { publishedAt: 'desc' },
        take: 20,
      }),
      prisma.post.count({ where }),
    ])
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BreadCrumb items={[{ label: '検索' }]} />
      
      <h1 className="text-3xl font-bold text-white mb-6">検索</h1>
      <SearchBar className="max-w-2xl mb-8" />

      {query && (
        <div className="mb-6">
          <p className="text-gray-400">
            「<span className="text-white font-medium">{query}</span>」の検索結果: {total}件
          </p>
        </div>
      )}

      {query && posts.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-400">検索結果が見つかりませんでした</p>
          <p className="text-gray-600 text-sm mt-2">別のキーワードで検索してみてください</p>
        </div>
      )}

      {posts.length > 0 && <ArticleGrid posts={posts} columns={3} />}
    </div>
  )
}
