// src/pages/docs/file-based-routing/page.tsx
import React, { useState } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Copy,
  Check,
  File,
  Folder,
  Layout,
  Loader,
  AlertCircle,
  FileQuestion,
  FileText,
  Code,
  Sparkles,
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
  { id: 'special-files', label: 'Special Files' },
  { id: 'page-file', label: 'page.tsx / page.jsx' },
  { id: 'mdx-pages', label: 'MDX & Markdown Pages' },
  { id: 'layout-file', label: 'layout.tsx / layout.jsx' },
  { id: 'loading-file', label: 'loading.tsx / loading.jsx' },
  { id: 'error-file', label: 'error.tsx / error.jsx' },
  { id: 'not-found-file', label: 'not-found.tsx / not-found.jsx' },
  { id: 'nearest-wins', label: 'Nearest Wins Resolution' },
  { id: 'file-combinations', label: 'File Combinations' },
  { id: 'file-priority', label: 'File Priority' },
  { id: 'dynamic-routes', label: 'Dynamic Routes' },
  { id: 'catch-all-routes', label: 'Catch-All Routes' },
  { id: 'api-routes', label: 'API Routes' },
  { id: 'complete-example', label: 'Complete Example' },
]

const PAGE_TITLE = 'File-Based Routing'
const PAGE_URL = 'https://bini.js.org/docs/file-based-routing'
const EDIT_URL = 'https://github.com/Binidu01/bini-offical/edit/main/src/app/docs/file-based-routing.tsx'

