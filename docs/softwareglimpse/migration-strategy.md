# Migration strategy

## Goal

Preserve WordPress URL equity deliberately. Do not mass-redirect blindly or delete equity without a ledger entry.

## Ledger schema

`MigrationRecord` in `src/domain/schemas/migration.ts`  
Seed: `src/data/seed/migration.ts` (empty until inventory exists)

Fields:

- `source`, `sourceTitle`, `sourcePageType`
- `action`: `KEEP | REWRITE | REDIRECT | MERGE | REMOVE`
- `target`, `redirectType` (301/302/410)
- `canonical`, `contentDisposition`, `reason`, `newEquivalent`, `notes`

## Example

```json
{
  "id": "mig-freshsales-review",
  "source": "/freshsales-crm-review/",
  "sourceTitle": "Freshsales CRM Review",
  "sourcePageType": "review",
  "action": "REDIRECT",
  "target": "/software/freshsales/",
  "redirectType": 301,
  "contentDisposition": "rewrite",
  "reason": "Canonical product entity replaces standalone review URL"
}
```

## Process

1. Export WP URL inventory (path, title, type, traffic, backlinks).  
2. Classify each URL into a migration action.  
3. Prefer **REDIRECT → canonical entity/hub** over keeping WP IA.  
4. KEEP only if new IA truly matches and content is rewritten in place.  
5. MERGE thin overlapping posts into one strong page; 301 losers.  
6. REMOVE/410 only for zero-value spam/thin URLs after review.  
7. Generate Next redirects from the ledger (build step or config).  

## Phase 0

Structure + empty ledger only. No invented redirects.
