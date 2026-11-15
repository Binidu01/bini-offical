// src/app/docs/notfound.tsx
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
  { id: 'global-404', label: 'Global 404 Page' },
  { id: 'nested-404', label: 'Nested 404 Pages' },
  { id: 'programmatic-404', label: 'Programmatic 404' },
  { id: '404-with-layout', label: '404 with Layout' },
  { id: 'styling-404', label: 'Styling 404 Pages' },
  { id: 'complete-example', label: 'Complete Example' },
]

function Content() {
  const lang = useDocLang()
  const e = lang === 'js' ? 'jsx' : 'tsx'

  return (
    <>
      <Section id="overview" title="Overview">
        <P>
          Bini.js ships a built-in 404. Add <C>{`not-found.${e}`}</C> in any folder for custom UI
          when no route matches. It is a special file - it does not create a URL. Nearest-wins
          applies.
        </P>
        <Table
          headers={['File', 'Purpose']}
          rows={[
            [`src/app/page.${e}`, 'Home page'],
            [`src/app/not-found.${e}`, 'Global 404 fallback'],
            [`src/app/blog/not-found.${e}`, 'Blog-specific 404'],
          ]}
        />
      </Section>

      <Section id="global-404" title="Global 404 Page">
        <P>
          Create <C>{`not-found.${e}`}</C> at the root of <C>app/</C> to handle all unmatched
          routes.
        </P>
        <RouteVisual
          fileWidth={260}
          rows={[
            { n: 'app' },
            { n: `layout.${e}`, d: 1 },
            { n: `page.${e}`, d: 1, url: '/' },
            { n: `not-found.${e}`, d: 1, dot: true },
          ]}
        />
        <CodeBlock
          filename={`src/app/not-found.${e}`}
          tsCode={`import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mb-6">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link to="/">Return Home</Link>
    </div>
  )
}`}
          jsCode={`import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mb-6">The page you're looking for doesn't exist.</p>
      <Link to="/">Return Home</Link>
    </div>
  )
}`}
        />
        <Callout>
          Shown for unmatched paths like <C>/non-existent</C> or <C>/blog/invalid-post</C> when no
          closer <C>not-found</C> exists.
        </Callout>
      </Section>

      <Section id="nested-404" title="Nested 404 Pages">
        <P>
          Place <C>{`not-found.${e}`}</C> in subdirectories for segment-specific 404 UI. The closest
          file to the unmatched path wins.
        </P>
        <RouteVisual
          fileWidth={280}
          rows={[
            { n: 'app' },
            { n: `not-found.${e}`, d: 1, dot: true },
            { n: 'blog', d: 1 },
            { n: `not-found.${e}`, d: 2, dot: true },
            { n: `page.${e}`, d: 2, url: '/blog' },
            { n: '[slug]', d: 2 },
            { n: `page.${e}`, d: 3, url: '/blog/:slug' },
            { n: 'admin', d: 1 },
            { n: `not-found.${e}`, d: 2, dot: true },
            { n: `page.${e}`, d: 2, url: '/admin' },
          ]}
        />
        <CodeBlock
          filename={`src/app/blog/not-found.${e}`}
          tsCode={`import { Link } from 'react-router-dom'

export default function BlogNotFound() {
  return (
    <div className="py-12 text-center">
      <h1 className="text-3xl font-bold">Post Not Found</h1>
      <p className="mb-6">The blog post you&apos;re looking for doesn&apos;t exist.</p>
      <Link to="/blog">View all posts</Link>
    </div>
  )
}`}
          jsCode={`import { Link } from 'react-router-dom'

export default function BlogNotFound() {
  return (
    <div className="py-12 text-center">
      <h1 className="text-3xl font-bold">Post Not Found</h1>
      <p className="mb-6">The blog post you're looking for doesn't exist.</p>
      <Link to="/blog">View all posts</Link>
    </div>
  )
}`}
        />
        <Table
          headers={['URL', '404 Page Used']}
          rows={[
            ['/blog/non-existent', `src/app/blog/not-found.${e}`],
            ['/admin/invalid', `src/app/admin/not-found.${e}`],
            ['/completely/wrong', `src/app/not-found.${e} (global)`],
          ]}
        />
      </Section>

      <Section id="programmatic-404" title="Programmatic 404">
        <P>
          When a route matches but data is missing, return your own not-found UI from the page
          component.
        </P>
        <CodeBlock
          filename={`src/app/blog/[slug]/page.${e}`}
          tsCode={`import { useParams, Link } from 'react-router-dom'

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const post = getPost(slug)

  if (!post) {
    return (
      <div className="py-12 text-center">
        <h1>Post Not Found</h1>
        <p>The post &quot;{slug}&quot; doesn&apos;t exist.</p>
        <Link to="/blog">View all posts</Link>
      </div>
    )
  }

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  )
}`}
          jsCode={`import { useParams, Link } from 'react-router-dom'

export default function BlogPost() {
  const { slug } = useParams()
  const post = getPost(slug)

  if (!post) {
    return (
      <div className="py-12 text-center">
        <h1>Post Not Found</h1>
        <p>The post "{slug}" doesn't exist.</p>
        <Link to="/blog">View all posts</Link>
      </div>
    )
  }

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  )
}`}
        />
      </Section>

      <Section id="404-with-layout" title="404 with Layout">
        <P>
          <C>{`not-found.${e}`}</C> is rendered inside the layout chain of the segment it belongs
          to. Headers and sidebars stay visible.
        </P>
        <RouteVisual
          fileWidth={280}
          rows={[
            { n: 'app' },
            { n: `layout.${e}`, d: 1 },
            { n: `not-found.${e}`, d: 1, dot: true },
            { n: 'blog', d: 1 },
            { n: `layout.${e}`, d: 2 },
            { n: `not-found.${e}`, d: 2, dot: true },
            { n: `page.${e}`, d: 2, url: '/blog' },
          ]}
        />
        <CodeBlock
          filename={`src/app/blog/layout.${e}`}
          tsCode={`import { Outlet } from 'react-router-dom'

export default function BlogLayout() {
  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold">Blog</h1>
      </header>
      <main><Outlet /></main>
    </div>
  )
}`}
          jsCode={`import { Outlet } from 'react-router-dom'

export default function BlogLayout() {
  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold">Blog</h1>
      </header>
      <main><Outlet /></main>
    </div>
  )
}`}
        />
        <Callout>
          <C>blog/not-found</C> still shows the Blog header from <C>blog/layout</C>.
        </Callout>
      </Section>

      <Section id="styling-404" title="Styling 404 Pages">
        <P>Build any UI you want - copy, links, and actions are all client-side.</P>
        <CodeBlock
          filename={`src/app/not-found.${e}`}
          tsCode={`import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-9xl font-bold">404</h1>
      <h2 className="mb-3 text-3xl font-bold">Page Not Found</h2>
      <p className="mb-8 max-w-md text-neutral-500">
        The page you&apos;re looking for might have been removed or doesn&apos;t exist.
      </p>
      <div className="flex gap-4">
        <Link
          to="/"
          className="rounded-lg bg-black px-6 py-3 text-white dark:bg-white dark:text-black"
        >
          Go Home
        </Link>
        <button
          onClick={() => window.history.back()}
          className="rounded-lg border px-6 py-3"
        >
          Go Back
        </button>
      </div>
    </div>
  )
}`}
          jsCode={`import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-9xl font-bold">404</h1>
      <h2 className="mb-3 text-3xl font-bold">Page Not Found</h2>
      <p className="mb-8 max-w-md text-neutral-500">
        The page you're looking for might have been removed or doesn't exist.
      </p>
      <div className="flex gap-4">
        <Link
          to="/"
          className="rounded-lg bg-black px-6 py-3 text-white dark:bg-white dark:text-black"
        >
          Go Home
        </Link>
        <button
          onClick={() => window.history.back()}
          className="rounded-lg border px-6 py-3"
        >
          Go Back
        </button>
      </div>
    </div>
  )
}`}
        />
      </Section>

      <Section id="complete-example" title="Complete Example">
        <RouteVisual
          fileWidth={280}
          rows={[
            { n: 'app' },
            { n: `layout.${e}`, d: 1 },
            { n: `page.${e}`, d: 1, url: '/' },
            { n: `not-found.${e}`, d: 1, dot: true },
            { n: 'blog', d: 1 },
            { n: `layout.${e}`, d: 2 },
            { n: `not-found.${e}`, d: 2, dot: true },
            { n: `page.${e}`, d: 2, url: '/blog' },
            { n: '[slug]', d: 2 },
            { n: `page.${e}`, d: 3, url: '/blog/:slug' },
            { n: 'dashboard', d: 1 },
            { n: `layout.${e}`, d: 2 },
            { n: `not-found.${e}`, d: 2, dot: true },
            { n: `page.${e}`, d: 2, url: '/dashboard' },
            { n: 'settings', d: 2 },
            { n: `page.${e}`, d: 3, url: '/dashboard/settings' },
          ]}
        />
        <Table
          headers={['File', 'Purpose']}
          rows={[
            [`src/app/page.${e}`, 'Home page'],
            [`src/app/not-found.${e}`, 'Global 404'],
            [`src/app/blog/not-found.${e}`, 'Blog 404'],
            [`src/app/dashboard/not-found.${e}`, 'Dashboard 404'],
          ]}
        />
      </Section>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link to="/docs/defaults" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Default</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Fallback for a parallel route slot with no match.</p>
        </Link>
        <Link to="/docs/metadata" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Metadata & SEO</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Control titles, descriptions, and social previews per route.</p>
        </Link>
        <Link to="/docs/error-boundaries" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Error Boundaries</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Catch render errors and show a fallback UI.</p>
        </Link>
        <Link to="/docs/templates" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Template</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Wrap each page individually inside the layout chain.</p>
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

export default function NotFoundPage() {
  return (
    <DocPage
      title="Not Found (404)"
      description="Custom 404 UI with not-found.tsx - special file, no URL, nearest-wins."
      url="https://bini.js.org/docs/notfound"
      editUrl="https://github.com/Binidu01/bini-official/edit/main/src/app/docs/notfound.tsx"
      toc={TOC_ITEMS}
      prev={{ to: '/docs/defaults', title: 'Default' }}
      next={{ to: '/docs/loaders', title: 'Loaders' }}
    >
      <Content />
    </DocPage>
  )
}