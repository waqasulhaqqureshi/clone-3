# What lives behind each door

The doorway used to open onto an empty coloured room. Now each door reveals that
skill's work inside the opening.

## Behaviour

| Action | Result |
|---|---|
| Click / tap / <kbd>Enter</kbd> the door leaf | Leaf swings to 76°, the room lights up, three work rows and a "Ask about the full case study" link land with a staggered 90 ms reveal starting after 0.42 s |
| Click **Close** inside the room | Door swings shut (the leaf is edge-on when open, so the room needed its own exit) |
| <kbd>Esc</kbd> | Closes the open door |
| Move the mouse away from the doorway | Closes after a 420 ms grace period, so clipping a corner on the way to the link doesn't slam it |
| Tap on touch | **Never** auto-closes (`pointerType` is ignored unless it is `mouse`) — a tap can't dismiss the door it just opened |
| While a door is open | The scroll-driven wall travel is pinned, so reading the work doesn't slide the door away. Unpins on close |

## The content

Per door, three rows of `{ title, meta }` plus the door's own title:

- **Web Development** — Portfolio, from sketch · Storefront rebuild · Booking flow
- **App Development** — Habit tracker (iOS · SwiftUI) · Expense splitter (React Native) · Onboarding revamp
- **UI/UX Design** — Fintech dashboard · Travel planner flows · Design system audit
- **Graphic Design** — Real-estate carousels · Luxury bottle campaign · Pitch deck series
- **Photography** — Architecture set · Concert night · Product on stone

These are **placeholder projects**. Swap the `inside` arrays in `DOOR_ITEMS`
(`src/App.tsx`) for real case studies, and the thumbnails in `.inside__thumb`
(currently CSS-drawn geometric motifs that pick up each door's `--spill` light)
for real images.

## Layout engineering

The opening is narrow — a doorway, not a page (4:9 unit, so the room is only 2.25×
its own width tall). Full-width thumbnails could never fit, so the interior is
compact rows: a small square plate, a title and a one-line meta, distributed with
`justify-content: space-evenly`.

Every size uses `cqi` with a **rem floor** (`clamp()`, `max()`), so the text stays
legible when short viewports scale the whole wall down. Verified fit:

```
unit=120px  content area=243px  required≈149px  slack= 94px
unit=140px  content area=286px  required≈149px  slack=138px
unit=180px  content area=373px  required≈149px  slack=224px
unit=220px  content area=456px  required≈157px  slack=299px
unit=280px  content area=581px  required≈183px  slack=398px
```

## Accessibility

- The leaf is the button (`aria-expanded`, `aria-controls="door-information"`,
  label flips between "Open…" / "Close the … door").
- Closed rooms are `aria-hidden` and their Close button and mailto link sit at
  `tabIndex={-1}` — no ghost stops in the tab order.
- The link is a real `mailto:` with a prefilled subject per discipline.
- Reduced motion: all of it still works, minus the swing and stagger (global
  `prefers-reduced-motion` block collapses the transitions).

## Verified

`npx tsc --noEmit` clean · `npx vite build` clean (277 kB / 84 kB gzip) ·
jsdom smoke: 5 doors, 3 rows each, open/close/Esc/auto-close all behave,
`aria-expanded` toggles, no ghost focus stops, **0 console errors**.
