# AI & IT Systems — Wave-1 full onboarding

**Date:** 2026-08-18  
**Scope:** Full Wave-1 onboarding for **AI Software** (`ai`) and **IT & Development** (`it-development`) — category definitions, catalogue affiliates + credibility peers, research, editorial, seed, best pages, comparisons, use cases, features, teaching visuals, brand logos.  
**No WordPress auto-publish.** Editorial approval gates cleared in Next.js seed only.

## Summary

| Category | Products onboarded | Comparisons | Best page | Category activated |
| --- | ---: | ---: | --- | --- |
| **AI** | 9 | 8 | `/best/ai-software/` | `activated/ai.json` |
| **IT & Development** | 5 | 4 (landscape) | `/best/it-development-software/` | `activated/it-development.json` |

**Total new software entities:** 14 (198 → **212** in `software.ts`)

## AI Wave-1 (9)

| Product | Slug | Cluster | Overall | Affiliate |
| --- | --- | --- | ---: | --- |
| ChatGPT | `chatgpt` | llm-assistant | **8.7** | No |
| Claude | `claude` | llm-assistant | **8.4** | No |
| Gemini | `gemini` | llm-assistant | **8.0** | No |
| QuillBot | `quillbot` | ai-writing | **7.5** | Yes |
| ElevenLabs | `elevenlabs` | ai-voice | **8.2** | Yes |
| Gamma | `gamma` | ai-presentations | **7.7** | Yes |
| Wegic | `wegic` | ai-website-builder | **7.0** | Yes |
| AdCreative.ai | `adcreative-ai` | ai-ad-creative | **7.6** | Yes (marketing-secondary) |
| MindStudio | `mindstudio` | ai-agents | **7.3** | Yes |

**Excluded from Wave-1 (catalogue review):** Rank Prompt, Emergent, AI InteleKt — ambiguous scope / low signal.

**Methodology:** `ai-editorial` v1.0.0 · `handsOnTesting=false`

### AI deliverables

| Artifact | Path |
| --- | --- |
| Category seed | `src/data/category-onboarding/seed/ai.ts` |
| Activated | `src/data/category-onboarding/activated/ai.json` |
| Batch | `scripts/onboard-ai-wave1-batch.mjs` |
| Products pack | `scripts/lib/ai-wave1-products.mjs` |
| Runtime | `scripts/lib/ai-onboard-runtime.mjs` |
| Research / editorial | `src/data/research/{slug}/`, `editorial/assessments|reviews/{slug}.json` |
| Best page | `src/data/seed/best.ts` → `best-ai-software` |
| Comparisons | 8 pairs in `comparisons.ts` (3 LLM peers + 5 landscape) |
| Use cases | `dimensions.ts` — llm-assistant, ai-writing, ai-voice, … |
| Features | `features.ts` — 15 AI feature slugs |
| Teaching PNGs | `public/use-cases/llm-assistant-hero.png`, `public/guides/what-is-ai-software-hero-hero.png` |
| Logos | `public/brands/{slug}.png` via `fetch-brand-logos` |

## IT Wave-1 (5)

| Product | Slug | Cluster | Overall | Affiliate |
| --- | --- | --- | ---: | --- |
| Freshservice | `freshservice` | itsm-service-desk | **8.4** | Yes (`aff-freshservice`) |
| Datadog | `datadog` | observability-monitoring | **8.6** | No |
| GitHub | `github` | source-control-devops | **9.1** | No |
| Plesk | `plesk` | hosting-operations | **7.4** | Yes |
| Bright Data | `bright-data` | web-data-collection | **7.7** | Yes |

**Excluded:** ThorData (REVIEW_REQUIRED proxy)

**Methodology:** `it-development-editorial` v1.0.0 · `handsOnTesting=false`

### IT deliverables

| Artifact | Path |
| --- | --- |
| Category seed | `src/data/category-onboarding/seed/it-development.ts` |
| Activated | `src/data/category-onboarding/activated/it-development.json` |
| Batch | `scripts/onboard-it-wave1-batch.mjs` |
| Products pack | `scripts/lib/it-wave1-products.mjs` |
| Runtime | `scripts/lib/it-onboard-runtime.mjs` |
| Best page | `best-it-development-software` |
| Comparisons | 4 landscape pairs (ITSM vs observability vs Git vs hosting vs web-data) |
| Use cases | observability-monitoring, source-control-devops, hosting-operations, web-data-collection |
| Teaching PNG | `public/use-cases/observability-monitoring-hero.png` |

## Pricing grounding (2026-08-18)

| Product | Confidence | Published floor |
| --- | --- | --- |
| ChatGPT | high | Free; Plus $20; Business $20/seat annual (2-seat min) |
| Claude | high | Free; Pro $20 ($17 annual); Team $20/seat annual |
| Gemini | high | Free; Google AI Pro $19.99/mo |
| QuillBot | high | Premium ~$8.33/mo annual |
| ElevenLabs | high | Free 10k credits; Starter $6 |
| Gamma | high | Plus $8/mo annual |
| Freshservice | high | Starter $19/agent/mo annual |
| Datadog | high | Infrastructure Pro $15/host/mo annual |
| GitHub | high | Free; Team $4/user; Enterprise $21/user |
| Plesk | high | Web Admin $16.99/mo VPS |
| Bright Data | medium | PAYG ~$4/GB; starter ~$499/mo commitments |

## Cluster rules

- **LLM ranks:** ChatGPT → Claude → Gemini (peers only)
- **Specialist clusters:** writing, voice, presentations, websites, ads, agents — cluster awards on best page, not cross-cluster ranks
- **IT ranks:** never undifferentiated ITSM vs observability vs source control
- **Jira** stays `project-management` primary; **Freshservice** is ITSM entity

## Quality / gates

- Product reviews: **approved**, CQ target ≥75 (fixture research packs)
- Category orchestrator CLI hit `buildHrBlocksForKind` bug — **manual activation** via `activateCategoryDefinition`
- Fixed pre-existing `approvedEcomPair` typo (`scoreB` → `scoresB`) blocking CLI
- **Official YouTube embeds:** not wired this pass (0 videos in affiliate packs)
- **CORE category guides** (what-is / how-to-choose / pricing / requirements / evaluation): follow-up — teaching hero PNGs generated
- **Product-guide builders** for `ai` / `it-development`: not yet in `product-guides/build.ts` — follow-up
- **No WordPress publish**

## Follow-ups

1. Wire `buildAiProductGuide` / `buildItProductGuide` + CORE guide seeds (5 per category)
2. Official product videos for ChatGPT, Claude, GitHub, Datadog, ElevenLabs
3. GenerateImage product overview/workflow PNGs under `public/software/{slug}/`
4. Resume category CLI after fixing `buildHrBlocksForKind` reference in category onboarding summary
5. Priority-2 AI: catalogue remainder after review (MindStudio depth, Wegic screenshots)
6. Priority-2 IT: ServiceNow landscape, PagerDuty, GitLab, AWS observability peers (credibility, no affiliate required)
