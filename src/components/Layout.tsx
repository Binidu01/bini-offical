// src/components/Layout.tsx
import { Menu, X, ChevronRight, ExternalLink, Star, Search, Sun, Monitor, Moon } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { siGithub, siNpm, siReddit, siDiscord } from 'simple-icons'
import type { SearchSuggestion } from '../data/search'

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
      aria-label={icon.title}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
    >
      <path d={icon.path} />
    </svg>
  )
}

function BiniLogo({ className = '', height = 24 }: { className?: string; height?: number }) {
  const width = Math.round(height * (140 / 49))

  return (
    <span
      className={`block bg-black dark:bg-white ${className}`}
      style={{
        width,
        height,
        maskImage: 'url(/bini.svg)',
        maskSize: 'contain',
        maskRepeat: 'no-repeat',
        maskPosition: 'left center',
        WebkitMaskImage: 'url(/bini.svg)',
        WebkitMaskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskPosition: 'left center',
      }}
      role="img"
      aria-label="Bini.js"
    />
  )
}

function LinkedInIcon({ size = 14, className = '' }: { size?: number; className?: string }) {
  return (
    <span
      className={`inline-block shrink-0 bg-current ${className}`}
      style={{
        width: size,
        height: size,
        maskImage: 'url(/linkedin.svg)',
        maskSize: 'contain',
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskImage: 'url(/linkedin.svg)',
        WebkitMaskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
      }}
      aria-hidden="true"
    />
  )
}

type Theme = 'light' | 'system' | 'dark'

const getStoredTheme = (): Theme => {
  if (typeof window === 'undefined') return 'system'
  try {
    const stored = localStorage.getItem('bini-theme')
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored
    }
  } catch {
    /* storage unavailable */
  }
  return 'system'
}

const applyTheme = (theme: Theme) => {
  const root = document.documentElement
  const shouldUseDark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  root.classList.toggle('dark', shouldUseDark)
}

