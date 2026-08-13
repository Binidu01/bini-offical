// src/pages/docs/api-hono/page.tsx
import React from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  XCircle,
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
  { id: 'file-based-routing', label: 'File-Based API Routing' },
  { id: 'basic-hono-app', label: 'Basic Hono App' },
  { id: 'routing-with-hono', label: 'Routing with Hono' },
  { id: 'dynamic-api-routes', label: 'Dynamic API Routes' },
  { id: 'middleware', label: 'Middleware' },
  { id: 'request-handling', label: 'Request Handling' },
  { id: 'response-handling', label: 'Response Handling' },
  { id: 'validation', label: 'Validation' },
  { id: 'environment-variables', label: 'Environment Variables' },
  { id: 'error-handling', label: 'Error Handling' },
  { id: 'nested-routes', label: 'Nested Routes' },
  { id: 'when-to-use-hono', label: 'When to Use Hono' },
]

const PAGE_TITLE = 'Hono Integration'
const PAGE_URL = 'https://bini.js.org/docs/api-hono'
const EDIT_URL = 'https://github.com/Binidu01/bini-offical/edit/main/src/app/docs/api-hono.tsx'

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
// Hono Integration Page
// ────────────────────────────────────────────────────────────────────────────────
export default function ApiHonoPage() {
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
                    <p className="text-slate-400 text-sm">Learn how to build powerful APIs with Hono in Bini.js — file-based routing, middleware, and type safety.</p>
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
                    Hono is a fast, lightweight web framework that works everywhere. Bini.js integrates Hono seamlessly with <strong>file-based API routing</strong> — your file structure defines your API routes.
                  </p>
                  <Note>
                    Hono is the <strong>recommended</strong> approach for complex APIs in Bini.js. It provides routing, middleware, validation, and excellent TypeScript support — all with zero-config file-based routing.
                  </Note>
                </motion.section>

                {/* File-Based API Routing */}
                <motion.section id="file-based-routing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">File-Based API Routing</h2>
                  <p className="text-slate-300 mb-4">
                    Your API route is determined by the <strong>file path</strong> inside <code className="text-cyan-400">src/app/api/</code>. The file name becomes the route segment:
                  </p>
                  <Table 
                    headers={['File Path', 'API Route']}
                    rows={[
                      ['src/app/api/hello.ts', '/api/hello'],
                      ['src/app/api/user.ts', '/api/user'],
                      ['src/app/api/posts.ts', '/api/posts'],
                      ['src/app/api/posts/[id].ts', '/api/posts/:id'],
                      ['src/app/api/[...catch].ts', '/api/*'],
                    ]}
                  />
                  <Note>
                    There are <strong>no root / API routes</strong>. Every API file maps to a named route based on its filename. Write your Hono routes <strong>without</strong> the <code>/api</code> prefix — bini-router strips it in dev/preview and mounts the app under <code>/api</code> in production.
                  </Note>
                </motion.section>

                {/* Basic Hono App */}
                <motion.section id="basic-hono-app" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Basic Hono App</h2>
                  <p className="text-slate-300 mb-4">
                    Create a Hono app in <code className="text-cyan-400">src/app/api/</code> and default export it:
                  </p>
                  <CodeBlock 
                    code={`// src/app/api/hello.ts → /api/hello
import { Hono } from 'hono'

const app = new Hono()

app.all('/hello', (c) => {
  return c.json({
    message  : 'Hello from Bini.js!',
    timestamp: new Date().toISOString(),
    method   : c.req.method,
  })
})

export default app`}
                    filename="src/app/api/hello.ts"
                  />
                </motion.section>

                {/* Routing with Hono */}
                <motion.section id="routing-with-hono" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Routing with Hono</h2>
                  <p className="text-slate-300 mb-4">
                    Hono provides a powerful routing system with path parameters, query parameters, and more:
                  </p>
                  <CodeBlock 
                    code={`// src/app/api/users.ts → /api/users
import { Hono } from 'hono'

const app = new Hono()

app.get('/users', (c) => c.json({ users: ['alice', 'bob'] }))
app.get('/users/:id', (c) => c.json({ id: c.req.param('id') }))
app.post('/users', async (c) => c.json({ created: await c.req.json() }, 201))
app.put('/users/:id', async (c) => c.json({ id: c.req.param('id'), ...await c.req.json() }))
app.delete('/users/:id', (c) => c.json({ message: \`Deleted \${c.req.param('id')}\` }))

export default app`}
                    filename="src/app/api/users.ts"
                  />
                  <Table 
                    headers={['Method', 'Route Pattern', 'Full URL']}
                    rows={[
                      ['GET', '/users', '/api/users'],
                      ['GET', '/users/:id', '/api/users/123'],
                      ['POST', '/users', '/api/users'],
                      ['PUT', '/users/:id', '/api/users/123'],
                      ['DELETE', '/users/:id', '/api/users/123'],
                    ]}
                  />
                </motion.section>

                {/* Dynamic API Routes */}
                <motion.section id="dynamic-api-routes" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Dynamic API Routes</h2>
                  <p className="text-slate-300 mb-4">
                    Use <code className="text-cyan-400">[param]</code> in filenames for dynamic segments:
                  </p>
                  <CodeBlock 
                    code={`// src/app/api/posts/[id].ts → /api/posts/:id
import { Hono } from 'hono'

const app = new Hono()
app.get('/posts/:id', (c) => c.json({ id: c.req.param('id') }))
export default app`}
                    filename="src/app/api/posts/[id].ts"
                  />
                  <CodeBlock 
                    code={`// src/app/api/[...catch].ts → /api/*
import { Hono } from 'hono'

const app = new Hono()
app.all('*', (c) => c.json({ path: c.req.path }))
export default app`}
                    filename="src/app/api/[...catch].ts"
                  />
                </motion.section>

                {/* Middleware */}
                <motion.section id="middleware" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Middleware</h2>
                  <p className="text-slate-300 mb-4">
                    Hono has built-in middleware for common tasks:
                  </p>
                  <CodeBlock 
                    code={`// src/app/api/secure.ts → /api/secure
import { Hono } from 'hono'
import { cors, logger, jwt, timeout } from 'hono/middleware'

const app = new Hono()

app.use('*', cors())
app.use('*', logger())
app.use('*', timeout(5000))

app.get('/secure', (c) => c.json({ message: 'Public' }))

export default app`}
                    filename="src/app/api/secure.ts"
                  />
                  <Table 
                    headers={['Middleware', 'Purpose']}
                    rows={[
                      ['cors', 'Cross-Origin Resource Sharing'],
                      ['logger', 'Request logging'],
                      ['jwt', 'JWT authentication'],
                      ['timeout', 'Request timeout'],
                      ['prettyJSON', 'Pretty JSON responses'],
                    ]}
                  />
                </motion.section>

                {/* Request Handling */}
                <motion.section id="request-handling" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Request Handling</h2>
                  <p className="text-slate-300 mb-4">
                    Hono provides convenient methods for accessing request data:
                  </p>
                  <CodeBlock 
                    code={`// src/app/api/echo.ts → /api/echo
import { Hono } from 'hono'

const app = new Hono()

app.all('/echo', async (c) => {
  const params = c.req.param()
  const query = c.req.query()
  const page = c.req.query('page')
  const userAgent = c.req.header('User-Agent')
  const body = await c.req.json().catch(() => null)
  
  return c.json({
    method: c.req.method,
    path: c.req.path,
    params,
    query: { page, ...query },
    headers: { userAgent },
    body,
  })
})

export default app`}
                    filename="src/app/api/echo.ts"
                  />
                </motion.section>

                {/* Response Handling */}
                <motion.section id="response-handling" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Response Handling</h2>
                  <p className="text-slate-300 mb-4">
                    Hono provides flexible response methods:
                  </p>
                  <CodeBlock 
                    code={`// src/app/api/responses.ts → /api/responses
import { Hono } from 'hono'

const app = new Hono()

app.get('/json', (c) => c.json({ message: 'Hello' }))
app.get('/text', (c) => c.text('Hello Text'))
app.get('/html', (c) => c.html('<h1>Hello</h1>'))
app.get('/redirect', (c) => c.redirect('https://example.com', 302))
app.post('/created', (c) => c.json({ message: 'Created' }, 201))
app.get('/error', (c) => c.json({ error: 'Error' }, 500))

export default app`}
                    filename="src/app/api/responses.ts"
                  />
                </motion.section>

                {/* Validation */}
                <motion.section id="validation" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Validation</h2>
                  <p className="text-slate-300 mb-4">
                    Validate incoming requests with Zod:
                  </p>
                  <CodeBlock 
                    code={`// src/app/api/posts.ts → /api/posts
import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

const app = new Hono()

const postSchema = z.object({
  title: z.string().min(1).max(100),
  content: z.string().min(1),
})

app.post('/posts', zValidator('json', postSchema), async (c) => {
  const body = c.req.valid('json')
  return c.json({ post: { id: Date.now(), ...body } }, 201)
})

export default app`}
                    filename="src/app/api/posts.ts"
                  />
                  <Note>
                    Install <code>zod</code> and <code>@hono/zod-validator</code> for powerful request validation with TypeScript inference.
                  </Note>
                </motion.section>

                {/* Environment Variables */}
                <motion.section id="environment-variables" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Environment Variables</h2>
                  <p className="text-slate-300 mb-4">
                    Use <code className="text-cyan-400">getEnv()</code> and <code className="text-cyan-400">requireEnv()</code> from <code className="text-cyan-400">bini-env</code>:
                  </p>
                  <CodeBlock 
                    code={`// src/app/api/config.ts → /api/config
import { Hono } from 'hono'

const app = new Hono()

app.get('/config', (c) => {
  const ctx = c as any
  const apiKey = requireEnv(ctx, 'MY_API_KEY')
  const appName = getEnv(ctx, 'APP_NAME') ?? 'Bini.js'
  
  return c.json({ appName, hasApiKey: !!apiKey })
})

export default app`}
                    filename="src/app/api/config.ts"
                  />
                  <Note>
                    Cast <code>c</code> once at the top of your handler with <code>const ctx = c as any</code>. Then use <code>requireEnv(ctx, 'KEY')</code> for required vars and <code>getEnv(ctx, 'KEY') ?? 'default'</code> for optional ones.
                  </Note>
                </motion.section>

                {/* Error Handling */}
                <motion.section id="error-handling" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Error Handling</h2>
                  <p className="text-slate-300 mb-4">
                    Handle errors gracefully with Hono's error handling:
                  </p>
                  <CodeBlock 
                    code={`// src/app/api/robust.ts → /api/robust
import { Hono } from 'hono'

const app = new Hono()

app.onError((err, c) => {
  const isDev = getEnv(c as any, 'NODE_ENV') === 'development'
  return c.json({
    error: 'Internal Server Error',
    ...(isDev && { details: err.message }),
  }, 500)
})

app.notFound((c) => c.json({ error: 'Not Found' }, 404))

app.get('/robust/users/:id', (c) => {
  const id = c.req.param('id')
  if (id === 'admin') {
    return c.json({ error: 'Access denied' }, 403)
  }
  return c.json({ id, name: 'John' })
})

export default app`}
                    filename="src/app/api/robust.ts"
                  />
                </motion.section>

                {/* Nested Routes */}
                <motion.section id="nested-routes" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Nested Routes</h2>
                  <p className="text-slate-300 mb-4">
                    Organize complex APIs with nested sub-routers:
                  </p>
                  <CodeBlock 
                    code={`// src/app/api/index.ts → /api
import { Hono } from 'hono'

const app = new Hono()

const users = new Hono()
  .get('/users', (c) => c.json({ users: [] }))
  .get('/users/:id', (c) => c.json({ id: c.req.param('id') }))

const posts = new Hono()
  .get('/posts', (c) => c.json({ posts: [] }))
  .get('/posts/:id', (c) => c.json({ id: c.req.param('id') }))

app.route('/', users)
app.route('/', posts)

export default app`}
                    filename="src/app/api/index.ts"
                  />
                </motion.section>

                {/* When to Use Hono */}
                <motion.section id="when-to-use-hono" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">When to Use Hono</h2>
                  <Table 
                    headers={['Scenario', 'Recommendation']}
                    rows={[
                      ['Multiple endpoints in one file', <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Hono</span>],
                      ['Need middleware (CORS, auth, logging)', <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Hono</span>],
                      ['Complex routing patterns', <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Hono</span>],
                      ['Production APIs with many routes', <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Hono</span>],
                      ['Single endpoint with simple logic', <span className="flex items-center gap-1"><XCircle className="w-3.5 h-3.5 text-rose-400" /> Plain handler</span>],
                      ['Quick prototypes', <span className="flex items-center gap-1"><XCircle className="w-3.5 h-3.5 text-rose-400" /> Plain handler</span>],
                    ]}
                  />
                </motion.section>

                {/* Previous / Next Navigation */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }} className="flex items-center justify-between pt-8 mt-8 border-t border-slate-800">
                  <Link to="/docs/api-plain" className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <div>
                      <div className="text-xs text-slate-500">Previous</div>
                      <div className="text-sm font-medium">Plain Function Handlers</div>
                    </div>
                  </Link>
                  <Link to="/docs/api-dynamic" className="group flex items-center gap-2 text-right text-slate-400 hover:text-white transition-colors">
                    <div>
                      <div className="text-xs text-slate-500">Next</div>
                      <div className="text-sm font-medium">Dynamic API Routes</div>
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