# GitHub Issue and PR Triage

This document captures the maintenance and feature triage for the next recovery
wave of `@convex-dev/stripe`.

## Issue Decisions

| Issue | Decision | Notes |
| --- | --- | --- |
| `#50` Leaky `createCheckoutSession` abstraction | Fix now | Add a typed checkout params passthrough so common Stripe Checkout options do not require bypassing the component. |
| `#35` Missing checkout params and discount expansion | Fix now | Covered by checkout params passthrough. Discount expansion should be documented as a caller-provided Stripe param. |
| `#15` Allow `ui_mode` | Fix now | Covered by checkout params passthrough instead of adding one-off API fields. |
| `#38` Missing `customer.deleted` handler | Fix now | Add a handler that removes PII while preserving the Stripe customer ID and relationship keys for audit/linking. |
| `#24` Invoice webhook mutation retry conflict | Fix now | Make invoice writes idempotent/upsert-like so `invoice.created`, `invoice.finalized`, and later status events can arrive repeatedly or out of order. |
| `#19` Invoice `userId`/`orgId` metadata | Fix now | Prefer invoice metadata, then fall back to linked subscription metadata. |
| `#14` Stripe API version option | Fix now | Add an optional Stripe client config path so applications can pin API version intentionally. |
| `#25` Dependency dashboard | Track | Keep as dependency tracking; resolve individual Renovate PRs after the recovery branch is green. |

Closed issues are treated as historical context unless a regression is found.

## PR Decisions

| PR | Decision | Notes |
| --- | --- | --- |
| `#51` use convex linter | Reimplement/merge equivalent | Keep the lint rules and warning fixes, but avoid unnecessary generated churn. |
| `#46` Stripe v22 | Reimplement | Small dependency bump. Existing CI failure is from stale generated/API shape, so land after codegen and compatibility fixes. |
| `#27` Checkout params passthrough | Reimplement | Best shape for `#50`, `#35`, and `#15`, with tests and docs added. |
| `#29` Webhook robustness | Rework | Good direction, but conflicts and needs soft PII deletion plus tests. |
| `#20` Invoice metadata | Fold into webhook work | Implement alongside invoice upsert behavior. |
| `#36` additionalParams escape hatch | Superseded | Close after the `#27`-style API lands. |
| `#16` promotion code and UI params | Superseded | Close after the general checkout params API lands. |
| `#6` products and prices | Design next | Valuable but too large/conflicting for the maintenance release; split into a dedicated feature wave. |
| Renovate `#40`, `#41`, `#42`, `#44`, `#45`, `#47`, `#48`, `#49` | Defer/rebase | Do not merge failing or artifact-conflicted dependency PRs as-is. Revisit after Stripe v22 and lint cleanup. |
| `#37` lock maintenance | Close/recreate | Conflicting and stale; prefer a fresh lockfile update after recovery work. |

## Release Waves

1. **Recovery release**: branch hygiene, lint/codegen, checkout params, webhook
   robustness, Stripe v22, docs, and tests.
2. **Dependency cleanup**: rerun Renovate on the green baseline and merge only
   compatible updates.
3. **Feature expansion**: products/prices support after schema and public API
   design review.
