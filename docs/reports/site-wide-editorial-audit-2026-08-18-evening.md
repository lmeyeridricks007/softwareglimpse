# SoftwareGlimpse site-wide editorial audit

**Date:** 2026-08-18 (evening)  
**Verdict:** Volume is now huge. Decision quality is still not. Publication readiness is **NOT_PUBLISHABLE** (legal identity empty — do not invent it). Internal health **82/100** only means the issue ledger is mostly clear. It does **not** mean pages are distinctive.

Your instinct is right. Since the morning snapshot the catalogue filled the in-category comparison mesh (4,041 published pairs) and alternatives shells (277 pages). Most of that is structurally complete template output: comparison outcomes with low/medium confidence and “comparable support” language, product-guide packs, and guide heroes that miss the teaching-visual bar. Dimensional quality scores look high because expected sections exist.

This document does **not** rewrite or publish anything.

---

## Direct answers

| Question | Answer |
| --- | --- |
| Are all pages complete? | **No.** Registry **5,747** published pages / **5,744** indexable. Legal identity empty. 7 CRM-map roadmap tools still missing. Capability-hub quality CLI still crashes. Fastmail and SaneBox have no alternatives page. |
| Is content detailed, not missing? | **Mostly template-complete, not distinctive.** 4,041/4,041 comparisons pass the schema quality gate (verdict + ≥3 researched outcomes). **506** pairs are ≥50% “comparable support” boilerplate. **1,256 / 1,354** scored guides are CQ-P2. |
| Images / screenshots / videos present? | **Official video: 279 products, 510 active, 0 missing major coverage.** Teaching hubs pass size. Guide library does not (median **97 KB** vs ~1 MB bar). **205** live-wired guide heroes point at missing `-cover-v3.png` files. No `public/compare/` art. |
| Generated visuals follow the Cursor rule? | **Hubs yes. Guides no.** Rule: 1536×1024, typically ~1 MB+, unique, no shared placeholders, no `?v=`. Guide PNGs: 6,625 files, median **97 KB**, 1,329 ≥900 KB. Live-wired heroes: median **110 KB**; 487/1,141 ≥900 KB. Unique srcs (0 shared). |
| Comparisons detailed? | **Structurally filled, not editorially distinctive.** All 4,041 are `approved` + `research complete` + indexable. 7,183 outcomes use “comparable support”; 3,386 outcomes are `low` confidence. A 120-page quality sample scores **88** (CQ-P3) because modules exist. |
| Comparisons for every in-category permutation? | **Yes, for every primary category.** 3,964 expected pairs exist (100%). Cross-category pairs are out of scope of that mesh. |
| All guides that should exist, and detailed? | **CORE maps: yes** (`content:clusters:gaps` = 0 for all 11). **1,224 / 1,346** guides are product-tied. Nine CQ-P1 pages (customer-service worth-it / what-is at 60–65). |
| All affiliate links present? | **No.** 28 active programmes / 279 products. Every published software page has a CTA (54 affiliate + 225 official). 251 without a programme. Motion missing destination. |
| Links between pages proper? | **Graph yes:** 32,253 edges, 0 orphans, 0 weak. Alternatives hub only lists **6** indexable children (271 noindex shells). Wiring ≠ unique editorial cross-links. |
| Technical SEO as good as possible? | **Clean on 19 live probes** (0 findings, sitemap 6,047). Not claimed: production JS budget (`client-chunks` skipped), field CWV (collector wired, not CrUX), full-sitemap HTTP crawl. |

---

## How this audit was run

Platform CLIs + catalogue services (no invented rankings or legal-entity facts):

| Layer | Command / source | Result |
| --- | --- | --- |
| Launch ledger | `npm run audit:site -- --report --force-fresh` | **fail** · NOT_PUBLISHABLE · health **82/100** · 13 open issues |
| Remediation plan | `npm run audit:plan -- --json` | Empty JSON array; ranked sequence is in the Markdown report |
| Content quality | `content-audit-cli` scopes with `--no-write` | reviews / guides / comparisons (n=120) / best / industry / use-case / resource / feature / requirement / crm |
| Live SEO | `seo:audit --mode=full` @ `http://127.0.0.1:3000` | 0 findings · 31 completed · 1 skipped |
| Internal linking | `npm run seo:internal-links` | 32,253 edges · 0 orphans |
| Official media | `npm run audit:media-health` | 279 products · 510 videos · **0 missing major** |
| Affiliates | `affiliate:coverage` + `affiliate:validate` | 28 / 279 · validate **PASS** · 1 missing destination |
| CORE guide existence | `content:clusters:gaps --json` (11 maps) | **0 gaps** |
| Comparison mesh | live `getComparisons` × primary-category pairs | **100%** every top-level primary category |
| Teaching visuals | file sizes under `public/{guides,capabilities,use-cases,industries,for,software,features,requirements,compare}` | hubs pass size; guides fail |
| Category maturity | `assessCategoryMaturity` | CRM **MATURE**; all other primary cats **TOOL_READY** |

