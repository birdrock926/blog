import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const posts = await prisma.post.findMany({
    where: { status: 'published' },
    select: { slug: true, updatedAt: true },
    orderBy: { updatedAt: 'desc' },
  })

  const categories = await prisma.category.findMany({
    select: { slug: true, updatedAt: true },
  })

  const tags = await prisma.tag.findMany({
    select: { slug: true, updatedAt: true },
  })

  const staticPages = [
    { url: '', lastmod: new Date().toISOString() },
    { url: '/blog', lastmod: new Date().toISOString() },
    { url: '/privacy', lastmod: new Date().toISOString() },
    { url: '/terms', lastmod: new Date().toISOString() },
    { url: '/contact', lastmod: new Date().toISOString() },
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages.map(p => `
  <url>
    <loc>${baseUrl}${p.url}</loc>
    <lastmod>${p.lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${p.url === '' ? '1.0' : '0.8'}</priority>
  </url>`).join('')}
  ${posts.map(p => `
  <url>
    <loc>${baseUrl}/blog/${p.slug}</loc>
    <lastmod>${p.updatedAt.toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}
  ${categories.map(c => `
  <url>
    <loc>${baseUrl}/category/${c.slug}</loc>
    <lastmod>${c.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`).join('')}
  ${tags.map(t => `
  <url>
    <loc>${baseUrl}/tag/${t.slug}</loc>
    <lastmod>${t.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>`).join('')}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
