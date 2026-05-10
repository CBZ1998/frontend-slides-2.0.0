import type { IntentLevel } from '../../types/note'
import { INTENT_LEVELS } from '../../utils/constants'
import styles from './IntentLevelSelect.module.css'

interface IntentLevelSelectProps {
  value: IntentLevel
  onChange: (level: IntentLevel) => void
}

export default function IntentLevelSelect({ value, onChange }: IntentLevelSelectProps) {
  return (
    <div className={styles.group}>
      <label className={styles.label}>意向等级</label>
      <div className={styles.buttons}>
        {INTENT_LEVELS.map((level) => (
          <button
            key={level.value}
            className={`${styles.btn} ${value === level.value ? styles.active : ''}`}
            style={{
              '--btn-color': level.color,
              ...(value === level.value ? { background: level.color, color: '#fff', borderColor: level.color } : {}),
            } as React.CSSProperties}
            onClick={() => onChange(level.value)}
          >
            {level.label}
          </button>
        ))}
      </div>
    </div>
  )
}
