import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import PostForm from '@/components/admin/PostForm'

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const [post, categories, tags] = await Promise.all([
    prisma.post.findUnique({
      where: { id },
      include: { categories: true, tags: true },
    }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.tag.findMany({ orderBy: { name: 'asc' } }),
  ])

  if (!post) notFound()

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">記事を編集</h1>
      <PostForm post={post} categories={categories} tags={tags} />
    </div>
  )
}
