# Personal Resume Website -- Design Plan

## 1. Recommended Visual Style: "Warm Minimal"

A light, airy, professional style that avoids the dark neon aesthetic of the demo, while still feeling polished and modern. Suitable for a Chinese-speaking professional.

### Color Palette

```css
--bg-primary:   #faf9f7;    /* warm off-white background */
--bg-alt:       #f3f1ee;    /* slightly warmer for section alternation */
--bg-card:      #ffffff;    /* card surfaces */
--text-primary: #1a1a1a;    /* near-black for body */
--text-secondary: #6b635c;  /* muted warm gray */
--text-muted:   #a39e98;    /* subtle text */
--accent:       #2d6a4f;    /* forest green -- calm, confident, professional */
--accent-light: rgba(45, 106, 79, 0.08); /* hover/fill backgrounds */
--accent-glow:  rgba(45, 106, 79, 0.15);
--border:       #e5e2dd;    /* subtle warm border */
--shadow:        rgba(26, 26, 26, 0.04);
```

Why forest green: It is understated, conveys growth/reliability, pairs beautifully with warm neutrals, and works well for both Chinese and Western contexts.

### Typography

- **Display/Headings:** `'Inter'` (Google Fonts) -- clean, highly legible at all sizes, excellent CJK pairing.
- **Body:** System font stack optimized for Chinese users:
  ```
  'Inter', 'PingFang SC', 'Microsoft YaHei', 'Noto Sans SC', -apple-system, sans-serif
  ```
  This guarantees beautiful Chinese character rendering without downloading a multi-megabyte CJK font file.

- **Mono accents (optional):** `'Space Mono'` (already loaded in project) for dates, tags, or short code-like snippets.

### Sizing (following project clamp() pattern)

```css
--title-size:  clamp(2rem, 5vw, 4rem);
--h2-size:     clamp(1.5rem, 3vw, 2.25rem);
--h3-size:     clamp(1.125rem, 1.8vw, 1.5rem);
--body-size:   clamp(0.95rem, 1.2vw, 1.1rem);
--small-size:  clamp(0.8rem, 0.9vw, 0.9rem);
--section-padding: clamp(3rem, 8vw, 6rem);
--max-width:   min(90vw, 1100px);
```

### Design Principles

- **Whitespace is the accent** -- generous padding, lots of breathing room
- **Subtle depth** -- cards use `box-shadow: 0 1px 3px var(--shadow)` with a 1px `var(--border)` stroke
- **Single accent color** -- green is used sparingly: underlines, hover states, skill bar fills, icon accents
- **No heavy backgrounds** -- no full-viewport hero images, no particle systems
- **Mobile-first** -- single column by default, two-column grids kick in above 768px

---

## 2. HTML Structure Outline

```
<body>
  <!-- Fixed scroll-progress bar (thin, top of page) -->
  <!-- Sticky navigation bar (section links, becomes sticky on scroll) -->

  <!-- HERO: full-viewport, centered vertically -->
  <section id="hero">
    <h1>Name</h1>
    <p>Title / Role</p>
    <p>Tagline (one-liner)</p>
    <div class="scroll-indicator">scroll down</div>
  </section>

  <!-- ABOUT: brief intro with optional avatar placeholder -->
  <section id="about">
    <h2>About</h2>
    <p>2-3 sentence introduction</p>
  </section>

  <!-- EXPERIENCE: vertical timeline -->
  <section id="experience">
    <h2>Experience</h2>
    <div class="timeline">
      <div class="timeline-item">(year, company, role, description)</div>
      <div class="timeline-item">...</div>
    </div>
  </section>

  <!-- SKILLS: categorized skill groups + visual bars -->
  <section id="skills">
    <h2>Skills</h2>
    <div class="skill-category">
      <h3>Category name</h3>
      <div class="skill-bar"><span class="skill-name">Skill</span><span class="skill-level" style="width:X%"></span></div>
    </div>
  </section>

  <!-- EDUCATION: simple card list -->
  <section id="education">
    <h2>Education</h2>
    <div class="edu-card">(degree, school, year, details)</div>
  </section>

  <!-- CONTACT: links and info -->
  <section id="contact">
    <h2>Contact</h2>
    <div class="contact-links">
      <a>Email</a>
      <a>GitHub</a>
      <a>LinkedIn</a>
      <a>Website / Blog</a>
    </div>
  </section>

  <!-- FOOTER: copyright -->
  <footer></footer>
</body>
```

