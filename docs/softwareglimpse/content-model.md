# Content model

Different page types get purpose-specific schemas. Do **not** collapse everything into a generic Article.

## Page types

| Type | Primary entity refs | Purpose |
| --- | --- | --- |
| Software profile | `Software` | Canonical product page |
| Category hub | `Category` | Browse + explain category |
| Industry hub | `Industry` | Vertical software decisions |
| Audience hub (`/for/`) | use-case / business-size tags | Segmented discovery |
| Review | `Software` + editorial body | Deep evaluation (future) |
| Best | category + audience + ranked software | Methodology-backed list |
| Comparison | `Comparison` (≥2 products) | Criterion winners + scenarios |
| Alternatives | seed software + alternative refs | Fit-based substitutes |
| Pricing | `Software.pricing` | Plans, assumptions, examples |
| Guide | freeform + entity links | Education |
| Tool | criteria → engine | Interactive Decide |

## Comparison requirements

A comparison must understand:

- product slugs compared
- criteria (+ optional weights)
- winner per criterion (nullable)
- recommendation scenarios (“choose A if…”)

Schema: `ComparisonSchema`.

## Best-page requirements

A best page must understand:

- category / audience scope
- eligibility rules
- methodology notes
- ranked recommendations with “why selected”

(Schema to be added in Phase 2 — do not ship thin stubs.)

## Pricing-page requirements

- product ref
- plans + typed rules
- assumptions (seats, billing interval)
- additional costs / caveats
- worked examples

## Body content storage (Phase 0 → later)

Phase 0: entity JSON/TS seeds only.  
Later: MDX or structured blocks keyed by entity id, still validated by schema.  
CMS: swap `src/data/repositories/*` only.

## Quality gate before index

Content is indexable only if it satisfies IA quality rules (see `seo-architecture.md`) — not merely because a route exists.
