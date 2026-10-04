// src/app/docs/platform-web.tsx
import {
  C,
  Callout,
  CodeBlock,
  DocPage,
  H3,
  MultiTerminal,
  P,
  PromptOutput,
  Section,
  Table,
  UL,
  useDocLang,
  type TerminalTab,
} from '../../components/DocBlocks'
import { FeatureCard, RouteVisual } from '../../components/DocVisuals'
import type { TocItem } from '../../components/TableOfContents'

const TOC_ITEMS: TocItem[] = [
  { id: 'web-overview', label: 'Web Overview' },
  { id: 'requirements', label: 'Requirements' },
  { id: 'windows', label: 'Windows' },
  { id: 'macos', label: 'macOS' },
  { id: 'linux', label: 'Linux' },
  { id: 'development-server', label: 'Development Server' },
  { id: 'production-server', label: 'Production Server' },
  { id: 'prerendering', label: 'Pre-rendering' },
  { id: 'deployment', label: 'Deployment' },
]

const STRONG = 'font-medium text-neutral-900 dark:text-neutral-100'

/* ---------- terminal tabs ---------- */

const CREATE_AND_INSTALL_TABS: TerminalTab[] = [
  {
    id: 'npm',
    label: 'npm',
    command: `$ npx create-bini-app@latest my-app --platform web
$ cd my-app
$ npm install`,
  },
  {
    id: 'pnpm',
    label: 'pnpm',
    command: `$ pnpm dlx create-bini-app@latest my-app --platform web
$ cd my-app
$ pnpm install`,
  },
  {
    id: 'yarn',
    label: 'yarn',
    command: `$ yarn dlx create-bini-app@latest my-app --platform web
$ cd my-app
$ yarn install`,
  },
  {
    id: 'bun',
    label: 'bun',
    command: `$ bunx create-bini-app@latest my-app --platform web
$ cd my-app
$ bun install`,
  },
]

const INTERACTIVE_TABS: TerminalTab[] = [
  { id: 'npm', label: 'npm', command: `$ npx create-bini-app@latest` },
  { id: 'pnpm', label: 'pnpm', command: `$ pnpm dlx create-bini-app@latest` },
  { id: 'yarn', label: 'yarn', command: `$ yarn dlx create-bini-app@latest` },
  { id: 'bun', label: 'bun', command: `$ bunx create-bini-app@latest` },
]

const DEV_TABS: TerminalTab[] = [
  { id: 'npm', label: 'npm', command: `$ npm run dev` },
  { id: 'pnpm', label: 'pnpm', command: `$ pnpm dev` },
  { id: 'yarn', label: 'yarn', command: `$ yarn dev` },
  { id: 'bun', label: 'bun', command: `$ bun run dev` },
]

const BUILD_TABS: TerminalTab[] = [
  { id: 'npm', label: 'npm', command: `$ npm run build` },
  { id: 'pnpm', label: 'pnpm', command: `$ pnpm build` },
  { id: 'yarn', label: 'yarn', command: `$ yarn build` },
  { id: 'bun', label: 'bun', command: `$ bun run build` },
]

const BUILD_START_TABS: TerminalTab[] = [
  { id: 'npm', label: 'npm', command: `$ npm run build\n$ npm start` },
  { id: 'pnpm', label: 'pnpm', command: `$ pnpm build\n$ pnpm start` },
  { id: 'yarn', label: 'yarn', command: `$ yarn build\n$ yarn start` },
  { id: 'bun', label: 'bun', command: `$ bun run build\n$ bun run start` },
]

const DEPLOY_TABS: TerminalTab[] = [
  { id: 'npm', label: 'npm', command: `$ npm run deploy` },
  { id: 'pnpm', label: 'pnpm', command: `$ pnpm deploy` },
  { id: 'yarn', label: 'yarn', command: `$ yarn deploy` },
  { id: 'bun', label: 'bun', command: `$ bun run deploy` },
]

