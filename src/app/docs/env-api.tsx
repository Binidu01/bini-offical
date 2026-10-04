// src/app/docs/env-api.tsx
import type { ReactNode } from 'react'

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
import { Arrow, CARD, GridBg, LINE, RouteVisual } from '../../components/DocVisuals'
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

/* ------------------------------------------------------------------ */
/* Visuals                                                             */
/* ------------------------------------------------------------------ */

function Box({
  title,
  accent = false,
  children,
}: {
  title: string
  accent?: boolean
  children: ReactNode
}) {
  return (
    <div className={`w-52 shrink-0 ${CARD} ${accent ? 'ring-1 ring-blue-500/40' : ''}`}>
      <div
        className={`border-b px-3 py-1.5 text-[11px] text-neutral-500 dark:text-neutral-400 ${LINE}`}
      >
        {title}
      </div>
      <div className="p-3 font-mono text-[11px] leading-relaxed text-neutral-700 dark:text-neutral-300">
        {children}
      </div>
    </div>
  )
}

/** .env -> getEnv / requireEnv -> API handler */
function VisualEnvFlow() {
  return (
    <GridBg>
      <div className="flex items-center gap-3">
        <Box title=".env or hosting dashboard">
          <div>
            <span className="text-sky-600 dark:text-sky-400">MY_API_KEY</span>=sk_live_…
          </div>
          <div>
            <span className="text-sky-600 dark:text-sky-400">APP_NAME</span>=Bini
          </div>
        </Box>
        <Arrow />
        <Box title="via hono/adapter" accent>
          <div className="text-blue-600 dark:text-blue-300">getEnv(ctx, key)</div>
          <div className="text-blue-600 dark:text-blue-300">requireEnv(ctx, key)</div>
        </Box>
        <Arrow />
        <Box title="API handler">
          <div>const key = requireEnv(</div>
          <div className="pl-3">ctx, &apos;MY_API_KEY&apos;</div>
          <div>)</div>
        </Box>
      </div>
    </GridBg>
  )
}

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

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

function Content() {
  const lang = useDocLang()
  const s = lang === 'js' ? 'js' : 'ts'

  return (
    <>
      <Section id="overview" title="Overview">
        <P>
          In API routes, environment variables are read with <C>getEnv(c, key)</C> and{' '}
          <C>requireEnv(c, key)</C>. Both read from the Hono request context via{' '}
          <C>hono/adapter</C> - that is what makes them work on every runtime.
        </P>
        <VisualEnvFlow />
        <Callout>
          <strong>Auto-imported:</strong> <C>getEnv</C> and <C>requireEnv</C> are auto-imported in
          API routes - you do not need to write the import from <C>bini-env</C> manually.
        </Callout>
        <Callout>
          <strong>Always pass c explicitly.</strong> In TypeScript, cast it once at the top of the
          handler as <C>const ctx = c as any</C>, then use <C>ctx</C> throughout. No{' '}
          <C>process.env</C> fallbacks - every read is request-scoped.
        </Callout>
      </Section>

      <Section id="basic-usage" title="Basic Usage">
        <VisualStructure ext={s} />
        <CodeBlock
          filename={`src/app/api/hello.${s}`}
          tsCode={`// src/app/api/hello.ts
import { Hono } from 'hono'

const app = new Hono()

app.get('/hello', (c) => {
  try {
    const ctx = c as any

    // requireEnv throws if the var is missing - fail fast on required config
    const apiKey = requireEnv(ctx, 'MY_API_KEY')

    // getEnv returns undefined if missing - use ?? to provide a default
    const appName = getEnv(ctx, 'APP_NAME') ?? 'World'
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
          jsCode={`// src/app/api/hello.js
import { Hono } from 'hono'

const app = new Hono()

app.get('/hello', (c) => {
  try {
    const ctx = c

    // requireEnv throws if the var is missing - fail fast on required config
    const apiKey = requireEnv(ctx, 'MY_API_KEY')

    // getEnv returns undefined if missing - use ?? to provide a default
    const appName = getEnv(ctx, 'APP_NAME') ?? 'World'
    const timeout = parseInt(getEnv(ctx, 'TIMEOUT_MS') ?? '5000')

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
          tsCode={`app.post('/example', async (c) => {
  try {
    const ctx = c as any

    // Required vars - handler throws immediately if missing
    const dbUrl = requireEnv(ctx, 'DATABASE_URL')
    const apiKey = requireEnv(ctx, 'STRIPE_SECRET_KEY')

    // Optional vars - fall back to sensible defaults
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
})`}
          jsCode={`app.post('/example', async (c) => {
  try {
    const ctx = c

    // Required vars - handler throws immediately if missing
    const dbUrl = requireEnv(ctx, 'DATABASE_URL')
    const apiKey = requireEnv(ctx, 'STRIPE_SECRET_KEY')

    // Optional vars - fall back to sensible defaults
    const model = getEnv(ctx, 'AI_MODEL') ?? 'gpt-4o'
    const region = getEnv(ctx, 'AWS_REGION') ?? 'us-east-1'
    const maxRetries = parseInt(getEnv(ctx, 'MAX_RETRIES') ?? '3')
    const debug = getEnv(ctx, 'DEBUG_MODE') === 'true'

    return c.json({ model, region, maxRetries, debug })
  } catch (error) {
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
            [
              'requireEnv(ctx, key)',
              'Required config - app cannot run without',
              'Throws if missing or empty',
            ],
            [
              'getEnv(ctx, key) ?? default',
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
import nodemailer from 'nodemailer'

const app = new Hono()

app.post('/email/send', async (c) => {
  try {
    const ctx = c as any

    const smtpHost = requireEnv(ctx, 'SMTP_HOST')
    const smtpUser = requireEnv(ctx, 'SMTP_USER')
    const smtpPass = requireEnv(ctx, 'SMTP_PASS')
    const fromEmail = requireEnv(ctx, 'FROM_EMAIL')

    const smtpPort = parseInt(getEnv(ctx, 'SMTP_PORT') ?? '587')
    const secure = getEnv(ctx, 'SMTP_SECURE') === 'true'
    const debug = getEnv(ctx, 'DEBUG_MODE') === 'true'
    const appName = getEnv(ctx, 'APP_NAME') ?? 'Bini.js App'

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
import nodemailer from 'nodemailer'

const app = new Hono()

app.post('/email/send', async (c) => {
  try {
    const ctx = c

    const smtpHost = requireEnv(ctx, 'SMTP_HOST')
    const smtpUser = requireEnv(ctx, 'SMTP_USER')
    const smtpPass = requireEnv(ctx, 'SMTP_PASS')
    const fromEmail = requireEnv(ctx, 'FROM_EMAIL')

    const smtpPort = parseInt(getEnv(ctx, 'SMTP_PORT') ?? '587')
    const secure = getEnv(ctx, 'SMTP_SECURE') === 'true'
    const debug = getEnv(ctx, 'DEBUG_MODE') === 'true'
    const appName = getEnv(ctx, 'APP_NAME') ?? 'Bini.js App'

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
          tsCode={`app.get('/config', async (c) => {
  try {
    const ctx = c as any

    const apiKey = requireEnv(ctx, 'API_KEY')
    const secret = requireEnv(ctx, 'SECRET_TOKEN')

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
})`}
          jsCode={`app.get('/config', async (c) => {
  try {
    const ctx = c

    const apiKey = requireEnv(ctx, 'API_KEY')
    const secret = requireEnv(ctx, 'SECRET_TOKEN')

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
})`}
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
          The same API code runs unchanged across all platforms. bini-env reads from the correct
          source on every platform automatically.
        </Callout>
      </Section>
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