// src/app/docs/platform-android.tsx
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
  useDocPm,
  type TerminalTab,
} from '../../components/DocBlocks'
import { FeatureCard } from '../../components/DocVisuals'
import type { TocItem } from '../../components/TableOfContents'

const TOC_ITEMS: TocItem[] = [
  { id: 'android-overview', label: 'Android Overview' },
  { id: 'requirements', label: 'Requirements' },
  { id: 'create-project', label: 'Create Project' },
  { id: 'development', label: 'Development' },
  { id: 'building', label: 'Building' },
  { id: 'code-signing', label: 'Code Signing' },
  { id: 'deployment', label: 'Deployment' },
  { id: 'store-submission', label: 'Store Submission' },
]

const OL =
  'mb-6 list-decimal space-y-2 pl-5 text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400'

const STRONG = 'font-medium text-neutral-900 dark:text-neutral-100'

const JAVA_URL = 'https://adoptium.net/temurin/releases/?version=17'
const ANDROID_STUDIO_URL = 'https://developer.android.com/studio'
const RUSTUP_URL = 'https://rustup.rs/'

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
    `$ ${CREATE[pm]} my-app --platform android`,
    '$ cd my-app',
    pm === 'npm' ? '$ npm install' : pm === 'bun' ? '$ bun install' : `$ ${pm} install`,
  ].join('\n')
)

const INTERACTIVE_TABS = tabs((pm) => `$ ${CREATE[pm]}`)

const DEV_TABS = tabs((pm) => `$ ${run(pm, 'android')}`)
const BUILD_TABS = tabs((pm) => `$ ${run(pm, 'android:build')}`)
const DEPLOY_TABS = tabs((pm) => `$ ${run(pm, 'deploy')}`)
const LOCAL_SIGN_TABS = tabs((pm) => `$ ${RUNNER[pm]} create-bini-app sign android`)
const CI_SIGN_TABS = tabs((pm) => `$ ${RUNNER[pm]} create-bini-app sign android --ci-only`)

/* ---------- content ---------- */

