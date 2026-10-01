# Concert Ticket Payments — Backend Requirements

**Spec version 2.0** — extends the concert section contract (v1.2) with ticketing and payment.
**Client:** Fracspace app, iOS + Android (React Native, same JS bundle).
**Reuses:** the `escapeInvestment` PayU integration, unchanged in shape.
**Blocks on:** a wallet debit primitive and ticket pricing — neither exists today.

Goal: a user pays for a concert ticket with wallet credit, PayU, or a combination. A ₹6,000 ticket against a ₹5,000 balance charges ₹1,000 to PayU and takes ₹5,000 from the wallet. All three modes must be available in every case.

---

## 0. One question decides whether this is buildable

**Is wallet credit allowed to be spent inside the app, or is it restricted to bank withdrawal?**

Today the wallet holds quarterly rental payouts from co-owned property. Every operation moves money *out to a bank*: `RequestForWithdrawal`, `UploadBankData`, `SetPrimaryAccount`, and a transaction list that filters on `transactionType === 'withdrawal'`. There is no debit path anywhere in the app.

If payout credit is restricted for tax, accounting or regulatory reasons, this feature reduces to PayU-only and everything in sections 2.2, 3.2's wallet half, and 5's hold rows can be dropped. Please answer this before any work starts.

Assumed answer for the rest of this document: **yes, spendable.**

---

## 1. What already exists — do not rebuild

### 1.1 The PayU pattern to match exactly

`POST /api/v1/escapeInvestment/initiatePayment` is the newest and cleanest gateway integration in the app. The new endpoints should return the **same shape**, because the client screens are a copy:

```jsonc
// response
{
  "success": true,
  "form": "<html><body><form action='https://secure.payu.in/_payment' ...>…</form><script>document.forms[0].submit()</script></body></html>",
  "investment": { "paymentProof": { "txnId": "TXN17264…" } }
}
```

The app renders `form` in a WebView via `source={{ html: form }}`, watches `onNavigationStateChange` for `success` / `failure` in the URL, then calls `verifyPayment({ txnID })`.

`surl` / `furl` are currently sent by the client as `https://test.bunknbeyond.com/paymentsuccess` and `/paymentfailure`. **Please confirm whether concerts should use the same return URLs or new ones** — the client just echoes what it is told.

### 1.2 Wallet, as it is now

`POST /api/users/getWalletInfoByEmail` with `{ "email": "..." }` returns:

```jsonc
{
  "data": {
    "balance": 8000,
    "bankDetails": { },
    "bankDetailsList": [ ],
    "propertyDetails": [ ],
    "quarterlyPayouts": [ ]
  }
}
```

`POST /api/users/getWalletTransactions` returns rows the UI reads as `amount`, `transactionType`, `type`, `status`, `debited`, `completedAt`, `quarterName`, `properties`, `stage`, plus bank fields.

### 1.3 Concert section, as it is now

`GET /api/v1/concerts/section` (contract 1.2) already returns the concert, its cities, and `interestForm`. Interest capture is live and collecting registrations. The additions in section 2.1 extend this same payload.

---

## 2. What has to be added

### 2.1 Pricing on the concert — extends contract 1.2

There is no price field anywhere in contract 1.2. Add a `pricing` object per concert and allow a per-city override, since Hyderabad and Bangalore will not be the same price.

Mirror the field names the escape flow already uses (`bookingAmount`, `gst`, `processingFee`) so the client renders one breakdown component everywhere.

```jsonc
// data.concerts[].pricing
{
  "currency": "INR",
  "perTicket": {
    "bookingAmount": 500000,      // base, in paise
    "gst": 90000,                 // 18%
    "processingFee": 10000,
    "total": 600000               // server-computed, never trust the client
  },
  "minTickets": 1,
  "maxTickets": 10,
  "walletAllowed": true,          // per-concert switch for wallet payment
  "walletMaxPercent": 100,        // cap wallet contribution if the business wants one
  "gatewayMinimum": 100           // paise; below this PayU rejects the charge
}
```

