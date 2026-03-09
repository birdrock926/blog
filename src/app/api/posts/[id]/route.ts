import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { calculateReadingTime } from '@/lib/utils'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const post = await prisma.post.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        author: { select: { id: true, name: true, email: true, avatar: true, bio: true, twitterUrl: true } },
        categories: true,
        tags: true,
        relatedPosts: {
          where: { status: 'published' },
          select: {
            id: true, title: true, slug: true, excerpt: true, featuredImage: true, publishedAt: true,
            categories: true, readingTime: true,
          },
          take: 3,
        },
      },
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const {
      title,
      slug,
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

    const existing = await prisma.post.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const readingTime = content ? calculateReadingTime(content) : existing.readingTime

    const post = await prisma.post.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(slug && { slug }),
        ...(excerpt !== undefined && { excerpt }),
        ...(content && { content, readingTime }),
        ...(status && { status }),
        ...(publishedAt !== undefined && { publishedAt: publishedAt ? new Date(publishedAt) : null }),
        ...(scheduledAt !== undefined && { scheduledAt: scheduledAt ? new Date(scheduledAt) : null }),
        ...(featuredImage !== undefined && { featuredImage }),
        ...(featuredImageAlt !== undefined && { featuredImageAlt }),
        ...(seoTitle !== undefined && { seoTitle }),
        ...(seoDescription !== undefined && { seoDescription }),
        ...(ogImage !== undefined && { ogImage }),
        ...(noindex !== undefined && { noindex }),
        ...(hasPrDisclosure !== undefined && { hasPrDisclosure }),
        ...(isFeatured !== undefined && { isFeatured }),
        ...(isSticky !== undefined && { isSticky }),
        categories: categoryIds ? {
          set: [],
          connect: categoryIds.map((cid: string) => ({ id: cid })),
        } : undefined,
        tags: tagIds ? {
          set: [],
          connect: tagIds.map((tid: string) => ({ id: tid })),
        } : undefined,
      },
      include: {
        author: { select: { id: true, name: true, email: true, avatar: true } },
        categories: true,
        tags: true,
      },
    })

    return NextResponse.json(post)
  } catch (error: any) {
    console.error('Error updating post:', error)
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    await prisma.post.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
