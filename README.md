# Hassan — Designer Portfolio

A dark, editorial-minimal portfolio for a UX / product designer, built as an
awwwards-caliber experience: a full-screen WebGL shader hero, buttery smooth
scroll, masked text reveals, parallax, a custom blend-mode cursor, and a
selected-work list with WebGL displacement previews.

Everything is **self-contained** — self-hosted fonts and procedurally generated
project visuals — so nothing depends on external CDNs or image hosts.

## Stack

- **[Vite](https://vitejs.dev/)** — dev server + static build
- **[Three.js](https://threejs.org/)** — WebGL + custom GLSL shaders
- **[GSAP](https://gsap.com/) + ScrollTrigger** — animation & scroll orchestration
- **[Lenis](https://lenis.darkroom.engineering/)** — smooth scroll
- **[@fontsource](https://fontsource.org/)** — self-hosted Newsreader (serif headings,
  16pt optical size · 300), Instrument Sans (body), and Geist Mono (all-caps labels /
  the warm landing UI — a free stand-in for PolySans Mono)

## Run it

```bash
npm install
npm run dev          # http://localhost:5173
```

```bash
npm run build        # production build → dist/
npm run preview      # preview the production build
```

Deploy the `dist/` folder to any static host (Netlify, Vercel, GitHub Pages, …).

## Highlights

| Feature | Where |
| --- | --- |
| Warm hero gradient shader (dark→orange→cream, breathing glow, mouse warmth) | `src/js/webgl/HeroScene.js` + `src/js/webgl/shaders/*.glsl` |
| Live Lahore clock, profile card, mono nav/footer (Gorskikh-style landing) | `index.html`, `src/js/nav.js` |
| Selected-work WebGL preview (displacement wipe between projects) | `src/js/webgl/WorkPreview.js`, `src/js/work.js` |
| Procedural project thumbnails (no image files) | `src/js/webgl/makeTexture.js` |
| Smooth scroll + ScrollTrigger wiring | `src/js/smoothScroll.js` |
| Masked text reveals, parallax, counters, velocity marquee | `src/js/reveals.js`, `src/js/splitText.js` |
| Custom cursor + magnetic buttons | `src/js/cursor.js` |
| Counter preloader + curtain | `src/js/preloader.js` |

## Accessibility & performance

- Honors `prefers-reduced-motion`: the shader freezes to a static frame,
  reveals resolve to their visible state, and heavy motion is skipped.
- WebGL render loop pauses when the tab is hidden or the hero scrolls off-screen,
  and `devicePixelRatio` is capped at 2.
- Custom cursor is fine-pointer only; touch devices get native tap states.
- Semantic HTML, keyboard-focusable navigation, and visible focus styles.

## Making it yours

The content is placeholder and intentionally easy to swap:

- **Name / hero copy / nav / socials / email** — edit `index.html` (search for
  `Hassan Mushtaq`, the headline text, and `hello@hassan.design`).
- **Your photo** — drop a square image at **`public/avatar.jpg`**. It's used in
  both the nav thumbnail and the profile card, and each `<img>` falls back to a
  generated placeholder (`public/avatar.svg`) until the real file exists, so the
  build never breaks. (A different filename? update the two `src="./avatar.jpg"`
  references in `index.html`.)
- **Clock** — the nav clock shows live Lahore time; change the `timeZone`
  (`Asia/Karachi`) and the `(GMT+5)` label in `src/js/nav.js` / `index.html`.
- **Projects** — the list lives in `index.html` (`.work__item` entries); the
  matching preview palettes/labels are the `PROJECTS` array in
  `src/js/webgl/makeTexture.js`. Keep the two in the same order.
- **Palette / type / spacing** — CSS custom properties at the top of
  `src/styles/base.css` (`--warm` orange, `--hero-ink`, `--bg` navy, type scale, etc.).
- **Warm gradient** — tweak the `cream` / `orange` / `dark` stops and the glow in
  `src/js/webgl/shaders/hero.frag.glsl`.
