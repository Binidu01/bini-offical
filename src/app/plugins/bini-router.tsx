// src/app/plugins/bini-router/page.tsx
import {
  Callout,
  C,
  CodeBlock,
  MultiTerminal,
  P,
  Section,
  Table,
} from '../../components/DocBlocks'
import { FolderVisual } from '../../components/DocVisuals'
import { PluginPage } from '../../components/PluginPage'
import type { TocItem } from '../../components/TableOfContents'

const TOC_ITEMS: TocItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'features', label: 'Features' },
  { id: 'install', label: 'Install' },
  { id: 'setup', label: 'Setup' },
  { id: 'file-structure', label: 'File Structure' },
  { id: 'routing', label: 'Routing' },
  { id: 'route-groups', label: 'Route Groups' },
  { id: 'parallel-routes', label: 'Parallel Routes' },
  { id: 'intercepting-routes', label: 'Intercepting Routes' },
  { id: 'layouts', label: 'Layouts' },
  { id: 'templates', label: 'Templates' },
  { id: 'boundaries', label: 'Boundaries' },
  { id: 'mdx', label: 'MDX and Markdown' },
  { id: 'metadata', label: 'Metadata' },
  { id: 'document-export', label: 'Document Export' },
  { id: 'auto-imports', label: 'Auto-imports' },
  { id: 'env', label: 'Environment Variables' },
  { id: 'api-routes', label: 'API Routes' },
  { id: 'config', label: 'Configuration' },
]

const EDIT_URL =
  'https://github.com/Binidu01/bini-official/edit/main/src/app/plugins/bini-router/page.tsx'

function FeatureBlurb({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-neutral-950">
      <h3 className="mb-2 text-sm font-semibold text-black dark:text-white">{title}</h3>
      <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{children}</p>
    </div>
  )
}

