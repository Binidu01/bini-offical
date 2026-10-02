import { motion, AnimatePresence } from 'framer-motion'
import {
  Folder,
  Hash,
  Globe,
  File,
  FolderOpen,
  ChevronRight,
  Code2,
  Layout,
  Database,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import {
  siNetlify,
  siVercel,
  siCloudflare,
  siNodedotjs,
  siDeno,
  siTailwindcss,
  siCss,
} from 'simple-icons'
import type { SimpleIcon as SimpleIconType } from 'simple-icons'

// Simple Icon component
function SimpleIcon({
  icon,
  className = '',
  size = 16,
}: {
  icon: SimpleIconType
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

const features = [
  {
    icon: Folder,
    title: 'File-based Routing',
    desc: 'Create routes using the file system. Nested layouts, dynamic segments, and custom 404 pages work out of the box.',
    visual: <FileRoutingVisual />,
  },
  {
    icon: Database,
    title: 'API Routes',
    desc: 'Build API endpoints in src/app/api/. Same code runs in development and production with zero configuration.',
    visual: <ApiRoutesVisual />,
  },
  {
    icon: siCss,
    title: 'CSS Support',
    desc: 'Style your application with Tailwind CSS, CSS Modules, or plain CSS. Import styles directly in your components.',
    visual: <CSSSupportVisual />,
    isSimpleIcon: true,
  },
  {
    icon: Layout,
    title: 'Nested Layouts',
    desc: 'Create shared layouts that persist across routes. Perfect for navigation, footers, and persistent UI elements.',
    visual: <NestedLayoutsVisual />,
  },
  {
    icon: Hash,
    title: 'Per-route Metadata',
    desc: 'Export metadata from any layout. Titles, Open Graph, and Twitter cards injected at build time for SEO.',
    visual: <MetadataVisual />,
  },
  {
    icon: Globe,
    title: 'Deploy Anywhere',
    desc: 'Set platform once in config. Deploy to Netlify, Vercel, Cloudflare, Node.js, or Deno with zero changes.',
    visual: <DeployVisual />,
  },
]

// ─── Typing Animation Hook (types one field at a time) ────────────────────────
function useTypingAnimation(words: string[]) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    const currentWord = words[currentIndex]

    const type = () => {
      if (!isDeleting && !isPaused) {
        if (displayText.length < currentWord.length) {
          setDisplayText(currentWord.slice(0, displayText.length + 1))
        } else {
          setIsPaused(true)
          setTimeout(() => {
            setIsPaused(false)
            setIsDeleting(true)
          }, 1500)
        }
      } else if (isDeleting && !isPaused) {
        if (displayText.length > 0) {
          setDisplayText(currentWord.slice(0, displayText.length - 1))
        } else {
          setIsDeleting(false)
          setCurrentIndex((prev) => (prev + 1) % words.length)
        }
      }
    }

    const timeout = setTimeout(type, isDeleting ? 30 : 60)
    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, isPaused, currentIndex, words])

  return { displayText, currentIndex, setCurrentIndex }
}

