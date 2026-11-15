// src/app/docs/api-routes.tsx
import { Link } from 'react-router-dom'

import {
  C,
  Callout,
  CodeBlock,
  DocPage,
  H3,
  MultiTerminal,
  P,
  Section,
  Table,
  useDocLang,
  useDocPm,
} from '../../components/DocBlocks'
import { RouteVisual } from '../../components/DocVisuals'
import type { TocItem } from '../../components/TableOfContents'

const TOC_ITEMS: TocItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'file-structure', label: 'File Structure' },
  { id: 'handler-styles', label: 'Handler Styles' },
  { id: 'request-context', label: 'Request Context' },
  { id: 'dynamic-routes', label: 'Dynamic Routes' },
  { id: 'environment-variables', label: 'Environment Variables' },
  { id: 'cors', label: 'CORS' },
  { id: 'deployment', label: 'Deployment' },
]

/* ---- package-manager helpers (same as platform-web) ----------------- */

const PMS = ['npm', 'pnpm', 'yarn', 'bun'] as const
type Pm = (typeof PMS)[number]

const run = (pm: Pm, script: string, bunRun = true) =>
  pm === 'npm'
    ? `npm run ${script}`
    : pm === 'bun' && bunRun
      ? `bun run ${script}`
      : `${pm} ${script}`

const tabs = (cmd: (pm: Pm) => string) =>
  PMS.map((pm) => ({ id: pm, label: pm, command: cmd(pm) }))

