import { useMemo } from 'react'
import { useNoteStore } from '../../stores/noteStore'
import { useFolderStore } from '../../stores/folderStore'
import { useFilterStore } from '../../stores/filterStore'
import { useUIStore } from '../../stores/uiStore'
import NoteCard from './NoteCard'
import EmptyState from './EmptyState'
import styles from './NoteListView.module.css'

export default function NoteListView() {
  const notes = useNoteStore((s) => s.notes)
  const selectedNoteId = useNoteStore((s) => s.selectedNoteId)
  const selectNote = useNoteStore((s) => s.selectNote)
  const deleteNote = useNoteStore((s) => s.deleteNote)
  const setEditingNote = useNoteStore((s) => s.setEditingNote)
  const setActiveView = useUIStore((s) => s.setActiveView)
  const searchQuery = useUIStore((s) => s.searchQuery)
  const showConfirm = useUIStore((s) => s.showConfirm)
  const folders = useFolderStore((s) => s.folders)
  const selectedFolderId = useFolderStore((s) => s.selectedFolderId)

  const filterIntentLevel = useFilterStore((s) => s.intentLevel)
  const filterFollowUpStatus = useFilterStore((s) => s.followUpStatus)
  const filterSource = useFilterStore((s) => s.source)
  const filterTagIds = useFilterStore((s) => s.tagIds)

  const filteredNotes = useMemo(() => {
    let result = notes

    // Folder filter
    if (selectedFolderId && selectedFolderId !== (folders.find((f) => f.name === '所有笔记')?.id)) {
      result = result.filter((n) => n.folderId === selectedFolderId)
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (n) =>
          n.customerName.toLowerCase().includes(q) ||
          n.phone.includes(q) ||
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q)
      )
    }

    // Intent level filter
    if (filterIntentLevel) {
      result = result.filter((n) => n.intentLevel === filterIntentLevel)
    }

    // Follow-up status filter
    if (filterFollowUpStatus) {
      result = result.filter((n) => n.followUpStatus === filterFollowUpStatus)
    }

    // Source filter
    if (filterSource) {
      result = result.filter((n) => n.source === filterSource)
    }

    // Tag filter
    if (filterTagIds.length > 0) {
      result = result.filter((n) => filterTagIds.some((tid) => n.tagIds.includes(tid)))
    }

    // Pinned first, then by updatedAt
    return result.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })
  }, [notes, selectedFolderId, folders, searchQuery, filterIntentLevel, filterFollowUpStatus, filterSource, filterTagIds])

  const activeFolderName = useMemo(() => {
    if (!selectedFolderId) return '所有笔记'
    const folder = folders.find((f) => f.id === selectedFolderId)
    return folder?.name || '所有笔记'
  }, [selectedFolderId, folders])

  const handleSelectNote = (id: number) => {
    selectNote(id)
    const note = notes.find((n) => n.id === id)
    if (note) {
      setEditingNote(note)
      setActiveView('editor')
    }
  }

  const handleDelete = (id: number) => {
    const note = notes.find((n) => n.id === id)
    showConfirm(
      '删除笔记',
      `确定要删除「${note?.customerName || '未命名客户'}」的笔记吗？`,
      async () => {
        await deleteNote(id)
      }
    )
  }

  if (filteredNotes.length === 0) {
    return (
      <div className={styles.container}>
        <EmptyState
          message={searchQuery ? '没有找到匹配的笔记' : '还没有客户笔记，点击上方按钮创建第一个'}
          actionLabel={searchQuery ? undefined : '+ 新建笔记'}
          onAction={searchQuery ? undefined : () => {
            useNoteStore.getState().createNote()
            setActiveView('editor')
          }}
        />
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>{activeFolderName}</h2>
        <span className={styles.count}>{filteredNotes.length} 条笔记</span>
      </div>
      <div className={styles.grid}>
        {filteredNotes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            isSelected={selectedNoteId === note.id}
            onSelect={handleSelectNote}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  )
}
