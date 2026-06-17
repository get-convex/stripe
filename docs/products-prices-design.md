# Products and Prices Design

Products/prices support is a good next feature wave, but it should not be merged into the Stripe v22 recovery release. The current branch stabilizes the existing billing mirror first.

## Goals

- Mirror Stripe Products and Prices into Convex.
- Expose public queries for active products/prices that apps can use to render pricing pages.
- Support product/price webhook sync and explicit backfill actions.
- Keep the schema compatible with Stripe's current v22 types, including decimal values that Stripe represents with dedicated decimal-like fields.

## Non-Goals

- Do not replace app-specific catalog or entitlement logic.
- Do not infer plan permissions from Stripe metadata inside the component.
- Do not mix this with the maintenance release that upgrades Stripe and hardens webhooks.

## Proposed Schema

`products`

- `stripeProductId: string`
- `name: string`
- `description?: string`
- `active: boolean`
- `metadata?: Record<string, string>`
- indexes: `by_stripe_product_id`, `by_active`

`prices`

- `stripePriceId: string`
- `stripeProductId: string`
- `active: boolean`
- `currency: string`
- `unitAmount?: number`
- `unitAmountDecimal?: string`
- `billingScheme?: string`
- `type: string`
- `recurring?: object`
- `lookupKey?: string`
- `metadata?: Record<string, string>`
- indexes: `by_stripe_price_id`, `by_stripe_product_id`, `by_active`, `by_lookup_key`

## Component API

- `public.listProducts({ activeOnly?: boolean })`
- `public.listPrices({ stripeProductId, activeOnly?: boolean })`
- `private.handleProductCreatedOrUpdated(...)`
- `private.handleProductDeleted(...)`
- `private.handlePriceCreatedOrUpdated(...)`
- `private.handlePriceDeleted(...)`
- `StripeSubscriptions.syncProduct(ctx, { stripeProductId })`
- `StripeSubscriptions.syncPrice(ctx, { stripePriceId })`
- `StripeSubscriptions.syncCatalog(ctx, { limit?: number })`

## Webhooks

Handle these events in the next wave:

- `product.created`
- `product.updated`
- `product.deleted`
- `price.created`
- `price.updated`
- `price.deleted`

Webhook handling should be idempotent and should preserve inactive rows rather than hard-deleting by default, matching Stripe's catalog lifecycle.

## Tests

- Product and price create/update/delete webhook tests.
- Active-only listing tests.
- Lookup key and product ID query tests.
- Stripe v22 type compatibility tests for recurring and decimal fields.
- Backfill/sync action tests with mocked Stripe API responses.
