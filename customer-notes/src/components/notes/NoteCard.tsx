import type { Note } from '../../types/note'
import { INTENT_LEVELS } from '../../utils/constants'
import { formatDate, truncateText } from '../../utils/formatters'
import Badge from '../ui/Badge'
import styles from './NoteCard.module.css'

interface NoteCardProps {
  note: Note
  isSelected: boolean
  onSelect: (id: number) => void
  onDelete: (id: number) => void
}

export default function NoteCard({ note, isSelected, onSelect, onDelete }: NoteCardProps) {
  const intent = INTENT_LEVELS.find((l) => l.value === note.intentLevel)

  const previewText = (() => {
    const text = note.content.replace(/<[^>]*>/g, '').trim()
    return text || note.title || '暂无内容'
  })()

  return (
    <div
      className={`${styles.card} ${isSelected ? styles.selected : ''}`}
      onClick={() => onSelect(note.id!)}
    >
      <div className={styles.header}>
        <span className={styles.name}>
          {note.customerName || '未命名客户'}
        </span>
        {note.pinned && <span className={styles.pin}>📌</span>}
      </div>

      <div className={styles.meta}>
        {intent && (
          <Badge color={intent.color}>{intent.label}</Badge>
        )}
        {note.phone && (
          <span className={styles.phone}>{note.phone}</span>
        )}
      </div>

      <p className={styles.preview}>{truncateText(previewText, 80)}</p>

      <div className={styles.footer}>
        <span className={styles.date}>{formatDate(note.updatedAt)}</span>
        <button
          className={styles.delBtn}
          onClick={(e) => {
            e.stopPropagation()
            onDelete(note.id!)
          }}
          title="删除"
        >
          🗑️
        </button>
      </div>
    </div>
  )
}
