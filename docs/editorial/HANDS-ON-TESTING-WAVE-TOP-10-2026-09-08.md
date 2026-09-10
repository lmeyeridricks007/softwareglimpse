# Hands-on testing wave — top 10 (2026-09-08)

Human tester only. **AI must never mark tasks complete or fabricate observations.**
HANDS_ON_TESTED is assigned only after a completed human session with all required tasks recorded and strengths/weaknesses filled.

## Workspace

1. Open `/dev/product-testing/?secret=$TESTING_SECRET`
2. Pick a product from the **Top 10 queue** panel (or use a prepared draft session)
3. **Start test** → work through protocol checklist → upload screenshots → save notes
4. Record task result: PASS / PARTIAL / FAIL / NOT_AVAILABLE / NOT_APPLICABLE (never leave required tasks NOT_STARTED)
5. Capture friction, strengths, weaknesses → **Finish test (human only)**

No task auto-passes. Incomplete/abandoned sessions stay private.

## Selection criteria

REAL GSC demand · affiliate value · dependent comparisons · category importance · evidence gap.

| Rank | Product | Category | Protocol | Evidence now | GSC imp | Comps | Affiliate | Dependents |
| ---: | --- | --- | --- | --- | ---: | ---: | --- | ---: |
| 1 | [HubSpot](/software/hubspot/) | crm | `crm-hands-on` | data_verified | 1340 | 48 | yes | 91 |
| 2 | [Capsule](/software/capsule/) | crm | `crm-hands-on` | data_verified | 431 | 36 | yes | 49 |
| 3 | [Keap](/software/keap/) | crm | `crm-hands-on` | data_verified | 567 | 36 | yes | 44 |
| 4 | [Insightly](/software/insightly/) | crm | `crm-hands-on` | researched | 938 | 36 | no | 41 |
| 5 | [Closely](/software/closely/) | sales-intelligence | `sales-intelligence-hands-on` | data_verified | 360 | 28 | yes | 37 |
| 6 | [GetResponse](/software/getresponse/) | email-marketing | `email-marketing-hands-on` | data_verified | 866 | 23 | yes | 49 |
| 7 | [Nimble](/software/nimble/) | crm | `crm-hands-on` | data_verified | 302 | 36 | no | 42 |
| 8 | [ActiveCampaign](/software/activecampaign/) | email-marketing | `email-marketing-hands-on` | data_verified | 1019 | 24 | yes | 48 |
| 9 | [Salesforce](/software/salesforce/) | crm | `crm-hands-on` | data_verified | 264 | 37 | no | 58 |
| 10 | [Freshsales](/software/freshsales/) | crm | `crm-hands-on` | data_verified | 193 | 36 | yes | 54 |

## Per-product packs

### 1. HubSpot (`hubspot`)

Protocol: **crm-hands-on** · Evidence today: **data_verified** · Draft session: test-mtt7i809-7enhhr

**Test objectives**
- Complete onboarding through first useful pipeline view
- Create contact, company, deal and move stages
- Configure one automation and one report
- Exercise search, admin, support paths, and pricing verify

**Account / signup requirements**
- Business email for trial signup
- Prefer plan that includes pipeline + automation (or note gates)
- Optional second user for permissions (else NOT_AVAILABLE)
- Sandbox/test data only — no production customer PII

**Workflows**
- Create account → onboarding
- Import sample contacts
- Create company → link contact
- Create/customize pipeline → create deal → move stages
- Simple automation
- Report/dashboard
- Email/integration if plan allows
- Search → permissions/mobile if available
- Admin settings → help/support
- Setup friction notes → verify pricing

**Pricing checks**
- Trial plan name vs public pricing tiers
- Seat limits, contact limits, automation gates
- Add-on / phone support friction
- In-app billing labels vs softwareglimpse pricing facts

**Important claims to verify**
- Ease of setup for SMB sales teams
- Pipeline UX and deal management clarity
- Automation usefulness on the tested plan
- Reporting quality
- Integration / email sync claims

**Comparison questions**
- Vs HubSpot/Pipedrive-class peers: setup speed
- Vs spreadsheet/email-only: when is this worth paying for?
- Would you recommend for a 3–15 person sales team on this plan?

