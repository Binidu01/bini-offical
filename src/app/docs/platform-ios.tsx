// src/app/docs/platform-ios.tsx
import { Link } from 'react-router-dom'
import { siGithub } from 'simple-icons'

import {
  BrandIcon,
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
  UL,
  useDocPm,
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
  { id: 'store-submission', label: 'Store Submission' },
]

const OL =
  'mb-6 list-decimal space-y-2 pl-5 text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400'

const STRONG = 'font-medium text-neutral-900 dark:text-neutral-100'

const XCODE_URL = 'https://apps.apple.com/app/xcode/id497799835'

/* ---------- terminal tab helpers ---------- */

const PMS = ['npm', 'pnpm', 'yarn', 'bun'] as const
type Pm = (typeof PMS)[number]

const CREATE: Record<Pm, string> = {
  npm: 'npx create-bini-app@latest',
  pnpm: 'pnpm create bini-app@latest',
  yarn: 'yarn create bini-app@latest',
  bun: 'bun create bini-app@latest',
}

const RUNNER: Record<Pm, string> = {
  npm: 'npx',
  pnpm: 'pnpm dlx',
  yarn: 'yarn dlx',
  bun: 'bunx',
}

const run = (pm: Pm, script: string) =>
  pm === 'npm'
    ? `npm run ${script}`
    : pm === 'bun'
      ? `bun run ${script}`
      : pm === 'pnpm'
        ? `pnpm run ${script}`
        : `yarn ${script}`

const tabs = (cmd: (pm: Pm) => string): TerminalTab[] =>
  PMS.map((pm) => ({ id: pm, label: pm, command: cmd(pm) }))

const CREATE_AND_INSTALL_TABS = tabs((pm) =>
  [
    `$ ${CREATE[pm]} my-app --platform ios`,
    '$ cd my-app',
    pm === 'npm' ? '$ npm install' : pm === 'bun' ? '$ bun install' : `$ ${pm} install`,
    '$ pod install --project-directory=src-tauri/gen/ios',
  ].join('\n')
)

const INTERACTIVE_TABS = tabs((pm) => `$ ${CREATE[pm]}`)

const DEV_TABS = tabs((pm) => `$ ${run(pm, 'ios')}`)
const BUILD_TABS = tabs((pm) => `$ ${run(pm, 'ios:build')}`)
const DEPLOY_TABS = tabs((pm) => `$ ${run(pm, 'deploy')}`)
const LOCAL_SIGN_TABS = tabs((pm) => `$ ${RUNNER[pm]} create-bini-app sign ios`)
const CI_SIGN_TABS = tabs((pm) => `$ ${RUNNER[pm]} create-bini-app sign ios --ci-only`)

/* ---------- visuals ---------- */

const BOX = `${CARD} flex h-12 shrink-0 items-center justify-center px-3 text-center text-[12px] leading-tight text-neutral-800 dark:text-neutral-200`

function CrossBuildFlowVisual({ os }: { os: string }) {
  return (
    <GridBg>
      <div className="flex items-center gap-3">
        <span className={`${BOX} w-28`}>Your {os} machine</span>
        <Arrow />
        <span className={`${BOX} w-24`}>npm run deploy</span>
        <Arrow />
        <span className={`${BOX} w-44`}>GitHub Actions (ios.yml)</span>
        <Arrow />
        <span className={`${BOX} w-32`}>ios app bundle</span>
      </div>
    </GridBg>
  )
}

/* ---------- shared blocks ---------- */

