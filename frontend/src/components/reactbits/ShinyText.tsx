import type { PropsWithChildren } from 'react'

type ShinyTextProps = PropsWithChildren<{
  as?: 'h1' | 'h2'
  className?: string
}>

export function ShinyText({ as = 'h1', className = '', children }: ShinyTextProps) {
  const Tag = as
  return <Tag className={`shiny-text ${className}`.trim()}>{children}</Tag>
}
