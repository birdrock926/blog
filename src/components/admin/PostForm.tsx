'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Save, Loader2, X, Plus, ChevronDown, ChevronUp } from 'lucide-react'
import { createSlug } from '@/lib/slugify'

const TiptapEditor = dynamic(() => import('@/components/editor/TiptapEditor'), { ssr: false })

interface Category {
  id: string
  name: string
  slug: string
}

interface Tag {
  id: string
  name: string
  slug: string
}

interface Post {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  content: string
  status: string
  publishedAt?: Date | string | null
  featuredImage?: string | null
  featuredImageAlt?: string | null
  seoTitle?: string | null
  seoDescription?: string | null
  ogImage?: string | null
  noindex: boolean
  hasPrDisclosure: boolean
  isFeatured: boolean
  isSticky: boolean
  categories?: Category[]
  tags?: Tag[]
}

interface PostFormProps {
  post?: Post
  categories: Category[]
  tags: Tag[]
}

export default function PostForm({ post, categories, tags }: PostFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showSeo, setShowSeo] = useState(false)
  const [newTag, setNewTag] = useState('')

  const [formData, setFormData] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    status: post?.status || 'draft',
    featuredImage: post?.featuredImage || '',
    featuredImageAlt: post?.featuredImageAlt || '',
    seoTitle: post?.seoTitle || '',
    seoDescription: post?.seoDescription || '',
    ogImage: post?.ogImage || '',
    noindex: post?.noindex || false,
    hasPrDisclosure: post?.hasPrDisclosure || false,
    isFeatured: post?.isFeatured || false,
    isSticky: post?.isSticky || false,
    categoryIds: (post?.categories || []).map(c => c.id),
    tagIds: (post?.tags || []).map(t => t.id),
  })

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug || createSlug(title),
    }))
  }

  const toggleCategory = (id: string) => {
    setFormData(prev => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(id)
        ? prev.categoryIds.filter(c => c !== id)
        : [...prev.categoryIds, id],
    }))
  }

  const toggleTag = (id: string) => {
    setFormData(prev => ({
      ...prev,
      tagIds: prev.tagIds.includes(id)
        ? prev.tagIds.filter(t => t !== id)
        : [...prev.tagIds, id],
    }))
  }

  const handleAddTag = async () => {
    if (!newTag.trim()) return
    const res = await fetch('/api/tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newTag }),
    })
    if (res.ok) {
      const tag = await res.json()
      setFormData(prev => ({ ...prev, tagIds: [...prev.tagIds, tag.id] }))
      setNewTag('')
    } else {
      const err = await res.json().catch(() => ({}))
      alert(err.error || 'タグの作成に失敗しました')
    }
  }

  const handleSave = async (status?: string) => {
    setLoading(true)
    const data = { ...formData, status: status || formData.status }

    try {
      const url = post ? `/api/posts/${post.id}` : '/api/posts'
      const method = post ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        router.push('/admin/posts')
      } else {
        const err = await res.json()
        alert(err.error || `保存に失敗しました (${res.status})`)
      }
    } catch {
      alert('エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
      {/* Main content */}
      <div className="xl:col-span-3 space-y-6">
        {/* Title */}
        <div className="bg-[#1a1a2e] border border-[#2d2d5e] rounded-xl p-6">
          <input
            type="text"
            value={formData.title}
            onChange={e => handleTitleChange(e.target.value)}
            placeholder="記事タイトル"
            className="w-full bg-transparent text-white text-2xl font-bold placeholder-gray-600 focus:outline-none"
          />
          <div className="flex items-center gap-2 mt-2">
            <span className="text-gray-600 text-sm">スラッグ:</span>
            <input
              type="text"
              value={formData.slug}
              onChange={e => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              className="flex-1 bg-transparent text-gray-400 text-sm focus:outline-none focus:text-white border-b border-transparent focus:border-[#2d2d5e]"
            />
          </div>
        </div>

        {/* Content editor */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">本文</label>
          <TiptapEditor
            content={formData.content}
            onChange={content => setFormData(prev => ({ ...prev, content }))}
            placeholder="記事の内容を入力してください..."
          />
        </div>

        {/* Excerpt */}
        <div className="bg-[#1a1a2e] border border-[#2d2d5e] rounded-xl p-6">
          <label className="block text-sm text-gray-300 mb-2">抜粋</label>
          <textarea
            value={formData.excerpt}
            onChange={e => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
            rows={3}
            placeholder="記事の概要を入力..."
            className="w-full bg-[#16213e] border border-[#2d2d5e] rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 resize-none text-sm"
          />
        </div>

        {/* SEO section */}
        <div className="bg-[#1a1a2e] border border-[#2d2d5e] rounded-xl">
          <button
            type="button"
            onClick={() => setShowSeo(!showSeo)}
            className="w-full flex items-center justify-between p-5 text-left"
          >
            <span className="text-white font-medium">SEO設定</span>
            {showSeo ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </button>
          {showSeo && (
            <div className="px-6 pb-6 space-y-4 border-t border-[#2d2d5e] pt-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">SEOタイトル</label>
                <input
                  type="text"
                  value={formData.seoTitle}
                  onChange={e => setFormData(prev => ({ ...prev, seoTitle: e.target.value }))}
                  className="w-full bg-[#16213e] border border-[#2d2d5e] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">メタディスクリプション</label>
                <textarea
                  value={formData.seoDescription}
                  onChange={e => setFormData(prev => ({ ...prev, seoDescription: e.target.value }))}
                  rows={3}
                  className="w-full bg-[#16213e] border border-[#2d2d5e] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500 resize-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">OGP画像URL</label>
                <input
                  type="text"
                  value={formData.ogImage}
                  onChange={e => setFormData(prev => ({ ...prev, ogImage: e.target.value }))}
                  className="w-full bg-[#16213e] border border-[#2d2d5e] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500 text-sm"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.noindex}
                  onChange={e => setFormData(prev => ({ ...prev, noindex: e.target.checked }))}
                  className="w-4 h-4 rounded border-gray-600"
                />
                <span className="text-gray-300 text-sm">インデックスしない (noindex)</span>
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="xl:col-span-1 space-y-4">
        {/* Publish */}
        <div className="bg-[#1a1a2e] border border-[#2d2d5e] rounded-xl p-5">
          <h3 className="text-white font-medium mb-4">公開設定</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">ステータス</label>
              <select
                value={formData.status}
                onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))}
                className="w-full bg-[#16213e] border border-[#2d2d5e] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500 text-sm"
              >
                <option value="draft">下書き</option>
                <option value="published">公開</option>
                <option value="private">非公開</option>
              </select>
            </div>
            <button
              type="button"
              onClick={() => handleSave()}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              保存する
            </button>
            {formData.status !== 'published' && (
              <button
                type="button"
                onClick={() => handleSave('published')}
                disabled={loading}
                className="w-full py-2.5 border border-green-500/30 text-green-400 hover:bg-green-500/10 rounded-lg font-medium transition-colors text-sm disabled:opacity-50"
              >
                公開する
              </button>
            )}
          </div>
        </div>

        {/* Featured image */}
        <div className="bg-[#1a1a2e] border border-[#2d2d5e] rounded-xl p-5">
          <h3 className="text-white font-medium mb-3">アイキャッチ画像</h3>
          <input
            type="text"
            value={formData.featuredImage}
            onChange={e => setFormData(prev => ({ ...prev, featuredImage: e.target.value }))}
            placeholder="画像URLを入力"
            className="w-full bg-[#16213e] border border-[#2d2d5e] rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 text-sm mb-2"
          />
          <input
            type="text"
            value={formData.featuredImageAlt}
            onChange={e => setFormData(prev => ({ ...prev, featuredImageAlt: e.target.value }))}
            placeholder="代替テキスト"
            className="w-full bg-[#16213e] border border-[#2d2d5e] rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 text-sm"
          />
          {formData.featuredImage && (
            <div className="mt-3 relative">
              <img src={formData.featuredImage} alt="preview" className="w-full h-32 object-cover rounded-lg" />
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, featuredImage: '' }))}
                className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded hover:bg-black/80"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Categories */}
        <div className="bg-[#1a1a2e] border border-[#2d2d5e] rounded-xl p-5">
          <h3 className="text-white font-medium mb-3">カテゴリ</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {categories.map(cat => (
              <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.categoryIds.includes(cat.id)}
                  onChange={() => toggleCategory(cat.id)}
                  className="w-4 h-4 rounded"
                />
                <span className="text-gray-300 text-sm">{cat.name}</span>
              </label>
            ))}
            {categories.length === 0 && (
              <p className="text-gray-600 text-sm">カテゴリがありません</p>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="bg-[#1a1a2e] border border-[#2d2d5e] rounded-xl p-5">
          <h3 className="text-white font-medium mb-3">タグ</h3>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newTag}
              onChange={e => setNewTag(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              placeholder="新しいタグ"
              className="flex-1 bg-[#16213e] border border-[#2d2d5e] rounded-lg px-2 py-1.5 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 text-xs"
            />
            <button type="button" onClick={handleAddTag} className="p-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg">
              <Plus className="w-3 h-3" />
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
            {tags.map(tag => (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleTag(tag.id)}
                className={`px-2 py-1 rounded-full text-xs transition-all ${
                  formData.tagIds.includes(tag.id)
                    ? 'bg-purple-600 text-white'
                    : 'bg-[#16213e] border border-[#2d2d5e] text-gray-400 hover:text-white'
                }`}
              >
                #{tag.name}
              </button>
            ))}
          </div>
        </div>

        {/* Options */}
        <div className="bg-[#1a1a2e] border border-[#2d2d5e] rounded-xl p-5">
          <h3 className="text-white font-medium mb-3">オプション</h3>
          <div className="space-y-2">
            {[
              { key: 'isFeatured', label: 'おすすめ記事' },
              { key: 'isSticky', label: 'トップに固定' },
              { key: 'hasPrDisclosure', label: 'PR表記を表示' },
            ].map(opt => (
              <label key={opt.key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData[opt.key as keyof typeof formData] as boolean}
                  onChange={e => setFormData(prev => ({ ...prev, [opt.key]: e.target.checked }))}
                  className="w-4 h-4 rounded"
                />
                <span className="text-gray-300 text-sm">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
