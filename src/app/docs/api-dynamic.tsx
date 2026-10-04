// src/app/docs/api-dynamic.tsx
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
  { id: 'file-structure', label: 'File Structure' },
  { id: 'single-parameter', label: 'Single Dynamic Parameter' },
  { id: 'multiple-parameters', label: 'Multiple Dynamic Parameters' },
  { id: 'catch-all-routes', label: 'Catch-all Routes' },
  { id: 'optional-catch-all', label: 'Optional Catch-all' },
  { id: 'nested-dynamic', label: 'Nested Dynamic Routes' },
  { id: 'query-parameters', label: 'Query Parameters' },
  { id: 'route-priority', label: 'Route Priority' },
  { id: 'complete-example', label: 'Complete Example' },
]

function VisualStructure({ ext }: { ext: string }) {
  return (
    <RouteVisual
      fileWidth={300}
      rows={[
        { n: 'app' },
        { n: 'api', d: 1 },
        { n: 'posts', d: 2 },
        { n: `[id].${ext}`, d: 3, fn: true, dot: true, url: '/api/posts/:id' },
        { n: 'users', d: 2 },
        { n: '[userId]', d: 3 },
        { n: `settings.${ext}`, d: 4, fn: true, dot: true, url: '/api/users/:userId/settings' },
        { n: 'files', d: 2 },
        { n: `[...path].${ext}`, d: 3, fn: true, dot: true, url: '/api/files/*' },
        { n: `[...catch].${ext}`, d: 2, fn: true, dot: true, url: '/api/*' },
      ]}
    />
  )
}

function VisualPriority({ ext }: { ext: string }) {
  return (
    <RouteVisual
      fileWidth={280}
      rows={[
        { n: 'app' },
        { n: 'api', d: 1 },
        { n: 'posts', d: 2 },
        { n: `featured.${ext}`, d: 3, fn: true, url: '/api/posts/featured' },
        { n: `[id].${ext}`, d: 3, fn: true, dot: true, url: '/api/posts/:id' },
        { n: `[...slug].${ext}`, d: 3, fn: true, url: '/api/posts/*' },
      ]}
    />
  )
}

