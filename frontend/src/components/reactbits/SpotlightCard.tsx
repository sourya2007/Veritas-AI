import type { PropsWithChildren } from 'react'
import { useRef } from 'react'
import type { MouseEventHandler } from 'react'

type SpotlightCardProps = PropsWithChildren<{
  className?: string
}>

export function SpotlightCard({ children, className = '' }: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null)

  const onMove: MouseEventHandler<HTMLDivElement> = (event) => {
    const element = cardRef.current
    if (!element) {
      return
    }

    const rect = element.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    element.style.setProperty('--spot-x', `${x}px`)
    element.style.setProperty('--spot-y', `${y}px`)
    element.style.setProperty('--spot-opacity', '1')
  }

  const onLeave = () => {
    const element = cardRef.current
    if (!element) {
      return
    }

    element.style.setProperty('--spot-opacity', '0')
  }

  return (
    <div ref={cardRef} className={`spotlight-card ${className}`.trim()} onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </div>
  )
}
