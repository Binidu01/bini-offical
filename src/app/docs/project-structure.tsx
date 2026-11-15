// src/app/docs/project-structure.tsx
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

import {
  C,
  Callout,
  DocPage,
  H3,
  P,
  Section,
  Table,
  useDocLang,
  useDocPm,
} from '../../components/DocBlocks'
import { FolderVisual, HierarchyVisual, RouteVisual } from '../../components/DocVisuals'
import type { TocItem } from '../../components/TableOfContents'

const TOC_ITEMS: TocItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'default-layout', label: 'Default project layout' },
  { id: 'top-level-files', label: 'Top-level files' },
  { id: 'routing-files', label: 'Routing files' },
  { id: 'routes', label: 'Folders and files become routes' },
  { id: 'colocation', label: 'Colocation and private folders' },
  { id: 'route-groups', label: 'Route groups' },
]

const PMS = ['npm', 'pnpm', 'yarn', 'bun'] as const
type Pm = (typeof PMS)[number]

const CREATE: Record<Pm, string> = {
  npm: 'npx create-bini-app@latest',
  pnpm: 'pnpm create bini-app@latest',
  yarn: 'yarn create bini-app@latest',
  bun: 'bun create bini-app@latest',
}

const FileLink = ({ to, children }: { to: string; children: ReactNode }) => (
  <Link to={to} className="hover:text-cyan-600 dark:hover:text-cyan-400">
    {children}
  </Link>
)

