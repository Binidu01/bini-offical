// src/app/plugins/bini-native/page.tsx
import {
  C,
  Callout,
  CodeBlock,
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
  { id: 'requirements', label: 'Requirements' },
  { id: 'install', label: 'Install' },
  { id: 'quick-start', label: 'Quick Start' },
  { id: 'supported-plugins', label: 'Supported Plugins' },
  { id: 'manual-setup', label: 'Manual Setup' },
  { id: 'platform-notes', label: 'Platform Notes' },
  { id: 'ci-production', label: 'CI / Production' },
]

const EDIT_URL =
  'https://github.com/Binidu01/bini-official/edit/main/src/app/plugins/bini-native/page.tsx'

/* ---- package-manager tab helpers ---------------------------------- */

const PMS = ['npm', 'pnpm', 'yarn', 'bun'] as const
type Pm = (typeof PMS)[number]

const INSTALL: Record<Pm, string> = {
  npm: 'npm install -D bini-native',
  pnpm: 'pnpm add -D bini-native',
  yarn: 'yarn add -D bini-native',
  bun: 'bun add -d bini-native',
}

const tabs = (cmd: (pm: Pm) => string): TerminalTab[] =>
  PMS.map((pm) => ({ id: pm, label: pm, command: cmd(pm) }))

