// src/components/FoundationAnimation.tsx
import { m } from 'framer-motion'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { siReact, siVite, siTauri } from 'simple-icons'
import type { SimpleIcon as SimpleIconType } from 'simple-icons'

/* ─── Hono logo (hand-built, not in simple-icons) ─────────────────── */

function HonoLogo({ size = 24 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      width={size}
      height={size}
    >
      <path
        fill="#ff5b11"
        d="M12.4365 0.2520325c0.062375-0.0080215 0.11745 0.0077075 0.16515 0.0471875 1.755075 2.142025 3.40665 4.359855 4.954725 6.65348 1.14615 1.725625 2.121325 3.550175 2.92565 5.4738 1.2845 3.426025 0.616 6.40675-2.005475 8.9421-2.293725 1.938575-4.936225 2.693575-7.927575 2.265025-3.57555-0.729025-6.00575-2.7974-7.290525-6.205225-0.33465-1.109425-0.44475-2.241925-0.3303-3.397525 0.19055-1.9891 0.662425-3.9081 1.415625-5.7569 0.31385-0.75435 0.722825-1.4464 1.2269-2.076275 0.411225 0.4898 0.80445 0.993175 1.179675 1.510025 0.17375 0.181625 0.354625 0.35465 0.542675 0.51905C8.728325 5.378325 10.44285 2.7201 12.4365 0.2520325Z"
        opacity=".993"
      />
      <path
        fill="#ff9758"
        d="M12.10625 4.07425c1.73145 2.008325 3.296525 4.1475 4.695175 6.41755 0.438525 0.75115 0.800275 1.537625 1.085325 2.3594 0.593825 2.336175-0.043225 4.26305-1.9111 5.7805-1.80655 1.2712-3.788425 1.6487-5.945675 1.132525-2.326325-0.721875-3.671175-2.286975-4.034575-4.6952-0.088175-0.7593-0.009525-1.4986 0.23595-2.217825 0.35005-0.888875 0.774725-1.73825 1.274075-2.54815 0.471875-0.6921 0.94375-1.38415 1.415625-2.07625 1.071925-1.378375 2.13365-2.762525 3.1852-4.15255Z"
      />
    </svg>
  )
}

/* ─── Tool definitions ────────────────────────────────────────────── */

type Side = 'top' | 'right' | 'bottom' | 'left'

const TOOLS: {
  name: string
  icon: SimpleIconType | null
  color: string // vivid colour used on dark backgrounds
  lightColor: string // deeper colour used on light backgrounds (better contrast)
  description: string
  features: string[]
  label: string
  side: Side
}[] = [
  {
    name: 'Vite 8',
    icon: siVite as SimpleIconType,
    color: '#a855f7',
    lightColor: '#7e22ce',
    description: 'Next Generation Frontend Tooling',
    features: ['Rust-powered build', 'Instant HMR', 'Optimized bundles'],
    label: 'Bundler',
    side: 'top',
  },
  {
    name: 'Hono 4',
    icon: null,
    color: '#f97316',
    lightColor: '#c2410c',
    description: 'Ultrafast Edge Framework',
    features: ['Edge-ready', 'Middleware', 'Type-safe RPC'],
    label: 'API',
    side: 'right',
  },
  {
    name: 'Tauri 2',
    icon: siTauri as SimpleIconType,
    color: '#ffc131',
    lightColor: '#b45309',
    description: 'Build Smaller, Faster, and More Secure Desktop & Mobile Apps',
    features: ['Native binaries', 'Rust-powered core', 'Web, desktop & mobile'],
    label: 'Native',
    side: 'bottom',
  },
  {
    name: 'React 19',
    icon: siReact as SimpleIconType,
    color: '#00e5ff',
    lightColor: '#0e7490',
    description: 'The Library for Web & Native',
    features: ['Actions', 'Concurrent rendering', 'Compiler'],
    label: 'UI',
    side: 'left',
  },
]

type Tool = (typeof TOOLS)[number]

/* ─── Types ───────────────────────────────────────────────────────── */

