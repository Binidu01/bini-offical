// src/app/docs/production-server.tsx
import { siNodedotjs } from 'simple-icons'
import { Link } from 'react-router-dom'

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
  { id: 'static-file-serving', label: 'Static File Serving' },
  { id: 'security', label: 'Security' },
  { id: 'deployment', label: 'Deployment' },
]

const STRONG = 'font-medium text-neutral-900 dark:text-neutral-100'

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
            static files and pages
          </span>
          <span className={`${BOX} h-10 w-64 shrink-0`}>
            <span className="mr-2 text-neutral-500">dist/api/index.mjs</span>
            all /api/* requests
          </span>
        </div>
      </div>
    </GridBg>
  )
}

const BANNER_TEXT = `  ß Bini.js (production)
  ->  Environments: .env.local, .env
  ->  Local:   http://localhost:3000/
  ->  Network: http://192.168.1.5:3000/
  ->  press h + enter to show help`

/** Colored startup banner, matching the real terminal output. */
function ServerBanner() {
  const arrow = <span className="text-green-600 dark:text-green-400">➜</span>
  const dimArrow = <span className="text-green-600/60 dark:text-green-400/60">➜</span>
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
      <span className="text-neutral-600 dark:text-neutral-400">.env.local, .env</span>
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
      {dimArrow}
      {'  '}
      <span className="text-neutral-500">
        press <strong className="font-bold text-neutral-700 dark:text-neutral-300">h + enter</strong>{' '}
        to show help
      </span>
    </OutputBlock>
  )
}

/* ---------- content ---------- */

