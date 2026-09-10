// src/pages/docs/platform-android/page.tsx
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
  Camera,
  Folder,
  Bell,
  MapPin,
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
  { id: 'android-overview', label: 'Android Overview' },
  { id: 'requirements', label: 'Requirements' },
  { id: 'windows', label: 'Windows' },
  { id: 'macos', label: 'macOS' },
  { id: 'linux', label: 'Linux' },
  { id: 'creating-android-app', label: 'Creating an Android App' },
  { id: 'development', label: 'Development' },
  { id: 'building', label: 'Building' },
  { id: 'code-signing', label: 'Code Signing' },
  { id: 'deployment', label: 'Deployment' },
]

const PAGE_TITLE = 'Android'
const PAGE_URL = 'https://bini.js.org/docs/platform-android'
const EDIT_URL = 'https://github.com/Binidu01/bini-offical/edit/main/src/app/docs/platform-android.tsx'

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
// Platform Android Page
// ────────────────────────────────────────────────────────────────────────────────
export default function PlatformAndroidPage() {
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
                    <p className="text-slate-400 text-sm">Build native Android mobile applications with Bini.js.</p>
                  </div>
                  <div className="shrink-0 pt-2 hidden sm:block">
                    <CopyPageButton pageUrl={PAGE_URL} pageTitle={PAGE_TITLE} />
                  </div>
                </m.div>
                {/* Copy button on small screens */}
                <div className="sm:hidden mb-8">
                  <CopyPageButton pageUrl={PAGE_URL} pageTitle={PAGE_TITLE} />
                </div>

                {/* Android Overview */}
                <m.section id="android-overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Android Overview</h2>
                  <p className="text-slate-300 mb-4">
                    Bini.js allows you to build native Android mobile applications using Tauri. Your React app runs inside a WebView with full access to native Android APIs and features.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    <div className="p-4 rounded-xl border border-slate-700 bg-[#0a0a0a]">
                      <Smartphone className="w-5 h-5 text-cyan-400 mb-2" />
                      <h3 className="text-white font-medium text-sm">Native APK/AAB</h3>
                      <p className="text-slate-400 text-xs">Build Android apps as APK or AAB for Google Play Store distribution</p>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-700 bg-[#0a0a0a]">
                      <Shield className="w-5 h-5 text-cyan-400 mb-2" />
                      <h3 className="text-white font-medium text-sm">Code Signing</h3>
                      <p className="text-slate-400 text-xs">Keystore signing for secure Play Store distribution</p>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-700 bg-[#0a0a0a]">
                      <Zap className="w-5 h-5 text-cyan-400 mb-2" />
                      <h3 className="text-white font-medium text-sm">Auto Plugin Wiring</h3>
                      <p className="text-slate-400 text-xs">bini-native detects web APIs and wires Android permissions automatically</p>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-700 bg-[#0a0a0a]">
                      <Package className="w-5 h-5 text-cyan-400 mb-2" />
                      <h3 className="text-white font-medium text-sm">Full Configuration</h3>
                      <p className="text-slate-400 text-xs">Back button, status bar, splash screen — all configurable</p>
                    </div>
                  </div>
                  <Note>
                    Android apps are built using Tauri's Android backend. Your app runs in a native WebView with full system access.
                  </Note>
                </m.section>

                {/* Requirements */}
                <m.section id="requirements" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Requirements</h2>
                  <p className="text-slate-300 mb-4">
                    Before building Android apps, make sure you have the following installed:
                  </p>
                  <ul className="space-y-2 text-slate-300 mb-4 list-disc list-inside">
                    <li>Node.js <span className="text-white">20.19.0</span> or higher</li>
                    <li>Java JDK 17 (<code className="text-cyan-400">JAVA_HOME</code> set) — <a href="https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Download</a></li>
                    <li>Android Studio with SDK, Build Tools, and NDK (<code className="text-cyan-400">ANDROID_HOME</code> set) — <a href="https://developer.android.com/studio" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Download</a></li>
                    <li>Rust targets:
                      <ul className="mt-2 ml-5 space-y-1 list-disc text-slate-400 text-sm">
                        <li><code className="text-cyan-400">rustup target add aarch64-linux-android</code></li>
                        <li><code className="text-cyan-400">rustup target add armv7-linux-androideabi</code></li>
                        <li><code className="text-cyan-400">rustup target add i686-linux-android</code></li>
                        <li><code className="text-cyan-400">rustup target add x86_64-linux-android</code></li>
                      </ul>
                    </li>
                  </ul>
                  <Note>
                    Set <code>ANDROID_HOME</code> to your Android SDK path (e.g., <code>~/Library/Android/sdk</code> on macOS, <code>%USERPROFILE%\AppData\Local\Android\Sdk</code> on Windows).
                  </Note>
                </m.section>

                {/* Windows */}
                <m.section id="windows" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Windows</h2>
                  <p className="text-slate-300 mb-4">
                    Build Android apps natively on Windows using the CLI with Android Studio installed.
                  </p>
                  <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 mb-4">
                    <h3 className="text-white font-semibold mb-2">Setup on Windows</h3>
                    <ul className="space-y-1 text-slate-300 text-sm list-disc list-inside">
                      <li>Install Node.js from <a href="https://nodejs.org/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">nodejs.org</a></li>
                      <li>Install Java JDK 17 and set <code className="text-cyan-400">JAVA_HOME</code></li>
                      <li>Install Android Studio from <a href="https://developer.android.com/studio" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">developer.android.com</a></li>
                      <li>Set <code className="text-cyan-400">ANDROID_HOME</code> to your SDK path</li>
                      <li>Install Rust targets with <code className="text-cyan-400">rustup</code></li>
                    </ul>
                  </div>
                  <CodeBlock 
                    code={`# Create a new Android project
npx create-bini-app@latest my-app --platform android

# Navigate to project
cd my-app

# Install dependencies
npm install

# Run on emulator or device
npm run android

# Build release APK/AAB
npm run android:build`}
                  />
                  <Note>
                    All Android development commands work the same way on Windows, macOS, and Linux.
                  </Note>
                </m.section>

                {/* macOS */}
                <m.section id="macos" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">macOS</h2>
                  <p className="text-slate-300 mb-4">
                    Build Android apps natively on macOS using the CLI with Android Studio installed.
                  </p>
                  <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 mb-4">
                    <h3 className="text-white font-semibold mb-2">Setup on macOS</h3>
                    <ul className="space-y-1 text-slate-300 text-sm list-disc list-inside">
                      <li>Install Node.js from <a href="https://nodejs.org/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">nodejs.org</a></li>
                      <li>Install Java JDK 17 and set <code className="text-cyan-400">JAVA_HOME</code></li>
                      <li>Install Android Studio from <a href="https://developer.android.com/studio" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">developer.android.com</a></li>
                      <li>Set <code className="text-cyan-400">ANDROID_HOME</code> to <code className="text-cyan-400">~/Library/Android/sdk</code></li>
                      <li>Install Rust targets with <code className="text-cyan-400">rustup</code></li>
                    </ul>
                  </div>
                  <CodeBlock 
                    code={`# Create a new Android project
npx create-bini-app@latest my-app --platform android

# Navigate to project
cd my-app

# Install dependencies
npm install

# Run on emulator or device
npm run android

# Build release APK/AAB
npm run android:build`}
                  />
                  <Note>
                    All Android development commands work the same way on macOS, Windows, and Linux.
                  </Note>
                </m.section>

                {/* Linux */}
                <m.section id="linux" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Linux</h2>
                  <p className="text-slate-300 mb-4">
                    Build Android apps natively on Linux using the CLI with Android Studio installed.
                  </p>
                  <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 mb-4">
                    <h3 className="text-white font-semibold mb-2">Setup on Linux</h3>
                    <ul className="space-y-1 text-slate-300 text-sm list-disc list-inside">
                      <li>Install Node.js from <a href="https://nodejs.org/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">nodejs.org</a></li>
                      <li>Install Java JDK 17 and set <code className="text-cyan-400">JAVA_HOME</code></li>
                      <li>Install Android Studio from <a href="https://developer.android.com/studio" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">developer.android.com</a></li>
                      <li>Set <code className="text-cyan-400">ANDROID_HOME</code> to your SDK path (e.g., <code className="text-cyan-400">~/Android/Sdk</code>)</li>
                      <li>Install Rust targets with <code className="text-cyan-400">rustup</code></li>
                    </ul>
                  </div>
                  <CodeBlock 
                    code={`# Create a new Android project
npx create-bini-app@latest my-app --platform android

# Navigate to project
cd my-app

# Install dependencies
npm install

# Run on emulator or device
npm run android

# Build release APK/AAB
npm run android:build`}
                  />
                  <Note>
                    All Android development commands work the same way on Linux, Windows, and macOS.
                  </Note>
                </m.section>

                {/* Creating an Android App */}
                <m.section id="creating-android-app" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Creating an Android App</h2>
                  <p className="text-slate-300 mb-4">
                    Create a new Bini.js project targeting Android:
                  </p>
                  <CodeBlock 
                    code={`npx create-bini-app@latest my-app --platform android`}
                  />
                  <p className="text-slate-300 mt-4">
                    Or use the interactive prompt and select <code className="text-cyan-400">android</code>:
                  </p>
                  <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 mb-4">
                    <p className="text-slate-300 text-sm">
                      <span className="text-white">Prompt:</span> Which platform would you like to target?
                    </p>
                    <p className="text-cyan-400 text-sm mt-1">web / windows / macos / linux / android / ios</p>
                    <p className="text-emerald-400 text-sm mt-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Select <span className="font-medium">android</span> and press Enter
                    </p>
                  </div>
                  <CodeBlock 
                    code={`npx create-bini-app@latest`}
                  />
                  <p className="text-slate-300 mt-4">
                    The project structure includes Android-specific configuration in <code className="text-cyan-400">src-tauri/gen/android/</code>.
                  </p>
                </m.section>

                {/* Development */}
                <m.section id="development" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Development</h2>
                  <p className="text-slate-300 mb-4">
                    Run your Android app on an emulator or connected device:
                  </p>
                  <CodeBlock 
                    code={`npm run android`}
                  />
                  <p className="text-slate-300 mt-4">
                    This launches your app with:
                  </p>
                  <ul className="space-y-2 text-slate-300 mb-4 list-disc list-inside">
                    <li>Hot reload for frontend changes</li>
                    <li>Native Android integration</li>
                    <li>Auto-wired native APIs (<code className="text-cyan-400">bini-native</code>)</li>
                    <li>Devtools for debugging</li>
                  </ul>
                  <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 mt-4">
                    <h3 className="text-white font-semibold mb-2">Setting up an Emulator</h3>
                    <ol className="space-y-1 text-slate-300 text-sm list-decimal list-inside">
                      <li>Open Android Studio</li>
                      <li>Go to <strong className="text-white">AVD Manager</strong></li>
                      <li>Create a virtual device</li>
                      <li>Start the emulator</li>
                      <li>Run <code className="text-cyan-400">npm run android</code></li>
                    </ol>
                  </div>
                </m.section>

                {/* Building */}
                <m.section id="building" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Building</h2>
                  <p className="text-slate-300 mb-4">
                    Build a release APK or AAB for distribution:
                  </p>
                  <CodeBlock 
                    code={`npm run android:build`}
                  />
                  <p className="text-slate-300 mt-4">
                    This creates a signed Android package in the <code className="text-cyan-400">src-tauri/gen/android/app/build/outputs/</code> directory.
                  </p>
                  <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 mb-4">
                    <h3 className="text-white font-semibold mb-2">Output Files</h3>
                    <ul className="space-y-1 text-slate-300 text-sm list-disc list-inside">
                      <li><code className="text-cyan-400">app-release.apk</code> — APK for direct installation</li>
                      <li><code className="text-cyan-400">app-release.aab</code> — Android App Bundle for Google Play Store</li>
                    </ul>
                  </div>
                  <Note>
                    The build output is a native Android app that runs on Android 5.0 (API 21) and above.
                  </Note>
                </m.section>

                {/* Code Signing */}
                <m.section id="code-signing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Code Signing</h2>
                  <p className="text-slate-300 mb-4">
                    Configure keystore signing for Android apps at scaffold time or later. Create a <code className="text-cyan-400">keystore.properties</code> file:
                  </p>
                  <CodeBlock 
                    code={`# src-tauri/gen/android/keystore.properties
storeFile=my-keystore.keystore
storePassword=your-keystore-password
keyAlias=my-key-alias
keyPassword=your-key-password`}
                    filename="keystore.properties"
                  />
                  <p className="text-slate-300 mt-4">
                    Use <code className="text-cyan-400">--sign</code> during scaffold to set up signing automatically:
                  </p>
                  <CodeBlock 
                    code={`npx create-bini-app@latest my-app --platform android --sign`}
                  />
                  <Note>
                    For Google Play Store distribution, you must sign your app with a keystore. Keep your keystore secure and never commit it to version control.
                  </Note>
                </m.section>

                {/* Deployment */}
                <m.section id="deployment" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Deployment</h2>
                  <p className="text-slate-300 mb-4">
                    Deploy your Android project by pushing to GitHub:
                  </p>
                  <CodeBlock 
                    code={`npm run deploy`}
                  />
                  <p className="text-slate-300 mt-4">
                    <code className="text-cyan-400">deploy</code> does not build a signed APK or submit to the Play Store — it pushes the project source to GitHub.
                  </p>
                  <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 mb-4">
                    <h3 className="text-white font-semibold mb-2">Deployment Flow</h3>
                    <ol className="space-y-1 text-slate-300 text-sm list-decimal list-inside">
                      <li>Build your release APK/AAB with <code className="text-cyan-400">npm run android:build</code></li>
                      <li>Run <code className="text-cyan-400">npm run deploy</code> to push source to GitHub</li>
                      <li>Upload the APK/AAB to Google Play Console manually</li>
                    </ol>
                  </div>
                  <Note>
                    Store submission is manual. After building your APK/AAB, upload it to the Google Play Console for distribution.
                  </Note>
                </m.section>

                {/* Previous / Next Navigation */}
                <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex items-center justify-between pt-8 mt-8 border-t border-slate-800">
                  <Link to="/docs/platform-linux" className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <div>
                      <div className="text-xs text-slate-500">Previous</div>
                      <div className="text-sm font-medium">Linux</div>
                    </div>
                  </Link>
                  <Link to="/docs/platform-ios" className="group flex items-center gap-2 text-right text-slate-400 hover:text-white transition-colors">
                    <div>
                      <div className="text-xs text-slate-500">Next</div>
                      <div className="text-sm font-medium">iOS</div>
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