```jsonc
// data.concerts[].details.schedule.cities[] — additions
{
  "id": "hyd",
  "pricing": { /* same shape; overrides the concert-level pricing when present */ },
  "inventory": {
    "available": 240,             // after holds; null = untracked
    "maxPerOrder": 10
  }
}
```

**Amounts must be integers in paise.** The escape flow sends rupees as numbers, which is survivable for a single charge but not for a split — dividing ₹6,000 across two instruments in floating point can lose or invent a paisa, and the two legs then do not sum to the total. If integer paise is a problem, say so and we will agree a rounding rule instead, but paise is strongly preferred.

### 2.2 A phase flag — so the CTA is dashboard-driven

Interest capture and ticket sales are different states of the same screen. Add:

```jsonc
// data.concerts[]
"phase": "interest"   // interest | booking | sold_out | closed
```

- `interest` — current behaviour, "I'm Interested" opens the interest form
- `booking` — CTA becomes "Book tickets" and opens checkout
- `sold_out` / `closed` — CTA is a disabled status label

Without this, switching a concert from interest to sales needs an app release, which defeats the point of the dashboard.

### 2.3 Wallet holds — the new primitive

A hold reserves part of the balance without moving it. This is what makes a split payment safe, and section 4 explains why a plain debit is not enough.

Three internal operations, each **idempotent by `orderId`**:

| Operation | Effect |
|---|---|
| `holdBalance(userId, orderId, amount)` | `balance` unchanged, `availableBalance` reduced by `amount`. Fails if `availableBalance < amount`. |
| `captureHold(orderId)` | Converts the hold into a real debit. `balance` reduced. Writes a ledger row. |
| `releaseHold(orderId)` | Cancels the hold. `availableBalance` restored. No ledger row (or a void row if you prefer an audit trail). |

**`GetWalletInfo` must start returning `availableBalance`:**

```jsonc
{
  "data": {
    "balance": 8000,              // unchanged meaning
    "availableBalance": 3000,     // balance minus open holds  ← NEW
    "heldAmount": 5000,           // optional, for a "reserved" line on the wallet screen
    "...": "existing fields unchanged"
  }
}
```

**Withdrawal must switch to checking `availableBalance`.** If it keeps checking `balance`, a user can withdraw money already committed to a pending ticket order and the capture will fail after PayU has already taken their card payment.

**New wallet transaction row type.** The wallet screen shows spend alongside withdrawals:

```jsonc
{
  "transactionType": "concert_ticket",   // new value; existing rows keep "withdrawal"
  "type": "debit",
  "amount": 500000,
  "status": "completed",
  "concertId": "religious-india-2026",
  "orderId": "cord_01J…",
  "referenceCode": "FSC-T-2026-000045",
  "completedAt": "2026-09-22T11:04:00.000Z",
  "description": "Religious India — 1 ticket, Hyderabad"
}
```

The client's transaction filter currently hardcodes `transactionType === 'withdrawal'`; we will update it to handle the new type.

### 2.4 Orders — new collection

| Field | Notes |
|---|---|
| `orderId` | Public id, e.g. `cord_01J…` |
| `referenceCode` | Human-quotable, e.g. `FSC-T-2026-000045`. Same global-counter approach as `FSC-2026-…` on interest. |
| `userId`, `concertId`, `cityId`, `tickets` | |
| `amounts` | `{ bookingAmount, gst, processingFee, total, walletApplied, gatewayAmount }` — all paise, all server-computed |
| `walletHoldId` | Null when no wallet was used |
| `gateway` | `{ txnId, provider: "payu", status, rawResponse }` |
| `status` | See section 6 |
| `inventoryHoldId` | Null when inventory is untracked |
| `expiresAt` | When the hold and inventory reservation auto-release |
| `idempotencyKey` | Unique per order creation attempt |
| `createdAt`, `paidAt`, `failedAt` | |

