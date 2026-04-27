# Vibe reference UI

Minimal browser UI for [`../docs/animation-reference/tone-vibes.json`](../docs/animation-reference/tone-vibes.json): search by mood or phrase, see **patterns**, **trigger phrases**, and **external doc links** (Motion, Magic UI, React Bits, Kokonut, CuiCui, anime.js, GSAP, Theatre).

## Run locally

```bash
cd vibe-reference-ui
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

The app imports the JSON from the parent workspace (`docs/animation-reference/`). Keep that path when you move folders.

## Deploy

Static `dist/` works on Vercel, Netlify, or GitHub Pages (set publish directory to `dist`).

## New GitHub repo

```bash
cd vibe-reference-ui
git init
git add .
git commit -m "Add minimal vibe-to-refs browser UI"
gh repo create vibe-reference-ui --public --source=. --remote=origin --push
```

Or add your remote manually: `git remote add origin https://github.com/<you>/<repo>.git` then `git push -u origin main`.
