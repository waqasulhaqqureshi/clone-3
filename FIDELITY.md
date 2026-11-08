# clone-3 — rebuild against the reference recording

Target: <https://therishithakor.com> · Branch: `arena/877eb4ee-clone-3`

The truth for this build is **`goal.webm`** (2:53, 1918×994, the destination) with
**`situation.avi`** (0:18) as the "before". Every frame was pulled at 30 fps
(`tools/frames.sh`) — 5,216 goal frames and 560 situation frames — and the layout,
palette, type sizes and motion were measured off them with a numeric pass rather
than guessed.

## What the measurements said

| Element | Reference | Implementation |
|---|---|---|
| Page background | `#EDE9E4` → `#E7E4DF` | `--bg` |
| Card / panel | `#F2EFEA` | `--panel` |
| Ink | `#191716` | `--ink` |
| Muted body | `#6F6862` | `--muted` |
| Dark block | `#1B1918` | `--dark` |
| Container | 140 px side padding at 1918 (1638 content) | `--pad`, `--maxw` |
| Hero H1 | 531 px wide for "Hi, I'm Rishi." → ~90 px | `--h1: clamp(40px,4.7vw,90px)` |
| Calendar face | 703 px for "Graphic Designer" → ~84–88 px | 4.6vw |
| Doors heading | 1,481 px for "Magic happens behind the doors" → ~94 px | 4.9vw |
| Door leaf | 176 × 452, arch radius 88, pitch 424, first leaf at x 233 | `.door` |
| Wall / floor line | leaf bottom 846, skirting 816, floor 894 | `.doors__floor` |
| Story H2 | 823 px for "Let's go back in time." → ~86 px | 4.5vw |
| Nav | 7 items, 17 px, 34 px gap, clock pill 430 × 38 | `.header` |
| Pull cord | x ≈ 1805 (113 px from the right), knob centre y ≈ 440 | `.cord` |

The face is a wide neo-grotesque (single-storey `g`, spurless `G`, horizontal
terminals). It is not on any reachable host, so the closest free match — **Inter
variable, weight ~620, tracking −0.035em** — is self-hosted at
`public/assets/inter-latin.woff2`, and every display size is calibrated to the
reference's measured ink width rather than to a round number.

## Pages

* `/home` — hero (flip calendar + per-skill photograph + ability pill), the
  "Magic happens behind the doors" wall, "Let's go back in time." story, dark CTA.
* `/work`, `/my-story`, `/contact` — the same document, landed on that section
  (which is what the reference URL bar shows during the recording).
* `/web-developer`, `/app-developer`, `/ui-ux-designer` — hero + project cards.
* `/graphic-designer` — five brand lines of hung prints + a lightbox.
* `/photographer` — the drag-any-direction photo plane.
* `/legal` — consent detail page.

Copy is verbatim, pulled from the live DOM of every route.

## Imagery

`tools/extract_assets.py` cuts the real artwork out of the frames, because the
sandbox can only reach github / npm / pypi and not the site's own CDN:

* the five hero photographs (one per skill, greyscale) — the baked "My ability
  card" pill and the candidate cord are removed with a mask inpaint so the UI can
  be laid over the photo;
* four door leaves + their plaster surrounds, arch-masked;
* plaster and skirting textures, the calendar's spiral binding;
* the thirty-plus graphic-design prints, segmented out of the brand lines.

The service-page media in the reference are screen **recordings**; those files
cannot be reconstructed from a video, so each is drawn as a miniature of the real
interface in `src/components/MockScreen.tsx` — same palette, same composition,
vector-crisp at any size. Swap `variant:` in `src/data/site.ts` for real stills or
`.mp4`s when the originals are available.

## Motion

Flip calendar (3.2 s cycle, 3D card flip, portrait cross-fade) · pinned horizontal
door wall with drag + swipe · leaf swings 78° on its hinge and the room panel
rises · scroll-scrubbed odometer with per-digit wheels · per-chapter reading focus ·
route cross-fade (the reference flashes a light curtain between pages) · pull cord
drag → lights out · card overlay with pointer tilt and tap-to-flip · lightboxes ·
consent bar.

Reduced-motion collapses every transition and pins the odometer.

## Checks run

```bash
npx tsc --noEmit     # clean
npx vite build       # clean, single file 301 kB / 89 kB gzip
```

No headless browser exists in this sandbox (the npm Chromium build is missing
`libnspr4`), so the visual pass is done against the frames numerically + by
reading the rendered CSS geometry. That is the one open item: **a screenshot diff
at 1918×904** should be the first thing run on a machine with Chrome.
