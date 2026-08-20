import type { UseCaseHubProfile } from "@/domain";

type Depth = Pick<
  UseCaseHubProfile,
  | "overview"
  | "whoThisIsFor"
  | "whatMattersIntro"
  | "workedExample"
  | "workedExampleSecondary"
  | "tagline"
  | "displayTitle"
  | "badgeLabel"
  | "glance"
  | "challenges"
  | "outcomes"
  | "capabilityNeeds"
  | "workflowSteps"
  | "priorities"
  | "scenarios"
  | "buyingFramework"
  | "needsVisual"
  | "workflowVisual"
  | "heroVisual"
  | "faq"
  | "relatedUseCaseSlugs"
  | "featuredGuideHrefs"
  | "categorySlug"
  | "finderHref"
  | "catalogueHref"
  | "primaryCta"
  | "secondaryCta"
  | "buyingGuideHref"
>;

const PM_CTAS = {
  categorySlug: "project-management" as const,
  finderHref: "/best/project-management-software/",
  catalogueHref: "/categories/project-management/",
  buyingGuideHref: "/guides/how-to-choose-project-management-software/",
  primaryCta: {
    href: "/best/project-management-software/",
    label: "Best project management software",
  },
  secondaryCta: {
    href: "/categories/project-management/",
    label: "Browse project management",
  },
};

const PM_GUIDES = [
  "/guides/what-is-project-management-software/",
  "/guides/how-to-choose-project-management-software/",
  "/guides/project-management-pricing-guide/",
  "/best/project-management-software/",
];

/**
 * Project management use-case hub depth (`/use-cases/[slug]/`).
 * Educational — no invented prices, scores, or product endorsements.
 */
