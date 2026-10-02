// src/app/docs/error-boundaries.tsx
import { Atom } from 'lucide-react'
import type { ReactNode } from 'react'
import { siReact } from 'simple-icons'

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
import { CARD, GridBg, LINE, RouteVisual } from '../../components/DocVisuals'
import type { TocItem } from '../../components/TableOfContents'

const TOC_ITEMS: TocItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'what-are-error-boundaries', label: 'What are Error Boundaries?' },
  { id: 'creating-error-boundary', label: 'Creating an Error Boundary' },
  { id: 'error-props', label: 'Error Props' },
  { id: 'nested-error-boundaries', label: 'Nested Error Boundaries' },
  { id: 'nearest-wins', label: 'Nearest Wins Resolution' },
  { id: 'error-with-layout', label: 'Error with Layout' },
  { id: 'built-in-fallback', label: 'Built-in Fallback' },
  { id: 'complete-example', label: 'Complete Example' },
]

/* ------------------------------------------------------------------ */
/* Page-specific visuals                                               */
/* ------------------------------------------------------------------ */

function AppShell({ main }: { main: ReactNode }) {
  return (
    <div className="w-65 overflow-hidden rounded-xl border border-neutral-300 bg-white shadow-sm dark:border-neutral-700 dark:bg-[#1a1a1a]">
      <div className="flex items-center gap-2 border-b border-neutral-200 px-3 py-2.5 dark:border-neutral-700">
        <div className="h-6 w-6 shrink-0 rounded-full bg-neutral-300 dark:bg-neutral-600" />
        <div className="h-2.5 flex-1 rounded bg-neutral-300 dark:bg-neutral-600" />
      </div>
      <div className="flex min-h-40">
        <div className="flex w-14 shrink-0 flex-col gap-2 border-r border-neutral-200 p-2.5 dark:border-neutral-700">
          <div className="h-2 rounded bg-neutral-300 dark:bg-neutral-600" />
          <div className="h-2 w-3/4 rounded bg-neutral-300 dark:bg-neutral-600" />
          <div className="h-2 w-2/3 rounded bg-neutral-300 dark:bg-neutral-600" />
          <div className="h-2 w-1/2 rounded bg-neutral-300 dark:bg-neutral-600" />
        </div>
        <div className="min-w-0 flex-1 p-2.5">{main}</div>
      </div>
    </div>
  )
}

const tag = (s: string) => <span className="text-sky-700 dark:text-sky-300">{s}</span>
const prop = (s: string) => <span className="text-violet-700 dark:text-violet-300">{s}</span>
const dim = (s: string) => <span className="text-neutral-400 dark:text-neutral-500">{s}</span>