const NODE_TABS: TerminalTab[] = [
  { id: 'npm', label: 'npm', command: `$ npm run build && npm start` },
  { id: 'pnpm', label: 'pnpm', command: `$ pnpm build && pnpm start` },
  { id: 'yarn', label: 'yarn', command: `$ yarn build && yarn start` },
  { id: 'bun', label: 'bun', command: `$ bun run build && bun run start` },
]

/* ---------- shared "create project" block ---------- */

function ScaffoldBlock() {
  return (
    <>
      <H3 className="mt-6 mb-3">Create the Project</H3>
      <P className="mb-4">
        Create a new Bini.js project targeting Web and install its dependencies:
      </P>
      <MultiTerminal tabs={CREATE_AND_INSTALL_TABS} />
      <P className="mb-4">
        Or use the interactive prompt and select <C>Web Application</C>:
      </P>
      <MultiTerminal tabs={INTERACTIVE_TABS} />
      <PromptOutput
        lines={[
          { kind: 'question', text: 'Select target platform:' },
          { kind: 'option', text: 'Web Application', selected: true },
          { kind: 'option', text: 'Windows Desktop' },
          { kind: 'option', text: 'Linux Desktop' },
          { kind: 'option', text: 'macOS Desktop' },
          { kind: 'option', text: 'Android' },
          { kind: 'option', text: 'iOS' },
          { kind: 'blank' },
          { kind: 'hint', text: '↑↓ navigate • ⏎ select' },
        ]}
      />
    </>
  )
}

/* ---------- Windows / macOS / Linux sections ---------- */

function WindowsSection() {
  return (
    <Section id="windows" title="Windows">
      <P className="mb-4">
        On Windows you can scaffold, develop, and build the app entirely on your own machine - no
        CI required. Web apps are pure JavaScript/TypeScript, so no native toolchain is needed.
      </P>

      <H3 className="mt-6 mb-3">Step 1: Install the tools</H3>
      <UL>
        <li>
          Node.js <strong className={STRONG}>20.19.0</strong> or higher
        </li>
        <li>
          Git for Windows - <C>winget install --id Git.Git</C> or download from <C>git-scm.com</C>
        </li>
      </UL>

      <H3 className="mt-6 mb-3">Step 2: Create the project</H3>
      <ScaffoldBlock />

      <H3 className="mt-6 mb-3">Step 3: Develop</H3>
      <P className="mb-4">
        Run <C>dev</C> to start the Vite dev server with HMR:
      </P>
      <MultiTerminal tabs={DEV_TABS} />

      <Callout>
        <strong>Tip:</strong> Web is the default platform - <C>--platform web</C> is optional.
      </Callout>
    </Section>
  )
}

function MacosSection() {
  return (
    <Section id="macos" title="macOS">
      <P className="mb-4">
        On macOS you can scaffold, develop, and build the app entirely on your own machine - no
        CI required. Web apps are pure JavaScript/TypeScript, so no native toolchain is needed.
      </P>

      <H3 className="mt-6 mb-3">Step 1: Install the tools</H3>
      <UL>
        <li>
          Node.js <strong className={STRONG}>20.19.0</strong> or higher
        </li>
        <li>
          Git - comes with Xcode Command Line Tools. Run <C>xcode-select --install</C> if you do
          not have it yet.
        </li>
      </UL>

      <H3 className="mt-6 mb-3">Step 2: Create the project</H3>
      <ScaffoldBlock />

      <H3 className="mt-6 mb-3">Step 3: Develop</H3>
      <P className="mb-4">
        Run <C>dev</C> to start the Vite dev server with HMR:
      </P>
      <MultiTerminal tabs={DEV_TABS} />

      <Callout>
        <strong>Tip:</strong> Web is the default platform - <C>--platform web</C> is optional.
      </Callout>
    </Section>
  )
}

