// src/app/docs/api-hono.tsx
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
  { id: 'dynamic-api-routes', label: 'Dynamic API Routes' },
  { id: 'middleware', label: 'Middleware' },
  { id: 'request-handling', label: 'Request Handling' },
  { id: 'response-handling', label: 'Response Handling' },
  { id: 'validation', label: 'Validation' },
  { id: 'environment-variables', label: 'Environment Variables' },
  { id: 'error-handling', label: 'Error Handling' },
  { id: 'nested-routes', label: 'Nested Routes' },
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
          routes.
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
            [`src/app/api/user.${s}`, '/api/user'],
            [`src/app/api/posts.${s}`, '/api/posts'],
            [`src/app/api/posts/[id].${s}`, '/api/posts/:id'],
            [`src/app/api/[...catch].${s}`, '/api/*'],
          ]}
        />
        <Callout>
          There are <strong>no root / API routes</strong>. Every API file maps to a named route based
          on its filename. Write your Hono routes <strong>without</strong> the <C>/api</C> prefix -
          bini-router strips it in dev/preview and mounts the app under <C>/api</C> in production.
        </Callout>
      </Section>

      <Section id="basic-hono-app" title="Basic Hono App">
        <P>
          Create a Hono app in <C>src/app/api/</C> and default export it:
        </P>
        <CodeBlock
          filename={`src/app/api/hello.${s}`}
          tsCode={`// src/app/api/hello.ts -> /api/hello
import { Hono } from 'hono'

const app = new Hono()

app.all('/hello', (c) => {
  return c.json({
    message: 'Hello from Bini.js!',
    timestamp: new Date().toISOString(),
    method: c.req.method,
  })
})

export default app`}
          jsCode={`// src/app/api/hello.js -> /api/hello
import { Hono } from 'hono'

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
          Hono provides a powerful routing system with path parameters, query parameters, and more:
        </P>
        <CodeBlock
          filename={`src/app/api/users.${s}`}
          tsCode={`// src/app/api/users.ts -> /api/users
import { Hono } from 'hono'

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
          jsCode={`// src/app/api/users.js -> /api/users
import { Hono } from 'hono'

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

      <Section id="dynamic-api-routes" title="Dynamic API Routes">
        <P>
          Use <C>[param]</C> in filenames for dynamic segments:
        </P>
        <CodeBlock
          filename={`src/app/api/posts/[id].${s}`}
          tsCode={`// src/app/api/posts/[id].ts -> /api/posts/:id
import { Hono } from 'hono'

const app = new Hono()
app.get('/posts/:id', (c) => c.json({ id: c.req.param('id') }))
export default app`}
          jsCode={`// src/app/api/posts/[id].js -> /api/posts/:id
import { Hono } from 'hono'

const app = new Hono()
app.get('/posts/:id', (c) => c.json({ id: c.req.param('id') }))
export default app`}
        />
        <CodeBlock
          filename={`src/app/api/[...catch].${s}`}
          tsCode={`// src/app/api/[...catch].ts -> /api/*
import { Hono } from 'hono'

const app = new Hono()
app.all('*', (c) => c.json({ path: c.req.path }))
export default app`}
          jsCode={`// src/app/api/[...catch].js -> /api/*
import { Hono } from 'hono'

const app = new Hono()
app.all('*', (c) => c.json({ path: c.req.path }))
export default app`}
        />
      </Section>

      <Section id="middleware" title="Middleware">
        <P>Hono has built-in middleware for common tasks:</P>
        <CodeBlock
          filename={`src/app/api/secure.${s}`}
          tsCode={`// src/app/api/secure.ts -> /api/secure
import { Hono } from 'hono'
import { cors, logger, jwt, timeout } from 'hono/middleware'

const app = new Hono()

app.use('*', cors())
app.use('*', logger())
app.use('*', timeout(5000))

app.get('/secure', (c) => c.json({ message: 'Public' }))

export default app`}
          jsCode={`// src/app/api/secure.js -> /api/secure
import { Hono } from 'hono'
import { cors, logger, jwt, timeout } from 'hono/middleware'

const app = new Hono()

app.use('*', cors())
app.use('*', logger())
app.use('*', timeout(5000))

app.get('/secure', (c) => c.json({ message: 'Public' }))

export default app`}
        />
        <Table
          headers={['Middleware', 'Purpose']}
          rows={[
            ['cors', 'Cross-Origin Resource Sharing'],
            ['logger', 'Request logging'],
            ['jwt', 'JWT authentication'],
            ['timeout', 'Request timeout'],
            ['prettyJSON', 'Pretty JSON responses'],
          ]}
        />
      </Section>

      <Section id="request-handling" title="Request Handling">
        <P>Hono provides convenient methods for accessing request data:</P>
        <CodeBlock
          filename={`src/app/api/echo.${s}`}
          tsCode={`// src/app/api/echo.ts -> /api/echo
import { Hono } from 'hono'

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
          jsCode={`// src/app/api/echo.js -> /api/echo
import { Hono } from 'hono'

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

      <Section id="response-handling" title="Response Handling">
        <P>Hono provides flexible response methods:</P>
        <CodeBlock
          filename={`src/app/api/responses.${s}`}
          tsCode={`// src/app/api/responses.ts -> /api/responses
import { Hono } from 'hono'

const app = new Hono()

app.get('/json', (c) => c.json({ message: 'Hello' }))
app.get('/text', (c) => c.text('Hello Text'))
app.get('/html', (c) => c.html('<h1>Hello</h1>'))
app.get('/redirect', (c) => c.redirect('https://example.com', 302))
app.post('/created', (c) => c.json({ message: 'Created' }, 201))
app.get('/error', (c) => c.json({ error: 'Error' }, 500))

export default app`}
          jsCode={`// src/app/api/responses.js -> /api/responses
import { Hono } from 'hono'

const app = new Hono()

app.get('/json', (c) => c.json({ message: 'Hello' }))
app.get('/text', (c) => c.text('Hello Text'))
app.get('/html', (c) => c.html('<h1>Hello</h1>'))
app.get('/redirect', (c) => c.redirect('https://example.com', 302))
app.post('/created', (c) => c.json({ message: 'Created' }, 201))
app.get('/error', (c) => c.json({ error: 'Error' }, 500))

export default app`}
        />
      </Section>

      <Section id="validation" title="Validation">
        <P>Validate incoming requests with Zod:</P>
        <CodeBlock
          filename={`src/app/api/posts.${s}`}
          tsCode={`// src/app/api/posts.ts -> /api/posts
import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

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
          jsCode={`// src/app/api/posts.js -> /api/posts
import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

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
          Use <C>getEnv()</C> and <C>requireEnv()</C> from <C>bini-env</C>:
        </P>
        <CodeBlock
          filename={`src/app/api/config.${s}`}
          tsCode={`// src/app/api/config.ts -> /api/config
import { Hono } from 'hono'
import { getEnv, requireEnv } from 'bini-env'

const app = new Hono()

app.get('/config', (c) => {
  const ctx = c as any
  const apiKey = requireEnv(ctx, 'MY_API_KEY')
  const appName = getEnv(ctx, 'APP_NAME') ?? 'Bini.js'

  return c.json({ appName, hasApiKey: !!apiKey })
})

export default app`}
          jsCode={`// src/app/api/config.js -> /api/config
import { Hono } from 'hono'
import { getEnv, requireEnv } from 'bini-env'

const app = new Hono()

app.get('/config', (c) => {
  const ctx = c
  const apiKey = requireEnv(ctx, 'MY_API_KEY')
  const appName = getEnv(ctx, 'APP_NAME') ?? 'Bini.js'

  return c.json({ appName, hasApiKey: !!apiKey })
})

export default app`}
        />
        <Callout>
          Cast <C>c</C> once at the top of your handler with <C>const ctx = c as any</C>. Then use{' '}
          <C>requireEnv(ctx, 'KEY')</C> for required vars and <C>getEnv(ctx, 'KEY') ?? 'default'</C>{' '}
          for optional ones.
        </Callout>
      </Section>

      <Section id="error-handling" title="Error Handling">
        <P>Handle errors gracefully with Hono's error handling:</P>
        <CodeBlock
          filename={`src/app/api/robust.${s}`}
          tsCode={`// src/app/api/robust.ts -> /api/robust
import { Hono } from 'hono'
import { getEnv } from 'bini-env'

const app = new Hono()

app.onError((err, c) => {
  const isDev = getEnv(c as any, 'NODE_ENV') === 'development'
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
          jsCode={`// src/app/api/robust.js -> /api/robust
import { Hono } from 'hono'
import { getEnv } from 'bini-env'

const app = new Hono()

app.onError((err, c) => {
  const isDev = getEnv(c, 'NODE_ENV') === 'development'
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

      <Section id="nested-routes" title="Nested Routes">
        <P>Organize complex APIs with nested sub-routers:</P>
        <CodeBlock
          filename={`src/app/api/index.${s}`}
          tsCode={`// src/app/api/index.ts -> /api
import { Hono } from 'hono'

const app = new Hono()

const users = new Hono()
  .get('/users', (c) => c.json({ users: [] }))
  .get('/users/:id', (c) => c.json({ id: c.req.param('id') }))

const posts = new Hono()
  .get('/posts', (c) => c.json({ posts: [] }))
  .get('/posts/:id', (c) => c.json({ id: c.req.param('id') }))

app.route('/', users)
app.route('/', posts)

export default app`}
          jsCode={`// src/app/api/index.js -> /api
import { Hono } from 'hono'

const app = new Hono()

const users = new Hono()
  .get('/users', (c) => c.json({ users: [] }))
  .get('/users/:id', (c) => c.json({ id: c.req.param('id') }))

const posts = new Hono()
  .get('/posts', (c) => c.json({ posts: [] }))
  .get('/posts/:id', (c) => c.json({ id: c.req.param('id') }))

app.route('/', users)
app.route('/', posts)

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
      </Section>
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