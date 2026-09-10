# SoftwareGlimpse Editorial System

SoftwareGlimpse is a **software buying intelligence publication**: structured research, category methodologies, transparent evidence levels, and affiliate-independent recommendations.

This document is the source of truth for evidence levels, methodology, scoring, authors, trust UI, and schema rules. It mirrors the live platform — it does not invent staff, testing, scores, or credentials.

## Canonical trust routes

| Intent | Canonical URL | Short alias (308) |
|---|---|---|
| About | `/company/about/` | `/about/` |
| How we review | `/company/how-we-review-software/` | `/how-we-review/` |
| Editorial methodology | `/company/editorial-methodology/` | — |
| Editorial policy | `/legal/editorial-policy/` | `/editorial-policy/` |
| Affiliate disclosure | `/legal/affiliate-disclosure/` | `/affiliate-disclosure/` |
| Corrections policy | `/legal/corrections-policy/` | `/corrections-policy/` |
| Editorial independence | `/legal/editorial-independence/` | — |
| Contact / corrections form | `/company/contact/?reason=correction` | — |
| Founder / author story | `/company/my-story/` | — |

Do **not** create duplicate parallel pages for the same policy.

---

## Evidence levels

Defined in `src/domain/schemas/editorial-trust.ts`. Resolved by `resolveEvidenceLevel()` in `src/services/editorial/evidence-level.ts`.

| Level | Public label | When it applies |
|---|---|---|
| `researched` | Research-based review | Default for structured research / methodology coverage |
| `data_verified` | Data verified | Legitimate pricing/data verification stamps only: `pricingVerifiedAt`, `lastVerifiedAt`, or enrichment `pricing.verifiedAt` **with sources** — never mass `domainCheckedAt` batch clocks or `updatedAt` twins |
| `hands_on_tested` | Hands-on tested | `handsOnTesting === true` **and** a non-empty `testedAt` |

### Hard rules

1. **Never conflate** researched, data verified, and hands-on tested.
2. **Never** show “tested” because an AI or content pipeline processed a product.
3. Hands-on requires **both** the boolean flag and a test date.
4. Data verification is **not** hands-on testing.
5. Render only dates and levels supported by structured metadata.

UI: `EvidenceLevelBadge` (`src/components/editorial/evidence-level-badge.tsx`).

---

## Methodology

Plain-language workflow: `/company/how-we-review-software/`

Live category methodologies: `/company/editorial-methodology/` (from `listMethodologies()`).

Standards handbook: `/legal/editorial-policy/`

Independence invariants: `/legal/editorial-independence/`

### Workflow (10 steps)

1. Product selection (coverage sequencing may be commercial; conclusions are not)
2. Product research (snapshots + provenance)
3. Pricing verification (timestamps when checked)
4. When first-hand testing occurs (metadata-gated)
5. When first-hand testing has **not** occurred (say so)
6. Comparisons from shared criteria
7. Score calculation from weighted criteria
8. Recommendations / Finder (no affiliate metadata in ranking)
9. Affiliate relationships (disclosure; never rankings)
10. Updates and corrections

Schemas: `MethodologySchema`, `MethodologyCriterionSchema` in `src/domain/schemas/editorial.ts`.

---

## Scoring framework

Infrastructure lives in:

- `src/domain/schemas/scoring.ts` — standard dimensions, category profiles, `EditorialDimensionScore`, traceable overall scores
- `src/services/editorial/scoring.ts` — weighted overall from methodology criteria
- `src/services/editorial/scoring-framework.ts` — category profiles + dimension traceability

### Standard dimensions (catalog)

`easeOfUse`, `features`, `automation`, `reporting`, `integrations`, `value`, `setup`, `support`, `scalability`

Categories map a **subset** with weights. Irrelevant dimensions are not forced onto every category.

### Per-dimension storage

Each dimension score stores:

- `score` (0–10)
- `weight`
- `evidence` (fact / source ids)
- `notes` (rationale)
- `confidence`

### Traceability

`TraceableOverallScore` requires dimension rows. Overall = weighted mean of those rows.

### Hard rules

- **Do not** assign arbitrary scores to products without approved assessments.
- **Do not** invent historical score series.
- Public scores appear only when editorial assessment/review is **approved** (existing gate in `buildSoftwareReviewModel`).
- Provisional enrichment-mapped scores stay `confidence: low` / `assessment-in-progress` and are not finished judgments.

---

## Author system

Schema: `AuthorSchema` in `src/domain/schemas/site-foundation.ts`

Configured authors: `src/data/config/site/foundation.ts` → `authors[]`

Helpers:

- `getAuthorById` / `getAuthorBySlug` / `listAuthors` / `resolveAuthor` / `getFounderAuthor`

### Supported fields

`id`, `name`, `slug`, `role`, `shortBio`, `fullBio`, `photoPath` (only if legitimate), `expertise[]`, `socialLinks`, `disclosure`

