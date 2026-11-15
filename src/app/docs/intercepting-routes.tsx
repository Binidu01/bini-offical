// src/app/docs/intercepting-routes.tsx
import { Link } from 'react-router-dom'
import { File as FileIcon, Folder, Lock } from 'lucide-react'
import type { ReactNode } from 'react'

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
import { GridBg, RouteVisual } from '../../components/DocVisuals'
import type { TocItem } from '../../components/TableOfContents'

const TOC_ITEMS: TocItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'convention', label: 'Convention' },
  { id: 'how-it-works', label: 'How it works' },
  { id: 'no-real-page', label: 'No real page at the target' },
  { id: 'data-exports', label: 'Data exports in interceptors' },
  { id: 'complete-example', label: 'Complete example' },
]

/* ------------------------------------------------------------------ */
/* Browser chrome                                                      */
/* ------------------------------------------------------------------ */

function BrowserChrome({ url = 'example.com', children }: { url?: string; children: ReactNode }) {
  return (
    <div className="w-full max-w-md overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-[#1a1a1a] sm:max-w-105">
      <div className="grid h-10 grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-neutral-200 bg-neutral-50 px-4 dark:border-neutral-700 dark:bg-[#141414]">
        <div className="flex shrink-0 gap-2 justify-self-start">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>

        <div className="flex max-w-55 items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1 dark:border-neutral-600 dark:bg-[#222] justify-self-center">
          <Lock className="h-3 w-3 shrink-0 text-neutral-400" />
          <span className="truncate font-mono text-[10px] text-neutral-500">{url}</span>
        </div>

        <div className="justify-self-end" />
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* File tree card                                                      */
/* ------------------------------------------------------------------ */

type FRowProps = {
  name: string
  depth?: number
  selected?: boolean
  badge?: 'A' | 'B'
}

const ROW_ICON = 'h-3.5 w-3.5 shrink-0 text-neutral-400 dark:text-neutral-500'

const SELECTED_BORDER = {
  A: 'border-emerald-500 bg-emerald-500/10',
  B: 'border-purple-500 bg-purple-500/10',
} as const

const BADGE_BG = {
  A: 'bg-emerald-500',
  B: 'bg-purple-500',
} as const

function SlotBadge({ letter }: { letter: 'A' | 'B' }) {
  return (
    <span
      className={`inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold leading-none text-white shadow-sm ${BADGE_BG[letter]}`}
      aria-label={`State ${letter}`}
    >
      {letter}
    </span>
  )
}

function FRow({ name, depth = 0, selected, badge }: FRowProps) {
  const base = name.replace(/\.[^.]+$/, '')
  const icon = !name.includes('.') ? (
    <Folder className={ROW_ICON} strokeWidth={1.5} />
  ) : (
    <FileIcon className={ROW_ICON} strokeWidth={1.5} />
  )

  return (
    <div
      className={`relative flex h-9 items-center gap-2.5 border-b border-neutral-200 pr-3 last:border-0 dark:border-neutral-800 ${
        selected ? `mx-1 my-0.5 rounded-lg border ${SELECTED_BORDER[badge ?? 'A']}` : ''
      }`}
      style={{ paddingLeft: 12 + depth * 14 }}
    >
      {badge ? (
        <div className="flex w-4 justify-center shrink-0">
          <SlotBadge letter={badge} />
        </div>
      ) : (
        <div className="w-4 shrink-0" />
      )}
      {icon}
      <span
        className={`min-w-0 flex-1 truncate font-mono text-[12px] ${
          selected
            ? 'font-medium text-neutral-900 dark:text-white'
            : 'text-neutral-600 dark:text-neutral-400'
        }`}
        title={name}
      >
        {name}
      </span>
      {base === 'page' && !selected && (
        <span className="ml-1 h-2 w-2 shrink-0 rounded-full bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.6)]" />
      )}
    </div>
  )
}

function FileTreeCard({ rows, width = 260 }: { rows: FRowProps[]; width?: number }) {
  return (
    <div
      style={{ width, maxWidth: '100%' }}
      className="shrink-0 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-[#1a1a1a]"
    >
      {rows.map((r, i) => (
        <FRow key={i} {...r} />
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Visual: Direct visit vs in-app navigation                           */
/* ------------------------------------------------------------------ */

function DirectVsInAppVisual({ ext }: { ext: string }) {
  return (
    <GridBg>
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-5 p-4 md:flex-row md:items-start md:gap-6">
        <div className="flex shrink-0 justify-center md:justify-start">
          <FileTreeCard
            width={240}
            rows={[
              { name: 'app' },
              { name: 'blog', depth: 1 },
              { name: `page.${ext}`, depth: 2 },
              { name: '(.)post', depth: 2 },
              { name: '[slug]', depth: 3 },
              { name: `page.${ext}`, depth: 4, selected: true, badge: 'B' },
              { name: 'post', depth: 2 },
              { name: '[slug]', depth: 3 },
              { name: `page.${ext}`, depth: 4, selected: true, badge: 'A' },
            ]}
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-5">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <SlotBadge letter="A" />
              <span className="font-sans text-[12px] font-medium text-neutral-700 dark:text-neutral-300">
                Direct visit or reload
              </span>
            </div>
            <BrowserChrome url="example.com/blog/hello">
              <div className="rounded-lg border-2 border-emerald-500 bg-emerald-50 p-3 dark:bg-emerald-950/40">
                <div className="mb-1.5 text-[13px] font-semibold text-neutral-900 dark:text-neutral-100">
                  Hello, World
                </div>
                <div className="space-y-1.5">
                  <div className="h-1.5 w-full rounded bg-emerald-200/70 dark:bg-emerald-500/20" />
                  <div className="h-1.5 w-3/4 rounded bg-emerald-200/70 dark:bg-emerald-500/20" />
                  <div className="h-1.5 w-2/3 rounded bg-emerald-200/70 dark:bg-emerald-500/20" />
                </div>
              </div>
            </BrowserChrome>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <SlotBadge letter="B" />
              <span className="font-sans text-[12px] font-medium text-neutral-700 dark:text-neutral-300">
                Navigate from /blog
              </span>
            </div>
            <BrowserChrome url="example.com/blog/hello">
              <div className="relative flex gap-3">
                <div className="min-w-0 flex-1 space-y-1.5 opacity-30">
                  <div className="h-7 rounded bg-neutral-200 dark:bg-neutral-700" />
                  <div className="h-7 rounded bg-neutral-200 dark:bg-neutral-700" />
                  <div className="h-7 rounded bg-neutral-200 dark:bg-neutral-700" />
                </div>
                <div className="w-44 shrink-0 rounded-lg border-2 border-purple-500 bg-white p-2.5 dark:bg-[#1a1a1a]">
                  <div className="mb-1 text-[12px] font-semibold text-neutral-900 dark:text-neutral-100">
                    Quick preview
                  </div>
                  <div className="mb-2 font-mono text-[10px] text-neutral-500">
                    /blog/hello
                  </div>
                  <div className="space-y-1">
                    <div className="h-1 w-full rounded bg-neutral-200 dark:bg-neutral-700" />
                    <div className="h-1 w-2/3 rounded bg-neutral-200 dark:bg-neutral-700" />
                  </div>
                </div>
              </div>
            </BrowserChrome>
          </div>
        </div>
      </div>
    </GridBg>
  )
}

/* ---------- content ---------- */

function Content() {
  const lang = useDocLang()
  const e = lang === 'js' ? 'jsx' : 'tsx'

  return (
    <>
      <Section id="overview" title="Overview">
        <P>
          Intercepting routes render alternative content at a URL when the previous in-app
          location matches the interceptor's source route. Direct visits and reloads render the
          real page. The interceptor is a way to show one route inside another without changing
          the URL.
        </P>
        <Table
          headers={['Prefix', 'Intercepts at', 'Typical use']}
          rows={[
            ['(.)', 'Same level', 'Modal over a list, photo viewer'],
            ['(..)', 'One level up', 'Detail view from a parent page'],
            ['(...)', 'App root', 'Modal from anywhere in the app'],
          ]}
        />
      </Section>

      <Section id="convention" title="Convention">
        <P>
          Prefix a folder or flat file name with <C>(.)</C>, <C>(..)</C>, or <C>(...)</C> to make
          it an interceptor. The folder name is stripped of the prefix and matches the same URL
          as the target route.
        </P>
        <RouteVisual
          badges
          fileWidth={280}
          rows={[
            { n: 'app' },
            { n: 'blog', d: 1 },
            { n: `page.${e}`, d: 2, dot: true, url: '/blog' },
            { n: '[slug]', d: 2 },
            { n: `page.${e}`, d: 3, url: '/blog/:slug' },
            { n: '(.)[slug]', d: 2 },
            { n: `page.${e}`, d: 3, url: '/blog/:slug (from /blog)' },
          ]}
        />
        <P>
          In this tree, <C>{`src/app/blog/[slug]/page.${e}`}</C> is the real post page.{' '}
          <C>{`src/app/blog/(.)[slug]/page.${e}`}</C> is the interceptor: it matches the same{' '}
          <C>/blog/:slug</C> URL, but only renders when the previous in-app location was{' '}
          <C>/blog</C>.
        </P>
      </Section>

      <Section id="how-it-works" title="How it works">
        <P>
          The interceptor is applied only after a client-side navigation where the previous
          location matches the interceptor's source route.
        </P>
        <DirectVsInAppVisual ext={e} />
        <Table
          headers={['Navigation', 'What renders']}
          rows={[
            ['Visit /blog/:slug directly', 'The real [slug] page'],
            ['Reload /blog/:slug', 'The real [slug] page'],
            ['Navigate from /blog to /blog/:slug', 'The intercepting (.)[slug] page'],
            ['Navigate from /about to /blog/:slug', 'The real [slug] page'],
          ]}
        />
        <Callout>
          Interceptors only apply after a client-side navigation. A fresh page load or a hard
          reload always renders the real page, not the interceptor.
        </Callout>
      </Section>

      <Section id="no-real-page" title="No real page at the target">
        <P>
          If the target URL has no real page, the interceptor's page is registered as the route,
          and the not-found page is shown for direct visits. This lets you use an interceptor as
          the only page for a URL that should only ever be reached from another page.
        </P>
        <CodeBlock
          filename={`src/app/(.)modal/page.${e}`}
          tsCode={`// Interceptor only: no real src/app/modal/page.tsx exists
export default function ModalPage() {
  return <div>Modal</div>
}`}
          jsCode={`// Interceptor only: no real src/app/modal/page.jsx exists
export default function ModalPage() {
  return <div>Modal</div>
}`}
        />
        <P>
          With only the interceptor, <C>/modal</C> renders the modal when navigated to from a
          rendered page. Visiting <C>/modal</C> directly shows the not-found page.
        </P>
      </Section>

      <Section id="data-exports" title="Data exports in interceptors">
        <P>
          Data exports (<C>loader</C>, <C>action</C>, <C>shouldRevalidate</C>,{' '}
          <C>ErrorBoundary</C>, <C>HydrateFallback</C>, <C>handle</C>) are not executed in
          interceptors. The interceptor page is a pure UI layer on top of the real route's data.
        </P>
        <Callout>
          If the real route has a <C>loader</C>, put it on the real page, not the interceptor.
          The interceptor renders the UI; the real page owns the data.
        </Callout>
      </Section>

      <Section id="complete-example" title="Complete example">
        <P>
          A blog where clicking a post from the list opens an interceptor, but loading the post
          URL directly shows the full page.
        </P>
        <RouteVisual
          badges
          fileWidth={300}
          rows={[
            { n: 'app' },
            { n: 'blog', d: 1 },
            { n: `page.${e}`, d: 2, dot: true, url: '/blog' },
            { n: '(.)post', d: 2 },
            { n: '[slug]', d: 3 },
            { n: `page.${e}`, d: 4, url: '/blog/:slug (from /blog)' },
            { n: 'post', d: 2 },
            { n: '[slug]', d: 3 },
            { n: `page.${e}`, d: 4, url: '/blog/:slug (direct)' },
          ]}
        />
        <Table
          headers={['Navigation', 'What renders']}
          rows={[
            ['Visit /blog/:slug directly', `src/app/blog/post/[slug]/page.${e}`],
            ['Reload /blog/:slug', `src/app/blog/post/[slug]/page.${e}`],
            ['Click a post from /blog', `src/app/blog/(.)post/[slug]/page.${e}`],
          ]}
        />
        <CodeBlock
          filename={`src/app/blog/(.)post/[slug]/page.${e}`}
          tsCode={`export default function PostModal() {
  const { slug } = useParams<{ slug: string }>()

  return (
    <dialog open>
      <h2>Quick preview</h2>
      <p>{slug}</p>
    </dialog>
  )
}`}
          jsCode={`export default function PostModal() {
  const { slug } = useParams()

  return (
    <dialog open>
      <h2>Quick preview</h2>
      <p>{slug}</p>
    </dialog>
  )
}`}
        />
      </Section>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link to="/docs/parallel-routes" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Parallel Routes</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Render multiple routes in the same layout with named slots.</p>
        </Link>
        <Link to="/docs/dynamic-routes" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Dynamic Routes</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Match URL segments with dynamic parameters and catch-alls.</p>
        </Link>
        <Link to="/docs/catch-all-routes" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Catch-All Routes</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Match any number of trailing URL segments.</p>
        </Link>
        <Link to="/docs/folder-based-routing" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Folder-Based Routing</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Define routes with folders and page files inside them.</p>
        </Link>
        <Link to="/docs/linking-and-navigating" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Linking and Navigating</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Navigate between routes with Link, useNavigate, and prefetching.</p>
        </Link>
        <Link to="/docs/layouts-and-pages" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Layouts and Pages</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Create your first pages and wrap them in shared layouts.</p>
        </Link>
      </div>
    </>
  )
}

export default function InterceptingRoutesPage() {
  return (
    <DocPage
      title="Intercepting Routes"
      badge="Experimental"
      description="Render alternative content at a URL when the previous in-app location matches the interceptor's source route."
      url="https://bini.js.org/docs/intercepting-routes"
      editUrl="https://github.com/Binidu01/bini-official/edit/main/src/app/docs/intercepting-routes.tsx"
      toc={TOC_ITEMS}
      prev={{ to: '/docs/parallel-routes', title: 'Parallel Routes' }}
      next={{ to: '/docs/catch-all-routes', title: 'Catch-All Routes' }}
    >
      <Content />
    </DocPage>
  )
}