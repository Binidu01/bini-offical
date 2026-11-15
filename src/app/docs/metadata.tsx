// src/app/docs/metadata.tsx
import { Link } from 'react-router-dom'

import {
  C,
  Callout,
  CodeBlock,
  DocPage,
  P,
  Section,
  Table,
  useDocLang,
} from '../../components/DocBlocks'
import { FolderVisual, RouteVisual } from '../../components/DocVisuals'
import type { TocItem } from '../../components/TableOfContents'

const TOC_ITEMS: TocItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'document-head', label: 'Using document.head' },
  { id: 'open-graph', label: 'Open Graph' },
  { id: 'twitter-cards', label: 'Twitter Cards' },
  { id: 'icons', label: 'Icons' },
  { id: 'default-images', label: 'Default Images' },
  { id: 'nested', label: 'Nested Layouts' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'complete-example', label: 'Complete Example' },
]

function Content() {
  const lang = useDocLang()
  const e = lang === 'js' ? 'jsx' : 'tsx'

  return (
    <>
      <Section id="overview" title="Overview">
        <P>
          Bini.js uses the <C>document</C> export for document-level configuration. Export a{' '}
          <C>document</C> object containing a <C>head</C> node tree to configure your site's title,
          meta tags, scripts, and JSON-LD.
        </P>
        <Table
          headers={['Export', 'Best for', 'Where to use']}
          rows={[
            ['document', 'Raw head tags, scripts, JSON-LD', 'Root layout (layout.tsx)'],
          ]}
        />
        <Callout>
          The <C>document</C> export is statically extracted at build time and removed from the client
          bundle. It is applied during static rendering and injected into the static HTML.
        </Callout>
      </Section>

      <Section id="document-head" title="Using document.head">
        <P>
          In the root layout, export a <C>document</C> object with a <C>head</C> node tree. All
          standard head tags, JSON-LD scripts, and initialization scripts go here. This is the
          pattern used by every Bini.js project.
        </P>
        <CodeBlock
          filename={`src/app/layout.${e}`}
          tsCode={`const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'My App',
}

export const document = {
  head: (
    <>
      <title>My App</title>
      <meta name="description" content="Built with Bini.js" />
      <meta name="theme-color" content="#00CFFF" />

      <link rel="manifest" href="/site.webmanifest" />
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

      <meta property="og:title" content="My App" />
      <meta property="og:description" content="Built with Bini.js" />
      <meta property="og:image" content="/og-image.png" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content="@your_handle" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
          jsCode={`const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'My App',
}

export const document = {
  head: (
    <>
      <title>My App</title>
      <meta name="description" content="Built with Bini.js" />
      <meta name="theme-color" content="#00CFFF" />

      <link rel="manifest" href="/site.webmanifest" />
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

      <meta property="og:title" content="My App" />
      <meta property="og:description" content="Built with Bini.js" />
      <meta property="og:image" content="/og-image.png" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content="@your_handle" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  ),
}

export default function RootLayout({ children }) {
  return <>{children}</>
}`}
        />
        <Callout>
          <C>document.head</C> is a full JSX node tree. It is serialized into the static HTML. Attributes
          and children must be static, otherwise they are dropped.
        </Callout>
      </Section>

      <Section id="open-graph" title="Open Graph">
        <P>Open Graph tags control previews on Facebook, LinkedIn, and Slack.</P>
        <CodeBlock
          filename={`src/app/about/page.${e}`}
          tsCode={`export const document = {
  head: (
    <>
      <title>About Us</title>
      <meta property="og:title" content="About Us - My App" />
      <meta property="og:description" content="Learn more about our company" />
      <meta property="og:url" content="https://myapp.com/about" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="My App" />
      <meta property="og:image" content="/og-image.png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
    </>
  ),
}`}
          jsCode={`export const document = {
  head: (
    <>
      <title>About Us</title>
      <meta property="og:title" content="About Us - My App" />
      <meta property="og:description" content="Learn more about our company" />
      <meta property="og:url" content="https://myapp.com/about" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="My App" />
      <meta property="og:image" content="/og-image.png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
    </>
  ),
}`}
        />
      </Section>

      <Section id="twitter-cards" title="Twitter Cards">
        <P>Twitter (X) card fields control how links appear in the feed.</P>
        <CodeBlock
          filename={`src/app/blog/[slug]/page.${e}`}
          tsCode={`export const document = {
  head: (
    <>
      <title>Blog Post</title>
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Blog Post" />
      <meta name="twitter:description" content="A comprehensive guide to Bini.js" />
      <meta name="twitter:creator" content="@your_handle" />
      <meta name="twitter:image" content="/og-image.png" />
    </>
  ),
}`}
          jsCode={`export const document = {
  head: (
    <>
      <title>Blog Post</title>
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Blog Post" />
      <meta name="twitter:description" content="A comprehensive guide to Bini.js" />
      <meta name="twitter:creator" content="@your_handle" />
      <meta name="twitter:image" content="/og-image.png" />
    </>
  ),
}`}
        />
      </Section>

      <Section id="icons" title="Icons">
        <P>
          Add icon links directly to <C>document.head</C>.
        </P>
        <CodeBlock
          filename={`src/app/layout.${e}`}
          tsCode={`export const document = {
  head: (
    <>
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    </>
  ),
}`}
          jsCode={`export const document = {
  head: (
    <>
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    </>
  ),
}`}
        />
      </Section>

      <Section id="default-images" title="Default Images">
        <P>
          Put static assets in <C>public/</C>. Reference them by absolute path in <C>document.head</C>.
        </P>
        <FolderVisual
          width={240}
          rows={[
            { n: 'public' },
            { n: 'favicon.ico', d: 1 },
            { n: 'apple-touch-icon.png', d: 1 },
            { n: 'og-image.png', d: 1, dot: true },
            { n: 'logo.png', d: 1 },
            { n: 'site.webmanifest', d: 1 },
          ]}
        />
        <Callout>
          Recommended Open Graph size is 1200×630. No extra config - files in <C>public/</C> are
          served as-is.
        </Callout>
      </Section>

      <Section id="nested" title="Nested Layouts">
        <P>
          For page-specific head tags, you can export <C>document</C> from inner layouts. The nearest
          document export wins (page first, then the closest layout). Documents are not merged.
        </P>
        <RouteVisual
          fileWidth={260}
          rows={[
            { n: 'app' },
            { n: `layout.${e}`, d: 1, dot: true },
            { n: `page.${e}`, d: 1, url: '/' },
            { n: 'blog', d: 1 },
            { n: `layout.${e}`, d: 2, dot: true },
            { n: `page.${e}`, d: 2, url: '/blog' },
            { n: '[slug]', d: 2 },
            { n: `page.${e}`, d: 3, url: '/blog/:slug', dot: true },
          ]}
        />
        <CodeBlock
          filename={`src/app/blog/layout.${e}`}
          tsCode={`export const document = {
  head: (
    <>
      <title>Blog | My App</title>
      <meta name="description" content="Read the latest articles" />
    </>
  ),
}`}
          jsCode={`export const document = {
  head: (
    <>
      <title>Blog | My App</title>
      <meta name="description" content="Read the latest articles" />
    </>
  ),
}`}
        />
      </Section>

      <Section id="how-it-works" title="How It Works">
        <P>
          During <C>vite build</C>, the <C>document</C> export is serialized into the static HTML.
        </P>
        <Callout>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>document.head:</strong> full node tree serialized into the page's head.
            </li>
            <li>
              <strong>Nested layouts:</strong> the nearest document export is used, not merged.
            </li>
            <li>
              <strong>Dynamic routes:</strong> head tags are applied per manifest entry, not per
              concrete URL. Render dynamic tags from your page component if needed.
            </li>
          </ul>
        </Callout>
      </Section>

      <Section id="complete-example" title="Complete Example">
        <P>
          The root layout uses <C>document.head</C> for the site-wide head. Inner pages can override
          it with a their own <C>document</C> export.
        </P>
        <CodeBlock
          filename={`src/app/layout.${e}`}
          tsCode={`const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'My App',
}

export const document = {
  head: (
    <>
      <title>My App</title>
      <meta name="description" content="Built with Bini.js" />
      <link rel="icon" href="/favicon.ico" />
      <link rel="manifest" href="/site.webmanifest" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
          jsCode={`const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'My App',
}

export const document = {
  head: (
    <>
      <title>My App</title>
      <meta name="description" content="Built with Bini.js" />
      <link rel="icon" href="/favicon.ico" />
      <link rel="manifest" href="/site.webmanifest" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  ),
}

export default function RootLayout({ children }) {
  return <>{children}</>
}`}
        />
        <CodeBlock
          filename={`src/app/blog/[slug]/page.${e}`}
          tsCode={`export const document = {
  head: (
    <>
      <title>Blog Post</title>
      <meta name="description" content="A comprehensive guide" />
      <meta property="og:title" content="Blog Post" />
      <meta property="og:image" content="/og-image.png" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content="@your_handle" />
    </>
  ),
}

export default function BlogPost() {
  return <h1>Blog Post</h1>
}`}
          jsCode={`export const document = {
  head: (
    <>
      <title>Blog Post</title>
      <meta name="description" content="A comprehensive guide" />
      <meta property="og:title" content="Blog Post" />
      <meta property="og:image" content="/og-image.png" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content="@your_handle" />
    </>
  ),
}

export default function BlogPost() {
  return <h1>Blog Post</h1>
}`}
        />
      </Section>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link to="/docs/og-twitter" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Open Graph & Twitter</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Control social preview cards.</p>
        </Link>
        <Link to="/docs/icons" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Icons & Favicons</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Set icons and web manifests.</p>
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

export default function MetadataPage() {
  return (
    <DocPage
      title="Metadata"
      description="Export document.head for site-wide head tags and page-level SEO."
      url="https://bini.js.org/docs/metadata"
      editUrl="https://github.com/Binidu01/bini-official/edit/main/src/app/docs/metadata.tsx"
      toc={TOC_ITEMS}
      prev={{ to: '/docs/accessing-route-data', title: 'Accessing Route Data' }}
      next={{ to: '/docs/og-twitter', title: 'Open Graph & Twitter' }}
    >
      <Content />
    </DocPage>
  )
}