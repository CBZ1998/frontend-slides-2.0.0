import type { IntentLevel, FollowUpStatus } from './note'

export interface FilterState {
  intentLevel: IntentLevel | null
  followUpStatus: FollowUpStatus | null
  source: string | null
  tagIds: number[]
  searchQuery: string
}
