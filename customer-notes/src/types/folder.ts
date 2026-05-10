export interface Folder {
  id?: number
  name: string
  parentId: number | null
  order: number
  createdAt: Date
  updatedAt: Date
}
