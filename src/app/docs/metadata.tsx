// src/pages/docs/metadata/page.tsx
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
  { id: 'what-is-metadata', label: 'What is Metadata?' },
  { id: 'basic-metadata', label: 'Basic Metadata' },
  { id: 'open-graph', label: 'Open Graph' },
  { id: 'twitter-cards', label: 'Twitter Cards' },
  { id: 'default-images', label: 'Default Images' },
  { id: 'icons', label: 'Icons' },
  { id: 'nested-metadata', label: 'Nested Metadata' },
]

const PAGE_TITLE = 'Metadata'
const PAGE_URL = 'https://bini.js.org/docs/metadata'
const EDIT_URL = 'https://github.com/Binidu01/bini-offical/edit/main/src/app/docs/metadata.tsx'

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
// Metadata Page
// ────────────────────────────────────────────────────────────────────────────────
export default function MetadataPage() {
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
                    <p className="text-slate-400 text-sm">Learn how to add metadata to your pages for better SEO and social sharing.</p>
                  </div>
                  <div className="shrink-0 pt-2 hidden sm:block">
                    <CopyPageButton pageUrl={PAGE_URL} pageTitle={PAGE_TITLE} />
                  </div>
                </motion.div>
                {/* Copy button on small screens */}
                <div className="sm:hidden mb-8">
                  <CopyPageButton pageUrl={PAGE_URL} pageTitle={PAGE_TITLE} />
                </div>

                {/* What is Metadata? */}
                <motion.section id="what-is-metadata" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">What is Metadata?</h2>
                  <p className="text-slate-300 mb-4">
                    Metadata provides information about your webpage to search engines, social media platforms, and browsers. In Bini.js, you can export a <code className="text-cyan-400">metadata</code> object from any layout to control page titles, descriptions, Open Graph tags, Twitter cards, and icons.
                  </p>
                  <p className="text-slate-300 mb-4">
                    Metadata is essential for SEO and social sharing, helping your pages look great when shared on platforms like Twitter, Facebook, and LinkedIn.
                  </p>
                </motion.section>

                {/* Basic Metadata */}
                <motion.section id="basic-metadata" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Basic Metadata</h2>
                  <p className="text-slate-300 mb-4">
                    Export a <code className="text-cyan-400">metadata</code> object from your root layout or any nested layout:
                  </p>
                  <CodeBlock 
                    code={`// src/app/layout.tsx
export const metadata = {
  title: 'My Bini.js App',
  description: 'Built with Bini.js - a native React framework',
  viewport: 'width=device-width, initial-scale=1.0',
  themeColor: '#00CFFF',
  charset: 'UTF-8',
  robots: 'index, follow',
  manifest: '/site.webmanifest',
  keywords: ['react', 'vite', 'framework', 'bini'],
  authors: [{ name: 'Your Name', url: 'https://example.com' }],
  canonical: 'https://myapp.com',
}

export default function RootLayout() {
  return <Outlet />
}`}
                    filename="app/layout.tsx"
                  />
                  <Table 
                    headers={['Field', 'Description']}
                    rows={[
                      ['title', 'Page title shown in browser tab and search results'],
                      ['description', 'Page description for search results'],
                      ['viewport', 'Viewport configuration for responsive design'],
                      ['themeColor', 'Browser UI theme color'],
                      ['charset', 'Character encoding'],
                      ['robots', 'Instructions for search engine crawlers'],
                      ['manifest', 'Path to web app manifest'],
                      ['keywords', 'Array or string of keywords'],
                      ['authors', 'Author information'],
                      ['canonical', 'Canonical URL for SEO'],
                    ]}
                  />
                </motion.section>

                {/* Open Graph */}
                <motion.section id="open-graph" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Open Graph</h2>
                  <p className="text-slate-300 mb-4">
                    Open Graph tags control how your page appears when shared on social media platforms like Facebook, LinkedIn, and Slack.
                  </p>
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
                  <Table 
                    headers={['Field', 'Description']}
                    rows={[
                      ['title', 'Title for social sharing'],
                      ['description', 'Description for social sharing'],
                      ['url', 'Canonical URL for the page'],
                      ['type', 'Type of content (website, article, etc.)'],
                      ['images', 'Array of image objects for social cards'],
                      ['siteName', 'Name of the site'],
                      ['locale', 'Language locale'],
                    ]}
                  />
                </motion.section>

                {/* Twitter Cards */}
                <motion.section id="twitter-cards" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Twitter Cards</h2>
                  <p className="text-slate-300 mb-4">
                    Twitter Cards control how your page appears when shared on Twitter/X.
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
  openGraph: {
    title: 'Blog Post',
    description: 'A comprehensive guide to Bini.js',
    images: ['/og-image.png'],
  },
}

