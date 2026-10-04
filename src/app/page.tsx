// src/app/page.tsx
import {
  ArrowRight,
  Check,
  Copy,
  Gauge,
  Globe,
  Heart,
  Import as ImportIcon,
  Layers,
  Boxes,
  Route as RouteIcon,
  Server,
  ShieldCheck,
  Smartphone,
} from 'lucide-react'
import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { siAndroid, siApple, siGithub, siLinux } from 'simple-icons'

import { BiniAnimation } from '../components/BiniAnimation'
import { MultiTerminal } from '../components/DocBlocks'
import { Header, Footer } from '../components/Layout'

// Below-the-fold animations are split into their own chunks and only
// mounted once they get close to the viewport.
const FoundationAnimation = lazy(() =>
  import('../components/FoundationAnimation').then((mod) => ({
    default: mod.FoundationAnimation,
  }))
)
const PluginAnimation = lazy(() => import('../components/PluginAnimation'))

/* ─── Lazy mount helper ───────────────────────────────────────────── */

/**
 * Renders nothing on the server / first paint, then mounts its children
 * once the wrapper is within 400px of the viewport. After that it never
 * unmounts, so the animation keeps running when scrolled away.
 */
function InView({
  children,
  className,
  style,
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true)
          io.disconnect()
        }
      },
      { rootMargin: '400px' }
    )

    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className={className} style={style}>
      {show && <Suspense fallback={null}>{children}</Suspense>}
    </div>
  )
}

/* ─── Icons ───────────────────────────────────────────────────────── */

function SimpleIcon({
  icon,
  className = '',
  size = 20,
}: {
  icon: { path: string }
  className?: string
  size?: number
}) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
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

const WindowsIcon = ({ className = '', size = 20 }: { className?: string; size?: number }) => (
  <svg
    aria-hidden="true"
    focusable="false"
    viewBox="0 0 512 512.02"
    width={size}
    height={size}
    className={className}
    fill="currentColor"
  >
    <path d="M0 512.02h242.686V269.335H0V512.02zm0-269.334h242.686V0H0v242.686zm269.314 0H512V0H269.314v242.686zm0 269.334H512V269.335H269.314V512.02z" />
  </svg>
)

/* ─── Small pieces ────────────────────────────────────────────────── */

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <span className="mb-4 inline-block font-mono text-[11px] font-bold tracking-[0.2em] text-cyan-700 uppercase dark:text-cyan-400/80">
    {children}
  </span>
)

const SectionDivider = () => (
  <div
    aria-hidden
    className="pointer-events-none absolute top-0 right-0 left-0 h-px bg-linear-to-r from-transparent via-neutral-200 to-transparent dark:via-slate-700"
  />
)

/* ─── Shell command highlighting ──────────────────────────────────── */

/**
 * Tokenizes a shell line into colored spans. Handles the `$ ` prompt,
 * the command, subcommands, and `--flags` in a distinct color. Matches
 * the palette used by `MultiTerminal` in DocBlocks.
 */
function ShellLine({ code }: { code: string }) {
  const prompt = (
    <span className="font-mono text-emerald-700 dark:text-emerald-400">$ </span>
  )
  const rest = code.replace(/^\$ /, '')

  const cmdMatch = rest.match(/^([a-zA-Z0-9_@./-]+)(.*)$/)
  if (!cmdMatch) {
    return (
      <>
        {prompt}
        <span className="font-mono text-neutral-800 dark:text-neutral-200">{rest}</span>
      </>
    )
  }

  const [, bin, afterBin] = cmdMatch
  const parts = afterBin.split(/(\s+--?[a-zA-Z0-9-]+)/g)

  return (
    <>
      {prompt}
      <span className="font-mono text-cyan-700 dark:text-cyan-400">{bin}</span>
      {parts.map((p, i) => {
        if (!p) return null
        if (/^\s+--?/.test(p)) {
          return (
            <span key={i} className="font-mono text-violet-700 dark:text-violet-300">
              {p}
            </span>
          )
        }
        return (
          <span key={i} className="font-mono text-neutral-800 dark:text-neutral-200">
            {p}
          </span>
        )
      })}
    </>
  )
}

/* ─── Mini terminal with per-block copy ───────────────────────────── */

