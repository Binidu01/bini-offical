// src/pages/docs/environment-variables/page.tsx
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
  { id: 'quick-start', label: 'Quick Start' },
  { id: 'usage-pattern', label: 'Usage Pattern' },
  { id: 'environment-prefixes', label: 'Environment Prefixes' },
  { id: 'platform-support', label: 'Platform Support' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'api-reference', label: 'API Reference' },
  { id: 'performance', label: 'Performance' },
  { id: 'troubleshooting', label: 'Troubleshooting' },
  { id: 'complete-example', label: 'Complete Example' },
]

const PAGE_TITLE = 'Environment Variables'
const PAGE_URL = 'https://bini.js.org/docs/environment-variables'
const EDIT_URL = 'https://github.com/Binidu01/bini-offical/edit/main/src/app/docs/environment-variables.tsx'

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
// Environment Variables Page
// ────────────────────────────────────────────────────────────────────────────────
export default function EnvironmentVariablesPage() {
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
                    <p className="text-slate-400 text-sm">Zero-config environment variable system powered by Hono — works across Node.js, Bun, Deno, Vercel Edge, Netlify Edge, and Cloudflare Workers.</p>
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
                    <code className="text-cyan-400">bini-env</code> is <strong className="text-white">installed and configured by default</strong> in every Bini.js project. It reads env vars from the Hono request context, so variables are always resolved from the correct runtime binding — no platform-specific code needed.
                  </p>
                  <Note>
                    <strong>Hono-native:</strong> <code>getEnv(c, key)</code> / <code>requireEnv(c, key)</code> read directly from the Hono request context. Zero dotenv — no <code>.env</code> parsing at runtime; vars come from the host platform. Vite handles <code>.env</code> loading during development.
                  </Note>
                </motion.section>

                {/* Quick Start */}
                <motion.section id="quick-start" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Quick Start</h2>
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">1. Register the Vite plugin</h3>
                  <CodeBlock 
                    code={`// vite.config.ts
import { defineConfig } from 'vite'
import { biniEnv } from 'bini-env'

export default defineConfig({
  plugins: [biniEnv()]
})`}
                    filename="vite.config.ts"
                  />

                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">2. Read env vars in your Hono handlers</h3>
                  <CodeBlock 
                    code={`// src/app/api/hello.ts
import { Hono } from 'hono'
import { getEnv, requireEnv } from 'bini-env'

const app = new Hono()

app.post('/hello', async (c) => {
  try {
    const ctx = c as any

    const apiKey  = requireEnv(ctx, 'MY_API_KEY')
    const appName = getEnv(ctx, 'APP_NAME') ?? 'World'

    return c.json({ message: \`Hello, \${appName}!\` })

  } catch (error: any) {
    if (error.message?.includes('[bini-env] Missing required')) {
      return c.json({ error: error.message }, 500)
    }
    return c.json({ error: 'Something went wrong.' }, 500)
  }
})

export default app`}
                    filename="src/app/api/hello.ts"
                  />
                </motion.section>

                {/* Usage Pattern */}
                <motion.section id="usage-pattern" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Usage Pattern</h2>
                  <p className="text-slate-300 mb-4">
                    Always pass <code>c</code> explicitly. Cast it once at the top of the handler, then use <code>ctx</code> throughout.
                  </p>
                  <CodeBlock 
                    code={`app.post('/example', async (c) => {
  try {
    const ctx = c as any

    const dbUrl  = requireEnv(ctx, 'DATABASE_URL')
    const apiKey = requireEnv(ctx, 'STRIPE_SECRET_KEY')

    const model      = getEnv(ctx, 'AI_MODEL')    ?? 'gpt-4o'
    const debug      = getEnv(ctx, 'DEBUG_MODE')  === 'true'

    // ... rest of handler

  } catch (error: any) {
    if (error.message?.includes('[bini-env] Missing required')) {
      return c.json({ error: error.message }, 500)
    }
    return c.json({ error: 'Something went wrong.' }, 500)
  }
})`}
                  />
                  <p className="text-slate-300 mt-4">
                    The pattern in three steps:
                  </p>
                  <CodeBlock 
                    code={`const ctx = c as any              // cast once
requireEnv(ctx, 'KEY')            // throws if missing
getEnv(ctx, 'KEY') ?? 'default'   // optional with default`}
                  />
                </motion.section>

                {/* Environment Prefixes */}
                <motion.section id="environment-prefixes" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Environment Prefixes</h2>
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">BINI_ — Client-side vars</h3>
                  <p className="text-slate-300 mb-4">
                    <code>BINI_</code> variables are exposed to <code>import.meta.env</code>. Use them for public client-side config.
                  </p>
                  <CodeBlock 
                    code={`# .env
BINI_PUBLIC_API_URL=https://api.example.com`}
                    filename=".env"
                  />
                  <CodeBlock 
                    code={`const apiUrl = import.meta.env.BINI_PUBLIC_API_URL`}
                  />

                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">VITE_ — Public client vars</h3>
                  <p className="text-slate-300 mb-4">
                    <code>VITE_</code> is Vite's built-in prefix. Any var starting with <code>VITE_</code> is bundled into your client-side JavaScript.
                  </p>
                  <CodeBlock 
                    code={`# .env
VITE_ANALYTICS_ID=UA-XXXX`}
                    filename=".env"
                  />
                  <CodeBlock 
                    code={`import.meta.env.VITE_ANALYTICS_ID`}
                  />

                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">No prefix — Secrets (server only)</h3>
                  <p className="text-slate-300 mb-4">
                    Variables without a prefix are NOT exposed to the browser. Read them via <code>getEnv(ctx, key)</code> in API routes only.
                  </p>
                  <CodeBlock 
                    code={`# .env
DATABASE_URL=postgres://...
STRIPE_SECRET_KEY=sk_live_...`}
                    filename=".env"
                  />
                  <CodeBlock 
                    code={`const ctx = c as any
const dbUrl = requireEnv(ctx, 'DATABASE_URL')`}
                  />

                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Prefix Summary</h3>
                  <Table 
                    headers={['Prefix', 'Exposed to browser', 'Use for']}
                    rows={[
                      ['BINI_', 'Yes', 'Public client config'],
                      ['VITE_', 'Yes', 'Public client config'],
                      ['No prefix', 'No', 'Secrets — server only'],
                    ]}
                  />
                  <Note>
                    <strong>Critical:</strong> Never put secrets in <code>BINI_*</code> or <code>VITE_*</code> variables — both are exposed to the browser. Use un-prefixed variables for secrets and read them with <code>getEnv(ctx, key)</code> inside API route handlers only.
                  </Note>
                </motion.section>

                {/* Platform Support */}
                <motion.section id="platform-support" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Platform Support</h2>
                  <p className="text-slate-300 mb-4">
                    <code>getEnv</code> and <code>requireEnv</code> delegate to Hono's <code>env(c)</code> adapter, which reads from the correct source on every supported platform automatically.
                  </p>
                  <Table 
                    headers={['Platform', 'Runtime', 'How Hono reads it']}
                    rows={[
                      ['Node.js', 'Node', 'process.env'],
                      ['Bun', 'Bun', 'process.env'],
                      ['Vercel Edge', 'V8 isolate', 'process.env'],
                      ['Netlify Edge', 'Deno', 'Deno.env.get()'],
                      ['Cloudflare Workers', 'V8 isolate', 'CF bindings via c.env'],
                      ['Deno Deploy', 'Deno', 'Deno.env.get()'],
                    ]}
                  />
                </motion.section>

                {/* How It Works */}
                <motion.section id="how-it-works" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">How It Works</h2>
                  <p className="text-slate-300 mb-4">
                    The <code>biniEnv()</code> plugin tells Vite which env prefixes to expose to <code>import.meta.env</code>:
                  </p>
                  <CodeBlock 
                    code={`config() {
  return { envPrefix: ['BINI_', 'VITE_', ...yourExtras] }
}`}
                  />
                  <p className="text-slate-300 mt-4">
                    On server start you will see:
                  </p>
                  <CodeBlock 
                    code={`  ß Bini.js (dev)
  ➜  Environments: .env.local, .env
  ➜  Local:   http://localhost:3000/`}
                  />
                  <p className="text-slate-300 mt-4">
                    Vite handles everything natively: loading <code>.env</code> files, watching, restarting, injecting prefixed vars, and HMR. bini-env does not reimplement any of that.
                  </p>
                  <p className="text-slate-300 mt-2">
                    <strong>Zero dotenv:</strong> <code>dotenv</code> is never used at runtime. In production, vars are set in your hosting platform's environment config.
                  </p>
                </motion.section>

                {/* API Reference */}
                <motion.section id="api-reference" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">API Reference</h2>
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">getEnv(c, key)</h3>
                  <p className="text-slate-300 mb-2">Returns <code>string | undefined</code>.</p>
                  <CodeBlock 
                    code={`app.get('/config', async (c) => {
  const ctx = c as any
  const region = getEnv(ctx, 'AWS_REGION') ?? 'us-east-1'
  return c.json({ region })
})`}
                  />

                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">requireEnv(c, key)</h3>
                  <p className="text-slate-300 mb-2">Returns <code>string</code>. Throws if missing.</p>
                  <CodeBlock 
                    code={`app.post('/send-email', async (c) => {
  const ctx = c as any
  const smtpHost = requireEnv(ctx, 'SMTP_HOST')
  // ...
})`}
                  />
                  <p className="text-slate-300 mt-4">
                    On failure, the terminal will show:
                  </p>
                  <CodeBlock 
                    code={`[bini-env] error  Missing required environment variable: "SMTP_HOST"
  -> Set it in your platform's env config.`}
                  />

                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">biniEnv(options?)</h3>
                  <CodeBlock 
                    code={`biniEnv()
biniEnv({ envPrefix: ['MY_PUBLIC_'] })`}
                  />
                  <Table 
                    headers={['Option', 'Type', 'Default', 'Description']}
                    rows={[
                      ['envPrefix', 'string | string[]', '[]', 'Extra prefixes to expose'],
                    ]}
                  />
                </motion.section>

                {/* Performance */}
                <motion.section id="performance" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Performance</h2>
                  <Table 
                    headers={['Metric', 'Dev', 'Prod']}
                    rows={[
                      ['File reads', '0', '0'],
                      ['Runtime cost', '~0ms', '0'],
                      ['Bundle impact', 'Minimal', 'Tree-shaken'],
                    ]}
                  />
                  <p className="text-slate-300 mt-4">
                    No dotenv. No disk reads. No caching layer.
                  </p>
                </motion.section>

                {/* Troubleshooting */}
                <motion.section id="troubleshooting" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Troubleshooting</h2>
                  <Table 
                    headers={['Problem', 'Solution']}
                    rows={[
                      ['Env var undefined in production', 'Set variables in your hosting platform\'s environment dashboard.'],
                      ['Works in dev, undefined in prod', 'Production requires platform-level configuration.'],
                      ['Cloudflare secret not found', 'Secrets set via wrangler secret put are only available via c.env. Ensure you are passing c to the function.'],
                      ['TypeScript error: Context not assignable', 'Cast once per handler: const ctx = c as any'],
                    ]}
                  />
                </motion.section>

                {/* Complete Example */}
                <motion.section id="complete-example" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Complete Example</h2>
                  <CodeBlock 
                    code={`# .env
BINI_PUBLIC_API_URL=https://api.example.com
VITE_APP_NAME=My App
DATABASE_URL=postgres://localhost:5432/mydb
JWT_SECRET=your_jwt_secret`}
                    filename=".env"
                  />
                  <CodeBlock 
                    code={`// src/app/page.tsx
export default function HomePage() {
  const apiUrl = import.meta.env.BINI_PUBLIC_API_URL
  const appName = import.meta.env.VITE_APP_NAME
  return <h1>{appName}</h1>
}`}
                    filename="src/app/page.tsx"
                  />
                  <CodeBlock 
                    code={`// src/app/api/config.ts
import { Hono } from 'hono'
import { getEnv, requireEnv } from 'bini-env'

const app = new Hono()

app.get('/config', (c) => {
  const ctx = c as any
  const dbUrl = requireEnv(ctx, 'DATABASE_URL')
  const jwtSecret = requireEnv(ctx, 'JWT_SECRET')
  const debug = getEnv(ctx, 'DEBUG_MODE') === 'true'

  return c.json({ debug, dbConnected: !!dbUrl })
})

export default app`}
                    filename="src/app/api/config.ts"
                  />
                </motion.section>

                {/* Previous / Next Navigation */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex items-center justify-between pt-8 mt-8 border-t border-slate-800">
                  <Link to="/docs/api-cors" className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <div>
                      <div className="text-xs text-slate-500">Previous</div>
                      <div className="text-sm font-medium">CORS</div>
                    </div>
                  </Link>
                  <Link to="/docs/env-prefixes" className="group flex items-center gap-2 text-right text-slate-400 hover:text-white transition-colors">
                    <div>
                      <div className="text-xs text-slate-500">Next</div>
                      <div className="text-sm font-medium">Prefixes & Client Exposure</div>
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