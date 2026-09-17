# Concert feature — Android port guide

**Source of truth:** `Fracspace_IOS` repo, branch `feature/concert`, HEAD `be92d73`.
**Target:** the Android Fracspace project (separate repo, on the second laptop).

> Read this first in the new session on the Android laptop. The full source of every new file, plus the patch for the existing ones, is in the companion doc **`claude/concert-port-bundle.txt`** in this same project.

---

## 0. Before you start — push the branch

The 11 commits are **local only** right now. `origin/feature/concert` still points at `9493fa6` (the base). From the iOS laptop:

```bash
git push origin feature/concert
```

This matters because it unlocks the fastest port path (§2a). Without it you're copy-pasting 2,400 lines.

---

## 1. What the feature is

Three surfaces, all driven by one hardcoded data file that will later be replaced by an API (contract already written — see `docs/concert/` in the iOS repo):

1. **Home screen** — a floating portrait video card pinned bottom-left above the tab bar. Autoplays muted and looping, has replay / play-pause / mute controls and a "View Concert Details" footer. Slides out on scroll down, slides back on scroll up. While hidden, a peek tab sits flush on the left edge to bring it back. X dismisses it for the session only.
2. **ConcertDetails screen** — dark theme. Fixed hero image with the content sheet scrolling over it (and able to cover it entirely), floating back/share buttons, an animated gold "FRACSPACE PRESENTS" tag, a 30-second audio teaser with an animated waveform, a city/date selector, an about section, and a sticky gold CTA.
3. **Interest capture** — a bottom-sheet form (name, email, phone, city, ticket stepper) that swaps in place to a confirmation card on success.

Plus deep-link routing: a OneLink with `deep_link_value = concert_section` opens ConcertDetails directly, including for logged-out users and users who sign up rather than log in.

---

## 2. Two ways to port

### 2a. Git (recommended)

The two repos have no shared history, but cherry-pick works fine across unrelated remotes. On the Android laptop:

```bash
git remote add ios https://github.com/KrishnaFracspace/Fracspace_IOS.git
git fetch ios feature/concert
git checkout -b feature/concert
git cherry-pick 4048e82^..be92d73
```

Expect conflicts **only** in the six existing files (§4) — every new file applies cleanly. If the cherry-pick range is awkward, this is equally good:

```bash
git checkout ios/feature/concert -- \
  Screen/utils/concertData.js \
  Screen/components/ConcertVideoCard.js \
  Screen/components/ShinyTag.js \
  Screen/components/AudioWaveform.js \
  Screen/components/ConcertInterestForm.js \
  Screen/components/ConcertSuccessSheet.js \
  Screen/Version2_O/ConcertDetails.js \
  docs/concert/
```

…then hand-apply §4 from the patch in the bundle.

### 2b. Manual

Everything is in `claude/concert-port-bundle.txt`. Part 1 has the seven new files verbatim between `===== FILE: path =====` markers. Part 2 is the unified diff for the six existing files.

---

## 3. New files — create verbatim (7 files, ~2,240 lines)

| File | Lines | What it does |
| --- | --- | --- |
| `Screen/utils/concertData.js` | 96 | All hardcoded content + the dark theme tokens (`CONCERT`, `CONCERT_THEME`). Everything else imports from here. |
| `Screen/components/ConcertVideoCard.js` | 448 | The floating home card + the left-edge peek tab. |
| `Screen/components/ShinyTag.js` | 135 | Gold gradient pill with an SVG sparkle and a shine sweep. |
| `Screen/components/AudioWaveform.js` | 87 | Equaliser bars that animate while the teaser plays. |
| `Screen/components/ConcertInterestForm.js` | 604 | The interest bottom sheet; also hosts the confirmation state. |
| `Screen/components/ConcertSuccessSheet.js` | 226 | The "You're on the list!" confirmation body. |
| `Screen/Version2_O/ConcertDetails.js` | 637 | The details screen. |

None of these import anything Android-specific, and none are new dependencies (§5).

---

## 4. Existing files — six edits

Line numbers will differ in the Android repo. Match on the surrounding code, not the line number.

### `Screen/Version2_O/HomePage.js` — 2 lines
- Add `import ConcertVideoCard from '../components/ConcertVideoCard';`
- Render `<ConcertVideoCard scrollY={scrollY} />` immediately after `<EdgeFab scrollY={scrollY} />`.