function LinuxSection() {
  return (
    <Section id="linux" title="Linux">
      <P className="mb-4">
        On Linux you can scaffold, develop, and build the app entirely on your own machine - no
        CI required. Web apps are pure JavaScript/TypeScript, so no native toolchain is needed.
      </P>

      <H3 className="mt-6 mb-3">Step 1: Install the tools</H3>
      <UL>
        <li>
          Node.js <strong className={STRONG}>20.19.0</strong> or higher
        </li>
        <li>
          Git with your package manager, for example <C>sudo apt install git</C> on Debian and
          Ubuntu.
        </li>
      </UL>

      <H3 className="mt-6 mb-3">Step 2: Create the project</H3>
      <ScaffoldBlock />

      <H3 className="mt-6 mb-3">Step 3: Develop</H3>
      <P className="mb-4">
        Run <C>dev</C> to start the Vite dev server with HMR:
      </P>
      <MultiTerminal tabs={DEV_TABS} />

      <Callout>
        <strong>Tip:</strong> Web is the default platform - <C>--platform web</C> is optional.
      </Callout>
    </Section>
  )
}

/* ---------- content ---------- */

function Content() {
  const lang = useDocLang()
  const t = lang === 'js' ? 'js' : 'ts' // plain .ts / .js files
  const e = lang === 'js' ? 'jsx' : 'tsx' // React files

  return (
    <>
      <Section id="web-overview" title="Web Overview">
        <P className="mb-4">
          Web is the default platform target in Bini.js. It is a standard Vite + React SPA with
          file-based routing, pre-rendering support, and a Hono API layer. Your application runs in
          the browser and can be deployed to any hosting platform.
        </P>
        <div className="grid gap-3 sm:grid-cols-3">
          <FeatureCard title="SPA" text="Single-page application with client-side routing" />
          <FeatureCard title="API Layer" text="Hono-powered API routes in src/app/api/" />
          <FeatureCard title="Pre-rendering" text="Static HTML with bini-ssg" />
        </div>
        <Callout>
          Web is the default platform on every OS - no <C>--platform</C> flag required.
        </Callout>
      </Section>

      <Section id="requirements" title="Requirements">
        <P className="mb-4">
          Web apps are pure JavaScript/TypeScript, so no native toolchain is needed. The only
          prerequisites are Node.js and Git - they work the same on every OS.
        </P>
        <UL>
          <li>
            Node.js <strong className={STRONG}>20.19.0</strong> or higher
          </li>
          <li>
            Git - comes with Xcode Command Line Tools on macOS, <C>sudo apt install git</C> on
            Linux, and <C>winget install --id Git.Git</C> on Windows
          </li>
        </UL>
        <Callout>
          You do not need Rust, Xcode, MSVC, or any platform-specific SDK to build a web app. Those
          are only required when targeting native desktop or mobile platforms.
        </Callout>
      </Section>

      <WindowsSection />
      <MacosSection />
      <LinuxSection />

      <Section id="development-server" title="Development Server">
        <P className="mb-4">
          Start the development server with HMR (Hot Module Replacement). This command is the same
          on every OS:
        </P>
        <MultiTerminal tabs={DEV_TABS} />
        <P className="mb-4">The dev server provides:</P>
        <UL>
          <li>Fast refresh with HMR</li>
          <li>File-based routing with live updates</li>
          <li>
            API routes served at <C>/api/*</C>
          </li>
          <li>
            Environment variables from <C>.env</C> files
          </li>
          <li>
            Error overlay with <C>bini-overlay</C>
          </li>
        </UL>
      </Section>

      <Section id="production-server" title="Production Server">
        <P className="mb-4">Build and serve your application in production mode:</P>
        <MultiTerminal tabs={BUILD_START_TABS} />
        <P className="mb-4">
          <C>bini-server</C> is a zero-dependency production server that includes:
        </P>
        <UL>
          <li>Static file serving with ETag/304 caching</li>
          <li>
            API routes from <C>src/app/api/</C>
          </li>
          <li>SPA fallback for client-side routing</li>
          <li>Graceful shutdown</li>
          <li>Configurable timeouts and body limits</li>
        </UL>
      </Section>

      <Section id="prerendering" title="Pre-rendering">
        <P className="mb-4">
          Every route is pre-rendered to static HTML during <C>npm run build</C>. There is no
          separate export command or export mode - <C>bini-ssg</C> drives pre-rendering as part of
          the same build.
        </P>

        <H3 className="mt-6 mb-3">How It Works</H3>
        <P className="mb-4">
          <C>npm run build</C> type-checks (TypeScript projects) and then runs <C>vite build</C>.
          The <C>bini-ssg</C> plugin drives pre-rendering as part of that same build:
        </P>
        <UL>
          <li>
            <strong className={STRONG}>Static routes</strong> (e.g., <C>/</C>, <C>/about</C>) are
            rendered to real server-rendered HTML
          </li>
          <li>
            <strong className={STRONG}>Dynamic routes</strong> (e.g., <C>/blog/:slug</C>) get a
            shell page with hydration
          </li>
          <li>
            <strong className={STRONG}>React 19</strong> <C>renderToPipeableStream</C> is used for
            server rendering
          </li>
          <li>
            <strong className={STRONG}>StaticRouter</strong> from React Router provides the routing
            context
          </li>
        </UL>

        <H3 className="mt-6 mb-3">Your render() Function</H3>
        <P className="mb-4">
          The <C>render()</C> function is exported from <C>{`src/main.${e}`}</C>:
        </P>
        <CodeBlock
          filename={`src/main.${e}`}
          tsCode={`// src/main.tsx
import { createRoot } from 'react-dom/client'
import App from './App'

// Client mount
createRoot(document.getElementById('root')!).render(<App />)

// SSG render (called by bini-ssg, Node-only)
export async function render(url: string): Promise<string> {
  const { renderToString } = await import('react-dom/server')
  const { StaticRouter } = await import('react-router-dom/server')
  const { AppRoutes } = await import('./App')

  return renderToString(
    <StaticRouter location={url}>
      <AppRoutes />
    </StaticRouter>
  )
}`}
          jsCode={`// src/main.jsx
import { createRoot } from 'react-dom/client'
import App from './App'

// Client mount
createRoot(document.getElementById('root')).render(<App />)

// SSG render (called by bini-ssg, Node-only)
export async function render(url) {
  const { renderToString } = await import('react-dom/server')
  const { StaticRouter } = await import('react-router-dom/server')
  const { AppRoutes } = await import('./App')

  return renderToString(
    <StaticRouter location={url}>
      <AppRoutes />
    </StaticRouter>
  )
}`}
        />

        <H3 className="mt-6 mb-3">Build Command</H3>
        <MultiTerminal tabs={BUILD_TABS} />
        <P className="mb-4">
          The output is real server-rendered markup, not a client-only shell. The client then
          hydrates it with <C>hydrateRoot</C> on load.
        </P>

        <H3 className="mt-6 mb-3">Output Structure</H3>
        <P className="mb-4">
          Each route gets its own <C>index.html</C> in <C>dist/</C>:
        </P>
        <RouteVisual
          fileWidth={300}
          rows={[
            { n: 'dist' },
            { n: 'index.html', d: 1, dot: true, url: '/' },
            { n: 'about', d: 1 },
            { n: 'index.html', d: 2, dot: true, url: '/about' },
            { n: 'blog', d: 1 },
            { n: '[slug]', d: 2 },
            { n: 'index.html', d: 3, url: '/blog/:slug' },
            { n: 'docs', d: 1 },
            { n: '[...slug]', d: 2 },
            { n: 'index.html', d: 3, url: '/docs/*' },
            { n: 'js', d: 1 },
            { n: 'index-[hash].js', d: 2 },
            { n: 'css', d: 1 },
            { n: 'index-[hash].css', d: 2 },
          ]}
        />
        <UL>
          <li>
            Highlighted files are fully pre-rendered pages for <C>/</C> and <C>/about</C>
          </li>
          <li>
            <C>/blog/:slug</C> and <C>/docs/*</C> are shell pages
          </li>
          <li>
            <C>js/</C> and <C>css/</C> hold your compiled JavaScript and CSS files
          </li>
        </UL>

        <H3 className="mt-6 mb-3">Hydration and Shell Pages</H3>
        <P className="mb-4">
          For dynamic routes, <C>bini-ssg</C> injects a marker script:
        </P>
        <CodeBlock
          filename="dist/blog/[slug]/index.html"
          lang="text"
          code={`<!-- injected by bini-ssg -->
<script>window.__BINI_SHELL__=true;</script>`}
        />
        <P className="mb-4">Your client entry checks this flag:</P>
        <CodeBlock
          filename={`src/main.${e}`}
          tsCode={`// src/main.tsx
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App'

declare global {
  interface Window {
    __BINI_SHELL__?: boolean
  }
}

const root = document.getElementById('root')!

if (window.__BINI_SHELL__) {
  createRoot(root).render(<App />)
} else {
  hydrateRoot(root, <App />)
}`}
          jsCode={`// src/main.jsx
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App'

const root = document.getElementById('root')

if (window.__BINI_SHELL__) {
  createRoot(root).render(<App />)
} else {
  hydrateRoot(root, <App />)
}`}
        />
      </Section>

      <Section id="deployment" title="Deployment">
        <P className="mb-4">
          <C>bini-deploy</C> is bundled into every scaffold and exposed as <C>npm run deploy</C>.
          For web, it prompts for a hosting target and generates the appropriate configuration.
        </P>

        <H3 className="mt-6 mb-3">Deploy Command</H3>
        <MultiTerminal tabs={DEPLOY_TABS} />

        <H3 className="mt-6 mb-3">Generated Files</H3>
        <P className="mb-4">The target you choose determines what <C>bini-deploy</C> creates:</P>
        <Table
          headers={['Platform', 'Runtime', 'File Generated']}
          rows={[
            ['Node.js', 'Node.js', '- (bini-server reads src/app/api/ directly)'],
            ['Netlify', 'Edge Functions (Deno)', 'netlify/edge-functions/api.ts + netlify.toml'],
            ['Vercel', 'Edge Runtime', 'api/index.ts + vercel.json'],
            ['Cloudflare', 'Workers', 'worker.ts + wrangler.toml'],
            ['Deno', 'Deno', 'server/index.ts'],
          ]}
        />

        <H3 className="mt-6 mb-3">Deployment Options</H3>
        <UL>
          <li>
            <strong className={STRONG}>SPA + API Server:</strong> Build with <C>npm run build</C>,
            deploy with <C>npm start</C> (requires Node.js)
          </li>
          <li>
            <strong className={STRONG}>Pre-rendered Static:</strong> Build with{' '}
            <C>npm run build</C>, deploy the <C>dist/</C> folder to any static hosting
          </li>
          <li>
            <strong className={STRONG}>Edge/Serverless:</strong> Use <C>npm run deploy</C> to
            generate platform-specific entry files
          </li>
        </UL>

        <H3 className="mt-6 mb-3">Node.js Deployment</H3>
        <P className="mb-4">For Node.js hosts (Railway, Render, Fly.io, a VPS):</P>
        <MultiTerminal tabs={NODE_TABS} />
        <P className="mb-4">
          <C>bini-server</C> reads handlers directly from <C>src/app/api/</C>, so deploy the whole
          project - not just <C>dist/</C>. Use <C>pm2</C> on a bare VPS.
        </P>

        <H3 className="mt-6 mb-3">GitHub Pages / Subpaths</H3>
        <P className="mb-4">
          Set <C>base: '/my-repo/'</C> in <C>{`vite.config.${t}`}</C>, then <C>npm run build</C>{' '}
          for a fully pre-rendered, subpath-aware <C>dist/</C>.
        </P>
        <CodeBlock
          filename="vite.config.ts"
          code={`import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { biniroute } from 'bini-router'

export default defineConfig({
  base: '/my-repo/',  // GitHub Pages subpath
  plugins: [react(), biniroute()],
})`}
        />
      </Section>
    </>
  )
}

/* ---------- page ---------- */

export default function PlatformWebPage() {
  return (
    <DocPage
      title="Web"
      description="Build web applications with Bini.js - the default platform target."
      url="https://bini.js.org/docs/platform-web"
      editUrl="https://github.com/Binidu01/bini-official/edit/main/src/app/docs/platform-web.tsx"
      toc={TOC_ITEMS}
      prev={{ to: '/docs/css-modules', title: 'CSS Modules' }}
      next={{ to: '/docs/platform-windows', title: 'Windows' }}
    >
      <Content />
    </DocPage>
  )
}