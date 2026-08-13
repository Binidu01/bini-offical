import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PluginAnimation = () => {
  const layers = 7;
  const [offset, setOffset] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  // wrapPhase drives the "card removed from top / re-created at bottom" effect.
  // { index: <cardIndex>, phase: 'out' | 'in' } while a wrap is happening, otherwise null.
  const [wrapPhase, setWrapPhase] = useState<{ index: number; phase: 'out' | 'in' } | null>(null);
  const prevOffsetRef = useRef(0);

  // The animation is built at a fixed "design" size (it relies on exact
  // pixel math for the 3D perspective/rotation). On narrow screens we scale
  // the whole thing down to fit instead of trying to reflow it.
  const DESIGN_WIDTH = 760;
  const DESIGN_HEIGHT = 500;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      if (!wrapperRef.current) return;
      const available = wrapperRef.current.clientWidth;
      const next = Math.min(1, available / DESIGN_WIDTH);
      setScale(next);
    };

    updateScale();
    window.addEventListener('resize', updateScale);

    let observer: ResizeObserver | undefined;
    if (typeof ResizeObserver !== 'undefined' && wrapperRef.current) {
      observer = new ResizeObserver(updateScale);
      observer.observe(wrapperRef.current);
    }

    return () => {
      window.removeEventListener('resize', updateScale);
      observer?.disconnect();
    };
  }, []);

  const labels = ['Route', 'Server', 'Native', 'env', 'Deploy', 'Overlay', 'Scaffold'];

  const labelMap: Record<string, string> = {
    'Route': 'bini-router',
    'Server': 'bini-server',
    'Native': 'bini-native',
    'env': 'bini-env',
    'Deploy': 'bini-deploy',
    'Overlay': 'bini-overlay',
    'Scaffold': 'create-bini-app'
  };

  // Main cadence: hold each card centered for 2s, then a short window
  // where the deck advances and the wrapping card fades out/in.
  useEffect(() => {
    const HOLD_MS = 2000;
    const TRANSITION_MS = 700;
    const interval = setInterval(() => {
      setIsPaused(true);
      setTimeout(() => {
        setOffset(prev => (prev + 1) % 7);
        setIsPaused(false);
      }, HOLD_MS);
    }, HOLD_MS + TRANSITION_MS);

    return () => clearInterval(interval);
  }, []);

  // Every time offset changes, figure out which card was sitting at the
  // very top (position 6) *before* the change - that's the one that wraps
  // around to the bottom. Fade it out at the top, snap it to the bottom,
  // then fade it back in there.
  useEffect(() => {
    const prevOffset = prevOffsetRef.current;
    prevOffsetRef.current = offset;
    if (offset === prevOffset) return;

    const wrappingIndex = (6 - prevOffset + 7) % 7;
    setWrapPhase({ index: wrappingIndex, phase: 'out' });

    const t1 = setTimeout(() => {
      setWrapPhase({ index: wrappingIndex, phase: 'in' });
    }, 300);
    const t2 = setTimeout(() => {
      setWrapPhase(null);
    }, 650);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [offset]);

  // The card currently in the middle (position 3) - fixed label per card,
  // position derived from offset, so this always resolves correctly.
  const middleCardIndex = (3 - offset + 7) % 7;
  const middleLabel = labels[middleCardIndex];
  const displayText = labelMap[middleLabel] || middleLabel;

  const containerHeight = `${DESIGN_HEIGHT}px`;
  const wireGradientLR = 'linear-gradient(90deg, #00CFFF, #0077FF)';
  const wireGradientRL = 'linear-gradient(90deg, #0077FF, #00CFFF)';

  return (
    <div ref={wrapperRef} className="w-full flex items-center justify-center bg-transparent px-2 py-6 sm:p-8">
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

        {/* Left Side - Compressed 3D Block */}
        <div className="relative flex-shrink-0 z-10" style={{ width: '200px', height: '260px', perspective: '800px' }}>
          <div className="absolute inset-0 flex items-center justify-center" style={{ transform: 'rotateX(55deg) rotateZ(45deg)', transformStyle: 'preserve-3d' }}>
            {Array.from({ length: layers }, (_, layerIndex) => {
              const isTopLayer = layerIndex === layers - 1;
              const zPos = layerIndex * 3;

              return (
                <div key={layerIndex} className="absolute" style={{ transform: `translateZ(${zPos}px)`, width: '140px', height: '140px', top: '50%', left: '50%', marginLeft: '-70px', marginTop: '-70px' }}>
                  <div style={{
                    width: '100%',
                    height: '100%',
                    transform: 'rotate(45deg)',
                    background: isTopLayer ? '#1a1a2e' : 'linear-gradient(135deg, #00CFFF, #0077FF)',
                    borderRadius: '18px',
                    border: isTopLayer ? '2px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 207, 255, 0.15)',
                    ...(isTopLayer ? {} : {
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 1fr)',
                      gridTemplateRows: 'repeat(4, 1fr)',
                      gap: '1px',
                      padding: '2px',
                      opacity: 0.3 + (layerIndex / layers) * 0.7,
                    }),
                    boxShadow: layerIndex === 0 ? '0 15px 40px rgba(0,0,0,0.8), 0 0 30px rgba(0, 207, 255, 0.08)' : '0 2px 8px rgba(0,0,0,0.15)',
                  }}>
                    {!isTopLayer && Array.from({ length: 16 }, (_, i) => (
                      <div key={i} style={{
                        background: 'linear-gradient(135deg, #00CFFF, #0077FF)',
                        borderRadius: '6px',
                        border: '1px solid rgba(0, 207, 255, 0.08)',
                        boxShadow: 'inset 0 0 4px rgba(0, 207, 255, 0.1)',
                      }} />
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Shadow */}
            <div className="absolute" style={{ transform: 'translateZ(-5px) translateY(12px) rotateX(90deg)', width: '180px', height: '180px', background: 'radial-gradient(ellipse, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%', filter: 'blur(18px)', opacity: 0.5 }} />

            {/* Logo */}
            <div className="absolute inset-0 flex items-center justify-center" style={{ transform: `translateZ(${layers * 3 + 6}px)`, zIndex: 100 }}>
              <img src="/logo.svg" alt="Bini.js" className="w-14 h-14" style={{ transform: 'rotate(-45deg)' }} />
            </div>
          </div>
        </div>

        {/* Left Wire - stays connected between the block and the pill at all
            times (no disconnect/reconnect animation). Pulled slightly left
            with a negative margin so it reaches into the block instead of
            stopping short of it. */}
        <div className="relative flex-1 h-px flex items-center z-0" style={{ marginLeft: '-28px' }}>
          <motion.div
            className="h-[2px] w-full origin-left"
            style={{ background: wireGradientLR }}
            animate={{
              opacity: isPaused ? [0.6, 0.95, 0.6] : 0.6,
            }}
            transition={{
              opacity: isPaused ? { duration: 1, repeat: Infinity } : { duration: 0.3 },
            }}
          />
        </div>

        {/* Center Pill - Package Name */}
        <div className="relative flex-shrink-0 flex items-center justify-center z-10" style={{ height: containerHeight }}>
          <motion.div
            key={offset}
            initial={{ x: 0 }}
            animate={{ x: [0, -10, 0] }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          >
            <div className="relative px-8 py-2 rounded-xl bg-[#0a0a12] border border-blue-500/30">
              <motion.span
                className="font-mono text-lg lg:text-xl tracking-wider text-white"
                key={displayText}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {displayText}
              </motion.span>
            </div>
          </motion.div>
        </div>

        {/* Right Wire - starts merged into the pill and grows outward
            TOWARD the cards, reconnecting with the newly-centered card each
            time the deck advances. Negative margins on both sides close the
            gaps so it visually touches the pill on the left and the card's
            gradient border on the right. */}
        <div className="relative flex-1 h-px flex items-center z-0" style={{ marginLeft: '-10px', marginRight: '-48px' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={`right-${offset}`}
              className="h-[2px] w-full origin-left"
              style={{ background: wireGradientRL }}
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

        {/* Right Side - Animated Cards */}
        <div className="relative flex-shrink-0 z-10" style={{ width: '200px', height: containerHeight, perspective: '800px' }}>
          <div className="absolute inset-0 flex items-center justify-center" style={{ transform: 'rotateX(55deg) rotateZ(45deg)', transformStyle: 'preserve-3d' }}>
            {Array.from({ length: 7 }, (_, cardIndex) => {
              // Fixed identity: this card always shows the same label.
              const label = labels[cardIndex];

              // Resting slot (0 = bottom ... 6 = top), driven by offset.
              const restingPosition = (cardIndex + offset) % 7;

              const isWrapping = wrapPhase && wrapPhase.index === cardIndex;
              const wrapOut = isWrapping && wrapPhase.phase === 'out';

              // While fading out, keep the card pinned to the top slot (6)
              // it came from instead of jumping straight to the new slot -
              // that's what makes it read as "removed from the top" rather
              // than sliding through the whole stack.
              const renderPosition = wrapOut ? 6 : restingPosition;
              const zPos = (renderPosition - 3) * 50;

              const isMiddlePosition = restingPosition === 3;

              const opacity = isWrapping ? (wrapOut ? 0 : 1) : 1;
              const transition = isWrapping
                ? 'opacity 0.3s ease-in-out'
                : 'transform 0.6s ease-in-out, opacity 0.3s ease-in-out';

              return (
                <motion.div
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
                    borderColor: isMiddlePosition && isPaused ? ['rgba(0,207,255,0.3)', 'rgba(0,119,255,0.8)', 'rgba(0,207,255,0.3)'] : undefined,
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                  }}
                >
                  <div style={{
                    width: '100%',
                    height: '100%',
                    transform: 'rotate(90deg)',
                    background: '#0a0a15',
                    borderRadius: '14px',
                    border: isMiddlePosition ? '3px solid transparent' : '2px solid rgba(255, 255, 255, 0.08)',
                    backgroundImage: isMiddlePosition ? 'linear-gradient(#0a0a15, #0a0a15), linear-gradient(135deg, #00CFFF, #0077FF)' : 'none',
                    backgroundOrigin: 'border-box',
                    backgroundClip: 'padding-box, border-box',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    fontFamily: 'monospace',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    textShadow: '0 0 10px rgba(0, 207, 255, 0.3)',
                  }}>
                    <span style={{ transform: 'rotate(-90deg)', whiteSpace: 'nowrap' }}>
                      {label}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default PluginAnimation;