import { useEffect, useState, useRef } from 'react'
import { useTagStore } from '../../stores/tagStore'
import { TAG_COLORS } from '../../utils/constants'
import Badge from '../ui/Badge'
import styles from './TagSelector.module.css'

interface TagSelectorProps {
  selectedTagIds: number[]
  onChange: (tagIds: number[]) => void
}

export default function TagSelector({ selectedTagIds, onChange }: TagSelectorProps) {
  const tags = useTagStore((s) => s.tags)
  const fetchTags = useTagStore((s) => s.fetchTags)
  const createTag = useTagStore((s) => s.createTag)
  const [open, setOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => { fetchTags() }, [fetchTags])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleToggle = (tagId: number) => {
    if (selectedTagIds.includes(tagId)) {
      onChange(selectedTagIds.filter((id) => id !== tagId))
    } else {
      onChange([...selectedTagIds, tagId])
    }
  }

  const handleCreate = async () => {
    if (!newName.trim()) return
    const color = TAG_COLORS[tags.length % TAG_COLORS.length]
    const tag = await createTag(newName.trim(), color)
    onChange([...selectedTagIds, tag.id!])
    setNewName('')
  }

  return (
    <div className={styles.wrapper} ref={ref}>
      <label className={styles.label}>标签</label>
      <div className={styles.trigger} onClick={() => setOpen(!open)}>
        {selectedTagIds.length === 0 ? (
          <span className={styles.placeholder}>选择标签…</span>
        ) : (
          <div className={styles.selectedTags}>
            {selectedTagIds.map((id) => {
              const tag = tags.find((t) => t.id === id)
              return tag ? <Badge key={id} color={tag.color}>{tag.name}</Badge> : null
            })}
          </div>
        )}
        <span className={styles.arrow}>▼</span>
      </div>

      {open && (
        <div className={styles.dropdown}>
          {tags.map((tag) => (
            <label key={tag.id} className={styles.option}>
              <input
                type="checkbox"
                checked={selectedTagIds.includes(tag.id!)}
                onChange={() => handleToggle(tag.id!)}
              />
              <Badge color={tag.color}>{tag.name}</Badge>
            </label>
          ))}
          <div className={styles.divider} />
          <div className={styles.createRow}>
            <input
              className={styles.input}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreate()
              }}
              placeholder="新建标签…"
            />
            <button className={styles.createBtn} onClick={handleCreate}>+</button>
          </div>
        </div>
      )}
    </div>
  )
}
