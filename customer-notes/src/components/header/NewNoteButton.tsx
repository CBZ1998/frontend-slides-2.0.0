import { useNoteStore } from '../../stores/noteStore'
import { useUIStore } from '../../stores/uiStore'
import Button from '../ui/Button'

export default function NewNoteButton() {
  const createNote = useNoteStore((s) => s.createNote)
  const setActiveView = useUIStore((s) => s.setActiveView)

  const handleNewNote = async () => {
    await createNote()
    setActiveView('editor')
  }

  return (
    <Button variant="primary" size="sm" onClick={handleNewNote}>
      + 新建笔记
    </Button>
  )
}