function MiniTerminal({ commands }: { commands: string[] }) {
  return (
    <div className="flex flex-col gap-1.5">
      {commands.map((cmd) => (
        <MiniCommand key={cmd} cmd={cmd} />
      ))}
    </div>
  )
}

function MiniCommand({ cmd }: { cmd: string }) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(cmd)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="group/cmd relative overflow-hidden rounded-md border border-neutral-200 bg-white dark:border-slate-800 dark:bg-black">
      <pre className="overflow-x-auto px-3 py-2 pr-9 text-left font-mono text-[11px] leading-relaxed whitespace-pre">
        <ShellLine code={`$ ${cmd}`} />
      </pre>
      <button
        type="button"
        onClick={copy}
        title="Copy command"
        aria-label="Copy command"
        className="absolute top-1 right-1 inline-flex h-6 w-6 items-center justify-center rounded text-neutral-500 opacity-0 transition-opacity group-hover/cmd:opacity-100 hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-300"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-emerald-500" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </button>
    </div>
  )
}

/* ─── Color tokens (theme-aware) ──────────────────────────────────── */

const COLOR = {
  cyan: {
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-700 dark:text-cyan-400',
  },
  purple: {
    bg: 'bg-violet-500/10',
    text: 'text-violet-600 dark:text-violet-400',
  },
  emerald: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-700 dark:text-emerald-400',
  },
  amber: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-700 dark:text-amber-400',
  },
  blue: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-600 dark:text-blue-400',
  },
  yellow: {
    bg: 'bg-yellow-500/10',
    text: 'text-yellow-700 dark:text-yellow-400',
  },
}

/* ─── Scaffold tabs (shared by hero + final CTA) ──────────────────── */

const SCAFFOLD_TABS = [
  { id: 'npm', label: 'npm', command: '$ npx create-bini-app@latest' },
  { id: 'pnpm', label: 'pnpm', command: '$ pnpm create bini-app@latest' },
  { id: 'yarn', label: 'yarn', command: '$ yarn create bini-app@latest' },
  { id: 'bun', label: 'bun', command: '$ bun create bini-app@latest' },
]

/* ─── Data ────────────────────────────────────────────────────────── */

const WHY_BINI = [
  {
    icon: Layers,
    problem:
      'Bundler configs, router boilerplate, and manual code splitting eat into every new project.',
    solution:
      'Drop a file in src/app/, get a route - instantly code-split, no router config, no boilerplate.',
    color: 'cyan',
  },
  {
    icon: Boxes,
    problem:
      'Shipping to web, desktop, and mobile usually means three codebases and three toolchains.',
    solution:
      'One codebase compiles to a real web app, desktop binary, or mobile app - nothing emulated or wrapped.',
    color: 'yellow',
  },
  {
    icon: Server,
    problem:
      'Backend and frontend live in separate repos, separate deploys, separate mental models.',
    solution:
      'API routes are colocated in src/app/api/, powered by Hono, and deploy alongside your frontend.',
    color: 'amber',
  },
  {
    icon: Globe,
    problem: 'Each hosting platform has its own APIs, configs, and entry points.',
    solution:
      'bini-deploy generates the right configs and entry files for any platform - one command handles Netlify, Vercel, Cloudflare, Deno, Node, and native apps.',
    color: 'purple',
  },
]

const DIFFERENTIATORS = [
  {
    icon: RouteIcon,
    title: 'File-based routing',
    desc: 'Nested layouts, dynamic segments, and per-route metadata - no router config to maintain.',
  },
  {
    icon: ImportIcon,
    title: 'Auto-imports',
    desc: 'useState, useParams, getEnv, and more are available with zero import statements.',
  },
  {
    icon: Server,
    title: 'One handler, every runtime',
    desc: 'The same Hono API handler runs in dev middleware, bini-server, or as an edge function - generated per target.',
  },
  {
    icon: Smartphone,
    title: 'Real native builds',
    desc: 'Desktop and mobile builds are real Tauri apps - not Electron wrappers, not emulators.',
  },
  {
    icon: Gauge,
    title: 'Rust-powered tooling',
    desc: 'Vite + Rolldown for bundling, Oxlint + Oxfmt for lint and format - all pre-configured out of the box.',
  },
  {
    icon: ShieldCheck,
    title: 'Native APIs, wired automatically',
    desc: 'bini-native detects the web APIs you call and wires Tauri plugins, permissions, and manifests for you.',
  },
]

