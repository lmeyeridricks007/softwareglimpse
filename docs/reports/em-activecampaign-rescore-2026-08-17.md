# ActiveCampaign email-marketing re-score — 2026-08-17

**Scope:** Optional EM re-score + primary-category reclassification from the Email Marketing coverage gap list.  
**Status:** DONE (Next.js catalogue only — no WordPress publish).

## Changes

| Item | Before | After |
| --- | --- | --- |
| Assessment | `assessment-activecampaign-crm-v1` / `crm-editorial` / **7.0** | `assessment-activecampaign-email-marketing-v1` / `email-marketing-editorial` / **7.7** |
| Review | CRM criteria + CRM framing | EM criteria + ESP framing; `assessmentId` points at EM assessment |
| `software.ts` primary | `crm` | `email-marketing` |
| Secondary | `marketing` | `crm`, `marketing` |
| Best Email Marketing | Rank #2 (editorial) | Rank #2 with overall **7.7** noted |
| Best CRM | Rank #13 “Marketing automation CRM” | Retained (secondary CRM fit) |

CRM-era assessment/review archived under `src/data/editorial/_archives/`.

## EM criterion scores (approved)

| Criterion | Score |
| --- | ---: |
| ease-of-use | 7 |
| email-creation | 8 |
| automation | 9 |
| segmentation | 9 |
| analytics | 8 |
| deliverability-tooling | 6 |
| integrations | 8 |
| scalability | 8 |
| value-for-money | 6 |
| ai-capabilities | 8 |
| **Overall** | **7.7** |

`handsOnTesting=false`. Affiliate economics excluded. Pricing floors unchanged from prior first-party research (~$15 Starter at ~1k contacts annual) — confirm live.

## Files

- `src/data/editorial/assessments/activecampaign.json`
- `src/data/editorial/reviews/activecampaign.json`
- `src/data/seed/software.ts`
- `src/data/seed/best.ts` (EM recommendation notes)
- `src/data/research/activecampaign/enrichment.json` (shortDescription)
- `docs/reports/email-marketing-product-coverage.md` (footnote)

## Gates

- Editorial JSON written as approved (same pattern as EM Priority batches).
- No WP publish / no auto-indexable flip beyond existing product hub metadata.
