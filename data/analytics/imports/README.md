# Affiliate network import drop-folder

Drop **real** Impact / CJ / ShareASale / PartnerStack (or generic) CSV/JSON exports here.

```text
data/analytics/imports/
  impact/
  cj/
  shareasale/
  partnerstack/
```

## Rules

- Never drop fixtures, samples, mocks, or synthetic files (filenames containing `sample`, `fixture`, `test`, etc. are rejected).
- Prefer exports that include a **click / SubId** column when you need matched conversions.
- Missing commission or sale amounts stay **null** — we never coerce to `$0`.
- Personal data: strip emails, names, and IPs before dropping files. Path + host only on our click side.

## Import

```bash
npm run analytics:affiliate-conversions -- --ensure
npm run analytics:affiliate-conversions -- --discover
# or
npm run analytics:affiliate-conversions -- --import data/analytics/imports/impact/actions.csv
npm run seo:growth-dashboard
```

Validity states: `REAL` | `PARTIAL` | `NOT_CONNECTED` | `STALE`.

Do **not** display `0` conversions or `$0` revenue while the store is `NOT_CONNECTED`.
