// src/app/docs/file-based-routing.tsx
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
import { RouteVisual } from '../../components/DocVisuals'
import type { TocItem } from '../../components/TableOfContents'

const TOC_ITEMS: TocItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'basic-file-routing', label: 'Basic File Routing' },
  { id: 'flat-vs-folder', label: 'Flat Files vs Folders' },
  { id: 'index-files', label: 'Index Files' },
  { id: 'file-extensions', label: 'File Extensions & Priority' },
  { id: 'reserved-names', label: 'Reserved Names' },
  { id: 'complete-example', label: 'Complete Example' },
]

const STRONG = 'font-semibold text-black dark:text-white'
const LABEL = 'mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500'

/* ---------- content (reads the TS/JS choice from DocPage) ---------- */

function Content() {
  const lang = useDocLang()
  const e = lang === 'js' ? 'jsx' : 'tsx'

  return (
    <>
      <Section id="overview" title="Overview">
        <P>
          Bini.js supports <strong className={STRONG}>file-based routing</strong> - a file directly
          inside <C>src/app/</C> becomes a route. No folder needed. For example{' '}
          <C>{`about.${e}`}</C> creates <C>/about</C>.
        </P>
        <P>
          This is different from folder-based routing where you need <C>{`about/page.${e}`}</C>.
          File-based is faster for single pages.
        </P>
        <Table
          headers={['File Path', 'URL', 'Creates URL?']}
          rows={[
            [`app/about.${e}`, '/about', 'Yes - flat file creates URL'],
            [`app/contact.${e}`, '/contact', 'Yes - flat file creates URL'],
            [`app/blog.${e}`, '/blog', 'Yes - flat file creates URL'],
            [`app/page.${e}`, '/', 'Yes - root file creates URL'],
          ]}
        />
      </Section>

      <Section id="basic-file-routing" title="Basic File Routing">
        <P>
          A file in <C>src/app</C> directly maps to a URL. The file must export a default React
          component.
        </P>
        <RouteVisual
          badges
          fileWidth={260}
          rows={[
            { n: 'app' },
            { n: `page.${e}`, d: 1, dot: true, url: '/' },
            { n: `about.${e}`, d: 1, url: '/about' },
            { n: `contact.${e}`, d: 1, url: '/contact' },
            { n: `pricing.${e}`, d: 1, url: '/pricing' },
            { n: `blog.${e}`, d: 1, url: '/blog' },
          ]}
        />
        <CodeBlock
          filename={`app/about.${e}`}
          tsCode={`export default function AboutPage() {
  return <h1>About Us</h1>
}`}
          jsCode={`export default function AboutPage() {
  return <h1>About Us</h1>
}`}
        />
        <CodeBlock
          filename={`app/contact.${e}`}
          tsCode={`export default function ContactPage() {
  return <h1>Contact Us</h1>
}`}
          jsCode={`export default function ContactPage() {
  return <h1>Contact Us</h1>
}`}
        />
        <Callout>
          File-based routing creates a URL directly from the file name. No folder with{' '}
          <C>{`page.${e}`}</C> needed.
        </Callout>
      </Section>

      <Section id="flat-vs-folder" title="Flat Files vs Folders">
        <P>Both achieve the same URL, but file-based is shorter for simple pages.</P>
        <Table
          headers={['Approach', 'File Path', 'URL', 'Creates URL?']}
          rows={[
            ['File-based', `app/about.${e}`, '/about', 'Yes - file creates URL'],
            ['Folder-based', `app/about/page.${e}`, '/about', 'Yes - folder + page creates URL'],
            ['File-based', `app/dashboard.${e}`, '/dashboard', 'Yes - file creates URL'],
            [
              'Folder-based',
              `app/dashboard/page.${e}`,
              '/dashboard',
              'Yes - folder + page creates URL',
            ],
          ]}
        />

        <p className={LABEL}>File-based</p>
        <RouteVisual
          badges
          fileWidth={220}
          rows={[
            { n: 'app' },
            { n: `about.${e}`, d: 1, dot: true, url: '/about' },
            { n: `contact.${e}`, d: 1, url: '/contact' },
          ]}
        />

        <p className={`${LABEL} mt-6`}>Folder-based</p>
        <RouteVisual
          badges
          fileWidth={220}
          rows={[
            { n: 'app' },
            { n: 'about', d: 1 },
            { n: `page.${e}`, d: 2, dot: true, url: '/about' },
            { n: 'contact', d: 1 },
            { n: `page.${e}`, d: 2, url: '/contact' },
          ]}
        />

        <Callout>
          Use file-based for simple single pages. Use folder-based when you need co-located
          layouts, loading, or private folders like <C>_components</C> inside the route.
        </Callout>
      </Section>

      <Section id="index-files" title="Index Files">
        <P>
          <C>{`index.${e}`}</C> inside a folder maps to that folder's URL. This is file-based
          routing inside a folder.
        </P>
        <RouteVisual
          badges
          fileWidth={280}
          rows={[
            { n: 'app' },
            { n: 'dashboard', d: 1 },
            { n: `index.${e}`, d: 2, dot: true, url: '/dashboard' },
            { n: 'settings', d: 2 },
            { n: `index.${e}`, d: 3, url: '/dashboard/settings' },
            { n: 'blog', d: 1 },
            { n: `index.${e}`, d: 2, url: '/blog' },
            { n: 'authors', d: 2 },
            { n: `index.${e}`, d: 3, url: '/blog/authors' },
            { n: `page.${e}`, d: 1, url: '/' },
          ]}
        />
        <Table
          headers={['File Path', 'URL', 'Creates URL?']}
          rows={[
            [`app/dashboard/index.${e}`, '/dashboard', 'Yes - index creates URL'],
            [`app/blog/index.${e}`, '/blog', 'Yes - index creates URL'],
            [`app/blog/authors/index.${e}`, '/blog/authors', 'Yes - nested index creates URL'],
          ]}
        />
        <Callout>
          <C>{`index.${e}`}</C> is equivalent to <C>{`page.${e}`}</C> inside that folder - both
          create the same URL. Choose one pattern and stick to it.
        </Callout>
      </Section>

      <Section id="file-extensions" title="File Extensions & Priority">
        <P>
          Supported extensions for file-based routes and their priority when the same name exists.
        </P>
        <Callout>
          <span className="font-mono text-xs">.tsx &gt; .jsx &gt; .ts &gt; .js &gt; .mdx &gt; .md</span>
        </Callout>
        <RouteVisual
          badges
          fileWidth={240}
          rows={[
            { n: 'app' },
            { n: 'about.tsx', d: 1, dot: true, url: '/about' },
            { n: 'about.jsx', d: 1, url: '(ignored)', ok: false },
            { n: 'about.mdx', d: 1, url: '(ignored)', ok: false },
            { n: 'blog.tsx', d: 1, url: '/blog' },
            { n: 'contact.md', d: 1, url: '/contact' },
          ]}
        />
        <Table
          headers={['Extension', 'Creates URL?', 'Description']}
          rows={[
            ['.tsx', 'Yes', 'Highest priority - creates URL'],
            ['.jsx', 'Yes', 'Second priority - creates URL if no .tsx'],
            ['.ts', 'Yes', 'Third priority'],
            ['.js', 'Yes', 'Fourth priority'],
            ['.mdx', 'Yes', 'MDX page - creates URL'],
            ['.md', 'Yes', 'Markdown page - creates URL'],
          ]}
        />
      </Section>

      <Section id="reserved-names" title="Reserved Names">
        <P>
          These file names are never treated as flat file routes - they are special files for
          structure, not routes.
        </P>
        <Table
          headers={['File Name', 'Creates URL?', 'Reason']}
          rows={[
            [`page.${e}`, 'Yes - but via folder', 'Special - defines folder route'],
            [`layout.${e}`, 'No', 'Special file - layout, not route'],
            [`loading.${e}`, 'No', 'Special file - loading UI'],
            [`error.${e}`, 'No', 'Special file - error UI'],
            [`not-found.${e}`, 'No', 'Special file - 404 UI'],
            [`template.${e}`, 'No', 'Special file - template'],
            [`default.${e}`, 'No', 'Special file - parallel route fallback'],
            [`global-error.${e}`, 'No', 'Special file - global error'],
          ]}
        />
        <RouteVisual
          badges
          fileWidth={260}
          rows={[
            { n: 'app' },
            { n: `about.${e}`, d: 1, dot: true, url: '/about' },
            { n: `contact.${e}`, d: 1, url: '/contact' },
            { n: `layout.${e}`, d: 1, url: '-', ok: false },
            { n: `loading.${e}`, d: 1, url: '-', ok: false },
            { n: `page.${e}`, d: 1, url: '/' },
            { n: `dashboard.${e}`, d: 1, url: '/dashboard' },
          ]}
        />
        <Callout>
          Only regular file names like <C>{`about.${e}`}</C>, <C>{`contact.${e}`}</C> create URLs.
          Reserved names like <C>{`layout.${e}`}</C>, <C>{`loading.${e}`}</C>,{' '}
          <C>{`error.${e}`}</C> do not create URLs - they are special files.
        </Callout>
      </Section>

      <Section id="complete-example" title="Complete Example">
        <P>File-based routing only - flat files that create URLs without folders.</P>
        <RouteVisual
          badges
          fileWidth={280}
          rows={[
            { n: 'app' },
            { n: `page.${e}`, d: 1, dot: true, url: '/' },
            { n: `about.${e}`, d: 1, url: '/about' },
            { n: `contact.${e}`, d: 1, url: '/contact' },
            { n: `pricing.${e}`, d: 1, url: '/pricing' },
            { n: `blog.${e}`, d: 1, url: '/blog' },
            { n: `dashboard.${e}`, d: 1, url: '/dashboard' },
            { n: `faq.${e}`, d: 1, url: '/faq' },
            { n: 'dashboard', d: 1 },
            { n: `index.${e}`, d: 2, url: '/dashboard' },
            { n: `settings.${e}`, d: 2, url: '/dashboard/settings' },
            { n: 'blog', d: 1 },
            { n: `index.${e}`, d: 2, url: '/blog' },
            { n: `layout.${e}`, d: 1, url: '-', ok: false },
          ]}
        />
        <Table
          headers={['File Path', 'URL', 'Creates URL?']}
          rows={[
            [`app/page.${e}`, '/', 'Yes - creates URL'],
            [`app/about.${e}`, '/about', 'Yes - file based creates URL'],
            [`app/contact.${e}`, '/contact', 'Yes - file based creates URL'],
            [`app/blog.${e}`, '/blog', 'Yes - file based creates URL'],
            [`app/dashboard/index.${e}`, '/dashboard', 'Yes - index file creates URL'],
            [`app/dashboard/settings.${e}`, '/dashboard/settings', 'Yes - nested file creates URL'],
            [`app/layout.${e}`, '-', 'No - reserved name, no URL'],
            [`app/_components/Header.${e}`, '-', 'No - private folder, no URL'],
          ]}
        />
        <Callout>
          File-based routing: flat files like <C>{`about.${e}`}</C> create URLs directly. Folder +{' '}
          <C>{`page.${e}`}</C> also creates URLs but is folder-based. Reserved names like{' '}
          <C>{`layout.${e}`}</C> never create URLs. Each valid file creates a URL.
        </Callout>
      </Section>
    </>
  )
}

/* ---------- page ---------- */

export default function FileBasedRoutingPage() {
  return (
    <DocPage
      title="File-Based Routing"
      description="Flat files in src/app directly create URL routes without needing a folder."
      url="https://bini.js.org/docs/file-based-routing"
      editUrl="https://github.com/Binidu01/bini-official/edit/main/src/app/docs/file-based-routing.tsx"
      toc={TOC_ITEMS}
      prev={{ to: '/docs/folder-based-routing', title: 'Folder-Based Routing' }}
      next={{ to: '/docs/dynamic-routes', title: 'Dynamic Routes' }}
    >
      <Content />
    </DocPage>
  )
}