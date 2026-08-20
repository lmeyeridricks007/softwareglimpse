# Approved Asset Workflow

> Spec date: 2026-08-15  
> Workflow version: `1.0.0`  
> Status: **Discovery ≠ approval.** Never auto-import the discovery corpus.

## 1. Purpose

Convert **selected, explicitly approved** discovered assets into canonical SoftwareGlimpse records:

| Target | When |
| --- | --- |
| **ResearchMedia** | Official videos / tutorials / webinars |
| **ResearchSource** | Official docs / help / pricing pages (link/cite) |
| **Placement recommendations** | Page-specific surface guidance (stored separately) |

Discovery agents only recommend. This workflow is the only supported path from recommendation → enrichment.

## 2. Lifecycle

```text
DISCOVERED
    ↓
SOURCE VERIFIED
    ↓
RELEVANCE REVIEWED
    ↓
USAGE REVIEWED
    ↓
MAPPED
    ↓
EDITORIALLY APPROVED
    ↓
ACTIVE
```

| Stage | Meaning | ResearchMedia.status (on import) |
| --- | --- | --- |
| `DISCOVERED` | In approval queue; not official yet | — (not imported) |
| `SOURCE_VERIFIED` | Official vendor source confirmed | — |
| `RELEVANCE_REVIEWED` | Buyer/page relevance accepted; grounded `whatThisShows` | — |
| `USAGE_REVIEWED` | embed / link / cite / do-not-use decided | — |
| `MAPPED` | Entities + placement recommendations recorded | — |
| `EDITORIALLY_APPROVED` | Eligible to import | `needs-review` after import |
| `ACTIVE` | Explicitly activated for public UI | `active` / `published` |
| `REJECTED` | Failed relevance or usage (`do-not-use`) | never imported |

**Rejects** stop the pipeline. There is no silent skip to ACTIVE.

## 3. Usage state

Track whether an approved recommendation was actioned:

| State | Meaning |
| --- | --- |
| `approved` | Editorially approved; may not yet appear on pages |
| `active` | Canonical media active in enrichment |
| `embedded` | Intended/used as embed on one or more surfaces |
| `linked` | Intended/used as source link / cite |
| `not-used` | Queued or abandoned — audits can see the gap |

Future asset audits should compare enrichment backlog recommendations against usage state.

## 4. Engineering / editorial workflow

Do **not** edit raw enrichment JSON by hand when this CLI can drive the gates.

```bash
# 1. Register a selected candidate (from discovery — still DISCOVERED)
npm run assets:approve -- register \
  --product hubspot \
  --url "https://www.youtube.com/watch?v=HKaG5HN89x8" \
  --title "HubSpot Sales Hub Overview Demo" \
  --feature workflow-automation \
  --shows "Sales workspace layout"

# 2. Inspect
npm run assets:approve -- inspect <candidate-id>

# 3. Source verification
npm run assets:approve -- verify-source <id> \
  --kind vendor-channel \
  --channel "HubSpot" \
  --org "HubSpot"

# 4. Relevance
npm run assets:approve -- review-relevance <id> --pass \
  --shows "Sales workspace layout" \
  --shows "Pipeline and deal surfaces"

# 5. Usage rights / recommendation
npm run assets:approve -- review-usage <id> --action embed

# 6. Entity mapping (one media, many entities — never duplicate per page)
npm run assets:approve -- map <id> \
  --product hubspot \
  --feature workflow-automation \
  --feature pipeline-management \
  --use-case lead-management

# 7. Page placements (separate from canonical media)
npm run assets:approve -- place <id> \
  --route /software/hubspot/ \
  --type software-review \
  --section features \
  --section-title Features \
  --subsection "Workflow Automation" \
  --media-placement features \
  --use embed \
  --reason "HubSpot Review → Features → Workflow Automation"

npm run assets:approve -- place <id> \
  --route /features/workflow-automation/ \
  --type feature \
  --section evidence \
  --section-title Evidence \
  --subsection HubSpot \
  --media-placement evidence \
  --use embed \
  --reason "Workflow Automation Feature Page → HubSpot evidence"

# 8. Editorial approval
npm run assets:approve -- editorial-approve <id>

# 9. Import (deduped) — still not public unless --activate
npm run assets:approve -- import <id> --persist
npm run assets:approve -- import <id> --persist --activate

# 10. Or activate later
npm run assets:approve -- activate <id> --persist

# 11. Record page action
npm run assets:approve -- usage <id> --state embedded
```

