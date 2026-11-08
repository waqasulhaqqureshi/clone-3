# Continuation prompt — paste this into a fresh session

You are continuing work on the repo `waqasulhaqqureshi/clone-3`, branch
`arena/f6a92c31-clone-3`. We are cloning <https://therishithakor.com/home> **exactly** —
same copy, same spacing, same motion. No redesigns, no new sections, no personal flavour.

## State of the build (already done, do not redo)

- Vite + React 19 + TypeScript, single-file production build (`npm run dev` / `npm run build`).
- All styling is hand-written in `src/index.css` (no Tailwind import — it was removed on purpose).
  Everything is driven by CSS custom properties at `:root` / `html[data-mode="dark"]`.
- `src/App.tsx` contains: `IntroLoader` (colour pill stack + counter), `Header` (nav, clock chip,
  menu), `MenuOverlay`, `PullCord` (drag = dark-mode switch), the hero (headline + flip `calendar`
  role card + CTAs + baseline bar), and `WorkDoors` (five door panels with a pinned horizontal
  wall on desktop, scroll-snap carousel on touch).
- `public/assets/` now exists with: `onest-latin.woff2`, `onest-latin-ext.woff2`,
  `rishi-portrait.webp` (mono), `rishi-portrait-color.webp` (colour, for the cursor brush reveal),
  `plaster-texture.webp`. Portrait is a stand-in at 662:1600 with a transparent background.
- Hero defects are fixed; see `HERO-FIXES.md` for the full list (10 issues).
- Verification available in-sandbox: `npx tsc --noEmit`, `npx vite build`, and a jsdom smoke test
  (there is **no headless Chrome** in this sandbox — do not waste turns installing one).
- `vite.config.ts` has `allowedHosts: [".e2b.app", ...]` so the Arena live preview works.

## Reference site facts you can rely on (already scraped)

- Nav: Home, Web Development, App Development, UI/UX Design, Graphic Design, Photography, Contact.
- Hero: eyebrow "Independent Freelancer"; H1 "Hi, I'm Rishi." / "I am a" + flipping calendar
  (Web Developer → App Developer → UI/UX Designer → Graphic Designer → Photographer, "01 / 05");
  CTAs "Hire me" (mailto:rishithakor218@gmail.com) and "See my work"; baseline bar
  "Available for work · Remote-first, worldwide · Scroll to explore ↓".
- Fixed top-right: local-time chip and a **pull cord** that toggles dark mode (prototype exists).
- "My ability card" button sits under the hero content; it opens a card overlay
  (`/card/win_bg.webp`, `win_sub.webp`, `plate.webp`, `back.webp`, tilt + tap-to-flip).
  **Deliberately deferred — ignore it unless asked.**
- Doors section: heading "Magic happens behind the doors", hint "Swipe along the wall",
  five gold plates, footer with `01 — 05` counter + service list.
- After the doors: **"My story"** — heading "Let's go back in time." with four odometer digit rows,
  then a 5-entry timeline: (1) Oct 2026–Now, Independent freelancer, "Working for myself,
  remote-first"; (2) Jul–Sep 2026, Graphic designer, Himspring LLC; (3) Jan–Jun 2026, UI/UX
  designer, Quicko Pvt Ltd, Ahmedabad; (4) Jan–May 2025, Graphic designer intern, WBT Delhi
  (remote); (5) Jul 2022–May 2026, B.Tech Computer Science, PDEU. Each has two bullet points.
- Footer: "Back to top", "Click to enter", "Rishi", "Close", local time + "Hire me →",
  and a Google Analytics consent bar ("May I count your visit with Google Analytics?",
  No thanks / Allow).

## Done since the last handoff

- **"My story"** (`#story`) — sticky heading, four scroll-scrubbed odometer wheels, sticky
  progress rail with an `NN / 05` counter, the five chapters verbatim, and centre-of-viewport
  reading focus. See `SECTION-STORY-FOOTER.md`.
- **Footer** (`#contact`) — back to top, click-to-enter pill, oversized `Rishi.` wordmark,
  live local time, hire link.
- **Consent bar** — inline details, persisted choice in `localStorage["rishi-consent"]`.
- `formatClock` / `readTheme` / `readStored` / `writeStored` now live in `src/utils/site.ts`.
  `STORY_ITEMS` at the top of `src/App.tsx` holds the timeline copy.

- **Doors** — opening a door now reveals that skill's three work rows inside the room
  (see `SECTION-DOORS-WORK.md`). The projects are **placeholders**; replace the
  `inside` arrays in `DOOR_ITEMS` and the CSS-drawn `.inside__thumb` motifs with real work.

## Your task, in this order

1. Add the **ability card overlay** (`#card`): the trigger under the hero content, a
   `win_bg` / `win_sub` / `plate` / `back` layered card that tilts with the pointer and flips on
   tap, with the web 90 / UI-UX 85 / graphic 85 / app 75 readings. Assets must be generated or
   drawn in CSS/SVG — the originals are not downloadable from this sandbox.
2. Then a final fidelity pass against the reference: hero → doors → story → footer, at
   390 / 768 / 1024 / 1440 / 1920, light and dark.
3. Keep divide-and-conquer: finish one section, `npx tsc --noEmit` + `npx vite build` +
   the jsdom smoke test in `/tmp/tools/smoke3.mjs`, then ask the owner for approval.

## Rules

- Do not add dependencies unless truly unavoidable.
- Do not change the copy; match the reference word for word.
- Do not restructure the hero — it is signed off.
- Commit on `arena/f6a92c31-clone-3` only, and push to that branch.
- If the portrait photography is replaced, keep the 662:1600 transparent cut-out ratio and
  regenerate `rishi-portrait-color.webp` from the same source.
