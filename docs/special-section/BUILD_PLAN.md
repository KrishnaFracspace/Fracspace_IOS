# Special Section · Stays (dark) — build plan

Source design: artifact **Fracspace Co-own Flow** — https://claude.ai/artifact/19LDo8V7tAH2Lz918HoM6X
Row "Special Section · Stays (dark)". Each board is one interactive `.dc.html` file; fetch only the one
your section needs with the Artifact tool (`action: "read"`, `url` above, `path: "project/<file>"`), then grep it
for `@keyframes`, `transition`, `cubic-bezier`, and the `<script data-dc-script>` state — don't read the whole canvas.

## Flow

```
Bottom tab bar (new centre tab)
        │
        ▼
 02 Hub  (Hub.dc.html) ── Explore Categories: Stays · Shop · Concerts, Featured Stays, Iva Essentials, Concert Experiences
   ├─ Stays ───────► 03 Stays Listing (Stays.dc.html) — tabs: explore / bookings
   │                     └─► 04 Stay Detail (StayDetail.dc.html) — booking sheet (sheet: true/false)
   │                              └─► 04b Review Booking (StayReview.dc.html) → success → Home
   ├─ Shop ────────► 05 IVA Shop (IvaShopV2.dc.html) — list → product → review → success
   └─ Concerts ────► existing app screens in Screen/Version2_O/Concert (not redrawn here)
```

## Shared design language (from Hub.dc.html)

- Fonts: **Plus Jakarta Sans** (UI), **Instrument Serif** (display headings).
- Colours: ground `#0E0D0F`, ink-dark `#1A1611`, text cream `#F4EFE6`, gold `#F1DDBA` / `#E9B866`, warm highlight `#FFF1D6`, coral accents `#FF6B5A` / `#FF5A6E`, hairlines `rgba(255,255,255,.06)`.
- Easing (map to Reanimated `Easing.bezier`): springy pop `(.34,1.56,.64,1)`, smooth-out `(.16,1,.3,1)`, snap `(.7,0,.2,1)`, soft `(.2,.7,.3,1)`.
- Recurring micro-animations: `sheen` (gold shimmer sweep), `spin`, `sway`, `twinkle`; per-screen ones are listed in each section below.

## Project fit

- React Native 0.81, React Navigation 7 (bottom-tabs + native-stack), `react-native-reanimated` 3, gesture-handler, `react-native-svg`, `react-native-linear-gradient` — everything the design needs is already installed. Add no new animation library.
- Tabs: `Screen/Navigation/BottomNavigation.js` (4 `Tab.Screen`s) with custom bar `Screen/Navigation/BottomNavi.js` (`TAB_WIDTH = width / 4`, image icons from CloudFront).
- New code goes in `Screen/Version2_O/SpecialSection/` (same pattern as `Screen/Version2_O/Concert/`), with a `SpecialSectionStack.js` in `Screen/Navigation/`.

## Sections — one session each

Run 1 first. 2–5 only depend on 1 (they each own different files) and can run in parallel once 1 is merged.

| # | Section | Design file | Owns |
|---|---------|-------------|------|
| 1 | Foundation: theme, centre tab, stack, Hub | Hub.dc.html | `SpecialSection/theme.js`, `SpecialSection/anim.js`, `SpecialSection/Hub*.js`, `SpecialSectionStack.js`, edits to `BottomNavigation.js` + `BottomNavi.js` |
| 2 | Stays Listing | Stays.dc.html | `SpecialSection/Stays/*` (listing screen) |
| 3 | Stay Detail + booking sheet | StayDetail.dc.html | `SpecialSection/StayDetail/*` |
| 4 | Review Booking + success | StayReview.dc.html | `SpecialSection/StayReview/*` |
| 5 | IVA Shop (list → product → review → success) | IvaShopV2.dc.html | `SpecialSection/IvaShop/*` |

### 1 · Foundation
- `theme.js`: colours, fonts, radii, spacing above; `anim.js`: shared Reanimated helpers (easings, `usePressScale`, `Sheen`, staggered `FadeInUp` entry) that sessions 2–5 reuse.
- Add a 5th, **centre** tab to `BottomNavigation.js` → `SpecialSectionStack`; update `BottomNavi.js` to 5 slots (`width / 5`) with a raised centre button styled like the design; keep the other tabs' behaviour.
- `SpecialSectionStack` (native-stack, `headerShown: false`) registers Hub plus placeholder routes `Stays`, `StayDetail`, `StayReview`, `IvaShop` so later sessions only fill them in. Concerts → navigate to the existing Concert screens.
- Build Hub exactly per Hub.dc.html incl. `sheen`, `spin`, `sway` and the screen's entry/press animations. Load fonts if missing (check `react-native.config.js` assets).

### 2 · Stays Listing
explore/bookings tab switch (`tabExpCls`/`tabBkCls`) and keyframes `zoom twinkle thumb swipe spop2 spinstar shrink seek rv roll`. Card tap → `StayDetail`; back → Hub.

### 3 · Stay Detail
Hero/sections, amenities icons (`wifi steam spinsun travel`), segmented controls (`segin selpop`), booking bottom sheet (`sheet` state; use gesture-handler + Reanimated). CTA → `StayReview`.

### 4 · Review Booking
Price breakdown, confirm, success celebration (`tkF tkB sstDrop sspk sring spk sad saIn`). Done → Home tab. Reuse existing payment flow (`Screen/Version2_O/PaymentSummaryScreen.js` / `PaidSuccessfully.js`) for real payments.

### 5 · IVA Shop
Internal list → product → review → success flow (`view` state), keyframes `vcIn up twinkle trk travel tl swing svin spin`.

## Rules for every session
- Read only: this file, your one design file (via Artifact read + grep), `theme.js`/`anim.js`, and the files you own.
- Match the design 1:1: spacing, radii, colours, copy, easing curves and durations from the CSS.
- Use Reanimated (UI thread) for all animation; respect reduced-motion (`useReducedMotion`).
- Mock data in `SpecialSection/data.js` until APIs are wired; don't change other screens.
- Done = screen reachable from the centre tab, animations match, runs on iOS simulator with no warnings.
