// src/components/BiniAnimation.tsx
import { AnimatePresence, m } from 'framer-motion'
import { Check, Zap, Box, FileCode, FileJson, FileText, Globe } from 'lucide-react'
import React, { useState, useEffect, useRef } from 'react'
import { siApple, siLinux, siAndroid } from 'simple-icons'

/* ─── Icons ───────────────────────────────────────────────────────── */

const WindowsIcon = ({ className = '', size = 20 }: { className?: string; size?: number }) => (
  <svg viewBox="0 0 512 512.02" width={size} height={size} className={className} fill="currentColor">
    <path d="M0 512.02h242.686V269.335H0V512.02zm0-269.334h242.686V0H0v242.686zm269.314 0H512V0H269.314v242.686zm0 269.334H512V269.335H269.314V512.02z" />
  </svg>
)

function SimpleIcon({
  icon,
  className = '',
  size = 20,
}: {
  icon: { svg: string }
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

/* ─── Types + constants ───────────────────────────────────────────── */

type Phase = 'idle' | 'phase1' | 'phase2' | 'phase3a' | 'phase3b' | 'phase3c' | 'phase4' | 'phase5'

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

const easeOut = [0.22, 1, 0.36, 1] as const
const easeFast = [0.25, 0.1, 0.25, 1.0] as const
const easeSmooth = [0.4, 0.0, 0.2, 1.0] as const

/* ─── Color tokens (theme-aware) ──────────────────────────────────── */

const COLOR: Record<
  string,
  { bg: string; border: string; text: string; pill: string; line: string }
> = {
  cyan: {
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/50',
    text: 'text-cyan-600 dark:text-cyan-400',
    pill: 'bg-cyan-500',
    line: 'stroke-cyan-500 dark:stroke-cyan-400',
  },
  purple: {
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/50',
    text: 'text-violet-600 dark:text-violet-400',
    pill: 'bg-violet-500',
    line: 'stroke-violet-500 dark:stroke-violet-400',
  },
  emerald: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/50',
    text: 'text-emerald-600 dark:text-emerald-400',
    pill: 'bg-emerald-500',
    line: 'stroke-emerald-500 dark:stroke-emerald-400',
  },
  amber: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/50',
    text: 'text-amber-600 dark:text-amber-400',
    pill: 'bg-amber-500',
    line: 'stroke-amber-500 dark:stroke-amber-400',
  },
  rose: {
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/50',
    text: 'text-rose-600 dark:text-rose-400',
    pill: 'bg-rose-500',
    line: 'stroke-rose-500 dark:stroke-rose-400',
  },
  blue: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/50',
    text: 'text-blue-600 dark:text-blue-400',
    pill: 'bg-blue-500',
    line: 'stroke-blue-500 dark:stroke-blue-400',
  },
  yellow: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/50',
    text: 'text-yellow-600 dark:text-yellow-400',
    pill: 'bg-yellow-500',
    line: 'stroke-yellow-500 dark:stroke-yellow-400',
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

const DEPLOY_PLATFORMS = [
  { name: 'Windows', icon: 'windows', color: 'cyan' },
  { name: 'macOS', icon: siApple, color: 'purple' },
  { name: 'Linux', icon: siLinux, color: 'amber' },
  { name: 'iOS', icon: siApple, color: 'blue' },
  { name: 'Android', icon: siAndroid, color: 'emerald' },
  { name: 'Web', icon: 'web', color: 'rose' },
]

/* ─── Hooks ───────────────────────────────────────────────────────── */

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}

function usePrefersReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReduced(mq.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return prefersReduced
}

/* ─── Phase label pill ────────────────────────────────────────────── */

function PhasePill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-cyan-500/25 bg-cyan-500/10 backdrop-blur-md text-[8px] sm:text-[10px] font-semibold tracking-[0.14em] uppercase text-cyan-600 dark:text-cyan-400 font-sans whitespace-nowrap">
      <m.span
        className="size-1 sm:size-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      {label}
    </span>
  )
}

/* ─── Sub-components ──────────────────────────────────────────────── */

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
    <m.div
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
      className={`absolute flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl font-sans text-[9px] sm:text-xs font-medium whitespace-nowrap backdrop-blur-sm border ${c.bg} ${c.border} ${c.text}`}
    >
      <span className={`size-1 sm:size-1.5 rounded-full ${c.pill} opacity-80`} />
      {label}
    </m.div>
  )
}

