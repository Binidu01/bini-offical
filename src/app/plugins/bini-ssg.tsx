// src/app/plugins/bini-ssg/page.tsx
import {
  Callout,
  C,
  CodeBlock,
  MultiTerminal,
  OutputBlock,
  P,
  Section,
  Table,
  UL,
} from '../../components/DocBlocks'
import { FolderVisual } from '../../components/DocVisuals'
import { PluginPage } from '../../components/PluginPage'
import type { TocItem } from '../../components/TableOfContents'

const TOC_ITEMS: TocItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'installation', label: 'Installation' },
  { id: 'quick-start', label: 'Quick Start' },
  { id: 'render', label: 'Implementing render()' },
  { id: 'crawling', label: 'Crawling and Shells' },
  { id: 'metadata', label: 'Metadata and CSS' },
  { id: 'options', label: 'Options' },
  { id: 'output', label: 'Output' },
  { id: 'hosting', label: 'Hosting' },
  { id: 'requirements', label: 'Requirements' },
  { id: 'troubleshooting', label: 'Troubleshooting' },
]

const EDIT_URL =
  'https://github.com/Binidu01/bini-official/edit/main/src/app/plugins/bini-ssg/page.tsx'

const H3_CLS = 'mb-3 mt-8 text-base font-semibold text-neutral-900 dark:text-neutral-200'
const STRONG = 'font-medium text-neutral-900 dark:text-neutral-100'

const SSG_OUTPUT_TEXT = `STEP Pre-rendering routes
  ok    /             -> dist/index.html
  ok    /about        -> dist/about/index.html
  ok    /blog         -> dist/blog/index.html
  ok    /blog/hello   -> dist/blog/hello/index.html

SUCCESS Pre-rendered 4 routes`

function SsgOutput() {
  const ok = <span className="text-emerald-600 dark:text-emerald-400">ok</span>
  const path = (p: string) => (
    <span className="text-neutral-800 dark:text-neutral-200">{p}</span>
  )
  const out = (p: string) => <span className="text-neutral-500">{p}</span>
  return (
    <OutputBlock code={SSG_OUTPUT_TEXT}>
      <span className="font-semibold text-cyan-700 dark:text-cyan-400">STEP</span>{' '}
      <span className="text-neutral-700 dark:text-neutral-300">Pre-rendering routes</span>
      {'\n'}
      {'  '}
      {ok}
      {'    '}
      {path('/')}
      {'             '}
      <span className="text-neutral-500">-&gt;</span> {out('dist/index.html')}
      {'\n'}
      {'  '}
      {ok}
      {'    '}
      {path('/about')}
      {'        '}
      <span className="text-neutral-500">-&gt;</span> {out('dist/about/index.html')}
      {'\n'}
      {'  '}
      {ok}
      {'    '}
      {path('/blog')}
      {'         '}
      <span className="text-neutral-500">-&gt;</span> {out('dist/blog/index.html')}
      {'\n'}
      {'  '}
      {ok}
      {'    '}
      {path('/blog/hello')}
      {'   '}
      <span className="text-neutral-500">-&gt;</span> {out('dist/blog/hello/index.html')}
      {'\n'}
      {'\n'}
      <span className="font-semibold text-emerald-600 dark:text-emerald-400">SUCCESS</span>{' '}
      <span className="text-neutral-700 dark:text-neutral-300">
        Pre-rendered <strong className="font-bold text-neutral-900 dark:text-white">4</strong>{' '}
        routes
      </span>
    </OutputBlock>
  )
}

