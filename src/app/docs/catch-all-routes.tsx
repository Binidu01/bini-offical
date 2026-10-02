// src/app/docs/catch-all-routes.tsx
import type { ReactNode } from 'react'

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
  { id: 'what-are-catch-all-routes', label: 'What are Catch-All Routes?' },
  { id: 'basic-usage', label: 'Basic Usage' },
  { id: 'accessing-parameters', label: 'Accessing Parameters' },
  { id: 'nested-catch-all', label: 'Nested Catch-All Routes' },
  { id: 'optional-catch-all', label: 'Optional Catch-All Routes' },
  { id: 'file-based-catch-all', label: 'File-Based Catch-All Routes' },
  { id: 'route-priority', label: 'Route Priority' },
  { id: 'use-cases', label: 'Use Cases' },
  { id: 'complete-example', label: 'Complete Example' },
]

function UseCase({ title, text, example }: { title: string; text: string; example: string }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-black">
      <div className="mb-1 text-sm font-medium text-black dark:text-white">{title}</div>
      <div className="mb-2 text-xs text-neutral-500">{text}</div>
      <C>{example}</C>
    </div>
  )
}

function Point({ label, children }: { label: string; children: ReactNode }) {
  return (
    <li>
      <strong>{label}</strong> {children}
    </li>
  )
}

/* ---------- content (reads the TS/JS choice from DocPage) ---------- */

