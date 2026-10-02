// src/app/docs/css.tsx
import { Globe } from 'lucide-react'

import {
  C,
  Callout,
  CodeBlock,
  DocLink,
  DocPage,
  H3,
  MultiTerminal,
  P,
  PromptOutput,
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

/* ---------- content (reads the TS/JS choice from DocPage) ---------- */

function Content() {
  const lang = useDocLang()
  const e = lang === 'js' ? 'jsx' : 'tsx'

  return (
    <>
      <Section id="plain-css" title="Plain CSS in Bini.js">
        <P className="mb-4">
          Bini.js supports plain <C>.css</C> files natively via Vite. No config needed - just
          import a <C>.css</C> file and it works. This page covers plain CSS only.
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
          Or use the interactive prompt and select <C>None</C> under the styling question:
        </P>
        <PromptOutput
          lines={[
            { kind: 'question', text: 'Select a styling solution:' },
            { kind: 'option', text: 'Tailwind CSS' },
            { kind: 'option', text: 'CSS Modules' },
            { kind: 'option', text: 'None', selected: true },
            { kind: 'blank' },
            { kind: 'hint', text: '↑↓ navigate • ⏎ select' },
          ]}
        />
      </Section>

      <Section id="global-css" title="Global CSS">
        <P className="mb-4">
          For base styles, resets, and utilities that should apply everywhere, import a global
          stylesheet in your root layout:
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
          Keep global CSS minimal - only resets, CSS variables, and truly global utilities. Route
          and component specific styles should be imported closer to where they are used.
        </Callout>
      </Section>

      <Section id="route-css" title="CSS for Specific Routes">
        <P className="mb-4">
          Import CSS only for the routes that need it. This keeps bundles small and avoids loading
          unused styles. Each route can have its own stylesheet:
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
          Route-level CSS is code-split automatically by Vite. A user visiting <C>/</C> will not
          download <C>dashboard/page.css</C>. Import CSS as close as possible to the route that
          uses it.
        </Callout>

        <H3 className="mb-3 mt-8">Blog Layout Example - Scoped CSS</H3>
        <P className="mb-4">
          If your blogs layout has a <C>blog.css</C>, that CSS only applies to routes inside the{' '}
          <C>blog</C> folder. Other routes do not get it:
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
          <strong>How it works:</strong> Vite code-splits by route. When you visit <C>/</C>, Vite
          loads only <C>globals.css</C> + <C>/(marketing)/page.css</C>. When you visit{' '}
          <C>/blog</C>, the <C>{`blog/layout.${e}`}</C> chain is loaded, so <C>blog.css</C> is
          included. If you import <C>blog.css</C> in the root <C>{`src/app/layout.${e}`}</C>{' '}
          instead, every route would get it - avoid that for scoped styles.
        </Callout>
      </Section>

      <Section id="component-css" title="Component CSS">
        <P className="mb-4">
          For reusable components, keep a plain <C>.css</C> file next to the component. This still
          works without CSS Modules - just use clear naming to avoid conflicts:
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
import './Button.css'

export function Button({ variant = 'primary', children, ...props }: any) {
  return <button className={\`btn btn-\${variant}\`} {...props}>{children}</button>
}`}
          jsCode={`// src/app/components/Button.jsx
import './Button.css'

export function Button({ variant = 'primary', children, ...props }) {
  return <button className={\`btn btn-\${variant}\`} {...props}>{children}</button>
}`}
        />
        <Callout>
          If you need scoped styles to avoid conflicts, use{' '}
          <DocLink to="/docs/css-modules">CSS Modules</DocLink> (<C>.module.css</C>) instead. For
          plain CSS, use BEM or prefixed class names like <C>btn-</C>, <C>card-</C>.
        </Callout>
      </Section>

      <Section id="external-stylesheets" title="External Stylesheets">
        <P className="mb-4">Import CSS from npm packages only in routes that need them:</P>
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
          Do not import external CSS globally if only one route needs it. Import it in the specific
          route or layout to keep other routes lean.
        </Callout>
      </Section>

      <Section id="css-ordering" title="CSS Ordering">
        <P className="mb-4">CSS is applied in the order you import it. Keep a consistent order:</P>
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
          Global to specific: <C>globals.css</C> first, then layout CSS, then route CSS, then
          component CSS. This avoids specificity surprises.
        </Callout>
      </Section>

      <Section id="css-variables" title="CSS Variables">
        <P className="mb-4">
          Use CSS variables for theming - define them once in global CSS, use everywhere:
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
      </Section>

      <Section id="sass-support" title="Sass/SCSS">
        <P className="mb-4">
          Vite supports Sass out of the box. Install and use <C>.scss</C> only where needed:
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
          tsCode={`import './page.scss'  // only dashboard loads this

export default function DashboardPage() {
  return <div className="dashboard">...</div>
}`}
          jsCode={`import './page.scss'  // only dashboard loads this

export default function DashboardPage() {
  return <div className="dashboard">...</div>
}`}
        />
      </Section>

      <Section id="css-in-js" title="CSS-in-JS Alternative">
        <P className="mb-4">
          If you prefer CSS-in-JS, use plain CSS setup (<C>--none</C>) and install your library.
          Only load it in routes that need it:
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
import styled from 'styled-components'

const Button = styled.button\`
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background: black;
  color: white;
\`

export function StyledButton({ children }: any) {
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
          For most projects, plain CSS with route-level imports is simpler and faster. Use
          CSS-in-JS only when you need dynamic theming based on props.
        </Callout>
      </Section>
    </>
  )
}

/* ---------- page ---------- */

export default function CSSPage() {
  return (
    <DocPage
      title="Plain CSS"
      description="Use plain CSS in Bini.js - import only what you need, where you need it. No framework required."
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