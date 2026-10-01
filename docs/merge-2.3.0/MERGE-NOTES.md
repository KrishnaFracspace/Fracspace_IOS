# Release 2.3.0 — Android + iOS merge notes

Branch `release/2.3.0` in this repo (Fracspace_IOS). Base = iOS `main` (tag `pre-merge-ios`).
Android source = Fracspace_Android `release/2.2.3` (tag `pre-merge-android`), read-only.
Phase 1 merges on React Native 0.73.6; Phase 3 upgrades to 0.81.

## Done so far
| Commit | What |
|---|---|
| `e4a3b2e` | Production `android/` project (com.fracspace 2.2.3/74, R8 rules, pdfium pin) replaces the iOS repo's template stub. Signing passwords moved to `~/.gradle/gradle.properties`. |
| `0d87482` | One `package.json` for both platforms. Android-used libs added, `openai` and the unused native PayU SDK dropped, versions pinned so both platforms build on RN 0.73 (gesture-handler 2.20.2, svg 15.12, datetimepicker 7.7.0, firebase 20.3.0). Android `assembleDebug` and the iOS simulator build both pass. |

## Status (2026-10-01)
- **Phase 1 code complete** on RN 0.73.6: commits `664e223` … `e24bd90` (JS merged area by area, Android
  light theme + default black text, POST_NOTIFICATIONS, UPI `<queries>`, all 144 fonts, Android input/OTP sizing).
- Android: signed release build tested on a device (OPPO CPH2643) by the owner — all flows OK, UI issues fixed.
- iOS: simulator build passes; **not yet run on a device**.
- Next: iOS device check → Phase 2 (Android OTA CodePush → Stallion) → Phase 3 (RN 0.81).

## How the two codebases compare
- No shared history or common ancestor, so this is a 2-way merge done file by file.
- 119 shared code files (code tokens compared, comments ignored):
  - 35 are identical apart from whitespace
  - about 37 are 95–100% the same
  - about 20 are 85–95% the same
  - about 27 are below 85%
- About 15 renamed or moved pairs, such as `component/`→`components/`, `NewSign`↔`NewSigin`, `SelectRoomFS`↔`SelectRoom`.
- About 40 code files exist on only one side.

**General rule:** take the iOS file, then port what Android has that iOS lacks. iOS is newer almost everywhere (concert, redux, new designs). Android-only work is kept by one of these:
- porting it into the iOS file (bug fixes, guards, features),
- `Platform.OS === 'android'` for things that really are platform-specific (hardware back, POST_NOTIFICATIONS, CodePush, status bar),
- dropping it, when iOS already replaced it.

## Bugs found in the current production apps
These are live today. The merge fixes them; the money ones are worth an iOS OTA hotfix sooner.

