# Hands-on testing wave — top 10 (2026-09-09)

Human tester only. **AI must never mark tasks complete or fabricate observations.**
HANDS_ON_TESTED is assigned only after a completed human session with all required tasks recorded, strengths/weaknesses filled, and **explicit human confirmation**.

## Workspace

1. Open `/dev/product-testing/?secret=$TESTING_SECRET`
2. Pick a product from the **Top 10 queue** panel (or use a prepared draft session)
3. Session: **START** → **IN_PROGRESS** (or **BLOCKED** / Resume) → **COMPLETE** via Finish
4. Per task: PASS / PARTIAL / FAIL / NOT_AVAILABLE / NOT_APPLICABLE / **BLOCKED** (never leave required tasks NOT_STARTED)
5. Capture notes, screenshots, time spent, unexpected findings, strengths, weaknesses, pricing observations
6. Check **I personally completed this test** → **Finish test (human only)**

No task auto-passes. Incomplete/abandoned/blocked sessions stay private. Dependents are flagged after completion — **do not auto-rewrite** until then.

## Express path (~30–60 minutes)

Complete **required** protocol tasks only. Mark stretch tasks NOT_AVAILABLE/BLOCKED when timeboxed. Prefer one clean end-to-end workflow over exhaustive coverage.

## Selection criteria

REAL GSC demand · affiliate value · dependent comparisons · category importance · evidence gap.

| Rank | Product | Priority | Est. min | Protocol | Evidence | GSC | Aff | Dependents | Impact |
| ---: | --- | ---: | --- | --- | --- | ---: | --- | ---: | --- |
| 1 | [HubSpot](/software/hubspot/) | 264 | 45–60 | `crm-hands-on` (12/17 req) | data_verified | 1340 | yes | 98 | search+affiliate |
| 2 | [Capsule](/software/capsule/) | 240 | 35–55 | `crm-hands-on` (12/17 req) | data_verified | 431 | yes | 56 | search+affiliate |
| 3 | [Keap](/software/keap/) | 237 | 35–55 | `crm-hands-on` (12/17 req) | data_verified | 567 | yes | 50 | search+affiliate |
| 4 | [Insightly](/software/insightly/) | 236 | 35–55 | `crm-hands-on` (12/17 req) | researched | 938 | no | 47 | search/trust |
| 5 | [Closely](/software/closely/) | 230 | 30–45 | `sales-intelligence-hands-on` (11/16 req) | data_verified | 360 | yes | 47 | search+affiliate |
| 6 | [GetResponse](/software/getresponse/) | 226 | 35–50 | `email-marketing-hands-on` (11/17 req) | data_verified | 866 | yes | 57 | search+affiliate |
| 7 | [Nimble](/software/nimble/) | 223 | 35–55 | `crm-hands-on` (12/17 req) | data_verified | 302 | no | 48 | search/trust |
| 8 | [ActiveCampaign](/software/activecampaign/) | 220 | 45–60 | `email-marketing-hands-on` (11/17 req) | data_verified | 1019 | yes | 61 | search+affiliate |
| 9 | [Salesforce](/software/salesforce/) | 217 | 45–60 | `crm-hands-on` (12/17 req) | data_verified | 264 | no | 64 | search/trust |
| 10 | [Freshsales](/software/freshsales/) | 214 | 35–55 | `crm-hands-on` (12/17 req) | data_verified | 193 | yes | 60 | search+affiliate |

## Per-product packs

### 1. HubSpot (`hubspot`)

Protocol: **crm-hands-on** · Evidence today: **data_verified** · Est. human time: **45–60 min** · Draft session: test-mtt7i809-7enhhr

_Larger product surface — stick to required tasks; mark stretch as NOT_AVAILABLE/BLOCKED if timeboxed._

**Signup / test account path**
- Catalogue website: https://www.hubspot.com
- Human must confirm a working trial/signup path (this probe only checks homepage reachability)
- Record plan chooser friction, card-required, and email verification steps in the create-account task
- Homepage reachable (HTTP 200) — proceed to locate Trial/Sign up
- Probe: reachable=true http=200

**Completion criteria**
- Session status reaches COMPLETE only via Finish (human) — never AI-simulated
- All 12 required protocol tasks recorded as PASS, PARTIAL, FAIL, NOT_AVAILABLE, NOT_APPLICABLE, or BLOCKED (none left NOT_STARTED)
- At least one strength or weakness in the final assessment
- Human confirmation checkbox checked (I personally completed this test)
- Recommend HANDS_ON_TESTED only if the session genuinely supports a hands-on claim
- Screenshots uploaded for signup, core workflow, and pricing where possible
- setupMinutes / pricingObserved filled when observed
- Dependent review/comparison/best pages flagged after completion — do not auto-rewrite until then
- Protocol: crm-hands-on

**Protocol tasks (concrete)**
- **REQ** `create-account` — Create account: Sign up for a trial or sandbox account. Record plan, signup friction, and verification steps.
  - Evidence: SCREENSHOT, TIMING, OBSERVATION · screenshot required when feasible
- **REQ** `complete-onboarding` — Complete onboarding: Finish the product onboarding / setup wizard. Note forced steps, skips, and clarity.
  - Evidence: SCREENSHOT, TIMING, OBSERVATION · screenshot required when feasible
- **REQ** `import-sample-contacts` — Import sample contacts: Import a small CSV or sample contact set. Record mapping UX and errors.
  - Evidence: FEATURE_TEST, TIMING, SCREENSHOT · screenshot required when feasible
- **REQ** `create-company` — Create company: Create an organization/company record and link a contact.
  - Evidence: FEATURE_TEST, SCREENSHOT · screenshot required when feasible
- **REQ** `create-pipeline` — Create pipeline: Create or customize a sales pipeline with stages.
  - Evidence: FEATURE_TEST, SCREENSHOT · screenshot required when feasible
- **REQ** `create-deal` — Create deal: Create a deal/opportunity on the pipeline.
  - Evidence: FEATURE_TEST, SCREENSHOT · screenshot required when feasible
- **REQ** `move-deal-through-pipeline` — Move deal through pipeline: Advance the deal across stages (drag-and-drop or stage change).
  - Evidence: FEATURE_TEST, OBSERVATION
- **REQ** `configure-automation` — Configure automation: Create a simple workflow/automation (e.g. stage change → activity).
  - Evidence: FEATURE_TEST, SCREENSHOT, LIMITATION · screenshot required when feasible
- opt `create-report-dashboard` — Create report / dashboard: Build or open a report/dashboard relevant to pipeline activity. Stretch for 45–60m sessions — mark BLOCKED/NOT_AVAILABLE if timeboxed.
  - Evidence: FEATURE_TEST, SCREENSHOT · screenshot required when feasible
- opt `test-email-integration` — Test email / integration: Connect or exercise email sync / a core integration if the plan allows. Stretch — use NOT_AVAILABLE/BLOCKED when gated or out of time.
  - Evidence: INTEGRATION_TEST, LIMITATION, OBSERVATION
- opt `test-search` — Test search: Search for contacts, companies, and deals; note relevance and speed. Stretch for express sessions.
  - Evidence: FEATURE_TEST, OBSERVATION
- opt `test-permissions` — Test permissions: If available on the plan, verify role/permission controls for a second user or visibility setting.
  - Evidence: FEATURE_TEST, NOT_AVAILABLE
- opt `test-mobile-responsiveness` — Test mobile / responsiveness: Open the web app on a narrow viewport or mobile app if available; note usable vs broken flows.
  - Evidence: OBSERVATION, SCREENSHOT, LIMITATION · screenshot required when feasible
- **REQ** `inspect-admin-configuration` — Inspect admin / configuration: Review admin settings: custom fields, pipelines, users, billing entry points.
  - Evidence: OBSERVATION, SCREENSHOT · screenshot required when feasible
- **REQ** `inspect-help-support` — Inspect help / support: Open in-app help, docs, chat, or ticket paths. Record channel quality — do not invent response times you did not experience.
  - Evidence: SUPPORT_TEST, OBSERVATION
- **REQ** `record-setup-friction` — Record setup friction: Summarize time-to-value, confusing steps, and blockers from account creation through first useful pipeline view.
  - Evidence: TIMING, OBSERVATION, LIMITATION
- **REQ** `verify-pricing` — Verify pricing: Compare in-app / billing plan labels to the public pricing page. Record plan tested and list prices observed.
  - Evidence: PRICING, SCREENSHOT · screenshot required when feasible

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

**Comparison questions / notes prompts**
- Vs HubSpot/Pipedrive-class peers: setup speed
- Vs spreadsheet/email-only: when is this worth paying for?
- Would you recommend for a 3–15 person sales team on this plan?

**Screenshots required (session-level)**
- Signup / onboarding step
- Contact list or import result
- Company record
- Pipeline board with deal
- Automation builder
- Report/dashboard
- Admin/settings
- Public pricing + in-app plan

**Manual testing checklist (human)**
- **Signup / onboarding**
  - Create trial/sandbox account; record plan and verification steps
  - Complete onboarding wizard; note forced steps and clarity
  - Time-to-first useful screen
- **Key workflow tasks**
  - Execute the category-core workflow (CRM pipeline / email campaign / SI enrichment)
  - Import or create sample records
  - Complete one end-to-end useful outcome
- **Pricing verification**
  - Compare in-app / billing plan labels to the public pricing page
  - Record seat/contact/credit gates observed
  - Note trial length and card-required friction
- **Usability**
  - Navigation clarity after first session
  - Search / find-record quality
  - Mobile or narrow viewport if available (else NOT_AVAILABLE)
- **Integrations**
  - Open integration catalog or connect one core integration if plan allows
  - Record gated vs available connectors
- **Automation**
  - Create or inspect one automation/workflow on the tested plan
  - Note builder clarity and plan gates
- **Reporting**
  - Open or build one report/dashboard relevant to the workflow
  - Judge usefulness for the intended buyer
- **Limitations**
  - List concrete blockers, missing features, or confusing UX
  - Separate plan gates from product design limits
- **Support / help experience**
  - Open in-app help, docs, chat, or ticket paths
  - Record only channels you actually opened — do not invent response times
- **Screenshots needed**
  - Signup/onboarding
  - Core workflow screen
  - Automation or reporting
  - Admin/settings
  - Public pricing + in-app plan
- **Comparison observations**
  - Answer protocol comparison questions with first-hand notes
  - Would you recommend for the target buyer on this plan? Why/why not?

**Strength prompts**
- What was surprisingly easy after signup?
- Which CRM workflow felt production-ready?

**Weakness / friction prompts**
- Where did onboarding or pipeline UX create friction?
- What important feature was missing, gated, or confusing?

**Potential impact (after genuine completion)**
- Search: 1340 GSC impressions (demand signal). 48 comparison relationships. 98 dependent pages can absorb hands-on evidence after completion. Current evidence: data_verified → target hands_on_tested.
- Commercial: Affiliate enabled — hands-on trust can improve conversion on commercial CTAs without changing ranking logic. Do not invent revenue impact; prioritize by dependents + demand.

