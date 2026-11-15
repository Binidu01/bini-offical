// src/components/BiniAnimation.tsx
import { AnimatePresence, motion } from 'motion/react'
import { Check, Globe } from 'lucide-react'
import React, { useState, useEffect, useRef } from 'react'
import { siApple, siLinux, siAndroid } from 'simple-icons' // SSR: safe — simple-icons is pure data (no window/document)

/* ─── Icons ───────────────────────────────────────────────────────── */

const WindowsIcon = ({ className = '', size = 20 }: { className?: string; size?: number }) => (
  <svg
    aria-hidden="true"
    focusable="false"
    viewBox="0 0 512 512.02"
    width={size}
    height={size}
    className={className}
    fill="currentColor"
  >
    <path d="M0 512.02h242.686V269.335H0V512.02zm0-269.334h242.686V0H0v242.686zm269.314 0H512V0H269.314v242.686zm0 269.334H512V269.335H269.314V512.02z" />
  </svg>
)

function SimpleIcon({
  icon,
  className = '',
  size = 20,
}: {
  icon: { path: string }
  className?: string
  size?: number
}) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
    >
      <path d={icon.path} />
    </svg>
  )
}

/* ─── Types + constants ───────────────────────────────────────────── */

const FILES = [
  { id: 'f0', label: 'page.tsx', color: 'cyan' },
  { id: 'f1', label: 'layout.tsx', color: 'purple' },
  { id: 'f2', label: 'api/send-email.ts', color: 'emerald' },
  { id: 'f3', label: 'blog/[slug].tsx', color: 'amber' },
  { id: 'f4', label: 'about/page.tsx', color: 'cyan' },
  { id: 'f5', label: 'contact.tsx', color: 'rose' },
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

// one chip recipe for the file chips, route nodes and platform cards, so they all look the same in light and dark mode
const CHIP = 'overflow-hidden rounded-lg sm:rounded-xl border backdrop-blur-sm'

/* ─── Color tokens (theme-aware) ──────────────────────────────────── */

const COLOR: Record<
  string,
  { bg: string; border: string; text: string; pill: string; line: string; fill: string }
> = {
  cyan: {
    bg: 'bg-cyan-500/15 dark:bg-cyan-500/10',
    border: 'border-cyan-600/70 dark:border-cyan-500/50',
    text: 'text-cyan-700 dark:text-cyan-400',
    pill: 'bg-cyan-500',
    line: 'stroke-cyan-600 dark:stroke-cyan-400',
    fill: 'fill-cyan-600 dark:fill-cyan-400',
  },
  purple: {
    bg: 'bg-violet-500/15 dark:bg-violet-500/10',
    border: 'border-violet-600/70 dark:border-violet-500/50',
    text: 'text-violet-700 dark:text-violet-400',
    pill: 'bg-violet-500',
    line: 'stroke-violet-600 dark:stroke-violet-400',
    fill: 'fill-violet-600 dark:fill-violet-400',
  },
  emerald: {
    bg: 'bg-emerald-500/15 dark:bg-emerald-500/10',
    border: 'border-emerald-600/70 dark:border-emerald-500/50',
    text: 'text-emerald-700 dark:text-emerald-400',
    pill: 'bg-emerald-500',
    line: 'stroke-emerald-600 dark:stroke-emerald-400',
    fill: 'fill-emerald-600 dark:fill-emerald-400',
  },
  amber: {
    bg: 'bg-amber-500/15 dark:bg-amber-500/10',
    border: 'border-amber-600/70 dark:border-amber-500/50',
    text: 'text-amber-700 dark:text-amber-400',
    pill: 'bg-amber-500',
    line: 'stroke-amber-600 dark:stroke-amber-400',
    fill: 'fill-amber-600 dark:fill-amber-400',
  },
  rose: {
    bg: 'bg-rose-500/15 dark:bg-rose-500/10',
    border: 'border-rose-600/70 dark:border-rose-500/50',
    text: 'text-rose-700 dark:text-rose-400',
    pill: 'bg-rose-500',
    line: 'stroke-rose-600 dark:stroke-rose-400',
    fill: 'fill-rose-600 dark:fill-rose-400',
  },
  blue: {
    bg: 'bg-blue-500/15 dark:bg-blue-500/10',
    border: 'border-blue-600/70 dark:border-blue-500/50',
    text: 'text-blue-700 dark:text-blue-400',
    pill: 'bg-blue-500',
    line: 'stroke-blue-600 dark:stroke-blue-400',
    fill: 'fill-blue-600 dark:fill-blue-400',
  },
  yellow: {
    bg: 'bg-yellow-500/15 dark:bg-yellow-500/10',
    border: 'border-yellow-600/70 dark:border-yellow-500/50',
    text: 'text-yellow-700 dark:text-yellow-400',
    pill: 'bg-yellow-500',
    line: 'stroke-yellow-600 dark:stroke-yellow-400',
    fill: 'fill-yellow-600 dark:fill-yellow-400',
  },
}

// SSR: siApple etc. are plain objects — safe at module scope
const DEPLOY_PLATFORMS = [
  { name: 'Windows', icon: 'windows', color: 'cyan' },
  { name: 'macOS', icon: siApple, color: 'purple' },
  { name: 'Linux', icon: siLinux, color: 'amber' },
  { name: 'iOS', icon: siApple, color: 'blue' },
  { name: 'Android', icon: siAndroid, color: 'emerald' },
  { name: 'Web', icon: 'web', color: 'rose' },
]

/* ─── Build log data (mirrors real `vite build` output) ───────────── */

type Tone = 'green' | 'cyan' | 'purple' | 'gray'
type BuildFile = { file: string; size: string; gzip: string; tone: Tone }

const VITE_VERSION = 'v8.3.7'

const CLIENT_BUILD = {
  env: 'client environment',
  modules: 37,
  builtIn: '514ms',
  files: [
    { file: 'dist/.bini/css-map.json', size: '0.17 kB', gzip: '0.11 kB', tone: 'green' },
    { file: 'dist/index.html', size: '0.28 kB', gzip: '0.22 kB', tone: 'green' },
    { file: 'dist/css/layout-CS15oam5.css', size: '11.86 kB', gzip: '3.27 kB', tone: 'purple' },
    { file: 'dist/js/layout-Bu0XgUOt.js', size: '0.17 kB', gzip: '0.16 kB', tone: 'cyan' },
    { file: 'dist/js/page-CLs8uloZ.js', size: '2.18 kB', gzip: '0.82 kB', tone: 'cyan' },
    { file: 'dist/js/index-C6YW5h5n.js', size: '329.03 kB', gzip: '103.35 kB', tone: 'cyan' },
  ] as BuildFile[],
}

const API_BUILD = {
  env: 'api environment',
  modules: 3,
  builtIn: '45ms',
  files: [
    { file: 'dist/api/hello-CKGtacTa.mjs', size: '0.26 kB', gzip: '0.22 kB', tone: 'cyan' },
    { file: 'dist/api/index.mjs', size: '7.56 kB', gzip: '2.51 kB', tone: 'cyan' },
  ] as BuildFile[],
}

const SSR_BUILD = {
  env: 'ssr environment',
  modules: 12,
  builtIn: '95ms',
  files: [
    { file: 'dist/.bini/server/chunks/layout-DZNjTB3r.js', size: '0.24 kB', gzip: '0.19 kB', tone: 'cyan' },
    { file: 'dist/.bini/server/chunks/page-DfH1VqOL.js', size: '2.83 kB', gzip: '0.91 kB', tone: 'cyan' },
    { file: 'dist/.bini/server/main.js', size: '18.97 kB', gzip: '4.79 kB', tone: 'cyan' },
  ] as BuildFile[],
}

const PRERENDER_BUILD = {
  env: '', // pre-render step has its own header text
  builtIn: '161ms',
  files: [
    { file: 'dist/index.html', size: '3.21 kB', gzip: '1.23 kB', tone: 'cyan' },
    { file: 'dist/404.html', size: '1.75 kB', gzip: '0.83 kB', tone: 'cyan' },
  ] as BuildFile[],
}

/* ─── SSR-safe hooks ──────────────────────────────────────────────── */

// SSR: default false on server AND on first client render → no hydration mismatch.
// The media-query check runs inside useEffect (browser only).
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mq = window.matchMedia('(max-width: 639px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return isMobile
}

// SSR: same pattern — default false, real check in effect only.
function usePrefersReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
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
    <span className="inline-flex items-center px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-cyan-600/40 dark:border-cyan-500/25 bg-cyan-500/15 dark:bg-cyan-500/10 backdrop-blur-md text-[8px] sm:text-[10px] font-semibold tracking-[0.14em] uppercase text-cyan-700 dark:text-cyan-400 font-sans whitespace-nowrap">
      {label}
    </span>
  )
}

