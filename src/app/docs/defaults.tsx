// src/app/docs/defaults.tsx
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
import { RouteVisual } from '../../components/DocVisuals'
import type { TocItem } from '../../components/TableOfContents'

const TOC_ITEMS: TocItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'default-for-parallel', label: 'Fallback for Parallel Routes' },
  { id: 'creating-default', label: 'Creating a Default' },
  { id: 'default-vs-page', label: 'Default vs Page' },
  { id: 'complete-example', label: 'Complete Example' },
]

function Content() {
  const lang = useDocLang()
  const e = lang === 'js' ? 'jsx' : 'tsx'

  return (
    <>
      <Section id="overview" title="Overview">
        <P>
          Place <C>{`default.${e}`}</C> inside an <C>@slot</C> folder. When the current URL has no
          matching child route for that slot, the default is rendered instead. It does not create a
          URL.
        </P>
        <RouteVisual
          fileWidth={280}
          rows={[
            { n: 'dashboard' },
            { n: `layout.${e}`, d: 1 },
            { n: `page.${e}`, d: 1, url: '/dashboard' },
            { n: '@analytics', d: 1 },
            { n: `page.${e}`, d: 2 },
            { n: `default.${e}`, d: 2, dot: true },
            { n: '@team', d: 1 },
            { n: `page.${e}`, d: 2 },
            { n: `default.${e}`, d: 2, dot: true },
          ]}
        />
        <Table
          headers={['File', 'When rendered']}
          rows={[
            [`@analytics/page.${e}`, 'When the slot has a matching child'],
            [`@analytics/default.${e}`, 'When the slot has no match for the URL'],
            [`@team/default.${e}`, 'Fallback for the team slot'],
          ]}
        />
        <Callout>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>Slot fallback:</strong> used when no child route matches inside <C>@slot</C>.
            </li>
            <li>
              <strong>No URL:</strong> special file - does not create a route.
            </li>
            <li>
              <strong>Parallel only:</strong> meaningful inside <C>@slot</C> folders.
            </li>
            <li>
              <strong>Not a 404:</strong> use <C>{`not-found.${e}`}</C> for missing routes.
            </li>
          </ul>
        </Callout>
      </Section>

      <Section id="default-for-parallel" title="Fallback for Parallel Routes">
        <P>
          Parallel slots like <C>@analytics</C> and <C>@team</C> render beside the main page inside
          the parent layout. When you navigate to a path the slot does not define, that slot shows
          its <C>{`default.${e}`}</C>.
        </P>
        <RouteVisual
          fileWidth={300}
          rows={[
            { n: 'dashboard' },
            { n: `layout.${e}`, d: 1 },
            { n: `page.${e}`, d: 1, url: '/dashboard' },
            { n: '@analytics', d: 1 },
            { n: `page.${e}`, d: 2 },
            { n: `default.${e}`, d: 2, dot: true },
            { n: 'views', d: 2 },
            { n: `page.${e}`, d: 3, url: '/dashboard/views' },
            { n: '@team', d: 1 },
            { n: `page.${e}`, d: 2 },
            { n: `default.${e}`, d: 2, dot: true },
            { n: 'settings', d: 2 },
            { n: `page.${e}`, d: 3, url: '/dashboard/settings' },
          ]}
        />
        <CodeBlock
          filename={`src/app/dashboard/@analytics/default.${e}`}
          tsCode={`export default function DefaultAnalytics() {
  return (
    <div className="p-4 text-sm text-neutral-500">
      Select an analytics view
    </div>
  )
}`}
          jsCode={`export default function DefaultAnalytics() {
  return (
    <div className="p-4 text-sm text-neutral-500">
      Select an analytics view
    </div>
  )
}`}
        />
        <Callout>
          Slot folder names (<C>@analytics</C>) do not appear in the URL. Sub-routes under a slot
          (e.g. <C>views/page</C>) do contribute path segments.
        </Callout>
      </Section>

      <Section id="creating-default" title="Creating a Default">
        <P>
          Create <C>{`default.${e}`}</C> inside any <C>@slot</C> folder. Export a default component
          - no special props required.
        </P>
        <CodeBlock
          filename={`src/app/dashboard/@team/default.${e}`}
          tsCode={`export default function DefaultTeam() {
  return (
    <div className="rounded-lg border border-neutral-200 p-6 dark:border-neutral-800">
      <h3 className="font-medium">Team</h3>
      <p className="mt-1 text-sm text-neutral-500">
        Select a team view
      </p>
    </div>
  )
}`}
          jsCode={`export default function DefaultTeam() {
  return (
    <div className="rounded-lg border border-neutral-200 p-6 dark:border-neutral-800">
      <h3 className="font-medium">Team</h3>
      <p className="mt-1 text-sm text-neutral-500">
        Select a team view
      </p>
    </div>
  )
}`}
        />
      </Section>

      <Section id="default-vs-page" title="Default vs Page">
        <Table
          headers={['Feature', `page.${e}`, `default.${e}`]}
          rows={[
            ['Location', 'Any folder', 'Inside @slot'],
            ['When rendered', 'Route matches', 'Slot has no matching child'],
            ['Use case', 'Route UI', 'Soft slot fallback'],
          ]}
        />
        <Callout>
          Example: navigate to <C>/dashboard/settings</C>. If <C>@analytics</C> has no settings
          child, <C>@analytics/default</C> renders while <C>@team/settings/page</C> (if present)
          still shows.
        </Callout>
      </Section>

      <Section id="complete-example" title="Complete Example">
        <RouteVisual
          fileWidth={300}
          rows={[
            { n: 'app' },
            { n: `layout.${e}`, d: 1 },
            { n: `page.${e}`, d: 1, url: '/' },
            { n: 'dashboard', d: 1 },
            { n: `layout.${e}`, d: 2 },
            { n: `page.${e}`, d: 2, url: '/dashboard' },
            { n: '@analytics', d: 2 },
            { n: `page.${e}`, d: 3 },
            { n: `default.${e}`, d: 3, dot: true },
            { n: 'views', d: 3 },
            { n: `page.${e}`, d: 4, url: '/dashboard/views' },
            { n: '@team', d: 2 },
            { n: `page.${e}`, d: 3 },
            { n: `default.${e}`, d: 3, dot: true },
            { n: 'settings', d: 3 },
            { n: `page.${e}`, d: 4, url: '/dashboard/settings' },
          ]}
        />
        <Table
          headers={['Path', 'URL']}
          rows={[
            [`dashboard/page.${e}`, '/dashboard'],
            [`dashboard/@analytics/page.${e}`, '/dashboard'],
            [`dashboard/@analytics/default.${e}`, '-'],
            [`dashboard/@analytics/views/page.${e}`, '/dashboard/views'],
            [`dashboard/@team/settings/page.${e}`, '/dashboard/settings'],
          ]}
        />
      </Section>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link to="/docs/templates" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Template</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Wrap each page individually inside the layout chain.</p>
        </Link>
        <Link to="/docs/notfound" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Not Found</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Handle unmatched URLs with a custom 404 page.</p>
        </Link>
        <Link to="/docs/parallel-routes" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Parallel Routes</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Render multiple routes in the same layout with named slots.</p>
        </Link>
        <Link to="/docs/error-boundaries" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Error Boundaries</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Catch render errors and show a fallback UI.</p>
        </Link>
        <Link to="/docs/layouts-and-pages" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Layouts and Pages</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Create your first pages and wrap them in shared layouts.</p>
        </Link>
        <Link to="/docs/folder-based-routing" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Folder-Based Routing</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Define routes with folders and page files inside them.</p>
        </Link>
      </div>
    </>
  )
}

export default function DefaultPage() {
  return (
    <DocPage
      title="Default"
      badge="Experimental"
      description="default.tsx is the fallback for parallel route slots - special file, no URL."
      url="https://bini.js.org/docs/defaults"
      editUrl="https://github.com/Binidu01/bini-official/edit/main/src/app/docs/defaults.tsx"
      toc={TOC_ITEMS}
      prev={{ to: '/docs/templates', title: 'Template' }}
      next={{ to: '/docs/notfound', title: 'Not Found (404)' }}
    >
      <Content />
    </DocPage>
  )
}