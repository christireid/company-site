import { useEffect, useRef, useState } from 'react'

// Master RAF loop — shared across all canvas animations
type FrameCallback = (ts: number) => void
interface FrameEntry { fn: FrameCallback; active: boolean }

const callbacks: FrameEntry[] = []
let rafRunning = false
let rafId: number | null = null

// Detect mobile for performance optimizations
const isMobile = typeof window !== 'undefined' && window.innerWidth < 680
let lastFrameTime = 0
const TARGET_FPS = isMobile ? 30 : 60 // 30fps on mobile for battery savings
const FRAME_INTERVAL = 1000 / TARGET_FPS

function masterLoop(ts: number) {
  // Throttle to target FPS on mobile
  if (isMobile && ts - lastFrameTime < FRAME_INTERVAL) {
    rafId = requestAnimationFrame(masterLoop)
    return
  }
  lastFrameTime = ts

  for (let i = 0; i < callbacks.length; i++) {
    if (callbacks[i].active) callbacks[i].fn(ts)
  }
  rafId = requestAnimationFrame(masterLoop)
}

/**
 * Register a callback to run on every animation frame
 * @param fn The callback function
 * @param guardEl Optional element to use for intersection observer
 * @returns The frame entry (use with removeFrame to unregister)
 */
export function onFrame(fn: FrameCallback, guardEl?: Element | null) {
  const entry: FrameEntry = { fn, active: true }

  // Use intersection observer to pause animation when off-screen
  if (guardEl) {
    new IntersectionObserver(
      ([e]) => { entry.active = e.isIntersecting },
      { rootMargin: '300px' }
    ).observe(guardEl)
  }

  callbacks.push(entry)

  // Start master loop if not already running
  if (!rafRunning) {
    rafRunning = true
    rafId = requestAnimationFrame(masterLoop)
  }

  return entry
}

/**
 * Remove a frame callback
 */
export function removeFrame(entry: FrameEntry) {
  const idx = callbacks.indexOf(entry)
  if (idx !== -1) callbacks.splice(idx, 1)

  // Stop master loop if no callbacks remain
  if (callbacks.length === 0 && rafId !== null) {
    cancelAnimationFrame(rafId)
    rafRunning = false
    rafId = null
  }
}

/**
 * Hook for scroll reveal animations
 */
export function useScrollReveal(threshold = 0.1) {
  useEffect(() => {
    const targets = document.querySelectorAll('.slide-up,.slide-left,.slide-right,.reveal-on-scroll')
    if (!targets.length) return

    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return
        e.target.classList.add('is-visible')
        obs.unobserve(e.target)
      })
    }, { threshold, rootMargin: '0px 0px -30px 0px' })

    targets.forEach(t => obs.observe(t))
    return () => obs.disconnect()
  }, [threshold])
}

/**
 * Hook for intersection observer on a specific element
 */
export function useIntersection(ref: React.RefObject<Element | null>, threshold = 0.1) {
  const isVisible = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const obs = new IntersectionObserver(([e]) => {
      isVisible.current = e.isIntersecting
    }, { threshold })

    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])

  return isVisible
}

/**
 * Lightweight replacement for Framer Motion's useInView
 * Drop-in replacement with same API
 */
export function useInView(
  ref: React.RefObject<Element | null>,
  options?: {
    once?: boolean
    margin?: string
    amount?: number
  }
) {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const obs = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting
        setInView(isIntersecting)

        // If 'once' is true, disconnect after first intersection
        if (isIntersecting && options?.once) {
          obs.disconnect()
        }
      },
      {
        threshold: options?.amount ?? 0.1,
        rootMargin: options?.margin ?? '0px',
      }
    )

    obs.observe(el)
    return () => obs.disconnect()
  }, [ref, options?.once, options?.margin, options?.amount])

  return inView
}