**Screenshots required**
- Signup / onboarding step
- Contact list or import result
- Company record
- Pipeline board with deal
- Automation builder
- Report/dashboard
- Admin/settings
- Public pricing + in-app plan

**Strength prompts**
- What was surprisingly easy after signup?
- Which CRM workflow felt production-ready?

**Weakness / friction prompts**
- Where did onboarding or pipeline UX create friction?
- What important feature was missing, gated, or confusing?

**Pages that may use hands-on evidence after genuine completion** (91) — do **not** rewrite until the human test exists:
- alternatives: 39
- best: 1
- comparison: 48
- pricing: 1
- software-review: 1
- tool: 1
- Full list: `data/editorial/testing/packs/2026-09-08/top-10.json` → `hubspot`

### 2. Capsule (`capsule`)

Protocol: **crm-hands-on** · Evidence today: **data_verified** · Draft session: test-mtt7i80c-t4o68n

**Test objectives**
- Complete onboarding through first useful pipeline view
- Create contact, company, deal and move stages
- Configure one automation and one report
- Exercise search, admin, support paths, and pricing verify

**Account / signup requirements**
- Business email for trial signup
- Prefer plan that includes pipeline + automation (or note gates)
- Optional second user for permissions (else NOT_AVAILABLE)
- Sandbox/test data only — no production customer PII

**Workflows**
- Create account → onboarding
- Import sample contacts
- Create company → link contact
- Create/customize pipeline → create deal → move stages
- Simple automation
- Report/dashboard
- Email/integration if plan allows
- Search → permissions/mobile if available
- Admin settings → help/support
- Setup friction notes → verify pricing

**Pricing checks**
- Trial plan name vs public pricing tiers
- Seat limits, contact limits, automation gates
- Add-on / phone support friction
- In-app billing labels vs softwareglimpse pricing facts

**Important claims to verify**
- Ease of setup for SMB sales teams
- Pipeline UX and deal management clarity
- Automation usefulness on the tested plan
- Reporting quality
- Integration / email sync claims

**Comparison questions**
- Vs HubSpot/Pipedrive-class peers: setup speed
- Vs spreadsheet/email-only: when is this worth paying for?
- Would you recommend for a 3–15 person sales team on this plan?

**Screenshots required**
- Signup / onboarding step
- Contact list or import result
- Company record
- Pipeline board with deal
- Automation builder
- Report/dashboard
- Admin/settings
- Public pricing + in-app plan

**Strength prompts**
- What was surprisingly easy after signup?
- Which CRM workflow felt production-ready?

**Weakness / friction prompts**
- Where did onboarding or pipeline UX create friction?
- What important feature was missing, gated, or confusing?

**Pages that may use hands-on evidence after genuine completion** (49) — do **not** rewrite until the human test exists:
- alternatives: 9
- best: 1
- comparison: 36
- pricing: 1
- software-review: 1
- tool: 1
- Full list: `data/editorial/testing/packs/2026-09-08/top-10.json` → `capsule`

### 3. Keap (`keap`)

Protocol: **crm-hands-on** · Evidence today: **data_verified** · Draft session: test-mtt7i80e-8rkeml

**Test objectives**
- Complete onboarding through first useful pipeline view
- Create contact, company, deal and move stages
- Configure one automation and one report
- Exercise search, admin, support paths, and pricing verify

**Account / signup requirements**
- Business email for trial signup
- Prefer plan that includes pipeline + automation (or note gates)
- Optional second user for permissions (else NOT_AVAILABLE)
- Sandbox/test data only — no production customer PII

**Workflows**
- Create account → onboarding
- Import sample contacts
- Create company → link contact
- Create/customize pipeline → create deal → move stages
- Simple automation
- Report/dashboard
- Email/integration if plan allows
- Search → permissions/mobile if available
- Admin settings → help/support
- Setup friction notes → verify pricing

**Pricing checks**
- Trial plan name vs public pricing tiers
- Seat limits, contact limits, automation gates
- Add-on / phone support friction
- In-app billing labels vs softwareglimpse pricing facts

