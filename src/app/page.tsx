import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  Copy,
  Check,
  ExternalLink,
  Layers,
  Boxes,
  Server,
  Route as RouteIcon,
  Import as ImportIcon,
  Smartphone,
  Gauge,
  ShieldCheck,
  Globe,
  Heart,
} from 'lucide-react'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { siGithub, siApple, siLinux, siAndroid } from 'simple-icons'

import { BiniAnimation } from '../components/BiniAnimation'
import { FoundationAnimation } from '../components/FoundationAnimation'
import PluginAnimation from '../components/PluginAnimation';
import { Header, Footer } from '../components/Layout'

// ─── Windows Icon ─────────────────────────────────────────────────────────────
const WindowsIcon = ({ className = '', size = 20 }: { className?: string; size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    shapeRendering="geometricPrecision" 
    textRendering="geometricPrecision" 
    imageRendering="optimizeQuality" 
    fillRule="evenodd" 
    clipRule="evenodd" 
    viewBox="0 0 512 512.02"
    width={size}
    height={size}
    className={className}
  >
    <path fill="currentColor" fillRule="nonzero" d="M0 512.02h242.686V269.335H0V512.02zm0-269.334h242.686V0H0v242.686zm269.314 0H512V0H269.314v242.686zm0 269.334H512V269.335H269.314V512.02z"/>
  </svg>
)

// ─── Simple Icon ────────────────────────────────────────────────────────────
function SimpleIcon({
  icon,
  className = '',
  size = 20,
}: {
  icon: any
  className?: string
  size?: number
}) {
  if (!icon || !icon.svg) return null
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

// ─── Eyebrow ────────────────────────────────────────────────────────────────
const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-block text-[11px] font-bold tracking-[0.2em] uppercase text-cyan-400/80 mb-4 font-mono">
    {children}
  </span>
)

// ─── Section Divider (matches hero's gradient-fade divider style) ──────────
const SectionDivider = () => (
  <div
    aria-hidden
    className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-slate-700 to-transparent pointer-events-none"
  />
)

// ─── Color Tokens ──────────────────────────────────────────────────────────
const COLOR = {
  cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400', pill: 'bg-cyan-500', hex: '#22d3ee' },
  purple: { bg: 'bg-violet-500/10', border: 'border-violet-500/30', text: 'text-violet-400', pill: 'bg-violet-500', hex: '#a78bfa' },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', pill: 'bg-emerald-500', hex: '#34d399' },
  amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', pill: 'bg-amber-500', hex: '#fbbf24' },
  rose: { bg: 'bg-rose-500/10', border: 'border-rose-500/30', text: 'text-rose-400', pill: 'bg-rose-500', hex: '#fb7185' },
  blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', pill: 'bg-blue-500', hex: '#60a5fa' },
  yellow: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400', pill: 'bg-yellow-500', hex: '#facc15' },
}

// ─── Data: Why Bini? ────────────────────────────────────────────
const WHY_BINI = [
  {
    icon: Layers,
    problem: 'Bundler configs, router boilerplate, and manual code splitting eat into every new project.',
    solution: 'Drop a file in src/app/, get a route — instantly code-split, no router config, no boilerplate.',
    color: 'cyan',
  },
  {
    icon: Boxes,
    problem: 'Shipping to web, desktop, and mobile usually means three codebases and three toolchains.',
    solution: 'One codebase compiles to a real web app, desktop binary, or mobile app — nothing emulated or wrapped.',
    color: 'yellow',
  },
  {
    icon: Server,
    problem: 'Backend and frontend live in separate repos, separate deploys, separate mental models.',
    solution: 'API routes are colocated in src/app/api/, powered by Hono, and deploy alongside your frontend.',
    color: 'amber',
  },
  {
    icon: Globe,
    problem: 'Each hosting platform has its own APIs, configs, and entry points.',
    solution: 'bini-deploy generates the right configs and entry files for any platform — one command handles Netlify, Vercel, Cloudflare, Deno, Node, and native apps.',
    color: 'purple',
  },
]

// ─── Data: Differentiators ──────────────────────────────────────
const DIFFERENTIATORS = [
  {
    icon: RouteIcon,
    title: 'File-based routing',
    desc: 'Nested layouts, dynamic segments, and per-route metadata — no router config to maintain.',
  },
  {
    icon: ImportIcon,
    title: 'Auto-imports',
    desc: 'useState, useParams, getEnv, and more are available with zero import statements.',
  },
  {
    icon: Server,
    title: 'One handler, every runtime',
    desc: 'The same Hono API handler runs in dev middleware, bini-server, or as an edge function — generated per target.',
  },
  {
    icon: Smartphone,
    title: 'Real native builds',
    desc: 'Desktop and mobile builds are real Tauri apps — not Electron wrappers, not emulators.',
  },
  {
    icon: Gauge,
    title: 'Rust-powered tooling',
    desc: 'Vite + Rolldown for bundling, Oxlint + Oxfmt for lint and format — all pre-configured out of the box.',
  },
  {
    icon: ShieldCheck,
    title: 'Native APIs, wired automatically',
    desc: 'bini-native detects the web APIs you call and wires Tauri plugins, permissions, and manifests for you.',
  },
]

// ─── Data: Platform showcase ────────────────────────────────────
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
    desc: 'Real native APK/AAB via Tauri\'s Android backend — not a WebView wrapper.',
  },
  {
    name: 'iOS',
    badge: null,
    icon: 'apple',
    color: 'blue',
    desc: 'Real native app via Tauri\'s iOS backend, running inside WKWebView.',
  },
]

