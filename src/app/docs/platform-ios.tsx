// src/pages/docs/platform-ios/page.tsx
import React from 'react'
import { m } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Smartphone,
  CheckCircle,
  Terminal,
  Package,
  Shield,
  Zap,
  Play,
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
  { id: 'ios-overview', label: 'iOS Overview' },
  { id: 'requirements', label: 'Requirements' },
  { id: 'macos', label: 'macOS' },
  { id: 'windows', label: 'Windows' },
  { id: 'linux', label: 'Linux' },
  { id: 'creating-ios-app', label: 'Creating an iOS App' },
  { id: 'development', label: 'Development' },
  { id: 'building', label: 'Building' },
  { id: 'code-signing', label: 'Code Signing' },
  { id: 'deployment', label: 'Deployment' },
]

const PAGE_TITLE = 'iOS'
const PAGE_URL = 'https://bini.js.org/docs/platform-ios'
const EDIT_URL = 'https://github.com/Binidu01/bini-offical/edit/main/src/app/docs/platform-ios.tsx'

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
        code={`# .github/workflows/build-ios.yml
name: Build iOS App

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-ios:
    runs-on: macos-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm install
        
      - name: Install CocoaPods
        run: sudo gem install cocoapods
        
      - name: Install Rust targets
        run: |
          rustup target add aarch64-apple-ios
          rustup target add x86_64-apple-ios
          rustup target add aarch64-apple-ios-sim
          
      - name: Build iOS app
        run: npm run ios:build
        
      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: ios-build
          path: src-tauri/gen/ios/target/universal-apple-ios/release/*.app`}
        filename=".github/workflows/build-ios.yml"
      />
      <div className="mt-4 p-3 bg-slate-800/50 rounded-lg">
        <p className="text-slate-300 text-sm">
          <strong className="text-white">Why GitHub Actions?</strong> Tauri recommends GitHub Actions for cross-platform builds because:
        </p>
        <ul className="space-y-1 text-slate-300 text-sm list-disc list-inside mt-2">
          <li>No local Xcode setup required</li>
          <li>Consistent build environment</li>
          <li>Automatic artifact generation</li>
          <li>Works from Windows and Linux</li>
        </ul>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────────
