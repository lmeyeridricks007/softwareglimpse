# CRM Finder

First implementation of SoftwareGlimpse interactive finders.

**Route:** `/tools/crm-finder/` (indexable landing + client wizard)  
**Methodology version:** `crm-finder-v1`  
**Code:** `src/components/finder/*`, `src/app/tools/crm-finder/page.tsx`, `src/services/recommendation/*`

## Questions (UI → answers)

Config: `src/components/finder/crm-finder-questions.ts`

| Step | Field | Notes |
| --- | --- | --- |
| Company size | `companySizeSlug` | Taxonomy: solo, micro, small-business, mid-market, enterprise (employee ranges aligned) |
| CRM users | `crmUsers` | 1–5000 in UI (schema allows up to 10000) |
| Primary goal | `primaryUseCaseSlug` | Canonical CRM use-case slugs |
| Capabilities | `requiredFeatureSlugs` | Canonical feature slugs only |
| Integrations | `preferredIntegrationSlugs` | Small fixed list; `none` cleared before scoring |
| Budget | `budgetBand` | EUR per-user/month bands |
| Ease vs sophistication | `easePreference` | Maps to priority weights |
| Business type | `businessTypeSlug` | Optional / skippable |

## Normalization

`normalizeCrmFinderAnswers(answers, crmFinderConfig)` maps UI answers → `CrmFinderCriteria`:

- Budget band → `budgetPerUserMax` (EUR) or `null` for no limit
- Ease preference → priority weights (`ease-of-use`, `fast-setup`, `customization`, `minimal-admin`)
- `categorySlug` fixed to `crm`
- `methodologyVersion` from config

## Scoring overview

Pure pipeline in `recommendCrm(criteria, snapshots, config)`:

1. Select primary-CRM candidates  
2. Hard eligibility (e.g. required feature explicitly `not-supported`)  
3. Soft weighted dimensions (use case, features, size, integrations, priorities, budget, business type)  
4. Confidence from known-dimension ratio + research completeness (fixture research caps confidence)  
5. Deterministic explanations + stable sort  

**Affiliate metadata is never on snapshots and never affects ranking.**

## Unknown handling

- Unknown feature/integration evidence does **not** hard-exclude  
- Unknowns lower confidence and appear in result `unknowns[]`  
- Missing pricing → budget dimension unknown (not “over budget”)

## Affiliate independence

Rankings use research + taxonomy fit only. Product pages handle affiliate outbound links and disclosure. The finder CTA prefers `/software/{slug}/` so monetization stays on editorial surfaces.

## State persistence

- `localStorage` key `sg-crm-finder-v1` stores **answers only**  
- Results are **not** separate indexable URLs  
- Answers are **never** placed in the query string (privacy)

## Server vs client

| Layer | Responsibility |
| --- | --- |
| Server `page.tsx` | Indexable landing content, JSON-LD, `getCrmFinderSnapshots()` serialization |
| Client `CrmFinderApp` | Wizard state machine, persistence, calls pure `recommendCrm` |
| Shared `@/services/recommendation` | Deterministic scoring (no I/O, no affiliate) |

No API route is required for scoring. Snapshots are passed as props from the server.

## Methodology version

Config: `src/data/config/recommendation/crm-finder-v1.ts` (`version: "crm-finder-v1"`).

## Future: NL → criteria

Natural language can later map into `CrmFinderAnswers` / `CrmFinderCriteria`. Ranking remains deterministic.

## Future: software-finder generalization

CRM Finder is the pattern: category-specific question config + snapshot builder + versioned weights. A general `/tools/software-finder/` should reuse the same engine shape with per-category configs — not a separate ranking philosophy.