/* ─── Sub-components (all motion.* — SSR-safe) ────────────────────── */

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
    // outer: position (fly out / collect); inner: the chip itself, which floats as one piece
    <motion.div
      initial={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
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
      className="absolute"
    >
      <motion.div
        animate={toCenter ? { y: 0 } : { y: [0, -5, 0] }}
        transition={
          toCenter
            ? { duration: 0.2 }
            : { duration: 3 + delay * 2, repeat: Infinity, ease: 'easeInOut', delay }
        }
        className={`${CHIP} relative flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 font-sans text-[9px] sm:text-xs font-bold whitespace-nowrap ${c.bg} ${c.border} ${c.text}`}
      >
        {label}
      </motion.div>
    </motion.div>
  )
}

function CoreNode({ pulse, slow = false }: { pulse: boolean; slow?: boolean }) {
  const isMobile = useIsMobile()

  return (
    <motion.div
      // in the deploy step the logo starts small and grows while the cards slide away
      initial={{ scale: slow ? 0.3 : 0.85, opacity: 0 }}
      animate={{ scale: pulse ? 1.04 : 1, opacity: 1 }}
      exit={{ scale: 0.7, opacity: 0, transition: { duration: 0.3 } }}
      transition={{
        duration: pulse ? 0.3 : slow ? 1.1 : 0.5,
        ease: slow ? easeSmooth : easeOut,
      }}
      className="absolute z-10 flex flex-col items-center justify-center"
    >
      <div className="relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white border-2 border-cyan-600/70 dark:border-cyan-500/60 backdrop-blur-lg overflow-hidden dark:bg-[#0c1017]">
        <div className="relative z-10 flex items-center justify-center">
          <img
            src="/logo.png"
            alt="Bini.js"
            className={`block max-w-none object-contain ${isMobile ? 'w-14' : 'w-20'}`}
          />
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
  const lineColor = COLOR[color]?.line || 'stroke-emerald-600 dark:stroke-emerald-400'

  return (
    <>
      <motion.line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        className="stroke-neutral-500 stroke-2 dark:stroke-slate-700"
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
      className={`absolute z-20 -translate-x-1/2 ${isMobile ? 'px-2.5 py-1 text-[8px]' : 'px-4 py-1.5 text-xs'} ${CHIP} font-sans font-bold whitespace-nowrap ${colorClass} ${borderClass} ${textClass}`}
      style={{ top, left }}
    >
      {label}
    </motion.div>
  )
}

function RouteTreePhase() {
  const isMobile = useIsMobile()

  // lines meet the boxes just under their borders, so they look connected without a solid base behind the chips
  const rootEdge = isMobile ? 36 : 50
  const rowTop = isMobile ? 100 : 140
  const rowTopEdge = rowTop + 2
  const rowBottomEdge = rowTop + (isMobile ? 20 : 28)
  const slugTop = isMobile ? 170 : 240
  const slugTopEdge = slugTop + 2

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.45, ease: easeSmooth }}
      className={`absolute ${isMobile ? 'w-70 h-60' : 'w-105 h-80'}`}
    >
      <svg className="absolute inset-0 w-full h-full z-10">
        <AnimatedLine x1="50%" y1={rootEdge} x2="18%" y2={rowTopEdge} delay={0.45} color="cyan" />
        <AnimatedLine x1="50%" y1={rootEdge} x2="50%" y2={rowTopEdge} delay={0.55} color="purple" />
        <AnimatedLine x1="50%" y1={rootEdge} x2="82%" y2={rowTopEdge} delay={0.65} color="emerald" />
        <AnimatedLine x1="50%" y1={rowBottomEdge} x2="40%" y2={slugTopEdge} delay={0.85} color="amber" />
      </svg>

      <motion.div
        initial={{ y: -12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.45, ease: easeOut }}
        className={`absolute z-20 left-1/2 -translate-x-1/2 ${isMobile ? 'top-2' : 'top-4'} ${CHIP} px-4 sm:px-6 py-1.5 sm:py-2 bg-cyan-500/15 dark:bg-cyan-500/10 border-cyan-600/70 dark:border-cyan-500/50 text-xs sm:text-sm font-bold text-cyan-700 dark:text-cyan-400 font-sans`}
      >
        /
      </motion.div>

      <RouteNode
        label="/about"
        top={`${rowTop}px`}
        left="18%"
        colorClass="bg-cyan-500/15 dark:bg-cyan-500/10"
        borderClass="border-cyan-600/70 dark:border-cyan-500/50"
        textClass="text-cyan-700 dark:text-cyan-400"
        delay={0.55}
      />
      <RouteNode
        label="/blog"
        top={`${rowTop}px`}
        left="50%"
        colorClass="bg-violet-500/15 dark:bg-violet-500/10"
        borderClass="border-violet-600/70 dark:border-violet-500/50"
        textClass="text-violet-700 dark:text-violet-400"
        delay={0.65}
      />
      <RouteNode
        label="/contact"
        top={`${rowTop}px`}
        left="82%"
        colorClass="bg-emerald-500/15 dark:bg-emerald-500/10"
        borderClass="border-emerald-600/70 dark:border-emerald-500/60"
        textClass="text-emerald-700 dark:text-emerald-400"
        delay={0.75}
      />
      <RouteNode
        label="/blog/[slug]"
        top={`${slugTop}px`}
        left="40%"
        colorClass="bg-amber-500/15 dark:bg-amber-500/10"
        borderClass="border-amber-600/70 dark:border-amber-500/60"
        textClass="text-amber-700 dark:text-amber-400"
        delay={0.9}
      />
    </motion.div>
  )
}