function Content() {
  const lang = useDocLang()
  const t = lang === 'js' ? 'js' : 'ts'
  const e = lang === 'js' ? 'jsx' : 'tsx'

  return (
    <>
      <Section id="overview" title="Overview">
        <P className="mb-4">
          <C>bini-server</C> is the production server for Bini.js apps on Node.js. It serves your
          built app - the pages, the assets, and the API routes - so you can run it on a server.
        </P>
        <RequestFlowVisual />
        <P className="mb-0">
          It has <strong className={STRONG}>no dependencies</strong> beyond Node.js itself, and
          works the same on Windows, macOS, and Linux.
        </P>
      </Section>

      <Section id="features" title="Features">
        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          <FeatureCard
            title="Serves your build"
            text="Ships the output of vite build - pages, assets, and API."
          />
          <FeatureCard
            title="API routes"
            text="Handles /api/* from the compiled bundle."
          />
          <FeatureCard
            title="Page fallbacks"
            text="Pre-rendered page, then shell page, then 404, then index.html."
          />
          <FeatureCard
            title="Caching"
            text="Sends ETag headers so unchanged files return 304 Not Modified."
          />
          <FeatureCard
            title="Safe by default"
            text="Body size limits, timeouts, and path traversal protection are on."
          />
          <FeatureCard
            title="Graceful shutdown"
            text="Handles SIGTERM and SIGINT cleanly."
          />
        </div>
      </Section>

      <Section id="installation" title="Installation">
        <P className="mb-4">
          Every Bini.js web project already includes <C>bini-server</C>. To add it to an existing
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
          Shortcuts are disabled when the server runs without a terminal (for example on a hosted
          platform or in CI).
        </Callout>
      </Section>

      <Section id="environment-variables" title="Environment Variables">
        <H3 className="mb-3 mt-2">.env files</H3>
        <P className="mb-4">
          At startup, bini-server loads these files from the working directory when they exist.
          Highest priority first:
        </P>
        <UL className="mb-4 space-y-1">
          <li><C>.env.[mode].local</C></li>
          <li><C>.env.[mode]</C></li>
          <li><C>.env.local</C></li>
          <li><C>.env</C></li>
        </UL>
        <P className="mb-4">
          <C>[mode]</C> is <C>NODE_ENV</C>, or <C>production</C> when that is not set. A variable
          that is already set in the environment is never overridden by a file.
        </P>

        <H3 className="mb-3 mt-2">Naming conventions</H3>
        <P className="mb-4">Every setting works with any of these, in priority order:</P>
        <Table
          headers={['Convention', 'Example', 'Priority']}
          rows={[
            ['BINI_*', 'BINI_PORT=3000', 'Highest'],
            ['VITE_*', 'VITE_PORT=3000', 'Medium'],
            ['No prefix', 'PORT=3000', 'Lowest'],
          ]}
        />

        <H3 className="mt-6 mb-3">Server settings</H3>
        <Table
          headers={['Variable', 'Default', 'Description']}
          rows={[
            ['PORT', '3000', 'HTTP port to listen on. Uses the next free port if busy.'],
            ['BASE', '(empty)', 'Sub-path the app is served under, for example /app.'],
            ['BODY_TIMEOUT_SECS', '30', 'Max seconds to read an API request body.'],
            ['HANDLER_TIMEOUT_SECS', '30', 'Max seconds for an API handler to respond.'],
            ['BODY_SIZE_LIMIT', '10485760', 'Max API request body size in bytes (10 MB).'],
          ]}
        />

        <H3 className="mt-6 mb-3">Examples</H3>
        <CodeBlock
          filename=".env"
          lang="text"
          code={`# .env
PORT=8080
BODY_SIZE_LIMIT=5242880  # 5MB`}
        />
        <CodeBlock
          filename="Terminal"
          lang="shell"
          code={`# Inline
$ PORT=3001 bini-server

# BINI_ takes precedence over plain PORT
$ BINI_PORT=3002 bini-server`}
        />
      </Section>

      <Section id="project-structure" title="Project Structure">
        <FolderVisual
          width={300}
          rows={[
            { n: 'my-app' },
            { n: 'dist', d: 1, dot: true },
            { n: 'index.html', d: 2 },
            { n: '404.html', d: 2 },
            { n: 'assets', d: 2 },
            { n: 'api', d: 2 },
            { n: 'index.mjs', d: 3 },
            { n: 'src', d: 1 },
            { n: 'app', d: 2 },
            { n: 'api', d: 3 },
            { n: `users.${t}`, d: 4, fn: true },
            { n: `layout.${e}`, d: 3 },
            { n: '.env', d: 1 },
            { n: 'package.json', d: 1 },
            { n: `vite.config.${t}`, d: 1 },
          ]}
        />
        <UL>
          <li>
            <C>dist/</C> - build output (required)
          </li>
          <li>
            <C>dist/api/index.mjs</C> - compiled API bundle (only if the app has API routes)
          </li>
          <li>
            <C>.env</C> - environment variables
          </li>
        </UL>
      </Section>

      <Section id="api-routes" title="API Routes">
        <P className="mb-4">
          Every <C>/api/*</C> request goes to the single compiled bundle at{' '}
          <C>dist/api/index.mjs</C>. <C>vite build</C> produces it from the files in{' '}
          <C>src/app/api/</C>. bini-server does not read your source at runtime.
        </P>
        <Callout>
          If the bundle is missing, every API request returns 404 with{' '}
          <C>{`{"error":"No API routes compiled"}`}</C>.
        </Callout>

        <H3 className="mt-6 mb-3">Handler formats</H3>
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
        <P className="mt-4 mb-4">
          Handlers receive route params as the second argument:
        </P>
        <CodeBlock
          filename={`src/app/api/users/[id].${t}`}
          tsCode={`// src/app/api/users/[id].ts
export default (req: Request, { params }: { params: { id: string } }) => {
  return Response.json({ id: params.id })
}`}
          jsCode={`// src/app/api/users/[id].js
export default (req, { params }) => {
  return Response.json({ id: params.id })
}`}
        />
      </Section>

      <Section id="static-file-serving" title="Static File Serving">
        <P className="mb-4">
          Files in <C>dist/</C> are served directly. For a URL without a file extension, the
          server picks in this order:
        </P>
        <UL>
          <li>a pre-rendered page at that path</li>
          <li>a shell page that matches the path</li>
          <li><C>dist/404.html</C></li>
          <li><C>dist/index.html</C> (client-side fallback)</li>
        </UL>
        <P className="mt-4 mb-4">
          Files under <C>dist/api/</C> are never served as static files.
        </P>
        <P className="mb-0">
          Caching is automatic: unchanged files return <C>304 Not Modified</C> via ETag, and files
          inside an <C>assets/</C> folder get a 1-year immutable cache header.
        </P>
      </Section>

      <Section id="security" title="Security">
        <Table
          headers={['Feature', 'Default', 'Change with']}
          rows={[
            ['API body size limit', '10 MB', <C key="1">BODY_SIZE_LIMIT</C>],
            ['API body read timeout', '30 s', <C key="2">BODY_TIMEOUT_SECS</C>],
            ['API handler timeout', '30 s', <C key="3">HANDLER_TIMEOUT_SECS</C>],
            ['Path traversal', 'Blocked', 'Always on'],
            ['Hidden error messages', 'On with NODE_ENV=production', <C key="4">NODE_ENV</C>],
          ]}
        />

        <H3 className="mt-6 mb-3">Test your server</H3>
        <CodeBlock
          filename="Terminal"
          lang="shell"
          code={`# Page
$ curl http://localhost:3000/

# API route
$ curl http://localhost:3000/api/hello

# ETag / 304
$ curl -I http://localhost:3000/assets/app.js`}
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
          headers={['Platform', 'Start Command']}
          rows={[
            ['Railway', 'npm start'],
            ['Render', 'npm start'],
            ['Fly.io', 'npm start'],
            ['Heroku', 'npm start'],
          ]}
        />
        <P className="mt-2 mb-4">
          These platforms inject <C>PORT</C> automatically.
        </P>

        <H3 className="mt-6 mb-3">Docker</H3>
        <CodeBlock
          filename="Dockerfile"
          lang="text"
          code={`FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build && npm prune --omit=dev
ENV NODE_ENV=production
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

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link to="/docs/deploying" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Deployment Overview</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Where to deploy a Bini.js app.</p>
        </Link>
        <Link to="/docs/static-export" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Static Export</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Pre-render the whole app for a static host.</p>
        </Link>
        <Link to="/docs/hosting" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Hosting Providers</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Platform-specific deployment notes.</p>
        </Link>
        <Link to="/docs/environment-variables" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Environment Variables</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Read secrets with getEnv and requireEnv.</p>
        </Link>
      </div>
    </>
  )
}

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