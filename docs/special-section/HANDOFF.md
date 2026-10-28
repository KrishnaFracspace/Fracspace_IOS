# Special Section — handoff (2026-10-27)

Read this first, then `BUILD_PLAN.md` in this folder. Don't read the whole project.

## Goal
Add the "Special Section · Stays (dark)" screens to the Fracspace app, opened from a **new centre tab** in the
bottom navigation. Design, style, screen transitions and every micro-animation must match the design exactly.

## Design source
- Local copies (use these): `docs/special-section/design/*.dc.html` — Hub, Stays, StayDetail, StayReview, IvaShopV2.
  Each is self-contained HTML/CSS + a `data-dc-script` state class. Grep it for `@keyframes`, `transition`,
  `cubic-bezier` and the state fields instead of reading it whole (they are 40–58 KB each).
- Original: claude.ai artifact "Fracspace Co-own Flow", row "Special Section · Stays (dark)",
  https://claude.ai/artifact/19LDo8V7tAH2Lz918HoM6X (private to marcom@fracspace.com unless shared).
  Only needed to look at it visually or if the design changes. Images in the files are `/_blob/<id>`
  URLs hosted by the artifact; in the app use mock/remote images instead.

## Status
| # | Section | State |
|---|---------|-------|
| 1 | Theme, shared animations, centre tab, `SpecialSectionStack`, Hub | **Done** — commit `0c2420c` on `feature/special-section` (not pushed) |
| 2 | Stays Listing (`Stays.dc.html`) | **Built** — `SpecialSection/Stays/`, awaiting simulator test |
| 3 | Stay Detail + booking sheet (`StayDetail.dc.html`) | **Built** — `SpecialSection/StayDetail/`, awaiting simulator test |
| 4 | Review Booking + success (`StayReview.dc.html`) | **Built** — `SpecialSection/StayReview/` (price breakdown → confirm → success, mock payment), awaiting simulator test |
| 5 | IVA Shop (`IvaShopV2.dc.html`) | **Built** — `SpecialSection/IvaShop/` (list → product → review → success, mock order), awaiting simulator test |

Empty worktrees from a stopped attempt exist under `.claude/worktrees/special-section-*` (branches
`claude/special-section-*`, no changes). Safe to delete:
`git worktree remove <path>` then `git branch -D <branch>`.

## What Section 1 built (reuse it)
- `Screen/Version2_O/SpecialSection/theme.js` — `colors`, `fonts`, `radii`, `spacing`, `type`, `ls()`.
- `Screen/Version2_O/SpecialSection/anim.js` — easings `E`, `kf` (CSS-keyframe → Reanimated), `useLoop`,
  `useToggle`, `usePressScale`/`PressScale`, `Sheen`, `Nudge`, `RevealScope`/`Reveal`, `enterUp`, `useReducedMotion`.
- `Screen/Navigation/SpecialSectionStack.js` — routes `Hub`, `Stays`, `StayDetail`, `StayReview`, `IvaShop`
  (last four point at `SpecialSection/Placeholder.js`) plus the existing Concert screens.
- `BottomNavigation.js` / `BottomNavi.js` — 5 tabs, raised centre button.
- Fonts Plus Jakarta Sans + Instrument Serif linked natively (needs a native rebuild, already done once).

## How we work (the user's preferences)
- **One section at a time.** Finish, let the user test, then start the next. Never run sections in parallel.
- One Claude session per section to keep token use low; read only that section's design file + `theme.js`/`anim.js`.
- **No simulator screenshots** — the user tests on the simulator themselves. Check with `npx eslint <files>`.
- Commit on `feature/special-section` (or a branch off it), never push, never touch `release/2.3.0` or `main`.
- Each section owns its folder `Screen/Version2_O/SpecialSection/<Section>/` with its own mock data, and only
  replaces its placeholder route in `SpecialSectionStack.js`. Don't change other screens.

## Next step
Section 2 — Stays Listing. Prompt to paste into a new session:

> Build Section 2 (Stays Listing) of `docs/special-section/BUILD_PLAN.md`; read `docs/special-section/HANDOFF.md`
> first and follow its "How we work". Design: `docs/special-section/design/Stays.dc.html` (grep it, don't read it
> whole). Reuse `theme.js`/`anim.js`. Explore/bookings tab switch, cards and every keyframe 1:1. Card tap →
> `StayDetail`, back → Hub. Files in `Screen/Version2_O/SpecialSection/Stays/`. eslint, commit on
> `feature/special-section`, no push, no screenshots.

Sections 3–5: same prompt with that section's name, design file and notes from `BUILD_PLAN.md`.
