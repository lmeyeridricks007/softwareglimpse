# SoftwareGlimpse site-wide editorial audit

**Date:** 2026-08-19 (morning)  
**Verdict:** Completeness is high. Distinctiveness is still not. Publication readiness is **NOT_PUBLISHABLE** (legal identity empty — do not invent it). Internal health **85/100** only means the issue ledger is almost empty. It does **not** mean a buyer would trust 3,462 indexable comparison pages or 1,175 factory product-guide packs as unique research.

Your instinct is right. Since the 18 Aug night snapshot the catalogue closed several *existence* gaps (guide heroes at the teaching-visual size bar, comparable-support boilerplate, knowledge-area fan-out on product packs). What remains is template-complete output: comparison outcomes with `low`/`medium` confidence and **0** `high`, product-guide packs that score ~84 because expected sections exist, and 250 products without an affiliate programme. Dimensional quality scores look high because modules exist.

This document does **not** rewrite or publish anything.

---

## Direct answers

| Question | Answer |
| --- | --- |
| Are all pages complete? | **No.** Ledger **6,016** published / **5,435** indexable. Legal identity empty. Fastmail and SaneBox stay **TIER_3** (no two-substitute alternatives page). `catalogue:coverage` still crashes. |
| Is content detailed, not missing? | **Structurally filled, not distinctive.** Reviews avg **94**. Guides avg **85** (product-guides **84**; 1,235/1,354 CQ-P2). Comparison sample (n=200) avg **87**, all CQ-P3 because criterion modules exist. **0** comparison outcomes use “comparable support.” **0** outcomes are `confidence: high`. |
| Images / screenshots / videos present? | **Official media: 279 products, 510 active videos, 0 missing major coverage.** DirectAdmin remains screenshot-only (honest). Guide heroes: **1,346/1,346** on disk, unique srcs, no `?v=`, median **1,480 KB**, **all ≥900 KB**. No `public/compare/` art. |
| Generated visuals follow the Cursor rule? | **Guides and original software diagrams: yes (size bar).** Rule: 1536×1024, typically ~1 MB+, unique, no shared placeholders, no `?v=`. `public/guides/` **3,082** PNGs, median **1,479 KB**, 0 &lt;80 KB. Leftovers: `requirements/` 10 PNGs &lt;80 KB; `capabilities/` 9 and `use-cases/` 15 under 900 KB; `vendor-ui/` is captures (median 154 KB), not teaching art. |
| Comparisons detailed? | **Mesh exists. Distinctive research does not, at this volume.** 4,040 published pairs; **3,462** indexable + research-complete; **578** `in-progress` / noindex (thin mesh). All 4,040 `editorialStatus: approved`. Quality sample **87**. Do not invent verdicts to “finish” the 578. |
| Comparisons for every in-category permutation? | **Yes.** Top-level primary categories **3,811 / 3,811**. Email-marketing (nested under marketing) **153 / 153**. **3,964 / 3,964** expected pairs (100%). Cross-category pairs are out of that mesh. |
| All guides that should exist, and detailed? | **CORE maps: yes** (`content:clusters:gaps` = 0 × 11). **1,346** published guides (**1,224** product-tied, **1,175** factory packs). Weakest CQ pages are ecommerce worth-it/plans packs at **81** (still CQ-P2). No CQ-P0/P1 guides this run. |
| All affiliate links present? | **No.** 28 active programmes / 279 products. Every published software page has a CTA (**54** affiliate + **225** official, **0** missing). **250** without a programme. Motion programme **PENDING**. Validate **PASS**. `missingDestination` **0**. |
| Links between pages proper? | **Graph healthy:** 26,116 edges, 0 orphans, 0 weak, 0 health errors. Product-guide packs now have kind-directed next steps (setup → that product’s implementation, not a shared pillar dump). `/guides/how-to-choose-crm/` supporting children **37** (was 337 factory packs). `/compare/` hub lists **3,462** indexable children. `/alternatives/` lists **276** indexable (only `pipedrive` noindex). |
| Technical SEO as good as possible? | **Clean on 19 live probes** (0 findings, sitemap **5,741**). Not claimed: production JS budget (`client-chunks` skipped), field CWV (19/19 local TTFB over warn, suppressed), full-sitemap HTTP crawl. |

---

## How this audit was run

Platform CLIs + catalogue services (no invented rankings, YouTube IDs, or legal-entity facts):