interface Point {
  x: number
  y: number
}

interface WireGeo {
  sx: number
  sy: number
  ex: number
  ey: number
  d: string
  totalLength: number
}

interface Geo {
  w: number
  h: number
  chipTop: Point
  chipRight: Point
  chipBottom: Point
  chipLeft: Point
  cardPoints: Record<string, Point>
}

function segLen(ax: number, ay: number, bx: number, by: number) {
  return Math.hypot(bx - ax, by - ay)
}

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

/**
 * Detects dark mode so SVG strokes / accents can swap to higher-contrast
 * colours in light mode. Works with a `.dark` class on <html> (class strategy)
 * and falls back to the OS preference when no `.dark` / `.light` class is used.
 */
function useIsDark() {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const root = document.documentElement
    const mq = window.matchMedia('(prefers-color-scheme: dark)')

    const check = () => {
      if (root.classList.contains('dark')) setIsDark(true)
      else if (root.classList.contains('light')) setIsDark(false)
      else setIsDark(mq.matches)
    }

    check()
    const mo = new MutationObserver(check)
    mo.observe(root, { attributes: true, attributeFilter: ['class', 'data-theme'] })
    mq.addEventListener('change', check)
    return () => {
      mo.disconnect()
      mq.removeEventListener('change', check)
    }
  }, [])

  return isDark
}

const toolColor = (tool: Tool, isDark: boolean) => (isDark ? tool.color : tool.lightColor)

/* ─── Chip diagonal sweep ─────────────────────────────────────────── */

function ChipSweepLight() {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl"
      style={{ zIndex: 10 }}
    >
      {/* Dark mode: soft white shimmer */}
      <m.div
        className="absolute hidden dark:block"
        style={{
          width: '220%',
          height: '220%',
          top: '-60%',
          left: '-160%',
          background:
            'linear-gradient(125deg, transparent 40%, rgba(255,255,255,0.0) 44%, rgba(255,255,255,0.04) 48%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.04) 52%, rgba(255,255,255,0.0) 56%, transparent 60%)',
        }}
        animate={{ left: ['-160%', '120%'] }}
        transition={{ duration: 3.0, repeat: Infinity, repeatDelay: 2.5, ease: 'easeInOut' }}
      />
      {/* Light mode: stronger accent-tinted shimmer */}
      <m.div
        className="absolute block dark:hidden"
        style={{
          width: '220%',
          height: '220%',
          top: '-60%',
          left: '-160%',
          background:
            'linear-gradient(125deg, transparent 38%, rgba(8,145,178,0.0) 43%, rgba(8,145,178,0.16) 47%, rgba(8,145,178,0.32) 50%, rgba(8,145,178,0.16) 53%, rgba(8,145,178,0.0) 57%, transparent 62%)',
        }}
        animate={{ left: ['-160%', '120%'] }}
        transition={{ duration: 3.0, repeat: Infinity, repeatDelay: 2.5, ease: 'easeInOut' }}
      />
    </div>
  )
}

/* ─── Continuous light ray ────────────────────────────────────────── */

function LightRay({
  wire,
  color,
  duration = 1.8,
  delay = 0,
  glowIntensity = 4,
  strokeWidth = 2.5,
}: {
  wire: WireGeo
  color: string
  duration?: number
  delay?: number
  glowIntensity?: number
  strokeWidth?: number
}) {
  const pathRef = useRef<SVGPathElement>(null)
  const [len, setLen] = useState(wire.totalLength || 200)

  useEffect(() => {
    if (pathRef.current) {
      const l = pathRef.current.getTotalLength()
      if (l > 0) setLen(l)
    }
  }, [wire.d])

  const dashLen = Math.min(len * 0.22, 60)
  const travel = len + dashLen * 2

  return (
    <m.path
      ref={pathRef}
      d={wire.d}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={`${dashLen} ${len + dashLen}`}
      animate={{ strokeDashoffset: [travel, -travel] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'linear' }}
      style={{ filter: `drop-shadow(0 0 ${glowIntensity}px ${color})` }}
    />
  )
}

