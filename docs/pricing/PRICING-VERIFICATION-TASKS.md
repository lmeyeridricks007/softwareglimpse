# Pricing verification tasks

Updated: 2026-09-10T10:34:44.088Z

REQUIRES_REVIEW / LIKELY pricing changes stay unpublished until confirmed.

Unverified changes must **not** be published as pricing facts.

Pending: **1**

## monday sales CRM — `0a8b1a7c3d42cd08`

- **Status:** pending (publish blocked)
- **Confidence:** `REQUIRES_REVIEW`
- **Kind:** `new_plan`
- **Source:** catalogue enrichment pricing (`src/data/research/monday-sales-crm/enrichment.json`)
- **Source IDs:** monday-pricing
- **Source verifiedAt:** 2026-09-07T22:41:11.578Z
- **Difference:** monday sales CRM: new plan detected in catalogue (Ultimate)
- **Notes:** Structural / high-impact change (new_plan) requires human verification before public claims

### Current stored pricing (observations)
- Basic (`plan-basic`): 12 EUR
- Standard (`plan-standard`): 17 EUR
- Pro (`plan-pro`): 28 EUR

### Detected pricing (catalogue)
- Basic (`plan-basic`): 18 EUR
- Standard (`plan-standard`): 25 EUR
- Pro (`plan-pro`): 41 EUR
- Ultimate (`plan-ultimate`): — EUR ← affected

### Affected plans
- Ultimate (`plan-ultimate`) — `new_plan`

### Affected pages (refresh order)
- tier 2: `/pricing/monday-sales-crm/` (pricing)
- tier 3: `/software/monday-sales-crm/` (software-review)
- tier 4: `/tools/crm-cost-calculator/` (tool)
- tier 5: `/compare/act-vs-monday-sales-crm/` (comparison)
- tier 5: `/compare/affinity-vs-monday-sales-crm/` (comparison)
- tier 5: `/compare/agile-crm-vs-monday-sales-crm/` (comparison)
- tier 5: `/compare/apptivo-vs-monday-sales-crm/` (comparison)
- tier 5: `/compare/attio-vs-monday-sales-crm/` (comparison)
- tier 5: `/compare/bitrix24-vs-monday-sales-crm/` (comparison)
- tier 5: `/compare/capsule-vs-monday-sales-crm/` (comparison)
- tier 5: `/compare/close-vs-monday-sales-crm/` (comparison)
- tier 5: `/compare/cloze-vs-monday-sales-crm/` (comparison)
- tier 5: `/compare/copper-vs-monday-sales-crm/` (comparison)
- tier 5: `/compare/creatio-vs-monday-sales-crm/` (comparison)
- tier 5: `/compare/dynamics-365-vs-monday-sales-crm/` (comparison)
- tier 5: `/compare/folk-vs-monday-sales-crm/` (comparison)
- tier 5: `/compare/freshsales-vs-monday-sales-crm/` (comparison)
- tier 5: `/compare/hubspot-vs-monday-sales-crm/` (comparison)
- tier 5: `/compare/insightly-vs-monday-sales-crm/` (comparison)
- tier 5: `/compare/keap-vs-monday-sales-crm/` (comparison)
- tier 5: `/compare/mailchimp-vs-monday-sales-crm/` (comparison)
- tier 5: `/compare/monday-sales-crm-vs-netsuite/` (comparison)
- tier 5: `/compare/monday-sales-crm-vs-nimble/` (comparison)
- tier 5: `/compare/monday-sales-crm-vs-nutshell/` (comparison)
- tier 5: `/compare/monday-sales-crm-vs-oracle-cx/` (comparison)
- tier 5: `/compare/monday-sales-crm-vs-pardot/` (comparison)
- tier 5: `/compare/monday-sales-crm-vs-pega/` (comparison)
- tier 5: `/compare/monday-sales-crm-vs-pipedrive/` (comparison)
- tier 5: `/compare/monday-sales-crm-vs-pipelinepro/` (comparison)
- tier 5: `/compare/monday-sales-crm-vs-podio/` (comparison)
- tier 5: `/compare/monday-sales-crm-vs-salesflare/` (comparison)
- tier 5: `/compare/monday-sales-crm-vs-salesforce/` (comparison)
- tier 5: `/compare/monday-sales-crm-vs-sap/` (comparison)
- tier 5: `/compare/monday-sales-crm-vs-siebel/` (comparison)
- tier 5: `/compare/monday-sales-crm-vs-streak/` (comparison)
- tier 5: `/compare/monday-sales-crm-vs-sugarcrm/` (comparison)
- tier 5: `/compare/monday-sales-crm-vs-wealthbox/` (comparison)
- tier 5: `/compare/monday-sales-crm-vs-zendesk/` (comparison)
- tier 5: `/compare/monday-sales-crm-vs-zoho-crm/` (comparison)
- tier 5: `/compare/monday-vs-monday-sales-crm/` (comparison)
- _…+14 more_

Confirm with: `npm run pricing:confirm -- --task 0a8b1a7c3d42cd08`

