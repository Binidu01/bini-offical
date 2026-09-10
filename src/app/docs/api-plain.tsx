// src/pages/docs/api-plain/page.tsx
import React from 'react'
import { m } from 'framer-motion'
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
  { id: 'basic-handler', label: 'Basic Handler' },
  { id: 'route-mapping', label: 'Route Mapping' },
  { id: 'handling-methods', label: 'Handling HTTP Methods' },
  { id: 'reading-request', label: 'Reading Request Data' },
  { id: 'sending-responses', label: 'Sending Responses' },
  { id: 'dynamic-routes', label: 'Dynamic Routes' },
  { id: 'catch-all', label: 'Catch-all Routes' },
  { id: 'environment-variables', label: 'Environment Variables' },
  { id: 'error-handling', label: 'Error Handling' },
  { id: 'when-to-use', label: 'When to Use Plain Handlers' },
  { id: 'complete-example', label: 'Complete Example' },
]

const PAGE_TITLE = 'Plain Function Handlers'
const PAGE_URL = 'https://bini.js.org/docs/api-plain'
const EDIT_URL = 'https://github.com/Binidu01/bini-offical/edit/main/src/app/docs/api-plain.tsx'

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
// Plain Function Handlers Page
// ────────────────────────────────────────────────────────────────────────────────
export default function ApiPlainPage() {
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
                    <p className="text-slate-400 text-sm">Learn how to create simple API endpoints using plain JavaScript functions in Bini.js.</p>
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
                    Plain function handlers are the simplest way to create API routes in Bini.js. They're perfect for simple endpoints that don't need complex routing or middleware.
                  </p>
                  <Note>
                    <strong>File-based routing:</strong> Your file path determines the API route. A file at <code>src/app/api/hello.ts</code> is served at <code>/api/hello</code>. There are no root <code>/</code> API routes — every file maps to a named route based on its filename.
                  </Note>
                </m.section>

                {/* Basic Handler */}
                <m.section id="basic-handler" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Basic Handler</h2>
                  <p className="text-slate-300 mb-4">
                    Export a default function that receives the <code className="text-cyan-400">Request</code> object. The function name doesn't matter — only the file path determines the route:
                  </p>
                  <CodeBlock 
                    code={`// src/app/api/hello.ts → /api/hello
export default function handler(req: Request) {
  return Response.json({ message: 'hello', method: req.method })
}`}
                    filename="src/app/api/hello.ts"
                  />
                  <p className="text-slate-300 mt-4">
                    This creates an endpoint at <code className="text-cyan-400">/api/hello</code> that responds to all HTTP methods.
                  </p>
                </m.section>

                {/* Route Mapping */}
                <m.section id="route-mapping" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Route Mapping</h2>
                  <p className="text-slate-300 mb-4">
                    Your file structure directly maps to API routes:
                  </p>
                  <Table 
                    headers={['File Path', 'API Route']}
                    rows={[
                      ['src/app/api/hello.ts', '/api/hello'],
                      ['src/app/api/user.ts', '/api/user'],
                      ['src/app/api/posts.ts', '/api/posts'],
                      ['src/app/api/posts/[id].ts', '/api/posts/:id'],
                      ['src/app/api/posts/index.ts', '/api/posts'],
                      ['src/app/api/[...catch].ts', '/api/*'],
                    ]}
                  />
                </m.section>

                {/* Handling Methods */}
                <m.section id="handling-methods" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Handling HTTP Methods</h2>
                  <p className="text-slate-300 mb-4">
                    Check <code className="text-cyan-400">request.method</code> to handle different HTTP verbs:
                  </p>
                  <CodeBlock 
                    code={`// src/app/api/posts.ts → /api/posts
export default function handler(request: Request) {
  if (request.method === 'GET') {
    return Response.json({ posts: [] })
  }
  if (request.method === 'POST') {
    return Response.json({ message: 'Post created' }, { status: 201 })
  }
  if (request.method === 'PUT') {
    return Response.json({ message: 'Post updated' })
  }
  if (request.method === 'DELETE') {
    return Response.json({ message: 'Post deleted' })
  }
  return Response.json({ error: 'Method not allowed' }, { status: 405 })
}`}
                    filename="src/app/api/posts.ts"
                  />
                  <Table 
                    headers={['Method', 'Typical Use']}
                    rows={[
                      ['GET', 'Retrieve data'],
                      ['POST', 'Create new data'],
                      ['PUT', 'Replace existing data'],
                      ['PATCH', 'Partially update data'],
                      ['DELETE', 'Remove data'],
                    ]}
                  />
                </m.section>

                {/* Reading Request */}
                <m.section id="reading-request" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Reading Request Data</h2>
                  <p className="text-slate-300 mb-4">
                    Access different parts of the incoming request:
                  </p>
                  <CodeBlock 
                    code={`// src/app/api/echo.ts → /api/echo
export default async function handler(request: Request) {
  const body = await request.json().catch(() => null)
  const userAgent = request.headers.get('User-Agent')
  const url = new URL(request.url)
  const page = url.searchParams.get('page')
  
  return Response.json({
    method: request.method,
    body,
    headers: { userAgent },
    query: { page },
  })
}`}
                    filename="src/app/api/echo.ts"
                  />
                </m.section>

                {/* Sending Responses */}
                <m.section id="sending-responses" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Sending Responses</h2>
                  <p className="text-slate-300 mb-4">
                    Return different types of responses:
                  </p>
                  <CodeBlock 
                    code={`// src/app/api/responses.ts → /api/responses
export default function handler(request: Request) {
  // JSON response
  return Response.json({ message: 'Hello JSON' })
  
  // Plain text response
  return new Response('Hello Text', {
    headers: { 'Content-Type': 'text/plain' }
  })
  
  // Response with custom status
  return Response.json(
    { message: 'Created' }, 
    { status: 201 }
  )
  
  // Redirect response
  return Response.redirect('https://example.com', 302)
}`}
                    filename="src/app/api/responses.ts"
                  />
                </m.section>

                {/* Dynamic Routes */}
                <m.section id="dynamic-routes" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Dynamic Routes</h2>
                  <p className="text-slate-300 mb-4">
                    For dynamic routes, parameters are passed via the <code className="text-cyan-400">x-bini-params</code> header:
                  </p>
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

                {/* Catch-all */}
                <m.section id="catch-all" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Catch-all Routes</h2>
                  <p className="text-slate-300 mb-4">
                    Handle all unmatched API routes with <code className="text-cyan-400">[...catch]</code>:
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
                </m.section>

                {/* Environment Variables */}
                <m.section id="environment-variables" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Environment Variables</h2>
                  <p className="text-slate-300 mb-4">
                    Use <code className="text-cyan-400">getEnv()</code> and <code className="text-cyan-400">requireEnv()</code> — both are auto-imported in API routes:
                  </p>
                  <CodeBlock 
                    code={`// src/app/api/config.ts → /api/config
import { getEnv, requireEnv } from 'bini-env'

export default function handler(request: Request) {
  const apiKey = requireEnv('MY_API_KEY')
  const debug = getEnv('DEBUG_MODE') ?? 'false'
  const appName = getEnv('APP_NAME') ?? 'Bini.js'
  
  return Response.json({ appName, debug: debug === 'true' })
}`}
                    filename="src/app/api/config.ts"
                  />
                  <Note>
                    <code>getEnv</code> and <code>requireEnv</code> read from the Hono request context, resolving from the correct source on every platform automatically — Node.js, Bun, Deno, Vercel Edge, Netlify Edge, or Cloudflare Workers.
                  </Note>
                  <Table 
                    headers={['Function', 'Returns', 'Behavior']}
                    rows={[
                      ['getEnv(key)', 'string | undefined', 'Returns undefined if missing — use ?? for defaults'],
                      ['requireEnv(key)', 'string', 'Throws immediately if missing or empty'],
                    ]}
                  />
                </m.section>

                {/* Error Handling */}
                <m.section id="error-handling" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Error Handling</h2>
                  <p className="text-slate-300 mb-4">
                    Properly handle errors in your API routes:
                  </p>
                  <CodeBlock 
                    code={`// src/app/api/safe.ts → /api/safe
import { getEnv } from 'bini-env'

export default async function handler(request: Request) {
  try {
    const body = await request.json()
    
    if (!body.email) {
      return Response.json(
        { error: 'Email is required' }, 
        { status: 400 }
      )
    }
    
    return Response.json({ success: true })
    
  } catch (error: any) {
    const isDev = getEnv('NODE_ENV') === 'development'
    return Response.json(
      { 
        error: 'Internal Server Error',
        ...(isDev && { details: error.message })
      }, 
      { status: 500 }
    )
  }
}`}
                    filename="src/app/api/safe.ts"
                  />
                </m.section>

                {/* When to Use */}
                <m.section id="when-to-use" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">When to Use Plain Handlers</h2>
                  <Table 
                    headers={['Scenario', 'Recommendation']}
                    rows={[
                      ['Single endpoint with simple logic', <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Plain handler</span>],
                      ['Quick prototypes', <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Plain handler</span>],
                      ['Simple CRUD operations', <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Plain handler</span>],
                      ['Multiple endpoints in one file', <span className="flex items-center gap-1"><XCircle className="w-3.5 h-3.5 text-rose-400" /> Use Hono</span>],
                      ['Need middleware', <span className="flex items-center gap-1"><XCircle className="w-3.5 h-3.5 text-rose-400" /> Use Hono</span>],
                      ['Complex routing patterns', <span className="flex items-center gap-1"><XCircle className="w-3.5 h-3.5 text-rose-400" /> Use Hono</span>],
                      ['Production APIs with many routes', <span className="flex items-center gap-1"><XCircle className="w-3.5 h-3.5 text-rose-400" /> Use Hono</span>],
                    ]}
                  />
                  <Note>
                    Start with plain handlers for simple endpoints. Switch to Hono when you need middleware, complex routing, or better organization.
                  </Note>
                </m.section>

                {/* Complete Example */}
                <m.section id="complete-example" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Complete Example</h2>
                  <p className="text-slate-300 mb-4">
                    A full-featured plain function handler with validation, error handling, and multiple methods:
                  </p>
                  <CodeBlock 
                    code={`// src/app/api/todos.ts → /api/todos
import { getEnv } from 'bini-env'

const todos: any[] = []

export default async function handler(request: Request) {
  const url = new URL(request.url)
  const id = url.searchParams.get('id')
  
  try {
    // GET /api/todos — list all todos
    if (request.method === 'GET' && !id) {
      return Response.json(todos)
    }
    
    // GET /api/todos?id=123 — get single todo
    if (request.method === 'GET' && id) {
      const todo = todos.find(t => t.id === id)
      if (!todo) {
        return Response.json({ error: 'Todo not found' }, { status: 404 })
      }
      return Response.json(todo)
    }
    
    // POST /api/todos — create a new todo
    if (request.method === 'POST') {
      const body = await request.json()
      
      if (!body.title) {
        return Response.json(
          { error: 'Title is required' }, 
          { status: 400 }
        )
      }
      
      const todo = { id: Date.now().toString(), title: body.title, completed: false }
      todos.push(todo)
      return Response.json(todo, { status: 201 })
    }
    
    // DELETE /api/todos?id=123 — delete a todo
    if (request.method === 'DELETE' && id) {
      const index = todos.findIndex(t => t.id === id)
      if (index === -1) {
        return Response.json({ error: 'Todo not found' }, { status: 404 })
      }
      todos.splice(index, 1)
      return Response.json({ message: 'Todo deleted' })
    }
    
    return Response.json({ error: 'Method not allowed' }, { status: 405 })
    
  } catch (error: any) {
    const isDev = getEnv('NODE_ENV') === 'development'
    return Response.json(
      { 
        error: 'Internal Server Error',
        ...(isDev && { details: error.message })
      }, 
      { status: 500 }
    )
  }
}`}
                    filename="src/app/api/todos.ts"
                  />
                </m.section>

                {/* Previous / Next Navigation */}
                <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }} className="flex items-center justify-between pt-8 mt-8 border-t border-slate-800">
                  <Link to="/docs/api-routes" className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <div>
                      <div className="text-xs text-slate-500">Previous</div>
                      <div className="text-sm font-medium">API Routes Overview</div>
                    </div>
                  </Link>
                  <Link to="/docs/api-hono" className="group flex items-center gap-2 text-right text-slate-400 hover:text-white transition-colors">
                    <div>
                      <div className="text-xs text-slate-500">Next</div>
                      <div className="text-sm font-medium">Hono Integration</div>
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