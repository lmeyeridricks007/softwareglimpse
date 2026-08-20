# Business Communications — Wave 1 Onboarding

**Date:** 2026-08-17
**Category:** `business-communications` (ACTIVATED, READY_WITH_PRICING_GAP)
**Methodology:** `business-communications-editorial` v1.0.0
**Hands-on testing:** `false` — all scores are research-grounded editorial judgments from vendor documentation and pricing pages, not lab testing.
**Affiliate economics:** excluded from scoring. No commission, payout, or programme data entered any criterion score, rationale, or ranking input.

## Summary

Eight products onboarded end to end (research pack → enrichment → assessment → review → `soft()` seed entry), plus four comparisons and one secondary-category wiring.

- `src/data/seed/software.ts`: **89 → 97** entries. Pre-existing CRM (39), sales-intelligence (23), email-marketing (17) and marketing (10) products all intact.
- Product-review content quality: **CQ 91 for all eight** (target ≥ 75, aim 90+). Mean 91.0, no missing sections, no page-type checklist failures.
- All eight review page models build successfully with 9 criterion assessments each and the methodology resolving to `business-communications-editorial` v1.0.0.

## Products written

Overall scores are weighted averages over the nine BC criteria (ease-of-use 12, voice-messaging-quality 15, routing-workflows 14, integrations 14, analytics 10, outbound-tools 8, scalability 9, value-for-money 10, ai-capabilities 8).

| Product | Role | Job cluster | Overall | CQ | Entry price (researched) |
| --- | --- | --- | --- | --- | --- |
| Aircall | primary | cloud-phone | **8.3** | 91 | ~$30/licence/mo annual, 3-licence minimum |
| Wati | primary | customer-messaging | **7.6** | 91 | ~$49/mo annual platform fee + Meta message fees |
| CallHippo | primary | cloud-phone | **7.2** | 91 | $18/user/mo annual (Basic $0 for 6 months) |
| Freshcaller | primary | cloud-phone | **7.0** | 91 | Free tier + $15/agent/mo annual |
| KrispCall | primary | cloud-phone | **6.8** | 91 | $12/user/mo annual + pay-as-you-go usage |
| Zenzap | primary | team-messaging | **6.1** | 91 | free tier + paid tiers |
| Fastmail | adjacent | inbox-adjacent | **4.8** | 91 | $5–$6/mo individual; $4–$10/user/mo business |
| SaneBox | adjacent | inbox-adjacent | **4.6** | 91 | $7/mo (Snack) to $36/mo (Dinner) |

### Criterion score matrix

| Product | ease | voice | routing | integr | analytics | outbound | scale | value | ai | overall |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| aircall | 8 | 9 | 9 | 10 | 8 | 8 | 8 | 5 | 8 | 8.3 |
| callhippo | 8 | 7 | 7 | 7 | 7 | 7 | 7 | 9 | 6 | 7.2 |
| krispcall | 8 | 8 | 6 | 6 | 6 | 7 | 6 | 9 | 5 | 6.8 |
| freshcaller | 8 | 7 | 8 | 7 | 7 | 4 | 8 | 8 | 4 | 7.0 |
| wati | 8 | 8 | 8 | 7 | 7 | 9 | 7 | 6 | 8 | 7.6 |
| zenzap | 9 | 6 | 5 | 5 | 3 | 2 | 8 | 9 | 8 | 6.1 |
| fastmail | 8 | 4 | 5 | 5 | 2 | 2 | 6 | 8 | 2 | 4.8 |
| sanebox | 8 | 3 | 6 | 4 | 3 | 2 | 4 | 6 | 5 | 4.6 |

### Editorial ranking guidance (for the BC best page owner)

The eight products do not form one ranked list — they split into three job clusters, and only the first is a phone-system peer set.

