// src/app/docs/layouts-and-pages.tsx
import {
  C,
  Callout,
  CodeBlock,
  DocPage,
  H3,
  P,
  Section,
  useDocLang,
} from '../../components/DocBlocks'
import { RouteVisual } from '../../components/DocVisuals'
import type { TocItem } from '../../components/TableOfContents'

const TOC_ITEMS: TocItem[] = [
  { id: 'creating-a-page', label: 'Creating a page' },
  { id: 'creating-a-layout', label: 'Creating a layout' },
  { id: 'creating-a-nested-route', label: 'Creating a nested route' },
  { id: 'nesting-layouts', label: 'Nesting layouts' },
  { id: 'creating-a-dynamic-segment', label: 'Creating a dynamic segment' },
  { id: 'rendering-with-search-params', label: 'Rendering with search params' },
  { id: 'linking-between-pages', label: 'Linking between pages' },
]

const LIST = 'mb-5 list-disc space-y-1 pl-5 text-[15px] text-neutral-600 dark:text-neutral-400'
const STRONG = 'font-semibold text-black dark:text-white'

/** CodeBlock takes a single `code` string, so pick the TS or JS variant here. */
function Code({
  filename,
  tsCode,
  jsCode,
}: {
  filename: string
  tsCode: string
  jsCode: string
}) {
  const lang = useDocLang()
  return <CodeBlock filename={filename} code={lang === 'js' ? jsCode : tsCode} />
}

/* ---------- content (reads the TS/JS choice from DocPage) ---------- */

