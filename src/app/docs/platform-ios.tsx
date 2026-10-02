// src/app/docs/platform-ios.tsx
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
  { id: 'ios-overview', label: 'iOS Overview' },
  { id: 'requirements', label: 'Requirements' },
  { id: 'macos', label: 'macOS' },
  { id: 'windows', label: 'Windows' },
  { id: 'linux', label: 'Linux' },
  { id: 'development', label: 'Development' },
  { id: 'building', label: 'Building' },
  { id: 'code-signing', label: 'Code Signing' },
  { id: 'deployment', label: 'Deployment' },
]

const OL =
  'mb-6 list-decimal space-y-2 pl-5 text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400'

const STRONG = 'font-medium text-neutral-900 dark:text-neutral-100'

const XCODE_URL = 'https://apps.apple.com/app/xcode/id497799835'

/* ---------- terminal tabs ---------- */

const INTERACTIVE_TABS: TerminalTab[] = [
  { id: 'npm', label: 'npm', command: `$ npx create-bini-app@latest` },
  { id: 'pnpm', label: 'pnpm', command: `$ pnpm dlx create-bini-app@latest` },
  { id: 'yarn', label: 'yarn', command: `$ yarn dlx create-bini-app@latest` },
  { id: 'bun', label: 'bun', command: `$ bunx create-bini-app@latest` },
]

const CREATE_AND_INSTALL_TABS: TerminalTab[] = [
  {
    id: 'npm',
    label: 'npm',
    command: `$ npx create-bini-app@latest my-app --platform ios
$ cd my-app
$ npm install
$ pod install --project-directory=src-tauri/gen/ios`,
  },
  {
    id: 'pnpm',
    label: 'pnpm',
    command: `$ pnpm dlx create-bini-app@latest my-app --platform ios
$ cd my-app
$ pnpm install
$ pod install --project-directory=src-tauri/gen/ios`,
  },
  {
    id: 'yarn',
    label: 'yarn',
    command: `$ yarn dlx create-bini-app@latest my-app --platform ios
$ cd my-app
$ yarn install
$ pod install --project-directory=src-tauri/gen/ios`,
  },
  {
    id: 'bun',
    label: 'bun',
    command: `$ bunx create-bini-app@latest my-app --platform ios
$ cd my-app
$ bun install
$ pod install --project-directory=src-tauri/gen/ios`,
  },
]

const DEV_TABS: TerminalTab[] = [
  { id: 'npm', label: 'npm', command: `$ npm run ios` },
  { id: 'pnpm', label: 'pnpm', command: `$ pnpm ios` },
  { id: 'yarn', label: 'yarn', command: `$ yarn ios` },
  { id: 'bun', label: 'bun', command: `$ bun run ios` },
]

const BUILD_TABS: TerminalTab[] = [
  { id: 'npm', label: 'npm', command: `$ npm run ios:build` },
  { id: 'pnpm', label: 'pnpm', command: `$ pnpm ios:build` },
  { id: 'yarn', label: 'yarn', command: `$ yarn ios:build` },
  { id: 'bun', label: 'bun', command: `$ bun run ios:build` },
]

const DEPLOY_TABS: TerminalTab[] = [
  { id: 'npm', label: 'npm', command: `$ npm run deploy` },
  { id: 'pnpm', label: 'pnpm', command: `$ pnpm deploy` },
  { id: 'yarn', label: 'yarn', command: `$ yarn deploy` },
  { id: 'bun', label: 'bun', command: `$ bun run deploy` },
]

const RUST_TARGET_TABS: TerminalTab[] = [
  {
    id: 'rustup',
    label: 'rustup',
    command: `$ rustup target add aarch64-apple-ios
$ rustup target add x86_64-apple-ios
$ rustup target add aarch64-apple-ios-sim`,
  },
]

/* ---------- workflow files ---------- */

const TAURI_ACTION_WORKFLOW = `# .github/workflows/build-ios.yml
name: Build iOS App

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  build-ios:
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
          targets: aarch64-apple-ios,x86_64-apple-ios,aarch64-apple-ios-sim

      - name: Install CocoaPods
        run: sudo gem install cocoapods

      - name: Install dependencies
        run: npm install

      - name: Install pods
        run: pod install --project-directory=src-tauri/gen/ios

      - name: Build Tauri app
        uses: tauri-apps/tauri-action@v0
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
        with:
          tagName: app-v__VERSION__
          releaseName: 'App v__VERSION__'
          releaseDraft: true`

