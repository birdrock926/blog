import Link from 'next/link'
import Image from 'next/image'
import { ExternalLink } from 'lucide-react'

interface CtaBlock {
  id: string
  title: string
  description?: string | null
  buttonLabel: string
  buttonUrl: string
  imageUrl?: string | null
  bgColor?: string | null
}

export default function CtaBlock({ cta }: { cta: CtaBlock }) {
  return (
    <div
      className="rounded-xl p-6 my-8 border border-[#2d2d5e]"
      style={{ background: cta.bgColor || 'linear-gradient(135deg, #1a1a2e, #16213e)' }}
    >
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {cta.imageUrl && (
          <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
            <Image src={cta.imageUrl} alt={cta.title} fill className="object-cover" />
          </div>
        )}
        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-white font-bold text-lg mb-2">{cta.title}</h3>
          {cta.description && <p className="text-gray-400 text-sm mb-4">{cta.description}</p>}
          <Link
            href={cta.buttonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
          >
            {cta.buttonLabel}
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
