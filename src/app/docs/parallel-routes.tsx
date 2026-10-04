// src/app/docs/parallel-routes.tsx
import {
  Atom,
  File as FileIcon,
  Folder,
  LayoutPanelTop,
  Loader,
  CircleAlert,
  Lock,
} from 'lucide-react'
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
import { CARD, LINE } from '../../components/DocVisuals'
import type { TocItem } from '../../components/TableOfContents'

const TOC_ITEMS: TocItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'convention-slots', label: 'Convention: slots' },
  { id: 'default-tsx', label: 'default.tsx fallback' },
  { id: 'behavior', label: 'Behavior in Bini' },
  { id: 'tab-groups', label: 'Tab groups inside slots' },
  { id: 'loading-error', label: 'Loading and error boundaries' },
  { id: 'complete-example', label: 'Complete example' },
]

/* ------------------------------------------------------------------ */
/* Hierarchy coloring (same helpers as DocVisuals)                     */
/* ------------------------------------------------------------------ */

const tag = (s: string) => <span className="text-sky-700 dark:text-sky-300">{s}</span>
const prop = (s: string) => <span className="text-violet-700 dark:text-violet-300">{s}</span>
const dim = (s: string) => <span className="text-neutral-400 dark:text-neutral-500">{s}</span>
const str = (s: string) => (
  <span className="text-orange-700 dark:text-[#CE9178]">&quot;{s}&quot;</span>
)

/* ------------------------------------------------------------------ */
/* Badge (A / B / C) - larger, high-contrast, readable                 */
/* ------------------------------------------------------------------ */

const BADGE_BG = {
  A: 'bg-blue-500',
  B: 'bg-purple-500',
  C: 'bg-cyan-500',
} as const

const SELECTED_BORDER = {
  A: 'border-blue-500 bg-blue-500/10',
  B: 'border-purple-500 bg-purple-500/10',
  C: 'border-cyan-500 bg-cyan-500/10',
} as const

