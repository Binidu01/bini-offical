// src/components/PluginSidebar.tsx
import { ChevronDown, ChevronRight } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

type PluginItem = {
  title: string
  href: string
  external?: boolean
}

const PLUGIN_ITEMS: PluginItem[] = [
  { title: 'overview', href: '/plugins' },
  { title: 'create-bini-app', href: '/plugins/create-bini-app' },
  { title: 'bini-deploy', href: '/plugins/bini-deploy' },
  { title: 'bini-router', href: '/plugins/bini-router' },
  { title: 'bini-env', href: '/plugins/bini-env' },
  { title: 'bini-native', href: '/plugins/bini-native' },
  { title: 'bini-server', href: '/plugins/bini-server' },
  { title: 'bini-overlay', href: '/plugins/bini-overlay' },
  { title: 'bini-ssg', href: '/plugins/bini-ssg' },
  { title: 'vite plugins', href: 'https://vite.dev/plugins/', external: true },
  { title: 'hono plugins', href: 'https://hono.dev/docs/', external: true },
]

const LINK_BASE = 'block py-1.5 text-sm transition-colors'
const LINK_ACTIVE = 'font-medium text-cyan-600 dark:text-cyan-400'
const LINK_IDLE =
  'text-neutral-600 hover:text-cyan-600 dark:text-neutral-400 dark:hover:text-cyan-400'

function PluginSidebarContent() {
  const location = useLocation()
  return (
    <nav className="py-1">
      <div className="flex flex-col">
        {PLUGIN_ITEMS.map((item) => {
          if (item.external) {
            return (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${LINK_BASE} ${LINK_IDLE}`}
              >
                <span className="flex items-center gap-1">
                  {item.title}
                  <span aria-hidden className="text-xs opacity-60">
                    ↗
                  </span>
                </span>
              </a>
            )
          }
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`${LINK_BASE} ${isActive ? LINK_ACTIVE : LINK_IDLE}`}
            >
              {item.title}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export function PluginSidebar() {
  // Same fixed top-24 pattern as TableOfContents — global scrollbar styles apply.
  // Width must match the <aside> in PluginLayout (w-44).
  return (
    <div className="fixed top-24 w-44 max-h-[calc(100vh-8rem)] overflow-y-auto">
      <div className="relative">
        <div className="w-full pl-6 pr-3 pb-4">
          <PluginSidebarContent />
        </div>
      </div>
    </div>
  )
}

export function PluginLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMobileMenuOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
      document.documentElement.classList.add('mobile-menu-open')
    } else {
      document.body.style.overflow = ''
      document.documentElement.classList.remove('mobile-menu-open')
    }
    requestAnimationFrame(() => {
      window.dispatchEvent(new Event('resize'))
    })
    return () => {
      document.body.style.overflow = ''
      document.documentElement.classList.remove('mobile-menu-open')
    }
  }, [mobileMenuOpen])

  return (
    <>
      <div className="hidden lg:block">
        <div className="flex gap-4 xl:gap-6">
          {/* Reserves space — sidebar inside is fixed like TOC */}
          <aside className="w-44 shrink-0">
            <PluginSidebar />
          </aside>
          <main className="min-w-0 flex-1 pb-8">{children}</main>
        </div>
      </div>

      <div className="lg:hidden">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex items-center gap-2 text-lg font-semibold text-neutral-700 transition-colors hover:text-black dark:text-neutral-200 dark:hover:text-white"
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
          <div className="fixed left-0 right-0 bottom-0 top-14 z-40 bg-white px-6 py-6 dark:bg-black lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="mb-4 flex items-center gap-2 text-lg font-semibold text-neutral-700 transition-colors hover:text-black dark:text-neutral-200 dark:hover:text-white"
            >
              <ChevronDown className="h-5 w-5" />
              <span>Menu</span>
            </button>
            <div className="mb-4 border-t border-neutral-200 dark:border-neutral-800" />
            <div className="relative h-[calc(100vh-8rem)]">
              <div className="h-full w-full overflow-y-auto overscroll-contain pr-3">
                <PluginSidebarContent />
              </div>
            </div>
          </div>
        )}
        <main className="pb-8">{children}</main>
      </div>
    </>
  )
}

export default PluginSidebar