---

## 3. APIs

All under `/api/v1/concerts`. House shape as elsewhere: `{ success, message, data }` on success, `{ success: false, message, errors }` on failure. `x-api-key` on every call, matching the rest of `UserApi.js`.

### 3.1 `GET /:concertId/checkout`

Read-only price preview. **Places no hold.** This is what the checkout screen renders.

| Param | |
|---|---|
| `cityId` | required |
| `tickets` | required, integer |
| Auth | bearer required — wallet figures are per-user |

```jsonc
// 200
{
  "success": true,
  "message": "OK",
  "data": {
    "concertId": "religious-india-2026",
    "cityId": "hyd",
    "city": "Hyderabad",
    "tickets": 1,
    "currency": "INR",
    "amounts": {
      "bookingAmount": 500000,
      "gst": 90000,
      "processingFee": 10000,
      "total": 600000
    },
    "wallet": {
      "allowed": true,
      "balance": 800000,
      "availableBalance": 500000,
      "maxApplicable": 500000,        // what the server would allow on THIS order
      "gatewayMinimum": 100
    },
    "preview": {                       // what happens if maxApplicable is used
      "walletApplied": 500000,
      "gatewayAmount": 100000
    },
    "inventory": { "available": 240, "maxPerOrder": 10 },
    "phase": "booking"
  }
}
```

`maxApplicable` is the important field: it is `min(availableBalance, total, walletMaxPercent of total)` **already adjusted for the gateway minimum** (section 4.2). The client renders it and never computes it.

**Errors:** `404` unknown concert or city · `409` `{ "errors": { "tickets": "Only 3 tickets left" } }` · `410` phase is not `booking`.

### 3.2 `POST /:concertId/order`

Creates the order, places the wallet hold, reserves inventory, and returns the PayU form when there is anything to charge. **This is the only endpoint that moves money.**

```jsonc
// request
{
  "cityId": "hyd",
  "tickets": 1,
  "useWalletAmount": 500000,        // client's request; server clamps it
  "surl": "https://test.bunknbeyond.com/paymentsuccess",
  "furl": "https://test.bunknbeyond.com/paymentfailure",
  "source": "app_concert_checkout",
  "platform": "android",
  "appVersion": "1.4.0"
}
```

Header: `Idempotency-Key: <uuid>` — see section 7.

```jsonc
// 201 — split payment
{
  "success": true,
  "message": "Order created",
  "data": {
    "orderId": "cord_01J8X…",
    "referenceCode": "FSC-T-2026-000045",
    "status": "awaiting_gateway",
    "expiresAt": "2026-09-22T11:19:00.000Z",
    "amounts": {
      "bookingAmount": 500000, "gst": 90000, "processingFee": 10000,
      "total": 600000,
      "walletApplied": 500000,
      "gatewayAmount": 100000
    },
    "wallet": { "held": 500000, "availableBalanceAfter": 0 },
    "gateway": {
      "provider": "payu",
      "txnId": "TXN1726999…",
      "form": "<html>…self-submitting form…</html>"
    }
  }
}
```

```jsonc
// 201 — wallet covers the whole thing: NO gateway leg
{
  "success": true,
  "message": "Payment complete",
  "data": {
    "orderId": "cord_01J8Y…",
    "referenceCode": "FSC-T-2026-000046",
    "status": "paid",                       // hold placed and captured in one call
    "amounts": { "total": 600000, "walletApplied": 600000, "gatewayAmount": 0 },
    "wallet": { "debited": 600000, "availableBalanceAfter": 200000 },
    "gateway": null,                        // ← client must NOT open a WebView
    "tickets": [ { "ticketId": "ctk_…", "cityId": "hyd", "qrPayload": "…" } ]
  }
}
```

