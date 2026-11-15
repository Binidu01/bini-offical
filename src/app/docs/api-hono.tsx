// src/app/docs/api-hono.tsx
import { Link } from 'react-router-dom'

import {
  C,
  Callout,
  CodeBlock,
  DocPage,
  P,
  Section,
  Table,
  useDocLang,
} from '../../components/DocBlocks'
import { RouteVisual } from '../../components/DocVisuals'
import type { TocItem } from '../../components/TableOfContents'

const TOC_ITEMS: TocItem[] = [
  { id: 'file-based-routing', label: 'File-Based API Routing' },
  { id: 'basic-hono-app', label: 'Basic Hono App' },
  { id: 'routing-with-hono', label: 'Routing with Hono' },
  { id: 'middleware', label: 'Middleware' },
  { id: 'request-handling', label: 'Request Handling' },
  { id: 'validation', label: 'Validation' },
  { id: 'environment-variables', label: 'Environment Variables' },
  { id: 'error-handling', label: 'Error Handling' },
  { id: 'when-to-use-hono', label: 'When to Use Hono' },
]

function VisualStructure({ ext }: { ext: string }) {
  return (
    <RouteVisual
      fileWidth={280}
      rows={[
        { n: 'app' },
        { n: 'api', d: 1 },
        { n: `hello.${ext}`, d: 2, fn: true, dot: true, url: '/api/hello' },
        { n: `users.${ext}`, d: 2, fn: true, dot: true, url: '/api/users' },
        { n: 'posts', d: 2 },
        { n: `[id].${ext}`, d: 3, fn: true, dot: true, url: '/api/posts/:id' },
        { n: `[...catch].${ext}`, d: 2, fn: true, dot: true, url: '/api/*' },
      ]}
    />
  )
}

