'use client'

import { Twitter, Link as LinkIcon, Check } from 'lucide-react'
import { useState } from 'react'

interface SnsShareButtonsProps {
  url: string
  title: string
}

export default function SnsShareButtons({ url, title }: SnsShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-3 my-8">
      <span className="text-gray-400 text-sm">シェア:</span>
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2 bg-[#1a1a2e] border border-[#2d2d5e] rounded-lg text-gray-300 hover:text-white hover:border-sky-500/50 transition-all text-sm"
      >
        <Twitter className="w-4 h-4 text-sky-400" />
        Twitter
      </a>
      <button
        onClick={handleCopy}
        className="flex items-center gap-2 px-4 py-2 bg-[#1a1a2e] border border-[#2d2d5e] rounded-lg text-gray-300 hover:text-white hover:border-purple-500/50 transition-all text-sm"
      >
        {copied ? <Check className="w-4 h-4 text-green-400" /> : <LinkIcon className="w-4 h-4" />}
        {copied ? 'コピー済み' : 'リンクをコピー'}
      </button>
    </div>
  )
}
