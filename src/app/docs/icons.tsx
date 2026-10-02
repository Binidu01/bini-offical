// src/app/docs/icons.tsx
import {
  C,
  Callout,
  CodeBlock,
  DocPage,
  H3,
  P,
  Section,
  Table,
  useDocLang,
} from '../../components/DocBlocks'
import { FolderVisual } from '../../components/DocVisuals'
import type { TocItem } from '../../components/TableOfContents'

const TOC_ITEMS: TocItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'icon-types', label: 'Icon Types' },
  { id: 'favicons', label: 'Favicons' },
  { id: 'apple-touch', label: 'Apple Touch Icons' },
  { id: 'svg-vs-ico', label: 'SVG vs ICO' },
  { id: 'manifest', label: 'Manifest & Icons' },
  { id: 'default-images', label: 'Default Images' },
  { id: 'bini-ssg-injection', label: 'bini-ssg Injection' },
  { id: 'complete-example', label: 'Complete Example' },
]

/* ---------- content (reads the TS/JS choice from DocPage) ---------- */

function Content() {
  const lang = useDocLang()
  const e = lang === 'js' ? 'jsx' : 'tsx'

  return (
    <>
      <Section id="overview" title="Overview">
        <P>
          Icons cover browser tabs, bookmarks, iOS home screen, and Android / PWA install. Define
          them with <C>metadata.icons</C>. <C>bini-ssg</C> injects route-specific icons with the
          correct <C>type</C> and <C>sizes</C>.
        </P>
        <Callout>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>Favicons:</strong> <C>icon</C>, <C>shortcut</C> - SVG and ICO with sizes
            </li>
            <li>
              <strong>Apple Touch:</strong> <C>apple</C> - 180×180 for iOS home screen
            </li>
            <li>
              <strong>Manifest:</strong> <C>manifest</C> field + <C>public/site.webmanifest</C>
            </li>
            <li>
              <strong>Defaults:</strong> drop files in <C>public/</C> - no extra config required
            </li>
          </ul>
        </Callout>
      </Section>

      <Section id="icon-types" title="Icon Types">
        <Table
          headers={['Field', 'Injected as', 'Description']}
          rows={[
            ['icon', 'link rel=icon', 'Standard favicon with type and sizes'],
            ['shortcut', 'link rel=shortcut icon', 'Legacy shortcut icon'],
            ['apple', 'link rel=apple-touch-icon', 'iOS home screen - 180×180 recommended'],
            ['other', 'link', 'Other link tags e.g. mask-icon'],
          ]}
        />
        <H3 className="mt-6 mb-4">Icon object fields</H3>
        <Table
          headers={['Field', 'Type', 'Description']}
          rows={[
            ['url', 'string', 'URL to icon file'],
            ['type', 'string', 'MIME type e.g. image/svg+xml'],
            ['sizes', 'string', 'Size e.g. 32x32, 180x180'],
            ['rel', 'string', 'Optional rel override'],
          ]}
        />
      </Section>

      <Section id="favicons" title="Favicons">
        <P>Prefer SVG for modern browsers, with PNG and ICO as fallbacks.</P>
        <CodeBlock
          filename={`app/layout.${e}`}
          tsCode={`export const metadata = {
  title: 'My App',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
}`}
          jsCode={`export const metadata = {
  title: 'My App',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
}`}
        />
        <Table
          headers={['File', 'Size', 'Purpose']}
          rows={[
            ['favicon.svg', 'any', 'Modern browsers - scalable'],
            ['favicon.ico', '32×32', 'Legacy fallback'],
            ['favicon-32x32.png', '32×32', 'Standard tab icon'],
            ['favicon-16x16.png', '16×16', 'Small tab icon'],
          ]}
        />
      </Section>

      <Section id="apple-touch" title="Apple Touch Icons">
        <P>
          Used when a user adds your site to the iOS home screen. iOS applies rounded corners unless
          you supply a precomposed asset.
        </P>
        <CodeBlock
          filename={`app/layout.${e}`}
          tsCode={`export const metadata = {
  icons: {
    apple: [
      {
        url: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
}`}
          jsCode={`export const metadata = {
  icons: {
    apple: [
      {
        url: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
}`}
        />
        <Callout>
          Use a 180×180 PNG. Placing <C>apple-touch-icon.png</C> in <C>public/</C> also works for
          automatic detection.
        </Callout>
      </Section>

      <Section id="svg-vs-ico" title="SVG vs ICO">
        <Callout>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>SVG:</strong> vector, scalable, can use <C>prefers-color-scheme</C>
            </li>
            <li>
              <strong>ICO:</strong> multi-size bitmap container for legacy browsers
            </li>
            <li>
              <strong>PNG:</strong> widely supported middle ground
            </li>
            <li>
              <strong>Best practice:</strong> SVG + 32×32 PNG + ICO + 180×180 Apple
            </li>
          </ul>
        </Callout>
        <CodeBlock
          filename={`app/layout.${e}`}
          tsCode={`export const metadata = {
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' },
    ],
  },
}`}
          jsCode={`export const metadata = {
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' },
    ],
  },
}`}
        />
      </Section>

      <Section id="manifest" title="Manifest & Icons">
        <P>
          The web app manifest supplies icons for Android home screen, splash, and PWA install.
        </P>
        <CodeBlock
          filename={`app/layout.${e}`}
          tsCode={`export const metadata = {
  manifest: '/site.webmanifest',
  themeColor: '#0a0a0a',
}`}
          jsCode={`export const metadata = {
  manifest: '/site.webmanifest',
  themeColor: '#0a0a0a',
}`}
        />
        <CodeBlock
          filename="public/site.webmanifest"
          code={`{
  "name": "My Bini.js App",
  "short_name": "Bini",
  "icons": [
    {
      "src": "/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    },
    {
      "src": "/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ],
  "theme_color": "#0a0a0a",
  "background_color": "#ffffff",
  "display": "standalone"
}`}
        />
      </Section>

      <Section id="default-images" title="Default Images">
        <P>Put assets in <C>public/</C>. Replace the defaults with your own files.</P>
        <FolderVisual
          width={300}
          rows={[
            { n: 'public' },
            { n: 'favicon.ico', d: 1 },
            { n: 'favicon.svg', d: 1, dot: true },
            { n: 'favicon-16x16.png', d: 1 },
            { n: 'favicon-32x32.png', d: 1 },
            { n: 'apple-touch-icon.png', d: 1, dot: true },
            { n: 'android-chrome-192x192.png', d: 1 },
            { n: 'android-chrome-512x512.png', d: 1 },
            { n: 'og-image.png', d: 1 },
            { n: 'site.webmanifest', d: 1, dot: true },
          ]}
        />
        <Callout>
          For native packaging, <C>logo.png</C> in <C>public/</C> is often used as the source icon
          for platform icon generation.
        </Callout>
      </Section>

      <Section id="bini-ssg-injection" title="bini-ssg Injection">
        <P>
          During <C>vite build</C>, <C>bini-ssg</C> injects icons into pre-rendered HTML. Matching{' '}
          <C>rel</C> tags are updated in place.
        </P>
        <Table
          headers={['Source', 'Injected as']}
          rows={[
            ['metadata.icons.icon', 'link rel=icon'],
            ['metadata.icons.apple', 'link rel=apple-touch-icon'],
            ['metadata.icons.shortcut', 'link rel=shortcut icon'],
            ['metadata.manifest', 'link rel=manifest'],
            ['public/ defaults', 'Preserved from dist/index.html'],
          ]}
        />
        <Callout>
          Injection is best-effort and does not fail the build. Nested layouts can set different
          icons per segment.
        </Callout>
      </Section>

      <Section id="complete-example" title="Complete Example">
        <CodeBlock
          filename={`app/layout.${e}`}
          tsCode={`export const metadata = {
  title: 'My Bini.js App',
  description: 'Built with Bini.js',
  manifest: '/site.webmanifest',
  themeColor: '#0a0a0a',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' },
      {
        url: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        url: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
    ],
    shortcut: '/favicon.ico',
    apple: [
      {
        url: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
  openGraph: {
    images: ['/og-image.png'],
  },
  twitter: {
    images: ['/og-image.png'],
  },
}`}
          jsCode={`export const metadata = {
  title: 'My Bini.js App',
  description: 'Built with Bini.js',
  manifest: '/site.webmanifest',
  themeColor: '#0a0a0a',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' },
      {
        url: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        url: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
    ],
    shortcut: '/favicon.ico',
    apple: [
      {
        url: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
  openGraph: {
    images: ['/og-image.png'],
  },
  twitter: {
    images: ['/og-image.png'],
  },
}`}
        />
      </Section>
    </>
  )
}

/* ---------- page ---------- */

export default function IconsPage() {
  return (
    <DocPage
      title="Icons & Favicons"
      description="Favicons, Apple touch icons, and web manifest icons - defined in metadata.icons and injected by bini-ssg."
      url="https://bini.js.org/docs/icons"
      editUrl="https://github.com/Binidu01/bini-official/edit/main/src/app/docs/icons.tsx"
      toc={TOC_ITEMS}
      prev={{ to: '/docs/og-twitter', title: 'Open Graph & Twitter' }}
      next={{ to: '/docs/api-routes', title: 'API Routes Overview' }}
    >
      <Content />
    </DocPage>
  )
}