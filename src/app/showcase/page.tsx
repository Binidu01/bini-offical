// src/app/showcase/page.tsx
import { AnimatePresence, m } from 'framer-motion'
import { Link2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { Header, Footer } from '../../components/Layout'

/* ─── Screenshot (with cache) ─────────────────────────────────────── */

const CACHE_PREFIX = 'bini-showcase-shot:'
const CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 7 // 7 days

type CachedShot = { url: string; ts: number }

function readCache(key: string): string | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key)
    if (!raw) return null
    const parsed: CachedShot = JSON.parse(raw)
    if (Date.now() - parsed.ts > CACHE_TTL_MS) {
      localStorage.removeItem(CACHE_PREFIX + key)
      return null
    }
    return parsed.url
  } catch {
    return null
  }
}

function writeCache(key: string, url: string) {
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({ url, ts: Date.now() }))
  } catch {
    /* quota exceeded, ignore */
  }
}

/**
 * Synchronous screenshot service — returns an image directly with no
 * JSON step and no rate limiting on the free tier. Much more reliable
 * than api.microlink.io's embed endpoint.
 */
function screenshotUrl(site: string): string {
  return `https://image.thum.io/get/width/1280/crop/800/noanimate/${site}`
}

function LiveScreenshot({ url, title }: { url: string; title: string }) {
  const [src, setSrc] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoaded(false)
    setFailed(false)

    const cached = readCache(url)
    if (cached) {
      setSrc(cached)
      return
    }

    if (!cancelled) setSrc(screenshotUrl(url))

    return () => {
      cancelled = true
    }
  }, [url])

  const handleLoad = () => {
    setLoaded(true)
    setFailed(false)
    if (src && src.includes('thum.io')) {
      writeCache(url, src)
    }
  }

  return (
    <div className="relative aspect-16/10 w-full overflow-hidden bg-linear-to-br from-neutral-800 to-neutral-900">
      {/* Fallback layer (behind the image) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-neutral-700 bg-neutral-800">
          <span className="text-lg font-bold text-neutral-300">
            {title.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="text-sm font-medium text-neutral-300">{title}</span>
        {failed && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 text-[11px] text-neutral-500 underline-offset-2 hover:text-neutral-300 hover:underline"
          >
            {url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
          </a>
        )}
      </div>

      {/* Spinner while loading */}
      {!loaded && !failed && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/70 backdrop-blur-sm">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-600 border-t-transparent" />
        </div>
      )}

      {/* Live screenshot on top when it loads */}
      {src && !failed && (
        <img
          src={src}
          alt={`${title} preview`}
          loading="lazy"
          onLoad={handleLoad}
          onError={() => setFailed(true)}
          className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-500 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
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
    <div className="group flex flex-col overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 transition-colors hover:border-neutral-700 hover:bg-neutral-800">
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
          className="mb-1 inline-flex max-w-full items-center gap-1 text-base font-medium text-white transition-colors hover:text-cyan-400"
        >
          <span className="truncate">{project.title}</span>
        </a>
        <p className="text-sm text-neutral-400">{project.category}</p>
      </div>

      <div className="px-4 pb-4">
        <button
          type="button"
          onClick={copyClone}
          className="inline-flex w-full items-center justify-center rounded-full border border-neutral-700 bg-black px-6 py-2.5 text-sm font-medium text-white transition-colors hover:border-neutral-600 hover:bg-neutral-950"
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

      <section className="bg-black px-4 pt-20 pb-24 sm:px-6 lg:px-8 lg:pt-28 lg:pb-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h1 className="whitespace-nowrap text-[clamp(1.5rem,4vw,3rem)] leading-[1.15] font-bold tracking-tight text-white">
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
                      isActive ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
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