**Pages that may use hands-on evidence after genuine completion** (98) — do **not** rewrite until the human test exists:
- Reviews / pricing: 2 — /software/hubspot/, /pricing/hubspot/
- Comparisons / alternatives: 88 — sample: /compare/act-vs-hubspot/, /compare/affinity-vs-hubspot/, /compare/agile-crm-vs-hubspot/, /compare/apptivo-vs-hubspot/, /compare/attio-vs-hubspot/, /compare/bitrix24-vs-hubspot/
- Best pages: 1 — /best/crm-software/
- Guides: 6 — sample: /guides/what-is-hubspot/, /guides/hubspot-implementation/, /guides/hubspot-migration/, /guides/hubspot-setup/, /guides/hubspot-plans/, /guides/is-hubspot-worth-it/
- Other: 1 — /tools/crm-cost-calculator/
- Full list: `data/editorial/testing/packs/2026-09-09/top-10.json` → `hubspot`

### 2. Capsule (`capsule`)

Protocol: **crm-hands-on** · Evidence today: **data_verified** · Est. human time: **35–55 min** · Draft session: test-mtt7i80c-t4o68n

_CRM express: signup → contact/company/deal → one automation → admin/help → pricing._

**Signup / test account path**
- Catalogue website: https://capsulecrm.com
- Human must confirm a working trial/signup path (this probe only checks homepage reachability)
- Record plan chooser friction, card-required, and email verification steps in the create-account task
- Homepage reachable (HTTP 200) — proceed to locate Trial/Sign up
- Probe: reachable=true http=200

**Completion criteria**
- Session status reaches COMPLETE only via Finish (human) — never AI-simulated
- All 12 required protocol tasks recorded as PASS, PARTIAL, FAIL, NOT_AVAILABLE, NOT_APPLICABLE, or BLOCKED (none left NOT_STARTED)
- At least one strength or weakness in the final assessment
- Human confirmation checkbox checked (I personally completed this test)
- Recommend HANDS_ON_TESTED only if the session genuinely supports a hands-on claim
- Screenshots uploaded for signup, core workflow, and pricing where possible
- setupMinutes / pricingObserved filled when observed
- Dependent review/comparison/best pages flagged after completion — do not auto-rewrite until then
- Protocol: crm-hands-on

**Protocol tasks (concrete)**
- **REQ** `create-account` — Create account: Sign up for a trial or sandbox account. Record plan, signup friction, and verification steps.
  - Evidence: SCREENSHOT, TIMING, OBSERVATION · screenshot required when feasible
- **REQ** `complete-onboarding` — Complete onboarding: Finish the product onboarding / setup wizard. Note forced steps, skips, and clarity.
  - Evidence: SCREENSHOT, TIMING, OBSERVATION · screenshot required when feasible
- **REQ** `import-sample-contacts` — Import sample contacts: Import a small CSV or sample contact set. Record mapping UX and errors.
  - Evidence: FEATURE_TEST, TIMING, SCREENSHOT · screenshot required when feasible
- **REQ** `create-company` — Create company: Create an organization/company record and link a contact.
  - Evidence: FEATURE_TEST, SCREENSHOT · screenshot required when feasible
- **REQ** `create-pipeline` — Create pipeline: Create or customize a sales pipeline with stages.
  - Evidence: FEATURE_TEST, SCREENSHOT · screenshot required when feasible
- **REQ** `create-deal` — Create deal: Create a deal/opportunity on the pipeline.
  - Evidence: FEATURE_TEST, SCREENSHOT · screenshot required when feasible
- **REQ** `move-deal-through-pipeline` — Move deal through pipeline: Advance the deal across stages (drag-and-drop or stage change).
  - Evidence: FEATURE_TEST, OBSERVATION
- **REQ** `configure-automation` — Configure automation: Create a simple workflow/automation (e.g. stage change → activity).
  - Evidence: FEATURE_TEST, SCREENSHOT, LIMITATION · screenshot required when feasible
- opt `create-report-dashboard` — Create report / dashboard: Build or open a report/dashboard relevant to pipeline activity. Stretch for 45–60m sessions — mark BLOCKED/NOT_AVAILABLE if timeboxed.
  - Evidence: FEATURE_TEST, SCREENSHOT · screenshot required when feasible
- opt `test-email-integration` — Test email / integration: Connect or exercise email sync / a core integration if the plan allows. Stretch — use NOT_AVAILABLE/BLOCKED when gated or out of time.
  - Evidence: INTEGRATION_TEST, LIMITATION, OBSERVATION
- opt `test-search` — Test search: Search for contacts, companies, and deals; note relevance and speed. Stretch for express sessions.
  - Evidence: FEATURE_TEST, OBSERVATION
- opt `test-permissions` — Test permissions: If available on the plan, verify role/permission controls for a second user or visibility setting.
  - Evidence: FEATURE_TEST, NOT_AVAILABLE
- opt `test-mobile-responsiveness` — Test mobile / responsiveness: Open the web app on a narrow viewport or mobile app if available; note usable vs broken flows.
  - Evidence: OBSERVATION, SCREENSHOT, LIMITATION · screenshot required when feasible
- **REQ** `inspect-admin-configuration` — Inspect admin / configuration: Review admin settings: custom fields, pipelines, users, billing entry points.
  - Evidence: OBSERVATION, SCREENSHOT · screenshot required when feasible
- **REQ** `inspect-help-support` — Inspect help / support: Open in-app help, docs, chat, or ticket paths. Record channel quality — do not invent response times you did not experience.
  - Evidence: SUPPORT_TEST, OBSERVATION
- **REQ** `record-setup-friction` — Record setup friction: Summarize time-to-value, confusing steps, and blockers from account creation through first useful pipeline view.
  - Evidence: TIMING, OBSERVATION, LIMITATION
- **REQ** `verify-pricing` — Verify pricing: Compare in-app / billing plan labels to the public pricing page. Record plan tested and list prices observed.
  - Evidence: PRICING, SCREENSHOT · screenshot required when feasible

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

**Comparison questions / notes prompts**
- Vs HubSpot/Pipedrive-class peers: setup speed
- Vs spreadsheet/email-only: when is this worth paying for?
- Would you recommend for a 3–15 person sales team on this plan?

**Screenshots required (session-level)**
- Signup / onboarding step
- Contact list or import result
- Company record
- Pipeline board with deal
- Automation builder
- Report/dashboard
- Admin/settings
- Public pricing + in-app plan

**Manual testing checklist (human)**
- **Signup / onboarding**
  - Create trial/sandbox account; record plan and verification steps
  - Complete onboarding wizard; note forced steps and clarity
  - Time-to-first useful screen
- **Key workflow tasks**
  - Execute the category-core workflow (CRM pipeline / email campaign / SI enrichment)
  - Import or create sample records
  - Complete one end-to-end useful outcome
- **Pricing verification**
  - Compare in-app / billing plan labels to the public pricing page
  - Record seat/contact/credit gates observed
  - Note trial length and card-required friction
- **Usability**
  - Navigation clarity after first session
  - Search / find-record quality
  - Mobile or narrow viewport if available (else NOT_AVAILABLE)
- **Integrations**
  - Open integration catalog or connect one core integration if plan allows
  - Record gated vs available connectors
- **Automation**
  - Create or inspect one automation/workflow on the tested plan
  - Note builder clarity and plan gates
- **Reporting**
  - Open or build one report/dashboard relevant to the workflow
  - Judge usefulness for the intended buyer
- **Limitations**
  - List concrete blockers, missing features, or confusing UX
  - Separate plan gates from product design limits
- **Support / help experience**
  - Open in-app help, docs, chat, or ticket paths
  - Record only channels you actually opened — do not invent response times
- **Screenshots needed**
  - Signup/onboarding
  - Core workflow screen
  - Automation or reporting
  - Admin/settings
  - Public pricing + in-app plan
- **Comparison observations**
  - Answer protocol comparison questions with first-hand notes
  - Would you recommend for the target buyer on this plan? Why/why not?

**Strength prompts**
- What was surprisingly easy after signup?
- Which CRM workflow felt production-ready?

**Weakness / friction prompts**
- Where did onboarding or pipeline UX create friction?
- What important feature was missing, gated, or confusing?

**Potential impact (after genuine completion)**
- Search: 431 GSC impressions (demand signal). 36 comparison relationships. 56 dependent pages can absorb hands-on evidence after completion. Current evidence: data_verified → target hands_on_tested.
- Commercial: Affiliate enabled — hands-on trust can improve conversion on commercial CTAs without changing ranking logic. Do not invent revenue impact; prioritize by dependents + demand.

**Pages that may use hands-on evidence after genuine completion** (56) — do **not** rewrite until the human test exists:
- Reviews / pricing: 2 — /software/capsule/, /pricing/capsule/
- Comparisons / alternatives: 46 — sample: /compare/act-vs-capsule/, /compare/affinity-vs-capsule/, /compare/agile-crm-vs-capsule/, /compare/apptivo-vs-capsule/, /compare/attio-vs-capsule/, /compare/bitrix24-vs-capsule/
- Best pages: 1 — /best/crm-software/
- Guides: 6 — sample: /guides/how-to-choose-crm/, /guides/capsule-implementation/, /guides/capsule-migration/, /guides/capsule-setup/, /guides/capsule-plans/, /guides/is-capsule-worth-it/
- Other: 1 — /tools/crm-cost-calculator/
- Full list: `data/editorial/testing/packs/2026-09-09/top-10.json` → `capsule`

### 3. Keap (`keap`)

Protocol: **crm-hands-on** · Evidence today: **data_verified** · Est. human time: **35–55 min** · Draft session: test-mtt7i80e-8rkeml

_CRM express: signup → contact/company/deal → one automation → admin/help → pricing._

**Signup / test account path**
- Catalogue website: https://keap.com
- Human must confirm a working trial/signup path (this probe only checks homepage reachability)
- Record plan chooser friction, card-required, and email verification steps in the create-account task
- Homepage reachable (HTTP 200) — proceed to locate Trial/Sign up
- Probe: reachable=true http=200

**Completion criteria**
- Session status reaches COMPLETE only via Finish (human) — never AI-simulated
- All 12 required protocol tasks recorded as PASS, PARTIAL, FAIL, NOT_AVAILABLE, NOT_APPLICABLE, or BLOCKED (none left NOT_STARTED)
- At least one strength or weakness in the final assessment
- Human confirmation checkbox checked (I personally completed this test)
- Recommend HANDS_ON_TESTED only if the session genuinely supports a hands-on claim
- Screenshots uploaded for signup, core workflow, and pricing where possible
- setupMinutes / pricingObserved filled when observed
- Dependent review/comparison/best pages flagged after completion — do not auto-rewrite until then
- Protocol: crm-hands-on

**Protocol tasks (concrete)**
- **REQ** `create-account` — Create account: Sign up for a trial or sandbox account. Record plan, signup friction, and verification steps.
  - Evidence: SCREENSHOT, TIMING, OBSERVATION · screenshot required when feasible
- **REQ** `complete-onboarding` — Complete onboarding: Finish the product onboarding / setup wizard. Note forced steps, skips, and clarity.
  - Evidence: SCREENSHOT, TIMING, OBSERVATION · screenshot required when feasible