### Hard rules

- **Do not invent staff.**
- **Do not invent credentials, employers, or years of experience.**
- Public author surface today: founder story at `/company/my-story/` (legacy `/author/*` intentionally 404s).
- Content metadata `author` / `reviewer` resolve against configured authors when they match id, slug, or exact name; otherwise omit.

---

## Review metadata

`EditorialTrustMetadata` (`src/domain/schemas/editorial-trust.ts`) can store:

| Field | Meaning |
|---|---|
| `authorId` | Configured author id |
| `reviewerId` | Configured reviewer id when distinct |
| `researchDate` | When research was performed |
| `lastUpdated` | Last editorial/content update |
| `pricingVerifiedAt` | Pricing verification timestamp |
| `testedAt` | Hands-on test date (only with hands-on flag) |
| `evidenceLevel` | Resolved evidence level |
| `methodologySlug` / `methodologyVersion` | Methodology used |
| `sourceIds` | Research source ids |
| `affiliateRelationship` | Known affiliate enabled/disabled |
| `handsOnTesting` | Explicit hands-on flag |

Builder: `buildEditorialTrustMetadata()` — only includes fields with real data.

Product reviews also accept optional `testedAt`, `pricingVerifiedAt`, `researchDate` on `ProductReviewSchema`.

---

## Trust components

| Component | Role |
|---|---|
| `EditorialTrustBlock` | Subtle Written by / Reviewed by / Evidence / Last updated / Pricing checked / Methodology. Variants: `guide` · `review` · `comparison` · `default` |
| `EvidenceLevelBadge` | Transparent evidence state |
| `EditorialProvenance` | Bottom Sources · Methodology · Data checked (no link spam) |
| `TrustStrip` / `TrustIndicators` | Site-wide links to review / methodology / policy / corrections |
| `AuthorshipByline` | Compact byline (still available) |
| `EditorialDisclosures` | Affiliate + methodology + research + AI disclosures |
| `ResearchFreshness` | Research status / last checked callout |

### Placement (keep chrome light)

| Page type | Trust chrome |
|---|---|
| Guide | Written by · Last updated · Methodology (+ provenance footer) |
| Review / software | Written by · Evidence · Pricing verified · Hands-on when applicable · Methodology |
| Comparison / alternatives | Research status · Pricing verification (conservative) · Testing coverage · Methodology |
| Best | Existing principles + methodology section + provenance |
| Research | Report-native methodology / citation (shared provenance optional) |

Pricing verification for evidence levels uses `resolvePricingVerifiedAt()` (product stamp → pricing envelope → enrichment). Never invent verification from generic `updatedAt`.

Coverage audit: `docs/editorial/TRUST-COVERAGE-AUDIT.md`.

---

## Schema.org rules

Implemented in `src/seo/structured-data.tsx`.

### Allowed when facts exist

- `Organization`, `WebSite`, `WebPage`, `Person`
- `SoftwareApplication` (factual fields + Offer only when price + verification date exist)
- `Article` via `articleJsonLd` when a real author and page content exist
- `FAQPage`, `VideoObject`, `BreadcrumbList` when page content supports them

### Never expose unsupported claims

- **No** `AggregateRating`
- **No** `Review` / `reviewRating` nodes fabricated for SEO
- **No** ratings on `SoftwareApplication` without a real, visible, approved scoring surface that matches schema claims
- **No** invented `author`, `datePublished`, or testing claims in JSON-LD

Automated guard: `src/seo/technical-seo.test.ts` asserts `aggregateRating` / `review` stay undefined on SoftwareApplication helpers.

---

## Corrections

Policy: `/legal/corrections-policy/`

Intake: `/company/contact/?reason=correction`

Material fixes update page content and relevant timestamps (`lastUpdated`, pricing verified, tested-at when those change). Do not fabricate a fake public changelog for every typo.

---

## Related code map

```
src/domain/schemas/editorial-trust.ts
src/domain/schemas/scoring.ts
src/domain/schemas/editorial.ts
src/domain/schemas/editorial-review.ts
src/domain/schemas/product-testing.ts
src/domain/schemas/site-foundation.ts
src/services/editorial/evidence-level.ts
src/services/editorial/scoring-framework.ts
src/services/editorial/scoring.ts
src/services/product-testing/
src/services/seo/content-lifecycle/   # INDEXABLE ← IMPROVE ← promote (not permanent noindex)
src/components/editorial/editorial-trust-block.tsx
src/components/editorial/evidence-level-badge.tsx
src/components/product-testing/
src/data/config/site/foundation.ts
src/seo/structured-data.tsx
docs/editorial/EDITORIAL-SYSTEM.md   ← this file
docs/editorial/PRODUCT-TESTING-SYSTEM.md
docs/editorial/PRODUCT-TESTING-QUEUE.md
```

Hands-on claims: see the product testing system. AI must never invent completed test sessions.
