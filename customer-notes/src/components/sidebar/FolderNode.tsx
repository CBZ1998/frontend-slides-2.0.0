import { useState, type ReactNode } from 'react'
import type { Folder } from '../../types/folder'
import styles from './FolderNode.module.css'

interface FolderNodeProps {
  folder: Folder
  depth: number
  isSelected: boolean
  children: ReactNode
  onSelect: (id: number) => void
  onRename: (id: number, name: string) => void
  onDelete: (id: number) => void
  onAddSubfolder: (parentId: number) => void
}

export default function FolderNode({
  folder,
  depth,
  isSelected,
  children,
  onSelect,
  onRename,
  onDelete,
  onAddSubfolder,
}: FolderNodeProps) {
  const [expanded, setExpanded] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState(folder.name)
  const hasChildren = !!children && Array.isArray(children) && children.length > 0

  const handleRename = () => {
    if (editName.trim() && editName !== folder.name) {
      onRename(folder.id!, editName.trim())
    }
    setEditing(false)
  }

  return (
    <div>
      <div
        className={`${styles.node} ${isSelected ? styles.selected : ''}`}
        style={{ paddingLeft: `calc(${depth} * 16px + var(--spacing-2))` }}
      >
        <button
          className={`${styles.arrow} ${hasChildren ? '' : styles.hidden} ${expanded ? styles.expanded : ''}`}
          onClick={() => setExpanded(!expanded)}
          aria-label={expanded ? '折叠' : '展开'}
        >
          ▶
        </button>

        {editing ? (
          <input
            className={styles.editInput}
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRename()
              if (e.key === 'Escape') setEditing(false)
            }}
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span
            className={styles.name}
            onClick={() => onSelect(folder.id!)}
            onDoubleClick={() => {
              setEditName(folder.name)
              setEditing(true)
            }}
          >
            📁 {folder.name}
          </span>
        )}

        <div className={styles.actions}>
          <button
            className={styles.actionBtn}
            onClick={(e) => {
              e.stopPropagation()
              onAddSubfolder(folder.id!)
            }}
            title="新建子文件夹"
          >
            +
          </button>
          <button
            className={styles.actionBtn}
            onClick={(e) => {
              e.stopPropagation()
              onDelete(folder.id!)
            }}
            title="删除"
          >
            ✕
          </button>
        </div>
      </div>

      {hasChildren && expanded && (
        <div>{children}</div>
      )}
    </div>
  )
}
