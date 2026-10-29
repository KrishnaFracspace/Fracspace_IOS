# Special Section · performance pass

One section per session: 1 Hub, 2 Stays, 3 StayDetail, 4 StayReview, 5 IvaShop.
Each session audits the code, measures on Android and iOS, reports a table,
then applies only the fixes the user approves (one commit per group) and
re-measures. Animations and design must stay identical.

## Summary (all five sections)

Dev builds on Android CPH2643 and the iPhone 16 Pro simulator; compare
before/after only. Shared root cause: Reanimated 3.19 on Fabric commits the
shadow tree for every animated frame, so the fixes cut loops that ran unseen,
mounted less up front, and moved JS-timer motion to the UI thread.

| Section | Android before → after | iOS sim before → after |
|---|---|---|
| 1 Hub | idle p50 61 → 48 ms (74 → 49 % janky); re-enter 1086 → ~650 ms | idle main 42 → 17 % |
| 2 Stays | idle p50 38–65 → 15–21 ms (61–68 → 6–9 % janky); JS 6–10 → 35–47 fps; Explore mount 1.3–1.5 → ~0.42 s | idle main 38 → 28 %, JS 4.1 → 0.58 s / 15 s |
| 3 Stay Detail | entry ~1.55 → ~0.95 s; mid-page idle 80–85 → 43–45 % janky | idle main 4.78 → 4.30 s / 15 s; scroll 58 → 45 % |
| 4 Review Booking | entry ~0.88 → ~0.53 s; calendar tap 35 → 0–2 day renders | Pay flow pre-mount 0.37 s JS inside the spinner (no baseline) |
| 5 IVA Shop | entry ~0.62 → ~0.35 s; list idle 31 → 19 ms, JS 31 → 59 fps | list idle main 30 → 26 % |

No leak found in any section (Android leave/enter cycles; views flat).

Not measured anywhere:
- **Release builds**: every number is dev (§6). Absolute frame rate, jank %,
  memory and load times need `--mode release` / the iOS Release scheme.
- **iOS screen timings** (entry, tab switch, view switch, sheets): the probes
  log to Metro only, so iOS has Time Profiler CPU shares, not ms.
- **iOS leak cycles**: Android only (IVA Shop: one iOS pass, footprint only).
- **Real iOS device**: simulator CPU only.
- Left as is by choice: Review's ~0.6 s spinner freeze on Android (§4 B), SVG
  prop draws (§4 D, §5 D), the 104–242 ms frame on each view mount.
- App-wide lever not taken: Reanimated 4 (synchronous UI-prop updates).

## Method

### 0. Read first
- `git log --oneline -- Screen/Version2_O/SpecialSection/<Section>` and the
  diffs of earlier perf commits (`12361a3`, `20bed36`) so work isn't redone.
- `grep -n "import" <Section>.js` to list what the screen pulls in; read only
  those files.

### 1. Code audit checklist
- **Loops** (`useLoop`, `withRepeat`, `Sheen`, `Nudge`, `GlowDot`, …): do they run
  while invisible? Check hidden-but-mounted children (opacity 0 slides/copies,
  hidden bars), sections scrolled off-screen (wrap in `ViewportGate`), and a
  blurred tab (`LoopGate active={isFocused}`).
- **Cleanup**: every `setInterval`/`setTimeout`/`addListener`/`requestAnimationFrame`
  returns its cleanup.
- **JS timers driving state** (`setInterval` → `setState` for progress bars,
  clocks): move the motion to a shared value on the UI thread and wake JS only
  when visible text changes. A 100 ms tick held Stays' JS thread at 6–10 fps.
- **Re-renders**: context values built inline (new object each render), inline
  handlers into memoised children, state that lives higher than it is used.
- **Images**: pixel size vs displayed size × 3 (decoded = w × h × 4 bytes).
- **Lists**: horizontal rails are `ScrollView`s of a few items (fine); anything
  long should be a `FlatList`.
- **Mount**: work done before the first frame (big SVGs, many loops starting).
  Quick test: temporarily render `null` for the sections below the fold and
  compare the mount time; if it drops a lot, mount them a frame after first paint.
- **Horizontal rails**: cards scrolled out of a rail still loop; `RailGate`
  (anim.js) is ViewportGate for a rail item.
- **Android**: `overflow:hidden` + `borderRadius` on animated views (clip cost),
  `elevation` on moving views, full-screen layers (`renderToHardwareTextureAndroid`).
- **iOS**: shadows on views without an opaque background (no automatic shadow
  path), blur views.

