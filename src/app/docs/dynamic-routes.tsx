// src/app/docs/dynamic-routes.tsx
import { Link } from 'react-router-dom'

import {
  C,
  Callout,
  CodeBlock,
  DocPage,
  H3,
  P,
  Section,
  Table,
  useDocLang,
  useDocPm,
} from '../../components/DocBlocks'
import { RouteVisual } from '../../components/DocVisuals'
import type { TocItem } from '../../components/TableOfContents'

const TOC_ITEMS: TocItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'dynamic-segments', label: 'Dynamic Segments' },
  { id: 'multiple-parameters', label: 'Multiple Parameters' },
  { id: 'dynamic-layouts', label: 'Dynamic Segments in Layouts' },
  { id: 'flat-file-dynamic', label: 'Flat File Dynamic Routes' },
  { id: 'route-priority', label: 'Route Priority' },
  { id: 'static-generation', label: 'Static Generation' },
  { id: 'complete-example', label: 'Complete Example' },
]

const PMS = ['npm', 'pnpm', 'yarn', 'bun'] as const
type Pm = (typeof PMS)[number]

const run = (pm: Pm, script: string, bunRun = true) =>
  pm === 'npm'
    ? `npm run ${script}`
    : pm === 'bun' && bunRun
      ? `bun run ${script}`
      : `${pm} ${script}`

