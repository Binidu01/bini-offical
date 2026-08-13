// src/components/TableOfContents.tsx
import React, { useEffect, useState } from 'react'
import { ExternalLink } from 'lucide-react'

export interface TocItem {
  id: string
  label: string
}

interface TableOfContentsProps {
  items: TocItem[]
  /** Link to edit the current page's source on GitHub */
  editUrl?: string
}

export function TableOfContents({ items, editUrl }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? '')

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el))

    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visible[0]) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: '-96px 0px -70% 0px', threshold: 0 }
    )

    headings.forEach((h) => observer.observe(h))
    return () => observer.disconnect()
  }, [items])

  function handleClick(e: React.MouseEvent, id: string) {
    e.preventDefault()
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      history.replaceState(null, '', `#${id}`)
      setActiveId(id)
    }
  }

  if (items.length === 0) return null

  return (
    <div className="fixed top-24 w-56 max-h-[calc(100vh-8rem)] overflow-y-auto">
      <nav className="text-sm">
        <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-3">
          On this page
        </p>
        <ul className="space-y-2.5 border-l border-white/10">
          {items.map((item) => {
            const isActive = item.id === activeId
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => handleClick(e, item.id)}
                  className={`block pl-3 -ml-px border-l transition-colors ${
                    isActive
                      ? 'border-cyan-400 text-cyan-400 font-medium'
                      : 'border-transparent text-white/50 hover:text-white/70'
                  }`}
                >
                  {item.label}
                </a>
              </li>
            )
          })}
        </ul>

        {editUrl && (
          <>
            <div className="mt-6 border-t border-white/10 pt-4">
              <a
                href={editUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-white/40 hover:text-cyan-400 transition-colors text-xs"
              >
                Edit this page on GitHub
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </>
        )}
      </nav>
    </div>
  )
}

export default TableOfContents