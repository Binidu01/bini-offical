// src/app/plugins/bini-native/page.tsx
import {
  Callout,
  C,
  CodeBlock,
  MultiTerminal,
  P,
  Section,
  Table,
  UL,
} from '../../components/DocBlocks'
import { FolderVisual } from '../../components/DocVisuals'
import { PluginPage } from '../../components/PluginPage'
import type { TocItem } from '../../components/TableOfContents'

const TOC_ITEMS: TocItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'installation', label: 'Installation' },
  { id: 'how-it-works', label: 'How it works' },
  { id: 'supported-plugins', label: 'Supported plugins' },
  { id: 'platform-notes', label: 'Platform notes' },
  { id: 'ci-production', label: 'CI / production' },
]

const EDIT_URL =
  'https://github.com/Binidu01/bini-official/edit/main/src/app/plugins/bini-native/page.tsx'

const H3_CLS = 'mb-3 mt-8 text-base font-semibold text-neutral-900 dark:text-neutral-200'

export default function BiniNativePage() {
  return (
    <PluginPage
      title="bini-native"
      badge="Official"
      description="Automatic Tauri native wiring for Bini.js. Import one Vite plugin. Never touch src-tauri/ by hand again."
      url="https://bini.js.org/plugins/bini-native"
      editUrl={EDIT_URL}
      toc={TOC_ITEMS}
      prev={{ to: '/plugins/bini-env', title: 'bini-env' }}
      next={{ to: '/plugins/bini-server', title: 'bini-server' }}
    >
      <Section id="overview" title="Overview">
        <P>
          <C>bini-native</C> detects which native APIs your source uses and wires Tauri for you -
          Cargo deps, plugin registration, capabilities, and mobile permissions. Write normal web
          APIs; they work in the browser and the native shell.
        </P>
      </Section>

      <Section id="installation" title="Installation">
        <MultiTerminal
          tabs={[
            { id: 'npm', label: 'npm', command: `$ npm install -D bini-native` },
            { id: 'pnpm', label: 'pnpm', command: `$ pnpm add -D bini-native` },
            { id: 'yarn', label: 'yarn', command: `$ yarn add -D bini-native` },
            { id: 'bun', label: 'bun', command: `$ bun add -d bini-native` },
          ]}
        />
        <CodeBlock
          filename="vite.config.ts"
          lang="js"
          code={`import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { biniNative } from 'bini-native'

export default defineConfig({
  plugins: [react(), biniNative()],
})`}
        />
        <P>
          Run <C>tauri dev</C>. Wiring is written to <C>src-tauri/</C> and stays on disk for later
          builds.
        </P>
      </Section>

      <Section id="how-it-works" title="How it works">
        <Table
          headers={['Mode', 'What happens']}
          rows={[
            [
              'tauri dev',
              'Detects APIs and wires src-tauri/ (Cargo, lib.rs, capabilities, manifests)',
            ],
            ['tauri build', 'No-op - compiles whatever is already on disk'],
          ]}
        />
        <Callout>
          Run <C>tauri dev</C> at least once (and again after adding a new native API) before{' '}
          <C>tauri build</C>. A fresh checkout is not wired until you do.
        </Callout>
        <P>Detection is usage-based (regex + AST import scan):</P>
        <Table
          headers={['You write', 'Wires']}
          rows={[
            ['showOpenFilePicker / showSaveFilePicker', 'dialog (+ filesystem)'],
            ['navigator.clipboard.*', 'clipboard'],
            ['new Notification(...)', 'notification'],
            ['navigator.geolocation.*', 'geolocation'],
            ['registerGlobalShortcut / setAutoStart', 'desktop-only plugins'],
            ['window.biniStore.*', 'store'],
            ["import from '@tauri-apps/plugin-*'", 'that plugin'],
          ]}
        />
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

      <Section id="supported-plugins" title="Supported plugins">
        <Table
          headers={['Feature', 'API', 'Platform']}
          rows={[
            ['Dialog', 'showOpenFilePicker / showSaveFilePicker', 'All'],
            ['Clipboard', 'navigator.clipboard', 'All'],
            ['Notifications', 'new Notification(...)', 'All'],
            ['Filesystem', '@tauri-apps/plugin-fs', 'All'],
            ['Geolocation', 'navigator.geolocation', 'Android, iOS, macOS'],
            ['Store', 'window.biniStore.*', 'All'],
            [
              'Global shortcut / Autostart',
              'registerGlobalShortcut / setAutoStart',
              'Desktop only',
            ],
            ['Camera / mic', 'getUserMedia(...)', 'All (webview)'],
          ]}
        />
        <h3 className={H3_CLS}>Example</h3>
        <CodeBlock
          filename="src/app/settings/page.tsx"
          lang="js"
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
      </Section>

      <Section id="platform-notes" title="Platform notes">
        <UL>
          <li>
            <strong>Windows notifications in dev</strong> - unpackaged <C>tauri dev</C> has no
            AUMID; use an installed <C>tauri build</C> to test.
          </li>
          <li>
            <strong>Geolocation</strong> - wired everywhere if used, but only works on Android,
            iOS, and macOS.
          </li>
          <li>
            <strong>Autostart / global shortcuts</strong> - desktop-only; mobile builds skip them
            via <C>#[cfg(desktop)]</C>.
          </li>
        </UL>
      </Section>

      <Section id="ci-production" title="CI / production">
        <P>
          Commit wired <C>src-tauri/</C> after a local <C>tauri dev</C>, or run a short-lived{' '}
          <C>tauri dev</C> in CI before <C>tauri build</C>. The plugin never runs during the build
          step itself.
        </P>
      </Section>
    </PluginPage>
  )
}