// src/app/plugins/bini-env/page.tsx
import {
  Callout,
  C,
  CodeBlock,
  MultiTerminal,
  OutputBlock,
  P,
  Section,
  Table,
  UL,
} from '../../components/DocBlocks'
import { PluginPage } from '../../components/PluginPage'
import type { TocItem } from '../../components/TableOfContents'

const TOC_ITEMS: TocItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'installation', label: 'Installation' },
  { id: 'quick-start', label: 'Quick Start' },
  { id: 'prefixes', label: 'Prefixes' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'platform-support', label: 'Platform Support' },
  { id: 'api-reference', label: 'API Reference' },
  { id: 'security', label: 'Security' },
  { id: 'compatibility', label: 'Compatibility' },
]

const EDIT_URL =
  'https://github.com/Binidu01/bini-official/edit/main/src/app/plugins/bini-env/page.tsx'

const H3_CLS = 'mb-3 mt-8 text-base font-semibold text-neutral-900 dark:text-neutral-200'
const STRONG = 'font-medium text-neutral-900 dark:text-neutral-100'

const DEV_BANNER_TEXT = `  Bini.js (dev)
  Environments: .env.local, .env
  Local:   http://localhost:3000/
  Network: http://192.168.1.7:3000/`

const WARN_BANNER_TEXT = `10:45:55 (warning) [bini-env] Failed to inject .env into process.env: <reason>`

const REQUIRE_ENV_ERROR_TEXT = `[bini-env] error  Missing required environment variable: "SMTP_HOST"
  -> Set it in your platform's env config or hosting dashboard.`

/** Colored dev server banner, matching the real terminal output. */
function DevBanner() {
  const label = (s: string) => (
    <strong className="font-bold text-neutral-900 dark:text-white">{s}</strong>
  )
  const url = (host: string) => (
    <span className="text-cyan-700 dark:text-cyan-400">
      http://{host}:<strong className="font-bold">3000</strong>/
    </span>
  )
  return (
    <OutputBlock code={DEV_BANNER_TEXT}>
      {'  '}
      <span className="font-bold text-cyan-700 dark:text-cyan-400">Bini.js</span>{' '}
      <span className="text-neutral-500">(dev)</span>
      {'\n  '}
      <span className="text-neutral-500">Environments:</span>{' '}
      <span className="text-neutral-600 dark:text-neutral-400">.env.local, .env</span>
      {'\n  '}
      {label('Local:')}
      {'   '}
      {url('localhost')}
      {'\n  '}
      {label('Network:')} {url('192.168.1.7')}
    </OutputBlock>
  )
}

/** Colored warning banner. */
function WarnBanner() {
  return (
    <OutputBlock code={WARN_BANNER_TEXT}>
      <span className="text-neutral-500">10:45:55</span>{' '}
      <span className="text-amber-600 dark:text-amber-400">(warning)</span>{' '}
      <span className="text-rose-600 dark:text-rose-400">[bini-env]</span>{' '}
      <span className="text-neutral-700 dark:text-neutral-300">
        Failed to inject <span className="text-cyan-700 dark:text-cyan-400">.env</span> into{' '}
        <span className="text-cyan-700 dark:text-cyan-400">process.env</span>:{' '}
      </span>
      <span className="text-neutral-500">&lt;reason&gt;</span>
    </OutputBlock>
  )
}

/** Colored requireEnv error output. */
function RequireEnvError() {
  return (
    <OutputBlock code={REQUIRE_ENV_ERROR_TEXT}>
      <span className="text-rose-600 dark:text-rose-400">[bini-env]</span>{' '}
      <span className="font-semibold text-rose-600 dark:text-rose-400">error</span>
      {'  '}
      <span className="text-neutral-700 dark:text-neutral-300">
        Missing required environment variable:{' '}
      </span>
      <span className="text-amber-600 dark:text-amber-400">"SMTP_HOST"</span>
      {'\n  '}
      <span className="text-neutral-500">
        -&gt; Set it in your platform's env config or hosting dashboard.
      </span>
    </OutputBlock>
  )
}

