import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: {
    default: process.env.NEXT_PUBLIC_SITE_NAME || 'GameLog',
    template: `%s | ${process.env.NEXT_PUBLIC_SITE_NAME || 'GameLog'}`,
  },
  description: 'ゲーム情報・レビュー・攻略情報をお届けするゲーミングメディア',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'GameLog',
  },
  twitter: { card: 'summary_large_image' },
  alternates: { types: { 'application/rss+xml': '/feed.xml' } },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className="dark">
      <body style={{ fontFamily: 'system-ui, sans-serif' }}>
        <Header />
        <main className="pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
