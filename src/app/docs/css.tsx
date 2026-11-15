// src/app/docs/css.tsx
import { Globe } from 'lucide-react'
import { Link } from 'react-router-dom'

import {
  C,
  Callout,
  ClackPrompt,
  ClackTerminal,
  CodeBlock,
  DocLink,
  DocPage,
  H3,
  MultiTerminal,
  P,
  Section,
  useDocLang,
} from '../../components/DocBlocks'
import { GridBg, ICON } from '../../components/DocVisuals'
import type { TocItem } from '../../components/TableOfContents'

const TOC_ITEMS: TocItem[] = [
  { id: 'plain-css', label: 'Plain CSS in Bini.js' },
  { id: 'global-css', label: 'Global CSS' },
  { id: 'route-css', label: 'CSS for Specific Routes' },
  { id: 'component-css', label: 'Component CSS' },
  { id: 'external-stylesheets', label: 'External Stylesheets' },
  { id: 'css-ordering', label: 'CSS Ordering' },
  { id: 'css-variables', label: 'CSS Variables' },
  { id: 'sass-support', label: 'Sass/SCSS' },
  { id: 'css-in-js', label: 'CSS-in-JS Alternative' },
]

/* ---------- visuals ---------- */

/** A stack of URLs that do (or do not) receive a stylesheet. */
function ScopeVisual({ title, ok, urls }: { title: string; ok: boolean; urls: string[] }) {
  return (
    <GridBg>
      <div className="w-72">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="text-[13px] font-semibold text-neutral-900 dark:text-neutral-100">
            {title}
          </span>
          <span
            className={`shrink-0 rounded-[5px] border-[1.5px] px-1.5 py-px font-mono text-[10px] font-medium ${
              ok
                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:border-emerald-500/80 dark:text-emerald-300'
                : 'border-red-500 bg-red-500/10 text-red-600 dark:border-red-500/80 dark:text-red-300'
            }`}
          >
            {ok ? 'Loaded' : 'Not loaded'}
          </span>
        </div>
        <div>
          {urls.map((url, i) => (
            <div
              key={url}
              className={`flex h-8 items-center gap-1.5 border-x border-b border-neutral-200 bg-white px-2.5 text-xs text-neutral-800 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 ${
                i === 0 ? 'rounded-t-lg border-t' : ''
              } ${i === urls.length - 1 ? 'rounded-b-lg' : ''}`}
            >
              <Globe className={ICON} strokeWidth={1.5} />
              {url}
            </div>
          ))}
        </div>
      </div>
    </GridBg>
  )
}

/* ---------- content ---------- */

