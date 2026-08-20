import type { ResourceHubProfile } from "@/domain";
import { crmBusinessCaseTemplateDepth } from "./crm-business-case-template";
import { crmDecisionMatrixDepth } from "./crm-decision-matrix";

type Depth = Partial<Omit<ResourceHubProfile, "resourceSlug">>;

/**
 * Depth layer (part D) for CRM resource hub pages — decide + justify + optimize + clean.
 * Educational / operational — no invented rankings, prices, ROI %, or product endorsements.
 */
export const resourceDepthPartD: Record<string, Depth> = {
  "crm-comparison-worksheet": crmDecisionMatrixDepth,

  "crm-business-case-template": crmBusinessCaseTemplateDepth,

  "crm-optimization-checklist": {
    displayTitle: "CRM Optimization Checklist",
    badgeLabel: "Optimize",
    toolkitLabel: "CRM Operations Toolkit",
    tagline: "Diagnose a live CRM before you change it.",
    heroExplanation:
      "Run a health pass across adoption, data hygiene, reporting trust, and automation debt, then fix one theme at a time with an owner and an exit condition.",
    overview:
      "This checklist is for a CRM that is already live and underperforming. It measures four things — whether people work in the system, whether the data is trustworthy enough to report on, whether the reports are actually used, and how much automation debt has accumulated — and then sequences the fixes. It is not a second buying cycle and not a redesign. Batch data work such as duplicate merges belongs on the Cleanup Checklist; this page decides what to fix and in what order.",
    whoThisIsFor:
      "Ops leads, sales managers, and admins whose CRM is live but distrusted — weekly reviews still run from exports, open deals sit without next steps, or nobody can say who owns a given automation. Most useful three to twelve months after go-live.",
    whatMattersIntro:
      "Measure before you change anything. Most optimization failures come from adding fields and automations in response to complaints instead of removing the friction that caused them. Fix one theme per sprint, define what done looks like, and re-measure the same signal you started with.",
    howToUse:
      "Spend an hour on the health pass and record the four baseline signals. Pick the single theme blocking your weekly rituals. Assign owners and exit conditions, ship one small change, reinforce it for two weeks, then re-measure. Only then choose the next theme — and if a must-have turns out to be structurally missing from the product, reopen evaluation rather than optimising around it forever.",
    workedExampleStructured: {
      title: "Worked example",
      requirement:
        "Health pass question: which weekly rituals actually run from the CRM today?",
      vendors: [
        {
          name: "Signal 1 — Next step on every open deal",
          result: "FAIL",
          note: "A board filter for open deals with no dated next action returns a large share of the pipeline, so coaching and forecasting both run on memory.",
        },
        {
          name: "Signal 2 — Weekly review runs from a CRM view",
          result: "PARTIAL",
          note: "A stuck-deal view exists but the manager still exports to a sheet before the meeting, which means the view is not trusted yet.",
        },
        {
          name: "Signal 3 — Every active automation has a named owner",
          result: "FAIL",
          note: "Several stage-triggered tasks fire with no owner recorded, so reps have learned to dismiss automated tasks without reading them.",
        },
      ],
      evidence:
        "One board filter, one observation of the weekly review, and an export of active automation rules — all captured on the same day.",
      disclaimer:
        "Hypothetical health-pass scenario for teaching the artifact — not a SoftwareGlimpse case study.",
    },
    glance: {
      primaryGoal:
        "Diagnose a live CRM and fix one theme at a time with measurable exit conditions",
      typicalTeam: "Admin, sales ops, sales manager, change owner",
      commonPriorities: [
        "Adoption signals",
        "Data trust",
        "Reporting use",
        "Automation debt",
        "Admin capacity",
      ],
    },
    whatsInside: [
      {
        id: "health-pass",
        title: "Sixty-minute health pass",
        description:
          "Four baseline signals captured in one sitting, before any change is proposed.",
        icon: "chart",
      },
      {
        id: "adoption-checks",
        title: "Adoption checks",
        description:
          "Whether sellers, managers, and delivery actually work inside the system.",
        icon: "users",
      },
      {
        id: "trust-checks",
        title: "Data trust checks",
        description:
          "The hygiene problems that make reports wrong — with batch work routed to cleanup.",
        icon: "shield",
      },
      {
        id: "reporting-checks",
        title: "Reporting and forecast trust",
        description:
          "Whether the weekly ritual runs from a shared view or from a private export.",
        icon: "chart",
      },
      {
        id: "automation-debt",
        title: "Automation and integration debt",
        description:
          "Unowned rules, failing syncs, and alert fatigue that trains people to ignore the system.",
        icon: "zap",
      },
      {
        id: "capacity-decision",
        title: "Capacity and the next decision",
        description:
          "Whether admin time is funded, and when to stop optimising and reopen evaluation.",
        icon: "check",
      },
    ],
    evidenceRules: {
      countsAs: [
        "A saved view or filter anyone on the team can re-run",
        "An export of active automation rules with owners",
        "A direct observation of the weekly review as it happens",
        "A short structured interview with three named users",
      ],
      doesNotCount: [
        "“People don’t update it” as a diagnosis",
        "A composite health score with no underlying signal",
        "A single loud complaint treated as a pattern",
        "A vendor adoption benchmark applied to your team",
      ],
    },
    challenges: [],
    outcomes: [
      {
        id: "diagnosis-first",
        title: "A diagnosis instead of a hunch",
        description:
          "Four measured signals replace “people don’t update it” as the starting point.",
      },
      {
        id: "rituals-return",
        title: "Weekly rituals move back into the CRM",
        description:
          "The review runs from a shared view rather than a private export.",
      },
      {
        id: "debt-reduced",
        title: "Automation debt goes down, not up",
        description:
          "Unowned and failing rules are retired before any new ones are built.",
      },
      {
        id: "honest-exit",
        title: "An honest stop condition",
        description:
          "When a must-have is structurally missing, evaluation reopens instead of optimisation continuing forever.",
      },
    ],
    priorities: [],
    workflowSteps: [
      {
        id: "health-pass",
        label: "Run the health pass",
        detail:
          "One hour, four signals: adoption, data trust, reporting use, automation debt.",
      },
      {
        id: "pick-theme",
        label: "Pick one theme",
        detail:
          "Choose the signal most directly blocking a weekly ritual — fund only that.",
      },
      {
        id: "set-exit",
        label: "Set the exit condition",
        detail:
          "Define the re-measured number that means this theme is finished.",
      },
      {
        id: "ship-small",
        label: "Ship one small change",
        detail:
          "Remove before you add — a field cull or retired rule usually beats a new one.",
      },
      {
        id: "reinforce",
        label: "Reinforce for two weeks",
        detail:
          "Coach inside the existing weekly meeting rather than sending an announcement.",
      },
      {
        id: "remeasure",
        label: "Re-measure and decide",
        detail:
          "Same signal, same method. Then take the next theme, pause, or reopen evaluation.",
      },
    ],
    artifactSections: [
      {
        id: "health-pass",
        title: "1. Health pass — measure before you change",
        accent: "green",
        intro:
          "One sitting, four signals, nothing changed yet. These numbers are what you will re-measure at the end of each theme.",
        items: [
          {
            id: "1.1",
            label: "Signal: share of open deals without a dated next step",
            whyItMatters:
              "It is the single clearest indicator of whether the pipeline is being managed in the system or in people’s heads.",
            required: true,
            testScenario:
              "Build a saved view of open deals where next step is empty or in the past; record the count against total open deals and the date.",
            detail: "Save the view — you will re-run it, not rebuild it.",
            owner: "Sales ops",
            doneWhen: "Baseline recorded and the view saved for reuse.",
          },
          {
            id: "1.2",
            label: "Signal: active users by role over the last thirty days",
            whyItMatters:
              "Paid seats that nobody opens are both wasted spend and an early warning about the rollout.",
            required: true,
            testScenario:
              "Pull login or activity data grouped by role and note which roles are effectively absent from the system.",
            owner: "Admin",
            doneWhen: "Low-usage roles listed with a hypothesis for each.",
          },
          {
            id: "1.3",
            label: "Signal: does the weekly review run from a CRM view?",
            whyItMatters:
              "If the review still starts with an export, the reporting layer has not been adopted regardless of what exists.",
            required: true,
            testScenario:
              "Sit in one weekly pipeline meeting and record what was on screen and whether anything was exported beforehand.",
            owner: "Sales manager",
            doneWhen: "Observation recorded with the date and what was actually used.",
          },
          {
            id: "1.4",
            label: "Signal: active automations without a named owner",
            whyItMatters:
              "Unowned rules are the main source of alert fatigue, and fatigue teaches people to ignore the system.",
            required: true,
            testScenario:
              "Export the list of active automations and mark each one with an owner; count the rows where nobody can be named.",
            owner: "Admin",
            doneWhen: "Count of unowned rules recorded with the export attached.",
          },
          {
            id: "1.5",
            label: "Side channels still in daily use",
            whyItMatters:
              "A parallel spreadsheet is not a workaround, it is a competing system of record.",
            required: true,
            testScenario:
              "Ask each team which document or channel they open before the CRM, and list the top two by usage.",
            owner: "Change owner",
            doneWhen: "Top two side channels named with the team that relies on each.",
          },
          {
            id: "1.6",
            label: "Nothing changed during the health pass",
            whyItMatters:
              "Fixing things while measuring destroys the baseline you need to prove the fix worked.",
            required: true,
            testScenario:
              "Confirm no fields, stages, or rules were edited during the pass; log any urgent fix separately with its own date.",
            owner: "Admin",
            doneWhen: "Baselines captured with no concurrent configuration changes.",
          },
        ],
      },
      {
        id: "adoption",
        title: "2. Adoption — are people working in the system?",
        accent: "teal",
        intro:
          "Adoption problems are usually friction problems. Find the friction before designing the intervention.",
        items: [
          {
            id: "2.1",
            label: "Three users interviewed about what they skip and why",
            whyItMatters:
              "The specific field people skip tells you more than any aggregate usage report.",
            required: true,
            testScenario:
              "Ask three sellers to walk through creating and updating a deal, and write down every step they skip or work around.",
            owner: "Change owner",
            doneWhen: "Three friction points recorded verbatim as fix candidates.",
          },
          {
            id: "2.2",
            label: "Required fields audited against real work",
            whyItMatters:
              "Fields required for reporting convenience rather than selling are the most common cause of abandoned records.",
            required: true,
            testScenario:
              "List every required field on create and stage advance, and ask the manager who consumes it; remove or defer any with no consumer.",
            owner: "Admin",
            doneWhen: "At least one unused required field removed or made optional.",
          },
          {
            id: "2.3",
            label: "Each weekly ritual mapped to a specific CRM view",
            whyItMatters:
              "A ritual with no view behind it will always drift back to a spreadsheet.",
            required: true,
            testScenario:
              "For pipeline review, forecast, and handoff, name the exact saved view used — and record a gap where none exists.",
            owner: "Sales manager",
            doneWhen: "Every ritual has a named view or a documented gap.",
          },
          {
            id: "2.4",
            label: "Mobile or field update friction assessed (or N/A)",
            whyItMatters:
              "Sellers who cannot update from a phone will batch their updates, and batched updates are usually invented.",
            required: false,
            testScenario:
              "Have a field seller set a stage, log a note, and set a next step from their phone; record where it broke, or mark N/A.",
            owner: "Field lead",
            doneWhen: "Friction documented with an owner or marked N/A.",
          },
          {
            id: "2.5",
            label: "Closed-won handoff completeness measured",
            whyItMatters:
              "When delivery cannot get context from the record, they stop opening it and the CRM loses half its users.",
            required: false,
            testScenario:
              "Sample recent closed-won deals and check whether the agreed handoff note or fields were completed; record the rate.",
            owner: "Delivery lead",
            doneWhen: "Completion rate recorded or the handoff standard confirmed as absent.",
          },
        ],
      },
      {
        id: "data-trust",
        title: "3. Data trust — what makes the reports wrong",
        accent: "blue",
        intro:
          "Identify the hygiene problems that break reporting. Batch execution belongs on the Cleanup Checklist; here you decide what matters.",
        items: [
          {
            id: "3.1",
            label: "Open deals under inactive or departed owners identified",
            whyItMatters:
              "A forecast containing deals nobody is working is not a forecast, it is a wish list.",
            required: true,
            testScenario:
              "Filter open deals by owner status and list every deal owned by an inactive user; hand the reassignment batch to cleanup.",
            owner: "Sales ops",
            doneWhen: "List produced and routed to the cleanup workstream.",
          },
          {
            id: "3.2",
            label: "Duplicate rate spot-checked on contacts and accounts",
            whyItMatters:
              "Once search returns duplicates, sellers stop searching, and every new record makes it worse.",
            required: true,
            testScenario:
              "Search five known companies by domain and five known people by email; record how many near-duplicates come back.",
            detail: "Diagnose here; merge on the Cleanup Checklist.",
            owner: "Sales ops",
            doneWhen: "Spot-check result recorded with examples.",
          },
          {
            id: "3.3",
            label: "Stage definitions re-read with the people using them",
            whyItMatters:
              "When stages describe aspiration instead of verifiable checkpoints, every downstream report inherits the fiction.",
            required: true,
            testScenario:
              "Read each stage definition aloud with two sellers and ask what evidence moves a deal into it; rewrite any stage they cannot answer for.",
            owner: "Sales lead",
            doneWhen: "Definitions confirmed or rewritten and shared in writing.",
          },
          {
            id: "3.4",
            label: "Stuck deals listed against a stage-age threshold",
            whyItMatters:
              "Silent aging inflates the pipeline and hides the deals that actually need coaching.",
            required: true,
            testScenario:
              "Set a stage-age threshold per stage, list the deals exceeding it, and require an advance, regress, or close decision on each.",
            owner: "Sales manager",
            doneWhen: "Decisions logged on the deals, not just discussed.",
          },
          {
            id: "3.5",
            label: "Win and loss reasons checked for usefulness",
            whyItMatters:
              "A picklist that everyone answers with the same default value produces coaching data worth nothing.",
            required: false,
            testScenario:
              "Group closed deals by reason and check whether one value dominates; if it does, revise the list or the process behind it.",
            owner: "Sales ops",
            doneWhen: "Distribution reviewed and the list revised or confirmed.",
          },
        ],
      },
      {
        id: "reporting-trust",
        title: "4. Reporting & forecast trust",
        accent: "purple",
        intro:
          "Reports are only optimised when the weekly meeting stops exporting.",
        items: [
          {
            id: "4.1",
            label: "Forecast categories reconciled with stage meanings",
            whyItMatters:
              "When commit means something different to each manager, the roll-up is arithmetic on inconsistent inputs.",
            required: true,
            testScenario:
              "Write one definitions page mapping each forecast category to stage criteria, and have two managers classify the same five deals to check agreement.",
            owner: "Sales ops",
            doneWhen: "Definitions published and both managers classify identically.",
          },
          {
            id: "4.2",
            label: "One shared view designated for the weekly review",
            whyItMatters:
              "Competing private views are why two people bring different numbers to the same meeting.",
            required: true,
            testScenario:
              "Nominate a single saved view, run the next review from it without exporting, and note anything that forced a fallback.",
            owner: "Sales manager",
            doneWhen: "One review completed with no export, or the blocker documented.",
          },
          {
            id: "4.3",
            label: "Unused dashboards and views archived",
            whyItMatters:
              "Dashboard clutter makes the trusted view harder to find and dilutes whatever authority it had.",
            required: true,
            testScenario:
              "List dashboards with no views in ninety days, confirm with their creators, and archive rather than delete.",
            owner: "Admin",
            doneWhen: "Dead views archived and the ritual view bookmarked for the team.",
          },
          {
            id: "4.4",
            label: "One number reconciled between CRM and its side channel",
            whyItMatters:
              "Until the CRM and the shadow spreadsheet agree, people will keep trusting the spreadsheet.",
            required: true,
            testScenario:
              "Take the current-quarter pipeline total from both sources, explain every difference, and record what caused each gap.",
            owner: "Sales ops",
            doneWhen: "Differences explained in writing and the causes ticketed.",
          },
          {
            id: "4.5",
            label: "Report ownership assigned",
            whyItMatters:
              "An unowned report drifts out of date and quietly becomes another reason to distrust the system.",
            required: false,
            testScenario:
              "For each surviving dashboard, name the person responsible for its definitions and review cadence.",
            owner: "Sales ops",
            doneWhen: "Every surviving report has a named owner.",
          },
        ],
      },
      {
        id: "automation-debt",
        title: "5. Automation & integration debt",
        accent: "indigo",
        intro:
          "Retire before you build. Every rule you keep should have an owner and a reason someone can state.",
        items: [
          {
            id: "5.1",
            label: "Full automation inventory with owner, trigger, and last run",
            whyItMatters:
              "You cannot judge automation debt from memory — most teams find rules nobody remembers creating.",
            required: true,
            testScenario:
              "Export every active rule with its trigger and last successful run, then assign an owner to each or mark it as a disable candidate.",
            owner: "Admin",
            doneWhen: "Inventory complete with an owner or disable flag on every row.",
          },
          {
            id: "5.2",
            label: "Unowned and failing rules disabled with a changelog entry",
            whyItMatters:
              "A rule firing into the void causes real damage — wrong tasks, wrong emails, and lost trust.",
            required: true,
            testScenario:
              "Disable each unowned or failing rule, record why in the changelog, and watch for two weeks before deleting anything.",
            detail: "Disable first, delete later — reversibility matters here.",
            owner: "Admin",
            doneWhen: "Orphans disabled and logged; nothing deleted within the quiet period.",
          },
          {
            id: "5.3",
            label: "Auto-task completion rate checked",
            whyItMatters:
              "A rule generating tasks nobody completes is training the whole team to dismiss notifications.",
            required: true,
            testScenario:
              "For the highest-volume automated task, measure how many were completed versus dismissed, and narrow or remove the rule if completion is negligible.",
            owner: "Sales manager",
            doneWhen: "At least one noisy rule narrowed or retired based on the rate.",
          },
          {
            id: "5.4",
            label: "Email and calendar sync failures spot-checked",
            whyItMatters:
              "Silent sync failure is worse than no sync, because people believe the timeline is complete when it is not.",
            required: true,
            testScenario:
              "Have two sellers send mail to a known contact and confirm it lands on the right record; check for stopped or disconnected mailboxes.",
            owner: "Ops",
            doneWhen: "Failures logged with owners or sync confirmed healthy.",
          },
          {
            id: "5.5",
            label: "Inbound and billing integrations verified end to end",
            whyItMatters:
              "A broken form integration creates leads nobody sees and a second system of record nobody declared.",
            required: false,
            testScenario:
              "Submit a test form and confirm the record arrives with the right owner and source; repeat for any billing or support sync.",
            owner: "Ops / IT",
            doneWhen: "Each critical integration tested or explicitly out of scope.",
          },
        ],
      },
      {
        id: "capacity-decision",
        title: "6. Admin capacity & the next decision",
        accent: "slate",
        intro:
          "Optimisation without funded time is a plan to have this conversation again next quarter.",
        items: [
          {
            id: "6.1",
            label: "Admin hours per week confirmed as actually available",
            whyItMatters:
              "Every finding on this page needs someone with time to act on it, or the debt simply rebuilds.",
            required: true,
            testScenario:
              "Ask the named admin how many hours they can protect weekly, and compare that with the fixes queued; escalate the gap to the sponsor.",
            owner: "Sponsor",
            doneWhen: "Hours confirmed or a funding gap escalated in writing.",
          },
          {
            id: "6.2",
            label: "Change log started for stages, fields, and rules",
            whyItMatters:
              "Without a change log, nobody can connect a broken report to the change that broke it.",
            required: true,
            testScenario:
              "Record the last three configuration changes with date, author, and reason, then keep the log going forward.",
            owner: "Admin",
            doneWhen: "Log exists with at least three entries and a maintaining owner.",
          },
          {
            id: "6.3",
            label: "Role-based refresh scheduled for the theme you shipped",
            whyItMatters:
              "A configuration change without a short refresh session gets reverted by workaround within weeks.",
            required: true,
            testScenario:
              "Book a fifteen to thirty minute session per affected role covering only what changed and why.",
            owner: "Change owner",
            doneWhen: "Session dated for each affected role.",
          },
          {
            id: "6.4",
            label: "Exit condition re-measured with the original method",
            whyItMatters:
              "Changing the measurement method between baseline and re-measure is how teams convince themselves of progress they did not make.",
            required: true,
            testScenario:
              "Re-run the saved view from the health pass and compare against the original baseline and date.",
            owner: "Sales ops",
            doneWhen: "Same view re-run and both numbers recorded side by side.",
          },
          {
            id: "6.5",
            label: "Access review queued with the security checklist",
            whyItMatters:
              "Permission drift accumulates quietly and is not something an optimisation sprint should silently inherit.",
            required: false,
            testScenario:
              "Set the date for the next access review and confirm who runs it; detailed work stays on the Security Checklist.",
            owner: "Admin",
            doneWhen: "Next review dated with a named owner.",
          },
          {
            id: "6.6",
            label: "Decision recorded: continue, pause, or reopen evaluation",
            whyItMatters:
              "Optimising around a capability the product genuinely lacks wastes more than a replacement evaluation would.",
            required: true,
            testScenario:
              "Check whether any remaining blocker is a product gap or an edition gate rather than a process issue; if it is, reopen evaluation with the Requirements Template.",
            owner: "Sponsor",
            doneWhen: "One written decision: continue, pause, or reopen evaluation.",
          },
        ],
      },
    ],
    downloadFiles: [
      {
        href: "/resources/crm-optimization-checklist.md",
        label: "Download Markdown",
        format: "md",
      },
    ],
    faq: [
      {
        question: "How is this different from the Cleanup Checklist?",
        answer:
          "Optimization diagnoses which problem to solve and in what order — adoption, data trust, reporting, or automation debt. Cleanup executes the batch data work safely: duplicate merges, owner reassignment, field removal, and orphan automations. Run the health pass first, then hand the batch items to cleanup.",
      },
      {
        question: "When should we stop optimising and consider replacing?",
        answer:
          "When a remaining blocker is a product gap or an edition gate rather than a process or configuration issue. If an honest pass leaves a must-have unreachable on your plan, reopen evaluation with the Requirements Template instead of building workarounds indefinitely.",
      },
      {
        question: "Do we need a CRM health score?",
        answer:
          "No. Composite scores hide which signal moved. Track the four raw signals — next-step coverage, active users by role, whether the review runs from a CRM view, and unowned automations — and re-measure each with the same method.",
      },
      {
        question: "How often should we run the health pass?",
        answer:
          "Quarterly is enough for most teams, plus once after any major configuration change. Continuous redesign creates its own adoption problem.",
      },
      {
        question: "Can we fix several themes at once?",
        answer:
          "Not if you want to know what worked. Parallel changes make the re-measure uninterpretable, and they usually exceed the admin hours actually available.",
      },
      {
        question: "What if adoption is bad but nobody will say why?",
        answer:
          "Watch instead of asking. Have three users walk through creating and updating a deal while you note every step they skip. Observed friction is far more actionable than survey sentiment.",
      },
    ],
    heroVisual: {
      src: "/resources/crm-optimization-checklist-hero.png",
      alt: "Preview of the CRM Optimization Checklist showing health pass signals, adoption checks, reporting trust, and automation debt sections.",
      caption:
        "Measure four signals, fix one theme, re-measure with the same view.",
    },
    needsVisual: {
      src: "/resources/crm-optimization-checklist-needs.png",
      alt: "What’s inside the CRM Optimization Checklist: health pass, adoption checks, data trust, reporting trust, automation debt, and capacity.",
      caption: "A diagnosis-first checklist for a CRM that is live but distrusted.",
    },
    workflowVisual: {
      src: "/resources/crm-optimization-checklist-workflow.png",
      alt: "Six-step loop: health pass, pick one theme, set the exit condition, ship one change, reinforce, re-measure and decide.",
      caption: "A cadence sized to the admin hours you actually have.",
    },
    useBefore: ["crm-go-live-checklist"],
    useWith: ["crm-cleanup-checklist", "crm-training-plan"],
    useNext: ["crm-cleanup-checklist", "crm-security-checklist"],
    journeySlugs: [
      "crm-implementation-checklist",
      "crm-go-live-checklist",
      "crm-optimization-checklist",
      "crm-cleanup-checklist",
      "crm-security-checklist",
    ],
    relatedResourceSlugs: [
      "crm-cleanup-checklist",
      "crm-training-plan",
      "crm-security-checklist",
      "crm-go-live-checklist",
    ],
    featuredGuideHrefs: [
      "/guides/crm-implementation/",
      "/guides/crm-roi-guide/",
    ],
    relatedToolHrefs: [
      { href: "/tools/crm-finder/", label: "CRM Finder" },
      { href: "/tools/crm-cost-calculator/", label: "CRM Cost Calculator" },
    ],
    primaryCta: {
      href: "/resources/crm-optimization-checklist.xlsx",
      label: "Download Excel (Editable spreadsheet)",
    },
    secondaryCta: {
      href: "/resources/crm-optimization-checklist.pdf",
      label: "Download PDF (Printable version)",
    },
    categorySlug: "crm",
    lastReviewedAt: "2026-08-15",
  },

  "crm-cleanup-checklist": {
    displayTitle: "CRM Cleanup Checklist",
    badgeLabel: "Hygiene",
    toolkitLabel: "CRM Operations Toolkit",
    tagline: "Clean the data without breaking the reports.",
    heroExplanation:
      "Work through duplicates, inactive owners, unused fields, and orphan automations in a safe order — snapshot first, batch second, validate after every batch.",
    overview:
      "This is the execution artifact for CRM data hygiene. It sequences four batches — users and ownership, duplicate contacts and accounts, unused fields and views, then orphan automations and templates — behind a safety gate of exports, dependency mapping, and written survivorship rules. The order matters: identity problems destroy trust fastest and are the safest to fix, while field deletion carries the highest risk of silently breaking a report someone depends on.",
    whoThisIsFor:
      "Admins and sales ops inheriting an org with years of accumulated imports — several versions of every account, departed reps still owning open deals, and automations nobody claims. Also useful before a migration, where dirty data multiplies into the new system.",
    whatMattersIntro:
      "Safety and reversibility come before speed. Know which reports and integrations read a field before you touch it, define merge survivorship before the first merge, and validate a sample after every batch. Track batch counts and validation results rather than inventing a data-quality percentage.",
    howToUse:
      "Clear the safety gate first: dated exports, a dependency list, written survivorship rules, and an announced freeze window. Then run the batches in order, validating a fixed sample after each one. Disable before deleting, keep a changelog as you go, and schedule the next pass before you close this one.",
    workedExampleStructured: {
      title: "Worked example",
      requirement:
        "Safety gate before batch one: could we recover if a merge batch went wrong?",
      vendors: [
        {
          name: "Check 1 — Dated export of accounts, contacts, deals, activities",
          result: "PASS",
          note: "A full export was taken the morning of the cleanup and stored where the whole ops team can reach it, so a bad batch can be reconstructed.",
        },
        {
          name: "Check 2 — Dependency list for fields marked for removal",
          result: "PARTIAL",
          note: "Reports were mapped but integration payloads were not, so field deletion is deferred until the connector fields are confirmed.",
        },
        {
          name: "Check 3 — Merge survivorship rules written down",
          result: "FAIL",
          note: "No rule existed for which record wins on conflicting emails, so merging is blocked until the rule is agreed and written.",
        },
      ],
      evidence:
        "Export timestamp, the dependency worksheet, and the survivorship rules document — reviewed together before any batch starts.",
      disclaimer:
        "Hypothetical safety-gate scenario for teaching the artifact — not a SoftwareGlimpse case study.",
    },
    glance: {
      primaryGoal:
        "Reversible, batched CRM hygiene that leaves reporting intact",
      typicalTeam: "Admin, sales ops, data owner, sales manager",
      commonPriorities: [
        "Snapshot before change",
        "Ownership first",
        "Duplicates in batches",
        "Fields last",
        "Validate every batch",
      ],
    },
    whatsInside: [
      {
        id: "safety-gate",
        title: "Safety gate",
        description:
          "Exports, dependency mapping, survivorship rules, and a freeze window before batch one.",
        icon: "shield",
      },
      {
        id: "ownership-batch",
        title: "Users & ownership batch",
        description:
          "Deactivate departed users and get live pipeline onto living owners.",
        icon: "users",
      },
      {
        id: "duplicate-batch",
        title: "Duplicate batch",
        description:
          "Email and domain matching rules, small merge batches, and a human queue for ambiguity.",
        icon: "list",
      },
      {
        id: "schema-batch",
        title: "Fields & views batch",
        description:
          "Remove from layout, wait, then archive — with report dependencies checked first.",
        icon: "file",
      },
      {
        id: "automation-batch",
        title: "Automation batch",
        description:
          "Disable orphan rules and retire obsolete templates with a changelog entry each.",
        icon: "zap",
      },
      {
        id: "validation",
        title: "Validation & recurrence",
        description:
          "A fixed sample re-checked after every batch, then a scheduled next pass.",
        icon: "check",
      },
    ],
    evidenceRules: {
      countsAs: [
        "A dated export stored where the team can reach it",
        "A field-to-report dependency list built before deletion",
        "Written survivorship rules agreed before the first merge",
        "A fixed validation sample re-checked after each batch",
      ],
      doesNotCount: [
        "“Nobody uses that field” without a dependency check",
        "An automated merge run at low match confidence",
        "A data-quality percentage with no counting method",
        "Deleting during a freeze without a changelog entry",
      ],
    },
    challenges: [],
    outcomes: [
      {
        id: "search-trusted",
        title: "Search becomes trustworthy",
        description:
          "Fewer duplicate contacts and accounts, so sellers open the existing record instead of creating another.",
      },
      {
        id: "live-work-owned",
        title: "Live pipeline has living owners",
        description:
          "No open deal sits under a departed or inactive user.",
      },
      {
        id: "reports-intact",
        title: "Reports survive the cleanup",
        description:
          "Dependency checks and per-batch validation catch breakage before anyone notices it in a meeting.",
      },
      {
        id: "hygiene-recurs",
        title: "Hygiene becomes recurring",
        description:
          "A scheduled light pass with a named owner stops the debt rebuilding silently.",
      },
    ],
    priorities: [],
    workflowSteps: [
      {
        id: "safety-gate",
        label: "Clear the safety gate",
        detail:
          "Exports, dependency list, survivorship rules, freeze window — all four before batch one.",
      },
      {
        id: "batch-owners",
        label: "Batch one — users & ownership",
        detail:
          "Deactivate departed users after reassigning their live work.",
      },
      {
        id: "batch-dupes",
        label: "Batch two — duplicates",
        detail:
          "High-confidence email and domain merges only; ambiguity goes to a human queue.",
      },
      {
        id: "batch-fields",
        label: "Batch three — fields & views",
        detail:
          "Remove from layouts, observe a quiet period, then archive.",
      },
      {
        id: "batch-automations",
        label: "Batch four — automations",
        detail:
          "Disable orphan rules and retire obsolete templates, logging each one.",
      },
      {
        id: "validate",
        label: "Validate & schedule the next pass",
        detail:
          "Re-check the fixed sample, publish the changelog, put the next pass in the calendar.",
      },
    ],
    artifactSections: [
      {
        id: "safety-gate",
        title: "1. Before you touch anything",
        accent: "amber",
        intro:
          "All four gate items must pass before batch one starts. This is the section teams skip and regret.",
        items: [
          {
            id: "1.1",
            label: "Dated export of accounts, contacts, deals, and activities",
            whyItMatters:
              "Without a snapshot, a bad merge batch is unrecoverable and the cleanup becomes the incident.",
            required: true,
            testScenario:
              "Run a full export the same day cleanup starts, open one file to confirm it is complete, and store it where the ops team can reach it.",
            owner: "Admin",
            doneWhen: "Export verified as readable and its location shared.",
          },
          {
            id: "1.2",
            label: "Dependency list for every field and rule you may remove",
            whyItMatters:
              "A field feeding a report or an integration payload will break something invisible when it disappears.",
            required: true,
            testScenario:
              "For each removal candidate, list the reports, list views, automations, and integrations that reference it; mark anything you cannot confirm as blocked.",
            detail: "Integration payloads are the most commonly missed dependency.",
            owner: "Admin",
            doneWhen: "Every candidate is either cleared or explicitly blocked.",
          },
          {
            id: "1.3",
            label: "Merge survivorship rules written and agreed",
            whyItMatters:
              "Deciding survivorship mid-merge produces inconsistent records that are harder to fix than the duplicates were.",
            required: true,
            testScenario:
              "Write which record wins on conflicting email, owner, and created date, and what happens to activities and open deals; get sign-off before merging.",
            owner: "Sales ops",
            doneWhen: "Rules documented and agreed by ops and the sales manager.",
          },
          {
            id: "1.4",
            label: "Fixed validation sample chosen",
            whyItMatters:
              "Validating different records after each batch tells you nothing about what the batch actually changed.",
            required: true,
            testScenario:
              "Pick fifteen to twenty named records plus two saved report views, and record their current state as the comparison baseline.",
            owner: "Sales ops",
            doneWhen: "Sample list and current-state snapshot saved.",
          },
          {
            id: "1.5",
            label: "Freeze window announced to the team",
            whyItMatters:
              "Bulk imports or mass edits during cleanup will silently undo the work and corrupt the validation.",
            required: true,
            testScenario:
              "Send dates and explicit instructions — no bulk imports, no new fields — and confirm the team acknowledged them.",
            owner: "Change owner",
            doneWhen: "Notice sent with dates and acknowledged.",
          },
          {
            id: "1.6",
            label: "Rollback approach written down",
            whyItMatters:
              "Deciding how to restore while a batch is failing is how a small problem becomes a long outage.",
            required: true,
            testScenario:
              "Describe how you would restore from the export, who authorises it, and how long the export is retained; test the restore path on one record.",
            owner: "Admin",
            doneWhen: "Approach written and tested on a single record.",
          },
        ],
      },
      {
        id: "batch-owners",
        title: "2. Batch one — users & ownership",
        accent: "blue",
        intro:
          "Start here. Ownership problems damage trust fastest and are the least likely to break a report.",
        items: [
          {
            id: "2.1",
            label: "Open deals reassigned before their owner is deactivated",
            whyItMatters:
              "Deactivating first can orphan live pipeline in ways some systems make awkward to undo.",
            required: true,
            testScenario:
              "For each departing user, list their open deals, reassign each to a named person, then deactivate the account.",
            detail: "Order matters — reassign, then deactivate.",
            owner: "Sales ops",
            doneWhen: "Zero open deals remain under any user queued for deactivation.",
          },
          {
            id: "2.2",
            label: "Departed and unused user accounts deactivated",
            whyItMatters:
              "Dormant accounts are both a paid seat and an open access path nobody is monitoring.",
            required: true,
            testScenario:
              "Cross-check the user list against current staff, deactivate anyone who has left, and note the licence position afterwards.",
            owner: "Admin",
            doneWhen: "User list matches current staff; licence count reviewed.",
          },
          {
            id: "2.3",
            label: "Accounts and contacts reassigned from inactive owners",
            whyItMatters:
              "Unowned accounts get no coverage, and coverage gaps are invisible until a renewal is missed.",
            required: true,
            testScenario:
              "Filter accounts and contacts by inactive owner and reassign according to your coverage policy, in batches.",
            owner: "Sales ops",
            doneWhen: "First batch reassigned and the remainder queued.",
          },
          {
            id: "2.4",
            label: "Ownerless records found and resolved",
            whyItMatters:
              "Records with no owner at all never appear in an owner-filtered view, so they are invisible to every routine.",
            required: true,
            testScenario:
              "Filter for an empty owner field across accounts, contacts, and open deals, then assign or archive each by policy.",
            owner: "Sales ops",
            doneWhen: "Policy applied to every ownerless record found.",
          },
          {
            id: "2.5",
            label: "Integration and API users reviewed",
            whyItMatters:
              "Service accounts from retired integrations keep write access long after anyone remembers why they exist.",
            required: true,
            testScenario:
              "List every non-human user, confirm which integration each serves and who owns it, and disable those nobody can account for.",
            owner: "Admin / IT",
            doneWhen: "Every integration user has a named owner or is disabled.",
          },
          {
            id: "2.6",
            label: "Validation sample re-checked after batch one",
            whyItMatters:
              "Catching a reassignment error now is far cheaper than finding it three batches later.",
            required: true,
            testScenario:
              "Re-open the fixed sample records and the two report views, and confirm only the intended ownership changed.",
            owner: "Sales ops",
            doneWhen: "Sample re-checked and any deviation logged before batch two.",
          },
        ],
      },
      {
        id: "batch-duplicates",
        title: "3. Batch two — duplicate contacts & accounts",
        accent: "teal",
        intro:
          "Merge only what you can defend. A silent bad merge costs more trust than the duplicates did.",
        items: [
          {
            id: "3.1",
            label: "Contact match rule defined with email as primary key",
            whyItMatters:
              "Name-based matching merges different people at the same company, which is close to unrecoverable.",
            required: true,
            testScenario:
              "Write the rule — exact email is high confidence, name plus company is review-only — and run it against a sample to check the match counts look sane.",
            owner: "Sales ops",
            doneWhen: "Rule written and sample-tested before any merge.",
          },
          {
            id: "3.2",
            label: "Account match rule defined on domain or normalised name",
            whyItMatters:
              "Domain matching catches the legal-entity and abbreviation variants that name matching always misses.",
            required: true,
            testScenario:
              "Write the rule, then check it against known edge cases — shared domains, subsidiaries, and multi-entity clients — before running it broadly.",
            detail: "Agencies and groups need the subsidiary case decided explicitly.",
            owner: "Sales ops",
            doneWhen: "Rule written with the subsidiary and shared-domain cases resolved.",
          },
          {
            id: "3.3",
            label: "High-confidence duplicates merged in small batches",
            whyItMatters:
              "Small batches keep any mistake small enough to inspect and reverse.",
            required: true,
            testScenario:
              "Merge twenty-five to fifty records, then spot-check five against the survivorship rules before starting the next batch.",
            owner: "Admin",
            doneWhen: "First batch merged and spot-checked with no rule violations.",
          },
          {
            id: "3.4",
            label: "Ambiguous matches routed to a human review queue",
            whyItMatters:
              "Auto-merging low-confidence matches is the fastest way to lose data nobody realises is gone.",
            required: true,
            testScenario:
              "Create a queue for anything below your confidence threshold, assign an owner, and confirm nothing merges automatically from it.",
            owner: "Data owner",
            doneWhen: "Queue exists with an owner and no automatic merging enabled.",
          },
          {
            id: "3.5",
            label: "Open-deal survivorship applied on account merges",
            whyItMatters:
              "Merging accounts with open deals on both sides can duplicate or lose pipeline mid-quarter.",
            required: true,
            testScenario:
              "Before merging an account with open deals on both records, apply the written rule for which deal survives and where activities roll up; verify one case manually.",
            owner: "Sales ops",
            doneWhen: "Rule applied and one merge verified deal by deal.",
          },
          {
            id: "3.6",
            label: "Lead-to-contact duplicate policy set (or N/A)",
            whyItMatters:
              "Recycled leads recreate contacts on the same email and quietly rebuild the duplicate problem.",
            required: false,
            testScenario:
              "Define what happens when an inbound lead matches an existing contact email, or mark N/A if you do not use leads.",
            owner: "Sales ops",
            doneWhen: "Policy written or N/A recorded with a reason.",
          },
          {
            id: "3.7",
            label: "Validation sample re-checked after batch two",
            whyItMatters:
              "Merge damage compounds — every later batch runs on whatever this one produced.",
            required: true,
            testScenario:
              "Re-open the fixed sample and both report views, confirming record counts and pipeline totals moved only as expected.",
            owner: "Sales ops",
            doneWhen: "Sample re-checked and differences explained in writing.",
          },
        ],
      },
      {
        id: "batch-schema",
        title: "4. Batch three — unused fields & views",
        accent: "purple",
        intro:
          "The riskiest batch. Nothing here is deleted in one step, and nothing moves without its dependency check.",
        items: [
          {
            id: "4.1",
            label: "Removal candidates confirmed with the people who use them",
            whyItMatters:
              "Usage reports miss fields read only at quarter end or only by one team.",
            required: true,
            testScenario:
              "Circulate the candidate list to sales, delivery, and finance with a response deadline, and drop anything that gets a claim.",
            owner: "Admin",
            doneWhen: "Candidate list confirmed after an explicit response window.",
          },
          {
            id: "4.2",
            label: "Fields removed from layouts first, deleted later",
            whyItMatters:
              "The two-step makes the change reversible for the weeks in which someone notices it is missing.",
            required: true,
            testScenario:
              "Remove the field from page layouts, wait a defined quiet period of at least two weeks, and only then archive or delete.",
            detail: "Deleting in one step converts a small mistake into data loss.",
            owner: "Admin",
            doneWhen: "Layouts updated with the deletion date scheduled after the quiet period.",
          },
          {
            id: "4.3",
            label: "Obsolete picklist values retired with a mapping note",
            whyItMatters:
              "Removing a value without mapping the historical records breaks trend reporting silently.",
            required: true,
            testScenario:
              "For each obsolete value, count the records using it, decide whether to remap or hide it, and record the mapping in the changelog.",
            owner: "Admin",
            doneWhen: "Each retired value has a recorded mapping or hide decision.",
          },
          {
            id: "4.4",
            label: "Abandoned list views and dashboards archived",
            whyItMatters:
              "Clutter buries the views the weekly ritual depends on and invites people back to private exports.",
            required: true,
            testScenario:
              "List views with no access in ninety days, notify their creators, and archive rather than delete.",
            owner: "Admin",
            doneWhen: "Abandoned views archived; ritual views confirmed intact.",
          },
          {
            id: "4.5",
            label: "Blank required fields on live open deals resolved",
            whyItMatters:
              "Open deals that cannot satisfy the current required set block sellers and generate workaround records.",
            required: false,
            testScenario:
              "List open deals failing the current required set and either fill the values or log an explicit exception; do not invent data to satisfy a field.",
            owner: "Sales ops",
            doneWhen: "Open deals compliant or exceptions logged with a reason.",
          },
          {
            id: "4.6",
            label: "Key report views re-run after schema changes",
            whyItMatters:
              "A layout or picklist change can alter a report filter in ways only a comparison will reveal.",
            required: true,
            testScenario:
              "Re-run the forecast and stuck-deal views, compare totals against the pre-batch snapshot, and investigate any unexplained difference before continuing.",
            owner: "Sales ops",
            doneWhen: "Totals reconciled or the difference explained in writing.",
          },
        ],
      },
      {
        id: "batch-automations",
        title: "5. Batch four — orphan automations & templates",
        accent: "indigo",
        intro:
          "Disable and observe before deleting. Automations fail loudly for customers and silently for you.",
        items: [
          {
            id: "5.1",
            label: "Every active automation given an owner or a disable flag",
            whyItMatters:
              "An unowned rule has nobody to notice when it starts firing on the wrong records.",
            required: true,
            testScenario:
              "Export active rules with trigger and last successful run, then assign an owner to each or mark it for disabling.",
            owner: "Admin",
            doneWhen: "No active rule remains without an owner or a disable flag.",
          },
          {
            id: "5.2",
            label: "Customer-facing automations checked before anything else",
            whyItMatters:
              "A rule emailing closed-lost contacts damages relationships in a way internal noise never does.",
            required: true,
            testScenario:
              "Identify every rule that can send external email, confirm its trigger conditions, and disable any whose purpose nobody can state.",
            detail: "External-facing rules are the highest-severity orphans.",
            owner: "Admin",
            doneWhen: "Every external-sending rule is either confirmed or disabled.",
          },
          {
            id: "5.3",
            label: "Orphan and failing rules disabled with a changelog entry",
            whyItMatters:
              "Disabling without a record means the next admin re-enables it without knowing why it was stopped.",
            required: true,
            testScenario:
              "Disable each orphan, write the reason and date in the changelog, and hold for a quiet period before deleting.",
            owner: "Admin",
            doneWhen: "Orphans disabled and logged; nothing deleted within the quiet period.",
          },
          {
            id: "5.4",
            label: "Noisy auto-task rules narrowed",
            whyItMatters:
              "High-volume tasks nobody completes train the team to dismiss every notification, including the useful ones.",
            required: true,
            testScenario:
              "Find the rule generating the most tasks, measure completion, and narrow its trigger or retire it if completion is negligible.",
            owner: "Sales manager",
            doneWhen: "At least one noisy rule narrowed or retired based on completion data.",
          },
          {
            id: "5.5",
            label: "Obsolete email and task templates retired",
            whyItMatters:
              "Old templates get sent by accident and carry outdated pricing, names, or positioning.",
            required: false,
            testScenario:
              "Review the template library with whoever owns messaging, archive anything superseded, and note what replaced it.",
            owner: "Ops",
            doneWhen: "Obsolete templates archived with replacements noted.",
          },
        ],
      },
      {
        id: "validate-recur",
        title: "6. Validate, document & make it recurring",
        accent: "slate",
        intro:
          "Close the pass properly, or you will be running the same cleanup next year.",
        items: [
          {
            id: "6.1",
            label: "Full validation sample re-checked against the original snapshot",
            whyItMatters:
              "Final validation is the only proof the cleanup improved the data rather than merely changing it.",
            required: true,
            testScenario:
              "Compare every sample record and both report views against the pre-cleanup snapshot, and account for every difference.",
            owner: "Sales ops",
            doneWhen: "All differences explained and signed off by the sales manager.",
          },
          {
            id: "6.2",
            label: "Changelog published to the team",
            whyItMatters:
              "People who find a field missing without explanation assume the system broke and revert to spreadsheets.",
            required: true,
            testScenario:
              "Publish what changed, what was archived, and who to ask, in the channel the team actually reads.",
            owner: "Change owner",
            doneWhen: "Changelog published and acknowledged.",
          },
          {
            id: "6.3",
            label: "Deletion dates scheduled for everything currently disabled",
            whyItMatters:
              "A permanent limbo of disabled fields and rules is its own form of debt for the next admin.",
            required: true,
            testScenario:
              "For every disabled rule and delayed field deletion, set the review date and owner who confirms nothing broke.",
            owner: "Admin",
            doneWhen: "Every disabled item has a review date and an owner.",
          },
          {
            id: "6.4",
            label: "Prevention measures added for the top recurring problem",
            whyItMatters:
              "Cleaning without prevention guarantees the same batch work returns within a year.",
            required: true,
            testScenario:
              "For your largest duplicate source, add a duplicate warning, a required search step, or an intake rule, and confirm it fires on a test record.",
            owner: "Admin",
            doneWhen: "At least one prevention measure live and tested.",
          },
          {
            id: "6.5",
            label: "Next hygiene pass scheduled with a named owner",
            whyItMatters:
              "Hygiene without a calendar entry and an owner reliably becomes another multi-year backlog.",
            required: true,
            testScenario:
              "Put the next light pass in the calendar with a named owner and a smaller expected batch size.",
            owner: "Sponsor",
            doneWhen: "Date and owner confirmed in the calendar.",
          },
          {
            id: "6.6",
            label: "Retention and archive policy confirmed with the sponsor",
            whyItMatters:
              "Hard-deleting history you are required to keep is a compliance problem, not a tidy-up.",
            required: false,
            testScenario:
              "Confirm what must be retained and for how long, and prefer archive or filter over deletion wherever the answer is unclear.",
            owner: "Sponsor",
            doneWhen: "Policy confirmed in writing or deletion deferred pending it.",
          },
        ],
      },
    ],
    downloadFiles: [
      {
        href: "/resources/crm-cleanup-checklist.md",
        label: "Download Markdown",
        format: "md",
      },
    ],
    faq: [
      {
        question: "Why clean ownership before duplicates?",
        answer:
          "Ownership fixes are the safest change with the fastest trust return, and they make the duplicate work cleaner — merging records whose owners are already correct avoids a second reassignment pass afterwards.",
      },
      {
        question: "Should we hard-delete old records?",
        answer:
          "Usually archive or filter instead. History you may need for audits or coaching is expensive to lose and cheap to keep. Confirm retention with your sponsor before deleting anything, and prefer merging duplicates and fixing owners on live records first.",
      },
      {
        question: "Can we automate all the duplicate merges?",
        answer:
          "Only the high-confidence rules you have tested against a sample — typically exact email for contacts and domain for accounts. Everything below that threshold belongs in a human review queue. A silent bad merge destroys trust faster than the duplicates did.",
      },
      {
        question: "How do we avoid breaking reports?",
        answer:
          "Build the field-to-report dependency list before touching anything, remove fields from layouts before deleting them, and re-run your fixed validation sample plus the forecast views after every batch. Investigate any unexplained difference before starting the next batch.",
      },
      {
        question: "How is this different from the Optimization Checklist?",
        answer:
          "Optimization diagnoses which problem is worth fixing and in what order across adoption, reporting, and automation. Cleanup is the execution artifact for the batch data work itself. Run the health pass first, then bring the data items here.",
      },
      {
        question: "How large should a merge batch be?",
        answer:
          "Small enough to inspect. Twenty-five to fifty records with a five-record spot check works for most teams; a part-time admin should go smaller. Batch size should be set by how much you can validate, not by how much the tool can process.",
      },
    ],
    heroVisual: {
      src: "/resources/crm-cleanup-checklist-hero.png",
      alt: "Preview of the CRM Cleanup Checklist showing the safety gate, ownership batch, duplicate merge batch, field removal batch, and validation steps.",
      caption:
        "Snapshot first, then four batches, with a fixed sample validated after each one.",
    },
    needsVisual: {
      src: "/resources/crm-cleanup-checklist-needs.png",
      alt: "What’s inside the CRM Cleanup Checklist: safety gate, users and ownership, duplicates, fields and views, automations, and validation.",
      caption: "Ordered by risk — identity problems first, field deletion last.",
    },
    workflowVisual: {
      src: "/resources/crm-cleanup-checklist-workflow.png",
      alt: "Six-step cleanup flow: clear the safety gate, users and ownership, duplicates, fields and views, automations, validate and schedule.",
      caption: "A reversible sequence for live-CRM hygiene.",
    },
    useBefore: ["crm-optimization-checklist"],
    useWith: ["crm-optimization-checklist", "crm-security-checklist"],
    useNext: ["crm-security-checklist"],
    journeySlugs: [
      "crm-go-live-checklist",
      "crm-optimization-checklist",
      "crm-cleanup-checklist",
      "crm-security-checklist",
    ],
    relatedResourceSlugs: [
      "crm-optimization-checklist",
      "crm-security-checklist",
      "crm-data-migration-template",
      "crm-field-mapping-template",
    ],
    featuredGuideHrefs: [
      "/guides/crm-implementation/",
      "/guides/crm-total-cost-guide/",
    ],
    relatedToolHrefs: [
      { href: "/tools/crm-finder/", label: "CRM Finder" },
      { href: "/tools/crm-tco-calculator/", label: "CRM TCO Calculator" },
    ],
    primaryCta: {
      href: "/resources/crm-cleanup-checklist.xlsx",
      label: "Download Excel (Editable spreadsheet)",
    },
    secondaryCta: {
      href: "/resources/crm-cleanup-checklist.pdf",
      label: "Download PDF (Printable version)",
    },
    categorySlug: "crm",
    lastReviewedAt: "2026-08-15",
  },
};
