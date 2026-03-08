import Link from 'next/link'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-9xl font-bold bg-gradient-to-r from-purple-400 to-amber-400 bg-clip-text text-transparent mb-4">
          404
        </div>
        <div className="text-6xl mb-6">🎮</div>
        <h1 className="text-2xl font-bold text-white mb-2">ページが見つかりません</h1>
        <p className="text-gray-400 mb-8">お探しのページは存在しないか、移動した可能性があります。</p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            <Home className="w-4 h-4" /> ホームへ
          </Link>
          <button
            onClick={() => history.back()}
            className="flex items-center gap-2 px-6 py-3 bg-[#1a1a2e] border border-[#2d2d5e] text-gray-300 hover:text-white rounded-lg transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> 前のページへ
          </button>
        </div>
      </div>
    </div>
  )
}
