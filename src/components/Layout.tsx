import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { siGithub, siNpm } from 'simple-icons'
import { Menu, X, ChevronRight, ExternalLink, Star, Search } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

// Simple Icon component
function SimpleIcon({
  icon,
  className = '',
  size = 20,
}: {
  icon: typeof siGithub
  className?: string
  size?: number
}) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
      dangerouslySetInnerHTML={{ __html: icon.svg }}
    />
  )
}

// ────────────────────────────────────────────────────────────────────────────────
// Search suggestions data — mirrors the current docs sidebar structure
// and the corrected plugin data from /plugins
// ────────────────────────────────────────────────────────────────────────────────
const searchSuggestions = [
  // Docs — Getting Started
  { label: 'Introduction', path: '/docs', type: 'docs', keywords: ['start', 'begin', 'intro', 'guide', 'overview'] },
  { label: 'Installation', path: '/docs/installation', type: 'docs', keywords: ['install', 'setup', 'npm', 'create-bini-app'] },
  { label: 'Project Structure', path: '/docs/project-structure', type: 'docs', keywords: ['structure', 'folders', 'files', 'organization'] },
  { label: 'Layouts and Pages', path: '/docs/layouts-and-pages', type: 'docs', keywords: ['layout', 'pages', 'nested', 'structure'] },
  { label: 'Linking and Navigating', path: '/docs/linking-and-navigating', type: 'docs', keywords: ['link', 'navigation', 'router', 'navigate'] },

  // Docs — Defining Routes
  { label: 'Folder-Based Routing', path: '/docs/folder-based-routing', type: 'docs', keywords: ['folder', 'directory', 'structure', 'routing'] },
  { label: 'File-Based Routing', path: '/docs/file-based-routing', type: 'docs', keywords: ['file', 'pages', 'routes', 'flat'] },
  { label: 'Dynamic Routes', path: '/docs/dynamic-routes', type: 'docs', keywords: ['dynamic', 'params', 'slug', 'id'] },
  { label: 'Catch-All Routes', path: '/docs/catch-all-routes', type: 'docs', keywords: ['catch-all', 'wildcard', 'slug', 'rest'] },
  { label: 'MDX & Markdown Pages', path: '/docs/mdx-markdown', type: 'docs', keywords: ['mdx', 'markdown', 'content', 'md'] },

  // Docs — Special Files
  { label: 'Loading UI', path: '/docs/load', type: 'docs', keywords: ['loading', 'suspense', 'fallback', 'ui'] },
  { label: 'Error Boundaries', path: '/docs/error-boundaries', type: 'docs', keywords: ['error', 'boundary', 'crash', 'reset'] },
  { label: 'Not Found (404)', path: '/docs/notfound', type: 'docs', keywords: ['404', 'not found', 'error page'] },

  // Docs — Metadata
  { label: 'Metadata & SEO', path: '/docs/metadata', type: 'docs', keywords: ['metadata', 'seo', 'title', 'description'] },
  { label: 'Open Graph & Twitter', path: '/docs/og-twitter', type: 'docs', keywords: ['og', 'open graph', 'twitter', 'social', 'card'] },
  { label: 'Icons & Favicons', path: '/docs/icons', type: 'docs', keywords: ['icons', 'favicon', 'apple touch', 'manifest'] },

  // Docs — API Routes
  { label: 'API Routes Overview', path: '/docs/api-routes', type: 'docs', keywords: ['api', 'routes', 'endpoints', 'overview'] },
  { label: 'Plain Function Handlers', path: '/docs/api-plain', type: 'docs', keywords: ['handlers', 'functions', 'plain', 'request'] },
  { label: 'Hono Integration', path: '/docs/api-hono', type: 'docs', keywords: ['hono', 'integration', 'middleware', 'framework'] },
  { label: 'Dynamic API Routes', path: '/docs/api-dynamic', type: 'docs', keywords: ['dynamic', 'api', 'params', 'rest'] },
  { label: 'CORS', path: '/docs/api-cors', type: 'docs', keywords: ['cors', 'cross-origin', 'preflight', 'headers'] },

  // Docs — Environment Variables
  { label: 'Environment Variables', path: '/docs/environment-variables', type: 'docs', keywords: ['.env', 'environment', 'variables', 'secrets'] },
  { label: 'Prefixes & Client Exposure', path: '/docs/env-prefixes', type: 'docs', keywords: ['bini_', 'vite_', 'prefix', 'client'] },
  { label: 'Using in API Routes', path: '/docs/env-api', type: 'docs', keywords: ['getenv', 'requireenv', 'hono context'] },

  // Docs — Styling
  { label: 'CSS Overview', path: '/docs/css', type: 'docs', keywords: ['css', 'styling', 'overview', 'styles'] },
  { label: 'Tailwind CSS', path: '/docs/tailwind', type: 'docs', keywords: ['tailwind', 'css', 'utility', 'classes'] },
  { label: 'CSS Modules', path: '/docs/css-modules', type: 'docs', keywords: ['modules', 'css', 'scoped', 'styles'] },

  // Docs — Platforms
  { label: 'Web', path: '/docs/platform-web', type: 'docs', keywords: ['web', 'platform', 'spa', 'browser'] },
  { label: 'Windows', path: '/docs/platform-windows', type: 'docs', keywords: ['windows', 'desktop', 'tauri', 'webview2'] },
  { label: 'macOS', path: '/docs/platform-macos', type: 'docs', keywords: ['macos', 'mac', 'desktop', 'tauri', 'wkwebview'] },
  { label: 'Linux', path: '/docs/platform-linux', type: 'docs', keywords: ['linux', 'desktop', 'tauri', 'appimage', 'webkitgtk'] },
  { label: 'Android', path: '/docs/platform-android', type: 'docs', keywords: ['android', 'mobile', 'apk', 'tauri'] },
  { label: 'iOS', path: '/docs/platform-ios', type: 'docs', keywords: ['ios', 'mobile', 'xcode', 'tauri', 'wkwebview'] },

  // Docs — Deployment
  { label: 'Deployment Overview', path: '/docs/deploying', type: 'docs', keywords: ['deploy', 'deployment', 'production', 'hosting'] },
  { label: 'Production Server', path: '/docs/production-server', type: 'docs', keywords: ['bini-server', 'production', 'node', 'etag'] },
  { label: 'Static Export', path: '/docs/static-export', type: 'docs', keywords: ['static', 'export', 'spa', 'build', 'bini-export'] },
  { label: 'Hosting Providers', path: '/docs/hosting', type: 'docs', keywords: ['bini-deploy', 'netlify', 'vercel', 'cloudflare', 'deno'] },

  // Plugins — Core Framework
  { label: 'create-bini-app', path: '/plugins', type: 'plugin', keywords: ['create', 'bini', 'app', 'scaffold', 'cli'] },
  { label: 'bini-deploy', path: '/plugins', type: 'plugin', keywords: ['deploy', 'hosting', 'cli', 'github'] },

  // Plugins — Official
  { label: 'bini-router', path: '/plugins', type: 'plugin', keywords: ['router', 'routing', 'file-based', 'api', 'hono', 'vite', 'mdx'] },
  { label: 'bini-env', path: '/plugins', type: 'plugin', keywords: ['env', 'environment', 'variables', 'secrets', 'getenv', 'requireenv', 'hono'] },
  { label: 'bini-native', path: '/plugins', type: 'plugin', keywords: ['native', 'tauri', 'plugin', 'wiring', 'rust', 'cargo', 'android', 'ios', 'desktop', 'mobile'] },
  { label: 'bini-server', path: '/plugins', type: 'plugin', keywords: ['server', 'production', 'static', 'etag', 'spa'] },
  { label: 'bini-overlay', path: '/plugins', type: 'plugin', keywords: ['overlay', 'error', 'loading', 'development', 'badge'] },
  { label: 'bini-export', path: '/plugins', type: 'plugin', keywords: ['export', 'static', 'spa', 'github pages', 'pre-render'] },

  // Plugins — Vite
  { label: '@vitejs/plugin-react', path: '/plugins', type: 'plugin', keywords: ['react', 'fast refresh', 'vite'] },
  { label: '@tailwindcss/vite', path: '/plugins', type: 'plugin', keywords: ['tailwind', 'css', 'vite', 'styling'] },

  // Plugins — Community
  { label: 'vite-plugin-pwa', path: '/plugins', type: 'plugin', keywords: ['pwa', 'service worker', 'offline', 'manifest'] },
  { label: 'vite-plugin-svgr', path: '/plugins', type: 'plugin', keywords: ['svg', 'react components', 'transform', 'import'] },
  { label: 'vite-plugin-compression', path: '/plugins', type: 'plugin', keywords: ['compression', 'gzip', 'brotli', 'bundle'] },
  { label: 'rollup-plugin-visualizer', path: '/plugins', type: 'plugin', keywords: ['visualizer', 'bundle', 'analysis', 'size'] },

  // Plugins — Hono Middleware
  { label: 'hono/cors', path: '/plugins', type: 'plugin', keywords: ['cors', 'cross-origin', 'middleware', 'hono'] },
  { label: 'hono/jwt', path: '/plugins', type: 'plugin', keywords: ['jwt', 'authentication', 'token', 'auth', 'hono'] },
  { label: 'hono/logger', path: '/plugins', type: 'plugin', keywords: ['logger', 'logging', 'requests', 'hono'] },
  { label: '@hono/zod-validator', path: '/plugins', type: 'plugin', keywords: ['zod', 'validation', 'validator', 'schema', 'hono'] },

  // GitHub Links
  { label: 'GitHub Repository', href: 'https://github.com/Binidu01/create-bini-app', type: 'github', keywords: ['repo', 'source', 'code'] },
  { label: 'Issues', href: 'https://github.com/Binidu01/create-bini-app/issues', type: 'github', keywords: ['bugs', 'problems', 'report'] },
  { label: 'Discussions', href: 'https://github.com/Binidu01/create-bini-app/discussions', type: 'github', keywords: ['community', 'forum', 'questions'] },
  { label: 'Contributing', href: 'https://github.com/Binidu01/create-bini-app/blob/main/CONTRIBUTING.md', type: 'github', keywords: ['contribute', 'development', 'guidelines'] },

  // npm Package
  { label: 'npm Package', href: 'https://www.npmjs.com/package/create-bini-app', type: 'package', keywords: ['npm', 'package', 'install'] },
]

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchModalRef = useRef<HTMLDivElement>(null)

  // Filter suggestions based on search query - limit to 7 results
  const filteredSuggestions = (() => {
    if (!searchQuery) return searchSuggestions.slice(0, 7)

    const query = searchQuery.toLowerCase()
    const results = searchSuggestions.filter((suggestion) => {
      return (
        suggestion.label.toLowerCase().includes(query) ||
        suggestion.type.toLowerCase().includes(query) ||
        suggestion.keywords?.some(keyword => keyword.toLowerCase().includes(query))
      )
    })

    return results.slice(0, 7)
  })()

  // Handle Ctrl+K / Cmd+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
      if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [searchOpen])

  // Focus input when search opens
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
      setSearchQuery('')
      setSelectedIndex(0)
    }
  }, [searchOpen])

  // Handle click outside to close search
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchModalRef.current &&
        !searchModalRef.current.contains(e.target as Node)
      ) {
        setSearchOpen(false)
      }
    }

    if (searchOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [searchOpen])

  // Reset selected index when search query changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [searchQuery])

  // Handle keyboard navigation in search
  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) =>
        prev < filteredSuggestions.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev))
    } else if (e.key === 'Enter' && filteredSuggestions[selectedIndex]) {
      e.preventDefault()
      const selected = filteredSuggestions[selectedIndex]
      if (selected.href) {
        window.open(selected.href, '_blank')
      } else if (selected.path) {
        window.location.href = selected.path
      }
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: typeof searchSuggestions[0]) => {
    if (suggestion.href) {
      window.open(suggestion.href, '_blank')
    } else if (suggestion.path) {
      window.location.href = suggestion.path
    }
    setSearchOpen(false)
    setSearchQuery('')
  }

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-slate-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 lg:h-16">
            {/* Logo and main navigation */}
            <div className="flex items-center gap-6 lg:gap-8">
              <Link to="/" className="flex items-center gap-2 group">
                <img
                  src="/bini.svg"
                  alt="Bini.js"
                  className="h-6 lg:h-7 transition-transform group-hover:scale-105"
                />
              </Link>

              {/* Desktop navigation */}
              <nav className="hidden lg:flex items-center gap-1">
                {[
                  { label: 'Docs', path: '/docs' },
                  { label: 'Plugins', path: '/plugins' },
                  {
                    label: 'Examples',
                    href: 'https://github.com/Binidu01/bini-examples',
                    external: true
                  },
                  {
                    label: 'Releases',
                    href: 'https://github.com/Binidu01/create-bini-app/releases',
                    external: true
                  },
                ].map((item) => (
                  item.external ? (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 text-sm font-medium text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-900 inline-flex items-center gap-1"
                    >
                      {item.label}
                      <ExternalLink size={12} className="opacity-50" />
                    </a>
                  ) : (
                    <Link
                      key={item.label}
                      to={item.path!}
                      className="px-3 py-1.5 text-sm font-medium text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-900"
                    >
                      {item.label}
                    </Link>
                  )
                ))}
              </nav>
            </div>

            {/* Search bar (center-right, input-styled) */}
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden sm:flex items-center justify-between gap-6 lg:gap-10 w-48 md:w-56 lg:w-64 px-3 py-1.5 text-sm text-slate-500 hover:text-slate-400 bg-[#0c0c0e] hover:bg-[#111113] border border-slate-800 rounded-lg transition-colors"
            >
              <span className="flex items-center gap-2 truncate">
                <Search size={15} className="shrink-0 text-slate-500" />
                <span className="truncate">Search documentation...</span>
              </span>
              <kbd className="shrink-0 px-1.5 py-0.5 text-[11px] font-semibold text-slate-300 bg-black rounded-md border border-slate-700">
                Ctrl K
              </kbd>
            </button>

            {/* Right side actions */}
            <div className="flex items-center gap-2">
              {/* npm - desktop */}
              <a
                href="https://www.npmjs.com/package/create-bini-app"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-900 border border-slate-800"
              >
                <SimpleIcon icon={siNpm} size={16} />
                <span>npm</span>
              </a>

              {/* GitHub stars - desktop */}
              <a
                href="https://github.com/Binidu01/create-bini-app"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-900 border border-slate-800"
              >
                <Star size={16} className="text-yellow-500" />
                <span>Star us on GitHub</span>
              </a>

              {/* Search icon only - mobile */}
              <button
                onClick={() => setSearchOpen(true)}
                className="sm:hidden p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-900"
                aria-label="Search"
              >
                <Search size={18} />
              </button>

              {/* GitHub icon only - mobile */}
              <a
                href="https://github.com/Binidu01/create-bini-app"
                target="_blank"
                rel="noopener noreferrer"
                className="sm:hidden p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-900"
                aria-label="GitHub"
              >
                <SimpleIcon icon={siGithub} size={18} />
              </a>

              {/* npm icon - mobile */}
              <a
                href="https://www.npmjs.com/package/create-bini-app"
                target="_blank"
                rel="noopener noreferrer"
                className="sm:hidden p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-900"
                aria-label="npm"
              >
                <SimpleIcon icon={siNpm} size={18} />
              </a>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-900"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden border-t border-slate-800 bg-black"
          >
            <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
              {/* Mobile search bar */}
              <button
                onClick={() => {
                  setSearchOpen(true)
                  setMobileMenuOpen(false)
                }}
                className="flex items-center justify-between gap-3 px-3 py-2.5 mb-2 text-sm text-slate-500 hover:text-slate-400 bg-[#0c0c0e] hover:bg-[#111113] border border-slate-800 rounded-lg transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Search size={15} className="shrink-0 text-slate-500" />
                  Search documentation...
                </span>
                <kbd className="shrink-0 px-1.5 py-0.5 text-[11px] font-semibold text-slate-300 bg-black rounded-md border border-slate-700">
                  Ctrl K
                </kbd>
              </button>

              {[
                { label: 'Docs', path: '/docs' },
                { label: 'Plugins', path: '/plugins' },
                {
                  label: 'Examples',
                  href: 'https://github.com/Binidu01/bini-examples',
                  external: true
                },
                {
                  label: 'Releases',
                  href: 'https://github.com/Binidu01/create-bini-app/releases',
                  external: true
                },
              ].map((item) => (
                item.external ? (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg transition-colors"
                  >
                    {item.label}
                    <ExternalLink size={16} className="text-slate-500" />
                  </a>
                ) : (
                  <Link
                    key={item.label}
                    to={item.path!}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg transition-colors"
                  >
                    {item.label}
                    <ChevronRight size={16} className="text-slate-500" />
                  </Link>
                )
              ))}

              {/* Mobile GitHub star */}
              <a
                href="https://github.com/Binidu01/create-bini-app"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg transition-colors mt-2 border-t border-slate-800 pt-4"
              >
                <span className="flex items-center gap-2">
                  <Star size={16} className="text-yellow-500" />
                  Star us on GitHub
                </span>
                <SimpleIcon icon={siGithub} size={16} />
              </a>
            </nav>
          </motion.div>
        )}
      </motion.header>

      {/* Search Modal - Black background with cyan selection */}
      {searchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm overflow-hidden"
        >
          <div className="fixed inset-0 overflow-y-auto overflow-x-hidden">
            <div className="flex min-h-full items-start justify-center p-4 pt-20 text-center">
              <motion.div
                ref={searchModalRef}
                initial={{ scale: 0.95, opacity: 0, y: -10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="w-full max-w-lg transform overflow-hidden rounded-xl bg-black border border-slate-800 shadow-2xl"
              >
                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search documentation..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    className="w-full h-14 pl-11 pr-20 bg-black text-white placeholder-slate-500 border-b border-slate-800 focus:outline-none focus:border-cyan-500/50 transition-colors"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 text-xs font-mono text-slate-400 bg-slate-900 rounded border border-slate-700">
                      ESC
                    </kbd>
                  </div>
                </div>

                {/* Suggestions list - White text with cyan selection */}
                {filteredSuggestions.length > 0 && (
                  <div className="max-h-96 overflow-y-auto overflow-x-hidden py-2 bg-black">
                    {filteredSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className={`w-full flex items-center justify-between px-4 py-2.5 mx-2 rounded-lg transition-colors ${
                          index === selectedIndex
                            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                            : 'text-white hover:bg-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-left">{suggestion.label}</span>
                          <span className={`text-xs px-1.5 py-0.5 rounded ${
                            index === selectedIndex
                              ? 'bg-cyan-500/30 text-cyan-300'
                              : 'bg-slate-800 text-slate-400'
                          }`}>
                            {suggestion.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {suggestion.href && (
                            <ExternalLink size={12} className="text-slate-500" />
                          )}
                          <ChevronRight size={14} className={`${
                            index === selectedIndex ? 'text-cyan-400' : 'text-slate-500'
                          }`} />
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {filteredSuggestions.length === 0 && (
                  <div className="py-8 text-center bg-black">
                    <p className="text-white">No results found for "{searchQuery}"</p>
                    <p className="text-sm text-slate-400 mt-1">Try searching for something else</p>
                  </div>
                )}

                {/* Search footer */}
                <div className="px-4 py-2 border-t border-slate-800 bg-black flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <kbd className="px-1 py-0.5 bg-slate-900 text-white rounded border border-slate-700">↑↓</kbd>
                      <span>to navigate</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-1 py-0.5 bg-slate-900 text-white rounded border border-slate-700">↵</kbd>
                      <span>to select</span>
                    </span>
                  </div>
                  <span className="text-slate-500">Showing {filteredSuggestions.length} results</span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </>
  )
}

export const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative border-t border-slate-800 bg-black overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Brand column */}
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src="/bini.svg" alt="Bini.js" className="h-6" />
            </div>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">
              A native React framework for building cross-platform deployment from a single codebase.
            </p>
            <div className="flex items-center gap-1">
              <a
                href="https://github.com/Binidu01/create-bini-app"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-900"
                aria-label="GitHub"
              >
                <SimpleIcon icon={siGithub} size={18} />
              </a>
              <a
                href="https://www.npmjs.com/package/create-bini-app"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-900"
                aria-label="npm"
              >
                <SimpleIcon icon={siNpm} size={18} />
              </a>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-3">
              {[
                { label: 'Documentation', path: '/docs' },
                { label: 'Plugins', path: '/plugins' },
                { label: 'Examples', href: 'https://github.com/Binidu01/bini-examples', external: true },
                { label: 'Releases', href: 'https://github.com/Binidu01/create-bini-app/releases', external: true },
              ].map((item) => (
                <li key={item.label}>
                  {item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1"
                    >
                      {item.label}
                      <ExternalLink size={12} className="opacity-50" />
                    </a>
                  ) : (
                    <Link
                      to={item.path!}
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Community</h3>
            <ul className="space-y-3">
              {[
                { label: 'GitHub Discussions', href: 'https://github.com/Binidu01/create-bini-app/discussions' },
                { label: 'Contributing', href: 'https://github.com/Binidu01/create-bini-app/blob/main/CONTRIBUTING.md' },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1"
                  >
                    {item.label}
                    <ExternalLink size={12} className="opacity-50" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* More */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">More</h3>
            <ul className="space-y-3">
              {[
                { label: 'npm', href: 'https://www.npmjs.com/package/create-bini-app' },
                { label: 'GitHub', href: 'https://github.com/Binidu01/create-bini-app' },
                { label: 'Issues', href: 'https://github.com/Binidu01/create-bini-app/issues' },
                { label: 'License', href: 'https://github.com/Binidu01/create-bini-app/blob/main/LICENSE' },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1"
                  >
                    {item.label}
                    <ExternalLink size={12} className="opacity-50" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-400">
            © {currentYear} Bini.js. MIT License.
          </p>
          <p className="text-sm text-slate-400">
            Built by{' '}
            <a
              href="https://github.com/Binidu01"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Binidu Ranasinghe
            </a>
            {' '}and{' '}
            <a
              href="https://github.com/Binidu01/create-bini-app/graphs/contributors"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              contributors
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}