**Check this carefully.** It must be the same `scrollY` that `EdgeFab` already uses. In the iOS repo `HomePage` has an `Animated.ScrollView` wrapping a plain `ScrollView`, and the **outer** one is what actually scrolls — the inner one is laid out unbounded so it never scrolls and its `onScroll` never fires usefully. If the Android `HomePage` is structured differently, pass whichever `Animated.Value` is genuinely driven by scrolling, or the card will never hide.

### `Screen/Navigation/HomeStack.js` — 2 lines
Import `ConcertDetails` and register `<Stack.Screen name="ConcertDetails" component={ConcertDetails}/>`.

### `Screen/Navigation/NavigationStack.js` — 2 lines
Same registration, on the **root** navigator, next to `PackageDescription`.

**Both registrations are required.** HomeStack serves the in-app card tap; the root registration is what makes the post-login `navigation.reset({ routes: [BottomNavigations, targetRoute] })` resolve. Registering only in HomeStack means the logged-in path works and the after-login deep link crashes with *"Do you have a screen named 'ConcertDetails'?"*.

### `App.js` — 3 hunks
1. In `tryNavigate`, add the `concert_section` branch mapping to `ConcertDetails` with `params: { concertId: data?.deep_link_sub1 || data?.af_sub1 || null }`.
2. In the same function's `AsyncStorage.getItem('mytoken')` block, persist `pendingDeepLink` when there is no token.
3. In `navigateWithAuthCheck`, do the same before navigating to `NewLogin`.

(2) and (3) are what make the logged-out and sign-up flows survive `NewLogin → NewSigin` and an app restart mid-login.

### `Screen/Version2_O/NewSigin.js` — 1 hunk
Add Priority 1 (`route?.params?.redirectAfterLogin`) ahead of the existing Priority 2 (stored `pendingDeepLink`). Without this, a user who signs up instead of logging in loses the redirect. **Verify the Android copy has the same gap before patching** — if it already reads route params, skip it.

### `Screen/Version2_O/NewLogin.js` — 1 line
Add `await AsyncStorage.removeItem('pendingDeepLink');` inside the `redirectFromParams` branch, so the link isn't replayed on the next app open.

---

## 5. Dependencies — nothing new

Every library used is already in the iOS `package.json` and should be in the Android one. Confirm these exist and note the versions:

| Package | Used for | Version gotcha |
| --- | --- | --- |
| `react-native-video` | Home card video + teaser audio | **Pinned behaviour.** On 6.0.0 the poster API is `poster="url"` + `posterResizeMode`, and there is **no `audioOnly` prop**. On 6.10+ poster becomes an object (`poster={{ source: { uri } }}`). If Android is on a different 6.x, adjust `ConcertVideoCard.js` accordingly. |
| `react-native-linear-gradient` | Every gold gradient | — |
| `react-native-svg` | The sparkle in `ShinyTag` | — |
| `react-native-vector-icons` (Ionicons) | All glyphs | Glyphs used: `play`, `pause`, `refresh`, `volume-high`, `volume-mute`, `close`, `chevron-forward`, `chevron-back`, `share-outline`, `location-outline`, `checkmark`, `checkmark-circle`, `sparkles`, `flash`, `add`, `remove`, `arrow-forward`. All exist in the bundled Ionicons v7 map. |
| `react-native-safe-area-context` | `useSafeAreaInsets` | — |
| `react-native-toast-message` | Submit error toast | — |
| `@react-navigation/native` | `useIsFocused`, `useFocusEffect` | — |

---

## 6. Android-specific checks

These are the things that behave differently from iOS. Work through them after the code compiles.

### 6.1 Status bar (already handled, don't regress)
`ConcertDetails` sets `StatusBar.setTranslucent(true)` + `setBackgroundColor('transparent')` so the hero sits under the status bar. **On Android these are global flags**, so the screen restores them on blur via `useFocusEffect` cleanup, putting back `#021265`. If the Android app's default status bar colour is not `#021265`, change `APP_STATUS_BAR_COLOR` at the top of `ConcertDetails.js`. If you skip this, every screen you navigate to afterwards inherits a transparent status bar.

### 6.2 Fonts
The design uses `WorkSans-Regular / Medium / SemiBold / Bold`. Confirm all four `.ttf` files are in the Android project's font assets and that `react-native.config.js` points at the same folder, then `npx react-native-asset`. Android silently falls back to the system font — it will not error, it will just look wrong.

