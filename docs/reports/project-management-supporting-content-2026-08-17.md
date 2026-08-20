# Project Management supporting content — 2026-08-17

**Category:** `project-management`  
**Scope:** Best page, category guides, product guides, use-case hubs, capability hubs  
**Quality bar:** Buyer-helpful copy; no affiliate economics in rankings; no invented product facts; `handsOnTesting=false` disclosed  
**Mirror of:** `business-communications-supporting-content-2026-08-17.md`

---

## Delivered

### 1) Best project management software

`src/data/seed/best.ts` → `best-project-management-software` / `/best/project-management-software/`

- `editorialStatus: approved`, `metadata.researchStatus: complete`, `seo.indexable: true` (matches BC / existing best pages)
- `methodologyVersion: 1.0.0`; job-cluster methodology — work OS peers ranked together; specialists get landscape awards only
- `handsOnTesting=false`; affiliate economics excluded

**Work-OS ranked set (from assessment JSON):**

| Rank | Product | Score | Award |
| ---: | --- | ---: | --- |
| 1 | monday.com | **8.6** | Best work OS / work management platform |
| 2 | Hive | **7.6** | Best collaborative work hub for project teams |

> Brief placeholders were monday 8.6 / hive 7.9. Assessment JSON landed during this pass: monday **8.6** confirmed; hive **7.6** (not 7.9). Best page uses assessment scores.

**Landscape awards (not ranked against work OS):**

| Product | Award |
| --- | --- |
| Office Timeline | Best PowerPoint timeline / Gantt presenter |
| Foxit | Best PDF editor for productivity stacks |
| Getscreen.me | Best browser remote desktop |
| WebCatalog | Best desktop app workspace |

**Landscape groups (5):** work-os, timeline-presentation, document-productivity, remote-access, desktop-workspace  

Also wired: 6 decision paths (work OS, collaborative hub, timeline slides, PDF, remote support, desktop workspace), 5 buying-guide steps, FAQs, `featureMatrixSlugs` (`task-boards`, `timeline-gantt`, `automations-workflows`, `integrations-ecosystem`, `reporting-dashboards`), tool paths.

`bestPagesSeed` now includes `project-management-software` alongside crm, si, em, marketing, business-communications.

### 2) Category guides (indexable — match BC)

Cluster: `src/data/seed/guides-project-management-cluster.ts` → wired in `src/data/seed/guides.ts`.

| Slug | File | `seo.indexable` |
| --- | --- | --- |
| `what-is-project-management-software` | `guides-what-is-project-management-software.ts` | `true` |
| `how-to-choose-project-management-software` | `guides-how-to-choose-project-management-software.ts` | `true` |
| `project-management-pricing-guide` | `guides-project-management-pricing-guide.ts` | `true` |
| `project-management-requirements-guide` | `guides-project-management-requirements-guide.ts` | `true` |
| `project-management-evaluation-guide` | `guides-project-management-evaluation-guide.ts` | `true` |

- Template: `softwareglimpse-guide-template-v1` blocks
- CTAs → `/best/project-management-software/` and `/categories/project-management/`
- Direct-answer blocks + concrete worked examples (Harbor Studio, Northline Ops)
- No invented product scores in guides

### 3) Product guides

`src/data/seed/guides-product-pm.ts` — short static guides (not full `blocks-bc` builder):

- `what-is-monday`, `is-monday-worth-it`
- `what-is-hive`, `is-hive-worth-it`

Note: BC originally skipped product guides then later added `buildAllBcProductGuides`. PM ships a short static set; full builder parity is a follow-up.

### 4) Use-case hub deep content

Taxonomy: `src/data/seed/dimensions.ts` (`useCasesSeed`)  
Depth: `src/data/use-case-hub/project-management-deep.ts` (merged into `deep.ts`)

| Slug | Related products (when tagged) |
| --- | --- |
| `work-management` | monday, hive |
| `project-tracking` | monday, hive, office-timeline |
| `timeline-reporting` | monday, hive, office-timeline |
| `team-collaboration-work` | monday, hive |
| `resource-planning` | monday, hive |
| `document-productivity` | foxit |
| `remote-support-access` | getscreen-me |
| `desktop-productivity` | webcatalog |

All 8 registered + depth merged. Products already tagged in `software.ts` by the parallel onboarding agent.

UI category-aware labels extended for `project-management` in:

- `use-case-depth-sections.tsx`
- `use-cases/[slug]/page.tsx`
- `build-hub-model.ts`

### 5) Capability hubs

Features in `features.ts`; capabilities in `dimensions.ts`; depth in `capability-hub/project-management-deep.ts`.

