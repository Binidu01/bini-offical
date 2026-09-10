// src/pages/docs/installation/page.tsx
import React, { useState } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import {
  CheckCircle,
  AlertTriangle,
  Info,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Copy,
  Check,
  Smartphone,
  Laptop,
  Globe,
  Terminal,
  Package,
  Zap,
  Shield,
  Rocket,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Header } from '../../components/Layout'
import { DocLayout } from '../../components/DocSidebar'
import { CopyPageButton } from '../../components/CopyPageButton'
import { TableOfContents, type TocItem } from '../../components/TableOfContents'

// ────────────────────────────────────────────────────────────────────────────────
// "On this page" entries
// ────────────────────────────────────────────────────────────────────────────────
const TOC_ITEMS: TocItem[] = [
  { id: 'quick-start', label: 'Quick start' },
  { id: 'native-platform-support', label: 'Native Platform Support' },
  { id: 'system-requirements', label: 'System requirements' },
  { id: 'supported-browsers', label: 'Supported browsers' },
  { id: 'create-with-cli', label: 'Create with the CLI' },
  { id: 'run-dev-server', label: 'Run the development server' },
  { id: 'cli-flags', label: 'CLI Flags' },
  { id: 'setup-typescript', label: 'Set up TypeScript' },
  { id: 'setup-linting', label: 'Set up linting' },
  { id: 'setup-absolute-imports', label: 'Set up Absolute Imports' },
]

const PAGE_TITLE = 'Installation'
const PAGE_URL = 'https://bini.js.org/docs/installation'
const EDIT_URL = 'https://github.com/Binidu01/bini-official/edit/main/src/app/docs/installation.tsx'

// ────────────────────────────────────────────────────────────────────────────────
// Dynamic Terminal Component
// ────────────────────────────────────────────────────────────────────────────────
function DynamicTerminal() {
  const [activeTab, setActiveTab] = useState('npm')
  const [copied, setCopied] = useState(false)

  const tabs = [
    { 
      id: 'npm', 
      label: 'npm', 
      command: `$ npx create-bini-app@latest my-app\n$ cd my-app\n$ npm run dev` 
    },
    { 
      id: 'pnpm', 
      label: 'pnpm', 
      command: `$ pnpm create bini-app@latest my-app\n$ cd my-app\n$ pnpm dev` 
    },
    { 
      id: 'yarn', 
      label: 'yarn', 
      command: `$ yarn create bini-app@latest my-app\n$ cd my-app\n$ yarn dev` 
    },
    { 
      id: 'bun', 
      label: 'bun', 
      command: `$ bun create bini-app@latest my-app\n$ cd my-app\n$ bun dev` 
    },
  ]

  const handleCopy = () => {
    const command = tabs.find(t => t.id === activeTab)?.command || ''
    const cleanCommand = command.replace(/\$ /g, '')
    navigator.clipboard.writeText(cleanCommand)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mb-6">
      <div className="rounded-lg overflow-hidden border border-slate-700 bg-[#0a0a0a] shadow-2xl">
        <div className="flex items-center justify-between px-3 py-2 bg-[#1a1a1a] border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          
          <div className="flex items-center gap-0.5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  activeTab === tab.id
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          <button
            onClick={handleCopy}
            className="p-1 rounded hover:bg-slate-800 transition-colors"
            aria-label="Copy command"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-green-400" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-slate-500" />
            )}
          </button>
        </div>
        
        <div className="p-4">
          <AnimatePresence mode="wait">
            <m.div
              key={activeTab}
              initial={{ opacity: 0, x: 4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -4 }}
              transition={{ duration: 0.15 }}
              className="text-slate-200 font-mono text-sm whitespace-pre"
            >
              {tabs.find(t => t.id === activeTab)?.command}
            </m.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────────
