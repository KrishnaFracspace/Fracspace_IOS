# Fracspace app — developer guide

One React Native codebase for **iOS and Android** (since release 2.3.0). Before that, iOS lived in this
repo and Android in a separate repo (`Fracspace_Android`). This guide covers how the project is set up
now, the conventions to follow, and what changed in the merge and the React Native 0.81 upgrade.

- Merge details, per-file decisions and the production bugs found: [`docs/merge-2.3.0/MERGE-NOTES.md`](merge-2.3.0/MERGE-NOTES.md)
- Unused-file cleanup (what was removed and why): [`docs/UNUSED-FILES.md`](UNUSED-FILES.md)
- Last updated: 2026-10-06 (RN 0.81 upgrade, memory, cleanup, audio, app size, OTP autofill)

---

## 1. Repos, branches and tags

| What | Where | Status |
|---|---|---|
| **The merged app (2.3.0)** | this repo, branch **`release/2.3.0`** | All active development. Not released yet. |
| Last fully tested point | tag `v2.3.0-rn081-tested` | RN 0.81 + memory, cleanup, audio and splash work, tested on Android and iPad. |
| iOS before the merge | this repo, `main`, tag `pre-merge-ios` | Matches the iOS app before the merge. |
| Before the RN upgrade | tag `pre-rn-0.81` | `release/2.3.0` on RN 0.73.6, before Phase 3. |
| Android 2.2.3 | `Fracspace_Android`, `release/2.2.3`, tag `pre-merge-android` | On Play internal testing only. **Don't merge into `master` until it is live.** |
| Android before the merge | `Fracspace_Android`, `master` | Matches the live Play Store app (2.2.2). |

**Develop in this repo only.** `Fracspace_Android` is just for an emergency fix to the current live
Android app, and will be archived once 2.3.0 ships on both stores.

**How changes land:** one short branch per change off `release/2.3.0` (`fix/…`, `feature/…`, `docs/…`).
Test it on an Android phone and an iPad, then fast-forward merge it into `release/2.3.0`.

App identifiers stay different per platform: Android `com.fracspace`, iOS `com.fracspace.fracspace`.
Version **2.3.0**: Android versionCode **76** (75 is already on Play internal testing; every Play upload
needs a new code), iOS build 46 (check App Store Connect before uploading; bump it if 46 was used).

---

## 2. Setting up and building

### Install
```bash
npm install
cd ios && LANG=en_US.UTF-8 pod install && cd ..
```
- `.npmrc` sets `legacy-peer-deps=true`.
- `postinstall` runs **patch-package**. The patches in `patches/` are part of the app (section 3). If a library
  update makes one fail to apply, `npm install` warns; fix the patch before shipping.
- `pod install` fails on Ruby 4 unless the shell locale is UTF-8 (`LANG=en_US.UTF-8`).

### Android signing
- Release keystore: `android/app/fracspace.keystore` (git-ignored; keep a backup).
- **Keystore passwords are not in the repo.** Put them in `~/.gradle/gradle.properties`:
  ```
  MYAPP_UPLOAD_STORE_PASSWORD=...
  MYAPP_UPLOAD_KEY_PASSWORD=...
  ```
  The store file name and key alias are still in `android/gradle.properties`.
  Without the passwords (a fresh clone, CI), debug builds work and release builds come out unsigned.
- Upload key SHA-1 must match Play Console: `A0:F8:96:E1:96:5A:73:5B:85:47:AF:53:95:5A:E8:22:EE:62:FA:76`.

### Builds
```bash
# Android release (signed, R8)
cd android && ./gradlew assembleRelease      # APK
cd android && ./gradlew bundleRelease        # AAB for Play
```
- If Gradle can't find the SDK: `export ANDROID_HOME=$HOME/Library/Android/sdk`.
- iOS: open `ios/Fracspace.xcworkspace` in Xcode. From the command line the simulator needs `ARCHS=arm64`,
  because the Podfile excludes x86_64 simulator builds.
- After pulling native changes (Podfile, fonts, Xcode project, patches), do **Product → Clean Build Folder** in Xcode.

### Reading logs and JS errors
**Release builds contain no `console.*` from app code.** `babel.config.js` strips them when `BABEL_ENV=production`
(Gradle/Xcode release builds and Stallion bundles), because the app logs tokens and personal data. Debug builds
keep them. Don't rely on `console` for anything you need from production; use Crashlytics.