/* ─── Wire layer (shared by desktop + mobile) ─────────────────────── */

function WireLayer({
  geo,
  getWire,
  isMobile,
  isDark,
  prefersReducedMotion,
}: {
  geo: Geo
  getWire: (tool: Tool) => WireGeo | null
  isMobile: boolean
  isDark: boolean
  prefersReducedMotion: boolean
}) {
  // Light mode gets noticeably stronger wires; dark mode stays close to the original.
  const glowWidth = isMobile ? 4 : 8
  const glowOpacity = isDark ? 0.06 : 0.14
  const lineWidth = isMobile ? (isDark ? 0.8 : 1.2) : isDark ? 1 : 1.6
  const startOpacity = isDark ? 0.1 : 0.35
  const endOpacity = isDark ? 0.6 : 1
  const dotR = isMobile ? 1.8 : 2.5
  const startDot = isDark ? 0.35 : 0.7
  const endDot = isDark ? 0.55 : 0.95

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width={geo.w}
      height={geo.h}
      style={{ zIndex: 1 }}
    >
      <defs>
        {TOOLS.map((tool, i) => {
          const c = toolColor(tool, isDark)
          return (
            <linearGradient
              key={i}
              id={`wg${i}`}
              x1={tool.side === 'right' ? '1' : '0'}
              y1={tool.side === 'top' ? '1' : '0'}
              x2={tool.side === 'left' ? '1' : '0'}
              y2={tool.side === 'bottom' ? '1' : '0'}
            >
              <stop offset="0%" stopColor={c} stopOpacity={startOpacity} />
              <stop offset="100%" stopColor={c} stopOpacity={endOpacity} />
            </linearGradient>
          )
        })}
      </defs>

      {TOOLS.map((tool, i) => {
        const w = getWire(tool)
        if (!w) return null
        const c = toolColor(tool, isDark)
        return (
          <g key={i}>
            <path
              d={w.d}
              fill="none"
              stroke={c}
              strokeWidth={glowWidth}
              strokeOpacity={glowOpacity}
              strokeLinecap="round"
            />
            <path
              d={w.d}
              fill="none"
              stroke={`url(#wg${i})`}
              strokeWidth={lineWidth}
              strokeLinecap="round"
            />
            <circle cx={w.sx} cy={w.sy} r={dotR} fill={c} opacity={startDot} />
            <circle cx={w.ex} cy={w.ey} r={dotR} fill={c} opacity={endDot} />
          </g>
        )
      })}

      {!prefersReducedMotion &&
        TOOLS.map((tool, i) => {
          const w = getWire(tool)
          if (!w) return null
          return (
            <LightRay
              key={i}
              wire={w}
              color={toolColor(tool, isDark)}
              duration={1.6 + i * 0.25}
              delay={i * 0.5}
              glowIntensity={isMobile ? 2 : isDark ? 4 : 3}
              strokeWidth={isDark ? 2.5 : 3}
            />
          )
        })}
    </svg>
  )
}

/* ─── Pin ticks around the chip ───────────────────────────────────── */

function Ticks({
  vertical,
  count,
  accent,
  duration,
  delayStep,
  delayOffset = 0,
  prefersReducedMotion,
  small,
}: {
  vertical: boolean
  count: number
  accent: string
  duration: number
  delayStep: number
  delayOffset?: number
  prefersReducedMotion: boolean
  small: boolean
}) {
  const mid = Math.floor(count / 2)

  const sizeClass = vertical ? (small ? 'w-px h-2' : 'w-px h-4') : small ? 'h-px w-2' : 'h-px w-4'
  // Slightly thicker ticks in light mode so they actually read on white
  const thick = vertical ? 'w-[1.5px] dark:w-px' : 'h-[1.5px] dark:h-px'
  const sizeCls = vertical ? sizeClass.replace('w-px', thick) : sizeClass.replace('h-px', thick)

  const containerClass = vertical
    ? small
      ? 'flex gap-0.5'
      : 'flex gap-1.5'
    : small
      ? 'flex flex-col gap-0.5'
      : 'flex flex-col gap-2'

  return (
    <div className={containerClass}>
      {[...Array(count)].map((_, i) => (
        <m.div
          key={i}
          className={`${sizeCls} rounded-full bg-neutral-500 dark:bg-slate-600`}
          style={i === mid ? { background: accent } : undefined}
          animate={
            prefersReducedMotion
              ? {}
              : { opacity: i === mid ? [0.5, 1, 0.5] : [0.25, 0.55, 0.25] }
          }
          transition={
            prefersReducedMotion
              ? {}
              : { duration, repeat: Infinity, delay: i * delayStep + delayOffset }
          }
        />
      ))}
    </div>
  )
}

