// src/pages/docs/css-modules/page.tsx
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
  { id: 'basic-usage', label: 'Basic Usage' },
  { id: 'combining-classes', label: 'Combining Classes' },
  { id: 'using-clsx', label: 'Using clsx for Cleaner Code' },
  { id: 'global-vs-local', label: 'Global vs Local Scope' },
  { id: 'composing-classes', label: 'Composing Classes' },
  { id: 'css-variables', label: 'CSS Variables in Modules' },
  { id: 'animations', label: 'Animations' },
  { id: 'media-queries', label: 'Media Queries' },
  { id: 'complete-example', label: 'Complete Example' },
]

const PAGE_TITLE = 'CSS Modules'
const PAGE_URL = 'https://bini.js.org/docs/css-modules'
const EDIT_URL = 'https://github.com/Binidu01/bini-offical/edit/main/src/app/docs/css-modules.tsx'

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
// CSS Modules Page
// ────────────────────────────────────────────────────────────────────────────────
export default function CSSModulesPage() {
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
                    <p className="text-slate-400 text-sm">Learn how to use CSS Modules in Bini.js for component-scoped styling.</p>
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
                    CSS Modules allow you to write component-scoped CSS without worrying about naming conflicts. Vite processes <code className="text-cyan-400">.module.css</code> files automatically — no configuration needed.
                  </p>
                  <Note>
                    <strong>Zero Configuration:</strong> Vite handles CSS Modules natively. Any file ending in <code>.module.css</code> is automatically processed as a CSS Module.
                  </Note>
                </m.section>

                {/* Basic Usage */}
                <m.section id="basic-usage" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Basic Usage</h2>
                  <p className="text-slate-300 mb-4">
                    Create a <code className="text-cyan-400">.module.css</code> file and import it in your component:
                  </p>
                  <CodeBlock 
                    code={`/* src/app/components/Button.module.css */
.button {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.primary {
  background: #06b6d4;
  color: black;
  border: none;
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
                </m.section>

                {/* Combining Classes */}
                <m.section id="combining-classes" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Combining Classes</h2>
                  <p className="text-slate-300 mb-4">
                    Combine multiple CSS Module classes using template literals:
                  </p>
                  <CodeBlock 
                    code={`/* src/app/components/Card.module.css */
.card {
  background: #0a0a0a;
  border: 1px solid #1e293b;
  border-radius: 0.75rem;
  padding: 1.5rem;
}

.featured {
  border-color: #06b6d4;
}

.large {
  padding: 2rem;
}`}
                    filename="Card.module.css"
                  />
                  <CodeBlock 
                    code={`// src/app/components/Card.tsx
import styles from './Card.module.css'

export function Card({ featured, size = 'normal', children }) {
  return (
    <div className={\`\${styles.card} \${featured ? styles.featured : ''} \${size === 'large' ? styles.large : ''}\`}>
      {children}
    </div>
  )
}`}
                    filename="Card.tsx"
                  />
                  <Note>
                    Use the <code>clsx</code> or <code>classnames</code> library for cleaner conditional class composition.
                  </Note>
                </m.section>

                {/* Using clsx */}
                <m.section id="using-clsx" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Using clsx for Cleaner Code</h2>
                  <p className="text-slate-300 mb-4">
                    Install <code className="text-cyan-400">clsx</code> for cleaner conditional classes:
                  </p>
                  <CodeBlock 
                    code={`npm install clsx`}
                  />
                  <CodeBlock 
                    code={`// src/app/components/Card.tsx
import clsx from 'clsx'
import styles from './Card.module.css'

export function Card({ featured, size = 'normal', children }) {
  return (
    <div className={clsx(
      styles.card,
      featured && styles.featured,
      size === 'large' && styles.large
    )}>
      {children}
    </div>
  )
}`}
                    filename="Card.tsx"
                  />
                </m.section>

                {/* Global vs Local */}
                <m.section id="global-vs-local" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Global vs Local Scope</h2>
                  <p className="text-slate-300 mb-4">
                    CSS Modules are locally scoped by default. Use <code className="text-cyan-400">:global</code> to target global selectors:
                  </p>
                  <CodeBlock 
                    code={`/* src/app/components/Container.module.css */
.container {
  max-width: 1200px;
  margin: 0 auto;
}

.container :global(.heading) {
  margin-bottom: 1rem;
}

:global(.dark) .container {
  background: #000;
}`}
                    filename="Container.module.css"
                  />
                </m.section>

                {/* Composing Classes */}
                <m.section id="composing-classes" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Composing Classes</h2>
                  <p className="text-slate-300 mb-4">
                    Use <code className="text-cyan-400">composes</code> to reuse styles from other classes:
                  </p>
                  <CodeBlock 
                    code={`/* src/app/components/Form.module.css */
.baseInput {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #334155;
  background: #0a0a0a;
  color: white;
}

.textInput {
  composes: baseInput;
}

.errorInput {
  composes: baseInput;
  border-color: #ef4444;
}`}
                    filename="Form.module.css"
                  />
                </m.section>

                {/* CSS Variables */}
                <m.section id="css-variables" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">CSS Variables in Modules</h2>
                  <p className="text-slate-300 mb-4">
                    Use CSS variables for dynamic styling within modules:
                  </p>
                  <CodeBlock 
                    code={`/* src/app/components/Progress.module.css */
.bar {
  height: 100%;
  width: var(--progress);
  background: linear-gradient(to right, #06b6d4, #3b82f6);
  transition: width 0.3s ease;
}`}
                    filename="Progress.module.css"
                  />
                  <CodeBlock 
                    code={`// src/app/components/Progress.tsx
import styles from './Progress.module.css'

export function Progress({ value, max = 100 }) {
  const percentage = (value / max) * 100
  
  return (
    <div className={styles.progress}>
      <div 
        className={styles.bar} 
        style={{ '--progress': \`\${percentage}%\` } as React.CSSProperties}
      />
    </div>
  )
}`}
                    filename="Progress.tsx"
                  />
                </m.section>

                {/* Animations */}
                <m.section id="animations" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Animations</h2>
                  <p className="text-slate-300 mb-4">
                    Define animations in CSS Modules:
                  </p>
                  <CodeBlock 
                    code={`/* src/app/components/Spinner.module.css */
.spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid #1e293b;
  border-top-color: #06b6d4;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}`}
                    filename="Spinner.module.css"
                  />
                  <CodeBlock 
                    code={`// src/app/components/Spinner.tsx
import styles from './Spinner.module.css'

export function Spinner() {
  return <div className={styles.spinner} />
}`}
                    filename="Spinner.tsx"
                  />
                </m.section>

                {/* Media Queries */}
                <m.section id="media-queries" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Media Queries</h2>
                  <p className="text-slate-300 mb-4">
                    Write responsive styles with media queries:
                  </p>
                  <CodeBlock 
                    code={`/* src/app/components/Grid.module.css */
.grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
}

@media (min-width: 640px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}`}
                    filename="Grid.module.css"
                  />
                </m.section>

                {/* Complete Example */}
                <m.section id="complete-example" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Complete Example</h2>
                  <p className="text-slate-300 mb-4">
                    A full-featured modal component using CSS Modules:
                  </p>
                  <CodeBlock 
                    code={`/* src/app/components/Modal.module.css */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  background: #0a0a0a;
  border: 1px solid #1e293b;
  border-radius: 1rem;
  padding: 1.5rem;
  max-width: 500px;
  width: 90%;
}

.title {
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
}

.close {
  background: transparent;
  color: #94a3b8;
  border: none;
  cursor: pointer;
}

.close:hover {
  color: white;
}`}
                    filename="Modal.module.css"
                  />
                  <CodeBlock 
                    code={`// src/app/components/Modal.tsx
import styles from './Modal.module.css'

export function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={styles.title}>{title}</h2>
          <button className={styles.close} onClick={onClose}>✕</button>
        </div>
        <div className="text-slate-400">{children}</div>
      </div>
    </div>
  )
}`}
                    filename="Modal.tsx"
                  />
                </m.section>

                {/* Previous / Next Navigation */}
                <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex items-center justify-between pt-8 mt-8 border-t border-slate-800">
                  <Link to="/docs/tailwind" className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <div>
                      <div className="text-xs text-slate-500">Previous</div>
                      <div className="text-sm font-medium">Tailwind CSS</div>
                    </div>
                  </Link>
                  <Link to="/docs/platform-web" className="group flex items-center gap-2 text-right text-slate-400 hover:text-white transition-colors">
                    <div>
                      <div className="text-xs text-slate-500">Next</div>
                      <div className="text-sm font-medium">Web</div>
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