`content-audit capability` / `all` and `catalogue:coverage` still crash (capability-hub Zod; processing-record `maturityTier` enum). Capability hubs were not quality-scored.

Live SEO/HTML probes are **19 representative routes**, not 6,047 sitemap URLs.

---

## Executive snapshot

| Measure | Value |
| --- | ---: |
| Published software | 279 |
| Product maturity | 37 TIER_5 · 240 TIER_4 · **2 TIER_3** (Fastmail, SaneBox) |
| Published comparisons | **4,041** (all indexable, all approved) |
| In-category pair coverage | **100%** (3,964 / 3,964) |
| Published guides | 1,346 (1,224 product-tied) |
| Best pages | 11 |
| Alternatives pages | 277 (6 indexable, 270 noindex shells) |
| Site-audit status | **fail** |
| Publication readiness | **NOT_PUBLISHABLE** |
| Internal health | **82/100** |
| Open ledger issues | 13 (critical 2 · high 0 · medium 11 · low 0) |
| SEO findings (19 live routes) | 0 |
| SEO orphans | 0 |
| Sitemap URLs | 6,047 |
| Registry published / indexable | 5,747 / 5,744 |
| Affiliate programmes | 28 / 279 |
| Official videos | 510 · **0 missing major** |

Morning snapshot (same day, earlier): 255 products, 911 published comparisons, ~5–25% non-CRM mesh, 12 missing official videos, 7 alternatives pages. Volume moved. Distinctiveness did not.

---

## Ranked remaining work (do not auto-execute)

1. **Legal identity** — real entity fields. Do not invent them. This is the only reason status is `fail` / `NOT_PUBLISHABLE`.
2. **Legal documents** — privacy, terms, cookies (`legal-review-required`); affiliate-disclosure (`draft`).
3. **Guide teaching visuals** — 6,625 PNGs at median 97 KB; 205 live `-cover-v3.png` paths 404. Unique 1536×1024 ~1 MB art, or fewer hub-grade assets. No `?v=` on `next/image`.
4. **Comparison distinctiveness** — mesh existence is done. 506 pairs are majority “comparable support”; 3,386 low-confidence outcomes. Do not invent verdicts to “improve” them.
5. **Customer-service CORE/product guides at 60** — `is-{tidio,gorgias,help-scout,zendesk-suite,freshdesk}-worth-it` plus matching `what-is-*` (CQ-P1).
6. **Best pages for new categories** — `/best/it-development-software/` and `/best/ai-software/` **58**; ecommerce **63**.
7. **Motion affiliate destination** + HubSpot `pricing.salesHub.professional.amountPerSeatMonthly` conflict.
8. **SI duplicate-intent guides** vs `how-to-choose-sales-intelligence` (4 still open).
9. **fly-io** unsupported superlative (“cheapest”) in the short description.
10. **Fastmail / SaneBox alternatives** — catalogue has no second honest email peer; do not list Slack/Zoom as substitutes.
11. **Repair CLIs** — `content-audit capability` / `all`, `catalogue:coverage`.
12. **Affiliate programmes** — commercial backlog (251 products), not a launch blocker.
13. **Production `next build` JS budget + real CWV** — not measurable on `next dev`.

---

## 1. Validity

**High-severity catalogue validity is clear.** Launch is still blocked.

| Type | Sev | Detail |
| --- | --- | --- |
| `LEGAL_CONFIGURATION_INCOMPLETE` | critical | `identity.legalEntityName`, country, contact/privacy emails, business address, registration number, `processors.hosting`, `terms.governingLaw` |
| `SITE_LAUNCH_NOT_READY` | critical | Follows from the legal gap |
| `INVALID_SCHEMA` | medium | HubSpot `pricing.salesHub.professional.amountPerSeatMonthly` open conflict. Resolve from source; do not invent an amount |

Do not invent legal-entity facts to clear the launch gate.

---

## 2. Readiness — are pages complete enough?

**CRM decision ecosystem: yes (MATURE).** Other categories: product hubs + a full comparison **record** mesh; research depth and best-page quality do not match CRM.

