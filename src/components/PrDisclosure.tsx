import { Info } from 'lucide-react'

export default function PrDisclosure() {
  return (
    <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-6 text-sm">
      <Info className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
      <p className="text-amber-200">
        この記事にはアフィリエイト広告・プロモーションが含まれています。
        商品の購入・申し込みを通じて収益を得る場合がありますが、
        コンテンツの内容に影響はありません。
      </p>
    </div>
  )
}
