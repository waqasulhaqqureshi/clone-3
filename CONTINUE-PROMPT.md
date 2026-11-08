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

## Your task, in this order

1. Build the **"My story" timeline section**: sticky heading, scroll-linked odometer digits
   (0–9 rows scrubbing as you scroll), a vertical progress rail, and the five entries with the
   exact copy above. Reuse the existing `--e-soft` / `--e-line` easings and `.reveal` primitives.
   Must degrade to a plain readable list with `prefers-reduced-motion`.
2. Build the **footer** + consent bar (dismissed state persisted in `localStorage`,
   same storage-guard pattern as `rishi-mode`).
3. Add the **ability card overlay** last, only if the owner asks for it.
4. Keep divide-and-conquer: finish one section, `npx tsc --noEmit` + `npx vite build` +
   the jsdom smoke test, then ask the owner for approval before starting the next section.

## Rules

- Do not add dependencies unless truly unavoidable.
- Do not change the copy; match the reference word for word.
- Do not restructure the hero — it is signed off.
- Commit on `arena/f6a92c31-clone-3` only, and push to that branch.
- If the portrait photography is replaced, keep the 662:1600 transparent cut-out ratio and
  regenerate `rishi-portrait-color.webp` from the same source.