export default function BiniEnvPage() {
  return (
    <PluginPage
      title="bini-env"
      badge="Official"
      description="Environment variable system + Vite plugin for Bini.js. Hono-native, universal runtime, zero-config dev secrets."
      url="https://bini.dev/plugins/bini-env"
      editUrl={EDIT_URL}
      toc={TOC_ITEMS}
      prev={{ to: '/plugins/bini-router', title: 'bini-router' }}
      next={{ to: '/plugins/bini-native', title: 'bini-native' }}
    >
      <Section id="overview" title="Overview">
        <P>
          <C>bini-env</C> reads environment variables from the Hono request context, so they
          always resolve from the correct runtime binding - Node.js, Bun, Deno, Vercel Edge,
          Netlify Edge, or Cloudflare Workers - without any per-platform code.
        </P>
        <P>
          In dev, it also mirrors non-prefixed <C>.env</C> values into <C>process.env</C> so
          Node-hosted Hono routes can read server-side secrets with no manual setup.
        </P>
      </Section>

      <Section id="installation" title="Installation">
        <MultiTerminal
          tabs={[
            { id: 'npm', label: 'npm', command: `$ npm install bini-env hono` },
            { id: 'pnpm', label: 'pnpm', command: `$ pnpm add bini-env hono` },
            { id: 'yarn', label: 'yarn', command: `$ yarn add bini-env hono` },
            { id: 'bun', label: 'bun', command: `$ bun add bini-env hono` },
          ]}
        />
        <Callout>
          <C>hono</C> is a required peer dependency.
        </Callout>
      </Section>

      <Section id="quick-start" title="Quick Start">
        <h3 className={H3_CLS}>1. Register the plugin</h3>
        <CodeBlock
          filename="vite.config.ts"
          lang="js"
          code={`import { defineConfig } from 'vite'
import { biniEnv } from 'bini-env'

export default defineConfig({
  plugins: [biniEnv()],
})`}
        />
        <P>
          <C>biniEnv()</C> takes no options.
        </P>

        <h3 className={H3_CLS}>2. Read env vars in a Hono handler</h3>
        <CodeBlock
          filename="src/app/api/hello.ts"
          lang="js"
          code={`import { Hono } from 'hono'
import { getEnv, requireEnv } from 'bini-env'

const app = new Hono()

app.post('/hello', async (c) => {
  try {
    const ctx = c as any

    // Throws if missing — use for required config
    const apiKey = requireEnv(ctx, 'MY_API_KEY')

    // Returns undefined if missing — use for optional config
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
        />
        <P>
          Non-prefixed keys like <C>MY_API_KEY</C> are read from your <C>.env</C> file in dev. In
          production, set them in your hosting platform's environment config.
        </P>
      </Section>

      <Section id="prefixes" title="Prefixes">
        <P>
          Two prefixes are exposed to the browser: <C>BINI_</C> and <C>VITE_</C>. Everything else
          stays server-side.
        </P>
        <Table
          headers={['Prefix', 'Browser', 'Server-side', 'Use for']}
          rows={[
            ['No prefix', 'Never', 'Yes', 'Secrets - API keys, DB URLs, tokens'],
            ['BINI_', 'Always', 'Yes', 'Public config'],
            ['VITE_', 'Always', 'Yes', 'Public config'],
          ]}
        />
        <CodeBlock
          filename=".env"
          lang="env"
          code={`# Server-side only
DATABASE_URL=postgres://...
STRIPE_SECRET_KEY=sk_live_...

# Exposed to the browser
BINI_API_URL=https://api.example.com
VITE_ANALYTICS_ID=UA-XXXX`}
        />
        <Callout>
          The prefix list is fixed - there's no config surface that can widen what's exposed. Use
          no prefix for anything secret.
        </Callout>
      </Section>

      <Section id="how-it-works" title="How It Works">
        <h3 className="mb-3 text-base font-semibold text-neutral-900 dark:text-neutral-200">
          Dev and preview
        </h3>
        <P>
          On <C>vite dev</C> / <C>vite preview</C>, <C>biniEnv()</C> loads your <C>.env*</C> files
          with Vite's own <C>loadEnv</C> and mirrors every non-prefixed value into{' '}
          <C>process.env</C>. That's what makes server-side secrets readable inside Hono routes
          without a manual loop.
        </P>
        <UL>
          <li>Runs only in dev / preview - never on <C>vite build</C>.</li>
          <li>
            Reads from Vite's <C>envDir</C>, then <C>root</C>, then the working directory.
          </li>
          <li>
            Never overrides a value already set in <C>process.env</C> (OS / shell / CI wins).
          </li>
          <li>Skips empty values, so <C>requireEnv</C> still fails loudly on placeholders.</li>
          <li>
            Respects <C>envDir: false</C> by skipping the mirror entirely.
          </li>
        </UL>
        <P>On success it's silent. On failure it warns - but the dev server still boots:</P>
        <WarnBanner />
        <P>The startup banner is unchanged:</P>
        <DevBanner />
        <P>
          If you already have a manual <C>loadEnv</C> loop in <C>vite.config.ts</C>, delete it -
          this plugin replaces it:
        </P>
        <CodeBlock
          filename="vite.config.ts"
          lang="js"
          code={`export default defineConfig({
  plugins: [biniEnv()],
})`}
        />

        <h3 className={H3_CLS}>Reading env vars</h3>
        <P>
          <C>getEnv</C> and <C>requireEnv</C> read from <C>env(c)</C> via <C>hono/adapter</C>.
          Every read is request-scoped and resolved by Hono for the current platform. <C>dotenv</C>{' '}
          is never used.
        </P>
      </Section>

      <Section id="platform-support" title="Platform Support">
        <Table
          headers={['Platform', 'Runtime', 'Source', 'How Hono reads it']}
          rows={[
            ['Node.js', 'Node', 'System env / dev mirror', 'process.env'],
            ['Bun', 'Bun', 'System env / dev mirror', 'process.env'],
            ['Vercel Edge', 'V8 isolate', 'Project settings', 'process.env'],
            ['Netlify Edge', 'Deno', 'Site settings', 'Deno.env.get()'],
            ['Cloudflare Workers', 'V8 isolate', 'wrangler.toml / dashboard', 'c.env'],
            ['Deno Deploy', 'Deno', 'Project settings', 'Deno.env.get()'],
          ]}
        />
        <Callout>
          <strong>Cloudflare:</strong> secrets set via <C>wrangler secret put</C> are only
          available via <C>c.env</C> inside a handler. Pass <C>c</C> to <C>getEnv</C> /{' '}
          <C>requireEnv</C> and they resolve correctly.
        </Callout>
      </Section>

      <Section id="api-reference" title="API Reference">
        <h3 className="mb-3 text-base font-semibold text-neutral-900 dark:text-neutral-200">
          getEnv(c, key)
        </h3>
        <P>
          Returns <C>string | undefined</C>.
        </P>
        <CodeBlock
          filename="src/app/api/config.ts"
          lang="js"
          code={`const region = getEnv(ctx, 'AWS_REGION') ?? 'us-east-1'
const debug  = getEnv(ctx, 'DEBUG_MODE') === 'true'`}
        />

        <h3 className={H3_CLS}>requireEnv(c, key)</h3>
        <P>
          Returns <C>string</C>. Throws if the variable is missing or empty, and logs the failure
          to the terminal:
        </P>
        <RequireEnvError />

        <h3 className={H3_CLS}>biniEnv()</h3>
        <P>Vite plugin. Takes no options.</P>

        <h3 className={H3_CLS}>biniLogger</h3>
        <P>Vite-style logger for your own plugins or server code.</P>
        <CodeBlock
          filename="src/lib/logger.ts"
          lang="js"
          code={`import { biniLogger } from 'bini-env'

biniLogger.info('Server ready')
biniLogger.warn('Missing optional var')
biniLogger.error('Something broke', error)`}
        />

        <h3 className={H3_CLS}>HonoContext</h3>
        <P>
          Exported type (<C>Context</C> from Hono). Use it to type helpers that group env reads.
        </P>
        <CodeBlock
          filename="src/lib/db-config.ts"
          lang="js"
          code={`import type { HonoContext } from 'bini-env'

function readDbConfig(c: HonoContext) {
  const ctx = c as any
  return {
    url: requireEnv(ctx, 'DATABASE_URL'),
    poolSize: parseInt(getEnv(ctx, 'DB_POOL_SIZE') ?? '10'),
  }
}`}
        />
      </Section>

      <Section id="security" title="Security">
        <UL>
          <li>
            <strong className={STRONG}>Never prefix secrets.</strong> <C>BINI_</C> and <C>VITE_</C>{' '}
            are always exposed to the browser.
          </li>
          <li>
            <strong className={STRONG}>Use no prefix for secrets.</strong> Available server-side via{' '}
            <C>getEnv</C> / <C>requireEnv</C>.
          </li>
          <li>
            <strong className={STRONG}>Don't leave secret placeholders empty.</strong>{' '}
            <C>API_KEY=</C> is skipped, so <C>requireEnv</C> throws instead of silently returning
            an empty string.
          </li>
          <li>
            <strong className={STRONG}>Let OS / CI win in dev.</strong> Override locally with a
            shell var instead of editing <C>.env</C>:
            <div className="mt-3">
              <CodeBlock
                filename="Terminal"
                lang="shell"
                code={`$ DATABASE_URL=postgres://staging... pnpm dev`}
              />
            </div>
          </li>
        </UL>
      </Section>

      <Section id="compatibility" title="Compatibility">
        <Table
          headers={['Tool', 'Version']}
          rows={[
            ['Vite', '8.x'],
            ['Hono', '4.x'],
            ['TypeScript', '5.x'],
            ['Node.js', '≥ 20.19'],
          ]}
        />
      </Section>
    </PluginPage>
  )
}