| Layer | Command / source | Result |
| --- | --- | --- |
| Launch ledger | `npm run audit:site -- --report --force-fresh` | **fail** · NOT_PUBLISHABLE · health **85/100** · 2 open issues (both legal) |
| Remediation plan | `audit:plan` (from ledger) | 2 × `MANUAL_REVIEW` legal identity |
| Content quality | `content-audit-cli --no-write` | reviews, guides, comparisons (n=200), best, industry, use-case, resource, feature, requirement, crm, **capability** |
| Live SEO | `seo:audit --mode=full` @ `http://127.0.0.1:3000` | 0 findings · 31 completed · 1 skipped |
| Internal linking | `npm run seo:internal-links` | 26,116 edges · 0 orphans · 0 weak |
| Official media | `npm run audit:media-health` | 279 · 510 videos · **0 missing major** |
| Affiliates | `affiliate:coverage` + `affiliate:validate` | 28 / 279 · validate **PASS** · Motion pending |
| CORE guide existence | `content:clusters:gaps --json` (11 maps) | **0 gaps** |
| Comparison mesh | live `getComparisons` × primary-category pairs | **100%** including nested email-marketing |
| Teaching visuals | file sizes under `public/{guides,software,vendor-ui,capabilities,use-cases,industries,for,features,requirements,compare}` | guides/software/hubs pass size; leftovers listed below |
| Category maturity | `listCategoryMaturities` | CRM **MATURE**; other primary cats **TOOL_READY** |
| Catalogue coverage | `npm run catalogue:coverage` | **FAILED** (processing-record enum mismatch) |

`content-audit capability` **ran this time** (78 hubs, avg 90). `content-audit all` was not required; scopes were run separately.

Live SEO/HTML probes are **19 representative routes**, not 5,741 sitemap URLs.

Previous snapshots: `docs/reports/site-wide-editorial-audit-2026-08-18-night.md` (and morning/evening same day).

---

## Executive snapshot

| Measure | Value |
| --- | ---: |
| Published software | 279 |
| Product maturity | 37 TIER_5 · 240 TIER_4 · **2 TIER_3** (Fastmail, SaneBox) |
| Published comparisons | **4,040** (all approved) |
| Indexable + research-complete comparisons | **3,462** |
| Thin mesh (`in-progress` / noindex) | **578** |
| In-category pair coverage | **100%** (3,964 / 3,964) |
| Published guides | 1,346 (1,224 product-tied · 1,175 factory packs) |
| Best pages | 11 (all indexable) |
| Alternatives pages | 277 (276 indexable · 1 noindex: pipedrive) |
| Site-audit status | **fail** |
| Publication readiness | **NOT_PUBLISHABLE** |
| Internal health | **85/100** |
| Open ledger issues | 2 (critical 2 · high 0 · medium 0 · low 0) |
| SEO findings (19 live routes) | 0 |
| SEO orphans | 0 |
| Sitemap URLs | 5,741 |
| Registry published / indexable | 6,016 / 5,435 |
| Affiliate programmes | 28 active / 1 pending / 250 none |
| Official videos | 510 · **0 missing major** |

Versus 18 Aug night: comparable-support boilerplate **7,183 → 0**; guide-hero 404s **205 → 0**; guide PNG median **97 KB → 1,479 KB**; how-to-choose-crm supporting children **337 → 37**; indexable comparisons **4,041 → 3,462** (thin pairs noindexed, not deleted). Distinctiveness of the remaining indexable mesh did not jump — quality CLI still scores modules, not buyer trust.

---

## Ranked remaining work (do not auto-execute)

1. **Legal identity** — real entity fields. Do not invent them. This is the only reason status is `fail` / `NOT_PUBLISHABLE`.
2. **Comparison pages a buyer can use** — keep the 578 noindex until distinctive research exists. Prefer high-intent pairs. Do not invent verdicts or inflate `confidence: high`.
3. **Factory product-guide prose** — packs are a unique *journey* now; they are still template *copy*. Ecommerce worth-it/plans at 81 are the floor.
4. **Affiliate programmes** — 250 products remain official-CTA only. Motion stays PENDING. Do not rank lists by who pays.
5. **Teaching-visual leftovers** — `requirements/` small PNGs; a handful of capability/use-case files under 900 KB; no comparison art (optional).
6. **Fastmail / SaneBox** — second honest catalogue peer or stay without a two-item alternatives page.
7. **`catalogue:coverage`** — processing-record enum mismatch (same class of failure as 18 Aug).
8. **Production `next build` JS budget + real CWV** — local TTFB on 19 routes is not CrUX.
9. **Alternatives indexability** — 276/277 pages are indexable (night snapshot said 6). Confirm those are editorially ready, not shells that should stay noindex. Do not invent substitute lists.

---

## 1. Validity / readiness / quality (do not collapse)

