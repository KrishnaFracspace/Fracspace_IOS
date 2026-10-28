# Special Section · performance pass

One section per session: 1 Hub, 2 Stays, 3 StayDetail, 4 StayReview, 5 IvaShop.
Each session audits the code, measures on Android and iOS, reports a table,
then applies only the fixes the user approves (one commit per group) and
re-measures. Animations and design must stay identical.

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
- **Re-renders**: context values built inline (new object each render), inline
  handlers into memoised children, state that lives higher than it is used.
- **Images**: pixel size vs displayed size × 3 (decoded = w × h × 4 bytes).
- **Lists**: horizontal rails are `ScrollView`s of a few items (fine); anything
  long should be a `FlatList`.
- **Mount**: work done before the first frame (big SVGs, many loops starting).
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
- JS fps follows the main thread (rAF is driven by the UI frame clock), so a low
  JS fps with few renders means the main thread is the bottleneck.

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
It records `gfxinfo` idle 10 s, `gfxinfo` over 6 swipes, and `meminfo` before and
after the cycles. Output: `docs/special-section/runs/<label>-android.txt` (not committed).

Frame phase split (which part of the main thread is slow):

```bash
adb shell dumpsys gfxinfo com.fracspace reset; sleep 6; adb shell dumpsys gfxinfo com.fracspace framestats
```

Then median of `PerformTraversalsStart − AnimationStart` (animation),
`DrawStart − PerformTraversalsStart` (layout), `SyncQueued − DrawStart` (draw record),
`FrameCompleted − IssueDrawCommandsStart` (GPU).

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