**Important claims to verify**
- Ease of setup for SMB sales teams
- Pipeline UX and deal management clarity
- Automation usefulness on the tested plan
- Reporting quality
- Integration / email sync claims

**Comparison questions**
- Vs HubSpot/Pipedrive-class peers: setup speed
- Vs spreadsheet/email-only: when is this worth paying for?
- Would you recommend for a 3–15 person sales team on this plan?

**Screenshots required**
- Signup / onboarding step
- Contact list or import result
- Company record
- Pipeline board with deal
- Automation builder
- Report/dashboard
- Admin/settings
- Public pricing + in-app plan

**Strength prompts**
- What was surprisingly easy after signup?
- Which CRM workflow felt production-ready?

**Weakness / friction prompts**
- Where did onboarding or pipeline UX create friction?
- What important feature was missing, gated, or confusing?

**Pages that may use hands-on evidence after genuine completion** (44) — do **not** rewrite until the human test exists:
- alternatives: 4
- best: 1
- comparison: 36
- pricing: 1
- software-review: 1
- tool: 1
- Full list: `data/editorial/testing/packs/2026-09-08/top-10.json` → `keap`

### 4. Insightly (`insightly`)

Protocol: **crm-hands-on** · Evidence today: **researched** · Draft session: test-mtt7i80g-yxrx4s

**Test objectives**
- Complete onboarding through first useful pipeline view
- Create contact, company, deal and move stages
- Configure one automation and one report
- Exercise search, admin, support paths, and pricing verify

**Account / signup requirements**
- Business email for trial signup
- Prefer plan that includes pipeline + automation (or note gates)
- Optional second user for permissions (else NOT_AVAILABLE)
- Sandbox/test data only — no production customer PII

**Workflows**
- Create account → onboarding
- Import sample contacts
- Create company → link contact
- Create/customize pipeline → create deal → move stages
- Simple automation
- Report/dashboard
- Email/integration if plan allows
- Search → permissions/mobile if available
- Admin settings → help/support
- Setup friction notes → verify pricing

**Pricing checks**
- Trial plan name vs public pricing tiers
- Seat limits, contact limits, automation gates
- Add-on / phone support friction
- In-app billing labels vs softwareglimpse pricing facts

**Important claims to verify**
- Ease of setup for SMB sales teams
- Pipeline UX and deal management clarity
- Automation usefulness on the tested plan
- Reporting quality
- Integration / email sync claims

**Comparison questions**
- Vs HubSpot/Pipedrive-class peers: setup speed
- Vs spreadsheet/email-only: when is this worth paying for?
- Would you recommend for a 3–15 person sales team on this plan?

**Screenshots required**
- Signup / onboarding step
- Contact list or import result
- Company record
- Pipeline board with deal
- Automation builder
- Report/dashboard
- Admin/settings
- Public pricing + in-app plan

**Strength prompts**
- What was surprisingly easy after signup?
- Which CRM workflow felt production-ready?

**Weakness / friction prompts**
- Where did onboarding or pipeline UX create friction?
- What important feature was missing, gated, or confusing?

**Pages that may use hands-on evidence after genuine completion** (41) — do **not** rewrite until the human test exists:
- alternatives: 1
- best: 1
- comparison: 36
- pricing: 1
- software-review: 1
- tool: 1
- Full list: `data/editorial/testing/packs/2026-09-08/top-10.json` → `insightly`

### 5. Closely (`closely`)

Protocol: **sales-intelligence-hands-on** · Evidence today: **data_verified** · Draft session: test-mtt7i80h-34za3x

**Test objectives**
- Confirm search → enrich → list workflow on trial credits
- Inspect credit consumption and CRM/export paths
- Evaluate browser extension / overlay if offered
- Align in-app plan/credits with public pricing

**Account / signup requirements**
- Work email; LinkedIn account if extension required
- Trial with enough credits for 1–3 enrichments
- Do not spam or message real prospects during the test
- Use public/demo profiles only for overlay checks

**Workflows**
- Create account → onboarding
- People search with filters
- Company search + profile
- Enrich one test contact (credit use)
- Save list / draft sequence (no live send)
- CRM sync or CSV export
- Extension overlay if available
- Credits meter + help + pricing