function VisualHowItWorks({ ext }: { ext: string }) {
  return (
    <GridBg>
      <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-center lg:justify-center">
        <div className="flex flex-col gap-3">
          {/* error file panel */}
          <div className={`w-80 max-w-full ${CARD} shadow-sm`}>
            <div className={`flex items-center gap-1.5 border-b px-3 py-1.5 ${LINE}`}>
              <svg
                role="img"
                viewBox="0 0 24 24"
                width={14}
                height={14}
                fill="currentColor"
                className="shrink-0 text-[#61DAFB]"
              >
                <path d={siReact.path} />
              </svg>
              <span className="font-mono text-[11px] text-neutral-500">error.{ext}</span>
            </div>
            <pre className="overflow-x-auto p-3 font-mono text-[11px] leading-relaxed text-neutral-700 dark:text-neutral-300">
              <code>
                <span className="text-purple-600 dark:text-[#C586C0]">export default function </span>
                <span className="text-amber-700 dark:text-[#DCDCAA]">Error</span>
                <span className="text-neutral-700 dark:text-neutral-300">{'({ '}</span>
                <span className="text-sky-600 dark:text-[#9CDCFE]">error</span>
                <span className="text-neutral-700 dark:text-neutral-300">, </span>
                <span className="text-orange-600 dark:text-[#CE9178]">reset</span>
                <span className="text-neutral-700 dark:text-neutral-300">{'}) {'}</span>
                {'\n'}
                <span className="text-purple-600 dark:text-[#C586C0]">  return </span>
                <span className="text-neutral-700 dark:text-neutral-300">(</span>
                {'\n'}
                <span className="text-neutral-700 dark:text-neutral-300">{'    <>'}</span>
                {'\n'}
                <span className="text-neutral-500 dark:text-neutral-400">
                  {'      An error occurred: '}
                </span>
                <span className="text-sky-600 dark:text-[#9CDCFE]">{'{error.message}'}</span>
                {'\n'}
                <span className="text-teal-600 dark:text-[#4EC9B0]">{'      <button '}</span>
                <span className="text-sky-600 dark:text-[#9CDCFE]">onClick</span>
                <span className="text-neutral-700 dark:text-neutral-300">=</span>
                <span className="text-orange-600 dark:text-[#CE9178]">{'{() => reset()}'}</span>
                <span className="text-teal-600 dark:text-[#4EC9B0]">{'>'}</span>
                <span className="text-emerald-600 dark:text-[#6A9955]">Retry</span>
                <span className="text-teal-600 dark:text-[#4EC9B0]">{'</button>'}</span>
                {'\n'}
                <span className="text-neutral-700 dark:text-neutral-300">{'    </>'}</span>
                {'\n'}
                <span className="text-neutral-700 dark:text-neutral-300">  );</span>
                {'\n'}
                <span className="text-neutral-700 dark:text-neutral-300">{'}'}</span>
              </code>
            </pre>
          </div>

          {/* Component hierarchy - DocVisuals style */}
          <div className={`w-80 max-w-full ${CARD}`}>
            <div
              className={`flex items-center gap-2 border-b px-3 py-2 font-sans text-[11px] text-neutral-600 dark:text-neutral-400 ${LINE}`}
            >
              <Atom className="h-3.5 w-3.5 text-sky-500" strokeWidth={1.5} /> Component hierarchy
            </div>
            <pre className="overflow-x-auto p-3 font-mono text-[11px] leading-5 text-neutral-700 dark:text-neutral-300">
              <code>
                {dim('<')}
                {tag('Layout')}
                {dim('>')}
                {'\n'}
                {'  '}
                {dim('<')}
                {tag('ErrorBoundary')} {prop('fallback')}={'{'}
                {dim('<')}
                {tag('Error')} {dim('/>')}
                {'}'}
                {dim('>')}
                {'\n'}
                {'    '}
                {dim('<')}
                {tag('Page')} {dim('/>')}
                {'\n'}
                {'  '}
                {dim('</')}
                {tag('ErrorBoundary')}
                {dim('>')}
                {'\n'}
                {dim('</')}
                {tag('Layout')}
                {dim('>')}
              </code>
            </pre>
          </div>
        </div>

        {/* Forward on lg+, down when stacked */}
        <svg
          width="40"
          height="16"
          viewBox="0 0 40 16"
          className="hidden shrink-0 text-blue-500 lg:block"
          fill="none"
          stroke="currentColor"
          aria-hidden
        >
          <path d="M0 8h36M32 4l4 4-4 4" strokeWidth="1.5" />
        </svg>
        <svg
          width="16"
          height="40"
          viewBox="0 0 16 40"
          className="block shrink-0 text-blue-500 lg:hidden"
          fill="none"
          stroke="currentColor"
          aria-hidden
        >
          <path d="M8 0v36M4 32l4 4 4-4" strokeWidth="1.5" />
        </svg>

        <AppShell
          main={
            <div className="flex h-full min-h-30 items-center justify-center rounded-lg border-2 border-red-500 bg-red-500/10">
              <span className="text-sm font-medium text-red-600 dark:text-red-300">Error...</span>
            </div>
          }
        />
      </div>
    </GridBg>
  )
}

function VisualCreating({ ext }: { ext: string }) {
  return (
    <RouteVisual
      fileWidth={260}
      rows={[
        { n: 'app' },
        { n: `layout.${ext}`, d: 1 },
        { n: `page.${ext}`, d: 1, url: '/' },
        { n: 'dashboard', d: 1 },
        { n: `layout.${ext}`, d: 2 },
        { n: `page.${ext}`, d: 2, url: '/dashboard' },
        { n: `error.${ext}`, d: 2, dot: true },
      ]}
    />
  )
}

function VisualNested({ ext }: { ext: string }) {
  return (
    <RouteVisual
      fileWidth={280}
      rows={[
        { n: 'app' },
        { n: `error.${ext}`, d: 1, dot: true },
        { n: `layout.${ext}`, d: 1 },
        { n: `page.${ext}`, d: 1, url: '/' },
        { n: 'blog', d: 1 },
        { n: `error.${ext}`, d: 2, dot: true },
        { n: `page.${ext}`, d: 2, url: '/blog' },
        { n: '[slug]', d: 2 },
        { n: `page.${ext}`, d: 3, url: '/blog/:slug' },
        { n: 'dashboard', d: 1 },
        { n: `error.${ext}`, d: 2, dot: true },
        { n: `page.${ext}`, d: 2, url: '/dashboard' },
        { n: 'settings', d: 2 },
        { n: `error.${ext}`, d: 3, dot: true },
        { n: `page.${ext}`, d: 3, url: '/dashboard/settings' },
      ]}
    />
  )
}