### 2. Why every animated view is expensive here (read this)
Reanimated **3.19 on the New Architecture** applies each animated frame by
committing the React shadow tree (clone + Yoga layout + mount). Time Profiler on
Hub: 77 % of the iOS main thread is `ShadowTree::commit` driven by
`NodesManager::onAnimationFrame`; Android `framestats` shows the same as a 25 ms
"animation" phase. Cost ≈ (animated views updated this frame) × (tree size). So
the levers are: fewer loops running at once, and fewer mounted views.
A structural fix is Reanimated 4's synchronous UI-prop updates (bypass the
commit for transform/opacity); that is an app-wide upgrade, not a per-screen fix.

### 3. Dev-only probes (`SpecialSection/perf.js`, all no-ops in release)
- `useRenderCount(name)` in each section component.
- `useFirstFrame(name)` in the screen: first render → first frame, and tap → frame.
- `useJsFps(name, isFocused)`: every 5 s logs JS fps and the render counts.
- `markTap(name)` where the user taps to open the screen (Hub: `BottomNavi.goTo`).
- Output: `adb logcat | grep ssperf`. iOS: console goes to Metro / React Native
  DevTools only (not the simulator's os_log), so use Time Profiler there.
- Which thread is the bottleneck: Hub was main-thread bound (25 ms animation
  phase); Stays was JS bound (9 ms animation phase but 6–10 JS fps). Check both
  before choosing fixes.
- Fast Refresh can stop the probe logs until the screen is re-entered: after an
  edit, reload (`r` in Metro) and re-enter before measuring.
- JS fps follows the main thread (rAF is driven by the UI frame clock), so a low
  JS fps with few renders means the main thread is the bottleneck.
- To price one part of a screen, swap that file for its old version in place
  (`git show <rev>:<file> > <file>`, Fast Refresh, measure, `git checkout <file>`)
  at the same scroll. Rendering `null` for a section moves everything under it,
  so the same swipes land somewhere else and the numbers don't compare.

### 4. Android (`docs/special-section/perf-android.sh`)
App open on the screen under test, signed in, Metro running:

```bash
docs/special-section/perf-android.sh hub-before 10 540,2190 146,2253
```

Args: label, leave/enter cycles, enter target, leave target. Targets are text /
content-desc, `x,y` px, or `BACK`. **uiautomator cannot dump a screen whose
animations never stop** (every Special Section screen, and any tab showing the
spinning centre button), so use `x,y`. On the test phone (CPH2643, 1080×2412,
density 3): centre tab `540,2190` from the light bar, Home `146,2253` on the dark pill.
The script streams logcat to a file (the ring buffer rotates probe lines out
during a long run).

Finding a tap position without a screen dump: record the touch panel while the
user taps the target once, then divide by the panel/screen ratio (8 on CPH2643):

```bash
adb shell getevent -pl | grep -B8 POSITION_X     # which /dev/input/eventN is the touch panel
adb shell getevent -lt /dev/input/event2 > touch.log   # run in background; stop with adb shell pkill getevent
```

A pushed screen's entry tap depends on the Hub's scroll: record it again after
every reload, and make sure a missed tap can't turn the next `BACK` into leaving
the app (check `dumpsys activity activities | grep ResumedActivity`).

It records `gfxinfo` idle 10 s, `gfxinfo` over 6 swipes, and `meminfo` before and
after the cycles. Output: `docs/special-section/runs/<label>-android.txt` (not committed).

Frame phase split (which part of the main thread is slow):

```bash
adb shell dumpsys gfxinfo com.fracspace reset; sleep 6; adb shell dumpsys gfxinfo com.fracspace framestats
```

For the leak check (and entry timings) prefer `perf-cycles.sh`: it confirms
each entry in logcat and stops on a missed tap, where `perf-android.sh` carries
on tapping whatever screen it ended up on (twice it left the app on Stay Detail):

```bash
docs/special-section/perf-cycles.sh sd-after 10 639,1580 StayDetail
```

Android SVG: animating an SVG prop (`useAnimatedProps` on a `Path`/`Circle`)
redraws that whole `Svg` to a bitmap and re-uploads it every frame, which shows
as "Slow bitmap uploads" in `gfxinfo` while idle. A fade or a move belongs on an
`Animated.View` around a small `Svg` of just that shape (Stay Detail amenities).

Then median of `PerformTraversalsStart − AnimationStart` (animation),
`DrawStart − PerformTraversalsStart` (layout), `SyncQueued − DrawStart` (draw record),
`FrameCompleted − IssueDrawCommandsStart` (GPU).

A one-shot sequence (Review's Pay → confirm → success) is longer than the 120
frames `framestats` keeps: dump it every ~1.8 s during the sequence, dedupe rows
by `IntendedVsync` and list the frames over 100 ms with their time from the tap.
That shows *where* a hitch lands; mount times alone don't (a 0.6 s JS mount
can cost a 120 ms UI frame or a 600 ms one depending on what else commits).

A pushed screen's `BackHandler` must check `isFocused`: the screen below stays
mounted, and its handler ran before Review's own back (Stay Detail's sheet
handler swallowed BACK on Review, which also broke the scripted cycles).

