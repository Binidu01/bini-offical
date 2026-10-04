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
import { FolderVisual, GridBg, Arrow, CARD } from '../../components/DocVisuals'
import { PluginPage } from '../../components/PluginPage'
import type { TocItem } from '../../components/TableOfContents'

const TOC_ITEMS: TocItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'installation', label: 'Installation' },
  { id: 'quick-start', label: 'Quick Start' },
  { id: 'prefixes', label: 'Prefixes' },
  { id: 'platform-support', label: 'Platform Support' },
  { id: 'api-reference', label: 'API Reference' },
  { id: 'troubleshooting', label: 'Troubleshooting' },
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

const REQUIRE_ENV_ERROR_TEXT = `[bini-env] error  Missing required environment variable: "SMTP_HOST"
  -> Set it in your platform's env config or hosting dashboard.`

const BOX = `${CARD} flex items-center px-3 text-[12px] text-neutral-800 dark:text-neutral-200`

/** How a request resolves an env var. */
function EnvFlowVisual() {
  return (
    <GridBg>
      <div className="flex items-center gap-3">
        <span className={`${BOX} h-10 w-28 shrink-0 justify-center font-semibold`}>
          Hono handler
        </span>
        <Arrow />
        <span className={`${BOX} h-10 w-32 shrink-0 justify-center`}>
          <span className="mr-2 text-neutral-500">getEnv(c,</span>
          key)
        </span>
        <Arrow />
        <div className="flex flex-col gap-2">
          <span className={`${BOX} h-10 w-64 shrink-0`}>
            <span className="mr-2 text-neutral-500">dev</span>
            mirrors .env → process.env
          </span>
          <span className={`${BOX} h-10 w-64 shrink-0`}>
            <span className="mr-2 text-neutral-500">prod</span>
            platform env binding
          </span>
        </div>
      </div>
    </GridBg>
  )
}

/** Colored dev server banner. */
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
        <EnvFlowVisual />
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

        <h3 className={H3_CLS}>3. Your .env file</h3>
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

        <h3 className={H3_CLS}>4. Dev banner</h3>
        <DevBanner />
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
        <Callout>
          The prefix list is fixed - there's no config surface that can widen what's exposed. Use
          no prefix for anything secret.
        </Callout>
      </Section>

      <Section id="platform-support" title="Platform Support">
        <P>
          <C>getEnv</C> / <C>requireEnv</C> delegate to Hono's <C>env(c)</C> adapter, which reads
          from the correct source on every platform automatically.
        </P>
        <Table
          headers={['Platform', 'Runtime', 'Source']}
          rows={[
            ['Node.js', 'Node', 'process.env'],
            ['Bun', 'Bun', 'process.env'],
            ['Vercel Edge', 'V8 isolate', 'process.env'],
            ['Netlify Edge', 'Deno', 'Deno.env.get()'],
            ['Cloudflare Workers', 'V8 isolate', 'c.env'],
            ['Deno Deploy', 'Deno', 'Deno.env.get()'],
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
          Returns <C>string | undefined</C>. Use for optional config.
        </P>
        <CodeBlock
          filename="src/app/api/config.ts"
          lang="js"
          code={`const region = getEnv(ctx, 'AWS_REGION') ?? 'us-east-1'
const debug  = getEnv(ctx, 'DEBUG_MODE') === 'true'`}
        />

        <h3 className={H3_CLS}>requireEnv(c, key)</h3>
        <P>
          Returns <C>string</C>. Throws if the variable is missing or empty.
        </P>
        <RequireEnvError />
      </Section>

      <Section id="troubleshooting" title="Troubleshooting">
        <UL>
          <li>
            <strong className={STRONG}>Works in dev, undefined in prod</strong> - <C>.env</C>{' '}
            files are only loaded by Vite during dev and preview. In production, set vars in your
            hosting platform's dashboard.
          </li>
          <li>
            <strong className={STRONG}>
              My .env value isn't taking effect in dev
            </strong>{' '}
            - either the value is already set in your shell / CI (which wins), or it's empty (
            <C>KEY=</C>), which is skipped by design.
          </li>
          <li>
            <strong className={STRONG}>requireEnv throws even though the key is in .env</strong>{' '}
            - an empty <C>KEY=</C> is treated as unset. Give it a real value, or remove the line.
          </li>
          <li>
            <strong className={STRONG}>bini-env reads .env from the wrong folder</strong> - it
            uses Vite's <C>envDir</C>, then <C>root</C>, then the working directory. Check{' '}
            <C>envDir</C> / <C>root</C> in <C>vite.config.ts</C> if your <C>.env</C> lives
            somewhere non-standard.
          </li>
          <li>
            <strong className={STRONG}>Cloudflare secret not found</strong> -{' '}
            <C>wrangler secret put</C> secrets only live on <C>c.env</C>. Pass <C>c</C> to{' '}
            <C>getEnv</C> / <C>requireEnv</C>.
          </li>
          <li>
            <strong className={STRONG}>
              TypeScript: Context not assignable to HonoContext
            </strong>{' '}
            - Hono 4.12+ added a symbol to <C>HonoRequest</C> that breaks strict assignability.
            Cast once per handler: <C>const ctx = c as any</C>.
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