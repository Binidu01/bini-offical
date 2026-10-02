// src/app/plugins/bini-overlay/page.tsx
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
import { PluginPage } from '../../components/PluginPage'
import type { TocItem } from '../../components/TableOfContents'

const TOC_ITEMS: TocItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'features', label: 'Features' },
  { id: 'installation', label: 'Installation' },
  { id: 'quick-start', label: 'Quick Start' },
  { id: 'options', label: 'Options' },
  { id: 'badge', label: 'The Badge' },
  { id: 'error-panel', label: 'The Error Panel' },
  { id: 'reporting-errors', label: 'Reporting Errors' },
  { id: 'dev-endpoints', label: 'Dev Server Endpoints' },
  { id: 'security', label: 'Security' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'requirements', label: 'Requirements' },
  { id: 'troubleshooting', label: 'Troubleshooting' },
]

const EDIT_URL =
  'https://github.com/Binidu01/bini-official/edit/main/src/app/plugins/bini-overlay/page.tsx'

const H3_CLS = 'mb-3 mt-8 text-base font-semibold text-neutral-900 dark:text-neutral-200'
const STRONG = 'font-medium text-neutral-900 dark:text-neutral-100'

function FeatureBlurb({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-neutral-950">
      <h3 className="mb-2 text-sm font-semibold text-black dark:text-white">{title}</h3>
      <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{children}</p>
    </div>
  )
}

