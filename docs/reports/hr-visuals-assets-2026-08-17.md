# HR teaching visuals & Wave-1 asset discovery — 2026-08-17

**Scope:** Category / guide / use-case / capability teaching PNGs for HR; asset discovery for `breezy-hr`, `connecteam`, `jibble`, `trainual`  
**Quality bar:** `.cursor/rules/softwareglimpse-teaching-visuals.mdc`  
**Seed coordination:** No `guides-what-is-hr*.ts` (or other HR guide seeds) on disk yet — guide heroes use the filenames below for supporting-content wiring. Use-case slugs match `src/data/seed/dimensions.ts`. Capability slugs match `src/data/category-onboarding/seed/hr.ts` features.

---

## Update — 2026-08-18 (teaching-visuals rule)

SVG circle-card needs/workflow (~80–127 KB) were replaced with GenerateImage **`-v2.png`** assets (~1.4–1.6 MB). Hubs now wire `needs-v2` / `workflow-v2`. Guide body figures and Wave-1 product-guide heroes were generated to the same bar. Orphan SVG PNGs remain on disk but are no longer referenced.

## Summary

| Method | Count | Role |
| --- | ---: | --- |
| **GenerateImage** | **17 + v2 refresh** | Heroes, category needs/workflow, hub needs/workflow-v2, guide figures |
| **SVG → sharp (orphans)** | **22** | Unwired leftovers only |
| **Live hub/guide visuals** | **GenerateImage only** | Teaching-visuals rule |

**Do not** cache-bust with `?v=` on `next/image` srcs.

---

## A) GenerateImage assets (17)

### Category hub (`public/categories/`)

| File | ~Size | Subject |
| --- | ---: | --- |
| `hr-hero.png` | 1.47 MB | HR command center (ATS + schedule + timesheet + training) |
| `hr-needs.png` | 1.57 MB | Problems → HR fixes (6 pairs) |
| `hr-workflow.png` | 1.52 MB | Buyer workflow: job → features → cluster → trial → TCO |

### Guides (`public/guides/`)

| File | ~Size | Intended seed slug |
| --- | ---: | --- |
| `what-is-hr-software-hero.png` | 1.51 MB | `what-is-hr-software` |
| `how-to-choose-hr-software-hero.png` | 1.61 MB | `how-to-choose-hr-software` |
| `hr-pricing-guide-hero.png` | 1.55 MB | `hr-pricing-guide` (optional pricing guide) |

### Use-case heroes (`public/use-cases/`)

| File | ~Size |
| --- | ---: |
| `recruiting-ats-hero.png` | 1.43 MB |
| `workforce-scheduling-hero.png` | 1.39 MB |
| `time-attendance-hero.png` | 1.48 MB |
| `employee-training-hero.png` | 1.41 MB |
| `sop-documentation-hero.png` | 1.43 MB |
| `frontline-ops-hero.png` | 1.60 MB |

### Capability heroes (`public/capabilities/`)

| File | ~Size | Notes |
| --- | ---: | --- |
| `applicant-tracking-hero.png` | 1.38 MB | Feature slug hub |
| `workforce-scheduling-hero.png` | 1.43 MB | Unique art vs use-case (same filename, different folder) |
| `time-attendance-hero.png` | 1.48 MB | Unique art vs use-case |
| `sop-knowledge-base-hero.png` | 1.46 MB | |
| `employee-training-paths-hero.png` | 1.49 MB | |

---

## B) SVG → sharp placeholders (22)

Script: `scripts/generate-hr-teaching-visuals.mjs`  
Skips any existing file **> 900 KB** (preserves GenerateImage heroes).

### Use-case needs + workflow (12)

| Slug | needs | workflow |
| --- | ---: | ---: |
| `recruiting-ats` | SVG | SVG |
| `workforce-scheduling` | SVG | SVG |
| `time-attendance` | SVG | SVG |
| `employee-training` | SVG | SVG |
| `sop-documentation` | SVG | SVG |
| `frontline-ops` | SVG | SVG |

### Capability needs + workflow (10)

| Slug | needs | workflow |
| --- | ---: | ---: |
| `applicant-tracking` | SVG | SVG |
| `workforce-scheduling` | SVG | SVG |
| `time-attendance` | SVG | SVG |
| `sop-knowledge-base` | SVG | SVG |
| `employee-training-paths` | SVG | SVG |

