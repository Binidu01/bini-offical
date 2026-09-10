// src/pages/docs/api-dynamic/page.tsx
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
  { id: 'file-structure', label: 'File Structure' },
  { id: 'single-parameter', label: 'Single Dynamic Parameter' },
  { id: 'multiple-parameters', label: 'Multiple Dynamic Parameters' },
  { id: 'catch-all-routes', label: 'Catch-all Routes' },
  { id: 'optional-catch-all', label: 'Optional Catch-all' },
  { id: 'nested-dynamic', label: 'Nested Dynamic Routes' },
  { id: 'query-parameters', label: 'Query Parameters' },
  { id: 'route-priority', label: 'Route Priority' },
  { id: 'complete-example', label: 'Complete Example' },
]

const PAGE_TITLE = 'Dynamic API Routes'
const PAGE_URL = 'https://bini.js.org/docs/api-dynamic'
const EDIT_URL = 'https://github.com/Binidu01/bini-offical/edit/main/src/app/docs/api-dynamic.tsx'

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
    <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800 my-6">
      <div className="text-sm text-slate-300 [&>strong]:text-white [&>code]:text-cyan-400 [&>code]:bg-slate-800 [&>code]:px-1 [&>code]:py-0.5 [&>code]:rounded">{children}</div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────────
