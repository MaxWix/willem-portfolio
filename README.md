# Willem — portfolio

Vite + React + React Router. Three pages: **work** (`/`, hero video), **about**, **contact**.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs dist/
```

## Editing content

All copy, links and media paths live in `src/content.js` — no component changes needed.
Later, this file is the one thing to swap for a CMS fetch.

## The home video

Put the files in `public/videos/` and set the paths in `content.js`:

- `concerts.mp4` — H.264 MP4, ideally under ~10 MB for the autoplaying hero (export ~1080p, 4–6 Mbps). Add a `.webm` if you want a smaller file.
- `concerts-poster.jpg` — a still frame shown while the video loads.

The video autoplays muted and loops (browsers only allow muted autoplay).
For large files, host on Vimeo/Mux/Cloudflare Stream and put that URL in `src`.

## Structure

```
src/
  content.js          site copy + media paths
  App.jsx             layout + routes
  components/Nav.jsx  work / about / contact tabs
  components/Wordmark.jsx  giant WILLEMWILLEM footer (SVG, always full width)
  pages/Work.jsx | About.jsx | Contact.jsx
  index.css           all styles; colors + fonts are CSS variables at the top
```

## Deploying

Any static host works (Netlify, Vercel, Cloudflare Pages). Routing is client-side, so
`public/_redirects` (Netlify/Cloudflare) and `vercel.json` send every path to `index.html`.
