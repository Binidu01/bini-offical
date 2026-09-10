// src/pages/docs/static-export/page.tsx
import React from 'react'
import { m } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
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
  { id: 'overview', label: 'Overview' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'render-function', label: 'Your render() Function' },
  { id: 'build-command', label: 'Build Command' },
  { id: 'output-structure', label: 'Output Structure' },
  { id: 'shell-pages', label: 'Shell Pages & Hydration' },
  { id: '404-handling', label: '404 Handling' },
  { id: 'static-hosts', label: 'Works on Any Static Host' },
  { id: 'complete-example', label: 'Complete Example' },
]

const PAGE_TITLE = 'Static Export'
const PAGE_URL = 'https://bini.js.org/docs/static-export'
const EDIT_URL = 'https://github.com/Binidu01/bini-offical/edit/main/src/app/docs/static-export.tsx'

// ────────────────────────────────────────────────────────────────────────────────
// Code Block Component
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
      <div className="text-sm text-slate-300 [&>strong]:text-white [&>code]:text-cyan-400 [&>code]:bg-slate-800 [&>code]:px-1 [&>code]:py-0.5 [&>code]:rounded">
        {children}
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────────
// Static Export Page
// ────────────────────────────────────────────────────────────────────────────────
export default function StaticExportPage() {
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
                <m.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start justify-between gap-4 mb-4"
                >
                  <div>
                    <h1 className="text-4xl font-bold text-white mb-2">{PAGE_TITLE}</h1>
                    <p className="text-slate-400 text-sm">Pre-render your Bini.js app to static HTML with <code className="text-cyan-400 bg-slate-800 px-1 py-0.5 rounded">bini-ssg</code>, ready for any static host.</p>
                  </div>
                  <div className="shrink-0 pt-2 hidden sm:block">
                    <CopyPageButton pageUrl={PAGE_URL} pageTitle={PAGE_TITLE} />
                  </div>
                </m.div>
                {/* Copy button on small screens */}
                <div className="sm:hidden mb-8">
                  <CopyPageButton pageUrl={PAGE_URL} pageTitle={PAGE_TITLE} />
                </div>

                {/* Overview */}
                <m.section id="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="scroll-mt-24">
                  <p className="text-slate-300 mb-6">
                    <code className="text-cyan-400">bini-ssg</code> pre-renders every route — static and dynamic — to static HTML as part of <code className="text-cyan-400">npm run build</code>. There is no separate export command or export mode. The output is real server-rendered markup, not a client-only shell, ready for GitHub Pages, S3, Firebase, Surge, and any other static host.
                  </p>
                  <Note>
                    <strong>Web target only.</strong> Static export applies to the Node.js/web target. Desktop and mobile builds (Windows, macOS, Linux, Android, iOS) don't use <code>bini-ssg</code> — they package the same routes into a native binary instead.
                  </Note>
                </m.section>

                {/* How It Works */}
                <m.section id="how-it-works" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">How It Works</h2>
                  <p className="text-slate-300 mb-4">
                    <code className="text-cyan-400">bini-ssg</code> is a Vite build plugin that runs during <code className="text-cyan-400">vite build</code>. It:
                  </p>
                  <ul className="space-y-2 text-slate-300 mb-4 list-disc list-inside">
                    <li><strong className="text-white">Reads your route list</strong> from <code className="text-cyan-400">bini-router</code>'s <code className="text-cyan-400">generateRouteManifest()</code></li>
                    <li><strong className="text-white">Calls your <code className="text-cyan-400">render()</code> function</strong> for every static route</li>
                    <li><strong className="text-white">Creates shell pages</strong> for dynamic routes with a hydration marker</li>
                    <li><strong className="text-white">Writes one <code className="text-cyan-400">index.html</code></strong> per route into your output directory</li>
                  </ul>
                </m.section>

                {/* Your render() Function */}
                <m.section id="render-function" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Your render() Function</h2>
                  <p className="text-slate-300 mb-4">
                    The <code className="text-cyan-400">render()</code> function is exported from <code className="text-cyan-400">src/main.tsx</code> and called by <code className="text-cyan-400">bini-ssg</code> for every static route:
                  </p>
                  <CodeBlock
                    filename="src/main.tsx"
                    code={`import { createRoot } from 'react-dom/client'
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
                  />
                  <p className="text-slate-300 mt-4">
                    This function uses React 19's <code className="text-cyan-400">renderToPipeableStream</code> under the hood with <code className="text-cyan-400">StaticRouter</code> from React Router, producing real server-rendered HTML.
                  </p>
                  <Note>
                    <strong>Already scaffolded:</strong> The <code>render()</code> function is already in your project. You only need to modify it if you need custom server rendering logic.
                  </Note>
                </m.section>

                {/* Build Command */}
                <m.section id="build-command" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Build Command</h2>
                  <Table
                    headers={['Command', 'When to use']}
                    rows={[
                      [<code className="text-cyan-400">npm run build</code>, 'Pre-renders every route to static HTML — GitHub Pages, S3, Firebase, Surge, and any static host'],
                      [<code className="text-cyan-400">npm run start</code>, 'Serves the production build with API routes — Node.js hosts (Railway, Render, Fly.io, VPS)'],
                    ]}
                  />
                  <p className="text-slate-300 mt-4">
                    <code className="text-cyan-400">npm run build</code> type-checks (TypeScript projects) and then runs <code className="text-cyan-400">vite build</code>. The <code className="text-cyan-400">bini-ssg</code> plugin drives pre-rendering as part of that same build.
                  </p>
                </m.section>

                {/* Output Structure */}
                <m.section id="output-structure" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Output Structure</h2>
                  <CodeBlock
                    code={`dist/
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
    └── index-[hash].css`}
                  />
                </m.section>

                {/* Shell Pages & Hydration */}
                <m.section id="shell-pages" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Shell Pages & Hydration</h2>
                  <p className="text-slate-300 mb-4">
                    For dynamic routes (e.g., <code className="text-cyan-400">/blog/:slug</code>), <code className="text-cyan-400">bini-ssg</code> creates a shell page with a marker script:
                  </p>
                  <CodeBlock
                    code={`<script>window.__BINI_SHELL__=true;</script>`}
                  />
                  <p className="text-slate-300 mt-4">
                    Your client entry checks this flag to decide between <code className="text-cyan-400">createRoot</code> and <code className="text-cyan-400">hydrateRoot</code>:
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
                  <Note>
                    <strong>No hydration errors:</strong> The shell marker prevents React from trying to hydrate an empty <code>#root</code> div against your component tree.
                  </Note>
                </m.section>

                {/* 404 Handling */}
                <m.section id="404-handling" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">404 Handling</h2>
                  <p className="text-slate-300 mb-4">
                    You can enable <code className="text-cyan-400">404.html</code> generation with the <code className="text-cyan-400">fallback</code> option:
                  </p>
                  <CodeBlock
                    code={`// vite.config.ts
import { defineConfig } from 'vite'
import { biniSSG } from 'bini-ssg'

export default defineConfig({
  plugins: [
    // ...other plugins
    biniSSG({
      fallback: true,  // Render '/404' as 404.html
    }),
  ],
})`}
                  />
                  <Table
                    headers={['Situation', 'What gets written to 404.html']}
                    rows={[
                      [
                        <span><code className="text-cyan-400">src/app/not-found.tsx</code> exists</span>,
                        <span>Your custom not-found page is pre-rendered to HTML</span>
                      ],
                      ['No custom not-found file', 'Built-in 404 page is used'],
                    ]}
                  />
                  <Note>
                    <strong>Default:</strong> <code>fallback</code> is <code>false</code>. Enable it to generate <code>404.html</code> for static hosts that support it.
                  </Note>
                </m.section>

                {/* Works on Any Fully Static Host */}
                <m.section id="static-hosts" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Works on Any Fully Static Host</h2>
                  <Table
                    headers={['Host', 'Static routes', 'Dynamic routes']}
                    rows={[
                      ['GitHub Pages', <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> pre-rendered</span>, <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> shell pages</span>],
                      ['AWS S3 + CloudFront', <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> pre-rendered</span>, <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> shell pages</span>],
                      ['Firebase Hosting', <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> pre-rendered</span>, <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> shell pages</span>],
                      ['Surge.sh', <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> pre-rendered</span>, <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> shell pages</span>],
                    ]}
                  />
                </m.section>

                {/* Complete Example */}
                <m.section id="complete-example" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Complete Example</h2>
                  <p className="text-slate-300 mb-4">
                    A full setup for deploying to GitHub Pages with true SSG:
                  </p>
                  <CodeBlock
                    filename="vite.config.ts"
                    code={`import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { biniroute } from 'bini-router'
import { biniEnv } from 'bini-env'
import { biniSSG } from 'bini-ssg'

export default defineConfig({
  base: '/my-app/',  // GitHub Pages subpath
  plugins: [
    react(),
    biniEnv(),
    ...biniroute(),
    biniSSG({
      fallback: true,        // Generate 404.html
    }),
  ],
})`}
                  />
                  <p className="text-slate-300 mt-4">
                    Run <code className="text-cyan-400">npm run build</code>, then push the contents of <code className="text-cyan-400">dist/</code> to your GitHub Pages branch (or upload them through the GitHub Pages UI).
                  </p>
                </m.section>

                {/* Previous / Next Navigation */}
                <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="flex items-center justify-between pt-8 mt-8 border-t border-slate-800">
                  <Link to="/docs/production-server" className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <div>
                      <div className="text-xs text-slate-500">Previous</div>
                      <div className="text-sm font-medium">Production Server</div>
                    </div>
                  </Link>
                  <Link to="/docs/hosting" className="group flex items-center gap-2 text-right text-slate-400 hover:text-white transition-colors">
                    <div>
                      <div className="text-xs text-slate-500">Next</div>
                      <div className="text-sm font-medium">Hosting Providers</div>
                    </div>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </m.div>

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