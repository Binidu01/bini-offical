// src/pages/docs/catch-all-routes/page.tsx
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Copy,
  Check,
  Asterisk,
  Brackets,
  Folder,
  File,
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
  { id: 'what-are-catch-all-routes', label: 'What are Catch-All Routes?' },
  { id: 'basic-usage', label: 'Basic Usage' },
  { id: 'accessing-parameters', label: 'Accessing Parameters' },
  { id: 'nested-catch-all', label: 'Nested Catch-All Routes' },
  { id: 'optional-catch-all', label: 'Optional Catch-All Routes' },
  { id: 'file-based-catch-all', label: 'File-Based Catch-All Routes' },
  { id: 'route-priority', label: 'Route Priority' },
  { id: 'use-cases', label: 'Use Cases' },
  { id: 'complete-example', label: 'Complete Example' },
]

const PAGE_TITLE = 'Catch-All Routes'
const PAGE_URL = 'https://bini.js.org/docs/catch-all-routes'
const EDIT_URL = 'https://github.com/Binidu01/bini-offical/edit/main/src/app/docs/catch-all-routes.tsx'

// ────────────────────────────────────────────────────────────────────────────────
// Code Block Component with Copy
// ────────────────────────────────────────────────────────────────────────────────
function CodeBlock({ code, filename }: { code: string; filename?: string }) {
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
// Callout Component with Info Icon
// ────────────────────────────────────────────────────────────────────────────────
function Callout({ children }: { children: React.ReactNode }) {
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
// Feature Card Component
// ────────────────────────────────────────────────────────────────────────────────
function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-4 rounded-xl border border-slate-700 bg-[#0a0a0a] hover:border-slate-600 transition-colors">
      <div className="mb-2">
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
// Use Cases Cards
// ────────────────────────────────────────────────────────────────────────────────
function UseCaseCard({ title, description, example }: { title: string; description: string; example: string }) {
  return (
    <div className="p-4 rounded-xl border border-slate-700 bg-[#0a0a0a] hover:border-slate-600 transition-colors">
      <div className="mb-2">
        <span className="text-white font-medium text-sm">{title}</span>
      </div>
      <p className="text-slate-400 text-xs mb-2">{description}</p>
      <code className="text-cyan-400 text-xs bg-slate-900/50 px-2 py-1 rounded">{example}</code>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────────
// Catch-All Routes Page
// ────────────────────────────────────────────────────────────────────────────────
export default function CatchAllRoutesPage() {
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
                      Learn how to use catch-all routes to match multiple URL segments in Bini.js. Perfect for documentation, nested categories, and flexible URL structures.
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
                    Catch-all routes allow you to match multiple URL segments in a single route. They are defined using the <code className="text-cyan-400">[...name]</code> syntax, where the parameter becomes an array of the matched segments.
                  </p>
                  
                  <div className="grid sm:grid-cols-2 gap-3 mb-6">
                    <FeatureCard 
                      title="Variable Depth"
                      description="Match any number of URL segments"
                    />
                    <FeatureCard 
                      title="Array Parameters"
                      description="Access segments as an array"
                    />
                    <FeatureCard 
                      title="Flexible Structure"
                      description="Perfect for documentation and nested categories"
                    />
                    <FeatureCard 
                      title="Multi-language"
                      description="Handle language prefixes with variable paths"
                    />
                  </div>
                  
                  <Callout>
                    <strong>Auto-import:</strong> <code>useParams()</code> is auto-imported in all pages — no import statement needed to access catch-all parameters.
                  </Callout>
                </motion.section>

                {/* What are Catch-All Routes? */}
                <motion.section 
                  id="what-are-catch-all-routes" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.15 }} 
                  className="scroll-mt-24"
                >
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">What are Catch-All Routes?</h2>
                  <p className="text-slate-300 mb-4">
                    Catch-all routes are a powerful feature that allows you to match any number of URL segments after a specific path. They are defined using the <code className="text-cyan-400">[...name]</code> syntax in folder or file names.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Key Characteristics</h3>
                  <ul className="space-y-2 text-slate-300 mb-4 list-disc list-inside">
                    <li><strong className="text-white">Matches multiple segments:</strong> Any number of URL segments after the parent path</li>
                    <li><strong className="text-white">Array parameter:</strong> The parameter becomes an array of all matched segments</li>
                    <li><strong className="text-white">Lower priority:</strong> Static and dynamic routes are matched first</li>
                    <li><strong className="text-white">Optional version:</strong> Use <code className="text-cyan-400">[[...name]]</code> for optional catch-all</li>
                  </ul>
                  
                  <FileStructure 
                    tree={`src/app/
└── docs/
    └── [...slug]/
        └── page.tsx       → /docs/getting-started
                            → /docs/api/reference
                            → /docs/guides/routing/basics`}
                  />
                  
                  <p className="text-slate-300 mt-4">
                    In this example, <code className="text-cyan-400">/docs/getting-started</code> matches with <code className="text-cyan-400">slug = ['getting-started']</code>, while <code className="text-cyan-400">/docs/guides/routing/basics</code> matches with <code className="text-cyan-400">slug = ['guides', 'routing', 'basics']</code>.
                  </p>
                </motion.section>

                {/* Basic Usage */}
                <motion.section 
                  id="basic-usage" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.2 }} 
                  className="scroll-mt-24"
                >
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Basic Usage</h2>
                  <p className="text-slate-300 mb-4">
                    Create a catch-all route by naming a folder or file with square brackets and three dots: <code className="text-cyan-400">[...name]</code>.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Catch-All Examples</h3>
                  <FileStructure 
                    tree={`src/app/
├── blog/
│   └── [...slug]/
│       └── page.tsx       → /blog/a/b/c
│                           → /blog/2024/01/hello-world
├── products/
│   └── [...path]/
│       └── page.tsx       → /products/electronics/phones
│                           → /products/clothing/men/shirts
└── users/
    └── [...ids]/
        └── page.tsx       → /users/1/2/3`}
                  />
                  
                  <p className="text-slate-300 mt-4">
                    The route will match any URL that starts with the parent path and has at least one segment. This is different from optional catch-all routes, which match even with zero segments.
                  </p>
                  
                  <Callout>
                    <strong>At least one segment required:</strong> A regular catch-all route <code>[...slug]</code> requires at least one segment. Use <code>[[...slug]]</code> for optional catch-all that matches the parent path too.
                  </Callout>
                </motion.section>

                {/* Accessing Parameters */}
                <motion.section 
                  id="accessing-parameters" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.25 }} 
                  className="scroll-mt-24"
                >
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Accessing Parameters</h2>
                  <p className="text-slate-300 mb-4">
                    Use <code className="text-cyan-400">useParams()</code> (auto-imported) to access the catch-all parameter as an array. The parameter name becomes a property on the params object.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Basic Access</h3>
                  <CodeBlock 
                    code={`// src/app/docs/[...slug]/page.tsx
export default function DocsPage() {
  const { slug } = useParams()
  // slug is an array of the URL segments
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Documentation</h1>
      <p className="text-slate-400">Path: {slug?.join(' / ')}</p>
      <p className="text-slate-400">Depth: {slug?.length || 0}</p>
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
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">With Data Fetching</h3>
                  <CodeBlock 
                    code={`// src/app/blog/[...slug]/page.tsx
export default function BlogArchive() {
  const { slug } = useParams()
  const [posts, setPosts] = useState([])
  
  useEffect(() => {
    // Fetch posts based on the path segments
    const path = slug?.join('/')
    fetchPosts(path).then(setPosts)
  }, [slug])
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-white">
        Archive: {slug?.join(' / ') || 'Home'}
      </h1>
      <div className="space-y-2">
        {posts.map(post => (
          <div key={post.id} className="p-4 bg-slate-900/50 rounded">
            <h2 className="text-white font-medium">{post.title}</h2>
          </div>
        ))}
      </div>
    </div>
  )
}`}
                    filename="app/blog/[...slug]/page.tsx"
                  />
                </motion.section>

                {/* Nested Catch-All Routes */}
                <motion.section 
                  id="nested-catch-all" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.3 }} 
                  className="scroll-mt-24"
                >
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Nested Catch-All Routes</h2>
                  <p className="text-slate-300 mb-4">
                    Catch-all routes can be combined with other dynamic and static segments to create complex routing patterns.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Combining with Dynamic Segments</h3>
                  <FileStructure 
                    tree={`src/app/
