// src/app/plugins/bini-env/page.tsx
import {
  C,
  CodeBlock,
  H3,
  MultiTerminal,
  OutputBlock,
  P,
  Section,
  Table,
  UL,
  type TerminalTab,
} from '../../components/DocBlocks'
import { Arrow, CARD, GridBg } from '../../components/DocVisuals'
import { PluginPage } from '../../components/PluginPage'
import type { TocItem } from '../../components/TableOfContents'

const TOC_ITEMS: TocItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'requirements', label: 'Requirements' },
  { id: 'install', label: 'Install' },
  { id: 'quick-start', label: 'Quick Start' },
  { id: 'prefixes', label: 'Prefixes' },
  { id: 'platform-support', label: 'Platform Support' },
  { id: 'api-reference', label: 'API Reference' },
]

const EDIT_URL =
  'https://github.com/Binidu01/bini-official/edit/main/src/app/plugins/bini-env/page.tsx'

/* ---- package-manager tab helpers ---------------------------------- */

const PMS = ['npm', 'pnpm', 'yarn', 'bun'] as const
type Pm = (typeof PMS)[number]

const INSTALL: Record<Pm, string> = {
  npm: 'npm install bini-env hono',
  pnpm: 'pnpm add bini-env hono',
  yarn: 'yarn add bini-env hono',
  bun: 'bun add bini-env hono',
}

const tabs = (cmd: (pm: Pm) => string): TerminalTab[] =>
  PMS.map((pm) => ({ id: pm, label: pm, command: cmd(pm) }))

const DEV_BANNER_TEXT = `  ß Bini.js (dev)
  ➜  Environments: .env
  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.1.7:3000/`

const REQUIRE_ENV_ERROR_TEXT = `[bini-env] error Missing required environment variable: "SMTP_HOST"
  -> Set it in your hosting dashboard (or in .env for dev, preview and bini-server).`

const BOX = `${CARD} flex items-center px-3 text-[12px] text-neutral-800 dark:text-neutral-200`

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
            .env
          </span>
          <span className={`${BOX} h-10 w-64 shrink-0`}>
            <span className="mr-2 text-neutral-500">prod</span>
            platform env
          </span>
        </div>
      </div>
    </GridBg>
  )
}

function DevBanner() {
  const arrow = <span className="text-green-500 dark:text-green-400">➜</span>

  const label = (s: string) => (
    <strong className="font-bold text-neutral-900 dark:text-white">{s}</strong>
  )

  const url = (host: string) => (
    <span className="text-cyan-600 dark:text-cyan-400">http://{host}:3000/</span>
  )

  return (
    <OutputBlock code={DEV_BANNER_TEXT}>
      {'  '}
      <span className="font-bold text-cyan-600 dark:text-cyan-400">ß Bini.js</span>{' '}
      <span className="text-neutral-900 dark:text-white">(dev)</span>
      {'\n  '}
      {arrow}  {label('Environments:')}{' '}
      <span className="text-neutral-900 dark:text-white">.env</span>
      {'\n  '}
      {arrow}  {label('Local:')}   {url('localhost')}
      {'\n  '}
      {arrow}  {label('Network:')} {url('192.168.1.7')}
    </OutputBlock>
  )
}

function RequireEnvError() {
  return (
    <OutputBlock code={REQUIRE_ENV_ERROR_TEXT}>
      <span className="text-rose-600 dark:text-rose-400">[bini-env]</span>{' '}
      <span className="font-semibold text-rose-600 dark:text-rose-400">error</span>{' '}
      <span className="text-neutral-700 dark:text-neutral-300">
        Missing required environment variable:{' '}
      </span>
      <span className="text-amber-600 dark:text-amber-400">&quot;SMTP_HOST&quot;</span>
      {'\n  '}
      <span className="text-neutral-500">
        -&gt; Set it in your hosting dashboard (or in .env for dev, preview and bini-server).
      </span>
    </OutputBlock>
  )
}