// Dynamic API Routes Page
// ────────────────────────────────────────────────────────────────────────────────
export default function ApiDynamicPage() {
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
                    <p className="text-slate-400 text-sm">Learn how to create dynamic API endpoints with path parameters, catch-all routes, and optional segments.</p>
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
                    Dynamic API routes allow you to create endpoints that match patterns rather than exact paths. Use square brackets in your file names to define dynamic segments — the file path determines the route.
                  </p>
                  <Note>
                    <strong>File-based routing:</strong> Like all Bini.js API routes, dynamic routes follow file-based routing. There are no root <code>/</code> API routes — the filename becomes the route segment. Write your Hono routes <strong>without</strong> the <code>/api</code> prefix.
                  </Note>
                </m.section>

                {/* File Structure */}
                <m.section id="file-structure" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">File Structure</h2>
                  <p className="text-slate-300 mb-4">
                    Dynamic segments are created using square brackets in file or folder names:
                  </p>
                  <CodeBlock 
                    code={`src/app/api/
├── posts/
│   └── [id].ts              → /api/posts/:id
├── users/
│   └── [userId]/
│       └── settings.ts      → /api/users/:userId/settings
├── files/
│   └── [...path].ts         → /api/files/a/b/c (catch-all)
└── [...catch].ts            → /api/* (global catch-all)`}
                  />
                  <Table 
                    headers={['Pattern', 'File/Folder Name', 'Matches']}
                    rows={[
                      ['[id]', 'Single dynamic segment', '/api/posts/123, /api/posts/abc'],
                      ['[category]/[slug]', 'Multiple dynamic segments', '/api/posts/tech/hello-world'],
                      ['[...path]', 'Catch-all (required)', '/api/files/a, /api/files/a/b/c'],
                      ['[[...slug]]', 'Catch-all (optional)', '/api/docs, /api/docs/a/b'],
                    ]}
                  />
                </m.section>

                {/* Single Dynamic Parameter */}
                <m.section id="single-parameter" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Single Dynamic Parameter</h2>
                  <p className="text-slate-300 mb-4">
                    Use <code className="text-cyan-400">[name]</code> in the filename for a single dynamic segment:
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">With Hono</h3>
                  <CodeBlock 
                    code={`// src/app/api/posts/[id].ts → /api/posts/:id
import { Hono } from 'hono'

const app = new Hono()

app.get('/posts/:id', (c) => {
  const id = c.req.param('id')
  return c.json({ id, title: \`Post \${id}\` })
})

app.put('/posts/:id', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()
  return c.json({ id, ...body })
})

export default app`}
                    filename="src/app/api/posts/[id].ts"
                  />
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">With Plain Function</h3>
                  <CodeBlock 
                    code={`// src/app/api/posts/[id].ts → /api/posts/:id
export default async function handler(request: Request) {
  const paramsHeader = request.headers.get('x-bini-params')
  const params = paramsHeader ? JSON.parse(paramsHeader) : {}
  const id = params.id
  
  if (request.method === 'GET') {
    return Response.json({ id, title: \`Post \${id}\` })
  }
  
  return Response.json({ error: 'Method not allowed' }, { status: 405 })
}`}
                    filename="src/app/api/posts/[id].ts"
                  />
                </m.section>

                {/* Multiple Dynamic Parameters */}
                <m.section id="multiple-parameters" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Multiple Dynamic Parameters</h2>
                  <p className="text-slate-300 mb-4">
                    Combine multiple dynamic segments in a single route:
                  </p>
                  <CodeBlock 
                    code={`// src/app/api/posts/[category]/[slug].ts → /api/posts/:category/:slug
import { Hono } from 'hono'

const app = new Hono()

app.get('/posts/:category/:slug', (c) => {
  const category = c.req.param('category')
  const slug = c.req.param('slug')
  return c.json({ category, slug })
})

export default app`}
                    filename="src/app/api/posts/[category]/[slug].ts"
                  />
                  <Table 
                    headers={['URL', 'params']}
                    rows={[
                      ['/api/posts/tech/hello-world', '{ category: "tech", slug: "hello-world" }'],
                      ['/api/posts/lifestyle/tips', '{ category: "lifestyle", slug: "tips" }'],
                    ]}
                  />
                </m.section>

                {/* Catch-all Routes */}
                <m.section id="catch-all-routes" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Catch-all Routes</h2>
                  <p className="text-slate-300 mb-4">
                    Use <code className="text-cyan-400">[...name]</code> in the filename to match any number of segments:
                  </p>
                  <CodeBlock 
                    code={`// src/app/api/files/[...path].ts → /api/files/*
import { Hono } from 'hono'

const app = new Hono()

app.all('/files/:path*', (c) => {
  const path = c.req.param('path') || ''
  return c.json({ path, segments: path.split('/').filter(Boolean) })
})

export default app`}
                    filename="src/app/api/files/[...path].ts"
                  />
                  <Table 
                    headers={['URL', 'path value']}
                    rows={[
                      ['/api/files', ''],
                      ['/api/files/images', 'images'],
                      ['/api/files/images/2024', 'images/2024'],
                      ['/api/files/docs/api/reference', 'docs/api/reference'],
                    ]}
                  />
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Global Catch-all</h3>
                  <CodeBlock 
                    code={`// src/app/api/[...catch].ts → /api/*
import { Hono } from 'hono'

const app = new Hono()

app.all('*', (c) => {
  return c.json({ error: 'Not Found', path: c.req.path }, 404)
})

export default app`}
                    filename="src/app/api/[...catch].ts"
                  />
                </m.section>

                {/* Optional Catch-all */}
                <m.section id="optional-catch-all" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Optional Catch-all</h2>
                  <p className="text-slate-300 mb-4">
                    Use <code className="text-cyan-400">[[...name]]</code> to make the catch-all optional:
                  </p>
                  <CodeBlock 
                    code={`// src/app/api/docs/[[...slug]].ts → /api/docs or /api/docs/a/b
import { Hono } from 'hono'

const app = new Hono()

app.get('/docs/:slug*?', (c) => {
  const slug = c.req.param('slug')
  
  if (!slug) {
    return c.json({ message: 'Documentation home' })
  }
  
  return c.json({ path: slug.split('/').filter(Boolean) })
})

export default app`}
                    filename="src/app/api/docs/[[...slug]].ts"
                  />
                  <Table 
                    headers={['URL', 'slug value']}
                    rows={[
                      ['/api/docs', 'undefined (home page)'],
                      ['/api/docs/getting-started', 'getting-started'],
                      ['/api/docs/api/reference', 'api/reference'],
                    ]}
                  />
                </m.section>

                {/* Nested Dynamic Routes */}
                <m.section id="nested-dynamic" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Nested Dynamic Routes</h2>
                  <p className="text-slate-300 mb-4">
                    Combine static and dynamic segments for complex routing:
                  </p>
                  <CodeBlock 
                    code={`// src/app/api/orgs/[orgId]/repos/[repoId]/issues/[issueId].ts
// → /api/orgs/:orgId/repos/:repoId/issues/:issueId
import { Hono } from 'hono'

const app = new Hono()

app.get('/orgs/:orgId/repos/:repoId/issues/:issueId', (c) => {
  const { orgId, repoId, issueId } = c.req.param()
  return c.json({ orgId, repoId, issueId })
})

export default app`}
                    filename="src/app/api/orgs/[orgId]/repos/[repoId]/issues/[issueId].ts"
                  />
                </m.section>

                {/* Query Parameters */}
                <m.section id="query-parameters" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Query Parameters</h2>
                  <p className="text-slate-300 mb-4">
                    Combine dynamic path parameters with query parameters:
                  </p>
                  <CodeBlock 
                    code={`// src/app/api/posts/[id]/comments.ts → /api/posts/:id/comments
import { Hono } from 'hono'

const app = new Hono()

app.get('/posts/:id/comments', (c) => {
  const postId = c.req.param('id')
  const page = parseInt(c.req.query('page') || '1')
  const limit = parseInt(c.req.query('limit') || '10')
  
  return c.json({ postId, page, limit })
})

export default app`}
                    filename="src/app/api/posts/[id]/comments.ts"
                  />
                </m.section>

                {/* Route Priority */}
                <m.section id="route-priority" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Route Priority</h2>
                  <p className="text-slate-300 mb-4">
                    When multiple routes could match a URL, Bini.js resolves them in this order:
                  </p>
                  <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 mb-6">
                    <ol className="list-decimal list-inside space-y-2 text-slate-300">
                      <li><strong className="text-white">Static routes</strong> — exact matches</li>
                      <li><strong className="text-white">Dynamic single segments</strong> — <code className="text-cyan-400">[id]</code></li>
                      <li><strong className="text-white">Catch-all segments</strong> — <code className="text-cyan-400">[...slug]</code></li>
                      <li><strong className="text-white">Optional catch-all</strong> — <code className="text-cyan-400">[[...slug]]</code></li>
                    </ol>
                  </div>
                  <CodeBlock 
                    code={`src/app/api/posts/
├── featured.ts           → /api/posts/featured (static — matched first)
├── [id].ts               → /api/posts/123 (dynamic — matched second)
└── [...slug].ts          → /api/posts/a/b/c (catch-all — matched last)`}
                  />
                  <Note>
                    Routes are sorted by priority and then by path length (shortest first). Static routes always win over dynamic ones.
                  </Note>
                </m.section>

                {/* Complete Example */}
                <m.section id="complete-example" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Complete Example</h2>
                  <p className="text-slate-300 mb-4">
                    A full-featured store API with dynamic routing:
                  </p>
                  <CodeBlock 
                    code={`// src/app/api/store/[[...path]].ts → /api/store or /api/store/*
import { Hono } from 'hono'

const app = new Hono()
const products = new Map()

app.get('/store', (c) => c.json({ products: Array.from(products.values()) }))
app.get('/store/products', (c) => c.json({ products: Array.from(products.values()) }))
app.get('/store/products/:id', (c) => {
  const product = products.get(c.req.param('id'))
  return product ? c.json(product) : c.json({ error: 'Not found' }, 404)
})

app.post('/store/products', async (c) => {
  const body = await c.req.json()
  const id = Date.now().toString()
  const product = { id, ...body }
  products.set(id, product)
  return c.json(product, 201)
})

app.put('/store/products/:id', async (c) => {
  const id = c.req.param('id')
  if (!products.has(id)) return c.json({ error: 'Not found' }, 404)
  const product = { ...products.get(id), ...await c.req.json() }
  products.set(id, product)
  return c.json(product)
})

app.delete('/store/products/:id', (c) => {
  const id = c.req.param('id')
  return products.delete(id)
    ? c.json({ message: 'Deleted' })
    : c.json({ error: 'Not found' }, 404)
})

app.all('/store/*', (c) => c.json({ error: 'Not Found' }, 404))

export default app`}
                    filename="src/app/api/store/[[...path]].ts"
                  />
                </m.section>

                {/* Previous / Next Navigation */}
                <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex items-center justify-between pt-8 mt-8 border-t border-slate-800">
                  <Link to="/docs/api-hono" className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <div>
                      <div className="text-xs text-slate-500">Previous</div>
                      <div className="text-sm font-medium">Hono Integration</div>
                    </div>
                  </Link>
                  <Link to="/docs/api-cors" className="group flex items-center gap-2 text-right text-slate-400 hover:text-white transition-colors">
                    <div>
                      <div className="text-xs text-slate-500">Next</div>
                      <div className="text-sm font-medium">CORS</div>
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