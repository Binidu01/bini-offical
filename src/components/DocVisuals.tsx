// src/components/DocVisuals.tsx
// File-tree and route visuals shared by the docs pages.
import {
  Atom,
  Ban,
  CircleAlert,
  File,
  Folder,
  Globe,
  LayoutPanelTop,
  Loader,
  Square,
} from 'lucide-react'
import type { ReactNode } from 'react'

import { FakeScrollArea, H3 } from './DocBlocks'

export type Row = {
  n: string
  d?: number
  dot?: boolean
  fn?: boolean
  url?: string
  ok?: boolean
}

export const ICON = 'h-3.5 w-3.5 shrink-0 text-neutral-400 dark:text-neutral-500'
export const CARD =
  'overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900'
export const LINE = 'border-neutral-200 dark:border-neutral-800'

function RowIcon({ name, fn }: { name: string; fn?: boolean }) {
  const base = name.replace(/\.[^.]+$/, '')
  if (fn)
    return (
      <span className="w-3.5 shrink-0 text-center font-mono text-[12px] italic leading-none text-neutral-400 dark:text-neutral-500">
        ƒ
      </span>
    )
  if (!name.includes('.')) return <Folder className={ICON} strokeWidth={1.5} />
  if (base === 'layout') return <LayoutPanelTop className={ICON} strokeWidth={1.5} />
  if (base === 'template') return <Square className={ICON} strokeWidth={1.5} />
  if (base === 'error') return <CircleAlert className={ICON} strokeWidth={1.5} />
  if (base === 'loading') return <Loader className={ICON} strokeWidth={1.5} />
  if (base === 'not-found') return <Ban className={ICON} strokeWidth={1.5} />
  return <File className={ICON} strokeWidth={1.5} />
}

export function GridBg({ children }: { children: ReactNode }) {
  return (
    <div className="relative my-5 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-[#0a0a0a]">
      <div className="absolute inset-0 bg-size-[20px_20px] bg-[linear-gradient(rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]" />
      <FakeScrollArea
        vertical={false}
        className="bini-code-scroll relative"
        scrollClassName="p-5"
      >
        <div className="mx-auto w-max">{children}</div>
      </FakeScrollArea>
    </div>
  )
}

export function FileCard({ rows, width = 210 }: { rows: Row[]; width?: number }) {
  return (
    <div style={{ width }} className={`shrink-0 ${CARD}`}>
      {rows.map((r, i) => (
        <div
          key={i}
          className={`flex h-8 items-center gap-2 border-b pr-3 last:border-0 ${LINE}`}
          style={{ paddingLeft: 12 + (r.d ?? 0) * 16 }}
        >
          <RowIcon name={r.n} fn={r.fn} />
          <span
            className={`min-w-0 flex-1 truncate font-sans text-[13px] ${r.dot ? 'font-semibold text-neutral-900 dark:text-neutral-100' : 'text-neutral-700 dark:text-neutral-300'}`}
            title={r.n}
          >
            {r.n}
          </span>
          {r.dot && (
            <span className="ml-1 h-2 w-2 shrink-0 rounded-full bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.6)]" />
          )}
        </div>
      ))}
    </div>
  )
}

export const Arrow = () => (
  <svg
    width="26"
    height="10"
    viewBox="0 0 26 10"
    fill="none"
    stroke="currentColor"
    className="shrink-0 text-neutral-300 dark:text-neutral-600"
  >
    <path d="M0 5h24M20 1l4 4-4 4" strokeWidth="1.2" />
  </svg>
)

function Badge({ ok }: { ok: boolean }) {
  return ok ? (
    <span className="shrink-0 rounded-[5px] border-[1.5px] border-emerald-500 bg-emerald-500/10 px-1.5 py-px font-sans text-[10px] font-medium text-emerald-700 dark:border-emerald-500/80 dark:text-emerald-300">
      Routable
    </span>
  ) : (
    <span className="shrink-0 rounded-[5px] border-[1.5px] border-red-500 bg-red-500/10 px-1.5 py-px font-sans text-[10px] font-medium text-red-600 dark:border-red-500/80 dark:text-red-300">
      Not Routable
    </span>
  )
}

