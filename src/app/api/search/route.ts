import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')
    
    if (!q || q.length < 2) {
      return NextResponse.json({ posts: [] })
    }

    const posts = await prisma.post.findMany({
      where: {
        status: 'published',
        OR: [
          { title: { contains: q } },
          { excerpt: { contains: q } },
          { content: { contains: q } },
        ],
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        featuredImage: true,
        publishedAt: true,
        readingTime: true,
        categories: { select: { id: true, name: true, slug: true } },
      },
      take: 10,
      orderBy: { publishedAt: 'desc' },
    })

    return NextResponse.json({ posts })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