### 5. iOS (simulator)
```bash
xcrun simctl list devices booted
ps -axo pid,command | grep -i fracspace.app      # host pid of the sim app
xcrun xctrace record --device <SIM-UDID> --template 'Time Profiler' --attach <pid> --time-limit 15s --output hub.trace
xcrun xctrace export --input hub.trace --xpath '/trace-toc/run[@number="1"]/data/table[@schema="time-profile"]' > tp.xml
```
Summarise the main-thread samples by frame name (`reanimated::`, `ShadowTree::commit`,
`yoga::`, `hermes::vm`, …). `--device` is required or xctrace can't find the pid.
Use the `Leaks` / `Allocations` templates the same way for memory.

### 6. Dev vs release
Dev builds run worklets and React unoptimised, keep dev warnings, and Metro
adds overhead: absolute ms and MB are pessimistic (often 2–4×). Use dev numbers
only to compare before/after on the same device. For absolute frame rate, jank %,
memory and load time, re-run the same script on a release build
(`npx react-native run-android --mode release`; iOS Release scheme).
Simulator CPU ≠ device CPU: iOS timings are relative only.

## 1 · Hub results

Device: Android CPH2643 (dev build, Metro), iOS iPhone 16 Pro simulator (dev).

### Baseline (before fixes)
| Metric | Android | iOS sim |
|---|---|---|
| Idle frames p50 / p90 | 61 / 73 ms, 74 % janky | — |
| Scroll frames p50 / p95 / p99 | 65 / 150 / 300 ms, 78 % janky | — |
| Main-thread split (idle) | animation 25 ms, layout 0.2, draw 0.2, GPU 14 | 42 % main CPU; 77 % of it `ShadowTree::commit` |
| JS thread | 18–19 fps (follows main thread) | 2 % CPU |
| Re-enter Hub (tap → frame) | 1086 ms | — |
| Renders per 5 s idle | Hub 1, HubHero 1, Reveal 7, ViewportGate 4, CartBar 1 | — |
| Memory, 10 leave/enter cycles | PSS 1004 → 974 MB, native 202 → 194 MB: **no leak** | — |
| Slow bitmap uploads (idle 10 s) | 55 (source not yet identified) | — |

### Findings
| # | Problem | Platform | Where | Sev | Effect | Fix (design unchanged) |
|---|---|---|---|---|---|---|
| 1 | 3 hidden hero copies keep GlowDot + Nudge loops running (6 of 8 hero loops never seen) | both | `HubHero.js:220` | Med | ~6 of ~30 per-frame commits at top | run a copy's loops only while shown (+300 ms fade-out) |
| 2 | Hero not in a `ViewportGate`; its loops run when scrolled past | both | `Hub.js:172` | Med | all hero loops while reading lower sections | wrap hero in `ViewportGate` |
| 3 | CartBar's Nudge loops while the bar is hidden (empty bag) | both | `HubRails.js:328` | Low–Med | 1 commit/frame always | loop only while shown (+fade-out) |
| 4 | `RevealScope` value is a new object every Hub render → all Reveal + ViewportGate re-render (11 per slide change) | both | `anim.js:255` | Low | JS work every 5.2 s | `useMemo` the value |
| 5 | Hero re-renders all 4 slides/copies/segs per slide; inline handlers | both | `HubHero.js:222,232` | Low | ~60 renders per 5.2 s | memo `Slide`/`Copy`/`Seg`, stable handlers |
| 6 | Re-entering Hub takes ~1.1 s tap → frame: focus flips `LoopGate` (all loops restart at once) and the tab bar swaps light → dark, mounting `NavCore` (72-path SVG) + 3 `Word` loops | both | `Hub.js:162`, `BottomNavi.js:103`, `HubNavBar.js:50` | Med | 1086 ms (dev) | rasterise the static ring (`renderToHardwareTextureAndroid`/`shouldRasterizeIOS`); measure again before anything bigger |
| 7 | Photos up to 1200×1140 for ~260 pt cards | both | `assets/*.jpg` | Low | ~25 MB decoded | resize to 3× display size |
| 8 | Reanimated 3 commits the shadow tree per animated frame | both | app-wide | High | 77 % of iOS main thread, 25 ms/frame Android | Reanimated 4 sync UI props (separate task) |

