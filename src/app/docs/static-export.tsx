// src/app/docs/static-export.tsx
import { File, Globe } from 'lucide-react'

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
  { id: 'render-function', label: 'Your render() Function' },
  { id: 'build-command', label: 'Build Command' },
  { id: 'output-structure', label: 'Output Structure' },
  { id: 'shell-pages', label: 'Crawling & Shell Fallback' },
  { id: '404-handling', label: '404 Handling' },
  { id: 'static-hosts', label: 'Works on Any Static Host' },
  { id: 'complete-example', label: 'Complete Example' },
]

const BUILD_TABS = [
  { id: 'npm', label: 'npm', command: '$ npm run build' },
  { id: 'pnpm', label: 'pnpm', command: '$ pnpm build' },
  { id: 'yarn', label: 'yarn', command: '$ yarn build' },
  { id: 'bun', label: 'bun', command: '$ bun run build' },
]

const Ok = ({ children }: { children: string }) => (
  <span className="text-emerald-600 dark:text-emerald-400">{children}</span>
)

/* ---------- visuals ---------- */

const CRAWLED = [
  { href: '/blog/my-first-post', out: 'dist/blog/my-first-post/index.html' },
  { href: '/blog/hello-world', out: 'dist/blog/hello-world/index.html' },
]

/** A rendered page's links on the left, the pages bini-ssg discovers from them on the right. */
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

/* ---------- content (reads the TS/JS choice from DocPage) ---------- */