**Pricing checks**
- Seat vs credit model clarity
- What actions consume credits
- Trial limits vs paid plan labels
- Public pricing page match

**Important claims to verify**
- Data accuracy of revealed emails/phones (spot-check)
- Filter quality for ICP search
- CRM export reliability
- Ease of getting a usable lead list

**Comparison questions**
- Vs other SI tools: credit fairness and UI clarity
- Vs CRM native prospecting: data depth
- Would you buy for an SDR team of 3–10?

**Screenshots required**
- People search results
- Company profile
- Enrichment / credit spend confirmation
- List or sequence builder
- Credits/usage meter
- Pricing page + in-app plan

**Strength prompts**
- What search/filter combo produced useful leads fastest?
- What felt trustworthy about data quality?

**Weakness / friction prompts**
- Where did credits or paywalls block evaluation?
- What data looked stale, wrong, or hard to verify?

**Pages that may use hands-on evidence after genuine completion** (37) — do **not** rewrite until the human test exists:
- alternatives: 5
- best: 1
- comparison: 28
- pricing: 1
- software-review: 1
- tool: 1
- Full list: `data/editorial/testing/packs/2026-09-08/top-10.json` → `closely`

### 6. GetResponse (`getresponse`)

Protocol: **email-marketing-hands-on** · Evidence today: **data_verified** · Draft session: test-mtt7i80j-554jd1

**Test objectives**
- Confirm time-to-first useful campaign draft on the trial plan
- Verify list import / contact profile quality
- Exercise one automation and reporting path
- Check deliverability settings and public pricing alignment

**Account / signup requirements**
- Company email preferred (avoid disposable if blocked)
- Trial plan with automation access if possible
- Optional: spare domain or subdomain for auth settings inspection
- Do not send campaigns to real customers during the test

**Workflows**
- Create account → onboarding
- Import/create list → inspect contact
- Draft campaign → editor/mobile preview
- Simple automation
- Form/landing if plan allows
- Analytics + integration catalog
- Deliverability settings
- Help/support + pricing verify

**Pricing checks**
- In-app plan name vs public pricing page
- Contact/subscriber tier limits shown in billing
- Automation / landing feature gated to higher tiers?
- Trial length and card-required friction

**Important claims to verify**
- Ease of building first campaign
- Automation builder clarity
- Reporting usefulness for SMB marketers
- Integration breadth claims on marketing site

**Comparison questions**
- Vs peer email tools: editor speed and template quality
- Vs CRM-bundled email: depth of automation
- Would you recommend for a 5–20 person marketing team?

**Screenshots required**
- Signup / plan chooser
- List import or audience screen
- Campaign editor (desktop)
- Automation canvas
- Analytics/report
- Public pricing + in-app billing (side by side)

**Strength prompts**
- What felt faster or clearer than expected?
- Which workflow would you trust for a live send?

**Weakness / friction prompts**
- Where did you get stuck or confuse terminology?
- What feature felt gated, incomplete, or misleading vs marketing claims?

**Pages that may use hands-on evidence after genuine completion** (49) — do **not** rewrite until the human test exists:
- alternatives: 22
- best: 1
- comparison: 23
- pricing: 1
- software-review: 1
- tool: 1
- Full list: `data/editorial/testing/packs/2026-09-08/top-10.json` → `getresponse`

### 7. Nimble (`nimble`)

Protocol: **crm-hands-on** · Evidence today: **data_verified** · Draft session: test-mtt7i80m-wcrfqc

**Test objectives**
- Complete onboarding through first useful pipeline view
- Create contact, company, deal and move stages
- Configure one automation and one report
- Exercise search, admin, support paths, and pricing verify

**Account / signup requirements**
- Business email for trial signup
- Prefer plan that includes pipeline + automation (or note gates)
- Optional second user for permissions (else NOT_AVAILABLE)
- Sandbox/test data only — no production customer PII

**Workflows**
- Create account → onboarding
- Import sample contacts
- Create company → link contact
- Create/customize pipeline → create deal → move stages
- Simple automation
- Report/dashboard
- Email/integration if plan allows
- Search → permissions/mobile if available
- Admin settings → help/support
- Setup friction notes → verify pricing

