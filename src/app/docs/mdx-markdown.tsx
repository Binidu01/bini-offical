// src/app/docs/mdx-markdown.tsx
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
  { id: 'what-is-mdx', label: 'What is MDX?' },
  { id: 'mdx-pages', label: 'MDX Pages' },
  { id: 'markdown-pages', label: 'Markdown Pages' },
  { id: 'metadata-in-mdx', label: 'Metadata in MDX' },
  { id: 'imports-in-mdx', label: 'Imports in MDX' },
  { id: 'extension-priority', label: 'Extension Priority' },
  { id: 'styling-mdx', label: 'Styling MDX Content' },
  { id: 'complete-example', label: 'Complete Example' },
]

/* ---------- content (reads the TS/JS choice from DocPage) ---------- */

function Content() {
  const lang = useDocLang()
  const e = lang === 'js' ? 'jsx' : 'tsx'

  return (
    <>
      <Section id="what-is-mdx" title="What is MDX?">
        <P>
          MDX extends Markdown to allow JSX components directly in Markdown files. Bini.js supports{' '}
          <C>.mdx</C> and <C>.md</C> out of the box. <C>@mdx-js/rollup</C> is bundled internally -
          no separate install or Vite config required.
        </P>
        <Table
          headers={['Feature', 'Description', 'Creates URL?']}
          rows={[
            ['.mdx files', 'Markdown + JSX components', 'Yes - content route creates URL'],
            ['.md files', 'Plain markdown through MDX pipeline', 'Yes - content route creates URL'],
            ['No config', '@mdx-js/rollup bundled', 'No - build setup'],
          ]}
        />
      </Section>

      <Section id="mdx-pages" title="MDX Pages">
        <P>
          Create an MDX page by adding <C>.mdx</C> anywhere in <C>src/app/</C>. The file compiles to
          a React component and creates a URL based on the folder/file name.
        </P>
        <RouteVisual
          fileWidth={260}
          rows={[
            { n: 'app' },
            { n: 'about.mdx', d: 1, dot: true, url: '/about' },
            { n: 'blog', d: 1 },
            { n: 'page.mdx', d: 2, dot: true, url: '/blog' },
            { n: '[slug].mdx', d: 2, dot: true, url: '/blog/:slug' },
            { n: 'contact.mdx', d: 1, dot: true, url: '/contact' },
          ]}
        />
        <CodeBlock
          filename="app/about.mdx"
          code={`export const metadata = {
  title: 'About Us',
  description: 'Learn more about our company',
}

# About Us

Welcome to our company! This is a regular **Markdown** page with JSX support.

<Button variant="primary">Get Started</Button>

## Our Mission

We build amazing products with Bini.js.`}
        />
      </Section>

      <Section id="markdown-pages" title="Markdown Pages">
        <P>
          Plain <C>.md</C> files go through the same MDX pipeline - they also support JSX and
          imports. There is no plain-markdown-only mode. Creates a URL like MDX.
        </P>
        <RouteVisual
          fileWidth={280}
          rows={[
            { n: 'app' },
            { n: 'docs', d: 1 },
            { n: 'getting-started.md', d: 2, dot: true, url: '/docs/getting-started' },
            { n: 'privacy.md', d: 1, dot: true, url: '/privacy' },
            { n: 'terms.md', d: 1, dot: true, url: '/terms' },
          ]}
        />
        <CodeBlock
          filename="app/terms.md"
          code={`# Terms of Service

## 1. Acceptance of Terms

By using our service, you agree to these terms.

## 2. User Responsibilities

Users are responsible for their content and activity.

## 3. Termination

We reserve the right to terminate accounts that violate these terms.

---

*Last updated: January 2024*`}
        />
        <Callout>
          Both <C>.mdx</C> and <C>.md</C> are compiled through the same MDX pipeline with full JSX,
          import, and export support. Each creates a URL.
        </Callout>
      </Section>

      <Section id="metadata-in-mdx" title="Metadata in MDX">
        <P>
          Export <C>metadata</C> from any MDX page to set titles, descriptions, and Open Graph tags.
          Works the same as <C>{`page.${e}`}</C>.
        </P>
        <CodeBlock
          filename="app/blog/post.mdx"
          code={`export const metadata = {
  title: 'Blog Post',
  description: 'A comprehensive guide to Bini.js',
  openGraph: {
    title: 'Blog Post',
    description: 'A comprehensive guide to Bini.js',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog Post',
    creator: '@bini_js',
  },
}

# Blog Post

This is a blog post written in MDX with full metadata support.`}
        />
        <P>
          Root layout metadata is injected into <C>index.html</C> at build time. Nested layout
          titles update <C>document.title</C> at runtime.
        </P>
      </Section>

      <Section id="imports-in-mdx" title="Imports in MDX">
        <P>
          Import components, utilities, and hooks directly in MDX. Auto-imports like{' '}
          <C>useState</C>, <C>Link</C>, and <C>getEnv</C> apply to MDX the same as pages.
        </P>
        <CodeBlock
          filename="app/interactive.mdx"
          code={`import { Button } from '@/components/Button'
import { BlogLayout } from '@/components/BlogLayout'
import { useTheme } from '@/hooks/useTheme'

export const metadata = {
  title: 'Interactive Page',
}

# Interactive Page

<BlogLayout>
  <p>This page uses imported components!</p>
  <Button variant="primary">Click Me</Button>
</BlogLayout>`}
        />
      </Section>

      <Section id="extension-priority" title="Extension Priority">
        <P>
          When multiple files share the same base name in a folder, priority order determines which
          creates the URL.
        </P>
        <Callout>
          <div className="font-mono text-sm">.tsx &gt; .jsx &gt; .ts &gt; .js &gt; .mdx &gt; .md</div>
        </Callout>
        <RouteVisual
          fileWidth={260}
          rows={[
            { n: 'app' },
            { n: 'about', d: 1 },
            { n: `page.${e}`, d: 2, dot: true, url: '/about' },
            { n: 'page.mdx', d: 2 },
            { n: 'blog', d: 1 },
            { n: 'page.mdx', d: 2, dot: true, url: '/blog' },
            { n: 'page.md', d: 2 },
            { n: 'contact.md', d: 1, dot: true, url: '/contact' },
          ]}
        />
        <Table
          headers={['Folder', 'Used File', 'Creates URL?', 'Ignored']}
          rows={[
            ['app/about', `page.${e}`, 'Yes - higher priority', 'page.mdx'],
            ['app/blog', 'page.mdx', 'Yes - higher than .md', 'page.md'],
            ['app/contact', 'contact.md', 'Yes - only file', '-'],
          ]}
        />
      </Section>

      <Section id="styling-mdx" title="Styling MDX Content">
        <P>
          CSS Modules, plain CSS imports, and Tailwind utility classes work directly in MDX files.
        </P>
        <CodeBlock
          filename="app/about.mdx"
          code={`import styles from './About.module.css'
import { Button } from '@/components/Button'

# About Us

<div className={styles.container}>
  <p className="text-slate-600 dark:text-slate-300">
    This uses Tailwind classes and CSS Modules!
  </p>
  <Button>Learn More</Button>
</div>`}
        />
        <Callout>
          Tailwind Preflight strips default heading/bold styling. Wrap plain markdown in a{' '}
          <C>prose</C> class from <C>@tailwindcss/typography</C> if you want default typography
          styles.
        </Callout>
      </Section>

      <Section id="complete-example" title="Complete Example">
        <P>Comprehensive MDX/Markdown usage - each content file creates a URL.</P>
        <RouteVisual
          fileWidth={280}
          rows={[
            { n: 'app' },
            { n: `layout.${e}`, d: 1 },
            { n: `page.${e}`, d: 1, url: '/' },
            { n: 'about.mdx', d: 1, dot: true, url: '/about' },
            { n: 'blog', d: 1 },
            { n: `layout.${e}`, d: 2 },
            { n: 'page.mdx', d: 2, dot: true, url: '/blog' },
            { n: `loading.${e}`, d: 2 },
            { n: '[slug].mdx', d: 2, dot: true, url: '/blog/:slug' },
            { n: '_components', d: 2 },
            { n: `PostCard.${e}`, d: 3 },
            { n: 'docs', d: 1 },
            { n: '[[...slug]]', d: 2 },
            { n: 'page.md', d: 3, dot: true, url: '/docs/*' },
            { n: 'contact.mdx', d: 1, dot: true, url: '/contact' },
          ]}
        />
        <CodeBlock
          filename="app/about.mdx"
          code={`export const metadata = {
  title: 'About',
  description: 'Learn about our company',
}

import { TeamMember } from '@/components/TeamMember'

# About Our Company

We build amazing things with Bini.js.

<div className="grid grid-cols-2 gap-4">
  <TeamMember name="John" role="Developer" />
  <TeamMember name="Jane" role="Designer" />
</div>

## Our Values

- **Quality** - We ship polished code
- **Speed** - We move fast
- **Community** - We support our users`}
        />
        <Table
          headers={['File Path', 'URL', 'Creates URL?']}
          rows={[
            [`app/page.${e}`, '/', 'Yes'],
            ['app/about.mdx', '/about', 'Yes - MDX creates URL'],
            ['app/blog/page.mdx', '/blog', 'Yes - MDX creates URL'],
            ['app/blog/[slug].mdx', '/blog/:slug', 'Yes - dynamic MDX creates URL'],
            ['app/docs/[[...slug]]/page.md', '/docs/*', 'Yes - MD catch-all creates URL'],
            [`app/_components/Header.${e}`, '-', 'No - private'],
            [`app/docs/_components/Sidebar.${e}`, '-', 'No - private'],
          ]}
        />
      </Section>
    </>
  )
}

/* ---------- page ---------- */

export default function MdxMarkdownPage() {
  return (
    <DocPage
      title="MDX and Markdown"
      description="MDX and Markdown content routes with JSX support, bundled @mdx-js/rollup - no config needed."
      url="https://bini.js.org/docs/mdx-markdown"
      editUrl="https://github.com/Binidu01/bini-official/edit/main/src/app/docs/mdx-markdown.tsx"
      toc={TOC_ITEMS}
      prev={{ to: '/docs/catch-all-routes', title: 'Catch-All Routes' }}
      next={{ to: '/docs/load', title: 'Loading UI' }}
    >
      <Content />
    </DocPage>
  )
}