const INTER = { fontFamily: "'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif" }

function ApiPhase() {
  const isMobile = useIsMobile()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.45, ease: easeSmooth }}
      className={`absolute flex flex-col items-center gap-4 sm:gap-7 antialiased ${isMobile ? 'w-72' : 'w-95'}`}
      style={INTER}
    >
      <motion.div
        initial={{ y: -12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.45, ease: easeOut }}
        className="px-5 sm:px-8 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-emerald-500/15 dark:bg-emerald-500/10 border-2 border-emerald-600/70 dark:border-emerald-500/60 text-xs sm:text-sm font-semibold tracking-tight text-emerald-700 dark:text-emerald-400 backdrop-blur-sm"
      >
        Hono API Gateway
      </motion.div>
      <div className="flex gap-3 sm:gap-5">
        {[
          { m: 'GET', c: 'emerald' },
          { m: 'POST', c: 'blue' },
          { m: 'PUT', c: 'amber' },
          { m: 'DELETE', c: 'rose' },
        ].map(({ m: method, c }, i) => {
          const col = COLOR[c]
          return (
            <motion.span
              key={method}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.35 + i * 0.1, duration: 0.35, ease: easeOut }}
              className={`px-2.5 sm:px-3.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-[9px] sm:text-[11px] font-semibold tracking-wide backdrop-blur-sm border ${col.bg} ${col.border} ${col.text}`}
            >
              {method}
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
              // solid base (white in light mode, dark in dark mode) with the coloured tint on top, so the file name is readable in both themes
              className={`relative flex items-center gap-2 sm:gap-3 overflow-hidden px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border bg-white dark:bg-[#0d1117] ${col.border}`}
            >
              <span className={`pointer-events-none absolute inset-0 ${col.bg}`} />
              <span
                className={`relative text-[10px] sm:text-[11px] font-semibold tracking-wide min-w-9 sm:min-w-11 ${col.text}`}
              >
                {method}
              </span>
              <span className="relative text-[10px] sm:text-xs font-medium tracking-tight text-neutral-900 dark:text-white truncate">
                {isMobile ? path.replace('/api/', '') : path}
              </span>
              <motion.span
                className={`relative ml-auto size-1 sm:size-1.5 rounded-full ${col.pill}`}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.3 }}
              />
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