const Home = () => {
  const [activeTab, setActiveTab] = useState('npm')
  const [copied, setCopied] = useState(false)
  const [hoveredPlatform, setHoveredPlatform] = useState<string | null>(null)

  const tabs = [
    { id: 'npm', label: 'npm', command: 'npx create-bini-app@latest' },
    { id: 'pnpm', label: 'pnpm', command: 'pnpm create bini-app@latest' },
    { id: 'yarn', label: 'yarn', command: 'yarn create bini-app@latest' },
    { id: 'bun', label: 'bun', command: 'bun create bini-app@latest' },
  ]

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const renderPlatformIcon = (icon: string, colorKey: string) => {
    const col = COLOR[colorKey as keyof typeof COLOR]
    const iconMap: Record<string, React.ReactNode> = {
      windows: <WindowsIcon size={20} className={col?.text || ''} />,
      globe: <Globe size={20} className={col?.text || ''} />,
      apple: <SimpleIcon icon={siApple} size={20} className={col?.text || ''} />,
      linux: <SimpleIcon icon={siLinux} size={20} className={col?.text || ''} />,
      android: <SimpleIcon icon={siAndroid} size={20} className={col?.text || ''} />,
    }
    return iconMap[icon] || null
  }

  const platformCommands: Record<string, string[]> = {
    'Web': ['npm run dev', 'npm run build', 'npm start'],
    'Windows': ['npm run tauri:dev', 'npm run tauri:build'],
    'macOS': ['npm run tauri:dev', 'npm run tauri:build'],
    'Linux': ['npm run tauri:dev', 'npm run tauri:build'],
    'Android': ['npm run android', 'npm run android:build'],
    'iOS': ['npm run ios', 'npm run ios:build'],
  }

  return (
    <div className="min-h-screen bg-black font-sans antialiased overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-black" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(103,232,249,0.8) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-300 h-200 bg-linear-to-b from-cyan-500/5 via-sky-500/3 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-cyan-200/20 to-transparent" />
      </div>

      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative pt-16 lg:pt-20 pb-8 lg:pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-slate-700 to-transparent" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex justify-center mb-4"
          >
            <img
              src="/logo.svg"
              alt="Bini.js Logo"
              className="w-12 h-12 lg:w-14 lg:h-14"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
            className="text-center mb-4"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.2]">
              React Framework for
              <br />
              <span className="bg-linear-to-r from-cyan-400 via-sky-400 to-blue-400 bg-clip-text text-transparent">
                Cross-Platform
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mt-4 leading-relaxed">
              One codebase. Six platforms. Zero boilerplate. Write React, ship everywhere.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-center relative">
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-linear-to-b from-transparent via-slate-700 to-transparent" />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
              className="text-center lg:text-left lg:pr-6"
            >
              <p className="text-base lg:text-lg text-slate-400 max-w-xl lg:max-w-none mx-auto lg:mx-0 mb-5 leading-relaxed">
                Build modern, high-performance apps that run natively everywhere without complex tooling, steep learning curves, or endless config files. Focus on your ideas and users, while the framework handles the heavy lifting.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-5">
                <Link
                  to="/docs"
                  className="group relative px-5 py-2.5 rounded-lg bg-white text-slate-900 font-medium hover:bg-slate-100 transition-all shadow-sm"
                >
                  <span className="flex items-center gap-2">
                    Get Started
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
                
                <a
                  href="https://github.com/Binidu01/bini-cli"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-lg bg-black border border-slate-700 text-slate-300 font-medium hover:border-slate-600 hover:bg-slate-900 transition-all shadow-sm"
                >
                  <span className="flex items-center gap-2">
                    <SimpleIcon icon={siGithub} size={18} />
                    GitHub
                    <ExternalLink className="w-3.5 h-3.5 opacity-50" />
                  </span>
                </a>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="max-w-lg mx-auto lg:mx-0"
              >
                <div className="rounded-lg overflow-hidden border border-slate-700 bg-[#0a0a0a] shadow-2xl">
                  <div className="flex items-center justify-between gap-2 px-3 py-2 bg-[#1a1a1a] border-b border-slate-800">
                    <div className="flex items-center gap-1.5 shrink-0">
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500/80" />
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500/80" />
                    </div>

                    <div className="flex items-center gap-0.5 overflow-x-auto">
                      {tabs.map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                            activeTab === tab.id
                              ? 'bg-slate-700 text-white'
                              : 'text-slate-400 hover:text-white hover:bg-slate-800'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => handleCopy(tabs.find((t) => t.id === activeTab)?.command || '')}
                      className="p-1 rounded hover:bg-slate-800 transition-colors shrink-0"
                      aria-label="Copy command"
                    >
                      {copied ? (
                        <Check className="w-3.5 h-3.5 text-green-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                      )}
                    </button>
                  </div>

                  <div className="p-4 overflow-x-auto">
                    <div className="flex items-center gap-2 w-max">
                      <span className="text-cyan-400 text-sm">$</span>
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={activeTab}
                          initial={{ opacity: 0, x: 4 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -4 }}
                          transition={{ duration: 0.15 }}
                          className="text-slate-200 font-mono text-xs sm:text-sm whitespace-nowrap"
                        >
                          {tabs.find((t) => t.id === activeTab)?.command}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
              className="relative w-full lg:pl-6"
            >
              <div className="w-full flex items-center justify-center">
                <div className="w-full max-w-full mx-auto">
                  <BiniAnimation />
                </div>
              </div>
            </motion.div>
          </div>

          <div className="mt-8 lg:mt-10" />
        </div>
      </section>

      {/* Foundation Section */}
      <section
        id="foundation"
        className="relative py-20 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 overflow-x-clip"
      >
        <SectionDivider />
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <Eyebrow>Stack</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Built on a foundation of fast, production-grade tooling
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Every tool is carefully chosen and pre-configured so you can focus on building.
            </p>
          </motion.div>

          <div className="min-h-130 lg:min-h-150 w-full flex items-center justify-center">
            <FoundationAnimation />
          </div>
        </div>
      </section>

      {/* Why Bini? Section */}
      <section className="relative py-20 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 bg-black overflow-x-clip">
        <SectionDivider />
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <Eyebrow>Motivation</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why Bini?</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Most starters give you a bundler and call it a day. Bini.js gives you a framework —
              wired together and configured correctly from the first commit.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {WHY_BINI.map((item, i) => {
              const Icon = item.icon
              const col = COLOR[item.color as keyof typeof COLOR]
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="relative rounded-2xl border border-slate-800 bg-[#0a0a0a] p-6 lg:p-8 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${col.bg}`}>
                      <Icon className={`w-5 h-5 ${col.text}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="mb-3">
                        <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500">Problem</span>
                        <p className="text-sm text-slate-400 leading-relaxed mt-1.5">{item.problem}</p>
                      </div>
                      <div className="h-px bg-slate-800 my-3" />
                      <div>
                        <span className="text-[10px] font-bold tracking-widest uppercase text-cyan-400">Solution</span>
                        <p className="text-sm text-slate-200 leading-relaxed mt-1.5">{item.solution}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* What makes it different? Section */}
      <section className="relative py-20 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 bg-black overflow-x-clip">
        <SectionDivider />
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <Eyebrow>Architecture</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What makes it different?
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Complexity stays invisible. You write normal React and normal web APIs — the
              framework handles the rest.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {DIFFERENTIATORS.map((item, i) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="rounded-2xl border border-slate-800 bg-[#0a0a0a] p-6 hover:border-slate-700 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-4 group-hover:border-cyan-500/50 transition-colors">
                    <Icon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Platform Showcase Section */}
      <section className="relative py-20 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 bg-black overflow-x-clip">
        <SectionDivider />
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <Eyebrow>Targets</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              One codebase. Six platforms.
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              <code className="text-cyan-400 font-mono text-base">--platform</code> picks the
              target — each scaffold gets exactly the dependencies, scripts, and config it needs.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PLATFORMS.map((platform, i) => {
              const col = COLOR[platform.color as keyof typeof COLOR]
              const commands = platformCommands[platform.name] || []
              const isHovered = hoveredPlatform === platform.name
              
              return (
                <motion.div
                  key={platform.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  className="relative rounded-2xl border border-slate-800 bg-[#0a0a0a] p-6 hover:border-slate-700 transition-all cursor-default"
                  onMouseEnter={() => setHoveredPlatform(platform.name)}
                  onMouseLeave={() => setHoveredPlatform(null)}
                >
                  {platform.badge && (
                    <span className="absolute top-4 right-4 text-[9px] font-bold tracking-widest uppercase px-2 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                      {platform.badge}
                    </span>
                  )}

                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${col.bg}`}>
                      {renderPlatformIcon(platform.icon, platform.color)}
                    </div>
                    <h3 className={`text-base font-semibold ${col.text}`}>{platform.name}</h3>
                  </div>

                  <p className="text-sm text-slate-400 leading-relaxed mb-4">{platform.desc}</p>

                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-col gap-1.5 pt-3 border-t border-slate-800">
                          {commands.map((cmd) => (
                            <div
                              key={cmd}
                              className="text-xs font-mono text-slate-500 bg-slate-900/50 border border-slate-800/60 rounded-md px-3 py-1.5 truncate"
                            >
                              $ {cmd}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Ecosystem Section - Reduced padding */}
      <section className="relative py-8 sm:py-10 lg:py-12 px-4 sm:px-6 lg:px-8 bg-black overflow-x-clip">
        <SectionDivider />
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-6 sm:mb-8"
          >
            <Eyebrow>Ecosystem</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Seven packages. One framework.
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Every package is purpose-built and works seamlessly together — or standalone.
            </p>
          </motion.div>

          <PluginAnimation />
        </div>
      </section>

      {/* Framework Facts Section */}
      <section className="relative py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-black overflow-x-clip">
        <SectionDivider />
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <Eyebrow>License</Eyebrow>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Free & open source
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
              Bini.js is MIT Licensed and will always be free and open source. This is made possible by our contributors and these companies:
            </p>

            <a
              href="https://github.com/sponsors/Binidu01"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-slate-900 font-medium hover:bg-slate-100 transition-all shadow-sm"
            >
              <Heart className="w-4 h-4" />
              Become a sponsor
            </a>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-20 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-x-clip">
        <SectionDivider />
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-center mb-6">
              <img src="/logo.svg" alt="Bini.js" className="w-16 h-16" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to build with Bini.js?
            </h2>
            <p className="text-lg text-slate-400 max-w-xl mx-auto mb-8">
              Get started in seconds. Build for web, desktop, and mobile — all from one codebase.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <div className="w-full sm:w-auto">
                <div className="flex items-center gap-2 rounded-lg border border-slate-700 bg-[#0a0a0a] px-4 py-2.5">
                  <span className="text-cyan-400 text-sm font-mono">$</span>
                  <span className="text-slate-200 font-mono text-sm whitespace-nowrap">
                    npx create-bini-app@latest
                  </span>
                  <button
                    onClick={() => handleCopy('npx create-bini-app@latest')}
                    className="p-1 rounded hover:bg-slate-800 transition-colors"
                    aria-label="Copy command"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-slate-500" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              <Link
                to="/docs"
                className="px-5 py-2.5 rounded-lg bg-white text-slate-900 font-medium hover:bg-slate-100 transition-all"
              >
                Get Started
              </Link>
              <a
                href="https://github.com/Binidu01/bini-cli"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-lg border border-slate-700 text-slate-300 font-medium hover:border-slate-600 hover:bg-slate-900 transition-all"
              >
                <span className="flex items-center gap-2">
                  <SimpleIcon icon={siGithub} size={18} />
                  GitHub
                </span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Home