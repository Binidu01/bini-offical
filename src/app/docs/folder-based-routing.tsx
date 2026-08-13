// src/pages/docs/folder-based-routing/page.tsx
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Copy,
  Check,
  Folder,
  File,
  FolderTree,
  Hash,
  Asterisk,
  Brackets,
  EyeOff,
  Layout,
  Loader,
  AlertCircle,
  FileQuestion,
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
  { id: 'basic-folder-routing', label: 'Basic Folder Routing' },
  { id: 'nested-routes', label: 'Nested Routes' },
  { id: 'dynamic-segments', label: 'Dynamic Segments' },
  { id: 'catch-all-segments', label: 'Catch-all Segments' },
  { id: 'optional-catch-all', label: 'Optional Catch-all Segments' },
  { id: 'route-groups', label: 'Route Groups' },
  { id: 'private-folders', label: 'Private Folders' },
  { id: 'nearest-wins-folders', label: 'Nearest Wins with Folders' },
  { id: 'route-priority', label: 'Route Priority' },
  { id: 'complete-example', label: 'Complete Example' },
]

const PAGE_TITLE = 'Folder-Based Routing'
const PAGE_URL = 'https://bini.js.org/docs/folder-based-routing'
const EDIT_URL = 'https://github.com/Binidu01/bini-official/edit/main/src/app/docs/folder-based-routing.tsx'

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
// Route Priority Visualization
// ────────────────────────────────────────────────────────────────────────────────
function RoutePriorityVisual() {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 mb-6">
      <ol className="list-decimal list-inside space-y-2 text-slate-300">
        <li>
          <span className="text-white font-medium">Static routes</span>
          <span className="text-slate-400 text-xs block ml-6">exact matches — e.g., <code className="text-cyan-400">/about</code></span>
        </li>
        <li>
          <span className="text-white font-medium">Dynamic single segments</span>
          <span className="text-slate-400 text-xs block ml-6"><code className="text-cyan-400">[slug]</code> — e.g., <code className="text-cyan-400">/blog/:slug</code></span>
        </li>
        <li>
          <span className="text-white font-medium">Catch-all segments</span>
          <span className="text-slate-400 text-xs block ml-6"><code className="text-cyan-400">[...slug]</code> — e.g., <code className="text-cyan-400">/docs/*</code></span>
        </li>
        <li>
          <span className="text-white font-medium">Optional catch-all segments</span>
          <span className="text-slate-400 text-xs block ml-6"><code className="text-cyan-400">[[...slug]]</code> — e.g., <code className="text-cyan-400">/shop/*</code> (optional)</span>
        </li>
      </ol>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────────
// Folder-Based Routing Page
// ────────────────────────────────────────────────────────────────────────────────
export default function FolderBasedRoutingPage() {
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
                    <p className="text-slate-400 text-sm">
                      Learn how folders define URL segments and create nested routes automatically in Bini.js.
                    </p>
                  </div>
                  <div className="shrink-0 pt-2 hidden sm:block">
                    <CopyPageButton pageUrl={PAGE_URL} pageTitle={PAGE_TITLE} />
                  </div>
                </motion.div>
                
                <div className="sm:hidden mb-8">
                  <CopyPageButton pageUrl={PAGE_URL} pageTitle={PAGE_TITLE} />
                </div>

                {/* Overview */}
                <motion.section 
                  id="overview"
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.1 }}
                  className="scroll-mt-24"
                >
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Overview</h2>
                  <p className="text-slate-300 mb-4">
                    Bini.js uses a <strong className="text-white">folder-based routing system</strong> where the folder structure inside <code className="text-cyan-400">src/app/</code> directly maps to URL paths. This makes routing intuitive and eliminates the need for manual route configuration.
                  </p>
                  
                  <div className="grid sm:grid-cols-2 gap-3 mb-6">
                    <FeatureCard 
                      icon={FolderTree}
                      title="Intuitive Structure"
                      description="Folders map directly to URL segments"
                    />
                    <FeatureCard 
                      icon={Hash}
                      title="Dynamic Segments"
                      description="Create dynamic routes with [param] syntax"
                    />
                    <FeatureCard 
                      icon={Asterisk}
                      title="Catch-all Routes"
                      description="Match multiple segments with [...] syntax"
                    />
                    <FeatureCard 
                      icon={EyeOff}
                      title="Private Folders"
                      description="Exclude folders with _ prefix"
                    />
                  </div>
                </motion.section>

                {/* Basic Folder Routing */}
                <motion.section 
                  id="basic-folder-routing" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.15 }} 
                  className="scroll-mt-24"
                >
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Basic Folder Routing</h2>
                  <p className="text-slate-300 mb-4">
                    Each folder inside <code className="text-cyan-400">src/app/</code> becomes a URL segment. Add a <code className="text-cyan-400">page.tsx</code> file inside to make the route publicly accessible.
                  </p>
                  
                  <FileStructure 
                    tree={`src/app/
├── page.tsx          → /
├── about/
│   └── page.tsx      → /about
├── blog/
│   └── page.tsx      → /blog
└── contact/
    └── page.tsx      → /contact`}
                  />
                  
                  <p className="text-slate-300 mt-4">
                    This creates four routes: <code className="text-cyan-400">/</code>, <code className="text-cyan-400">/about</code>, <code className="text-cyan-400">/blog</code>, and <code className="text-cyan-400">/contact</code>.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Flat File Support</h3>
                  <p className="text-slate-300 mb-4">
                    Bini.js also supports flat files at the root level. These work the same way as folder-based routes:
                  </p>
                  <FileStructure 
                    tree={`src/app/
├── page.tsx          → /
├── about.tsx         → /about
├── blog.tsx          → /blog
└── contact.tsx       → /contact`}
                  />
                  
                  <Callout type="tip">
                    <strong>Both patterns work:</strong> You can mix folder-based and flat file routing. Choose whichever makes your project organization clearer.
                  </Callout>
                </motion.section>

                {/* Nested Routes */}
                <motion.section 
                  id="nested-routes" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.2 }} 
                  className="scroll-mt-24"
                >
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Nested Routes</h2>
                  <p className="text-slate-300 mb-4">
                    Nest folders inside each other to create nested URL segments. Each level adds another segment to the URL path.
                  </p>
                  
                  <FileStructure 
                    tree={`src/app/
├── blog/
│   ├── page.tsx           → /blog
│   ├── authors/
│   │   └── page.tsx       → /blog/authors
│   └── categories/
│       ├── page.tsx       → /blog/categories
│       └── [name]/
│           └── page.tsx   → /blog/categories/tech`}
                  />
                  
                  <p className="text-slate-300 mt-4">
                    The folder structure directly mirrors the URL structure. Deep nesting is fully supported up to 100 levels deep.
                  </p>
                  
                  <Callout type="info">
                    <strong>Layout inheritance:</strong> Nested routes automatically inherit layouts from parent folders. Each folder can have its own <code>layout.tsx</code> that wraps all routes in that folder.
                  </Callout>
                </motion.section>

                {/* Dynamic Segments */}
                <motion.section 
                  id="dynamic-segments" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.25 }} 
                  className="scroll-mt-24"
                >
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Dynamic Segments</h2>
                  <p className="text-slate-300 mb-4">
                    Use square brackets <code className="text-cyan-400">[param]</code> to create dynamic route segments that match any value. Access the value with <code className="text-cyan-400">useParams()</code> (auto-imported).
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
        ├── page.tsx       → /users/john
        └── settings/
            └── page.tsx   → /users/john/settings`}
                  />
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Using Dynamic Params</h3>
                  <CodeBlock 
                    code={`// src/app/blog/[slug]/page.tsx