function SlotBadge({
  letter,
  size = 'sm',
}: {
  letter: 'A' | 'B' | 'C'
  size?: 'sm' | 'md'
}) {
  const cls =
    size === 'md'
      ? 'h-5 w-5 text-[10px]'
      : 'h-4 w-4 text-[9px]'
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-bold text-white shadow-sm ${BADGE_BG[letter]} ${cls}`}
      aria-label={`Slot ${letter}`}
    >
      {letter}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Grid + file tree                                                    */
/* ------------------------------------------------------------------ */

function GridWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="relative my-6 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-[#0a0a0a]">
      <div className="absolute inset-0 bg-size-[20px_20px] bg-[linear-gradient(rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)]" />
      <div className="bini-code-scroll relative overflow-x-auto p-4 sm:p-6">
        <div className="w-full min-w-0">{children}</div>
      </div>
    </div>
  )
}

type FRowProps = {
  name: string
  depth?: number
  selected?: boolean
  badge?: 'A' | 'B' | 'C'
  blueDot?: boolean
}

const ROW_ICON = 'h-3.5 w-3.5 shrink-0 text-neutral-400 dark:text-neutral-500'

function FRow({ name, depth = 0, selected, badge, blueDot }: FRowProps) {
  const base = name.replace(/\.[^.]+$/, '')
  const icon = !name.includes('.') ? (
    <Folder className={ROW_ICON} strokeWidth={1.5} />
  ) : base === 'layout' ? (
    <LayoutPanelTop className={ROW_ICON} strokeWidth={1.5} />
  ) : base === 'loading' ? (
    <Loader className={ROW_ICON} strokeWidth={1.5} />
  ) : base === 'error' ? (
    <CircleAlert className={ROW_ICON} strokeWidth={1.5} />
  ) : (
    <FileIcon className={ROW_ICON} strokeWidth={1.5} />
  )

  return (
    <div
      className={`relative flex h-9 items-center gap-2 border-b border-neutral-200 pr-3 last:border-0 dark:border-neutral-800 ${
        selected ? `mx-1 my-0.5 rounded-lg border ${SELECTED_BORDER[badge ?? 'A']}` : ''
      }`}
      style={{ paddingLeft: 12 + depth * 14 }}
    >
      {badge && <SlotBadge letter={badge} />}
      {icon}
      <span
        className={`min-w-0 flex-1 truncate font-mono text-[12px] ${
          selected || blueDot
            ? 'font-medium text-neutral-900 dark:text-white'
            : 'text-neutral-600 dark:text-neutral-400'
        }`}
        title={name}
      >
        {name}
      </span>
      {blueDot && (
        <span className="ml-1 h-2 w-2 shrink-0 rounded-full bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.6)]" />
      )}
    </div>
  )
}

function FileTreeCard({ rows, width = 260 }: { rows: FRowProps[]; width?: number }) {
  return (
    <div
      style={{ width, maxWidth: '100%' }}
      className="w-full shrink-0 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-[#1a1a1a] sm:w-auto"
    >
      {rows.map((r, i) => (
        <FRow key={i} {...r} />
      ))}
    </div>
  )
}

function CenteredTree({ rows, width }: { rows: FRowProps[]; width: number }) {
  return (
    <GridWrapper>
      <div className="flex justify-center">
        <FileTreeCard width={width} rows={rows} />
      </div>
    </GridWrapper>
  )
}

function BrowserChrome({ children }: { children: ReactNode }) {
  return (
    <div className="w-full max-w-md overflow-visible rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-[#1a1a1a] sm:max-w-105">
      <div className="relative flex h-9 items-center border-b border-neutral-200 bg-neutral-50 px-3 dark:border-neutral-700 dark:bg-[#141414]">
        <div className="flex shrink-0 gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-2.5 py-0.5 dark:border-neutral-600 dark:bg-[#222]">
            <Lock className="h-3 w-3 shrink-0 text-neutral-400" />
            <span className="font-mono text-[10px] text-neutral-500">example.com</span>
          </div>
        </div>
      </div>
      <div className="overflow-visible p-3">{children}</div>
    </div>
  )
}

/** Same card style as HierarchyVisual in DocVisuals */
function SlotHierarchyPanel() {
  return (
    <div className={`w-full max-w-md ${CARD} sm:max-w-none sm:w-82.5`}>
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
          {dim('{')}
          {prop('children')}
          {dim('}')}
          {'\n'}
          {'  '}
          {dim('<')}
          {tag('SlotBoundary')} {prop('slot')}={str('team')}
          {dim(' />')}{' '}
          <SlotBadge letter="A" size="md" />
          {'\n'}
          {'  '}
          {dim('<')}
          {tag('SlotBoundary')} {prop('slot')}={str('analytics')}
          {dim(' />')}{' '}
          <SlotBadge letter="B" size="md" />
          {'\n'}
          {dim('</')}
          {tag('Layout')}
          {dim('>')}
        </code>
      </pre>
    </div>
  )
}

function VisualOverview({ ext }: { ext: string }) {
  return (
    <GridWrapper>
      <div className="flex w-full flex-col items-stretch justify-center gap-6 lg:flex-row lg:items-start lg:gap-8">
        <div className="flex justify-center lg:justify-start">
          <FileTreeCard
            width={240}
            rows={[
              { name: 'app' },
              { name: '@team', depth: 1 },
              { name: `page.${ext}`, depth: 2, selected: true, badge: 'A' },
              { name: '@analytics', depth: 1 },
              { name: `page.${ext}`, depth: 2, selected: true, badge: 'B' },
              { name: `layout.${ext}`, depth: 1 },
              { name: `page.${ext}`, depth: 1 },
            ]}
          />
        </div>
        <div className="flex w-full flex-col items-center gap-4 lg:max-w-md lg:items-stretch lg:self-start">
          <BrowserChrome>
            <div className="flex gap-2 sm:gap-3">
              <div className="hidden w-12 shrink-0 space-y-2 pt-1 sm:block sm:w-14">
                <div className="h-7 w-7 rounded-full bg-neutral-200 dark:bg-neutral-700" />
                <div className="space-y-1.5">
                  <div className="h-1.5 w-full rounded bg-neutral-200 dark:bg-neutral-700" />
                  <div className="h-1.5 w-[85%] rounded bg-neutral-200 dark:bg-neutral-700" />
                  <div className="h-1.5 w-[70%] rounded bg-neutral-200 dark:bg-neutral-700" />
                </div>
              </div>
              <div className="relative min-w-0 flex-1 rounded-lg border-2 border-blue-500 bg-blue-50/80 p-2 dark:bg-blue-500/10">
                <div className="absolute left-1.5 top-1.5">
                  <SlotBadge letter="A" size="md" />
                </div>
                <div className="mt-6 space-y-2">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex gap-1.5">
                      <div className="h-7 w-7 shrink-0 rounded bg-blue-100 dark:bg-slate-700" />
                      <div className="min-w-0 flex-1 space-y-1 pt-1">
                        <div className="h-1.5 w-full rounded bg-blue-100 dark:bg-slate-700" />
                        <div className="h-1 w-[55%] rounded bg-blue-100 dark:bg-slate-700" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative min-w-0 flex-1 rounded-lg border-2 border-purple-500 bg-purple-50/80 p-2 dark:bg-purple-500/10">
                <div className="absolute left-1.5 top-1.5">
                  <SlotBadge letter="B" size="md" />
                </div>
                <div className="mt-6 flex h-12 items-end justify-center gap-1 rounded bg-purple-100/80 p-1 dark:bg-purple-950/50">
                  <div className="h-3 w-2.5 rounded-sm bg-purple-300 dark:bg-purple-500/40" />
                  <div className="h-7 w-2.5 rounded-sm bg-purple-400 dark:bg-purple-500/55" />
                  <div className="h-4 w-2.5 rounded-sm bg-purple-300 dark:bg-purple-500/40" />
                  <div className="h-9 w-2.5 rounded-sm bg-purple-500 dark:bg-purple-500/70" />
                </div>
                <div className="mt-2 h-1.5 w-full rounded bg-purple-100 dark:bg-purple-950/50" />
              </div>
            </div>
          </BrowserChrome>
          <SlotHierarchyPanel />
        </div>
      </div>
    </GridWrapper>
  )
}

function VisualLoading({ ext }: { ext: string }) {
  return (
    <GridWrapper>
      <div className="flex w-full flex-col items-stretch justify-center gap-6 lg:flex-row lg:items-start lg:gap-8">
        <div className="flex justify-center lg:justify-start">
          <FileTreeCard
            width={240}
            rows={[
              { name: '...' },
              { name: '@team', depth: 1 },
              { name: `page.${ext}`, depth: 2 },
              { name: `error.${ext}`, depth: 2 },
              { name: `loading.${ext}`, depth: 2, selected: true, badge: 'A' },
              { name: '@analytics', depth: 1 },
              { name: `page.${ext}`, depth: 2 },
              { name: `error.${ext}`, depth: 2, selected: true, badge: 'B' },
              { name: `loading.${ext}`, depth: 2, selected: true, badge: 'C' },
              { name: `layout.${ext}`, depth: 1 },
            ]}
          />
        </div>
        <div className="flex w-full flex-col items-center gap-3 lg:max-w-md lg:self-start">
          <BrowserChrome>
            <div className="flex gap-2">
              <div className="hidden w-10 shrink-0 space-y-1.5 pt-0.5 sm:block sm:w-12">
                <div className="h-5 w-5 rounded-full bg-neutral-200 dark:bg-neutral-700" />
                <div className="h-1 w-full rounded bg-neutral-200 dark:bg-neutral-700" />
                <div className="h-1 w-[80%] rounded bg-neutral-200 dark:bg-neutral-700" />
              </div>
              <div className="relative flex min-h-18 min-w-0 flex-1 flex-col items-center justify-center rounded-lg border-2 border-blue-500 bg-blue-50 px-2 py-3 dark:bg-blue-950/40">
                <div className="absolute left-1.5 top-1.5">
                  <SlotBadge letter="A" size="md" />
                </div>
                <span className="mt-1 font-mono text-[11px] text-neutral-700 dark:text-white">
                  Loading...
                </span>
              </div>
              <div className="relative flex min-h-18 min-w-0 flex-1 flex-col items-center justify-center rounded-lg border-2 border-cyan-500 bg-cyan-50 px-2 py-3 dark:bg-cyan-950/40">
                <div className="absolute left-1.5 top-1.5">
                  <SlotBadge letter="C" size="md" />
                </div>
                <span className="mt-1 font-mono text-[11px] text-neutral-700 dark:text-white">
                  Loading...
                </span>
              </div>
            </div>
          </BrowserChrome>
          <div className="text-neutral-400 dark:text-neutral-600" aria-hidden>
            ↓
          </div>
          <BrowserChrome>
            <div className="flex gap-2">
              <div className="hidden w-10 shrink-0 space-y-1.5 pt-0.5 sm:block sm:w-12">
                <div className="h-5 w-5 rounded-full bg-neutral-200 dark:bg-neutral-700" />
                <div className="h-1 w-full rounded bg-neutral-200 dark:bg-neutral-700" />
              </div>
              <div className="min-w-0 flex-1 space-y-2 opacity-40">
                <div className="flex gap-1.5">
                  <div className="h-6 w-6 shrink-0 rounded bg-neutral-200 dark:bg-neutral-700" />
                  <div className="h-1.5 flex-1 self-center rounded bg-neutral-200 dark:bg-neutral-700" />
                </div>
                <div className="flex gap-1.5">
                  <div className="h-6 w-6 shrink-0 rounded bg-neutral-200 dark:bg-neutral-700" />
                  <div className="h-1.5 flex-1 self-center rounded bg-neutral-200 dark:bg-neutral-700" />
                </div>
              </div>
              <div className="relative flex h-20 min-w-18 shrink-0 flex-col items-center justify-center rounded-lg border-2 border-red-500 bg-red-50 px-2 dark:bg-red-950/40 sm:min-w-22">
                <div className="absolute left-1.5 top-1.5">
                  <SlotBadge letter="B" size="md" />
                </div>
                <span className="mt-1 font-mono text-[11px] text-neutral-700 dark:text-white">
                  Error...
                </span>
              </div>
            </div>
          </BrowserChrome>
        </div>
      </div>
    </GridWrapper>
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
          Parallel routes let you render multiple pages in the same view at once. Folders
          prefixed with <C>@</C> define <strong className="font-semibold text-black dark:text-white">slots</strong> -
          named subtrees that resolve independently of the main route tree and do not add a
          segment to the URL. Each slot is scanned like a normal route and tagged with its slot
          name.
        </P>
        <VisualOverview ext={e} />
        <P>
          Slots are generated as independent blocks via <C>SlotBoundary</C>. The main route and
          each slot match the current pathname on their own. Slot names must match{' '}
          <C>/^[a-zA-Z][a-zA-Z0-9_-]*$/</C>. This feature is experimental - check the generated{' '}
          <C>src/App.tsx</C> to see how slots are wired.
        </P>
        <Table
          headers={['Folder', 'Creates URL?', 'How it renders']}
          rows={[
            ['@team', 'No - slot only', 'Independent SlotBoundary block'],
            [`@team/page.${e}`, 'Yes - via parent /', 'Renders when parent matches (e.g. /)'],
            [
              `@analytics/page.${e}`,
              'Yes - via parent /',
              'Renders at the same time as the main page',
            ],
          ]}
        />
      </Section>

      <Section id="convention-slots" title="Convention: slots">
        <P>
          slots use the <C>@folder</C> convention. The tree below defines two slots:{' '}
          <C>@analytics</C> and <C>@team</C>.
        </P>
        <CenteredTree
          width={280}
          rows={[
            { name: 'app' },
            { name: '@analytics', depth: 1, blueDot: true },
            { name: `page.${e}`, depth: 2 },
            { name: '@team', depth: 1, blueDot: true },
            { name: `page.${e}`, depth: 2 },
            { name: `layout.${e}`, depth: 1 },
            { name: `page.${e}`, depth: 1 },
          ]}
        />
        <P>
          Routes inside a slot support the same patterns as the main tree: dynamic segments{' '}
          <C>[id]</C>, catch-alls <C>[...slug]</C>, nested layouts, and templates. Each route is
          tagged with its slot name. Files prefixed with <C>_</C> or <C>.</C> are ignored.
        </P>
        <CodeBlock
          filename={`app/@analytics/page.${e}`}
          tsCode={`// Slot content for / - does not add /@analytics to the URL
export default function AnalyticsSlot() {
  return <div>Analytics for /</div>
}`}
          jsCode={`export default function AnalyticsSlot() {
  return <div>Analytics for /</div>
}`}
        />
        <CodeBlock
          filename={`app/@team/page.${e}`}
          tsCode={`export default function TeamSlot() {
  return <div>Team for /</div>
}`}
          jsCode={`export default function TeamSlot() {
  return <div>Team for /</div>
}`}
        />
      </Section>

      <Section id="default-tsx" title={`default.${e} fallback`}>
        <P>
          When no route inside a slot matches the current URL, the nearest <C>{`default.${e}`}</C>{' '}
          is rendered (nearest-wins: a subfolder shadows an ancestor). If none exists in the
          chain, a built-in "No Content" fallback is used.
        </P>
        <CenteredTree
          width={300}
          rows={[
            { name: 'app' },
            { name: '@team', depth: 1 },
            { name: 'settings', depth: 2 },
            { name: `page.${e}`, depth: 3 },
            { name: '@analytics', depth: 1 },
            { name: `default.${e}`, depth: 2, blueDot: true },
            { name: `page.${e}`, depth: 2 },
            { name: `default.${e}`, depth: 1, blueDot: true },
            { name: `layout.${e}`, depth: 1 },
            { name: `page.${e}`, depth: 1 },
          ]}
        />
        <P>
          Example: <C>{`@team/settings/page.${e}`}</C> exists, but <C>@analytics</C> has no{' '}
          <C>/settings</C> route. Navigating to <C>/settings</C> renders the @team settings page
          plus <C>{`@analytics/default.${e}`}</C>.
        </P>
        <CodeBlock
          filename={`app/@analytics/default.${e}`}
          tsCode={`export default function Default() {
  return <div>Select analytics view</div>
}`}
          jsCode={`export default function Default() {
  return <div>Select analytics view</div>
}`}
        />
        <Callout>
          <C>{`default.${e}`}</C> only applies inside <C>@slot</C> folders. Resolution is
          nearest-wins, same as <C>{`loading.${e}`}</C>, <C>{`error.${e}`}</C>, and{' '}
          <C>{`not-found.${e}`}</C>.
        </Callout>
      </Section>

      <Section id="behavior" title="Behavior in Bini">
        <P>
          Bini.js is a pure SPA with <C>BrowserRouter</C>. Matching order: static first, then
          dynamic <C>:param</C>, then required catch-alls <C>*</C>, then optional catch-alls{' '}
          <C>**</C>. Within each category, shorter paths win. Slots resolve independently through
          the same <C>matchRoute()</C> path used for API routes.
        </P>
        <Table
          headers={['Current URL', '@team', '@analytics', 'Renders']}
          rows={[
            ['/', `page.${e}`, `page.${e}`, 'Main page + both slots'],
            [
              '/settings',
              `settings/page.${e}`,
              `default.${e}`,
              '@team settings + @analytics default',
            ],
            ['/unknown', 'no match', 'no match', `Both slots -> default.${e} or No Content`],
          ]}
        />
        <Callout>
          Open generated <C>src/App.tsx</C> to see how slots are wired with <C>SlotBoundary</C>.
          Manifest entries include a <C>slotName</C> field for tooling such as{' '}
          <C>generateRouteManifest()</C>.
        </Callout>
      </Section>

      <Section id="tab-groups" title="Tab groups inside slots">
        <P>
          Add a <C>{`layout.${e}`}</C> inside a slot so that slot can navigate on its own (for
          example, tabs). Layouts render child routes with <C>{'<Outlet />'}</C>.
        </P>
        <CenteredTree
          width={280}
          rows={[
            { name: 'app' },
            { name: '@analytics', depth: 1 },
            { name: 'page-views', depth: 2 },
            { name: `page.${e}`, depth: 3 },
            { name: 'visitors', depth: 2 },
            { name: `page.${e}`, depth: 3 },
            { name: `layout.${e}`, depth: 2, blueDot: true },
            { name: '...', depth: 1 },
          ]}
        />
        <P>
          <C>@analytics</C> has two subpages: <C>page-views</C> and <C>visitors</C>. A layout
          inside the slot shares the tab bar across them.
        </P>
        <CodeBlock
          filename={`app/@analytics/layout.${e}`}
          tsCode={`import { Link, Outlet } from 'react-router-dom'

export default function AnalyticsLayout() {
  return (
    <>
      <nav className="flex gap-4 border-b">
        <Link to="/page-views">Page Views</Link>
        <Link to="/visitors">Visitors</Link>
      </nav>
      <Outlet />
    </>
  )
}`}
          jsCode={`import { Link, Outlet } from 'react-router-dom'

export default function AnalyticsLayout() {
  return (
    <>
      <nav className="flex gap-4 border-b">
        <Link to="/page-views">Page Views</Link>
        <Link to="/visitors">Visitors</Link>
      </nav>
      <Outlet />
    </>
  )
}`}
        />
      </Section>

      <Section id="loading-error" title="Loading and error boundaries">
        <P>
          Each slot can define its own <C>{`loading.${e}`}</C> and <C>{`error.${e}`}</C>. They
          use nearest-wins and are code-split with <C>React.lazy</C>. In the diagram:{' '}
          <strong className="font-semibold text-black dark:text-white">A</strong> = loading for
          @team, <strong className="font-semibold text-black dark:text-white">B</strong> = error
          for @analytics,{' '}
          <strong className="font-semibold text-black dark:text-white">C</strong> = loading for
          @analytics.
        </P>
        <VisualLoading ext={e} />
        <P>
          The loading file is the Suspense fallback. Error boundaries reset when the pathname
          changes. The built-in fallback renders nothing in development and a generic retry UI in
          production.
        </P>
        <CodeBlock
          filename={`app/@analytics/loading.${e}`}
          tsCode={`export default function Loading() {
  return <div>Loading analytics...</div>
}`}
          jsCode={`export default function Loading() {
  return <div>Loading analytics...</div>
}`}
        />
        <CodeBlock
          filename={`app/@team/error.${e}`}
          tsCode={`export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div>
      <h2>Team failed</h2>
      <button onClick={() => reset()}>Retry</button>
    </div>
  )
}`}
          jsCode={`export default function Error({ error, reset }) {
  return (
    <div>
      <h2>Team failed</h2>
      <button onClick={() => reset()}>Retry</button>
    </div>
  )
}`}
        />
      </Section>

      <Section id="complete-example" title="Complete example">
        <P>
          Structure supported by bini-router for parallel routes: slots, default fallback, nested
          layouts inside slots, and loading/error boundaries. Slots render through independent{' '}
          <C>SlotBoundary</C> blocks - they are not passed as props into the layout.
        </P>
        <VisualOverview ext={e} />
        <Table
          headers={['Path', 'URL', 'Support']}
          rows={[
            [`app/page.${e}`, '/', 'Main tree'],
            [`app/@analytics/page.${e}`, '/', 'Slot via SlotBoundary'],
            [`app/@team/page.${e}`, '/', 'Slot via SlotBoundary'],
            [`app/@analytics/default.${e}`, '-', 'Fallback, nearest-wins'],
            [`app/@analytics/page-views/page.${e}`, '/page-views', 'Slot sub-route'],
            [`app/@analytics/layout.${e}`, '-', 'Nested layout with Outlet'],
            [`app/_components/Header.${e}`, '-', 'Ignored (_ prefix)'],
          ]}
        />
        <Callout>
          For conditional UI inside a slot, gate rendering in the slot page itself. Confirm the
          generated composition in <C>src/App.tsx</C>.
        </Callout>
      </Section>
    </>
  )
}

/* ---------- page ---------- */

export default function ParallelRoutesPage() {
  return (
    <DocPage
      title="Parallel Routes"
      badge="Experimental"
      description="Parallel routes with @ slots - independent route trees that render at the same time via SlotBoundary."
      url="https://bini.js.org/docs/parallel-routes"
      editUrl="https://github.com/Binidu01/bini-official/edit/main/src/app/docs/parallel-routes.tsx"
      toc={TOC_ITEMS}
      prev={{ to: '/docs/dynamic-routes', title: 'Dynamic Routes' }}
      next={{ to: '/docs/catch-all-routes', title: 'Catch-All Routes' }}
    >
      <Content />
    </DocPage>
  )
}