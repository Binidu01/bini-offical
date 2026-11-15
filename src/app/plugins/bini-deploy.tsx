// src/app/plugins/bini-deploy/page.tsx
import type { ReactNode } from 'react'

import {
  C,
  ClackPrompt,
  ClackTerminal,
  CodeBlock,
  H3,
  MultiTerminal,
  P,
  Section,
  Table,
  UL,
  type TerminalTab,
} from '../../components/DocBlocks'
import { FolderVisual } from '../../components/DocVisuals'
import { PluginPage } from '../../components/PluginPage'
import type { TocItem } from '../../components/TableOfContents'

const TOC_ITEMS: TocItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'features', label: 'Features' },
  { id: 'install', label: 'Install' },
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

/* ---- package-manager tab helpers ---------------------------------- */

const PMS = ['npm', 'pnpm', 'yarn', 'bun'] as const
type Pm = (typeof PMS)[number]

const RUN: Record<Pm, string> = {
  npm: 'npx bini-deploy',
  pnpm: 'pnpm dlx bini-deploy',
  yarn: 'yarn dlx bini-deploy',
  bun: 'bunx bini-deploy',
}

const tabs = (cmd: (pm: Pm) => string): TerminalTab[] =>
  PMS.map((pm) => ({ id: pm, label: pm, command: cmd(pm) }))

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

      <Section id="install" title="Install">
        <MultiTerminal
          tabs={[
            { id: 'npm', label: 'npm', command: '$ npm install --save-dev bini-deploy' },
            { id: 'pnpm', label: 'pnpm', command: '$ pnpm add -D bini-deploy' },
            { id: 'yarn', label: 'yarn', command: '$ yarn add -D bini-deploy' },
            { id: 'bun', label: 'bun', command: '$ bun add -d bini-deploy' },
          ]}
        />
      </Section>

      <Section id="quick-start" title="Quick Start">
        <P>Run the CLI and answer the prompts:</P>
        <MultiTerminal tabs={tabs((pm) => `$ ${RUN[pm]}`)} />

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
          If you picked <C>Web</C>, it then asks for the hosting provider:
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
          Enter your repository URL (skipped when an <C>origin</C> remote already exists):
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
          By default it pushes to the remote&apos;s default branch, falling back to <C>main</C>:
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
        <P className="mb-4">A confirmation prompt appears before generating files and pushing:</P>
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
        <P className="mb-4">Finally, it asks for a commit message. Press Enter to use the default:</P>
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
      </Section>

      <Section id="usage" title="Usage">
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
          tabs={tabs(
            (pm) =>
              [
                `$ ${RUN[pm]} --platform web --hosting vercel --repo https://github.com/you/your-app --yes`,
                `$ ${RUN[pm]} --platform windows --repo https://github.com/you/your-app -y`,
                `$ ${RUN[pm]} --generate-entry netlify`,
              ].join('\n'),
          )}
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
          code={`export default async function handler(req) {
  const id = new URL(req.url).pathname.split('/').pop();
  return { id, name: 'Ada Lovelace' };
}`}
        />
      </Section>

      <Section id="hono-support" title="Hono Support">
        <P>
          If your route file imports from <C>hono</C>, bini-deploy detects it and mounts it as a
          full Hono app:
        </P>
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