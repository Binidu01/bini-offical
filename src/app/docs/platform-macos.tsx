// src/app/docs/platform-macos.tsx
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
  { id: 'macos-overview', label: 'macOS Overview' },
  { id: 'requirements', label: 'Requirements' },
  { id: 'native-macos', label: 'macOS' },
  { id: 'windows', label: 'Windows' },
  { id: 'linux', label: 'Linux' },
  { id: 'development', label: 'Development' },
  { id: 'building', label: 'Building' },
  { id: 'code-signing', label: 'Code Signing' },
  { id: 'store-submission', label: 'Store Submission' },
]

const OL =
  'mb-6 list-decimal space-y-2 pl-5 text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400'

const STRONG = 'font-medium text-neutral-900 dark:text-neutral-100'

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
    `$ ${CREATE[pm]} my-app --platform desktop`,
    '$ cd my-app',
    pm === 'npm' ? '$ npm install' : pm === 'bun' ? '$ bun install' : `$ ${pm} install`,
  ].join('\n')
)

const INTERACTIVE_TABS = tabs((pm) => `$ ${CREATE[pm]}`)

const DEV_TABS = tabs((pm) => `$ ${run(pm, 'tauri:dev')}`)
const BUILD_TABS = tabs((pm) => `$ ${run(pm, 'tauri:build')}`)
const DEPLOY_TABS = tabs((pm) => `$ ${run(pm, 'deploy')}`)
const LOCAL_SIGN_TABS = tabs((pm) => `$ ${RUNNER[pm]} create-bini-app sign desktop ./cert.p12 "pw" --identity "Developer ID Application: Your Name (TEAM_ID)"`)
const CI_SIGN_TABS = tabs((pm) => `$ ${RUNNER[pm]} create-bini-app sign macos --ci-only`)

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
        <span className={`${BOX} w-44`}>GitHub Actions (desktop.yml)</span>
        <Arrow />
        <span className={`${BOX} w-32`}>macos app bundle</span>
      </div>
    </GridBg>
  )
}

/* ---------- shared "create project" block ---------- */

function ScaffoldBlock({ isMac }: { isMac?: boolean }) {
  return (
    <>
      <H3 className="mt-6 mb-3">Create the Project</H3>
      <P className="mb-4">
        Create a new Bini.js project targeting desktop (Windows, macOS and Linux share one{' '}
        <C>src-tauri/</C>) and install its dependencies:
      </P>
      <MultiTerminal tabs={CREATE_AND_INSTALL_TABS} />
      <P className="mb-4">
        Or run the interactive prompt and select <C>Desktop (Windows, macOS, Linux)</C>:
      </P>
      <MultiTerminal tabs={INTERACTIVE_TABS} />
      <ClackTerminal copyText={`? Platforms? Desktop (Windows, macOS, Linux)`}>
        <ClackPrompt type="multi" title="Platforms?" active isFirst isLast>
          <div className="flex gap-1.5">
            <span className="text-neutral-500">◻</span>{' '}
            <span className="text-neutral-500">Web Application</span>
          </div>
          <div className="flex gap-1.5">
            <span className="text-green-500 dark:text-green-400">◼</span>{' '}
            <span className="text-neutral-900 dark:text-neutral-100">
              Desktop (Windows, macOS, Linux)
            </span>
          </div>
          <div className="flex gap-1.5">
            <span className="text-neutral-500">◻</span>{' '}
            <span className="text-neutral-500">Android</span>
          </div>
          {isMac && (
            <div className="flex gap-1.5">
              <span className="text-neutral-500">◻</span>{' '}
              <span className="text-neutral-500">iOS</span>
            </div>
          )}
          <div className="mt-2 text-[11px] text-neutral-500">
            ↑/↓ to navigate • Space: select • Enter: confirm
          </div>
        </ClackPrompt>
      </ClackTerminal>
      <Callout>
        <strong>Tip:</strong> Pass <C>--app-name "My App"</C> and <C>--org com.acme</C> to skip the
        native naming prompts, and <C>--sign</C> / <C>--nosign</C> to control code-signing setup.
      </Callout>
    </>
  )
}

/* ---------- shared CI workflow block (Windows / Linux) ---------- */

