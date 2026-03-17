import gsap from 'gsap'
import type { ButtonHTMLAttributes } from 'react'
import { useRef } from 'react'
import type { MouseEventHandler } from 'react'

type MagneticButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export function MagneticButton({ children, className = '', ...props }: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement | null>(null)

  const onMove: MouseEventHandler<HTMLButtonElement> = (event) => {
    const element = buttonRef.current
    if (!element) {
      return
    }

    const rect = element.getBoundingClientRect()
    const x = event.clientX - rect.left - rect.width / 2
    const y = event.clientY - rect.top - rect.height / 2

    gsap.to(element, {
      x: x * 0.25,
      y: y * 0.25,
      duration: 0.35,
      ease: 'power2.out',
    })
  }

  const onLeave = () => {
    const element = buttonRef.current
    if (!element) {
      return
    }

    gsap.to(element, {
      x: 0,
      y: 0,
      duration: 0.45,
      ease: 'elastic.out(1, 0.4)',
    })
  }

  return (
    <button
      ref={buttonRef}
      className={`magnetic-button ${className}`.trim()}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      type="button"
      {...props}
    >
      {children}
    </button>
  )
}
