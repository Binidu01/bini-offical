// src/app/plugins/bini-overlay/page.tsx
import {
  C,
  CodeBlock,
  H3,
  MultiTerminal,
  P,
  Section,
  Table,
  UL,
  type TerminalTab,
} from '../../components/DocBlocks'
import { PluginPage } from '../../components/PluginPage'
import type { TocItem } from '../../components/TableOfContents'

const TOC_ITEMS: TocItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'requirements', label: 'Requirements' },
  { id: 'install', label: 'Install' },
  { id: 'quick-start', label: 'Quick Start' },
  { id: 'options', label: 'Options' },
  { id: 'badge', label: 'The Badge' },
  { id: 'error-panel', label: 'The Error Panel' },
  { id: 'reporting-errors', label: 'Reporting Errors' },
]

const EDIT_URL =
  'https://github.com/Binidu01/bini-official/edit/main/src/app/plugins/bini-overlay/page.tsx'

/* ---- package-manager tab helpers ---------------------------------- */

const PMS = ['npm', 'pnpm', 'yarn', 'bun'] as const
type Pm = (typeof PMS)[number]

const INSTALL: Record<Pm, string> = {
  npm: 'npm install bini-overlay --save-dev',
  pnpm: 'pnpm add bini-overlay -D',
  yarn: 'yarn add bini-overlay -D',
  bun: 'bun add -D bini-overlay',
}

const tabs = (cmd: (pm: Pm) => string): TerminalTab[] =>
  PMS.map((pm) => ({ id: pm, label: pm, command: cmd(pm) }))

export default function BiniOverlayPage() {
  return (
    <PluginPage
      title="bini-overlay"
      badge="Official"
      description="Development overlay for Bini.js: an animated status badge, route inspector, and full-screen error panel."
      url="https://www.npmjs.com/package/bini-overlay"
      editUrl={EDIT_URL}
      toc={TOC_ITEMS}
      prev={{ to: '/plugins/bini-server', title: 'bini-server' }}
      next={{ to: '/plugins/bini-ssg', title: 'bini-ssg' }}
    >
      <Section id="overview" title="Overview">
        <P>
          <C>bini-overlay</C> gives your Bini.js project a polished development experience by
          replacing Vite's default error screen. It adds a floating status badge, a route
          inspector, and a full-screen error panel with syntax-highlighted code frames.
        </P>
      </Section>

      <Section id="requirements" title="Requirements">
        <UL>
          <li>
            Node.js <C>{'>='} 18.0.0</C>
          </li>
          <li>
            Vite <C>{'>='} 8.0.0</C>
          </li>
          <li>
            <C>bini-router</C> <C>{'>='} 2.0.0</C>
          </li>
        </UL>
      </Section>

      <Section id="install" title="Install">
        <MultiTerminal tabs={tabs((pm) => `$ ${INSTALL[pm]}`)} />
      </Section>

      <Section id="quick-start" title="Quick Start">
        <P>
          Register the plugin in your Bini.js config. <C>biniOverlay()</C> returns an array of
          plugins, which Vite automatically flattens, so add it to your plugins array as-is.
        </P>
        <CodeBlock
          filename="vite.config.ts"
          code={`import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { biniOverlay } from 'bini-overlay'

export default defineConfig({
  plugins: [
    react(),
    biniOverlay(),
  ],
})`}
        />
      </Section>

      <Section id="options" title="Options">
        <P>To hide the floating badge, set <C>disableBadge</C> to <C>true</C>:</P>
        <CodeBlock
          filename="vite.config.ts"
          code={`import { defineConfig } from 'vite'
import { biniOverlay } from 'bini-overlay'

export default defineConfig({
  plugins: [
    biniOverlay({ disableBadge: true }),
  ],
})`}
        />
      </Section>

      <Section id="badge" title="The Badge">
        <P>
          The badge is injected into the page so it never collides with your app's CSS. By
          default, it sits in the bottom-left corner.
        </P>
        <Table
          headers={['State', 'Appearance', 'Behaviour']}
          rows={[
            [
              'Loading',
              'Logo draws itself with an animation',
              'Plays on page load and on each HMR update',
            ],
            ['Idle', 'Filled gradient logo', 'Default state when there are no errors'],
            [
              'Error',
              'Red pill showing 1 Issue / N Issues',
              'Click the count to open the error panel',
            ],
          ]}
        />

        <H3>Menu & Preferences</H3>
        <P>
          Clicking the badge opens a menu showing the current route type (Static, Dynamic, or Not
          Found) and a link to the Route Info inspector.
        </P>
        <P>
          The Preferences popover lets you change the Theme (System, Light, Dark), Position (4
          corners), Size (Small, Medium, Large), and record a custom keyboard Shortcut (default{' '}
          <C>Alt+B</C>) to toggle the badge's visibility.
        </P>
      </Section>

      <Section id="error-panel" title="The Error Panel">
        <P>
          When an error occurs, a full-screen panel opens automatically. It catches runtime
          errors, unhandled rejections, build errors, and errors reported by your error
          boundaries.
        </P>

        <H3>Code Frames & Stacks</H3>
        <P>
          The panel displays five lines of code around the error, with the failing line clearly
          marked. Call stacks are mapped back to your original source code.
        </P>
        <P>
          Application frames are clickable and will open your editor at the exact line. Framework
          frames are collapsed by default to keep the panel clean.
        </P>
      </Section>

      <Section id="reporting-errors" title="Reporting Errors">
        <P>
          Uncaught errors and unhandled rejections are captured automatically. To route errors
          from a React error boundary into the overlay, dispatch a <C>__bini_error__</C> event:
        </P>
        <CodeBlock
          filename="ErrorBoundary.tsx"
          code={`componentDidCatch(error: Error, info: React.ErrorInfo) {
  window.dispatchEvent(
    new CustomEvent('__bini_error__', {
      detail: {
        name: error.name,
        message: error.message,
        stack: error.stack,
        componentStack: info.componentStack,
        type: 'runtime',
      },
    }),
  )
}`}
        />
        <P>
          The overlay also dispatches a <C>__bini_clear_errors__</C> event on <C>window</C> after
          every successful HMR update, so your boundary can listen for it to reset itself:
        </P>
        <CodeBlock
          filename="ErrorBoundary.tsx"
          code={`useEffect(() => {
  const reset = () => setHasError(false)
  window.addEventListener('__bini_clear_errors__', reset)
  return () => window.removeEventListener('__bini_clear_errors__', reset)
}, [])`}
        />
      </Section>
    </PluginPage>
  )
}