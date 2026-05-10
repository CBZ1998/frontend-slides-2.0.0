import { useEffect } from 'react'
import { useNoteStore } from '../../stores/noteStore'
import { useFolderStore } from '../../stores/folderStore'
import { useTagStore } from '../../stores/tagStore'
import { useUIStore } from '../../stores/uiStore'
import Header from './Header'
import Sidebar from './Sidebar'
import MainArea from './MainArea'
import ConfirmDialog from '../ui/ConfirmDialog'
import styles from './AppLayout.module.css'

export default function AppLayout() {
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed)
  const toggleSidebar = useUIStore((s) => s.toggleSidebar)
  const fetchNotes = useNoteStore((s) => s.fetchNotes)
  const fetchFolders = useFolderStore((s) => s.fetchFolders)
  const fetchTags = useTagStore((s) => s.fetchTags)

  useEffect(() => {
    fetchNotes()
    fetchFolders()
    fetchTags()
  }, [fetchNotes, fetchFolders, fetchTags])

  return (
    <div className={`${styles.layout} ${sidebarCollapsed ? styles.collapsed : ''}`}>
      {/* Mobile sidebar backdrop */}
      {!sidebarCollapsed && (
        <div className={styles.backdrop} onClick={toggleSidebar} />
      )}
      <Header />
      <Sidebar />
      <MainArea />
      <ConfirmDialog />
    </div>
  )
}
