// src/app/docs/platform-android.tsx
import {
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
  Table,
  UL,
  type TerminalTab,
} from '../../components/DocBlocks'
import { FeatureCard } from '../../components/DocVisuals'
import type { TocItem } from '../../components/TableOfContents'

const TOC_ITEMS: TocItem[] = [
  { id: 'android-overview', label: 'Android Overview' },
  { id: 'requirements', label: 'Requirements' },
  { id: 'windows', label: 'Windows' },
  { id: 'macos', label: 'macOS' },
  { id: 'linux', label: 'Linux' },
  { id: 'development', label: 'Development' },
  { id: 'building', label: 'Building' },
  { id: 'code-signing', label: 'Code Signing' },
  { id: 'deployment', label: 'Deployment' },
]

const OL =
  'mb-6 list-decimal space-y-2 pl-5 text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400'

const STRONG = 'font-medium text-neutral-900 dark:text-neutral-100'

const JAVA_URL = 'https://adoptium.net/temurin/releases/?version=17'
const ANDROID_STUDIO_URL = 'https://developer.android.com/studio'
const RUSTUP_URL = 'https://rustup.rs/'

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
    command: `$ npx create-bini-app@latest my-app --platform android
$ cd my-app
$ npm install`,
  },
  {
    id: 'pnpm',
    label: 'pnpm',
    command: `$ pnpm dlx create-bini-app@latest my-app --platform android
$ cd my-app
$ pnpm install`,
  },
  {
    id: 'yarn',
    label: 'yarn',
    command: `$ yarn dlx create-bini-app@latest my-app --platform android
$ cd my-app
$ yarn install`,
  },
  {
    id: 'bun',
    label: 'bun',
    command: `$ bunx create-bini-app@latest my-app --platform android
$ cd my-app
$ bun install`,
  },
]

const DEV_TABS: TerminalTab[] = [
  { id: 'npm', label: 'npm', command: `$ npm run android` },
  { id: 'pnpm', label: 'pnpm', command: `$ pnpm android` },
  { id: 'yarn', label: 'yarn', command: `$ yarn android` },
  { id: 'bun', label: 'bun', command: `$ bun run android` },
]

const BUILD_TABS: TerminalTab[] = [
  { id: 'npm', label: 'npm', command: `$ npm run android:build` },
  { id: 'pnpm', label: 'pnpm', command: `$ pnpm android:build` },
  { id: 'yarn', label: 'yarn', command: `$ yarn android:build` },
  { id: 'bun', label: 'bun', command: `$ bun run android:build` },
]

const DEPLOY_TABS: TerminalTab[] = [
  { id: 'npm', label: 'npm', command: `$ npm run deploy` },
  { id: 'pnpm', label: 'pnpm', command: `$ pnpm deploy` },
  { id: 'yarn', label: 'yarn', command: `$ yarn deploy` },
  { id: 'bun', label: 'bun', command: `$ bun run deploy` },
]

const SIGN_TABS: TerminalTab[] = [
  {
    id: 'npm',
    label: 'npm',
    command: `$ npx create-bini-app@latest my-app --platform android --sign`,
  },
  {
    id: 'pnpm',
    label: 'pnpm',
    command: `$ pnpm dlx create-bini-app@latest my-app --platform android --sign`,
  },
  {
    id: 'yarn',
    label: 'yarn',
    command: `$ yarn dlx create-bini-app@latest my-app --platform android --sign`,
  },
  {
    id: 'bun',
    label: 'bun',
    command: `$ bunx create-bini-app@latest my-app --platform android --sign`,
  },
]

const RUST_TARGET_TABS: TerminalTab[] = [
  {
    id: 'rustup',
    label: 'rustup',
    command: `$ rustup target add aarch64-linux-android
$ rustup target add armv7-linux-androideabi
$ rustup target add i686-linux-android
$ rustup target add x86_64-linux-android`,
  },
]

/* ---------- shared "create project" block ---------- */

function ScaffoldBlock() {
  return (
    <>
      <H3 className="mt-6 mb-3">Create the Project</H3>
      <P className="mb-4">
        Create a new Bini.js project targeting Android and install its dependencies:
      </P>
      <MultiTerminal tabs={CREATE_AND_INSTALL_TABS} />
      <P className="mb-4">
        Or use the interactive prompt and select <C>Android</C>:
      </P>
      <MultiTerminal tabs={INTERACTIVE_TABS} />
      <PromptOutput
        lines={[
          { kind: 'question', text: 'Select target platform:' },
          { kind: 'option', text: 'Web Application' },
          { kind: 'option', text: 'Windows Desktop' },
          { kind: 'option', text: 'Linux Desktop' },
          { kind: 'option', text: 'macOS Desktop' },
          { kind: 'option', text: 'Android', selected: true },
          { kind: 'option', text: 'iOS' },
          { kind: 'blank' },
          { kind: 'hint', text: '↑↓ navigate • ⏎ select' },
        ]}
      />
    </>
  )
}

