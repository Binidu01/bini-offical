// src/app/docs/api-plain.tsx
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
  { id: 'basic-handler', label: 'Basic Handler' },
  { id: 'route-mapping', label: 'Route Mapping' },
  { id: 'handling-methods', label: 'Handling HTTP Methods' },
  { id: 'reading-request', label: 'Reading Request Data' },
  { id: 'sending-responses', label: 'Sending Responses' },
  { id: 'dynamic-routes', label: 'Dynamic Routes' },
  { id: 'catch-all', label: 'Catch-all Routes' },
  { id: 'environment-variables', label: 'Environment Variables' },
  { id: 'error-handling', label: 'Error Handling' },
  { id: 'when-to-use', label: 'When to Use Plain Handlers' },
  { id: 'complete-example', label: 'Complete Example' },
]

/* ---------- content (reads the TS/JS choice from DocPage) ---------- */

function Content() {
  const lang = useDocLang()
  // API files are plain .ts / .js (no JSX)
  const e = lang === 'js' ? 'js' : 'ts'

  return (
    <>
      <div className="mb-12">
        <P>
          Plain function handlers are the simplest way to create API routes. Ideal for single
          endpoints that do not need Hono middleware or nested routing.
        </P>
        <Callout>
          <strong>File-based routing:</strong> <C>src/app/api/hello.ts</C> is served at{' '}
          <C>/api/hello</C>. There is no bare <C>/api</C> root route.
        </Callout>
      </div>

      <Section id="basic-handler" title="Basic Handler">
        <P>
          Export a default function that receives <C>Request</C>. The file path sets the route - the
          function name does not matter.
        </P>
        <CodeBlock
          filename={`src/app/api/hello.${e}`}
          tsCode={`export default function handler(req: Request) {
  return Response.json({ message: 'hello', method: req.method })
}`}
          jsCode={`export default function handler(req) {
  return Response.json({ message: 'hello', method: req.method })
}`}
        />
        <P>
          This creates <C>/api/hello</C> and responds to all HTTP methods unless you branch on{' '}
          <C>request.method</C>.
        </P>
      </Section>

      <Section id="route-mapping" title="Route Mapping">
        <P>File structure maps directly to API paths:</P>
        <RouteVisual
          fileWidth={260}
          rows={[
            { n: 'app' },
            { n: 'api', d: 1 },
            { n: `hello.${e}`, d: 2, fn: true, url: '/api/hello', dot: true },
            { n: `user.${e}`, d: 2, fn: true, url: '/api/user' },
            { n: `posts.${e}`, d: 2, fn: true, url: '/api/posts' },
            { n: 'posts', d: 2 },
            { n: `index.${e}`, d: 3, fn: true, url: '/api/posts' },
            { n: `[id].${e}`, d: 3, fn: true, url: '/api/posts/:id' },
            { n: `[...catch].${e}`, d: 2, fn: true, url: '/api/*' },
          ]}
        />
        <Table
          headers={['File Path', 'API Route']}
          rows={[
            [`src/app/api/hello.${e}`, '/api/hello'],
            [`src/app/api/user.${e}`, '/api/user'],
            [`src/app/api/posts.${e}`, '/api/posts'],
            [`src/app/api/posts/[id].${e}`, '/api/posts/:id'],
            [`src/app/api/posts/index.${e}`, '/api/posts'],
            [`src/app/api/[...catch].${e}`, '/api/*'],
          ]}
        />
      </Section>

      <Section id="handling-methods" title="Handling HTTP Methods">
        <P>
          Branch on <C>request.method</C> for different verbs:
        </P>
        <CodeBlock
          filename={`src/app/api/posts.${e}`}
          tsCode={`export default function handler(request: Request) {
  if (request.method === 'GET') {
    return Response.json({ posts: [] })
  }
  if (request.method === 'POST') {
    return Response.json({ message: 'Post created' }, { status: 201 })
  }
  if (request.method === 'PUT') {
    return Response.json({ message: 'Post updated' })
  }
  if (request.method === 'DELETE') {
    return Response.json({ message: 'Post deleted' })
  }
  return Response.json({ error: 'Method not allowed' }, { status: 405 })
}`}
          jsCode={`export default function handler(request) {
  if (request.method === 'GET') {
    return Response.json({ posts: [] })
  }
  if (request.method === 'POST') {
    return Response.json({ message: 'Post created' }, { status: 201 })
  }
  if (request.method === 'PUT') {
    return Response.json({ message: 'Post updated' })
  }
  if (request.method === 'DELETE') {
    return Response.json({ message: 'Post deleted' })
  }
  return Response.json({ error: 'Method not allowed' }, { status: 405 })
}`}
        />
        <Table
          headers={['Method', 'Typical Use']}
          rows={[
            ['GET', 'Retrieve data'],
            ['POST', 'Create new data'],
            ['PUT', 'Replace existing data'],
            ['PATCH', 'Partially update data'],
            ['DELETE', 'Remove data'],
          ]}
        />
      </Section>

      <Section id="reading-request" title="Reading Request Data">
        <P>Body, headers, and query params:</P>
        <CodeBlock
          filename={`src/app/api/echo.${e}`}
          tsCode={`export default async function handler(request: Request) {
  const body = await request.json().catch(() => null)
  const userAgent = request.headers.get('User-Agent')
  const url = new URL(request.url)
  const page = url.searchParams.get('page')

  return Response.json({
    method: request.method,
    body,
    headers: { userAgent },
    query: { page },
  })
}`}
          jsCode={`export default async function handler(request) {
  const body = await request.json().catch(() => null)
  const userAgent = request.headers.get('User-Agent')
  const url = new URL(request.url)
  const page = url.searchParams.get('page')

  return Response.json({
    method: request.method,
    body,
    headers: { userAgent },
    query: { page },
  })
}`}
        />
      </Section>

      <Section id="sending-responses" title="Sending Responses">
        <P>Common response patterns:</P>
        <CodeBlock
          filename={`src/app/api/responses.${e}`}
          tsCode={`export default function handler(request: Request) {
  // JSON
  return Response.json({ message: 'Hello JSON' })

  // Plain text
  // return new Response('Hello Text', {
  //   headers: { 'Content-Type': 'text/plain' },
  // })

  // Custom status
  // return Response.json({ message: 'Created' }, { status: 201 })

  // Redirect
  // return Response.redirect('https://example.com', 302)
}`}
          jsCode={`export default function handler(request) {
  // JSON
  return Response.json({ message: 'Hello JSON' })

  // Plain text
  // return new Response('Hello Text', {
  //   headers: { 'Content-Type': 'text/plain' },
  // })

  // Custom status
  // return Response.json({ message: 'Created' }, { status: 201 })

  // Redirect
  // return Response.redirect('https://example.com', 302)
}`}
        />
      </Section>

      <Section id="dynamic-routes" title="Dynamic Routes">
        <P>
          Path params are available via the <C>x-bini-params</C> header:
        </P>
        <CodeBlock
          filename={`src/app/api/posts/[id].${e}`}
          tsCode={`export default async function handler(request: Request) {
  const paramsHeader = request.headers.get('x-bini-params')
  let params: Record<string, string> = {}
  try {
    params = paramsHeader ? JSON.parse(paramsHeader) : {}
  } catch {
    return Response.json({ error: 'Invalid params' }, { status: 400 })
  }

  const id = params.id
  if (request.method === 'GET') {
    return Response.json({ id, title: \`Post \${id}\` })
  }

  return Response.json({ error: 'Method not allowed' }, { status: 405 })
}`}
          jsCode={`export default async function handler(request) {
  const paramsHeader = request.headers.get('x-bini-params')
  let params = {}
  try {
    params = paramsHeader ? JSON.parse(paramsHeader) : {}
  } catch {
    return Response.json({ error: 'Invalid params' }, { status: 400 })
  }

  const id = params.id
  if (request.method === 'GET') {
    return Response.json({ id, title: \`Post \${id}\` })
  }

  return Response.json({ error: 'Method not allowed' }, { status: 405 })
}`}
        />
      </Section>

      <Section id="catch-all" title="Catch-all Routes">
        <P>
          <C>[...catch]</C> handles unmatched <C>/api/*</C> paths:
        </P>
        <CodeBlock
          filename={`src/app/api/[...catch].${e}`}
          tsCode={`export default function handler(request: Request) {
  console.warn('Unmatched API route', { method: request.method })

  return Response.json(
    {
      error: 'Not Found',
      message: 'The requested endpoint does not exist',
    },
    { status: 404, headers: { 'Cache-Control': 'no-store' } }
  )
}`}
          jsCode={`export default function handler(request) {
  console.warn('Unmatched API route', { method: request.method })

  return Response.json(
    {
      error: 'Not Found',
      message: 'The requested endpoint does not exist',
    },
    { status: 404, headers: { 'Cache-Control': 'no-store' } }
  )
}`}
        />
      </Section>

      <Section id="environment-variables" title="Environment Variables">
        <P>
          Use <C>getEnv</C> and <C>requireEnv</C> from <C>bini-env</C>:
        </P>
        <CodeBlock
          filename={`src/app/api/config.${e}`}
          tsCode={`import { getEnv, requireEnv } from 'bini-env'

export default function handler(request: Request) {
  const apiKey = requireEnv(request as any, 'MY_API_KEY')
  const debug = getEnv(request as any, 'DEBUG_MODE') ?? 'false'
  const appName = getEnv(request as any, 'APP_NAME') ?? 'Bini.js'

  return Response.json({ appName, debug: debug === 'true', hasKey: !!apiKey })
}`}
          jsCode={`import { getEnv, requireEnv } from 'bini-env'

export default function handler(request) {
  const apiKey = requireEnv(request, 'MY_API_KEY')
  const debug = getEnv(request, 'DEBUG_MODE') ?? 'false'
  const appName = getEnv(request, 'APP_NAME') ?? 'Bini.js'

  return Response.json({ appName, debug: debug === 'true', hasKey: !!apiKey })
}`}
        />
        <Table
          headers={['Function', 'Returns', 'Behavior']}
          rows={[
            ['getEnv(ctx, key)', 'string | undefined', 'Undefined if missing - use ?? for defaults'],
            ['requireEnv(ctx, key)', 'string', 'Throws if missing or empty'],
          ]}
        />
      </Section>

      <Section id="error-handling" title="Error Handling">
        <P>Validate input and catch unexpected failures:</P>
        <CodeBlock
          filename={`src/app/api/safe.${e}`}
          tsCode={`import { getEnv } from 'bini-env'

export default async function handler(request: Request) {
  try {
    const body = await request.json()

    if (!body.email) {
      return Response.json({ error: 'Email is required' }, { status: 400 })
    }

    return Response.json({ success: true })
  } catch (error: any) {
    const isDev = getEnv(request as any, 'NODE_ENV') === 'development'
    return Response.json(
      {
        error: 'Internal Server Error',
        ...(isDev && { details: error.message }),
      },
      { status: 500 }
    )
  }
}`}
          jsCode={`import { getEnv } from 'bini-env'

export default async function handler(request) {
  try {
    const body = await request.json()

    if (!body.email) {
      return Response.json({ error: 'Email is required' }, { status: 400 })
    }

    return Response.json({ success: true })
  } catch (error) {
    const isDev = getEnv(request, 'NODE_ENV') === 'development'
    return Response.json(
      {
        error: 'Internal Server Error',
        ...(isDev && { details: error.message }),
      },
      { status: 500 }
    )
  }
}`}
        />
      </Section>

      <Section id="when-to-use" title="When to Use Plain Handlers">
        <Table
          headers={['Scenario', 'Recommendation']}
          rows={[
            ['Single endpoint with simple logic', 'Plain handler'],
            ['Quick prototypes', 'Plain handler'],
            ['Simple CRUD', 'Plain handler'],
            ['Multiple endpoints in one file', 'Use Hono'],
            ['Need middleware', 'Use Hono'],
            ['Complex routing', 'Use Hono'],
            ['Large production API surface', 'Use Hono'],
          ]}
        />
        <Callout>
          Start with plain handlers. Switch to Hono when you need middleware, nested routes, or
          larger organization.
        </Callout>
      </Section>

      <Section id="complete-example" title="Complete Example">
        <P>A small todos API with validation and method branching:</P>
        <CodeBlock
          filename={`src/app/api/todos.${e}`}
          tsCode={`import { getEnv } from 'bini-env'

const todos: { id: string; title: string; completed: boolean }[] = []

export default async function handler(request: Request) {
  const url = new URL(request.url)
  const id = url.searchParams.get('id')

  try {
    if (request.method === 'GET' && !id) {
      return Response.json(todos)
    }

    if (request.method === 'GET' && id) {
      const todo = todos.find((t) => t.id === id)
      if (!todo) {
        return Response.json({ error: 'Todo not found' }, { status: 404 })
      }
      return Response.json(todo)
    }

    if (request.method === 'POST') {
      const body = await request.json()
      if (!body.title) {
        return Response.json({ error: 'Title is required' }, { status: 400 })
      }
      const todo = {
        id: Date.now().toString(),
        title: body.title,
        completed: false,
      }
      todos.push(todo)
      return Response.json(todo, { status: 201 })
    }

    if (request.method === 'DELETE' && id) {
      const index = todos.findIndex((t) => t.id === id)
      if (index === -1) {
        return Response.json({ error: 'Todo not found' }, { status: 404 })
      }
      todos.splice(index, 1)
      return Response.json({ message: 'Todo deleted' })
    }

    return Response.json({ error: 'Method not allowed' }, { status: 405 })
  } catch (error: any) {
    const isDev = getEnv(request as any, 'NODE_ENV') === 'development'
    return Response.json(
      {
        error: 'Internal Server Error',
        ...(isDev && { details: error.message }),
      },
      { status: 500 }
    )
  }
}`}
          jsCode={`import { getEnv } from 'bini-env'

const todos = []

export default async function handler(request) {
  const url = new URL(request.url)
  const id = url.searchParams.get('id')

  try {
    if (request.method === 'GET' && !id) {
      return Response.json(todos)
    }

    if (request.method === 'GET' && id) {
      const todo = todos.find((t) => t.id === id)
      if (!todo) {
        return Response.json({ error: 'Todo not found' }, { status: 404 })
      }
      return Response.json(todo)
    }

    if (request.method === 'POST') {
      const body = await request.json()
      if (!body.title) {
        return Response.json({ error: 'Title is required' }, { status: 400 })
      }
      const todo = {
        id: Date.now().toString(),
        title: body.title,
        completed: false,
      }
      todos.push(todo)
      return Response.json(todo, { status: 201 })
    }

    if (request.method === 'DELETE' && id) {
      const index = todos.findIndex((t) => t.id === id)
      if (index === -1) {
        return Response.json({ error: 'Todo not found' }, { status: 404 })
      }
      todos.splice(index, 1)
      return Response.json({ message: 'Todo deleted' })
    }

    return Response.json({ error: 'Method not allowed' }, { status: 405 })
  } catch (error) {
    const isDev = getEnv(request, 'NODE_ENV') === 'development'
    return Response.json(
      {
        error: 'Internal Server Error',
        ...(isDev && { details: error.message }),
      },
      { status: 500 }
    )
  }
}`}
        />
      </Section>
    </>
  )
}

/* ---------- page ---------- */

export default function ApiPlainPage() {
  return (
    <DocPage
      title="Plain Function Handlers"
      description="Simple API endpoints with a default-exported Request → Response function."
      url="https://bini.js.org/docs/api-plain"
      editUrl="https://github.com/Binidu01/bini-official/edit/main/src/app/docs/api-plain.tsx"
      toc={TOC_ITEMS}
      prev={{ to: '/docs/api-routes', title: 'API Routes Overview' }}
      next={{ to: '/docs/api-hono', title: 'Hono Integration' }}
    >
      <Content />
    </DocPage>
  )
}