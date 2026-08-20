# SoftwareGlimpse site-wide editorial audit (full)

**Date:** 2026-08-19 (post-mesh pass)  
**Verdict:** **Structurally complete. Buyer-distinctive quality is still not there at this volume.** Publication readiness remains **NOT_PUBLISHABLE** (legal identity empty — do not invent it). Internal health **85/100** reflects a nearly empty issue ledger, **not** editorial excellence.

Your instinct is correct. Since the morning snapshot, comparison mesh indexability went from **578 thin/noindex → 0**. That fixed *existence and gate compliance*, not whether 4,040 comparison URLs read like independent research. Dimensional quality still averages **88–95** because expected sections exist — the CLI does not score buyer trust, template fatigue, or `confidence: high` research depth.

This document does **not** rewrite or publish anything.

**Related:** [`site-wide-editorial-audit-2026-08-19.md`](./site-wide-editorial-audit-2026-08-19.md) (morning, pre full mesh indexability).

---

## Direct answers

| Question | Answer |
| --- | --- |
| Are all pages complete? | **Almost.** Registry **6,016** published · **6,013** indexable · **1** draft. Blockers: empty legal identity; **Writesonic** indexable but unpublished. |
| Is content detailed, not missing? | **Modules filled, prose often templated.** Reviews avg **95**, guides **93**, comparisons **88** (all **4,040** scored). **0** CQ-P0/P1/P2 anywhere. **0** comparison outcomes at `confidence: high`. **156** outcomes still `confidence: low`. |
| Images / screenshots / videos present? | **Yes for products.** **279** products · **510** active official videos · **0** missing major coverage. **507** vendor-ui captures (median **154 KB** — expected). Guide heroes **3,082** PNGs, median **1,479 KB**, **0** under 900 KB. No `public/compare/` art. |
| Generated visuals follow Cursor rule? | **Site teaching art: yes (size bar).** Guides/software/hubs pass 900 KB+ teaching-visual bar. **Vendor-ui** = control-panel captures, not teaching art. **Social/marketing PNGs:** not OCR-scanned this run; caption copy in `docs/marketing/*.md` correctly keeps trust disclaimers **off-pixel** per `.cursor/rules/softwareglimpse-social-visuals.mdc`. |
| Comparisons detailed? | **Mesh + gates: yes. Distinctive buyer research: mixed.** **4,040 / 4,040** indexable, **0** thin, **0** `in-progress`. Avg CQ **88** — flat because every page has verdict + table + scenarios. **0** “comparable support” boilerplate. **0** `high` confidence outcomes. Cross-cluster IT pairs lean on assessment ties + feature/price fallbacks — honest but repetitive at scale. |
| Comparisons for every in-category permutation? | **Yes.** Primary-category mesh **100%** indexable (see §6). CRM **666/666**. Competitor materializer **3,373** pairs + CRM research **666** = **4,039** (plus authored shells). |
| All guides that should exist, and detailed? | **CORE maps: yes** (`content:clusters:gaps` **0 × 11**). **1,346** published guides (**1,224** product-tied; **~1,003** setup/worth-it/plans/evaluation factory journeys). Weakest scored guides still **90** (ecommerce pillars + a few IT product packs). |
| All affiliate links present? | **CTAs: yes. Programmes: no.** **58** active programmes / **280** software rows · **221** without programme · **1** pending. Every **published** product has a CTA (**57** affiliate + **222** official, **0** missing). `affiliate:validate` **PASS** · `missingDestination` **0**. |
| Links between pages proper? | **Yes.** **26,856** outbound edges · **0** orphans · **0** weak · **0** health errors. `/compare/` hub lists **4,040** children. |
| Technical SEO as good as possible? | **Clean on completed checks** (0 findings, 23 completed, **9 skipped**). Not claimed: production JS budget, field CWV, full-sitemap HTTP crawl, live JSON-LD DOM pass. Sitemap **6,319** URLs. |

---

## How this audit was run

Platform CLIs + deterministic checks only (no invented rankings, prices, or legal facts):

