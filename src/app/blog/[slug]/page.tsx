import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import type { Metadata } from 'next'
import BreadCrumb from '@/components/BreadCrumb'
import AuthorCard from '@/components/AuthorCard'
import RelatedPosts from '@/components/RelatedPosts'
import SnsShareButtons from '@/components/SnsShareButtons'
import PrDisclosure from '@/components/PrDisclosure'
import TableOfContents from '@/components/TableOfContents'
import { formatDate } from '@/lib/utils'
import { Clock, Eye, Calendar } from 'lucide-react'
import Link from 'next/link'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await prisma.post.findUnique({ where: { slug } })
  if (!post) return { title: '記事が見つかりません' }

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt || undefined,
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt || undefined,
      images: post.ogImage || post.featuredImage ? [{ url: (post.ogImage || post.featuredImage)! }] : undefined,
    },
    robots: post.noindex ? { index: false } : undefined,
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  
  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      author: { select: { id: true, name: true, email: true, bio: true, avatar: true, twitterUrl: true } },
      categories: true,
      tags: true,
      relatedPosts: {
        where: { status: 'published' },
        select: {
          id: true, title: true, slug: true, excerpt: true, featuredImage: true,
          publishedAt: true, categories: true, readingTime: true,
        },
        take: 3,
      },
    },
  })

  if (!post || post.status !== 'published') {
    notFound()
  }

  // Increment view count
  await prisma.post.update({
    where: { id: post.id },
    data: { viewCount: { increment: 1 } },
  })

  const absoluteUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      '@type': 'Person',
      name: post.author.name,
    },
    publisher: {
      '@type': 'Organization',
      name: process.env.NEXT_PUBLIC_SITE_NAME || 'GameLog',
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BreadCrumb
          items={[
            { label: '記事一覧', href: '/blog' },
            ...(post.categories.length > 0 ? [{ label: post.categories[0].name, href: `/category/${post.categories[0].slug}` }] : []),
            { label: post.title },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <article className="lg:col-span-3">
            {post.hasPrDisclosure && <PrDisclosure />}

            {post.featuredImage && (
              <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-8">
                <Image
                  src={post.featuredImage}
                  alt={post.featuredImageAlt || post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            <div className="flex flex-wrap gap-2 mb-4">
              {post.categories.map(cat => (
                <Link key={cat.id} href={`/category/${cat.slug}`} className="px-3 py-1 bg-purple-600/20 text-purple-300 border border-purple-500/30 rounded-full text-sm hover:bg-purple-600/30 transition-colors">
                  {cat.name}
                </Link>
              ))}
            </div>

            <h1 className="text-2xl md:text-4xl font-bold text-white mb-4 leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm mb-8 pb-8 border-b border-[#2d2d5e]">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(post.publishedAt || post.createdAt)}
              </span>
              {post.readingTime && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {post.readingTime}分で読める
                </span>
              )}
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" /> {post.viewCount.toLocaleString()}回閲覧
              </span>
            </div>

            <TableOfContents content={post.content} />

            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <SnsShareButtons url={absoluteUrl} title={post.title} />

            <div className="flex flex-wrap gap-2 mt-8">
              {post.tags.map(tag => (
                <Link key={tag.id} href={`/tag/${tag.slug}`} className="px-3 py-1 bg-[#1a1a2e] border border-[#2d2d5e] rounded-full text-xs text-gray-400 hover:text-purple-400 hover:border-purple-500/50 transition-all">
                  #{tag.name}
                </Link>
              ))}
            </div>

            <div className="mt-8">
              <AuthorCard author={post.author} />
            </div>

            <RelatedPosts posts={post.relatedPosts} />
          </article>

          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-[#1a1a2e] border border-[#2d2d5e] rounded-xl p-5">
                <h3 className="text-white font-semibold mb-3 text-sm">この記事のカテゴリ</h3>
                <div className="space-y-2">
                  {post.categories.map(cat => (
                    <Link key={cat.id} href={`/category/${cat.slug}`} className="block text-gray-300 hover:text-purple-400 text-sm transition-colors">
                      → {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
