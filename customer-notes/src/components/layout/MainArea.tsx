import { useUIStore } from '../../stores/uiStore'
import { useNoteStore } from '../../stores/noteStore'
import NoteListView from '../notes/NoteListView'
import NoteEditor from '../editor/NoteEditor'
import styles from './MainArea.module.css'

export default function MainArea() {
  const activeView = useUIStore((s) => s.activeView)
  const editingNote = useNoteStore((s) => s.editingNote)
  const selectedNoteId = useNoteStore((s) => s.selectedNoteId)

  if (activeView === 'editor' && editingNote) {
    return (
      <main className={styles.main}>
        <NoteEditor key={editingNote.id ?? 'new'} />
      </main>
    )
  }

  if (activeView === 'editor' && !editingNote && selectedNoteId) {
    return (
      <main className={styles.main}>
        <NoteListView />
      </main>
    )
  }

  return (
    <main className={styles.main}>
      <NoteListView />
    </main>
  )
}
