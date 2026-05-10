import { useCallback, useRef } from 'react'
import { useNoteStore } from '../../stores/noteStore'
import { useUIStore } from '../../stores/uiStore'
import StructuredFields from './StructuredFields'
import TagSelector from './TagSelector'
import TipTapEditor from './TipTapEditor'
import Button from '../ui/Button'
import styles from './NoteEditor.module.css'

export default function NoteEditor() {
  const editingNote = useNoteStore((s) => s.editingNote)
  const updateNote = useNoteStore((s) => s.updateNote)
  const deleteNote = useNoteStore((s) => s.deleteNote)
  const setEditingNote = useNoteStore((s) => s.setEditingNote)
  const fetchNotes = useNoteStore((s) => s.fetchNotes)
  const setActiveView = useUIStore((s) => s.setActiveView)
  const setSaveStatus = useUIStore((s) => s.setSaveStatus)
  const showConfirm = useUIStore((s) => s.showConfirm)

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const handleFieldChange = useCallback((data: Record<string, unknown>) => {
    if (!editingNote?.id) return
    setSaveStatus('saving')
    clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => {
      updateNote(editingNote.id!, data)
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2000)
    }, 300)
  }, [editingNote, updateNote, setSaveStatus])

  const handleContentChange = useCallback((html: string) => {
    if (!editingNote?.id) return
    const text = html.replace(/<[^>]*>/g, '').trim()
    const firstLine = text.split('\n')[0]?.slice(0, 50) || ''
    const title = editingNote.title || firstLine

    setSaveStatus('saving')
    clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => {
      updateNote(editingNote.id!, { content: html, title })
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2000)
    }, 300)
  }, [editingNote, updateNote, setSaveStatus])

  const handleBack = () => {
    setEditingNote(null)
    setActiveView('list')
    fetchNotes()
  }

  const handleDelete = () => {
    if (!editingNote?.id) return
    showConfirm(
      '删除笔记',
      '确定要删除此笔记吗？此操作不可撤销。',
      async () => {
        await deleteNote(editingNote.id!)
        handleBack()
      }
    )
  }

  if (!editingNote) return null

  return (
    <div className={styles.editor}>
      <div className={styles.toolbar}>
        <Button variant="ghost" size="sm" onClick={handleBack}>
          ← 返回
        </Button>
        <div className={styles.spacer} />
        <Button variant="danger" size="sm" onClick={handleDelete}>
          删除
        </Button>
      </div>

      <div className={styles.scrollArea}>
        <div className={styles.container}>
          <StructuredFields
            note={editingNote}
            onChange={handleFieldChange}
          />

          <div className={styles.spacerY} />

          <TagSelector
            selectedTagIds={editingNote.tagIds}
            onChange={(tagIds) => handleFieldChange({ tagIds })}
          />

          <div className={styles.spacerY} />

          <TipTapEditor
            content={editingNote.content}
            onChange={handleContentChange}
            placeholder="开始记录客户信息：沟通内容、需求描述、跟进计划…"
          />
        </div>
      </div>
    </div>
  )
}