- **REQ** `import-sample-contacts` — Import sample contacts: Import a small CSV or sample contact set. Record mapping UX and errors.
  - Evidence: FEATURE_TEST, TIMING, SCREENSHOT · screenshot required when feasible
- **REQ** `create-company` — Create company: Create an organization/company record and link a contact.
  - Evidence: FEATURE_TEST, SCREENSHOT · screenshot required when feasible
- **REQ** `create-pipeline` — Create pipeline: Create or customize a sales pipeline with stages.
  - Evidence: FEATURE_TEST, SCREENSHOT · screenshot required when feasible
- **REQ** `create-deal` — Create deal: Create a deal/opportunity on the pipeline.
  - Evidence: FEATURE_TEST, SCREENSHOT · screenshot required when feasible
- **REQ** `move-deal-through-pipeline` — Move deal through pipeline: Advance the deal across stages (drag-and-drop or stage change).
  - Evidence: FEATURE_TEST, OBSERVATION
- **REQ** `configure-automation` — Configure automation: Create a simple workflow/automation (e.g. stage change → activity).
  - Evidence: FEATURE_TEST, SCREENSHOT, LIMITATION · screenshot required when feasible
- opt `create-report-dashboard` — Create report / dashboard: Build or open a report/dashboard relevant to pipeline activity. Stretch for 45–60m sessions — mark BLOCKED/NOT_AVAILABLE if timeboxed.
  - Evidence: FEATURE_TEST, SCREENSHOT · screenshot required when feasible
- opt `test-email-integration` — Test email / integration: Connect or exercise email sync / a core integration if the plan allows. Stretch — use NOT_AVAILABLE/BLOCKED when gated or out of time.
  - Evidence: INTEGRATION_TEST, LIMITATION, OBSERVATION
- opt `test-search` — Test search: Search for contacts, companies, and deals; note relevance and speed. Stretch for express sessions.
  - Evidence: FEATURE_TEST, OBSERVATION
- opt `test-permissions` — Test permissions: If available on the plan, verify role/permission controls for a second user or visibility setting.
  - Evidence: FEATURE_TEST, NOT_AVAILABLE
- opt `test-mobile-responsiveness` — Test mobile / responsiveness: Open the web app on a narrow viewport or mobile app if available; note usable vs broken flows.
  - Evidence: OBSERVATION, SCREENSHOT, LIMITATION · screenshot required when feasible
- **REQ** `inspect-admin-configuration` — Inspect admin / configuration: Review admin settings: custom fields, pipelines, users, billing entry points.
  - Evidence: OBSERVATION, SCREENSHOT · screenshot required when feasible
- **REQ** `inspect-help-support` — Inspect help / support: Open in-app help, docs, chat, or ticket paths. Record channel quality — do not invent response times you did not experience.
  - Evidence: SUPPORT_TEST, OBSERVATION
- **REQ** `record-setup-friction` — Record setup friction: Summarize time-to-value, confusing steps, and blockers from account creation through first useful pipeline view.
  - Evidence: TIMING, OBSERVATION, LIMITATION
- **REQ** `verify-pricing` — Verify pricing: Compare in-app / billing plan labels to the public pricing page. Record plan tested and list prices observed.
  - Evidence: PRICING, SCREENSHOT · screenshot required when feasible

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

**Comparison questions / notes prompts**
- Vs HubSpot/Pipedrive-class peers: setup speed
- Vs spreadsheet/email-only: when is this worth paying for?
- Would you recommend for a 3–15 person sales team on this plan?

**Screenshots required (session-level)**
- Signup / onboarding step
- Contact list or import result
- Company record
- Pipeline board with deal
- Automation builder
- Report/dashboard
- Admin/settings
- Public pricing + in-app plan

**Manual testing checklist (human)**
- **Signup / onboarding**
  - Create trial/sandbox account; record plan and verification steps
  - Complete onboarding wizard; note forced steps and clarity
  - Time-to-first useful screen
- **Key workflow tasks**
  - Execute the category-core workflow (CRM pipeline / email campaign / SI enrichment)
  - Import or create sample records
  - Complete one end-to-end useful outcome
- **Pricing verification**
  - Compare in-app / billing plan labels to the public pricing page
  - Record seat/contact/credit gates observed
  - Note trial length and card-required friction
- **Usability**
  - Navigation clarity after first session
  - Search / find-record quality
  - Mobile or narrow viewport if available (else NOT_AVAILABLE)
- **Integrations**
  - Open integration catalog or connect one core integration if plan allows
  - Record gated vs available connectors
- **Automation**
  - Create or inspect one automation/workflow on the tested plan
  - Note builder clarity and plan gates
- **Reporting**
  - Open or build one report/dashboard relevant to the workflow
  - Judge usefulness for the intended buyer
- **Limitations**
  - List concrete blockers, missing features, or confusing UX
  - Separate plan gates from product design limits
- **Support / help experience**
  - Open in-app help, docs, chat, or ticket paths
  - Record only channels you actually opened — do not invent response times
- **Screenshots needed**
  - Signup/onboarding
  - Core workflow screen
  - Automation or reporting
  - Admin/settings
  - Public pricing + in-app plan
- **Comparison observations**
  - Answer protocol comparison questions with first-hand notes
  - Would you recommend for the target buyer on this plan? Why/why not?

**Strength prompts**
- What was surprisingly easy after signup?
- Which CRM workflow felt production-ready?

**Weakness / friction prompts**
- Where did onboarding or pipeline UX create friction?
- What important feature was missing, gated, or confusing?

**Potential impact (after genuine completion)**
- Search: 567 GSC impressions (demand signal). 36 comparison relationships. 50 dependent pages can absorb hands-on evidence after completion. Current evidence: data_verified → target hands_on_tested.
- Commercial: Affiliate enabled — hands-on trust can improve conversion on commercial CTAs without changing ranking logic. Do not invent revenue impact; prioritize by dependents + demand.

**Pages that may use hands-on evidence after genuine completion** (50) — do **not** rewrite until the human test exists:
- Reviews / pricing: 2 — /software/keap/, /pricing/keap/
- Comparisons / alternatives: 40 — sample: /compare/act-vs-keap/, /compare/affinity-vs-keap/, /compare/agile-crm-vs-keap/, /compare/apptivo-vs-keap/, /compare/attio-vs-keap/, /compare/bitrix24-vs-keap/
- Best pages: 1 — /best/crm-software/
- Guides: 6 — sample: /guides/what-is-keap/, /guides/keap-implementation/, /guides/keap-migration/, /guides/keap-setup/, /guides/keap-plans/, /guides/is-keap-worth-it/
- Other: 1 — /tools/crm-cost-calculator/
- Full list: `data/editorial/testing/packs/2026-09-09/top-10.json` → `keap`

### 4. Insightly (`insightly`)

Protocol: **crm-hands-on** · Evidence today: **researched** · Est. human time: **35–55 min** · Draft session: test-mtt7i80g-yxrx4s

_CRM express: signup → contact/company/deal → one automation → admin/help → pricing._

**Signup / test account path**
- Catalogue website: https://www.insightly.com
- Human must confirm a working trial/signup path (this probe only checks homepage reachability)
- Record plan chooser friction, card-required, and email verification steps in the create-account task
- Homepage returned HTTP 403 — human may still reach signup; note blocker if blocked
- Probe: reachable=false http=403

**Completion criteria**
- Session status reaches COMPLETE only via Finish (human) — never AI-simulated
- All 12 required protocol tasks recorded as PASS, PARTIAL, FAIL, NOT_AVAILABLE, NOT_APPLICABLE, or BLOCKED (none left NOT_STARTED)
- At least one strength or weakness in the final assessment
- Human confirmation checkbox checked (I personally completed this test)
- Recommend HANDS_ON_TESTED only if the session genuinely supports a hands-on claim
- Screenshots uploaded for signup, core workflow, and pricing where possible
- setupMinutes / pricingObserved filled when observed
- Dependent review/comparison/best pages flagged after completion — do not auto-rewrite until then
- Protocol: crm-hands-on

**Protocol tasks (concrete)**
- **REQ** `create-account` — Create account: Sign up for a trial or sandbox account. Record plan, signup friction, and verification steps.
  - Evidence: SCREENSHOT, TIMING, OBSERVATION · screenshot required when feasible
- **REQ** `complete-onboarding` — Complete onboarding: Finish the product onboarding / setup wizard. Note forced steps, skips, and clarity.
  - Evidence: SCREENSHOT, TIMING, OBSERVATION · screenshot required when feasible
- **REQ** `import-sample-contacts` — Import sample contacts: Import a small CSV or sample contact set. Record mapping UX and errors.
  - Evidence: FEATURE_TEST, TIMING, SCREENSHOT · screenshot required when feasible
- **REQ** `create-company` — Create company: Create an organization/company record and link a contact.
  - Evidence: FEATURE_TEST, SCREENSHOT · screenshot required when feasible
- **REQ** `create-pipeline` — Create pipeline: Create or customize a sales pipeline with stages.
  - Evidence: FEATURE_TEST, SCREENSHOT · screenshot required when feasible
- **REQ** `create-deal` — Create deal: Create a deal/opportunity on the pipeline.
  - Evidence: FEATURE_TEST, SCREENSHOT · screenshot required when feasible
- **REQ** `move-deal-through-pipeline` — Move deal through pipeline: Advance the deal across stages (drag-and-drop or stage change).
  - Evidence: FEATURE_TEST, OBSERVATION
- **REQ** `configure-automation` — Configure automation: Create a simple workflow/automation (e.g. stage change → activity).
  - Evidence: FEATURE_TEST, SCREENSHOT, LIMITATION · screenshot required when feasible
- opt `create-report-dashboard` — Create report / dashboard: Build or open a report/dashboard relevant to pipeline activity. Stretch for 45–60m sessions — mark BLOCKED/NOT_AVAILABLE if timeboxed.
  - Evidence: FEATURE_TEST, SCREENSHOT · screenshot required when feasible
- opt `test-email-integration` — Test email / integration: Connect or exercise email sync / a core integration if the plan allows. Stretch — use NOT_AVAILABLE/BLOCKED when gated or out of time.
  - Evidence: INTEGRATION_TEST, LIMITATION, OBSERVATION
- opt `test-search` — Test search: Search for contacts, companies, and deals; note relevance and speed. Stretch for express sessions.
  - Evidence: FEATURE_TEST, OBSERVATION
- opt `test-permissions` — Test permissions: If available on the plan, verify role/permission controls for a second user or visibility setting.
  - Evidence: FEATURE_TEST, NOT_AVAILABLE
- opt `test-mobile-responsiveness` — Test mobile / responsiveness: Open the web app on a narrow viewport or mobile app if available; note usable vs broken flows.
  - Evidence: OBSERVATION, SCREENSHOT, LIMITATION · screenshot required when feasible
- **REQ** `inspect-admin-configuration` — Inspect admin / configuration: Review admin settings: custom fields, pipelines, users, billing entry points.
  - Evidence: OBSERVATION, SCREENSHOT · screenshot required when feasible
- **REQ** `inspect-help-support` — Inspect help / support: Open in-app help, docs, chat, or ticket paths. Record channel quality — do not invent response times you did not experience.
  - Evidence: SUPPORT_TEST, OBSERVATION
