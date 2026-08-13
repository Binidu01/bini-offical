import { motion, AnimatePresence } from 'framer-motion'
import { Check, Zap, Rocket, Box, FileCode, FileJson, FileText, Globe } from 'lucide-react'
import React, { useState, useEffect, useRef } from 'react'
import { 
  siApple,
  siLinux,
  siAndroid
} from 'simple-icons'

// ─── Windows Icon (custom SVG) ─────────────────────────────────────────────
const WindowsIcon = ({ className = '', size = 20 }: { className?: string; size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    shapeRendering="geometricPrecision" 
    textRendering="geometricPrecision" 
    imageRendering="optimizeQuality" 
    fillRule="evenodd" 
    clipRule="evenodd" 
    viewBox="0 0 512 512.02"
    width={size}
    height={size}
    className={className}
  >
    <path fill="currentColor" fillRule="nonzero" d="M0 512.02h242.686V269.335H0V512.02zm0-269.334h242.686V0H0v242.686zm269.314 0H512V0H269.314v242.686zm0 269.334H512V269.335H269.314V512.02z"/>
  </svg>
)

// ─── Simple Icon component ────────────────────────────────────────────────────
function SimpleIcon({
  icon,
  className = '',
  size = 20,
}: {
  icon: any
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

// ─── Types ────────────────────────────────────────────────────────────────────
type Phase =
  | 'idle'
  | 'phase1'
  | 'phase2'
  | 'phase3a'
  | 'phase3b'
  | 'phase3c'
  | 'phase4'
  | 'phase5'

// ─── Constants ────────────────────────────────────────────────────────────────
const FILES = [
  { id: 'f0', label: 'page.tsx', color: 'cyan' },
  { id: 'f1', label: 'layout.tsx', color: 'purple' },
  { id: 'f2', label: 'api/send-email.ts', color: 'emerald' },
  { id: 'f3', label: 'blog/[slug].tsx', color: 'amber' },
  { id: 'f4', label: 'about/page.tsx', color: 'cyan' },
  { id: 'f5', label: 'contact.ts', color: 'rose' },
] as const

const FILE_POSITIONS = [
  { x: -140, y: -100 },
  { x: 120, y: -110 },
  { x: 160, y: -10 },
  { x: 130, y: 90 },
  { x: -150, y: 85 },
  { x: -155, y: -20 },
]

const FILE_POSITIONS_MOBILE = [
  { x: -90, y: -70 },
  { x: 80, y: -80 },
  { x: 100, y: -5 },
  { x: 85, y: 65 },
  { x: -95, y: 60 },
  { x: -100, y: -10 },
]

// ─── Easing curves ────────────────────────────────────────────────────────────
const easeOut = [0.22, 1, 0.36, 1] as const
const easeFast = [0.25, 0.1, 0.25, 1.0] as const
const easeSmooth = [0.4, 0.0, 0.2, 1.0] as const

// ─── Color tokens ────────────────────────────────────────────────────────────
const COLOR: Record<string, { bg: string; border: string; text: string; pill: string; line: string }> = {
  cyan: {
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/50',
    text: 'text-cyan-400',
    pill: 'bg-cyan-500',
    line: 'stroke-cyan-400',
  },
  purple: {
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/50',
    text: 'text-violet-400',
    pill: 'bg-violet-500',
    line: 'stroke-violet-400',
  },
  emerald: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/50',
    text: 'text-emerald-400',
    pill: 'bg-emerald-500',
    line: 'stroke-emerald-400',
  },
  amber: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/50',
    text: 'text-amber-400',
    pill: 'bg-amber-500',
    line: 'stroke-amber-400',
  },
  rose: {
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/50',
    text: 'text-rose-400',
    pill: 'bg-rose-500',
    line: 'stroke-rose-400',
  },
  blue: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/50',
    text: 'text-blue-400',
    pill: 'bg-blue-500',
    line: 'stroke-blue-400',
  },
  yellow: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/50',
    text: 'text-yellow-400',
    pill: 'bg-yellow-500',
    line: 'stroke-yellow-400',
  },
}

