// src/pages/docs/layouts-and-pages/page.tsx
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
  { id: 'creating-a-page', label: 'Creating a page' },
  { id: 'creating-a-layout', label: 'Creating a layout' },
  { id: 'creating-a-nested-route', label: 'Creating a nested route' },
  { id: 'nesting-layouts', label: 'Nesting layouts' },
  { id: 'creating-a-dynamic-segment', label: 'Creating a dynamic segment' },
  { id: 'linking-between-pages', label: 'Linking between pages' },
]

const PAGE_TITLE = 'Layouts and Pages'
const PAGE_URL = 'https://bini.js.org/docs/layouts-and-pages'
const EDIT_URL = 'https://github.com/Binidu01/bini-offical/edit/main/src/app/docs/layouts-and-pages.tsx'

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
// Layouts and Pages Page
// ────────────────────────────────────────────────────────────────────────────────
export default function LayoutsAndPagesPage() {
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
                    <p className="text-slate-400 text-sm">Learn how to create your first pages and layouts, and link between them with the Link component.</p>
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
                <m.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <p className="text-slate-300 mb-6">
                    Bini.js uses <strong className="text-white">file-system based routing</strong>, meaning you can use folders and files to define routes. This page will guide you through how to create layouts and pages, and link between them.
                  </p>
                </m.section>

                {/* Creating a page */}
                <m.section id="creating-a-page" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Creating a page</h2>
                  <p className="text-slate-300 mb-4">
                    A <strong className="text-white">page</strong> is UI that is rendered on a specific route. To create a page, add a <code className="text-cyan-400">page</code> file inside the <code className="text-cyan-400">app</code> directory and default export a React component. For example, to create an index page (<code className="text-cyan-400">/</code>):
                  </p>
                  <CodeBlock 
                    code={`// src/app/page.tsx
export default function Page() {
  return <h1>Hello Bini.js!</h1>
}`}
                    filename="app/page.tsx"
                  />
                </m.section>

                {/* Creating a layout */}
                <m.section id="creating-a-layout" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Creating a layout</h2>
                  <p className="text-slate-300 mb-4">
                    A layout is UI that is <strong className="text-white">shared</strong> between multiple pages. On navigation, layouts preserve state, remain interactive, and do not rerender.
                  </p>
                  <p className="text-slate-300 mb-4">
                    You can define a layout by default exporting a React component from a <code className="text-cyan-400">layout</code> file. The component should return an <code className="text-cyan-400">&lt;Outlet /&gt;</code> where child routes will render.
                  </p>
                  <p className="text-slate-300 mb-4">
                    For example, to create a root layout:
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
                  <p className="text-slate-300 mt-4">
                    The layout above is called a <strong className="text-white">root layout</strong> because it's defined at the root of the <code className="text-cyan-400">app</code> directory. The root layout is <strong className="text-white">required</strong>.
                  </p>
                  <p className="text-slate-400 text-sm mt-4">
                    <strong className="text-white">Note:</strong> The <code className="text-cyan-400">&lt;html&gt;</code> and <code className="text-cyan-400">&lt;body&gt;</code> tags are defined in <code className="text-cyan-400">index.html</code>.
                  </p>
                </m.section>

                {/* Creating a nested route */}
                <m.section id="creating-a-nested-route" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Creating a nested route</h2>
                  <p className="text-slate-300 mb-4">
                    A nested route is a route composed of multiple URL segments. For example, the <code className="text-cyan-400">/blog/[slug]</code> route is composed of three segments:
                  </p>
                  <ul className="space-y-1 text-slate-300 mb-4 list-disc list-inside">
                    <li><code className="text-cyan-400">/</code> (Root Segment)</li>
                    <li><code className="text-cyan-400">blog</code> (Segment)</li>
                    <li><code className="text-cyan-400">[slug]</code> (Leaf Segment)</li>
                  </ul>
                  <p className="text-slate-300 mb-4">
                    In Bini.js:
                  </p>
                  <ul className="space-y-1 text-slate-300 mb-4 list-disc list-inside">
                    <li><strong className="text-white">Folders</strong> are used to define the route segments that map to URL segments.</li>
                    <li><strong className="text-white">Files</strong> (like <code className="text-cyan-400">page</code> and <code className="text-cyan-400">layout</code>) are used to create UI that is shown for a segment.</li>
                  </ul>
                  <p className="text-slate-300 mb-4">
                    To create nested routes, you can nest folders inside each other. For example, to add a route for <code className="text-cyan-400">/blog</code>, create a folder called <code className="text-cyan-400">blog</code> in the <code className="text-cyan-400">app</code> directory. Then, to make <code className="text-cyan-400">/blog</code> publicly accessible, add a <code className="text-cyan-400">page.tsx</code> file:
                  </p>
                  <CodeBlock 
                    code={`// src/app/blog/page.tsx
export default function Blog() {
  return <h1>Blog</h1>
}`}
                    filename="app/blog/page.tsx"
                  />
                  <p className="text-slate-300 mt-4">
                    You can continue nesting folders to create nested routes. For example, to create a route for a specific blog post, create a new <code className="text-cyan-400">[slug]</code> folder inside <code className="text-cyan-400">blog</code> and add a <code className="text-cyan-400">page</code> file:
                  </p>
                  <CodeBlock 
                    code={`// src/app/blog/[slug]/page.tsx
export default function BlogPost() {
  return <h1>Hello, Blog Post Page!</h1>
}`}
                    filename="app/blog/[slug]/page.tsx"
                  />
                </m.section>

                {/* Nesting layouts */}
                <m.section id="nesting-layouts" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Nesting layouts</h2>
                  <p className="text-slate-300 mb-4">
                    By default, layouts in the folder hierarchy are also nested. You can nest layouts by adding <code className="text-cyan-400">layout</code> inside specific route segments (folders).
                  </p>
                  <p className="text-slate-300 mb-4">
                    For example, to create a layout for the <code className="text-cyan-400">/dashboard</code> route, add a new <code className="text-cyan-400">layout</code> file inside the <code className="text-cyan-400">dashboard</code> folder.
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
                </m.section>

                {/* Creating a dynamic segment */}
                <m.section id="creating-a-dynamic-segment" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Creating a dynamic segment</h2>
                  <p className="text-slate-300 mb-4">
                    Dynamic segments allow you to create routes that are generated from data. To create a dynamic segment, wrap the folder name in square brackets: <code className="text-cyan-400">[segmentName]</code>.
                  </p>
                  <CodeBlock 
                    code={`// src/app/blog/[slug]/page.tsx
import { useParams } from 'react-router-dom'

export default function BlogPostPage() {
  const { slug } = useParams()
  
  return (
    <div>
      <h1>Post: {slug}</h1>
    </div>
  )
}`}
                    filename="app/blog/[slug]/page.tsx"
                  />
                </m.section>

                {/* Linking between pages */}
                <m.section id="linking-between-pages" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Linking between pages</h2>
                  <p className="text-slate-300 mb-4">
                    Use the <code className="text-cyan-400">&lt;Link&gt;</code> component (auto-imported) to navigate between routes. It extends the HTML <code className="text-cyan-400">&lt;a&gt;</code> tag to provide client-side navigation.
                  </p>
                  <CodeBlock 
                    code={`// src/app/blog/page.tsx
export default function BlogList() {
  const posts = [
    { slug: 'hello-world', title: 'Hello World' },
    { slug: 'getting-started', title: 'Getting Started' },
  ]

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.slug}>
          <Link to={\`/blog/\${post.slug}\`}>{post.title}</Link>
        </li>
      ))}
    </ul>
  )
}`}
                    filename="app/blog/page.tsx"
                  />
                  <p className="text-slate-400 text-sm mt-4">
                    <strong className="text-white">Tip:</strong> You can also use <code className="text-cyan-400">useNavigate</code> for programmatic navigation.
                  </p>
                </m.section>

                {/* Previous / Next Navigation */}
                <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex items-center justify-between pt-8 mt-8 border-t border-slate-800">
                  <Link to="/docs/project-structure" className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <div>
                      <div className="text-xs text-slate-500">Previous</div>
                      <div className="text-sm font-medium">Project Structure</div>
                    </div>
                  </Link>
                  <Link to="/docs/linking-and-navigating" className="group flex items-center gap-2 text-right text-slate-400 hover:text-white transition-colors">
                    <div>
                      <div className="text-xs text-slate-500">Next</div>
                      <div className="text-sm font-medium">Linking and Navigating</div>
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