**Pricing checks**
- Trial plan name vs public pricing tiers
- Seat limits, contact limits, automation gates
- Add-on / phone support friction
- In-app billing labels vs softwareglimpse pricing facts

**Important claims to verify**
- Ease of setup for SMB sales teams
- Pipeline UX and deal management clarity
- Automation usefulness on the tested plan
- Reporting quality
- Integration / email sync claims

**Comparison questions**
- Vs HubSpot/Pipedrive-class peers: setup speed
- Vs spreadsheet/email-only: when is this worth paying for?
- Would you recommend for a 3–15 person sales team on this plan?

**Screenshots required**
- Signup / onboarding step
- Contact list or import result
- Company record
- Pipeline board with deal
- Automation builder
- Report/dashboard
- Admin/settings
- Public pricing + in-app plan

**Strength prompts**
- What was surprisingly easy after signup?
- Which CRM workflow felt production-ready?

**Weakness / friction prompts**
- Where did onboarding or pipeline UX create friction?
- What important feature was missing, gated, or confusing?

**Pages that may use hands-on evidence after genuine completion** (42) — do **not** rewrite until the human test exists:
- alternatives: 2
- best: 1
- comparison: 36
- pricing: 1
- software-review: 1
- tool: 1
- Full list: `data/editorial/testing/packs/2026-09-08/top-10.json` → `nimble`

### 8. ActiveCampaign (`activecampaign`)

Protocol: **email-marketing-hands-on** · Evidence today: **data_verified** · Draft session: test-mtt7i80s-7xgcnh

**Test objectives**
- Confirm time-to-first useful campaign draft on the trial plan
- Verify list import / contact profile quality
- Exercise one automation and reporting path
- Check deliverability settings and public pricing alignment

**Account / signup requirements**
- Company email preferred (avoid disposable if blocked)
- Trial plan with automation access if possible
- Optional: spare domain or subdomain for auth settings inspection
- Do not send campaigns to real customers during the test

**Workflows**
- Create account → onboarding
- Import/create list → inspect contact
- Draft campaign → editor/mobile preview
- Simple automation
- Form/landing if plan allows
- Analytics + integration catalog
- Deliverability settings
- Help/support + pricing verify

**Pricing checks**
- In-app plan name vs public pricing page
- Contact/subscriber tier limits shown in billing
- Automation / landing feature gated to higher tiers?
- Trial length and card-required friction

**Important claims to verify**
- Ease of building first campaign
- Automation builder clarity
- Reporting usefulness for SMB marketers
- Integration breadth claims on marketing site

**Comparison questions**
- Vs peer email tools: editor speed and template quality
- Vs CRM-bundled email: depth of automation
- Would you recommend for a 5–20 person marketing team?

**Screenshots required**
- Signup / plan chooser
- List import or audience screen
- Campaign editor (desktop)
- Automation canvas
- Analytics/report
- Public pricing + in-app billing (side by side)

**Strength prompts**
- What felt faster or clearer than expected?
- Which workflow would you trust for a live send?

**Weakness / friction prompts**
- Where did you get stuck or confuse terminology?
- What feature felt gated, incomplete, or misleading vs marketing claims?

**Pages that may use hands-on evidence after genuine completion** (48) — do **not** rewrite until the human test exists:
- alternatives: 19
- best: 2
- comparison: 24
- pricing: 1
- software-review: 1
- tool: 1
- Full list: `data/editorial/testing/packs/2026-09-08/top-10.json` → `activecampaign`

### 9. Salesforce (`salesforce`)

Protocol: **crm-hands-on** · Evidence today: **data_verified** · Draft session: test-mtt7i80v-1jzdlj

**Test objectives**
- Complete onboarding through first useful pipeline view
- Create contact, company, deal and move stages
- Configure one automation and one report
- Exercise search, admin, support paths, and pricing verify

**Account / signup requirements**
- Business email for trial signup
- Prefer plan that includes pipeline + automation (or note gates)
- Optional second user for permissions (else NOT_AVAILABLE)
- Sandbox/test data only — no production customer PII

