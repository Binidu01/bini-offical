// src/app/plugins/bini-server/page.tsx
import {
  C,
  Callout,
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
import { FolderVisual } from '../../components/DocVisuals'
import { PluginPage } from '../../components/PluginPage'
import type { TocItem } from '../../components/TableOfContents'

const TOC_ITEMS: TocItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'requirements', label: 'Requirements' },
  { id: 'install', label: 'Install' },
  { id: 'quick-start', label: 'Quick Start' },
  { id: 'usage', label: 'Usage' },
  { id: 'keyboard-shortcuts', label: 'Keyboard Shortcuts' },
  { id: 'environment-variables', label: 'Environment Variables' },
  { id: 'project-structure', label: 'Project Structure' },
  { id: 'api-routes', label: 'API Routes' },
  { id: 'static-file-serving', label: 'Static File Serving' },
  { id: 'security', label: 'Security' },
  { id: 'api-reference', label: 'API Reference' },
]

const EDIT_URL =
  'https://github.com/Binidu01/bini-official/edit/main/src/app/plugins/bini-server/page.tsx'

/* ---- package-manager tab helpers ---------------------------------- */

const PMS = ['npm', 'pnpm', 'yarn', 'bun'] as const
type Pm = (typeof PMS)[number]

const INSTALL: Record<Pm, string> = {
  npm: 'npm install bini-server',
  pnpm: 'pnpm add bini-server',
  yarn: 'yarn add bini-server',
  bun: 'bun add bini-server',
}

const tabs = (cmd: (pm: Pm) => string): TerminalTab[] =>
  PMS.map((pm) => ({ id: pm, label: pm, command: cmd(pm) }))

const BANNER_TEXT = `  ß Bini.js (production)
  ➜  Environments: .env.local, .env
  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.1.5:3000/
  ➜  press h + enter to show help`

function ServerBanner() {
  // Arrow colors
  const arrow = <span className="text-green-500 dark:text-green-400">➜</span>
  const dimArrow = <span className="text-green-600/70 dark:text-green-400/70">➜</span>

  const label = (s: string) => (
    <strong className="font-bold text-neutral-900 dark:text-white">{s}</strong>
  )
  
  const url = (host: string) => (
    <span className="text-cyan-600 dark:text-cyan-400">http://{host}:3000/</span>
  )

  return (
    <OutputBlock code={BANNER_TEXT}>
      {'  '}
      <span className="font-bold text-cyan-600 dark:text-cyan-400">ß Bini.js</span>{' '}
      <span className="text-neutral-900 dark:text-white">(production)</span>
      {'\n  '}
      {arrow}  <span className="font-bold text-neutral-900 dark:text-white">Environments:</span>{' '}
      <span className="text-neutral-900 dark:text-white">.env.local, .env</span>
      {'\n  '}
      {arrow}  {label('Local:')}   {url('localhost')}
      {'\n  '}
      {arrow}  {label('Network:')} {url('192.168.1.5')}
      {'\n  '}
      {dimArrow}  <span className="text-neutral-500">press</span>{' '}
      <strong className="font-bold text-neutral-900 dark:text-white">h + enter</strong>{' '}
      <span className="text-neutral-500">to show help</span>
    </OutputBlock>
  )
}

