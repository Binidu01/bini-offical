// src/app/docs/environment-variables.tsx
import {
  C,
  Callout,
  CodeBlock,
  DocPage,
  H3,
  OutputBlock,
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
  { id: 'platform-support', label: 'Platform Support' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'api-reference', label: 'API Reference' },
  { id: 'security', label: 'Security Best Practices' },
  { id: 'performance', label: 'Performance' },
  { id: 'troubleshooting', label: 'Troubleshooting' },
  { id: 'complete-example', label: 'Complete Example' },
]

/* ---------- terminals (colored output inside the shared OutputBlock) ---------- */

const BANNER_TEXT = `  ß Bini.js (dev)
  ->  Environments: .env.local, .env
  ->  Local:   http://localhost:3000/
  ->  Network: http://192.168.1.7:3000/`

const ERROR_TEXT = `[bini-env] error  Missing required environment variable: "SMTP_HOST"
  -> Set it in your platform's env config or hosting dashboard.`

const Arrow = () => <span className="text-green-600 dark:text-green-400">➜</span>

const Label = ({ children }: { children: string }) => (
  <strong className="font-bold text-neutral-900 dark:text-white">{children}</strong>
)

const Url = ({ host }: { host: string }) => (
  <span className="text-cyan-700 dark:text-cyan-400">
    http://{host}:<strong className="font-bold">3000</strong>/
  </span>
)

function ServerBanner() {
  return (
    <OutputBlock code={BANNER_TEXT}>
      {'  '}
      <span className="font-bold text-cyan-700 dark:text-cyan-400">ß Bini.js</span>{' '}
      <span className="text-neutral-500">(dev)</span>
      {'\n  '}
      <Arrow />
      {'  '}
      <Label>Environments:</Label>{' '}
      <span className="text-neutral-600 dark:text-neutral-400">.env.local, .env</span>
      {'\n  '}
      <Arrow />
      {'  '}
      <Label>Local:</Label>
      {'   '}
      <Url host="localhost" />
      {'\n  '}
      <Arrow />
      {'  '}
      <Label>Network:</Label> <Url host="192.168.1.7" />
    </OutputBlock>
  )
}

function ErrorTerminal() {
  return (
    <OutputBlock code={ERROR_TEXT}>
      <span className="text-cyan-700 dark:text-cyan-400">[bini-env]</span>{' '}
      <span className="font-semibold text-red-600 dark:text-red-400">error</span>
      {'  Missing required environment variable: '}
      <span className="text-yellow-700 dark:text-yellow-400">&quot;SMTP_HOST&quot;</span>
      {'\n  '}
      <span className="text-green-600 dark:text-green-400">-&gt;</span>{' '}
      <span className="text-neutral-500 dark:text-neutral-400">
        Set it in your platform&apos;s env config or hosting dashboard.
      </span>
    </OutputBlock>
  )
}

/* ---------- content ---------- */

