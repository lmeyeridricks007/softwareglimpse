# HR, Workforce & Training — Wave 1 Onboarding

**Date:** 2026-08-17  
**Category:** `hr` (ACTIVATED)  
**Methodology:** `hr-editorial` v1.0.0  
**Hands-on testing:** `false` — all scores are research-grounded editorial judgments from vendor documentation and pricing pages, not lab testing.  
**Affiliate economics:** excluded from scoring. No commission, payout, or programme data entered any criterion score, rationale, or ranking input.

## Summary

Four primary products onboarded end to end (research pack → enrichment → assessment → review → `soft()` seed entry). LearnWorlds already existed as marketing-primary and was **not** re-researched; only secondary HR wiring was applied.

- `src/data/seed/software.ts`: **154 → 158** entries (+4 primaries). LearnWorlds soft() updated in place (`secondaryCategorySlugs: ["hr"]` + HR use cases) without touching marketing assessment/review/research.
- Product-review content quality: **CQ 91 for all four** (target ≥ 75, aim 91). Evaluated via `snapshotFromProductReview` + `evaluateAndReport`.
- All four review/assessment/enrichment packs load cleanly through editorial/research stores (`hr-editorial` v1.0.0; 9 criterion assessments; 13 feature-support rows; valid `FeatureAvailability` on AI capabilities).

## Products written

Overall scores are weighted averages over the nine HR criteria (hiring-workforce-fit 15, workflow-depth 14, ease-of-use 12, integrations 12, value-for-money 12, mobile-frontline 10, scalability 9, analytics 8, ai-capabilities 8).

| Product | Role | Job cluster | Overall | CQ | Entry price (researched) | Pricing confidence |
| --- | --- | --- | --- | --- | --- | --- |
| Connecteam | primary | frontline-wfm | **8.3** | 91 | Free ≤10 users; paid hubs from $29/mo annual (first 30) | medium |
| Breezy HR | primary | ats-recruiting | **7.9** | 91 | Free Bootstrap; Startup $157/mo annual | high |
| Jibble | primary | time-attendance | **7.7** | 91 | Free forever unlimited users; Premium ~$4.49/user/mo annual | medium |
| Trainual | primary | sop-training | **7.3** | 91 | Contact/demo (Core/Pro/Premium/Enterprise); $1,000 impl fee | low–medium |
| LearnWorlds | secondary (marketing-primary) | lms-adjacent | **7.1** *(marketing score, unchanged)* | — | Starter $24/mo annual (+$5/enrollment) — not overwritten | — |

### Criterion score matrix

| Product | ease | fit | workflow | integr | mobile | analytics | scale | value | ai | overall |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| connecteam | 9 | 9 | 9 | 8 | 10 | 7 | 8 | 7 | 6 | 8.3 |
| breezy-hr | 8 | 9 | 8 | 8 | 7 | 7 | 8 | 8 | 7 | 7.9 |
| jibble | 9 | 8 | 8 | 7 | 9 | 6 | 7 | 9 | 4 | 7.7 |
| trainual | 8 | 9 | 8 | 7 | 6 | 7 | 8 | 5 | 7 | 7.3 |

### Editorial ranking guidance (for the HR best page owner)

These five do **not** form one ranked list — they split into distinct job clusters.

- **ATS / recruiting:** Breezy HR 7.9 is the Wave-1 ATS primary. Freshteam is inventory-noted as a future peer and was **not** onboarded here — do not invent a Breezy vs Freshteam comparison until Freshteam is researched.
- **Frontline WFM:** Connecteam 8.3 leads Wave-1 on mobile/frontline readiness; multi-hub TCO (Ops / Comms / HR & Skills sold separately) is the main value friction.
- **Time & attendance:** Jibble 7.7 — free forever unlimited users is the headline; paid Premium/Ultimate dollars are medium confidence.
- **SOP / employee training:** Trainual 7.3 — strong job fit; opaque contact pricing + $1,000 implementation fee depress value.
- **LMS adjacent (exclude from undifferentiated ATS/WFM ranks):** LearnWorlds remains marketing-primary. Surface as landscape/adjacent employee-learning on the HR best page — do not overwrite marketing editorial packs.

`best.ts` was deliberately **not** touched — left to the HR best-page owner.

## File paths

**Scripts**

- `scripts/lib/hr-onboard-runtime.mjs` — shared HR onboard runtime (`hr-editorial` criteria/features/weights)
- `scripts/lib/hr-compact-expand.mjs` — compact → full product expand
- `scripts/lib/hr-wave1-products.mjs` — Wave-1 compact product configs
- `scripts/onboard-hr-wave1-batch.mjs` — idempotent batch writer
- `scripts/patch-software-seed-hr-wave1.mjs` — append-only soft() patcher + LearnWorlds secondary HR wiring (`MIN_EXPECTED_ENTRIES = 150`)
- `scripts/_hr-wave1-seed-snippet.ts` — generated soft() fragment
- `scripts/_hr-wave1-comparisons.json` — empty (0 pairs by design)
- `scripts/_hr-wave1-official-videos.json` — empty this wave
- `scripts/fetch-brand-logos.mjs` — HR Wave-1 targets added

