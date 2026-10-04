// src/app/docs/load.tsx
import { Atom, File as FileIcon, Folder, LayoutPanelTop, Loader } from 'lucide-react'
import type { ReactNode } from 'react'
import { siReact } from 'simple-icons'

import {
  C,
  Callout,
  CodeBlock,
  DocPage,
  H3,
  P,
  Section,
  Table,
  useDocLang,
} from '../../components/DocBlocks'
import {
  CARD,
  GridBg,
  LINE,
  RouteVisual,
  type Row,
} from '../../components/DocVisuals'
import type { TocItem } from '../../components/TableOfContents'

const TOC_ITEMS: TocItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'how-it-works', label: 'How it Works' },
  { id: 'global-loading', label: 'Global Loading UI' },
  { id: 'nested-loading', label: 'Nested Loading UI' },
  { id: 'skeleton-examples', label: 'Skeleton Examples' },
  { id: 'loading-with-layout', label: 'Loading with Layout' },
  { id: 'custom-spinners', label: 'Custom Spinners' },
  { id: 'built-in-fallback', label: 'Built-in Fallback' },
]

/* ------------------------------------------------------------------ */
/* Page-specific visuals                                               */
/* ------------------------------------------------------------------ */

function AppShell({
  main,
  highlightMain,
}: {
  main: ReactNode
  highlightMain?: boolean
}) {
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
        <div
          className={`min-w-0 flex-1 p-2.5 ${
            highlightMain
              ? 'm-1 rounded-lg border border-dashed border-blue-500 bg-blue-500/10'
              : ''
          }`}
        >
          {main}
        </div>
      </div>
    </div>
  )
}

function SkeletonRows() {
  return (
    <div className="space-y-2.5">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="h-7 w-7 shrink-0 rounded bg-neutral-300 dark:bg-neutral-600" />
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="h-1.5 w-full rounded bg-neutral-300 dark:bg-neutral-600" />
            <div className="h-1.5 w-2/3 rounded bg-neutral-300 dark:bg-neutral-600" />
          </div>
        </div>
      ))}
    </div>
  )
}

function LoadedRows() {
  return (
    <div className="space-y-2.5">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-blue-500/20">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-blue-500">
              <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M3 15l5-5 4 4 3-3 6 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="h-1.5 w-full rounded bg-blue-400/50" />
            <div className="h-1.5 w-2/3 rounded bg-blue-400/40" />
          </div>
        </div>
      ))}
    </div>
  )
}

function VisualPartialLoading() {
  return (
    <GridBg>
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-center">
        <div className="flex flex-col items-center gap-3">
          <AppShell main={<SkeletonRows />} highlightMain />
          <span className="max-w-65 text-center text-[11px] text-neutral-500">
            Partial content with loading state
          </span>
        </div>

        {/* Forward arrow on sm+; down arrow only when stacked */}
        <svg
          width="32"
          height="12"
          viewBox="0 0 32 12"
          className="hidden shrink-0 text-blue-500 sm:block"
          fill="none"
          stroke="currentColor"
          aria-hidden
        >
          <path d="M0 6h28M24 2l4 4-4 4" strokeWidth="1.5" />
        </svg>
        <svg
          width="12"
          height="32"
          viewBox="0 0 12 32"
          className="block shrink-0 text-blue-500 sm:hidden"
          fill="none"
          stroke="currentColor"
          aria-hidden
        >
          <path d="M6 0v28M2 24l4 4 4-4" strokeWidth="1.5" />
        </svg>

        <div className="flex flex-col items-center gap-3">
          <div className="w-50 overflow-hidden rounded-xl border-2 border-blue-500 bg-white p-3 shadow-sm dark:bg-[#152033]">
            <LoadedRows />
          </div>
          <span className="text-center text-[11px] text-neutral-500">Loaded content</span>
        </div>
      </div>
    </GridBg>
  )
}

