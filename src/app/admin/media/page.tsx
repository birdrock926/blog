'use client'

import { useState, useEffect } from 'react'
import { Upload, Trash2, Copy, Check } from 'lucide-react'
import Image from 'next/image'

interface Media {
  id: string
  filename: string
  url: string
  mimeType?: string | null
  size?: number | null
  createdAt: string
}

export default function AdminMediaPage() {
  const [media, setMedia] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const fetchMedia = async () => {
    const res = await fetch('/api/media')
    setMedia(await res.json())
    setLoading(false)
  }

  useEffect(() => { fetchMedia() }, [])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    await fetch('/api/media', { method: 'POST', body: formData })
    setUploading(false)
    fetchMedia()
  }

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('このファイルを削除しますか？')) return
    // Delete from media table (file cleanup would be server-side)
    await fetch(`/api/media/${id}`, { method: 'DELETE' })
    fetchMedia()
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes}B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`
    return `${(bytes / 1024 / 1024).toFixed(1)}MB`
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">メディア管理</h1>
        <label className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg cursor-pointer transition-colors">
          <Upload className="w-4 h-4" />
          {uploading ? 'アップロード中...' : 'アップロード'}
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
        </label>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">読み込み中...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {media.map(item => (
            <div key={item.id} className="group bg-[#1a1a2e] border border-[#2d2d5e] rounded-xl overflow-hidden hover:border-purple-500/50 transition-all">
              <div className="relative h-32 bg-[#16213e]">
                {item.mimeType?.startsWith('image/') ? (
                  <Image src={item.url} alt={item.filename} fill className="object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-xs">{item.mimeType}</div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => handleCopy(item.url, item.id)} className="p-2 bg-white/10 hover:bg-white/20 rounded text-white">
                    {copiedId === item.id ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="p-2">
                <p className="text-gray-300 text-xs truncate">{item.filename}</p>
                {item.size && <p className="text-gray-600 text-xs">{formatSize(item.size)}</p>}
              </div>
            </div>
          ))}
          {media.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500">メディアがありません</div>
          )}
        </div>
      )}
    </div>
  )
}