export default function BlogPost() {
  return <h1>Blog Post</h1>
}`}
                    filename="app/blog/[slug]/page.tsx"
                  />
                  <Table 
                    headers={['Field', 'Description']}
                    rows={[
                      ['card', 'Card type (summary, summary_large_image, app, player)'],
                      ['title', 'Title for Twitter card'],
                      ['description', 'Description for Twitter card'],
                      ['creator', 'Twitter handle of the content creator'],
                      ['images', 'Array of image URLs for the card'],
                    ]}
                  />
                </motion.section>

                {/* Default Images */}
                <motion.section id="default-images" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Default Images</h2>
                  <p className="text-slate-300 mb-4">
                    Bini.js comes with default images pre-configured. Just replace these files in your <code className="text-cyan-400">public/</code> directory:
                  </p>
                  <CodeBlock 
                    code={`public/
├── favicon.ico           ← Your favicon
├── apple-touch-icon.png  ← iOS home screen icon
├── og-image.png          ← Open Graph image
├── logo.png              ← Your app logo
└── site.webmanifest      ← Web app manifest`}
                    filename="public/"
                  />
                  <p className="text-slate-300 mt-4">
                    <strong className="text-white">No configuration needed.</strong> Bini.js already has all the metadata configured. Just drop your images in the <code className="text-cyan-400">public/</code> folder and they'll automatically be used.
                  </p>
                  <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 mt-4">
                    <p className="text-slate-300 text-sm">
                      <strong className="text-white">Tip:</strong> For best results, use images that are at least 1200x630 pixels for Open Graph images.
                    </p>
                  </div>
                </motion.section>

                {/* Icons */}
                <motion.section id="icons" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Icons</h2>
                  <p className="text-slate-300 mb-4">
                    Define favicons, Apple touch icons, and other icons for your application.
                  </p>
                  <CodeBlock 
                    code={`// src/app/layout.tsx
export const metadata = {
  title: 'My App',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico' },
      { url: '/favicon-32x32.png', sizes: '32x32' },
      { url: '/favicon-16x16.png', sizes: '16x16' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' },
      { url: '/apple-touch-icon-precomposed.png' },
    ],
  },
}

export default function RootLayout() {
  return <Outlet />
}`}
                    filename="app/layout.tsx"
                  />
                  <Table 
                    headers={['Field', 'Description']}
                    rows={[
                      ['icon', 'Standard favicon (array of icon objects)'],
                      ['shortcut', 'Shortcut icon URL'],
                      ['apple', 'Apple touch icons (array of icon objects)'],
                    ]}
                  />
                </motion.section>

                {/* Nested Metadata */}
                <motion.section id="nested-metadata" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Nested Metadata</h2>
                  <p className="text-slate-300 mb-4">
                    Nested layouts can export their own metadata. Page titles are automatically combined using the template defined in the root layout.
                  </p>
                  <CodeBlock 
                    code={`// src/app/layout.tsx - Root layout
export const metadata = {
  title: {
    default: 'My App',
    template: '%s | My App',
  },
  description: 'Built with Bini.js',
}

// src/app/blog/layout.tsx - Blog layout
export const metadata = {
  title: 'Blog',
  description: 'Blog posts about Bini.js',
}

// src/app/blog/[slug]/page.tsx - Blog post
export const metadata = {
  title: 'Getting Started with Bini.js',
  // Result: "Getting Started with Bini.js | My App"
  description: 'Learn how to get started with Bini.js',
}`}
                  />
                  <p className="text-slate-300 mt-4">
                    When nested layouts export metadata, the <code className="text-cyan-400">title</code> is automatically combined with the root layout's template. Other fields like <code className="text-cyan-400">description</code>, <code className="text-cyan-400">openGraph</code>, and <code className="text-cyan-400">twitter</code> override ancestor values.
                  </p>
                </motion.section>

                {/* Previous / Next Navigation */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="flex items-center justify-between pt-8 mt-8 border-t border-slate-800">
                  <Link to="/docs/notfound" className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <div>
                      <div className="text-xs text-slate-500">Previous</div>
                      <div className="text-sm font-medium">Not Found (404)</div>
                    </div>
                  </Link>
                  <Link to="/docs/og-twitter" className="group flex items-center gap-2 text-right text-slate-400 hover:text-white transition-colors">
                    <div>
                      <div className="text-xs text-slate-500">Next</div>
                      <div className="text-sm font-medium">Open Graph & Twitter</div>
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