function ScaffoldBlock() {
  return (
    <>
      <H3 className="mt-6 mb-3">Create the Project</H3>
      <P className="mb-4">
        Create a new Bini.js project targeting iOS, install its dependencies, and install its pods:
      </P>
      <MultiTerminal tabs={CREATE_AND_INSTALL_TABS} />
      <P className="mb-4">
        Or run the interactive prompt and select <C>iOS</C>:
      </P>
      <MultiTerminal tabs={INTERACTIVE_TABS} />
      <ClackTerminal copyText={`? Platforms? iOS`}>
        <ClackPrompt type="multi" title="Platforms?" active isFirst isLast>
          <div className="flex gap-1.5">
            <span className="text-neutral-500">◻</span>{' '}
            <span className="text-neutral-500">Web Application</span>
          </div>
          <div className="flex gap-1.5">
            <span className="text-neutral-500">◻</span>{' '}
            <span className="text-neutral-500">Desktop (Windows, macOS, Linux)</span>
          </div>
          <div className="flex gap-1.5">
            <span className="text-neutral-500">◻</span>{' '}
            <span className="text-neutral-500">Android</span>
          </div>
          <div className="flex gap-1.5">
            <span className="text-green-500 dark:text-green-400">◼</span>{' '}
            <span className="text-neutral-900 dark:text-neutral-100">iOS</span>
          </div>
          <div className="mt-2 text-[11px] text-neutral-500">
            ↑/↓ to navigate • Space: select • Enter: confirm
          </div>
        </ClackPrompt>
      </ClackTerminal>
    </>
  )
}

function CiDeployBlock() {
  const pm = useDocPm()
  return (
    <>
      <H3 className="mt-6 mb-3">Build in GitHub Actions</H3>
      <P className="mb-4">
        Run <C>{run(pm, 'deploy')}</C> and choose <C>iOS</C>. <C>bini-deploy</C> writes{' '}
        <C>.github/workflows/ios.yml</C> and pushes your project to GitHub. The workflow builds the
        iOS app on a <C>macos-latest</C> runner:
      </P>
      <MultiTerminal tabs={DEPLOY_TABS} />

      <ClackTerminal
        copyText={`? Platforms? iOS\n? GitHub repository URL? https://github.com/you/my-app\n? Branch to push to? main (default)\n? No .env.signing found. Run create-bini-app sign now? Yes\n? Sign iOS for GitHub Actions? Yes\n? Generate deployment files and push to GitHub? Yes\n? Commit message (press Enter for the default): chore: add deployment configuration`}
      >
        <ClackPrompt type="multi" title="Platforms?" active isFirst>
          <div className="flex gap-1.5">
            <span className="text-neutral-500">◻</span>{' '}
            <span className="text-neutral-500">Web Application</span>
          </div>
          <div className="flex gap-1.5">
            <span className="text-neutral-500">◻</span>{' '}
            <span className="text-neutral-500">Desktop (Windows, macOS, Linux)</span>
          </div>
          <div className="flex gap-1.5">
            <span className="text-neutral-500">◻</span>{' '}
            <span className="text-neutral-500">Android</span>
          </div>
          <div className="flex gap-1.5">
            <span className="text-green-500 dark:text-green-400">◼</span>{' '}
            <span className="text-neutral-900 dark:text-neutral-100">iOS</span>
          </div>
          <div className="mt-2 text-[11px] text-neutral-500">
            ↑/↓ to navigate • Space: select • Enter: confirm
          </div>
        </ClackPrompt>

        <ClackPrompt type="input" title="GitHub repository URL?">
          <div className="text-neutral-900 dark:text-neutral-100">https://github.com/you/my-app</div>
        </ClackPrompt>

        <ClackPrompt type="select" title="Branch to push to?">
          <div className="flex gap-1.5">
            <span className="text-green-500 dark:text-green-400">●</span>{' '}
            <span className="text-neutral-900 dark:text-neutral-100">main (default)</span>
          </div>
          <div className="flex gap-1.5">
            <span className="text-neutral-500">○</span>{' '}
            <span className="text-neutral-500">+ New branch...</span>
          </div>
        </ClackPrompt>

        <ClackPrompt type="select" title="No .env.signing found. Run create-bini-app sign now?">
          <div className="flex items-center gap-1.5 text-[13px] font-mono leading-none">
            <span className="text-green-500 dark:text-green-400">●</span>
            <span className="text-neutral-900 dark:text-neutral-100">Yes</span>
            <span className="text-neutral-500">/</span>
            <span className="text-neutral-500">○</span>
            <span className="text-neutral-500">No</span>
          </div>
        </ClackPrompt>

        <ClackPrompt type="select" title="Sign iOS for GitHub Actions?">
          <div className="flex items-center gap-1.5 text-[13px] font-mono leading-none">
            <span className="text-green-500 dark:text-green-400">●</span>
            <span className="text-neutral-900 dark:text-neutral-100">Yes</span>
            <span className="text-neutral-500">/</span>
            <span className="text-neutral-500">○</span>
            <span className="text-neutral-500">No</span>
          </div>
        </ClackPrompt>

        <ClackPrompt type="select" title="Generate deployment files and push to GitHub?" active>
          <div className="flex items-center gap-1.5 text-[13px] font-mono leading-none">
            <span className="text-green-500 dark:text-green-400">●</span>
            <span className="text-neutral-900 dark:text-neutral-100">Yes</span>
            <span className="text-neutral-500">/</span>
            <span className="text-neutral-500">○</span>
            <span className="text-neutral-500">No</span>
          </div>
        </ClackPrompt>

        <ClackPrompt type="input" title="Commit message (press Enter for the default):" active isLast>
          <div className="text-neutral-900 dark:text-neutral-100">chore: add deployment configuration</div>
        </ClackPrompt>
      </ClackTerminal>
    </>
  )
}