export default function BiniNativePage() {
  return (
    <PluginPage
      title="bini-native"
      badge="Official"
      description="Automatic Tauri native wiring for Bini.js. Stop hand-editing src-tauri/ for common plugins."
      url="https://www.npmjs.com/package/bini-native"
      editUrl={EDIT_URL}
      toc={TOC_ITEMS}
      prev={{ to: '/plugins/bini-env', title: 'bini-env' }}
      next={{ to: '/plugins/bini-server', title: 'bini-server' }}
    >
      <Section id="overview" title="Overview">
        <P>
          <C>bini-native</C> scans your frontend source, works out which native capabilities your
          app uses, and wires up the Tauri side during <C>tauri dev</C>. It installs the matching
          npm packages, adds the Rust plugin crates, scaffolds capability files, and injects
          runtime polyfills so standard web APIs (like <C>navigator.clipboard</C> or{' '}
          <C>new Notification()</C>) automatically route to the native plugin when the app runs
          inside Tauri.
        </P>
        <P>
          In a normal browser, the polyfills do nothing. They only run when the app is opened
          inside a Tauri native shell.
        </P>
      </Section>

      <Section id="requirements" title="Requirements">
        <UL>
          <li>A Tauri v2 project with <C>src-tauri/</C></li>
          <li>
            An entry file in <C>src/</C> (like <C>src/main.tsx</C>)
          </li>
          <li>
            Vite <C>{'>='} 8.0.0</C> (peer dependency)
          </li>
          <li>
            <C>bini-router</C> <C>{'>='} 2</C> (peer dependency)
          </li>
          <li>
            <C>cargo</C> on your PATH
          </li>
        </UL>
      </Section>

      <Section id="install" title="Install">
        <MultiTerminal tabs={tabs((pm) => `$ ${INSTALL[pm]}`)} />
        <P>
          Register it in your Bini.js config. <C>biniNative()</C> takes no options.
        </P>
        <CodeBlock
          filename="vite.config.ts"
          code={`import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { biniNative } from 'bini-native'

export default defineConfig({
  plugins: [react(), biniNative()],
})`}
        />
      </Section>

      <Section id="quick-start" title="Quick Start">
        <P>
          Run <C>tauri dev</C>. Wiring is written directly to <C>src-tauri/</C> and stays on disk
          for later builds.
        </P>
        <Callout>
          <strong>Important:</strong> Run <C>tauri dev</C> at least once (and again after adding a
          new native API) before your first <C>tauri build</C>. On a fresh checkout where{' '}
          <C>tauri dev</C> has never run, <C>tauri build</C> will not wire anything for you.
        </Callout>
        <FolderVisual
          width={280}
          rows={[
            { n: 'src' },
            { n: 'app', d: 1 },
            { n: 'page.tsx', d: 2, dot: true },
            { n: 'src-tauri' },
            { n: 'Cargo.toml', d: 1, dot: true },
            { n: 'lib.rs', d: 1, dot: true },
            { n: 'capabilities/default.json', d: 1, dot: true },
          ]}
        />
      </Section>

      <Section id="supported-plugins" title="Supported Plugins">
        <P>
          A plugin is wired only if your source uses its web API or directly imports its
          corresponding npm package.
        </P>
        <Table
          headers={['Plugin', 'Detected by', 'Platform']}
          rows={[
            ['opener', 'openUrl(...), window.open(...), <a target="_blank">', 'All'],
            ['dialog', 'showOpenFilePicker, showSaveFilePicker', 'All'],
            ['fs', 'readTextFile, writeTextFile, readFile, exists, etc.', 'All'],
            ['clipboard-manager', 'navigator.clipboard.writeText / readText', 'All'],
            ['notification', 'new Notification(...), Notification.requestPermission', 'All'],
            ['os', 'platform, version, arch, type, family, etc.', 'All'],
            ['geolocation', 'navigator.geolocation', 'All'],
            ['http', "fetch('http(s)://…') with a literal URL", 'All'],
            ['store', 'window.biniStore', 'All'],
            ['shell', 'Command.create, Command.sidecar', 'All'],
            ['process', 'exit, relaunch', 'All'],
            ['sql', 'Database.load', 'All'],
            ['global-shortcut', 'registerGlobalShortcut', 'Desktop'],
            ['autostart', 'setAutoStart, isAutoStartEnabled', 'Desktop'],
            ['cli', 'getMatches', 'Desktop'],
            ['haptics', 'navigator.vibrate', 'Mobile'],
          ]}
        />
        <P className="mt-4">
          Plugins like <C>log</C>, <C>websocket</C>, <C>deep-link</C>, <C>updater</C>,{' '}
          <C>window-state</C>, <C>biometric</C>, <C>barcode-scanner</C>, and <C>nfc</C> are
          detected by their package imports (e.g. <C>import ... from '@tauri-apps/plugin-log'</C>).
        </P>

        <H3>Polyfills</H3>
        <P>
          Standard web APIs are automatically routed to the native plugin inside Tauri. You can
          write normal browser code:
        </P>
        <CodeBlock
          filename="src/app/settings/page.tsx"
          code={`export default function Settings() {
  async function copyInvite() {
    await navigator.clipboard.writeText('https://example.com/invite')
  }

  async function openFile() {
    const [handle] = await showOpenFilePicker()
    const file = await handle.getFile()
    console.log(file.name)
  }

  return (
    <>
      <button type="button" onClick={copyInvite}>Copy</button>
      <button type="button" onClick={openFile}>Open file</button>
    </>
  )
}`}
        />
        <Callout>
          <strong>Note:</strong> The dialog polyfill (<C>getFile()</C>) dynamically imports the
          filesystem plugin. If you use it, make sure to import or use the fs plugin somewhere in
          your source (e.g. <C>import &#123; readTextFile &#125; from '@tauri-apps/plugin-fs'</C>)
          so bini-native wires it.
        </Callout>
      </Section>

      <Section id="manual-setup" title="Manual Setup">
        <P>
          <C>bini-native</C> handles package installs and Rust registration, but some plugins
          require manual configuration in your Tauri files:
        </P>
        <Table
          headers={['Plugin', 'What you need to do']}
          rows={[
            ['http', 'Define the allowed URL scopes in your capability file.'],
            [
              'sql',
              'Enable a driver feature (sqlite, mysql, or postgres) for tauri-plugin-sql in Cargo.toml.',
            ],
            [
              'updater',
              'Configure plugins.updater (public key, endpoints) and bundle.createUpdaterArtifacts in tauri.conf.json.',
            ],
            ['cli', 'Define arguments under plugins.cli in tauri.conf.json.'],
            ['deep-link', 'Register schemes and hosts under plugins.deep-link in tauri.conf.json.'],
            [
              'nfc',
              'Enable the NFC capability in Xcode for iOS, and add the Android NFC permission yourself.',
            ],
            [
              'notification, geolocation, haptics, biometric',
              'Add the Android manifest permissions and iOS/macOS Info.plist usage descriptions yourself.',
            ],
          ]}
        />
        <P>
          <C>bini-native</C> will not modify your existing capability files. If you add a new
          plugin later, you must manually add its permissions to your capability JSON.
        </P>
      </Section>

      <Section id="platform-notes" title="Platform Notes">
        <UL>
          <li>
            <strong>Windows notifications in dev</strong> - unpackaged <C>tauri dev</C> builds have
            no Start Menu shortcut or AUMID, so Windows silently denies the permission. Run{' '}
            <C>tauri build</C> and install the result to test notifications properly.
          </li>
          <li>
            <strong>Geolocation</strong> - the official Tauri geolocation plugin only supports
            Android, iOS, and macOS. It is still wired if your source uses it, but the permission
            request will fail on Windows and Linux.
          </li>
          <li>
            <strong>Desktop-only / mobile-only plugins</strong> - these are placed behind{' '}
            <C>#[cfg(...)]</C> and target-conditional Cargo dependencies, so Android and iOS builds
            compile cleanly without the desktop-only crates.
          </li>
        </UL>
      </Section>

      <Section id="ci-production" title="CI / Production">
        <P>
          Because wiring is a dev-only step, a pipeline that only runs <C>tauri build</C> will
          build whatever is committed. You have two options:
        </P>
        <UL>
          <li>
            <strong>Commit the wiring:</strong> Run <C>tauri dev</C> locally, review the changes,
            and commit <C>package.json</C>, your lock file, <C>src-tauri/Cargo.toml</C>,{' '}
            <C>src-tauri/src/lib.rs</C>, the capability files, and the polyfill block in your entry
            file.
          </li>
          <li>
            <strong>Run a short-lived dev command in CI:</strong> Trigger <C>tauri dev</C> in CI
            first, stop it once wiring finishes, and then run <C>tauri build</C>. Slower, but keeps
            generated files out of version control.
          </li>
        </UL>
      </Section>
    </PluginPage>
  )
}