const tag = (s: string) => <span className="text-sky-700 dark:text-sky-300">{s}</span>
const prop = (s: string) => <span className="text-violet-700 dark:text-violet-300">{s}</span>
const dim = (s: string) => <span className="text-neutral-400 dark:text-neutral-500">{s}</span>

function VisualHowItWorks({ ext }: { ext: string }) {
  return (
    <GridBg>
      <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-center">
        <div className="flex flex-col gap-3">
          {/* loading file panel */}
          <div className={`w-70 ${CARD} shadow-sm`}>
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
              <span className="font-mono text-[11px] text-neutral-500">loading.{ext}</span>
            </div>
            <pre className="p-3 font-mono text-[11px] leading-relaxed text-neutral-700 dark:text-neutral-300">
              <code>
                <span className="text-purple-600 dark:text-[#C586C0]">export default function </span>
                <span className="text-amber-700 dark:text-[#DCDCAA]">Loading</span>
                <span className="text-neutral-700 dark:text-neutral-300">() {'{'}</span>
                {'\n'}
                <span className="text-purple-600 dark:text-[#C586C0]">  return </span>
                <span className="text-orange-700 dark:text-[#CE9178]">&quot;Loading...&quot;</span>
                {'\n'}
                <span className="text-neutral-700 dark:text-neutral-300">{'}'}</span>
              </code>
            </pre>
          </div>

          {/* Component hierarchy - DocVisuals style */}
          <div className={`w-70 ${CARD}`}>
            <div
              className={`flex items-center gap-2 border-b px-3 py-2 font-sans text-[11px] text-neutral-600 dark:text-neutral-400 ${LINE}`}
            >
              <Atom className="h-3.5 w-3.5 text-sky-500" strokeWidth={1.5} /> Component hierarchy
            </div>
            <pre className="p-3 font-mono text-[11px] leading-5 text-neutral-700 dark:text-neutral-300">
              <code>
                {dim('<')}
                {tag('Layout')}
                {dim('>')}
                {'\n'}
                {'  '}
                {dim('<')}
                {tag('Suspense')} {prop('fallback')}={'{'}
                {dim('<')}
                {tag('Loading')} {dim('/>')}
                {'}'}
                {dim('>')}
                {'\n'}
                {'    '}
                {dim('<')}
                {tag('Page')} {dim('/>')}
                {'\n'}
                {'  '}
                {dim('</')}
                {tag('Suspense')}
                {dim('>')}
                {'\n'}
                {dim('</')}
                {tag('Layout')}
                {dim('>')}
              </code>
            </pre>
          </div>
        </div>

        <svg
          width="40"
          height="16"
          viewBox="0 0 40 16"
          className="shrink-0 text-blue-500 max-lg:rotate-90"
          fill="none"
          stroke="currentColor"
        >
          <path d="M0 8h36M32 4l4 4-4 4" strokeWidth="1.5" />
        </svg>

        <AppShell
          main={
            <div className="flex h-full min-h-30 items-center justify-center rounded-lg border-2 border-blue-500 bg-blue-500/10">
              <span className="text-sm font-medium text-blue-600 dark:text-blue-300">
                Loading...
              </span>
            </div>
          }
        />
      </div>
    </GridBg>
  )
}

