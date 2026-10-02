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

const WIRE_GRADIENT_LR = 'linear-gradient(90deg, #00CFFF, #0077FF)'
const WIRE_GRADIENT_RL = 'linear-gradient(90deg, #0077FF, #00CFFF)'

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

  useEffect(() => {
    if (prefersReducedMotion) return

    const HOLD_MS = 2000
    const TRANSITION_MS = 700
    const interval = setInterval(() => {
      setIsPaused(true)
      setTimeout(() => {
        setOffset((prev) => (prev + 1) % PLUGIN_COUNT)
        setIsPaused(false)
      }, HOLD_MS)
    }, HOLD_MS + TRANSITION_MS)

    return () => clearInterval(interval)
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
        className="w-full flex items-center justify-center bg-transparent px-2 py-6 sm:p-8"
      >
        <div className="flex items-center gap-6">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <img src="/logo.svg" alt="Bini.js" width={56} height={56} className="w-14 h-14" />
          </div>
          <div className="px-6 py-2 rounded-xl bg-white border border-blue-500/30 dark:bg-[#0a0a12]">
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
      className="w-full flex items-center justify-center bg-transparent px-2 py-6 sm:p-8"
    >
      <div style={{ width: DESIGN_WIDTH * scale, height: DESIGN_HEIGHT * scale }}>
        <div
          className="flex items-center relative"
          style={{
            width: DESIGN_WIDTH,
            height: containerHeight,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          {/* ── Left: 3D stacked block ─────────────────────────────── */}
          <div
            className="relative shrink-0 z-10"
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
                          : 'linear-gradient(135deg, #00CFFF, #0077FF)',
                        borderRadius: '18px',
                        border: isTopLayer
                          ? 'var(--chip-top-border)'
                          : '1px solid rgba(0, 207, 255, 0.15)',
                        ...(isTopLayer
                          ? {}
                          : {
                              display: 'grid',
                              gridTemplateColumns: 'repeat(4, 1fr)',
                              gridTemplateRows: 'repeat(4, 1fr)',
                              gap: '1px',
                              padding: '2px',
                              opacity: 0.3 + (layerIndex / LAYERS) * 0.7,
                            }),
                        boxShadow:
                          layerIndex === 0
                            ? '0 15px 40px rgba(0,0,0,0.3), 0 0 30px rgba(0, 207, 255, 0.15)'
                            : '0 2px 8px rgba(0,0,0,0.08)',
                      }}
                    >
                      {!isTopLayer &&
                        Array.from({ length: 16 }, (_, i) => (
                          <div
                            key={i}
                            style={{
                              background: 'linear-gradient(135deg, #00CFFF, #0077FF)',
                              borderRadius: '6px',
                              border: '1px solid rgba(0, 207, 255, 0.08)',
                              boxShadow: 'inset 0 0 4px rgba(0, 207, 255, 0.1)',
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
                  opacity: 0.5,
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
                  className="w-14 h-14"
                  style={{ transform: 'rotate(-45deg)' }}
                />
              </div>
            </div>
          </div>

          {/* ── Left wire ─────────────────────────────────────────── */}
          <div
            className="relative flex-1 h-px flex items-center z-0"
            style={{ marginLeft: '-28px' }}
          >
            <m.div
              className="h-0.5 w-full origin-left"
              style={{ background: WIRE_GRADIENT_LR }}
              animate={{
                opacity: isPaused ? [0.6, 0.95, 0.6] : 0.6,
              }}
              transition={{
                opacity: isPaused ? { duration: 1, repeat: Infinity } : { duration: 0.3 },
              }}
            />
          </div>

          {/* ── Center pill ───────────────────────────────────────── */}
          <div
            className="relative shrink-0 flex items-center justify-center z-10"
            style={{ height: containerHeight }}
          >
            <m.div
              key={offset}
              initial={{ x: 0 }}
              animate={{ x: [0, -10, 0] }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            >
              <div className="relative px-8 py-2 rounded-xl bg-white border border-blue-500/30 dark:bg-[#0a0a12]">
                <m.span
                  className="font-mono text-lg lg:text-xl tracking-wider text-neutral-900 dark:text-white"
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
            className="relative flex-1 h-px flex items-center z-0"
            style={{ marginLeft: '-10px', marginRight: '-48px' }}
          >
            <AnimatePresence mode="wait">
              <m.div
                key={`right-${offset}`}
                className="h-0.5 w-full origin-left"
                style={{ background: WIRE_GRADIENT_RL }}
                initial={{ scaleX: 0, opacity: 0.3 }}
                animate={{
                  scaleX: 1,
                  opacity: isPaused ? [0.6, 0.95, 0.6] : 0.6,
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
            className="relative shrink-0 z-10"
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
                          ? ['rgba(0,207,255,0.3)', 'rgba(0,119,255,0.8)', 'rgba(0,207,255,0.3)']
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
                          ? 'linear-gradient(var(--card-bg), var(--card-bg)), linear-gradient(135deg, #00CFFF, #0077FF)'
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
          --chip-top: #f5f7fa;
          --chip-top-border: 2px solid rgba(0, 0, 0, 0.08);
          --card-bg: #ffffff;
          --card-border: rgba(0, 0, 0, 0.08);
          --card-text: #0f172a;
          --card-text-glow: rgba(0, 119, 255, 0.18);
          --shadow-core: rgba(0, 0, 0, 0.12);
        }
        .dark {
          --chip-top: #1a1a2e;
          --chip-top-border: 2px solid rgba(255, 255, 255, 0.12);
          --card-bg: #0a0a15;
          --card-border: rgba(255, 255, 255, 0.08);
          --card-text: #ffffff;
          --card-text-glow: rgba(0, 207, 255, 0.3);
          --shadow-core: rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  )
}

export default PluginAnimation