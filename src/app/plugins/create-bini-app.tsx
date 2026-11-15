// src/app/plugins/create-bini-app/page.tsx
import {
  C,
  ClackPrompt,
  ClackTerminal,
  ExtLink,
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
  { id: 'quick-start', label: 'Quick Start' },
  { id: 'cli-flags', label: 'CLI flags' },
  { id: 'requirements', label: 'Requirements' },
  { id: 'project-structure', label: 'Project Structure' },
  { id: 'commands', label: 'Commands' },
  { id: 'add-remove-platforms', label: 'Add or remove platforms' },
  { id: 'code-signing', label: 'Code Signing' },
  { id: 'maintenance', label: 'Maintenance commands' },
]

const EDIT_URL =
  'https://github.com/Binidu01/bini-official/edit/main/src/app/plugins/create-bini-app/page.tsx'

/* ---- package-manager tab helpers ---------------------------------- */

const PMS = ['npm', 'pnpm', 'yarn', 'bun'] as const
type Pm = (typeof PMS)[number]

const CREATE: Record<Pm, string> = {
  npm: 'npx create-bini-app@latest',
  pnpm: 'pnpm create bini-app@latest',
  yarn: 'yarn create bini-app@latest',
  bun: 'bun create bini-app@latest',
}

const tabs = (cmd: (pm: Pm) => string): TerminalTab[] =>
  PMS.map((pm) => ({ id: pm, label: pm, command: cmd(pm) }))