function Content() {
  const lang = useDocLang()
  const pm = useDocPm()
  const e = lang === 'js' ? 'js' : 'ts'

  return (
    <>
      <Section id="overview" title="Overview">
        <P>
          Place <C>.ts</C> or <C>.js</C> files in <C>src/app/api/</C> and they become routes at{' '}
          <C>/api/*</C>. Every handler receives a standard Web <C>Request</C> and a context object.
        </P>
        <Table
          headers={['File', 'Route']}
          rows={[
            [`src/app/api/hello.${e}`, '/api/hello'],
            [`src/app/api/users.${e}`, '/api/users'],
            [`src/app/api/posts/index.${e}`, '/api/posts'],
            [`src/app/api/posts/[id].${e}`, '/api/posts/:id'],
            [`src/app/api/[...catch].${e}`, '/api/*'],
          ]}
        />
        <Callout>
          Static routes match before dynamic ones, and dynamic ones before catch-alls.
        </Callout>
      </Section>

      <Section id="file-structure" title="File Structure">
        <P>
          The filename becomes the last path segment under <C>/api/</C>. Use{' '}
          <C>index.ts</C> inside a folder for the parent path. API files are marked with the{' '}
          <C>ƒ</C> icon.
        </P>
        <RouteVisual
          fileWidth={260}
          rows={[
            { n: 'app' },
            { n: 'api', d: 1 },
            { n: `hello.${e}`, d: 2, fn: true, url: '/api/hello', dot: true },
            { n: `users.${e}`, d: 2, fn: true, url: '/api/users' },
            { n: 'posts', d: 2 },
            { n: `index.${e}`, d: 3, fn: true, url: '/api/posts' },
            { n: `[id].${e}`, d: 3, fn: true, url: '/api/posts/:id' },
            { n: `[...catch].${e}`, d: 2, fn: true, url: '/api/*' },
          ]}
        />
        <Callout>
          Files and folders starting with <C>_</C> or <C>.</C> are ignored.
        </Callout>
      </Section>

      <Section id="handler-styles" title="Handler Styles">
        <P>Three handler styles are supported. All receive a Web <C>Request</C> and return a <C>Response</C>.</P>

        <H3 className="mt-6 mb-3">1. Plain function</H3>
        <CodeBlock
          filename={`src/app/api/hello.${e}`}
          tsCode={`export default function handler(request: Request) {
  return Response.json({ message: 'Hello' })
}`}
          jsCode={`export default function handler(request) {
  return Response.json({ message: 'Hello' })
}`}
        />

        <H3 className="mt-6 mb-3">2. Per-method exports</H3>
        <P>
          Export <C>GET</C>, <C>POST</C>, <C>PUT</C>, <C>PATCH</C>, <C>DELETE</C>, <C>HEAD</C>, or{' '}
          <C>OPTIONS</C>. Other methods receive 405 with an <C>Allow</C> header, and <C>HEAD</C>{' '}
          falls back to <C>GET</C>.
        </P>
        <CodeBlock
          filename={`src/app/api/users.${e}`}
          tsCode={`export function GET(request: Request, { params }: { params: Record<string, string> }) {
  return Response.json({ users: [] })
}

export async function POST(request: Request) {
  const body = await request.json()
  return Response.json({ created: body }, { status: 201 })
}`}
          jsCode={`export function GET(request, { params }) {
  return Response.json({ users: [] })
}

export async function POST(request) {
  const body = await request.json()
  return Response.json({ created: body }, { status: 201 })
}`}
        />

        <H3 className="mt-6 mb-3">3. Hono app</H3>
        <P>
          A default export with a <C>.fetch()</C> method - such as a Hono instance - is mounted
          under <C>/api</C>. Write Hono routes <strong>without</strong> the <C>/api</C> prefix.
        </P>
        <CodeBlock
          filename={`src/app/api/users.${e}`}
          tsCode={`import { Hono } from 'hono'

const app = new Hono()

app.get('/users', (c) => c.json({ users: [] }))
app.post('/users', async (c) => {
  const body = await c.req.json()
  return c.json({ created: body }, 201)
})

export default app`}
          jsCode={`import { Hono } from 'hono'

const app = new Hono()

app.get('/users', (c) => c.json({ users: [] }))
app.post('/users', async (c) => {
  const body = await c.req.json()
  return c.json({ created: body }, 201)
})

export default app`}
        />
        <Callout>
          If a file exports both method handlers and a default export, method handlers take
          precedence for the methods they define.
        </Callout>
      </Section>

      <Section id="request-context" title="Request Context">
        <P>Every handler receives a context object with these fields.</P>
        <Table
          headers={['Field', 'Type', 'Description']}
          rows={[
            ['params', 'object', 'Dynamic route params (e.g. { id: "123" })'],
            ['searchParams', 'URLSearchParams', 'Query string parameters'],
            ['env', 'any', 'Runtime env bindings (or process.env on Node)'],
            ['waitUntil?', 'function', 'Extends the request lifetime for background work'],
          ]}
        />
        <CodeBlock
          filename={`src/app/api/users/[id].${e}`}
          tsCode={`export function GET(
  request: Request,
  { params, searchParams }: { params: { id: string }; searchParams: URLSearchParams }
) {
  const format = searchParams.get('format') ?? 'json'
  return Response.json({ id: params.id, format })
}`}
          jsCode={`export function GET(request, { params, searchParams }) {
  const format = searchParams.get('format') ?? 'json'
  return Response.json({ id: params.id, format })
}`}
        />
      </Section>

      <Section id="dynamic-routes" title="Dynamic Routes">
        <P>
          <C>[id]</C> folders or files create dynamic segments. <C>[...catch]</C> matches the
          remaining segments. Catch-all values are available under <C>params['*']</C> and under
          the folder name.
        </P>
        <CodeBlock
          filename={`src/app/api/posts/[...slug].${e}`}
          tsCode={`export function GET(
  request: Request,
  { params }: { params: { '*': string; slug?: string } }
) {
  const path = params['*']
  return Response.json({ path, segments: path.split('/') })
}`}
          jsCode={`export function GET(request, { params }) {
  const path = params['*']
  return Response.json({ path, segments: path.split('/') })
}`}
        />
      </Section>

      <Section id="environment-variables" title="Environment Variables">
        <P>
          Access environment variables directly from the <C>env</C> object in the request context.
          This ensures your code works across all deployment platforms.
        </P>
        <CodeBlock
          filename={`src/app/api/email.${e}`}
          tsCode={`export function POST(request: Request, { env }: { env: Record<string, string | undefined> }) {
  const smtpHost = env.SMTP_HOST
  const smtpPort = parseInt(env.SMTP_PORT ?? '587', 10)
  
  if (!smtpHost) {
    return Response.json({ error: 'Missing SMTP_HOST' }, { status: 500 })
  }

  return Response.json({ host: smtpHost, port: smtpPort })
}`}
          jsCode={`export function POST(request, { env }) {
  const smtpHost = env.SMTP_HOST
  const smtpPort = parseInt(env.SMTP_PORT ?? '587', 10)
  
  if (!smtpHost) {
    return Response.json({ error: 'Missing SMTP_HOST' }, { status: 500 })
  }

  return Response.json({ host: smtpHost, port: smtpPort })
}`}
        />
        <Callout>
          On Node, <C>env</C> is backed by <C>process.env</C>. On edge platforms, it reads the
          runtime bindings.
        </Callout>
      </Section>

      <Section id="cors" title="CORS">
        <P>
          CORS is off by default. Enable it at the router level with an explicit origin allowlist,
          or handle it per-route with Hono middleware.
        </P>
        <CodeBlock
          filename={`vite.config.${e}`}
          tsCode={`import { defineConfig } from 'vite'
import { biniroute } from 'bini-router'

export default defineConfig({
  plugins: [
    biniroute({
      cors: {
        origin: ['https://myapp.com', 'https://app.myapp.com'],
        methods: ['GET', 'POST'],
        headers: ['Authorization', 'Content-Type'],
      },
    }),
  ],
})`}
          jsCode={`import { defineConfig } from 'vite'
import { biniroute } from 'bini-router'

export default defineConfig({
  plugins: [
    biniroute({
      cors: {
        origin: ['https://myapp.com', 'https://app.myapp.com'],
        methods: ['GET', 'POST'],
        headers: ['Authorization', 'Content-Type'],
      },
    }),
  ],
})`}
        />
        <Callout>
          Use an explicit <C>origin</C> list in production. Setting <C>cors: true</C> allows any
          origin.
        </Callout>
      </Section>

      <Section id="deployment" title="Deployment">
        <P>
          API routes work across platforms. The deploy tool generates the platform entry files
          for non-Node hosts.
        </P>
        <MultiTerminal tabs={tabs((pm) => `$ ${run(pm, 'deploy')}`)} />
        <Table
          headers={['Platform', 'Entry']}
          rows={[
            ['Node.js', 'The production server reads dist/api/index.mjs directly'],
            ['Netlify', 'netlify/functions/api.mjs'],
            ['Vercel', 'api/index.ts'],
            ['Cloudflare', 'worker.ts'],
            ['Deno', 'server/index.ts'],
          ]}
        />
      </Section>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link to="/docs/api-plain" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Plain Function Handlers</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Backend endpoints with plain Request/Response handlers.</p>
        </Link>
        <Link to="/docs/api-hono" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Hono Integration</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Build API routes with the Hono framework.</p>
        </Link>
        <Link to="/docs/api-dynamic" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Dynamic API Routes</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Path parameters and catch-all segments.</p>
        </Link>
        <Link to="/docs/environment-variables" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Environment Variables</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Read secrets in your API routes.</p>
        </Link>
        <Link to="/docs/deploying" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Deployment</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Deploy to Node, Vercel, Netlify, Cloudflare, or Deno.</p>
        </Link>
        <Link to="/docs/loaders" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Loaders</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Fetch data before a route renders.</p>
        </Link>
      </div>
    </>
  )
}

export default function ApiRoutesPage() {
  return (
    <DocPage
      title="API Routes Overview"
      description="Backend endpoints with plain Request handlers or Hono. Files under app/api/ map to /api/*."
      url="https://bini.js.org/docs/api-routes"
      editUrl="https://github.com/Binidu01/bini-official/edit/main/src/app/docs/api-routes.tsx"
      toc={TOC_ITEMS}
      prev={{ to: '/docs/icons', title: 'Icons & Favicons' }}
      next={{ to: '/docs/api-plain', title: 'Plain Function Handlers' }}
    >
      <Content />
    </DocPage>
  )
}