function Content() {
  const lang = useDocLang()
  const pm = useDocPm()
  const e = lang === 'js' ? 'jsx' : 'tsx'
  const s = lang === 'js' ? 'js' : 'ts'

  return (
    <>
      <Section id="overview" title="Overview">
        <P>
          Bini.js uses a file-system router. Everything the router reads lives in{' '}
          <C>src/app</C>: add a file there and you get a page, add a file to <C>src/app/api</C>{' '}
          and you get an endpoint. There is no router configuration to write.
        </P>
        <P>
          A project has three kinds of files: routing files that turn into URLs, top-level files
          that configure tooling, and everything else - components, helpers, and data - which you
          organize however you like.
        </P>
      </Section>

      <Section id="default-layout" title="Default project layout">
        <P>
          This is the <C>src</C> folder created by <C>{CREATE[pm]}</C>.
        </P>
        <FolderVisual
          rows={[
            { n: 'src' },
            { n: 'app', d: 1 },
            { n: 'api', d: 2 },
            { n: `hello.${s}`, d: 3, fn: true },
            { n: `layout.${e}`, d: 2 },
            { n: `page.${e}`, d: 2 },
            { n: 'globals.css', d: 2 },
            { n: `main.${e}`, d: 1 },
          ]}
        />
        <Table
          top
          headers={['Path', 'What it does']}
          rows={[
            ['src/app', 'Your routes and layouts. The router scans this folder.'],
            ['src/app/api', 'API handlers. hello.' + s + ' is served at /api/hello.'],
            [`src/app/layout.${e}`, 'Root layout. Wraps every page and holds global metadata.'],
            [`src/app/page.${e}`, 'The home page, served at /.'],
            ['src/app/globals.css', 'Global styles imported by the root layout.'],
            [
              `src/main.${e}`,
              'App entry point. Mounts the app in the browser and handles hydration.',
            ],
            [
              'public',
              'Static assets served from the site root, such as favicon.ico and site.webmanifest.',
            ],
          ]}
        />
      </Section>

      <Section id="top-level-files" title="Top-level files">
        <P>
          Files in the project root configure tooling. None of them affect routing.
        </P>
        <Table
          top
          headers={['File', 'Purpose']}
          rows={[
            [
              `vite.config.${s}`,
              'Vite configuration. Registers the router, environment plugin, and other tooling.',
            ],
            ['package.json', 'Dependencies and scripts such as dev, build, and deploy.'],
            [
              '.env',
              'Environment variables. BINI_* is exposed to the browser, everything else stays on the server.',
            ],
            ['.oxlintrc.json', 'Oxlint configuration.'],
            ['.oxfmtrc.json', 'Oxfmt configuration.'],
          ]}
        />
      </Section>

      <Section id="routing-files" title="Routing files">
        <P>
          Some file names have a fixed job inside <C>src/app</C>. A routing file applies to its
          own folder and every folder below it. A file in a subfolder overrides the same file from
          a parent, and if none exists Bini.js falls back to a built-in default.
        </P>
        <HierarchyVisual ext={e} />
        <P>
          These files wrap a page in a fixed order. The layout is outermost. Inside it, an error
          boundary catches errors and shows <C>error.{e}</C>, and a Suspense boundary shows{' '}
          <C>loading.{e}</C> while the page loads. The template wraps the page itself, and the
          page is the innermost piece. <C>not-found.{e}</C> is not part of this wrapper. It
          renders when no route matches, inside the same layout chain.
        </P>
        <Table
          top
          headers={['File', 'Purpose']}
          rows={[
            [
              <FileLink key="1" to="/docs/file-based-routing">{`page.${e}`}</FileLink>,
              'The UI for a route. Can also be .mdx or .md.',
            ],
            [
              <FileLink key="2" to="/docs/layouts-and-pages">{`layout.${e}`}</FileLink>,
              'Shared UI for a folder and its children. Renders children through <Outlet />.',
            ],
            [
              <FileLink key="3" to="/docs/templates">{`template.${e}`}</FileLink>,
              'Like a layout, but wraps each page individually.',
            ],
            [
              <FileLink key="4" to="/docs/load">{`loading.${e}`}</FileLink>,
              'Fallback shown while a page or layout loads.',
            ],
            [
              <FileLink key="5" to="/docs/error-boundaries">{`error.${e}`}</FileLink>,
              'Fallback shown when something in the folder throws.',
            ],
            [
              <FileLink key="6" to="/docs/notfound">{`not-found.${e}`}</FileLink>,
              'UI for URLs that match no route under the folder.',
            ],
            [
              <FileLink key="7" to="/docs/defaults">{`default.${e}`}</FileLink>,
              'Fallback for a parallel route slot with no match.',
            ],
          ]}
        />
        <Callout>
          Only <C>page</C> files can be MDX or Markdown. Every other routing file must be{' '}
          {e === 'jsx' ? (
            <>
              <C>.jsx</C> or <C>.js</C>
            </>
          ) : (
            <>
              <C>.tsx</C>, <C>.jsx</C>, <C>.ts</C>, or <C>.js</C>
            </>
          )}
          .
        </Callout>
      </Section>

      <Section id="routes" title="Folders and files become routes">
        <P>
          Folders define URL segments, and nesting folders nests segments. A file becomes a route
          in two ways: a <C>page</C> file inside a folder, or a flat file placed directly in a
          folder. A file named <C>index</C> is treated the same as <C>page</C> and maps to its
          parent folder.
        </P>
        <RouteVisual
          badges
          rows={[
            { n: 'app' },
            { n: `page.${e}`, d: 1, url: '/' },
            { n: `about.${e}`, d: 1, url: '/about' },
            { n: 'blog', d: 1 },
            { n: `page.${e}`, d: 2, url: '/blog' },
            { n: `[slug].${e}`, d: 2, url: '/blog/:slug' },
            { n: 'dashboard', d: 1 },
            { n: `layout.${e}`, d: 2 },
            { n: `page.${e}`, d: 2, url: '/dashboard' },
          ]}
        />
        <P>
          A <C>page.{e}</C> in the root is the home page. A flat file such as <C>about.{e}</C>{' '}
          becomes <C>/about</C> without needing its own folder. Inside <C>blog</C>,{' '}
          <C>page.{e}</C> maps to <C>/blog</C>, and <C>[slug].{e}</C> is a dynamic route where{' '}
          <C>:slug</C> matches any value. A <C>layout.{e}</C> has no URL of its own. It wraps its
          folder's routes and everything below them.
        </P>
      </Section>

      <Section id="colocation" title="Colocation and private folders">
        <P>
          You can keep components, helpers, and data files next to the routes that use them.
          Anything starting with <C>_</C> or <C>.</C> is skipped by the router, along with
          everything inside it. Prefix a folder with an underscore, such as <C>_components</C>, to
          mark it as a private implementation detail.
        </P>
        <RouteVisual
          badges
          rows={[
            { n: 'app' },
            { n: '_components', d: 1 },
            { n: `button.${e}`, d: 2, dot: true, url: '/_components/button', ok: false },
            { n: '_lib', d: 1 },
            { n: `constants.${s}`, d: 2, dot: true, url: '/_lib/constants', ok: false },
            { n: 'dashboard', d: 1 },
            { n: `page.${e}`, d: 2, url: '/dashboard' },
            { n: `_nav.${e}`, d: 2, dot: true, url: '/dashboard/_nav', ok: false },
            { n: 'api', d: 1 },
            { n: `hello.${s}`, d: 2, fn: true, url: '/api/hello' },
            { n: `_db.${s}`, d: 2, dot: true, url: '/api/_db', ok: false },
          ]}
        />
        <P>
          Files inside a private folder, like <C>button.{e}</C> and <C>constants.{s}</C>, never
          produce a URL. The same goes for files with an underscore prefix, like{' '}
          <C>_nav.{e}</C> and <C>_db.{s}</C>. The routable files next to them, <C>page.{e}</C> and{' '}
          <C>hello.{s}</C>, keep working as normal, so a route can hold its own helpers without
          exposing them.
        </P>
      </Section>

      <Section id="route-groups" title="Route groups">
        <P>
          Wrap a folder name in parentheses, such as <C>(marketing)</C>, to organize routes without
          changing their URLs. The group name is dropped from the path, and the group can have its
          own layout, loading, and error files.
        </P>
        <RouteVisual
          badges
          rows={[
            { n: 'app' },
            { n: '(marketing)', d: 1 },
            { n: `layout.${e}`, d: 2 },
            { n: 'about', d: 2 },
            { n: `page.${e}`, d: 3, url: '/about' },
            { n: '(shop)', d: 1 },
            { n: `layout.${e}`, d: 2 },
            { n: 'cart', d: 2 },
            { n: `page.${e}`, d: 3, url: '/cart' },
          ]}
        />
        <P>
          Because the group name is dropped, the pages get plain URLs: <C>/about</C> and{' '}
          <C>/cart</C>. Each group's <C>layout.{e}</C> only wraps the routes inside that group, so
          marketing pages and shop pages can share one URL space while looking completely
          different.
        </P>
      </Section>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link to="/docs/layouts-and-pages" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Layouts and Pages</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Create your first pages and wrap them in shared layouts.</p>
        </Link>
        <Link to="/docs/folder-based-routing" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Routing</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Define routes from the filesystem with folder-based and file-based conventions.</p>
        </Link>
        <Link to="/docs/api-routes" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">API Routes</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Add backend endpoints with plain functions or a full Hono app.</p>
        </Link>
        <Link to="/docs/static-export" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Static Export</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Pre-render every route to HTML at build time, ready for any static host.</p>
        </Link>
        <Link to="/docs/deploying" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Deployment</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Deploy to Node, Vercel, Netlify, Cloudflare, or Deno, or build native apps in CI.</p>
        </Link>
        <Link to="/docs/platform-web" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Platforms</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Build for web, Windows, macOS, Linux, Android, or iOS from one codebase.</p>
        </Link>
      </div>
    </>
  )
}

export default function ProjectStructurePage() {
  return (
    <DocPage
      title="Project structure"
      description="The folders and files in a Bini.js project, and how they turn into routes."
      url="https://bini.js.org/docs/project-structure"
      editUrl="https://github.com/Binidu01/bini-official/edit/main/src/app/docs/project-structure.tsx"
      toc={TOC_ITEMS}
      prev={{ to: '/docs/installation', title: 'Installation' }}
      next={{ to: '/docs/layouts-and-pages', title: 'Layouts and Pages' }}
    >
      <Content />
    </DocPage>
  )
}