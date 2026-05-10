import { create } from 'zustand'

export type ActiveView = 'list' | 'editor'

interface ConfirmDialog {
  open: boolean
  title: string
  message: string
  onConfirm: () => void
}

interface UIState {
  sidebarCollapsed: boolean
  activeView: ActiveView
  searchQuery: string
  confirmDialog: ConfirmDialog
  saveStatus: 'idle' | 'saving' | 'saved'

  toggleSidebar: () => void
  setActiveView: (view: ActiveView) => void
  setSearchQuery: (query: string) => void
  showConfirm: (title: string, message: string, onConfirm: () => void) => void
  hideConfirm: () => void
  setSaveStatus: (status: 'idle' | 'saving' | 'saved') => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  activeView: 'list',
  searchQuery: '',
  confirmDialog: { open: false, title: '', message: '', onConfirm: () => {} },
  saveStatus: 'idle',

  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setActiveView: (view) => set({ activeView: view }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  showConfirm: (title, message, onConfirm) =>
    set({ confirmDialog: { open: true, title, message, onConfirm } }),
  hideConfirm: () =>
    set({ confirmDialog: { open: false, title: '', message: '', onConfirm: () => {} } }),
  setSaveStatus: (status) => set({ saveStatus: status }),
}))
