import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import BreadCrumb from '@/components/BreadCrumb'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = await prisma.page.findUnique({ where: { slug } })
  if (!page) return { title: 'ページが見つかりません' }
  return {
    title: page.seoTitle || page.title,
    description: page.seoDescription || undefined,
    robots: page.noindex ? { index: false } : undefined,
  }
}

export default async function StaticPage({ params }: Props) {
  const { slug } = await params
  
  const reservedSlugs = ['blog', 'admin', 'category', 'tag', 'search', 'api', 'privacy', 'terms', 'contact', 'tokushoho']
  if (reservedSlugs.includes(slug)) notFound()

  const page = await prisma.page.findUnique({
    where: { slug, status: 'published' },
  })

  if (!page) notFound()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BreadCrumb items={[{ label: page.title }]} />
      <div className="bg-[#1a1a2e] border border-[#2d2d5e] rounded-xl p-8">
        <h1 className="text-3xl font-bold text-white mb-8">{page.title}</h1>
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: page.content }} />
      </div>
    </div>
  )
}
