// src/pages/docs/project-structure/page.tsx
import React from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Smartphone,
  Laptop,
  Globe,
  Boxes,
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
  { id: 'folder-and-file-conventions', label: 'Folder and file conventions' },
  { id: 'cross-platform-structure', label: 'Cross-Platform Project Structure' },
  { id: 'top-level-folders', label: 'Top-level folders' },
  { id: 'top-level-files', label: 'Top-level files' },
  { id: 'routing-files', label: 'Routing Files' },
  { id: 'complete-project-structure', label: 'Complete project structure' },
  { id: 'platform-specific-files', label: 'Platform-Specific Files' },
  { id: 'nested-routes', label: 'Nested routes' },
  { id: 'dynamic-routes', label: 'Dynamic routes' },
  { id: 'route-groups-private', label: 'Route groups and private folders' },
  { id: 'api-routes', label: 'API Routes' },
  { id: 'component-hierarchy', label: 'Component hierarchy' },
  { id: 'colocation', label: 'Colocation' },
]

const PAGE_TITLE = 'Project Structure'
const PAGE_URL = 'https://bini.js.org/docs/project-structure'
const EDIT_URL = 'https://github.com/Binidu01/bini-offical/edit/main/src/app/docs/project-structure.tsx'

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
// Callout Component (kept for other uses but the specific one was removed)
// ────────────────────────────────────────────────────────────────────────────────
function Callout({ type, children }: { type: 'info' | 'warning' | 'success' | 'tip'; children: React.ReactNode }) {
  const styles = {
    info: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', icon: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, color: 'text-cyan-400' },
    warning: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', icon: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>, color: 'text-amber-400' },
    success: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', icon: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, color: 'text-emerald-400' },
    tip: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', icon: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>, color: 'text-purple-400' },
  }
  const style = styles[type]
  const Icon = style.icon

  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg ${style.bg} border ${style.border} my-6`}>
      <Icon className={`w-5 h-5 ${style.color} shrink-0 mt-0.5`} />
      <div className="text-sm text-slate-200 [&>strong]:text-white [&>code]:text-cyan-400 [&>code]:bg-slate-800 [&>code]:px-1 [&>code]:py-0.5 [&>code]:rounded">{children}</div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────────
// Table Component - Fixed to render HTML properly
// ────────────────────────────────────────────────────────────────────────────────
function Table({ headers, rows }: { headers: string[]; rows: (string | React.ReactNode)[][] }) {
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
// Project Structure Page
// ────────────────────────────────────────────────────────────────────────────────
export default function ProjectStructurePage() {
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
                    <p className="text-slate-400 text-sm">Learn the folder and file conventions in Bini.js, and how to organize your project for cross-platform development.</p>
                  </div>
                  <div className="shrink-0 pt-2 hidden sm:block">
                    <CopyPageButton pageUrl={PAGE_URL} pageTitle={PAGE_TITLE} />
                  </div>
                </motion.div>
                {/* Copy button on small screens */}
                <div className="sm:hidden mb-8">
                  <CopyPageButton pageUrl={PAGE_URL} pageTitle={PAGE_TITLE} />
                </div>

                {/* Folder and file conventions */}
                <motion.section id="folder-and-file-conventions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Folder and file conventions</h2>
                  <p className="text-slate-300 mb-4">
                    This page provides an overview of all the folder and file conventions in Bini.js, and recommendations for organizing your project across web, desktop, and mobile platforms.
                  </p>
                </motion.section>

                {/* Cross-Platform Structure */}
                <motion.section id="cross-platform-structure" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="mb-8 scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Cross-Platform Project Structure</h2>
                  <p className="text-slate-300 mb-4">
                    Bini.js projects are designed to work across all platforms from a single codebase. The same folder structure works for web, desktop, and mobile:
                  </p>

                  <div className="grid sm:grid-cols-3 gap-3 mb-4">
                    <div className="p-4 rounded-xl border border-slate-700 bg-[#0a0a0a]">
                      <div className="flex items-center gap-2 mb-2">
                        <Globe className="w-4 h-4 text-cyan-400" />
                        <span className="text-white font-medium text-sm">Web</span>
                      </div>
                      <p className="text-slate-400 text-xs">Uses <code className="text-cyan-400">src/app/</code> with <code className="text-cyan-400">bini-server</code> and <code className="text-cyan-400">bini-export</code></p>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-700 bg-[#0a0a0a]">
                      <div className="flex items-center gap-2 mb-2">
                        <Laptop className="w-4 h-4 text-cyan-400" />
                        <span className="text-white font-medium text-sm">Desktop</span>
                      </div>
                      <p className="text-slate-400 text-xs">Adds <code className="text-cyan-400">src-tauri/</code> for Windows, macOS, Linux native binaries</p>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-700 bg-[#0a0a0a]">
                      <div className="flex items-center gap-2 mb-2">
                        <Smartphone className="w-4 h-4 text-cyan-400" />
                        <span className="text-white font-medium text-sm">Mobile</span>
                      </div>
                      <p className="text-slate-400 text-xs">Adds <code className="text-cyan-400">src-tauri/gen/</code> for Android and iOS</p>
                    </div>
                  </div>
                </motion.section>

                {/* Top-level folders */}
                <motion.section id="top-level-folders" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="scroll-mt-24">
                  <h3 className="text-lg font-semibold text-white mb-3">Top-level folders</h3>
                  <p className="text-slate-300 mb-4">
                    Top-level folders are used to organize your application's code and static assets.
                  </p>
                  <Table 
                    headers={['Folder', 'Purpose']}
                    rows={[
                      ['src/', 'Application source folder'],
                      ['src/app', 'App Router — file-based routing and layouts'],
                      ['src-tauri/', 'Tauri configuration for desktop & mobile (generated)'],
                      ['public', 'Static assets to be served at root URL'],
                      ['dist/', 'Production build output (generated)'],
                    ]}
                  />
                </motion.section>

                {/* Top-level files */}
                <motion.section id="top-level-files" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="scroll-mt-24">
                  <h3 className="text-lg font-semibold text-white mb-3">Top-level files</h3>
                  <p className="text-slate-300 mb-4">
                    Top-level files are used to configure your application, manage dependencies, and define environment variables.
                  </p>
                  <Table 
                    headers={['File', 'Purpose']}
                    rows={[
                      ['vite.config.ts', 'Configuration file for Vite and Bini.js'],
                      ['package.json', 'Project dependencies and scripts'],
                      ['index.html', 'HTML entry point — contains <html> and <body> tags'],
                      ['.env', 'Environment variables (should not be tracked)'],
                      ['.env.local', 'Local environment variables (should not be tracked)'],
                      ['.env.production', 'Production environment variables'],
                      ['.env.development', 'Development environment variables'],
                      ['.oxlintrc.json', 'Configuration file for Oxlint'],
                      ['.oxfmtrc.json', 'Configuration file for Oxfmt'],
                      ['.gitignore', 'Git files and folders to ignore'],
                      ['tsconfig.json', 'Configuration file for TypeScript'],
                      ['jsconfig.json', 'Configuration file for JavaScript'],
                    ]}
                  />
                </motion.section>

                {/* Routing Files */}
                <motion.section id="routing-files" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="scroll-mt-24">
                  <h3 className="text-lg font-semibold text-white mb-3">Routing Files</h3>
                  <p className="text-slate-300 mb-4">
                    Add <code className="text-cyan-400">page</code> to expose a route, <code className="text-cyan-400">layout</code> for shared UI such as header, nav, or footer, <code className="text-cyan-400">loading</code> for skeletons, and <code className="text-cyan-400">not-found</code> for custom 404 pages.
                  </p>
                  <Table 
                    headers={['File', 'Extensions', 'Purpose']}
                    rows={[
                      ['layout', '.js .jsx .tsx', 'Shared UI that wraps pages and nested layouts'],
                      ['page', '.js .jsx .tsx', 'A page — defines a public route'],
                      ['loading', '.js .jsx .tsx', 'Loading UI (Suspense fallback)'],
                      ['not-found', '.js .jsx .tsx', 'Custom 404 UI'],
                      ['hello.ts', '.js .ts', 'API endpoint in src/app/api/'],
                    ]}
                  />
                  <p className="text-slate-400 text-sm mt-2">
                    <strong className="text-white">Note:</strong> The <code className="text-cyan-400">&lt;html&gt;</code> and <code className="text-cyan-400">&lt;body&gt;</code> tags are defined in <code className="text-cyan-400">index.html</code>, not in layouts.
                  </p>
                </motion.section>

                {/* Complete project structure */}
                <motion.section id="complete-project-structure" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="scroll-mt-24">
                  <h3 className="text-lg font-semibold text-white mb-3">Complete project structure</h3>
                  <CodeBlock 
                    code={`my-app/
├── src/                   ← Application source folder
│   ├── app/
│   │   ├── api/           ← API route handlers
│   │   │   └── hello.ts   → /api/hello
│   │   ├── layout.tsx     ← Root layout (returns <Outlet />)
│   │   ├── page.tsx       ← Home page (/)
│   │   ├── loading.tsx    ← Custom loading UI (optional)
│   │   ├── not-found.tsx  ← Custom 404 page (optional)
│   │   └── globals.css    ← Global styles
│   ├── main.tsx           ← React entry point
│   └── App.tsx            ← Auto-generated — do not edit
├── src-tauri/             ← Tauri configuration (desktop & mobile)
│   ├── Cargo.toml         ← Rust dependencies
│   ├── tauri.conf.json    ← Tauri app configuration
│   ├── src/               ← Rust source code
│   └── gen/               ← Android & iOS projects (generated)
├── public/                ← Static assets
│   ├── favicon.ico
│   ├── apple-touch-icon.png
│   ├── logo.png           ← Source icon for native app icons
│   └── og-image.png
├── index.html             ← HTML entry point with <html> and <body>
├── vite.config.ts         ← Vite configuration
├── .oxlintrc.json         ← Oxlint configuration
├── .oxfmtrc.json          ← Oxfmt configuration
└── package.json`}
                  />
                  <p className="text-slate-400 text-sm mt-2 mb-8">
                    <strong className="text-white">Note:</strong> <code className="text-cyan-400">App.tsx</code> is auto-generated by bini-router. Never edit this file directly.
                  </p>
                </motion.section>

                {/* Platform-Specific Files */}
                <motion.section id="platform-specific-files" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }} className="scroll-mt-24">
                  <h3 className="text-lg font-semibold text-white mb-3">Platform-Specific Files</h3>
                  <p className="text-slate-300 mb-4">
                    When targeting desktop or mobile, Bini.js generates platform-specific files and configurations:
                  </p>
                  <Table 
                    headers={['Platform', 'Generated Files', 'Purpose']}
                    rows={[
                      ['Web', <code className="text-cyan-400">dist/</code>, 'Standard Vite build output'],
                      ['Windows', <code className="text-cyan-400">src-tauri/</code>, 'Native WebView2 binary with Authenticode signing'],
                      ['macOS', <code className="text-cyan-400">src-tauri/</code>, 'Native WKWebView app with Developer ID notarization'],
                      ['Linux', <code className="text-cyan-400">src-tauri/</code>, 'Native WebKitGTK binary as AppImage'],
                      ['Android', <code className="text-cyan-400">src-tauri/gen/android/</code>, "Native APK/AAB via Tauri's Android backend"],
                      ['iOS', <code className="text-cyan-400">src-tauri/gen/ios/</code>, "Native app via Tauri's iOS backend"],
                    ]}
                  />
                </motion.section>

                {/* Nested routes */}
                <motion.section id="nested-routes" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="scroll-mt-24">
                  <h3 className="text-lg font-semibold text-white mb-3">Nested routes</h3>
                  <p className="text-slate-300 mb-4">
                    Folders define URL segments. Nesting folders nests segments. Layouts at any level wrap their child segments. A route becomes public when a <code className="text-cyan-400">page</code> file exists.
                  </p>
                  <Table 
                    headers={['Path', 'URL pattern', 'Notes']}
                    rows={[
                      ['src/app/layout.tsx', '—', 'Root layout wraps all routes'],
                      ['src/app/blog/layout.tsx', '—', 'Wraps /blog and descendants'],
                      ['src/app/page.tsx', '/', 'Public route'],
                      ['src/app/about/page.tsx', '/about', 'Public route'],
                      ['src/app/blog/page.tsx', '/blog', 'Public route'],
                      ['src/app/blog/authors/page.tsx', '/blog/authors', 'Public route'],
                    ]}
                  />
                </motion.section>

                {/* Dynamic routes */}
                <motion.section id="dynamic-routes" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="scroll-mt-24">
                  <h3 className="text-lg font-semibold text-white mb-3">Dynamic routes</h3>
                  <p className="text-slate-300 mb-4">
                    Parameterize segments with square brackets. Use <code className="text-cyan-400">[segment]</code> for a single param, <code className="text-cyan-400">[...segment]</code> for catch‑all, and <code className="text-cyan-400">[[...segment]]</code> for optional catch‑all. Access values via the <code className="text-cyan-400">useParams()</code> hook.
                  </p>
                  <Table 
                    headers={['Path', 'URL pattern']}
                    rows={[
                      ['src/app/blog/[slug]/page.tsx', '/blog/my-first-post'],
                      ['src/app/shop/[...slug]/page.tsx', '/shop/clothing, /shop/clothing/shirts'],
                      ['src/app/docs/[[...slug]]/page.tsx', '/docs, /docs/layouts, /docs/api/use-router'],
                    ]}
                  />
                </motion.section>

                {/* Route Groups and Private Folders */}
                <motion.section id="route-groups-private" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="scroll-mt-24">
                  <h3 className="text-lg font-semibold text-white mb-3">Route groups and private folders</h3>
                  <p className="text-slate-300 mb-4">
                    Organize code without changing URLs with route groups <code className="text-cyan-400">(group)</code>, and colocate non-routable files with private folders <code className="text-cyan-400">_folder</code>.
                  </p>
                  <Table 
                    headers={['Path', 'URL pattern', 'Notes']}
                    rows={[
                      ['src/app/(marketing)/page.tsx', '/', 'Group omitted from URL'],
                      ['src/app/(shop)/cart/page.tsx', '/cart', 'Share layouts within (shop)'],
                      ['src/app/blog/_components/Post.tsx', '—', 'Not routable; safe place for UI utilities'],
                      ['src/app/blog/_lib/data.ts', '—', 'Not routable; safe place for utils'],
                    ]}
                  />
                </motion.section>

                {/* API Routes */}
                <motion.section id="api-routes" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="scroll-mt-24">
                  <h3 className="text-lg font-semibold text-white mb-3">API Routes</h3>
                  <p className="text-slate-300 mb-4">
                    Create API endpoints in <code className="text-cyan-400">src/app/api/</code>. Files export a handler function or Hono app.
                  </p>
                  <Table 
                    headers={['Path', 'URL pattern', 'Notes']}
                    rows={[
                      ['src/app/api/hello.ts', '/api/hello', 'Static API endpoint'],
                      ['src/app/api/users/[id].ts', '/api/users/123', 'Dynamic API endpoint'],
                      ['src/app/api/posts/[...slug].ts', '/api/posts/2024/hello', 'Catch-all API endpoint'],
                    ]}
                  />
                  <CodeBlock 
                    code={`// src/app/api/users/[id].ts
import { Hono } from 'hono'

const app = new Hono()

app.get('/users/:id', (c) => {
  const id = c.req.param('id')
  return c.json({ id, name: \`User \${id}\` })
})

export default app`}
                    filename="app/api/users/[id].ts"
                  />
                </motion.section>

                {/* Component Hierarchy */}
                <motion.section id="component-hierarchy" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="scroll-mt-24">
                  <h3 className="text-lg font-semibold text-white mb-3">Component hierarchy</h3>
                  <p className="text-slate-300 mb-4">
                    The components defined in special files are rendered in a specific hierarchy:
                  </p>
                  <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 mb-6">
                    <ol className="list-decimal list-inside space-y-2 text-slate-300">
                      <li><code className="text-cyan-400">layout.tsx</code> — wraps all children</li>
                      <li><code className="text-cyan-400">loading.tsx</code> — React suspense boundary (if present)</li>
                      <li><code className="text-cyan-400">not-found.tsx</code> — 404 UI (only at root level)</li>
                      <li><code className="text-cyan-400">page.tsx</code> or nested <code className="text-cyan-400">layout.tsx</code></li>
                    </ol>
                  </div>
                  <p className="text-slate-300">
                    The components are rendered recursively in nested routes, meaning the components of a route segment will be nested <strong className="text-white">inside</strong> the components of its parent segment.
                  </p>
                </motion.section>

                {/* Colocation */}
                <motion.section id="colocation" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="scroll-mt-24">
                  <h3 className="text-lg font-semibold text-white mt-8 mb-3">Colocation</h3>
                  <p className="text-slate-300 mb-4">
                    In the <code className="text-cyan-400">src/app</code> directory, nested folders define route structure. Each folder represents a route segment that maps to a URL path.
                  </p>
                  <p className="text-slate-300 mb-4">
                    However, even though route structure is defined through folders, a route is <strong className="text-white">not publicly accessible</strong> until a <code className="text-cyan-400">page.tsx</code> file is added to a route segment.
                  </p>
                  <p className="text-slate-300">
                    This means that <strong className="text-white">project files can be safely colocated</strong> inside route segments in the <code className="text-cyan-400">app</code> directory without accidentally being routable.
                  </p>
                </motion.section>

                {/* Previous / Next Navigation */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }} className="flex items-center justify-between pt-8 mt-8 border-t border-slate-800">
                  <Link to="/docs/installation" className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <div>
                      <div className="text-xs text-slate-500">Previous</div>
                      <div className="text-sm font-medium">Installation</div>
                    </div>
                  </Link>
                  <Link to="/docs/layouts-and-pages" className="group flex items-center gap-2 text-right text-slate-400 hover:text-white transition-colors">
                    <div>
                      <div className="text-xs text-slate-500">Next</div>
                      <div className="text-sm font-medium">Layouts and Pages</div>
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