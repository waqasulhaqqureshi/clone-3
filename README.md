# therishithakor.com — exact clone

This repository is a **faithful copy of the live site** `https://therishithakor.com`:
the same HTML, the same inline CSS, the same vanilla JS, the same images, videos and
webfonts — byte for byte, with only absolute `https://therishithakor.com/...` asset URLs
rewritten to root-relative paths so it runs from any host.

Nothing here is re-imagined, re-styled or re-created from screenshots. The pages are the
site's own source.

---

## Run it

```bash
npm run dev        # http://localhost:5173/  (serves /home)
npm run build      # copies the published files to dist/
```

No dependencies, no bundler, no framework — `server.mjs` is ~150 lines of Node that
reproduces the way the live site resolves URLs.

## Routes

| URL | File |
| --- | --- |
| `/` | `home.html` (redirects to `/home` on static hosts) |
| `/home` | `home.html` |
| `/web-developer` | `web-developer/index.html` |
| `/app-developer` | `app-developer/index.html` |
| `/ui-ux-designer` | `ui-ux-designer/index.html` |
| `/graphic-designer` | `graphic-designer/index.html` |
| `/photographer` | `photographer/index.html` |
| `/legal` | `legal/index.html` |

## Layout

```
home.html                     whole landing page (inline <style> + one <script type=module>)
web-developer/                index.html + project-2.mp4, project-4.mp4, posters
app-developer/                index.html + app-*.mp4, icons
ui-ux-designer/               index.html + ux-*.mp4, shots
graphic-designer/             index.html + ~40 print pieces (qod-*, him-*, kal-*, pos-*, wbt-*, logo-*)
photographer/                 index.html + photos.js gallery data
card/                         the "ability card" artwork (body, back, plate, sheen, win_bg, win_sub)
fonts/                        Onest variable woff2 (latin + latin-ext)
legal/                        index.html + licenses.txt
```

## What the site actually is

- **Type:** Onest (variable, weight 100–900, served locally from `fonts/`).
- **Palette:** `--background:#E8E4E0`, `--foreground:#1A1818`, `--muted:#857878`,
  `--line:#D5CDCA`, `--surface:#DED8D4`, with a full `html[data-mode="dark"]` theme
  stored in `localStorage` under `rishi-mode`.
- **Motion:** CSS transitions driven by custom easings (`--e-line`, `--e-spring`,
  `--e-soft`, `--e-snap`), a scroll-linked hero, flip-calendar skill list, draggable
  door wall, and IntersectionObserver reveals — all inside each page.
- **Layout:** `--container-shell:88rem`, `--radius-card:2rem`, `--bar-h:3.5rem`,
  `--gut-lg:5.5rem`.

## Deploying

Any static host works. `vercel.json` enables clean URLs (`/home` → `home.html`,
`/web-developer` → `web-developer/index.html`); Netlify does the same by default
(`netlify.toml` sets the publish directory).

## Provenance

The files were mirrored from the live origin with `wget --recursive --page-requisites`
(see `.github/workflows/grab-reference.yml`), the `<video>` files were pulled separately,
and every `https://therishithakor.com/` reference inside the HTML was rewritten to `/`.
No other edits were made.

`goal.webm` and `situation.avi` are the reference recordings used while checking the clone
against the live site; `tools/frames.sh` extracts frames from them at 30 fps.
