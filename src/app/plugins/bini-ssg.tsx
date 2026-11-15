// src/app/plugins/bini-ssg/page.tsx
import type { ReactNode } from 'react'

import {
  C,
  Callout,
  CodeBlock,
  MultiTerminal,
  OutputBlock,
  P,
  Section,
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
  { id: 'quick-start', label: 'Quick Start' },
  { id: 'static-params', label: 'Static Params' },
  { id: 'prerender-opt-out', label: 'Opting Out of Prerender' },
  { id: 'crawling', label: 'Link Crawling' },
  { id: 'output', label: 'Output' },
]

const EDIT_URL =
  'https://github.com/Binidu01/bini-official/edit/main/src/app/plugins/bini-ssg/page.tsx'

/* ---- package-manager tab helpers ---------------------------------- */

const PMS = ['npm', 'pnpm', 'yarn', 'bun'] as const
type Pm = (typeof PMS)[number]

const INSTALL: Record<Pm, string> = {
  npm: 'npm install --save-dev bini-ssg',
  pnpm: 'pnpm add -D bini-ssg',
  yarn: 'yarn add -D bini-ssg',
  bun: 'bun add -D bini-ssg',
}

const tabs = (cmd: (pm: Pm) => string): TerminalTab[] =>
  PMS.map((pm) => ({ id: pm, label: pm, command: cmd(pm) }))

/* ---- build output (each section aligns its own columns) ---------- */

const green = (s: string) => <span className="text-[#4af626] dark:text-[#89D185]">{s}</span>
const white = (s: string) => <span className="text-neutral-900 dark:text-white">{s}</span>
const cyan = (s: string) => <span className="text-[#00e5ff] dark:text-[#4FC1FF]">{s}</span>
const purple = (s: string) => <span className="text-[#AF00DB] dark:text-[#C586C0]">{s}</span>
const gray = (s: string) => <span className="text-neutral-600 dark:text-neutral-400">{s}</span>

type Row = [dir: string, file: string, color: (s: string) => ReactNode, size: string, gz: string]

type Block = {
  title: string
  modules?: number
  rows: Row[]
  time: string
}

const BLOCKS: Block[] = [
  {
    title: 'building client environment for production...',
    modules: 37,
    rows: [
      ['dist/', '.bini/css-map.json', green, '0.17 kB', '0.11 kB'],
      ['dist/', 'index.html', green, '0.28 kB', '0.22 kB'],
      ['dist/', 'css/layout-CS15oam5.css', purple, '11.86 kB', '3.27 kB'],
      ['dist/', 'js/layout-BU0XgUOt.js', cyan, '0.17 kB', '0.16 kB'],
      ['dist/', 'js/page-CtS8uloZ.js', cyan, '2.18 kB', '0.82 kB'],
      ['dist/', 'js/index-C6YM5h5n.js', cyan, '329.03 kB', '103.35 kB'],
    ],
    time: '299ms',
  },
  {
    title: 'building ssr environment for production...',
    modules: 12,
    rows: [
      ['dist/.bini/server/', 'chunks/layout-DZNjTB3r.js', cyan, '0.24 kB', '0.19 kB'],
      ['dist/.bini/server/', 'chunks/page-DFH1VqOL.js', cyan, '2.83 kB', '0.91 kB'],
      ['dist/.bini/server/', 'main.js', cyan, '18.97 kB', '4.79 kB'],
    ],
    time: '96ms',
  },
  {
    title: 'pre-rendering routes for production...',
    rows: [
      ['dist/', 'index.html', cyan, '3.21 kB', '1.23 kB'],
      ['dist/', '404.html', cyan, '1.75 kB', '0.83 kB'],
    ],
    time: '164ms',
  },
]

/** Column widths for one section, so only that section's rows line up together. */
function widths(rows: Row[]) {
  return {
    name: Math.max(...rows.map(([d, f]) => d.length + f.length)) + 2,
    size: Math.max(...rows.map((r) => r[3].length)),
    gz: Math.max(...rows.map((r) => r[4].length)),
  }
}

type Widths = ReturnType<typeof widths>

const rowText = ([d, f, , size, gz]: Row, w: Widths) =>
  `${d}${f}${' '.repeat(w.name - d.length - f.length)}${size.padStart(w.size)} │ gzip: ${gz.padStart(w.gz)}`

// Plain-text version, used for the copy button.
const SSG_OUTPUT_TEXT = BLOCKS.map((b) => {
  const w = widths(b.rows)
  return [
    `vite v8.3.7 ${b.title}`,
    ...(b.modules ? [`✓ ${b.modules} modules transformed.`] : []),
    'computing gzip size...',
    ...b.rows.map((r) => rowText(r, w)),
    '',
    `✓ built in ${b.time}`,
  ].join('\n')
}).join('\n')

function SsgOutput() {
  return (
    <OutputBlock code={SSG_OUTPUT_TEXT}>
      {BLOCKS.map((b, i) => {
        const w = widths(b.rows)
        return (
          <span key={i}>
            {cyan('vite v8.3.7')} {green(b.title)}
            {'\n'}
            {b.modules ? (
              <>
                {green('✓')} {white(`${b.modules} modules transformed.`)}
                {'\n'}
              </>
            ) : null}
            {white('computing gzip size...')}
            {'\n'}
            {b.rows.map(([d, f, color, size, gz], j) => (
              <span key={j}>
                {gray(d)}
                {color(f)}
                {' '.repeat(w.name - d.length - f.length)}
                {gray(size.padStart(w.size))} {gray('│ gzip:')} {gray(gz.padStart(w.gz))}
                {'\n'}
              </span>
            ))}
            {'\n'}
            {green('✓')} {white('built')} {green(`in ${b.time}`)}
            {i < BLOCKS.length - 1 ? '\n' : ''}
          </span>
        )
      })}
    </OutputBlock>
  )
}

