// src/pages/docs/tailwind/page.tsx
import React from 'react'
import { motion } from 'framer-motion'
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
  { id: 'setup', label: 'Setup' },
  { id: 'basic-usage', label: 'Basic Usage' },
  { id: 'v4-features', label: 'Tailwind CSS v4 Features' },
  { id: 'theming', label: 'Theming with CSS Variables' },
  { id: 'responsive', label: 'Responsive Design' },
  { id: 'dark-mode', label: 'Dark Mode' },
  { id: 'custom-utilities', label: 'Custom Utilities' },
  { id: 'common-patterns', label: 'Common Patterns' },
]

const PAGE_TITLE = 'Tailwind CSS'
const PAGE_URL = 'https://bini.js.org/docs/tailwind'
const EDIT_URL = 'https://github.com/Binidu01/bini-offical/edit/main/src/app/docs/tailwind.tsx'

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
// Tailwind CSS Page
// ────────────────────────────────────────────────────────────────────────────────
export default function TailwindPage() {
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
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start justify-between gap-4 mb-4"
                >
                  <div>
                    <h1 className="text-4xl font-bold text-white mb-2">{PAGE_TITLE}</h1>
                    <p className="text-slate-400 text-sm">Learn how to use Tailwind CSS v4 in your Bini.js application with zero configuration.</p>
                  </div>
                  <div className="shrink-0 pt-2 hidden sm:block">
                    <CopyPageButton pageUrl={PAGE_URL} pageTitle={PAGE_TITLE} />
                  </div>
                </motion.div>
                {/* Copy button on small screens */}
                <div className="sm:hidden mb-8">
                  <CopyPageButton pageUrl={PAGE_URL} pageTitle={PAGE_TITLE} />
                </div>

                {/* Overview */}
                <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <p className="text-slate-300 mb-6">
                    Tailwind CSS v4 is the default styling option in Bini.js. It's pre-configured using the official Vite plugin — no PostCSS configuration needed.
                  </p>
                  <Note>
                    <strong>Zero Configuration:</strong> Bini.js uses the <code>@tailwindcss/vite</code> plugin. Everything works out of the box — no <code>postcss.config.js</code> or <code>tailwind.config.js</code> required.
                  </Note>
                </motion.section>

                {/* Setup */}
                <motion.section id="setup" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Setup</h2>
                  <p className="text-slate-300 mb-4">
                    When you create a new Bini.js project with Tailwind, everything is configured automatically:
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
    tailwindcss(),  // Automatically added
    biniroute(),
  ],
})`}
                    filename="vite.config.ts"
                  />
                  <CodeBlock 
                    code={`/* src/app/globals.css */
@import 'tailwindcss';`}
                    filename="app/globals.css"
                  />
                </motion.section>

                {/* Basic Usage */}
                <motion.section id="basic-usage" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Basic Usage</h2>
                  <p className="text-slate-300 mb-4">
                    Use Tailwind's utility classes directly in your components:
                  </p>
                  <CodeBlock 
                    code={`// src/app/page.tsx
export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black">
      <h1 className="bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-4xl font-bold text-transparent">
        Welcome to Bini.js
      </h1>
      <p className="mt-4 text-lg text-slate-400">
        Styled with Tailwind CSS v4
      </p>
      <button className="mt-6 rounded-lg bg-cyan-500 px-4 py-2 font-medium text-black hover:bg-cyan-400 transition-colors">
        Get Started
      </button>
    </div>
  )
}`}
                    filename="app/page.tsx"
                  />
                </motion.section>

                {/* Tailwind v4 Features */}
                <motion.section id="v4-features" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Tailwind CSS v4 Features</h2>
                  <Table 
                    headers={['Feature', 'Description']}
                    rows={[
                      ['Vite Plugin', 'Native Vite integration — no PostCSS config needed'],
                      ['CSS-first config', 'Configure via CSS variables instead of JS'],
                      ['Lightning CSS', 'Faster builds with Lightning CSS'],
                      ['Simplified setup', 'Just @import "tailwindcss" — that\'s it'],
                    ]}
                  />
                </motion.section>

                {/* Theming */}
                <motion.section id="theming" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Theming with CSS Variables</h2>
                  <p className="text-slate-300 mb-4">
                    Tailwind v4 uses CSS variables for theming:
                  </p>
                  <CodeBlock 
                    code={`/* src/app/globals.css */
@import 'tailwindcss';