function VisualGlobal({ ext }: { ext: string }) {
  return (
    <RouteVisual
      fileWidth={240}
      rows={[
        { n: 'app' },
        { n: `layout.${ext}`, d: 1 },
        { n: `page.${ext}`, d: 1, url: '/' },
        { n: `loading.${ext}`, d: 1, dot: true },
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
        { n: `loading.${ext}`, d: 1, dot: true },
        { n: `page.${ext}`, d: 1, url: '/' },
        { n: 'blog', d: 1 },
        { n: `loading.${ext}`, d: 2, dot: true },
        { n: `page.${ext}`, d: 2, url: '/blog' },
        { n: '[slug]', d: 2 },
        { n: `loading.${ext}`, d: 3, dot: true },
        { n: `page.${ext}`, d: 3, url: '/blog/:slug' },
        { n: 'dashboard', d: 1 },
        { n: `loading.${ext}`, d: 2, dot: true },
        { n: `page.${ext}`, d: 2, url: '/dashboard' },
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
        { n: `loading.${ext}`, d: 1, dot: true },
        { n: 'blog', d: 1 },
        { n: `layout.${ext}`, d: 2 },
        { n: `loading.${ext}`, d: 2, dot: true },
        { n: `page.${ext}`, d: 2, url: '/blog' },
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
          Create a <C>{`loading.${e}`}</C> file to show a custom fallback while a page loads. It
          is used as the Suspense fallback for that segment. Parent layouts stay mounted - only the
          page slot shows the loading UI.
        </P>
        <VisualPartialLoading />
        <Table
          headers={['File', 'Creates URL?', 'Purpose']}
          rows={[
            [`app/loading.${e}`, 'No - special file', 'Global loading fallback'],
            [`app/blog/loading.${e}`, 'No - special file', 'Blog-specific loading'],
            [
              `app/dashboard/loading.${e}`,
              'No - special file',
              'Dashboard-specific loading',
            ],
          ]}
        />
        <Callout>
          <C>{`loading.${e}`}</C> does not create a URL. Nearest-wins - the closest file to the
          navigated page is used. Layouts remain interactive while content loads.
        </Callout>
      </Section>

      <Section id="how-it-works" title="How it Works">
        <P>
          <C>{`loading.${e}`}</C> wraps the page in a Suspense boundary. On navigation the
          fallback shows immediately while the page chunk loads.
        </P>
        <VisualHowItWorks ext={e} />
        <div className="mb-6 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-950">
          <ol className="list-decimal space-y-2 pl-5 text-[15px] text-neutral-600 dark:text-neutral-400">
            <li>User navigates to a route</li>
            <li>Loading UI appears in the page slot (layouts stay visible)</li>
            <li>Page content loads in the background via React.lazy</li>
            <li>Loading UI is replaced with the actual page</li>
          </ol>
        </div>
      </Section>

      <Section id="global-loading" title="Global Loading UI">
        <P>
          Place <C>{`loading.${e}`}</C> at the root of <C>app</C> for a default fallback for all
          routes that do not define their own.
        </P>
        <VisualGlobal ext={e} />
        <CodeBlock
          filename={`app/loading.${e}`}
          tsCode={`export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-black dark:border-white" />
    </div>
  )
}`}
          jsCode={`export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-black dark:border-white" />
    </div>
  )
}`}
        />
      </Section>

      <Section id="nested-loading" title="Nested Loading UI">
        <P>
          Route-specific loading by placing <C>{`loading.${e}`}</C> in subdirectories. Closest
          file to the page wins.
        </P>
        <VisualNested ext={e} />
        <Table
          headers={['Navigation', 'Loading UI Used']}
          rows={[
            ['/ → /about', `app/loading.${e} - global`],
            ['/ → /blog', `app/blog/loading.${e}`],
            ['/ → /blog/hello-world', `app/blog/[slug]/loading.${e}`],
            ['/ → /dashboard', `app/dashboard/loading.${e}`],
          ]}
        />
      </Section>

      <Section id="skeleton-examples" title="Skeleton Examples">
        <P>
          Skeletons show approximate layout and usually feel better than a spinner alone.
        </P>

        <H3 className="mb-3 mt-8">Blog Post Skeleton</H3>
        <CodeBlock
          filename={`app/blog/[slug]/loading.${e}`}
          tsCode={`export default function BlogPostLoading() {
  return (
    <article className="mx-auto max-w-3xl animate-pulse py-8">
      <div className="mb-4 h-10 w-3/4 rounded bg-neutral-200 dark:bg-neutral-800" />
      <div className="mb-8 flex gap-4">
        <div className="h-4 w-24 rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-4 w-32 rounded bg-neutral-200 dark:bg-neutral-800" />
      </div>
      <div className="space-y-3">
        <div className="h-4 w-full rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-4 w-full rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-4 w-5/6 rounded bg-neutral-200 dark:bg-neutral-800" />
      </div>
    </article>
  )
}`}
          jsCode={`export default function BlogPostLoading() {
  return (
    <article className="mx-auto max-w-3xl animate-pulse py-8">
      <div className="mb-4 h-10 w-3/4 rounded bg-neutral-200 dark:bg-neutral-800" />
      <div className="mb-8 flex gap-4">
        <div className="h-4 w-24 rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-4 w-32 rounded bg-neutral-200 dark:bg-neutral-800" />
      </div>
      <div className="space-y-3">
        <div className="h-4 w-full rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-4 w-full rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-4 w-5/6 rounded bg-neutral-200 dark:bg-neutral-800" />
      </div>
    </article>
  )
}`}
        />

        <H3 className="mb-3 mt-8">Dashboard Skeleton</H3>
        <CodeBlock
          filename={`app/dashboard/loading.${e}`}
          tsCode={`export default function DashboardLoading() {
  return (
    <div className="flex gap-6 p-6 animate-pulse">
      <div className="w-64 space-y-3">
        <div className="h-8 rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-4 w-3/4 rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-4 w-2/3 rounded bg-neutral-200 dark:bg-neutral-800" />
      </div>
      <div className="flex-1 space-y-4">
        <div className="h-8 w-1/3 rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="grid grid-cols-3 gap-4">
          <div className="h-24 rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-24 rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-24 rounded bg-neutral-200 dark:bg-neutral-800" />
        </div>
        <div className="h-64 rounded bg-neutral-200 dark:bg-neutral-800" />
      </div>
    </div>
  )
}`}
          jsCode={`export default function DashboardLoading() {
  return (
    <div className="flex gap-6 p-6 animate-pulse">
      <div className="w-64 space-y-3">
        <div className="h-8 rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-4 w-3/4 rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-4 w-2/3 rounded bg-neutral-200 dark:bg-neutral-800" />
      </div>
      <div className="flex-1 space-y-4">
        <div className="h-8 w-1/3 rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="grid grid-cols-3 gap-4">
          <div className="h-24 rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-24 rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-24 rounded bg-neutral-200 dark:bg-neutral-800" />
        </div>
        <div className="h-64 rounded bg-neutral-200 dark:bg-neutral-800" />
      </div>
    </div>
  )
}`}
        />

        <H3 className="mb-3 mt-8">Card Grid Skeleton</H3>
        <CodeBlock
          filename={`app/products/loading.${e}`}
          tsCode={`export default function ProductsLoading() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 h-8 w-48 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="mb-3 h-48 rounded-lg bg-neutral-200 dark:bg-neutral-800" />
            <div className="mb-2 h-4 w-3/4 rounded bg-neutral-200 dark:bg-neutral-800" />
            <div className="h-4 w-1/2 rounded bg-neutral-200 dark:bg-neutral-800" />
          </div>
        ))}
      </div>
    </div>
  )
}`}
          jsCode={`export default function ProductsLoading() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 h-8 w-48 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="mb-3 h-48 rounded-lg bg-neutral-200 dark:bg-neutral-800" />
            <div className="mb-2 h-4 w-3/4 rounded bg-neutral-200 dark:bg-neutral-800" />
            <div className="h-4 w-1/2 rounded bg-neutral-200 dark:bg-neutral-800" />
          </div>
        ))}
      </div>
    </div>
  )
}`}
        />
      </Section>

      <Section id="loading-with-layout" title="Loading with Layout">
        <P>
          Loading UI is shown inside the layout hierarchy. Headers, sidebars, and nav stay visible
          and interactive while only the page content shows the fallback.
        </P>
        <VisualWithLayout ext={e} />
        <CodeBlock
          filename={`app/blog/layout.${e}`}
          tsCode={`export default function BlogLayout() {
  return (
    <div>
      <header className="mb-8">
        <h1>Blog</h1>
        <nav>{/* Navigation stays visible */}</nav>
      </header>
      <main>
        <Outlet />  {/* loading.tsx or page.tsx */}
      </main>
    </div>
  )
}`}
          jsCode={`export default function BlogLayout() {
  return (
    <div>
      <header className="mb-8">
        <h1>Blog</h1>
        <nav>{/* Navigation stays visible */}</nav>
      </header>
      <main>
        <Outlet />  {/* loading.tsx or page.tsx */}
      </main>
    </div>
  )
}`}
        />
        <Callout>
          Loading UI replaces only the page (or segment) inside Suspense - not the surrounding
          layout.
        </Callout>
      </Section>

      <Section id="custom-spinners" title="Custom Spinners">
        <P>Build branded spinners that match your design system.</P>
        <CodeBlock
          filename={`app/loading.${e}`}
          tsCode={`export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm dark:bg-black/50">
      <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-2xl dark:border-neutral-800 dark:bg-black">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-neutral-300 border-t-black dark:border-neutral-700 dark:border-t-white" />
        <p className="mt-3 text-center text-sm text-neutral-500">Loading...</p>
      </div>
    </div>
  )
}`}
          jsCode={`export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm dark:bg-black/50">
      <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-2xl dark:border-neutral-800 dark:bg-black">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-neutral-300 border-t-black dark:border-neutral-700 dark:border-t-white" />
        <p className="mt-3 text-center text-sm text-neutral-500">Loading...</p>
      </div>
    </div>
  )
}`}
        />
        <CodeBlock
          filename={`app/loading.${e}`}
          tsCode={`export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex space-x-2">
        <div className="h-3 w-3 animate-bounce rounded-full bg-black dark:bg-white" />
        <div className="h-3 w-3 animate-bounce rounded-full bg-black [animation-delay:0.15s] dark:bg-white" />
        <div className="h-3 w-3 animate-bounce rounded-full bg-black [animation-delay:0.3s] dark:bg-white" />
      </div>
    </div>
  )
}`}
          jsCode={`export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex space-x-2">
        <div className="h-3 w-3 animate-bounce rounded-full bg-black dark:bg-white" />
        <div className="h-3 w-3 animate-bounce rounded-full bg-black [animation-delay:0.15s] dark:bg-white" />
        <div className="h-3 w-3 animate-bounce rounded-full bg-black [animation-delay:0.3s] dark:bg-white" />
      </div>
    </div>
  )
}`}
        />
      </Section>

      <Section id="built-in-fallback" title="Built-in Fallback">
        <P>
          If no <C>{`loading.${e}`}</C> exists, Bini.js uses a built-in spinner. It follows the{' '}
          <C>dark</C> class and <C>prefers-color-scheme</C>.
        </P>
        <div className="mb-6 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-950">
          <ul className="list-disc space-y-2 pl-5 text-[15px] text-neutral-600 dark:text-neutral-400">
            <li>Dark mode aware - adapts to theme</li>
            <li>Centered on screen</li>
            <li>Minimal design</li>
            <li>Used automatically when no custom loading UI is defined</li>
          </ul>
        </div>
        <Callout>
          Prefer custom skeletons for content-heavy pages. Keep loading UIs lightweight so they
          render quickly.
        </Callout>
      </Section>
    </>
  )
}

/* ---------- page ---------- */

export default function LoadingPage() {
  return (
    <DocPage
      title="Loading UI"
      description="Custom loading states with loading.tsx - Suspense boundary that shows instantly on navigation. Layouts stay visible."
      url="https://bini.js.org/docs/load"
      editUrl="https://github.com/Binidu01/bini-official/edit/main/src/app/docs/load.tsx"
      toc={TOC_ITEMS}
      prev={{ to: '/docs/mdx-markdown', title: 'MDX & Markdown' }}
      next={{ to: '/docs/error-boundaries', title: 'Error Boundaries' }}
    >
      <Content />
    </DocPage>
  )
}