function Content() {
  const lang = useDocLang()
  const x = lang === 'js' ? 'jsx' : 'tsx'

  return (
    <>
      <div className="mb-12">
        <P className="mb-4">
          <C>bini-ssg</C> pre-renders every route - static <em>and</em> dynamic - to static HTML as
          part of <C>npm run build</C>. It starts from your static routes, then{' '}
          <strong className="font-medium text-black dark:text-white">
            crawls every rendered page for internal links
          </strong>{' '}
          and pre-renders those too. A blog post at <C>/blog/my-first-post</C> linked from{' '}
          <C>/blog</C> is fully pre-rendered - no extra config, no <C>getStaticPaths</C>.
        </P>
        <P className="mb-6">
          There is no separate export command or export mode. The output is real server-rendered
          markup, not a client-only shell, ready for GitHub Pages, S3, Firebase, Surge, and any other
          static host.
        </P>
        <Callout>
          <strong>Web target only.</strong> Static export applies to the Node.js/web target. Desktop
          and mobile builds (Windows, macOS, Linux, Android, iOS) do not use <C>bini-ssg</C> - they
          package the same routes into a native binary instead.
        </Callout>
      </div>

      <Section id="how-it-works" title="How It Works">
        <P className="mb-4">
          <C>bini-ssg</C> is a Vite build plugin that runs during <C>vite build</C>. It:
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
        <P className="mb-4">
          Static routes (<C>/</C>, <C>/blog</C>) come straight from the route list. Dynamic routes
          like the highlighted <C>/blog/:slug</C> are discovered by crawling.
        </P>
        <UL className="space-y-2">
          <li>
            <strong className="font-medium text-black dark:text-white">Reads your route list</strong>{' '}
            from <C>bini-router</C>&apos;s <C>generateRouteManifest()</C>
          </li>
          <li>
            <strong className="font-medium text-black dark:text-white">
              Calls your <C>render()</C> function
            </strong>{' '}
            for every static route
          </li>
          <li>
            <strong className="font-medium text-black dark:text-white">Crawls</strong> each rendered
            HTML for internal <C>&lt;a href&gt;</C> links and discovers dynamic routes (e.g.{' '}
            <C>/blog/my-first-post</C> linked from <C>/blog</C>)
          </li>
          <li>
            <strong className="font-medium text-black dark:text-white">Pre-renders</strong> every
            discovered dynamic route with your <C>render()</C> - full HTML, not a shell
          </li>
          <li>
            <strong className="font-medium text-black dark:text-white">
              Falls back to shell pages
            </strong>{' '}
            only for dynamic routes that were never linked (still valid - hydrated on client)
          </li>
          <li>
            <strong className="font-medium text-black dark:text-white">
              Writes one <C>index.html</C>
            </strong>{' '}
            per route into your output directory
          </li>
        </UL>
        <Callout>
          <strong>Zero config crawling.</strong> If a page links to <C>/docs/getting-started</C>,{' '}
          <C>/blog/hello-world</C>, or <C>/users/123</C>, bini-ssg finds it and pre-renders it. You
          don&apos;t need <C>getStaticPaths</C> or a manifest.
        </Callout>
      </Section>

      <Section id="render-function" title="Your render() Function">
        <P className="mb-4">
          The <C>render()</C> function is exported from <C>{`src/main.${x}`}</C> and called by{' '}
          <C>bini-ssg</C> for every static route:
        </P>
        <CodeBlock
          filename={`src/main.${x}`}
          tsCode={`import { createRoot } from 'react-dom/client'
import App from './App'

// Client mount
createRoot(document.getElementById('root')!).render(<App />)

// SSG render (called by bini-ssg, Node-only)
export async function render(url: string): Promise<string> {
  const { renderToString } = await import('react-dom/server')
  const { StaticRouter } = await import('react-router-dom/server')
  const { AppRoutes } = await import('./App')

  return renderToString(
    <StaticRouter location={url}>
      <AppRoutes />
    </StaticRouter>
  )
}`}
          jsCode={`import { createRoot } from 'react-dom/client'
import App from './App'

// Client mount
createRoot(document.getElementById('root')).render(<App />)

// SSG render (called by bini-ssg, Node-only)
export async function render(url) {
  const { renderToString } = await import('react-dom/server')
  const { StaticRouter } = await import('react-router-dom/server')
  const { AppRoutes } = await import('./App')

  return renderToString(
    <StaticRouter location={url}>
      <AppRoutes />
    </StaticRouter>
  )
}`}
        />
        <P className="mt-4">
          This function uses React 19&apos;s <C>renderToPipeableStream</C> under the hood with{' '}
          <C>StaticRouter</C> from React Router, producing real server-rendered HTML.
        </P>
        <Callout>
          <strong>Already scaffolded:</strong> The <C>render()</C> function is already in your
          project. You only need to modify it if you need custom server rendering logic.
        </Callout>
      </Section>

      <Section id="build-command" title="Build Command">
        <Table
          headers={['Command', 'When to use']}
          rows={[
            [
              <C key="build">npm run build</C>,
              'Pre-renders every route to static HTML - GitHub Pages, S3, Firebase, Surge, and any static host',
            ],
            [
              <C key="start">npm run start</C>,
              'Serves the production build with API routes - Node.js hosts (Railway, Render, Fly.io, VPS)',
            ],
          ]}
        />
        <P className="mt-4">
          <C>npm run build</C> type-checks (TypeScript projects) and then runs <C>vite build</C>. The{' '}
          <C>bini-ssg</C> plugin drives pre-rendering as part of that same build.
        </P>
        <MultiTerminal tabs={BUILD_TABS} />
      </Section>

      <Section id="output-structure" title="Output Structure">
        <P className="mb-4">
          Each route becomes its own folder with an <C>index.html</C>. Highlighted files were found
          by crawling and pre-rendered; the <C>[slug]</C> and <C>[...slug]</C> folders are shell
          fallbacks for dynamic routes that were never linked.
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
            { n: 'js', d: 1 },
            { n: 'index-[hash].js', d: 2 },
            { n: 'css', d: 1 },
            { n: 'index-[hash].css', d: 2 },
          ]}
        />
        <Callout>
          Dynamic routes that are <strong>linked somewhere</strong> in your app are pre-rendered as
          real HTML. Only routes that were never discovered during crawling get the shell fallback.
        </Callout>
      </Section>

      <Section id="shell-pages" title="Crawling & Shell Fallback">
        <P className="mb-4">
          After pre-rendering static routes, <C>bini-ssg</C> parses each HTML file for internal
          links and crawls them:
        </P>
        <CrawlVisual />
        <P className="mb-4">
          This repeats recursively - if <C>/blog/my-first-post</C> links to <C>/users/123</C>, that
          page is also pre-rendered. Crawling respects your <C>base</C> path and skips external
          links, hashes, and <C>/api/*</C>.
        </P>
        <P className="mb-4">
          Only dynamic routes that were{' '}
          <strong className="font-medium text-black dark:text-white">never discovered</strong>{' '}
          during crawling get a shell page with a marker script:
        </P>
        <CodeBlock lang="text" code={`<script>window.__BINI_SHELL__=true;</script>`} />
        <P className="mt-4">
          Your client entry checks this flag to decide between <C>createRoot</C> and{' '}
          <C>hydrateRoot</C>:
        </P>
        <CodeBlock
          filename={`src/main.${x}`}
          tsCode={`const root = document.getElementById('root')!

if (window.__BINI_SHELL__) {
  createRoot(root).render(<App />)
} else {
  hydrateRoot(root, <App />)
}`}
          jsCode={`const root = document.getElementById('root')

if (window.__BINI_SHELL__) {
  createRoot(root).render(<App />)
} else {
  hydrateRoot(root, <App />)
}`}
        />
        <Callout>
          <strong>Best of both worlds.</strong> Linked dynamic routes are fully pre-rendered for SEO
          and instant loads. Unlinked ones still work via the shell fallback - no 404, hydrated on
          client. To guarantee pre-rendering, just make sure a page links to it.
        </Callout>
      </Section>

      <Section id="404-handling" title="404 Handling">
        <P className="mb-4">
          You can enable <C>404.html</C> generation with the <C>fallback</C> option:
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
        <CodeBlock
          filename="vite.config.ts"
          code={`// vite.config.ts
import { defineConfig } from 'vite'
import { biniSSG } from 'bini-ssg'

export default defineConfig({
  plugins: [
    // ...other plugins
    biniSSG({
      fallback: true,  // Render '/404' as 404.html
    }),
  ],
})`}
        />
        <Table
          headers={['Situation', 'What gets written to 404.html']}
          rows={[
            [
              <C key="nf">{`src/app/not-found.${x}`}</C>,
              'Your custom not-found page is pre-rendered to HTML',
            ],
            ['No custom not-found file', 'Built-in 404 page is used'],
          ]}
        />
        <Callout>
          <strong>Default:</strong> <C>fallback</C> is <C>false</C>. Enable it to generate{' '}
          <C>404.html</C> for static hosts that support it.
        </Callout>
      </Section>

      <Section id="static-hosts" title="Works on Any Fully Static Host">
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
        <P className="mb-4">A full setup for deploying to GitHub Pages with true SSG:</P>
        <CodeBlock
          filename="vite.config.ts"
          code={`import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { biniroute } from 'bini-router'
import { biniEnv } from 'bini-env'
import { biniSSG } from 'bini-ssg'

export default defineConfig({
  base: '/my-app/',  // GitHub Pages subpath
  plugins: [
    react(),
    biniEnv(),
    ...biniroute(),
    biniSSG({
      fallback: true,        // Generate 404.html
    }),
  ],
})`}
        />
        <P className="mt-4">
          Run <C>npm run build</C>, then push the contents of <C>dist/</C> to your GitHub Pages
          branch (or upload them through the GitHub Pages UI).
        </P>
        <MultiTerminal tabs={BUILD_TABS} />
      </Section>
    </>
  )
}

/* ---------- page ---------- */

export default function StaticExportPage() {
  return (
    <DocPage
      title="Static Export"
      description="Pre-render your Bini.js app to static HTML with bini-ssg, ready for any static host."
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