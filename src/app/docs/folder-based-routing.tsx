// src/app/docs/folder-based-routing.tsx
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
  { id: 'private-folders', label: 'Private Folders (Private Routes)' },
  { id: 'nearest-wins-folders', label: 'Nearest Wins with Folders' },
  { id: 'route-priority', label: 'Route Priority' },
  { id: 'complete-example', label: 'Complete Example' },
]

const STRONG = 'font-semibold text-black dark:text-white'

/* ---------- content (reads the TS/JS choice from DocPage) ---------- */

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
        <P>
          Folder names must be valid URL segments and the structure directly maps to the URL path.
        </P>
        <Table
          headers={['Folder Pattern', 'URL', 'Type']}
          rows={[
            [`app/about/page.${e}`, '/about', 'Static folder - creates URL'],
            [`app/blog/page.${e}`, '/blog', 'Static folder - creates URL'],
            [
              `app/dashboard/settings/page.${e}`,
              '/dashboard/settings',
              'Nested folder - creates URL',
            ],
            [
              `app/(marketing)/about/page.${e}`,
              '/about',
              'Route group - folder ignored, no extra segment',
            ],
            [`app/_components/Header.${e}`, '-', 'Private folder _ - no URL'],
            [`app/.internal/page.${e}`, '-', 'Private folder . - no URL'],
          ]}
        />
      </Section>

      <Section id="basic-folder-routing" title="Basic Folder Routing">
        <P>
          Every folder becomes a segment. Add <C>{`page.${e}`}</C> to expose it.{' '}
          <C>{`index.${e}`}</C> also maps to its parent.
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
            { n: 'settings', d: 2 },
            { n: `page.${e}`, d: 3, url: '/dashboard/settings' },
            { n: 'contact', d: 1 },
            { n: `page.${e}`, d: 2, url: '/contact' },
          ]}
        />
        <CodeBlock
          filename={`app/about/page.${e}`}
          tsCode={`export default function AboutPage() {
  return <h1>About</h1>
}`}
          jsCode={`export default function AboutPage() {
  return <h1>About</h1>
}`}
        />
        <Callout>
          Every folder with a <C>{`page.${e}`}</C> creates a URL. This keeps layouts, loading, and
          error boundaries co-located per folder.
        </Callout>
      </Section>

      <Section id="nested-routes" title="Nested Routes">
        <P>
          Nest folders to create nested URL segments. Each nested folder adds a segment and creates
          a URL.
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
            { n: 'categories', d: 2 },
            { n: `page.${e}`, d: 3, url: '/blog/categories' },
            { n: 'dashboard', d: 1 },
            { n: `page.${e}`, d: 2, url: '/dashboard' },
            { n: 'settings', d: 2 },
            { n: `page.${e}`, d: 3, url: '/dashboard/settings' },
            { n: 'profile', d: 3 },
            { n: `page.${e}`, d: 4, url: '/dashboard/settings/profile' },
          ]}
        />
        <CodeBlock
          filename={`app/blog/authors/page.${e}`}
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
          Nested folders create nested URLs. Each level adds a segment. Layouts from parent folders
          wrap child routes.
        </Callout>
      </Section>

      <Section id="route-groups" title="Route Groups">
        <P>
          <C>(group)</C> organizes folders without affecting URL. The group folder does not create a
          URL segment.
        </P>
        <RouteVisual
          badges
          fileWidth={260}
          rows={[
            { n: 'app' },
            { n: '(marketing)', d: 1 },
            { n: `layout.${e}`, d: 2, dot: true },
            { n: `page.${e}`, d: 2, url: '/' },
            { n: 'about', d: 2 },
            { n: `page.${e}`, d: 3, url: '/about' },
            { n: 'pricing', d: 2 },
            { n: `page.${e}`, d: 3, url: '/pricing' },
            { n: '(app)', d: 1 },
            { n: `layout.${e}`, d: 2, dot: true },
            { n: 'dashboard', d: 2 },
            { n: `page.${e}`, d: 3, url: '/dashboard' },
            { n: `layout.${e}`, d: 1 },
          ]}
        />
        <CodeBlock
          filename={`app/(marketing)/layout.${e}`}
          tsCode={`export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <nav>Marketing Nav</nav>
      <main>{children}</main>
    </div>
  )
}`}
          jsCode={`export default function MarketingLayout({ children }) {
  return (
    <div>
      <nav>Marketing Nav</nav>
      <main>{children}</main>
    </div>
  )
}`}
        />
        <P>
          URLs are <C>/</C>, <C>/about</C>, <C>/pricing</C>, <C>/dashboard</C> - the{' '}
          <C>(marketing)</C> and <C>(app)</C> folders don't create URL segments.
        </P>
        <Callout>
          Route groups are folders wrapped in parentheses. They organize code without creating
          URLs. Perfect for applying different layouts to different sections.
        </Callout>
      </Section>

      <Section id="private-folders" title="Private Folders (Private Routes)">
        <P>
          <strong className={STRONG}>Private folders are folder-based private routes</strong> -
          prefix a folder with <C>_</C> or <C>.</C> to exclude it from routing. They do not create
          URLs.
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
            { n: 'dashboard', d: 1 },
            { n: `page.${e}`, d: 2, url: '/dashboard' },
            { n: '_components', d: 2 },
            { n: `Sidebar.${e}`, d: 3, url: '/dashboard/_components/Sidebar', ok: false },
          ]}
        />
        <Table
          headers={['Folder Pattern', 'Creates URL?', 'Description']}
          rows={[
            ['_components', 'No', 'Private folder - _ prefix - no URL'],
            ['_lib, _hooks', 'No', 'Private folders - no URL'],
            ['.hidden, .internal', 'No', 'Dot prefix - private - no URL'],
            ['blog/_components', 'No', 'Private inside route - no URL'],
            ['(group)', 'No extra segment', 'Route group - folder ignored'],
            ['blog, about', 'Yes', `Public folder with page.${e} - creates URL`],
          ]}
        />
        <Callout>
          Private folders (<C>_</C> or <C>.</C>) do not create URLs. Use them to keep components,
          utils, and hooks next to the route that uses them. Static and nested folders with{' '}
          <C>{`page.${e}`}</C> do create URLs.
        </Callout>
      </Section>

      <Section id="nearest-wins-folders" title="Nearest Wins with Folders">
        <P>
          <C>{`loading.${e}`}</C>, <C>{`not-found.${e}`}</C>, <C>{`error.${e}`}</C> use{' '}
          <strong className={STRONG}>nearest-wins</strong> resolution for folder hierarchy. A file
          in a subfolder only affects that subfolder.
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
            { n: 'blog', d: 1 },
            { n: `page.${e}`, d: 2 },
            { n: `loading.${e}`, d: 2, dot: true },
            { n: 'authors', d: 2 },
            { n: `page.${e}`, d: 3 },
          ]}
        />
        <P>Resolution: route's own folder → parent folders → built-in default.</P>
        <CodeBlock
          filename={`app/dashboard/loading.${e}`}
          tsCode={`export default function DashboardLoading() {
  return <p>Loading dashboard…</p>
}`}
          jsCode={`export default function DashboardLoading() {
  return <p>Loading dashboard…</p>
}`}
        />
      </Section>

      <Section id="route-priority" title="Route Priority">
        <P>
          In folder-based routing, static folders define exact routes and create URLs. Shorter
          paths are matched first.
        </P>
        <Callout>
          <ol className="list-decimal space-y-2 pl-5">
            <li>
              <strong>Static folders</strong> - exact matches like <C>{`about/page.${e}`}</C> →{' '}
              <C>/about</C> - creates URL
            </li>
            <li>
              <strong>Nested folders</strong> - <C>{`blog/authors/page.${e}`}</C> →{' '}
              <C>/blog/authors</C> - creates URL
            </li>
            <li>
              <strong>Route groups</strong> - <C>{`(marketing)/about/page.${e}`}</C> → <C>/about</C>{' '}
              - no extra segment
            </li>
            <li>
              <strong>Private folders</strong> - <C>_components</C>, <C>.internal</C> - no URL
            </li>
          </ol>
        </Callout>
        <RouteVisual
          badges
          fileWidth={280}
          rows={[
            { n: 'app' },
            { n: 'about', d: 1 },
            { n: `page.${e}`, d: 2, dot: true, url: '/about' },
            { n: 'blog', d: 1 },
            { n: `page.${e}`, d: 2, url: '/blog' },
            { n: 'authors', d: 2 },
            { n: `page.${e}`, d: 3, url: '/blog/authors' },
            { n: '(marketing)', d: 1 },
            { n: 'pricing', d: 2 },
            { n: `page.${e}`, d: 3, url: '/pricing' },
            { n: '_components', d: 1 },
            { n: `Header.${e}`, d: 2, url: '/_components/Header', ok: false },
          ]}
        />
        <Callout>
          Static and nested folders create URLs. Route groups and private folders do not create
          URLs or extra segments.
        </Callout>
      </Section>

      <Section id="complete-example" title="Complete Example">
        <P>
          Complete folder-based routing example showing which folders create URLs and which don't.
        </P>
        <RouteVisual
          badges
          fileWidth={300}
          rows={[
            { n: 'app' },
            { n: '(marketing)', d: 1 },
            { n: `layout.${e}`, d: 2 },
            { n: `page.${e}`, d: 2, url: '/' },
            { n: 'about', d: 2 },
            { n: `page.${e}`, d: 3, url: '/about' },
            { n: '_components', d: 2 },
            { n: `Hero.${e}`, d: 3, url: '/_components/Hero', ok: false },
            { n: '_components', d: 1 },
            { n: `Button.${e}`, d: 2, url: '/_components/Button', ok: false },
            { n: 'blog', d: 1 },
            { n: `layout.${e}`, d: 2 },
            { n: `page.${e}`, d: 2, dot: true, url: '/blog' },
            { n: `loading.${e}`, d: 2 },
            { n: 'authors', d: 2 },
            { n: `page.${e}`, d: 3, url: '/blog/authors' },
            { n: 'dashboard', d: 1 },
            { n: `layout.${e}`, d: 2 },
            { n: `page.${e}`, d: 2, url: '/dashboard' },
            { n: 'settings', d: 2 },
            { n: `page.${e}`, d: 3, url: '/dashboard/settings' },
            { n: 'profile', d: 3 },
            { n: `page.${e}`, d: 4, url: '/dashboard/settings/profile' },
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
            [`app/page.${e}`, '/', 'Yes - creates URL'],
            [`app/about/page.${e}`, '/about', 'Yes - static folder creates URL'],
            [`app/blog/page.${e}`, '/blog', 'Yes - static folder creates URL'],
            [`app/blog/authors/page.${e}`, '/blog/authors', 'Yes - nested folder creates URL'],
            [
              `app/dashboard/settings/profile/page.${e}`,
              '/dashboard/settings/profile',
              'Yes - deeply nested creates URL',
            ],
            [`app/(marketing)/about/page.${e}`, '/about', 'Yes, but group folder ignored'],
            [`app/_components/Header.${e}`, '-', 'No - private folder, no URL'],
            [`app/.internal/config.${s}`, '-', 'No - private folder, no URL'],
            [
              `app/blog/_components/PostCard.${e}`,
              '-',
              'No - private inside route, no URL',
            ],
          ]}
        />
        <Callout>
          Static folders and nested folders with <C>{`page.${e}`}</C> create URLs. Private folders
          (<C>_</C> / <C>.</C>) and route groups <C>(group)</C> do not create extra URL segments.
          Private folders are for organizing code without creating URLs.
        </Callout>
      </Section>
    </>
  )
}

/* ---------- page ---------- */

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