- **REQ** `record-setup-friction` — Record setup friction: Summarize time-to-value, confusing steps, and blockers from account creation through first useful pipeline view.
  - Evidence: TIMING, OBSERVATION, LIMITATION
- **REQ** `verify-pricing` — Verify pricing: Compare in-app / billing plan labels to the public pricing page. Record plan tested and list prices observed.
  - Evidence: PRICING, SCREENSHOT · screenshot required when feasible

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

**Comparison questions / notes prompts**
- Vs HubSpot/Pipedrive-class peers: setup speed
- Vs spreadsheet/email-only: when is this worth paying for?
- Would you recommend for a 3–15 person sales team on this plan?

**Screenshots required (session-level)**
- Signup / onboarding step
- Contact list or import result
- Company record
- Pipeline board with deal
- Automation builder
- Report/dashboard
- Admin/settings
- Public pricing + in-app plan

**Manual testing checklist (human)**
- **Signup / onboarding**
  - Create trial/sandbox account; record plan and verification steps
  - Complete onboarding wizard; note forced steps and clarity
  - Time-to-first useful screen
- **Key workflow tasks**
  - Execute the category-core workflow (CRM pipeline / email campaign / SI enrichment)
  - Import or create sample records
  - Complete one end-to-end useful outcome
- **Pricing verification**
  - Compare in-app / billing plan labels to the public pricing page
  - Record seat/contact/credit gates observed
  - Note trial length and card-required friction
- **Usability**
  - Navigation clarity after first session
  - Search / find-record quality
  - Mobile or narrow viewport if available (else NOT_AVAILABLE)
- **Integrations**
  - Open integration catalog or connect one core integration if plan allows
  - Record gated vs available connectors
- **Automation**
  - Create or inspect one automation/workflow on the tested plan
  - Note builder clarity and plan gates
- **Reporting**
  - Open or build one report/dashboard relevant to the workflow
  - Judge usefulness for the intended buyer
- **Limitations**
  - List concrete blockers, missing features, or confusing UX
  - Separate plan gates from product design limits
- **Support / help experience**
  - Open in-app help, docs, chat, or ticket paths
  - Record only channels you actually opened — do not invent response times
- **Screenshots needed**
  - Signup/onboarding
  - Core workflow screen
  - Automation or reporting
  - Admin/settings
  - Public pricing + in-app plan
- **Comparison observations**
  - Answer protocol comparison questions with first-hand notes
  - Would you recommend for the target buyer on this plan? Why/why not?

**Strength prompts**
- What was surprisingly easy after signup?
- Which CRM workflow felt production-ready?

**Weakness / friction prompts**
- Where did onboarding or pipeline UX create friction?
- What important feature was missing, gated, or confusing?

**Potential impact (after genuine completion)**
- Search: 938 GSC impressions (demand signal). 36 comparison relationships. 47 dependent pages can absorb hands-on evidence after completion. Current evidence: researched → target hands_on_tested.
- Commercial: No affiliate today — still high editorial/trust value for reviews and comps. Do not invent revenue impact; prioritize by dependents + demand.

**Pages that may use hands-on evidence after genuine completion** (47) — do **not** rewrite until the human test exists:
- Reviews / pricing: 2 — /software/insightly/, /pricing/insightly/
- Comparisons / alternatives: 37 — sample: /compare/act-vs-insightly/, /compare/affinity-vs-insightly/, /compare/agile-crm-vs-insightly/, /compare/apptivo-vs-insightly/, /compare/attio-vs-insightly/, /compare/bitrix24-vs-insightly/
- Best pages: 1 — /best/crm-software/
- Guides: 6 — sample: /guides/what-is-insightly/, /guides/insightly-implementation/, /guides/insightly-migration/, /guides/insightly-setup/, /guides/insightly-plans/, /guides/is-insightly-worth-it/
- Other: 1 — /tools/crm-cost-calculator/
- Full list: `data/editorial/testing/packs/2026-09-09/top-10.json` → `insightly`

### 5. Closely (`closely`)

Protocol: **sales-intelligence-hands-on** · Evidence today: **data_verified** · Est. human time: **30–45 min** · Draft session: test-mtt7i80h-34za3x

_Credits + one enrich + list/export is enough for express path._

**Signup / test account path**
- Catalogue website: https://www.closelyhq.com
- Human must confirm a working trial/signup path (this probe only checks homepage reachability)
- Record plan chooser friction, card-required, and email verification steps in the create-account task
- Homepage reachable (HTTP 200) — proceed to locate Trial/Sign up
- Probe: reachable=true http=200

**Completion criteria**
- Session status reaches COMPLETE only via Finish (human) — never AI-simulated
- All 11 required protocol tasks recorded as PASS, PARTIAL, FAIL, NOT_AVAILABLE, NOT_APPLICABLE, or BLOCKED (none left NOT_STARTED)
- At least one strength or weakness in the final assessment
- Human confirmation checkbox checked (I personally completed this test)
- Recommend HANDS_ON_TESTED only if the session genuinely supports a hands-on claim
- Screenshots uploaded for signup, core workflow, and pricing where possible
- setupMinutes / pricingObserved filled when observed
- Dependent review/comparison/best pages flagged after completion — do not auto-rewrite until then
- Protocol: sales-intelligence-hands-on

**Protocol tasks (concrete)**
- **REQ** `create-account` — Create account: Sign up for a trial. Record plan, credit/seat model hints, and signup friction.
  - Evidence: SCREENSHOT, TIMING, OBSERVATION · screenshot required when feasible
- **REQ** `complete-onboarding` — Complete onboarding: Finish onboarding (ICP, chrome extension, CRM connect prompts). Note forced steps.
  - Evidence: SCREENSHOT, TIMING, OBSERVATION · screenshot required when feasible
- **REQ** `search-people` — Search people / leads: Run a people search with filters (title, company, location). Note result quality.
  - Evidence: FEATURE_TEST, SCREENSHOT · screenshot required when feasible
- **REQ** `search-companies` — Search companies: Run a company search; open a company profile and note firmographic fields.
  - Evidence: FEATURE_TEST, SCREENSHOT · screenshot required when feasible
- **REQ** `test-enrichment` — Test contact enrichment: Reveal or enrich email/phone for a test contact if credits allow. Record accuracy/friction — do not use for outreach spam.
  - Evidence: FEATURE_TEST, LIMITATION, OBSERVATION
- **REQ** `build-list-or-sequence` — Build a list or sequence: Save leads to a list and/or create a lightweight sequence draft (do not send to strangers).
  - Evidence: FEATURE_TEST, SCREENSHOT · screenshot required when feasible
- **REQ** `test-crm-or-export` — Test CRM sync / export: Connect CRM or export a CSV of the test list if the plan allows.
  - Evidence: INTEGRATION_TEST, SCREENSHOT, NOT_AVAILABLE · screenshot required when feasible
- opt `test-browser-extension` — Test browser extension / overlay: If offered, install or open the LinkedIn/browser overlay on a public profile page. Stretch — NOT_AVAILABLE if not offered.
  - Evidence: FEATURE_TEST, SCREENSHOT, NOT_AVAILABLE · screenshot required when feasible
- **REQ** `inspect-credits-usage` — Inspect credits / usage: Find credit balance, usage meters, and what actions consume credits.
  - Evidence: OBSERVATION, SCREENSHOT, LIMITATION · screenshot required when feasible
- opt `inspect-reporting` — Inspect reporting / activity: Open activity, sequence, or enrichment reports if present. Stretch for express sessions.
  - Evidence: FEATURE_TEST, SCREENSHOT, NOT_AVAILABLE · screenshot required when feasible
- opt `test-in-app-search` — Test in-app search / filters: Re-run filtered searches; note saved filters and speed. Stretch for express sessions.
  - Evidence: FEATURE_TEST, OBSERVATION
- opt `test-permissions` — Test permissions / team: Review seats/roles if available; else mark NOT_AVAILABLE.
  - Evidence: FEATURE_TEST, NOT_AVAILABLE
- opt `test-mobile-responsiveness` — Test mobile / responsiveness: Narrow viewport; note usable vs broken flows.
  - Evidence: OBSERVATION, SCREENSHOT, LIMITATION · screenshot required when feasible
- **REQ** `inspect-help-support` — Inspect help / support: Open docs/chat/ticket. Only record channels you actually opened.
  - Evidence: SUPPORT_TEST, OBSERVATION
- **REQ** `record-setup-friction` — Record setup friction: Summarize time-to-first useful lead list, confusing steps, and blockers.
  - Evidence: TIMING, OBSERVATION, LIMITATION
- **REQ** `verify-pricing` — Verify pricing: Compare in-app plan/credit labels to the public pricing page. Record plan tested.
  - Evidence: PRICING, SCREENSHOT · screenshot required when feasible

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

**Comparison questions / notes prompts**
- Vs other SI tools: credit fairness and UI clarity
- Vs CRM native prospecting: data depth
- Would you buy for an SDR team of 3–10?

**Screenshots required (session-level)**
- People search results
- Company profile
- Enrichment / credit spend confirmation
- List or sequence builder
- Credits/usage meter
- Pricing page + in-app plan

**Manual testing checklist (human)**
- **Signup / onboarding**
  - Create trial/sandbox account; record plan and verification steps
  - Complete onboarding wizard; note forced steps and clarity
  - Time-to-first useful screen
- **Key workflow tasks**
  - Execute the category-core workflow (CRM pipeline / email campaign / SI enrichment)
  - Import or create sample records
  - Complete one end-to-end useful outcome
- **Pricing verification**
  - Compare in-app / billing plan labels to the public pricing page
  - Record seat/contact/credit gates observed
  - Note trial length and card-required friction
- **Usability**
  - Navigation clarity after first session
  - Search / find-record quality
  - Mobile or narrow viewport if available (else NOT_AVAILABLE)
- **Integrations**
  - Open integration catalog or connect one core integration if plan allows
  - Record gated vs available connectors
- **Automation**
  - Create or inspect one automation/workflow on the tested plan
  - Note builder clarity and plan gates
- **Reporting**
  - Open or build one report/dashboard relevant to the workflow
  - Judge usefulness for the intended buyer
- **Limitations**
  - List concrete blockers, missing features, or confusing UX
  - Separate plan gates from product design limits
- **Support / help experience**
  - Open in-app help, docs, chat, or ticket paths
  - Record only channels you actually opened — do not invent response times
- **Screenshots needed**
  - Signup/onboarding
  - Core workflow screen
  - Automation or reporting
  - Admin/settings
  - Public pricing + in-app plan
- **Comparison observations**
  - Answer protocol comparison questions with first-hand notes
  - Would you recommend for the target buyer on this plan? Why/why not?

**Strength prompts**
- What search/filter combo produced useful leads fastest?
- What felt trustworthy about data quality?

**Weakness / friction prompts**
- Where did credits or paywalls block evaluation?
- What data looked stale, wrong, or hard to verify?

**Potential impact (after genuine completion)**
- Search: 360 GSC impressions (demand signal). 28 comparison relationships. 47 dependent pages can absorb hands-on evidence after completion. Current evidence: data_verified → target hands_on_tested.
- Commercial: Affiliate enabled — hands-on trust can improve conversion on commercial CTAs without changing ranking logic. Do not invent revenue impact; prioritize by dependents + demand.