| Layer | Command | Result |
| --- | --- | --- |
| Launch ledger | `npm run audit:site -- --json` | **fail** · NOT_PUBLISHABLE · health **85/100** · 3 open issues |
| Remediation plan | `npx tsx scripts/audit-cli.ts plan --json` | 2 × legal MANUAL_REVIEW · 1 × Writesonic AGENT_SAFE |
| Content quality | `content-audit-cli.ts <scope> --json --no-write` | reviews, guides, comparisons (full **4040**), best, industry, use-case, capability, requirement, feature, resource, crm, product-guide |
| Live SEO | `npm run seo:audit -- audit --mode=full --base=http://127.0.0.1:3000` | 0 findings · 23 completed · **9 skipped** |
| Internal linking | `npm run seo:internal-links` | → `docs/seo/03-internal-linking-report.md` |
| Official media | `npm run audit:media-health -- --json` | 279 products · 510 videos · **0 missing major** |
| Affiliates | `affiliate:coverage --json` + `affiliate:validate` | 58 active · validate **PASS** |
| CORE guide existence | `content:clusters:gaps --json` | **0 gaps** × 11 categories |
| Comparison mesh | live `comparisonsSeed` + `isThinComparisonMesh` | **4040 / 4040** indexable · **0** thin |
| Teaching visuals | PNG size scan under `public/{guides,software,vendor-ui,...}` | see §4 |
| Catalogue coverage | `npm run catalogue:coverage` | **PASS** (no JSON body; exit 0) |

Live SEO probes are **representative routes** on `127.0.0.1:3000`, not all **6,319** sitemap URLs.

---

## Executive snapshot

| Measure | This run | Morning (same day) |
| --- | ---: | ---: |
| Published (registry) | 6,016 | 6,016 |
| Indexable (registry) | 6,013 | 5,435 |
| Site-audit status | **fail** | **fail** |
| Publication readiness | NOT_PUBLISHABLE | NOT_PUBLISHABLE |
| Internal health | 85/100 | 85/100 |
| Open ledger issues | 3 (2 critical · 1 medium) | 2 (2 critical) |
| Published comparisons | 4,040 | 4,040 |
| Indexable comparisons | **4,040** | 3,462 |
| Thin / noindex comparisons | **0** | 578 |
| Comparison outcomes `confidence: high` | **0** | 0 |
| Comparison outcomes `confidence: low` | **156** | 3,386 |
| Published guides | 1,346 | 1,346 |
| Sitemap URLs | **6,319** | 5,741 |
| Outbound link edges | **26,856** | 26,116 |
| Orphans | 0 | 0 |
| Active affiliate programmes | **58** | 28 |
| Products without programme | **221** | 250 |
| Official videos (active) | 510 | 510 |
| Missing major product media | 0 | 0 |

**Biggest delta:** comparison indexability (+578 pairs) after mesh/materializer work. **Unchanged concern:** dimensional scores stay high while buyer-distinctive depth does not.

---

## Why it still *feels* low quality (your instinct)

1. **Quality CLI scores structure, not voice.** Every evaluated page is CQ-P3. Comparisons cluster at **88/100** because verdict, criterion table, scenarios, and evidence slots exist — not because each pair has hand-researched narrative.
2. **No `confidence: high` anywhere on comparisons.** **40,459** medium vs **156** low vs **0** high — editorial assessments deliberately stay `handsOnTesting=false`, but buyers still see uniform “medium” certainty at scale.
3. **~1,000+ factory product-guide journeys** share recipe structure (setup → implementation → worth-it → plans → scorecard). Journey wiring improved; **prose differentiation did not**.
4. **Cross-job IT comparisons** (observability vs ITSM vs hosting) are covered and indexable via assessment + feature/price fallbacks — correct honesty, repetitive reading experience.
5. **Affiliate gap:** **221 / 280** products still official-CTA-only — commercial completeness lags catalogue volume.
6. **Legal shell:** site cannot launch until real entity fields are supplied.

---

## 1. Validity / readiness / quality (do not collapse)

| Level | This run |
| --- | --- |
| **Validity** | **Mostly pass.** Repository validates. **1** medium: Writesonic indexable but not published. |
| **Readiness** | **NOT_PUBLISHABLE.** `LEGAL_CONFIGURATION_INCOMPLETE` + `SITE_LAUNCH_NOT_READY`. Mesh, media, links, CORE maps otherwise ready. |
| **Quality** | **High dimensional scores, low distinctiveness confidence.** Orphans 0. Factory/template prose dominates long tail. |

---

## 2. Launch blockers (ledger)

| Issue | Severity | Action |
| --- | --- | --- |
| `LEGAL_CONFIGURATION_INCOMPLETE` | critical | Real `identity.*`, `processors.hosting`, `terms.governingLaw` — **do not invent** |
| `SITE_LAUNCH_NOT_READY` | critical | Follows legal gap |
| `writesonic: indexable but not published` | medium | Publish research + software row, or noindex until ready |