/* ---------- macOS section ---------- */

function MacosSection() {
  const pm = useDocPm()
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
          Rust via <ExtLink href="https://rustup.rs/">rustup</ExtLink>. Tauri automatically adds
          the required iOS targets for you.
        </li>
      </UL>

      <H3 className="mt-6 mb-3">Step 2: Create the project</H3>
      <ScaffoldBlock />

      <H3 className="mt-6 mb-3">Step 3: Develop and build locally</H3>
      <P className="mb-4">
        Run <C>ios</C> to launch on the simulator or a connected device, then <C>ios:build</C> to
        produce the app bundle:
      </P>
      <MultiTerminal tabs={DEV_TABS} />
      <MultiTerminal tabs={BUILD_TABS} />

      <CiDeployBlock />

      <Callout>
        <strong>Tip:</strong> Xcode handles signing automatically with your Apple ID for
        development builds. For CI builds, you can skip local Xcode setup entirely.
      </Callout>
    </Section>
  )
}

/* ---------- Windows section ---------- */

function WindowsSection() {
  const pm = useDocPm()
  return (
    <Section id="windows" title="Windows">
      <P className="mb-4">
        A native iOS <C>.app</C> cannot be produced on Windows - Tauri relies on Xcode, Apple's
        signing toolchain, and CocoaPods, none of which run on Windows.
      </P>
      <CrossBuildFlowVisual os="Windows" />

      <H3 className="mt-6 mb-3">Workflow for Windows Users</H3>
      <P className="mb-4">
        Since the scaffold does not offer iOS as an option on Windows, you should first scaffold an
        Android project, develop and test your app there, and then let GitHub Actions build the iOS
        app for you.
      </P>
      <ol className={OL}>
        <li>
          Scaffold the project with Android: <C>{`npx create-bini-app@latest my-app --platform android`}</C>
        </li>
        <li>
          Develop and test your app locally using <C>{run(pm, 'android')}</C>.
        </li>
        <li>
          Run <C>{run(pm, 'deploy')}</C> and choose <C>iOS</C>.
        </li>
      </ol>

      <CiDeployBlock />

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
  const pm = useDocPm()
  return (
    <Section id="linux" title="Linux">
      <P className="mb-4">
        A native iOS <C>.app</C> cannot be produced on Linux - Tauri relies on Xcode, Apple's
        signing toolchain, and CocoaPods, none of which run on Linux.
      </P>
      <CrossBuildFlowVisual os="Linux" />

      <H3 className="mt-6 mb-3">Workflow for Linux Users</H3>
      <P className="mb-4">
        Since the scaffold does not offer iOS as an option on Linux, you should first scaffold an
        Android project, develop and test your app there, and then let GitHub Actions build the iOS
        app for you.
      </P>
      <ol className={OL}>
        <li>
          Scaffold the project with Android: <C>{`npx create-bini-app@latest my-app --platform android`}</C>
        </li>
        <li>
          Develop and test your app locally using <C>{run(pm, 'android')}</C>.
        </li>
        <li>
          Run <C>{run(pm, 'deploy')}</C> and choose <C>iOS</C>.
        </li>
      </ol>

      <CiDeployBlock />

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
        Open the latest <C>iOS</C> workflow run.
      </li>
      <li>
        Under <strong className={STRONG}>Artifacts</strong>, download the iOS bundle (or, if a
        release was created, download the <C>.ipa</C> from the Releases page).
      </li>
    </ol>
  )
}

/* ---------- content ---------- */

function Content() {
  const pm = useDocPm()
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
            Run <C>{run(pm, 'ios')}</C>
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
          Bini.js supports Developer ID signing and notarization for macOS binaries. Set it up or
          redo it at any time with <C>create-bini-app sign</C>. If you only need signing for GitHub
          Actions, use the <C>--ci-only</C> flag.
        </P>

        <H3 className="mt-6 mb-3">Prerequisites</H3>
        <P className="mb-4">
          Signing requires an Apple Developer account. If you do not have one, enroll in the{' '}
          <ExtLink href="https://developer.apple.com/programs/">Apple Developer Program</ExtLink>.
        </P>
        <UL>
          <li>
            An "Apple Distribution" certificate exported as a <C>.p12</C> file (for CI builds).
          </li>
          <li>The password for the <C>.p12</C> file.</li>
          <li>Your 10-character Apple Team ID.</li>
          <li>
            A provisioning profile (<C>.mobileprovision</C>) for CI builds, or use Xcode's automatic
            signing for local development.
          </li>
        </UL>

        <H3 className="mt-6 mb-3">Local Signing</H3>
        <P className="mb-4">
          For local development, Xcode handles signing automatically. You can either open the project
          in Xcode or run:
        </P>
        <MultiTerminal tabs={LOCAL_SIGN_TABS} />
        <P className="mb-4">
          In Xcode, select the project → <strong className={STRONG}>Signing & Capabilities</strong>{' '}
          → choose your <strong className={STRONG}>Team</strong>.
        </P>

        <H3 className="mt-6 mb-3">GitHub Actions Signing</H3>
        <P className="mb-4">
          If you want the GitHub Action runner to sign the <C>.ipa</C> automatically, you must provide
          the certificate and provisioning profile via GitHub Secrets. Use the <C>--ci-only</C> flag
          to configure it without setting up local signing:
        </P>
        <MultiTerminal tabs={CI_SIGN_TABS} />

        <H3 className="mt-6 mb-3">
          <span className="flex items-center gap-2">
            <BrandIcon
              icon={siGithub}
              size={18}
              className="shrink-0 text-black dark:text-white"
            />
            Adding Secrets Manually
          </span>
        </H3>
        <P className="mb-4">
          To sign and notarize the macOS build in GitHub Actions, you must add your credentials as repository secrets. <C>bini-deploy</C> does <strong className={STRONG}>not</strong> upload secrets automatically. You must add them manually:
        </P>
        <ol className={OL}>
          <li>
            Go to your repository on GitHub and navigate to <strong className={STRONG}>Settings</strong> &rarr; <strong className={STRONG}>Secrets and variables</strong> &rarr; <strong className={STRONG}>Actions</strong>.
          </li>
          <li>
            Click <strong className={STRONG}>New repository secret</strong>.
          </li>
          <li>
            Add <C>IOS_CERTIFICATE</C> with the base64-encoded string of your <C>.p12</C> file.
          </li>
          <li>
            Add <C>IOS_CERTIFICATE_PASSWORD</C> with the password for your certificate.
          </li>
          <li>
            Add <C>IOS_MOBILE_PROVISION</C> with the base64-encoded string of your <C>.mobileprovision</C> file.
          </li>
          <li>
            Add <C>APPLE_DEVELOPMENT_TEAM</C> with your Apple Team ID.
          </li>
          <li>
            For notarization, add <C>APPLE_API_ISSUER</C>, <C>APPLE_API_KEY</C>, and <C>APPLE_API_KEY_P8</C> (or use <C>APPLE_ID</C>, <C>APPLE_PASSWORD</C>, <C>APPLE_TEAM_ID</C>).
          </li>
        </ol>
        <Callout>
          For App Store distribution, you need an Apple Developer account and provisioning profiles.
          Development builds use Xcode's automatic signing.
        </Callout>
      </Section>

      <Section id="deployment" title="Deployment">
        <P className="mb-4">
          You can build the iOS app locally on macOS using <C>{run(pm, 'ios:build')}</C>, or let GitHub
          Actions build it for you by running <C>{run(pm, 'deploy')}</C>.
        </P>

        <H3 className="mt-6 mb-3">Deploying via GitHub Actions</H3>
        <P className="mb-4">
          <C>{run(pm, 'deploy')}</C> generates <C>.github/workflows/ios.yml</C> and pushes your project to GitHub:
        </P>
        <MultiTerminal tabs={DEPLOY_TABS} />

        <H3 className="mt-6 mb-3">Deployment Flow</H3>
        <ol className={OL}>
          <li>
            Run <C>{run(pm, 'deploy')}</C> to generate the CI workflow and push to GitHub.
          </li>
          <li>
            GitHub Actions builds the signed IPA (if secrets are set) and attaches it to the run as an artifact.
          </li>
          <li>Download the artifact and upload it to App Store Connect manually.</li>
        </ol>
      </Section>

      <Section id="store-submission" title="Store Submission">
        <P className="mb-4">
          Once you have a signed <C>.ipa</C> or <C>.app</C>, you can distribute it. Depending on your
          goals, you have two options:
        </P>
        <UL>
          <li>
            <strong className={STRONG}>TestFlight:</strong> Upload the <C>.ipa</C> to App Store
            Connect for beta testing with external users.
          </li>
          <li>
            <strong className={STRONG}>App Store:</strong> Submit the <C>.ipa</C> to the App Store
            for public release.
          </li>
        </UL>

        <H3 className="mt-6 mb-3">TestFlight</H3>
        <P className="mb-4">
          TestFlight allows you to distribute beta builds to up to 10,000 external testers. Upload
          the <C>.ipa</C> to App Store Connect (via Xcode, Transporter, or the App Store Connect
          API), and invite testers via the App Store Connect dashboard. See the{' '}
          <ExtLink href="https://developer.apple.com/testflight/">
            TestFlight guide
          </ExtLink>{' '}
          for the specific steps.
        </P>

        <H3 className="mt-6 mb-3">App Store</H3>
        <P className="mb-4">
          To publish on the App Store, you need an Apple Developer Program membership. Upload the{' '}
          <C>.ipa</C> to App Store Connect, fill out the app metadata and screenshots, and submit it
          for review. See the{' '}
          <ExtLink href="https://developer.apple.com/app-store/submitting/">
            App Store submission guide
          </ExtLink>{' '}
          for the specific steps.
        </P>

        <Callout>
          <strong>Tip:</strong> For local development and testing, Xcode can install the app directly
          onto your device via <C>ios:build</C>. For distribution, you must use App Store Connect.
        </Callout>
      </Section>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link to="/docs/platform-android" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Android</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Build a native Android app with keystore signing and Play Store support.</p>
        </Link>
        <Link to="/docs/platform-windows" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Windows</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Build a native Windows app with Authenticode signing and NSIS/MSI installers.</p>
        </Link>
        <Link to="/docs/platform-macos" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">macOS</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Build a native macOS app with Developer ID signing and notarization.</p>
        </Link>
        <Link to="/docs/platform-linux" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Linux</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Build a native Linux app with AppImage, .deb, and .rpm bundles.</p>
        </Link>
      </div>
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