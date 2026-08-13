// src/pages/docs/og-twitter/page.tsx
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
  { id: 'open-graph-overview', label: 'Open Graph Overview' },
  { id: 'open-graph-fields', label: 'Open Graph Fields' },
  { id: 'twitter-cards-overview', label: 'Twitter Cards Overview' },
  { id: 'twitter-card-fields', label: 'Twitter Card Fields' },
  { id: 'complete-example', label: 'Complete Example' },
]

const PAGE_TITLE = 'Open Graph & Twitter Cards'
const PAGE_URL = 'https://bini.js.org/docs/og-twitter'
const EDIT_URL = 'https://github.com/Binidu01/bini-offical/edit/main/src/app/docs/og-twitter.tsx'

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
// Open Graph & Twitter Cards Page
// ────────────────────────────────────────────────────────────────────────────────
export default function OgTwitterPage() {
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
                    <p className="text-slate-400 text-sm">Learn how to add Open Graph and Twitter Cards to your pages for better social sharing.</p>
                  </div>
                  <div className="shrink-0 pt-2 hidden sm:block">
                    <CopyPageButton pageUrl={PAGE_URL} pageTitle={PAGE_TITLE} />
                  </div>
                </motion.div>
                {/* Copy button on small screens */}
                <div className="sm:hidden mb-8">
                  <CopyPageButton pageUrl={PAGE_URL} pageTitle={PAGE_TITLE} />
                </div>

                {/* Open Graph Overview */}
                <motion.section id="open-graph-overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Open Graph Overview</h2>
                  <p className="text-slate-300 mb-4">
                    Open Graph tags control how your page appears when shared on social media platforms like Facebook, LinkedIn, Slack, and others. Bini.js allows you to define Open Graph metadata directly in your layouts and pages.
                  </p>
                  <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 mb-4">
                    <p className="text-slate-300 text-sm">
                      Bini.js includes a default <code className="text-cyan-400">og-image.png</code> in the <code className="text-cyan-400">public/</code> folder. Replace it with your own image to customize your Open Graph and Twitter Card images.
                    </p>
                  </div>
                  <CodeBlock 
                    code={`// src/app/about/page.tsx
export const metadata = {
  title: 'About Us',
  description: 'Learn more about our company and team',
  openGraph: {
    title: 'About Us - My Bini.js App',
    description: 'Learn more about our company and team',
    url: 'https://myapp.com/about',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'About Us',
      },
    ],
    siteName: 'My Bini.js App',
    locale: 'en_US',
  },
}

export default function AboutPage() {
  return <h1>About Us</h1>
}`}
                    filename="app/about/page.tsx"
                  />
                </motion.section>

                {/* Open Graph Fields */}
                <motion.section id="open-graph-fields" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Open Graph Fields</h2>
                  <Table 
                    headers={['Field', 'Type', 'Description']}
                    rows={[
                      ['title', 'string', 'Title for social sharing'],
                      ['description', 'string', 'Description for social sharing'],
                      ['url', 'string', 'Canonical URL for the page'],
                      ['type', 'string', 'Type of content (website, article, etc.)'],
                      ['images', 'array', 'Array of image objects for social cards'],
                      ['siteName', 'string', 'Name of the site'],
                      ['locale', 'string', 'Language locale (e.g., en_US)'],
                    ]}
                  />
                  <p className="text-slate-300 mt-4">
                    <strong className="text-white">Image object fields:</strong>
                  </p>
                  <Table 
                    headers={['Field', 'Type', 'Description']}
                    rows={[
                      ['url', 'string', 'URL to the image'],
                      ['width', 'number', 'Width of the image in pixels'],
                      ['height', 'number', 'Height of the image in pixels'],
                      ['alt', 'string', 'Alt text for the image'],
                    ]}
                  />
                </motion.section>

                {/* Twitter Cards Overview */}
                <motion.section id="twitter-cards-overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Twitter Cards Overview</h2>
                  <p className="text-slate-300 mb-4">
                    Twitter Cards control how your page appears when shared on Twitter/X. Bini.js supports all Twitter Card types including summary, summary_large_image, app, and player.
                  </p>
                  <CodeBlock 
                    code={`// src/app/blog/[slug]/page.tsx
export const metadata = {
  title: 'Blog Post',
  description: 'A comprehensive guide to Bini.js',
  twitter: {
    card: 'summary_large_image',
    title: 'Blog Post - My Bini.js App',
    description: 'A comprehensive guide to Bini.js',
    creator: '@bini_js',
    images: ['/og-image.png'],
  },
}

export default function BlogPost() {
  return <h1>Blog Post</h1>
}`}
                    filename="app/blog/[slug]/page.tsx"
                  />
                </motion.section>

                {/* Twitter Card Fields */}
                <motion.section id="twitter-card-fields" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Twitter Card Fields</h2>
                  <Table 
                    headers={['Field', 'Type', 'Description']}
                    rows={[
                      ['card', 'string', 'Card type: summary, summary_large_image, app, player'],
                      ['title', 'string', 'Title for Twitter card'],
                      ['description', 'string', 'Description for Twitter card'],
                      ['creator', 'string', 'Twitter handle of the content creator'],
                      ['images', 'array', 'Array of image URLs for the card'],
                    ]}
                  />
                  <p className="text-slate-300 mt-4">
                    <strong className="text-white">Card types:</strong>
                  </p>
                  <ul className="space-y-2 text-slate-300 mb-4 list-disc list-inside">
                    <li><code className="text-cyan-400">summary</code> — Standard card with a small image</li>
                    <li><code className="text-cyan-400">summary_large_image</code> — Card with a large, prominent image</li>
                    <li><code className="text-cyan-400">app</code> — Card for mobile apps</li>
                    <li><code className="text-cyan-400">player</code> — Card for video/audio content</li>
                  </ul>
                </motion.section>

                {/* Complete Example */}
                <motion.section id="complete-example" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Complete Example</h2>
                  <p className="text-slate-300 mb-4">
                    Here's a comprehensive example combining Open Graph and Twitter Cards for optimal social sharing:
                  </p>
                  <CodeBlock 
                    code={`// src/app/blog/[slug]/page.tsx
export const metadata = {
  title: 'Getting Started with Bini.js',
  description: 'Learn how to build native cross-platform apps with Bini.js',
  openGraph: {
    title: 'Getting Started with Bini.js',
    description: 'Learn how to build native cross-platform apps with Bini.js',
    url: 'https://myapp.com/blog/getting-started',
    type: 'article',
    images: [
      {
        url: 'https://myapp.com/images/blog/og.png',
        width: 1200,
        height: 630,
        alt: 'Getting Started with Bini.js',
      },
    ],
    siteName: 'My Bini.js App',
    locale: 'en_US',
    article: {
      publishedTime: '2025-08-01T00:00:00.000Z',
      modifiedTime: '2025-08-01T00:00:00.000Z',
      authors: ['https://myapp.com/authors/john'],
      tags: ['bini', 'react', 'framework'],
    },
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Getting Started with Bini.js',
    description: 'Learn how to build native cross-platform apps with Bini.js',
    creator: '@bini_js',
    images: ['https://myapp.com/images/blog/og.png'],
  },
}

export default function BlogPost() {
  return <h1>Getting Started with Bini.js</h1>
}`}
                    filename="app/blog/[slug]/page.tsx"
                  />
                  <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 mt-4">
                    <p className="text-slate-300 text-sm">
                      <strong className="text-white">Note:</strong> For best results, use images that are at least 1200x630 pixels. This ensures your content looks great on all platforms.
                    </p>
                  </div>
                </motion.section>

                {/* Previous / Next Navigation */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="flex items-center justify-between pt-8 mt-8 border-t border-slate-800">
                  <Link to="/docs/metadata" className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <div>
                      <div className="text-xs text-slate-500">Previous</div>
                      <div className="text-sm font-medium">Metadata</div>
                    </div>
                  </Link>
                  <Link to="/docs/icons" className="group flex items-center gap-2 text-right text-slate-400 hover:text-white transition-colors">
                    <div>
                      <div className="text-xs text-slate-500">Next</div>
                      <div className="text-sm font-medium">Icons & Favicons</div>
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