**Pages that may use hands-on evidence after genuine completion** (47) — do **not** rewrite until the human test exists:
- Reviews / pricing: 2 — /software/closely/, /pricing/closely/
- Comparisons / alternatives: 33 — sample: /compare/closely-vs-reply/, /compare/adapt-io-vs-closely/, /compare/amplemarket-vs-closely/, /compare/apollo-vs-closely/, /compare/bombora-vs-closely/, /compare/bookyourdata-vs-closely/
- Best pages: 1 — /best/sales-intelligence-software/
- Guides: 10 — sample: /guides/what-is-sales-intelligence/, /guides/how-sales-intelligence-works/, /guides/sales-intelligence-vs-crm/, /guides/sales-intelligence-feature-checklist/, /guides/sales-intelligence-pricing-guide/, /guides/closely-implementation/
- Other: 1 — /tools/crm-cost-calculator/
- Full list: `data/editorial/testing/packs/2026-09-09/top-10.json` → `closely`

### 6. GetResponse (`getresponse`)

Protocol: **email-marketing-hands-on** · Evidence today: **data_verified** · Est. human time: **35–50 min** · Draft session: test-mtt7i80j-554jd1

_List → draft campaign → one automation → pricing is the core loop._

**Signup / test account path**
- Catalogue website: https://www.getresponse.com
- Human must confirm a working trial/signup path (this probe only checks homepage reachability)
- Record plan chooser friction, card-required, and email verification steps in the create-account task
- Homepage reachable (HTTP 200) — proceed to locate Trial/Sign up
- Probe: reachable=true http=200

**Completion criteria**
- Session status reaches COMPLETE only via Finish (human) — never AI-simulated
- All 11 required protocol tasks recorded as PASS, PARTIAL, FAIL, NOT_AVAILABLE, NOT_APPLICABLE, or BLOCKED (none left NOT_STARTED)
- At least one strength or weakness in the final assessment
- Human confirmation checkbox checked (I personally completed this test)
- Recommend HANDS_ON_TESTED only if the session genuinely supports a hands-on claim
- Screenshots uploaded for signup, core workflow, and pricing where possible
- setupMinutes / pricingObserved filled when observed
- Dependent review/comparison/best pages flagged after completion — do not auto-rewrite until then
- Protocol: email-marketing-hands-on

**Protocol tasks (concrete)**
- **REQ** `create-account` — Create account: Sign up for a trial. Record plan selected, verification steps, and signup friction.
  - Evidence: SCREENSHOT, TIMING, OBSERVATION · screenshot required when feasible
- **REQ** `complete-onboarding` — Complete onboarding: Finish setup wizard (domain/brand/list). Note forced vs optional steps.
  - Evidence: SCREENSHOT, TIMING, OBSERVATION · screenshot required when feasible
- **REQ** `import-or-create-list` — Import or create a list: Create a list/audience and import a small CSV or add contacts manually.
  - Evidence: FEATURE_TEST, SCREENSHOT, TIMING · screenshot required when feasible
- **REQ** `inspect-contact-profile` — Inspect contact profile: Open a contact record; note fields, tags, activity timeline, and edit UX.
  - Evidence: FEATURE_TEST, SCREENSHOT · screenshot required when feasible
- **REQ** `create-campaign-draft` — Create campaign draft: Build a draft email/campaign (subject, body, audience). Do not send to real customers.
  - Evidence: FEATURE_TEST, SCREENSHOT · screenshot required when feasible
- **REQ** `test-editor` — Test email editor: Exercise drag-and-drop or code editor; note templates, mobile preview, and limitations.
  - Evidence: FEATURE_TEST, OBSERVATION, LIMITATION
- **REQ** `configure-automation` — Configure automation: Create a simple automation (e.g. tag added → send email / wait).
  - Evidence: FEATURE_TEST, SCREENSHOT, LIMITATION · screenshot required when feasible
- opt `test-form-or-landing` — Test form / landing page: Create or open a signup form or landing page builder if available on the plan. Stretch for 45–60m sessions.
  - Evidence: FEATURE_TEST, SCREENSHOT, NOT_AVAILABLE · screenshot required when feasible
- **REQ** `inspect-analytics` — Inspect analytics / reporting: Open campaign or automation reports (opens, clicks, bounce). Note clarity of metrics.
  - Evidence: FEATURE_TEST, SCREENSHOT · screenshot required when feasible
- opt `test-integration` — Test integration catalog: Open integrations directory; attempt or inspect a CRM/ecommerce connection if plan allows. Stretch — use BLOCKED/NOT_AVAILABLE when gated.
  - Evidence: INTEGRATION_TEST, LIMITATION, OBSERVATION
- opt `inspect-deliverability-settings` — Inspect deliverability settings: Find domain authentication (SPF/DKIM/DMARC), sending domains, or reputation tips. Stretch for express sessions.
  - Evidence: OBSERVATION, SCREENSHOT · screenshot required when feasible
- opt `test-search` — Test search: Search contacts, campaigns, and automations; note speed and relevance. Stretch for express sessions.
  - Evidence: FEATURE_TEST, OBSERVATION
- opt `test-permissions` — Test permissions / team: If available, review user roles or invite a second seat; else mark NOT_AVAILABLE.
  - Evidence: FEATURE_TEST, NOT_AVAILABLE
- opt `test-mobile-responsiveness` — Test mobile / responsiveness: Narrow viewport or mobile app; note usable vs broken flows.
  - Evidence: OBSERVATION, SCREENSHOT, LIMITATION · screenshot required when feasible
- **REQ** `inspect-help-support` — Inspect help / support: Open help center, chat, or ticket paths. Only record channels you actually opened.
  - Evidence: SUPPORT_TEST, OBSERVATION
- **REQ** `record-setup-friction` — Record setup friction: Summarize time-to-first-useful draft, confusing steps, and blockers.
  - Evidence: TIMING, OBSERVATION, LIMITATION
- **REQ** `verify-pricing` — Verify pricing: Compare in-app / billing plan labels to the public pricing page. Record plan tested.
  - Evidence: PRICING, SCREENSHOT · screenshot required when feasible

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

**Comparison questions / notes prompts**
- Vs peer email tools: editor speed and template quality
- Vs CRM-bundled email: depth of automation
- Would you recommend for a 5–20 person marketing team?

**Screenshots required (session-level)**
- Signup / plan chooser
- List import or audience screen
- Campaign editor (desktop)
- Automation canvas
- Analytics/report
- Public pricing + in-app billing (side by side)

**Manual testing checklist (human)**
- **Signup / onboarding**
  - Create trial/sandbox account; record plan and verification steps
  - Complete onboarding wizard; note forced steps and clarity
  - Time-to-first useful screen
- **Key workflow tasks**
  - Execute the category-core workflow (CRM pipeline / email campaign / SI enrichment)
  - Import or create sample records
  - Complete one end-to-end useful outcome
- **Pricing verification**
  - Compare in-app / billing plan labels to the public pricing page
  - Record seat/contact/credit gates observed
  - Note trial length and card-required friction
- **Usability**
  - Navigation clarity after first session
  - Search / find-record quality
  - Mobile or narrow viewport if available (else NOT_AVAILABLE)
- **Integrations**
  - Open integration catalog or connect one core integration if plan allows
  - Record gated vs available connectors
- **Automation**
  - Create or inspect one automation/workflow on the tested plan
  - Note builder clarity and plan gates
- **Reporting**
  - Open or build one report/dashboard relevant to the workflow
  - Judge usefulness for the intended buyer
- **Limitations**
  - List concrete blockers, missing features, or confusing UX
  - Separate plan gates from product design limits
- **Support / help experience**
  - Open in-app help, docs, chat, or ticket paths
  - Record only channels you actually opened — do not invent response times
- **Screenshots needed**
  - Signup/onboarding
  - Core workflow screen
  - Automation or reporting
  - Admin/settings
  - Public pricing + in-app plan
- **Comparison observations**
  - Answer protocol comparison questions with first-hand notes
  - Would you recommend for the target buyer on this plan? Why/why not?

**Strength prompts**
- What felt faster or clearer than expected?
- Which workflow would you trust for a live send?

**Weakness / friction prompts**
- Where did you get stuck or confuse terminology?
- What feature felt gated, incomplete, or misleading vs marketing claims?

**Potential impact (after genuine completion)**
- Search: 866 GSC impressions (demand signal). 23 comparison relationships. 57 dependent pages can absorb hands-on evidence after completion. Current evidence: data_verified → target hands_on_tested.
- Commercial: Affiliate enabled — hands-on trust can improve conversion on commercial CTAs without changing ranking logic. Do not invent revenue impact; prioritize by dependents + demand.

**Pages that may use hands-on evidence after genuine completion** (57) — do **not** rewrite until the human test exists:
- Reviews / pricing: 2 — /software/getresponse/, /pricing/getresponse/
- Comparisons / alternatives: 45 — sample: /compare/activecampaign-vs-getresponse/, /compare/aweber-vs-getresponse/, /compare/campaign-monitor-vs-getresponse/, /compare/getresponse-vs-mailchimp/, /compare/brevo-vs-getresponse/, /compare/getresponse-vs-klaviyo/
- Best pages: 1 — /best/email-marketing-software/
- Guides: 8 — sample: /guides/what-is-email-marketing/, /guides/how-to-choose-email-marketing/, /guides/email-marketing-pricing-guide/, /guides/getresponse-implementation/, /guides/getresponse-migration/, /guides/getresponse-setup/
- Other: 1 — /tools/crm-cost-calculator/
- Full list: `data/editorial/testing/packs/2026-09-09/top-10.json` → `getresponse`

### 7. Nimble (`nimble`)

Protocol: **crm-hands-on** · Evidence today: **data_verified** · Est. human time: **35–55 min** · Draft session: test-mtt7i80m-wcrfqc

_CRM express: signup → contact/company/deal → one automation → admin/help → pricing._

**Signup / test account path**
- Catalogue website: https://www.nimble.com
- Human must confirm a working trial/signup path (this probe only checks homepage reachability)
- Record plan chooser friction, card-required, and email verification steps in the create-account task
- Homepage reachable (HTTP 200) — proceed to locate Trial/Sign up
- Probe: reachable=true http=200

**Completion criteria**
- Session status reaches COMPLETE only via Finish (human) — never AI-simulated
- All 12 required protocol tasks recorded as PASS, PARTIAL, FAIL, NOT_AVAILABLE, NOT_APPLICABLE, or BLOCKED (none left NOT_STARTED)
- At least one strength or weakness in the final assessment
- Human confirmation checkbox checked (I personally completed this test)
- Recommend HANDS_ON_TESTED only if the session genuinely supports a hands-on claim
- Screenshots uploaded for signup, core workflow, and pricing where possible
- setupMinutes / pricingObserved filled when observed
- Dependent review/comparison/best pages flagged after completion — do not auto-rewrite until then
- Protocol: crm-hands-on

**Protocol tasks (concrete)**
- **REQ** `create-account` — Create account: Sign up for a trial or sandbox account. Record plan, signup friction, and verification steps.
  - Evidence: SCREENSHOT, TIMING, OBSERVATION · screenshot required when feasible
