// src/app/plugins/bini-router/page.tsx
import {
  C,
  CodeBlock,
  H3,
  MultiTerminal,
  P,
  Section,
  Table,
  UL,
  type TerminalTab,
} from '../../components/DocBlocks'
import { FolderVisual } from '../../components/DocVisuals'
import { PluginPage } from '../../components/PluginPage'
import type { TocItem } from '../../components/TableOfContents'

const TOC_ITEMS: TocItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'requirements', label: 'Requirements' },
  { id: 'install', label: 'Install' },
  { id: 'setup', label: 'Setup' },
  { id: 'project-structure', label: 'Project Structure' },
  { id: 'routing', label: 'Routing' },
  { id: 'route-groups', label: 'Route Groups' },
  { id: 'parallel-routes', label: 'Parallel Routes' },
  { id: 'intercepting-routes', label: 'Intercepting Routes' },
  { id: 'layouts-templates', label: 'Layouts and Templates' },
  { id: 'data-exports', label: 'Route Data Exports' },
  { id: 'boundaries', label: 'Boundaries' },
  { id: 'metadata-document', label: 'Metadata and Document' },
  { id: 'static-params', label: 'Static Params and Prerender' },
  { id: 'api-routes', label: 'API Routes' },
  { id: 'config', label: 'Configuration' },
]

const EDIT_URL =
  'https://github.com/Binidu01/bini-official/edit/main/src/app/plugins/bini-router/page.tsx'

/* ---- package-manager tab helpers ---------------------------------- */

const PMS = ['npm', 'pnpm', 'yarn', 'bun'] as const
type Pm = (typeof PMS)[number]

const INSTALL: Record<Pm, string> = {
  npm: 'npm install bini-router react-router-dom',
  pnpm: 'pnpm add bini-router react-router-dom',
  yarn: 'yarn add bini-router react-router-dom',
  bun: 'bun add bini-router react-router-dom',
}

const INSTALL_MDX: Record<Pm, string> = {
  npm: 'npm install -D @mdx-js/rollup',
  pnpm: 'pnpm add -D @mdx-js/rollup',
  yarn: 'yarn add -D @mdx-js/rollup',
  bun: 'bun add -d @mdx-js/rollup',
}

const tabs = (cmd: (pm: Pm) => string): TerminalTab[] =>
  PMS.map((pm) => ({ id: pm, label: pm, command: cmd(pm) }))