function CoreNode({ pulse }: { pulse: boolean }) {
  const isMobile = useIsMobile()

  return (
    <m.div
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: pulse ? 1.04 : 1, opacity: 1 }}
      exit={{ scale: 0.7, opacity: 0, transition: { duration: 0.3 } }}
      transition={{ duration: pulse ? 0.3 : 0.5, ease: easeOut }}
      className={`absolute flex flex-col items-center justify-center ${isMobile ? 'size-20' : 'size-27'}`}
    >
      <div className="relative flex flex-col items-center justify-center w-full h-full rounded-xl sm:rounded-2xl bg-white border-2 border-cyan-500/60 backdrop-blur-lg overflow-hidden dark:bg-[#0c1017]">
        <div className="relative z-10 flex items-center justify-center">
          <img
            src="/logo.svg"
            alt="Bini.js"
            width={48}
            height={48}
            className={`${isMobile ? 'w-8 h-8' : 'w-12 h-12'} object-contain`}
          />
        </div>
      </div>
    </m.div>
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
  const lineColor = COLOR[color]?.line || 'stroke-emerald-500 dark:stroke-emerald-400'

  return (
    <>
      <m.line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        className="stroke-neutral-300 stroke-2 dark:stroke-slate-700"
        strokeDasharray="6 4"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.3 }}
        transition={{ delay, duration: 0.7, ease: easeSmooth }}
      />
      <m.line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        className={`${lineColor} stroke-2`}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: delay + 0.3, duration: 0.8, ease: easeSmooth }}
      />
      <m.circle
        r="4"
        className={`fill-${color}-500 dark:fill-${color}-400`}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0], offsetDistance: ['0%', '100%'] }}
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
    <m.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, duration: 0.4, ease: easeOut }}
      className={`absolute -translate-x-1/2 ${isMobile ? 'px-2.5 py-1 text-[8px]' : 'px-4 py-1.5 text-xs'} rounded-xl backdrop-blur-sm border font-sans font-semibold ${colorClass} ${borderClass} ${textClass}`}
      style={{ top, left }}
    >
      {label}
    </m.div>
  )
}

