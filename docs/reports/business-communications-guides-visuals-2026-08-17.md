# Business communications teaching visuals — 2026-08-17

**Scope:** Guide figures (seed-referenced), use-case hub priority subset (6), capability hub priority core (6), category hub optional set  
**Quality bar:** `.cursor/rules/softwareglimpse-teaching-visuals.mdc` + guides visual approach — GenerateImage, 16:9, blue-navy-white SaaS UI / teaching diagrams  
**Seed edits:** none (paths already wired in guide seeds)  
**software.ts:** untouched  

---

## Summary

| Area | Count | Location |
| --- | --- | --- |
| Guides | 14 | `public/guides/` |
| Use cases | 18 | `public/use-cases/` |
| Capabilities | 18 | `public/capabilities/` |
| Category | 3 | `public/categories/` |
| **Total** | **53** | |

All files ≈ **1.3–1.8 MB** (no ~15KB placeholders). Unique art per slug.

---

## A) Guides (`public/guides/`)

Verified against `heroVisual` / figure `src` in:

- `guides-what-is-business-communications-software.ts`
- `guides-how-to-choose-business-communications-software.ts`
- `guides-business-communications-pricing-guide.ts`
- `guides-business-communications-requirements-guide.ts`
- `guides-business-communications-evaluation-guide.ts`

| File | ~Size | Role |
| --- | --- | --- |
| `what-is-business-communications-software-hero.png` | 1.50 MB | Softphone + CRM screen-pop hero |
| `what-is-business-communications-software-building-blocks.png` | 1.49 MB | Six blocks (numbers→measure) |
| `what-is-business-communications-software-loop.png` | 1.45 MB | Provision→route→converse→log→measure |
| `how-to-choose-business-communications-software-hero.png` | 1.38 MB | Scorecard / selection hero |
| `how-to-choose-business-communications-software-needs.png` | 1.57 MB | Four worked examples |
| `how-to-choose-business-communications-software-roadmap.png` | 1.49 MB | Job→seats→numbers→routing→CTI→trial |
| `business-communications-pricing-guide-hero.png` | 1.48 MB | Pricing calculator hero |
| `business-communications-pricing-guide-stack.png` | 1.85 MB | Cost stack layers |
| `business-communications-pricing-worked-example.png` | 1.57 MB | Harbor Studio 4-licence compare |
| `business-communications-requirements-guide-hero.png` | 1.52 MB | Requirements sheet hero |
| `business-communications-requirements-guide-path.png` | 1.34 MB | Job→sheet path |
| `business-communications-evaluation-guide-hero.png` | 1.43 MB | Weighted scorecard hero |
| `business-communications-evaluation-guide-path.png` | 1.53 MB | Weights→decide path |
| `business-communications-evaluation-trial-script.png` | 1.45 MB | Two-week trial timeline |

---

## B) Use-case hubs (`public/use-cases/`)

Each slug: `{slug}-hero.png`, `{slug}-needs.png`, `{slug}-workflow.png`

| Slug | hero | needs | workflow |
| --- | --- | --- | --- |
| `business-phone` | 1.47 MB | 1.57 MB | 1.49 MB |
| `sales-calling` | 1.37 MB | 1.57 MB | 1.42 MB |
| `customer-messaging` | 1.43 MB | 1.44 MB | 1.57 MB |
| `whatsapp-support` | 1.62 MB | 1.55 MB | 1.48 MB |
| `team-communication` | 1.43 MB | 1.62 MB | 1.53 MB |
| `contact-center` | 1.52 MB | 1.77 MB | 1.55 MB |

Note: `use-case-hub/business-communications-deep.ts` is referenced in `dimensions.ts` but not present yet — assets are ready for hub wiring when deep profiles land.

---

## C) Capability hubs (`public/capabilities/`)

Each slug: `{slug}-hero.png`, `{slug}-needs.png`, `{slug}-workflow.png` (fresh set; no `-v2` needed)

| Slug | hero | needs | workflow |
| --- | --- | --- | --- |
| `cloud-phone` | 1.41 MB | 1.52 MB | 1.56 MB |
| `call-routing` | 1.49 MB | 1.61 MB | 1.41 MB |
| `power-dialer` | 1.31 MB | 1.51 MB | 1.45 MB |
| `whatsapp-business` | 1.38 MB | 1.65 MB | 1.48 MB |
| `shared-inbox` | 1.41 MB | 1.73 MB | 1.42 MB |
| `crm-cti` | 1.45 MB | 1.56 MB | 1.46 MB |

Same note as use cases for `capability-hub/business-communications-deep.ts`.

---

## D) Category hub (`public/categories/`)

Mirrors sales-intelligence category pattern (hero + needs + workflow):

| File | ~Size |
| --- | --- |
| `business-communications-hero.png` | 1.56 MB |
| `business-communications-needs.png` | 1.50 MB |
| `business-communications-workflow.png` | 1.56 MB |

---

## Constraints followed

- No vendor logos, purple neon, emoji, or watermarks  
- Unique composition per slug (guides vs use-case vs capability variants kept distinct)  
- WhatsApp visuals use generic navy/blue chat UI (no Meta trademark green / logos)  
- GenerateImage `filename` = public path basename; copied from Cursor assets → `public/`  

---

## Follow-ups (out of scope)

- Wire use-case / capability / category hub `heroVisual` / `needsVisual` / `workflowVisual` when BC deep hub files are authored  
- Optional: gentle PNG edge crop if any figure shows excess white margin in live `GuideFigure` layout  