| Level | This run |
| --- | --- |
| **Validity** | Catalogue parses. Enrichment media governance: 0 needs-review, 0 unavailable. Affiliate validate PASS. Comparison schema filled. Legal identity **empty**. |
| **Readiness** | **NOT_PUBLISHABLE** solely from `LEGAL_CONFIGURATION_INCOMPLETE` → `SITE_LAUNCH_NOT_READY`. Core maps exist. Thin comparisons are honestly noindex. |
| **Quality** | Dimensional scores 84–97 because expected sections exist. **0** high-confidence comparison outcomes. Product-guide average **84**. |

Open ledger (2):

1. `LEGAL_CONFIGURATION_INCOMPLETE` — `identity.legalEntityName`, `identity.country`, `identity.contactEmail`, `identity.privacyEmail`, `identity.businessAddress`, `identity.registrationNumber`, `processors.hosting`, `terms.governingLaw`
2. `SITE_LAUNCH_NOT_READY` — depends on (1)

Night’s 11 medium ledger items are no longer open. That is a ledger change, not a claim that every former issue is editorially done.

---

## 2. Pages complete?

**Registry:** 6,016 published · 5,435 indexable · sitemap 5,741. The indexable drop vs 18 Aug (~5,744) is mostly the 578 thin comparison pairs marked `researchStatus: in-progress` + `seo.indexable: false`.

**Software:** 279 published. Maturity 37 / 240 / 2 (TIER_5 / 4 / 3). Fastmail and SaneBox remain TIER_3.

**Best pages:** 11/11 indexable. CQ avg **96** (CRM, SI, HR, ecommerce, AI, IT, CS at 97; marketing weakest at 94).

**Category maturity:** CRM **MATURE** (cluster 100). Other primary categories **TOOL_READY** (cluster 100). Email-marketing is nested under marketing (`parentSlug: marketing`) and has its own CORE map + 153/153 pair mesh.

**Still not “every page a buyer needs”:** 578 comparison URLs exist but are noindex; alternatives depth was not quality-scored this run; factory packs share recipe structure.

---

## 3. Content detailed?

Content-quality CLI (sections/evidence/linking dimensions — **not** a human editorial grade):

| Scope | Pages | Avg | P0 | P1 | P2 | P3 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Reviews | 279 | 94 | 0 | 0 | 16 | 263 |
| Guides | 1,354 | 85 | 0 | 0 | 1,235 | 119 |
| Comparisons (sample) | 200 | 87 | 0 | 0 | 0 | 200 |
| Best | 11 | 96 | 0 | 0 | 0 | 11 |
| Industry | 25 | 91 | 0 | 0 | 0 | 25 |
| Use-case | 16 | 90 | 0 | 0 | 0 | 16 |
| Resource | 17 | 89 | 0 | 0 | 1 | 16 |
| Feature | 24 | 95 | 0 | 0 | 0 | 24 |
| Requirement | 14 | 90 | 0 | 0 | 0 | 14 |
| Capability | 78 | 90 | 0 | 0 | 0 | 78 |
| CRM mix | 1,011 | 88 | 0 | 0 | 227 | 784 |

Guide type averages: article **91** · implementation-guide **91** · guide **85** · **product-guide 84**.

Weakest guides this run are ecommerce factory packs (`is-tiendanube-worth-it`, `tiendanube-plans`, Medusa/Saleor/VTEX/OpenCart/Lightspeed/Webflow/Printify/Printful/Shopware) at **81**. Night’s customer-service worth-it/what-is CQ-P1 (60–65) did not reappear as P1.

Reviews: 16 CQ-P2 share “link official documentation / pricing sources and record verification dates.” Floor **89** (Honeycomb, incident.io, ScraperAPI, Constant Contact).

Resource floor: `/resources/crm-uat-test-script/` **84** (the only resource CQ-P2).

**Capability hubs scored this run** (night CLI crashed). All 78 at **90**.

Treat 87–94 as “the template is present,” not “a practitioner would cite this.”

---

## 4. Images, screenshots, videos

**Official product media** (`audit:media-health`): 279 products · 510 active videos · 0 needs-review · 0 unavailable · **0 missing major coverage**. Coverage bar = active official video/webinar/tutorial **or** a first-party vendor-ui screenshot on disk. DirectAdmin with no vendor YouTube tour is still honest if a control-panel still exists.

**Guide heroes:** 1,346/1,346 files exist. Unique srcs. No `?v=` query strings. Median **1,480 KB**. **1,346 ≥900 KB**. Night’s 205 `*-cover-v3.png` 404s are gone.

**Teaching-visual library (PNG counts / median / ≥900 KB / &lt;80 KB):**