/* ─── Three dots merge (between the API step and the build step) ──── */

const MERGE_DOTS = [
  { x: 0, y: -90, pill: 'bg-rose-500' },
  { x: -90, y: 55, pill: 'bg-amber-400' },
  { x: 90, y: 55, pill: 'bg-blue-500' },
]

const MERGE_DOTS_MOBILE = [
  { x: 0, y: -60, pill: 'bg-rose-500' },
  { x: -60, y: 40, pill: 'bg-amber-400' },
  { x: 60, y: 40, pill: 'bg-blue-500' },
]

// red, yellow and blue dots fly into the centre and merge; the build terminal then opens from that spot
function MergeDots() {
  const isMobile = useIsMobile()
  const dots = isMobile ? MERGE_DOTS_MOBILE : MERGE_DOTS

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.1 } }}
      className="absolute"
    >
      {dots.map((d, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          initial={{ x: d.x, y: d.y, opacity: 0, scale: 0.6 }}
          animate={{ x: 0, y: 0, opacity: [0, 1, 1, 0], scale: 0.9 }}
          transition={{
            x: { duration: 0.9, delay: 0.25 + i * 0.06, ease: 'easeInOut' },
            y: { duration: 0.9, delay: 0.25 + i * 0.06, ease: 'easeInOut' },
            scale: { duration: 0.9, delay: 0.25 + i * 0.06, ease: 'easeInOut' },
            opacity: { duration: 1.3, delay: i * 0.06, times: [0, 0.2, 0.8, 1] },
          }}
          className={`absolute -ml-2 -mt-2 sm:-ml-2.5 sm:-mt-2.5 size-4 sm:size-5 rounded-full ${d.pill}`}
        />
      ))}
    </motion.div>
  )
}