function Content() {
  const lang = useDocLang()
  const e = lang === 'js' ? 'jsx' : 'tsx'

  const overview = (
    <RouteVisual
      fileWidth={260}
      rows={[
        { n: 'app' },
        { n: 'docs', d: 1 },
        { n: '[...slug]', d: 2 },
        { n: `page.${e}`, d: 3, dot: true, url: '/docs/*' },
      ]}
    />
  )

  return (
    <>
      <Section id="overview" title="Overview">
        <P>
          Catch-all routes match multiple URL segments in one route using <C>[...name]</C>. The
          param becomes an array. The optional version <C>[[...name]]</C> also matches the parent
          path. Each creates a URL.
        </P>
        {overview}
        <Table
          headers={['Pattern', 'Example URL', 'Creates URL?']}
          rows={[
            ['[...slug]', '/docs/api/reference', 'Yes - catch-all creates URL'],
            ['[[...slug]]', '/shop and /shop/clothing', 'Yes - optional catch-all creates URL'],
          ]}
        />
        <Callout>
          <C>useParams()</C> is auto-imported - no import needed to access catch-all params as an
          array.
        </Callout>
      </Section>

      <Section id="what-are-catch-all-routes" title="What are Catch-All Routes?">
        <P>
          Catch-all routes match any number of segments after the parent path using{' '}
          <C>[...name]</C>. The param is an array of matched segments. Lower priority than static
          and single dynamic routes.
        </P>
        <Callout>
          <ul className="list-disc space-y-2 pl-5">
            <Point label="Matches multiple segments:">any number after the parent path</Point>
            <Point label="Array parameter:">param becomes an array of segments</Point>
            <Point label="Lower priority:">
              static and <C>[slug]</C> are matched first
            </Point>
            <Point label="Optional version:">
              <C>[[...name]]</C> for optional catch-all
            </Point>
          </ul>
        </Callout>
        {overview}
        <P>
          <C>/docs/getting-started</C> matches with <C>slug = ['getting-started']</C>,{' '}
          <C>/docs/guides/routing/basics</C> with <C>slug = ['guides', 'routing', 'basics']</C>.
        </P>
      </Section>

      <Section id="basic-usage" title="Basic Usage">
        <P>
          Create a catch-all by naming a folder or file <C>[...name]</C>. Requires at least one
          segment. Creates a URL for any depth.
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
        <Callout>
          <C>[...slug]</C> requires at least one segment. Use <C>[[...slug]]</C> for an optional
          catch-all that also matches the parent.
        </Callout>
      </Section>

      <Section id="accessing-parameters" title="Accessing Parameters">
        <P>
          Use <C>useParams()</C> (auto-imported). The param is an array.
        </P>
        <CodeBlock
          filename={`app/docs/[...slug]/page.${e}`}
          tsCode={`export default function DocsPage() {
  const { slug } = useParams()
  // slug is array of URL segments

  return (
    <div>
      <h1>Documentation</h1>
      <p>Path: {slug?.join(' / ')}</p>
      <p>Depth: {slug?.length || 0}</p>
    </div>
  )
}`}
          jsCode={`export default function DocsPage() {
  const { slug } = useParams()
  // slug is array of URL segments

  return (
    <div>
      <h1>Documentation</h1>
      <p>Path: {slug?.join(' / ')}</p>
      <p>Depth: {slug?.length || 0}</p>
    </div>
  )
}`}
        />
        <Table
          headers={['URL', 'slug value', 'Creates URL?']}
          rows={[
            ['/docs/getting-started', "['getting-started']", 'Yes'],
            ['/docs/api/reference', "['api', 'reference']", 'Yes'],
            ['/docs/guides/routing/basics', "['guides', 'routing', 'basics']", 'Yes'],
            ['/docs/advanced/custom/hooks', "['advanced', 'custom', 'hooks']", 'Yes'],
          ]}
        />
        <CodeBlock
          filename={`app/blog/[...slug]/page.${e}`}
          tsCode={`export default function BlogArchive() {
  const { slug } = useParams()
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const path = slug?.join('/')
    fetchPosts(path).then(setPosts)
  }, [slug])

  return (
    <div>
      <h1>Archive: {slug?.join(' / ') || 'Home'}</h1>
      {posts.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  )
}`}
          jsCode={`export default function BlogArchive() {
  const { slug } = useParams()
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const path = slug?.join('/')
    fetchPosts(path).then(setPosts)
  }, [slug])

  return (
    <div>
      <h1>Archive: {slug?.join(' / ') || 'Home'}</h1>
      {posts.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  )
}`}
        />
      </Section>

      <Section id="nested-catch-all" title="Nested Catch-All Routes">
        <P>
          Combine catch-all with static and dynamic segments. Each combination creates a URL.
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
          filename={`app/products/[category]/[...slug]/page.${e}`}
          tsCode={`export default function ProductPage() {
  const { category, slug } = useParams()

  return (
    <div>
      <h1>Category: {category}</h1>
      <p>Path: {slug?.join(' / ')}</p>
      <p>Segments: {slug?.length || 0}</p>
    </div>
  )
}`}
          jsCode={`export default function ProductPage() {
  const { category, slug } = useParams()

  return (
    <div>
      <h1>Category: {category}</h1>
      <p>Path: {slug?.join(' / ')}</p>
      <p>Segments: {slug?.length || 0}</p>
    </div>
  )
}`}
        />
      </Section>

      <Section id="optional-catch-all" title="Optional Catch-All Routes">
        <P>
          <C>[[...name]]</C> makes the catch-all optional - it matches the parent and nested paths.
          Creates a URL for both.
        </P>
        <RouteVisual
          fileWidth={280}
          rows={[
            { n: 'app' },
            { n: 'shop', d: 1 },
            { n: '[[...slug]]', d: 2 },
            { n: `page.${e}`, d: 3, dot: true, url: '/shop, /shop/*' },
            { n: 'docs', d: 1 },
            { n: '[[...slug]]', d: 2 },
            { n: `page.${e}`, d: 3, dot: true, url: '/docs, /docs/*' },
          ]}
        />
        <CodeBlock
          filename={`app/shop/[[...slug]]/page.${e}`}
          tsCode={`export default function ShopPage() {
  const { slug } = useParams()

  if (!slug || slug.length === 0) {
    return <h1>Shop Home</h1>
  }

  return (
    <div>
      <h1>Category: {slug.join(' / ')}</h1>
      <p>Depth: {slug.length}</p>
    </div>
  )
}`}
          jsCode={`export default function ShopPage() {
  const { slug } = useParams()

  if (!slug || slug.length === 0) {
    return <h1>Shop Home</h1>
  }

  return (
    <div>
      <h1>Category: {slug.join(' / ')}</h1>
      <p>Depth: {slug.length}</p>
    </div>
  )
}`}
        />
        <Table
          headers={['URL', 'slug value', 'Creates URL?']}
          rows={[
            ['/shop', 'undefined', 'Yes - parent creates URL'],
            ['/shop/clothing', "['clothing']", 'Yes'],
            ['/shop/clothing/shirts', "['clothing', 'shirts']", 'Yes'],
            ['/docs', 'undefined', 'Yes - parent creates URL'],
            ['/docs/getting-started', "['getting-started']", 'Yes'],
          ]}
        />
        <Callout>
          Optional catch-all is ideal for docs where <C>/docs</C> shows a landing page and{' '}
          <C>/docs/getting-started</C> shows content.
        </Callout>
      </Section>

      <Section id="file-based-catch-all" title="File-Based Catch-All Routes">
        <P>
          Catch-all as flat files without folders. Creates a URL directly and reduces nesting.
        </P>
        <RouteVisual
          fileWidth={280}
          rows={[
            { n: 'app' },
            { n: 'docs', d: 1 },
            { n: `[...slug].${e}`, d: 2, dot: true, url: '/docs/*' },
            { n: 'shop', d: 1 },
            { n: `[[...slug]].${e}`, d: 2, dot: true, url: '/shop, /shop/*' },
            { n: 'blog', d: 1 },
            { n: `[...slug].${e}`, d: 2, dot: true, url: '/blog/*' },
          ]}
        />
        <CodeBlock
          filename={`app/blog/[...slug].${e}`}
          tsCode={`export default function BlogArchive() {
  const { slug } = useParams()
  return <h1>Archive: {slug?.join(' / ')}</h1>
}`}
          jsCode={`export default function BlogArchive() {
  const { slug } = useParams()
  return <h1>Archive: {slug?.join(' / ')}</h1>
}`}
        />
      </Section>

      <Section id="route-priority" title="Route Priority">
        <P>
          Catch-all has lower priority than static and single dynamic routes. All create URLs, but
          static wins.
        </P>
        <Callout>
          <ol className="list-decimal space-y-2 pl-5">
            <li>
              <strong>Static routes</strong> - <C>/blog/featured</C> - creates URL, highest
              priority
            </li>
            <li>
              <strong>Dynamic single</strong> - <C>[slug]</C> → <C>/blog/:slug</C> - creates URL
            </li>
            <li>
              <strong>Catch-all</strong> - <C>[...slug]</C> → <C>/blog/*</C> - creates URL
            </li>
            <li>
              <strong>Optional catch-all</strong> - <C>[[...slug]]</C> → <C>/docs/*</C> - creates
              URL, lowest
            </li>
          </ol>
        </Callout>
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
          headers={['URL', 'Matched Route', 'Creates URL?']}
          rows={[
            ['/blog/featured', `featured/page.${e} - static`, 'Yes'],
            ['/blog/hello-world', `[slug]/page.${e} - dynamic`, 'Yes'],
            ['/blog/2024/01/hello-world', `[...slug]/page.${e} - catch-all`, 'Yes'],
          ]}
        />
      </Section>

      <Section id="use-cases" title="Use Cases">
        <P>Catch-all routes are ideal for multi-segment structures. All create URLs.</P>
        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          <UseCase
            title="Documentation"
            text="Multi-level docs with variable depth"
            example="/docs/guides/routing/basics"
          />
          <UseCase
            title="E-commerce Categories"
            text="Nested categories"
            example="/products/electronics/phones/iphone"
          />
          <UseCase
            title="Blog Archives"
            text="Date-based archives"
            example="/blog/2024/01/hello-world"
          />
          <UseCase
            title="Multi-language Sites"
            text="Language prefixes with variable paths"
            example="/en/docs/getting-started"
          />
        </div>
        <Table
          headers={['Use Case', 'Example URL', 'Creates URL?']}
          rows={[
            ['CMS Content', '/wiki/guides/routing', 'Yes'],
            ['API Versioning', '/api/v1/users/123', 'Yes'],
            ['File Browser', '/files/docs/guides', 'Yes'],
            ['Wiki Pages', '/wiki/guides/routing/basics', 'Yes'],
          ]}
        />
      </Section>

      <Section id="complete-example" title="Complete Example">
        <P>
          Catch-all only - <C>[...param]</C> and <C>[[...param]]</C> patterns that create URLs.
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
            { n: `layout.${e}`, d: 3 },
            { n: `page.${e}`, d: 3, dot: true, url: '/docs, /docs/*' },
            { n: 'products', d: 1 },
            { n: '[category]', d: 2 },
            { n: '[...slug]', d: 3 },
            { n: `page.${e}`, d: 4, dot: true, url: '/products/:cat/*' },
            { n: 'shop', d: 1 },
            { n: '[[...slug]]', d: 2 },
            { n: `page.${e}`, d: 3, dot: true, url: '/shop, /shop/*' },
            { n: 'api', d: 1 },
            { n: 'v1', d: 2 },
            { n: `[...path].${e}`, d: 3, dot: true, url: '/api/v1/*' },
          ]}
        />
        <Table
          headers={['Pattern', 'Example URL', 'Creates URL?']}
          rows={[
            ['/blog/featured', '/blog/featured', 'Yes - static creates URL'],
            ['/blog/:slug', '/blog/hello-world', 'Yes - dynamic creates URL'],
            ['/blog/*', '/blog/2024/01/hello-world', 'Yes - catch-all creates URL'],
            ['/docs/* (optional)', '/docs', 'Yes - optional catch-all creates URL'],
            [
              '/products/:category/*',
              '/products/electronics/phones/iphone',
              'Yes - nested catch-all creates URL',
            ],
            ['/shop/* (optional)', '/shop/clothing/shirts', 'Yes - optional catch-all creates URL'],
            ['/api/v1/*', '/api/v1/users/123', 'Yes - flat file catch-all creates URL'],
          ]}
        />
      </Section>
    </>
  )
}

/* ---------- page ---------- */

export default function CatchAllRoutesPage() {
  return (
    <DocPage
      title="Catch-All Routes"
      description="Match multiple URL segments with [...name] and optional [[...name]] - params as arrays."
      url="https://bini.js.org/docs/catch-all-routes"
      editUrl="https://github.com/Binidu01/bini-official/edit/main/src/app/docs/catch-all-routes.tsx"
      toc={TOC_ITEMS}
      prev={{ to: '/docs/parallel-routes', title: 'Parallel Routes' }}
      next={{ to: '/docs/mdx-markdown', title: 'MDX & Markdown' }}
    >
      <Content />
    </DocPage>
  )
}