- **Cloud phone (comparable):** Aircall 8.3 leads on mid-market CTI polish, routing and integration breadth, and is the weakest on value (5/10) because of the $30 floor plus a 3-licence minimum plus paid AI/analytics/WhatsApp add-ons. CallHippo 7.2 is the SMB dialer-value pick. Freshcaller 7.0 ranks above KrispCall on routing and scalability but has no outbound dialer (4/10) — it is an inbound-support product inside the Freshworks ecosystem. KrispCall 6.8 is the budget global-numbers pick.
- **Messaging (not a phone peer):** Wati 7.6 is a WhatsApp Business BSP. Its score is high but is earned on a different criterion mix (outbound 9, AI 8) and it should not be ranked against phone systems on a "best business phone" page.
- **Adjacent (exclude from phone rankings):** Fastmail 4.8 and SaneBox 4.6 score low against BC criteria by design — they are email/inbox tools measured against a voice-and-routing rubric. Both carry `membershipRole: "adjacent"` with an `adjacentNote` explaining the fit, and both should be surfaced as adjacent tooling rather than ranked competitors.

`best.ts` was deliberately **not** touched — left to the BC best-page owner.

## File paths

**Scripts**

- `scripts/onboard-bc-wave1-batch.mjs` — idempotent batch: research packs, facts, enrichment, assessments, reviews, seed snippet, comparison specs, video specs
- `scripts/_bc-wave1-seed-snippet.ts` — generated `soft()` entries (fragment file, same convention as the EM/SI/marketing snippets)
- `scripts/patch-software-seed-bc.mjs` — append-only, idempotent patcher with a corruption guard that refuses to run if `software.ts` has fewer than 89 entries
- `scripts/fetch-brand-logos.mjs` — new reusable logo fetcher (HTML `<link rel=icon>` parsing, apple-touch-icon and favicon fallbacks, `sips` conversion to PNG)
- `scripts/_bc-wave1-comparisons.json` — generated comparison specs

**Per product** (`{slug}` ∈ aircall, callhippo, krispcall, freshcaller, wati, zenzap, fastmail, sanebox)

- `src/data/research/{slug}/` — 7 artifacts: `sources.json`, `facts.json`, `enrichment.json`, `jobs.json`, `snapshots.json`, `conflicts.json`, `fixtures/`
- `src/data/editorial/assessments/{slug}.json`
- `src/data/editorial/reviews/{slug}.json`
- `public/brands/{slug}.png`

**Seeds**

- `src/data/seed/software.ts` — 8 appended `soft()` entries
- `src/data/seed/comparisons.ts` — `BC_COMPARISON_CRITERIA`, `approvedBcPair()` helper, 4 comparison entries

## Comparisons

Four pairs, all `editorialStatus: "approved"`, `researchStatus: "complete"`, and confirmed **indexable** through `isEntityIndexable`. Each carries nine outcomes: five factual (starting-pricing, user-minimum, number-coverage, power-dialer, whatsapp-business) with researched prose, and four editorial (crm-integrations, routing, analytics, ai-features) derived from criterion scores.

- `aircall-vs-callhippo`
- `aircall-vs-krispcall`
- `callhippo-vs-krispcall`
- `aircall-vs-freshcaller`

All four resolve `overallWinnerKind: "depends"` — no universal winner is asserted.

Wati and Zenzap were deliberately **not** given comparisons against phone systems: a WhatsApp BSP and a team-chat app are different buyer jobs, and a `wati-vs-aircall` page would be a manufactured comparison.

## Brand logos

All eight fetched from official first-party sources (no placeholders):

| Slug | Source | Result |
| --- | --- | --- |
| aircall | `aircall.io/apple-touch-icon.png` | 180×180 PNG |
| callhippo | `callhippo.com/web-app-manifest-192x192.png` | 192×192 PNG |
| krispcall | `krispcall.com/wp-content/uploads/2025/01/favicon-krispcall.png` | 512×512 PNG |
| freshcaller | `freshworks.com/favicons/apple-touch-icon.png` | 180×180 PNG |
| wati | `wati.io/wp-content/uploads/2023/05/cropped-Favicon-512px-192x192.png` | 192×192 PNG |
| zenzap | Webflow CDN app icon (zenzap.co) | 256×256 PNG |
| fastmail | `fastmail.com/apple-touch-icon.png` | 180×180 PNG |
| sanebox | `assets.sanebox.com/.../apple-touch-icon-*.png` | 180×180 PNG |

**Follow-up:** the Freshcaller mark is the corporate Freshworks favicon, not a Freshcaller-specific logo — worth replacing with a product-specific asset if one is available.

## Pricing confidence and verification gaps

The category is flagged READY_WITH_PRICING_GAP, and this batch confirms why. Confidence is recorded per fact.

