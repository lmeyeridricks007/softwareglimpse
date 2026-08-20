# Category onboarding orchestrator

Defines a SoftwareGlimpse **decision domain** (not just a name label) so software onboarding, research, editorial methodology, comparisons, and future agents share one category configuration.

## Core principle

```text
Category identity
→ taxonomy / hierarchy
→ scope
→ feature model
→ research requirements
→ editorial methodology
→ comparison methodology
→ pricing dimensions
→ recommendation / finder readiness
→ content architecture
→ activation (categoryContentReady)
```

Does **not** auto-publish hubs, best pages, or product rankings.

## Workflow stages

```text
intake → identity → duplication-check → taxonomy → scope-definition
→ feature-model → research-model → editorial-methodology
→ comparison-methodology → pricing-model → recommendation-model
→ content-model → tool-readiness → membership → validation
→ onboarding-summary
```

## Integration with software onboarding

When a category is **activated**, `getCategoryOnboardingOverride(slug)` returns `categoryContentReady: true` from the activated definition.

That clears Prompt 9’s `CATEGORY_NOT_READY` / `category-blocked` path for products in that category.

Resume flow:

```bash
npm run onboard:category -- email-marketing
npm run onboard:category:resume-software -- getresponse email-marketing
```

## Category model

- **Scope** — includes / excludes / adjacent + classification notes  
- **Hierarchy** — parent + subcategory (no deep SEO trees)  
- **Membership** — primary / secondary / adjacent / uncertain  
- **Lifecycle** — candidate | active | deprecated | merged | archived (≠ page publish status)

## Feature taxonomy

Category feature definitions include importance (`core|important|optional|specialist`), comparison/finder relevance, and research guidance. **Every feature slug and use-case slug on a category definition must already exist** in `canonicalFeaturesSeed` / `useCasesSeed`. `validateCategoryDefinition` / `validateCategorySeedAlignment` fail closed if they do not. Site audit validity reuses that check.

## Research requirements

Per category: required / recommended / optional domains (+ optional feature links). Consumed by software onboarding via policy override domains.

## Editorial / comparison methodology

Versioned methodology (e.g. `email-marketing-editorial` v1.0.0). Comparison criteria mark `factual` vs `editorial` explicitly. No product scores assigned during category onboarding.

## Pricing readiness

`SUPPORTED | PARTIAL | UNSUPPORTED` with capability-gap notes (e.g. contact-tier calculator UX). Does not hack specialized pricing into the CRM calculator.

## Finder readiness

`NOT_READY | DATA_MODEL_READY | ENGINE_READY | UI_READY`

## Agent context

```text
category-agent-context:{slug}:v{version}
```

Projection: features, research requirements, methodologies, pricing dimensions, use cases — for CategoryHubAgent / BestPageAgent / etc. (agents not implemented yet).

## CLI

```bash
npm run onboard:category -- email-marketing
npm run onboard:category -- email-marketing --dry-run
npm run onboard:category -- crm --reconcile
npm run onboard:category:status -- email-marketing
npm run onboard:category:list
npm run onboard:category:graph -- email-marketing
npm run onboard:category:validate
npm run onboard:category:resume-software -- getresponse email-marketing
```

Programmatic:

```typescript
import { onboardCategory, getCategoryAgentContext } from "@/services/category-onboarding";

await onboardCategory({ name: "Email Marketing", slug: "email-marketing" });
```

## Storage

```text
src/data/category-onboarding/
  seed/           # Email Marketing + CRM projection
  activated/      # Activation records (flip content readiness)
  runs/           # Resumable CategoryOnboardingRun JSON
```

## Cursor workflow

Prefer:

```text
Onboard category: Email Marketing
→ npm run onboard:category -- email-marketing
```

over manually editing taxonomy/methodology files.

## Email Marketing POC notes

- Parent: Marketing  
- InboxAlly classified **adjacent** (deliverability), not core  
- Kartra / Freshmarketer **secondary**  
- Pricing **PARTIAL** (engine has tiered/contact primitives; category calculator not built)  
- Finder **DATA_MODEL_READY** (no UI)
