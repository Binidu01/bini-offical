// src/components/DocSidebar.tsx
import { ChevronDown, ChevronRight } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

interface NavItem {
  label: string
  href: string
}

interface NavGroup {
  title: string
  items: NavItem[]
}

/* ─── Nav data ────────────────────────────────────────────────────── */

const NAV_GROUPS: NavGroup[] = [
  {
    title: 'Getting Started',
    items: [
      { label: 'Introduction', href: '/docs' },
      { label: 'Installation', href: '/docs/installation' },
      { label: 'Project Structure', href: '/docs/project-structure' },
      { label: 'Layouts and Pages', href: '/docs/layouts-and-pages' },
      { label: 'Linking and Navigating', href: '/docs/linking-and-navigating' },
    ],
  },
  {
    title: 'Routing',
    items: [
      { label: 'Folder-Based Routing', href: '/docs/folder-based-routing' },
      { label: 'File-Based Routing', href: '/docs/file-based-routing' },
      { label: 'Dynamic Routes', href: '/docs/dynamic-routes' },
      { label: 'Parallel Routes', href: '/docs/parallel-routes' },
      { label: 'Intercepting Routes', href: '/docs/intercepting-routes' },
      { label: 'Catch-All Routes', href: '/docs/catch-all-routes' },
      { label: 'MDX & Markdown Pages', href: '/docs/mdx-markdown' },
    ],
  },
  {
    title: 'Special Files',
    items: [
      { label: 'Loading UI', href: '/docs/load' },
      { label: 'Error Boundaries', href: '/docs/error-boundaries' },
      { label: 'Template', href: '/docs/templates' },
      { label: 'Default', href: '/docs/defaults' },
      { label: 'Not Found', href: '/docs/notfound' },
    ],
  },
  {
    title: 'Data Fetching',
    items: [
      { label: 'Loaders', href: '/docs/loaders' },
      { label: 'Actions', href: '/docs/actions' },
      { label: 'Accessing Route Data', href: '/docs/accessing-route-data' },
    ],
  },
  {
    title: 'Metadata',
    items: [
      { label: 'Metadata & SEO', href: '/docs/metadata' },
      { label: 'Open Graph & Twitter', href: '/docs/og-twitter' },
      { label: 'Icons & Favicons', href: '/docs/icons' },
    ],
  },
  {
    title: 'API Routes',
    items: [
      { label: 'API Routes Overview', href: '/docs/api-routes' },
      { label: 'Plain Function Handlers', href: '/docs/api-plain' },
      { label: 'Hono Integration', href: '/docs/api-hono' },
      { label: 'Dynamic API Routes', href: '/docs/api-dynamic' },
    ],
  },
  {
    title: 'Environment Variables',
    items: [
      { label: 'Overview', href: '/docs/environment-variables' },
      { label: 'Prefixes & Client Exposure', href: '/docs/env-prefixes' },
      { label: 'Using in API Routes', href: '/docs/env-api' },
    ],
  },
  {
    title: 'Styling',
    items: [
      { label: 'CSS Overview', href: '/docs/css' },
      { label: 'Tailwind CSS', href: '/docs/tailwind' },
      { label: 'CSS Modules', href: '/docs/css-modules' },
    ],
  },
  {
    title: 'Platforms',
    items: [
      { label: 'Web', href: '/docs/platform-web' },
      { label: 'Windows', href: '/docs/platform-windows' },
      { label: 'macOS', href: '/docs/platform-macos' },
      { label: 'Linux', href: '/docs/platform-linux' },
      { label: 'Android', href: '/docs/platform-android' },
      { label: 'iOS', href: '/docs/platform-ios' },
    ],
  },
  {
    title: 'Deployment',
    items: [
      { label: 'Deployment Overview', href: '/docs/deploying' },
      { label: 'Production Server', href: '/docs/production-server' },
      { label: 'Static Export', href: '/docs/static-export' },
      { label: 'Hosting Providers', href: '/docs/hosting' },
    ],
  },
]

/* ─── Section ─────────────────────────────────────────────────────── */

function Section({ group }: { group: NavGroup }) {
  const location = useLocation()

  return (
    <div className="mb-4">
      <h3 className="mb-2 text-xs font-semibold tracking-wider text-neutral-400 uppercase dark:text-neutral-500">
        {group.title}
      </h3>

      <div className="space-y-0.5">
        {group.items.map((item) => {
          const active = location.pathname === item.href

          return (
            <Link
              key={item.href}
              to={item.href}
              preventScrollReset
              className={`block py-1 text-sm transition-colors ${
                active
                  ? 'font-medium text-cyan-600 dark:text-cyan-400'
                  : 'text-neutral-600 hover:text-cyan-600 dark:text-neutral-400 dark:hover:text-cyan-400'
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

function DocSidebarContent() {
  return (
    <nav>
      {NAV_GROUPS.map((group) => (
        <Section key={group.title} group={group} />
      ))}
    </nav>
  )
}

export function DocSidebar() {
  return (
    <div className="relative h-full w-full">
      <div
        className="
          h-full w-full overflow-y-auto overscroll-auto pr-2 pb-4
          scrollbar-gutter-stable
          scrollbar-thin
          scheme-light dark:scheme-dark
        "
      >
        <DocSidebarContent />
      </div>
    </div>
  )
}

/* ─── Layout ──────────────────────────────────────────────────────── */

interface DocLayoutProps {
  children: React.ReactNode
}

export function DocLayout({ children }: DocLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!mobileMenuOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileMenuOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [mobileMenuOpen])

  useEffect(() => {
    if (!mobileMenuOpen) return
    window.scrollTo(0, 0)
    const footer = Array.from(document.querySelectorAll<HTMLElement>('footer')).at(-1)
    const previousDisplay = footer?.style.display ?? ''
    if (footer) footer.style.display = 'none'

    const root = document.documentElement
    const previousOverflowX = root.style.overflowX
    root.style.overflowX = 'hidden'

    const desktop = window.matchMedia('(min-width: 1024px)')
    const onChange = () => {
      if (desktop.matches) setMobileMenuOpen(false)
    }
    desktop.addEventListener('change', onChange)

    return () => {
      if (footer) footer.style.display = previousDisplay
      root.style.overflowX = previousOverflowX
      desktop.removeEventListener('change', onChange)
    }
  }, [mobileMenuOpen])

  return (
    <div className="w-full">
      <div className="hidden lg:block">
        <div className="grid grid-cols-[14rem_minmax(0,1fr)] items-start gap-12 xl:grid-cols-[14rem_minmax(0,1fr)] xl:gap-16">
          <aside className="sticky top-20 h-[calc(100vh-5rem)] w-full self-start">
            <DocSidebar />
          </aside>
          <main className="min-w-0 pb-12">{children}</main>
        </div>
      </div>

      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setMobileMenuOpen((open) => !open)}
          className="flex items-center gap-2 text-lg font-semibold text-neutral-700 transition-colors hover:text-cyan-600 dark:text-neutral-200 dark:hover:text-cyan-400"
          aria-label={mobileMenuOpen ? 'Close documentation menu' : 'Open documentation menu'}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-doc-menu"
        >
          {mobileMenuOpen ? (
            <ChevronDown className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
          <span>Menu</span>
        </button>

        <div className="my-3 border-t border-neutral-200 dark:border-neutral-800" />

        {mobileMenuOpen && (
          <div id="mobile-doc-menu" className="overflow-x-hidden pb-8">
            <DocSidebarContent />
          </div>
        )}

        <main className={mobileMenuOpen ? 'hidden' : 'pb-8'}>{children}</main>
      </div>
    </div>
  )
}