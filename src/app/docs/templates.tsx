// src/app/docs/templates.tsx
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
  { id: 'what-is-template', label: 'What is template.tsx?' },
  { id: 'template-vs-layout', label: 'template.tsx vs layout.tsx' },
  { id: 'creating-template', label: 'Creating a Template' },
  { id: 'use-cases', label: 'Use Cases' },
  { id: 'file-naming-note', label: 'File Naming - templates.tsx' },
  { id: 'complete-example', label: 'Complete Example' },
]

function VisualOverview({ ext }: { ext: string }) {
  return (
    <RouteVisual
      fileWidth={260}
      rows={[
        { n: 'app' },
        { n: `layout.${ext}`, d: 1 },
        { n: `template.${ext}`, d: 1, dot: true },
        { n: `page.${ext}`, d: 1, url: '/' },
        { n: 'about', d: 1 },
        { n: `page.${ext}`, d: 2, url: '/about' },
      ]}
    />
  )
}

function VisualVsLayout({ ext }: { ext: string }) {
  return (
    <RouteVisual
      fileWidth={280}
      rows={[
        { n: 'app' },
        { n: `layout.${ext}`, d: 1 },
        { n: `template.${ext}`, d: 1, dot: true },
        { n: `page.${ext}`, d: 1, url: '/' },
        { n: 'about', d: 1 },
        { n: `layout.${ext}`, d: 2 },
        { n: `template.${ext}`, d: 2, dot: true },
        { n: `page.${ext}`, d: 2, url: '/about' },
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
        { n: `template.${ext}`, d: 1, dot: true },
        { n: `loading.${ext}`, d: 1 },
        { n: `error.${ext}`, d: 1 },
        { n: `page.${ext}`, d: 1, url: '/' },
        { n: 'dashboard', d: 1 },
        { n: `layout.${ext}`, d: 2 },
        { n: `template.${ext}`, d: 2, dot: true },
        { n: `page.${ext}`, d: 2, url: '/dashboard' },
        { n: 'settings', d: 2 },
        { n: `page.${ext}`, d: 3, url: '/dashboard/settings' },
      ]}
    />
  )
}

