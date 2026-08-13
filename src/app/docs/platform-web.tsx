// src/pages/docs/platform-web/page.tsx
import React from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Globe,
  Server,
  Cloud,
  Terminal,
  Zap,
  Shield,
  Gauge,
  CheckCircle,
  Info,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Header } from '../../components/Layout'
import { DocLayout } from '../../components/DocSidebar'
import { CopyPageButton } from '../../components/CopyPageButton'
import { TableOfContents, type TocItem } from '../../components/TableOfContents'

// ────────────────────────────────────────────────────────────────────────────────
// "On this page" entries
// ────────────────────────────────────────────────────────────────────────────────
const TOC_ITEMS: TocItem[] = [
  { id: 'web-overview', label: 'Web Overview' },
  { id: 'windows', label: 'Windows' },
  { id: 'macos', label: 'macOS' },
  { id: 'linux', label: 'Linux' },
  { id: 'development-server', label: 'Development Server' },
  { id: 'production-server', label: 'Production Server' },
  { id: 'prerendering', label: 'Pre-rendering' },
  { id: 'deployment', label: 'Deployment' },
]

const PAGE_TITLE = 'Web'
const PAGE_URL = 'https://bini.js.org/docs/platform-web'
const EDIT_URL = 'http://github.com/Binidu01/bini-offical/edit/main/src/app/docs/platform-web.tsx'

