'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Loader2, ExternalLink } from 'lucide-react'

interface AffiliateLink {
  id: string
  name: string
  url: string
  description?: string | null
  buttonLabel: string
  platform?: string | null
  isActive: boolean
  clickCount: number
}

export default function AdminAffiliateLinksPage() {
  const [links, setLinks] = useState<AffiliateLink[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<AffiliateLink | null>(null)
  const [formData, setFormData] = useState({ name: '', url: '', description: '', buttonLabel: '詳細を見る', platform: '', isActive: true })
  const [saving, setSaving] = useState(false)

  const fetchLinks = async () => {
    const res = await fetch('/api/affiliate-links')
    setLinks(await res.json())
    setLoading(false)
  }

  useEffect(() => { fetchLinks() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const url = editing ? `/api/affiliate-links/${editing.id}` : '/api/affiliate-links'
    const method = editing ? 'PUT' : 'POST'
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) })
    setSaving(false)
    setShowForm(false)
    setEditing(null)
    fetchLinks()
  }

  const handleEdit = (link: AffiliateLink) => {
    setEditing(link)
    setFormData({ name: link.name, url: link.url, description: link.description || '', buttonLabel: link.buttonLabel, platform: link.platform || '', isActive: link.isActive })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('削除しますか？')) return
    await fetch(`/api/affiliate-links/${id}`, { method: 'DELETE' })
    fetchLinks()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">アフィリエイトリンク</h1>
        <button onClick={() => { setShowForm(true); setEditing(null); setFormData({ name: '', url: '', description: '', buttonLabel: '詳細を見る', platform: '', isActive: true }) }} className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg">
          <Plus className="w-4 h-4" /> 追加
        </button>
      </div>

      {showForm && (
        <div className="bg-[#1a1a2e] border border-[#2d2d5e] rounded-xl p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: 'name', label: '名前', type: 'text', required: true },
                { key: 'url', label: 'URL', type: 'url', required: true },
                { key: 'buttonLabel', label: 'ボタンラベル', type: 'text', required: true },
                { key: 'platform', label: 'プラットフォーム', type: 'text' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-sm text-gray-300 mb-1">{f.label}</label>
                  <input
                    type={f.type}
                    value={formData[f.key as keyof typeof formData] as string}
                    onChange={e => setFormData(p => ({ ...p, [f.key]: e.target.value }))}
                    required={f.required}
                    className="w-full bg-[#16213e] border border-[#2d2d5e] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className="block text-sm text-gray-300 mb-1">説明</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                  className="w-full bg-[#16213e] border border-[#2d2d5e] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-50">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editing ? '更新' : '作成'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-[#16213e] border border-[#2d2d5e] text-gray-300 rounded-lg">キャンセル</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-[#1a1a2e] border border-[#2d2d5e] rounded-xl overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-500">読み込み中...</div> : (
          <table className="w-full">
            <thead className="bg-[#16213e] border-b border-[#2d2d5e]">
              <tr>
                <th className="text-left py-3 px-4 text-gray-400 text-sm">名前</th>
                <th className="text-left py-3 px-4 text-gray-400 text-sm">プラットフォーム</th>
                <th className="text-left py-3 px-4 text-gray-400 text-sm">クリック数</th>
                <th className="text-left py-3 px-4 text-gray-400 text-sm">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2d2d5e]">
              {links.map(link => (
                <tr key={link.id} className="hover:bg-[#16213e]/50">
                  <td className="py-3 px-4">
                    <div className="text-white font-medium">{link.name}</div>
                    <div className="text-gray-500 text-xs truncate max-w-xs">{link.url}</div>
                  </td>
                  <td className="py-3 px-4 text-gray-400 text-sm">{link.platform || '-'}</td>
                  <td className="py-3 px-4 text-gray-400 text-sm">{link.clickCount}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(link)} className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded">
                        <Edit className="w-4 h-4" />
                      </button>
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button onClick={() => handleDelete(link.id)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/5 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {links.length === 0 && <tr><td colSpan={4} className="py-8 text-center text-gray-500">リンクがありません</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
