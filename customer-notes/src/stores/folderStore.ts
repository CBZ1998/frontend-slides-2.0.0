import { create } from 'zustand'
import { db } from '../db'
import type { Folder } from '../types/folder'

interface FolderState {
  folders: Folder[]
  selectedFolderId: number | null
  loading: boolean

  fetchFolders: () => Promise<void>
  createFolder: (name: string, parentId?: number | null) => Promise<Folder>
  renameFolder: (id: number, name: string) => Promise<void>
  deleteFolder: (id: number) => Promise<void>
  selectFolder: (id: number | null) => void
  moveFolder: (id: number, newParentId: number | null, newOrder: number) => Promise<void>
}

export const useFolderStore = create<FolderState>((set, get) => ({
  folders: [],
  selectedFolderId: null,
  loading: false,

  fetchFolders: async () => {
    set({ loading: true })
    const folders = await db.folders.toArray()
    set({ folders, loading: false })
  },

  createFolder: async (name, parentId = null) => {
    const siblings = get().folders.filter((f) => f.parentId === parentId)
    const order = siblings.length
    const now = new Date()
    const id = await db.folders.add({
      name,
      parentId,
      order,
      createdAt: now,
      updatedAt: now,
    })
    const folder: Folder = { id, name, parentId, order, createdAt: now, updatedAt: now }
    set((s) => ({ folders: [...s.folders, folder] }))
    return folder
  },

  renameFolder: async (id, name) => {
    await db.folders.update(id, { name, updatedAt: new Date() })
    set((s) => ({
      folders: s.folders.map((f) => (f.id === id ? { ...f, name, updatedAt: new Date() } : f)),
    }))
  },

  deleteFolder: async (id) => {
    await db.folders.delete(id)
    set((s) => ({ folders: s.folders.filter((f) => f.id !== id) }))
  },

  selectFolder: (id) => set({ selectedFolderId: id }),

  moveFolder: async (id, newParentId, newOrder) => {
    await db.folders.update(id, { parentId: newParentId, order: newOrder, updatedAt: new Date() })
    set((s) => ({
      folders: s.folders.map((f) =>
        f.id === id ? { ...f, parentId: newParentId, order: newOrder, updatedAt: new Date() } : f
      ),
    }))
  },
}))
