// src/app/docs/platform-web.tsx
import { Link } from 'react-router-dom'

import {
  C,
  Callout,
  ClackPrompt,
  ClackTerminal,
  CodeBlock,
  DocPage,
  H3,
  MultiTerminal,
  P,
  Section,
  UL,
  useDocLang,
  useDocPm,
  type TerminalTab,
} from '../../components/DocBlocks'
import { FeatureCard, RouteVisual } from '../../components/DocVisuals'
import type { TocItem } from '../../components/TableOfContents'

const TOC_ITEMS: TocItem[] = [
  { id: 'web-overview', label: 'Web Overview' },
  { id: 'requirements', label: 'Requirements' },
  { id: 'create-project', label: 'Create Project' },
  { id: 'development-server', label: 'Development Server' },
  { id: 'production-server', label: 'Production Server' },
  { id: 'prerendering', label: 'Pre-rendering & SEO' },
  { id: 'deployment', label: 'Deployment' },
]

const STRONG = 'font-medium text-neutral-900 dark:text-neutral-100'

/* ---- package-manager tab helpers ---------------------------------- */

const PMS = ['npm', 'pnpm', 'yarn', 'bun'] as const
type Pm = (typeof PMS)[number]

const CREATE: Record<Pm, string> = {
  npm: 'npx create-bini-app@latest',
  pnpm: 'pnpm create bini-app@latest',
  yarn: 'yarn create bini-app@latest',
  bun: 'bun create bini-app@latest',
}

const run = (pm: Pm, script: string, bunRun = true) =>
  pm === 'npm' ? `npm run ${script}` : pm === 'bun' && bunRun ? `bun run ${script}` : `${pm} ${script}`

const tabs = (cmd: (pm: Pm) => string): TerminalTab[] =>
  PMS.map((pm) => ({ id: pm, label: pm, command: cmd(pm) }))

/* ---------- content ---------- */

