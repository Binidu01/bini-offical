// src/app/docs/page.tsx
import type { ReactNode } from 'react'
import { siGithub, siReddit, siDiscord } from 'simple-icons'

import { C, DocLink, DocPage, ExtLink, H3, P, Section, UL } from '../../components/DocBlocks'
import type { TocItem } from '../../components/TableOfContents'

const TOC_ITEMS: TocItem[] = [
  { id: 'what-is-bini-js', label: 'What is Bini.js?' },
  { id: 'native-apps', label: 'Native Apps from a Single Codebase' },
  { id: 'how-to-use-the-docs', label: 'How to use the docs' },
  { id: 'bini-js-router', label: 'Bini.js Router' },
  { id: 'pre-requisite-knowledge', label: 'Pre-requisite knowledge' },
]

/* ---- content data -------------------------------------------------- */

const DESKTOP: [string, string][] = [
  ['Windows', 'Native WebView2 binary with Authenticode signing'],
  ['macOS', 'Native WKWebView app with Developer ID notarization'],
  ['Linux', 'Native WebKitGTK binary as a GPG-signed AppImage'],
]

const MOBILE: [string, string][] = [
  ['Android', "Native APK/AAB via Tauri's Android backend"],
  ['iOS', "Native app via Tauri's iOS backend, running in WKWebView"],
]

const FEATURES: [string, string][] = [
  ['Real Native', 'Not wrapped - compiled to native binaries with full system access'],
  [
    'Auto Plugin Wiring',
    'bini-native detects web APIs you call and wires Rust plugins automatically',
  ],
  ['One Codebase', 'Same routes, API handlers, and components compile to every target'],
]

const DOC_SECTIONS: [string, string][] = [
  [
    'Getting Started:',
    'Step-by-step tutorials to create a new application and learn core features',
  ],
  [
    'Defining Routes:',
    'Folder-based and file-based routing, dynamic routes, catch-all routes, and MDX & Markdown pages',
  ],
  ['Special Files:', 'Loading UI, error boundaries, and 404 pages'],
  ['Metadata:', 'Metadata and SEO, Open Graph and Twitter cards, icons and favicons'],
  ['API Routes:', 'Build backend endpoints with Hono or plain functions'],
  ['Environment Variables:', 'Prefixes, client exposure, and using them in API routes'],
  ['Styling:', 'Style your app with Tailwind CSS, CSS Modules, or plain CSS'],
  ['Platforms:', 'Build for web, Windows, macOS, Linux, Android, and iOS'],
  ['Deployment:', 'Deploy to Node.js, Netlify, Vercel, Cloudflare, or Deno'],
]

/* ---- local pieces -------------------------------------------------- */

const CARD = 'rounded-lg border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950'

function Bold({ children }: { children: ReactNode }) {
  return <span className="font-medium text-neutral-900 dark:text-neutral-200">{children}</span>
}

function PlatformCard({ title, items }: { title: string; items: [string, string][] }) {
  return (
    <div className={`${CARD} p-5`}>
      <H3>{title}</H3>
      <ul className="space-y-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
        {items.map(([name, text]) => (
          <li key={name} className="flex gap-2">
            <span className="mt-0.5 text-neutral-400 dark:text-neutral-600">-</span>
            <span>
              <Bold>{name}</Bold> - {text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
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
          Bini.js is a React framework for building full-stack applications that run natively
          across web, desktop, and mobile - all from a single codebase. You use React components to
          build user interfaces, and Bini.js handles the complexity of multi-platform deployment.
        </P>
        <P className="mb-4">
          It automatically configures lower-level tools while providing a seamless path to native
          apps. You can focus on building your product and shipping quickly, without worrying about
          the underlying platform differences.
        </P>
        <P className="">
          Whether you're building a web app, a desktop application for Windows, macOS, or Linux, or
          a mobile app for Android and iOS - Bini.js gives you the tools to do it all from one
          project.
        </P>
      </Section>

      <Section id="native-apps" title="Native Apps from a Single Codebase">
        <P className="mb-6">
          Bini.js goes beyond the browser. With Tauri integration, your React app becomes a real
          native application on every major platform - not a wrapped web view.
        </P>
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <PlatformCard title="Desktop Apps" items={DESKTOP} />
          <PlatformCard title="Mobile Apps" items={MOBILE} />
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {FEATURES.map(([title, text]) => (
            <div key={title} className={`${CARD} p-4`}>
              <div className="mb-2 text-sm font-medium text-neutral-900 dark:text-neutral-200">
                {title}
              </div>
              <p className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-500">
                {text}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="how-to-use-the-docs" title="How to use the docs">
        <P className="mb-4">The docs are organized into several sections:</P>
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
          Bini.js has a file-system based router built on folder and file conventions:
        </P>
        <UL className="mb-4 space-y-3">
          <li>
            <Bold>Folder-based routing:</Bold> Folders define URL segments, and nesting folders
            creates nested routes automatically.
          </li>
          <li>
            <Bold>File-based routing:</Bold> Special files like <C>page.tsx</C> and{' '}
            <C>layout.tsx</C> define the UI for a route.
          </li>
        </UL>
        <P className="">
          You can start learning the router from the{' '}
          <DocLink to="/docs/folder-based-routing">Routing documentation</DocLink>.
        </P>
      </Section>

      <Section id="pre-requisite-knowledge" title="Pre-requisite knowledge">
        <P className="mb-4">
          Our documentation assumes some familiarity with web development. Before getting started,
          it'll help if you're comfortable with:
        </P>
        <UL className="mb-4 space-y-2">
          <li>HTML</li>
          <li>CSS</li>
          <li>JavaScript</li>
          <li>React</li>
        </UL>
        <P className="">
          If you're new to React or need a refresher, we recommend starting with the{' '}
          <ExtLink href="https://react.dev/learn">React documentation</ExtLink>.
        </P>
      </Section>

      <section id="join-our-community" className="mb-12 scroll-mt-24">
        <div className={`${CARD} p-6`}>
          <h2 className="mb-3 text-xl font-semibold tracking-tight text-black dark:text-neutral-100">
            Join our Community
          </h2>
          <P className="mb-6">
            If you have questions about anything related to Bini.js, you're always welcome to ask
            our community on:
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