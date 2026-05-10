import type { IntentLevel, FollowUpStatus } from '../types/note'

export const INTENT_LEVELS: { value: IntentLevel; label: string; color: string }[] = [
  { value: 'S', label: '超级意向', color: '#dc2626' },
  { value: 'A', label: '高意向', color: '#ea580c' },
  { value: 'B', label: '中意向', color: '#d97706' },
  { value: 'C', label: '低意向', color: '#2563eb' },
  { value: 'D', label: '无意向', color: '#6b7280' },
]

export const FOLLOW_UP_STATUSES: { value: FollowUpStatus; label: string }[] = [
  { value: 'new', label: '新建' },
  { value: 'contacted', label: '已联系' },
  { value: 'interested', label: '有意向' },
  { value: 'follow-up', label: '跟进中' },
  { value: 'won', label: '已成交' },
  { value: 'lost', label: '已流失' },
]

export const SOURCES = [
  '转介绍',
  '线上广告',
  '门店来访',
  '活动推广',
  '电话咨询',
  '社交媒体',
  '其他',
] as const

export const TAG_COLORS = [
  '#3b82f6',
  '#ef4444',
  '#10b981',
  '#f59e0b',
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
  '#84cc16',
]