/* ─── Chip (shared by desktop + mobile) ───────────────────────────── */

const Chip = React.forwardRef<
  HTMLDivElement,
  { size: 'sm' | 'lg'; prefersReducedMotion: boolean; isDark: boolean }
>(({ size, prefersReducedMotion, isDark }, ref) => {
  const isLarge = size === 'lg'
  const c = (i: number) => toolColor(TOOLS[i], isDark)

  return (
    <m.div
      ref={ref}
      className={
        (isLarge
          ? 'relative w-32 h-32 rounded-2xl '
          : 'relative w-14 h-14 rounded-lg ') +
        'flex items-center justify-center overflow-hidden border border-slate-400/60 dark:border-slate-400/15 ' +
        'bg-linear-to-br from-white to-slate-200 dark:from-[#1e293b] dark:to-[#0f172a]'
      }
      style={{
        boxShadow: isDark
          ? isLarge
            ? '0 20px 40px rgba(0,0,0,0.12)'
            : '0 8px 16px rgba(0,0,0,0.12)'
          : isLarge
            ? '0 0 0 1px rgba(15,23,42,0.06), 0 18px 36px rgba(15,23,42,0.22)'
            : '0 0 0 1px rgba(15,23,42,0.06), 0 8px 16px rgba(15,23,42,0.2)',
      }}
    >
      {!prefersReducedMotion && <ChipSweepLight />}

      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 128 128"
        style={{ opacity: isDark ? 0.15 : 0.7 }}
      >
        <line x1="64" y1="0" x2="64" y2="28" stroke={c(0)} strokeWidth="1.5" />
        <circle cx="64" cy="28" r="2" fill={c(0)} />
        <line x1="128" y1="64" x2="100" y2="64" stroke={c(1)} strokeWidth="1.5" />
        <circle cx="100" cy="64" r="2" fill={c(1)} />
        <line x1="64" y1="128" x2="64" y2="100" stroke={c(2)} strokeWidth="1.5" />
        <circle cx="64" cy="100" r="2" fill={c(2)} />
        <line x1="0" y1="64" x2="28" y2="64" stroke={c(3)} strokeWidth="1.5" />
        <circle cx="28" cy="64" r="2" fill={c(3)} />
        <rect
          x="44"
          y="44"
          width="40"
          height="40"
          rx="4"
          fill="none"
          stroke={isDark ? 'rgba(148,163,184,0.4)' : 'rgba(71,85,105,0.65)'}
          strokeWidth={isDark ? 0.75 : 1}
        />
      </svg>

      <img
        src="/logo.svg"
        alt="Bini.js"
        width={isLarge ? 56 : 24}
        height={isLarge ? 56 : 24}
        className={`relative object-contain z-10 ${isLarge ? 'w-14 h-14' : 'w-6 h-6'}`}
      />
    </m.div>
  )
})
Chip.displayName = 'Chip'

/* ─── Main component ──────────────────────────────────────────────── */

