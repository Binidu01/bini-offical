// src/app/docs/installation.tsx
import { Fragment } from 'react'
import { Link } from 'react-router-dom'

import {
  C,
  Callout,
  ClackPrompt,
  ClackTerminal,
  CodeBlock,
  DocPage,
  ExtLink,
  H3,
  MultiTerminal,
  P,
  Section,
  Table,
  UL,
  type TerminalTab,
} from '../../components/DocBlocks'
import type { TocItem } from '../../components/TableOfContents'

const TOC_ITEMS: TocItem[] = [
  { id: 'quick-start', label: 'Quick start' },
  { id: 'cli-flags', label: 'CLI flags' },
  { id: 'system-requirements', label: 'System requirements' },
  { id: 'supported-browsers', label: 'Supported browsers' },
  { id: 'native-platform-support', label: 'Native platform support' },
  { id: 'add-remove-platforms', label: 'Add or remove platforms' },
  { id: 'run-dev-server', label: 'Run the development server' },
  { id: 'maintenance', label: 'Maintenance commands' },
  { id: 'setup-typescript', label: 'Set up TypeScript' },
  { id: 'setup-linting', label: 'Set up linting' },
  { id: 'setup-absolute-imports', label: 'Set up absolute imports' },
]

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
  pm === 'npm'
    ? `npm run ${script}`
    : pm === 'bun' && bunRun
      ? `bun run ${script}`
      : `${pm} ${script}`

const tabs = (cmd: (pm: Pm) => string): TerminalTab[] =>
  PMS.map((pm) => ({ id: pm, label: pm, command: cmd(pm) }))

/* ---- content data -------------------------------------------------- */

const PLATFORM_EXAMPLES = [
  'my-app --platform desktop',
  'my-app --platform android --app-name "My App" --nosign',
  'my-app --platform web,android',
]

const DEV_TARGETS = [
  {
    title: 'Web',
    script: 'dev',
    bunRun: false,
    note: 'Starts the Vite dev server and opens your browser automatically.',
  },
  {
    title: 'Desktop',
    script: 'tauri:dev',
    note: 'Launches the app in a native desktop window (Windows, macOS, or Linux) with full HMR.',
  },
  {
    title: 'Android',
    script: 'android',
    note: 'Runs the app on a connected Android device or emulator.',
  },
  {
    title: 'iOS',
    script: 'ios',
    note: 'Runs the app on a connected iOS device or simulator. macOS only.',
  },
]

const PACKAGE_JSON = `{
  "scripts": {
    "lint": "oxlint",
    "format": "oxfmt",
    "check": "npm run lint && npm run format"
  }
}`

const IMPORT_EXAMPLE = `// Before
import { Button } from '../../../components/button'

// After
import { Button } from '@/components/button'`

const TSCONFIG = `{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}`

const VITE_CONFIG = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    // ...your other plugins
  ],
  resolve: {
    alias: { '@': '/src' },
  },
})`

/* ---- page ---------------------------------------------------------- */

export default function InstallationPage() {
  return (
    <DocPage
      title="Installation"
      description="Create a new Bini.js application and run it locally."
      url="https://bini.js.org/docs/installation"
      editUrl="https://github.com/Binidu01/bini-official/edit/main/src/app/docs/installation.tsx"
      toc={TOC_ITEMS}
      prev={{ to: '/docs', title: 'Getting Started' }}
      next={{ to: '/docs/project-structure', title: 'Project Structure' }}
    >
      <Section id="quick-start" title="Quick start">
        <P>
          The quickest way to create a new Bini.js app is using <C>create-bini-app</C>, which sets
          up everything automatically.
        </P>
        <MultiTerminal
          tabs={tabs((pm) =>
            [`$ ${CREATE[pm]} my-app`, '$ cd my-app', `$ ${run(pm, 'dev', false)}`].join('\n')
          )}
        />
        <P>On installation, you'll see the following prompts:</P>

        <ClackTerminal
          copyText={`? Project name? my-bini-app
