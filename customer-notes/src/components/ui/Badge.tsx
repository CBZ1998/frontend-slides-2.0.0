import type { ReactNode } from 'react'
import styles from './Badge.module.css'

interface BadgeProps {
  children: ReactNode
  color?: string
  variant?: 'default' | 'dot'
}

export default function Badge({ children, color, variant = 'default' }: BadgeProps) {
  return (
    <span
      className={`${styles.badge} ${styles[variant]}`}
      style={color ? { '--badge-color': color } as React.CSSProperties : undefined}
    >
      {children}
    </span>
  )
}