| Category | Primary products | Maturity | Best page score | In-category pairs | Coverage |
| --- | ---: | --- | ---: | ---: | ---: |
| crm | 37 | MATURE | 91 | 666 / 666 | 100% |
| sales-intelligence | 30 | TOOL_READY | 91 | 435 / 435 | 100% |
| business-communications | 28 | TOOL_READY | 91 | 378 / 378 | 100% |
| hr | 24 | TOOL_READY | 78 | 276 / 276 | 100% |
| ecommerce | 23 | TOOL_READY | 63 | 253 / 253 | 100% |
| marketing | 21 | TOOL_READY | 91 | 210 / 210 | 100% |
| ai | 21 | TOOL_READY | **58** | 210 / 210 | 100% |
| project-management | 19 | TOOL_READY | 91 | 171 / 171 | 100% |
| email-marketing | 18 | TOOL_READY | 91 | 153 / 153 | 100% |
| customer-service | 9 | TOOL_READY | 78 | 36 / 36 | 100% |
| it-development | 49 | TOOL_READY | **58** | 1,176 / 1,176 | 100% |

`getSoftwareByCategory` counts are slightly higher than primary-only (CRM 40, IT 51, marketing 45) because of secondary-category membership. Mesh math above is **primary category only**.

Product maturity: **37** TIER_5 (CRM fully integrated) · **240** TIER_4 · **2** TIER_3 (Fastmail, SaneBox — no 2-substitute alternatives page).

### Ledger readiness still open

| Type | Sev | n | Detail |
| --- | ---: | ---: | --- |
| `MISSING_AFFILIATE_DESTINATION` | medium | 1 | Motion |
| `OUTDATED_LEGAL_POLICY` | medium | 4 | privacy, terms, cookies not approved; affiliate-disclosure `draft` |
| `SUPPORT_CONTENT_DUPLICATE` | medium | 4 | SI vendor-evaluation / demo / RFP / business-case vs `how-to-choose-sales-intelligence` |
| `UNSUPPORTED_SUPERLATIVE` | medium | 1 | fly-io description |

Approval-backlog issues from the morning ledger are **gone** (not re-detected). That is not the same as “all drafts published.”

### Affiliates

Site-wide: **28 active programmes / 279 products**, **251 without**, **1 missing destination (Motion)**, **0 published pages missing a CTA**. Validate **PASS**. Official fallback is not “affiliate link present.”

| Category | Products (coverage CLI) | Active programme | Without | Affiliate CTA | Official CTA |
| --- | ---: | ---: | ---: | ---: | ---: |
| crm | 40 | 6 | 34 | 6 | 34 |
| sales-intelligence | 30 | 3 | 27 | 6 | 24 |
| marketing | 45 | 8 | 37 | 16 | 29 |
| email-marketing | 23 | 3 | 20 | 7 | 16 |
| project-management | 20 | 6 | 14 | 6 | 14 |
| hr | 25 | 5 | 20 | 5 | 20 |
| ecommerce | 26 | 2 | 24 | 2 | 24 |
| business-communications | 29 | 0 | 29 | 8 | 21 |
| customer-service | 20 | 0 | 20 | 4 | 16 |
| ai | 21 | 0 | 21 | 6 | 15 |
| it-development | 51 | 0 | 51 | 3 | 48 |

### Alternatives

277 catalogue pages; **6 indexable** (researched + approved). 270 are non-indexable shells (existing slugs only, no invented reasons). Hub `/alternatives/` graph children: **6**. Fastmail and SaneBox remain without a page because the only listed substitute is each other — listing Slack/Teams would be false substitutes.

### CRM master map

SEO content-coverage agent: 207 rows, **0 thin indexable findings**, 7 roadmap gaps tracked (not raised as production P1): calculators / RFP builder / plan selector / multi-product compare / UAT worksheet.

---

## 3. Quality — useful, detailed, trustworthy?

**Ledger quality issues: 4 SI duplicates + fly-io superlative.** Dimensional scores look high because expected sections exist.

