// src/app/docs/loaders.tsx
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
  { id: 'overview', label: 'Overview' },
  { id: 'creating-loader', label: 'Creating a Loader' },
  { id: 'accessing-data', label: 'Accessing Loader Data' },
  { id: 'dynamic-params', label: 'Dynamic Params in Loaders' },
  { id: 'error-handling', label: 'Error Handling' },
  { id: 'client-only', label: 'Client-only Routes' },
  { id: 'complete-example', label: 'Complete Example' },
]

function Content() {
  const lang = useDocLang()
  const e = lang === 'js' ? 'jsx' : 'tsx'

  return (
    <>
      <Section id="overview" title="Overview">
        <P>
          A loader is a function exported from a page that fetches data before the page renders.
          React Router runs it, resolves the result, and hands it to the page via{' '}
          <C>useLoaderData()</C>.
        </P>
        <RouteVisual
          fileWidth={280}
          rows={[
            { n: 'app' },
            { n: 'users', d: 1 },
            { n: `page.${e}`, d: 2, dot: true, url: '/users' },
          ]}
        />
        <Table
          headers={['Export', 'Type', 'When it runs']}
          rows={[
            ['loader', 'function (async or sync)', 'Before the route renders'],
            ['action', 'function (async or sync)', 'On form submission or POST/PUT/DELETE'],
            ['shouldRevalidate', 'function', 'Before a revalidation'],
            ['handle', 'object', 'Static route metadata for useMatches()'],
          ]}
        />
        <Callout>
          Data exports are detected statically at build time. A page with a loader is marked{' '}
          <C>clientOnly</C> and gets a shell page during static generation instead of
          server-rendered HTML.
        </Callout>
      </Section>

      <Section id="creating-loader" title="Creating a Loader">
        <P>
          Export a function called <C>loader</C> from your page. It can be sync or async. Return
          any serializable value.
        </P>
        <CodeBlock
          filename={`src/app/users/page.${e}`}
          tsCode={`export async function loader() {
  const res = await fetch('/api/users')
  return res.json()
}

export default function Users() {
  const users = useLoaderData()
  return (
    <ul>
      {users.map((u) => (
        <li key={u.id}>{u.name}</li>
      ))}
    </ul>
  )
}`}
          jsCode={`export async function loader() {
  const res = await fetch('/api/users')
  return res.json()
}

export default function Users() {
  const users = useLoaderData()
  return (
    <ul>
      {users.map((u) => (
        <li key={u.id}>{u.name}</li>
      ))}
    </ul>
  )
}`}
        />
      </Section>

      <Section id="accessing-data" title="Accessing Loader Data">
        <P>
          Call <C>useLoaderData()</C> inside the page component to access the resolved value.
        </P>
        <Table
          headers={['Hook', 'What it returns']}
          rows={[
            ['useLoaderData()', "The route's loader return value"],
            ['useRouteLoaderData(id)', "Another route's loader value by route id"],
            ['useNavigation()', 'The current navigation state (idle, loading, submitting)'],
          ]}
        />
        <P>
          <C>useLoaderData()</C> is auto-imported from <C>react-router-dom</C> inside files under{' '}
          <C>src/app/</C>. In MDX files you must import it explicitly.
        </P>
      </Section>

      <Section id="dynamic-params" title="Dynamic Params in Loaders">
        <P>
          The <C>loader</C> function receives an object containing the request and the route
          params. You can read dynamic segments directly inside the loader before fetching data.
        </P>
        <CodeBlock
          filename={`src/app/blog/[slug]/page.${e}`}
          tsCode={`export async function loader({ params }: { params: { slug: string } }) {
  const res = await fetch(\`/api/posts/\${params.slug}\`)
  if (!res.ok) throw new Error('Post not found')
  return res.json()
}

export default function BlogPost() {
  const post = useLoaderData()
  return <h1>{post.title}</h1>
}`}
          jsCode={`export async function loader({ params }) {
  const res = await fetch(\`/api/posts/\${params.slug}\`)
  if (!res.ok) throw new Error('Post not found')
  return res.json()
}

export default function BlogPost() {
  const post = useLoaderData()
  return <h1>{post.title}</h1>
}`}
        />
        <Callout>
          For catch-all routes like <C>[...slug]</C>, the value is exposed under{' '}
          <C>params['*']</C>, not the name written in the folder.
        </Callout>
      </Section>

      <Section id="error-handling" title="Error Handling">
        <P>
          A thrown error inside a loader is caught by the nearest <C>{`error.${e}`}</C> boundary in
          the segment chain. Use the same error UI you would use for render errors.
        </P>
        <CodeBlock
          filename={`src/app/users/page.${e}`}
          tsCode={`export async function loader() {
  const res = await fetch('/api/users')
  if (!res.ok) {
    throw new Error('Failed to load users')
  }
  return res.json()
}`}
          jsCode={`export async function loader() {
  const res = await fetch('/api/users')
  if (!res.ok) {
    throw new Error('Failed to load users')
  }
  return res.json()
}`}
        />
      </Section>

      <Section id="client-only" title="Client-only Routes">
        <P>
          Routes with data exports are marked <C>clientOnly</C>. During <C>vite build</C>, the
          build tool writes a shell page for them instead of a server-rendered page, because
          React Router does not run lazy loaders during static rendering.
        </P>
        <Table
          headers={['Route type', 'SSG output', 'What renders on first visit']}
          rows={[
            ['Static, no loader', 'Full pre-rendered HTML', 'Instant paint from HTML'],
            ['Static, with loader', 'Shell page (empty #root)', 'Loading UI, then client render'],
            ['Dynamic, with loader', 'Shell page (empty #root)', 'Loading UI, then client render'],
          ]}
        />
        <Callout>
          To get real HTML for a route with a loader, list its URLs in <C>staticParams</C>. Those
          URLs are rendered even when the route is client-only.
        </Callout>
      </Section>

      <Section id="complete-example" title="Complete Example">
        <RouteVisual
          fileWidth={280}
          rows={[
            { n: 'app' },
            { n: 'users', d: 1 },
            { n: `layout.${e}`, d: 2 },
            { n: `page.${e}`, d: 2, dot: true, url: '/users' },
            { n: `error.${e}`, d: 2 },
            { n: '[id]', d: 2 },
            { n: `page.${e}`, d: 3, dot: true, url: '/users/:id' },
          ]}
        />
        <CodeBlock
          filename={`src/app/users/[id]/page.${e}`}
          tsCode={`export async function loader({ params }: { params: { id: string } }) {
  const res = await fetch(\`/api/users/\${params.id}\`)
  if (!res.ok) throw new Error('User not found')
  return res.json()
}

export default function UserDetail() {
  const user = useLoaderData()
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  )
}`}
          jsCode={`export async function loader({ params }) {
  const res = await fetch(\`/api/users/\${params.id}\`)
  if (!res.ok) throw new Error('User not found')
  return res.json()
}

export default function UserDetail() {
  const user = useLoaderData()
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  )
}`}
        />
      </Section>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link to="/docs/actions" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Actions</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Handle form submissions and mutations.</p>
        </Link>
        <Link to="/docs/accessing-route-data" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Accessing Route Data</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Access loader data and navigation state.</p>
        </Link>
        <Link to="/docs/error-boundaries" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Error Boundaries</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Catch render errors and show a fallback UI.</p>
        </Link>
        <Link to="/docs/load" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Loading UI</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Show a fallback while pages and layouts load.</p>
        </Link>
        <Link to="/docs/dynamic-routes" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Dynamic Routes</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Match URL segments with dynamic parameters and catch-alls.</p>
        </Link>
        <Link to="/docs/static-export" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Static Export</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">How every route is pre-rendered to HTML at build time.</p>
        </Link>
      </div>
    </>
  )
}

export default function LoadersPage() {
  return (
    <DocPage
      title="Loaders"
      badge="Experimental"
      description="Fetch data before a route renders with loader exports and useLoaderData()."
      url="https://bini.js.org/docs/loaders"
      editUrl="https://github.com/Binidu01/bini-official/edit/main/src/app/docs/loaders.tsx"
      toc={TOC_ITEMS}
      prev={{ to: '/docs/notfound', title: 'Not Found (404)' }}
      next={{ to: '/docs/actions', title: 'Actions' }}
    >
      <Content />
    </DocPage>
  )
}