- **REQ** `complete-onboarding` — Complete onboarding: Finish the product onboarding / setup wizard. Note forced steps, skips, and clarity.
  - Evidence: SCREENSHOT, TIMING, OBSERVATION · screenshot required when feasible
- **REQ** `import-sample-contacts` — Import sample contacts: Import a small CSV or sample contact set. Record mapping UX and errors.
  - Evidence: FEATURE_TEST, TIMING, SCREENSHOT · screenshot required when feasible
- **REQ** `create-company` — Create company: Create an organization/company record and link a contact.
  - Evidence: FEATURE_TEST, SCREENSHOT · screenshot required when feasible
- **REQ** `create-pipeline` — Create pipeline: Create or customize a sales pipeline with stages.
  - Evidence: FEATURE_TEST, SCREENSHOT · screenshot required when feasible
- **REQ** `create-deal` — Create deal: Create a deal/opportunity on the pipeline.
  - Evidence: FEATURE_TEST, SCREENSHOT · screenshot required when feasible
- **REQ** `move-deal-through-pipeline` — Move deal through pipeline: Advance the deal across stages (drag-and-drop or stage change).
  - Evidence: FEATURE_TEST, OBSERVATION
- **REQ** `configure-automation` — Configure automation: Create a simple workflow/automation (e.g. stage change → activity).
  - Evidence: FEATURE_TEST, SCREENSHOT, LIMITATION · screenshot required when feasible
- opt `create-report-dashboard` — Create report / dashboard: Build or open a report/dashboard relevant to pipeline activity. Stretch for 45–60m sessions — mark BLOCKED/NOT_AVAILABLE if timeboxed.
  - Evidence: FEATURE_TEST, SCREENSHOT · screenshot required when feasible
- opt `test-email-integration` — Test email / integration: Connect or exercise email sync / a core integration if the plan allows. Stretch — use NOT_AVAILABLE/BLOCKED when gated or out of time.
  - Evidence: INTEGRATION_TEST, LIMITATION, OBSERVATION
- opt `test-search` — Test search: Search for contacts, companies, and deals; note relevance and speed. Stretch for express sessions.
  - Evidence: FEATURE_TEST, OBSERVATION
- opt `test-permissions` — Test permissions: If available on the plan, verify role/permission controls for a second user or visibility setting.
  - Evidence: FEATURE_TEST, NOT_AVAILABLE
- opt `test-mobile-responsiveness` — Test mobile / responsiveness: Open the web app on a narrow viewport or mobile app if available; note usable vs broken flows.
  - Evidence: OBSERVATION, SCREENSHOT, LIMITATION · screenshot required when feasible
- **REQ** `inspect-admin-configuration` — Inspect admin / configuration: Review admin settings: custom fields, pipelines, users, billing entry points.
  - Evidence: OBSERVATION, SCREENSHOT · screenshot required when feasible
- **REQ** `inspect-help-support` — Inspect help / support: Open in-app help, docs, chat, or ticket paths. Record channel quality — do not invent response times you did not experience.
  - Evidence: SUPPORT_TEST, OBSERVATION
- **REQ** `record-setup-friction` — Record setup friction: Summarize time-to-value, confusing steps, and blockers from account creation through first useful pipeline view.
  - Evidence: TIMING, OBSERVATION, LIMITATION
- **REQ** `verify-pricing` — Verify pricing: Compare in-app / billing plan labels to the public pricing page. Record plan tested and list prices observed.
  - Evidence: PRICING, SCREENSHOT · screenshot required when feasible

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

**Comparison questions / notes prompts**
- Vs HubSpot/Pipedrive-class peers: setup speed
- Vs spreadsheet/email-only: when is this worth paying for?
- Would you recommend for a 3–15 person sales team on this plan?

**Screenshots required (session-level)**
- Signup / onboarding step
- Contact list or import result
- Company record
- Pipeline board with deal
- Automation builder
- Report/dashboard
- Admin/settings
- Public pricing + in-app plan

**Manual testing checklist (human)**
- **Signup / onboarding**
  - Create trial/sandbox account; record plan and verification steps
  - Complete onboarding wizard; note forced steps and clarity
  - Time-to-first useful screen
- **Key workflow tasks**
  - Execute the category-core workflow (CRM pipeline / email campaign / SI enrichment)
  - Import or create sample records
  - Complete one end-to-end useful outcome
- **Pricing verification**
  - Compare in-app / billing plan labels to the public pricing page
  - Record seat/contact/credit gates observed
  - Note trial length and card-required friction
- **Usability**
  - Navigation clarity after first session
  - Search / find-record quality
  - Mobile or narrow viewport if available (else NOT_AVAILABLE)
- **Integrations**
  - Open integration catalog or connect one core integration if plan allows
  - Record gated vs available connectors
- **Automation**
  - Create or inspect one automation/workflow on the tested plan
  - Note builder clarity and plan gates
- **Reporting**
  - Open or build one report/dashboard relevant to the workflow
  - Judge usefulness for the intended buyer
- **Limitations**
  - List concrete blockers, missing features, or confusing UX
  - Separate plan gates from product design limits
- **Support / help experience**
  - Open in-app help, docs, chat, or ticket paths
  - Record only channels you actually opened — do not invent response times
- **Screenshots needed**
  - Signup/onboarding
  - Core workflow screen
  - Automation or reporting
  - Admin/settings
  - Public pricing + in-app plan
- **Comparison observations**
  - Answer protocol comparison questions with first-hand notes
  - Would you recommend for the target buyer on this plan? Why/why not?

**Strength prompts**
- What was surprisingly easy after signup?
- Which CRM workflow felt production-ready?

**Weakness / friction prompts**
- Where did onboarding or pipeline UX create friction?
- What important feature was missing, gated, or confusing?

**Potential impact (after genuine completion)**
- Search: 302 GSC impressions (demand signal). 36 comparison relationships. 48 dependent pages can absorb hands-on evidence after completion. Current evidence: data_verified → target hands_on_tested.
- Commercial: No affiliate today — still high editorial/trust value for reviews and comps. Do not invent revenue impact; prioritize by dependents + demand.

**Pages that may use hands-on evidence after genuine completion** (48) — do **not** rewrite until the human test exists:
- Reviews / pricing: 2 — /software/nimble/, /pricing/nimble/
- Comparisons / alternatives: 38 — sample: /compare/act-vs-nimble/, /compare/affinity-vs-nimble/, /compare/agile-crm-vs-nimble/, /compare/apptivo-vs-nimble/, /compare/attio-vs-nimble/, /compare/bitrix24-vs-nimble/
- Best pages: 1 — /best/crm-software/
- Guides: 6 — sample: /guides/what-is-nimble/, /guides/nimble-implementation/, /guides/nimble-migration/, /guides/nimble-setup/, /guides/nimble-plans/, /guides/is-nimble-worth-it/
- Other: 1 — /tools/crm-cost-calculator/
- Full list: `data/editorial/testing/packs/2026-09-09/top-10.json` → `nimble`

### 8. ActiveCampaign (`activecampaign`)

Protocol: **email-marketing-hands-on** · Evidence today: **data_verified** · Est. human time: **45–60 min** · Draft session: test-mtt7i80s-7xgcnh

_Larger product surface — stick to required tasks; mark stretch as NOT_AVAILABLE/BLOCKED if timeboxed._

**Signup / test account path**
- Catalogue website: https://www.activecampaign.com
- Human must confirm a working trial/signup path (this probe only checks homepage reachability)
- Record plan chooser friction, card-required, and email verification steps in the create-account task
- Homepage reachable (HTTP 200) — proceed to locate Trial/Sign up
- Probe: reachable=true http=200

**Completion criteria**
- Session status reaches COMPLETE only via Finish (human) — never AI-simulated
- All 11 required protocol tasks recorded as PASS, PARTIAL, FAIL, NOT_AVAILABLE, NOT_APPLICABLE, or BLOCKED (none left NOT_STARTED)
- At least one strength or weakness in the final assessment
- Human confirmation checkbox checked (I personally completed this test)
- Recommend HANDS_ON_TESTED only if the session genuinely supports a hands-on claim
- Screenshots uploaded for signup, core workflow, and pricing where possible
- setupMinutes / pricingObserved filled when observed
- Dependent review/comparison/best pages flagged after completion — do not auto-rewrite until then
- Protocol: email-marketing-hands-on

**Protocol tasks (concrete)**
- **REQ** `create-account` — Create account: Sign up for a trial. Record plan selected, verification steps, and signup friction.
  - Evidence: SCREENSHOT, TIMING, OBSERVATION · screenshot required when feasible
- **REQ** `complete-onboarding` — Complete onboarding: Finish setup wizard (domain/brand/list). Note forced vs optional steps.
  - Evidence: SCREENSHOT, TIMING, OBSERVATION · screenshot required when feasible
- **REQ** `import-or-create-list` — Import or create a list: Create a list/audience and import a small CSV or add contacts manually.
  - Evidence: FEATURE_TEST, SCREENSHOT, TIMING · screenshot required when feasible
- **REQ** `inspect-contact-profile` — Inspect contact profile: Open a contact record; note fields, tags, activity timeline, and edit UX.
  - Evidence: FEATURE_TEST, SCREENSHOT · screenshot required when feasible
- **REQ** `create-campaign-draft` — Create campaign draft: Build a draft email/campaign (subject, body, audience). Do not send to real customers.
  - Evidence: FEATURE_TEST, SCREENSHOT · screenshot required when feasible
- **REQ** `test-editor` — Test email editor: Exercise drag-and-drop or code editor; note templates, mobile preview, and limitations.
  - Evidence: FEATURE_TEST, OBSERVATION, LIMITATION
- **REQ** `configure-automation` — Configure automation: Create a simple automation (e.g. tag added → send email / wait).
  - Evidence: FEATURE_TEST, SCREENSHOT, LIMITATION · screenshot required when feasible
- opt `test-form-or-landing` — Test form / landing page: Create or open a signup form or landing page builder if available on the plan. Stretch for 45–60m sessions.
  - Evidence: FEATURE_TEST, SCREENSHOT, NOT_AVAILABLE · screenshot required when feasible
- **REQ** `inspect-analytics` — Inspect analytics / reporting: Open campaign or automation reports (opens, clicks, bounce). Note clarity of metrics.
  - Evidence: FEATURE_TEST, SCREENSHOT · screenshot required when feasible
- opt `test-integration` — Test integration catalog: Open integrations directory; attempt or inspect a CRM/ecommerce connection if plan allows. Stretch — use BLOCKED/NOT_AVAILABLE when gated.
  - Evidence: INTEGRATION_TEST, LIMITATION, OBSERVATION
- opt `inspect-deliverability-settings` — Inspect deliverability settings: Find domain authentication (SPF/DKIM/DMARC), sending domains, or reputation tips. Stretch for express sessions.
  - Evidence: OBSERVATION, SCREENSHOT · screenshot required when feasible
- opt `test-search` — Test search: Search contacts, campaigns, and automations; note speed and relevance. Stretch for express sessions.
  - Evidence: FEATURE_TEST, OBSERVATION
