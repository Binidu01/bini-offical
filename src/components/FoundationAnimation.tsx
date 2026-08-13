import { motion, AnimatePresence } from 'framer-motion'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { siReact, siVite, siTauri } from 'simple-icons'
import type { SimpleIcon as SimpleIconType } from 'simple-icons'

// ─── Hono Logo (not in simple-icons, hand-built) ───────────────
function HonoLogo({ size = 24 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width={size} height={size}>
      <path fill="#ff5b11" d="M12.4365 0.2520325c0.062375-0.0080215 0.11745 0.0077075 0.16515 0.0471875 1.755075 2.142025 3.40665 4.359855 4.954725 6.65348 1.14615 1.725625 2.121325 3.550175 2.92565 5.4738 1.2845 3.426025 0.616 6.40675-2.005475 8.9421-2.293725 1.938575-4.936225 2.693575-7.927575 2.265025-3.57555-0.729025-6.00575-2.7974-7.290525-6.205225-0.33465-1.109425-0.44475-2.241925-0.3303-3.397525 0.19055-1.9891 0.662425-3.9081 1.415625-5.7569 0.31385-0.75435 0.722825-1.4464 1.2269-2.076275 0.411225 0.4898 0.80445 0.993175 1.179675 1.510025 0.17375 0.181625 0.354625 0.35465 0.542675 0.51905C8.728325 5.378325 10.44285 2.7201 12.4365 0.2520325Z" opacity=".993" strokeWidth="0.25"/>
      <path fill="#ff9758" d="M12.10625 4.07425c1.73145 2.008325 3.296525 4.1475 4.695175 6.41755 0.438525 0.75115 0.800275 1.537625 1.085325 2.3594 0.593825 2.336175-0.043225 4.26305-1.9111 5.7805-1.80655 1.2712-3.788425 1.6487-5.945675 1.132525-2.326325-0.721875-3.671175-2.286975-4.034575-4.6952-0.088175-0.7593-0.009525-1.4986 0.23595-2.217825 0.35005-0.888875 0.774725-1.73825 1.274075-2.54815 0.471875-0.6921 0.94375-1.38415 1.415625-2.07625 1.071925-1.378375 2.13365-2.762525 3.1852-4.15255Z" strokeWidth="0.25"/>
    </svg>
  )
}

// ─── Tool definitions ─────────────────────────────────────────
type Side = 'top' | 'right' | 'bottom' | 'left'

const TOOLS: {
  name: string
  icon: SimpleIconType | null
  color: string
  description: string
  features: string[]
  label: string
  side: Side
}[] = [
  {
    name: 'Vite 8',
    icon: siVite as SimpleIconType,
    color: '#a855f7',
    description: 'Next Generation Frontend Tooling',
    features: ['Rust-powered build', 'Instant HMR', 'Optimized bundles'],
    label: 'Bundler',
    side: 'top',
  },
  {
    name: 'Hono 4',
    icon: null,
    color: '#f97316',
    description: 'Ultrafast Edge Framework',
    features: ['Edge-ready', 'Middleware', 'Type-safe RPC'],
    label: 'API',
    side: 'right',
  },
  {
    name: 'Tauri 2',
    icon: siTauri as SimpleIconType,
    color: '#ffc131',
    description: 'Build Smaller, Faster, and More Secure Desktop & Mobile Apps',
    features: ['Native binaries', 'Rust-powered core', 'Web, desktop & mobile'],
    label: 'Native',
    side: 'bottom',
  },
  {
    name: 'React 19',
    icon: siReact as SimpleIconType,
    color: '#00e5ff',
    description: 'The Library for Web & Native',
    features: ['Actions', 'Concurrent rendering', 'Compiler'],
    label: 'UI',
    side: 'left',
  },
]

// ─── Types ────────────────────────────────────────────────────
interface Point { x: number; y: number }

interface WireGeo {
  sx: number; sy: number
  ex: number; ey: number
  d: string
  totalLength: number
}

interface Geo {
  w: number; h: number
  chipTop: Point
  chipRight: Point
  chipBottom: Point
  chipLeft: Point
  cardPoints: Record<string, Point>
}