**Per product** (`{slug}` ∈ breezy-hr, connecteam, jibble, trainual)

- `src/data/research/{slug}/` — sources, facts, enrichment, jobs, snapshots, conflicts, fixtures
- `src/data/editorial/assessments/{slug}.json`
- `src/data/editorial/reviews/{slug}.json`
- `public/brands/{slug}.png`

**Seeds / dimensions**

- `src/data/seed/software.ts` — +4 soft() entries; LearnWorlds secondary HR
- `src/data/seed/dimensions.ts` — six HR use cases (`recruiting-ats`, `workforce-scheduling`, `time-attendance`, `employee-training`, `sop-documentation`, `frontline-ops`)
- `src/data/seed/comparisons.ts` — `HR_COMPARISON_CRITERIA` + `approvedHrPair()` helper; **0 pairs shipped**

## Comparisons

**Decision: ship 0 comparison pages in Wave-1.**

Rationale:

- Each primary sits in a different job cluster (ATS vs frontline WFM vs time vs SOP).
- Cross-cluster pages (e.g. breezy-hr vs jibble) would be manufactured peer comparisons.
- `breezy-hr vs freshteam` is the natural ATS pair, but Freshteam is **not** onboarded in this wave — skipped rather than half-wired.
- Prefer sparse catalogue over low-quality forced pairs. `approvedHrPair()` is ready for future same-cluster peers.

## Brand logos

| Slug | Source | Result |
| --- | --- | --- |
| breezy-hr | Webflow CDN product icon | PNG |
| connecteam | connecteam.com favicon → PNG | 48×48 (follow-up: replace with larger brand mark if available) |
| jibble | android-icon-192 | PNG |
| trainual | Webflow webclip | PNG |
| learnworlds | pre-existing | unchanged |

## Affiliates

Active default destinations wired via `npm run affiliate:set`:

| Product | Catalogue source | Destination |
| --- | --- | --- |
| breezy-hr | aff-breezy-hr | https://breezyhr.partnerlinks.io/2mnqgfqugfj2 |
| connecteam | aff-connecteam | https://partners.connecteam.com/h77a37h9xngf |
| jibble | aff-jibble | https://affiliate.jibble.io/acciur08fa6h |
| trainual | aff-trainual | https://start.trainual.com/8kshk4tc5bv4 |
| learnworlds | aff-learnworlds | pre-existing (unchanged) |

## Pricing confidence and verification gaps

- **High:** Breezy HR — static first-party pricing HTML (annual floors, free Bootstrap limits, trial, add-ons).
- **Medium:** Connecteam — hub floors from help-center yearly documentation; multi-hub TCO and over-30 per-user rates need live confirmation.
- **Medium:** Jibble — free forever confirmed first-party; paid Premium $4.49 / Ultimate $7.99 annual preferred from StackArbiter May 2026 cite — confirm live upgrade plans.
- **Low–medium:** Trainual — contact/demo only; $1,000 implementation fee from FAQ; no public seat dollars.
- **Unchanged:** LearnWorlds marketing pricing research left intact.

## LearnWorlds note (secondary HR only)

- `primaryCategorySlug` remains `"marketing"`.
- Added `secondaryCategorySlugs: ["hr"]`.
- Appended use cases `employee-training`, `sop-documentation` without removing marketing use cases.
- Assessment / review / research packs **not** rewritten (still `marketing-editorial`).
- Treat as landscape/adjacent on the future HR best page — not an ATS or WFM peer.

## Validation

- Enrichments: AI `availability` values only use permitted FeatureAvailability enums.
- Assessments/reviews load via `@/data/editorial/store` with methodology `hr-editorial` and overall scores matching the weighted matrix above.
- Soft() guard: patcher refuses runs if `software.ts` has fewer than 150 entries.
- Idempotency: re-running the batch overwrites packs with identical scores; re-running the patcher skips existing slugs and reports LearnWorlds already wired.
- CQ: breezy-hr / connecteam / jibble / trainual all **91**.

## Deliberately out of scope

- `src/data/seed/best.ts` — untouched (HR best-page owner).
- Freshteam onboarding / breezy-hr-vs-freshteam comparison.
- Cross-cluster manufactured comparisons.
- Overwriting LearnWorlds marketing editorial.
- WordPress auto-publish.
