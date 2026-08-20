# SoftwareGlimpse site-wide editorial audit

**Date:** 2026-08-18  
**Verdict:** Volume is high. Decision quality is not. Publication readiness is **NOT_PUBLISHABLE** (legal identity empty — do not invent it). Internal health **80/100** only means the issue ledger is mostly clear. It does **not** mean pages are detailed.

Your instinct is right. Most new pages exist as templates, product-guide packs, or structurally complete comparison records. They are not a full comparison mesh, the generated guide art does not meet the teaching-visual bar, and most products have an official CTA rather than an affiliate link.

This document does **not** rewrite or publish anything.

---

## Direct answers

| Question | Answer |
| --- | --- |
| Are all pages complete? | **No.** 2,544 registry pages exist; CORE teaching pages exist on all 11 knowledge maps; comparison **pairs** are missing outside CRM; 392 comparisons are unpublished (208 of those are thin). |
| Is content detailed, not missing? | **Mostly template-complete, not distinctive.** Published comparisons (911) all have verdict + ≥3 researched outcomes + scenarios + pricing. Content-quality still marks **85 unpublished** comparisons at 50/100 and **582/615** guides as CQ-P2. |
| Images / screenshots / videos present? | **Videos: 12 products missing major official coverage.** Hub teaching art meets size. **Guide PNGs do not** (median 98 KB vs ~1 MB bar). No `public/compare/` art. |
| Generated visuals follow the Cursor rule? | **Hubs yes. Guides no.** Rule: 1536×1024, typically ~1 MB+, unique, no shared placeholders. Guide library: 6,297 PNGs, median **98 KB**, 1,267 ≥900 KB. |
| Comparisons detailed? | **Published ones are structurally filled.** Dimensional quality still P2-heavy. Do not invent verdicts for the 208 thin unpublished shells. |
| Comparisons for every in-category permutation? | **CRM only (666/666).** Every other category is **5–25%**. About **2,400** in-category pairs are missing. |
| All guides that should exist, and detailed? | **CORE slugs exist** (`content:clusters:gaps` = 0 for all 11 maps). **1,076 / 1,198** published guides are product-tied packs (selection / pricing / implementation / migration / setup). Three marketing CORE guides score **60/100**. |
| All affiliate links present? | **No.** 27 active programmes / 255 products. Every published software page has a CTA (53 affiliate + 202 official). 228 without a programme. Motion missing destination. |
| Links between pages proper? | **Graph yes:** 8,597 edges, 0 orphans, 0 weak. That is wiring, not unique editorial cross-links on every thin page. |
| Technical SEO as good as possible? | **Clean on the 18 live probes** (0 findings). Not claimed: production JS budget, field CWV, full-sitemap HTTP, outbound URL live-probe (0 URLs probed). |

---

## How this audit was run

Platform CLIs + catalogue services (no invented rankings):

| Layer | Command / source | Result |
| --- | --- | --- |
| Launch ledger | `npm run audit:site -- --report --force-fresh` | **fail** · NOT_PUBLISHABLE · 32 open issues |
| Content quality | `content-audit-cli` scopes ( `all` **FAILED**) | reviews / guides / comparisons / best / industry / use-case / resource / feature / requirement |
| Live SEO | `seo:audit --mode=full` @ `http://127.0.0.1:3000` | 0 findings · 30 completed · 1 skipped |
| Official media | `npm run audit:media-health` | 255 products · 471 videos · **12 missing major** |
| Affiliates | `affiliate:coverage` + `affiliate:validate` | 27 / 255 · validate **PASS** |
| CORE guide existence | `content:clusters:gaps` × 11 maps | **0 gaps** |
| Comparison mesh | live `getComparisons` × primary-category pairs | CRM 100%; others 5–25% |
| Teaching visuals | file sizes under `public/{guides,capabilities,use-cases,industries,for,software}` | hubs pass size; guides median 98 KB |
| Category maturity | `assessCategoryMaturity` | CRM **MATURE**; other top-level cats **TOOL_READY** |

`content-audit all` and `catalogue:coverage` still crash (capability-hub Zod; processing-record enums). Capability hubs were not quality-scored.

Live SEO/HTML probes are **18 representative routes**, not 2,587 sitemap URLs.

---

## Executive snapshot

| Measure | Value |
| --- | ---: |
| Published software | 255 |
| Published comparisons | 911 (all indexable; 666 are CRM) |
| Unpublished comparisons | 392 (208 thin) |
| Published guides | 1,198 (1,076 product-tied) |
| Best pages | 11 |
| Public alternatives pages | 7 (6 indexable) |
| Site-audit status | **fail** |
| Publication readiness | **NOT_PUBLISHABLE** |
| Internal health | **80/100** |
| Open ledger issues | 32 (critical 2 · high 0 · medium 11 · low 19) |
| SEO findings (18 live routes) | 0 |
| SEO orphans | 0 |
| Sitemap URLs | 2,587 |
| Affiliate programmes | 27 / 255 |
| Official videos | 471 · **12 products missing major** |

