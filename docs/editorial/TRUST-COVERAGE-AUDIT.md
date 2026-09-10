# Editorial trust coverage audit

Audit date: 2026-09-06 (updated same day — DATA_VERIFIED tightening)

Goal: apply the existing editorial trust/evidence system consistently. **Do not invent evidence.**

## Phase 1 — UI coverage by surface

| Surface | Author | Last updated | Research date | Pricing verified | Evidence level | Methodology | Sources |
|---|---|---|---|---|---|---|---|
| Software overview | Yes (`EditorialTrustBlock` review) | Yes when metadata exists | Yes when researched | Yes when `resolvePricingVerifiedAt` | Yes | Yes | Yes (`EditorialProvenance`) |
| Software evidence tab | Yes (`AuthorshipByline`) | Via evidence center | Via evidence center | Via evidence center | Via evidence center | Yes | Evidence center |
| Reviews (hub overview) | Same as software | Same | Same | Same | Same | Same | Same |
| Comparisons | Hidden (comparison chrome) | In decision header when present | Conservative merge | Only if **both** products verified | Weaker of both (`Research status`) | Yes | Provenance (capped) |
| Guides | Yes (guide variant) | Yes | Omitted (light chrome) | Omitted in compact guide chrome | Omitted in guide chrome | Yes | Provenance when product sources exist |
| Best pages | Principles block (`BestSoftwareTrust`) | Hero / transparency when present | Research transparency | Not claimed page-wide | Not claimed page-wide | Methodology section + provenance | Transparency counts, not link spam |
| Alternatives | Comparison-style trust | Hero + trust when dated | Via evidence | When source product verified | Research status | Yes | Provenance |
| Research reports | Report-native methodology | Observation / updated dates | Report-native | N/A (dataset) | N/A | Dedicated methodology sections | Citation blocks |

## Phase 4 — DATA_VERIFIED inflation (fixed)

**Earlier bug (zero verified):** Coverage only read empty `software.pricingVerifiedAt` / `software.lastVerifiedAt`, ignoring enrichment.

**Over-correction (312/313 verified):** `resolvePricingVerifiedAt()` accepted any `resolveProductPricing().verifiedAt`, which is usually enrichment `pricing.verifiedAt` or `domainCheckedAt.pricing`. Most products share **uniform multi-domain** `domainCheckedAt` batch clocks (Aug 17–18 2026) — catalogue/research import timestamps, not editorial pricing verification.

**Current rule** (`src/services/editorial/pricing-verified-at.ts`):

Accepted:

1. `software.pricingVerifiedAt`
2. `software.pricing.verifiedAt`
3. Enrichment `pricing.verifiedAt` **with** `sourceIds` and **not** equal to `enrichment.updatedAt` / mass `domainCheckedAt` stamp

Rejected:

- enrichment.updatedAt / generatedAt twins
- uniform multi-domain domainCheckedAt mass stamps
- bare domainCheckedAt.pricing without pricing sources

Reconciliation artifact: `docs/editorial/DATA-VERIFIED-RECONCILIATION.md` / `data/seo/data-verified-reconciliation.json` (written by `npm run seo:growth-dashboard`).

Freshness UIs may still show research `domainCheckedAt` — that is **pricing checked in research**, not **DATA_VERIFIED**.

## Phase 5 — Hands-on

Unchanged. AI pipelines never promote to `hands_on_tested`. Comparison trust only claims hands-on when **both** products qualify.

## Phase 6 — Schema alignment

- No fabricated `Review` / `AggregateRating`.
- `articleJsonLd` author only when a real author name is passed (guides / software with editorial).
- `dateModified` only when real metadata timestamps exist (compare, guides, alternatives).
- Visible trust dates come from the same structured fields used for evidence resolution.

## Components

| Component | Role |
|---|---|
| `EditorialTrustBlock` | Page-type variants: `guide` · `review` · `comparison` · `default` |
| `EvidenceLevelBadge` | Evidence state |
| `EditorialProvenance` | Bottom Sources · Methodology · Data checked |
| `EditorialDisclosures` | Affiliate / AI / methodology disclosures |
| `ResearchFreshness` | Available for research callouts |
| `AuthorshipByline` | Evidence tab / compact bylines |
| `BestSoftwareTrust` | Best-page principles (not fabricated scores) |
