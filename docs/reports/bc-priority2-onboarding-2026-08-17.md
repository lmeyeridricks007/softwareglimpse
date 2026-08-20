# Business Communications — Priority-2 Onboarding

**Date:** 2026-08-17  
**Category:** `business-communications`  
**Methodology:** `business-communications-editorial` v1.0.0  
**Hands-on testing:** `false`  
**Affiliate economics:** excluded from every score and best-page rank. **No WordPress auto-publish.**

Closes Batch B remainder (OpenPhone, respond.io) + Batch C core (8x8, GoTo Connect, Grasshopper) from [`business-communications-product-coverage.md`](./business-communications-product-coverage.md). Deferred: Twilio (adjacent platform), ManyChat, Intercom/Front (CS), Talkdesk/Genesys (P3 / CCaaS).

## Products

| Product | Slug | Job cluster | Overall | Best-page role | Entry price (researched) | CQ |
| --- | --- | --- | ---: | --- | --- | ---: |
| 8x8 | `eightx8` | cloud-phone | **8.6** | Phone rank #2 — Best global / enterprise UCaaS peer | Work X2 ~$24/user/mo annual (medium) | **91** |
| OpenPhone | `openphone` | cloud-phone | **7.5** | Phone rank #7 — Best modern SMB shared phone | Starter $15/user/mo annual (high) | **91** |
| GoTo Connect | `goto-connect` | cloud-phone | **7.4** | Phone rank #8 — Best remote-team UCaaS | Custom quote only (low confidence ranges) | **91** |
| Grasshopper | `grasshopper` | cloud-phone | **6.2** | Landscape — Best SMB virtual numbers (thin UCaaS) | True Solo ~$14/mo annual flat (medium) | **91** |
| respond.io | `respond-io` | customer-messaging | **8.2** | Landscape — Best omnichannel WhatsApp inbox | Starter $79/mo yearly (high) | **91** |

**Slug note for 8x8:** `SlugSchema` accepts `8x8`, but this batch uses **`eightx8`** with aliases `["8x8","8x8 Work"]` to avoid digit-leading path/CSS edge cases.

### Phone ranks after P2 (editorial fit + scores)

1. RingCentral 8.8  
2. **8x8 (`eightx8`) 8.6**  
3. Dialpad 8.5  
4. Zoom 8.4  
5. Aircall 8.3  
6. Nextiva 8.1  
7. **OpenPhone 7.5**  
8. **GoTo Connect 7.4**  
9. CallHippo 7.2  
10. KrispCall 6.8 (fit above Freshcaller)  
11. Freshcaller 7.0  

### Criterion matrix (P2)

| Product | ease | voice | routing | integr | analytics | outbound | scale | value | ai | overall |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| eightx8 | 7 | 10 | 10 | 9 | 9 | 7 | 10 | 6 | 8 | 8.6 |
| openphone | 9 | 8 | 7 | 8 | 7 | 5 | 6 | 8 | 8 | 7.5 |
| goto-connect | 8 | 8 | 8 | 8 | 7 | 6 | 8 | 5 | 7 | 7.4 |
| grasshopper | 9 | 7 | 6 | 5 | 5 | 4 | 5 | 8 | 6 | 6.2 |
| respond-io | 8 | 8 | 9 | 9 | 8 | 8 | 8 | 6 | 9 | 8.2 |

## Deliverables

| Artifact | Path |
| --- | --- |
| Batch script | `scripts/onboard-bc-priority2-batch.mjs` |
| Shared runtime | `scripts/lib/bc-onboard-runtime.mjs` (BATCH_LABEL-aware) |
| Product pack | `scripts/lib/bc-priority2-products.mjs` |
| Seed patcher | `scripts/patch-software-seed-bc-priority2.mjs` |
| Seed snippet | `scripts/_bc-priority2-seed-snippet.ts` |
| Lettermarks | `scripts/generate-bc-priority2-lettermarks.mjs` → `public/brands/{slug}.png` |
| Teaching visuals | `scripts/generate-bc-priority2-teaching-visuals.mjs` → `public/software/{slug}/overview.png` + `workflow.png` |
| Research / editorial | `src/data/research/{slug}/`, `editorial/assessments|reviews/{slug}.json` |
| Soft seeds | `src/data/seed/software.ts` (103 → **108**) |
| Category seeds | `src/data/category-onboarding/seed/business-communications.ts` `seedProductSlugs` |
| Best page | `src/data/seed/best.ts` — phone ranks 1–11 + Grasshopper / respond.io landscape |
| Comparisons | 7 new `approvedBcPair` entries in `src/data/seed/comparisons.ts` |

## Comparisons added

- `aircall-vs-openphone`
- `callhippo-vs-openphone`
- `nextiva-vs-openphone`
- `eightx8-vs-ringcentral`
- `goto-connect-vs-ringcentral`
- `callhippo-vs-grasshopper`
- `respond-io-vs-wati`

Messaging pair is intentionally not mixed into phone ranks.

## Pricing grounding (2026-08-17)

| Product | Confidence | Notes |
| --- | --- | --- |
| OpenPhone | high | Starter/Business/Scale $15/$23/$35 annual confirmed on openphone.com/pricing (Quo branding) |
| 8x8 | medium | First-party often bot/quote gated; Work X2 ~$24 / X4 ~$44; Express ~$15; CC ~$85–$140 cited |
| GoTo Connect | low | goto.com/connect/pricing is quote-only; industry ~$26/$34/$80 ranges are not list prices |
| Grasshopper | medium | Interactive pricing page; True Solo/Solo Plus/Small Business ~$14/$25/$55 annual flat |
| respond.io | high | Starter/Growth/Advanced $79/$159/$279 monthly on yearly toggle confirmed on respond.io/pricing |

## Best-page cluster rules

- **Phone / UCaaS ranks:** RingCentral → 8x8 → Dialpad → Zoom → Aircall → Nextiva → OpenPhone → GoTo Connect → CallHippo → KrispCall → Freshcaller  
- **Landscape awards (not phone peers):** Grasshopper (SMB virtual numbers), respond.io (omnichannel WhatsApp inbox), Slack, Microsoft Teams, Wati, Zenzap, Kixie, Fastmail, SaneBox  
- Do **not** rank WhatsApp BSPs / omnichannel messaging against phone systems

## Quality / gates

- Assessments + reviews: **approved**, `handsOnTesting=false`, methodology `business-communications-editorial` v1.0.0  
- Product-review CQ: **91** target pattern (same editorial depth as Wave-1 / P1; aim ≥75)  
- Availability enums: supported | limited | add-on | higher-plan-only | not-supported | unknown only  
- Logos: SoftwareGlimpse lettermarks (not scraped trademarks)  
- Teaching visuals: educational SVG→PNG diagrams  
- `content:validate`: 51 pre-existing non-BC errors; **zero BC Priority-2 attributable errors**  
- No WP auto-publish  

## Blockers / follow-ups

- **8x8 first-party dollars:** still medium confidence behind bot/quote walls — re-check before hard dollar claims in guides  
- **GoTo Connect:** no published seat dollars — keep custom-quote framing; do not invent list prices  
- **Grasshopper:** interactive pricing; confirm Small Business floor if sources diverge ($55 vs $80)  
- Prefer premium GenerateImage teaching visuals when refreshing BC guide packs  
- Replace lettermarks with vendor press-kit assets only if licensing allows  
- Deferred products remain: Twilio, ManyChat, Intercom/Front, Talkdesk/Genesys (P3)  
- WP publish of BC hubs / reviews still open  