Checked, no problem: slide timer, portal focus listener and every loop clean up on
blur/unmount; Hub loops pause on blur; no leak across 10 cycles.

### After fixes A–C (`be965b9`, `de57903`, `4bb47ba`), same devices, dev build
| Metric | Before | After |
|---|---|---|
| Android idle frames p50 / p90, janky | 61 / 73 ms, 74 % | 48 / 61 ms, 49 % |
| Android scroll frames p50 / p99, janky | 73 / 150 ms, 93 % | 61 / 250 ms, 74 % |
| Android main-thread split (idle, median) | animation 25.2, GPU 13.6, total 62.4 ms | animation 21.7, GPU 10.1, total 50.3 ms |
| Android slow bitmap uploads (idle 10 s) | 55 | 15 |
| iOS sim main thread busy (15 s idle) | 6.2 s (42 %) | 2.5 s (17 %) |
| Renders per slide change | Hub, HubHero, 7 Reveal, 4 ViewportGate, CartBar | Hub, HubHero, 5 ViewportGate, CartBar (Reveal 0) |
| Re-enter Hub tap → frame | 1086 ms | 1033–1189 ms (unchanged) |
| Memory, 10 leave/enter cycles (PSS / native heap) | 1004 → 974 / 202 → 194 MB | 961 → 980 / 238 → 239 MB |

Notes: scroll p99 swings 150–300 ms between identical runs, so treat it as noise.
PSS moves ±30 MB run to run while native heap holds steady: no leak. Re-entry is
still ~1.1 s. Next to try: a Time Profiler capture of the tab switch (light → dark
bar swap, Hub re-render and every loop restarting at once). Not done in this pass.

### Re-entry breakdown (Home → centre tab, Android, dev, `sinceTap` probes)
| Step | ms since tap |
|---|---|
| tab bar renders dark bar | 35 |
| dark bar mounted (bar swap + screen switch committed) | ~330 (~185 without `NavCore`: its 72-path SVG costs ~145) |
| Hub re-renders with `isFocused` (navigation focus event) | ~510 |
| Hub focus effects start (LoopGate flip re-rendered every `useLoop` user) | ~770 |
| first frame | ~790 |

Proposed: R1 draw the static conic ring as one pre-rendered PNG instead of 72
`<Path>`s; R2 gate loops with a shared value on the UI thread (no React
re-render on focus/blur or when a ViewportGate flips during scroll).

### After R1 + R2 (`81771b5`, `ed2e357`), Android, dev
| Metric | After A–C | After R1 + R2 |
|---|---|---|
| Re-enter Hub tap → frame (median of 9) | ~790 ms | ~650 ms (560–820) |
| tap → Hub focus render | ~510 ms | ~445 ms |
| Hub focus render → effects | ~260 ms | ~150 ms |
| Idle frames p50 / p90, janky | 48 / 61 ms, 49 % | 48 / 61 ms, 49 % |
| Scroll frames p50 / p99, janky | 61 / 250 ms, 74 % | 73 / 150 ms, 80 % (noisy) |
| Memory, 10 cycles (PSS / native) | 961 → 980 / 238 → 239 MB | 969 → 951 / 285 → 288 MB: no leak |

R1's measured gain (~65 ms) is below the ~145 ms of the no-NavCore experiment:
the light bar's NavCore still mounts and unmounts its 3 `Word` loops and SVG
disc on every swap. What remains of re-entry is mostly React Navigation's
tab switch and the screen attach (~445 ms in dev), not Hub code.

## 2 · Stays results

Device: Android CPH2643 (dev build, Metro), iOS iPhone 16 Pro simulator (dev).
Entry: Hub "Stays" category card (`x,y` recorded per run), leave = `BACK`.

### Baseline (before fixes)
| Metric | Android | iOS sim |
|---|---|---|
| Idle frames p50 / p90, janky | 38–65 / 150–250 ms, 61–68 % | — |
| Scroll frames p50 / p99, janky | 69–125 / 250–500 ms, 78–88 % | — |
| Main-thread split (idle, median) | animation 9.0, layout 0.2, draw 0.8, GPU 8.7, total 32.9 ms | main 5.8 s of 15 s (38 %); 4.4 s `ShadowTree::commit` |
| JS thread | 6–10 fps | 4.1 s of 15 s, mostly Hermes |
| Renders per 5 s idle | Reels 23–32, DeckCard 69–96 | — |
| Enter Stays tap → frame | 1.7–2.3 s (median ~1.9 s); Explore mount ~1.4 s | not measured (probes log to Metro only) |
| Explore ↔ Bookings | Explore mount 1.3–1.5 s, Bookings ~520 ms | — |
| Memory, 30 leave/enter cycles | views 2169–2469, no trend; PSS ~1.15–1.25 GB; native heap down: **no leak** | — |