const PLATFORMS = [
  {
    name: 'Web',
    badge: 'Default',
    icon: 'globe',
    color: 'cyan',
    desc: 'Standard Vite + React SPA with file-based routing and a Hono API layer.',
  },
  {
    name: 'Windows',
    badge: null,
    icon: 'windows',
    color: 'cyan',
    desc: 'Native desktop binary running inside WebView2, with Authenticode code signing.',
  },
  {
    name: 'macOS',
    badge: null,
    icon: 'apple',
    color: 'purple',
    desc: 'Native desktop binary running inside WKWebView, with Developer ID + notarization.',
  },
  {
    name: 'Linux',
    badge: null,
    icon: 'linux',
    color: 'amber',
    desc: 'Native desktop binary in WebKitGTK, distributed as a GPG-signed AppImage.',
  },
  {
    name: 'Android',
    badge: null,
    icon: 'android',
    color: 'emerald',
    desc: "Real native APK/AAB via Tauri's Android backend - not a WebView wrapper.",
  },
  {
    name: 'iOS',
    badge: null,
    icon: 'apple',
    color: 'blue',
    desc: "Real native app via Tauri's iOS backend, running inside WKWebView.",
  },
]

const PLATFORM_COMMANDS: Record<string, string[]> = {
  Web: ['npm run dev', 'npm run build', 'npm start'],
  Windows: ['npm run tauri:dev', 'npm run tauri:build'],
  macOS: ['npm run tauri:dev', 'npm run tauri:build'],
  Linux: ['npm run tauri:dev', 'npm run tauri:build'],
  Android: ['npm run android', 'npm run android:build'],
  iOS: ['npm run ios', 'npm run ios:build'],
}

/* ─── Page ────────────────────────────────────────────────────────── */

