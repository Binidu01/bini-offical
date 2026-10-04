// src/app/docs/defaults.tsx
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
  { id: 'what-is-default', label: 'What is default.tsx?' },
  { id: 'default-for-parallel', label: 'default.tsx for Parallel Routes' },
  { id: 'creating-default', label: 'Creating a default.tsx' },
  { id: 'default-vs-page', label: 'default.tsx vs page.tsx' },
  { id: 'complete-example', label: 'Complete Example' },
]

/* ---------- content (reads the TS/JS choice from DocPage) ---------- */

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
          headers={['File', 'Creates URL?', 'When rendered']}
          rows={[
            [`@analytics/page.${e}`, 'Via parent route', 'When the slot has a matching child'],
            [
              `@analytics/default.${e}`,
              'No - special file',
              'When the slot has no match for the URL',
            ],
            [`@team/default.${e}`, 'No - special file', 'Fallback for the team slot'],
          ]}
        />
      </Section>

      <Section id="what-is-default" title="What is default.tsx?">
        <P>
          <C>{`default.${e}`}</C> is the soft fallback for a parallel route slot. If navigation
          leaves a slot without a matching page, the slot shows its default instead of going blank
          or 404ing the whole page.
        </P>
        <Callout>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>Slot fallback:</strong> used when no child route matches inside <C>@slot</C>
            </li>
            <li>
              <strong>No URL:</strong> special file - does not create a route
            </li>
            <li>
              <strong>Parallel only:</strong> meaningful inside <C>@slot</C> folders
            </li>
            <li>
              <strong>Not a 404:</strong> use <C>{`not-found.${e}`}</C> for missing routes
            </li>
          </ul>
        </Callout>
      </Section>

      <Section id="default-for-parallel" title="default.tsx for Parallel Routes">
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
          filename={`app/dashboard/@analytics/default.${e}`}
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

      <Section id="creating-default" title="Creating a default.tsx">
        <P>
          Create <C>{`default.${e}`}</C> inside any <C>@slot</C> folder. Export a default component
          - no special props required.
        </P>
        <CodeBlock
          filename={`app/dashboard/@team/default.${e}`}
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

      <Section id="default-vs-page" title="default.tsx vs page.tsx">
        <Table
          headers={['Feature', `page.${e}`, `default.${e}`]}
          rows={[
            ['Location', 'Any folder', 'Inside @slot'],
            ['Creates URL?', 'Yes', 'No - special file'],
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
          headers={['Path', 'URL', 'Creates URL?']}
          rows={[
            [`dashboard/page.${e}`, '/dashboard', 'Yes'],
            [`dashboard/@analytics/page.${e}`, '/dashboard', 'Via parent (no @ segment)'],
            [`dashboard/@analytics/default.${e}`, '-', 'No - special file'],
            [`dashboard/@analytics/views/page.${e}`, '/dashboard/views', 'Yes'],
            [`dashboard/@team/settings/page.${e}`, '/dashboard/settings', 'Yes'],
          ]}
        />
        <Callout>
          This docs page is named <C>defaults.tsx</C> so the site does not treat it as the special{' '}
          <C>{`default.${e}`}</C> convention. In apps, use <C>{`default.${e}`}</C> inside{' '}
          <C>@slot</C> folders.
        </Callout>
      </Section>
    </>
  )
}

/* ---------- page ---------- */

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