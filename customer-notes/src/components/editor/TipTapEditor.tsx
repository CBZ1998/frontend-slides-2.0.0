import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import { useEffect, useRef } from 'react'
import styles from './TipTapEditor.module.css'

interface TipTapEditorProps {
  content: string
  onChange: (html: string) => void
  placeholder?: string
}

export default function TipTapEditor({ content, onChange, placeholder = '开始记录客户信息…' }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Underline,
      Placeholder.configure({ placeholder }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  // Sync external content changes
  const prevContent = useRef(content)
  useEffect(() => {
    if (editor && content !== prevContent.current && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
    prevContent.current = content
  }, [content, editor])

  if (!editor) return null

  const addLink = () => {
    const url = window.prompt('输入链接 URL：')
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  return (
    <div className={styles.editor}>
      <div className={styles.toolbar}>
        <button
          className={`${styles.toolBtn} ${editor.isActive('heading', { level: 2 }) ? styles.active : ''}`}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          title="标题"
        >
          H2
        </button>
        <button
          className={`${styles.toolBtn} ${editor.isActive('heading', { level: 3 }) ? styles.active : ''}`}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          title="小标题"
        >
          H3
        </button>
        <span className={styles.sep} />
        <button
          className={`${styles.toolBtn} ${editor.isActive('bold') ? styles.active : ''}`}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="粗体"
        >
          <strong>B</strong>
        </button>
        <button
          className={`${styles.toolBtn} ${editor.isActive('italic') ? styles.active : ''}`}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="斜体"
        >
          <em>I</em>
        </button>
        <button
          className={`${styles.toolBtn} ${editor.isActive('underline') ? styles.active : ''}`}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title="下划线"
        >
          <u>U</u>
        </button>
        <span className={styles.sep} />
        <button
          className={`${styles.toolBtn} ${editor.isActive('bulletList') ? styles.active : ''}`}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="无序列表"
        >
          •≡
        </button>
        <button
          className={`${styles.toolBtn} ${editor.isActive('orderedList') ? styles.active : ''}`}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="有序列表"
        >
          1.
        </button>
        <button
          className={`${styles.toolBtn} ${editor.isActive('blockquote') ? styles.active : ''}`}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="引用"
        >
          ❝
        </button>
        <span className={styles.sep} />
        <button
          className={`${styles.toolBtn} ${editor.isActive('link') ? styles.active : ''}`}
          onClick={addLink}
          title="插入链接"
        >
          🔗
        </button>
      </div>
      <EditorContent editor={editor} className={styles.content} />
    </div>
  )
}