function WorkflowBlock() {
  const pm = useDocPm()
  return (
    <>
      <H3 className="mt-6 mb-3">Push and build in CI</H3>
      <P className="mb-4">
        Run <C>{run(pm, 'deploy')}</C> and choose <C>Desktop</C>. <C>bini-deploy</C> writes{' '}
        <C>.github/workflows/desktop.yml</C> — a matrix job that builds Windows, macOS and Linux on
        their own GitHub runners — stages everything, and pushes to your repository:
      </P>
      <MultiTerminal tabs={DEPLOY_TABS} />

      <ClackTerminal
        copyText={`? Platforms? Desktop (Windows, macOS, Linux)\n? GitHub repository URL? https://github.com/you/my-app\n? Branch to push to? main (default)\n? No .env.signing found. Run create-bini-app sign now? Yes\n? Sign macOS for GitHub Actions? Yes\n? Generate deployment files and push to GitHub? Yes\n? Commit message (press Enter for the default): chore: add deployment configuration`}
      >
        <ClackPrompt type="multi" title="Platforms?" active isFirst>
          <div className="flex gap-1.5">
            <span className="text-neutral-500">◻</span>{' '}
            <span className="text-neutral-500">Web Application</span>
          </div>
          <div className="flex gap-1.5">
            <span className="text-green-500 dark:text-green-400">◼</span>{' '}
            <span className="text-neutral-900 dark:text-neutral-100">
              Desktop (Windows, macOS, Linux)
            </span>
          </div>
          <div className="flex gap-1.5">
            <span className="text-neutral-500">◻</span>{' '}
            <span className="text-neutral-500">Android</span>
          </div>
          <div className="flex gap-1.5">
            <span className="text-neutral-500">◻</span>{' '}
            <span className="text-neutral-500">iOS</span>
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

        <ClackPrompt type="select" title="Sign macOS for GitHub Actions?">
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

      <P className="mb-4">
        Once pushed, the workflow runs on real <C>windows-latest</C>, <C>macos-latest</C> and{' '}
        <C>ubuntu-latest</C> runners and uploads the installers as run artifacts.
      </P>

      <H3 className="mt-6 mb-3">Download the App</H3>
      <DownloadSteps />
    </>
  )
}

/* ---------- macOS section ---------- */

function MacosSection() {
  const pm = useDocPm()
  return (
    <Section id="native-macos" title="macOS">
      <P className="mb-4">
        On macOS you can scaffold, develop, and build the app entirely on your own machine - no CI
        required.
      </P>

      <H3 className="mt-6 mb-3">Step 1: Install the tools</H3>
      <UL>
        <li>
          Node.js <strong className={STRONG}>20.19.0</strong> or higher
        </li>
        <li>
          Rust (stable toolchain via <ExtLink href="https://rustup.rs/">rustup</ExtLink>)
        </li>
        <li>
          Xcode Command Line Tools - run <C>xcode-select --install</C>
        </li>
        <li>
          Full Xcode (for building and notarization) -{' '}
          <ExtLink href="https://apps.apple.com/app/xcode/id497799835">Download</ExtLink>
        </li>
      </UL>

      <H3 className="mt-6 mb-3">Step 2: Create the project</H3>
      <ScaffoldBlock isMac />

      <H3 className="mt-6 mb-3">Step 3: Develop and build</H3>
      <P className="mb-4">
        Run <C>tauri:dev</C> to open your app in a native window, then <C>tauri:build</C> to
        produce the app bundle:
      </P>
      <MultiTerminal tabs={DEV_TABS} />
      <MultiTerminal tabs={BUILD_TABS} />

      <Callout>
        <strong>Tip:</strong> Use <C>create-bini-app sign desktop</C> to set up Developer ID signing
        and notarization.
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
        Open the latest <C>Desktop</C> workflow run.
      </li>
      <li>
        Under <strong className={STRONG}>Artifacts</strong>, download the macOS bundle (or, if a
        release was created, download the <C>.dmg</C> from the Releases page).
      </li>
    </ol>
  )
}

/* ---------- content ---------- */