| Folder | Count | Median KB | ≥900 KB | &lt;80 KB |
| --- | ---: | ---: | ---: | ---: |
| `guides/` | 3,082 | 1,479 | 3,082 | 0 |
| `software/` (original diagrams) | 211 | 1,423 | 211 | 0 |
| `vendor-ui/` (captures, not teaching art) | 507 | 154 | 48 | 138 |
| `capabilities/` | 243 | 1,451 | 234 | 0 |
| `use-cases/` | 198 | 1,392 | 183 | 0 |
| `industries/` | 76 | 1,486 | 76 | 0 |
| `for/` | 24 | 1,477 | 24 | 0 |
| `features/` | 72 | 1,451 | 71 | 0 |
| `requirements/` | 42 | 1,339 | 30 | **10** |
| `compare/` | 0 | — | — | — |

Live media SEO (19 pages): 624 `<img>`; 29 YouTube posters oEmbed-live.

---

## 5. Generated visuals vs Cursor rule

Rule (`.cursor/rules/softwareglimpse-teaching-visuals.mdc`): high-fidelity UI mockups, 1536×1024, typically ~1 MB+, unique per slug, no vendor logos, no `?v=` on `next/image`.

| Check | Result |
| --- | --- |
| Guide heroes unique | **Yes** (1,346 srcs / 1,346 pages) |
| Guide size bar | **Yes** (median 1,480 KB, 0 under 900 KB) |
| Query-string cache-bust | **None** |
| Shared placeholder reuse | Not detected on heroes |
| Hub teaching art | Mostly yes; 9 capability + 15 use-case files still under 900 KB |
| Requirements small leftovers | **10** &lt;80 KB |
| Comparison teaching art | **None** (no `public/compare/` PNGs) |
| Vendor-ui captures | Out of the teaching-visual bar by design (median 154 KB) |

---

## 6. Comparisons — detailed, and all permutations?

**Permutations in primary category: yes. Distinctive research: no, not at this volume.**

4,040 published comparison records, all `editorialStatus: approved`. **3,462** `researchStatus: complete` + indexable. **578** `in-progress` / noindex (thin mesh: &lt;2 criterion winners or majority `confidence: low` — from the 18 Aug mesh gate, not invented this morning).

| Signal | Count |
| --- | ---: |
| Outcome reasons matching “comparable support” | **0** / 37,741 |
| Pairs where ≥50% of outcomes are that boilerplate | **0** |
| Outcomes with `confidence: low` | 3,386 |
| Outcomes with `confidence: medium` | 34,355 |
| Outcomes with `confidence: high` | **0** |
| Quality CLI sample (200 pages) | avg **87**, all CQ-P3 |

### In-category pair mesh (primary products)

| Category | Products | Expected | Existing | Coverage | Indexable | Noindex / in-progress |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| CRM | 37 | 666 | 666 | 100% | 223 | 443 |
| Sales intelligence | 30 | 435 | 435 | 100% | 425 | 10 |
| Business communications | 28 | 378 | 378 | 100% | 361 | 17 |
| Customer service | 9 | 36 | 36 | 100% | 35 | 1 |
| Marketing | 21 | 210 | 210 | 100% | 209 | 1 |
| Email marketing (nested) | 18 | 153 | 153 | 100% | 145 | 8 |
| Project management | 19 | 171 | 171 | 100% | 163 | 8 |
| HR | 24 | 276 | 276 | 100% | 270 | 6 |
| AI | 21 | 210 | 210 | 100% | 209 | 1 |
| IT development | 49 | 1,176 | 1,176 | 100% | 1,123 | 53 |
| Ecommerce | 23 | 253 | 253 | 100% | 251 | 2 |
| **Total** | | **3,964** | **3,964** | **100%** | | |

CRM is the honest extreme: every pair *exists*, but **443 / 666** stay noindex rather than pretending they are researched.

Do not invent comparison verdicts. Treat distinctive rewrite as editorial work, not a mesh-coverage task.

---

## 7. Guides that should exist

**CORE NEW_PAGE gaps:** 0 on all 11 knowledge maps (CRM, email-marketing, sales-intelligence, business-communications, HR, project-management, marketing, customer-service, AI, IT-development, ecommerce).

**Published guides:** 1,346. Product-tied 1,224. Factory five-kind packs 1,175.

**Journey (factory packs, after 18 Aug wiring fix):**

- Each **setup** pack has a unique related-slug set (234/234) and a unique next action (that product’s implementation guide).
- 1,175 distinct related-slug signatures across packs (not “all siblings + the same pillars”).
- Next-action signatures 1,070 — worth-it CRM/SI packs share the category Finder by design.
- `/guides/how-to-choose-crm/` supporting children **37** educational guides, not hundreds of factory pages.

