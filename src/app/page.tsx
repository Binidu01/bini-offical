// src/app/page.tsx
import {
  ArrowRight,
  Boxes,
  Check,
  Copy,
  FileCode2,
  Gauge,
  Globe,
  Heart,
  Import as ImportIcon,
  Layers,
  MonitorSmartphone,
  Route as RouteIcon,
  Search,
  Server,
  ShieldCheck,
  Zap,
} from 'lucide-react'
import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { siAndroid, siApple, siGithub, siLinux } from 'simple-icons'

import { BiniAnimation } from '../components/BiniAnimation'
import { MultiTerminal } from '../components/DocBlocks'
import { Footer, Header } from '../components/Layout'

// Below-the-fold animations are split into their own chunks and only
// mounted once they get close to the viewport.
const FoundationAnimation = lazy(() =>
  import('../components/FoundationAnimation').then((mod) => ({
    default: mod.FoundationAnimation,
  }))
)
const PluginAnimation = lazy(() => import('../components/PluginAnimation'))

const FOCUS_RING =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500'

/* ─── Lazy mount helper ───────────────────────────────────────────── */

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

function PlatformIcon({ icon, className = '' }: { icon: string; className?: string }) {
  switch (icon) {
    case 'windows':
      return <WindowsIcon size={20} className={className} />
    case 'globe':
      return <Globe size={20} className={className} />
    case 'apple':
      return <SimpleIcon icon={siApple} size={20} className={className} />
    case 'linux':
      return <SimpleIcon icon={siLinux} size={20} className={className} />
    case 'android':
      return <SimpleIcon icon={siAndroid} size={20} className={className} />
    default:
      return null
  }
}

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

function SectionHeader({
  eyebrow,
  title,
  children,
  className = 'mb-16',
}: {
  eyebrow: string
  title: React.ReactNode
  children?: React.ReactNode
  className?: string
}) {
  return (
    <div className={`${className} text-center`}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mb-4 text-3xl font-bold text-black md:text-4xl dark:text-white">{title}</h2>
      {children && (
        <p className="mx-auto max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">
          {children}
        </p>
      )}
    </div>
  )
}

/* ─── Shell command highlighting ──────────────────────────────────── */

