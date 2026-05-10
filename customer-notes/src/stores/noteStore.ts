import { create } from 'zustand'
import { db } from '../db'
import type { Note } from '../types/note'

interface NoteState {
  notes: Note[]
  selectedNoteId: number | null
  editingNote: Note | null
  loading: boolean

  fetchNotes: () => Promise<void>
  createNote: (partial?: Partial<Note>) => Promise<Note>
  updateNote: (id: number, data: Partial<Note>) => Promise<void>
  deleteNote: (id: number) => Promise<void>
  selectNote: (id: number | null) => void
  setEditingNote: (note: Note | null) => void
  pinNote: (id: number, pinned: boolean) => Promise<void>
}

export const useNoteStore = create<NoteState>((set) => ({
  notes: [],
  selectedNoteId: null,
  editingNote: null,
  loading: false,

  fetchNotes: async () => {
    set({ loading: true })
    const notes = await db.notes.reverse().sortBy('updatedAt')
    set({ notes, loading: false })
  },

  createNote: async (partial = {}) => {
    const now = new Date()
    const note: Note = {
      title: '',
      content: '',
      customerName: '',
      phone: '',
      intentLevel: 'C',
      source: '',
      followUpStatus: 'new',
      nextFollowUp: null,
      tagIds: [],
      folderId: null,
      pinned: false,
      createdAt: now,
      updatedAt: now,
      ...partial,
    }
    const id = await db.notes.add(note)
    const created = { ...note, id }
    set((s) => ({ notes: [created, ...s.notes], editingNote: created, selectedNoteId: id }))
    return created
  },

  updateNote: async (id, data) => {
    const updateData = { ...data, updatedAt: new Date() }
    await db.notes.update(id, updateData)
    set((s) => ({
      notes: s.notes.map((n) => (n.id === id ? { ...n, ...updateData } : n)),
      editingNote: s.editingNote?.id === id ? { ...s.editingNote, ...updateData } : s.editingNote,
    }))
  },

  deleteNote: async (id) => {
    await db.notes.delete(id)
    set((s) => ({
      notes: s.notes.filter((n) => n.id !== id),
      editingNote: s.editingNote?.id === id ? null : s.editingNote,
      selectedNoteId: s.selectedNoteId === id ? null : s.selectedNoteId,
    }))
  },

  selectNote: (id) => set({ selectedNoteId: id }),
  setEditingNote: (note) => set({ editingNote: note }),

  pinNote: async (id, pinned) => {
    await db.notes.update(id, { pinned, updatedAt: new Date() })
    set((s) => ({
      notes: s.notes.map((n) => (n.id === id ? { ...n, pinned, updatedAt: new Date() } : n)),
    }))
  },
}))
