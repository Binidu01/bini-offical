// src/app/docs/dynamic-routes.tsx
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
  { id: 'dynamic-segments', label: 'Dynamic Segments' },
  { id: 'multiple-parameters', label: 'Multiple Parameters' },
  { id: 'dynamic-layouts', label: 'Dynamic Segments in Layouts' },
  { id: 'flat-file-dynamic', label: 'Flat File Dynamic Routes' },
  { id: 'route-priority', label: 'Route Priority' },
  { id: 'complete-example', label: 'Complete Example' },
]

/* ---------- content (reads the TS/JS choice from DocPage) ---------- */

function Content() {
  const lang = useDocLang()
  const e = lang === 'js' ? 'jsx' : 'tsx'

  return (
    <>
      <Section id="overview" title="Overview">
        <P>
          Dynamic routes use <C>[param]</C> syntax to match variable segments. Each folder or file
          named <C>[param]</C> creates a URL that accepts any value for that segment and provides
          it via <C>useParams()</C>.
        </P>
        <Table
          headers={['Pattern', 'Example URL', 'Creates URL?']}
          rows={[
            ['[slug]', '/blog/hello-world', 'Yes - dynamic creates URL'],
            ['[id]', '/users/123', 'Yes - dynamic creates URL'],
            [
              '[category]/[slug]',
              '/blog/tech/hello-world',
              'Yes - multiple dynamic creates URL',
            ],
          ]}
        />
        <Callout>
          <C>useParams()</C> is auto-imported - no import needed. Param names must match{' '}
          <C>/^[a-zA-Z_][a-zA-Z0-9_]*$/</C>.
        </Callout>
      </Section>

      <Section id="dynamic-segments" title="Dynamic Segments">
        <P>Wrap folder or file name in brackets <C>[name]</C>. Creates URL for any value.</P>
        <RouteVisual
          badges
          fileWidth={280}
          rows={[
            { n: 'app' },
            { n: 'blog', d: 1 },
            { n: '[slug]', d: 2 },
            { n: `page.${e}`, d: 3, dot: true, url: '/blog/:slug' },
            { n: 'products', d: 1 },
            { n: '[id]', d: 2 },
            { n: `page.${e}`, d: 3, url: '/products/:id' },
            { n: 'users', d: 1 },
            { n: '[userId]', d: 2 },
            { n: `page.${e}`, d: 3, url: '/users/:userId' },
          ]}
        />
        <CodeBlock
          filename={`app/blog/[slug]/page.${e}`}
          tsCode={`export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()

  return <h1>Post: {slug}</h1>
}`}
          jsCode={`export default function BlogPost() {
  const { slug } = useParams()

  return <h1>Post: {slug}</h1>
}`}
        />
        <CodeBlock
          filename={`app/users/[id]/page.${e}`}
          tsCode={`export default function UserProfile() {
  const { id } = useParams<{ id: string }>()
  const [user, setUser] = useState<{ name: string } | null>(null)

  useEffect(() => {
    fetchUser(id!).then(setUser)
  }, [id])

  if (!user) return null

  return <h1>{user.name}</h1>
}`}
          jsCode={`export default function UserProfile() {
  const { id } = useParams()
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetchUser(id).then(setUser)
  }, [id])

  if (!user) return null

  return <h1>{user.name}</h1>
}`}
        />
      </Section>

      <Section id="multiple-parameters" title="Multiple Parameters">
        <P>
          Multiple dynamic segments in one route. Each creates a URL part and becomes a property in{' '}
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
          filename={`app/blog/[category]/[slug]/page.${e}`}
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
        <Table
          headers={['URL', 'params', 'Creates URL?']}
          rows={[
            ['/blog/tech/hello-world', '{ category: "tech", slug: "hello-world" }', 'Yes'],
            ['/blog/lifestyle/travel', '{ category: "lifestyle", slug: "travel" }', 'Yes'],
          ]}
        />
      </Section>

      <Section id="dynamic-layouts" title="Dynamic Segments in Layouts">
        <P>
          Layouts can access dynamic params via <C>useParams()</C>. The layout itself does not
          create a URL.
        </P>
        <RouteVisual
          badges
          fileWidth={280}
          rows={[
            { n: 'app' },
            { n: 'blog', d: 1 },
            { n: '[slug]', d: 2 },
            { n: `layout.${e}`, d: 3, dot: true, url: '-', ok: false },
            { n: `page.${e}`, d: 3, url: '/blog/:slug' },
          ]}
        />
        <CodeBlock
          filename={`app/blog/[slug]/layout.${e}`}
          tsCode={`export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { slug } = useParams<{ slug: string }>()

  return (
    <div>
      <header>
        <h2>Post: {slug}</h2>
        <Link to="/blog">Back to blog</Link>
      </header>
      <main>{children}</main>
    </div>
  )
}`}
          jsCode={`export default function BlogLayout({ children }) {
  const { slug } = useParams()

  return (
    <div>
      <header>
        <h2>Post: {slug}</h2>
        <Link to="/blog">Back to blog</Link>
      </header>
      <main>{children}</main>
    </div>
  )
}`}
        />
      </Section>

      <Section id="flat-file-dynamic" title="Flat File Dynamic Routes">
        <P>Dynamic routes as flat files without folders. Each file creates a URL directly.</P>
        <RouteVisual
          badges
          fileWidth={260}
          rows={[
            { n: 'app' },
            { n: 'blog', d: 1 },
            { n: `[slug].${e}`, d: 2, dot: true, url: '/blog/:slug' },
            { n: 'products', d: 1 },
            { n: `[id].${e}`, d: 2, url: '/products/:id' },
            { n: 'users', d: 1 },
            { n: `[userId].${e}`, d: 2, url: '/users/:userId' },
          ]}
        />
        <CodeBlock
          filename={`app/blog/[slug].${e}`}
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
          Dynamic routes have lower priority than static routes. Static wins if both exist.
        </P>
        <Callout>
          <ol className="list-decimal space-y-2 pl-5">
            <li>
              <strong>Static routes</strong> - <C>/blog/featured</C> - creates URL, highest
              priority
            </li>
            <li>
              <strong>Dynamic segments</strong> - <C>[slug]</C> → <C>/blog/:slug</C> - creates URL
            </li>
          </ol>
        </Callout>
        <RouteVisual
          badges
          fileWidth={260}
          rows={[
            { n: 'blog' },
            { n: 'featured', d: 1 },
            { n: `page.${e}`, d: 2, dot: true, url: '/blog/featured' },
            { n: '[slug]', d: 1 },
            { n: `page.${e}`, d: 2, url: '/blog/:slug' },
          ]}
        />
        <Table
          headers={['URL', 'Matched Route', 'Creates URL?']}
          rows={[
            ['/blog/featured', `featured/page.${e} - static`, 'Yes'],
            ['/blog/hello-world', `[slug]/page.${e} - dynamic`, 'Yes'],
          ]}
        />
      </Section>

      <Section id="complete-example" title="Complete Example">
        <P>
          Dynamic routes only - <C>[param]</C> patterns that create URLs.
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
            { n: '[category]', d: 2 },
            { n: '[slug]', d: 3 },
            { n: `page.${e}`, d: 4, url: '/blog/:category/:slug' },
            { n: 'products', d: 1 },
            { n: `page.${e}`, d: 2, url: '/products' },
            { n: `[id].${e}`, d: 2, url: '/products/:id' },
            { n: 'users', d: 1 },
            { n: '[userId]', d: 2 },
            { n: `page.${e}`, d: 3, url: '/users/:userId' },
            { n: 'settings', d: 3 },
            { n: `page.${e}`, d: 4, url: '/users/:userId/settings' },
          ]}
        />
        <Table
          headers={['Pattern', 'Example URL', 'Creates URL?']}
          rows={[
            ['/blog/featured', '/blog/featured', 'Yes - static'],
            ['/blog/:slug', '/blog/hello-world', 'Yes - dynamic creates URL'],
            [
              '/blog/:category/:slug',
              '/blog/tech/hello-world',
              'Yes - multiple dynamic creates URL',
            ],
            ['/products/:id', '/products/123', 'Yes - flat file dynamic creates URL'],
            [
              '/users/:userId/settings',
              '/users/john/settings',
              'Yes - nested dynamic creates URL',
            ],
          ]}
        />
      </Section>
    </>
  )
}

/* ---------- page ---------- */

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