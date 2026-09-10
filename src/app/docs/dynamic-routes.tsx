// src/pages/docs/dynamic-routes/page.tsx
import React, { useState } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Copy,
  Check,
  Hash,
  Asterisk,
  Brackets,
  Folder,
  File,
  Sparkles,
  AlertCircle,
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
  { id: 'dynamic-segments', label: 'Dynamic Segments' },
  { id: 'multiple-parameters', label: 'Multiple Parameters' },
  { id: 'catch-all-segments', label: 'Catch-all Segments' },
  { id: 'optional-catch-all', label: 'Optional Catch-all Segments' },
  { id: 'dynamic-layouts', label: 'Dynamic Segments in Layouts' },
  { id: 'flat-file-dynamic', label: 'Flat File Dynamic Routes' },
  { id: 'route-priority', label: 'Route Priority' },
  { id: 'complete-example', label: 'Complete Example' },
]

const PAGE_TITLE = 'Dynamic Routes'
const PAGE_URL = 'https://bini.js.org/docs/dynamic-routes'
const EDIT_URL = 'https://github.com/Binidu01/bini-offical/edit/main/src/app/docs/dynamic-routes.tsx'

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
    info: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', icon: Info, color: 'text-cyan-400' },
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
// Route Priority Visual
// ────────────────────────────────────────────────────────────────────────────────
function RoutePriorityVisual() {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 mb-6">
      <ol className="list-decimal list-inside space-y-2 text-slate-300">
        <li>
          <span className="text-white font-medium">Static routes</span>
          <span className="text-slate-400 text-xs block ml-6">exact matches — e.g., <code className="text-cyan-400">/blog/featured</code></span>
        </li>
        <li>
          <span className="text-white font-medium">Dynamic single segments</span>
          <span className="text-slate-400 text-xs block ml-6"><code className="text-cyan-400">[slug]</code> — e.g., <code className="text-cyan-400">/blog/:slug</code></span>
        </li>
        <li>
          <span className="text-white font-medium">Catch-all segments</span>
          <span className="text-slate-400 text-xs block ml-6"><code className="text-cyan-400">[...slug]</code> — e.g., <code className="text-cyan-400">/blog/*</code></span>
        </li>
        <li>
          <span className="text-white font-medium">Optional catch-all segments</span>
          <span className="text-slate-400 text-xs block ml-6"><code className="text-cyan-400">[[...slug]]</code> — e.g., <code className="text-cyan-400">/docs/*</code> (optional)</span>
        </li>
      </ol>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────────
// Dynamic Routes Page
// ────────────────────────────────────────────────────────────────────────────────
export default function DynamicRoutesPage() {
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
                      Learn how to create dynamic routes with parameters, catch-all segments, and optional catch-all segments in Bini.js.
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
                    Dynamic routes allow you to create pages that match a pattern rather than a static path. This is essential for pages like blog posts, product pages, user profiles, and documentation.
                  </p>
                  
                  <div className="grid sm:grid-cols-3 gap-3 mb-6">
                    <FeatureCard 
                      icon={Hash}
                      title="Dynamic Segments"
                      description="Single parameter routes with [param]"
                    />
                    <FeatureCard 
                      icon={Asterisk}
                      title="Catch-all Routes"
                      description="Match multiple segments with [...]"
                    />
                    <FeatureCard 
                      icon={Brackets}
                      title="Optional Catch-all"
                      description="Optional multi-segment routes with [[...]]"
                    />
                  </div>
                  
                  <Callout type="info">
                    <strong>Auto-import:</strong> <code>useParams()</code> is auto-imported in all pages and layouts — no import statement needed.
                  </Callout>
                </m.section>

                {/* Dynamic Segments */}
                <m.section 
                  id="dynamic-segments" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.15 }} 
                  className="scroll-mt-24"
                >
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Dynamic Segments</h2>
                  <p className="text-slate-300 mb-4">
                    Create a dynamic segment by wrapping a folder or file name in square brackets: <code className="text-cyan-400">[name]</code>. The parameter name must match <code className="text-cyan-400">/^[a-zA-Z_][a-zA-Z0-9_]*$/</code>.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Dynamic Folder Example</h3>
                  <FileStructure 
                    tree={`src/app/
├── blog/
│   └── [slug]/
│       └── page.tsx       → /blog/hello-world
│                           → /blog/getting-started
│                           → /blog/any-value
├── products/
│   └── [id]/
│       └── page.tsx       → /products/123
│                           → /products/abc-456
└── users/
    └── [userId]/
        └── page.tsx       → /users/john
                            → /users/mary`}
                  />
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Accessing Parameters</h3>
                  <p className="text-slate-300 mb-4">
                    Access the parameter value using <code className="text-cyan-400">useParams()</code>, which is auto-imported:
                  </p>
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
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">With Data Fetching</h3>
                  <CodeBlock 
                    code={`// src/app/user/[id]/page.tsx
export default function UserProfile() {
  const { id } = useParams()
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

                {/* Multiple Parameters */}
                <m.section 
                  id="multiple-parameters" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.2 }} 
                  className="scroll-mt-24"
                >
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Multiple Parameters</h2>
                  <p className="text-slate-300 mb-4">
                    You can have multiple dynamic segments in a single route. Each segment becomes a property in the <code className="text-cyan-400">useParams()</code> object.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Example with Multiple Params</h3>
                  <FileStructure 
                    tree={`src/app/
└── blog/
    └── [category]/
        └── [slug]/
            └── page.tsx   → /blog/tech/hello-world
                            → /blog/lifestyle/travel-tips`}
                  />
                  
                  <CodeBlock 
                    code={`// src/app/blog/[category]/[slug]/page.tsx
export default function BlogPost() {
  const { category, slug } = useParams()
  
  return (
    <div>
      <p className="text-cyan-400">Category: {category}</p>
      <h1 className="text-3xl font-bold text-white">Post: {slug}</h1>
    </div>
  )
}`}
                    filename="app/blog/[category]/[slug]/page.tsx"
                  />
                  
                  <Table 
                    headers={['URL', 'params']}
                    rows={[
                      ['/blog/tech/hello-world', '{ category: "tech", slug: "hello-world" }'],
                      ['/blog/lifestyle/travel', '{ category: "lifestyle", slug: "travel" }'],
                      ['/blog/design/ux-tips', '{ category: "design", slug: "ux-tips" }'],
                    ]}
                  />
                </m.section>

                {/* Catch-all Segments */}
                <m.section 
                  id="catch-all-segments" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.25 }} 
                  className="scroll-mt-24"
                >
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Catch-all Segments</h2>
                  <p className="text-slate-300 mb-4">
                    Use <code className="text-cyan-400">[...name]</code> to match any number of segments. The parameter becomes an array of the matched segments. This is perfect for documentation, file paths, or any multi-level navigation.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Catch-all Example</h3>
                  <FileStructure 
                    tree={`src/app/
└── docs/
    └── [...slug]/
        └── page.tsx       → /docs/getting-started
                            → /docs/api/reference
                            → /docs/guides/routing/basics`}
                  />
                  
                  <CodeBlock 
                    code={`// src/app/docs/[...slug]/page.tsx
export default function DocsPage() {
  const { slug } = useParams()
  // slug is an array, e.g., ['api', 'reference']
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Documentation</h1>
      <p className="text-slate-400">Path: {slug?.join(' / ')}</p>
      
      <div className="mt-4 p-4 bg-slate-900/50 rounded-lg">
        <p className="text-slate-300 text-sm">
          {slug?.length || 0} segment(s) in the path
        </p>
      </div>
    </div>
  )
}`}
                    filename="app/docs/[...slug]/page.tsx"
                  />
                  
                  <Table 
                    headers={['URL', 'slug value']}
                    rows={[
                      ['/docs/getting-started', "['getting-started']"],
                      ['/docs/api/reference', "['api', 'reference']"],
                      ['/docs/guides/routing/basics', "['guides', 'routing', 'basics']"],
                      ['/docs/advanced/custom/hooks', "['advanced', 'custom', 'hooks']"],
                    ]}
                  />
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Flat File Catch-all</h3>
                  <FileStructure 
                    tree={`src/app/