export function FoundationAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)
  const chipRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<Record<string, React.RefObject<HTMLDivElement | null>>>(
    Object.fromEntries(TOOLS.map((t) => [t.name, React.createRef()]))
  )

  const [geo, setGeo] = useState<Geo | null>(null)
  const isMobile = useIsMobile()
  const isDark = useIsDark()
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const measure = () => {
      const cont = containerRef.current
      const chip = chipRef.current
      if (!cont || !chip) return
      const cr = cont.getBoundingClientRect()
      const hr = chip.getBoundingClientRect()

      const chipCx = hr.left - cr.left + hr.width / 2
      const chipCy = hr.top - cr.top + hr.height / 2

      const chipTop: Point = { x: chipCx, y: hr.top - cr.top }
      const chipRight: Point = { x: hr.left - cr.left + hr.width, y: chipCy }
      const chipBottom: Point = { x: chipCx, y: hr.bottom - cr.top }
      const chipLeft: Point = { x: hr.left - cr.left, y: chipCy }

      const cardPoints: Record<string, Point> = {}
      TOOLS.forEach((tool) => {
        const el = cardRefs.current[tool.name]?.current
        if (!el) return
        const r = el.getBoundingClientRect()
        const cx = r.left - cr.left + r.width / 2
        const cy = r.top - cr.top + r.height / 2

        if (tool.side === 'top') cardPoints[tool.name] = { x: cx, y: r.bottom - cr.top }
        else if (tool.side === 'bottom') cardPoints[tool.name] = { x: cx, y: r.top - cr.top }
        else if (tool.side === 'left') cardPoints[tool.name] = { x: r.right - cr.left, y: cy }
        else cardPoints[tool.name] = { x: r.left - cr.left, y: cy }
      })

      setGeo({ w: cr.width, h: cr.height, chipTop, chipRight, chipBottom, chipLeft, cardPoints })
    }

    measure()
    const ro = new ResizeObserver(measure)
    if (containerRef.current) ro.observe(containerRef.current)
    const t = setTimeout(measure, 200)
    return () => {
      ro.disconnect()
      clearTimeout(t)
    }
  }, [isMobile])

  const getWire = useCallback(
    (tool: Tool): WireGeo | null => {
      if (!geo) return null
      const card = geo.cardPoints[tool.name]
      if (!card) return null

      const chipPoint =
        tool.side === 'top'
          ? geo.chipTop
          : tool.side === 'right'
            ? geo.chipRight
            : tool.side === 'bottom'
              ? geo.chipBottom
              : geo.chipLeft

      const sx = card.x,
        sy = card.y
      const ex = chipPoint.x,
        ey = chipPoint.y
      const d = `M ${sx} ${sy} L ${ex} ${ey}`

      return { sx, sy, ex, ey, d, totalLength: segLen(sx, sy, ex, ey) }
    },
    [geo]
  )

  const CardComponent = isMobile ? MiniToolCard : ToolCard
  const refOf = (name: string) => cardRefs.current[name] as React.RefObject<HTMLDivElement>
  const accent = (i: number) => toolColor(TOOLS[i], isDark)

  const tickCount = isMobile ? 3 : 5

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full select-none overflow-hidden"
      style={{ minHeight: '100%' }}
    >
      {geo && (
        <WireLayer
          geo={geo}
          getWire={getWire}
          isMobile={isMobile}
          isDark={isDark}
          prefersReducedMotion={prefersReducedMotion}
        />
      )}

      <div
        className="relative w-full h-full grid"
        style={
          isMobile
            ? {
                zIndex: 2,
                gridTemplateColumns: '1fr auto 1fr',
                gridTemplateRows: 'auto auto auto',
                columnGap: 'clamp(12px, 8vw, 24px)',
                rowGap: 'clamp(16px, 6vh, 28px)',
                alignItems: 'center',
                justifyItems: 'center',
                padding: 'clamp(8px, 2vw, 16px)',
                height: '100%',
                minHeight: '300px',
              }
            : {
                zIndex: 2,
                gridTemplateColumns: '1fr auto 1fr',
                gridTemplateRows: 'auto auto auto',
                columnGap: 'clamp(48px, 12vw, 120px)',
                rowGap: 'clamp(48px, 10vh, 80px)',
                alignItems: 'center',
                justifyItems: 'center',
                padding: '20px',
                height: '100%',
                minHeight: '500px',
              }
        }
      >
        {/* Top — Vite */}
        <div style={{ gridColumn: 2, gridRow: 1 }}>
          <CardComponent tool={TOOLS[0]} cardRef={refOf('Vite 8')} delay={0.1} isDark={isDark} />
        </div>

        {/* Left — React */}
        <div style={{ gridColumn: 1, gridRow: 2 }}>
          <CardComponent tool={TOOLS[3]} cardRef={refOf('React 19')} delay={0.2} isDark={isDark} />
        </div>

        {/* Center — chip */}
        <m.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
          className="flex flex-col items-center"
          style={{ gridColumn: 2, gridRow: 2 }}
        >
          <div className={isMobile ? 'mb-0.5' : 'mb-1.5'}>
            <Ticks
              vertical
              small={isMobile}
              count={tickCount}
              accent={accent(0)}
              duration={2.5}
              delayStep={0.13}
              prefersReducedMotion={prefersReducedMotion}
            />
          </div>

          <div className="relative flex items-center">
            <div className={isMobile ? 'mr-1' : 'mr-2'}>
              <Ticks
                vertical={false}
                small={isMobile}
                count={tickCount}
                accent={accent(3)}
                duration={2.2}
                delayStep={0.18}
                prefersReducedMotion={prefersReducedMotion}
              />
            </div>

            <Chip
              ref={chipRef}
              size={isMobile ? 'sm' : 'lg'}
              prefersReducedMotion={prefersReducedMotion}
              isDark={isDark}
            />

            <div className={isMobile ? 'ml-1' : 'ml-2'}>
              <Ticks
                vertical={false}
                small={isMobile}
                count={tickCount}
                accent={accent(1)}
                duration={2.2}
                delayStep={0.18}
                delayOffset={0.5}
                prefersReducedMotion={prefersReducedMotion}
              />
            </div>
          </div>

          <div className={isMobile ? 'mt-0.5' : 'mt-1.5'}>
            <Ticks
              vertical
              small={isMobile}
              count={tickCount}
              accent={accent(2)}
              duration={2.5}
              delayStep={0.13}
              delayOffset={0.9}
              prefersReducedMotion={prefersReducedMotion}
            />
          </div>
        </m.div>

        {/* Right — Hono */}
        <div style={{ gridColumn: 3, gridRow: 2 }}>
          <CardComponent tool={TOOLS[1]} cardRef={refOf('Hono 4')} delay={0.15} isDark={isDark} />
        </div>

        {/* Bottom — Tauri */}
        <div style={{ gridColumn: 2, gridRow: 3 }}>
          <CardComponent tool={TOOLS[2]} cardRef={refOf('Tauri 2')} delay={0.25} isDark={isDark} />
        </div>
      </div>
    </div>
  )
}

