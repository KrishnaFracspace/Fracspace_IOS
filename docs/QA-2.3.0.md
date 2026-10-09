# 2.3.0 manual test plan

Build under test: **2.3.0** — Android versionCode **76**, iOS build **46**, from `release/2.3.0`.

**Rules while testing**
- **PayU is live. Never complete a payment.** Go as far as the PayU page / UPI app, then cancel.
- Use a **throwaway account** for Delete Account and anything that changes account data.
- Test on: an **Android phone** (Android 13+; ideally also one on Android 15+), a **real iPhone** (TestFlight), and
  the **iPad** if available. Layout issues seen only on the iPad (resizable window) should be re-checked on the iPhone.
- Tick each box; note the device for any failure, with a screenshot.

---

## 1. Install and upgrade
- [ ] **Upgrade (most important):** install the **live store version**, log in, then install 2.3.0 over it.
      You stay **logged in**, Home loads with your data, no crash. (Android: internal-testing track; iOS: TestFlight.)
- [ ] **Fresh install:** uninstall, install 2.3.0, log in. Book screen shows your name/email/phone (first-login fix).
- [ ] App icon, name and version (Profile bottom: "V 2.3.0") are correct.

## 2. Launch
- [ ] Splash video plays full screen (no white bands), smooth, then Home/Login.
- [ ] With **music playing** in another app: the splash and the muted Home concert card do **not** stop the music.
- [ ] Notification permission prompt appears once (Android 13+ / iOS), "Allow" works.
- [ ] Airplane mode on → "No internet" overlay; off → app continues where it was.

## 3. Login and signup
- [ ] **Indian number:** Get OTP → Android shows the "Allow" sheet → code fills and logs in by itself.
      iOS: code suggestion above the keyboard → one tap → logs in.
- [ ] Tap **Deny** (Android) → type the code → logs in on the 6th digit, no double "Invalid OTP".
- [ ] Wrong OTP → error; fix one digit → submits again.
- [ ] Back arrow on the OTP step → change number → boxes are empty.
- [ ] "Send me a new OTP" clears the boxes; the new SMS fills again.
- [ ] **Non-Indian number** (email OTP) login works.
- [ ] Signup with a new number works the same way.

## 4. Home
- [ ] Status bar: **white icons** on the navy Home header (iPhone and Android 15+).
- [ ] Banners/carousel auto-scroll; category tiles open their screens (Co-Own, Packages, Stays…).
- [ ] Concert card plays muted; unmute → music in other app pauses; mute → it resumes. Card → Concert details.
- [ ] iPhone: open Control Center over Home → concert card keeps its place (no reload).
- [ ] Testimonials: thumbnail + spinner, then video (no black box); switch to another and back → resumes.
- [ ] Side menu: all items open; About/Privacy/Terms open.

## 5. Property
- [ ] Property page: images auto-slide, hero video plays, **Availability** pill shows "N Frac" in full, centred.
- [ ] "Location highlights" list scrolls and **all buttons on the page still respond** (iOS).
- [ ] Brochure/PDF opens and closes (close it while still loading too).
- [ ] Enquire form: keyboard doesn't cover the field/button; submit works.
- [ ] Share property works.

