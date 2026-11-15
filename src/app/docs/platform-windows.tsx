// src/app/docs/platform-windows.tsx
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
  { id: 'windows-overview', label: 'Windows Overview' },
  { id: 'requirements', label: 'Requirements' },
  { id: 'native-windows', label: 'Windows' },
  { id: 'macos', label: 'macOS' },
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
const LOCAL_SIGN_TABS = tabs((pm) => `$ ${RUNNER[pm]} create-bini-app sign desktop ./cert.pfx "pw"`)
const CI_SIGN_TABS = tabs((pm) => `$ ${RUNNER[pm]} create-bini-app sign windows --ci-only`)

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
        <span className={`${BOX} w-32`}>windows installer</span>
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

/* ---------- shared CI workflow block ---------- */

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
        copyText={`? Platforms? Desktop (Windows, macOS, Linux)\n? GitHub repository URL? https://github.com/you/my-app\n? Branch to push to? main (default)\n? No .env.signing found. Run create-bini-app sign now? Yes\n? Sign Windows for GitHub Actions? Yes\n? Generate deployment files and push to GitHub? Yes\n? Commit message (press Enter for the default): chore: add deployment configuration`}
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

        <ClackPrompt type="select" title="Sign Windows for GitHub Actions?">
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

      <H3 className="mt-6 mb-3">Download the Installer</H3>
      <DownloadSteps />
    </>
  )
}

/* ---------- Windows section ---------- */

function WindowsSection() {
  const pm = useDocPm()
  return (
    <Section id="native-windows" title="Windows">
      <P className="mb-4">
        On Windows you can scaffold, develop, and build the app entirely on your own machine - no
        CI required.
      </P>

      <H3 className="mt-6 mb-3">Step 1: Install the tools</H3>
      <UL>
        <li>
          Node.js <strong className={STRONG}>20.19.0</strong> or higher
        </li>
        <li>
          Rust (stable toolchain via <ExtLink href="https://rustup.rs/">rustup</ExtLink>) with the
          MSVC toolchain as default - Tauri compiles a native Rust binary
        </li>
        <li>
          Microsoft C++ Build Tools -{' '}
          <ExtLink href="https://visualstudio.microsoft.com/visual-cpp-build-tools/">Download</ExtLink>{' '}
          (install the "Desktop development with C++" workload)
        </li>
        <li>
          Microsoft Edge WebView2 Runtime -{' '}
          <ExtLink href="https://developer.microsoft.com/en-us/microsoft-edge/webview2/">
            Download
          </ExtLink>{' '}
          (the CLI checks for it during the preflight and stops if it is missing)
        </li>
      </UL>

      <H3 className="mt-6 mb-3">Step 2: Create the project</H3>
      <ScaffoldBlock />

      <H3 className="mt-6 mb-3">Step 3: Develop and build</H3>
      <P className="mb-4">
        Run <C>tauri:dev</C> to open your app in a native window, then <C>tauri:build</C> to produce
        the executable and installer:
      </P>
      <MultiTerminal tabs={DEV_TABS} />
      <MultiTerminal tabs={BUILD_TABS} />

      <Callout>
        <strong>Tip:</strong> Run <C>{run(pm, 'doctor')}</C> to check your toolchain, and{' '}
        <C>create-bini-app add desktop</C> to add the desktop target to an existing project.
      </Callout>
    </Section>
  )
}

/* ---------- macOS section ---------- */

function MacosSection() {
  return (
    <Section id="macos" title="macOS">
      <P className="mb-4">
        A native Windows <C>.exe</C> cannot be produced on macOS - Tauri relies on Windows-only
        toolchains (MSVC, WebView2, WiX/NSIS), and bundles are not cross-compiled. The Tauri team's
        recommendation is to build Windows apps on a <C>windows-latest</C> runner in CI.
      </P>
      <CrossBuildFlowVisual os="macOS" />

      <H3 className="mt-6 mb-3">Step 1: Install the tools</H3>
      <P className="mb-4">
        Install Node.js <C>20.19.0</C> or higher and Git. Git comes with the Xcode command line
        tools - run <C>xcode-select --install</C> if you do not have it yet.
      </P>

      <H3 className="mt-6 mb-3">Step 2: Create the project</H3>
      <ScaffoldBlock isMac />

      <WorkflowBlock />

      <Callout>
        <strong>Why not build locally?</strong> Tauri's Windows build needs MSVC and WebView2, which
        do not exist on macOS. Cross-compiling from macOS to Windows is technically possible but
        experimental and unreliable. GitHub Actions on <C>windows-latest</C> is the supported path.
      </Callout>
    </Section>
  )
}

