import { useEffect, useState } from 'react'
import { useTagStore } from '../../stores/tagStore'
import { useFilterStore } from '../../stores/filterStore'
import { TAG_COLORS } from '../../utils/constants'
import Badge from '../ui/Badge'
import styles from './TagPanel.module.css'

export default function TagPanel() {
  const tags = useTagStore((s) => s.tags)
  const fetchTags = useTagStore((s) => s.fetchTags)
  const createTag = useTagStore((s) => s.createTag)
  const deleteTag = useTagStore((s) => s.deleteTag)
  const tagIds = useFilterStore((s) => s.tagIds)
  const toggleTagId = useFilterStore((s) => s.toggleTagId)
  const [adding, setAdding] = useState(false)
  const [newName, setNewName] = useState('')

  useEffect(() => { fetchTags() }, [fetchTags])

  const handleCreate = async () => {
    if (!newName.trim()) return
    const color = TAG_COLORS[tags.length % TAG_COLORS.length]
    await createTag(newName.trim(), color)
    setNewName('')
    setAdding(false)
  }

  return (
    <div className={styles.panel}>
      {tags.map((tag) => (
        <button
          key={tag.id}
          className={`${styles.tag} ${tagIds.includes(tag.id!) ? styles.active : ''}`}
          onClick={() => toggleTagId(tag.id!)}
        >
          <Badge color={tag.color}>{tag.name}</Badge>
          <button
            className={styles.delBtn}
            onClick={(e) => {
              e.stopPropagation()
              deleteTag(tag.id!)
            }}
            title="删除标签"
          >
            ✕
          </button>
        </button>
      ))}

      {adding ? (
        <div className={styles.addRow}>
          <input
            className={styles.input}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreate()
              if (e.key === 'Escape') setAdding(false)
            }}
            placeholder="标签名"
            autoFocus
          />
          <button className={styles.confirmBtn} onClick={handleCreate}>确定</button>
          <button className={styles.cancelBtn} onClick={() => setAdding(false)}>取消</button>
        </div>
      ) : (
        <button className={styles.addBtn} onClick={() => setAdding(true)}>
          + 新建标签
        </button>
      )}
    </div>
  )
}