function Content() {
  const lang = useDocLang()
  const s = lang === 'js' ? 'js' : 'ts'

  return (
    <>
      <Section id="file-structure" title="File Structure">
        <P>
          Dynamic API routes match patterns instead of exact paths. Use square brackets in file or
          folder names - the file path determines the route.
        </P>
        <Callout>
          <strong>File-based routing:</strong> Like all Bini.js API routes, dynamic routes follow
          file-based routing. There are no root <C>/</C> API routes - the filename becomes the route
          segment. Write your Hono routes <strong>without</strong> the <C>/api</C> prefix.
        </Callout>
        <VisualStructure ext={s} />
        <Table
          headers={['Pattern', 'File/Folder Name', 'Matches']}
          rows={[
            ['[id]', 'Single dynamic segment', '/api/posts/123, /api/posts/abc'],
            [
              '[category]/[slug]',
              'Multiple dynamic segments',
              '/api/posts/tech/hello-world',
            ],
            ['[...path]', 'Catch-all (required)', '/api/files/a, /api/files/a/b/c'],
            ['[[...slug]]', 'Catch-all (optional)', '/api/docs, /api/docs/a/b'],
          ]}
        />
      </Section>

      <Section id="single-parameter" title="Single Dynamic Parameter">
        <P>
          Use <C>[name]</C> in the filename for a single dynamic segment:
        </P>
        <H3 className="mb-3">With Hono</H3>
        <CodeBlock
          filename={`src/app/api/posts/[id].${s}`}
          tsCode={`// src/app/api/posts/[id].ts -> /api/posts/:id
import { Hono } from 'hono'

const app = new Hono()

app.get('/posts/:id', (c) => {
  const id = c.req.param('id')
  return c.json({ id, title: \`Post \${id}\` })
})

app.put('/posts/:id', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()
  return c.json({ id, ...body })
})

export default app`}
          jsCode={`// src/app/api/posts/[id].js -> /api/posts/:id
import { Hono } from 'hono'

const app = new Hono()

app.get('/posts/:id', (c) => {
  const id = c.req.param('id')
  return c.json({ id, title: \`Post \${id}\` })
})

app.put('/posts/:id', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()
  return c.json({ id, ...body })
})

export default app`}
        />
        <H3 className="mb-3 mt-8">With Plain Function</H3>
        <CodeBlock
          filename={`src/app/api/posts/[id].${s}`}
          tsCode={`// src/app/api/posts/[id].ts -> /api/posts/:id
export default async function handler(request: Request) {
  const paramsHeader = request.headers.get('x-bini-params')
  const params = paramsHeader ? JSON.parse(paramsHeader) : {}
  const id = params.id

  if (request.method === 'GET') {
    return Response.json({ id, title: \`Post \${id}\` })
  }

  return Response.json({ error: 'Method not allowed' }, { status: 405 })
}`}
          jsCode={`// src/app/api/posts/[id].js -> /api/posts/:id
export default async function handler(request) {
  const paramsHeader = request.headers.get('x-bini-params')
  const params = paramsHeader ? JSON.parse(paramsHeader) : {}
  const id = params.id

  if (request.method === 'GET') {
    return Response.json({ id, title: \`Post \${id}\` })
  }

  return Response.json({ error: 'Method not allowed' }, { status: 405 })
}`}
        />
      </Section>

      <Section id="multiple-parameters" title="Multiple Dynamic Parameters">
        <P>Combine multiple dynamic segments in a single route:</P>
        <CodeBlock
          filename={`src/app/api/posts/[category]/[slug].${s}`}
          tsCode={`// src/app/api/posts/[category]/[slug].ts -> /api/posts/:category/:slug
import { Hono } from 'hono'

const app = new Hono()

app.get('/posts/:category/:slug', (c) => {
  const category = c.req.param('category')
  const slug = c.req.param('slug')
  return c.json({ category, slug })
})

export default app`}
          jsCode={`// src/app/api/posts/[category]/[slug].js -> /api/posts/:category/:slug
import { Hono } from 'hono'

const app = new Hono()

app.get('/posts/:category/:slug', (c) => {
  const category = c.req.param('category')
  const slug = c.req.param('slug')
  return c.json({ category, slug })
})

export default app`}
        />
        <Table
          headers={['URL', 'params']}
          rows={[
            ['/api/posts/tech/hello-world', '{ category: "tech", slug: "hello-world" }'],
            ['/api/posts/lifestyle/tips', '{ category: "lifestyle", slug: "tips" }'],
          ]}
        />
      </Section>

      <Section id="catch-all-routes" title="Catch-all Routes">
        <P>
          Use <C>[...name]</C> in the filename to match any number of segments:
        </P>
        <CodeBlock
          filename={`src/app/api/files/[...path].${s}`}
          tsCode={`// src/app/api/files/[...path].ts -> /api/files/*
import { Hono } from 'hono'

const app = new Hono()

app.all('/files/:path*', (c) => {
  const path = c.req.param('path') || ''
  return c.json({ path, segments: path.split('/').filter(Boolean) })
})

export default app`}
          jsCode={`// src/app/api/files/[...path].js -> /api/files/*
import { Hono } from 'hono'

const app = new Hono()

app.all('/files/:path*', (c) => {
  const path = c.req.param('path') || ''
  return c.json({ path, segments: path.split('/').filter(Boolean) })
})

export default app`}
        />
        <Table
          headers={['URL', 'path value']}
          rows={[
            ['/api/files', ''],
            ['/api/files/images', 'images'],
            ['/api/files/images/2024', 'images/2024'],
            ['/api/files/docs/api/reference', 'docs/api/reference'],
          ]}
        />
        <H3 className="mb-3 mt-8">Global Catch-all</H3>
        <CodeBlock
          filename={`src/app/api/[...catch].${s}`}
          tsCode={`// src/app/api/[...catch].ts -> /api/*
import { Hono } from 'hono'

const app = new Hono()

app.all('*', (c) => {
  return c.json({ error: 'Not Found', path: c.req.path }, 404)
})

export default app`}
          jsCode={`// src/app/api/[...catch].js -> /api/*
import { Hono } from 'hono'

const app = new Hono()

app.all('*', (c) => {
  return c.json({ error: 'Not Found', path: c.req.path }, 404)
})

export default app`}
        />
      </Section>

      <Section id="optional-catch-all" title="Optional Catch-all">
        <P>
          Use <C>[[...name]]</C> to make the catch-all optional:
        </P>
        <CodeBlock
          filename={`src/app/api/docs/[[...slug]].${s}`}
          tsCode={`// src/app/api/docs/[[...slug]].ts -> /api/docs or /api/docs/a/b
import { Hono } from 'hono'

const app = new Hono()

app.get('/docs/:slug*?', (c) => {
  const slug = c.req.param('slug')

  if (!slug) {
    return c.json({ message: 'Documentation home' })
  }

  return c.json({ path: slug.split('/').filter(Boolean) })
})

export default app`}
          jsCode={`// src/app/api/docs/[[...slug]].js -> /api/docs or /api/docs/a/b
import { Hono } from 'hono'

const app = new Hono()

app.get('/docs/:slug*?', (c) => {
  const slug = c.req.param('slug')

  if (!slug) {
    return c.json({ message: 'Documentation home' })
  }

  return c.json({ path: slug.split('/').filter(Boolean) })
})

export default app`}
        />
        <Table
          headers={['URL', 'slug value']}
          rows={[
            ['/api/docs', 'undefined (home page)'],
            ['/api/docs/getting-started', 'getting-started'],
            ['/api/docs/api/reference', 'api/reference'],
          ]}
        />
      </Section>

      <Section id="nested-dynamic" title="Nested Dynamic Routes">
        <P>Combine static and dynamic segments for complex routing:</P>
        <CodeBlock
          filename={`src/app/api/orgs/[orgId]/repos/[repoId]/issues/[issueId].${s}`}
          tsCode={`// src/app/api/orgs/[orgId]/repos/[repoId]/issues/[issueId].ts
// -> /api/orgs/:orgId/repos/:repoId/issues/:issueId
import { Hono } from 'hono'

const app = new Hono()

app.get('/orgs/:orgId/repos/:repoId/issues/:issueId', (c) => {
  const { orgId, repoId, issueId } = c.req.param()
  return c.json({ orgId, repoId, issueId })
})

export default app`}
          jsCode={`// src/app/api/orgs/[orgId]/repos/[repoId]/issues/[issueId].js
// -> /api/orgs/:orgId/repos/:repoId/issues/:issueId
import { Hono } from 'hono'

const app = new Hono()

app.get('/orgs/:orgId/repos/:repoId/issues/:issueId', (c) => {
  const { orgId, repoId, issueId } = c.req.param()
  return c.json({ orgId, repoId, issueId })
})

export default app`}
        />
      </Section>

      <Section id="query-parameters" title="Query Parameters">
        <P>Combine dynamic path parameters with query parameters:</P>
        <CodeBlock
          filename={`src/app/api/posts/[id]/comments.${s}`}
          tsCode={`// src/app/api/posts/[id]/comments.ts -> /api/posts/:id/comments
import { Hono } from 'hono'

const app = new Hono()

app.get('/posts/:id/comments', (c) => {
  const postId = c.req.param('id')
  const page = parseInt(c.req.query('page') || '1')
  const limit = parseInt(c.req.query('limit') || '10')

  return c.json({ postId, page, limit })
})

export default app`}
          jsCode={`// src/app/api/posts/[id]/comments.js -> /api/posts/:id/comments
import { Hono } from 'hono'

const app = new Hono()

app.get('/posts/:id/comments', (c) => {
  const postId = c.req.param('id')
  const page = parseInt(c.req.query('page') || '1')
  const limit = parseInt(c.req.query('limit') || '10')

  return c.json({ postId, page, limit })
})

export default app`}
        />
      </Section>

      <Section id="route-priority" title="Route Priority">
        <P>When multiple routes could match a URL, Bini.js resolves them in this order:</P>
        <div className="mb-6 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-950">
          <ol className="list-decimal space-y-2 pl-5 text-[15px] text-neutral-600 dark:text-neutral-400">
            <li>
              <strong className="text-black dark:text-white">Static routes</strong> - exact matches
            </li>
            <li>
              <strong className="text-black dark:text-white">Dynamic single segments</strong> -{' '}
              <C>[id]</C>
            </li>
            <li>
              <strong className="text-black dark:text-white">Catch-all segments</strong> -{' '}
              <C>[...slug]</C>
            </li>
            <li>
              <strong className="text-black dark:text-white">Optional catch-all</strong> -{' '}
              <C>[[...slug]]</C>
            </li>
          </ol>
        </div>
        <VisualPriority ext={s} />
        <Callout>
          Routes are sorted by priority and then by path length (shortest first). Static routes
          always win over dynamic ones.
        </Callout>
      </Section>

      <Section id="complete-example" title="Complete Example">
        <P>A full-featured store API with dynamic routing:</P>
        <CodeBlock
          filename={`src/app/api/store/[[...path]].${s}`}
          tsCode={`// src/app/api/store/[[...path]].ts -> /api/store or /api/store/*
import { Hono } from 'hono'

const app = new Hono()
const products = new Map()

app.get('/store', (c) => c.json({ products: Array.from(products.values()) }))
app.get('/store/products', (c) => c.json({ products: Array.from(products.values()) }))
app.get('/store/products/:id', (c) => {
  const product = products.get(c.req.param('id'))
  return product ? c.json(product) : c.json({ error: 'Not found' }, 404)
})

app.post('/store/products', async (c) => {
  const body = await c.req.json()
  const id = Date.now().toString()
  const product = { id, ...body }
  products.set(id, product)
  return c.json(product, 201)
})

app.put('/store/products/:id', async (c) => {
  const id = c.req.param('id')
  if (!products.has(id)) return c.json({ error: 'Not found' }, 404)
  const product = { ...products.get(id), ...(await c.req.json()) }
  products.set(id, product)
  return c.json(product)
})

app.delete('/store/products/:id', (c) => {
  const id = c.req.param('id')
  return products.delete(id)
    ? c.json({ message: 'Deleted' })
    : c.json({ error: 'Not found' }, 404)
})

app.all('/store/*', (c) => c.json({ error: 'Not Found' }, 404))

export default app`}
          jsCode={`// src/app/api/store/[[...path]].js -> /api/store or /api/store/*
import { Hono } from 'hono'

const app = new Hono()
const products = new Map()

app.get('/store', (c) => c.json({ products: Array.from(products.values()) }))
app.get('/store/products', (c) => c.json({ products: Array.from(products.values()) }))
app.get('/store/products/:id', (c) => {
  const product = products.get(c.req.param('id'))
  return product ? c.json(product) : c.json({ error: 'Not found' }, 404)
})

app.post('/store/products', async (c) => {
  const body = await c.req.json()
  const id = Date.now().toString()
  const product = { id, ...body }
  products.set(id, product)
  return c.json(product, 201)
})

app.put('/store/products/:id', async (c) => {
  const id = c.req.param('id')
  if (!products.has(id)) return c.json({ error: 'Not found' }, 404)
  const product = { ...products.get(id), ...(await c.req.json()) }
  products.set(id, product)
  return c.json(product)
})

app.delete('/store/products/:id', (c) => {
  const id = c.req.param('id')
  return products.delete(id)
    ? c.json({ message: 'Deleted' })
    : c.json({ error: 'Not found' }, 404)
})

app.all('/store/*', (c) => c.json({ error: 'Not Found' }, 404))

export default app`}
        />
      </Section>
    </>
  )
}

export default function ApiDynamicPage() {
  return (
    <DocPage
      title="Dynamic API Routes"
      description="Create dynamic API endpoints with path parameters, catch-all routes, and optional segments."
      url="https://bini.js.org/docs/api-dynamic"
      editUrl="https://github.com/Binidu01/bini-official/edit/main/src/app/docs/api-dynamic.tsx"
      toc={TOC_ITEMS}
      prev={{ to: '/docs/api-hono', title: 'Hono Integration' }}
      next={{ to: '/docs/api-cors', title: 'CORS' }}
    >
      <Content />
    </DocPage>
  )
}