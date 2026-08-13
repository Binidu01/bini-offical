// src/pages/docs/not-found/page.tsx
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
  { id: 'global-404', label: 'Global 404 Page' },
  { id: 'nested-404', label: 'Nested 404 Pages' },
  { id: 'programmatic-404', label: 'Programmatic 404' },
  { id: '404-with-layout', label: '404 with Layout' },
  { id: 'styling-404', label: 'Styling 404 Pages' },
  { id: 'static-export-404', label: 'Static Export & 404' },
]

const PAGE_TITLE = '404 Page'
const PAGE_URL = 'https://bini.js.org/docs/notfound'
const EDIT_URL = 'https://github.com/Binidu01/bini-offical/edit/main/src/app/docs/notfound.tsx'

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
// 404 Page
// ────────────────────────────────────────────────────────────────────────────────
export default function NotFoundPage() {
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
                    <p className="text-slate-400 text-sm">Learn how to create custom 404 pages for unmatched routes in Bini.js.</p>
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
                    Bini.js provides a built-in 404 page, but you can create custom <code className="text-cyan-400">not-found.tsx</code> files to display your own UI when a route is not found.
                  </p>
                </motion.section>

                {/* Global 404 */}
                <motion.section id="global-404" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Global 404 Page</h2>
                  <p className="text-slate-300 mb-4">
                    Create a <code className="text-cyan-400">not-found.tsx</code> file in the root of your <code className="text-cyan-400">app</code> directory to handle all unmatched routes globally.
                  </p>
                  <CodeBlock 
                    code={`src/app/
├── layout.tsx
├── page.tsx
└── not-found.tsx         ← Global 404 page`}
                  />
                  <CodeBlock 
                    code={`// src/app/not-found.tsx
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold text-white mb-4">404</h1>
      <p className="text-slate-400 mb-6">The page you're looking for doesn't exist.</p>
      <Link to="/" className="text-cyan-400 hover:underline">
        Return Home
      </Link>
    </div>
  )
}`}
                    filename="app/not-found.tsx"
                  />
                  <p className="text-slate-300 mt-4">
                    This page will be shown for any unmatched route, such as <code className="text-cyan-400">/non-existent</code> or <code className="text-cyan-400">/blog/invalid-post</code>.
                  </p>
                </motion.section>

                {/* Nested 404 Pages */}
                <motion.section id="nested-404" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Nested 404 Pages</h2>
                  <p className="text-slate-300 mb-4">
                    You can create route-specific 404 pages by placing <code className="text-cyan-400">not-found.tsx</code> in subdirectories. The closest 404 page to the matched route will be used.
                  </p>
                  <CodeBlock 
                    code={`src/app/
├── not-found.tsx             ← Global 404 (fallback)
├── blog/
│   ├── not-found.tsx         ← Blog-specific 404
│   ├── page.tsx
│   └── [slug]/
│       └── page.tsx
└── admin/
    ├── not-found.tsx         ← Admin-specific 404
    └── page.tsx`}
                  />
                  <CodeBlock 
                    code={`// src/app/blog/not-found.tsx
export default function BlogNotFound() {
  return (
    <div className="py-12 text-center">
      <h1 className="text-3xl font-bold text-white mb-3">Post Not Found</h1>
      <p className="text-slate-400 mb-6">The blog post you're looking for doesn't exist.</p>
      <Link to="/blog" className="text-cyan-400 hover:underline">
        View all posts
      </Link>
    </div>
  )
}`}
                    filename="app/blog/not-found.tsx"
                  />
                  <Table 
                    headers={['URL', '404 Page Used']}
                    rows={[
                      ['/blog/non-existent', 'app/blog/not-found.tsx'],
                      ['/admin/invalid', 'app/admin/not-found.tsx'],
                      ['/completely/wrong', 'app/not-found.tsx (global)'],
                    ]}
                  />
                </motion.section>

                {/* Programmatic 404 */}
                <motion.section id="programmatic-404" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Programmatic 404</h2>
                  <p className="text-slate-300 mb-4">
                    You can manually trigger a 404 page from within your components when data is not found.
                  </p>
                  <CodeBlock 
                    code={`// src/app/blog/[slug]/page.tsx
export default function BlogPost() {
  const { slug } = useParams()
  
  // Fetch post data
  const post = getPost(slug)
  
  // If post doesn't exist, show 404
  if (!post) {
    return (
      <div className="py-12 text-center">
        <h1 className="text-3xl font-bold text-white mb-3">Post Not Found</h1>
        <p className="text-slate-400 mb-6">The post "{slug}" doesn't exist.</p>
        <Link to="/blog" className="text-cyan-400 hover:underline">
          View all posts
        </Link>
      </div>
    )
  }
  
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  )
}`}
                    filename="app/blog/[slug]/page.tsx"
                  />
                </motion.section>

                {/* 404 with Layout */}
                <motion.section id="404-with-layout" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">404 with Layout</h2>
                  <p className="text-slate-300 mb-4">
                    404 pages are automatically wrapped with the layout chain of the route they belong to.
                  </p>
                  <CodeBlock 
                    code={`src/app/
├── layout.tsx                 ← Root layout (wraps everything)
├── not-found.tsx              ← Global 404 (wrapped by root layout)
└── blog/
    ├── layout.tsx             ← Blog layout
    ├── not-found.tsx          ← Blog 404 (wrapped by root + blog layouts)
    └── page.tsx`}
                  />
                  <p className="text-slate-300 mt-4">
                    This means your 404 pages automatically inherit headers, footers, and other shared UI from layouts.
                  </p>
                  <CodeBlock 
                    code={`// src/app/blog/layout.tsx
export default function BlogLayout() {
  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold">Blog</h1>
      </header>
      <main><Outlet /></main>
    </div>
  )
}

// The blog/not-found.tsx will automatically have the "Blog" header!`}
                    filename="app/blog/layout.tsx"
                  />
                </motion.section>

                {/* Styling 404 Pages */}
                <motion.section id="styling-404" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Styling 404 Pages</h2>
                  <p className="text-slate-300 mb-4">
                    You can create rich, styled 404 pages with images, animations, and interactive elements:
                  </p>
                  <CodeBlock 
                    code={`// src/app/not-found.tsx
export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      {/* Animated 404 */}
      <div className="relative mb-8">
        <h1 className="text-9xl font-bold text-slate-800">404</h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl">🔍</span>
        </div>
      </div>
      
      {/* Message */}
      <h2 className="text-3xl font-bold text-white mb-3">Page Not Found</h2>
      <p className="text-slate-400 max-w-md mb-8">
        The page you're looking for might have been removed, renamed, or doesn't exist.
      </p>
      
      {/* Actions */}
      <div className="flex gap-4">
        <Link 
          to="/" 
          className="px-6 py-3 bg-cyan-500 text-black font-medium rounded-lg hover:bg-cyan-400 transition-colors"
        >
          Go Home
        </Link>
        <button 
          onClick={() => window.history.back()} 
          className="px-6 py-3 border border-slate-700 text-white font-medium rounded-lg hover:bg-slate-900 transition-colors"
        >
          Go Back
        </button>
      </div>
      
      {/* Search suggestion */}
      <p className="text-slate-500 text-sm mt-8">
        Looking for something specific? Try using the navigation menu above.
      </p>
    </div>
  )
}`}
                    filename="app/not-found.tsx"
                  />
                </motion.section>

                {/* Static Export 404 */}
                <motion.section id="static-export-404" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Static Export & 404</h2>
                  <p className="text-slate-300 mb-4">
                    When using <code className="text-cyan-400">npm run export</code> for static hosting, Bini.js generates a <code className="text-cyan-400">404.html</code> file:
                  </p>
                  <Table 
                    headers={['Situation', 'Generated 404.html']}
                    rows={[
                      ['not-found.tsx exists', 'Copy of index.html with your custom 404 page'],
                      ['No not-found.tsx', 'Redirect script that preserves the URL and redirects to /'],
                    ]}
                  />
                  <p className="text-slate-300 mt-4">
                    This ensures your SPA works correctly on static hosts like GitHub Pages, Netlify, and Vercel.
                  </p>
                </motion.section>

                {/* Previous / Next Navigation */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex items-center justify-between pt-8 mt-8 border-t border-slate-800">
                  <Link to="/docs/error-boundaries" className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <div>
                      <div className="text-xs text-slate-500">Previous</div>
                      <div className="text-sm font-medium">Error Boundaries</div>
                    </div>
                  </Link>
                  <Link to="/docs/metadata" className="group flex items-center gap-2 text-right text-slate-400 hover:text-white transition-colors">
                    <div>
                      <div className="text-xs text-slate-500">Next</div>
                      <div className="text-sm font-medium">Metadata</div>
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