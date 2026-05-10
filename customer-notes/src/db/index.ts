import Dexie, { type Table } from 'dexie'
import type { Note } from '../types/note'
import type { Folder } from '../types/folder'
import type { Tag } from '../types/tag'

export class CustomerDatabase extends Dexie {
  notes!: Table<Note, number>
  folders!: Table<Folder, number>
  tags!: Table<Tag, number>

  constructor() {
    super('CustomerNotesDB')

    this.version(1).stores({
      notes: '++id, customerName, intentLevel, followUpStatus, source, folderId, createdAt, updatedAt, *tagIds',
      folders: '++id, parentId, order, [parentId+order]',
      tags: '++id, name',
    })
  }
}

export const db = new CustomerDatabase()

export async function seedDefaultFolder() {
  const count = await db.folders.count()
  if (count === 0) {
    const now = new Date()
    await db.folders.bulkAdd([
      { name: '所有笔记', parentId: null, order: 0, createdAt: now, updatedAt: now },
      { name: '近期跟进', parentId: null, order: 1, createdAt: now, updatedAt: now },
    ])
  }
}

export async function seedDefaultTags() {
  const count = await db.tags.count()
  if (count === 0) {
    const now = new Date()
    await db.tags.bulkAdd([
      { name: 'VIP', color: '#ef4444', createdAt: now },
      { name: '新客户', color: '#3b82f6', createdAt: now },
      { name: '潜在', color: '#10b981', createdAt: now },
      { name: '需跟进', color: '#f59e0b', createdAt: now },
    ])
  }
}