- opt `test-permissions` — Test permissions / team: If available, review user roles or invite a second seat; else mark NOT_AVAILABLE.
  - Evidence: FEATURE_TEST, NOT_AVAILABLE
- opt `test-mobile-responsiveness` — Test mobile / responsiveness: Narrow viewport or mobile app; note usable vs broken flows.
  - Evidence: OBSERVATION, SCREENSHOT, LIMITATION · screenshot required when feasible
- **REQ** `inspect-help-support` — Inspect help / support: Open help center, chat, or ticket paths. Only record channels you actually opened.
  - Evidence: SUPPORT_TEST, OBSERVATION
- **REQ** `record-setup-friction` — Record setup friction: Summarize time-to-first-useful draft, confusing steps, and blockers.
  - Evidence: TIMING, OBSERVATION, LIMITATION
- **REQ** `verify-pricing` — Verify pricing: Compare in-app / billing plan labels to the public pricing page. Record plan tested.
  - Evidence: PRICING, SCREENSHOT · screenshot required when feasible

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

**Comparison questions / notes prompts**
- Vs peer email tools: editor speed and template quality
- Vs CRM-bundled email: depth of automation
- Would you recommend for a 5–20 person marketing team?

**Screenshots required (session-level)**
- Signup / plan chooser
- List import or audience screen
- Campaign editor (desktop)
- Automation canvas
- Analytics/report
- Public pricing + in-app billing (side by side)

**Manual testing checklist (human)**
- **Signup / onboarding**
  - Create trial/sandbox account; record plan and verification steps
  - Complete onboarding wizard; note forced steps and clarity
  - Time-to-first useful screen
- **Key workflow tasks**
  - Execute the category-core workflow (CRM pipeline / email campaign / SI enrichment)
  - Import or create sample records
  - Complete one end-to-end useful outcome
- **Pricing verification**
  - Compare in-app / billing plan labels to the public pricing page
  - Record seat/contact/credit gates observed
  - Note trial length and card-required friction
- **Usability**
  - Navigation clarity after first session
  - Search / find-record quality
  - Mobile or narrow viewport if available (else NOT_AVAILABLE)
- **Integrations**
  - Open integration catalog or connect one core integration if plan allows
  - Record gated vs available connectors
- **Automation**
  - Create or inspect one automation/workflow on the tested plan
  - Note builder clarity and plan gates
- **Reporting**
  - Open or build one report/dashboard relevant to the workflow
  - Judge usefulness for the intended buyer
- **Limitations**
  - List concrete blockers, missing features, or confusing UX
  - Separate plan gates from product design limits
- **Support / help experience**
  - Open in-app help, docs, chat, or ticket paths
  - Record only channels you actually opened — do not invent response times
- **Screenshots needed**
  - Signup/onboarding
  - Core workflow screen
  - Automation or reporting
  - Admin/settings
  - Public pricing + in-app plan
- **Comparison observations**
  - Answer protocol comparison questions with first-hand notes
  - Would you recommend for the target buyer on this plan? Why/why not?

**Strength prompts**
- What felt faster or clearer than expected?
- Which workflow would you trust for a live send?

**Weakness / friction prompts**
- Where did you get stuck or confuse terminology?
- What feature felt gated, incomplete, or misleading vs marketing claims?

**Potential impact (after genuine completion)**
- Search: 1019 GSC impressions (demand signal). 24 comparison relationships. 61 dependent pages can absorb hands-on evidence after completion. Current evidence: data_verified → target hands_on_tested.
- Commercial: Affiliate enabled — hands-on trust can improve conversion on commercial CTAs without changing ranking logic. Do not invent revenue impact; prioritize by dependents + demand.

**Pages that may use hands-on evidence after genuine completion** (61) — do **not** rewrite until the human test exists:
- Reviews / pricing: 2 — /software/activecampaign/, /pricing/activecampaign/
- Comparisons / alternatives: 43 — sample: /compare/activecampaign-vs-getresponse/, /compare/activecampaign-vs-mailchimp/, /compare/activecampaign-vs-klaviyo/, /compare/activecampaign-vs-aweber/, /compare/activecampaign-vs-beehiiv/, /compare/activecampaign-vs-bouncer/
- Best pages: 2 — /best/crm-software/, /best/email-marketing-software/
- Guides: 13 — sample: /guides/what-is-email-marketing/, /guides/how-to-choose-email-marketing/, /guides/email-marketing-pricing-guide/, /guides/how-email-marketing-works/, /guides/types-of-email-marketing/, /guides/email-marketing-vs-crm/
- Other: 1 — /tools/crm-cost-calculator/
- Full list: `data/editorial/testing/packs/2026-09-09/top-10.json` → `activecampaign`

### 9. Salesforce (`salesforce`)

Protocol: **crm-hands-on** · Evidence today: **data_verified** · Est. human time: **45–60 min** · Draft session: test-mtt7i80v-1jzdlj

_Larger product surface — stick to required tasks; mark stretch as NOT_AVAILABLE/BLOCKED if timeboxed._

**Signup / test account path**
- Catalogue website: https://www.salesforce.com
- Human must confirm a working trial/signup path (this probe only checks homepage reachability)
- Record plan chooser friction, card-required, and email verification steps in the create-account task
- Homepage reachable (HTTP 200) — proceed to locate Trial/Sign up
- Probe: reachable=true http=200

**Completion criteria**
- Session status reaches COMPLETE only via Finish (human) — never AI-simulated
- All 12 required protocol tasks recorded as PASS, PARTIAL, FAIL, NOT_AVAILABLE, NOT_APPLICABLE, or BLOCKED (none left NOT_STARTED)
- At least one strength or weakness in the final assessment
- Human confirmation checkbox checked (I personally completed this test)
- Recommend HANDS_ON_TESTED only if the session genuinely supports a hands-on claim
- Screenshots uploaded for signup, core workflow, and pricing where possible
- setupMinutes / pricingObserved filled when observed
- Dependent review/comparison/best pages flagged after completion — do not auto-rewrite until then
- Protocol: crm-hands-on

**Protocol tasks (concrete)**
- **REQ** `create-account` — Create account: Sign up for a trial or sandbox account. Record plan, signup friction, and verification steps.
  - Evidence: SCREENSHOT, TIMING, OBSERVATION · screenshot required when feasible
- **REQ** `complete-onboarding` — Complete onboarding: Finish the product onboarding / setup wizard. Note forced steps, skips, and clarity.
  - Evidence: SCREENSHOT, TIMING, OBSERVATION · screenshot required when feasible
- **REQ** `import-sample-contacts` — Import sample contacts: Import a small CSV or sample contact set. Record mapping UX and errors.
  - Evidence: FEATURE_TEST, TIMING, SCREENSHOT · screenshot required when feasible
- **REQ** `create-company` — Create company: Create an organization/company record and link a contact.
  - Evidence: FEATURE_TEST, SCREENSHOT · screenshot required when feasible
- **REQ** `create-pipeline` — Create pipeline: Create or customize a sales pipeline with stages.
  - Evidence: FEATURE_TEST, SCREENSHOT · screenshot required when feasible
- **REQ** `create-deal` — Create deal: Create a deal/opportunity on the pipeline.
  - Evidence: FEATURE_TEST, SCREENSHOT · screenshot required when feasible
- **REQ** `move-deal-through-pipeline` — Move deal through pipeline: Advance the deal across stages (drag-and-drop or stage change).
  - Evidence: FEATURE_TEST, OBSERVATION
- **REQ** `configure-automation` — Configure automation: Create a simple workflow/automation (e.g. stage change → activity).
  - Evidence: FEATURE_TEST, SCREENSHOT, LIMITATION · screenshot required when feasible
- opt `create-report-dashboard` — Create report / dashboard: Build or open a report/dashboard relevant to pipeline activity. Stretch for 45–60m sessions — mark BLOCKED/NOT_AVAILABLE if timeboxed.
  - Evidence: FEATURE_TEST, SCREENSHOT · screenshot required when feasible
- opt `test-email-integration` — Test email / integration: Connect or exercise email sync / a core integration if the plan allows. Stretch — use NOT_AVAILABLE/BLOCKED when gated or out of time.
  - Evidence: INTEGRATION_TEST, LIMITATION, OBSERVATION
- opt `test-search` — Test search: Search for contacts, companies, and deals; note relevance and speed. Stretch for express sessions.
  - Evidence: FEATURE_TEST, OBSERVATION
- opt `test-permissions` — Test permissions: If available on the plan, verify role/permission controls for a second user or visibility setting.
  - Evidence: FEATURE_TEST, NOT_AVAILABLE
- opt `test-mobile-responsiveness` — Test mobile / responsiveness: Open the web app on a narrow viewport or mobile app if available; note usable vs broken flows.
  - Evidence: OBSERVATION, SCREENSHOT, LIMITATION · screenshot required when feasible
- **REQ** `inspect-admin-configuration` — Inspect admin / configuration: Review admin settings: custom fields, pipelines, users, billing entry points.
  - Evidence: OBSERVATION, SCREENSHOT · screenshot required when feasible
- **REQ** `inspect-help-support` — Inspect help / support: Open in-app help, docs, chat, or ticket paths. Record channel quality — do not invent response times you did not experience.
  - Evidence: SUPPORT_TEST, OBSERVATION
- **REQ** `record-setup-friction` — Record setup friction: Summarize time-to-value, confusing steps, and blockers from account creation through first useful pipeline view.
  - Evidence: TIMING, OBSERVATION, LIMITATION
- **REQ** `verify-pricing` — Verify pricing: Compare in-app / billing plan labels to the public pricing page. Record plan tested and list prices observed.
  - Evidence: PRICING, SCREENSHOT · screenshot required when feasible

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

**Comparison questions / notes prompts**
- Vs HubSpot/Pipedrive-class peers: setup speed
- Vs spreadsheet/email-only: when is this worth paying for?
- Would you recommend for a 3–15 person sales team on this plan?

**Screenshots required (session-level)**
- Signup / onboarding step
- Contact list or import result
- Company record
- Pipeline board with deal
- Automation builder
- Report/dashboard
- Admin/settings
- Public pricing + in-app plan

**Manual testing checklist (human)**
- **Signup / onboarding**
  - Create trial/sandbox account; record plan and verification steps
  - Complete onboarding wizard; note forced steps and clarity
  - Time-to-first useful screen
- **Key workflow tasks**
  - Execute the category-core workflow (CRM pipeline / email campaign / SI enrichment)
  - Import or create sample records
  - Complete one end-to-end useful outcome
- **Pricing verification**
  - Compare in-app / billing plan labels to the public pricing page
  - Record seat/contact/credit gates observed
  - Note trial length and card-required friction
- **Usability**
  - Navigation clarity after first session
  - Search / find-record quality
  - Mobile or narrow viewport if available (else NOT_AVAILABLE)
- **Integrations**
  - Open integration catalog or connect one core integration if plan allows
  - Record gated vs available connectors
- **Automation**
  - Create or inspect one automation/workflow on the tested plan
  - Note builder clarity and plan gates
- **Reporting**
  - Open or build one report/dashboard relevant to the workflow
  - Judge usefulness for the intended buyer
- **Limitations**
  - List concrete blockers, missing features, or confusing UX
  - Separate plan gates from product design limits