// ────────────────────────────────────────────────────────────────────────────────
// Code Block Component with Copy
// ────────────────────────────────────────────────────────────────────────────────
function CodeBlock({ code, filename, highlight }: { code: string; filename?: string; highlight?: string }) {
  const [copied, setCopied] = useState(false)
  
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
          <span className="text-sm text-slate-300 font-mono flex items-center gap-2">
            <File className="w-3.5 h-3.5 text-cyan-400" />
            {filename}
          </span>
        </div>
      )}
      <button 
        onClick={handleCopy} 
        className="absolute top-2 right-2 p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 transition-colors z-10 opacity-0 group-hover:opacity-100"
        style={{ top: filename ? '3rem' : '0.5rem' }}
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-green-400" />
        ) : (
          <Copy className="w-3.5 h-3.5 text-slate-500" />
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
// File Structure Component
// ────────────────────────────────────────────────────────────────────────────────
function FileStructure({ tree }: { tree: string }) {
  return (
    <div className="bg-[#0a0a0a] border border-slate-700 rounded-lg p-4 mb-6 font-mono text-sm">
      <div className="text-slate-200 whitespace-pre">{tree}</div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────────
// Table Component
// ────────────────────────────────────────────────────────────────────────────────
function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-700 my-6">
      <table className="w-full text-sm">
        <thead className="bg-slate-900 border-b border-slate-800">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="text-left py-3 px-4 font-medium text-white">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} className="py-3 px-4 text-slate-300 text-xs">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────────
// Callout Component
// ────────────────────────────────────────────────────────────────────────────────
function Callout({ type, children }: { type: 'info' | 'warning' | 'success' | 'tip'; children: React.ReactNode }) {
  const styles = {
    info: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', icon: Sparkles, color: 'text-cyan-400' },
    warning: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', icon: AlertCircle, color: 'text-amber-400' },
    success: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', icon: Check, color: 'text-emerald-400' },
    tip: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', icon: Sparkles, color: 'text-purple-400' },
  }
  const style = styles[type]
  const Icon = style.icon

  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg ${style.bg} border ${style.border} my-6`}>
      <Icon className={`w-5 h-5 ${style.color} shrink-0 mt-0.5`} />
      <div className="text-sm text-slate-200 [&>strong]:text-white [&>code]:text-cyan-400 [&>code]:bg-slate-800 [&>code]:px-1 [&>code]:py-0.5 [&>code]:rounded">
        {children}
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────────
// Feature Card Component
// ────────────────────────────────────────────────────────────────────────────────
function FeatureCard({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
  return (
    <div className="p-4 rounded-xl border border-slate-700 bg-[#0a0a0a] hover:border-slate-600 transition-colors">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-cyan-400" />
        <span className="text-white font-medium text-sm">{title}</span>
      </div>
      <p className="text-slate-400 text-xs">{description}</p>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────────
// File-Based Routing Page
// ────────────────────────────────────────────────────────────────────────────────
export default function FileBasedRoutingPage() {
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
                    <p className="text-slate-400 text-sm">
                      Learn how special files like <code className="text-cyan-400">page.tsx</code>, <code className="text-cyan-400">layout.tsx</code>, <code className="text-cyan-400">loading.tsx</code>, <code className="text-cyan-400">error.tsx</code>, and MDX pages define route behavior in Bini.js.
                    </p>
                  </div>
                  <div className="shrink-0 pt-2 hidden sm:block">
                    <CopyPageButton pageUrl={PAGE_URL} pageTitle={PAGE_TITLE} />
                  </div>
                </m.div>
                
                <div className="sm:hidden mb-8">
                  <CopyPageButton pageUrl={PAGE_URL} pageTitle={PAGE_TITLE} />
                </div>

                {/* Overview */}
                <m.section 
                  id="overview"
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.1 }}
                  className="scroll-mt-24"
                >
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Overview</h2>
                  <p className="text-slate-300 mb-4">
                    Bini.js uses a file-based routing system where files in the <code className="text-cyan-400">src/app/</code> directory automatically become routes in your application. Each file has a specific purpose and is automatically recognized by the router.
                  </p>
                  
                  <div className="grid sm:grid-cols-2 gap-3 mb-6">
                    <FeatureCard 
                      icon={Folder}
                      title="Zero Configuration"
                      description="Routes are automatically generated from your file structure"
                    />
                    <FeatureCard 
                      icon={Code}
                      title="TypeScript & JavaScript"
                      description="Full support for both .tsx and .jsx files"
                    />
                    <FeatureCard 
                      icon={FileText}
                      title="MDX & Markdown"
                      description="Content pages work out of the box with .mdx and .md"
                    />
                    <FeatureCard 
                      icon={Layout}
                      title="Nested Layouts"
                      description="Create shared UI that persists across navigation"
                    />
                  </div>
                </m.section>

                {/* Special Files Overview */}
                <m.section 
                  id="special-files" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.15 }} 
                  className="scroll-mt-24"
                >
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Special Files</h2>
                  <p className="text-slate-300 mb-4">
                    Bini.js recognizes these special files in the <code className="text-cyan-400">src/app/</code> directory:
                  </p>
                  
                  <Table 
                    headers={['File', 'Purpose', 'Required']}
                    rows={[
                      ['page.tsx / page.jsx', 'Defines a public route — required to make a route accessible', '✅ Yes'],
                      ['page.mdx / page.md', 'MDX/Markdown content route — full JSX/import/export support', '❌ No'],
                      ['layout.tsx / layout.jsx', 'Shared UI that wraps pages and nested layouts', '✅ Yes (root)'],
                      ['loading.tsx / loading.jsx', 'Loading UI shown while page content streams', '❌ No'],
                      ['error.tsx / error.jsx', 'Error UI when something breaks in a route or its children', '❌ No'],
                      ['not-found.tsx / not-found.jsx', 'Custom 404 page for unmatched routes', '❌ No'],
                    ]}
                  />
                  
                  <Callout type="info">
                    <strong>Note:</strong> Files and directories prefixed with <code>_</code> or <code>.</code> are ignored by the router. The <code>api/</code> directory is excluded from page route scanning.
                  </Callout>
                </m.section>

                {/* page.tsx */}
                <m.section 
                  id="page-file" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.2 }} 
                  className="scroll-mt-24"
                >
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">page.tsx / page.jsx</h2>
                  <p className="text-slate-300 mb-4">
                    The <code className="text-cyan-400">page.tsx</code> file defines a public route. Without it, the folder is not accessible via URL. Each <code className="text-cyan-400">page.tsx</code> must have a <strong className="text-white">default export</strong> of a React component.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Basic Pages</h3>
                  <CodeBlock 
                    code={`// src/app/page.tsx
export default function HomePage() {
  return <h1>Welcome to Bini.js!</h1>
}

// src/app/about/page.tsx
export default function AboutPage() {
  return <h1>About Us</h1>
}

// src/app/blog/page.tsx
export default function BlogPage() {
  return <h1>Blog</h1>
}`}
                  />
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Flat File Pages</h3>
                  <p className="text-slate-300 mb-4">
                    Pages can also be defined as flat files without a folder:
                  </p>
                  <FileStructure 
                    tree={`src/app/
├── page.tsx              → /
├── about.tsx             → /about
├── contact.tsx           → /contact
└── blog/
    └── [slug].tsx        → /blog/:slug`}
                  />
                  <p className="text-slate-300 mt-4">
                    This creates routes at <code className="text-cyan-400">/about</code> and <code className="text-cyan-400">/contact</code> without needing separate folders.
                  </p>

                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Auto-Imports</h3>
                  <p className="text-slate-300 mb-4">
                    Bini.js automatically injects imports into every page and layout file under <code className="text-cyan-400">src/app/</code> (excluding <code className="text-cyan-400">src/app/api/</code>). You never need to write import statements for these:
                  </p>
                  <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 mb-4 grid grid-cols-2 gap-2">
                    <div className="text-cyan-400 text-sm font-mono">useState</div>
                    <div className="text-cyan-400 text-sm font-mono">useEffect</div>
                    <div className="text-cyan-400 text-sm font-mono">useRef</div>
                    <div className="text-cyan-400 text-sm font-mono">useMemo</div>
                    <div className="text-cyan-400 text-sm font-mono">useCallback</div>
                    <div className="text-cyan-400 text-sm font-mono">useContext</div>
                    <div className="text-cyan-400 text-sm font-mono">createContext</div>
                    <div className="text-cyan-400 text-sm font-mono">useReducer</div>
                    <div className="text-cyan-400 text-sm font-mono">useId</div>
                    <div className="text-cyan-400 text-sm font-mono">useTransition</div>
                    <div className="text-cyan-400 text-sm font-mono">useDeferredValue</div>
                    <div className="text-cyan-400 text-sm font-mono">Link</div>
                    <div className="text-cyan-400 text-sm font-mono">NavLink</div>
                    <div className="text-cyan-400 text-sm font-mono">useNavigate</div>
                    <div className="text-cyan-400 text-sm font-mono">useParams</div>
                    <div className="text-cyan-400 text-sm font-mono">useLocation</div>
                    <div className="text-cyan-400 text-sm font-mono">useSearchParams</div>
                    <div className="text-cyan-400 text-sm font-mono">Outlet</div>
                    <div className="text-cyan-400 text-sm font-mono">getEnv</div>
                    <div className="text-cyan-400 text-sm font-mono">requireEnv</div>
                  </div>
                  <Callout type="tip">
                    <strong>Auto-imports:</strong> If you already import from one of these packages manually, Bini.js detects it and skips injection — no duplicates ever.
                  </Callout>
                </m.section>

                {/* MDX & Markdown Pages */}
                <m.section 
                  id="mdx-pages" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.22 }} 
                  className="scroll-mt-24"
                >
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">MDX & Markdown Pages</h2>
                  <p className="text-slate-300 mb-4">
                    Bini.js supports <code className="text-cyan-400">.mdx</code> and <code className="text-cyan-400">.md</code> files as content routes out of the box — no setup required. <code className="text-cyan-400">@mdx-js/rollup</code> is bundled internally.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">MDX Page Example</h3>
                  <CodeBlock 
                    code={`---
export const metadata = {
  title: 'About',
  description: 'Learn about us',
}
---

# About us

This is regular **markdown**, rendered as JSX under the hood. You can also
drop in real components:

<button className="rounded bg-cyan-500 px-4 py-2 text-white">
  Click me
</button>

## Features

- File-based routing
- MDX & Markdown support
- Nested layouts`}
                    filename="app/about.mdx"
                  />
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">MDX with Imports</h3>
                  <CodeBlock 
                    code={`import { Button } from '@/components/Button'

export const metadata = {
  title: 'Blog Post',
}

# My Blog Post

<Button>Click me</Button>`}
                    filename="app/blog/[slug].mdx"
                  />
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Flat File MDX Routes</h3>
                  <FileStructure 
                    tree={`src/app/
├── about.mdx            → /about
├── blog/
│   ├── page.tsx         → /blog
│   └── [slug].mdx       → /blog/:slug
└── contact.md           → /contact`}
                  />
                  
                  <p className="text-slate-300 mt-4">
                    Both <code className="text-cyan-400">.mdx</code> and <code className="text-cyan-400">.md</code> are compiled through the same MDX pipeline (full JSX/import/export support in both). Auto-imports apply to MDX files the same as any other page.
                  </p>
                  
                  <Callout type="info">
                    <strong>Note:</strong> <code>layout.tsx</code>, <code>not-found.tsx</code>, <code>loading.tsx</code>, and <code>error.tsx</code> must stay <code>.tsx</code>/<code>.jsx</code> — they define app structure rather than content.
                  </Callout>
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Extension Priority</h3>
                  <p className="text-slate-300 mb-4">
                    When multiple files share the same base name (e.g., both <code className="text-cyan-400">page.tsx</code> and <code className="text-cyan-400">page.mdx</code> exist in the same folder):
                  </p>
                  <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 mb-4">
                    <code className="text-cyan-400 text-sm">
                      .tsx &gt; .jsx &gt; .ts &gt; .js &gt; .mdx &gt; .md
                    </code>
                  </div>
                  <p className="text-slate-300">
                    The higher-priority file wins; the lower-priority one is simply ignored for that route.
                  </p>
                </m.section>

                {/* layout.tsx */}
                <m.section 
                  id="layout-file" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.25 }} 
                  className="scroll-mt-24"
                >
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">layout.tsx / layout.jsx</h2>
                  <p className="text-slate-300 mb-4">
                    Layouts wrap pages and other layouts, providing shared UI that persists across navigation. All layouts are rendered as React Router <code className="text-cyan-400">&lt;Route element&gt;</code> wrappers using <code className="text-cyan-400">&lt;Outlet /&gt;</code>.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Root Layout</h3>
                  <p className="text-slate-300 mb-4">
                    The root layout at <code className="text-cyan-400">src/app/layout.tsx</code> is <strong className="text-white">required</strong>. It wraps all pages in your application and can export metadata for the entire app.
                  </p>
                  <CodeBlock 
                    code={`// src/app/layout.tsx
export const metadata = {
  title: 'My App',
  description: 'Built with Bini.js',
}

export default function RootLayout() {
  return <Outlet />
}`}
                    filename="app/layout.tsx"
                  />
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Nested Layout</h3>
                  <p className="text-slate-300 mb-4">
                    Create layouts for specific sections by adding <code className="text-cyan-400">layout.tsx</code> in subdirectories.
                  </p>
                  <CodeBlock 
                    code={`// src/app/dashboard/layout.tsx
export const metadata = {
  title: 'Dashboard',
}

export default function DashboardLayout() {
  return (
    <div className="dashboard">
      <aside>Sidebar</aside>
      <main><Outlet /></main>
    </div>
  )
}`}
                    filename="app/dashboard/layout.tsx"
                  />
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Layout Nesting</h3>
                  <FileStructure 
                    tree={`src/app/
├── layout.tsx            ← Wraps everything
├── page.tsx              → /
└── dashboard/
    ├── layout.tsx        ← Wraps /dashboard/*
    ├── page.tsx          → /dashboard
    └── settings/
        └── page.tsx      → /dashboard/settings`}
                  />
                  <p className="text-slate-300 mt-4">
                    The root layout wraps the dashboard layout, which wraps the settings page.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Layout Metadata</h3>
                  <p className="text-slate-300 mb-4">
                    Export <code className="text-cyan-400">metadata</code> from any layout. Root layout metadata is injected into <code className="text-cyan-400">index.html</code> at build time. Nested layout titles update <code className="text-cyan-400">document.title</code> at runtime.
                  </p>
                  <CodeBlock 
                    code={`export const metadata = {
  title: 'Dashboard',
  description: 'Your personal dashboard',
  viewport: 'width=device-width, initial-scale=1.0',
  themeColor: '#00CFFF',
  charset: 'UTF-8',
  robots: 'index, follow',
  manifest: '/site.webmanifest',
  keywords: ['react', 'vite', 'dashboard'],
  authors: [{ name: 'Your Name' }],
  canonical: 'https://myapp.com/dashboard',
  openGraph: {
    title: 'Dashboard',
    description: 'Your personal dashboard',
    url: 'https://myapp.com/dashboard',
    type: 'website',
    images: [{ url: '/og.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dashboard',
    description: 'Your personal dashboard',
    creator: '@yourhandle',
    images: ['/og.png'],
  },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    shortcut: [{ url: '/favicon.png' }],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
}`}
                    filename="app/dashboard/layout.tsx"
                  />
                </m.section>

                {/* loading.tsx */}
                <m.section 
                  id="loading-file" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.3 }} 
                  className="scroll-mt-24"
                >
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">loading.tsx / loading.jsx</h2>
                  <p className="text-slate-300 mb-4">
                    The <code className="text-cyan-400">loading.tsx</code> file provides a loading UI while page content is being loaded. It wraps the page in a Suspense boundary.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Global Loading</h3>
                  <CodeBlock 
                    code={`// src/app/loading.tsx
export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-cyan-500" />
    </div>
  )
}`}
                    filename="app/loading.tsx"
                  />
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Route-Specific Loading</h3>
                  <CodeBlock 
                    code={`// src/app/dashboard/loading.tsx
export default function DashboardLoading() {
  return (
    <div className="p-6">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-slate-700 rounded w-1/4" />
        <div className="h-32 bg-slate-700 rounded" />
        <div className="h-32 bg-slate-700 rounded" />
      </div>
    </div>
  )
}`}
                    filename="app/dashboard/loading.tsx"
                  />
                  
                  <p className="text-slate-300 mt-4">
                    The loading UI is shown immediately on navigation while the page content streams in. If no <code className="text-cyan-400">loading.tsx</code> exists, a built-in dark-mode-aware spinner is used automatically.
                  </p>
                </m.section>

                {/* error.tsx */}
                <m.section 
                  id="error-file" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.32 }} 
                  className="scroll-mt-24"
                >
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">error.tsx / error.jsx</h2>
                  <p className="text-slate-300 mb-4">
                    The <code className="text-cyan-400">error.tsx</code> file catches errors thrown anywhere in a route or its children. It wraps the route and its children in an Error Boundary.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Error Component</h3>
                  <CodeBlock 
                    code={`// src/app/dashboard/error.tsx
export default function DashboardError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-white mb-2">Something went wrong!</h2>
      <p className="text-red-400 mb-4">{error.message}</p>
      <button 
        onClick={reset}
        className="px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition-colors"
      >
        Try again
      </button>
    </div>
  )
}`}
                    filename="app/dashboard/error.tsx"
                  />
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Error Props</h3>
                  <p className="text-slate-300 mb-4">
                    Your <code className="text-cyan-400">error.tsx</code> component receives two props:
                  </p>
                  <ul className="space-y-2 text-slate-300 mb-4 list-disc list-inside">
                    <li><code className="text-cyan-400">error</code> — The thrown Error object with message and stack trace</li>
                    <li><code className="text-cyan-400">reset</code> — A function that clears the error state and re-renders children</li>
                  </ul>
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Folder-Scoped Errors</h3>
                  <p className="text-slate-300 mb-4">
                    Place <code className="text-cyan-400">error.tsx</code> in any folder to catch errors only for that route and its children:
                  </p>
                  <FileStructure 
                    tree={`src/app/
├── layout.tsx
├── page.tsx
├── dashboard/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── error.tsx          ← Only catches errors in /dashboard/*
│   └── settings/
│       └── page.tsx       ← Also wrapped by dashboard/error.tsx
└── blog/
    ├── page.tsx
    └── error.tsx           ← Only catches errors in /blog/*`}
                  />
                  
                  <Callout type="info">
                    <strong>Dev vs Production:</strong> In development, errors are also dispatched as a <code>__bini_error__</code> CustomEvent on window. In production, generic "Something went wrong" UI is shown if no error.tsx exists.
                  </Callout>
                </m.section>

                {/* not-found.tsx */}
                <m.section 
                  id="not-found-file" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.35 }} 
                  className="scroll-mt-24"
                >
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">not-found.tsx / not-found.jsx</h2>
                  <p className="text-slate-300 mb-4">
                    The <code className="text-cyan-400">not-found.tsx</code> file defines a custom 404 page for unmatched routes.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Custom 404 Page</h3>
                  <CodeBlock 
                    code={`// src/app/not-found.tsx
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-6xl font-bold text-white mb-4">404</h1>
      <p className="text-slate-400 mb-8">Page not found</p>
      <Link to="/" className="px-6 py-3 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition-colors">
        Return Home
      </Link>
    </div>
  )
}`}
                    filename="app/not-found.tsx"
                  />
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Programmatic 404</h3>
                  <p className="text-slate-300 mb-4">
                    You can also trigger the 404 page programmatically:
                  </p>
                  <CodeBlock 
                    code={`// src/app/blog/[slug]/page.tsx
export default function BlogPost() {
  const { slug } = useParams()
  const post = getPost(slug)
  
  if (!post) {
    return <NotFound />
  }
  
  return <article>{post.content}</article>
}`}
                  />
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Scoped Not Found</h3>
                  <CodeBlock 
                    code={`// src/app/blog/not-found.tsx
export default function BlogNotFound() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Post not found</h1>
      <p className="text-slate-400">The blog post you're looking for doesn't exist.</p>
      <Link to="/blog" className="text-cyan-400 hover:underline">
        ← Back to blog
      </Link>
    </div>
  )
}`}
                    filename="app/blog/not-found.tsx"
                  />
                </m.section>

                {/* Nearest Wins Resolution */}
                <m.section 
                  id="nearest-wins" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.38 }} 
                  className="scroll-mt-24"
                >
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Nearest Wins Resolution</h2>
                  <p className="text-slate-300 mb-4">
                    <code className="text-cyan-400">loading.tsx</code>, <code className="text-cyan-400">not-found.tsx</code>, and <code className="text-cyan-400">error.tsx</code> all use <strong className="text-white">"nearest wins"</strong> resolution — a file in a subfolder only affects that subfolder and shadows (without deleting) the same file in any ancestor folder.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">How It Works</h3>
                  <ul className="space-y-2 text-slate-300 mb-4 list-disc list-inside">
                    <li>A file in a subfolder only affects routes inside that subfolder</li>
                    <li>It shadows (but doesn't delete) the same file in ancestor folders</li>
                    <li>Routes without a closer match fall through to the nearest ancestor</li>
                    <li>Built-in defaults apply if nothing exists anywhere</li>
                  </ul>
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Example Structure</h3>
                  <FileStructure 
                    tree={`src/app/
├── layout.tsx
├── page.tsx
├── loading.tsx              ← Default loading for all routes
├── not-found.tsx            ← Default 404 for all routes
├── error.tsx                ← Default error for all routes
├── dashboard/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── loading.tsx          ← Only affects /dashboard/*
│   ├── error.tsx            ← Only affects /dashboard/*
│   └── settings/
│       └── page.tsx         ← Uses dashboard/loading.tsx and dashboard/error.tsx
└── blog/
    ├── page.tsx
    ├── loading.tsx          ← Only affects /blog/*
    └── [slug]/
        └── page.tsx         ← Uses blog/loading.tsx`}
                  />
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Resolution Flow</h3>
                  <p className="text-slate-300 mb-4">
                    When a route needs a boundary file (loading, error, or not-found):
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-slate-300 mb-4">
                    <li>Check the route's own folder first</li>
                    <li>If not found, check each parent folder (going up)</li>
                    <li>If still not found, use the built-in default</li>
                  </ol>
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Built-in Defaults</h3>
                  <ul className="space-y-2 text-slate-300 mb-4 list-disc list-inside">
                    <li><strong className="text-white">Loading:</strong> Built-in dark-mode-aware spinner</li>
                    <li><strong className="text-white">Error:</strong> <code className="text-cyan-400">null</code> in dev (Vite overlay takes over), generic "Something went wrong" in production</li>
                    <li><strong className="text-white">Not Found:</strong> Built-in 404 page</li>
                  </ul>
                </m.section>

                {/* File Combinations */}
                <m.section 
                  id="file-combinations" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.4 }} 
                  className="scroll-mt-24"
                >
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">File Combinations</h2>
                  <p className="text-slate-300 mb-4">
                    Special files can be combined in the same folder to create rich route behavior:
                  </p>
                  <FileStructure 
                    tree={`src/app/dashboard/
├── layout.tsx            ← Shared layout for all dashboard pages
├── loading.tsx           ← Loading UI for dashboard
├── error.tsx             ← Error UI for dashboard
├── page.tsx              ← Dashboard home
├── settings/
│   ├── page.tsx          ← Settings page (inherits layout, loading, error)
│   └── loading.tsx       ← Override loading UI just for settings
└── profile/
    ├── layout.tsx        ← Additional nested layout for profile
    └── page.tsx          ← Profile page`}
                  />
                  
                  <Table 
                    headers={['Route', 'Files Used']}
                    rows={[
                      ['/dashboard', 'layout.tsx + loading.tsx + error.tsx + page.tsx'],
                      ['/dashboard/settings', 'layout.tsx + loading.tsx (from settings) + error.tsx (from dashboard) + page.tsx'],
                      ['/dashboard/profile', 'layout.tsx + profile/layout.tsx + loading.tsx + error.tsx + page.tsx'],
                    ]}
                  />
                </m.section>

                {/* File Priority */}
                <m.section 
                  id="file-priority" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.45 }} 
                  className="scroll-mt-24"
                >
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">File Priority</h2>
                  <p className="text-slate-300 mb-4">
                    When multiple files could apply to a route, they are resolved in this order (from outermost to innermost):
                  </p>
                  <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 mb-6">
                    <ol className="list-decimal list-inside space-y-2 text-slate-300">
                      <li>Root <code className="text-cyan-400">layout.tsx</code></li>
                      <li>Nested <code className="text-cyan-400">layout.tsx</code> files (from root to leaf)</li>
                      <li><code className="text-cyan-400">loading.tsx</code> (closest to the page)</li>
                      <li><code className="text-cyan-400">error.tsx</code> (closest to the page)</li>
                      <li><code className="text-cyan-400">not-found.tsx</code> (if triggered)</li>
                      <li><code className="text-cyan-400">page.tsx</code> or <code className="text-cyan-400">page.mdx</code></li>
                    </ol>
                  </div>
                </m.section>

                {/* Dynamic Routes */}
                <m.section 
                  id="dynamic-routes" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.48 }} 
                  className="scroll-mt-24"
                >
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Dynamic Routes</h2>
                  <p className="text-slate-300 mb-4">
                    Create dynamic routes using <code className="text-cyan-400">[param]</code> syntax in folder or file names.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Dynamic Segment</h3>
                  <CodeBlock 
                    code={`// src/app/blog/[slug]/page.tsx
export default function BlogPost() {
  const { slug } = useParams()
  
  return (
    <article>
      <h1 className="text-3xl font-bold text-white">Post: {slug}</h1>
    </article>
  )
}`}
                    filename="app/blog/[slug]/page.tsx"
                  />
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Flat File Dynamic Routes</h3>
                  <FileStructure 
                    tree={`src/app/
├── blog/
│   └── [slug].tsx        → /blog/:slug
├── user/
│   └── [id].tsx          → /user/:id
└── product/
    └── [sku].tsx         → /product/:sku`}
                  />
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Using Params</h3>
                  <CodeBlock 
                    code={`// src/app/user/[id]/page.tsx
export default function UserProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  
  useEffect(() => {
    fetchUser(id).then(setUser)
  }, [id])
  
  if (!user) return <Loading />
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-white">{user.name}</h1>
      <p className="text-slate-400">{user.email}</p>
    </div>
  )
}`}
                    filename="app/user/[id]/page.tsx"
                  />
                </m.section>

                {/* Catch-All Routes */}
                <m.section 
                  id="catch-all-routes" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.5 }} 
                  className="scroll-mt-24"
                >
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Catch-All Routes</h2>
                  <p className="text-slate-300 mb-4">
                    Use <code className="text-cyan-400">[...param]</code> syntax to match multiple path segments.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Catch-All Example</h3>
                  <CodeBlock 
                    code={`// src/app/docs/[...path]/page.tsx
export default function DocsPage() {
  const { path } = useParams()
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Documentation</h1>
      <p className="text-slate-400">Path: {path}</p>
      <ul>
        <li>Matches /docs/guide</li>
        <li>Matches /docs/guide/setup</li>
        <li>Matches /docs/guide/setup/advanced</li>
      </ul>
    </div>
  )
}`}
                    filename="app/docs/[...path]/page.tsx"
                  />
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Route Priority</h3>
                  <p className="text-slate-300 mb-4">
                    Routes are matched in this order:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-slate-300 mb-4">
                    <li>Static routes (e.g., <code className="text-cyan-400">/about</code>)</li>
                    <li>Dynamic routes (e.g., <code className="text-cyan-400">/blog/:slug</code>)</li>
                    <li>Catch-all routes (e.g., <code className="text-cyan-400">/docs/*</code>)</li>
                  </ol>
                  <p className="text-slate-300">
                    Routes are sorted by priority and then by path length (shortest first).
                  </p>
                </m.section>

                {/* API Routes */}
                <m.section 
                  id="api-routes" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.52 }} 
                  className="scroll-mt-24"
                >
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">API Routes</h2>
                  <p className="text-slate-300 mb-4">
                    Write your API files in <code className="text-cyan-400">src/app/api/</code>. Handlers can be either a <code className="text-cyan-400">.fetch(request)</code>-style app or a plain function handler.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Hono App (Recommended)</h3>
                  <CodeBlock 
                    code={`// src/app/api/hello.ts
import { Hono } from 'hono'

const app = new Hono()

app.get('/hello', (c) => {
  return c.json({
    message: 'Hello from Bini.js!',
    timestamp: new Date().toISOString(),
    method: c.req.method,
  })
})

export default app`}
                    filename="app/api/hello.ts"
                  />
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Plain Function Handler</h3>
                  <CodeBlock 
                    code={`// src/app/api/users.ts
export default function handler(req: Request) {
  return Response.json({
    users: [
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
    ],
    method: req.method,
  })
}`}
                    filename="app/api/users.ts"
                  />
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Dynamic API Routes</h3>
                  <CodeBlock 
                    code={`// src/app/api/users/[id].ts
import { Hono } from 'hono'

const app = new Hono()

app.get('/users/:id', (c) => {
  const { id } = c.req.param()
  return c.json({ id, name: \`User \${id}\` })
})

app.put('/users/:id', async (c) => {
  const { id } = c.req.param()
  const body = await c.req.json()
  return c.json({ id, updated: body })
})

export default app`}
                    filename="app/api/users/[id].ts"
                  />
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">API Route Structure</h3>
                  <FileStructure 
                    tree={`src/app/api/
├── hello.ts             → /api/hello
├── users/
│   ├── index.ts         → /api/users
│   └── [id].ts          → /api/users/:id
└── posts/
    ├── index.ts         → /api/posts
    └── [...slug].ts     → /api/posts/*`}
                  />
                  
                  <Callout type="tip">
                    <strong>Note:</strong> Write routes without the <code>/api</code> prefix — Bini.js strips it before your handler sees the request. Requires <code>npm install hono</code> if you choose the Hono style.
                  </Callout>
                </m.section>

                {/* Complete Example */}
                <m.section 
                  id="complete-example" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.55 }} 
                  className="scroll-mt-24"
                >
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Complete Example</h2>
                  <p className="text-slate-300 mb-4">
                    Here's a comprehensive file structure showing all special files:
                  </p>
                  <FileStructure 
                    tree={`src/app/
├── layout.tsx                 ← Root layout (required)
├── page.tsx                   → /
├── loading.tsx                ← Global loading UI
├── error.tsx                  ← Global error UI
├── not-found.tsx              ← Global 404 page
├── about.mdx                  → /about (MDX page)
├── contact.md                 → /contact (Markdown page)
├── blog/
│   ├── layout.tsx             ← Blog layout
│   ├── page.tsx               → /blog
│   ├── loading.tsx            ← Blog loading UI
│   ├── error.tsx              ← Blog error UI
│   ├── [slug]/
│   │   └── page.tsx           → /blog/:slug
│   └── _components/           ← Private folder (not routable)
│       └── PostCard.tsx
├── dashboard/
│   ├── layout.tsx             ← Dashboard layout
│   ├── page.tsx               → /dashboard
│   ├── loading.tsx            ← Dashboard loading UI
│   ├── error.tsx              ← Dashboard error UI
│   ├── settings/
│   │   └── page.tsx           → /dashboard/settings
│   └── profile/
│       ├── layout.tsx         ← Nested profile layout
│       └── page.tsx           → /dashboard/profile
├── api/                       ← API routes
│   ├── hello.ts               → /api/hello
│   └── users/
│       ├── index.ts           → /api/users
│       └── [id].ts            → /api/users/:id
└── docs/
    └── [...path]/
        └── page.tsx           → /docs/* (catch-all)`}
                  />
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Route Mapping</h3>
                  <Table 
                    headers={['File Path', 'URL', 'Type']}
                    rows={[
                      ['app/page.tsx', '/', 'Static'],
                      ['app/about.mdx', '/about', 'MDX Page'],
                      ['app/blog/page.tsx', '/blog', 'Static'],
                      ['app/blog/[slug]/page.tsx', '/blog/:slug', 'Dynamic'],
                      ['app/dashboard/page.tsx', '/dashboard', 'Static'],
                      ['app/dashboard/settings/page.tsx', '/dashboard/settings', 'Static'],
                      ['app/dashboard/profile/page.tsx', '/dashboard/profile', 'Static'],
                      ['app/docs/[...path]/page.tsx', '/docs/*', 'Catch-all'],
                      ['app/api/hello.ts', '/api/hello', 'API'],
                      ['app/api/users/[id].ts', '/api/users/:id', 'API Dynamic'],
                    ]}
                  />
                </m.section>

                {/* Previous / Next Navigation */}
                <m.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.6 }} 
                  className="flex items-center justify-between pt-8 mt-8 border-t border-slate-800"
                >
                  <Link to="/docs/getting-started" className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <div>
                      <div className="text-xs text-slate-500">Previous</div>
                      <div className="text-sm font-medium">Getting Started</div>
                    </div>
                  </Link>
                  <Link to="/docs/dynamic-routes" className="group flex items-center gap-2 text-right text-slate-400 hover:text-white transition-colors">
                    <div>
                      <div className="text-xs text-slate-500">Next</div>
                      <div className="text-sm font-medium">Dynamic Routes</div>
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