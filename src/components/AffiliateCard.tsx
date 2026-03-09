import Image from 'next/image'
import { ExternalLink } from 'lucide-react'

interface AffiliateLink {
  id: string
  name: string
  url: string
  description?: string | null
  imageUrl?: string | null
  buttonLabel: string
  platform?: string | null
}

export default function AffiliateCard({ link }: { link: AffiliateLink }) {
  return (
    <div className="bg-[#1a1a2e] border border-[#2d2d5e] rounded-xl p-5 hover:border-amber-500/30 transition-all">
      <div className="flex gap-4 items-start">
        {link.imageUrl && (
          <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-[#16213e]">
            <Image src={link.imageUrl} alt={link.name} fill className="object-contain p-1" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-white font-semibold">{link.name}</h3>
              {link.platform && (
                <span className="text-xs text-purple-400 font-medium">{link.platform}</span>
              )}
            </div>
          </div>
          {link.description && (
            <p className="text-gray-400 text-sm mt-2 line-clamp-2">{link.description}</p>
          )}
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg text-sm transition-colors"
          >
            {link.buttonLabel}
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  )
}
