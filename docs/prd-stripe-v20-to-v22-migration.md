# PRD: Stripe SDK Migration v20 -> v22 (Clover -> Dahlia)

## Problem Statement

The `@convex-dev/stripe` component currently depends on `stripe@^20.0.0` (installed: v20.4.1), which pins to Stripe API version `2026-02-25.clover`. The Stripe SDK has moved to v22.x, which pins to API version `2026-04-22.dahlia`. This migration crosses an entire Stripe release boundary (Clover -> Dahlia), introducing breaking changes in both the `2026-03-25.dahlia` base release and the `2026-04-22.dahlia` GA update. The package must be updated to remain compatible with current Stripe types, receive security patches, and give consumers access to new Dahlia-era features.

## Solution

Upgrade `stripe` from `^20.0.0` to `^22.0.0` in `package.json`, then systematically address every breaking change and type incompatibility across the codebase. Also resolve existing `as any` type-safety gaps that would mask issues during the migration, and optionally expose new Dahlia-era features to component consumers.

## Scope of Change

The migration spans two Stripe API versions:

| From | To (intermediate) | To (target) |
| ---- | ------------------ | ----------- |
| `2026-02-25.clover` (SDK v20) | `2026-03-25.dahlia` (SDK v21) | `2026-04-22.dahlia` (SDK v22) |

---

## Breaking Changes Analysis

### Breaking changes that AFFECT this codebase

#### 1. Checkout Session `ui_mode` enum values updated