---

## 3. Official media (products)

| Signal | Count |
| --- | ---: |
| Products in media health report | 279 |
| Active official videos | 510 |
| needsReview | 0 |
| unavailable | 0 |
| missingMajorMediaCoverage | **0** |

DirectAdmin and similar remain **screenshot-only** where vendor YouTube fails verification — counted as honest coverage, not a gap.

---

## 4. Teaching visuals & Cursor social rule

### Site PNG size bar (teaching art)

| Directory | PNGs | Median | Under 80 KB | Under 900 KB | Notes |
| --- | ---: | ---: | ---: | ---: | --- |
| `public/guides/` | 3,082 | 1,479 KB | 0 | 0 | Passes teaching-visual bar |
| `public/software/` | 211 | 1,423 KB | 0 | 0 | Original diagrams |
| `public/industries/` | 76 | 1,484 KB | 0 | 0 | |
| `public/for/` | 24 | 1,472 KB | 0 | 0 | |
| `public/capabilities/` | 243 | 1,451 KB | 0 | 9 | 9 files 80–900 KB |
| `public/use-cases/` | 198 | 1,392 KB | 0 | 15 | 15 files 80–900 KB |
| `public/features/` | 72 | 1,450 KB | 0 | 1 | |
| `public/requirements/` | 42 | 1,336 KB | **10** | **12** | Small legacy icons |
| `public/vendor-ui/` | 507 | **154 KB** | 142 | 459 | **Expected** — vendor captures, not teaching art |
| `public/compare/` | — | — | — | — | **Directory absent** (no comparison hero art) |

### Social / marketing rule (`.cursor/rules/softwareglimpse-social-visuals.mdc`)

- **On-site teaching PNGs:** no affiliate-disclaimer text burned into guides/software art (size + generation pipeline).
- **Marketing copy docs:** disclaimers appear in **captions** (`docs/marketing/week-1-copy-paste.md`, templates) — correct placement.
- **Marketing PNG/Story/Reel pixels:** **not OCR-scanned** this run. Manual spot-check recommended before scheduling new weeks.

---

## 5. Content quality (dimensional CLI)

All scopes: **CQ-P0 = 0, CQ-P1 = 0, CQ-P2 = 0** — structural completeness only.

| Scope | Pages | Avg score | Weakest signal |
| --- | ---: | ---: | --- |
| reviews | 279 | 95 | Uniform P3 |
| guides | 1,354 | 93 | Ecommerce pillars + IT product packs at **90** |
| comparisons | **4,040** | **88** | **All pages score 88** — no spread |
| product-guide | 702 | 93 | Factory five-kind packs |
| best | 11 | 96 | |
| capability | 78 | 90 | |
| crm (mix) | 1,011 | 90 | |
| industry | 25 | 91 | |
| use-case | 16 | 90 | |
| requirement | 14 | 90 | |
| feature | 24 | 95 | |
| resource | 17 | 93 | |

**Interpretation:** Scores reward module presence. They **do not** prove each comparison or factory guide would survive a buyer-side blind read.

---

## 6. Comparisons — mesh, indexability, depth

### Gate status (live seed)

| Signal | Count |
| --- | ---: |
| Published pairs | 4,040 |
| Indexable | **4,040** |
| Thin (`isThinComparisonMesh`) | **0** |
| `researchStatus: in-progress` | **0** |
| Pairs with 0 criterion wins | **0** |
| “Comparable support” boilerplate in reasons | **0** |
| Outcomes `confidence: high` | **0** |
| Outcomes `confidence: medium` | 40,459 |
| Outcomes `confidence: low` | 156 |

### In-category pair mesh (indexable / primary)

| Category | Total pairs | Indexable | Noindex |
| --- | ---: | ---: | ---: |
| CRM | 666 | 666 | 0 |
| Sales intelligence | 436 | 436 | 0 |
| Business communications | 383 | 383 | 0 |
| HR | 277 | 277 | 0 |
| Email marketing | 181 | 181 | 0 |
| Marketing | 231 | 231 | 0 |
| Project management | 174 | 174 | 0 |
| Customer service | 45 | 45 | 0 |
| AI | 212 | 212 | 0 |
| IT development | 1,182 | 1,182 | 0 |
| Ecommerce | 253 | 253 | 0 |

**Morning → now:** CRM went from **223 indexable / 443 noindex** to **666 / 666**. Site-wide thin pairs **578 → 0**.

### Depth honesty