function Content() {
  const pm = useDocPm()

  return (
    <>
      <Section id="android-overview" title="Android Overview">
        <P className="mb-4">
          Bini.js builds native Android applications on top of Tauri v2. Your React app runs inside
          a native Android WebView with full access to system APIs, permissions, and platform
          features.
        </P>
        <div className="grid gap-3 sm:grid-cols-3">
          <FeatureCard title="Native APK / AAB" text="APK for direct install, AAB for Play Store" />
          <FeatureCard title="Code Signing" text="Keystore signing wired in at scaffold time" />
          <FeatureCard title="Auto Plugin Wiring" text="bini-native wires Android permissions" />
        </div>
        <Callout>
          Android builds use Tauri's Android backend. Your app runs in a native WebView with full
          system access.
        </Callout>
      </Section>

      <Section id="requirements" title="Requirements">
        <P className="mb-4">
          Building Android apps requires the same toolchain on every desktop OS (Windows, macOS,
          and Linux). The only differences are the paths to your SDK and minor device drivers.
        </P>
        <UL>
          <li>
            Node.js <strong className={STRONG}>20.19.0</strong> or higher
          </li>
          <li>
            Java JDK 17 - <ExtLink href={JAVA_URL}>Download (Eclipse Temurin)</ExtLink>, then set{' '}
            <C>JAVA_HOME</C>
          </li>
          <li>
            Android Studio - <ExtLink href={ANDROID_STUDIO_URL}>Download</ExtLink>. Install the SDK,
            Build Tools, and NDK, then set <C>ANDROID_HOME</C>.
          </li>
          <li>
            Rust via <ExtLink href={RUSTUP_URL}>rustup</ExtLink>. Tauri automatically adds the
            required Android targets for you.
          </li>
        </UL>
        <Callout>
          <C>ANDROID_HOME</C> points to your SDK path - <C>~/Library/Android/sdk</C> on macOS,{' '}
          <C>~/Android/Sdk</C> on Linux, or <C>%USERPROFILE%\AppData\Local\Android\Sdk</C> on
          Windows.
        </Callout>
      </Section>

      <Section id="create-project" title="Create Project">
        <P className="mb-4">
          Create a new Bini.js project targeting Android and install its dependencies:
        </P>
        <MultiTerminal tabs={CREATE_AND_INSTALL_TABS} />
        <P className="mb-4">
          Or run the interactive prompt and select <C>Android</C>:
        </P>
        <MultiTerminal tabs={INTERACTIVE_TABS} />
        <ClackTerminal copyText={`? Platforms? Android`}>
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
              <span className="text-green-500 dark:text-green-400">◼</span>{' '}
              <span className="text-neutral-900 dark:text-neutral-100">Android</span>
            </div>
            <div className="flex gap-1.5">
              <span className="text-neutral-500">◻</span>{' '}
              <span className="text-neutral-500">iOS</span>
            </div>
            <div className="mt-2 text-[11px] text-neutral-500">
              ↑/↓ to navigate • Space: select • Enter: confirm
            </div>
          </ClackPrompt>
        </ClackTerminal>
        <Callout>
          <strong>Tip:</strong> Pass <C>--app-name "My App"</C> and <C>--org com.acme</C> to skip the
          native naming prompts.
        </Callout>
      </Section>

      <Section id="development" title="Development">
        <P className="mb-4">
          Run your Android app on an emulator or a connected device. This works the same on every
          desktop OS:
        </P>
        <MultiTerminal tabs={DEV_TABS} />
        <P className="mb-4">This launches your app with:</P>
        <UL>
          <li>Hot reload for frontend changes</li>
          <li>Native Android integration</li>
          <li>
            Auto-wired native APIs via <C>bini-native</C>
          </li>
          <li>Devtools for debugging</li>
        </UL>

        <H3 className="mt-6 mb-3">Setting Up an Emulator</H3>
        <ol className={OL}>
          <li>Open Android Studio</li>
          <li>
            Go to <strong className={STRONG}>AVD Manager</strong>
          </li>
          <li>Create a virtual device</li>
          <li>Start the emulator</li>
          <li>
            Run <C>{run(pm, 'android')}</C>
          </li>
        </ol>

        <Callout>
          <strong>Platform notes:</strong> On Windows, install USB drivers for your device. On
          Linux, install the udev rules so <C>adb</C> can detect connected phones. On macOS, add the
          Android SDK platform-tools directory to your <C>PATH</C> so <C>adb</C> is available.
        </Callout>
      </Section>

      <Section id="building" title="Building">
        <P className="mb-4">Build a release APK or AAB for distribution:</P>
        <MultiTerminal tabs={BUILD_TABS} />
        <P className="mb-4">
          The build outputs land in <C>src-tauri/gen/android/app/build/outputs/</C>:
        </P>
        <Table
          headers={['Output', 'Purpose']}
          rows={[
            [
              <C key="apk">app-release.apk</C>,
              'Direct installation on a device (sideloading, internal testing).',
            ],
            [
              <C key="aab">app-release.aab</C>,
              'Android App Bundle for publishing to the Google Play Store.',
            ],
          ]}
        />
        <Callout>
          The output is a native Android app that runs on Android 5.0 (API 21) and above.
        </Callout>
      </Section>

      <Section id="code-signing" title="Code Signing">
        <P className="mb-4">
          Bini.js supports keystore signing for Android binaries. Set it up or redo it at any time
          with <C>create-bini-app sign android</C>. If you only need signing for GitHub Actions, use
          the <C>--ci-only</C> flag.
        </P>

        <H3 className="mt-6 mb-3">Prerequisites</H3>
        <P className="mb-4">
          Signing requires a Java keystore. If you do not have one, you can generate it with{' '}
          <C>keytool</C> or Android Studio's "Generate Signed Bundle / APK" wizard.
        </P>
        <UL>
          <li>A <C>.jks</C>, <C>.keystore</C>, or <C>.p12</C> keystore file.</li>
          <li>The key alias.</li>
          <li>The key password and keystore password.</li>
        </UL>

        <H3 className="mt-6 mb-3">Local Signing</H3>
        <P className="mb-4">
          To sign the APK/AAB locally on your machine, provide your keystore, its alias, and its
          passwords:
        </P>
        <MultiTerminal tabs={LOCAL_SIGN_TABS} />
        <P className="mb-4">
          This creates a <C>keystore.properties</C> file inside <C>src-tauri/gen/android/</C> and
          patches the Gradle signing config for you:
        </P>
        <CodeBlock
          filename="keystore.properties"
          code={`storeFile=my-keystore.keystore
storePassword=your-keystore-password
keyAlias=my-key-alias
keyPassword=your-key-password`}
        />

        <H3 className="mt-6 mb-3">GitHub Actions Signing</H3>
        <P className="mb-4">
          If you want the GitHub Action runner to sign the APK/AAB automatically, you must provide
          the keystore via GitHub Secrets. Use the <C>--ci-only</C> flag to configure it without
          setting up local signing:
        </P>
        <MultiTerminal tabs={CI_SIGN_TABS} />

        <H3 className="mt-6 mb-3">Adding Secrets Manually</H3>
        <P className="mb-4">
          To sign the Android build in GitHub Actions, you must add your keystore as repository
          secrets. <C>bini-deploy</C> does <strong className={STRONG}>not</strong> upload secrets
          automatically. You must add them manually:
        </P>
        <ol className={OL}>
          <li>
            Go to your repository on GitHub and navigate to{' '}
            <strong className={STRONG}>Settings</strong> &rarr;{' '}
            <strong className={STRONG}>Secrets and variables</strong> &rarr;{' '}
            <strong className={STRONG}>Actions</strong>.
          </li>
          <li>
            Click <strong className={STRONG}>New repository secret</strong>.
          </li>
          <li>
            Add <C>ANDROID_KEY_BASE64</C> with the base64-encoded string of your <C>.jks</C> or{' '}
            <C>.keystore</C> file.
          </li>
          <li>
            Add <C>ANDROID_KEY_ALIAS</C> with your key alias.
          </li>
          <li>
            Add <C>ANDROID_KEY_PASSWORD</C> with your key password.
          </li>
          <li>
            Add <C>ANDROID_KEYSTORE_PASSWORD</C> with your keystore password.
          </li>
        </ol>
        <Callout>
          For Google Play Store distribution, your app must be signed with a keystore. Keep the
          keystore secure and never commit it to version control.
        </Callout>
      </Section>

      <Section id="deployment" title="Deployment">
        <P className="mb-4">
          You can build the APK/AAB locally using <C>{run(pm, 'android:build')}</C>, or let GitHub
          Actions build it for you by running <C>{run(pm, 'deploy')}</C>.
        </P>

        <H3 className="mt-6 mb-3">Deploying via GitHub Actions</H3>
        <P className="mb-4">
          <C>{run(pm, 'deploy')}</C> generates <C>.github/workflows/android.yml</C> and pushes
          your project to GitHub:
        </P>
        <MultiTerminal tabs={DEPLOY_TABS} />
        <ClackTerminal
          copyText={`? Platforms? Android\n? GitHub repository URL? https://github.com/you/my-app\n? Branch to push to? main (default)\n? No .env.signing found. Run create-bini-app sign now? Yes\n? Sign Android for GitHub Actions? Yes\n? Generate deployment files and push to GitHub? Yes\n? Commit message (press Enter for the default): chore: add deployment configuration`}
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
              <span className="text-green-500 dark:text-green-400">◼</span>{' '}
              <span className="text-neutral-900 dark:text-neutral-100">Android</span>
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

          <ClackPrompt type="select" title="Sign Android for GitHub Actions?">
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

        <H3 className="mt-6 mb-3">Deployment Flow</H3>
        <ol className={OL}>
          <li>
            Run <C>{run(pm, 'deploy')}</C> to generate the CI workflow and push to GitHub.
          </li>
          <li>
            GitHub Actions builds the signed APK/AAB (if secrets are set) and attaches it to the run
            as an artifact.
          </li>
          <li>Download the artifact and upload it to the Google Play Console manually.</li>
        </ol>
      </Section>

      <Section id="store-submission" title="Store Submission">
        <P className="mb-4">
          Once you have a signed <C>.apk</C> or <C>.aab</C>, you can distribute it. Depending on
          your goals, you have three options:
        </P>
        <UL>
          <li>
            <strong className={STRONG}>Direct Download (APK):</strong> Host the <C>.apk</C> on your
            website or GitHub Releases. This is common for beta testing, internal apps, and
            sideloading.
          </li>
          <li>
            <strong className={STRONG}>Google Play Store:</strong> Submit the <C>.aab</C> to the
            Google Play Console.
          </li>
          <li>
            <strong className={STRONG}>F-Droid:</strong> Publish on F-Droid for an open-source,
            community-driven app store.
          </li>
        </UL>

        <H3 className="mt-6 mb-3">Google Play Store</H3>
        <P className="mb-4">
          To publish on the Google Play Store, you need a Google Play Developer account. Upload the
          signed <C>.aab</C> from <C>src-tauri/gen/android/app/build/outputs/bundle/release/</C> in
          the Play Console. See the{' '}
          <ExtLink href="https://support.google.com/googleplay/android-developer/answer/9859152">
            Google Play Console guide
          </ExtLink>{' '}
          for the specific steps.
        </P>

        <H3 className="mt-6 mb-3">Direct Download (APK)</H3>
        <P className="mb-4">
          If you are distributing directly (e.g., for internal testing), upload the signed{' '}
          <C>.apk</C> from <C>src-tauri/gen/android/app/build/outputs/apk/release/</C> to your
          website or GitHub Releases. Users must enable "Install from unknown sources" on their
          device to sideload it.
        </P>

        <H3 className="mt-6 mb-3">F-Droid</H3>
        <P className="mb-4">
          For open-source apps, you can submit your project to F-Droid. See the{' '}
          <ExtLink href="https://f-droid.org/en/docs/Submitting_to_F-Droid_Quick_Start_Guide/">
            F-Droid submission guide
          </ExtLink>{' '}
          for the specific steps.
        </P>

        <Callout>
          <strong>Tip:</strong> Google Play requires a signed <C>.aab</C>, not a <C>.apk</C>. The
          `.apk` is only for direct download and sideloading.
        </Callout>
      </Section>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link to="/docs/platform-ios" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">iOS</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Build a native iOS app with App Store distribution and TestFlight.</p>
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

export default function PlatformAndroidPage() {
  return (
    <DocPage
      title="Android"
      description="Build native Android mobile applications with Bini.js."
      url="https://bini.js.org/docs/platform-android"
      editUrl="https://github.com/Binidu01/bini-official/edit/main/src/app/docs/platform-android.tsx"
      toc={TOC_ITEMS}
      prev={{ to: '/docs/platform-linux', title: 'Linux' }}
      next={{ to: '/docs/platform-ios', title: 'iOS' }}
    >
      <Content />
    </DocPage>
  )
}