---

## Ranked remaining work (do not auto-execute)

1. **Legal identity** — real entity fields. Do not invent them. This is the only reason status is `fail` / `NOT_PUBLISHABLE`.
2. **Legal documents** — privacy, terms, cookies (`legal-review-required`); affiliate-disclosure (`draft`).
3. **Guide teaching visuals** — regenerate `public/guides/` art to the 1536×1024 ~1 MB bar; unique per slug; no `?v=` on `next/image`.
4. **Comparison mesh outside CRM** — thousands of missing in-category pairs. Prefer researched, indexable pages for high-intent pairs; shells stay non-indexable. Do not invent verdicts.
5. **Thin unpublished comparisons (208)** — fill from research or keep non-indexable. Quality CLI scores 85 of the CRM/EM/marketing/SI set at 50/100.
6. **Marketing CORE guides at 60/100** — decision support + next-step (`how-to-choose-marketing-software`, requirements, evaluation).
7. **Official media for 12 products** — AppDynamics, Buildkite, DirectAdmin, FireHydrant, HaloITSM, Honeycomb, IPRoyal, ManageEngine ServiceDesk Plus, Rootly, SiteGround, SysAid, Zyte.
8. **Motion affiliate destination** + HubSpot pricing conflict.
9. **SI duplicate-intent guides** vs `how-to-choose-sales-intelligence`.
10. **19 software-review drafts** — editorial approval only; do not auto-publish.
11. **Repair CLIs** — `content-audit all`, `catalogue:coverage`.
12. **Affiliate programmes** — commercial backlog (228 products), not a launch blocker.

---

## 1. Validity

**High-severity catalogue validity is clear.** Launch is still blocked.

- **`LEGAL_CONFIGURATION_INCOMPLETE`** — `identity.legalEntityName`, country, contact/privacy emails, business address, registration number, `processors.hosting`, `terms.governingLaw`.
- **`SITE_LAUNCH_NOT_READY`** — follows from the legal gap.
- **`INVALID_SCHEMA` (medium)** — HubSpot `pricing.salesHub.professional.amountPerSeatMonthly` conflict. Resolve from source; do not invent an amount.

---

## 2. Readiness — are pages complete enough?

**CRM decision ecosystem: yes. Other categories: product hubs exist; comparison mesh and research depth do not.**

| Category | Products | Maturity | Best page | In-category pairs existing / expected | Coverage |
| --- | ---: | --- | --- | ---: | ---: |
| crm | 37 primary | MATURE | yes | 666 / 666 | 100% |
| sales-intelligence | 30 | TOOL_READY | yes | 41 / 435 | 9% |
| business-communications | 28 | TOOL_READY | yes | 31 / 378 | 8% |
| customer-service | 9 | TOOL_READY | yes | 9 / 36 | 25% |
| marketing | 21 | TOOL_READY | yes | 11 / 210 | 5% |
| email-marketing | 18 | (nested; map exists) | yes | 15 / 153 | 10% |
| project-management | 19 | TOOL_READY | yes | 17 / 171 | 10% |
| hr | 24 | TOOL_READY | yes | 30 / 276 | 11% |
| ai | 21 | TOOL_READY | yes | 23 / 210 | 11% |
| it-development | 39 | TOOL_READY | yes | 51 / 741 | 7% |
| ecommerce | 9 | TOOL_READY | yes | 4 / 36 | 11% |

Product maturity: **37** TIER_5 (CRM fully integrated) · **204** TIER_4 (decision ecosystem) · **14** TIER_3 (core page only).

### Ledger readiness still open

| Type | Sev | n | Detail |
| --- | --- | ---: | --- |
| `MISSING_AFFILIATE_DESTINATION` | medium | 1 | Motion |
| `OUTDATED_LEGAL_POLICY` | medium | 4 | legal docs not approved |
| `RESEARCH_GAP` | medium | 1+ | ledger still listed DirectAdmin; media-health now **12** missing videos |
| `APPROVAL_BACKLOG` | low | 19 | software-review drafts |

Approval backlog: Freshmarketer, InboxAlly, SaneBox, ZoomInfo, Dynamics 365, Salesforce, Closely, Amplemarket, RocketReach, Salesflare, Freshsales, Kartra, SocialBee, LearnWorlds, Livestorm, AWeber, Campaign Monitor, Pipedrive, GetResponse.

### Affiliates