├── blog/
│   ├── featured/
│   │   └── page.tsx       → /blog/featured (static - highest priority)
│   └── [...slug]/
│       └── page.tsx       → /blog/a/b/c (catch-all)
├── products/
│   └── [category]/
│       └── [...slug]/
│           └── page.tsx   → /products/electronics/phones/iphone
│                           → /products/clothing/men/shirts
└── users/
    └── [userId]/
        └── [...posts]/
            └── page.tsx   → /users/john/posts/1`}
                  />
                  
                  <CodeBlock 
                    code={`// src/app/products/[category]/[...slug]/page.tsx
export default function ProductPage() {
  const { category, slug } = useParams()
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Category: {category}</h1>
      <p className="text-slate-400">Path: {slug?.join(' / ')}</p>
      <p className="text-slate-400">Segments: {slug?.length || 0}</p>
    </div>
  )
}`}
                    filename="app/products/[category]/[...slug]/page.tsx"
                  />
                </motion.section>

                {/* Optional Catch-All Routes */}
                <motion.section 
                  id="optional-catch-all" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.35 }} 
                  className="scroll-mt-24"
                >
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Optional Catch-All Routes</h2>
                  <p className="text-slate-300 mb-4">
                    Use <code className="text-cyan-400">[[...name]]</code> to make the catch-all optional. The route will match both the parent path and any nested paths.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Optional Catch-All Example</h3>
                  <FileStructure 
                    tree={`src/app/