const MERGE_DOTS = [
  { x: 0, y: -90, color: 'cyan' },
  { x: -90, y: 55, color: 'amber' },
  { x: 90, y: 55, color: 'emerald' },
]

const MERGE_DOTS_MOBILE = [
  { x: 0, y: -60, color: 'cyan' },
  { x: -60, y: 40, color: 'amber' },
  { x: 60, y: 40, color: 'emerald' },
]

// ─── Deployment platforms ────────────────────────────────────────────────────
const DEPLOY_PLATFORMS = [
  {
    name: 'Windows',
    icon: 'windows',
    color: 'cyan',
  },
  {
    name: 'macOS',
    icon: siApple,
    color: 'purple',
  },
  {
    name: 'Linux',
    icon: siLinux,
    color: 'amber',
  },
  {
    name: 'iOS',
    icon: siApple,
    color: 'blue',
  },
  {
    name: 'Android',
    icon: siAndroid,
    color: 'emerald',
  },
  {
    name: 'Web',
    icon: 'web',
    color: 'rose',
  },
]

// ─── Vite build output ────────────────────────────────────────────────────────
const VITE_OUTPUT = [
  { file: 'dist/index.html', size: '1.43 kB', gzip: '0.57 kB' },
  { file: 'dist/css/layout-CcW4yoKV.css', size: '12.18 kB', gzip: '3.22 kB' },
  { file: 'dist/js/layout-BsZsyrnj.js', size: '0.16 kB', gzip: '0.15 kB' },
  { file: 'dist/js/page-DC85EFeG.js', size: '2.63 kB', gzip: '1.17 kB' },
  { file: 'dist/js/jsx-runtime-DShvDiRO.js', size: '8.39 kB', gzip: '3.20 kB' },
  { file: 'dist/js/index-CkZRHBeM.js', size: '228.95 kB', gzip: '72.97 kB' },
]

const VITE_OUTPUT_MOBILE = [
  { file: 'dist/index.html', size: '1.43 kB', gzip: '0.57 kB' },
  { file: 'dist/layout.css', size: '12.18 kB', gzip: '3.22 kB' },
  { file: 'dist/page.js', size: '2.63 kB', gzip: '1.17 kB' },
  { file: 'dist/index.js', size: '228.95 kB', gzip: '72.97 kB' },
]

// ─── Hook for responsive detection ───────────────────────────────────────────
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FileChip({
  label,
  color,
  position,
  toCenter,
  delay,
}: {
  label: string
  color: string
  position: { x: number; y: number }
  toCenter: boolean
  delay: number
}) {
  const c = COLOR[color]

  return (
    <motion.div
      initial={{ x: position.x, y: position.y, opacity: 0, scale: 0.92 }}
      animate={
        toCenter
          ? { x: 0, y: 0, opacity: 0, scale: 0.4 }
          : { x: position.x, y: position.y, opacity: 1, scale: 1 }
      }
      exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.25 } }}
      transition={
        toCenter
          ? { duration: 0.65, delay, ease: easeFast }
          : { duration: 0.55, delay, ease: easeOut }
      }
      className={`absolute flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl font-mono text-[9px] sm:text-xs font-medium whitespace-nowrap backdrop-blur-sm border ${c.bg} ${c.border} ${c.text}`}
    >
      <span className={`size-1 sm:size-1.5 rounded-full ${c.pill} opacity-80`} />
      {label}
    </motion.div>
  )
}