export default function BiniServerPage() {
  return (
    <PluginPage
      title="bini-server"
      badge="Official"
      description="Production server for Bini.js apps. Serves the output of your build: pre-rendered pages, static assets, and the compiled API bundle."
      url="https://www.npmjs.com/package/bini-server"
      editUrl={EDIT_URL}
      toc={TOC_ITEMS}
      prev={{ to: '/plugins/bini-native', title: 'bini-native' }}
      next={{ to: '/plugins/bini-overlay', title: 'bini-overlay' }}
    >
      <Section id="overview" title="Overview">
        <P>
          <C>bini-server</C> is the production server for Bini.js apps. It serves the output of{' '}
          <C>vite build</C> - including pre-rendered HTML pages, static assets, and your compiled
          API bundle - using only Node.js built-in modules.
        </P>
        <P>
          It adds everything a basic static host leaves out: ETag caching, API timeouts, graceful
          shutdown, sub-path deployments, and route-aware fallbacks for dynamic pages. It also
          automatically loads <C>.env</C> files at startup.
        </P>
      </Section>

      <Section id="requirements" title="Requirements">
        <UL>
          <li>
            Node.js <C>{'>='} 20.19.0</C>
          </li>
          <li>
            A completed <C>vite build</C> output folder (<C>dist/</C>)
          </li>
          <li>
            <C>dist/api/index.mjs</C> (only if your app uses API routes)
          </li>
        </UL>
      </Section>

      <Section id="install" title="Install">
        <MultiTerminal tabs={tabs((pm) => `$ ${INSTALL[pm]}`)} />
      </Section>

      <Section id="quick-start" title="Quick Start">
        <P>1. Add scripts to your package.json:</P>
        <CodeBlock
          filename="package.json"
          code={`{
  "scripts": {
    "build": "vite build",
    "start": "bini-server"
  }
}`}
        />

        <P>2. Build and start the server:</P>
        <MultiTerminal
          tabs={tabs((pm) => `$ ${pm === 'npm' || pm === 'bun' ? pm + ' run build' : pm + ' build'}\n$ ${pm === 'npm' || pm === 'bun' ? pm + ' run start' : pm + ' start'}`)}
        />

        <P>3. The terminal will output the server banner:</P>
        <ServerBanner />
      </Section>

      <Section id="usage" title="Usage">
        <P>
          You can also start the server programmatically. The <C>start()</C> function reads your
          environment variables, finds a free port, scans the <C>dist/</C> folder, and starts the
          HTTP server.
        </P>
        <CodeBlock
          filename="server.ts"
          code={`import { start } from 'bini-server'

await start()`}
        />
      </Section>

      <Section id="keyboard-shortcuts" title="Keyboard Shortcuts">
        <P>
          While the server is running in an interactive terminal, type a key and press enter:
        </P>
        <Table
          headers={['Key', 'Action']}
          rows={[
            ['h', 'Show available shortcuts'],
            ['o', 'Open the local URL in your default browser'],
            ['q', 'Quit the server gracefully'],
          ]}
        />
        <P>
          Shortcuts are automatically disabled when running in a non-interactive environment (like
          CI/CD or most hosting platforms).
        </P>
      </Section>

      <Section id="environment-variables" title="Environment Variables">
        <H3>.env Loading</H3>
        <P>
          At startup, the server loads these files from your working directory (highest to lowest
          priority). Variables already set in the OS environment are never overridden.
        </P>
        <UL>
          <li>
            <C>.env.[NODE_ENV].local</C>
          </li>
          <li>
            <C>.env.[NODE_ENV]</C>
          </li>
          <li>
            <C>.env.local</C>
          </li>
          <li>
            <C>.env</C>
          </li>
        </UL>
        <P>
          All detected files are listed in the startup banner. These values are available in{' '}
          <C>process.env</C> and are passed directly to your API routes.
        </P>

        <H3>Configuration Variables</H3>
        <P>
          Every setting below can use three naming conventions: <C>BINI_PORT</C> (highest
          priority), <C>VITE_PORT</C> (medium), or <C>PORT</C> (lowest).
        </P>
        <Table
          headers={['Variable', 'Default', 'Description']}
          rows={[
            ['PORT', '3000', 'HTTP port to listen on. Auto-increments if busy.'],
            ['DIST_DIR', 'dist', 'Build output folder.'],
            ['BASE', '(empty)', 'Sub-path the app is served under (e.g. /app).'],
            ['BODY_TIMEOUT_SECS', '30', 'Max seconds to read an API request body.'],
            ['HANDLER_TIMEOUT_SECS', '30', 'Max seconds for an API handler to respond.'],
            ['BODY_SIZE_LIMIT', '10485760', 'Max API request body size (10 MB).'],
          ]}
        />
        <Callout>
          Setting a limit or timeout to <C>0</C> does not disable it. A body limit of <C>0</C>{' '}
          rejects any request body, and a timeout of <C>0</C> expires immediately.
        </Callout>
      </Section>

      <Section id="project-structure" title="Project Structure">
        <FolderVisual
          width={320}
          rows={[
            { n: 'my-app' },
            { n: 'dist', d: 1, dot: true },
            { n: 'index.html', d: 2 },
            { n: 'assets', d: 2 },
            { n: 'api', d: 2 },
            { n: 'index.mjs', d: 3, dot: true },
            { n: 'src', d: 1 },
            { n: 'app', d: 2 },
            { n: 'api', d: 3 },
            { n: 'users.ts', d: 4, fn: true },
            { n: 'layout.tsx', d: 3 },
            { n: '.env', d: 1 },
            { n: 'package.json', d: 1 },
            { n: 'vite.config.ts', d: 1 },
          ]}
        />
        <P>
          The server only needs <C>dist/</C>, your <C>package.json</C>, and your installed
          dependencies. It does not read the <C>src/</C> folder at runtime; API routes are loaded
          entirely from <C>dist/api/index.mjs</C>.
        </P>
      </Section>

      <Section id="api-routes" title="API Routes">
        <P>
          During your build, <C>bini-router</C> compiles your API handlers into a single bundle at{' '}
          <C>dist/api/index.mjs</C>. The server loads this once at startup and passes requests to
          its <C>fetch</C> export.
        </P>
        <P>
          The bundle supports Hono apps, plain functions, and per-method exports:
        </P>
        <CodeBlock
          filename="src/app/api/hello.ts"
          code={`// 1. Hono app
import { Hono } from 'hono'
const app = new Hono()
app.get('/hello', (c) => c.json({ message: 'Hello' }))
export default app

// 2. Plain function
export default (req: Request) => Response.json({ message: 'Hello' })

// 3. Per-method export
export function GET(req: Request) {
  return Response.json({ message: 'Hello' })
}`}
        />
        <Callout>
          <strong>CORS is not handled by bini-server.</strong> It is handled by the compiled API
          bundle. To enable CORS, use the <C>cors</C> option in <C>biniroute()</C> inside your{' '}
          <C>vite.config.ts</C>.
        </Callout>
      </Section>

      <Section id="static-file-serving" title="Static File Serving">
        <H3>Fallback Chain</H3>
        <P>
          For paths without a file extension, the server tries to serve files in this order:
        </P>
        <Table
          headers={['Order', 'Looks for', 'Status']}
          rows={[
            ['1', 'dist/<path>/index.html (pre-rendered page)', '200'],
            ['2', 'A dynamic shell page matching the path', '200'],
            ['3', 'dist/404.html', '404'],
            ['4', 'dist/index.html (SPA fallback)', '200'],
            ['5', 'Nothing found', '404'],
          ]}
        />

        <H3>Shell Pages</H3>
        <P>
          At startup, the server scans <C>dist/</C> for folders wrapped in square brackets (like{' '}
          <C>blog/[slug]</C>). These act as dynamic shells for your client-side router:
        </P>
        <Table
          headers={['Folder', 'Matches']}
          rows={[
            ['blog/[slug]', '/blog/anything (exactly one segment)'],
            ['docs/[...path]', '/docs/a, /docs/a/b (at least one segment)'],
            ['docs/[[...path]]', '/docs, /docs/a, /docs/a/b (zero or more segments)'],
          ]}
        />

        <H3>Caching & ETags</H3>
        <P>
          Files inside an <C>assets/</C> folder are cached for 1 year (
          <C>max-age=31536000, immutable</C>). All other files are served with <C>no-cache</C>.
          ETags are generated automatically, and <C>304 Not Modified</C> responses are supported
          via <C>If-None-Match</C>.
        </P>
        <Callout>
          <C>bini-server</C> does not compress responses. If you need gzip or brotli, place a
          reverse proxy (like Nginx or Cloudflare) in front of it.
        </Callout>
      </Section>

      <Section id="security" title="Security">
        <Table
          headers={['Feature', 'Default', 'Configured With']}
          rows={[
            ['Body size limit (API)', '10 MB', 'BODY_SIZE_LIMIT'],
            ['Body read timeout (API)', '30 s', 'BODY_TIMEOUT_SECS'],
            ['Handler timeout (API)', '30 s', 'HANDLER_TIMEOUT_SECS'],
            [
              'Path traversal',
              'Blocked (refuses .. segments and null bytes)',
              'Not configurable',
            ],
            [
              'Compiled API isolation',
              'dist/api/ is never served as static files',
              'Not configurable',
            ],
            [
              'Error messages',
              'Hidden when NODE_ENV=production',
              'NODE_ENV',
            ],
          ]}
        />
      </Section>

      <Section id="api-reference" title="API Reference">
        <H3>HTTP Status Codes</H3>
        <P>These are produced by bini-server itself:</P>
        <Table
          headers={['Code', 'Description']}
          rows={[
            ['200', 'Success'],
            ['304', 'Not Modified (ETag match)'],
            ['400', 'Bad request URL'],
            ['404', 'Not found (missing file, unknown path, or no compiled API)'],
            ['408', 'API request body not received in time'],
            ['413', 'API request body too large'],
            ['500', 'Internal server error (including API handler timeout)'],
          ]}
        />

        <H3>Supported Methods</H3>
        <P>
          All methods are passed to the API bundle, which decides which it accepts. Static
          responses do not check the method. <C>HEAD</C> requests receive headers only.
        </P>
      </Section>
    </PluginPage>
  )
}