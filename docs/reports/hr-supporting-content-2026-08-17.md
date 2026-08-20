# HR supporting content — 2026-08-17

**Category:** `hr`  
**Scope:** Best page, category guides, product guides, use-case hubs, capability hubs, category hub  
**Quality bar:** Buyer-helpful copy; no affiliate economics in rankings; no invented product facts; `handsOnTesting=false` disclosed  
**Mirror of:** `project-management-supporting-content-2026-08-17.md` / BC supporting content

---

## Delivered

### 1) Best HR software

`src/data/seed/best.ts` → `best-hr-software` / `/best/hr-software/`

- `editorialStatus: approved`, `metadata.researchStatus: complete`, `seo.indexable: true`
- `methodologyVersion: 1.0.0` (`hr-editorial`); job-cluster methodology
- `handsOnTesting=false`; affiliate economics excluded
- **No cross-cluster ranked set** — Wave-1 has one product per cluster (false peer ranking avoided)
- Editor’s picks via `useCaseRecommendations` + `decisionPaths` + `landscape` groups

**Landscape / editor’s picks by job (from assessment JSON):**

| Cluster | Product | Score | Award |
| --- | --- | ---: | --- |
| frontline-wfm | Connecteam | **8.3** | Best frontline WFM (Wave-1) |
| ats-recruiting | Breezy HR | **7.9** | Best ATS / recruiting (Wave-1) |
| time-attendance | Jibble | **7.7** | Best time & attendance (Wave-1) |
| sop-training | Trainual | **7.3** | Best SOP / training docs (Wave-1) |
| lms-academy | LearnWorlds | **7.1** *(marketing-editorial)* | LMS landscape only — not HR methodology peer |

Landscape groups (5): ats-recruiting, frontline-wfm, time-attendance, sop-training, lms-academy  

Also wired: 5 decision paths, 5 buying-guide steps, FAQs, `featureMatrixSlugs` (applicant-tracking, workforce-scheduling, time-attendance, sop-knowledge-base, employee-training-paths, gps-geofence-clockin), tool paths.

`bestPagesSeed` now includes `hr-software` alongside crm, si, em, marketing, business-communications, project-management.

### 2) Category guides (indexable — match PM)

Cluster: `src/data/seed/guides-hr-cluster.ts` → wired in `src/data/seed/guides.ts`.

| Slug | File | `seo.indexable` |
| --- | --- | --- |
| `what-is-hr-software` | `guides-what-is-hr-software.ts` | `true` |
| `how-to-choose-hr-software` | `guides-how-to-choose-hr-software.ts` | `true` |
| `hr-pricing-guide` | `guides-hr-pricing-guide.ts` | `true` |
| `hr-requirements-guide` | `guides-hr-requirements-guide.ts` | `true` |
| `hr-evaluation-guide` | `guides-hr-evaluation-guide.ts` | `true` |

- Template: `softwareglimpse-guide-template-v1` blocks
- CTAs → `/best/hr-software/` and `/categories/hr/`
- Direct-answer blocks + concrete worked examples (Harbor Retail, Northline Ops)
- No invented product scores in guides

### 3) Product guides

`src/data/seed/guides-product-hr.ts` — short static guides (PM pattern):

- `what-is-breezy-hr`, `is-breezy-hr-worth-it`
- `what-is-connecteam`, `is-connecteam-worth-it`
- `what-is-jibble`, `is-jibble-worth-it`
- `what-is-trainual`, `is-trainual-worth-it`

### 4) Use-case hub deep content

Taxonomy: already in `dimensions.ts` (`useCasesSeed`) — verified present.  
Depth: `src/data/use-case-hub/hr-deep.ts` (merged into `deep.ts`)

| Slug | Related products (when tagged) |
| --- | --- |
| `recruiting-ats` | breezy-hr |
| `workforce-scheduling` | connecteam |
| `time-attendance` | jibble, connecteam |
| `employee-training` | trainual, learnworlds (LMS landscape) |
| `sop-documentation` | trainual |
| `frontline-ops` | connecteam, jibble |

UI category-aware labels extended for `hr` in:

- `use-case-depth-sections.tsx`
- `use-cases/[slug]/page.tsx`
- `build-hub-model.ts`

### 5) Capability hubs

Features in `features.ts`; capabilities in `dimensions.ts`; depth in `capability-hub/hr-deep.ts`.

