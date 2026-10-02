// src/app/docs/linking-and-navigating.tsx
import {
  C,
  Callout,
  CodeBlock,
  DocPage,
  H3,
  P,
  Section,
  Table,
  UL,
  useDocLang,
} from '../../components/DocBlocks'
import { RouteVisual } from '../../components/DocVisuals'
import type { TocItem } from '../../components/TableOfContents'

const TOC_ITEMS: TocItem[] = [
  { id: 'link-component', label: 'Link component' },
  { id: 'navlink-component', label: 'NavLink component' },
  { id: 'usenavigate-hook', label: 'useNavigate hook' },
  { id: 'useparams-hook', label: 'useParams hook' },
  { id: 'uselocation-hook', label: 'useLocation hook' },
  { id: 'usesearchparams-hook', label: 'useSearchParams hook' },
  { id: 'programmatic-navigation', label: 'Programmatic navigation' },
  { id: 'navigation-query-params', label: 'Navigation with query parameters' },
  { id: 'best-practices', label: 'Best practices' },
]

/* ---------- content (reads the TS/JS choice from DocPage) ---------- */

function Content() {
  const lang = useDocLang()
  const e = lang === 'js' ? 'jsx' : 'tsx'

  return (
    <>
      <Section id="link-component" title="Link component">
        <P>
          The <C>&lt;Link&gt;</C> component is the primary way to navigate between routes. It
          extends the HTML <C>&lt;a&gt;</C> tag to provide client-side navigation, and it is
          auto-imported in all pages and layouts.
        </P>
        <RouteVisual
          rows={[
            { n: 'app' },
            { n: `page.${e}`, d: 1, dot: true, url: '/' },
            { n: 'about', d: 1 },
            { n: `page.${e}`, d: 2, dot: true, url: '/about' },
            { n: 'blog', d: 1 },
            { n: `page.${e}`, d: 2, dot: true, url: '/blog' },
          ]}
        />
        <CodeBlock
          filename={`app/page.${e}`}
          tsCode={`export default function Home() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/blog">Blog</Link>
    </nav>
  )
}`}
          jsCode={`export default function Home() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/blog">Blog</Link>
    </nav>
  )
}`}
        />
        <H3 className="mb-3 mt-6">Link props</H3>
        <Table
          headers={['Prop', 'Type', 'Description']}
          rows={[
            ['to', 'string', 'The destination route path'],
            ['replace', 'boolean', 'Replace the current entry in history instead of adding'],
            ['state', 'any', 'State to persist to the location'],
            ['className', 'string', 'CSS class for styling'],
            ['children', 'ReactNode', 'The content inside the link'],
          ]}
        />
      </Section>

      <Section id="navlink-component" title="NavLink component">
        <P>
          <C>&lt;NavLink&gt;</C> is a special version of <C>&lt;Link&gt;</C> that knows whether it
          matches the current route. Use it for navigation menus that need active-state styling.
        </P>
        <RouteVisual
          rows={[
            { n: 'app' },
            { n: `layout.${e}`, d: 1, dot: true },
            { n: `page.${e}`, d: 1, url: '/' },
            { n: 'blog', d: 1 },
            { n: `page.${e}`, d: 2, url: '/blog' },
          ]}
        />
        <CodeBlock
          filename={`app/components/Navigation.${e}`}
          tsCode={`export default function Navigation() {
  const cls = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'text-cyan-400' : 'text-white'

  return (
    <nav>
      <NavLink to="/" className={cls} end>Home</NavLink>
      <NavLink to="/about" className={cls}>About</NavLink>
      <NavLink to="/blog" className={cls}>Blog</NavLink>
    </nav>
  )
}`}
          jsCode={`export default function Navigation() {
  const cls = ({ isActive }) => (isActive ? 'text-cyan-400' : 'text-white')

  return (
    <nav>
      <NavLink to="/" className={cls} end>Home</NavLink>
      <NavLink to="/about" className={cls}>About</NavLink>
      <NavLink to="/blog" className={cls}>Blog</NavLink>
    </nav>
  )
}`}
        />
        <Callout>
          <strong>Good to know:</strong> Add <C>end</C> to the <C>/</C> link, otherwise it matches
          every route and always looks active.
        </Callout>
        <H3 className="mb-3 mt-6">NavLink props</H3>
        <Table
          headers={['Prop', 'Type', 'Description']}
          rows={[
            ['to', 'string', 'The destination route path'],
            [
              'className',
              'function | string',
              'Function receives { isActive, isPending } or a string',
            ],
            [
              'style',
              'function | object',
              'Function receives { isActive, isPending } or a style object',
            ],
            ['children', 'ReactNode | function', 'Content or render function'],
            ['end', 'boolean', 'Only match the exact path, not child routes'],
            ['caseSensitive', 'boolean', 'Match case-sensitively'],
          ]}
        />
      </Section>

      <Section id="usenavigate-hook" title="useNavigate hook">
        <P>
          The <C>useNavigate</C> hook returns a function that lets you navigate programmatically.
          It is auto-imported in all pages.
        </P>
        <RouteVisual
          rows={[
            { n: 'app' },
            { n: 'login', d: 1 },
            { n: `page.${e}`, d: 2, dot: true, url: '/login' },
            { n: 'dashboard', d: 1 },
            { n: `page.${e}`, d: 2, url: '/dashboard' },
          ]}
        />
        <CodeBlock
          filename={`app/login/page.${e}`}
          tsCode={`export default function LoginPage() {
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await loginUser()
    if (success) navigate('/dashboard')
  }

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Login</button>
    </form>
  )
}`}
          jsCode={`export default function LoginPage() {
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const success = await loginUser()
    if (success) navigate('/dashboard')
  }

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Login</button>
    </form>
  )
}`}
        />
        <H3 className="mb-3 mt-6">Navigate options</H3>
        <Table
          headers={['Option', 'Type', 'Description']}
          rows={[
            ['replace', 'boolean', 'Replace the current entry in history'],
            ['state', 'any', 'State to persist to the location'],
          ]}
        />
        <CodeBlock
          code={`// Navigate with options
navigate('/profile', { replace: true, state: { from: 'login' } })

// Go back
navigate(-1)

// Go forward
navigate(1)`}
        />
      </Section>

      <Section id="useparams-hook" title="useParams hook">
        <P>
          The <C>useParams</C> hook returns an object of key/value pairs of the dynamic route
          parameters from the current URL. Wrap a folder name in square brackets, like{' '}
          <C>[slug]</C>, to create a dynamic segment.
        </P>
        <RouteVisual
          rows={[
            { n: 'app' },
            { n: 'blog', d: 1 },
            { n: '[slug]', d: 2 },
            { n: `page.${e}`, d: 3, dot: true, url: '/blog/:slug' },
          ]}
        />
        <CodeBlock
          filename={`app/blog/[slug]/page.${e}`}
          tsCode={`export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()

  return (
    <div>
      <h1>Blog Post: {slug}</h1>
    </div>
  )
}`}
          jsCode={`export default function BlogPost() {
  const { slug } = useParams()

  return (
    <div>
      <h1>Blog Post: {slug}</h1>
    </div>
  )
}`}
        />
      </Section>

      <Section id="uselocation-hook" title="useLocation hook">
        <P>
          The <C>useLocation</C> hook returns the current location object, including{' '}
          <C>pathname</C>, <C>search</C>, <C>hash</C>, and any <C>state</C> passed during
          navigation. This is useful for things like breadcrumbs.
        </P>
        <CodeBlock
          filename={`app/components/Breadcrumbs.${e}`}
          tsCode={`export default function Breadcrumbs() {
  const location = useLocation()
  const segments = location.pathname.split('/').filter(Boolean)

  return (
    <nav>
      <Link to="/">Home</Link>
      {segments.map((name, index) => {
        const routeTo = \`/\${segments.slice(0, index + 1).join('/')}\`
        return (
          <Link key={routeTo} to={routeTo}>
            {name}
          </Link>
        )
      })}
    </nav>
  )
}`}
          jsCode={`export default function Breadcrumbs() {
  const location = useLocation()
  const segments = location.pathname.split('/').filter(Boolean)

  return (
    <nav>
      <Link to="/">Home</Link>
      {segments.map((name, index) => {
        const routeTo = \`/\${segments.slice(0, index + 1).join('/')}\`
        return (
          <Link key={routeTo} to={routeTo}>
            {name}
          </Link>
        )
      })}
    </nav>
  )
}`}
        />
        <H3 className="mb-3 mt-6">Location properties</H3>
        <Table
          headers={['Property', 'Type', 'Description']}
          rows={[
            ['pathname', 'string', 'The path of the current URL'],
            ['search', 'string', 'The query string, including the leading ?'],
            ['hash', 'string', 'The URL hash, including the leading #'],
            ['state', 'any', 'State passed via Link or navigate'],
            ['key', 'string', 'A unique key for this location entry'],
          ]}
        />
      </Section>

      <Section id="usesearchparams-hook" title="useSearchParams hook">
        <P>
          The <C>useSearchParams</C> hook reads and updates the query string. It works like{' '}
          <C>useState</C>: you get the current params and a function to change them.
        </P>
        <CodeBlock
          filename={`app/shop/page.${e}`}
          tsCode={`export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get('category') || 'all'

  return (
    <div>
      <p>Category: {category}</p>
      <button onClick={() => setSearchParams({ category: 'shoes' })}>
        Show shoes
      </button>
    </div>
  )
}`}
          jsCode={`export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get('category') || 'all'

  return (
    <div>
      <p>Category: {category}</p>
      <button onClick={() => setSearchParams({ category: 'shoes' })}>
        Show shoes
      </button>
    </div>
  )
}`}
        />
      </Section>

      <Section id="programmatic-navigation" title="Programmatic navigation">
        <P>
          While <C>&lt;Link&gt;</C> is ideal for declarative navigation in your JSX, sometimes you
          need logic before navigating. <C>useNavigate</C> returns a function you can call inside
          event handlers, effects, or after async operations. It performs the same client-side
          navigation as <C>&lt;Link&gt;</C>, preserving layout state and skipping a full page
          reload.
        </P>
        <P>
          This is a good fit for post-form redirects, authentication flows, and conditional
          navigation. Pass <C>replace: true</C> when the user shouldn't be able to go back to the
          previous page, such as after logging in.
        </P>
        <CodeBlock
          filename={`app/login/page.${e}`}
          tsCode={`export default function LoginPage() {
  const navigate = useNavigate()
  const { state } = useLocation()

  const handleLogin = async () => {
    const result = await login()
    if (!result.success) return

    // Send the user back to where they came from
    navigate(state?.from ?? '/dashboard', { replace: true })
  }

  return <button onClick={handleLogin}>Login</button>
}`}
          jsCode={`export default function LoginPage() {
  const navigate = useNavigate()
  const { state } = useLocation()

  const handleLogin = async () => {
    const result = await login()
    if (!result.success) return

    // Send the user back to where they came from
    navigate(state?.from ?? '/dashboard', { replace: true })
  }

  return <button onClick={handleLogin}>Login</button>
}`}
        />
      </Section>

      <Section id="navigation-query-params" title="Navigation with query parameters">
        <P>
          You can include a query string directly in the <C>to</C> prop of <C>&lt;Link&gt;</C> or
          in the path you pass to <C>navigate</C>. The destination page reads the values with{' '}
          <C>useSearchParams</C>.
        </P>
        <CodeBlock
          filename={`app/components/Filters.${e}`}
          tsCode={`export default function Filters() {
  const navigate = useNavigate()

  return (
    <div>
      <Link to="/shop?category=shoes">Shoes</Link>
      <Link to={{ pathname: '/shop', search: '?category=hats&sort=price' }}>
        Hats
      </Link>
      <button onClick={() => navigate('/shop?category=bags')}>Bags</button>
    </div>
  )
}`}
          jsCode={`export default function Filters() {
  const navigate = useNavigate()

  return (
    <div>
      <Link to="/shop?category=shoes">Shoes</Link>
      <Link to={{ pathname: '/shop', search: '?category=hats&sort=price' }}>
        Hats
      </Link>
      <button onClick={() => navigate('/shop?category=bags')}>Bags</button>
    </div>
  )
}`}
        />
      </Section>

      <Section id="best-practices" title="Best practices">
        <UL>
          <li>
            Use <C>&lt;Link&gt;</C> for standard navigation links.
          </li>
          <li>
            Use <C>&lt;NavLink&gt;</C> for navigation menus that need active-state styling.
          </li>
          <li>
            Use <C>useNavigate</C> for programmatic navigation, such as redirects after a form or
            login.
          </li>
          <li>
            Use <C>useParams</C> to access dynamic route parameters.
          </li>
          <li>
            Use <C>useSearchParams</C> for managing query strings and filters.
          </li>
        </UL>
      </Section>
    </>
  )
}

/* ---------- page ---------- */

export default function LinkingAndNavigatingPage() {
  return (
    <DocPage
      title="Linking and Navigating"
      description="Bini.js provides built-in navigation components and hooks for fast, client-side transitions between routes without full page reloads. This page covers how to use Link, NavLink, and the navigation hooks."
      url="https://bini.js.org/docs/linking-and-navigating"
      editUrl="https://github.com/Binidu01/bini-official/edit/main/src/app/docs/linking-and-navigating.tsx"
      toc={TOC_ITEMS}
      prev={{ to: '/docs/layouts-and-pages', title: 'Layouts and Pages' }}
      next={{ to: '/docs/folder-based-routing', title: 'Folder-Based Routing' }}
    >
      <Content />
    </DocPage>
  )
}