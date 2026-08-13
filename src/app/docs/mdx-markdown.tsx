// src/pages/docs/mdx-markdown/page.tsx
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
  { id: 'what-is-mdx', label: 'What is MDX?' },
  { id: 'mdx-pages', label: 'MDX Pages' },
  { id: 'markdown-pages', label: 'Markdown Pages' },
  { id: 'metadata-in-mdx', label: 'Metadata in MDX' },
  { id: 'imports-in-mdx', label: 'Imports in MDX' },
  { id: 'extension-priority', label: 'Extension Priority' },
  { id: 'styling-mdx', label: 'Styling MDX Content' },
  { id: 'mdx-configuration', label: 'MDX Configuration' },
  { id: 'complete-example', label: 'Complete Example' },
]

const PAGE_TITLE = 'MDX and Markdown'
const PAGE_URL = 'https://bini.js.org/docs/mdx-markdown'
const EDIT_URL = 'https://github.com/Binidu01/bini-offical/edit/main/src/app/docs/mdx-markdown.tsx'

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
// MDX and Markdown Page
// ────────────────────────────────────────────────────────────────────────────────
export default function MdxMarkdownPage() {
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
                    <p className="text-slate-400 text-sm">Learn how to use MDX and Markdown for content routes in Bini.js.</p>
                  </div>
                  <div className="shrink-0 pt-2 hidden sm:block">
                    <CopyPageButton pageUrl={PAGE_URL} pageTitle={PAGE_TITLE} />
                  </div>
                </motion.div>
                {/* Copy button on small screens */}
                <div className="sm:hidden mb-8">
                  <CopyPageButton pageUrl={PAGE_URL} pageTitle={PAGE_TITLE} />
                </div>

                {/* What is MDX? */}
                <motion.section id="what-is-mdx" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">What is MDX?</h2>
                  <p className="text-slate-300 mb-4">
                    MDX is an extension to Markdown that allows you to write JSX components directly in your Markdown files. Bini.js supports <code className="text-cyan-400">.mdx</code> and <code className="text-cyan-400">.md</code> files as content routes out of the box.
                  </p>
                  <p className="text-slate-300 mb-4">
                    <code className="text-cyan-400">@mdx-js/rollup</code> is bundled internally, so no separate installation or Vite configuration is required. This makes it easy to create rich, interactive content pages.
                  </p>
                </motion.section>

                {/* MDX Pages */}
                <motion.section id="mdx-pages" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">MDX Pages</h2>
                  <p className="text-slate-300 mb-4">
                    Create an MDX page by adding a <code className="text-cyan-400">.mdx</code> file anywhere in <code className="text-cyan-400">src/app/</code>. The file is compiled to a React component and rendered as a page.
                  </p>
                  <CodeBlock 
                    code={`src/app/
├── about.mdx              → /about
├── blog/
│   ├── page.mdx           → /blog
│   └── [slug].mdx         → /blog/:slug
└── contact.mdx            → /contact`}
                  />
                  <CodeBlock 
                    code={`---
export const metadata = {
  title: 'About Us',
  description: 'Learn more about our company',
}
---

# About Us

Welcome to our company! This is a regular **Markdown** page with JSX support.

<Button variant="primary">Get Started</Button>

## Our Mission

We build amazing products with Bini.js.`}
                    filename="app/about.mdx"
                  />
                </motion.section>

                {/* Markdown Pages */}
                <motion.section id="markdown-pages" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Markdown Pages</h2>
                  <p className="text-slate-300 mb-4">
                    Bini.js also supports plain <code className="text-cyan-400">.md</code> files. They go through the same MDX pipeline, which means they also support JSX and imports.
                  </p>
                  <CodeBlock 
                    code={`src/app/
├── docs/
│   └── getting-started.md  → /docs/getting-started
├── privacy.md              → /privacy
└── terms.md                → /terms`}
                  />
                  <CodeBlock 
                    code={`# Terms of Service

## 1. Acceptance of Terms

By using our service, you agree to these terms.

## 2. User Responsibilities

Users are responsible for their content and activity.

## 3. Termination

We reserve the right to terminate accounts that violate these terms.

---

*Last updated: January 2024*`}
                    filename="app/terms.md"
                  />
                  <p className="text-slate-300 mt-4">
                    Both <code className="text-cyan-400">.mdx</code> and <code className="text-cyan-400">.md</code> are compiled through the same MDX pipeline with full JSX, import, and export support. There is no plain-markdown-only mode.
                  </p>
                </motion.section>

                {/* Metadata in MDX */}
                <motion.section id="metadata-in-mdx" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Metadata in MDX</h2>
                  <p className="text-slate-300 mb-4">
                    Export <code className="text-cyan-400">metadata</code> from any MDX page to set page titles, descriptions, and Open Graph tags.
                  </p>
                  <CodeBlock 
                    code={`---
export const metadata = {
  title: 'Blog Post',
  description: 'A comprehensive guide to Bini.js',
  openGraph: {
    title: 'Blog Post',
    description: 'A comprehensive guide to Bini.js',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog Post',
    creator: '@bini_js',
  },
}
---

# Blog Post

This is a blog post written in MDX with full metadata support.`}
                    filename="app/blog/post.mdx"
                  />
                  <p className="text-slate-300 mt-4">
                    Root layout metadata is injected into <code className="text-cyan-400">index.html</code> at build time. Nested layout titles update <code className="text-cyan-400">document.title</code> at runtime.
                  </p>
                </motion.section>

                {/* Imports in MDX */}
                <motion.section id="imports-in-mdx" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Imports in MDX</h2>
                  <p className="text-slate-300 mb-4">
                    You can import components, utilities, and other files directly in MDX:
                  </p>
                  <CodeBlock 
                    code={`import { Button } from '@/components/Button'
import { BlogLayout } from '@/components/BlogLayout'
import { useTheme } from '@/hooks/useTheme'

export const metadata = {
  title: 'Interactive Page',
}

# Interactive Page

<BlogLayout>
  <p>This page uses imported components!</p>
  <Button variant="primary">Click Me</Button>
</BlogLayout>`}
                    filename="app/interactive.mdx"
                  />
                  <p className="text-slate-300 mt-4">
                    Auto-imports (<code className="text-cyan-400">useState</code>, <code className="text-cyan-400">Link</code>, <code className="text-cyan-400">getEnv</code>, etc.) apply to MDX files the same as any other page.
                  </p>
                </motion.section>

                {/* Extension Priority */}
                <motion.section id="extension-priority" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Extension Priority</h2>
                  <p className="text-slate-300 mb-4">
                    When multiple files share the same base name in a folder, Bini.js uses this priority order:
                  </p>
                  <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 mb-4">
                    <code className="text-cyan-400 text-sm">
                      .tsx &gt; .jsx &gt; .ts &gt; .js &gt; .mdx &gt; .md
                    </code>
                  </div>
                  <p className="text-slate-300 mb-4">
                    For example, if both <code className="text-cyan-400">page.tsx</code> and <code className="text-cyan-400">page.mdx</code> exist in the same folder:
                  </p>
                  <ul className="space-y-2 text-slate-300 mb-4 list-disc list-inside">
                    <li><code className="text-cyan-400">page.tsx</code> will be used (higher priority)</li>
                    <li><code className="text-cyan-400">page.mdx</code> is ignored</li>
                  </ul>
                  <CodeBlock 
                    code={`src/app/
├── about/
│   ├── page.tsx          ← Used (higher priority)
│   └── page.mdx          ← Ignored
├── blog/
│   ├── page.mdx          ← Used (higher priority than .md)
│   └── page.md           ← Ignored
└── contact.md            → /contact`}
                  />
                </motion.section>

                {/* Styling MDX Content */}
                <motion.section id="styling-mdx" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Styling MDX Content</h2>
                  <p className="text-slate-300 mb-4">
                    CSS Modules, plain CSS imports, and Tailwind utility classes work directly in MDX files:
                  </p>
                  <CodeBlock 
                    code={`import styles from './About.module.css'
import { Button } from '@/components/Button'

# About Us

<div className={styles.container}>
  <p className="text-slate-600 dark:text-slate-300">
    This uses Tailwind classes and CSS Modules!
  </p>
  <Button>Learn More</Button>
</div>`}
                    filename="app/about.mdx"
                  />
                  <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 mt-4">
                    <p className="text-slate-300 text-sm">
                      <strong className="text-white">Note:</strong> Tailwind's Preflight reset strips default styling from headings and bold text. Wrap plain-markdown regions in a <code className="text-cyan-400">prose</code> class from <code className="text-cyan-400">@tailwindcss/typography</code> if you want them to look styled by default.
                    </p>
                  </div>
                </motion.section>

                {/* MDX Configuration */}
                <motion.section id="mdx-configuration" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">MDX Configuration</h2>
                  <p className="text-slate-300 mb-4">
                    You can pass options directly to the bundled <code className="text-cyan-400">@mdx-js/rollup</code> plugin via the <code className="text-cyan-400">biniroute()</code> configuration:
                  </p>
                  <CodeBlock 
                    code={`// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { biniroute } from 'bini-router'

export default defineConfig({
  plugins: [
    react(),
    ...biniroute({
      mdx: {
        remarkPlugins: [/* add remark plugins here */],
        rehypePlugins: [/* add rehype plugins here */],
      },
    }),
  ],
})`}
                    filename="vite.config.ts"
                  />
                  <p className="text-slate-300 mt-4">
                    This is useful for adding syntax highlighting, custom markdown transformations, or other content processing.
                  </p>
                </motion.section>

                {/* Complete Example */}
                <motion.section id="complete-example" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Complete Example</h2>
                  <p className="text-slate-300 mb-4">
                    Here is a comprehensive example showing MDX and Markdown usage:
                  </p>
                  <CodeBlock 
                    code={`src/app/
├── layout.tsx                 ← Root layout
├── page.tsx                   → /
├── about.mdx                  → /about
├── blog/
│   ├── layout.tsx             ← Blog layout
│   ├── page.mdx               → /blog
│   ├── loading.tsx            ← Blog loading UI
│   ├── [slug].mdx             → /blog/:slug
│   └── _components/           ← Private folder
│       └── PostCard.tsx
├── docs/
│   ├── [[...slug]]/
│   │   └── page.md            → /docs (optional catch-all)
│   │                           → /docs/getting-started
│   └── _components/
│       └── Sidebar.tsx
└── contact.mdx                → /contact

# Example MDX with Imports and Metadata

// app/about.mdx
---
export const metadata = {
  title: 'About',
  description: 'Learn about our company',
}
---

import { TeamMember } from '@/components/TeamMember'
import { useTheme } from '@/hooks/useTheme'

# About Our Company

We build amazing things with Bini.js.

<div className="grid grid-cols-2 gap-4">
  <TeamMember name="John" role="Developer" />
  <TeamMember name="Jane" role="Designer" />
</div>

## Our Values

- **Quality** — We ship polished code
- **Speed** — We move fast
- **Community** — We support our users`}
                  />
                </motion.section>

                {/* Previous / Next Navigation */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="flex items-center justify-between pt-8 mt-8 border-t border-slate-800">
                  <Link to="/docs/catch-all-routes" className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <div>
                      <div className="text-xs text-slate-500">Previous</div>
                      <div className="text-sm font-medium">Catch-All Routes</div>
                    </div>
                  </Link>
                  <Link to="/docs/load" className="group flex items-center gap-2 text-right text-slate-400 hover:text-white transition-colors">
                    <div>
                      <div className="text-xs text-slate-500">Next</div>
                      <div className="text-sm font-medium">Loading UI</div>
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