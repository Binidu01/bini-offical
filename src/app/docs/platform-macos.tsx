// src/pages/docs/platform-macos/page.tsx
import React from 'react'
import { m } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Monitor,
  CheckCircle,
  Terminal,
  Package,
  Shield,
  Zap,
  Apple,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Header } from '../../components/Layout'
import { DocLayout } from '../../components/DocSidebar'
import { CopyPageButton } from '../../components/CopyPageButton'
import { TableOfContents, type TocItem } from '../../components/TableOfContents'
import { siGithub } from 'simple-icons'

// ────────────────────────────────────────────────────────────────────────────────
// Simple Icon Component
// ────────────────────────────────────────────────────────────────────────────────
function SimpleIcon({ 
  icon, 
  className = "", 
  size = 20 
}: { 
  icon: typeof siGithub
  className?: string
  size?: number 
}) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
      dangerouslySetInnerHTML={{ __html: icon.svg }}
    />
  )
}

// ────────────────────────────────────────────────────────────────────────────────
// "On this page" entries
// ────────────────────────────────────────────────────────────────────────────────
const TOC_ITEMS: TocItem[] = [
  { id: 'macos-overview', label: 'macOS Overview' },
  { id: 'requirements', label: 'Requirements' },
  { id: 'native-macos', label: 'Native macOS' },
  { id: 'windows', label: 'Windows' },
  { id: 'linux', label: 'Linux' },
  { id: 'creating-macos-app', label: 'Creating a macOS App' },
  { id: 'development', label: 'Development' },
  { id: 'building', label: 'Building' },
  { id: 'code-signing', label: 'Code Signing' },
]

const PAGE_TITLE = 'macOS'
const PAGE_URL = 'https://bini.js.org/docs/platform-macos'
const EDIT_URL = 'https://github.com/Binidu01/bini-offical/edit/main/src/app/docs/platform-macos.tsx'

