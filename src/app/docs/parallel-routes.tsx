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
import { Link } from 'react-router-dom'

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
/* Hierarchy coloring                                                  */
/* ------------------------------------------------------------------ */

const tag = (s: string) => <span className="text-sky-700 dark:text-sky-300">{s}</span>
const prop = (s: string) => <span className="text-violet-700 dark:text-violet-300">{s}</span>
const dim = (s: string) => <span className="text-neutral-400 dark:text-neutral-500">{s}</span>

/* ------------------------------------------------------------------ */
/* Badge (A / B / C)                                                   */
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

function SlotBadge({ letter, size = 'sm' }: { letter: 'A' | 'B' | 'C'; size?: 'sm' | 'md' }) {
  const cls = size === 'md' ? 'h-5 w-5 text-[10px]' : 'h-4 w-4 text-[9px]'
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-bold leading-none text-white shadow-sm ${BADGE_BG[letter]} ${cls}`}
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
      <div className="relative overflow-x-auto p-4 sm:p-6">
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
      className={`relative flex h-9 items-center gap-2.5 border-b border-neutral-200 pr-3 last:border-0 dark:border-neutral-800 ${
        selected ? `mx-1 my-0.5 rounded-lg border ${SELECTED_BORDER[badge ?? 'A']}` : ''
      }`}
      style={{ paddingLeft: 12 + depth * 16 }}
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

/**
 * Visualises how Bini.js composes a slot: the layout receives the slot as a
 * prop named after the @slot folder.
 */
function SlotPropPanel() {
  return (
    <div className={`w-full max-w-md ${CARD} sm:w-82.5 sm:max-w-none`}>
      <div
        className={`flex items-center gap-2 border-b px-3 py-2 font-sans text-[11px] text-neutral-600 dark:text-neutral-400 ${LINE}`}
      >
        <Atom className="h-3.5 w-3.5 text-sky-500" strokeWidth={1.5} /> Layout receives slots as
        props
      </div>
      <pre className="overflow-x-auto p-3 font-mono text-[11px] leading-5 text-neutral-700 dark:text-neutral-300">
        <code>
          {dim('<')}
          {tag('Layout')} {prop('team')}={'"'}…{'"'} {prop('analytics')}={'"'}…{'"'}
          {dim('>')}
          {'\n'}
          {'  '}
          {dim('{')}
          {prop('children')}
          {dim('}')}
          {'\n'}
          {dim('</')}
          {tag('Layout')}
          {dim('>')}
          {'\n\n'}
          <span className="inline-flex items-center gap-2 my-1.5">
            <SlotBadge letter="A" size="md" /> {prop('team')} = <C>@team</C> slot
          </span>
          {'\n'}
          <span className="inline-flex items-center gap-2 my-1.5">
            <SlotBadge letter="B" size="md" /> {prop('analytics')} = <C>@analytics</C> slot
          </span>
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
          <SlotPropPanel />
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
          Parallel routes let you render multiple pages in the same view at once. A folder
          prefixed with <C>@</C> defines a{' '}
          <strong className="font-semibold text-black dark:text-white">slot</strong>: a named
          subtree that resolves independently of the main route tree and does not add a segment to
          the URL.
        </P>
        <VisualOverview ext={e} />
        <P>
          The slot is passed as a{' '}
          <strong className="font-semibold text-black dark:text-white">prop</strong> to the{' '}
          <C>{`layout.${e}`}</C> in the same directory as the <C>@slot</C> folder. The prop name
          is the slot name (without the <C>@</C>). The layout decides where the slot appears.
        </P>
        <Table
          headers={['Folder', 'Creates URL?', 'How it renders']}
          rows={[
            ['@team', 'No - slot only', 'Passed to layout as the `team` prop'],
            [`@team/page.${e}`, 'Yes - via parent /', 'Renders inside the parent layout'],
            [
              `@analytics/page.${e}`,
              'Yes - via parent /',
              'Renders at the same time as the main page',
            ],
          ]}
        />
        <Callout>
          A slot without a receiving <C>{`layout.${e}`}</C> in the same directory is an error. The
          layout must read the slot as a prop or the build fails.
        </Callout>
      </Section>

      <Section id="convention-slots" title="Convention: slots">
        <P>
          Slots use the <C>@folder</C> convention. The tree below defines two slots:{' '}
          <C>@analytics</C> and <C>@team</C>, both at the <C>app/</C> root.
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
          The <C>{`layout.${e}`}</C> receives both slots as props named after the folders:
        </P>
        <CodeBlock
          filename={`src/app/layout.${e}`}
          tsCode={`import { Outlet } from 'react-router-dom'

export default function RootLayout({
  team,
  analytics,
}: {
  team: React.ReactNode
  analytics: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-[1fr_1fr] gap-4">
      <main><Outlet /></main>
      <aside>
        {team}
        {analytics}
      </aside>
    </div>
  )
}`}
          jsCode={`import { Outlet } from 'react-router-dom'

export default function RootLayout({ team, analytics }) {
  return (
    <div className="grid grid-cols-[1fr_1fr] gap-4">
      <main><Outlet /></main>
      <aside>
        {team}
        {analytics}
      </aside>
    </div>
  )
}`}
        />
        <P>
          Routes inside a slot support the same patterns as the main tree: dynamic segments{' '}
          <C>[id]</C>, catch-alls <C>[...slug]</C>, nested layouts. Slot pages do not support data
          exports (<C>loader</C>, <C>action</C>, <C>ErrorBoundary</C>); they are silently ignored.
        </P>
        <CodeBlock
          filename={`src/app/@analytics/page.${e}`}
          tsCode={`// Slot content for / - does not add /@analytics to the URL
export default function AnalyticsSlot() {
  return <div>Analytics for /</div>
}`}
          jsCode={`export default function AnalyticsSlot() {
  return <div>Analytics for /</div>
}`}
        />
        <CodeBlock
          filename={`src/app/@team/page.${e}`}
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
          When no route inside a slot matches the current URL, the slot renders its{' '}
          <C>{`default.${e}`}</C> (if present), or a built-in empty fallback.
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
          filename={`src/app/@analytics/default.${e}`}
          tsCode={`export default function Default() {
  return <div>Select analytics view</div>
}`}
          jsCode={`export default function Default() {
  return <div>Select analytics view</div>
}`}
        />
      </Section>

      <Section id="behavior" title="Behavior in Bini">
        <P>
          Bini.js is a pure SPA with <C>BrowserRouter</C>. Matching order: static first, then
          dynamic <C>:param</C>, then required catch-alls <C>*</C>, then optional catch-alls{' '}
          <C>**</C>. Within each category, shorter paths win.
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
            ['/unknown', 'no match', 'no match', `Both slots render their default.${e}`],
          ]}
        />
        <Callout>
          Data exports in slot pages (<C>loader</C>, <C>action</C>, <C>ErrorBoundary</C>, and the
          rest) are ignored. Slot pages are pure UI.
        </Callout>
      </Section>

      <Section id="tab-groups" title="Tab groups inside slots">
        <P>
          Put a <C>{`layout.${e}`}</C> in the parent folder (same directory as the <C>@slot</C>),
          not inside the slot, to share UI across the slot's routes.
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
            { name: `layout.${e}`, depth: 1, blueDot: true },
            { name: '...', depth: 1 },
          ]}
        />
        <P>
          The parent <C>{`layout.${e}`}</C> receives the <C>analytics</C> slot as a prop. The slot
          itself contains both routes. If you want a tab bar to persist across the slot's routes,
          render the tab UI inside the slot's own layout, or wrap the routes in a shared component.
        </P>
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
          filename={`src/app/@analytics/loading.${e}`}
          tsCode={`export default function Loading() {
  return <div>Loading analytics...</div>
}`}
          jsCode={`export default function Loading() {
  return <div>Loading analytics...</div>
}`}
        />
        <CodeBlock
          filename={`src/app/@team/error.${e}`}
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
          A full example: two slots at the root, a layout that receives both as props, and the
          main page.
        </P>
        <VisualOverview ext={e} />
        <Table
          headers={['Path', 'URL', 'Support']}
          rows={[
            [`src/app/page.${e}`, '/', 'Main tree'],
            [`src/app/@analytics/page.${e}`, '/', 'Slot, passed as `analytics` prop'],
            [`src/app/@team/page.${e}`, '/', 'Slot, passed as `team` prop'],
            [`src/app/@analytics/default.${e}`, '-', 'Fallback for the slot'],
            [`src/app/@analytics/page-views/page.${e}`, '/page-views', 'Slot sub-route'],
            [`src/app/_components/Header.${e}`, '-', 'Ignored (_ prefix)'],
          ]}
        />
      </Section>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link to="/docs/dynamic-routes" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Dynamic Routes</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Match URL segments with dynamic parameters and catch-alls.</p>
        </Link>
        <Link to="/docs/catch-all-routes" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Catch-All Routes</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Match any number of trailing URL segments.</p>
        </Link>
        <Link to="/docs/intercepting-routes" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Intercepting Routes</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Render alternative content when navigating from within the app.</p>
        </Link>
        <Link to="/docs/layouts-and-pages" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Layouts and Pages</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Create your first pages and wrap them in shared layouts.</p>
        </Link>
        <Link to="/docs/error-boundaries" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Error Boundaries</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Catch render errors and show a fallback UI.</p>
        </Link>
        <Link to="/docs/load" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Loading UI</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Show a fallback while pages and layouts load.</p>
        </Link>
      </div>
    </>
  )
}

export default function ParallelRoutesPage() {
  return (
    <DocPage
      title="Parallel Routes"
      badge="Experimental"
      description="Parallel routes with @ slots: independent route trees passed to a layout as props."
      url="https://bini.js.org/docs/parallel-routes"
      editUrl="https://github.com/Binidu01/bini-official/edit/main/src/app/docs/parallel-routes.tsx"
      toc={TOC_ITEMS}
      prev={{ to: '/docs/dynamic-routes', title: 'Dynamic Routes' }}
      next={{ to: '/docs/intercepting-routes', title: 'Intercepting Routes' }}
    >
      <Content />
    </DocPage>
  )
}