**Money and booking (iOS `Screen/PaymentPage.js`):**
- `bookFraction` always records **1 frac** (`numberOfFractions: Property?.numberOfFractions || 1`, and that field doesn't exist).
- `totalBookingAmount` / `payUpayment.amount` are the price of **one frac**, not what was paid.
- `mihpayid` is hard-coded to `'MHP12345'`.
- The booking is marked **Success from the redirect URL alone**. Android verifies with PayU up to 3 times first.
- The charged amount itself is the same formula on both platforms, so customers pay correctly. What's wrong is the booking record.

**Crashes in iOS code (hit both platforms once merged):**
- `Platform` is used without being imported in Property.js (enquiry modal, the only CTA for non-INR properties), Dashboard.js (sell flow), Transfer.js (OTP modal) and MonthlyInsight.js (exit feedback).
- Property.js NEW LAUNCH card: `globalState.ProDetails.filter`, and `ProDetails` is never set.
- Dashboard: `phoneNumber.startsWith` crashes for email-only users, and `ownershipDocuments.length` crashes when the field is missing.
- BookingHistory "Cancel booking" is missing its imports, so it silently does nothing.
- BookNow (non-+91 verification) reads `PickedPan[0]` when nothing was picked, so the spinner runs forever.
- WalletAmount shows "withdrawal submitted" even after a failed withdrawal.
- `ConstructionForm` and `PropertyMetaDataApi` are called by iOS screens but missing from iOS UserApi.
- Membership: "View full agreement" can never open. The offer amount can be NaN.
- Property image auto-slide never runs (effect reads `images` declared after the early return).

**Security:**
- A **Google Gemini API key is hard-coded** in `Screen/Version2_O/chatboat/APIChatBoat.js`. Rotate it in Google Cloud and move the call behind the backend.
- Both apps use `https://apitest.fracspace.com/api/` with a static `x-api-key`. Confirm the test host is intended for production.

**Dead or unsafe screens:**
- `CameraScreen` (CCTV) is a WebView to `http://192.168.0.9:8080`.
- `ChatBoat` posts to a LAN Ollama server `http://192.168.1.105:11434`.
- Neither is reachable from a static path, but the backend could still send those screen names.

## Android behaviour the iOS code is missing (all ported)
- **Hardware back:**
  - exit the app on Home;
  - confirm before leaving the payment page;
  - `onRequestClose` on modals so back closes them.
- **Notification permission:** request POST_NOTIFICATIONS on Android 13+. `messaging().requestPermission()` doesn't prompt on Android.
- **Wrong platform values:**
  - the update check compares against `iosCurrentVersion`, so Android needs `androidCurrentVersion`;
  - the store links, the "App Store" text in About, and the update button link all need Play Store values on Android.
- **Payment page on Android:**
  - UPI / `intent://` handoff with an app-not-found alert;
  - PayU cookies and `baseUrl`, using `ConcertPaymentPage.js` as the template.
- **Layout:** `SafeAreaView` from `react-native-safe-area-context`, since the core one does nothing on Android and targetSdk 36 is edge-to-edge.
- **Login and signup:**
  - `autoComplete="sms-otp"` for OTP autofill;
  - no duplicate home route after login.
- **App-level setup from Android:** screen-view analytics, `GestureHandlerRootView`, `import 'react-native-gesture-handler'`.
- **OTA:** stays split. Stallion on iOS, CodePush on Android, both behind `Platform.OS`, until Phase 2 moves Android to Stallion.

## Android-only files
- **Kept:**
  - `NoInternet` (+ `NoInternet.png`)
  - `Commingsoon.png`
  - the API functions `ConstructionForm`, `PropertyMetaDataApi`, `ChangePropertySoldOutStatus`, `AltairaExp`
  - corrected `GetLabelsProp` URL
- **Dropped** (dead on Android or replaced by iOS):
  - `DeepLinkHandler`: iOS App.js handles the same links
  - `BookingProcessing`, `BookingSuccess`, `BookingFailure`: logic ported into PaymentPage, UI replaced by `PaymentSummaryScreen`
  - `RentalBook`, `CostumerDetail`, `CownHome`, `CownPropertyList`, `Visitor`, `Location`
  - `BoardingScreen`, `Test` (= `CardConverter`), `Version2_O/Footer`, `VideoDispay`
  - `IntroAnim`, `LabelsDescription`, `LabelsProperty`, `PropertyImages`, `SelectRoomFS`, `PdfViewerScreen`: iOS equivalents exist
- **Backend-driven screen names:** Android-only names (`SelectRoomFS`, `LabelsDescription`, `PropertyImages`, `IntroAnim`) get registered as aliases of the iOS screens, so old backend values keep working.

## Decisions (owner, 2026-10-01)

**Booking record after PayU**
- Verify with PayU (3 tries, 2 s apart), then record the real data:
  - the frac count;
  - `totalBookingAmount` = the amount actually paid, including fees;
  - the real `mihpayid`;
  - `bookingStatus` taken from the verification result.
- Verified failures are still saved as `Failed`.
- Keep iOS's `PaymentSummary` screen.

**Other owner decisions**

| Area | Decision |
|---|---|
| iOS hotfix of the booking bug | No. Fixed in 2.3.0 only. |
| AI and CCTV | Hide `AISearchScreen` (Gemini; the key must be rotated and the call proxied through the backend), and unregister `CameraScreen` and `ChatBoat`. |
| Android dark mode | Force the Light theme. |
| Offline | NoInternet as an overlay on both platforms; navigation state is kept. |
| Push while app is open | Alert on both platforms, only when the message has a title or body. |
| Owner Sold Out / Rent Out button | Dropped. |
| Non-Indian profile verification | Android's form: bank account and branch fields, PDF or photo for PAN and cheque. |

**Defaults chosen (tell me to change any)**

| Area | Default |
|---|---|
| Splash | 4 s |
| Analytics | `app_open` event; screen-view logging on both |
| Deep link | property id = `af_sub2 \|\| deep_link_sub1 \|\| af_sub1` |
| Deep link: install conversion | Acts only on first launch |
| Share link | iOS referral link; Android `property_share` link when there's no referral code |
| CodePush (Android) | The HOC only (no second manual sync), until Phase 2 |
| Location permission | Asked when the map is opened, not at launch |
| LiveStream | iOS UI, not muted, plus `onError`. Neither app had screenshot protection active, so `react-native-capture-protection` and `react-native-screenshot-prevent` are removed. |
| Altaira "I'm interested" | Send the enquiry first, show thank-you only on success (Android) |
| Label / Altaira flow | iOS screens; Android names kept as navigation aliases |
| Signup phone format | Unchanged (iOS) |
| `reviewData` | Not called (iOS). Backend to confirm it isn't needed. |
| PayU amount | Rounded to 2 decimals before sending |
| Dashboard guest-booking filters | Android's (latest year preselected, only months with revenue) |
| Everything else | The iOS version |
