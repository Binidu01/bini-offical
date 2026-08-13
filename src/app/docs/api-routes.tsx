// src/pages/docs/api-routes/page.tsx
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
  { id: 'file-structure', label: 'File Structure' },
  { id: 'plain-function-handler', label: 'Plain Function Handler' },
  { id: 'hono-integration', label: 'Hono Integration' },
  { id: 'hono-middleware', label: 'Hono Middleware' },
  { id: 'dynamic-api-routes', label: 'Dynamic API Routes' },
  { id: 'catch-all-api-routes', label: 'Catch-all API Routes' },
  { id: 'environment-variables', label: 'Environment Variables' },
  { id: 'request-response', label: 'Request & Response' },
  { id: 'cors', label: 'CORS' },
  { id: 'deployment', label: 'Deployment' },
]

const PAGE_TITLE = 'API Routes Overview'
const PAGE_URL = 'https://bini.js.org/docs/api-routes'
const EDIT_URL = 'https://github.com/Binidu01/bini-offical/edit/main/src/app/docs/api-routes.tsx'

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
// API Routes Page
// ────────────────────────────────────────────────────────────────────────────────
export default function ApiRoutesPage() {
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
                    <p className="text-slate-400 text-sm">Learn how to create backend API endpoints in Bini.js using plain functions or Hono.</p>
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
                    Bini.js allows you to create API endpoints directly in your project. Place files in <code className="text-cyan-400">src/app/api/</code> and they automatically become API routes at <code className="text-cyan-400">/api/*</code>. The filename maps directly to the route — <code className="text-cyan-400">hello.ts</code> becomes <code className="text-cyan-400">/api/hello</code>, <code className="text-cyan-400">users.ts</code> becomes <code className="text-cyan-400">/api/users</code>.
                  </p>
                  <Note>
                    <strong>Important:</strong> Every API route file <strong>must</strong> have a <code>default</code> export. Bini.js uses the default export to handle requests. Named exports will <strong>not</strong> work.
                  </Note>
                </motion.section>

                {/* File Structure */}
                <motion.section id="file-structure" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">File Structure</h2>
                  <p className="text-slate-300 mb-4">
                    The filename (without extension) becomes the last segment of the URL path under <code className="text-cyan-400">/api/</code>:
                  </p>
                  <CodeBlock 
                    code={`src/app/
├── api/
│   ├── hello.ts           → /api/hello
│   ├── users.ts           → /api/users
│   ├── posts/
│   │   ├── index.ts       → /api/posts
│   │   └── [id].ts        → /api/posts/:id
│   └── [...catch].ts      → /api/* (catch-all)
├── layout.tsx
└── page.tsx`}
                  />
                  <Note>
                    There is no root <code>/api</code> route. Every API file maps to a named path — use <code>posts/index.ts</code> if you need a route at <code>/api/posts</code>.
                  </Note>
                </motion.section>

                {/* Plain Function Handler */}
                <motion.section id="plain-function-handler" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Plain Function Handler</h2>
                  <p className="text-slate-300 mb-4">
                    The simplest way to create an API route is to default export a handler function that checks the HTTP method:
                  </p>
                  <CodeBlock 
                    code={`// src/app/api/hello.ts → /api/hello
export default function handler(request: Request) {
  if (request.method === 'GET') {
    return Response.json({ message: 'Hello World' })
  }
  if (request.method === 'POST') {
    return Response.json({ message: 'Created' }, { status: 201 })
  }
  return Response.json({ error: 'Method not allowed' }, { status: 405 })
}`}
                    filename="src/app/api/hello.ts"
                  />
                  <p className="text-slate-300 mt-4">
                    The handler receives the native <code className="text-cyan-400">Request</code> object. Check <code className="text-cyan-400">request.method</code> to handle different HTTP verbs.
                  </p>
                  <Note>
                    For APIs with multiple endpoints or complex logic, Hono is recommended over plain functions.
                  </Note>
                </motion.section>

                {/* Hono Integration */}
                <motion.section id="hono-integration" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Hono Integration</h2>
                  <p className="text-slate-300 mb-4">
                    For more complex APIs, use Hono. Create a Hono app and default export it. Write routes <strong className="text-white">without</strong> the <code className="text-cyan-400">/api</code> prefix — bini-router strips it before your handler sees the request.
                  </p>
                  <CodeBlock 
                    code={`// src/app/api/users.ts → /api/users
import { Hono } from 'hono'

const app = new Hono()

app.get('/users', (c) => {
  return c.json({ users: ['alice', 'bob', 'charlie'] })
})

app.post('/users', async (c) => {
  const body = await c.req.json()
  return c.json({ created: body }, { status: 201 })
})

app.get('/users/:id', (c) => {
  const id = c.req.param('id')
  return c.json({ id, name: \`User \${id}\` })
})

export default app`}
                    filename="src/app/api/users.ts"
                  />
                  <Note>
                    Hono is the recommended approach for complex APIs. It provides routing, middleware, validation, and better TypeScript support.
                  </Note>
                </motion.section>

                {/* Hono Middleware */}
                <motion.section id="hono-middleware" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Hono Middleware</h2>
                  <p className="text-slate-300 mb-4">
                    Hono provides built-in middleware for common tasks:
                  </p>
                  <CodeBlock 
                    code={`// src/app/api/secure.ts → /api/secure
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

const app = new Hono()

app.use('*', cors())
app.use('*', logger())

app.get('/secure', (c) => c.json({ message: 'Public endpoint' }))

export default app`}
                    filename="src/app/api/secure.ts"
                  />
                  <Table 
                    headers={['Middleware', 'Purpose']}
                    rows={[
                      ['cors', 'Cross-Origin Resource Sharing'],
                      ['logger', 'Request logging'],
                      ['jwt', 'JWT authentication'],
                      ['prettyJSON', 'Pretty JSON responses'],
                      ['timeout', 'Request timeout'],
                    ]}
                  />
                </motion.section>

                {/* Dynamic API Routes */}
                <motion.section id="dynamic-api-routes" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Dynamic API Routes</h2>
                  <p className="text-slate-300 mb-4">
                    Use square brackets for dynamic segments, just like page routes:
                  </p>
                  <CodeBlock 
                    code={`// src/app/api/posts/[id].ts → /api/posts/:id
import { Hono } from 'hono'

const app = new Hono()

app.get('/posts/:id', (c) => {
  const id = c.req.param('id')
  return c.json({ id, title: \`Post \${id}\` })
})

export default app`}
                    filename="src/app/api/posts/[id].ts"
                  />
                  <p className="text-slate-300 mt-4">
                    For plain function handlers with dynamic routes, parameters are passed via the <code className="text-cyan-400">x-bini-params</code> header:
                  </p>
                  <CodeBlock 
                    code={`// src/app/api/posts/[id].ts → /api/posts/:id
export default function handler(request: Request) {
  const paramsHeader = request.headers.get('x-bini-params')
  const params = paramsHeader ? JSON.parse(paramsHeader) : {}
  const id = params.id
  
  return Response.json({ id, title: \`Post \${id}\` })
}`}
                    filename="src/app/api/posts/[id].ts"
                  />
                </motion.section>

                {/* Catch-all API Routes */}
                <motion.section id="catch-all-api-routes" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Catch-all API Routes</h2>
                  <p className="text-slate-300 mb-4">
                    Use <code className="text-cyan-400">[...catch]</code> to handle all unmatched API routes:
                  </p>
                  <CodeBlock 
                    code={`// src/app/api/[...catch].ts → /api/*
export default function handler(request: Request) {
  const url = new URL(request.url)
  return Response.json({
    error: 'Not Found',
    path: url.pathname,
    method: request.method,
  }, { status: 404 })
}`}
                    filename="src/app/api/[...catch].ts"
                  />
                </motion.section>

                {/* Environment Variables */}
                <motion.section id="environment-variables" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Environment Variables</h2>
                  <p className="text-slate-300 mb-4">
                    API routes use <code className="text-cyan-400">getEnv(c, key)</code> and <code className="text-cyan-400">requireEnv(c, key)</code> from <code className="text-cyan-400">bini-env</code>. Both read directly from the Hono request context — they work across every runtime without code changes.
                  </p>
                  <Note>
                    Always pass <code>c</code> explicitly. Cast it once at the top as <code>const ctx = c as any</code>, then use <code>ctx</code> throughout.
                  </Note>
                  <CodeBlock 
                    code={`// src/app/api/email.ts → /api/email
import { Hono } from 'hono'
import { getEnv, requireEnv } from 'bini-env'

const app = new Hono()

app.post('/email', async (c) => {
  const ctx = c as any
  
  const smtpHost = requireEnv(ctx, 'SMTP_HOST')
  const smtpPass = requireEnv(ctx, 'SMTP_PASS')
  const smtpPort = parseInt(getEnv(ctx, 'SMTP_PORT') ?? '587')
  
  return c.json({ success: true })
})

export default app`}
                    filename="src/app/api/email.ts"
                  />
                  <p className="text-slate-300 mb-4">
                    The pattern in three steps:
                  </p>
                  <CodeBlock
                    code={`const ctx = c as any              // cast once
requireEnv(ctx, 'KEY')            // throws if missing
getEnv(ctx, 'KEY') ?? 'default'   // optional with default`}
                  />
                </motion.section>

                {/* Request & Response */}
                <motion.section id="request-response" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Request & Response</h2>
                  <p className="text-slate-300 mb-4">
                    API routes use standard Web APIs for requests and responses:
                  </p>
                  <CodeBlock 
                    code={`export default async function handler(request: Request) {
  const json = await request.json()
  const auth = request.headers.get('Authorization')
  const { searchParams } = new URL(request.url)
  const page = searchParams.get('page')
  
  return Response.json({ data: json, page })
}`}
                  />
                </motion.section>

                {/* CORS */}
                <motion.section id="cors" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">CORS</h2>
                  <p className="text-slate-300 mb-4">
                    CORS is enabled by default for all API routes:
                  </p>
                  <CodeBlock 
                    code={`// vite.config.ts
import { defineConfig } from 'vite'
import { biniroute } from 'bini-router'

export default defineConfig({
  plugins: [
    biniroute({
      cors: true,  // Default: true
    }),
  ],
})`}
                    filename="vite.config.ts"
                  />
                  <p className="text-slate-300 mt-4">
                    With Hono, configure CORS per route:
                  </p>
                  <CodeBlock 
                    code={`import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()
app.use('*', cors({ origin: 'https://myapp.com' }))
export default app`}
                  />
                </motion.section>

                {/* Deployment */}
                <motion.section id="deployment" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Deployment</h2>
                  <p className="text-slate-300 mb-4">
                    API routes work across all deployment platforms. To deploy, run:
                  </p>
                  <CodeBlock 
                    code={`npm run deploy`}
                  />
                  <p className="text-slate-300 mb-4">
                    This will prompt you to select your hosting platform:
                  </p>
                  <ul className="space-y-2 text-slate-300 mb-4 list-disc list-inside">
                    <li><strong className="text-white">Node.js</strong> — Runs via bini-server</li>
                    <li><strong className="text-white">Netlify</strong> — Edge Functions (Deno)</li>
                    <li><strong className="text-white">Vercel</strong> — Edge Runtime</li>
                    <li><strong className="text-white">Cloudflare</strong> — Workers</li>
                    <li><strong className="text-white">Deno</strong> — Deno Deploy</li>
                  </ul>
                  <Note>
                    Run <code>npm run deploy</code> and select your platform. bini-deploy will generate the appropriate entry files and configuration for your chosen platform.
                  </Note>
                </motion.section>

                {/* Previous / Next Navigation */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }} className="flex items-center justify-between pt-8 mt-8 border-t border-slate-800">
                  <Link to="/docs/icons" className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <div>
                      <div className="text-xs text-slate-500">Previous</div>
                      <div className="text-sm font-medium">Icons & Favicons</div>
                    </div>
                  </Link>
                  <Link to="/docs/api-plain" className="group flex items-center gap-2 text-right text-slate-400 hover:text-white transition-colors">
                    <div>
                      <div className="text-xs text-slate-500">Next</div>
                      <div className="text-sm font-medium">Plain Function Handlers</div>
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