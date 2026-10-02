// src/app/docs/metadata.tsx
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
  { id: 'what-is-metadata', label: 'What is Metadata?' },
  { id: 'basic-metadata', label: 'Basic Metadata' },
  { id: 'open-graph', label: 'Open Graph' },
  { id: 'twitter-cards', label: 'Twitter Cards' },
  { id: 'default-images', label: 'Default Images' },
  { id: 'icons', label: 'Icons' },
  { id: 'nested-metadata', label: 'Nested Metadata' },
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
          Metadata describes your page to search engines, social platforms, and browsers. Export a{' '}
          <C>metadata</C> object from any layout or page for titles, descriptions, Open Graph,
          Twitter cards, and icons.
        </P>
        <P>
          <C>bini-ssg</C> reads route metadata via <C>getMetadataForRoute</C> and injects it into
          each pre-rendered page <C>head</C> during <C>vite build</C>.
        </P>
        <Table
          headers={['Feature', 'How bini-ssg uses it']}
          rows={[
            ['title, description, robots, canonical', 'Injected as title and meta tags'],
            ['icons', 'icon, shortcut, apple-touch-icon'],
            ['openGraph', 'og:title, og:type, og:description, og:url, og:image'],
            ['twitter', 'twitter:card, twitter:title, twitter:description, twitter:image'],
          ]}
        />
      </Section>

      <Section id="what-is-metadata" title="What is Metadata?">
        <P>
          Metadata controls how links look when shared on Twitter, Facebook, LinkedIn, and Slack.
          You author it in route and layout files. The router merges layout-level metadata before{' '}
          <C>bini-ssg</C> sees it.
        </P>
        <Callout>
          <C>getMetadataForRoute</C> returns the already-merged entry for a route. <C>bini-ssg</C>{' '}
          does not invent metadata - it only injects what you export.
        </Callout>
      </Section>

      <Section id="basic-metadata" title="Basic Metadata">
        <P>Export <C>metadata</C> from the root layout or any nested layout or page.</P>
        <CodeBlock
          filename={`app/layout.${e}`}
          tsCode={`export const metadata = {
  title: 'My Bini.js App',
  description: 'Built with Bini.js - a native React framework',
  robots: 'index, follow',
  canonical: 'https://myapp.com',
  themeColor: '#0a0a0a',
  keywords: ['react', 'vite', 'framework', 'bini'],
}`}
          jsCode={`export const metadata = {
  title: 'My Bini.js App',
  description: 'Built with Bini.js - a native React framework',
  robots: 'index, follow',
  canonical: 'https://myapp.com',
  themeColor: '#0a0a0a',
  keywords: ['react', 'vite', 'framework', 'bini'],
}`}
        />
        <Table
          headers={['Field', 'Description']}
          rows={[
            ['title', 'Document title'],
            ['description', 'Meta description'],
            ['robots', 'Crawler instructions'],
            ['canonical', 'Canonical URL'],
            ['themeColor', 'Browser UI color'],
            ['keywords', 'Optional keyword list'],
          ]}
        />
      </Section>

      <Section id="open-graph" title="Open Graph">
        <P>Open Graph tags control previews on Facebook, LinkedIn, and Slack.</P>
        <CodeBlock
          filename={`app/about/page.${e}`}
          tsCode={`export const metadata = {
  title: 'About Us',
  description: 'Learn more about our company',
  openGraph: {
    title: 'About Us - My Bini.js App',
    description: 'Learn more about our company',
    url: 'https://myapp.com/about',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'About Us',
      },
    ],
    siteName: 'My Bini.js App',
    locale: 'en_US',
  },
}`}
          jsCode={`export const metadata = {
  title: 'About Us',
  description: 'Learn more about our company',
  openGraph: {
    title: 'About Us - My Bini.js App',
    description: 'Learn more about our company',
    url: 'https://myapp.com/about',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'About Us',
      },
    ],
    siteName: 'My Bini.js App',
    locale: 'en_US',
  },
}`}
        />
      </Section>

      <Section id="twitter-cards" title="Twitter Cards">
        <P>Twitter (X) card fields control how links appear in the feed.</P>
        <CodeBlock
          filename={`app/blog/[slug]/page.${e}`}
          tsCode={`export const metadata = {
  title: 'Blog Post',
  twitter: {
    card: 'summary_large_image',
    title: 'Blog Post - My Bini.js App',
    description: 'A comprehensive guide to Bini.js',
    creator: '@bini_js',
    images: ['/og-image.png'],
  },
  openGraph: {
    title: 'Blog Post',
    images: ['/og-image.png'],
  },
}`}
          jsCode={`export const metadata = {
  title: 'Blog Post',
  twitter: {
    card: 'summary_large_image',
    title: 'Blog Post - My Bini.js App',
    description: 'A comprehensive guide to Bini.js',
    creator: '@bini_js',
    images: ['/og-image.png'],
  },
  openGraph: {
    title: 'Blog Post',
    images: ['/og-image.png'],
  },
}`}
        />
      </Section>

      <Section id="default-images" title="Default Images">
        <P>
          Put static assets in <C>public/</C>. Reference them by absolute path in metadata.
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

      <Section id="icons" title="Icons">
        <CodeBlock
          filename={`app/layout.${e}`}
          tsCode={`export const metadata = {
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
}`}
          jsCode={`export const metadata = {
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
}`}
        />
      </Section>

      <Section id="nested-metadata" title="Nested Metadata">
        <P>
          Layout and page metadata merge. Use a title template at the root so child pages can set a
          short title.
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
          filename={`app/layout.${e}`}
          tsCode={`export const metadata = {
  title: {
    default: 'My App',
    template: '%s | My App',
  },
}`}
          jsCode={`export const metadata = {
  title: {
    default: 'My App',
    template: '%s | My App',
  },
}`}
        />
        <CodeBlock
          filename={`app/blog/[slug]/page.${e}`}
          tsCode={`export const metadata = {
  title: 'Getting Started with Bini.js',
  // Result: "Getting Started with Bini.js | My App"
}`}
          jsCode={`export const metadata = {
  title: 'Getting Started with Bini.js',
  // Result: "Getting Started with Bini.js | My App"
}`}
        />
      </Section>

      <Section id="bini-ssg-injection" title="bini-ssg Injection">
        <P>
          During <C>vite build</C>, <C>bini-ssg</C> merges metadata into static HTML.
        </P>
        <Callout>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>SEO fields:</strong> title, description, icons, Open Graph, Twitter - existing
              matching tags updated in place
            </li>
            <li>
              <strong>Head tree:</strong> element / text / raw nodes (raw for JSON-LD)
            </li>
            <li>
              <strong>Dynamic routes:</strong> metadata is keyed by the route pattern (e.g.{' '}
              <C>/blog/:slug</C>), not each concrete URL
            </li>
          </ul>
        </Callout>
      </Section>

      <Section id="complete-example" title="Complete Example">
        <CodeBlock
          filename={`app/blog/[slug]/page.${e}`}
          tsCode={`export const metadata = {
  title: 'How bini-ssg pre-renders routes',
  description:
    'A look at link crawling, shells, and metadata injection.',
  robots: 'index, follow',
  canonical: 'https://example.com/blog/how-bini-ssg-works',
  openGraph: {
    title: 'How bini-ssg pre-renders routes',
    type: 'article',
    images: ['https://example.com/og/how-bini-ssg-works.png'],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@bini_js',
  },
}`}
          jsCode={`export const metadata = {
  title: 'How bini-ssg pre-renders routes',
  description:
    'A look at link crawling, shells, and metadata injection.',
  robots: 'index, follow',
  canonical: 'https://example.com/blog/how-bini-ssg-works',
  openGraph: {
    title: 'How bini-ssg pre-renders routes',
    type: 'article',
    images: ['https://example.com/og/how-bini-ssg-works.png'],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@bini_js',
  },
}`}
        />
      </Section>
    </>
  )
}

/* ---------- page ---------- */

export default function MetadataPage() {
  return (
    <DocPage
      title="Metadata"
      description="Export metadata from layouts and pages for SEO and social sharing. Consumed by bini-ssg at build time."
      url="https://bini.js.org/docs/metadata"
      editUrl="https://github.com/Binidu01/bini-official/edit/main/src/app/docs/metadata.tsx"
      toc={TOC_ITEMS}
      prev={{ to: '/docs/notfound', title: 'Not Found (404)' }}
      next={{ to: '/docs/og-twitter', title: 'Open Graph & Twitter' }}
    >
      <Content />
    </DocPage>
  )
}