**Workflows**
- Create account → onboarding
- Import sample contacts
- Create company → link contact
- Create/customize pipeline → create deal → move stages
- Simple automation
- Report/dashboard
- Email/integration if plan allows
- Search → permissions/mobile if available
- Admin settings → help/support
- Setup friction notes → verify pricing

**Pricing checks**
- Trial plan name vs public pricing tiers
- Seat limits, contact limits, automation gates
- Add-on / phone support friction
- In-app billing labels vs softwareglimpse pricing facts

**Important claims to verify**
- Ease of setup for SMB sales teams
- Pipeline UX and deal management clarity
- Automation usefulness on the tested plan
- Reporting quality
- Integration / email sync claims

**Comparison questions**
- Vs HubSpot/Pipedrive-class peers: setup speed
- Vs spreadsheet/email-only: when is this worth paying for?
- Would you recommend for a 3–15 person sales team on this plan?

**Screenshots required**
- Signup / onboarding step
- Contact list or import result
- Company record
- Pipeline board with deal
- Automation builder
- Report/dashboard
- Admin/settings
- Public pricing + in-app plan

**Strength prompts**
- What was surprisingly easy after signup?
- Which CRM workflow felt production-ready?

**Weakness / friction prompts**
- Where did onboarding or pipeline UX create friction?
- What important feature was missing, gated, or confusing?

**Pages that may use hands-on evidence after genuine completion** (58) — do **not** rewrite until the human test exists:
- alternatives: 17
- best: 1
- comparison: 37
- pricing: 1
- software-review: 1
- tool: 1
- Full list: `data/editorial/testing/packs/2026-09-08/top-10.json` → `salesforce`

### 10. Freshsales (`freshsales`)

Protocol: **crm-hands-on** · Evidence today: **data_verified** · Draft session: test-mtt7i80x-ciw7ro

**Test objectives**
- Complete onboarding through first useful pipeline view
- Create contact, company, deal and move stages
- Configure one automation and one report
- Exercise search, admin, support paths, and pricing verify

**Account / signup requirements**
- Business email for trial signup
- Prefer plan that includes pipeline + automation (or note gates)
- Optional second user for permissions (else NOT_AVAILABLE)
- Sandbox/test data only — no production customer PII

**Workflows**
- Create account → onboarding
- Import sample contacts
- Create company → link contact
- Create/customize pipeline → create deal → move stages
- Simple automation
- Report/dashboard
- Email/integration if plan allows
- Search → permissions/mobile if available
- Admin settings → help/support
- Setup friction notes → verify pricing

**Pricing checks**
- Trial plan name vs public pricing tiers
- Seat limits, contact limits, automation gates
- Add-on / phone support friction
- In-app billing labels vs softwareglimpse pricing facts

**Important claims to verify**
- Ease of setup for SMB sales teams
- Pipeline UX and deal management clarity
- Automation usefulness on the tested plan
- Reporting quality
- Integration / email sync claims

**Comparison questions**
- Vs HubSpot/Pipedrive-class peers: setup speed
- Vs spreadsheet/email-only: when is this worth paying for?
- Would you recommend for a 3–15 person sales team on this plan?

**Screenshots required**
- Signup / onboarding step
- Contact list or import result
- Company record
- Pipeline board with deal
- Automation builder
- Report/dashboard
- Admin/settings
- Public pricing + in-app plan

**Strength prompts**
- What was surprisingly easy after signup?
- Which CRM workflow felt production-ready?

**Weakness / friction prompts**
- Where did onboarding or pipeline UX create friction?
- What important feature was missing, gated, or confusing?

**Pages that may use hands-on evidence after genuine completion** (54) — do **not** rewrite until the human test exists:
- alternatives: 14
- best: 1
- comparison: 36
- pricing: 1
- software-review: 1
- tool: 1
- Full list: `data/editorial/testing/packs/2026-09-08/top-10.json` → `freshsales`

## After genuine completion

Propagation flags dependent refresh tasks only. Editorial rewrites wait for human evidence — see `docs/editorial/PRODUCT-TESTING-REFRESH-TASKS.md` after finish.

