import { ArrowUp, ExternalLink } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

export interface TocItem {
  id: string
  label: string
}

interface TableOfContentsProps {
  items: TocItem[]
  editUrl?: string
}

const TOP = 86 // matches `top-24`
const GAP = 10 // align exactly with the separator line
const MIN_HEIGHT = 120

const CONTAINER_CLASS = 'fixed top-24 w-56 overflow-y-auto pr-1'

const LINK_BASE = '-ml-px block border-l pl-3 transition-colors'
const LINK_ACTIVE =
  'border-cyan-600 font-medium text-cyan-600 dark:border-cyan-400 dark:text-cyan-400'
const LINK_IDLE =
  'border-transparent text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'

const SCROLL_TOP_CLASS =
  'mt-3 inline-flex items-center gap-1.5 text-xs text-neutral-500 transition-colors hover:text-cyan-600 dark:text-neutral-400 dark:hover:text-cyan-400'
const EDIT_LINK_CLASS =
  'inline-flex items-center gap-1.5 text-xs text-neutral-500 transition-colors hover:text-cyan-600 dark:text-neutral-400 dark:hover:text-cyan-400'

export function TableOfContents({ items, editUrl }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? '')
  const [showScrollTop, setShowScrollTop] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Stop the TOC exactly at the prev/next separator
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const main = el.closest('main')
    let raf = 0

    const findSeparator = (): HTMLElement | null => {
      if (!main) return null
      const all = Array.from(main.querySelectorAll<HTMLElement>('.border-t')).filter(
        (node) => !node.closest('aside')
      )
      return all[all.length - 1] ?? null
    }

    const update = () => {
      raf = 0
      const viewportMax = window.innerHeight - TOP - 24
      const sep = findSeparator()

      let height = viewportMax
      if (sep) {
        height = Math.min(viewportMax, sep.getBoundingClientRect().top - TOP - GAP)
      }

      el.style.maxHeight = Math.max(MIN_HEIGHT, height) + 'px'
    }

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)

    const observer = new ResizeObserver(schedule)
    if (main) observer.observe(main)
    observer.observe(document.documentElement)

    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      observer.disconnect()
    }
  }, [items.length])

  // Active heading tracking
  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => Boolean(node))

    if (!headings.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visible[0]) setActiveId(visible[0].target.id)
      },
      { rootMargin: '-96px 0px -70% 0px', threshold: 0 }
    )

    headings.forEach((heading) => observer.observe(heading))
    return () => observer.disconnect()
  }, [items])

  // "Scroll to top" visibility
  useEffect(() => {
    const handleScroll = () => {
      const firstHeading = items[0] ? document.getElementById(items[0].id) : null
      setShowScrollTop(
        firstHeading ? firstHeading.getBoundingClientRect().top < 96 : window.scrollY > 100
      )
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [items])

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
    e.preventDefault()

    const target = document.getElementById(id)
    if (!target) return

    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    history.replaceState(null, '', '#' + id)
    setActiveId(id)
  }

  function handleScrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!items.length) return null

  const scrollTopButton = (
    <button
      type="button"
      onClick={handleScrollTop}
      className={SCROLL_TOP_CLASS}
      aria-label="Scroll to top"
      title="Scroll to top"
    >
      <span>Scroll to top</span>
      <ArrowUp className="h-3.5 w-3.5" />
    </button>
  )

  return (
    <div
      ref={containerRef}
      className={CONTAINER_CLASS}
      style={{ maxHeight: 'calc(100vh - 10rem)' }}
    >
      <nav className="text-sm">
        <p className="mb-3 text-xs font-semibold tracking-wider text-neutral-400 uppercase dark:text-neutral-500">
          On this page
        </p>

        <ul className="space-y-2.5 border-l border-neutral-200 dark:border-neutral-800">
          {items.map((item) => {
            const isActive = item.id === activeId
            const linkClass = LINK_BASE + ' ' + (isActive ? LINK_ACTIVE : LINK_IDLE)
            const href = '#' + item.id

            return (
              <li key={item.id}>
                <a
                  href={href}
                  onClick={(e: React.MouseEvent<HTMLAnchorElement>) => handleClick(e, item.id)}
                  className={linkClass}
                >
                  {item.label}
                </a>
              </li>
            )
          })}
        </ul>

        {editUrl ? (
          <div className="mt-6 border-t border-neutral-200 pt-4 dark:border-neutral-800">
            <a href={editUrl} target="_blank" rel="noopener noreferrer" className={EDIT_LINK_CLASS}>
              Edit this page on GitHub
              <ExternalLink className="h-3 w-3" />
            </a>
            {showScrollTop ? scrollTopButton : null}
          </div>
        ) : showScrollTop ? (
          <div className="mt-6">{scrollTopButton}</div>
        ) : null}
      </nav>
    </div>
  )
}

export default TableOfContents