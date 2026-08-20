# Business Communications product guides — 2026-08-17

**Category:** `business-communications`  
**Gap closed:** `blocks-bc.ts` + product-guide builder (called out in `business-communications-supporting-content-2026-08-17.md`)

---

## Delivered

| Metric | Count |
| --- | ---: |
| Primary products (published snapshots ∩ primary list) | **23** |
| Guide kinds | 5 (implementation, migration, setup, plans, worth-it) |
| Product guides | **115** (23 × 5) |
| SVG v3 visual assets | **690** (23 × 5 × 6: cover, diagram, step 1–4) |

**Products included:** ringcentral, eightx8, dialpad, zoom, aircall, nextiva, webex, openphone, goto-connect, callhippo, vonage, krispcall, ooma, freshcaller, wati, respond-io, microsoft-teams, slack, zenzap, talkdesk, genesys, five9, grasshopper  

**Excluded (adjacent):** `fastmail`, `sanebox` (same pattern as EM excluding bouncer/inboxally)

---

## Indexability

**`seo.indexable: true`** on all BC product guides (editorial gate cleared 2026-08-17). Guides are `metadata.status: published` with `BC_PUBLISHED_AT = 2026-08-17T18:00:00.000Z` (≤ now). Matches BC category guides.

---

## Key files

| Area | Path |
| --- | --- |
| Blocks | `src/services/product-guides/blocks-bc.ts` |
| Kind config | `BC_PRODUCT_GUIDE_KIND_CONFIG` in `kinds.ts` |
| Context / slug list | `listBcProductGuideSlugs`, `BC_CORE_LOOP_SLUGS` in `context.ts` |
| Builder | `buildBcProductGuide` / `buildAllBcProductGuides` in `build.ts` |
| Seed | `src/data/seed/guides-product-bc.ts` → `guides.ts` |
| Pricing | `listBusinessCommunicationsPricingSnapshots` |
| Visuals | `scripts/product-guide-visuals.ts --bc` |

---

## Regenerate visuals

```bash
npx tsx scripts/product-guide-visuals.ts --bc
```

Writes `-v3` placeholders under `public/guides/{slug}-{cover|diagram|step-v3-N}.png`. Prefer GenerateImage `-v4` teaching visuals later (script never overwrites v4).

---

## Category guides

Light copy refresh on what-is / how-to-choose: job clusters + RingCentral / Dialpad / Zoom / Teams / Slack class leaders mentioned as landscape shapes (no invented scores). Soft-publish unchanged.

---

## Smoke

- `listBcProductGuideSlugs().length` → 23  
- `buildAllBcProductGuides().length` → 115  
- First guide: `ringcentral-implementation` with blocks, checklist, heroVisual path  
- No ESP/campaign chrome in sample blocks  