/* ---------- Linux section ---------- */

function LinuxSection() {
  return (
    <Section id="linux" title="Linux">
      <P className="mb-4">
        A native Windows <C>.exe</C> cannot be produced on Linux - Tauri relies on Windows-only
        toolchains (MSVC, WebView2, WiX/NSIS), and bundles are not cross-compiled. The Tauri team's
        recommendation is to build Windows apps on a <C>windows-latest</C> runner in CI.
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
        <strong>Why not build locally?</strong> Tauri's Windows build needs MSVC and WebView2, which
        do not exist on Linux. Cross-compiling from Linux to Windows is technically possible but
        experimental and unreliable. GitHub Actions on <C>windows-latest</C> is the supported path.
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
        Under <strong className={STRONG}>Artifacts</strong>, download the Windows bundle (or, if a
        release was created, download the <C>.exe</C> / <C>.msi</C> from the Releases page).
      </li>
    </ol>
  )
}

/* ---------- content ---------- */

function Content() {
  const pm = useDocPm()
  return (
    <>
      <Section id="windows-overview" title="Windows Overview">
        <P className="mb-4">
          Bini.js builds native Windows desktop applications using Tauri v2. Your React app is wrapped
          in a WebView2 binary, providing a native experience with full system access. The{' '}
          <C>desktop</C> target covers Windows, macOS and Linux from one <C>src-tauri/</C>.
        </P>
        <div className="grid gap-3 sm:grid-cols-3">
          <FeatureCard
            title="Native Binary"
            text="Windows executable (.exe) with Authenticode signing"
          />
          <FeatureCard
            title="Code Signing"
            text="Authenticode signing support for trusted distribution"
          />
          <FeatureCard title="Native APIs" text="Full access to Windows APIs via Tauri" />
        </div>
        <Callout>
          Windows desktop apps are built using Tauri's WebView2 backend. Your app runs in a native
          window with full system access.
        </Callout>
      </Section>

      <Section id="requirements" title="Requirements">
        <P className="mb-4">
          Building Windows desktop apps requires different tools depending on your operating system.
          See the section for your OS below.
        </P>
        <UL>
          <li>
            <strong className={STRONG}>On Windows:</strong> Node.js, Rust, Microsoft C++ Build Tools
            and the WebView2 Runtime - everything runs locally.
          </li>
          <li>
            <strong className={STRONG}>On macOS or Linux:</strong> Node.js, Git, a GitHub account,
            and the ability to push a repo. The Windows build itself runs on GitHub Actions.
          </li>
        </UL>
        <Callout>
          You cannot produce a native Windows <C>.exe</C> directly from macOS or Linux. Tauri v2 has
          no supported local cross-compilation path for Windows. The recommended way is GitHub
          Actions on a <C>windows-latest</C> runner, described in each section below.
        </Callout>
      </Section>

      <WindowsSection />
      <MacosSection />
      <LinuxSection />

      <Section id="development" title="Development">
        <P className="mb-4">
          Running <C>tauri:dev</C> opens your app in a native desktop window for the OS you are on.
          To develop the Windows app in a native window, run it on a Windows machine with the
          requirements installed (see the Windows section):
        </P>
        <MultiTerminal tabs={DEV_TABS} />
        <P className="mb-4">This launches your app in a native window with:</P>
        <UL>
          <li>Hot reload for frontend changes</li>
          <li>Native window with system tray support</li>
          <li>Access to Windows APIs</li>
          <li>Devtools for debugging</li>
        </UL>
        <Callout>
          On macOS or Linux, <C>tauri:dev</C> runs the macOS/Linux desktop app, not the Windows one.
          Use web development while iterating, and let CI build the Windows binary.
        </Callout>
      </Section>

      <Section id="building" title="Building">
        <P className="mb-4">
          Build a distributable desktop executable with <C>tauri:build</C>. On Windows this runs
          locally; on macOS and Linux, Windows builds run in GitHub Actions (see those sections).
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
            { n: 'nsis', d: 4 },
            { n: 'my-app_0.1.0_x64-setup.exe', d: 5, dot: true },
            { n: 'msi', d: 4 },
            { n: 'my-app_0.1.0_x64_en-US.msi', d: 5 },
          ]}
        />
        <UL>
          <li>
            <C>nsis/*.exe</C> - NSIS installer (recommended for distribution)
          </li>
          <li>
            <C>msi/*.msi</C> - WiX MSI installer
          </li>
          <li>
            <C>release/my-app.exe</C> - The raw executable (before bundling)
          </li>
        </UL>
        <Callout>
          The build output is a native Windows binary that runs without any additional dependencies.
        </Callout>
      </Section>

      <Section id="code-signing" title="Code Signing">
        <P className="mb-4">
          Bini.js supports Authenticode code signing for Windows binaries. Set it up or redo it at
          any time with <C>create-bini-app sign</C> - either interactively or with a single command.
          If you only need signing for GitHub Actions, use the <C>--ci-only</C> flag.
        </P>

        <H3 className="mt-6 mb-3">Prerequisites</H3>
        <P className="mb-4">
          Signing requires an Authenticode certificate. If you do not have one, purchase it from a
          trusted Certificate Authority (CA).
        </P>
        <UL>
          <li>
            A <C>.pfx</C> code signing certificate from a trusted CA such as{' '}
            <ExtLink href="https://www.digicert.com/">DigiCert</ExtLink>,{' '}
            <ExtLink href="https://sectigo.com/">Sectigo</ExtLink>, or{' '}
            <ExtLink href="https://www.globalsign.com/">GlobalSign</ExtLink>.
          </li>
          <li>The password for the certificate file.</li>
        </UL>

        <H3 className="mt-6 mb-3">Local Signing</H3>
        <P className="mb-4">
          To sign the <C>.exe</C> locally on your Windows machine, import your <C>.pfx</C> certificate
          into your local certificate store:
        </P>
        <MultiTerminal tabs={LOCAL_SIGN_TABS} />

        <H3 className="mt-6 mb-3">GitHub Actions Signing</H3>
        <P className="mb-4">
          If you want the GitHub Action runner to sign the <C>.exe</C> automatically, you must provide
          the certificate via GitHub Secrets. Use the <C>--ci-only</C> flag to configure it without
          setting up local signing:
        </P>
        <MultiTerminal tabs={CI_SIGN_TABS} />

        <P className="mb-4">
          Signing values go into the git-ignored <C>src-tauri/tauri.windows.conf.json</C>, which
          Tauri merges automatically on Windows only, so the committed <C>tauri.conf.json</C> never
          points at a certificate that only exists on your machine:
        </P>
        <CodeBlock
          filename="src-tauri/tauri.windows.conf.json"
          lang="json"
          code={`{
  "bundle": {
    "windows": {
      "certificateThumbprint": "YOUR_CERT_THUMBPRINT",
      "digestAlgorithm": "sha256",
      "timestampUrl": "http://timestamp.digicert.com"
    }
  }
}`}
        />

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
          To sign the Windows build in GitHub Actions, you must add your certificate as a repository
          secret. <C>bini-deploy</C> does <strong className={STRONG}>not</strong> upload secrets
          automatically. You must add them manually:
        </P>
        <ol className={OL}>
          <li>
            Go to your repository on GitHub and navigate to <strong className={STRONG}>Settings</strong>{' '}
            &rarr; <strong className={STRONG}>Secrets and variables</strong> &rarr;{' '}
            <strong className={STRONG}>Actions</strong>.
          </li>
          <li>
            Click <strong className={STRONG}>New repository secret</strong>.
          </li>
          <li>
            Add <C>WINDOWS_CERTIFICATE</C> with the base64-encoded string of your <C>.pfx</C> file.
          </li>
          <li>
            Add <C>WINDOWS_CERTIFICATE_PASSWORD</C> with the password for your certificate.
          </li>
        </ol>
        <Callout>
          For production distribution, Authenticode signing is recommended to establish trust with
          Windows users. Never commit <C>.env.signing</C>, the <C>.pfx</C>, or{' '}
          <C>tauri.windows.conf.json</C>.
        </Callout>
      </Section>

      <Section id="store-submission" title="Store Submission">
        <P className="mb-4">
          Once you have a signed installer (<C>.exe</C> or <C>.msi</C>), you can distribute it.
          Depending on your goals, you have three options:
        </P>
        <UL>
          <li>
            <strong className={STRONG}>Direct Download:</strong> Host the <C>.msi</C> or <C>.exe</C>{' '}
            on your website or GitHub Releases. This is the most common option for desktop apps.
          </li>
          <li>
            <strong className={STRONG}>Microsoft Store:</strong> Submit your app to the Microsoft
            Store using a Microsoft Partner Center account.
          </li>
          <li>
            <strong className={STRONG}>Package Managers:</strong> Distribute via{' '}
            <ExtLink href="https://learn.microsoft.com/en-us/windows/package-manager/winget/">
              Winget
            </ExtLink>{' '}
            or{' '}
            <ExtLink href="https://docs.chocolatey.org/en-us/create/create-packages/">
              Chocolatey
            </ExtLink>{' '}
            for command-line installs.
          </li>
        </UL>

        <H3 className="mt-6 mb-3">Microsoft Store</H3>
        <P className="mb-4">
          To publish on the Microsoft Store, you need an MSIX package and a Partner Center account.
          See the{' '}
          <ExtLink href="https://learn.microsoft.com/en-us/windows/apps/publish/">
            Microsoft Store publishing guide
          </ExtLink>{' '}
          for the specific steps.
        </P>

        <H3 className="mt-6 mb-3">Direct Download</H3>
        <P className="mb-4">
          If you are distributing directly, upload the signed <C>.exe</C> or <C>.msi</C> from{' '}
          <C>src-tauri/target/release/bundle/</C> to your website or GitHub Releases. Users can then
          download and install the app manually.
        </P>

        <H3 className="mt-6 mb-3">Package Managers</H3>
        <P className="mb-4">
          For command-line installs, you can submit your installer to Winget (Microsoft's package
          manager) or Chocolatey (a community package manager). Users install your app with a
          command like <C>winget install MyApp</C> or <C>choco install my-app</C>.
        </P>
        <UL>
          <li>
            <strong className={STRONG}>Winget:</strong> Submit a YAML manifest to the{' '}
            <ExtLink href="https://github.com/microsoft/winget-pkgs">
              microsoft/winget-pkgs
            </ExtLink>{' '}
            repository.
          </li>
          <li>
            <strong className={STRONG}>Chocolatey:</strong> Create a package and push it to the{' '}
            <ExtLink href="https://community.chocolatey.org/">Chocolatey community repository</ExtLink>.
          </li>
        </UL>

        <Callout>
          <strong>Tip:</strong> For direct download, always sign your installer with Authenticode.
          Unsigned installers trigger Windows SmartScreen warnings, which deter users from installing
          your app.
        </Callout>
      </Section>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link to="/docs/platform-macos" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">macOS</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Build a native macOS app with Developer ID signing and notarization.</p>
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

export default function PlatformWindowsPage() {
  return (
    <DocPage
      title="Windows"
      description="Build native Windows desktop applications with Bini.js."
      url="https://bini.js.org/docs/platform-windows"
      editUrl="https://github.com/Binidu01/bini-official/edit/main/src/app/docs/platform-windows.tsx"
      toc={TOC_ITEMS}
      prev={{ to: '/docs/platform-web', title: 'Web' }}
      next={{ to: '/docs/platform-macos', title: 'macOS' }}
    >
      <Content />
    </DocPage>
  )
}