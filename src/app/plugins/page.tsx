// src/app/plugins/page.tsx
import { ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  siGithub,
  siNpm,
} from 'simple-icons'

import { BrandIcon, H3, P, Section } from '../../components/DocBlocks'
import { PluginPage } from '../../components/PluginPage'
import type { TocItem } from '../../components/TableOfContents'

const TOC_ITEMS: TocItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'features', label: 'Features' },
  { id: 'core-flow', label: 'Core flow' },
  { id: 'packages', label: 'All Packages' },
]

function FeatureBlurb({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-neutral-950">
      <H3 className="mb-1.5">{title}</H3>
      <p className="text-[14px] leading-relaxed text-neutral-600 dark:text-neutral-400">{desc}</p>
    </div>
  )
}

function PluginLinkCard({
  name,
  description,
  href,
  npmUrl,
  githubRepo,
}: {
  name: string
  description: string
  href: string
  npmUrl: string
  githubRepo: string
}) {
  return (
    <div className="flex h-full flex-col rounded-lg border border-neutral-200 bg-white transition-colors hover:border-black dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-white">
      <Link to={href} className="group block flex-1 p-5">
        <h3 className="mb-2 text-[15px] font-semibold text-black underline-offset-4 group-hover:underline dark:text-white">
          {name}
        </h3>
        <p className="text-[14px] leading-relaxed text-neutral-600 dark:text-neutral-400">
          {description}
        </p>
        <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-neutral-500 group-hover:text-black dark:group-hover:text-white">
          View docs <span aria-hidden>→</span>
        </span>
      </Link>
      <div className="flex items-center gap-4 border-t border-neutral-200 px-5 py-3 dark:border-neutral-800">
        <a
          href={npmUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 transition-colors hover:text-black dark:text-neutral-400 dark:hover:text-white"
        >
          <BrandIcon
            icon={siNpm}
            size={12}
            className="shrink-0 text-current"
          />
          npm
          <ExternalLink className="h-3 w-3" />
        </a>
        <a
          href={`https://github.com/Binidu01/${githubRepo}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 transition-colors hover:text-black dark:text-neutral-400 dark:hover:text-white"
        >
          <BrandIcon
            icon={siGithub}
            size={12}
            className="shrink-0 text-current"
          />
          GitHub
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  )
}

export default function PluginsPage() {
  return (
    <PluginPage
      title="Plugins"
      badge="Ecosystem"
      description="The complete Bini.js ecosystem."
      url="https://bini.js.org/plugins"
      editUrl="https://github.com/Binidu01/bini-official/edit/main/src/app/plugins/page.tsx"
      toc={TOC_ITEMS}
      next={{ to: '/plugins/create-bini-app', title: 'create-bini-app' }}
    >
      <Section id="overview" title="Overview">
        <P>
          The complete Bini.js ecosystem. Everything you need to build full-stack React apps for
          web, desktop, and mobile from one codebase. Start with the overview below, then dive
          into each package in its own page.
        </P>
        <P>
          Bini.js provides out-of-the-box support for common patterns. Many cases where a plugin
          would be needed in other frameworks are already covered by official packages.
        </P>
      </Section>

      <Section id="features" title="Features">
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <FeatureBlurb
            title="Zero Config"
            desc="Every official plugin is pre-configured in create-bini-app. No extra setup needed."
          />
          <FeatureBlurb
            title="Vite Native"
            desc="Built as Vite plugins. Fast HMR, instant builds, and compatible with the Vite ecosystem."
          />
          <FeatureBlurb
            title="One Codebase"
            desc="Same plugins compile to web, Windows, macOS, Linux, Android, and iOS."
          />
        </div>
      </Section>

      <Section id="core-flow" title="Core flow">
        <P>
          Bini.js aims to provide out-of-the-box support for common web development patterns.
          Before searching for a plugin, check the docs - many cases where a plugin would be
          needed in other projects are already covered by the official Bini.js packages below.
        </P>
        <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-950">
          <p className="text-[14px] leading-relaxed text-neutral-600 dark:text-neutral-400">
            <strong className="text-black dark:text-white">Core flow:</strong> create-bini-app
            scaffolds, bini-router handles routing, bini-env manages env, bini-native wires
            native, bini-server and bini-ssg ship to production. bini-deploy pushes it live.
          </p>
        </div>
      </Section>

      <Section id="packages" title="All Packages">
        <div className="grid gap-4 sm:grid-cols-2">
          <PluginLinkCard
            name="create-bini-app"
            description="Scaffold a full Vite + React + Hono project with routing, Tauri builds, and deploy script."
            href="/plugins/create-bini-app"
            npmUrl="https://www.npmjs.com/package/create-bini-app"
            githubRepo="bini-cli"
          />
          <PluginLinkCard
            name="bini-deploy"
            description="Zero-config deployment - web, desktop, and mobile from one CLI."
            href="/plugins/bini-deploy"
            npmUrl="https://www.npmjs.com/package/bini-deploy"
            githubRepo="bini-deploy"
          />
          <PluginLinkCard
            name="bini-router"
            description="File-based routing, layouts, loading/error/404 boundaries, MDX pages, and Hono API routes."
            href="/plugins/bini-router"
            npmUrl="https://www.npmjs.com/package/bini-router"
            githubRepo="bini-router"
          />
          <PluginLinkCard
            name="bini-env"
            description="Hono-native env system. Works on Node, Bun, Deno, Edge, and Workers."
            href="/plugins/bini-env"
            npmUrl="https://www.npmjs.com/package/bini-env"
            githubRepo="bini-env"
          />
          <PluginLinkCard
            name="bini-native"
            description="Automatic Tauri wiring. Detects web APIs and wires Rust plugins and manifests."
            href="/plugins/bini-native"
            npmUrl="https://www.npmjs.com/package/bini-native"
            githubRepo="bini-native"
          />
          <PluginLinkCard
            name="bini-server"
            description="Secure production server with ETag caching, SPA fallback, and graceful shutdown."
            href="/plugins/bini-server"
            npmUrl="https://www.npmjs.com/package/bini-server"
            githubRepo="bini-server"
          />
          <PluginLinkCard
            name="bini-overlay"
            description="Error overlay and loading badge. Animates on HMR, shows stack trace on error."
            href="/plugins/bini-overlay"
            npmUrl="https://www.npmjs.com/package/bini-overlay"
            githubRepo="bini-overlay"
          />
          <PluginLinkCard
            name="bini-ssg"
            description="Pre-renders every route to static HTML at build time. No export command needed."
            href="/plugins/bini-ssg"
            npmUrl="https://www.npmjs.com/package/bini-ssg"
            githubRepo="bini-ssg"
          />
        </div>
      </Section>
    </PluginPage>
  )
}