// ─── File-based Routing Animation (larger card) ───────────────────────────────
function FileRoutingVisual() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [currentRoute, setCurrentRoute] = useState('/')

  const files = [
    {
      name: 'app',
      type: 'folder',
      children: [
        { name: 'page.tsx', type: 'file', route: '/' },
        { name: 'about.tsx', type: 'file', route: '/about' },
        {
          name: 'contact',
          type: 'folder',
          children: [{ name: 'page.tsx', type: 'file', route: '/contact' }],
        },
        {
          name: 'blog',
          type: 'folder',
          children: [
            {
              name: '[slug]',
              type: 'folder',
              children: [{ name: 'page.tsx', type: 'file', route: '/blog/:slug' }],
            },
          ],
        },
        {
          name: 'api',
          type: 'folder',
          children: [{ name: 'hello.ts', type: 'file', route: '/api/hello' }],
        },
      ],
    },
  ]

  useEffect(() => {
    const routes = ['/', '/about', '/contact', '/blog/:slug', '/api/hello']
    let index = 0
    const interval = setInterval(() => {
      const route = routes[index % routes.length]
      setCurrentRoute(route)
      setSelectedFile(route)
      index++
      setTimeout(() => setSelectedFile(null), 2000)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  const renderTree = (items: any[], depth = 0) => {
    return items.map((item, i) => (
      <motion.div
        key={item.name + i}
        initial={{ opacity: 0, x: -4 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: depth * 0.04 + i * 0.02 }}
      >
        <div
          className={`flex items-center gap-2 py-1 px-2 rounded-md cursor-pointer transition-all ${
            selectedFile === item.route ? 'bg-cyan-500/20 border border-cyan-500/50' : ''
          }`}
          style={{ paddingLeft: `${depth * 16 + 12}px` }}
        >
          {item.type === 'folder' ? (
            <FolderOpen className="w-4 h-4 text-sky-400 shrink-0" />
          ) : (
            <File className="w-4 h-4 text-slate-400 shrink-0" />
          )}
          <span
            className={`text-xs font-mono truncate ${
              item.type === 'folder' ? 'text-sky-400' : 'text-slate-300'
            }`}
          >
            {item.name}
          </span>
          {item.route && selectedFile === item.route && (
            <motion.div
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              className="ml-auto flex items-center gap-1 shrink-0"
            >
              <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[10px] text-cyan-400 font-mono">{item.route}</span>
            </motion.div>
          )}
        </div>
        {item.children && renderTree(item.children, depth + 1)}
      </motion.div>
    ))
  }

  return (
    <div className="w-full h-full p-5 flex flex-col">
      <div className="flex-1 font-mono -mt-2">{renderTree(files)}</div>
    </div>
  )
}

// ─── API Routes Animation ─────────────────────────────────────────────────────
function ApiRoutesVisual() {
  const [showResponse, setShowResponse] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setShowResponse(true)
      setTimeout(() => setShowResponse(false), 2000)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full h-full p-5 font-mono flex flex-col">
      <div className="flex-1 flex items-center">
        <motion.div
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-4 rounded-lg border border-slate-800 bg-black w-full"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs font-bold text-emerald-400 w-12">GET</span>
            <span className="text-xs text-slate-300">/api/hello</span>
          </div>
          <div className="pl-12">
            <span className="text-[10px] text-slate-500 flex items-center gap-1.5">
              <File className="w-3.5 h-3.5" />
              app/api/hello.ts
            </span>
          </div>
          <AnimatePresence>
            {showResponse && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pl-12"
              >
                <pre className="text-[10px] text-emerald-400 bg-slate-900 p-2.5 rounded">
                  {'{ "message": "Hello World" }'}
                </pre>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}

// ─── CSS Support Animation ────────────────────────────────────────────────────
function CSSSupportVisual() {
  const [activeStyle, setActiveStyle] = useState<'tailwind' | 'modules' | 'css'>('tailwind')
  const [showPreview, setShowPreview] = useState(true)

  useEffect(() => {
    const styles: ('tailwind' | 'modules' | 'css')[] = ['tailwind', 'modules', 'css']
    let index = 0
    const interval = setInterval(() => {
      setShowPreview(false)
      setTimeout(() => {
        setActiveStyle(styles[index % styles.length])
        setShowPreview(true)
        index++
      }, 300)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full h-full p-4 flex flex-col">
      <div className="flex gap-2 mb-3">
        {[
          { id: 'tailwind', label: 'Tailwind', icon: siTailwindcss, color: 'text-cyan-400' },
          { id: 'modules', label: 'CSS Modules', icon: null, color: 'text-emerald-400' },
          { id: 'css', label: 'CSS', icon: siCss, color: 'text-sky-400' },
        ].map((style) => {
          return (
            <motion.button
              key={style.id}
              whileHover={{ scale: 1.02 }}
              className={`flex-1 px-2 py-1.5 rounded-lg text-[10px] font-medium transition-all flex items-center justify-center gap-1.5 ${
                activeStyle === style.id
                  ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-400'
                  : 'bg-black border border-slate-800 text-slate-400'
              }`}
            >
              {style.icon ? (
                <SimpleIcon
                  icon={style.icon}
                  className={`w-3.5 h-3.5 ${activeStyle === style.id ? style.color : 'text-slate-400'}`}
                  size={14}
                />
              ) : (
                <Code2
                  className={`w-3.5 h-3.5 ${activeStyle === style.id ? style.color : 'text-slate-400'}`}
                />
              )}
              {style.label}
            </motion.button>
          )
        })}
      </div>

      <div className="flex-1 flex items-center">
        <AnimatePresence mode="wait">
          {showPreview && (
            <motion.div
              key={activeStyle}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="rounded-lg border border-slate-800 bg-black p-3 w-full"
            >
              {activeStyle === 'tailwind' && (
                <div>
                  <div className="text-[10px] text-slate-400 mb-2">component.tsx</div>
                  <div className="bg-slate-900 p-3 rounded-lg">
                    <span className="text-slate-300 text-[10px]">{'<'}</span>
                    <span className="text-amber-400 text-[10px]">div</span>
                    <span className="text-slate-300 text-[10px]"> </span>
                    <span className="text-cyan-400 text-[10px]">className</span>
                    <span className="text-slate-300 text-[10px]">=</span>
                    <span className="text-emerald-400 text-[10px]">
                      "bg-linear-to-r from-cyan-500 to-blue-500 p-4 rounded-lg"
                    </span>
                    <span className="text-slate-300 text-[10px]">{'>'}</span>
                    <span className="text-slate-300 text-[10px]">{'</'}</span>
                    <span className="text-amber-400 text-[10px]">div</span>
                    <span className="text-slate-300 text-[10px]">{'>'}</span>
                  </div>
                </div>
              )}
              {activeStyle === 'modules' && (
                <div>
                  <div className="text-[10px] text-slate-400 mb-2">Component.module.css</div>
                  <div className="bg-slate-900 p-3 rounded-lg">
                    <span className="text-emerald-400 text-[10px] font-mono">.container</span>
                    <span className="text-slate-400 text-[10px] font-mono"> {'{'}</span>
                    <div className="pl-4 mt-1">
                      <span className="text-cyan-400 text-[10px] font-mono">padding</span>
                      <span className="text-slate-400 text-[10px] font-mono">: </span>
                      <span className="text-amber-400 text-[10px] font-mono">1rem</span>
                      <span className="text-slate-400 text-[10px] font-mono">;</span>
                    </div>
                    <span className="text-slate-400 text-[10px] font-mono">{'}'}</span>
                  </div>
                </div>
              )}
              {activeStyle === 'css' && (
                <div>
                  <div className="text-[10px] text-slate-400 mb-2">style.css</div>
                  <div className="bg-slate-900 p-3 rounded-lg">
                    <span className="text-amber-400 text-[10px] font-mono">@layer</span>
                    <span className="text-slate-300 text-[10px] font-mono"> </span>
                    <span className="text-purple-400 text-[10px] font-mono">base</span>
                    <span className="text-slate-300 text-[10px] font-mono"> </span>
                    <span className="text-slate-400 text-[10px] font-mono">{'{'}</span>
                    <div className="pl-4 mt-1">
                      <span className="text-cyan-400 text-[10px] font-mono">body</span>
                      <span className="text-slate-300 text-[10px] font-mono"> </span>
                      <span className="text-slate-400 text-[10px] font-mono">{'{'}</span>
                      <div className="pl-4">
                        <span className="text-amber-400 text-[10px] font-mono">@apply</span>
                        <span className="text-slate-300 text-[10px] font-mono"> </span>
                        <span className="text-emerald-400 text-[10px] font-mono">bg-black</span>
                        <span className="text-slate-400 text-[10px] font-mono">;</span>
                      </div>
                      <span className="text-slate-400 text-[10px] font-mono">{'}'}</span>
                    </div>
                    <span className="text-slate-400 text-[10px] font-mono">{'}'}</span>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ─── Nested Layouts Animation ─────────────────────────────────────────────────
function NestedLayoutsVisual() {
  const [activeLayer, setActiveLayer] = useState<number>(0)

  const layers = [
    {
      name: 'Root Layout',
      component: 'app/layout.tsx',
      color: 'border-purple-500/50 bg-purple-500/10',
    },
    {
      name: 'Blog Layout',
      component: 'app/blog/layout.tsx',
      color: 'border-cyan-500/50 bg-cyan-500/10',
    },
    {
      name: 'Page',
      component: 'app/blog/page.tsx',
      color: 'border-emerald-500/50 bg-emerald-500/10',
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLayer((prev) => (prev + 1) % layers.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full h-full p-5 flex flex-col justify-center">
      <div className="space-y-3">
        {layers.map((layer, i) => (
          <motion.div
            key={layer.name}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-3.5 rounded-lg border transition-all ${
              activeLayer === i ? layer.color : 'border-slate-800 bg-black'
            }`}
          >
            <div className="flex items-center gap-3">
              <Layout
                className={`w-4.5 h-4.5 ${activeLayer === i ? 'text-cyan-400' : 'text-slate-500'}`}
              />
              <div className="flex-1">
                <div className="text-sm font-medium text-slate-200">{layer.name}</div>
                <div className="text-[10px] text-slate-500 font-mono">{layer.component}</div>
              </div>
              {activeLayer === i && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-2 h-2 rounded-full bg-cyan-400"
                />
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ─── Metadata Animation - Types one field at a time ───────────────────────────
function MetadataVisual() {
  const metaFields = [
    { name: 'title', values: ['My App', 'Bini.js App', 'SPA Framework'], color: 'cyan' },
    {
      name: 'description',
      values: ['Build faster', 'Modern SPA', 'Zero config'],
      color: 'emerald',
    },
    { name: 'og:image', values: ['og.png', 'blog-og.png', 'about-og.png'], color: 'amber' },
    { name: 'twitter:card', values: ['summary_large_image', 'summary', 'app'], color: 'sky' },
  ]

  const [activeFieldIndex, setActiveFieldIndex] = useState(0)

  const titleTyping = useTypingAnimation(metaFields[0].values)
  const descTyping = useTypingAnimation(metaFields[1].values)
  const ogTyping = useTypingAnimation(metaFields[2].values)
  const twitterTyping = useTypingAnimation(metaFields[3].values)

  const typingStates = [titleTyping, descTyping, ogTyping, twitterTyping]

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFieldIndex((prev) => (prev + 1) % metaFields.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const getDisplayText = (index: number) => {
    if (index === activeFieldIndex) {
      return typingStates[index].displayText
    }
    return metaFields[index].values[0]
  }

  const isFieldActive = (index: number) => activeFieldIndex === index

  const getColorClass = (color: string) => {
    switch (color) {
      case 'cyan':
        return 'text-cyan-400'
      case 'emerald':
        return 'text-emerald-400'
      case 'amber':
        return 'text-amber-400'
      case 'sky':
        return 'text-sky-400'
      default:
        return 'text-slate-400'
    }
  }

  return (
    <div className="w-full h-full p-5 flex flex-col">
      <div className="flex-1 bg-black rounded-lg border border-slate-800 p-4 font-mono">
        <div className="text-xs text-purple-400 mb-3">export const metadata = {'{'}</div>

        {metaFields.map((field, i) => (
          <div
            key={field.name}
            className={`pl-5 py-0.5 rounded transition-all ${isFieldActive(i) ? 'bg-cyan-500/10 border-l-2 border-cyan-500' : ''}`}
          >
            <span className="text-slate-400 text-xs">{field.name}: </span>
            <span className={`text-xs ${getColorClass(field.color)}`}>"{getDisplayText(i)}"</span>
            <span className="text-slate-600">,</span>
            {isFieldActive(i) && (
              <span className="ml-1.5 text-cyan-400 text-xs animate-pulse">|</span>
            )}
          </div>
        ))}

        <div className="text-xs text-purple-400 mt-2">{'}'}</div>
      </div>
    </div>
  )
}

// ─── Deploy Visual ───────────────────────────────────────────────────────────
function DeployVisual() {
  const platforms = [
    {
      name: 'Netlify',
      icon: siNetlify,
      color: 'text-teal-400',
      bg: 'bg-teal-500/10',
      border: 'border-teal-500/30',
    },
    {
      name: 'Vercel',
      icon: siVercel,
      color: 'text-slate-300',
      bg: 'bg-slate-500/10',
      border: 'border-slate-500/30',
    },
    {
      name: 'Cloudflare',
      icon: siCloudflare,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/30',
    },
    {
      name: 'Node',
      icon: siNodedotjs,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      border: 'border-green-500/30',
    },
    {
      name: 'Deno',
      icon: siDeno,
      color: 'text-slate-300',
      bg: 'bg-slate-500/10',
      border: 'border-slate-500/30',
    },
  ]

  const platformNames = platforms.map((p) => p.name)
  const { displayText, currentIndex } = useTypingAnimation(platformNames)

  return (
    <div className="w-full h-full p-5 flex flex-col items-center justify-center">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-5">
        <div className="px-5 py-2.5 rounded-lg bg-black border border-slate-700">
          <span className="text-xs font-mono">
            <span className="text-purple-400">platform</span>
            <span className="text-slate-400">: </span>
            <span className="text-green-400">'{displayText}'</span>
            <span className="ml-1.5 text-green-400 text-xs animate-pulse">|</span>
          </span>
        </div>
      </motion.div>

      <div className="flex flex-wrap justify-center gap-2.5 max-w-sm">
        {platforms.map((platform, i) => {
          const isSelected = i === currentIndex
          return (
            <motion.div
              key={platform.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: isSelected ? 1.05 : 1,
              }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ scale: 1.05 }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-md border transition-all ${
                isSelected
                  ? `${platform.bg} ${platform.border} ring-1 ring-cyan-500/50`
                  : 'bg-black border-slate-800'
              }`}
            >
              <SimpleIcon
                icon={platform.icon}
                className={`w-4 h-4 ${isSelected ? platform.color : 'text-slate-500'}`}
                size={16}
              />
              <span
                className={`text-xs font-medium ${isSelected ? platform.color : 'text-slate-500'}`}
              >
                {platform.name}
              </span>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Features Section ─────────────────────────────────────────────────────────
export function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative py-20 lg:py-24 px-4 lg:px-8 border-t border-slate-800"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Everything you need</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const isSimpleIcon = 'isSimpleIcon' in feature && feature.isSimpleIcon
            const IconComponent = !isSimpleIcon ? (feature.icon as React.ElementType) : null

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group bg-black rounded-xl border border-slate-800 hover:border-slate-700 hover:shadow-md transition-all flex flex-col overflow-hidden"
              >
                <div className="relative h-64 flex items-center justify-center border-b border-slate-800 bg-black">
                  {feature.visual}
                </div>

                <div className="p-6 flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center group-hover:bg-cyan-950/30 transition-colors shrink-0">
                      {isSimpleIcon ? (
                        <SimpleIcon
                          icon={feature.icon as SimpleIconType}
                          className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors"
                          size={20}
                        />
                      ) : IconComponent ? (
                        <IconComponent className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                      ) : null}
                    </div>
                    <h3 className="text-base font-semibold text-white">{feature.title}</h3>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
