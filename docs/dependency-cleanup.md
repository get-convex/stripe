# Dependency Cleanup Notes

This recovery wave keeps dependency changes focused on Stripe compatibility and already-landed maintenance updates from current `main`.

## Landed in This Wave

- `stripe` upgraded from `^20.0.0` to `^22.2.1`.
- `@clerk/clerk-react` bumped to `5.61.8`.
- `convex` bumped to `1.41.0`, `convex-test` bumped to `0.0.53`, `vite` bumped to `8.0.16`, `@vitejs/plugin-react` bumped to `6.0.2`, `vitest` bumped to `4.1.9`, and `pkg-pr-new` bumped to `0.0.75` to clear remaining audit chains.
- Added npm overrides for `esbuild@0.28.1` and `ws@8.21.0` until upstream packages pull patched transitive versions directly.
- `npm audit fix` was run without `--force` to pick up compatible transitive fixes.
- Current `main` dependency/workflow hygiene is preserved, including the Convex ESLint plugin, updated workflow actions, and generated component files.
- CI remains on Node 20, which satisfies Stripe Node SDK v22's Node.js >=18 requirement.

## Deferred

Do not merge remaining Renovate PRs directly into this maintenance wave. Re-evaluate them after the Stripe/webhook work is green:

- `actions/checkout` and `actions/setup-node` major updates not already represented on current `main`.
- ESLint, TypeScript, React, and other toolchain bumps that are unrelated to Stripe v22 compatibility.
- Any update that requires broad example-app or build-system changes.

## Audit Status

`npm audit --audit-level=moderate` reports 0 vulnerabilities after the direct dependency updates and transitive `overrides`.