### 6.3 Keyboard in the interest sheet
`KeyboardAvoidingView` uses `behavior={undefined}` on Android and relies on `android:windowSoftInputMode="adjustResize"` in `AndroidManifest.xml`. The iOS repo's manifest has it; verify the Android one does too or the sheet will sit under the keyboard.

### 6.4 Hardware back button
Already wired: the interest modal's `onRequestClose` maps to the same dismiss handler as the X, so back closes the sheet rather than the screen. Worth a manual test on both the form and the confirmation state.

### 6.5 Video decoding
The home card autoplays while `HomePage` already renders testimonial videos further down. Those are paused, so only one decoder should be active — but older/low-end Android devices are stricter about concurrent `MediaCodec` instances than iOS. Test on a real low-end device, and if you see a black card, that's the cause.

### 6.6 Elevation and overflow
Shadows use `Platform.select` with `elevation` on Android. The peek tab and the shine sweep both rely on `overflow: 'hidden'` clipping an animated child — this works on RN 0.73 but is worth an eyeball on an older Android version.

### 6.7 Deep link plumbing — the real work
The JS mapping is identical, but the native side is not:

- **AppsFlyer OneLink** — the existing OneLink (`https://fracspace.onelink.me/OVdL/tqivtrv3`) must have the **Android app configured** in the OneLink template, not just iOS. Check this in the AppsFlyer dashboard first; if Android isn't set up the link will fall through to the Play Store or the web.
- **`appsFlyer.initSdk`** — the iOS `appId: '6498551006'` is an App Store ID. The Android project uses the package name instead. Don't copy that line across.
- **`AndroidManifest.xml`** — App Links need an `intent-filter` for the OneLink domain with `android:autoVerify="true"`, plus the `assetlinks.json` served from the domain. If the existing `escape_section` / `property` links already work on Android, this is all in place and you need to change nothing.
- **Test order** — verify with `escape_section` first. If that already routes correctly on Android, `concert_section` will too, since they go through the same `tryNavigate`. If `escape_section` is broken on Android, fix that before blaming the concert link.

---

## 7. Assets

All URLs in `concertData.js` are real CloudFront paths from the iOS build and are platform-independent — they'll work as-is. Two are worth fixing while you're in there:

- `teaser.audioUrl` currently points at `ConcertVideo.mp4`. It plays through a hidden audio-only player, so a real MP3 would save bandwidth.
- `posterImage` and `heroImage` are the same file. Fine, but separate them if marketing wants a distinct share image.

---

## 8. Verification checklist

- [ ] Home card appears above the tab bar, doesn't overlap the chatbot FAB or the Altaira `EdgeFab`
- [ ] Card slides out scrolling down, peek tab appears on the left edge
- [ ] Tapping the peek tab brings the card back and it stays (900ms grace window against momentum)
- [ ] Scrolling up brings it back on its own
- [ ] X dismisses for the session; reappears after an app restart
- [ ] Replay / play-pause / mute all work; video pauses on tab switch and on backgrounding
- [ ] Tapping the card opens ConcertDetails
- [ ] Hero stays fixed, sheet scrolls over it and can cover it fully
- [ ] Gold tag shines on an interval; teaser plays audio and the waveform animates
- [ ] City selection switches the gold border and checkmark
- [ ] CTA opens the form; validation fires on empty/invalid fields
- [ ] Submit shows the confirmation card with the right city, ticket count and formatted phone
- [ ] "Go to Home" lands on the home screen **with the tab bar**
- [ ] Back out of ConcertDetails → **status bar is navy again, not transparent** (§6.1)
- [ ] Deep link, logged in → lands on ConcertDetails
- [ ] Deep link, logged out → login → lands on ConcertDetails
- [ ] Deep link, logged out → tap Sign up → OTP → lands on ConcertDetails
- [ ] Deep link, logged out → kill app mid-login → reopen → still lands on ConcertDetails

---

## 9. Known open items (same on both platforms)

- The interest submit is a `setTimeout` stub. `Screen/components/ConcertInterestForm.js` has the payload built and a `TODO` at the call site.
- `interestedCount` ("4.8k") is hardcoded pending the API.
- The share button opens the native sheet with a placeholder message; no analytics on it yet.
- `NewLogin.js` has a dead `handleLoginSuccess1` containing `const redirect = ...` followed by a reassignment — it will throw if anyone ever calls it. Pre-existing on both platforms; worth a one-word `const` → `let` fix.
