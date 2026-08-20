# Supporting-content agents

Planning agents that make supporting knowledge a first-class, reusable capability for every onboarded category and product. **Guide writing stays on GuideAgent.**

## Architecture

```text
Category Onboarding
  → category-knowledge-planner-agent
  → supporting topic candidates
  → supporting-content-planner-agent (page/section/reject)
  → (optional) GuideAgent via supporting-content / single-content workflow
  → QA → approval → publish

Software Onboarding
  → product-knowledge-planner-agent (optional)
  → supporting-content-planner-agent
  → (optional) GuideAgent
```

## Agents

| Agent | Role |
| --- | --- |
| `category-knowledge-planner-agent` | Category knowledge areas, CORE/SECONDARY topics, gaps, anchor coverage |
| `product-knowledge-planner-agent` | Whether product guides are justified; reject pricing/review duplication |
| `supporting-content-planner-agent` | NEW_PAGE / ADD_SECTION / EXPAND / REJECT / MANUAL_REVIEW |
| `guide-agent` | Writes educational drafts only after acceptance |

Services (MCP/Claude-ready):

```ts
planCategoryKnowledge(categoryId)
planProductKnowledge(productId)
evaluateSupportingTopic(candidate)
createSupportingContentWorkflow({ supportingTopicId })
resolveAgentForIntent({ query })
```

## Decisions

| Recommendation | Workflow |
| --- | --- |
| NEW_PAGE | `guide-agent` |
| ADD_SECTION / EXPAND | `refresh-agent` (no new URL) |
| REJECT | no agent task |
| MANUAL_REVIEW | stop for humans |

Affiliate commission **never** drives eligibility.

## CLI

```bash
npm run knowledge:plan -- category crm
npm run knowledge:plan -- product pipedrive
npm run knowledge:gaps -- category crm
npm run knowledge:support -- content:best:crm-software
npm run knowledge:candidates -- category crm
npm run knowledge:candidate -- candidate:crm-how-to-choose
npm run knowledge:workflow -- candidate:crm-pricing-explained --category crm --dry-run
npm run knowledge:core-plan -- --category crm
npm run knowledge:route -- --query "how much does crm cost"
npm run knowledge:audit -- crm
npm run knowledge:validate
```

## Onboarding

Category `content-model` stage runs CategoryKnowledgePlanner and stores the plan. **Guides are not executed.**

Software `content-mapping` may attach optional `guide` page candidates. Product onboarding completeness does **not** require them.

## Workflow

`supporting-content:v1` — topic validation → research readiness → GuideAgent → optional internal links → approval → pre-publish. Stops at approval.

## Operating policy

- Complete a category: plan all areas; execute **CORE** NEW_PAGE topics only when chosen.
- Secondary/optional stay in backlog unless SEO/journey evidence raises priority.
- New tools/features → replan; do not recreate rejected topics blindly.