Experiment: rendering `null` for the sections below the fold took the Explore
mount from ~1.4 s to ~0.58 s and JS from 6–10 to ~50 fps.

### Findings
| # | Problem | Platform | Where | Sev | Effect | Fix (design unchanged) |
|---|---|---|---|---|---|---|
| A | Reels' 100 ms `setInterval` → `setState` re-rendered the deck ~10×/s, even off-screen | both | `Reels.js` | High | JS 6–10 fps; ~4 s JS per 15 s on iOS | bars animate on the UI thread; JS wakes once a second for the label; memo DeckCard/Seg/Thumb |
| B | Reel counter lived in Explore: each reel change re-rendered the listing | both | `Explore.js` | Med | ~20 renders per reel change | memoised `ReelsSection` owns the counter; stable `openStay` |
| C | Explore mounted everything below the fold before its first frame | both | `Explore.js` | High | ~850 ms of the ~1.4 s mount | `useStage`: mount one below-fold section per frame after first paint |
| D | Hidden BigPlay ripple looped during playback; off-screen coupons / review cards looped | both | `Reels.js`, `Offers.js`, `Explore.js` | Low | part of the 9 ms animation phase | ripple gated by `useLinger(!playing, 300)`; `RailGate` per rail card |

Not fixed: the same 1200 px photos as Hub #7; the sticky search bar animates a
shadow over a translucent background on iOS (cost not measured).

### After fixes A–D (`4ebc865`, `77a126f`, `e247509`, `e91e315`), same devices, dev build
| Metric | Before | After |
|---|---|---|
| Android idle frames p50 / p90, janky | 38–65 / 150–250 ms, 61–68 % | 15–21 / 21–40 ms, 6–9 % |
| Android scroll frames p50 / p90, janky | 69–125 / 150–250 ms, 78–88 % | 32–48 / 105–109 ms, 18–47 % |
| Android slow bitmap uploads (idle 10 s) | 12–17 | 0 |
| Android JS fps (idle) | 6–10 | 35–47 |
| Renders per 5 s idle | Reels ~28, DeckCard ~80 | Reels 5, DeckCard 0 |
| Explore mount (tab switch) | 1.3–1.5 s | 0.38–0.53 s (median ~0.42 s) |
| Stays mount render → frame (entry) | 1.6–2.2 s | 0.9–1.7 s (noisy; one 4.5 s outlier) |
| iOS sim JS thread busy (15 s idle) | 4.1 s | 0.58 s (−86 %) |
| iOS sim main thread busy (15 s idle) | 5.8 s (38 %) | 4.2 s (28 %) |
| Memory, 10 cycles (PSS / views) | — | 1087 → 1077 MB / 2518 → 2531: no leak |

Notes: entry timing is noisy because Hub's own focus work runs on the same JS
thread and several taps missed; the tab switch is the cleaner measure of the same
mount. Not measured: iOS entry and tab-switch timings (no Metro log access from
the session). Absolute numbers need a release build (see §6).

## 3 · Stay Detail results

Device: Android CPH2643 (dev build, Metro), iOS iPhone 16 Pro simulator (dev).
Entry: a Stays retreat card (`639,1580` at the scroll used), leave = `BACK`.
"Mid page" = five slow 300 dp swipes from the top (Amenities, Good to know and
the map on screen).

### Baseline (before fixes)
| Metric | Android | iOS sim |
|---|---|---|
| Entry tap → frame | 1.46–2.49 s (median ~1.55 s, 20 entries) | not measured (probes log to Metro only) |
| Idle, top of page | p50 20 ms, 0–7 % janky, JS 60 fps | main 4.78 s of 15 s (32 %); 4.1 s `ShadowTree` commit; JS 0.25 s |
| Idle, mid page | p50 65 ms, 83–85 % janky, JS 25 fps, no renders; animation 20 ms, draw 5.7, GPU 15.8 ms | — |
| Scroll (6 swipes) | p50 26–31 / p90 77–97 ms, 22–29 % janky; 0–73 slow bitmap uploads | main 8.7 s (58 %); JS 2.3 s |
| Room held sheet (top of page) | 1.2 % janky, p99 46 ms; each open/close re-rendered the screen, Nearby, gates | main 7.6 s (50 %); JS 1.6 s |
| Suite pick | 2 % janky, p99 61 ms, JS 36–41 fps; re-rendered screen, 3 Suites, Nearby | — |
| Policy sheet open/close (mid page) | p50 69 ms, 90 % janky, JS 21–24 fps | — |
| Memory, 20 cycles | views 1768 → 1768; PSS +102 MB then +8 MB: **no leak** | — |