| Category | Products | Active programme | Without | Published affiliate CTA | Official CTA |
| --- | ---: | ---: | ---: | ---: | ---: |
| crm | 40 | 6 | 34 | 6 | 34 |
| sales-intelligence | 30 | 3 | 27 | 6 | 24 |
| marketing | 45 | 7 | 38 | 15 | 30 |
| project-management | 20 | 6 | 14 | 6 | 14 |
| hr | 25 | 5 | 20 | 5 | 20 |
| ecommerce | 12 | 2 | 10 | 2 | 10 |
| business-communications | 29 | 0 | 29 | 8 | 21 |
| customer-service | 20 | 0 | 20 | 4 | 16 |
| ai | 21 | 0 | 21 | 6 | 15 |
| it-development | 41 | 0 | 41 | 3 | 38 |

Site-wide: **27 active / 255**, **228 without**, **1 missing destination (Motion)**, **0 published pages missing a CTA**. Official fallback is not “affiliate link present.”

### Alternatives

7 publicly listed alternatives pages; **6 indexable**. Catalogue shells may still exist as non-indexable list rows. Do not invent rankings to publish the rest.

---

## 3. Quality — useful, detailed, trustworthy?

**Ledger quality issues: 4 SI duplicate-intent guides.** Dimensional scores look high because expected sections exist.

| Scope | Pages | Avg | P0 | P1 | P2 | P3 | Read as |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| reviews | 106 | 92 | 0 | 0 | 2 | 104 | Strong templates; Creatio 86, Constant Contact 87 weakest |
| guides | 615 | 86 | 0 | 7 | **582** | 26 | Almost everything is “improvable,” not excellent |
| comparisons (CRM/EM/marketing/SI only, includes unpublished) | 914 | 83 | 0 | **85** | 829 | 0 | 85 at 50/100 are thin unpublished pairs |
| best | 4 scored | 91 | 0 | 0 | 0 | 4 | CRM, SI, email-marketing, marketing |
| industry hubs | 25 | 91 | 0 | 0 | 0 | 25 | Template-complete |
| use-case hubs | 16 | 90 | 0 | 0 | 0 | 16 | Template-complete |
| resources | 16 | 89 | 0 | 0 | 0 | 16 | |
| features | 24 | 95 | 0 | 0 | 0 | 24 | |
| requirements | 14 | 88 | 0 | 0 | **14** | 0 | All CQ-P2 |
| capability hubs | — | — | — | — | — | — | **CLI crash** |

Published comparison records (911, all categories): **911/911** have verdict, ≥3 complete outcomes, ≥3 fact-backed criteria, scenarios, and pricing. That is **schema completeness**, not “unique research on every pair.” The 85 score-50 pages in the quality CLI are unpublished (samples: `hubspot-vs-whatconverts`, `iterable-vs-pardot`, `getresponse-vs-leadpages`, `activecampaign-vs-freshmarketer`).

Do not invent comparison verdicts. Do not auto-index shells.

Highest-leverage leftover **published** quality:

| Route | Score | Priority | Gap |
| --- | ---: | --- | --- |
| `/guides/how-to-choose-marketing-software/` | 60 | CQ-P1 | Decision support + next-step |
| `/guides/marketing-software-requirements-guide/` | 60 | CQ-P1 | Decision support + next-step |
| `/guides/marketing-software-evaluation-guide/` | 60 | CQ-P1 | Decision support + next-step |
| `/software/creatio/` | 86 | CQ-P2 | Official docs / pricing sources + verification dates |

---

## 4. Guides — right ones, and detailed?

**Existence: yes for CORE maps. Detail: no for most of the library.**

`content:clusters:gaps` returned `{ "gaps": [] }` for: crm, email-marketing, sales-intelligence, business-communications, hr, project-management, marketing, customer-service, ai, it-development, ecommerce.

Published guide mix (1,198):

| Topic type | Count | Role |
| --- | ---: | --- |
| selection | 246 | Product pack |
| implementation | 229 | Product pack |
| pricing-education | 224 | Product pack |
| migration | 216 | Product pack |
| setup | 210 | Product pack |
| fundamental | 28 | CORE teaching |
| buying-guide | 17 | CORE-ish |
| comparison-education | 9 | |
| checklist | 8 | |
| strategy | 6 | |
| how-it-works | 3 | |
| feature-explainer / integration | 2 | |

**1,076** guides are tied to a product slug. That is why the site feels large and samey: every onboarded product gets the same pack, while category teaching pages are a thin layer on top.

Still left on CORE quality: marketing how-to-choose / requirements / evaluation at 60; four CRM journey pages still CQ-P1 at 87–91 (next-step, not missing coverage); four SI support guides duplicate `how-to-choose-sales-intelligence`.

