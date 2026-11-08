# "My story" + footer — what was built

Reference: <https://therishithakor.com/home> · branch `arena/f6a92c31-clone-3`

Copy is verbatim from the reference. No new dependencies.

## My story (`#story`)

- **Sticky heading** — eyebrow `◆ My story`, H2 "Let's go back in time.", pinned under the
  fixed header while the timeline scrolls beneath it.
- **Scroll-scrubbed odometer** — four 0–9 ladders, one per digit, each translated by its own
  digit with a 70 ms per-wheel stagger, easing on `--e-soft`. The reading is driven by the
  section's scroll progress (`rAF`-throttled), so it climbs as you travel the story.
  `prefers-reduced-motion` pins it to `2026` with no wheels moving.
- **Progress rail** — sticky 1 px track whose fill scales with the active chapter, plus an
  `01 / 05` counter. Each chapter's numbered disc is a real button (`aria-label` describes the
  chapter) that scrolls that entry to centre.
- **Five chapters, verbatim** — Oct 2026–Now (Independent freelancer) · Jul–Sep 2026
  (Graphic designer, Himspring LLC) · Jan–Jun 2026 (UI/UX designer, Quicko Pvt Ltd, Ahmedabad) ·
  Jan–May 2025 (Graphic designer intern, WBT, Delhi · Remote) · Jul 2022–May 2026
  (B.Tech Computer Science, PDEU), two bullets each.
- **Reading focus** — an `IntersectionObserver` (`-45% / -45%` band) marks the chapter at the
  centre of the viewport: it lifts to full opacity, gains a hairline card, its disc inverts.
  Other chapters sit at 45 % opacity on ≥768 px and stay readable on mobile.

## Footer (`#contact`)

- `↑ Back to top` (scrolls to top) and a `Click to enter` mailto pill with an arrow badge.
- Oversized `Rishi.` wordmark with the accent dot, and the discipline line.
- Baseline: `Local time — 10:40am` (live, 15 s tick), `Independent freelancer · Remote-first,
  worldwide`, and `Hire me →`.

## Analytics consent

- Docked card: "May I count your visit with Google Analytics? It sets cookies. **Details**".
- **Details** expands an honest explanation inline instead of linking off-site.
- `No thanks` / `Allow` persist to `localStorage["rishi-consent"]`, so the choice survives a
  reload and the bar never returns. Unreadable storage fails safe.
- Not interactive until its entrance animation finishes (`pointer-events: none` until `.in`),
  so a stray tap can't consent on your behalf.

## Nav

`Story` (`#story`) and `Contact` (`#contact`) join the header nav and menu, so the live
`aria-current` underline now tracks them.

## Verified

```bash
npx tsc --noEmit   # clean
npx vite build     # clean, 271 kB single file / 82 kB gzip
```

jsdom runtime smoke test: 5 entries, 1 active, odometer 4 wheels × 0–9 ladders, rail `01 / 05`,
footer links + Back-to-top, consent bar → **Allow** removes it and writes `rishi-consent=allowed`,
8 nav targets, **0 console errors**.
