import type { Metadata } from 'next'
import BreadCrumb from '@/components/BreadCrumb'

export const metadata: Metadata = {
  title: '利用規約',
}

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BreadCrumb items={[{ label: '利用規約' }]} />
      <div className="bg-[#1a1a2e] border border-[#2d2d5e] rounded-xl p-8">
        <h1 className="text-3xl font-bold text-white mb-8">利用規約</h1>
        <div className="prose max-w-none">
          <p>この利用規約は、当サイトの利用に関する条件を定めたものです。当サイトをご利用いただくことで、本規約に同意したものとみなします。</p>
          
          <h2>禁止事項</h2>
          <ul>
            <li>法律または公序良俗に違反する行為</li>
            <li>当サイトのコンテンツを無断転載・複製する行為</li>
            <li>当サイトのサービスを妨害する行為</li>
            <li>その他、当サイトが不適切と判断する行為</li>
          </ul>
          
          <h2>著作権について</h2>
          <p>当サイトのコンテンツの著作権は当サイトに帰属します。無断での転載・複製は禁止しています。</p>
          
          <h2>免責事項</h2>
          <p>当サイトの情報の正確性・完全性については保証しません。当サイトの利用によって生じた損害について、当サイトは一切の責任を負いません。</p>
          
          <h2>規約の変更</h2>
          <p>当サイトは、必要に応じて利用規約を変更することがあります。変更後の規約は当サイトに掲載した時点で効力が発生します。</p>
        </div>
      </div>
    </div>
  )
}
