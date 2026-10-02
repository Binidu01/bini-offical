// src/app/docs/tailwind.tsx
import {
  C,
  Callout,
  CodeBlock,
  DocPage,
  H3,
  MultiTerminal,
  P,
  PromptOutput,
  Section,
  Table,
  useDocLang,
} from '../../components/DocBlocks'
import { FolderVisual, GridBg } from '../../components/DocVisuals'
import type { TocItem } from '../../components/TableOfContents'

const TOC_ITEMS: TocItem[] = [
  { id: 'setup', label: 'Setup' },
  { id: 'global-css', label: 'Global CSS' },
  { id: 'basic-usage', label: 'Basic Usage' },
  { id: 'v4-features', label: 'Tailwind CSS v4 Features' },
  { id: 'theming', label: 'Theming with CSS Variables' },
  { id: 'responsive', label: 'Responsive Design' },
  { id: 'dark-mode', label: 'Dark Mode' },
  { id: 'custom-utilities', label: 'Custom Utilities' },
  { id: 'common-patterns', label: 'Common Patterns' },
]

/* ---------- visuals ---------- */

const TOKENS: [string, string][] = [
  ['--color-primary', '#06b6d4'],
  ['--color-primary-dark', '#0891b2'],
]

/** Theme tokens declared in @theme, shown as swatches. */
function ThemeVisual() {
  return (
    <GridBg>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {TOKENS.map(([name, hex]) => (
          <div
            key={name}
            className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-white px-3 py-2 dark:border-neutral-800 dark:bg-neutral-900"
          >
            <span
              className="h-8 w-8 shrink-0 rounded-md border border-black/10"
              style={{ background: hex }}
            />
            <span>
              <span className="block font-mono text-[12px] text-neutral-900 dark:text-neutral-100">
                {name}
              </span>
              <span className="block font-mono text-[11px] text-neutral-500">{hex}</span>
            </span>
          </div>
        ))}
      </div>
    </GridBg>
  )
}

const BREAKPOINTS: [string, number][] = [
  ['sm', 640],
  ['md', 768],
  ['lg', 1024],
  ['xl', 1280],
  ['2xl', 1536],
]

/** Min-width of each breakpoint, drawn to scale. */
function BreakpointVisual() {
  return (
    <GridBg>
      <div className="w-80 space-y-2">
        {BREAKPOINTS.map(([name, px]) => (
          <div key={name} className="flex items-center gap-3">
            <span className="w-8 shrink-0 font-mono text-[11px] text-neutral-800 dark:text-neutral-200">
              {name}
            </span>
            <div className="h-6 flex-1 overflow-hidden rounded-md border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
              <div
                className="h-full bg-neutral-200 dark:bg-neutral-700"
                style={{ width: `${(px / 1536) * 100}%` }}
              />
            </div>
            <span className="w-14 shrink-0 text-right font-mono text-[11px] text-neutral-500">
              {px}px
            </span>
          </div>
        ))}
      </div>
    </GridBg>
  )
}

/** Same component in light and dark mode. */
function DarkModeVisual() {
  return (
    <GridBg>
      <div className="flex flex-wrap items-stretch justify-center gap-3">
        <div className="w-56 rounded-lg border border-neutral-200 bg-white p-4">
          <div className="mb-2 font-mono text-[10px] text-neutral-400">light</div>
          <div className="text-sm font-semibold text-slate-900">Theme Aware Component</div>
          <div className="mt-1 text-xs text-slate-600">This adapts to light and dark mode</div>
        </div>
        <div className="w-56 rounded-lg border border-neutral-800 bg-slate-900 p-4">
          <div className="mb-2 font-mono text-[10px] text-neutral-500">dark:</div>
          <div className="text-sm font-semibold text-white">Theme Aware Component</div>
          <div className="mt-1 text-xs text-slate-400">This adapts to light and dark mode</div>
        </div>
      </div>
    </GridBg>
  )
}

/* ---------- content (reads the TS/JS choice from DocPage) ---------- */

