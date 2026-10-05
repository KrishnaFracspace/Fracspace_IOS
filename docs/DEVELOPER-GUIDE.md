# Fracspace app — developer guide

One React Native codebase for **iOS and Android** (since release 2.3.0). Before that, iOS lived in this
repo and Android in a separate repo (`Fracspace_Android`). This guide covers how the project is set up
now, the conventions to follow, and what changed in the merge.

- Merge details, per-file decisions and the production bugs found: [`docs/merge-2.3.0/MERGE-NOTES.md`](merge-2.3.0/MERGE-NOTES.md)
- Last updated: 2026-10-05 (end of merge Phase 2)

---

## 1. Repos, branches and tags

| What | Where | Status |
|---|---|---|
| **The merged app (2.3.0)** | this repo, branch **`release/2.3.0`** | All active development. Not released yet. |
| iOS before the merge | this repo, `main`, tag `pre-merge-ios` | Matches the iOS app before the merge. |
| Android 2.2.3 | `Fracspace_Android`, `release/2.2.3`, tag `pre-merge-android` | On Play internal testing only. **Don't merge into `master` until it is live.** |
| Android before the merge | `Fracspace_Android`, `master` | Matches the live Play Store app (2.2.2). |

**Develop in this repo only.** `Fracspace_Android` is just for an emergency fix to the current live
Android app, and will be archived once 2.3.0 ships on both stores.

App identifiers stay different per platform: Android `com.fracspace`, iOS `com.fracspace.fracspace`.

---

## 2. Setting up and building