function Content() {
  const lang = useDocLang()
  const e = lang === 'js' ? 'jsx' : 'tsx'

  return (
    <>
      <Section id="plain-css" title="Plain CSS in Bini.js">
        <P className="mb-4">
          Bini.js works with plain <C>.css</C> files out of the box. Import a <C>.css</C> file and
          it loads. This page covers plain CSS only.
        </P>
        <MultiTerminal
          tabs={[
            { id: 'npm', label: 'npm', command: `$ npx create-bini-app@latest my-app --none` },
            {
              id: 'pnpm',
              label: 'pnpm',
              command: `$ pnpm dlx create-bini-app@latest my-app --none`,
            },
            {
              id: 'yarn',
              label: 'yarn',
              command: `$ yarn dlx create-bini-app@latest my-app --none`,
            },
            { id: 'bun', label: 'bun', command: `$ bunx create-bini-app@latest my-app --none` },
          ]}
        />
        <P className="mb-4">
          Or run the interactive prompt and choose <C>None</C> for styling:
        </P>
        <ClackTerminal
          copyText={`? Styling solution? None`}
        >
          <ClackPrompt type="select" title="Styling solution?" active isFirst isLast>
            <div className="flex gap-1.5"><span className="text-neutral-500">○</span> <span className="text-neutral-500">Tailwind CSS</span></div>
            <div className="flex gap-1.5"><span className="text-neutral-500">○</span> <span className="text-neutral-500">CSS Modules</span></div>
            <div className="flex gap-1.5"><span className="text-green-500 dark:text-green-400">●</span> <span className="text-neutral-900 dark:text-neutral-100">None</span></div>
            <div className="mt-2 text-[11px] text-neutral-500">↑/↓ to navigate • Enter: confirm</div>
          </ClackPrompt>
        </ClackTerminal>
      </Section>

      <Section id="global-css" title="Global CSS">
        <P className="mb-4">
          Put base styles, resets, and variables in a global stylesheet. Import it once in your
          root layout:
        </P>
        <CodeBlock
          filename="src/app/globals.css"
          code={`/* src/app/globals.css - base reset and variables */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --bg: #ffffff;
  --text: #0a0a0a;
  --border: #e5e5e5;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.6;
}`}
        />
        <CodeBlock
          filename={`src/app/layout.${e}`}
          tsCode={`// src/app/layout.tsx - root layout
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}`}
          jsCode={`// src/app/layout.jsx - root layout
import './globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}`}
        />
        <Callout>
          Keep global CSS small: resets, variables, and styles that every page needs. Import
          styles for a specific route or component next to the file that uses them.
        </Callout>
      </Section>

      <Section id="route-css" title="CSS for Specific Routes">
        <P className="mb-4">
          Import CSS in the route that needs it. That way, pages that do not use the styles never
          load them. Each route can have its own stylesheet:
        </P>
        <CodeBlock
          filename="src/app/(marketing)/page.css"
          code={`/* src/app/(marketing)/page.css - only loaded for marketing route */
.hero {
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.hero h1 {
  font-size: 3rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}`}
        />
        <CodeBlock
          filename={`src/app/(marketing)/page.${e}`}
          tsCode={`// src/app/(marketing)/page.tsx
import './page.css'

export default function MarketingPage() {
  return (
    <div className="hero">
      <h1>Welcome to Bini.js</h1>
      <p>Build fast, ship faster</p>
    </div>
  )
}`}
          jsCode={`// src/app/(marketing)/page.jsx
import './page.css'

export default function MarketingPage() {
  return (
    <div className="hero">
      <h1>Welcome to Bini.js</h1>
      <p>Build fast, ship faster</p>
    </div>
  )
}`}
        />
        <CodeBlock
          filename="src/app/dashboard/page.css"
          code={`/* src/app/dashboard/page.css - only for dashboard */
.dashboard-grid {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 1.5rem;
}

.sidebar {
  border-right: 1px solid var(--border);
  padding-right: 1.5rem;
}`}
        />
        <CodeBlock
          filename={`src/app/dashboard/layout.${e}`}
          tsCode={`// src/app/dashboard/layout.tsx - layout level CSS for dashboard
import './page.css'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <div className="dashboard-grid">{children}</div>
}`}
          jsCode={`// src/app/dashboard/layout.jsx - layout level CSS for dashboard
import './page.css'

export default function DashboardLayout({ children }) {
  return <div className="dashboard-grid">{children}</div>
}`}
        />
        <Callout>
          Each route's CSS is only downloaded when that route is visited. A visitor on <C>/</C>{' '}
          will not download <C>dashboard/page.css</C>. Import CSS in the page or layout that uses
          it.
        </Callout>

        <H3 className="mb-3 mt-8">Blog Layout Example - Scoped CSS</H3>
        <P className="mb-4">
          When a layout imports a stylesheet, that CSS applies only to routes inside the layout's
          folder. Here, <C>blog.css</C> is imported in the blog layout:
        </P>
        <CodeBlock
          filename="src/app/blog/blog.css"
          code={`/* src/app/blog/blog.css - only for /blog/* */
.blog-wrapper {
  max-width: 720px;
  margin: 0 auto;
  padding: 2rem 1rem;
  line-height: 1.7;
}

.blog-wrapper h1 {
  font-size: 2rem;
  font-weight: 700;
}

.blog-wrapper article {
  color: var(--text);
}`}
        />
        <CodeBlock
          filename={`src/app/blog/layout.${e}`}
          tsCode={`// src/app/blog/layout.tsx - import here, scoped to /blog only
import './blog.css'

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <div className="blog-wrapper">{children}</div>
}`}
          jsCode={`// src/app/blog/layout.jsx - import here, scoped to /blog only
import './blog.css'

export default function BlogLayout({ children }) {
  return <div className="blog-wrapper">{children}</div>
}`}
        />
        <ScopeVisual
          title="Gets blog.css"
          ok
          urls={['/blog', '/blog/my-post', '/blog/category/tech']}
        />
        <ScopeVisual
          title="Does NOT get blog.css"
          ok={false}
          urls={['/', '/dashboard', '/about', '/docs']}
        />
        <Callout>
          With <C>blog.css</C> imported in <C>{`src/app/blog/layout.${e}`}</C>, only pages under{' '}
          <C>/blog</C> load it. If you import it in the root layout instead, every page loads it.
        </Callout>
      </Section>

      <Section id="component-css" title="Component CSS">
        <P className="mb-4">
          Keep a plain <C>.css</C> file next to a reusable component. You do not need CSS Modules
          for this. Just use clear class names so styles do not clash:
        </P>
        <CodeBlock
          filename="src/app/components/Button.css"
          code={`/* src/app/components/Button.css */
.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  border: 1px solid var(--border);
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.btn-primary {
  background: black;
  color: white;
}

.btn-primary:hover {
  background: #222;
}`}
        />
        <CodeBlock
          filename={`src/app/components/Button.${e}`}
          tsCode={`// src/app/components/Button.tsx
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import './Button.css'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
  children: ReactNode
}

export function Button({ variant = 'primary', children, ...props }: ButtonProps) {
  return <button className={\`btn btn-\${variant}\`} {...props}>{children}</button>
}`}
          jsCode={`// src/app/components/Button.jsx
import './Button.css'

export function Button({ variant = 'primary', children, ...props }) {
  return <button className={\`btn btn-\${variant}\`} {...props}>{children}</button>
}`}
        />
        <Callout>
          If you want class names that cannot clash with other files, use{' '}
          <DocLink to="/docs/css-modules">CSS Modules</DocLink> (<C>.module.css</C>). With plain
          CSS, prefix your class names: <C>btn-</C>, <C>card-</C>, and so on.
        </Callout>
      </Section>

      <Section id="external-stylesheets" title="External Stylesheets">
        <P className="mb-4">
          When you import CSS from an npm package, put the import in the route that uses it:
        </P>
        <CodeBlock
          filename={`src/app/docs/page.${e}`}
          tsCode={`// src/app/docs/page.tsx - only docs needs syntax highlighting
import 'prismjs/themes/prism.css'

export default function DocsPage() {
  return <article>...</article>
}`}
          jsCode={`// src/app/docs/page.jsx - only docs needs syntax highlighting
import 'prismjs/themes/prism.css'

export default function DocsPage() {
  return <article>...</article>
}`}
        />
        <CodeBlock
          filename={`src/app/blog/page.${e}`}
          tsCode={`// src/app/blog/page.tsx - only blog needs markdown styles
import './markdown.css'

export default function BlogPage() {
  return <div className="markdown-body">...</div>
}`}
          jsCode={`// src/app/blog/page.jsx - only blog needs markdown styles
import './markdown.css'

export default function BlogPage() {
  return <div className="markdown-body">...</div>
}`}
        />
        <Callout>
          Do not import external CSS in the root layout if only one route needs it. Import it in
          that route or its layout so other pages stay lean.
        </Callout>
      </Section>

      <Section id="css-ordering" title="CSS Ordering">
        <P className="mb-4">
          CSS applies in the order you import it. Keep a consistent order so later rules override
          earlier ones the way you expect:
        </P>
        <CodeBlock
          filename={`src/app/layout.${e}`}
          tsCode={`// layout.tsx - order matters
import './globals.css'      // 1. Base reset and variables first
import './theme.css'        // 2. Theme and utilities
// Route or component CSS comes after, imported inside page.tsx or component.tsx`}
          jsCode={`// layout.jsx - order matters
import './globals.css'      // 1. Base reset and variables first
import './theme.css'        // 2. Theme and utilities
// Route or component CSS comes after, imported inside page.jsx or component.jsx`}
        />
        <CodeBlock
          filename={`src/app/dashboard/page.${e}`}
          tsCode={`// src/app/dashboard/page.tsx
import './page.css'  // 3. Route-specific CSS - loaded only for this route

export default function DashboardPage() {
  return <div className="dashboard">...</div>
}`}
          jsCode={`// src/app/dashboard/page.jsx
import './page.css'  // 3. Route-specific CSS - loaded only for this route

export default function DashboardPage() {
  return <div className="dashboard">...</div>
}`}
        />
        <Callout>
          Import global CSS first, then layout CSS, then route CSS, then component CSS. That keeps
          overrides predictable.
        </Callout>
      </Section>

      <Section id="css-variables" title="CSS Variables">
        <P className="mb-4">
          CSS variables let you define a value once and reuse it everywhere. Define them in global
          CSS with <C>:root</C>, then read them with <C>var(--name)</C> in any rule:
        </P>
        <CodeBlock
          filename="src/app/globals.css"
          code={`/* src/app/globals.css */
:root {
  --bg: #ffffff;
  --text: #0a0a0a;
  --border: #e5e5e5;
  --radius: 0.5rem;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #000000;
    --text: #fafafa;
    --border: #262626;
  }
}

body {
  background: var(--bg);
  color: var(--text);
}`}
        />
        <CodeBlock
          filename="src/app/components/Card.css"
          code={`/* Use the variables in component CSS */
.card {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--bg);
  color: var(--text);
}`}
        />
      </Section>

      <Section id="sass-support" title="Sass/SCSS">
        <P className="mb-4">
          Vite supports Sass once you install the <C>sass</C> package. Import a <C>.scss</C> file
          the same way you import a <C>.css</C> file:
        </P>
        <MultiTerminal
          tabs={[
            { id: 'npm', label: 'npm', command: `$ npm install -D sass` },
            { id: 'pnpm', label: 'pnpm', command: `$ pnpm add -D sass` },
            { id: 'yarn', label: 'yarn', command: `$ yarn add -D sass` },
            { id: 'bun', label: 'bun', command: `$ bun add -d sass` },
          ]}
        />
        <CodeBlock
          filename="src/app/dashboard/page.scss"
          code={`/* src/app/dashboard/page.scss - only for dashboard */
.dashboard {
  display: grid;
  gap: 1rem;

  .card {
    padding: 1rem;
    border: 1px solid var(--border);
    border-radius: var(--radius);

    &:hover {
      border-color: black;
    }
  }
}`}
        />
        <CodeBlock
          filename={`src/app/dashboard/page.${e}`}
          tsCode={`// src/app/dashboard/page.tsx
import './page.scss'  // only dashboard loads this

export default function DashboardPage() {
  return <div className="dashboard">...</div>
}`}
          jsCode={`// src/app/dashboard/page.jsx
import './page.scss'  // only dashboard loads this

export default function DashboardPage() {
  return <div className="dashboard">...</div>
}`}
        />
      </Section>

      <Section id="css-in-js" title="CSS-in-JS Alternative">
        <P className="mb-4">
          If you prefer CSS-in-JS, install the library and use it in the components that need it:
        </P>
        <MultiTerminal
          tabs={[
            { id: 'npm', label: 'npm', command: `$ npm install styled-components` },
            { id: 'pnpm', label: 'pnpm', command: `$ pnpm add styled-components` },
            { id: 'yarn', label: 'yarn', command: `$ yarn add styled-components` },
            { id: 'bun', label: 'bun', command: `$ bun add styled-components` },
          ]}
        />
        <CodeBlock
          filename={`src/app/components/StyledButton.${e}`}
          tsCode={`// src/app/components/StyledButton.tsx
import type { ReactNode } from 'react'
import styled from 'styled-components'

const Button = styled.button\`
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background: black;
  color: white;
\`

export function StyledButton({ children }: { children: ReactNode }) {
  return <Button>{children}</Button>
}`}
          jsCode={`// src/app/components/StyledButton.jsx
import styled from 'styled-components'

const Button = styled.button\`
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background: black;
  color: white;
\`

export function StyledButton({ children }) {
  return <Button>{children}</Button>
}`}
        />
        <Callout>
          For most projects, plain CSS imported per route is simpler and faster. Reach for
          CSS-in-JS when you need styles that change based on component props.
        </Callout>
      </Section>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link to="/docs/css-modules" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">CSS Modules</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Scoped class names with .module.css.</p>
        </Link>
        <Link to="/docs/tailwind" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Tailwind CSS</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Utility-first styling with Tailwind.</p>
        </Link>
        <Link to="/docs/layouts-and-pages" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Layouts and Pages</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Where to import CSS in the app directory.</p>
        </Link>
        <Link to="/docs/env-api" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Using in API Routes</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Read env vars from Hono handlers.</p>
        </Link>
      </div>
    </>
  )
}

export default function CSSPage() {
  return (
    <DocPage
      title="Plain CSS"
      description="Use plain CSS in Bini.js - import only what you need, where you need it."
      url="https://bini.js.org/docs/css"
      editUrl="https://github.com/Binidu01/bini-official/edit/main/src/app/docs/css.tsx"
      toc={TOC_ITEMS}
      prev={{ to: '/docs/env-api', title: 'Using in API Routes' }}
      next={{ to: '/docs/tailwind', title: 'Tailwind CSS' }}
    >
      <Content />
    </DocPage>
  )
}