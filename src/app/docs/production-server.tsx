// src/pages/docs/production-server/page.tsx
import React from 'react'
import { m } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Header } from '../../components/Layout'
import { DocLayout } from '../../components/DocSidebar'
import { CopyPageButton } from '../../components/CopyPageButton'
import { TableOfContents, type TocItem } from '../../components/TableOfContents'
import { siNodedotjs } from 'simple-icons'
import type { SimpleIcon as SimpleIconType } from 'simple-icons'

// ────────────────────────────────────────────────────────────────────────────────
// "On this page" entries
// ────────────────────────────────────────────────────────────────────────────────
const TOC_ITEMS: TocItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'features', label: 'Features' },
  { id: 'installation', label: 'Installation' },
  { id: 'usage', label: 'Usage' },
  { id: 'keyboard-shortcuts', label: 'Keyboard Shortcuts' },
  { id: 'environment-variables', label: 'Environment Variables' },
  { id: 'project-structure', label: 'Project Structure' },
  { id: 'api-routes', label: 'API Routes' },
  { id: 'cors', label: 'CORS' },
  { id: 'static-file-serving', label: 'Static File Serving' },
  { id: 'vs-vite-preview', label: 'vs vite preview' },
  { id: 'security', label: 'Security' },
  { id: 'deployment', label: 'Deployment' },
  { id: 'api-reference', label: 'API Reference' },
]

const PAGE_TITLE = 'Production Server'
const PAGE_URL = 'https://bini.js.org/docs/production-server'
const EDIT_URL = 'https://github.com/Binidu01/bini-offical/edit/main/src/app/docs/production-server.tsx'

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
    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 my-6">
      <div className="text-sm text-slate-300 [&>strong]:text-white [&>code]:text-cyan-400 [&>code]:bg-slate-800 [&>code]:px-1 [&>code]:py-0.5 [&>code]:rounded">
        {children}
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────────
// Feature Card Component
// ────────────────────────────────────────────────────────────────────────────────
function FeatureCard({ emoji, title, description }: { emoji: string; title: string; description: string }) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 hover:border-slate-700 transition-colors">
      <div className="flex items-start gap-3">
        <span className="text-xl leading-none">{emoji}</span>
        <div>
          <h4 className="text-sm font-semibold text-white mb-1">{title}</h4>
          <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────────