function segLen(ax: number, ay: number, bx: number, by: number) {
  return Math.hypot(bx - ax, by - ay)
}

// ─── Chip diagonal sweep ────────────────────────────────────────
function ChipSweepLight() {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl"
      style={{ zIndex: 10 }}
    >
      <motion.div
        style={{
          position: 'absolute',
          width: '220%',
          height: '220%',
          top: '-60%',
          left: '-160%',
          background:
            'linear-gradient(125deg, transparent 40%, rgba(255,255,255,0.0) 44%, rgba(255,255,255,0.04) 48%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.04) 52%, rgba(255,255,255,0.0) 56%, transparent 60%)',
          transform: 'rotate(0deg)',
        }}
        animate={{ left: ['-160%', '120%'] }}
        transition={{
          duration: 3.0,
          repeat: Infinity,
          repeatDelay: 2.5,
          ease: 'easeInOut',
        }}
      />
    </div>
  )
}

// ─── Continuous light ray ─────────────────────────────────────
function LightRay({
  wire,
  color,
  duration = 1.8,
  delay = 0,
  glowIntensity = 4,
}: {
  wire: WireGeo
  color: string
  duration?: number
  delay?: number
  glowIntensity?: number
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
    <motion.path
      ref={pathRef}
      d={wire.d}
      fill="none"
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={`${dashLen} ${len + dashLen}`}
      animate={{ strokeDashoffset: [travel, -travel] }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
      style={{ filter: `drop-shadow(0 0 ${glowIntensity}px ${color})` }}
    />
  )
}

// ─── Hook for mobile detection ──────────────────────────────────
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

// ─── Main component ───────────────────────────────────────────
export function FoundationAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)
  const chipRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<Record<string, React.RefObject<HTMLDivElement | null>>>(
    Object.fromEntries(TOOLS.map((t) => [t.name, React.createRef()]))
  )

  const [geo, setGeo] = useState<Geo | null>(null)
  const isMobile = useIsMobile()

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
    return () => { ro.disconnect(); clearTimeout(t) }
  }, [])

  const getWire = useCallback((tool: (typeof TOOLS)[number]): WireGeo | null => {
    if (!geo) return null
    const card = geo.cardPoints[tool.name]
    if (!card) return null

    const chipPoint =
      tool.side === 'top' ? geo.chipTop :
      tool.side === 'right' ? geo.chipRight :
      tool.side === 'bottom' ? geo.chipBottom :
      geo.chipLeft

    const sx = card.x, sy = card.y
    const ex = chipPoint.x, ey = chipPoint.y
    const d = `M ${sx} ${sy} L ${ex} ${ey}`

    return { sx, sy, ex, ey, d, totalLength: segLen(sx, sy, ex, ey) }
  }, [geo])

  // Mobile: spread out to use available space
  if (isMobile) {
    return (
      <div
        ref={containerRef}
        className="relative w-full h-full select-none overflow-hidden"
        style={{ minHeight: '100%' }}
      >
        {geo && (
          <svg
            className="absolute inset-0 pointer-events-none"
            width={geo.w}
            height={geo.h}
            style={{ zIndex: 1 }}
          >
            <defs>
              {TOOLS.map((tool, i) => (
                <linearGradient
                  key={i}
                  id={`wg${i}`}
                  x1={tool.side === 'top' ? '0' : tool.side === 'bottom' ? '0' : tool.side === 'left' ? '0' : '1'}
                  y1={tool.side === 'top' ? '1' : tool.side === 'bottom' ? '0' : '0'}
                  x2={tool.side === 'top' ? '0' : tool.side === 'bottom' ? '0' : tool.side === 'left' ? '1' : '0'}
                  y2={tool.side === 'top' ? '0' : tool.side === 'bottom' ? '1' : '0'}
                >
                  <stop offset="0%" stopColor={tool.color} stopOpacity="0.08" />
                  <stop offset="100%" stopColor={tool.color} stopOpacity="0.55" />
                </linearGradient>
              ))}
            </defs>

            {TOOLS.map((tool, i) => {
              const w = getWire(tool)
              if (!w) return null
              return (
                <g key={i}>
                  <path
                    d={w.d}
                    fill="none"
                    stroke={tool.color}
                    strokeWidth={3}
                    strokeOpacity={0.04}
                    strokeLinecap="round"
                  />
                  <path
                    d={w.d}
                    fill="none"
                    stroke={`url(#wg${i})`}
                    strokeWidth={0.8}
                    strokeLinecap="round"
                  />
                  <circle cx={w.sx} cy={w.sy} r={1.5} fill={tool.color} opacity={0.3} />
                  <circle cx={w.ex} cy={w.ey} r={1.5} fill={tool.color} opacity={0.5} />
                </g>
              )
            })}

            {TOOLS.map((tool, i) => {
              const w = getWire(tool)
              if (!w) return null
              return (
                <LightRay
                  key={i}
                  wire={w}
                  color={tool.color}
                  duration={1.6 + i * 0.25}
                  delay={i * 0.5}
                  glowIntensity={2}
                />
              )
            })}
          </svg>
        )}

        <div
          className="relative w-full h-full grid"
          style={{
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
          }}
        >
          {/* Top card - mini */}
          <div style={{ gridColumn: 2, gridRow: 1 }}>
            <MiniToolCard
              tool={TOOLS[0]}
              cardRef={cardRefs.current['Vite 8'] as React.RefObject<HTMLDivElement>}
              delay={0.12}
            />
          </div>

          {/* Left card - mini */}
          <div style={{ gridColumn: 1, gridRow: 2 }}>
            <MiniToolCard
              tool={TOOLS[3]}
              cardRef={cardRefs.current['React 19'] as React.RefObject<HTMLDivElement>}
              delay={0.3}
            />
          </div>

          {/* Chip - smaller on mobile */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
            className="flex flex-col items-center"
            style={{ gridColumn: 2, gridRow: 2 }}
          >
            <div className="flex gap-0.5 mb-0.5">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-px h-2 rounded-full"
                  style={{ background: i === 1 ? '#a855f7' : 'rgb(71 85 105)' }}
                  animate={{ opacity: i === 1 ? [0.4, 0.8, 0.4] : [0.15, 0.4, 0.15] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.13 }}
                />
              ))}
            </div>

            <div className="relative flex items-center">
              <div className="flex flex-col gap-0.5 mr-1">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="h-px w-2 rounded-full"
                    style={{ background: i === 1 ? '#00e5ff' : 'rgb(71 85 105)' }}
                    animate={{ opacity: i === 1 ? [0.4, 0.8, 0.4] : [0.15, 0.4, 0.15] }}
                    transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.18 }}
                  />
                ))}
              </div>

              <motion.div
                ref={chipRef}
                className="relative w-14 h-14 rounded-lg flex items-center justify-center overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                  border: '1px solid rgba(148,163,184,0.08)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.35)',
                }}
              >
                <ChipSweepLight />

                <svg className="absolute inset-0 w-full h-full opacity-[0.1]" viewBox="0 0 128 128">
                  <line x1="64" y1="0" x2="64" y2="28" stroke="#a855f7" strokeWidth="1.5" />
                  <circle cx="64" cy="28" r="2" fill="#a855f7" />
                  <line x1="128" y1="64" x2="100" y2="64" stroke="#f97316" strokeWidth="1.5" />
                  <circle cx="100" cy="64" r="2" fill="#f97316" />
                  <line x1="64" y1="128" x2="64" y2="100" stroke="#ffc131" strokeWidth="1.5" />
                  <circle cx="64" cy="100" r="2" fill="#ffc131" />
                  <line x1="0" y1="64" x2="28" y2="64" stroke="#00e5ff" strokeWidth="1.5" />
                  <circle cx="28" cy="64" r="2" fill="#00e5ff" />
                  <rect x="44" y="44" width="40" height="40" rx="4"
                    fill="none" stroke="rgba(148,163,184,0.15)" strokeWidth="0.75" />
                </svg>

                <img
                  src="/logo.svg"
                  alt="Bini.js"
                  className="relative w-6 h-6 object-contain z-10"
                />
              </motion.div>

              <div className="flex flex-col gap-0.5 ml-1">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="h-px w-2 rounded-full"
                    style={{ background: i === 1 ? '#f97316' : 'rgb(71 85 105)' }}
                    animate={{ opacity: i === 1 ? [0.4, 0.8, 0.4] : [0.15, 0.4, 0.15] }}
                    transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.18 + 0.5 }}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-0.5 mt-0.5">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-px h-2 rounded-full"
                  style={{ background: i === 1 ? '#ffc131' : 'rgb(71 85 105)' }}
                  animate={{ opacity: i === 1 ? [0.4, 0.8, 0.4] : [0.15, 0.4, 0.15] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.13 + 0.9 }}
                />
              ))}
            </div>
          </motion.div>

          {/* Right card - mini */}
          <div style={{ gridColumn: 3, gridRow: 2 }}>
            <MiniToolCard
              tool={TOOLS[1]}
              cardRef={cardRefs.current['Hono 4'] as React.RefObject<HTMLDivElement>}
              delay={0.21}
            />
          </div>

          {/* Bottom card - mini */}
          <div style={{ gridColumn: 2, gridRow: 3 }}>
            <MiniToolCard
              tool={TOOLS[2]}
              cardRef={cardRefs.current['Tauri 2'] as React.RefObject<HTMLDivElement>}
              delay={0.39}
            />
          </div>
        </div>
      </div>
    )
  }

  // Desktop: full version with spread out cards
  return (
    <div
      ref={containerRef}
      className="relative w-full h-full select-none overflow-hidden"
      style={{ minHeight: '100%' }}
    >
      {geo && (
        <svg
          className="absolute inset-0 pointer-events-none"
          width={geo.w}
          height={geo.h}
          style={{ zIndex: 1 }}
        >
          <defs>
            {TOOLS.map((tool, i) => (
              <linearGradient
                key={i}
                id={`wg${i}`}
                x1={tool.side === 'top' ? '0' : tool.side === 'bottom' ? '0' : tool.side === 'left' ? '0' : '1'}
                y1={tool.side === 'top' ? '1' : tool.side === 'bottom' ? '0' : '0'}
                x2={tool.side === 'top' ? '0' : tool.side === 'bottom' ? '0' : tool.side === 'left' ? '1' : '0'}
                y2={tool.side === 'top' ? '0' : tool.side === 'bottom' ? '1' : '0'}
              >
                <stop offset="0%" stopColor={tool.color} stopOpacity="0.08" />
                <stop offset="100%" stopColor={tool.color} stopOpacity="0.55" />
              </linearGradient>
            ))}
          </defs>

          {TOOLS.map((tool, i) => {
            const w = getWire(tool)
            if (!w) return null
            return (
              <g key={i}>
                <path
                  d={w.d}
                  fill="none"
                  stroke={tool.color}
                  strokeWidth={8}
                  strokeOpacity={0.04}
                  strokeLinecap="round"
                />
                <path
                  d={w.d}
                  fill="none"
                  stroke={`url(#wg${i})`}
                  strokeWidth={1}
                  strokeLinecap="round"
                />
                <circle cx={w.sx} cy={w.sy} r={2} fill={tool.color} opacity={0.3} />
                <circle cx={w.ex} cy={w.ey} r={2} fill={tool.color} opacity={0.5} />
              </g>
            )
          })}

          {TOOLS.map((tool, i) => {
            const w = getWire(tool)
            if (!w) return null
            return (
              <LightRay
                key={i}
                wire={w}
                color={tool.color}
                duration={1.6 + i * 0.25}
                delay={i * 0.5}
                glowIntensity={4}
              />
            )
          })}
        </svg>
      )}

      <div
        className="relative w-full h-full grid"
        style={{
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
        }}
      >
        {/* Top card */}
        <div style={{ gridColumn: 2, gridRow: 1 }}>
          <ToolCard
            tool={TOOLS[0]}
            cardRef={cardRefs.current['Vite 8'] as React.RefObject<HTMLDivElement>}
            delay={0.12}
          />
        </div>

        {/* Left card */}
        <div style={{ gridColumn: 1, gridRow: 2 }}>
          <ToolCard
            tool={TOOLS[3]}
            cardRef={cardRefs.current['React 19'] as React.RefObject<HTMLDivElement>}
            delay={0.3}
          />
        </div>

        {/* Chip */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
          className="flex flex-col items-center"
          style={{ gridColumn: 2, gridRow: 2 }}
        >
          <div className="flex gap-1.5 mb-1.5">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-px h-4 rounded-full"
                style={{ background: i === 2 ? '#a855f7' : 'rgb(71 85 105)' }}
                animate={{ opacity: i === 2 ? [0.4, 0.8, 0.4] : [0.15, 0.4, 0.15] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.13 }}
              />
            ))}
          </div>

          <div className="relative flex items-center">
            <div className="flex flex-col gap-2 mr-2">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="h-px w-4 rounded-full"
                  style={{ background: i === 2 ? '#00e5ff' : 'rgb(71 85 105)' }}
                  animate={{ opacity: i === 2 ? [0.4, 0.8, 0.4] : [0.15, 0.4, 0.15] }}
                  transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.18 }}
                />
              ))}
            </div>

            <motion.div
              ref={chipRef}
              className="relative w-32 h-32 rounded-2xl flex items-center justify-center overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                border: '1px solid rgba(148,163,184,0.08)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.35)',
              }}
            >
              <ChipSweepLight />

              <svg className="absolute inset-0 w-full h-full opacity-[0.1]" viewBox="0 0 128 128">
                <line x1="64" y1="0" x2="64" y2="28" stroke="#a855f7" strokeWidth="1.5" />
                <circle cx="64" cy="28" r="2" fill="#a855f7" />
                <line x1="128" y1="64" x2="100" y2="64" stroke="#f97316" strokeWidth="1.5" />
                <circle cx="100" cy="64" r="2" fill="#f97316" />
                <line x1="64" y1="128" x2="64" y2="100" stroke="#ffc131" strokeWidth="1.5" />
                <circle cx="64" cy="100" r="2" fill="#ffc131" />
                <line x1="0" y1="64" x2="28" y2="64" stroke="#00e5ff" strokeWidth="1.5" />
                <circle cx="28" cy="64" r="2" fill="#00e5ff" />
                <rect x="44" y="44" width="40" height="40" rx="4"
                  fill="none" stroke="rgba(148,163,184,0.15)" strokeWidth="0.75" />
              </svg>

              <img
                src="/logo.svg"
                alt="Bini.js"
                className="relative w-14 h-14 object-contain z-10"
              />
            </motion.div>

            <div className="flex flex-col gap-2 ml-2">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="h-px w-4 rounded-full"
                  style={{ background: i === 2 ? '#f97316' : 'rgb(71 85 105)' }}
                  animate={{ opacity: i === 2 ? [0.4, 0.8, 0.4] : [0.15, 0.4, 0.15] }}
                  transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.18 + 0.5 }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-1.5 mt-1.5">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-px h-4 rounded-full"
                style={{ background: i === 2 ? '#ffc131' : 'rgb(71 85 105)' }}
                animate={{ opacity: i === 2 ? [0.4, 0.8, 0.4] : [0.15, 0.4, 0.15] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.13 + 0.9 }}
              />
            ))}
          </div>
        </motion.div>

        {/* Right card */}
        <div style={{ gridColumn: 3, gridRow: 2 }}>
          <ToolCard
            tool={TOOLS[1]}
            cardRef={cardRefs.current['Hono 4'] as React.RefObject<HTMLDivElement>}
            delay={0.21}
          />
        </div>

        {/* Bottom card */}
        <div style={{ gridColumn: 2, gridRow: 3 }}>
          <ToolCard
            tool={TOOLS[2]}
            cardRef={cardRefs.current['Tauri 2'] as React.RefObject<HTMLDivElement>}
            delay={0.39}
          />
        </div>
      </div>
    </div>
  )
}

