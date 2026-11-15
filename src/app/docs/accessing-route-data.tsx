// src/app/docs/accessing-route-data.tsx
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
  { id: 'useloaderdata', label: 'useLoaderData' },
  { id: 'useactiondata', label: 'useActionData' },
  { id: 'userouteloaderdata', label: 'useRouteLoaderData' },
  { id: 'usematches', label: 'useMatches' },
  { id: 'usenavigation', label: 'useNavigation' },
]

function Content() {
  const lang = useDocLang()
  const e = lang === 'js' ? 'jsx' : 'tsx'

  return (
    <>
      <Section id="overview" title="Overview">
        <P>
          Once a loader or action runs, React Router stores the result on the matching route. You
          read it with a hook. Each hook is designed for a specific scope - the current route,
          another route by id, the whole matched chain, or the current navigation state.
        </P>
        <Table
          headers={['Hook', 'Scope', 'Common use']}
          rows={[
            ['useLoaderData()', 'Current route', 'Page-level data from a loader'],
            ['useActionData()', 'Current route', 'Form submission result'],
            ['useRouteLoaderData(id)', 'A specific route by id', 'Parent loader data in a child'],
            ['useMatches()', 'Every matched route', 'Breadcrumbs, analytics'],
            ['useNavigation()', 'Global navigation state', 'Pending/loading states'],
          ]}
        />
        <Callout>
          All of these hooks are auto-imported from <C>react-router-dom</C> inside files under{' '}
          <C>src/app/</C>. In <C>.mdx</C> and <C>.md</C> files you must import them explicitly.
        </Callout>
      </Section>

      <Section id="useloaderdata" title="useLoaderData">
        <P>
          Returns the resolved value of the current route's <C>loader</C>. Use this inside the page
          component that defines the loader.
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

      <Section id="useactiondata" title="useActionData">
        <P>
          Returns the resolved value of the current route's <C>action</C>. It is <C>undefined</C>{' '}
          until the action has run at least once.
        </P>
        <CodeBlock
          filename={`src/app/contact/page.${e}`}
          tsCode={`import { Form } from 'react-router-dom'

export async function action({ request }: { request: Request }) {
  const formData = await request.formData()
  const email = formData.get('email')
  return { ok: true, email }
}

export default function Contact() {
  const result = useActionData()
  return (
    <Form method="post">
      <input name="email" type="email" required />
      <button type="submit">Send</button>
      {result?.ok && <p>Thanks, {result.email}!</p>}
    </Form>
  )
}`}
          jsCode={`import { Form } from 'react-router-dom'

export async function action({ request }) {
  const formData = await request.formData()
  const email = formData.get('email')
  return { ok: true, email }
}

export default function Contact() {
  const result = useActionData()
  return (
    <Form method="post">
      <input name="email" type="email" required />
      <button type="submit">Send</button>
      {result?.ok && <p>Thanks, {result.email}!</p>}
    </Form>
  )
}`}
        />
      </Section>

      <Section id="userouteloaderdata" title="useRouteLoaderData">
        <P>
          Returns the loader value of a route by its route id. Use this in a child component that
          needs the loader data from a parent layout without re-fetching it.
        </P>
        <RouteVisual
          fileWidth={280}
          rows={[
            { n: 'app' },
            { n: 'dashboard', d: 1 },
            { n: `layout.${e}`, d: 2 },
            { n: 'settings', d: 2 },
            { n: `page.${e}`, d: 3, dot: true, url: '/dashboard/settings' },
          ]}
        />
        <CodeBlock
          filename={`src/app/dashboard/settings/page.${e}`}
          tsCode={`export default function Settings() {
  // Route ids follow the file path inside src/app
  const data = useRouteLoaderData('dashboard')
  return <p>Welcome, {data?.user.name}</p>
}`}
          jsCode={`export default function Settings() {
  // Route ids follow the file path inside src/app
  const data = useRouteLoaderData('dashboard')
  return <p>Welcome, {data?.user.name}</p>
}`}
        />
        <Callout>
          The route id is derived from the file path. A loader exported from{' '}
          <C>{`src/app/dashboard/layout.${e}`}</C> is available under the id <C>dashboard</C>.
        </Callout>
      </Section>

      <Section id="usematches" title="useMatches">
        <P>
          Returns an array of every route in the current matched chain, each with its{' '}
          <C>handle</C> and <C>data</C>. Use this for breadcrumbs, analytics, or any component that
          needs to know the full URL hierarchy.
        </P>
        <CodeBlock
          filename={`src/app/blog/[slug]/page.${e}`}
          tsCode={`export const handle = { breadcrumb: 'Post' }

export async function loader() {
  const res = await fetch('/api/post')
  return res.json()
}

export default function Post() {
  const matches = useMatches()
  const crumbs = matches.filter((m) => m.handle?.breadcrumb)
  return (
    <nav>
      {crumbs.map((m) => (
        <span key={m.id}>{m.handle.breadcrumb}</span>
      ))}
    </nav>
  )
}`}
          jsCode={`export const handle = { breadcrumb: 'Post' }

export async function loader() {
  const res = await fetch('/api/post')
  return res.json()
}

export default function Post() {
  const matches = useMatches()
  const crumbs = matches.filter((m) => m.handle?.breadcrumb)
  return (
    <nav>
      {crumbs.map((m) => (
        <span key={m.id}>{m.handle.breadcrumb}</span>
      ))}
    </nav>
  )
}`}
        />
      </Section>

      <Section id="usenavigation" title="useNavigation">
        <P>
          Returns the current global navigation state. Useful for disabling buttons during a
          submission or showing a top-level loading bar.
        </P>
        <Table
          headers={['State', 'Meaning']}
          rows={[
            ['idle', 'No navigation is happening'],
            ['loading', 'A loader is running for the target route'],
            ['submitting', 'An action is running (form submission)'],
          ]}
        />
        <CodeBlock
          filename={`src/app/contact/page.${e}`}
          tsCode={`import { Form } from 'react-router-dom'

export default function Contact() {
  const navigation = useNavigation()
  const submitting = navigation.state === 'submitting'

  return (
    <Form method="post">
      <input name="email" type="email" required />
      <button type="submit" disabled={submitting}>
        {submitting ? 'Sending…' : 'Send'}
      </button>
    </Form>
  )
}`}
          jsCode={`import { Form } from 'react-router-dom'

export default function Contact() {
  const navigation = useNavigation()
  const submitting = navigation.state === 'submitting'

  return (
    <Form method="post">
      <input name="email" type="email" required />
      <button type="submit" disabled={submitting}>
        {submitting ? 'Sending…' : 'Send'}
      </button>
    </Form>
  )
}`}
        />
      </Section>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link to="/docs/loaders" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Loaders</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Fetch data before a route renders.</p>
        </Link>
        <Link to="/docs/actions" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Actions</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Handle form submissions and mutations.</p>
        </Link>
        <Link to="/docs/error-boundaries" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Error Boundaries</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Catch render errors and show a fallback UI.</p>
        </Link>
        <Link to="/docs/load" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Loading UI</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Show a fallback while pages and layouts load.</p>
        </Link>
        <Link to="/docs/layouts-and-pages" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Layouts and Pages</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Create your first pages and wrap them in shared layouts.</p>
        </Link>
        <Link to="/docs/deploying" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Deployment</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Deploy to Node, Vercel, Netlify, Cloudflare, or Deno, or build native apps in CI.</p>
        </Link>
      </div>
    </>
  )
}

export default function AccessingRouteDataPage() {
  return (
    <DocPage
      title="Accessing Route Data"
      badge="Experimental"
      description="Read loader, action, and navigation data with the React Router data hooks."
      url="https://bini.js.org/docs/accessing-route-data"
      editUrl="https://github.com/Binidu01/bini-official/edit/main/src/app/docs/accessing-route-data.tsx"
      toc={TOC_ITEMS}
      prev={{ to: '/docs/actions', title: 'Actions' }}
      next={{ to: '/docs/metadata', title: 'Metadata' }}
    >
      <Content />
    </DocPage>
  )
}