? Use TypeScript? Yes
? Styling solution? Tailwind CSS
? Platforms? Web`}
        >
          <ClackPrompt type="input" title="Project name?" answer="my-bini-app" isFirst />

          <ClackPrompt type="select" title="Use TypeScript?">
            <div className="flex items-center gap-1.5">
              <span className="text-green-500 dark:text-green-400">●</span>{' '}
              <span className="text-neutral-900 dark:text-neutral-100">Yes</span>
              <span className="text-neutral-500"> / </span>
              <span className="text-neutral-400 dark:text-neutral-300">○</span>{' '}
              <span className="text-neutral-400 dark:text-neutral-300">No</span>
            </div>
            <div className="mt-2 text-[11px] text-neutral-500">
              ↑/↓ to navigate • Enter: confirm
            </div>
          </ClackPrompt>

          <ClackPrompt type="select" title="Styling solution?">
            <div className="flex gap-1.5">
              <span className="text-green-500 dark:text-green-400">●</span>{' '}
              <span className="text-neutral-900 dark:text-neutral-100">Tailwind CSS</span>
            </div>
            <div className="flex gap-1.5">
              <span className="text-neutral-400 dark:text-neutral-300">○</span>{' '}
              <span className="text-neutral-400 dark:text-neutral-300">CSS Modules</span>
            </div>
            <div className="flex gap-1.5">
              <span className="text-neutral-400 dark:text-neutral-300">○</span>{' '}
              <span className="text-neutral-400 dark:text-neutral-300">None</span>
            </div>
            <div className="mt-2 text-[11px] text-neutral-500">
              ↑/↓ to navigate • Enter: confirm
            </div>
          </ClackPrompt>

          <ClackPrompt type="multi" title="Platforms?" active isLast>
            <div className="flex gap-1.5">
              <span className="text-green-500 dark:text-green-400">◼</span>{' '}
              <span className="text-neutral-900 dark:text-neutral-100">Web</span>
            </div>
            <div className="flex gap-1.5">
              <span className="text-neutral-400 dark:text-neutral-300">◻</span>{' '}
              <span className="text-neutral-400 dark:text-neutral-300">Desktop (Windows, macOS, Linux)</span>
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

        <Callout>
          After the prompts, <C>create-bini-app</C> creates a folder with your project name,
          installs the required dependencies, and enables TypeScript, Tailwind CSS, Oxlint, and the{' '}
          <C>@/*</C> import alias by default.
        </Callout>
      </Section>

      <Section id="cli-flags" title="CLI flags">
        <P>Skip prompts by passing flags directly:</P>
        <Table
          headers={['Flag', 'Description']}
          rows={[
            ['--typescript', 'Use TypeScript (default)'],
            ['--javascript', 'Use JavaScript'],
            ['--tailwind', 'Use Tailwind CSS (default)'],
            ['--css-modules', 'Use CSS Modules'],
            ['--none', 'No styling'],
            ['--platform <targets>', 'web · desktop · android · ios (comma-separated)'],
            ['--app-name <name>', 'Display name for desktop / mobile apps'],
            ['--org <domain>', 'Bundle ID prefix (reverse domain)'],
            ['--sign / --nosign', 'Code-signing setup'],
            ['--npm / --pnpm / --yarn / --bun', 'Force a specific package manager'],
            ['--no-install', 'Skip dependency installation'],
            ['--force', 'Overwrite existing directory'],
            ['--yes, -y', 'Accept all defaults, no prompts'],
            ['--version, -v', 'Print CLI version'],
            ['--help, -h', 'Show help'],
          ]}
        />
      </Section>

      <Section id="system-requirements" title="System requirements">
        <P>
          Before you begin, make sure your development environment meets the following
          requirements:
        </P>
        <UL>
          <li>
            Minimum Node.js version: <ExtLink href="https://nodejs.org/">20.19.0</ExtLink>
          </li>
          <li>Operating systems: macOS, Windows, and Linux.</li>
          <li>
            For desktop builds: Windows (C++ Build Tools), macOS (Xcode CLT), Linux (WebKitGTK).
          </li>
          <li>For mobile builds: Android (JDK 17, Android Studio), iOS (Xcode, CocoaPods).</li>
        </UL>
      </Section>

      <Section id="supported-browsers" title="Supported browsers">
        <P>Bini.js supports modern browsers with zero configuration.</P>
        <UL>
          <li>Chrome 111+</li>
          <li>Edge 111+</li>
          <li>Firefox 111+</li>
          <li>Safari 16.4+</li>
        </UL>
      </Section>

      <Section id="native-platform-support" title="Native platform support">
        <P>
          Bini.js builds for multiple platforms from a single codebase. Use the <C>--platform</C>{' '}
          flag to target a specific platform:
        </P>
        <MultiTerminal
          tabs={tabs((pm) => PLATFORM_EXAMPLES.map((line) => `$ ${CREATE[pm]} ${line}`).join('\n'))}
        />
        <P>
          Every platform gets the full framework - routing, layouts, API routes, SSG, the overlay, and
          the rest. The <C>--platform</C> flag only decides what the build targets.
        </P>
        <Table
          headers={['Platform', 'Builds']}
          rows={[
            ['web', 'Web app'],
            ['desktop', 'Native desktop binaries (Windows, macOS, Linux)'],
            ['android · ios', 'Native mobile apps'],
          ]}
        />
        <Callout>
          <C>desktop</C> covers Windows, macOS, and Linux from one shared <C>src-tauri/</C>.
          Use <C>web,desktop</C> (comma-separated) to scaffold multiple targets at once.
        </Callout>
      </Section>

      <Section id="add-remove-platforms" title="Add or remove platforms">
        <P>
          You don't have to decide up front. Web is always included, and any native target can be
          added later from inside the project without touching your <C>vite.config</C> or{' '}
          <C>src/app</C>.
        </P>

        <H3>Add a target</H3>
        <MultiTerminal
          tabs={tabs((pm) =>
            [
              `$ ${CREATE[pm]} add`,
              `$ ${CREATE[pm]} add desktop android`,
              `$ ${CREATE[pm]} add ios --sign`,
            ].join('\n')
          )}
        />
        <P>
          With no target, the CLI shows a Clack-style checklist of platforms that are not yet
          added:
        </P>

        <ClackTerminal
          copyText={`? Add platforms? Desktop (Windows, macOS, Linux)
