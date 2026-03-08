import Link from 'next/link'
import { Gamepad2, Twitter, Rss } from 'lucide-react'

export default function Footer() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'GameLog'
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#0a0a14] border-t border-[#2d2d5e] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-900 rounded-lg flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-amber-400 bg-clip-text text-transparent">
                {siteName}
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              ゲームの最新情報、レビュー、攻略情報をお届けするゲーミングメディアです。
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a
                href="/feed.xml"
                className="p-2 bg-[#1a1a2e] border border-[#2d2d5e] rounded-lg text-gray-400 hover:text-amber-400 hover:border-amber-400/30 transition-all"
                aria-label="RSS Feed"
              >
                <Rss className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">コンテンツ</h3>
            <ul className="space-y-2">
              {[
                { href: '/', label: 'ホーム' },
                { href: '/blog', label: '記事一覧' },
                { href: '/search', label: '検索' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-purple-400 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">サイト情報</h3>
            <ul className="space-y-2">
              {[
                { href: '/privacy', label: 'プライバシーポリシー' },
                { href: '/terms', label: '利用規約' },
                { href: '/tokushoho', label: '特定商取引法に基づく表記' },
                { href: '/contact', label: 'お問い合わせ' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-purple-400 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[#2d2d5e] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {currentYear} {siteName}. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs">
            当サイトはアフィリエイト広告を掲載しています
          </p>
        </div>
      </div>
    </footer>
  )
}