function Content() {
  const lang = useDocLang()
  const pm = useDocPm()
  const t = lang === 'js' ? 'js' : 'ts'
  const e = lang === 'js' ? 'jsx' : 'tsx'

  return (
    <>
      <Section id="web-overview" title="Web Overview">
        <P className="mb-4">
          Web is the default platform target in Bini.js. It is a standard Vite + React app with
          file-based routing, full static pre-rendering, and a Hono API layer. Your application
          runs in the browser and can be deployed to any hosting platform.
        </P>
        <div className="grid gap-3 sm:grid-cols-3">
          <FeatureCard title="SSG + Hydration" text="Pre-rendered static HTML with zero-JS-lag client hydration" />
          <FeatureCard title="Portable API Layer" text="Hono-powered routes compiled to a single dist/api bundle" />
          <FeatureCard title="Rust-Powered Tooling" text="Vite + Rolldown, Oxlint, and Oxfmt for instant builds" />
        </div>
        <Callout>
          Web is the default platform on every OS. If you run <C>create-bini-app</C> without a{' '}
          <C>--platform</C> flag, the CLI enters interactive mode with Web pre-selected. To skip the
          prompt entirely, pass <C>--platform web</C> explicitly.
        </Callout>
      </Section>

      <Section id="requirements" title="Requirements">
        <P className="mb-4">
          Web apps are pure JavaScript/TypeScript. The only prerequisites are Node.js and Git. The
          setup is identical on Windows, macOS, and Linux.
        </P>
        <UL>
          <li>
            Node.js <strong className={STRONG}>20.19.0</strong> or higher
          </li>
          <li>
            Git - comes with Xcode Command Line Tools on macOS, <C>sudo apt install git</C> on
            Linux, and <C>winget install --id Git.Git</C> on Windows.
          </li>
        </UL>
      </Section>

      <Section id="create-project" title="Create Project">
        <P className="mb-4">
          Create a new Bini.js project targeting Web and install its dependencies:
        </P>
        <MultiTerminal
          tabs={tabs((pm) =>
            [
              `$ ${CREATE[pm]} my-app --platform web`,
              '$ cd my-app',
              pm === 'npm' ? '$ npm install' : pm === 'bun' ? '$ bun install' : `$ ${pm} install`,
            ].join('\n')
          )}
        />
        <P className="mb-4">
          If you omit the <C>--platform</C> flag, the CLI drops into an interactive prompt with{' '}
          <C>Web Application</C> pre-selected. It does not silently scaffold a Web project without the flag:
        </P>
        <MultiTerminal tabs={tabs((pm) => `$ ${CREATE[pm]}`)} />
        <ClackTerminal copyText={`? Platforms? Web`}>
          <ClackPrompt type="multi" title="Platforms?" active isFirst isLast>
            <div className="flex gap-1.5">
              <span className="text-green-500 dark:text-green-400">◼</span>{' '}
              <span className="text-neutral-900 dark:text-neutral-100">Web</span>
            </div>
            <div className="flex gap-1.5">
              <span className="text-neutral-500">◻</span>{' '}
              <span className="text-neutral-500">Desktop (Windows, macOS, Linux)</span>
            </div>
            <div className="flex gap-1.5">
              <span className="text-neutral-500">◻</span>{' '}
              <span className="text-neutral-500">Android</span>
            </div>
            <div className="flex gap-1.5">
              <span className="text-neutral-500">◻</span>{' '}
              <span className="text-neutral-500">iOS</span>
            </div>
            <div className="mt-2 text-[11px] text-neutral-500">
              ↑/↓ to navigate • Space: select • Enter: confirm
            </div>
          </ClackPrompt>
        </ClackTerminal>
      </Section>

      <Section id="development-server" title="Development Server">
        <P className="mb-4">
          Start the development server with HMR (Hot Module Replacement). This command is the same
          on every OS:
        </P>
        <MultiTerminal tabs={tabs((pm) => `$ ${run(pm, 'dev', false)}`)} />
        <P className="mb-4">The dev server provides:</P>
        <UL>
          <li>Fast refresh with HMR</li>
          <li>File-based routing with live updates</li>
          <li>Server rendering for every HTML navigation</li>
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
        <MultiTerminal tabs={tabs((pm) => `$ ${run(pm, 'build')}\n$ ${run(pm, 'start')}`)} />
        <P className="mb-4">
          <C>bini-server</C> is a zero-dependency production server that includes:
        </P>
        <UL>
          <li>Static file serving with ETag/304 caching</li>
          <li>
            API routes from <C>dist/api/index.mjs</C> (compiled during build)
          </li>
          <li>Pre-rendered page serving, with dynamic shell fallbacks</li>
          <li>Graceful shutdown</li>
          <li>Configurable timeouts and body limits</li>
        </UL>
      </Section>

      <Section id="prerendering" title="Pre-rendering & SEO">
        <P className="mb-4">
          Every route is pre-rendered to static HTML during <C>{run(pm, 'build')}</C>. There is no
          separate export command or export mode - <C>bini-ssg</C> drives pre-rendering as part of
          the same Vite build.
        </P>

        <H3 className="mt-6 mb-3">SEO Features</H3>
        <P className="mb-4">
          Bini.js includes advanced SEO and performance features out of the box:
        </P>
        <UL>
          <li>
            <strong className={STRONG}>Static Route Discovery:</strong> <C>bini-ssg</C> automatically discovers every route from <C>bini-router</C> and pre-renders it to a real HTML file.
          </li>
          <li>
            <strong className={STRONG}>Link Crawling:</strong> Internal <C>{'<a href>'}</C> links found in rendered HTML are followed and pre-rendered automatically. There is no depth limit.
          </li>
          <li>
            <strong className={STRONG}>Metadata Injection:</strong> Title tags, descriptions, Open Graph, Twitter cards, canonical URLs, and theme colors are extracted from your <C>export const metadata</C> and injected into the <C>{'<head>'}</C> of every page.
          </li>
          <li>
            <strong className={STRONG}>Head Tag Hoisting:</strong> Any <C>{'<title>'}</C>, <C>{'<meta>'}</C>, or <C>{'<link>'}</C> tags rendered by your React components are automatically hoisted into the document <C>{'<head>'}</C>.
          </li>
          <li>
            <strong className={STRONG}>Route-Scoped CSS:</strong> Only the CSS used by the specific route is loaded on that page, minimizing render-blocking resources.
          </li>
          <li>
            <strong className={STRONG}>Lazy-Loaded Routes:</strong> Every route is automatically code-split and lazy-loaded by <C>bini-router</C>. No <C>React.lazy()</C> boilerplate is needed.
          </li>
          <li>
            <strong className={STRONG}>Instant Paint:</strong> Browsers paint the static HTML immediately while the client-side JavaScript hydrates in the background, delivering a perfect First Contentful Paint (FCP).
          </li>
        </UL>

        <H3 className="mt-6 mb-3">How It Works</H3>
        <P className="mb-4">
          <C>{run(pm, 'build')}</C> runs <C>vite build</C>. The <C>bini-ssg</C> plugin drives pre-rendering as part of that same build:
        </P>
        <UL>
          <li>
            <strong className={STRONG}>Static routes</strong> (e.g., <C>/</C>, <C>/about</C>) are
            rendered to real server-rendered HTML.
          </li>
          <li>
            <strong className={STRONG}>Dynamic routes</strong> (e.g., <C>/blog/:slug</C>) get a
            real HTML page if listed in <C>staticParams</C>, or a shell page for client-side hydration.
          </li>
          <li>
            <strong className={STRONG}>React 19</strong> <C>renderToPipeableStream</C> is used for
            server rendering.
          </li>
        </UL>

        <H3 className="mt-6 mb-3">Build Command</H3>
        <MultiTerminal tabs={tabs((pm) => `$ ${run(pm, 'build')}`)} />
        <P className="mb-4">
          The output is real server-rendered markup. The client then hydrates it with{' '}
          <C>hydrateRoot</C> on load.
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
            { n: 'assets', d: 1 },
            { n: 'index-[hash].js', d: 2 },
            { n: 'index-[hash].css', d: 2 },
            { n: 'api', d: 1 },
            { n: 'index.mjs', d: 2 },
            { n: '404.html', d: 1 },
          ]}
        />
        <UL>
          <li>
            Highlighted files are fully pre-rendered pages for <C>/</C> and <C>/about</C>
          </li>
          <li>
            <C>/blog/:slug</C> and <C>/docs/*</C> are shell pages (unless listed in <C>staticParams</C>)
          </li>
          <li>
            <C>api/index.mjs</C> is the compiled API bundle for <C>bini-server</C> or edge hosts.
          </li>
        </UL>
      </Section>

      <Section id="deployment" title="Deployment">
        <P className="mb-4">
          <C>bini-deploy</C> is bundled into every scaffold and exposed as{' '}
          <C>{run(pm, 'deploy')}</C>. For web, it prompts for a hosting target and generates the
          appropriate configuration and entry files.
        </P>

        <H3 className="mt-6 mb-3">Prerequisites</H3>
        <P className="mb-4">
          Before deploying, ensure you have a GitHub repository and the required credentials for
          your chosen hosting provider.
        </P>
        <UL>
          <li>
            A GitHub account and a repository (e.g.,{' '}
            <C>https://github.com/you/my-app</C>).
          </li>
          <li>
            For Vercel, Netlify, Cloudflare, or Deno: a free account on that platform.
          </li>
          <li>
            For Node.js hosts (Railway, Render, Fly.io, a VPS): SSH access or a platform account.
          </li>
        </UL>

        <H3 className="mt-6 mb-3">Deploy Command</H3>
        <MultiTerminal tabs={tabs((pm) => `$ ${run(pm, 'deploy')}`)} />
        <ClackTerminal
          copyText={`? Platforms? Web\n? Hosting provider? Vercel\n? GitHub repository URL? https://github.com/you/my-app\n? Branch to push to? main (default)\n? Generate deployment files and push to GitHub? Yes\n? Commit message (press Enter for the default): chore: add deployment configuration`}
        >
          <ClackPrompt type="multi" title="Platforms?" active isFirst>
            <div className="flex gap-1.5">
              <span className="text-green-500 dark:text-green-400">◼</span>{' '}
              <span className="text-neutral-900 dark:text-neutral-100">Web</span>
            </div>
            <div className="flex gap-1.5">
              <span className="text-neutral-500">◻</span>{' '}
              <span className="text-neutral-500">Desktop (Windows, macOS, Linux)</span>
            </div>
            <div className="flex gap-1.5">
              <span className="text-neutral-500">◻</span>{' '}
              <span className="text-neutral-500">Android</span>
            </div>
            <div className="flex gap-1.5">
              <span className="text-neutral-500">◻</span>{' '}
              <span className="text-neutral-500">iOS</span>
            </div>
            <div className="mt-2 text-[11px] text-neutral-500">
              ↑/↓ to navigate • Space: select • Enter: confirm
            </div>
          </ClackPrompt>

          <ClackPrompt type="select" title="Hosting provider?">
            <div className="flex gap-1.5">
              <span className="text-green-500 dark:text-green-400">●</span>{' '}
              <span className="text-neutral-900 dark:text-neutral-100">Vercel</span>
            </div>
            <div className="flex gap-1.5">
              <span className="text-neutral-500">○</span>{' '}
              <span className="text-neutral-500">Netlify</span>
            </div>
            <div className="flex gap-1.5">
              <span className="text-neutral-500">○</span>{' '}
              <span className="text-neutral-500">Cloudflare</span>
            </div>
            <div className="flex gap-1.5">
              <span className="text-neutral-500">○</span>{' '}
              <span className="text-neutral-500">Deno Deploy</span>
            </div>
            <div className="flex gap-1.5">
              <span className="text-neutral-500">○</span>{' '}
              <span className="text-neutral-500">Node.js</span>
            </div>
            <div className="mt-2 text-[11px] text-neutral-500">
              ↑/↓ to navigate • Enter: confirm
            </div>
          </ClackPrompt>

          <ClackPrompt type="input" title="GitHub repository URL?">
            <div className="text-neutral-900 dark:text-neutral-100">https://github.com/you/my-app</div>
          </ClackPrompt>

          <ClackPrompt type="select" title="Branch to push to?">
            <div className="flex gap-1.5">
              <span className="text-green-500 dark:text-green-400">●</span>{' '}
              <span className="text-neutral-900 dark:text-neutral-100">main (default)</span>
            </div>
            <div className="flex gap-1.5">
              <span className="text-neutral-500">○</span>{' '}
              <span className="text-neutral-500">+ New branch...</span>
            </div>
          </ClackPrompt>

          <ClackPrompt type="select" title="Generate deployment files and push to GitHub?" active>
            <div className="flex items-center gap-1.5 text-[13px] font-mono leading-none">
              <span className="text-green-500 dark:text-green-400">●</span>
              <span className="text-neutral-900 dark:text-neutral-100">Yes</span>
              <span className="text-neutral-500">/</span>
              <span className="text-neutral-500">○</span>
              <span className="text-neutral-500">No</span>
            </div>
          </ClackPrompt>

          <ClackPrompt type="input" title="Commit message (press Enter for the default):" active isLast>
            <div className="text-neutral-900 dark:text-neutral-100">chore: add deployment configuration</div>
          </ClackPrompt>
        </ClackTerminal>

        <H3 className="mt-6 mb-3">Generated Files</H3>
        <P className="mb-4">The target you choose determines what <C>bini-deploy</C> creates:</P>
        <UL>
          <li>
            <strong className={STRONG}>Node.js:</strong> (none - <C>bini-server</C> reads <C>dist/api/</C> directly)
          </li>
          <li>
            <strong className={STRONG}>Netlify:</strong> <C>netlify/edge-functions/api.ts</C> + <C>netlify.toml</C>
          </li>
          <li>
            <strong className={STRONG}>Vercel:</strong> <C>api/index.ts</C> + <C>vercel.json</C>
          </li>
          <li>
            <strong className={STRONG}>Cloudflare:</strong> <C>worker.ts</C> + <C>wrangler.toml</C>
          </li>
          <li>
            <strong className={STRONG}>Deno:</strong> <C>server/index.ts</C>
          </li>
        </UL>

        <H3 className="mt-6 mb-3">Deployment Options</H3>
        <UL>
          <li>
            <strong className={STRONG}>SSG + Node.js API:</strong> Build with <C>{run(pm, 'build')}</C>{' '}
            (generates static HTML via SSG), serve with <C>{run(pm, 'start')}</C> to run the{' '}
            <C>bini-server</C> and handle API routes dynamically (requires Node.js).
          </li>
          <li>
            <strong className={STRONG}>Fully Static:</strong> Build with <C>{run(pm, 'build')}</C>, 
            deploy the <C>dist/</C> folder to any static hosting (Netlify, Vercel, Cloudflare Pages, S3). 
            <em> Note: This serves the pre-rendered pages and client-side hydration, but your API routes will not work unless you use an edge adapter.</em>
          </li>
          <li>
            <strong className={STRONG}>Edge/Serverless:</strong> Use <C>{run(pm, 'deploy')}</C> to
            generate platform-specific entry files for Vercel, Netlify, Cloudflare, or Deno, which
            serve the static HTML and run your Hono API at the edge.
          </li>
        </UL>

        <H3 className="mt-6 mb-3">Node.js Deployment</H3>
        <P className="mb-4">For Node.js hosts (Railway, Render, Fly.io, a VPS):</P>
        <MultiTerminal tabs={tabs((pm) => `$ ${run(pm, 'build')} && ${run(pm, 'start')}`)} />
        <P className="mb-4">
          <C>bini-server</C> reads the compiled API bundle from <C>dist/api/index.mjs</C>, so deploy
          the whole project - not just <C>dist/</C>. Use <C>pm2</C> on a bare VPS.
        </P>

        <H3 className="mt-6 mb-3">GitHub Pages / Subpaths</H3>
        <P className="mb-4">
          <C>bini-deploy</C> does <strong className={STRONG}>not</strong> automate GitHub Pages. You must set the subpath manually, build, and upload the static files yourself:
        </P>
        <ol className="mb-6 list-decimal space-y-2 pl-5 text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400">
          <li>
            Set <C>base: '/my-repo/'</C> in <C>{`vite.config.${t}`}</C>.
          </li>
          <li>
            Run <C>{run(pm, 'build')}</C> to generate a subpath-aware <C>dist/</C> folder.
          </li>
          <li>
            Upload the <C>dist/</C> folder to your GitHub Pages branch (e.g., <C>gh-pages</C>) manually or using a tool like <C>gh-pages</C>.
          </li>
        </ol>
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

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link to="/docs/platform-windows" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Windows</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Build a native Windows app with Authenticode signing and NSIS/MSI installers.</p>
        </Link>
        <Link to="/docs/platform-macos" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">macOS</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Build a native macOS app with Developer ID signing and notarization.</p>
        </Link>
        <Link to="/docs/platform-linux" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Linux</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Build a native Linux app with AppImage, .deb, and .rpm bundles.</p>
        </Link>
        <Link to="/docs/platform-android" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Android</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Build a native Android app with keystore signing and Play Store support.</p>
        </Link>
      </div>
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