/* ---------- Windows / macOS / Linux sections ---------- */

function WindowsSection() {
  return (
    <Section id="windows" title="Windows">
      <P className="mb-4">
        Android apps can be built natively on Windows - Tauri's Android toolchain runs locally on
        all three desktop OSes.
      </P>

      <H3 className="mt-6 mb-3">Step 1: Install the tools</H3>
      <UL>
        <li>
          Node.js <C>20.19.0</C> or higher
        </li>
        <li>
          Java JDK 17 - <ExtLink href={JAVA_URL}>Download (Eclipse Temurin)</ExtLink>, then set{' '}
          <C>JAVA_HOME</C>
        </li>
        <li>
          Android Studio - <ExtLink href={ANDROID_STUDIO_URL}>Download</ExtLink>. Install the SDK,
          Build Tools, and NDK.
        </li>
        <li>
          Set <C>ANDROID_HOME</C> to <C>%USERPROFILE%\AppData\Local\Android\Sdk</C>
        </li>
        <li>
          Rust via <ExtLink href={RUSTUP_URL}>rustup</ExtLink>, then add the Android targets (see
          Requirements)
        </li>
      </UL>

      <H3 className="mt-6 mb-3">Step 2: Create the project</H3>
      <ScaffoldBlock />

      <H3 className="mt-6 mb-3">Step 3: Develop and build</H3>
      <P className="mb-4">
        Run <C>android</C> to launch on an emulator or connected device, then <C>android:build</C>{' '}
        to produce a release APK/AAB:
      </P>
      <MultiTerminal tabs={DEV_TABS} />
      <MultiTerminal tabs={BUILD_TABS} />

      <Callout>
        <strong>Tip:</strong> Install USB drivers for your device if deploying to a physical phone.
      </Callout>
    </Section>
  )
}

function MacosSection() {
  return (
    <Section id="macos" title="macOS">
      <P className="mb-4">
        Android apps can be built natively on macOS - Tauri's Android toolchain runs locally on all
        three desktop OSes.
      </P>

      <H3 className="mt-6 mb-3">Step 1: Install the tools</H3>
      <UL>
        <li>
          Node.js <C>20.19.0</C> or higher
        </li>
        <li>
          Java JDK 17 - <ExtLink href={JAVA_URL}>Download (Eclipse Temurin)</ExtLink>, then set{' '}
          <C>JAVA_HOME</C>
        </li>
        <li>
          Android Studio - <ExtLink href={ANDROID_STUDIO_URL}>Download</ExtLink>. Install the SDK,
          Build Tools, and NDK.
        </li>
        <li>
          Set <C>ANDROID_HOME</C> to <C>~/Library/Android/sdk</C>
        </li>
        <li>
          Rust via <ExtLink href={RUSTUP_URL}>rustup</ExtLink>, then add the Android targets (see
          Requirements)
        </li>
      </UL>

      <H3 className="mt-6 mb-3">Step 2: Create the project</H3>
      <ScaffoldBlock />

      <H3 className="mt-6 mb-3">Step 3: Develop and build</H3>
      <P className="mb-4">
        Run <C>android</C> to launch on an emulator or connected device, then <C>android:build</C>{' '}
        to produce a release APK/AAB:
      </P>
      <MultiTerminal tabs={DEV_TABS} />
      <MultiTerminal tabs={BUILD_TABS} />

      <Callout>
        <strong>Tip:</strong> Add the Android SDK platform-tools directory to your <C>PATH</C> so{' '}
        <C>adb</C> is available from the terminal.
      </Callout>
    </Section>
  )
}

