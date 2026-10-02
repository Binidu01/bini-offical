// src/app/docs/production-server.tsx
import { siNodedotjs } from 'simple-icons'

import {
  BrandIcon,
  C,
  Callout,
  CodeBlock,
  DocPage,
  H3,
  MultiTerminal,
  OutputBlock,
  P,
  Section,
  Table,
  UL,
  useDocLang,
} from '../../components/DocBlocks'
import {
  Arrow,
  CARD,
  FeatureCard,
  FolderVisual,
  GridBg,
  RouteVisual,
} from '../../components/DocVisuals'
import type { TocItem } from '../../components/TableOfContents'

const TOC_ITEMS: TocItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'features', label: 'Features' },
  { id: 'installation', label: 'Installation' },
  { id: 'usage', label: 'Usage' },
  { id: 'keyboard-shortcuts', label: 'Keyboard Shortcuts' },
  { id: 'environment-variables', label: 'Environment Variables' },
  { id: 'project-structure', label: 'Project Structure' },
  { id: 'api-routes', label: 'API Routes' },
  { id: 'cors', label: 'CORS' },
  { id: 'static-file-serving', label: 'Static File Serving' },
  { id: 'vs-vite-preview', label: 'vs vite preview' },
  { id: 'security', label: 'Security' },
  { id: 'deployment', label: 'Deployment' },
  { id: 'api-reference', label: 'API Reference' },
]

const STRONG = 'font-medium text-neutral-900 dark:text-neutral-100'
const OL =
  'mb-6 list-decimal space-y-1 pl-5 text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400'

const Yes = () => <span className="text-emerald-600 dark:text-emerald-400">Yes</span>
const No = () => <span className="text-neutral-500">No</span>

/* ---------- visuals ---------- */

const BOX = `${CARD} flex items-center px-3 text-[12px] text-neutral-800 dark:text-neutral-200`

