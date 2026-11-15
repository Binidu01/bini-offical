// src/app/docs/file-based-routing.tsx
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
  { id: 'basic-file-routing', label: 'Basic File Routing' },
  { id: 'flat-vs-folder', label: 'Flat Files vs Folders' },
  { id: 'index-files', label: 'Index Files' },
  { id: 'file-extensions', label: 'File Extensions' },
  { id: 'reserved-names', label: 'Reserved Names' },
  { id: 'complete-example', label: 'Complete Example' },
]

const STRONG = 'font-semibold text-black dark:text-white'

function Content() {
  const lang = useDocLang()
  const e = lang === 'js' ? 'jsx' : 'tsx'

  return (
    <>
      <Section id="overview" title="Overview">
        <P>
          Bini.js supports <strong className={STRONG}>file-based routing</strong> - a file placed
          directly in <C>src/app/</C> becomes a route, without a folder. For example{' '}
          <C>{`about.${e}`}</C> creates <C>/about</C>.
        </P>
        <Table
          headers={['File Path', 'URL']}
          rows={[
            [`src/app/page.${e}`, '/'],
            [`src/app/about.${e}`, '/about'],
            [`src/app/contact.${e}`, '/contact'],
            [`src/app/blog.${e}`, '/blog'],
          ]}
        />
      </Section>

      <Section id="basic-file-routing" title="Basic File Routing">
        <P>
          A file in <C>src/app</C> directly maps to a URL. The file must default-export a React
          component.
        </P>
        <RouteVisual
          badges
          fileWidth={260}
          rows={[
            { n: 'app' },
            { n: `page.${e}`, d: 1, dot: true, url: '/' },
            { n: `about.${e}`, d: 1, url: '/about' },
            { n: `contact.${e}`, d: 1, url: '/contact' },
            { n: `blog.${e}`, d: 1, url: '/blog' },
          ]}
        />
        <CodeBlock
          filename={`src/app/about.${e}`}
          tsCode={`export default function AboutPage() {
  return <h1>About Us</h1>
}`}
          jsCode={`export default function AboutPage() {
  return <h1>About Us</h1>
}`}
        />
      </Section>

      <Section id="flat-vs-folder" title="Flat Files vs Folders">
        <P>
          A flat file and a folder with a <C>{`page.${e}`}</C> produce the same URL. Use a flat file
          for simple pages, and a folder when you need a co-located <C>{`layout.${e}`}</C>,{' '}
          <C>{`loading.${e}`}</C>, or private folders like <C>_components</C>.
        </P>
        <Table
          headers={['Approach', 'File Path', 'URL']}
          rows={[
            ['File-based', `src/app/about.${e}`, '/about'],
            ['Folder-based', `src/app/about/page.${e}`, '/about'],
            ['File-based', `src/app/dashboard.${e}`, '/dashboard'],
            ['Folder-based', `src/app/dashboard/page.${e}`, '/dashboard'],
          ]}
        />
        <RouteVisual
          badges
          fileWidth={260}
          rows={[
            { n: 'app' },
            { n: `about.${e}`, d: 1, dot: true, url: '/about' },
            { n: 'contact', d: 1 },
            { n: `page.${e}`, d: 2, url: '/contact' },
          ]}
        />
      </Section>

      <Section id="index-files" title="Index Files">
        <P>
          <C>{`index.${e}`}</C> inside a folder maps to that folder's URL. It is the file-based
          equivalent of <C>{`page.${e}`}</C> in the same folder.
        </P>
        <RouteVisual
          badges
          fileWidth={280}
          rows={[
            { n: 'app' },
            { n: 'dashboard', d: 1 },
            { n: `index.${e}`, d: 2, dot: true, url: '/dashboard' },
            { n: 'settings', d: 2 },
            { n: `index.${e}`, d: 3, url: '/dashboard/settings' },
            { n: 'blog', d: 1 },
            { n: `index.${e}`, d: 2, url: '/blog' },
            { n: `page.${e}`, d: 1, url: '/' },
          ]}
        />
        <Callout>
          <C>{`index.${e}`}</C> and <C>{`page.${e}`}</C> produce the same URL for a folder. Pick one
          pattern and stay consistent.
        </Callout>
      </Section>

      <Section id="file-extensions" title="File Extensions">
        <P>
          Pages and routing files support <C>.tsx</C>, <C>.jsx</C>, <C>.ts</C>, and <C>.js</C>.
          Pages can also be <C>.mdx</C> or <C>.md</C>. Routing files like <C>{`layout.${e}`}</C>,{' '}
          <C>{`loading.${e}`}</C>, and <C>{`error.${e}`}</C> must use one of the four script
          extensions.
        </P>
        <Table
          headers={['Extension', 'Pages', 'Routing files']}
          rows={[
            ['.tsx', 'Yes', 'Yes'],
            ['.jsx', 'Yes', 'Yes'],
            ['.ts', 'Yes', 'Yes'],
            ['.js', 'Yes', 'Yes'],
            ['.mdx', 'Yes', 'No'],
            ['.md', 'Yes', 'No'],
          ]}
        />
        <Callout>
          Only one file can create a given URL. If <C>{`about.${e}`}</C> and <C>about.jsx</C> both
          exist, the router throws a route conflict. Delete one of them.
        </Callout>
      </Section>

      <Section id="reserved-names" title="Reserved Names">
        <P>
          These file names are special files, not routes. They configure a folder or a route but
          never become a URL on their own.
        </P>
        <Table
          headers={['File Name', 'Creates URL?', 'Reason']}
          rows={[
            [`page.${e}`, 'Yes - via folder', 'Defines the page for a folder'],
            [`layout.${e}`, 'No', 'Shared layout for a folder'],
            [`loading.${e}`, 'No', 'Loading UI'],
            [`error.${e}`, 'No', 'Error UI'],
            [`not-found.${e}`, 'No', '404 UI'],
            [`template.${e}`, 'No', 'Template wrapper'],
            [`default.${e}`, 'No', 'Parallel route fallback'],
            [`global-error.${e}`, 'No', 'Global error fallback'],
          ]}
        />
      </Section>

      <Section id="complete-example" title="Complete Example">
        <P>
          A project using file-based routes alongside a folder-based route and a special file.
        </P>
        <RouteVisual
          badges
          fileWidth={280}
          rows={[
            { n: 'app' },
            { n: `page.${e}`, d: 1, dot: true, url: '/' },
            { n: `about.${e}`, d: 1, url: '/about' },
            { n: `contact.${e}`, d: 1, url: '/contact' },
            { n: `pricing.${e}`, d: 1, url: '/pricing' },
            { n: 'dashboard', d: 1 },
            { n: `index.${e}`, d: 2, url: '/dashboard' },
            { n: `settings.${e}`, d: 2, url: '/dashboard/settings' },
            { n: `layout.${e}`, d: 1, url: '-', ok: false },
          ]}
        />
        <Table
          headers={['File Path', 'URL', 'Creates URL?']}
          rows={[
            [`src/app/page.${e}`, '/', 'Yes'],
            [`src/app/about.${e}`, '/about', 'Yes - flat file'],
            [`src/app/contact.${e}`, '/contact', 'Yes - flat file'],
            [`src/app/dashboard/index.${e}`, '/dashboard', 'Yes - index file'],
            [`src/app/dashboard/settings.${e}`, '/dashboard/settings', 'Yes - nested flat file'],
            [`src/app/layout.${e}`, '-', 'No - reserved name'],
          ]}
        />
      </Section>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link to="/docs/folder-based-routing" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Folder-Based Routing</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Define routes with folders and page files inside them.</p>
        </Link>
        <Link to="/docs/dynamic-routes" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Dynamic Routes</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Match URL segments with dynamic parameters and catch-alls.</p>
        </Link>
        <Link to="/docs/mdx-markdown" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">MDX & Markdown Pages</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Write routes as .mdx or .md files.</p>
        </Link>
        <Link to="/docs/linking-and-navigating" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Linking and Navigating</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Navigate between routes with Link, useNavigate, and prefetching.</p>
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

export default function FileBasedRoutingPage() {
  return (
    <DocPage
      title="File-Based Routing"
      description="Flat files in src/app directly create URL routes without needing a folder."
      url="https://bini.js.org/docs/file-based-routing"
      editUrl="https://github.com/Binidu01/bini-official/edit/main/src/app/docs/file-based-routing.tsx"
      toc={TOC_ITEMS}
      prev={{ to: '/docs/folder-based-routing', title: 'Folder-Based Routing' }}
      next={{ to: '/docs/dynamic-routes', title: 'Dynamic Routes' }}
    >
      <Content />
    </DocPage>
  )
}