export default function CreateBiniAppPage() {
  return (
    <PluginPage
      title="create-bini-app"
      badge="Official"
      description="Official scaffolder for Bini.js. Creates a production-ready project with routing, API routes, native targets, and deployment tooling configured from the first commit."
      url="https://www.npmjs.com/package/create-bini-app"
      editUrl={EDIT_URL}
      toc={TOC_ITEMS}
      prev={{ to: '/plugins', title: 'Plugins' }}
      next={{ to: '/plugins/bini-deploy', title: 'bini-deploy' }}
    >
      <Section id="overview" title="Overview">
        <P>
          <C>create-bini-app</C> is the official CLI that scaffolds a new Bini.js project. One
          command generates a complete, production-ready codebase - file-based routing, API
          routes, environment handling, native app wiring, and deployment tooling - configured
          correctly from the first commit.
        </P>
      </Section>

      <Section id="quick-start" title="Quick Start">
        <P>The fastest way to scaffold a new Bini.js project:</P>
        <MultiTerminal
          tabs={tabs((pm) => [`$ ${CREATE[pm]} my-app`, '$ cd my-app', '$ npm run dev'].join('\n'))}
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

        <P>
          When a desktop or mobile target is picked, you're also asked for the app name and the
          bundle ID organization. iOS is only offered on macOS.
        </P>
      </Section>

      <Section id="cli-flags" title="CLI flags">
        <P>Skip prompts by passing flags directly:</P>
        <Table
          headers={['Flag', 'Description']}
          rows={[
            ['--typescript / --javascript', 'Language (create)'],
            ['--tailwind / --css-modules / --none', 'Styling (create). Only one may be used'],
            ['--platform <targets>', 'web (default) · desktop · android · ios; comma-separated or repeated'],
            ['--app-name [name]', 'App name (default: project name in title case)'],
            ['--org [domain]', 'Bundle ID prefix as a reverse domain, e.g. com.acme (default com.bini)'],
            ['--sign / --nosign', 'Auto-confirm or skip code-signing setup'],
            ['--npm / --pnpm / --yarn / --bun', 'Force a package manager instead of auto-detecting'],
            ['--no-install', 'Skip installing dependencies'],
            ['--no-git', 'Skip git init (create)'],
            ['--force', 'Delete and overwrite an existing directory of the same name'],
            ['--yes, -y', 'No prompts: accept the default for every unanswered question'],
            ['--version, -v / --help, -h', 'Print version / show help'],
          ]}
        />
      </Section>

      <Section id="requirements" title="Requirements">
        <UL>
          <li>
            Minimum Node.js version:{' '}
            <ExtLink href="https://nodejs.org/">20.19.0</ExtLink>
          </li>
          <li>Operating systems: macOS, Windows, and Linux.</li>
          <li>
            For desktop builds: Windows (
            <ExtLink href="https://visualstudio.microsoft.com/visual-cpp-build-tools/">
              C++ Build Tools
            </ExtLink>
            ), macOS (<ExtLink href="https://developer.apple.com/xcode/resources/">Xcode CLT</ExtLink>
            ), Linux (
            <ExtLink href="https://webkitgtk.org/">WebKitGTK</ExtLink>
            ).
          </li>
          <li>
            For mobile builds: Android (
            <ExtLink href="https://www.oracle.com/java/technologies/downloads/#java17">JDK 17</ExtLink>
            ,{' '}
            <ExtLink href="https://developer.android.com/studio">Android Studio</ExtLink>
            ), iOS (<ExtLink href="https://developer.apple.com/xcode/">Xcode</ExtLink>,{' '}
            <ExtLink href="https://cocoapods.org/">CocoaPods</ExtLink>
            ).
          </li>
        </UL>
      </Section>

      <Section id="project-structure" title="Project Structure">
        <FolderVisual
          width={280}
          rows={[
            { n: 'my-app' },
            { n: 'src', d: 1 },
            { n: 'app', d: 2 },
            { n: 'api', d: 3 },
            { n: 'hello.ts', d: 4, fn: true },
            { n: 'layout.tsx', d: 3 },
            { n: 'page.tsx', d: 3 },
            { n: 'globals.css', d: 3 },
            { n: 'main.tsx', d: 2 },
            { n: 'public', d: 1 },
            { n: 'favicon.ico', d: 2 },
            { n: 'logo.png', d: 2 },
            { n: 'src-tauri', d: 1 },
            { n: 'index.html', d: 1 },
            { n: 'vite.config.ts', d: 1 },
            { n: 'package.json', d: 1 },
          ]}
        />
      </Section>

      <Section id="commands" title="Commands">
        <Table
          headers={['Command', 'Description']}
          rows={[
            ['create-bini-app [name]', 'Create a new project (offers to add a platform when run inside one)'],
            ['create-bini-app add [targets]', 'Add desktop and/or mobile targets to an existing project'],
            ['create-bini-app remove [targets]', 'Remove desktop and/or mobile targets from the project'],
            ['create-bini-app sign [targets]', 'Set up or redo code signing'],
            ['create-bini-app --app-name [name]', 'Change the native app name (inside a project)'],
            ['create-bini-app --org [domain]', 'Change the bundle ID prefix (inside a project)'],
            ['create-bini-app doctor', 'Check your machine for Tauri (runs tauri info)'],
            ['create-bini-app clean', 'Delete build output (Vite and Tauri), keeps node_modules'],
            ['create-bini-app upgrade', 'Update dependencies and refresh template files'],
          ]}
        />
        <P>
          <C>add</C>, <C>remove</C>, <C>sign</C>, <C>doctor</C>, <C>clean</C>, and <C>upgrade</C>{' '}
          must be run inside a project.
        </P>
      </Section>

      <Section id="add-remove-platforms" title="Add or remove platforms">
        <P>
          Use <C>add</C> to bring in desktop, Android, or iOS at any point without recreating the
          project - existing routes, styles, and configuration are never touched. Use <C>remove</C>{' '}
          to delete the generated platform folders and scripts for a target you no longer need.
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
        <P>With no target, the CLI shows a checklist of platforms that are not yet added:</P>

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
          every native script. Re-running is safe - anything already configured is skipped.
        </P>

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
          shows a checklist of platforms that are present:
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

        <H3>Rename the app or change the bundle ID</H3>
        <P>
          The native app name and bundle identifier live in <C>src-tauri/tauri.conf.json</C>. Run
          one of these from inside the project to change them:
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
            Generated Android and iOS projects keep their old values. Remove and re-add the
            platform to regenerate them, or edit them by hand.
          </li>
        </UL>
      </Section>

      <Section id="code-signing" title="Code Signing">
        <P>
          Signing is offered when you add a native target, and can be set up or redone at any time
          with <C>sign</C>. Bring real credentials - self-signed certificates are not supported.
        </P>
        <MultiTerminal
          tabs={[
            {
              id: 'prompt',
              label: 'Interactive',
              command: `$ ${CREATE.npm} sign\n$ ${CREATE.npm} sign android`,
            },
            {
              id: 'windows',
              label: 'Windows',
              command: `$ ${CREATE.npm} sign desktop ./cert.pfx "pw"\n$ ${CREATE.npm} sign desktop --thumbprint <sha1>`,
            },
            {
              id: 'macos',
              label: 'macOS',
              command: `$ ${CREATE.npm} sign desktop ./dev-id.p12 "pw" --identity "Developer ID Application: Name (TEAMID)"`,
            },
            {
              id: 'mobile',
              label: 'Mobile',
              command: `$ ${CREATE.npm} sign android ./keystore.jks "pw" --alias upload\n$ ${CREATE.npm} sign ios ./dist.p12 "pw" --profile ./app.mobileprovision --team ABCDE12345`,
            },
          ]}
        />
        <P>
          Values for GitHub Actions are saved to <C>.env.signing</C> and uploaded as secrets by{' '}
          <C>npm run deploy</C>. Local builds sign from your keychain, certificate store, and the
          git-ignored <C>tauri.*.conf.json</C> files. Add <C>--ci-only</C> to save only the CI
          values.
        </P>
      </Section>

      <Section id="maintenance" title="Maintenance commands">
        <H3>doctor</H3>
        <MultiTerminal tabs={tabs((pm) => `$ ${CREATE[pm]} doctor`)} />
        <P>
          Runs <C>tauri info</C> to check Rust, the platform toolchains, and versions.
        </P>

        <H3>clean</H3>
        <MultiTerminal tabs={tabs((pm) => `$ ${CREATE[pm]} clean`)} />
        <P>
          Deletes <C>dist/</C>, the generated native build folders, and the Rust build cache.{' '}
          <C>node_modules</C> is kept.
        </P>

        <H3>upgrade</H3>
        <MultiTerminal tabs={tabs((pm) => `$ ${CREATE[pm]} upgrade`)} />
        <P>
          Updates dependencies and refreshes template files. <C>src/</C>, <C>package.json</C>, and{' '}
          <C>vite.config.*</C> are never overwritten.
        </P>
      </Section>
    </PluginPage>
  )
}