export default function BiniSsgPage() {
  return (
    <PluginPage
      title="bini-ssg"
      badge="Official"
      description="Static site generation for Bini.js. Pre-renders your routes to HTML as part of a single vite build."
      url="https://www.npmjs.com/package/bini-ssg"
      editUrl={EDIT_URL}
      toc={TOC_ITEMS}
      prev={{ to: '/plugins/bini-overlay', title: 'bini-overlay' }}
      next={{ to: '/plugins/bini-deploy', title: 'bini-deploy' }}
    >
      <Section id="overview" title="Overview">
        <P>
          <C>bini-ssg</C> pre-renders your entire application to static HTML during{' '}
          <C>vite build</C>. It expands dynamic paths, crawls internal links, and writes fallback
          pages for client-only routes.
        </P>
        <P>
          The output is a fully static site (or a hybrid static/SPA app) that loads instantly and
          is perfectly optimized for SEO.
        </P>
      </Section>

      <Section id="requirements" title="Requirements">
        <UL>
          <li>
            Vite <C>{'>='} 8.0.0</C>
          </li>
          <li>
            <C>bini-router</C> <C>{'>='} 2.0.0</C> (must already be installed and configured)
          </li>
          <li>
            React 18+, <C>react-dom</C>, and <C>react-router-dom</C>
          </li>
          <li>
            Your <C>index.html</C> must contain an element with <C>id="root"</C>
          </li>
        </UL>
      </Section>

      <Section id="install" title="Install">
        <MultiTerminal tabs={tabs((pm) => `$ ${INSTALL[pm]}`)} />
      </Section>

      <Section id="quick-start" title="Quick Start">
        <P>
          Register the plugin in your Bini.js config, directly after <C>biniroute()</C>:
        </P>
        <CodeBlock
          filename="vite.config.ts"
          code={`import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { biniroute } from 'bini-router'
import { biniSSG } from 'bini-ssg'

export default defineConfig({
  plugins: [
    react(),
    biniroute(),
    biniSSG(),
  ],
})`}
        />
        <P>
          Run your build command (e.g. <C>npm run build</C>). <C>bini-ssg</C> will automatically
          build the client, build the SSR environment, and pre-render your routes:
        </P>
        <SsgOutput />
      </Section>

      <Section id="static-params" title="Static Params">
        <P>
          Dynamic routes are only pre-rendered if they are reachable by crawling links or if you
          explicitly list their URLs using <C>staticParams</C>.
        </P>
        <P>
          Export an async function from your dynamic page that returns an array of parameters:
        </P>
        <CodeBlock
          filename="src/app/blog/[slug]/page.tsx"
          code={`export async function staticParams() {
  return [
    { slug: 'hello-world' },
    { slug: 'second-post' }
  ]
}

export default function BlogPost() {
  // ...
}`}
        />
        <P>
          Each object is mapped to the route pattern (e.g., <C>/blog/:slug</C>), and those URLs
          will be fully pre-rendered.
        </P>
      </Section>

      <Section id="prerender-opt-out" title="Opting Out of Prerender">
        <P>
          If you have a route that cannot be server-rendered (e.g., it relies heavily on browser
          APIs at the module scope), you can opt it out.
        </P>
        <P>
          Export <C>prerender = false</C> from the page. <C>bini-ssg</C> will skip calling the
          server renderer for this route and will write an empty "shell" page instead. The client
          app will take over when the page loads.
        </P>
        <CodeBlock
          filename="src/app/admin/page.tsx"
          code={`export const prerender = false

export default function AdminDashboard() {
  // ...
}`}
        />
        <Callout>
          <strong>Automatic Fallbacks:</strong> If a standard static route throws an error during its render (for example, due to a failed data fetch), <C>bini-ssg</C> automatically catches it and writes a shell page for that route instead of failing the build. The build will only crash if the SSR bundle itself fails to import.
        </Callout>
        <Callout>
          Routes with data exports (like <C>loader</C> or <C>action</C>) are automatically marked
          as client-only by <C>bini-router</C> and will also receive a shell page.
        </Callout>
      </Section>

      <Section id="crawling" title="Link Crawling">
        <P>
          <C>bini-ssg</C> scans the HTML of every rendered page for internal{' '}
          <C>{'<a href>'}</C> links. If it finds a new link, it queues it and renders it too. This
          means a <C>/blog</C> page that lists links to all your posts will automatically
          pre-render every post without needing <C>staticParams</C>.
        </P>
        <P>
          Dynamic patterns that are never reached by a crawled link get a fallback "shell" page.
          This is an empty <C>index.html</C> that loads your client-side router, allowing dynamic
          URLs to still work on static hosts.
        </P>
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
            { n: 'admin', d: 1 },
            { n: 'index.html', d: 2 },
            { n: '404.html', d: 1 },
            { n: 'assets', d: 1 },
          ]}
        />
        <UL>
          <li>
            <C>index.html</C> - Pre-rendered <C>/</C>.
          </li>
          <li>
            <C>about/index.html</C> - Pre-rendered static route.
          </li>
          <li>
            <C>blog/hello-world/index.html</C> - Pre-rendered dynamic route (via crawl or{' '}
            <C>staticParams</C>).
          </li>
          <li>
            <C>admin/index.html</C> - A "shell" page for a route with <C>prerender = false</C>.
          </li>
          <li>
            <C>404.html</C> - The not-found page, ready for static hosts.
          </li>
        </UL>
      </Section>
    </PluginPage>
  )
}