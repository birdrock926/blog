'use client'

import { useEffect } from 'react'
import { RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-6xl mb-6">⚠️</div>
        <h1 className="text-2xl font-bold text-white mb-2">エラーが発生しました</h1>
        <p className="text-gray-400 mb-8">申し訳ありません。予期しないエラーが発生しました。</p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> 再試行
          </button>
          <Link href="/" className="flex items-center gap-2 px-6 py-3 bg-[#1a1a2e] border border-[#2d2d5e] text-gray-300 hover:text-white rounded-lg transition-all">
            <Home className="w-4 h-4" /> ホームへ
          </Link>
        </div>
      </div>
    </div>
  )
}
