// src/app/plugins/bini-deploy/page.tsx
import type { ReactNode } from 'react'

import {
  Callout,
  C,
  CodeBlock,
  MultiTerminal,
  P,
  PromptOutput,
  Section,
  Table,
  UL,
} from '../../components/DocBlocks'
import { FolderVisual } from '../../components/DocVisuals'
import { PluginPage } from '../../components/PluginPage'
import type { TocItem } from '../../components/TableOfContents'

const TOC_ITEMS: TocItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'features', label: 'Features' },
  { id: 'installation', label: 'Installation' },
  { id: 'quick-start', label: 'Quick Start' },
  { id: 'usage', label: 'Usage' },
  { id: 'hosting', label: 'Hosting Providers' },
  { id: 'api-routes', label: 'API Routes' },
  { id: 'hono-support', label: 'Hono Support' },
  { id: 'how-it-works', label: 'How it Works' },
  { id: 'git-behavior', label: 'Git Behavior' },
  { id: 'requirements', label: 'Requirements' },
]

const EDIT_URL =
  'https://github.com/Binidu01/bini-official/edit/main/src/app/plugins/bini-deploy/page.tsx'

function FeatureCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-neutral-950">
      <h3 className="mb-2 text-sm font-semibold text-black dark:text-white">{title}</h3>
      <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{children}</p>
    </div>
  )
}