Queue storage (not enrichment):

- `data/content-assets/approval-queue/<id>.json`
- `data/content-assets/placements/<id>.json`

## 5. Deduplication

Before create:

1. Provider + `providerId` (YouTube / Vimeo id)  
2. Canonical / normalized `sourceUrl`  
3. Existing ResearchMedia on the product enrichment  
4. Existing ResearchSource URL (non-video)

On match → **reuse** the canonical record and merge entity ids.  
Never create a second ResearchMedia for the same video “per page.”

Implementation reuses `findDuplicateResearchMedia` from feature-media-research.

## 6. Entity mapping

Approved assets may link to:

- `productIds[]`
- `featureIds[]`
- `capabilityIds[]`
- `requirementIds[]`
- `useCaseIds[]`
- `industryIds[]`
- `guideIds[]` (optional durable guide relationship)

`ResearchMedia.guideIds` is supported for durable links; prefer **placement recommendations** for guide section surfaces.

## 7. Page placement (separate)

Canonical media example:

> ResearchMedia: HubSpot Workflow Demo

Placement recommendations (separate records):

| Page | Section | Use |
| --- | --- | --- |
| HubSpot Review `/software/hubspot/` | Features → Workflow Automation | embed |
| Workflow Automation Feature Page | HubSpot evidence | embed |
| Lead Management Use Case | Follow-up step | link |

Placements do not duplicate media. UI selectors read enrichment media + optional placement hints.

## 8. Health checks (after ACTIVE)

Existing media-health / governance continues to own post-activation monitoring:

```bash
npm run audit:media-health
npm run audit:media-health -- hubspot
```

Checks (via `evaluateMediaGovernance`):

- availability / source health  
- embedding allowed  
- official source status  
- freshness / beyond-review-threshold  
- product UI age (`stale-ui`)  
- linked feature / industry relationship drift  

Governance **never auto-deletes** research history; it recommends status / visibility changes for editorial follow-up.

## 9. Models

| Model | Location |
| --- | --- |
| `ApprovedAssetCandidate` | `src/domain/schemas/approved-asset-workflow.ts` |
| `AssetPlacementRecommendation` | same |
| `AssetUsageState` | same |
| Lifecycle + import | `src/services/asset-discovery/approval/` |
| ResearchMedia | `src/domain/schemas/product-media.ts` |
| ResearchSource | `src/domain/schemas/research-source.ts` |

Related existing pipelines (feature / capability / use-case / requirement / industry media research) remain valid for domain-specific research. This workflow is the **discovery → approval → import** bridge for Official Asset Discovery.

## 10. Guardrails

- Discovery reports never write enrichment  
- No invented URLs  
- Affiliate URLs are never evidence  
- `officialSource` stays false until SOURCE_VERIFIED  
- Import without `--activate` leaves media at `needs-review`  
- Media must not affect rankings  
- Prefer original SoftwareGlimpse visuals when usage rights are unclear (`do-not-use` / create-original path)

## 11. Code map

| Path | Role |
| --- | --- |
| `scripts/approved-asset-workflow-cli.ts` | CLI |
| `src/services/asset-discovery/approval/` | Lifecycle, import, placements, inspect |
| `data/content-assets/approval-queue/` | Candidate JSON |
| `data/content-assets/placements/` | Placement JSON |
| `npm run assets:approve` | Entry |
| `npm run audit:media-health` | Post-activation health |
