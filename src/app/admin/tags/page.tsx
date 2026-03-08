'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Loader2 } from 'lucide-react'

interface Tag {
  id: string
  name: string
  slug: string
  _count?: { posts: number }
}

export default function AdminTagsPage() {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)

  const fetchTags = async () => {
    const res = await fetch('/api/tags')
    setTags(await res.json())
    setLoading(false)
  }

  useEffect(() => { fetchTags() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await fetch('/api/tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    setName('')
    setSaving(false)
    fetchTags()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('このタグを削除しますか？')) return
    await fetch(`/api/tags/${id}`, { method: 'DELETE' })
    fetchTags()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">タグ管理</h1>

      <div className="bg-[#1a1a2e] border border-[#2d2d5e] rounded-xl p-6 mb-6">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="タグ名を入力"
            required
            className="flex-1 bg-[#16213e] border border-[#2d2d5e] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
          />
          <button type="submit" disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            追加
          </button>
        </form>
      </div>

      <div className="bg-[#1a1a2e] border border-[#2d2d5e] rounded-xl p-6">
        {loading ? (
          <div className="text-center text-gray-500">読み込み中...</div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <div key={tag.id} className="flex items-center gap-2 px-3 py-1.5 bg-[#16213e] border border-[#2d2d5e] rounded-full">
                <span className="text-gray-300 text-sm">#{tag.name}</span>
                {tag._count && <span className="text-gray-600 text-xs">({tag._count.posts})</span>}
                <button onClick={() => handleDelete(tag.id)} className="text-gray-600 hover:text-red-400 transition-colors">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
            {tags.length === 0 && <p className="text-gray-500">タグがありません</p>}
          </div>
        )}
      </div>
    </div>
  )
}