function Content() {
  const lang = useDocLang()
  const t = lang === 'js' ? 'js' : 'ts'
  const x = lang === 'js' ? 'jsx' : 'tsx'

  return (
    <>
      <div className="mb-12">
        <P className="mb-4">
          <C>bini-env</C> is <strong>installed and configured by default</strong> in every Bini.js
          project. It reads env vars from the Hono request context, so variables are always
          resolved from the correct runtime binding - no platform-specific code needed.
        </P>
        <Callout>
          <strong>Hono-native:</strong> <C>getEnv(c, key)</C> / <C>requireEnv(c, key)</C> read
          directly from the Hono request context. Zero dotenv - no <C>.env</C> parsing at runtime;
          vars come from the host platform. Vite handles <C>.env</C> loading during development.
        </Callout>
      </div>

      <Section id="quick-start" title="Quick Start">
        <P className="mb-4">
          <C>bini-env</C> plugin is already registered when you scaffold a new Bini.js project -
          nothing to configure in <C>{`vite.config.${t}`}</C>. Just start using <C>getEnv</C> and{' '}
          <C>requireEnv</C> in your API routes.
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
// biniEnv() is included by default - no setup needed
import { defineConfig } from 'vite'
import { biniEnv } from 'bini-env'

export default defineConfig({
  plugins: [biniEnv()],
})`}
          jsCode={`// vite.config.js - already configured on scaffold
// biniEnv() is included by default - no setup needed
import { defineConfig } from 'vite'
import { biniEnv } from 'bini-env'

export default defineConfig({
  plugins: [biniEnv()],
})`}
        />
        <H3 className="mt-8 mb-3">Read env vars in your Hono handlers</H3>
        <CodeBlock
          filename={`src/app/api/hello.${t}`}
          tsCode={`// src/app/api/hello.ts
import { Hono } from 'hono'
import { getEnv, requireEnv } from 'bini-env'

const app = new Hono()

app.post('/hello', async (c) => {
  try {
    const ctx = c as any

    const apiKey = requireEnv(ctx, 'MY_API_KEY')
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
          jsCode={`// src/app/api/hello.js
import { Hono } from 'hono'
import { getEnv, requireEnv } from 'bini-env'

const app = new Hono()

app.post('/hello', async (c) => {
  try {
    const apiKey = requireEnv(c, 'MY_API_KEY')
    const appName = getEnv(c, 'APP_NAME') ?? 'World'

    return c.json({ message: \`Hello, \${appName}!\` })
  } catch (error) {
    if (error.message?.includes('[bini-env] Missing required')) {
      return c.json({ error: error.message }, 500)
    }
    return c.json({ error: 'Something went wrong.' }, 500)
  }
})

export default app`}
        />
        <Callout>
          Plugin is already registered on scaffold - no manual <C>loadEnv</C> loop in{' '}
          <C>{`vite.config.${t}`}</C> needed. Your secret just needs to exist in <C>.env</C> with no
          prefix, and <C>requireEnv</C> will find it during dev and preview.
        </Callout>
      </Section>

      <Section id="usage-pattern" title="Usage Pattern">
        <P className="mb-4">
          Always pass <C>c</C> explicitly. Cast it once at the top of the handler, then use{' '}
          <C>ctx</C> throughout.
        </P>
        <CodeBlock
          filename={`src/app/api/example.${t}`}
          tsCode={`// src/app/api/example.ts
import { Hono } from 'hono'
import { getEnv, requireEnv } from 'bini-env'

const app = new Hono()

app.post('/example', async (c) => {
  try {
    const ctx = c as any

    const dbUrl = requireEnv(ctx, 'DATABASE_URL')
    const apiKey = requireEnv(ctx, 'STRIPE_SECRET_KEY')

    const model = getEnv(ctx, 'AI_MODEL') ?? 'gpt-4o'
    const region = getEnv(ctx, 'AWS_REGION') ?? 'us-east-1'
    const maxRetries = parseInt(getEnv(ctx, 'MAX_RETRIES') ?? '3')
    const debug = getEnv(ctx, 'DEBUG_MODE') === 'true'

    return c.json({ model, region, maxRetries, debug })
  } catch (error: any) {
    if (error.message?.includes('[bini-env] Missing required')) {
      return c.json({ error: error.message }, 500)
    }
    return c.json({ error: 'Something went wrong.' }, 500)
  }
})

export default app`}
          jsCode={`// src/app/api/example.js
import { Hono } from 'hono'
import { getEnv, requireEnv } from 'bini-env'

const app = new Hono()

app.post('/example', async (c) => {
  try {
    const dbUrl = requireEnv(c, 'DATABASE_URL')
    const apiKey = requireEnv(c, 'STRIPE_SECRET_KEY')

    const model = getEnv(c, 'AI_MODEL') ?? 'gpt-4o'
    const region = getEnv(c, 'AWS_REGION') ?? 'us-east-1'
    const maxRetries = parseInt(getEnv(c, 'MAX_RETRIES') ?? '3')
    const debug = getEnv(c, 'DEBUG_MODE') === 'true'

    return c.json({ model, region, maxRetries, debug })
  } catch (error) {
    if (error.message?.includes('[bini-env] Missing required')) {
      return c.json({ error: error.message }, 500)
    }
    return c.json({ error: 'Something went wrong.' }, 500)
  }
})

export default app`}
        />
        <P className="mt-4 mb-4">The pattern in three steps:</P>
        <CodeBlock
          filename={`src/app/api/pattern.${t}`}
          tsCode={`// src/app/api/pattern.ts
import { Hono } from 'hono'
import { getEnv, requireEnv } from 'bini-env'

const app = new Hono()

app.get('/pattern', (c) => {
  const ctx = c as any                          // 1. cast once, at the top
  const secret = requireEnv(ctx, 'KEY')         // 2. throws if missing
  const mode = getEnv(ctx, 'MODE') ?? 'default' // 3. optional with default

  return c.json({ ok: !!secret, mode })
})

export default app`}
          jsCode={`// src/app/api/pattern.js
import { Hono } from 'hono'
import { getEnv, requireEnv } from 'bini-env'

const app = new Hono()

app.get('/pattern', (c) => {
  const secret = requireEnv(c, 'KEY')           // 1. throws if missing
  const mode = getEnv(c, 'MODE') ?? 'default'   // 2. optional with default

  return c.json({ ok: !!secret, mode })
})

export default app`}
        />
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
          Variables without a prefix are NOT exposed to the browser. During dev/preview they are
          mirrored into <C>process.env</C> automatically, and read via <C>getEnv(ctx, key)</C> in
          API routes.
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
import { requireEnv } from 'bini-env'

const app = new Hono()

app.get('/secrets', (c) => {
  const ctx = c as any
  const dbUrl = requireEnv(ctx, 'DATABASE_URL')

  return c.json({ dbConnected: !!dbUrl })
})

export default app`}
          jsCode={`// src/app/api/secrets.js
import { Hono } from 'hono'
import { requireEnv } from 'bini-env'

const app = new Hono()

app.get('/secrets', (c) => {
  const dbUrl = requireEnv(c, 'DATABASE_URL')

  return c.json({ dbConnected: !!dbUrl })
})

export default app`}
        />
        <H3 className="mt-8 mb-3">Prefix Summary</H3>
        <Table
          headers={['Prefix', 'Exposed to browser', 'Mirrored to process.env', 'Use for']}
          rows={[
            ['BINI_', 'Yes', 'No', 'Public client config'],
            ['VITE_', 'Yes', 'No', 'Public client config'],
            ['No prefix', 'No', 'Yes (dev/preview)', 'Secrets - server only'],
          ]}
        />
        <Callout>
          <strong>Critical:</strong> Never put secrets in <C>BINI_*</C> or <C>VITE_*</C> variables
          - both are exposed to the browser. Use un-prefixed variables for secrets and read them
          with <C>getEnv(ctx, key)</C> inside API route handlers only.
        </Callout>
      </Section>

      <Section id="platform-support" title="Platform Support">
        <P className="mb-4">
          <C>getEnv</C> and <C>requireEnv</C> delegate to Hono&apos;s <C>env(c)</C> adapter, which
          reads from the correct source on every supported platform automatically. Your code never
          changes regardless of where it deploys.
        </P>
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
        <Callout>
          <strong>Cloudflare note:</strong> Secrets set via <C>wrangler secret put</C> are only
          available inside the fetch handler via <C>c.env</C>. <C>getEnv(ctx, key)</C> reads them
          correctly as long as you pass <C>c</C>.
        </Callout>
      </Section>

      <Section id="how-it-works" title="How It Works">
        <P className="mb-4">
          The <C>biniEnv()</C> plugin does two things:
        </P>
        <UL className="mb-4 space-y-1">
          <li>
            Tells Vite to expose <C>BINI_</C> and <C>VITE_</C> prefixed vars to{' '}
            <C>import.meta.env</C>
          </li>
          <li>
            Mirrors non-prefixed <C>.env</C> values into <C>process.env</C> during <C>vite dev</C>{' '}
            / <C>vite preview</C>
          </li>
        </UL>
        <CodeBlock
          filename={`bini-env/index.${t}`}
          code={`// simplified view of the plugin
export function biniEnv() {
  return {
    name: 'bini-env',
    config(userConfig, { command }) {
      if (command === 'serve') {
        const envDir = userConfig.envDir ?? userConfig.root ?? process.cwd()
        // mirrors non-prefixed, non-empty .env values into process.env
        // silent on success, warns on failure - no opt-out
      }
      return { envPrefix: ['BINI_', 'VITE_'] }
    },
  }
}`}
        />
        <P className="mt-4 mb-4">
          The prefix list is fixed - there is no option to add more prefixes. Only <C>BINI_</C> and{' '}
          <C>VITE_</C> are ever exposed to the browser.
        </P>
        <P className="mt-4 mb-4">On server start you will see:</P>
        <ServerBanner />
        <P className="mt-4 mb-4">
          Vite handles everything natively: loading <C>.env</C> files, watching, restarting,
          injecting prefixed vars, and HMR. bini-env does not reimplement any of that.
        </P>
        <P className="mt-2 mb-4">
          <strong>Zero dotenv:</strong> <C>dotenv</C> is never used at runtime. In production, vars
          are set in your hosting platform&apos;s environment config.
        </P>
        <Callout>
          <strong>Precedence:</strong> A value already present in <C>process.env</C> (set by your
          OS, shell, or CI) always wins. <C>.env</C> file values only fill in variables that are not
          already set.
        </Callout>
      </Section>

      <Section id="api-reference" title="API Reference">
        <H3>getEnv(c, key)</H3>
        <P className="mb-2">
          Returns <C>string | undefined</C>. Reads from the Hono request context.
        </P>
        <CodeBlock
          filename={`src/app/api/config.${t}`}
          tsCode={`// src/app/api/config.ts
import { Hono } from 'hono'
import { getEnv } from 'bini-env'

const app = new Hono()

app.get('/config', async (c) => {
  const ctx = c as any

  const region = getEnv(ctx, 'AWS_REGION') ?? 'us-east-1'
  const logLevel = getEnv(ctx, 'LOG_LEVEL') ?? 'info'
  const debug = getEnv(ctx, 'DEBUG_MODE') === 'true'

  return c.json({ region, logLevel, debug })
})

export default app`}
          jsCode={`// src/app/api/config.js
import { Hono } from 'hono'
import { getEnv } from 'bini-env'

const app = new Hono()

app.get('/config', async (c) => {
  const region = getEnv(c, 'AWS_REGION') ?? 'us-east-1'
  const logLevel = getEnv(c, 'LOG_LEVEL') ?? 'info'
  const debug = getEnv(c, 'DEBUG_MODE') === 'true'

  return c.json({ region, logLevel, debug })
})

export default app`}
        />
        <H3 className="mt-8 mb-3">requireEnv(c, key)</H3>
        <P className="mb-2">
          Returns <C>string</C>. Throws immediately if the variable is missing or empty.
        </P>
        <CodeBlock
          filename={`src/app/api/send-email.${t}`}
          tsCode={`// src/app/api/send-email.ts
import { Hono } from 'hono'
import { getEnv, requireEnv } from 'bini-env'

const app = new Hono()

app.post('/send-email', async (c) => {
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
})

export default app`}
          jsCode={`// src/app/api/send-email.js
import { Hono } from 'hono'
import { getEnv, requireEnv } from 'bini-env'

const app = new Hono()

app.post('/send-email', async (c) => {
  try {
    const smtpHost = requireEnv(c, 'SMTP_HOST')
    const smtpPass = requireEnv(c, 'SMTP_PASS')
    const smtpPort = parseInt(getEnv(c, 'SMTP_PORT') ?? '587')

    // ... send email

    return c.json({ sent: true })
  } catch (error) {
    if (error.message?.includes('[bini-env] Missing required')) {
      return c.json({ error: error.message }, 500)
    }
    return c.json({ error: 'Failed to send email.' }, 500)
  }
})

export default app`}
        />
        <P className="mt-4 mb-4">On failure, the terminal will show:</P>
        <ErrorTerminal />
        <H3 className="mt-8 mb-3">biniEnv()</H3>
        <P className="mb-2">
          Vite plugin. Takes no options. It is already registered in the <C>vite.config</C> shown
          in Quick Start.
        </P>
        <P className="mt-2 mb-4">
          There is nothing to configure - no prefix list to extend, no flag to disable the{' '}
          <C>process.env</C> mirror. The prefix list is fixed to <C>['BINI_', 'VITE_']</C>.
        </P>
        <H3 className="mt-8 mb-3">biniLogger</H3>
        <P className="mb-2">
          Vite-style terminal logger. Use it in your own Bini.js plugins or server-side code.
        </P>
        <CodeBlock
          filename={`src/app/api/health.${t}`}
          tsCode={`// src/app/api/health.ts
import { Hono } from 'hono'
import { getEnv, biniLogger } from 'bini-env'

const app = new Hono()

app.get('/health', (c) => {
  const ctx = c as any

  try {
    const region = getEnv(ctx, 'AWS_REGION')

    biniLogger.info('Server ready')
    if (!region) biniLogger.warn('Missing optional var')

    return c.json({ ok: true })
  } catch (error) {
    biniLogger.error('Something broke', error)
    return c.json({ ok: false }, 500)
  }
})

export default app`}
          jsCode={`// src/app/api/health.js
import { Hono } from 'hono'
import { getEnv, biniLogger } from 'bini-env'

const app = new Hono()

app.get('/health', (c) => {
  try {
    const region = getEnv(c, 'AWS_REGION')

    biniLogger.info('Server ready')
    if (!region) biniLogger.warn('Missing optional var')

    return c.json({ ok: true })
  } catch (error) {
    biniLogger.error('Something broke', error)
    return c.json({ ok: false }, 500)
  }
})

export default app`}
        />
        <H3 className="mt-8 mb-3">HonoContext</H3>
        <P className="mb-2">
          Exported type (<C>Context</C> from Hono). Use it to type helper functions that group env
          reads.
        </P>
        <CodeBlock
          filename={`src/app/api/db.${t}`}
          tsCode={`// src/app/api/db.ts
import { Hono } from 'hono'
import { getEnv, requireEnv } from 'bini-env'
import type { HonoContext } from 'bini-env'

function readDbConfig(c: HonoContext) {
  const ctx = c as any
  return {
    url: requireEnv(ctx, 'DATABASE_URL'),
    poolSize: parseInt(getEnv(ctx, 'DB_POOL_SIZE') ?? '10'),
    ssl: getEnv(ctx, 'DB_SSL') !== 'false',
  }
}

const app = new Hono()

app.get('/db', (c) => {
  const db = readDbConfig(c)
  return c.json({ poolSize: db.poolSize, ssl: db.ssl })
})

export default app`}
          jsCode={`// src/app/api/db.js
import { Hono } from 'hono'
import { getEnv, requireEnv } from 'bini-env'

function readDbConfig(c) {
  return {
    url: requireEnv(c, 'DATABASE_URL'),
    poolSize: parseInt(getEnv(c, 'DB_POOL_SIZE') ?? '10'),
    ssl: getEnv(c, 'DB_SSL') !== 'false',
  }
}

const app = new Hono()

app.get('/db', (c) => {
  const db = readDbConfig(c)
  return c.json({ poolSize: db.poolSize, ssl: db.ssl })
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

# GOOD - Not exposed, mirrored into process.env for server-side use
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
          An empty value (<C>API_KEY=</C>) is skipped by the <C>process.env</C> mirror, so{' '}
          <C>requireEnv</C> will correctly throw instead of silently succeeding with an empty
          string.
        </P>
      </Section>

      <Section id="performance" title="Performance">
        <Table
          headers={['Metric', 'Dev', 'Prod']}
          rows={[
            ['File reads', '1 (loadEnv, cached by Vite)', '0'],
            ['Runtime cost', '~0ms (mirror runs once at server start)', '0'],
            ['Bundle impact', 'Minimal', 'Tree-shaken'],
          ]}
        />
        <P className="mt-4 mb-0">
          No dotenv. No per-request disk reads. <C>getEnv</C> is a direct call to Hono&apos;s
          adapter on every invocation - request-scoped and correct.
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
              'Local dev works because biniEnv() mirrors non-prefixed vars into process.env automatically. Production requires platform-level configuration.',
            ],
            [
              'My .env value is not taking effect in dev',
              'Check your shell and CI environment first - the mirror never overrides a variable that is already set. Also check the value is not empty (KEY=).',
            ],
            [
              'requireEnv still throws even though my key is in .env',
              'If the value is KEY= with nothing after the =, it is treated as unset and skipped by design. Give it a real value.',
            ],
            [
              'bini-env is not reading my .env from the right folder',
              'biniEnv() reads from your Vite envDir if set, otherwise root, otherwise the working directory. Double check envDir/root in vite.config.ts.',
            ],
            [
              'Cloudflare secret not found',
              'Secrets set via wrangler secret put are only available via c.env. Ensure you are passing c to the function.',
            ],
            [
              'TypeScript error: Context not assignable to HonoContext',
              'Cast once per handler: const ctx = c as any',
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
          jsCode={`// src/app/api/config.js
import { Hono } from 'hono'
import { getEnv, requireEnv } from 'bini-env'

const app = new Hono()

app.get('/config', (c) => {
  const dbUrl = requireEnv(c, 'DATABASE_URL')
  const jwtSecret = requireEnv(c, 'JWT_SECRET')
  const debug = getEnv(c, 'DEBUG_MODE') === 'true'

  return c.json({ debug, dbConnected: !!dbUrl })
})

export default app`}
        />
      </Section>
    </>
  )
}

export default function EnvironmentVariablesPage() {
  return (
    <DocPage
      title="Environment Variables"
      description="Hono-native environment variable system for Bini.js - works across Node.js, Bun, Deno, Vercel Edge, Netlify Edge, and Cloudflare Workers."
      url="https://bini.js.org/docs/environment-variables"
      editUrl="https://github.com/Binidu01/bini-official/edit/main/src/app/docs/environment-variables.tsx"
      toc={TOC_ITEMS}
      prev={{ to: '/docs/api-cors', title: 'CORS' }}
      next={{ to: '/docs/env-prefixes', title: 'Prefixes & Client Exposure' }}
    >
      <Content />
    </DocPage>
  )
}