? App name? Newapp
? Organization (bundle ID prefix)? com.bini
? Set up windows signing now? No`}
        >
          <ClackPrompt type="multi" title="Add platforms?" isFirst>
            <div className="flex gap-1.5">
              <span className="text-green-500 dark:text-green-400">◼</span>{' '}
              <span className="text-neutral-900 dark:text-neutral-100">
                Desktop (Windows, macOS, Linux)
              </span>
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

          <ClackPrompt type="input" title="App name?" answer="Newapp" />
          <ClackPrompt type="input" title="Organization (bundle ID prefix)?" answer="com.bini" />

          <ClackPrompt type="select" title="Set up windows signing now?" active isLast>
            <div className="flex items-center gap-1.5">
              <span className="text-neutral-400 dark:text-neutral-300">○</span>{' '}
              <span className="text-neutral-400 dark:text-neutral-300">Yes</span>
              <span className="text-neutral-500"> / </span>
              <span className="text-green-500 dark:text-green-400">●</span>{' '}
              <span className="text-neutral-900 dark:text-neutral-100">No</span>
            </div>
            <div className="mt-2 text-[11px] text-neutral-500">
              ↑/↓ to navigate • Enter: confirm
            </div>
          </ClackPrompt>
        </ClackTerminal>

        <P>
          The first native target adds the shared <C>src-tauri/</C> setup, the Tauri packages, and
          every native script. Desktop operating systems share one <C>src-tauri/</C>, so adding
          desktop again only offers code signing. Re-running is safe - anything already configured is
          skipped.
        </P>
        <Callout>
          Run the command from inside the project. iOS is only offered on macOS; on Windows and
          Linux, <C>add ios</C> prints how to build iOS in CI instead.
        </Callout>

        <H3>Remove a target</H3>
        <MultiTerminal
          tabs={tabs((pm) =>
            [
              `$ ${CREATE[pm]} remove`,
              `$ ${CREATE[pm]} remove android`,
              `$ ${CREATE[pm]} remove desktop android ios`,
            ].join('\n')
          )}
        />
        <P>
          <C>remove</C> lists what it will delete and asks for confirmation. With no target, it
          shows a Clack-style checklist of platforms that are present:
        </P>

        <ClackTerminal copyText={`? Remove platforms? Desktop (Windows, macOS, Linux)`}>
          <ClackPrompt type="multi" title="Remove platforms?" active isFirst isLast>
            <div className="flex gap-1.5">
              <span className="text-green-500 dark:text-green-400">◼</span>{' '}
              <span className="text-neutral-900 dark:text-neutral-100">
                Desktop (Windows, macOS, Linux)
              </span>
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

        <P>
          Web cannot be removed. Desktop shares <C>src-tauri/</C> with mobile, so it can only be
          removed together with all of them.
        </P>
        <Callout>
          Removing a mobile target deletes its generated project (including the keystore copy
          written by <C>sign</C>). Keep your original keystore and password backed up - every store
          update must be signed with the same key.
        </Callout>

        <H3>Rename the app or change the bundle ID</H3>
        <P>
          The native app name and bundle identifier live in <C>src-tauri/tauri.conf.json</C>. To
          change them after the project is created, run one of these from inside the project:
        </P>
        <MultiTerminal
          tabs={tabs((pm) =>
            [
              `$ ${CREATE[pm]} --app-name`,
              `$ ${CREATE[pm]} --org`,
              `$ ${CREATE[pm]} --app-name "My App" --org com.acme`,
            ].join('\n')
          )}
        />

        <ClackTerminal
          copyText={`? New app name? My App
