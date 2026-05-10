import { create } from 'zustand'
import type { IntentLevel, FollowUpStatus } from '../types/note'

interface FilterState {
  intentLevel: IntentLevel | null
  followUpStatus: FollowUpStatus | null
  source: string | null
  tagIds: number[]

  setIntentLevel: (level: IntentLevel | null) => void
  setFollowUpStatus: (status: FollowUpStatus | null) => void
  setSource: (source: string | null) => void
  setTagIds: (ids: number[]) => void
  toggleTagId: (id: number) => void
  resetFilters: () => void
}

export const useFilterStore = create<FilterState>((set, get) => ({
  intentLevel: null,
  followUpStatus: null,
  source: null,
  tagIds: [],

  setIntentLevel: (level) => set({ intentLevel: level }),
  setFollowUpStatus: (status) => set({ followUpStatus: status }),
  setSource: (source) => set({ source }),
  setTagIds: (ids) => set({ tagIds: ids }),
  toggleTagId: (id) => {
    const current = get().tagIds
    if (current.includes(id)) {
      set({ tagIds: current.filter((tid) => tid !== id) })
    } else {
      set({ tagIds: [...current, id] })
    }
  },
  resetFilters: () => set({ intentLevel: null, followUpStatus: null, source: null, tagIds: [] }),
}))
