# Products and Prices Feature Design

Products and prices should ship as a separate feature wave after the recovery
release. The goal is to mirror Stripe catalog data into Convex without coupling
catalog sync to subscription/payment correctness.

## Goals

- Mirror Stripe `product.*` and `price.*` webhook events into component tables.
- Expose public queries for active products and prices.
- Support manual sync actions for backfills and local development.
- Preserve Stripe metadata and key billing fields without over-modeling every
  Stripe catalog option.

## Non-Goals

- Do not replace Stripe as the catalog source of truth.
- Do not implement product creation or price creation from Convex in the first
  wave.
- Do not merge this into the Stripe v22 maintenance release.

## Proposed Schema

```typescript
products: defineTable({
  stripeProductId: v.string(),
  active: v.boolean(),
  name: v.string(),
  description: v.optional(v.string()),
  images: v.optional(v.array(v.string())),
  metadata: v.optional(v.any()),
  defaultPriceId: v.optional(v.string()),
  livemode: v.optional(v.boolean()),
  updated: v.optional(v.number()),
})
  .index("by_stripe_product_id", ["stripeProductId"])
  .index("by_active", ["active"]);

prices: defineTable({
  stripePriceId: v.string(),
  stripeProductId: v.string(),
  active: v.boolean(),
  currency: v.string(),
  type: v.string(),
  unitAmount: v.optional(v.number()),
  unitAmountDecimal: v.optional(v.string()),
  recurring: v.optional(v.any()),
  lookupKey: v.optional(v.string()),
  metadata: v.optional(v.any()),
  livemode: v.optional(v.boolean()),
})
  .index("by_stripe_price_id", ["stripePriceId"])
  .index("by_stripe_product_id", ["stripeProductId"])
  .index("by_active", ["active"])
  .index("by_lookup_key", ["lookupKey"]);
```

Use `unitAmountDecimal` as a string because Stripe v21+ models decimal values
more strictly, and consumers should not lose precision by forcing decimals into
JavaScript numbers.

## Component API

Public queries:

- `getProduct({ stripeProductId })`
- `listActiveProducts()`
- `listPrices({ stripeProductId })`
- `getPrice({ stripePriceId })`
- `getPriceByLookupKey({ lookupKey })`

Private mutations:

- `handleProductUpsert`
- `handleProductDeleted`
- `handlePriceUpsert`
- `handlePriceDeleted`

Client actions:

- `syncProduct(ctx, { stripeProductId })`
- `syncPrice(ctx, { stripePriceId })`
- `syncCatalog(ctx, { activeOnly?: boolean, limit?: number })`

## Webhook Events

Register default handling for:

- `product.created`
- `product.updated`
- `product.deleted`
- `price.created`
- `price.updated`
- `price.deleted`

Deletions should not hard-delete rows by default. Mark `active: false` and keep
Stripe IDs for historical subscriptions, invoices, and payments.

## Testing Plan

- Upsert product from create/update events.
- Upsert price from create/update events, including recurring metadata.
- Mark product and price inactive on deleted events.
- Query active products and prices by product ID.
- Query prices by lookup key.
- Backfill sync action writes the same shape as webhook handlers.
- Verify decimal amounts preserve string precision.

## Rollout

1. Add schema and private mutations.
2. Add public queries.
3. Add webhook dispatch.
4. Add sync actions.
5. Add README examples for catalog-driven checkout.
6. Re-evaluate PR `#6` against the final API and close it as superseded or
   extract any remaining tests/examples.
