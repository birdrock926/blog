import Image from 'next/image'
import Link from 'next/link'
import { Twitter } from 'lucide-react'

interface Author {
  id: string
  name?: string | null
  bio?: string | null
  avatar?: string | null
  twitterUrl?: string | null
  email: string
}

export default function AuthorCard({ author }: { author: Author }) {
  return (
    <div className="bg-[#1a1a2e] border border-[#2d2d5e] rounded-xl p-6 flex gap-4 items-start">
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-purple-900 flex-shrink-0 overflow-hidden">
        {author.avatar ? (
          <Image src={author.avatar} alt={author.name || 'Author'} width={64} height={64} className="object-cover w-full h-full" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white text-xl font-bold">
            {(author.name || 'A')[0].toUpperCase()}
          </div>
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-white font-semibold">{author.name || 'Unknown Author'}</h3>
          {author.twitterUrl && (
            <a href={author.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:text-sky-300 transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
          )}
        </div>
        {author.bio && <p className="text-gray-400 text-sm leading-relaxed">{author.bio}</p>}
      </div>
    </div>
  )
}
