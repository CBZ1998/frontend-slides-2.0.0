import { create } from 'zustand'
import { db } from '../db'
import type { Tag } from '../types/tag'

interface TagState {
  tags: Tag[]
  loading: boolean
  fetchTags: () => Promise<void>
  createTag: (name: string, color: string) => Promise<Tag>
  deleteTag: (id: number) => Promise<void>
}

export const useTagStore = create<TagState>((set) => ({
  tags: [],
  loading: false,

  fetchTags: async () => {
    set({ loading: true })
    const tags = await db.tags.toArray()
    set({ tags, loading: false })
  },

  createTag: async (name, color) => {
    const id = await db.tags.add({ name, color, createdAt: new Date() })
    const tag = { id, name, color, createdAt: new Date() }
    set((s) => ({ tags: [...s.tags, tag] }))
    return tag
  },

  deleteTag: async (id) => {
    await db.tags.delete(id)
    set((s) => ({ tags: s.tags.filter((t) => t.id !== id) }))
  },
}))
