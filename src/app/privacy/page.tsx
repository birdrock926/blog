import type { Metadata } from 'next'
import BreadCrumb from '@/components/BreadCrumb'

export const metadata: Metadata = {
  title: 'プライバシーポリシー',
}

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BreadCrumb items={[{ label: 'プライバシーポリシー' }]} />
      <div className="bg-[#1a1a2e] border border-[#2d2d5e] rounded-xl p-8">
        <h1 className="text-3xl font-bold text-white mb-8">プライバシーポリシー</h1>
        <div className="prose max-w-none">
          <p>当サイトは、ユーザーのプライバシーを尊重し、個人情報の保護に努めています。</p>
          
          <h2>個人情報の収集について</h2>
          <p>当サイトでは、お問い合わせの際にお名前・メールアドレスなどの個人情報をご提供いただく場合があります。収集した個人情報は、お問い合わせへの回答以外の目的には使用しません。</p>
          
          <h2>Cookieについて</h2>
          <p>当サイトでは、ユーザーエクスペリエンスの向上のためにCookieを使用しています。ブラウザの設定によりCookieを無効にすることも可能です。</p>
          
          <h2>アクセス解析について</h2>
          <p>当サイトでは、Googleアナリティクス等のアクセス解析ツールを使用する場合があります。これらのツールはCookieを使用してデータを収集しますが、個人を特定する情報は含まれません。</p>
          
          <h2>アフィリエイト広告について</h2>
          <p>当サイトでは、アフィリエイト広告を掲載しています。広告主のサイトにおける個人情報の取り扱いについては、各広告主のプライバシーポリシーをご確認ください。</p>
          
          <h2>免責事項</h2>
          <p>当サイトに掲載された情報の正確性については万全を期しておりますが、当サイトの情報を使用することで発生したいかなる損害についても責任を負いかねます。</p>
          
          <h2>お問い合わせ</h2>
          <p>プライバシーポリシーに関するお問い合わせは、お問い合わせページよりご連絡ください。</p>
        </div>
      </div>
    </div>
  )
}
