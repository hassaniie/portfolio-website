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
- **[@fontsource](https://fontsource.org/)** — self-hosted Fraunces (serif) + Space Grotesk (sans)

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
| Hero shader (domain-warped fbm noise, duotone, grain, vignette, mouse-reactive) | `src/js/webgl/HeroScene.js` + `src/js/webgl/shaders/*.glsl` |
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

- **Name / bio / nav / socials / email** — edit `index.html` (search for
  `Hassan` and `hello@hassan.design`).
- **Projects** — the list lives in `index.html` (`.work__item` entries); the
  matching preview palettes/labels are the `PROJECTS` array in
  `src/js/webgl/makeTexture.js`. Keep the two in the same order.
- **Palette / type / spacing** — CSS custom properties at the top of
  `src/styles/base.css` (`--accent`, `--bg`, `--ink`, type scale, etc.).
- **Real project imagery** — swap the procedural canvas in `makeTexture.js` for
  loaded textures if you'd rather show real screenshots.
