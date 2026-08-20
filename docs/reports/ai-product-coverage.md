# AI Software — Product Coverage Map

**Date:** 2026-08-18  
**Purpose:** Planning doc — AI software job clusters vs SoftwareGlimpse coverage after Wave-1 onboarding.  
**Not a publish plan.** Affiliate economics do not drive editorial ranking.

Related: [`ai-it-wave1-onboarding-2026-08-18.md`](./ai-it-wave1-onboarding-2026-08-18.md) · [`ai-it-priority2-onboarding-2026-08-18.md`](./ai-it-priority2-onboarding-2026-08-18.md) · [`ai-it-priority3-onboarding-2026-08-18.md`](./ai-it-priority3-onboarding-2026-08-18.md) · [`hosting-automation-overlay-onboarding-2026-08-18.md`](./hosting-automation-overlay-onboarding-2026-08-18.md)

---

## Category scope

| Job cluster | Buyer intent | Wave-1 covered |
| --- | --- | --- |
| **llm-assistant** | General reasoning, coding, connectors | ChatGPT, Claude, Gemini |
| **ai-writing** | Paraphrase, grammar, long-form assist | QuillBot |
| **ai-voice** | TTS, cloning, dubbing | ElevenLabs |
| **ai-presentations** | Decks from prompts | Gamma |
| **ai-website-builder** | AI site generation | Wegic |
| **ai-ad-creative** | Ad variants & creative testing | AdCreative.ai |
| **ai-agents** | Custom agent workflows | MindStudio |
| **ai-automation** | Multi-app workflow automation + AI steps | *(overlay batch)* |

Source: `src/data/category-onboarding/seed/ai.ts` (v1.2.0)

**Ranking rule:** within cluster only — no undifferentiated “best AI” list.

---

## Wave-1 onboarded (9)

| Product | Slug | Cluster | Overall | Affiliate |
| --- | --- | --- | ---: | --- |
| ChatGPT | `chatgpt` | llm-assistant | 8.7 | — |
| Claude | `claude` | llm-assistant | 8.4 | — |
| Gemini | `gemini` | llm-assistant | 8.0 | — |
| QuillBot | `quillbot` | ai-writing | 7.5 | Yes |
| ElevenLabs | `elevenlabs` | ai-voice | 8.2 | Yes |
| Gamma | `gamma` | ai-presentations | 7.7 | Yes |
| Wegic | `wegic` | ai-website-builder | 7.0 | Yes |
| AdCreative.ai | `adcreative-ai` | ai-ad-creative | 7.6 | Yes |
| MindStudio | `mindstudio` | ai-agents | 7.3 | Yes |

## Priority-2 onboarded (8) — 2026-08-18

| Product | Slug | Cluster | Overall |
| --- | --- | --- | ---: |
| Microsoft 365 Copilot | `microsoft-copilot` | llm-assistant | 8.2 |
| Perplexity | `perplexity` | llm-assistant | 8.3 |
| GitHub Copilot | `github-copilot` | ai-code | 8.3 |
| Cursor | `cursor` | ai-code | **8.4** (award) |
| Midjourney | `midjourney` | ai-image | **8.3** (award) |
| Adobe Firefly | `adobe-firefly` | ai-image | 8.1 |
| Runway | `runway` | ai-video | **7.7** (award) |
| Otter.ai | `otter-ai` | ai-meeting | **8.0** (award) |

See [`ai-it-priority2-onboarding-2026-08-18.md`](./ai-it-priority2-onboarding-2026-08-18.md).

## Priority-3 onboarded (2) — 2026-08-18

| Product | Slug | Cluster | Overall |
| --- | --- | --- | ---: |
| Synthesia | `synthesia` | ai-video | **8.0** (award) |
| Fireflies.ai | `fireflies` | ai-meeting | **8.2** (award) |

See [`ai-it-priority3-onboarding-2026-08-18.md`](./ai-it-priority3-onboarding-2026-08-18.md). Runway **7.7** remains the generative-filmmaking peer; Otter.ai **8.0** remains the meeting-notes peer.

## AI automation overlay onboarded (2) — 2026-08-18

| Product | Slug | Cluster | Overall |
| --- | --- | --- | ---: |
| Zapier | `zapier` | ai-automation | **8.1** (award) |
| n8n | `n8n` | ai-automation | 8.0 |

See [`hosting-automation-overlay-onboarding-2026-08-18.md`](./hosting-automation-overlay-onboarding-2026-08-18.md). Not ChatGPT or MindStudio peers.

---

## Catalogue affiliate — deferred / excluded

| Name | Reason |
| --- | --- |
| Rank Prompt | Ambiguous SEO-tool vs LLM positioning |
| Emergent | Low public product signal |
| AI InteleKt | Naming / scope unclear |

---

## Priority remaining (no affiliate required)

| Cluster | Names still expected |
| --- | --- |
| llm-assistant | Meta AI (consumer — likely skip) |
| ai-image | DALL·E standalone (covered via ChatGPT) |
| ai-video | **Synthesia — onboarded** |
| ai-meeting | **Fireflies.ai — onboarded** |
| ai-agents | — |
| ai-automation | **Zapier / n8n — onboarded** |

---

## Content deliverables status

| Artifact | Status |
| --- | --- |
| Category seed + activation | Done (v1.2.0; automation slugs in `seedProductSlugs`) |
| Research + editorial | Done (Wave-1 + P2 + P3 + automation overlay) |
| Best page (`best-ai-software`) | Done (Zapier ai-automation award) |
| Comparisons | Done (incl. Zapier vs n8n; landscape vs MindStudio) |
| Use cases + features taxonomy | Done (incl. `ai-automation` / `workflow-automation`) |
| Hub heroes | Done |
| CORE guides (5) | **Done** (what-is copy names automation overlay) |
| Product-guide builders | **Done** (18 primaries × 5 kinds incl. Zapier / n8n) |
| Official YouTube embeds | **Done** (QuillBot / MindStudio / ScraperAPI: no vendor-channel match) |
| Per-product overview PNGs | **Done** |
