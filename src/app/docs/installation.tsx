// src/app/docs/installation.tsx
import { Fragment } from 'react'

import {
  C,
  Callout,
  CodeBlock,
  DocPage,
  ExtLink,
  H3,
  MultiTerminal,
  OutputBlock,
  P,
  PromptOutput,
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
  { id: 'run-dev-server', label: 'Run the development server' },
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
  pm === 'npm' ? `npm run ${script}` : pm === 'bun' && bunRun ? `bun run ${script}` : `${pm} ${script}`

const tabs = (cmd: (pm: Pm) => string): TerminalTab[] =>
  PMS.map((pm) => ({ id: pm, label: pm, command: cmd(pm) }))

/* ---- content data -------------------------------------------------- */

const PLATFORM_EXAMPLES = [
  'my-app --platform macos',
  'my-app --platform android --app-name "My App" --nosign',
  'my-app --platform windows',
]

const DEV_TARGETS = [
  {
    title: 'Web',
    script: 'dev',
    bunRun: false,
    note: 'Starts the Vite dev server and opens your browser automatically.',
  },
  {
    title: 'Windows',
    script: 'tauri:dev',
    note: 'Launches the app in a native Windows window with full HMR.',
  },
  {
    title: 'macOS',
    script: 'tauri:dev',
    note: 'Launches the app in a native macOS window with full HMR.',
  },
  {
    title: 'Linux',
    script: 'tauri:dev',
    note: 'Launches the app in a native Linux window with full HMR.',
  },
  {
    title: 'Android',
    script: 'android',
    note: 'Runs the app on a connected Android device or emulator.',
  },
  {
    title: 'iOS',
    script: 'ios',
    note: 'Runs the app on a connected iOS device or simulator.',
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
import tailwindcss from '@tailwindcss/vite'
import { biniroute } from 'bini-router'
import { biniOverlay } from 'bini-overlay'
import { biniEnv } from 'bini-env'
import { biniSSG } from 'bini-ssg'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    biniroute(),
    biniOverlay(),
    biniEnv(),
    biniSSG(),
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
        <PromptOutput
          lines={[
            { kind: 'input', label: 'Project name?', value: 'my-bini-app' },
            { kind: 'blank' },
            {
              kind: 'question-block',
              text: 'Use TypeScript?',
              options: [
                { text: 'Yes', selected: true },
                { text: 'No' },
              ],
              hint: '↑↓ navigate • ⏎ select',
            },
            { kind: 'blank' },
            {
              kind: 'question-block',
              text: 'Styling solution?',
              options: [
                { text: 'Tailwind CSS', selected: true },
                { text: 'CSS Modules' },
                { text: 'None' },
              ],
              hint: '↑↓ navigate • ⏎ select',
            },
            { kind: 'blank' },
            {
              kind: 'question-block',
              text: 'Which platform would you like to target?',
              options: [
                { text: 'Web Application', selected: true },
                { text: 'Windows Desktop' },
                { text: 'Linux Desktop' },
                { text: 'macOS Desktop' },
                { text: 'Android' },
                { text: 'iOS' },
              ],
              hint: '↑↓ navigate • ⏎ select',
            },
          ]}
        />
        <Callout>
          After the prompts, <C>create-bini-app</C> creates a folder with your project name,
          installs the required dependencies, and enables TypeScript, Tailwind CSS, Oxlint, the App
          Router, and the <C>@/*</C> import alias by default.
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
            ['--platform <target>', 'web · windows · macos · linux · android · ios'],
            ['--app-name <name>', 'Display name for desktop / mobile apps'],
            ['--sign / --nosign', 'Code-signing setup'],
            ['--npm / --pnpm / --yarn / --bun', 'Force a specific package manager'],
            ['--install / --no-install', 'Install dependencies'],
            ['--force', 'Overwrite existing directory'],
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
          Every platform gets the full framework - routing, layouts, API routes, SSG, the overlay,
          and the rest. The <C>--platform</C> flag only decides what the build targets.
        </P>
        <Table
          headers={['Platform', 'Builds']}
          rows={[
            ['web', 'Web app'],
            ['windows · macos · linux', 'Native desktop binaries'],
            ['android · ios', 'Native mobile apps'],
          ]}
        />
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

      <Section id="setup-typescript" title="Set up TypeScript">
        <P className="">
          Bini.js now supports TypeScript 7, the native compiler, ~10× faster. Just pick{' '}
          <C>TypeScript</C> in <C>create-bini-app</C> or use the <C>--typescript</C> flag, and the
          CLI sets everything up for you.
        </P>
      </Section>

      <Section id="setup-linting" title="Set up linting">
        <P>
          Bini.js uses Oxlint for linting and Oxfmt for formatting - pre-configured and ready to
          use.
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
    </DocPage>
  )
}