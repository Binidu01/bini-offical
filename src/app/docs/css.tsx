// src/pages/docs/css/page.tsx
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
  { id: 'styling-options', label: 'Styling Options' },
  { id: 'tailwind-css', label: 'Tailwind CSS v4' },
  { id: 'css-modules', label: 'CSS Modules' },
  { id: 'global-css', label: 'Global CSS' },
  { id: 'none-option', label: 'None Option' },
  { id: 'external-stylesheets', label: 'External Stylesheets' },
  { id: 'css-ordering', label: 'CSS Ordering' },
  { id: 'sass-support', label: 'Sass/SCSS Support' },
  { id: 'css-in-js', label: 'CSS-in-JS' },
  { id: 'css-variables', label: 'CSS Variables for Theming' },
]

const PAGE_TITLE = 'CSS'
const PAGE_URL = 'https://bini.js.org/docs/css'
const EDIT_URL = 'https://github.com/Binidu01/bini-offical/edit/main/src/app/docs/css.tsx'

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
function Table({ headers, rows }: { headers: string[]; rows: React.ReactNode[][] }) {
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
// Note Component
// ────────────────────────────────────────────────────────────────────────────────
function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800 my-6">
      <div className="text-sm text-slate-300 [&>strong]:text-white [&>code]:text-cyan-400 [&>code]:bg-slate-800 [&>code]:px-1 [&>code]:py-0.5 [&>code]:rounded">{children}</div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────────
// CSS Page
// ────────────────────────────────────────────────────────────────────────────────
export default function CSSPage() {
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
                    <p className="text-slate-400 text-sm">Learn about the different ways to add CSS to your Bini.js application.</p>
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
                    Bini.js provides several ways to style your application. You can use Tailwind CSS v4 (default), CSS Modules, or plain CSS — choose what works best for your project.
                  </p>
                </m.section>

                {/* Styling Options */}
                <m.section id="styling-options" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Styling Options</h2>
                  <Table 
                    headers={['Option', 'Description', 'Best For']}
                    rows={[
                      ['Tailwind CSS v4', 'Utility-first CSS framework with Vite plugin (default)', 'Rapid development, consistent design'],
                      ['CSS Modules', 'Locally scoped CSS by default', 'Component-specific styles, avoiding conflicts'],
                      ['Global CSS', 'Traditional stylesheet applied globally', 'Base styles, resets, utilities'],
                      ['None', 'No styling — bring your own', 'Custom setups, CSS-in-JS libraries'],
                    ]}
                  />
                </m.section>

                {/* Tailwind CSS v4 */}
                <m.section id="tailwind-css" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Tailwind CSS v4</h2>
                  <p className="text-slate-300 mb-4">
                    Tailwind CSS v4 is pre-configured using the official Vite plugin. No PostCSS configuration needed — it just works.
                  </p>
                  <Note>
                    <strong>Zero Configuration:</strong> Bini.js uses the <code>@tailwindcss/vite</code> plugin. Everything is configured automatically — no <code>postcss.config.js</code> or <code>tailwind.config.js</code> required.
                  </Note>
                  <CodeBlock 
                    code={`// src/app/page.tsx
export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-cyan-400">
        Welcome to Bini.js!
      </h1>
      <p className="mt-4 text-lg text-slate-400">
        Styled with Tailwind CSS v4
      </p>
      <button className="mt-6 rounded-lg bg-cyan-500 px-4 py-2 text-black hover:bg-cyan-400">
        Get Started
      </button>
    </div>
  )
}`}
                    filename="app/page.tsx"
                  />
                  <p className="text-slate-300 mt-4">
                    The global CSS file simply imports Tailwind:
                  </p>
                  <CodeBlock 
                    code={`/* src/app/globals.css */
@import 'tailwindcss';`}
                    filename="app/globals.css"
                  />
                  <p className="text-slate-300 mt-4">
                    The Vite config includes the Tailwind plugin automatically:
                  </p>
                  <CodeBlock 
                    code={`// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { biniroute } from 'bini-router'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),  // Automatically added when Tailwind is selected
    biniroute(),
  ],
})`}
                    filename="vite.config.ts"
                  />
                </m.section>

                {/* CSS Modules */}
                <m.section id="css-modules" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">CSS Modules</h2>
                  <p className="text-slate-300 mb-4">
                    CSS Modules scope styles locally to avoid naming conflicts. Files must end with <code className="text-cyan-400">.module.css</code>:
                  </p>
                  <CodeBlock 
                    code={`/* src/app/components/Button.module.css */
.button {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s;
}

.primary {
  background: #06b6d4;
  color: black;
}

.primary:hover {
  background: #0891b2;
}`}
                    filename="Button.module.css"
                  />
                  <CodeBlock 
                    code={`// src/app/components/Button.tsx
import styles from './Button.module.css'

export function Button({ variant = 'primary', children }) {
  return (
    <button className={\`\${styles.button} \${styles[variant]}\`}>
      {children}
    </button>
  )
}`}
                    filename="Button.tsx"
                  />
                  <Note>
                    CSS Modules are processed by Vite automatically — no configuration needed.
                  </Note>
                </m.section>

                {/* Global CSS */}
                <m.section id="global-css" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Global CSS</h2>
                  <p className="text-slate-300 mb-4">
                    Import CSS files directly to apply styles globally:
                  </p>
                  <CodeBlock 
                    code={`/* src/app/globals.css */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  background: black;
  color: white;
}`}
                    filename="app/globals.css"
                  />
                  <CodeBlock 
                    code={`// src/app/layout.tsx
import './globals.css'

export default function RootLayout() {
  return <Outlet />
}`}
                    filename="app/layout.tsx"
                  />
                </m.section>

                {/* None Option */}
                <m.section id="none-option" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">None Option</h2>
                  <p className="text-slate-300 mb-4">
                    Choose <code className="text-cyan-400">--none</code> during project creation for a clean slate:
                  </p>
                  <CodeBlock 
                    code={`npx create-bini-app@latest my-app --none`}
                  />
                  <Note>
                    Even with <code>--none</code>, Vite still handles <code>.css</code> imports natively. You can add any CSS file and it will work.
                  </Note>
                </m.section>

                {/* External Stylesheets */}
                <m.section id="external-stylesheets" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">External Stylesheets</h2>
                  <p className="text-slate-300 mb-4">
                    Import styles from npm packages or external URLs:
                  </p>
                  <CodeBlock 
                    code={`// src/app/layout.tsx
import 'bootstrap/dist/css/bootstrap.min.css'
import 'animate.css'

export default function RootLayout() {
  return <Outlet />
}`}
                    filename="app/layout.tsx"
                  />
                </m.section>

                {/* CSS Ordering */}
                <m.section id="css-ordering" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">CSS Ordering</h2>
                  <p className="text-slate-300 mb-4">
                    CSS is applied in the order you import it:
                  </p>
                  <CodeBlock 
                    code={`import './globals.css'        // Base styles first
import './utilities.css'      // Utilities second
import styles from './Component.module.css'  // Component styles last`}
                  />
                  <Note>
                    Keep CSS imports in a consistent order to avoid specificity issues. Global styles → utilities → component styles.
                  </Note>
                </m.section>

                {/* Sass/SCSS Support */}
                <m.section id="sass-support" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Sass/SCSS Support</h2>
                  <p className="text-slate-300 mb-4">
                    Vite has built-in support for Sass:
                  </p>
                  <CodeBlock 
                    code={`npm install -D sass`}
                  />
                  <CodeBlock 
                    code={`/* src/app/components/Card.module.scss */
.card {
  background: #0a0a0a;
  border: 1px solid #1e293b;
  padding: 1.5rem;
  border-radius: 0.75rem;
  
  &:hover {
    border-color: #06b6d4;
  }
}`}
                    filename="Card.module.scss"
                  />
                  <Note>
                    Vite handles Sass compilation automatically. No additional configuration needed.
                  </Note>
                </m.section>

                {/* CSS-in-JS */}
                <m.section id="css-in-js" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">CSS-in-JS</h2>
                  <p className="text-slate-300 mb-4">
                    Use CSS-in-JS libraries with the <code className="text-cyan-400">--none</code> option:
                  </p>
                  <CodeBlock 
                    code={`npm install styled-components`}
                  />
                  <CodeBlock 
                    code={`// src/app/components/StyledButton.tsx
import styled from 'styled-components'

const Button = styled.button\`
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background: #06b6d4;
  color: black;
  cursor: pointer;
  
  &:hover {
    background: #0891b2;
  }
\`

export function StyledButton({ children }) {
  return <Button>{children}</Button>
}`}
                    filename="StyledButton.tsx"
                  />
                </m.section>

                {/* CSS Variables */}
                <m.section id="css-variables" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">CSS Variables for Theming</h2>
                  <p className="text-slate-300 mb-4">
                    Define CSS variables for consistent theming:
                  </p>
                  <CodeBlock 
                    code={`/* src/app/globals.css */
:root {
  --bg-primary: #000000;
  --text-primary: #ffffff;
  --accent: #06b6d4;
  --border: #1e293b;
}

@media (prefers-color-scheme: light) {
  :root {
    --bg-primary: #ffffff;
    --text-primary: #0f172a;
    --border: #e2e8f0;
  }
}

body {
  background: var(--bg-primary);
  color: var(--text-primary);
}`}
                    filename="app/globals.css"
                  />
                </m.section>

                {/* Previous / Next Navigation */}
                <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }} className="flex items-center justify-between pt-8 mt-8 border-t border-slate-800">
                  <Link to="/docs/env-api" className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <div>
                      <div className="text-xs text-slate-500">Previous</div>
                      <div className="text-sm font-medium">Using in API Routes</div>
                    </div>
                  </Link>
                  <Link to="/docs/tailwind" className="group flex items-center gap-2 text-right text-slate-400 hover:text-white transition-colors">
                    <div>
                      <div className="text-xs text-slate-500">Next</div>
                      <div className="text-sm font-medium">Tailwind CSS</div>
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