# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Language

始终使用中文与用户交流。所有回复、解释、提问都用中文。代码注释和变量名保持英文。

## Project Overview

This is a monorepo with two independent projects:

1. **`customer-notes/`** — A React + TypeScript CRM-like app (UI in Chinese) for managing customer notes with structured fields, rich text editing, filtering, and local IndexedDB storage.
2. **Root-level files** — A "Frontend Slides" Claude Code skill (SKILL.md) for generating zero-dependency HTML presentations, with 12 curated visual style presets.

## customer-notes/ Commands

```bash
# Development
cd customer-notes && npm run dev

# Build (produces a single self-contained HTML file in dist/)
cd customer-notes && npm run build

# Lint
cd customer-notes && npm run lint

# Preview production build
cd customer-notes && npm run preview
```

## customer-notes/ Architecture

### Stack
- **React 19** with TypeScript 6
- **Vite 8** with `vite-plugin-singlefile` (builds everything into one HTML file)
- **Zustand** for state management (5 stores)
- **Dexie** (IndexedDB wrapper) for client-side persistence
- **TipTap** (ProseMirror-based) for rich text editing
- **CSS Modules** for component styling (`.module.css` files)
- **@dnd-kit** (devDependency) for drag-and-drop (folder tree)

### Design System
Fonts: Satoshi (body) + Clash Display (headings) from Fontshare. All text sizes use `clamp()`. Design tokens live in `src/index.css` as CSS custom properties (colors, spacing, radii, shadows, transitions).

### Data Flow
- All data is stored locally in IndexedDB via Dexie (no backend)
- Zustand stores fetch from Dexie on mount and keep an in-memory cache
- Mutations go: Component → Zustand action → Dexie update → Zustand state update
- The `Note` model includes: customerName, phone, intentLevel (S/A/B/C/D), source, followUpStatus, tagIds, folderId, pinned, rich text `content`

### Key Patterns
- **Debounced saves**: Editor uses 300ms debounce for auto-saving content changes
- **Debounced search**: SearchBar uses 200ms debounce
- **Filtered list**: NoteListView applies all active filters via `useMemo` (folder, search, intent level, follow-up status, source, tags)
- **Seeding**: App.tsx calls `seedDefaultFolder()` and `seedDefaultTags()` on mount if DB is empty
- **Toggle sidebar**: Mobile-friendly sidebar with backdrop overlay

## Frontend Slides Skill (Root Level)

The skill uses **progressive disclosure**: SKILL.md is the concise workflow map (~180 lines), with supporting files loaded on-demand only when needed for specific phases.

| File | Purpose |
|------|---------|
| SKILL.md | Main skill workflow (5 phases) |
| STYLE_PRESETS.md | 12 visual presets with colors, fonts, signature elements |
| viewport-base.css | Mandatory responsive CSS for all presentations |
| html-template.md | HTML structure + JS SlidePresentation class spec |
| animation-patterns.md | Animation effects mapped to feelings/vibes |
| scripts/extract-pptx.py | Python PPTX → JSON extraction tool |
| demo-presentation.html | Example generated presentation |

### Key Rules for Generated Presentations
- Every slide must fit exactly within 100vh (no scrolling, ever)
- ALL font sizes and spacing use `clamp()`
- Must include full `viewport-base.css` contents
- Self-contained single HTML file (no build tools)
- Use distinctive fonts (never Inter, Roboto, Arial, system fonts)
- Avoid generic AI aesthetics (purple gradients on white, etc.)
