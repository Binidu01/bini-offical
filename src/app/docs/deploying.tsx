// src/app/docs/deploying.tsx
import { Link } from 'react-router-dom'
import {
  siCloudflare,
  siDeno,
  siGithub,
  siNetlify,
  siNodedotjs,
  siVercel,
} from 'simple-icons'

import {
  BrandIcon,
  C,
  Callout,
  ClackPrompt,
  ClackTerminal,
  CodeBlock,
  ExtLink,
  H3,
  DocPage,
  MultiTerminal,
  P,
  Section,
  Table,
  UL,
  useDocLang,
  useDocPm,
  type TerminalTab,
} from '../../components/DocBlocks'
import { Arrow, CARD, FolderVisual, GridBg } from '../../components/DocVisuals'
import type { TocItem } from '../../components/TableOfContents'

const TOC_ITEMS: TocItem[] = [
  { id: 'deployment-options', label: 'Deployment Options' },
  { id: 'using-bini-deploy', label: 'Deploy Anywhere' },
  { id: 'nodejs-server', label: 'Node.js Server' },
  { id: 'netlify', label: 'Netlify' },
  { id: 'vercel', label: 'Vercel' },
  { id: 'cloudflare', label: 'Cloudflare Workers' },
  { id: 'deno-deploy', label: 'Deno Deploy' },
  { id: 'static-export', label: 'Static Export' },
  { id: 'platform-comparison', label: 'Platform Comparison' },
  { id: 'environment-variables', label: 'Environment Variables' },
  { id: 'best-practices', label: 'Best Practices' },
]

const STRONG = 'font-medium text-neutral-900 dark:text-neutral-100'
const OL =
  'mb-6 list-decimal space-y-2 pl-5 text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400'

/* ---- package-manager helpers ---- */

const PMS = ['npm', 'pnpm', 'yarn', 'bun'] as const
type Pm = (typeof PMS)[number]

const run = (pm: Pm, script: string) => {
  if (pm === 'npm') return `npm run ${script}`
  if (pm === 'bun') return `bun run ${script}`
  return `${pm} ${script}`
}

const tabs = (cmd: (pm: Pm) => string): TerminalTab[] =>
  PMS.map((pm) => ({ id: pm, label: pm, command: cmd(pm) }))

/* ---------- small pieces ---------- */

type Icon = { path: string }

function Platform({ icon, name }: { icon: Icon; name: string }) {
  return (
    <span className="flex items-center gap-2 font-sans text-neutral-600 dark:text-neutral-400">
      <BrandIcon icon={icon} size={14} className="shrink-0 text-black dark:text-white" />
      {name}
    </span>
  )
}

const headingIcon = (icon: Icon) => (
  <BrandIcon icon={icon} size={20} className="shrink-0 text-black dark:text-white" />
)

const Yes = () => <span className="text-emerald-600 dark:text-emerald-400">✓</span>

/* ---------- visuals ---------- */

const FLOW_STEPS: [string, string][] = [
  ['1', 'Run the deploy command'],
  ['2', 'Choose a target'],
  ['3', 'Config is generated'],
  ['4', 'Pushed to GitHub'],
]

function DeployFlowVisual() {
  return (
    <GridBg>
      <div className="flex items-center gap-3">
        {FLOW_STEPS.map(([n, label], i) => (
          <div key={n} className="flex items-center gap-3">
            <div className={`${CARD} flex h-14 w-36 shrink-0 items-center gap-2.5 px-3`}>
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neutral-200 font-mono text-[10px] font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
                {n}
              </span>
              <span className="text-[12px] leading-tight text-neutral-800 dark:text-neutral-200">
                {label}
              </span>
            </div>
            {i < FLOW_STEPS.length - 1 && <Arrow />}
          </div>
        ))}
      </div>
    </GridBg>
  )
}

/* ---------- content ---------- */

