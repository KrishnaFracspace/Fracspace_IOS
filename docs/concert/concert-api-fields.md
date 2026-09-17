# Concert section — API field reference

**Contract v1.2** — adds `media.audioHandoff` (unmuted playback carrying from the home card into the teaser). v1.1 added `interestForm.successSheet` and the `data.summary` block on the interest response.

Companion to `concert-api-contract.json`. Every field below corresponds to something the UI actually renders — nothing is speculative. The client reads these values from a hardcoded file (`Screen/utils/concertData.js`) today and will read them from the API instead. **§12 lists exactly which fields the app already reads from data and which are still hardcoded in the components**, so nobody assumes a payload change will move the UI before the wiring pass.

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
| `liveTag.text` | string | yes | Pill on the home video card. Currently "Fracspace Exclusive"; was "LIVE MUSIC". |
| `liveTag.showDot` | bool | no | The red dot. Default `true`. |
| `presentsTag.text` | string | yes | Gold gradient pill on the details screen ("FRACSPACE PRESENTS"). |
| `presentsTag.showSparkle` | bool | no | The sparkle glyph. Default `true`. |
| `presentsTag.shine.enabled` | bool | no | Turns the shine sweep on/off. |
| `presentsTag.shine.intervalMs` | int | no | Pause between sweeps. Currently 1500. |
| `presentsTag.shine.sweepMs` | int | no | Duration of one sweep. Currently 1000. |

These are two **separate** strings on purpose — the home card currently says "Fracspace Exclusive", the details screen says "FRACSPACE PRESENTS".

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
| `teaser.durationSec` | int | no | Also used as the upper bound for the audio handoff (see below). |
| `audioHandoff.enabled` | bool | no | If the user unmutes the home card and then taps through, the teaser starts playing instead of opening silent. Default `true`. |
| `audioHandoff.resumeAtCardPosition` | bool | no | Whether the teaser resumes at the card's playback timestamp rather than from 0. Default `true`. |

**Important constraint on `audioHandoff.resumeAtCardPosition`.** The client only honours the timestamp when `teaser.audioUrl` is byte-for-byte the **same asset** as `video.url` — today they both point at `ConcertVideo.mp4`, so resume works. The moment the teaser becomes a separate 30-second cut, a timestamp taken from the full promo video points somewhere meaningless in it, so the client falls back to starting the teaser at 0 (still playing, still unmuted). It also falls back to 0 if the position lands within half a second of `teaser.durationSec`.

So: if you want true resume, keep the two URLs identical. If you want a separate short teaser file, that's fine — just expect playback to start from the beginning, and set `resumeAtCardPosition: false` to make that explicit rather than implicit.

## 5. `homeCard`

| Field | Type | Req | Drives |
| --- | --- | --- | --- |
| `enabled` | bool | yes | Shows/hides the floating card without touching the details screen. |
| `dismissible` | bool | no | Whether the X is rendered. Dismissal is session-only — it comes back on the next app open. |
| `hideOnScroll` | bool | no | Whether the card slides away as the user scrolls the home feed. |
| `peekTab.enabled` | bool | no | While the card is hidden, leaves a small tab on the left edge (video poster thumbnail + red dot + chevron) that brings it back on tap. Only meaningful when `hideOnScroll` is `true`. Default `true`. |
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
| `successSheet` | object | no | Copy for the confirmation screen. See §10. |
| `errorToast` | object | no | Copy shown when the submit call fails. |

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

## 10. `interestForm.successSheet` — the confirmation screen

Shown in place of the form (same bottom sheet, no second animation) as soon as the interest POST succeeds. All copy is remote so the confirmation can be re-worded per concert.

| Field | Type | Req | Drives |
| --- | --- | --- | --- |
| `showCheckmark` | bool | no | The gold circle with the white tick. Default `true`. |
| `title` | string | yes | "You're on the list!" |
| `message` | string | yes | "Interest Registered. We'll notify you when tickets go live!" |
| `summaryLabel` | string | yes | Gold label on the summary card ("EVENT & TOUR"). |
| `phoneLabel` | string | yes | Left side of the last row ("Registered Phone"). |
| `ticketsBadge.singular` | string | yes | Template for 1 ticket. `{count}` is substituted. |
| `ticketsBadge.plural` | string | yes | Template for 2+. `{count}` is substituted. |
| `primaryCta.label` | string | yes | The gold button ("Go to Home"). |
| `primaryCta.action` | enum | yes | `go_home` \| `close` \| `view_concert`. See the enums block. |

The **values** on the summary card do not come from this block — they come from the POST response (§11), falling back to what the user just typed if the response omits them.

`primaryCta.action` semantics in the app: `go_home` pops back to the home screen (and resets to the tab bar if the screen was opened cold from a deep link), `close` just dismisses the sheet and leaves the user on the concert page, `view_concert` dismisses and scrolls back to the schedule.

## 11. `POST .../interest` → `data.summary`

The confirmation card renders from the server's echo rather than local state, so what the user sees is what was actually stored.

