import type { Note, IntentLevel, FollowUpStatus } from '../../types/note'
import { FOLLOW_UP_STATUSES, SOURCES } from '../../utils/constants'
import IntentLevelSelect from './IntentLevelSelect'
import styles from './StructuredFields.module.css'

interface StructuredFieldsProps {
  note: Note
  onChange: (data: Partial<Note>) => void
}

export default function StructuredFields({ note, onChange }: StructuredFieldsProps) {
  return (
    <div className={styles.fields}>
      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>客户姓名</label>
          <input
            className={styles.input}
            type="text"
            value={note.customerName}
            onChange={(e) => onChange({ customerName: e.target.value })}
            placeholder="请输入客户姓名"
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>联系电话</label>
          <input
            className={styles.input}
            type="text"
            value={note.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            placeholder="手机号"
          />
        </div>
      </div>

      <IntentLevelSelect
        value={note.intentLevel}
        onChange={(level: IntentLevel) => onChange({ intentLevel: level })}
      />

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>客户来源</label>
          <select
            className={styles.select}
            value={note.source}
            onChange={(e) => onChange({ source: e.target.value })}
          >
            <option value="">选择来源</option>
            {SOURCES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>跟进状态</label>
          <select
            className={styles.select}
            value={note.followUpStatus}
            onChange={(e) => onChange({ followUpStatus: e.target.value as FollowUpStatus })}
          >
            {FOLLOW_UP_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