---

## 3. Key CSS Techniques

| Technique | Where | Why |
|---|---|---|
| CSS custom properties | `:root` theme block | One-place theming, following project conventions |
| `clamp()` | All font-sizes, paddings, gaps | Fluid responsive scaling from phone to ultrawide (project pattern) |
| `scroll-behavior: smooth` | `html` element | Native smooth scrolling (zero JS) |
| `position: sticky` | Navigation bar | Sticky nav that follows as user scrolls |
| CSS Grid | Skill category grids, contact links | Two-column auto-fit layout, collapses to single column on mobile |
| Flexbox | Timeline items, card interiors | Simple linear layouts |
| `::before` pseudo-elements | Timeline vertical line, section decorative markers | Pure CSS decorative elements, no extra HTML |
| `@keyframes` + `animation` | Scroll indicator bounce, fade-in reveals | Lightweight CSS animations (no heavy JS library) |
| `min()` | `.container` max-width | `max-width: min(90vw, 1100px)` -- never overflows on small screens |
| `gap` | Grids and flex containers | Consistent spacing without margin hacks |
| `transition` | Hover states on cards, skill bars, nav links | Subtle interactivity feedback |
| `@media (prefers-reduced-motion: reduce)` | Global override | Accessibility requirement (match project standard) |
| `@media (max-width: 768px)` | Responsive breakpoint | Mobile-first: stacks multi-column layouts, reduces padding |
| `scroll-margin-top` | Section anchors | Offsets the sticky nav height so scroll targets are visible |

---

## 4. JavaScript Interactions Needed

All vanilla JS, no libraries.

### 4a. Scroll-Triggered Reveal Animations (Intersection Observer)

```
Observe all [data-reveal] elements
When element enters viewport (threshold: 0.15):
  -> Add class .revealed (CSS triggers opacity:1 + translateY(0))
```

CSS companion:
```css
[data-reveal] {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
[data-reveal].revealed {
  opacity: 1;
  transform: translateY(0);
}
```

Stagger support via `data-reveal-delay` attribute or nth-child selectors.

### 4b. Active Navigation Highlighting

```
Use Intersection Observer (threshold array [0.2, 0.6] or rootMargin)
on each section to detect which section is currently in view.
Add .active class to corresponding nav link.
```

### 4c. Smooth Scroll for Anchor Links

```
Prevent default on nav link clicks
scrollIntoView({ behavior: 'smooth', block: 'start' })
Update URL hash without jump via history.pushState or just use CSS scroll-behavior
```

### 4d. Scroll Progress Bar (Optional Enhancement)

```
Listen to window scroll event (throttled to RAF):
  progress = window.scrollY / (documentHeight - viewportHeight)
  Update progress bar width
```

### 4e. Skill Bar Fill Animation

```
When skills section is revealed (Intersection Observer):
  Animate skill level widths from 0% to their target percentage
  Use CSS transition on width, triggered by a .animated class
```

### 4f. Reduced Motion Check

```
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  // Skip all animations, reveal everything immediately
  document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('revealed'));
  document.querySelectorAll('.skill-level').forEach(el => el.style.width = el.dataset.target);
}
```

---

## 5. File Location

```
c:\Users\程柏智\Desktop\frontend-slides-2.0.0\resume.html
```

This keeps the resume alongside the existing `demo-presentation.html`, following the project convention of flat standalone HTML files at the project root. No subdirectories needed (zero dependencies).

If the user wants to keep images/assets separate, they can optionally create:
```
c:\Users\程柏智\Desktop\frontend-slides-2.0.0\resume-assets\
```

---

## Summary of Deviations from Demo-Presentation.html

| Aspect | Demo (Slides) | Resume (This Plan) |
|---|---|---|
| Layout | Full-viewport slides, scroll-snap | Traditional single scrolling page |
| Theme | Dark neon (electric blue + neon yellow) | Light warm minimal (off-white + forest green) |
| Background | Particle canvas + radial gradients | Solid off-white with subtle section alternation |
| Navigation | Fixed nav dots + keyboard | Sticky top nav bar with section links |
| Progress bar | Slide-position-based | Scroll-position-based |
| Hero | Full slide with geometric shapes | Viewport-centered name/title, no heavy decoration |
| JavaScript | SlidePresentation class (keyboard, touch, wheel) | IntersectionObserver reveals + scroll tracking |
| Chinese fonts | Relies on browser default CJK fallback | Explicit system CJK stack for body text |
