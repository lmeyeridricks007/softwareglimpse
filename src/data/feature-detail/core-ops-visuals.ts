import type { FeatureDetailProfile } from "@/domain";

type VisualDepth = Pick<
  FeatureDetailProfile,
  "heroVisual" | "needsVisual" | "workflowVisual"
>;

/**
 * Teaching-visual depth for synthesized CRM feature pages (non-pillar).
 * Assets follow `.cursor/rules/softwareglimpse-teaching-visuals.mdc`
 * (hero UI mockup, problems→fixes needs, numbered workflow).
 */
export const coreOpsFeatureVisualsBySlug: Record<string, VisualDepth> = {
  "contact-management": {
    heroVisual: {
      src: "/features/contact-management-hero.png",
      alt: "Educational CRM contact record UI showing ownership, activity timeline, and related company links.",
      caption:
        "Contact management is the shared record of who you talk to — not a private spreadsheet.",
    },
    needsVisual: {
      src: "/features/contact-management-needs.png",
      alt: "Problems-to-fixes diagram for CRM contact management: duplicates, lost ownership, and missing history mapped to shared records.",
      caption:
        "What breaks when contacts live in inboxes and sheets instead of a CRM.",
    },
    workflowVisual: {
      src: "/features/contact-management-workflow.png",
      alt: "Numbered contact-management workflow: capture, assign owner, log activity, keep one record.",
      caption:
        "How teams keep contact records usable week after week.",
    },
  },
  "lead-management": {
    heroVisual: {
      src: "/features/lead-management-hero.png",
      alt: "Educational CRM lead inbox UI with status, owner, and next-step fields annotated.",
      caption:
        "Lead management tracks unqualified demand until it is owned, worked, or closed.",
    },
    needsVisual: {
      src: "/features/lead-management-needs.png",
      alt: "Problems-to-fixes diagram for CRM lead management: leaked inquiries, unclear owners, and stalled follow-up.",
      caption:
        "What fails when leads have no owner, status, or next step.",
    },
    workflowVisual: {
      src: "/features/lead-management-workflow.png",
      alt: "Numbered lead-management workflow: capture, qualify, assign, follow up, convert or close.",
      caption:
        "A practical lead path from first touch to decision.",
    },
  },
  "pipeline-management": {
    heroVisual: {
      src: "/features/pipeline-management-hero.png",
      alt: "Educational CRM pipeline board UI with stages, deal cards, and stuck-stage callouts.",
      caption:
        "Pipeline management makes stage progress visible for weekly coaching.",
    },
    needsVisual: {
      src: "/features/pipeline-management-needs.png",
      alt: "Problems-to-fixes diagram for CRM pipeline management: shadow sheets, vague stages, and unowned deals.",
      caption:
        "What breaks when the real pipeline lives outside the CRM.",
    },
    workflowVisual: {
      src: "/features/pipeline-management-workflow.png",
      alt: "Numbered pipeline-management workflow: define stages, move deals honestly, review weekly, act on stuck work.",
      caption:
        "How teams operate a pipeline as the meeting source of truth.",
    },
  },
  "deal-management": {
    heroVisual: {
      src: "/features/deal-management-hero.png",
      alt: "Educational CRM deal record UI with value, stage, next step, and activity history.",
      caption:
        "Deal management keeps opportunity facts and next actions on one record.",
    },
    needsVisual: {
      src: "/features/deal-management-needs.png",
      alt: "Problems-to-fixes diagram for CRM deal management: missing next steps, stale values, and unclear close plans.",
      caption:
        "What fails when deals are notes without owners or next steps.",
    },
    workflowVisual: {
      src: "/features/deal-management-workflow.png",
      alt: "Numbered deal-management workflow: create, qualify, advance with evidence, forecast, close.",
      caption:
        "How opportunity records stay trustworthy through close.",
    },
  },
  integrations: {
    heroVisual: {
      src: "/features/integrations-hero.png",
      alt: "Educational CRM integrations UI showing connected apps, sync direction, and health status.",
      caption:
        "Integrations move critical fields between systems — with visible sync health.",
    },
    needsVisual: {
      src: "/features/integrations-needs.png",
      alt: "Problems-to-fixes diagram for CRM integrations: manual re-entry, silent sync failures, over-permissioned connectors.",
      caption:
        "What breaks when integrations are installed without field maps or monitoring.",
    },
    workflowVisual: {
      src: "/features/integrations-workflow.png",
      alt: "Numbered integrations workflow: inventory systems, confirm connector path, map fields, monitor sync health.",
      caption:
        "How teams connect systems without creating silent data debt.",
    },
  },
  "sales-automation": {
    heroVisual: {
      src: "/features/sales-automation-hero.png",
      alt: "Educational CRM sales automation rule builder showing trigger, action, and pipeline scope.",
      caption:
        "Sales automation turns stable process rules into reliable tasks and updates.",
    },
    needsVisual: {
      src: "/features/sales-automation-needs.png",
      alt: "Problems-to-fixes diagram for CRM sales automation: missed follow-ups, inconsistent handoffs, automation noise.",
      caption:
        "What fails when follow-through depends on memory alone.",
    },
    workflowVisual: {
      src: "/features/sales-automation-workflow.png",
      alt: "Numbered sales-automation workflow: stabilize process, define trigger, define action, scope and monitor.",
      caption:
        "How teams automate sales work without flooding the inbox.",
    },
  },
  "email-tracking": {
    heroVisual: {
      src: "/features/email-tracking-hero.png",
      alt: "Educational CRM email tracking timeline showing opens and clicks with a caution that tracking is a signal not intent.",
      caption:
        "Email tracking surfaces engagement signals — not proof of buying intent.",
    },
    needsVisual: {
      src: "/features/email-tracking-needs.png",
      alt: "Problems-to-fixes diagram for CRM email tracking: vanity open rates, privacy blind spots, false intent.",
      caption:
        "What goes wrong when open rates drive follow-up decisions.",
    },
    workflowVisual: {
      src: "/features/email-tracking-workflow.png",
      alt: "Numbered email-tracking workflow: confirm policy fit, enable where allowed, read signals with context, prioritize replies.",
      caption:
        "How teams use tracking without mistaking opens for intent.",
    },
  },
  analytics: {
    heroVisual: {
      src: "/features/analytics-hero.png",
      alt: "Educational CRM analytics dashboard with funnel conversion, win-rate trend, and activity quality charts.",
      caption:
        "CRM analytics should answer decisions — not decorate a vanity dashboard.",
    },
    needsVisual: {
      src: "/features/analytics-needs.png",
      alt: "Problems-to-fixes diagram for CRM analytics: vanity dashboards, delayed data, unclear ownership.",
      caption:
        "What fails when reports have no owner or freshness.",
    },
    workflowVisual: {
      src: "/features/analytics-workflow.png",
      alt: "Numbered analytics workflow: define decisions, choose metrics, validate freshness, review with owners weekly.",
      caption:
        "How teams make CRM reports usable in weekly reviews.",
    },
  },
};
