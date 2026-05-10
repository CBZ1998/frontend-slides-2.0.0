import { useCallback } from 'react'
import type { Folder } from '../../types/folder'
import { useFolderStore } from '../../stores/folderStore'
import { useNoteStore } from '../../stores/noteStore'
import { useUIStore } from '../../stores/uiStore'
import { db } from '../../db'
import FolderNode from './FolderNode'
import styles from './FolderTree.module.css'

interface TreeNode {
  folder: Folder
  children: TreeNode[]
}

function buildTree(folders: Folder[], parentId: number | null = null): TreeNode[] {
  return folders
    .filter((f) => f.parentId === parentId)
    .sort((a, b) => a.order - b.order)
    .map((folder) => ({
      folder,
      children: buildTree(folders, folder.id),
    }))
}

export default function FolderTree() {
  const folders = useFolderStore((s) => s.folders)
  const selectedFolderId = useFolderStore((s) => s.selectedFolderId)
  const selectFolder = useFolderStore((s) => s.selectFolder)
  const renameFolder = useFolderStore((s) => s.renameFolder)
  const deleteFolder = useFolderStore((s) => s.deleteFolder)
  const createFolder = useFolderStore((s) => s.createFolder)
  const fetchNotes = useNoteStore((s) => s.fetchNotes)
  const setActiveView = useUIStore((s) => s.setActiveView)
  const showConfirm = useUIStore((s) => s.showConfirm)

  const tree = buildTree(folders)

  const handleSelect = useCallback((id: number) => {
    selectFolder(id)
    setActiveView('list')
  }, [selectFolder, setActiveView])

  const handleDelete = useCallback((id: number) => {
    const folder = folders.find((f) => f.id === id)
    if (!folder) return
    showConfirm(
      '删除文件夹',
      `确定要删除「${folder.name}」吗？其中的笔记将移至"未分类"。`,
      async () => {
        const childIds = folders.filter((f) => f.parentId === id).map((f) => f.id!)
        // Move notes to unfiled
        await db.notes.where({ folderId: id }).modify({ folderId: null })
        // Move child folders to root
        for (const cid of childIds) {
          await db.folders.update(cid, { parentId: null, updatedAt: new Date() })
        }
        await deleteFolder(id)
        await fetchNotes()
      }
    )
  }, [folders, deleteFolder, showConfirm, fetchNotes])

  const handleAddSubfolder = useCallback(async (parentId: number) => {
    const name = window.prompt('请输入文件夹名称：')
    if (name?.trim()) {
      await createFolder(name.trim(), parentId)
    }
  }, [createFolder])

  return (
    <div className={styles.tree}>
      {tree.map((node) => (
        <FolderNode
          key={node.folder.id}
          folder={node.folder}
          depth={0}
          isSelected={selectedFolderId === node.folder.id}
          onSelect={handleSelect}
          onRename={renameFolder}
          onDelete={handleDelete}
          onAddSubfolder={handleAddSubfolder}
        >
          {node.children.map((child) => (
            <FolderNode
              key={child.folder.id}
              folder={child.folder}
              depth={1}
              isSelected={selectedFolderId === child.folder.id}
              onSelect={handleSelect}
              onRename={renameFolder}
              onDelete={handleDelete}
              onAddSubfolder={handleAddSubfolder}
            >
              {child.children.map((grandchild) => (
                <FolderNode
                  key={grandchild.folder.id}
                  folder={grandchild.folder}
                  depth={2}
                  isSelected={selectedFolderId === grandchild.folder.id}
                  onSelect={handleSelect}
                  onRename={renameFolder}
                  onDelete={handleDelete}
                  onAddSubfolder={handleAddSubfolder}
                >
                  {null}
                </FolderNode>
              ))}
            </FolderNode>
          ))}
        </FolderNode>
      ))}
      <button
        className={styles.addBtn}
        onClick={async () => {
          const name = window.prompt('请输入文件夹名称：')
          if (name?.trim()) await createFolder(name.trim())
        }}
      >
        + 新建文件夹
      </button>
    </div>
  )
}
