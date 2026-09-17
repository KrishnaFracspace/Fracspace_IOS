# Concert section — API field reference

Companion to `concert-api-contract.json`. Every field below is already consumed by the app, so nothing here is speculative — the client currently reads these values from a hardcoded file (`Screen/utils/concertData.js`) and will read them from the API instead.

Two endpoints:

| Endpoint | Purpose |
| --- | --- |
| `GET /api/v1/concerts/section` | Everything the home card and the details screen render |
| `POST /api/v1/concerts/{concertId}/interest` | The "I'm Interested" form submission |

---

## 1. `section` — global switches

| Field | Type | Req | Drives |
| --- | --- | --- | --- |
| `enabled` | bool | yes | Master kill switch. `false` hides the home card and blocks the details route entirely. |
| `deepLinkValue` | string | yes | Must stay `"concert_section"` — this is the AppsFlyer OneLink `deep_link_value` the app matches on. Changing it breaks existing shared links. |
| `theme` | object | no | Dark-theme palette. Lets marketing retint the section without an app release. If omitted the app falls back to its built-in palette, so send it only if you want remote control. |

## 2. `concerts[]` — array, not a single object

Sent as an array so a second concert can be added later without a contract change. The app picks the concert whose `deepLink.sub1` matches the incoming deep link, else the first `isActive` entry ordered by `priority` ascending.

| Field | Type | Req | Drives |
| --- | --- | --- | --- |
| `id` | string | yes | Sent back on interest submission. |
| `slug` | string | no | For web/SEO parity. |
| `isActive` | bool | yes | Excluded from the app when `false`. |
| `priority` | int | yes | Sort order when several are active. |
| `publishFrom` / `publishTill` | ISO 8601 | no | Server-side windowing. Please filter server-side rather than relying on the client. |
| `shareUrl` | string (URL) | yes | The OneLink used by the share button on the details screen. |
| `deepLink.value` | string | yes | `"concert_section"`. |
| `deepLink.sub1` | string | yes | Goes into OneLink `deep_link_sub1`; the app forwards it as `concertId`. |
| `interestRegistered` | bool | yes | **Per-user.** `true` makes the CTA render in its already-registered state instead of opening the form. Requires the bearer token; send `false` for anonymous callers. |
| `title` | string | yes | Line 1 of the heading ("Religious India"). |
| `artist` | string | yes | Line 2 of the heading ("Harish Sagane & Band"). Also used in the share message and the form subtitle. |
| `subtitle` | string | yes | One-line tagline under the heading. |

## 3. `branding`

| Field | Type | Req | Drives |
| --- | --- | --- | --- |
| `liveTag.text` | string | yes | Pill on the home video card ("LIVE MUSIC"). |
| `liveTag.showDot` | bool | no | The red dot. Default `true`. |
| `presentsTag.text` | string | yes | Gold gradient pill on the details screen ("FRACSPACE PRESENTS"). |
| `presentsTag.showSparkle` | bool | no | The sparkle glyph. Default `true`. |
| `presentsTag.shine.enabled` | bool | no | Turns the shine sweep on/off. |
| `presentsTag.shine.intervalMs` | int | no | Pause between sweeps. Currently 1500. |
| `presentsTag.shine.sweepMs` | int | no | Duration of one sweep. Currently 1000. |

These are two **separate** strings on purpose — the home card says "LIVE MUSIC", the details screen says "FRACSPACE PRESENTS".

## 4. `media`

| Field | Type | Req | Drives |
| --- | --- | --- | --- |
| `heroImage` | string (URL) | yes | Fixed hero at the top of the details screen. Portrait-safe crop; the top ~110px and bottom ~90px sit under gradient scrims, so keep the focal point centred. |
| `posterImage` | string (URL) | no | Reserved for share cards / notifications. |
| `video.url` | string (URL) | yes | The home card video. **Must be a progressive MP4 (H.264/AAC), not HLS** — it autoplays inline in a small card, so keep it short and under a few MB. |
| `video.poster` | string (URL) | yes | First frame, shown while the video buffers. |
| `video.aspectRatio` | string | no | Informational; the card is fixed at roughly 9:14.5 and crops with `cover`. |
| `video.autoPlay` / `muted` / `loop` | bool | no | Playback defaults. Ship `muted: true` — autoplay with sound is hostile on a home feed. |
| `teaser.enabled` | bool | no | Hides the teaser card when `false`. |
| `teaser.title` | string | yes | "Listen to 30s Teaser". |
| `teaser.subtitle` | string | yes | Second line of the teaser card. |
| `teaser.audioUrl` | string (URL) | yes | **Audio-only file (MP3/AAC), not a video file.** It plays through a hidden player; a video URL works but wastes bandwidth. |
| `teaser.durationSec` | int | no | For a future progress bar. |

## 5. `homeCard`

| Field | Type | Req | Drives |
| --- | --- | --- | --- |
| `enabled` | bool | yes | Shows/hides the floating card without touching the details screen. |
| `dismissible` | bool | no | Whether the X is rendered. Dismissal is session-only — it comes back on the next app open. |
| `hideOnScroll` | bool | no | Whether the card slides away as the user scrolls the home feed. |
| `footerLabel` | string | yes | "View Concert Details". Keep it under ~26 characters or it truncates. |
| `controls.replay` / `playPause` / `mute` | bool | no | Which of the three circular buttons to show. |

## 6. `details.schedule`

| Field | Type | Req | Drives |
| --- | --- | --- | --- |
| `sectionTitle` | string | yes | "TOUR SCHEDULE & CITIES". |
| `defaultCityId` | string | yes | Pre-selected city, and the fallback if the user opens the form without choosing. Must match one of `cities[].id`. |
| `cities[]` | array | yes | One card per tour date, rendered in array order. |