function Content() {
  const lang = useDocLang()
  const s = lang === 'js' ? 'js' : 'ts'

  return (
    <>
      <Section id="file-based-routing" title="File-Based API Routing">
        <P>
          Hono is a fast, lightweight web framework that works everywhere. Bini.js integrates Hono
          with <strong>file-based API routing</strong> - your file structure defines your API
          routes, and Hono routes are written <strong>without the /api prefix</strong>.
        </P>
        <Callout>
          Hono is the <strong>recommended</strong> approach for complex APIs in Bini.js. It provides
          routing, middleware, validation, and strong TypeScript support - all with zero-config
          file-based routing.
        </Callout>
        <P>
          Your API route is determined by the <C>file path</C> inside <C>src/app/api/</C>. The file
          name becomes the route segment:
        </P>
        <VisualStructure ext={s} />
        <Table
          headers={['File Path', 'API Route']}
          rows={[
            [`src/app/api/hello.${s}`, '/api/hello'],
            [`src/app/api/users.${s}`, '/api/users'],
            [`src/app/api/posts/index.${s}`, '/api/posts'],
            [`src/app/api/posts/[id].${s}`, '/api/posts/:id'],
            [`src/app/api/[...catch].${s}`, '/api/*'],
          ]}
        />
        <Callout>
          There are <strong>no root / API routes</strong>. Every API file maps to a named route based
          on its filename. Write your Hono routes <strong>without</strong> the <C>/api</C> prefix -
          the framework strips it in dev/preview and mounts the app under <C>/api</C> in production.
        </Callout>
      </Section>

      <Section id="basic-hono-app" title="Basic Hono App">
        <P>
          Create a Hono app in <C>src/app/api/</C> and default export it. Because the API layer
          strips <C>/api</C>, the route you define for <C>/api/hello</C> is <C>/hello</C>.
        </P>
        <CodeBlock
          filename={`src/app/api/hello.${s}`}
          tsCode={`import { Hono } from 'hono'

const app = new Hono()

app.all('/hello', (c) => {
  return c.json({
    message: 'Hello from Bini.js!',
    timestamp: new Date().toISOString(),
    method: c.req.method,
  })
})

export default app`}
          jsCode={`import { Hono } from 'hono'

const app = new Hono()

app.all('/hello', (c) => {
  return c.json({
    message: 'Hello from Bini.js!',
    timestamp: new Date().toISOString(),
    method: c.req.method,
  })
})

export default app`}
        />
      </Section>

      <Section id="routing-with-hono" title="Routing with Hono">
        <P>
          Hono provides a powerful routing system with path parameters, query parameters, and more.
          Routes are written with the <C>/api</C> prefix stripped.
        </P>
        <CodeBlock
          filename={`src/app/api/users.${s}`}
          tsCode={`import { Hono } from 'hono'

const app = new Hono()

app.get('/users', (c) => c.json({ users: ['alice', 'bob'] }))
app.get('/users/:id', (c) => c.json({ id: c.req.param('id') }))
app.post('/users', async (c) => c.json({ created: await c.req.json() }, 201))
app.put('/users/:id', async (c) =>
  c.json({ id: c.req.param('id'), ...(await c.req.json()) })
)
app.delete('/users/:id', (c) =>
  c.json({ message: \`Deleted \${c.req.param('id')}\` })
)

export default app`}
          jsCode={`import { Hono } from 'hono'

const app = new Hono()

app.get('/users', (c) => c.json({ users: ['alice', 'bob'] }))
app.get('/users/:id', (c) => c.json({ id: c.req.param('id') }))
app.post('/users', async (c) => c.json({ created: await c.req.json() }, 201))
app.put('/users/:id', async (c) =>
  c.json({ id: c.req.param('id'), ...(await c.req.json()) })
)
app.delete('/users/:id', (c) =>
  c.json({ message: \`Deleted \${c.req.param('id')}\` })
)

export default app`}
        />
        <Table
          headers={['Method', 'Route Pattern', 'Full URL']}
          rows={[
            ['GET', '/users', '/api/users'],
            ['GET', '/users/:id', '/api/users/123'],
            ['POST', '/users', '/api/users'],
            ['PUT', '/users/:id', '/api/users/123'],
            ['DELETE', '/users/:id', '/api/users/123'],
          ]}
        />
      </Section>

      <Section id="middleware" title="Middleware">
        <P>Hono has built-in middleware for common tasks. Import from the subpath:</P>
        <CodeBlock
          filename={`src/app/api/secure.${s}`}
          tsCode={`import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { timeout } from 'hono/timeout'

const app = new Hono()

app.use('*', cors())
app.use('*', logger())
app.use('*', timeout(5000))

app.get('/secure', (c) => c.json({ message: 'Public' }))

export default app`}
          jsCode={`import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { timeout } from 'hono/timeout'

const app = new Hono()

app.use('*', cors())
app.use('*', logger())
app.use('*', timeout(5000))

app.get('/secure', (c) => c.json({ message: 'Public' }))

export default app`}
        />
        <Table
          headers={['Middleware', 'Import', 'Purpose']}
          rows={[
            ['cors', 'hono/cors', 'Cross-Origin Resource Sharing'],
            ['logger', 'hono/logger', 'Request logging'],
            ['timeout', 'hono/timeout', 'Request timeout'],
            ['secure-headers', 'hono/secure-headers', 'CSP and security headers'],
            ['pretty-json', 'hono/pretty-json', 'Pretty JSON responses'],
          ]}
        />
      </Section>

      <Section id="request-handling" title="Request Handling">
        <P>Hono provides convenient methods for accessing request data:</P>
        <CodeBlock
          filename={`src/app/api/echo.${s}`}
          tsCode={`import { Hono } from 'hono'

const app = new Hono()

app.all('/echo', async (c) => {
  const params = c.req.param()
  const query = c.req.query()
  const page = c.req.query('page')
  const userAgent = c.req.header('User-Agent')
  const body = await c.req.json().catch(() => null)

  return c.json({
    method: c.req.method,
    path: c.req.path,
    params,
    query: { page, ...query },
    headers: { userAgent },
    body,
  })
})

export default app`}
          jsCode={`import { Hono } from 'hono'

const app = new Hono()

app.all('/echo', async (c) => {
  const params = c.req.param()
  const query = c.req.query()
  const page = c.req.query('page')
  const userAgent = c.req.header('User-Agent')
  const body = await c.req.json().catch(() => null)

  return c.json({
    method: c.req.method,
    path: c.req.path,
    params,
    query: { page, ...query },
    headers: { userAgent },
    body,
  })
})

export default app`}
        />
      </Section>

      <Section id="validation" title="Validation">
        <P>Validate incoming requests with Zod:</P>
        <CodeBlock
          filename={`src/app/api/posts.${s}`}
          tsCode={`import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

const app = new Hono()

const postSchema = z.object({
  title: z.string().min(1).max(100),
  content: z.string().min(1),
})

app.post('/posts', zValidator('json', postSchema), async (c) => {
  const body = c.req.valid('json')
  return c.json({ post: { id: Date.now(), ...body } }, 201)
})

export default app`}
          jsCode={`import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

const app = new Hono()

const postSchema = z.object({
  title: z.string().min(1).max(100),
  content: z.string().min(1),
})

app.post('/posts', zValidator('json', postSchema), async (c) => {
  const body = c.req.valid('json')
  return c.json({ post: { id: Date.now(), ...body } }, 201)
})

export default app`}
        />
        <Callout>
          Install <C>zod</C> and <C>@hono/zod-validator</C> for request validation with TypeScript
          inference.
        </Callout>
      </Section>

      <Section id="environment-variables" title="Environment Variables">
        <P>
          Hono passes environment variables through the <C>c.env</C> object. Access them directly in
          your handlers:
        </P>
        <CodeBlock
          filename={`src/app/api/config.${s}`}
          tsCode={`import { Hono } from 'hono'

const app = new Hono()

app.get('/config', (c) => {
  const apiKey = c.env.MY_API_KEY
  const appName = c.env.APP_NAME ?? 'Bini.js'

  if (!apiKey) {
    return c.json({ error: 'Missing MY_API_KEY' }, 500)
  }

  return c.json({ appName, hasApiKey: !!apiKey })
})

export default app`}
          jsCode={`import { Hono } from 'hono'

const app = new Hono()

app.get('/config', (c) => {
  const apiKey = c.env.MY_API_KEY
  const appName = c.env.APP_NAME ?? 'Bini.js'

  if (!apiKey) {
    return c.json({ error: 'Missing MY_API_KEY' }, 500)
  }

  return c.json({ appName, hasApiKey: !!apiKey })
})

export default app`}
        />
        <Callout>
          On Cloudflare, secrets set via <C>wrangler secret put</C> are read from <C>c.env</C>. On
          Node, <C>c.env</C> is backed by <C>process.env</C>.
        </Callout>
      </Section>

      <Section id="error-handling" title="Error Handling">
        <P>Handle errors gracefully with Hono's error handling:</P>
        <CodeBlock
          filename={`src/app/api/robust.${s}`}
          tsCode={`import { Hono } from 'hono'

const app = new Hono()

app.onError((err, c) => {
  const isDev = c.env.NODE_ENV === 'development'
  return c.json(
    {
      error: 'Internal Server Error',
      ...(isDev && { details: err.message }),
    },
    500
  )
})

app.notFound((c) => c.json({ error: 'Not Found' }, 404))

app.get('/robust/users/:id', (c) => {
  const id = c.req.param('id')
  if (id === 'admin') {
    return c.json({ error: 'Access denied' }, 403)
  }
  return c.json({ id, name: 'John' })
})

export default app`}
          jsCode={`import { Hono } from 'hono'

const app = new Hono()

app.onError((err, c) => {
  const isDev = c.env.NODE_ENV === 'development'
  return c.json(
    {
      error: 'Internal Server Error',
      ...(isDev && { details: err.message }),
    },
    500
  )
})

app.notFound((c) => c.json({ error: 'Not Found' }, 404))

app.get('/robust/users/:id', (c) => {
  const id = c.req.param('id')
  if (id === 'admin') {
    return c.json({ error: 'Access denied' }, 403)
  }
  return c.json({ id, name: 'John' })
})

export default app`}
        />
      </Section>

      <Section id="when-to-use-hono" title="When to Use Hono">
        <Table
          headers={['Scenario', 'Recommendation']}
          rows={[
            ['Multiple endpoints in one file', 'Hono - Recommended'],
            ['Need middleware (CORS, auth, logging)', 'Hono - Recommended'],
            ['Complex routing patterns', 'Hono - Recommended'],
            ['Production APIs with many routes', 'Hono - Recommended'],
            ['Single endpoint with simple logic', 'Plain handler'],
            ['Quick prototypes', 'Plain handler'],
          ]}
        />
        <Callout>
          Use Hono for middleware and complex routing. Use a plain handler for a single endpoint.
          See the Plain Function Handlers page for per-method exports.
        </Callout>
      </Section>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link to="/docs/api-routes" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">API Routes Overview</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Files under app/api/ map to /api/*.</p>
        </Link>
        <Link to="/docs/api-plain" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Plain Function Handlers</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Backend endpoints with plain Request/Response handlers.</p>
        </Link>
        <Link to="/docs/api-dynamic" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Dynamic API Routes</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Path parameters and catch-all segments.</p>
        </Link>
        <Link to="/docs/environment-variables" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Environment Variables</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Read secrets with c.env in your API routes.</p>
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

export default function ApiHonoPage() {
  return (
    <DocPage
      title="Hono Integration"
      description="Build powerful APIs with Hono in Bini.js - file-based routing, middleware, and type safety."
      url="https://bini.js.org/docs/api-hono"
      editUrl="https://github.com/Binidu01/bini-official/edit/main/src/app/docs/api-hono.tsx"
      toc={TOC_ITEMS}
      prev={{ to: '/docs/api-plain', title: 'Plain Function Handlers' }}
      next={{ to: '/docs/api-dynamic', title: 'Dynamic API Routes' }}
    >
      <Content />
    </DocPage>
  )
}