React Native 0.77+ no longer prints the app's `console.*` in the Metro terminal.
- **Android:** `adb logcat` (`ReactNativeJS` for JS, `AndroidRuntime` for crashes).
- **iOS:** press `j` in Metro to open React Native DevTools (console, errors). Native logs: Xcode's console, or
  `xcrun devicectl device process launch --console`.

### Line endings
Many JS files are **CRLF**. Keep each file's existing line endings, or the diff marks every line as changed.

---

## 3. Dependencies

**React Native 0.81.6, React 19.1, New Architecture on, Hermes on both platforms.** One `package.json` for both
platforms; versions were aligned with `@rnx-kit/align-deps` for RN 0.81.

| Package | Version | Note |
|---|---|---|
| @react-native-firebase/* | `20.3.0` (all the same) | Must all match `@react-native-firebase/app`. 20.3 works on RN 0.81. |
| react-native-screens | `>=4.19.0 <4.25.0` | Range RN 0.81 supports |
| react-native-pdf | `^7.0.5` | Fixes the "Already closed" crash and is 16 KB-aligned (no pdfium pin or patch any more) |
| @react-native-documents/picker | `^12.0.2` | Replaces `react-native-document-picker`; use `Screen/utils/documentPicker.js` (same API as before) |
| react-native-stallion | `^2.4.2` | OTA updates (section 6) |
| react-native-video | `^6.19.3` | **Patched** (below). Plan: move to `expo-video` in 2.4.0 (section 9) |

**Patches** (`patches/`, applied on every install):

| Patch | Why |
|---|---|
| `react-native-video+6.19.3` | Background audio, see section 5 "Video and audio". Android: a muted video never takes audio focus, focus is transient, and it's released on mute/pause/end. iOS: the audio session is deactivated when nothing is audible, so other apps' music resumes. |
| `react-native-calendars+1.1308.1` | React 19 ignores `defaultProps` on function components; sets the header's `monthFormat` default inline. |
| `react-native-date-picker+5.0.13` | Removes a `codegenConfig.ios.modulesProvider` entry that crashed iOS on launch ("RNDatePickerManager does not conform to RCTModuleProvider"). |

**Removed:**
- In the merge: `openai`, `payu-non-seam-less-react` (payments use a PayU WebView), `react-native-capture-protection`,
  `react-native-screenshot-prevent`, `react-native-code-push` (replaced by Stallion).
- In the RN upgrade: `react-native-document-picker`, `react-native-svg-charts`.
- In the 2026-10-06 cleanup (no code used them): `react-native-chart-kit`, `react-native-share`,
  `react-native-virtualized-view`, `react-native-modal-datetime-picker`, `@react-native-community/datetimepicker`.

---

## 4. Writing code that works on both platforms

Most screens came from the iOS app. Android-specific behaviour is behind `Platform.OS === 'android'`.

- **`SafeAreaView`: import it from `react-native-safe-area-context`.** The one in `react-native` does nothing on
  Android, and the app is edge-to-edge there (targetSdk 36).
- **Fonts:**
  - Use the **real file name** as `fontFamily` (`'WorkSans-SemiBold'`, `'Montserrat-Medium'`), not
    `'Work Sans'` plus `fontWeight`. A misspelt name silently falls back to the system font.
  - The app ships **only the 17 fonts it uses**: WorkSans Regular/Medium/SemiBold/Bold/Italic, Montserrat
    Regular/Medium/SemiBold/Bold, Poppins Regular/Medium/SemiBold/Bold, OpenSans SemiBold/Bold/ExtraBold, Barlow-Medium.
  - **To add a font**, put it in **all four places**: `Screen/assets/fonts`, `android/app/src/main/assets/fonts`,
    `UIAppFonts` in `ios/Fracspace/Info.plist`, and the Xcode project's resources (`npx react-native-asset` does all of them).
  - Icon fonts (`react-native-vector-icons`) come in through the library's pod. Don't add the package folder or
    its `Fonts` folder to the Xcode project (that's how 21 MB of duplicates got into the iOS app).
- **Images:**
  - Compress bundled images before committing (`pngquant --quality=70-92` for PNGs). Every bundled image ships
    in both apps.
  - Remote images: add `resizeMethod="resize"` on Android, so they're decoded at the size shown instead of full
    resolution (big memory saving on image-heavy screens).
- **Status bar:** on iOS and Android 15+ the status bar has no background; the screen's top shows through.
  `Screen/utils/statusBar.js` picks dark or white icons per route (from `App.js` on every navigation). **A new
  screen with a dark top (navy/black) must be added to `LIGHT_CONTENT_ROUTES`**, or its icons will be dark.
  Don't put `barStyle` on a `<StatusBar>` element; use `EDGE_TO_EDGE ? undefined : '…'` if old Android needs it.
  Android 14 and older keep the navy bar with white icons (HomePage's `<StatusBar>`).
- **Timers and autoplay:** stack screens stay mounted when another screen opens on top. Gate every
  `setInterval`, carousel autoplay and animation loop on `useIsFocused()`, or it keeps running (CPU, battery)
  for the whole session.
- **Text colour:** the Android theme is forced to **Light** and its default text colour is **black**
  (`android/app/src/main/res/values/styles.xml`), to match iOS. Still give important text an explicit colour.
- **TextInputs and OTP boxes:** Android adds its own padding and sizes inputs from their content, so iOS-designed
  inputs come out too tall and OTP boxes uneven. Existing screens give them a fixed size on Android:
  `ANDROID_OTP_BOX` in Dashboard, Transfer and MonthlyInsight, and inline styles in Login, Signup and Wallet.
  Do the same for new inputs (`includeFontPadding: false`, fixed `width`/`height`, `padding: 0`).
- **Shadows:** iOS `shadow*` styles don't render on Android; add `elevation`. Inside a `ScrollView`, put padding in
  `contentContainerStyle`, not `style`, or Android clips the shadow.
- **Modals:** add `onRequestClose`, or the Android back button won't close them.
- **KeyboardAvoidingView inside a Modal:** use `behavior={Platform.OS === 'ios' ? 'padding' : undefined}`.
- **Store links and update checks** differ per platform. Use the Play Store URL or `androidCurrentVersion` on Android.
- **Hardware back:** `BackHandler.removeEventListener` no longer exists (RN 0.77+). Keep the subscription and call
  `subscription.remove()`.
- **React 19:** `defaultProps` are ignored on function and `forwardRef` components. Use default parameter values.
- **New Architecture:** a native `<Video>` swallows taps meant for a parent `Touchable`. Wrap it in
  `<View pointerEvents="none">` when it sits inside something tappable.
- **Don't trust a fix that's only tested on iOS.** Before merging, test on both platforms.

---

## 5. App behaviour you should know about

### App shell (`App.js`, `Screen/Navigation/NavigationStack.js`)
- **Splash:** a full-screen video (`videos/fracspace_splash.mp4` on CloudFront: 720p, about 1 MB, no audio needed,
  "fast start"). `resizeMode="cover"` fills the screen without stretching; the status bar is hidden. It ends when
  the video ends (6 s fallback, or straight away on error). Keep any replacement video small (720p/1080p,
  about 1–2 MB, web-optimised), because it streams on every launch.
- **OTA updates:** Stallion on both platforms (section 6).
- **Offline:** `Screen/components/NoInternet.js` shows as an overlay over the app. Navigation state is kept.
- **Push notifications:**
  - Android 13+ asks for the `POST_NOTIFICATIONS` permission.
  - A push that arrives while the app is open shows an `Alert` on both platforms. Data-only messages are skipped.
- **Login:**
  - The full profile (`globalState.userDetails`) is fetched whenever the user is logged in without one, including straight after login.
  - **Logout and Delete Account clear the whole session**: AsyncStorage, `globalState`, and the redux `profile` and `home` state.
- **Deep links (AppsFlyer OneLink):**
  - Property id = `af_sub2 || deep_link_sub1 || af_sub1`.
  - The install-conversion link is used only on first launch.
  - Links that need a login go through the `redirectAfterLogin` route param and AsyncStorage `pendingDeepLink`.
- **Analytics:** a Firebase screen view is logged on every route change, on both platforms.

### OTP autofill (login and signup)
Shared logic in `Screen/utils/useOtpAutofill.js`, used by `NewLogin.js` and `NewSigin.js`.
- **Android:** `SmsConsentModule.kt` uses Google's **SMS User Consent API**. When the OTP SMS arrives, Google shows
  a one-tap "Allow" sheet; the code fills all six boxes. No SMS permission is needed and the SMS text doesn't need
  an app hash. "Deny" falls back to typing.
- **iOS:** the boxes use `textContentType="oneTimeCode"`, so the code shows above the keyboard and one tap fills
  it. Apple doesn't let apps read SMS, so that tap can't be removed. iPads only get SMS codes with Text Message
  Forwarding from an iPhone.
- **Both:** a complete code (autofill, paste or the sixth typed digit) **submits automatically**, once per code.
  "Send me a new OTP" clears the boxes and listens for the new SMS.
- Each box needs `maxLength={OTP_LENGTH}`. With `maxLength={1}` the autofill is cut to its first digit.
- The Continue button must call the hook's `submitOtp` (and use `submitting` to disable itself), not the API
  function directly; `submitOtp` sends one request at a time. `onComplete` must return the request's promise.
- Going back to change the number calls `resetOtp()`, so an old code can't be submitted.
- To use it on another OTP screen (Wallet, Transfer…): call the hook and use what it returns, as in `NewLogin.js`.

### Video and audio
- **Background music:** a **muted** video never stops the user's music. Unmuting (or playing a video with sound)
  takes audio over; muting, pausing, the video ending or leaving the screen gives it back, and the music resumes.
  This comes from the `react-native-video` patch (section 3). iOS also starts in a mixable audio mode
  (`AVAudioSessionCategoryAmbient` in `AppDelegate.mm`) to cover the moment before a video has applied `muted`.
- **Memory:** players are only mounted while their screen is visible (`useIsFocused`, plus `AppState` on the Home
  concert card); react-native-screens keeps old screens mounted, and paused players still hold a hardware decoder.
  Home's testimonials mount one player, for the one being played.
- **Sources:** pass video sources through `videoSource(url)` (`Screen/utils/videoSource.js`). It caches the
  source object, so the player doesn't reload on re-render, and gives Android smaller buffers.
- **HLS:** use the stream's master playlist (`…/master.m3u8`), not a fixed rendition like `…/1080p/index.m3u8`,
  so the player can drop quality on a slow network. The Discover Altaira intro froze for 28 s on mobile data
  before this. It now also shows a spinner, a Skip button, and skips itself on error or a 6 s stall.

### Navigation
- **Aliases**, so old Android or backend screen names keep working:

  | Old name | Opens |
  |---|---|
  | `SelectRoomFS` | `SelectRoom` |
  | `LabelsDescription` | `LablePropertyDis` |
  | `IntroAnim` | `LableProperty` |
  | `PdfViewerScreen` | `PdfViewer` (`PdfScreen` accepts `{pdf}` or `{url}`) |
  | `PropertyImages` | `Label` |
  | `EdgeFab`, `trails` | the Altaira floating button screen (`FloatingButton.js`) |

- **Backend-driven screen names:** the Home carousel, popup and category tiles (`getCarouselUi`) and push
  notifications (`item.screen`) navigate by name. Don't remove or rename a route without checking the backend.
  Always guard these calls: `navigate(undefined)` throws and closes the app, while an unknown name is ignored.
  On 2026-10-06 the carousel used `Home`, `Packages`, `InteriorForm`, `DreamscapeHome`, `LiveStream`, `IntroAnim`
  and `LableProperty`.

### Payments (`Screen/PaymentPage.js`)
- **PayU is live (`secure.payu.in`). Never complete a payment while testing; cancel on the PayU page.**
- **Booking flow:** Book → `initiatePayment` → PayU WebView → **verify with PayU (up to 3 tries, 2 s apart)** → `bookFraction` → `PaymentSummary`.
- `bookFraction` records:
  - the selected frac count;
  - `totalBookingAmount` = **the amount actually paid, fees included** (from the PayU verification);
  - the real `mihpayid`;
  - `bookingStatus` from the verification.
- Verified failures and user cancels are recorded as `Failed`. If PayU can't be reached, nothing is recorded.
- PayU's cancel is handled in the app. If the page fails to load, it shows a "Couldn't load the payment page" screen.
- **UPI:** any non-web URL scheme is handed to the matching app. On Android, `intent://` links are converted
  first. `AndroidManifest.xml` `<queries>` lists `upi` plus GPay, PhonePe, Paytm and BHIM.
- The amount sent to PayU is rounded to 2 decimals. The fee and GST formulas are unchanged.

### Other screens
- **Notifications:** only the last **45 days**. The list, the empty state, the header unread counter and the
  Home bell dot all use the same window.
- **Profile verification (non-Indian users):** bank account and branch fields; PDF or image for PAN and cheque.
- **Enquire from Dashboard (complimentary stay):** the route param is `{property}`, the payload has `bookingFor: 'me'`,
  and the user returns to `Dashboard` with `ownedProDetails`.
- **Altaira "I'm interested":** the enquiry is sent first; the thank-you modal shows only on success.
- **Property → Location highlights:** an endless horizontal list. It re-centres in `onMomentumScrollEnd`, not
  `onScroll`; re-centring on every scroll event made it fight itself and blocked all taps on iOS.

### API and state additions
- **`Screen/Services/UserApi.js`:** `ConstructionForm`, `PropertyMetaDataApi`, `ChangePropertySoldOutStatus`
  and `AltairaExp` were added; `GetLabelsProp` now uses `v1/altaira/getAllProperties`.
- **`AppContext`:** `prior`, `AllProperty`, `altairaPromo`, `pendingDeepLinkType`, `pendingDeepLinkId` and `location` were added.

---

## 6. OTA updates (Stallion)

- **Native setup:**
  - Android: `MainApplication.kt` returns `Stallion.getJSBundleFile(...)`; `strings.xml` has `StallionProjectId` and `StallionAppToken`.
  - iOS: `AppDelegate.mm` `bundleURL` returns `StallionModule getBundleURL` in release (Metro in debug); `Info.plist` has the same two keys.
- **Updates apply on the next cold start.** The app downloads in the background and never restarts itself
  (an immediate restart used to kill payments, OTPs and UPI handoffs in progress).
- **Never release a 2.3.0+ bundle to 2.2.x app versions.** Old iOS apps run JavaScriptCore and old native
  modules; a Hermes bundle crashes them on launch. Stallion matches the exact app version, so always release to
  `2.3.0` (or later) only. Nothing else in the app guards against this.
- **Publish a bundle.** The CLI must be logged in to the **Fracspace** Stallion account; another account fails with "org access denied".
  ```bash
  npx stallion login
  npx stallion publish-bundle --upload-path=fracspace/fracspace/fracspace1 --platform=android --entry-file=index.js
  npx stallion publish-bundle --upload-path=fracspace/fracspace/fracspace1 --platform=ios --entry-file=index.js
  ```
  - iOS is on Hermes since 2.3.0, so **don't** pass `--hermes-disabled` any more. Old iOS releases (2.2.x, JavaScriptCore)
    used `--hermes-disabled true`; a Hermes bundle must never be released to them.
  - Publishing only uploads to the bucket. **Releasing to an app version is a separate step** (`release-bundle` or the Stallion Console).
  - Target bundles at the right app version. Before the bump to 2.3.0, Stallion offered the live 2.2.0 bundle to the new build.
- **Test an OTA bundle on a device:**
  - Open Stallion's in-app menu by calling `useStallionModal().showModal()`; add a temporary trigger.
  - Log in with the project's SDK PIN (Stallion Console → Project Settings → Access Tokens).
  - Testing → bucket → download → the app restarts.
  - Switch back with **Production**, then fully restart the app.
- **Never ship native changes over OTA** (new native libraries or modules, patches to native code, Gradle, Podfile,
  manifest, Info.plist, fonts). Those need a store build. The OTP module and the video patch are native.
- **Keep the old RevoPush/CodePush deployment live** until Android users on 2.2.2/2.2.3 have updated to 2.3.0 from the Play Store.

---

## 7. Native project notes

### Android
- **minSdk 24** (Android 7.0), targetSdk/compileSdk 36, NDK 27.1, Kotlin 2.1.20, Gradle 8.14.3.
- **R8 is on.** Keep rules are in `android/app/proguard-rules.pro`: React Native `devsupport` and `jni` (release
  crashes without them on RN 0.81), Stallion, pdfium and the PDF viewer, AppsFlyer, and readable Crashlytics stack
  traces. If a crash happens in release but not debug, suspect a missing keep rule.
- The AAB includes native symbol tables, and Crashlytics uploads native symbols.
- **Play 16 KB page size: supported** since 2.3.0 (all 26 native libraries aligned). Play blocks updates without it
  after 1 Feb 2027, so check the App bundle explorer still says "Supports 16 KB" after adding a native library.
- Custom native module: `SmsConsentModule.kt` / `SmsConsentPackage.kt` (OTP autofill), registered in `MainApplication.kt`.
- The vector-icons fonts Gradle script needs the lint tasks to depend on `copyReactNativeVectorIconFonts`
  (already in `app/build.gradle`); Gradle 8.14 fails the build otherwise.

### iOS
- Deployment target **15.1**, Hermes, New Architecture. `AppDelegate.mm` sets `RCTAppDependencyProvider`
  (required for third-party native components on RN 0.77+).
- **Podfile:** don't use a global `use_modular_headers!`; it breaks RN 0.81 ("redefinition of module react_runtime").
  The Firebase/Google pods that need modular headers are listed one by one.
- **Keep the Xcode project's Copy Bundle Resources lean.** On 2026-10-06 it shipped the whole
  `react-native-vector-icons` npm package, a second copy of the icon fonts, and an old `test.jsbundle`. Removing
  them, plus compressing images, took the app from **88 MB to 57 MB**. What's left: app binary about 25 MB, frameworks
  13 MB (Hermes 4.6 MB; Facebook SDK pieces about 8 MB, some unused), JS bundle 8 MB, images 5 MB, fonts about 4 MB.

---

## 8. Known open issues

- **Security**
  - A Google Gemini API key was hard-coded in the (now deleted) chatbot and shipped in the live iOS app. It's still
    in git history: **rotate it in Google Cloud**, and call Gemini through the backend if it's used again.
  - Restrict the Google Maps API key (in `AndroidManifest.xml`) to the app in Google Cloud.
- **Backend**
  - Confirm `totalBookingAmount` should be the amount paid including fees.
  - Confirm `/users/reviewData` isn't needed before payment.
  - `GetBuySellProp` and `PropertyMetaData` are imported by screens but exist in neither app's API file.
  - Both apps use the test host `apitest.fracspace.com`.
  - Live apps (2.2.x) still load the old 5.4 MB 4K splash `videos/fracspace_.mp4`. Replace it with the compressed
    file and invalidate it in CloudFront.
- **Performance**
  - Memory on the OPPO test phone after the 2026-10-06 fixes: Home 289 MB (was 479), Property 490 (572), after
    browsing 5 properties 488 (608). The remaining growth is the bounded image cache. Smaller images from the
    backend/CDN would cut it further. Play's memory vitals only update from real users after release.
  - Several views log "shadow but no background colour" advice warnings.
- **Android deep links:** only `https://fracspace.onelink.me` opens the app. `fracspace://`, `fsapp://` and
  `https://fracspace.com` need intent filters if they are used.

---

## 9. Roadmap

**2.3.0**

| Phase | Status |
|---|---|
| 0 Prep (tags, branch) | ✅ |
| 1 Merge on RN 0.73.6 | ✅ device-tested on Android (OPPO) and iPad |
| 2 Android OTA: CodePush → Stallion | ✅ OTA verified on device |
| 3 Upgrade to React Native 0.81 (16 KB, New Architecture, iOS on Hermes) | ✅ tested on both; Play shows "Supports 16 KB" |
| 3+ Memory, cleanup, audio, splash, iOS size, OTP autofill | ✅ tested on both |
| 4 QA on both stores' test tracks (TestFlight; Play internal as versionCode 76+) | next |
| 5 Release 2.3.0, merge to `main`, archive `Fracspace_Android` | |

**After 2.3.0**
- **Move from `react-native-video` to `expo-video`.** Its `audioMixingMode: 'auto'` gives the background-music
  behaviour natively on both platforms, so the patch can go. It needs Expo's core modules (Expo SDK 54 matches
  RN 0.81) and a rewrite of the ~11 video usages. Note: its cache doesn't work with HLS on iOS.
- Optional: `-repackageclasses` in R8 for a "High" DEX obfuscation rating; trim unused Facebook SDK pieces from iOS.
