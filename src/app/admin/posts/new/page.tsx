import { prisma } from '@/lib/prisma'
import PostForm from '@/components/admin/PostForm'

export default async function NewPostPage() {
  const [categories, tags] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.tag.findMany({ orderBy: { name: 'asc' } }),
  ])

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">新規記事作成</h1>
      <PostForm categories={categories} tags={tags} />
    </div>
  )
}
