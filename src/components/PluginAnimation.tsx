// src/components/PluginAnimation.tsx
import { AnimatePresence, m } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

/* ─── Reduced-motion hook ─────────────────────────────────────────── */

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

/* ─── Plugin catalogue ────────────────────────────────────────────── */

const PLUGINS = [
  { label: 'Route', pkg: 'bini-router' },
  { label: 'Server', pkg: 'bini-server' },
  { label: 'Native', pkg: 'bini-native' },
  { label: 'env', pkg: 'bini-env' },
  { label: 'Deploy', pkg: 'bini-deploy' },
  { label: 'Overlay', pkg: 'bini-overlay' },
  { label: 'Scaffold', pkg: 'create-bini-app' },
  { label: 'Build', pkg: 'bini-ssg' },
]

const PLUGIN_COUNT = PLUGINS.length
const MIDDLE_SLOT = Math.floor(PLUGIN_COUNT / 2)
const TOP_SLOT = PLUGIN_COUNT - 1

/* ─── Layout constants ────────────────────────────────────────────── */

const DESIGN_WIDTH = 760
const DESIGN_HEIGHT = 500
const LAYERS = PLUGIN_COUNT

const WIRE_GRADIENT_LR = 'linear-gradient(90deg, var(--wire-a), var(--wire-b))'
const WIRE_GRADIENT_RL = 'linear-gradient(90deg, var(--wire-b), var(--wire-a))'

/* ─── Main component ──────────────────────────────────────────────── */