function LinuxSection() {
  return (
    <Section id="linux" title="Linux">
      <P className="mb-4">
        Android apps can be built natively on Linux - Tauri's Android toolchain runs locally on all
        three desktop OSes.
      </P>

      <H3 className="mt-6 mb-3">Step 1: Install the tools</H3>
      <UL>
        <li>
          Node.js <C>20.19.0</C> or higher
        </li>
        <li>
          Java JDK 17 - <ExtLink href={JAVA_URL}>Download (Eclipse Temurin)</ExtLink>, then set{' '}
          <C>JAVA_HOME</C>
        </li>
        <li>
          Android Studio - <ExtLink href={ANDROID_STUDIO_URL}>Download</ExtLink>. Install the SDK,
          Build Tools, and NDK.
        </li>
        <li>
          Set <C>ANDROID_HOME</C> to <C>~/Android/Sdk</C>
        </li>
        <li>
          Rust via <ExtLink href={RUSTUP_URL}>rustup</ExtLink>, then add the Android targets (see
          Requirements)
        </li>
      </UL>

      <H3 className="mt-6 mb-3">Step 2: Create the project</H3>
      <ScaffoldBlock />

      <H3 className="mt-6 mb-3">Step 3: Develop and build</H3>
      <P className="mb-4">
        Run <C>android</C> to launch on an emulator or connected device, then <C>android:build</C>{' '}
        to produce a release APK/AAB:
      </P>
      <MultiTerminal tabs={DEV_TABS} />
      <MultiTerminal tabs={BUILD_TABS} />

      <Callout>
        <strong>Tip:</strong> Install the udev rules for your device - otherwise <C>adb</C> may not
        detect connected phones.
      </Callout>
    </Section>
  )
}

/* ---------- content ---------- */

function Content() {
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
          Building Android apps requires the same toolchain on every desktop OS. See the section
          for your OS below for exact setup steps.
        </P>
        <Table
          headers={['Dependency', 'Version / Notes']}
          rows={[
            ['Node.js', <>20.19.0 or higher</>],
            [
              'Java JDK',
              <>
                17 - <ExtLink href={JAVA_URL}>Download (Eclipse Temurin)</ExtLink>, then set{' '}
                <C>JAVA_HOME</C>
              </>,
            ],
            [
              'Android Studio',
              <>
                SDK, Build Tools, and NDK -{' '}
                <ExtLink href={ANDROID_STUDIO_URL}>Download</ExtLink>, then set{' '}
                <C>ANDROID_HOME</C>
              </>,
            ],
            [
              'Rust targets',
              <>
                <C>aarch64-linux-android</C>, <C>armv7-linux-androideabi</C>,{' '}
                <C>i686-linux-android</C>, <C>x86_64-linux-android</C>
              </>,
            ],
          ]}
        />
        <P className="mb-4">Add the required Rust targets with rustup:</P>
        <MultiTerminal tabs={RUST_TARGET_TABS} />
        <Callout>
          <C>ANDROID_HOME</C> points to your SDK path - <C>~/Library/Android/sdk</C> on macOS,{' '}
          <C>~/Android/Sdk</C> on Linux, or <C>%USERPROFILE%\AppData\Local\Android\Sdk</C> on
          Windows.
        </Callout>
      </Section>

      <WindowsSection />
      <MacosSection />
      <LinuxSection />

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
            Run <C>npm run android</C>
          </li>
        </ol>
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
          Configure keystore signing at scaffold time or later. Create a <C>keystore.properties</C>{' '}
          file inside <C>src-tauri/gen/android/</C>:
        </P>
        <CodeBlock
          filename="keystore.properties"
          code={`storeFile=my-keystore.keystore
storePassword=your-keystore-password
keyAlias=my-key-alias
keyPassword=your-key-password`}
        />
        <P className="mb-4">
          Or pass <C>--sign</C> at scaffold time to set signing up automatically:
        </P>
        <MultiTerminal tabs={SIGN_TABS} />
        <Callout>
          For Google Play Store distribution, your app must be signed with a keystore. Keep the
          keystore secure and never commit it to version control.
        </Callout>
      </Section>

      <Section id="deployment" title="Deployment">
        <P className="mb-4">
          <C>npm run deploy</C> pushes your project source to GitHub - it does <strong>not</strong>{' '}
          build a signed APK or submit to the Play Store:
        </P>
        <MultiTerminal tabs={DEPLOY_TABS} />

        <H3 className="mt-6 mb-3">Deployment Flow</H3>
        <ol className={OL}>
          <li>
            Build your release APK/AAB with <C>npm run android:build</C>
          </li>
          <li>
            Run <C>npm run deploy</C> to push source to GitHub
          </li>
          <li>Upload the APK/AAB to the Google Play Console manually</li>
        </ol>

        <Callout>
          Store submission is manual. After building your APK/AAB, upload it to the Google Play
          Console for distribution.
        </Callout>
      </Section>
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