export default function BiniRouterPage() {
  return (
    <PluginPage
      title="bini-router"
      badge="Official"
      description="File-based routing, nested layouts, templates, route groups, parallel routes @slot, intercepting routes (.), folder-scoped loading/error/404/default boundaries, MDX pages, and Web-standard Request → Response API routes for Vite."
      url="https://bini.dev/plugins/bini-router"
      editUrl={EDIT_URL}
      toc={TOC_ITEMS}
      prev={{ to: '/plugins/bini-deploy', title: 'bini-deploy' }}
      next={{ to: '/plugins/bini-env', title: 'bini-env' }}
    >
      <Section id="overview" title="Overview">
        <P>
          <C>bini-router</C> is the core of Bini.js. Similar to Next.js App Router, but pure SPA
          with no server. Scans <C>src/app/</C> on every file change and regenerates React Router
          tree instantly with HMR. Now with parallel routes <C>@sidebar</C>, intercepting routes{' '}
          <C>(.) (..) (...)</C>, and typed <C>document</C> export with no HTML injection surface.
        </P>
        <Callout>
          Zero config. Production deployment handled by companion <C>bini-deploy</C>. This package
          focuses on routing, layouts, and local API serving.
        </Callout>
      </Section>

      <Section id="features" title="Features">
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <FeatureBlurb title="File-based Routing">
            <C>page.tsx</C> in folders + flat files like <C>about.tsx</C> → URLs. <C>index.*</C> →
            parent.
          </FeatureBlurb>
          <FeatureBlurb title="Parallel Routes">
            <C>@sidebar</C>, <C>@modal</C> slots resolve independently with <C>default.tsx</C>{' '}
            fallback.
          </FeatureBlurb>
          <FeatureBlurb title="Intercepting Routes">
            <C>(.)name</C>, <C>(..)name</C>, <C>(...)name</C> for modal flows like
            photo-in-feed.
          </FeatureBlurb>
          <FeatureBlurb title="Dynamic & Catch-all">
            <C>[id]</C>, <C>[...slug]</C>, <C>[[...slug]]</C> for folders and flat files. Required
            vs optional tracked separately.
          </FeatureBlurb>
          <FeatureBlurb title="Security & Bounded">
            Segment validation, traversal guards, host-header validation, 10MB source limit,
            500-entry capped preview cache.
          </FeatureBlurb>
          <FeatureBlurb title="Document Export">
            Typed tree, not raw HTML strings - no injection surface. <C>html</C>, <C>body</C>,{' '}
            <C>head</C> merged safely.
          </FeatureBlurb>
        </div>
      </Section>

      <Section id="install" title="Install">
        <MultiTerminal
          tabs={[
            { id: 'npm', label: 'npm', command: '$ npm install bini-router bini-env' },
            { id: 'pnpm', label: 'pnpm', command: '$ pnpm add bini-router bini-env' },
            { id: 'yarn', label: 'yarn', command: '$ yarn add bini-router bini-env' },
            { id: 'bun', label: 'bun', command: '$ bun add bini-router bini-env' },
          ]}
        />
        <Table
          headers={['Dependency', 'Version']}
          rows={[
            ['Vite', '8 or later'],
            ['React', '18 or later'],
            [
              'react-router-dom',
              'Required - BrowserRouter, Routes, Route, Outlet, useLocation, useParams',
            ],
          ]}
        />
      </Section>

      <Section id="setup" title="Setup">
        <CodeBlock
          filename="vite.config.ts"
          lang="js"
          code={`import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { biniroute } from 'bini-router'
import { biniEnv } from 'bini-env'

export default defineConfig({
  plugins: [react(), biniEnv(), biniroute()],
})`}
        />
        <CodeBlock
          filename="src/main.tsx"
          lang="js"
          code={`import { createRoot } from 'react-dom/client'
import App from './App'

createRoot(document.getElementById('root')!).render(<App />)`}
        />
      </Section>

      <Section id="file-structure" title="File Structure">
        <FolderVisual
          width={380}
          rows={[
            { n: 'src' },
            { n: 'main.tsx', d: 1, dot: true },
            { n: 'App.tsx', d: 1, dot: true },
            { n: 'app', d: 1 },
            { n: 'layout.tsx', d: 2, fn: true },
            { n: 'template.tsx', d: 2, fn: true },
            { n: 'page.tsx', d: 2, fn: true },
            { n: 'loading.tsx', d: 2 },
            { n: 'not-found.tsx', d: 2 },
            { n: 'error.tsx', d: 2 },
            { n: 'global-error.tsx', d: 2 },
            { n: 'about.mdx', d: 2 },
            { n: '(marketing)', d: 2 },
            { n: 'layout.tsx', d: 3, fn: true },
            { n: 'pricing', d: 3 },
            { n: 'page.tsx', d: 4, fn: true },
            { n: '@sidebar', d: 2 },
            { n: 'default.tsx', d: 3, fn: true },
            { n: 'page.tsx', d: 3, fn: true },
            { n: 'dashboard', d: 3 },
            { n: 'page.tsx', d: 4, fn: true },
            { n: 'photo', d: 2 },
            { n: '[id]', d: 3 },
            { n: 'page.tsx', d: 4, fn: true },
            { n: '(.)view', d: 4 },
            { n: 'page.tsx', d: 5, fn: true },
            { n: 'blog', d: 2 },
            { n: 'index.tsx', d: 3, fn: true },
            { n: '[slug].tsx', d: 3, fn: true },
            { n: 'api', d: 2 },
            { n: 'users.ts', d: 3, fn: true },
            { n: 'posts', d: 3 },
            { n: '[id].ts', d: 4, fn: true },
            { n: '[...catch].ts', d: 3, fn: true },
          ]}
        />
      </Section>

      <Section id="routing" title="Routing">
        <CodeBlock
          filename="src/app/dashboard/page.tsx"
          lang="js"
          code={`export default function Dashboard() {
  const [count, setCount] = useState(0)
  return <h1>Dashboard</h1>
}`}
        />
        <CodeBlock
          filename="src/app/blog/[slug]/page.tsx"
          lang="js"
          code={`export default function Post() {
  const { slug } = useParams()
  return <h1>Post: {slug}</h1>
}`}
        />
        <CodeBlock
          filename="src/app/docs/[...path]/page.tsx"
          lang="js"
          code={`export default function Docs() {
  // Matches /docs/anything/nested/here
  return <h1>Docs</h1>
}`}
        />
        <Callout>
          Priority: static → dynamic <C>:param</C> → required <C>*</C> → optional <C>**</C> last.
          Extension:{' '}
          <C>
            .tsx {'>'} .jsx {'>'} .ts {'>'} .js {'>'} .mdx {'>'} .md
          </C>
        </Callout>
      </Section>

      <Section id="route-groups" title="Route Groups">
        <FolderVisual
          width={320}
          rows={[
            { n: 'app' },
            { n: '(marketing)', d: 1 },
            { n: 'layout.tsx', d: 2, fn: true },
            { n: 'about', d: 2 },
            { n: 'page.tsx', d: 3, fn: true },
            { n: '(app)', d: 1 },
            { n: 'layout.tsx', d: 2, fn: true },
            { n: 'settings', d: 2 },
            { n: 'page.tsx', d: 3, fn: true },
          ]}
        />
        <P>
          Group names <C>/^[a-zA-Z0-9_-]+$/</C>. Folders using interception syntax <C>(.) (..) (...)</C>{' '}
          are NOT treated as groups.
        </P>
      </Section>

      <Section id="parallel-routes" title="Parallel Routes">
        <P>
          Folder prefixed with <C>@</C> defines slot: named subtree resolved independently and does
          not add URL segment. Slot name <C>/^[a-zA-Z][a-zA-Z0-9_-]*$/</C>.
        </P>
        <FolderVisual
          width={320}
          rows={[
            { n: 'app' },
            { n: 'layout.tsx', d: 1, fn: true },
            { n: 'page.tsx', d: 1, fn: true },
            { n: '@sidebar', d: 1 },
            { n: 'default.tsx', d: 2, fn: true },
            { n: 'page.tsx', d: 2, fn: true },
            { n: 'settings', d: 2 },
            { n: 'page.tsx', d: 3, fn: true },
          ]}
        />
        <Table
          headers={['Concept', 'Behavior']}
          rows={[
            [
              'Slot scanning',
              'Dynamic, catch-alls, nested layouts, templates all work - tagged with slotName',
            ],
            [
              'Fallback',
              'Nearest default.tsx (nearest-wins). No default → built-in No Content',
            ],
            [
              'Rendering',
              'Own SlotBoundary block, not injected as named prop into layouts (Next.js difference)',
            ],
            ['Status', 'Experimental - verify against your layout, composition evolving'],
          ]}
        />
        <CodeBlock
          filename="src/app/@sidebar/default.tsx"
          lang="js"
          code={`export default function SidebarDefault() {
  return <p>Nothing to show here for this page.</p>
}`}
        />
      </Section>

      <Section id="intercepting-routes" title="Intercepting Routes">
        <P>
          Folder prefixed with <C>(.) (..) (...)</C> intercepts navigation to nearby route - same
          as Next.js for photo-in-modal.
        </P>
        <Table
          headers={['Prefix', 'Intercepts']}
          rows={[
            ['(.)name', 'Sibling of current segment (same level)'],
            ['(..)name', 'One level up'],
            ['(...)name', 'Root of app'],
          ]}
        />
        <FolderVisual
          width={340}
          rows={[
            { n: 'app' },
            { n: 'feed', d: 1 },
            { n: 'page.tsx', d: 2, fn: true },
            { n: 'photo', d: 2 },
            { n: '[id]', d: 3 },
            { n: 'page.tsx', d: 4, fn: true },
            { n: 'photo', d: 1 },
            { n: '[id]', d: 2 },
            { n: 'page.tsx', d: 3, fn: true },
            { n: '(.)view', d: 3 },
            { n: 'page.tsx', d: 4, fn: true },
          ]}
        />
        <Callout>
          Intercepting folder itself does not add URL segment; segment after it does. Only default
          export inside treated as route. Conflicts compared only at same intercept level.
        </Callout>
      </Section>

      <Section id="layouts" title="Layouts">
        <CodeBlock
          filename="src/app/layout.tsx"
          lang="js"
          code={`export const metadata = {
  title: 'My App',
  description: 'Built with bini-router',
}

export default function RootLayout() {
  return <Outlet />
}`}
        />
        <CodeBlock
          filename="src/app/dashboard/layout.tsx"
          lang="js"
          code={`export const metadata = {
  title: 'Dashboard',
}

export default function DashboardLayout({ params }) {
  return (
    <div className="dashboard">
      <aside>Sidebar</aside>
      <main><Outlet /></main>
    </div>
  )
}`}
        />
        <Callout>
          Layouts containing <C>{'<html>'}</C> treated as shell and excluded. Circular chains
          detected. Eagerly bundled except root slot/boundary dependents.
        </Callout>
      </Section>

      <Section id="templates" title="Templates">
        <CodeBlock
          filename="src/app/dashboard/template.tsx"
          lang="js"
          code={`export default function DashboardTemplate({ children }) {
  return <section className="page-transition">{children}</section>
}`}
        />
        <P>
          Templates render inside layout chain, directly around page. Receive <C>children</C> not{' '}
          <C>params</C>. Nearest-wins.
        </P>
      </Section>

      <Section id="boundaries" title="Loading, Not Found, Error, Default Boundaries">
        <P>
          Nearest-wins. Subfolder shadows ancestor. <C>default.tsx</C> only inside <C>@slot</C>.
        </P>
        <CodeBlock
          filename="src/app/dashboard/loading.tsx"
          lang="js"
          code={`export default function DashboardLoading() {
  return <p>Loading dashboard...</p>
}`}
        />
        <CodeBlock
          filename="src/app/blog/not-found.tsx"
          lang="js"
          code={`export default function NotFound() {
  return (
    <div>
      <h1>Post not found</h1>
      <Link to="/blog">Back to blog</Link>
    </div>
  )
}`}
        />
        <CodeBlock
          filename="src/app/dashboard/error.tsx"
          lang="js"
          code={`export default function DashboardError({ error, reset }) {
  return (
    <div>
      <h2>Something broke</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  )
}`}
        />
        <CodeBlock
          filename="src/app/@sidebar/default.tsx"
          lang="js"
          code={`export default function SidebarDefault() {
  return <p>Nothing to show here.</p>
}`}
        />
      </Section>

      <Section id="mdx" title="MDX and Markdown">
        <CodeBlock
          filename="about.mdx"
          lang="js"
          code={`# About us

This is **markdown**, rendered as JSX.

<button className="rounded bg-cyan-500 px-4 py-2 text-white">
  Click me
</button>`}
        />
        <CodeBlock
          filename="vite.config.ts"
          lang="js"
          code={`biniroute({
  mdx: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})`}
        />
      </Section>

      <Section id="metadata" title="Metadata">
        <CodeBlock
          filename="src/app/layout.tsx"
          lang="js"
          code={`export const metadata = {
  title: {
    default: 'My App',
    template: '%s | My App',
  },
  description: 'Built with bini-router',
  openGraph: {
    title: 'Dashboard',
    images: [{ url: '/og.png' }],
  },
}`}
        />
        <Callout>
          Root metadata injected into <C>index.html</C> at build. Others update{' '}
          <C>document.title</C> via TitleSetter. Stripped from client bundle. Title template:{' '}
          <C>Dashboard</C> → <C>Dashboard | My App</C>.
        </Callout>
      </Section>

      <Section id="document-export" title="Document Export">
        <P>
          Root layout can export <C>document</C> object to customize HTML shell. Enabled by
          default, disable with <C>document: false</C>. Head fragment parsed into typed tree
          (element/text/raw nodes) - no HTML injection surface even for handwritten JSX.
        </P>
        <CodeBlock
          filename="src/app/layout.tsx"
          lang="js"
          code={`export const document = {
  html: { lang: 'en', class: 'dark' },
  body: { class: 'antialiased' },
  head: (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <script async src="https://example.com/analytics.js"></script>
    </>
  ),
}

export default function RootLayout() {
  return <Outlet />
}`}
        />
        <Table
          headers={['Key', 'Behavior']}
          rows={[
            ['html', 'Attributes merged onto <html>'],
            ['body', 'Attributes merged onto <body>'],
            ['head', 'JSX → static typed structure, appended before </head>'],
          ]}
        />
      </Section>

      <Section id="auto-imports" title="Auto-imports">
        <Table
          headers={['From', 'Symbols']}
          rows={[
            [
              'react',
              'useState, useEffect, useRef, useMemo, useCallback, useContext, createContext, useReducer, useId, useTransition, useDeferredValue',
            ],
            [
              'react-router-dom',
              'Link, NavLink, useNavigate, useParams, useLocation, useSearchParams, Outlet',
            ],
            ['bini-env', 'getEnv, requireEnv'],
          ]}
        />
        <CodeBlock
          filename="src/app/profile/page.tsx"
          lang="js"
          code={`export default function Profile() {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  return <div><Link to="/">Home</Link><h1>Profile {id}</h1></div>
}`}
        />
      </Section>

      <Section id="env" title="Environment Variables">
        <CodeBlock
          filename=".env"
          lang="text"
          code={`BINI_FIREBASE_API_KEY=your_key
SMTP_USER=user@smtp.example.com
SMTP_PASS=your_password`}
        />
        <CodeBlock
          filename="src/app/api/email.ts"
          lang="js"
          code={`const SMTP_USER = requireEnv('SMTP_USER')  // throws if missing
const DEBUG = getEnv('DEBUG_MODE')         // undefined if missing`}
        />
      </Section>

      <Section id="api-routes" title="API Routes">
        <Table
          headers={['File', 'Route']}
          rows={[
            ['api/users.ts', '/api/users'],
            ['api/posts/index.ts', '/api/posts'],
            ['api/posts/[id].ts', '/api/posts/:id'],
            ['api/[...catch].ts', '/api/*'],
            ['api/(internal)/health.ts', '/api/health'],
          ]}
        />
        <CodeBlock
          filename="src/app/api/hello.ts"
          lang="js"
          code={`export default function handler(req) {
  return Response.json({ message: 'hello', method: req.method })
}`}
        />
        <CodeBlock
          filename="src/app/api/posts/[id].ts (params)"
          lang="js"
          code={`export default function handler(req) {
  const params = JSON.parse(req.headers.get('x-bini-params') ?? '{}')
  return Response.json({ id: params.id })
}`}
        />
        <CodeBlock
          filename="src/app/api/hello.ts (Hono)"
          lang="js"
          code={`import { Hono } from 'hono'
const app = new Hono()
app.all('/hello', (c) => c.json({ message: 'Hello!', method: c.req.method }))
export default app`}
        />
        <Callout>
          Write routes without <C>/api</C> prefix - stripped before handler. Body capped 1MB (413),{' '}
          <C>bodySizeLimit</C> to adjust. CORS disabled by default - <C>cors: true</C>. Host header
          validated, capped cache 500 entries.
        </Callout>
      </Section>

      <Section id="config" title="Configuration Reference">
        <CodeBlock
          filename="vite.config.ts"
          lang="js"
          code={`biniroute({
  appDir: 'src/app',
  apiDir: 'src/app/api',
  autoImportDir: 'src',
  cors: false,
  strictMode: true,
  bodySizeLimit: 1024 * 1024,
  document: true,
  mdx: {},
})`}
        />
        <Table
          headers={['Option', 'Type', 'Default', 'Description']}
          rows={[
            ['appDir', 'string', 'src/app', 'Dir containing file-based routes'],
            ['apiDir', 'string', 'src/app/api', 'Dir containing API routes'],
            ['autoImportDir', 'string', 'src', 'Dir where auto-imports injected'],
            ['cors', 'boolean | object', 'false', 'CORS handling for dev/preview API'],
            ['strictMode', 'boolean', 'true', 'Fail on route conflicts'],
            ['bodySizeLimit', 'number', '1048576', 'Max API body size bytes'],
            [
              'document',
              'boolean',
              'true',
              'Process document export - typed tree, no HTML injection',
            ],
            [
              'base',
              'string',
              '/',
              'Vite base option - router respects vite base, no separate basePath option',
            ],
            ['mdx', 'object', '{}', 'Options passed to @mdx-js/rollup'],
          ]}
        />
      </Section>
    </PluginPage>
  )
}