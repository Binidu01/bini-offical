// src/app/plugins/page.tsx
import React from 'react'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Header, Footer } from '../../components/Layout'
import {
  siGithub,
  siNpm,
} from 'simple-icons'
import type { SimpleIcon as SimpleIconType } from 'simple-icons'

// Simple Icon component
function SimpleIcon({
  icon,
  className = "",
  size = 14
}: {
  icon: SimpleIconType
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
// Code Block Component with copy button + horizontal scrollbar
// ────────────────────────────────────────────────────────────────────────────────
function CodeBlock({ code, filename }: { code: string; filename?: string }) {
  const [copied, setCopied] = React.useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group mb-6">
      {filename && (
        <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border border-slate-800 border-b-0 rounded-t-lg">
          <span className="text-sm text-slate-300 font-mono">{filename}</span>
        </div>
      )}
      <button onClick={handleCopy} className="absolute top-2 right-2 p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 transition-colors z-10 opacity-0 group-hover:opacity-100" style={{ top: filename ? '3rem' : '0.5rem' }}>
        {copied ? (
          <svg className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )}
      </button>
      <div className={`bg-[#0a0a0a] border border-slate-700 ${filename ? 'rounded-t-none' : 'rounded-lg'} overflow-x-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent hover:scrollbar-thumb-slate-500`}>
        <pre className="p-4 min-w-max">
          <code className="text-sm font-mono text-slate-200 whitespace-pre">{code}</code>
        </pre>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────────
// Note Component
// ────────────────────────────────────────────────────────────────────────────────
function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 my-6">
      <div className="text-sm text-slate-300 [&>strong]:text-white [&>code]:text-cyan-400 [&>code]:bg-slate-800 [&>code]:px-1 [&>code]:py-0.5 [&>code]:rounded">
        {children}
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────────
// Plugin Card Component (for Bini.js official packages)
// ────────────────────────────────────────────────────────────────────────────────
function PluginCard({
  name,
  description,
  href,
  githubRepo,
  official = false,
}: {
  name: string
  description: string
  href?: string
  githubRepo?: string
  official?: boolean
}) {
  return (
    <div className="p-6 rounded-xl border border-slate-800 bg-[#0a0a0a] hover:border-slate-700 transition-all h-full flex flex-col">
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2 flex-wrap mb-2">
          {name}
          {official && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              Official
            </span>
          )}
        </h3>
        <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
      </div>
      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
        {href && (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <SimpleIcon icon={siNpm} className="text-cyan-400" size={14} />
            npm
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
        {githubRepo && (
          <a
            href={`https://github.com/Binidu01/${githubRepo}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <SimpleIcon icon={siGithub} size={14} />
            GitHub
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────────
// Community Card Component (npm only)
// ────────────────────────────────────────────────────────────────────────────────
function CommunityCard({
  name,
  description,
  npmUrl,
}: {
  name: string
  description: string
  npmUrl?: string
}) {
  return (
    <div className="p-6 rounded-xl border border-slate-800 bg-[#0a0a0a] hover:border-slate-700 transition-all h-full flex flex-col">
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-white mb-2">{name}</h3>
        <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
      </div>
      {npmUrl && (
        <div className="mt-4 pt-3 border-t border-slate-800">
          <a
            href={npmUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <SimpleIcon icon={siNpm} className="text-cyan-400" size={14} />
            npm
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────────
// Section Component
// ────────────────────────────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">
        {title}
      </h2>
      {children}
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────────
// Plugins Page
// ────────────────────────────────────────────────────────────────────────────────
export default function PluginsPage() {
  return (
    <div className="min-h-screen bg-black font-sans antialiased overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-300 h-200 bg-linear-to-b from-cyan-500/5 via-sky-500/3 to-transparent rounded-full blur-3xl" />
      </div>

      <Header />

      <div className="relative pt-24 lg:pt-28 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Plugins & Packages</h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              The complete Bini.js ecosystem — everything you need to build full-stack React apps for web, desktop, and mobile from one codebase.
            </p>
          </motion.div>

          {/* Note */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Note>
              Bini.js is built on Vite and aims to provide out-of-the-box support for common web development patterns.
              Before searching for a plugin, check out the <Link to="/docs" className="text-cyan-400 hover:underline">documentation</Link>.
              Many cases where a plugin would be needed in other projects — routing, API routes, env handling, native app wiring — are already covered by the official Bini.js packages below.
            </Note>
          </motion.div>

          {/* Core Framework */}
          <Section title="Core Framework">
            <p className="text-slate-300 mb-6">
              The two packages that scaffold and ship a Bini.js project.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
              <PluginCard
                name="create-bini-app"
                description="Build full-stack React apps for web, desktop, and mobile — from one codebase. Scaffolds a complete Vite + React + Hono project with file-based routing, API routes, Tauri native builds, and a deploy script wired in from the first commit."
                href="https://www.npmjs.com/package/create-bini-app"
                githubRepo="create-bini-app"
                official
              />
              <PluginCard
                name="bini-deploy"
                description="Zero-config deployment for Bini.js projects — web, desktop, and mobile, all from one CLI. Scans your project, generates the right hosting configuration for your target platform, and pushes it straight to GitHub."
                href="https://www.npmjs.com/package/bini-deploy"
                githubRepo="bini-deploy"
                official
              />
            </div>
          </Section>

          {/* Official Plugins */}
          <Section title="Official Plugins">
            <p className="text-slate-300 mb-6">
              These plugins are automatically included and configured in every Bini.js project.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <PluginCard
                name="bini-router"
                description="File-based routing, nested layouts, folder-scoped loading/error/404 boundaries, MDX & Markdown pages, and Hono-powered API routes for Vite. Like Next.js App Router, but pure SPA — zero server required."
                href="https://www.npmjs.com/package/bini-router"
                githubRepo="bini-router"
                official
              />
              <PluginCard
                name="bini-env"
                description="Hono-native environment variable system. getEnv(c, key) and requireEnv(c, key) read from the Hono request context, so variables resolve correctly on Node.js, Bun, Deno, Vercel Edge, Netlify Edge, and Cloudflare Workers — with zero dotenv parsing at runtime."
                href="https://www.npmjs.com/package/bini-env"
                githubRepo="bini-env"
                official
              />
              <PluginCard
                name="bini-native"
                description="Automatic Tauri plugin wiring for desktop and mobile. Detects the web APIs you call — geolocation, clipboard, notifications, dialogs, and more — and wires Rust plugins, Cargo.toml, capabilities, and Android/iOS manifests. Dev-only; tauri build stays a complete no-op."
                href="https://www.npmjs.com/package/bini-native"
                githubRepo="bini-native"
                official
              />
              <PluginCard
                name="bini-server"
                description="Zero-dependency, secure-by-default production server for bini-router apps. Streams static files with ETag caching, serves /api/* routes, provides SPA fallback, and adds configurable body/handler timeouts and graceful shutdown."
                href="https://www.npmjs.com/package/bini-server"
                githubRepo="bini-server"
                official
              />
              <PluginCard
                name="bini-overlay"
                description="A Next.js-style error overlay and animated loading badge. Shows your Bini.js logo during development — animates on load and HMR updates, morphs into a clickable error pill on failure, and opens a full panel with stack trace and code frame."
                href="https://www.npmjs.com/package/bini-overlay"
                githubRepo="bini-overlay"
                official
              />
              <PluginCard
                name="bini-ssg"
                description="Pre-renders every route — static and dynamic — to static HTML as part of npm run build. Real server-rendered markup with StaticRouter and React 19's renderToPipeableStream, plus shell pages with hydration markers for dynamic routes. No separate export command needed."
                href="https://www.npmjs.com/package/bini-ssg"
                githubRepo="bini-ssg"
                official
              />
            </div>
          </Section>

          {/* Built-in Vite Plugins */}
          <Section title="Built-in Vite Plugins">
            <p className="text-slate-300 mb-4">
              Plugins are added in <code className="text-cyan-400 bg-slate-800 px-1 py-0.5 rounded">vite.config.ts</code> under the <code className="text-cyan-400 bg-slate-800 px-1 py-0.5 rounded">plugins</code> array:
            </p>
            <CodeBlock
              filename="vite.config.ts"
              code={`import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { biniroute } from 'bini-router'
import { biniEnv } from 'bini-env'
import { biniSSG } from 'bini-ssg'

export default defineConfig({
  plugins: [
    react(),      // React Fast Refresh
    biniEnv(),    // Environment variable prefixes + dev banner
    ...biniroute(), // File-based routing, MDX compiler & API routes
    biniSSG(),    // Pre-rendering every route to static HTML
    // Add more plugins here
  ],
})`}
            />
            <Note>
              <code>biniroute()</code> returns an <strong className="text-white">array</strong> of plugins — the router plugin plus the bundled MDX compiler — so it must be spread with <code>...biniroute()</code>, not added as a single item.
            </Note>
            <p className="text-slate-300 mb-6">
              These Vite plugins are automatically included based on your project configuration:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <CommunityCard
                name="@vitejs/plugin-react"
                description="Provides React Fast Refresh support. Automatically configured in every Bini.js project."
                npmUrl="https://www.npmjs.com/package/@vitejs/plugin-react"
              />
              <CommunityCard
                name="@tailwindcss/vite"
                description="Tailwind CSS v4 Vite plugin. Zero-config — just works. Included when you select Tailwind during project creation."
                npmUrl="https://www.npmjs.com/package/@tailwindcss/vite"
              />
            </div>
          </Section>

          {/* Compatible Community Plugins */}
          <Section title="Compatible Community Plugins">
            <p className="text-slate-300 mb-6">
              Bini.js is compatible with most Vite and Rollup plugins. Here are some popular ones:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <CommunityCard
                name="vite-plugin-pwa"
                description="Zero-config PWA plugin. Adds service worker and manifest support for offline capabilities."
                npmUrl="https://www.npmjs.com/package/vite-plugin-pwa"
              />
              <CommunityCard
                name="vite-plugin-svgr"
                description="Transform SVGs into React components. Import SVGs directly as components."
                npmUrl="https://www.npmjs.com/package/vite-plugin-svgr"
              />
              <CommunityCard
                name="vite-plugin-compression"
                description="Compress your bundle with Gzip or Brotli. Reduces bundle size for faster loading."
                npmUrl="https://www.npmjs.com/package/vite-plugin-compression"
              />
              <CommunityCard
                name="rollup-plugin-visualizer"
                description="Visualize and analyze your bundle. See which packages take up the most space."
                npmUrl="https://www.npmjs.com/package/rollup-plugin-visualizer"
              />
            </div>
            <Note>
              <strong>Most Vite plugins work with Bini.js.</strong> Check the{' '}
              <a href="https://github.com/vitejs/awesome-vite#plugins" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline inline-flex items-center gap-1">
                Awesome Vite <ExternalLink className="w-3 h-3" />
              </a>{' '}
              list for more community plugins.
            </Note>
          </Section>

          {/* Hono Middleware & Plugins */}
          <Section title="Hono Middleware & Plugins">
            <p className="text-slate-300 mb-6">
              Bini.js uses Hono for API routes. You can use any Hono middleware in your <code className="text-cyan-400 bg-slate-800 px-1 py-0.5 rounded">src/app/api/</code> files.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <CommunityCard
                name="hono/cors"
                description="Cross-Origin Resource Sharing middleware for Hono. bini-router and bini-server already enable permissive CORS by default — use this when you need finer-grained control."
                npmUrl="https://www.npmjs.com/package/hono"
              />
              <CommunityCard
                name="hono/jwt"
                description="JWT authentication middleware. Protect your API routes with JSON Web Tokens."
                npmUrl="https://www.npmjs.com/package/hono"
              />
              <CommunityCard
                name="hono/logger"
                description="Simple logging middleware. Log incoming requests with method, path, and response time."
                npmUrl="https://www.npmjs.com/package/hono"
              />
              <CommunityCard
                name="@hono/zod-validator"
                description="Zod validation middleware for Hono. Validate request body, query, and headers with Zod schemas."
                npmUrl="https://www.npmjs.com/package/@hono/zod-validator"
              />
            </div>
            <Note>
              <strong>All Hono middleware works in Bini.js API routes.</strong> Import them directly from <code>hono</code> or install additional packages like{' '}
              <code>@hono/zod-validator</code>. See the{' '}
              <a href="https://hono.dev/docs/middleware/builtin/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline inline-flex items-center gap-1">
                Hono middleware documentation <ExternalLink className="w-3 h-3" />
              </a>{' '}
              for the complete list.
            </Note>
            <p className="text-slate-300 mt-4 mb-4">
              Example of using Hono middleware together with <code className="text-cyan-400 bg-slate-800 px-1 py-0.5 rounded">bini-env</code> in an API route:
            </p>
            <CodeBlock
              filename="src/app/api/secure.ts"
              code={`import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { getEnv, requireEnv } from 'bini-env'

const app = new Hono()

app.use('*', cors())
app.use('*', logger())

app.get('/', async (c) => {
  const ctx = c as any

  // requireEnv throws if the var is missing — fail fast on required config
  const apiKey = requireEnv(ctx, 'API_SECRET')

  // getEnv returns undefined if missing — use ?? for a default
  const appName = getEnv(ctx, 'APP_NAME') ?? 'Bini.js'

  return c.json({ message: \`API with middleware, \${appName}\` })
})

export default app`}
            />
          </Section>

        </div>
      </div>

      <Footer />
    </div>
  )
}