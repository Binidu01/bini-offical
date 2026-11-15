// src/app/docs/api-plain.tsx
import { Link } from 'react-router-dom'

import {
  C,
  Callout,
  CodeBlock,
  DocPage,
  H3,
  P,
  Section,
  Table,
  useDocLang,
} from '../../components/DocBlocks'
import { RouteVisual } from '../../components/DocVisuals'
import type { TocItem } from '../../components/TableOfContents'

const TOC_ITEMS: TocItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'basic-handler', label: 'Basic Handler' },
  { id: 'route-mapping', label: 'Route Mapping' },
  { id: 'request-context', label: 'Request Context' },
  { id: 'handling-methods', label: 'Handling HTTP Methods' },
  { id: 'per-method-exports', label: 'Per-Method Exports' },
  { id: 'reading-request', label: 'Reading Request Data' },
  { id: 'sending-responses', label: 'Sending Responses' },
  { id: 'dynamic-routes', label: 'Dynamic Routes' },
  { id: 'catch-all', label: 'Catch-all Routes' },
  { id: 'environment-variables', label: 'Environment Variables' },
  { id: 'error-handling', label: 'Error Handling' },
  { id: 'when-to-use', label: 'When to Use Plain Handlers' },
]

function Content() {
  const lang = useDocLang()
  const e = lang === 'js' ? 'js' : 'ts'

  return (
    <>
      <Section id="overview" title="Overview">
        <P>
          Plain function handlers are the simplest way to create API routes. Export a function from
          a file in <C>src/app/api/</C> and it becomes an endpoint at <C>/api/*</C>. Ideal for
          single endpoints that do not need Hono middleware or nested routing.
        </P>
        <Callout>
          <strong>File-based routing:</strong> <C>src/app/api/hello.ts</C> is served at{' '}
          <C>/api/hello</C>. There is no bare <C>/api</C> root route.
        </Callout>
      </Section>

      <Section id="basic-handler" title="Basic Handler">
        <P>
          Export a default function that receives a <C>Request</C> and a context object. The file
          path sets the route - the function name does not matter.
        </P>
        <CodeBlock
          filename={`src/app/api/hello.${e}`}
          tsCode={`export default function handler(request: Request) {
  return Response.json({ message: 'hello', method: request.method })
}`}
          jsCode={`export default function handler(request) {
  return Response.json({ message: 'hello', method: request.method })
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
            { n: `users.${e}`, d: 2, fn: true, url: '/api/users' },
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
            [`src/app/api/users.${e}`, '/api/users'],
            [`src/app/api/posts/index.${e}`, '/api/posts'],
            [`src/app/api/posts/[id].${e}`, '/api/posts/:id'],
            [`src/app/api/[...catch].${e}`, '/api/*'],
          ]}
        />
      </Section>

      <Section id="request-context" title="Request Context">
        <P>
          Every handler receives a second argument with the route context. Use it for path params,
          query parameters, and runtime env bindings.
        </P>
        <Table
          headers={['Field', 'Type', 'Description']}
          rows={[
            ['params', 'object', 'Dynamic route params (e.g. { id: "123" })'],
            ['searchParams', 'URLSearchParams', 'Query string parameters'],
            ['env', 'any', 'Runtime env bindings (or process.env on Node)'],
            ['waitUntil?', 'function', 'Extends the request lifetime for background work'],
          ]}
        />
      </Section>

      <Section id="handling-methods" title="Handling HTTP Methods">
        <P>
          Branch on <C>request.method</C> for different verbs, or export per-method handlers (
          <C>GET</C>, <C>POST</C>, etc.) instead of a default function.
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

      <Section id="per-method-exports" title="Per-Method Exports">
        <P>
          Instead of one default function that branches on <C>request.method</C>, export a separate
          function for each HTTP verb. Each one is a plain function that receives the same{' '}
          <C>Request</C> and context object, and returns a <C>Response</C>.
        </P>
        <CodeBlock
          filename={`src/app/api/posts.${e}`}
          tsCode={`export function GET(request: Request) {
  return Response.json({ posts: [] })
}

export async function POST(request: Request) {
  const body = await request.json()
  return Response.json({ message: 'Post created', body }, { status: 201 })
}

export function DELETE(request: Request) {
  return Response.json({ message: 'Post deleted' })
}`}
          jsCode={`export function GET(request) {
  return Response.json({ posts: [] })
}

export async function POST(request) {
  const body = await request.json()
  return Response.json({ message: 'Post created', body }, { status: 201 })
}

export function DELETE(request) {
  return Response.json({ message: 'Post deleted' })
}`}
        />
        <P>
          The context object is passed as the second argument, exactly like a default function:
        </P>
        <CodeBlock
          filename={`src/app/api/posts/[id].${e}`}
          tsCode={`export function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  return Response.json({ id: params.id })
}`}
          jsCode={`export function GET(request, { params }) {
  return Response.json({ id: params.id })
}`}
        />
        <Table
          headers={['Behavior', 'Details']}
          rows={[
            ['Supported exports', 'GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS'],
            ['Unhandled methods', 'Return 405 with an Allow header'],
            ['HEAD fallback', 'Falls back to GET when no HEAD export exists'],
            ['Precedence', 'Method exports take precedence over a default export'],
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
          Path params are available in the context object, not a header. Use{' '}
          <C>{`{ params }`}</C> as the second argument:
        </P>
        <CodeBlock
          filename={`src/app/api/posts/[id].${e}`}
          tsCode={`export default function handler(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (request.method === 'GET') {
    return Response.json({ id: params.id, title: \`Post \${params.id}\` })
  }

  return Response.json({ error: 'Method not allowed' }, { status: 405 })
}`}
          jsCode={`export default function handler(request, { params }) {
  if (request.method === 'GET') {
    return Response.json({ id: params.id, title: \`Post \${params.id}\` })
  }

  return Response.json({ error: 'Method not allowed' }, { status: 405 })
}`}
        />
      </Section>

      <Section id="catch-all" title="Catch-all Routes">
        <P>
          <C>[...catch]</C> handles unmatched <C>/api/*</C> paths. Catch-all values are available
          under <C>params['*']</C> and under the folder name.
        </P>
        <CodeBlock
          filename={`src/app/api/[...catch].${e}`}
          tsCode={`export default function handler(
  request: Request,
  { params }: { params: { '*': string } }
) {
  console.warn('Unmatched API route', {
    method: request.method,
    path: params['*'],
  })

  return Response.json(
    {
      error: 'Not Found',
      message: 'The requested endpoint does not exist',
    },
    { status: 404, headers: { 'Cache-Control': 'no-store' } }
  )
}`}
          jsCode={`export default function handler(request, { params }) {
  console.warn('Unmatched API route', {
    method: request.method,
    path: params['*'],
  })

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
          Access environment variables directly from the <C>env</C> object in the request context.
          This ensures your code works across all deployment platforms.
        </P>
        <CodeBlock
          filename={`src/app/api/config.${e}`}
          tsCode={`export default function handler(
  request: Request,
  { env }: { env: Record<string, string | undefined> }
) {
  const apiKey = env.MY_API_KEY
  const debug = env.DEBUG_MODE ?? 'false'
  const appName = env.APP_NAME ?? 'Bini.js'

  if (!apiKey) {
    return Response.json({ error: 'Missing MY_API_KEY' }, { status: 500 })
  }

  return Response.json({ appName, debug: debug === 'true', hasKey: !!apiKey })
}`}
          jsCode={`export default function handler(request, { env }) {
  const apiKey = env.MY_API_KEY
  const debug = env.DEBUG_MODE ?? 'false'
  const appName = env.APP_NAME ?? 'Bini.js'

  if (!apiKey) {
    return Response.json({ error: 'Missing MY_API_KEY' }, { status: 500 })
  }

  return Response.json({ appName, debug: debug === 'true', hasKey: !!apiKey })
}`}
        />
        <Callout>
          On Node, <C>env</C> is backed by <C>process.env</C>. On edge platforms, it reads the
          runtime bindings.
        </Callout>
      </Section>

      <Section id="error-handling" title="Error Handling">
        <P>Validate input and catch unexpected failures:</P>
        <CodeBlock
          filename={`src/app/api/safe.${e}`}
          tsCode={`export default async function handler(
  request: Request,
  { env }: { env: Record<string, string | undefined> }
) {
  try {
    const body = await request.json()

    if (!body.email) {
      return Response.json({ error: 'Email is required' }, { status: 400 })
    }

    return Response.json({ success: true })
  } catch (error: any) {
    const isDev = env.NODE_ENV === 'development'
    return Response.json(
      {
        error: 'Internal Server Error',
        ...(isDev && { details: error.message }),
      },
      { status: 500 }
    )
  }
}`}
          jsCode={`export default async function handler(request, { env }) {
  try {
    const body = await request.json()

    if (!body.email) {
      return Response.json({ error: 'Email is required' }, { status: 400 })
    }

    return Response.json({ success: true })
  } catch (error) {
    const isDev = env.NODE_ENV === 'development'
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
            ['Method-based dispatch without branching', 'Plain handler (per-method exports)'],
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

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link to="/docs/api-routes" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">API Routes Overview</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Files under app/api/ map to /api/*.</p>
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