| Capability slug | Hub depth |
| --- | --- |
| `task-boards` | ✅ |
| `timeline-gantt` | ✅ |
| `workload-resources` | ✅ |
| `automations-workflows` | ✅ |
| `time-tracking` | ✅ |
| `docs-collaboration` | ✅ |
| `integrations-ecosystem` | ✅ |
| `reporting-dashboards` | ✅ |
| `document-pdf` | ✅ |
| `remote-access` | ✅ |
| `desktop-workspace` | ✅ |
| `ai-assistance` | Feature extended with `project-management` category — **hub skipped** (CRM owns `/capabilities/ai-assistance/`) |

11 PM capability hubs merged into `capabilityDepthBySlug`. No slug collisions with CRM/BC hubs (`automations-workflows` ≠ EM `automation-workflows`).

### 6) Industry / requirements detail

| Item | Decision |
| --- | --- |
| Industry hub enrichments | **Skipped** — `/industries/*` depth is CRM-vertical architecture (same call as BC/EM). Prefer not to overwrite CRM vertical copy. |
| Requirement-detail pages | **Skipped** — CRM-heavy. PM **requirements guide** is the requirements surface. |

### 7) Visuals

**GenerateImage (priority, ~1MB+ each):**

- Guide heroes: what-is, how-to-choose
- Guide body: what-is building-blocks + loop; how-to-choose needs + framework
- Use-case heroes: work-management, project-tracking, timeline-reporting
- Capability heroes: task-boards, timeline-gantt, automations-workflows

**SVG→sharp remainder:** `scripts/generate-pm-teaching-visuals.mjs` fills remaining guide/product heroes and all needs/workflow assets under `public/use-cases/` and `public/capabilities/` (smaller SVG placeholders — refresh with GenerateImage when polishing).

### 8) Reports

- `docs/reports/project-management-supporting-content-2026-08-17.md` (this file)
- `docs/reports/project-management-product-coverage.md`

---

## File list

### Created

- `src/data/seed/guides-what-is-project-management-software.ts`
- `src/data/seed/guides-how-to-choose-project-management-software.ts`
- `src/data/seed/guides-project-management-pricing-guide.ts`
- `src/data/seed/guides-project-management-requirements-guide.ts`
- `src/data/seed/guides-project-management-evaluation-guide.ts`
- `src/data/seed/guides-project-management-cluster.ts`
- `src/data/seed/guides-product-pm.ts`
- `src/data/use-case-hub/project-management-deep.ts`
- `src/data/capability-hub/project-management-deep.ts`
- `scripts/generate-pm-teaching-visuals.mjs`
- `docs/reports/project-management-supporting-content-2026-08-17.md`
- `docs/reports/project-management-product-coverage.md`
- `public/guides/*project-management*` / `what-is-*` / `how-to-choose-*` / product guide heroes
- `public/use-cases/{8 slugs}-{hero|needs|workflow}.png`
- `public/capabilities/{11 slugs}-{hero|needs|workflow}.png`

### Updated

- `src/data/seed/best.ts`
- `src/data/seed/guides.ts`
- `src/data/seed/dimensions.ts`
- `src/data/seed/features.ts`
- `src/data/use-case-hub/deep.ts`
- `src/data/capability-hub/deep.ts`
- `src/components/use-cases/use-case-depth-sections.tsx`
- `src/app/(site)/use-cases/[slug]/page.tsx`
- `src/services/use-case-hub/build-hub-model.ts`

### Backups

`tmp/pm-backups/` — taken before edits.

---

## Skipped (with reasons)

| Item | Reason |
| --- | --- |
| Industry / `for` pages | CRM-first architecture — same as BC/EM |
| Full requirement-detail hubs | CRM-heavy; requirements guide is the PM surface |
| `ai-assistance` capability hub rewrite | CRM owns the hub; feature taxonomy extended only |
| Full `blocks-pm` product-guide builder | Short static monday/Hive guides ship now; builder parity optional |
| Motion onboarding | Deferred per category definition notes |
| WordPress auto-publish | Explicitly out of scope |

---

## Verification

| Check | Result |
| --- | --- |
| GuidePageSchema × 5 category + 4 product guides | ✅ |
| BestPageSchema for PM page | ✅ |
| monday 8.6 / hive 7.6 from assessments | ✅ |
| 8 use-case depth keys | ✅ |
| 11 capability depth keys (no `ai-assistance`) | ✅ |
| Products soft-seeded (parallel agent) | ✅ six affiliates |

---

## Follow-ups

1. Refresh SVG placeholder needs/workflow PNGs with GenerateImage for polish (~1MB SaaS mockups).
2. Extend `blocks-pm.ts` + product-guide builder if full CRM/BC-style product guide families are wanted.
3. Onboard Motion (and other catalogue PM peers) in a later wave — keep landscape vs work-OS discipline.
4. Optional: WP publish of PM hubs when ready (not this pass).
