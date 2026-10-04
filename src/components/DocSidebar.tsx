import { ChevronDown, ChevronRight } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

function Section({
  title,
  items,
}: {
  title: string
  items: {
    label: string
    href: string
  }[]
}) {
  const location = useLocation()

  return (
    <div className="mb-4">
      <h3 className="mb-2 text-xs font-semibold tracking-wider text-neutral-400 uppercase dark:text-neutral-500">
        {title}
      </h3>

      <div className="space-y-0.5">
        {items.map((item) => {
          const active = location.pathname === item.href

          return (
            <Link
              key={item.href}
              to={item.href}
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
      <Section
        title="Getting Started"
        items={[
          { label: 'Introduction', href: '/docs' },
          {
            label: 'Installation',
            href: '/docs/installation',
          },
          {
            label: 'Project Structure',
            href: '/docs/project-structure',
          },
          {
            label: 'Layouts and Pages',
            href: '/docs/layouts-and-pages',
          },
          {
            label: 'Linking and Navigating',
            href: '/docs/linking-and-navigating',
          },
        ]}
      />

      <Section
        title="Defining Routes"
        items={[
          {
            label: 'Folder-Based Routing',
            href: '/docs/folder-based-routing',
          },
          {
            label: 'File-Based Routing',
            href: '/docs/file-based-routing',
          },
          {
            label: 'Dynamic Routes',
            href: '/docs/dynamic-routes',
          },
          {
            label: 'Parallel Routes',
            href: '/docs/parallel-routes',
          },
          {
            label: 'Catch-All Routes',
            href: '/docs/catch-all-routes',
          },
          {
            label: 'MDX & Markdown Pages',
            href: '/docs/mdx-markdown',
          },
        ]}
      />

      <Section
        title="Special Files"
        items={[
          {
            label: 'Loading UI',
            href: '/docs/load',
          },
          {
            label: 'Error Boundaries',
            href: '/docs/error-boundaries',
          },
          {
            label: 'Template',
            href: '/docs/templates',
          },
          {
            label: 'Default',
            href: '/docs/defaults',
          },
          {
            label: 'Not Found',
            href: '/docs/notfound',
          },
        ]}
      />

      <Section
        title="Metadata"
        items={[
          {
            label: 'Metadata & SEO',
            href: '/docs/metadata',
          },
          {
            label: 'Open Graph & Twitter',
            href: '/docs/og-twitter',
          },
          {
            label: 'Icons & Favicons',
            href: '/docs/icons',
          },
        ]}
      />

      <Section
        title="API Routes"
        items={[
          {
            label: 'API Routes Overview',
            href: '/docs/api-routes',
          },
          {
            label: 'Plain Function Handlers',
            href: '/docs/api-plain',
          },
          {
            label: 'Hono Integration',
            href: '/docs/api-hono',
          },
          {
            label: 'Dynamic API Routes',
            href: '/docs/api-dynamic',
          },
          {
            label: 'CORS',
            href: '/docs/api-cors',
          },
        ]}
      />

      <Section
        title="Environment Variables"
        items={[
          {
            label: 'Overview',
            href: '/docs/environment-variables',
          },
          {
            label: 'Prefixes & Client Exposure',
            href: '/docs/env-prefixes',
          },
          {
            label: 'Using in API Routes',
            href: '/docs/env-api',
          },
        ]}
      />

      <Section
        title="Styling"
        items={[
          {
            label: 'CSS Overview',
            href: '/docs/css',
          },
          {
            label: 'Tailwind CSS',
            href: '/docs/tailwind',
          },
          {
            label: 'CSS Modules',
            href: '/docs/css-modules',
          },
        ]}
      />

      <Section
        title="Platforms"
        items={[
          {
            label: 'Web',
            href: '/docs/platform-web',
          },
          {
            label: 'Windows',
            href: '/docs/platform-windows',
          },
          {
            label: 'macOS',
            href: '/docs/platform-macos',
          },
          {
            label: 'Linux',
            href: '/docs/platform-linux',
          },
          {
            label: 'Android',
            href: '/docs/platform-android',
          },
          {
            label: 'iOS',
            href: '/docs/platform-ios',
          },
        ]}
      />

      <Section
        title="Deployment"
        items={[
          {
            label: 'Deployment Overview',
            href: '/docs/deploying',
          },
          {
            label: 'Production Server',
            href: '/docs/production-server',
          },
          {
            label: 'Static Export',
            href: '/docs/static-export',
          },
          {
            label: 'Hosting Providers',
            href: '/docs/hosting',
          },
        ]}
      />
    </nav>
  )
}

export function DocSidebar() {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollRef.current

    if (!el) return

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < 1) return

      event.preventDefault()

      el.scrollTop += event.deltaY * 0.22
    }

    el.addEventListener('wheel', onWheel, {
      passive: false,
    })

    return () => {
      el.removeEventListener('wheel', onWheel)
    }
  }, [])

  return (
    <div className="relative h-full w-full">
      <div
        ref={scrollRef}
        className="h-full w-full overflow-y-auto overscroll-contain pr-3 pb-4"
      >
        <DocSidebarContent />
      </div>
    </div>
  )
}

