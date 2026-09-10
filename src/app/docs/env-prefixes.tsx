// src/pages/docs/env-prefixes/page.tsx
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
  { id: 'what-are-prefixes', label: 'What are Prefixes?' },
  { id: 'bini-prefix', label: 'BINI_ Prefix' },
  { id: 'vite-prefix', label: 'VITE_ Prefix' },
  { id: 'no-prefix', label: 'No Prefix (Secrets)' },
  { id: 'client-access', label: 'Client-Side Access' },
  { id: 'server-access', label: 'Server-Side Access' },
  { id: 'getenv-vs-requireenv', label: 'getEnv vs requireEnv' },
]

const PAGE_TITLE = 'Prefixes & Client Exposure'
const PAGE_URL = 'https://bini.js.org/docs/env-prefixes'
const EDIT_URL = 'https://github.com/Binidu01/bini-offical/edit/main/src/app/docs/env-prefixes.tsx'

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
// Prefixes & Client Exposure Page
// ────────────────────────────────────────────────────────────────────────────────
export default function EnvPrefixesPage() {
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
                    <p className="text-slate-400 text-sm">Learn how environment variable prefixes work and which variables are exposed to the client.</p>
                  </div>
                  <div className="shrink-0 pt-2 hidden sm:block">
                    <CopyPageButton pageUrl={PAGE_URL} pageTitle={PAGE_TITLE} />
                  </div>
                </m.div>
                <div className="sm:hidden mb-8">
                  <CopyPageButton pageUrl={PAGE_URL} pageTitle={PAGE_TITLE} />
                </div>

                {/* What are Prefixes? */}
                <m.section id="what-are-prefixes" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">What are Prefixes?</h2>
                  <p className="text-slate-300 mb-4">
                    Environment variable prefixes determine which variables are exposed to the browser and which are kept server-side. The prefix tells Vite and Bini.js how to handle each variable.
                  </p>
                  <Note>
                    Both <code>BINI_</code> and <code>VITE_</code> prefixes are exposed to the browser by default. Variables without a prefix are never exposed to the client.
                  </Note>
                  <Note>
                    <strong>Fixed prefixes:</strong> The prefix list in <code>bini-env</code> v2 is fixed to <code>['BINI_', 'VITE_']</code>. There is no option to add custom prefixes.
                  </Note>
                </m.section>

                {/* BINI_ Prefix */}
                <m.section id="bini-prefix" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">BINI_ Prefix</h2>
                  <p className="text-slate-300 mb-4">
                    <code className="text-cyan-400">BINI_</code> is the default prefix for client-side environment variables in Bini.js. These variables are exposed to the browser via <code className="text-cyan-400">import.meta.env</code>.
                  </p>
                  <CodeBlock 
                    code={`# .env
BINI_PUBLIC_API_URL=https://api.example.com
BINI_APP_NAME=My App
BINI_ANALYTICS_ID=UA-XXXX`}
                    filename=".env"
                  />
                  <CodeBlock 
                    code={`// src/app/page.tsx
export default function HomePage() {
  const apiUrl = import.meta.env.BINI_PUBLIC_API_URL
  const appName = import.meta.env.BINI_APP_NAME
  const analyticsId = import.meta.env.BINI_ANALYTICS_ID
  
  return (
    <div>
      <h1>{appName}</h1>
      <p>API: {apiUrl}</p>
    </div>
  )
}`}
                    filename="src/app/page.tsx"
                  />
                  <Note>
                    <strong>Important:</strong> <code>BINI_*</code> variables are bundled into your client-side JavaScript. Never put secrets in <code>BINI_*</code> variables.
                  </Note>
                </m.section>

                {/* VITE_ Prefix */}
                <m.section id="vite-prefix" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">VITE_ Prefix</h2>
                  <p className="text-slate-300 mb-4">
                    <code className="text-cyan-400">VITE_</code> is Vite's standard prefix for client-side environment variables. Any variable starting with <code>VITE_</code> is exposed to the browser.
                  </p>
                  <CodeBlock 
                    code={`# .env
VITE_API_URL=https://api.example.com
VITE_APP_TITLE=My App
VITE_GA_ID=UA-XXXXX`}
                    filename=".env"
                  />
                  <CodeBlock 
                    code={`// src/app/page.tsx
export default function HomePage() {
  const apiUrl = import.meta.env.VITE_API_URL
  const title = import.meta.env.VITE_APP_TITLE
  const gaId = import.meta.env.VITE_GA_ID
  
  return <h1>{title}</h1>
}`}
                    filename="src/app/page.tsx"
                  />
                  <Note>
                    <strong>Note:</strong> <code>VITE_*</code> and <code>BINI_*</code> work exactly the same way. Both are exposed to the browser. Choose whichever you prefer.
                  </Note>
                </m.section>

                {/* No Prefix */}
                <m.section id="no-prefix" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">No Prefix (Secrets)</h2>
                  <p className="text-slate-300 mb-4">
                    Variables without a prefix are <strong className="text-white">never</strong> exposed to the browser. They are only accessible server-side via <code className="text-cyan-400">getEnv(ctx, key)</code> in API routes.
                  </p>
                  <CodeBlock 
                    code={`# .env
DATABASE_URL=postgres://localhost:5432/mydb
STRIPE_SECRET_KEY=sk_live_...
SMTP_PASS=super_secret
JWT_SECRET=your_jwt_secret`}
                    filename=".env"
                  />
                  <CodeBlock 
                    code={`// src/app/api/config.ts
import { Hono } from 'hono'
import { getEnv, requireEnv } from 'bini-env'

const app = new Hono()

app.get('/config', (c) => {
  const ctx = c as any
  
  // These are only accessible server-side
  const dbUrl = requireEnv(ctx, 'DATABASE_URL')
  const jwtSecret = requireEnv(ctx, 'JWT_SECRET')
  const smtpPass = requireEnv(ctx, 'SMTP_PASS')
  
  // Never expose secrets in responses
  return c.json({ 
    dbConnected: !!dbUrl,
    jwtConfigured: !!jwtSecret 
  })
})

export default app`}
                    filename="src/app/api/config.ts"
                  />
                  <Note>
                    <strong>Critical:</strong> Variables without a prefix are the only way to keep secrets secure. Never use <code>BINI_*</code> or <code>VITE_*</code> for sensitive data.
                  </Note>
                </m.section>

                {/* Client-Side Access */}
                <m.section id="client-access" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Client-Side Access</h2>
                  <p className="text-slate-300 mb-4">
                    Client-side variables are accessed via <code className="text-cyan-400">import.meta.env</code> in any component:
                  </p>
                  <CodeBlock 
                    code={`// src/app/page.tsx
export default function Page() {
  // Access client-side variables
  const apiUrl = import.meta.env.BINI_API_URL
  const appName = import.meta.env.VITE_APP_NAME
  
  return (
    <div>
      <h1>{appName}</h1>
      <p>API: {apiUrl}</p>
    </div>
  )
}

// In MDX files
export const metadata = {
  title: import.meta.env.VITE_APP_NAME,
}

# Welcome to {import.meta.env.VITE_APP_NAME}
`}
                  />
                  <Note>
                    <code>import.meta.env</code> is available in all client-side code including pages, components, and MDX files.
                  </Note>
                </m.section>

                {/* Server-Side Access */}
                <m.section id="server-access" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Server-Side Access</h2>
                  <p className="text-slate-300 mb-4">
                    Server-side variables are accessed via <code className="text-cyan-400">getEnv(ctx, key)</code> and <code className="text-cyan-400">requireEnv(ctx, key)</code> in API routes:
                  </p>
                  <CodeBlock 
                    code={`// src/app/api/email.ts
import { Hono } from 'hono'
import { getEnv, requireEnv } from 'bini-env'

const app = new Hono()

app.post('/email/send', async (c) => {
  const ctx = c as any
  
  // Server-side secrets (no prefix)
  const smtpHost = requireEnv(ctx, 'SMTP_HOST')
  const smtpPass = requireEnv(ctx, 'SMTP_PASS')
  const fromEmail = requireEnv(ctx, 'FROM_EMAIL')
  
  // Optional config with defaults
  const smtpPort = parseInt(getEnv(ctx, 'SMTP_PORT') ?? '587')
  
  // Client-side config (BINI_)
  const publicUrl = getEnv(ctx, 'BINI_API_URL')
  
  return c.json({ 
    success: true,
    publicUrl, // This is safe to return
    // smtpPass is NEVER returned to the client
  })
})

export default app`}
                    filename="src/app/api/email.ts"
                  />
                  <Table 
                    headers={['Access Method', 'Where', 'Variables']}
                    rows={[
                      ['import.meta.env', 'Client components', 'BINI_, VITE_'],
                      ['getEnv(ctx, key)', 'API routes', 'All variables (including no prefix)'],
                      ['requireEnv(ctx, key)', 'API routes', 'All variables (throws if missing)'],
                    ]}
                  />
                </m.section>

                {/* getEnv vs requireEnv */}
                <m.section id="getenv-vs-requireenv" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">getEnv vs requireEnv</h2>
                  <p className="text-slate-300 mb-4">
                    Both <code className="text-cyan-400">getEnv</code> and <code className="text-cyan-400">requireEnv</code> read environment variables from the Hono request context, but they behave differently:
                  </p>
                  <Table 
                    headers={['Feature', 'getEnv(ctx, key)', 'requireEnv(ctx, key)']}
                    rows={[
                      ['Returns', 'string | undefined', 'string'],
                      ['On missing', 'Returns undefined', 'Throws error immediately'],
                      ['Use case', 'Optional configuration with defaults', 'Required configuration'],
                      ['Default pattern', 'getEnv(ctx, \'KEY\') ?? \'default\'', 'requireEnv(ctx, \'KEY\')'],
                      ['Error handling', 'Manual check for undefined', 'Try/catch or let it bubble'],
                      ['When to use', 'Feature flags, optional settings', 'Database URLs, API keys, credentials'],
                    ]}
                  />
                  <CodeBlock 
                    code={`// getEnv — for optional values
const debug = getEnv(ctx, 'DEBUG_MODE') === 'true'
const region = getEnv(ctx, 'AWS_REGION') ?? 'us-east-1'
const maxRetries = parseInt(getEnv(ctx, 'MAX_RETRIES') ?? '3')

// requireEnv — for required values
const dbUrl = requireEnv(ctx, 'DATABASE_URL')
const apiKey = requireEnv(ctx, 'STRIPE_SECRET_KEY')
const smtpPass = requireEnv(ctx, 'SMTP_PASS')`}
                  />
                  <Note>
                    <strong>Best practice:</strong> Use <code>requireEnv</code> for critical configuration that your app cannot function without. Use <code>getEnv</code> with <code>??</code> defaults for optional configuration.
                  </Note>
                  <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 mt-4">
                    <p className="text-slate-300 text-sm">
                      <strong className="text-white">On terminal failure:</strong> <code>requireEnv</code> logs a descriptive error to the terminal:
                    </p>
                    <CodeBlock 
                      code={`[bini-env] error  Missing required environment variable: "SMTP_HOST"
  -> Set it in your platform's env config or hosting dashboard.`}
                    />
                  </div>
                </m.section>

                {/* Security Best Practices */}
                <m.section id="security-best-practices" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Security Best Practices</h2>
                  <ul className="space-y-3 text-slate-300 mb-6">
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span><strong className="text-white">Never prefix secrets</strong> — Use no prefix for database URLs, API keys, and tokens.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span><strong className="text-white">Use BINI_ or VITE_ for public config</strong> — Use these for non-sensitive configuration like API URLs.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span><strong className="text-white">Use requireEnv for critical values</strong> — Fail fast when required configuration is missing.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span><strong className="text-white">Use getEnv with defaults for optional values</strong> — Keep your app flexible with sensible defaults.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span><strong className="text-white">Never expose secrets in responses</strong> — Don't return secret values from API routes.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span><strong className="text-white">Use .env.example</strong> — Document required variables without committing actual values.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span><strong className="text-white">Keep .env in .gitignore</strong> — Never commit environment files with secrets.</span>
                    </li>
                  </ul>
                </m.section>

                {/* Previous / Next Navigation */}
                <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex items-center justify-between pt-8 mt-8 border-t border-slate-800">
                  <Link to="/docs/environment-variables" className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <div>
                      <div className="text-xs text-slate-500">Previous</div>
                      <div className="text-sm font-medium">Environment Variables</div>
                    </div>
                  </Link>
                  <Link to="/docs/env-api" className="group flex items-center gap-2 text-right text-slate-400 hover:text-white transition-colors">
                    <div>
                      <div className="text-xs text-slate-500">Next</div>
                      <div className="text-sm font-medium">Using in API Routes</div>
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