├── shop/
│   └── [[...slug]]/
│       └── page.tsx       → /shop
│                           → /shop/clothing
│                           → /shop/clothing/shirts
└── docs/
    └── [[...path]]/
        └── page.tsx       → /docs
                            → /docs/getting-started
                            → /docs/api/reference`}
                  />
                  
                  <CodeBlock 
                    code={`// src/app/shop/[[...slug]]/page.tsx
export default function ShopPage() {
  const { slug } = useParams()
  
  if (!slug || slug.length === 0) {
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
                      ['/shop', 'undefined (or empty array)'],
                      ['/shop/clothing', "['clothing']"],
                      ['/shop/clothing/shirts', "['clothing', 'shirts']"],
                    ]}
                  />
                  
                  <Callout>
                    <strong>Use case:</strong> Optional catch-all routes are perfect for documentation pages where the root path (<code>/docs</code>) should show a landing page, and nested paths (<code>/docs/getting-started</code>) show specific content.
                  </Callout>
                </motion.section>

                {/* File-Based Catch-All Routes */}
                <motion.section 
                  id="file-based-catch-all" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.4 }} 
                  className="scroll-mt-24"
                >
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">File-Based Catch-All Routes</h2>
                  <p className="text-slate-300 mb-4">
                    Catch-all routes can also be defined as flat files without folders. This reduces folder nesting for simpler use cases.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Flat File Examples</h3>
                  <FileStructure 
                    tree={`src/app/
├── docs/
│   └── [...slug].tsx      → /docs/getting-started
│                           → /docs/api/reference
├── products/
│   └── [...path].tsx      → /products/electronics/phones
│                           → /products/clothing/men
└── blog/
    └── [...slug].tsx      → /blog/2024/01/hello-world`}
                  />
                  
                  <CodeBlock 
                    code={`// src/app/blog/[...slug].tsx
export default function BlogArchive() {
  const { slug } = useParams()
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Blog Archive</h1>
      <p className="text-slate-400">Path: {slug?.join(' / ')}</p>
    </div>
  )
}`}
                    filename="app/blog/[...slug].tsx"
                  />
                </motion.section>

                {/* Route Priority */}
                <motion.section 
                  id="route-priority" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.45 }} 
                  className="scroll-mt-24"
                >
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Route Priority</h2>
                  <p className="text-slate-300 mb-4">
                    Catch-all routes have lower priority than static routes and dynamic single segments. The router resolves matches in this order:
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
│   └── page.tsx           → /blog/hello-world (dynamic)
└── [...slug]/
    └── page.tsx           → /blog/2024/01/hello-world (catch-all)`}
                  />
                  
                  <Table 
                    headers={['URL', 'Matched Route', 'Priority']}
                    rows={[
                      ['/blog/featured', 'featured/page.tsx', 'Static'],
                      ['/blog/hello-world', '[slug]/page.tsx', 'Dynamic'],
                      ['/blog/2024/01/hello-world', '[...slug]/page.tsx', 'Catch-all'],
                    ]}
                  />
                  
                  <p className="text-slate-300 mt-4">
                    This priority system ensures predictable routing behavior and prevents conflicts between different route types.
                  </p>
                </motion.section>

                {/* Use Cases */}
                <motion.section 
                  id="use-cases" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.5 }} 
                  className="scroll-mt-24"
                >
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Use Cases</h2>
                  <p className="text-slate-300 mb-4">
                    Catch-all routes are ideal for:
                  </p>
                  
                  <div className="grid sm:grid-cols-2 gap-3 mb-6">
                    <UseCaseCard 
                      title="Documentation"
                      description="Multi-level documentation with variable depth"
                      example="/docs/guides/routing/basics"
                    />
                    <UseCaseCard 
                      title="E-commerce Categories"
                      description="Nested category structures"
                      example="/products/electronics/phones/iphone"
                    />
                    <UseCaseCard 
                      title="Blog Archives"
                      description="Date-based archives"
                      example="/blog/2024/01/hello-world"
                    />
                    <UseCaseCard 
                      title="Multi-language Sites"
                      description="Language prefixes with variable paths"
                      example="/en/docs/getting-started"
                    />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Additional Use Cases</h3>
                  <ul className="space-y-2 text-slate-300 mb-4 list-disc list-inside">
                    <li><strong className="text-white">CMS Content:</strong> Content pages with flexible URL structures</li>
                    <li><strong className="text-white">API Versioning:</strong> API routes with version segments like <code className="text-cyan-400">/api/v1/users/123</code></li>
                    <li><strong className="text-white">File Browser:</strong> Directory browsing with arbitrary depth</li>
                    <li><strong className="text-white">Wiki Pages:</strong> Multi-level wiki documentation</li>
                    <li><strong className="text-white">Path-Based Navigation:</strong> Any URL structure where depth varies</li>
                  </ul>
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
                    Here is a comprehensive example showing all catch-all route patterns in a real-world application:
                  </p>
                  
                  <FileStructure 
                    tree={`src/app/