---

## 5. Images, screenshots, videos, teaching visuals

**Official product video:** 255 products · 471 active · 0 needs-review · 0 unavailable · **12 missing major coverage** (mostly recent IT/on-call/hosting onboarding): AppDynamics, Buildkite, DirectAdmin, FireHydrant, HaloITSM, Honeycomb, IPRoyal, ManageEngine ServiceDesk Plus, Rootly, SiteGround, SysAid, Zyte.

**Teaching-visual rule** (1536×1024, typically ~1 MB+, unique, no shared placeholders, no `?v=`):

| Folder | PNGs | Median | ≥900 KB | &lt;80 KB | vs rule |
| --- | ---: | ---: | ---: | ---: | --- |
| `public/capabilities/` | 234 | 1,424 KB | 194 | 0 | Pass size |
| `public/use-cases/` | 186 | 1,331 KB | 151 | 0 | Pass size |
| `public/industries/` | 40 | 1,374 KB | 39 | 0 | Pass size |
| `public/for/` | 24 | 1,477 KB | 24 | 0 | Pass size |
| `public/guides/` | **6,297** | **98 KB** | 1,267 | 0 | **Fail size** |
| `public/compare/` | 0 | — | — | — | No comparison art |
| `public/software/` | 817 | 282 KB | 291 | 205 | Mixed (includes logos) |

Every published guide has a `heroVisual` field (1,198/1,198). The files behind most of those heroes are still ~100 KB, not hub-grade UI mockups.

Hive `6v0_sWngFSM` stays archived. Live replacements: `9CQpAi7Ctmw`, `BhJx9GdQ1-U`.

---

## 6. Internal linking

**8,597 edges · 0 orphans · 0 weak · 0 redirect hits on 18 probed pages.**

The graph was rebuilt so hubs, tools, and category children are not chrome-only. That does not make every product-guide pack a unique journey.

---

## 7. Technical SEO

**Live FULL: 0 findings** (30 completed, 1 skipped).

| Claim | Status |
| --- | --- |
| Sitemap | 2,587 URLs |
| Canonical / URL consistency | no findings |
| Robots / HTTP on 18 routes | no findings |
| JSON-LD on 18 routes | 49 blocks parsed, 0 findings |
| Image alt on 18 routes | 614 `<img>`, 0 findings |
| Outbound validator | 0 issues; **0 URLs live-probed** |
| Production JS budget | **skipped** (`client-chunks` / turbopack) |
| Field CWV | **not measured** |
| Full-sitemap crawl | **not done** |

Technical SEO is as good as the sampled live probes show. It is not “as good as possible” until production build budgets and field CWV exist.

---

## 8. What “complete” would mean

1. Real legal identity + approved legal docs.
2. Guide PNGs at the teaching-visual bar (or fewer, unique, hub-grade assets — not 6k near-placeholder files).
3. In-category comparison coverage for categories you actually want to rank — researched pages, not 2,400 empty permutations.
4. Thin unpublished comparisons either researched or explicitly non-indexable.
5. Marketing CORE guides (and any other CORE page scoring &lt;80) reach decision-support quality.
6. Official media on the 12 products with none.
7. Motion destination + HubSpot pricing conflict closed.
8. SI duplicate canonicals decided.
9. Editorial approval of the 19 drafts.
10. `content-audit all` and `catalogue:coverage` green.
11. Production `next build` JS budget + real CWV.

Affiliate programmes on 228 products remain a commercial backlog.

---

## Tooling that could not finish

| CLI | Result | Why |
| --- | --- | --- |
| `npx tsx scripts/content-audit-cli.ts all` | FAILED | Capability hub `priorities` are strings; `scenarios[0].bestWhen` missing |
| `npx tsx scripts/content-audit-cli.ts capability` | FAILED | Same |
| `npx tsx scripts/content-audit-cli.ts crm` | FAILED | Same (loads hubs) |
| `npm run catalogue:coverage` | FAILED | Processing-record enum fields |

Content-quality `comparisons` scope only evaluates CRM, email-marketing, marketing, and sales-intelligence — including unpublished. BC / HR / PM / AI / IT / ecommerce pairs are in the mesh table above, not in that CLI.

---

## Appendix — artifacts

| Artifact | Path |
| --- | --- |
| This report | `docs/reports/site-wide-editorial-audit-2026-08-18.md` |
| Site ledger | `reports/audits/2026-08-18-site-site.md` |
| Issue ledger | `src/data/audit/state/issues.json` |
| SEO health | `docs/seo/reports/SEO-HEALTH-LATEST.md` |
| Teaching-visual rule | `.cursor/rules/softwareglimpse-teaching-visuals.mdc` |
