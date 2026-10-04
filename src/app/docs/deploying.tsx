// src/app/docs/deploying.tsx
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
  CodeBlock,
  ExtLink,
  H3,
  DocPage,
  MultiTerminal,
  P,
  PromptOutput,
  Section,
  Table,
  UL,
  useDocLang,
  type TerminalTab,
} from '../../components/DocBlocks'
import { Arrow, CARD, FolderVisual, GridBg } from '../../components/DocVisuals'
import type { TocItem } from '../../components/TableOfContents'

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
  { id: 'best-practices', label: 'Best Practices' },
]

const DEPLOY_TABS: TerminalTab[] = [
  { id: 'npm', label: 'npm', command: `$ npm run deploy` },
  { id: 'pnpm', label: 'pnpm', command: `$ pnpm deploy` },
  { id: 'yarn', label: 'yarn', command: `$ yarn deploy` },
  { id: 'bun', label: 'bun', command: `$ bun run deploy` },
]

const BUILD_TABS: TerminalTab[] = [
  { id: 'npm', label: 'npm', command: `$ npm run build` },
  { id: 'pnpm', label: 'pnpm', command: `$ pnpm build` },
  { id: 'yarn', label: 'yarn', command: `$ yarn build` },
  { id: 'bun', label: 'bun', command: `$ bun run build` },
]

const STRONG = 'font-medium text-neutral-900 dark:text-neutral-100'
const OL =
  'mb-6 list-decimal space-y-2 pl-5 text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400'

/* ---------- small pieces ---------- */

type Icon = { path: string }

/** Platform name with its logo, for table cells. */
function Platform({ icon, name }: { icon: Icon; name: string }) {
  return (
    <span className="flex items-center gap-2 font-sans text-neutral-600 dark:text-neutral-400">
      <BrandIcon icon={icon} size={14} className="shrink-0 text-black dark:text-white" />
      {name}
    </span>
  )
}

/** Platform logo for section headings. */
const headingIcon = (icon: Icon) => (
  <BrandIcon icon={icon} size={20} className="shrink-0 text-black dark:text-white" />
)

const Yes = () => <span className="text-emerald-600 dark:text-emerald-400">✓</span>

/* ---------- visuals ---------- */

const FLOW_STEPS: [string, string][] = [
  ['1', 'Run npm run deploy'],
  ['2', 'Choose a target'],
  ['3', 'Config is generated'],
  ['4', 'Pushed to GitHub'],
]

/** What bini-deploy does, in order. */
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

/**
 * The two-prompt flow used by bini-deploy, with the hosting provider matching
 * the section it lives in highlighted.
 */
function HostingPrompt({ selected }: { selected: string }) {
  const providers = [
    'Node.js (default - bini-server)',
    'Netlify',
    'Vercel',
    'Cloudflare Workers',
    'Deno Deploy',
  ]
  return (
    <>
      <H3 className="mt-8 mb-3">Step 1 - Choose the target platform</H3>
      <P className="mb-4">
        bini-deploy asks which platform you want to deploy to. Choose <C>Web</C> for any hosting
        provider:
      </P>
      <PromptOutput
        lines={[
          { kind: 'question', text: 'Select your target platform:' },
          { kind: 'option', text: 'Web', selected: true },
          { kind: 'option', text: 'Windows' },
          { kind: 'option', text: 'macOS' },
          { kind: 'option', text: 'iOS' },
          { kind: 'option', text: 'Linux' },
          { kind: 'option', text: 'Android' },
          { kind: 'blank' },
          { kind: 'hint', text: '↑↓ navigate • ⏎ select' },
        ]}
      />

      <H3 className="mt-8 mb-3">Step 2 - Choose the hosting provider</H3>
      <P className="mb-4">
        If you picked <C>Web</C>, bini-deploy then asks for the hosting provider. The highlighted
        choice below matches the section you're reading:
      </P>
      <PromptOutput
        lines={[
          { kind: 'question', text: 'Select hosting provider:' },
          ...providers.map((p) => ({
            kind: 'option' as const,
            text: p,
            selected: p === selected,
          })),
          { kind: 'blank' },
          { kind: 'hint', text: '↑↓ navigate • ⏎ select' },
        ]}
      />
    </>
  )
}