Each city:

| Field | Type | Req | Drives |
| --- | --- | --- | --- |
| `id` | string | yes | Selection key; sent back on submission. |
| `city` | string | yes | Bold city name on the card. |
| `venue` | string | yes | The line next to the location pin. |
| `venueAddress` | string \| null | no | Reserved for a maps link later. |
| `startsAt` | ISO 8601 **with offset** | yes | Source of truth for the date. Please always include the offset (`+05:30`), never a bare local timestamp. |
| `timezone` | IANA string | yes | e.g. `Asia/Kolkata`. |
| `display.month` | string | yes | `NOV` — the date box. Uppercase, 3 letters. |
| `display.day` | string | yes | `14`. |
| `display.weekday` | string | yes | `SAT`. Uppercase, 3 letters. |
| `display.dateLabel` | string | yes | `Saturday, 14 November 2026`. |
| `status.code` | enum \| null | no | Drives badge styling. See enums in the JSON. `null` hides the badge. |
| `status.label` | string \| null | no | Badge text ("Fast Filling", "Early Bird"). |
| `selectable` | bool | no | `false` renders the card but blocks selection. |
| `soldOut` | bool | no | Reserved for a sold-out treatment. |

**On sending `display` alongside `startsAt`:** the app *can* derive the display strings from `startsAt`, but I'd rather it didn't. Marketing has repeatedly wanted to write things like "Sat, 14 Nov" or "Diwali Weekend" instead of the formatted date, and pushing that through the payload avoids an app release each time. `startsAt` stays the machine-readable truth for sorting and reminders; `display` is what humans see. If you'd rather not maintain both, say so and the client will format from `startsAt` and drop `display` from the contract.

## 7. `details.about`

| Field | Type | Req | Drives |
| --- | --- | --- | --- |
| `sectionTitle` | string | yes | "ABOUT THE CONCERT". |
| `paragraphs[]` | array of string | yes | One entry per paragraph, rendered in order with spacing between. |

**Markdown subset:** only `**bold**` is supported inside a paragraph. No links, italics, lists or HTML — anything else renders as literal text. Keep the array to 2–4 paragraphs; the section has no collapse.

## 8. `details.cta`

| Field | Type | Req | Drives |
| --- | --- | --- | --- |
| `label` | string | yes | The sticky gold button ("I'm Interested"). |
| `registeredLabel` | string | yes | Replaces it once `interestRegistered` is `true` ("You're Interested"). |
| `note` | string | yes | Line under the button ("Be first to know when tickets go live."). |
| `interestedCount` | int | yes | Raw number, for analytics and thresholds. |
| `interestedCountLabel` | string | yes | Pre-formatted for display ("4.8k"). Formatting Indian-style abbreviations client-side is a rabbit hole — please format server-side. |
| `interestedNote` | string | yes | Text after the count ("people already registered interest"). |
| `showInterestedCount` | bool | no | Hide the count line entirely while the number is still embarrassingly small. |

## 9. `interestForm`

| Field | Type | Req | Drives |
| --- | --- | --- | --- |
| `title` | string | yes | Sheet heading ("Register your Interest"). The gold subtitle is built from `title` + `artist`, so no separate field. |
| `submitLabel` | string | yes | Button text. |
| `fields[]` | array | yes | Rendered **in array order**. Dropping an entry removes that input. |
| `tickets` | object | no | The stepper card. `enabled: false` hides it. |
| `banner` | object | no | The gold WhatsApp/SMS notice. Supports `**bold**`. |
| `successToast` | object | no | Copy shown after a successful submit. |

Each `fields[]` entry:

| Field | Type | Notes |
| --- | --- | --- |
| `key` | enum | One of `name`, `email`, `phone`, `cityId`. The client maps these to specific inputs, so **new keys need an app release** — send only these four. |
| `type` | enum | `text` \| `email` \| `phone` \| `citySelect`. Sets keyboard and validation. |
| `label` | string | Uppercase label above the input. |
| `placeholder` | string | Grey hint text. Not applicable to `citySelect`. |
| `required` | bool | Drives client-side validation. |
| `maxLength` / `length` | int | `length` on `phone` is exact (10); `maxLength` on text is a cap. |
| `defaultCountryCode` | string | Shown in the `+91` prefix box. |
| `prefillFrom` | string | Where the client sources the initial value: `profile.userName`, `profile.email`, `profile.phoneNumber`, or `schedule.selectedCity`. |

`cityId` renders from `details.schedule.cities` — it is not a separate option list, so the two can never drift.

---

## Notes for the backend team

**Fully dynamic by design.** Every user-visible string — section titles, button labels, form labels, badge text, the banner copy — is in the payload rather than the app binary. That was the explicit goal, so the whole section can be re-themed or re-worded for the next concert with no release.

**Caching.** The payload is small and changes rarely. An `ETag` or `Cache-Control: max-age=300` would let the app skip the round trip on most home-screen loads. The one field that must not be cached hard is `interestRegistered`, since it's per-user — if caching makes that awkward, split it into a tiny separate `GET /concerts/{id}/interest/me`.

**Empty state.** If `section.enabled` is `false` or `concerts` is `[]`, please still return `200` with that shape rather than `404`. The app treats a non-200 as a network failure and retries.

**Idempotency on submit.** A user double-tapping Submit on a slow connection will send twice. Please dedupe on `(userId, concertId)` and return `409` with `interestRegistered: true` rather than creating a second row — the app handles that as a success.

**What isn't in this contract.** Ticket pricing, seat maps, and actual booking. This is interest capture only, matching the current UI. When booking goes live it'll want its own endpoint, and `details.cta` will need a new state beyond "interested".