- **High confidence (fully served in static HTML):** CallHippo, Freshcaller, Fastmail, SaneBox, Zenzap tier structures.
- **Medium confidence — client-side rendered pricing:** **Aircall** and **Wati** render prices in JavaScript, so the floors ($30/$50 for Aircall; ~$49/$99/$299 platform bands for Wati) come from documentation and widely cited figures rather than scraped page text. Both are marked medium confidence with `pricingNotes` instructing live verification.
- **Medium confidence — retrieval blocked:** **KrispCall**'s pricing page blocked automated retrieval twice; figures ($12 Essential, $32 Standard annual per user) were cross-checked against third-party summaries and the official page structure.
- **Conflicting sources:** SaneBox trial length is documented as 7 days on the help page and 14 days on the signup flow. Recorded as a conflict rather than silently picking one.
- **Meta pass-through fees:** Wati's total cost of ownership includes Meta per-conversation/per-message charges that Wati does not control and does not publish as a fixed rate. Noted in `pricingNotes`; not modelled as a plan price.

## Validation

- **Typecheck:** clean. `scripts/_bc-wave1-seed-snippet.ts` reports `TS1109` exactly as the eight existing `_*-seed-snippet.ts` fragment files do — these are intentionally bare `soft({...})` fragments, not standalone modules.
- **Schemas:** all 8 reviews parse against `ProductReviewSchema`, all 8 assessments against `ProductEditorialAssessmentSchema`, all 8 enrichments against `ProductResearchEnrichmentSchema`. 13 feature-support entries per product using only permitted `FeatureAvailability` values; 23–25 facts per product.
- **Content validation:** zero BC-attributable errors. Use-case, category, team-type, business-size, competitor, alternative and comparable slug references all resolve.
- **Idempotency:** re-running the batch reproduces identical scores; re-running the patcher correctly reports "nothing to insert" and leaves the file unchanged.

**Final state: `npm run content:validate` reports 52 errors, of which zero are attributable to Business Communications.** The remaining 52 are pre-existing sales-intelligence, email-marketing and marketing reference gaps (`data-enrichment` use case, `neverbounce`, `kajabi`, `zoom`, `social-media-marketing`, etc.).

### Pre-existing blockers encountered during this batch

For most of this batch, `content:validate` could not complete at all because of two pre-existing throwing failures unrelated to BC. Both traced to one root cause: **ActiveCampaign and Mailchimp are both `primaryCategorySlug: "crm"`**, so the generated `crmCompeteMesh()` collided with hand-written email-marketing entries.

1. `Duplicate relationship: competes-with:activecampaign:mailchimp` — mesh-generated edge collided with a hardcoded edge in `src/data/seed/relationships.ts`.
2. `Duplicate comparison slug: activecampaign-vs-mailchimp` — CRM-generated pair collided with the email-marketing pair.

Neither involved a BC product, and no BC product enters the CRM mesh. Both were left untouched per instruction, and **both have since been resolved by the concurrent agent that owns them** — validation now runs to completion.

While the blockers were live, this batch was validated by temporarily downgrading the two duplicate guards in `src/data/repositories/catalog.ts` to warnings, running validation, then restoring the file and verifying it byte-identical. `catalog.ts` and `relationships.ts` carry no changes from this batch.

### One BC issue found and fixed

The four comparisons initially failed the `indexable-fails-quality` gate. Cause: `publishedAt` was set to `2026-08-17T15:00:00.000Z`, which was still in the future at run time (14:01 UTC), so `isPubliclyAvailable` rejected them. Corrected to `09:00:00.000Z`; all four now pass. `VERIFIED_AT` in the batch script had the same forward-dating problem (16:00Z) and was corrected to `09:00:00.000Z` so recorded verification dates are not in the future.

## Secondary wiring

`kixie` already carried `secondaryCategorySlugs: ["business-communications"]` — verified, no edit needed and **no re-scoring under the BC methodology**, per instruction.

BC-linked products total nine: `kixie` (secondary) plus the eight new primaries.

## Deliberately out of scope

- `src/data/seed/best.ts` — untouched, owned by the BC best-page agent.
- No WordPress auto-publish.
- Wave 2+ candidates from the coverage plan beyond these eight.