function CoreNode({ pulse }: { pulse: boolean }) {
  const isMobile = useIsMobile()

  return (
    <motion.div
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: pulse ? 1.04 : 1, opacity: 1 }}
      exit={{ scale: 0.7, opacity: 0, transition: { duration: 0.3 } }}
      transition={{ duration: pulse ? 0.3 : 0.5, ease: easeOut }}
      className={`absolute flex flex-col items-center justify-center ${isMobile ? 'size-20' : 'size-27'}`}
    >
      <div className="relative flex flex-col items-center justify-center w-full h-full rounded-xl sm:rounded-2xl bg-[#0c1017] border-2 border-cyan-500/60 backdrop-blur-lg overflow-hidden">
        <div className="relative z-10 flex items-center justify-center">
          <img src="/logo.svg" alt="Bini.js" className={`${isMobile ? 'w-8 h-8' : 'w-12 h-12'} object-contain`} />
        </div>
      </div>
    </motion.div>
  )
}

function AnimatedLine({
  x1,
  y1,
  x2,
  y2,
  delay = 0,
  color = 'emerald',
}: {
  x1: string
  y1: number
  x2: string
  y2: number
  delay?: number
  color?: string
}) {
  const lineColor = COLOR[color]?.line || 'stroke-emerald-400'

  return (
    <>
      <motion.line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        className="stroke-slate-700 stroke-2"
        strokeDasharray="6 4"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.3 }}
        transition={{ delay, duration: 0.7, ease: easeSmooth }}
      />
      <motion.line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        className={`${lineColor} stroke-2`}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: delay + 0.3, duration: 0.8, ease: easeSmooth }}
      />
      <motion.circle
        r="4"
        className={`fill-${color}-400`}
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, 1, 1, 0],
          offsetDistance: ['0%', '100%'],
        }}
        transition={{
          duration: 1.5,
          delay: delay + 0.8,
          repeat: Infinity,
          repeatDelay: 0.5,
          ease: 'linear',
        }}
        style={{
          offsetPath: `path("M${x1} ${y1} L${x2} ${y2}")`,
          offsetRotate: 'auto',
        }}
      />
    </>
  )
}

function RouteNode({
  label,
  colorClass,
  borderClass,
  textClass,
  top,
  left,
  delay,
}: {
  label: string
  colorClass: string
  borderClass: string
  textClass: string
  top: string
  left: string
  delay: number
}) {
  const isMobile = useIsMobile()

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, duration: 0.4, ease: easeOut }}
      className={`absolute -translate-x-1/2 ${isMobile ? 'px-2.5 py-1 text-[8px]' : 'px-4 py-1.5 text-xs'} rounded-xl backdrop-blur-sm border font-semibold ${colorClass} ${borderClass} ${textClass}`}
      style={{ top, left }}
    >
      {label}
    </motion.div>
  )
}

