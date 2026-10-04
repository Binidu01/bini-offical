// src/app/docs/platform-macos.tsx
import { siGithub } from 'simple-icons'

import {
  BrandIcon,
  C,
  Callout,
  CodeBlock,
  DocPage,
  ExtLink,
  H3,
  MultiTerminal,
  P,
  PromptOutput,
  Section,
  UL,
  type TerminalTab,
} from '../../components/DocBlocks'
import { Arrow, CARD, FeatureCard, FolderVisual, GridBg } from '../../components/DocVisuals'
import type { TocItem } from '../../components/TableOfContents'

const TOC_ITEMS: TocItem[] = [
  { id: 'macos-overview', label: 'macOS Overview' },
  { id: 'requirements', label: 'Requirements' },
  { id: 'native-macos', label: 'macOS' },
  { id: 'windows', label: 'Windows' },
  { id: 'linux', label: 'Linux' },
  { id: 'development', label: 'Development' },
  { id: 'building', label: 'Building' },
  { id: 'code-signing', label: 'Code Signing' },
]

const OL =
  'mb-6 list-decimal space-y-2 pl-5 text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400'

const STRONG = 'font-medium text-neutral-900 dark:text-neutral-100'

/* ---------- terminal tabs ---------- */

const INTERACTIVE_TABS: TerminalTab[] = [
  { id: 'npm', label: 'npm', command: `$ npx create-bini-app@latest` },
  { id: 'pnpm', label: 'pnpm', command: `$ pnpm dlx create-bini-app@latest` },
  { id: 'yarn', label: 'yarn', command: `$ yarn dlx create-bini-app@latest` },
  { id: 'bun', label: 'bun', command: `$ bunx create-bini-app@latest` },
]

const NATIVE_TABS: TerminalTab[] = [
  {
    id: 'npm',
    label: 'npm',
    command: `$ npx create-bini-app@latest my-app --platform macos
$ cd my-app
$ npm install
$ npm run tauri:dev
$ npm run tauri:build`,
  },
  {
    id: 'pnpm',
    label: 'pnpm',
    command: `$ pnpm dlx create-bini-app@latest my-app --platform macos
$ cd my-app
$ pnpm install
$ pnpm tauri:dev
$ pnpm tauri:build`,
  },
  {
    id: 'yarn',
    label: 'yarn',
    command: `$ yarn dlx create-bini-app@latest my-app --platform macos
$ cd my-app
$ yarn install
$ yarn tauri:dev
$ yarn tauri:build`,
  },
  {
    id: 'bun',
    label: 'bun',
    command: `$ bunx create-bini-app@latest my-app --platform macos
$ cd my-app
$ bun install
$ bun run tauri:dev
$ bun run tauri:build`,
  },
]

const CREATE_AND_INSTALL_TABS: TerminalTab[] = [
  {
    id: 'npm',
    label: 'npm',
    command: `$ npx create-bini-app@latest my-app --platform macos
$ cd my-app
$ npm install`,
  },
  {
    id: 'pnpm',
    label: 'pnpm',
    command: `$ pnpm dlx create-bini-app@latest my-app --platform macos
$ cd my-app
$ pnpm install`,
  },
  {
    id: 'yarn',
    label: 'yarn',
    command: `$ yarn dlx create-bini-app@latest my-app --platform macos
$ cd my-app
$ yarn install`,
  },
  {
    id: 'bun',
    label: 'bun',
    command: `$ bunx create-bini-app@latest my-app --platform macos
$ cd my-app
$ bun install`,
  },
]

const DEPLOY_TABS: TerminalTab[] = [
  { id: 'npm', label: 'npm', command: `$ npm run deploy` },
  { id: 'pnpm', label: 'pnpm', command: `$ pnpm deploy` },
  { id: 'yarn', label: 'yarn', command: `$ yarn deploy` },
  { id: 'bun', label: 'bun', command: `$ bun run deploy` },
]

