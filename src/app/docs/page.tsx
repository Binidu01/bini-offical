// src/app/docs/page.tsx
import type { ReactNode } from 'react'
import { siGithub, siReddit, siDiscord } from 'simple-icons'

import { C, DocLink, DocPage, ExtLink, H3, P, Section, UL } from '../../components/DocBlocks'
import type { TocItem } from '../../components/TableOfContents'

const TOC_ITEMS: TocItem[] = [
  { id: 'what-is-bini-js', label: 'What is Bini.js?' },
  { id: 'native-apps', label: 'Native Apps from a Single Codebase' },
  { id: 'static-generation', label: 'Static Generation & SSR' },
  { id: 'how-to-use-the-docs', label: 'How to use the docs' },
  { id: 'bini-js-router', label: 'Bini.js Router' },
  { id: 'pre-requisite-knowledge', label: 'Pre-requisite knowledge' },
]

/* ---- local pieces -------------------------------------------------- */

const CARD =
  'rounded-lg border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950'

function Bold({ children }: { children: ReactNode }) {
  return <span className="font-medium text-neutral-900 dark:text-neutral-200">{children}</span>
}

function BrandIcon({ icon }: { icon: { path: string } }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d={icon.path} />
    </svg>
  )
}

function LinkedInIcon({ size = 18, className = '' }: { size?: number; className?: string }) {
  return (
    <span
      className={`inline-block shrink-0 bg-current ${className}`}
      style={{
        width: size,
        height: size,
        maskImage: 'url(/linkedin.svg)',
        maskSize: 'contain',
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskImage: 'url(/linkedin.svg)',
        WebkitMaskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
      }}
      aria-hidden="true"
    />
  )
}

const SOCIALS = [
  {
    name: 'GitHub',
    href: 'https://github.com/Binidu01/bini-cli/discussions',
    hover: 'hover:text-black dark:hover:text-white',
    iconHover: 'group-hover:text-black dark:group-hover:text-white',
    icon: <BrandIcon icon={siGithub} />,
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/showcase/bini-js/?viewAsMember=true',
    hover: 'hover:text-[#0A66C2] dark:hover:text-[#0A66C2]',
    icon: <LinkedInIcon size={18} className="transition-colors" />,
  },
  {
    name: 'Reddit',
    href: 'https://www.reddit.com/r/binijs/',
    hover: 'hover:text-[#FF4500] dark:hover:text-[#FF4500]',
    iconHover: 'group-hover:text-[#FF4500]',
    icon: <BrandIcon icon={siReddit} />,
  },
  {
    name: 'Discord',
    href: 'https://discord.gg/BVRMCxHQpw',
    hover: 'hover:text-[#5865F2] dark:hover:text-[#5865F2]',
    iconHover: 'group-hover:text-[#5865F2]',
    icon: <BrandIcon icon={siDiscord} />,
  },
]

const DOC_SECTIONS: [string, string][] = [
  [
    'Getting Started:',
    'Installation, project structure, layouts and pages, and navigation between routes',
  ],
  [
    'Routing:',
    'Folder-based and file-based routing, dynamic routes, parallel routes, intercepting routes, catch-all routes, and MDX & Markdown pages',
  ],
  [
    'Special Files:',
    'Loading UI, error boundaries, templates, default fallbacks, and not-found pages',
  ],
  ['Data Fetching:', 'Loaders, actions, and accessing route data'],
  ['Metadata:', 'Metadata and SEO, Open Graph and Twitter cards, icons and favicons'],
  [
    'API Routes:',
    'Build backend endpoints with plain function handlers or Hono, including dynamic routes',
  ],
  [
    'Environment Variables:',
    'How they work, prefixes and client exposure, and using them in API routes',
  ],
  ['Styling:', 'Style your app with plain CSS, Tailwind CSS, or CSS Modules'],
  ['Platforms:', 'Build for web, Windows, macOS, Linux, Android, and iOS'],
  [
    'Deployment:',
    'The production server, static export, hosting providers, and one-command deploys',
  ],
]