function Content() {
  const lang = useDocLang()
  const pm = useDocPm()
  const e = lang === 'js' ? 'jsx' : 'tsx'

  return (
    <>
      <Section id="overview" title="Overview">
        <P>
          A dynamic segment matches any value for a URL part. Wrap a folder or file name in
          square brackets, like <C>[slug]</C>, to create one. Read the value with{' '}
          <C>useParams()</C>, which is auto-imported.
        </P>
        <Table
          headers={['Pattern', 'Example URL', 'Matches']}
          rows={[
            ['[slug]', '/blog/hello-world', 'slug = "hello-world"'],
            ['[id]', '/users/123', 'id = "123"'],
            ['[category]/[slug]', '/blog/tech/hello-world', 'category = "tech", slug = "hello-world"'],
          ]}
        />
      </Section>

      <Section id="dynamic-segments" title="Dynamic Segments">
        <P>
          Wrap a folder or file name in brackets to make a dynamic segment. The same pattern works
          for any folder in the tree.
        </P>
        <RouteVisual
          badges
          fileWidth={280}
          rows={[
            { n: 'app' },
            { n: 'blog', d: 1 },
            { n: '[slug]', d: 2 },
            { n: `page.${e}`, d: 3, dot: true, url: '/blog/:slug' },
            { n: 'users', d: 1 },
            { n: '[id]', d: 2 },
            { n: `page.${e}`, d: 3, url: '/users/:id' },
          ]}
        />
        <CodeBlock
          filename={`src/app/blog/[slug]/page.${e}`}
          tsCode={`export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()

  return <h1>Post: {slug}</h1>
}`}
          jsCode={`export default function BlogPost() {
  const { slug } = useParams()

  return <h1>Post: {slug}</h1>
}`}
        />
      </Section>

      <Section id="multiple-parameters" title="Multiple Parameters">
        <P>
          You can nest dynamic folders. Each one becomes a property on the object returned by{' '}
          <C>useParams()</C>.
        </P>
        <RouteVisual
          badges
          fileWidth={280}
          rows={[
            { n: 'app' },
            { n: 'blog', d: 1 },
            { n: '[category]', d: 2 },
            { n: '[slug]', d: 3 },
            { n: `page.${e}`, d: 4, dot: true, url: '/blog/:category/:slug' },
          ]}
        />
        <CodeBlock
          filename={`src/app/blog/[category]/[slug]/page.${e}`}
          tsCode={`export default function BlogPost() {
  const { category, slug } = useParams<{
    category: string
    slug: string
  }>()

  return (
    <div>
      <p>Category: {category}</p>
      <h1>Post: {slug}</h1>
    </div>
  )
}`}
          jsCode={`export default function BlogPost() {
  const { category, slug } = useParams()

  return (
    <div>
      <p>Category: {category}</p>
      <h1>Post: {slug}</h1>
    </div>
  )
}`}
        />
      </Section>

      <Section id="dynamic-layouts" title="Dynamic Segments in Layouts">
        <P>
          Layouts can read dynamic params too, using <C>useParams()</C>. The layout itself does not
          create a URL.
        </P>
        <RouteVisual
          badges
          fileWidth={280}
          rows={[
            { n: 'app' },
            { n: 'blog', d: 1 },
            { n: '[slug]', d: 2 },
            { n: `layout.${e}`, d: 3, url: '-', ok: false },
            { n: `page.${e}`, d: 3, dot: true, url: '/blog/:slug' },
          ]}
        />
        <CodeBlock
          filename={`src/app/blog/[slug]/layout.${e}`}
          tsCode={`import { Outlet } from 'react-router-dom'

export default function BlogLayout() {
  const { slug } = useParams<{ slug: string }>()

  return (
    <div>
      <header>
        <h2>Post: {slug}</h2>
        <Link to="/blog">Back to blog</Link>
      </header>
      <main><Outlet /></main>
    </div>
  )
}`}
          jsCode={`import { Outlet } from 'react-router-dom'

export default function BlogLayout() {
  const { slug } = useParams()

  return (
    <div>
      <header>
        <h2>Post: {slug}</h2>
        <Link to="/blog">Back to blog</Link>
      </header>
      <main><Outlet /></main>
    </div>
  )
}`}
        />
      </Section>

      <Section id="flat-file-dynamic" title="Flat File Dynamic Routes">
        <P>
          A dynamic segment can also be a flat file, without a folder. Each file creates a URL
          directly.
        </P>
        <RouteVisual
          badges
          fileWidth={260}
          rows={[
            { n: 'app' },
            { n: 'blog', d: 1 },
            { n: `[slug].${e}`, d: 2, dot: true, url: '/blog/:slug' },
            { n: 'users', d: 1 },
            { n: `[id].${e}`, d: 2, url: '/users/:id' },
          ]}
        />
        <CodeBlock
          filename={`src/app/blog/[slug].${e}`}
          tsCode={`export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  return <h1>Post: {slug}</h1>
}`}
          jsCode={`export default function BlogPost() {
  const { slug } = useParams()
  return <h1>Post: {slug}</h1>
}`}
        />
      </Section>

      <Section id="route-priority" title="Route Priority">
        <P>
          When both a static route and a dynamic route match the same URL, the static route wins.
          Dynamic routes match only when no static route does.
        </P>
        <RouteVisual
          badges
          fileWidth={260}
          rows={[
            { n: 'app' },
            { n: 'blog', d: 1 },
            { n: 'featured', d: 2 },
            { n: `page.${e}`, d: 3, dot: true, url: '/blog/featured' },
            { n: '[slug]', d: 2 },
            { n: `page.${e}`, d: 3, url: '/blog/:slug' },
          ]}
        />
        <Table
          headers={['URL', 'Matched route']}
          rows={[
            ['/blog/featured', 'Static - featured'],
            ['/blog/hello-world', 'Dynamic - [slug]'],
          ]}
        />
      </Section>

      <Section id="static-generation" title="Static Generation">
        <P>
          During <C>{run(pm, 'build')}</C>, static routes are pre-rendered to real HTML. Dynamic
          routes are handled in one of three ways.
        </P>

        <H3 className="mt-6 mb-3">1. Shell page</H3>
        <P>
          By default, a dynamic route that is not pre-rendered gets a shell page at its parent
          path. For <C>/blog/:slug</C>, that is <C>/blog/</C>. The shell relies on the client to
          render the page on visit. This is the fallback for every dynamic URL that is not
          pre-rendered.
        </P>

        <H3 className="mt-6 mb-3">2. staticParams</H3>
        <P>
          Export <C>staticParams</C> from the dynamic page to pre-render specific URLs. The
          function can be sync or async, and returns an array of objects.
        </P>
        <CodeBlock
          filename={`src/app/blog/[slug]/page.${e}`}
          tsCode={`export async function staticParams() {
  const posts = await getPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  return <h1>Post: {slug}</h1>
}`}
          jsCode={`export async function staticParams() {
  const posts = await getPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export default function BlogPost() {
  const { slug } = useParams()
  return <h1>Post: {slug}</h1>
}`}
        />
        <P>
          The returned objects are substituted into the route pattern. For <C>/blog/[slug]</C>,{' '}
          <C>{`{ slug: 'hello-world' }`}</C> becomes <C>/blog/hello-world</C>, which is written to{' '}
          <C>dist/blog/hello-world/index.html</C>.
        </P>

        <H3 className="mt-6 mb-3">3. Link crawling</H3>
        <P>
          Every page that is pre-rendered has its HTML scanned for internal <C>{'<a href>'}</C>{' '}
          links. Each new internal link is followed and rendered, with no depth limit. So if a
          rendered page links to <C>/blog/hello-world</C>, that URL is pre-rendered automatically
          without any configuration.
        </P>
        <Callout>
          Use <C>staticParams</C> for URLs that nothing links to: a sitemap, an admin dashboard, or
          a dynamic route with data exports (which is client-only by default). For everything else,
          link crawling covers it.
        </Callout>
      </Section>

      <Section id="complete-example" title="Complete Example">
        <P>
          A project mixing static routes, dynamic routes, and a dynamic layout.
        </P>
        <RouteVisual
          badges
          fileWidth={300}
          rows={[
            { n: 'app' },
            { n: 'blog', d: 1 },
            { n: 'featured', d: 2 },
            { n: `page.${e}`, d: 3, url: '/blog/featured' },
            { n: '[slug]', d: 2 },
            { n: `layout.${e}`, d: 3, url: '-', ok: false },
            { n: `page.${e}`, d: 3, dot: true, url: '/blog/:slug' },
            { n: 'users', d: 1 },
            { n: '[id]', d: 2 },
            { n: `page.${e}`, d: 3, url: '/users/:id' },
            { n: 'settings', d: 3 },
            { n: `page.${e}`, d: 4, url: '/users/:id/settings' },
          ]}
        />
        <Table
          headers={['URL', 'Matched route']}
          rows={[
            ['/blog/featured', 'Static - featured'],
            ['/blog/hello-world', 'Dynamic - [slug]'],
            ['/users/123', 'Dynamic - [id]'],
            ['/users/123/settings', 'Nested dynamic - [id]/settings'],
          ]}
        />
      </Section>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link to="/docs/folder-based-routing" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Folder-Based Routing</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Define routes with folders and page files inside them.</p>
        </Link>
        <Link to="/docs/file-based-routing" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">File-Based Routing</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Define routes with flat files instead of folders.</p>
        </Link>
        <Link to="/docs/catch-all-routes" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Catch-All Routes</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Match any number of trailing URL segments.</p>
        </Link>
        <Link to="/docs/static-export" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Static Export</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">How every route is pre-rendered to HTML at build time.</p>
        </Link>
        <Link to="/docs/linking-and-navigating" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Linking and Navigating</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Navigate between routes with Link, useNavigate, and prefetching.</p>
        </Link>
        <Link to="/docs/layouts-and-pages" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Layouts and Pages</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Create your first pages and wrap them in shared layouts.</p>
        </Link>
      </div>
    </>
  )
}

export default function DynamicRoutesPage() {
  return (
    <DocPage
      title="Dynamic Routes"
      description="Dynamic segments [param] for parameterized URLs like /blog/:slug and /users/:id."
      url="https://bini.js.org/docs/dynamic-routes"
      editUrl="https://github.com/Binidu01/bini-official/edit/main/src/app/docs/dynamic-routes.tsx"
      toc={TOC_ITEMS}
      prev={{ to: '/docs/file-based-routing', title: 'File-Based Routing' }}
      next={{ to: '/docs/parallel-routes', title: 'Parallel Routes' }}
    >
      <Content />
    </DocPage>
  )
}