export default function BlogPost() {
  const { slug } = useParams() // Auto-imported
  
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
│   └── [slug].tsx         → /blog/:slug
├── user/
│   └── [id].tsx           → /user/:id
└── product/
    └── [sku].tsx          → /product/:sku`}
                  />
                  
                  <Callout type="warning">
                    <strong>Param naming:</strong> Parameter names must match <code>/^[a-zA-Z_][a-zA-Z0-9_]*$/</code> and are validated at scan time.
                  </Callout>
                </motion.section>

                {/* Catch-all Segments */}
                <motion.section 
                  id="catch-all-segments" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.3 }} 
                  className="scroll-mt-24"
                >
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Catch-all Segments</h2>
                  <p className="text-slate-300 mb-4">
                    Use <code className="text-cyan-400">[...segment]</code> to match multiple URL segments. The parameter becomes an array of values.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Catch-all Example</h3>
                  <FileStructure 
                    tree={`src/app/
├── docs/
│   └── [...slug]/
│       └── page.tsx       → /docs/getting-started
│                           → /docs/api/reference
│                           → /docs/guides/routing/basics`}
                  />
                  
                  <CodeBlock 
                    code={`// src/app/docs/[...slug]/page.tsx
export default function DocsPage() {
  const { slug } = useParams()
  // slug is an array: ['api', 'reference']
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Documentation</h1>
      <p className="text-slate-400">Path: {slug?.join(' / ')}</p>
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
                </motion.section>

                {/* Optional Catch-all Segments */}
                <motion.section 
                  id="optional-catch-all" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.35 }} 
                  className="scroll-mt-24"
                >
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Optional Catch-all Segments</h2>
                  <p className="text-slate-300 mb-4">
                    Use <code className="text-cyan-400">[[...segment]]</code> to make the catch-all optional. The route will also match the parent path.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Optional Catch-all Example</h3>
                  <FileStructure 
                    tree={`src/app/
├── shop/
│   └── [[...slug]]/
│       └── page.tsx       → /shop
│                           → /shop/clothing
│                           → /shop/clothing/shirts`}
                  />
                  
                  <CodeBlock 
                    code={`// src/app/shop/[[...slug]]/page.tsx
export default function ShopPage() {
  const { slug } = useParams()
  // slug is undefined for /shop
  // slug is ['clothing'] for /shop/clothing
  
  if (!slug) {
    return <h1 className="text-2xl font-bold text-white">Shop Home</h1>
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-white">
        Category: {slug.join(' / ')}
      </h1>
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
                    ]}
                  />
                </motion.section>

                {/* Route Groups */}
                <motion.section 
                  id="route-groups" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.4 }} 
                  className="scroll-mt-24"
                >
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Route Groups</h2>
                  <p className="text-slate-300 mb-4">
                    Use parentheses <code className="text-cyan-400">(group)</code> to organize routes without affecting the URL. Perfect for grouping related pages or applying shared layouts.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Route Group Example</h3>
                  <FileStructure 
                    tree={`src/app/
├── (marketing)/
│   ├── page.tsx           → /
│   ├── about/
│   │   └── page.tsx       → /about
│   └── pricing/
│       └── page.tsx       → /pricing
├── (shop)/
│   ├── page.tsx           → /
│   ├── products/
│   │   └── page.tsx       → /products
│   └── cart/
│       └── page.tsx       → /cart
└── (admin)/
    ├── layout.tsx         ← Layout only for admin routes
    ├── page.tsx           → /
    └── dashboard/
        └── page.tsx       → /dashboard`}
                  />
                  
                  <p className="text-slate-300 mt-4">
                    Notice how <code className="text-cyan-400">(marketing)</code>, <code className="text-cyan-400">(shop)</code>, and <code className="text-cyan-400">(admin)</code> don't appear in the URLs. They're purely for organization.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Route Groups with Layouts</h3>
                  <p className="text-slate-300 mb-4">
                    Route groups are especially useful for applying different layouts to different sections:
                  </p>
                  <FileStructure 
                    tree={`src/app/
├── (marketing)/
│   ├── layout.tsx         ← Marketing layout (different header/footer)
│   └── page.tsx           → /
├── (dashboard)/
│   ├── layout.tsx         ← Dashboard layout (sidebar + header)
│   └── settings/
│       └── page.tsx       → /settings
└── layout.tsx             ← Root layout (applies to all)`}
                  />
                  
                  <Callout type="tip">
                    <strong>Layout inheritance:</strong> Route groups are great for organizing layouts. Each group can have its own <code>layout.tsx</code> that only applies to routes in that group.
                  </Callout>
                </motion.section>

                {/* Private Folders */}
                <motion.section 
                  id="private-folders" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.45 }} 
                  className="scroll-mt-24"
                >
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Private Folders</h2>
                  <p className="text-slate-300 mb-4">
                    Prefix a folder with an underscore <code className="text-cyan-400">_folder</code> to exclude it from routing. Perfect for components, utilities, and other non-route files.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Private Folder Example</h3>
                  <FileStructure 
                    tree={`src/app/
├── _components/           ← Not routable
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── Button.tsx
├── _lib/                  ← Not routable
│   ├── api.ts
│   └── utils.ts
├── _hooks/                ← Not routable
│   └── useAuth.ts
├── blog/
│   ├── _components/       ← Not routable
│   │   └── PostCard.tsx
│   └── page.tsx           → /blog
└── page.tsx               → /`}
                  />
                  
                  <p className="text-slate-300 mt-4">
                    Private folders can be placed anywhere in the <code className="text-cyan-400">app</code> directory and are completely ignored by the router.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Ignored Patterns</h3>
                  <ul className="space-y-2 text-slate-300 mb-4 list-disc list-inside">
                    <li>Folders starting with <code className="text-cyan-400">_</code> (underscore)</li>
                    <li>Folders starting with <code className="text-cyan-400">.</code> (dot)</li>
                    <li>Files starting with <code className="text-cyan-400">_</code> or <code className="text-cyan-400">.</code></li>
                    <li>The <code className="text-cyan-400">api/</code> directory (reserved for API routes)</li>
                  </ul>
                </motion.section>

                {/* Nearest Wins with Folders */}
                <motion.section 
                  id="nearest-wins-folders" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.47 }} 
                  className="scroll-mt-24"
                >
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Nearest Wins with Folders</h2>
                  <p className="text-slate-300 mb-4">
                    <code className="text-cyan-400">loading.tsx</code>, <code className="text-cyan-400">not-found.tsx</code>, and <code className="text-cyan-400">error.tsx</code> follow the folder hierarchy using <strong className="text-white">"nearest wins"</strong> resolution. A file in a subfolder only affects that subfolder and shadows (without deleting) the same file in any ancestor folder.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Folder Hierarchy and Boundaries</h3>
                  <ul className="space-y-2 text-slate-300 mb-4 list-disc list-inside">
                    <li>Each folder can define its own <code className="text-cyan-400">loading.tsx</code>, <code className="text-cyan-400">error.tsx</code>, and <code className="text-cyan-400">not-found.tsx</code></li>
                    <li>A file in a subfolder only affects routes inside that subfolder</li>
                    <li>It shadows the same file in ancestor folders for routes in that subfolder</li>
                    <li>Routes without a closer match fall through to the nearest ancestor</li>
                    <li>If no file exists anywhere in the hierarchy, the built-in default is used</li>
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
                    When a route needs a boundary file, the router checks:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-slate-300 mb-4">
                    <li>The route's own folder first</li>
                    <li>Each parent folder (going up the hierarchy)</li>
                    <li>The built-in default if no file is found</li>
                  </ol>
                  
                  <Callout type="info">
                    <strong>Nearest Wins:</strong> A file in a subfolder shadows ancestor files for routes in that subfolder, but doesn't delete them for other routes. This is the same mental model as layouts.
                  </Callout>
                </motion.section>

                {/* Route Priority */}
                <motion.section 
                  id="route-priority" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.5 }} 
                  className="scroll-mt-24"
                >
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Route Priority</h2>
                  <p className="text-slate-300 mb-4">
                    When multiple routes could match a URL, Bini.js resolves them in this order:
                  </p>
                  
                  <RoutePriorityVisual />
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Priority Example</h3>
                  <p className="text-slate-300 mb-4">
                    Consider this folder structure:
                  </p>
                  <FileStructure 
                    tree={`src/app/
├── blog/
│   ├── page.tsx           → /blog
│   ├── [slug]/
│   │   └── page.tsx       → /blog/:slug
│   └── [...slug]/
│       └── page.tsx       → /blog/* (catch-all)`}
                  />
                  <Table 
                    headers={['URL', 'Matched Route']}
                    rows={[
                      ['/blog', '/blog (static)'],
                      ['/blog/hello-world', '/blog/:slug (dynamic)'],
                      ['/blog/hello/world', '/blog/* (catch-all)'],
                    ]}
                  />
                  
                  <p className="text-slate-300 mt-4">
                    This ensures predictable routing behavior and prevents conflicts between different route types.
                  </p>
                </motion.section>

                {/* Complete Example */}
                <motion.section 
                  id="complete-example" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.55 }} 
                  className="scroll-mt-24"
                >
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Complete Example</h2>
                  <p className="text-slate-300 mb-4">
                    Here is a comprehensive folder structure showing all routing patterns:
                  </p>
                  <FileStructure 
                    tree={`src/app/
├── (marketing)/               ← Route group (not in URL)
│   ├── layout.tsx             ← Layout for marketing pages
│   ├── page.tsx               → /
│   ├── about/
│   │   └── page.tsx           → /about
│   └── _components/           ← Private folder
│       └── Hero.tsx
├── blog/
│   ├── layout.tsx             ← Layout for blog section
│   ├── page.tsx               → /blog
│   ├── loading.tsx            ← Blog loading UI (nearest wins)
│   ├── [slug]/                ← Dynamic segment
│   │   └── page.tsx           → /blog/:slug
│   ├── authors/
│   │   └── page.tsx           → /blog/authors
│   └── categories/
│       └── [...slug]/         ← Catch-all
│           └── page.tsx       → /blog/categories/tech/news
├── docs/
│   └── [[...slug]]/           ← Optional catch-all
│       └── page.tsx           → /docs
│                               → /docs/getting-started
├── api/                       ← API routes
│   ├── hello.ts               → /api/hello
│   └── users/
│       └── [id].ts            → /api/users/:id
├── layout.tsx                 ← Root layout
├── page.tsx                   → /
├── loading.tsx                ← Global loading UI
├── error.tsx                  ← Global error UI
└── not-found.tsx              ← Custom 404 page`}
                  />
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Route Mapping</h3>
                  <Table 
                    headers={['Folder Path', 'URL', 'Type']}
                    rows={[
                      ['app/page.tsx', '/', 'Static'],
                      ['app/about/page.tsx', '/about', 'Static'],
                      ['app/blog/page.tsx', '/blog', 'Static'],
                      ['app/blog/[slug]/page.tsx', '/blog/:slug', 'Dynamic'],
                      ['app/blog/authors/page.tsx', '/blog/authors', 'Static'],
                      ['app/blog/categories/[...slug]/page.tsx', '/blog/categories/*', 'Catch-all'],
                      ['app/docs/[[...slug]]/page.tsx', '/docs/*', 'Optional Catch-all'],
                      ['app/api/hello.ts', '/api/hello', 'API'],
                      ['app/api/users/[id].ts', '/api/users/:id', 'API Dynamic'],
                    ]}
                  />
                </motion.section>

                {/* Previous / Next Navigation */}
                <motion.div 
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
                  <Link to="/docs/file-based-routing" className="group flex items-center gap-2 text-right text-slate-400 hover:text-white transition-colors">
                    <div>
                      <div className="text-xs text-slate-500">Next</div>
                      <div className="text-sm font-medium">File-Based Routing</div>
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