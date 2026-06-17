# GitHub Issue and PR Triage

This document records the maintenance-wave decisions for the Convex Stripe recovery work.

## Issues

| Item | Decision | Notes |
| --- | --- | --- |
| `#50`, `#35` | Fixed by checkout params passthrough | `createCheckoutSession` now accepts typed Stripe Checkout `params` for fields not modeled by the component. |
| `#15` | Fixed by checkout params passthrough | `ui_mode` can be passed through `params`; non-hosted UI modes omit hosted redirect URLs. |
| `#38` | Fixed with PII scrub | `customer.deleted` clears email, name, and metadata while preserving Stripe/customer linkage. |
| `#24` | Fixed with invoice upsert | Invoice writes are upsert-style and monotonic so delayed `invoice.created` cannot downgrade later statuses. |
| `#19` | Fixed with invoice metadata extraction | Invoice metadata is preferred, with subscription metadata as fallback for user/org linkage. |
| `#54` | Fixed with invoice metadata mirroring | `invoices.metadata` is mirrored and `invoice.updated` refreshes metadata in Convex. |
| `#14` | Fixed with API-version config | `apiVersion` can be supplied to `StripeSubscriptions` and `registerRoutes`. |
| `#25` | Tracking only | Revisit Renovate items after the maintenance release is green. |

Closed issues such as `#39`, `#23`, `#21`, `#18`, `#12`, `#10`, `#9`, `#8`, and `#7` were used only as regression context.

## Pull Requests

| Item | Decision | Notes |
| --- | --- | --- |
| `#51` | Already landed | Preserve Convex linter/codegen hygiene from current `main`. |
| `#49`, `#44`, `#41`, `#55`, `#56` | Already landed | Preserve dependency/workflow/codegen updates from current `main`. |
| `#46` | Reimplemented | Stripe is upgraded on top of current `main` instead of merging the stale branch. |
| `#27` | Reimplemented | Checkout `params` passthrough is landed with tests and docs. |
| `#29` | Reworked | Webhook robustness is rebuilt with soft customer deletion and regression tests. |
| `#20` | Folded into webhook work | Invoice metadata extraction/mirroring is part of the invoice upsert path. |
| `#36`, `#16` | Superseded | The broader `params` escape hatch covers the same use cases. |
| `#6` | Deferred | Products/prices support is valuable but should be designed and implemented as a separate feature wave. |
| Renovate PRs | Revisit later | Major toolchain jumps should stay separate from this Stripe maintenance release. |