const DEV_TABS: TerminalTab[] = [
  { id: 'npm', label: 'npm', command: `$ npm run tauri:dev` },
  { id: 'pnpm', label: 'pnpm', command: `$ pnpm tauri:dev` },
  { id: 'yarn', label: 'yarn', command: `$ yarn tauri:dev` },
  { id: 'bun', label: 'bun', command: `$ bun run tauri:dev` },
]

const BUILD_TABS: TerminalTab[] = [
  { id: 'npm', label: 'npm', command: `$ npm run tauri:build` },
  { id: 'pnpm', label: 'pnpm', command: `$ pnpm tauri:build` },
  { id: 'yarn', label: 'yarn', command: `$ yarn tauri:build` },
  { id: 'bun', label: 'bun', command: `$ bun run tauri:build` },
]

/* ---------- workflow files ---------- */

const TAURI_ACTION_WORKFLOW = `# .github/workflows/build-macos.yml
name: Build macOS App

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  build-macos:
    runs-on: macos-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install Rust
        uses: dtolnay/rust-toolchain@stable
        with:
          targets: aarch64-apple-darwin,x86_64-apple-darwin

      - name: Install dependencies
        run: npm install

      - name: Build Tauri app
        uses: tauri-apps/tauri-action@v0
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
        with:
          tagName: app-v__VERSION__
          releaseName: 'App v__VERSION__'
          releaseDraft: true`

const SIGNED_WORKFLOW = `# .github/workflows/build-macos.yml
name: Build macOS App

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  build-macos:
    runs-on: macos-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install Rust
        uses: dtolnay/rust-toolchain@stable
        with:
          targets: aarch64-apple-darwin,x86_64-apple-darwin

      - name: Install dependencies
        run: npm install

      - name: Build Tauri app
        uses: tauri-apps/tauri-action@v0
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
          APPLE_ID: \${{ secrets.APPLE_ID }}
          APPLE_PASSWORD: \${{ secrets.APPLE_PASSWORD }}
          APPLE_TEAM_ID: \${{ secrets.APPLE_TEAM_ID }}
        with:
          tagName: app-v__VERSION__
          releaseName: 'App v__VERSION__'
          releaseDraft: true`

/* ---------- visuals ---------- */

const BOX = `${CARD} flex h-12 shrink-0 items-center justify-center px-3 text-center text-[12px] leading-tight text-neutral-800 dark:text-neutral-200`

/** How a macOS build is produced from Windows or Linux. */
function CrossBuildFlowVisual({ os }: { os: string }) {
  return (
    <GridBg>
      <div className="flex items-center gap-3">
        <span className={`${BOX} w-28`}>Your {os} machine</span>
        <Arrow />
        <span className={`${BOX} w-24`}>npm run deploy</span>
        <Arrow />
        <span className={`${BOX} w-40`}>GitHub Actions (macos-latest)</span>
        <Arrow />
        <span className={`${BOX} w-32`}>macos-build artifact</span>
      </div>
    </GridBg>
  )
}

/* ---------- shared "create project" block ---------- */

function ScaffoldBlock() {
  return (
    <>
      <H3 className="mt-6 mb-3">Create the Project</H3>
      <P className="mb-4">
        Create a new Bini.js project targeting macOS and install its dependencies:
      </P>
      <MultiTerminal tabs={CREATE_AND_INSTALL_TABS} />
      <P className="mb-4">
        Or use the interactive prompt and select <C>macOS Desktop</C>:
      </P>
      <MultiTerminal tabs={INTERACTIVE_TABS} />
      <PromptOutput
        lines={[
          { kind: 'question', text: 'Select target platform:' },
          { kind: 'option', text: 'Web Application' },
          { kind: 'option', text: 'Windows Desktop' },
          { kind: 'option', text: 'Linux Desktop' },
          { kind: 'option', text: 'macOS Desktop', selected: true },
          { kind: 'option', text: 'Android' },
          { kind: 'option', text: 'iOS' },
          { kind: 'blank' },
          { kind: 'hint', text: '↑↓ navigate • ⏎ select' },
        ]}
      />
    </>
  )
}

