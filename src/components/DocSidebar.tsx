// src/components/DocSidebar.tsx
import React, { useState, useEffect, useRef } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

// ────────────────────────────────────────────────────────────────────────────────
// Section Component (non-collapsible, always visible)
// ────────────────────────────────────────────────────────────────────────────────
function Section({ 
  title, 
  items 
}: { 
  title: string
  items: { title: string; href: string }[]
}) {
  const location = useLocation()

  return (
    <div className="mb-4">
      <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">
        {title}
      </h3>
      <div className="space-y-0">
        {items.map((item) => {
          const isItemActive = location.pathname === item.href
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`block py-1 text-sm transition-colors ${
                isItemActive 
                  ? 'text-cyan-400 font-medium' 
                  : 'text-white/70 hover:text-white'
              }`}
            >
              {item.title}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────────
// Documentation Sidebar Content
// ────────────────────────────────────────────────────────────────────────────────
function DocSidebarContent() {
  // ─── GETTING STARTED ──────────────────────────────────────────────────────────
  const gettingStartedItems = [
    { title: 'Introduction', href: '/docs' },
    { title: 'Installation', href: '/docs/installation' },
    { title: 'Project Structure', href: '/docs/project-structure' },
    { title: 'Layouts and Pages', href: '/docs/layouts-and-pages' },
    { title: 'Linking and Navigating', href: '/docs/linking-and-navigating' },
  ]

  // ─── DEFINING ROUTES ──────────────────────────────────────────────────────────
  const definingRoutesItems = [
    { title: 'Folder-Based Routing', href: '/docs/folder-based-routing' },
    { title: 'File-Based Routing', href: '/docs/file-based-routing' },
    { title: 'Dynamic Routes', href: '/docs/dynamic-routes' },
    { title: 'Catch-All Routes', href: '/docs/catch-all-routes' },
    { title: 'MDX & Markdown Pages', href: '/docs/mdx-markdown' },
  ]

  // ─── SPECIAL FILES ──────────────────────────────────────────────────────────────
  const specialFilesItems = [
    { title: 'Loading UI', href: '/docs/load' },
    { title: 'Error Boundaries', href: '/docs/error-boundaries' },
    { title: 'Not Found (404)', href: '/docs/notfound' },
  ]

  // ─── METADATA ──────────────────────────────────────────────────────────────────
  const metadataItems = [
    { title: 'Metadata & SEO', href: '/docs/metadata' },
    { title: 'Open Graph & Twitter', href: '/docs/og-twitter' },
    { title: 'Icons & Favicons', href: '/docs/icons' },
  ]

  // ─── API ROUTES ──────────────────────────────────────────────────────────────
  const apiItems = [
    { title: 'API Routes Overview', href: '/docs/api-routes' },
    { title: 'Plain Function Handlers', href: '/docs/api-plain' },
    { title: 'Hono Integration', href: '/docs/api-hono' },
    { title: 'Dynamic API Routes', href: '/docs/api-dynamic' },
    { title: 'CORS', href: '/docs/api-cors' },
  ]

  // ─── ENVIRONMENT VARIABLES ──────────────────────────────────────────────────────
  const envItems = [
    { title: 'Overview', href: '/docs/environment-variables' },
    { title: 'Prefixes & Client Exposure', href: '/docs/env-prefixes' },
    { title: 'Using in API Routes', href: '/docs/env-api' },
  ]

  // ─── STYLING ──────────────────────────────────────────────────────────────────
  const stylingItems = [
    { title: 'CSS Overview', href: '/docs/css' },
    { title: 'Tailwind CSS', href: '/docs/tailwind' },
    { title: 'CSS Modules', href: '/docs/css-modules' },
  ]

  // ─── PLATFORMS ──────────────────────────────────────────────────────────────
  const platformsItems = [
    { title: 'Web', href: '/docs/platform-web' },
    { title: 'Windows', href: '/docs/platform-windows' },
    { title: 'macOS', href: '/docs/platform-macos' },
    { title: 'Linux', href: '/docs/platform-linux' },
    { title: 'Android', href: '/docs/platform-android' },
    { title: 'iOS', href: '/docs/platform-ios' },
  ]

  // ─── DEPLOYMENT ──────────────────────────────────────────────────────────────
  const deployItems = [
    { title: 'Deployment Overview', href: '/docs/deploying' },
    { title: 'Production Server', href: '/docs/production-server' },
    { title: 'Static Export', href: '/docs/static-export' },
    { title: 'Hosting Providers', href: '/docs/hosting' },
  ]

  return (
    <nav className="py-1">
      <Section title="Getting Started" items={gettingStartedItems} />
      <Section title="Defining Routes" items={definingRoutesItems} />
      <Section title="Special Files" items={specialFilesItems} />
      <Section title="Metadata" items={metadataItems} />
      <Section title="API Routes" items={apiItems} />
      <Section title="Environment Variables" items={envItems} />
      <Section title="Styling" items={stylingItems} />
      <Section title="Platforms" items={platformsItems} />
      <Section title="Deployment" items={deployItems} />
    </nav>
  )
}

// ────────────────────────────────────────────────────────────────────────────────
// Documentation Sidebar (Desktop only)
// ────────────────────────────────────────────────────────────────────────────────
export function DocSidebar() {
  const [sidebarTop, setSidebarTop] = useState(80) // Default top position (20 * 4 = 80px)
  const sidebarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      const footer = document.querySelector('footer')
      const sidebar = sidebarRef.current
      
      if (!footer || !sidebar) return

      const footerRect = footer.getBoundingClientRect()
      const windowHeight = window.innerHeight

      // Check if footer is visible in viewport
      if (footerRect.top < windowHeight) {
        // Footer is visible - calculate how much to push sidebar up
        const overlap = windowHeight - footerRect.top
        const newTop = Math.max(20, 80 - overlap) // Minimum 20px from top
        setSidebarTop(newTop)
      } else {
        // Footer not visible - reset to default
        setSidebarTop(80)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })
    
    // Initial check
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  return (
    <div 
      ref={sidebarRef}
      className="fixed w-48 overflow-y-auto overflow-x-hidden pb-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/40 transition-all duration-300"
      style={{
        top: `${sidebarTop}px`,
        maxHeight: `calc(100vh - ${sidebarTop + 20}px)`,
      }}
    >
      <DocSidebarContent />
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────────
// Full Documentation Layout
// ────────────────────────────────────────────────────────────────────────────────
export function DocLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="flex">
          <aside className="w-48 shrink-0">
            <DocSidebar />
          </aside>
          
          <div className="w-48 shrink-0" />
          
          <main className="flex-1 min-w-0 pb-8">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        <div className="mb-1">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="flex items-center gap-1 text-white hover:text-cyan-400 transition-colors"
            aria-label={mobileMenuOpen ? 'Collapse documentation menu' : 'Expand documentation menu'}
          >
            <span className="text-sm font-medium">Menu</span>
            {mobileMenuOpen ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </button>
        </div>

        <div className="border-t border-slate-800 mb-2" />

        <div className={`overflow-hidden transition-all duration-300 ${mobileMenuOpen ? 'max-h-80 mb-2' : 'max-h-0'}`}>
          <div className="max-h-72 overflow-y-auto pb-1 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            <DocSidebarContent />
          </div>
        </div>

        <main className="pb-8">
          {children}
        </main>
      </div>
    </>
  )
}

export default DocSidebar