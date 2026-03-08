'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  description?: string | null
  color?: string | null
  _count?: { posts: number }
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [formData, setFormData] = useState({ name: '', slug: '', description: '', color: '#7c3aed' })
  const [saving, setSaving] = useState(false)

  const fetchCategories = async () => {
    const res = await fetch('/api/categories')
    const data = await res.json()
    setCategories(data)
    setLoading(false)
  }

  useEffect(() => { fetchCategories() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    const url = editing ? `/api/categories/${editing.id}` : '/api/categories'
    const method = editing ? 'PUT' : 'POST'
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
    
    setSaving(false)
    setShowForm(false)
    setEditing(null)
    setFormData({ name: '', slug: '', description: '', color: '#7c3aed' })
    fetchCategories()
  }

  const handleEdit = (cat: Category) => {
    setEditing(cat)
    setFormData({ name: cat.name, slug: cat.slug, description: cat.description || '', color: cat.color || '#7c3aed' })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('このカテゴリを削除しますか？')) return
    await fetch(`/api/categories/${id}`, { method: 'DELETE' })
    fetchCategories()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">カテゴリ管理</h1>
        <button
          onClick={() => { setShowForm(true); setEditing(null); setFormData({ name: '', slug: '', description: '', color: '#7c3aed' }) }}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
        >
          <Plus className="w-4 h-4" /> 追加
        </button>
      </div>

      {showForm && (
        <div className="bg-[#1a1a2e] border border-[#2d2d5e] rounded-xl p-6 mb-6">
          <h2 className="text-white font-semibold mb-4">{editing ? '編集' : '新規カテゴリ'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">カテゴリ名 *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                  required
                  className="w-full bg-[#16213e] border border-[#2d2d5e] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">スラッグ</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={e => setFormData(p => ({ ...p, slug: e.target.value }))}
                  className="w-full bg-[#16213e] border border-[#2d2d5e] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">説明</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                  className="w-full bg-[#16213e] border border-[#2d2d5e] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">カラー</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.color}
                    onChange={e => setFormData(p => ({ ...p, color: e.target.value }))}
                    className="h-10 w-16 bg-[#16213e] border border-[#2d2d5e] rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.color}
                    onChange={e => setFormData(p => ({ ...p, color: e.target.value }))}
                    className="flex-1 bg-[#16213e] border border-[#2d2d5e] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-50">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editing ? '更新' : '作成'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-[#16213e] border border-[#2d2d5e] text-gray-300 rounded-lg hover:text-white">
                キャンセル
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-[#1a1a2e] border border-[#2d2d5e] rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">読み込み中...</div>
        ) : (
          <table className="w-full">
            <thead className="bg-[#16213e] border-b border-[#2d2d5e]">
              <tr>
                <th className="text-left py-3 px-4 text-gray-400 text-sm">カテゴリ名</th>
                <th className="text-left py-3 px-4 text-gray-400 text-sm">スラッグ</th>
                <th className="text-left py-3 px-4 text-gray-400 text-sm">記事数</th>
                <th className="text-left py-3 px-4 text-gray-400 text-sm">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2d2d5e]">
              {categories.map(cat => (
                <tr key={cat.id} className="hover:bg-[#16213e]/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {cat.color && <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />}
                      <span className="text-white">{cat.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-400 text-sm">{cat.slug}</td>
                  <td className="py-3 px-4 text-gray-400 text-sm">{cat._count?.posts || 0}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(cat)} className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(cat.id)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/5 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr><td colSpan={4} className="py-8 text-center text-gray-500">カテゴリがありません</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