/* ---------- shared CI workflow block (Windows / Linux) ---------- */

function WorkflowBlock() {
  return (
    <>
      <H3 className="mt-6 mb-3">Add the Build Workflow</H3>
      <P className="mb-4">
        The scaffold does not ship with a GitHub Actions workflow. You need to add one manually.
        Create the file <C>.github/workflows/build-macos.yml</C> inside your project with the
        following content:
      </P>
      <FolderVisual
        width={300}
        rows={[
          { n: '.github' },
          { n: 'workflows', d: 1 },
          { n: 'build-macos.yml', d: 2, dot: true },
          { n: 'src-tauri' },
          { n: 'package.json' },
        ]}
      />
      <CodeBlock
        filename=".github/workflows/build-macos.yml"
        lang="yaml"
        code={TAURI_ACTION_WORKFLOW}
      />

      <H3 className="mt-6 mb-3">Push to GitHub</H3>
      <P className="mb-4">
        Run <C>npm run deploy</C> and choose <C>macOS</C>. This initializes the repo, commits, and
        pushes everything to GitHub in one step:
      </P>
      <MultiTerminal tabs={DEPLOY_TABS} />
      <P className="mb-4">
        Once pushed, the workflow runs on a real macOS runner and builds the app bundle.
      </P>

      <H3 className="mt-6 mb-3">Download the App</H3>
      <DownloadSteps />
    </>
  )
}

/* ---------- macOS section ---------- */

function MacosSection() {
  return (
    <Section id="native-macos" title="macOS">
      <P className="mb-4">
        On macOS you can scaffold, develop, and build the app entirely on your own machine - no CI
        required.
      </P>

      <H3 className="mt-6 mb-3">Step 1: Install the tools</H3>
      <UL>
        <li>
          Node.js{' '}
          <strong className="font-medium text-neutral-900 dark:text-neutral-100">20.19.0</strong>{' '}
          or higher
        </li>
        <li>
          Xcode Command Line Tools - run <C>xcode-select --install</C>
        </li>
        <li>
          Full Xcode (for building and notarization) -{' '}
          <ExtLink href="https://apps.apple.com/app/xcode/id497799835">Download</ExtLink>
        </li>
        <li>
          Rust via <ExtLink href="https://rustup.rs/">rustup</ExtLink>
        </li>
      </UL>

      <H3 className="mt-6 mb-3">Step 2: Create the project</H3>
      <ScaffoldBlock />

      <H3 className="mt-6 mb-3">Step 3: Develop and build</H3>
      <P className="mb-4">
        Run <C>tauri:dev</C> to open your app in a native window, then <C>tauri:build</C> to
        produce the app bundle:
      </P>
      <MultiTerminal tabs={NATIVE_TABS} />

      <Callout>
        <strong>Tip:</strong> Use <C>--sign</C> during scaffold to set up Developer ID signing.
      </Callout>
    </Section>
  )
}

/* ---------- Windows section ---------- */

function WindowsSection() {
  return (
    <Section id="windows" title="Windows">
      <P className="mb-4">
        A native macOS <C>.app</C> cannot be produced on Windows - Tauri relies on macOS-only
        toolchains (Xcode, code signing, notarization). The Tauri team's own recommendation is to
        build macOS apps on a <C>macos-latest</C> runner in CI.
      </P>
      <CrossBuildFlowVisual os="Windows" />

      <H3 className="mt-6 mb-3">Step 1: Install the tools</H3>
      <P className="mb-4">
        Install Node.js <C>20.19.0</C> or higher and Git for Windows -{' '}
        <ExtLink href="https://git-scm.com/download/win">Download</ExtLink>.
      </P>

      <H3 className="mt-6 mb-3">Step 2: Create the project</H3>
      <ScaffoldBlock />

      <WorkflowBlock />

      <Callout>
        <strong>Why not build locally?</strong> Tauri's macOS build needs Xcode and Apple's signing
        toolchain, which do not exist on Windows. Cross-compiling from Windows to macOS is not
        supported. GitHub Actions on <C>macos-latest</C> is the supported path.
      </Callout>
    </Section>
  )
}

