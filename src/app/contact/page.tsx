import type { Metadata } from 'next'
import BreadCrumb from '@/components/BreadCrumb'

export const metadata: Metadata = {
  title: 'お問い合わせ',
}

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BreadCrumb items={[{ label: 'お問い合わせ' }]} />
      <div className="bg-[#1a1a2e] border border-[#2d2d5e] rounded-xl p-8">
        <h1 className="text-3xl font-bold text-white mb-2">お問い合わせ</h1>
        <p className="text-gray-400 mb-8">ご質問・ご要望はこちらのフォームからお気軽にどうぞ。</p>
        
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">お名前</label>
            <input
              type="text"
              className="w-full bg-[#16213e] border border-[#2d2d5e] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              placeholder="山田太郎"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">メールアドレス</label>
            <input
              type="email"
              className="w-full bg-[#16213e] border border-[#2d2d5e] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              placeholder="example@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">件名</label>
            <input
              type="text"
              className="w-full bg-[#16213e] border border-[#2d2d5e] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              placeholder="お問い合わせの件名"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">メッセージ</label>
            <textarea
              rows={6}
              className="w-full bg-[#16213e] border border-[#2d2d5e] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
              placeholder="お問い合わせ内容をご記入ください"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
          >
            送信する
          </button>
        </form>
      </div>
    </div>
  )
}
