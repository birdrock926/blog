import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createSlug } from '@/lib/slugify'

export async function GET() {
  try {
    const pages = await prisma.page.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(pages)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { title, slug: rawSlug, content, status, seoTitle, seoDescription, noindex } = body
    const slug = rawSlug || createSlug(title)

    const page = await prisma.page.create({
      data: { title, slug, content, status: status || 'published', seoTitle, seoDescription, noindex: noindex || false },
    })
    return NextResponse.json(page, { status: 201 })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