/* ---------- Linux section ---------- */

function LinuxSection() {
  return (
    <Section id="linux" title="Linux">
      <P className="mb-4">
        A native macOS <C>.app</C> cannot be produced on Linux - Tauri relies on macOS-only
        toolchains (Xcode, code signing, notarization). The Tauri team's own recommendation is to
        build macOS apps on a <C>macos-latest</C> runner in CI.
      </P>
      <CrossBuildFlowVisual os="Linux" />

      <H3 className="mt-6 mb-3">Step 1: Install the tools</H3>
      <P className="mb-4">
        Install Node.js <C>20.19.0</C> or higher and Git with your package manager, for example{' '}
        <C>sudo apt install git</C> on Debian and Ubuntu.
      </P>

      <H3 className="mt-6 mb-3">Step 2: Create the project</H3>
      <ScaffoldBlock />

      <WorkflowBlock />

      <Callout>
        <strong>Why not build locally?</strong> Tauri's macOS build needs Xcode and Apple's signing
        toolchain, which do not exist on Linux. Cross-compiling from Linux to macOS is not
        supported. GitHub Actions on <C>macos-latest</C> is the supported path.
      </Callout>
    </Section>
  )
}

/* ---------- shared download steps ---------- */

function DownloadSteps() {
  return (
    <ol className={OL}>
      <li>
        Open your repository on GitHub and go to the <strong className={STRONG}>Actions</strong>{' '}
        tab.
      </li>
      <li>
        Open the latest <C>Build macOS App</C> run.
      </li>
      <li>
        Under <strong className={STRONG}>Artifacts</strong>, download <C>macos-build</C>. Or, if a
        release was created, download the <C>.dmg</C> from the Releases page.
      </li>
    </ol>
  )
}

/* ---------- content ---------- */