/* ---------- content (reads the TS/JS choice from DocPage) ---------- */

function Content() {
  const lang = useDocLang()
  const t = lang === 'js' ? 'js' : 'ts' // plain .ts / .js files (vite.config)

  return (
    <>
      <div className="mb-12">
        <P className="mb-4">
          Bini.js can be deployed to any platform that supports Node.js, or exported as static
          files for static hosting. For all hosting platforms{' '}
          <strong className={STRONG}>except static export</strong>, use the unified{' '}
          <C>npm run deploy</C> command.
        </P>
      </div>

      <Section id="deployment-options" title="Deployment Options">
        <Table
          headers={['Platform', 'Command', 'Notes']}
          rows={[
            [
              <Platform key="node" icon={siNodedotjs} name="Node.js" />,
              <C key="c">npm run deploy</C>,
              'Default - uses bini-server',
            ],
            [
              <Platform key="static" icon={siGithub} name="Static Export" />,
              <C key="c">npm run build</C>,
              'GitHub Pages, S3, Firebase, Surge',
            ],
            [
              <Platform key="netlify" icon={siNetlify} name="Netlify" />,
              <C key="c">npm run deploy</C>,
              'Automated by bini-deploy',
            ],
            [
              <Platform key="vercel" icon={siVercel} name="Vercel" />,
              <C key="c">npm run deploy</C>,
              'Automated by bini-deploy',
            ],
            [
              <Platform key="cf" icon={siCloudflare} name="Cloudflare" />,
              <C key="c">npm run deploy</C>,
              'Automated by bini-deploy',
            ],
            [
              <Platform key="deno" icon={siDeno} name="Deno Deploy" />,
              <C key="c">npm run deploy</C>,
              'Automated by bini-deploy',
            ],
          ]}
        />
        <Callout>
          <strong>Unified command:</strong> <C>npm run deploy</C> works for Node.js, Netlify,
          Vercel, Cloudflare, and Deno Deploy. Static export uses <C>npm run build</C> which
          pre-renders all routes.
        </Callout>
      </Section>

      <Section id="using-bini-deploy" title="One Command to Deploy Anywhere">
        <P className="mb-4">
          <strong className={STRONG}>bini-deploy</strong> makes deployment effortless. Simply run:
        </P>
        <MultiTerminal tabs={DEPLOY_TABS} />
        <P className="mb-4">
          When you run <C>npm run deploy</C>, bini-deploy will:
        </P>
        <DeployFlowVisual />

        <HostingPrompt selected="Node.js (default - bini-server)" />

        <ol className={OL}>
          <li>
            <strong className={STRONG}>Prompt you to choose your target platform:</strong> Web,
            Windows, macOS, Linux, Android, or iOS
          </li>
          <li>
            <strong className={STRONG}>If you choose Web, it prompts for hosting provider:</strong>{' '}
            Node.js (default), Netlify, Vercel, Cloudflare, or Deno Deploy
          </li>
          <li>
            <strong className={STRONG}>Automatically generates</strong> the platform-specific
            configuration files and entry points
          </li>
          <li>
            <strong className={STRONG}>Commits and pushes</strong> everything to your GitHub
            repository
          </li>
        </ol>
        <P className="mb-4">
          This single command works for <strong className={STRONG}>all hosting platforms</strong>{' '}
          with <strong className={STRONG}>zero configuration needed</strong>:
        </P>
        <UL>
          <li>
            <strong className={STRONG}>Node.js</strong> - Builds and starts the server
          </li>
          <li>
            <strong className={STRONG}>Netlify</strong> - Automatically generates{' '}
            <C>netlify.toml</C> and edge function entry
          </li>
          <li>
            <strong className={STRONG}>Vercel</strong> - Automatically generates{' '}
            <C>vercel.json</C> and serverless function entry
          </li>
          <li>
            <strong className={STRONG}>Cloudflare</strong> - Automatically generates{' '}
            <C>wrangler.toml</C> and worker entry
          </li>
          <li>
            <strong className={STRONG}>Deno Deploy</strong> - Automatically generates{' '}
            <C>server/index.ts</C> entry
          </li>
        </UL>
        <Callout>
          <strong>Zero config required:</strong> bini-deploy automatically detects your project
          structure, picks the right adapter, and generates platform-specific configuration. No
          changes to <C>{`vite.config.${t}`}</C> needed. Learn more at{' '}
          <ExtLink href="https://github.com/Binidu01/bini-deploy">bini-deploy</ExtLink>.
        </Callout>
      </Section>

      <Section id="nodejs-server" title="Node.js Server" icon={headingIcon(siNodedotjs)}>
        <P className="mb-4">
          The default deployment option. Bini.js uses <C>bini-server</C> - a zero-dependency
          production server.
        </P>
        <MultiTerminal tabs={DEPLOY_TABS} />
        <P className="mb-4">
          Your app will be served at the port specified by <C>PORT</C> (default: 3000):
        </P>
        <CodeBlock
          filename=".env"
          lang="text"
          code={`# .env
PORT=3000`}
        />
        <HostingPrompt selected="Node.js (default - bini-server)" />
        <H3 className="mt-8 mb-3">Platforms</H3>
        <UL>
          <li>
            <strong className={STRONG}>Railway</strong> - Auto-detects Node.js, just connect your
            repo
          </li>
          <li>
            <strong className={STRONG}>Render</strong> - Set build command to{' '}
            <C>npm run deploy</C> and start to <C>npm start</C>
          </li>
          <li>
            <strong className={STRONG}>Fly.io</strong> - Use the Node.js builder
          </li>
          <li>
            <strong className={STRONG}>VPS</strong> - Use <C>pm2</C> to keep the server running
          </li>
        </UL>
        <Callout>
          <strong>bini-server features:</strong> ETag support, 30s timeouts, 10MB body limit,
          graceful shutdown, and automatic port increment.
        </Callout>
      </Section>

      <Section id="netlify" title="Netlify" icon={headingIcon(siNetlify)}>
        <P className="mb-4">
          Deploying to Netlify is completely automated with bini-deploy. No configuration needed.
        </P>
        <MultiTerminal tabs={DEPLOY_TABS} />
        <P className="mb-4">bini-deploy automatically generates:</P>
        <FolderVisual
          width={300}
          rows={[
            { n: 'netlify.toml', dot: true },
            { n: 'netlify' },
            { n: 'edge-functions', d: 1 },
            { n: 'api.ts', d: 2, dot: true },
          ]}
        />
        <UL>
          <li>
            <C>netlify.toml</C> - Build and edge function configuration
          </li>
          <li>
            <C>netlify/edge-functions/api.ts</C> - API route handler for Edge Functions
          </li>
        </UL>
        <HostingPrompt selected="Netlify" />
        <Callout>
          <strong>Important:</strong> Netlify Edge Functions run on Deno, not Node.js.
          Node-specific packages like <C>nodemailer</C>, <C>fs</C>, or <C>path</C> will not work.
          Use Web API alternatives.
        </Callout>
      </Section>

      <Section id="vercel" title="Vercel" icon={headingIcon(siVercel)}>
        <P className="mb-4">
          Deploying to Vercel is completely automated with bini-deploy. No configuration needed.
        </P>
        <MultiTerminal tabs={DEPLOY_TABS} />
        <P className="mb-4">bini-deploy automatically generates:</P>
        <FolderVisual
          width={300}
          rows={[
            { n: 'vercel.json', dot: true },
            { n: 'api' },
            { n: 'index.ts', d: 1, dot: true },
          ]}
        />
        <UL>
          <li>
            <C>vercel.json</C> - Routing and build configuration
          </li>
          <li>
            <C>api/index.ts</C> - Serverless function entry point
          </li>
        </UL>
        <HostingPrompt selected="Vercel" />
      </Section>

      <Section id="cloudflare" title="Cloudflare Workers" icon={headingIcon(siCloudflare)}>
        <P className="mb-4">
          Deploying to Cloudflare Workers is completely automated with bini-deploy. No
          configuration needed.
        </P>
        <MultiTerminal tabs={DEPLOY_TABS} />
        <P className="mb-4">bini-deploy automatically generates:</P>
        <FolderVisual
          width={300}
          rows={[
            { n: 'wrangler.toml', dot: true },
            { n: 'worker.ts', dot: true },
          ]}
        />
        <UL>
          <li>
            <C>wrangler.toml</C> - Worker configuration
          </li>
          <li>
            <C>worker.ts</C> - Worker entry point with API routes
          </li>
        </UL>
        <HostingPrompt selected="Cloudflare Workers" />
      </Section>

      <Section id="deno-deploy" title="Deno Deploy" icon={headingIcon(siDeno)}>
        <P className="mb-4">
          Deploying to Deno Deploy is completely automated with bini-deploy. No configuration
          needed.
        </P>
        <MultiTerminal tabs={DEPLOY_TABS} />
        <P className="mb-4">bini-deploy automatically generates:</P>
        <FolderVisual
          width={300}
          rows={[{ n: 'server' }, { n: 'index.ts', d: 1, dot: true }]}
        />
        <UL>
          <li>
            <C>server/index.ts</C> - Deno Deploy entry point
          </li>
        </UL>
        <HostingPrompt selected="Deno Deploy" />
      </Section>

      <Section id="static-export" title="Static Export" icon={headingIcon(siGithub)}>
        <P className="mb-4">
          For static hosting, <C>npm run build</C> pre-renders every route to static HTML. This is
          the <strong className={STRONG}>only</strong> deployment method that does not use{' '}
          <C>npm run deploy</C>.
        </P>
        <MultiTerminal tabs={BUILD_TABS} />
        <P className="mb-4">
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
          filename="vite.config.ts"
          code={`import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { biniroute } from 'bini-router'

export default defineConfig({
  base: '/your-repo-name/',
  plugins: [react(), biniroute()],
})`}
        />
        <P className="mt-4 mb-4">
          Then deploy the <C>dist/</C> folder to GitHub Pages.
        </P>
        <Callout>
          <strong>Pre-rendering:</strong> <C>npm run build</C> pre-renders all static routes to
          HTML and creates shell pages for dynamic routes. The client hydrates on load. No
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
              <C key="c">npm run deploy</C>,
            ],
            [
              <Platform key="netlify" icon={siNetlify} name="Netlify" />,
              'Deno (Edge)',
              <Yes key="s" />,
              <Yes key="d" />,
              <C key="c">npm run deploy</C>,
            ],
            [
              <Platform key="vercel" icon={siVercel} name="Vercel" />,
              'Edge',
              <Yes key="s" />,
              <Yes key="d" />,
              <C key="c">npm run deploy</C>,
            ],
            [
              <Platform key="cf" icon={siCloudflare} name="Cloudflare" />,
              'Workers',
              <Yes key="s" />,
              <Yes key="d" />,
              <C key="c">npm run deploy</C>,
            ],
            [
              <Platform key="deno" icon={siDeno} name="Deno Deploy" />,
              'Deno',
              <Yes key="s" />,
              <Yes key="d" />,
              <C key="c">npm run deploy</C>,
            ],
            [
              <Platform key="static" icon={siGithub} name="Static Export" />,
              'N/A',
              <Yes key="s" />,
              'via shell pages',
              <C key="c">npm run build</C>,
            ],
          ]}
        />
      </Section>

      <Section id="environment-variables" title="Environment Variables in Production">
        <P className="mb-4">Set environment variables through your hosting platform's dashboard:</P>
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
            <strong className={STRONG}>Test builds locally</strong> - Run <C>npm run build</C> and{' '}
            <C>npm run preview</C> before deploying.
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
    </>
  )
}

/* ---------- page ---------- */

export default function DeployingPage() {
  return (
    <DocPage
      title="Deploying"
      description="Learn how to deploy your Bini.js application to production."
      url="https://bini.js.org/docs/deploying"
      editUrl="https://github.com/Binidu01/bini-official/edit/main/src/app/docs/deploying.tsx"
      toc={TOC_ITEMS}
      prev={{ to: '/docs/environment-variables', title: 'Environment Variables' }}
      next={{ to: '/docs/production-server', title: 'Production Server' }}
    >
      <Content />
    </DocPage>
  )
}