# Search Performance — SoftwareGlimpse

**Generated:** 2026-08-19T05:10:06.186Z
**Source mode:** none
**Live / approved import:** no
**Synthetic:** no

> Consumes approved Search Console–shaped data (live GSC connector, import, or labeled fixtures). Does **not** scrape GSC. Does **not** invent credentials.

## Methodology — average position

- Average position (GSC) is an impression-weighted average across the reporting period — not a fixed SERP rank.
- A URL can appear at different ranks for the same query on different days/devices; the metric blends those appearances.
- Do not treat position 8.4 as “always rank #8.” Use it as a relative traction/near-win signal only.
- Site Intelligence never converts average position into a “% chance to rank.”

\* Avg pos columns use GSC average position for the period.

## Disclaimers

- Does not scrape Google Search Console HTML.
- Does not invent credentials or fabricate live GSC rows.
- Fixture/synthetic snapshots must not be claimed as live SoftwareGlimpse GSC.

## Notes

- No live/import snapshot in store
- Using synthetic fixture synthetic-28d-current.json — not live SoftwareGlimpse GSC
- GSC not configured (set GSC_PROPERTY_URL + GSC_CLIENT_EMAIL or GOOGLE_APPLICATION_CREDENTIALS)
- No search-performance snapshot available — visibility DATA NOT AVAILABLE

## Status

DATA NOT AVAILABLE — no search-performance snapshot. Configure GSC, import an approved export, or run with `--fixture` for synthetic pipeline tests.

```bash
npm run site:search-performance -- --fixture
npm run site:search-performance -- --import path/to/gsc-export.json
```