// Simple Terminal Component
// ────────────────────────────────────────────────────────────────────────────────
function SimpleTerminal({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    const cleanCommand = code.replace(/\$ /g, '')
    navigator.clipboard.writeText(cleanCommand)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-lg overflow-hidden border border-slate-700 bg-[#0a0a0a] shadow-2xl mb-6">
      <div className="flex items-center justify-between px-3 py-2 bg-[#1a1a1a] border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        
        <button
          onClick={handleCopy}
          className="p-1 rounded hover:bg-slate-800 transition-colors"
          aria-label="Copy command"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-green-400" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-slate-500" />
          )}
        </button>
      </div>
      
      <div className="p-4">
        <div className="text-slate-200 font-mono text-sm whitespace-pre">{code}</div>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────────
// Prompt Terminal Component
// ────────────────────────────────────────────────────────────────────────────────
function PromptTerminal({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-lg overflow-hidden border border-slate-700 bg-[#0a0a0a] shadow-2xl mb-6">
      <div className="flex items-center justify-between px-3 py-2 bg-[#1a1a1a] border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
          <span className="text-xs text-slate-400 font-mono ml-2">Terminal</span>
        </div>
        
        <button
          onClick={handleCopy}
          className="p-1 rounded hover:bg-slate-800 transition-colors"
          aria-label="Copy command"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-green-400" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-slate-500" />
          )}
        </button>
      </div>
      
      <div className="p-4">
        <div className="text-slate-200 font-mono text-sm whitespace-pre">{code}</div>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────────
// Code Block Component with horizontal scrollbar
// ────────────────────────────────────────────────────────────────────────────────
function CodeBlock({ code, filename }: { code: string; filename?: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => { 
    const cleanCode = code.replace(/\$ /g, '')
    navigator.clipboard.writeText(cleanCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000) 
  }

  return (
    <div className="relative group mb-6">
      {filename && (
        <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border border-slate-800 border-b-0 rounded-t-lg">
          <span className="text-sm text-slate-300 font-mono">{filename}</span>
        </div>
      )}
      <button 
        onClick={handleCopy} 
        className="absolute top-2 right-2 p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 transition-colors z-10 opacity-0 group-hover:opacity-100"
        style={{ top: filename ? '3rem' : '0.5rem' }}
      >
        {copied ? (
          <CheckCircle className="w-3.5 h-3.5 text-green-400" />
        ) : (
          <Copy className="w-3.5 h-3.5 text-slate-500" />
        )}
      </button>
      <div className={`bg-[#0a0a0a] border border-slate-700 ${filename ? 'rounded-t-none' : 'rounded-lg'} overflow-x-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent hover:scrollbar-thumb-slate-500`}>
        <pre className="p-4 min-w-max">
          <code className="text-sm font-mono text-slate-200 whitespace-pre">{code}</code>
        </pre>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────────
// Callout Component
// ────────────────────────────────────────────────────────────────────────────────
function Callout({ type, children }: { type: 'info' | 'warning' | 'success' | 'tip'; children: React.ReactNode }) {
  const styles = {
    info: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', icon: Info, color: 'text-cyan-400' },
    warning: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', icon: AlertTriangle, color: 'text-amber-400' },
    success: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', icon: CheckCircle, color: 'text-emerald-400' },
    tip: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', icon: Sparkles, color: 'text-purple-400' },
  }
  const style = styles[type]
  const Icon = style.icon

  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg ${style.bg} border ${style.border} my-6`}>
      <Icon className={`w-5 h-5 ${style.color} shrink-0 mt-0.5`} />
      <div className="text-sm text-slate-200 [&>strong]:text-white [&>code]:text-cyan-400 [&>code]:bg-slate-800 [&>code]:px-1 [&>code]:py-0.5 [&>code]:rounded">
        {children}
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────────
// Table Component
// ────────────────────────────────────────────────────────────────────────────────
function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-700 my-6">
      <table className="w-full text-sm">
        <thead className="bg-slate-900 border-b border-slate-800">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="text-left py-3 px-4 font-medium text-white">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} className="py-3 px-4 text-slate-300 text-xs">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────────
// Feature Card Component
// ────────────────────────────────────────────────────────────────────────────────
function FeatureCard({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string 
}) {
  return (
    <div className="p-4 rounded-xl border border-slate-700 bg-[#0a0a0a] hover:border-slate-600 transition-colors">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-cyan-400" />
        <span className="text-white font-medium text-sm">{title}</span>
      </div>
      <p className="text-slate-400 text-xs">{description}</p>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────────
// Installation Page
// ────────────────────────────────────────────────────────────────────────────────
export default function InstallationPage() {
  return (
    <div className="min-h-screen bg-black font-sans antialiased overflow-x-hidden">
      {/* Background gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-300 h-200 bg-linear-to-b from-cyan-500/5 via-sky-500/3 to-transparent rounded-full blur-3xl" />
      </div>

      <Header />

      <div className="relative pt-16 lg:pt-20">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 overflow-x-hidden">
          
          <DocLayout>
            <div className="flex gap-10 xl:gap-14">
              {/* Main content column */}
              <div className="max-w-4xl min-w-0 flex-1">

                {/* Title + Copy page button */}
                <m.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start justify-between gap-4 mb-4"
                >
                  <div>
                    <h1 className="text-4xl font-bold text-white mb-2">{PAGE_TITLE}</h1>
                    <p className="text-slate-400 text-sm">Create a new Bini.js app and run it locally.</p>
                  </div>
                  <div className="shrink-0 pt-2 hidden sm:block">
                    <CopyPageButton pageUrl={PAGE_URL} pageTitle={PAGE_TITLE} />
                  </div>
                </m.div>
                
                {/* Copy button on small screens */}
                <div className="sm:hidden mb-8">
                  <CopyPageButton pageUrl={PAGE_URL} pageTitle={PAGE_TITLE} />
                </div>

                {/* Quick start */}
                <m.section 
                  id="quick-start" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.1 }} 
                  className="scroll-mt-24"
                >
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Quick start</h2>
                  <ol className="list-decimal list-inside text-slate-300 mb-4 space-y-1">
                    <li>Create a new Bini.js app named <code className="text-cyan-400">my-app</code></li>
                    <li><code className="text-cyan-400">cd my-app</code> and start the dev server.</li>
                    <li>Visit <code className="text-cyan-400">http://localhost:3000</code>.</li>
                  </ol>
                  
                  <DynamicTerminal />
                  
                  <Callout type="tip">
                    <strong>Pro tip:</strong> The default setup enables TypeScript, Tailwind CSS, Oxlint, App Router, with import alias <code>@/*</code>.
                  </Callout>
                </m.section>

                {/* Native Platform Support Section */}
                <m.section 
                  id="native-platform-support" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.12 }} 
                  className="mb-8 scroll-mt-24"
                >
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Native Platform Support</h2>
                  <p className="text-slate-300 mb-4">
                    Bini.js lets you build for multiple platforms from a single codebase. Use the <code className="text-cyan-400">--platform</code> flag to target your desired platform:
                  </p>

                  <CodeBlock 
                    code={`$ npx create-bini-app@latest my-app --platform macos\n$ npx create-bini-app@latest my-app --platform android --app-name "My App" --nosign\n$ npx create-bini-app@latest my-app --platform windows`}
                  />

                  <div className="grid sm:grid-cols-3 gap-3 mb-4">
                    <FeatureCard 
                      icon={Globe}
                      title="Web"
                      description="Default target with full framework features"
                    />
                    <FeatureCard 
                      icon={Laptop}
                      title="Desktop"
                      description="Windows, macOS, Linux — native binaries"
                    />
                    <FeatureCard 
                      icon={Smartphone}
                      title="Mobile"
                      description="Android & iOS — native apps"
                    />
                  </div>
                </m.section>

                {/* System requirements */}
                <m.section 
                  id="system-requirements" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.15 }} 
                  className="scroll-mt-24"
                >
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">System requirements</h2>
                  <p className="text-slate-300 mb-4">Before you begin, make sure your development environment meets the following requirements:</p>
                  
                  <Callout type="info">
                    <strong>Minimum Node.js version:</strong> <a href="https://nodejs.org/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">20.19.0</a>
                  </Callout>

                  <ul className="space-y-2 text-slate-300 mb-6 list-disc list-inside">
                    <li>Operating systems: macOS, Windows, and Linux.</li>
                    <li>For desktop builds: <span className="text-white">Windows</span> (C++ Build Tools), <span className="text-white">macOS</span> (Xcode CLT), <span className="text-white">Linux</span> (WebKitGTK)</li>
                    <li>For mobile builds: <span className="text-white">Android</span> (JDK 17, Android Studio), <span className="text-white">iOS</span> (Xcode, CocoaPods)</li>
                  </ul>
                </m.section>

                {/* Supported browsers */}
                <m.section 
                  id="supported-browsers" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.2 }} 
                  className="scroll-mt-24"
                >
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Supported browsers</h2>
                  <p className="text-slate-300 mb-4">Bini.js supports modern browsers with zero configuration.</p>
                  <ul className="space-y-1 text-slate-300 mb-6 list-disc list-inside">
                    <li>Chrome 111+</li>
                    <li>Edge 111+</li>
                    <li>Firefox 111+</li>
                    <li>Safari 16.4+</li>
                  </ul>
                </m.section>

                {/* Create with the CLI */}
                <m.section 
                  id="create-with-cli" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.25 }} 
                  className="scroll-mt-24"
                >
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Create with the CLI</h2>
                  <p className="text-slate-300 mb-4">
                    The quickest way to create a new Bini.js app is using <code className="text-cyan-400">create-bini-app</code>, which sets up everything automatically for you. To create a project, run:
                  </p>
                  
                  <SimpleTerminal code="$ npx create-bini-app@latest" />
                  
                  <p className="text-slate-300 mt-6">On installation, you'll see the following prompts:</p>
                  
                  <PromptTerminal 
                    code={`What is your project named? my-app\nWould you like to use TypeScript? No / Yes\nWould you like to use Tailwind CSS? No / Yes (CSS Modules) / None\nWhich platform would you like to target? web / windows / macos / linux / android / ios`}
                  />
                  
                  <Callout type="success">
                    <strong>Done!</strong> After the prompts, <code>create-bini-app</code> will create a folder with your project name and install the required dependencies.
                  </Callout>
                </m.section>

                {/* Run the development server */}
                <m.section 
                  id="run-dev-server" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.3 }} 
                  className="scroll-mt-24"
                >
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Run the development server</h2>
                  <ol className="list-decimal list-inside text-slate-300 mb-4 space-y-1">
                    <li>Run <code className="text-cyan-400">npm run dev</code> to start the development server.</li>
                    <li>Visit <code className="text-cyan-400">http://localhost:3000</code> to view your application.</li>
                    <li>Edit the <code className="text-cyan-400">app/page.tsx</code> file and save it to see the updated result in your browser.</li>
                  </ol>
                </m.section>

                {/* CLI Flags */}
                <m.section 
                  id="cli-flags" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.35 }} 
                  className="scroll-mt-24"
                >
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">CLI Flags</h2>
                  <p className="text-slate-300 mb-4">Skip prompts by passing flags directly:</p>
                  
                  <CodeBlock 
                    code={`$ npx create-bini-app@latest my-app --typescript --tailwind\n$ npx create-bini-app@latest my-app --javascript --css-modules\n$ npx create-bini-app@latest my-app --platform macos\n$ npx create-bini-app@latest my-app --platform android --app-name "My App" --nosign\n$ npx create-bini-app@latest my-app --none\n$ npx create-bini-app@latest my-app --force\n$ npx create-bini-app@latest my-app --install`} 
                  />
                  
                  <Table 
                    headers={['Flag', 'Description']} 
                    rows={[
                      ['--typescript', 'Use TypeScript (default)'],
                      ['--javascript', 'Use JavaScript'],
                      ['--tailwind', 'Use Tailwind CSS (default)'],
                      ['--css-modules', 'Use CSS Modules'],
                      ['--none', 'No styling — clean slate'],
                      ['--platform <target>', 'web · windows · macos · linux · android · ios'],
                      ['--app-name <name>', 'Display name for desktop/mobile apps'],
                      ['--sign / --nosign', 'Code-signing setup'],
                      ['--npm / --pnpm / --yarn / --bun', 'Force a specific package manager'],
                      ['--install / --no-install', 'Install dependencies'],
                      ['--force', 'Overwrite existing directory'],
                      ['--version, -v', 'Print CLI version'],
                      ['--help, -h', 'Show help'],
                    ]} 
                  />
                </m.section>

                {/* Set up TypeScript */}
                <m.section 
                  id="setup-typescript" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.4 }} 
                  className="scroll-mt-24"
                >
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Set up TypeScript</h2>
                  
                  <Callout type="info">
                    <strong>Minimum TypeScript version:</strong> v5.1.0
                  </Callout>
                  
                  <p className="text-slate-300 mb-4">
                    Bini.js comes with built-in TypeScript support. To add TypeScript to your project, rename a file to <code className="text-cyan-400">.ts</code> / <code className="text-cyan-400">.tsx</code> and run <code className="text-cyan-400">npm run dev</code>. Bini.js will automatically install the necessary dependencies and add a <code className="text-cyan-400">tsconfig.json</code> file with the recommended config options.
                  </p>
                </m.section>

                {/* Set up linting */}
                <m.section 
                  id="setup-linting" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.45 }} 
                  className="scroll-mt-24"
                >
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Set up linting</h2>
                  <p className="text-slate-300 mb-4">Bini.js uses Oxlint for linting and Oxfmt for formatting — pre-configured and ready to use.</p>
                  
                  <CodeBlock 
                    code={`{\n  "scripts": {\n    "lint": "oxlint",\n    "format": "oxfmt",\n    "check": "npm run lint && npm run format"\n  }\n}`}
                    filename="package.json"
                  />
                  
                  <p className="text-slate-400 text-sm mt-4">
                    These scripts refer to the different stages of developing an application:
                  </p>
                  
                  <ul className="space-y-1 text-slate-300 mb-6 list-disc list-inside">
                    <li><code className="text-cyan-400">npm run lint</code>: Runs Oxlint (50-100× faster than ESLint).</li>
                    <li><code className="text-cyan-400">npm run format</code>: Runs Oxfmt (Prettier-compatible).</li>
                    <li><code className="text-cyan-400">npm run check</code>: Runs both lint and format.</li>
                  </ul>
                </m.section>

                {/* Set up Absolute Imports */}
                <m.section 
                  id="setup-absolute-imports" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.5 }} 
                  className="scroll-mt-24"
                >
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Set up Absolute Imports and Module Path Aliases</h2>
                  
                  <p className="text-slate-300 mb-4">
                    Bini.js has built-in support for path aliases using the <code className="text-cyan-400">"paths"</code> option in <code className="text-cyan-400">tsconfig.json</code>.
                  </p>
                  
                  <p className="text-slate-300 mb-4">
                    These options allow you to alias project directories to absolute paths, making it easier and cleaner to import modules. For example:
                  </p>
                  
                  <CodeBlock 
                    code={`// Before\nimport { Button } from '../../../components/button'\n\n// After\nimport { Button } from '@/components/button'`} 
                  />
                  
                  <p className="text-slate-300 mt-4">Path aliases are configured by default:</p>
                  
                  <CodeBlock 
                    code={`{\n  "compilerOptions": {\n    "paths": {\n      "@/*": ["./src/*"]\n    }\n  }\n}`}
                    filename="tsconfig.json"
                  />
                  
                  <Callout type="tip">
                    <strong>Vite integration:</strong> Vite automatically resolves the <code>@</code> alias to the <code>src</code> directory.
                  </Callout>
                  
                  <CodeBlock 
                    code={`// vite.config.ts\nimport { defineConfig } from 'vite'\nimport react from '@vitejs/plugin-react'\nimport { biniroute } from 'bini-router'\nimport path from 'path'\n\nexport default defineConfig({\n  plugins: [react(), biniroute()],\n  resolve: {\n    alias: {\n      '@': path.resolve(__dirname, './src'),\n    },\n  },\n})`}
                    filename="vite.config.ts"
                  />
                </m.section>

                {/* Previous / Next Navigation */}
                <m.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.55 }} 
                  className="flex items-center justify-between pt-8 mt-8 border-t border-slate-800"
                >
                  <Link to="/docs" className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <div>
                      <div className="text-xs text-slate-500">Previous</div>
                      <div className="text-sm font-medium">Getting Started</div>
                    </div>
                  </Link>
                  <Link to="/docs/project-structure" className="group flex items-center gap-2 text-right text-slate-400 hover:text-white transition-colors">
                    <div>
                      <div className="text-xs text-slate-500">Next</div>
                      <div className="text-sm font-medium">Project Structure</div>
                    </div>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </m.div>

              </div>

              {/* Right-hand "On this page" sidebar */}
              <aside className="hidden xl:block w-56 shrink-0">
                <TableOfContents items={TOC_ITEMS} editUrl={EDIT_URL} />
              </aside>
            </div>
          </DocLayout>
          
        </div>
      </div>
    </div>
  )
}