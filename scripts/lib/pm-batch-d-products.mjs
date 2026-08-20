/**
 * Project Management Batch D optional specialists.
 * Basecamp, Todoist, Microsoft Project — research floors 2026-08-17.
 * Affiliate economics never enter scores. handsOnTesting=false.
 */
import { expandPmProduct } from "./pm-compact-expand.mjs";

const COMPACT = [
  {
    "slug": "basecamp",
    "name": "Basecamp",
    "company": "Basecamp, LLC",
    "website": "https://basecamp.com",
    "domain": "basecamp.com",
    "pricingUrl": "https://basecamp.com/pricing",
    "aliases": [
      "Basecamp 4"
    ],
    "membershipRole": "primary",
    "jobCluster": "lightweight-board",
    "softShortDescription": "Opinionated simple project hub (to-dos, message boards, chat, docs) — Free; Pro from $15/user/mo; Pro Unlimited $299/mo flat.",
    "shortDescription": "Basecamp is an opinionated project and team hub built around to-dos, message boards, Campfire chat, schedules and docs — deliberately avoiding complex Work OS configuration. Free covers one project; Pro is $15/user/month (clients/contractors free); Pro Unlimited is $299/month flat for unlimited users (annual packaging common). Timesheet and Admin Pro Pack are optional Pro upgrades (~$50/mo flat each) and included on Pro Unlimited.",
    "vendorPositioning": "The all-in-one toolkit for working together — stay organised without the complexity of traditional project management.",
    "pricingModel": "hybrid",
    "hasFreePlan": true,
    "hasFreeTrial": true,
    "trialDays": 30,
    "startingPriceMonthly": 15,
    "startingPriceConfidence": "high",
    "pricingNotes": "Verified 2026-08-17 from basecamp.com/pricing: Free (1 project); Pro $15/user/mo (clients/contractors free; 30-day trial); Pro Unlimited $299/mo flat unlimited users (60-day trial; Admin Pro Pack + Timesheet included). Optional Pro upgrades ~$50/mo flat each. Confirm live.",
    "pricingSummary": "Free (1 project); Pro $15/user/mo; Pro Unlimited $299/mo flat. Confirm live.",
    "plans": [
      {
        "kind": "free",
        "slug": "free",
        "name": "Free",
        "limits": {
          "maxProjects": 1
        },
        "description": "Free — one project at a time."
      },
      {
        "kind": "per-seat-monthly",
        "slug": "pro",
        "amount": 15,
        "name": "Pro",
        "highlighted": true,
        "hasFreeTrial": true,
        "trialDays": 30,
        "description": "$15/user/month — employees/full users billed; clients and contractors free. 30-day trial."
      },
      {
        "kind": "flat-annual",
        "slug": "pro-unlimited",
        "amount": 299,
        "name": "Pro Unlimited",
        "description": "$299/month flat (unlimited users) — 5TB storage, Admin Pro Pack + Timesheet included, 60-day trial. Confirm annual invoice options live."
      }
    ],
    "featureOverrides": {
      "task-boards": "supported",
      "timeline-gantt": "limited",
      "workload-resources": "not-supported",
      "automations-workflows": "not-supported",
      "time-tracking": "add-on",
      "docs-collaboration": "supported",
      "integrations-ecosystem": "limited",
      "reporting-dashboards": "limited",
      "ai-assistance": "not-supported",
      "document-pdf": "not-supported",
      "remote-access": "not-supported",
      "desktop-workspace": "not-supported"
    },
    "aiLines": [
      "AI assistant: not-supported",
      "AI summaries: not-supported",
      "AI automation: not-supported",
      "AI recommendations: not-supported"
    ],
    "integrations": [
      {
        "integrationSlug": "zapier",
        "kind": "zapier-style"
      },
      {
        "integrationSlug": "slack",
        "kind": "limited"
      }
    ],
    "scores": {
      "ease-of-use": 9,
      "work-planning": 6,
      "automation-workflows": 3,
      "collaboration": 9,
      "integrations": 5,
      "reporting": 5,
      "scalability": 7,
      "value-for-money": 8,
      "ai-capabilities": 2
    },
    "bestFor": [
      "Teams wanting simple async project hubs",
      "SMBs rejecting Work OS complexity",
      "Orgs that benefit from Pro Unlimited flat pricing"
    ],
    "notIdealFor": [
      "Complex portfolio/resource PM",
      "Automation-heavy ops",
      "AI-first buyers",
      "Engineering sprint trackers"
    ],
    "pros": [
      "Extremely clear simple model",
      "Strong collaboration surfaces",
      "Pro Unlimited flat price",
      "Clients/contractors free on Pro",
      "Long-running trustworthy vendor narrative"
    ],
    "cons": [
      "Thin automation",
      "Not a Work OS peer",
      "No AI centre of gravity",
      "Light integrations",
      "Free limited to one project"
    ],
    "keyFeatures": [
      "To-dos",
      "Message boards",
      "Campfire & Pings",
      "Card Tables",
      "Schedule",
      "Docs & Files"
    ],
    "whoShouldChoose": "Choose Basecamp when you want a simple project hub with messaging and to-dos — landscape on Work OS best lists, not a monday/Asana substitute.",
    "whoShouldConsiderAlternatives": "Compare Asana/ClickUp for Work OS depth, Trello for lighter Kanban-only, and Todoist for personal/team task lists.",
    "alternativeSlugs": [
      "asana",
      "trello",
      "todoist"
    ],
    "competitorSlugs": [
      "asana",
      "trello",
      "monday",
      "clickup",
      "todoist"
    ],
    "comparableSlugs": [
      "trello",
      "todoist"
    ],
    "useCaseSlugs": [
      "project-tracking",
      "team-collaboration-work"
    ],
    "businessSizeSlugs": [
      "micro",
      "small-business",
      "mid-market"
    ],
    "teamTypeSlugs": [
      "operations",
      "founders",
      "agencies"
    ],
    "limitations": [
      "Not a deep Work OS / portfolio planner",
      "Minimal native automation",
      "Free limited to one project",
      "AI not in product scope"
    ],
    "scoreRationales": {
      "ease-of-use": "Deliberately simple UX — high adoption for teams rejecting complex Work OS tools.",
      "work-planning": "To-dos, card tables and schedules cover basics; no deep portfolio/Gantt Work OS envelope — 6 by design.",
      "automation-workflows": "Basecamp actively avoids heavy automation — low by design.",
      "collaboration": "Message boards, Campfire, pings and docs are the product’s centre of gravity — 9.",
      "integrations": "Intentionally lighter ecosystem vs monday/Asana — held at 5.",
      "reporting": "Check-ins and reports exist but are not PMO BI — 5.",
      "scalability": "Pro Unlimited flat $299 scales user count unusually well; Free/Pro have project/user trade-offs.",
      "value-for-money": "Pro Unlimited can be exceptional above ~20 users; Pro $15 is fair for simple hubs. Affiliate economics excluded.",
      "ai-capabilities": "AI is not part of Basecamp’s product story — 2 by design."
    }
  },
  {
    "slug": "todoist",
    "name": "Todoist",
    "company": "Doist Inc.",
    "website": "https://todoist.com",
    "domain": "todoist.com",
    "pricingUrl": "https://todoist.com/pricing",
    "aliases": [],
    "membershipRole": "primary",
    "jobCluster": "lightweight-board",
    "softShortDescription": "Personal and team task manager with natural-language capture — Free; Pro from ~$6.25/user/mo annual; Business ~$10.",
    "shortDescription": "Todoist is a task and to-do manager for individuals and small teams with natural-language task capture, projects, labels, filters and light board/calendar views. Beginner Free; Pro ~$6.25/user/mo annual; Business ~$10/user/mo (plus local tax) with team workspace features. Strong for personal productivity and light team tasks — not a full Work OS.",
    "vendorPositioning": "The to-do list to organise work and life — capture tasks naturally and get them done.",
    "pricingModel": "freemium",
    "hasFreePlan": true,
    "hasFreeTrial": true,
    "startingPriceMonthly": 6.25,
    "startingPriceConfidence": "medium",
    "pricingNotes": "Cross-checked 2026-08-17: Beginner Free; Pro commonly ~$6.25/user/mo annual (monthly higher); Business ~$10/user/mo (+ local tax) for team workspace. Confirm live todoist.com/pricing — displayed amounts can be locale/JS gated.",
    "pricingSummary": "Free Beginner; Pro ~$6.25, Business ~$10 per user/mo annual. Confirm live.",
    "plans": [
      {
        "kind": "free",
        "slug": "beginner",
        "name": "Beginner",
        "description": "Free — limited personal projects and filters."
      },
      {
        "kind": "per-seat-annual",
        "slug": "pro",
        "amount": 6.25,
        "name": "Pro",
        "highlighted": true,
        "description": "~$6.25/user/mo annual (medium) — more projects, reminders, board/calendar views."
      },
      {
        "kind": "per-seat-annual",
        "slug": "business",
        "amount": 10,
        "name": "Business",
        "description": "~$10/user/mo annual (+ tax) — team workspace, roles, shared projects."
      }
    ],
    "featureOverrides": {
      "task-boards": "limited",
      "timeline-gantt": "not-supported",
      "workload-resources": "not-supported",
      "automations-workflows": "limited",
      "time-tracking": "not-supported",
      "docs-collaboration": "limited",
      "integrations-ecosystem": "supported",
      "reporting-dashboards": "limited",
      "ai-assistance": "limited",
      "document-pdf": "not-supported",
      "remote-access": "not-supported",
      "desktop-workspace": "not-supported"
    },
    "aiLines": [
      "AI assistant: limited",
      "AI summaries: limited",
      "AI automation: limited",
      "AI recommendations: limited"
    ],
    "integrations": [
      {
        "integrationSlug": "slack",
        "kind": "native"
      },
      {
        "integrationSlug": "google-calendar",
        "kind": "native"
      },
      {
        "integrationSlug": "microsoft-teams",
        "kind": "native"
      },
      {
        "integrationSlug": "zapier",
        "kind": "zapier-style"
      }
    ],
    "scores": {
      "ease-of-use": 10,
      "work-planning": 5,
      "automation-workflows": 5,
      "collaboration": 6,
      "integrations": 8,
      "reporting": 4,
      "scalability": 5,
      "value-for-money": 9,
      "ai-capabilities": 5
    },
    "bestFor": [
      "Personal productivity and to-do capture",
      "Light team task lists on Business",
      "Buyers who want natural-language tasks"
    ],
    "notIdealFor": [
      "Work OS / portfolio buyers",
      "Agency proofing",
      "Engineering sprints",
      "Spreadsheet PMO"
    ],
    "pros": [
      "Excellent ease of use",
      "Strong Free entry",
      "Competitive Pro floor",
      "Broad integrations",
      "Natural-language capture"
    ],
    "cons": [
      "Not a Work OS",
      "Thin reporting",
      "Limited team depth vs Asana",
      "No real Gantt/portfolio",
      "AI assist is secondary"
    ],
    "keyFeatures": [
      "Natural-language tasks",
      "Projects & labels",
      "Board/calendar views",
      "Filters & reminders",
      "Business team workspace",
      "Integrations"
    ],
    "whoShouldChoose": "Choose Todoist when personal or light team task management is the job — landscape beside Work OS peers.",
    "whoShouldConsiderAlternatives": "Compare Asana/ClickUp for team Work OS, Trello for Kanban boards, and Motion for AI calendar auto-scheduling.",
    "alternativeSlugs": [
      "asana",
      "trello",
      "motion"
    ],
    "competitorSlugs": [
      "asana",
      "trello",
      "clickup",
      "microsoft-to-do",
      "things"
    ],
    "comparableSlugs": [
      "trello",
      "basecamp"
    ],
    "useCaseSlugs": [
      "project-tracking"
    ],
    "businessSizeSlugs": [
      "micro",
      "small-business",
      "mid-market"
    ],
    "teamTypeSlugs": [
      "founders",
      "operations"
    ],
    "limitations": [
      "Not a Work OS or portfolio tool",
      "Team features mainly on Business",
      "Reporting is personal productivity, not PMO",
      "No native Gantt/resource management"
    ],
    "scoreRationales": {
      "ease-of-use": "Best-in-class personal task capture UX — near-instant for individuals.",
      "work-planning": "Projects/labels/filters — not portfolio/Gantt Work OS planning — 5 by design.",
      "automation-workflows": "Light assists and recurring rules; far thinner than ClickUp/Asana.",
      "collaboration": "Business team workspace helps; still weaker than Work OS collaboration suites.",
      "integrations": "90+ integrations narrative is strong for a task app.",
      "reporting": "Productivity visuals only — not manager dashboards.",
      "scalability": "Fine for individuals/small teams; not enterprise PMO scale.",
      "value-for-money": "Free + ~$6.25 Pro is excellent for the task-manager job. Affiliate economics excluded.",
      "ai-capabilities": "Todoist Assist features exist but are not Motion-class AI scheduling."
    }
  },
  {
    "slug": "microsoft-project",
    "name": "Microsoft Project",
    "company": "Microsoft Corporation",
    "website": "https://www.microsoft.com/microsoft-365/project/project-management-software",
    "domain": "microsoft.com",
    "pricingUrl": "https://www.microsoft.com/microsoft-365/project/compare-microsoft-project-management-software",
    "aliases": [
      "Microsoft Planner and Project",
      "Project Plan 3",
      "Project Plan 5",
      "Planner Plan 1"
    ],
    "membershipRole": "primary",
    "jobCluster": "spreadsheet-pmo",
    "softShortDescription": "Microsoft 365 project / Planner ladder for Gantt, resources and portfolios — Planner Plan 1 from ~$10/user/mo.",
    "shortDescription": "Microsoft Project (with Planner) is the Microsoft 365 project-management ladder for task boards, Gantt schedules, resource management and portfolio views. Common published floors: Planner Plan 1 ~$10/user/mo; Planner and Project Plan 3 ~$30; Plan 5 ~$55 (availability for new customers can change). Best for organisations already standardised on Microsoft 365 — landscape as traditional/enterprise PMO rather than a modern Work OS peer.",
    "vendorPositioning": "Plan, track and collaborate on projects with Microsoft Planner and Project — built for Microsoft 365.",
    "pricingModel": "subscription",
    "hasFreePlan": false,
    "hasFreeTrial": true,
    "startingPriceMonthly": 10,
    "startingPriceConfidence": "medium",
    "pricingNotes": "Cross-checked 2026-08-17: Planner Plan 1 ~$10/user/mo; Planner and Project Plan 3 ~$30; Plan 5 ~$55 (medium — M365 SKU naming and new-customer availability shift). Confirm live Microsoft 365 Project compare page. Requires Microsoft 365 context for best value.",
    "pricingSummary": "Planner Plan 1 ~$10; Plan 3 ~$30; Plan 5 ~$55 per user/mo (medium). Confirm live M365 SKUs.",
    "plans": [
      {
        "kind": "per-seat-monthly",
        "slug": "planner-plan-1",
        "amount": 10,
        "name": "Planner Plan 1",
        "highlighted": true,
        "description": "~$10/user/mo — task boards and basic planning in Microsoft 365."
      },
      {
        "kind": "per-seat-monthly",
        "slug": "plan-3",
        "amount": 30,
        "name": "Planner and Project Plan 3",
        "description": "~$30/user/mo — Project desktop/web scheduling, resources, richer Gantt."
      },
      {
        "kind": "per-seat-monthly",
        "slug": "plan-5",
        "amount": 55,
        "name": "Planner and Project Plan 5",
        "description": "~$55/user/mo — portfolio/demand management depth (confirm new-customer availability)."
      }
    ],
    "featureOverrides": {
      "task-boards": "supported",
      "timeline-gantt": "supported",
      "workload-resources": "higher-plan-only",
      "automations-workflows": "limited",
      "time-tracking": "limited",
      "docs-collaboration": "limited",
      "integrations-ecosystem": "supported",
      "reporting-dashboards": "supported",
      "ai-assistance": "add-on",
      "document-pdf": "not-supported",
      "remote-access": "not-supported",
      "desktop-workspace": "not-supported"
    },
    "aiLines": [
      "AI assistant: add-on",
      "AI summaries: add-on",
      "AI automation: limited",
      "AI recommendations: add-on"
    ],
    "integrations": [
      {
        "integrationSlug": "microsoft-teams",
        "kind": "native"
      },
      {
        "integrationSlug": "microsoft-365",
        "kind": "native"
      },
      {
        "integrationSlug": "power-automate",
        "kind": "native"
      },
      {
        "integrationSlug": "azure-devops",
        "kind": "native"
      }
    ],
    "scores": {
      "ease-of-use": 6,
      "work-planning": 9,
      "automation-workflows": 6,
      "collaboration": 7,
      "integrations": 9,
      "reporting": 8,
      "scalability": 9,
      "value-for-money": 6,
      "ai-capabilities": 6
    },
    "bestFor": [
      "Microsoft 365 standardised orgs",
      "Traditional PMO Gantt/resource needs",
      "Enterprise portfolio planning on higher plans"
    ],
    "notIdealFor": [
      "Startups wanting modern Work OS UX",
      "Lowest-cost task apps",
      "Non-Microsoft stacks"
    ],
    "pros": [
      "Strong Gantt/resource planning",
      "Native M365/Teams fit",
      "Enterprise scale path",
      "Planner entry rung",
      "Portfolio depth on Plan 5"
    ],
    "cons": [
      "Premium mid/high tiers",
      "Steeper classic Project learning curve",
      "SKU complexity",
      "Not a modern Work OS peer",
      "Value weak outside M365"
    ],
    "keyFeatures": [
      "Planner boards",
      "Project Gantt & schedules",
      "Resource management",
      "Portfolios (higher plans)",
      "Teams integration",
      "Power Automate"
    ],
    "whoShouldChoose": "Choose Microsoft Project/Planner when Microsoft 365 is the system of work and traditional scheduling/portfolio depth matters — landscape on modern Work OS lists.",
    "whoShouldConsiderAlternatives": "Compare Smartsheet for spreadsheet PMO, monday/Asana for modern Work OS, and Jira for engineering delivery.",
    "alternativeSlugs": [
      "smartsheet",
      "monday",
      "asana"
    ],
    "competitorSlugs": [
      "smartsheet",
      "monday",
      "asana",
      "wrike",
      "primavera"
    ],
    "comparableSlugs": [
      "smartsheet",
      "wrike"
    ],
    "useCaseSlugs": [
      "work-management",
      "project-tracking",
      "resource-planning",
      "timeline-reporting"
    ],
    "businessSizeSlugs": [
      "mid-market",
      "enterprise"
    ],
    "teamTypeSlugs": [
      "project-managers",
      "operations"
    ],
    "limitations": [
      "SKU and licensing complexity across Planner/Project plans",
      "Best value assumes Microsoft 365 standardisation",
      "Classic Project UX steeper than modern Work OS tools",
      "Plan 5 new-customer availability should be confirmed live"
    ],
    "scoreRationales": {
      "ease-of-use": "Familiar inside M365 but classic Project scheduling has a learning curve vs Asana.",
      "work-planning": "Gantt, dependencies and resource scheduling are a traditional PM strength — 9.",
      "automation-workflows": "Power Automate helps; native PM automation thinner than ClickUp/monday.",
      "collaboration": "Teams/M365 collaboration is strong when the org is already there.",
      "integrations": "Deepest Microsoft ecosystem story in this category set — 9.",
      "reporting": "Solid project/portfolio reporting on higher plans.",
      "scalability": "Enterprise PMO scale path via Plan 3/5.",
      "value-for-money": "Plan 3/5 seats are premium vs modern Work OS floors; value depends on M365 standardisation. Affiliate economics excluded.",
      "ai-capabilities": "Copilot-adjacent AI may apply via M365 — not Motion-class product AI."
    }
  }
];

export const PRODUCTS = COMPACT.map(expandPmProduct);

export const COMPARISON_PAIRS = [
  ["basecamp", "todoist"],
  ["basecamp", "microsoft-project"],
  ["todoist", "microsoft-project"],
];