// Production Server Page
// ────────────────────────────────────────────────────────────────────────────────
export default function ProductionServerPage() {
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
                    <p className="text-slate-400 text-sm">A zero-dependency, secure-by-default production server for your Bini.js app, powered by <code className="text-cyan-400 bg-slate-800 px-1 py-0.5 rounded">bini-server</code>.</p>
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
                    <code className="text-cyan-400">bini-server</code> is the default production server for the Node.js hosting target. It streams your built <code className="text-cyan-400">dist/</code> folder, serves <code className="text-cyan-400">/api/*</code> routes directly from <code className="text-cyan-400">src/app/api/</code>, and adds everything <code className="text-cyan-400">vite preview</code> intentionally leaves out — ETag caching, timeouts, graceful shutdown, and configurable body limits.
                  </p>
                  <p className="text-slate-300 mb-6">
                    It has <strong className="text-white">zero runtime dependencies</strong> — only Node.js built-in modules — and works identically on Windows, macOS, and Linux.
                  </p>
                  <Note>
                    <strong>Requirements:</strong> Node.js <code>≥ 20.19.0</code>, a built <code>dist/</code> folder, and API handlers under <code>src/app/api/</code> (if your app uses any).
                  </Note>
                </m.section>

                {/* Features */}
                <m.section id="features" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Features</h2>

                  <h3 className="text-lg font-semibold text-white mt-2 mb-3">Core</h3>
                  <div className="grid sm:grid-cols-2 gap-3 mb-6">
                    <FeatureCard emoji="🗂️" title="Static file serving" description="Streams dist/ with correct MIME types, ETag, and cache headers." />
                    <FeatureCard emoji="🌐" title="API routes" description="Serves /api/* from src/app/api/ — Hono apps and plain functions both work." />
                    <FeatureCard emoji="🔀" title="SPA fallback" description="Unknown routes automatically serve dist/index.html." />
                    <FeatureCard emoji="🏷️" title="ETag support" description="304 Not Modified responses for unchanged static files." />
                    <FeatureCard emoji="⚡" title="Lazy route loading" description="API routes are scanned on first request for fast cold starts." />
                  </div>

                  <h3 className="text-lg font-semibold text-white mt-2 mb-3">Security & Performance</h3>
                  <div className="grid sm:grid-cols-2 gap-3 mb-6">
                    <FeatureCard emoji="🛡️" title="CORS" description="Enabled by default, configurable via CORS_ENABLED (BINI_*, VITE_*, or no prefix)." />
                    <FeatureCard emoji="🔒" title="Body limits" description="Configurable request body size limit, defaults to 10MB." />
                    <FeatureCard emoji="⏱️" title="Timeouts" description="Configurable body-read and handler timeouts, default 30s each." />
                    <FeatureCard emoji="🚫" title="Path traversal protection" description="Guards against .. and // in request URLs." />
                    <FeatureCard emoji="💾" title="Module cache" description="Caches imported handlers with mtime invalidation." />
                    <FeatureCard emoji="🔌" title="Port auto-increment" description="Starts at 3000, auto-increments if the port is busy." />
                  </div>

                  <h3 className="text-lg font-semibold text-white mt-2 mb-3">Developer Experience</h3>
                  <div className="grid sm:grid-cols-2 gap-3 mb-4">
                    <FeatureCard emoji="🌿" title="Auto env loading" description=".env files are detected and listed in the startup banner." />
                    <FeatureCard emoji="⌨️" title="Interactive shortcuts" description="Press h for help, o to open the browser, q to quit." />
                    <FeatureCard emoji="🖥️" title="Cross-platform" description="Works identically on Windows, macOS, and Linux." />
                    <FeatureCard emoji="🪄" title="Graceful shutdown" description="Handles SIGTERM + SIGINT with a timeout fallback." />
                    <FeatureCard emoji="📦" title="Zero dependencies" description="Only Node.js built-in modules — nothing to audit or update." />
                    <FeatureCard emoji="🔧" title="Flexible config" description="Every setting supports BINI_*, VITE_*, or no-prefix env vars." />
                  </div>
                </m.section>

                {/* Installation */}
                <m.section id="installation" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Installation</h2>
                  <p className="text-slate-300 mb-4">
                    Every Bini.js web scaffold already includes <code className="text-cyan-400">bini-server</code>. To add it to an existing project:
                  </p>
                  <CodeBlock code={`npm install bini-server`} />
                </m.section>

                {/* Usage */}
                <m.section id="usage" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Usage</h2>

                  <h3 className="text-lg font-semibold text-white mt-2 mb-3">1. Add scripts to package.json</h3>
                  <CodeBlock
                    filename="package.json"
                    code={`{
  "scripts": {
    "build": "vite build",
    "start": "bini-server"
  }
}`}
                  />

                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">2. Build and start</h3>
                  <CodeBlock
                    code={`npm run build   # Build your app
npm start       # Serve in production`}
                  />

                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">3. Terminal output</h3>
                  <CodeBlock
                    code={`  ß Bini.js  (production)
  ➜  Environments: .env, .env.local
  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.1.5:3000/
  ➜  press h + enter to show help`}
                  />
                </m.section>

                {/* Keyboard Shortcuts */}
                <m.section id="keyboard-shortcuts" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Keyboard Shortcuts</h2>
                  <p className="text-slate-300 mb-4">
                    While the server is running, type a key and press enter:
                  </p>
                  <Table
                    headers={['Key', 'Action']}
                    rows={[
                      [<code className="text-cyan-400">h</code>, 'Show available shortcuts'],
                      [<code className="text-cyan-400">o</code>, 'Open your app in the default browser'],
                      [<code className="text-cyan-400">q</code>, 'Quit the server'],
                    ]}
                  />
                  <Note>
                    Keyboard shortcuts are automatically disabled in non-interactive environments, like Render or CI/CD.
                  </Note>
                </m.section>

                {/* Environment Variables */}
                <m.section id="environment-variables" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Environment Variables</h2>

                  <h3 className="text-lg font-semibold text-white mt-2 mb-3">Auto-detected .env files</h3>
                  <p className="text-slate-300 mb-4">At startup, bini-server automatically detects and loads, in priority order:</p>
                  <ul className="space-y-2 text-slate-300 mb-4 list-disc list-inside">
                    <li><code className="text-cyan-400">.env.local</code></li>
                    <li><code className="text-cyan-400">.env.[NODE_ENV].local</code> (e.g. <code className="text-cyan-400">.env.production.local</code>)</li>
                    <li><code className="text-cyan-400">.env.[NODE_ENV]</code> (e.g. <code className="text-cyan-400">.env.production</code>)</li>
                    <li><code className="text-cyan-400">.env</code></li>
                  </ul>
                  <p className="text-slate-300 mb-6">All detected files are listed in the startup banner.</p>

                  <h3 className="text-lg font-semibold text-white mt-2 mb-3">Naming conventions</h3>
                  <p className="text-slate-300 mb-4">Every setting supports three naming conventions, in priority order:</p>
                  <Table
                    headers={['Convention', 'Example', 'Priority']}
                    rows={[
                      [<code className="text-cyan-400">BINI_*</code>, <code className="text-cyan-400">BINI_PORT=3000</code>, 'Highest'],
                      [<code className="text-cyan-400">VITE_*</code>, <code className="text-cyan-400">VITE_PORT=3000</code>, 'Medium'],
                      ['No prefix', <code className="text-cyan-400">PORT=3000</code>, 'Lowest'],
                    ]}
                  />

                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Server configuration</h3>
                  <Table
                    headers={['Variable', 'Default', 'Description']}
                    rows={[
                      [<code className="text-cyan-400">PORT</code>, '3000', 'HTTP port to listen on'],
                      [<code className="text-cyan-400">CORS_ENABLED</code>, 'true', 'Enable/disable CORS on API routes'],
                      [<code className="text-cyan-400">API_DIR</code>, <code className="text-cyan-400">src/app/api</code>, 'Path to API handlers directory'],
                      [<code className="text-cyan-400">DIST_DIR</code>, <code className="text-cyan-400">dist</code>, 'Path to static files directory'],
                      [<code className="text-cyan-400">BODY_TIMEOUT_SECS</code>, '30', 'Max seconds to read the request body'],
                      [<code className="text-cyan-400">HANDLER_TIMEOUT_SECS</code>, '30', 'Max seconds for a handler to respond'],
                      [<code className="text-cyan-400">BODY_SIZE_LIMIT</code>, '10485760', 'Max request body size in bytes (10MB)'],
                    ]}
                  />

                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Examples</h3>
                  <CodeBlock
                    filename=".env"
                    code={`PORT=8080
CORS_ENABLED=false
API_DIR=src/api
BODY_SIZE_LIMIT=5242880  # 5MB`}
                  />
                  <CodeBlock
                    code={`# Inline
PORT=3001 BINI_CORS_ENABLED=false bini-server

# Or with the VITE prefix
VITE_PORT=3000 VITE_CORS_ENABLED=false bini-server`}
                  />
                </m.section>

                {/* Project Structure */}
                <m.section id="project-structure" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Project Structure</h2>
                  <CodeBlock
                    code={`my-app/
├── dist/                    # Built static files (required)
│   ├── index.html
│   ├── assets/
│   └── ...
├── src/
│   ├── app/
│   │   ├── api/            # API handlers (optional)
│   │   │   ├── users.ts
│   │   │   └── posts/
│   │   │       ├── index.ts
│   │   │       └── [id].ts
│   │   └── layout.tsx
│   └── main.tsx
├── .env                     # Environment variables
├── package.json
└── vite.config.ts`}
                  />
                </m.section>

                {/* API Routes */}
                <m.section id="api-routes" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">API Routes</h2>

                  <h3 className="text-lg font-semibold text-white mt-2 mb-3">Supported formats</h3>
                  <CodeBlock
                    code={`// 1. Hono App (recommended)
import { Hono } from 'hono';
const app = new Hono();
app.get('/users', (c) => c.json({ users: [] }));
export default app;

// 2. Plain function
export default (req: Request) => {
  return Response.json({ message: 'Hello' });
};`}
                  />
                  <Note>
                    Only <code>.ts</code> and <code>.js</code> files are supported for API routes — the same convention used by <code>bini-router</code>.
                  </Note>

                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Dynamic routes</h3>
                  <CodeBlock
                    code={`src/app/api/
  users/
    [id].ts      → /api/users/:id
  posts/
    [...slug].ts → /api/posts/*`}
                  />

                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Route parameters</h3>
                  <p className="text-slate-300 mb-4">
                    For plain function handlers, route params are passed as JSON via the <code className="text-cyan-400">x-bini-params</code> request header:
                  </p>
                  <CodeBlock
                    filename="src/app/api/users/[id].ts"
                    code={`export default (req: Request) => {
  const params = JSON.parse(req.headers.get('x-bini-params') || '{}');
  // params.id → '123'
  return Response.json({ id: params.id });
};`}
                  />
                </m.section>

                {/* CORS */}
                <m.section id="cors" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">CORS</h2>
                  <p className="text-slate-300 mb-4">CORS is enabled by default with these headers:</p>
                  <CodeBlock
                    code={`Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET,POST,PUT,PATCH,DELETE,OPTIONS,HEAD
Access-Control-Allow-Headers: Content-Type,Authorization,X-Request-ID`}
                  />
                  <p className="text-slate-300 mb-2">
                    Disable it with <code className="text-cyan-400">CORS_ENABLED=false</code>, <code className="text-cyan-400">BINI_CORS_ENABLED=false</code>, or <code className="text-cyan-400">VITE_CORS_ENABLED=false</code>.
                  </p>
                </m.section>

                {/* Static File Serving */}
                <m.section id="static-file-serving" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Static File Serving</h2>

                  <h3 className="text-lg font-semibold text-white mt-2 mb-3">Supported MIME types</h3>
                  <ul className="space-y-2 text-slate-300 mb-6 list-disc list-inside">
                    <li>HTML, CSS, JavaScript, JSON</li>
                    <li>Images — PNG, JPEG, GIF, SVG, WebP, AVIF, ICO</li>
                    <li>Fonts — WOFF, WOFF2, TTF, EOT</li>
                    <li>Documents — TXT, XML</li>
                    <li>Web manifests</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-white mt-2 mb-3">Cache headers</h3>
                  <Table
                    headers={['File Type', 'Cache Policy']}
                    rows={[
                      [<code className="text-cyan-400">/assets/*</code>, <code className="text-cyan-400">public, max-age=31536000, immutable</code>],
                      ['All other files', <code className="text-cyan-400">no-cache</code>],
                    ]}
                  />

                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">ETag support</h3>
                  <p className="text-slate-300 mb-2">ETags are generated automatically from file size + mtimeMs:</p>
                  <ul className="space-y-2 text-slate-300 mb-2 list-disc list-inside">
                    <li>Sends an <code className="text-cyan-400">ETag</code> header on the first request</li>
                    <li>Handles <code className="text-cyan-400">If-None-Match</code> for 304 Not Modified responses</li>
                    <li>Uses an MD5 hash (16 chars) for efficient caching</li>
                  </ul>
                </m.section>

                {/* vs vite preview */}
                <m.section id="vs-vite-preview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">vs vite preview</h2>
                  <Table
                    headers={['Feature', 'vite preview', 'bini-server']}
                    rows={[
                      ['Serves dist/', <CheckCircle className="w-4 h-4 text-emerald-400" />, <CheckCircle className="w-4 h-4 text-emerald-400" />],
                      ['API routes', <CheckCircle className="w-4 h-4 text-emerald-400" />, <CheckCircle className="w-4 h-4 text-emerald-400" />],
                      ['SPA fallback', <CheckCircle className="w-4 h-4 text-emerald-400" />, <CheckCircle className="w-4 h-4 text-emerald-400" />],
                      ['Auto env loading', <CheckCircle className="w-4 h-4 text-emerald-400" />, <CheckCircle className="w-4 h-4 text-emerald-400" />],
                      ['ETag / 304 support', <XCircle className="w-4 h-4 text-rose-400" />, <CheckCircle className="w-4 h-4 text-emerald-400" />],
                      ['Body timeout', <XCircle className="w-4 h-4 text-rose-400" />, <span>✅ (30s)</span>],
                      ['Body size limit', <XCircle className="w-4 h-4 text-rose-400" />, <span>✅ (10MB)</span>],
                      ['Handler timeout', <XCircle className="w-4 h-4 text-rose-400" />, <span>✅ (30s)</span>],
                      ['Graceful shutdown', <XCircle className="w-4 h-4 text-rose-400" />, <CheckCircle className="w-4 h-4 text-emerald-400" />],
                      ['Module cache', <XCircle className="w-4 h-4 text-rose-400" />, <CheckCircle className="w-4 h-4 text-emerald-400" />],
                      ['Configurable dirs', <XCircle className="w-4 h-4 text-rose-400" />, <CheckCircle className="w-4 h-4 text-emerald-400" />],
                      ['CORS control', <XCircle className="w-4 h-4 text-rose-400" />, <CheckCircle className="w-4 h-4 text-emerald-400" />],
                      ['Zero dependencies', <XCircle className="w-4 h-4 text-rose-400" />, <CheckCircle className="w-4 h-4 text-emerald-400" />],
                      ['Production use', <span className="text-amber-400">⚠️ Not recommended</span>, <span className="text-emerald-400">✅ Production-ready</span>],
                    ]}
                  />
                </m.section>

                {/* Security */}
                <m.section id="security" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Security</h2>
                  <Table
                    headers={['Feature', 'Default', 'Configurable']}
                    rows={[
                      ['CORS', 'Enabled', <span>✅ via <code className="text-cyan-400 bg-slate-800 px-1 py-0.5 rounded">CORS_ENABLED</code></span>],
                      ['Body size limit', '10MB', <span>✅ via <code className="text-cyan-400 bg-slate-800 px-1 py-0.5 rounded">BODY_SIZE_LIMIT</code></span>],
                      ['Request timeout', '30s', <span>✅ via <code className="text-cyan-400 bg-slate-800 px-1 py-0.5 rounded">BODY_TIMEOUT_SECS</code></span>],
                      ['Handler timeout', '30s', <span>✅ via <code className="text-cyan-400 bg-slate-800 px-1 py-0.5 rounded">HANDLER_TIMEOUT_SECS</code></span>],
                      ['Path traversal', 'Blocked', '✅ (guard in place)'],
                    ]}
                  />

                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Testing your server</h3>
                  <CodeBlock
                    code={`# Check static files
curl http://localhost:3000/

# Check API routes
curl http://localhost:3000/api/hello

# Check ETag
curl -I http://localhost:3000/styles.css

# Test 304 Not Modified
curl -I http://localhost:3000/styles.css \\
  -H "If-None-Match: [etag_from_previous_request]"

# Test CORS
curl -X OPTIONS http://localhost:3000/api/hello \\
  -H "Origin: http://example.com"`}
                  />

                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Configuration examples</h3>
                  <p className="text-slate-300 mb-2 text-sm font-medium">Development (all security disabled)</p>
                  <CodeBlock
                    filename=".env"
                    code={`CORS_ENABLED=true
BODY_TIMEOUT_SECS=0
HANDLER_TIMEOUT_SECS=0
BODY_SIZE_LIMIT=0
NODE_ENV=development`}
                  />
                  <p className="text-slate-300 mb-2 text-sm font-medium">Production (secure defaults)</p>
                  <CodeBlock
                    filename=".env"
                    code={`CORS_ENABLED=true
BODY_TIMEOUT_SECS=30
HANDLER_TIMEOUT_SECS=30
BODY_SIZE_LIMIT=10485760
NODE_ENV=production`}
                  />
                  <p className="text-slate-300 mb-2 text-sm font-medium">Internal API (no CORS)</p>
                  <CodeBlock
                    filename=".env"
                    code={`CORS_ENABLED=false
BODY_SIZE_LIMIT=5242880  # 5MB`}
                  />
                  <p className="text-slate-300 mb-2 text-sm font-medium">File upload service</p>
                  <CodeBlock
                    filename=".env"
                    code={`CORS_ENABLED=true
BODY_SIZE_LIMIT=1073741824  # 1GB
BODY_TIMEOUT_SECS=300  # 5 minutes`}
                  />
                </m.section>

                {/* Deployment */}
                <m.section id="deployment" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2 flex items-center gap-2">
                    <SimpleIcon icon={siNodedotjs} className="text-green-400" size={20} />
                    Deployment
                  </h2>
                  <Note>
                    <strong>Ship your src/ folder.</strong> bini-server runs API handlers directly from <code>src/app/api/</code> — they are not compiled into <code>dist/</code>. Make sure your host has access to both <code>dist/</code> and <code>src/app/api/</code>.
                  </Note>

                  <h3 className="text-lg font-semibold text-white mt-4 mb-3">Where it works</h3>
                  <ul className="space-y-2 text-slate-300 mb-6 list-disc list-inside">
                    <li><strong className="text-white">VPS / pm2</strong> — deploy the full project directory</li>
                    <li><strong className="text-white">Railway / Render / Fly.io</strong> — automatic, since these clone your repository</li>
                    <li><strong className="text-white">Docker</strong> — copy both <code>dist/</code> and <code>src/</code> into the image</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-white mt-2 mb-3">VPS / dedicated server</h3>
                  <CodeBlock
                    code={`npm run build
npm start

# With pm2 (recommended)
npm install -g pm2
pm2 start "npm start" --name my-app
pm2 save
pm2 startup`}
                  />

                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Platform as a Service</h3>
                  <Table
                    headers={['Platform', 'Start Command', 'Notes']}
                    rows={[
                      ['Railway', <code className="text-cyan-400">npm start</code>, 'PORT injected automatically'],
                      ['Render', <code className="text-cyan-400">npm start</code>, 'PORT injected automatically'],
                      ['Fly.io', <code className="text-cyan-400">npm start</code>, 'See fly.toml example below'],
                      ['Heroku', <code className="text-cyan-400">npm start</code>, 'PORT injected automatically'],
                    ]}
                  />

                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Docker</h3>
                  <CodeBlock
                    filename="Dockerfile"
                    code={`FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]`}
                  />

                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Fly.io</h3>
                  <CodeBlock
                    filename="fly.toml"
                    code={`[processes]
  app = "npm start"`}
                  />
                </m.section>

                {/* API Reference */}
                <m.section id="api-reference" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">API Reference</h2>

                  <h3 className="text-lg font-semibold text-white mt-2 mb-3">Environment variable priority</h3>
                  <ol className="space-y-1 text-slate-300 mb-6 list-decimal list-inside">
                    <li><code className="text-cyan-400">BINI_*</code> (highest)</li>
                    <li><code className="text-cyan-400">VITE_*</code> (medium)</li>
                    <li>No prefix (lowest)</li>
                  </ol>

                  <h3 className="text-lg font-semibold text-white mt-2 mb-3">HTTP status codes</h3>
                  <Table
                    headers={['Code', 'Description']}
                    rows={[
                      [<code className="text-cyan-400">200</code>, 'Success'],
                      [<code className="text-cyan-400">204</code>, 'OPTIONS preflight success'],
                      [<code className="text-cyan-400">304</code>, 'Not Modified (ETag match)'],
                      [<code className="text-cyan-400">400</code>, 'Bad request URL'],
                      [<code className="text-cyan-400">404</code>, 'Route not found'],
                      [<code className="text-cyan-400">408</code>, 'Request timeout'],
                      [<code className="text-cyan-400">413</code>, 'Payload too large'],
                      [<code className="text-cyan-400">500</code>, 'Internal server error'],
                    ]}
                  />

                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">Supported HTTP methods</h3>
                  <p className="text-slate-300">
                    <code className="text-cyan-400">GET</code>, <code className="text-cyan-400">POST</code>, <code className="text-cyan-400">PUT</code>, <code className="text-cyan-400">PATCH</code>, <code className="text-cyan-400">DELETE</code>, <code className="text-cyan-400">OPTIONS</code> (CORS preflight), and <code className="text-cyan-400">HEAD</code> (with ETag support).
                  </p>
                </m.section>

                {/* Previous / Next Navigation */}
                <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="flex items-center justify-between pt-8 mt-8 border-t border-slate-800">
                  <Link to="/docs/deploying" className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <div>
                      <div className="text-xs text-slate-500">Previous</div>
                      <div className="text-sm font-medium">Deploying</div>
                    </div>
                  </Link>
                  <Link to="/docs/static-export" className="group flex items-center gap-2 text-right text-slate-400 hover:text-white transition-colors">
                    <div>
                      <div className="text-xs text-slate-500">Next</div>
                      <div className="text-sm font-medium">Static Export</div>
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