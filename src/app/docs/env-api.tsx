// src/app/docs/env-api.tsx
import { Link } from 'react-router-dom'

import {
  C,
  Callout,
  CodeBlock,
  DocPage,
  OutputBlock,
  P,
  Section,
  Table,
  UL,
  useDocLang,
} from '../../components/DocBlocks'
import { RouteVisual } from '../../components/DocVisuals'
import type { TocItem } from '../../components/TableOfContents'

const TOC_ITEMS: TocItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'basic-usage', label: 'Basic Usage' },
  { id: 'required-vs-optional', label: 'Required vs Optional' },
  { id: 'complete-example', label: 'Complete Example' },
  { id: 'error-handling', label: 'Error Handling' },
  { id: 'production-notes', label: 'Production Notes' },
]

const STRONG = 'font-semibold text-black dark:text-white'

function VisualStructure({ ext }: { ext: string }) {
  return (
    <RouteVisual
      fileWidth={280}
      rows={[
        { n: 'app' },
        { n: 'api', d: 1 },
        { n: `hello.${ext}`, d: 2, fn: true, dot: true, url: '/api/hello' },
        { n: `email.${ext}`, d: 2, fn: true, url: '/api/email' },
        { n: `config.${ext}`, d: 2, fn: true, url: '/api/config' },
      ]}
    />
  )
}

