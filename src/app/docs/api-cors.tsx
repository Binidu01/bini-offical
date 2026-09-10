// src/pages/docs/api-cors/page.tsx
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
  { id: 'what-is-cors', label: 'What is CORS?' },
  { id: 'default-config', label: 'Default Configuration' },
  { id: 'disabling-cors', label: 'Disabling CORS' },
  { id: 'cors-with-hono', label: 'CORS with Hono' },
  { id: 'custom-cors', label: 'Custom CORS Configuration' },
  { id: 'production-deployment', label: 'Production Deployment' },
]

const PAGE_TITLE = 'CORS'
const PAGE_URL = 'https://bini.js.org/docs/api-cors'
const EDIT_URL = 'https://github.com/Binidu01/bini-offical/edit/main/src/app/docs/api-cors.tsx'

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
// CORS Page
// ────────────────────────────────────────────────────────────────────────────────
export default function ApiCorsPage() {
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
                    <p className="text-slate-400 text-sm">Learn how to configure Cross-Origin Resource Sharing (CORS) for your API routes.</p>
                  </div>
                  <div className="shrink-0 pt-2 hidden sm:block">
                    <CopyPageButton pageUrl={PAGE_URL} pageTitle={PAGE_TITLE} />
                  </div>
                </m.div>
                {/* Copy button on small screens */}
                <div className="sm:hidden mb-8">
                  <CopyPageButton pageUrl={PAGE_URL} pageTitle={PAGE_TITLE} />
                </div>

                {/* What is CORS? */}
                <m.section id="what-is-cors" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">What is CORS?</h2>
                  <p className="text-slate-300 mb-4">
                    Cross-Origin Resource Sharing (CORS) is a security feature implemented by browsers that restricts web pages from making requests to a different domain than the one that served the web page. CORS headers allow servers to specify which origins are permitted to access their resources.
                  </p>
                  <p className="text-slate-300 mb-4">
                    Bini.js includes built-in CORS support for API routes, making it easy to build APIs that can be accessed from different origins.
                  </p>
                </m.section>

                {/* Default Configuration */}
                <m.section id="default-config" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Default Configuration</h2>
                  <p className="text-slate-300 mb-4">
                    CORS is enabled by default for all API routes in dev and preview. The default configuration includes:
                  </p>
                  <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 mb-6">
                    <ul className="space-y-2 text-slate-300">
                      <li><strong className="text-white">Access-Control-Allow-Origin:</strong> <code className="text-cyan-400">*</code> (all origins)</li>
                      <li><strong className="text-white">Access-Control-Allow-Methods:</strong> <code className="text-cyan-400">GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD</code></li>
                      <li><strong className="text-white">Access-Control-Allow-Headers:</strong> <code className="text-cyan-400">Content-Type, Authorization, X-Request-ID</code></li>
                      <li><strong className="text-white">Access-Control-Max-Age:</strong> <code className="text-cyan-400">86400</code> (24 hours for preflight requests)</li>
                    </ul>
                  </div>
                  <Note>
                    This default configuration works for most development and production scenarios. You can customize it to restrict origins or configure specific headers.
                  </Note>
                </m.section>

                {/* Disabling CORS */}
                <m.section id="disabling-cors" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Disabling CORS</h2>
                  <p className="text-slate-300 mb-4">
                    Disable CORS by setting <code className="text-cyan-400">cors: false</code> in your <code className="text-cyan-400">biniroute()</code> configuration:
                  </p>
                  <CodeBlock 
                    code={`// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { biniroute } from 'bini-router'

export default defineConfig({
  plugins: [
    react(),
    biniroute({
      cors: false, // Disable CORS for all API routes
    }),
  ],
})`}
                    filename="vite.config.ts"
                  />
                  <Note>
                    Disabling CORS is useful for internal APIs or when you're handling CORS at the infrastructure level (e.g., via a reverse proxy or CDN).
                  </Note>
                </m.section>

                {/* CORS with Hono */}
                <m.section id="cors-with-hono" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">CORS with Hono</h2>
                  <p className="text-slate-300 mb-4">
                    When using Hono for your API routes, you can configure CORS per route or globally using Hono's <code className="text-cyan-400">cors</code> middleware:
                  </p>
                  <CodeBlock 
                    code={`// src/app/api/users.ts
import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

// Global CORS for all routes in this file
app.use('*', cors({
  origin: 'https://myapp.com',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400,
}))

app.get('/users', (c) => c.json({ users: [] }))
app.post('/users', async (c) => c.json({ created: await c.req.json() }, 201))

export default app`}
                    filename="src/app/api/users.ts"
                  />
                  <CodeBlock 
                    code={`// src/app/api/public.ts
import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

// Route-specific CORS
app.use('/public/*', cors({
  origin: '*', // Public API allows all origins
}))

app.get('/public/data', (c) => c.json({ data: 'Public data' }))

// Protected route with strict CORS
app.use('/private/*', cors({
  origin: 'https://admin.myapp.com',
  allowMethods: ['GET'],
  credentials: true,
}))

app.get('/private/admin', (c) => c.json({ data: 'Admin only' }))

export default app`}
                    filename="src/app/api/public.ts"
                  />
                  <Table 
                    headers={['Option', 'Type', 'Description']}
                    rows={[
                      ['origin', 'string | string[] | "*"', 'Allowed origins (default: "*")'],
                      ['allowMethods', 'string[]', 'Allowed HTTP methods'],
                      ['allowHeaders', 'string[]', 'Allowed request headers'],
                      ['maxAge', 'number', 'Preflight cache duration in seconds'],
                      ['credentials', 'boolean', 'Allow credentials (cookies, auth)'],
                      ['exposeHeaders', 'string[]', 'Headers exposed to the browser'],
                    ]}
                  />
                </m.section>

                {/* Custom CORS Configuration */}
                <m.section id="custom-cors" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Custom CORS Configuration</h2>
                  <p className="text-slate-300 mb-4">
                    For more granular control, you can implement custom CORS handling in your API routes:
                  </p>
                  <CodeBlock 
                    code={`// src/app/api/custom.ts
import { Hono } from 'hono'

const app = new Hono()

// Custom CORS middleware
app.use('*', async (c, next) => {
  // Check if the request is from a known origin
  const origin = c.req.header('Origin')
  const allowedOrigins = ['https://myapp.com', 'https://staging.myapp.com']
  
  if (origin && allowedOrigins.includes(origin)) {
    c.header('Access-Control-Allow-Origin', origin)
    c.header('Access-Control-Allow-Credentials', 'true')
  }
  
  // Handle preflight requests
  if (c.req.method === 'OPTIONS') {
    c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    c.header('Access-Control-Max-Age', '86400')
    return c.text('', 204)
  }
  
  await next()
})

app.get('/custom/data', (c) => c.json({ data: 'Custom CORS' }))

export default app`}
                    filename="src/app/api/custom.ts"
                  />
                  <Note>
                    Custom CORS handling gives you full control over CORS headers and allows you to implement advanced scenarios like dynamic origin validation.
                  </Note>
                </m.section>

                {/* Production Deployment */}
                <m.section id="production-deployment" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Production Deployment</h2>
                  <p className="text-slate-300 mb-4">
                    When deploying to production, the same CORS configuration applies. For platform-specific configuration:
                  </p>
                  <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 mb-6">
                    <ul className="space-y-2 text-slate-300">
                      <li><strong className="text-white">bini-server (Node.js):</strong> Uses the same CORS configuration from your <code className="text-cyan-400">vite.config.ts</code></li>
                      <li><strong className="text-white">Netlify Edge Functions:</strong> Uses the CORS headers set in your Hono app</li>
                      <li><strong className="text-white">Vercel Edge:</strong> Uses the CORS headers set in your Hono app</li>
                      <li><strong className="text-white">Cloudflare Workers:</strong> Uses the CORS headers set in your Hono app</li>
                    </ul>
                  </div>
                  <Note>
                    For production, consider restricting CORS to specific origins rather than using <code>*</code> to improve security.
                  </Note>
                </m.section>

                {/* Previous / Next Navigation */}
                <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex items-center justify-between pt-8 mt-8 border-t border-slate-800">
                  <Link to="/docs/api-dynamic" className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <div>
                      <div className="text-xs text-slate-500">Previous</div>
                      <div className="text-sm font-medium">Dynamic API Routes</div>
                    </div>
                  </Link>
                  <Link to="/docs/environment-variables" className="group flex items-center gap-2 text-right text-slate-400 hover:text-white transition-colors">
                    <div>
                      <div className="text-xs text-slate-500">Next</div>
                      <div className="text-sm font-medium">Environment Variables</div>
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