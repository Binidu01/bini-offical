// src/app/showcase/page.tsx
import { AnimatePresence, m } from 'framer-motion'
import { Link2 } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

import { Header, Footer } from '../../components/Layout'

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

/* ─── Persistent live previews ────────────────────────────────────── */
/*
 * Each project's site is loaded in ONE iframe that lives in a host element on
 * <body>, outside React. Pages that unmount (leaving /showcase) only hide the
 * iframe; coming back just moves it over the new card slot. Because the iframe
 * is never removed or re-parented, it never reloads.
 *
 * The same iframes double as the preloader: they are created in the background
 * as soon as this module loads, so by the time you open /showcase they have
 * already finished loading.
 */

const PREVIEW_WIDTH = 1280 // desktop / tablet
const MOBILE_PREVIEW_WIDTH = 480 // phones: sites show their mobile layout and stay legible
const PREVIEW_ASPECT = 10 / 16 // matches the card's aspect-16/10
const HOST_ID = 'bini-showcase-frames'

function getHost(): HTMLElement {
  let host = document.getElementById(HOST_ID)
  if (!host) {
    host = document.createElement('div')
    host.id = HOST_ID
    host.setAttribute('aria-hidden', 'true')
    host.style.cssText =
      'position:absolute;top:0;left:0;width:0;height:0;overflow:visible;pointer-events:none;z-index:10;'
    document.body.appendChild(host)
  }
  return host
}

function parkFrame(frame: HTMLIFrameElement) {
  frame.style.visibility = 'hidden'
  frame.style.transform = 'translate(-9999px, 0)'
}

/** Returns the project's iframe, creating it (once) if it doesn't exist yet. */
function getFrame(p: Project): HTMLIFrameElement {
  const host = getHost()
  let frame = host.querySelector<HTMLIFrameElement>(`iframe[data-id="${p.id}"]`)

  if (!frame) {
    frame = document.createElement('iframe')
    frame.dataset.id = p.id
    frame.src = p.url
    frame.tabIndex = -1
    frame.setAttribute('sandbox', 'allow-scripts allow-same-origin')
    Object.assign(frame.style, {
      position: 'absolute',
      left: '0',
      top: '0',
      width: `${PREVIEW_WIDTH}px`,
      height: `${PREVIEW_WIDTH * PREVIEW_ASPECT}px`,
      border: '0',
      background: '#fff',
      opacity: '0',
      transformOrigin: 'top left',
      transition: 'opacity 500ms',
      pointerEvents: 'none',
    })
    parkFrame(frame)
    frame.addEventListener('load', () => {
      frame!.dataset.loaded = '1'
    })
    host.appendChild(frame)
  }

  return frame
}

/** Moves the iframe over its slot and scales it to fit. */
function placeFrame(frame: HTMLIFrameElement, slot: HTMLElement) {
  const r = slot.getBoundingClientRect()
  if (r.width === 0) return

  // Resizing the iframe re-lays-out the site inside it but never reloads it.
  const designWidth = window.innerWidth < 640 ? MOBILE_PREVIEW_WIDTH : PREVIEW_WIDTH
  if (frame.dataset.designWidth !== String(designWidth)) {
    frame.dataset.designWidth = String(designWidth)
    frame.style.width = `${designWidth}px`
    frame.style.height = `${designWidth * PREVIEW_ASPECT}px`
  }

  const scale = r.width / designWidth
  const radius = 12 / scale // matches the card's rounded-xl top corners

  frame.style.visibility = 'visible'
  frame.style.opacity = frame.dataset.loaded ? '1' : '0'
  frame.style.borderRadius = `${radius}px ${radius}px 0 0`
  frame.style.transform = `translate(${r.left + window.scrollX}px, ${
    r.top + window.scrollY
  }px) scale(${scale})`
}

let preloadStarted = false

/** Warms connections now, then creates the iframes once the browser is idle. */
function preloadShowcase() {
  if (typeof window === 'undefined' || preloadStarted) return
  preloadStarted = true

  for (const p of PROJECTS) {
    try {
      const origin = new URL(p.url).origin
      for (const rel of ['dns-prefetch', 'preconnect']) {
        const link = document.createElement('link')
        link.rel = rel
        link.href = origin
        if (rel === 'preconnect') link.crossOrigin = ''
        document.head.appendChild(link)
      }
    } catch {
      /* ignore bad URLs */
    }
  }

  const createAll = () => PROJECTS.forEach(getFrame)

  const schedule = () => {
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
    }
    if (w.requestIdleCallback) w.requestIdleCallback(createAll, { timeout: 4000 })
    else setTimeout(createAll, 1500)
  }

  if (document.readyState === 'complete') schedule()
  else window.addEventListener('load', schedule, { once: true })
}

preloadShowcase()

function LiveScreenshot({ project }: { project: Project }) {
  const slotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const slot = slotRef.current
    if (!slot) return

    const frame = getFrame(project)
    let raf = 0

    // Follow the slot every frame so scrolling, resizing and layout shifts
    // never leave the iframe out of place.
    const tick = () => {
      placeFrame(frame, slot)
      raf = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      cancelAnimationFrame(raf)
      parkFrame(frame) // hide only, never remove, so it doesn't reload
    }
  }, [project])

  return (
    <div
      ref={slotRef}
      className="relative aspect-16/10 w-full overflow-hidden bg-linear-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900"
    >
      {/* Placeholder, visible until the live preview has loaded on top of it */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-neutral-300 bg-white dark:border-neutral-700 dark:bg-neutral-800">
          <span className="text-lg font-bold text-neutral-700 dark:text-neutral-300">
            {project.title.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {project.title}
        </span>
      </div>
    </div>
  )
}

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
          <div className="flex max-w-full items-center gap-2.5 rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2.5 shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
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
    navigator.clipboard?.writeText(cloneCommand).catch(() => {})
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
        <LiveScreenshot project={project} />
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

      <section className="bg-white px-4 pt-20 pb-16 dark:bg-black sm:px-6 sm:pb-24 lg:px-8 lg:pt-28 lg:pb-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 text-center sm:mb-12">
            <h1 className="text-balance text-[clamp(1.75rem,5vw,3rem)] leading-[1.15] font-bold tracking-tight text-black md:whitespace-nowrap dark:text-white">
              Meet beautiful websites built with Bini.js
            </h1>
          </div>

          {categories.length > 1 && (
            <div className="mb-8 flex flex-wrap items-center justify-center gap-1.5 sm:mb-10 sm:gap-2">
              {categories.map((cat) => {
                const isActive = effectiveCategory === cat
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`rounded-full px-3.5 py-2 text-sm font-medium whitespace-nowrap transition-colors sm:py-1.5 ${
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
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
              {filtered.map((project) => (
                <ShowcaseCard key={project.id} project={project} onCopy={handleCopy} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-sm text-neutral-500 sm:py-24">
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