// src/pages/docs/platforms/page.tsx
import React from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Smartphone,
  Laptop,
  Globe,
  Monitor,
  Terminal,
  CheckCircle,
  ExternalLink,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Header } from '../../components/Layout'
import { DocLayout } from '../../components/DocSidebar'
import { siApple, siLinux, siAndroid } from 'simple-icons'

// ────────────────────────────────────────────────────────────────────────────────
// Simple Icon component
// ────────────────────────────────────────────────────────────────────────────────
function SimpleIcon({
  icon,
  className = '',
  size = 20,
}: {
  icon: typeof siApple
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
// Code Block Component
// ────────────────────────────────────────────────────────────────────────────────
function CodeBlock({ code, filename }: { code: string; filename?: string }) {
  const [copied, setCopied] = React.useState(false)
  const handleCopy = () => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000) }

  return (
    <div className="relative group mb-6">
      {filename && (
        <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border border-slate-800 border-b-0 rounded-t-lg">
          <span className="text-sm text-slate-300 font-mono">{filename}</span>
        </div>
      )}
      <button onClick={handleCopy} className="absolute top-2 right-2 p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 transition-colors z-10 opacity-0 group-hover:opacity-100" style={{ top: filename ? '3rem' : '0.5rem' }}>
        {copied ? (
          <CheckCircle className="w-3.5 h-3.5 text-green-400" />
        ) : (
          <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )}
      </button>
      <pre className={`bg-[#0a0a0a] border border-slate-700 ${filename ? 'rounded-t-none' : 'rounded-lg'} p-4 overflow-x-auto`}>
        <code className="text-sm font-mono text-slate-200">{code}</code>
      </pre>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────────
// Callout Component
// ────────────────────────────────────────────────────────────────────────────────
function Callout({ type, children }: { type: 'info' | 'warning' | 'success' | 'tip'; children: React.ReactNode }) {
  const styles = {
    info: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', icon: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, color: 'text-cyan-400' },
    warning: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', icon: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>, color: 'text-amber-400' },
    success: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', icon: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, color: 'text-emerald-400' },
    tip: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', icon: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>, color: 'text-purple-400' },
  }
  const style = styles[type]
  const Icon = style.icon

  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg ${style.bg} border ${style.border} my-6`}>
      <Icon className={`w-5 h-5 ${style.color} shrink-0 mt-0.5`} />
      <div className="text-sm text-slate-200 [&>strong]:text-white [&>code]:text-cyan-400 [&>code]:bg-slate-800 [&>code]:px-1 [&>code]:py-0.5 [&>code]:rounded">{children}</div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────────
// Platform Card Component
// ────────────────────────────────────────────────────────────────────────────────
function PlatformCard({ 
  name, 
  icon, 
  color, 
  description, 
  features, 
  commands,
  requirements,
  badge,
}: { 
  name: string
  icon: React.ReactNode
  color: string
  description: string
  features: string[]
  commands: { label: string; command: string }[]
  requirements: string[]
  badge?: string
}) {
  return (
    <div className={`rounded-xl border border-slate-700 bg-[#0a0a0a] overflow-hidden hover:border-${color}-500/30 transition-colors`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg bg-${color}-500/10 border border-${color}-500/30 flex items-center justify-center`}>
              {icon}
            </div>
            <h3 className={`text-lg font-semibold text-${color}-400`}>{name}</h3>
          </div>
          {badge && (
            <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-full bg-${color}-500/10 border border-${color}-500/30 text-${color}-400`}>
              {badge}
            </span>
          )}
        </div>
        
        <p className="text-slate-400 text-sm mb-4">{description}</p>
        
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Features</h4>
          <ul className="space-y-1">
            {features.map((feature, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <CheckCircle className={`w-3.5 h-3.5 text-${color}-400 shrink-0 mt-0.5`} />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Commands</h4>
          <div className="space-y-1.5">
            {commands.map((cmd, i) => (
              <div key={i} className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/50 border border-slate-800/60 rounded-md px-3 py-1.5 truncate">
                <Terminal className="w-3 h-3 text-slate-500 shrink-0" />
                <span>{cmd.command}</span>
                <span className="text-slate-500 text-[10px] ml-auto">{cmd.label}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Requirements</h4>
          <ul className="space-y-1">
            {requirements.map((req, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                <span className="text-slate-600">•</span>
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────────
// Platforms Page
// ────────────────────────────────────────────────────────────────────────────────
export default function PlatformsPage() {
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
            <div className="max-w-4xl">
              
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-4xl font-bold text-white mb-2">Platforms</h1>
                <p className="text-slate-400 text-sm mb-8">
                  Build native apps for web, desktop, and mobile from a single codebase.
                </p>
              </motion.div>

              {/* Overview */}
              <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Overview</h2>
                <p className="text-slate-300 mb-4">
                  Bini.js lets you build for multiple platforms from a single codebase. Use the <code className="text-cyan-400">--platform</code> flag when scaffolding your project to target your desired platform.
                </p>
                <CodeBlock code={`npx create-bini-app@latest my-app --platform macos\nnpx create-bini-app@latest my-app --platform android --app-name "My App" --nosign\nnpx create-bini-app@latest my-app --platform windows`} />
                <p className="text-slate-400 text-sm mt-4">
                  Each platform gets exactly the dependencies, scripts, and config it needs — nothing more.
                </p>
              </motion.section>

              {/* Platform Cards */}
              <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mt-8">
                <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Platforms</h2>
                
                <div className="space-y-6">
                  {/* Web */}
                  <PlatformCard
                    name="Web"
                    icon={<Globe className="w-5 h-5 text-cyan-400" />}
                    color="cyan"
                    description="The default target. A standard Vite + React SPA with file-based routing and a Hono API layer."
                    features={[
                      "Zero-dependency production server (bini-server)",
                      "Static export (bini-export) for any static host",
                      "Deploy to Netlify Edge, Vercel Edge, Cloudflare Workers, Node.js, or Deno",
                    ]}
                    commands={[
                      { label: "Dev server with HMR", command: "npm run dev" },
                      { label: "Serve production build", command: "npm start" },
                      { label: "Static export", command: "npm run export" },
                    ]}
                    requirements={[
                      "Node.js >= 20.19.0",
                    ]}
                    badge="Default"
                  />

                  {/* Windows - using real Windows icon */}
                  <PlatformCard
                    name="Windows"
                    icon={
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 512 512.02" 
                        className="w-5 h-5 text-cyan-400"
                        fill="currentColor"
                      >
                        <path fillRule="nonzero" d="M0 512.02h242.686V269.335H0V512.02zm0-269.334h242.686V0H0v242.686zm269.314 0H512V0H269.314v242.686zm0 269.334H512V269.335H269.314V512.02z"/>
                      </svg>
                    }
                    color="cyan"
                    description="A native desktop binary running inside WebView2 with Authenticode code signing."
                    features={[
                      "Filesystem, clipboard, notifications, and dialogs via @tauri-apps/api",
                      "Auto-wired by bini-native",
                      "Authenticode code signing configurable at scaffold time",
                    ]}
                    commands={[
                      { label: "Run in development", command: "npm run tauri:dev" },
                      { label: "Build distributable binary", command: "npm run tauri:build" },
                      { label: "Regenerate icons", command: "npm run tauri:icon" },
                    ]}
                    requirements={[
                      "Microsoft C++ Build Tools — install with 'Desktop development with C++'",
                      "Microsoft Edge WebView2 Runtime",
                    ]}
                  />

                  {/* macOS - using Apple logo */}
                  <PlatformCard
                    name="macOS"
                    icon={<SimpleIcon icon={siApple} className="w-5 h-5 text-purple-400" />}
                    color="purple"
                    description="A native desktop binary running inside WKWebView with Developer ID and notarization."
                    features={[
                      "Same @tauri-apps/api access as Windows/Linux",
                      "Auto-wired by bini-native",
                      "Ad-hoc signing for local runs, or Developer ID + notarization for distribution",
                    ]}
                    commands={[
                      { label: "Run in development", command: "npm run tauri:dev" },
                      { label: "Build distributable binary", command: "npm run tauri:build" },
                      { label: "Regenerate icons", command: "npm run tauri:icon" },
                    ]}
                    requirements={[
                      "Xcode Command Line Tools — xcode-select --install",
                      "Homebrew, then brew install gtk+3 webkit2gtk pkg-config",
                      "Full Xcode (Mac App Store) if building for iOS",
                    ]}
                  />

                  {/* Linux - using Linux logo */}
                  <PlatformCard
                    name="Linux"
                    icon={<SimpleIcon icon={siLinux} className="w-5 h-5 text-amber-400" />}
                    color="amber"
                    description="A native desktop binary running inside WebKitGTK, distributed as a GPG-signed AppImage."
                    features={[
                      "Same @tauri-apps/api access as Windows/macOS",
                      "Auto-wired by bini-native",
                      "GPG-signed AppImage output configurable at scaffold time",
                    ]}
                    commands={[
                      { label: "Run in development", command: "npm run tauri:dev" },
                      { label: "Build distributable AppImage", command: "npm run tauri:build" },
                      { label: "Regenerate icons", command: "npm run tauri:icon" },
                    ]}
                    requirements={[
                      "Debian/Ubuntu: apt install libwebkit2gtk-4.0-dev build-essential libssl-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev libxdo-dev pkg-config",
                      "Fedora: dnf install webkit2gtk4.0-devel openssl-devel gtk3-devel libappindicator-gtk3-devel librsvg2-devel libxdo-devel pkg-config",
                      "Arch: pacman -S webkit2gtk base-devel openssl gtk3 libappindicator-gtk3 librsvg libxdo pkg-config",
                    ]}
                  />

                  {/* Android - using Android logo */}
                  <PlatformCard
                    name="Android"
                    icon={<SimpleIcon icon={siAndroid} className="w-5 h-5 text-emerald-400" />}
                    color="emerald"
                    description="A real native APK/AAB via Tauri's Android backend — not a WebView wrapper."
                    features={[
                      "Camera, filesystem, notifications, and geolocation auto-wired by bini-native",
                      "Back button, status bar, and splash screen configurable",
                      "Release signing (keystore + keystore.properties) configurable at scaffold time",
                    ]}
                    commands={[
                      { label: "Run on emulator or device", command: "npm run android" },
                      { label: "Build release APK/AAB", command: "npm run android:build" },
                    ]}
                    requirements={[
                      "Java JDK 17 (JAVA_HOME set)",
                      "Android Studio with SDK/Build Tools/NDK (ANDROID_HOME set)",
                      "Rust targets: rustup target add aarch64-linux-android armv7-linux-androideabi i686-linux-android x86_64-linux-android",
                    ]}
                  />

                  {/* iOS - using Apple logo */}
                  <PlatformCard
                    name="iOS"
                    icon={<SimpleIcon icon={siApple} className="w-5 h-5 text-blue-400" />}
                    color="blue"
                    description="A real native app via Tauri's iOS backend, running inside WKWebView. macOS + Xcode required."
                    features={[
                      "Same native plugin wiring story as Android",
                      "Xcode-managed automatic signing for local runs",
                      "Manual certificate/profile signing for CI",
                    ]}
                    commands={[
                      { label: "Run on Simulator or device", command: "npm run ios" },
                      { label: "Build the app", command: "npm run ios:build" },
                    ]}
                    requirements={[
                      "Xcode (Mac App Store) + Command Line Tools — xcode-select --install",
                      "CocoaPods — sudo gem install cocoapods",
                      "Rust targets: rustup target add aarch64-apple-ios x86_64-apple-ios aarch64-apple-ios-sim",
                    ]}
                  />
                </div>
              </motion.section>

              {/* Native Plugin Wiring */}
              <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-8">
                <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Native Plugin Wiring</h2>
                <p className="text-slate-300 mb-4">
                  Bini.js automatically wires native plugins for desktop and mobile platforms. <code className="text-cyan-400">bini-native</code> detects the web APIs you call and handles everything:
                </p>
                <ul className="space-y-2 text-slate-300 mb-4 list-disc list-inside">
                  <li><span className="text-white font-medium">Auto plugin detection</span> — Identifies which Tauri plugins you need</li>
                  <li><span className="text-white font-medium">Cargo.toml wiring</span> — Adds the right Rust dependencies</li>
                  <li><span className="text-white font-medium">Capability permissions</span> — Configures the permissions your app needs</li>
                  <li><span className="text-white font-medium">Android/iOS manifests</span> — Updates platform manifests automatically</li>
                  <li><span className="text-white font-medium">Zero manual edits</span> — No need to touch Rust or native config files</li>
                </ul>
                <Callout type="tip">
                  <strong>Dev-only wiring.</strong> <code className="text-cyan-400">bini-native</code> runs only in development. Your production build stays untouched and exactly what you configured.
                </Callout>
              </motion.section>

              {/* Platform Comparison */}
              <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mt-8">
                <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Platform Comparison</h2>
                <div className="overflow-x-auto rounded-lg border border-slate-700">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-900 border-b border-slate-800">
                      <tr>
                        <th className="text-left py-3 px-4 font-medium text-white">Feature</th>
                        <th className="text-left py-3 px-4 font-medium text-white">Web</th>
                        <th className="text-left py-3 px-4 font-medium text-white">Desktop</th>
                        <th className="text-left py-3 px-4 font-medium text-white">Mobile</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      <tr>
                        <td className="py-3 px-4 text-slate-300 text-xs">File-based routing</td>
                        <td className="py-3 px-4 text-slate-400 text-xs text-center">✅</td>
                        <td className="py-3 px-4 text-slate-400 text-xs text-center">✅</td>
                        <td className="py-3 px-4 text-slate-400 text-xs text-center">✅</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-slate-300 text-xs">Hono API routes</td>
                        <td className="py-3 px-4 text-slate-400 text-xs text-center">✅</td>
                        <td className="py-3 px-4 text-slate-400 text-xs text-center">✅</td>
                        <td className="py-3 px-4 text-slate-400 text-xs text-center">✅</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-slate-300 text-xs">Native system APIs</td>
                        <td className="py-3 px-4 text-slate-400 text-xs text-center">❌</td>
                        <td className="py-3 px-4 text-slate-400 text-xs text-center">✅</td>
                        <td className="py-3 px-4 text-slate-400 text-xs text-center">✅</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-slate-300 text-xs">Auto plugin wiring</td>
                        <td className="py-3 px-4 text-slate-400 text-xs text-center">❌</td>
                        <td className="py-3 px-4 text-slate-400 text-xs text-center">✅</td>
                        <td className="py-3 px-4 text-slate-400 text-xs text-center">✅</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-slate-300 text-xs">Code signing</td>
                        <td className="py-3 px-4 text-slate-400 text-xs text-center">❌</td>
                        <td className="py-3 px-4 text-slate-400 text-xs text-center">✅</td>
                        <td className="py-3 px-4 text-slate-400 text-xs text-center">✅</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-slate-300 text-xs">Static export</td>
                        <td className="py-3 px-4 text-slate-400 text-xs text-center">✅</td>
                        <td className="py-3 px-4 text-slate-400 text-xs text-center">❌</td>
                        <td className="py-3 px-4 text-slate-400 text-xs text-center">❌</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </motion.section>

              {/* Previous / Next Navigation */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex items-center justify-between pt-8 mt-8 border-t border-slate-800">
                <Link to="/docs/environment-variables" className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  <div>
                    <div className="text-xs text-slate-500">Previous</div>
                    <div className="text-sm font-medium">Environment Variables</div>
                  </div>
                </Link>
                <Link to="/docs/deploying" className="group flex items-center gap-2 text-right text-slate-400 hover:text-white transition-colors">
                  <div>
                    <div className="text-xs text-slate-500">Next</div>
                    <div className="text-sm font-medium">Deploying</div>
                  </div>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

            </div>
          </DocLayout>
          
        </div>
      </div>
    </div>
  )
}