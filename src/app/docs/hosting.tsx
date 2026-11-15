// src/app/docs/hosting.tsx
import { siCloudflare, siDeno, siNetlify, siNodedotjs, siVercel } from 'simple-icons'
import { Link } from 'react-router-dom'

import {
  BrandIcon,
  C,
  Callout,
  ClackPrompt,
  ClackTerminal,
  CodeBlock,
  DocLink,
  DocPage,
  H3,
  MultiTerminal,
  P,
  Section,
  Table,
  UL,
  useDocLang,
  useDocPm,
  type TerminalTab,
} from '../../components/DocBlocks'
import { RouteVisual } from '../../components/DocVisuals'
import type { TocItem } from '../../components/TableOfContents'

const TOC_ITEMS: TocItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'installation', label: 'Installation' },
  { id: 'supported-providers', label: 'Supported Providers' },
  { id: 'node', label: 'Node.js' },
  { id: 'netlify', label: 'Netlify' },
  { id: 'vercel', label: 'Vercel' },
  { id: 'cloudflare', label: 'Cloudflare Workers' },
  { id: 'deno-deploy', label: 'Deno Deploy' },
  { id: 'api-routes', label: 'API Routes' },
  { id: 'git-behavior', label: 'Git Push Behavior' },
  { id: 'requirements', label: 'Requirements' },
]

const STRONG = 'font-medium text-black dark:text-white'
const OL =
  'mb-6 list-decimal space-y-2 pl-5 text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400'
const ICON_COLOR = 'text-black dark:text-white'

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

function Brand({ icon, size = 16 }: { icon: { path: string }; size?: number }) {
  return <BrandIcon icon={icon} size={size} className={ICON_COLOR} />
}

function ProviderName({ icon, name }: { icon: { path: string }; name: string }) {
  return (
    <span className="flex items-center gap-2">
      <Brand icon={icon} />
      {name}
    </span>
  )
}

/**
 * The interactive prompts as they appear when deploying, with the provider
 * for the current section highlighted. Includes platform, hosting, repository,
 * branch, confirm, and commit message steps so readers see the whole flow.
 * The CI flags block follows, so every provider section shows both paths.
 */