function ApiPhase() {
  const isMobile = useIsMobile()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.45, ease: easeSmooth }}
      className={`absolute flex flex-col items-center gap-4 sm:gap-7 ${isMobile ? 'w-72' : 'w-95'}`}
    >
      <motion.div
        initial={{ y: -12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.45, ease: easeOut }}
        className="px-5 sm:px-8 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/60 text-[11px] sm:text-[13px] font-bold text-emerald-400 backdrop-blur-sm font-mono"
      >
        Hono API Gateway
      </motion.div>
      <div className="flex gap-3 sm:gap-5">
        {[
          { m: 'GET', c: 'emerald' },
          { m: 'POST', c: 'blue' },
          { m: 'PUT', c: 'amber' },
          { m: 'DELETE', c: 'rose' },
        ].map(({ m, c }, i) => {
          const col = COLOR[c]
          return (
            <motion.span
              key={m}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 0.35 + i * 0.1,
                duration: 0.35,
                ease: easeOut,
              }}
              className={`px-2.5 sm:px-3.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-[8px] sm:text-[10px] font-bold tracking-widest backdrop-blur-sm border ${col.bg} ${col.border} ${col.text} font-mono`}
            >
              {m}
            </motion.span>
          )
        })}
      </div>
      <div className="w-full flex flex-col gap-1.5 sm:gap-2">
        {[
          { path: '/api/users', method: 'GET', color: 'emerald' },
          { path: '/api/send-email', method: 'POST', color: 'blue' },
          { path: '/api/uploads', method: 'PUT', color: 'amber' },
        ].map(({ path, method, color }, i) => {
          const col = COLOR[color]
          return (
            <motion.div
              key={path}
              initial={{ x: -16, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 + i * 0.12, duration: 0.35, ease: easeSmooth }}
              className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border backdrop-blur-sm ${col.bg} ${col.border}`}
            >
              <span className={`text-[9px] sm:text-[10px] font-bold min-w-9 sm:min-w-10.5 ${col.text} font-mono`}>
                {method}
              </span>
              <span className="text-[9px] sm:text-[11px] text-slate-400 font-mono truncate">{isMobile ? path.replace('/api/', '') : path}</span>
              <motion.span
                className={`ml-auto size-1 sm:size-1.5 rounded-full ${col.pill}`}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              />
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

function ViteBuildPhase({ complete }: { complete: boolean }) {
  const isMobile = useIsMobile()
  const output = isMobile ? VITE_OUTPUT_MOBILE : VITE_OUTPUT

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.45, ease: easeSmooth }}
      className={`absolute flex flex-col gap-3 sm:gap-4 ${isMobile ? 'w-72' : 'w-130'}`}
    >
      <div className="relative w-full rounded-lg sm:rounded-xl overflow-hidden border border-slate-700/50 bg-[#0d1117] backdrop-blur-sm p-3 sm:p-5 font-mono">
        <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
          <Zap className="size-3 sm:size-4 text-emerald-400" />
          <span className="text-[9px] sm:text-[12px] font-semibold">
            <span className="text-emerald-400">vite</span>
            <span className="text-slate-400"> v8.0.8 </span>
            <span className="text-slate-500">{isMobile ? 'building...' : 'building client environment for production...'}</span>
          </span>
        </div>

        <div className="mb-2 sm:mb-3">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Check className="size-3 sm:size-3.5 text-emerald-400" />
            <span className="text-[9px] sm:text-[11px] text-emerald-400">26 modules transformed.</span>
          </div>
          <div className="text-[8px] sm:text-[10px] text-slate-500 pl-4 sm:pl-5 mt-0.5">computing gzip size...</div>
        </div>

        <div className="space-y-0.5">
          {output.map((item, i) => {
            const getIcon = (file: string) => {
              if (file.endsWith('.html')) return <FileCode className="size-2.5 sm:size-3 shrink-0 text-yellow-400" />
              if (file.endsWith('.css')) return <FileText className="size-2.5 sm:size-3 shrink-0 text-yellow-400" />
              if (file.endsWith('.js')) return <FileJson className="size-2.5 sm:size-3 shrink-0 text-yellow-400" />
              return <Box className="size-2.5 sm:size-3 shrink-0 text-yellow-400" />
            }

            const getFileColor = (file: string) => {
              if (file.endsWith('.html')) return 'text-amber-400'
              if (file.endsWith('.css')) return 'text-cyan-400'
              if (file.endsWith('.js')) return 'text-purple-400'
              return 'text-slate-400'
            }

            return (
              <motion.div
                key={item.file}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08, duration: 0.3, ease: easeSmooth }}
                className="flex items-center gap-1.5 text-[8px] sm:text-[10px]"
              >
                {getIcon(item.file)}
                <span className={`${getFileColor(item.file)} truncate`}>
                  {item.file}
                </span>
                <span className="ml-auto text-slate-500 tabular-nums shrink-0">
                  {item.size}
                  {complete && (
                    <span className="text-slate-600">
                      {' '}
                      │ <span className="hidden sm:inline">gzip: </span>
                      <span className="text-emerald-400/70">{item.gzip}</span>
                    </span>
                  )}
                </span>
              </motion.div>
            )
          })}
        </div>

        {complete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.3 }}
            className="mt-2 sm:mt-3 flex items-center gap-1.5 sm:gap-2"
          >
            <Check className="size-3 sm:size-3.5 text-emerald-400" />
            <span className="text-[9px] sm:text-[11px]">
              <span className="text-emerald-400">✓ built in </span>
              <span className="text-emerald-400 font-bold">330ms</span>
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

function PlatformCard({
  platform,
  index,
  groupDelay,
  xOffset,
}: {
  platform: { name: string; icon: any; color: string }
  index: number
  groupDelay: number
  xOffset: number
}) {
  const isMobile = useIsMobile()
  const col = COLOR[platform.color]

  const renderIcon = () => {
    if (platform.icon === 'windows') {
      return <WindowsIcon size={isMobile ? 20 : 24} className={`${col.text}`} />
    } else if (platform.icon === 'web') {
      return <Globe className={`${isMobile ? 'size-5' : 'size-6'} ${col.text}`} />
    } else {
      return <SimpleIcon icon={platform.icon} size={isMobile ? 20 : 24} />
    }
  }

  return (
    <motion.div
      initial={{ x: xOffset, opacity: 0, scale: 0.95 }}
      animate={{ x: 0, opacity: 1, scale: 1 }}
      transition={{ delay: groupDelay + index * 0.06, duration: 0.35, ease: easeOut }}
      whileHover={{ y: -2, scale: 1.02, transition: { duration: 0.15 } }}
      className={`relative overflow-hidden rounded-lg sm:rounded-xl border backdrop-blur-sm ${col.bg} ${col.border} p-3 sm:p-4 cursor-pointer group flex items-center justify-center`}
    >
      <div className="flex items-center gap-3 sm:gap-3.5">
        <div className={`${col.text}`}>
          {renderIcon()}
        </div>
        <span className={`text-[11px] sm:text-sm font-bold ${col.text} font-sans`}>
          {platform.name}
        </span>
      </div>
    </motion.div>
  )
}

function DeployPhase() {
  const isMobile = useIsMobile()
  const row1 = DEPLOY_PLATFORMS.slice(0, 3)
  const row2 = DEPLOY_PLATFORMS.slice(3, 6)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.5, ease: easeSmooth }}
      className={`absolute ${isMobile ? 'w-80' : 'w-140'} -mt-4`}
    >
      <motion.div
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.4, ease: easeOut }}
        className="text-center mb-4 sm:mb-6"
      >
        <span className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full bg-linear-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/40 text-[10px] sm:text-xs font-bold text-purple-300 font-mono">
          {isMobile ? 'Deploy Everywhere' : 'One Codebase · Deploy Everywhere'}
        </span>
      </motion.div>

      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {row1.map((platform, i) => (
            <PlatformCard
              key={platform.name}
              platform={platform}
              index={i}
              groupDelay={0.35}
              xOffset={i === 0 ? -12 : i === 1 ? 0 : 12}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.3 }}
          className="flex items-center gap-3 sm:gap-4 my-1 sm:my-2"
        >
          <div className="h-px flex-1 bg-slate-800" />
          <span className="text-[7px] sm:text-[9px] text-slate-500 font-mono tracking-wider uppercase">
            Native & Web
          </span>
          <div className="h-px flex-1 bg-slate-800" />
        </motion.div>

        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {row2.map((platform, i) => (
            <PlatformCard
              key={platform.name}
              platform={platform}
              index={i}
              groupDelay={0.65}
              xOffset={i === 0 ? -12 : i === 1 ? 0 : 12}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export function BiniAnimation() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [phaseLabel, setPhaseLabel] = useState('')
  const [fileState, setFileState] = useState<'scattered' | 'center' | 'hidden'>('scattered')
  const [coreVisible, setCoreVisible] = useState(false)
  const [corePulse, setCorePulse] = useState(false)
  const [routeVisible, setRouteVisible] = useState(false)
  const [apiVisible, setApiVisible] = useState(false)
  const [buildVisible, setBuildVisible] = useState(false)
  const [buildComplete, setBuildComplete] = useState(false)
  const [mergeDotsVisible, setMergeDotsVisible] = useState(false)
  const [deployVisible, setDeployVisible] = useState(false)
  const [isRestarting, setIsRestarting] = useState(false)

  const isMobile = useIsMobile()
  const filePositions = isMobile ? FILE_POSITIONS_MOBILE : FILE_POSITIONS
  const mergeDots = isMobile ? MERGE_DOTS_MOBILE : MERGE_DOTS

  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([])
  const intervals = useRef<ReturnType<typeof setInterval>[]>([])

  const later = (fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms)
    timeouts.current.push(t)
    return t
  }

  function resetAll() {
    timeouts.current.forEach(clearTimeout)
    intervals.current.forEach(clearInterval)
    timeouts.current = []
    intervals.current = []
    setPhase('idle')
    setPhaseLabel('')
    setFileState('scattered')
    setCoreVisible(false)
    setCorePulse(false)
    setRouteVisible(false)
    setApiVisible(false)
    setBuildVisible(false)
    setBuildComplete(false)
    setMergeDotsVisible(false)
    setDeployVisible(false)
    setIsRestarting(false)
  }

  async function play() {
    resetAll()
    await new Promise((r) => later(r as () => void, 200))

    setPhaseLabel('Raw codebase')
    setPhase('phase1')
    setFileState('scattered')

    later(() => {
      setPhaseLabel('Bini orchestrates')
      setPhase('phase2')
      setCoreVisible(true)
      later(() => {
        setFileState('center')
        later(() => {
          setCorePulse(true)
          later(() => setCorePulse(false), 500)
        }, 1000)
      }, 600)

      later(() => {
        setPhaseLabel('File-based routing')
        setPhase('phase3a')
        setCoreVisible(false)
        setFileState('hidden')
        later(() => setRouteVisible(true), 450)

        later(() => {
          setPhaseLabel('Integrated API layer')
          setPhase('phase3b')
          setRouteVisible(false)
          later(() => setApiVisible(true), 450)

          later(() => {
            setPhaseLabel('Lightning build with Vite 8')
            setPhase('phase3c')
            setApiVisible(false)
            later(() => {
              setBuildVisible(true)
              later(() => setBuildComplete(true), 2000)
            }, 450)

            later(() => {
              setPhaseLabel('One unified system')
              setPhase('phase4')
              setBuildVisible(false)
              setBuildComplete(false)
              later(() => setMergeDotsVisible(true), 350)

              later(() => {
                setPhaseLabel('Deploy everywhere — web & native')
                setPhase('phase5')
                setMergeDotsVisible(false)
                later(() => {
                  setDeployVisible(true)
                  later(() => {
                    setPhaseLabel('')
                    later(() => {
                      if (!isRestarting) {
                        setIsRestarting(true)
                        setDeployVisible(false)
                        later(() => {
                          play()
                        }, 300)
                      }
                    }, 1000)
                  }, 3500)
                }, 400)
              }, 2500)
            }, 2500)
          }, 2500)
        }, 2500)
      }, 2500)
    }, 2500)
  }

  useEffect(() => {
    play()
    return () => {
      timeouts.current.forEach(clearTimeout)
      intervals.current.forEach(clearInterval)
    }
  }, [isMobile])

  return (
    <div className={`relative w-full flex items-center justify-center select-none overflow-hidden ${isMobile ? 'min-h-110' : 'min-h-150'}`}>
      <style>{`
        @keyframes flow {
          0% { offset-distance: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { offset-distance: 100%; opacity: 0; }
        }
        .animate-flow {
          animation: flow 2s ease-in-out infinite;
        }
      `}</style>

      <AnimatePresence mode="wait">
        {phaseLabel && (
          <motion.div
            key={phaseLabel}
            initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
            transition={{ duration: 0.4, ease: easeSmooth }}
            className={`absolute ${isMobile ? 'bottom-4' : 'bottom-7'} left-0 right-0 flex justify-center z-20 pointer-events-none`}
          >
            <span className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-cyan-500/25 bg-cyan-500/10 backdrop-blur-md text-[8px] sm:text-[10px] font-semibold tracking-[0.14em] uppercase text-cyan-400 font-mono">
              <motion.span
                className="size-1 sm:size-1.5 rounded-full bg-cyan-400"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              {phaseLabel}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 flex items-center justify-center">
        <AnimatePresence>
          {(phase === 'phase1' || phase === 'phase2') &&
            FILES.map((f, i) => (
              <FileChip
                key={f.id}
                label={f.label}
                color={f.color}
                position={filePositions[i]}
                toCenter={fileState === 'center'}
                delay={i * 0.1}
              />
            ))}
        </AnimatePresence>

        <AnimatePresence>{coreVisible && <CoreNode pulse={corePulse} />}</AnimatePresence>

        <AnimatePresence>
          {routeVisible && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.45, ease: easeSmooth }}
              className={`absolute ${isMobile ? 'w-70 h-60' : 'w-105 h-80'}`}
            >
              <motion.div
                initial={{ y: -12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.45, ease: easeOut }}
                className={`absolute left-1/2 -translate-x-1/2 ${isMobile ? 'top-2' : 'top-4'} px-4 sm:px-6 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl bg-cyan-500/10 border-2 border-cyan-500/70 text-xs sm:text-sm font-bold text-cyan-400 backdrop-blur-sm font-mono`}
              >
                /
              </motion.div>

              <svg className="absolute inset-0 w-full h-full z-10">
                <AnimatedLine x1="50%" y1={isMobile ? 40 : 52} x2="18%" y2={isMobile ? 100 : 140} delay={0.45} color="cyan" />
                <AnimatedLine x1="50%" y1={isMobile ? 40 : 52} x2="50%" y2={isMobile ? 100 : 140} delay={0.55} color="purple" />
                <AnimatedLine x1="50%" y1={isMobile ? 40 : 52} x2="82%" y2={isMobile ? 100 : 140} delay={0.65} color="emerald" />
                <AnimatedLine x1="50%" y1={isMobile ? 120 : 172} x2="40%" y2={isMobile ? 170 : 240} delay={0.85} color="amber" />
              </svg>

              <RouteNode
                label="/about"
                top={isMobile ? "100px" : "140px"}
                left="18%"
                colorClass="bg-cyan-500/10"
                borderClass="border-cyan-500/50"
                textClass="text-cyan-400"
                delay={0.55}
              />

              <RouteNode
                label="/blog"
                top={isMobile ? "100px" : "140px"}
                left="50%"
                colorClass="bg-violet-500/10"
                borderClass="border-violet-500/50"
                textClass="text-violet-400"
                delay={0.65}
              />

              <RouteNode
                label="/contact"
                top={isMobile ? "100px" : "140px"}
                left="82%"
                colorClass="bg-emerald-500/10"
                borderClass="border-emerald-500/60"
                textClass="text-emerald-400"
                delay={0.75}
              />

              <RouteNode
                label="/blog/[slug]"
                top={isMobile ? "170px" : "240px"}
                left="40%"
                colorClass="bg-amber-500/10"
                borderClass="border-amber-500/60"
                textClass="text-amber-400"
                delay={0.9}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {apiVisible && <ApiPhase />}
        </AnimatePresence>

        <AnimatePresence>
          {buildVisible && <ViteBuildPhase complete={buildComplete} />}
        </AnimatePresence>

        <AnimatePresence>
          {mergeDotsVisible &&
            mergeDots.map((d, i) => {
              const col = COLOR[d.color]
              return (
                <motion.div
                  key={i}
                  initial={{ x: d.x, y: d.y, opacity: 1, scale: 1 }}
                  animate={{ x: 0, y: 0, opacity: 0, scale: 0.3 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: i * 0.08,
                    ease: 'easeInOut',
                  }}
                  className={`absolute ${isMobile ? 'size-4' : 'size-5'} rounded-full ${col.pill}`}
                />
              )
            })}
        </AnimatePresence>

        <AnimatePresence>
          {deployVisible && <DeployPhase />}
        </AnimatePresence>
      </div>
    </div>
  )
}