**The client branches on `gateway`:** null means done, non-null means open the WebView. `status: "paid"` with `gateway: null` is the only combination that skips the gateway.

**Errors**

| Status | When | Body |
|---|---|---|
| `400` | Validation | `errors` keyed by field |
| `401` | No / invalid token | |
| `402` | Insufficient wallet **and** no gateway leg possible | `{ "errors": { "useWalletAmount": "Only ₹3,000 available" } }` |
| `404` | Unknown concert or city | |
| `409` | Inventory exhausted | `{ "errors": { "tickets": "Sold out" } }` |
| `409` | A pending order already exists | Return the **existing** order in `data` so the client can resume it rather than stranding a hold (section 7) |
| `410` | Phase is not `booking`, or the concert window closed | |

### 3.3 `POST /orders/:orderId/verify`

What the app calls when the WebView lands on `surl` or `furl`. **A status read, not the decision** — the webhook in 3.6 decides. Must be safe to call repeatedly.

```jsonc
// request
{ "txnId": "TXN1726999…" }
```

```jsonc
// 200
{
  "success": true,
  "data": {
    "orderId": "cord_01J8X…",
    "status": "paid",                    // or awaiting_gateway | failed | expired
    "referenceCode": "FSC-T-2026-000045",
    "amounts": { "total": 600000, "walletApplied": 500000, "gatewayAmount": 100000 },
    "wallet": { "debited": 500000 },
    "gateway": { "txnId": "TXN…", "status": "success", "bankRefNo": "…" },
    "tickets": [ { "ticketId": "ctk_…", "cityId": "hyd", "qrPayload": "…" } ],
    "paidAt": "2026-09-22T11:06:12.000Z"
  }
}
```

If the webhook has not landed yet, return `status: "awaiting_gateway"` rather than guessing. The client will poll this a few times before showing a "we're confirming your payment" state — **please confirm an acceptable poll interval and ceiling.**

### 3.4 `POST /orders/:orderId/cancel`

Explicit release when the user backs out of the gateway. Without it, every abandonment waits on the TTL sweeper and the user's balance looks wrong in the meantime.

Releases the wallet hold and the inventory reservation. Idempotent. Refuses with `409` if the order is already `paid` — at that point it is a refund, not a cancel.

### 3.5 `GET /orders` — my tickets

Needed for a "my tickets" view and for the app to recover a pending order after a crash.

`?status=paid|pending|all&concertId=&page=&limit=` → list of orders with `amounts`, `status`, `referenceCode`, `tickets`, `city`, `startsAt`.

### 3.6 PayU webhook — the source of truth

**This is the most important item in this document.**

The order must be completed by a server-to-server PayU callback, not by the app calling `verify`. The existing escape flow depends on the app: if the app is killed after payment, nothing completes. That is survivable for a membership someone will chase up. It is **not** survivable here, because a wallet hold is sitting open — the user's money is frozen and no ticket exists.

On a success callback: verify the PayU hash, capture the wallet hold, mark the order `paid`, convert the inventory reservation into issued tickets, write the wallet ledger row. All in one transaction — if any step fails, none of it applies and the order stays `awaiting_gateway` for retry.

On a failure callback: release the hold and the inventory, mark `failed`.

Must be idempotent — PayU retries.

### 3.7 Changes to existing endpoints

| Endpoint | Change |
|---|---|
| `getWalletInfoByEmail` | Add `availableBalance`, optionally `heldAmount` |
| `getWalletTransactions` | Return `concert_ticket` rows alongside `withdrawal` |
| `RequestForWithdrawal` | Validate against `availableBalance`, not `balance` |
| `GET /concerts/section` | Add `pricing`, `phase`, and `cities[].inventory` |

---

## 4. Money rules — all server-side

### 4.1 The split

```
total          = (bookingAmount + gst + processingFee) × tickets
walletApplied  = min(useWalletAmount, availableBalance, total, walletCap)
gatewayAmount  = total − walletApplied
```