? Bundle ID prefix (reverse domain)? com.acme
? Changing the identifier makes stores treat this as a new app. Continue? Yes`}
        >
          <ClackPrompt type="input" title="New app name?" answer="My App" isFirst />
          <ClackPrompt type="input" title="Bundle ID prefix (reverse domain)?" answer="com.acme" />

          <ClackPrompt
            type="select"
            title="Changing the identifier makes stores treat this as a new app. Continue?"
            active
            isLast
          >
            <div className="flex items-center gap-1.5">
              <span className="text-green-500 dark:text-green-400">●</span>{' '}
              <span className="text-neutral-900 dark:text-neutral-100">Yes</span>
              <span className="text-neutral-500"> / </span>
              <span className="text-neutral-400 dark:text-neutral-300">○</span>{' '}
              <span className="text-neutral-400 dark:text-neutral-300">No</span>
            </div>
            <div className="mt-2 text-[11px] text-neutral-500">
              ↑/↓ to navigate • Enter: confirm
            </div>
          </ClackPrompt>
        </ClackTerminal>

        <UL>
          <li>
            <C>--app-name</C> updates <C>productName</C> and the window title.
          </li>
          <li>
            <C>--org</C> rebuilds the identifier as <C>&lt;org&gt;.&lt;project&gt;</C>.
          </li>
          <li>
            Generated Android and iOS projects keep their old values. Remove and re-add the platform
            to regenerate them, or edit them by hand.
          </li>
        </UL>
      </Section>

      <Section id="run-dev-server" title="Run the development server">
        <P className="mb-6">
          Each platform has its own dev command. Run the one that matches the platform you
          scaffolded.
        </P>
        {DEV_TARGETS.map(({ title, script, bunRun, note }, i) => (
          <Fragment key={title}>
            <H3>{title}</H3>
            <MultiTerminal tabs={tabs((pm) => `$ ${run(pm, script, bunRun)}`)} />
            <P className={i < DEV_TARGETS.length - 1 ? 'mb-6' : ''}>{note}</P>
          </Fragment>
        ))}
      </Section>

      <Section id="maintenance" title="Maintenance commands">
        <P>
          Every project ships with a few maintenance commands. None of them asks for confirmation.
        </P>

        <H3>Check your toolchain</H3>
        <MultiTerminal tabs={tabs((pm) => `$ ${CREATE[pm]} doctor`)} />
        <P>
          Runs <C>tauri info</C> to check Rust, the platform toolchains, and versions. In a project
          without a native target, it just tells you how to add one.
        </P>

        <H3>Delete build output</H3>
        <MultiTerminal tabs={tabs((pm) => `$ ${CREATE[pm]} clean`)} />
        <P>
          Deletes <C>dist/</C>, the generated native build folders, and the Rust build cache.{' '}
          <C>node_modules</C> is kept.
        </P>

        <H3>Upgrade the project</H3>
        <MultiTerminal tabs={tabs((pm) => `$ ${CREATE[pm]} upgrade`)} />
        <P>
          Brings the project up to date with the latest Bini.js release - dependencies, tooling, and
          template files.
        </P>
        <Callout>
          Your code is never touched. <C>src/</C>, <C>package.json</C>, and{' '}
          <C>vite.config.*</C> stay as they are. Commit first, then review the diff after running
          it.
        </Callout>
      </Section>

      <Section id="setup-typescript" title="Set up TypeScript">
        <P className="">
          Bini.js supports TypeScript out of the box. Just pick <C>TypeScript</C> in{' '}
          <C>create-bini-app</C> or use the <C>--typescript</C> flag, and the CLI sets everything
          up for you.
        </P>
      </Section>

      <Section id="setup-linting" title="Set up linting">
        <P>
          Bini.js uses Oxlint for linting and Oxfmt for formatting - pre-configured and ready to use.
        </P>
        <CodeBlock filename="package.json" lang="json" code={PACKAGE_JSON} />
        <P>These scripts refer to the different stages of developing an application:</P>
        <UL>
          <li>
            <C>npm run lint</C> - runs Oxlint.
          </li>
          <li>
            <C>npm run format</C> - runs Oxfmt.
          </li>
          <li>
            <C>npm run check</C> - runs both lint and format.
          </li>
        </UL>
      </Section>

      <Section id="setup-absolute-imports" title="Set up absolute imports and module path aliases">
        <P>
          Bini.js has built-in support for path aliases using the <C>"paths"</C> option in{' '}
          <C>tsconfig.json</C>. These options let you alias project directories to absolute paths,
          making imports easier to read and refactor:
        </P>
        <CodeBlock code={IMPORT_EXAMPLE} />
        <P>Path aliases are configured by default:</P>
        <CodeBlock filename="tsconfig.json" lang="json" code={TSCONFIG} />
        <Callout>
          Vite resolves the <C>@</C> alias to the <C>src</C> directory through the{' '}
          <C>resolve.alias</C> entry in <C>vite.config.ts</C>.
        </Callout>
        <CodeBlock filename="vite.config.ts" code={VITE_CONFIG} />
      </Section>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link to="/docs/project-structure" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Project Structure</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Learn how a Bini.js project is organized and what each folder contains.</p>
        </Link>
        <Link to="/docs/layouts-and-pages" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Layouts and Pages</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Create your first pages and wrap them in shared layouts.</p>
        </Link>
        <Link to="/docs/folder-based-routing" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Routing</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Define routes from the filesystem with folder-based and file-based conventions.</p>
        </Link>
        <Link to="/docs/api-routes" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">API Routes</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Add backend endpoints with plain functions or a full Hono app.</p>
        </Link>
        <Link to="/docs/deploying" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Deployment</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Deploy to Node, Vercel, Netlify, Cloudflare, or Deno, or build native apps in CI.</p>
        </Link>
        <Link to="/docs/platform-web" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Platforms</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Build for web, Windows, macOS, Linux, Android, or iOS from one codebase.</p>
        </Link>
      </div>
    </DocPage>
  )
}