### Install
```bash
npm install
cd ios && LANG=en_US.UTF-8 pod install && cd ..
```
- `.npmrc` sets `legacy-peer-deps=true`.
- `postinstall` runs **patch-package**. `patches/react-native-pdf+6.7.7.patch` fixes a PDF crash ("Already closed"
  when leaving a PDF that's still rendering). Don't delete it until react-native-pdf is on 7.x.
- `pod install` fails on Ruby 4 unless the shell locale is UTF-8 (`LANG=en_US.UTF-8`).

### Android signing
- Release keystore: `android/app/fracspace.keystore` (git-ignored; keep a backup).
- **Keystore passwords are not in the repo.** Put them in `~/.gradle/gradle.properties`:
  ```
  MYAPP_UPLOAD_STORE_PASSWORD=...
  MYAPP_UPLOAD_KEY_PASSWORD=...
  ```
  The store file name and key alias are still in `android/gradle.properties`.
- Upload key SHA-1 must match Play Console: `A0:F8:96:E1:96:5A:73:5B:85:47:AF:53:95:5A:E8:22:EE:62:FA:76`.

### Builds
```bash
# Android release (signed, R8)
cd android && ./gradlew assembleRelease      # APK
cd android && ./gradlew bundleRelease        # AAB for Play
```
- If Gradle can't find the SDK: `export ANDROID_HOME=$HOME/Library/Android/sdk`.
- iOS from the command line needs `ARCHS=arm64` for the simulator, because the Podfile excludes
  x86_64 simulator builds.

### Line endings
Many JS files are **CRLF**. Keep each file's existing line endings, or the diff marks every line as changed.

---

## 3. Dependencies

One `package.json` for both platforms. **These are pinned on purpose. Don't upgrade them until the
React Native 0.81 upgrade**, because newer versions need RN 0.74+ and break the Android build:

| Package | Pinned | Why |
|---|---|---|
| react-native-gesture-handler | `~2.20.2` | 2.28+ needs RN 0.79 / AGP 8.6 |
| react-native-svg | `~15.12.0` | 15.14 needs RN 0.74 |
| @react-native-community/datetimepicker | `7.7.0` | 7.6.x doesn't compile on iOS with RN 0.73 |
| @react-native-firebase/* | `20.3.0` (all the same) | Must all match `@react-native-firebase/app` |
| react-native-share / react-native-fbsdk-next | `12.0.9` / `13.4.1` | Versions Android shipped with |

Removed in the merge: `openai` (unused), `payu-non-seam-less-react` (native PayU SDK was never used; payments
use a PayU WebView), `react-native-capture-protection`, `react-native-screenshot-prevent` (only used in
commented-out code), `react-native-code-push` (replaced by Stallion).

Android also pins `io.legere:pdfiumandroid:1.0.32` in `android/app/build.gradle`, for 16 KB-aligned PDF libraries.

---

## 4. Writing code that works on both platforms

Most screens came from the iOS app. Android-specific behaviour is behind `Platform.OS === 'android'`.

- **`SafeAreaView`: import it from `react-native-safe-area-context`.** The one in `react-native` does nothing on
  Android, and the app is edge-to-edge there (targetSdk 36).
- **Fonts: use the real file name** as `fontFamily` (`'WorkSans-SemiBold'`, `'Montserrat-Medium'`), not
  `'Work Sans'` plus `fontWeight`. Android needs the exact file name.
  - Fonts live in `Screen/assets/fonts`.
  - **When you add a font, also copy it to `android/app/src/main/assets/fonts`.** iOS lists fonts in `Info.plist`.
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
- **Don't trust a fix that's only tested on iOS.** Before merging, run release builds on both platforms.

---

## 5. App behaviour you should know about

### App shell (`App.js`, `Screen/Navigation/NavigationStack.js`)
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

### Navigation
- **Not registered (hidden):** `AISearchScreen` (Gemini chatbot), `CameraScreen` (CCTV; points at a LAN address)
  and `ChatBoat` (LAN Ollama server). The files are still in the repo.
- **Aliases**, so old Android or backend screen names keep working:

  | Old name | Opens |
  |---|---|
  | `SelectRoomFS` | `SelectRoom` |
  | `LabelsDescription` | `LablePropertyDis` |
  | `IntroAnim` | `LableProperty` |
  | `PdfViewerScreen` | `PdfViewer` (`PdfScreen` accepts `{pdf}` or `{url}`) |
  | `PropertyImages` | `Label` |
  | `EdgeFab` | `trails` |

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

### API and state additions
- **`Screen/Services/UserApi.js`:** `ConstructionForm`, `PropertyMetaDataApi`, `ChangePropertySoldOutStatus`
  and `AltairaExp` were added; `GetLabelsProp` now uses `v1/altaira/getAllProperties`.
- **`AppContext`:** `prior`, `AllProperty`, `altairaPromo`, `pendingDeepLinkType`, `pendingDeepLinkId` and `location` were added.

---

## 6. OTA updates (Stallion)

- **Native setup:**
  - Android: `MainApplication.kt` returns `Stallion.getJSBundleFile(...)`; `strings.xml` has `StallionProjectId` and `StallionAppToken`.
  - iOS: `AppDelegate.mm` uses `StallionModule getBundleURL`; `Info.plist` has the same two keys.
- **Publish a bundle.** The CLI must be logged in to the **Fracspace** Stallion account; another account fails with "org access denied".
  ```bash
  npx stallion login
  npx stallion publish-bundle --upload-path=fracspace/fracspace/fracspace1 --platform=android --entry-file=index.js
  npx stallion publish-bundle --upload-path=fracspace/fracspace/fracspace1 --platform=ios --entry-file=index.js --hermes-disabled true
  ```
  - iOS currently runs on JavaScriptCore, hence `--hermes-disabled true` (until iOS moves to Hermes).
  - Publishing only uploads to the bucket. **Releasing to an app version is a separate step** (`release-bundle` or the Stallion Console).
- **Test an OTA bundle on a device:**
  - Open Stallion's in-app menu by calling `useStallionModal().showModal()`; add a temporary trigger.
  - Log in with the project's SDK PIN (Stallion Console → Project Settings → Access Tokens).
  - Testing → bucket → download → the app restarts.
  - Switch back with **Production**, then fully restart the app.
- **Never ship native changes over OTA** (new native libraries, Gradle, Podfile, manifest or Info.plist). Those need a store build.
- **Keep the old RevoPush/CodePush deployment live** until Android users on 2.2.2/2.2.3 have updated to 2.3.0 from the Play Store.

---

## 7. Android release hardening

- **R8 is on.** Keep rules are in `android/app/proguard-rules.pro`: pdfium and the PDF viewer, AppsFlyer, Stallion,
  and readable Crashlytics stack traces. If a crash happens in release but not debug, suspect a missing keep rule.
- **minSdk 23** (Android 6.0), targetSdk 36.
- The AAB includes native symbol tables, and Crashlytics uploads native symbols.
- **Play 16 KB page size:** still "not supported" while on RN 0.73. Its core libraries are 4 KB-aligned. The
  RN 0.81 upgrade fixes this and **must ship before 1 Feb 2027** (Play blocks non-compliant updates after that).

---

## 8. Known open issues

- **Security**
  - A Google Gemini API key is hard-coded in `Screen/Version2_O/chatboat/APIChatBoat.js` and shipped in the live
    iOS app. Rotate it, and call Gemini through the backend.
  - Release builds print the JWT and FCM tokens to the device log. Strip `console.*` from release builds.
  - Restrict the Google Maps API key (in `AndroidManifest.xml`) to the app in Google Cloud.
- **Backend**
  - Confirm `totalBookingAmount` should be the amount paid including fees.
  - Confirm `/users/reviewData` isn't needed before payment.
  - `GetBuySellProp` and `PropertyMetaData` are imported by screens but exist in neither app's API file.
  - Both apps use the test host `apitest.fracspace.com`.
- **Performance**
  - The Android app uses 600–800 MB of memory (Play vitals flags memory); video and WebViews are the likely causes.
  - iOS `AppDelegate.mm` reads the whole JS bundle on every launch just to log it.
  - Several views log "shadow but no background colour" advice warnings.
- **Android deep links:** only `https://fracspace.onelink.me` opens the app. `fracspace://`, `fsapp://` and
  `https://fracspace.com` need intent filters if they are used.

---

## 9. Roadmap for 2.3.0

| Phase | Status |
|---|---|
| 0 Prep (tags, branch) | ✅ |
| 1 Merge on RN 0.73.6 | ✅ device-tested on Android (OPPO) and iPad |
| 2 Android OTA: CodePush → Stallion | ✅ OTA verified on device |
| 3 Upgrade to React Native 0.81 (16 KB, New Architecture, iOS on Hermes, unpin libraries, react-native-pdf 7) | next |
| 4 QA on both stores' test tracks | |
| 5 Release 2.3.0 (Android versionCode 75+, iOS build 46+), merge to `main`, archive `Fracspace_Android` | |