function Content() {
  const lang = useDocLang()
  const e = lang === 'js' ? 'jsx' : 'tsx' // React files
  const t = lang === 'js' ? 'js' : 'ts' // plain .ts / .js files (vite.config)

  return (
    <>
      <div className="mb-12">
        <P className="mb-4">
          Tailwind CSS v4 is the default styling option in Bini.js. It is pre-configured using the
          official Vite plugin - no PostCSS configuration needed.
        </P>
        <Callout>
          <strong>Zero Configuration:</strong> Bini.js uses the <C>@tailwindcss/vite</C> plugin.
          Everything works out of the box - no <C>postcss.config.js</C> or{' '}
          <C>tailwind.config.js</C> required.
        </Callout>
      </div>

      <Section id="setup" title="Setup">
        <P className="mb-4">
          When you create a new Bini.js project with Tailwind, everything is configured
          automatically. Use the <C>--tailwind</C> flag:
        </P>
        <MultiTerminal
          tabs={[
            { id: 'npm', label: 'npm', command: `$ npx create-bini-app@latest my-app --tailwind` },
            {
              id: 'pnpm',
              label: 'pnpm',
              command: `$ pnpm dlx create-bini-app@latest my-app --tailwind`,
            },
            {
              id: 'yarn',
              label: 'yarn',
              command: `$ yarn dlx create-bini-app@latest my-app --tailwind`,
            },
            {
              id: 'bun',
              label: 'bun',
              command: `$ bunx create-bini-app@latest my-app --tailwind`,
            },
          ]}
        />
        <P className="mb-4">
          Or use the interactive prompt and select <C>Tailwind CSS</C> under the styling question:
        </P>
        <PromptOutput
          lines={[
            { kind: 'question', text: 'Select a styling solution:' },
            { kind: 'option', text: 'Tailwind CSS', selected: true },
            { kind: 'option', text: 'CSS Modules' },
            { kind: 'option', text: 'None' },
            { kind: 'blank' },
            { kind: 'hint', text: '↑↓ navigate • ⏎ select' },
          ]}
        />
        <P className="mb-4">Tailwind is the default, so you can also just run:</P>
        <MultiTerminal
          tabs={[
            { id: 'npm', label: 'npm', command: `$ npx create-bini-app@latest my-app` },
            { id: 'pnpm', label: 'pnpm', command: `$ pnpm dlx create-bini-app@latest my-app` },
            { id: 'yarn', label: 'yarn', command: `$ yarn dlx create-bini-app@latest my-app` },
            { id: 'bun', label: 'bun', command: `$ bunx create-bini-app@latest my-app` },
          ]}
        />
        <P className="mb-4">With TypeScript + Tailwind:</P>
        <MultiTerminal
          tabs={[
            {
              id: 'npm',
              label: 'npm',
              command: `$ npx create-bini-app@latest my-app --tailwind --typescript`,
            },
            {
              id: 'pnpm',
              label: 'pnpm',
              command: `$ pnpm dlx create-bini-app@latest my-app --tailwind --typescript`,
            },
            {
              id: 'yarn',
              label: 'yarn',
              command: `$ yarn dlx create-bini-app@latest my-app --tailwind --typescript`,
            },
            {
              id: 'bun',
              label: 'bun',
              command: `$ bunx create-bini-app@latest my-app --tailwind --typescript`,
            },
          ]}
        />
        <P className="mb-4">Everything below is configured automatically:</P>
        <FolderVisual
          width={260}
          rows={[
            { n: `vite.config.${t}`, dot: true },
            { n: 'src' },
            { n: 'app', d: 1 },
            { n: 'globals.css', d: 2, dot: true },
            { n: `layout.${e}`, d: 2 },
            { n: `page.${e}`, d: 2 },
          ]}
        />
        <CodeBlock
          filename="vite.config.ts"
          code={`import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { biniroute } from 'bini-router'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),  // Automatically added
    biniroute(),
  ],
})`}
        />
        <CodeBlock
          filename="src/app/globals.css"
          code={`/* src/app/globals.css */
@import 'tailwindcss';`}
        />
        <CodeBlock
          filename={`src/app/layout.${e}`}
          tsCode={`// src/app/layout.tsx
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}`}
          jsCode={`// src/app/layout.jsx
import './globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}`}
        />
      </Section>

      <Section id="global-css" title="Global CSS">
        <P className="mb-4">
          Everything Tailwind related lives in one file, <C>globals.css</C>. It is imported once in
          the root layout, so the theme, base styles and custom utilities apply to every route:
        </P>
        <FolderVisual
          width={280}
          rows={[
            { n: 'src' },
            { n: 'app', d: 1 },
            { n: 'globals.css', d: 2, dot: true },
            { n: `layout.${e}`, d: 2 },
            { n: `page.${e}`, d: 2 },
            { n: 'components', d: 2 },
            { n: `Card.${e}`, d: 3 },
          ]}
        />
        <CodeBlock
          filename="src/app/globals.css"
          code={`/* src/app/globals.css */
@import 'tailwindcss';

/* Theme tokens - each one becomes a utility (bg-primary, rounded-card, ...) */
@theme {
  --color-primary: #06b6d4;
  --color-primary-dark: #0891b2;
  --font-sans: 'Inter', system-ui, sans-serif;
  --radius-card: 1rem;
}

/* Base styles applied to every page */
@layer base {
  body {
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
  }
}

/* Custom utilities */
@utility text-gradient {
  background: linear-gradient(to right, var(--tw-gradient-stops));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

@utility card-hover {
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
}`}
        />
        <CodeBlock
          filename={`src/app/layout.${e}`}
          tsCode={`// src/app/layout.tsx
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}`}
          jsCode={`// src/app/layout.jsx
import './globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}`}
        />
        <Callout>
          Keep <C>@import 'tailwindcss'</C> at the top of the file. The sections below show each
          part of this file in more detail.
        </Callout>
      </Section>

      <Section id="basic-usage" title="Basic Usage">
        <P className="mb-4">Use Tailwind's utility classes directly in your components:</P>
        <CodeBlock
          filename={`src/app/page.${e}`}
          code={`export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black">
      <h1 className="bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-4xl font-bold text-transparent">
        Welcome to Bini.js
      </h1>
      <p className="mt-4 text-lg text-slate-400">
        Styled with Tailwind CSS v4
      </p>
      <button className="mt-6 rounded-lg bg-cyan-500 px-4 py-2 font-medium text-black transition-colors hover:bg-cyan-400">
        Get Started
      </button>
    </div>
  )
}`}
        />
      </Section>

      <Section id="v4-features" title="Tailwind CSS v4 Features">
        <Table
          headers={['Feature', 'Description']}
          rows={[
            ['Vite Plugin', 'Native Vite integration - no PostCSS config needed'],
            ['CSS-first config', 'Configure via CSS variables instead of JS'],
            ['Lightning CSS', 'Faster builds with Lightning CSS'],
            ['Simplified setup', 'Just @import "tailwindcss" - that is it'],
          ]}
        />
      </Section>

      <Section id="theming" title="Theming with CSS Variables">
        <P className="mb-4">
          Tailwind v4 uses CSS variables for theming. Every token you declare in <C>@theme</C>{' '}
          becomes a utility:
        </P>
        <ThemeVisual />
        <CodeBlock
          filename="src/app/globals.css"
          code={`/* src/app/globals.css */
@import 'tailwindcss';

@theme {
  --color-primary: #06b6d4;
  --color-primary-dark: #0891b2;
  --font-sans: 'Inter', system-ui, sans-serif;
  --radius-card: 1rem;
}`}
        />
        <CodeBlock
          filename={`src/app/components/Card.${e}`}
          tsCode={`// src/app/components/Card.tsx
export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-(--radius-card) bg-primary p-6">
      {children}
    </div>
  )
}`}
          jsCode={`// src/app/components/Card.jsx
export function Card({ children }) {
  return (
    <div className="rounded-(--radius-card) bg-primary p-6">
      {children}
    </div>
  )
}`}
        />
      </Section>

      <Section id="responsive" title="Responsive Design">
        <P className="mb-4">Use Tailwind's responsive prefixes to adapt your layout:</P>
        <BreakpointVisual />
        <CodeBlock
          filename={`src/app/page.${e}`}
          code={`export default function ResponsivePage() {
  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-lg bg-slate-900 p-4">
            <h2 className="text-lg font-semibold text-white sm:text-xl">
              Card {i + 1}
            </h2>
          </div>
        ))}
      </div>
    </div>
  )
}`}
        />
        <Table
          headers={['Breakpoint', 'Min Width']}
          rows={[
            ['sm', '640px'],
            ['md', '768px'],
            ['lg', '1024px'],
            ['xl', '1280px'],
            ['2xl', '1536px'],
          ]}
        />
      </Section>

      <Section id="dark-mode" title="Dark Mode">
        <P className="mb-4">
          Use the <C>dark:</C> variant for dark mode:
        </P>
        <DarkModeVisual />
        <CodeBlock
          filename={`src/app/components/ThemeToggle.${e}`}
          code={`export function ThemeToggle() {
  return (
    <div className="rounded-lg bg-white p-4 dark:bg-slate-900">
      <h2 className="text-slate-900 dark:text-white">
        Theme Aware Component
      </h2>
      <p className="text-slate-600 dark:text-slate-400">
        This adapts to light and dark mode
      </p>
    </div>
  )
}`}
        />
      </Section>

      <Section id="custom-utilities" title="Custom Utilities">
        <P className="mb-4">
          Create custom utilities using <C>@utility</C>:
        </P>
        <CodeBlock
          filename="src/app/globals.css"
          code={`/* src/app/globals.css */
@import 'tailwindcss';

@utility text-gradient {
  background: linear-gradient(to right, var(--tw-gradient-stops));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

@utility card-hover {
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
}`}
        />
        <CodeBlock
          filename={`src/app/components/FeatureCard.${e}`}
          code={`export function FeatureCard() {
  return (
    <div className="card-hover rounded-lg bg-slate-900 p-6">
      <h3 className="text-gradient from-cyan-400 to-blue-500 text-xl font-bold">
        Custom Utility
      </h3>
    </div>
  )
}`}
        />
      </Section>

      <Section id="common-patterns" title="Common Patterns">
        <H3>Container</H3>
        <CodeBlock
          filename={`src/app/components/Container.${e}`}
          tsCode={`// src/app/components/Container.tsx
export function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto px-4">
      {children}
    </div>
  )
}`}
          jsCode={`// src/app/components/Container.jsx
export function Container({ children }) {
  return (
    <div className="container mx-auto px-4">
      {children}
    </div>
  )
}`}
        />
        <H3 className="mt-8 mb-3">Flex Center</H3>
        <CodeBlock
          filename={`src/app/components/FlexCenter.${e}`}
          tsCode={`// src/app/components/FlexCenter.tsx
export function FlexCenter({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center">
      {children}
    </div>
  )
}`}
          jsCode={`// src/app/components/FlexCenter.jsx
export function FlexCenter({ children }) {
  return (
    <div className="flex items-center justify-center">
      {children}
    </div>
  )
}`}
        />
        <H3 className="mt-8 mb-3">Grid Layout</H3>
        <CodeBlock
          filename={`src/app/components/GridLayout.${e}`}
          tsCode={`// src/app/components/GridLayout.tsx
export function GridLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {children}
    </div>
  )
}`}
          jsCode={`// src/app/components/GridLayout.jsx
export function GridLayout({ children }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {children}
    </div>
  )
}`}
        />
        <H3 className="mt-8 mb-3">Button Styles</H3>
        <CodeBlock
          filename={`src/app/components/Buttons.${e}`}
          code={`export function Buttons() {
  return (
    <div className="flex gap-3">
      {/* Primary */}
      <button className="rounded-lg bg-cyan-500 px-4 py-2 font-medium text-black hover:bg-cyan-400">
        Primary
      </button>

      {/* Secondary */}
      <button className="rounded-lg border border-slate-700 px-4 py-2 text-white hover:bg-slate-900">
        Secondary
      </button>
    </div>
  )
}`}
        />
      </Section>
    </>
  )
}

/* ---------- page ---------- */

export default function TailwindPage() {
  return (
    <DocPage
      title="Tailwind CSS"
      description="Learn how to use Tailwind CSS v4 in your Bini.js application with zero configuration."
      url="https://bini.js.org/docs/tailwind"
      editUrl="https://github.com/Binidu01/bini-official/edit/main/src/app/docs/tailwind.tsx"
      toc={TOC_ITEMS}
      prev={{ to: '/docs/css', title: 'CSS Overview' }}
      next={{ to: '/docs/css-modules', title: 'CSS Modules' }}
    >
      <Content />
    </DocPage>
  )
}