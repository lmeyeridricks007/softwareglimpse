# Business Communications — Priority-4 Onboarding

**Date:** 2026-08-17  
**Category:** `business-communications`  
**Methodology:** `business-communications-editorial` v1.0.0  
**Hands-on testing:** `false`  
**Affiliate economics:** excluded from every score and best-page rank. **No WordPress auto-publish.**

Closes previously deferred Twilio / ManyChat / Intercom from [`business-communications-product-coverage.md`](./business-communications-product-coverage.md). Discord/Telegram remain out of scope. Phone-cluster ranks are **unchanged**.

## Products

| Product | Slug | Job cluster | Overall | Best-page role | Entry price (researched) | CQ |
| --- | --- | --- | ---: | --- | --- | ---: |
| Twilio | `twilio` | communications-platform (adjacent) | **7.9** | Landscape — Best programmable communications platform (CPaaS) | Usage: US SMS from $0.0083/msg; Flex named $150 (high) | **91** pattern |
| ManyChat | `manychat` | customer-messaging | **7.2** | Landscape — Best marketing messaging chatbot | Free $0; Essential ~$14 annual (medium); Pro $29 annual (high) | **91** pattern |
| Intercom | `intercom` | customer-messaging (+ secondary `customer-service`) | **8.0** | Landscape — Best AI customer messaging inbox (CS-borderline) | Essential $29/seat + Fin from $0.99/outcome (high) | **91** pattern |

### Phone ranks after P4

**Unchanged** from Priority-3 (editorial fit + scores):

1. RingCentral 8.8 → … → 14. Freshcaller 7.0  

### Criterion matrix (P4)

| Product | ease | voice | routing | integr | analytics | outbound | scale | value | ai | overall |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| twilio | 4 | 9 | 8 | 10 | 7 | 9 | 10 | 7 | 7 | 7.9 |
| manychat | 9 | 7 | 6 | 7 | 6 | 8 | 7 | 8 | 7 | 7.2 |
| intercom | 8 | 8 | 9 | 9 | 8 | 6 | 9 | 5 | 9 | 8.0 |

## Deliverables

| Artifact | Path |
| --- | --- |
| Batch script | `scripts/onboard-bc-priority4-batch.mjs` |
| Shared runtime | `scripts/lib/bc-onboard-runtime.mjs` (`communications-platform` cluster label + FAQ) |
| Product pack | `scripts/lib/bc-priority4-products.mjs` |
| Seed patcher | `scripts/patch-software-seed-bc-priority4.mjs` |
| Seed snippet | `scripts/_bc-priority4-seed-snippet.ts` |
| Lettermarks | `scripts/generate-bc-priority4-lettermarks.mjs` → `public/brands/{slug}.png` |
| Teaching visuals | `scripts/generate-bc-priority4-teaching-visuals.mjs` → `public/software/{slug}/overview.png` + `workflow.png` |
| Research / editorial | `src/data/research/{slug}/`, `editorial/assessments|reviews/{slug}.json` |
| Soft seeds | `src/data/seed/software.ts` (+3 → **125**) |
| Category seeds | `src/data/category-onboarding/seed/business-communications.ts` `seedProductSlugs` |
| Best page | `src/data/seed/best.ts` — phone ranks unchanged; landscape awards + groups + FAQ |
| Comparisons | 5 new `approvedBcPair` entries in `src/data/seed/comparisons.ts` |

## Comparisons added

- `manychat-vs-respond-io`
- `manychat-vs-wati`
- `intercom-vs-manychat`
- `intercom-vs-respond-io`
- `talkdesk-vs-twilio` (cross-cluster landscape decision-path only)

## Pricing grounding (2026-08-17)

| Product | Confidence | Notes |
| --- | --- | --- |
| Twilio | high | twilio.com/en-us/pricing + SMS US + Flex pricing: usage meters; Flex named $150 / hour $1 / MAU $35. No invented CPaaS seat dollars. |
| ManyChat | high (Free/Pro) / medium (Essential/Business/Advanced) | Free 25 Active Contacts + Pro $29 annual from Help Centre; Essential ~$14 / Business ~$69 / Advanced ~$139 from manychat.com/pricing snippets — **pricing HTML fetch timed out**. Dual legacy/new models noted. |
| Intercom | high | Essential $29 / Advanced $85 / Expert $132 seat (annual toggle) + Fin from $0.99/outcome on intercom.com/pricing. Channel paygo not invented. |

## Best-page cluster rules

- **Phone / UCaaS ranks:** unchanged from P3  
- **Landscape awards (not phone peers):** prior set + **Twilio** (CPaaS), **ManyChat** (marketing messaging), **Intercom** (AI CS messaging)  
- New landscape group: `communications-platform` (Twilio)  
- Customer-messaging group now: Wati, respond.io, ManyChat, Intercom  

## Quality / gates

- Assessments + reviews: **approved**, `handsOnTesting=false`, methodology `business-communications-editorial` v1.0.0  
- Product-review CQ: **91** target pattern (aim ≥75)  
- Availability enums: supported | limited | add-on | higher-plan-only | not-supported | unknown only  
- Logos: SoftwareGlimpse lettermarks (not scraped trademarks)  
- Teaching visuals: educational SVG→PNG diagrams  
- No WP auto-publish  

## Blockers / follow-ups

- **ManyChat Essential/Business/Advanced dollars:** medium confidence — re-fetch manychat.com/pricing when HTML retrieval works; region may vary  
- **ManyChat dual pricing:** legacy pre-2026-03-02 Pro-from-$15 vs new Active Contacts model — call out in guides  
- **Twilio:** no SMB seat floor by design — keep Flex $150 clearly labelled as optional CCaaS build, not phone list  
- **Intercom Fin + channel paygo:** TCO stacks — do not invent WhatsApp/SMS channel dollar rates absent from hub  
- Prefer premium GenerateImage teaching visuals when refreshing BC guide packs  
- Replace lettermarks with vendor press-kit assets only if licensing allows  
- WP publish of BC hubs / reviews still open (optional)  
- Discord / Telegram remain out of scope

## Follow-up (2026-08-17)

- Remapped free-text `aiCapabilities.capability` labels on Twilio / ManyChat / Intercom enrichment to the allowed enum so research load no longer Zod-fails.