function Content() {
  const lang = useDocLang()
  const e = lang === 'js' ? 'jsx' : 'tsx'

  return (
    <>
      <Section id="creating-a-page" title="Creating a page">
        <P>
          A <strong className={STRONG}>page</strong> is UI that is rendered on a specific route. To
          create a page, add a <C>page</C> file inside the <C>app</C> directory and default export
          a React component. For example, to create an index page (<C>/</C>):
        </P>
        <RouteVisual rows={[{ n: 'app' }, { n: `page.${e}`, d: 1, dot: true, url: '/' }]} />
        <Code
          filename={`app/page.${e}`}
          tsCode={`export default function Page() {
  return <h1>Hello, World!</h1>
}`}
          jsCode={`export default function Page() {
  return <h1>Hello, World!</h1>
}`}
        />
      </Section>

      <Section id="creating-a-layout" title="Creating a layout">
        <P>
          A layout is UI that is <strong className={STRONG}>shared</strong> between multiple pages.
          On navigation, layouts preserve state, remain interactive, and do not rerender.
        </P>
        <P>
          You can define a layout by default exporting a React component from a <C>layout</C> file.
          The component should accept a <C>children</C> prop which can be a page or another layout.
          The layout in <C>{`app/layout.${e}`}</C> is called the root layout. It is defined at the
          root of the <C>app</C> directory and wraps all routes.
        </P>
        <RouteVisual
          rows={[
            { n: 'app' },
            { n: `layout.${e}`, d: 1, dot: true },
            { n: `page.${e}`, d: 1, url: '/' },
          ]}
        />
        <Code
          filename={`app/layout.${e}`}
          tsCode={`export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Layout UI */}
      <nav>Sidebar</nav>
      <main>{children}</main>
    </>
  )
}`}
          jsCode={`export default function DashboardLayout({ children }) {
  return (
    <>
      <nav>Sidebar</nav>
      <main>{children}</main>
    </>
  )
}`}
        />
      </Section>

      <Section id="creating-a-nested-route" title="Creating a nested route">
        <P>
          A nested route is a route composed of multiple URL segments. For example, the{' '}
          <C>/blog/[slug]</C> route is composed of three segments:
        </P>
        <ul className={LIST}>
          <li>
            <C>/</C> (Root Segment)
          </li>
          <li>
            <C>blog</C> (Segment)
          </li>
          <li>
            <C>[slug]</C> (Leaf Segment)
          </li>
        </ul>
        <ul className={LIST}>
          <li>Folders are used to define the route segments that map to URL segments.</li>
          <li>
            Files (like <C>page</C> and <C>layout</C>) are used to create UI that is shown for a
            segment.
          </li>
        </ul>
        <P>
          To create nested routes, you can nest folders inside each other. For example, to add a
          route for <C>/blog</C>, create a folder called <C>blog</C> in the <C>app</C> directory:
        </P>
        <RouteVisual
          rows={[
            { n: 'app' },
            { n: 'blog', d: 1 },
            { n: `page.${e}`, d: 2, dot: true, url: '/blog' },
          ]}
        />
        <Code
          filename={`app/blog/page.${e}`}
          tsCode={`export default function Page() {
  const posts = [
    { id: 1, title: 'Hello' },
    { id: 2, title: 'Getting Started' },
  ]
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}`}
          jsCode={`export default function Page() {
  const posts = [
    { id: 1, title: 'Hello' },
    { id: 2, title: 'Getting Started' },
  ]
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}`}
        />
        <P>
          You can continue nesting folders to create nested routes. For example, to create a route
          for a specific blog post, create a new <C>[slug]</C> folder inside <C>blog</C> and add a
          page file:
        </P>
        <RouteVisual
          rows={[
            { n: 'app' },
            { n: 'blog', d: 1 },
            { n: '[slug]', d: 2 },
            { n: `page.${e}`, d: 3, dot: true, url: '/blog/:slug' },
          ]}
        />
        <Code
          filename={`app/blog/[slug]/page.${e}`}
          tsCode={`export default function Page() {
  return <h1>Hello, Blog Post Page!</h1>
}`}
          jsCode={`export default function Page() {
  return <h1>Hello, Blog Post Page!</h1>
}`}
        />
      </Section>

      <Section id="nesting-layouts" title="Nesting layouts">
        <P>
          By default, layouts in the folder hierarchy are also nested, which means they wrap child
          layouts via their <C>children</C> prop. You can nest layouts by adding <C>layout</C>{' '}
          inside specific route segments (folders).
        </P>
        <RouteVisual
          rows={[
            { n: 'app' },
            { n: `layout.${e}`, d: 1, dot: true },
            { n: `page.${e}`, d: 1, url: '/' },
            { n: 'blog', d: 1 },
            { n: `layout.${e}`, d: 2, dot: true },
            { n: `page.${e}`, d: 2, url: '/blog' },
          ]}
        />
        <Code
          filename={`app/blog/layout.${e}`}
          tsCode={`export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>{children}</section>
}`}
          jsCode={`export default function BlogLayout({ children }) {
  return <section>{children}</section>
}`}
        />
        <P>
          If you were to combine the two layouts above, the root layout (
          <C>{`app/layout.${e}`}</C>) would wrap the blog layout (<C>{`app/blog/layout.${e}`}</C>),
          which would wrap the blog (<C>{`app/blog/page.${e}`}</C>) and blog post page (
          <C>{`app/blog/[slug]/page.${e}`}</C>).
        </P>
      </Section>

      <Section id="creating-a-dynamic-segment" title="Creating a dynamic segment">
        <P>
          Dynamic segments allow you to create routes that are generated from data. For example,
          instead of manually creating a route for each individual blog post, you can create a
          dynamic segment to generate the routes based on blog post data.
        </P>
        <P>
          To create a dynamic segment, wrap the segment (folder) name in square brackets:{' '}
          <C>[segmentName]</C>. For example, in the <C>{`app/blog/[slug]/page.${e}`}</C> route, the{' '}
          <C>[slug]</C> is the dynamic segment.
        </P>
        <RouteVisual
          rows={[
            { n: 'app' },
            { n: 'blog', d: 1 },
            { n: '[slug]', d: 2 },
            { n: `page.${e}`, d: 3, dot: true, url: '/blog/hello-world' },
          ]}
        />
        <Code
          filename={`app/blog/[slug]/page.${e}`}
          tsCode={`export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()

  return (
    <div>
      <h1>Blog Post: {slug}</h1>
    </div>
  )
}`}
          jsCode={`export default function BlogPostPage() {
  const { slug } = useParams()

  return (
    <div>
      <h1>Blog Post: {slug}</h1>
    </div>
  )
}`}
        />
        <Callout>
          Uses the <C>useParams()</C> hook (auto-imported). Supports <C>[slug]</C>,{' '}
          <C>[...slug]</C> catch-all, and <C>[[...slug]]</C> optional catch-all.
        </Callout>
      </Section>

      <Section id="rendering-with-search-params" title="Rendering with search params">
        <P>
          You can access search parameters using the <C>useSearchParams</C> hook. It's
          auto-imported in all pages.
        </P>
        <Code
          filename={`app/page.${e}`}
          tsCode={`export default function Page() {
  const [searchParams] = useSearchParams()
  const filter = searchParams.get('filter')

  return <div>Filter: {filter}</div>
}`}
          jsCode={`export default function Page() {
  const [searchParams] = useSearchParams()
  const filter = searchParams.get('filter')

  return <div>Filter: {filter}</div>
}`}
        />
        <H3 className="mb-3 mt-8">What to use and when</H3>
        <ul className={LIST}>
          <li>
            Use <C>useSearchParams</C> when you need search params to load data (pagination,
            filtering from API).
          </li>
          <li>
            Use <C>useSearchParams</C> with client filtering (filtering a list already loaded).
          </li>
          <li>
            As an optimization, you can use <C>new URLSearchParams(window.location.search)</C> in
            callbacks to read without re-renders.
          </li>
        </ul>
      </Section>

      <Section id="linking-between-pages" title="Linking between pages">
        <P>
          You can use the <C>&lt;Link&gt;</C> component to navigate between routes.{' '}
          <C>&lt;Link&gt;</C> is a built-in component that extends the HTML <C>&lt;a&gt;</C> tag to
          provide client-side navigation without full page reloads.
        </P>
        <P>
          For example, to generate a list of blog posts, import <C>&lt;Link&gt;</C> (auto-imported)
          and pass a <C>to</C> prop:
        </P>
        <Code
          filename={`app/blog/page.${e}`}
          tsCode={`type Post = { slug: string; title: string }

export default function BlogList() {
  const posts: Post[] = [
    { slug: 'hello-world', title: 'Hello, World' },
    { slug: 'getting-started', title: 'Getting Started' },
  ]
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.slug}>
          <Link to={\`/blog/\${post.slug}\`}>{post.title}</Link>
        </li>
      ))}
    </ul>
  )
}`}
          jsCode={`export default function BlogList() {
  const posts = [
    { slug: 'hello-world', title: 'Hello, World' },
    { slug: 'getting-started', title: 'Getting Started' },
  ]
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.slug}>
          <Link to={\`/blog/\${post.slug}\`}>{post.title}</Link>
        </li>
      ))}
    </ul>
  )
}`}
        />
        <P>
          While <C>&lt;Link&gt;</C> is ideal for declarative navigation in your JSX, sometimes you
          need to navigate programmatically. Bini.js provides the <C>useNavigate</C> hook for this.
        </P>
        <P>
          Unlike <C>&lt;Link&gt;</C>, which renders an anchor tag, <C>useNavigate</C> returns a
          function you can call inside event handlers, effects, or after async operations. It
          performs a client-side navigation without a full page reload, preserving layout state and
          scroll position just like <C>&lt;Link&gt;</C>. This is perfect for post-form redirects,
          authentication flows, or conditional navigation where you need logic before navigating.
        </P>
        <Code
          filename={`app/login/page.${e}`}
          tsCode={`export default function LoginPage() {
  const navigate = useNavigate()

  const handleLogin = async () => {
    await login()
    // Redirect after successful login
    navigate('/dashboard')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const result = await submitForm(formData)

    if (result.success) {
      navigate(\`/blog/\${result.slug}\`)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit" onClick={handleLogin}>Login</button>
    </form>
  )
}`}
          jsCode={`export default function LoginPage() {
  const navigate = useNavigate()

  const handleLogin = async () => {
    await login()
    // Redirect after successful login
    navigate('/dashboard')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const result = await submitForm(formData)

    if (result.success) {
      navigate(\`/blog/\${result.slug}\`)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit" onClick={handleLogin}>Login</button>
    </form>
  )
}`}
        />
      </Section>
    </>
  )
}

/* ---------- page ---------- */

export default function LayoutsAndPagesPage() {
  return (
    <DocPage
      title="Layouts and Pages"
      description="Uses file-system based routing, meaning you can use folders and files to define routes. This page will guide you through how to create layouts and pages, and link between them."
      url="https://bini.js.org/docs/layouts-and-pages"
      editUrl="https://github.com/Binidu01/bini-official/edit/main/src/app/docs/layouts-and-pages.tsx"
      toc={TOC_ITEMS}
      prev={{ to: '/docs/project-structure', title: 'Project Structure' }}
      next={{ to: '/docs/linking-and-navigating', title: 'Linking and Navigating' }}
    >
      <Content />
    </DocPage>
  )
}