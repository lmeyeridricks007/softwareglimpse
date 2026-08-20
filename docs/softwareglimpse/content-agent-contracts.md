# Content agent contracts (v1)

Concise per-agent contracts. Full docs: `docs/softwareglimpse/content-agents.md`.

## software-review-agent@1.0.0

- Intent: evaluate one product
- Blocks: no methodology, no assessment, no approved facts
- Output: summary, verdict, best/not ideal, pricing overview, features, alternatives, methodology, FAQ
- Prohibits: invented testing/pricing/customers/ratings; affiliate ranking bias

## pricing-page-agent@1.0.0

- Intent: understand cost
- Blocks: unverified / critically stale / unsupported pricing / insufficient plans
- Does not calculate — consumes pricing engine examples only

## comparison-agent@1.0.0

- Intent: decide between products
- Blocks: unapproved relationship, inactive methodology
- Outcome may be A | B | tie | depends — never force a winner

## alternatives-agent@1.0.0

- Requires approved `alternative-to` relationships with reasons
- Same-category alone is insufficient

## best-software-agent@1.0.0

- Explains approved ranking inputs — must not reorder or invent Best Overall
- Methodology + minimum eligible products required

## category-hub-agent@1.0.0

- Decision/navigation hub — not a long essay
- Link only publishable children

## use-case-page-agent@1.0.0

- Audience-specific fit — not a keyword-swapped best page

## guide-agent@1.0.0

- Learn/solve intent — structured **content blocks** by topic type (`GUIDE_BLOCK_RECIPES`)
- **Must reuse** `softwareglimpse-guide-template-v1` (`src/components/guides/guide-template.ts` + `.sg-guide-*` CSS)
- Prefer decision frameworks, matrices, scorecards, trial plans over thin H2 essays
- **Unique visuals required:** set `heroVisual` per slug; add `figure` on steps/matrices or `type: "figure"` blocks under `public/guides/{slug}-*.png` — never reuse another guide’s artwork
- Hub covers use that `heroVisual` (`GuideCover`) — not shared topic placeholders when a hero exists
- Follow `GUIDE_VISUAL_APPROACH`: full-image natural-aspect framing (no cover/zoom clipping); gentle PNG edge crops only; adaptive scenario/card grids by item count
- Fundamentals: educational diagrams (definition / how-it-works / stages) — not the selection-framework hero
- Selection guides: Quick Answer in hero `belowCta`; pastel multi-color icon chips; TipCallout; filled native + generated visuals
- Soft-publish with `seo.indexable: false` until editorial gate; `publishedAt` ≤ now
- Sidebar chrome: numbered TOC, solid Finder CTA, tools, related, newsletter
- Never invent catalogue products; funnel to Finder / Best / Calculator via `/go` CTAs
- Minimal commercial CTAs; affiliate status never sets order

## internal-link-agent@1.0.0

- Deterministic relationship resolution; no draft/scheduled targets

## refresh-agent@1.0.0

- Change-event driven; targeted sections; never auto-publish
- Always includes **Check official media health** (`official-media-health` section)
- Flags unavailable / stale / non-official media without deleting research history

## qa-agent@1.0.0

- Typed blockers/warnings/suggestions — invoke via `agent:qa`
