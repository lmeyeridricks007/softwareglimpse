# Affiliate launch batch — 4 Sep 2026

**Publish:** Thursday 4 September 2026, 08:00 Europe/Amsterdam (`2026-09-04T06:00:00.000Z`)

Combined launch for `ai-intelekt` and `webinarjam-everwebinar` (affiliate partners with approved editorial + research).

## What goes live

| Product | Category | Route(s) | Status until launch |
| --- | --- | --- | --- |
| AI InteleKt | ai | `/software/ai-intelekt/` + 5 guides + alts/comparisons | Production **404** |
| WebinarJam & EverWebinar | marketing | `/software/webinarjam-everwebinar/` + 5 guides + alts/comparisons | Production **404** |

## Editorial status

Both products have **approved** assessment + review JSON:

- `src/data/editorial/assessments/ai-intelekt.json` — `status: approved`
- `src/data/editorial/reviews/ai-intelekt.json` — `editorialStatus: approved`
- `src/data/editorial/assessments/webinarjam-everwebinar.json` — `status: approved`
- `src/data/editorial/reviews/webinarjam-everwebinar.json` — `editorialStatus: approved`

## Expected pricing blockers

| Slug | Pricing page | Reason |
| --- | --- | --- |
| `ai-intelekt` | blocked | Demo-led / custom quote — no public tier grid |
| `webinarjam-everwebinar` | blocked | Separate WebinarJam tiers + EverWebinar flat plans |

Software reviews, product guides, alternatives, and comparisons are scheduled for 4 Sep.

## Verify locally

```bash
npm run dev:public
npm run dev:as-of -- --date=2026-09-04T08:00:00+02:00
```

## Go live on schedule

```bash
npm run content:prepublish
npm run content:publish
```

## Config source of truth

`src/data/config/publishing/affiliate-launch-2026-09-04.ts`

Per-product launch reports:

- [ai-intelekt-launch.md](./ai-intelekt-launch.md)
- [webinarjam-everwebinar-launch.md](./webinarjam-everwebinar-launch.md)
