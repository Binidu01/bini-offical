// src/pages/docs/hosting/page.tsx
import React from 'react'
import { m } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
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
  { id: 'overview', label: 'Overview' },
  { id: 'installation', label: 'Installation' },
  { id: 'supported-providers', label: 'Supported Providers' },
  { id: 'node', label: 'Node.js' },
  { id: 'netlify', label: 'Netlify' },
  { id: 'vercel', label: 'Vercel' },
  { id: 'cloudflare', label: 'Cloudflare Workers' },
  { id: 'deno-deploy', label: 'Deno Deploy' },
  { id: 'api-routes', label: 'API Routes & Hono' },
  { id: 'cors', label: 'Automatic CORS' },
  { id: 'git-behavior', label: 'Git Push Behavior' },
  { id: 'requirements', label: 'Requirements' },
]

const PAGE_TITLE = 'Hosting Providers'
const PAGE_URL = 'https://bini.js.org/docs/hosting'
const EDIT_URL = 'https://github.com/Binidu01/bini-offical/edit/main/src/app/docs/hosting.tsx'

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
    navigator.clipboard.writeText(code)
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
    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 my-6">
      <div className="text-sm text-slate-300 [&>strong]:text-white [&>code]:text-cyan-400 [&>code]:bg-slate-800 [&>code]:px-1 [&>code]:py-0.5 [&>code]:rounded">
        {children}
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────────
// Hosting Providers Page
// ────────────────────────────────────────────────────────────────────────────────
export default function HostingPage() {
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
                    <p className="text-slate-400 text-sm">Zero-config web deployment with <code className="text-cyan-400 bg-slate-800 px-1 py-0.5 rounded">bini-deploy</code> — generates hosting config and pushes straight to GitHub.</p>
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
                <m.section id="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="scroll-mt-24">
                  <p className="text-slate-300 mb-4">
                    <code className="text-cyan-400">bini-deploy</code> scans your project, generates the right hosting configuration for your target provider, and pushes it straight to GitHub — no YAML spelunking, no platform-specific docs to read first.
                  </p>
                  <p className="text-slate-300 mb-6">
                    It's bundled into every Bini.js scaffold and exposed as <code className="text-cyan-400">npm run deploy</code>. This page covers the <strong className="text-white">web hosting providers</strong> it supports. For desktop and mobile targets, see <Link to="/docs/deploying" className="text-cyan-400 hover:underline">Deployment Overview</Link>.
                  </p>
                </m.section>

                {/* Installation */}
                <m.section id="installation" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Installation</h2>
                  <p className="text-slate-300 mb-4">
                    Already included in every Bini.js scaffold. To add it to an existing project:
                  </p>
                  <CodeBlock code={`npm install --save-dev bini-deploy`} />
                </m.section>

                {/* Supported Providers */}
                <m.section id="supported-providers" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Supported Providers</h2>
                  <Table
                    headers={['Provider', 'Runtime', 'Config generated']}
                    rows={[
                      [<span className="flex items-center gap-2"><SimpleIcon icon={siNodedotjs} className="text-green-400" size={16} /> Node.js (default)</span>, 'Node (bini-server)', 'None — bini-server handles it, bini-deploy just pushes to GitHub'],
                      [<span className="flex items-center gap-2"><SimpleIcon icon={siNetlify} className="text-cyan-400" size={16} /> Netlify</span>, 'Edge Functions (Deno)', <code className="text-cyan-400">netlify.toml</code>],
                      [<span className="flex items-center gap-2"><SimpleIcon icon={siVercel} className="text-white" size={16} /> Vercel</span>, 'Node.js Runtime', <code className="text-cyan-400">vercel.json</code>],
                      [<span className="flex items-center gap-2"><SimpleIcon icon={siCloudflare} className="text-orange-400" size={16} /> Cloudflare Workers</span>, 'Workers', <code className="text-cyan-400">wrangler.toml</code>],
                      [<span className="flex items-center gap-2"><SimpleIcon icon={siDeno} className="text-white" size={16} /> Deno Deploy</span>, 'Deno', <code className="text-cyan-400">server/index.ts</code>],
                    ]}
                  />
                  <Note>
                    <strong>Node is the default</strong> because Bini.js ships with <code>bini-server</code>, a zero-dependency production server. Choosing it skips config generation entirely — there's nothing to adapt, so bini-deploy just commits and pushes.
                  </Note>

                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">How it works</h3>
                  <ol className="space-y-2 text-slate-300 mb-4 list-decimal list-inside">
                    <li><strong className="text-white">Scan</strong> — scans <code className="text-cyan-400">src/app/api/</code> for route files</li>
                    <li><strong className="text-white">Generate</strong> — creates the platform-specific entry file and config</li>
                    <li><strong className="text-white">Clean</strong> — removes leftover entry files, config, and directories from any previously selected platform, including when switching to Node or a native platform</li>
                    <li><strong className="text-white">Push</strong> — commits and pushes everything to your GitHub repository</li>
                    <li><strong className="text-white">Deploy</strong> — your hosting provider deploys automatically from GitHub</li>
                  </ol>

                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Usage</h3>
                  <p className="text-slate-300 mb-4">
                    Every Bini.js scaffold already has this wired into <code className="text-cyan-400">package.json</code>, so deploying is just:
                  </p>
                  <CodeBlock code={`npm run deploy`} />
                  <p className="text-slate-300 mb-4">
                    This runs <code className="text-cyan-400">bini-deploy</code> interactively — it prompts you to pick a platform (<code className="text-cyan-400">web</code>, <code className="text-cyan-400">windows</code>, <code className="text-cyan-400">macos</code>, <code className="text-cyan-400">linux</code>, <code className="text-cyan-400">android</code>, <code className="text-cyan-400">ios</code>) and, if you choose web, a hosting provider (<code className="text-cyan-400">node</code>, <code className="text-cyan-400">netlify</code>, <code className="text-cyan-400">vercel</code>, <code className="text-cyan-400">cloudflare</code>, <code className="text-cyan-400">deno</code>).
                  </p>
                  <p className="text-slate-300 mb-4">
                    For scripts and CI, skip the prompts with flags:
                  </p>
                  <CodeBlock code={`npx bini-deploy --platform web --hosting vercel --repo https://github.com/you/your-app --yes`} />
                  <Table
                    headers={['Flag', 'Description']}
                    rows={[
                      [<code className="text-cyan-400">--platform</code>, <span><code className="text-cyan-400">web</code>, <code className="text-cyan-400">windows</code>, <code className="text-cyan-400">macos</code>, <code className="text-cyan-400">ios</code>, <code className="text-cyan-400">linux</code>, <code className="text-cyan-400">android</code></span>],
                      [<code className="text-cyan-400">--hosting</code>, <span>web only — <code className="text-cyan-400">node</code> (default), <code className="text-cyan-400">netlify</code>, <code className="text-cyan-400">vercel</code>, <code className="text-cyan-400">cloudflare</code>, <code className="text-cyan-400">deno</code></span>],
                      [<code className="text-cyan-400">--repo</code>, 'GitHub repository URL to push to'],
                      [<code className="text-cyan-400">--generate-entry</code>, <span>generate only the production entry file — <code className="text-cyan-400">netlify</code>, <code className="text-cyan-400">vercel</code>, <code className="text-cyan-400">cloudflare</code>, <code className="text-cyan-400">deno</code></span>],
                      [<code className="text-cyan-400">--yes, -y</code>, 'skip interactive prompts and use the flags provided'],
                    ]}
                  />
                </m.section>

                {/* Node.js */}
                <m.section id="node" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2 flex items-center gap-2">
                    <SimpleIcon icon={siNodedotjs} className="text-green-400" size={20} />
                    Node.js
                  </h2>
                  <p className="text-slate-300 mb-4">
                    The default hosting choice. <code className="text-cyan-400">bini-server</code> reads your API handlers directly from <code className="text-cyan-400">src/app/api/</code> at request time — no build step, no generated entry file.
                  </p>
                  <CodeBlock code={`npm run deploy`} />
                  <p className="text-slate-300 mt-2 mb-4">
                    Pick <strong className="text-white">web</strong>, then <strong className="text-white">node</strong> (the default) when prompted.
                  </p>
                  <p className="text-slate-300 mt-4">
                    Works out of the box on Railway, Render, Fly.io, or a bare VPS with <code className="text-cyan-400">pm2</code>. See <Link to="/docs/production-server" className="text-cyan-400 hover:underline">Production Server</Link> for the full runtime reference.
                  </p>
                </m.section>

                {/* Netlify */}
                <m.section id="netlify" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2 flex items-center gap-2">
                    <SimpleIcon icon={siNetlify} className="text-cyan-400" size={20} />
                    Netlify
                  </h2>
                  <p className="text-slate-300 mb-4">API routes run as Netlify Edge Functions.</p>
                  <CodeBlock code={`npm run deploy`} />
                  <p className="text-slate-300 mt-2 mb-4">
                    Pick <strong className="text-white">web</strong>, then <strong className="text-white">netlify</strong> when prompted.
                  </p>
                  <p className="text-slate-300 mt-4 mb-2">Generates:</p>
                  <ul className="space-y-2 text-slate-300 mb-4 list-disc list-inside">
                    <li><code className="text-cyan-400">netlify.toml</code></li>
                    <li><code className="text-cyan-400">netlify/edge-functions/api.ts</code></li>
                  </ul>
                  <CodeBlock
                    filename="netlify.toml"
                    code={`[build]
  command = "vite build"
  publish = "dist"

[[edge_functions]]
  path = "/api/*"
  function = "api"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200`}
                  />
                  <Note>
                    Edge Functions run on <strong className="text-white">Deno, not Node</strong> — packages depending on Node built-ins (<code>fs</code>, <code>nodemailer</code>) won't work there.
                  </Note>
                </m.section>

                {/* Vercel */}
                <m.section id="vercel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2 flex items-center gap-2">
                    <SimpleIcon icon={siVercel} className="text-white" size={20} />
                    Vercel
                  </h2>
                  <p className="text-slate-300 mb-4">API routes run on Vercel's Node.js Runtime.</p>
                  <CodeBlock code={`npm run deploy`} />
                  <p className="text-slate-300 mt-2 mb-4">
                    Pick <strong className="text-white">web</strong>, then <strong className="text-white">vercel</strong> when prompted.
                  </p>
                  <p className="text-slate-300 mt-4 mb-2">Generates:</p>
                  <ul className="space-y-2 text-slate-300 mb-4 list-disc list-inside">
                    <li><code className="text-cyan-400">vercel.json</code></li>
                    <li><code className="text-cyan-400">api/index.ts</code></li>
                  </ul>
                  <Note>
                    Vercel reads <code>api/index.ts</code> before running your build — bini-deploy commits it for you, so it's already there when CI runs. It imports <code>hono</code> as an npm package, so bini-deploy checks it's installed and tells you the exact install command if it's missing.
                  </Note>
                </m.section>

                {/* Cloudflare Workers */}
                <m.section id="cloudflare" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2 flex items-center gap-2">
                    <SimpleIcon icon={siCloudflare} className="text-orange-400" size={20} />
                    Cloudflare Workers
                  </h2>
                  <p className="text-slate-300 mb-4">API routes run as a Cloudflare Worker.</p>
                  <CodeBlock code={`npm run deploy`} />
                  <p className="text-slate-300 mt-2 mb-4">
                    Pick <strong className="text-white">web</strong>, then <strong className="text-white">cloudflare</strong> when prompted.
                  </p>
                  <p className="text-slate-300 mt-4 mb-2">Generates:</p>
                  <ul className="space-y-2 text-slate-300 mb-4 list-disc list-inside">
                    <li><code className="text-cyan-400">wrangler.toml</code></li>
                    <li><code className="text-cyan-400">worker.ts</code></li>
                  </ul>
                  <p className="text-slate-300 mt-4">
                    Or deploy manually with Wrangler once the entry file exists:
                  </p>
                  <CodeBlock code={`npx wrangler deploy`} />
                  <Note>
                    Like Vercel, the worker entry imports <code>hono</code> as an npm package — bini-deploy verifies it's installed before generating the entry file.
                  </Note>
                </m.section>

                {/* Deno Deploy */}
                <m.section id="deno-deploy" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2 flex items-center gap-2">
                    <SimpleIcon icon={siDeno} className="text-white" size={20} />
                    Deno Deploy
                  </h2>
                  <p className="text-slate-300 mb-4">API routes run on Deno.</p>
                  <CodeBlock code={`npm run deploy`} />
                  <p className="text-slate-300 mt-2 mb-4">
                    Pick <strong className="text-white">web</strong>, then <strong className="text-white">deno</strong> when prompted.
                  </p>
                  <p className="text-slate-300 mt-4 mb-2">Generates:</p>
                  <ul className="space-y-2 text-slate-300 mb-4 list-disc list-inside">
                    <li><code className="text-cyan-400">server/index.ts</code></li>
                  </ul>
                  <p className="text-slate-300 mt-4 mb-2">In the Deno Deploy dashboard, set:</p>
                  <ul className="space-y-2 text-slate-300 mb-4 list-disc list-inside">
                    <li><strong className="text-white">Entrypoint:</strong> <code className="text-cyan-400">server/index.ts</code></li>
                    <li><strong className="text-white">Runtime:</strong> Dynamic App</li>
                  </ul>
                  <Note>
                    Deno Deploy also reads its entry file before building — same reasoning as Vercel above. Deno and Netlify both import <code>hono</code> directly from a URL, so no local install check is needed for these two.
                  </Note>
                </m.section>

                {/* API Routes & Hono */}
                <m.section id="api-routes" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">API Routes & Hono</h2>
                  <p className="text-slate-300 mb-4">
                    Every provider mounts the same file-based routes from <code className="text-cyan-400">src/app/api/</code>, dynamic segments and catch-alls included:
                  </p>
                  <CodeBlock
                    code={`src/app/api/
├── index.ts          → /api
├── users/
│   ├── index.ts       → /api/users
│   └── [id].ts        → /api/users/:id
└── posts/
    └── [...slug].ts    → /api/posts/*`}
                  />
                  <p className="text-slate-300 mb-4">
                    Each route exports a default handler that accepts a <code className="text-cyan-400">Request</code> and returns a <code className="text-cyan-400">Response</code> (or a JSON-serializable value):
                  </p>
                  <CodeBlock
                    filename="src/app/api/users/[id].ts"
                    code={`export default async function handler(req: Request) {
  const id = new URL(req.url).pathname.split('/').pop();
  return { id, name: 'Ada Lovelace' };
}`}
                  />
                  <p className="text-slate-300 mb-4">
                    Imports from <code className="text-cyan-400">hono</code> are detected automatically and mounted as a full Hono app instead:
                  </p>
                  <CodeBlock
                    filename="src/app/api/hello/route.ts"
                    code={`import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => c.json({ message: 'Hello from Hono!' }));
app.post('/', async (c) => {
  const body = await c.req.json();
  return c.json({ received: body });
});

export default app;`}
                  />
                  <Note>
                    <strong>ESM projects:</strong> since Bini.js projects ship with <code>"type": "module"</code>, Node's native ESM loader requires relative imports to include their file extension. bini-deploy's generated imports already include <code>.js</code>, but if your route files import local helpers (e.g. <code>./utils</code>), include the extension there too (<code>./utils.js</code>) or the deployed function will crash with <code>ERR_MODULE_NOT_FOUND</code> even though the build succeeds.
                  </Note>
                </m.section>

                {/* Automatic CORS */}
                <m.section id="cors" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Automatic CORS</h2>
                  <p className="text-slate-300 mb-2">
                    API routes get permissive CORS headers out of the box on every non-Node hosting adapter — Netlify, Vercel, Cloudflare, and Deno — so your frontend can call them without extra setup.
                  </p>
                </m.section>

                {/* Git Push Behavior */}
                <m.section id="git-behavior" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Git Push Behavior</h2>
                  <ul className="space-y-2 text-slate-300 mb-4 list-disc list-inside">
                    <li><strong className="text-white">Existing remote</strong> — used without modification</li>
                    <li><strong className="text-white">New projects</strong> — the provided URL is added as <code className="text-cyan-400">origin</code></li>
                    <li><strong className="text-white">No remote updates</strong> — once a remote is set, it's never changed</li>
                    <li><strong className="text-white">Always main</strong> — always pushes to <code className="text-cyan-400">main</code>, automatically renaming <code className="text-cyan-400">master</code> if needed</li>
                    <li><strong className="text-white">Remote-ahead recovery</strong> — if the remote has commits you don't have locally (e.g. GitHub auto-created a README), bini-deploy fetches and merges automatically with <code className="text-cyan-400">--allow-unrelated-histories -X ours</code>, keeping your local version of any file that exists on both sides. A warning prints before the merge runs; a real conflict stops the process and prints manual recovery steps</li>
                  </ul>
                  <Note>
                    This means you can run <code>bini-deploy</code> multiple times without accidentally pushing to the wrong repository.
                  </Note>
                </m.section>

                {/* Requirements */}
                <m.section id="requirements" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Requirements</h2>
                  <Table
                    headers={['Requirement', 'Version']}
                    rows={[
                      ['Node.js', '>= 18'],
                      ['Vite', '>= 6'],
                      ['git', 'available on your PATH'],
                      ['GitHub repository', 'created ahead of time, to push to'],
                    ]}
                  />
                </m.section>

                {/* Previous Navigation (this is the last page in Deployment) */}
                <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="flex items-center justify-start pt-8 mt-8 border-t border-slate-800">
                  <Link to="/docs/static-export" className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <div>
                      <div className="text-xs text-slate-500">Previous</div>
                      <div className="text-sm font-medium">Static Export</div>
                    </div>
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