function ApiPhase() {
  const isMobile = useIsMobile()

  return (
    <m.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.45, ease: easeSmooth }}
      className={`absolute flex flex-col items-center gap-4 sm:gap-7 ${isMobile ? 'w-72' : 'w-95'}`}
    >
      <m.div
        initial={{ y: -12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.45, ease: easeOut }}
        className="px-5 sm:px-8 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/60 text-[11px] sm:text-[13px] font-bold text-emerald-600 dark:text-emerald-400 backdrop-blur-sm font-sans"
      >
        Hono API Gateway
      </m.div>
      <div className="flex gap-3 sm:gap-5">
        {[
          { m: 'GET', c: 'emerald' },
          { m: 'POST', c: 'blue' },
          { m: 'PUT', c: 'amber' },
          { m: 'DELETE', c: 'rose' },
        ].map(({ m: method, c }, i) => {
          const col = COLOR[c]
          return (
            <m.span
              key={method}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.35 + i * 0.1, duration: 0.35, ease: easeOut }}
              className={`px-2.5 sm:px-3.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-[8px] sm:text-[10px] font-bold tracking-widest backdrop-blur-sm border ${col.bg} ${col.border} ${col.text} font-sans`}
            >
              {method}
            </m.span>
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
            <m.div
              key={path}
              initial={{ x: -16, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 + i * 0.12, duration: 0.35, ease: easeSmooth }}
              className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border backdrop-blur-sm ${col.bg} ${col.border}`}
            >
              <span
                className={`text-[9px] sm:text-[10px] font-bold min-w-9 sm:min-w-10.5 ${col.text} font-sans`}
              >
                {method}
              </span>
              <span className="text-[9px] sm:text-[11px] text-neutral-600 dark:text-neutral-400 font-sans truncate">
                {isMobile ? path.replace('/api/', '') : path}
              </span>
              <m.span
                className={`ml-auto size-1 sm:size-1.5 rounded-full ${col.pill}`}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.3 }}
              />
            </m.div>
          )
        })}
      </div>
    </m.div>
  )
}

function ViteBuildPhase({ complete, showLabel }: { complete: boolean; showLabel: boolean }) {
  const isMobile = useIsMobile()

  const viteFiles = [
    { file: 'dist/index.html', size: '0.35 kB', gzip: '0.25 kB' },
    { file: 'dist/css/layout-CsD4AsI6.css', size: '0.09 kB', gzip: '0.09 kB' },
    { file: 'dist/css/index-axLa4IPg.css', size: '17.16 kB', gzip: '4.12 kB' },
    { file: 'dist/js/login-BaO--sYG.js', size: '0.12 kB', gzip: '0.13 kB' },
    { file: 'dist/js/page-Bj8uMWmJ.js', size: '0.87 kB', gzip: '0.40 kB' },
    { file: 'dist/js/layout-DXNSgwk1.js', size: '0.91 kB', gzip: '0.41 kB' },
    { file: 'dist/js/page-CV_CS8ok.js', size: '1.03 kB', gzip: '0.46 kB' },
    { file: 'dist/js/about-D_WdE-3m.js', size: '2.75 kB', gzip: '0.99 kB' },
    { file: 'dist/js/page-CWILBaN4.js', size: '4.30 kB', gzip: '1.75 kB' },
    { file: 'dist/js/index-RxgYnHEt.js', size: '270.32 kB', gzip: '84.83 kB' },
  ]

  const ssgRoutes = [
    { route: '/', out: 'dist/index.html' },
    { route: '/about', out: 'dist/about/index.html' },
    { route: '/login', out: 'dist/login/index.html' },
    { route: '/blog', out: 'dist/blog/index.html' },
    { route: '/blog/hello-world', out: 'dist/blog/hello-world/index.html' },
    { route: '/blog/getting-started', out: 'dist/blog/getting-started/index.html' },
    { route: '/blog/why-bini', out: 'dist/blog/why-bini/index.html' },
  ]

  return (
    <m.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.45, ease: easeSmooth }}
      className={`absolute flex flex-col items-center gap-2 sm:gap-3 ${isMobile ? 'w-72' : 'w-150'}`}
    >
      <div className="relative w-full rounded-lg sm:rounded-xl overflow-hidden border border-neutral-200 bg-white backdrop-blur-sm p-3 sm:p-4 font-mono dark:border-slate-700/50 dark:bg-[#0d1117]">
        {/* Header: vite version + status */}
        <div className="flex items-center gap-1.5 sm:gap-2 mb-2">
          <Zap className="size-3 sm:size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="text-[9px] sm:text-[11px] font-semibold">
            <span className="text-emerald-600 dark:text-emerald-400">vite</span>
            <span className="text-neutral-600 dark:text-slate-400"> v8.3.0 </span>
            <span className="text-neutral-500 dark:text-slate-500">
              {isMobile ? 'building...' : 'building client environment for production...'}
            </span>
          </span>
        </div>

        {/* Modules transformed */}
        <div className="mb-1.5">
          <div className="flex items-center gap-1.5">
            <Check className="size-3 sm:size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="text-[9px] sm:text-[11px] text-emerald-600 dark:text-emerald-400">
              36 modules transformed.
            </span>
          </div>
          <div className="text-[8px] sm:text-[10px] text-neutral-500 pl-4 sm:pl-5 mt-0.5 dark:text-slate-500">
            computing gzip size...
          </div>
        </div>

        {/* File list */}
        <div className="space-y-0.5">
          {viteFiles.map((item, i) => {
            const getIcon = (file: string) => {
              if (file.endsWith('.html'))
                return (
                  <FileCode className="size-2.5 sm:size-3 shrink-0 text-yellow-600 dark:text-yellow-400" />
                )
              if (file.endsWith('.css'))
                return (
                  <FileText className="size-2.5 sm:size-3 shrink-0 text-yellow-600 dark:text-yellow-400" />
                )
              if (file.endsWith('.js'))
                return (
                  <FileJson className="size-2.5 sm:size-3 shrink-0 text-yellow-600 dark:text-yellow-400" />
                )
              return (
                <Box className="size-2.5 sm:size-3 shrink-0 text-yellow-600 dark:text-yellow-400" />
              )
            }

            const getFileColor = (file: string) => {
              if (file.endsWith('.html')) return 'text-amber-600 dark:text-amber-400'
              if (file.endsWith('.css')) return 'text-cyan-600 dark:text-cyan-400'
              if (file.endsWith('.js')) return 'text-violet-600 dark:text-violet-400'
              return 'text-neutral-600 dark:text-neutral-400'
            }

            return (
              <m.div
                key={item.file}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3, ease: easeSmooth }}
                className="flex items-center gap-1.5 text-[8px] sm:text-[10px]"
              >
                {getIcon(item.file)}
                <span className={`${getFileColor(item.file)} truncate`}>{item.file}</span>
                <span className="ml-auto text-neutral-500 tabular-nums shrink-0 dark:text-slate-500">
                  {item.size}
                  {complete && (
                    <span className="text-neutral-400 dark:text-slate-600">
                      {' '}
                      │ <span className="hidden sm:inline">gzip: </span>
                      <span className="text-emerald-600 dark:text-emerald-400/70">
                        {item.gzip}
                      </span>
                    </span>
                  )}
                </span>
              </m.div>
            )
          })}
        </div>

        {/* Built in */}
        {complete && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="mt-2 flex items-center gap-1.5"
          >
            <Check className="size-3 sm:size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="text-[9px] sm:text-[11px] text-emerald-600 dark:text-emerald-400">
              built in <span className="font-bold">436ms</span>
            </span>
          </m.div>
        )}

        {/* SSG phase */}
        {complete && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.3 }}
            className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-neutral-200 dark:border-slate-800"
          >
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-[9px] sm:text-[11px] font-bold text-cyan-600 dark:text-cyan-400">
                STEP
              </span>
              <span className="text-[9px] sm:text-[11px] text-neutral-700 dark:text-neutral-300">
                Pre-rendering routes
              </span>
            </div>

            <div className="space-y-0.5">
              {ssgRoutes.map((item, i) => (
                <m.div
                  key={item.route}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.05 + i * 0.06, duration: 0.25, ease: easeSmooth }}
                  className="flex items-center gap-1.5 text-[8px] sm:text-[10px]"
                >
                  <span className="text-emerald-600 dark:text-emerald-400 shrink-0">ok</span>
                  <span className="text-neutral-700 dark:text-neutral-300 tabular-nums">
                    {item.route.padEnd(isMobile ? 12 : 20)}
                  </span>
                  <span className="text-neutral-500 dark:text-slate-500 shrink-0">→</span>
                  <span className="text-neutral-500 dark:text-slate-500 truncate">{item.out}</span>
                </m.div>
              ))}
            </div>

            <div className="mt-2 flex items-center gap-1.5">
              <span className="text-[9px] sm:text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                SUCCESS
              </span>
              <span className="text-[9px] sm:text-[11px] text-neutral-700 dark:text-neutral-300">
                Pre-rendered{' '}
                <span className="font-bold text-neutral-900 dark:text-white">7</span> routes
              </span>
            </div>

            <div className="mt-0.5 text-[8px] sm:text-[10px] text-cyan-600 dark:text-cyan-400">
              Completed in 1.61s
            </div>

            <div className="mt-2 flex items-center gap-1.5">
              <span className="text-[9px] sm:text-[11px] font-bold text-blue-600 dark:text-blue-400">
                INFO
              </span>
              <span className="text-[9px] sm:text-[11px] text-neutral-700 dark:text-neutral-300">
                Output directory:{' '}
              </span>
              <span className="text-[8px] sm:text-[10px] text-cyan-600 dark:text-cyan-400 truncate">
                {isMobile ? 'C:\\...\\new\\dist' : 'C:\\Users\\rbini\\OneDrive\\Desktop\\new\\dist'}
              </span>
            </div>
          </m.div>
        )}
      </div>

      {/* Phase label pill - below the terminal box */}
      <AnimatePresence>
        {showLabel && (
          <m.div
            key="build-label"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35, ease: easeSmooth }}
          >
            <PhasePill label="Lightning build with Vite 8" />
          </m.div>
        )}
      </AnimatePresence>
    </m.div>
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
    <m.div
      initial={{ x: xOffset, opacity: 0, scale: 0.95 }}
      animate={{ x: 0, opacity: 1, scale: 1 }}
      transition={{ delay: groupDelay + index * 0.06, duration: 0.35, ease: easeOut }}
      whileHover={{ y: -2, scale: 1.02, transition: { duration: 0.15 } }}
      className={`relative overflow-hidden rounded-lg sm:rounded-xl border backdrop-blur-sm ${col.bg} ${col.border} p-3 sm:p-4 cursor-pointer group flex items-center justify-center`}
    >
      <div className="flex items-center gap-3 sm:gap-3.5">
        <div className={col.text}>{renderIcon()}</div>
        <span className={`text-[11px] sm:text-sm font-bold ${col.text} font-sans`}>
          {platform.name}
        </span>
      </div>
    </m.div>
  )
}

function DeployPhase() {
  const isMobile = useIsMobile()
  const row1 = DEPLOY_PLATFORMS.slice(0, 3)
  const row2 = DEPLOY_PLATFORMS.slice(3, 6)

  return (
    <m.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.5, ease: easeSmooth }}
      className={`absolute ${isMobile ? 'w-80' : 'w-140'} -mt-4`}
    >
      <m.div
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.4, ease: easeOut }}
        className="text-center mb-4 sm:mb-6"
      >
        <span className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full bg-linear-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/40 text-[10px] sm:text-xs font-bold text-purple-700 dark:text-purple-300 font-sans">
          {isMobile ? 'Deploy Everywhere' : 'One Codebase · Deploy Everywhere'}
        </span>
      </m.div>

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

        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.3 }}
          className="flex items-center gap-3 sm:gap-4 my-1 sm:my-2"
        >
          <div className="h-px flex-1 bg-neutral-200 dark:bg-slate-800" />
          <span className="text-[7px] sm:text-[9px] text-neutral-500 font-sans tracking-wider uppercase dark:text-slate-500">
            Native & Web
          </span>
          <div className="h-px flex-1 bg-neutral-200 dark:bg-slate-800" />
        </m.div>

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
    </m.div>
  )
}

/* ─── Reduced-motion fallback ─────────────────────────────────────── */

function StaticFallback() {
  return (
    <div className="relative w-full flex items-center justify-center min-h-110 sm:min-h-150 select-none">
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-col items-center justify-center size-27 rounded-2xl bg-white border-2 border-cyan-500/60 dark:bg-[#0c1017]">
          <img
            src="/logo.svg"
            alt="Bini.js"
            width={48}
            height={48}
            className="w-12 h-12 object-contain"
          />
        </div>
        <span className="text-xs font-sans tracking-[0.14em] uppercase text-cyan-600 dark:text-cyan-400/70">
          Bini.js
        </span>
      </div>
    </div>
  )
}

/* ─── Main component ──────────────────────────────────────────────── */

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
  const prefersReducedMotion = usePrefersReducedMotion()
  const filePositions = isMobile ? FILE_POSITIONS_MOBILE : FILE_POSITIONS
  const mergeDots = isMobile ? MERGE_DOTS_MOBILE : MERGE_DOTS

  const containerRef = useRef<HTMLDivElement>(null)
  const isPlayingRef = useRef(false)
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([])
  const intervals = useRef<ReturnType<typeof setInterval>[]>([])

  const later = (fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms)
    timeouts.current.push(t)
    return t
  }

  function resetAll() {
    isPlayingRef.current = false
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
    if (isPlayingRef.current) return
    resetAll()
    isPlayingRef.current = true

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
            // Label for the build phase is now rendered inside ViteBuildPhase,
            // so we intentionally do NOT set a global phase label here.
            setPhaseLabel('')
            setPhase('phase3c')
            setApiVisible(false)
            later(() => {
              setBuildVisible(true)
              later(() => setBuildComplete(true), 3000)
            }, 450)

            later(() => {
              setPhaseLabel('One unified system')
              setPhase('phase4')
              setBuildVisible(false)
              setBuildComplete(false)
              later(() => setMergeDotsVisible(true), 350)

              later(() => {
                setPhaseLabel('Deploy everywhere - web & native')
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
                          isPlayingRef.current = false
                          play()
                        }, 300)
                      }
                    }, 1000)
                  }, 3500)
                }, 400)
              }, 2500)
            }, 7500)
          }, 2500)
        }, 2500)
      }, 2500)
    }, 2500)
  }

  useEffect(() => {
    if (prefersReducedMotion) return

    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          play()
        } else {
          resetAll()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(el)

    return () => {
      observer.disconnect()
      timeouts.current.forEach(clearTimeout)
      intervals.current.forEach(clearInterval)
    }
  }, [isMobile, prefersReducedMotion])

  if (prefersReducedMotion) {
    return <StaticFallback />
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full flex items-center justify-center select-none overflow-hidden ${isMobile ? 'min-h-110' : 'min-h-150'}`}
    >
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

      {/* Global phase label — skipped for phase3c (build) so the label can
          render inline under the Vite box instead. */}
      <AnimatePresence mode="wait">
        {phaseLabel && (
          <m.div
            key={phaseLabel}
            initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
            transition={{ duration: 0.4, ease: easeSmooth }}
            className={`absolute ${isMobile ? 'bottom-4' : 'bottom-7'} left-0 right-0 flex justify-center z-20 pointer-events-none`}
          >
            <PhasePill label={phaseLabel} />
          </m.div>
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
            <m.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.45, ease: easeSmooth }}
              className={`absolute ${isMobile ? 'w-70 h-60' : 'w-105 h-80'}`}
            >
              <m.div
                initial={{ y: -12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.45, ease: easeOut }}
                className={`absolute left-1/2 -translate-x-1/2 ${isMobile ? 'top-2' : 'top-4'} px-4 sm:px-6 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl bg-cyan-500/10 border-2 border-cyan-500/70 text-xs sm:text-sm font-bold text-cyan-600 dark:text-cyan-400 backdrop-blur-sm font-sans`}
              >
                /
              </m.div>

              <svg className="absolute inset-0 w-full h-full z-10">
                <AnimatedLine
                  x1="50%"
                  y1={isMobile ? 40 : 52}
                  x2="18%"
                  y2={isMobile ? 100 : 140}
                  delay={0.45}
                  color="cyan"
                />
                <AnimatedLine
                  x1="50%"
                  y1={isMobile ? 40 : 52}
                  x2="50%"
                  y2={isMobile ? 100 : 140}
                  delay={0.55}
                  color="purple"
                />
                <AnimatedLine
                  x1="50%"
                  y1={isMobile ? 40 : 52}
                  x2="82%"
                  y2={isMobile ? 100 : 140}
                  delay={0.65}
                  color="emerald"
                />
                <AnimatedLine
                  x1="50%"
                  y1={isMobile ? 120 : 172}
                  x2="40%"
                  y2={isMobile ? 170 : 240}
                  delay={0.85}
                  color="amber"
                />
              </svg>

              <RouteNode
                label="/about"
                top={isMobile ? '100px' : '140px'}
                left="18%"
                colorClass="bg-cyan-500/10"
                borderClass="border-cyan-500/50"
                textClass="text-cyan-600 dark:text-cyan-400"
                delay={0.55}
              />

              <RouteNode
                label="/blog"
                top={isMobile ? '100px' : '140px'}
                left="50%"
                colorClass="bg-violet-500/10"
                borderClass="border-violet-500/50"
                textClass="text-violet-600 dark:text-violet-400"
                delay={0.65}
              />

              <RouteNode
                label="/contact"
                top={isMobile ? '100px' : '140px'}
                left="82%"
                colorClass="bg-emerald-500/10"
                borderClass="border-emerald-500/60"
                textClass="text-emerald-600 dark:text-emerald-400"
                delay={0.75}
              />

              <RouteNode
                label="/blog/[slug]"
                top={isMobile ? '170px' : '240px'}
                left="40%"
                colorClass="bg-amber-500/10"
                borderClass="border-amber-500/60"
                textClass="text-amber-600 dark:text-amber-400"
                delay={0.9}
              />
            </m.div>
          )}
        </AnimatePresence>

        <AnimatePresence>{apiVisible && <ApiPhase />}</AnimatePresence>

        <AnimatePresence>
          {buildVisible && (
            <ViteBuildPhase
              complete={buildComplete}
              showLabel={phase === 'phase3c'}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {mergeDotsVisible &&
            mergeDots.map((d, i) => {
              const col = COLOR[d.color]
              return (
                <m.div
                  key={i}
                  initial={{ x: d.x, y: d.y, opacity: 1, scale: 1 }}
                  animate={{ x: 0, y: 0, opacity: 0, scale: 0.3 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, delay: i * 0.08, ease: 'easeInOut' }}
                  className={`absolute ${isMobile ? 'size-4' : 'size-5'} rounded-full ${col.pill}`}
                />
              )
            })}
        </AnimatePresence>

        <AnimatePresence>{deployVisible && <DeployPhase />}</AnimatePresence>
      </div>
    </div>
  )
}