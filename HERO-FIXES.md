# Hero section — 10 issues found and fixed

Reference: <https://therishithakor.com/home> · Checkout: `waqasulhaqqureshi/clone-3`

All assets were **missing from the repo** (every `/assets/*` request 404'd). That alone
accounted for the "missing image" symptom. Everything below is verified with a
TypeScript build, a production build, a jsdom runtime smoke test
(0 console errors, 5 doors, live calendar, live nav state) and a CSS box-model
geometry check at 7 viewport sizes.

## The ten

| # | Issue | What it looked like | Fix |
|---|-------|--------------------|-----|
| 1 | **No asset files at all** | Blank portrait area, fallback sans font, flat wall | Shipped `public/assets/`: Onest variable subsets (latin, latin-ext), cut-out portrait in mono **and** colour, plaster texture, SVG favicon |
| 2 | **Hero image missing / distorted** | Figure box was `801:1033` while the asset is `662:1600`, so `object-fit: contain` left a floating gap | Figure locked to the true asset ratio; `<img>` given `width`/`height` to stop CLS |
| 3 | **Colour-brush reveal never painted** | Portrait stayed flat grey until you happened to move the cursor | Self-drawing intro sweep on load, re-seeded after resize, plus graceful fallback when there is no fine pointer or reduced-motion is set |
| 4 | **Headline pushed off the fold** | A hard `7rem` top pad + `27rem` figure reserved space on short screens | Fluid `--hero-pad` / `--fig-h` clamps tied to `svh`; hero now fits 1024×640 and phones without clipping |
| 5 | **Portrait collided with the headline / hid under the header** | `44%` of the shell wide, top edge behind the fixed bar | Width capped at 42% of the shell, height now subtracts the full header pad (measured gap of 117–222 px at every desktop size) |
| 6 | **Flash of unstyled hero after the loader** | Curtain lifted before fonts/images were decoded, so text reflowed | Loader awaits `document.fonts.ready` + portrait decode (2.6 s hard cap) |
| 7 | **Dark mode unreachable on narrow screens** | Pull-cord anchor sat outside its own SVG viewBox on phones; the hit area also ate vertical swipes | Anchor clamped proportionally, touch no longer `preventDefault`s, plus click/keyboard activation |
| 8 | **Calendar role flip leaked timers** | Nested `setTimeout`s survived unmount and kept flipping in background tabs | Single tracked timer ref, cleared on unmount, paused on `visibilitychange` |
| 9 | **Header scrolled without throttling; nav lied** | Synchronous scroll handler; `Home` was always marked `aria-current="page"` | rAF-throttled scroll state; `IntersectionObserver` drives a live `aria-current` underline |
| 10 | **Tailwind preflight fought the design system** | Duplicate resets, ~40 kB of unused CSS in the single-file build | Framework import removed — every reset in `src/index.css` is now intentional |

## Polish added on top

- Studio floor shadow under the figure, fading in with the entrance.
- Stronger pointer parallax (±7 px / ±5 px, `will-change: transform`).
- Hover/entrance shadow under the loader pill stack (fixed `z-index` so it can't paint over the text).
- Dark-mode contrast pass on the mono portrait and monogram fallback.
- `fig__fallback` monogram if the portrait ever fails to decode, instead of an empty box.
- OG/Twitter meta, `color-scheme`, font + hero image preloads.
- `vite.config.ts` host allowlist so the Arena preview iframe is not rejected with a 403.

## How it was checked

```bash
npx tsc --noEmit        # clean
npx vite build          # clean, 5 assets emitted to dist/assets
# jsdom smoke test: site.is-ready, 5 doors, 1 active door, calendar cycling, 7 nav links,
#                   nav aria-current = Home, 0 console errors
# geometry model: no headline/portrait overlap from 1024x640 to 1920x1080
```

## Still to do (agreed with owner)

- **Ability card** (the `#card` overlay: win_bg / win_sub / plate / back + tilt) — deliberately skipped for now.
- Sections after the doors wall: **"My story" timeline** (5 roles) and the **footer** (Back to top, Click to enter, contact, consent bar).
- Portrait is a **stand-in** generated image; swap `public/assets/rishi-portrait*.webp` with the real photography when available (same 662:1600 ratio, transparent background).