The client sends `useWalletAmount` as a *request*. The server clamps it and returns what it actually applied. **The client must re-render from the response** — it may differ from what was on screen.

### 4.2 The gateway minimum

If `gatewayAmount` is greater than zero but below `gatewayMinimum` (PayU will not charge ₹0.50), the split is invalid as computed. Resolve it server-side, one of:

- **Absorb** — set `walletApplied = total`, `gatewayAmount = 0`. Simple, marginally generous. **This is my recommendation.**
- **Cap the wallet** — reduce `walletApplied` so `gatewayAmount ≥ gatewayMinimum`. Exact, but the user sees a wallet figure they did not pick and will ask why.

Either way `checkout.wallet.maxApplicable` must already account for it, so the screen never offers an amount that would produce an uncharageable remainder.

### 4.3 Rounding

With integer paise there is no rounding. If rupee floats are unavoidable, the rule must be: compute `walletApplied` first, then `gatewayAmount = total − walletApplied` by subtraction — never round both legs independently, or they will not sum to the total.

---

## 5. Edge cases

| # | Case | Required handling |
|---|---|---|
| 1 | **App dies after PayU success, before `verify`** | Webhook completes the order regardless. The user finds a paid ticket on next open. Without the webhook their wallet stays frozen. |
| 2 | **App dies after the hold, before PayU** | TTL sweeper releases holds past `expiresAt`. Pick a window — **15 minutes suggested** — and confirm it. |
| 3 | **User abandons the gateway** | `POST /cancel` releases immediately; TTL is the backstop. |
| 4 | **Double-tapped Pay** | `Idempotency-Key` returns the same order. Five taps → one order, one hold. |
| 5 | **Pending order already exists** | `409` carrying the existing order, so the client resumes it. Never create a second hold — a ₹5,000 balance must not back six ₹5,000 holds. |
| 6 | **Balance changed between screens** | Server recomputes at `order` time and returns the real split. Client re-renders and confirms if it changed. |
| 7 | **Withdrawal races a pending order** | Withdrawal checks `availableBalance`. Otherwise capture fails after the card was charged. |
| 8 | **Two users, last ticket** | Inventory reserved at `order` time with the hold, not checked at capture. |
| 9 | **Sold out while the WebView is open** | Inventory is already reserved, so this user is safe. Others get `409` at `order`. |
| 10 | **PayU success, wallet capture fails** | Do not lose the card payment. Mark the order `paid`, log a reconciliation alert, and settle the wallet leg manually or by retry. **Never** fail the order back to the user after their card was charged. |
| 11 | **PayU callback arrives twice** | Idempotent by `txnId`. Second callback is a no-op. |
| 12 | **PayU callback for an expired order** | The hold is gone. Treat as case 10: honour the payment, re-place or reconcile the wallet leg, alert. Do not silently drop it. |
| 13 | **Hash verification fails on the callback** | Reject, log, leave the order `awaiting_gateway`. Never trust an unverified callback. |
| 14 | **`useWalletAmount` exceeds the balance** | Clamp, do not reject — the user's cached figure was simply stale. |
| 15 | **`useWalletAmount` is 0** | Valid. Pure gateway payment, no hold. |
| 16 | **`tickets` out of range** | Clamp to `minTickets`/`maxTickets`, matching how the interest endpoint already clamps `ticketsNeeded`. |
| 17 | **Wallet disabled for the concert** | `pricing.walletAllowed: false` → `maxApplicable: 0`. Client hides the wallet control entirely. |
| 18 | **Refund** | Split back the way it came: wallet portion to the wallet ledger, gateway portion to the gateway. A blanket refund to one side creates a reconciliation problem. |
| 19 | **Partial refund** | Apply pro-rata across both legs, or define a policy (gateway first, wallet first). **Needs a business decision.** |
| 20 | **Concert cancelled after sales** | Bulk refund path honouring #18. Worth designing now rather than during an incident. |
| 21 | **User already registered interest** | Not a blocker — interest and purchase are separate records. The interest row should link to the order for attribution. |
| 22 | **Same user, two cities** | Allowed. One order per city. Only *pending* orders are limited to one (#5). |
| 23 | **Guest checkout** | Wallet requires an account, so booking requires a token — unlike interest, which allows guests when `requireLogin` is off. Please confirm ticket purchase is logged-in only. |
| 24 | **Clock skew on `expiresAt`** | Server time is authoritative. The client displays a countdown but never enforces it. |

---

## 6. Order state machine

```
draft
  └─▶ pending            hold placed, inventory reserved
        ├─▶ awaiting_gateway   PayU form issued (gatewayAmount > 0)
        │     ├─▶ paid          webhook success → hold captured, tickets issued
        │     ├─▶ failed        webhook failure → hold released
        │     └─▶ expired       TTL → hold released
        └─▶ paid               wallet covered the total, captured immediately
```

Terminal states: `paid`, `failed`, `expired`, `refunded`.
Every non-`paid` terminal state **must** have released its hold and inventory.

---

## 7. Idempotency and concurrency

- `POST /order` takes an `Idempotency-Key` header. Same key within a sensible window returns the identical response, including the same `txnId` and `form`.
- Without a key, dedupe on `(userId, concertId, status IN (pending, awaiting_gateway))` and return the existing order.
- `holdBalance` / `captureHold` / `releaseHold` are idempotent by `orderId`.
- The webhook is idempotent by `txnId`.
- A unique index on `(userId, concertId)` where `status IN (pending, awaiting_gateway)` is the backstop for #5. The loser of a race should get the `409`-with-existing-order response, not a 500.
- The wallet balance update must be atomic — a conditional update or a row lock, not read-then-write. Two concurrent holds against the same balance is the one bug here that costs real money.

---

## 8. What the app will send and expect

For completeness, so nothing is ambiguous on our side:

- We send `platform`, `appVersion`, `source` on `POST /order`, same as the interest endpoint.
- We send `surl` / `furl` and echo whatever you tell us to use.
- We render `gateway.form` in a WebView with `source={{ html: form }}` and hand `upi://` / `intent://` URLs to the OS so GPay and PhonePe work.
- We branch on `data.gateway` being null to decide whether a gateway leg exists.
- We treat `201` and `200` both as success (`status >= 200 && < 300`).
- We never compute a total, a split, or a wallet cap. Every figure on screen comes from `/checkout` or `/order`.
- We will poll `/verify` after the WebView returns. Tell us the interval and ceiling you want.

---

## 9. Open questions

1. **Is wallet credit spendable in-app?** (Section 0 — blocks everything.)
2. Integer paise, or rupee floats with an agreed rounding rule? (4.3)
3. Gateway-minimum policy: absorb, or cap the wallet? (4.2)
4. Hold TTL — 15 minutes? (Edge case 2)
5. Same `surl` / `furl` as escape, or concert-specific? (1.1)
6. `/verify` poll interval and ceiling? (3.3)
7. Partial refund policy? (Edge case 19)
8. Is ticket purchase logged-in only? (Edge case 23)
9. Does wallet apply to the full total, or only `bookingAmount` (excluding GST and processing fee)? This is a tax question and we cannot answer it.
10. Per-concert or per-user cap on wallet contribution?

---

## 10. Suggested build order

Steps 1 and 2 are parallel and neither needs the app.

1. **Wallet holds** — the three primitives, `availableBalance`, and withdrawal switched to check it. Independently testable and useful beyond concerts.
2. **Pricing and `phase`** in the section payload.
3. **Orders plus the webhook** — the webhook is not optional, see 3.6.
4. **`/checkout` and `/order`.**
5. **App screens** — last and quickest, because the gateway half is a copy of the escape flow.
