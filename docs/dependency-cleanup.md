# Dependency Cleanup Notes

Recorded after the recovery branch validated on Stripe SDK v22.

## Landed in This Wave

- Upgraded `stripe` to `^22.1.1`.
- Updated security-sensitive dev/example dependencies without taking major toolchain
  jumps:
  - `@clerk/clerk-react` to `5.61.6`
  - `vite` to `6.4.2`
  - `pkg-pr-new` to `0.0.71`
- Ran `npm audit fix` without `--force`; audit now reports 0 vulnerabilities.

## Renovate PR Decisions

| PR | Decision |
| --- | --- |
| `#46` Stripe v22 | Superseded by this branch. Close after this branch lands. |
| `#37` lock maintenance | Close and let Renovate recreate from the new lockfile. |
| `#40` routine updates | Rebase/recreate after this branch lands; current diff is too broad. |
| `#41` Vercel Analytics v2 | Re-run separately after recovery; do not mix with Stripe/webhook fixes. |
| `#42` React plugin v6 | Re-run separately with Vite compatibility checks. |
| `#44` globals v17 | Low priority; re-run after ESLint stack is decided. |
| `#45` Node 24 | Defer. CI should stay on Node 20 for this release because Stripe v22 only requires Node 18+. |
| `#47` TypeScript 6 | Defer until Convex and Vitest typecheck behavior is known stable on TS 6. |
| `#48` Vite 8 | Defer; large dev-server/build jump not needed for this release. |
| `#49` Convex ESLint plugin v2 | Revisit separately. This branch enables the existing Convex plugin first. |

## Current Guidance

Merge or close dependency PRs one at a time after this recovery branch lands. Keep
the Stripe v22 and webhook fixes isolated from broad frontend/toolchain updates.