function Content() {
  const lang = useDocLang()
  const pm = useDocPm()
  const t = lang === 'js' ? 'js' : 'ts'

  return (
    <>
      <div className="mb-12">
        <P className="mb-4">
          Bini.js can be deployed to any platform that supports Node.js, or exported as static
          files for static hosting. For all hosting platforms{' '}
          <strong className={STRONG}>except static export</strong>, use the unified{' '}
          <C>{run(pm, 'deploy')}</C> command.
        </P>
      </div>

      <Section id="deployment-options" title="Deployment Options">
        <Table
          headers={['Platform', 'Command', 'Notes']}
          rows={[
            [
              <Platform key="node" icon={siNodedotjs} name="Node.js" />,
              <C key="c">{run(pm, 'deploy')}</C>,
              'Default - uses the production server',
            ],
            [
              <Platform key="static" icon={siGithub} name="Static Export" />,
              <C key="c">{run(pm, 'build')}</C>,
              'GitHub Pages, S3, Firebase, Surge',
            ],
            [
              <Platform key="netlify" icon={siNetlify} name="Netlify" />,
              <C key="c">{run(pm, 'deploy')}</C>,
              'Automated by the deploy tool',
            ],
            [
              <Platform key="vercel" icon={siVercel} name="Vercel" />,
              <C key="c">{run(pm, 'deploy')}</C>,
              'Automated by the deploy tool',
            ],
            [
              <Platform key="cf" icon={siCloudflare} name="Cloudflare" />,
              <C key="c">{run(pm, 'deploy')}</C>,
              'Automated by the deploy tool',
            ],
            [
              <Platform key="deno" icon={siDeno} name="Deno Deploy" />,
              <C key="c">{run(pm, 'deploy')}</C>,
              'Automated by the deploy tool',
            ],
          ]}
        />
        <Callout>
          <strong>Unified command:</strong> <C>{run(pm, 'deploy')}</C> works for Node.js, Netlify,
          Vercel, Cloudflare, and Deno Deploy. Static export uses <C>{run(pm, 'build')}</C> which
          pre-renders all routes.
        </Callout>
      </Section>

      <Section id="using-bini-deploy" title="Deploy Anywhere">
        <P className="mb-4">
          The deploy tool makes deployment effortless. Simply run:
        </P>
        <MultiTerminal tabs={tabs((pm) => `$ ${run(pm, 'deploy')}`)} />
        <P className="mt-4 mb-4">
          When you run <C>{run(pm, 'deploy')}</C>, it will:
        </P>
        <DeployFlowVisual />

        <H3 className="mt-8 mb-3">Step 1 - Choose the target platform</H3>
        <P className="mb-4">
          It asks which platform you want to deploy to. Choose <C>Web</C> for any hosting provider:
        </P>
        <ClackTerminal copyText={`? Platforms? Web`}>
          <ClackPrompt type="multi" title="Platforms?" active isFirst isLast>
            <div className="flex gap-1.5">
              <span className="text-green-500 dark:text-green-400">◼</span>{' '}
              <span className="text-neutral-900 dark:text-neutral-100">Web</span>
            </div>
            <div className="flex gap-1.5">
              <span className="text-neutral-400 dark:text-neutral-300">◻</span>{' '}
              <span className="text-neutral-400 dark:text-neutral-300">Desktop</span>
            </div>
            <div className="flex gap-1.5">
              <span className="text-neutral-400 dark:text-neutral-300">◻</span>{' '}
              <span className="text-neutral-400 dark:text-neutral-300">Android</span>
            </div>
            <div className="flex gap-1.5">
              <span className="text-neutral-400 dark:text-neutral-300">◻</span>{' '}
              <span className="text-neutral-400 dark:text-neutral-300">iOS</span>
            </div>
            <div className="mt-2 text-[11px] text-neutral-500">
              ↑/↓ to navigate • Space: select • Enter: confirm
            </div>
          </ClackPrompt>
        </ClackTerminal>

        <H3 className="mt-8 mb-3">Step 2 - Choose the hosting provider</H3>
        <P className="mb-4">
          If you picked <C>Web</C>, it then asks for the hosting provider. Each section below
          explains what the deploy tool generates for that target.
        </P>
        <ClackTerminal copyText={`? Hosting provider? Node.js (default)`}>
          <ClackPrompt type="select" title="Hosting provider?" active isFirst isLast>
            <div className="flex gap-1.5">
              <span className="text-green-500 dark:text-green-400">●</span>{' '}
              <span className="text-neutral-900 dark:text-neutral-100">Node.js (default)</span>
            </div>
            <div className="flex gap-1.5">
              <span className="text-neutral-400 dark:text-neutral-300">○</span>{' '}
              <span className="text-neutral-400 dark:text-neutral-300">Netlify</span>
            </div>
            <div className="flex gap-1.5">
              <span className="text-neutral-400 dark:text-neutral-300">○</span>{' '}
              <span className="text-neutral-400 dark:text-neutral-300">Vercel</span>
            </div>
            <div className="flex gap-1.5">
              <span className="text-neutral-400 dark:text-neutral-300">○</span>{' '}
              <span className="text-neutral-400 dark:text-neutral-300">Cloudflare Workers</span>
            </div>
            <div className="flex gap-1.5">
              <span className="text-neutral-400 dark:text-neutral-300">○</span>{' '}
              <span className="text-neutral-400 dark:text-neutral-300">Deno Deploy</span>
            </div>
            <div className="mt-2 text-[11px] text-neutral-500">
              ↑/↓ to navigate • Enter: confirm
            </div>
          </ClackPrompt>
        </ClackTerminal>

        <H3 className="mt-8 mb-3">Step 3 - Enter your GitHub repository URL</H3>
        <P className="mb-4">
          It needs to know where to push the project. Enter your repository URL (skipped when an{' '}
          <C>origin</C> remote already exists):
        </P>
        <ClackTerminal copyText={`? GitHub repository URL? https://github.com/you/my-app`}>
          <ClackPrompt type="input" title="GitHub repository URL?" active isFirst isLast>
            <div className="text-neutral-900 dark:text-neutral-100">
              https://github.com/you/my-app
            </div>
          </ClackPrompt>
        </ClackTerminal>

        <H3 className="mt-8 mb-3">Step 4 - Choose the branch to push to</H3>
        <P className="mb-4">
          By default it pushes to the remote&apos;s default branch, falling back to <C>main</C>.
          You can pick an existing branch or create a new one:
        </P>
        <ClackTerminal copyText={`? Branch to push to? main (default)`}>
          <ClackPrompt type="select" title="Branch to push to?" active isFirst isLast>
            <div className="flex gap-1.5">
              <span className="text-green-500 dark:text-green-400">●</span>{' '}
              <span className="text-neutral-900 dark:text-neutral-100">main (default)</span>
            </div>
            <div className="flex gap-1.5">
              <span className="text-neutral-400 dark:text-neutral-300">○</span>{' '}
              <span className="text-neutral-400 dark:text-neutral-300">+ New branch...</span>
            </div>
          </ClackPrompt>
        </ClackTerminal>

        <H3 className="mt-8 mb-3">Step 5 - Confirm</H3>
        <P className="mb-4">
          A confirmation prompt appears before generating files and pushing:
        </P>
        <ClackTerminal copyText={`? Generate deployment files and push to GitHub? Yes`}>
          <ClackPrompt
            type="select"
            title="Generate deployment files and push to GitHub?"
            active
            isFirst
            isLast
          >
            <div className="flex items-center gap-1.5 text-[13px] font-mono leading-none">
              <span className="text-green-500 dark:text-green-400">●</span>
              <span className="text-neutral-900 dark:text-neutral-100">Yes</span>
              <span className="text-neutral-500">/</span>
              <span className="text-neutral-400 dark:text-neutral-300">○</span>
              <span className="text-neutral-400 dark:text-neutral-300">No</span>
            </div>
          </ClackPrompt>
        </ClackTerminal>

        <H3 className="mt-8 mb-3">Step 6 - Commit message</H3>
        <P className="mb-4">
          Finally, it asks for a commit message. Press Enter to use the default:
        </P>
        <ClackTerminal
          copyText={`? Commit message (press Enter for the default): chore: add deployment configuration`}
        >
          <ClackPrompt
            type="input"
            title="Commit message (press Enter for the default):"
            active
            isFirst
            isLast
          >
            <div className="text-neutral-900 dark:text-neutral-100">
              chore: add deployment configuration
            </div>
          </ClackPrompt>
        </ClackTerminal>

        <Callout>
          <strong>Zero config required:</strong> The deploy tool automatically detects your project
          structure, picks the right adapter, and generates platform-specific configuration. No
          changes to <C>{`vite.config.${t}`}</C> needed. Learn more at{' '}
          <ExtLink href="https://github.com/Binidu01/bini-deploy">bini-deploy</ExtLink>.
        </Callout>
      </Section>

      <Section id="nodejs-server" title="Node.js Server" icon={headingIcon(siNodedotjs)}>
        <P className="mb-4">
          The default deployment option. Bini.js ships with a zero-dependency production server.
        </P>
        <P className="mb-4">
          Your app will be served at the port specified by <C>PORT</C> (default: 3000):
        </P>
        <CodeBlock
          filename=".env"
          lang="text"
          code={`# .env
PORT=3000`}
        />
        <H3 className="mt-8 mb-3">Platforms</H3>
        <UL>
          <li>
            <strong className={STRONG}>Railway</strong> - Auto-detects Node.js, just connect your
            repo
          </li>
          <li>
            <strong className={STRONG}>Render</strong> - Set build command to{' '}
            <C>{run(pm, 'build')}</C> and start to <C>{run(pm, 'start')}</C>
          </li>
          <li>
            <strong className={STRONG}>Fly.io</strong> - Use the Node.js builder
          </li>
          <li>
            <strong className={STRONG}>VPS</strong> - Use <C>pm2</C> to keep the server running
          </li>
        </UL>
        <Callout>
          <strong>Production server features:</strong> ETag support, 30s timeouts, 10MB body limit,
          graceful shutdown, and automatic port increment.
        </Callout>
      </Section>

      <Section id="netlify" title="Netlify" icon={headingIcon(siNetlify)}>
        <P className="mb-4">
          When you choose <C>Netlify</C> in the hosting prompt, the deploy tool automatically
          generates:
        </P>
        <FolderVisual
          width={300}
          rows={[
            { n: 'netlify.toml', dot: true },
            { n: 'netlify' },
            { n: 'functions', d: 1 },
            { n: 'api.mjs', d: 2, dot: true },
            { n: 'edge-functions', d: 1 },
            { n: 'spa-fallback.ts', d: 2 },
          ]}
        />
        <UL>
          <li>
            <C>netlify.toml</C> - Build and function configuration
          </li>
          <li>
            <C>netlify/functions/api.mjs</C> - API route handler
          </li>
          <li>
            <C>netlify/edge-functions/spa-fallback.ts</C> - only without pre-rendering
          </li>
        </UL>
        <Callout>
          <strong>Important:</strong> Netlify Functions run on a Node-like runtime but are not full
          Node - packages like <C>nodemailer</C>, <C>fs</C>, or <C>path</C> may not work. Use Web
          API alternatives.
        </Callout>
      </Section>

      <Section id="vercel" title="Vercel" icon={headingIcon(siVercel)}>
        <P className="mb-4">
          When you choose <C>Vercel</C> in the hosting prompt, the deploy tool automatically
          generates:
        </P>
        <FolderVisual
          width={300}
          rows={[
            { n: 'vercel.json', dot: true },
            { n: 'api' },
            { n: 'index.ts', d: 1, dot: true },
            { n: 'tsconfig.json', d: 1 },
          ]}
        />
        <UL>
          <li>
            <C>vercel.json</C> - Routing and build configuration
          </li>
          <li>
            <C>api/index.ts</C> - Serverless function entry point
          </li>
          <li>
            <C>api/tsconfig.json</C> - only for TypeScript projects with API routes
          </li>
        </UL>
      </Section>

      <Section id="cloudflare" title="Cloudflare Workers" icon={headingIcon(siCloudflare)}>
        <P className="mb-4">
          When you choose <C>Cloudflare Workers</C> in the hosting prompt, the deploy tool
          automatically generates:
        </P>
        <FolderVisual
          width={300}
          rows={[
            { n: 'wrangler.toml', dot: true },
            { n: 'worker.ts', dot: true },
            { n: 'public' },
            { n: '.assetsignore', d: 1 },
          ]}
        />
        <UL>
          <li>
            <C>wrangler.toml</C> - Worker configuration
          </li>
          <li>
            <C>worker.ts</C> - Worker entry point with API routes
          </li>
          <li>
            <C>public/.assetsignore</C> - excludes the API bundle from static assets
          </li>
        </UL>
      </Section>

      <Section id="deno-deploy" title="Deno Deploy" icon={headingIcon(siDeno)}>
        <P className="mb-4">
          When you choose <C>Deno Deploy</C> in the hosting prompt, the deploy tool automatically
          generates:
        </P>
        <FolderVisual
          width={300}
          rows={[{ n: 'server' }, { n: 'index.ts', d: 1, dot: true }]}
        />
        <UL>
          <li>
            <C>server/index.ts</C> - Deno Deploy entry point
          </li>
        </UL>
      </Section>

      <Section id="static-export" title="Static Export" icon={headingIcon(siGithub)}>
        <P className="mb-4">
          For static hosting, <C>{run(pm, 'build')}</C> pre-renders every route to static HTML.
          This is the <strong className={STRONG}>only</strong> deployment method that does not use{' '}
          <C>{run(pm, 'deploy')}</C>.
        </P>
        <MultiTerminal tabs={tabs((pm) => `$ ${run(pm, 'build')}`)} />
        <P className="mt-4 mb-4">
          The pre-rendered files will be in the <C>dist/</C> folder. Suitable for:
        </P>
        <UL>
          <li>GitHub Pages</li>
          <li>Amazon S3</li>
          <li>Firebase Hosting</li>
          <li>Cloudflare Pages (static mode)</li>
          <li>Netlify (static mode)</li>
          <li>Vercel (static mode)</li>
        </UL>
        <H3 className="mt-8 mb-3">GitHub Pages</H3>
        <P className="mb-4">
          Set the <C>base</C> option in <C>{`vite.config.${t}`}</C> if deploying to a subpath:
        </P>
        <CodeBlock
          filename={`vite.config.${t}`}
          code={`import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/your-repo-name/',
  plugins: [react()],
})`}
        />
        <P className="mt-4 mb-4">
          Then deploy the <C>dist/</C> folder to GitHub Pages.
        </P>
        <Callout>
          <strong>Pre-rendering:</strong> <C>{run(pm, 'build')}</C> pre-renders all static routes
          to HTML and creates shell pages for dynamic routes. The client hydrates on load. No
          separate export command needed.
        </Callout>
      </Section>

      <Section id="platform-comparison" title="Platform Comparison">
        <Table
          headers={['Platform', 'API Runtime', 'Static', 'Dynamic', 'Command']}
          rows={[
            [
              <Platform key="node" icon={siNodedotjs} name="Node.js" />,
              'Node.js',
              <Yes key="s" />,
              <Yes key="d" />,
              <C key="c">{run(pm, 'deploy')}</C>,
            ],
            [
              <Platform key="netlify" icon={siNetlify} name="Netlify" />,
              'Node.js Functions',
              <Yes key="s" />,
              <Yes key="d" />,
              <C key="c">{run(pm, 'deploy')}</C>,
            ],
            [
              <Platform key="vercel" icon={siVercel} name="Vercel" />,
              'Node.js Runtime',
              <Yes key="s" />,
              <Yes key="d" />,
              <C key="c">{run(pm, 'deploy')}</C>,
            ],
            [
              <Platform key="cf" icon={siCloudflare} name="Cloudflare" />,
              'Workers',
              <Yes key="s" />,
              <Yes key="d" />,
              <C key="c">{run(pm, 'deploy')}</C>,
            ],
            [
              <Platform key="deno" icon={siDeno} name="Deno Deploy" />,
              'Deno',
              <Yes key="s" />,
              <Yes key="d" />,
              <C key="c">{run(pm, 'deploy')}</C>,
            ],
            [
              <Platform key="static" icon={siGithub} name="Static Export" />,
              'N/A',
              <Yes key="s" />,
              'via shell pages',
              <C key="c">{run(pm, 'build')}</C>,
            ],
          ]}
        />
      </Section>

      <Section id="environment-variables" title="Environment Variables in Production">
        <P className="mb-4">Set environment variables through your hosting platform&apos;s dashboard:</P>
        <Table
          headers={['Platform', 'How to Set']}
          rows={[
            [
              <Platform key="node" icon={siNodedotjs} name="Node.js" />,
              'Use .env file or system environment variables',
            ],
            [
              <Platform key="netlify" icon={siNetlify} name="Netlify" />,
              'Site settings → Environment variables',
            ],
            [
              <Platform key="vercel" icon={siVercel} name="Vercel" />,
              'Project settings → Environment Variables',
            ],
            [
              <Platform key="cf" icon={siCloudflare} name="Cloudflare" />,
              'wrangler.toml or dashboard',
            ],
            [
              <Platform key="deno" icon={siDeno} name="Deno Deploy" />,
              'Project settings → Environment Variables',
            ],
          ]}
        />
        <Callout>
          Never commit <C>.env</C> files with secrets to your repository. Use platform environment
          variables for production.
        </Callout>
      </Section>

      <Section id="best-practices" title="Best Practices">
        <UL className="mb-6 space-y-3">
          <li>
            <strong className={STRONG}>Test builds locally</strong> - Run <C>{run(pm, 'build')}</C>{' '}
            and <C>{run(pm, 'preview')}</C> before deploying.
          </li>
          <li>
            <strong className={STRONG}>Use environment variables</strong> - Keep configuration
            separate from code.
          </li>
          <li>
            <strong className={STRONG}>Set up CI/CD</strong> - Automate deployments with GitHub
            Actions or similar.
          </li>
          <li>
            <strong className={STRONG}>Monitor your app</strong> - Use platform analytics to track
            performance.
          </li>
          <li>
            <strong className={STRONG}>Use a custom domain</strong> - Configure SSL for secure
            connections.
          </li>
        </UL>
      </Section>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link to="/docs/production-server" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Production Server</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Run the production server for Node.js hosting with ETag caching and graceful shutdown.</p>
        </Link>
        <Link to="/docs/static-export" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Static Export</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Pre-render every route to static HTML for GitHub Pages, S3, or any static host.</p>
        </Link>
        <Link to="/docs/hosting" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Hosting Providers</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Deploy to Vercel, Netlify, Cloudflare Workers, Deno Deploy, or Node.js.</p>
        </Link>
      </div>
    </>
  )
}

export default function DeployingPage() {
  return (
    <DocPage
      title="Deploying"
      description="Learn how to deploy your Bini.js application to production."
      url="https://bini.js.org/docs/deploying"
      editUrl="https://github.com/Binidu01/bini-official/edit/main/src/app/docs/deploying.tsx"
      toc={TOC_ITEMS}
      prev={{ to: '/docs/platform-ios', title: 'iOS' }}
      next={{ to: '/docs/production-server', title: 'Production Server' }}
    >
      <Content />
    </DocPage>
  )
}