├── blog/
│   ├── featured/
│   │   └── page.tsx           → /blog/featured (static)
│   ├── [slug]/
│   │   └── page.tsx           → /blog/:slug (dynamic)
│   └── [...slug]/
│       └── page.tsx           → /blog/2024/01/hello-world (catch-all)
├── docs/
│   └── [[...slug]]/
│       ├── layout.tsx         ← Layout for docs
│       └── page.tsx           → /docs (optional catch-all)
│                               → /docs/getting-started
├── products/
│   └── [category]/
│       └── [...slug]/
│           └── page.tsx       → /products/electronics/phones/iphone
├── shop/
│   └── [[...slug]]/
│       └── page.tsx           → /shop (optional catch-all)
│                               → /shop/clothing
│                               → /shop/clothing/shirts
├── wiki/
│   └── [[...path]]/
│       └── page.tsx           → /wiki (optional catch-all)
│                               → /wiki/guides/routing
└── api/
    └── v1/
        └── [...path].ts       → /api/v1/users/123 (flat file catch-all)`}
                  />
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Route Mapping</h3>
                  <Table 
                    headers={['Pattern', 'Example URL', 'Type']}
                    rows={[
                      ['/blog/featured', '/blog/featured', 'Static'],
                      ['/blog/:slug', '/blog/hello-world', 'Dynamic Single'],
                      ['/blog/*', '/blog/2024/01/hello-world', 'Catch-all'],
                      ['/docs/* (optional)', '/docs', 'Optional Catch-all'],
                      ['/docs/* (optional)', '/docs/getting-started', 'Optional Catch-all'],
                      ['/products/:category/*', '/products/electronics/phones/iphone', 'Nested Catch-all'],
                      ['/shop/* (optional)', '/shop/clothing/shirts', 'Optional Catch-all'],
                      ['/api/v1/*', '/api/v1/users/123', 'Flat File Catch-all'],
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
                  <Link to="/docs/dynamic-routes" className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <div>
                      <div className="text-xs text-slate-500">Previous</div>
                      <div className="text-sm font-medium">Dynamic Routes</div>
                    </div>
                  </Link>
                  <Link to="/docs/mdx-markdown" className="group flex items-center gap-2 text-right text-slate-400 hover:text-white transition-colors">
                    <div>
                      <div className="text-xs text-slate-500">Next</div>
                      <div className="text-sm font-medium">MDX and Markdown</div>
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