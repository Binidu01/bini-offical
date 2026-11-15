// src/app/docs/folder-based-routing.tsx
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
import { FolderVisual, RouteVisual } from '../../components/DocVisuals'
import type { TocItem } from '../../components/TableOfContents'

const TOC_ITEMS: TocItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'basic-folder-routing', label: 'Basic Folder Routing' },
  { id: 'nested-routes', label: 'Nested Routes' },
  { id: 'route-groups', label: 'Route Groups' },
  { id: 'private-folders', label: 'Private Folders' },
  { id: 'nearest-wins', label: 'Nearest Wins with Folders' },
  { id: 'folder-types', label: 'Folder Types and URLs' },
  { id: 'complete-example', label: 'Complete Example' },
]

const STRONG = 'font-semibold text-black dark:text-white'

function Content() {
  const lang = useDocLang()
  const e = lang === 'js' ? 'jsx' : 'tsx'
  const s = lang === 'js' ? 'js' : 'ts'

  return (
    <>
      <Section id="overview" title="Overview">
        <P>
          Bini.js uses <strong className={STRONG}>folder-based routing</strong> - every folder
          inside <C>src/app/</C> becomes a URL segment. Add <C>{`page.${e}`}</C> inside that folder
          to make the route accessible.
        </P>
        <Table
          headers={['Folder Pattern', 'URL', 'Type']}
          rows={[
            [`src/app/about/page.${e}`, '/about', 'Static folder - creates URL'],
            [`src/app/dashboard/settings/page.${e}`, '/dashboard/settings', 'Nested folder - creates URL'],
            [`src/app/(marketing)/about/page.${e}`, '/about', 'Route group - folder ignored'],
            [`src/app/_components/Header.${e}`, '-', 'Private folder - no URL'],
            [`src/app/.internal/page.${e}`, '-', 'Private folder - no URL'],
          ]}
        />
      </Section>

      <Section id="basic-folder-routing" title="Basic Folder Routing">
        <P>
          Every folder becomes a URL segment. Add a <C>{`page.${e}`}</C> file to expose it.
        </P>
        <RouteVisual
          badges
          fileWidth={260}
          rows={[
            { n: 'app' },
            { n: `page.${e}`, d: 1, dot: true, url: '/' },
            { n: 'about', d: 1 },
            { n: `page.${e}`, d: 2, url: '/about' },
            { n: 'blog', d: 1 },
            { n: `page.${e}`, d: 2, url: '/blog' },
            { n: 'dashboard', d: 1 },
            { n: `page.${e}`, d: 2, url: '/dashboard' },
          ]}
        />
        <CodeBlock
          filename={`src/app/about/page.${e}`}
          tsCode={`export default function AboutPage() {
  return <h1>About</h1>
}`}
          jsCode={`export default function AboutPage() {
  return <h1>About</h1>
}`}
        />
      </Section>

      <Section id="nested-routes" title="Nested Routes">
        <P>
          Nest folders to create nested URL segments. Each nested folder adds one segment.
        </P>
        <RouteVisual
          badges
          fileWidth={280}
          rows={[
            { n: 'app' },
            { n: 'blog', d: 1 },
            { n: `page.${e}`, d: 2, dot: true, url: '/blog' },
            { n: 'authors', d: 2 },
            { n: `page.${e}`, d: 3, url: '/blog/authors' },
            { n: 'dashboard', d: 1 },
            { n: `page.${e}`, d: 2, url: '/dashboard' },
            { n: 'settings', d: 2 },
            { n: `page.${e}`, d: 3, url: '/dashboard/settings' },
          ]}
        />
        <CodeBlock
          filename={`src/app/blog/authors/page.${e}`}
          tsCode={`export default function AuthorsPage() {
  return (
    <ul>
      <li>Alice</li>
      <li>Bob</li>
    </ul>
  )
}`}
          jsCode={`export default function AuthorsPage() {
  return (
    <ul>
      <li>Alice</li>
      <li>Bob</li>
    </ul>
  )
}`}
        />
        <Callout>
          Layouts from parent folders wrap child routes. A <C>{`layout.${e}`}</C> at the root wraps
          every page.
        </Callout>
      </Section>

      <Section id="route-groups" title="Route Groups">
        <P>
          Wrap a folder name in parentheses, like <C>(marketing)</C>, to organize routes without
          adding a URL segment. The group name is dropped from the path.
        </P>
        <RouteVisual
          badges
          fileWidth={260}
          rows={[
            { n: 'app' },
            { n: '(marketing)', d: 1 },
            { n: 'about', d: 2 },
            { n: `page.${e}`, d: 3, url: '/about' },
            { n: '(shop)', d: 1 },
            { n: 'cart', d: 2 },
            { n: `page.${e}`, d: 3, url: '/cart' },
          ]}
        />
        <P>
          Both pages are routed normally: <C>/about</C> and <C>/cart</C>. The group folders
          themselves never appear in the URL.
        </P>
        <CodeBlock
          filename={`src/app/(marketing)/about/page.${e}`}
          tsCode={`export default function AboutPage() {
  return <h1>About</h1>
}`}
          jsCode={`export default function AboutPage() {
  return <h1>About</h1>
}`}
        />
        <P>
          Each group can also have its own <C>{`layout.${e}`}</C> that wraps only the routes inside
          that group.
        </P>
        <CodeBlock
          filename={`src/app/(marketing)/layout.${e}`}
          tsCode={`import { Outlet } from 'react-router-dom'

export default function MarketingLayout() {
  return (
    <div>
      <nav>Marketing Nav</nav>
      <main><Outlet /></main>
    </div>
  )
}`}
          jsCode={`import { Outlet } from 'react-router-dom'

export default function MarketingLayout() {
  return (
    <div>
      <nav>Marketing Nav</nav>
      <main><Outlet /></main>
    </div>
  )
}`}
        />
      </Section>

      <Section id="private-folders" title="Private Folders">
        <P>
          Prefix a folder with <C>_</C> or <C>.</C> to keep it out of routing. Private folders do
          not create URLs. Use them to keep components, helpers, and data next to the route that
          uses them.
        </P>
        <RouteVisual
          badges
          fileWidth={280}
          rows={[
            { n: 'app' },
            { n: '_components', d: 1 },
            { n: `Header.${e}`, d: 2, dot: true, url: '/_components/Header', ok: false },
            { n: '_lib', d: 1 },
            { n: `utils.${s}`, d: 2, url: '/_lib/utils', ok: false },
            { n: 'blog', d: 1 },
            { n: `page.${e}`, d: 2, url: '/blog' },
            { n: '_components', d: 2 },
            { n: `PostCard.${e}`, d: 3, url: '/blog/_components/PostCard', ok: false },
          ]}
        />
        <Table
          headers={['Folder Pattern', 'Creates URL?', 'Description']}
          rows={[
            ['_components', 'No', 'Private folder (underscore prefix)'],
            ['.hidden', 'No', 'Private folder (dot prefix)'],
            ['blog/_components', 'No', 'Private folder inside a route'],
            ['about, blog', 'Yes', `Public folder with page.${e}`],
          ]}
        />
      </Section>

      <Section id="nearest-wins" title="Nearest Wins with Folders">
        <P>
          <C>{`loading.${e}`}</C>, <C>{`not-found.${e}`}</C>, and <C>{`error.${e}`}</C> use{' '}
          <strong className={STRONG}>nearest-wins</strong> resolution. A file in a subfolder only
          affects that subfolder, and shadows the same file from a parent folder.
        </P>
        <FolderVisual
          width={300}
          rows={[
            { n: 'app' },
            { n: `layout.${e}`, d: 1 },
            { n: `page.${e}`, d: 1, dot: true },
            { n: `loading.${e}`, d: 1 },
            { n: `not-found.${e}`, d: 1 },
            { n: `error.${e}`, d: 1 },
            { n: 'dashboard', d: 1 },
            { n: `layout.${e}`, d: 2 },
            { n: `page.${e}`, d: 2 },
            { n: `loading.${e}`, d: 2, dot: true },
            { n: `error.${e}`, d: 2, dot: true },
            { n: 'settings', d: 2 },
            { n: `page.${e}`, d: 3 },
          ]}
        />
        <P>Resolution order: route's own folder → parent folders → built-in default.</P>
        <CodeBlock
          filename={`src/app/dashboard/loading.${e}`}
          tsCode={`export default function DashboardLoading() {
  return <p>Loading dashboard…</p>
}`}
          jsCode={`export default function DashboardLoading() {
  return <p>Loading dashboard…</p>
}`}
        />
      </Section>

      <Section id="folder-types" title="Folder Types and URLs">
        <P>
          Each folder type affects URLs differently. Static and nested folders create URL segments.
          Route groups and private folders do not.
        </P>
        <Table
          headers={['Folder Type', 'Example', 'Creates URL?']}
          rows={[
            ['Static', `src/app/about/page.${e}`, 'Yes - /about'],
            ['Nested', `src/app/blog/authors/page.${e}`, 'Yes - /blog/authors'],
            ['Route group', `src/app/(marketing)/about/page.${e}`, 'Yes - /about (group dropped)'],
            ['Private', `src/app/_components/Header.${e}`, 'No'],
          ]}
        />
      </Section>

      <Section id="complete-example" title="Complete Example">
        <P>
          A folder-based project showing which folders create URLs and which do not.
        </P>
        <RouteVisual
          badges
          fileWidth={300}
          rows={[
            { n: 'app' },
            { n: '(marketing)', d: 1 },
            { n: `page.${e}`, d: 2, url: '/' },
            { n: 'about', d: 2 },
            { n: `page.${e}`, d: 3, url: '/about' },
            { n: '_components', d: 1 },
            { n: `Button.${e}`, d: 2, url: '/_components/Button', ok: false },
            { n: 'blog', d: 1 },
            { n: `layout.${e}`, d: 2 },
            { n: `page.${e}`, d: 2, dot: true, url: '/blog' },
            { n: 'authors', d: 2 },
            { n: `page.${e}`, d: 3, url: '/blog/authors' },
            { n: `layout.${e}`, d: 1 },
            { n: `page.${e}`, d: 1, url: '/' },
            { n: `loading.${e}`, d: 1 },
            { n: `error.${e}`, d: 1 },
            { n: `not-found.${e}`, d: 1 },
          ]}
        />
        <Table
          headers={['Folder Path', 'URL', 'Creates URL?']}
          rows={[
            [`src/app/page.${e}`, '/', 'Yes'],
            [`src/app/about/page.${e}`, '/about', 'Yes - static folder'],
            [`src/app/blog/page.${e}`, '/blog', 'Yes - static folder'],
            [`src/app/blog/authors/page.${e}`, '/blog/authors', 'Yes - nested folder'],
            [`src/app/(marketing)/about/page.${e}`, '/about', 'Yes, group folder ignored'],
            [`src/app/_components/Button.${e}`, '-', 'No - private folder'],
            [`src/app/blog/_components/PostCard.${e}`, '-', 'No - private folder'],
          ]}
        />
      </Section>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link to="/docs/file-based-routing" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">File-Based Routing</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Define routes with flat files instead of folders.</p>
        </Link>
        <Link to="/docs/dynamic-routes" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Dynamic Routes</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Match URL segments with dynamic parameters and catch-alls.</p>
        </Link>
        <Link to="/docs/parallel-routes" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Parallel Routes</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Render multiple routes in the same layout with named slots.</p>
        </Link>
        <Link to="/docs/catch-all-routes" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Catch-All Routes</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Match any number of trailing URL segments.</p>
        </Link>
        <Link to="/docs/layouts-and-pages" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Layouts and Pages</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Create your first pages and wrap them in shared layouts.</p>
        </Link>
        <Link to="/docs/project-structure" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Project Structure</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Learn how a Bini.js project is organized and what each folder contains.</p>
        </Link>
      </div>
    </>
  )
}

export default function FolderBasedRoutingPage() {
  return (
    <DocPage
      title="Folder-Based Routing"
      description="Folders inside src/app define URL segments. Each folder becomes a part of the URL path."
      url="https://bini.js.org/docs/folder-based-routing"
      editUrl="https://github.com/Binidu01/bini-official/edit/main/src/app/docs/folder-based-routing.tsx"
      toc={TOC_ITEMS}
      prev={{ to: '/docs/linking-and-navigating', title: 'Linking and Navigating' }}
      next={{ to: '/docs/file-based-routing', title: 'File-Based Routing' }}
    >
      <Content />
    </DocPage>
  )
}