export default function BiniSsgPage() {
  return (
    <PluginPage
      title="bini-ssg"
      badge="Official"
      description="Static site generation for Bini.js - pre-renders your routes to HTML during vite build."
      url="https://bini.dev/plugins/bini-ssg"
      editUrl={EDIT_URL}
      toc={TOC_ITEMS}
      prev={{ to: '/plugins/bini-overlay', title: 'bini-overlay' }}
      next={{ to: '/plugins/bini-deploy', title: 'bini-deploy' }}
    >
      <Section id="overview" title="Overview">
        <P>
          <C>bini-ssg</C> pre-renders your routes to HTML during <C>vite build</C>. Route
          discovery, link crawling, metadata injection, and shell fallbacks ship in a single Vite
          build plugin - no dev-server changes, no separate CLI.
        </P>
        <UL>
          <li>
            <strong className={STRONG}>Build-only.</strong> Runs at <C>apply: 'build'</C>; never
            touches <C>vite dev</C>.
          </li>
          <li>
            <strong className={STRONG}>Automatic discovery.</strong> Static routes come from
            bini-router's route manifest.
          </li>
          <li>
            <strong className={STRONG}>Link crawling.</strong> Internal <C>{'<a href>'}</C> links
            in rendered HTML are followed up to <C>crawlDepth</C>, so dynamic URLs get fully
            pre-rendered.
          </li>
          <li>
            <strong className={STRONG}>Shell fallback.</strong> Unmatched dynamic patterns still
            get a client-rendered shell page.
          </li>
          <li>
            <strong className={STRONG}>Per-route metadata + CSS.</strong> Title, description, Open
            Graph, Twitter, icons, and route-scoped stylesheets are injected into each page.
          </li>
          <li>
            <strong className={STRONG}>Resilient.</strong> If <C>render()</C> throws, that route
            falls back to a shell and the build continues.
          </li>
        </UL>
        <Callout>
          <C>bini-ssg</C> does not supply a <C>render()</C> implementation. You export one from{' '}
          <C>src/main.*</C> - see{' '}
          <a href="#render" className="underline">
            Implementing render()
          </a>
          .
        </Callout>
      </Section>

      <Section id="installation" title="Installation">
        <MultiTerminal
          tabs={[
            { id: 'npm', label: 'npm', command: `$ npm install --save-dev bini-ssg tsx` },
            { id: 'pnpm', label: 'pnpm', command: `$ pnpm add -D bini-ssg tsx` },
            { id: 'yarn', label: 'yarn', command: `$ yarn add -D bini-ssg tsx` },
            { id: 'bun', label: 'bun', command: `$ bun add -D bini-ssg tsx` },
          ]}
        />
        <Callout>
          <C>bini-router</C> must already be installed and configured - <C>bini-ssg</C> imports it
          at build time to discover routes and read per-route metadata/CSS.
        </Callout>
      </Section>

      <Section id="quick-start" title="Quick Start">
        <h3 className={H3_CLS}>1. Register the plugin</h3>
        <CodeBlock
          filename="vite.config.ts"
          lang="js"
          code={`import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { biniroute } from 'bini-router'
import { biniEnv } from 'bini-env'
import { biniSSG } from 'bini-ssg'

export default defineConfig({
  plugins: [react(), biniEnv(), ...biniroute(), biniSSG()],
})`}
        />

        <h3 className={H3_CLS}>2. Export render() from your entry</h3>
        <P>
          See{' '}
          <a href="#render" className="underline">
            Implementing render()
          </a>
          .
        </P>

        <h3 className={H3_CLS}>3. Build</h3>
        <MultiTerminal
          tabs={[
            { id: 'npm', label: 'npm', command: `$ npm run build` },
            { id: 'pnpm', label: 'pnpm', command: `$ pnpm build` },
            { id: 'yarn', label: 'yarn', command: `$ yarn build` },
            { id: 'bun', label: 'bun', command: `$ bun run build` },
          ]}
        />
        <SsgOutput />
      </Section>

      <Section id="render" title="Implementing render()">
        <P>
          <C>bini-ssg</C> imports <C>src/main.{'{tsx,jsx,ts,js}'}</C> in Node and calls its{' '}
          <C>render</C> export once per route:
        </P>
        <CodeBlock
          filename="src/main.tsx"
          lang="js"
          code={`export function render(url: string): Promise<string> | string`}
        />
        <P>
          <C>url</C> is the route being pre-rendered. The return value must be an HTML string - it
          gets inserted into <C>{'<div id="root">…</div>'}</C>.
        </P>
        <P>A typical implementation with React Router's StaticRouter:</P>
        <CodeBlock
          filename="src/main.tsx"
          lang="js"
          code={`import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App'

declare global {
  interface Window { __BINI_SHELL__?: boolean }
}

// Client mount (browser only)
if (typeof document !== 'undefined') {
  const container = document.getElementById('root')!

  if (window.__BINI_SHELL__ || !container.hasChildNodes()) {
    createRoot(container).render(<App />)   // shell or empty → client render
  } else {
    hydrateRoot(container, <App />)         // pre-rendered → hydrate
  }
}

// SSG render (Node only, called by bini-ssg)
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
        />
        <Callout>
          Your entry runs in two environments - browser and Node via <C>tsx</C>. Guard anything
          that touches <C>window</C>/<C>document</C> at module scope.
        </Callout>

        <h3 className={H3_CLS}>Client entry and hydration</h3>
        <P>
          <C>bini-ssg</C> writes two kinds of pages, and your client entry must treat them
          differently:
        </P>
        <Table
          headers={['Page type', '#root contents', 'Client should']}
          rows={[
            ['Pre-rendered', 'Full server-rendered HTML', 'hydrateRoot(...)'],
            ['Shell', 'Empty', 'createRoot(...).render(...)'],
          ]}
        />
        <P>
          Shell pages get this marker injected into <C>{'<head>'}</C>:
        </P>
        <CodeBlock
          filename="index.html"
          lang="html"
          code={`<script>window.__BINI_SHELL__=true;</script>`}
        />
        <P>
          Without it, React would try to hydrate an empty <C>#root</C> and throw hydration error
          #418.
        </P>

        <h3 className={H3_CLS}>Keep render() pure</h3>
        <P>
          Routes render sequentially in the same Node process by default. Module-scope state
          persists between routes, so the output of <C>render()</C> should be a pure function of{' '}
          <C>url</C>.
        </P>
      </Section>

      <Section id="crawling" title="Crawling and Shells">
        <P>
          Every page's rendered HTML is scanned for internal <C>{'<a href>'}</C> links. New URLs
          are queued and rendered, up to <C>crawlDepth</C> levels from the seed routes. So a{' '}
          <C>/blog</C> page that links to <C>/blog/hello-world</C> gets that URL pre-rendered as a
          full page.
        </P>
        <P>
          External links, <C>#anchors</C>, <C>mailto:</C>, and file references by extension are
          ignored. Set <C>crawlDepth: 0</C> to disable crawling.
        </P>

        <h3 className={H3_CLS}>Shell fallback</h3>
        <P>
          Any dynamic pattern that no crawled link matched still gets a shell page - your built{' '}
          <C>index.html</C> with the <C>__BINI_SHELL__</C> marker. <C>render()</C> is not called
          for shells; the client app takes over on load.
        </P>
        <FolderVisual
          width={340}
          rows={[
            { n: 'blog' },
            { n: ':slug', d: 1 },
            { n: '[slug]', d: 1, dot: true },
            { n: 'index.html', d: 2 },
            { n: 'docs' },
            { n: '[...slug]', d: 1, dot: true },
            { n: 'index.html', d: 2 },
          ]}
        />
        <P>
          If at least one crawled URL matched a pattern (e.g. <C>/blog/hello-world</C> for{' '}
          <C>/blog/:slug</C>), no shell is written for that pattern.
        </P>

        <h3 className={H3_CLS}>What crawling can't see</h3>
        <UL>
          <li>Links that only appear after client-side data fetching.</li>
          <li>
            Dynamic URLs that no rendered page links to. Link to them from a statically rendered
            page to get them pre-rendered.
          </li>
        </UL>
      </Section>

      <Section id="metadata" title="Metadata and CSS">
        <P>
          Once a page is rendered, <C>bini-ssg</C> asks bini-router for that route's metadata and
          CSS, and applies both before writing the file. Runs for crawled pages and shells alike.
          Best-effort - a failure here never fails the build.
        </P>
        <P>
          <C>bini-ssg</C> only consumes metadata; you author it in your route/layout files against
          bini-router's metadata API.
        </P>
        <CodeBlock
          filename="src/app/blog/[slug]/route.tsx"
          lang="js"
          code={`export const metadata = {
  title: 'How bini-ssg pre-renders routes',
  meta: {
    description: 'A look at link crawling, shells, and metadata injection.',
    robots: 'index, follow',
    canonical: 'https://example.com/blog/how-bini-ssg-works',
    openGraph: {
      title: 'How bini-ssg pre-renders routes',
      type: 'article',
      image: 'https://example.com/og.png',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'How bini-ssg pre-renders routes',
    },
  },
}`}
        />
        <P>
          Injected tags include <C>{'<title>'}</C>, description, robots, canonical, manifest,
          icons, Open Graph, and Twitter card. Existing tags with the same name/property/rel are
          updated in place.
        </P>
        <Callout>
          For dynamic routes, metadata is keyed by the route <em>pattern</em>, not by each resolved
          URL - every <C>/blog/:slug</C> URL gets the same metadata. For per-post titles, resolve
          them inside <C>render()</C> and write them into the HTML you return.
        </Callout>

        <h3 className={H3_CLS}>Route-scoped CSS</h3>
        <P>
          CSS modules imported by a specific route are resolved to their hashed build output and
          injected as <C>{'<link rel="stylesheet">'}</C> tags on that route's page, deduplicated
          across shared imports.
        </P>
      </Section>

      <Section id="options" title="Options">
        <CodeBlock
          filename="vite.config.ts"
          lang="js"
          code={`biniSSG({
  appDir      : 'src/app',
  outputDir   : undefined,
  includeRoot : true,
  fallback    : false,
  crawlDepth  : 3,
  concurrency : 1,
  failOnError : true,
  quiet       : false,
  minify      : true,
})`}
        />
        <Table
          headers={['Option', 'Default', 'Description']}
          rows={[
            ['appDir', "'src/app'", 'Routes directory passed to bini-router.'],
            ['outputDir', 'build.outDir', 'Where pre-rendered HTML is written.'],
            ['includeRoot', 'true', "Seed / even if bini-router didn't report it."],
            [
              'fallback',
              'false',
              'Also render /404 and write <outDir>/404.html for static-404 hosts.',
            ],
            ['crawlDepth', '3', 'Max link-following depth. 0 disables crawling.'],
            [
              'concurrency',
              '1',
              'Routes rendered in parallel. Raise only if render() has no shared module state.',
            ],
            ['failOnError', 'true', 'Fail the build on discovery, module-load, or write errors.'],
            ['quiet', 'false', 'Suppress all output.'],
            [
              'minify',
              'true',
              'Minify each written page with a hydration-safe html-minifier-terser config.',
            ],
          ]}
        />
        <Callout>
          A <C>render()</C> call that throws is not a build failure - that route falls back to a
          shell and the build continues.
        </Callout>
      </Section>

      <Section id="output" title="Output">
        <FolderVisual
          width={320}
          rows={[
            { n: 'dist', dot: true },
            { n: 'index.html', d: 1 },
            { n: 'about', d: 1 },
            { n: 'index.html', d: 2 },
            { n: 'blog', d: 1 },
            { n: 'index.html', d: 2 },
            { n: 'hello-world', d: 2 },
            { n: 'index.html', d: 3 },
            { n: 'docs', d: 1 },
            { n: '[...slug]', d: 2 },
            { n: 'index.html', d: 3 },
            { n: 'assets', d: 1 },
          ]}
        />
        <UL>
          <li>
            <C>index.html</C> - pre-rendered <C>/</C>.
          </li>
          <li>
            <C>about/index.html</C>, <C>blog/index.html</C> - static routes.
          </li>
          <li>
            <C>blog/hello-world/index.html</C> - crawled dynamic URL, fully pre-rendered.
          </li>
          <li>
            <C>docs/[...slug]/index.html</C> - shell, only when no crawled URL matched{' '}
            <C>/docs/*</C>.
          </li>
          <li>
            <C>assets/</C> - normal Vite output, unchanged.
          </li>
        </UL>
        <P>
          Add <C>404.html</C> at the root when <C>fallback: true</C>. Routes are deduplicated
          before rendering.
        </P>
      </Section>

      <Section id="hosting" title="Hosting">
        <UL>
          <li>
            Static hosts serve <C>about/index.html</C> for <C>/about</C> automatically, so
            pre-rendered routes work with no config.
          </li>
          <li>
            Shell pages live in literal <C>[param]</C> directories. Hosts won't map{' '}
            <C>/blog/some-post</C> onto that path - add a rewrite or SPA-fallback rule for those
            patterns.
          </li>
          <li>
            Use <C>fallback: true</C> for hosts that look for a top-level <C>404.html</C> (Netlify,
            GitHub Pages).
          </li>
        </UL>
      </Section>

      <Section id="requirements" title="Requirements">
        <Table
          headers={['Dependency', 'Version', 'Notes']}
          rows={[
            ['Node.js', '>= 18', '18.19+ / 20.6+ recommended'],
            ['Vite', '^8.0.0', 'Peer'],
            ['bini-router', '>= 2.0.0', 'Required'],
            ['react, react-dom', '>= 18', 'Peer'],
            ['react-router-dom', '>= 6', 'Peer'],
            ['tsx', '^4.0.0', 'Required - loads TS/JSX in Node'],
          ]}
        />
        <P>
          <C>node-html-parser</C>, <C>p-limit</C>, and <C>html-minifier-terser</C> are installed
          automatically.
        </P>
      </Section>

      <Section id="troubleshooting" title="Troubleshooting">
        <UL>
          <li>
            <strong className={STRONG}>Failed to load bini-router manifest</strong> - bini-router
            isn't installed, or <C>appDir</C> points at the wrong directory.
          </li>
          <li>
            <strong className={STRONG}>File … must export a render(url) function</strong> -{' '}
            <C>src/main.*</C> loaded but has no <C>render</C> export.
          </li>
          <li>
            <strong className={STRONG}>Failed to load src/main.tsx</strong> - an import failed
            under Node. Confirm <C>tsx</C> is installed, and check module-scope code doesn't rely
            on browser globals or <C>import.meta.env</C>.
          </li>
          <li>
            <strong className={STRONG}>Hydration error #418</strong> - the page is a shell, but
            the client called <C>hydrateRoot</C>. Check <C>window.__BINI_SHELL__</C> before
            choosing between <C>createRoot</C> and <C>hydrateRoot</C>.
          </li>
          <li>
            <strong className={STRONG}>A route rendered as a shell unexpectedly</strong> -{' '}
            <C>render()</C> threw for that URL. Call <C>render('/that-route')</C> directly to see
            the error.
          </li>
          <li>
            <strong className={STRONG}>A dynamic URL wasn't pre-rendered</strong> - no rendered
            page links to it. Link to it from a static page, or accept the shell.
          </li>
          <li>
            <strong className={STRONG}>Metadata or route-scoped CSS missing</strong> - injection
            is best-effort; bini-router may have thrown while resolving it for that route.
          </li>
          <li>
            <strong className={STRONG}>Build stops early</strong> - <C>bini-ssg</C> calls{' '}
            <C>process.exit(0)</C> after a successful run. Other plugins' <C>closeBundle</C> hooks
            after it won't run.
          </li>
        </UL>
      </Section>
    </PluginPage>
  )
}