/* ─── Full tool card (desktop) ────────────────────────────────────── */

function ToolCard({
  tool,
  cardRef,
  delay,
  isDark,
}: {
  tool: Tool
  cardRef: React.RefObject<HTMLDivElement>
  delay: number
  isDark: boolean
}) {
  const c = toolColor(tool, isDark)

  const initialOffset =
    tool.side === 'top'
      ? { y: -18 }
      : tool.side === 'bottom'
        ? { y: 18 }
        : tool.side === 'left'
          ? { x: -18 }
          : { x: 18 }

  const hoverOffset =
    tool.side === 'top'
      ? { y: 3 }
      : tool.side === 'bottom'
        ? { y: -3 }
        : tool.side === 'left'
          ? { x: -3 }
          : { x: 3 }

  return (
    <m.div
      ref={cardRef}
      initial={{ opacity: 0, ...initialOffset }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ ...hoverOffset, transition: { duration: 0.18 } }}
      className="w-48 sm:w-52 rounded-2xl p-5 flex flex-col gap-3 cursor-default bg-linear-to-br from-white to-slate-100 dark:from-[#151f2e] dark:to-[#0d1422]"
      style={{
        border: `1px solid ${c}${isDark ? '33' : '80'}`,
        boxShadow: isDark
          ? `0 0 0 1px ${c}14, 0 8px 28px rgba(0,0,0,0.08)`
          : `0 0 0 1px ${c}22, 0 10px 28px rgba(15,23,42,0.16)`,
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: `${c}${isDark ? '12' : '1f'}`,
            border: `1px solid ${c}${isDark ? '22' : '55'}`,
          }}
        >
          {tool.name === 'Hono 4' ? (
            <HonoLogo size={20} />
          ) : tool.icon ? (
            <svg
              role="img"
              viewBox="0 0 24 24"
              width={20}
              height={20}
              fill={c}
              dangerouslySetInnerHTML={{ __html: tool.icon.svg }}
            />
          ) : null}
        </div>
        <div>
          <h3 className="text-[13px] font-semibold leading-tight text-neutral-950 dark:text-white/90">
            {tool.name}
          </h3>
          <span
            className="text-[10px] font-semibold tracking-wide uppercase"
            style={{ color: c, opacity: isDark ? 0.85 : 1 }}
          >
            {tool.label}
          </span>
        </div>
      </div>

      <div className="h-px bg-neutral-300 dark:bg-slate-700/60" />

      <p className="text-[11.5px] leading-relaxed text-neutral-700 dark:text-slate-400">
        {tool.description}
      </p>

      <div className="flex flex-col gap-1.5">
        {tool.features.map((f, fi) => (
          <div key={fi} className="flex items-center gap-2">
            <div
              className="w-1.5 h-1.5 dark:w-1 dark:h-1 rounded-full shrink-0"
              style={{ background: c, opacity: isDark ? 0.7 : 1 }}
            />
            <span className="text-[11px] text-neutral-700 dark:text-slate-500">{f}</span>
          </div>
        ))}
      </div>
    </m.div>
  )
}