/* ---- page ---------------------------------------------------------- */

export default function DocsPage() {
  return (
    <DocPage
      title="Getting Started"
      description="Welcome to the Bini.js documentation."
      url="https://bini.js.org/docs"
      editUrl="https://github.com/Binidu01/bini-official/edit/main/src/app/docs/page.tsx"
      toc={TOC_ITEMS}
      next={{ to: '/docs/installation', title: 'Installation' }}
    >
      <Section id="what-is-bini-js" title="What is Bini.js?">
        <P className="mb-4">
          Bini.js is a full-stack React framework for building web, desktop, and mobile apps from
          a single codebase.
        </P>
        <P className="mb-4">
          Web routes are pre-rendered to static HTML at build time, delivering the same SEO and
          first-paint guarantees you expect from a modern web framework. Desktop and mobile
          targets compile to native binaries through Tauri, using the operating system's built-in
          WebView rather than bundling a separate browser engine.
        </P>
        <P className="">
          Routing, API routes, metadata, environment handling, and a production server work out of
          the box. Styling is your choice. The same routes and components ship to every target,
          with each platform compiled and packaged for distribution.
        </P>
      </Section>

      <Section id="native-apps" title="Native Apps from a Single Codebase">
        <P className="mb-4">
          Bini.js does not stop at the browser. Every project that adds a desktop or mobile target
          produces a real, distributable native application - compiled, signed, and packaged for
          its platform - from the same routes and components you already wrote for the web. The UI
          renders through the operating system's built-in WebView, and native capabilities are
          served by a Rust backend rather than a bundled browser runtime.
        </P>

        <H3 className="mt-6 mb-3">Desktop</H3>
        <P className="mb-4">
          Windows, macOS, and Linux builds share one project and one native configuration. Windows
          apps run in WebView2 and ship as NSIS or MSI installers with Authenticode signing. macOS
          apps run in WKWebView, signed with a Developer ID and notarized. Linux apps run in
          WebKitGTK and ship as AppImage, <C>.deb</C>, and <C>.rpm</C> bundles.
        </P>

        <H3 className="mt-6 mb-3">Mobile</H3>
        <P className="mb-4">
          Android and iOS builds are generated from the same project. Android produces a native
          APK or AAB with keystore signing and Play Store support, running in the system WebView.
          iOS runs in WKWebView and distributes through the App Store and TestFlight. Both use
          Tauri's official backends and compile to native binaries with a Rust core.
        </P>

        <H3 className="mt-6 mb-3">Native capabilities</H3>
        <P className="mb-4">
          Clipboard, notifications, geolocation, filesystem, and other native APIs are detected
          from your code and wired automatically during development. You do not hand-edit Rust
          manifests or maintain a parallel native codebase.
        </P>

        <H3 className="mt-6 mb-3">Build and CI</H3>
        <P className="">
          Each native target is compiled and packaged with its own build step, so desktop and
          mobile distributions are produced by their platform toolchains. A single command can
          also generate a GitHub Actions workflow that builds every target on its own runner and
          uploads signed installers as build artifacts. Code signing is configured once, locally or
          through CI secrets, and reused on every build.
        </P>
      </Section>

      <Section id="static-generation" title="Static Generation & SSR">
        <P className="mb-4">
          The production build compiles the client, builds the server bundle, compiles API routes,
          and pre-renders every route to static HTML in a single pass. Static routes are discovered
          from the filesystem; dynamic routes are expanded through a <C>staticParams</C> export and
          by crawling internal links.
        </P>
        <UL className="mb-4 space-y-3">
          <li>
            <Bold>Static routes</Bold> are pre-rendered to <C>&lt;route&gt;/index.html</C> at build
            time. The client hydrates the markup on load with no blank-screen flicker.
          </li>
          <li>
            <Bold>Dynamic routes</Bold> export <C>staticParams</C> to list the URLs to pre-render,
            or are discovered automatically when a rendered page links to them.
          </li>
          <li>
            <Bold>Opting out</Bold> is one line: <C>export const prerender = false</C>. A shell
            page is written instead and the route renders entirely on the client.
          </li>
          <li>
            <Bold>Development SSR</Bold> renders every HTML navigation on the server through the
            same entry, with a 15-second render timeout.
          </li>
        </UL>
        <P className="">
          Routes with data exports (<C>loader</C>, <C>action</C>, and related APIs) are client-only
          and receive a shell page automatically. See the{' '}
          <DocLink to="/docs/static-export">Static Export documentation</DocLink> for the
          full model.
        </P>
      </Section>

      <Section id="how-to-use-the-docs" title="How to use the docs">
        <P className="mb-4">The documentation is organized into ten sections:</P>
        <UL className="space-y-2">
          {DOC_SECTIONS.map(([label, text]) => (
            <li key={label}>
              <Bold>{label}</Bold> {text}
            </li>
          ))}
        </UL>
      </Section>

      <Section id="bini-js-router" title="Bini.js Router">
        <P className="mb-4">
          Bini.js uses a file-system router built on folder and file conventions:
        </P>
        <UL className="mb-4 space-y-3">
          <li>
            <Bold>Folder-based routing</Bold> maps folders to URL segments. Nesting folders creates
            nested routes automatically. Dynamic segments use <C>[id]</C>, catch-alls use{' '}
            <C>[...slug]</C>, and optional catch-alls use <C>[[...slug]]</C>.
          </li>
          <li>
            <Bold>File-based routing</Bold> defines UI through special files: <C>page.tsx</C>,{' '}
            <C>layout.tsx</C>, <C>loading.tsx</C>, <C>error.tsx</C>, and <C>not-found.tsx</C>.{' '}
            <C>.mdx</C> and <C>.md</C> pages are supported out of the box.
          </li>
          <li>
            <Bold>Composition</Bold> is built in: route groups <C>(group)</C>, parallel routes{' '}
            <C>@slot</C>, and intercepting routes <C>(.)</C>, <C>(..)</C>, and <C>(...)</C>.
          </li>
          <li>
            <Bold>Code splitting and pre-rendering</Bold> happen per route automatically. There is
            no <C>React.lazy()</C> boilerplate and no manual export step.
          </li>
          <li>
            <Bold>API routes</Bold> live in <C>src/app/api/</C>. A file can export a plain
            function, per-method handlers, or a Hono app, and runs identically in development,
            production, and on the edge.
          </li>
        </UL>
        <P className="">
          Start with the{' '}
          <DocLink to="/docs/folder-based-routing">Routing documentation</DocLink> for the full
          guide.
        </P>
      </Section>

      <Section id="pre-requisite-knowledge" title="Pre-requisite knowledge">
        <P className="mb-4">
          The documentation assumes familiarity with web development. Before getting started, you
          should be comfortable with:
        </P>
        <UL className="mb-4 space-y-2">
          <li>HTML</li>
          <li>CSS</li>
          <li>JavaScript</li>
          <li>React</li>
        </UL>
        <P className="">
          If you are new to React or need a refresher, start with the{' '}
          <ExtLink href="https://react.dev/learn">React documentation</ExtLink>.
        </P>
      </Section>

      <section id="join-our-community" className="mb-12 scroll-mt-24">
        <div className={`${CARD} p-6`}>
          <h2 className="mb-3 text-xl font-semibold tracking-tight text-black dark:text-neutral-100">
            Join our Community
          </h2>
          <P className="mb-6">
            If you have questions about anything related to Bini.js, our community is available on:
          </P>
          <div className="flex flex-wrap items-center justify-between gap-4">
            {SOCIALS.map(({ name, href, hover, iconHover, icon }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group inline-flex items-center gap-2 text-[15px] font-medium text-neutral-700 transition-colors dark:text-neutral-200 ${hover}`}
              >
                {iconHover ? (
                  <span className={`transition-colors ${iconHover}`}>{icon}</span>
                ) : (
                  icon
                )}
                {name}
              </a>
            ))}
          </div>
        </div>
      </section>
    </DocPage>
  )
}