function VisualWithLayout({ ext }: { ext: string }) {
  return (
    <RouteVisual
      fileWidth={280}
      rows={[
        { n: 'app' },
        { n: `layout.${ext}`, d: 1 },
        { n: `error.${ext}`, d: 1, dot: true },
        { n: 'blog', d: 1 },
        { n: `layout.${ext}`, d: 2 },
        { n: `error.${ext}`, d: 2, dot: true },
        { n: `page.${ext}`, d: 2, url: '/blog' },
      ]}
    />
  )
}

function VisualComplete({ ext }: { ext: string }) {
  return (
    <RouteVisual
      fileWidth={280}
      rows={[
        { n: 'app' },
        { n: `layout.${ext}`, d: 1 },
        { n: `error.${ext}`, d: 1, dot: true },
        { n: `page.${ext}`, d: 1, url: '/' },
        { n: 'blog', d: 1 },
        { n: `layout.${ext}`, d: 2 },
        { n: `error.${ext}`, d: 2, dot: true },
        { n: `page.${ext}`, d: 2, url: '/blog' },
        { n: 'dashboard', d: 1 },
        { n: `layout.${ext}`, d: 2 },
        { n: `error.${ext}`, d: 2, dot: true },
        { n: `page.${ext}`, d: 2, url: '/dashboard' },
      ]}
    />
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
          Every layout and page is wrapped in an error boundary that resets on navigation. Add{' '}
          <C>{`error.${e}`}</C> in a folder for custom fallback UI. It is a special file - it does
          not create a URL. Nearest-wins applies.
        </P>
        <VisualHowItWorks ext={e} />
        <Table
          headers={['File', 'Creates URL?', 'Purpose']}
          rows={[
            [
              `app/error.${e}`,
              'No - special file',
              'Fallback for routes without a closer error file',
            ],
            [`app/dashboard/error.${e}`, 'No - special file', 'Dashboard segment only'],
            [
              `app/blog/[slug]/error.${e}`,
              'No - special file',
              'Blog post segment only',
            ],
          ]}
        />
        <Callout>
          Layouts stay mounted. The error UI replaces the page (or segment) inside the boundary -
          not the whole app shell.
        </Callout>
      </Section>

      <Section id="what-are-error-boundaries" title="What are Error Boundaries?">
        <P>
          Error boundaries catch JavaScript errors in the child tree, log them, and show fallback
          UI instead of a crashed tree. In Bini.js you use <C>{`error.${e}`}</C>.
        </P>
        <P>
          They catch errors during rendering and in the tree below them. Boundaries also reset
          automatically when the pathname changes.
        </P>
        <Callout>
          <C>{`error.${e}`}</C> does not create a URL - same idea as <C>{`loading.${e}`}</C>.
          Closest file to the error wins.
        </Callout>
      </Section>

      <Section id="creating-error-boundary" title="Creating an Error Boundary">
        <P>
          Create <C>{`error.${e}`}</C> in any folder for that route and its children.
        </P>
        <VisualCreating ext={e} />
        <CodeBlock
          filename={`app/dashboard/error.${e}`}
          tsCode={`export default function DashboardError({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div className="mx-auto max-w-2xl p-6">
      <div className="rounded-lg border border-neutral-200 p-6 dark:border-neutral-800">
        <h2 className="mb-2 text-xl font-bold text-black dark:text-white">
          Something went wrong
        </h2>
        <p className="mb-4 text-neutral-600 dark:text-neutral-400">
          {error.message}
        </p>
        <button
          onClick={reset}
          className="rounded-lg bg-black px-4 py-2 font-medium text-white dark:bg-white dark:text-black"
        >
          Try again
        </button>
      </div>
    </div>
  )
}`}
          jsCode={`export default function DashboardError({ error, reset }) {
  return (
    <div className="mx-auto max-w-2xl p-6">
      <div className="rounded-lg border border-neutral-200 p-6 dark:border-neutral-800">
        <h2 className="mb-2 text-xl font-bold text-black dark:text-white">
          Something went wrong
        </h2>
        <p className="mb-4 text-neutral-600 dark:text-neutral-400">
          {error.message}
        </p>
        <button
          onClick={reset}
          className="rounded-lg bg-black px-4 py-2 font-medium text-white dark:bg-white dark:text-black"
        >
          Try again
        </button>
      </div>
    </div>
  )
}`}
        />
      </Section>

      <Section id="error-props" title="Error Props">
        <P>
          <C>{`error.${e}`}</C> receives two props.
        </P>
        <Table
          headers={['Prop', 'Type', 'Description']}
          rows={[
            ['error', 'Error', 'Thrown Error object with message and stack'],
            ['reset', '() => void', 'Clears error state and re-renders children'],
          ]}
        />
        <CodeBlock
          filename={`app/dashboard/error.${e}`}
          tsCode={`export default function DashboardError({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  console.error('Dashboard error:', error)

  return (
    <div>
      <h2>Something went wrong!</h2>
      <details className="mt-4 rounded border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <summary className="cursor-pointer">Error details</summary>
        <pre className="mt-2 whitespace-pre-wrap text-xs">{error.stack}</pre>
      </details>
      <button
        onClick={reset}
        className="mt-4 rounded bg-black px-4 py-2 text-white dark:bg-white dark:text-black"
      >
        Try again
      </button>
    </div>
  )
}`}
          jsCode={`export default function DashboardError({ error, reset }) {
  console.error('Dashboard error:', error)

  return (
    <div>
      <h2>Something went wrong!</h2>
      <details className="mt-4 rounded border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <summary className="cursor-pointer">Error details</summary>
        <pre className="mt-2 whitespace-pre-wrap text-xs">{error.stack}</pre>
      </details>
      <button
        onClick={reset}
        className="mt-4 rounded bg-black px-4 py-2 text-white dark:bg-white dark:text-black"
      >
        Try again
      </button>
    </div>
  )
}`}
        />
      </Section>

      <Section id="nested-error-boundaries" title="Nested Error Boundaries">
        <P>
          Place <C>{`error.${e}`}</C> in subdirectories. Each only catches errors in its subtree.
        </P>
        <VisualNested ext={e} />
        <Table
          headers={['Route', 'Error Boundary Used']}
          rows={[
            ['/blog/hello-world', `app/blog/error.${e}`],
            ['/dashboard', `app/dashboard/error.${e}`],
            ['/dashboard/settings', `app/dashboard/settings/error.${e}`],
            ['/about', `app/error.${e} (global fallback)`],
          ]}
        />
      </Section>

      <Section id="nearest-wins" title="Nearest Wins Resolution">
        <P>
          The closest <C>{`error.${e}`}</C> to the route where the error occurred is used.
        </P>
        <div className="mb-6 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-950">
          <ol className="list-decimal space-y-2 pl-5 text-[15px] text-neutral-600 dark:text-neutral-400">
            <li>
              Check the route&apos;s own folder for <C>{`error.${e}`}</C>
            </li>
            <li>If not found, walk up parent folders</li>
            <li>If still not found, use the built-in fallback</li>
          </ol>
        </div>
      </Section>

      <Section id="error-with-layout" title="Error with Layout">
        <P>
          Error UI is shown inside the layout hierarchy. Headers, sidebars, and nav stay visible
          when a child route errors.
        </P>
        <VisualWithLayout ext={e} />
        <Callout>
          Error UI replaces only the page (or segment) - not the surrounding layout.
        </Callout>
      </Section>

      <Section id="built-in-fallback" title="Built-in Fallback">
        <P>
          If no <C>{`error.${e}`}</C> exists in scope, Bini.js uses a built-in fallback.
        </P>
        <div className="mb-6 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-950">
          <ul className="list-disc space-y-2 pl-5 text-[15px] text-neutral-600 dark:text-neutral-400">
            <li>
              <span className="font-semibold text-black dark:text-white">Development:</span>{' '}
              Renders nothing so Vite / <C>bini-overlay</C> can show the error
            </li>
            <li>
              <span className="font-semibold text-black dark:text-white">Production:</span> Generic
              &quot;Something went wrong&quot; UI with a retry button
            </li>
            <li>
              <span className="font-semibold text-black dark:text-white">Logging:</span> Runtime
              errors dispatch a <C>__bini_error__</C> CustomEvent on <C>window</C> for external
              overlays
            </li>
          </ul>
        </div>
        <Callout>
          Custom error UIs are recommended for production. Boundaries also reset when the pathname
          changes.
        </Callout>
      </Section>

      <Section id="complete-example" title="Complete Example">
        <P>Special files do not create URLs. Pages do.</P>
        <VisualComplete ext={e} />
        <Table
          headers={['File', 'Creates URL?', 'Role']}
          rows={[
            [`error.${e}`, 'No', 'Segment error boundary'],
            [`layout.${e}`, 'No', 'Wraps segment + children'],
            [`page.${e}`, 'Yes', 'Route content'],
            [`loading.${e}`, 'No', 'Suspense fallback'],
          ]}
        />
      </Section>
    </>
  )
}

/* ---------- page ---------- */

export default function ErrorBoundariesPage() {
  return (
    <DocPage
      title="Error Boundaries"
      description="Handle errors with error.tsx - catches errors in the child tree and shows fallback UI. Layouts stay visible."
      url="https://bini.js.org/docs/error-boundaries"
      editUrl="https://github.com/Binidu01/bini-official/edit/main/src/app/docs/error-boundaries.tsx"
      toc={TOC_ITEMS}
      prev={{ to: '/docs/load', title: 'Loading UI' }}
      next={{ to: '/docs/templates', title: 'Templates' }}
    >
      <Content />
    </DocPage>
  )
}