@theme {
  --color-primary: #06b6d4;
  --color-primary-dark: #0891b2;
  --font-sans: 'Inter', system-ui, sans-serif;
  --radius-card: 1rem;
}`}
                    filename="app/globals.css"
                  />
                  <CodeBlock 
                    code={`// src/app/components/Card.tsx
export function Card({ children }) {
  return (
    <div className="rounded-(--radius-card) bg-primary p-6">
      {children}
    </div>
  )
}`}
                    filename="Card.tsx"
                  />
                </motion.section>

                {/* Responsive */}
                <motion.section id="responsive" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Responsive Design</h2>
                  <p className="text-slate-300 mb-4">
                    Use Tailwind's responsive prefixes to adapt your layout:
                  </p>
                  <CodeBlock 
                    code={`// src/app/page.tsx
export default function ResponsivePage() {
  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-lg bg-slate-900 p-4">
            <h2 className="text-lg font-semibold text-white sm:text-xl">
              Card {i + 1}
            </h2>
          </div>
        ))}
      </div>
    </div>
  )
}`}
                    filename="app/page.tsx"
                  />
                  <Table 
                    headers={['Breakpoint', 'Min Width']}
                    rows={[
                      ['sm', '640px'],
                      ['md', '768px'],
                      ['lg', '1024px'],
                      ['xl', '1280px'],
                      ['2xl', '1536px'],
                    ]}
                  />
                </motion.section>

                {/* Dark Mode */}
                <motion.section id="dark-mode" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Dark Mode</h2>
                  <p className="text-slate-300 mb-4">
                    Use the <code className="text-cyan-400">dark:</code> variant for dark mode:
                  </p>
                  <CodeBlock 
                    code={`// src/app/components/ThemeToggle.tsx
export function ThemeToggle() {
  return (
    <div className="rounded-lg bg-white p-4 dark:bg-slate-900">
      <h2 className="text-slate-900 dark:text-white">
        Theme Aware Component
      </h2>
      <p className="text-slate-600 dark:text-slate-400">
        This adapts to light and dark mode
      </p>
    </div>
  )
}`}
                    filename="ThemeToggle.tsx"
                  />
                </motion.section>

                {/* Custom Utilities */}
                <motion.section id="custom-utilities" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Custom Utilities</h2>
                  <p className="text-slate-300 mb-4">
                    Create custom utilities using <code className="text-cyan-400">@utility</code>:
                  </p>
                  <CodeBlock 
                    code={`/* src/app/globals.css */
@import 'tailwindcss';

@utility text-gradient {
  background: linear-gradient(to right, var(--tw-gradient-stops));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

@utility card-hover {
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
}`}
                    filename="app/globals.css"
                  />
                  <CodeBlock 
                    code={`// Using custom utilities
export function FeatureCard() {
  return (
    <div className="card-hover rounded-lg bg-slate-900 p-6">
      <h3 className="text-gradient from-cyan-400 to-blue-500 text-xl font-bold">
        Custom Utility
      </h3>
    </div>
  )
}`}
                  />
                </motion.section>

                {/* Common Patterns */}
                <motion.section id="common-patterns" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Common Patterns</h2>
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Container</h3>
                  <CodeBlock 
                    code={`<div className="container mx-auto px-4">
  {/* Content */}
</div>`}
                  />
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Flex Center</h3>
                  <CodeBlock 
                    code={`<div className="flex items-center justify-center">
  {/* Centered content */}
</div>`}
                  />
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Grid Layout</h3>
                  <CodeBlock 
                    code={`<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
  {/* Grid items */}
</div>`}
                  />
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Button Styles</h3>
                  <CodeBlock 
                    code={`// Primary
<button className="rounded-lg bg-cyan-500 px-4 py-2 font-medium text-black hover:bg-cyan-400">
  Primary
</button>

// Secondary
<button className="rounded-lg border border-slate-700 px-4 py-2 text-white hover:bg-slate-900">
  Secondary
</button>`}
                  />
                </motion.section>

                {/* Previous / Next Navigation */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="flex items-center justify-between pt-8 mt-8 border-t border-slate-800">
                  <Link to="/docs/css" className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <div>
                      <div className="text-xs text-slate-500">Previous</div>
                      <div className="text-sm font-medium">CSS Overview</div>
                    </div>
                  </Link>
                  <Link to="/docs/css-modules" className="group flex items-center gap-2 text-right text-slate-400 hover:text-white transition-colors">
                    <div>
                      <div className="text-xs text-slate-500">Next</div>
                      <div className="text-sm font-medium">CSS Modules</div>
                    </div>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>

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