// Platform iOS Page
// ────────────────────────────────────────────────────────────────────────────────
export default function PlatformIosPage() {
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
                    <p className="text-slate-400 text-sm">Build native iOS mobile applications with Bini.js.</p>
                  </div>
                  <div className="shrink-0 pt-2 hidden sm:block">
                    <CopyPageButton pageUrl={PAGE_URL} pageTitle={PAGE_TITLE} />
                  </div>
                </m.div>
                {/* Copy button on small screens */}
                <div className="sm:hidden mb-8">
                  <CopyPageButton pageUrl={PAGE_URL} pageTitle={PAGE_TITLE} />
                </div>

                {/* iOS Overview */}
                <m.section id="ios-overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">iOS Overview</h2>
                  <p className="text-slate-300 mb-4">
                    Bini.js allows you to build native iOS mobile applications using Tauri. Your React app runs inside a WKWebView with full access to native iOS APIs and features.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    <div className="p-4 rounded-xl border border-slate-700 bg-[#0a0a0a]">
                      <Smartphone className="w-5 h-5 text-cyan-400 mb-2" />
                      <h3 className="text-white font-medium text-sm">Native iOS App</h3>
                      <p className="text-slate-400 text-xs">Real native iOS app, not a WebView wrapper</p>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-700 bg-[#0a0a0a]">
                      <Shield className="w-5 h-5 text-cyan-400 mb-2" />
                      <h3 className="text-white font-medium text-sm">Code Signing</h3>
                      <p className="text-slate-400 text-xs">Xcode-managed automatic signing</p>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-700 bg-[#0a0a0a]">
                      <Zap className="w-5 h-5 text-cyan-400 mb-2" />
                      <h3 className="text-white font-medium text-sm">Auto Plugin Wiring</h3>
                      <p className="text-slate-400 text-xs">bini-native detects web APIs and wires iOS permissions automatically</p>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-700 bg-[#0a0a0a]">
                      <Package className="w-5 h-5 text-cyan-400 mb-2" />
                      <h3 className="text-white font-medium text-sm">Full Configuration</h3>
                      <p className="text-slate-400 text-xs">Splash screen, status bar, and more configurable</p>
                    </div>
                  </div>
                  <Note>
                    iOS apps are built using Tauri's iOS backend. Your app runs in a native WKWebView with full system access.
                  </Note>
                </m.section>

                {/* Requirements */}
                <m.section id="requirements" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Requirements</h2>
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-4">
                    <p className="text-amber-400 text-sm font-medium">
                      ⚠️ iOS development requires macOS with Xcode for local development
                    </p>
                  </div>
                  <p className="text-slate-300 mb-4">
                    Before building iOS apps, make sure you have the following installed:
                  </p>
                  <ul className="space-y-2 text-slate-300 mb-4 list-disc list-inside">
                    <li>macOS 11 (Big Sur) or higher (for local development)</li>
                    <li>Node.js <span className="text-white">20.19.0</span> or higher</li>
                    <li>Xcode (Mac App Store) — <a href="https://apps.apple.com/app/xcode/id497799835" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Download</a></li>
                    <li>Xcode Command Line Tools — <code className="text-cyan-400">xcode-select --install</code></li>
                    <li>CocoaPods — <code className="text-cyan-400">sudo gem install cocoapods</code></li>
                    <li>Rust targets:
                      <ul className="mt-2 ml-5 space-y-1 list-disc text-slate-400 text-sm">
                        <li><code className="text-cyan-400">rustup target add aarch64-apple-ios</code></li>
                        <li><code className="text-cyan-400">rustup target add x86_64-apple-ios</code></li>
                        <li><code className="text-cyan-400">rustup target add aarch64-apple-ios-sim</code></li>
                      </ul>
                    </li>
                  </ul>
                  <Note>
                    iOS development is only supported on macOS for local development. Windows and Linux users can use GitHub Actions.
                  </Note>
                </m.section>

                {/* macOS */}
                <m.section id="macos" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">macOS</h2>
                  <p className="text-slate-300 mb-4">
                    Build iOS apps natively on macOS using Xcode and the CLI.
                  </p>
                  <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 mb-4">
                    <h3 className="text-white font-semibold mb-2">Setup on macOS</h3>
                    <ul className="space-y-1 text-slate-300 text-sm list-disc list-inside">
                      <li>Install Xcode from the Mac App Store</li>
                      <li>Install Xcode Command Line Tools with <code className="text-cyan-400">xcode-select --install</code></li>
                      <li>Install CocoaPods with <code className="text-cyan-400">sudo gem install cocoapods</code></li>
                      <li>Install Node.js from <a href="https://nodejs.org/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">nodejs.org</a></li>
                      <li>Install Rust targets with <code className="text-cyan-400">rustup</code></li>
                    </ul>
                  </div>
                  <CodeBlock 
                    code={`# Create a new iOS project
npx create-bini-app@latest my-app --platform ios

# Navigate to project
cd my-app

# Install dependencies
npm install
pod install --project-directory=src-tauri/gen/ios

# Run on simulator or device
npm run ios

# Build for distribution
npm run ios:build`}
                  />
                  <Note>
                    iOS development requires macOS with Xcode. All iOS development commands work on macOS.
                  </Note>
                </m.section>

                {/* Windows */}
                <m.section id="windows" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Windows</h2>
                  <p className="text-slate-300 mb-4">
                    Build iOS apps from Windows using GitHub Actions. This is the recommended approach for cross-platform builds.
                  </p>
                  <GitHubActionsWorkflow />
                  <Note>
                    GitHub Actions runs on macOS runners to build native iOS applications. This works from Windows.
                  </Note>
                </m.section>

                {/* Linux */}
                <m.section id="linux" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Linux</h2>
                  <p className="text-slate-300 mb-4">
                    Build iOS apps from Linux using GitHub Actions. This is the recommended approach for cross-platform builds.
                  </p>
                  <GitHubActionsWorkflow />
                  <Note>
                    GitHub Actions with <code>macos-latest</code> runners is the official Tauri-recommended approach for building iOS apps from Linux.
                  </Note>
                </m.section>

                {/* Creating an iOS App */}
                <m.section id="creating-ios-app" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Creating an iOS App</h2>
                  <p className="text-slate-300 mb-4">
                    Create a new Bini.js project targeting iOS:
                  </p>
                  <CodeBlock 
                    code={`npx create-bini-app@latest my-app --platform ios`}
                  />
                  <p className="text-slate-300 mt-4">
                    Or use the interactive prompt and select <code className="text-cyan-400">ios</code>:
                  </p>
                  <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 mb-4">
                    <p className="text-slate-300 text-sm">
                      <span className="text-white">Prompt:</span> Which platform would you like to target?
                    </p>
                    <p className="text-cyan-400 text-sm mt-1">web / windows / macos / linux / android / ios</p>
                    <p className="text-emerald-400 text-sm mt-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Select <span className="font-medium">ios</span> and press Enter
                    </p>
                  </div>
                  <CodeBlock 
                    code={`npx create-bini-app@latest`}
                  />
                  <p className="text-slate-300 mt-4">
                    After installation, navigate to your project and install dependencies:
                  </p>
                  <CodeBlock 
                    code={`cd my-app
npm install
pod install --project-directory=src-tauri/gen/ios`}
                  />
                </m.section>

                {/* Development */}
                <m.section id="development" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Development</h2>
                  <p className="text-slate-300 mb-4">
                    Run your iOS app on the simulator or a connected device:
                  </p>
                  <CodeBlock 
                    code={`npm run ios`}
                  />
                  <p className="text-slate-300 mt-4">
                    This launches your app with:
                  </p>
                  <ul className="space-y-2 text-slate-300 mb-4 list-disc list-inside">
                    <li>Hot reload for frontend changes</li>
                    <li>Native iOS integration</li>
                    <li>Auto-wired native APIs (<code className="text-cyan-400">bini-native</code>)</li>
                    <li>Safari Web Inspector for debugging</li>
                  </ul>
                  <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 mt-4">
                    <h3 className="text-white font-semibold mb-2">Setting up a Simulator</h3>
                    <ol className="space-y-1 text-slate-300 text-sm list-decimal list-inside">
                      <li>Open Xcode</li>
                      <li>Go to <strong className="text-white">Preferences</strong> → <strong className="text-white">Components</strong></li>
                      <li>Download a simulator for your target iOS version</li>
                      <li>Run <code className="text-cyan-400">npm run ios</code></li>
                    </ol>
                  </div>
                </m.section>

                {/* Building */}
                <m.section id="building" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Building</h2>
                  <p className="text-slate-300 mb-4">
                    Build your iOS app for distribution:
                  </p>
                  <CodeBlock 
                    code={`npm run ios:build`}
                  />
                  <p className="text-slate-300 mt-4">
                    This creates a signed iOS app in the <code className="text-cyan-400">src-tauri/gen/ios/target/universal-apple-ios/release/</code> directory.
                  </p>
                  <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 mb-4">
                    <h3 className="text-white font-semibold mb-2">Output Files</h3>
                    <ul className="space-y-1 text-slate-300 text-sm list-disc list-inside">
                      <li><code className="text-cyan-400">my-app.app</code> — iOS app bundle</li>
                      <li><code className="text-cyan-400">my-app.ipa</code> — iOS App Store package (if configured)</li>
                    </ul>
                  </div>
                  <Note>
                    The build output is a native iOS app that runs on iOS 13.0 and above.
                  </Note>
                </m.section>

                {/* Code Signing */}
                <m.section id="code-signing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Code Signing</h2>
                  <p className="text-slate-300 mb-4">
                    iOS code signing is managed by Xcode. Configure signing in <code className="text-cyan-400">src-tauri/gen/ios/</code>:
                  </p>
                  <CodeBlock 
                    code={`# For development
# Xcode handles automatic signing with your Apple ID

# For distribution
# Configure signing in Xcode project:
# src-tauri/gen/ios/MyApp.xcodeproj`}
                  />
                  <p className="text-slate-300 mt-4">
                    For GitHub Actions, you can use secrets for secure certificate storage:
                  </p>
                  <CodeBlock 
                    code={`# In GitHub Actions workflow
- name: Build iOS app
  env:
    APPLE_ID: \${{ secrets.APPLE_ID }}
    APPLE_PASSWORD: \${{ secrets.APPLE_PASSWORD }}
    TEAM_ID: \${{ secrets.TEAM_ID }}
  run: npm run ios:build`}
                  />
                  <Note>
                    For App Store distribution, you need an Apple Developer account and provisioning profiles. Development builds use Xcode's automatic signing.
                  </Note>
                </m.section>

                {/* Deployment */}
                <m.section id="deployment" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Deployment</h2>
                  <p className="text-slate-300 mb-4">
                    Deploy your iOS project by pushing to GitHub:
                  </p>
                  <CodeBlock 
                    code={`npm run deploy`}
                  />
                  <p className="text-slate-300 mt-4">
                    <code className="text-cyan-400">deploy</code> does not build, sign, or submit to the App Store — it pushes the project source to GitHub.
                  </p>
                  <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 mb-4">
                    <h3 className="text-white font-semibold mb-2">Deployment Flow</h3>
                    <ol className="space-y-1 text-slate-300 text-sm list-decimal list-inside">
                      <li>Build your app with <code className="text-cyan-400">npm run ios:build</code></li>
                      <li>Run <code className="text-cyan-400">npm run deploy</code> to push source to GitHub</li>
                      <li>Upload the app to App Store Connect manually</li>
                    </ol>
                  </div>
                  <Note>
                    Store submission is manual. After building your app, upload it to App Store Connect for TestFlight or App Store distribution.
                  </Note>
                </m.section>

                {/* Previous / Next Navigation */}
                <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex items-center justify-between pt-8 mt-8 border-t border-slate-800">
                  <Link to="/docs/platform-android" className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <div>
                      <div className="text-xs text-slate-500">Previous</div>
                      <div className="text-sm font-medium">Android</div>
                    </div>
                  </Link>
                  <Link to="/docs/deploying" className="group flex items-center gap-2 text-right text-slate-400 hover:text-white transition-colors">
                    <div>
                      <div className="text-xs text-slate-500">Next</div>
                      <div className="text-sm font-medium">Deployment</div>
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