interface DocLayoutProps {
  children: React.ReactNode
}

export function DocLayout({ children }: DocLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  const desktopAsideRef = useRef<HTMLElement>(null)
  const desktopMainRef = useRef<HTMLElement>(null)

  // Close the mobile menu whenever the user navigates to another page
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  // Close with the Escape key
  useEffect(() => {
    if (!mobileMenuOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileMenuOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [mobileMenuOpen])

  // While the mobile menu is open: start from the top, hide the site footer
  // (it lives outside this component, in DocPage), and close the menu if the
  // screen grows to desktop width so the footer can never stay hidden.
  useEffect(() => {
    if (!mobileMenuOpen) return

    window.scrollTo(0, 0)

    const footer = Array.from(document.querySelectorAll<HTMLElement>('footer')).at(-1)
    const previousDisplay = footer?.style.display ?? ''

    if (footer) footer.style.display = 'none'

    // The menu never needs sideways scrolling, so lock the X axis while open.
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

  useEffect(() => {
    const aside = desktopAsideRef.current
    const main = desktopMainRef.current

    if (!aside || !main) return

    // Matches sticky top-20 (5rem)
    const TOP = 80
    // Small gap so the sidebar bottom never touches the separator
    const GAP = 0

    const updateHeight = () => {
      // Prefer the exact "Next" separator that has border-t + the next-link
      // Fallback to any .border-t that is below the header
      let separator: HTMLElement | null = main.querySelector<HTMLElement>(
        '.border-t.pt-8, .border-t.mt-12, .mt-12.border-t'
      )

      if (!separator) {
        const candidates = Array.from(main.querySelectorAll<HTMLElement>('.border-t'))

        separator =
          candidates
            .filter((el) => {
              const r = el.getBoundingClientRect()
              return r.width > 40 && r.top > TOP
            })
            .at(-1) ?? null
      }

      const full = window.innerHeight - TOP

      if (!separator) {
        aside.style.height = `${full}px`
        return
      }

      const sepTop = separator.getBoundingClientRect().top

      // Distance from sticky top edge → separator
      const available = sepTop - TOP - GAP

      // Clamp: never taller than viewport, never smaller than a usable min
      const height = Math.max(160, Math.min(full, available))

      aside.style.height = `${height}px`
    }

    const onScroll = () => requestAnimationFrame(updateHeight)

    updateHeight()

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', updateHeight)

    const ro = new ResizeObserver(updateHeight)
    ro.observe(main)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', updateHeight)
      ro.disconnect()
    }
  }, [])

  return (
    <div className="w-full">
      {/* Desktop */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-[14rem_minmax(0,1fr)] items-start gap-12 xl:grid-cols-[14rem_minmax(0,1fr)] xl:gap-16">
          <aside
            ref={desktopAsideRef}
            className="sticky top-20 w-full self-start"
            style={{ height: 'calc(100vh - 5rem)' }}
          >
            <DocSidebar />
          </aside>

          <main ref={desktopMainRef} className="min-w-0 pb-12">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile / Tablet
          The menu is NOT a fixed overlay. It sits in normal page flow and
          replaces the page content while open, so the browser's own page
          scroll handles it — exactly like the footer. Browsers already keep
          the end of the document clear of their bottom bars, so no
          device-specific padding or height tricks are needed. */}
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