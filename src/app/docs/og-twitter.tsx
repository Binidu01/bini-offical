// src/app/docs/og-twitter.tsx
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
import type { TocItem } from '../../components/TableOfContents'

const TOC_ITEMS: TocItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'open-graph-overview', label: 'Open Graph Overview' },
  { id: 'open-graph-fields', label: 'Open Graph Fields' },
  { id: 'twitter-cards-overview', label: 'Twitter Cards Overview' },
  { id: 'twitter-card-fields', label: 'Twitter Card Fields' },
  { id: 'bini-ssg-injection', label: 'How It Works' },
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
          Open Graph and Twitter Card tags control how pages look when shared on Facebook,
          LinkedIn, Slack, and X. Add them to the <C>document</C> export's <C>head</C> node tree
          on the root layout or on any page. The tags are serialized into the static HTML at build
          time and appear in both development and production.
        </P>
        <Callout>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>Open Graph:</strong> title, description, url, type, images, site name, locale
            </li>
            <li>
              <strong>Twitter Cards:</strong> card type, title, description, creator, images
            </li>
            <li>
              <strong>Default image:</strong> place <C>public/og-image.png</C> (1200×630
              recommended) and reference it from <C>document.head</C>
            </li>
            <li>
              <strong>Both environments:</strong> tags declared in <C>document.head</C> render in
              dev and are also injected into pre-rendered HTML by <C>bini-ssg</C> at build time
            </li>
          </ul>
        </Callout>
      </Section>

      <Section id="open-graph-overview" title="Open Graph Overview">
        <P>Open Graph tags control previews on Facebook, LinkedIn, and Slack.</P>
        <CodeBlock
          filename={`src/app/about/page.${e}`}
          tsCode={`export const document = {
  head: (
    <>
      <title>About Us</title>
      <meta name="description" content="Learn more about our company and team" />

      <meta property="og:title" content="About Us - My Bini.js App" />
      <meta property="og:description" content="Learn more about our company and team" />
      <meta property="og:url" content="https://myapp.com/about" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="My Bini.js App" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:image" content="/og-image.png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="About Us" />
    </>
  ),
}`}
          jsCode={`export const document = {
  head: (
    <>
      <title>About Us</title>
      <meta name="description" content="Learn more about our company and team" />

      <meta property="og:title" content="About Us - My Bini.js App" />
      <meta property="og:description" content="Learn more about our company and team" />
      <meta property="og:url" content="https://myapp.com/about" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="My Bini.js App" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:image" content="/og-image.png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="About Us" />
    </>
  ),
}`}
        />
        <Callout>
          <C>document.head</C> is a full JSX node tree. It is serialized into the static HTML.
          Attribute values and children must be static — dynamic values are dropped with a{' '}
          <C>BINI_R004</C> warning.
        </Callout>
        <Callout>
          Put a default image at <C>public/og-image.png</C> and reference it from{' '}
          <C>document.head</C>. Replace it with your own 1200×630 asset.
        </Callout>
      </Section>

      <Section id="open-graph-fields" title="Open Graph Fields">
        <Table
          headers={['Tag', 'Example', 'Purpose']}
          rows={[
            ['og:title', '<meta property="og:title" content="..." />', 'Card title'],
            ['og:description', '<meta property="og:description" content="..." />', 'Card description'],
            ['og:url', '<meta property="og:url" content="https://..." />', 'Canonical URL'],
            ['og:type', '<meta property="og:type" content="website" />', 'Content type'],
            ['og:image', '<meta property="og:image" content="/og-image.png" />', 'Preview image URL'],
            ['og:image:width', '<meta property="og:image:width" content="1200" />', '1200 recommended'],
            ['og:image:height', '<meta property="og:image:height" content="630" />', '630 recommended'],
            ['og:image:alt', '<meta property="og:image:alt" content="..." />', 'Alt text'],
            ['og:site_name', '<meta property="og:site_name" content="My App" />', 'Site name'],
            ['og:locale', '<meta property="og:locale" content="en_US" />', 'Locale'],
          ]}
        />
        <H3 className="mt-6 mb-4">Image attributes</H3>
        <Table
          headers={['Attribute', 'Recommended', 'Notes']}
          rows={[
            ['og:image', '—', 'Image URL'],
            ['og:image:width', '1200', 'Pixel width'],
            ['og:image:height', '630', 'Pixel height'],
            ['og:image:alt', '—', 'Alt text'],
          ]}
        />
      </Section>

      <Section id="twitter-cards-overview" title="Twitter Cards Overview">
        <P>
          Twitter (X) cards control how links appear in the feed. The most common types are{' '}
          <C>summary</C> and <C>summary_large_image</C>. Add the meta tags to <C>document.head</C>{' '}
          in the page or root layout.
        </P>
        <CodeBlock
          filename={`src/app/blog/[slug]/page.${e}`}
          tsCode={`export const document = {
  head: (
    <>
      <title>Blog Post</title>
      <meta name="description" content="A comprehensive guide to Bini.js" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Blog Post - My Bini.js App" />
      <meta name="twitter:description" content="A comprehensive guide to Bini.js" />
      <meta name="twitter:creator" content="@bini_js" />
      <meta name="twitter:image" content="/og-image.png" />
    </>
  ),
}`}
          jsCode={`export const document = {
  head: (
    <>
      <title>Blog Post</title>
      <meta name="description" content="A comprehensive guide to Bini.js" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Blog Post - My Bini.js App" />
      <meta name="twitter:description" content="A comprehensive guide to Bini.js" />
      <meta name="twitter:creator" content="@bini_js" />
      <meta name="twitter:image" content="/og-image.png" />
    </>
  ),
}`}
        />
      </Section>

      <Section id="twitter-card-fields" title="Twitter Card Fields">
        <Table
          headers={['Tag', 'Example', 'Purpose']}
          rows={[
            ['twitter:card', '<meta name="twitter:card" content="summary_large_image" />', 'Card type'],
            ['twitter:title', '<meta name="twitter:title" content="..." />', 'Card title'],
            ['twitter:description', '<meta name="twitter:description" content="..." />', 'Card description'],
            ['twitter:creator', '<meta name="twitter:creator" content="@handle" />', 'Author handle'],
            ['twitter:image', '<meta name="twitter:image" content="/og-image.png" />', 'Preview image'],
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

      <Section id="bini-ssg-injection" title="How It Works">
        <P>
          The <C>document</C> export is statically extracted by bini-router and stripped from the
          client bundle. In development, the dev server inlines the head node tree into the
          rendered page. During <C>vite build</C>, <C>bini-ssg</C> serializes the head tags into
          each pre-rendered HTML file.
        </P>
        <Table
          headers={['Tag', 'Applied in dev', 'Applied at build']}
          rows={[
            ['document.head (title, meta, link, script)', 'Yes', 'Yes'],
            ['document.html / document.body attributes', 'Yes', 'Yes'],
          ]}
        />
        <Callout>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>Nearest wins:</strong> the nearest <C>document</C> export (page first, then
              the closest layout) is used. Documents are not merged.
            </li>
            <li>
              <strong>Static only:</strong> attribute values and children must be static. Dynamic
              values are dropped with a <C>BINI_R004</C> warning.
            </li>
            <li>
              <strong>JSON-LD:</strong>{' '}
              <C>{'dangerouslySetInnerHTML={{ __html: <static value> }}'}</C> is supported for
              JSON-LD scripts.
            </li>
            <li>
              <strong>Dynamic routes:</strong> head tags declared in a page's <C>document</C> are
              applied per route pattern (for example <C>/blog/:slug</C>), not per concrete URL.
              To vary tags per URL, render <C>{'<title>'}</C> / <C>{'<meta>'}</C> from the page
              component (the dev server hoists them into <C>{'<head>'}</C> when no{' '}
              <C>document.head</C> exists).
            </li>
          </ul>
        </Callout>
      </Section>

      <Section id="complete-example" title="Complete Example">
        <P>Combined Open Graph and Twitter metadata for a blog post.</P>
        <CodeBlock
          filename={`src/app/blog/[slug]/page.${e}`}
          tsCode={`export const document = {
  head: (
    <>
      <title>Getting Started with Bini.js</title>
      <meta
        name="description"
        content="Learn how to build native cross-platform apps with Bini.js"
      />

      {/* Open Graph */}
      <meta property="og:title" content="Getting Started with Bini.js" />
      <meta
        property="og:description"
        content="Learn how to build native cross-platform apps with Bini.js"
      />
      <meta property="og:url" content="https://myapp.com/blog/getting-started" />
      <meta property="og:type" content="article" />
      <meta property="og:site_name" content="My Bini.js App" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:image" content="https://myapp.com/images/blog/og.png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Getting Started with Bini.js" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Getting Started with Bini.js" />
      <meta
        name="twitter:description"
        content="Learn how to build native cross-platform apps with Bini.js"
      />
      <meta name="twitter:creator" content="@bini_js" />
      <meta name="twitter:image" content="https://myapp.com/images/blog/og.png" />
    </>
  ),
}`}
          jsCode={`export const document = {
  head: (
    <>
      <title>Getting Started with Bini.js</title>
      <meta
        name="description"
        content="Learn how to build native cross-platform apps with Bini.js"
      />

      {/* Open Graph */}
      <meta property="og:title" content="Getting Started with Bini.js" />
      <meta
        property="og:description"
        content="Learn how to build native cross-platform apps with Bini.js"
      />
      <meta property="og:url" content="https://myapp.com/blog/getting-started" />
      <meta property="og:type" content="article" />
      <meta property="og:site_name" content="My Bini.js App" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:image" content="https://myapp.com/images/blog/og.png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Getting Started with Bini.js" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Getting Started with Bini.js" />
      <meta
        name="twitter:description"
        content="Learn how to build native cross-platform apps with Bini.js"
      />
      <meta name="twitter:creator" content="@bini_js" />
      <meta name="twitter:image" content="https://myapp.com/images/blog/og.png" />
    </>
  ),
}`}
        />
        <Callout>
          Use images at least 1200×630 for consistent previews across platforms. For dynamic
          routes such as <C>/blog/:slug</C>, the injected tags use the route pattern. To vary tags
          per URL, render <C>{'<title>'}</C> / <C>{'<meta>'}</C> from the page component instead.
        </Callout>
      </Section>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link to="/docs/metadata" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Metadata</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Export document.head for site-wide head tags and page-level SEO.</p>
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

/* ---------- page ---------- */

export default function OgTwitterPage() {
  return (
    <DocPage
      title="Open Graph & Twitter Cards"
      description="Open Graph and Twitter Card tags via document.head - serialized into static HTML at build time."
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