function Content() {
  const lang = useDocLang()
  const e = lang === 'js' ? 'jsx' : 'tsx'

  return (
    <>
      <Section id="overview" title="Overview">
        <P>
          <C>{`template.${e}`}</C> sits between the layout chain and the page. Like{' '}
          <C>{`layout.${e}`}</C>, it is a special file and does not create a URL. Unlike a layout,
          it is resolved per page scope and is a good place for effects that should run when
          navigating between pages.
        </P>
        <VisualOverview ext={e} />
        <Table
          headers={['File', 'Creates URL?', 'Role']}
          rows={[
            [
              `layout.${e}`,
              'No - special file',
              'Wraps segment + children, receives params',
            ],
            [
              `template.${e}`,
              'No - special file',
              'Wraps page inside layout chain, receives children',
            ],
            [`page.${e}`, 'Yes', 'Route content'],
          ]}
        />
        <Callout>
          Templates only apply to routes inside the folder that declares them and its descendants.
          They receive <C>children</C>, not <C>params</C>.
        </Callout>
      </Section>

      <Section id="what-is-template" title="What is template.tsx?">
        <P>
          A <C>{`template.${e}`}</C> file wraps each page in its scope. The nearest template with a
          default export is used (nearest-wins, same as loading and error).
        </P>
        <div className="mb-6 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-950">
          <ul className="list-disc space-y-2 pl-5 text-[15px] text-neutral-600 dark:text-neutral-400">
            <li>
              <span className="font-semibold text-black dark:text-white">
                Between layout and page:
              </span>{' '}
              renders inside the layout chain, around the page
            </li>
            <li>
              <span className="font-semibold text-black dark:text-white">children only:</span>{' '}
              templates receive <C>children</C>, not route <C>params</C>
            </li>
            <li>
              <span className="font-semibold text-black dark:text-white">Folder-scoped:</span>{' '}
              applies to that folder and descendants only
            </li>
            <li>
              <span className="font-semibold text-black dark:text-white">No URL:</span> special
              file - does not create a route
            </li>
          </ul>
        </div>
      </Section>

      <Section id="template-vs-layout" title="template.tsx vs layout.tsx">
        <Table
          headers={['Feature', `layout.${e}`, `template.${e}`]}
          rows={[
            ['Creates URL?', 'No', 'No'],
            ['Wraps', 'Segment + all children', 'Page inside layout chain'],
            ['Props', 'Outlet / params', 'children'],
            [
              'Typical use',
              'Nav, sidebar, shared chrome',
              'Page-level effects, transitions',
            ],
            ['Location', 'Any folder', 'Any folder'],
          ]}
        />
        <VisualVsLayout ext={e} />
      </Section>

      <Section id="creating-template" title="Creating a Template">
        <P>
          Create <C>{`template.${e}`}</C> in any folder. It must have a default export and
          receives <C>children</C>.
        </P>
        <CodeBlock
          filename={`app/template.${e}`}
          tsCode={`export default function Template({
  children,
}: {
  children: React.ReactNode
}) {
  return <div>{children}</div>
}`}
          jsCode={`export default function Template({ children }) {
  return <div>{children}</div>
}`}
        />
        <CodeBlock
          filename={`app/template.${e}`}
          tsCode={`export default function Template({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // Useful for analytics or focus management
    console.log('Template active')
  }, [])

  return <div>{children}</div>
}`}
          jsCode={`export default function Template({ children }) {
  useEffect(() => {
    // Useful for analytics or focus management
    console.log('Template active')
  }, [])

  return <div>{children}</div>
}`}
        />
        <CodeBlock
          filename={`app/dashboard/template.${e}`}
          tsCode={`export default function DashboardTemplate({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="animate-in fade-in">
      {children}
    </div>
  )
}`}
          jsCode={`export default function DashboardTemplate({ children }) {
  return (
    <div className="animate-in fade-in">
      {children}
    </div>
  )
}`}
        />
        <Callout>
          Templates that contain an <C>html</C> tag are ignored. Prefer simple wrappers around{' '}
          <C>children</C>.
        </Callout>
      </Section>

      <Section id="use-cases" title="Use Cases">
        <P>
          Prefer a template when you need page-scoped behavior without changing the persistent
          layout chrome.
        </P>
        <Table
          headers={['Use Case', 'Why template?']}
          rows={[
            ['Page transitions', 'Wrap the page for enter/exit animation classes'],
            ['Analytics / logging', 'Run effects around each page view'],
            ['Focus management', 'Move focus when the page content changes'],
            ['Reset local UI state', 'Keep layout state, re-init page-level UI'],
          ]}
        />
      </Section>

      <Section id="file-naming-note" title="File Naming - templates.tsx">
        <P>
          On this docs site, the page file is named <C>templates.tsx</C> (plural) so it is not
          treated as the special <C>{`template.${e}`}</C> convention. The real special file in
          apps remains <C>{`template.${e}`}</C>.
        </P>
        <Table
          headers={['Real special file', 'Docs page file', 'Why?']}
          rows={[
            [
              `app/template.${e}`,
              'app/docs/templates.tsx',
              'Avoid special-file handling for the docs route',
            ],
            [
              `app/default.${e}`,
              'app/docs/defaults.tsx',
              'Same idea for slot defaults',
            ],
          ]}
        />
      </Section>

      <Section id="complete-example" title="Complete Example">
        <P>
          Templates next to layouts, loading, and error - special files do not create URLs.
        </P>
        <VisualComplete ext={e} />
        <Table
          headers={['File', 'Creates URL?', 'Purpose']}
          rows={[
            [`app/layout.${e}`, 'No', 'Root layout'],
            [`app/template.${e}`, 'No', 'Root template'],
            [`app/page.${e}`, 'Yes - /', 'Home page'],
            [`app/dashboard/template.${e}`, 'No', 'Dashboard page wrapper'],
            [`app/dashboard/page.${e}`, 'Yes - /dashboard', 'Dashboard page'],
          ]}
        />
        <Callout>
          Use <C>{`layout.${e}`}</C> for shared chrome. Use <C>{`template.${e}`}</C> for
          page-level wrapping inside that chrome.
        </Callout>
      </Section>
    </>
  )
}

export default function TemplatePage() {
  return (
    <DocPage
      title="Template"
      description="template.tsx wraps pages inside the layout chain - special file, no URL, nearest-wins."
      url="https://bini.js.org/docs/templates"
      editUrl="https://github.com/Binidu01/bini-official/edit/main/src/app/docs/templates.tsx"
      toc={TOC_ITEMS}
      prev={{ to: '/docs/error-boundaries', title: 'Error Boundaries' }}
      next={{ to: '/docs/defaults', title: 'Default' }}
    >
      <Content />
    </DocPage>
  )
}