export default function BiniDeployPage() {
  return (
    <PluginPage
      title="bini-deploy"
      badge="Official"
      description="Zero-config deployment for Bini.js projects - web, desktop, and mobile, all from one CLI."
      url="https://bini.dev/plugins/bini-deploy"
      editUrl={EDIT_URL}
      toc={TOC_ITEMS}
      prev={{ to: '/plugins/create-bini-app', title: 'create-bini-app' }}
      next={{ to: '/plugins/bini-router', title: 'bini-router' }}
    >
      <Section id="overview" title="Overview">
        <P>
          <C>bini-deploy</C> scans your project, generates the right hosting configuration for
          your target platform, and pushes it straight to GitHub. No YAML spelunking, no
          platform-specific docs to read first.
        </P>
        <Callout>
          One command from zero to deployed. Handles git identity, GitHub auth, branch naming, and
          cleanup automatically.
        </Callout>
      </Section>

      <Section id="features" title="Features">
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <FeatureCard title="Web Hosting">
            Netlify, Vercel, Cloudflare Workers, Deno Deploy. Picks adapter, writes config, wires
            API routes.
          </FeatureCard>
          <FeatureCard title="File-based API">
            Drop files in <C>src/app/api/</C>, bini-deploy scans and mounts each as route with
            dynamic segments.
          </FeatureCard>
          <FeatureCard title="Automatic CORS">
            API routes get permissive CORS headers out of the box on every non-Node adapter.
          </FeatureCard>
          <FeatureCard title="Native Support">
            Windows, macOS, Linux, iOS, Android via Tauri with tailored next-step instructions.
          </FeatureCard>
          <FeatureCard title="Git Built-in">
            Init repo if needed, sets up identity and auth if missing, commits and pushes.
          </FeatureCard>
          <FeatureCard title="Smart Diagnostics">
            Push failures diagnosed - bad credentials, repo not found, or diverged history with
            accurate recovery.
          </FeatureCard>
        </div>
      </Section>

      <Section id="installation" title="Installation">
        <MultiTerminal
          tabs={[
            { id: 'npm', label: 'npm', command: `$ npm install --save-dev bini-deploy` },
            { id: 'pnpm', label: 'pnpm', command: `$ pnpm add -D bini-deploy` },
            { id: 'yarn', label: 'yarn', command: `$ yarn add -D bini-deploy` },
            { id: 'bun', label: 'bun', command: `$ bun add -D bini-deploy` },
          ]}
        />
      </Section>

      <Section id="quick-start" title="Quick Start">
        <P>Interactive mode - just run it and answer the prompts:</P>
        <MultiTerminal
          tabs={[
            { id: 'npm', label: 'npm', command: `$ npx bini-deploy` },
            { id: 'pnpm', label: 'pnpm', command: `$ pnpm dlx bini-deploy` },
            { id: 'yarn', label: 'yarn', command: `$ yarn dlx bini-deploy` },
            { id: 'bun', label: 'bun', command: `$ bunx bini-deploy` },
          ]}
        />
        <P className="mb-4">bini-deploy will guide you through two prompts:</P>
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
        <PromptOutput
          lines={[
            { kind: 'question', text: 'Select hosting provider:' },
            { kind: 'option', text: 'Node.js (default - bini-server)', selected: true },
            { kind: 'option', text: 'Netlify' },
            { kind: 'option', text: 'Vercel' },
            { kind: 'option', text: 'Cloudflare Workers' },
            { kind: 'option', text: 'Deno Deploy' },
            { kind: 'blank' },
            { kind: 'hint', text: '↑↓ navigate • ⏎ select' },
          ]}
        />
        <P>Non-interactive mode - for scripts and CI:</P>
        <MultiTerminal
          tabs={[
            {
              id: 'npm',
              label: 'npm',
              command: `$ npx bini-deploy --platform web --hosting vercel --repo https://github.com/you/your-app --yes`,
            },
            {
              id: 'pnpm',
              label: 'pnpm',
              command: `$ pnpm dlx bini-deploy --platform web --hosting vercel --repo https://github.com/you/your-app --yes`,
            },
            {
              id: 'yarn',
              label: 'yarn',
              command: `$ yarn dlx bini-deploy --platform web --hosting vercel --repo https://github.com/you/your-app --yes`,
            },
            {
              id: 'bun',
              label: 'bun',
              command: `$ bunx bini-deploy --platform web --hosting vercel --repo https://github.com/you/your-app --yes`,
            },
          ]}
        />
      </Section>

      <Section id="usage" title="Usage">
        <MultiTerminal
          tabs={[
            { id: 'npm', label: 'npm', command: `$ npx bini-deploy [options]` },
            { id: 'pnpm', label: 'pnpm', command: `$ pnpm dlx bini-deploy [options]` },
            { id: 'yarn', label: 'yarn', command: `$ yarn dlx bini-deploy [options]` },
            { id: 'bun', label: 'bun', command: `$ bunx bini-deploy [options]` },
          ]}
        />
        <Table
          headers={['Flag', 'Description']}
          rows={[
            ['--platform <type>', 'web, windows, macos, ios, linux, android'],
            [
              '--hosting <name>',
              'node (default), netlify, vercel, cloudflare, deno (web only)',
            ],
            ['--repo <url>', 'GitHub repo URL, e.g. https://github.com/you/app'],
            ['--generate-entry <host>', 'Generate production entry file only'],
            ['--yes, -y', 'Skip prompts and use flags'],
            ['--help, -h', 'Show usage information'],
          ]}
        />
        <P className="mb-3 font-medium text-black dark:text-white">Examples:</P>
        <MultiTerminal
          tabs={[
            {
              id: 'npm',
              label: 'npm',
              command: `$ npx bini-deploy --platform web --hosting vercel --repo https://github.com/you/your-app --yes\n$ npx bini-deploy --platform windows --repo https://github.com/you/your-app -y\n$ npx bini-deploy --generate-entry netlify\n$ npx bini-deploy`,
            },
            {
              id: 'pnpm',
              label: 'pnpm',
              command: `$ pnpm dlx bini-deploy --platform web --hosting vercel --repo https://github.com/you/your-app --yes\n$ pnpm dlx bini-deploy --platform windows --repo https://github.com/you/your-app -y`,
            },
            {
              id: 'yarn',
              label: 'yarn',
              command: `$ yarn dlx bini-deploy --platform web --hosting vercel --repo https://github.com/you/your-app --yes`,
            },
            {
              id: 'bun',
              label: 'bun',
              command: `$ bunx bini-deploy --platform web --hosting vercel --repo https://github.com/you/your-app --yes`,
            },
          ]}
        />
      </Section>

      <Section id="hosting" title="Supported Hosting Providers">
        <Table
          headers={['Provider', 'Runtime', 'Config Generated']}
          rows={[
            [
              'Node.js (default)',
              'Node (bini-server)',
              'None - bini-server handles build/serve',
            ],
            [
              'Netlify',
              'Edge Functions (Deno)',
              'netlify.toml + netlify/edge-functions/api.ts',
            ],
            ['Vercel', 'Node.js Runtime', 'vercel.json + api/index.ts'],
            ['Cloudflare Workers', 'Workers', 'wrangler.toml + worker.ts'],
            ['Deno Deploy', 'Deno', 'server/index.ts'],
          ]}
        />
        <Callout>
          Node is default because Bini.js ships with <C>bini-server</C>, a zero-dependency
          production server. Choosing it skips config generation entirely.
        </Callout>
      </Section>

      <Section id="api-routes" title="API Routes">
        <P>
          Any file in <C>src/app/api/</C> becomes an API route. Nested folders map to URL
          segments, bracket segments become dynamic params, and spread segments become wildcards:
        </P>
        <FolderVisual
          width={280}
          rows={[
            { n: 'api', d: 0 },
            { n: 'index.ts', d: 1, fn: true },
            { n: 'users', d: 1 },
            { n: 'index.ts', d: 2, fn: true },
            { n: '[id].ts', d: 2, fn: true },
            { n: 'posts', d: 1 },
            { n: '[...slug].ts', d: 2, fn: true },
          ]}
        />
        <CodeBlock
          filename="src/app/api/users/[id].ts"
          lang="js"
          code={`export default async function handler(req) {
  const id = new URL(req.url).pathname.split('/').pop();
  return { id, name: 'Ada Lovelace' };
}`}
        />
        <Callout>
          If your <C>package.json</C> has <C>"type": "module"</C>, every relative import must
          include its file extension explicitly - <C>./utils.js</C> not <C>./utils</C> - or
          deployed function will crash with <C>ERR_MODULE_NOT_FOUND</C>.
        </Callout>
      </Section>

      <Section id="hono-support" title="Hono Support">
        <P>
          If your route file imports from <C>hono</C>, bini-deploy detects it and mounts it as a
          full Hono app:
        </P>
        <CodeBlock
          filename="src/app/api/hello/route.ts"
          lang="js"
          code={`import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => c.json({ message: 'Hello from Hono!' }));
app.post('/', async (c) => {
  const body = await c.req.json();
  return c.json({ received: body });
});

export default app;`}
        />
      </Section>

      <Section id="how-it-works" title="How it Works">
        <ol className="mb-6 list-decimal space-y-2 pl-5 text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400">
          <li>
            <span className="font-medium text-black dark:text-white">Scan</span> - scans your{' '}
            <C>src/app/api/</C> directory for route files
          </li>
          <li>
            <span className="font-medium text-black dark:text-white">Generate</span> - creates
            platform-specific entry file and configuration
          </li>
          <li>
            <span className="font-medium text-black dark:text-white">Clean</span> - removes
            leftover files from previously selected platform
          </li>
          <li>
            <span className="font-medium text-black dark:text-white">Push</span> - commits and
            pushes everything to GitHub
          </li>
          <li>
            <span className="font-medium text-black dark:text-white">Deploy</span> - hosting
            platform automatically deploys from GitHub
          </li>
        </ol>
      </Section>

      <Section id="git-behavior" title="Git Behavior">
        <UL className="mb-6 space-y-3">
          <li>
            <span className="font-medium text-black dark:text-white">Existing remote</span> - uses
            it without modification
          </li>
          <li>
            <span className="font-medium text-black dark:text-white">New projects</span> - adds
            provided URL as origin
          </li>
          <li>
            <span className="font-medium text-black dark:text-white">Always main</span> -
            automatically handles branch naming, never pushes to master
          </li>
          <li>
            <span className="font-medium text-black dark:text-white">Git identity</span> - prompts
            for <C>user.name/user.email</C> once if not set, local only
          </li>
          <li>
            <span className="font-medium text-black dark:text-white">GitHub auth</span> - prompts
            for username + PAT if push rejected, saves via credential store
          </li>
          <li>
            <span className="font-medium text-black dark:text-white">Remote-ahead recovery</span>{' '}
            - fetches and merges remote history automatically with{' '}
            <C>--allow-unrelated-histories -X ours</C>
          </li>
        </UL>
      </Section>

      <Section id="requirements" title="Requirements">
        <UL>
          <li>Node.js {'>='} 18</li>
          <li>Vite {'>='} 6</li>
          <li>A GitHub repository (created ahead of time)</li>
          <li>git available on PATH</li>
        </UL>
      </Section>
    </PluginPage>
  )
}