export default function BiniOverlayPage() {
  return (
    <PluginPage
      title="bini-overlay"
      badge="Official"
      description="Development overlay for Bini.js: an animated status badge, route inspector, and full-screen error panel with source-mapped stack traces."
      url="https://bini.dev/plugins/bini-overlay"
      editUrl={EDIT_URL}
      toc={TOC_ITEMS}
      prev={{ to: '/plugins/bini-server', title: 'bini-server' }}
      next={{ to: '/plugins/bini-ssg', title: 'bini-ssg' }}
    >
      <Section id="overview" title="Overview">
        <P>
          <C>bini-overlay</C> is a Vite plugin bundle that replaces Vite's default{' '}
          <C>vite-error-overlay</C> with a polished development experience:
        </P>
        <UL>
          <li>
            A floating badge that animates during HMR updates, shows the current route type, and
            opens a preferences menu.
          </li>
          <li>A red issue pill that replaces the badge when something breaks.</li>
          <li>
            A full-screen error panel with a syntax-highlighted code frame, source-mapped call
            stack, and one-click "open in editor".
          </li>
        </UL>
        <P>
          Everything is registered with <C>apply: 'serve'</C>. Nothing is injected into production
          builds.
        </P>
      </Section>

      <Section id="features" title="Features">
        <h3 className="mb-3 text-base font-semibold text-neutral-900 dark:text-neutral-200">
          Status badge
        </h3>
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <FeatureBlurb title="Animated logo">
            SVG stroke-drawing animation on page load and every HMR update.
          </FeatureBlurb>
          <FeatureBlurb title="Shadow DOM">
            Renders inside a shadow root, so it never collides with your app's CSS.
          </FeatureBlurb>
          <FeatureBlurb title="Issue pill">
            Morphs into a red <C>1 Issue</C> / <C>N Issues</C> pill when errors are present.
          </FeatureBlurb>
          <FeatureBlurb title="Live route type">
            Static, Dynamic, or Not Found - updates on client-side navigation.
          </FeatureBlurb>
          <FeatureBlurb title="Route Info inspector">
            Opens a matched-route tree, including layouts and the page file.
          </FeatureBlurb>
          <FeatureBlurb title="Persistent preferences">
            Theme, corner position, size, and a recordable visibility shortcut.
          </FeatureBlurb>
        </div>

        <h3 className={H3_CLS}>Error panel</h3>
        <div className="mb-4 grid gap-4 sm:grid-cols-2">
          <FeatureBlurb title="Captures everything">
            Runtime errors, unhandled rejections, Vite build/transform errors, and errors reported
            by your error boundaries.
          </FeatureBlurb>
          <FeatureBlurb title="Labelled by type">
            Runtime Error, Parse Error, Build Error, Type Error, Unhandled Rejection.
          </FeatureBlurb>
          <FeatureBlurb title="Shiki code frame">
            Five lines of context read from disk, highlighted with Shiki (dark-plus).
          </FeatureBlurb>
          <FeatureBlurb title="Source-mapped stack">
            Frames resolve back to your original source when a source map is available.
          </FeatureBlurb>
          <FeatureBlurb title="Open in editor">
            Click any frame to jump to the exact line in <C>code</C>, <C>cursor</C>, <C>zed</C>,
            and friends.
          </FeatureBlurb>
          <FeatureBlurb title="Smart dedupe">
            Duplicate errors merge, compile errors sort first, cascade errors hide while a real
            error exists.
          </FeatureBlurb>
          <FeatureBlurb title="Auto-clears on fix">
            No manual refresh - HMR delivers a fix and the panel closes.
          </FeatureBlurb>
          <FeatureBlurb title="Graceful fallback">
            Plain unhighlighted text if Shiki can't load.
          </FeatureBlurb>
        </div>
      </Section>

      <Section id="installation" title="Installation">
        <MultiTerminal
          tabs={[
            { id: 'npm', label: 'npm', command: `$ npm install bini-overlay --save-dev` },
            { id: 'pnpm', label: 'pnpm', command: `$ pnpm add bini-overlay -D` },
            { id: 'yarn', label: 'yarn', command: `$ yarn add bini-overlay -D` },
            { id: 'bun', label: 'bun', command: `$ bun add -D bini-overlay` },
          ]}
        />
        <Callout>
          <C>vite {'>='} 8</C> is a required peer dependency. To enable route type detection and
          the Route Info inspector, also install the optional peer dependency{' '}
          <C>bini-router {'>='} 2.0.0</C> - Bini.js projects already include it.
        </Callout>
      </Section>

      <Section id="quick-start" title="Quick Start">
        <CodeBlock
          filename="vite.config.ts"
          lang="js"
          code={`import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { biniOverlay } from 'bini-overlay'

export default defineConfig({
  plugins: [react(), biniOverlay()],
})`}
        />
      </Section>

      <Section id="options" title="Options">
        <CodeBlock
          filename="bini-overlay options"
          lang="js"
          code={`interface BiniOverlayOptions {
  /**
   * App directory scanned for routes. Used to resolve the current page's
   * route type and to power the Route Info inspector.
   * Must match the \`appDir\` you pass to \`biniroute()\` if customised.
   * @default 'src/app'
   */
  appDir?: string

  /**
   * Hide the loading badge and its menu while keeping the error overlay.
   * @default false
   */
  disableBadge?: boolean

  /**
   * Editor binary used by "open in editor". When omitted, the first of
   * \`code\`, \`cursor\`, \`zed\`, \`subl\`, \`webstorm\` found on PATH is used.
   */
  editor?: string
}`}
        />
        <P>Example:</P>
        <CodeBlock
          filename="vite.config.ts"
          lang="js"
          code={`biniOverlay({
  appDir: 'src/app',
  editor: 'cursor',
})`}
        />
        <P>
          The Vite base config is picked up automatically for route matching, so no separate
          base-path option is needed. Code-frame highlighting always uses Shiki's{' '}
          <C>dark-plus</C> theme and is not configurable.
        </P>
      </Section>

      <Section id="badge" title="The Badge">
        <P>By default the badge sits in the bottom-left corner.</P>
        <Table
          headers={['State', 'Appearance', 'Behaviour']}
          rows={[
            [
              'Loading',
              'Logo draws itself with a stroke animation',
              'Runs on page load and on each HMR update',
            ],
            ['Idle', 'Filled gradient logo', 'Default state when there are no errors'],
            [
              'Error',
              'Red pill showing 1 Issue / N Issues',
              'Click the count to open the error panel, or the logo to open the menu',
            ],
          ]}
        />

        <h3 className={H3_CLS}>Menu</h3>
        <P>Click the badge to open the menu.</P>
        <Table
          headers={['Item', 'Description']}
          rows={[
            ['Issues', 'Shown only when errors exist. Reopens the error panel.'],
            ['Route', 'Current route type: Static, Dynamic, or Not Found.'],
            ['Bundler', 'Displays the active bundler (Rolldown).'],
            ['Route Info', 'Opens the route inspector (see below).'],
            ['Preferences', 'Opens the preferences popover.'],
          ]}
        />

        <h3 className={H3_CLS}>Route Info</h3>
        <P>
          Shows the matched route path as a tree, including the layout files and page file that
          render it. Dynamic (<C>:param</C>) and catch-all (<C>*</C>) segments are tagged with a
          chip. Unmatched URLs show a "renders your 404 page" message. Requires{' '}
          <C>bini-router {'>='} 2.0.0</C>.
        </P>

        <h3 className={H3_CLS}>Preferences</h3>
        <Table
          headers={['Setting', 'Options', 'Default']}
          rows={[
            ['Theme', 'System, Light, Dark', 'System'],
            ['Position', 'Bottom Left, Bottom Right, Top Left, Top Right', 'Bottom Left'],
            ['Size', 'Small, Medium, Large', 'Medium'],
            ['Hide for this session', 'Hides the badge until the tab is closed', 'Off'],
            ['Shortcut', 'Record any key combination to toggle visibility', 'Alt+B'],
          ]}
        />
        <P>
          Preferences are stored in <C>localStorage</C> under <C>bini-overlay:prefs</C>. The
          session-hide flag lives in <C>sessionStorage</C> and is cleared when the tab closes.
        </P>
      </Section>

      <Section id="error-panel" title="The Error Panel">
        <P>When an error occurs, the panel opens automatically.</P>
        <Table
          headers={['Section', 'Description']}
          rows={[
            ['Header', 'Error type, file:line chip, copy button, and close button'],
            [
              'Message',
              'Cleaned error message, with the originating plugin shown for build errors',
            ],
            [
              'Code Frame',
              'Five lines of context read from disk, with the failing line marked by >>> and a red row highlight',
            ],
            [
              'Call Stack',
              'Application frames first, framework frames collapsed behind a "N framework frames hidden" toggle',
            ],
            ['Component Stack', 'React component hierarchy, when provided by an error boundary'],
            ['Navigation', 'Prev/Next arrows and counter when multiple errors are queued'],
          ]}
        />

        <h3 className={H3_CLS}>Code frame example</h3>
        <CodeBlock
          filename="src/components/Greeting.tsx"
          lang="js"
          code={`    10: function Greeting() {
>>> 11:   const name = user.name
    12:   return <h1>Hello, {name}!</h1>
    13: }`}
        />

        <h3 className={H3_CLS}>Error lifecycle</h3>
        <CodeBlock
          filename="Lifecycle"
          lang="text"
          code={`1. Error occurs   -> badge becomes a red pill and the panel opens
2. Multiple errors -> navigate with prev/next; duplicates are merged
3. You fix it      -> HMR update arrives, resolved errors are cleared
4. All clear       -> panel closes and the badge returns to idle`}
        />

        <h3 className={H3_CLS}>HMR events</h3>
        <Table
          headers={['Event', 'Behaviour']}
          rows={[
            ['vite:error', 'Adds the error, shows the pill, opens the panel'],
            [
              'vite:beforeUpdate',
              'Removes errors belonging to the updated modules and starts the loading animation',
            ],
            [
              'vite:afterUpdate',
              'Clears remaining errors, closes the panel, and returns the badge to idle',
            ],
          ]}
        />

        <h3 className={H3_CLS}>Unrecoverable errors</h3>
        <P>
          If the app has crashed so completely that nothing is rendered, or an error carries a
          component stack, the close button is hidden. The panel stays up until a successful HMR
          update recovers the page, so you never end up staring at a blank screen.
        </P>
      </Section>

      <Section id="reporting-errors" title="Reporting Errors From Your App">
        <P>
          Errors thrown at runtime and unhandled rejections are captured automatically. To route
          errors from a React error boundary into the overlay, dispatch a <C>__bini_error__</C>{' '}
          event:
        </P>
        <CodeBlock
          filename="ErrorBoundary.tsx"
          lang="js"
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
          The overlay dispatches a <C>__bini_clear_errors__</C> event on <C>window</C> after every
          successful HMR update, so a boundary can listen for it to reset itself:
        </P>
        <CodeBlock
          filename="ErrorBoundary.tsx"
          lang="js"
          code={`useEffect(() => {
  const reset = () => setHasError(false)
  window.addEventListener('__bini_clear_errors__', reset)
  return () => window.removeEventListener('__bini_clear_errors__', reset)
}, [])`}
        />

        <h3 className={H3_CLS}>detail fields</h3>
        <Table
          headers={['Field', 'Type', 'Description']}
          rows={[
            ['message', 'string', 'Error message'],
            ['name', 'string', 'Error name (default Runtime Error)'],
            ['stack', 'string', 'Stack trace, source-mapped when possible'],
            ['componentStack', 'string', 'Optional React component stack'],
            ['file / line', 'string / number', 'Optional; inferred from the stack when omitted'],
            ['type', 'string', 'Defaults to runtime'],
          ]}
        />
      </Section>

      <Section id="dev-endpoints" title="Dev Server Endpoints">
        <P>
          The plugins register the following middleware on the Vite dev server. They exist only
          during <C>vite dev</C>.
        </P>
        <Table
          headers={['Endpoint', 'Query', 'Purpose']}
          rows={[
            [
              '/__bini_code_context',
              'file, line',
              'Returns the surrounding lines for a code frame. Files are cached by modification time (up to 64 entries).',
            ],
            [
              '/__bini_sourcemap',
              'file, line, column',
              'Maps a transformed position back to the original source via the module graph.',
            ],
            ['/__bini_open_editor', 'file, line', 'Opens a file at a line in your editor.'],
            [
              '/__bini_route_match',
              'path',
              'Returns static, dynamic, or not_found for a URL.',
            ],
            [
              '/__bini_route_info',
              'path',
              'Returns matched segments, layouts, and page file for the Route Info inspector.',
            ],
          ]}
        />
        <P>
          The route manifest is built lazily from <C>appDir</C> and invalidated automatically when
          files under it are added, changed, or removed.
        </P>
        <P>
          Supported editors: <C>code</C>, <C>cursor</C>, <C>zed</C>, <C>subl</C>,{' '}
          <C>webstorm</C>. Pass the <C>editor</C> option to force a specific binary.
        </P>
      </Section>

      <Section id="security" title="Security">
        <P>
          The overlay exposes file-reading and process-launching endpoints, so they are locked
          down:
        </P>
        <UL>
          <li>
            <strong className={STRONG}>Same-origin only.</strong> Requests are checked via{' '}
            <C>Sec-Fetch-Site</C>, falling back to an <C>Origin</C>/<C>Host</C> comparison.
            Cross-origin requests receive 403.
          </li>
          <li>
            <strong className={STRONG}>Project-root confinement.</strong> Code-context and
            open-in-editor paths are resolved and rejected if they escape the current working
            directory.
          </li>
          <li>
            <strong className={STRONG}>Dev server only.</strong> Every plugin uses{' '}
            <C>apply: 'serve'</C>; none run in <C>vite build</C>.
          </li>
        </UL>
      </Section>

      <Section id="architecture" title="Architecture">
        <P>
          <C>biniOverlay()</C> returns seven cooperating plugins:
        </P>
        <Table
          headers={['Plugin', 'Role']}
          rows={[
            ['bini-overlay:code-context', 'Serves code frames from disk'],
            ['bini-overlay:sourcemap', 'Resolves source-mapped stack positions'],
            ['bini-overlay:open-editor', 'Launches your editor at a file and line'],
            ['bini-overlay:routes', 'Route matching and route info via bini-router'],
            [
              'bini-overlay:vite-intercept',
              "Neutralises Vite's built-in vite-error-overlay element",
            ],
            ['bini-overlay:error', 'Client-side error capture and the error panel'],
            ['bini-overlay:loading', 'Badge, menu, route info, and preferences'],
          ]}
        />
      </Section>

      <Section id="requirements" title="Requirements">
        <h3 className="mb-3 text-base font-semibold text-neutral-900 dark:text-neutral-200">
          Version
        </h3>
        <Table
          headers={['Tool', 'Version']}
          rows={[
            ['Node.js', '>= 18.0.0'],
            ['Vite', '>= 8.0.0 (Rolldown-based)'],
          ]}
        />

        <h3 className={H3_CLS}>Dependencies</h3>
        <Table
          headers={['Package', 'Type', 'Purpose']}
          rows={[
            [
              'vite (>= 8.0.0)',
              'Peer, required',
              'Host build tool and dev server. Vite 7 and earlier are not supported.',
            ],
            [
              'bini-router (>= 2.0.0)',
              'Peer, optional',
              'Route type and Route Info in the badge menu. Without it, everything else still works.',
            ],
            [
              '@jridgewell/trace-mapping',
              'Dependency',
              'Resolves source-mapped stack frames (installed automatically).',
            ],
          ]}
        />
        <Callout>
          <strong>Network access:</strong> syntax highlighting loads Shiki from <C>esm.sh</C>,
          and the badge UI loads Inter and JetBrains Mono from Google Fonts. Offline, the overlay
          still works with plain text and system fonts.
        </Callout>
      </Section>

      <Section id="troubleshooting" title="Troubleshooting">
        <UL>
          <li>
            <strong className={STRONG}>The overlay doesn't appear</strong> - confirm{' '}
            <C>biniOverlay()</C> is in <C>plugins</C> and that you're running <C>vite dev</C>,
            not a production build.
          </li>
          <li>
            <strong className={STRONG}>Code frames have no colours</strong> - Shiki failed to
            load from <C>esm.sh</C>. Check network access; the overlay falls back to plain text.
          </li>
          <li>
            <strong className={STRONG}>Route type / Route Info shows Not Found everywhere</strong>{' '}
            - <C>bini-router</C> isn't installed, or <C>appDir</C> doesn't match the value passed
            to <C>biniroute()</C>.
          </li>
          <li>
            <strong className={STRONG}>Stack frames point at transformed code</strong> - no source
            map is available for that file. Enable source maps in your Vite config.
          </li>
          <li>
            <strong className={STRONG}>Clicking a stack frame does nothing</strong> - no supported
            editor was found on PATH. Pass the <C>editor</C> option to force a binary.
          </li>
          <li>
            <strong className={STRONG}>403 Forbidden from /__bini_* endpoints</strong> - the
            request came from a different origin. Open the app in a browser at the dev server's
            hostname rather than through a proxy.
          </li>
          <li>
            <strong className={STRONG}>The badge is missing</strong> - it may be hidden for the
            session. Check the preferences, or clear the session-hide flag by closing the tab.
          </li>
          <li>
            <strong className={STRONG}>The overlay stays open after a fix</strong> - wait for the
            HMR update to land. If it doesn't, the error may not belong to a module Vite can
            invalidate; reload the page.
          </li>
        </UL>
      </Section>
    </PluginPage>
  )
}