| Capability slug | Hub depth |
| --- | --- |
| `applicant-tracking` | ✅ |
| `workforce-scheduling` | ✅ |
| `time-attendance` | ✅ |
| `gps-geofence-clockin` | ✅ |
| `sop-knowledge-base` | ✅ |
| `employee-training-paths` | ✅ |
| `frontline-comms` | ✅ |
| `hris-integrations` | ✅ |
| `ai-assistance` | Feature extended with `hr` category — **hub skipped** (CRM owns `/capabilities/ai-assistance/`) |
| `analytics-reporting` | Feature category extended with `hr` — **hub skipped** (BC owns slug) |

8 HR capability hubs merged into `capabilityDepthBySlug`.

### 6) Category hub

`src/data/category-hub/hr.ts` → wired in `category-hub/index.ts` for `/categories/hr/`.

**Planned visuals (visuals agent):** `public/categories/hr-{hero|needs|workflow}.png`

### 7) Industry / requirements detail

| Item | Decision |
| --- | --- |
| Industry hub enrichments | **Skipped** — `/industries/*` depth is CRM-vertical architecture (same call as PM/BC/EM). Prefer not to overwrite CRM vertical copy. |
| Requirement-detail pages | **Skipped** — CRM-heavy. HR **requirements guide** is the requirements surface. |

### 8) Visuals (planned paths)

Guide heroes/figures under `public/guides/` (what-is, how-to-choose, pricing, requirements, evaluation, product guides).  
Use-case: `public/use-cases/{6 slugs}-{hero|needs|workflow}.png`  
Capability: `public/capabilities/{8 slugs}-{hero|needs|workflow}.png`  
Category: `public/categories/hr-{hero|needs|workflow}.png`

### 9) Reports

- `docs/reports/hr-supporting-content-2026-08-17.md` (this file)
- `docs/reports/hr-product-coverage.md`

---

## File list

### Created

- `src/data/seed/guides-what-is-hr-software.ts`
- `src/data/seed/guides-how-to-choose-hr-software.ts`
- `src/data/seed/guides-hr-pricing-guide.ts`
- `src/data/seed/guides-hr-requirements-guide.ts`
- `src/data/seed/guides-hr-evaluation-guide.ts`
- `src/data/seed/guides-hr-cluster.ts`
- `src/data/seed/guides-product-hr.ts`
- `src/data/use-case-hub/hr-deep.ts`
- `src/data/capability-hub/hr-deep.ts`
- `src/data/category-hub/hr.ts`
- `docs/reports/hr-supporting-content-2026-08-17.md`
- `docs/reports/hr-product-coverage.md`

### Updated

- `src/data/seed/best.ts`
- `src/data/seed/guides.ts`
- `src/data/seed/dimensions.ts`
- `src/data/seed/features.ts`
- `src/data/use-case-hub/deep.ts`
- `src/data/capability-hub/deep.ts`
- `src/data/category-hub/index.ts`
- `src/components/use-cases/use-case-depth-sections.tsx`
- `src/app/(site)/use-cases/[slug]/page.tsx`
- `src/services/use-case-hub/build-hub-model.ts`

### Backups

`tmp/hr-backups/` — taken before edits.

---

## Skipped (with reasons)

| Item | Reason |
| --- | --- |
| Industry / `for` pages | CRM-first architecture — same as PM/BC/EM |
| Full requirement-detail hubs | CRM-heavy; requirements guide is the HR surface |
| Cross-cluster ranked recommendations | Wave-1 has 1 product per cluster — would invent false peers |
| `ai-assistance` capability hub rewrite | CRM owns the hub; feature taxonomy extended only |
| `analytics-reporting` capability hub | BC owns the slug; feature category extended only |
| LearnWorlds product guides | Marketing-primary LMS; landscape only on best page |
| Freshteam / payroll-only tools | Not in Wave-1 onboarding |
| WordPress auto-publish | Explicitly out of scope |
| GenerateImage PNG generation | Paths planned; visuals agent follow-up |

---

## Verification

| Check | Result |
| --- | --- |
| `bestPagesSeed` includes `hr-software` | ✅ |
| GuidePageSchema × 5 category + 8 product guides | ✅ wired |
| BestPageSchema for HR page (empty recommendations + landscape awards) | ✅ |
| Scores from assessments (8.3 / 7.9 / 7.7 / 7.3; LW 7.1 marketing) | ✅ |
| 6 use-case depth keys | ✅ |
| 8 capability depth keys (no `ai-assistance` / no BC `analytics-reporting`) | ✅ |
| Category hub `hr` registered | ✅ |

---

## Follow-ups

1. GenerateImage / teaching visuals for guides, use cases, capabilities, and category hub PNGs.
2. Onboard Freshteam (and other ATS peers) before introducing a ranked ATS set.
3. Optional: full `blocks-hr` product-guide builder parity with CRM/BC.
4. Optional: WP publish of HR hubs when ready (not this pass).
