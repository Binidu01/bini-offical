// src/pages/docs/linking-and-navigating/page.tsx
import React from 'react'
import { m } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Header } from '../../components/Layout'
import { DocLayout } from '../../components/DocSidebar'
import { CopyPageButton } from '../../components/CopyPageButton'
import { TableOfContents, type TocItem } from '../../components/TableOfContents'

// ────────────────────────────────────────────────────────────────────────────────
// "On this page" entries
// ────────────────────────────────────────────────────────────────────────────────
const TOC_ITEMS: TocItem[] = [
  { id: 'link-component', label: 'Link Component' },
  { id: 'navlink-component', label: 'NavLink Component' },
  { id: 'usenavigate-hook', label: 'useNavigate Hook' },
  { id: 'useparams-hook', label: 'useParams Hook' },
  { id: 'uselocation-hook', label: 'useLocation Hook' },
  { id: 'usesearchparams-hook', label: 'useSearchParams Hook' },
  { id: 'programmatic-navigation', label: 'Programmatic Navigation' },
  { id: 'navigation-query-params', label: 'Navigation with Query Parameters' },
]

const PAGE_TITLE = 'Linking and Navigating'
const PAGE_URL = 'https://bini.js.org/docs/linking-and-navigating'
const EDIT_URL = 'https://github.com/Binidu01/bini-offical/edit/main/src/app/docs/linking-and-navigating.tsx'

// ────────────────────────────────────────────────────────────────────────────────
// Code Block Component with horizontal scrollbar
// ────────────────────────────────────────────────────────────────────────────────
function CodeBlock({ code, filename }: { code: string; filename?: string }) {
  const [copied, setCopied] = React.useState(false)
  const handleCopy = () => { 
    const cleanCode = code.replace(/\$ /g, '')
    navigator.clipboard.writeText(cleanCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000) 
  }

  return (
    <div className="relative group mb-6">
      {filename && (
        <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border border-slate-800 border-b-0 rounded-t-lg">
          <span className="text-sm text-slate-300 font-mono">{filename}</span>
        </div>
      )}
      <button onClick={handleCopy} className="absolute top-2 right-2 p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 transition-colors z-10 opacity-0 group-hover:opacity-100" style={{ top: filename ? '3rem' : '0.5rem' }}>
        {copied ? (
          <svg className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )}
      </button>
      <div className={`bg-[#0a0a0a] border border-slate-700 ${filename ? 'rounded-t-none' : 'rounded-lg'} overflow-x-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent hover:scrollbar-thumb-slate-500`}>
        <pre className="p-4 min-w-max">
          <code className="text-sm font-mono text-slate-200 whitespace-pre">{code}</code>
        </pre>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────────
// Table Component
// ────────────────────────────────────────────────────────────────────────────────
function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-700 my-6">
      <table className="w-full text-sm">
        <thead className="bg-slate-900 border-b border-slate-800">
          <tr>{headers.map((h, i) => <th key={i} className="text-left py-3 px-4 font-medium text-white">{h}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j} className="py-3 px-4 text-slate-300 text-xs">{cell}</td>)}</tr>)}
        </tbody>
      </table>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────────
