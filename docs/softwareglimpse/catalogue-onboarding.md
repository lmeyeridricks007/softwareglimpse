# Catalogue onboarding (bulk affiliate inventory)

Operationalize the **existing** SoftwareGlimpse affiliate catalogue at scale — without mass-generating pages or discovering new products.

## Goal

```text
Existing affiliate catalogue
→ Normalize entries
→ Classify entity type
→ Resolve duplicates / aliases
→ Map to categories
→ Determine category readiness
→ Create software onboarding workflows (batches)
→ Stop at blockers / review gates
→ Produce readiness reports
```

Default scope: `catalogueScope: "existing-only"` (no external discovery).

## Source

Canonical inventory: `src/data/catalogue/source/affiliate-inventory.ts`

Adapter: `CatalogueSource` in `src/data/catalogue/source.ts` (`SeedCatalogueSource`).

Legacy onboarding helpers remain in `src/data/seed/affiliate-catalogue.ts` (`findAffiliateCatalogueEntry`).

Commercial metrics (clicks, conversions, fixture revenue) live **only** in the planning layer. They never enter editorial or recommendation scores.

## Pipeline

1. **Import** — load raw `AffiliateCatalogueEntry` records
2. **Normalize** — conservative name cleanup; preserve `rawName`
3. **Classify** — reuse `checkDuplicateProduct` + entity hints → buckets:
   - `SOFTWARE`, `SOFTWARE_LIKE_PLATFORM`, `SERVICE`, `MARKETPLACE`, `LOGISTICS`, `MULTI_PRODUCT_PROGRAM`, `REVIEW_REQUIRED`, `OTHER`
4. **Map** — category readiness, alias map, vendor family (not product collapse)
5. **Priority** — commercial onboarding priority (weights in `src/data/config/catalogue/priority-weights.ts`)
6. **Maturity** — product tiers T0–T5; category maturity DEFINED→MATURE
7. **Plan batch** — prefer coherent category clusters; default 3–5 products
8. **Approve → run** — create/reuse Prompt 12 software workflows; no auto-publish

## Composite programmes

Entries with `multiProductHint` (e.g. Kartra/WebinarJam/EverWebinar, Capsule/Transpond) become `MULTI_PRODUCT_PROGRAM` and enter review/split — never a single fake `/software/` entity.

## CLI

```bash
npm run catalogue:import
npm run catalogue:status
npm run catalogue:status -- --category email-marketing
npm run catalogue:plan -- --dry-run
npm run catalogue:next
npm run catalogue:plan -- --category email-marketing --limit 4
npm run catalogue:approve -- <batch-id>
npm run catalogue:onboard -- --batch next --create-only
npm run catalogue:run -- <batch-id>
npm run catalogue:resume -- <batch-id>
npm run catalogue:commercial
npm run catalogue:research-backlog
npm run catalogue:category-backlog
npm run catalogue:agent-backlog
npm run catalogue:legacy
npm run catalogue:coverage
npm run catalogue:crm
npm run catalogue:report
npm run catalogue:export -- --json
npm run catalogue:validate
npm run catalogue -- explain Pipedrive
npm run catalogue -- review aff-vektoros --decision exclude --notes "ambiguous"
```

All primary commands support `--json`.

## Reconciliation

High commercial priority + mature product (e.g. Pipedrive) → `RECONCILE` / `MAINTAIN`, not duplicate onboarding.

## Cursor usage

- “Plan the next catalogue batch” → `npm run catalogue:next` / `catalogue:plan -- --dry-run`
- “Run that batch” → `catalogue:approve` then `catalogue:run` (or `catalogue:onboard -- --batch next`)

Do **not** manually research/write every product in chat — invoke the workflow engine.

## Validation

```bash
npm run catalogue:validate
```

## Out of scope (this prompt)

- New software / competitor discovery
- Automatic approvals or publishing
- Admin CMS / vendor portal
