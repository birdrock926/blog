import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Edit, Eye, Trash2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({
    include: {
      author: { select: { name: true } },
      categories: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">記事管理</h1>
          <p className="text-gray-400 text-sm mt-1">全{posts.length}件の記事</p>
        </div>
        <Link href="/admin/posts/new" className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
          <Plus className="w-4 h-4" /> 新規作成
        </Link>
      </div>

      <div className="bg-[#1a1a2e] border border-[#2d2d5e] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#16213e] border-b border-[#2d2d5e]">
              <tr>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">タイトル</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">ステータス</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">カテゴリ</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">作成日</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">PV</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2d2d5e]">
              {posts.map(post => (
                <tr key={post.id} className="hover:bg-[#16213e]/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-medium text-white line-clamp-1 max-w-xs">{post.title}</div>
                    <div className="text-gray-500 text-xs mt-0.5">/blog/{post.slug}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      post.status === 'published' ? 'bg-green-500/20 text-green-400' :
                      post.status === 'draft' ? 'bg-gray-500/20 text-gray-400' :
                      'bg-amber-500/20 text-amber-400'
                    }`}>
                      {post.status === 'published' ? '公開' : post.status === 'draft' ? '下書き' : post.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {post.categories.map(c => (
                        <span key={c.id} className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded">{c.name}</span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-400 text-sm whitespace-nowrap">
                    {formatDate(post.createdAt)}
                  </td>
                  <td className="py-3 px-4 text-gray-400 text-sm">{post.viewCount}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/posts/${post.id}/edit`} className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded transition-all">
                        <Edit className="w-4 h-4" />
                      </Link>
                      {post.status === 'published' && (
                        <Link href={`/blog/${post.slug}`} target="_blank" className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded transition-all">
                          <Eye className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    記事がありません
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
