// src/app/showcase/page.tsx
import { AnimatePresence, m } from 'framer-motion'
import { Link2 } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

import { Header, Footer } from '../../components/Layout'

/* ─── Live preview (scaled iframe) ────────────────────────────────── */

const PREVIEW_WIDTH = 1280
const PREVIEW_HEIGHT = 800

function LiveScreenshot({ url, title }: { url: string; title: string }) {
  const boxRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.3)

  useEffect(() => {
    const el = boxRef.current
    if (!el) return

    const update = () => setScale(el.clientWidth / PREVIEW_WIDTH)
    update()

    const ro = new ResizeObserver(update)
    ro.observe(el)

    return () => ro.disconnect()
  }, [])

  return (
    <div
      ref={boxRef}
      className="relative aspect-16/10 w-full overflow-hidden bg-linear-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900"
    >
      {/* Fallback layer (behind the iframe) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-neutral-300 bg-white dark:border-neutral-700 dark:bg-neutral-800">
          <span className="text-lg font-bold text-neutral-700 dark:text-neutral-300">
            {title.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {title}
        </span>
      </div>

      {/* Live site rendered at 1280x800, scaled down to fit the card */}
      <iframe
        src={url}
        title={`${title} preview`}
        loading="lazy"
        tabIndex={-1}
        sandbox="allow-scripts allow-same-origin"
        style={{
          width: PREVIEW_WIDTH,
          height: PREVIEW_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
        className="pointer-events-none absolute left-0 top-0 border-0 bg-white"
      />
    </div>
  )
}

/* ─── Data ────────────────────────────────────────────────────────── */

type Project = {
  id: string
  title: string
  url: string
  repo: string
  category: string
}

const PROJECTS: Project[] = [
  {
    id: 'island-link',
    title: 'Island Link',
    url: 'https://island-link-rust.vercel.app/',
    repo: 'Island-Link',
    category: 'Composable Commerce',
  },
  {
    id: 'travel-assistant',
    title: 'Travel Assistant AI',
    url: 'https://travel-assistant-lac.vercel.app/',
    repo: 'Travel-Assistant',
    category: 'AI',
  },
]

/* ─── Copy toast (top-center, right below the header) ─────────────── */

function CopyToast({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <m.div
          initial={{ opacity: 0, y: -16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.96 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none fixed inset-x-0 top-20 z-100 flex justify-center px-4"
        >
          <div className="flex items-center gap-2.5 rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2.5 shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
            <Link2 className="h-4 w-4 shrink-0 text-neutral-700 dark:text-neutral-300" />
            <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
              Command copied to clipboard
            </span>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  )
}

/* ─── Card ────────────────────────────────────────────────────────── */

function ShowcaseCard({
  project,
  onCopy,
}: {
  project: Project
  onCopy: (command: string) => void
}) {
  const cloneCommand = `git clone https://github.com/Binidu01/${project.repo}.git`

  const copyClone = () => {
    navigator.clipboard.writeText(cloneCommand)
    onCopy(cloneCommand)
  }

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white transition-colors hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700 dark:hover:bg-neutral-800">
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block overflow-hidden"
      >
        <LiveScreenshot url={project.url} title={project.title} />
      </a>

      <div className="p-4 pb-3">
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-1 inline-flex max-w-full items-center gap-1 text-base font-medium text-black transition-colors hover:text-cyan-600 dark:text-white dark:hover:text-cyan-400"
        >
          <span className="truncate">{project.title}</span>
        </a>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">{project.category}</p>
      </div>

      <div className="px-4 pb-4">
        <button
          type="button"
          onClick={copyClone}
          className="inline-flex w-full items-center justify-center rounded-full border border-neutral-300 bg-white px-6 py-2.5 text-sm font-medium text-black transition-colors hover:border-neutral-400 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-black dark:text-white dark:hover:border-neutral-600 dark:hover:bg-neutral-950"
        >
          Use template
        </button>
      </div>
    </div>
  )
}

/* ─── Page ────────────────────────────────────────────────────────── */

export default function ShowcasePage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [toastVisible, setToastVisible] = useState(false)
  const [toastTimer, setToastTimer] = useState<ReturnType<typeof setTimeout> | null>(null)

  const categories = useMemo(() => {
    const unique = Array.from(new Set(PROJECTS.map((p) => p.category)))
    return ['All', ...unique]
  }, [])

  const effectiveCategory = categories.includes(activeCategory) ? activeCategory : 'All'

  const filtered =
    effectiveCategory === 'All'
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === effectiveCategory)

  const handleCopy = () => {
    setToastVisible(true)
    if (toastTimer) clearTimeout(toastTimer)
    const t = setTimeout(() => setToastVisible(false), 2200)
    setToastTimer(t)
  }

  return (
    <div className="min-h-screen bg-white font-sans antialiased overflow-x-hidden dark:bg-black">
      <Header />

      <section className="bg-white px-4 pt-20 pb-24 dark:bg-black sm:px-6 lg:px-8 lg:pt-28 lg:pb-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h1 className="whitespace-nowrap text-[clamp(1.5rem,4vw,3rem)] leading-[1.15] font-bold tracking-tight text-black dark:text-white">
              Meet beautiful websites built with Bini.js
            </h1>
          </div>

          {categories.length > 1 && (
            <div className="mb-10 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
              {categories.map((cat) => {
                const isActive = effectiveCategory === cat
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`rounded-full px-3.5 py-1.5 text-sm font-medium whitespace-nowrap transition-colors ${
                      isActive
                        ? 'bg-black text-white dark:bg-white dark:text-black'
                        : 'text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                )
              })}
            </div>
          )}

          {filtered.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((project) => (
                <ShowcaseCard key={project.id} project={project} onCopy={handleCopy} />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center text-sm text-neutral-500">
              No projects in this category yet.
            </div>
          )}
        </div>
      </section>

      <CopyToast visible={toastVisible} />

      <Footer />
    </div>
  )
}