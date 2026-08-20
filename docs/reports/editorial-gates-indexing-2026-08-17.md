# Editorial gates — unlock indexing (CRM / SI / EM / Marketing / BC)

**Date:** 2026-08-17  
**Status:** DONE — mark approved.

## 1) Category guides → `seo.indexable: true`

| Cluster | Status |
| --- | --- |
| **CRM** | Already indexable (prior gate) |
| **Email marketing** | Already indexable — 5 category guides + cluster comment “editorial gate cleared” |
| **Business communications** | Already indexable — 5 category guides + product guides; confirmed |
| **Sales intelligence** | Already indexable — stale “Soft-publish until editorial gate” comments cleared on migration / implementation / enrichment-explained guides |
| **Marketing** | No dedicated marketing category-guide cluster yet (EM parent covers buyer education); Marketing best page already `seo.indexable: true` |

No remaining `indexable: false` on EM/BC/SI/CRM category guide seeds.

## 2) Official videos / media — DISCOVERED → ACTIVE

Approval queue before gate: **3** `DISCOVERED` candidates (all other queue rows were already `ACTIVE`).

| Candidate | Product | Disposition |
| --- | --- | --- |
| `cand-aircall-bx6vo7vdmuk-aircall-workspace` | Aircall | Verified vendor-channel → editorial-approve → import **reused** `aircall-video-bx6vo7vdmuk` → **ACTIVE** / embedded |
| `cand-aircall-aedr2o9wrys-aircall-ai-assist-updates` | Aircall | Same path → **reused** `aircall-video-aedr2o9wrys` → **ACTIVE** / embedded |
| `cand-callhippo-rnrjoj-ppls-callhippo-ringing-smarter-webinar` | CallHippo | Verified vendor-training → usage **link** → import **created** media → **ACTIVE** / linked |

```text
npm run assets:approve -- list --stage DISCOVERED
→ Approval queue (0)
```

Used Approved Asset Workflow (`npm run assets:approve`) — discovery ≠ approval; no bulk auto-import of the corpus.

## 3) Best-page awards / ranking decisions

| Best page | `editorialStatus` | `seo.indexable` | Ranking decision |
| --- | --- | --- | --- |
| CRM | approved | true | Unchanged — awards already approved |
| Sales intelligence | approved | true | P1–P4 ranks + landscape confirmed |
| Email marketing | approved | true | EM shortlist confirmed; ActiveCampaign EM re-score 7.7 |
| Marketing | approved | true | P1 + P2 (Iterable #4; social suites landscape) |
| **Business communications** | approved | true | **CONFIRMED: extended UCaaS phone shortlist** (RingCentral → Freshcaller), **not** wave-1-only. Landscape for CCaaS / messaging / collab / CPaaS only |

BC page `editorialNotes` updated to record the extended-shortlist decision explicitly.

## Related

- `docs/reports/business-communications-supporting-content-2026-08-17.md` (follow-up #3 decided)
- Queue: `data/content-assets/approval-queue/`
- Workflow: `docs/content-assets/02-approved-asset-workflow.md`
