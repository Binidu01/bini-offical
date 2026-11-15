// src/app/docs/static-export.tsx
import { File, Globe } from 'lucide-react'
import { Link } from 'react-router-dom'

import {
  C,
  Callout,
  CodeBlock,
  DocPage,
  MultiTerminal,
  P,
  Section,
  Table,
  UL,
  useDocLang,
  useDocPm,
  type TerminalTab,
} from '../../components/DocBlocks'
import {
  Arrow,
  CARD,
  FolderVisual,
  GridBg,
  ICON,
  LINE,
  RouteVisual,
} from '../../components/DocVisuals'
import type { TocItem } from '../../components/TableOfContents'

const TOC_ITEMS: TocItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'static-params', label: 'staticParams' },
  { id: 'prerender-opt-out', label: 'prerender = false' },
  { id: 'build-command', label: 'Build Command' },
  { id: 'output-structure', label: 'Output Structure' },
  { id: 'crawling', label: 'Crawling & Shell Fallback' },
  { id: 'hydration', label: 'Client Entry & Hydration' },
  { id: 'not-found', label: '404 Handling' },
  { id: 'hosting', label: 'Static Hosts' },
  { id: 'complete-example', label: 'Complete Example' },
]

/* ---- package-manager helpers ---- */

const PMS = ['npm', 'pnpm', 'yarn', 'bun'] as const
type Pm = (typeof PMS)[number]

const run = (pm: Pm, script: string) => {
  if (pm === 'npm') return `npm run ${script}`
  if (pm === 'bun') return `bun run ${script}`
  return `${pm} ${script}`
}

const tabs = (cmd: (pm: Pm) => string): TerminalTab[] =>
  PMS.map((pm) => ({ id: pm, label: pm, command: cmd(pm) }))

const Ok = ({ children }: { children: string }) => (
  <span className="text-emerald-600 dark:text-emerald-400">{children}</span>
)

/* ---------- visuals ---------- */

const CRAWLED = [
  { href: '/blog/my-first-post', out: 'dist/blog/my-first-post/index.html' },
  { href: '/blog/hello-world', out: 'dist/blog/hello-world/index.html' },
]

function CrawlVisual() {
  const head = `flex h-9 items-center gap-2 border-b bg-neutral-50 px-3 text-[11px] font-medium text-neutral-500 dark:bg-neutral-950 dark:text-neutral-400 ${LINE}`
  const row = `flex h-12 items-center border-b px-3 last:border-0 ${LINE}`
  return (
    <GridBg>
      <div className="flex items-start gap-3">
        <div className={`${CARD} w-72 shrink-0`}>
          <div className={head}>
            <File className={ICON} strokeWidth={1.5} />
            <span>dist/blog/index.html</span>
          </div>
          {CRAWLED.map((c) => (
            <div key={c.href} className={row}>
              <span className="truncate text-[12px] text-neutral-700 dark:text-neutral-300">
                {`<a href="${c.href}">`}
              </span>
            </div>
          ))}
        </div>
        <div className="pt-px">
          <div className="h-9" />
          {CRAWLED.map((c) => (
            <div key={c.href} className="flex h-12 items-center">
              <Arrow />
            </div>
          ))}
        </div>
        <div className={`${CARD} w-80 shrink-0`}>
          <div className={head}>Discovered and pre-rendered</div>
          {CRAWLED.map((c) => (
            <div key={c.href} className={`${row} flex-col items-start justify-center gap-0.5`}>
              <span className="flex items-center gap-1.5 text-[12px] text-neutral-800 dark:text-neutral-200">
                <Globe className={ICON} strokeWidth={1.5} />
                {c.href}
              </span>
              <span className="truncate text-[11px] text-neutral-500">{c.out}</span>
            </div>
          ))}
        </div>
      </div>
    </GridBg>
  )
}

/* ---------- content ---------- */

