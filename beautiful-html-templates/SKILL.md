---
name: beautiful-html-templates
description: Build stunning HTML slide decks by selecting from 32 curated templates, previewing candidates, and adapting the chosen template to the user's content. Use when the user wants a presentation, slide deck, pitch deck, or any HTML-based visual deck. Picks templates by tone/mood match, not industry.
---

# Beautiful HTML Templates

Produce finished HTML slide decks by picking the right template from `beautiful-html-templates/`, previewing candidates, and replacing placeholder content with the user's real content.

## Directory Layout

```
beautiful-html-templates/
  index.json          # Template catalog (32 templates, metadata for matching)
  runtime/
    deck-stage.js     # Reusable <deck-stage> web component (keyboard nav, scaling, print)
  templates/
    <slug>/
      template.html   # Full demo deck
      template.json   # Template metadata
      deck-stage.js   # Symlink or copy of runtime component
  AGENTS.md           # Full operating manual (read for detailed rules)
```

## Workflow (6 Steps)

### Step 1 — Ask about occasion and mood

Before reading any files, ask the user:

> Two quick questions before I pick a template:
> 1. **What's the occasion?** (e.g. founder pitch, research synthesis, brand manifesto, product launch, classroom kickoff)
> 2. **What mood / vibe do you want?** (e.g. confident & punchy, quiet & literary, warm & playful, dark & moody)

Wait for the answer. The user's *taste* often reveals something the brief alone didn't.

### Step 2 — Read index.json, pick 3 candidates

Read `beautiful-html-templates/index.json`. Match the user's occasion + mood against each template's `mood`, `tone`, `best_for`, and `formality`. **Pick 3 templates** that are different enough from each other to give a real choice (e.g. one editorial, one warmer alternative, one wildcard).

**Matching rules:**
- Lead with `mood` + `tone` + `best_for` — match the *feeling*, not the industry
- Treat `avoid_for` as soft warning, not hard veto
- Use `formality` and `density` to sanity-check
- `scheme` (light/dark/mixed) is a hard signal if the user explicitly states a preference

### Step 3 — Build title-slide preview of each candidate

For each of the 3 candidates:

1. Read the template's `template.html` to learn its visual system
2. Take the **first slide only** (the cover/title slide)
3. Replace placeholder content with **the user's actual title/subtitle/author/date**
4. Copy the template folder to `previews/01-<slug>/`, `previews/02-<slug>/`, `previews/03-<slug>/`
5. Each preview must be self-contained — include all sibling assets (CSS, deck-stage.js, etc.)

### Step 4 — Open previews in browser, present to user

Open each preview with the system's file opener. Send the user:

> Three options to compare:
> 1. **Template A** — one-line tone description
>    `path/to/previews/01-slug.html`
> 2. **Template B** — one-line tone description
>    `path/to/previews/02-slug.html`
> 3. **Template C** — one-line tone description
>    `path/to/previews/03-slug.html`
>
> Which one feels right?

Wait for the user to pick.

### Step 5 — Build the full deck in the chosen template

1. Clone the chosen template's full folder into the user's workspace
2. Adapt every slide:
   - **Preserve:** fonts, color palette, layout grid, CSS classes, decorative elements, navigation runtime
   - **Replace:** headlines, body copy, numbers/stats, names/dates, section labels, image placeholders
3. If the deck needs more slides than the template demo: duplicate existing layouts, update page-number labels
4. If it needs fewer: drop slides from the bottom, update page-number labels
5. If a slide needs a layout the template doesn't have: **design it from scratch using the template's design system** — same fonts, colors, decorative vocabulary, spacing rhythm, component grammar

### Step 6 — Open the final deck, send the file path

Open the finished deck in the browser. Send the user:

> Done. Your deck is at `/absolute/path/to/deck.html` — opened it in your browser.
>
> [One line: which template, why it matched, any caveats about custom slides]

## Critical Rules

- **Never substitute fonts.** If the import fails, fix the import, don't replace the family.
- **Never recolor.** Even small accent shifts break palette harmony.
- **Never combine layouts from different templates.** Each template is a closed visual system.
- **Never strip decorative elements** (corner brackets, paper grain, SVG ornaments, doodles).
- **Always open artifacts in the browser** — every preview, every iteration, the final deck.
- **Always send the absolute file path** to the user after opening.
- Use the `open` command on macOS/Linux, `start` on Windows to open files in browser.