function Content() {
  const pm = useDocPm()
  return (
    <>
      <Section id="macos-overview" title="macOS Overview">
        <P className="mb-4">
          Bini.js allows you to build native macOS desktop applications using Tauri v2. Your React
          app is wrapped in a WKWebView binary, providing a native experience with full system
          access. The <C>desktop</C> target covers Windows, macOS and Linux from one <C>src-tauri/</C>.
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
        <Callout>
          On Windows or Linux, <C>tauri:dev</C> runs the Windows/Linux desktop app, not the macOS one.
          Use web development while iterating, and let CI build the macOS binary.
        </Callout>
      </Section>

      <Section id="building" title="Building">
        <P className="mb-4">
          Build a distributable macOS application with <C>tauri:build</C>. On macOS this runs
          locally; on Windows and Linux it runs in GitHub Actions (see those sections):
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
          <li>A "Developer ID Application" certificate exported as a <C>.p12</C> file.</li>
          <li>The password for the <C>.p12</C> file.</li>
          <li>Your 10-character Apple Team ID.</li>
          <li>
            For notarization: an App Store Connect API key (Issuer ID, Key ID, and <C>.p8</C> file) or
            your Apple ID and app-specific password.
          </li>
        </UL>

        <H3 className="mt-6 mb-3">Local Signing</H3>
        <P className="mb-4">
          To sign the <C>.app</C> locally on your Mac, import your <C>.p12</C> certificate into your
          login keychain:
        </P>
        <MultiTerminal tabs={LOCAL_SIGN_TABS} />

        <H3 className="mt-6 mb-3">GitHub Actions Signing</H3>
        <P className="mb-4">
          If you want the GitHub Action runner to sign the <C>.app</C> automatically, you must provide
          the certificate and notarization credentials via GitHub Secrets. Use the <C>--ci-only</C>{' '}
          flag to configure it without setting up local signing:
        </P>
        <MultiTerminal tabs={CI_SIGN_TABS} />

        <P className="mb-4">
          Signing values go into the git-ignored <C>src-tauri/tauri.macos.conf.json</C>, which
          Tauri merges automatically on macOS only, so the committed <C>tauri.conf.json</C> never
          points at a certificate that only exists on your machine:
        </P>
        <CodeBlock
          filename="src-tauri/tauri.macos.conf.json"
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
        <H3 className="mb-3">
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
            Add <C>APPLE_CERTIFICATE</C> with the base64-encoded string of your <C>.p12</C> file.
          </li>
          <li>
            Add <C>APPLE_CERTIFICATE_PASSWORD</C> with the password for your certificate.
          </li>
          <li>
            Add <C>APPLE_SIGNING_IDENTITY</C> with your identity string.
          </li>
          <li>
            Add <C>KEYCHAIN_PASSWORD</C> with a random password for the temporary keychain.
          </li>
          <li>
            For notarization, add <C>APPLE_API_ISSUER</C>, <C>APPLE_API_KEY</C>, and <C>APPLE_API_KEY_P8</C> (or use <C>APPLE_ID</C>, <C>APPLE_PASSWORD</C>, <C>APPLE_TEAM_ID</C>).
          </li>
        </ol>
        <Callout>
          For production distribution, Developer ID signing and notarization are required to avoid
          Gatekeeper warnings. Never commit <C>.env.signing</C>, the <C>.p12</C>, or{' '}
          <C>tauri.macos.conf.json</C>.
        </Callout>
      </Section>

      <Section id="store-submission" title="Store Submission">
        <P className="mb-4">
          Once you have a signed and notarized <C>.app</C> or <C>.dmg</C>, you can distribute it.
          Depending on your goals, you have three options:
        </P>
        <UL>
          <li>
            <strong className={STRONG}>Direct Download:</strong> Host the <C>.dmg</C> on your
            website or GitHub Releases. This is the most common option for desktop apps.
          </li>
          <li>
            <strong className={STRONG}>Mac App Store:</strong> Submit your app to the Mac App Store
            using App Store Connect.
          </li>
          <li>
            <strong className={STRONG}>Package Managers:</strong> Distribute via{' '}
            <ExtLink href="https://brew.sh/">Homebrew</ExtLink> for command-line installs.
          </li>
        </UL>

        <H3 className="mt-6 mb-3">Mac App Store</H3>
        <P className="mb-4">
          To publish on the Mac App Store, you need an Apple Developer account, an App Store
          distribution provisioning profile, and to upload your app using Xcode or Transporter. See
          the{' '}
          <ExtLink href="https://developer.apple.com/app-store/submitting/">
            App Store submission guide
          </ExtLink>{' '}
          for the specific steps.
        </P>

        <H3 className="mt-6 mb-3">Direct Download</H3>
        <P className="mb-4">
          If you are distributing directly, upload the signed and notarized <C>.dmg</C> from{' '}
          <C>src-tauri/target/release/bundle/dmg/</C> to your website or GitHub Releases. Users can
          then download and install the app manually.
        </P>

        <H3 className="mt-6 mb-3">Package Managers</H3>
        <P className="mb-4">
          For command-line installs, you can submit a Cask to Homebrew. Users install your app with
          a command like <C>brew install --cask my-app</C>.
        </P>
        <UL>
          <li>
            <strong className={STRONG}>Homebrew:</strong> Submit a Cask to the{' '}
            <ExtLink href="https://github.com/Homebrew/homebrew-cask">
              Homebrew/homebrew-cask
            </ExtLink>{' '}
            repository.
          </li>
        </UL>

        <Callout>
          <strong>Tip:</strong> For direct download, always sign and notarize your app. Unsigned
          apps trigger Gatekeeper warnings, which deter users from installing your app.
        </Callout>
      </Section>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link to="/docs/platform-windows" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Windows</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Build a native Windows app with Authenticode signing and NSIS/MSI installers.</p>
        </Link>
        <Link to="/docs/platform-linux" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Linux</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Build a native Linux app with AppImage, .deb, and .rpm bundles.</p>
        </Link>
        <Link to="/docs/platform-android" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Android</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Build a native Android app with keystore signing and Play Store support.</p>
        </Link>
        <Link to="/docs/platform-ios" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">iOS</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Build a native iOS app with App Store distribution and TestFlight.</p>
        </Link>
      </div>
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