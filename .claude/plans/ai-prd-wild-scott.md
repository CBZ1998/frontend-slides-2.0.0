# 高意向客户管理笔记 v1.0 — 前端 Demo 实施计划

## 项目概览

在 `frontend-slides-2.0.0/customer-notes/` 下创建独立的 Vite + React 18 + TypeScript 项目，纯前端本地运行，不依赖任何后端服务。

### 技术栈
- **框架**: Vite + React 18 + TypeScript
- **编辑器**: TipTap (ProseMirror) — 富文本编辑
- **存储**: Dexie.js — IndexedDB 封装 (本地持久化)
- **状态管理**: Zustand — 轻量状态管理
- **样式**: CSS Modules + CSS Custom Properties (设计系统变量)
- **拖拽**: @dnd-kit — 文件夹拖拽排序

### 为什么不选 Tailwind？
CSS 变量 + CSS Modules 更符合前端 slides 项目的设计哲学，零运行时开销，Vite 原生支持，与设计系统变量天然整合。

---

## 实施阶段

### Phase 1: 项目脚手架 (30-45min)

| 步骤 | 操作 |
|------|------|
| 1.1 | `npm create vite@latest customer-notes -- --template react-ts` |
| 1.2 | 安装依赖: `dexie`, `zustand`, `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-underline`, `@tiptap/extension-placeholder`, `@tiptap/extension-link` |
| 1.3 | 安装 devDep: `@dnd-kit/core`, `@dnd-kit/sortable` |
| 1.4 | 定义 TypeScript 类型 (`types/note.ts`, `folder.ts`, `tag.ts`, `filter.ts`) |
| 1.5 | 定义常量 (`utils/constants.ts` — 意向等级/状态/来源的中文标签) |
| 1.6 | 设置 Dexie 数据库 (`db/index.ts` — notes/folders/tags 三张表) |
| 1.7 | 全局 CSS 设计系统 (`index.css` — CSS 变量: 颜色、间距、排版) |

### Phase 2: Zustand 状态管理 (30min)

| Store | 职责 |
|-------|------|
| `uiStore` | 侧栏折叠、当前视图、确认对话框、搜索关键词 |
| `tagStore` | 标签 CRUD |
| `folderStore` | 文件夹 CRUD + 树结构构建 |
| `filterStore` | 筛选条件状态 |
| `noteStore` | 笔记 CRUD + 选中/编辑状态 (最复杂) |

### Phase 3: 布局壳 (30min)

- CSS Grid 三栏布局: sidebar 260px | main 1fr
- Header 56px 固定顶部
- Sidebar 可折叠，独立滚动
- MainArea 根据 activeView 条件渲染列表/编辑器

### Phase 4: 文件夹管理 (1hr)

- FolderTree + FolderNode (递归组件)
- 文件夹 CRUD 对话框 (新建子文件夹、重命名、删除确认)
- 点击文件夹筛选笔记

### Phase 5: 笔记编辑 (2hr)

- NoteCard + NoteListView (卡片视图)
- NoteEditor 编排组件
- StructuredFields (客户姓名、电话、来源、跟进状态)
- IntentLevelSelect (S/A/B/C/D 五档颜色编码按钮)
- TagSelector (标签下拉选择器)
- **TipTapEditor** — 核心编辑器，带工具栏 (h2/粗体/斜体/下划线/列表/引用/链接)
- 300ms 防抖自动保存 + 保存状态指示器

### Phase 6: 搜索筛选 (1hr)

- SearchBar (200ms 防抖，搜索标题+客户名+内容)
- FilterPanel (意向等级/跟进状态/来源筛选)
- TagPanel (标签点击筛选)
- 组合筛选: `useMemo` 合并所有筛选条件

### Phase 7: 打磨 (1-2hr)

- 文件夹拖拽排序 (@dnd-kit)
- EmptyState 空状态组件
- 响应式侧栏折叠
- 键盘快捷键 (Ctrl+Enter 保存, Escape 取消)

---

## 数据模型

```
Note:
  id (自动增量), title, content (HTML), customerName, phone,
  intentLevel (S/A/B/C/D), source, followUpStatus,
  nextFollowUp (Date), tagIds[], folderId, createdAt, updatedAt

Folder:
  id (自动增量), name, parentId, order, createdAt, updatedAt

Tag:
  id (自动增量), name, color (hex), createdAt
```

## 数据流

```
React Components → Zustand Stores → Dexie (IndexedDB)
                    ↑                    |
                    └── 读取 ←───────────┘
```

所有写操作: 先持久化到 Dexie，再更新 Zustand 状态。没有跨 store 的循环依赖。

---

## 布局结构

```
┌──────────────────────────────────────────────┐
│ Header: Logo | SearchBar | [新建笔记]         │
├──────────┬───────────────────────────────────┤
│ Sidebar  │ Main Area                         │
│ ├ 文件夹树 │ ├ NoteListView (浏览模式)         │
│ ├ 标签面板 │ └ NoteEditor (编辑模式)           │
│ └ 筛选面板 │                                   │
└──────────┴───────────────────────────────────┘
```

## 中文 UI

所有标签使用中文:
- 意向等级: S=超级意向, A=高意向, B=中意向, C=低意向, D=无意向
- 跟进状态: 新建 / 已联系 / 有意向 / 跟进中 / 已成交 / 已流失

---

## 验证方式

1. `cd customer-notes && npm run dev` 启动开发服务器
2. 测试流程: 新建笔记 → 填写字段 → 写富文本 → 保存 → 显示在列表 → 编辑 → 删除
3. 文件夹: 新建 → 嵌套 → 移动笔记 → 删除
4. 搜索: 关键词搜索 + 筛选条件组合
5. 刷新浏览器后数据是否持久化 (IndexedDB)

---

## 文件清单 (约 52 个文件)

```
customer-notes/
├── package.json, index.html, vite.config.ts, tsconfig.json, tsconfig.node.json
├── src/
│   ├── main.tsx, App.tsx, index.css, vite-env.d.ts
│   ├── types/     (4 files) — note, folder, tag, filter
│   ├── db/index.ts
│   ├── stores/    (5 files) — note, folder, tag, filter, ui
│   ├── utils/     (2 files) — constants, formatters
│   └── components/
│       ├── ui/         (4 dirs) — Button, Modal, Badge, ConfirmDialog
│       ├── layout/     (4 dirs) — AppLayout, Header, Sidebar, MainArea
│       ├── header/     (3 dirs) — Logo, SearchBar, NewNoteButton
│       ├── sidebar/    (4 dirs) — FolderTree, FolderNode, TagPanel, FilterPanel
│       ├── notes/      (3 dirs) — NoteListView, NoteCard, EmptyState
│       └── editor/     (5 dirs) — NoteEditor, StructuredFields, TagSelector,
│                                   IntentLevelSelect, TipTapEditor
```