export const Header = () => {
  const navigate = useNavigate()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [searchSuggestions, setSearchSuggestions] = useState<SearchSuggestion[]>([])
  const [searchLoading, setSearchLoading] = useState(false)

  // Platform-dependent hint. Starts as "Ctrl K" (same on server and client),
  // then switches to ⌘K on Apple devices after mount, so hydration always matches.
  const [shortcutHint, setShortcutHint] = useState('Ctrl K')

  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchModalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const platform = navigator.platform || navigator.userAgent || ''
    if (/Mac|iPhone|iPad|iPod/i.test(platform)) setShortcutHint('⌘ K')
  }, [])

  const openSearch = async () => {
    setSearchOpen(true)

    if (searchSuggestions.length === 0 && !searchLoading) {
      setSearchLoading(true)
      try {
        const { searchSuggestions: suggestions } = await import('../data/search')
        setSearchSuggestions(suggestions)
      } finally {
        setSearchLoading(false)
      }
    }
  }

  const filteredSuggestions = (() => {
    if (!searchQuery) {
      return searchSuggestions.slice(0, 8)
    }

    const query = searchQuery.toLowerCase()

    return searchSuggestions
      .filter(
        (s) =>
          s.label.toLowerCase().includes(query) ||
          s.type.toLowerCase().includes(query) ||
          s.keywords?.some((k) => k.toLowerCase().includes(query))
      )
      .slice(0, 8)
  })()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        openSearch()
      }

      if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [searchOpen, searchSuggestions.length, searchLoading])

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
      setSearchQuery('')
      setSelectedIndex(0)
    }
  }, [searchOpen])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchModalRef.current && !searchModalRef.current.contains(e.target as Node)) {
        setSearchOpen(false)
      }
    }

    if (searchOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [searchOpen])

  useEffect(() => {
    setSelectedIndex(0)
  }, [searchQuery])

  const openSuggestion = (suggestion: SearchSuggestion) => {
    if (suggestion.href) {
      window.open(suggestion.href, '_blank', 'noopener,noreferrer')
    } else if (suggestion.path) {
      navigate(suggestion.path) // client-side navigation, no full reload
    }

    setSearchOpen(false)
    setSearchQuery('')
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()

      setSelectedIndex((prev) => (prev < filteredSuggestions.length - 1 ? prev + 1 : prev))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()

      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev))
    } else if (e.key === 'Enter' && filteredSuggestions[selectedIndex]) {
      e.preventDefault()
      openSuggestion(filteredSuggestions[selectedIndex])
    }
  }

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur-xl dark:border-neutral-800 dark:bg-black/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between lg:h-16">
            <div className="flex items-center gap-6 lg:gap-8">
              <Link to="/" className="group flex items-center gap-2" aria-label="Bini.js">
                <BiniLogo
                  height={24}
                  className="transition-transform group-hover:scale-105 lg:h-7"
                />
              </Link>

              <nav className="hidden items-center gap-1 lg:flex">
                {[
                  { label: 'Docs', path: '/docs' },
                  { label: 'Plugins', path: '/plugins' },
                  { label: 'Showcase', path: '/showcase' },
                  {
                    label: 'Releases',
                    href: 'https://github.com/Binidu01/bini-cli/releases',
                    external: true,
                  },
                ].map((item) =>
                  item.external ? (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white"
                    >
                      {item.label}
                      <ExternalLink size={12} className="opacity-50" />
                    </a>
                  ) : (
                    <Link
                      key={item.label}
                      to={item.path!}
                      className="rounded-lg px-3 py-1.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white"
                    >
                      {item.label}
                    </Link>
                  )
                )}
              </nav>
            </div>

            <button
              type="button"
              onClick={() => openSearch()}
              aria-label="Search documentation"
              className="hidden w-64 items-center justify-between gap-4 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-sm text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-500 dark:hover:bg-neutral-900 dark:hover:text-neutral-400 md:flex md:w-80 lg:w-96"
            >
              <span className="flex min-w-0 items-center gap-2">
                <Search size={15} className="shrink-0 text-neutral-500" />
                <span className="truncate">Search documentation...</span>
              </span>

              <kbd className="shrink-0 rounded-md border border-neutral-200 bg-white px-1.5 py-0.5 text-[11px] font-semibold text-neutral-600 dark:border-neutral-700 dark:bg-black dark:text-neutral-300">
                {shortcutHint}
              </kbd>
            </button>

            <div className="flex items-center gap-2">
              <a
                href="https://www.npmjs.com/package/create-bini-app"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden items-center gap-2 rounded-lg border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-600 transition-colors hover:border-[#CB3837]/30 hover:bg-neutral-100 hover:text-[#CB3837] dark:border-neutral-800 dark:text-neutral-400 dark:hover:border-[#CB3837]/30 dark:hover:bg-neutral-900 dark:hover:text-[#CB3837] sm:flex"
              >
                <SimpleIcon icon={siNpm} size={16} />
                <span>npm</span>
              </a>

              <a
                href="https://github.com/Binidu01/bini-cli"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden items-center gap-2 rounded-lg border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-black dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white sm:flex"
              >
                <Star size={16} className="text-yellow-500" />
                <span>Star us on GitHub</span>
              </a>

              <button
                type="button"
                onClick={() => openSearch()}
                className="rounded-lg p-2 text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white sm:hidden"
                aria-label="Search"
              >
                <Search size={18} />
              </button>

              <a
                href="https://github.com/Binidu01/bini-cli"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg p-2 text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white sm:hidden"
                aria-label="GitHub"
              >
                <SimpleIcon icon={siGithub} size={18} />
              </a>

              <a
                href="https://www.npmjs.com/package/create-bini-app"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg p-2 text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-[#CB3837] dark:text-neutral-400 dark:hover:text-[#CB3837] sm:hidden"
                aria-label="npm"
              >
                <SimpleIcon icon={siNpm} size={18} />
              </a>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="rounded-lg p-2 text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white lg:hidden"
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-neutral-200 bg-white dark:border-neutral-800 dark:bg-black lg:hidden">
            <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
              <button
                type="button"
                onClick={() => {
                  openSearch()
                  setMobileMenuOpen(false)
                }}
                className="mb-2 flex items-center justify-between gap-3 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-500 dark:hover:bg-neutral-900 dark:hover:text-neutral-400"
              >
                <span className="flex items-center gap-2">
                  <Search size={15} />
                  Search documentation...
                </span>

                <kbd className="shrink-0 rounded-md border border-neutral-200 bg-white px-1.5 py-0.5 text-[11px] font-semibold text-neutral-600 dark:border-neutral-700 dark:bg-black dark:text-neutral-300">
                  {shortcutHint}
                </kbd>
              </button>

              {[
                { label: 'Docs', path: '/docs' },
                { label: 'Plugins', path: '/plugins' },
                { label: 'Showcase', path: '/showcase' },
                {
                  label: 'Releases',
                  href: 'https://github.com/Binidu01/bini-cli/releases',
                  external: true,
                },
              ].map((item) =>
                item.external ? (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-black dark:text-neutral-300 dark:hover:bg-neutral-900 dark:hover:text-white"
                  >
                    {item.label}
                    <ExternalLink size={16} className="text-neutral-500" />
                  </a>
                ) : (
                  <Link
                    key={item.label}
                    to={item.path!}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-black dark:text-neutral-300 dark:hover:bg-neutral-900 dark:hover:text-white"
                  >
                    {item.label}
                    <ChevronRight size={16} className="text-neutral-500" />
                  </Link>
                )
              )}

              <a
                href="https://github.com/Binidu01/bini-cli"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 flex items-center justify-between rounded-lg border-t border-neutral-200 px-3 py-2.5 pt-4 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-black dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-900 dark:hover:text-white"
              >
                <span className="flex items-center gap-2">
                  <Star size={16} className="text-yellow-500" />
                  Star us on GitHub
                </span>

                <SimpleIcon icon={siGithub} size={16} />
              </a>
            </nav>
          </div>
        )}
      </header>

      {searchOpen && (
        <div className="fixed inset-0 z-60 overflow-hidden bg-black/40 backdrop-blur-sm dark:bg-black/70">
          <div className="fixed inset-0 overflow-y-auto overflow-x-hidden">
            <div className="flex min-h-full items-start justify-center p-4 pt-[12vh]">
              <div
                ref={searchModalRef}
                role="dialog"
                aria-modal="true"
                aria-label="Search documentation"
                className="w-full max-w-2xl transform overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-[#0a0a0a]"
              >
                <div className="relative flex items-center border-b border-neutral-200 dark:border-neutral-800">
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500"
                  />

                  <input
                    id="site-search"
                    name="search"
                    ref={searchInputRef}
                    type="text"
                    autoComplete="off"
                    aria-label="Search documentation"
                    placeholder="What are you searching for?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    className="h-14 w-full bg-transparent pl-12 pr-20 text-base text-black placeholder-neutral-400 focus:outline-none dark:text-white dark:placeholder-neutral-500"
                  />

                  <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1">
                    <kbd className="rounded border border-neutral-200 bg-neutral-100 px-1.5 py-0.5 font-mono text-[11px] text-neutral-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400">
                      Esc
                    </kbd>
                  </div>
                </div>

                {searchLoading && searchSuggestions.length === 0 ? (
                  <div className="px-4 py-12 text-center">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Loading suggestions...
                    </p>
                  </div>
                ) : filteredSuggestions.length > 0 ? (
                  <div className="max-h-96 overflow-y-auto overflow-x-hidden px-2 py-2">
                    {filteredSuggestions.map((suggestion, index) => {
                      const isActive = index === selectedIndex
                      const isExternal = !!suggestion.href

                      return (
                        <button
                          type="button"
                          key={`${suggestion.label}-${index}`}
                          onClick={() => openSuggestion(suggestion)}
                          onMouseEnter={() => setSelectedIndex(index)}
                          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                            isActive
                              ? 'bg-neutral-100 dark:bg-neutral-900'
                              : 'hover:bg-neutral-50 dark:hover:bg-neutral-900/60'
                          }`}
                        >
                          <div
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded border ${
                              isActive
                                ? 'border-neutral-300 bg-white text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200'
                                : 'border-neutral-200 bg-neutral-50 text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-500'
                            }`}
                          >
                            {isExternal ? (
                              <ExternalLink size={12} />
                            ) : (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                              </svg>
                            )}
                          </div>

                          <span
                            className={`min-w-0 flex-1 truncate text-sm ${
                              isActive
                                ? 'font-medium text-black dark:text-white'
                                : 'text-neutral-700 dark:text-neutral-300'
                            }`}
                          >
                            {suggestion.label}
                          </span>

                          <span
                            className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium ${
                              isActive
                                ? 'bg-cyan-500/20 text-cyan-700 dark:bg-cyan-500/25 dark:text-cyan-300'
                                : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400'
                            }`}
                          >
                            {suggestion.type}
                          </span>

                          {isActive && (
                            <ChevronRight size={14} className="shrink-0 text-neutral-400" />
                          )}
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <div className="px-4 py-12 text-center">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      No results found for "{searchQuery}"
                    </p>
                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-500">
                      Try a different search term
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between border-t border-neutral-200 bg-neutral-50 px-4 py-2 text-[11px] text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <kbd className="rounded border border-neutral-200 bg-white px-1 py-0.5 font-mono text-neutral-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300">
                        ↑↓
                      </kbd>
                      navigate
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="rounded border border-neutral-200 bg-white px-1 py-0.5 font-mono text-neutral-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300">
                        ↵
                      </kbd>
                      open
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="rounded border border-neutral-200 bg-white px-1 py-0.5 font-mono text-neutral-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300">
                        esc
                      </kbd>
                      close
                    </span>
                  </div>

                  <span>{filteredSuggestions.length} results</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export const Footer = () => {
  const currentYear = new Date().getFullYear()

  // Start with a value that is identical on the server and the client,
  // then read the real preference after mount.
  const [theme, setTheme] = useState<Theme>('system')

  useEffect(() => {
    setTheme(getStoredTheme())
  }, [])

  useEffect(() => {
    // Only needed for system preference changes while preference is "system"
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleSystemThemeChange = () => {
      if (getStoredTheme() === 'system') applyTheme('system')
    }

    mediaQuery.addEventListener('change', handleSystemThemeChange)

    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange)
  }, [])

  const handleThemeChange = (nextTheme: Theme) => {
    setTheme(nextTheme)
    try {
      localStorage.setItem('bini-theme', nextTheme)
    } catch {
      /* storage unavailable */
    }
    applyTheme(nextTheme)
  }

  const themeOptions = [
    { value: 'light' as Theme, label: 'Light', icon: Sun },
    { value: 'system' as Theme, label: 'System', icon: Monitor },
    { value: 'dark' as Theme, label: 'Dark', icon: Moon },
  ]

  return (
    <footer className="relative overflow-x-hidden border-t border-neutral-200 bg-white dark:border-neutral-800 dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* Brand */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <BiniLogo height={24} />
            </div>

            <p className="mb-4 max-w-xs text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              A native React framework for building cross-platform applications from a single
              codebase.
            </p>

            <div className="flex items-center gap-1">
              <a
                href="https://github.com/Binidu01/bini-cli"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg p-2 text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white"
                aria-label="GitHub"
              >
                <SimpleIcon icon={siGithub} size={18} />
              </a>

              <a
                href="https://www.npmjs.com/package/create-bini-app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg p-2 text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-[#CB3837] dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-[#CB3837]"
                aria-label="npm"
              >
                <SimpleIcon icon={siNpm} size={18} />
              </a>

              <a
                href="https://www.linkedin.com/showcase/bini-js/?viewAsMember=true"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg p-2 text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-[#0A66C2] dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-[#0A66C2]"
                aria-label="LinkedIn"
              >
                <LinkedInIcon size={18} />
              </a>

              <a
                href="https://www.reddit.com/r/binijs/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg p-2 text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-[#FF4500] dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-[#FF4500]"
                aria-label="Reddit"
              >
                <SimpleIcon icon={siReddit} size={18} />
              </a>

              <a
                href="https://discord.gg/BVRMCxHQpw"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg p-2 text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-[#5865F2] dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-[#5865F2]"
                aria-label="Discord"
              >
                <SimpleIcon icon={siDiscord} size={18} />
              </a>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-black dark:text-white">Resources</h3>

            <ul className="space-y-3">
              {[
                { label: 'Documentation', path: '/docs' },
                { label: 'Plugins', path: '/plugins' },
                { label: 'Showcase', path: '/showcase' },
                {
                  label: 'Releases',
                  href: 'https://github.com/Binidu01/bini-cli/releases',
                  external: true,
                },
              ].map((item) => (
                <li key={item.label}>
                  {item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-neutral-600 transition-colors hover:text-black dark:text-neutral-400 dark:hover:text-white"
                    >
                      {item.label}
                      <ExternalLink size={12} className="opacity-50" />
                    </a>
                  ) : (
                    <Link
                      to={item.path!}
                      className="text-sm text-neutral-600 transition-colors hover:text-black dark:text-neutral-400 dark:hover:text-white"
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
            <h3 className="mb-4 text-sm font-semibold text-black dark:text-white">Community</h3>

            <ul className="space-y-3">
              {[
                { label: 'GitHub Discussions', href: 'https://github.com/Binidu01/bini-cli/discussions' },
                { label: 'Reddit', href: 'https://www.reddit.com/r/binijs/' },
                { label: 'Discord', href: 'https://discord.gg/BVRMCxHQpw' },
                { label: 'LinkedIn', href: 'https://www.linkedin.com/showcase/bini-js/?viewAsMember=true' },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-neutral-600 transition-colors hover:text-black dark:text-neutral-400 dark:hover:text-white"
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
            <h3 className="mb-4 text-sm font-semibold text-black dark:text-white">More</h3>

            <ul className="space-y-3">
              {[
                { label: 'npm', href: 'https://www.npmjs.com/package/create-bini-app' },
                { label: 'GitHub', href: 'https://github.com/Binidu01/bini-cli' },
                { label: 'Issues', href: 'https://github.com/Binidu01/bini-cli/issues' },
                { label: 'License', href: 'https://github.com/Binidu01/bini-cli/blob/main/LICENSE' },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-neutral-600 transition-colors hover:text-black dark:text-neutral-400 dark:hover:text-white"
                  >
                    {item.label}
                    <ExternalLink size={12} className="opacity-50" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="flex flex-col gap-6 border-t border-neutral-200 pt-8 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            ©{' '}
            {/* Year is computed at build time for pre-rendered HTML and at runtime in the browser. */}
            <span suppressHydrationWarning>{currentYear}</span>{' '}
            <a
              href="https://binicooperations.dpdns.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-cyan-700 transition-colors hover:text-cyan-600 dark:text-cyan-400 dark:hover:text-cyan-300"
            >
              Bini Cooperation
            </a>
            .
          </p>

          {/* Theme pill — icons only, no labels */}
          <div
            className="inline-flex w-fit self-center rounded-full border border-neutral-200 bg-neutral-100/80 p-1 shadow-sm backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/80 sm:self-auto"
            role="group"
            aria-label="Theme preference"
          >
            {themeOptions.map(({ value, label, icon: Icon }) => {
              const isActive = theme === value

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleThemeChange(value)}
                  aria-label={`${label} theme`}
                  aria-pressed={isActive}
                  title={label}
                  className={`
                    flex h-8 w-8 items-center justify-center rounded-full
                    transition-all duration-200
                    ${
                      isActive
                        ? 'bg-white text-black shadow-sm ring-1 ring-neutral-200 dark:bg-neutral-800 dark:text-white dark:ring-neutral-700'
                        : 'text-neutral-500 hover:bg-neutral-200/70 hover:text-neutral-900 dark:text-neutral-500 dark:hover:bg-neutral-800/70 dark:hover:text-neutral-200'
                    }
                  `}
                >
                  <Icon size={15} strokeWidth={1.8} />
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}