Indexability now reflects researched assessment deltas, feature availability, and published price floors — **not** flag flips. At **4,040** pairs, many pages still read as **the same comparison template** with criterion scores swapped. That is expected until high-intent pairs get bespoke editorial passes. **Do not** mass-assign `confidence: high` or invent winners to “feel” better.

---

## 7. Guides that should exist

| Check | Result |
| --- | --- |
| CORE cluster gaps (11 maps) | **0** |
| Published guides | **1,346** |
| Product-tied guides | **1,224** |
| Factory-style journeys (setup / worth-it / plans / evaluation / requirements) | **~1,003** slugs match journey patterns |
| Weakest guide scores | **90** (ecommerce category pillars; `is-squadcast-worth-it`, `squadcast-plans`) |

Authored CRM pillar guides (what-is, how-to-choose, evaluation, etc.) score **95** — the long tail of product factory packs pulls averages down slightly but stays above 90 structurally.

---

## 8. Affiliates & commercial CTAs

| Signal | Count |
| --- | ---: |
| Software rows (coverage CLI) | 280 |
| Active programmes | **58** |
| Pending | 1 |
| Without programme | **221** |
| Published with affiliate CTA | 57 |
| Published with official CTA | 222 |
| Published missing any CTA | **0** |
| `missingDestination` | **0** |
| `affiliate:validate` | **PASS** |

Commercial buttons on product pages are wired; **programme coverage** (~21%) lags catalogue breadth. Affiliate economics must never influence editorial ranking (per site rules).

---

## 9. Internal linking

From `docs/seo/03-internal-linking-report.md` (2026-08-19):

| Metric | Value |
| --- | ---: |
| Outbound edges | 26,856 |
| Orphans | 0 |
| Chrome-only inbound | 0 |
| Weak / sparse | 0 |
| Health errors | 0 |

Hub child counts: `/compare/` **4,040** · `/guides/` **1,346** · `/software/` **279** · `/alternatives/` **276** indexable listed.

Alternatives **noindex:** `pipedrive`, `writesonic` (2 shells).

---

## 10. Technical SEO

Orchestrator: **0 findings** on completed checks. **9 checks skipped** including:

- `robots-meta-live-html`, `status-codes-live`, `redirect-links`
- `live-html-jsonld`, `jsonld-syntax`
- `field-cwv`, `client-chunks` (needs production build)
- `live-html-img-scan`, `live-embed-probe`

**Not claimed:** production JS bundle budget, CrUX/field CWV, exhaustive sitemap HTTP crawl.

Sitemap entries: **6,319**.

---

## Ranked remaining work (do not auto-execute)

1. **Legal identity** — only true launch blocker. Supply real entity fields.
2. **Writesonic** — align publish state with indexability (or noindex draft).
3. **Buyer-distinctive comparisons (high-intent subset)** — HubSpot vs Pipedrive, Outreach vs Salesloft, monday vs Asana, managed-hosting peers, etc. Deepen prose + evidence; do not inflate `confidence: high` without basis.
4. **Factory product-guide prose** — ~1,000 packs share recipes. Ecommerce worth-it/plans and new IT packs are the floor (**90**).
5. **Affiliate programme expansion** — 221 products still official-only. Prioritize money categories (CRM, EM, hosting, ecommerce) without touching rank order.
6. **Teaching-visual leftovers** — 10 small PNGs in `requirements/`; 9 capability + 15 use-case files under 900 KB; optional comparison hero art.
7. **Production perf pass** — `next build` JS budget + real CWV when staging/prod URL exists.
8. **Marketing asset OCR spot-check** — confirm scheduled Story/Reel PNGs have no on-pixel affiliate disclaimers (rule compliance).
9. **Alternatives depth** — 276/278 indexable; confirm editorial readiness vs shells for low-peer products.

---

## Appendix: content-quality scope JSON

Raw CLI outputs saved during this run under `/tmp/sg-audit-2026-08-19/` (local machine, not committed): `cq-*.json`, `mesh-stats.json`, `media-health.json`, `affiliate-coverage.json`, `audit-plan.json`.

To reproduce:

```bash
npm run audit:site -- --json
npx tsx scripts/content-audit-cli.ts comparisons --json --no-write
npm run audit:media-health -- --json
npm run affiliate:coverage -- --json
npm run content:clusters:gaps -- --json
npm run seo:internal-links
npm run seo:audit -- audit --mode=full --base=http://127.0.0.1:3000
```

---

*End of audit. No content was modified. No pages were published.*