// ────────────────────────────────────────────────────────────────────────────────
// Code Block Component with horizontal scrollbar
// ────────────────────────────────────────────────────────────────────────────────
function CodeBlock({ code, filename }: { code: string; filename?: string }) {
  const [copied, setCopied] = React.useState(false)
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
      <button onClick={handleCopy} className="absolute top-2 right-2 p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 transition-colors z-10 opacity-0 group-hover:opacity-100" style={{ top: filename ? '3rem' : '0.5rem' }}>
        {copied ? (
          <svg className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
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
// Table Component
// ────────────────────────────────────────────────────────────────────────────────
function Table({ headers, rows }: { headers: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-700 my-6">
      <table className="w-full text-sm">
        <thead className="bg-slate-900 border-b border-slate-800">
          <tr>{headers.map((h, i) => <th key={i} className="text-left py-3 px-4 font-medium text-white">{h}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j} className="py-3 px-4 text-slate-300 text-xs">{cell}</td>)}</tr>)}
        </tbody>
      </table>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────────
// Note Component
// ────────────────────────────────────────────────────────────────────────────────
function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800 my-6">
      <div className="text-sm text-slate-300 [&>strong]:text-white [&>code]:text-cyan-400 [&>code]:bg-slate-800 [&>code]:px-1 [&>code]:py-0.5 [&>code]:rounded">{children}</div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────────
// GitHub Actions Workflow Component
// ────────────────────────────────────────────────────────────────────────────────
function GitHubActionsWorkflow() {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <SimpleIcon icon={siGithub} className="w-5 h-5 text-white" size={20} />
        <span className="text-white font-medium">GitHub Actions Workflow</span>
      </div>
      <CodeBlock 
        code={`# .github/workflows/build-macos.yml
name: Build macOS App

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-macos:
    runs-on: macos-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm install
        
      - name: Build macOS app
        run: npm run tauri:build
        
      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: macos-build
          path: src-tauri/target/release/bundle/macos/*.app`}
        filename=".github/workflows/build-macos.yml"
      />
      <div className="mt-4 p-3 bg-slate-800/50 rounded-lg">
        <p className="text-slate-300 text-sm">
          <strong className="text-white">Why GitHub Actions?</strong> Tauri recommends GitHub Actions for cross-platform builds because:
        </p>
        <ul className="space-y-1 text-slate-300 text-sm list-disc list-inside mt-2">
          <li>No local toolchain setup required</li>
          <li>Consistent build environment</li>
          <li>Automatic artifact generation</li>
          <li>Works from any operating system</li>
        </ul>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────────
// Platform macOS Page
// ────────────────────────────────────────────────────────────────────────────────
export default function PlatformMacosPage() {
  return (
    <div className="min-h-screen bg-black font-sans antialiased overflow-x-hidden">
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
                    <p className="text-slate-400 text-sm">Build native macOS desktop applications with Bini.js.</p>
                  </div>
                  <div className="shrink-0 pt-2 hidden sm:block">
                    <CopyPageButton pageUrl={PAGE_URL} pageTitle={PAGE_TITLE} />
                  </div>
                </m.div>
                {/* Copy button on small screens */}
                <div className="sm:hidden mb-8">
                  <CopyPageButton pageUrl={PAGE_URL} pageTitle={PAGE_TITLE} />
                </div>

                {/* macOS Overview */}
                <m.section id="macos-overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">macOS Overview</h2>
                  <p className="text-slate-300 mb-4">
                    Bini.js allows you to build native macOS desktop applications using Tauri. Your React app is wrapped in a WKWebView binary, providing a native experience with full system access.
                  </p>
                  <div className="grid sm:grid-cols-3 gap-3 mb-6">
                    <div className="p-4 rounded-xl border border-slate-700 bg-[#0a0a0a]">
                      <Apple className="w-5 h-5 text-cyan-400 mb-2" />
                      <h3 className="text-white font-medium text-sm">Native Binary</h3>
                      <p className="text-slate-400 text-xs">macOS app bundle (.app) with Developer ID signing</p>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-700 bg-[#0a0a0a]">
                      <Shield className="w-5 h-5 text-cyan-400 mb-2" />
                      <h3 className="text-white font-medium text-sm">Code Signing</h3>
                      <p className="text-slate-400 text-xs">Developer ID and notarization support</p>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-700 bg-[#0a0a0a]">
                      <Zap className="w-5 h-5 text-cyan-400 mb-2" />
                      <h3 className="text-white font-medium text-sm">Native APIs</h3>
                      <p className="text-slate-400 text-xs">Full access to macOS APIs via Tauri</p>
                    </div>
                  </div>
                  <Note>
                    macOS desktop apps are built using Tauri's WKWebView backend. Your app runs in a native window with full system access.
                  </Note>
                </m.section>

                {/* Requirements */}
                <m.section id="requirements" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Requirements</h2>
                  <p className="text-slate-300 mb-4">
                    Before building macOS apps, make sure you have the following installed:
                  </p>
                  <ul className="space-y-2 text-slate-300 mb-4 list-disc list-inside">
                    <li>Node.js <span className="text-white">20.19.0</span> or higher</li>
                    <li>Xcode Command Line Tools — <code className="text-cyan-400">xcode-select --install</code></li>
                    <li>Full Xcode (for building and notarization) — <a href="https://apps.apple.com/app/xcode/id497799835" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Download</a></li>
                  </ul>
                  <Note>
                    Xcode Command Line Tools are required to compile the Tauri backend. Full Xcode is recommended for distribution.
                  </Note>
                </m.section>

                {/* Native macOS */}
                <m.section id="native-macos" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Native macOS</h2>
                  <p className="text-slate-300 mb-4">
                    Build natively on macOS using the CLI. The development and build commands run directly on your Mac.
                  </p>
                  <CodeBlock 
                    code={`# Create a macOS project
npx create-bini-app@latest my-app --platform macos

# Navigate to project
cd my-app

# Install dependencies
npm install

# Run in development mode
npm run tauri:dev

# Build the macOS app bundle
npm run tauri:build`}
                  />
                  <p className="text-slate-300 mt-4">
                    The build output is a native macOS application bundle (<code className="text-cyan-400">.app</code>) ready for distribution.
                  </p>
                  <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 mt-4">
                    <p className="text-slate-300 text-sm">
                      <strong className="text-white">Tip:</strong> Use <code className="text-cyan-400">--sign</code> during scaffold to set up Developer ID signing.
                    </p>
                  </div>
                </m.section>

                {/* Windows */}
                <m.section id="windows" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Windows</h2>
                  <p className="text-slate-300 mb-4">
                    Build macOS apps from Windows using GitHub Actions. This is the recommended approach for cross-platform builds.
                  </p>
                  <GitHubActionsWorkflow />
                  <Note>
                    GitHub Actions runs on macOS runners to build native macOS applications. This works from any OS.
                  </Note>
                </m.section>

                {/* Linux */}
                <m.section id="linux" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Linux</h2>
                  <p className="text-slate-300 mb-4">
                    Build macOS apps from Linux using GitHub Actions. This is the recommended approach and is used by Tauri for cross-platform builds.
                  </p>
                  <GitHubActionsWorkflow />
                  <Note>
                    GitHub Actions with <code>macos-latest</code> runners is the official Tauri-recommended approach for building macOS apps from Linux.
                  </Note>
                </m.section>

                {/* Creating a macOS App */}
                <m.section id="creating-macos-app" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Creating a macOS App</h2>
                  <p className="text-slate-300 mb-4">
                    Create a new Bini.js project targeting macOS:
                  </p>
                  <CodeBlock 
                    code={`npx create-bini-app@latest my-app --platform macos`}
                  />
                  <p className="text-slate-300 mt-4">
                    Or use the interactive prompt and select <code className="text-cyan-400">macos</code>:
                  </p>
                  <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 mb-4">
                    <p className="text-slate-300 text-sm">
                      <span className="text-white">Prompt:</span> Which platform would you like to target?
                    </p>
                    <p className="text-cyan-400 text-sm mt-1">web / windows / macos / linux / android / ios</p>
                    <p className="text-emerald-400 text-sm mt-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Select <span className="font-medium">macos</span> and press Enter
                    </p>
                  </div>
                  <CodeBlock 
                    code={`npx create-bini-app@latest`}
                  />
                </m.section>

                {/* Development */}
                <m.section id="development" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Development</h2>
                  <p className="text-slate-300 mb-4">
                    Run your macOS app in development mode:
                  </p>
                  <CodeBlock 
                    code={`npm run tauri:dev`}
                  />
                  <p className="text-slate-300 mt-4">
                    This launches your app in a native macOS window with:
                  </p>
                  <ul className="space-y-2 text-slate-300 mb-4 list-disc list-inside">
                    <li>Hot reload for frontend changes</li>
                    <li>Native window with menu bar integration</li>
                    <li>Access to macOS APIs</li>
                    <li>Devtools for debugging</li>
                  </ul>
                </m.section>

                {/* Building */}
                <m.section id="building" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Building</h2>
                  <p className="text-slate-300 mb-4">
                    Build a distributable macOS application:
                  </p>
                  <CodeBlock 
                    code={`npm run tauri:build`}
                  />
                  <p className="text-slate-300 mt-4">
                    This creates a signed macOS app bundle in the <code className="text-cyan-400">src-tauri/target/release/bundle/macos/</code> directory.
                  </p>
                  <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 mb-4">
                    <h3 className="text-white font-semibold mb-2">Output Files</h3>
                    <ul className="space-y-1 text-slate-300 text-sm list-disc list-inside">
                      <li><code className="text-cyan-400">my-app.app</code> — The main app bundle</li>
                      <li><code className="text-cyan-400">my-app.dmg</code> — Disk image for distribution</li>
                      <li><code className="text-cyan-400">my-app.pkg</code> — Installer package (if configured)</li>
                    </ul>
                  </div>
                  <Note>
                    The build output is a native macOS application that runs without any additional dependencies.
                  </Note>
                </m.section>

                {/* Code Signing */}
                <m.section id="code-signing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Code Signing</h2>
                  <p className="text-slate-300 mb-4">
                    Bini.js supports Developer ID signing and notarization for macOS binaries. Configure signing in <code className="text-cyan-400">src-tauri/tauri.conf.json</code>:
                  </p>
                  <CodeBlock 
                    code={`{
  "tauri": {
    "bundle": {
      "macOS": {
        "signing": {
          "identity": "Developer ID Application: Your Name (TEAM_ID)",
          "notarization": {
            "appleId": "your@email.com",
            "password": "your-app-specific-password",
            "teamId": "TEAM_ID"
          }
        }
      }
    }
  }
}`}
                    filename="src-tauri/tauri.conf.json"
                  />
                  <p className="text-slate-300 mt-4">
                    For GitHub Actions, you can use secrets for secure credential storage:
                  </p>
                  <CodeBlock 
                    code={`# In GitHub Actions workflow
- name: Build macOS app
  env:
    APPLE_ID: \${{ secrets.APPLE_ID }}
    APPLE_PASSWORD: \${{ secrets.APPLE_PASSWORD }}
    TEAM_ID: \${{ secrets.TEAM_ID }}
  run: npm run tauri:build`}
                  />
                  <Note>
                    For production distribution, Developer ID signing and notarization are required to avoid Gatekeeper warnings.
                  </Note>
                </m.section>

                {/* Previous / Next Navigation */}
                <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="flex items-center justify-between pt-8 mt-8 border-t border-slate-800">
                  <Link to="/docs/platform-windows" className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <div>
                      <div className="text-xs text-slate-500">Previous</div>
                      <div className="text-sm font-medium">Windows</div>
                    </div>
                  </Link>
                  <Link to="/docs/platform-linux" className="group flex items-center gap-2 text-right text-slate-400 hover:text-white transition-colors">
                    <div>
                      <div className="text-xs text-slate-500">Next</div>
                      <div className="text-sm font-medium">Linux</div>
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