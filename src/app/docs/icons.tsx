// src/app/docs/icons.tsx
import { Link } from 'react-router-dom'

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
  { id: 'document-head', label: 'Using document.head' },
  { id: 'icon-types', label: 'Icon Types' },
  { id: 'favicons', label: 'Favicons' },
  { id: 'apple-touch', label: 'Apple Touch Icons' },
  { id: 'manifest', label: 'Manifest & Icons' },
  { id: 'default-images', label: 'Default Images' },
  { id: 'complete-example', label: 'Complete Example' },
]

function Content() {
  const lang = useDocLang()
  const e = lang === 'js' ? 'jsx' : 'tsx'

  return (
    <>
      <Section id="overview" title="Overview">
        <P>
          Icons cover browser tabs, bookmarks, the iOS home screen, and Android / PWA install.
          Bini.js uses raw <C>{'<link>'}</C> tags inside <C>document.head</C> for all icon
          definitions.
        </P>
        <Callout>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>Favicons:</strong> <C>{'<link rel="icon">'}</C> - SVG and ICO with sizes
            </li>
            <li>
              <strong>Apple Touch:</strong> <C>{'<link rel="apple-touch-icon">'}</C> - 180×180 for
              iOS home screen
            </li>
            <li>
              <strong>Manifest:</strong> <C>{'<link rel="manifest">'}</C> +{' '}
              <C>public/site.webmanifest</C>
            </li>
            <li>
              <strong>Defaults:</strong> drop files in <C>public/</C> - no extra config required
            </li>
          </ul>
        </Callout>
      </Section>

      <Section id="document-head" title="Using document.head">
        <P>
          In the root layout, place icon tags directly inside <C>document.head</C>. This is the
          pattern used by every Bini.js project. It applies in both development and production.
        </P>
        <CodeBlock
          filename={`src/app/layout.${e}`}
          tsCode={`export const document = {
  head: (
    <>
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    </>
  ),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}`}
          jsCode={`export const document = {
  head: (
    <>
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    </>
  ),
}

export default function RootLayout({ children }) {
  return <>{children}</>
}`}
        />
        <Callout>
          Tags in <C>document.head</C> override any tags injected with the same <C>rel</C>.
        </Callout>
      </Section>

      <Section id="icon-types" title="Icon Types">
        <Table
          headers={['Tag', 'Purpose', 'Description']}
          rows={[
            ['link rel="icon"', 'Favicon', 'Standard favicon with type and sizes'],
            ['link rel="shortcut icon"', 'Legacy favicon', 'Legacy shortcut icon'],
            ['link rel="apple-touch-icon"', 'iOS home screen', '180×180 recommended'],
            ['link rel="mask-icon"', 'Pinned tab', 'Safari pinned tab icon'],
          ]}
        />
        <H3 className="mt-6 mb-4">Link tag attributes</H3>
        <Table
          headers={['Attribute', 'Type', 'Description']}
          rows={[
            ['href', 'string', 'URL to icon file'],
            ['type', 'string', 'MIME type e.g. image/svg+xml'],
            ['sizes', 'string', 'Size e.g. 32x32, 180x180'],
            ['rel', 'string', 'Relationship, e.g. icon or apple-touch-icon'],
          ]}
        />
      </Section>

      <Section id="favicons" title="Favicons">
        <P>Prefer SVG for modern browsers, with PNG and ICO as fallbacks.</P>
        <CodeBlock
          filename={`src/app/layout.${e}`}
          tsCode={`export const document = {
  head: (
    <>
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    </>
  ),
}`}
          jsCode={`export const document = {
  head: (
    <>
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    </>
  ),
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
          filename={`src/app/layout.${e}`}
          tsCode={`export const document = {
  head: (
    <>
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
    </>
  ),
}`}
          jsCode={`export const document = {
  head: (
    <>
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
    </>
  ),
}`}
        />
        <Callout>
          Use a 180×180 PNG. Placing <C>apple-touch-icon.png</C> in <C>public/</C> also works for
          automatic detection.
        </Callout>
      </Section>

      <Section id="manifest" title="Manifest & Icons">
        <P>
          The web app manifest supplies icons for Android home screen, splash, and PWA install.
        </P>
        <CodeBlock
          filename={`src/app/layout.${e}`}
          tsCode={`export const document = {
  head: (
    <>
      <link rel="manifest" href="/site.webmanifest" />
      <meta name="theme-color" content="#0a0a0a" />
    </>
  ),
}`}
          jsCode={`export const document = {
  head: (
    <>
      <link rel="manifest" href="/site.webmanifest" />
      <meta name="theme-color" content="#0a0a0a" />
    </>
  ),
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

      <Section id="complete-example" title="Complete Example">
        <CodeBlock
          filename={`src/app/layout.${e}`}
          tsCode={`export const document = {
  head: (
    <>
      <title>My Bini.js App</title>
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <meta name="theme-color" content="#0a0a0a" />
    </>
  ),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}`}
          jsCode={`export const document = {
  head: (
    <>
      <title>My Bini.js App</title>
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <meta name="theme-color" content="#0a0a0a" />
    </>
  ),
}

export default function RootLayout({ children }) {
  return <>{children}</>
}`}
        />
      </Section>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link to="/docs/og-twitter" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Open Graph & Twitter</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Control social preview cards.</p>
        </Link>
        <Link to="/docs/metadata" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Metadata</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Export document.head for site-wide head tags and page-level SEO.</p>
        </Link>
        <Link to="/docs/layouts-and-pages" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Layouts and Pages</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Create your first pages and wrap them in shared layouts.</p>
        </Link>
        <Link to="/docs/dynamic-routes" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Dynamic Routes</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Match URL segments with dynamic parameters and catch-alls.</p>
        </Link>
        <Link to="/docs/deploying" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Deployment</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Deploy to Node, Vercel, Netlify, Cloudflare, or Deno, or build native apps in CI.</p>
        </Link>
        <Link to="/docs/installation" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Installation</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Review CLI flags and system requirements.</p>
        </Link>
      </div>
    </>
  )
}

export default function IconsPage() {
  return (
    <DocPage
      title="Icons & Favicons"
      description="Favicons, Apple touch icons, and web manifest icons - defined in document.head."
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