function PickHosting({ provider, isDefault = false }: { provider: string; isDefault?: boolean }) {
  const providers = [
    { id: 'node', label: 'Node.js (default)' },
    { id: 'netlify', label: 'Netlify' },
    { id: 'vercel', label: 'Vercel' },
    { id: 'cloudflare', label: 'Cloudflare Workers' },
    { id: 'deno', label: 'Deno Deploy' },
  ]
  const selected = providers.find((p) => p.id === provider)?.label ?? providers[0].label

  const copyText = [
    '? Platforms? Web',
    `? Hosting provider? ${selected}`,
    '? GitHub repository URL? https://github.com/you/my-app',
    '? Branch to push to? main (default)',
    '? Confirm deployment? Yes',
    '? Commit message? chore: add deployment configuration',
  ].join('\n')

  return (
    <>
      <P className="mb-4">
        Choose <strong className={STRONG}>Web</strong>, then{' '}
        <strong className={STRONG}>{selected.split(' ')[0]}</strong>
        {isDefault ? ' (the default)' : ''} when prompted. Then confirm the branch and commit
        message:
      </P>
      <ClackTerminal copyText={copyText}>
        {/* Step 1 - platform */}
        <ClackPrompt type="multi" title="Platforms?" active isFirst>
          <div className="flex gap-1.5">
            <span className="text-green-500 dark:text-green-400">◼</span>{' '}
            <span className="text-neutral-900 dark:text-neutral-100">Web</span>
          </div>
          <div className="flex gap-1.5">
            <span className="text-neutral-500">◻</span>{' '}
            <span className="text-neutral-500">Desktop</span>
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

        {/* Step 2 - hosting provider */}
        <ClackPrompt type="select" title="Hosting provider?">
          {providers.map((p) => (
            <div key={p.id} className="flex gap-1.5">
              <span
                className={
                  p.label === selected
                    ? 'text-green-500 dark:text-green-400'
                    : 'text-neutral-500'
                }
              >
                {p.label === selected ? '●' : '○'}
              </span>{' '}
              <span
                className={
                  p.label === selected
                    ? 'text-neutral-900 dark:text-neutral-100'
                    : 'text-neutral-500'
                }
              >
                {p.label}
              </span>
            </div>
          ))}
          <div className="mt-2 text-[11px] text-neutral-500">
            ↑/↓ to navigate • Enter: confirm
          </div>
        </ClackPrompt>

        {/* Step 3 - repository URL (skipped if origin exists) */}
        <ClackPrompt type="input" title="GitHub repository URL?">
          <div className="text-neutral-900 dark:text-neutral-100">
            https://github.com/you/my-app
          </div>
        </ClackPrompt>

        {/* Step 4 - branch */}
        <ClackPrompt type="select" title="Branch to push to?">
          <div className="flex gap-1.5">
            <span className="text-green-500 dark:text-green-400">●</span>{' '}
            <span className="text-neutral-900 dark:text-neutral-100">main (default)</span>
          </div>
          <div className="flex gap-1.5">
            <span className="text-neutral-500">○</span>{' '}
            <span className="text-neutral-500">+ New branch...</span>
          </div>
          <div className="mt-2 text-[11px] text-neutral-500">
            ↑/↓ to navigate • Enter: confirm
          </div>
        </ClackPrompt>

        {/* Step 5 - confirm */}
        <ClackPrompt type="select" title="Confirm deployment?">
          <div className="flex items-center gap-1.5 text-[13px] font-mono leading-none">
            <span className="text-green-500 dark:text-green-400">●</span>
            <span className="text-neutral-900 dark:text-neutral-100">Yes</span>
            <span className="text-neutral-500">/</span>
            <span className="text-neutral-500">○</span>
            <span className="text-neutral-500">No</span>
          </div>
        </ClackPrompt>

        {/* Step 6 - commit message (active → cyan) */}
        <ClackPrompt type="input" title="Commit message?" active isLast>
          <div className="text-neutral-900 dark:text-neutral-100">
            chore: add deployment configuration
          </div>
        </ClackPrompt>
      </ClackTerminal>

      <P className="mt-6 mb-4">For scripts and CI, skip the prompts with flags:</P>
      <CodeBlock
        filename="Terminal"
        lang="shell"
        code="$ npx bini-deploy --platform web --hosting vercel --repo https://github.com/you/my-app --branch main --message 'chore: add deployment configuration' --yes"
      />
      <Table
        headers={['Flag', 'Description']}
        rows={[
          [
            <C key="f1">--platform</C>,
            <>
              <C>web</C>, or any of <C>desktop</C>, <C>android</C>, <C>ios</C>{' '}
              (comma-separated). Web cannot be combined with the others.
            </>,
          ],
          [
            <C key="f2">--hosting</C>,
            <>
              Web only - <C>node</C> (default), <C>netlify</C>, <C>vercel</C>, <C>cloudflare</C>,{' '}
              <C>deno</C>.
            </>,
          ],
          [
            <C key="f3">--repo</C>,
            <>
              GitHub repository URL. Must match <C>https://github.com/&lt;owner&gt;/&lt;repo&gt;</C>{' '}
              (letters, digits, <C>_</C>, <C>-</C> only; no <C>.git</C> suffix).
            </>,
          ],
          [
            <C key="f4">--branch, -b</C>,
            <>
              Branch to push to. Default: the remote&apos;s default branch, otherwise <C>main</C>.
            </>,
          ],
          [
            <C key="f5">--message, -m</C>,
            <>
              Commit message. Default: <C>chore: add deployment configuration</C>.
            </>,
          ],
          [
            <C key="f6">--generate-entry</C>,
            <>
              Generate the production entry file only (<C>netlify</C>, <C>vercel</C>,{' '}
              <C>cloudflare</C>, <C>deno</C>) and exit.
            </>,
          ],
          [
            <C key="f7">--dry-run</C>,
            'Show what would be written, removed, and pushed, but do nothing.',
          ],
          [
            <C key="f8">--yes, -y</C>,
            <>
              Skip prompts. Requires <C>--platform</C> and <C>--repo</C>.
            </>,
          ],
          [<C key="f9">--help, -h</C>, 'Print help.'],
        ]}
      />
    </>
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
          Deploying a Web target is a single command. The deploy tool scans your project, generates
          the hosting configuration for the provider you pick, and pushes it to GitHub - your
          provider then builds from that repository automatically.
        </P>
        <P className="mb-0">
          It is already bundled into every Bini.js scaffold and exposed as{' '}
          <C>{run(pm, 'deploy')}</C>. This page covers the Web hosting providers. For desktop and
          mobile targets, see <DocLink to="/docs/deploying">Deployment Overview</DocLink>.
        </P>
      </div>

      <Section id="installation" title="Installation">
        <P className="mb-4">
          Already included in every Bini.js scaffold. To add it to an existing project:
        </P>
        <MultiTerminal
          tabs={tabs(
            (pm) =>
              `$ ${
                pm === 'npm'
                  ? 'npm install --save-dev'
                  : pm === 'pnpm'
                  ? 'pnpm add -D'
                  : pm === 'yarn'
                  ? 'yarn add --dev'
                  : 'bun add -d'
              } bini-deploy`
          )}
        />
      </Section>

      <Section id="supported-providers" title="Supported Providers">
        <Table
          headers={['Provider', 'Runtime', 'Config generated']}
          rows={[
            [
              <ProviderName key="node" icon={siNodedotjs} name="Node.js" />,
              'Node',
              'None',
            ],
            [
              <ProviderName key="netlify" icon={siNetlify} name="Netlify" />,
              'Netlify Functions',
              <C key="c1">netlify.toml</C>,
            ],
            [
              <ProviderName key="vercel" icon={siVercel} name="Vercel" />,
              'Node.js Runtime',
              <C key="c2">vercel.json</C>,
            ],
            [
              <ProviderName key="cf" icon={siCloudflare} name="Cloudflare Workers" />,
              'Workers',
              <C key="c3">wrangler.toml</C>,
            ],
            [
              <ProviderName key="deno" icon={siDeno} name="Deno Deploy" />,
              'Deno',
              <C key="c4">{`server/index.${t}`}</C>,
            ],
          ]}
        />

        <H3 className="mb-3 mt-6">How it works</H3>
        <ol className={OL}>
          <li>
            <strong className={STRONG}>Scan</strong> - finds your API routes under{' '}
            <C>src/app/api/</C>.
          </li>
          <li>
            <strong className={STRONG}>Generate</strong> - writes the platform-specific entry file
            and config for the target provider.
          </li>
          <li>
            <strong className={STRONG}>Clean</strong> - removes leftover files from any previously
            selected provider, including when switching to Node.
          </li>
          <li>
            <strong className={STRONG}>Push</strong> - commits and pushes to your GitHub
            repository.
          </li>
          <li>
            <strong className={STRONG}>Deploy</strong> - your provider builds and deploys from
            GitHub automatically.
          </li>
        </ol>
      </Section>

      <Section
        id="node"
        title="Node.js"
        icon={<Brand icon={siNodedotjs} size={20} />}
      >
        <P className="mb-4">
          The default hosting choice. The deploy tool writes no files - the next steps point to
          your build and start scripts and to the production server, which listens on{' '}
          <C>$PORT</C> (default 3000).
        </P>
        <PickHosting provider="node" isDefault />
        <P className="mt-6 mb-0">
          Works out of the box on Railway, Render, Fly.io, or a VPS running <C>pm2</C>. See{' '}
          <DocLink to="/docs/production-server">Production Server</DocLink> for the full runtime
          reference.
        </P>
      </Section>

      <Section id="netlify" title="Netlify" icon={<Brand icon={siNetlify} size={20} />}>
        <P className="mb-4">API routes run as Netlify Functions.</P>
        <PickHosting provider="netlify" />
        <P className="mt-6 mb-2">Generates:</P>
        <UL className="mb-6 space-y-2">
          <li>
            <C>netlify.toml</C>
          </li>
          <li>
            <C>netlify/functions/api.mjs</C>
          </li>
          <li>
            <C>netlify/edge-functions/spa-fallback.ts</C> or <C>.js</C> - only without
            pre-rendering
          </li>
        </UL>
        <P className="mb-4">
          With pre-rendering enabled, <C>netlify.toml</C> gains a 404 redirect to{' '}
          <C>/404.html</C>. Without it, an edge function rewrites unmatched page requests to{' '}
          <C>index.html</C>.
        </P>
        <Callout>
          Netlify Functions run in a Node.js-like runtime but are not full Node - packages that
          depend on Node built-ins (<C>fs</C>, <C>nodemailer</C>) may not work there.
        </Callout>
      </Section>

      <Section id="vercel" title="Vercel" icon={<Brand icon={siVercel} size={20} />}>
        <P className="mb-4">API routes run on Vercel&apos;s Node.js runtime.</P>
        <PickHosting provider="vercel" />
        <P className="mt-6 mb-2">Generates:</P>
        <UL className="mb-6 space-y-2">
          <li>
            <C>vercel.json</C>
          </li>
          <li>
            <C>api/index.ts</C> or <C>.js</C>
          </li>
          <li>
            <C>api/tsconfig.json</C> - only for TypeScript projects with API routes
          </li>
        </UL>
      </Section>

      <Section
        id="cloudflare"
        title="Cloudflare Workers"
        icon={<Brand icon={siCloudflare} size={20} />}
      >
        <P className="mb-4">API routes run as a Cloudflare Worker.</P>
        <PickHosting provider="cloudflare" />
        <P className="mt-6 mb-2">Generates:</P>
        <UL className="mb-6 space-y-2">
          <li>
            <C>wrangler.toml</C>
          </li>
          <li>
            <C>worker.ts</C> or <C>.js</C> - only when the project has API routes
          </li>
          <li>
            <C>public/.assetsignore</C>
          </li>
        </UL>
        <P className="mb-4">Or deploy manually with Wrangler once the entry file exists:</P>
        <MultiTerminal
          tabs={tabs(
            (pm) =>
              `$ ${
                pm === 'npm'
                  ? 'npx wrangler deploy'
                  : pm === 'pnpm'
                  ? 'pnpm dlx wrangler deploy'
                  : pm === 'yarn'
                  ? 'yarn dlx wrangler deploy'
                  : 'bunx wrangler deploy'
              }`
          )}
        />
      </Section>

      <Section id="deno-deploy" title="Deno Deploy" icon={<Brand icon={siDeno} size={20} />}>
        <P className="mb-4">
          API routes run on Deno. The generated entry is a static server for <C>dist/</C> that
          also serves the API, listening on <C>PORT</C> (default 3000). No config file is written.
        </P>
        <PickHosting provider="deno" />
        <P className="mt-6 mb-2">Generates:</P>
        <UL className="mb-6 space-y-2">
          <li>
            <C>server/index.ts</C> or <C>.js</C>
          </li>
        </UL>
      </Section>

      <Section id="api-routes" title="API Routes">
        <P className="mb-4">
          Every provider mounts the same file-based routes from <C>src/app/api/</C>, dynamic
          segments and catch-alls included:
        </P>
        <RouteVisual
          fileWidth={260}
          rows={[
            { n: 'api' },
            { n: `index.${t}`, d: 1, fn: true, url: '/api' },
            { n: 'users', d: 1 },
            { n: `index.${t}`, d: 2, fn: true, url: '/api/users' },
            { n: `[id].${t}`, d: 2, fn: true, dot: true, url: '/api/users/:id' },
            { n: 'posts', d: 1 },
            { n: `[...slug].${t}`, d: 2, fn: true, url: '/api/posts/*' },
          ]}
        />
        <P className="mb-4">
          Each route exports a default handler that accepts a <C>Request</C> and returns a{' '}
          <C>Response</C> (or a JSON-serializable value):
        </P>
        <CodeBlock
          filename={`src/app/api/users/[id].${t}`}
          tsCode={`export default async function handler(req: Request) {
  const id = new URL(req.url).pathname.split('/').pop();
  return { id, name: 'Ada Lovelace' };
}`}
          jsCode={`export default async function handler(req) {
  const id = new URL(req.url).pathname.split('/').pop();
  return { id, name: 'Ada Lovelace' };
}`}
        />
        <P className="mb-4">
          Files that import <C>hono</C> are detected automatically and mounted as a full Hono app
          instead:
        </P>
        <CodeBlock
          filename={`src/app/api/hello/route.${t}`}
          tsCode={`import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => c.json({ message: 'Hello from Hono!' }));
app.post('/', async (c) => {
  const body = await c.req.json();
  return c.json({ received: body });
});

export default app;`}
          jsCode={`import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => c.json({ message: 'Hello from Hono!' }));
app.post('/', async (c) => {
  const body = await c.req.json();
  return c.json({ received: body });
});

export default app;`}
        />
      </Section>

      <Section id="git-behavior" title="Git Push Behavior">
        <UL className="mb-0 space-y-2">
          <li>
            <strong className={STRONG}>Existing remote</strong> - an <C>origin</C> already set is
            used; otherwise <C>origin</C> is added with the repository URL.
          </li>
          <li>
            <strong className={STRONG}>Branch</strong> - taken from <C>--branch</C>, the interactive
            branch list, or the remote&apos;s default branch (falling back to <C>main</C>). Pushes
            with <C>git push origin HEAD:&lt;branch&gt; --set-upstream</C>.
          </li>
          <li>
            <strong className={STRONG}>Identity</strong> - if <C>user.name</C> / <C>user.email</C>{' '}
            are not set, interactive runs prompt for them; non-interactive runs fail.
          </li>
          <li>
            <strong className={STRONG}>Remote-ahead recovery</strong> - if the remote has commits
            you do not have, the tool fetches and merges with{' '}
            <C>--allow-unrelated-histories -X ours</C>, keeping your local version of any
            conflicting file. A real conflict stops the process and prints manual recovery steps.
          </li>
        </UL>
      </Section>

      <Section id="requirements" title="Requirements">
        <Table
          headers={['Requirement', 'Notes']}
          rows={[
            [
              'Node.js',
              <>
                A version whose <C>node:util</C> provides <C>styleText</C> and <C>parseArgs</C>.
              </>,
            ],
            ['git', 'Used for every git operation.'],
            [
              'GitHub repository',
              <>
                An HTTPS URL such as <C>https://github.com/user/my-app</C>.
              </>,
            ],
            ['Git credentials', 'Pushes use git over HTTPS. Configure Git Credential Manager.'],
            [
              'GitHub CLI (gh)',
              'Only for native deploys that upload signing secrets. Must be logged in.',
            ],
          ]}
        />
      </Section>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link to="/docs/deploying" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Deployment Overview</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Where to deploy a Bini.js app.</p>
        </Link>
        <Link to="/docs/static-export" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Static Export</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Pre-render every route to static HTML.</p>
        </Link>
        <Link to="/docs/production-server" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Production Server</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Run the production server for Node.js hosting.</p>
        </Link>
        <Link to="/docs/environment-variables" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Environment Variables</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Set secrets on each provider.</p>
        </Link>
      </div>
    </>
  )
}

export default function HostingPage() {
  return (
    <DocPage
      title="Hosting Providers"
      description="Zero-config web deployment - generates hosting config and pushes straight to GitHub."
      url="https://bini.js.org/docs/hosting"
      editUrl="https://github.com/Binidu01/bini-official/edit/main/src/app/docs/hosting.tsx"
      toc={TOC_ITEMS}
      prev={{ to: '/docs/static-export', title: 'Static Export' }}
    >
      <Content />
    </DocPage>
  )
}