function Content() {
  const lang = useDocLang()
  const s = lang === 'js' ? 'js' : 'ts'

  return (
    <>
      <Section id="overview" title="Overview">
        <P>
          In API routes, environment variables are read with <C>getEnv(c, key)</C> and{' '}
          <C>requireEnv(c, key)</C>. Both read from the Hono request context, so the same code
          works on every runtime: Node.js, Bun, Deno, Vercel Edge, Netlify Edge, and Cloudflare
          Workers.
        </P>
        <Callout>
          <strong>Always pass c explicitly.</strong> No casts are needed - <C>getEnv</C> and{' '}
          <C>requireEnv</C> accept the Hono context type natively. Every read is request-scoped,
          so there is no <C>process.env</C> fallback to worry about.
        </Callout>
      </Section>

      <Section id="basic-usage" title="Basic Usage">
        <VisualStructure ext={s} />
        <CodeBlock
          filename={`src/app/api/hello.${s}`}
          tsCode={`// src/app/api/hello.ts
import { Hono } from 'hono'
import { getEnv, requireEnv } from 'bini-env'

const app = new Hono()

app.get('/hello', (c) => {
  try {
    // requireEnv throws if the var is missing - fail fast on required config
    const apiKey = requireEnv(c, 'MY_API_KEY')

    // getEnv returns undefined if missing - use ?? to provide a default
    const appName = getEnv(c, 'APP_NAME') ?? 'World'
    const timeout = parseInt(getEnv(c, 'TIMEOUT_MS') ?? '5000')

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

app.get('/hello', (c) => {
  try {
    // requireEnv throws if the var is missing - fail fast on required config
    const apiKey = requireEnv(c, 'MY_API_KEY')

    // getEnv returns undefined if missing - use ?? to provide a default
    const appName = getEnv(c, 'APP_NAME') ?? 'World'
    const timeout = parseInt(getEnv(c, 'TIMEOUT_MS') ?? '5000')

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
      </Section>

      <Section id="required-vs-optional" title="Required vs Optional">
        <P>
          Use <C>requireEnv</C> for variables your app cannot run without. Use <C>getEnv</C> with{' '}
          <C>??</C> for optional configuration.
        </P>
        <CodeBlock
          filename={`src/app/api/example.${s}`}
          tsCode={`// src/app/api/example.ts
import { Hono } from 'hono'
import { getEnv, requireEnv } from 'bini-env'

const app = new Hono()

app.post('/example', async (c) => {
  try {
    // Required vars - handler throws immediately if missing
    const dbUrl = requireEnv(c, 'DATABASE_URL')
    const apiKey = requireEnv(c, 'STRIPE_SECRET_KEY')

    // Optional vars - fall back to sensible defaults
    const model = getEnv(c, 'AI_MODEL') ?? 'gpt-4o'
    const region = getEnv(c, 'AWS_REGION') ?? 'us-east-1'
    const maxRetries = parseInt(getEnv(c, 'MAX_RETRIES') ?? '3')
    const debug = getEnv(c, 'DEBUG_MODE') === 'true'

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
    // Required vars - handler throws immediately if missing
    const dbUrl = requireEnv(c, 'DATABASE_URL')
    const apiKey = requireEnv(c, 'STRIPE_SECRET_KEY')

    // Optional vars - fall back to sensible defaults
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
        <Table
          headers={['Function', 'Use for', 'Behavior']}
          rows={[
            [
              'requireEnv(c, key)',
              'Required config - app cannot run without',
              'Throws if missing or empty',
            ],
            [
              'getEnv(c, key) ?? default',
              'Optional config - fallback to default',
              'Returns undefined if missing',
            ],
          ]}
        />
      </Section>

      <Section id="complete-example" title="Complete Example">
        <P>A full API endpoint that uses environment variables for configuration:</P>
        <CodeBlock
          filename={`src/app/api/email.${s}`}
          tsCode={`// src/app/api/email.ts
import { Hono } from 'hono'
import { getEnv, requireEnv } from 'bini-env'
import nodemailer from 'nodemailer'

const app = new Hono()

app.post('/email/send', async (c) => {
  try {
    const smtpHost = requireEnv(c, 'SMTP_HOST')
    const smtpUser = requireEnv(c, 'SMTP_USER')
    const smtpPass = requireEnv(c, 'SMTP_PASS')
    const fromEmail = requireEnv(c, 'FROM_EMAIL')

    const smtpPort = parseInt(getEnv(c, 'SMTP_PORT') ?? '587')
    const secure = getEnv(c, 'SMTP_SECURE') === 'true'
    const debug = getEnv(c, 'DEBUG_MODE') === 'true'
    const appName = getEnv(c, 'APP_NAME') ?? 'Bini.js App'

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure,
      auth: { user: smtpUser, pass: smtpPass },
      debug,
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
          jsCode={`// src/app/api/email.js
import { Hono } from 'hono'
import { getEnv, requireEnv } from 'bini-env'
import nodemailer from 'nodemailer'

const app = new Hono()

app.post('/email/send', async (c) => {
  try {
    const smtpHost = requireEnv(c, 'SMTP_HOST')
    const smtpUser = requireEnv(c, 'SMTP_USER')
    const smtpPass = requireEnv(c, 'SMTP_PASS')
    const fromEmail = requireEnv(c, 'FROM_EMAIL')

    const smtpPort = parseInt(getEnv(c, 'SMTP_PORT') ?? '587')
    const secure = getEnv(c, 'SMTP_SECURE') === 'true'
    const debug = getEnv(c, 'DEBUG_MODE') === 'true'
    const appName = getEnv(c, 'APP_NAME') ?? 'Bini.js App'

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure,
      auth: { user: smtpUser, pass: smtpPass },
      debug,
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
  } catch (error) {
    if (error.message?.includes('[bini-env] Missing required')) {
      return c.json({ error: error.message }, 500)
    }
    console.error('Email error:', error)
    return c.json({ error: 'Failed to send email.' }, 500)
  }
})

export default app`}
        />
      </Section>

      <Section id="error-handling" title="Error Handling">
        <P>
          Always handle errors from <C>requireEnv</C> gracefully:
        </P>
        <CodeBlock
          filename={`src/app/api/config.${s}`}
          tsCode={`// src/app/api/config.ts
import { Hono } from 'hono'
import { requireEnv } from 'bini-env'

const app = new Hono()

app.get('/config', async (c) => {
  try {
    const apiKey = requireEnv(c, 'API_KEY')
    const secret = requireEnv(c, 'SECRET_TOKEN')

    return c.json({ configured: true })
  } catch (error: any) {
    if (error.message?.includes('[bini-env] Missing required')) {
      return c.json(
        {
          error: 'Configuration error',
          details: error.message,
        },
        500
      )
    }

    return c.json({ error: 'Something went wrong' }, 500)
  }
})

export default app`}
          jsCode={`// src/app/api/config.js
import { Hono } from 'hono'
import { requireEnv } from 'bini-env'

const app = new Hono()

app.get('/config', async (c) => {
  try {
    const apiKey = requireEnv(c, 'API_KEY')
    const secret = requireEnv(c, 'SECRET_TOKEN')

    return c.json({ configured: true })
  } catch (error) {
    if (error.message?.includes('[bini-env] Missing required')) {
      return c.json(
        {
          error: 'Configuration error',
          details: error.message,
        },
        500
      )
    }

    return c.json({ error: 'Something went wrong' }, 500)
  }
})

export default app`}
        />
        <P>On failure, the terminal shows:</P>
        <OutputBlock
          code={`[bini-env] error  Missing required environment variable: "API_KEY"
  -> Set it in your platform's env config or hosting dashboard.`}
        >
          <span className="font-bold text-red-600 dark:text-red-400">[bini-env] error</span>
          {'  Missing required environment variable: '}
          <span className="text-amber-600 dark:text-yellow-300">&quot;API_KEY&quot;</span>
          {'\n'}
          <span className="text-neutral-400 dark:text-neutral-500">
            {"  -> Set it in your platform's env config or hosting dashboard."}
          </span>
        </OutputBlock>
      </Section>

      <Section id="production-notes" title="Production Notes">
        <UL>
          <li>
            <strong className={STRONG}>Set vars in production</strong> - <C>.env</C> files are only
            loaded during development. In production, set variables in your hosting
            platform&apos;s dashboard.
          </li>
          <li>
            <strong className={STRONG}>No platform-specific code</strong> - <C>getEnv</C> and{' '}
            <C>requireEnv</C> work on Node.js, Bun, Deno, Vercel Edge, Netlify Edge, and Cloudflare
            Workers.
          </li>
          <li>
            <strong className={STRONG}>Never expose secrets</strong> - Never return secret values
            in API responses. Only return configuration status.
          </li>
          <li>
            <strong className={STRONG}>Use BINI_ for client vars</strong> - Use the <C>BINI_</C>{' '}
            prefix for client-side public config. No prefix for server-only secrets.
          </li>
        </UL>
        <Callout>
          The same API code runs unchanged across all platforms. The environment functions read from
          the correct source on every platform automatically.
        </Callout>
      </Section>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link to="/docs/environment-variables" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Environment Variables</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Overview of getEnv and requireEnv.</p>
        </Link>
        <Link to="/docs/env-prefixes" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Prefixes &amp; Client Exposure</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">What gets bundled and what stays server-side.</p>
        </Link>
        <Link to="/docs/api-routes" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">API Routes Overview</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Files under app/api/ map to /api/*.</p>
        </Link>
        <Link to="/docs/api-hono" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Hono Integration</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Routing, middleware, and validation with Hono.</p>
        </Link>
      </div>
    </>
  )
}

export default function EnvApiPage() {
  return (
    <DocPage
      title="Using Environment Variables in API Routes"
      description="Read environment variables in API routes with getEnv and requireEnv."
      url="https://bini.js.org/docs/env-api"
      editUrl="https://github.com/Binidu01/bini-official/edit/main/src/app/docs/env-api.tsx"
      toc={TOC_ITEMS}
      prev={{ to: '/docs/env-prefixes', title: 'Prefixes & Client Exposure' }}
      next={{ to: '/docs/css', title: 'CSS Overview' }}
    >
      <Content />
    </DocPage>
  )
}