export default function BiniEnvPage() {
  return (
    <PluginPage
      title="bini-env"
      badge="Official"
      description="Environment variable system for Bini.js. Hono-native, works on every runtime."
      url="https://www.npmjs.com/package/bini-env"
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

      <Section id="requirements" title="Requirements">
        <UL>
          <li>
            <C>hono</C> <C>{'>='} 4.0.0</C> - required peer dependency
          </li>
          <li>
            Vite <C>{'>='} 8.0.0</C> - optional peer, only needed for the Vite plugin
          </li>
          <li>
            Node.js <C>{'>='} 20.12.0</C>
          </li>
        </UL>
      </Section>

      <Section id="install" title="Install">
        <MultiTerminal tabs={tabs((pm) => `$ ${INSTALL[pm]}`)} />
        <P>The package has three entry points:</P>
        <Table
          headers={['Import', 'Contents', 'Runs on']}
          rows={[
            [
              'bini-env',
              'getEnv, requireEnv, checkEnv, requireEnvs, biniLogger, and types',
              'Any runtime',
            ],
            ['bini-env/vite', 'biniEnv()', 'Node, inside Vite'],
            ['bini-env/node', 'loadEnvFiles, envFilesFor', 'Node'],
          ]}
        />
      </Section>

      <Section id="quick-start" title="Quick Start">
        <H3>1. Register the Vite plugin</H3>
        <CodeBlock
          filename="vite.config.ts"
          code={`import { defineConfig } from 'vite'
import { biniEnv } from 'bini-env/vite'

export default defineConfig({
  plugins: [biniEnv()],
})`}
        />
        <P>
          <C>biniEnv()</C> takes no options.
        </P>

        <H3>2. Read env vars in a Hono handler</H3>
        <CodeBlock
          filename="src/app/api/hello.ts"
          code={`import { Hono } from 'hono'
import { getEnv, requireEnv } from 'bini-env'

const app = new Hono()

app.post('/hello', async (c) => {
  try {
    // requireEnv throws if the var is missing or empty
    const apiKey = requireEnv(c, 'MY_API_KEY')

    // getEnv returns undefined if the var is missing
    const appName = getEnv(c, 'APP_NAME') ?? 'World'

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

        <H3>3. Your .env file</H3>
        <CodeBlock
          filename=".env"
          code={`# Server-side only
DATABASE_URL=postgres://...
STRIPE_SECRET_KEY=sk_live_...

# Exposed to the browser
BINI_API_URL=https://api.example.com
VITE_ANALYTICS_ID=UA-XXXX`}
        />

        <H3>4. Dev banner</H3>
        <P>When the dev or preview server starts, it prints the detected .env files:</P>
        <DevBanner />
      </Section>

      <Section id="prefixes" title="Prefixes">
        <P>
          Two prefixes are exposed to the browser: <C>BINI_</C> and <C>VITE_</C>. Everything else
          stays server-side.
        </P>
        <Table
          headers={['Prefix', 'Exposed to browser', 'Use for']}
          rows={[
            ['No prefix', 'Never', 'Secrets - API keys, database URLs, tokens'],
            ['BINI_', 'Yes', 'Public config'],
            ['VITE_', 'Yes', 'Public config (Vite default)'],
          ]}
        />
      </Section>

      <Section id="platform-support" title="Platform Support">
        <P>
          Pass the Hono context <C>c</C> to <C>getEnv</C> and <C>requireEnv</C> and they resolve
          from the correct source on every platform:
        </P>
        <Table
          headers={['Platform', 'Runtime', 'Env source']}
          rows={[
            ['Node.js', 'Node', 'process.env'],
            ['Bun', 'Bun', 'process.env'],
            ['Vercel Edge', 'V8 isolate', 'process.env'],
            ['Netlify Edge', 'Deno', 'Deno.env.get()'],
            ['Cloudflare Workers', 'V8 isolate', 'c.env'],
            ['Deno Deploy', 'Deno', 'Deno.env.get()'],
          ]}
        />
      </Section>

      <Section id="api-reference" title="API Reference">
        <H3>getEnv(source, key)</H3>
        <P>
          Returns <C>string | undefined</C>. Use for optional config. An empty value is returned
          as an empty string, so <C>??</C> does not fall back for it.
        </P>
        <CodeBlock
          filename="src/app/api/config.ts"
          code={`const region = getEnv(c, 'AWS_REGION') ?? 'us-east-1'
const debug  = getEnv(c, 'DEBUG_MODE') === 'true'`}
        />

        <H3>requireEnv(source, key)</H3>
        <P>
          Returns <C>string</C>. Throws if the variable is missing, empty, or not a string. Use
          for required config.
        </P>
        <RequireEnvError />

        <H3>checkEnv(source, keys)</H3>
        <P>
          Checks several variables at once. Returns <C>{'{ ok, missing }'}</C>. Does not throw -
          logs one error listing every missing name.
        </P>
        <CodeBlock
          filename="src/app/api/setup.ts"
          code={`const { ok, missing } = checkEnv(c, ['DATABASE_URL', 'REDIS_URL', 'SESSION_SECRET'])
if (!ok) return c.json({ error: \`Missing: \${missing.join(', ')}\` }, 500)`}
        />

        <H3>requireEnvs(source, keys)</H3>
        <P>
          Requires several variables at once. Returns a record of key to value. Throws one error
          listing every missing name.
        </P>
        <CodeBlock
          filename="src/app/api/setup.ts"
          code={`const { DATABASE_URL, REDIS_URL } = requireEnvs(c, ['DATABASE_URL', 'REDIS_URL'])`}
        />

        <H3>biniLogger</H3>
        <P>
          Terminal logger with Vite-style timestamps, for your own server-side code.
        </P>
        <CodeBlock
          filename="src/server.ts"
          code={`import { biniLogger } from 'bini-env'

biniLogger.info('Server ready')
biniLogger.warn('Missing optional var')
biniLogger.error('Something broke', error)`}
        />

        <H3>loadEnvFiles(root?, mode?)</H3>
        <P>
          Loads .env files into <C>process.env</C> without Vite. Imported from{' '}
          <C>bini-env/node</C>. Priority order:{' '}
          <C>.env.[mode].local</C>, <C>.env.[mode]</C>, <C>.env.local</C>, <C>.env</C>. Existing
          environment values always win.
        </P>
        <CodeBlock
          filename="src/server.ts"
          code={`import { loadEnvFiles } from 'bini-env/node'

const { files, injected } = loadEnvFiles(process.cwd(), 'production')`}
        />

        <H3>Types</H3>
        <Table
          headers={['Type', 'Definition']}
          rows={[
            ['HonoContext', "Hono's Context"],
            ['EnvSource', 'Record<string, unknown>'],
            ['EnvInput', 'HonoContext | EnvSource | undefined | null'],
            ['EnvCheck', '{ ok: boolean; missing: string[] }'],
          ]}
        />
      </Section>
    </PluginPage>
  )
}