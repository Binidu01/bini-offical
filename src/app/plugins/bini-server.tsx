// src/app/plugins/bini-server/page.tsx
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
import { FolderVisual } from '../../components/DocVisuals'
import { PluginPage } from '../../components/PluginPage'
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
  { id: 'requirements', label: 'Requirements' },
]

const EDIT_URL =
  'https://github.com/Binidu01/bini-official/edit/main/src/app/plugins/bini-server/page.tsx'

const H3_CLS = 'mb-3 mt-8 text-base font-semibold text-neutral-900 dark:text-neutral-200'
const STRONG = 'font-medium text-neutral-900 dark:text-neutral-100'

const BANNER_TEXT = `  Bini.js (production)
  Environments: .env, .env.local
  Local:   http://localhost:3000/
  Network: http://192.168.1.5:3000/
  press h + enter to show help`

const Yes = () => <span className="text-emerald-600 dark:text-emerald-400">Yes</span>
const No = () => <span className="text-neutral-500">No</span>

/** Colored production server banner. */
function ServerBanner() {
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
      <span className="font-bold text-cyan-700 dark:text-cyan-400">Bini.js</span>{' '}
      <span className="text-neutral-500">(production)</span>
      {'\n  '}
      <span className="text-neutral-500">Environments:</span>{' '}
      <span className="text-neutral-600 dark:text-neutral-400">.env, .env.local</span>
      {'\n  '}
      {label('Local:')}
      {'   '}
      {url('localhost')}
      {'\n  '}
      {label('Network:')} {url('192.168.1.5')}
      {'\n  '}
      <span className="text-neutral-500">
        press <strong className="font-bold text-neutral-700 dark:text-neutral-300">h + enter</strong>{' '}
        to show help
      </span>
    </OutputBlock>
  )
}

function FeatureBlurb({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-neutral-950">
      <h3 className="mb-2 text-sm font-semibold text-black dark:text-white">{title}</h3>
      <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{children}</p>
    </div>
  )
}

