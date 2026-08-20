# Editorial architecture

Pipeline, routing, CRM methodology, and dependency graph for SoftwareGlimpse editorial content.

## Pipeline

```text
Facts → Assessment → Brief → Draft → Validation → Approval → Publish
```

| Stage | What it is | Output |
| --- | --- | --- |
| Facts | Research-verified vendor claims | `ResearchFact`, enrichment |
| Assessment | Human/editorial judgments vs methodology | `ProductEditorialAssessment` |
| Brief | Generation contract (facts + assessments + prohibitions) | `EditorialBrief` |
| Draft | Structured draft (never overwrites published) | `EditorialDraft` |
| Validation | Schema, claims, numbers, gates | `editorial:validate` |
| Approval | Human sets `editorialStatus: approved` | Approved assessment/review |
| Publish | `seo.indexable` + quality gates | Indexable page |

Research enrichment (including fixture-based POC for pipedrive / freshsales / apollo) does **not** make pages indexable or finished reviews.

## Review routing decision

**Canonical product reviews live at `/software/{slug}/`.**

We do **not** use `/reviews/{slug}/` as a parallel public surface. Reasons:

1. One canonical software entity URL avoids duplicate intent.
2. Review content is a **section model** on the product page (verdict, scores, methodology), not a separate thin URL.
3. Internal links and affiliate CTAs stay attached to the product entity.

`ProductReview` content is loaded from the editorial store and rendered on `/software/[slug]/` when present.

## Comparison routing

Canonical comparison slug is **lexicographic** by product slug:

`freshsales` + `pipedrive` → `/compare/freshsales-vs-pipedrive/`

Reverse (`pipedrive-vs-freshsales`) **301s** to canonical.

## CRM methodology

Methodology seed: `crm-editorial` (`src/data/seed/crm-methodology.ts`; alias `crm-software-v1` may also appear in editorial seed).

Criteria include ease of use, pipeline management, sales automation, email, reporting, customization, integrations, administration, scalability, and value for money.

Rules:

- Weights are relative; scores need rationale + evidence refs when available.
- Affiliate status is ignored by scoring.
- Value-for-money must not invent live prices.

## Data layout

```text
src/data/editorial/
  assessments/{slug}.json
  reviews/{slug}.json
  briefs/{pageType}/{slug}.json
  drafts/{pageType}/{slug}/{draftId}.json
  seed/methodology.ts
  seed/assessments.ts
  store.ts
src/data/seed/crm-methodology.ts   # canonical CRM methodology
```
Catalogue shells (comparisons / alternatives / best) remain in `src/data/seed/`.

## UI components

`src/components/editorial/` renders only supported sections when data exists:

- Score (approved only), breakdown, verdict, best-for, tradeoffs
- Comparison summary + accessible table
- Alternative / recommendation cards
- Methodology, freshness, disclosures

## CLI

```bash
npm run editorial:generate -- software pipedrive
npm run editorial:generate -- comparison freshsales-vs-pipedrive --dry-run
npm run editorial:generate -- best crm-software --force
npm run editorial:validate
npm run editorial:report -- pipedrive
```

Generate writes provisional assessments/drafts/reviews for software. Comparison and best pages are seed-owned; generate reports guidance without inventing winners.

## Dependency graph

For a product, editorial completeness depends on:

```text
Software
├── Research facts / enrichment
├── Editorial assessment (+ methodology version)
├── Product review draft (optional until approved)
├── Comparisons (canonical pairs)
├── Alternatives page (sourceSlug)
└── Best pages (eligible pool / recommendations)
```

`editorial:report` prints completeness + relationship graph + editorial statuses for a product.

## CTA rules

`src/services/editorial/cta-rules.ts` enforces max CTAs by page type and placement (`header` / `mid` / `final`).

## Non-negotiables

1. No `seo.indexable: true` without `editorialStatus: approved` (and page-type quality gates).
2. No public scores before approval.
3. No hands-on testing claims by default.
4. No live price invention.
5. Fixture research remains provisional.