| Scope | Pages | Avg | P0 | P1 | P2 | P3 | Read as |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| reviews | 279 | 92 | 0 | 0 | 19 | 260 | Strong templates; Gorgias/Freshservice 84 weakest |
| guides | 1,354 | 84 | 0 | **9** | **1,256** | 89 | Almost everything is “improvable,” not excellent |
| comparisons (sample 120) | 120 | 88 | 0 | 0 | 0 | 120 | Schema-complete; scorer does not flag boilerplate outcomes |
| CRM mixed (`content-audit crm`) | 1,010 | 88 | 0 | 4 | 230 | 776 | Includes CRM hubs + CRM comparisons |
| best | 11 | 80 | 0 | **5** | 0 | 6 | IT/AI 58; ecommerce 63 |
| industry hubs | 25 | 91 | 0 | 0 | 0 | 25 | Template-complete |
| use-case hubs | 16 | 90 | 0 | 0 | 0 | 16 | CRM use cases only in this CLI |
| resources | 16 | 89 | 0 | 0 | 0 | 16 | |
| features | 24 | 95 | 0 | 0 | 0 | 24 | |
| requirements | 14 | 88 | 0 | 0 | **14** | 0 | All CQ-P2 |
| capability hubs | — | — | — | — | — | — | **CLI crash** |

Highest-leverage leftover **published** quality:

| Route | Score | Priority | Gap |
| --- | ---: | --- | --- |
| `/guides/is-tidio-worth-it/` (and Gorgias, Help Scout, Zendesk Suite, Freshdesk) | 60 | CQ-P1 | Decision support + next-step |
| `/guides/what-is-tidio/` (and matching CS what-is) | 65 | CQ-P1 | Decision support |
| `/best/it-development-software/` | 58 | CQ-P1 | Best-page depth |
| `/best/ai-software/` | 58 | CQ-P1 | Best-page depth |
| `/best/ecommerce-software/` | 63 | CQ-P1 | Best-page depth |
| `/software/gorgias/`, `/software/freshservice/` | 84 | CQ-P2 | Weakest reviews |
| `/software/creatio/` | 86 | CQ-P2 | Official docs / pricing sources |

---

## 4. Guides — right ones, and detailed?

**Existence: yes for CORE maps. Detail: no for most of the library.**

`content:clusters:gaps` returned `{ "gaps": [] }` for: crm, email-marketing, sales-intelligence, business-communications, hr, project-management, marketing, customer-service, ai, it-development, ecommerce.

Published guide mix (1,346):

| Topic type | Count | Role |
| --- | ---: | --- |
| selection | 270 | Product pack |
| implementation | 253 | Product pack |
| pricing-education | 248 | Product pack |
| migration | 240 | Product pack |
| setup | 234 | Product pack |
| fundamental | 37 | CORE teaching |
| buying-guide | 18 | CORE-ish |
| comparison-education | 17 | |
| how-it-works | 12 | |
| checklist | 9 | |
| strategy | 6 | |
| feature-explainer / integration | 2 | |

**1,224** guides have `productSlugs`. That is why the site feels large and samey: every onboarded product gets the same pack, while category teaching pages are a thin layer on top.

---

## 5. Images, screenshots, videos, teaching visuals

**Official product video:** 279 products · 510 active · 0 needs-review · 0 unavailable · **0 missing major coverage**.

**Teaching-visual rule** (1536×1024, typically ~1 MB+, unique, no shared placeholders, no `?v=`):

| Folder | PNGs | Median | ≥900 KB | &lt;80 KB | vs rule |
| --- | ---: | ---: | ---: | ---: | --- |
| `public/capabilities/` | 243 | 1,451 KB | 234 | 0 | Pass size |
| `public/use-cases/` | 198 | 1,392 KB | 183 | 0 | Pass size |
| `public/industries/` | 76 | 1,484 KB | 76 | 0 | Pass size |
| `public/for/` | 24 | 1,472 KB | 24 | 0 | Pass size |
| `public/features/` | 72 | 1,450 KB | 71 | 0 | Pass size |
| `public/requirements/` | 30 | 1,382 KB | 30 | 0 | Pass size |
| `public/guides/` | **6,625** | **97 KB** | 1,329 | 0 | **Fail size** |
| `public/compare/` | 0 | — | — | — | No comparison art |
| `public/software/` | 844 | 269 KB | 292 | 218 | Mixed (includes logos) |

Every published guide has a `heroVisual` field. **205** of those srcs are missing files (`*-cover-v3.png` for Adapt.io, Gong, Instantly, Lemlist, and others). Live-wired files that exist: median **110 KB**; **487 ≥900 KB** / **654** between 80–900 KB / **0** under 80 KB. Unique srcs; no `?v=` query strings.

Hive archived video stays out of live HTML. Media SEO: 624 `<img>` on 19 pages; 29 YouTube posters oEmbed-live.

---

## 6. Comparisons — detailed, and all permutations?

