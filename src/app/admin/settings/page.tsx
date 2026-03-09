'use client'

import { useState, useEffect } from 'react'
import { Save, Loader2 } from 'lucide-react'

const DEFAULT_SETTINGS = {
  siteName: 'GameLog',
  siteDescription: 'ゲーム情報・レビュー・攻略情報をお届けするゲーミングメディア',
  siteUrl: 'http://localhost:3000',
  twitterHandle: '',
  googleAnalyticsId: '',
  adsenseId: '',
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => {
        setSettings(prev => ({ ...prev, ...data }))
        setLoading(false)
      })
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (loading) return <div className="text-center py-12 text-gray-500">読み込み中...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">サイト設定</h1>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-[#1a1a2e] border border-[#2d2d5e] rounded-xl p-6">
          <h2 className="text-white font-semibold mb-4">基本設定</h2>
          <div className="space-y-4">
            {[
              { key: 'siteName', label: 'サイト名', type: 'text' },
              { key: 'siteDescription', label: 'サイト説明', type: 'text' },
              { key: 'siteUrl', label: 'サイトURL', type: 'url' },
              { key: 'twitterHandle', label: 'Twitter ハンドル', type: 'text' },
              { key: 'googleAnalyticsId', label: 'Google Analytics ID', type: 'text' },
              { key: 'adsenseId', label: 'Google AdSense ID', type: 'text' },
            ].map(field => (
              <div key={field.key}>
                <label className="block text-sm text-gray-300 mb-1">{field.label}</label>
                <input
                  type={field.type}
                  value={settings[field.key as keyof typeof settings]}
                  onChange={e => setSettings(p => ({ ...p, [field.key]: e.target.value }))}
                  className="w-full bg-[#16213e] border border-[#2d2d5e] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-50 transition-colors"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            保存する
          </button>
          {saved && <span className="text-green-400 text-sm">保存しました！</span>}
        </div>
      </form>
    </div>
  )
}
