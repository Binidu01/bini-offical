// src/pages/docs/error-boundaries/page.tsx
import React from 'react'
import { m } from 'framer-motion'
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
  { id: 'what-are-error-boundaries', label: 'What are Error Boundaries?' },
  { id: 'creating-error-boundary', label: 'Creating an Error Boundary' },
  { id: 'error-props', label: 'Error Props' },
  { id: 'nested-error-boundaries', label: 'Nested Error Boundaries' },
  { id: 'nearest-wins', label: 'Nearest Wins Resolution' },
  { id: 'error-with-layout', label: 'Error with Layout' },
  { id: 'built-in-fallback', label: 'Built-in Fallback' },
]

const PAGE_TITLE = 'Error Boundaries'
const PAGE_URL = 'https://bini.js.org/docs/error-boundaries'
const EDIT_URL = 'https://github.com/Binidu01/bini-offical/edit/main/src/app/docs/error-boundaries.tsx'

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
// Error Boundaries Page
// ────────────────────────────────────────────────────────────────────────────────
export default function ErrorBoundariesPage() {
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
                    <p className="text-slate-400 text-sm">Learn how to handle errors gracefully with error boundaries in Bini.js.</p>
                  </div>
                  <div className="shrink-0 pt-2 hidden sm:block">
                    <CopyPageButton pageUrl={PAGE_URL} pageTitle={PAGE_TITLE} />
                  </div>
                </m.div>
                {/* Copy button on small screens */}
                <div className="sm:hidden mb-8">
                  <CopyPageButton pageUrl={PAGE_URL} pageTitle={PAGE_TITLE} />
                </div>

                {/* What are Error Boundaries? */}
                <m.section id="what-are-error-boundaries" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">What are Error Boundaries?</h2>
                  <p className="text-slate-300 mb-4">
                    Error boundaries are React components that catch JavaScript errors in their child component tree, log those errors, and display a fallback UI instead of the component tree that crashed. In Bini.js, you can create error boundaries using the <code className="text-cyan-400">error.tsx</code> file.
                  </p>
                  <p className="text-slate-300 mb-4">
                    Error boundaries catch errors during rendering, in lifecycle methods, and in constructors of the whole tree below them.
                  </p>
                </m.section>

                {/* Creating an Error Boundary */}
                <m.section id="creating-error-boundary" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Creating an Error Boundary</h2>
                  <p className="text-slate-300 mb-4">
                    Create an <code className="text-cyan-400">error.tsx</code> file in any folder to define an error boundary for that route and its children.
                  </p>
                  <CodeBlock 
                    code={`src/app/
├── layout.tsx
├── page.tsx
└── dashboard/
    ├── layout.tsx
    ├── page.tsx
    └── error.tsx           ← Error boundary for /dashboard/*`}
                  />
                  <CodeBlock 
                    code={`// src/app/dashboard/error.tsx
export default function DashboardError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
        <p className="text-red-400 mb-4">{error.message}</p>
        <button 
          onClick={reset}
          className="px-4 py-2 bg-cyan-500 text-black font-medium rounded-lg hover:bg-cyan-400 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  )
}`}
                    filename="app/dashboard/error.tsx"
                  />
                </m.section>

                {/* Error Props */}
                <m.section id="error-props" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Error Props</h2>
                  <p className="text-slate-300 mb-4">
                    The <code className="text-cyan-400">error.tsx</code> component receives two props:
                  </p>
                  <Table 
                    headers={['Prop', 'Type', 'Description']}
                    rows={[
                      ['error', 'Error', 'The thrown Error object with message and stack trace'],
                      ['reset', '() => void', 'A function that clears the error state and re-renders children'],
                    ]}
                  />
                  <CodeBlock 
                    code={`// src/app/dashboard/error.tsx
export default function DashboardError({ 
  error, 
  reset 
}: { 
  error: Error; 
  reset: () => void 
}) {
  // Log the error to your error reporting service
  console.error('Dashboard error:', error)
  
  return (
    <div>
      <h2>Something went wrong!</h2>
      <details className="mt-4 p-4 bg-slate-800 rounded">
        <summary className="cursor-pointer text-slate-300">Error details</summary>
        <pre className="mt-2 text-xs text-red-400 whitespace-pre-wrap">
          {error.stack}
        </pre>
      </details>
      <button 
        onClick={reset}
        className="mt-4 px-4 py-2 bg-cyan-500 text-black rounded"
      >
        Try again
      </button>
    </div>
  )
}`}
                    filename="app/dashboard/error.tsx"
                  />
                </m.section>

                {/* Nested Error Boundaries */}
                <m.section id="nested-error-boundaries" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Nested Error Boundaries</h2>
                  <p className="text-slate-300 mb-4">
                    You can create nested error boundaries by placing <code className="text-cyan-400">error.tsx</code> in subdirectories. Each error boundary only catches errors in its subtree.
                  </p>
                  <CodeBlock 
                    code={`src/app/
├── error.tsx                 ← Global error boundary (fallback)
├── layout.tsx
├── page.tsx
├── blog/
│   ├── error.tsx             ← Blog error boundary
│   ├── page.tsx
│   └── [slug]/
│       └── page.tsx
└── dashboard/
    ├── error.tsx             ← Dashboard error boundary
    ├── page.tsx
    └── settings/
        ├── error.tsx         ← Settings error boundary
        └── page.tsx`}
                  />
                  <Table 
                    headers={['Route', 'Error Boundary Used']}
                    rows={[
                      ['/blog/hello-world', 'app/blog/error.tsx'],
                      ['/dashboard', 'app/dashboard/error.tsx'],
                      ['/dashboard/settings', 'app/dashboard/settings/error.tsx'],
                      ['/about', 'app/error.tsx (global)'],
                    ]}
                  />
                </m.section>

                {/* Nearest Wins Resolution */}
                <m.section id="nearest-wins" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Nearest Wins Resolution</h2>
                  <p className="text-slate-300 mb-4">
                    Error boundaries use <strong className="text-white">"nearest wins"</strong> resolution. The closest <code className="text-cyan-400">error.tsx</code> to the route where the error occurred is used.
                  </p>
                  <CodeBlock 
                    code={`src/app/
├── error.tsx                 ← Fallback for any error not caught below
├── layout.tsx
├── page.tsx
├── blog/
│   ├── error.tsx             ← Catches errors in /blog/*
│   ├── page.tsx
│   └── [slug]/
│       ├── error.tsx         ← Catches errors in /blog/:slug
│       └── page.tsx
└── dashboard/
    ├── error.tsx             ← Catches errors in /dashboard/*
    └── page.tsx`}
                  />
                  <p className="text-slate-300 mt-4">
                    When an error occurs:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-slate-300 mb-4">
                    <li>Check the route's own folder for <code className="text-cyan-400">error.tsx</code></li>
                    <li>If not found, check each parent folder (going up)</li>
                    <li>If still not found, use the built-in fallback</li>
                  </ol>
                </m.section>

                {/* Error with Layout */}
                <m.section id="error-with-layout" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Error with Layout</h2>
                  <p className="text-slate-300 mb-4">
                    Error boundaries are rendered inside the layout hierarchy. Layouts remain visible when an error occurs in a child route.
                  </p>
                  <CodeBlock 
                    code={`src/app/
├── layout.tsx                 ← Root layout (always visible)
├── error.tsx                  ← Global error (shown inside root layout)
└── blog/
    ├── layout.tsx             ← Blog layout (always visible)
    ├── error.tsx              ← Blog error (shown inside blog layout)
    └── page.tsx`}
                  />
                  <p className="text-slate-300 mt-4">
                    This allows you to keep navigation, headers, and sidebars visible even when an error occurs in the main content area.
                  </p>
                </m.section>

                {/* Built-in Fallback */}
                <m.section id="built-in-fallback" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Built-in Fallback</h2>
                  <p className="text-slate-300 mb-4">
                    If no <code className="text-cyan-400">error.tsx</code> exists in the hierarchy, Bini.js uses a built-in fallback:
                  </p>
                  <ul className="space-y-2 text-slate-300 mb-6 list-disc list-inside">
                    <li><strong className="text-white">Development:</strong> Renders <code className="text-cyan-400">null</code> so <code className="text-cyan-400">bini-overlay</code> takes over with an animated error badge and full error panel</li>
                    <li><strong className="text-white">Production:</strong> Shows a generic "Something went wrong" UI with a "Try again" button</li>
                    <li><strong className="text-white">Error logging:</strong> Errors are dispatched as a <code className="text-cyan-400">__bini_error__</code> CustomEvent on window for external dev overlays</li>
                  </ul>
                  <p className="text-slate-300">
                    Creating custom error boundaries is recommended for production applications to provide a better user experience.
                  </p>
                </m.section>

                {/* Previous / Next Navigation */}
                <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex items-center justify-between pt-8 mt-8 border-t border-slate-800">
                  <Link to="/docs/load" className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <div>
                      <div className="text-xs text-slate-500">Previous</div>
                      <div className="text-sm font-medium">Loading UI</div>
                    </div>
                  </Link>
                  <Link to="/docs/notfound" className="group flex items-center gap-2 text-right text-slate-400 hover:text-white transition-colors">
                    <div>
                      <div className="text-xs text-slate-500">Next</div>
                      <div className="text-sm font-medium">Not Found (404)</div>
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