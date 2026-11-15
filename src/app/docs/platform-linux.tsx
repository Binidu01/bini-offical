// src/app/docs/platform-linux.tsx
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
  { id: 'linux-overview', label: 'Linux Overview' },
  { id: 'requirements', label: 'Requirements' },
  { id: 'native-linux', label: 'Linux' },
  { id: 'windows', label: 'Windows' },
  { id: 'macos', label: 'macOS' },
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
const LOCAL_SIGN_TABS = tabs((pm) => `$ ${RUNNER[pm]} create-bini-app sign linux`)
const CI_SIGN_TABS = tabs((pm) => `$ ${RUNNER[pm]} create-bini-app sign linux --ci-only`)

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
        <span className={`${BOX} w-32`}>linux appimage</span>
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

/* ---------- shared CI workflow block (Windows / macOS) ---------- */

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
        copyText={`? Platforms? Desktop (Windows, macOS, Linux)\n? GitHub repository URL? https://github.com/you/my-app\n? Branch to push to? main (default)\n? No .env.signing found. Run create-bini-app sign now? Yes\n? Sign Linux for GitHub Actions? Yes\n? Generate deployment files and push to GitHub? Yes\n? Commit message (press Enter for the default): chore: add deployment configuration`}
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

        <ClackPrompt type="select" title="Sign Linux for GitHub Actions?">
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

/* ---------- Linux section ---------- */

function LinuxSection() {
  const pm = useDocPm()
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
      <MultiTerminal tabs={DEV_TABS} />
      <MultiTerminal tabs={BUILD_TABS} />

      <Callout>
        <strong>Tip:</strong> Use <C>create-bini-app sign desktop</C> to set up GPG signing for your AppImage.
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
      <ScaffoldBlock isMac />

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
        Open the latest <C>Desktop</C> workflow run.
      </li>
      <li>
        Under <strong className={STRONG}>Artifacts</strong>, download the Linux bundle (or, if a
        release was created, download the <C>.AppImage</C> from the Releases page).
      </li>
    </ol>
  )
}

/* ---------- content ---------- */