Re-run: `node scripts/generate-hr-teaching-visuals.mjs`

---

## C) Product asset discovery (Wave-1)

Commands:

```bash
npm run assets:agent:software -- breezy-hr --write
npm run assets:agent:software -- connecteam --write
npm run assets:agent:software -- jibble --write
npm run assets:agent:software -- trainual --write
```

| Product | Coverage | ADD NOW | Strong | Screenshots opp. | Tours opp. | Report |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| breezy-hr | very-weak | 3 | 1 | 1 | 1 | `docs/content-assets/software/breezy-hr-asset-opportunities.md` |
| connecteam | very-weak | 5 | 1 | 1 | 1 | `docs/content-assets/software/connecteam-asset-opportunities.md` |
| jibble | very-weak | 3 | 1 | 1 | 1 | `docs/content-assets/software/jibble-asset-opportunities.md` |
| trainual | very-weak | 4 | 1 | 1 | 1 | `docs/content-assets/software/trainual-asset-opportunities.md` |

All four: **0** official videos / screenshots currently on ResearchMedia enrichment — pages are prose + sources only. Agent next actions point at overview tours, feature demos (AI where relevant), and use-case-aligned media.

### Official video specs (discovered)

Written to `scripts/_hr-wave1-official-videos.json` (was empty after onboard):

| Product | videoId | Title | Channel |
| --- | --- | --- | --- |
| breezy-hr | `1zcPr_py6g4` | Intro to Breezy HR - Full Demo | Breezy HR |
| connecteam | `p9r3UojoeIE` | Connecteam Demo (4 minutes) 2025 | Connecteam |
| connecteam | `yV8_nETiQe0` | Product Overview for Food & Beverage | Connecteam |
| jibble | `q90UxXmoooo` | Easy Time Tracking with Jibble \| Walkthrough | Jibble |
| trainual | `JUun9n-65Qg` | What is Trainual? \| Complete Feature Overview | Trainual |

Imported 2026-08-18 via `scripts/source-hr-product-media.mjs` into ResearchMedia (`status: published`) plus vendor-ui screenshots on each Wave-1 product page. oEmbed-verified vendor channels.

**Additional opportunity (not in JSON):** Jibble homepage embeds multiple **Vimeo** walkthroughs (IDs observed: `1105482850`, `1114184997`, `1105483080`, …) — catalog via Vimeo path if product media schema supports non-YouTube.

### Connecteam brand logo

| Before | After |
| --- | --- |
| 48×48 favicon.ico (~1.8 KB) | **600×600** brand mark from `wp-content/uploads/2024/03/connecteam-logo.png` (~3.3 KB) |

`scripts/fetch-brand-logos.mjs` now pins `url` for `connecteam` so `--force` does not regress to favicon.

---

## D) Gaps remaining

1. **Wire visuals** in category / use-case / capability deep profiles and HR guide seeds (`heroVisual` / `needsVisual` / `workflowVisual`) once supporting content lands — filenames above are ready.
2. **SVG → GenerateImage refresh** for use-case/capability needs+workflow if those sections ship full-width (current SVG is teaching-grade but lighter than ~1.5 MB heroes).
3. **Import official videos** from `_hr-wave1-official-videos.json` into ResearchMedia / product pages via `assets:approve` workflow.
4. **Product screenshots / tours** still open on all four audits (priority: overview tour + primary job-cluster demo).
5. **Jibble Vimeo** homepage embeds not yet in video specs JSON.
6. **Capability hubs** may also want GenerateImage for needs/workflow later (SVG placeholders present).
7. Guide figure packs beyond heroes (building-blocks, scorecards, pricing stack) not generated this pass.

---

## Return counts

- **GenerateImage assets:** **17**
- **SVG placeholders:** **22**
- **Paths:** `public/categories/hr-{hero,needs,workflow}.png`, `public/guides/{what-is-hr-software,how-to-choose-hr-software,hr-pricing-guide}-hero.png`, `public/use-cases/{6 slugs}-{hero,needs,workflow}.png`, `public/capabilities/{5 slugs}-{hero,needs,workflow}.png`
- **Asset discovery:** 4/4 audited **very-weak**; 5 official YouTube specs catalogued; Connecteam logo upgraded to 600×600.
