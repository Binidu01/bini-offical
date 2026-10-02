// src/app/docs/hosting.tsx
import { siCloudflare, siDeno, siNetlify, siNodedotjs, siVercel } from 'simple-icons'

import {
  BrandIcon,
  C,
  Callout,
  CodeBlock,
  DocLink,
  DocPage,
  H3,
  MultiTerminal,
  P,
  PromptOutput,
  Section,
  Table,
  UL,
  useDocLang,
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
  { id: 'api-routes', label: 'API Routes & Hono' },
  { id: 'cors', label: 'Automatic CORS' },
  { id: 'git-behavior', label: 'Git Push Behavior' },
  { id: 'requirements', label: 'Requirements' },
]

const STRONG = 'font-medium text-black dark:text-white'
const OL =
  'mb-6 list-decimal space-y-2 pl-5 text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400'
const ICON_COLOR = 'text-black dark:text-white'

const INSTALL_TABS = [
  { id: 'npm', label: 'npm', command: '$ npm install --save-dev bini-deploy' },
  { id: 'pnpm', label: 'pnpm', command: '$ pnpm add -D bini-deploy' },
  { id: 'yarn', label: 'yarn', command: '$ yarn add --dev bini-deploy' },
  { id: 'bun', label: 'bun', command: '$ bun add -d bini-deploy' },
]

const DEPLOY_TABS = [
  { id: 'npm', label: 'npm', command: '$ npm run deploy' },
  { id: 'pnpm', label: 'pnpm', command: '$ pnpm deploy' },
  { id: 'yarn', label: 'yarn', command: '$ yarn deploy' },
  { id: 'bun', label: 'bun', command: '$ bun run deploy' },
]

const WRANGLER_TABS = [
  { id: 'npm', label: 'npm', command: '$ npx wrangler deploy' },
  { id: 'pnpm', label: 'pnpm', command: '$ pnpm dlx wrangler deploy' },
  { id: 'yarn', label: 'yarn', command: '$ yarn dlx wrangler deploy' },
  { id: 'bun', label: 'bun', command: '$ bunx wrangler deploy' },
]

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
 * The interactive hosting-provider prompt as bini-deploy shows it,
 * with the provider for the current section highlighted.
 */
