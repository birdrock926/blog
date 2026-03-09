import { prisma } from '@/lib/prisma'
import { FileText, FolderOpen, Tag, Image, TrendingUp, Eye } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
  const [postCount, categoryCount, tagCount, mediaCount, recentPosts] = await Promise.all([
    prisma.post.count(),
    prisma.category.count(),
    prisma.tag.count(),
    prisma.media.count(),
    prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { categories: true },
    }),
  ])

  const stats = [
    { label: '記事数', value: postCount, icon: FileText, href: '/admin/posts', color: 'text-purple-400' },
    { label: 'カテゴリ', value: categoryCount, icon: FolderOpen, href: '/admin/categories', color: 'text-blue-400' },
    { label: 'タグ', value: tagCount, icon: Tag, href: '/admin/tags', color: 'text-green-400' },
    { label: 'メディア', value: mediaCount, icon: Image, href: '/admin/media', color: 'text-amber-400' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">ダッシュボード</h1>
        <p className="text-gray-400 text-sm mt-1">サイトの概要</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(stat => {
          const Icon = stat.icon
          return (
            <Link key={stat.label} href={stat.href} className="bg-[#1a1a2e] border border-[#2d2d5e] rounded-xl p-5 hover:border-purple-500/50 transition-all group">
              <div className="flex items-center justify-between mb-3">
                <Icon className={`w-6 h-6 ${stat.color}`} />
                <TrendingUp className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </Link>
          )
        })}
      </div>

      <div className="bg-[#1a1a2e] border border-[#2d2d5e] rounded-xl">
        <div className="flex items-center justify-between p-5 border-b border-[#2d2d5e]">
          <h2 className="text-white font-semibold">最近の記事</h2>
          <Link href="/admin/posts/new" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors">
            新規作成
          </Link>
        </div>
        <div className="divide-y divide-[#2d2d5e]">
          {recentPosts.map(post => (
            <div key={post.id} className="p-4 flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <Link href={`/admin/posts/${post.id}/edit`} className="text-white hover:text-purple-400 font-medium transition-colors line-clamp-1">
                  {post.title}
                </Link>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    post.status === 'published' ? 'bg-green-500/20 text-green-400' :
                    post.status === 'draft' ? 'bg-gray-500/20 text-gray-400' :
                    'bg-amber-500/20 text-amber-400'
                  }`}>
                    {post.status === 'published' ? '公開' : post.status === 'draft' ? '下書き' : post.status}
                  </span>
                  {post.categories.map(c => (
                    <span key={c.id} className="text-xs text-gray-500">{c.name}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-500 text-sm ml-4">
                <Eye className="w-4 h-4" />
                <span>{post.viewCount}</span>
              </div>
            </div>
          ))}
          {recentPosts.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <p>記事がありません</p>
              <Link href="/admin/posts/new" className="text-purple-400 hover:text-purple-300 text-sm mt-2 inline-block">
                最初の記事を作成する →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