export default function BiniServerPage() {
  return (
    <PluginPage
      title="bini-server"
      badge="Official"
      description="Zero-dependency, secure-by-default, production-grade server for your static sites and API routes."
      url="https://bini.dev/plugins/bini-server"
      editUrl={EDIT_URL}
      toc={TOC_ITEMS}
      prev={{ to: '/plugins/bini-native', title: 'bini-native' }}
      next={{ to: '/plugins/bini-overlay', title: 'bini-overlay' }}
    >
      <Section id="overview" title="Overview">
        <P>
          <C>bini-server</C> is the production server for bini-router apps. It streams your built{' '}
          <C>dist/</C> folder, serves <C>/api/*</C> routes directly from <C>src/app/api/</C>, and
          adds everything <C>vite preview</C> intentionally leaves out - ETag caching, timeouts,
          graceful shutdown, and configurable body limits.
        </P>
        <P>
          It has <strong className={STRONG}>zero runtime dependencies</strong> - only Node.js
          built-in modules - and works identically on Windows, macOS, and Linux.
        </P>
      </Section>

      <Section id="features" title="Features">
        <h3 className="mb-3 text-base font-semibold text-neutral-900 dark:text-neutral-200">
          Core
        </h3>
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <FeatureBlurb title="Static file serving">
            Streams <C>dist/</C> with correct MIME types, ETag, and cache headers.
          </FeatureBlurb>
          <FeatureBlurb title="API routes">
            Serves <C>/api/*</C> from <C>src/app/api/</C> - Hono apps and plain functions both
            work.
          </FeatureBlurb>
          <FeatureBlurb title="SPA fallback">
            Unknown routes automatically serve <C>dist/index.html</C>.
          </FeatureBlurb>
          <FeatureBlurb title="ETag support">
            304 Not Modified responses for unchanged static files.
          </FeatureBlurb>
          <FeatureBlurb title="Lazy route loading">
            API routes are scanned on first request for fast cold starts.
          </FeatureBlurb>
        </div>

        <h3 className={H3_CLS}>Security &amp; Performance</h3>
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <FeatureBlurb title="CORS">
            Enabled by default, configurable via <C>CORS_ENABLED</C> (<C>BINI_*</C>, <C>VITE_*</C>,
            or no prefix).
          </FeatureBlurb>
          <FeatureBlurb title="Body limits">
            Configurable request body size limit, defaults to 10MB.
          </FeatureBlurb>
          <FeatureBlurb title="Timeouts">
            Configurable body-read and handler timeouts, default 30s each.
          </FeatureBlurb>
          <FeatureBlurb title="Path traversal protection">
            Guards against <C>..</C> and <C>//</C> in request URLs.
          </FeatureBlurb>
          <FeatureBlurb title="Module cache">
            Caches imported handlers with mtime invalidation.
          </FeatureBlurb>
          <FeatureBlurb title="Port auto-increment">
            Starts at 3000, auto-increments if the port is busy.
          </FeatureBlurb>
        </div>

        <h3 className={H3_CLS}>Developer Experience</h3>
        <div className="mb-4 grid gap-4 sm:grid-cols-2">
          <FeatureBlurb title="Auto env loading">
            <C>.env</C> files are detected and listed in the startup banner.
          </FeatureBlurb>
          <FeatureBlurb title="Interactive shortcuts">
            Press <C>h</C> for help, <C>o</C> to open the browser, <C>q</C> to quit.
          </FeatureBlurb>
          <FeatureBlurb title="Cross-platform">
            Works identically on Windows, macOS, and Linux.
          </FeatureBlurb>
          <FeatureBlurb title="Graceful shutdown">
            Handles <C>SIGTERM</C> + <C>SIGINT</C> with a timeout fallback.
          </FeatureBlurb>
          <FeatureBlurb title="Zero dependencies">
            Only Node.js built-in modules - nothing to audit or update.
          </FeatureBlurb>
          <FeatureBlurb title="Flexible config">
            Every setting supports <C>BINI_*</C>, <C>VITE_*</C>, or no-prefix env vars.
          </FeatureBlurb>
        </div>
      </Section>

      <Section id="installation" title="Installation">
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
        <h3 className={H3_CLS}>1. Add scripts to package.json</h3>
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

        <h3 className={H3_CLS}>2. Build and start</h3>
        <MultiTerminal
          tabs={[
            {
              id: 'npm',
              label: 'npm',
              command: `$ npm run build\n$ npm start`,
            },
            {
              id: 'pnpm',
              label: 'pnpm',
              command: `$ pnpm build\n$ pnpm start`,
            },
            {
              id: 'yarn',
              label: 'yarn',
              command: `$ yarn build\n$ yarn start`,
            },
            {
              id: 'bun',
              label: 'bun',
              command: `$ bun run build\n$ bun run start`,
            },
          ]}
        />

        <h3 className={H3_CLS}>3. Terminal output</h3>
        <ServerBanner />
      </Section>

      <Section id="keyboard-shortcuts" title="Keyboard Shortcuts">
        <P>While the server is running, type a key and press enter:</P>
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
        <h3 className="mb-3 text-base font-semibold text-neutral-900 dark:text-neutral-200">
          Auto-detected .env files
        </h3>
        <P>At startup, bini-server detects and loads, in priority order:</P>
        <UL>
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
        <P>All detected files are listed in the startup banner.</P>

        <h3 className={H3_CLS}>Naming conventions</h3>
        <P>Every setting supports three naming conventions, in priority order:</P>
        <Table
          headers={['Convention', 'Example', 'Priority']}
          rows={[
            ['BINI_*', 'BINI_PORT=3000', 'Highest'],
            ['VITE_*', 'VITE_PORT=3000', 'Medium'],
            ['No prefix', 'PORT=3000', 'Lowest'],
          ]}
        />

        <h3 className={H3_CLS}>Server configuration</h3>
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

        <h3 className={H3_CLS}>Examples</h3>
        <CodeBlock
          filename=".env"
          lang="env"
          code={`PORT=8080
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
          width={320}
          rows={[
            { n: 'my-app' },
            { n: 'dist', d: 1, dot: true },
            { n: 'index.html', d: 2 },
            { n: 'assets', d: 2 },
            { n: 'src', d: 1 },
            { n: 'app', d: 2 },
            { n: 'api', d: 3, dot: true },
            { n: 'users.ts', d: 4, fn: true },
            { n: 'posts', d: 4 },
            { n: 'index.ts', d: 5, fn: true },
            { n: '[id].ts', d: 5, fn: true },
            { n: 'layout.tsx', d: 3 },
            { n: 'main.tsx', d: 2 },
            { n: '.env', d: 1 },
            { n: 'package.json', d: 1 },
            { n: 'vite.config.ts', d: 1 },
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
        <h3 className="mb-3 text-base font-semibold text-neutral-900 dark:text-neutral-200">
          Supported formats
        </h3>
        <P>A Hono app (recommended):</P>
        <CodeBlock
          filename="src/app/api/users.ts"
          lang="js"
          code={`import { Hono } from 'hono'

const app = new Hono()

app.get('/users', (c) => c.json({ users: [] }))

export default app`}
        />
        <P>Or a plain function:</P>
        <CodeBlock
          filename="src/app/api/hello.ts"
          lang="js"
          code={`export default (req: Request) => {
  return Response.json({ message: 'Hello' })
}`}
        />
        <Callout>
          Only <C>.ts</C> and <C>.js</C> files are supported for API routes - the same convention
          used by <C>bini-router</C>.
        </Callout>

        <h3 className={H3_CLS}>Dynamic routes</h3>
        <FolderVisual
          width={280}
          rows={[
            { n: 'api', d: 0 },
            { n: 'users', d: 1 },
            { n: '[id].ts', d: 2, fn: true },
            { n: 'posts', d: 1 },
            { n: '[...slug].ts', d: 2, fn: true },
          ]}
        />

        <h3 className={H3_CLS}>Route parameters</h3>
        <P>
          For plain function handlers, route params are passed as JSON via the{' '}
          <C>x-bini-params</C> request header:
        </P>
        <CodeBlock
          filename="src/app/api/users/[id].ts"
          lang="js"
          code={`export default (req: Request) => {
  const params = JSON.parse(req.headers.get('x-bini-params') || '{}')
  // params.id -> '123'
  return Response.json({ id: params.id })
}`}
        />
      </Section>

      <Section id="cors" title="CORS">
        <P>CORS is enabled by default with these headers:</P>
        <CodeBlock
          filename="Response headers"
          lang="text"
          code={`Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET,POST,PUT,PATCH,DELETE,OPTIONS,HEAD
Access-Control-Allow-Headers: Content-Type,Authorization,X-Request-ID`}
        />
        <P>
          Disable with <C>CORS_ENABLED=false</C>, <C>BINI_CORS_ENABLED=false</C>, or{' '}
          <C>VITE_CORS_ENABLED=false</C>:
        </P>
        <CodeBlock
          filename=".env"
          lang="env"
          code={`CORS_ENABLED=false`}
        />
      </Section>

      <Section id="static-file-serving" title="Static File Serving">
        <h3 className="mb-3 text-base font-semibold text-neutral-900 dark:text-neutral-200">
          Supported MIME types
        </h3>
        <UL>
          <li>HTML, CSS, JavaScript, JSON</li>
          <li>Images - PNG, JPEG, GIF, SVG, WebP, AVIF, ICO</li>
          <li>Fonts - WOFF, WOFF2, TTF, EOT</li>
          <li>Documents - TXT, XML</li>
          <li>Web manifests</li>
        </UL>

        <h3 className={H3_CLS}>Cache headers</h3>
        <Table
          headers={['File Type', 'Cache Policy']}
          rows={[
            ['/assets/*', 'public, max-age=31536000, immutable (1 year)'],
            ['All other files', 'no-cache'],
          ]}
        />

        <h3 className={H3_CLS}>ETag support</h3>
        <P>ETags are generated automatically from file size + mtimeMs:</P>
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

        <h3 className={H3_CLS}>Testing your server</h3>
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

        <h3 className={H3_CLS}>Configuration examples</h3>
        <P>
          <strong className={STRONG}>Development</strong> (all security disabled)
        </P>
        <CodeBlock
          filename=".env"
          lang="env"
          code={`CORS_ENABLED=true
BODY_TIMEOUT_SECS=0
HANDLER_TIMEOUT_SECS=0
BODY_SIZE_LIMIT=0
NODE_ENV=development`}
        />
        <P>
          <strong className={STRONG}>Production</strong> (secure defaults)
        </P>
        <CodeBlock
          filename=".env"
          lang="env"
          code={`CORS_ENABLED=true
BODY_TIMEOUT_SECS=30
HANDLER_TIMEOUT_SECS=30
BODY_SIZE_LIMIT=10485760
NODE_ENV=production`}
        />
        <P>
          <strong className={STRONG}>Internal API</strong> (no CORS)
        </P>
        <CodeBlock
          filename=".env"
          lang="env"
          code={`CORS_ENABLED=false
BODY_SIZE_LIMIT=5242880  # 5MB`}
        />
        <P>
          <strong className={STRONG}>File upload service</strong>
        </P>
        <CodeBlock
          filename=".env"
          lang="env"
          code={`CORS_ENABLED=true
BODY_SIZE_LIMIT=1073741824  # 1GB
BODY_TIMEOUT_SECS=300  # 5 minutes`}
        />
      </Section>

      <Section id="deployment" title="Deployment">
        <Callout>
          <strong>Ship your src/ folder.</strong> <C>bini-server</C> runs API handlers directly
          from <C>src/app/api/</C> - they are not compiled into <C>dist/</C>. Make sure your host
          has access to both <C>dist/</C> and <C>src/app/api/</C>.
        </Callout>

        <h3 className={H3_CLS}>Where it works</h3>
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

        <h3 className={H3_CLS}>VPS / dedicated server</h3>
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

        <h3 className={H3_CLS}>Platform as a Service</h3>
        <Table
          headers={['Platform', 'Start Command', 'Notes']}
          rows={[
            ['Railway', 'npm start', 'PORT injected automatically'],
            ['Render', 'npm start', 'PORT injected automatically'],
            ['Fly.io', 'npm start', 'See fly.toml example below'],
            ['Heroku', 'npm start', 'PORT injected automatically'],
          ]}
        />

        <h3 className={H3_CLS}>Docker</h3>
        <CodeBlock
          filename="Dockerfile"
          lang="dockerfile"
          code={`FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]`}
        />

        <h3 className={H3_CLS}>Fly.io</h3>
        <CodeBlock
          filename="fly.toml"
          lang="toml"
          code={`[processes]
  app = "npm start"`}
        />
      </Section>

      <Section id="api-reference" title="API Reference">
        <h3 className="mb-3 text-base font-semibold text-neutral-900 dark:text-neutral-200">
          Environment variable priority
        </h3>
        <ol className="mb-6 list-decimal space-y-1 pl-5 text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400">
          <li>
            <C>BINI_*</C> (highest)
          </li>
          <li>
            <C>VITE_*</C> (medium)
          </li>
          <li>No prefix (lowest)</li>
        </ol>

        <h3 className={H3_CLS}>HTTP status codes</h3>
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

        <h3 className={H3_CLS}>Supported HTTP methods</h3>
        <P>
          <C>GET</C>, <C>POST</C>, <C>PUT</C>, <C>PATCH</C>, <C>DELETE</C>, <C>OPTIONS</C> (CORS
          preflight), and <C>HEAD</C> (with ETag support).
        </P>
      </Section>

      <Section id="requirements" title="Requirements">
        <UL>
          <li>Node.js ≥ 20.19.0</li>
          <li>
            A bini-router project with a built <C>dist/</C>
          </li>
          <li>
            API handlers in <C>src/app/api/</C> (if using API routes)
          </li>
        </UL>
      </Section>
    </PluginPage>
  )
}