/* ─── Mini tool card (mobile) ─────────────────────────────────────── */

function MiniToolCard({
  tool,
  cardRef,
  delay,
  isDark,
}: {
  tool: Tool
  cardRef: React.RefObject<HTMLDivElement>
  delay: number
  isDark: boolean
}) {
  const c = toolColor(tool, isDark)

  const initialOffset =
    tool.side === 'top'
      ? { y: -8 }
      : tool.side === 'bottom'
        ? { y: 8 }
        : tool.side === 'left'
          ? { x: -8 }
          : { x: 8 }

  return (
    <m.div
      ref={cardRef}
      initial={{ opacity: 0, ...initialOffset }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-lg p-1.5 flex items-center gap-1.5 cursor-default bg-linear-to-br from-white to-slate-100 dark:from-[#151f2e] dark:to-[#0d1422]"
      style={{
        border: `1px solid ${c}${isDark ? '33' : '80'}`,
        boxShadow: isDark
          ? `0 0 0 1px ${c}14, 0 4px 12px rgba(0,0,0,0.08)`
          : `0 0 0 1px ${c}22, 0 4px 12px rgba(15,23,42,0.16)`,
      }}
    >
      <div
        className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
        style={{
          background: `${c}${isDark ? '12' : '1f'}`,
          border: `1px solid ${c}${isDark ? '22' : '55'}`,
        }}
      >
        {tool.name === 'Hono 4' ? (
          <HonoLogo size={12} />
        ) : tool.icon ? (
          <svg
            role="img"
            viewBox="0 0 24 24"
            width={12}
            height={12}
            fill={c}
            dangerouslySetInnerHTML={{ __html: tool.icon.svg }}
          />
        ) : null}
      </div>
      <div className="flex flex-col min-w-0">
        <h3 className="text-[9px] font-semibold leading-tight text-neutral-950 dark:text-white/90">
          {tool.name}
        </h3>
        <span
          className="text-[7px] font-semibold tracking-wide uppercase"
          style={{ color: c, opacity: isDark ? 0.85 : 1 }}
        >
          {tool.label}
        </span>
      </div>
    </m.div>
  )
}