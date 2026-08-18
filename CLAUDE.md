# CLAUDE.md

Hassan Mushtaq's portfolio — an awwwards-level personal site.

## Read this first
**Before ANY design/UI/motion change, open and obey [`DESIGN-LOCK.md`](./DESIGN-LOCK.md).**
It is the source of truth for the design system, the locked components (primary
button, cursor, links), the design tokens, and — most importantly — the **motion
pillars** (WebGL / GSAP / parallax / smooth transitioning scroll) that are the whole
point of this site.

## Working rules (non-negotiable)
1. **Match provided references exactly** — reproduce structure, spacing and detail;
   do not substitute my own invention. Flag anything I can't match.
2. **Restate the spec + reference details + plan before coding** on non-trivial work.
3. **Motion is a deliverable, not polish.** No section ships as static
   fade-and-reveal only — it must carry the motion pillars.
4. Respect **LOCKED vs EXPLORE** labels in DESIGN-LOCK.md. Don't reinvent LOCKED items.
5. Keep reduced-motion fallbacks; keep it responsive; no console errors.

## Stack / commands
- Vite + vanilla ESM. `three` (WebGL), `gsap` + ScrollTrigger, `lenis` (smooth scroll),
  self-hosted fonts (Newsreader / Geist / Geist Mono).
- `npm run dev` · `npm run build` · `npm run preview`
- Entry: `src/main.js`; styles `src/styles/{base,layout}.css`; hero shader
  `src/js/webgl/`; scroll `src/js/{smoothScroll,reveals,cases}.js`.

## Branch
Work on `claude/designer-portfolio-webgl-tykeba`. Commit + push when a change is done.
Placeholder content (names, copy, links, `hello@hassan.design`, device mockups) is
user-editable; real avatar → `public/avatar.jpg`.
