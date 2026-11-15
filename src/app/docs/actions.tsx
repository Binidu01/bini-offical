// src/app/docs/actions.tsx
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
  { id: 'creating-action', label: 'Creating an Action' },
  { id: 'accessing-action-data', label: 'Accessing Action Data' },
  { id: 'handling-errors', label: 'Handling Errors' },
  { id: 'progressive-enhancement', label: 'Progressive Enhancement' },
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
          An action is a function exported from a page that handles data mutations, typically from
          a <C>{'<Form>'}</C> submission. React Router runs the action, returns the result, and
          makes it available to the page via <C>useActionData()</C>.
        </P>
        <RouteVisual
          fileWidth={280}
          rows={[
            { n: 'app' },
            { n: 'contact', d: 1 },
            { n: `page.${e}`, d: 2, dot: true, url: '/contact' },
          ]}
        />
        <Table
          headers={['Export', 'Type', 'When it runs']}
          rows={[
            ['action', 'function (async or sync)', 'On form submission or POST/PUT/DELETE'],
            ['loader', 'function (async or sync)', 'Before the route renders (GET)'],
            ['shouldRevalidate', 'function', 'Before a revalidation'],
          ]}
        />
        <Callout>
          Actions run on the client in Bini.js (pure SPA). During <C>vite build</C>, routes with an
          action are marked <C>clientOnly</C> and get a shell page instead of pre-rendered HTML.
        </Callout>
      </Section>

      <Section id="creating-action" title="Creating an Action">
        <P>
          Export a function called <C>action</C> from your page. It receives the request context
          (including the submitted <C>FormData</C>). Return any serializable value.
        </P>
        <CodeBlock
          filename={`src/app/contact/page.${e}`}
          tsCode={`export async function action({ request }: { request: Request }) {
  const formData = await request.formData()
  const email = formData.get('email')
  const message = formData.get('message')

  // Process the submission
  return { ok: true, email }
}

export default function Contact() {
  return (
    <Form method="post">
      <input name="email" type="email" required />
      <textarea name="message" required />
      <button type="submit">Send</button>
    </Form>
  )
}`}
          jsCode={`export async function action({ request }) {
  const formData = await request.formData()
  const email = formData.get('email')
  const message = formData.get('message')

  // Process the submission
  return { ok: true, email }
}

export default function Contact() {
  return (
    <Form method="post">
      <input name="email" type="email" required />
      <textarea name="message" required />
      <button type="submit">Send</button>
    </Form>
  )
}`}
        />
      </Section>

      <Section id="accessing-action-data" title="Accessing Action Data">
        <P>
          Call <C>useActionData()</C> inside the page component to read the action's return value.
          It is <C>undefined</C> until the action runs for the first time.
        </P>
        <CodeBlock
          filename={`src/app/contact/page.${e}`}
          tsCode={`export default function Contact() {
  const result = useActionData()

  return (
    <Form method="post">
      {/* ...inputs... */}
      {result?.ok && <p>Thanks, {result.email}!</p>}
      <button type="submit">Send</button>
    </Form>
  )
}`}
          jsCode={`export default function Contact() {
  const result = useActionData()

  return (
    <Form method="post">
      {/* ...inputs... */}
      {result?.ok && <p>Thanks, {result.email}!</p>}
      <button type="submit">Send</button>
    </Form>
  )
}`}
        />
        <Table
          headers={['Hook', 'What it returns']}
          rows={[
            ['useActionData()', "The route's action return value, or undefined"],
            ['useNavigation()', 'The current submission state (idle, submitting, loading)'],
            ['useSubmit()', 'Programmatically submit a form'],
          ]}
        />
      </Section>

      <Section id="handling-errors" title="Handling Errors">
        <P>
          A thrown error inside an action is caught by the nearest <C>{`error.${e}`}</C> boundary,
          the same way loader and render errors are.
        </P>
        <CodeBlock
          filename={`src/app/contact/page.${e}`}
          tsCode={`export async function action({ request }: { request: Request }) {
  const formData = await request.formData()
  const email = formData.get('email')

  if (!email) {
    throw new Error('Email is required')
  }

  // Process the submission
  return { ok: true }
}`}
          jsCode={`export async function action({ request }) {
  const formData = await request.formData()
  const email = formData.get('email')

  if (!email) {
    throw new Error('Email is required')
  }

  // Process the submission
  return { ok: true }
}`}
        />
      </Section>

      <Section id="progressive-enhancement" title="Progressive Enhancement">
        <P>
          Actions work with native HTML forms even when JavaScript is disabled (or before
          hydration finishes), as long as you use React Router's <C>{'<Form>'}</C> component
          instead of a plain <C>{'<form>'}</C>.
        </P>
        <CodeBlock
          filename={`src/app/contact/page.${e}`}
          tsCode={`import { Form } from 'react-router-dom'

export default function Contact() {
  return (
    <Form method="post">
      <input name="email" type="email" required />
      <button type="submit">Send</button>
    </Form>
  )
}`}
          jsCode={`import { Form } from 'react-router-dom'

export default function Contact() {
  return (
    <Form method="post">
      <input name="email" type="email" required />
      <button type="submit">Send</button>
    </Form>
  )
}`}
        />
        <Callout>
          Plain <C>{'<form>'}</C> tags do not trigger actions on client-side navigation. Use{' '}
          <C>{'<Form>'}</C> from <C>react-router-dom</C> for any form that submits to an action.
        </Callout>
      </Section>

      <Section id="client-only" title="Client-only Routes">
        <P>
          Routes with an action are marked <C>clientOnly</C>, the same as routes with a loader.
          During <C>vite build</C>, the build tool writes a shell page for them because React
          Router does not run actions or loaders during static rendering.
        </P>
        <Table
          headers={['Route type', 'SSG output', 'What renders on first visit']}
          rows={[
            ['No action', 'Full pre-rendered HTML', 'Instant paint from HTML'],
            ['With action', 'Shell page (empty #root)', 'Client renders, then the form works'],
          ]}
        />
      </Section>

      <Section id="complete-example" title="Complete Example">
        <RouteVisual
          fileWidth={280}
          rows={[
            { n: 'app' },
            { n: 'contact', d: 1 },
            { n: `page.${e}`, d: 2, dot: true, url: '/contact' },
            { n: `error.${e}`, d: 2 },
          ]}
        />
        <CodeBlock
          filename={`src/app/contact/page.${e}`}
          tsCode={`import { Form, useActionData, useNavigation } from 'react-router-dom'

export async function action({ request }: { request: Request }) {
  const formData = await request.formData()
  const email = formData.get('email')
  const message = formData.get('message')

  if (!email || !message) {
    throw new Error('All fields are required')
  }

  await sendMessage({ email, message })
  return { ok: true }
}

export default function Contact() {
  const result = useActionData()
  const navigation = useNavigation()
  const submitting = navigation.state === 'submitting'

  return (
    <Form method="post">
      <input name="email" type="email" required />
      <textarea name="message" required />
      <button type="submit" disabled={submitting}>
        {submitting ? 'Sending…' : 'Send'}
      </button>
      {result?.ok && <p>Thanks!</p>}
    </Form>
  )
}`}
          jsCode={`import { Form, useActionData, useNavigation } from 'react-router-dom'

export async function action({ request }) {
  const formData = await request.formData()
  const email = formData.get('email')
  const message = formData.get('message')

  if (!email || !message) {
    throw new Error('All fields are required')
  }

  await sendMessage({ email, message })
  return { ok: true }
}

export default function Contact() {
  const result = useActionData()
  const navigation = useNavigation()
  const submitting = navigation.state === 'submitting'

  return (
    <Form method="post">
      <input name="email" type="email" required />
      <textarea name="message" required />
      <button type="submit" disabled={submitting}>
        {submitting ? 'Sending…' : 'Send'}
      </button>
      {result?.ok && <p>Thanks!</p>}
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
        <Link to="/docs/accessing-route-data" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Accessing Route Data</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Access loader data and navigation state.</p>
        </Link>
        <Link to="/docs/error-boundaries" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Error Boundaries</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Catch render errors and show a fallback UI.</p>
        </Link>
        <Link to="/docs/api-routes" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">API Routes</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Add backend endpoints with plain functions or a full Hono app.</p>
        </Link>
        <Link to="/docs/load" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Loading UI</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Show a fallback while pages and layouts load.</p>
        </Link>
        <Link to="/docs/static-export" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Static Export</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">How every route is pre-rendered to HTML at build time.</p>
        </Link>
      </div>
    </>
  )
}

export default function ActionsPage() {
  return (
    <DocPage
      title="Actions"
      badge="Experimental"
      description="Handle form submissions and data mutations with action exports and useActionData()."
      url="https://bini.js.org/docs/actions"
      editUrl="https://github.com/Binidu01/bini-official/edit/main/src/app/docs/actions.tsx"
      toc={TOC_ITEMS}
      prev={{ to: '/docs/loaders', title: 'Loaders' }}
      next={{ to: '/docs/accessing-route-data', title: 'Accessing Route Data' }}
    >
      <Content />
    </DocPage>
  )
}