export function RouteVisual({
  rows,
  badges = false,
  fileWidth = 210,
}: {
  rows: Row[]
  badges?: boolean
  fileWidth?: number
}) {
  const longest = rows.reduce((max, r) => Math.max(max, r.url?.length ?? 0), 0)
  const urlWidth = Math.min(320, Math.max(190, Math.ceil(longest * 6.7) + 48))

  return (
    <GridBg>
      <div className="flex items-start gap-3">
        <FileCard rows={rows} width={fileWidth} />
        <div>
          {rows.map((r, i) => (
            <div key={i} className="flex h-8 items-center gap-3">
              {r.url && (
                <>
                  <Arrow />
                  <span
                    style={{ width: urlWidth }}
                    className={`flex h-8 shrink-0 items-center gap-1.5 border-x border-b border-neutral-200 bg-white px-2.5 font-sans text-[12px] dark:border-neutral-800 dark:bg-neutral-900 ${rows[i - 1]?.url ? '' : 'rounded-t-lg border-t'} ${rows[i + 1]?.url ? '' : 'rounded-b-lg'}`}
                    title={r.url}
                  >
                    <Globe className={ICON} strokeWidth={1.5} />
                    <span
                      className={`min-w-0 truncate ${
                        r.ok === false
                          ? 'text-neutral-400 dark:text-neutral-500'
                          : 'text-neutral-800 dark:text-neutral-200'
                      }`}
                    >
                      {r.url}
                    </span>
                  </span>
                  {badges && <Badge ok={r.ok !== false} />}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </GridBg>
  )
}

export function FolderVisual({ rows, width = 210 }: { rows: Row[]; width?: number }) {
  return (
    <GridBg>
      <FileCard rows={rows} width={width} />
    </GridBg>
  )
}

/** Layout / error / loading / template / page files and the component tree they produce. */
const tag = (s: string) => <span className="text-sky-700 dark:text-sky-300">{s}</span>
const prop = (s: string) => <span className="text-violet-700 dark:text-violet-300">{s}</span>
const dim = (s: string) => <span className="text-neutral-400 dark:text-neutral-500">{s}</span>

export function HierarchyVisual({ ext }: { ext: string }) {
  const rows: Row[] = ['layout', 'template', 'error', 'loading', 'not-found', 'page'].map((n) => ({
    n: `${n}.${ext}`,
    dot: n === 'page',
  }))
  return (
    <GridBg>
      <div className="flex items-center gap-3">
        <FileCard rows={rows} width={190} />
        <Arrow />
        <div className={`w-82.5 ${CARD}`}>
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
              {tag('ErrorBoundary')} {prop('fallback')}={'{'}
              {dim('<')}
              {tag('Error')} {dim('/>')}
              {'}'}
              {dim('>')}
              {'\n'}
              {'    '}
              {dim('<')}
              {tag('Suspense')} {prop('fallback')}={'{'}
              {dim('<')}
              {tag('Loading')} {dim('/>')}
              {'}'}
              {dim('>')}
              {'\n'}
              {'      '}
              {dim('<')}
              {tag('Template')}
              {dim('>')}
              {'\n'}
              {'        '}
              {dim('<')}
              {tag('Page')} {dim('/>')}
              {'\n'}
              {'      '}
              {dim('</')}
              {tag('Template')}
              {dim('>')}
              {'\n'}
              {'    '}
              {dim('</')}
              {tag('Suspense')}
              {dim('>')}
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
    </GridBg>
  )
}

/* ---- cards used on the docs landing page ---- */

export const PANEL =
  'rounded-lg border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950'

export function PlatformCard({ title, items }: { title: string; items: [string, string][] }) {
  return (
    <div className={`${PANEL} p-5`}>
      <H3>{title}</H3>
      <ul className="space-y-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
        {items.map(([name, text]) => (
          <li key={name} className="flex gap-2">
            <span className="mt-0.5 text-neutral-400 dark:text-neutral-600">-</span>
            <span>
              <span className="font-medium text-neutral-900 dark:text-neutral-200">{name}</span> -{' '}
              {text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function FeatureCard({ title, text }: { title: string; text: string }) {
  return (
    <div className={`${PANEL} p-4`}>
      <div className="mb-2 text-sm font-medium text-neutral-900 dark:text-neutral-200">{title}</div>
      <p className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-500">{text}</p>
    </div>
  )
}