// src/pages/docs/deploying/page.tsx
import React from 'react'
import { m } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Info,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Header } from '../../components/Layout'
import { DocLayout } from '../../components/DocSidebar'
import { CopyPageButton } from '../../components/CopyPageButton'
import { TableOfContents, type TocItem } from '../../components/TableOfContents'
import {
  siNodedotjs,
  siNetlify,
  siVercel,
  siCloudflare,
  siDeno,
  siGithub,
} from 'simple-icons'
import type { SimpleIcon as SimpleIconType } from 'simple-icons'

// ────────────────────────────────────────────────────────────────────────────────
// "On this page" entries
// ────────────────────────────────────────────────────────────────────────────────
const TOC_ITEMS: TocItem[] = [
  { id: 'deployment-options', label: 'Deployment Options' },
  { id: 'using-bini-deploy', label: 'One Command to Deploy Anywhere' },
  { id: 'nodejs-server', label: 'Node.js Server' },
  { id: 'netlify', label: 'Netlify' },
  { id: 'vercel', label: 'Vercel' },
  { id: 'cloudflare', label: 'Cloudflare Workers' },
  { id: 'deno-deploy', label: 'Deno Deploy' },
  { id: 'static-export', label: 'Static Export' },
  { id: 'platform-comparison', label: 'Platform Comparison' },
  { id: 'environment-variables', label: 'Environment Variables' },
]

const PAGE_TITLE = 'Deploying'
const PAGE_URL = 'https://bini.js.org/docs/deploying'
const EDIT_URL = 'https://github.com/Binidu01/bini-offical/edit/main/src/app/docs/deploying.tsx'

// ────────────────────────────────────────────────────────────────────────────────
// Simple Icon component
// ────────────────────────────────────────────────────────────────────────────────
function SimpleIcon({ 
  icon, 
  className = "", 
  size = 20 
}: { 
  icon: SimpleIconType
  className?: string
  size?: number 
}) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
      dangerouslySetInnerHTML={{ __html: icon.svg }}
    />
  )
}

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
    <div className="flex items-start gap-3 p-4 rounded-lg border border-slate-700 bg-slate-900/50 my-6">
      <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
      <div className="text-sm text-slate-300 [&>strong]:text-white [&>code]:text-cyan-400 [&>code]:bg-slate-800 [&>code]:px-1 [&>code]:py-0.5 [&>code]:rounded">{children}</div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────────