Experiment: rendering `null` for Amenities, Good to know and Nearby took entry
from ~1.6 s to ~0.7 s; the policy sheet alone was worth little.

### Findings
| # | Problem | Platform | Where | Sev | Effect | Fix (design unchanged) |
|---|---|---|---|---|---|---|
| A | Amenities, Good to know, Nearby and both sheets built before the first frame | both | `index.js`, `BookingBar.js` | High | ~0.9 s of the ~1.6 s entry | lower sections mount one per frame after first paint; sheets mount on first open (`useLazy`, a frame before they slide in) |
| B1 | Tour ring and Guest Choice sheen looped off-screen; every page loop ran under the full-screen policy sheet | both | `Hero.js`, `index.js` | High | policy sheet 90 % janky | `ViewportGate` on both; `LoopGate` off once the sheet has covered the page (`useLinger(!policy, 600)`) |
| B2 | Amenity icons faded / moved shapes through SVG props: whole icon redrawn and re-uploaded each frame on Android | Android | `Amenities.js` | High | 204 slow uploads / 8 s idle mid page | each shape on its own small `Svg` inside an `Animated.View`; only the AC dashes still animate an SVG prop |
| — | Amenity tiles toggled on tap (user: no use) | both | `Amenities.js` | — | 4 press handlers, 4 focus rings, 4 extra glows | removed on request: static tiles, subtitle "4 included" |
| C | `stayFor()` built a new object each render (Nearby memo never held); photo index and toast state on the screen | both | `index.js`, `Hero.js` | Med | every tap re-rendered the page | memoised stay, `Page`, `MiniHeader`; Hero owns its index, Toast its state |
| D | Sheet pan gesture rebuilt every render | both | `BookingBar.js` | Low | — | `useMemo` |

