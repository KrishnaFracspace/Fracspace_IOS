# Unused files: cleanup checklist (2026-10-06)

Checked on branch `upgrade/rn-0.81` (6e92c14).

**How this was checked:**
- The list comes from a production JS bundle for Android and for iOS. Metro's source maps list every file that really ends up in the app.
- Each screen route was checked for whether anything opens it, either from code or from the backend. Backend screen names were read from `getCarouselUi`.
- Native folders (`ios/`, `android/`) were checked against the Xcode project, the Podfile and Podfile.lock.

**Status (2026-10-06):** every item marked Yes below has been removed, along with its imports and routes. Items left blank or marked No were kept on purpose. The 127 unused fonts (section 4) and the font-name typos are also done.

---

## 1. Not in the app at all (no file imports them)

Safe to delete. Metro never bundles these files.

| File / folder | What it is |
|---|---|
| [Yes ] `Screen/Version2_O/chatboat/` (3 files) | Old AI chatbot. **`APIChatBoat.js` contains the Gemini API key.** Deleting the file doesn't revoke it, because it stays in git history, so rotate the key too. |
| [ Yes] `Screen/components/newscrren.js/new.js` (folder misnamed `.js`) | 1,062-line scratch copy |
| [ Yes] `Screen/Version2_O/new.js` | 3,367-line scratch copy |
| [ Yes] `Screen/Version2_O/trails.js` | Experiment. The `trails` route uses `FloatingButton`, not this file. |
| [Yes ] `Screen/components/CCTVView.js` | CCTV WebView to a LAN IP |
| [Yes ] `Screen/assets/camera-sdk/` (8 files, 2 MB) | Used only by CCTVView (H.265 decoder JS) |
| [Yes ] `Screen/utils/rag.ts`, `Screen/utils/utils.ts`, `Screen/utils/cosineSimilarity.js` | Chatbot RAG helpers |
| [ Yes] `backendData/` (`server.js`, `embeddings.js`, `ai_data.json`) | Node server for the chatbot, not part of the app |
| [Yes ] `Screen/Share.js` | Old screen, not imported |
| [Yes ] `Screen/GlobalStyles.js` | Not imported |
| [Yes ] `Screen/components/CustomCarosel.js` | Not imported |
| [Yes ] `Claude outputs/` (2 .md) | Notes (concert port guide, payment backend spec). Move to `docs/` if you want to keep them. |
| [ Yes] `.apple-app-site-association.swp` | Vim swap file committed by accident |

## 2. Imported, but never shown (dead code behind an unused import or route)

The import exists, but nothing renders the component or opens the route. Delete the file **and** its import/route line. I'll do that part.

| File | Why it's dead |
|---|---|
| [ Yes] `Screen/Policy.js` | Imported in NavigationStack, never used |
| [ ] `Screen/CustomModal.js` | Imported in 10 files, rendered in none |
| [ Yes] `Screen/Footer.js` | Imported in 5 files, every `<Footer>` is commented out |
| [ Yes] `Screen/Contact.js` | `Contact` route never opened; `<Contact/>` commented out |
| [ Yes] `Screen/components/Stipper.js` | Imported in Property.js, not rendered |
| [ Yes] `Screen/components/propertyDEtails.js/InvestMentcards.js` | Same |
| [ Yes] `Screen/components/propertyDEtails.js/PaymentPlan.js` | Same |
| [ Yes] `Screen/ForgotPassword.js` | Route `ForgotPassword` never opened (the content is actually a refund-policy page) |
| [ Yes] `Screen/Documents.js` | Route never opened (the only `navigate('Documents')` is commented out) |
| [ Yes] `Screen/GuestBookingDetails.js` | Route never opened |
| [ ] `Screen/VideoDisplay.js` | Route never opened |
| [ ] `Screen/Version2_O/PackageDescription.js` | Route never opened |
| [ Yes] `Screen/Version2_O/PopularDestination.js` | Route never opened |
| [ Yes] `Screen/Version2_O/CustomersReview.js` | Route never opened |
| [ Yes] `Screen/Version2_O/PayUPaymentgateway.js` | Route never opened (payments go through PaymentPage / ConcertPaymentPage) |
| [ Yes] `Screen/Version2_O/CumulativeEarning.js` | Route never opened (10-line stub) |
| [ Yes] `Screen/Version2_O/escapeMembership/ViewAgreement.js` | Route never opened |
| [ Yes] `Screen/Version2_O/assets/imagevideo.png` | Only used by one of the dead screens above |

**Check before deleting this group:** push notifications can open a screen by name (`NotificationsScreen` → `item.screen`). If marketing ever sent a push pointing at one of these screens, ask the backend team. The carousel API currently sends only these names, all of which are live and **kept**:
- `Home`
- `Packages`
- `InteriorForm`
- `DreamscapeHome`
- `LiveStream`
- `IntroAnim`
- `LableProperty`

## 3. Images and videos nothing uses (27 MB of repo)