// ─── Full Tool card (desktop) ──────────────────────────────────
function ToolCard({
  tool,
  cardRef,
  delay,
}: {
  tool: (typeof TOOLS)[number]
  cardRef: React.RefObject<HTMLDivElement>
  delay: number
}) {
  const initialOffset =
    tool.side === 'top' ? { y: -18 } :
    tool.side === 'bottom' ? { y: 18 } :
    tool.side === 'left' ? { x: -18 } :
    { x: 18 }

  const hoverOffset =
    tool.side === 'top' ? { y: 3 } :
    tool.side === 'bottom' ? { y: -3 } :
    tool.side === 'left' ? { x: -3 } :
    { x: 3 }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, ...initialOffset }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ ...hoverOffset, transition: { duration: 0.18 } }}
      className="w-48 sm:w-52 rounded-2xl p-5 flex flex-col gap-3 cursor-default"
      style={{
        background: 'linear-gradient(160deg, #151f2e 0%, #0d1422 100%)',
        border: `1px solid ${tool.color}1a`,
        boxShadow: `0 0 0 1px ${tool.color}08, 0 8px 28px rgba(0,0,0,0.28)`,
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${tool.color}12`, border: `1px solid ${tool.color}22` }}
        >
          {tool.name === 'Hono 4' ? (
            <HonoLogo size={20} />
          ) : tool.icon ? (
            <svg role="img" viewBox="0 0 24 24" width={20} height={20} fill={tool.color} dangerouslySetInnerHTML={{ __html: tool.icon.svg }} />
          ) : null}
        </div>
        <div>
          <h3 className="text-[13px] font-semibold leading-tight" style={{ color: 'rgba(255,255,255,0.92)' }}>
            {tool.name}
          </h3>
          <span className="text-[10px] font-medium tracking-wide uppercase" style={{ color: tool.color, opacity: 0.7 }}>
            {tool.label}
          </span>
        </div>
      </div>

      <div style={{ height: 1, background: 'rgba(148,163,184,0.06)' }} />

      <p className="text-[11.5px] leading-relaxed" style={{ color: 'rgba(148,163,184,0.65)' }}>
        {tool.description}
      </p>

      <div className="flex flex-col gap-1.5">
        {tool.features.map((f, fi) => (
          <div key={fi} className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full shrink-0" style={{ background: tool.color, opacity: 0.6 }} />
            <span className="text-[11px]" style={{ color: 'rgba(148,163,184,0.5)' }}>{f}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

// ─── Mini Tool card (mobile - header only) ──────────────────────
function MiniToolCard({
  tool,
  cardRef,
  delay,
}: {
  tool: (typeof TOOLS)[number]
  cardRef: React.RefObject<HTMLDivElement>
  delay: number
}) {
  const initialOffset =
    tool.side === 'top' ? { y: -8 } :
    tool.side === 'bottom' ? { y: 8 } :
    tool.side === 'left' ? { x: -8 } :
    { x: 8 }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, ...initialOffset }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-lg p-1.5 flex items-center gap-1.5 cursor-default"
      style={{
        background: 'linear-gradient(160deg, #151f2e 0%, #0d1422 100%)',
        border: `1px solid ${tool.color}1a`,
        boxShadow: `0 0 0 1px ${tool.color}08, 0 4px 12px rgba(0,0,0,0.28)`,
      }}
    >
      <div
        className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
        style={{ background: `${tool.color}12`, border: `1px solid ${tool.color}22` }}
      >
        {tool.name === 'Hono 4' ? (
          <HonoLogo size={12} />
        ) : tool.icon ? (
          <svg role="img" viewBox="0 0 24 24" width={12} height={12} fill={tool.color} dangerouslySetInnerHTML={{ __html: tool.icon.svg }} />
        ) : null}
      </div>
      <div className="flex flex-col min-w-0">
        <h3 className="text-[9px] font-semibold leading-tight" style={{ color: 'rgba(255,255,255,0.92)' }}>
          {tool.name}
        </h3>
        <span className="text-[7px] font-medium tracking-wide uppercase" style={{ color: tool.color, opacity: 0.7 }}>
          {tool.label}
        </span>
      </div>
    </motion.div>
  )
}