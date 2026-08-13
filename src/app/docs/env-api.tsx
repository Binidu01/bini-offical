// src/pages/docs/env-api/page.tsx
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
  { id: 'overview', label: 'Overview' },
  { id: 'basic-usage', label: 'Basic Usage' },
  { id: 'required-vs-optional', label: 'Required vs Optional' },
  { id: 'complete-example', label: 'Complete Example' },
  { id: 'error-handling', label: 'Error Handling' },
]

const PAGE_TITLE = 'Using Environment Variables in API Routes'
const PAGE_URL = 'https://bini.js.org/docs/env-api'
const EDIT_URL = 'https://github.com/Binidu01/bini-offical/edit/main/src/app/docs/env-api.tsx'

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
// Env API Page
// ────────────────────────────────────────────────────────────────────────────────
export default function EnvApiPage() {
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
                    <p className="text-slate-400 text-sm">Learn how to read environment variables in your API routes using getEnv and requireEnv.</p>
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
                <motion.section id="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Overview</h2>
                  <p className="text-slate-300 mb-4">
                    In API routes, environment variables are read using <code className="text-cyan-400">getEnv(ctx, key)</code> and <code className="text-cyan-400">requireEnv(ctx, key)</code>. Both are auto-imported in API routes and read from the Hono request context via <code className="text-cyan-400">hono/adapter</code>.
                  </p>
                  <Note>
                    <strong>Always pass c explicitly.</strong> Cast it once at the top of the handler as <code>const ctx = c as any</code>, then use <code>ctx</code> throughout. No <code>process.env</code> fallbacks — every read is request-scoped.
                  </Note>
                </motion.section>

                {/* Basic Usage */}
                <motion.section id="basic-usage" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Basic Usage</h2>
                  <CodeBlock 
                    code={`// src/app/api/hello.ts
import { Hono } from 'hono'
import { getEnv, requireEnv } from 'bini-env'

const app = new Hono()

app.get('/hello', (c) => {
  try {
    const ctx = c as any

    // requireEnv throws if the var is missing — fail fast on required config
    const apiKey  = requireEnv(ctx, 'MY_API_KEY')

    // getEnv returns undefined if missing — use ?? to provide a default
    const appName = getEnv(ctx, 'APP_NAME')     ?? 'World'
    const timeout = parseInt(getEnv(ctx, 'TIMEOUT_MS') ?? '5000')

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

                {/* Required vs Optional */}
                <motion.section id="required-vs-optional" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Required vs Optional</h2>
                  <p className="text-slate-300 mb-4">
                    Use <code className="text-cyan-400">requireEnv</code> for variables your app cannot run without. Use <code className="text-cyan-400">getEnv</code> with <code className="text-cyan-400">??</code> for optional configuration.
                  </p>
                  <CodeBlock 
                    code={`app.post('/example', async (c) => {
  try {
    const ctx = c as any

    // Required vars — handler throws immediately if missing
    const dbUrl  = requireEnv(ctx, 'DATABASE_URL')
    const apiKey = requireEnv(ctx, 'STRIPE_SECRET_KEY')

    // Optional vars — fall back to sensible defaults
    const model      = getEnv(ctx, 'AI_MODEL')    ?? 'gpt-4o'
    const region     = getEnv(ctx, 'AWS_REGION')  ?? 'us-east-1'
    const maxRetries = parseInt(getEnv(ctx, 'MAX_RETRIES') ?? '3')
    const debug      = getEnv(ctx, 'DEBUG_MODE')  === 'true'

    return c.json({ model, region, maxRetries, debug })

  } catch (error: any) {
    if (error.message?.includes('[bini-env] Missing required')) {
      return c.json({ error: error.message }, 500)
    }
    return c.json({ error: 'Something went wrong.' }, 500)
  }
})`}
                  />
                  <Table 
                    headers={['Function', 'Use for', 'Behavior']}
                    rows={[
                      ['requireEnv(ctx, key)', 'Required config — app cannot run without', 'Throws if missing or empty'],
                      ['getEnv(ctx, key) ?? default', 'Optional config — fallback to default', 'Returns undefined if missing'],
                    ]}
                  />
                </motion.section>

                {/* Complete Example */}
                <motion.section id="complete-example" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Complete Example</h2>
                  <p className="text-slate-300 mb-4">
                    A full API endpoint that uses environment variables for configuration:
                  </p>
                  <CodeBlock 
                    code={`// src/app/api/email.ts
import { Hono } from 'hono'
import { getEnv, requireEnv } from 'bini-env'
import nodemailer from 'nodemailer'

const app = new Hono()

app.post('/email/send', async (c) => {
  try {
    const ctx = c as any

    // Required — the app cannot send email without these
    const smtpHost = requireEnv(ctx, 'SMTP_HOST')
    const smtpUser = requireEnv(ctx, 'SMTP_USER')
    const smtpPass = requireEnv(ctx, 'SMTP_PASS')
    const fromEmail = requireEnv(ctx, 'FROM_EMAIL')

    // Optional — with sensible defaults
    const smtpPort = parseInt(getEnv(ctx, 'SMTP_PORT') ?? '587')
    const secure = getEnv(ctx, 'SMTP_SECURE') === 'true'
    const debug = getEnv(ctx, 'DEBUG_MODE') === 'true'

    // Optional — use ?? for fallbacks
    const appName = getEnv(ctx, 'APP_NAME') ?? 'Bini.js App'

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: secure,
      auth: { user: smtpUser, pass: smtpPass },
      debug: debug,
    })

    const { to, subject, text } = await c.req.json()

    if (!to || !subject || !text) {
      return c.json({ error: 'Missing required fields: to, subject, text' }, 400)
    }

    await transporter.sendMail({
      from: fromEmail,
      to,
      subject: \`[\${appName}] \${subject}\`,
      text,
    })

    return c.json({ 
      success: true, 
      message: 'Email sent',
      from: fromEmail,
      app: appName,
    })

  } catch (error: any) {
    if (error.message?.includes('[bini-env] Missing required')) {
      return c.json({ error: error.message }, 500)
    }
    console.error('Email error:', error)
    return c.json({ error: 'Failed to send email.' }, 500)
  }
})

export default app`}
                    filename="src/app/api/email.ts"
                  />
                </motion.section>

                {/* Error Handling */}
                <motion.section id="error-handling" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Error Handling</h2>
                  <p className="text-slate-300 mb-4">
                    Always handle errors from <code className="text-cyan-400">requireEnv</code> gracefully:
                  </p>
                  <CodeBlock 
                    code={`app.get('/config', async (c) => {
  try {
    const ctx = c as any

    const apiKey = requireEnv(ctx, 'API_KEY')
    const secret = requireEnv(ctx, 'SECRET_TOKEN')

    return c.json({ configured: true })

  } catch (error: any) {
    // requireEnv throws an error with a descriptive message
    if (error.message?.includes('[bini-env] Missing required')) {
      return c.json({ 
        error: 'Configuration error', 
        details: error.message 
      }, 500)
    }
    
    // Other errors
    return c.json({ error: 'Something went wrong' }, 500)
  }
})`}
                  />
                  <p className="text-slate-300 mt-4">
                    On failure, the terminal shows:
                  </p>
                  <CodeBlock 
                    code={`[bini-env] error  Missing required environment variable: "API_KEY"
  -> Set it in your platform's env config or hosting dashboard.`}
                  />
                </motion.section>

                {/* Production Notes */}
                <motion.section id="production-notes" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Production Notes</h2>
                  <ul className="space-y-3 text-slate-300 mb-6">
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span><strong className="text-white">Set vars in production</strong> — <code>.env</code> files are only loaded during development. In production, set variables in your hosting platform's dashboard.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span><strong className="text-white">No platform-specific code</strong> — <code>getEnv</code> and <code>requireEnv</code> work on Node.js, Bun, Deno, Vercel Edge, Netlify Edge, and Cloudflare Workers.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span><strong className="text-white">Never expose secrets</strong> — Never return secret values in API responses. Only return configuration status.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span><strong className="text-white">Use BINI_ for client vars</strong> — Use <code>BINI_</code> prefix for client-side public config. No prefix for server-only secrets.</span>
                    </li>
                  </ul>
                  <Note>
                    The same API code runs unchanged across all platforms. bini-env reads from the correct source on every platform automatically.
                  </Note>
                </motion.section>

                {/* Previous / Next Navigation */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex items-center justify-between pt-8 mt-8 border-t border-slate-800">
                  <Link to="/docs/env-prefixes" className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <div>
                      <div className="text-xs text-slate-500">Previous</div>
                      <div className="text-sm font-medium">Prefixes & Client Exposure</div>
                    </div>
                  </Link>
                  <Link to="/docs/css" className="group flex items-center gap-2 text-right text-slate-400 hover:text-white transition-colors">
                    <div>
                      <div className="text-xs text-slate-500">Next</div>
                      <div className="text-sm font-medium">CSS Overview</div>
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