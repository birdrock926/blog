'use client'

import { useEffect, useState } from 'react'
import { List } from 'lucide-react'

interface Heading {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  content: string
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(content, 'text/html')
    const headingElements = doc.querySelectorAll('h2, h3, h4')
    
    const extracted: Heading[] = Array.from(headingElements).map((el, i) => ({
      id: el.id || `heading-${i}`,
      text: el.textContent || '',
      level: parseInt(el.tagName[1]),
    }))
    
    setHeadings(extracted)
  }, [content])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting)
        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: '-80px 0px -80% 0px' }
    )

    headings.forEach(h => {
      const el = document.getElementById(h.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings])

  if (headings.length < 2) return null

  return (
    <nav className="bg-[#1a1a2e] border border-[#2d2d5e] rounded-xl p-4 mb-8">
      <div className="flex items-center gap-2 mb-3">
        <List className="w-4 h-4 text-purple-400" />
        <h2 className="text-white font-semibold text-sm">目次</h2>
      </div>
      <ol className="space-y-1">
        {headings.map(heading => (
          <li
            key={heading.id}
            style={{ paddingLeft: `${(heading.level - 2) * 12}px` }}
          >
            <a
              href={`#${heading.id}`}
              className={`block text-sm py-1 transition-colors hover:text-purple-400 ${
                activeId === heading.id ? 'text-purple-400 font-medium' : 'text-gray-400'
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