function Content() {
  return (
    <>
      <Section id="macos-overview" title="macOS Overview">
        <P className="mb-4">
          Bini.js allows you to build native macOS desktop applications using Tauri v2. Your React
          app is wrapped in a WKWebView binary, providing a native experience with full system
          access.
        </P>
        <div className="grid gap-3 sm:grid-cols-3">
          <FeatureCard
            title="Native Binary"
            text="macOS app bundle (.app) with Developer ID signing"
          />
          <FeatureCard title="Code Signing" text="Developer ID and notarization support" />
          <FeatureCard title="Native APIs" text="Full access to macOS APIs via Tauri" />
        </div>
        <Callout>
          macOS desktop apps are built using Tauri's WKWebView backend. Your app runs in a native
          window with full system access.
        </Callout>
      </Section>

      <Section id="requirements" title="Requirements">
        <P className="mb-4">
          Building macOS desktop apps requires different tools depending on your operating system.
          See the section for your OS below.
        </P>
        <UL>
          <li>
            <strong className={STRONG}>On macOS:</strong> Node.js, Xcode Command Line Tools, Full
            Xcode, and Rust - everything runs locally.
          </li>
          <li>
            <strong className={STRONG}>On Windows or Linux:</strong> Node.js, Git, a GitHub account,
            and the ability to push a repo. The macOS build itself runs on GitHub Actions.
          </li>
        </UL>
        <Callout>
          You cannot produce a native macOS <C>.app</C> directly from Windows or Linux. Tauri v2
          has no supported local cross-compilation path for macOS. The recommended way is GitHub
          Actions on a <C>macos-latest</C> runner, described in each section below.
        </Callout>
      </Section>

      <MacosSection />
      <WindowsSection />
      <LinuxSection />

      <Section id="development" title="Development">
        <P className="mb-4">
          Running <C>tauri:dev</C> opens your app in a native macOS window. This requires a Mac
          with the requirements installed (see the macOS section):
        </P>
        <MultiTerminal tabs={DEV_TABS} />
        <P className="mb-4">This launches your app in a native macOS window with:</P>
        <UL>
          <li>Hot reload for frontend changes</li>
          <li>Native window with menu bar integration</li>
          <li>Access to macOS APIs</li>
          <li>Devtools for debugging</li>
        </UL>
      </Section>

      <Section id="building" title="Building">
        <P className="mb-4">
          Build a distributable macOS application. On macOS this runs locally; on Windows and Linux
          it runs in GitHub Actions (see those sections):
        </P>
        <MultiTerminal tabs={BUILD_TABS} />
        <P className="mb-4">
          The build outputs land in <C>src-tauri/target/release/bundle/</C>:
        </P>
        <H3 className="mt-6 mb-3">Output Files</H3>
        <FolderVisual
          width={320}
          rows={[
            { n: 'src-tauri' },
            { n: 'target', d: 1 },
            { n: 'release', d: 2 },
            { n: 'bundle', d: 3 },
            { n: 'macos', d: 4 },
            { n: 'my-app.app', d: 5, dot: true },
            { n: 'dmg', d: 4 },
            { n: 'my-app_0.1.0_aarch64.dmg', d: 5 },
          ]}
        />
        <UL>
          <li>
            <C>macos/my-app.app</C> - The app bundle
          </li>
          <li>
            <C>dmg/*.dmg</C> - Disk image for distribution (recommended)
          </li>
          <li>
            <C>my-app.pkg</C> - Installer package (if configured)
          </li>
        </UL>
        <Callout>
          The build output is a native macOS application that runs without any additional
          dependencies.
        </Callout>
      </Section>

      <Section id="code-signing" title="Code Signing">
        <P className="mb-4">
          Bini.js supports Developer ID signing and notarization for macOS binaries. Configure
          signing in <C>src-tauri/tauri.conf.json</C>:
        </P>
        <CodeBlock
          filename="src-tauri/tauri.conf.json"
          lang="json"
          code={`{
  "bundle": {
    "macOS": {
      "signingIdentity": "Developer ID Application: Your Name (TEAM_ID)",
      "entitlements": "entitlements.plist"
    }
  }
}`}
        />
        <P className="mb-4">
          For GitHub Actions, store your Apple ID, app-specific password, and team ID as secrets
          and reference them in the workflow. The <C>tauri-action</C> step reads them from
          environment variables:
        </P>
        <H3 className="mb-3">
          <span className="flex items-center gap-2">
            <BrandIcon
              icon={siGithub}
              size={18}
              className="shrink-0 text-black dark:text-white"
            />
            GitHub Actions workflow with signing
          </span>
        </H3>
        <CodeBlock
          filename=".github/workflows/build-macos.yml"
          lang="yaml"
          code={SIGNED_WORKFLOW}
        />
        <Callout>
          For production distribution, Developer ID signing and notarization are required to avoid
          Gatekeeper warnings.
        </Callout>
      </Section>
    </>
  )
}

/* ---------- page ---------- */

export default function PlatformMacosPage() {
  return (
    <DocPage
      title="macOS"
      description="Build native macOS desktop applications with Bini.js."
      url="https://bini.js.org/docs/platform-macos"
      editUrl="https://github.com/Binidu01/bini-official/edit/main/src/app/docs/platform-macos.tsx"
      toc={TOC_ITEMS}
      prev={{ to: '/docs/platform-windows', title: 'Windows' }}
      next={{ to: '/docs/platform-linux', title: 'Linux' }}
    >
      <Content />
    </DocPage>
  )
}