**Dahlia version:** `2026-03-25.dahlia` (Breaking, category: api)
**Reference:** [Updates Checkout Session UI mode enum values](https://docs.stripe.com/changelog/dahlia/2026-03-25/updates-available-checkout-session-ui-modes.md)

**What changed:** The `ui_mode` enum on `Checkout.SessionCreateParams` changed from Clover values (`"embedded"`, `"hosted"`) to Dahlia values (`"elements"`, `"embedded_page"`, `"hosted_page"`).

**Current code state:** `src/client/index.ts` line 182 already uses the Dahlia enum values:

```typescript
uiMode?: "elements" | "embedded_page" | "hosted_page";
```

This was a forward-looking change that would have been a TypeScript error against the v20 SDK types. After upgrading to v22, the SDK's own `SessionCreateParams.ui_mode` type will match these values.

**Action required:**
- Verify that the custom `uiMode` type on `createCheckoutSession` aligns with `StripeSDK.Checkout.SessionCreateParams["ui_mode"]` after the upgrade.
- Consider removing the manual type annotation and deriving it from the SDK type to stay in sync automatically.

#### 2. Subscription cancellation reason: new `retention_policy` enum value

**Dahlia version:** `2026-03-25.dahlia` (Breaking, category: api)
**Reference:** [Adds retention policy cancellation reason to Subscriptions](https://docs.stripe.com/changelog/dahlia/2026-03-25/adds-new-cancellation-reason-subscription-test-retention-policy.md)

**What changed:** Subscriptions now include a new `cancellation_details.reason` enum value (`"retention_policy"`). Any code that exhaustively switches on cancellation reasons will break.

**Current code state:** The codebase does NOT read `cancellation_details` or `cancellation_details.reason` from subscription objects. Cancellation is tracked via `cancel_at_period_end` and `cancel_at` only.

**Action required:**
- No immediate code changes needed.
- Optional: Consider storing `cancellation_details.reason` in the `subscriptions` schema for richer cancellation tracking (see "Optional Enhancements" below).

#### 3. `events_from` parameter on event destinations accepts string values

**Dahlia version:** `2026-03-25.dahlia` (Breaking, category: api)
**Reference:** [Updates the events_from parameter on event destinations to accept string values](https://docs.stripe.com/changelog/dahlia/2026-03-25/updates-eventsfrom-parameter-on-event-destinations.md)

**What changed:** The `events_from` parameter type changed from an enum to a string.

**Current code state:** Not used anywhere in the codebase. The component uses webhook endpoints, not event destinations.

**Action required:** None.

#### 4. Capabilities API risk requirements

**Dahlia version:** `2026-03-25.dahlia` (Breaking, category: api)
**Reference:** [Adds risk requirements to the Capabilities API](https://docs.stripe.com/changelog/dahlia/2026-03-25/capabilities-api-risk-requirements.md)

**Current code state:** No Capabilities API usage.

**Action required:** None.

#### 5. Elements and Stripe.js breaking changes (6 items)

**Dahlia version:** `2026-03-25.dahlia` (Breaking, category: stripejs)

These are all client-side Stripe.js/Elements changes:
- Address Element state field defaults to Latin characters
- `elements.update()` returns a Promise
- Boolean values removed from `options.layout.radios`
- Deprecated Payment Intents/Setup Intents/Sources methods removed
- `initCheckout` renamed to `initCheckoutElements`
- `initEmbeddedCheckout` renamed to `createEmbeddedCheckoutPage`

**Current code state:** This package has no Stripe.js or Elements code (server-side only). The `src/react/index.ts` is a placeholder stub.

**Action required:** None in this package. Consumers using Stripe.js alongside this component should follow the Dahlia Stripe.js migration guide independently.

#### 6. Issuing Token Visa card reference ID optional

**Dahlia version:** `2026-03-25.dahlia` (Breaking, category: api)

**Current code state:** No Issuing API usage.

**Action required:** None.

### Breaking changes in `2026-04-22.dahlia` GA

The April 22 GA release (`2026-04-22.dahlia`) contains **zero breaking changes** -- all entries are non-breaking/additive. No migration work required for the GA channel.

### Breaking changes in preview channel (not applicable by default)

The preview channel (`2026-04-22.preview` and `2026-03-25.preview`) contains breaking changes in Billing, Payouts, Treasury, Radar, and Payments. These only apply if the SDK is explicitly configured to use a preview API version, which this codebase does not do. Not applicable unless preview features are adopted.

---

## SDK-Level Type Changes (v20 -> v22)

Beyond API-level breaking changes, the stripe npm package major version bumps include TypeScript type signature updates. The following areas of the codebase use Stripe types and must be audited after the upgrade.

### 1. `as any` casts hiding type issues

Several places in `src/client/index.ts` use `as any` to bypass type checking. These must be resolved during the migration to catch real incompatibilities.

| Location | Current code | Issue |
| -------- | ------------ | ----- |
| Line 612-613 | `(invoice as any).subscription` | `Invoice.subscription` may be typed differently in v22; could be `string \| null` instead of requiring `as any` |
| Line 625 | `event.data.object as any` (invoice.paid handler) | Should be cast to `StripeSDK.Invoice` |
| Line 642 | `event.data.object as any` (payment_intent.succeeded) | Should be cast to `StripeSDK.PaymentIntent` |
| Line 650 | `(invoice as any).subscription` | Same as line 612 |
| Line 462-464 | `customHandler` typed as `any` | Event handler dispatch uses `as any` |

**Action required:** Replace all `as any` casts with properly typed alternatives. Check the v22 type definitions for `Invoice.subscription`, `PaymentIntent.invoice`, etc. If these properties are still present but typed as expandable (`string | Stripe.X | null`), use the string form directly.

### 2. Expandable field casts (`as string`)

The codebase casts expandable Stripe fields to `string` in many places. In v22, the SDK types may be stricter about expandable fields.

| Location | Cast | Field |
| -------- | ---- | ----- |
| Line 515 | `subscription.customer as string` | `Subscription.customer` |
| Line 560-561 | `session.customer as string` | `Checkout.Session.customer` |
| Line 574-575 | `session.payment_intent as string` | `Checkout.Session.payment_intent` |
| Line 582-583 | `session.subscription as string` | `Checkout.Session.subscription` |
| Line 587 | `subscription.latest_invoice as string` | `Subscription.latest_invoice` |
| Line 609 | `invoice.customer as string` | `Invoice.customer` |
| Line 686-687 | `paymentIntent.customer as string` | `PaymentIntent.customer` |

**Action required:** Verify these fields are still typed as `string | Stripe.X | null` in v22. Consider adding a utility function like `expandableToString(field)` to extract the ID from expandable fields safely, handling both string and object cases.

### 3. `subscription.items.data[0].current_period_end`

The codebase reads `current_period_end` from subscription items (not the subscription root), which is the Dahlia-era location. In Clover (v20), this field may have lived on both the subscription and the item. In Dahlia (v22), it may only exist on items.

**Current code state:** Already reads from items (`item?.current_period_end`). This is correct for Dahlia.

**Action required:** Verify that the type `StripeSDK.SubscriptionItem` includes `current_period_end` in v22. No code change expected.

---

## Required Code Changes

### Module 1: `package.json` dependency update

- Change `"stripe": "^20.0.0"` to `"stripe": "^22.0.0"`
- Run `npm install` and verify lockfile updates cleanly
- Run `npm run build` to catch any immediate TypeScript compilation errors

### Module 2: Type safety cleanup in `src/client/index.ts`

#### 2a. Fix `processEvent` webhook handler types

Replace `as any` casts in `processEvent` with proper Stripe types:

- `invoice.created` / `invoice.finalized` handler: Cast to `StripeSDK.Invoice`, access `.subscription` properly (check if it's `string | null` in v22 or removed entirely; if removed, use `invoice.lines` or `invoice.subscription_details`)
- `invoice.paid` / `invoice.payment_succeeded` handler: Cast to `StripeSDK.Invoice` instead of `any`
- `payment_intent.succeeded` handler: Cast to `StripeSDK.PaymentIntent` instead of `any`, access `.invoice` and `.customer` with proper types

#### 2b. Add expandable field helper

Create a utility to safely extract string IDs from Stripe expandable fields:

```typescript
function toId(field: string | { id: string } | null | undefined): string | undefined {
  if (!field) return undefined;
  if (typeof field === "string") return field;
  return field.id;
}
```

Apply this to all `as string` casts on expandable fields throughout `processEvent` and the `StripeSubscriptions` class.

#### 2c. Align `uiMode` type with SDK

Instead of a manual union type:

```typescript
uiMode?: "elements" | "embedded_page" | "hosted_page";
```

Consider deriving from the SDK:

```typescript
uiMode?: StripeSDK.Checkout.SessionCreateParams["ui_mode"];
```

This keeps the type in sync with whatever the installed SDK version supports.

#### 2d. Fix custom handler type safety

Replace the `as any` event handler dispatch (lines 462-464) with proper typing using the `StripeEventHandlers` type.

### Module 3: Verify `subscription.items` structure

In `cancelSubscription`, `reactivateSubscription`, and the webhook handlers for `customer.subscription.*`, verify that:

- `subscription.items.data[0].current_period_end` is typed correctly in v22
- `subscription.items.data[0].price.id` is still the path to the price ID
- `subscription.items.data[0].quantity` is still available

If Dahlia restructured any of these, update the property access paths accordingly.

### Module 4: Test updates in `src/client/index.test.ts`

- Update Stripe mock to match any new constructor signatures in v22
- Verify mock return shapes match v22 types (e.g., if `subscription.items.data[0]` shape changed)
- Add a test for the new `toId` utility function if created

### Module 5: Run full build and test suite

After all changes:

1. `npm run build:clean` -- full TypeScript compilation
2. `npm run test` -- all Vitest tests pass
3. `npm run typecheck` -- includes example app type-checking
4. `npm run lint` -- no new lint errors

---

## Optional Enhancements (Additive Dahlia Features)

These are non-breaking additions available in v22 that the component could adopt. Each is independent and optional.

### Enhancement A: Checkout Session `integration_identifier`

**Reference:** [Adds integration identifier parameter to Checkout Sessions](https://docs.stripe.com/changelog/dahlia/2026-03-25/adds-integration-identifier-parameter-to-checkout-sessions.md)

Add an optional `integrationIdentifier` parameter to `createCheckoutSession` so consumers can group and track sessions.

**Files:** `src/client/index.ts` (`createCheckoutSession` args and `sessionParams`)

### Enhancement B: Checkout Session `pending_invoice_item_interval`

**Reference:** [Adds pending invoice item interval parameter to create Checkout Sessions](https://docs.stripe.com/changelog/dahlia/2026-03-25/adds-pending-invoice-item-interval-parameter-to-checkout-sessions.md)

Add an optional `pendingInvoiceItemInterval` parameter for subscription-mode Checkout Sessions.

**Files:** `src/client/index.ts` (`createCheckoutSession` args and `sessionParams`)

### Enhancement C: Store subscription `cancellationReason`

**Reference:** [Adds retention policy cancellation reason to Subscriptions](https://docs.stripe.com/changelog/dahlia/2026-03-25/adds-new-cancellation-reason-subscription-test-retention-policy.md)

Add an optional `cancellationReason` field to the `subscriptions` schema, populated from `subscription.cancellation_details.reason` during webhook handling. New possible values in Dahlia include `"retention_policy"`.

**Files:** `src/component/schema.ts`, `src/component/private.ts` (subscription handlers), `src/client/index.ts` (cancelSubscription, webhook handlers)

### Enhancement D: Decimal quantity support for invoices

**Reference:** [Adds decimal quantity support for Invoice Items and Invoice Line Items](https://docs.stripe.com/changelog/dahlia/2026-03-25/invoice-items-decimal-quantity.md)

The `invoices` table currently stores integer amounts. If the component is extended to store line-item quantities, these may now be decimal with up to 12 decimal places.

**Files:** No immediate change needed unless invoice line items are stored.

### Enhancement E: New payment methods (Sunbit, UPI, Pix recurring)

These are automatically available through the existing `createCheckoutSession` flow without code changes (Stripe handles payment method availability based on configuration). No code changes needed, but documentation could be updated to reference them.

### Enhancement F: Managed Payments support

**Reference:** [Adds support for Managed Payments, Stripe's merchant of record solution](https://docs.stripe.com/changelog/dahlia/2026-04-22/managed-payments.md)

Add an optional `managedPayments` parameter to `createCheckoutSession` to enable Stripe's merchant-of-record solution for digital sellers.

**Files:** `src/client/index.ts` (`createCheckoutSession` args and `sessionParams`)

---

## User Stories

1. As a component maintainer, I want the `stripe` dependency on the latest GA SDK version, so that I receive security patches and type definitions that match the current Stripe API.
2. As a component consumer, I want TypeScript compilation to succeed without `as any` workarounds, so that I catch Stripe API mismatches at build time rather than at runtime.
3. As a component consumer, I want the Checkout Session `ui_mode` type to match the SDK's own type, so that I don't have to manually track enum value changes across Stripe releases.
4. As a component consumer using subscriptions, I want webhook handlers to correctly parse Dahlia-era subscription objects, so that `currentPeriodEnd`, `cancelAt`, and `priceId` are synced accurately.
5. As a component consumer, I want expandable Stripe fields (customer, subscription, invoice) handled safely, so that my app doesn't crash if Stripe returns an expanded object instead of a string ID.
6. As a component maintainer, I want all existing tests to pass after the upgrade, so that I have confidence the migration is non-regressive.
7. As a component consumer, I want access to new Dahlia features like `integrationIdentifier` and `pendingInvoiceItemInterval` on Checkout Sessions, so that I can use the latest Stripe capabilities without modifying the component internals.

---

## Testing Plan

### What makes a good test

Tests should verify external behavior (API contracts, return shapes, side effects like database mutations), not implementation details (internal variable names, call order of private helpers). Mock the Stripe SDK at the module boundary and assert on the arguments passed to it and the mutations triggered.

### Tests to update

1. **`src/client/index.test.ts`** -- Update Stripe mock constructor and return value shapes to match v22 SDK types. Verify `updateSubscriptionQuantity` still works with the new type signatures.

2. **`src/component/public.test.ts`** -- These tests use `convex-test` and don't import `stripe` directly. They should pass without changes, but run them to confirm schema/validator compatibility.

### Tests to add

1. **Expandable field utility** -- If a `toId()` helper is created, add unit tests covering: string input, object-with-id input, null input, undefined input.

2. **Webhook handler type safety** -- Add a test that constructs a mock Stripe event matching the v22 `Invoice` type (with `.subscription` as `string | null`) and verifies the `processEvent` function handles it correctly.

3. **Checkout Session `ui_mode`** -- Add a test verifying that `createCheckoutSession` with each valid `uiMode` value passes the correct `ui_mode` to the Stripe SDK.

### Prior art

Existing tests in `src/client/index.test.ts` mock Stripe at the module level using `vi.mock("stripe")` and verify SDK method calls plus Convex mutation arguments. Follow this same pattern for new tests.

---

## Out of Scope

- **Preview channel features:** Breaking changes and new APIs in `2026-03-25.preview` and `2026-04-22.preview` (Batch API v2, multicurrency payouts, agentic commerce, Accounts v2, etc.) are not targeted. They can be adopted in a future release if preview features are needed.
- **Stripe.js / Elements migration:** This package is server-side only. Consumers using Stripe.js must handle the Dahlia Stripe.js breaking changes independently.
- **Frontend (React) integration:** The `src/react/index.ts` is a placeholder stub. No React-side Stripe integration exists to migrate.
- **Example app changes:** The `example/` directory delegates all Stripe SDK usage to the component. It should work without changes after the component is updated, but updating the example is not a blocking requirement.
- **Stripe dashboard configuration:** New payment methods (Sunbit, UPI, Pix), Managed Payments enablement, and Radar value list configuration are dashboard/account-level settings, not code changes.

## Further Notes

- The `2026-04-22.dahlia` GA release is entirely additive (no breaking changes), so the most critical migration work comes from the `2026-03-25.dahlia` base release.
- The `^20.0.0` semver range in `package.json` currently resolves to v20.4.1 but would NOT auto-upgrade to v21 or v22 (major version boundary). The range must be explicitly changed.
- After upgrading, the SDK will send requests with `Stripe-Version: 2026-04-22.dahlia` by default. Any Stripe webhooks will also reflect the new API version's response shapes. Ensure the Stripe dashboard webhook endpoint API version is updated to match, or that the webhook signature verification handles version differences.
- The `stripe` npm package follows a pattern where odd major versions (v21) are short-lived intermediates. Prefer jumping directly to v22 (latest stable).