/* ─── Shared build-log terminal (client / api / ssr / pre-render) ─── */

// build-log colours: light mode on white, dark mode on black (same palette as the docs code blocks)
const TONE: Record<Tone, string> = {
  green: 'text-[#098658] dark:text-[#89D185]',
  cyan: 'text-[#267F99] dark:text-[#4FC1FF]',
  purple: 'text-[#AF00DB] dark:text-[#C586C0]',
  gray: 'text-neutral-500 dark:text-neutral-400',
}

const GRAY = TONE.gray
const WHITE = 'text-neutral-900 dark:text-neutral-200'
const GREEN = TONE.green
const CYAN = TONE.cyan

// dir prefix is dimmed, file name carries the colour (same as the docs build output)
function splitPath(file: string) {
  const dir = file.startsWith('dist/.bini/server/')
    ? 'dist/.bini/server/'
    : file.startsWith('dist/api/')
      ? 'dist/api/'
      : 'dist/'
  return [dir, file.slice(dir.length)] as const
}

function BuildTerminal({
  headerText,
  headerTextMobile,
  modules,
  files,
  builtIn,
  complete,
  grow = false,
}: {
  grow?: boolean
  headerText: string
  headerTextMobile: string
  modules?: number
  files: BuildFile[]
  builtIn: string
  complete: boolean
}) {
  const isMobile = useIsMobile()
  // monospace columns: every row gets the same width, so the │ and gzip numbers line up
  const sizeW = Math.max(...files.map((f) => f.size.length))
  const gzipW = Math.max(...files.map((f) => f.gzip.length))

  return (
    <motion.div
      // `grow`: the merged dot from the API step opens up into the terminal
      initial={grow ? { opacity: 0, scale: 0.1, y: 0 } : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={grow ? { duration: 0.55, ease: easeOut } : { duration: 0.45, ease: easeSmooth }}
      className={`absolute flex flex-col items-center gap-2 sm:gap-3 ${isMobile ? 'w-72' : 'w-150'}`}
    >
      <div className="w-full rounded-lg border border-neutral-200 bg-white p-3 sm:p-4 font-mono dark:border-neutral-800 dark:bg-black">
        <div className="flex items-center gap-1.5 sm:gap-2 mb-2">
          <span className="text-[9px] sm:text-[11px] font-semibold truncate">
            <span className={CYAN}>vite {VITE_VERSION}</span>{' '}
            <span className={GREEN}>{isMobile ? headerTextMobile : headerText}</span>
          </span>
        </div>

        <div className="mb-1.5">
          {modules !== undefined && (
            <div className="flex items-center gap-1.5">
              <Check className={`size-3 sm:size-3.5 shrink-0 ${GREEN}`} />
              <span className={`text-[9px] sm:text-[11px] ${WHITE}`}>
                {modules} modules transformed.
              </span>
            </div>
          )}
          <div
            className={`text-[9px] sm:text-[11px] mt-0.5 ${WHITE}`}
          >
            computing gzip size...
          </div>
        </div>

        <div className="space-y-0.5">
          {files.map((item, i) => (
            <motion.div
              key={item.file}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3, ease: easeSmooth }}
              className="flex items-center gap-1.5 text-[8px] sm:text-[10px]"
            >
              <span className="min-w-0 truncate">
                <span className={GRAY}>{splitPath(item.file)[0]}</span>
                <span className={TONE[item.tone]}>{splitPath(item.file)[1]}</span>
              </span>
              <span className={`ml-auto flex shrink-0 whitespace-pre tabular-nums ${GRAY}`}>
                <span className="text-right" style={{ minWidth: `${sizeW}ch` }}>
                  {item.size}
                </span>
                <span className={complete ? '' : 'invisible'}>
                  {' │ '}
                  <span className="hidden sm:inline">gzip: </span>
                  <span className="inline-block text-right" style={{ minWidth: `${gzipW}ch` }}>
                    {item.gzip}
                  </span>
                </span>
              </span>
            </motion.div>
          ))}
        </div>

        {complete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="mt-2 flex items-center gap-1.5"
          >
            <Check className={`size-3 sm:size-3.5 shrink-0 ${GREEN}`} />
            <span className={`text-[9px] sm:text-[11px] ${WHITE}`}>
              built <span className={GREEN}>in {builtIn}</span>
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

function ViteBuildPhase({ complete }: { complete: boolean }) {
  return (
    <BuildTerminal
      headerText={`building ${CLIENT_BUILD.env} for production...`}
      headerTextMobile="building client..."
      modules={CLIENT_BUILD.modules}
      files={CLIENT_BUILD.files}
      builtIn={CLIENT_BUILD.builtIn}
      complete={complete}
      grow
    />
  )
}

function ApiBuildPhase({ complete }: { complete: boolean }) {
  return (
    <BuildTerminal
      headerText={`building ${API_BUILD.env} for production...`}
      headerTextMobile="building api..."
      modules={API_BUILD.modules}
      files={API_BUILD.files}
      builtIn={API_BUILD.builtIn}
      complete={complete}
    />
  )
}

function SsrBuildPhase({ complete }: { complete: boolean }) {
  return (
    <BuildTerminal
      headerText={`building ${SSR_BUILD.env} for production...`}
      headerTextMobile="building ssr..."
      modules={SSR_BUILD.modules}
      files={SSR_BUILD.files}
      builtIn={SSR_BUILD.builtIn}
      complete={complete}
    />
  )
}

function PrerenderPhase({ complete }: { complete: boolean }) {
  return (
    <BuildTerminal
      headerText="pre-rendering routes for production..."
      headerTextMobile="pre-rendering..."
      files={PRERENDER_BUILD.files}
      builtIn={PRERENDER_BUILD.builtIn}
      complete={complete}
    />
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
      className={`${CHIP} relative ${col.bg} ${col.border} p-3 sm:p-4 cursor-pointer group flex items-center justify-center`}
    >
      <div className="flex items-center gap-3 sm:gap-3.5">
        <div className={col.text}>{renderIcon()}</div>
        <span className={`text-[11px] sm:text-sm font-bold ${col.text} font-sans`}>
          {platform.name}
        </span>
      </div>
    </motion.div>
  )
}

// Six cards sit together as a tight 2×3 grid (no gap for the logo).
// When `collapsing` flips on, the top row slides up and the bottom row slides down
// while both fade out, and the Bini logo fades in at the center.
function DeployPhase({ collapsing }: { collapsing: boolean }) {
  const isMobile = useIsMobile()
  const row1 = DEPLOY_PLATFORMS.slice(0, 3)
  const row2 = DEPLOY_PLATFORMS.slice(3, 6)
  const travel = isMobile ? 90 : 130

  const rowMotion = (dir: -1 | 1) => ({
    animate: collapsing ? { y: dir * travel, opacity: 0 } : { y: 0, opacity: 1 },
    transition: { duration: 1.1, ease: easeSmooth },
  })

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      transition={{ duration: 0.5, ease: easeSmooth }}
      className={`absolute ${isMobile ? 'w-80' : 'w-140'}`}
    >
      <div className="flex flex-col gap-3 sm:gap-4">
        <motion.div className="grid grid-cols-3 gap-3 sm:gap-4" {...rowMotion(-1)}>
          {row1.map((platform, i) => (
            <PlatformCard
              key={platform.name}
              platform={platform}
              index={i}
              groupDelay={0.35}
              xOffset={i === 0 ? -12 : i === 1 ? 0 : 12}
            />
          ))}
        </motion.div>

        <motion.div className="grid grid-cols-3 gap-3 sm:gap-4" {...rowMotion(1)}>
          {row2.map((platform, i) => (
            <PlatformCard
              key={platform.name}
              platform={platform}
              index={i}
              groupDelay={0.65}
              xOffset={i === 0 ? -12 : i === 1 ? 0 : 12}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}

/* ─── Story: steps, pill + progress dots ────────────────────────── */

type StepId =
  | 'files'
  | 'collect'
  | 'routes'
  | 'api'
  | 'merge'
  | 'client'
  | 'apibuild'
  | 'ssr'
  | 'prerender'
  | 'deploy'

type Step = {
  id: StepId
  ms: number // how long the step stays on screen
  dot: number // which story dot is active
  pill: string
  caption: string // read out by screen readers + used by the reduced-motion fallback
  done?: number // build steps: when to show gzip + "built in"
}

const BUILD_PILL = 'Production build'
const BUILD_CAPTION = 'One command builds everything.'

// The loop: the deploy cards slide away from the center, the logo fades in, the logo bursts into floating files, Bini collects them again.
const STEPS: Step[] = [
  { id: 'files', ms: 3200, dot: 0, pill: 'Raw codebase', caption: 'Your project is just files.' },
  { id: 'collect', ms: 3600, dot: 1, pill: 'Bini orchestrates', caption: 'Bini.js collects your files.' },
  { id: 'routes', ms: 4000, dot: 2, pill: 'File-based routing', caption: 'Every file becomes a page.' },
  { id: 'api', ms: 4000, dot: 3, pill: 'Integrated API layer', caption: 'API routes live in the same project.' },
  { id: 'merge', ms: 1600, dot: 4, pill: BUILD_PILL, caption: BUILD_CAPTION },
  { id: 'client', ms: 3400, dot: 4, pill: BUILD_PILL, caption: BUILD_CAPTION, done: 1700 },
  { id: 'apibuild', ms: 2800, dot: 4, pill: BUILD_PILL, caption: BUILD_CAPTION, done: 1300 },
  { id: 'ssr', ms: 3000, dot: 4, pill: BUILD_PILL, caption: BUILD_CAPTION, done: 1400 },
  { id: 'prerender', ms: 3800, dot: 4, pill: BUILD_PILL, caption: BUILD_CAPTION, done: 1500 },
  { id: 'deploy', ms: 7500, dot: 5, pill: 'Deploy everywhere', caption: 'One codebase. Web and native.' },
]

/* ─── Reduced-motion fallback ─────────────────────────────────────── */

function StaticFallback() {
  const captions = Array.from(new Set(STEPS.map((s) => s.caption)))
  return (
    <div className="relative w-full flex items-center justify-center min-h-110 sm:min-h-150 select-none">
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border-2 border-cyan-600/70 dark:border-cyan-500/60 dark:bg-[#0c1017]">
          <img src="/logo.png" alt="Bini.js" className="block w-20 max-w-none object-contain" />
        </div>
        <span className="text-xs font-sans tracking-[0.14em] uppercase text-cyan-700 dark:text-cyan-400/70">
          Bini.js
        </span>
        <ol className="mt-2 space-y-1 text-center text-sm font-sans text-neutral-700 dark:text-neutral-300">
          {captions.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ol>
      </div>
    </div>
  )
}

/* ─── Main component ──────────────────────────────────────────────── */

export function BiniAnimation() {
  const [step, setStep] = useState(0)
  const [fileState, setFileState] = useState<'scattered' | 'center'>('scattered')
  const [corePulse, setCorePulse] = useState(false)
  const [buildComplete, setBuildComplete] = useState(false)
  const [collapsing, setCollapsing] = useState(false) // deploy cards sliding up/down and fading out
  const [inView, setInView] = useState(true)

  const isMobile = useIsMobile()
  const prefersReducedMotion = usePrefersReducedMotion()

  const containerRef = useRef<HTMLDivElement>(null)
  const stepRef = useRef(0)
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([])

  const at = (ms: number, fn: () => void) => {
    timeouts.current.push(setTimeout(fn, ms))
  }

  function clearTimers() {
    timeouts.current.forEach(clearTimeout)
    timeouts.current = []
  }

  // One clock: every step schedules its own sub-events, then hands over to the next.
  // The last step ends on the logo; the first step starts from that same logo,
  // so the loop has no cut, no reset and no blank frame.
  function go(i: number) {
    clearTimers()
    stepRef.current = i
    const s = STEPS[i]

    setStep(i)
    setBuildComplete(false)
    setCollapsing(false)
    setCorePulse(false)
    if (s.id === 'files') setFileState('scattered')

    if (s.id === 'collect') {
      at(700, () => setFileState('center'))
      at(1700, () => setCorePulse(true))
      at(2300, () => setCorePulse(false))
    }

    if (s.done) at(s.done, () => setBuildComplete(true))

    if (s.id === 'deploy') {
      // the top row slides up and the bottom row slides down while fading out; the Bini logo fades in at the center
      at(s.ms - 2800, () => setCollapsing(true))
      at(s.ms - 900, () => setCorePulse(true))
      at(s.ms - 500, () => setCorePulse(false))
    }

    at(s.ms, () => go((i + 1) % STEPS.length))
  }

  // Pause while off-screen or when the tab is hidden.
  useEffect(() => {
    const el = containerRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    let visible = true
    const update = () => setInView(visible && !document.hidden)
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      update()
    })
    io.observe(el)
    document.addEventListener('visibilitychange', update)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', update)
    }
  }, [prefersReducedMotion])

  // SSR: timers only start on the client, inside useEffect.
  useEffect(() => {
    if (prefersReducedMotion || !inView) return
    go(stepRef.current)
    return () => clearTimers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReducedMotion, inView])

  if (prefersReducedMotion) {
    return <StaticFallback />
  }

  const s = STEPS[step]
  const filePositions = isMobile ? FILE_POSITIONS_MOBILE : FILE_POSITIONS

  const chipsVisible = s.id === 'files' || s.id === 'collect'
  // no logo in 'Raw codebase'; it appears in 'Bini orchestrates' to collect the files, and again at the end of the deploy step as the cards slide away
  const coreVisible = s.id === 'collect' || (s.id === 'deploy' && collapsing)

  // the deploy scene stays mounted while collapsing so the rows can slide out
  const scene: string | null = s.id === 'files' || s.id === 'collect' ? null : s.id

  return (
    <div
      ref={containerRef}
      className={`relative w-full flex items-center justify-center select-none overflow-hidden ${isMobile ? 'min-h-110' : 'min-h-150'}`}
    >
      {/* screen-reader only caption (not shown visually) */}
      <p className="sr-only" role="status" aria-live="polite">
        {s.caption}
      </p>

      {/* phase name */}
      <div
        className={`absolute ${isMobile ? 'bottom-3' : 'bottom-5'} left-0 right-0 flex items-center justify-center z-20 pointer-events-none`}
      >
        <div className="h-6 sm:h-7 flex items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={s.pill}
              initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
              transition={{ duration: 0.35, ease: easeSmooth }}
            >
              <PhasePill label={s.pill} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        {/* floating files (they burst out of the logo at the start of the loop) */}
        <AnimatePresence>
          {chipsVisible &&
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

        {/* Bini: appears in 'Bini orchestrates' to collect the files, and at the end of the deploy step */}
        <AnimatePresence>{coreVisible && <CoreNode pulse={corePulse} slow={s.id === 'deploy'} />}</AnimatePresence>

        {/* route tree → API → build → deploy, one scene at a time */}
        <AnimatePresence mode="wait">
          {scene === 'routes' && <RouteTreePhase key="routes" />}
          {scene === 'api' && <ApiPhase key="api" />}
          {scene === 'merge' && <MergeDots key="merge" />}
          {scene === 'client' && <ViteBuildPhase key="client" complete={buildComplete} />}
          {scene === 'apibuild' && <ApiBuildPhase key="apibuild" complete={buildComplete} />}
          {scene === 'ssr' && <SsrBuildPhase key="ssr" complete={buildComplete} />}
          {scene === 'prerender' && <PrerenderPhase key="prerender" complete={buildComplete} />}
          {scene === 'deploy' && <DeployPhase key="deploy" collapsing={collapsing} />}
        </AnimatePresence>
      </div>
    </div>
  )
}