const PluginAnimation = () => {
  const [offset, setOffset] = useState(0)
  const [isPaused, setIsPaused] = useState(true)
  const [wrapPhase, setWrapPhase] = useState<{ index: number; phase: 'out' | 'in' } | null>(null)
  const prevOffsetRef = useRef(0)

  const wrapperRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const updateScale = () => {
      if (!wrapperRef.current) return
      const available = wrapperRef.current.clientWidth
      setScale(Math.min(1, available / DESIGN_WIDTH))
    }

    updateScale()
    window.addEventListener('resize', updateScale)

    let observer: ResizeObserver | undefined
    if (typeof ResizeObserver !== 'undefined' && wrapperRef.current) {
      observer = new ResizeObserver(updateScale)
      observer.observe(wrapperRef.current)
    }

    return () => {
      window.removeEventListener('resize', updateScale)
      observer?.disconnect()
    }
  }, [])

  // Runs continuously from mount. Nothing here depends on whether the
  // animation is on screen, so it never pauses or resets when scrolled away.
  useEffect(() => {
    if (prefersReducedMotion) return

    const HOLD_MS = 2000
    const TRANSITION_MS = 700
    let holdTimer: ReturnType<typeof setTimeout> | undefined

    const interval = setInterval(() => {
      setIsPaused(true)
      holdTimer = setTimeout(() => {
        setOffset((prev) => (prev + 1) % PLUGIN_COUNT)
        setIsPaused(false)
      }, HOLD_MS)
    }, HOLD_MS + TRANSITION_MS)

    return () => {
      clearInterval(interval)
      clearTimeout(holdTimer)
    }
  }, [prefersReducedMotion])

  useEffect(() => {
    const prevOffset = prevOffsetRef.current
    prevOffsetRef.current = offset
    if (offset === prevOffset) return

    const wrappingIndex = (TOP_SLOT - prevOffset + PLUGIN_COUNT) % PLUGIN_COUNT
    setWrapPhase({ index: wrappingIndex, phase: 'out' })

    const t1 = setTimeout(() => {
      setWrapPhase({ index: wrappingIndex, phase: 'in' })
    }, 300)
    const t2 = setTimeout(() => {
      setWrapPhase(null)
    }, 650)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [offset])

  const middleCardIndex = (MIDDLE_SLOT - offset + PLUGIN_COUNT) % PLUGIN_COUNT
  const middleLabel = PLUGINS[middleCardIndex].pkg

  const containerHeight = `${DESIGN_HEIGHT}px`

  /* ─── Reduced-motion fallback ────────────────────────────────────── */

  if (prefersReducedMotion) {
    return (
      <div
        ref={wrapperRef}
        className="flex w-full items-center justify-center bg-transparent px-2 py-6 sm:p-8"
      >
        <div className="flex items-center gap-6">
          <div className="relative flex h-20 w-20 items-center justify-center">
            <img src="/logo.svg" alt="Bini.js" width={56} height={56} className="h-14 w-14" />
          </div>
          <div className="rounded-xl border-2 border-blue-500/40 bg-white px-6 py-2 shadow-sm dark:border-blue-500/30 dark:bg-[#0a0a12] dark:shadow-none">
            <span className="font-mono text-lg tracking-wider text-neutral-900 dark:text-white">
              {middleLabel}
            </span>
          </div>
        </div>
      </div>
    )
  }

  /* ─── Animated version ───────────────────────────────────────────── */

  return (
    <div
      ref={wrapperRef}
      className="flex w-full items-center justify-center bg-transparent px-2 py-6 sm:p-8"
    >
      <div style={{ width: DESIGN_WIDTH * scale, height: DESIGN_HEIGHT * scale }}>
        <div
          className="relative flex items-center"
          style={{
            width: DESIGN_WIDTH,
            height: containerHeight,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          {/* ── Left: 3D stacked block ─────────────────────────────── */}
          <div
            className="relative z-10 shrink-0"
            style={{ width: '200px', height: '260px', perspective: '800px' }}
          >
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ transform: 'rotateX(55deg) rotateZ(45deg)', transformStyle: 'preserve-3d' }}
            >
              {Array.from({ length: LAYERS }, (_, layerIndex) => {
                const isTopLayer = layerIndex === LAYERS - 1
                const zStep = LAYERS > 8 ? 2 : 3
                const zPos = layerIndex * zStep

                return (
                  <div
                    key={layerIndex}
                    className="absolute"
                    style={{
                      transform: `translateZ(${zPos}px)`,
                      width: '140px',
                      height: '140px',
                      top: '50%',
                      left: '50%',
                      marginLeft: '-70px',
                      marginTop: '-70px',
                    }}
                  >
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        transform: 'rotate(45deg)',
                        background: isTopLayer
                          ? 'var(--chip-top)'
                          : 'linear-gradient(135deg, var(--wire-a), var(--wire-b))',
                        borderRadius: '18px',
                        border: isTopLayer
                          ? 'var(--chip-top-border)'
                          : '1px solid rgba(0, 100, 200, 0.28)',
                        ...(isTopLayer
                          ? {}
                          : {
                              display: 'grid',
                              gridTemplateColumns: 'repeat(4, 1fr)',
                              gridTemplateRows: 'repeat(4, 1fr)',
                              gap: '1px',
                              padding: '2px',
                              opacity: 0.45 + (layerIndex / LAYERS) * 0.55,
                            }),
                        boxShadow:
                          layerIndex === 0
                            ? '0 15px 40px rgba(0,40,100,0.25), 0 0 30px rgba(0, 119, 255, 0.2)'
                            : '0 2px 8px rgba(0,40,100,0.1)',
                      }}
                    >
                      {!isTopLayer &&
                        Array.from({ length: 16 }, (_, i) => (
                          <div
                            key={i}
                            style={{
                              background:
                                'linear-gradient(135deg, var(--wire-a), var(--wire-b))',
                              borderRadius: '6px',
                              border: '1px solid rgba(0, 100, 200, 0.15)',
                              boxShadow: 'inset 0 0 4px rgba(0, 119, 255, 0.15)',
                            }}
                          />
                        ))}
                    </div>
                  </div>
                )
              })}

              <div
                className="absolute"
                style={{
                  transform: 'translateZ(-5px) translateY(12px) rotateX(90deg)',
                  width: '180px',
                  height: '180px',
                  background:
                    'radial-gradient(ellipse, var(--shadow-core) 0%, rgba(0,0,0,0) 70%)',
                  borderRadius: '50%',
                  filter: 'blur(18px)',
                  opacity: 0.55,
                }}
              />

              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  transform: `translateZ(${LAYERS * 3 + 6}px)`,
                  zIndex: 100,
                }}
              >
                <img
                  src="/logo.svg"
                  alt="Bini.js"
                  width={56}
                  height={56}
                  className="h-14 w-14"
                  style={{ transform: 'rotate(-45deg)' }}
                />
              </div>
            </div>
          </div>

          {/* ── Left wire ─────────────────────────────────────────── */}
          <div
            className="relative z-0 flex h-px flex-1 items-center"
            style={{ marginLeft: '-28px' }}
          >
            <m.div
              className="h-0.5 w-full origin-left"
              style={{ background: WIRE_GRADIENT_LR }}
              animate={{
                opacity: isPaused ? [0.7, 1, 0.7] : 0.75,
              }}
              transition={{
                opacity: isPaused ? { duration: 1, repeat: Infinity } : { duration: 0.3 },
              }}
            />
          </div>

          {/* ── Center pill ───────────────────────────────────────── */}
          <div
            className="relative z-10 flex shrink-0 items-center justify-center"
            style={{ height: containerHeight }}
          >
            <m.div
              key={offset}
              initial={{ x: 0 }}
              animate={{ x: [0, -10, 0] }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            >
              <div className="relative rounded-xl border-2 border-blue-500/40 bg-white px-8 py-2 shadow-sm dark:border-blue-500/30 dark:bg-[#0a0a12] dark:shadow-none">
                <m.span
                  className="font-mono text-lg tracking-wider text-neutral-900 dark:text-white lg:text-xl"
                  key={middleLabel}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {middleLabel}
                </m.span>
              </div>
            </m.div>
          </div>

          {/* ── Right wire ────────────────────────────────────────── */}
          <div
            className="relative z-0 flex h-px flex-1 items-center"
            style={{ marginLeft: '-10px', marginRight: '-48px' }}
          >
            <AnimatePresence mode="wait">
              <m.div
                key={`right-${offset}`}
                className="h-0.5 w-full origin-left"
                style={{ background: WIRE_GRADIENT_RL }}
                initial={{ scaleX: 0, opacity: 0.4 }}
                animate={{
                  scaleX: 1,
                  opacity: isPaused ? [0.7, 1, 0.7] : 0.75,
                }}
                exit={{ scaleX: 0, opacity: 0, transition: { duration: 0.2 } }}
                transition={{
                  scaleX: { duration: 0.4, ease: 'easeOut' },
                  opacity: isPaused ? { duration: 1, repeat: Infinity } : { duration: 0.3 },
                }}
              />
            </AnimatePresence>
          </div>

          {/* ── Right: animated deck ──────────────────────────────── */}
          <div
            className="relative z-10 shrink-0"
            style={{ width: '200px', height: containerHeight, perspective: '800px' }}
          >
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ transform: 'rotateX(55deg) rotateZ(45deg)', transformStyle: 'preserve-3d' }}
            >
              {PLUGINS.map((plugin, cardIndex) => {
                const restingPosition = (cardIndex + offset) % PLUGIN_COUNT

                const isWrapping = wrapPhase?.index === cardIndex
                const wrapOut = isWrapping && wrapPhase.phase === 'out'

                const renderPosition = wrapOut ? TOP_SLOT : restingPosition
                const zPos = (renderPosition - MIDDLE_SLOT) * 50

                const isMiddlePosition = restingPosition === MIDDLE_SLOT

                const opacity = isWrapping ? (wrapOut ? 0 : 1) : 1
                const transition = isWrapping
                  ? 'opacity 0.3s ease-in-out'
                  : 'transform 0.6s ease-in-out, opacity 0.3s ease-in-out'

                return (
                  <m.div
                    key={cardIndex}
                    className="absolute"
                    style={{
                      transform: `translateZ(${zPos}px)`,
                      width: '100px',
                      height: '100px',
                      top: '50%',
                      left: '50%',
                      marginLeft: '-50px',
                      marginTop: '-50px',
                      transition,
                      pointerEvents: 'none',
                      opacity,
                    }}
                    animate={{
                      borderColor:
                        isMiddlePosition && isPaused
                          ? [
                              'rgba(0, 100, 200, 0.45)',
                              'rgba(0, 85, 200, 0.9)',
                              'rgba(0, 100, 200, 0.45)',
                            ]
                          : undefined,
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                    }}
                  >
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        transform: 'rotate(90deg)',
                        background: 'var(--card-bg)',
                        borderRadius: '14px',
                        border: isMiddlePosition
                          ? '3px solid transparent'
                          : '2px solid var(--card-border)',
                        backgroundImage: isMiddlePosition
                          ? 'linear-gradient(var(--card-bg), var(--card-bg)), linear-gradient(135deg, var(--wire-a), var(--wire-b))'
                          : 'none',
                        backgroundOrigin: 'border-box',
                        backgroundClip: 'padding-box, border-box',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--card-text)',
                        fontSize: '13px',
                        fontWeight: 'bold',
                        fontFamily: 'monospace',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        textShadow: '0 0 10px var(--card-text-glow)',
                        boxShadow: isMiddlePosition
                          ? '0 4px 16px rgba(0, 80, 180, 0.18)'
                          : '0 2px 8px rgba(15, 23, 42, 0.08)',
                      }}
                    >
                      <span style={{ transform: 'rotate(-90deg)', whiteSpace: 'nowrap' }}>
                        {plugin.label}
                      </span>
                    </div>
                  </m.div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        :root {
          --chip-top: #e8edf4;
          --chip-top-border: 2px solid rgba(0, 80, 180, 0.22);
          --card-bg: #f1f5f9;
          --card-border: rgba(15, 23, 42, 0.18);
          --card-text: #0f172a;
          --card-text-glow: rgba(0, 100, 220, 0.35);
          --shadow-core: rgba(0, 40, 100, 0.22);
          --wire-a: #0099cc;
          --wire-b: #0055cc;
        }
        .dark {
          --chip-top: #1a1a2e;
          --chip-top-border: 2px solid rgba(255, 255, 255, 0.12);
          --card-bg: #0a0a15;
          --card-border: rgba(255, 255, 255, 0.08);
          --card-text: #ffffff;
          --card-text-glow: rgba(0, 207, 255, 0.3);
          --shadow-core: rgba(0, 0, 0, 0.25);
          --wire-a: #00CFFF;
          --wire-b: #0077FF;
        }
      `}</style>
    </div>
  )
}

export default PluginAnimation