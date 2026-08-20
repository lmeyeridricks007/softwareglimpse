# Business Communications — Priority-1 Onboarding

**Date:** 2026-08-17  
**Category:** `business-communications`  
**Methodology:** `business-communications-editorial` v1.0.0  
**Hands-on testing:** `false`  
**Affiliate economics:** excluded from every score and best-page rank. **No WordPress auto-publish.**

Non-affiliate credibility products from [`business-communications-product-coverage.md`](./business-communications-product-coverage.md) Priority 1 (Batch A + collaboration defaults). Wave-1 affiliates (Aircall, CallHippo, KrispCall, Freshcaller, Wati, Zenzap, Fastmail, SaneBox) and Kixie were already onboarded — skipped.

## Products

| Product | Slug | Job cluster | Overall | Best-page role | Entry price (researched) | CQ |
| --- | --- | --- | ---: | --- | --- | ---: |
| RingCentral | `ringcentral` | cloud-phone | **8.8** | Phone rank #1 — Best enterprise / all-in-one UCaaS | RingEX Core ~$20/user/mo annual (medium) | **91** |
| Dialpad | `dialpad` | cloud-phone | **8.5** | Phone rank #2 — Best AI-powered calling | Connect Standard $15/user/mo annual (medium) | **91** |
| Zoom | `zoom` | cloud-phone | **8.4** | Phone rank #3 — Best video-led UCaaS / Zoom Phone | Phone Unlimited ~$15–16; bundles higher (medium) | **91** |
| Nextiva | `nextiva` | cloud-phone | **8.1** | Phone rank #5 — Best SMB/mid all-in-one | Core $15/user/mo annual (high) | **91** |
| Microsoft Teams | `microsoft-teams` | team-messaging | **7.3** | Landscape — Best M365 collaboration hub | Free/M365-bundled; Teams Phone from $10 + PSTN | **91** |
| Slack | `slack` | team-messaging | **6.7** | Landscape — Best team messaging for tech teams | Free; Pro $7.25 / Business+ $15 annual | **91** |

Existing phone peers for context: Aircall **8.3** (#4), CallHippo **7.2** (#6), KrispCall **6.8** (#7 fit), Freshcaller **7.0** (#8 fit).

### Criterion matrix (P1)

| Product | ease | voice | routing | integr | analytics | outbound | scale | value | ai | overall |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| ringcentral | 8 | 10 | 10 | 9 | 9 | 8 | 10 | 6 | 8 | 8.8 |
| dialpad | 8 | 9 | 9 | 8 | 9 | 8 | 8 | 7 | 10 | 8.5 |
| zoom | 9 | 9 | 8 | 9 | 8 | 7 | 9 | 8 | 8 | 8.4 |
| nextiva | 8 | 9 | 8 | 8 | 8 | 7 | 8 | 8 | 8 | 8.1 |
| microsoft-teams | 8 | 7 | 5 | 10 | 6 | 3 | 10 | 8 | 8 | 7.3 |
| slack | 9 | 5 | 4 | 10 | 6 | 2 | 9 | 7 | 8 | 6.7 |

## Deliverables

| Artifact | Path |
| --- | --- |
| Batch script | `scripts/onboard-bc-priority1-batch.mjs` |
| Shared runtime | `scripts/lib/bc-onboard-runtime.mjs` |
| Product pack | `scripts/lib/bc-priority1-products.mjs` |
| Seed patcher | `scripts/patch-software-seed-bc-priority1.mjs` |
| Seed snippet | `scripts/_bc-priority1-seed-snippet.ts` |
| Lettermarks | `scripts/generate-bc-priority1-lettermarks.mjs` → `public/brands/{slug}.png` (512×512 SG marks) |
| Teaching visuals | `scripts/generate-bc-priority1-teaching-visuals.mjs` → `public/software/{slug}/overview.png` + `workflow.png` |
| Research / editorial | `src/data/research/{slug}/`, `editorial/assessments|reviews/{slug}.json` |
| Soft seeds | `src/data/seed/software.ts` (97 → **103**) |
| Category seeds | `src/data/category-onboarding/seed/business-communications.ts` `seedProductSlugs` |
| Best page | `src/data/seed/best.ts` — phone ranks 1–8 + Slack/Teams landscape awards |
| Comparisons | 8 new `approvedBcPair` entries in `src/data/seed/comparisons.ts` |

## Comparisons added

- `aircall-vs-ringcentral`
- `dialpad-vs-ringcentral`
- `ringcentral-vs-zoom`
- `aircall-vs-nextiva`
- `aircall-vs-dialpad`
- `microsoft-teams-vs-slack`
- `slack-vs-zenzap`
- `microsoft-teams-vs-zoom`

Messaging pairs are collaboration comparisons — not mixed into phone ranks.

## Pricing grounding (2026-08-17)

| Product | Confidence | Notes |
| --- | --- | --- |
| RingCentral | medium | Seat dollars often selector/quote-gated; RingEX ~$20/$25/$35 annual floors cross-checked |
| Dialpad | medium | Connect Standard/Pro $15/$25 annual; Support/Sell separate ladders |
| Zoom | medium | Phone Unlimited ~$15–16; Workplace+Phone bundles; free meetings ≠ Phone |
| Nextiva | high | Core/Engage/Scale $15/$25/$75 annual on nextiva.com/nextiva-pricing |
| Microsoft Teams | high (Phone SKUs) | Teams Phone Standard $10; PAYG $13; Calling Plan $17; Intl $34 — **requires Teams/M365 license**; PSTN separate |
| Slack | high | Free / Pro $7.25 / Business+ $15 annual on slack.com/pricing |

## Best-page cluster rules

- **Phone / UCaaS ranks only:** RingCentral → Dialpad → Zoom → Aircall → Nextiva → CallHippo → KrispCall → Freshcaller  
- **Landscape awards (not phone peers):** Slack, Microsoft Teams, Wati, Zenzap, Kixie, Fastmail, SaneBox  
- Decision paths route buyers by job (UCaaS vs AI calling vs video vs M365 chat vs Slack vs WhatsApp)

## Quality / gates

- Assessments + reviews: **approved**, `handsOnTesting=false`, methodology `business-communications-editorial` v1.0.0  
- Product-review CQ: **91** for all six (target ≥75)  
- Availability enums: supported | limited | add-on | higher-plan-only | not-supported | unknown only  
- Logos: SoftwareGlimpse lettermarks (not scraped trademarks)  
- Teaching visuals: educational SVG→PNG diagrams (prefer GenerateImage refresh later)  
- `content:validate`: 51 pre-existing non-BC errors; **zero BC Priority-1 attributable errors**  
- No WP auto-publish  

## Follow-ups

- Prefer premium GenerateImage teaching visuals when refreshing BC guide packs  
- Replace lettermarks with vendor press-kit assets only if licensing allows  
- Batch B remainder / Batch C from coverage plan (OpenPhone, 8x8, etc.) still open  