export const projectManagementUseCaseDepth: Record<string, Depth> = {
  "work-management": {
    ...PM_CTAS,
    displayTitle: "Project management for Work management / Work OS",
    badgeLabel: "Work management",
    tagline: "Run the company's work on shared boards, timelines, and automations — instead of Slack threads and private sheets.",
    overview: "Work management is the job of giving every initiative an owner, a status, and a next date the team trusts. A work OS replaces the Friday scramble to reconstruct progress from chat and spreadsheets.",
    whoThisIsFor: "Ops leads, project managers, and cross-functional teams that need one system of record for delivery — not a CRM pipeline board.",
    whatMattersIntro: "Prioritise multi-view planning, automation for handoffs, and manager dashboards on the plan you will actually buy.",
    workedExample: "Worked example: Harbor Studio moves client delivery off Slack pins onto a work OS. Every deliverable has an owner and stage; account leads stop chasing status on Fridays.",
    workedExampleSecondary: "Worked example: a five-person ops team standardises intake so new work cannot start without an owner and due date.",
    glance: {
      primaryGoal: "Run the company's work on shared boards, timelines, and automations",
      typicalTeam: "Ops, project managers, agencies, and delivery teams",
      commonPriorities: ["Ownership", "Status accuracy", "Views on the right plan", "Integrations", "Weekly review ritual"],
    },
    challenges: [
          {
                "id": "scatter",
                "title": "Work status lives in chat and sheets",
                "pain": "Managers reconstruct progress every week.",
                "crmHelps": "Shared boards and owners keep status in one place."
          },
          {
                "id": "owners",
                "title": "Ownership is unclear",
                "pain": "Tasks stall because nobody is accountable.",
                "crmHelps": "Required owners and due dates make gaps visible."
          },
          {
                "id": "handoffs",
                "title": "Handoffs depend on memory",
                "pain": "Status updates are missed between teams.",
                "crmHelps": "Automations and notifications move work without chasing."
          },
          {
                "id": "visibility",
                "title": "Leaders lack a trusted view",
                "pain": "Reporting is a last-minute slide rebuild.",
                "crmHelps": "Dashboards and timelines reuse live work data."
          }
    ],
    outcomes: [
          {
                "id": "owned",
                "title": "Owned work",
                "description": "Every active item has a person and a next date."
          },
          {
                "id": "visible",
                "title": "Visible status",
                "description": "Reviews start from the board, not from Slack."
          },
          {
                "id": "fewer-chasers",
                "title": "Fewer status chasers",
                "description": "Automations and dashboards reduce manual pinging."
          },
          {
                "id": "cleaner-handoffs",
                "title": "Cleaner handoffs",
                "description": "Context stays on the work item."
          }
    ],
    capabilityNeeds: [
      {
        id: "task-boards",
        title: "Task Boards",
        description: "Evaluate task boards on the plan you will buy.",
        priority: "must",
        href: "/capabilities/task-boards/",
      },
      {
        id: "timeline-gantt",
        title: "Timeline Gantt",
        description: "Evaluate timeline gantt on the plan you will buy.",
        priority: "must",
        href: "/capabilities/timeline-gantt/",
      },
      {
        id: "automations-workflows",
        title: "Automations Workflows",
        description: "Evaluate automations workflows on the plan you will buy.",
        priority: "must",
        href: "/capabilities/automations-workflows/",
      },
      {
        id: "reporting-dashboards",
        title: "Reporting Dashboards",
        description: "Evaluate reporting dashboards on the plan you will buy.",
        priority: "nice",
        href: "/capabilities/reporting-dashboards/",
      },
      {
        id: "integrations-ecosystem",
        title: "Integrations Ecosystem",
        description: "Evaluate integrations ecosystem on the plan you will buy.",
        priority: "nice",
        href: "/capabilities/integrations-ecosystem/",
      }
    ],
    workflowSteps: [
          {
                "id": "capture",
                "label": "Capture work",
                "detail": "Create items with owners and due dates.",
                "goal": "No orphan work."
          },
          {
                "id": "plan",
                "label": "Plan the view",
                "detail": "Use boards or timelines the team will actually open.",
                "goal": "One agreed view of status."
          },
          {
                "id": "automate",
                "label": "Automate handoffs",
                "detail": "Notify the next owner when status changes.",
                "goal": "Less manual chasing."
          },
          {
                "id": "review",
                "label": "Review weekly",
                "detail": "Start from stuck items and overloaded people.",
                "goal": "One improvement per week."
          }
    ],
    priorities: [
      { id: "ownership", title: "Ownership", description: "Every active item has a named owner.", icon: "check" },
      { id: "plan-gates", title: "Plan gates", description: "Must-have views unlock on the quoted plan.", icon: "shield" },
      { id: "integrations", title: "Integrations", description: "Native connectors for tools people open daily.", icon: "globe" },
    ],
    scenarios: [
      { id: "agency", title: "Agency / studio", bestWhen: "Client delivery needs shared owners and status." },
      { id: "ops", title: "Internal ops", bestWhen: "Cross-functional work stalls without a system of record." },
      { id: "specialist", title: "Specialist job", bestWhen: "Timeline slides, PDFs, remote access, or desktop shells are the blocker." },
    ],
    buyingFramework: [
      { step: 1, title: "Confirm this use case is the primary job", href: "/guides/how-to-choose-project-management-software/" },
      { step: 2, title: "Write must-have views and automations", href: "/guides/project-management-requirements-guide/" },
      { step: 3, title: "Price the qualifying plan", href: "/guides/project-management-pricing-guide/" },
      { step: 4, title: "Compare researched platforms", href: "/best/project-management-software/", ctaLabel: "Best project management →" },
    ],
    heroVisual: {
      src: "/use-cases/work-management-hero.png",
      alt: "Educational diagram for Work management / Work OS in project management.",
      caption: "Work management as buyers should evaluate it — not a product endorsement.",
    },
    needsVisual: {
      src: "/use-cases/work-management-needs.png",
      alt: "Needs diagram for Work management / Work OS.",
      caption: "What usually breaks — and how the right tooling helps.",
    },
    workflowVisual: {
      src: "/use-cases/work-management-workflow.png",
      alt: "Workflow diagram for Work management / Work OS.",
      caption: "A practical operating loop for this use case.",
    },
    faq: [
      {
        question: "Which products relate to this use case?",
        answer: "In the current project-management catalogue wave, explore: monday, hive. Related products appear when those soft entries are seeded and tagged.",
      },
      {
        question: "Is there one best tool for this use case?",
        answer: "No. Fit depends on job cluster, seats, and plan gates. Use the Best project management software page for methodology-based awards inside clusters.",
      },
    ],
    relatedUseCaseSlugs: ["project-tracking","team-collaboration-work","resource-planning"],
    featuredGuideHrefs: PM_GUIDES,
  },

  "project-tracking": {
    ...PM_CTAS,
    displayTitle: "Project management for Project & task tracking",
    badgeLabel: "Project tracking",
    tagline: "Keep tasks owned, dated, and reviewable — so delivery status is not tribal knowledge.",
    overview: "Project tracking is the operational layer of work management: tasks, owners, due dates, and status that survive handoffs.",
    whoThisIsFor: "Project managers, agency pods, and professional-services teams measuring delivery by completed work items.",
    whatMattersIntro: "Require clear ownership fields, status discipline, and a review cadence — not the longest feature list.",
    workedExample: "Worked example: Northline Ops runs a weekly stuck-task review from the board instead of verbal updates.",
    workedExampleSecondary: "Worked example: a founder-led team adds due dates and owners so coverage survives vacation.",
    glance: {
      primaryGoal: "Keep tasks owned, dated, and reviewable",
      typicalTeam: "Ops, project managers, agencies, and delivery teams",
      commonPriorities: ["Ownership", "Status accuracy", "Views on the right plan", "Integrations", "Weekly review ritual"],
    },
    challenges: [
          {
                "id": "scatter",
                "title": "Work status lives in chat and sheets",
                "pain": "Managers reconstruct progress every week.",
                "crmHelps": "Shared boards and owners keep status in one place."
          },
          {
                "id": "owners",
                "title": "Ownership is unclear",
                "pain": "Tasks stall because nobody is accountable.",
                "crmHelps": "Required owners and due dates make gaps visible."
          },
          {
                "id": "handoffs",
                "title": "Handoffs depend on memory",
                "pain": "Status updates are missed between teams.",
                "crmHelps": "Automations and notifications move work without chasing."
          },
          {
                "id": "visibility",
                "title": "Leaders lack a trusted view",
                "pain": "Reporting is a last-minute slide rebuild.",
                "crmHelps": "Dashboards and timelines reuse live work data."
          }
    ],
    outcomes: [
          {
                "id": "owned",
                "title": "Owned work",
                "description": "Every active item has a person and a next date."
          },
          {
                "id": "visible",
                "title": "Visible status",
                "description": "Reviews start from the board, not from Slack."
          },
          {
                "id": "fewer-chasers",
                "title": "Fewer status chasers",
                "description": "Automations and dashboards reduce manual pinging."
          },
          {
                "id": "cleaner-handoffs",
                "title": "Cleaner handoffs",
                "description": "Context stays on the work item."
          }
    ],
    capabilityNeeds: [
      {
        id: "task-boards",
        title: "Task Boards",
        description: "Evaluate task boards on the plan you will buy.",
        priority: "must",
        href: "/capabilities/task-boards/",
      },
      {
        id: "automations-workflows",
        title: "Automations Workflows",
        description: "Evaluate automations workflows on the plan you will buy.",
        priority: "must",
        href: "/capabilities/automations-workflows/",
      },
      {
        id: "docs-collaboration",
        title: "Docs Collaboration",
        description: "Evaluate docs collaboration on the plan you will buy.",
        priority: "must",
        href: "/capabilities/docs-collaboration/",
      },
      {
        id: "time-tracking",
        title: "Time Tracking",
        description: "Evaluate time tracking on the plan you will buy.",
        priority: "nice",
        href: "/capabilities/time-tracking/",
      }
    ],
    workflowSteps: [
          {
                "id": "capture",
                "label": "Capture work",
                "detail": "Create items with owners and due dates.",
                "goal": "No orphan work."
          },
          {
                "id": "plan",
                "label": "Plan the view",
                "detail": "Use boards or timelines the team will actually open.",
                "goal": "One agreed view of status."
          },
          {
                "id": "automate",
                "label": "Automate handoffs",
                "detail": "Notify the next owner when status changes.",
                "goal": "Less manual chasing."
          },
          {
                "id": "review",
                "label": "Review weekly",
                "detail": "Start from stuck items and overloaded people.",
                "goal": "One improvement per week."
          }
    ],
    priorities: [
      { id: "ownership", title: "Ownership", description: "Every active item has a named owner.", icon: "check" },
      { id: "plan-gates", title: "Plan gates", description: "Must-have views unlock on the quoted plan.", icon: "shield" },
      { id: "integrations", title: "Integrations", description: "Native connectors for tools people open daily.", icon: "globe" },
    ],
    scenarios: [
      { id: "agency", title: "Agency / studio", bestWhen: "Client delivery needs shared owners and status." },
      { id: "ops", title: "Internal ops", bestWhen: "Cross-functional work stalls without a system of record." },
      { id: "specialist", title: "Specialist job", bestWhen: "Timeline slides, PDFs, remote access, or desktop shells are the blocker." },
    ],
    buyingFramework: [
      { step: 1, title: "Confirm this use case is the primary job", href: "/guides/how-to-choose-project-management-software/" },
      { step: 2, title: "Write must-have views and automations", href: "/guides/project-management-requirements-guide/" },
      { step: 3, title: "Price the qualifying plan", href: "/guides/project-management-pricing-guide/" },
      { step: 4, title: "Compare researched platforms", href: "/best/project-management-software/", ctaLabel: "Best project management →" },
    ],
    heroVisual: {
      src: "/use-cases/project-tracking-hero.png",
      alt: "Educational diagram for Project & task tracking in project management.",
      caption: "Project tracking as buyers should evaluate it — not a product endorsement.",
    },
    needsVisual: {
      src: "/use-cases/project-tracking-needs.png",
      alt: "Needs diagram for Project & task tracking.",
      caption: "What usually breaks — and how the right tooling helps.",
    },
    workflowVisual: {
      src: "/use-cases/project-tracking-workflow.png",
      alt: "Workflow diagram for Project & task tracking.",
      caption: "A practical operating loop for this use case.",
    },
    faq: [
      {
        question: "Which products relate to this use case?",
        answer: "In the current project-management catalogue wave, explore: monday, hive. Related products appear when those soft entries are seeded and tagged.",
      },
      {
        question: "Is there one best tool for this use case?",
        answer: "No. Fit depends on job cluster, seats, and plan gates. Use the Best project management software page for methodology-based awards inside clusters.",
      },
    ],
    relatedUseCaseSlugs: ["work-management","team-collaboration-work","timeline-reporting"],
    featuredGuideHrefs: PM_GUIDES,
  },

  "timeline-reporting": {
    ...PM_CTAS,
    displayTitle: "Project management for Timeline & executive reporting",
    badgeLabel: "Timeline reporting",
    tagline: "Show sequence, dependencies, and milestones to people who will not live inside the task board.",
    overview: "Timeline reporting turns delivery plans into Gantt, roadmap, or executive-ready views — either inside a work OS or via a PowerPoint specialist.",
    whoThisIsFor: "PMs and programme leads who brief executives or clients on milestones and risk.",
    whatMattersIntro: "Decide whether you need living timeline views in a work OS or presentation-grade slides in PowerPoint.",
    workedExample: "Worked example: a programme lead exports a monthly steering deck; Office Timeline fits when PowerPoint polish is the job.",
    workedExampleSecondary: "Worked example: an ops lead uses a work OS timeline so dates stay linked to live tasks.",
    glance: {
      primaryGoal: "Show sequence, dependencies, and milestones to people who will not live inside the task board.",
      typicalTeam: "Ops, project managers, agencies, and delivery teams",
      commonPriorities: ["Ownership", "Status accuracy", "Views on the right plan", "Integrations", "Weekly review ritual"],
    },
    challenges: [
          {
                "id": "scatter",
                "title": "Work status lives in chat and sheets",
                "pain": "Managers reconstruct progress every week.",
                "crmHelps": "Shared boards and owners keep status in one place."
          },
          {
                "id": "owners",
                "title": "Ownership is unclear",
                "pain": "Tasks stall because nobody is accountable.",
                "crmHelps": "Required owners and due dates make gaps visible."
          },
          {
                "id": "handoffs",
                "title": "Handoffs depend on memory",
                "pain": "Status updates are missed between teams.",
                "crmHelps": "Automations and notifications move work without chasing."
          },
          {
                "id": "visibility",
                "title": "Leaders lack a trusted view",
                "pain": "Reporting is a last-minute slide rebuild.",
                "crmHelps": "Dashboards and timelines reuse live work data."
          }
    ],
    outcomes: [
          {
                "id": "owned",
                "title": "Owned work",
                "description": "Every active item has a person and a next date."
          },
          {
                "id": "visible",
                "title": "Visible status",
                "description": "Reviews start from the board, not from Slack."
          },
          {
                "id": "fewer-chasers",
                "title": "Fewer status chasers",
                "description": "Automations and dashboards reduce manual pinging."
          },
          {
                "id": "cleaner-handoffs",
                "title": "Cleaner handoffs",
                "description": "Context stays on the work item."
          }
    ],
    capabilityNeeds: [
      {
        id: "timeline-gantt",
        title: "Timeline Gantt",
        description: "Evaluate timeline gantt on the plan you will buy.",
        priority: "must",
        href: "/capabilities/timeline-gantt/",
      },
      {
        id: "reporting-dashboards",
        title: "Reporting Dashboards",
        description: "Evaluate reporting dashboards on the plan you will buy.",
        priority: "must",
        href: "/capabilities/reporting-dashboards/",
      },
      {
        id: "task-boards",
        title: "Task Boards",
        description: "Evaluate task boards on the plan you will buy.",
        priority: "must",
        href: "/capabilities/task-boards/",
      }
    ],
    workflowSteps: [
          {
                "id": "capture",
                "label": "Capture work",
                "detail": "Create items with owners and due dates.",
                "goal": "No orphan work."
          },
          {
                "id": "plan",
                "label": "Plan the view",
                "detail": "Use boards or timelines the team will actually open.",
                "goal": "One agreed view of status."
          },
          {
                "id": "automate",
                "label": "Automate handoffs",
                "detail": "Notify the next owner when status changes.",
                "goal": "Less manual chasing."
          },
          {
                "id": "review",
                "label": "Review weekly",
                "detail": "Start from stuck items and overloaded people.",
                "goal": "One improvement per week."
          }
    ],
    priorities: [
      { id: "ownership", title: "Ownership", description: "Every active item has a named owner.", icon: "check" },
      { id: "plan-gates", title: "Plan gates", description: "Must-have views unlock on the quoted plan.", icon: "shield" },
      { id: "integrations", title: "Integrations", description: "Native connectors for tools people open daily.", icon: "globe" },
    ],
    scenarios: [
      { id: "agency", title: "Agency / studio", bestWhen: "Client delivery needs shared owners and status." },
      { id: "ops", title: "Internal ops", bestWhen: "Cross-functional work stalls without a system of record." },
      { id: "specialist", title: "Specialist job", bestWhen: "Timeline slides, PDFs, remote access, or desktop shells are the blocker." },
    ],
    buyingFramework: [
      { step: 1, title: "Confirm this use case is the primary job", href: "/guides/how-to-choose-project-management-software/" },
      { step: 2, title: "Write must-have views and automations", href: "/guides/project-management-requirements-guide/" },
      { step: 3, title: "Price the qualifying plan", href: "/guides/project-management-pricing-guide/" },
      { step: 4, title: "Compare researched platforms", href: "/best/project-management-software/", ctaLabel: "Best project management →" },
    ],
    heroVisual: {
      src: "/use-cases/timeline-reporting-hero.png",
      alt: "Educational diagram for Timeline & executive reporting in project management.",
      caption: "Timeline reporting as buyers should evaluate it — not a product endorsement.",
    },
    needsVisual: {
      src: "/use-cases/timeline-reporting-needs.png",
      alt: "Needs diagram for Timeline & executive reporting.",
      caption: "What usually breaks — and how the right tooling helps.",
    },
    workflowVisual: {
      src: "/use-cases/timeline-reporting-workflow.png",
      alt: "Workflow diagram for Timeline & executive reporting.",
      caption: "A practical operating loop for this use case.",
    },
    faq: [
      {
        question: "Which products relate to this use case?",
        answer: "In the current project-management catalogue wave, explore: monday, hive, office-timeline. Related products appear when those soft entries are seeded and tagged.",
      },
      {
        question: "Is there one best tool for this use case?",
        answer: "No. Fit depends on job cluster, seats, and plan gates. Use the Best project management software page for methodology-based awards inside clusters.",
      },
    ],
    relatedUseCaseSlugs: ["work-management","project-tracking","resource-planning"],
    featuredGuideHrefs: PM_GUIDES,
  },

  "team-collaboration-work": {
    ...PM_CTAS,
    displayTitle: "Project management for Team collaboration on work",
    badgeLabel: "Team collaboration",
    tagline: "Keep comments, files, and decisions on the work item — not trapped in private chat.",
    overview: "Collaboration on work means docs, comments, proofing, and @mentions attached to tasks and projects so context survives staff changes.",
    whoThisIsFor: "Agencies, product pods, and ops teams that currently coordinate delivery in chat.",
    whatMattersIntro: "Evaluate comment quality, file attachment, guest access, and notification noise.",
    workedExample: "Worked example: designers leave proofing notes on the deliverable card instead of a buried Slack thread.",
    workedExampleSecondary: "Worked example: a client guest can comment without needing a full paid seat — confirm guest rules.",
    glance: {
      primaryGoal: "Keep comments, files, and decisions on the work item",
      typicalTeam: "Ops, project managers, agencies, and delivery teams",
      commonPriorities: ["Ownership", "Status accuracy", "Views on the right plan", "Integrations", "Weekly review ritual"],
    },
    challenges: [
          {
                "id": "scatter",
                "title": "Work status lives in chat and sheets",
                "pain": "Managers reconstruct progress every week.",
                "crmHelps": "Shared boards and owners keep status in one place."
          },
          {
                "id": "owners",
                "title": "Ownership is unclear",
                "pain": "Tasks stall because nobody is accountable.",
                "crmHelps": "Required owners and due dates make gaps visible."
          },
          {
                "id": "handoffs",
                "title": "Handoffs depend on memory",
                "pain": "Status updates are missed between teams.",
                "crmHelps": "Automations and notifications move work without chasing."
          },
          {
                "id": "visibility",
                "title": "Leaders lack a trusted view",
                "pain": "Reporting is a last-minute slide rebuild.",
                "crmHelps": "Dashboards and timelines reuse live work data."
          }
    ],
    outcomes: [
          {
                "id": "owned",
                "title": "Owned work",
                "description": "Every active item has a person and a next date."
          },
          {
                "id": "visible",
                "title": "Visible status",
                "description": "Reviews start from the board, not from Slack."
          },
          {
                "id": "fewer-chasers",
                "title": "Fewer status chasers",
                "description": "Automations and dashboards reduce manual pinging."
          },
          {
                "id": "cleaner-handoffs",
                "title": "Cleaner handoffs",
                "description": "Context stays on the work item."
          }
    ],
    capabilityNeeds: [
      {
        id: "docs-collaboration",
        title: "Docs Collaboration",
        description: "Evaluate docs collaboration on the plan you will buy.",
        priority: "must",
        href: "/capabilities/docs-collaboration/",
      },
      {
        id: "task-boards",
        title: "Task Boards",
        description: "Evaluate task boards on the plan you will buy.",
        priority: "must",
        href: "/capabilities/task-boards/",
      },
      {
        id: "integrations-ecosystem",
        title: "Integrations Ecosystem",
        description: "Evaluate integrations ecosystem on the plan you will buy.",
        priority: "must",
        href: "/capabilities/integrations-ecosystem/",
      }
    ],
    workflowSteps: [
          {
                "id": "capture",
                "label": "Capture work",
                "detail": "Create items with owners and due dates.",
                "goal": "No orphan work."
          },
          {
                "id": "plan",
                "label": "Plan the view",
                "detail": "Use boards or timelines the team will actually open.",
                "goal": "One agreed view of status."
          },
          {
                "id": "automate",
                "label": "Automate handoffs",
                "detail": "Notify the next owner when status changes.",
                "goal": "Less manual chasing."
          },
          {
                "id": "review",
                "label": "Review weekly",
                "detail": "Start from stuck items and overloaded people.",
                "goal": "One improvement per week."
          }
    ],
    priorities: [
      { id: "ownership", title: "Ownership", description: "Every active item has a named owner.", icon: "check" },
      { id: "plan-gates", title: "Plan gates", description: "Must-have views unlock on the quoted plan.", icon: "shield" },
      { id: "integrations", title: "Integrations", description: "Native connectors for tools people open daily.", icon: "globe" },
    ],
    scenarios: [
      { id: "agency", title: "Agency / studio", bestWhen: "Client delivery needs shared owners and status." },
      { id: "ops", title: "Internal ops", bestWhen: "Cross-functional work stalls without a system of record." },
      { id: "specialist", title: "Specialist job", bestWhen: "Timeline slides, PDFs, remote access, or desktop shells are the blocker." },
    ],
    buyingFramework: [
      { step: 1, title: "Confirm this use case is the primary job", href: "/guides/how-to-choose-project-management-software/" },
      { step: 2, title: "Write must-have views and automations", href: "/guides/project-management-requirements-guide/" },
      { step: 3, title: "Price the qualifying plan", href: "/guides/project-management-pricing-guide/" },
      { step: 4, title: "Compare researched platforms", href: "/best/project-management-software/", ctaLabel: "Best project management →" },
    ],
    heroVisual: {
      src: "/use-cases/team-collaboration-work-hero.png",
      alt: "Educational diagram for Team collaboration on work in project management.",
      caption: "Team collaboration as buyers should evaluate it — not a product endorsement.",
    },
    needsVisual: {
      src: "/use-cases/team-collaboration-work-needs.png",
      alt: "Needs diagram for Team collaboration on work.",
      caption: "What usually breaks — and how the right tooling helps.",
    },
    workflowVisual: {
      src: "/use-cases/team-collaboration-work-workflow.png",
      alt: "Workflow diagram for Team collaboration on work.",
      caption: "A practical operating loop for this use case.",
    },
    faq: [
      {
        question: "Which products relate to this use case?",
        answer: "In the current project-management catalogue wave, explore: monday, hive. Related products appear when those soft entries are seeded and tagged.",
      },
      {
        question: "Is there one best tool for this use case?",
        answer: "No. Fit depends on job cluster, seats, and plan gates. Use the Best project management software page for methodology-based awards inside clusters.",
      },
    ],
    relatedUseCaseSlugs: ["work-management","project-tracking","document-productivity"],
    featuredGuideHrefs: PM_GUIDES,
  },

  "resource-planning": {
    ...PM_CTAS,
    displayTitle: "Project management for Resource & capacity planning",
    badgeLabel: "Resource planning",
    tagline: "See who is overloaded before deadlines slip — not after.",
    overview: "Resource planning shows capacity across people and projects so managers can rebalance load before delivery fails.",
    whoThisIsFor: "Ops and delivery managers balancing multiple projects across the same people.",
    whatMattersIntro: "Check whether workload views are native, add-on, or enterprise-gated on your target plan.",
    workedExample: "Worked example: a studio lead spots two designers at 120% load two weeks before a launch and reassigns early.",
    workedExampleSecondary: "Worked example: a services firm uses capacity views to decide whether to hire or defer a project.",
    glance: {
      primaryGoal: "See who is overloaded before deadlines slip",
      typicalTeam: "Ops, project managers, agencies, and delivery teams",
      commonPriorities: ["Ownership", "Status accuracy", "Views on the right plan", "Integrations", "Weekly review ritual"],
    },
    challenges: [
          {
                "id": "scatter",
                "title": "Work status lives in chat and sheets",
                "pain": "Managers reconstruct progress every week.",
                "crmHelps": "Shared boards and owners keep status in one place."
          },
          {
                "id": "owners",
                "title": "Ownership is unclear",
                "pain": "Tasks stall because nobody is accountable.",
                "crmHelps": "Required owners and due dates make gaps visible."
          },
          {
                "id": "handoffs",
                "title": "Handoffs depend on memory",
                "pain": "Status updates are missed between teams.",
                "crmHelps": "Automations and notifications move work without chasing."
          },
          {
                "id": "visibility",
                "title": "Leaders lack a trusted view",
                "pain": "Reporting is a last-minute slide rebuild.",
                "crmHelps": "Dashboards and timelines reuse live work data."
          }
    ],
    outcomes: [
          {
                "id": "owned",
                "title": "Owned work",
                "description": "Every active item has a person and a next date."
          },
          {
                "id": "visible",
                "title": "Visible status",
                "description": "Reviews start from the board, not from Slack."
          },
          {
                "id": "fewer-chasers",
                "title": "Fewer status chasers",
                "description": "Automations and dashboards reduce manual pinging."
          },
          {
                "id": "cleaner-handoffs",
                "title": "Cleaner handoffs",
                "description": "Context stays on the work item."
          }
    ],
    capabilityNeeds: [
      {
        id: "workload-resources",
        title: "Workload Resources",
        description: "Evaluate workload resources on the plan you will buy.",
        priority: "must",
        href: "/capabilities/workload-resources/",
      },
      {
        id: "timeline-gantt",
        title: "Timeline Gantt",
        description: "Evaluate timeline gantt on the plan you will buy.",
        priority: "must",
        href: "/capabilities/timeline-gantt/",
      },
      {
        id: "reporting-dashboards",
        title: "Reporting Dashboards",
        description: "Evaluate reporting dashboards on the plan you will buy.",
        priority: "must",
        href: "/capabilities/reporting-dashboards/",
      },
      {
        id: "time-tracking",
        title: "Time Tracking",
        description: "Evaluate time tracking on the plan you will buy.",
        priority: "nice",
        href: "/capabilities/time-tracking/",
      }
    ],
    workflowSteps: [
          {
                "id": "capture",
                "label": "Capture work",
                "detail": "Create items with owners and due dates.",
                "goal": "No orphan work."
          },
          {
                "id": "plan",
                "label": "Plan the view",
                "detail": "Use boards or timelines the team will actually open.",
                "goal": "One agreed view of status."
          },
          {
                "id": "automate",
                "label": "Automate handoffs",
                "detail": "Notify the next owner when status changes.",
                "goal": "Less manual chasing."
          },
          {
                "id": "review",
                "label": "Review weekly",
                "detail": "Start from stuck items and overloaded people.",
                "goal": "One improvement per week."
          }
    ],
    priorities: [
      { id: "ownership", title: "Ownership", description: "Every active item has a named owner.", icon: "check" },
      { id: "plan-gates", title: "Plan gates", description: "Must-have views unlock on the quoted plan.", icon: "shield" },
      { id: "integrations", title: "Integrations", description: "Native connectors for tools people open daily.", icon: "globe" },
    ],
    scenarios: [
      { id: "agency", title: "Agency / studio", bestWhen: "Client delivery needs shared owners and status." },
      { id: "ops", title: "Internal ops", bestWhen: "Cross-functional work stalls without a system of record." },
      { id: "specialist", title: "Specialist job", bestWhen: "Timeline slides, PDFs, remote access, or desktop shells are the blocker." },
    ],
    buyingFramework: [
      { step: 1, title: "Confirm this use case is the primary job", href: "/guides/how-to-choose-project-management-software/" },
      { step: 2, title: "Write must-have views and automations", href: "/guides/project-management-requirements-guide/" },
      { step: 3, title: "Price the qualifying plan", href: "/guides/project-management-pricing-guide/" },
      { step: 4, title: "Compare researched platforms", href: "/best/project-management-software/", ctaLabel: "Best project management →" },
    ],
    heroVisual: {
      src: "/use-cases/resource-planning-hero.png",
      alt: "Educational diagram for Resource & capacity planning in project management.",
      caption: "Resource planning as buyers should evaluate it — not a product endorsement.",
    },
    needsVisual: {
      src: "/use-cases/resource-planning-needs.png",
      alt: "Needs diagram for Resource & capacity planning.",
      caption: "What usually breaks — and how the right tooling helps.",
    },
    workflowVisual: {
      src: "/use-cases/resource-planning-workflow.png",
      alt: "Workflow diagram for Resource & capacity planning.",
      caption: "A practical operating loop for this use case.",
    },
    faq: [
      {
        question: "Which products relate to this use case?",
        answer: "In the current project-management catalogue wave, explore: monday, hive. Related products appear when those soft entries are seeded and tagged.",
      },
      {
        question: "Is there one best tool for this use case?",
        answer: "No. Fit depends on job cluster, seats, and plan gates. Use the Best project management software page for methodology-based awards inside clusters.",
      },
    ],
    relatedUseCaseSlugs: ["work-management","project-tracking","timeline-reporting"],
    featuredGuideHrefs: PM_GUIDES,
  },

  "document-productivity": {
    ...PM_CTAS,
    displayTitle: "Project management for Document / PDF productivity",
    badgeLabel: "Document productivity",
    tagline: "Edit, convert, sign, or redact PDFs without turning document friction into a project delay.",
    overview: "Document productivity is the adjacent job of handling PDFs and files in delivery workflows — not a substitute for work tracking.",
    whoThisIsFor: "Teams whose bottleneck is contracts, proposals, or marked-up PDFs beside a project stack.",
    whatMattersIntro: "Buy for edit/sign/redact depth; keep work OS tracking as a separate decision.",
    workedExample: "Worked example: Harbor Studio redlines a client PDF in Foxit while the deliverable stays owned on the work board.",
    workedExampleSecondary: "Worked example: ops signs vendor PDFs without emailing desktop-only files around.",
    glance: {
      primaryGoal: "Edit, convert, sign, or redact PDFs without turning document friction into a project delay.",
      typicalTeam: "Ops, project managers, agencies, and delivery teams",
      commonPriorities: ["Ownership", "Status accuracy", "Views on the right plan", "Integrations", "Weekly review ritual"],
    },
    challenges: [
          {
                "id": "scatter",
                "title": "Work status lives in chat and sheets",
                "pain": "Managers reconstruct progress every week.",
                "crmHelps": "Shared boards and owners keep status in one place."
          },
          {
                "id": "owners",
                "title": "Ownership is unclear",
                "pain": "Tasks stall because nobody is accountable.",
                "crmHelps": "Required owners and due dates make gaps visible."
          },
          {
                "id": "handoffs",
                "title": "Handoffs depend on memory",
                "pain": "Status updates are missed between teams.",
                "crmHelps": "Automations and notifications move work without chasing."
          },
          {
                "id": "visibility",
                "title": "Leaders lack a trusted view",
                "pain": "Reporting is a last-minute slide rebuild.",
                "crmHelps": "Dashboards and timelines reuse live work data."
          }
    ],
    outcomes: [
          {
                "id": "owned",
                "title": "Owned work",
                "description": "Every active item has a person and a next date."
          },
          {
                "id": "visible",
                "title": "Visible status",
                "description": "Reviews start from the board, not from Slack."
          },
          {
                "id": "fewer-chasers",
                "title": "Fewer status chasers",
                "description": "Automations and dashboards reduce manual pinging."
          },
          {
                "id": "cleaner-handoffs",
                "title": "Cleaner handoffs",
                "description": "Context stays on the work item."
          }
    ],
    capabilityNeeds: [
      {
        id: "document-pdf",
        title: "Document Pdf",
        description: "Evaluate document pdf on the plan you will buy.",
        priority: "must",
        href: "/capabilities/document-pdf/",
      },
      {
        id: "docs-collaboration",
        title: "Docs Collaboration",
        description: "Evaluate docs collaboration on the plan you will buy.",
        priority: "must",
        href: "/capabilities/docs-collaboration/",
      }
    ],
    workflowSteps: [
          {
                "id": "capture",
                "label": "Capture work",
                "detail": "Create items with owners and due dates.",
                "goal": "No orphan work."
          },
          {
                "id": "plan",
                "label": "Plan the view",
                "detail": "Use boards or timelines the team will actually open.",
                "goal": "One agreed view of status."
          },
          {
                "id": "automate",
                "label": "Automate handoffs",
                "detail": "Notify the next owner when status changes.",
                "goal": "Less manual chasing."
          },
          {
                "id": "review",
                "label": "Review weekly",
                "detail": "Start from stuck items and overloaded people.",
                "goal": "One improvement per week."
          }
    ],
    priorities: [
      { id: "ownership", title: "Ownership", description: "Every active item has a named owner.", icon: "check" },
      { id: "plan-gates", title: "Plan gates", description: "Must-have views unlock on the quoted plan.", icon: "shield" },
      { id: "integrations", title: "Integrations", description: "Native connectors for tools people open daily.", icon: "globe" },
    ],
    scenarios: [
      { id: "agency", title: "Agency / studio", bestWhen: "Client delivery needs shared owners and status." },
      { id: "ops", title: "Internal ops", bestWhen: "Cross-functional work stalls without a system of record." },
      { id: "specialist", title: "Specialist job", bestWhen: "Timeline slides, PDFs, remote access, or desktop shells are the blocker." },
    ],
    buyingFramework: [
      { step: 1, title: "Confirm this use case is the primary job", href: "/guides/how-to-choose-project-management-software/" },
      { step: 2, title: "Write must-have views and automations", href: "/guides/project-management-requirements-guide/" },
      { step: 3, title: "Price the qualifying plan", href: "/guides/project-management-pricing-guide/" },
      { step: 4, title: "Compare researched platforms", href: "/best/project-management-software/", ctaLabel: "Best project management →" },
    ],
    heroVisual: {
      src: "/use-cases/document-productivity-hero.png",
      alt: "Educational diagram for Document / PDF productivity in project management.",
      caption: "Document productivity as buyers should evaluate it — not a product endorsement.",
    },
    needsVisual: {
      src: "/use-cases/document-productivity-needs.png",
      alt: "Needs diagram for Document / PDF productivity.",
      caption: "What usually breaks — and how the right tooling helps.",
    },
    workflowVisual: {
      src: "/use-cases/document-productivity-workflow.png",
      alt: "Workflow diagram for Document / PDF productivity.",
      caption: "A practical operating loop for this use case.",
    },
    faq: [
      {
        question: "Which products relate to this use case?",
        answer: "In the current project-management catalogue wave, explore: foxit. Related products appear when those soft entries are seeded and tagged.",
      },
      {
        question: "Is there one best tool for this use case?",
        answer: "No. Fit depends on job cluster, seats, and plan gates. Use the Best project management software page for methodology-based awards inside clusters.",
      },
    ],
    relatedUseCaseSlugs: ["team-collaboration-work","work-management"],
    featuredGuideHrefs: PM_GUIDES,
  },

  "remote-support-access": {
    ...PM_CTAS,
    displayTitle: "Project management for Remote support & access",
    badgeLabel: "Remote support",
    tagline: "Reach a machine or session securely when support or remote work needs more than a screenshare link.",
    overview: "Remote support and access covers browser remote desktop, unattended access, and session sharing for support and distributed work.",
    whoThisIsFor: "IT and support teams, or ops groups supporting remote machines and clients.",
    whatMattersIntro: "Evaluate session security, unattended access, and browser convenience — not work OS features.",
    workedExample: "Worked example: support joins a browser session to fix a client machine without a heavy desktop client.",
    workedExampleSecondary: "Worked example: unattended access lets ops restart a studio machine overnight.",
    glance: {
      primaryGoal: "Reach a machine or session securely when support or remote work needs more than a screenshare link.",
      typicalTeam: "Ops, project managers, agencies, and delivery teams",
      commonPriorities: ["Ownership", "Status accuracy", "Views on the right plan", "Integrations", "Weekly review ritual"],
    },
    challenges: [
          {
                "id": "scatter",
                "title": "Work status lives in chat and sheets",
                "pain": "Managers reconstruct progress every week.",
                "crmHelps": "Shared boards and owners keep status in one place."
          },
          {
                "id": "owners",
                "title": "Ownership is unclear",
                "pain": "Tasks stall because nobody is accountable.",
                "crmHelps": "Required owners and due dates make gaps visible."
          },
          {
                "id": "handoffs",
                "title": "Handoffs depend on memory",
                "pain": "Status updates are missed between teams.",
                "crmHelps": "Automations and notifications move work without chasing."
          },
          {
                "id": "visibility",
                "title": "Leaders lack a trusted view",
                "pain": "Reporting is a last-minute slide rebuild.",
                "crmHelps": "Dashboards and timelines reuse live work data."
          }
    ],
    outcomes: [
          {
                "id": "owned",
                "title": "Owned work",
                "description": "Every active item has a person and a next date."
          },
          {
                "id": "visible",
                "title": "Visible status",
                "description": "Reviews start from the board, not from Slack."
          },
          {
                "id": "fewer-chasers",
                "title": "Fewer status chasers",
                "description": "Automations and dashboards reduce manual pinging."
          },
          {
                "id": "cleaner-handoffs",
                "title": "Cleaner handoffs",
                "description": "Context stays on the work item."
          }
    ],
    capabilityNeeds: [
      {
        id: "remote-access",
        title: "Remote Access",
        description: "Evaluate remote access on the plan you will buy.",
        priority: "must",
        href: "/capabilities/remote-access/",
      }
    ],
    workflowSteps: [
          {
                "id": "capture",
                "label": "Capture work",
                "detail": "Create items with owners and due dates.",
                "goal": "No orphan work."
          },
          {
                "id": "plan",
                "label": "Plan the view",
                "detail": "Use boards or timelines the team will actually open.",
                "goal": "One agreed view of status."
          },
          {
                "id": "automate",
                "label": "Automate handoffs",
                "detail": "Notify the next owner when status changes.",
                "goal": "Less manual chasing."
          },
          {
                "id": "review",
                "label": "Review weekly",
                "detail": "Start from stuck items and overloaded people.",
                "goal": "One improvement per week."
          }
    ],
    priorities: [
      { id: "ownership", title: "Ownership", description: "Every active item has a named owner.", icon: "check" },
      { id: "plan-gates", title: "Plan gates", description: "Must-have views unlock on the quoted plan.", icon: "shield" },
      { id: "integrations", title: "Integrations", description: "Native connectors for tools people open daily.", icon: "globe" },
    ],
    scenarios: [
      { id: "agency", title: "Agency / studio", bestWhen: "Client delivery needs shared owners and status." },
      { id: "ops", title: "Internal ops", bestWhen: "Cross-functional work stalls without a system of record." },
      { id: "specialist", title: "Specialist job", bestWhen: "Timeline slides, PDFs, remote access, or desktop shells are the blocker." },
    ],
    buyingFramework: [
      { step: 1, title: "Confirm this use case is the primary job", href: "/guides/how-to-choose-project-management-software/" },
      { step: 2, title: "Write must-have views and automations", href: "/guides/project-management-requirements-guide/" },
      { step: 3, title: "Price the qualifying plan", href: "/guides/project-management-pricing-guide/" },
      { step: 4, title: "Compare researched platforms", href: "/best/project-management-software/", ctaLabel: "Best project management →" },
    ],
    heroVisual: {
      src: "/use-cases/remote-support-access-hero.png",
      alt: "Educational diagram for Remote support & access in project management.",
      caption: "Remote support as buyers should evaluate it — not a product endorsement.",
    },
    needsVisual: {
      src: "/use-cases/remote-support-access-needs.png",
      alt: "Needs diagram for Remote support & access.",
      caption: "What usually breaks — and how the right tooling helps.",
    },
    workflowVisual: {
      src: "/use-cases/remote-support-access-workflow.png",
      alt: "Workflow diagram for Remote support & access.",
      caption: "A practical operating loop for this use case.",
    },
    faq: [
      {
        question: "Which products relate to this use case?",
        answer: "In the current project-management catalogue wave, explore: getscreen-me. Related products appear when those soft entries are seeded and tagged.",
      },
      {
        question: "Is there one best tool for this use case?",
        answer: "No. Fit depends on job cluster, seats, and plan gates. Use the Best project management software page for methodology-based awards inside clusters.",
      },
    ],
    relatedUseCaseSlugs: ["desktop-productivity","work-management"],
    featuredGuideHrefs: PM_GUIDES,
  },

  "desktop-productivity": {
    ...PM_CTAS,
    displayTitle: "Project management for Desktop productivity workspace",
    badgeLabel: "Desktop workspace",
    tagline: "Organise the web apps you live in as desktop workspaces — without confusing that for project tracking.",
    overview: "Desktop productivity workspaces wrap and organise apps into focus contexts. They sit beside a work OS; they do not replace boards and timelines.",
    whoThisIsFor: "Knowledge workers juggling many SaaS tools who need cleaner desktop contexts per client or project.",
    whatMattersIntro: "Buy for workspace organisation; keep delivery tracking in a work OS.",
    workedExample: "Worked example: an account lead opens a client workspace with the apps for that account only.",
    workedExampleSecondary: "Worked example: a contractor separates personal and client app sets on one machine.",
    glance: {
      primaryGoal: "Organise the web apps you live in as desktop workspaces",
      typicalTeam: "Ops, project managers, agencies, and delivery teams",
      commonPriorities: ["Ownership", "Status accuracy", "Views on the right plan", "Integrations", "Weekly review ritual"],
    },
    challenges: [
          {
                "id": "scatter",
                "title": "Work status lives in chat and sheets",
                "pain": "Managers reconstruct progress every week.",
                "crmHelps": "Shared boards and owners keep status in one place."
          },
          {
                "id": "owners",
                "title": "Ownership is unclear",
                "pain": "Tasks stall because nobody is accountable.",
                "crmHelps": "Required owners and due dates make gaps visible."
          },
          {
                "id": "handoffs",
                "title": "Handoffs depend on memory",
                "pain": "Status updates are missed between teams.",
                "crmHelps": "Automations and notifications move work without chasing."
          },
          {
                "id": "visibility",
                "title": "Leaders lack a trusted view",
                "pain": "Reporting is a last-minute slide rebuild.",
                "crmHelps": "Dashboards and timelines reuse live work data."
          }
    ],
    outcomes: [
          {
                "id": "owned",
                "title": "Owned work",
                "description": "Every active item has a person and a next date."
          },
          {
                "id": "visible",
                "title": "Visible status",
                "description": "Reviews start from the board, not from Slack."
          },
          {
                "id": "fewer-chasers",
                "title": "Fewer status chasers",
                "description": "Automations and dashboards reduce manual pinging."
          },
          {
                "id": "cleaner-handoffs",
                "title": "Cleaner handoffs",
                "description": "Context stays on the work item."
          }
    ],
    capabilityNeeds: [
      {
        id: "desktop-workspace",
        title: "Desktop Workspace",
        description: "Evaluate desktop workspace on the plan you will buy.",
        priority: "must",
        href: "/capabilities/desktop-workspace/",
      }
    ],
    workflowSteps: [
          {
                "id": "capture",
                "label": "Capture work",
                "detail": "Create items with owners and due dates.",
                "goal": "No orphan work."
          },
          {
                "id": "plan",
                "label": "Plan the view",
                "detail": "Use boards or timelines the team will actually open.",
                "goal": "One agreed view of status."
          },
          {
                "id": "automate",
                "label": "Automate handoffs",
                "detail": "Notify the next owner when status changes.",
                "goal": "Less manual chasing."
          },
          {
                "id": "review",
                "label": "Review weekly",
                "detail": "Start from stuck items and overloaded people.",
                "goal": "One improvement per week."
          }
    ],
    priorities: [
      { id: "ownership", title: "Ownership", description: "Every active item has a named owner.", icon: "check" },
      { id: "plan-gates", title: "Plan gates", description: "Must-have views unlock on the quoted plan.", icon: "shield" },
      { id: "integrations", title: "Integrations", description: "Native connectors for tools people open daily.", icon: "globe" },
    ],
    scenarios: [
      { id: "agency", title: "Agency / studio", bestWhen: "Client delivery needs shared owners and status." },
      { id: "ops", title: "Internal ops", bestWhen: "Cross-functional work stalls without a system of record." },
      { id: "specialist", title: "Specialist job", bestWhen: "Timeline slides, PDFs, remote access, or desktop shells are the blocker." },
    ],
    buyingFramework: [
      { step: 1, title: "Confirm this use case is the primary job", href: "/guides/how-to-choose-project-management-software/" },
      { step: 2, title: "Write must-have views and automations", href: "/guides/project-management-requirements-guide/" },
      { step: 3, title: "Price the qualifying plan", href: "/guides/project-management-pricing-guide/" },
      { step: 4, title: "Compare researched platforms", href: "/best/project-management-software/", ctaLabel: "Best project management →" },
    ],
    heroVisual: {
      src: "/use-cases/desktop-productivity-hero.png",
      alt: "Educational diagram for Desktop productivity workspace in project management.",
      caption: "Desktop workspace as buyers should evaluate it — not a product endorsement.",
    },
    needsVisual: {
      src: "/use-cases/desktop-productivity-needs.png",
      alt: "Needs diagram for Desktop productivity workspace.",
      caption: "What usually breaks — and how the right tooling helps.",
    },
    workflowVisual: {
      src: "/use-cases/desktop-productivity-workflow.png",
      alt: "Workflow diagram for Desktop productivity workspace.",
      caption: "A practical operating loop for this use case.",
    },
    faq: [
      {
        question: "Which products relate to this use case?",
        answer: "In the current project-management catalogue wave, explore: webcatalog. Related products appear when those soft entries are seeded and tagged.",
      },
      {
        question: "Is there one best tool for this use case?",
        answer: "No. Fit depends on job cluster, seats, and plan gates. Use the Best project management software page for methodology-based awards inside clusters.",
      },
    ],
    relatedUseCaseSlugs: ["document-productivity","team-collaboration-work"],
    featuredGuideHrefs: PM_GUIDES,
  }
};
