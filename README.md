# ITZFIZZ — Scroll-driven 3D football

A responsive React + Vite landing page with a real Three.js football mesh and a GSAP ScrollTrigger timeline. The ball's horizontal travel and rotation are tied to scroll progress; scrolling back reverses the scene. The hero is the entire page: it pins during the scroll sequence, with small kinetic words revealing around the football and no separate second section.

## Requirements
- Node.js 18+ (Node 20+ recommended)
- npm

## Run locally
```bash
npm install
npm run dev
```
Open the local address Vite prints (usually `http://localhost:5173`).

## Production build
```bash
npm run build
npm run preview
```
The optimized site is generated in `dist/`.

## Deploy to Vercel for free
1. Create a GitHub repository and push the contents of this folder.
2. In Vercel, select **Add New → Project** and import the repository.
3. Vercel detects Vite. Set **Build Command** to `npm run build` and **Output Directory** to `dist`.
4. Select **Deploy**.

Or use the CLI:
```bash
npx vercel
```

## Interaction and implementation
- ScrollTrigger pins the hero for about 2.15 viewport-heights.
- GSAP scrub drives the ball wrapper's X translation and rotation, trail, headline reveal, staggered small-word typography, and stat cards. Reverse scrolling reverses all of them.
- Three.js renders a lit sphere with a custom canvas-generated stitched football panel texture; no external 3D asset is required.
- Renderer resizes with its container and is disposed on unmount. GSAP context cleanup removes its timeline and ScrollTrigger.
- `prefers-reduced-motion` disables the scroll choreography and presents a calm static layout.
- If WebGL is unavailable, a CSS fallback ball appears.

## Customize
- Change the statistics in the `metrics` array in `src/App.jsx`.
- Typography, colors, breakpoints, and layout are in `src/styles.css`.
