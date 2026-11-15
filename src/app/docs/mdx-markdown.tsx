// src/app/docs/mdx-markdown.tsx
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
import { RouteVisual } from '../../components/DocVisuals'
import type { TocItem } from '../../components/TableOfContents'

const TOC_ITEMS: TocItem[] = [
  { id: 'what-is-mdx', label: 'What is MDX?' },
  { id: 'mdx-pages', label: 'MDX Pages' },
  { id: 'markdown-pages', label: 'Markdown Pages' },
  { id: 'imports-in-mdx', label: 'Imports in MDX' },
  { id: 'styling-mdx', label: 'Styling MDX Content' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'mdx-vs-md', label: 'MDX vs Markdown' },
  { id: 'complete-example', label: 'Complete Example' },
]

function Content() {
  const lang = useDocLang()
  const e = lang === 'js' ? 'jsx' : 'tsx'

  return (
    <>
      <Section id="what-is-mdx" title="What is MDX?">
        <P>
          MDX extends Markdown with JSX, so you can use components directly in a content file.
          Bini.js supports <C>.mdx</C> and <C>.md</C> as page routes. Both compile through the
          same MDX pipeline, with full JSX, import, and export support.
        </P>
        <Table
          headers={['File type', 'Description']}
          rows={[
            ['.mdx', 'Markdown with JSX components'],
            ['.md', 'Markdown, compiled through the same MDX pipeline (no plain-only mode)'],
          ]}
        />
        <P>
          The MDX compiler is included with every Bini.js project, so there is nothing to
          install. Add an <C>.mdx</C> or <C>.md</C> file and it compiles automatically as part of
          the build.
        </P>
      </Section>

      <Section id="mdx-pages" title="MDX Pages">
        <P>
          Add an <C>.mdx</C> file anywhere in <C>src/app/</C>. The file compiles to a React
          component and creates a URL based on its location, exactly like a <C>{`page.${e}`}</C>{' '}
          file.
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
          filename="src/app/about.mdx"
          code={`# About Us

Welcome to our company. This is a regular **Markdown** page with JSX support.

<Button variant="primary">Get Started</Button>

## Our Mission

We build amazing products with Bini.js.`}
        />
      </Section>

      <Section id="markdown-pages" title="Markdown Pages">
        <P>
          Plain <C>.md</C> files go through the same MDX pipeline. They support JSX and imports,
          just like <C>.mdx</C>. There is no plain-markdown-only mode.
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
          filename="src/app/terms.md"
          code={`# Terms of Service

## 1. Acceptance of Terms

By using our service, you agree to these terms.

## 2. User Responsibilities

Users are responsible for their content and activity.

---

*Last updated: January 2024*`}
        />
      </Section>

      <Section id="imports-in-mdx" title="Imports in MDX">
        <P>
          Import components, utilities, and hooks directly in MDX. Auto-imports do not apply to{' '}
          <C>.mdx</C> or <C>.md</C> files, so import React hooks and React Router APIs
          explicitly.
        </P>
        <CodeBlock
          filename="src/app/interactive.mdx"
          code={`import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/Button'

# Interactive Page

<Button variant="primary">Click Me</Button>`}
        />
        <Callout>
          Auto-imports (<C>useState</C>, <C>Link</C>, <C>getEnv</C>, and the rest) apply to
          script files only. In <C>.mdx</C> and <C>.md</C>, import what you need.
        </Callout>
      </Section>

      <Section id="styling-mdx" title="Styling MDX Content">
        <P>
          CSS Modules, plain CSS imports, and Tailwind utility classes work in MDX files exactly
          as they do in a <C>{`page.${e}`}</C> file.
        </P>
        <CodeBlock
          filename="src/app/about.mdx"
          code={`import styles from './About.module.css'
import { Button } from '@/components/Button'

# About Us

<div className={styles.container}>
  <p className="text-slate-600 dark:text-slate-300">
    This uses Tailwind classes and CSS Modules.
  </p>
  <Button>Learn More</Button>
</div>`}
        />
        <Callout>
          Tailwind's Preflight reset removes default heading and bold styling. Wrap plain
          Markdown in a <C>prose</C> class from <C>@tailwindcss/typography</C> to restore
          typographic defaults.
        </Callout>
      </Section>

      <Section id="limitations" title="Limitations">
        <P>
          MDX and Markdown are for content pages. Structural files and static exports are not
          supported in them.
        </P>
        <Table
          headers={['Feature', 'Supported in .mdx / .md?']}
          rows={[
            ['Page routes', 'Yes'],
            ['Flat content routes', 'Yes'],
            [
              'layout, template, loading, error, not-found, global-error, default',
              'No - must use .tsx / .jsx / .ts / .js',
            ],
            ['metadata export', 'No - script files only'],
            ['document export', 'No - script files only'],
            ['CSS extraction', 'No - script files only'],
          ]}
        />
        <Callout>
          A layout in a parent folder still contributes metadata to its MDX children. If a single
          MDX route needs its own title or description, put a <C>{`layout.${e}`}</C> in the same
          folder and export <C>metadata</C> from the layout, not from the MDX file.
        </Callout>
      </Section>

      <Section id="mdx-vs-md" title="MDX vs Markdown">
        <P>
          <C>.mdx</C> and <C>.md</C> are identical in behavior, because both go through the same
          MDX compiler. Use <C>.mdx</C> when a file contains JSX components, and <C>.md</C> when
          it is plain Markdown. Both support JSX, so the choice is purely about file extension.
        </P>
        <Table
          headers={['Behavior', '.mdx', '.md']}
          rows={[
            ['Creates a page route', 'Yes', 'Yes'],
            ['JSX components', 'Yes', 'Yes'],
            ['Imports and exports', 'Yes', 'Yes'],
            ['Auto-imports', 'No', 'No'],
            ['metadata export', 'No', 'No'],
          ]}
        />
      </Section>

      <Section id="complete-example" title="Complete Example">
        <P>
          A project mixing MDX, Markdown, and script-based routes.
        </P>
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
            { n: '[slug].mdx', d: 2, dot: true, url: '/blog/:slug' },
            { n: 'docs', d: 1 },
            { n: '[[...slug]]', d: 2 },
            { n: 'page.md', d: 3, dot: true, url: '/docs/*' },
            { n: 'contact.mdx', d: 1, dot: true, url: '/contact' },
          ]}
        />
        <Table
          headers={['File path', 'URL']}
          rows={[
            [`src/app/page.${e}`, '/'],
            ['src/app/about.mdx', '/about'],
            ['src/app/blog/page.mdx', '/blog'],
            ['src/app/blog/[slug].mdx', '/blog/:slug'],
            ['src/app/docs/[[...slug]]/page.md', '/docs/*'],
          ]}
        />
        <Callout>
          The root <C>{`layout.${e}`}</C> exports the site-wide metadata. The blog{' '}
          <C>{`layout.${e}`}</C> exports metadata for every post, including the MDX pages under
          it. Neither <C>.mdx</C> nor <C>.md</C> exports metadata itself.
        </Callout>
      </Section>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link to="/docs/catch-all-routes" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Catch-All Routes</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Match any number of trailing URL segments.</p>
        </Link>
        <Link to="/docs/metadata" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Metadata & SEO</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Control titles, descriptions, and social previews per route.</p>
        </Link>
        <Link to="/docs/layouts-and-pages" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Layouts and Pages</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Create your first pages and wrap them in shared layouts.</p>
        </Link>
        <Link to="/docs/folder-based-routing" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Folder-Based Routing</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Define routes with folders and page files inside them.</p>
        </Link>
        <Link to="/docs/file-based-routing" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">File-Based Routing</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Define routes with flat files instead of folders.</p>
        </Link>
        <Link to="/docs/static-export" className="group block rounded-lg border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700">
          <h4 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">Static Export</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">How every route is pre-rendered to HTML at build time.</p>
        </Link>
      </div>
    </>
  )
}

export default function MdxMarkdownPage() {
  return (
    <DocPage
      title="MDX and Markdown"
      description="MDX and Markdown content routes with JSX support, compiled through @mdx-js/rollup."
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