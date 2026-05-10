import { useUIStore } from '../../stores/uiStore'
import Logo from '../header/Logo'
import SearchBar from '../header/SearchBar'
import NewNoteButton from '../header/NewNoteButton'
import styles from './Header.module.css'

export default function Header() {
  const toggleSidebar = useUIStore((s) => s.toggleSidebar)
  const saveStatus = useUIStore((s) => s.saveStatus)

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button className={styles.menuBtn} onClick={toggleSidebar} aria-label="切换侧栏">
          ☰
        </button>
        <Logo />
      </div>
      <div className={styles.center}>
        <SearchBar />
      </div>
      <div className={styles.right}>
        <span className={styles.status}>
          {saveStatus === 'saving' && '保存中…'}
          {saveStatus === 'saved' && '已保存'}
        </span>
        <NewNoteButton />
      </div>
    </header>
  )
}