// Linking and Navigating Page
// ────────────────────────────────────────────────────────────────────────────────
export default function LinkingAndNavigatingPage() {
  return (
    <div className="min-h-screen bg-black font-sans antialiased overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-300 h-200 bg-linear-to-b from-cyan-500/5 via-sky-500/3 to-transparent rounded-full blur-3xl" />
      </div>

      <Header />

      <div className="relative pt-16 lg:pt-20">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 overflow-x-hidden">
          
          <DocLayout>
            <div className="flex gap-10 xl:gap-14">
              {/* Main content column */}
              <div className="max-w-4xl min-w-0 flex-1">

                {/* Title + Copy page button */}
                <m.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start justify-between gap-4 mb-4"
                >
                  <div>
                    <h1 className="text-4xl font-bold text-white mb-2">{PAGE_TITLE}</h1>
                    <p className="text-slate-400 text-sm">Learn how navigation works in Bini.js and how to use the Link component and useNavigate hook.</p>
                  </div>
                  <div className="shrink-0 pt-2 hidden sm:block">
                    <CopyPageButton pageUrl={PAGE_URL} pageTitle={PAGE_TITLE} />
                  </div>
                </m.div>
                {/* Copy button on small screens */}
                <div className="sm:hidden mb-8">
                  <CopyPageButton pageUrl={PAGE_URL} pageTitle={PAGE_TITLE} />
                </div>

                {/* Overview */}
                <m.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <p className="text-slate-300 mb-6">
                    Bini.js provides built-in navigation components and hooks that enable fast, client-side transitions between routes without full page reloads.
                  </p>
                </m.section>

                {/* Link Component */}
                <m.section id="link-component" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Link Component</h2>
                  <p className="text-slate-300 mb-4">
                    The <code className="text-cyan-400">&lt;Link&gt;</code> component is the primary way to navigate between routes. It's auto-imported in all pages and layouts, so you can use it without any import statements.
                  </p>
                  <CodeBlock 
                    code={`// src/app/page.tsx
export default function Home() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/blog">Blog</Link>
    </nav>
  )
}`}
                    filename="app/page.tsx"
                  />
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Link Props</h3>
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
                </m.section>

                {/* NavLink Component */}
                <m.section id="navlink-component" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">NavLink Component</h2>
                  <p className="text-slate-300 mb-4">
                    <code className="text-cyan-400">&lt;NavLink&gt;</code> is a special version of <code className="text-cyan-400">&lt;Link&gt;</code> that adds styling attributes when it matches the current route. Perfect for navigation menus.
                  </p>
                  <CodeBlock 
                    code={`// src/app/components/Navigation.tsx
export default function Navigation() {
  return (
    <nav>
      <NavLink 
        to="/" 
        className={({ isActive }) => isActive ? 'text-cyan-400' : 'text-white'}
      >
        Home
      </NavLink>
      <NavLink 
        to="/about" 
        className={({ isActive }) => isActive ? 'text-cyan-400' : 'text-white'}
      >
        About
      </NavLink>
      <NavLink 
        to="/blog" 
        className={({ isActive }) => isActive ? 'text-cyan-400' : 'text-white'}
        end  // Only match exactly /blog, not /blog/*
      >
        Blog
      </NavLink>
    </nav>
  )
}`}
                    filename="app/components/Navigation.tsx"
                  />
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">NavLink Props</h3>
                  <Table 
                    headers={['Prop', 'Type', 'Description']}
                    rows={[
                      ['to', 'string', 'The destination route path'],
                      ['className', 'function | string', 'Function receives { isActive, isPending } or string'],
                      ['style', 'function | object', 'Function receives { isActive, isPending } or style object'],
                      ['children', 'ReactNode | function', 'Content or render function'],
                      ['end', 'boolean', 'Only match the exact path, not child routes'],
                      ['caseSensitive', 'boolean', 'Match case-sensitively'],
                    ]}
                  />
                </m.section>

                {/* useNavigate Hook */}
                <m.section id="usenavigate-hook" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">useNavigate Hook</h2>
                  <p className="text-slate-300 mb-4">
                    The <code className="text-cyan-400">useNavigate</code> hook returns a function that lets you navigate programmatically. It's auto-imported in all pages and layouts.
                  </p>
                  <CodeBlock 
                    code={`// src/app/login/page.tsx
export default function LoginPage() {
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Perform login logic...
    const success = await loginUser()
    
    if (success) {
      // Navigate to dashboard after successful login
      navigate('/dashboard')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button type="submit">Login</button>
    </form>
  )
}`}
                    filename="app/login/page.tsx"
                  />
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Navigate Options</h3>
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
                </m.section>

                {/* useParams Hook */}
                <m.section id="useparams-hook" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">useParams Hook</h2>
                  <p className="text-slate-300 mb-4">
                    The <code className="text-cyan-400">useParams</code> hook returns an object of key/value pairs of the dynamic route parameters from the current URL.
                  </p>
                  <CodeBlock 
                    code={`// src/app/blog/[slug]/page.tsx
export default function BlogPost() {
  const { slug } = useParams()
  
  return (
    <div>
      <h1>Blog Post: {slug}</h1>
    </div>
  )
}

// URL: /blog/hello-world
// useParams() returns { slug: 'hello-world' }`}
                    filename="app/blog/[slug]/page.tsx"
                  />
                  <CodeBlock 
                    code={`// src/app/shop/[...slug]/page.tsx
export default function ShopCategory() {
  const { slug } = useParams()
  // slug is an array: ['clothing', 'shirts']
  
  return (
    <div>
      <h1>Category: {slug.join(' / ')}</h1>
    </div>
  )
}`}
                    filename="app/shop/[...slug]/page.tsx"
                  />
                </m.section>

                {/* useLocation Hook */}
                <m.section id="uselocation-hook" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">useLocation Hook</h2>
                  <p className="text-slate-300 mb-4">
                    The <code className="text-cyan-400">useLocation</code> hook returns the current location object. Useful for accessing the current pathname, search params, and state.
                  </p>
                  <CodeBlock 
                    code={`// src/app/components/Breadcrumbs.tsx
export default function Breadcrumbs() {
  const location = useLocation()
  const pathnames = location.pathname.split('/').filter(x => x)

  return (
    <nav>
      <Link to="/">Home</Link>
      {pathnames.map((name, index) => {
        const routeTo = \`/\${pathnames.slice(0, index + 1).join('/')}\`
        const isLast = index === pathnames.length - 1

        return (
          <span key={name}>
            {' / '}
            {isLast ? (
              <span>{name}</span>
            ) : (
              <Link to={routeTo}>{name}</Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}`}
                    filename="app/components/Breadcrumbs.tsx"
                  />
                </m.section>

                {/* useSearchParams Hook */}
                <m.section id="usesearchparams-hook" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">useSearchParams Hook</h2>
                  <p className="text-slate-300 mb-4">
                    The <code className="text-cyan-400">useSearchParams</code> hook reads and updates the query string. It returns a <code className="text-cyan-400">URLSearchParams</code> object and a setter function.
                  </p>
                  <CodeBlock 
                    code={`// src/app/shop/page.tsx
export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get('category') || 'all'
  const sort = searchParams.get('sort') || 'newest'

  const handleCategoryChange = (newCategory) => {
    setSearchParams({ category: newCategory, sort })
  }

  const handleSortChange = (newSort) => {
    setSearchParams({ category, sort: newSort })
  }

  return (
    <div>
      <h1>Shop</h1>
      <p>Category: {category}</p>
      <p>Sort: {sort}</p>
      
      <button onClick={() => handleCategoryChange('electronics')}>
        Electronics
      </button>
      <button onClick={() => handleCategoryChange('clothing')}>
        Clothing
      </button>
    </div>
  )
}`}
                    filename="app/shop/page.tsx"
                  />
                </m.section>

                {/* Programmatic Navigation */}
                <m.section id="programmatic-navigation" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Programmatic Navigation</h2>
                  <p className="text-slate-300 mb-4">
                    Common patterns for programmatic navigation in Bini.js:
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">After Form Submission</h3>
                  <CodeBlock 
                    code={`const navigate = useNavigate()

const handleSubmit = async (data) => {
  await saveData(data)
  navigate('/success')
}`}
                  />

                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Conditional Navigation</h3>
                  <CodeBlock 
                    code={`const navigate = useNavigate()

useEffect(() => {
  if (!user) {
    navigate('/login')
  }
}, [user])`}
                  />

                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">With State</h3>
                  <CodeBlock 
                    code={`// Passing state
navigate('/checkout', { state: { cartItems } })

// Receiving state
const location = useLocation()
const { cartItems } = location.state || {}`}
                  />
                </m.section>

                {/* Navigation with Query Parameters */}
                <m.section id="navigation-query-params" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Navigation with Query Parameters</h2>
                  <p className="text-slate-300 mb-4">
                    Combine <code className="text-cyan-400">Link</code> and <code className="text-cyan-400">useSearchParams</code> for powerful filtering and pagination:
                  </p>
                  <CodeBlock 
                    code={`// src/app/products/page.tsx
export default function ProductsPage() {
  const [searchParams] = useSearchParams()
  const page = parseInt(searchParams.get('page') || '1')
  const filter = searchParams.get('filter') || ''

  return (
    <div>
      <h1>Products</h1>
      
      {/* Filter links */}
      <div>
        <Link to="/products?filter=featured">Featured</Link>
        <Link to="/products?filter=new">New Arrivals</Link>
        <Link to="/products?filter=sale">On Sale</Link>
      </div>
      
      {/* Pagination */}
      <div>
        <Link to={\`/products?page=\${page - 1}&filter=\${filter}\`}>
          Previous
        </Link>
        <span>Page {page}</span>
        <Link to={\`/products?page=\${page + 1}&filter=\${filter}\`}>
          Next
        </Link>
      </div>
    </div>
  )
}`}
                    filename="app/products/page.tsx"
                  />
                </m.section>

                {/* Best Practices */}
                <m.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Best Practices</h2>
                  <ul className="space-y-2 text-slate-300 mb-6 list-disc list-inside">
                    <li>Use <code className="text-cyan-400">&lt;Link&gt;</code> for standard navigation links</li>
                    <li>Use <code className="text-cyan-400">&lt;NavLink&gt;</code> for navigation menus that need active state styling</li>
                    <li>Use <code className="text-cyan-400">useNavigate</code> for programmatic navigation (form submissions, redirects)</li>
                    <li>Use <code className="text-cyan-400">useParams</code> to access dynamic route parameters</li>
                    <li>Use <code className="text-cyan-400">useSearchParams</code> for managing query strings and filters</li>
                    <li>All navigation hooks and components are auto-imported — no need to write import statements</li>
                  </ul>
                </m.section>

                {/* Previous / Next Navigation */}
                <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex items-center justify-between pt-8 mt-8 border-t border-slate-800">
                  <Link to="/docs/layouts-and-pages" className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <div>
                      <div className="text-xs text-slate-500">Previous</div>
                      <div className="text-sm font-medium">Layouts and Pages</div>
                    </div>
                  </Link>
                  <Link to="/docs/folder-based-routing" className="group flex items-center gap-2 text-right text-slate-400 hover:text-white transition-colors">
                    <div>
                      <div className="text-xs text-slate-500">Next</div>
                      <div className="text-sm font-medium">Folder-Based Routing</div>
                    </div>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </m.div>

              </div>

              {/* Right-hand "On this page" sidebar */}
              <aside className="hidden xl:block w-56 shrink-0">
                <TableOfContents items={TOC_ITEMS} editUrl={EDIT_URL} />
              </aside>
            </div>
          </DocLayout>
          
        </div>
      </div>
    </div>
  )
}