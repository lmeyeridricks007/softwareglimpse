# Testing strategy

## Stack

- **Vitest** for unit/integration (`vitest.config.mts`)
- E2E later (Playwright) — not in Phase 0

## Must-cover domains

| Area | Examples |
| --- | --- |
| Schemas | Invalid software rejected; defaults applied |
| Catalog | Unique slugs; getBySlug; category membership |
| Publishing | Draft/scheduled excluded from public/index |
| Affiliate | Fallback to vendor URL; sponsored rel when enabled |
| SEO utils | Canonical trailing-slash URLs |
| Future | Pricing rules, recommendation scoring, redirects |

## Phase 0 tests

`src/domain/schemas/software.test.ts` covers the architecture gates above.

## Conventions

- Prefer testing pure domain/services over React Server Components
- Reset data caches between tests (`__resetDataCaches`)
- Golden fixtures for scoring once Phase 5 lands

## Commands

```bash
npm run test
npm run typecheck
npm run lint
npm run build
```
