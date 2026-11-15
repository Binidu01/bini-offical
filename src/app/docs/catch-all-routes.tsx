// src/app/docs/catch-all-routes.tsx
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
  { id: 'basic-usage', label: 'Basic Usage' },
  { id: 'accessing-parameters', label: 'Accessing Parameters' },
  { id: 'nested-catch-all', label: 'Nested Catch-All Routes' },
  { id: 'optional-catch-all', label: 'Optional Catch-All Routes' },
  { id: 'file-based-catch-all', label: 'File-Based Catch-All Routes' },
  { id: 'route-priority', label: 'Route Priority' },
  { id: 'use-cases', label: 'Use Cases' },
  { id: 'complete-example', label: 'Complete Example' },
]

function Content() {
  const lang = useDocLang()
  const e = lang === 'js' ? 'jsx' : 'tsx'

  return (
    <>
      <Section id="overview" title="Overview">
        <P>
          A catch-all route matches multiple URL segments in one route using <C>[...name]</C>.
          The optional version <C>[[...name]]</C> also matches the parent path. Both create a
          URL for any depth.
        </P>
        <RouteVisual
          fileWidth={260}
          rows={[
            { n: 'app' },
            { n: 'docs', d: 1 },
            { n: '[...slug]', d: 2 },
            { n: `page.${e}`, d: 3, dot: true, url: '/docs/*' },
          ]}
        />
        <Table
          headers={['Pattern', 'Example URL', 'Matches']}
          rows={[
            ['[...slug]', '/docs/api/reference', 'One or more segments'],
            ['[[...slug]]', '/docs and /docs/api', 'Zero or more segments'],
          ]}
        />
        <Callout>
          For page routes, catch-all values are exposed under <C>params['*']</C>, not the name
          written in the folder. This is a React Router convention that Bini.js follows.
        </Callout>
      </Section>

      <Section id="basic-usage" title="Basic Usage">
        <P>
          Create a catch-all by naming a folder or file <C>[...name]</C>. It matches any depth
          after the parent path, but requires at least one segment.
        </P>
        <RouteVisual
          fileWidth={280}
          rows={[
            { n: 'app' },
            { n: 'blog', d: 1 },
            { n: '[...slug]', d: 2 },
            { n: `page.${e}`, d: 3, dot: true, url: '/blog/*' },
            { n: 'products', d: 1 },
            { n: '[...path]', d: 2 },
            { n: `page.${e}`, d: 3, dot: true, url: '/products/*' },
          ]}
        />
        <P>
          <C>/blog/getting-started</C> matches <C>[...slug]</C> with one segment, and{' '}
          <C>/blog/guides/routing/basics</C> matches with three. The param name (
          <C>slug</C>, <C>path</C>) is what you read from <C>params['*']</C>.
        </P>
      </Section>

      <Section id="accessing-parameters" title="Accessing Parameters">
        <P>
          Read the catch-all with <C>useParams()</C>. For page routes, the value is under the{' '}
          <C>'*'</C> key. It is a string of the matched segments, joined by <C>/</C>.
        </P>
        <CodeBlock
          filename={`src/app/docs/[...slug]/page.${e}`}
          tsCode={`export default function DocsPage() {
  const params = useParams()
  // For a page route, the catch-all is under params['*']
  const path = params['*'] ?? ''

  return (
    <div>
      <h1>Documentation</h1>
      <p>Path: {path}</p>
    </div>
  )
}`}
          jsCode={`export default function DocsPage() {
  const params = useParams()
  // For a page route, the catch-all is under params['*']
  const path = params['*'] ?? ''

  return (
    <div>
      <h1>Documentation</h1>
      <p>Path: {path}</p>
    </div>
  )
}`}
        />
        <Table
          headers={['URL', "params['*']"]}
          rows={[
            ['/docs/getting-started', "'getting-started'"],
            ['/docs/api/reference', "'api/reference'"],
            ['/docs/guides/routing/basics', "'guides/routing/basics'"],
          ]}
        />
        <Callout>
          The catch-all is a <em>string</em> under <C>'*'</C>, not an array. Split on{' '}
          <C>/</C> if you need individual segments: <C>params['*']?.split('/')</C>.
        </Callout>
      </Section>

      <Section id="nested-catch-all" title="Nested Catch-All Routes">
        <P>
          Combine a catch-all with static and dynamic segments. Each combination creates its own
          URL.
        </P>
        <RouteVisual
          fileWidth={300}
          rows={[
            { n: 'app' },
            { n: 'products', d: 1 },
            { n: '[category]', d: 2 },
            { n: '[...slug]', d: 3 },
            { n: `page.${e}`, d: 4, dot: true, url: '/products/:cat/*' },
            { n: 'blog', d: 1 },
            { n: 'featured', d: 2 },
            { n: `page.${e}`, d: 3, url: '/blog/featured' },
            { n: '[...slug]', d: 2 },
            { n: `page.${e}`, d: 3, dot: true, url: '/blog/*' },
          ]}
        />
        <CodeBlock
          filename={`src/app/products/[category]/[...slug]/page.${e}`}
          tsCode={`export default function ProductPage() {
  const { category } = useParams<{ category: string }>()
  const path = useParams()['*'] ?? ''

  return (
    <div>
      <h1>Category: {category}</h1>
      <p>Path: {path}</p>
    </div>
  )
}`}
          jsCode={`export default function ProductPage() {
  const { category } = useParams()
  const path = useParams()['*'] ?? ''

  return (
    <div>
      <h1>Category: {category}</h1>
      <p>Path: {path}</p>
    </div>
  )
}`}
        />
      </Section>

      <Section id="optional-catch-all" title="Optional Catch-All Routes">
        <P>
          <C>[[...name]]</C> makes the catch-all optional. It matches the parent path (zero
          segments) and any nested path (one or more segments).
        </P>
        <RouteVisual
          fileWidth={280}
          rows={[
            { n: 'app' },
            { n: 'shop', d: 1 },
            { n: '[[...slug]]', d: 2 },
            { n: `page.${e}`, d: 3, dot: true, url: '/shop, /shop/*' },
          ]}
        />
        <CodeBlock
          filename={`src/app/shop/[[...slug]]/page.${e}`}
          tsCode={`export default function ShopPage() {
  const path = useParams()['*'] ?? ''

  if (!path) {
    return <h1>Shop Home</h1>
  }

  return (
    <div>
      <h1>Category: {path}</h1>
    </div>
  )
}`}
          jsCode={`export default function ShopPage() {
  const path = useParams()['*'] ?? ''

  if (!path) {
    return <h1>Shop Home</h1>
  }

  return (
    <div>
      <h1>Category: {path}</h1>
    </div>
  )
}`}
        />
        <Table
          headers={['URL', "params['*']", 'Note']}
          rows={[
            ['/shop', "'' (empty)", 'Parent path also matches'],
            ['/shop/clothing', "'clothing'", ''],
            ['/shop/clothing/shirts', "'clothing/shirts'", ''],
          ]}
        />
      </Section>

      <Section id="file-based-catch-all" title="File-Based Catch-All Routes">
        <P>
          A catch-all can be a flat file instead of a folder. It creates the same URL with less
          nesting.
        </P>
        <RouteVisual
          fileWidth={280}
          rows={[
            { n: 'app' },
            { n: 'docs', d: 1 },
            { n: `[...slug].${e}`, d: 2, dot: true, url: '/docs/*' },
            { n: 'blog', d: 1 },
            { n: `[...slug].${e}`, d: 2, dot: true, url: '/blog/*' },
          ]}
        />
        <CodeBlock
          filename={`src/app/blog/[...slug].${e}`}
          tsCode={`export default function BlogArchive() {
  const path = useParams()['*'] ?? ''
  return <h1>Archive: {path}</h1>
}`}
          jsCode={`export default function BlogArchive() {
  const path = useParams()['*'] ?? ''
  return <h1>Archive: {path}</h1>
}`}
        />
      </Section>

      <Section id="route-priority" title="Route Priority">
        <P>
          When multiple routes could match a URL, the more specific one wins: static routes
          first, then dynamic, then catch-alls.
        </P>
        <RouteVisual
          fileWidth={280}
          rows={[
            { n: 'app' },
            { n: 'blog', d: 1 },
            { n: 'featured', d: 2 },
            { n: `page.${e}`, d: 3, url: '/blog/featured' },
            { n: '[slug]', d: 2 },
            { n: `page.${e}`, d: 3, url: '/blog/:slug' },
            { n: '[...slug]', d: 2 },
            { n: `page.${e}`, d: 3, dot: true, url: '/blog/*' },
          ]}
        />
        <Table
          headers={['URL', 'Matched route']}
          rows={[
            ['/blog/featured', `Static - featured/page.${e}`],
            ['/blog/hello-world', `Dynamic - [slug]/page.${e}`],
            ['/blog/2024/01/hello-world', `Catch-all - [...slug]/page.${e}`],
          ]}
        />
      </Section>

      <Section id="use-cases" title="Use Cases">
        <P>
          Catch-all routes fit any multi-segment structure where the number of segments varies.
        </P>
        <Table
          headers={['Use case', 'Example URL', 'Route']}
          rows={[
            ['Documentation', '/docs/guides/routing/basics', '[...slug]'],
            ['E-commerce categories', '/products/electronics/phones/iphone', '[category]/[...slug]'],
            ['Blog archives', '/blog/2024/01/hello-world', '[...slug]'],
            ['Multi-language sites', '/en/docs/getting-started', '[locale]/[...slug]'],
            ['File browser', '/files/docs/guides', '[...path]'],
            ['API versioning', '/api/v1/users/123', 'v1/[...path]'],
          ]}
        />
      </Section>

      <Section id="complete-example" title="Complete Example">
        <P>
          A project combining static, dynamic, and catch-all routes at every level.
        </P>
        <RouteVisual
          fileWidth={300}
          rows={[
            { n: 'app' },
            { n: 'blog', d: 1 },
            { n: 'featured', d: 2 },
            { n: `page.${e}`, d: 3, url: '/blog/featured' },
            { n: '[slug]', d: 2 },
            { n: `page.${e}`, d: 3, url: '/blog/:slug' },
            { n: '[...slug]', d: 2 },
            { n: `page.${e}`, d: 3, dot: true, url: '/blog/*' },
            { n: 'docs', d: 1 },
            { n: '[[...slug]]', d: 2 },
            { n: `page.${e}`, d: 3, dot: true, url: '/docs, /docs/*' },
            { n: 'products', d: 1 },
            { n: '[category]', d: 2 },
            { n: '[...slug]', d: 3 },
            { n: `page.${e}`, d: 4, dot: true, url: '/products/:cat/*' },
          ]}
        />
        <Table
          headers={['URL', 'Matched route']}
          rows={[
            ['/blog/featured', 'Static'],
            ['/blog/hello-world', 'Dynamic [slug]'],
            ['/blog/2024/01/hello-world', 'Catch-all [...slug]'],
            ['/docs', 'Optional catch-all [[...slug]] (empty)'],
            ['/docs/guides/routing', 'Optional catch-all [[...slug]]'],
            ['/products/electronics/phones/iphone', 'Nested dynamic + catch-all'],
          ]}
        />
      </Section>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link to="/docs/dynamic-routes" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Dynamic Routes</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Match URL segments with dynamic parameters and catch-alls.</p>
        </Link>
        <Link to="/docs/intercepting-routes" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Intercepting Routes</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Render alternative content when navigating from within the app.</p>
        </Link>
        <Link to="/docs/parallel-routes" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Parallel Routes</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Render multiple routes in the same layout with named slots.</p>
        </Link>
        <Link to="/docs/folder-based-routing" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Folder-Based Routing</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Define routes with folders and page files inside them.</p>
        </Link>
        <Link to="/docs/mdx-markdown" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">MDX & Markdown Pages</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Write routes as .mdx or .md files.</p>
        </Link>
        <Link to="/docs/static-export" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Static Export</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">How every route is pre-rendered to HTML at build time.</p>
        </Link>
      </div>
    </>
  )
}

export default function CatchAllRoutesPage() {
  return (
    <DocPage
      title="Catch-All Routes"
      description="Match multiple URL segments with [...name] and optional [[...name]]."
      url="https://bini.js.org/docs/catch-all-routes"
      editUrl="https://github.com/Binidu01/bini-official/edit/main/src/app/docs/catch-all-routes.tsx"
      toc={TOC_ITEMS}
      prev={{ to: '/docs/intercepting-routes', title: 'Intercepting Routes' }}
      next={{ to: '/docs/mdx-markdown', title: 'MDX & Markdown' }}
    >
      <Content />
    </DocPage>
  )
}