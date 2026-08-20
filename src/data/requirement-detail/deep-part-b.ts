import type { RequirementDetailProfile } from "@/domain";

type Depth = Pick<
  RequirementDetailProfile,
  | "displayTitle"
  | "tagline"
  | "overview"
  | "whoThisIsFor"
  | "whatMattersIntro"
  | "workedExample"
  | "workedExampleSecondary"
  | "challenges"
  | "outcomes"
  | "acceptanceNeeds"
  | "workflowSteps"
  | "heroVisual"
  | "needsVisual"
  | "workflowVisual"
  | "faq"
  | "useCaseLinks"
  | "primaryCapabilityHref"
>;

/**
 * Depth layer B for CRM requirement detail pages (`/requirements/[slug]/`).
 * Educational / buyer-validation oriented — no invented rankings, prices,
 * product endorsements, or fake metrics.
 */
export const requirementDepthPartB: Record<string, Depth> = {
  "customize-record-fields": {
    displayTitle: "CRM requirement: customize record fields",
    tagline:
      "Make qualification, compliance, and reporting fields first-class on the record — not trapped in notes nobody can filter.",
    overview:
      "Customizing record fields means administrators can add structured attributes to contacts, companies, leads, and deals so the CRM reflects how the team actually qualifies and reports. The requirement is not “can we add a text box?” — it is whether those fields are typed correctly, required where the process needs them, usable in layouts and filters, and available to reports and automation. Teams that skip this end up with process data in free-text notes that never show up in a dashboard.",
    whoThisIsFor:
      "RevOps and CRM admins who must encode process-specific data (ICP fit, regulated attributes, delivery constraints) on shared records. It also matters for sales managers whose Friday reviews depend on fields that do not exist in the default schema — especially multi-product SaaS, agencies with client taxonomy, and financial-services teams with suitability or risk attributes.",
    whatMattersIntro:
      "Evaluate field types, required-field rules, layout control, and whether custom fields are filterable and reportable — not how many fields the marketing page claims. A dropdown that drives pipeline hygiene beats fifty optional text fields nobody fills in. Confirm plan limits per object before you design the model.",
    workedExample:
      "Worked example: a global SaaS sales org selling three SKUs across enterprise and mid-market. Before CRM, “product interest,” “security review status,” and “procurement vehicle” lived in AE notes and a shared sheet. After CRM, those attributes are required fields on the opportunity with dropdown values — pipeline reviews filter stuck security reviews without archaeology.",
    workedExampleSecondary:
      "Worked example: a multi-country creative agency. Before CRM, client industry, retainer tier, and primary office lived inconsistently across project tools. After CRM, company records carry those fields on a standard layout, so account handoffs and utilization reports use the same taxonomy.",
    challenges: [
      {
        id: "notes-as-schema",
        title: "Process data lives in notes",
        pain: "Managers cannot filter or report on qualification attributes buried in free text.",
        crmHelps:
          "Typed custom fields put process data on the record where filters, views, and reports can use it.",
      },
      {
        id: "optional-chaos",
        title: "Fields exist but nobody fills them",
        pain: "Optional custom fields pile up; reports stay empty because required checkpoints were never enforced.",
        crmHelps:
          "Required fields and stage-aware layouts force capture at the moment the process needs the data.",
      },
      {
        id: "layout-noise",
        title: "Layouts show every field to everyone",
        pain: "Reps ignore the form because it looks like a tax return of irrelevant attributes.",
        crmHelps:
          "Role- or process-specific layouts surface only the fields that matter for that job.",
      },
      {
        id: "dead-fields",
        title: "Custom fields cannot drive reports or rules",
        pain: "You capture data that automation and dashboards cannot read, so the model never pays off.",
        crmHelps:
          "Reportable and automation-ready fields turn customization into operational leverage.",
      },
    ],
    outcomes: [
      {
        id: "shared-schema",
        title: "A shared process schema",
        description:
          "Qualification and handoff attributes mean the same thing on every record.",
      },
      {
        id: "reviewable-filters",
        title: "Reviews that filter on real checkpoints",
        description:
          "Managers open views for “missing security status” instead of hunting notes.",
      },
      {
        id: "cleaner-handoffs",
        title: "Cleaner account and deal handoffs",
        description:
          "Covering reps inherit structured context, not a scavenger hunt.",
      },
      {
        id: "automation-ready",
        title: "Automation that can branch correctly",
        description:
          "Rules and tasks key off field values instead of guesswork.",
      },
    ],
    acceptanceNeeds: [
      {
        id: "admin-create",
        title: "Admin-created fields without vendor tickets",
        description:
          "Administrators can add fields on core objects during configuration — not only via professional services.",
        priority: "must",
        href: "/capabilities/customization/",
      },
      {
        id: "field-types",
        title: "Field types that match the process",
        description:
          "Dropdowns, dates, numbers, checkboxes, and relationships cover your qualification model — not text-only.",
        priority: "must",
      },
      {
        id: "required-layouts",
        title: "Required fields and controlled layouts",
        description:
          "You can require critical attributes and present different layouts by role or process.",
        priority: "must",
      },
      {
        id: "report-filter",
        title: "Filterable and reportable custom fields",
        description:
          "Custom fields appear in list filters, saved views, and reporting — not display-only.",
        priority: "must",
        href: "/capabilities/reporting/",
      },
      {
        id: "automation-use",
        title: "Readable/writable in automation",
        description:
          "Workflow rules can branch on and update custom field values after hygiene is real.",
        priority: "nice",
        href: "/capabilities/workflow-automation/",
      },
      {
        id: "field-limits",
        title: "Clear per-object field limits on the plan",
        description:
          "Limits are documented per object so you do not design a model the tier cannot hold.",
        priority: "nice",
      },
    ],
    workflowSteps: [
      {
        id: "inventory",
        label: "Inventory process attributes",
        detail:
          "List the 8–15 attributes reviews and handoffs actually need — exclude “nice someday” fields.",
      },
      {
        id: "types",
        label: "Map types and required rules",
        detail:
          "Assign field types, owners, and when each field becomes required (create, qualify, propose).",
      },
      {
        id: "demo-create",
        label: "Create fields in the trial",
        detail:
          "Have an admin add them live; confirm layouts, permissions, and mobile forms without a vendor ticket.",
      },
      {
        id: "prove-report",
        label: "Prove filters and reports",
        detail:
          "Build a saved view and a report that group or filter on those fields with sample data.",
      },
      {
        id: "prove-automation",
        label: "Spot-check automation",
        detail:
          "If you need rules, trigger one branch on a custom field change and confirm the task or update fires.",
      },
    ],
    heroVisual: {
      src: "/requirements/customize-record-fields-hero.png",
      alt: "CRM record layout mockup showing custom qualification fields, required markers, and a filterable list view using those fields",
      caption:
        "Custom fields earn their keep when they appear on the layout, can be required, and drive filters — not when they only exist in a settings menu.",
    },
    needsVisual: {
      src: "/requirements/customize-record-fields-needs.png",
      alt: "Diagram contrasting process data trapped in notes versus typed custom fields usable in layouts, filters, and reports",
      caption:
        "Problems → fixes: notes-as-schema, optional-field neglect, layout noise, and fields that never reach reports.",
    },
    workflowVisual: {
      src: "/requirements/customize-record-fields-workflow.png",
      alt: "Five-step buyer validation flow from attribute inventory through trial field creation to report and automation proof",
      caption:
        "Validate customization by building the real schema in trial — not by accepting a screenshot of a field builder.",
    },
    faq: [
      {
        question: "Is “unlimited custom fields” enough to satisfy this requirement?",
        answer:
          "No. Count matters less than types, required rules, layouts, and whether fields are filterable and reportable. A plan with fewer well-behaved fields can beat one with many display-only attributes.",
      },
      {
        question: "Should every process detail become a custom field?",
        answer:
          "No. Reserve structured fields for attributes you will filter, report, require, or automate on. Narrative context belongs in notes or activity — forcing everything into fields creates form fatigue.",
      },
      {
        question: "Who should own the field model?",
        answer:
          "Usually RevOps or a named CRM admin with sales-manager input. Unowned field sprawl is how schemas rot; treat additions like product changes with a short approval path.",
      },
      {
        question: "How does this relate to separate sales processes?",
        answer:
          "Multiple pipelines often need different required fields at different stages. Field customization and process separation reinforce each other — validate both if you sell more than one motion.",
      },
    ],
    useCaseLinks: [
      {
        id: "complex-sales",
        title: "Complex sales processes",
        description:
          "Multi-step deals need stage-specific attributes that default schemas rarely include.",
        importanceLabel: "High",
        href: "/use-cases/complex-sales-processes/",
        icon: "layers",
      },
      {
        id: "account-mgmt",
        title: "Account management",
        description:
          "Retainer, segment, and health attributes should live on the account — not in AM notebooks.",
        importanceLabel: "High",
        href: "/use-cases/account-management/",
        icon: "briefcase",
      },
      {
        id: "reporting-uc",
        title: "Reporting",
        description:
          "Custom fields only pay off when managers can report on them consistently.",
        importanceLabel: "Critical",
        href: "/use-cases/reporting/",
        icon: "chart",
      },
    ],
    primaryCapabilityHref: "/capabilities/customization/",
  },

  "support-multiple-currencies": {
    displayTitle: "CRM requirement: support multiple currencies",
    tagline:
      "Price deals in local currency and still roll pipeline and forecast into one leadership number without a reconciliation spreadsheet.",
    overview:
      "Multi-currency support means each opportunity can store value in the currency it is sold in, while reporting and forecasting can still produce totals in a chosen reporting currency. The hard part is not a currency dropdown — it is exchange-rate handling, when conversion is applied, and whether mixed-currency pipelines remain trustworthy in weekly reviews. Teams that fake this with notes or separate boards spend every forecast cycle reconciling instead of coaching.",
    whoThisIsFor:
      "Global SaaS sales leaders, multi-country agencies, and exporters whose AEs close in EUR, GBP, USD, and local currencies while finance and leadership need one pipeline view. It matters once mixed currencies appear in the same forecast meeting — not when every deal is already in one home currency.",
    whatMattersIntro:
      "Validate deal-level currency, reporting rollup or conversion, forecast basis, and how exchange rates are set or updated. Ask when conversion happens (entry, report run, close) and whether historical amounts stay stable when rates change. Plan gating often hides true multi-currency behind higher tiers — confirm on your trial plan.",
    workedExample:
      "Worked example: a SaaS company with US, UK, and DACH AEs. Before CRM, EUR and GBP deals were typed as USD “equivalents” in a sheet; Monday forecast changed whenever someone updated FX. After CRM, each deal stores native currency and reporting converts to USD with a documented rate policy — reviews argue about stages, not spreadsheet math.",
    workedExampleSecondary:
      "Worked example: a multi-country agency billing retainers in local currency. Before CRM, pipeline boards were split by office so leadership never saw one book of business. After CRM, one pipeline shows native amounts with a reporting-currency total, and finance can reconcile without re-keying deals.",
    challenges: [
      {
        id: "mixed-totals",
        title: "Pipeline totals mix currencies silently",
        pain: "Leadership sums EUR and USD as if they were the same unit and trusts a nonsense number.",
        crmHelps:
          "Deal currency plus reporting conversion or grouping keeps totals on an explicit basis.",
      },
      {
        id: "fx-drift",
        title: "Exchange rates live in someone’s head",
        pain: "Forecast meetings stall while someone pastes rates from a browser tab.",
        crmHelps:
          "Configurable or synced rates with a clear policy make conversion repeatable.",
      },
      {
        id: "split-boards",
        title: "Separate boards per currency or country",
        pain: "Managers lose cross-region visibility and duplicate hygiene work.",
        crmHelps:
          "One pipeline with currency on the deal replaces fragmented regional lists.",
      },
      {
        id: "forecast-fiction",
        title: "Forecast ignores currency basis",
        pain: "Commit numbers shift when someone “updates FX” without changing deal reality.",
        crmHelps:
          "Forecast views that declare reporting currency reduce accidental restatement.",
      },
    ],
    outcomes: [
      {
        id: "native-pricing",
        title: "Deals priced in the currency sold",
        description:
          "AEs stop translating locally won amounts into approximate home-currency guesses.",
      },
      {
        id: "one-leadership-view",
        title: "One leadership rollup",
        description:
          "Pipeline and forecast meetings share a documented reporting-currency total.",
      },
      {
        id: "less-reconciliation",
        title: "Less weekly FX reconciliation",
        description:
          "Finance and sales argue about stages and risk — not paste errors.",
      },
      {
        id: "honest-history",
        title: "Clearer historical amounts",
        description:
          "You know whether past deals keep entry-time conversion or restate with new rates.",
      },
    ],
    acceptanceNeeds: [
      {
        id: "deal-currency",
        title: "Currency on each opportunity",
        description:
          "Deal value and currency are first-class fields — not a note or a custom text hack.",
        priority: "must",
        href: "/capabilities/deal-management/",
      },
      {
        id: "report-rollup",
        title: "Reporting across currencies",
        description:
          "Reports can group by currency and/or convert into a chosen reporting currency.",
        priority: "must",
        href: "/capabilities/reporting/",
      },
      {
        id: "forecast-basis",
        title: "Forecast on a consistent currency basis",
        description:
          "Forecast views declare how mixed-currency deals contribute to the commit number.",
        priority: "must",
        href: "/capabilities/forecasting/",
      },
      {
        id: "rate-policy",
        title: "Documented exchange-rate handling",
        description:
          "You can see how rates are set, how often they update, and when conversion applies.",
        priority: "must",
      },
      {
        id: "multi-currency-admin",
        title: "Admin control of enabled currencies",
        description:
          "Administrators can enable the currencies you sell in without a custom engineering project.",
        priority: "nice",
        href: "/capabilities/administration/",
      },
      {
        id: "accounting-align",
        title: "Alignment path with finance systems",
        description:
          "You can keep CRM amounts coherent with invoicing or ERP currency rules where required.",
        priority: "nice",
        href: "/capabilities/integrations/",
      },
    ],
    workflowSteps: [
      {
        id: "list-currencies",
        label: "List selling currencies",
        detail:
          "Name every currency that appears on real quotes today — including edge regional deals.",
      },
      {
        id: "define-reporting",
        label: "Choose reporting currency & rate policy",
        detail:
          "Decide home currency, who owns rates, and whether historical deals restate when rates move.",
      },
      {
        id: "enter-mixed",
        label: "Enter mixed-currency sample deals",
        detail:
          "In trial, create deals in at least two currencies with realistic amounts and stages.",
      },
      {
        id: "run-rollup",
        label: "Run pipeline and forecast rollups",
        detail:
          "Open the same views leadership will use; confirm totals and currency labels match the policy.",
      },
      {
        id: "rate-change",
        label: "Test a rate change",
        detail:
          "Update a rate (or wait for a sync) and observe whether open vs closed amounts behave as expected.",
      },
    ],
    heroVisual: {
      src: "/requirements/support-multiple-currencies-hero.png",
      alt: "CRM pipeline and forecast UI showing deals in EUR, GBP, and USD with a reporting-currency total and exchange-rate indicator",
      caption:
        "Multi-currency is credible when native deal amounts and the leadership rollup share an explicit conversion basis.",
    },
    needsVisual: {
      src: "/requirements/support-multiple-currencies-needs.png",
      alt: "Diagram of mixed-currency total errors, FX chase, split boards, and forecast fiction versus CRM currency fields and rollups",
      caption:
        "Problems → fixes: silent mixed totals, informal FX, fragmented boards, and forecasts without a currency basis.",
    },
    workflowVisual: {
      src: "/requirements/support-multiple-currencies-workflow.png",
      alt: "Five-step validation flow from currency inventory through sample deals to rollup and rate-change tests",
      caption:
        "Prove multi-currency in the trial with mixed deals and a deliberate rate-change test — not a feature checkbox.",
    },
    faq: [
      {
        question: "Can we satisfy this with a custom “currency” text field?",
        answer:
          "Usually not for leadership reporting. A text or picklist without conversion-aware reporting still forces spreadsheet rollups. Treat native deal currency plus reporting behavior as the bar.",
      },
      {
        question: "Do we need multi-currency if only a few deals are foreign?",
        answer:
          "If leadership still wants one number, yes at small volume — exceptions are where reconciliation pain starts. If foreign deals are rare and reviewed separately, you may defer until mix grows.",
      },
      {
        question: "Should CRM be the system of record for exchange rates?",
        answer:
          "Not always. Many teams let finance own rates and need CRM either to accept admin-set rates or to stay clearly labeled as approximate for sales. Align the policy before go-live.",
      },
      {
        question: "How does this interact with sales forecasting?",
        answer:
          "Forecast commit views inherit deal currency. If conversion is unclear, forecast meetings become FX debates. Validate forecasting on the same mixed sample set as pipeline reporting.",
      },
    ],
    useCaseLinks: [
      {
        id: "pipeline-uc",
        title: "Pipeline management",
        description:
          "One board only works globally when deal currency does not corrupt stage totals.",
        importanceLabel: "Critical",
        href: "/use-cases/pipeline-management/",
        icon: "funnel",
      },
      {
        id: "forecast-uc",
        title: "Sales forecasting",
        description:
          "Commit numbers need a declared currency basis when regions price differently.",
        importanceLabel: "Critical",
        href: "/use-cases/sales-forecasting/",
        icon: "trending",
      },
      {
        id: "reporting-uc",
        title: "Reporting",
        description:
          "Revenue and pipeline reports must group or convert — not sum mixed symbols.",
        importanceLabel: "High",
        href: "/use-cases/reporting/",
        icon: "chart",
      },
    ],
    primaryCapabilityHref: "/capabilities/administration/",
  },

  "integrate-with-email": {
    displayTitle: "CRM requirement: integrate with email",
    tagline:
      "Connect team mailboxes so threads and meetings land on the right record — without relying on reps to paste history by hand.",
    overview:
      "Email integration connects workplace mail and often calendar to the CRM so correspondence is logged against contacts, companies, and deals. Buyers should treat this as an adoption requirement: when logging is manual, history goes missing and the CRM becomes a second system nobody trusts. Evaluate provider fit (Gmail-class and Outlook-class workplaces), inbound and outbound capture, record matching, and exclusion controls for private or sensitive threads — without assuming any single vendor’s product claims.",
    whoThisIsFor:
      "Sales and account teams whose client work mainly happens in email, plus founders and managers who need shared visibility when someone is out. It is especially acute for relationship-heavy motions, outbound pods that live in the inbox, and regulated environments that still need selective logging rather than “sync everything.”",
    whatMattersIntro:
      "Prove your mail provider works in the real tenant, that inbound and outbound messages attach to the right records, and that users can exclude threads or domains. Calendar logging and open/click tracking are secondary until basic sync is trustworthy. Ask about shared mailboxes, aliases, and what happens when two contacts share a thread.",
    workedExample:
      "Worked example: a B2B outbound team of eight. Before CRM, deal context lived in each AE’s inbox; managers reconstructed status from forwards. After CRM, mailbox sync attaches sent and received messages to the opportunity timeline, so coverage and coaching start from the thread — not from “can you forward that?”",
    workedExampleSecondary:
      "Worked example: a regulated financial-services advisory desk. Before CRM, advisors avoided logging for fear of capturing personal threads. After CRM, sync is on with exclusion rules for internal and personal domains, so client correspondence is reviewable without vacuuming private mail.",
    challenges: [
      {
        id: "manual-logging",
        title: "Reps skip manual email logging",
        pain: "The CRM timeline is empty while the real conversation continues in the inbox.",
        crmHelps:
          "Mailbox sync captures correspondence automatically so history updates without extra steps.",
      },
      {
        id: "wrong-record",
        title: "Messages land on the wrong record",
        pain: "Threads attach to duplicates or the wrong company, poisoning account history.",
        crmHelps:
          "Matching rules and contact hygiene keep mail on the intended contact or deal.",
      },
      {
        id: "privacy-fear",
        title: "People refuse sync over privacy fear",
        pain: "Adoption stalls if every personal thread might appear on a shared timeline.",
        crmHelps:
          "Exclusion controls for contacts, domains, and threads make sync acceptable to roll out.",
      },
      {
        id: "one-way-blind",
        title: "Only outbound mail is captured",
        pain: "Managers see what was sent but not the customer replies that changed the deal.",
        crmHelps:
          "Two-way capture keeps the full conversation on the record for handoffs and reviews.",
      },
    ],
    outcomes: [
      {
        id: "shared-timeline",
        title: "Shared conversation history",
        description:
          "Covering reps and managers see the thread without inbox archaeology.",
      },
      {
        id: "higher-adoption",
        title: "Higher CRM adoption",
        description:
          "The record stays current because logging is not a separate chore.",
      },
      {
        id: "cleaner-handoffs",
        title: "Cleaner leave and coverage handoffs",
        description:
          "Relationship context survives vacation, role change, or departure.",
      },
      {
        id: "selective-trust",
        title: "Selective, trustworthy capture",
        description:
          "Exclusions keep private mail out while client work remains visible.",
      },
    ],
    acceptanceNeeds: [
      {
        id: "provider-fit",
        title: "Provider fit for your mail stack",
        description:
          "Your production mail and calendar environment (Gmail-class or Outlook-class) connects in a real tenant test — not a slide.",
        priority: "must",
        href: "/capabilities/email/",
      },
      {
        id: "two-way",
        title: "Inbound and outbound capture",
        description:
          "Received and sent messages both appear on the matched record when sync is enabled.",
        priority: "must",
      },
      {
        id: "matching",
        title: "Reliable record matching",
        description:
          "Mail attaches to the correct contact, company, or deal with an understandable fallback when ambiguous.",
        priority: "must",
        href: "/capabilities/contact-management/",
      },
      {
        id: "exclusions",
        title: "Exclusion controls",
        description:
          "Users or admins can exclude threads, contacts, or domains so private mail is not forced onto timelines.",
        priority: "must",
      },
      {
        id: "calendar",
        title: "Calendar / meeting logging",
        description:
          "Meetings can appear on the record without duplicate manual entry.",
        priority: "nice",
      },
      {
        id: "tracking",
        title: "Send tracking signals",
        description:
          "Open or click signals are available if your motion uses them — evaluated after basic sync works.",
        priority: "nice",
        href: "/capabilities/sales-engagement/",
      },
      {
        id: "shared-inbox",
        title: "Shared mailbox or alias behavior",
        description:
          "If you use shared inboxes, confirm how those messages are attributed and visible.",
        priority: "nice",
      },
    ],
    workflowSteps: [
      {
        id: "name-provider",
        label: "Name the production mail setup",
        detail:
          "Document provider, desktop vs web clients, aliases, and whether shared inboxes matter.",
      },
      {
        id: "connect-trial",
        label: "Connect a real trial mailbox",
        detail:
          "Use a non-production test account in the same provider class as production.",
      },
      {
        id: "send-receive",
        label: "Send and receive on a known contact",
        detail:
          "Create a contact, exchange mail both ways, and confirm both directions hit the timeline.",
      },
      {
        id: "test-exclude",
        label: "Test exclusions",
        detail:
          "Exclude a domain or thread and verify it stays off the shared record.",
      },
      {
        id: "handoff-check",
        label: "Simulate a coverage handoff",
        detail:
          "Have a second user open the record and reconstruct the conversation without inbox access.",
      },
    ],
    heroVisual: {
      src: "/requirements/integrate-with-email-hero.png",
      alt: "CRM contact timeline mockup with synced inbound and outbound emails, calendar meeting, and exclusion control for private threads",
      caption:
        "Email integration works when both directions of the thread land on the right record — with clear ways to keep private mail out.",
    },
    needsVisual: {
      src: "/requirements/integrate-with-email-needs.png",
      alt: "Diagram of manual logging failure, wrong-record matching, privacy fear, and one-way capture versus sync with exclusions",
      caption:
        "Problems → fixes: skipped logging, mis-attached threads, sync refusal, and outbound-only capture.",
    },
    workflowVisual: {
      src: "/requirements/integrate-with-email-workflow.png",
      alt: "Five-step buyer validation flow from mail-setup inventory through two-way sync, exclusions, and coverage handoff",
      caption:
        "Validate email integration with a real provider-class mailbox and a second-user handoff test.",
    },
    faq: [
      {
        question: "Is BCC-to-CRM enough to meet this requirement?",
        answer:
          "It can help outbound logging but usually fails the “automatic and two-way” bar. If inbound replies and calendar still need manual work, treat BCC as a partial stopgap — not full integration.",
      },
      {
        question: "Do we need email tracking (opens/clicks) on day one?",
        answer:
          "Not if basic sync is broken. Tracking is a sales-engagement nicety; shared history and matching are the adoption requirement. Add tracking after timelines are trusted.",
      },
      {
        question: "How do we handle personal or HR-sensitive threads?",
        answer:
          "Require exclusion controls before wide rollout. Define domains and patterns that must never sync, and train people how to keep a thread private.",
      },
      {
        question: "Does this replace a sales engagement tool?",
        answer:
          "Not necessarily. Sync keeps history on the record; sequences and cadences are a separate motion. Many teams need both — validate sync first.",
      },
    ],
    useCaseLinks: [
      {
        id: "email-outreach",
        title: "Email outreach",
        description:
          "Outbound motions collapse when sent mail never appears on the prospect record.",
        importanceLabel: "Critical",
        href: "/use-cases/email-outreach/",
        icon: "mail",
      },
      {
        id: "relationship",
        title: "Relationship management",
        description:
          "Shared timelines are how relationship context survives handoffs.",
        importanceLabel: "High",
        href: "/use-cases/relationship-management/",
        icon: "handshake",
      },
      {
        id: "follow-up",
        title: "Customer follow-up",
        description:
          "Follow-up quality depends on seeing the last real conversation, not the last logged note.",
        importanceLabel: "High",
        href: "/use-cases/customer-follow-up/",
        icon: "zap",
      },
    ],
    primaryCapabilityHref: "/capabilities/email/",
  },

  "support-sso": {
    displayTitle: "CRM requirement: support SSO",
    tagline:
      "Authenticate CRM users through your workforce IdP with SAML or OIDC so access follows hire, role change, and departure — not leftover passwords.",
    overview:
      "Single sign-on (SSO) lets people reach the CRM through the organization’s identity provider instead of a separate CRM password. For IT-mandated environments, the requirement usually includes protocol fit (SAML and/or OIDC), enforcement so users cannot bypass SSO, and a clear story for provisioning and deprovisioning. SSO is an access-control requirement first; it does not replace role permissions inside the CRM, but it makes offboarding reliable when the IdP is already the source of truth.",
    whoThisIsFor:
      "IT and security teams that already run a workforce IdP and require SaaS apps to federate — plus RevOps admins tired of manual user cleanup after departures. It becomes non-negotiable in mid-market and enterprise rollouts, financial services, and any company where password sprawl or slow offboarding is an audit finding waiting to happen.",
    whatMattersIntro:
      "Confirm protocol support for your IdP, whether SSO can be enforced for all users, plan tier gating, and how accounts are created and disabled. Ask who can still use local login, what happens to API tokens and integrations at offboarding, and whether group-to-role mapping exists. Do not accept “SSO available” without a forced-SSO path.",
    workedExample:
      "Worked example: a 200-person SaaS company with IT-mandated Okta-class SSO. Before CRM SSO, departed AEs still had working CRM passwords for days after laptop return. After CRM SSO with enforcement, disabling the IdP account ends CRM interactive access the same day — security review stops flagging orphan SaaS logins.",
    workedExampleSecondary:
      "Worked example: a regulated FS firm onboarding a new CRM. Before federation, InfoSec blocked the purchase over separate credentials. After SAML SSO on the approved IdP with MFA inherited from the IdP policy, the CRM clears the access gate and admins manage roles inside the app separately.",
    challenges: [
      {
        id: "orphan-passwords",
        title: "Orphan CRM passwords after departure",
        pain: "Access survives laptop return because someone forgot to deactivate the CRM user.",
        crmHelps:
          "IdP-enforced SSO ties interactive access to central disablement.",
      },
      {
        id: "checkbox-sso",
        title: "SSO exists but is optional",
        pain: "Users keep local passwords and bypass the control IT thinks is in place.",
        crmHelps:
          "Enforcement requires IdP sign-in so the control matches policy.",
      },
      {
        id: "plan-surprise",
        title: "SSO locked behind an unexpected tier",
        pain: "Security requires SSO; the shortlisted plan cannot enable it.",
        crmHelps:
          "Early plan confirmation prevents buying a stack that fails IT gate checks.",
      },
      {
        id: "provision-lag",
        title: "Manual user provisioning lags hiring",
        pain: "New hires wait on ticket queues while IdP groups already know their role.",
        crmHelps:
          "Directory provisioning or clear group mapping shortens time-to-access.",
      },
    ],
    outcomes: [
      {
        id: "central-offboard",
        title: "Centralized offboarding",
        description:
          "Disabling the workforce account is the primary interactive-access kill switch.",
      },
      {
        id: "policy-align",
        title: "Aligned MFA and password policy",
        description:
          "CRM inherits IdP authentication policy instead of a weaker local scheme.",
      },
      {
        id: "faster-onboard",
        title: "Faster, cleaner onboarding",
        description:
          "Users reach the CRM through the same app portal as other work tools.",
      },
      {
        id: "audit-ready-access",
        title: "Clearer access reviews",
        description:
          "IT can reason about CRM access from IdP assignments plus in-app roles.",
      },
    ],
    acceptanceNeeds: [
      {
        id: "protocol",
        title: "SAML and/or OIDC with your IdP",
        description:
          "The protocols your workforce IdP uses are supported in a documented configuration path.",
        priority: "must",
        href: "/capabilities/security/",
      },
      {
        id: "enforce",
        title: "SSO enforcement for users",
        description:
          "Administrators can require IdP sign-in so local passwords are not a bypass.",
        priority: "must",
      },
      {
        id: "offboard",
        title: "Reliable access revocation",
        description:
          "Disabling or removing the IdP user ends interactive CRM access without a separate forgotten step.",
        priority: "must",
      },
      {
        id: "plan-clarity",
        title: "Plan tier that includes SSO",
        description:
          "The commercial tier you intend to buy actually unlocks SSO — confirmed in writing or in trial.",
        priority: "must",
      },
      {
        id: "provisioning",
        title: "Directory provisioning or group mapping",
        description:
          "Accounts can be created/deactivated from the directory, or IdP groups map to CRM roles.",
        priority: "nice",
        href: "/capabilities/administration/",
      },
      {
        id: "signin-logs",
        title: "Sign-in visibility",
        description:
          "Authentication activity is reviewable alongside broader audit needs.",
        priority: "nice",
      },
    ],
    workflowSteps: [
      {
        id: "idp-inventory",
        label: "Document IdP and protocols",
        detail:
          "Capture IdP product, SAML vs OIDC preference, MFA policy, and who owns app federation.",
      },
      {
        id: "tier-check",
        label: "Confirm SSO on the target plan",
        detail:
          "Verify the SKU in scope includes SSO before demo theater; escalate commercial gaps early.",
      },
      {
        id: "federation-pilot",
        label: "Federate a pilot app config",
        detail:
          "IT configures SSO in a sandbox or trial and signs in with a test IdP user.",
      },
      {
        id: "enforce-test",
        label: "Test enforcement and bypass paths",
        detail:
          "Attempt local login if offered; confirm only intended break-glass accounts remain.",
      },
      {
        id: "offboard-drill",
        label: "Run an offboarding drill",
        detail:
          "Disable the test user in the IdP and verify CRM interactive access fails immediately.",
      },
    ],
    heroVisual: {
      src: "/requirements/support-sso-hero.png",
      alt: "Workforce IdP sign-in flow into CRM with SAML/OIDC indicators, enforced SSO setting, and offboarding disablement path",
      caption:
        "SSO meets the requirement when federation is enforced and IdP disablement ends interactive CRM access.",
    },
    needsVisual: {
      src: "/requirements/support-sso-needs.png",
      alt: "Diagram of orphan passwords, optional SSO bypass, plan-tier surprises, and provisioning lag versus enforced IdP SSO",
      caption:
        "Problems → fixes: leftover passwords, optional SSO, tier gating surprises, and slow manual provisioning.",
    },
    workflowVisual: {
      src: "/requirements/support-sso-workflow.png",
      alt: "Five-step IT validation flow from IdP inventory through federation pilot, enforcement test, and offboarding drill",
      caption:
        "Validate SSO with an offboarding drill — not a successful one-time test login alone.",
    },
    faq: [
      {
        question: "Does SSO replace role-based permissions in the CRM?",
        answer:
          "No. SSO decides how users authenticate; roles and sharing rules decide what they can see and change. Evaluate both — federation without least-privilege permissions is incomplete.",
      },
      {
        question: "Is social login the same as workforce SSO?",
        answer:
          "No. “Sign in with a consumer identity” is not the same as SAML/OIDC to your company IdP with centralized offboarding. Specify workforce federation in requirements.",
      },
      {
        question: "What about integrations and API keys at departure?",
        answer:
          "SSO mainly covers interactive login. Ask how personal API tokens, connected mailboxes, and integration users are revoked so offboarding is complete.",
      },
      {
        question: "When is SSO optional for a small team?",
        answer:
          "If you have few users, no IdP, and low data sensitivity, password-based access may be enough short term. Once IT mandates federation or headcount grows, revisit before the next audit cycle.",
      },
    ],
    useCaseLinks: [
      {
        id: "account-mgmt",
        title: "Account management",
        description:
          "Long-lived account teams need access that tracks workforce changes cleanly.",
        importanceLabel: "Medium",
        href: "/use-cases/account-management/",
        icon: "briefcase",
      },
      {
        id: "complex-sales",
        title: "Complex sales processes",
        description:
          "Larger deal teams often sit in IT-gated environments where SSO is mandatory.",
        importanceLabel: "High",
        href: "/use-cases/complex-sales-processes/",
        icon: "layers",
      },
      {
        id: "field-sales",
        title: "Field sales",
        description:
          "Mobile and remote access still needs to honor central identity controls.",
        importanceLabel: "Medium",
        href: "/use-cases/field-sales/",
        icon: "users",
      },
    ],
    primaryCapabilityHref: "/capabilities/security/",
  },

  "audit-user-activity": {
    displayTitle: "CRM requirement: audit user activity",
    tagline:
      "Keep a reviewable trail of who viewed, changed, exported, or deleted CRM data — long enough to investigate incidents and departures.",
    overview:
      "Auditing user activity means the CRM records security-relevant actions — sign-ins, record changes, configuration edits, exports, and deletions — in a form administrators or security can review and export. Record-level “last modified by” is not enough when you need to know who exported a list or changed sharing rules. This requirement rises sharply in regulated financial services, any team with bulk export risk, and departure forensics when someone leaves under a cloud.",
    whoThisIsFor:
      "Security, compliance, and CRM admins who must answer “who did what, when?” after an incident, access review, or employee departure. It also matters for multi-admin orgs where configuration drift needs ownership, and for leadership that must prove customer data access was controlled — not merely hoped for.",
    whatMattersIntro:
      "Evaluate event coverage (especially exports and deletions), retention length, who can read logs without full super-admin rights, and whether logs export to your SIEM or files. Ask what is not logged. Pair audit with permissions: logs detect; roles prevent. Plan tiers often gate full audit — confirm before purchase.",
    workedExample:
      "Worked example: departure forensics on a mid-market sales team. Before CRM audit logs, a departed AE’s list exports were invisible; IT only saw that the laptop was returned. After CRM audit with export events retained, security reconstructs which views were exported and when — then tightens export permissions for remaining roles.",
    workedExampleSecondary:
      "Worked example: a regulated FS CRM with multiple administrators. Before usable audit, configuration changes were tribal knowledge and rollback was guesswork. After CRM audit covering permission and field-config changes, admins can attribute who widened sharing last Thursday and reverse it with evidence.",
    challenges: [
      {
        id: "export-blind",
        title: "Exports leave no trail",
        pain: "Someone downloads the customer list and nothing records that it happened.",
        crmHelps:
          "Audit events for exports and bulk actions make exfiltration investigable.",
      },
      {
        id: "short-retention",
        title: "Logs expire before investigations finish",
        pain: "A quarterly review or delayed incident finds the trail already gone.",
        crmHelps:
          "Retention long enough for your review cycle — or export to long-term storage.",
      },
      {
        id: "last-modified-only",
        title: "Only ‘last modified by’ exists",
        pain: "You see the latest editor, not the full change or access history you need.",
        crmHelps:
          "Dedicated audit logs cover actions beyond a single modified-by stamp.",
      },
      {
        id: "admin-only-darkness",
        title: "Only super-admins can read logs",
        pain: "Security cannot investigate without sharing break-glass credentials.",
        crmHelps:
          "Scoped auditor access lets the right people review without full configuration power.",
      },
    ],
    outcomes: [
      {
        id: "investigable",
        title: "Investigable incidents",
        description:
          "You can reconstruct who changed or exported data within the retention window.",
      },
      {
        id: "departure-ready",
        title: "Departure-ready forensics",
        description:
          "Offboarding reviews include CRM activity, not only IdP disablement.",
      },
      {
        id: "config-accountability",
        title: "Configuration accountability",
        description:
          "Permission and field changes have owners when something breaks.",
      },
      {
        id: "exportable-evidence",
        title: "Exportable evidence",
        description:
          "Logs can leave the CRM for SIEM, tickets, or compliance archives.",
      },
    ],
    acceptanceNeeds: [
      {
        id: "coverage",
        title: "Coverage of security-relevant events",
        description:
          "Sign-ins, record edits, deletions, exports, and configuration changes are in scope — confirm each category.",
        priority: "must",
        href: "/capabilities/security/",
      },
      {
        id: "retention",
        title: "Retention that matches review cycles",
        description:
          "Logs remain available long enough for incident response and periodic access review.",
        priority: "must",
      },
      {
        id: "reviewer-access",
        title: "Auditor access without full admin",
        description:
          "Security or compliance can review logs without receiving unrestricted CRM configuration rights.",
        priority: "must",
        href: "/capabilities/administration/",
      },
      {
        id: "log-export",
        title: "Log export or streaming",
        description:
          "You can export logs or send them to your own systems for longer retention.",
        priority: "must",
      },
      {
        id: "field-history",
        title: "Field-level change history",
        description:
          "For sensitive objects, before/after values help investigations beyond “record updated.”",
        priority: "nice",
      },
      {
        id: "alerts",
        title: "Alerting on suspicious patterns",
        description:
          "Optional alerts for bulk export or unusual admin changes — after core logging works.",
        priority: "nice",
      },
    ],
    workflowSteps: [
      {
        id: "threat-list",
        label: "List investigation scenarios",
        detail:
          "Write the top cases: departure export, permission drift, mass delete, and unusual sign-in.",
      },
      {
        id: "coverage-matrix",
        label: "Build a coverage matrix",
        detail:
          "For each scenario, mark whether the CRM logs the event, for how long, and who can read it.",
      },
      {
        id: "generate-events",
        label: "Generate test events in trial",
        detail:
          "Edit a record, change a permission, export a list, and delete a sample — as separate actors.",
      },
      {
        id: "read-as-auditor",
        label: "Read logs as a non-super-admin",
        detail:
          "Confirm the security role can find those events without break-glass credentials.",
      },
      {
        id: "export-proof",
        label: "Export or forward a sample",
        detail:
          "Pull a file or API sample into the tool you would use in a real investigation.",
      },
    ],
    heroVisual: {
      src: "/requirements/audit-user-activity-hero.png",
      alt: "CRM audit log UI showing export, field change, and permission-change events with actor, timestamp, and export action",
      caption:
        "Audit meets the bar when exports and configuration changes are visible — not only ‘last modified by’ on a record.",
    },
    needsVisual: {
      src: "/requirements/audit-user-activity-needs.png",
      alt: "Diagram of blind exports, short retention, last-modified-only history, and super-admin-only log access versus proper audit trails",
      caption:
        "Problems → fixes: silent exports, expired trails, thin modified-by stamps, and logs locked to super-admins.",
    },
    workflowVisual: {
      src: "/requirements/audit-user-activity-workflow.png",
      alt: "Five-step validation flow from investigation scenarios through test events, auditor access, and log export proof",
      caption:
        "Prove audit by generating real events — including an export — and reading them as the auditor role.",
    },
    faq: [
      {
        question: "Is activity timeline the same as an audit log?",
        answer:
          "Not always. Sales activity timelines show calls and notes; audit logs should cover security-relevant actions like exports, deletions, and permission changes. Ask for both explicitly.",
      },
      {
        question: "How long should we retain CRM audit logs?",
        answer:
          "Match your incident and access-review cycles — many teams need months, not days. If native retention is short, require export to your archive or SIEM as part of acceptance.",
      },
      {
        question: "Does SSO remove the need for CRM audit logs?",
        answer:
          "No. SSO improves authentication and offboarding; audit explains what an authenticated user did inside the CRM after sign-in.",
      },
      {
        question: "What should we pair with audit logging?",
        answer:
          "Role permissions and export controls. Logging without least privilege only tells you about damage after it happens; use both detect and prevent.",
      },
    ],
    useCaseLinks: [
      {
        id: "account-mgmt",
        title: "Account management",
        description:
          "Long-lived customer data needs accountable access and change history.",
        importanceLabel: "High",
        href: "/use-cases/account-management/",
        icon: "briefcase",
      },
      {
        id: "reporting-uc",
        title: "Reporting",
        description:
          "Sensitive report and list exports are a common audit hotspot.",
        importanceLabel: "High",
        href: "/use-cases/reporting/",
        icon: "chart",
      },
      {
        id: "complex-sales",
        title: "Complex sales processes",
        description:
          "Multi-stakeholder deals often sit in environments that demand investigable trails.",
        importanceLabel: "Medium",
        href: "/use-cases/complex-sales-processes/",
        icon: "layers",
      },
    ],
    primaryCapabilityHref: "/capabilities/security/",
  },
};