Existence ≠ depth. Product-guide CQ average **84**. Strongest guides remain hand-authored CRM educational pages at **95**.

---

## 8. Affiliate links

| Metric | Count |
| --- | ---: |
| Published software | 279 |
| Active programmes | 28 |
| Pending | 1 (Motion) |
| Without programme | 250 |
| Missing destination (active programme, no dest) | **0** |
| Published with affiliate CTA | 54 |
| Published with official CTA | 225 |
| Published missing CTA | **0** |
| Active promotions | 0 |
| Validate | **PASS** |

Commercial backlog is programmes, not broken `/go/` links. Do not use affiliate availability to rank Finder or comparison lists.

---

## 9. Internal linking

**26,116 edges · 0 orphans · 0 weak · 0 health errors · 0 redirect hits on 19 probed pages.**

Hub child-edge counts (graph, not unique prose links): `/software/` 279 · `/guides/` 1,346 · `/compare/` **3,462** (indexable only) · `/categories/crm/` 156 · `/alternatives/` **276** · `/best/` 11.

Product-guide packs are no longer a shared knowledge-area mesh. They still share *recipe* body copy. Wiring ≠ distinctive teaching.

Live internal-link SEO agent: 0 findings.

---

## 10. Technical SEO

**Live FULL: 0 findings** (31 completed, 1 skipped). Do **not** claim clean SEO while `client-chunks` is skipped.

| Claim | Status |
| --- | --- |
| Sitemap | 5,741 URLs |
| Canonical / URL consistency | no findings |
| Robots / HTTP on 19 routes | no findings |
| JSON-LD on 19 routes | 53 blocks parsed, 0 findings |
| Image alt on 19 routes | 624 `<img>`, 0 findings |
| YouTube posters | 29 oEmbed-live |
| Outbound validator | 0 issues; **21 URLs live-probed**, 0 failing |
| Affiliate `rel` | `sponsored` + `noopener` + `noreferrer` |
| Production JS budget | **skipped** (`client-chunks` / turbopack) |
| Field CWV | collector wired (consent-gated); **not CrUX**; local TTFB **19/19** over warn, findings suppressed |
| Full-sitemap crawl | **not done** |
| CRM content map | 207 rows; roadmap MISSING omitted from production findings |

---

## 11. What “complete” would mean

1. Real legal identity + approved legal docs.
2. Indexable comparison pages a buyer can use — not 3,462 schema-valid pairs with zero `high` confidence. Keep 578 noindex until research exists. Do not invent verdicts.
3. Factory product-guide packs reach decision-support quality (especially ecommerce worth-it/plans at 81), not only unique next-step wiring.
4. Affiliate programmes (or an explicit “official site only” policy) for the 250 without one; Motion pending resolved without inventing PartnerStack URLs.
5. Fastmail/SaneBox either get a second honest catalogue peer or stay without a two-item alternatives page.
6. Requirements (and remaining hub) PNGs at the teaching-visual bar.
7. Alternatives indexability reviewed (276 vs the 18 Aug “6 indexable shells” snapshot).
8. `catalogue:coverage` green.
9. Production `next build` JS budget + real CWV.

Official media coverage is no longer the main gap. DirectAdmin without a vendor YouTube tour remains honest.

---

## Tooling that could not finish

| CLI | Result | Why |
| --- | --- | --- |
| `npm run catalogue:coverage` | FAILED | Processing-record `bucket` / `exclusionReason` / related enum mismatch |
| `content-audit-cli all` | not run | Scopes executed separately; capability no longer crashes |
| Full-sitemap HTTP crawl | not done | SEO agent probes 19 routes |
| Production JS budget | skipped | Dev turbopack |

Comparisons quality CLI was sampled at **200** pages. Structural stats above cover all **4,040** published pairs.

---

## Appendix — artifacts

| Artifact | Path |
| --- | --- |
| This report | `docs/reports/site-wide-editorial-audit-2026-08-19.md` |
| Prior snapshots | `docs/reports/site-wide-editorial-audit-2026-08-18.md`, `…-evening.md`, `…-night.md` |
| Site ledger | `reports/audits/2026-08-19-site-site.md` |
| Issue ledger | `src/data/audit/state/issues.json` |
| SEO health | `docs/seo/reports/SEO-HEALTH-LATEST.md` |
| Internal linking | `docs/seo/03-internal-linking-report.md` |
| Teaching-visual rule | `.cursor/rules/softwareglimpse-teaching-visuals.mdc` |
