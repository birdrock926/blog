import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createSlug } from '@/lib/slugify'
import { calculateReadingTime } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const tag = searchParams.get('tag')
    const featured = searchParams.get('featured')
    const search = searchParams.get('search')
    const skip = (page - 1) * limit

    const where: any = {}
    
    if (status) where.status = status
    else where.status = 'published'
    
    if (category) {
      where.categories = { some: { slug: category } }
    }
    
    if (tag) {
      where.tags = { some: { slug: tag } }
    }
    
    if (featured === 'true') where.isFeatured = true
    
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } },
        { content: { contains: search } },
      ]
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: { select: { id: true, name: true, email: true, avatar: true } },
          categories: true,
          tags: true,
        },
        orderBy: [
          { isSticky: 'desc' },
          { publishedAt: 'desc' },
          { createdAt: 'desc' },
        ],
        skip,
        take: limit,
      }),
      prisma.post.count({ where }),
    ])

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      title,
      slug: rawSlug,
      excerpt,
      content,
      status,
      publishedAt,
      scheduledAt,
      featuredImage,
      featuredImageAlt,
      seoTitle,
      seoDescription,
      ogImage,
      noindex,
      hasPrDisclosure,
      isFeatured,
      isSticky,
      categoryIds,
      tagIds,
    } = body

    const slug = rawSlug || createSlug(title)
    const readingTime = calculateReadingTime(content)

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        status: status || 'draft',
        publishedAt: publishedAt ? new Date(publishedAt) : status === 'published' ? new Date() : null,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        featuredImage,
        featuredImageAlt,
        seoTitle,
        seoDescription,
        ogImage,
        noindex: noindex || false,
        hasPrDisclosure: hasPrDisclosure || false,
        readingTime,
        isFeatured: isFeatured || false,
        isSticky: isSticky || false,
        authorId: (session.user as any).id,
        categories: categoryIds ? { connect: categoryIds.map((id: string) => ({ id })) } : undefined,
        tags: tagIds ? { connect: tagIds.map((id: string) => ({ id })) } : undefined,
      },
      include: {
        author: { select: { id: true, name: true, email: true, avatar: true } },
        categories: true,
        tags: true,
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error: any) {
    console.error('Error creating post:', error)
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
