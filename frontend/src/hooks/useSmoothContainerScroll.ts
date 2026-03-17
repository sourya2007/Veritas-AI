import { useEffect } from 'react'
import gsap from 'gsap'
import type { RefObject } from 'react'

export function useSmoothContainerScroll(container: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const element = container.current
    if (!element) {
      return
    }

    let rafId = 0
    let current = element.scrollTop
    let target = element.scrollTop

    const clampTarget = (value: number) => {
      const max = Math.max(0, element.scrollHeight - element.clientHeight)
      return Math.min(Math.max(0, value), max)
    }

    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      target = clampTarget(target + event.deltaY)
    }

    const tick = () => {
      current += (target - current) * 0.12
      if (Math.abs(target - current) < 0.2) {
        current = target
      }
      gsap.set(element, { scrollTop: current })
      rafId = requestAnimationFrame(tick)
    }

    element.addEventListener('wheel', onWheel, { passive: false })
    rafId = requestAnimationFrame(tick)

    return () => {
      element.removeEventListener('wheel', onWheel)
      cancelAnimationFrame(rafId)
    }
  }, [container])
}
