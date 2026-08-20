# Email Marketing supporting content — 2026-08-17

**Category:** `email-marketing` (parent: `marketing`)  
**Scope:** Guides, use-case hubs, capability hubs, marketing best page  
**Quality bar:** Buyer-helpful copy; no affiliate economics in rankings; no invented product facts  

---

## Delivered

### 1) Category guides (soft-published)

Cluster: `src/data/seed/guides-email-marketing-cluster.ts` → wired in `src/data/seed/guides.ts`.

| Slug | File | `seo.indexable` |
| --- | --- | --- |
| `what-is-email-marketing` | `guides-what-is-email-marketing.ts` | `false` (editorial gate) |
| `how-to-choose-email-marketing` | `guides-how-to-choose-email-marketing.ts` | `false` |
| `email-marketing-pricing-guide` | `guides-email-marketing-pricing-guide.ts` | `false` |
| `email-marketing-requirements-guide` | `guides-email-marketing-requirements-guide.ts` | `false` |
| `email-marketing-evaluation-guide` | `guides-email-marketing-evaluation-guide.ts` | `false` |

- Template: `softwareglimpse-guide-template-v1` / `.sg-guide-*`
- CTAs → `/best/email-marketing-software/` and `/categories/email-marketing/`
- Planned heroes: `public/guides/{slug}-hero.png` (and body figures referenced in blocks) — **PNG assets not generated in this pass**

### 2) Use-case hub deep content

Taxonomy: `src/data/seed/dimensions.ts` (`useCasesSeed`)  
Depth: `src/data/use-case-hub/email-marketing-deep.ts` (merged into `deep.ts`)

| Slug | Notes |
| --- | --- |
| `newsletters` | EM-scoped |
| `marketing-automation` | **Kept slug**; CRM does not own a use-case hub with this slug. Content scoped as *email-centered* ESP automation (not full MAP / CRM sales sequencing). Also tagged `marketing` category. |
| `ecommerce-email` | EM-scoped |
| `lead-nurturing` | EM-scoped; explicit boundary vs cold outreach |
| `small-business-campaigns` | EM-scoped |

Hub CTAs / `categorySlug: email-marketing` → best + category pages.  
Minor UI: use-case “how it helps” / product list headings are category-aware (`use-case-depth-sections.tsx`, `use-cases/[slug]/page.tsx`, `build-hub-model.ts`).

Planned visuals: `public/use-cases/{slug}-{hero\|needs\|workflow}.png` — **not generated**.

### 3) Feature / capability hubs

Canonical features already in `src/data/seed/features.ts`.  
Capabilities + depth added for:

| Capability slug | Notes |
| --- | --- |
| `email-campaigns` | New |
| `newsletter-builder` | New |
| `email-templates` | New |
| `automation-workflows` | New |
| `segmentation` | New |
| `landing-pages` | New |
| `analytics` | New (EM category; distinct from CRM `reporting`) |
| `deliverability-tools` | New |
| `ai-content-generation` | New |
| `contact-management` | **Skipped depth overwrite** — CRM already owns `/capabilities/contact-management/`. Feature remains shared in taxonomy. |

Files: `src/data/capability-hub/email-marketing-deep.ts` + `capabilitiesSeed` entries in `dimensions.ts`.  
Planned visuals: `public/capabilities/{slug}-{hero\|needs\|workflow}.png` — **not generated**.

`/features/[slug]` remains CRM-graph-driven (`feature-detail`); EM buyers get educational depth via **capability hubs**.

### 4) Industry / for pages

**Skipped.** Existing `/industries/*` and `/for/*` hubs are CRM-first (e.g. `retail-ecommerce`, `small-business`). No EM-specific industry/audience architecture to extend without inventing a parallel system.

### 5) Requirements tool page

**Skipped.** SI requirements builder (`/tools/sales-intelligence-requirements-builder/`) depends on SI-specific app, localStorage keys, and finder handoff (`DynamicSiRequirementsBuilderApp`). A thin clone would be misleading without an EM requirements engine.

### 6) Best marketing software

`src/data/seed/best.ts` → `best-marketing-software` / `/best/marketing-software/`

| Rank | Product | Overall (marketing-editorial) |
| ---: | --- | ---: |
| 1 | Kartra | 7.4 |
| 2 | Freshmarketer | 7.0 |
| 3 | SocialBee | 6.6 |
| 4 | Brand24 | 6.2 |

- Methodology: `marketing-editorial`
- Eligible: those four only
- Scores/rationales grounded in approved assessments; affiliate economics excluded

### 7) This report

`docs/reports/email-marketing-supporting-content-2026-08-17.md`

---

## File list (created / updated)

### Created
- `src/data/seed/guides-what-is-email-marketing.ts`
- `src/data/seed/guides-how-to-choose-email-marketing.ts`
- `src/data/seed/guides-email-marketing-pricing-guide.ts`
- `src/data/seed/guides-email-marketing-requirements-guide.ts`
- `src/data/seed/guides-email-marketing-evaluation-guide.ts`
- `src/data/seed/guides-email-marketing-cluster.ts`
- `src/data/use-case-hub/email-marketing-deep.ts`
- `src/data/capability-hub/email-marketing-deep.ts`
- `docs/reports/email-marketing-supporting-content-2026-08-17.md`

### Updated
- `src/data/seed/guides.ts`
- `src/data/seed/dimensions.ts` (EM use cases + capabilities)
- `src/data/use-case-hub/deep.ts`
- `src/data/capability-hub/deep.ts`
- `src/data/seed/best.ts` (`best-marketing-software`)
- `src/components/use-cases/use-case-depth-sections.tsx`
- `src/app/(site)/use-cases/[slug]/page.tsx`
- `src/services/use-case-hub/build-hub-model.ts`

---

## Skipped (with reasons)

| Item | Reason |
| --- | --- |
| Industry / for EM pages | Architecture is CRM-first; no EM industry/audience hub system to extend |
| EM requirements builder tool | Not a thin page — needs dedicated builder app + data model (SI pattern is SI-specific) |
| `contact-management` capability rewrite | Would overwrite CRM hub; shared feature slug left CRM-owned |
| Guide / hub PNG generation | Planned paths wired; assets deferred |
| Indexable EM guides | Soft-publish per guides rule until editorial gate |

---

## Follow-ups (optional)

1. Generate guide + hub teaching visuals under `public/guides/`, `public/use-cases/`, `public/capabilities/`
2. Editorial gate → set EM guide `seo.indexable: true`
3. If needed later: EM requirements builder + finder (platform work, not content-only)
4. Consider EM-specific subscriber-management hub if CRM `contact-management` framing confuses buyers
