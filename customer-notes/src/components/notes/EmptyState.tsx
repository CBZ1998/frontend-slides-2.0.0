import styles from './EmptyState.module.css'
import Button from '../ui/Button'

interface EmptyStateProps {
  message: string
  actionLabel?: string
  onAction?: () => void
}

export default function EmptyState({ message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className={styles.empty}>
      <div className={styles.icon}>📋</div>
      <p className={styles.message}>{message}</p>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
