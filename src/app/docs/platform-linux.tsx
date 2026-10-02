// src/app/docs/platform-linux.tsx
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
  { id: 'linux-overview', label: 'Linux Overview' },
  { id: 'requirements', label: 'Requirements' },
  { id: 'native-linux', label: 'Linux' },
  { id: 'windows', label: 'Windows' },
  { id: 'macos', label: 'macOS' },
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
    command: `$ npx create-bini-app@latest my-app --platform linux
$ cd my-app
$ npm install
$ npm run tauri:dev
$ npm run tauri:build`,
  },
  {
    id: 'pnpm',
    label: 'pnpm',
    command: `$ pnpm dlx create-bini-app@latest my-app --platform linux
$ cd my-app
$ pnpm install
$ pnpm tauri:dev
$ pnpm tauri:build`,
  },
  {
    id: 'yarn',
    label: 'yarn',
    command: `$ yarn dlx create-bini-app@latest my-app --platform linux
$ cd my-app
$ yarn install
$ yarn tauri:dev
$ yarn tauri:build`,
  },
  {
    id: 'bun',
    label: 'bun',
    command: `$ bunx create-bini-app@latest my-app --platform linux
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
    command: `$ npx create-bini-app@latest my-app --platform linux
$ cd my-app
$ npm install`,
  },
  {
    id: 'pnpm',
    label: 'pnpm',
    command: `$ pnpm dlx create-bini-app@latest my-app --platform linux
$ cd my-app
$ pnpm install`,
  },
  {
    id: 'yarn',
    label: 'yarn',
    command: `$ yarn dlx create-bini-app@latest my-app --platform linux
$ cd my-app
$ yarn install`,
  },
  {
    id: 'bun',
    label: 'bun',
    command: `$ bunx create-bini-app@latest my-app --platform linux
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

const DEPS_TABS: TerminalTab[] = [
  {
    id: 'debian',
    label: 'Debian/Ubuntu',
    command: `$ sudo apt update
$ sudo apt install -y libwebkit2gtk-4.1-dev build-essential curl wget file libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev`,
  },
  {
    id: 'fedora',
    label: 'Fedora',
    command: `$ sudo dnf install webkit2gtk4.1-devel openssl-devel curl wget file libappindicator-gtk3-devel librsvg2-devel`,
  },
  {
    id: 'arch',
    label: 'Arch',
    command: `$ sudo pacman -S webkit2gtk-4.1 base-devel curl wget file openssl appmenu-gtk-module libappindicator-gtk3 librsvg`,
  },
]

/* ---------- workflow files ---------- */

const TAURI_ACTION_WORKFLOW = `# .github/workflows/build-linux.yml
name: Build Linux App

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  build-linux:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Install system dependencies
        run: |
          sudo apt update
          sudo apt install -y libwebkit2gtk-4.1-dev build-essential curl wget file libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install Rust
        uses: dtolnay/rust-toolchain@stable

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

const SIGNED_WORKFLOW = `# .github/workflows/build-linux.yml
name: Build Linux App

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  build-linux:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Install system dependencies
        run: |
          sudo apt update
          sudo apt install -y libwebkit2gtk-4.1-dev build-essential curl wget file libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install Rust
        uses: dtolnay/rust-toolchain@stable

      - name: Install dependencies
        run: npm install

      - name: Build Tauri app
        uses: tauri-apps/tauri-action@v0
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
          TAURI_SIGNING_PRIVATE_KEY: \${{ secrets.TAURI_SIGNING_PRIVATE_KEY }}
          TAURI_SIGNING_PRIVATE_KEY_PASSWORD: \${{ secrets.TAURI_SIGNING_PRIVATE_KEY_PASSWORD }}
        with:
          tagName: app-v__VERSION__
          releaseName: 'App v__VERSION__'
          releaseDraft: true`

/* ---------- visuals ---------- */

const BOX = `${CARD} flex h-12 shrink-0 items-center justify-center px-3 text-center text-[12px] leading-tight text-neutral-800 dark:text-neutral-200`

/** How a Linux build is produced from Windows or macOS. */
function CrossBuildFlowVisual({ os }: { os: string }) {
  return (
    <GridBg>
      <div className="flex items-center gap-3">
        <span className={`${BOX} w-28`}>Your {os} machine</span>
        <Arrow />
        <span className={`${BOX} w-24`}>npm run deploy</span>
        <Arrow />
        <span className={`${BOX} w-40`}>GitHub Actions (ubuntu-latest)</span>
        <Arrow />
        <span className={`${BOX} w-32`}>linux-build artifact</span>
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
        Create a new Bini.js project targeting Linux and install its dependencies:
      </P>
      <MultiTerminal tabs={CREATE_AND_INSTALL_TABS} />
      <P className="mb-4">
        Or use the interactive prompt and select <C>Linux Desktop</C>:
      </P>
      <MultiTerminal tabs={INTERACTIVE_TABS} />
      <PromptOutput
        lines={[
          { kind: 'question', text: 'Select target platform:' },
          { kind: 'option', text: 'Web Application' },
          { kind: 'option', text: 'Windows Desktop' },
          { kind: 'option', text: 'Linux Desktop', selected: true },
          { kind: 'option', text: 'macOS Desktop' },
          { kind: 'option', text: 'Android' },
          { kind: 'option', text: 'iOS' },
          { kind: 'blank' },
          { kind: 'hint', text: '↑↓ navigate • ⏎ select' },
        ]}
      />
    </>
  )
}

/* ---------- shared CI workflow block (Windows / macOS) ---------- */

function WorkflowBlock() {
  return (
    <>
      <H3 className="mt-6 mb-3">Add the Build Workflow</H3>
      <P className="mb-4">
        The scaffold does not ship with a GitHub Actions workflow. You need to add one manually.
        Create the file <C>.github/workflows/build-linux.yml</C> inside your project with the
        following content:
      </P>
      <FolderVisual
        width={300}
        rows={[
          { n: '.github' },
          { n: 'workflows', d: 1 },
          { n: 'build-linux.yml', d: 2, dot: true },
          { n: 'src-tauri' },
          { n: 'package.json' },
        ]}
      />
      <CodeBlock
        filename=".github/workflows/build-linux.yml"
        lang="yaml"
        code={TAURI_ACTION_WORKFLOW}
      />

      <H3 className="mt-6 mb-3">Push to GitHub</H3>
      <P className="mb-4">
        Run <C>npm run deploy</C> and choose <C>Linux</C>. This initializes the repo, commits, and
        pushes everything to GitHub in one step:
      </P>
      <MultiTerminal tabs={DEPLOY_TABS} />
      <P className="mb-4">
        Once pushed, the workflow runs on a real Ubuntu runner and builds the AppImage.
      </P>

      <H3 className="mt-6 mb-3">Download the App</H3>
      <DownloadSteps />
    </>
  )
}

/* ---------- Linux section ---------- */

function LinuxSection() {
  return (
    <Section id="native-linux" title="Linux">
      <P className="mb-4">
        On Linux you can scaffold, develop, and build the app entirely on your own machine - no CI
        required.
      </P>

      <H3 className="mt-6 mb-3">Step 1: Install the tools</H3>
      <P className="mb-4">
        Install Node.js <C>20.19.0</C> or higher, Rust via{' '}
        <ExtLink href="https://rustup.rs/">rustup</ExtLink>, and the WebKitGTK development
        libraries. Pick your distribution:
      </P>
      <MultiTerminal tabs={DEPS_TABS} />

      <H3 className="mt-6 mb-3">Step 2: Create the project</H3>
      <ScaffoldBlock />

      <H3 className="mt-6 mb-3">Step 3: Develop and build</H3>
      <P className="mb-4">
        Run <C>tauri:dev</C> to open your app in a native window, then <C>tauri:build</C> to
        produce the AppImage:
      </P>
      <MultiTerminal tabs={NATIVE_TABS} />

      <Callout>
        <strong>Tip:</strong> Use <C>--sign</C> during scaffold to set up signing keys.
      </Callout>
    </Section>
  )
}

/* ---------- Windows section ---------- */

function WindowsSection() {
  return (
    <Section id="windows" title="Windows">
      <P className="mb-4">
        A native Linux <C>.AppImage</C> can be produced on Windows, but only through CI - Tauri
        relies on Linux-only toolchains (WebKitGTK, GTK 3, AppImage tooling). The Tauri team's own
        recommendation is to build Linux apps on an <C>ubuntu-latest</C> runner in CI.
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
        <strong>Why not build locally?</strong> Tauri's Linux build needs WebKitGTK, GTK 3, and
        AppImage tooling, which do not exist on Windows. Cross-compiling from Windows to Linux is
        not supported. GitHub Actions on <C>ubuntu-latest</C> is the supported path.
      </Callout>
    </Section>
  )
}

/* ---------- macOS section ---------- */

function MacosSection() {
  return (
    <Section id="macos" title="macOS">
      <P className="mb-4">
        A native Linux <C>.AppImage</C> cannot be produced on macOS - Tauri relies on Linux-only
        toolchains (WebKitGTK, GTK 3, AppImage tooling). The Tauri team's own recommendation is to
        build Linux apps on an <C>ubuntu-latest</C> runner in CI.
      </P>
      <CrossBuildFlowVisual os="macOS" />

      <H3 className="mt-6 mb-3">Step 1: Install the tools</H3>
      <P className="mb-4">
        Install Node.js <C>20.19.0</C> or higher and Git. Git comes with the Xcode command line
        tools - run <C>xcode-select --install</C> if you do not have it yet.
      </P>

      <H3 className="mt-6 mb-3">Step 2: Create the project</H3>
      <ScaffoldBlock />

      <WorkflowBlock />

      <Callout>
        <strong>Why not build locally?</strong> Tauri's Linux build needs WebKitGTK, GTK 3, and
        AppImage tooling, which do not exist on macOS. Cross-compiling from macOS to Linux is
        experimental and unreliable. GitHub Actions on <C>ubuntu-latest</C> is the supported path.
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
        Open the latest <C>Build Linux App</C> run.
      </li>
      <li>
        Under <strong className={STRONG}>Artifacts</strong>, download <C>linux-build</C>. Or, if a
        release was created, download the <C>.AppImage</C> from the Releases page.
      </li>
    </ol>
  )
}

/* ---------- content ---------- */

function Content() {
  return (
    <>
      <Section id="linux-overview" title="Linux Overview">
        <P className="mb-4">
          Bini.js allows you to build native Linux desktop applications using Tauri v2. Your React
          app is wrapped in a WebKitGTK binary, providing a native experience with full system
          access.
        </P>
        <div className="grid gap-3 sm:grid-cols-3">
          <FeatureCard
            title="Native Binary"
            text="Linux AppImage with optional signing"
          />
          <FeatureCard
            title="Package Formats"
            text="AppImage, .deb, and .rpm bundle support"
          />
          <FeatureCard title="Native APIs" text="Full access to Linux APIs via Tauri" />
        </div>
        <Callout>
          Linux desktop apps are built using Tauri's WebKitGTK backend. Your app runs in a native
          window with full system access.
        </Callout>
      </Section>

      <Section id="requirements" title="Requirements">
        <P className="mb-4">
          Building Linux desktop apps requires different tools depending on your operating system.
          See the section for your OS below.
        </P>
        <UL>
          <li>
            <strong className={STRONG}>On Linux:</strong> Node.js, Rust, and the WebKitGTK / GTK 3
            development libraries from your package manager - everything runs locally.
          </li>
          <li>
            <strong className={STRONG}>On Windows or macOS:</strong> Node.js, Git, a GitHub account,
            and the ability to push a repo. The Linux build itself runs on GitHub Actions.
          </li>
        </UL>
        <Callout>
          You cannot produce a native Linux <C>.AppImage</C> directly from Windows or macOS. Tauri
          v2 has no supported local cross-compilation path for Linux. The recommended way is GitHub
          Actions on an <C>ubuntu-latest</C> runner, described in each section below.
        </Callout>
      </Section>

      <LinuxSection />
      <WindowsSection />
      <MacosSection />

      <Section id="development" title="Development">
        <P className="mb-4">
          Running <C>tauri:dev</C> opens your app in a native Linux window. This requires a Linux
          machine with the requirements installed (see the Linux section):
        </P>
        <MultiTerminal tabs={DEV_TABS} />
        <P className="mb-4">This launches your app in a native Linux window with:</P>
        <UL>
          <li>Hot reload for frontend changes</li>
          <li>Native window with system tray support</li>
          <li>Access to Linux APIs</li>
          <li>Devtools for debugging</li>
        </UL>
      </Section>

      <Section id="building" title="Building">
        <P className="mb-4">
          Build a distributable Linux application. On Linux this runs locally; on Windows and macOS
          it runs in GitHub Actions (see those sections):
        </P>
        <MultiTerminal tabs={BUILD_TABS} />
        <P className="mb-4">
          The build outputs land in <C>src-tauri/target/release/bundle/</C>:
        </P>
        <H3 className="mt-6 mb-3">Output Files</H3>
        <FolderVisual
          width={340}
          rows={[
            { n: 'src-tauri' },
            { n: 'target', d: 1 },
            { n: 'release', d: 2 },
            { n: 'bundle', d: 3 },
            { n: 'appimage', d: 4 },
            { n: 'my-app_0.1.0_amd64.AppImage', d: 5, dot: true },
            { n: 'deb', d: 4 },
            { n: 'my-app_0.1.0_amd64.deb', d: 5 },
            { n: 'rpm', d: 4 },
            { n: 'my-app-0.1.0-1.x86_64.rpm', d: 5 },
          ]}
        />
        <UL>
          <li>
            <C>appimage/*.AppImage</C> - Portable executable (recommended for distribution)
          </li>
          <li>
            <C>deb/*.deb</C> - Debian/Ubuntu package
          </li>
          <li>
            <C>rpm/*.rpm</C> - Fedora/RHEL package
          </li>
        </UL>
        <Callout>
          The build output is a native Linux binary that runs without any additional dependencies.
        </Callout>
      </Section>

      <Section id="code-signing" title="Code Signing">
        <P className="mb-4">
          Bini.js supports signed AppImage and binary distribution via the Tauri updater signing
          key. Generate a signing key with the Tauri CLI:
        </P>
        <CodeBlock
          filename="Terminal"
          lang="shell"
          code={`$ npm run tauri signer generate -- -w ~/.tauri/my-app.key`}
        />
        <P className="mb-4">
          Store the private key contents and its password as GitHub secrets, and reference them in
          the workflow. The <C>tauri-action</C> step reads them from environment variables:
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
          filename=".github/workflows/build-linux.yml"
          lang="yaml"
          code={SIGNED_WORKFLOW}
        />
        <Callout>
          For production distribution, sign your AppImage and publish a checksum alongside it so
          users can verify integrity.
        </Callout>
      </Section>
    </>
  )
}

/* ---------- page ---------- */

export default function PlatformLinuxPage() {
  return (
    <DocPage
      title="Linux"
      description="Build native Linux desktop applications with Bini.js."
      url="https://bini.js.org/docs/platform-linux"
      editUrl="https://github.com/Binidu01/bini-official/edit/main/src/app/docs/platform-linux.tsx"
      toc={TOC_ITEMS}
      prev={{ to: '/docs/platform-macos', title: 'macOS' }}
      next={{ to: '/docs/platform-android', title: 'Android' }}
    >
      <Content />
    </DocPage>
  )
}