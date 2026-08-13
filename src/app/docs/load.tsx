// src/pages/docs/loading/page.tsx
import React from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
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
  { id: 'how-it-works', label: 'How it Works' },
  { id: 'global-loading', label: 'Global Loading UI' },
  { id: 'nested-loading', label: 'Nested Loading UI' },
  { id: 'skeleton-examples', label: 'Skeleton Examples' },
  { id: 'loading-with-layout', label: 'Loading with Layout' },
  { id: 'custom-spinners', label: 'Custom Spinners' },
  { id: 'built-in-fallback', label: 'Built-in Fallback' },
]

const PAGE_TITLE = 'Loading UI'
const PAGE_URL = 'https://bini.js.org/docs/load'
const EDIT_URL = 'https://github.com/Binidu01/bini-offical/edit/main/src/app/docs/load.tsx'

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
function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
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
// Loading UI Page
// ────────────────────────────────────────────────────────────────────────────────
export default function LoadingPage() {
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
                    <p className="text-slate-400 text-sm">Learn how to create custom loading states with loading.tsx for a better user experience.</p>
                  </div>
                  <div className="shrink-0 pt-2 hidden sm:block">
                    <CopyPageButton pageUrl={PAGE_URL} pageTitle={PAGE_TITLE} />
                  </div>
                </motion.div>
                {/* Copy button on small screens */}
                <div className="sm:hidden mb-8">
                  <CopyPageButton pageUrl={PAGE_URL} pageTitle={PAGE_TITLE} />
                </div>

                {/* Overview */}
                <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <p className="text-slate-300 mb-6">
                    Bini.js provides a built-in loading spinner, but you can create custom <code className="text-cyan-400">loading.tsx</code> files to show your own loading UI while page content loads.
                  </p>
                </motion.section>

                {/* How it Works */}
                <motion.section id="how-it-works" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">How it Works</h2>
                  <p className="text-slate-300 mb-4">
                    The <code className="text-cyan-400">loading.tsx</code> file automatically wraps the page in a Suspense boundary. The loading UI is shown immediately on navigation while the page content streams in.
                  </p>
                  <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 mb-6">
                    <ol className="list-decimal list-inside space-y-2 text-slate-300">
                      <li>User clicks a link or navigates to a route</li>
                      <li>Loading UI appears instantly</li>
                      <li>Page content loads in the background</li>
                      <li>Once ready, the loading UI is replaced with the actual page</li>
                    </ol>
                  </div>
                </motion.section>

                {/* Global Loading */}
                <motion.section id="global-loading" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Global Loading UI</h2>
                  <p className="text-slate-300 mb-4">
                    Create a <code className="text-cyan-400">loading.tsx</code> file in the root of your <code className="text-cyan-400">app</code> directory to show a loading state for all routes.
                  </p>
                  <CodeBlock 
                    code={`src/app/
├── layout.tsx
├── page.tsx
└── loading.tsx           ← Global loading UI`}
                  />
                  <CodeBlock 
                    code={`// src/app/loading.tsx
export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500" />
    </div>
  )
}`}
                    filename="app/loading.tsx"
                  />
                </motion.section>

                {/* Nested Loading UI */}
                <motion.section id="nested-loading" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Nested Loading UI</h2>
                  <p className="text-slate-300 mb-4">
                    You can create route-specific loading states by placing <code className="text-cyan-400">loading.tsx</code> in subdirectories. The closest loading file to the page being navigated to will be used.
                  </p>
                  <CodeBlock 
                    code={`src/app/
├── loading.tsx               ← Global loading (fallback)
├── page.tsx
├── blog/
│   ├── loading.tsx           ← Blog-specific loading
│   ├── page.tsx
│   └── [slug]/
│       ├── loading.tsx       ← Post-specific loading
│       └── page.tsx
└── dashboard/
    ├── loading.tsx           ← Dashboard-specific loading
    └── page.tsx`}
                  />
                  <Table 
                    headers={['Navigation', 'Loading UI Used']}
                    rows={[
                      ['/ → /about', 'app/loading.tsx'],
                      ['/ → /blog', 'app/blog/loading.tsx'],
                      ['/ → /blog/hello-world', 'app/blog/[slug]/loading.tsx'],
                      ['/ → /dashboard', 'app/dashboard/loading.tsx'],
                    ]}
                  />
                </motion.section>

                {/* Skeleton Examples */}
                <motion.section id="skeleton-examples" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Skeleton Examples</h2>
                  <p className="text-slate-300 mb-4">
                    Skeletons provide a better user experience than spinners by showing the approximate layout of the content.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Blog Post Skeleton</h3>
                  <CodeBlock 
                    code={`// src/app/blog/[slug]/loading.tsx
export default function BlogPostLoading() {
  return (
    <article className="max-w-3xl mx-auto py-8 animate-pulse">
      {/* Title skeleton */}
      <div className="h-10 bg-slate-800 rounded w-3/4 mb-4" />
      
      {/* Meta skeleton */}
      <div className="flex gap-4 mb-8">
        <div className="h-4 bg-slate-800 rounded w-24" />
        <div className="h-4 bg-slate-800 rounded w-32" />
      </div>
      
      {/* Content skeleton */}
      <div className="space-y-3">
        <div className="h-4 bg-slate-800 rounded w-full" />
        <div className="h-4 bg-slate-800 rounded w-full" />
        <div className="h-4 bg-slate-800 rounded w-5/6" />
        <div className="h-4 bg-slate-800 rounded w-full" />
        <div className="h-4 bg-slate-800 rounded w-4/5" />
      </div>
    </article>
  )
}`}
                    filename="app/blog/[slug]/loading.tsx"
                  />
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Dashboard Skeleton</h3>
                  <CodeBlock 
                    code={`// src/app/dashboard/loading.tsx
export default function DashboardLoading() {
  return (
    <div className="flex gap-6 p-6 animate-pulse">
      {/* Sidebar skeleton */}
      <div className="w-64 space-y-3">
        <div className="h-8 bg-slate-800 rounded" />
        <div className="h-4 bg-slate-800 rounded w-3/4" />
        <div className="h-4 bg-slate-800 rounded w-2/3" />
        <div className="h-4 bg-slate-800 rounded w-4/5" />
      </div>
      
      {/* Main content skeleton */}
      <div className="flex-1 space-y-4">
        <div className="h-8 bg-slate-800 rounded w-1/3" />
        <div className="grid grid-cols-3 gap-4">
          <div className="h-24 bg-slate-800 rounded" />
          <div className="h-24 bg-slate-800 rounded" />
          <div className="h-24 bg-slate-800 rounded" />
        </div>
        <div className="h-64 bg-slate-800 rounded" />
      </div>
    </div>
  )
}`}
                    filename="app/dashboard/loading.tsx"
                  />
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Card Grid Skeleton</h3>
                  <CodeBlock 
                    code={`// src/app/products/loading.tsx
export default function ProductsLoading() {
  return (
    <div className="container mx-auto p-6">
      <div className="h-8 bg-slate-800 rounded w-48 mb-6 animate-pulse" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-48 bg-slate-800 rounded-lg mb-3" />
            <div className="h-4 bg-slate-800 rounded w-3/4 mb-2" />
            <div className="h-4 bg-slate-800 rounded w-1/2" />
          </div>
        ))}
      </div>
    </div>
  )
}`}
                    filename="app/products/loading.tsx"
                  />
                </motion.section>

                {/* Loading with Layout */}
                <motion.section id="loading-with-layout" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Loading with Layout</h2>
                  <p className="text-slate-300 mb-4">
                    Loading UI is shown inside the layout hierarchy. Layouts remain visible and interactive while the page loads.
                  </p>
                  <CodeBlock 
                    code={`src/app/
├── layout.tsx                 ← Root layout (always visible)
├── loading.tsx                ← Global loading (shown inside layout)
└── blog/
    ├── layout.tsx             ← Blog layout (always visible)
    ├── loading.tsx            ← Blog loading (shown inside blog layout)
    └── page.tsx`}
                  />
                  <p className="text-slate-300 mt-4">
                    This means headers, sidebars, and navigation remain usable while the main content loads.
                  </p>
                  <CodeBlock 
                    code={`// src/app/blog/layout.tsx
export default function BlogLayout() {
  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold">Blog</h1>
        <nav>{/* Navigation links */}</nav>
      </header>
      <main>
        <Outlet />  {/* This will be either loading.tsx or page.tsx */}
      </main>
    </div>
  )
}`}
                    filename="app/blog/layout.tsx"
                  />
                </motion.section>

                {/* Custom Spinners */}
                <motion.section id="custom-spinners" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Custom Spinners</h2>
                  <p className="text-slate-300 mb-4">
                    Create branded spinners that match your design system:
                  </p>
                  <CodeBlock 
                    code={`// src/app/loading.tsx
export default function Loading() {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-slate-900 p-8 rounded-2xl shadow-2xl">
        <svg className="animate-spin h-10 w-10 text-cyan-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-slate-400 text-sm mt-3 text-center">Loading...</p>
      </div>
    </div>
  )
}`}
                    filename="app/loading.tsx"
                  />
                  <CodeBlock 
                    code={`// Alternative: Minimal spinner
export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce" />
        <div className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.15s]" />
        <div className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.3s]" />
      </div>
    </div>
  )
}`}
                  />
                </motion.section>

                {/* Built-in Fallback */}
                <motion.section id="built-in-fallback" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Built-in Fallback</h2>
                  <p className="text-slate-300 mb-4">
                    If you don't create a <code className="text-cyan-400">loading.tsx</code> file, Bini.js uses a built-in spinner:
                  </p>
                  <ul className="space-y-2 text-slate-300 mb-6 list-disc list-inside">
                    <li>Dark mode aware — adapts to your theme</li>
                    <li>Centered on the screen</li>
                    <li>Clean, minimal design</li>
                    <li>Automatically used when no custom loading UI exists</li>
                  </ul>
                  <p className="text-slate-300">
                    The built-in spinner is a good starting point, but creating custom loading UI is recommended for production applications.
                  </p>
                </motion.section>

                {/* Best Practices */}
                <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Best Practices</h2>
                  <ul className="space-y-3 text-slate-300 mb-6">
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span><strong className="text-white">Use skeletons for content-heavy pages</strong> — They provide better UX than spinners.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span><strong className="text-white">Create nested loading states</strong> — Different sections can have different loading UIs.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span><strong className="text-white">Keep loading UI lightweight</strong> — Fast to render and minimal DOM impact.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span><strong className="text-white">Use animations sparingly</strong> — Too much animation can be distracting.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span><strong className="text-white">Match your brand</strong> — Use your brand colors and design language.</span>
                    </li>
                  </ul>
                </motion.section>

                {/* Previous / Next Navigation */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="flex items-center justify-between pt-8 mt-8 border-t border-slate-800">
                  <Link to="/docs/mdx-markdown" className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <div>
                      <div className="text-xs text-slate-500">Previous</div>
                      <div className="text-sm font-medium">MDX & Markdown Pages</div>
                    </div>
                  </Link>
                  <Link to="/docs/error-boundaries" className="group flex items-center gap-2 text-right text-slate-400 hover:text-white transition-colors">
                    <div>
                      <div className="text-xs text-slate-500">Next</div>
                      <div className="text-sm font-medium">Error Boundaries</div>
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