These are **not** inside the app today, because Metro only ships images that code requires. Deleting them only shrinks the repo.

- [ Yes] `Screen/Version2_O/assets/videoscreen.mp4` (18 MB)
- [ No] `Screen/assets/Demovideo.mp4`
- [ Yes] `Screen/Version2_O/assets/`:
  - `IntroImg.png`, `home1.png`, `home2.png`, `home3.png`
  - `Image2.png`, `Image3.png`
  - `NewProfileimage.jpg`
  - `Ellipse.png`, `Dream.png`, `label.png`, `Group.png`
  - `Rectangle3.png`, `Rectangle30.png`
  - `DC5316B4-…_c.jpeg`
  - `ComingSoon1.png`, `Frac.png`, `Sport.png`
  - `googleImage.png`, `LayerPer.png`, `FaceBookImage.png`, `AppleImage.png`
  - `Reco.png`, `Verified.png`, `Layer1.png`, `Layer8.png`, `Mask group.jpg`
- [yes ] `Screen/assets/`: `imagePan2.png`, `HotProperty.png`, `Rectangle6369.png`, `rise.jpeg`
- [ yes] `Screen/Version2_O/altaira/3DE6C85A-…_c.jpeg`

## 4. Fonts: 127 of 144 unused (~16 MB **inside the app**, on both platforms)

This is the biggest win: it makes the app download smaller. Only these 17 are used in code:

- **WorkSans:** Regular, Medium, SemiBold, Bold, Italic
- **Montserrat:** Regular, Medium, SemiBold, Bold
- **Poppins:** Regular, Medium, SemiBold, Bold
- **OpenSans:** SemiBold, Bold, ExtraBold
- **Barlow:** Medium

Every other font is unused. That covers Gotham, Futura, Gilroy, ProductSans, OpenSans_Condensed and OpenSans_SemiCondensed entirely, plus the unused weights and italics of the families above. The fonts are copied in three places:
- `Screen/assets/fonts`
- `android/app/src/main/assets/fonts`
- the iOS project and Info.plist

I'll remove them from all three together.

Typos found while checking: these names fall back to the system font today.

| In code | Should be |
|---|---|
| `Poppins-Meidum` (×9) | `Poppins-Medium` |
| `WorkSans-Medimu` | `WorkSans-Medium` |
| `WorkSans-regular` | `WorkSans-Regular` |
| `Monserrat-Regular` | `Montserrat-Regular` |

## 5. Native leftovers

| | What | Status |
|---|---|---|
| [Yes ] `ios/LocalPods/BoringSSL-GRPC/` (1,004 files, 19 MB) | Not in Podfile or Podfile.lock | Unused. The `BoringSSL-GRPC` block in the Podfile's `post_install` is dead too. |
| [Yes ] `ios/assets/` (58 files, 11 MB) | Old output of a manual `react-native bundle --assets-dest` | Not referenced by the Xcode project. Xcode bundles images at build time. |
| [Yes ] `ios/Fracspace 2026-01-24 13-43-01/` | Xcode export folder (3 plists/logs in git, plus a 53 MB `.ipa` on disk) | Not needed |

## 6. npm packages not used by any JS (can be uninstalled)

- [ Yes] `react-native-chart-kit`: the import in MonthlyInsight is unused
- [ Yes] `react-native-share`
- [ ] `react-native-reanimated-carousel`
- [ Yes] `react-native-virtualized-view`
- [ ] `react-native-permissions`
- [ Yes] `react-native-modal-datetime-picker` + `@react-native-community/datetimepicker`: the app uses `react-native-date-picker`
- [ ] `@react-native-firebase/installations`

**Keep** these: they work natively with no JS import.

| Package | What it does natively |
|---|---|
| `@react-native-firebase/crashlytics` | crash reports |
| `@react-native-firebase/in-app-messaging` | Firebase console campaigns |
| `react-native-fbsdk-next` | Meta app events and ad attribution |

## Keep (look unused but aren't)

- `babel.config.js`, `metro.config.js`, `react-native.config.js`, `stallion.config.js`, `tsconfig.json`, `jest.config.js`, `.eslintrc.js`, `.prettierrc.js`, `.npmrc`, `.watchmanconfig`, `Gemfile`/`.bundle`: build and tooling config.
- `Screen/Version2_O/SelectRoom.js` (also the `SelectRoomFS` alias) and `PdfScreen.jsx` (also the `PdfViewerScreen` alias): kept on purpose for old backend screen names.
- `Screen/Version2_O/altaira/LiveStream.js`: opened from the backend carousel.

## Small code cleanups (no file deletion)

- `Screen/Version2_O/Ourstay.js:8` imports `./DreamscapeApi`, which doesn't exist. It only builds because the import is unused and stripped. Remove the line.
- `Screen/Property.js` has 6 unused imports, `HomeStack.js` 1, `PaymentSummaryScreen.js` 1, `Like.js` 3, `Profile.js` 3, and so on. These get cleaned when their files are removed.
