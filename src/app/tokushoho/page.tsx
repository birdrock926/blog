import type { Metadata } from 'next'
import BreadCrumb from '@/components/BreadCrumb'

export const metadata: Metadata = {
  title: '特定商取引法に基づく表記',
}

export default function TokushohoPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BreadCrumb items={[{ label: '特定商取引法に基づく表記' }]} />
      <div className="bg-[#1a1a2e] border border-[#2d2d5e] rounded-xl p-8">
        <h1 className="text-3xl font-bold text-white mb-8">特定商取引法に基づく表記</h1>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <tbody>
              {[
                ['販売業者', '当サイト運営者'],
                ['運営責任者', '運営者名'],
                ['所在地', '請求に応じて開示します'],
                ['電話番号', '請求に応じて開示します'],
                ['メールアドレス', 'お問い合わせページよりご連絡ください'],
                ['販売価格', '各商品ページに記載'],
                ['お支払い方法', '各サービスに準じます'],
                ['商品の引渡し時期', 'デジタルコンテンツは即時'],
                ['返品・キャンセルについて', '商品の性質上、返品・キャンセルには応じられません'],
              ].map(([label, value]) => (
                <tr key={label} className="border-b border-[#2d2d5e]">
                  <th className="py-4 pr-8 text-left text-gray-300 font-medium w-48 align-top">{label}</th>
                  <td className="py-4 text-gray-400">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