function Content() {
  const pm = useDocPm()
  return (
    <>
      <Section id="linux-overview" title="Linux Overview">
        <P className="mb-4">
          Bini.js allows you to build native Linux desktop applications using Tauri v2. Your React
          app is wrapped in a WebKitGTK binary, providing a native experience with full system
          access. The <C>desktop</C> target covers Windows, macOS and Linux from one <C>src-tauri/</C>.
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
        <Callout>
          On Windows or macOS, <C>tauri:dev</C> runs the Windows/macOS desktop app, not the Linux one.
          Use web development while iterating, and let CI build the Linux binary.
        </Callout>
      </Section>

      <Section id="building" title="Building">
        <P className="mb-4">
          Build a distributable Linux application with <C>tauri:build</C>. On Linux this runs
          locally; on Windows and macOS it runs in GitHub Actions (see those sections):
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
          Bini.js supports GPG signing for AppImage and RPM distribution. Create a GPG key and set
          it up with <C>create-bini-app sign</C>. If you only need signing for GitHub Actions, use
          the <C>--ci-only</C> flag.
        </P>

        <H3 className="mt-6 mb-3">Prerequisites</H3>
        <P className="mb-4">
          Signing requires a GPG key. If you do not have one, generate it with{' '}
          <C>gpg --full-gen-key</C>.
        </P>
        <UL>
          <li>Your GPG key ID.</li>
          <li>The passphrase for the key.</li>
        </UL>

        <H3 className="mt-6 mb-3">Local Signing</H3>
        <P className="mb-4">
          To sign the AppImage/RPM locally on your Linux machine, run:
        </P>
        <MultiTerminal tabs={LOCAL_SIGN_TABS} />

        <H3 className="mt-6 mb-3">GitHub Actions Signing</H3>
        <P className="mb-4">
          If you want the GitHub Action runner to sign the AppImage/RPM automatically, you must
          provide the GPG key via GitHub Secrets. Use the <C>--ci-only</C> flag to configure it
          without setting up local signing:
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
          To sign the Linux build in GitHub Actions, you must add your GPG key as a repository secret. <C>bini-deploy</C> does <strong className={STRONG}>not</strong> upload secrets automatically. You must add them manually:
        </P>
        <ol className={OL}>
          <li>
            Go to your repository on GitHub and navigate to <strong className={STRONG}>Settings</strong> &rarr; <strong className={STRONG}>Secrets and variables</strong> &rarr; <strong className={STRONG}>Actions</strong>.
          </li>
          <li>
            Click <strong className={STRONG}>New repository secret</strong>.
          </li>
          <li>
            Add <C>GPG_PRIVATE_KEY</C> with the base64-encoded string of your GPG private key.
          </li>
          <li>
            Add <C>SIGN</C> set to <C>1</C>.
          </li>
          <li>
            Add <C>SIGN_KEY</C> with your GPG key ID.
          </li>
          <li>
            Add <C>APPIMAGETOOL_FORCE_SIGN</C> set to <C>1</C>.
          </li>
          <li>
            Add <C>TAURI_SIGNING_RPM_KEY</C> with your ASCII-armored GPG key text.
          </li>
        </ol>
        <Callout>
          For production distribution, sign your AppImage and publish a checksum alongside it so
          users can verify integrity. Never commit <C>.env.signing</C> or your private key.
        </Callout>
      </Section>

      <Section id="store-submission" title="Store Submission">
        <P className="mb-4">
          Once you have a signed <C>.AppImage</C>, <C>.deb</C>, or <C>.rpm</C>, you can distribute
          it. Depending on your goals, you have four options:
        </P>
        <UL>
          <li>
            <strong className={STRONG}>Direct Download:</strong> Host the <C>.AppImage</C> on your
            website or GitHub Releases. This is the most common option for desktop apps.
          </li>
          <li>
            <strong className={STRONG}>Flathub:</strong> Publish on Flathub for a distro-agnostic
            flatpak package.
          </li>
          <li>
            <strong className={STRONG}>Snap Store:</strong> Publish on the Snap Store for
            Ubuntu-friendly snap packages.
          </li>
          <li>
            <strong className={STRONG}>AUR:</strong> Publish an AUR package for Arch Linux users.
          </li>
        </UL>

        <H3 className="mt-6 mb-3">Flathub</H3>
        <P className="mb-4">
          To publish on Flathub, you need a Flatpak manifest. See the{' '}
          <ExtLink href="https://docs.flathub.org/docs/for-app-authors/submission">
            Flathub submission guide
          </ExtLink>{' '}
          for the specific steps.
        </P>

        <H3 className="mt-6 mb-3">Snap Store</H3>
        <P className="mb-4">
          To publish on the Snap Store, you need a Snapcraft account and a <C>snapcraft.yaml</C>{' '}
          file. See the{' '}
          <ExtLink href="https://snapcraft.io/docs/releasing-your-app">
            Snapcraft publishing guide
          </ExtLink>{' '}
          for the specific steps.
        </P>

        <H3 className="mt-6 mb-3">Direct Download</H3>
        <P className="mb-4">
          If you are distributing directly, upload the signed <C>.AppImage</C> or <C>.deb</C> from{' '}
          <C>src-tauri/target/release/bundle/</C> to your website or GitHub Releases. Users can then
          download and install the app manually.
        </P>

        <H3 className="mt-6 mb-3">AUR</H3>
        <P className="mb-4">
          Arch Linux users can install from the Arch User Repository (AUR). Create a{' '}
          <C>PKGBUILD</C> and submit it to the{' '}
          <ExtLink href="https://aur.archlinux.org/">AUR</ExtLink>.
        </P>

        <Callout>
          <strong>Tip:</strong> For direct download, always sign your AppImage. Unsigned binaries
          may trigger security warnings or be rejected by some package managers.
        </Callout>
      </Section>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link to="/docs/platform-windows" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Windows</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Build a native Windows app with Authenticode signing and NSIS/MSI installers.</p>
        </Link>
        <Link to="/docs/platform-macos" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">macOS</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Build a native macOS app with Developer ID signing and notarization.</p>
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