function ShellLine({ code }: { code: string }) {
  const prompt = <span className="text-emerald-700 dark:text-emerald-400">$ </span>
  const rest = code.replace(/^\$ /, '')

  const cmdMatch = rest.match(/^([a-zA-Z0-9_@./-]+)(.*)$/)
  if (!cmdMatch) {
    return (
      <>
        {prompt}
        <span className="text-neutral-800 dark:text-neutral-200">{rest}</span>
      </>
    )
  }

  const [, bin, afterBin] = cmdMatch
  const parts = afterBin.split(/(\s+--?[a-zA-Z0-9-]+)/g)

  return (
    <>
      {prompt}
      <span className="text-cyan-700 dark:text-cyan-400">{bin}</span>
      {parts.map((p, i) => {
        if (!p) return null
        if (/^\s+--?/.test(p)) {
          return (
            <span key={i} className="text-violet-700 dark:text-violet-300">
              {p}
            </span>
          )
        }
        return (
          <span key={i} className="text-neutral-800 dark:text-neutral-200">
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
      <pre
        className="overflow-x-auto px-3 py-2 pr-9 text-left text-xs leading-relaxed font-medium whitespace-pre"
        style={{ fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif" }}
      >
        <ShellLine code={`$ ${cmd}`} />
      </pre>
      <button
        type="button"
        onClick={copy}
        title="Copy command"
        aria-label="Copy command"
        className={`absolute top-1 right-1 inline-flex h-6 w-6 items-center justify-center rounded text-neutral-500 transition-opacity [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover/cmd:opacity-100 hover:text-neutral-700 focus-visible:opacity-100 dark:text-neutral-500 dark:hover:text-neutral-300 ${FOCUS_RING}`}
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

const CARD =
  'rounded-2xl border border-neutral-200 bg-white transition-colors hover:border-neutral-300 dark:border-slate-800 dark:bg-[#0a0a0a] dark:hover:border-slate-700'

/* ─── Scaffold tabs ───────────────────────────────────────────────── */

const SCAFFOLD_TABS = [
  { id: 'npm', label: 'npm', command: '$ npx create-bini-app@latest' },
  { id: 'pnpm', label: 'pnpm', command: '$ pnpm create bini-app@latest' },
  { id: 'yarn', label: 'yarn', command: '$ yarn create bini-app@latest' },
  { id: 'bun', label: 'bun', command: '$ bun create bini-app@latest' },
]

/* ─── Visuals (illustration-style SVG mockups) ────────────────────── */

// Theme-aware SVG paint tokens
const STROKE = 'stroke-neutral-300 dark:stroke-neutral-800'
const ACCENT_STROKE = 'stroke-neutral-400 dark:stroke-neutral-600'
const SURFACE = 'fill-white dark:fill-black'
const BONE = 'fill-neutral-200 dark:fill-neutral-800'
const BONE_SOFT = 'fill-neutral-100 dark:fill-neutral-900'
const TEXT_ACCENT = 'font-medium fill-neutral-500 dark:fill-neutral-400'

const GridPattern = () => (
  <div
    aria-hidden
    className="absolute inset-0 opacity-[0.05] dark:opacity-[0.08]"
    style={{
      backgroundImage:
        'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
      backgroundSize: '24px 24px',
    }}
  />
)

function VisualCanvas({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-full w-full" aria-hidden>
      <GridPattern />
      <svg
        viewBox="0 0 240 180"
        preserveAspectRatio="xMidYMid meet"
        className="relative h-full w-full"
        fill="none"
        style={{ fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif" }}
      >
        {children}
      </svg>
    </div>
  )
}

// 2. SSG: stacked pre-rendered pages
const StaticPage = ({
  x,
  y,
  route,
}: {
  x: number
  y: number
  route: string
}) => (
  <g>
    <rect
      x={x}
      y={y}
      width="112"
      height="76"
      rx="4"
      strokeWidth="1"
      className={`${SURFACE} ${STROKE}`}
    />
    <text x={x + 104} y={y + 13} textAnchor="end" fontSize="7" className={TEXT_ACCENT}>
      {route}
    </text>
    <rect x={x + 8} y={y + 9} width="30" height="5" rx="1.5" className={BONE} />
    <rect x={x + 8} y={y + 24} width="96" height="3" rx="1.5" className={BONE_SOFT} />
    <rect x={x + 8} y={y + 32} width="74" height="3" rx="1.5" className={BONE_SOFT} />
    <rect x={x + 8} y={y + 44} width="44" height="24" rx="2" className={BONE_SOFT} />
    <rect x={x + 58} y={y + 44} width="46" height="24" rx="2" className={BONE_SOFT} />
  </g>
)

const VisualSSG = () => (
  <VisualCanvas>
    <StaticPage x={104} y={18} route="/blog" />
    <StaticPage x={70} y={46} route="/docs" />
    <StaticPage x={36} y={74} route="/" />
  </VisualCanvas>
)

// 6. Native Tauri builds: desktop window + mobile device
const VisualTauri = () => (
  <VisualCanvas>
    <text x="24" y="24" fontSize="7" className={TEXT_ACCENT}>
      desktop
    </text>
    <rect
      x="24"
      y="30"
      width="140"
      height="100"
      rx="6"
      strokeWidth="1"
      className={`${SURFACE} ${STROKE}`}
    />
    <circle cx="35" cy="40" r="2" className={BONE} />
    <circle cx="43" cy="40" r="2" className={BONE} />
    <circle cx="51" cy="40" r="2" className={BONE} />
    <path d="M24 50 H164" strokeWidth="1" className={STROKE} />
    <rect x="34" y="60" width="44" height="6" rx="2" className={BONE} />
    <rect x="34" y="72" width="100" height="3" rx="1.5" className={BONE_SOFT} />
    <rect x="34" y="82" width="52" height="38" rx="3" className={BONE_SOFT} />
    <rect x="92" y="82" width="52" height="38" rx="3" className={BONE_SOFT} />

    <text x="150" y="56" fontSize="7" className={TEXT_ACCENT}>
      mobile
    </text>
    <rect
      x="150"
      y="62"
      width="58"
      height="100"
      rx="9"
      strokeWidth="1"
      className={`${SURFACE} ${STROKE}`}
    />
    <rect x="170" y="68" width="18" height="3" rx="1.5" className={BONE} />
    <rect x="160" y="82" width="38" height="5" rx="2" className={BONE} />
    <rect x="160" y="94" width="38" height="3" rx="1.5" className={BONE_SOFT} />
    <rect x="160" y="104" width="38" height="24" rx="3" className={BONE_SOFT} />
    <rect x="160" y="134" width="38" height="18" rx="3" className={BONE_SOFT} />
  </VisualCanvas>
)

// Hosting: one build (dist) layered over five deploy targets
const VisualHosting = () => {
  const hosts = ['Vercel', 'Netlify', 'Cloudflare', 'Deno Deploy', 'Node']
  return (
    <VisualCanvas>
      <text x="16" y="32" fontSize="7" className={TEXT_ACCENT}>
        dist
      </text>
      <rect
        x="16"
        y="40"
        width="118"
        height="100"
        rx="6"
        strokeWidth="1"
        className={`${SURFACE} ${STROKE}`}
      />
      <circle cx="26" cy="48" r="2" className={BONE} />
      <circle cx="34" cy="48" r="2" className={BONE} />
      <circle cx="42" cy="48" r="2" className={BONE} />
      <path d="M16 56 H134" strokeWidth="1" className={STROKE} />
      <rect x="26" y="66" width="50" height="6" rx="2" className={BONE} />
      <rect x="26" y="78" width="98" height="3" rx="1.5" className={BONE_SOFT} />
      <rect x="26" y="92" width="45" height="34" rx="3" className={BONE_SOFT} />
      <rect x="79" y="92" width="45" height="34" rx="3" className={BONE_SOFT} />

      {hosts.map((host, i) => {
        const x = 130 + i * 6
        const y = 22 + i * 26
        return (
          <g key={host}>
            <rect
              x={x}
              y={y}
              width="84"
              height="34"
              rx="5"
              strokeWidth="1"
              className={`${SURFACE} ${STROKE}`}
            />
            <text x={x + 9} y={y + 12} dominantBaseline="central" fontSize="7" className={TEXT_ACCENT}>
              {host}
            </text>
            <circle cx={x + 74} cy={y + 12} r="2.5" className={BONE} />
            <rect x={x + 9} y={y + 21} width="46" height="3" rx="1.5" className={BONE_SOFT} />
          </g>
        )
      })}
    </VisualCanvas>
  )
}

/* ─── Technical Features Data ─────────────────────────────────────── */

const VISUAL_BENEFITS = [
  {
    title: 'Static Generation (SSG)',
    desc: 'Every route is pre-rendered to static HTML at build time, providing perfect Lighthouse scores and instant crawling.',
    visual: <VisualSSG />,
    href: '/docs/static-export',
  },
  {
    title: 'Deploy Anywhere',
    desc: 'Generate production entries for Vercel, Netlify, Cloudflare Pages and Deno Deploy, or run the Node server anywhere.',
    visual: <VisualHosting />,
    href: '/docs/deploying',
  },
  {
    title: 'Native Tauri Builds',
    desc: 'Desktop and mobile builds compile to real Tauri binaries - not Electron wrappers or emulators.',
    visual: <VisualTauri />,
    href: '/docs/platform-web',
  },
]

const TEXT_BENEFITS = [
  {
    title: 'File-Based Routing',
    desc: 'Create routes using the file system, including dynamic, catch-all, parallel and intercepting routes with nested layouts.',
    href: '/docs/file-based-routing',
  },
  {
    title: 'Loaders and Actions',
    desc: 'Load data before a route renders and handle mutations with actions, then read the result anywhere in the route.',
    href: '/docs/loaders',
  },
  {
    title: 'API Routes',
    desc: 'Build API endpoints with plain function handlers or Hono, in dev, in bini-server, or on the edge.',
    href: '/docs/api-routes',
  },
  {
    title: 'Environment Variables',
    desc: 'BINI_ and VITE_ prefixed variables reach the client. Everything else stays on the server.',
    href: '/docs/environment-variables',
  },
  {
    title: 'Metadata & SEO',
    desc: 'Set per-route metadata, Open Graph and Twitter cards, and icons without leaving your route files.',
    href: '/docs/metadata',
  },
  {
    title: 'CSS Support',
    desc: 'Style your application with Tailwind CSS or CSS Modules.',
    href: '/docs/css',
  },
]

const PLATFORMS = [
  {
    name: 'Web',
    badge: 'Default',
    icon: 'globe',
    color: 'cyan',
    desc: 'Vite + React with file-based routing, dev SSR, and every route pre-rendered to static HTML at build time - plus a Hono API layer.',
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
  const [activePlatform, setActivePlatform] = useState<string | null>(null)

  // Keep the body background in sync with the theme
  useEffect(() => {
    const sync = () => {
      const dark = document.documentElement.classList.contains('dark')
      document.body.style.backgroundColor = dark ? '#000000' : '#ffffff'
      document.body.style.colorScheme = dark ? 'dark' : 'light'
    }

    sync()
    const observer = new MutationObserver(sync)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-white font-sans antialiased overflow-x-hidden dark:bg-black">
      <Header />

      <main>
        {/* Hero */}
        <section className="relative px-4 pt-16 pb-8 sm:px-6 lg:px-8 lg:pt-20 lg:pb-10">
          <div className="mx-auto max-w-7xl">
            <div className="absolute top-0 right-0 left-0 h-px bg-linear-to-r from-transparent via-neutral-200 to-transparent dark:via-slate-700" />

            {/* Compacted Hero Header */}
            <div className="mb-8 flex flex-col items-center justify-center text-center">
              <div className="mb-1">
                <img src="/logo.png" alt="Bini.js Logo" className="h-20 w-20 lg:h-24 lg:w-24" />
              </div>
              
              <h1 className="text-3xl leading-[1.2] font-bold tracking-tight text-black sm:text-4xl lg:text-5xl dark:text-white">
                React Framework for{' '}
                <span className="bg-linear-to-r from-cyan-500 via-sky-500 to-blue-500 bg-clip-text text-transparent dark:from-cyan-400 dark:via-sky-400 dark:to-blue-400">
                  Cross-Platform
                </span>
              </h1>
              
              <p className="mt-1 max-w-2xl text-base leading-relaxed text-neutral-600 sm:text-lg dark:text-neutral-400">
                One codebase. Six platforms. Write React, ship everywhere.
              </p>
            </div>

            <div className="relative grid items-center gap-6 lg:grid-cols-2 lg:gap-8">
              <div className="absolute top-0 bottom-0 left-1/2 hidden w-px bg-linear-to-b from-transparent via-neutral-200 to-transparent lg:block dark:via-slate-700" />

              <div className="text-center lg:pr-6 lg:text-left">
                <p className="mx-auto mb-5 max-w-xl text-base leading-relaxed text-neutral-600 lg:mx-0 lg:max-w-none lg:text-lg dark:text-neutral-400">
                  Build fast apps that run natively everywhere, without complex tooling or endless
                  config files.
                </p>

                <div className="mb-5 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                  <Link
                    to="/docs"
                    className={`group relative rounded-lg bg-black px-5 py-2.5 font-medium text-white shadow-sm transition-all hover:bg-neutral-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 ${FOCUS_RING}`}
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
                    className={`rounded-lg border border-neutral-300 bg-white px-5 py-2.5 font-medium text-neutral-700 shadow-sm transition-all hover:border-neutral-400 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-black dark:text-neutral-300 dark:hover:border-neutral-700 dark:hover:bg-neutral-900 dark:hover:text-white ${FOCUS_RING}`}
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
            <SectionHeader
              eyebrow="Stack"
              title="Built on a foundation of fast, production-grade tooling"
              className="mb-12"
            >
              Every tool is carefully chosen and pre-configured so you can focus on building.
            </SectionHeader>

            <div className="flex min-h-130 w-full items-center justify-center lg:min-h-150">
              <InView className="w-full">
                <FoundationAnimation />
              </InView>
            </div>
          </div>
        </section>

        {/* Merged Technical Features & Architecture Section */}
        <section className="relative overflow-x-clip px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-black">
          <div className="mx-auto max-w-7xl">
            <SectionHeader eyebrow="Architecture" title="Why Bini?">
              Most starters give you a bundler and call it a day. Bini.js gives you a complete
              technical framework - wired together for static generation, data loading, and
              deployment from the first commit.
            </SectionHeader>

            {/* Visual cards */}
            <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
              {VISUAL_BENEFITS.map((item) => (
                <Link
                  key={item.title}
                  to={item.href}
                  className={`group flex flex-col rounded-xl ${FOCUS_RING}`}
                >
                  <div className="relative mb-6 flex aspect-4/3 w-full items-center justify-center overflow-hidden rounded-xl border border-neutral-200 bg-white transition-colors group-hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:group-hover:border-neutral-700">
                    {item.visual}
                  </div>

                  <h3 className="mb-3 flex items-center gap-1.5 text-base font-semibold text-black dark:text-white">
                    {item.title}
                    <ArrowRight className="h-4 w-4 -translate-x-2 text-neutral-400 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 dark:text-neutral-500" />
                  </h3>

                  <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                    {item.desc}
                  </p>
                </Link>
              ))}
            </div>

            {/* Text-only cards */}
            <div className="mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {TEXT_BENEFITS.map((item) => (
                <Link
                  key={item.title}
                  to={item.href}
                  className={`group block rounded-md ${FOCUS_RING}`}
                >
                  <h3 className="mb-3 flex items-center gap-1.5 text-base font-semibold text-black dark:text-white">
                    {item.title}
                    <ArrowRight className="h-4 w-4 -translate-x-2 text-neutral-400 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 dark:text-neutral-500" />
                  </h3>
                  <p className="max-w-sm text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                    {item.desc}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Platform showcase */}
        <section className="relative overflow-x-clip px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
          <SectionDivider />
          <div className="mx-auto max-w-7xl">
            <SectionHeader eyebrow="Targets" title="One codebase. Six platforms.">
              <code className="font-mono text-base text-cyan-700 dark:text-cyan-400">
                --platform
              </code>{' '}
              picks the target - each scaffold gets exactly the dependencies, scripts, and config it
              needs.
            </SectionHeader>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {PLATFORMS.map((platform) => {
                const col = COLOR[platform.color as keyof typeof COLOR]
                const commands = PLATFORM_COMMANDS[platform.name] || []
                const isActive = activePlatform === platform.name

                return (
                  <div
                    key={platform.name}
                    role="group"
                    aria-label={`${platform.name} commands`}
                    tabIndex={0}
                    className={`relative cursor-default p-6 ${CARD} ${FOCUS_RING}`}
                    onMouseEnter={() => setActivePlatform(platform.name)}
                    onMouseLeave={() => setActivePlatform(null)}
                    onFocus={() => setActivePlatform(platform.name)}
                    onBlur={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                        setActivePlatform(null)
                      }
                    }}
                    onClick={() => setActivePlatform(isActive ? null : platform.name)}
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
                        <PlatformIcon icon={platform.icon} className={col.text} />
                      </div>
                      <h3 className={`text-base font-semibold ${col.text}`}>{platform.name}</h3>
                    </div>

                    <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                      {platform.desc}
                    </p>

                    {isActive && (
                      <div className="mt-4 border-t border-neutral-200 pt-3 dark:border-slate-800">
                        <MiniTerminal commands={commands} />
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
            <SectionHeader
              eyebrow="Ecosystem"
              title="Eight packages. One framework."
              className="mb-6 sm:mb-8"
            >
              Every package is purpose-built and works seamlessly together - or standalone.
            </SectionHeader>

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
                Bini.js is MIT Licensed and will always be free and open source, made possible by
                our contributors and sponsors.
              </p>

              <a
                href="https://github.com/sponsors/Binidu01"
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative inline-flex items-center gap-2 rounded-lg bg-black px-5 py-2.5 font-medium text-white shadow-sm transition-all hover:bg-neutral-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 ${FOCUS_RING}`}
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
            <div className="mb-4 flex justify-center">
              <img src="/logo.png" alt="Bini.js" className="h-24 w-24" />
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
                className={`rounded-lg bg-black px-5 py-2.5 font-medium text-white transition-all hover:bg-neutral-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 ${FOCUS_RING}`}
              >
                Get Started
              </Link>
              <a
                href="https://github.com/Binidu01/bini-cli"
                target="_blank"
                rel="noopener noreferrer"
                className={`rounded-lg border border-neutral-300 bg-white px-5 py-2.5 font-medium text-neutral-700 transition-all hover:border-neutral-400 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-black dark:text-neutral-300 dark:hover:border-neutral-700 dark:hover:bg-neutral-900 dark:hover:text-white ${FOCUS_RING}`}
              >
                <span className="flex items-center gap-2">
                  <SimpleIcon icon={siGithub} size={18} />
                  GitHub
                </span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Home