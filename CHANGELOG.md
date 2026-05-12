# Changelog

## Unreleased

- Upgrade Stripe Node SDK dependency to v22.
- Add optional Stripe API version configuration.
- Add Checkout session params passthrough.
- Improve webhook robustness for subscription updates, invoice upserts, invoice
  metadata linking, and customer deletion PII scrubbing.
- Refresh vulnerable dev/example dependencies without major toolchain upgrades.

## 0.1.4

- Fix subscription quantity updates outside component actions
- Add userId to customers table to prevent duplicates
- Fix cancelAtPeriodEnd not set when canceling via Stripe Portal
- Fix updateSubscriptionMetadata undefined wipe for orgId/userId

credit: advaitpaliwal

## 0.1.3

- Fix subscription sync: `priceId` now updates on plan changes, and
  `cancelAtPeriodEnd` is correctly derived when Stripe sets `cancel_at`

## 0.1.2

- Fix updateSubscriptionQuantity: we now pass in STRIPE_SECRET_KEY explicitly.
  component context did not have access to process.env

## 0.1.1

- Update docs

## 0.1.0

- Initial release.