**Permutations in primary category: yes.** **Distinctive research: no, not at this volume.**

4,041 comparison records, all `published` + `indexable` + `editorialStatus: approved` + `researchStatus: complete`. Schema quality gate: **0 failures**. That is “has verdict + ≥3 complete outcomes,” not “a buyer would trust this pair.”

| Signal | Count |
| --- | ---: |
| Outcome reasons matching “comparable support” | 7,183 / 37,752 |
| Pairs where ≥50% of outcomes are that boilerplate | **506** |
| Outcomes with `confidence: low` | 3,386 |
| Outcomes with `confidence: medium` | 34,366 |
| Quality CLI sample (120 pages) | avg **88**, all CQ-P3 |

Do not invent comparison verdicts. Shells that were unpublished this morning are now indexable records — treat distinctive rewrite as editorial work, not a mesh-coverage task.

---

## 7. Internal linking

**32,253 edges · 0 orphans · 0 weak · 0 health errors · 0 redirect hits on 19 probed pages.**

Hub child-edge counts (graph, not unique prose links): `/software/` 279 · `/guides/` 1,346 · `/compare/` 4,041 · `/categories/crm/` 154 · `/alternatives/` **6** (indexable only).

The graph was rebuilt so hubs, tools, and category children are not chrome-only. That does not make every product-guide pack a unique journey.

---

## 8. Technical SEO

**Live FULL: 0 findings** (31 completed, 1 skipped). Do **not** claim clean SEO while `client-chunks` is skipped.

| Claim | Status |
| --- | --- |
| Sitemap | 6,047 URLs |
| Canonical / URL consistency | no findings |
| Robots / HTTP on 19 routes | no findings |
| JSON-LD on 19 routes | 53 blocks parsed, 0 findings |
| Image alt on 19 routes | 624 `<img>`, 0 findings |
| YouTube posters | 29 oEmbed-live |
| Outbound validator | 0 issues; **21 URLs live-probed**, 0 failing |
| Production JS budget | **skipped** (`client-chunks` / turbopack) |
| Field CWV | collector wired (consent-gated); **not CrUX**; local TTFB 11/19 over warn, findings suppressed |
| Full-sitemap crawl | **not done** |

Technical SEO is as good as the sampled live probes show. It is not “as good as possible” until a production build budget and field CWV exist.

---

## 9. What “complete” would mean

1. Real legal identity + approved legal docs.
2. Guide PNGs at the teaching-visual bar **and** the 205 missing `-cover-v3.png` paths resolved (file on disk or src retargeted).
3. Comparison pages that a buyer can use — not 4,041 schema-valid permutations with boilerplate outcomes. Prefer researched, distinctive pages for high-intent pairs; do not invent verdicts.
4. Customer-service worth-it / what-is guides (and any other CORE page scoring &lt;80) reach decision-support quality.
5. Best pages for IT, AI, and ecommerce reach CRM-like depth.
6. Motion destination + HubSpot pricing conflict closed.
7. SI duplicate canonicals decided.
8. Fastmail/SaneBox either get a second honest catalogue peer or stay without a two-item alternatives page.
9. `content-audit capability` / `all` and `catalogue:coverage` green.
10. Production `next build` JS budget + real CWV.

Affiliate programmes on 251 products remain a commercial backlog.

---

## Tooling that could not finish

| CLI | Result | Why |
| --- | --- | --- |
| `npx tsx scripts/content-audit-cli.ts capability` | FAILED | Capability hub `priorities` are strings; `scenarios[0].bestWhen` missing |
| `npx tsx scripts/content-audit-cli.ts all` | not re-run | Same hub loader (crm/capability pull hubs) |
| `npm run catalogue:coverage` | FAILED | Processing-record `maturityTier` enum mismatch |

Comparisons quality CLI was sampled at **120** pages (full 4,041 would be a long write). Structural stats above cover the full set.

---

## Appendix — artifacts

| Artifact | Path |
| --- | --- |
| This report | `docs/reports/site-wide-editorial-audit-2026-08-18-evening.md` |
| Morning snapshot (same day) | `docs/reports/site-wide-editorial-audit-2026-08-18.md` |
| Site ledger | `reports/audits/2026-08-18-site-site.md` |
| Issue ledger | `src/data/audit/state/issues.json` |
| SEO health | `docs/seo/reports/SEO-HEALTH-LATEST.md` |
| Internal linking | `docs/seo/03-internal-linking-report.md` |
| Teaching-visual rule | `.cursor/rules/softwareglimpse-teaching-visuals.mdc` |