export default function BiniRouterPage() {
  return (
    <PluginPage
      title="bini-router"
      badge="Official"
      description="File-based routing for Bini.js, built on React Router's data router. Nested layouts, route groups, parallel and intercepting routes, MDX pages, and Web-standard API routes."
      url="https://www.npmjs.com/package/bini-router"
      editUrl={EDIT_URL}
      toc={TOC_ITEMS}
      prev={{ to: '/plugins/bini-deploy', title: 'bini-deploy' }}
      next={{ to: '/plugins/bini-env', title: 'bini-env' }}
    >
      <Section id="overview" title="Overview">
        <P>
          <C>bini-router</C> turns the files in <C>src/app</C> into a route tree with nested
          layouts, route groups, parallel and intercepting routes, MDX pages, and Web-standard API
          routes.
        </P>
      </Section>

      <Section id="requirements" title="Requirements">
        <UL>
          <li>
            Vite <C>{'>='} 8</C>
          </li>
          <li>
            React <C>{'>='} 18</C>
          </li>
          <li>
            <C>react-router-dom</C> - a data-router release
          </li>
        </UL>
      </Section>

      <Section id="install" title="Install">
        <MultiTerminal tabs={tabs((pm) => `$ ${INSTALL[pm]}`)} />
        <P>For MDX and Markdown pages, add the MDX Rollup plugin as a dev dependency:</P>
        <MultiTerminal tabs={tabs((pm) => `$ ${INSTALL_MDX[pm]}`)} />
      </Section>

      <Section id="setup" title="Setup">
        <P>1. Register the plugin in your Bini.js config:</P>
        <CodeBlock
          filename="vite.config.ts"
          code={`import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { biniroute } from 'bini-router'

export default defineConfig({
  plugins: [react(), biniroute()],
})`}
        />
        <P>
          2. Mount the app in <C>src/main.tsx</C>:
        </P>
        <CodeBlock
          filename="src/main.tsx"
          code={`import { createRoot } from 'react-dom/client'
import App, { rootOptions } from 'virtual:bini-app'

createRoot(document.getElementById('root')!, rootOptions).render(<App />)`}
        />
        <P>
          3. Add a page at <C>src/app/page.tsx</C>:
        </P>
        <CodeBlock
          filename="src/app/page.tsx"
          code={`export default function Home() {
  return <h1>Hello</h1>
}`}
        />
        <P>
          Keep <C>{'<div id="root"></div>'}</C> in <C>index.html</C>. Do not import CSS from{' '}
          <C>src/main.*</C>; import global styles from <C>src/app/layout.tsx</C> or a page instead.
        </P>
      </Section>

      <Section id="project-structure" title="Project Structure">
        <FolderVisual
          width={340}
          rows={[
            { n: 'src' },
            { n: 'main.tsx', d: 1, dot: true },
            { n: 'app', d: 1 },
            { n: 'layout.tsx', d: 2, fn: true },
            { n: 'page.tsx', d: 2, fn: true },
            { n: 'about.mdx', d: 2 },
            { n: '(marketing)', d: 2 },
            { n: 'pricing/page.tsx', d: 3, fn: true },
            { n: 'dashboard', d: 2 },
            { n: 'layout.tsx', d: 3, fn: true },
            { n: 'page.tsx', d: 3, fn: true },
            { n: 'loading.tsx', d: 3 },
            { n: '[id]/page.tsx', d: 3, fn: true },
            { n: 'inbox', d: 2 },
            { n: 'layout.tsx', d: 3, fn: true },
            { n: 'page.tsx', d: 3, fn: true },
            { n: '@sidebar', d: 3 },
            { n: 'default.tsx', d: 4, fn: true },
            { n: 'page.tsx', d: 4, fn: true },
            { n: 'blog', d: 2 },
            { n: 'index.tsx', d: 3, fn: true },
            { n: '[slug].tsx', d: 3, fn: true },
            { n: 'not-found.tsx', d: 3 },
            { n: 'docs/[...path]/page.tsx', d: 2, fn: true },
            { n: 'api', d: 2 },
            { n: 'users.ts', d: 3, fn: true },
            { n: 'posts/[id].ts', d: 3, fn: true },
          ]}
        />
        <P>
          The app directory is <C>src/app</C> and the API directory is <C>src/app/api</C>. Neither
          is configurable.
        </P>
        <P>
          Files and folders starting with <C>_</C> or <C>.</C> are ignored, along with{' '}
          <C>node_modules</C>, <C>*.test.*</C>, <C>*.spec.*</C>, <C>*.stories.*</C>, and{' '}
          <C>.md</C>/<C>.mdx</C> docs like <C>README.md</C>. Segments may contain letters, digits,
          <C>_</C>, and <C>-</C> (up to 100 chars; slot names must start with a letter).
        </P>
      </Section>

      <Section id="routing" title="Routing">
        <Table
          headers={['Pattern', 'Example', 'URL']}
          rows={[
            ['Static', 'dashboard/page.tsx or dashboard.tsx', '/dashboard'],
            ['Index', 'blog/index.tsx', '/blog'],
            ['Dynamic', 'blog/[slug].tsx', '/blog/:slug'],
            ['Catch-all', 'docs/[...path]/page.tsx', '/docs/* (at least one segment)'],
            ['Optional catch-all', 'docs/[[...path]]/page.tsx', '/docs/* (zero or more)'],
          ]}
        />
        <P>
          Read dynamic parameters with <C>useParams()</C>. For page routes, catch-all segments are
          exposed under React Router&apos;s <C>*</C> key (<C>params['*']</C>), not under the name
          written in the folder.
        </P>
        <CodeBlock
          filename="src/app/blog/[slug]/page.tsx"
          code={`export default function Post() {
  const { slug } = useParams()
  return <h1>Post: {slug}</h1>
}`}
        />
        <P>
          Matching order: static first, then dynamic <C>:param</C>, then required catch-alls{' '}
          <C>*</C>, then optional catch-alls <C>**</C>.
        </P>
      </Section>

      <Section id="route-groups" title="Route Groups">
        <P>
          A folder wrapped in parentheses, such as <C>(marketing)</C>, groups routes and can carry
          its own layout without adding a URL segment.
        </P>
        <FolderVisual
          width={320}
          rows={[
            { n: 'app' },
            { n: '(marketing)', d: 1 },
            { n: 'layout.tsx', d: 2, fn: true },
            { n: 'pricing/page.tsx', d: 2, fn: true },
            { n: '(app)', d: 1 },
            { n: 'layout.tsx', d: 2, fn: true },
            { n: 'settings/page.tsx', d: 2, fn: true },
          ]}
        />
        <P>
          Folders using interception syntax <C>(.)</C>, <C>(..)</C>, <C>(...)</C> are not treated
          as groups.
        </P>
      </Section>

      <Section id="parallel-routes" title="Parallel Routes">
        <P>
          A folder prefixed with <C>@</C> defines a named slot. The slot is passed as a prop to the{' '}
          <C>layout.*</C> in the same directory as the <C>@slot</C> folder:
        </P>
        <CodeBlock
          filename="src/app/inbox/layout.tsx"
          code={`export default function InboxLayout({ sidebar }) {
  return (
    <div className="grid">
      <aside>{sidebar}</aside>
      <main><Outlet /></main>
    </div>
  )
}`}
        />
        <FolderVisual
          width={320}
          rows={[
            { n: 'app' },
            { n: 'inbox', d: 1 },
            { n: 'layout.tsx', d: 2, fn: true },
            { n: 'page.tsx', d: 2, fn: true },
            { n: '@sidebar', d: 2 },
            { n: 'default.tsx', d: 3, fn: true },
            { n: 'page.tsx', d: 3, fn: true },
          ]}
        />
        <P>
          The slot renders the first entry matching the current URL, then the slot&apos;s own{' '}
          <C>default.*</C>, then a built-in empty fallback. A slot needs a receiving layout next to
          the <C>@slot</C> folder. Data exports in slot pages are not executed.
        </P>
      </Section>

      <Section id="intercepting-routes" title="Intercepting Routes">
        <P>
          Folders or flat files prefixed with <C>(.)</C>, <C>(..)</C>, or <C>(...)</C> render
          alternative content at a URL when the previous in-app location matches the
          interceptor&apos;s source route. Direct visits and reloads render the real page.
        </P>
        <Table
          headers={['Prefix', 'Intercepts']}
          rows={[
            ['(.)name', 'Sibling of current segment (same level)'],
            ['(..)name', 'One level up'],
            ['(...)name', 'Root of app'],
          ]}
        />
        <P>
          If no real page exists at the target URL, the interceptor&apos;s page is registered as
          the route and the not-found page is shown for direct visits. Data exports in interceptors
          are not executed.
        </P>
      </Section>

      <Section id="layouts-templates" title="Layouts and Templates">
        <P>
          Layouts wrap every page in their directory and below. They receive <C>params</C>, any
          parallel-route slots, and <C>children</C>. Render either <C>{'<Outlet />'}</C> or{' '}
          <C>{'{children}'}</C>.
        </P>
        <CodeBlock
          filename="src/app/dashboard/layout.tsx"
          code={`export default function DashboardLayout({ params }) {
  return (
    <div className="dashboard">
      <aside>Sidebar</aside>
      <main><Outlet /></main>
    </div>
  )
}`}
        />
        <P>
          A <C>template.*</C> file wraps each page inside the layout chain. Templates receive{' '}
          <C>children</C> only. The nearest usable template wins.
        </P>
        <P>
          Layouts that contain an <C>{'<html>'}</C> element, or have no default export, are
          excluded from the chain. The same check applies to templates and to{' '}
          <C>loading</C>, <C>error</C>, <C>not-found</C>, <C>global-error</C>, and{' '}
          <C>default</C> files.
        </P>
      </Section>

      <Section id="data-exports" title="Route Data Exports">
        <P>
          Pages and layouts can export <C>loader</C>, <C>action</C>, <C>shouldRevalidate</C>,{' '}
          <C>ErrorBoundary</C>, <C>HydrateFallback</C> / <C>hydrateFallbackElement</C>, and{' '}
          <C>handle</C>. They are wired into the generated data router.
        </P>
        <CodeBlock
          filename="src/app/users/page.tsx"
          code={`export async function loader() {
  const res = await fetch('/api/users')
  return res.json()
}

export default function Users() {
  const users = useLoaderData()
  return <ul>{users.map((u) => <li key={u.id}>{u.name}</li>)}</ul>
}`}
        />
        <P>
          Routes whose page or layouts have data exports are marked <C>clientOnly</C> and are not
          server-rendered: the static renderer does not run React Router lazy routes.
        </P>
      </Section>

      <Section id="boundaries" title="Loading, Not Found, and Error Boundaries">
        <P>
          <C>loading</C>, <C>error</C>, and <C>not-found</C> files use nearest-wins resolution: a
          file in a subfolder applies to routes in that subfolder and shadows its ancestors.
          Built-in defaults are used when none is found.
        </P>
        <Table
          headers={['File', 'Behavior']}
          rows={[
            ['loading.*', 'Suspense fallback for pages and layouts in scope.'],
            [
              'not-found.*',
              "Handles unmatched URLs under its folder (wrapped in that folder's layouts) and 404 responses thrown from routes.",
            ],
            [
              'error.*',
              'Receives { error, reset } and catches render errors and route errors. Boundaries reset on navigation and HMR updates.',
            ],
            ['global-error.*', 'Fallback, in the app root, for errors that reach the root route.'],
            ['default.*', 'Inside a @slot folder, renders when no slot route matches.'],
          ]}
        />
        <P>
          In development, runtime errors are also dispatched as a <C>__bini_error__</C> event on{' '}
          <C>window</C>.
        </P>
      </Section>

      <Section id="metadata-document" title="Metadata and Document">
        <P>
          Static extraction applies to <C>.tsx</C>, <C>.jsx</C>, <C>.ts</C>, and <C>.js</C> files.{' '}
          <C>.mdx</C> and <C>.md</C> pages do not support metadata, document, or CSS extraction.
        </P>

        <H3>metadata</H3>
        <P>
          Export <C>metadata</C> from any layout or page. It is statically extracted, merged from
          the outermost layout to the page, and removed from the client bundle. Object values are
          merged one level deep; later entries win.
        </P>
        <CodeBlock
          filename="src/app/layout.tsx"
          code={`export const metadata = {
  title: { default: 'My App', template: '%s | My App' },
  description: 'Built with bini-router',
}`}
        />
        <P>
          Values must be statically evaluable: literals, template literals, arrays, objects,
          module-scope <C>const</C> references, TypeScript <C>as</C> / <C>satisfies</C> wrappers,
          and <C>JSON.stringify</C> of static values. Non-static properties are skipped.
        </P>

        <H3>document</H3>
        <P>
          Use <C>document</C> for head tags that must appear in both development and production,
          and for <C>{'<html>'}</C> / <C>{'<body>'}</C> attributes. The export is removed from the
          client bundle. The nearest <C>document</C> export (page first, then the closest layout)
          is used; documents are not merged.
        </P>
        <CodeBlock
          filename="src/app/layout.tsx"
          code={`export const document = {
  html: { lang: 'en' },
  body: { class: 'antialiased' },
  head: (
    <>
      <title>My App</title>
      <meta name="description" content="Built with bini-router" />
      <link rel="icon" href="/favicon.ico" />
    </>
  ),
}`}
        />
        <Table
          headers={['Key', 'Applied in dev', 'Applied at build']}
          rows={[
            ['head', 'Yes', 'Yes'],
            ['html, body', 'Yes', 'Yes'],
            ['metadata', 'Title only (client-side)', 'Yes'],
          ]}
        />
        <P>
          Attribute values and children must be static, otherwise they are dropped.{' '}
          <C>{'dangerouslySetInnerHTML={{ __html: <static value> }}'}</C> is supported for JSON-LD
          scripts.
        </P>
      </Section>

      <Section id="static-params" title="Static Params and Prerender">
        <Table
          headers={['Export', 'Behavior']}
          rows={[
            [
              'staticParams',
              'A function (sync or async) exported from a dynamic page that lists the URLs to pre-render.',
            ],
            [
              'prerender = false',
              'Marks a route as opted out of pre-rendering.',
            ],
          ]}
        />
      </Section>

      <Section id="api-routes" title="API Routes">
        <P>
          Place <C>.ts</C> or <C>.js</C> files in <C>src/app/api/</C>. Every handler receives a
          standard <C>Request</C> and a context object:{' '}
          <C>{'{ params, searchParams, env, waitUntil? }'}</C>.
        </P>
        <Table
          headers={['File', 'Route']}
          rows={[
            ['api/users.ts', '/api/users'],
            ['api/users/route.ts', '/api/users'],
            ['api/posts/index.ts', '/api/posts'],
            ['api/posts/[id].ts', '/api/posts/:id'],
            ['api/[...catch].ts', '/api/*'],
            ['api/(internal)/health.ts', '/api/health'],
          ]}
        />
        <H3>Three handler styles</H3>
        <CodeBlock
          filename="Per-method exports"
          code={`export function GET(req, { params }) {
  return Response.json({ id: params.id })
}`}
        />
        <CodeBlock
          filename="Default function (plain values as JSON)"
          code={`export default function handler() {
  return { ok: true }
}`}
        />
        <CodeBlock
          filename=".fetch() object (Hono app)"
          code={`import { Hono } from 'hono'
const app = new Hono()
app.all('/hello', (c) => c.json({ message: 'Hello' }))
export default app`}
        />
        <P>
          If a file exports method handlers, other methods receive 405 with an <C>Allow</C> header,
          and HEAD falls back to GET. Method exports take precedence over a default export. Routes
          in <C>.fetch()</C> objects are written without the <C>/api</C> prefix.
        </P>
      </Section>

      <Section id="config" title="Configuration">
        <CodeBlock
          filename="vite.config.ts"
          code={`biniroute({
  cors: false,
  trustProxy: false,
  bodySizeLimit: 1024 * 1024,
})`}
        />
        <Table
          headers={['Option', 'Type', 'Default', 'Description']}
          rows={[
            [
              'cors',
              'boolean | object',
              'false',
              'Adds CORS headers to API responses. true allows any origin with standard methods and Content-Type, Authorization, X-Request-ID headers. origin accepts a string or a list matched per request.',
            ],
            [
              'trustProxy',
              'boolean',
              'false',
              'Builds the request origin from X-Forwarded-Host and X-Forwarded-Proto in dev and preview. The forwarded host must still pass the allow-list.',
            ],
            [
              'bodySizeLimit',
              'number | false',
              '1048576',
              'Maximum API request body in bytes. false, 0, or Infinity disable the limit.',
            ],
          ]}
        />
        <P>
          Everything else is fixed by convention: directories, the router basename (derived from
          Vite&apos;s <C>base</C>), auto-import presets, MDX options, route prefetching, and the
          built-in SSR entry. Prefetching on link hover and focus can be disabled per link with{' '}
          <C>data-no-prefetch</C>.
        </P>
      </Section>
    </PluginPage>
  )
}