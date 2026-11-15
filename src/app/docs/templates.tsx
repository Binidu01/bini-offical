// src/app/docs/templates.tsx
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
  { id: 'template-vs-layout', label: 'Templates vs Layouts' },
  { id: 'creating-template', label: 'Creating a Template' },
  { id: 'use-cases', label: 'Use Cases' },
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
          A <C>{`template.${e}`}</C> file wraps each page inside the layout chain. Like{' '}
          <C>{`layout.${e}`}</C>, it is a special file and does not create a URL. Unlike a layout,
          it is resolved per page scope and is a good place for effects that should run when
          navigating between pages.
        </P>
        <VisualOverview ext={e} />
        <Table
          headers={['File', 'Role']}
          rows={[
            [`layout.${e}`, 'Wraps segment + children, receives params'],
            [`template.${e}`, 'Wraps page inside layout chain, receives children'],
            [`page.${e}`, 'Route content'],
          ]}
        />
        <Callout>
          A template only applies to routes inside the folder that declares it and its
          descendants. The nearest usable template wins, and templates receive <C>children</C>{' '}
          only - not <C>params</C>.
        </Callout>
      </Section>

      <Section id="template-vs-layout" title="Templates vs Layouts">
        <P>
          Both are special files that wrap page content without creating a URL. They differ in
          what they receive and in how they behave on navigation.
        </P>
        <Table
          headers={['Feature', `layout.${e}`, `template.${e}`]}
          rows={[
            ['Wraps', 'Segment + all children', 'Page inside layout chain'],
            ['Props', 'params + children (Outlet)', 'children only'],
            [
              'Typical use',
              'Nav, sidebar, shared chrome',
              'Page-level effects, transitions',
            ],
            ['State persistence', 'Persists across navigation', 'Resets on every navigation'],
          ]}
        />
        <VisualVsLayout ext={e} />
        <P>
          In practice, put persistent chrome - navigation bars, sidebars, footers - in a{' '}
          <C>{`layout.${e}`}</C>. Put anything that should re-run or reset when the route changes
          in a <C>{`template.${e}`}</C>.
        </P>
        <CodeBlock
          filename={`src/app/layout.${e}`}
          tsCode={`import { Outlet } from 'react-router-dom'

export default function RootLayout() {
  return (
    <div>
      <nav>Persistent nav</nav>
      <Outlet />
    </div>
  )
}`}
          jsCode={`import { Outlet } from 'react-router-dom'

export default function RootLayout() {
  return (
    <div>
      <nav>Persistent nav</nav>
      <Outlet />
    </div>
  )
}`}
        />
        <CodeBlock
          filename={`src/app/template.${e}`}
          tsCode={`import { useEffect } from 'react'

export default function RootTemplate({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // Runs once per page view
    console.log('Page mounted')
  }, [])

  return <>{children}</>
}`}
          jsCode={`import { useEffect } from 'react'

export default function RootTemplate({ children }) {
  useEffect(() => {
    // Runs once per page view
    console.log('Page mounted')
  }, [])

  return <>{children}</>
}`}
        />
      </Section>

      <Section id="creating-template" title="Creating a Template">
        <P>
          Create <C>{`template.${e}`}</C> in any folder. It must have a default export and
          receives <C>children</C>.
        </P>
        <CodeBlock
          filename={`src/app/template.${e}`}
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
        <P>
          Because templates are unmounted and remounted on navigation, they are useful for
          running effects once per page view:
        </P>
        <CodeBlock
          filename={`src/app/template.${e}`}
          tsCode={`import { useEffect } from 'react'

export default function Template({
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
          jsCode={`import { useEffect } from 'react'

export default function Template({ children }) {
  useEffect(() => {
    // Useful for analytics or focus management
    console.log('Template active')
  }, [])

  return <div>{children}</div>
}`}
        />
        <Callout>
          Templates that contain an <C>html</C> element are ignored, the same way layouts are.
          Prefer simple wrappers around <C>children</C>.
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
            ['Analytics / logging', 'Run effects on every page view'],
            ['Focus management', 'Move focus when the page content changes'],
            [
              'Reset local UI state',
              'Keep layout state, but re-initialize page-level UI on navigation',
            ],
          ]}
        />
      </Section>

      <Section id="complete-example" title="Complete Example">
        <P>
          Templates next to layouts, loading, and error. Special files do not create URLs.
        </P>
        <VisualComplete ext={e} />
        <Table
          headers={['File', 'Purpose']}
          rows={[
            [`src/app/layout.${e}`, 'Root layout'],
            [`src/app/template.${e}`, 'Root template'],
            [`src/app/page.${e}`, 'Home page'],
            [`src/app/dashboard/template.${e}`, 'Dashboard page wrapper'],
            [`src/app/dashboard/page.${e}`, 'Dashboard page'],
          ]}
        />
        <Callout>
          Use <C>{`layout.${e}`}</C> for shared chrome. Use <C>{`template.${e}`}</C> for
          page-level wrapping inside that chrome.
        </Callout>
      </Section>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link to="/docs/error-boundaries" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Error Boundaries</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Catch render errors and show a fallback UI.</p>
        </Link>
        <Link to="/docs/defaults" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Default</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Fallback for a parallel route slot with no match.</p>
        </Link>
        <Link to="/docs/load" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Loading UI</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Show a fallback while pages and layouts load.</p>
        </Link>
        <Link to="/docs/layouts-and-pages" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Layouts and Pages</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Create your first pages and wrap them in shared layouts.</p>
        </Link>
        <Link to="/docs/folder-based-routing" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Folder-Based Routing</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Define routes with folders and page files inside them.</p>
        </Link>
        <Link to="/docs/static-export" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Static Export</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">How every route is pre-rendered to HTML at build time.</p>
        </Link>
      </div>
    </>
  )
}

export default function TemplatePage() {
  return (
    <DocPage
      title="Template"
      badge="Experimental"
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