function Content() {
  const lang = useDocLang()
  const pm = useDocPm()
  const t = lang === 'js' ? 'js' : 'ts'
  const x = lang === 'js' ? 'jsx' : 'tsx'

  return (
    <>
      <div className="mb-12">
        <P className="mb-4">
          Pre-rendering is built into the production build. Every route that can be rendered is
          rendered to HTML during <C>vite build</C> and written into <C>dist/</C>, so the first
          paint delivers real content while React hydrates in the background.
        </P>
        <P className="mb-0">
          There is no separate export command and no export mode to enable. The same build that
          bundles your client also produces the pre-rendered pages.
        </P>
      </div>

      <Section id="how-it-works" title="How It Works">
        <P className="mb-4">
          During the build, each of the following steps runs in order:
        </P>
        <RouteVisual
          fileWidth={300}
          rows={[
            { n: 'src' },
            { n: 'app', d: 1 },
            { n: `page.${x}`, d: 2, url: '/' },
            { n: 'blog', d: 2 },
            { n: `page.${x}`, d: 3, url: '/blog' },
            { n: '[slug]', d: 3 },
            { n: `page.${x}`, d: 4, dot: true, url: '/blog/:slug' },
          ]}
        />
        <UL className="space-y-2">
          <li>
            <strong className="font-medium text-black dark:text-white">Reads your routes</strong>{' '}
            from the router, so static routes and dynamic patterns are both known.
          </li>
          <li>
            <strong className="font-medium text-black dark:text-white">Expands staticParams</strong>{' '}
            so dynamic routes that export it become concrete URLs.
          </li>
          <li>
            <strong className="font-medium text-black dark:text-white">Renders</strong> each URL
            through the built-in SSR entry and writes the resulting HTML into <C>dist/</C>.
          </li>
          <li>
            <strong className="font-medium text-black dark:text-white">Crawls</strong> every
            rendered page for internal links and renders those URLs too.
          </li>
          <li>
            <strong className="font-medium text-black dark:text-white">Writes shell pages</strong>{' '}
            for routes that cannot be rendered server-side.
          </li>
          <li>
            <strong className="font-medium text-black dark:text-white">Injects metadata</strong>{' '}
            and route-scoped CSS, and writes a <C>404.html</C>.
          </li>
        </UL>
      </Section>

      <Section id="static-params" title="staticParams">
        <P className="mb-4">
          Export <C>staticParams</C> from a dynamic page to declare which URLs should be
          pre-rendered. It works independently of link crawling, so you can guarantee coverage of
          every known parameter.
        </P>
        <CodeBlock
          filename={`src/app/blog/[slug]/page.${x}`}
          tsCode={`// src/app/blog/[slug]/page.tsx
export async function staticParams() {
  return [{ slug: 'hello-world' }, { slug: 'second-post' }]
}`}
          jsCode={`// src/app/blog/[slug]/page.jsx
export async function staticParams() {
  return [{ slug: 'hello-world' }, { slug: 'second-post' }]
}`}
        />
        <P className="mt-4 mb-4">
          Each object is substituted into the route pattern. Named segments such as <C>:slug</C>{' '}
          accept a string or number. A trailing <C>*</C> or <C>**</C> accepts the{' '}
          <C>&apos;*&apos;</C> key, as either an array of segments or a string that is split on{' '}
          <C>/</C>.
        </P>
        <Callout>
          A dynamic route without <C>staticParams</C> that no rendered page links to will only get
          a shell page. To pre-render it as full HTML, list its URLs in <C>staticParams</C> or link
          to it from a rendered page.
        </Callout>
      </Section>

      <Section id="prerender-opt-out" title="prerender = false">
        <P className="mb-4">
          Opt a page out of server rendering by exporting <C>prerender = false</C>:
        </P>
        <CodeBlock
          filename={`src/app/admin/page.${x}`}
          tsCode={`// src/app/admin/page.tsx
export const prerender = false`}
          jsCode={`// src/app/admin/page.jsx
export const prerender = false`}
        />
        <P className="mt-4 mb-4">
          A shell page is still written at that URL, but the SSR renderer is never called for it.
          Use this for pages that only make sense on the client, such as authenticated dashboards
          or views that depend on browser APIs.
        </P>
      </Section>

      <Section id="build-command" title="Build Command">
        <P className="mb-4">
          Build your app for production. The client, the server bundle, and all pre-rendered HTML
          are produced in a single pass.
        </P>
        <MultiTerminal tabs={tabs((pm) => `$ ${run(pm, 'build')}`)} />
        <P className="mt-4 mb-4">
          To serve the build on a Node.js host, use the start command. It runs the production
          server, which serves the pre-rendered pages and the compiled API together:
        </P>
        <MultiTerminal tabs={tabs((pm) => `$ ${run(pm, 'start')}`)} />
        <Table
          headers={['Command', 'Purpose']}
          rows={[
            [
              <C key="build">{run(pm, 'build')}</C>,
              'Builds the client, builds the server bundle, and pre-renders every route to dist/.',
            ],
            [
              <C key="start">{run(pm, 'start')}</C>,
              'Serves the built app on a Node.js server, including API routes.',
            ],
          ]}
        />
      </Section>

      <Section id="output-structure" title="Output Structure">
        <P className="mb-4">
          Each route is written as its own folder with an <C>index.html</C>. Highlighted files were
          produced by crawling or expanded from <C>staticParams</C>. The <C>[slug]</C> and{' '}
          <C>[...slug]</C> folders are shell fallbacks for dynamic routes that were never
          pre-rendered.
        </P>
        <RouteVisual
          fileWidth={320}
          rows={[
            { n: 'dist' },
            { n: 'index.html', d: 1, url: '/' },
            { n: 'about', d: 1 },
            { n: 'index.html', d: 2, url: '/about' },
            { n: 'blog', d: 1 },
            { n: 'index.html', d: 2, url: '/blog' },
            { n: 'my-first-post', d: 2 },
            { n: 'index.html', d: 3, dot: true, url: '/blog/my-first-post' },
            { n: 'hello-world', d: 2 },
            { n: 'index.html', d: 3, dot: true, url: '/blog/hello-world' },
            { n: '[slug]', d: 2 },
            { n: 'index.html', d: 3, url: '/blog/:slug' },
            { n: 'docs', d: 1 },
            { n: 'getting-started', d: 2 },
            { n: 'index.html', d: 3, dot: true, url: '/docs/getting-started' },
            { n: '[...slug]', d: 2 },
            { n: 'index.html', d: 3, url: '/docs/*' },
            { n: '404.html', d: 1 },
            { n: 'api', d: 1 },
            { n: 'index.mjs', d: 2 },
            { n: 'index-[hash].js', d: 1 },
            { n: 'index-[hash].css', d: 1 },
          ]}
        />
        <Callout>
          A dynamic route that is linked from a rendered page, or listed in <C>staticParams</C>, is
          written as full HTML. Everything else falls back to a shell page.
        </Callout>
      </Section>

      <Section id="crawling" title="Crawling & Shell Fallback">
        <P className="mb-4">
          After rendering static routes and any <C>staticParams</C> URLs, the build reads each
          rendered page for internal links and renders those URLs as well:
        </P>
        <CrawlVisual />
        <P className="mb-4">
          This repeats until no new URLs are discovered. Some routes cannot be rendered server-side
          - those with <C>prerender = false</C>, client-only routes with data exports such as{' '}
          <C>loader</C>, and dynamic patterns that no page links to and that are not listed in{' '}
          <C>staticParams</C>. Each of those receives a shell page with an empty <C>#root</C> and
          this marker in <C>&lt;head&gt;</C>:
        </P>
        <CodeBlock lang="text" code={`<script>window.__BINI_SHELL__=true;</script>`} />
        <Callout>
          Linked dynamic routes are fully pre-rendered, so they load instantly and are indexed by
          search engines. Unlinked ones still work through the shell fallback - no 404, and they
          hydrate on the client.
        </Callout>
      </Section>

      <Section id="hydration" title="Client Entry & Hydration">
        <P className="mb-4">
          The marker script only sets a flag. The client entry decides how to mount the app based
          on it:
        </P>
        <UL>
          <li>
            If <C>window.__BINI_SHELL__ === true</C>, or <C>#root</C> is empty, call{' '}
            <C>createRoot(root).render(&lt;App /&gt;)</C>.
          </li>
          <li>
            Otherwise call <C>hydrateRoot(root, &lt;App /&gt;)</C>.
          </li>
        </UL>
        <P className="mt-4 mb-0">
          A pre-rendered page already contains its markup, so hydrating it attaches the client app
          without a second render. A shell page has an empty <C>#root</C>, so attempting to hydrate
          it would fail - hence the flag.
        </P>
      </Section>

      <Section id="not-found" title="404 Handling">
        <P className="mb-4">
          <C>404.html</C> is always written to <C>dist/</C>. What goes inside depends on your app:
        </P>
        <FolderVisual
          width={300}
          rows={[
            { n: 'src' },
            { n: 'app', d: 1 },
            { n: `not-found.${x}`, d: 2, dot: true },
            { n: 'dist' },
            { n: '404.html', d: 1, dot: true },
            { n: 'index.html', d: 1 },
          ]}
        />
        <Table
          headers={['Situation', 'What gets written to 404.html']}
          rows={[
            [
              <C key="nf">{`src/app/not-found.${x}`}</C>,
              'Your custom not-found page, pre-rendered to HTML.',
            ],
            ['No custom not-found file', 'The built-in 404 page.'],
            [
              'Rendering /404 fails',
              'A shell page - not counted as a build failure.',
            ],
          ]}
        />
      </Section>

      <Section id="hosting" title="Static Hosts">
        <P className="mb-4">
          The Web build can be served directly from any static host. Both static and dynamic
          routes work:
        </P>
        <Table
          headers={['Host', 'Static routes', 'Dynamic routes']}
          rows={[
            [
              'GitHub Pages',
              <Ok key="a1">✓ pre-rendered</Ok>,
              <Ok key="a2">✓ crawled + pre-rendered, shell fallback</Ok>,
            ],
            [
              'AWS S3 + CloudFront',
              <Ok key="b1">✓ pre-rendered</Ok>,
              <Ok key="b2">✓ crawled + pre-rendered, shell fallback</Ok>,
            ],
            [
              'Firebase Hosting',
              <Ok key="c1">✓ pre-rendered</Ok>,
              <Ok key="c2">✓ crawled + pre-rendered, shell fallback</Ok>,
            ],
            [
              'Surge.sh',
              <Ok key="d1">✓ pre-rendered</Ok>,
              <Ok key="d2">✓ crawled + pre-rendered, shell fallback</Ok>,
            ],
          ]}
        />
      </Section>

      <Section id="complete-example" title="Complete Example">
        <P className="mb-4">
          Deploy to GitHub Pages. If your site is served under a subpath, set <C>base</C> in{' '}
          <C>{`vite.config.${t}`}</C> first:
        </P>
        <CodeBlock
          filename={`vite.config.${t}`}
          code={`import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/my-app/',  // GitHub Pages subpath
  plugins: [
    react(),
    // ...your other plugins
  ],
})`}
        />
        <P className="mt-4 mb-4">
          Build the app, then push the contents of <C>dist/</C> to your GitHub Pages branch (or
          upload them through the GitHub Pages UI).
        </P>
        <MultiTerminal tabs={tabs((pm) => `$ ${run(pm, 'build')}`)} />
      </Section>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link to="/docs/deploying" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Deployment Overview</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Where to deploy a Bini.js app.</p>
        </Link>
        <Link to="/docs/production-server" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Production Server</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Run the production server for Node.js hosting.</p>
        </Link>
        <Link to="/docs/hosting" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Hosting Providers</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Platform-specific deployment notes.</p>
        </Link>
        <Link to="/docs/layouts-and-pages" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Layouts and Pages</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">How routes map to pages in the app directory.</p>
        </Link>
      </div>
    </>
  )
}

export default function StaticExportPage() {
  return (
    <DocPage
      title="Static Export"
      description="Pre-render your Bini.js app to static HTML, ready for any static host."
      url="https://bini.js.org/docs/static-export"
      editUrl="https://github.com/Binidu01/bini-official/edit/main/src/app/docs/static-export.tsx"
      toc={TOC_ITEMS}
      prev={{ to: '/docs/production-server', title: 'Production Server' }}
      next={{ to: '/docs/hosting', title: 'Hosting Providers' }}
    >
      <Content />
    </DocPage>
  )
}