// ────────────────────────────────────────────────────────────────────────────────
// Code Block Component with horizontal scrollbar
// ────────────────────────────────────────────────────────────────────────────────
function CodeBlock({ code, filename }: { code: string; filename?: string }) {
  const [copied, setCopied] = React.useState(false)
  const handleCopy = () => { 
    const cleanCode = code.replace(/\$ /g, '')
    navigator.clipboard.writeText(cleanCode)
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
// Table Component
// ────────────────────────────────────────────────────────────────────────────────
function Table({ headers, rows }: { headers: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-700 my-6">
      <table className="w-full text-sm">
        <thead className="bg-slate-900 border-b border-slate-800">
          <tr>{headers.map((h, i) => <th key={i} className="text-left py-3 px-4 font-medium text-white">{h}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j} className="py-3 px-4 text-slate-300 text-xs">{cell}</td>)}</tr>)}
        </tbody>
      </table>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────────
// Note Component
// ────────────────────────────────────────────────────────────────────────────────
function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-lg border border-slate-700 bg-slate-900/50 my-6">
      <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
      <div className="text-sm text-slate-300 [&>strong]:text-white [&>code]:text-cyan-400 [&>code]:bg-slate-800 [&>code]:px-1 [&>code]:py-0.5 [&>code]:rounded">{children}</div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────────
// Platform Web Page
// ────────────────────────────────────────────────────────────────────────────────
export default function PlatformWebPage() {
  return (
    <div className="min-h-screen bg-black font-sans antialiased overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-300 h-200 bg-linear-to-b from-cyan-500/5 via-sky-500/3 to-transparent rounded-full blur-3xl" />
      </div>

      <Header />

      <div className="relative pt-16 lg:pt-20">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 overflow-x-hidden">
          
          <DocLayout>
            <div className="flex gap-10 xl:gap-14">
              {/* Main content column */}
              <div className="max-w-4xl min-w-0 flex-1">

                {/* Title + Copy page button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start justify-between gap-4 mb-4"
                >
                  <div>
                    <h1 className="text-4xl font-bold text-white mb-2">{PAGE_TITLE}</h1>
                    <p className="text-slate-400 text-sm">Build web applications with Bini.js — the default platform target.</p>
                  </div>
                  <div className="shrink-0 pt-2 hidden sm:block">
                    <CopyPageButton pageUrl={PAGE_URL} pageTitle={PAGE_TITLE} />
                  </div>
                </motion.div>
                {/* Copy button on small screens */}
                <div className="sm:hidden mb-8">
                  <CopyPageButton pageUrl={PAGE_URL} pageTitle={PAGE_TITLE} />
                </div>

                {/* Web Overview */}
                <motion.section id="web-overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Web Overview</h2>
                  <p className="text-slate-300 mb-4">
                    Web is the default platform target in Bini.js. It's a standard Vite + React SPA with file-based routing, pre-rendering support, and a Hono API layer. Your application runs in the browser and can be deployed to any hosting platform.
                  </p>
                  <div className="grid sm:grid-cols-3 gap-3 mb-6">
                    <div className="p-4 rounded-xl border border-slate-700 bg-[#0a0a0a]">
                      <Globe className="w-5 h-5 text-cyan-400 mb-2" />
                      <h3 className="text-white font-medium text-sm">SPA</h3>
                      <p className="text-slate-400 text-xs">Single-page application with client-side routing</p>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-700 bg-[#0a0a0a]">
                      <Server className="w-5 h-5 text-cyan-400 mb-2" />
                      <h3 className="text-white font-medium text-sm">API Layer</h3>
                      <p className="text-slate-400 text-xs">Hono-powered API routes in <code className="text-cyan-400">src/app/api/</code></p>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-700 bg-[#0a0a0a]">
                      <Zap className="w-5 h-5 text-cyan-400 mb-2" />
                      <h3 className="text-white font-medium text-sm">Pre-rendering</h3>
                      <p className="text-slate-400 text-xs">Static HTML with <code className="text-cyan-400">bini-ssg</code></p>
                    </div>
                  </div>
                </motion.section>

                {/* Windows */}
                <motion.section id="windows" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Windows</h2>
                  <p className="text-slate-300 mb-4">
                    Create a web application on Windows using the CLI. Web is the default platform, so you don't need to specify it.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Interactive Mode</h3>
                  <p className="text-slate-300 mb-4">
                    Run the CLI and select <code className="text-cyan-400">web</code> when prompted:
                  </p>
                  <CodeBlock 
                    code={`npx create-bini-app@latest`}
                  />
                  <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 mb-4">
                    <p className="text-slate-300 text-sm">
                      <span className="text-white">Prompt:</span> Which platform would you like to target?
                    </p>
                    <p className="text-cyan-400 text-sm mt-1">web / windows / macos / linux / android / ios</p>
                    <p className="text-emerald-400 text-sm mt-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Select <span className="font-medium">web</span> and press Enter
                    </p>
                  </div>

                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">With --platform Flag</h3>
                  <CodeBlock 
                    code={`npx create-bini-app@latest my-app --platform web`}
                  />

                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Default (No Flag)</h3>
                  <CodeBlock 
                    code={`npx create-bini-app@latest my-app`}
                  />
                  <Note>
                    Web is the default platform on Windows. All commands work the same way as on other operating systems.
                  </Note>
                </motion.section>

                {/* macOS */}
                <motion.section id="macos" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">macOS</h2>
                  <p className="text-slate-300 mb-4">
                    Create a web application on macOS using the CLI. Web is the default platform, so you don't need to specify it.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Interactive Mode</h3>
                  <p className="text-slate-300 mb-4">
                    Run the CLI and select <code className="text-cyan-400">web</code> when prompted:
                  </p>
                  <CodeBlock 
                    code={`npx create-bini-app@latest`}
                  />
                  <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 mb-4">
                    <p className="text-slate-300 text-sm">
                      <span className="text-white">Prompt:</span> Which platform would you like to target?
                    </p>
                    <p className="text-cyan-400 text-sm mt-1">web / windows / macos / linux / android / ios</p>
                    <p className="text-emerald-400 text-sm mt-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Select <span className="font-medium">web</span> and press Enter
                    </p>
                  </div>

                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">With --platform Flag</h3>
                  <CodeBlock 
                    code={`npx create-bini-app@latest my-app --platform web`}
                  />

                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Default (No Flag)</h3>
                  <CodeBlock 
                    code={`npx create-bini-app@latest my-app`}
                  />
                  <Note>
                    Web is the default platform on macOS. All commands work the same way as on other operating systems.
                  </Note>
                </motion.section>

                {/* Linux */}
                <motion.section id="linux" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Linux</h2>
                  <p className="text-slate-300 mb-4">
                    Create a web application on Linux using the CLI. Web is the default platform, so you don't need to specify it.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Interactive Mode</h3>
                  <p className="text-slate-300 mb-4">
                    Run the CLI and select <code className="text-cyan-400">web</code> when prompted:
                  </p>
                  <CodeBlock 
                    code={`npx create-bini-app@latest`}
                  />
                  <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 mb-4">
                    <p className="text-slate-300 text-sm">
                      <span className="text-white">Prompt:</span> Which platform would you like to target?
                    </p>
                    <p className="text-cyan-400 text-sm mt-1">web / windows / macos / linux / android / ios</p>
                    <p className="text-emerald-400 text-sm mt-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Select <span className="font-medium">web</span> and press Enter
                    </p>
                  </div>

                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">With --platform Flag</h3>
                  <CodeBlock 
                    code={`npx create-bini-app@latest my-app --platform web`}
                  />

                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Default (No Flag)</h3>
                  <CodeBlock 
                    code={`npx create-bini-app@latest my-app`}
                  />
                  <Note>
                    Web is the default platform on Linux. All commands work the same way as on other operating systems.
                  </Note>
                </motion.section>

                {/* Development Server */}
                <motion.section id="development-server" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Development Server</h2>
                  <p className="text-slate-300 mb-4">
                    Start the development server with HMR (Hot Module Replacement):
                  </p>
                  <CodeBlock 
                    code={`npm run dev`}
                  />
                  <p className="text-slate-300 mt-4">
                    The dev server provides:
                  </p>
                  <ul className="space-y-2 text-slate-300 mb-4 list-disc list-inside">
                    <li>Fast refresh with HMR</li>
                    <li>File-based routing with live updates</li>
                    <li>API routes served at <code className="text-cyan-400">/api/*</code></li>
                    <li>Environment variables from <code className="text-cyan-400">.env</code> files</li>
                    <li>Error overlay with <code className="text-cyan-400">bini-overlay</code></li>
                  </ul>
                </motion.section>

                {/* Production Server */}
                <motion.section id="production-server" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Production Server</h2>
                  <p className="text-slate-300 mb-4">
                    Build and serve your application in production mode:
                  </p>
                  <CodeBlock 
                    code={`npm run build
npm start`}
                  />
                  <p className="text-slate-300 mt-4">
                    <code className="text-cyan-400">bini-server</code> is a zero-dependency production server that includes:
                  </p>
                  <ul className="space-y-2 text-slate-300 mb-4 list-disc list-inside">
                    <li>Static file serving with ETag/304 caching</li>
                    <li>API routes from <code className="text-cyan-400">src/app/api/</code></li>
                    <li>SPA fallback for client-side routing</li>
                    <li>Graceful shutdown</li>
                    <li>Configurable timeouts and body limits</li>
                  </ul>
                </motion.section>

                {/* Pre-rendering */}
                <motion.section id="prerendering" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Pre-rendering</h2>
                  <p className="text-slate-300 mb-4">
                    Every route is pre-rendered to static HTML during <code className="text-cyan-400">npm run build</code>. There is no separate export command or export mode — <code className="text-cyan-400">bini-ssg</code> drives pre-rendering as part of the same build.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">How It Works</h3>
                  <p className="text-slate-300 mb-4">
                    <code className="text-cyan-400">npm run build</code> type-checks (TypeScript projects) and then runs <code className="text-cyan-400">vite build</code>. The <code className="text-cyan-400">bini-ssg</code> plugin drives pre-rendering as part of that same build:
                  </p>
                  <ul className="space-y-2 text-slate-300 mb-4 list-disc list-inside">
                    <li><strong className="text-white">Static routes</strong> (e.g., <code className="text-cyan-400">/</code>, <code className="text-cyan-400">/about</code>) are rendered to real server-rendered HTML</li>
                    <li><strong className="text-white">Dynamic routes</strong> (e.g., <code className="text-cyan-400">/blog/:slug</code>) get a shell page with hydration</li>
                    <li><strong className="text-white">React 19</strong> <code className="text-cyan-400">renderToPipeableStream</code> is used for server rendering</li>
                    <li><strong className="text-white">StaticRouter</strong> from React Router provides the routing context</li>
                  </ul>
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Your render() Function</h3>
                  <p className="text-slate-300 mb-4">
                    The <code className="text-cyan-400">render()</code> function is exported from <code className="text-cyan-400">src/main.tsx</code>:
                  </p>
                  <CodeBlock 
                    code={`// src/main.tsx
import { createRoot } from 'react-dom/client'
import App from './App'

// Client mount
createRoot(document.getElementById('root')!).render(<App />)

// SSG render (called by bini-ssg, Node-only)
export async function render(url: string): Promise<string> {
  const { renderToString } = await import('react-dom/server')
  const { StaticRouter } = await import('react-router-dom/server')
  const { AppRoutes } = await import('./App')

  return renderToString(
    <StaticRouter location={url}>
      <AppRoutes />
    </StaticRouter>
  )
}`}
                    filename="src/main.tsx"
                  />

                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Build Command</h3>
                  <CodeBlock 
                    code={`npm run build`}
                  />
                  
                  <p className="text-slate-300 mt-4">
                    The output is real server-rendered markup, not a client-only shell. The client then hydrates it with <code className="text-cyan-400">hydrateRoot</code> on load.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Output Structure</h3>
                  <div className="bg-[#0a0a0a] border border-slate-700 rounded-lg p-4 mb-6 font-mono text-sm">
                    <div className="text-slate-200 whitespace-pre">{`dist/
├── index.html                   ← Pre-rendered '/'
├── about/
│   └── index.html               ← Pre-rendered '/about'
├── blog/
│   └── [slug]/
│       └── index.html           ← Shell page for '/blog/:slug'
├── docs/
│   └── [...slug]/
│       └── index.html           ← Shell page for '/docs/*'
├── js/                          ← Your compiled JavaScript files
│   └── index-[hash].js
└── css/                         ← Your compiled CSS files
    └── index-[hash].css`}</div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Hydration and Shell Pages</h3>
                  <p className="text-slate-300 mb-4">
                    For dynamic routes, <code className="text-cyan-400">bini-ssg</code> injects a marker script:
                  </p>
                  <CodeBlock 
                    code={`<script>window.__BINI_SHELL__=true;</script>`}
                  />
                  <p className="text-slate-300 mt-4">
                    Your client entry checks this flag:
                  </p>
                  <CodeBlock 
                    code={`// src/main.tsx
const root = document.getElementById('root')!

if (window.__BINI_SHELL__) {
  createRoot(root).render(<App />)
} else {
  hydrateRoot(root, <App />)
}`}
                  />
                </motion.section>

                {/* Deployment */}
                <motion.section id="deployment" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Deployment</h2>
                  <p className="text-slate-300 mb-4">
                    <code className="text-cyan-400">bini-deploy</code> is bundled into every scaffold and exposed as <code className="text-cyan-400">npm run deploy</code>.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Deploy Command</h3>
                  <CodeBlock 
                    code={`npm run deploy`}
                  />
                  
                  <p className="text-slate-300 mt-4">
                    For web, <code className="text-cyan-400">npm run deploy</code> prompts for a hosting target and generates the appropriate configuration:
                  </p>
                  <Table 
                    headers={['Platform', 'Runtime', 'File Generated']}
                    rows={[
                      ['Node.js', 'Node.js', '— (bini-server reads src/app/api/ directly)'],
                      ['Netlify', 'Edge Functions (Deno)', 'netlify/edge-functions/api.ts + netlify.toml'],
                      ['Vercel', 'Edge Runtime', 'api/index.ts + vercel.json'],
                      ['Cloudflare', 'Workers', 'worker.ts + wrangler.toml'],
                      ['Deno', 'Deno', 'server/index.ts'],
                    ]}
                  />
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Deployment Options</h3>
                  <ul className="space-y-2 text-slate-300 mb-4 list-disc list-inside">
                    <li><strong className="text-white">SPA + API Server:</strong> Build with <code className="text-cyan-400">npm run build</code>, deploy with <code className="text-cyan-400">npm start</code> (requires Node.js)</li>
                    <li><strong className="text-white">Pre-rendered Static:</strong> Build with <code className="text-cyan-400">npm run build</code>, deploy the <code className="text-cyan-400">dist/</code> folder to any static hosting</li>
                    <li><strong className="text-white">Edge/Serverless:</strong> Use <code className="text-cyan-400">npm run deploy</code> to generate platform-specific entry files</li>
                  </ul>
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Node.js Deployment</h3>
                  <p className="text-slate-300 mb-4">
                    For Node.js hosts (Railway, Render, Fly.io, a VPS):
                  </p>
                  <CodeBlock 
                    code={`npm run build && npm start`}
                  />
                  <p className="text-slate-300 mt-4">
                    <code className="text-cyan-400">bini-server</code> reads handlers directly from <code className="text-cyan-400">src/app/api/</code>, so deploy the whole project — not just <code className="text-cyan-400">dist/</code>. Use <code className="text-cyan-400">pm2</code> on a bare VPS.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">GitHub Pages / Subpaths</h3>
                  <p className="text-slate-300 mb-4">
                    Set <code className="text-cyan-400">base: '/my-repo/'</code> in <code className="text-cyan-400">vite.config.ts</code>, then <code className="text-cyan-400">npm run build</code> for a fully pre-rendered, subpath-aware <code className="text-cyan-400">dist/</code>.
                  </p>
                  <CodeBlock 
                    code={`// vite.config.ts
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/my-repo/',  // GitHub Pages subpath
})`}
                    filename="vite.config.ts"
                  />
                </motion.section>

                {/* Previous / Next Navigation */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex items-center justify-between pt-8 mt-8 border-t border-slate-800">
                  <Link to="/docs/css-modules" className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <div>
                      <div className="text-xs text-slate-500">Previous</div>
                      <div className="text-sm font-medium">CSS Modules</div>
                    </div>
                  </Link>
                  <Link to="/docs/platform-windows" className="group flex items-center gap-2 text-right text-slate-400 hover:text-white transition-colors">
                    <div>
                      <div className="text-xs text-slate-500">Next</div>
                      <div className="text-sm font-medium">Windows</div>
                    </div>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>

              </div>

              {/* Right-hand "On this page" sidebar */}
              <aside className="hidden xl:block w-56 shrink-0">
                <TableOfContents items={TOC_ITEMS} editUrl={EDIT_URL} />
              </aside>
            </div>
          </DocLayout>
          
        </div>
      </div>
    </div>
  )
}