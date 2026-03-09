'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard, FileText, FolderOpen, Tag, Image,
  Link as LinkIcon, Settings,
  LogOut, Gamepad2, ChevronRight,
} from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'ダッシュボード', icon: LayoutDashboard, exact: true },
  { href: '/admin/posts', label: '記事管理', icon: FileText },
  { href: '/admin/categories', label: 'カテゴリ', icon: FolderOpen },
  { href: '/admin/tags', label: 'タグ', icon: Tag },
  { href: '/admin/media', label: 'メディア', icon: Image },
  { href: '/admin/affiliate-links', label: 'アフィリエイト', icon: LinkIcon },
  { href: '/admin/settings', label: '設定', icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  const isActive = (href: string, exact = false) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0a0a14] border-r border-[#2d2d5e] flex flex-col z-40">
      <div className="p-6 border-b border-[#2d2d5e]">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-900 rounded-lg flex items-center justify-center">
            <Gamepad2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-white font-bold text-sm">GameLog</div>
            <div className="text-gray-500 text-xs">Admin Panel</div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navItems.map(item => {
          const Icon = item.icon
          const active = isActive(item.href, item.exact)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4" />
                {item.label}
              </div>
              {active && <ChevronRight className="w-3 h-3" />}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-[#2d2d5e] space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg text-sm transition-all"
        >
          <Gamepad2 className="w-4 h-4" />
          サイトを表示
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-red-400 hover:bg-red-500/5 rounded-lg text-sm transition-all"
        >
          <LogOut className="w-4 h-4" />
          ログアウト
        </button>
      </div>
    </aside>
  )
}