Not fixed: the AC's moving dashes (a stroke-dash animation, still an SVG prop);
the 1200 px photos (Hub #7); iOS shadows over translucent backgrounds (bar).

### After fixes (`671e7f6`, `eec4329`, `0b1f9f1`, `ad5955f`, `16d018d`), same devices, dev build
| Metric | Before | After |
|---|---|---|
| Android entry tap → frame | 1.46–2.49 s, median ~1.55 s | 0.67–1.16 s, median ~0.95 s |
| Android idle, top | 0–7 % janky, p50 20 ms | 0 % janky, p50 21 ms |
| Android idle, mid page | 80–85 % janky, p50 65 ms, 204 slow uploads / 8 s | 43–45 % janky, p50 53 ms, ~80 slow uploads / 8 s |
| Android policy sheet open/close | 90 % janky, p50 69 ms, JS 21–24 fps | 34 % janky, p50 46 ms, JS 31–37 fps; 0 frames drawn while it is open |
| Android scroll (warm) | 22–29 % janky, p90 77–97 ms | 25–27 % janky, p90 61 ms |
| Renders per Reserve / sheet tap | screen, Nearby, MiniHeader, 4 Reveal, 3 gates | screen, BookingBar |
| iOS sim idle, top (15 s) | main 4.78 s, JS 0.25 s | main 4.30 s, JS 0.01 s |
| iOS sim scroll (15 s) | main 8.7 s (58 %), JS 2.3 s | main 6.7 s (45 %), JS 0.74 s (one more swipe than baseline) |
| Memory, Android cycles | views 1768 flat | views 1752 → 2405 → 2073 (no steady rise); PSS 967 → 1159 → 1057 MB: no leak seen |

Notes: the mid-page row is the same scroll for both (A/B by swapping
`Amenities.js` in place: 80 % → 45 %, 204 → 78 uploads). Mid page is still
main-thread bound (JS 24 fps with no renders) by the loops there and by the
Reanimated 3 commit cost (§2). The Room held sheet was re-measured mid page
(43 % janky), so it doesn't compare with its top-of-page baseline; its renders
do. Not measured: iOS entry and policy sheet; the after leak run stopped at 2 of
10 cycles on a missed tap. Absolute numbers need a release build (§6).

## 4 · Review Booking results

Device: Android CPH2643 (dev build, Metro), iOS iPhone 16 Pro simulator (dev).
Entry: Stay Detail → Reserve (`799,2257`) → sheet "Proceed to pay" (`811,1984`);
leave = `BACK` (the sheet stays open, so `perf-cycles.sh … 811,1984 StayReview`
works after fix E). On Review: Edit dates `919,809`, days `407,1531` / `559,1520`,
Apply `679,2268`, Pay `829,2256`, Back to Home `653,2249`. Payment is mocked.

### Baseline (before fixes)
| Metric | Android | iOS sim |
|---|---|---|
| Entry tap → frame | 0.81–1.26 s (median ~0.88 s, 10 entries) | ~0.63 s JS |
| Review idle | 4.7 % janky, p50 22 ms, JS 59 fps | main 29 %, 91 % of it `ShadowTree::commit`; 28 % with the pay sweep removed (same baseline as Stay Detail) |
| Calendar open, 2 picks, Apply | 4.9 % janky, p99 129 ms; each tap re-rendered all 35 days and the Total | — |
| Pay → confirm | Confirming 585–811 ms render → frame after the 1.2 s spinner; 271 + 163 ms frames as it starts | not captured |
| Success, first 3 s | 23 % janky, p50 42 ms, 16 slow uploads (badge ring/tick SVG props); Success 634–994 ms render → frame; 122 ms frame at the hand-off | not captured |
| Success idle, Done → Home | 0 % janky; Review unmounts, nothing keeps running | — |
| Memory | Home after each full flow: views 1255 → 1586 → flat; no leak seen | — |

### Findings
| # | Problem | Platform | Where | Sev | Effect | Fix (design unchanged) |
|---|---|---|---|---|---|---|
| A | Calendar (35 animated days) built before the first frame while closed; `Day` memo never held (new `day` object, `onPick` changed with the range); Total re-rendered on calendar taps | both | `index.js`, `Calendar.js` | Med | part of the ~0.9 s entry; 35 day renders per tap | calendar mounts on first open (`useLazy`); days take plain props, `onPick` stable via a ref; `Total` memoised |
| B | Confirming and Success built on the frame they play | both | `index.js`, `Confirming.js`, `Success.js` | High | ~0.57 s extra wait after the spinner, hitch at the hand-off | both mount hidden during Processing (`play` false: clock at 0, `LoopGate` off, no touches); receipt made at the Pay tap |
| C | Pay button sweep looped under the opaque overlays | both | `index.js` | Low | ~1 pt iOS main | `LoopGate` off 300 ms after Confirming starts |
| D | Badge ring/tick draw via SVG props (Android re-rasters the Svg) | Android | `Success.js` | Low | 16 slow uploads over 1.6 s, once | not fixed (like the AC dashes) |
| E | Stay Detail's sheet `BackHandler` ran under Review: first BACK on Review closed the hidden sheet | Android | `StayDetail/index.js` | Med | BACK did nothing visible | handler only while focused |

### After fixes (`75265ac`, `759ad15`, `bcc5ddf`, `21a936e`), same devices, dev build
| Metric | Before | After |
|---|---|---|
| Android entry tap → frame | 0.81–1.26 s, median ~0.88 s | 0.49–0.73 s, median ~0.53 s |
| Android Review idle | 4.7 % janky | 4.0 % janky |
| Day renders per calendar tap | 35 | 0–2 (first open: one 150 ms frame while the calendar builds) |
| Android Pay flow, frames > 100 ms | 271 + 163 ms as confirm starts (after a ~0.57 s wait); 122 ms at the hand-off | **577–622 ms during the spinner**; 150–210 ms as confirm starts; none at the hand-off |
| Android success, first 3 s | 23 % janky, p50 42 ms | 23 % janky, p50 44 ms (unchanged: one-shot keyframes, D not fixed) |
| iOS sim Pay flow | not captured | pre-mount JS 0.37 s inside the 1.2 s spinner; main 33–35 % during confirm / success vs 29 % idle |
| Memory, Android 2 × 10 Review cycles | — | views 1864 → 2011, then 1864 → 1864; PSS 971 → 1072, then 936 → 1008 MB: no leak |

Notes: B is a trade-off the user chose to keep: the overlays now start on time
and the hand-off is smooth, but the Processing spinner freezes for ~0.6 s on
Android while both build. Tested alternative (not committed): pre-mount only
Confirming → 193 + 352 ms during the spinner, 138 ms at the hand-off. The
150–270 ms frames as the confirm starts appear in every variant (its own first
frames). Not measured: iOS before B for the Pay flow, iOS calendar. Absolute
numbers need a release build (§6).

## 5 · IVA Shop results

Device: Android CPH2643 (dev build, Metro), iOS iPhone 16 Pro simulator (dev).
Entry: Hub (scroll top) → Shop `851,1833`; leave = `BACK` (no handler on the
list view) → `perf-cycles.sh <label> 10 851,1833 IvaList`. On the shop:
Blessed Kit card `342,1772`, Add to cart `856,2320`, View cart `830,2296`,
Place order `865,2274`, Back to home `661,2265`; from Home the centre tab is
`554,2243`. Ordering is mocked (1.2 s). `go()` calls `markTap`, so every view
switch logs tap → frame. One-shot frames per step:
`docs/special-section/perf-oneshot.sh <label> "name x,y|BACK seconds" …`
(tap times come from `log -t ivamark` on the monotonic clock framestats uses;
`/proc/uptime` is boot time and does not line up).

### Baseline (before fixes)
| Metric | Android | iOS sim |
|---|---|---|
| Hub → Shop tap → frame | 0.59–0.79 s (median ~0.62 s, 10 entries); List mount ~0.55 s | not measured (probes log to Metro only) |
| List idle | p50 30 ms (0 % janky by gfxinfo); animation 13.7, GPU 14.0, total 31 ms; JS ~31 fps | main 30–31 %, 83 % of it `ShadowTree::commit` |
| List scroll (6 swipes) | 7.9 % janky, p99 97 ms | — |
| Product / Review / Done idle | total 21.9 / 22.0 / 24.2 ms (screen floor) | — |
| View switches | one 107–225 ms frame each (Product 0.36 s, Review 0.29 s, Done 0.29 s render → frame); Done 1.66 s after Place: 113 + 166 ms | — |
| Android back (Review → Product → List → Hub) | one 166–242 ms frame each; back on the list 223 of 289 frames > 33 ms | — |
| Done → Home | one 161 ms frame; the shop unmounts, no probe logs after | — |
| Memory, 10 cycles | views 1212 → 1212; PSS 849 → 992 MB (dev growth as in §4): no leak | — |

Priced on the list (swap in place, same scroll): without the garland 23.0 ms
idle, mount ~0.40 s; glow, CTA nudge, grain and Ken Burns each < 1 ms; plain-view
flowers or no hardware layer: no change; garland on RN `Animated` with
`useNativeDriver` (skips the shadow-tree commit): 22.7 ms but mount +40 ms.
Grid + features not mounted: mount −75 ms.

### Findings
| # | Problem | Platform | Where | Sev | Effect | Fix |
|---|---|---|---|---|---|---|
| A | Hero garland: 15 flowers each rotated by Reanimated, so every frame commits the tree | both | `List.js` | High | list idle 31 vs 23 ms, JS 31 fps; iOS main 30 vs 25 %; ~150 ms of mount | removed at the user's request (design change) |
| B | Product grid and feature card built before the first frame | both | `List.js` | Low | ~75 ms of mount | mount a frame after the hero paints |
| C | Address draft state in `index.js`: each keystroke re-renders the shop | both | `index.js` | Low | not measured | not fixed |
| D | Done parcel draws via SVG props (Android re-rasters the Svg) | Android | `Done.js` | Low | once, ~1.2 s | not fixed (as §4 D) |
| E | One 104–242 ms frame per view switch / back | both | each view's own mount | Info | one-off | none without design change |

### After fixes (`25e73ad` A, `b23b0f7` B; probes `bf7d859`), same devices, dev build
| Metric | Before | After |
|---|---|---|
| Android Hub → Shop tap → frame | 0.59–0.79 s, median ~0.62 s | 0.35–0.43 s, median ~0.35 s |
| Android List mount render → frame | ~0.55 s | 0.28–0.30 s |
| Android list idle | 31 ms total (animation 13.7, GPU 14.0), JS ~31 fps | 18.8 ms (animation 8.3, GPU 8.8), p50 22 ms, JS ~59 fps |
| Android back to the list | 223 of 289 frames > 33 ms | 7 of 292 |
| Android list scroll | 7.9 % janky, p99 97 ms | 8.5 % janky, p99 93 ms (unchanged) |
| Android view switches, Place → Done, Done → Home | 107–242 ms frame each | 104–211 ms (unchanged, E); one run had 3 × ~0.5 s frames after Place, not repeated |
| Android memory, 10 cycles | views 1212 → 1212 | views 1016 → 973, PSS 862 → 881 MB: no leak |
| iOS sim list idle main thread | 30–31 % | 26 % |
| iOS sim whole flow (50 s, 1 s bins) | — | main 16–30 % per second, no second above 30 %; footprint 377 → 401 MB after one pass |

Not measured: iOS entry and view-switch timings (no Metro log access), iOS
leak cycles (one pass only), iOS baseline for the flow. Absolute numbers need a
release build (§6).