const SIGNED_WORKFLOW = `# .github/workflows/build-ios.yml
name: Build iOS App

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  build-ios:
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
          targets: aarch64-apple-ios,x86_64-apple-ios,aarch64-apple-ios-sim

      - name: Install CocoaPods
        run: sudo gem install cocoapods

      - name: Install dependencies
        run: npm install

      - name: Install pods
        run: pod install --project-directory=src-tauri/gen/ios

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

/** How an iOS build is produced from Windows or Linux. */
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
        <span className={`${BOX} w-32`}>ios-build artifact</span>
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
        Create a new Bini.js project targeting iOS, install its dependencies, and install its pods:
      </P>
      <MultiTerminal tabs={CREATE_AND_INSTALL_TABS} />
      <P className="mb-4">
        Or use the interactive prompt and select <C>iOS</C>:
      </P>
      <MultiTerminal tabs={INTERACTIVE_TABS} />
      <PromptOutput
        lines={[
          { kind: 'question', text: 'Select target platform:' },
          { kind: 'option', text: 'Web Application' },
          { kind: 'option', text: 'Windows Desktop' },
          { kind: 'option', text: 'Linux Desktop' },
          { kind: 'option', text: 'macOS Desktop' },
          { kind: 'option', text: 'Android' },
          { kind: 'option', text: 'iOS', selected: true },
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
        Create the file <C>.github/workflows/build-ios.yml</C> inside your project with the
        following content:
      </P>
      <FolderVisual
        width={300}
        rows={[
          { n: '.github' },
          { n: 'workflows', d: 1 },
          { n: 'build-ios.yml', d: 2, dot: true },
          { n: 'src-tauri' },
          { n: 'package.json' },
        ]}
      />
      <CodeBlock
        filename=".github/workflows/build-ios.yml"
        lang="yaml"
        code={TAURI_ACTION_WORKFLOW}
      />

      <H3 className="mt-6 mb-3">Push to GitHub</H3>
      <P className="mb-4">
        Run <C>npm run deploy</C> and choose <C>iOS</C>. This initializes the repo, commits, and
        pushes everything to GitHub in one step:
      </P>
      <MultiTerminal tabs={DEPLOY_TABS} />
      <P className="mb-4">
        Once pushed, the workflow runs on a real macOS runner and builds the iOS app bundle.
      </P>

      <H3 className="mt-6 mb-3">Download the App</H3>
      <DownloadSteps />
    </>
  )
}

/* ---------- macOS section ---------- */

function MacosSection() {
  return (
    <Section id="macos" title="macOS">
      <P className="mb-4">
        On macOS you can scaffold, develop, and build the iOS app entirely on your own machine -
        no CI required.
      </P>

      <H3 className="mt-6 mb-3">Step 1: Install the tools</H3>
      <UL>
        <li>macOS 11 (Big Sur) or higher</li>
        <li>
          Node.js <C>20.19.0</C> or higher
        </li>
        <li>
          Xcode - <ExtLink href={XCODE_URL}>Download from the Mac App Store</ExtLink>
        </li>
        <li>
          Xcode Command Line Tools - run <C>xcode-select --install</C>
        </li>
        <li>
          CocoaPods - run <C>sudo gem install cocoapods</C>
        </li>
        <li>
          Rust via <ExtLink href="https://rustup.rs/">rustup</ExtLink>, then add the iOS targets
          (see Requirements)
        </li>
      </UL>

      <H3 className="mt-6 mb-3">Step 2: Create the project</H3>
      <ScaffoldBlock />

      <H3 className="mt-6 mb-3">Step 3: Develop and build</H3>
      <P className="mb-4">
        Run <C>ios</C> to launch on the simulator or a connected device, then <C>ios:build</C> to
        produce the app bundle:
      </P>
      <MultiTerminal tabs={DEV_TABS} />
      <MultiTerminal tabs={BUILD_TABS} />

      <Callout>
        <strong>Tip:</strong> Xcode handles signing automatically with your Apple ID for
        development builds.
      </Callout>
    </Section>
  )
}

/* ---------- Windows section ---------- */

function WindowsSection() {
  return (
    <Section id="windows" title="Windows">
      <P className="mb-4">
        A native iOS <C>.app</C> cannot be produced on Windows - Tauri relies on Xcode, Apple's
        signing toolchain, and CocoaPods, none of which run on Windows. The Tauri team's own
        recommendation is to build iOS apps on a <C>macos-latest</C> runner in CI.
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
        <strong>Why not build locally?</strong> Tauri's iOS build needs Xcode and Apple's signing
        toolchain, which do not exist on Windows. GitHub Actions on <C>macos-latest</C> is the
        supported path.
      </Callout>
    </Section>
  )
}

/* ---------- Linux section ---------- */

function LinuxSection() {
  return (
    <Section id="linux" title="Linux">
      <P className="mb-4">
        A native iOS <C>.app</C> cannot be produced on Linux - Tauri relies on Xcode, Apple's
        signing toolchain, and CocoaPods, none of which run on Linux. The Tauri team's own
        recommendation is to build iOS apps on a <C>macos-latest</C> runner in CI.
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
        <strong>Why not build locally?</strong> Tauri's iOS build needs Xcode and Apple's signing
        toolchain, which do not exist on Linux. GitHub Actions on <C>macos-latest</C> is the
        supported path.
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
        Open the latest <C>Build iOS App</C> run.
      </li>
      <li>
        Under <strong className={STRONG}>Artifacts</strong>, download <C>ios-build</C>. Or, if a
        release was created, download the <C>.ipa</C> from the Releases page.
      </li>
    </ol>
  )
}

/* ---------- content ---------- */

function Content() {
  return (
    <>
      <Section id="ios-overview" title="iOS Overview">
        <P className="mb-4">
          Bini.js allows you to build native iOS mobile applications using Tauri v2. Your React app
          runs inside a WKWebView with full access to native iOS APIs and features.
        </P>
        <div className="grid gap-3 sm:grid-cols-3">
          <FeatureCard title="Native iOS App" text="Real native WKWebView, not a wrapper" />
          <FeatureCard title="Code Signing" text="Xcode-managed automatic signing" />
          <FeatureCard title="Auto Plugin Wiring" text="bini-native wires iOS permissions" />
        </div>
        <Callout>
          iOS apps are built using Tauri's iOS backend. Your app runs in a native WKWebView with
          full system access.
        </Callout>
      </Section>

      <Section id="requirements" title="Requirements">
        <P className="mb-4">
          Building iOS apps requires different tools depending on your operating system. See the
          section for your OS below.
        </P>
        <UL>
          <li>
            <strong className={STRONG}>On macOS:</strong> Xcode, Xcode Command Line Tools,
            CocoaPods, Node.js, and Rust with iOS targets - everything runs locally.
          </li>
          <li>
            <strong className={STRONG}>On Windows or Linux:</strong> Node.js, Git, a GitHub account,
            and the ability to push a repo. The iOS build itself runs on GitHub Actions.
          </li>
        </UL>
        <P className="mb-4">Add the required Rust targets with rustup:</P>
        <MultiTerminal tabs={RUST_TARGET_TABS} />
        <Callout>
          You cannot produce a native iOS <C>.app</C> directly from Windows or Linux. Tauri v2 has
          no supported local cross-compilation path for iOS. The recommended way is GitHub Actions
          on a <C>macos-latest</C> runner, described in each section below.
        </Callout>
      </Section>

      <MacosSection />
      <WindowsSection />
      <LinuxSection />

      <Section id="development" title="Development">
        <P className="mb-4">
          Running <C>ios</C> opens your app on the iOS Simulator or a connected device. This
          requires a Mac with Xcode installed (see the macOS section):
        </P>
        <MultiTerminal tabs={DEV_TABS} />
        <P className="mb-4">This launches your app with:</P>
        <UL>
          <li>Hot reload for frontend changes</li>
          <li>Native iOS integration</li>
          <li>
            Auto-wired native APIs via <C>bini-native</C>
          </li>
          <li>Safari Web Inspector for debugging</li>
        </UL>

        <H3 className="mt-6 mb-3">Setting Up a Simulator</H3>
        <ol className={OL}>
          <li>Open Xcode</li>
          <li>
            Go to <strong className={STRONG}>Settings</strong> →{' '}
            <strong className={STRONG}>Platforms</strong>
          </li>
          <li>Download a simulator for your target iOS version</li>
          <li>
            Run <C>npm run ios</C>
          </li>
        </ol>
      </Section>

      <Section id="building" title="Building">
        <P className="mb-4">
          Build a distributable iOS app. On macOS this runs locally; on Windows and Linux it runs in
          GitHub Actions (see those sections):
        </P>
        <MultiTerminal tabs={BUILD_TABS} />
        <P className="mb-4">
          The build outputs land in <C>src-tauri/gen/ios/</C>:
        </P>
        <H3 className="mt-6 mb-3">Output Files</H3>
        <FolderVisual
          width={340}
          rows={[
            { n: 'src-tauri' },
            { n: 'gen', d: 1 },
            { n: 'ios', d: 2 },
            { n: 'build', d: 3 },
            { n: 'my-app.app', d: 4, dot: true },
            { n: 'my-app.ipa', d: 4 },
          ]}
        />
        <UL>
          <li>
            <C>my-app.app</C> - iOS app bundle (for simulator/testing)
          </li>
          <li>
            <C>my-app.ipa</C> - iOS App Store package (for distribution)
          </li>
        </UL>
        <Callout>
          The build output is a native iOS app that runs on iOS 13.0 and above.
        </Callout>
      </Section>

      <Section id="code-signing" title="Code Signing">
        <P className="mb-4">
          iOS code signing is managed by Xcode. For local development, Xcode uses automatic signing
          with your Apple ID - just open the project in Xcode and configure your team:
        </P>
        <CodeBlock
          filename="Terminal"
          lang="shell"
          code={`$ open src-tauri/gen/ios/MyApp.xcodeproj`}
        />
        <P className="mb-4">
          In Xcode, select the project → <strong className={STRONG}>Signing & Capabilities</strong>{' '}
          → choose your <strong className={STRONG}>Team</strong>. Xcode handles the rest.
        </P>
        <P className="mb-4">
          For GitHub Actions, store your Apple ID, app-specific password, and team ID as secrets and
          reference them in the workflow. The <C>tauri-action</C> step reads them from environment
          variables:
        </P>
        <H3 className="mb-3">
          <span className="flex items-center gap-2">
            <BrandIcon icon={siGithub} size={18} className="shrink-0 text-black dark:text-white" />
            GitHub Actions workflow with signing
          </span>
        </H3>
        <CodeBlock
          filename=".github/workflows/build-ios.yml"
          lang="yaml"
          code={SIGNED_WORKFLOW}
        />
        <Callout>
          For App Store distribution, you need an Apple Developer account and provisioning profiles.
          Development builds use Xcode's automatic signing.
        </Callout>
      </Section>

      <Section id="deployment" title="Deployment">
        <P className="mb-4">
          <C>npm run deploy</C> pushes your project source to GitHub - it does <strong>not</strong>{' '}
          build a signed IPA or submit to App Store Connect:
        </P>
        <MultiTerminal tabs={DEPLOY_TABS} />

        <H3 className="mt-6 mb-3">Deployment Flow</H3>
        <ol className={OL}>
          <li>
            Build your app with <C>npm run ios:build</C>
          </li>
          <li>
            Run <C>npm run deploy</C> to push source to GitHub
          </li>
          <li>Upload the IPA to App Store Connect manually</li>
        </ol>

        <Callout>
          Store submission is manual. After building your app, upload it to App Store Connect for
          TestFlight or App Store distribution.
        </Callout>
      </Section>
    </>
  )
}

/* ---------- page ---------- */

export default function PlatformIosPage() {
  return (
    <DocPage
      title="iOS"
      description="Build native iOS mobile applications with Bini.js."
      url="https://bini.js.org/docs/platform-ios"
      editUrl="https://github.com/Binidu01/bini-official/edit/main/src/app/docs/platform-ios.tsx"
      toc={TOC_ITEMS}
      prev={{ to: '/docs/platform-android', title: 'Android' }}
      next={{ to: '/docs/deploying', title: 'Deployment' }}
    >
      <Content />
    </DocPage>
  )
}