## 6. Book → payment (cancel only)
- [ ] Book: name, email, phone and **address** (one line, "…" if long) are shown; amounts look right for 1 and 2+ fracs.
- [ ] Continue → PayU page loads (Android and iOS).
- [ ] **UPI:** "Pay using any UPI App" → app chooser → pick an app → **cancel in the app** → back in Fracspace,
      you see a cancelled/failed summary, **no money taken**.
      (Known: PayU's individual app tiles — Google Pay, PhonePe — do nothing inside the app; PayU-side.)
- [ ] Cancel on the PayU page → summary says cancelled.
- [ ] Android back on the PayU page → "leave payment?" confirmation.
- [ ] Summary → "Back to Home" → Home (back button doesn't return to the payment).

## 7. Concert
- [ ] Concert details: teaser audio play/pause; music in another app pauses/resumes correctly.
- [ ] Checkout → review → PayU → "Pay using any UPI App" → cancel → app shows the right status; booking is
      resumable from My bookings (don't pay).
- [ ] Interest form (if shown) submits.

## 8. Altaira / Dreamscape / videos
- [ ] Discover Altaira: intro shows spinner + Skip, never freezes; Skip works.
- [ ] Altaira experience page: no "Enter Image from Backend" text; livestream button opens Live Stream.
- [ ] Video Tour and Live Stream play; leaving the screen stops the video.
- [ ] Dreamscape home, Our stays, room listing/select room: pills and round buttons look right (iPhone).

## 9. Portfolio, Wallet, Escape
- [ ] Portfolio (verified user): data loads; status bar icons **dark**. Unverified user: empty state centred (iPhone).
- [ ] Wallet: balance and transactions load; wallet animation plays.
- [ ] Withdraw: open the form, enter bank details, reach the OTP step → **stop** (don't confirm a real withdrawal
      unless you intend to). OTP boxes look right; keyboard doesn't cover them.
- [ ] Transfer / sell / exit flows: open them up to the OTP/confirm step, then back out.
- [ ] Escape membership: page loads; Continue → payment page → **cancel**.

## 10. Profile
- [ ] Profile loads; status bar white icons on navy.
- [ ] Change profile photo with a **camera photo** (iPhone) → uploads and shows.
- [ ] Verification (unverified throwaway account): upload Aadhaar PDF + **camera photos** for PAN/cheque on iPhone → submits.
- [ ] Complete profile: photo + address save.
- [ ] **Logout** (Profile) → Login screen; log back in → your data (not the previous user's).
- [ ] **Delete Account** → Cancel closes; (throwaway account) Delete → success toast → Sign up.
- [ ] Help & Support: WhatsApp and call buttons open.

## 11. Push notifications (Firebase console → "Send test message")
Get the device token from a development build (long-press the version in Profile), or ask the backend.
Custom data `deep_link_value` = `portfolio_section`, `profile_section`, `dreamscape_section`, `property` (+ `deep_link_sub1` = property id), `concert_section` (+ id), `wallet_section`, `escape_section`.
- [ ] **App closed** → tap → opens the right screen after the splash.
- [ ] **App in background** → **pop-up at the top** (Android) / iOS banner → tap → right screen.
- [ ] **App open** → top banner, disappears after ~5 s; tap → right screen.
- [ ] **Logged out** → tap → Login → after login, the right screen.
- [ ] A push **without** custom data just opens the app.
- [ ] Notifications screen lists recent notifications (45 days); tapping items works.

## 12. Deep links
- [ ] An AppsFlyer property link (`fracspace.onelink.me/...`) opens the property (logged in and logged out).
- [ ] A payment link opens Book.

## 13. Device / OS checks
- [ ] Android 15+: status bar readable on every screen; keyboard doesn't cover inputs in pop-ups.
- [ ] Small-screen Android and iPhone SE-size: no cut-off buttons on Login, Book, payment pages.
- [ ] Rotate on Live Stream (Android) works; other screens stay portrait.
- [ ] Battery/heat: 10 minutes of normal use, no unusual heat; leaving Home stops banner timers.

## 14. Before pressing "release"
- [ ] Play: AAB **versionCode 76** → internal testing first; App bundle explorer says **"Supports 16 KB"**.
- [ ] Play **Data safety** and App Store **privacy labels** match `ios/PrivacyInfo.xcprivacy` (12 data types, no tracking);
      advertising ID = yes (AppsFlyer).
- [ ] App Store Connect: **build 46** unused for 2.3.0.
- [ ] **Stallion:** release OTA bundles **only to 2.3.0** — never to 2.2.x (crashes old iOS apps).
- [ ] **Keep the RevoPush/CodePush deployment live** for Android users still on 2.2.x.
- [ ] Backend `appVersion`: set the new current versions with **forceUpdate = false** (users on Android 6 /
      iOS below 15.1 can't install 2.3.0).
- [ ] Backend team aware: booking records now carry the real paid amount, frac count and `mihpayid`, and may be `Failed`.
- [ ] Ask PayU to enable app-specific UPI intent (Google Pay/PhonePe tiles) for in-app checkout.
- [ ] Rotate the Gemini API key; restrict the Google Maps key.