├── docs/
│   └── [...slug].tsx      → /docs/* (catch-all)
└── api/
    └── [...path].ts        → /api/* (catch-all API route)`}
                  />
                  
                  <Callout type="warning">
                    <strong>Priority:</strong> Catch-all segments have lower priority than static routes and dynamic single segments. For example, <code>/blog/featured</code> will match a static route if it exists, falling back to the catch-all only if no more specific route matches.
                  </Callout>
                </m.section>

                {/* Optional Catch-all Segments */}
                <m.section 
                  id="optional-catch-all" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.3 }} 
                  className="scroll-mt-24"
                >
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Optional Catch-all Segments</h2>
                  <p className="text-slate-300 mb-4">
                    Use <code className="text-cyan-400">[[...name]]</code> to make the catch-all optional. The route matches even without any segments, making it perfect for multi-level navigation like documentation or shop categories.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Optional Catch-all Example</h3>
                  <FileStructure 
                    tree={`src/app/
└── shop/
    └── [[...slug]]/
        └── page.tsx       → /shop
                            → /shop/clothing
                            → /shop/clothing/shirts`}
                  />
                  
                  <CodeBlock 
                    code={`// src/app/shop/[[...slug]]/page.tsx
export default function ShopPage() {
  const { slug } = useParams()
  
  if (!slug) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-white">Shop Home</h1>
        <p className="text-slate-400">Browse all categories</p>
      </div>
    )
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-white">
        Category: {slug.join(' / ')}
      </h1>
      <p className="text-slate-400">Depth: {slug.length}</p>
    </div>
  )
}`}
                    filename="app/shop/[[...slug]]/page.tsx"
                  />
                  
                  <Table 
                    headers={['URL', 'slug value']}
                    rows={[
                      ['/shop', 'undefined'],
                      ['/shop/clothing', "['clothing']"],
                      ['/shop/clothing/shirts', "['clothing', 'shirts']"],
                      ['/shop/electronics/phones/iphone', "['electronics', 'phones', 'iphone']"],
                    ]}
                  />
                </m.section>

                {/* Dynamic Segments in Layouts */}
                <m.section 
                  id="dynamic-layouts" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.35 }} 
                  className="scroll-mt-24"
                >
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Dynamic Segments in Layouts</h2>
                  <p className="text-slate-300 mb-4">
                    Layouts can also access dynamic parameters using <code className="text-cyan-400">useParams()</code>, which is auto-imported. This is useful for displaying contextual information in headers, sidebars, or breadcrumbs.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Layout with Dynamic Params</h3>
                  <CodeBlock 
                    code={`// src/app/blog/[slug]/layout.tsx
export default function BlogLayout() {
  const { slug } = useParams()
  
  return (
    <div>
      <header className="border-b border-slate-800 p-4">
        <h2 className="text-xl font-bold text-white">
          Post: {slug}
        </h2>
        <nav className="text-sm text-slate-400">
          <Link to="/blog">← Back to blog</Link>
        </nav>
      </header>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  )
}`}
                    filename="app/blog/[slug]/layout.tsx"
                  />
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">File Structure</h3>
                  <FileStructure 
                    tree={`src/app/
└── blog/
    └── [slug]/
        ├── layout.tsx        ← Layout with access to {slug}
        └── page.tsx          ← Main content`}
                  />
                  
                  <Callout type="tip">
                    <strong>Layout inheritance:</strong> The layout wraps the page and any nested routes, providing consistent UI across the dynamic route section.
                  </Callout>
                </m.section>

                {/* Flat File Dynamic Routes */}
                <m.section 
                  id="flat-file-dynamic" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.4 }} 
                  className="scroll-mt-24"
                >
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Flat File Dynamic Routes</h2>
                  <p className="text-slate-300 mb-4">
                    Dynamic routes can also be created as flat files without folders. This is especially useful for simpler pages where a folder structure would be unnecessary overhead.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Flat File Examples</h3>
                  <FileStructure 
                    tree={`src/app/
├── blog/
│   ├── [slug].tsx          → /blog/hello-world
│   └── [category]-[slug].tsx → /blog/tech-hello-world
├── products/
│   └── [id].tsx            → /products/123
├── users/
│   └── [userId].tsx        → /users/john
└── docs/
    └── [...slug].tsx       → /docs/* (catch-all)`}
                  />
                  
                  <CodeBlock 
                    code={`// src/app/blog/[slug].tsx
export default function BlogPost() {
  const { slug } = useParams()
  return (
    <h1 className="text-3xl font-bold text-white">Post: {slug}</h1>
  )
}`}
                    filename="app/blog/[slug].tsx"
                  />
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">When to Use Flat Files</h3>
                  <ul className="space-y-2 text-slate-300 mb-4 list-disc list-inside">
                    <li>Simple pages that don't need nested layouts</li>
                    <li>API routes with dynamic parameters</li>
                    <li>Single-level dynamic pages (e.g., <code className="text-cyan-400">/post/:id</code>)</li>
                    <li>When you want to reduce folder nesting</li>
                  </ul>
                </m.section>

                {/* Route Priority */}
                <m.section 
                  id="route-priority" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.45 }} 
                  className="scroll-mt-24"
                >
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Route Priority</h2>
                  <p className="text-slate-300 mb-4">
                    When multiple routes could match a URL, Bini.js resolves them in this order:
                  </p>
                  
                  <RoutePriorityVisual />
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Priority Example</h3>
                  <p className="text-slate-300 mb-4">
                    Consider this folder structure with overlapping routes:
                  </p>
                  
                  <FileStructure 
                    tree={`src/app/blog/
├── featured/
│   └── page.tsx           → /blog/featured (static - highest priority)
├── [slug]/
│   └── page.tsx           → /blog/anything-else (dynamic)
└── [...slug]/
    └── page.tsx           → /blog/a/b/c (catch-all)`}
                  />
                  
                  <Table 
                    headers={['URL', 'Matched Route', 'Priority']}
                    rows={[
                      ['/blog/featured', 'featured/page.tsx', 'Static'],
                      ['/blog/hello-world', '[slug]/page.tsx', 'Dynamic'],
                      ['/blog/a/b/c', '[...slug]/page.tsx', 'Catch-all'],
                      ['/blog/latest/post', '[slug]/page.tsx', 'Dynamic'],
                    ]}
                  />
                  
                  <p className="text-slate-300 mt-4">
                    This ensures predictable routing behavior and prevents conflicts between different route types.
                  </p>
                </m.section>

                {/* Complete Example */}
                <m.section 
                  id="complete-example" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.5 }} 
                  className="scroll-mt-24"
                >
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Complete Example</h2>
                  <p className="text-slate-300 mb-4">
                    Here is a comprehensive example showing all dynamic route patterns in a real-world application:
                  </p>
                  
                  <FileStructure 
                    tree={`src/app/
├── blog/
│   ├── featured/
│   │   └── page.tsx           → /blog/featured (static)
│   ├── [slug]/
│   │   ├── layout.tsx         ← Layout for single post with {slug}
│   │   └── page.tsx           → /blog/:slug (dynamic)
│   ├── [category]/
│   │   └── [slug]/
│   │       └── page.tsx       → /blog/:category/:slug (multiple dynamic)
│   └── [...slug]/
│       └── page.tsx           → /blog/a/b/c (catch-all)
├── docs/
│   └── [[...slug]]/
│       ├── layout.tsx         ← Layout for docs with optional catch-all
│       └── page.tsx           → /docs (optional catch-all)
│                               → /docs/getting-started
├── products/
│   ├── page.tsx               → /products
│   ├── [id].tsx               → /products/:id (flat file)
│   └── categories/
│       └── [name]/
│           └── page.tsx       → /products/categories/:name
├── users/
│   └── [userId]/
│       ├── page.tsx           → /users/:userId
│       └── settings/
│           └── page.tsx       → /users/:userId/settings
└── api/
    ├── posts/
    │   └── [id].ts            → /api/posts/:id
    └── users/
        └── [...path].ts       → /api/users/* (catch-all API)`}
                  />
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Route Mapping</h3>
                  <Table 
                    headers={['Pattern', 'Example URL', 'Type']}
                    rows={[
                      ['/blog/featured', '/blog/featured', 'Static'],
                      ['/blog/:slug', '/blog/hello-world', 'Dynamic Single'],
                      ['/blog/:category/:slug', '/blog/tech/hello-world', 'Multiple Dynamic'],
                      ['/blog/*', '/blog/a/b/c', 'Catch-all'],
                      ['/docs/* (optional)', '/docs', 'Optional Catch-all'],
                      ['/docs/* (optional)', '/docs/getting-started', 'Optional Catch-all'],
                      ['/products/:id', '/products/123', 'Flat File Dynamic'],
                      ['/users/:userId/settings', '/users/john/settings', 'Nested Dynamic'],
                    ]}
                  />
                </m.section>

                {/* Previous / Next Navigation */}
                <m.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.55 }} 
                  className="flex items-center justify-between pt-8 mt-8 border-t border-slate-800"
                >
                  <Link to="/docs/file-based-routing" className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <div>
                      <div className="text-xs text-slate-500">Previous</div>
                      <div className="text-sm font-medium">File-Based Routing</div>
                    </div>
                  </Link>
                  <Link to="/docs/catch-all-routes" className="group flex items-center gap-2 text-right text-slate-400 hover:text-white transition-colors">
                    <div>
                      <div className="text-xs text-slate-500">Next</div>
                      <div className="text-sm font-medium">Catch-All Routes</div>
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