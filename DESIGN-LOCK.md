# DESIGN-LOCK — Hassan Mushtaq portfolio

**This file is the source of truth.** Read it before ANY design/UI/motion change and
obey it. If a request conflicts with a LOCKED item, stop and ask — don't silently
reinterpret. Anything marked EXPLORE is open to proposal.

---

## 0 · How we work (protocol to prevent drift)

1. **Match references exactly.** When a reference image/site is given, reproduce its
   structure, spacing, and detail closely — do NOT substitute my own invention.
   Call out anything I cannot match and why.
2. **Restate before building.** For a non-trivial request, mirror back the spec +
   the reference details I'm matching + my plan, in one short pass, BEFORE writing
   code. Let the user correct me before I build.
3. **Motion is a first-class deliverable, not polish.** Every section must earn its
   place with the motion pillars below. Never ship a section as static
   fade-and-reveal only.
4. **LOCKED vs EXPLORE.** LOCKED = do not reinvent or "improve" without being asked.
   EXPLORE = propose options.
5. **Priority order unless told otherwise:** motion & interaction → exact layout
   match → typographic/spacing polish.
6. **Verify against the reference's specific details**, not just "does it render".

---

## 1 · Motion pillars (LOCKED — always present)

The standout points of this site. Every build must keep/advance these:

- **WebGL (Three.js)** — the hero shader; extend to project media transitions and
  interactive/scroll-reactive shader state. Real shaders, not CSS fakes, where a
  standout moment is intended.
- **GSAP + ScrollTrigger** — scroll-driven orchestration: pinned sections, scrubbed
  timelines, reveals, horizontal moves.
- **Parallax** — layered depth on hero type/card, project mockups, section media.
- **Smooth + transitioning scroll (Lenis)** — buttery smooth scroll; deliberate
  transitions between sections (no hard seams), including the wave→data→interface
  "signal" idea.
- **Reduced-motion** — everything above must degrade gracefully under
  `prefers-reduced-motion`.

Stack already installed: `three`, `gsap`, `lenis`. Use them.

---

## 2 · Design tokens (LOCKED)

Colors (see `src/styles/base.css` `:root`):
- `--warm` **#ff6a2c** — primary orange (accents, hover, signal)
- `--warm-deep` #d24a12
- `--paper` #ffffff — light page background (hero resolves to pure white at bottom)
- `--ink-900` #17130e · `--ink-600` #625b52 · `--ink-400` #9b938a — text on light
- `--hair` rgba(23,19,14,.12) — hairlines
- hero dark warm top ≈ #241109 ; dark cinematic panel `--panel` #0a0c11

Type (LOCKED roles):
- **Headings/titles → Newsreader** (`--serif`), optical size 16, weight 300.
- **Labels / buttons / mono UI → Geist Mono** (`--mono`), 12px, letter-spacing -0.02em, UPPERCASE.
- **Body / descriptions → Geist** (`--sans`), letter-spacing ≈ -0.011em.
- Section titles are **left-aligned**.

Corners (LOCKED):
- Radii in **multiples of 4** only (4/8/12/16…), never pill-round for cards.
- **Corner smoothing** via `corner-shape: squircle` (Apple-like ~60%). Progressive
  enhancement — degrades to normal rounding on older browsers.

Spacing: fluid `clamp()` scale; small edge gutters (`--gutter`); generous whitespace
on section transitions (hero → work is intentionally airy).

---

## 3 · Locked components

### Primary button (LOCKED) — `.btn-play`
Underlined mono label + a play box on the right.
- **Default:** text **pure black** (Geist Mono) on light / **white** on dark;
  **light-gray underline** full width; **dark (near-black) play box** on the right
  with a white ▶ triangle.
- **Hover:** text → **primary orange**; underline → **primary orange, drawn
  progressively left→right (0→100%)**; play box → **primary orange**. Label also
  rolls vertically (kept).
- Play box: small, squircle, sized to align with the label cap-height.
- Used **everywhere** a primary action/CTA appears (email, Live website, Behance
  case study, view case study). **No bare arrow buttons.**

### Link / underline swap (LOCKED) — `.swap`
Same interaction as the button minus the play box: black/white label, light-gray
underline, hover = orange text + progressive orange underline + vertical roll.
Tight gap between text and underline.

### Cursor (LOCKED)
**Orange dot (8px)** + a **soft trailing mark** that eases behind it. **No white
ring/border.** Fine-pointer only.

### Chips / tags (LOCKED)
Geist Mono, UPPERCASE, 11px, light-gray fill, **no border stroke at all**, radius 8
+ squircle. Clean and minimal — no outline, no clutter.

### Nav (LOCKED)
Boxed H/M monogram + `Works` (left) · live **Lahore** clock w/ digit boxes (center)
· `Contact me` + avatar (right). Mono, 12px, -0.02em.

### Hero card (LOCKED)
Glassy card: avatar, `Hassan Mushtaq`, `Digital Product Designer`, `Available for
work` + pulse; H/M initials at the outer edges that slide **behind** the card on scroll.

### Project media (EXPLORE within constraints)
Light glossy device-mockup **placeholders** until real screenshots are supplied.
Real screenshots replace them in the same inset media frame.

### Projects section (LOCKED — matches the supplied reference)
**Header:** oversized orange Newsreader-300 `Projects` with a mono superscript count
`(4)`; mono orange `( 2023 — 2025 )` pushed to the far right; a small circled `©`
mark at the very end; an orange dot below; then a full-width hairline.

**Row:** `image left · info right`, **always** — never alternating.
- The thumbnail **never touches the page edges**: it sits inset inside its own
  rounded frame (radius 16 + squircle) with the row's padding on every side.
- Info column is three zones: **title top-left** with the year mono-orange pushed to
  the **far right of the row** · **description + tags indented to the column's
  horizontal centre**, vertically centred · **CTAs bottom-left**.
- A **hairline divider separates every project** from the next.
- No per-project `01 / 04` index — the count lives in the header.

---

## 4 · Section inventory & status

| Section | Layout status | Motion status |
| --- | --- | --- |
| Hero | LOCKED (warm gradient landing) | WebGL shader ✓ · can go further |
| Projects | LOCKED (image-left inset rows, hairline dividers, 3-zone info column) | scrubbed mockup parallax + tilt ✓ · copy-column lag ✓ · rule draw-in ✓ · **WebGL transition between projects still to come** |
| About / next sections | not built | — |

Content (names, descriptions, tags, links, `hello@hassan.design`) is placeholder and
user-editable. Real avatar goes at `public/avatar.jpg` (fallback `avatar.svg`).

---

## 5 · Verify checklist before "done"
- [ ] Matches the provided reference's structure & details
- [ ] Motion pillars present for the section (WebGL/GSAP/parallax/smooth transition)
- [ ] Primary button + cursor + underline behave exactly as locked above
- [ ] Corners: multiples of 4 + squircle
- [ ] Reduced-motion degrades cleanly
- [ ] No console errors; responsive
