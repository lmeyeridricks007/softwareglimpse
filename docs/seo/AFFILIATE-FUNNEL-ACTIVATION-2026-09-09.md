# Affiliate conversion & revenue activation

**Date:** 2026-09-09  
**Goal:** Move commercial funnel from clicks-only toward REAL conversions/commission/revenue where network exports allow — without inventing attribution.

## Current state (honest)

| Signal | State | Notes |
|---|---|---|
| Affiliate clicks | REAL (first-party) when beacon/go writes `data/analytics/affiliate-clicks.json` | Path + host only; `trackingId` defaults to click `id` for SubId join |
| Conversions | NOT_CONNECTED until a real network export is imported | Never show `0` while NOT_CONNECTED |
| Commission / order revenue | NOT_CONNECTED / PARTIAL until complete amount columns exist | Never show `$0` when amounts are missing |

## How to connect

1. Export conversions from Impact / CJ / ShareASale / PartnerStack (CSV or JSON).
2. Drop under `data/analytics/imports/{impact,cj,shareasale,partnerstack}/` (see README there).
3. Run:
   - `npm run analytics:affiliate-conversions -- --discover`
   - `npm run seo:growth-dashboard`
4. Dashboard commercial section shows: clicks, matched conversions, conversion rate, commission, revenue (if provided), top converting source pages, top products, unmatched conversion count.

## Join policy

- Match **only** when network `clickId` / SubId equals a retained first-party click `id` or `trackingId`.
- No fuzzy product/date matching. Unmatched rows stay unmatched.

## Validity

- **REAL** — connected store from a non-fixture source, fresh enough, money complete when claimed.
- **PARTIAL** — clicks without conversions, or conversions with incomplete money coverage.
- **NOT_CONNECTED** — no network source; do not display zeros.
- **STALE** — connected but older than ~45 days.
