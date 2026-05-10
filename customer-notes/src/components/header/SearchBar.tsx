import { useState, useEffect, useRef } from 'react'
import { useUIStore } from '../../stores/uiStore'
import styles from './SearchBar.module.css'

export default function SearchBar() {
  const setSearchQuery = useUIStore((s) => s.setSearchQuery)
  const [value, setValue] = useState('')
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setSearchQuery(value)
    }, 200)
    return () => clearTimeout(timerRef.current)
  }, [value, setSearchQuery])

  return (
    <div className={styles.wrapper}>
      <span className={styles.icon}>🔍</span>
      <input
        className={styles.input}
        type="text"
        placeholder="搜索客户笔记…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {value && (
        <button className={styles.clear} onClick={() => setValue('')} aria-label="清除搜索">
          ✕
        </button>
      )}
    </div>
  )
}
