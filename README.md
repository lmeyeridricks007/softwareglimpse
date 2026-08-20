# SoftwareGlimpse

Software decision platform rebuild for [softwareglimpse.com](https://www.softwareglimpse.com/).

> Which software should I choose?

## Stack

- Next.js (App Router) + TypeScript + React
- Zod domain schemas
- Repository-based content (no CMS yet)
- Tailwind CSS v4 + design tokens
- Vitest

## Docs

Architecture source of truth: [`docs/softwareglimpse/`](./docs/softwareglimpse/README.md)

## Develop

```bash
npm install
npm run dev
```

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

## Phase 0 scope

Foundation only: schemas, taxonomy, CRM seed identities, data access, route shells, SEO helpers, nav, Pipedrive slice, architecture tests.