// Deploying Page
// ────────────────────────────────────────────────────────────────────────────────
export default function DeployingPage() {
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
                    <p className="text-slate-400 text-sm">Learn how to deploy your Bini.js application to production.</p>
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
                    Bini.js can be deployed to any platform that supports Node.js, or exported as static files for static hosting. 
                    For all hosting platforms <strong className="text-white">except static export</strong>, use the unified <code className="text-cyan-400">npm run deploy</code> command.
                  </p>
                </m.section>

                {/* Deployment Options */}
                <m.section id="deployment-options" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Deployment Options</h2>
                  <Table 
                    headers={['Platform', 'Command', 'Notes']}
                    rows={[
                      [<span className="flex items-center gap-2"><SimpleIcon icon={siNodedotjs} className="text-green-400" size={16} /> Node.js</span>, <code className="text-cyan-400">npm run deploy</code>, 'Default — uses bini-server'],
                      [<span className="flex items-center gap-2"><SimpleIcon icon={siGithub} className="text-white" size={16} /> Static Export</span>, <code className="text-cyan-400">npm run build</code>, 'GitHub Pages, S3, Firebase, Surge'],
                      [<span className="flex items-center gap-2"><SimpleIcon icon={siNetlify} className="text-cyan-400" size={16} /> Netlify</span>, <code className="text-cyan-400">npm run deploy</code>, 'Automated by bini-deploy'],
                      [<span className="flex items-center gap-2"><SimpleIcon icon={siVercel} className="text-white" size={16} /> Vercel</span>, <code className="text-cyan-400">npm run deploy</code>, 'Automated by bini-deploy'],
                      [<span className="flex items-center gap-2"><SimpleIcon icon={siCloudflare} className="text-orange-400" size={16} /> Cloudflare</span>, <code className="text-cyan-400">npm run deploy</code>, 'Automated by bini-deploy'],
                      [<span className="flex items-center gap-2"><SimpleIcon icon={siDeno} className="text-white" size={16} /> Deno Deploy</span>, <code className="text-cyan-400">npm run deploy</code>, 'Automated by bini-deploy'],
                    ]}
                  />
                  <Note>
                    <strong>Unified command:</strong> <code>npm run deploy</code> works for Node.js, Netlify, Vercel, Cloudflare, and Deno Deploy. Static export uses <code>npm run build</code> which pre-renders all routes.
                  </Note>
                </m.section>

                {/* Using bini-deploy */}
                <m.section id="using-bini-deploy" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2 flex items-center gap-2">
                    One Command to Deploy Anywhere
                  </h2>
                  <p className="text-slate-300 mb-4">
                    <strong className="text-white">bini-deploy</strong> makes deployment effortless. Simply run:
                  </p>
                  <CodeBlock 
                    code={`npm run deploy`}
                  />
                  <p className="text-slate-300 mt-4">
                    When you run <code className="text-cyan-400">npm run deploy</code>, bini-deploy will:
                  </p>
                  <ol className="space-y-2 text-slate-300 mb-4 list-decimal list-inside">
                    <li><strong className="text-white">Prompt you to choose your target platform:</strong> Web, Windows, macOS, Linux, Android, or iOS</li>
                    <li><strong className="text-white">If you choose Web, it prompts for hosting provider:</strong> Node.js (default), Netlify, Vercel, Cloudflare, or Deno Deploy</li>
                    <li><strong className="text-white">Automatically generates</strong> the platform-specific configuration files and entry points</li>
                    <li><strong className="text-white">Commits and pushes</strong> everything to your GitHub repository</li>
                  </ol>
                  <p className="text-slate-300 mt-4">
                    This single command works for <strong className="text-white">all hosting platforms</strong> with <strong className="text-white">zero configuration needed</strong>:
                  </p>
                  <ul className="space-y-2 text-slate-300 mb-4 list-disc list-inside">
                    <li><strong className="text-white">Node.js</strong> — Builds and starts the server</li>
                    <li><strong className="text-white">Netlify</strong> — Automatically generates <code>netlify.toml</code> and edge function entry</li>
                    <li><strong className="text-white">Vercel</strong> — Automatically generates <code>vercel.json</code> and serverless function entry</li>
                    <li><strong className="text-white">Cloudflare</strong> — Automatically generates <code>wrangler.toml</code> and worker entry</li>
                    <li><strong className="text-white">Deno Deploy</strong> — Automatically generates <code>server/index.ts</code> entry</li>
                  </ul>
                  <Note>
                    <strong>Zero config required:</strong> bini-deploy automatically detects your project structure, picks the right adapter, and generates platform-specific configuration. No changes to <code>vite.config.ts</code> needed. Learn more at <a href="https://github.com/Binidu01/bini-deploy" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">bini-deploy</a>.
                  </Note>
                </m.section>

                {/* Node.js Server */}
                <m.section id="nodejs-server" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2 flex items-center gap-2">
                    <SimpleIcon icon={siNodedotjs} className="text-green-400" size={20} />
                    Node.js Server
                  </h2>
                  <p className="text-slate-300 mb-4">
                    The default deployment option. Bini.js uses <code className="text-cyan-400">bini-server</code> — a zero-dependency production server.
                  </p>
                  <CodeBlock 
                    code={`npm run deploy`}
                  />
                  <p className="text-slate-300 mt-4">
                    Your app will be served at the port specified by <code className="text-cyan-400">PORT</code> (default: 3000).
                  </p>
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Platforms</h3>
                  <ul className="space-y-2 text-slate-300 mb-4 list-disc list-inside">
                    <li><strong className="text-white">Railway</strong> — Auto-detects Node.js, just connect your repo</li>
                    <li><strong className="text-white">Render</strong> — Set build command to <code>npm run deploy</code> and start to <code>npm start</code></li>
                    <li><strong className="text-white">Fly.io</strong> — Use the Node.js builder</li>
                    <li><strong className="text-white">VPS</strong> — Use <code>pm2</code> to keep the server running</li>
                  </ul>
                  
                  <Note>
                    <strong>bini-server features:</strong> ETag support, 30s timeouts, 10MB body limit, graceful shutdown, and automatic port increment.
                  </Note>
                </m.section>

                {/* Netlify */}
                <m.section id="netlify" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2 flex items-center gap-2">
                    <SimpleIcon icon={siNetlify} className="text-cyan-400" size={20} />
                    Netlify
                  </h2>
                  <p className="text-slate-300 mb-4">
                    Deploying to Netlify is completely automated with bini-deploy. No configuration needed.
                  </p>
                  <CodeBlock 
                    code={`npm run deploy`}
                  />
                  <p className="text-slate-300 mt-4">
                    bini-deploy automatically generates:
                  </p>
                  <ul className="space-y-2 text-slate-300 mb-4 list-disc list-inside">
                    <li><code className="text-cyan-400">netlify.toml</code> — Build and edge function configuration</li>
                    <li><code className="text-cyan-400">netlify/edge-functions/api.ts</code> — API route handler for Edge Functions</li>
                  </ul>
                  <Note>
                    <strong>Important:</strong> Netlify Edge Functions run on Deno, not Node.js. Node-specific packages like <code>nodemailer</code>, <code>fs</code>, or <code>path</code> will not work. Use Web API alternatives.
                  </Note>
                </m.section>

                {/* Vercel */}
                <m.section id="vercel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2 flex items-center gap-2">
                    <SimpleIcon icon={siVercel} className="text-white" size={20} />
                    Vercel
                  </h2>
                  <p className="text-slate-300 mb-4">
                    Deploying to Vercel is completely automated with bini-deploy. No configuration needed.
                  </p>
                  <CodeBlock 
                    code={`npm run deploy`}
                  />
                  <p className="text-slate-300 mt-4">
                    bini-deploy automatically generates:
                  </p>
                  <ul className="space-y-2 text-slate-300 mb-4 list-disc list-inside">
                    <li><code className="text-cyan-400">vercel.json</code> — Routing and build configuration</li>
                    <li><code className="text-cyan-400">api/index.ts</code> — Serverless function entry point</li>
                  </ul>
                </m.section>

                {/* Cloudflare Workers */}
                <m.section id="cloudflare" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2 flex items-center gap-2">
                    <SimpleIcon icon={siCloudflare} className="text-orange-400" size={20} />
                    Cloudflare Workers
                  </h2>
                  <p className="text-slate-300 mb-4">
                    Deploying to Cloudflare Workers is completely automated with bini-deploy. No configuration needed.
                  </p>
                  <CodeBlock 
                    code={`npm run deploy`}
                  />
                  <p className="text-slate-300 mt-4">
                    bini-deploy automatically generates:
                  </p>
                  <ul className="space-y-2 text-slate-300 mb-4 list-disc list-inside">
                    <li><code className="text-cyan-400">wrangler.toml</code> — Worker configuration</li>
                    <li><code className="text-cyan-400">worker.ts</code> — Worker entry point with API routes</li>
                  </ul>
                </m.section>

                {/* Deno Deploy */}
                <m.section id="deno-deploy" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2 flex items-center gap-2">
                    <SimpleIcon icon={siDeno} className="text-white" size={20} />
                    Deno Deploy
                  </h2>
                  <p className="text-slate-300 mb-4">
                    Deploying to Deno Deploy is completely automated with bini-deploy. No configuration needed.
                  </p>
                  <CodeBlock 
                    code={`npm run deploy`}
                  />
                  <p className="text-slate-300 mt-4">
                    bini-deploy automatically generates:
                  </p>
                  <ul className="space-y-2 text-slate-300 mb-4 list-disc list-inside">
                    <li><code className="text-cyan-400">server/index.ts</code> — Deno Deploy entry point</li>
                  </ul>
                </m.section>

                {/* Static Export */}
                <m.section id="static-export" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2 flex items-center gap-2">
                    <SimpleIcon icon={siGithub} className="text-white" size={20} />
                    Static Export
                  </h2>
                  <p className="text-slate-300 mb-4">
                    For static hosting, <code className="text-cyan-400">npm run build</code> pre-renders every route to static HTML. This is the <strong className="text-white">only</strong> deployment method that doesn't use <code className="text-cyan-400">npm run deploy</code>.
                  </p>
                  <CodeBlock 
                    code={`npm run build`}
                  />
                  <p className="text-slate-300 mt-4">
                    The pre-rendered files will be in the <code className="text-cyan-400">dist/</code> folder. Suitable for:
                  </p>
                  <ul className="space-y-2 text-slate-300 mb-4 list-disc list-inside">
                    <li>GitHub Pages</li>
                    <li>Amazon S3</li>
                    <li>Firebase Hosting</li>
                    <li>Cloudflare Pages (static mode)</li>
                    <li>Netlify (static mode)</li>
                    <li>Vercel (static mode)</li>
                  </ul>
                  
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">GitHub Pages</h3>
                  <p className="text-slate-300 mb-4">
                    Set the <code>base</code> option in <code>vite.config.ts</code> if deploying to a subpath:
                  </p>
                  <CodeBlock 
                    code={`// vite.config.ts
export default defineConfig({
  base: '/your-repo-name/',
})`}
                  />
                  <p className="text-slate-300 mt-4">
                    Then deploy the <code>dist/</code> folder to GitHub Pages.
                  </p>
                  
                  <Note>
                    <strong>Pre-rendering:</strong> <code>npm run build</code> pre-renders all static routes to HTML and creates shell pages for dynamic routes. The client hydrates on load. No separate export command needed.
                  </Note>
                </m.section>

                {/* Platform Comparison */}
                <m.section id="platform-comparison" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Platform Comparison</h2>
                  <Table 
                    headers={['Platform', 'API Runtime', 'Static Routes', 'Dynamic Routes', 'Deploy Command']}
                    rows={[
                      [<span className="flex items-center gap-2"><SimpleIcon icon={siNodedotjs} className="text-green-400" size={14} /> Node.js</span>, 'Node.js', <CheckCircle className="w-4 h-4 text-emerald-400" />, <CheckCircle className="w-4 h-4 text-emerald-400" />, <code className="text-cyan-400">npm run deploy</code>],
                      [<span className="flex items-center gap-2"><SimpleIcon icon={siNetlify} className="text-cyan-400" size={14} /> Netlify</span>, 'Deno (Edge)', <CheckCircle className="w-4 h-4 text-emerald-400" />, <CheckCircle className="w-4 h-4 text-emerald-400" />, <code className="text-cyan-400">npm run deploy</code>],
                      [<span className="flex items-center gap-2"><SimpleIcon icon={siVercel} className="text-white" size={14} /> Vercel</span>, 'Edge', <CheckCircle className="w-4 h-4 text-emerald-400" />, <CheckCircle className="w-4 h-4 text-emerald-400" />, <code className="text-cyan-400">npm run deploy</code>],
                      [<span className="flex items-center gap-2"><SimpleIcon icon={siCloudflare} className="text-orange-400" size={14} /> Cloudflare</span>, 'Workers', <CheckCircle className="w-4 h-4 text-emerald-400" />, <CheckCircle className="w-4 h-4 text-emerald-400" />, <code className="text-cyan-400">npm run deploy</code>],
                      [<span className="flex items-center gap-2"><SimpleIcon icon={siDeno} className="text-white" size={14} /> Deno Deploy</span>, 'Deno', <CheckCircle className="w-4 h-4 text-emerald-400" />, <CheckCircle className="w-4 h-4 text-emerald-400" />, <code className="text-cyan-400">npm run deploy</code>],
                      [<span className="flex items-center gap-2"><SimpleIcon icon={siGithub} className="text-white" size={14} /> Static Export</span>, 'N/A', <CheckCircle className="w-4 h-4 text-emerald-400" />, <span className="text-amber-400">via shell pages</span>, <code className="text-amber-400">npm run build</code>],
                    ]}
                  />
                </m.section>

                {/* Environment Variables in Production */}
                <m.section id="environment-variables" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Environment Variables in Production</h2>
                  <p className="text-slate-300 mb-4">
                    Set environment variables through your hosting platform's dashboard:
                  </p>
                  <Table 
                    headers={['Platform', 'How to Set']}
                    rows={[
                      [<span className="flex items-center gap-2"><SimpleIcon icon={siNodedotjs} className="text-green-400" size={14} /> Node.js</span>, 'Use .env file or system environment variables'],
                      [<span className="flex items-center gap-2"><SimpleIcon icon={siNetlify} className="text-cyan-400" size={14} /> Netlify</span>, 'Site settings → Environment variables'],
                      [<span className="flex items-center gap-2"><SimpleIcon icon={siVercel} className="text-white" size={14} /> Vercel</span>, 'Project settings → Environment Variables'],
                      [<span className="flex items-center gap-2"><SimpleIcon icon={siCloudflare} className="text-orange-400" size={14} /> Cloudflare</span>, 'wrangler.toml or dashboard'],
                      [<span className="flex items-center gap-2"><SimpleIcon icon={siDeno} className="text-white" size={14} /> Deno Deploy</span>, 'Project settings → Environment Variables'],
                    ]}
                  />
                  <Note>
                    Never commit <code>.env</code> files with secrets to your repository. Use platform environment variables for production.
                  </Note>
                </m.section>

                {/* Best Practices */}
                <m.section id="best-practices" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Best Practices</h2>
                  <ul className="space-y-3 text-slate-300 mb-6 list-disc list-inside">
                    <li><strong className="text-white">Test builds locally</strong> — Run <code>npm run build</code> and <code>npm run preview</code> before deploying.</li>
                    <li><strong className="text-white">Use environment variables</strong> — Keep configuration separate from code.</li>
                    <li><strong className="text-white">Set up CI/CD</strong> — Automate deployments with GitHub Actions or similar.</li>
                    <li><strong className="text-white">Monitor your app</strong> — Use platform analytics to track performance.</li>
                    <li><strong className="text-white">Use a custom domain</strong> — Configure SSL for secure connections.</li>
                  </ul>
                </m.section>

                {/* Previous / Next Navigation */}
                <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }} className="flex items-center justify-between pt-8 mt-8 border-t border-slate-800">
                  <Link to="/docs/environment-variables" className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <div>
                      <div className="text-xs text-slate-500">Previous</div>
                      <div className="text-sm font-medium">Environment Variables</div>
                    </div>
                  </Link>
                  <Link to="/docs/production-server" className="group flex items-center gap-2 text-right text-slate-400 hover:text-white transition-colors">
                    <div>
                      <div className="text-xs text-slate-500">Next</div>
                      <div className="text-sm font-medium">Production Server</div>
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