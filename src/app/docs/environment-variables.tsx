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
  { id: 'security', label: 'Security Best Practices' },
  { id: 'performance', label: 'Performance' },
  { id: 'troubleshooting', label: 'Troubleshooting' },
  { id: 'complete-example', label: 'Complete Example' },
]

const PAGE_TITLE = 'Environment Variables'
const PAGE_URL = 'https://bini.js.org/docs/environment-variables'
const EDIT_URL = 'https://github.com/Binidu01/bini-offical/edit/main/src/app/docs/environment-variables.tsx'

// ────────────────────────────────────────────────────────────────────────────────
// Code Block Component
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
                    <p className="text-slate-400 text-sm">Hono-native environment variable system for Bini.js — works across Node.js, Bun, Deno, Vercel Edge, Netlify Edge, and Cloudflare Workers.</p>
                  </div>
                  <div className="shrink-0 pt-2 hidden sm:block">
                    <CopyPageButton pageUrl={PAGE_URL} pageTitle={PAGE_TITLE} />
                  </div>
                </motion.div>
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
                  <p className="text-slate-300 mt-2">
                    <code>biniEnv()</code> takes no options — there's nothing to configure.
                  </p>

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
                  <Note>
                    That's it — no manual <code>loadEnv</code> loop in <code>vite.config.ts</code> needed. Your secret just needs to exist in <code>.env</code> with no prefix, and <code>requireEnv</code> will find it during dev and preview.
                  </Note>
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
    const region     = getEnv(ctx, 'AWS_REGION')  ?? 'us-east-1'
    const maxRetries = parseInt(getEnv(ctx, 'MAX_RETRIES') ?? '3')
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
                    code={`const ctx = c as any              // cast once, at the top
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
                    Variables without a prefix are NOT exposed to the browser. During dev/preview they are mirrored into <code>process.env</code> automatically, and read via <code>getEnv(ctx, key)</code> in API routes.
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
                    headers={['Prefix', 'Exposed to browser', 'Mirrored to process.env', 'Use for']}
                    rows={[
                      ['BINI_', 'Yes', 'No', 'Public client config'],
                      ['VITE_', 'Yes', 'No', 'Public client config'],
                      ['No prefix', 'No', 'Yes (dev/preview)', 'Secrets — server only'],
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
                    <code>getEnv</code> and <code>requireEnv</code> delegate to Hono's <code>env(c)</code> adapter, which reads from the correct source on every supported platform automatically. Your code never changes regardless of where it deploys.
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
                  <Note>
                    <strong>Cloudflare note:</strong> Secrets set via <code>wrangler secret put</code> are only available inside the fetch handler via <code>c.env</code>. <code>getEnv(ctx, key)</code> reads them correctly as long as you pass <code>c</code>.
                  </Note>
                </motion.section>

                {/* How It Works */}
                <motion.section id="how-it-works" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">How It Works</h2>
                  <p className="text-slate-300 mb-4">
                    The <code>biniEnv()</code> plugin does three things:
                  </p>
                  <ul className="text-slate-300 mb-4 list-disc list-inside space-y-1">
                    <li>Tells Vite to expose <code>BINI_</code> and <code>VITE_</code> prefixed vars to <code>import.meta.env</code></li>
                    <li>Mirrors non-prefixed <code>.env</code> values into <code>process.env</code> during <code>vite dev</code> / <code>vite preview</code></li>
                    <li>Prints the <code>ß Bini.js</code> banner with detected <code>.env</code> files when the dev or preview server starts</li>
                  </ul>
                  <CodeBlock 
                    code={`config(userConfig, { command }) {
  if (command === 'serve') {
    const envDir = userConfig.envDir ?? userConfig.root ?? process.cwd()
    // mirrors non-prefixed, non-empty .env values into process.env
    // silent on success, warns on failure — no opt-out
  }
  return { envPrefix: ['BINI_', 'VITE_'] }
}`}
                  />
                  <p className="text-slate-300 mt-4">
                    The prefix list is fixed — there is no option to add more prefixes. Only <code>BINI_</code> and <code>VITE_</code> are ever exposed to the browser.
                  </p>
                  <p className="text-slate-300 mt-4">
                    On server start you will see:
                  </p>
                  <CodeBlock 
                    code={`  ß Bini.js (dev)
  ➜  Environments: .env.local, .env
  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.1.7:3000/`}
                  />
                  <p className="text-slate-300 mt-4">
                    Vite handles everything natively: loading <code>.env</code> files, watching, restarting, injecting prefixed vars, and HMR. bini-env does not reimplement any of that.
                  </p>
                  <p className="text-slate-300 mt-2">
                    <strong>Zero dotenv:</strong> <code>dotenv</code> is never used at runtime. In production, vars are set in your hosting platform's environment config.
                  </p>
                  <Note>
                    <strong>Precedence:</strong> A value already present in <code>process.env</code> (set by your OS, shell, or CI) always wins. <code>.env</code> file values only fill in variables that aren't already set.
                  </Note>
                </motion.section>

                {/* API Reference */}
                <motion.section id="api-reference" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">API Reference</h2>
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">getEnv(c, key)</h3>
                  <p className="text-slate-300 mb-2">Returns <code>string | undefined</code>. Reads from the Hono request context.</p>
                  <CodeBlock 
                    code={`app.get('/config', async (c) => {
  const ctx = c as any

  const region   = getEnv(ctx, 'AWS_REGION') ?? 'us-east-1'
  const logLevel = getEnv(ctx, 'LOG_LEVEL')  ?? 'info'
  const debug    = getEnv(ctx, 'DEBUG_MODE') === 'true'

  return c.json({ region, logLevel, debug })
})`}
                  />

                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">requireEnv(c, key)</h3>
                  <p className="text-slate-300 mb-2">Returns <code>string</code>. Throws immediately if the variable is missing or empty.</p>
                  <CodeBlock 
                    code={`app.post('/send-email', async (c) => {
  try {
    const ctx = c as any

    const smtpHost = requireEnv(ctx, 'SMTP_HOST')
    const smtpPass = requireEnv(ctx, 'SMTP_PASS')
    const smtpPort = parseInt(getEnv(ctx, 'SMTP_PORT') ?? '587')

    // ... send email

    return c.json({ sent: true })

  } catch (error: any) {
    if (error.message?.includes('[bini-env] Missing required')) {
      return c.json({ error: error.message }, 500)
    }
    return c.json({ error: 'Failed to send email.' }, 500)
  }
})`}
                  />
                  <p className="text-slate-300 mt-4">
                    On failure, the terminal will show:
                  </p>
                  <CodeBlock 
                    code={`[bini-env] error  Missing required environment variable: "SMTP_HOST"
  -> Set it in your platform's env config or hosting dashboard.`}
                  />

                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">biniEnv()</h3>
                  <p className="text-slate-300 mb-2">Vite plugin. Takes no options.</p>
                  <CodeBlock 
                    code={`biniEnv()`}
                  />
                  <p className="text-slate-300 mt-2">
                    There is nothing to configure — no prefix list to extend, no flag to disable the <code>process.env</code> mirror. The prefix list is fixed to <code>['BINI_', 'VITE_']</code>.
                  </p>

                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">biniLogger</h3>
                  <p className="text-slate-300 mb-2">Vite-style terminal logger. Use it in your own Bini.js plugins or server-side code.</p>
                  <CodeBlock 
                    code={`import { biniLogger } from 'bini-env'

biniLogger.info('Server ready')
biniLogger.warn('Missing optional var')
biniLogger.error('Something broke', error)`}
                  />

                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">HonoContext</h3>
                  <p className="text-slate-300 mb-2">Exported type (<code>Context</code> from Hono). Use it to type helper functions that group env reads.</p>
                  <CodeBlock 
                    code={`import type { HonoContext } from 'bini-env'

function readDbConfig(c: HonoContext) {
  const ctx = c as any
  return {
    url:      requireEnv(ctx, 'DATABASE_URL'),
    poolSize: parseInt(getEnv(ctx, 'DB_POOL_SIZE') ?? '10'),
    ssl:      getEnv(ctx, 'DB_SSL') !== 'false',
  }
}`}
                  />
                </motion.section>

                {/* Security Best Practices */}
                <motion.section id="security" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Security Best Practices</h2>
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Rule 1: Never Prefix Secrets</h3>
                  <CodeBlock 
                    code={`# ❌ BAD - This will be exposed to the browser!
BINI_DATABASE_URL=postgres://...

# ✅ GOOD - Not exposed, mirrored into process.env for server-side use
DATABASE_URL=postgres://...`}
                  />

                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Rule 2: Use BINI_ or VITE_ for Public Data</h3>
                  <CodeBlock 
                    code={`# ✅ Safe - Public data
BINI_API_URL=https://api.example.com
VITE_GA_ID=UA-XXXXX`}
                  />

                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Rule 3: Don't Leave Secret Placeholders Empty</h3>
                  <p className="text-slate-300">
                    An empty value (<code>API_KEY=</code>) is skipped by the <code>process.env</code> mirror, so <code>requireEnv</code> will correctly throw instead of silently succeeding with an empty string.
                  </p>
                </motion.section>

                {/* Performance */}
                <motion.section id="performance" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Performance</h2>
                  <Table 
                    headers={['Metric', 'Dev', 'Prod']}
                    rows={[
                      ['File reads', '1 (loadEnv, cached by Vite)', '0'],
                      ['Runtime cost', '~0ms (mirror runs once at server start)', '0'],
                      ['Bundle impact', 'Minimal', 'Tree-shaken'],
                    ]}
                  />
                  <p className="text-slate-300 mt-4">
                    No dotenv. No per-request disk reads. <code>getEnv</code> is a direct call to Hono's adapter on every invocation — request-scoped and correct.
                  </p>
                </motion.section>

                {/* Troubleshooting */}
                <motion.section id="troubleshooting" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Troubleshooting</h2>
                  <Table 
                    headers={['Problem', 'Solution']}
                    rows={[
                      ['Env var undefined in production', 'Set variables in your hosting platform\'s environment dashboard (Vercel, Netlify, Cloudflare, etc.).'],
                      ['Works in dev, undefined in prod', 'Local dev works because biniEnv() mirrors non-prefixed vars into process.env automatically. Production requires platform-level configuration.'],
                      ['My .env value isn\'t taking effect in dev', 'Check your shell and CI environment first — the mirror never overrides a variable that\'s already set. Also check the value isn\'t empty (KEY=).'],
                      ['requireEnv still throws even though my key is in .env', 'If the value is KEY= with nothing after the =, it is treated as unset and skipped by design. Give it a real value.'],
                      ['bini-env isn\'t reading my .env from the right folder', 'biniEnv() reads from your Vite envDir if set, otherwise root, otherwise the working directory. Double check envDir/root in vite.config.ts.'],
                      ['Cloudflare secret not found', 'Secrets set via wrangler secret put are only available via c.env. Ensure you are passing c to the function.'],
                      ['TypeScript error: Context not assignable to HonoContext', 'Cast once per handler: const ctx = c as any'],
                      ['Types not found', 'Add /// <reference types="vite/client" /> to your tsconfig.json or entry file.'],
                    ]}
                  />
                </motion.section>

                {/* Complete Example */}
                <motion.section id="complete-example" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="scroll-mt-24">
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
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }} className="flex items-center justify-between pt-8 mt-8 border-t border-slate-800">
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