/** How a request is routed. */
function RequestFlowVisual() {
  return (
    <GridBg>
      <div className="flex items-center gap-3">
        <span className={`${BOX} h-10 w-24 shrink-0 justify-center`}>Request</span>
        <Arrow />
        <span className={`${BOX} h-10 w-32 shrink-0 justify-center font-semibold`}>
          bini-server
        </span>
        <Arrow />
        <div className="flex flex-col gap-2">
          <span className={`${BOX} h-10 w-64 shrink-0`}>
            <span className="mr-2 text-neutral-500">dist/</span>
            static files + SPA fallback
          </span>
          <span className={`${BOX} h-10 w-64 shrink-0`}>
            <span className="mr-2 text-neutral-500">src/app/api/</span>
            /api/* routes
          </span>
        </div>
      </div>
    </GridBg>
  )
}

const BANNER_TEXT = `  ß Bini.js (production)
  ->  Environments: .env, .env.local
  ->  Local:   http://localhost:3000/
  ->  Network: http://192.168.1.5:3000/
  press h + enter to show help`

/** Colored startup banner, matching the real terminal output. */
function ServerBanner() {
  const arrow = <span className="text-green-600 dark:text-green-400">➜</span>
  const label = (s: string) => (
    <strong className="font-bold text-neutral-900 dark:text-white">{s}</strong>
  )
  const url = (host: string) => (
    <span className="text-cyan-700 dark:text-cyan-400">
      http://{host}:<strong className="font-bold">3000</strong>/
    </span>
  )
  return (
    <OutputBlock code={BANNER_TEXT}>
      {'  '}
      <span className="font-bold text-cyan-700 dark:text-cyan-400">ß Bini.js</span>{' '}
      <span className="text-neutral-500">(production)</span>
      {'\n  '}
      {arrow}
      {'  '}
      {label('Environments:')}{' '}
      <span className="text-neutral-600 dark:text-neutral-400">.env, .env.local</span>
      {'\n  '}
      {arrow}
      {'  '}
      {label('Local:')}
      {'   '}
      {url('localhost')}
      {'\n  '}
      {arrow}
      {'  '}
      {label('Network:')} {url('192.168.1.5')}
      {'\n  '}
      <span className="text-neutral-500">
        ➜ press <strong className="font-bold text-neutral-700 dark:text-neutral-300">h + enter</strong>{' '}
        to show help
      </span>
    </OutputBlock>
  )
}

/* ---------- content (reads the TS/JS choice from DocPage) ---------- */

function Content() {
  const lang = useDocLang()
  const t = lang === 'js' ? 'js' : 'ts' // plain .ts / .js files
  const e = lang === 'js' ? 'jsx' : 'tsx' // React files

  return (
    <>
      <Section id="overview" title="Overview">
        <P className="mb-4">
          <C>bini-server</C> is the default production server for the Node.js hosting target. It
          streams your built <C>dist/</C> folder, serves <C>/api/*</C> routes directly from{' '}
          <C>src/app/api/</C>, and adds everything <C>vite preview</C> intentionally leaves out -
          ETag caching, timeouts, graceful shutdown, and configurable body limits.
        </P>
        <RequestFlowVisual />
        <P className="mb-6">
          It has <strong className={STRONG}>zero runtime dependencies</strong> - only Node.js
          built-in modules - and works identically on Windows, macOS, and Linux.
        </P>
        <Callout>
          <strong>Requirements:</strong> Node.js <C>≥ 20.19.0</C>, a built <C>dist/</C> folder, and
          API handlers under <C>src/app/api/</C> (if your app uses any).
        </Callout>
      </Section>

      <Section id="features" title="Features">
        <H3 className="mb-3 mt-2">Core</H3>
        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          <FeatureCard
            title="Static file serving"
            text="Streams dist/ with correct MIME types, ETag, and cache headers."
          />
          <FeatureCard
            title="API routes"
            text="Serves /api/* from src/app/api/ - Hono apps and plain functions both work."
          />
          <FeatureCard
            title="SPA fallback"
            text="Unknown routes automatically serve dist/index.html."
          />
          <FeatureCard title="ETag support" text="304 Not Modified responses for unchanged static files." />
          <FeatureCard
            title="Lazy route loading"
            text="API routes are scanned on first request for fast cold starts."
          />
        </div>
        <H3 className="mb-3 mt-2">Security & Performance</H3>
        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          <FeatureCard
            title="CORS"
            text="Enabled by default, configurable via CORS_ENABLED (BINI_*, VITE_*, or no prefix)."
          />
          <FeatureCard
            title="Body limits"
            text="Configurable request body size limit, defaults to 10MB."
          />
          <FeatureCard
            title="Timeouts"
            text="Configurable body-read and handler timeouts, default 30s each."
          />
          <FeatureCard
            title="Path traversal protection"
            text="Guards against .. and // in request URLs."
          />
          <FeatureCard
            title="Module cache"
            text="Caches imported handlers with mtime invalidation."
          />
          <FeatureCard
            title="Port auto-increment"
            text="Starts at 3000, auto-increments if the port is busy."
          />
        </div>
        <H3 className="mb-3 mt-2">Developer Experience</H3>
        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          <FeatureCard
            title="Auto env loading"
            text=".env files are detected and listed in the startup banner."
          />
          <FeatureCard
            title="Interactive shortcuts"
            text="Press h for help, o to open the browser, q to quit."
          />
          <FeatureCard
            title="Cross-platform"
            text="Works identically on Windows, macOS, and Linux."
          />
          <FeatureCard
            title="Graceful shutdown"
            text="Handles SIGTERM + SIGINT with a timeout fallback."
          />
          <FeatureCard
            title="Zero dependencies"
            text="Only Node.js built-in modules - nothing to audit or update."
          />
          <FeatureCard
            title="Flexible config"
            text="Every setting supports BINI_*, VITE_*, or no-prefix env vars."
          />
        </div>
      </Section>

      <Section id="installation" title="Installation">
        <P className="mb-4">
          Every Bini.js web scaffold already includes <C>bini-server</C>. To add it to an existing
          project:
        </P>
        <MultiTerminal
          tabs={[
            { id: 'npm', label: 'npm', command: `$ npm install bini-server` },
            { id: 'pnpm', label: 'pnpm', command: `$ pnpm add bini-server` },
            { id: 'yarn', label: 'yarn', command: `$ yarn add bini-server` },
            { id: 'bun', label: 'bun', command: `$ bun add bini-server` },
          ]}
        />
      </Section>

      <Section id="usage" title="Usage">
        <H3 className="mb-3 mt-2">1. Add scripts to package.json</H3>
        <CodeBlock
          filename="package.json"
          lang="json"
          code={`{
  "scripts": {
    "build": "vite build",
    "start": "bini-server"
  }
}`}
        />
        <H3 className="mt-6 mb-3">2. Build and start</H3>
        <MultiTerminal
          tabs={[
            {
              id: 'npm',
              label: 'npm',
              command: `$ npm run build
$ npm start`,
            },
            {
              id: 'pnpm',
              label: 'pnpm',
              command: `$ pnpm build
$ pnpm start`,
            },
            {
              id: 'yarn',
              label: 'yarn',
              command: `$ yarn build
$ yarn start`,
            },
            {
              id: 'bun',
              label: 'bun',
              command: `$ bun run build
$ bun run start`,
            },
          ]}
        />
        <H3 className="mt-6 mb-3">3. Terminal output</H3>
        <ServerBanner />
      </Section>

      <Section id="keyboard-shortcuts" title="Keyboard Shortcuts">
        <P className="mb-4">While the server is running, type a key and press enter:</P>
        <Table
          headers={['Key', 'Action']}
          rows={[
            ['h', 'Show available shortcuts'],
            ['o', 'Open your app in the default browser'],
            ['q', 'Quit the server'],
          ]}
        />
        <Callout>
          Keyboard shortcuts are automatically disabled in non-interactive environments, like
          Render or CI/CD.
        </Callout>
      </Section>

      <Section id="environment-variables" title="Environment Variables">
        <H3 className="mb-3 mt-2">Auto-detected .env files</H3>
        <P className="mb-4">
          At startup, bini-server automatically detects and loads, in priority order:
        </P>
        <FolderVisual
          width={300}
          rows={[
            { n: '.env.local', dot: true },
            { n: '.env.production.local' },
            { n: '.env.production' },
            { n: '.env' },
          ]}
        />
        <UL className="mb-4 space-y-2">
          <li>
            <C>.env.local</C>
          </li>
          <li>
            <C>.env.[NODE_ENV].local</C> (e.g. <C>.env.production.local</C>)
          </li>
          <li>
            <C>.env.[NODE_ENV]</C> (e.g. <C>.env.production</C>)
          </li>
          <li>
            <C>.env</C>
          </li>
        </UL>
        <P className="mb-6">All detected files are listed in the startup banner.</P>

        <H3 className="mb-3 mt-2">Naming conventions</H3>
        <P className="mb-4">Every setting supports three naming conventions, in priority order:</P>
        <Table
          headers={['Convention', 'Example', 'Priority']}
          rows={[
            ['BINI_*', 'BINI_PORT=3000', 'Highest'],
            ['VITE_*', 'VITE_PORT=3000', 'Medium'],
            ['No prefix', 'PORT=3000', 'Lowest'],
          ]}
        />

        <H3 className="mt-6 mb-3">Server configuration</H3>
        <Table
          headers={['Variable', 'Default', 'Description']}
          rows={[
            ['PORT', '3000', 'HTTP port to listen on'],
            ['CORS_ENABLED', 'true', 'Enable/disable CORS on API routes'],
            ['API_DIR', 'src/app/api', 'Path to API handlers directory'],
            ['DIST_DIR', 'dist', 'Path to static files directory'],
            ['BODY_TIMEOUT_SECS', '30', 'Max seconds to read the request body'],
            ['HANDLER_TIMEOUT_SECS', '30', 'Max seconds for a handler to respond'],
            ['BODY_SIZE_LIMIT', '10485760', 'Max request body size in bytes (10MB)'],
          ]}
        />

        <H3 className="mt-6 mb-3">Examples</H3>
        <CodeBlock
          filename=".env"
          lang="text"
          code={`# .env
PORT=8080
CORS_ENABLED=false
API_DIR=src/api
BODY_SIZE_LIMIT=5242880  # 5MB`}
        />
        <CodeBlock
          filename="Terminal"
          lang="shell"
          code={`$ PORT=3001 BINI_CORS_ENABLED=false bini-server

# Or with the VITE prefix
$ VITE_PORT=3000 VITE_CORS_ENABLED=false bini-server`}
        />
      </Section>

      <Section id="project-structure" title="Project Structure">
        <FolderVisual
          width={300}
          rows={[
            { n: 'my-app' },
            { n: 'dist', d: 1, dot: true },
            { n: 'index.html', d: 2 },
            { n: 'assets', d: 2 },
            { n: 'src', d: 1 },
            { n: 'app', d: 2 },
            { n: 'api', d: 3, dot: true },
            { n: `users.${t}`, d: 4, fn: true },
            { n: 'posts', d: 4 },
            { n: `index.${t}`, d: 5, fn: true },
            { n: `[id].${t}`, d: 5, fn: true },
            { n: `layout.${e}`, d: 3 },
            { n: `main.${e}`, d: 2 },
            { n: '.env', d: 1 },
            { n: 'package.json', d: 1 },
            { n: `vite.config.${t}`, d: 1 },
          ]}
        />
        <UL>
          <li>
            <C>dist/</C> - built static files (required)
          </li>
          <li>
            <C>src/app/api/</C> - API handlers (optional)
          </li>
          <li>
            <C>.env</C> - environment variables
          </li>
        </UL>
      </Section>

      <Section id="api-routes" title="API Routes">
        <H3 className="mb-3 mt-2">Supported formats</H3>
        <P className="mb-4">A Hono app (recommended):</P>
        <CodeBlock
          filename={`src/app/api/users.${t}`}
          code={`import { Hono } from 'hono'

const app = new Hono()

app.get('/users', (c) => c.json({ users: [] }))

export default app`}
        />
        <P className="mb-4">Or a plain function:</P>
        <CodeBlock
          filename={`src/app/api/hello.${t}`}
          tsCode={`// src/app/api/hello.ts
export default (req: Request) => {
  return Response.json({ message: 'Hello' })
}`}
          jsCode={`// src/app/api/hello.js
export default (req) => {
  return Response.json({ message: 'Hello' })
}`}
        />
        <Callout>
          Only <C>.ts</C> and <C>.js</C> files are supported for API routes - the same convention
          used by <C>bini-router</C>.
        </Callout>

        <H3 className="mt-6 mb-3">Dynamic routes</H3>
        <RouteVisual
          fileWidth={280}
          rows={[
            { n: 'src' },
            { n: 'app', d: 1 },
            { n: 'api', d: 2 },
            { n: 'users', d: 3 },
            { n: `[id].${t}`, d: 4, fn: true, dot: true, url: '/api/users/:id' },
            { n: 'posts', d: 3 },
            { n: `[...slug].${t}`, d: 4, fn: true, dot: true, url: '/api/posts/*' },
          ]}
        />

        <H3 className="mt-6 mb-3">Route parameters</H3>
        <P className="mb-4">
          For plain function handlers, route params are passed as JSON via the{' '}
          <C>x-bini-params</C> request header:
        </P>
        <CodeBlock
          filename={`src/app/api/users/[id].${t}`}
          tsCode={`// src/app/api/users/[id].ts
export default (req: Request) => {
  const params = JSON.parse(req.headers.get('x-bini-params') || '{}')
  // params.id -> '123'
  return Response.json({ id: params.id })
}`}
          jsCode={`// src/app/api/users/[id].js
export default (req) => {
  const params = JSON.parse(req.headers.get('x-bini-params') || '{}')
  // params.id -> '123'
  return Response.json({ id: params.id })
}`}
        />
      </Section>

      <Section id="cors" title="CORS">
        <P className="mb-4">CORS is enabled by default with these headers:</P>
        <CodeBlock
          filename="Response headers"
          lang="text"
          code={`Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET,POST,PUT,PATCH,DELETE,OPTIONS,HEAD
Access-Control-Allow-Headers: Content-Type,Authorization,X-Request-ID`}
        />
        <P className="mb-2">
          Disable it with <C>CORS_ENABLED=false</C>, <C>BINI_CORS_ENABLED=false</C>, or{' '}
          <C>VITE_CORS_ENABLED=false</C>:
        </P>
        <CodeBlock
          filename=".env"
          lang="text"
          code={`# .env
CORS_ENABLED=false`}
        />
      </Section>

      <Section id="static-file-serving" title="Static File Serving">
        <H3 className="mb-3 mt-2">Supported MIME types</H3>
        <UL>
          <li>HTML, CSS, JavaScript, JSON</li>
          <li>Images - PNG, JPEG, GIF, SVG, WebP, AVIF, ICO</li>
          <li>Fonts - WOFF, WOFF2, TTF, EOT</li>
          <li>Documents - TXT, XML</li>
          <li>Web manifests</li>
        </UL>
        <H3 className="mt-6 mb-3">Cache headers</H3>
        <Table
          headers={['File Type', 'Cache Policy']}
          rows={[
            ['/assets/*', 'public, max-age=31536000, immutable'],
            ['All other files', 'no-cache'],
          ]}
        />
        <H3 className="mt-6 mb-3">ETag support</H3>
        <P className="mb-2">ETags are generated automatically from file size + mtimeMs:</P>
        <UL>
          <li>
            Sends an <C>ETag</C> header on the first request
          </li>
          <li>
            Handles <C>If-None-Match</C> for 304 Not Modified responses
          </li>
          <li>Uses an MD5 hash (16 chars) for efficient caching</li>
        </UL>
      </Section>

      <Section id="vs-vite-preview" title="vs vite preview">
        <Table
          headers={['Feature', 'vite preview', 'bini-server']}
          rows={[
            ['Serves dist/', <Yes key="a" />, <Yes key="b" />],
            ['API routes', <Yes key="a" />, <Yes key="b" />],
            ['SPA fallback', <Yes key="a" />, <Yes key="b" />],
            ['Auto env loading', <Yes key="a" />, <Yes key="b" />],
            ['ETag / 304 support', <No key="a" />, <Yes key="b" />],
            ['Body timeout', <No key="a" />, '30s'],
            ['Body size limit', <No key="a" />, '10MB'],
            ['Handler timeout', <No key="a" />, '30s'],
            ['Graceful shutdown', <No key="a" />, <Yes key="b" />],
            ['Module cache', <No key="a" />, <Yes key="b" />],
            ['Configurable dirs', <No key="a" />, <Yes key="b" />],
            ['CORS control', <No key="a" />, <Yes key="b" />],
            ['Zero dependencies', <No key="a" />, <Yes key="b" />],
            [
              'Production use',
              <span key="a" className="text-amber-600 dark:text-amber-400">
                Not recommended
              </span>,
              <span key="b" className="text-emerald-600 dark:text-emerald-400">
                Production-ready
              </span>,
            ],
          ]}
        />
      </Section>

      <Section id="security" title="Security">
        <Table
          headers={['Feature', 'Default', 'Configurable']}
          rows={[
            ['CORS', 'Enabled', <>via <C>CORS_ENABLED</C></>],
            ['Body size limit', '10MB', <>via <C>BODY_SIZE_LIMIT</C></>],
            ['Request timeout', '30s', <>via <C>BODY_TIMEOUT_SECS</C></>],
            ['Handler timeout', '30s', <>via <C>HANDLER_TIMEOUT_SECS</C></>],
            ['Path traversal', 'Blocked', 'guard in place'],
          ]}
        />

        <H3 className="mt-6 mb-3">Testing your server</H3>
        <CodeBlock
          filename="Terminal"
          lang="shell"
          code={`# Check static files
$ curl http://localhost:3000/

# Check API routes
$ curl http://localhost:3000/api/hello

# Check ETag
$ curl -I http://localhost:3000/styles.css

# Test 304 Not Modified
$ curl -I http://localhost:3000/styles.css \\
  -H "If-None-Match: [etag_from_previous_request]"

# Test CORS
$ curl -X OPTIONS http://localhost:3000/api/hello \\
  -H "Origin: http://example.com"`}
        />

        <H3 className="mt-6 mb-3">Configuration examples</H3>
        <P className="mb-2">
          <strong className={STRONG}>Development</strong> (all security disabled)
        </P>
        <CodeBlock
          filename=".env"
          lang="text"
          code={`# .env
CORS_ENABLED=true
BODY_TIMEOUT_SECS=0
HANDLER_TIMEOUT_SECS=0
BODY_SIZE_LIMIT=0
NODE_ENV=development`}
        />
        <P className="mb-2">
          <strong className={STRONG}>Production</strong> (secure defaults)
        </P>
        <CodeBlock
          filename=".env"
          lang="text"
          code={`# .env
CORS_ENABLED=true
BODY_TIMEOUT_SECS=30
HANDLER_TIMEOUT_SECS=30
BODY_SIZE_LIMIT=10485760
NODE_ENV=production`}
        />
        <P className="mb-2">
          <strong className={STRONG}>Internal API</strong> (no CORS)
        </P>
        <CodeBlock
          filename=".env"
          lang="text"
          code={`# .env
CORS_ENABLED=false
BODY_SIZE_LIMIT=5242880  # 5MB`}
        />
        <P className="mb-2">
          <strong className={STRONG}>File upload service</strong>
        </P>
        <CodeBlock
          filename=".env"
          lang="text"
          code={`# .env
CORS_ENABLED=true
BODY_SIZE_LIMIT=1073741824  # 1GB
BODY_TIMEOUT_SECS=300  # 5 minutes`}
        />
      </Section>

      <Section
        id="deployment"
        title="Deployment"
        icon={
          <BrandIcon
            icon={siNodedotjs}
            size={20}
            className="shrink-0 text-black dark:text-white"
          />
        }
      >
        <Callout>
          <strong>Ship your src/ folder.</strong> bini-server runs API handlers directly from{' '}
          <C>src/app/api/</C> - they are not compiled into <C>dist/</C>. Make sure your host has
          access to both <C>dist/</C> and <C>src/app/api/</C>.
        </Callout>
        <H3 className="mb-3 mt-4">Where it works</H3>
        <UL>
          <li>
            <strong className={STRONG}>VPS / pm2</strong> - deploy the full project directory
          </li>
          <li>
            <strong className={STRONG}>Railway / Render / Fly.io</strong> - automatic, since these
            clone your repository
          </li>
          <li>
            <strong className={STRONG}>Docker</strong> - copy both <C>dist/</C> and <C>src/</C>{' '}
            into the image
          </li>
        </UL>

        <H3 className="mb-3 mt-2">VPS / dedicated server</H3>
        <MultiTerminal
          tabs={[
            {
              id: 'npm',
              label: 'npm',
              command: `$ npm run build
$ npm start
$ npm install -g pm2
$ pm2 start "npm start" --name my-app
$ pm2 save
$ pm2 startup`,
            },
            {
              id: 'pnpm',
              label: 'pnpm',
              command: `$ pnpm build
$ pnpm start
$ pnpm add -g pm2
$ pm2 start "pnpm start" --name my-app
$ pm2 save
$ pm2 startup`,
            },
            {
              id: 'yarn',
              label: 'yarn',
              command: `$ yarn build
$ yarn start
$ yarn global add pm2
$ pm2 start "yarn start" --name my-app
$ pm2 save
$ pm2 startup`,
            },
            {
              id: 'bun',
              label: 'bun',
              command: `$ bun run build
$ bun run start
$ bun add -g pm2
$ pm2 start "bun run start" --name my-app
$ pm2 save
$ pm2 startup`,
            },
          ]}
        />

        <H3 className="mt-6 mb-3">Platform as a Service</H3>
        <Table
          headers={['Platform', 'Start Command', 'Notes']}
          rows={[
            ['Railway', 'npm start', 'PORT injected automatically'],
            ['Render', 'npm start', 'PORT injected automatically'],
            ['Fly.io', 'npm start', 'See fly.toml example below'],
            ['Heroku', 'npm start', 'PORT injected automatically'],
          ]}
        />

        <H3 className="mt-6 mb-3">Docker</H3>
        <CodeBlock
          filename="Dockerfile"
          lang="text"
          code={`FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]`}
        />

        <H3 className="mt-6 mb-3">Fly.io</H3>
        <CodeBlock
          filename="fly.toml"
          lang="text"
          code={`[processes]
  app = "npm start"`}
        />
      </Section>

      <Section id="api-reference" title="API Reference">
        <H3 className="mb-3 mt-2">Environment variable priority</H3>
        <ol className={OL}>
          <li>
            <C>BINI_*</C> (highest)
          </li>
          <li>
            <C>VITE_*</C> (medium)
          </li>
          <li>No prefix (lowest)</li>
        </ol>

        <H3 className="mt-6 mb-3">HTTP status codes</H3>
        <Table
          headers={['Code', 'Description']}
          rows={[
            ['200', 'Success'],
            ['204', 'OPTIONS preflight success'],
            ['304', 'Not Modified (ETag match)'],
            ['400', 'Bad request URL'],
            ['404', 'Route not found'],
            ['408', 'Request timeout'],
            ['413', 'Payload too large'],
            ['500', 'Internal server error'],
          ]}
        />

        <H3 className="mt-6 mb-3">Supported HTTP methods</H3>
        <P className="mb-0">
          <C>GET</C>, <C>POST</C>, <C>PUT</C>, <C>PATCH</C>, <C>DELETE</C>, <C>OPTIONS</C> (CORS
          preflight), and <C>HEAD</C> (with ETag support).
        </P>
      </Section>
    </>
  )
}

/* ---------- page ---------- */

export default function ProductionServerPage() {
  return (
    <DocPage
      title="Production Server"
      description="A zero-dependency, secure-by-default production server for your Bini.js app, powered by bini-server."
      url="https://bini.js.org/docs/production-server"
      editUrl="https://github.com/Binidu01/bini-official/edit/main/src/app/docs/production-server.tsx"
      toc={TOC_ITEMS}
      prev={{ to: '/docs/deploying', title: 'Deploying' }}
      next={{ to: '/docs/static-export', title: 'Static Export' }}
    >
      <Content />
    </DocPage>
  )
}