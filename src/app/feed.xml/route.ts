import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Feed } from 'feed'

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'GameLog'

  const posts = await prisma.post.findMany({
    where: { status: 'published' },
    include: {
      author: { select: { name: true, email: true } },
      categories: true,
    },
    orderBy: { publishedAt: 'desc' },
    take: 20,
  })

  const feed = new Feed({
    title: siteName,
    description: 'ゲーム情報・レビュー・攻略情報',
    id: baseUrl,
    link: baseUrl,
    language: 'ja',
    favicon: `${baseUrl}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}, ${siteName}`,
    updated: posts[0]?.publishedAt || new Date(),
    feedLinks: {
      rss2: `${baseUrl}/feed.xml`,
    },
    author: {
      name: siteName,
      link: baseUrl,
    },
  })

  posts.forEach(post => {
    feed.addItem({
      title: post.title,
      id: `${baseUrl}/blog/${post.slug}`,
      link: `${baseUrl}/blog/${post.slug}`,
      description: post.excerpt || '',
      content: post.content,
      author: [{ name: post.author.name || 'Unknown' }],
      date: post.publishedAt || post.createdAt,
      category: post.categories.map(c => ({ name: c.name })),
    })
  })

  return new NextResponse(feed.rss2(), {
    headers: { 'Content-Type': 'application/xml' },
  })
}
