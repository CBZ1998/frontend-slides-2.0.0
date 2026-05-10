import { useUIStore } from '../../stores/uiStore'
import FolderTree from '../sidebar/FolderTree'
import TagPanel from '../sidebar/TagPanel'
import FilterPanel from '../sidebar/FilterPanel'
import styles from './Sidebar.module.css'

export default function Sidebar() {
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed)
  const toggleSidebar = useUIStore((s) => s.toggleSidebar)

  return (
    <aside className={`${styles.sidebar} ${sidebarCollapsed ? styles.collapsed : ''}`}>
      <div className={styles.mobileHeader}>
        <span className={styles.mobileTitle}>菜单</span>
        <button className={styles.closeBtn} onClick={toggleSidebar} aria-label="关闭侧栏">
          ✕
        </button>
      </div>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>文件夹</div>
        <FolderTree />
      </div>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>标签</div>
        <TagPanel />
      </div>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>筛选</div>
        <FilterPanel />
      </div>
    </aside>
  )
}