- **Support / help experience**
  - Open in-app help, docs, chat, or ticket paths
  - Record only channels you actually opened — do not invent response times
- **Screenshots needed**
  - Signup/onboarding
  - Core workflow screen
  - Automation or reporting
  - Admin/settings
  - Public pricing + in-app plan
- **Comparison observations**
  - Answer protocol comparison questions with first-hand notes
  - Would you recommend for the target buyer on this plan? Why/why not?

**Strength prompts**
- What was surprisingly easy after signup?
- Which CRM workflow felt production-ready?

**Weakness / friction prompts**
- Where did onboarding or pipeline UX create friction?
- What important feature was missing, gated, or confusing?

**Potential impact (after genuine completion)**
- Search: 264 GSC impressions (demand signal). 37 comparison relationships. 64 dependent pages can absorb hands-on evidence after completion. Current evidence: data_verified → target hands_on_tested.
- Commercial: No affiliate today — still high editorial/trust value for reviews and comps. Do not invent revenue impact; prioritize by dependents + demand.

**Pages that may use hands-on evidence after genuine completion** (64) — do **not** rewrite until the human test exists:
- Reviews / pricing: 2 — /software/salesforce/, /pricing/salesforce/
- Comparisons / alternatives: 54 — sample: /compare/act-vs-salesforce/, /compare/affinity-vs-salesforce/, /compare/agile-crm-vs-salesforce/, /compare/apptivo-vs-salesforce/, /compare/attio-vs-salesforce/, /compare/bitrix24-vs-salesforce/
- Best pages: 1 — /best/crm-software/
- Guides: 6 — sample: /guides/what-is-salesforce/, /guides/salesforce-implementation/, /guides/salesforce-migration/, /guides/salesforce-setup/, /guides/salesforce-plans/, /guides/is-salesforce-worth-it/
- Other: 1 — /tools/crm-cost-calculator/
- Full list: `data/editorial/testing/packs/2026-09-09/top-10.json` → `salesforce`

### 10. Freshsales (`freshsales`)

Protocol: **crm-hands-on** · Evidence today: **data_verified** · Est. human time: **35–55 min** · Draft session: test-mtt7i80x-ciw7ro

_CRM express: signup → contact/company/deal → one automation → admin/help → pricing._

**Signup / test account path**
- Catalogue website: https://www.freshworks.com/crm/sales/
- Human must confirm a working trial/signup path (this probe only checks homepage reachability)
- Record plan chooser friction, card-required, and email verification steps in the create-account task
- Homepage reachable (HTTP 200) — proceed to locate Trial/Sign up
- Probe: reachable=true http=200

**Completion criteria**
- Session status reaches COMPLETE only via Finish (human) — never AI-simulated
- All 12 required protocol tasks recorded as PASS, PARTIAL, FAIL, NOT_AVAILABLE, NOT_APPLICABLE, or BLOCKED (none left NOT_STARTED)
- At least one strength or weakness in the final assessment
- Human confirmation checkbox checked (I personally completed this test)
- Recommend HANDS_ON_TESTED only if the session genuinely supports a hands-on claim
- Screenshots uploaded for signup, core workflow, and pricing where possible
- setupMinutes / pricingObserved filled when observed
- Dependent review/comparison/best pages flagged after completion — do not auto-rewrite until then
- Protocol: crm-hands-on

**Protocol tasks (concrete)**
- **REQ** `create-account` — Create account: Sign up for a trial or sandbox account. Record plan, signup friction, and verification steps.
  - Evidence: SCREENSHOT, TIMING, OBSERVATION · screenshot required when feasible
- **REQ** `complete-onboarding` — Complete onboarding: Finish the product onboarding / setup wizard. Note forced steps, skips, and clarity.
  - Evidence: SCREENSHOT, TIMING, OBSERVATION · screenshot required when feasible
- **REQ** `import-sample-contacts` — Import sample contacts: Import a small CSV or sample contact set. Record mapping UX and errors.
  - Evidence: FEATURE_TEST, TIMING, SCREENSHOT · screenshot required when feasible
- **REQ** `create-company` — Create company: Create an organization/company record and link a contact.
  - Evidence: FEATURE_TEST, SCREENSHOT · screenshot required when feasible
- **REQ** `create-pipeline` — Create pipeline: Create or customize a sales pipeline with stages.
  - Evidence: FEATURE_TEST, SCREENSHOT · screenshot required when feasible
- **REQ** `create-deal` — Create deal: Create a deal/opportunity on the pipeline.
  - Evidence: FEATURE_TEST, SCREENSHOT · screenshot required when feasible
- **REQ** `move-deal-through-pipeline` — Move deal through pipeline: Advance the deal across stages (drag-and-drop or stage change).
  - Evidence: FEATURE_TEST, OBSERVATION
- **REQ** `configure-automation` — Configure automation: Create a simple workflow/automation (e.g. stage change → activity).
  - Evidence: FEATURE_TEST, SCREENSHOT, LIMITATION · screenshot required when feasible
- opt `create-report-dashboard` — Create report / dashboard: Build or open a report/dashboard relevant to pipeline activity. Stretch for 45–60m sessions — mark BLOCKED/NOT_AVAILABLE if timeboxed.
  - Evidence: FEATURE_TEST, SCREENSHOT · screenshot required when feasible
- opt `test-email-integration` — Test email / integration: Connect or exercise email sync / a core integration if the plan allows. Stretch — use NOT_AVAILABLE/BLOCKED when gated or out of time.
  - Evidence: INTEGRATION_TEST, LIMITATION, OBSERVATION
- opt `test-search` — Test search: Search for contacts, companies, and deals; note relevance and speed. Stretch for express sessions.
  - Evidence: FEATURE_TEST, OBSERVATION
- opt `test-permissions` — Test permissions: If available on the plan, verify role/permission controls for a second user or visibility setting.
  - Evidence: FEATURE_TEST, NOT_AVAILABLE
- opt `test-mobile-responsiveness` — Test mobile / responsiveness: Open the web app on a narrow viewport or mobile app if available; note usable vs broken flows.
  - Evidence: OBSERVATION, SCREENSHOT, LIMITATION · screenshot required when feasible
- **REQ** `inspect-admin-configuration` — Inspect admin / configuration: Review admin settings: custom fields, pipelines, users, billing entry points.
  - Evidence: OBSERVATION, SCREENSHOT · screenshot required when feasible
- **REQ** `inspect-help-support` — Inspect help / support: Open in-app help, docs, chat, or ticket paths. Record channel quality — do not invent response times you did not experience.
  - Evidence: SUPPORT_TEST, OBSERVATION
- **REQ** `record-setup-friction` — Record setup friction: Summarize time-to-value, confusing steps, and blockers from account creation through first useful pipeline view.
  - Evidence: TIMING, OBSERVATION, LIMITATION
- **REQ** `verify-pricing` — Verify pricing: Compare in-app / billing plan labels to the public pricing page. Record plan tested and list prices observed.
  - Evidence: PRICING, SCREENSHOT · screenshot required when feasible

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

**Comparison questions / notes prompts**
- Vs HubSpot/Pipedrive-class peers: setup speed
- Vs spreadsheet/email-only: when is this worth paying for?
- Would you recommend for a 3–15 person sales team on this plan?

**Screenshots required (session-level)**
- Signup / onboarding step
- Contact list or import result
- Company record
- Pipeline board with deal
- Automation builder
- Report/dashboard
- Admin/settings
- Public pricing + in-app plan

**Manual testing checklist (human)**
- **Signup / onboarding**
  - Create trial/sandbox account; record plan and verification steps
  - Complete onboarding wizard; note forced steps and clarity
  - Time-to-first useful screen
- **Key workflow tasks**
  - Execute the category-core workflow (CRM pipeline / email campaign / SI enrichment)
  - Import or create sample records
  - Complete one end-to-end useful outcome
- **Pricing verification**
  - Compare in-app / billing plan labels to the public pricing page
  - Record seat/contact/credit gates observed
  - Note trial length and card-required friction
- **Usability**
  - Navigation clarity after first session
  - Search / find-record quality
  - Mobile or narrow viewport if available (else NOT_AVAILABLE)
- **Integrations**
  - Open integration catalog or connect one core integration if plan allows
  - Record gated vs available connectors
- **Automation**
  - Create or inspect one automation/workflow on the tested plan
  - Note builder clarity and plan gates
- **Reporting**
  - Open or build one report/dashboard relevant to the workflow
  - Judge usefulness for the intended buyer
- **Limitations**
  - List concrete blockers, missing features, or confusing UX
  - Separate plan gates from product design limits
- **Support / help experience**
  - Open in-app help, docs, chat, or ticket paths
  - Record only channels you actually opened — do not invent response times
- **Screenshots needed**
  - Signup/onboarding
  - Core workflow screen
  - Automation or reporting
  - Admin/settings
  - Public pricing + in-app plan
- **Comparison observations**
  - Answer protocol comparison questions with first-hand notes
  - Would you recommend for the target buyer on this plan? Why/why not?

**Strength prompts**
- What was surprisingly easy after signup?
- Which CRM workflow felt production-ready?

**Weakness / friction prompts**
- Where did onboarding or pipeline UX create friction?
- What important feature was missing, gated, or confusing?

**Potential impact (after genuine completion)**
- Search: 193 GSC impressions (demand signal). 36 comparison relationships. 60 dependent pages can absorb hands-on evidence after completion. Current evidence: data_verified → target hands_on_tested.
- Commercial: Affiliate enabled — hands-on trust can improve conversion on commercial CTAs without changing ranking logic. Do not invent revenue impact; prioritize by dependents + demand.

**Pages that may use hands-on evidence after genuine completion** (60) — do **not** rewrite until the human test exists:
- Reviews / pricing: 2 — /software/freshsales/, /pricing/freshsales/
- Comparisons / alternatives: 50 — sample: /compare/act-vs-freshsales/, /compare/affinity-vs-freshsales/, /compare/agile-crm-vs-freshsales/, /compare/apptivo-vs-freshsales/, /compare/attio-vs-freshsales/, /compare/bitrix24-vs-freshsales/
- Best pages: 1 — /best/crm-software/
- Guides: 6 — sample: /guides/how-to-choose-crm/, /guides/freshsales-implementation/, /guides/freshsales-migration/, /guides/freshsales-setup/, /guides/freshsales-plans/, /guides/is-freshsales-worth-it/
- Other: 1 — /tools/crm-cost-calculator/
- Full list: `data/editorial/testing/packs/2026-09-09/top-10.json` → `freshsales`

## After genuine completion

Propagation flags dependent refresh tasks only. Editorial rewrites wait for human evidence — see `docs/editorial/PRODUCT-TESTING-REFRESH-TASKS.md` after finish.

## Integrity

- AI must **not** auto-complete, simulate, or fabricate any test result.
- Draft sessions start with every protocol task `NOT_STARTED`; completion requires human PASS/PARTIAL/FAIL/NOT_AVAILABLE/NOT_APPLICABLE/BLOCKED plus strengths/weaknesses plus human confirmation.
- `HANDS_ON_TESTED` is assigned only after a completed human session that recommends the claim **and** confirms personal completion.

