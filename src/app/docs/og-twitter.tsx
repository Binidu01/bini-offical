// src/app/docs/og-twitter.tsx
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
import type { TocItem } from '../../components/TableOfContents'

const TOC_ITEMS: TocItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'open-graph-overview', label: 'Open Graph Overview' },
  { id: 'open-graph-fields', label: 'Open Graph Fields' },
  { id: 'twitter-cards-overview', label: 'Twitter Cards Overview' },
  { id: 'twitter-card-fields', label: 'Twitter Card Fields' },
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
          Open Graph and Twitter Cards control how pages look when shared on Facebook, LinkedIn,
          Slack, and X. Define them in the <C>metadata</C> export on layouts and pages.
        </P>
        <Callout>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>Open Graph:</strong> title, description, url, type, images, siteName, locale
            </li>
            <li>
              <strong>Twitter Cards:</strong> card type, title, description, creator, images
            </li>
            <li>
              <strong>Default image:</strong> replace <C>public/og-image.png</C> (1200×630
              recommended)
            </li>
            <li>
              <strong>bini-ssg:</strong> injects tags via <C>getMetadataForRoute</C> during{' '}
              <C>vite build</C>
            </li>
          </ul>
        </Callout>
      </Section>

      <Section id="open-graph-overview" title="Open Graph Overview">
        <P>Open Graph tags control previews on Facebook, LinkedIn, and Slack.</P>
        <CodeBlock
          filename={`app/about/page.${e}`}
          tsCode={`export const metadata = {
  title: 'About Us',
  description: 'Learn more about our company and team',
  openGraph: {
    title: 'About Us - My Bini.js App',
    description: 'Learn more about our company and team',
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
  description: 'Learn more about our company and team',
  openGraph: {
    title: 'About Us - My Bini.js App',
    description: 'Learn more about our company and team',
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
        <Callout>
          Put a default image at <C>public/og-image.png</C> and reference it from metadata. Replace
          it with your own 1200×630 asset.
        </Callout>
      </Section>

      <Section id="open-graph-fields" title="Open Graph Fields">
        <Table
          headers={['Field', 'Type', 'Injected as']}
          rows={[
            ['title', 'string', 'og:title'],
            ['description', 'string', 'og:description'],
            ['url', 'string', 'og:url'],
            ['type', 'string', 'og:type'],
            ['images', 'array', 'og:image (+ width/height/alt)'],
            ['siteName', 'string', 'og:site_name'],
            ['locale', 'string', 'og:locale'],
          ]}
        />
        <H3 className="mt-6 mb-4">Image object fields</H3>
        <Table
          headers={['Field', 'Type', 'Notes']}
          rows={[
            ['url', 'string', 'Image URL'],
            ['width', 'number', '1200 recommended'],
            ['height', 'number', '630 recommended'],
            ['alt', 'string', 'Alt text'],
          ]}
        />
      </Section>

      <Section id="twitter-cards-overview" title="Twitter Cards Overview">
        <P>
          Twitter (X) cards control how links appear in the feed. Common types: <C>summary</C> and{' '}
          <C>summary_large_image</C>.
        </P>
        <CodeBlock
          filename={`app/blog/[slug]/page.${e}`}
          tsCode={`export const metadata = {
  title: 'Blog Post',
  description: 'A comprehensive guide to Bini.js',
  twitter: {
    card: 'summary_large_image',
    title: 'Blog Post - My Bini.js App',
    description: 'A comprehensive guide to Bini.js',
    creator: '@bini_js',
    images: ['/og-image.png'],
  },
}`}
          jsCode={`export const metadata = {
  title: 'Blog Post',
  description: 'A comprehensive guide to Bini.js',
  twitter: {
    card: 'summary_large_image',
    title: 'Blog Post - My Bini.js App',
    description: 'A comprehensive guide to Bini.js',
    creator: '@bini_js',
    images: ['/og-image.png'],
  },
}`}
        />
      </Section>

      <Section id="twitter-card-fields" title="Twitter Card Fields">
        <Table
          headers={['Field', 'Type', 'Injected as']}
          rows={[
            ['card', 'string', 'twitter:card'],
            ['title', 'string', 'twitter:title'],
            ['description', 'string', 'twitter:description'],
            ['creator', 'string', 'twitter:creator'],
            ['images', 'array', 'twitter:image'],
          ]}
        />
        <Callout>
          <p className="mb-2 font-semibold text-neutral-900 dark:text-neutral-100">Card types</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <C>summary</C> - small image
            </li>
            <li>
              <C>summary_large_image</C> - large image (recommended)
            </li>
            <li>
              <C>app</C> - mobile app card
            </li>
            <li>
              <C>player</C> - video / audio
            </li>
          </ul>
        </Callout>
      </Section>

      <Section id="bini-ssg-injection" title="bini-ssg Injection">
        <P>
          During <C>vite build</C>, <C>bini-ssg</C> injects OG and Twitter tags into pre-rendered
          HTML. Existing matching tags are updated in place.
        </P>
        <Table
          headers={['Metadata', 'Injected tags']}
          rows={[
            ['openGraph.title', 'og:title'],
            ['openGraph.description', 'og:description'],
            ['openGraph.url', 'og:url'],
            ['openGraph.type', 'og:type'],
            ['openGraph.images', 'og:image, og:image:width, og:image:height, og:image:alt'],
            ['twitter.card', 'twitter:card'],
            ['twitter.creator', 'twitter:creator'],
            ['twitter.images', 'twitter:image'],
          ]}
        />
        <Callout>
          Injection is best-effort and does not fail the build. For dynamic routes like{' '}
          <C>/blog/:slug</C>, metadata is keyed by the route pattern unless you resolve per-URL
          values yourself.
        </Callout>
      </Section>

      <Section id="complete-example" title="Complete Example">
        <P>Combined Open Graph and Twitter metadata for a blog post.</P>
        <CodeBlock
          filename={`app/blog/[slug]/page.${e}`}
          tsCode={`export const metadata = {
  title: 'Getting Started with Bini.js',
  description:
    'Learn how to build native cross-platform apps with Bini.js',
  openGraph: {
    title: 'Getting Started with Bini.js',
    description:
      'Learn how to build native cross-platform apps with Bini.js',
    url: 'https://myapp.com/blog/getting-started',
    type: 'article',
    images: [
      {
        url: 'https://myapp.com/images/blog/og.png',
        width: 1200,
        height: 630,
        alt: 'Getting Started with Bini.js',
      },
    ],
    siteName: 'My Bini.js App',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Getting Started with Bini.js',
    description:
      'Learn how to build native cross-platform apps with Bini.js',
    creator: '@bini_js',
    images: ['https://myapp.com/images/blog/og.png'],
  },
}`}
          jsCode={`export const metadata = {
  title: 'Getting Started with Bini.js',
  description:
    'Learn how to build native cross-platform apps with Bini.js',
  openGraph: {
    title: 'Getting Started with Bini.js',
    description:
      'Learn how to build native cross-platform apps with Bini.js',
    url: 'https://myapp.com/blog/getting-started',
    type: 'article',
    images: [
      {
        url: 'https://myapp.com/images/blog/og.png',
        width: 1200,
        height: 630,
        alt: 'Getting Started with Bini.js',
      },
    ],
    siteName: 'My Bini.js App',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Getting Started with Bini.js',
    description:
      'Learn how to build native cross-platform apps with Bini.js',
    creator: '@bini_js',
    images: ['https://myapp.com/images/blog/og.png'],
  },
}`}
        />
        <Callout>Use images at least 1200×630 for consistent previews across platforms.</Callout>
      </Section>
    </>
  )
}

/* ---------- page ---------- */

export default function OgTwitterPage() {
  return (
    <DocPage
      title="Open Graph & Twitter Cards"
      description="Open Graph and Twitter Cards for social previews - injected by bini-ssg at build time."
      url="https://bini.js.org/docs/og-twitter"
      editUrl="https://github.com/Binidu01/bini-official/edit/main/src/app/docs/og-twitter.tsx"
      toc={TOC_ITEMS}
      prev={{ to: '/docs/metadata', title: 'Metadata' }}
      next={{ to: '/docs/icons', title: 'Icons & Favicons' }}
    >
      <Content />
    </DocPage>
  )
}