function PickHosting({ provider, isDefault = false }: { provider: string; isDefault?: boolean }) {
  const providers = [
    { id: 'node', label: 'Node.js (default - bini-server)' },
    { id: 'netlify', label: 'Netlify' },
    { id: 'vercel', label: 'Vercel' },
    { id: 'cloudflare', label: 'Cloudflare Workers' },
    { id: 'deno', label: 'Deno Deploy' },
  ]
  const selected = providers.find((p) => p.id === provider)?.label ?? providers[0].label

  return (
    <>
      <P className="mb-4">
        Pick <strong className={STRONG}>web</strong>, then{' '}
        <strong className={STRONG}>{selected.split(' ')[0]}</strong>
        {isDefault ? ' (the default)' : ''} when prompted:
      </P>
      <PromptOutput
        lines={[
          { kind: 'question', text: 'Select hosting provider:' },
          ...providers.map((p) => ({
            kind: 'option' as const,
            text: p.label,
            selected: p.label === selected,
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
  const t = lang === 'js' ? 'js' : 'ts'

  return (
    <>
      <div className="mb-12">
        <P className="mb-4">
          <C>bini-deploy</C> scans your project, generates the right hosting configuration for your
          target provider, and pushes it straight to GitHub - no YAML spelunking, no
          platform-specific docs to read first.
        </P>
        <P className="mb-0">
          It is bundled into every Bini.js scaffold and exposed as <C>npm run deploy</C>. This page
          covers the <strong className={STRONG}>web hosting providers</strong> it supports. For
          desktop and mobile targets, see{' '}
          <DocLink to="/docs/deploying">Deployment Overview</DocLink>.
        </P>
      </div>

      <Section id="installation" title="Installation">
        <P className="mb-4">
          Already included in every Bini.js scaffold. To add it to an existing project:
        </P>
        <MultiTerminal tabs={INSTALL_TABS} />
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
              'Edge Functions (Deno)',
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
        <Callout>
          <strong>Node is the default</strong> because Bini.js ships with <C>bini-server</C>, a
          zero-dependency production server. Choosing it skips config generation entirely - there
          is nothing to adapt, so bini-deploy just commits and pushes.
        </Callout>

        <H3 className="mb-3 mt-6">How it works</H3>
        <ol className={OL}>
          <li>
            <strong className={STRONG}>Scan</strong> - scans <C>src/app/api/</C> for route files
          </li>
          <li>
            <strong className={STRONG}>Generate</strong> - creates the platform-specific entry file
            and config
          </li>
          <li>
            <strong className={STRONG}>Clean</strong> - removes leftover entry files, config, and
            directories from any previously selected platform, including when switching to Node or
            a native platform
          </li>
          <li>
            <strong className={STRONG}>Push</strong> - commits and pushes everything to your GitHub
            repository
          </li>
          <li>
            <strong className={STRONG}>Deploy</strong> - your hosting provider deploys
            automatically from GitHub
          </li>
        </ol>

        <H3 className="mb-3 mt-6">Usage</H3>
        <P className="mb-4">
          Every Bini.js scaffold already has this wired into <C>package.json</C>, so deploying is
          just:
        </P>
        <MultiTerminal tabs={DEPLOY_TABS} />
        <P className="mb-4">
          This runs <C>bini-deploy</C> interactively - it prompts you to pick a platform (
          <C>web</C>, <C>windows</C>, <C>macos</C>, <C>linux</C>, <C>android</C>, <C>ios</C>) and,
          if you choose web, a hosting provider (<C>node</C>, <C>netlify</C>, <C>vercel</C>,{' '}
          <C>cloudflare</C>, <C>deno</C>).
        </P>
        <P className="mb-4">For scripts and CI, skip the prompts with flags:</P>
        <CodeBlock
          filename="Terminal"
          lang="shell"
          code="$ npx bini-deploy --platform web --hosting vercel --repo https://github.com/you/your-app --yes"
        />
        <Table
          headers={['Flag', 'Description']}
          rows={[
            [
              <C key="f1">--platform</C>,
              <>
                <C>web</C>, <C>windows</C>, <C>macos</C>, <C>ios</C>, <C>linux</C>, <C>android</C>
              </>,
            ],
            [
              <C key="f2">--hosting</C>,
              <>
                web only - <C>node</C> (default), <C>netlify</C>, <C>vercel</C>, <C>cloudflare</C>,{' '}
                <C>deno</C>
              </>,
            ],
            [<C key="f3">--repo</C>, 'GitHub repository URL to push to'],
            [
              <C key="f4">--generate-entry</C>,
              <>
                generate only the production entry file - <C>netlify</C>, <C>vercel</C>,{' '}
                <C>cloudflare</C>, <C>deno</C>
              </>,
            ],
            [<C key="f5">--yes, -y</C>, 'skip interactive prompts and use the flags provided'],
          ]}
        />
      </Section>

      <Section
        id="node"
        title="Node.js"
        icon={<Brand icon={siNodedotjs} size={20} />}
      >
        <P className="mb-4">
          The default hosting choice. <C>bini-server</C> reads your API handlers directly from{' '}
          <C>src/app/api/</C> at request time - no build step, no generated entry file.
        </P>
        <MultiTerminal tabs={DEPLOY_TABS} />
        <PickHosting provider="node" isDefault />
        <P className="mb-0">
          Works out of the box on Railway, Render, Fly.io, or a bare VPS with <C>pm2</C>. See{' '}
          <DocLink to="/docs/production-server">Production Server</DocLink> for the full runtime
          reference.
        </P>
      </Section>

      <Section id="netlify" title="Netlify" icon={<Brand icon={siNetlify} size={20} />}>
        <P className="mb-4">API routes run as Netlify Edge Functions.</P>
        <MultiTerminal tabs={DEPLOY_TABS} />
        <PickHosting provider="netlify" />
        <P className="mb-2">Generates:</P>
        <UL className="mb-6 space-y-2">
          <li>
            <C>netlify.toml</C>
          </li>
          <li>
            <C>{`netlify/edge-functions/api.${t}`}</C>
          </li>
        </UL>
        <CodeBlock
          filename="netlify.toml"
          lang="text"
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
        <Callout>
          Edge Functions run on <strong>Deno, not Node</strong> - packages depending on Node
          built-ins (<C>fs</C>, <C>nodemailer</C>) will not work there.
        </Callout>
      </Section>

      <Section id="vercel" title="Vercel" icon={<Brand icon={siVercel} size={20} />}>
        <P className="mb-4">API routes run on Vercel&apos;s Node.js Runtime.</P>
        <MultiTerminal tabs={DEPLOY_TABS} />
        <PickHosting provider="vercel" />
        <P className="mb-2">Generates:</P>
        <UL className="mb-6 space-y-2">
          <li>
            <C>vercel.json</C>
          </li>
          <li>
            <C>{`api/index.${t}`}</C>
          </li>
        </UL>
        <Callout>
          Vercel reads <C>{`api/index.${t}`}</C> before running your build - bini-deploy commits it
          for you, so it is already there when CI runs. It imports <C>hono</C> as an npm package,
          so bini-deploy checks it is installed and tells you the exact install command if it is
          missing.
        </Callout>
      </Section>

      <Section
        id="cloudflare"
        title="Cloudflare Workers"
        icon={<Brand icon={siCloudflare} size={20} />}
      >
        <P className="mb-4">API routes run as a Cloudflare Worker.</P>
        <MultiTerminal tabs={DEPLOY_TABS} />
        <PickHosting provider="cloudflare" />
        <P className="mb-2">Generates:</P>
        <UL className="mb-6 space-y-2">
          <li>
            <C>wrangler.toml</C>
          </li>
          <li>
            <C>{`worker.${t}`}</C>
          </li>
        </UL>
        <P className="mb-4">Or deploy manually with Wrangler once the entry file exists:</P>
        <MultiTerminal tabs={WRANGLER_TABS} />
        <Callout>
          Like Vercel, the worker entry imports <C>hono</C> as an npm package - bini-deploy
          verifies it is installed before generating the entry file.
        </Callout>
      </Section>

      <Section id="deno-deploy" title="Deno Deploy" icon={<Brand icon={siDeno} size={20} />}>
        <P className="mb-4">API routes run on Deno.</P>
        <MultiTerminal tabs={DEPLOY_TABS} />
        <PickHosting provider="deno" />
        <P className="mb-2">Generates:</P>
        <UL className="mb-6 space-y-2">
          <li>
            <C>{`server/index.${t}`}</C>
          </li>
        </UL>
        <P className="mb-2">In the Deno Deploy dashboard, set:</P>
        <UL className="mb-6 space-y-2">
          <li>
            <strong className={STRONG}>Entrypoint:</strong> <C>{`server/index.${t}`}</C>
          </li>
          <li>
            <strong className={STRONG}>Runtime:</strong> Dynamic App
          </li>
        </UL>
        <Callout>
          Deno Deploy also reads its entry file before building - same reasoning as Vercel above.
          Deno and Netlify both import <C>hono</C> directly from a URL, so no local install check
          is needed for these two.
        </Callout>
      </Section>

      <Section id="api-routes" title="API Routes & Hono">
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
          Imports from <C>hono</C> are detected automatically and mounted as a full Hono app
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
        <Callout>
          <strong>ESM projects:</strong> since Bini.js projects ship with{' '}
          <C>&quot;type&quot;: &quot;module&quot;</C>, Node&apos;s native ESM loader requires
          relative imports to include their file extension. bini-deploy&apos;s generated imports
          already include <C>.js</C>, but if your route files import local helpers (e.g.{' '}
          <C>./utils</C>), include the extension there too (<C>./utils.js</C>) or the deployed
          function will crash with <C>ERR_MODULE_NOT_FOUND</C> even though the build succeeds.
        </Callout>
      </Section>

      <Section id="cors" title="Automatic CORS">
        <P className="mb-0">
          API routes get permissive CORS headers out of the box on every non-Node hosting adapter -
          Netlify, Vercel, Cloudflare, and Deno - so your frontend can call them without extra
          setup.
        </P>
      </Section>

      <Section id="git-behavior" title="Git Push Behavior">
        <UL className="mb-6 space-y-2">
          <li>
            <strong className={STRONG}>Existing remote</strong> - used without modification
          </li>
          <li>
            <strong className={STRONG}>New projects</strong> - the provided URL is added as{' '}
            <C>origin</C>
          </li>
          <li>
            <strong className={STRONG}>No remote updates</strong> - once a remote is set, it is
            never changed
          </li>
          <li>
            <strong className={STRONG}>Always main</strong> - always pushes to <C>main</C>,
            automatically renaming <C>master</C> if needed
          </li>
          <li>
            <strong className={STRONG}>Remote-ahead recovery</strong> - if the remote has commits
            you do not have locally (e.g. GitHub auto-created a README), bini-deploy fetches and
            merges automatically with <C>--allow-unrelated-histories -X ours</C>, keeping your
            local version of any file that exists on both sides. A warning prints before the merge
            runs; a real conflict stops the process and prints manual recovery steps
          </li>
        </UL>
        <Callout>
          This means you can run <C>bini-deploy</C> multiple times without accidentally pushing to
          the wrong repository.
        </Callout>
      </Section>

      <Section id="requirements" title="Requirements">
        <Table
          headers={['Requirement', 'Version']}
          rows={[
            ['Node.js', '>= 18'],
            ['Vite', '>= 6'],
            ['git', 'available on your PATH'],
            ['GitHub repository', 'created ahead of time, to push to'],
          ]}
        />
      </Section>
    </>
  )
}

/* ---------- page ---------- */

export default function HostingPage() {
  return (
    <DocPage
      title="Hosting Providers"
      description="Zero-config web deployment with bini-deploy - generates hosting config and pushes straight to GitHub."
      url="https://bini.js.org/docs/hosting"
      editUrl="https://github.com/Binidu01/bini-official/edit/main/src/app/docs/hosting.tsx"
      toc={TOC_ITEMS}
      prev={{ to: '/docs/static-export', title: 'Static Export' }}
    >
      <Content />
    </DocPage>
  )
}