const Home = () => {
  const [hoveredPlatform, setHoveredPlatform] = useState<string | null>(null)

  const renderPlatformIcon = (icon: string, colorKey: string) => {
    const col = COLOR[colorKey as keyof typeof COLOR]
    const map: Record<string, React.ReactNode> = {
      windows: <WindowsIcon size={20} className={col?.text || ''} />,
      globe: <Globe size={20} className={col?.text || ''} />,
      apple: <SimpleIcon icon={siApple} size={20} className={col?.text || ''} />,
      linux: <SimpleIcon icon={siLinux} size={20} className={col?.text || ''} />,
      android: <SimpleIcon icon={siAndroid} size={20} className={col?.text || ''} />,
    }
    return map[icon] || null
  }

  return (
    <div className="min-h-screen bg-white font-sans antialiased overflow-x-hidden dark:bg-black">
      <Header />

      <main>
      {/* Hero */}
      <section className="relative px-4 pt-16 pb-8 sm:px-6 lg:px-8 lg:pt-20 lg:pb-10">
        <div className="mx-auto max-w-7xl">
          <div className="absolute top-0 right-0 left-0 h-px bg-linear-to-r from-transparent via-neutral-200 to-transparent dark:via-slate-700" />

          <div className="mb-4 flex justify-center">
            <img src="/logo.svg" alt="Bini.js Logo" className="h-12 w-12 lg:h-14 lg:w-14" />
          </div>

          <div className="mb-4 text-center">
            <h1 className="text-3xl leading-[1.2] font-bold tracking-tight text-black sm:text-4xl lg:text-5xl dark:text-white">
              React Framework for
              <br />
              <span className="bg-linear-to-r from-cyan-500 via-sky-500 to-blue-500 bg-clip-text text-transparent dark:from-cyan-400 dark:via-sky-400 dark:to-blue-400">
                Cross-Platform
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-neutral-600 sm:text-lg dark:text-neutral-400">
              One codebase. Six platforms. Zero boilerplate. Write React, ship everywhere.
            </p>
          </div>

          <div className="relative grid items-center gap-6 lg:grid-cols-2 lg:gap-8">
            <div className="absolute top-0 bottom-0 left-1/2 hidden w-px bg-linear-to-b from-transparent via-neutral-200 to-transparent lg:block dark:via-slate-700" />

            <div className="text-center lg:pr-6 lg:text-left">
              <p className="mx-auto mb-5 max-w-xl text-base leading-relaxed text-neutral-600 lg:mx-0 lg:max-w-none lg:text-lg dark:text-neutral-400">
                Build modern, high-performance apps that run natively everywhere without complex
                tooling, steep learning curves, or endless config files.
              </p>

              <div className="mb-5 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                <Link
                  to="/docs"
                  className="group relative rounded-lg bg-black px-5 py-2.5 font-medium text-white shadow-sm transition-all hover:bg-neutral-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                >
                  <span className="flex items-center gap-2">
                    Get Started
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>

                <a
                  href="https://github.com/Binidu01/bini-cli"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-neutral-300 bg-white px-5 py-2.5 font-medium text-neutral-700 shadow-sm transition-all hover:border-neutral-400 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-black dark:text-neutral-300 dark:hover:border-neutral-700 dark:hover:bg-neutral-900 dark:hover:text-white"
                >
                  <span className="flex items-center gap-2">
                    <SimpleIcon icon={siGithub} size={18} />
                    GitHub
                  </span>
                </a>
              </div>

              <div className="mx-auto max-w-lg text-left lg:mx-0">
                <MultiTerminal tabs={SCAFFOLD_TABS} />
              </div>
            </div>

            <div className="relative w-full lg:pl-6">
              <div className="flex w-full items-center justify-center">
                <div className="mx-auto w-full max-w-full">
                  <BiniAnimation />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 lg:mt-10" />
        </div>
      </section>

      {/* Foundation */}
      <section
        id="foundation"
        className="relative overflow-x-clip px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28"
      >
        <SectionDivider />
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <Eyebrow>Stack</Eyebrow>
            <h2 className="mb-3 text-3xl font-bold text-black md:text-4xl dark:text-white">
              Built on a foundation of fast, production-grade tooling
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">
              Every tool is carefully chosen and pre-configured so you can focus on building.
            </p>
          </div>

          <div className="flex min-h-130 w-full items-center justify-center lg:min-h-150">
            <InView className="w-full">
              <FoundationAnimation />
            </InView>
          </div>
        </div>
      </section>

      {/* Why Bini */}
      <section className="relative overflow-x-clip px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <SectionDivider />
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <Eyebrow>Motivation</Eyebrow>
            <h2 className="mb-4 text-3xl font-bold text-black md:text-4xl dark:text-white">
              Why Bini?
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">
              Most starters give you a bundler and call it a day. Bini.js gives you a framework -
              wired together and configured correctly from the first commit.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {WHY_BINI.map((item, i) => {
              const Icon = item.icon
              const col = COLOR[item.color as keyof typeof COLOR]
              return (
                <div
                  key={i}
                  className="relative rounded-2xl border border-neutral-200 bg-white p-6 transition-colors hover:border-neutral-300 lg:p-8 dark:border-slate-800 dark:bg-[#0a0a0a] dark:hover:border-slate-700"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${col.bg}`}
                    >
                      <Icon className={`h-5 w-5 ${col.text}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-3">
                        <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase dark:text-neutral-500">
                          Problem
                        </span>
                        <p className="mt-1.5 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                          {item.problem}
                        </p>
                      </div>
                      <div className="my-3 h-px bg-neutral-200 dark:bg-slate-800" />
                      <div>
                        <span className="text-[10px] font-bold tracking-widest text-cyan-700 uppercase dark:text-cyan-400">
                          Solution
                        </span>
                        <p className="mt-1.5 text-sm leading-relaxed text-neutral-900 dark:text-neutral-100">
                          {item.solution}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Differentiators */}
      <section className="relative overflow-x-clip px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <SectionDivider />
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <Eyebrow>Architecture</Eyebrow>
            <h2 className="mb-4 text-3xl font-bold text-black md:text-4xl dark:text-white">
              What makes it different?
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">
              Complexity stays invisible. You write normal React and normal web APIs - the
              framework handles the rest.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {DIFFERENTIATORS.map((item, i) => {
              const Icon = item.icon
              return (
                <div
                  key={i}
                  className="group rounded-2xl border border-neutral-200 bg-white p-6 transition-colors hover:border-neutral-300 dark:border-slate-800 dark:bg-[#0a0a0a] dark:hover:border-slate-700"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 transition-colors group-hover:border-cyan-500/50">
                    <Icon className="h-5 w-5 text-cyan-700 dark:text-cyan-400" />
                  </div>
                  <h3 className="mb-2 text-base font-semibold text-black dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                    {item.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Platform showcase */}
      <section className="relative overflow-x-clip px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <SectionDivider />
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <Eyebrow>Targets</Eyebrow>
            <h2 className="mb-4 text-3xl font-bold text-black md:text-4xl dark:text-white">
              One codebase. Six platforms.
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">
              <code className="font-mono text-base text-cyan-700 dark:text-cyan-400">
                --platform
              </code>{' '}
              picks the target - each scaffold gets exactly the dependencies, scripts, and config
              it needs.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PLATFORMS.map((platform) => {
              const col = COLOR[platform.color as keyof typeof COLOR]
              const commands = PLATFORM_COMMANDS[platform.name] || []
              const isHovered = hoveredPlatform === platform.name

              return (
                <div
                  key={platform.name}
                  className="relative cursor-default rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:border-neutral-300 dark:border-slate-800 dark:bg-[#0a0a0a] dark:hover:border-slate-700"
                  onMouseEnter={() => setHoveredPlatform(platform.name)}
                  onMouseLeave={() => setHoveredPlatform(null)}
                >
                  {platform.badge && (
                    <span className="absolute top-4 right-4 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-1 text-[9px] font-bold tracking-widest text-cyan-700 uppercase dark:text-cyan-400">
                      {platform.badge}
                    </span>
                  )}

                  <div className="mb-3 flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${col.bg}`}
                    >
                      {renderPlatformIcon(platform.icon, platform.color)}
                    </div>
                    <h3 className={`text-base font-semibold ${col.text}`}>{platform.name}</h3>
                  </div>

                  <p className="mb-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                    {platform.desc}
                  </p>

                  {isHovered && (
                    <div className="overflow-hidden">
                      <div className="border-t border-neutral-200 pt-3 dark:border-slate-800">
                        <MiniTerminal commands={commands} />
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Ecosystem */}
      <section className="relative overflow-x-clip px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <SectionDivider />
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 text-center sm:mb-8">
            <Eyebrow>Ecosystem</Eyebrow>
            <h2 className="mb-3 text-3xl font-bold text-black md:text-4xl dark:text-white">
              Eight packages. One framework.
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">
              Every package is purpose-built and works seamlessly together - or standalone.
            </p>
          </div>

          <InView style={{ aspectRatio: '760 / 500' }}>
            <PluginAnimation />
          </InView>
        </div>
      </section>

      {/* License */}
      <section className="relative overflow-x-clip px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <SectionDivider />
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <Eyebrow>License</Eyebrow>
            <h2 className="mb-3 text-2xl font-bold text-black md:text-3xl dark:text-white">
              Free &amp; open source
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">
              Bini.js is MIT Licensed and will always be free and open source. Made possible by
              our contributors and these companies:
            </p>

            <a
              href="https://github.com/sponsors/Binidu01"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-2 rounded-lg bg-black px-5 py-2.5 font-medium text-white shadow-sm transition-all hover:bg-neutral-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
            >
              <Heart className="h-4 w-4" />
              Become a sponsor
            </a>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-x-clip px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <SectionDivider />
        <div className="mx-auto max-w-4xl text-center">
          <div>
            <div className="mb-6 flex justify-center">
              <img src="/logo.svg" alt="Bini.js" className="h-16 w-16" />
            </div>
            <h2 className="mb-4 text-3xl font-bold text-black md:text-4xl dark:text-white">
              Ready to build with Bini.js?
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-lg text-neutral-600 dark:text-neutral-400">
              Get started in seconds. Build for web, desktop, and mobile - all from one codebase.
            </p>

            <div className="mx-auto mb-6 max-w-lg text-left">
              <MultiTerminal tabs={SCAFFOLD_TABS} />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/docs"
                className="rounded-lg bg-black px-5 py-2.5 font-medium text-white transition-all hover:bg-neutral-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
              >
                Get Started
              </Link>
              <a
                href="https://github.com/Binidu01/bini-cli"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-neutral-300 bg-white px-5 py-2.5 font-medium text-neutral-700 transition-all hover:border-neutral-400 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-black dark:text-neutral-300 dark:hover:border-neutral-700 dark:hover:bg-neutral-900 dark:hover:text-white"
              >
                <span className="flex items-center gap-2">
                  <SimpleIcon icon={siGithub} size={18} />
                  GitHub
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>
      </main>

      <Footer />
    </div>
  )
}

export default Home
