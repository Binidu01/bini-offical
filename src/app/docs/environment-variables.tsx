// src/app/docs/environment-variables.tsx
import { Link } from 'react-router-dom'

import {
  C,
  Callout,
  CodeBlock,
  DocPage,
  H3,
  P,
  Section,
  Table,
  UL,
  useDocLang,
} from '../../components/DocBlocks'
import { FolderVisual, RouteVisual } from '../../components/DocVisuals'
import type { TocItem } from '../../components/TableOfContents'

const TOC_ITEMS: TocItem[] = [
  { id: 'quick-start', label: 'Quick Start' },
  { id: 'usage-pattern', label: 'Usage Pattern' },
  { id: 'environment-prefixes', label: 'Environment Prefixes' },
  { id: 'api-reference', label: 'API Reference' },
  { id: 'security', label: 'Security Best Practices' },
  { id: 'troubleshooting', label: 'Troubleshooting' },
  { id: 'complete-example', label: 'Complete Example' },
]

function Content() {
  const lang = useDocLang()
  const t = lang === 'js' ? 'js' : 'ts'
  const x = lang === 'js' ? 'jsx' : 'tsx'

  return (
    <>
      <div className="mb-12">
        <P className="mb-4">
          Bini.js uses standard environment variable handling across the client and server. On the
          client, variables are accessed through <C>import.meta.env</C>. In API routes, they are read
          from the Hono request context via <C>c.env</C>, ensuring they resolve correctly from the
          host platform (Node.js, Bun, Deno, Cloudflare, etc.) with no platform-specific code.
        </P>
        <Callout>
          <strong>Zero config:</strong> During development, <C>.env</C> files are loaded
          automatically. Secrets are available in your API routes via <C>c.env</C> without any extra
          setup.
        </Callout>
      </div>

      <Section id="quick-start" title="Quick Start">
        <P className="mb-4">
          Bini.js is configured out of the box. Just start using the environment variables in your
          routes.
        </P>
        <RouteVisual
          fileWidth={260}
          rows={[
            { n: '.env', dot: true },
            { n: `vite.config.${t}` },
            { n: 'src' },
            { n: 'app', d: 1 },
            { n: 'api', d: 2 },
            { n: `hello.${t}`, d: 3, fn: true, dot: true, url: '/api/hello' },
          ]}
        />
        <CodeBlock
          filename={`vite.config.${t}`}
          tsCode={`// vite.config.ts - already configured on scaffold
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    // ...your plugins
  ],
})`}
          jsCode={`// vite.config.js - already configured on scaffold
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    // ...your plugins
  ],
})`}
        />
        <H3 className="mt-8 mb-3">Read env vars in your Hono handlers</H3>
        <CodeBlock
          filename={`src/app/api/hello.${t}`}
          tsCode={`// src/app/api/hello.ts
import { Hono } from 'hono'

const app = new Hono()

app.post('/hello', async (c) => {
  const apiKey = c.env.MY_API_KEY
  const appName = c.env.APP_NAME ?? 'World'

  if (!apiKey) {
    return c.json({ error: 'Missing MY_API_KEY' }, 500)
  }

  return c.json({ message: \`Hello, \${appName}!\` })
})

export default app`}
          jsCode={`// src/app/api/hello.js
import { Hono } from 'hono'

const app = new Hono()

app.post('/hello', async (c) => {
  const apiKey = c.env.MY_API_KEY
  const appName = c.env.APP_NAME ?? 'World'

  if (!apiKey) {
    return c.json({ error: 'Missing MY_API_KEY' }, 500)
  }

  return c.json({ message: \`Hello, \${appName}!\` })
})

export default app`}
        />
        <Callout>
          Your secret just needs to exist in <C>.env</C> with no prefix. In production, set it in
          your hosting platform's dashboard.
        </Callout>
      </Section>

      <Section id="usage-pattern" title="Usage Pattern">
        <P className="mb-4">
          Access environment variables directly from the Hono context <C>c.env</C>. This ensures
          they are request-scoped and correctly resolved for your runtime.
        </P>
        <CodeBlock
          filename={`src/app/api/example.${t}`}
          tsCode={`// src/app/api/example.ts
import { Hono } from 'hono'

const app = new Hono()

app.post('/example', async (c) => {
  // Required vars: check and throw immediately if missing
  const dbUrl = c.env.DATABASE_URL
  const apiKey = c.env.STRIPE_SECRET_KEY
  if (!dbUrl || !apiKey) {
    return c.json({ error: 'Missing required configuration' }, 500)
  }

  // Optional vars: fall back to sensible defaults
  const model = c.env.AI_MODEL ?? 'gpt-4o'
  const region = c.env.AWS_REGION ?? 'us-east-1'
  const maxRetries = parseInt(c.env.MAX_RETRIES ?? '3')
  const debug = c.env.DEBUG_MODE === 'true'

  return c.json({ model, region, maxRetries, debug })
})

export default app`}
          jsCode={`// src/app/api/example.js
import { Hono } from 'hono'

const app = new Hono()

app.post('/example', async (c) => {
  // Required vars: check and throw immediately if missing
  const dbUrl = c.env.DATABASE_URL
  const apiKey = c.env.STRIPE_SECRET_KEY
  if (!dbUrl || !apiKey) {
    return c.json({ error: 'Missing required configuration' }, 500)
  }

  // Optional vars: fall back to sensible defaults
  const model = c.env.AI_MODEL ?? 'gpt-4o'
  const region = c.env.AWS_REGION ?? 'us-east-1'
  const maxRetries = parseInt(c.env.MAX_RETRIES ?? '3')
  const debug = c.env.DEBUG_MODE === 'true'

  return c.json({ model, region, maxRetries, debug })
})

export default app`}
        />
        <P className="mt-4 mb-4">The pattern in three steps:</P>
        <CodeBlock
          filename={`src/app/api/pattern.${t}`}
          tsCode={`// src/app/api/pattern.ts
import { Hono } from 'hono'

const app = new Hono()

app.get('/pattern', (c) => {
  const secret = c.env.KEY        // 1. required: check for missing
  const mode = c.env.MODE ?? 'default' // 2. optional: ?? gives a default

  if (!secret) {
    return c.json({ error: 'Missing KEY' }, 500)
  }

  return c.json({ ok: true, mode })
})

export default app`}
          jsCode={`// src/app/api/pattern.js
import { Hono } from 'hono'

const app = new Hono()

app.get('/pattern', (c) => {
  const secret = c.env.KEY        // 1. required: check for missing
  const mode = c.env.MODE ?? 'default' // 2. optional: ?? gives a default

  if (!secret) {
    return c.json({ error: 'Missing KEY' }, 500)
  }

  return c.json({ ok: true, mode })
})

export default app`}
        />
        <UL className="mt-4 space-y-1">
          <li>
            Check <C>c.env.KEY</C> for vars the handler cannot run without.
          </li>
          <li>
            Use <C>{`c.env.KEY ?? 'default'`}</C> for optional vars with sensible defaults.
          </li>
          <li>
            An empty value (<C>KEY=</C>) is returned as <C>&apos;&apos;</C>, so <C>??</C> does not
            fall back. Check for it explicitly if you rely on a fallback.
          </li>
        </UL>
      </Section>

      <Section id="environment-prefixes" title="Environment Prefixes">
        <P className="mb-4">
          Vite loads <C>.env</C> files from your project root. The prefix of each variable decides
          where it ends up.
        </P>
        <FolderVisual
          width={260}
          rows={[
            { n: '.env', dot: true },
            { n: '.env.local' },
            { n: '.env.development' },
            { n: '.env.production' },
          ]}
        />
        <H3>BINI_ - Client-side vars</H3>
        <P className="mb-4">
          <C>BINI_</C> variables are exposed to <C>import.meta.env</C>. Use them for public
          client-side config.
        </P>
        <CodeBlock
          filename=".env"
          lang="text"
          code={`# .env
BINI_PUBLIC_API_URL=https://api.example.com`}
        />
        <CodeBlock
          filename={`src/app/page.${x}`}
          code={`export default function HomePage() {
  const apiUrl = import.meta.env.BINI_PUBLIC_API_URL

  return <p>API: {apiUrl}</p>
}`}
        />
        <H3 className="mt-8 mb-3">VITE_ - Public client vars</H3>
        <P className="mb-4">
          <C>VITE_</C> is Vite&apos;s built-in prefix. Any var starting with <C>VITE_</C> is
          bundled into your client-side JavaScript.
        </P>
        <CodeBlock
          filename=".env"
          lang="text"
          code={`# .env
VITE_ANALYTICS_ID=UA-XXXX`}
        />
        <CodeBlock
          filename={`src/app/page.${x}`}
          code={`export default function HomePage() {
  const analyticsId = import.meta.env.VITE_ANALYTICS_ID

  return <p>Analytics: {analyticsId}</p>
}`}
        />
        <H3 className="mt-8 mb-3">No prefix - Secrets (server only)</H3>
        <P className="mb-4">
          Variables without a prefix are NOT exposed to the browser. They are read via{' '}
          <C>c.env</C> in API routes. During dev and preview they are also mirrored into{' '}
          <C>process.env</C> automatically.
        </P>
        <CodeBlock
          filename=".env"
          lang="text"
          code={`# .env
DATABASE_URL=postgres://...
STRIPE_SECRET_KEY=sk_live_...`}
        />
        <CodeBlock
          filename={`src/app/api/secrets.${t}`}
          tsCode={`// src/app/api/secrets.ts
import { Hono } from 'hono'

const app = new Hono()

app.get('/secrets', (c) => {
  const dbUrl = c.env.DATABASE_URL

  if (!dbUrl) {
    return c.json({ error: 'Missing DATABASE_URL' }, 500)
  }

  return c.json({ dbConnected: true })
})

export default app`}
          jsCode={`// src/app/api/secrets.js
import { Hono } from 'hono'

const app = new Hono()

app.get('/secrets', (c) => {
  const dbUrl = c.env.DATABASE_URL

  if (!dbUrl) {
    return c.json({ error: 'Missing DATABASE_URL' }, 500)
  }

  return c.json({ dbConnected: true })
})

export default app`}
        />
        <H3 className="mt-8 mb-3">Prefix Summary</H3>
        <Table
          headers={['Prefix', 'Exposed to browser', 'Mirrored to process.env (dev/preview)', 'Use for']}
          rows={[
            ['BINI_', 'Yes', 'Yes (unless already set)', 'Public client config'],
            ['VITE_', 'Yes', 'Yes (unless already set)', 'Public client config'],
            ['No prefix', 'No', 'Yes (unless already set)', 'Secrets - server only'],
          ]}
        />
        <Callout>
          <strong>Critical:</strong> Never put secrets in <C>BINI_*</C> or <C>VITE_*</C> variables
          - both are exposed to the browser. Use un-prefixed variables for secrets and read them
          via <C>c.env</C> inside API route handlers only.
        </Callout>
      </Section>

      <Section id="api-reference" title="API Reference">
        <H3>Accessing variables</H3>
        <P className="mb-2">
          On the client, use <C>import.meta.env</C> for public variables. In API routes, use{' '}
          <C>c.env</C> to read from the runtime bindings.
        </P>
        <Table
          headers={['Environment', 'Access Method', 'Behavior']}
          rows={[
            ['Client', 'import.meta.env.KEY', 'Bundled at build time. Only BINI_ and VITE_ prefixes.'],
            ['API Routes', 'c.env.KEY', 'Runtime bindings. All variables, including secrets.'],
          ]}
        />
        <CodeBlock
          filename={`src/app/api/config.${t}`}
          tsCode={`// src/app/api/config.ts
import { Hono } from 'hono'

const app = new Hono()

app.get('/config', async (c) => {
  const region = c.env.AWS_REGION ?? 'us-east-1'
  const logLevel = c.env.LOG_LEVEL ?? 'info'
  const debug = c.env.DEBUG_MODE === 'true'

  return c.json({ region, logLevel, debug })
})

export default app`}
          jsCode={`// src/app/api/config.js
import { Hono } from 'hono'

const app = new Hono()

app.get('/config', async (c) => {
  const region = c.env.AWS_REGION ?? 'us-east-1'
  const logLevel = c.env.LOG_LEVEL ?? 'info'
  const debug = c.env.DEBUG_MODE === 'true'

  return c.json({ region, logLevel, debug })
})

export default app`}
        />
      </Section>

      <Section id="security" title="Security Best Practices">
        <H3>Rule 1: Never Prefix Secrets</H3>
        <CodeBlock
          filename=".env"
          lang="text"
          code={`# .env

# BAD - This will be exposed to the browser!
BINI_DATABASE_URL=postgres://...

# GOOD - Not exposed, read via c.env in API routes
DATABASE_URL=postgres://...`}
        />
        <H3 className="mt-8 mb-3">Rule 2: Use BINI_ or VITE_ for Public Data</H3>
        <CodeBlock
          filename=".env"
          lang="text"
          code={`# .env

# GOOD - Public data
BINI_API_URL=https://api.example.com
VITE_GA_ID=UA-XXXXX`}
        />
        <H3 className="mt-8 mb-3">Rule 3: Do not Leave Secret Placeholders Empty</H3>
        <P className="mb-0">
          An empty value (<C>API_KEY=</C>) is still treated as configured by the runtime, but you
          should check for it explicitly in your handler to fail fast:
        </P>
      </Section>

      <Section id="troubleshooting" title="Troubleshooting">
        <Table
          headers={['Problem', 'Solution']}
          rows={[
            [
              'Env var undefined in production',
              'Set variables in your hosting platform env dashboard (Vercel, Netlify, Cloudflare, etc.).',
            ],
            [
              'Works in dev, undefined in prod',
              'Local dev works because .env files are loaded automatically. Production requires platform-level configuration.',
            ],
            [
              'c.env is undefined',
              'Ensure you are passing the Hono context c directly to your route handlers.',
            ],
            [
              'getEnv returned an empty string instead of my default',
              "An empty .env value is returned as '', and ?? only falls back for undefined. Check for it explicitly or remove the empty line.",
            ],
            [
              'Cloudflare secret not found',
              'Secrets set via wrangler secret put are only available via c.env. Ensure you are passing c to the function.',
            ],
            [
              'Types not found',
              'Add /// <reference types="vite/client" /> to your tsconfig.json or entry file.',
            ],
          ]}
        />
      </Section>

      <Section id="complete-example" title="Complete Example">
        <RouteVisual
          fileWidth={260}
          rows={[
            { n: '.env', dot: true },
            { n: 'src' },
            { n: 'app', d: 1 },
            { n: `page.${x}`, d: 2, url: '/' },
            { n: 'api', d: 2 },
            { n: `config.${t}`, d: 3, fn: true, dot: true, url: '/api/config' },
          ]}
        />
        <CodeBlock
          filename=".env"
          lang="text"
          code={`# .env
BINI_PUBLIC_API_URL=https://api.example.com
VITE_APP_NAME=My App
DATABASE_URL=postgres://localhost:5432/mydb
JWT_SECRET=your_jwt_secret`}
        />
        <CodeBlock
          filename={`src/app/page.${x}`}
          code={`// src/app/page.tsx
export default function HomePage() {
  const apiUrl = import.meta.env.BINI_PUBLIC_API_URL
  const appName = import.meta.env.VITE_APP_NAME
  return <h1>{appName}</h1>
}`}
        />
        <CodeBlock
          filename={`src/app/api/config.${t}`}
          tsCode={`// src/app/api/config.ts
import { Hono } from 'hono'

const app = new Hono()

app.get('/config', (c) => {
  const dbUrl = c.env.DATABASE_URL
  const jwtSecret = c.env.JWT_SECRET
  const debug = c.env.DEBUG_MODE === 'true'

  if (!dbUrl || !jwtSecret) {
    return c.json({ error: 'Missing required configuration' }, 500)
  }

  return c.json({ debug, dbConnected: true })
})

export default app`}
          jsCode={`// src/app/api/config.js
import { Hono } from 'hono'

const app = new Hono()

app.get('/config', (c) => {
  const dbUrl = c.env.DATABASE_URL
  const jwtSecret = c.env.JWT_SECRET
  const debug = c.env.DEBUG_MODE === 'true'

  if (!dbUrl || !jwtSecret) {
    return c.json({ error: 'Missing required configuration' }, 500)
  }

  return c.json({ debug, dbConnected: true })
})

export default app`}
        />
      </Section>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link to="/docs/env-prefixes" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Prefixes &amp; Client Exposure</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">What gets bundled and what stays server-side.</p>
        </Link>
        <Link to="/docs/env-api" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Using in API Routes</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Read env vars from Hono handlers.</p>
        </Link>
        <Link to="/docs/api-routes" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">API Routes Overview</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Files under app/api/ map to /api/*.</p>
        </Link>
        <Link to="/docs/deploying" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Deployment</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Deploy to Node, Vercel, Netlify, Cloudflare, or Deno.</p>
        </Link>
      </div>
    </>
  )
}

export default function EnvironmentVariablesPage() {
  return (
    <DocPage
      title="Environment Variables"
      description="Standard environment variable handling for Bini.js - works across Node.js, Bun, Deno, Vercel Edge, Netlify Edge, and Cloudflare Workers."
      url="https://bini.js.org/docs/environment-variables"
      editUrl="https://github.com/Binidu01/bini-official/edit/main/src/app/docs/environment-variables.tsx"
      toc={TOC_ITEMS}
      prev={{ to: '/docs/api-dynamic', title: 'Dynamic API Routes' }}
      next={{ to: '/docs/env-prefixes', title: 'Prefixes & Client Exposure' }}
    >
      <Content />
    </DocPage>
  )
}