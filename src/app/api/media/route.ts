import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function GET() {
  try {
    const media = await prisma.media.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(media)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadDir, { recursive: true })

    const timestamp = Date.now()
    const ext = path.extname(file.name)
    const basename = path.basename(file.name, ext).replace(/[^a-z0-9]/gi, '-').toLowerCase()
    const filename = `${timestamp}-${basename}${ext}`
    const filePath = path.join(uploadDir, filename)

    await writeFile(filePath, buffer)

    const url = `/uploads/${filename}`

    const media = await prisma.media.create({
      data: {
        filename: file.name,
        url,
        mimeType: file.type,
        size: file.size,
      },
    })

    return NextResponse.json(media, { status: 201 })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