| Field | Type | Req | Drives |
| --- | --- | --- | --- |
| `interestId` | string | yes | Internal id, for support lookups. |
| `referenceCode` | string | no | Human-quotable code. Not rendered today — send it and the client can surface it later. |
| `interestRegistered` | bool | yes | Should be `true`. Flips the CTA on the details screen permanently. |
| `interestedCount` / `interestedCountLabel` | int / string | no | The incremented count, so the details screen can update without a refetch. |
| `summary.eventLabel` | string | yes | Bold line on the card. Server-composed, e.g. `Religious India • Harish Sagane & Band` — please use the `•` separator so the client doesn't have to rebuild it. |
| `summary.cityId` | string | yes | The confirmed city. |
| `summary.city` | string | yes | Muted line under the event name ("Hyderabad"). |
| `summary.ticketsNeeded` | int | yes | Drives the badge count. |
| `summary.ticketsLabel` | string | no | Pre-rendered badge text ("2 TICKETS"). If sent, the client uses it verbatim and ignores `ticketsBadge`. Useful for languages where the plural rule isn't singular/plural. |
| `summary.registeredPhone` | string | yes | Right side of the phone row, **display-formatted** (`+91 98765 43210`). The client currently formats Indian numbers as 5+5, so sending it pre-formatted keeps non-Indian numbers correct. |
| `summary.registeredEmail` | string | no | Not rendered today; reserved. |

**The 409 case matters here.** If the user has already registered — double tap, or they come back through the deep link on another device — return `409` *with the same `data.summary` block*. The app treats that as success and shows the confirmation card populated from it, which is much better than an error for something that already worked.

---

## 12. What the app reads today vs. what is still hardcoded

Worth being explicit about, so nobody assumes changing a value in the API will immediately move the UI. The contract is the **target** shape. The client currently reads a flat hardcoded object (`Screen/utils/concertData.js`), so some of these fields need a small client-side wiring pass when the endpoint lands.

**Read from data today** (change the value, the UI changes):

`id` · `tag` · `presents` · `title` · `artist` · `subtitle` · `heroImage` · `video.url` · `video.poster` · `teaser.title` · `teaser.subtitle` · `teaser.audioUrl` · `teaser.durationSec` · `cities[]` · `defaultCityId` · `about[]` · `cta.label` · `cta.note` · `interestedCount` · `interestedNote` · `shareUrl` · `interestForm.successSheet.*` · the theme palette

**Still hardcoded in the components** (in the contract, not yet wired):

- `section.enabled`, `section.theme` — the palette is imported directly rather than read from the payload
- `homeCard.*` — `enabled`, `dismissible`, `hideOnScroll`, `peekTab.enabled`, `footerLabel` ("View Concert Details"), `controls.*`
- `branding.liveTag.showDot`, `branding.presentsTag.shine.*` — the shine timings are module constants
- `details.schedule.sectionTitle` ("TOUR SCHEDULE & CITIES"), `details.about.sectionTitle` ("ABOUT THE CONCERT")
- `details.cta.registeredLabel` ("You're Interested"), `details.cta.showInterestedCount`
- `interestForm.title`, `fields[]` (labels and placeholders), `tickets.*` (min 1 / max 10 / default 2 are constants), `banner.*`, `submitLabel`, `errorToast`
- `media.audioHandoff.*` — the handoff currently always happens when the card is unmuted

**Two shape differences to be aware of** when wiring:

1. **Cities.** The contract nests presentation under `display` and status under `status`; the client currently reads flat `month` / `day` / `weekday` / `dateLabel` and a plain `badge` string. Send the contract shape — the client will map it.
2. **Interest form.** The contract sends `fields[]` as an array; the client renders four fixed inputs. The array lets you drop or reorder fields, but the client needs the mapping pass first.

None of this blocks backend work. Build to the contract; the client catches up in one pass.

---

## Notes for the backend team

**Fully dynamic by design.** Every user-visible string — section titles, button labels, form labels, badge text, the banner copy — is in the payload rather than the app binary. That was the explicit goal, so the whole section can be re-themed or re-worded for the next concert with no release.

**Caching.** The payload is small and changes rarely. An `ETag` or `Cache-Control: max-age=300` would let the app skip the round trip on most home-screen loads. The one field that must not be cached hard is `interestRegistered`, since it's per-user — if caching makes that awkward, split it into a tiny separate `GET /concerts/{id}/interest/me`.

**Empty state.** If `section.enabled` is `false` or `concerts` is `[]`, please still return `200` with that shape rather than `404`. The app treats a non-200 as a network failure and retries.

**Idempotency on submit.** A user double-tapping Submit on a slow connection will send twice. Please dedupe on `(userId, concertId)` and return `409` with `interestRegistered: true` rather than creating a second row — the app handles that as a success.

**What isn't in this contract.** Ticket pricing, seat maps, and actual booking. This is interest capture only, matching the current UI. When booking goes live it'll want its own endpoint, and `details.cta` will need a new state beyond "interested".
