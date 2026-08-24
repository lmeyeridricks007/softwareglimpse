# New product scheduling workflow

Example: onboard **Attio CRM** for publication **15 Sep 2026 08:00 Europe/Amsterdam**.

## 1. Onboard + schedule (single command)

```bash
npm run onboard:software -- attio \
  --category crm \
  --vendor Attio \
  --website https://attio.com \
  --publish-date 2026-09-15 \
  --publish-time 08:00 \
  --timezone Europe/Amsterdam \
  --skip-research
```

Or with a full instant:

```bash
npm run onboard:software -- attio --category crm \
  --publish-at 2026-09-15T08:00:00+02:00
```

If `--publish-time` is omitted with `--publish-date`, the configured default (`08:00` in `launch-defaults.ts`) is used and logged — not silently invented.

Optional staggered routes:

```bash
  --alternatives-at 2026-09-17T06:00:00.000Z \
  --comparisons-at 2026-09-20T06:00:00.000Z
```

## 2. What the agent does

1. Runs existing onboarding stages (research, taxonomy, content map, …)
2. **Does not publish live** — sets product candidate `metadata.status: scheduled`
3. Builds launch group `product-attio-2026-09`
4. Writes `docs/publishing/launches/attio-launch.md`
5. Runs `ScheduledContentAuditAgent`
6. Prints local preview command

## 3. Preview locally

```bash
npm run dev:preview -- --launch=attio
# or simply: npm run dev
```

Scheduled content appears across catalogue, search, and internal links in development only.

## 4. Legacy: onboard then schedule separately

```bash
npm run onboard:software -- attio --category crm --skip-research
npm run publishing -- schedule -- content:software:attio --at 2026-09-15T06:00:00.000Z
```

## 5. Validate before launch

```bash
npm run content:prepublish
```

## 6. Go live at scheduled time

```bash
npm run content:publish
```

---

_Previous step-by-step workflow (still valid):_

Via workflow agents (recommended):

```bash
npm run workflow:plan -- product-onboarding attio
npm run workflow:execute -- <plan-id>
```

Or stage manually: research → editorial → pricing → comparisons.

## 3. Schedule entities

Set on each publishable seed (or via publishing CLI):

```bash
npm run publishing -- schedule -- content:software:attio \
  --at 2026-09-15T06:00:00.000Z
```

UTC `06:00Z` = 08:00 CEST on that date.

Bundle example (same launch time):

| Entity | Content ID |
| --- | --- |
| Product | `content:software:attio` |
| Pricing | `content:pricing:attio` |
| Comparison | `content:compare:attio-vs-hubspot` |
| Guide | `content:guide:attio-implementation` |

Individual dates per entity are supported — each has its own `scheduledAt`.

## 4. Validate

```bash
npm run content:prepublish
npm run content:audit:scheduled
```

Fix **BLOCKED** dependency errors (e.g. comparison scheduled before a product).

## 5. Local preview

```bash
npm run dev
# or
npm run dev:preview -- --launch=attio
```

Verify:

- `/software/attio/` renders with **Scheduled** badge
- Appears in `/software/`, category, search
- Production build (`PREVIEW_MODE=public`) hides it

## 6. Go live

Automatic (when runner configured):

```bash
npm run content:publish
```

Updates status to `published`, sets `publishedAt`, triggers revalidation.

## 7. Post-publish check

```bash
npm run publishing -- audit:post-publish
```

Confirms sitemap/indexability for recently published URLs.

## Launch manifest

Generated to `docs/publishing/launches/attio-launch.md` when using launch tooling (`writeLaunchManifest`).

## Rules

- Never default onboarding to `published`
- `publish_now` requires explicit CLI / approved action
- Affiliate metadata never affects scheduling or rankings
