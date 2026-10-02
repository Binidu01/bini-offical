// src/app/docs/env-prefixes.tsx
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
  { id: 'what-are-prefixes', label: 'What are Prefixes?' },
  { id: 'bini-prefix', label: 'BINI_ Prefix' },
  { id: 'vite-prefix', label: 'VITE_ Prefix' },
  { id: 'no-prefix', label: 'No Prefix (Secrets)' },
  { id: 'client-access', label: 'Client-Side Access' },
  { id: 'server-access', label: 'Server-Side Access' },
  { id: 'getenv-vs-requireenv', label: 'getEnv vs requireEnv' },
  { id: 'security-best-practices', label: 'Security Best Practices' },
]

/* ---------- terminal (colored output inside the shared OutputBlock) ---------- */

const ERROR_TEXT = `[bini-env] error  Missing required environment variable: "SMTP_HOST"
  -> Set it in your platform's env config or hosting dashboard.`

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
      <Section id="what-are-prefixes" title="What are Prefixes?">
        <P className="mb-4">
          Environment variable prefixes determine which variables are exposed to the browser and
          which are kept server-side. The prefix tells Vite and Bini.js how to handle each
          variable.
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
        <Table
          headers={['Prefix', 'Exposed to browser', 'Read with', 'Use for']}
          rows={[
            ['BINI_', 'Yes', 'import.meta.env', 'Public client config'],
            ['VITE_', 'Yes', 'import.meta.env', 'Public client config'],
            ['No prefix', 'No', 'getEnv / requireEnv', 'Secrets - server only'],
          ]}
        />
        <Callout>
          Both <C>BINI_</C> and <C>VITE_</C> prefixes are exposed to the browser by default.
          Variables without a prefix are never exposed to the client.
        </Callout>
        <Callout>
          <strong>Fixed prefixes:</strong> The prefix list in <C>bini-env</C> v2 is fixed to{' '}
          <C>['BINI_', 'VITE_']</C>. There is no option to add custom prefixes.
        </Callout>
      </Section>

      <Section id="bini-prefix" title="BINI_ Prefix">
        <P className="mb-4">
          <C>BINI_</C> is the default prefix for client-side environment variables in Bini.js.
          These variables are exposed to the browser via <C>import.meta.env</C>.
        </P>
        <RouteVisual
          fileWidth={260}
          rows={[
            { n: '.env', dot: true },
            { n: 'src' },
            { n: 'app', d: 1 },
            { n: `page.${x}`, d: 2, dot: true, url: '/' },
          ]}
        />
        <CodeBlock
          filename=".env"
          lang="text"
          code={`# .env
BINI_PUBLIC_API_URL=https://api.example.com
BINI_APP_NAME=My App
BINI_ANALYTICS_ID=UA-XXXX`}
        />
        <CodeBlock
          filename={`src/app/page.${x}`}
          code={`export default function HomePage() {
  const apiUrl = import.meta.env.BINI_PUBLIC_API_URL
  const appName = import.meta.env.BINI_APP_NAME
  const analyticsId = import.meta.env.BINI_ANALYTICS_ID

  return (
    <div>
      <h1>{appName}</h1>
      <p>API: {apiUrl}</p>
      <p>Analytics: {analyticsId}</p>
    </div>
  )
}`}
        />
        <Callout>
          <strong>Important:</strong> <C>BINI_*</C> variables are bundled into your client-side
          JavaScript. Never put secrets in <C>BINI_*</C> variables.
        </Callout>
      </Section>

      <Section id="vite-prefix" title="VITE_ Prefix">
        <P className="mb-4">
          <C>VITE_</C> is Vite&apos;s standard prefix for client-side environment variables. Any
          variable starting with <C>VITE_</C> is exposed to the browser.
        </P>
        <CodeBlock
          filename=".env"
          lang="text"
          code={`# .env
VITE_API_URL=https://api.example.com
VITE_APP_TITLE=My App
VITE_GA_ID=UA-XXXXX`}
        />
        <CodeBlock
          filename={`src/app/page.${x}`}
          code={`export default function HomePage() {
  const apiUrl = import.meta.env.VITE_API_URL
  const title = import.meta.env.VITE_APP_TITLE
  const gaId = import.meta.env.VITE_GA_ID

  return (
    <div>
      <h1>{title}</h1>
      <p>API: {apiUrl}</p>
      <p>Analytics: {gaId}</p>
    </div>
  )
}`}
        />
        <Callout>
          <strong>Note:</strong> <C>VITE_*</C> and <C>BINI_*</C> work the same way. Both are
          exposed to the browser. Choose whichever you prefer.
        </Callout>
      </Section>

      <Section id="no-prefix" title="No Prefix (Secrets)">
        <P className="mb-4">
          Variables without a prefix are <strong>never</strong> exposed to the browser. They are
          only accessible server-side via <C>getEnv(ctx, key)</C> in API routes.
        </P>
        <RouteVisual
          fileWidth={260}
          rows={[
            { n: '.env', dot: true },
            { n: 'src' },
            { n: 'app', d: 1 },
            { n: 'api', d: 2 },
            { n: `config.${t}`, d: 3, fn: true, dot: true, url: '/api/config' },
          ]}
        />
        <CodeBlock
          filename=".env"
          lang="text"
          code={`# .env
DATABASE_URL=postgres://localhost:5432/mydb
STRIPE_SECRET_KEY=sk_live_...
SMTP_PASS=super_secret
JWT_SECRET=your_jwt_secret`}
        />
        <CodeBlock
          filename={`src/app/api/config.${t}`}
          tsCode={`// src/app/api/config.ts
import { Hono } from 'hono'
import { requireEnv } from 'bini-env'

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
    jwtConfigured: !!jwtSecret,
    smtpConfigured: !!smtpPass,
  })
})

export default app`}
          jsCode={`// src/app/api/config.js
import { Hono } from 'hono'
import { requireEnv } from 'bini-env'

const app = new Hono()

app.get('/config', (c) => {
  // These are only accessible server-side
  const dbUrl = requireEnv(c, 'DATABASE_URL')
  const jwtSecret = requireEnv(c, 'JWT_SECRET')
  const smtpPass = requireEnv(c, 'SMTP_PASS')

  // Never expose secrets in responses
  return c.json({
    dbConnected: !!dbUrl,
    jwtConfigured: !!jwtSecret,
    smtpConfigured: !!smtpPass,
  })
})

export default app`}
        />
        <Callout>
          <strong>Critical:</strong> Variables without a prefix are the only way to keep secrets
          secure. Never use <C>BINI_*</C> or <C>VITE_*</C> for sensitive data.
        </Callout>
      </Section>

      <Section id="client-access" title="Client-Side Access">
        <P className="mb-4">
          Client-side variables are accessed via <C>import.meta.env</C> in any component:
        </P>
        <CodeBlock
          filename={`src/app/page.${x}`}
          code={`export default function Page() {
  // Access client-side variables
  const apiUrl = import.meta.env.BINI_API_URL
  const appName = import.meta.env.VITE_APP_NAME

  return (
    <div>
      <h1>{appName}</h1>
      <p>API: {apiUrl}</p>
    </div>
  )
}`}
        />
        <P className="mt-4 mb-4">The same works in MDX files:</P>
        <CodeBlock
          filename="src/app/about/page.mdx"
          code={`export const metadata = {
  title: import.meta.env.VITE_APP_NAME,
}

# Welcome to {import.meta.env.VITE_APP_NAME}`}
        />
        <Callout>
          <C>import.meta.env</C> is available in all client-side code including pages, components,
          and MDX files.
        </Callout>
      </Section>

      <Section id="server-access" title="Server-Side Access">
        <P className="mb-4">
          Server-side variables are accessed via <C>getEnv(ctx, key)</C> and{' '}
          <C>requireEnv(ctx, key)</C> in API routes:
        </P>
        <RouteVisual
          fileWidth={260}
          rows={[
            { n: '.env', dot: true },
            { n: 'src' },
            { n: 'app', d: 1 },
            { n: 'api', d: 2 },
            { n: `email.${t}`, d: 3, fn: true, dot: true, url: '/api/email/send' },
          ]}
        />
        <CodeBlock
          filename={`src/app/api/email.${t}`}
          tsCode={`// src/app/api/email.ts
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
          jsCode={`// src/app/api/email.js
import { Hono } from 'hono'
import { getEnv, requireEnv } from 'bini-env'

const app = new Hono()

app.post('/email/send', async (c) => {
  // Server-side secrets (no prefix)
  const smtpHost = requireEnv(c, 'SMTP_HOST')
  const smtpPass = requireEnv(c, 'SMTP_PASS')
  const fromEmail = requireEnv(c, 'FROM_EMAIL')

  // Optional config with defaults
  const smtpPort = parseInt(getEnv(c, 'SMTP_PORT') ?? '587')

  // Client-side config (BINI_)
  const publicUrl = getEnv(c, 'BINI_API_URL')

  return c.json({
    success: true,
    publicUrl, // This is safe to return
    // smtpPass is NEVER returned to the client
  })
})

export default app`}
        />
        <Table
          headers={['Access Method', 'Where', 'Variables']}
          rows={[
            ['import.meta.env', 'Client components', 'BINI_, VITE_'],
            ['getEnv(ctx, key)', 'API routes', 'All variables (including no prefix)'],
            ['requireEnv(ctx, key)', 'API routes', 'All variables (throws if missing)'],
          ]}
        />
      </Section>

      <Section id="getenv-vs-requireenv" title="getEnv vs requireEnv">
        <P className="mb-4">
          Both <C>getEnv</C> and <C>requireEnv</C> read environment variables from the Hono request
          context, but they behave differently:
        </P>
        <Table
          headers={['Feature', 'getEnv(ctx, key)', 'requireEnv(ctx, key)']}
          rows={[
            ['Returns', 'string | undefined', 'string'],
            ['On missing', 'Returns undefined', 'Throws error immediately'],
            ['Use case', 'Optional configuration with defaults', 'Required configuration'],
            ['Default pattern', "getEnv(ctx, 'KEY') ?? 'default'", "requireEnv(ctx, 'KEY')"],
            ['Error handling', 'Manual check for undefined', 'Try/catch or let it bubble'],
            [
              'When to use',
              'Feature flags, optional settings',
              'Database URLs, API keys, credentials',
            ],
          ]}
        />
        <CodeBlock
          filename={`src/app/api/compare.${t}`}
          tsCode={`// src/app/api/compare.ts
import { Hono } from 'hono'
import { getEnv, requireEnv } from 'bini-env'

const app = new Hono()

app.get('/compare', (c) => {
  const ctx = c as any

  // getEnv - for optional values
  const debug = getEnv(ctx, 'DEBUG_MODE') === 'true'
  const region = getEnv(ctx, 'AWS_REGION') ?? 'us-east-1'
  const maxRetries = parseInt(getEnv(ctx, 'MAX_RETRIES') ?? '3')

  // requireEnv - for required values
  const dbUrl = requireEnv(ctx, 'DATABASE_URL')
  const apiKey = requireEnv(ctx, 'STRIPE_SECRET_KEY')
  const smtpPass = requireEnv(ctx, 'SMTP_PASS')

  return c.json({ debug, region, maxRetries, ready: !!(dbUrl && apiKey && smtpPass) })
})

export default app`}
          jsCode={`// src/app/api/compare.js
import { Hono } from 'hono'
import { getEnv, requireEnv } from 'bini-env'

const app = new Hono()

app.get('/compare', (c) => {
  // getEnv - for optional values
  const debug = getEnv(c, 'DEBUG_MODE') === 'true'
  const region = getEnv(c, 'AWS_REGION') ?? 'us-east-1'
  const maxRetries = parseInt(getEnv(c, 'MAX_RETRIES') ?? '3')

  // requireEnv - for required values
  const dbUrl = requireEnv(c, 'DATABASE_URL')
  const apiKey = requireEnv(c, 'STRIPE_SECRET_KEY')
  const smtpPass = requireEnv(c, 'SMTP_PASS')

  return c.json({ debug, region, maxRetries, ready: !!(dbUrl && apiKey && smtpPass) })
})

export default app`}
        />
        <Callout>
          <strong>Best practice:</strong> Use <C>requireEnv</C> for critical configuration that
          your app cannot function without. Use <C>getEnv</C> with <C>??</C> defaults for optional
          configuration.
        </Callout>
        <P className="mt-4 mb-4">
          On failure, <C>requireEnv</C> logs a descriptive error to the terminal:
        </P>
        <ErrorTerminal />
      </Section>

      <Section id="security-best-practices" title="Security Best Practices">
        <UL>
          <li>
            <strong>Never prefix secrets</strong> - Use no prefix for database URLs, API keys, and
            tokens.
          </li>
          <li>
            <strong>Use BINI_ or VITE_ for public config</strong> - Use these for non-sensitive
            configuration like API URLs.
          </li>
          <li>
            <strong>Use requireEnv for critical values</strong> - Fail fast when required
            configuration is missing.
          </li>
          <li>
            <strong>Use getEnv with defaults for optional values</strong> - Keep your app flexible
            with sensible defaults.
          </li>
          <li>
            <strong>Never expose secrets in responses</strong> - Do not return secret values from
            API routes.
          </li>
          <li>
            <strong>Use .env.example</strong> - Document required variables without committing
            actual values.
          </li>
          <li>
            <strong>Keep .env in .gitignore</strong> - Never commit environment files with secrets.
          </li>
        </UL>
        <H3>.env.example</H3>
        <CodeBlock
          filename=".env.example"
          lang="text"
          code={`# .env.example - commit this file, never your real .env

# Public (exposed to the browser)
BINI_PUBLIC_API_URL=
VITE_APP_NAME=

# Secrets (server only)
DATABASE_URL=
JWT_SECRET=`}
        />
        <H3 className="mt-8 mb-3">.gitignore</H3>
        <CodeBlock
          filename=".gitignore"
          lang="text"
          code={`# .gitignore
.env
.env.local
.env.*.local`}
        />
      </Section>
    </>
  )
}

export default function EnvPrefixesPage() {
  return (
    <DocPage
      title="Prefixes & Client Exposure"
      description="Learn how environment variable prefixes work and which variables are exposed to the client."
      url="https://bini.js.org/docs/env-prefixes"
      editUrl="https://github.com/Binidu01/bini-official/edit/main/src/app/docs/env-prefixes.tsx"
      toc={TOC_ITEMS}
      prev={{ to: '/docs/environment-variables', title: 'Environment Variables' }}
      next={{ to: '/docs/env-api', title: 'Using in API Routes' }}
    >
      <Content />
    </DocPage>
  )
}