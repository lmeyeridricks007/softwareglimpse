import type { FeatureVisualKind } from "@/services/feature-detail/visual-kind";
import { featureVisualKindForSlug } from "@/services/feature-detail/visual-kind";

export type FeatureWorkedExample = {
  id: string;
  title: string;
  situation: string;
  whatGoodLooksLike: string;
  whatToAskVendors: string;
};

const BY_KIND: Record<FeatureVisualKind, FeatureWorkedExample[]> = {
  contacts: [
    {
      id: "shared-account-view",
      title: "Two people working the same account",
      situation:
        "An account manager and a specialist both talk to the same client in one week. Without a shared contact/account record, notes live in inboxes and the client repeats themselves.",
      whatGoodLooksLike:
        "One contact linked to one account, with calls/emails/notes on a single timeline and a clear owner for follow-up.",
      whatToAskVendors:
        "How are contacts related to companies? Can both roles see the same timeline? Who can edit sensitive fields?",
    },
    {
      id: "handoff",
      title: "Sales-to-success handoff",
      situation:
        "A won deal needs onboarding. Success inherits a thin spreadsheet row and loses the buying history that explained the deal.",
      whatGoodLooksLike:
        "The contact and account keep opportunity history, stakeholders, and next tasks after the stage changes.",
      whatToAskVendors:
        "What carries over when a deal is won? Can we restrict who sees commercial fields after handoff?",
    },
  ],
  leads: [
    {
      id: "form-to-owner",
      title: "Website enquiry needs an owner in minutes",
      situation:
        "A demo request arrives at 4:50pm. If it sits in a shared inbox, response time slips and attribution is lost.",
      whatGoodLooksLike:
        "The lead is created with source, routed to an owner, and a first-touch task or sequence starts automatically.",
      whatToAskVendors:
        "How does form capture create leads? Can routing use territory or round-robin? What happens after hours?",
    },
    {
      id: "qualify-convert",
      title: "Qualifying before pipeline clutter",
      situation:
        "SDRs convert every enquiry into opportunities, so the pipeline fills with noise and forecasts inflate.",
      whatGoodLooksLike:
        "Leads stay in a qualification state until criteria are met, then convert into a contact/opportunity cleanly.",
      whatToAskVendors:
        "What is the conversion path from lead to contact/deal? Can unqualified leads be recycled without deleting history?",
    },
  ],
  pipeline: [
    {
      id: "stage-discipline",
      title: "Managers need stage truth, not optimism",
      situation:
        "Reps keep deals in late stages for weeks. Leadership cannot tell what is stuck versus what is real.",
      whatGoodLooksLike:
        "Stages have entry criteria, ownership, and next-action fields that make stalled deals visible.",
      whatToAskVendors:
        "Can stage changes require fields? Can we run multiple pipelines? How do we report aging by stage?",
    },
    {
      id: "team-handoff-stages",
      title: "Different motions, same CRM",
      situation:
        "Inbound and outbound use different stage names but leadership wants one operating rhythm.",
      whatGoodLooksLike:
        "Separate pipelines or clear stage definitions per motion, with shared reporting definitions.",
      whatToAskVendors:
        "Do you support multiple pipelines? Can reports compare them without double counting?",
    },
  ],
  deals: [
    {
      id: "deal-value-owner",
      title: "Forecast needs reliable deal fields",
      situation:
        "Deal amounts and close dates are optional, so weekly forecast meetings become guesswork.",
      whatGoodLooksLike:
        "Value, close date, stage, and owner are required and visible on the deal record used in forecasting.",
      whatToAskVendors:
        "Which deal fields are required by stage? How are products/line items modeled if we sell packages?",
    },
  ],
  automation: [
    {
      id: "no-show-followup",
      title: "No-show follow-up without chasing manually",
      situation:
        "Demo no-shows only get followed up if someone remembers. Volume makes that unreliable.",
      whatGoodLooksLike:
        "A stage or meeting outcome triggers a task or email sequence, with an owner and stop conditions.",
      whatToAskVendors:
        "What can trigger automation? Can it create tasks and emails? Which actions are plan-gated?",
    },
    {
      id: "stage-checklist",
      title: "Standardize stage entry work",
      situation:
        "Some reps move deals forward without capturing decision-maker or next meeting, and reviews stall.",
      whatGoodLooksLike:
        "Stage changes create checklist tasks or block progression until key fields exist.",
      whatToAskVendors:
        "Can automation enforce required fields? Can managers see which rules fired?",
    },
  ],
  sequences: [
    {
      id: "outbound-cadence",
      title: "Consistent outbound without spreadsheet cadences",
      situation:
        "Each rep invents their own follow-up timing. Coverage is uneven and coaching is hard.",
      whatGoodLooksLike:
        "A shared sequence with steps, exit on reply, and visibility into where prospects sit in the cadence.",
      whatToAskVendors:
        "Can sequences mix email and tasks? Do replies auto-exit? Are sending limits plan-dependent?",
    },
  ],
  email: [
    {
      id: "timeline-completeness",
      title: "Client asks ‘did you get my email?’",
      situation:
        "Two teammates emailed the same contact from personal inboxes. The CRM timeline is incomplete.",
      whatGoodLooksLike:
        "Synced mail appears on the contact/account timeline with clear ownership and visibility rules.",
      whatToAskVendors:
        "Is sync two-way? Which folders sync? Can shared mailboxes be connected? What is excluded for privacy?",
    },
  ],
  calls: [
    {
      id: "call-next-step",
      title: "Call happened — next step did not",
      situation:
        "Reps log that a call occurred but forget the agreed follow-up, so deals go quiet.",
      whatGoodLooksLike:
        "Call logging captures outcome and creates a dated next task on the same record.",
      whatToAskVendors:
        "How are calls logged? Can outcomes map to tasks? Is dialer/integration required?",
    },
  ],
  reporting: [
    {
      id: "weekly-ops",
      title: "Weekly ops review without spreadsheet exports",
      situation:
        "Managers export CSV every Friday because native reports cannot show stage aging and activity together.",
      whatGoodLooksLike:
        "Saved reports cover pipeline by stage, activity, and ownership with shareable views.",
      whatToAskVendors:
        "Can we save and share reports? Which objects/fields are reportable on our plan?",
    },
  ],
  forecasting: [
    {
      id: "commit-vs-bestcase",
      title: "Separate commit from upside",
      situation:
        "Everything in late stage is treated as commit, so the month-end number surprises finance.",
      whatGoodLooksLike:
        "Forecast categories or probability rules make commit vs upside explicit and reviewable.",
      whatToAskVendors:
        "How is forecast category set? Can managers override? Is forecasting available on our plan?",
    },
  ],
  analytics: [
    {
      id: "conversion-drop",
      title: "Find where conversion drops",
      situation:
        "Lead volume is fine but revenue is flat. Nobody can see which stage loses the most deals.",
      whatGoodLooksLike:
        "Funnel or conversion analytics show stage-to-stage drop-off over a chosen period.",
      whatToAskVendors:
        "Which analytics are native vs add-on? Can we filter by team/source without exporting?",
    },
  ],
  integrations: [
    {
      id: "no-rekey",
      title: "Stop re-typing customers into billing",
      situation:
        "Won customers are re-entered into billing manually, creating mismatches and delays.",
      whatGoodLooksLike:
        "A maintained integration moves the fields you need in the right direction, with failure visibility.",
      whatToAskVendors:
        "Is there a native connector for our stack? What fields sync? Who gets alerted on failures?",
    },
  ],
  fields: [
    {
      id: "process-fields",
      title: "Capture the fields your process actually uses",
      situation:
        "Your qualification checklist lives in Notion because CRM only has name/email/company.",
      whatGoodLooksLike:
        "Custom fields (and required rules) match the checklist without forcing a separate system of record.",
      whatToAskVendors:
        "How many custom fields per object? Can they be required by stage? Are they available in reports?",
    },
  ],
  mobile: [
    {
      id: "field-notes",
      title: "Capture notes before the car ride ends",
      situation:
        "Field conversations get typed up hours later — or never — so the CRM stays empty.",
      whatGoodLooksLike:
        "Mobile access lets reps log notes/calls against the right contact while context is fresh.",
      whatToAskVendors:
        "What can be done offline? Does mobile support the same required fields as desktop?",
    },
  ],
  ai: [
    {
      id: "draft-assist",
      title: "Draft faster, still review",
      situation:
        "Reps spend too long rewriting similar follow-ups, but leadership will not accept unsupervised sends.",
      whatGoodLooksLike:
        "AI suggests a draft from CRM context; a human edits and sends. Suggestions are not treated as facts.",
      whatToAskVendors:
        "What context does AI use? Can we disable auto-send? Is AI plan-gated or usage-limited?",
    },
  ],
  permissions: [
    {
      id: "team-boundaries",
      title: "Teams should not see each other’s books",
      situation:
        "Two regions share one CRM. Without record visibility rules, reps can browse other regions’ clients.",
      whatGoodLooksLike:
        "Roles and team rules limit record visibility and export to what each role needs.",
      whatToAskVendors:
        "Is access role-based, team-based, or both? Can exports be restricted? Field-level controls?",
    },
  ],
  sso: [
    {
      id: "joiner-mover-leaver",
      title: "Joiners and leavers without shared passwords",
      situation:
        "Contractors keep CRM access after projects end because logins were shared or manual.",
      whatGoodLooksLike:
        "SSO ties CRM access to company identity so leavers lose access with the IdP change.",
      whatToAskVendors:
        "Which IdPs are supported? Is SSO on our plan? How are users provisioned/deprovisioned?",
    },
  ],
  audit: [
    {
      id: "who-changed-it",
      title: "Someone changed the stage — who?",
      situation:
        "A late-stage deal moves backward overnight. Without audit history, coaching and governance stall.",
      whatGoodLooksLike:
        "Audit logs show who changed key fields and when, with enough retention for your reviews.",
      whatToAskVendors:
        "What events are logged? How long are logs retained? Who can view/export audit data?",
    },
  ],
  default: [
    {
      id: "define-need",
      title: "Start from the weekly workflow",
      situation:
        "A team shortlists CRMs by brand popularity, then discovers the feature does not match how they work week to week.",
      whatGoodLooksLike:
        "You can describe a concrete weekly scenario and check whether the feature supports that scenario end-to-end.",
      whatToAskVendors:
        "Show the workflow in product. Which plan is required? What related features are needed to make it useful?",
    },
  ],
};

/** Educational worked examples — never product recommendations. */
export function workedExamplesForFeature(
  featureSlug: string,
  _featureName: string,
): FeatureWorkedExample[] {
  const kind = featureVisualKindForSlug(featureSlug);
  const examples = BY_KIND[kind] ?? BY_KIND.default;
  return examples.slice(0, 2);
}
