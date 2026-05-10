import { useFilterStore } from '../../stores/filterStore'
import { INTENT_LEVELS, FOLLOW_UP_STATUSES, SOURCES } from '../../utils/constants'
import Badge from '../ui/Badge'
import styles from './FilterPanel.module.css'

export default function FilterPanel() {
  const filter = useFilterStore()
  const hasActiveFilter = filter.intentLevel || filter.followUpStatus || filter.source || filter.tagIds.length > 0

  return (
    <div className={styles.panel}>
      <div className={styles.group}>
        <div className={styles.label}>意向等级</div>
        <div className={styles.chips}>
          {INTENT_LEVELS.map((level) => (
            <button
              key={level.value}
              className={`${styles.chip} ${filter.intentLevel === level.value ? styles.active : ''}`}
              onClick={() => filter.setIntentLevel(filter.intentLevel === level.value ? null : level.value)}
            >
              <Badge color={level.color}>{level.label}</Badge>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <div className={styles.label}>跟进状态</div>
        <div className={styles.chips}>
          {FOLLOW_UP_STATUSES.map((status) => (
            <button
              key={status.value}
              className={`${styles.chip} ${filter.followUpStatus === status.value ? styles.activeChip : ''}`}
              onClick={() => filter.setFollowUpStatus(filter.followUpStatus === status.value ? null : status.value)}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <div className={styles.label}>客户来源</div>
        <div className={styles.chips}>
          {SOURCES.map((source) => (
            <button
              key={source}
              className={`${styles.chip} ${filter.source === source ? styles.activeChip : ''}`}
              onClick={() => filter.setSource(filter.source === source ? null : source)}
            >
              {source}
            </button>
          ))}
        </div>
      </div>

      {hasActiveFilter && (
        <button className={styles.resetBtn} onClick={filter.resetFilters}>
          清除筛选
        </button>
      )}
    </div>
  )
}
