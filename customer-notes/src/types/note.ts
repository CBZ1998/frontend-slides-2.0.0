export type IntentLevel = 'S' | 'A' | 'B' | 'C' | 'D'
export type FollowUpStatus = 'new' | 'contacted' | 'interested' | 'follow-up' | 'won' | 'lost'

export interface Note {
  id?: number
  title: string
  content: string
  customerName: string
  phone: string
  intentLevel: IntentLevel
  source: string
  followUpStatus: FollowUpStatus
  nextFollowUp: Date | null
  tagIds: number[]
  folderId: number | null
  pinned: boolean
  createdAt: Date
  updatedAt: Date
}
