import type {
  SupportRelationType,
  SupportingTopicType,
  UserJourneyStage,
} from "@/domain";

export const CRM_PRODUCT_GUIDE_KINDS = [
  "implementation",
  "migration",
  "setup",
  "plans",
  "worth-it",
] as const;

export type CrmProductGuideKind = (typeof CRM_PRODUCT_GUIDE_KINDS)[number];

export type CrmProductGuideKindConfig = {
  kind: CrmProductGuideKind;
  topicType: SupportingTopicType;
  journeyStage: UserJourneyStage;
  knowledgeAreaSlug: string;
  relationType: SupportRelationType;
  /** Asset / slug fragment for non-worth-it kinds. */
  pathKind: string;
  seoTitle: (name: string) => string;
  pageTitle: (name: string) => string;
  summary: (name: string) => string;
  heroAlt: (name: string) => string;
  figureAlt: (name: string) => string;
  figureCaption: (name: string) => string;
  checklist: Array<{ id: string; label: string; description: string }>;
  nextActionLabel: (name: string) => string;
  ctaVariant: "finder" | "calculator" | "generic";
};

function clipSeo(title: string): string {
  return title.length <= 70 ? title : `${title.slice(0, 67).trimEnd()}…`;
}

export function productGuideSlug(
  productSlug: string,
  kind: CrmProductGuideKind,
): string {
  if (kind === "worth-it") return `is-${productSlug}-worth-it`;
  return `${productSlug}-${kind}`;
}

/** True when this page is one of the five factory pack kinds for a single product. */
export function factoryProductGuideKind(guide: {
  slug: string;
  productSlugs: readonly string[];
}): CrmProductGuideKind | null {
  if (guide.productSlugs.length !== 1) return null;
  const productSlug = guide.productSlugs[0]!;
  for (const kind of CRM_PRODUCT_GUIDE_KINDS) {
    if (productGuideSlug(productSlug, kind) === guide.slug) return kind;
  }
  return null;
}

import { existsSync } from "node:fs";
import path from "node:path";

function publicGuideAsset(webPath: string): string {
  return path.join(process.cwd(), "public", webPath.replace(/^\//, ""));
}

/**
 * Prefer GenerateImage `-v4` teaching visuals (softwareglimpse-teaching-visuals.mdc).
 * Never fall back to SVG `-v3` placeholders — those cards fail the ~1 MB size bar
 * and are often the wrong category chrome.
 */
function preferGuideVisual(baseSlug: string, suffix: string): string {
  const v4 = `/guides/${baseSlug}-${suffix}-v4.png`;
  if (existsSync(publicGuideAsset(v4))) return v4;
  const coverV4 = `/guides/${baseSlug}-cover-v4.png`;
  if (existsSync(publicGuideAsset(coverV4))) return coverV4;
  // Vercel builds do not include public/guides (served from Blob). Prefer cover —
  // it was generated more completely than diagrams; missing diagram URLs 404.
  if (process.env.VERCEL === "1" || process.env.BLOB_MEDIA_REWRITES === "1") {
    return coverV4;
  }
  return v4;
}

export function productGuideHeroSrc(
  productSlug: string,
  kind: CrmProductGuideKind,
): string {
  return preferGuideVisual(productGuideSlug(productSlug, kind), "cover");
}

export function productGuideFigureSrc(
  productSlug: string,
  kind: CrmProductGuideKind,
): string {
  return preferGuideVisual(productGuideSlug(productSlug, kind), "diagram");
}

/** Teaching panel PNGs (1–4) used on step figures — unique per product × kind. */
export function productGuidePanelSrc(
  productSlug: string,
  kind: CrmProductGuideKind,
  panel: 1 | 2 | 3 | 4,
): string {
  const base = productGuideSlug(productSlug, kind);
  const step = `/guides/${base}-step-v4-${panel}.png`;
  if (existsSync(publicGuideAsset(step))) return step;
  const diagram = `/guides/${base}-diagram-v4.png`;
  if (existsSync(publicGuideAsset(diagram))) return diagram;
  const cover = `/guides/${base}-cover-v4.png`;
  if (existsSync(publicGuideAsset(cover))) return cover;
  // Blob-hosted deploys: cover is the safest public URL when steps/diagrams absent.
  if (process.env.VERCEL === "1" || process.env.BLOB_MEDIA_REWRITES === "1") {
    return cover;
  }
  return diagram;
}

export const CRM_PRODUCT_GUIDE_KIND_CONFIG: Record<
  CrmProductGuideKind,
  CrmProductGuideKindConfig
> = {
  implementation: {
    kind: "implementation",
    topicType: "implementation",
    journeyStage: "implement",
    knowledgeAreaSlug: "implementation",
    relationType: "implementation-for",
    pathKind: "implementation",
    seoTitle: (name) => clipSeo(`${name} Implementation Guide | SoftwareGlimpse`),
    pageTitle: (name) => `${name} Implementation: 30/60/90 Rollout That Sticks`,
    summary: (name) =>
      `Plan a practical ${name} rollout — owners, stages, adoption checkpoints, and what to defer so the CRM becomes the system of record.`,
    heroAlt: (name) =>
      `${name} implementation hero: 30/60/90 rollout phases with admin owner and adoption gates.`,
    figureAlt: (name) =>
      `${name} implementation walkthrough: freeze outcomes, configure core loop, train sellers, review adoption.`,
    figureCaption: (name) =>
      `Treat ${name} implementation as gated phases — not a feature dump in week one.`,
    checklist: [
      {
        id: "outcomes",
        label: "Freeze 90-day outcomes",
        description: "Must-haves and owners before configuration sprawl.",
      },
      {
        id: "admin",
        label: "Name an admin owner",
        description: "Fields, users, and hygiene need a responsible party.",
      },
      {
        id: "adoption",
        label: "Schedule adoption review",
        description: "Check core-loop usage before adding automations.",
      },
    ],
    nextActionLabel: (name) => `Read the ${name} review`,
    ctaVariant: "finder",
  },
  migration: {
    kind: "migration",
    topicType: "migration",
    journeyStage: "implement",
    knowledgeAreaSlug: "implementation",
    relationType: "migration-for",
    pathKind: "migration",
    seoTitle: (name) => clipSeo(`${name} Migration Guide | SoftwareGlimpse`),
    pageTitle: (name) => `${name} Migration: Move Data Without Losing the Thread`,
    summary: (name) =>
      `Migrate into ${name} with a field map, pilot import, dual-run week, and validation — so history survives and sellers trust the new CRM.`,
    heroAlt: (name) =>
      `${name} migration hero: export → map → pilot → validate path into the CRM.`,
    figureAlt: (name) =>
      `${name} migration map: objects, field mapping, pilot import, dual-run, cutover.`,
    figureCaption: (name) =>
      `Prove a small ${name} import before you move the whole book of business.`,
    checklist: [
      {
        id: "inventory",
        label: "Inventory source objects",
        description: "Contacts, companies, deals, activities, files.",
      },
      {
        id: "pilot",
        label: "Run a pilot import",
        description: "One segment first; fix mapping before bulk.",
      },
      {
        id: "validate",
        label: "Validate with sellers",
        description: "Spot-check records they care about before cutover.",
      },
    ],
    nextActionLabel: (name) => `Open ${name} setup guide`,
    ctaVariant: "generic",
  },
  setup: {
    kind: "setup",
    topicType: "setup",
    journeyStage: "implement",
    knowledgeAreaSlug: "implementation",
    relationType: "implementation-for",
    pathKind: "setup",
    seoTitle: (name) => clipSeo(`${name} Setup Guide | SoftwareGlimpse`),
    pageTitle: (name) => `${name} Setup: Day-Zero Path to a Working Pipeline`,
    summary: (name) =>
      `Set up ${name} for day-zero selling — pipeline, users, email sync, and the first logged activity — before optional marketplace apps.`,
    heroAlt: (name) =>
      `${name} setup hero: account → pipeline → users → email → first deal checklist.`,
    figureAlt: (name) =>
      `${name} setup walkthrough: configure stages, invite sellers, sync email, log first win path.`,
    figureCaption: (name) =>
      `A working ${name} core loop beats a decorated empty workspace.`,
    checklist: [
      {
        id: "pipeline",
        label: "Configure one pipeline",
        description: "Stages match how you sell in the next 90 days.",
      },
      {
        id: "users",
        label: "Invite daily users",
        description: "Roles and permissions before data entry.",
      },
      {
        id: "core-loop",
        label: "Complete one core loop",
        description: "Create deal, log activity, update stage as a non-admin.",
      },
    ],
    nextActionLabel: (name) => `Continue ${name} implementation`,
    ctaVariant: "generic",
  },
  plans: {
    kind: "plans",
    topicType: "pricing-education",
    journeyStage: "choose",
    knowledgeAreaSlug: "pricing",
    relationType: "explains-pricing",
    pathKind: "plans",
    seoTitle: (name) => clipSeo(`${name} Plans: Free vs Paid | SoftwareGlimpse`),
    pageTitle: (name) => `${name} Plans: Free vs Paid and Qualifying Tiers`,
    summary: (name) =>
      `Choose your ${name} plan by mapping must-haves to qualifying tiers — not homepage “from” tiles — then estimate with the Cost Calculator.`,
    heroAlt: (name) =>
      `${name} plans hero: must-haves mapping to qualifying plan tiers — no invented totals.`,
    figureAlt: (name) =>
      `${name} plan anatomy: seats, tier gates, add-ons, billing term into a qualifying plan.`,
    figureCaption: (name) =>
      `Read ${name} pricing from must-have gates upward; confirm numbers on the pricing page or Cost Calculator.`,
    checklist: [
      {
        id: "musts",
        label: "List day-one must-haves",
        description: "Features that must ship without an unused enterprise tier.",
      },
      {
        id: "qualify",
        label: "Map to a qualifying plan",
        description: "Use researched plan names — not marketing starting tiles.",
      },
      {
        id: "estimate",
        label: "Estimate with Calculator",
        description: "Banded seats from researched list prices.",
      },
    ],
    nextActionLabel: () => "Open Cost Calculator",
    ctaVariant: "calculator",
  },
  "worth-it": {
    kind: "worth-it",
    topicType: "selection",
    journeyStage: "evaluate",
    knowledgeAreaSlug: "selection",
    relationType: "answers-question-for",
    pathKind: "worth-it",
    seoTitle: (name) => clipSeo(`Is ${name} Worth It? | SoftwareGlimpse`),
    pageTitle: (name) => `Is ${name} Worth It? Fit Scenarios Before You Buy`,
    summary: (name) =>
      `Decide if ${name} is worth it for your team — fit scenarios, tradeoffs, and when to keep looking — without invented ROI percentages.`,
    heroAlt: (name) =>
      `${name} worth-it hero: fit vs not-fit decision gates leading to buy, trial, or keep looking.`,
    figureAlt: (name) =>
      `${name} worth-it framework: best-for, not-ideal, evidence from trial, commercial clarity.`,
    figureCaption: (name) =>
      `${name} is “worth it” when outcomes, usability, and qualifying cost align — not when a demo feels exciting.`,
    checklist: [
      {
        id: "fit",
        label: "Match best-for scenarios",
        description: "Your motion should resemble who the product serves well.",
      },
      {
        id: "trial",
        label: "Prove the core loop",
        description: "Non-admin trial evidence beats marketing claims.",
      },
      {
        id: "plan",
        label: "Confirm qualifying plan",
        description: "Must-haves on a real tier before you call it a bargain.",
      },
    ],
    nextActionLabel: () => "Open the CRM Software Finder",
    ctaVariant: "finder",
  },
};

/** Same five kinds as CRM, with sales-intelligence / outbound language. */
export const SI_PRODUCT_GUIDE_KIND_CONFIG: Record<
  CrmProductGuideKind,
  CrmProductGuideKindConfig
> = {
  implementation: {
    kind: "implementation",
    topicType: "implementation",
    journeyStage: "implement",
    knowledgeAreaSlug: "implementation",
    relationType: "implementation-for",
    pathKind: "implementation",
    seoTitle: (name) =>
      clipSeo(`${name} Implementation Guide | SoftwareGlimpse`),
    pageTitle: (name) =>
      `${name} Implementation: 30/60/90 Outbound Rollout That Sticks`,
    summary: (name) =>
      `Plan a practical ${name} rollout — owners, credits/seats, list quality, sequences or dialer, and CRM sync — so outbound becomes a repeatable motion.`,
    heroAlt: (name) =>
      `${name} implementation hero: 30/60/90 outbound phases with ops owner and adoption gates.`,
    figureAlt: (name) =>
      `${name} implementation walkthrough: freeze outcomes, configure lists, train the pod, review usage.`,
    figureCaption: (name) =>
      `Treat ${name} implementation as gated phases — not a credit burn in week one.`,
    checklist: [
      {
        id: "outcomes",
        label: "Freeze 90-day outbound outcomes",
        description: "Meetings, reply rates, or coverage goals before sprawl.",
      },
      {
        id: "admin",
        label: "Name a stack owner",
        description: "Credits, seats, lists, and sync need a responsible party.",
      },
      {
        id: "adoption",
        label: "Schedule usage review",
        description: "Check list → outreach → CRM logging before adding channels.",
      },
    ],
    nextActionLabel: (name) => `Read the ${name} review`,
    ctaVariant: "finder",
  },
  migration: {
    kind: "migration",
    topicType: "migration",
    journeyStage: "implement",
    knowledgeAreaSlug: "implementation",
    relationType: "migration-for",
    pathKind: "migration",
    seoTitle: (name) => clipSeo(`${name} Migration Guide | SoftwareGlimpse`),
    pageTitle: (name) =>
      `${name} Migration: Move Lists Without Losing Trust`,
    summary: (name) =>
      `Migrate into ${name} with a list inventory, field map, pilot export/import, dual-run week, and CRM sync validation — so sequences keep firing and sellers trust the data.`,
    heroAlt: (name) =>
      `${name} migration hero: export → map → pilot → validate path into sales intelligence.`,
    figureAlt: (name) =>
      `${name} migration map: lists, enrichment fields, pilot import, dual-run, cutover.`,
    figureCaption: (name) =>
      `Prove a small ${name} list and sequence before you move the whole book.`,
    checklist: [
      {
        id: "inventory",
        label: "Inventory source lists",
        description: "Contacts, accounts, sequences, dialer books, suppressions.",
      },
      {
        id: "pilot",
        label: "Run a pilot import",
        description: "One segment first; fix mapping and credits before bulk.",
      },
      {
        id: "validate",
        label: "Validate with the pod",
        description: "Spot-check contacts and CRM sync before cutover.",
      },
    ],
    nextActionLabel: (name) => `Open ${name} setup guide`,
    ctaVariant: "generic",
  },
  setup: {
    kind: "setup",
    topicType: "setup",
    journeyStage: "implement",
    knowledgeAreaSlug: "implementation",
    relationType: "implementation-for",
    pathKind: "setup",
    seoTitle: (name) => clipSeo(`${name} Setup Guide | SoftwareGlimpse`),
    pageTitle: (name) =>
      `${name} Setup: Day-Zero Path to a Working Outbound Loop`,
    summary: (name) =>
      `Set up ${name} for day-zero outbound — seats/credits, one ICP list, sequences or dialer, and CRM sync — before optional enrichment packs.`,
    heroAlt: (name) =>
      `${name} setup hero: account → seats → list → sequence/dialer → CRM sync checklist.`,
    figureAlt: (name) =>
      `${name} setup walkthrough: configure credits, invite the pod, build a list, prove one outreach loop.`,
    figureCaption: (name) =>
      `A working ${name} outbound loop beats a decorated empty workspace.`,
    checklist: [
      {
        id: "access",
        label: "Configure seats and credits",
        description: "Match who dials/emails this week — not the whole org chart.",
      },
      {
        id: "list",
        label: "Build one ICP list",
        description: "Filters match how you prospect in the next 90 days.",
      },
      {
        id: "core-loop",
        label: "Complete one outbound loop",
        description: "Find contact, enrich, outreach, log to CRM as a non-admin.",
      },
    ],
    nextActionLabel: (name) => `Continue ${name} implementation`,
    ctaVariant: "generic",
  },
  plans: {
    kind: "plans",
    topicType: "pricing-education",
    journeyStage: "choose",
    knowledgeAreaSlug: "pricing",
    relationType: "explains-pricing",
    pathKind: "plans",
    seoTitle: (name) =>
      clipSeo(`${name} Plans: Seats vs Credits | SoftwareGlimpse`),
    pageTitle: (name) =>
      `${name} Plans: Seats, Credits, and Qualifying Tiers`,
    summary: (name) =>
      `Choose your ${name} plan by mapping must-haves to seats, credits, and qualifying tiers — not homepage “from” tiles — then confirm on the pricing page.`,
    heroAlt: (name) =>
      `${name} plans hero: must-haves mapping to seats/credits tiers — no invented totals.`,
    figureAlt: (name) =>
      `${name} plan anatomy: seats, credits, list limits, add-ons into a qualifying plan.`,
    figureCaption: (name) =>
      `Read ${name} pricing from must-have gates and usage — confirm numbers on the pricing page.`,
    checklist: [
      {
        id: "musts",
        label: "List day-one must-haves",
        description: "Data, sequences/dialer, CRM sync that must ship without unused enterprise.",
      },
      {
        id: "qualify",
        label: "Map seats and credits",
        description: "Use researched plan names — not marketing starting tiles.",
      },
      {
        id: "confirm",
        label: "Confirm on pricing page",
        description: "List price, credit packs, and quote terms live there — not in this guide.",
      },
    ],
    nextActionLabel: (name) => `Open ${name} pricing`,
    ctaVariant: "calculator",
  },
  "worth-it": {
    kind: "worth-it",
    topicType: "selection",
    journeyStage: "evaluate",
    knowledgeAreaSlug: "selection",
    relationType: "answers-question-for",
    pathKind: "worth-it",
    seoTitle: (name) => clipSeo(`Is ${name} Worth It? | SoftwareGlimpse`),
    pageTitle: (name) =>
      `Is ${name} Worth It? Fit Scenarios Before You Buy`,
    summary: (name) =>
      `Decide if ${name} is worth it for your outbound pod — fit scenarios, credit economics, and when to keep looking — without invented ROI percentages.`,
    heroAlt: (name) =>
      `${name} worth-it hero: fit vs not-fit decision gates leading to buy, trial, or keep looking.`,
    figureAlt: (name) =>
      `${name} worth-it framework: best-for, not-ideal, trial proof, commercial clarity.`,
    figureCaption: (name) =>
      `${name} is “worth it” when data quality, outbound loop, and qualifying cost align — not when a demo feels exciting.`,
    checklist: [
      {
        id: "fit",
        label: "Match best-for scenarios",
        description: "Your motion should resemble who the product serves well.",
      },
      {
        id: "trial",
        label: "Prove the outbound loop",
        description: "Non-admin list → outreach → CRM evidence beats marketing claims.",
      },
      {
        id: "plan",
        label: "Confirm seats and credits",
        description: "Must-haves on a real tier before you call it a bargain.",
      },
    ],
    nextActionLabel: () => "Open the Sales Intelligence Finder",
    ctaVariant: "finder",
  },
};

/** Same five kinds as CRM, with email-marketing / ESP language. */
export const EM_PRODUCT_GUIDE_KIND_CONFIG: Record<
  CrmProductGuideKind,
  CrmProductGuideKindConfig
> = {
  implementation: {
    kind: "implementation",
    topicType: "implementation",
    journeyStage: "implement",
    knowledgeAreaSlug: "implementation",
    relationType: "implementation-for",
    pathKind: "implementation",
    seoTitle: (name) =>
      clipSeo(`${name} Implementation Guide | SoftwareGlimpse`),
    pageTitle: (name) =>
      `${name} Implementation: 30/60/90 Email Rollout That Sticks`,
    summary: (name) =>
      `Plan a practical ${name} rollout — campaign owner, list hygiene, domain auth, first campaigns and automations — so email becomes a repeatable motion.`,
    heroAlt: (name) =>
      `${name} implementation hero: 30/60/90 email phases with campaign owner and adoption gates.`,
    figureAlt: (name) =>
      `${name} implementation walkthrough: freeze outcomes, configure lists, train marketers, review engagement.`,
    figureCaption: (name) =>
      `Treat ${name} implementation as gated phases — not a feature dump in week one.`,
    checklist: [
      {
        id: "outcomes",
        label: "Freeze 90-day email outcomes",
        description: "Engagement, list growth, or automation coverage before sprawl.",
      },
      {
        id: "admin",
        label: "Name a campaign owner",
        description: "Lists, templates, auth, and sync need a responsible party.",
      },
      {
        id: "adoption",
        label: "Schedule usage review",
        description: "Check list → campaign → measure before adding automations.",
      },
    ],
    nextActionLabel: (name) => `Read the ${name} review`,
    ctaVariant: "finder",
  },
  migration: {
    kind: "migration",
    topicType: "migration",
    journeyStage: "implement",
    knowledgeAreaSlug: "implementation",
    relationType: "migration-for",
    pathKind: "migration",
    seoTitle: (name) => clipSeo(`${name} Migration Guide | SoftwareGlimpse`),
    pageTitle: (name) =>
      `${name} Migration: Move Lists Without Losing Trust`,
    summary: (name) =>
      `Migrate into ${name} with a list inventory, field map, pilot import, dual-run week, and suppression validation — so campaigns keep sending and marketers trust the data.`,
    heroAlt: (name) =>
      `${name} migration hero: export → map → pilot → validate path into the ESP.`,
    figureAlt: (name) =>
      `${name} migration map: lists, fields, pilot import, dual-run, cutover.`,
    figureCaption: (name) =>
      `Prove a small ${name} list and campaign before you move the whole book.`,
    checklist: [
      {
        id: "inventory",
        label: "Inventory source lists",
        description: "Contacts, segments, templates, automations, suppressions.",
      },
      {
        id: "pilot",
        label: "Run a pilot import",
        description: "One segment first; fix mapping and consent before bulk.",
      },
      {
        id: "validate",
        label: "Validate with marketers",
        description: "Spot-check records and suppressions before cutover.",
      },
    ],
    nextActionLabel: (name) => `Open ${name} setup guide`,
    ctaVariant: "generic",
  },
  setup: {
    kind: "setup",
    topicType: "setup",
    journeyStage: "implement",
    knowledgeAreaSlug: "implementation",
    relationType: "implementation-for",
    pathKind: "setup",
    seoTitle: (name) => clipSeo(`${name} Setup Guide | SoftwareGlimpse`),
    pageTitle: (name) =>
      `${name} Setup: Day-Zero Path to a Working Email Loop`,
    summary: (name) =>
      `Set up ${name} for day-zero email — contact tier, one segment, domain auth, first campaign, and reporting — before optional marketplace apps.`,
    heroAlt: (name) =>
      `${name} setup hero: account → lists → auth → campaign → measure checklist.`,
    figureAlt: (name) =>
      `${name} setup walkthrough: configure lists, invite marketers, authenticate domain, prove one send loop.`,
    figureCaption: (name) =>
      `A working ${name} email loop beats a decorated empty workspace.`,
    checklist: [
      {
        id: "access",
        label: "Configure contacts and sends",
        description: "Match who campaigns this week — not the whole org chart.",
      },
      {
        id: "list",
        label: "Build one priority segment",
        description: "Filters match how you email in the next 90 days.",
      },
      {
        id: "core-loop",
        label: "Complete one email loop",
        description: "Import, segment, send, measure as a non-admin.",
      },
    ],
    nextActionLabel: (name) => `Continue ${name} implementation`,
    ctaVariant: "generic",
  },
  plans: {
    kind: "plans",
    topicType: "pricing-education",
    journeyStage: "choose",
    knowledgeAreaSlug: "pricing",
    relationType: "explains-pricing",
    pathKind: "plans",
    seoTitle: (name) =>
      clipSeo(`${name} Plans: Contacts vs Features | SoftwareGlimpse`),
    pageTitle: (name) =>
      `${name} Plans: Contacts, Sends, and Qualifying Tiers`,
    summary: (name) =>
      `Choose your ${name} plan by mapping must-haves to contact tiers, send limits, and qualifying features — not homepage “from” tiles — then confirm on the pricing page.`,
    heroAlt: (name) =>
      `${name} plans hero: must-haves mapping to contact/send tiers — no invented totals.`,
    figureAlt: (name) =>
      `${name} plan anatomy: contacts, sends, feature gates, add-ons into a qualifying plan.`,
    figureCaption: (name) =>
      `Read ${name} pricing from must-have gates and list size — confirm numbers on the pricing page.`,
    checklist: [
      {
        id: "musts",
        label: "List day-one must-haves",
        description: "Campaigns, automations, LPs that must ship without unused enterprise.",
      },
      {
        id: "qualify",
        label: "Map contacts and sends",
        description: "Use researched plan names — not marketing starting tiles.",
      },
      {
        id: "confirm",
        label: "Confirm on pricing page",
        description: "List price, contact bands, and quote terms live there — not in this guide.",
      },
    ],
    nextActionLabel: (name) => `Open ${name} pricing`,
    ctaVariant: "calculator",
  },
  "worth-it": {
    kind: "worth-it",
    topicType: "selection",
    journeyStage: "evaluate",
    knowledgeAreaSlug: "selection",
    relationType: "answers-question-for",
    pathKind: "worth-it",
    seoTitle: (name) => clipSeo(`Is ${name} Worth It? | SoftwareGlimpse`),
    pageTitle: (name) =>
      `Is ${name} Worth It? Fit Scenarios Before You Buy`,
    summary: (name) =>
      `Decide if ${name} is worth it for your marketing team — fit scenarios, contact economics, and when to keep looking — without invented ROI percentages.`,
    heroAlt: (name) =>
      `${name} worth-it hero: fit vs not-fit decision gates leading to buy, trial, or keep looking.`,
    figureAlt: (name) =>
      `${name} worth-it framework: best-for, not-ideal, trial proof, commercial clarity.`,
    figureCaption: (name) =>
      `${name} is “worth it” when list quality, email loop, and qualifying cost align — not when a demo feels exciting.`,
    checklist: [
      {
        id: "fit",
        label: "Match best-for scenarios",
        description: "Your motion should resemble who the product serves well.",
      },
      {
        id: "trial",
        label: "Prove the email loop",
        description: "Non-admin list → campaign → measure evidence beats marketing claims.",
      },
      {
        id: "plan",
        label: "Confirm contacts and sends",
        description: "Must-haves on a real tier before you call it a bargain.",
      },
    ],
    nextActionLabel: (name) => `Read the ${name} review`,
    ctaVariant: "finder",
  },
};

/** Same five kinds as CRM, with marketing & growth / campaign language. */
export const MARKETING_PRODUCT_GUIDE_KIND_CONFIG: Record<
  CrmProductGuideKind,
  CrmProductGuideKindConfig
> = {
  implementation: {
    kind: "implementation",
    topicType: "implementation",
    journeyStage: "implement",
    knowledgeAreaSlug: "implementation",
    relationType: "implementation-for",
    pathKind: "implementation",
    seoTitle: (name) =>
      clipSeo(`${name} Implementation Guide | SoftwareGlimpse`),
    pageTitle: (name) =>
      `${name} Implementation: 30/60/90 Marketing Rollout That Sticks`,
    summary: (name) =>
      `Plan a practical ${name} rollout — campaign owner, funnel/landing pages, automation, and CRM sync — so marketing becomes a repeatable motion.`,
    heroAlt: (name) =>
      `${name} implementation hero: 30/60/90 marketing phases with campaign owner and adoption gates.`,
    figureAlt: (name) =>
      `${name} implementation walkthrough: freeze outcomes, configure campaigns, train marketers, review results.`,
    figureCaption: (name) =>
      `Treat ${name} implementation as gated phases — not a feature dump in week one.`,
    checklist: [
      {
        id: "outcomes",
        label: "Freeze 90-day marketing outcomes",
        description: "Leads, pipeline influence, or launch coverage before sprawl.",
      },
      {
        id: "admin",
        label: "Name a campaign owner",
        description: "Funnels, automations, and sync need a responsible party.",
      },
      {
        id: "adoption",
        label: "Schedule usage review",
        description: "Check campaign → measure → CRM logging before adding channels.",
      },
    ],
    nextActionLabel: (name) => `Read the ${name} review`,
    ctaVariant: "finder",
  },
  migration: {
    kind: "migration",
    topicType: "migration",
    journeyStage: "implement",
    knowledgeAreaSlug: "implementation",
    relationType: "migration-for",
    pathKind: "migration",
    seoTitle: (name) => clipSeo(`${name} Migration Guide | SoftwareGlimpse`),
    pageTitle: (name) =>
      `${name} Migration: Move Campaigns Without Losing Trust`,
    summary: (name) =>
      `Migrate into ${name} with an asset inventory, field map, pilot import, dual-run week, and CRM sync validation — so funnels keep converting and marketers trust the data.`,
    heroAlt: (name) =>
      `${name} migration hero: export → map → pilot → validate path into marketing software.`,
    figureAlt: (name) =>
      `${name} migration map: assets, fields, pilot import, dual-run, cutover.`,
    figureCaption: (name) =>
      `Prove a small ${name} campaign or funnel before you move the whole book.`,
    checklist: [
      {
        id: "inventory",
        label: "Inventory source assets",
        description: "Lists, funnels, landing pages, automations, creatives.",
      },
      {
        id: "pilot",
        label: "Run a pilot import",
        description: "One segment or funnel first; fix mapping before bulk.",
      },
      {
        id: "validate",
        label: "Validate with marketers",
        description: "Spot-check records and CRM sync before cutover.",
      },
    ],
    nextActionLabel: (name) => `Open ${name} setup guide`,
    ctaVariant: "generic",
  },
  setup: {
    kind: "setup",
    topicType: "setup",
    journeyStage: "implement",
    knowledgeAreaSlug: "implementation",
    relationType: "implementation-for",
    pathKind: "setup",
    seoTitle: (name) => clipSeo(`${name} Setup Guide | SoftwareGlimpse`),
    pageTitle: (name) =>
      `${name} Setup: Day-Zero Path to a Working Marketing Loop`,
    summary: (name) =>
      `Set up ${name} for day-zero marketing — workspace, one campaign path, CRM sync, and measurement — before optional marketplace apps.`,
    heroAlt: (name) =>
      `${name} setup hero: account → campaign path → sync → measure checklist.`,
    figureAlt: (name) =>
      `${name} setup walkthrough: configure workspace, invite marketers, prove one campaign loop.`,
    figureCaption: (name) =>
      `A working ${name} marketing loop beats a decorated empty workspace.`,
    checklist: [
      {
        id: "access",
        label: "Configure seats and workspace",
        description: "Match who campaigns this week — not the whole org chart.",
      },
      {
        id: "campaign",
        label: "Build one priority campaign path",
        description: "Funnel, landing page, or social calendar for the next 90 days.",
      },
      {
        id: "core-loop",
        label: "Complete one marketing loop",
        description: "Launch, capture, measure, and log to CRM as a non-admin.",
      },
    ],
    nextActionLabel: (name) => `Continue ${name} implementation`,
    ctaVariant: "generic",
  },
  plans: {
    kind: "plans",
    topicType: "pricing-education",
    journeyStage: "choose",
    knowledgeAreaSlug: "pricing",
    relationType: "explains-pricing",
    pathKind: "plans",
    seoTitle: (name) =>
      clipSeo(`${name} Plans: Seats vs Features | SoftwareGlimpse`),
    pageTitle: (name) =>
      `${name} Plans: Seats, Channels, and Qualifying Tiers`,
    summary: (name) =>
      `Choose your ${name} plan by mapping must-haves to seats, channels, and qualifying features — not homepage “from” tiles — then confirm on the pricing page.`,
    heroAlt: (name) =>
      `${name} plans hero: must-haves mapping to seat/channel tiers — no invented totals.`,
    figureAlt: (name) =>
      `${name} plan anatomy: seats, channels, feature gates, add-ons into a qualifying plan.`,
    figureCaption: (name) =>
      `Read ${name} pricing from must-have gates — confirm numbers on the pricing page.`,
    checklist: [
      {
        id: "musts",
        label: "List day-one must-haves",
        description: "Funnels, automation, social, or webinars that must ship without unused enterprise.",
      },
      {
        id: "qualify",
        label: "Map seats and channels",
        description: "Use researched plan names — not marketing starting tiles.",
      },
      {
        id: "confirm",
        label: "Confirm on pricing page",
        description: "List price, seat caps, and quote terms live there — not in this guide.",
      },
    ],
    nextActionLabel: (name) => `Open ${name} pricing`,
    ctaVariant: "calculator",
  },
  "worth-it": {
    kind: "worth-it",
    topicType: "selection",
    journeyStage: "evaluate",
    knowledgeAreaSlug: "selection",
    relationType: "answers-question-for",
    pathKind: "worth-it",
    seoTitle: (name) => clipSeo(`Is ${name} Worth It? | SoftwareGlimpse`),
    pageTitle: (name) =>
      `Is ${name} Worth It? Fit Scenarios Before You Buy`,
    summary: (name) =>
      `Decide if ${name} is worth it for your growth team — fit scenarios, packaging, and when to keep looking — without invented ROI percentages.`,
    heroAlt: (name) =>
      `${name} worth-it hero: fit vs not-fit decision gates leading to buy, trial, or keep looking.`,
    figureAlt: (name) =>
      `${name} worth-it framework: best-for, not-ideal, trial proof, commercial clarity.`,
    figureCaption: (name) =>
      `${name} is “worth it” when campaign fit, proof, and qualifying cost align — not when a demo feels exciting.`,
    checklist: [
      {
        id: "fit",
        label: "Match best-for scenarios",
        description: "Your motion should resemble who the product serves well.",
      },
      {
        id: "trial",
        label: "Prove the marketing loop",
        description: "Non-admin launch → capture → measure → CRM evidence beats marketing claims.",
      },
      {
        id: "plan",
        label: "Confirm seats and channels",
        description: "Must-haves on a real tier before you call it a bargain.",
      },
    ],
    nextActionLabel: (name) => `Read the ${name} review`,
    ctaVariant: "finder",
  },
};

/** Same five kinds as CRM, with business-communications / phone-system language. */
export const BC_PRODUCT_GUIDE_KIND_CONFIG: Record<
  CrmProductGuideKind,
  CrmProductGuideKindConfig
> = {
  implementation: {
    kind: "implementation",
    topicType: "implementation",
    journeyStage: "implement",
    knowledgeAreaSlug: "implementation",
    relationType: "implementation-for",
    pathKind: "implementation",
    seoTitle: (name) =>
      clipSeo(`${name} Implementation Guide | SoftwareGlimpse`),
    pageTitle: (name) =>
      `${name} Implementation: 30/60/90 Communications Rollout That Sticks`,
    summary: (name) =>
      `Plan a practical ${name} rollout — phone admin, number provisioning, routing, softphone, and CRM CTI — so communications becomes a repeatable motion.`,
    heroAlt: (name) =>
      `${name} implementation hero: 30/60/90 communications phases with phone admin and adoption gates.`,
    figureAlt: (name) =>
      `${name} implementation walkthrough: freeze outcomes, provision numbers, train agents, review usage.`,
    figureCaption: (name) =>
      `Treat ${name} implementation as gated phases — not a feature dump in week one.`,
    checklist: [
      {
        id: "outcomes",
        label: "Freeze 90-day communications outcomes",
        description: "Answer rates, coverage, or routing quality before sprawl.",
      },
      {
        id: "admin",
        label: "Name a phone/admin owner",
        description: "Numbers, routing, softphone, and CTI need a responsible party.",
      },
      {
        id: "adoption",
        label: "Schedule usage review",
        description: "Check number → softphone → CRM logging before adding channels.",
      },
    ],
    nextActionLabel: (name) => `Read the ${name} review`,
    ctaVariant: "finder",
  },
  migration: {
    kind: "migration",
    topicType: "migration",
    journeyStage: "implement",
    knowledgeAreaSlug: "implementation",
    relationType: "migration-for",
    pathKind: "migration",
    seoTitle: (name) => clipSeo(`${name} Migration Guide | SoftwareGlimpse`),
    pageTitle: (name) =>
      `${name} Migration: Move Numbers Without Losing Trust`,
    summary: (name) =>
      `Migrate into ${name} with a number inventory, route map, pilot cutover, dual-run week, and CRM CTI validation — so calls keep routing and agents trust the logs.`,
    heroAlt: (name) =>
      `${name} migration hero: export → map → pilot → validate path into the phone system.`,
    figureAlt: (name) =>
      `${name} migration map: numbers, routes, pilot cutover, dual-run, go-live.`,
    figureCaption: (name) =>
      `Prove a small ${name} number and route before you move the whole book.`,
    checklist: [
      {
        id: "inventory",
        label: "Inventory source numbers",
        description: "DIDs, queues, IVR, recordings, do-not-call lists.",
      },
      {
        id: "pilot",
        label: "Run a pilot cutover",
        description: "One queue first; fix routing and CTI before bulk.",
      },
      {
        id: "validate",
        label: "Validate with agents",
        description: "Spot-check calls and CRM logging before cutover.",
      },
    ],
    nextActionLabel: (name) => `Open ${name} setup guide`,
    ctaVariant: "generic",
  },
  setup: {
    kind: "setup",
    topicType: "setup",
    journeyStage: "implement",
    knowledgeAreaSlug: "implementation",
    relationType: "implementation-for",
    pathKind: "setup",
    seoTitle: (name) => clipSeo(`${name} Setup Guide | SoftwareGlimpse`),
    pageTitle: (name) =>
      `${name} Setup: Day-Zero Path to a Working Call Loop`,
    summary: (name) =>
      `Set up ${name} for day-zero calling — seats, one number, routing, softphone, and CRM CTI — before optional marketplace apps.`,
    heroAlt: (name) =>
      `${name} setup hero: account → numbers → routing → softphone → CRM log checklist.`,
    figureAlt: (name) =>
      `${name} setup walkthrough: provision numbers, invite agents, configure IVR, prove one call loop.`,
    figureCaption: (name) =>
      `A working ${name} communications loop beats a decorated empty admin console.`,
    checklist: [
      {
        id: "access",
        label: "Configure seats and numbers",
        description: "Match who calls this week — not the whole org chart.",
      },
      {
        id: "queue",
        label: "Build one priority queue",
        description: "Routing matches how you answer in the next 90 days.",
      },
      {
        id: "core-loop",
        label: "Complete one call loop",
        description: "Provision, route, softphone, CRM log as a non-admin.",
      },
    ],
    nextActionLabel: (name) => `Continue ${name} implementation`,
    ctaVariant: "generic",
  },
  plans: {
    kind: "plans",
    topicType: "pricing-education",
    journeyStage: "choose",
    knowledgeAreaSlug: "pricing",
    relationType: "explains-pricing",
    pathKind: "plans",
    seoTitle: (name) =>
      clipSeo(`${name} Plans: Seats vs Numbers | SoftwareGlimpse`),
    pageTitle: (name) =>
      `${name} Plans: Seats, Numbers, and Qualifying Tiers`,
    summary: (name) =>
      `Choose your ${name} plan by mapping must-haves to seats, numbers/minutes, and qualifying features — not homepage “from” tiles — then confirm on the pricing page.`,
    heroAlt: (name) =>
      `${name} plans hero: must-haves mapping to seat/number tiers — no invented totals.`,
    figureAlt: (name) =>
      `${name} plan anatomy: seats, numbers, feature gates, add-ons into a qualifying plan.`,
    figureCaption: (name) =>
      `Read ${name} pricing from must-have gates and seat/number usage — confirm numbers on the pricing page.`,
    checklist: [
      {
        id: "musts",
        label: "List day-one must-haves",
        description: "Softphone, routing, CTI that must ship without unused enterprise.",
      },
      {
        id: "qualify",
        label: "Map seats and numbers",
        description: "Use researched plan names — not marketing starting tiles.",
      },
      {
        id: "confirm",
        label: "Confirm on pricing page",
        description: "List price, seat caps, and quote terms live there — not in this guide.",
      },
    ],
    nextActionLabel: (name) => `Open ${name} pricing`,
    ctaVariant: "calculator",
  },
  "worth-it": {
    kind: "worth-it",
    topicType: "selection",
    journeyStage: "evaluate",
    knowledgeAreaSlug: "selection",
    relationType: "answers-question-for",
    pathKind: "worth-it",
    seoTitle: (name) => clipSeo(`Is ${name} Worth It? | SoftwareGlimpse`),
    pageTitle: (name) =>
      `Is ${name} Worth It? Fit Scenarios Before You Buy`,
    summary: (name) =>
      `Decide if ${name} is worth it for your sales and support team — fit scenarios, seat/number economics, and when to keep looking — without invented ROI percentages.`,
    heroAlt: (name) =>
      `${name} worth-it hero: fit vs not-fit decision gates leading to buy, trial, or keep looking.`,
    figureAlt: (name) =>
      `${name} worth-it framework: best-for, not-ideal, trial proof, commercial clarity.`,
    figureCaption: (name) =>
      `${name} is “worth it” when routing quality, call loop, and qualifying cost align — not when a demo feels exciting.`,
    checklist: [
      {
        id: "fit",
        label: "Match best-for scenarios",
        description: "Your motion should resemble who the product serves well.",
      },
      {
        id: "trial",
        label: "Prove the call loop",
        description: "Non-admin number → softphone → CRM evidence beats marketing claims.",
      },
      {
        id: "plan",
        label: "Confirm seats and numbers",
        description: "Must-haves on a real tier before you call it a bargain.",
      },
    ],
    nextActionLabel: (name) => `Read the ${name} review`,
    ctaVariant: "finder",
  },
};

/** Same five kinds as CRM, with HR / workforce / training language. */
export const HR_PRODUCT_GUIDE_KIND_CONFIG: Record<
  CrmProductGuideKind,
  CrmProductGuideKindConfig
> = {
  implementation: {
    kind: "implementation",
    topicType: "implementation",
    journeyStage: "implement",
    knowledgeAreaSlug: "implementation",
    relationType: "implementation-for",
    pathKind: "implementation",
    seoTitle: (name) =>
      clipSeo(`${name} Implementation Guide | SoftwareGlimpse`),
    pageTitle: (name) =>
      `${name} Implementation: 30/60/90 HR Rollout That Sticks`,
    summary: (name) =>
      `Plan a practical ${name} rollout — owners, core HR loop, training, and adoption checkpoints — so the product becomes how the team actually works.`,
    heroAlt: (name) =>
      `${name} implementation hero: 30/60/90 HR phases with admin owner and adoption gates.`,
    figureAlt: (name) =>
      `${name} implementation walkthrough: freeze outcomes, configure the core loop, train weekly users, review adoption.`,
    figureCaption: (name) =>
      `Treat ${name} implementation as gated phases — not a feature dump in week one.`,
    checklist: [
      {
        id: "outcomes",
        label: "Freeze 90-day outcomes",
        description: "Must-haves and owners before configuration sprawl.",
      },
      {
        id: "admin",
        label: "Name an admin owner",
        description: "Fields, users, and hygiene need a responsible party.",
      },
      {
        id: "adoption",
        label: "Schedule adoption review",
        description: "Check core-loop usage before adding automations.",
      },
    ],
    nextActionLabel: (name) => `Read the ${name} review`,
    ctaVariant: "finder",
  },
  migration: {
    kind: "migration",
    topicType: "migration",
    journeyStage: "implement",
    knowledgeAreaSlug: "implementation",
    relationType: "migration-for",
    pathKind: "migration",
    seoTitle: (name) => clipSeo(`${name} Migration Guide | SoftwareGlimpse`),
    pageTitle: (name) =>
      `${name} Migration: Move People Data Without Losing Trust`,
    summary: (name) =>
      `Migrate into ${name} with an inventory, field map, pilot import, dual-run week, and validation — so history survives and operators trust the new system.`,
    heroAlt: (name) =>
      `${name} migration hero: export → map → pilot → validate path into HR software.`,
    figureAlt: (name) =>
      `${name} migration map: objects, field mapping, pilot import, dual-run, cutover.`,
    figureCaption: (name) =>
      `Prove a small ${name} import before you move the whole operation.`,
    checklist: [
      {
        id: "inventory",
        label: "Inventory source objects",
        description: "Roles, people, schedules, timesheets, or SOPs as relevant.",
      },
      {
        id: "pilot",
        label: "Run a pilot import",
        description: "One segment first; fix mapping before bulk.",
      },
      {
        id: "validate",
        label: "Validate with operators",
        description: "Spot-check records they care about before cutover.",
      },
    ],
    nextActionLabel: (name) => `Open ${name} setup guide`,
    ctaVariant: "generic",
  },
  setup: {
    kind: "setup",
    topicType: "setup",
    journeyStage: "implement",
    knowledgeAreaSlug: "implementation",
    relationType: "implementation-for",
    pathKind: "setup",
    seoTitle: (name) => clipSeo(`${name} Setup Guide | SoftwareGlimpse`),
    pageTitle: (name) =>
      `${name} Setup: Day-Zero Path to a Working HR Loop`,
    summary: (name) =>
      `Set up ${name} for day-zero work — seats, one core loop, required integrations, and non-admin proof — before optional hubs.`,
    heroAlt: (name) =>
      `${name} setup hero: account → core loop → users → integrations → non-admin proof.`,
    figureAlt: (name) =>
      `${name} setup walkthrough: configure the core job, invite weekly users, complete one real workflow.`,
    figureCaption: (name) =>
      `A working ${name} core loop beats a decorated empty workspace.`,
    checklist: [
      {
        id: "loop",
        label: "Configure one core loop",
        description: "The job this product is actually for — not every HR module.",
      },
      {
        id: "users",
        label: "Invite weekly users",
        description: "Roles and permissions before data entry.",
      },
      {
        id: "core-loop",
        label: "Complete non-admin proof",
        description: "A hiring manager, site lead, or new hire can finish the loop.",
      },
    ],
    nextActionLabel: (name) => `Continue ${name} implementation`,
    ctaVariant: "generic",
  },
  plans: {
    kind: "plans",
    topicType: "pricing-education",
    journeyStage: "choose",
    knowledgeAreaSlug: "pricing",
    relationType: "explains-pricing",
    pathKind: "plans",
    seoTitle: (name) => clipSeo(`${name} Plans: Free vs Paid | SoftwareGlimpse`),
    pageTitle: (name) =>
      `${name} Plans: Seats, Hubs, and Qualifying Tiers`,
    summary: (name) =>
      `Choose your ${name} plan by mapping must-haves to qualifying tiers — seats, hubs, pools, and add-ons — not homepage “from” tiles.`,
    heroAlt: (name) =>
      `${name} plans hero: must-haves mapping to qualifying plan tiers — no invented totals.`,
    figureAlt: (name) =>
      `${name} plan anatomy: seats, hub gates, add-ons, billing term into a qualifying plan.`,
    figureCaption: (name) =>
      `Read ${name} pricing from must-have gates upward; confirm numbers on the pricing page.`,
    checklist: [
      {
        id: "musts",
        label: "List day-one must-haves",
        description: "Features that must ship without an unused enterprise tier.",
      },
      {
        id: "qualify",
        label: "Map to a qualifying plan",
        description: "Use researched plan names — not marketing starting tiles.",
      },
      {
        id: "quote",
        label: "Get the qualifying quote in writing",
        description: "Seats, hubs, add-ons, and implementation fees.",
      },
    ],
    nextActionLabel: (name) => `Open ${name} pricing`,
    ctaVariant: "calculator",
  },
  "worth-it": {
    kind: "worth-it",
    topicType: "selection",
    journeyStage: "evaluate",
    knowledgeAreaSlug: "selection",
    relationType: "answers-question-for",
    pathKind: "worth-it",
    seoTitle: (name) => clipSeo(`Is ${name} Worth It? | SoftwareGlimpse`),
    pageTitle: (name) => `Is ${name} Worth It? Fit Scenarios Before You Buy`,
    summary: (name) =>
      `Decide if ${name} is worth it for your team — job-cluster fit, trial proof, and packaging — without invented ROI percentages.`,
    heroAlt: (name) =>
      `${name} worth-it hero: fit vs not-fit decision gates leading to buy, trial, or keep looking.`,
    figureAlt: (name) =>
      `${name} worth-it framework: best-for, not-ideal, evidence from trial, commercial clarity.`,
    figureCaption: (name) =>
      `${name} is “worth it” when outcomes, usability, and qualifying cost align — not when a demo feels exciting.`,
    checklist: [
      {
        id: "fit",
        label: "Match best-for scenarios",
        description: "Your motion should match this product’s HR job cluster.",
      },
      {
        id: "trial",
        label: "Prove the core loop",
        description: "Non-admin trial evidence beats marketing claims.",
      },
      {
        id: "plan",
        label: "Confirm qualifying plan",
        description: "Must-haves on a real tier before you call it a bargain.",
      },
    ],
    nextActionLabel: (name) => `Read the ${name} review`,
    ctaVariant: "finder",
  },
};

export const PM_PRODUCT_GUIDE_KIND_CONFIG: Record<
  CrmProductGuideKind,
  CrmProductGuideKindConfig
> = {
  implementation: {
    kind: "implementation",
    topicType: "implementation",
    journeyStage: "implement",
    knowledgeAreaSlug: "implementation",
    relationType: "implementation-for",
    pathKind: "implementation",
    seoTitle: (name) =>
      clipSeo(`${name} Implementation Guide | SoftwareGlimpse`),
    pageTitle: (name) =>
      `${name} Implementation: 30/60/90 Rollout That Sticks`,
    summary: (name) =>
      `Plan a practical ${name} rollout — owners, core work loop, training, and adoption checkpoints — so the product becomes how the team actually ships work.`,
    heroAlt: (name) =>
      `${name} implementation hero: 30/60/90 work-OS phases with workspace owner and adoption gates.`,
    figureAlt: (name) =>
      `${name} implementation walkthrough: freeze outcomes, configure the core loop, train weekly users, review adoption.`,
    figureCaption: (name) =>
      `Treat ${name} implementation as gated phases — not a feature dump in week one.`,
    checklist: [
      {
        id: "outcomes",
        label: "Freeze 90-day outcomes",
        description: "Must-haves and owners before configuration sprawl.",
      },
      {
        id: "admin",
        label: "Name a workspace owner",
        description: "Boards, users, and hygiene need a responsible party.",
      },
      {
        id: "adoption",
        label: "Schedule adoption review",
        description: "Check core-loop usage before adding automations.",
      },
    ],
    nextActionLabel: (name) => `Read the ${name} review`,
    ctaVariant: "finder",
  },
  migration: {
    kind: "migration",
    topicType: "migration",
    journeyStage: "implement",
    knowledgeAreaSlug: "implementation",
    relationType: "migration-for",
    pathKind: "migration",
    seoTitle: (name) => clipSeo(`${name} Migration Guide | SoftwareGlimpse`),
    pageTitle: (name) =>
      `${name} Migration: Move Work Without Losing History`,
    summary: (name) =>
      `Migrate into ${name} with an inventory, field map, pilot import, dual-run week, and validation — so boards, owners, and dates survive and the team trusts the new system.`,
    heroAlt: (name) =>
      `${name} migration hero: export → map → pilot → validate path into the work OS.`,
    figureAlt: (name) =>
      `${name} migration map: objects, field mapping, pilot import, dual-run, cutover.`,
    figureCaption: (name) =>
      `Prove a small ${name} import before you move the whole operation.`,
    checklist: [
      {
        id: "inventory",
        label: "Inventory source objects",
        description: "Projects, tasks, boards, owners, and attachments.",
      },
      {
        id: "pilot",
        label: "Run a pilot import",
        description: "One project first; fix mapping before bulk.",
      },
      {
        id: "validate",
        label: "Validate with operators",
        description: "Spot-check items they care about before cutover.",
      },
    ],
    nextActionLabel: (name) => `Open ${name} setup guide`,
    ctaVariant: "generic",
  },
  setup: {
    kind: "setup",
    topicType: "setup",
    journeyStage: "implement",
    knowledgeAreaSlug: "implementation",
    relationType: "implementation-for",
    pathKind: "setup",
    seoTitle: (name) => clipSeo(`${name} Setup Guide | SoftwareGlimpse`),
    pageTitle: (name) =>
      `${name} Setup: Day-Zero Path to a Working Work Loop`,
    summary: (name) =>
      `Set up ${name} for day-zero work — seats, one core loop, required integrations, and non-admin proof — before optional views and automations.`,
    heroAlt: (name) =>
      `${name} setup hero: account → core board → users → integrations → non-admin proof.`,
    figureAlt: (name) =>
      `${name} setup walkthrough: configure the core job, invite weekly users, complete one real workflow.`,
    figureCaption: (name) =>
      `A working ${name} core loop beats a decorated empty workspace.`,
    checklist: [
      {
        id: "loop",
        label: "Configure one core loop",
        description: "The job this product is actually for — not every work-OS module.",
      },
      {
        id: "users",
        label: "Invite weekly users",
        description: "Roles and permissions before data entry.",
      },
      {
        id: "core-loop",
        label: "Complete non-admin proof",
        description: "A contributor or project lead can finish the loop without an admin.",
      },
    ],
    nextActionLabel: (name) => `Continue ${name} implementation`,
    ctaVariant: "generic",
  },
  plans: {
    kind: "plans",
    topicType: "pricing-education",
    journeyStage: "choose",
    knowledgeAreaSlug: "pricing",
    relationType: "explains-pricing",
    pathKind: "plans",
    seoTitle: (name) => clipSeo(`${name} Plans: Free vs Paid | SoftwareGlimpse`),
    pageTitle: (name) =>
      `${name} Plans: Seats, Guests, and Qualifying Tiers`,
    summary: (name) =>
      `Choose your ${name} plan by mapping must-haves to qualifying tiers — seats, guests, views, and add-ons — not homepage “from” tiles.`,
    heroAlt: (name) =>
      `${name} plans hero: must-haves mapping to qualifying plan tiers — no invented totals.`,
    figureAlt: (name) =>
      `${name} plan anatomy: seats, feature gates, add-ons, billing term into a qualifying plan.`,
    figureCaption: (name) =>
      `Read ${name} pricing from must-have gates upward; confirm numbers on the pricing page.`,
    checklist: [
      {
        id: "musts",
        label: "List day-one must-haves",
        description: "Features that must ship without an unused enterprise tier.",
      },
      {
        id: "qualify",
        label: "Map to a qualifying plan",
        description: "Use researched plan names — not marketing starting tiles.",
      },
      {
        id: "quote",
        label: "Get the qualifying quote in writing",
        description: "Seats, guests, add-ons, and implementation fees.",
      },
    ],
    nextActionLabel: (name) => `Open ${name} pricing`,
    ctaVariant: "calculator",
  },
  "worth-it": {
    kind: "worth-it",
    topicType: "selection",
    journeyStage: "evaluate",
    knowledgeAreaSlug: "selection",
    relationType: "answers-question-for",
    pathKind: "worth-it",
    seoTitle: (name) => clipSeo(`Is ${name} Worth It? | SoftwareGlimpse`),
    pageTitle: (name) => `Is ${name} Worth It? Fit Scenarios Before You Buy`,
    summary: (name) =>
      `Decide if ${name} is worth it for your team — job-cluster fit, trial proof, and packaging — without invented ROI percentages.`,
    heroAlt: (name) =>
      `${name} worth-it hero: fit vs not-fit decision gates leading to buy, trial, or keep looking.`,
    figureAlt: (name) =>
      `${name} worth-it framework: best-for, not-ideal, evidence from trial, commercial clarity.`,
    figureCaption: (name) =>
      `${name} is “worth it” when outcomes, usability, and qualifying cost align — not when a demo feels exciting.`,
    checklist: [
      {
        id: "fit",
        label: "Match best-for scenarios",
        description: "Your motion should match this product’s project-management job cluster.",
      },
      {
        id: "trial",
        label: "Prove the core loop",
        description: "Non-admin trial evidence beats marketing claims.",
      },
      {
        id: "plan",
        label: "Confirm qualifying plan",
        description: "Must-haves on a real tier before you call it a bargain.",
      },
    ],
    nextActionLabel: (name) => `Read the ${name} review`,
    ctaVariant: "finder",
  },
};

export const ECOM_PRODUCT_GUIDE_KIND_CONFIG: Record<
  CrmProductGuideKind,
  CrmProductGuideKindConfig
> = {
  implementation: {
    kind: "implementation",
    topicType: "implementation",
    journeyStage: "implement",
    knowledgeAreaSlug: "implementation",
    relationType: "implementation-for",
    pathKind: "implementation",
    seoTitle: (name) =>
      clipSeo(`${name} Implementation Guide | SoftwareGlimpse`),
    pageTitle: (name) =>
      `${name} Implementation: 30/60/90 Store Rollout That Sticks`,
    summary: (name) =>
      `Plan a practical ${name} rollout — owners, core commerce loop, training, and adoption checkpoints — so the product becomes how the team actually works.`,
    heroAlt: (name) =>
      `${name} implementation hero: 30/60/90 commerce phases with admin owner and adoption gates.`,
    figureAlt: (name) =>
      `${name} implementation walkthrough: freeze outcomes, configure the core loop, train weekly users, review adoption.`,
    figureCaption: (name) =>
      `Treat ${name} implementation as gated phases — not a feature dump in week one.`,
    checklist: [
      {
        id: "outcomes",
        label: "Freeze 90-day outcomes",
        description: "Must-haves and owners before configuration sprawl.",
      },
      {
        id: "admin",
        label: "Name an admin owner",
        description: "Fields, users, and hygiene need a responsible party.",
      },
      {
        id: "adoption",
        label: "Schedule adoption review",
        description: "Check core-loop usage before adding automations.",
      },
    ],
    nextActionLabel: (name) => `Read the ${name} review`,
    ctaVariant: "finder",
  },
  migration: {
    kind: "migration",
    topicType: "migration",
    journeyStage: "implement",
    knowledgeAreaSlug: "implementation",
    relationType: "migration-for",
    pathKind: "migration",
    seoTitle: (name) => clipSeo(`${name} Migration Guide | SoftwareGlimpse`),
    pageTitle: (name) =>
      `${name} Migration: Move Catalog & Order Data Without Losing Trust`,
    summary: (name) =>
      `Migrate into ${name} with an inventory, field map, pilot import, dual-run week, and validation — so history survives and operators trust the new system.`,
    heroAlt: (name) =>
      `${name} migration hero: export → map → pilot → validate path into ecommerce software.`,
    figureAlt: (name) =>
      `${name} migration map: objects, field mapping, pilot import, dual-run, cutover.`,
    figureCaption: (name) =>
      `Prove a small ${name} import before you move the whole operation.`,
    checklist: [
      {
        id: "inventory",
        label: "Inventory source objects",
        description: "Roles, people, schedules, timesheets, or SOPs as relevant.",
      },
      {
        id: "pilot",
        label: "Run a pilot import",
        description: "One segment first; fix mapping before bulk.",
      },
      {
        id: "validate",
        label: "Validate with operators",
        description: "Spot-check records they care about before cutover.",
      },
    ],
    nextActionLabel: (name) => `Open ${name} setup guide`,
    ctaVariant: "generic",
  },
  setup: {
    kind: "setup",
    topicType: "setup",
    journeyStage: "implement",
    knowledgeAreaSlug: "implementation",
    relationType: "implementation-for",
    pathKind: "setup",
    seoTitle: (name) => clipSeo(`${name} Setup Guide | SoftwareGlimpse`),
    pageTitle: (name) =>
      `${name} Setup: Day-Zero Path to a Working Ecommerce Loop`,
    summary: (name) =>
      `Set up ${name} for day-zero work — seats, one core loop, required integrations, and non-admin proof — before optional hubs.`,
    heroAlt: (name) =>
      `${name} setup hero: account → core loop → users → integrations → non-admin proof.`,
    figureAlt: (name) =>
      `${name} setup walkthrough: configure the core job, invite weekly users, complete one real workflow.`,
    figureCaption: (name) =>
      `A working ${name} core loop beats a decorated empty workspace.`,
    checklist: [
      {
        id: "loop",
        label: "Configure one core loop",
        description: "The job this product is actually for — not every Ecommerce module.",
      },
      {
        id: "users",
        label: "Invite weekly users",
        description: "Roles and permissions before data entry.",
      },
      {
        id: "core-loop",
        label: "Complete non-admin proof",
        description: "A catalog manager, site lead, or new hire can finish the loop.",
      },
    ],
    nextActionLabel: (name) => `Continue ${name} implementation`,
    ctaVariant: "generic",
  },
  plans: {
    kind: "plans",
    topicType: "pricing-education",
    journeyStage: "choose",
    knowledgeAreaSlug: "pricing",
    relationType: "explains-pricing",
    pathKind: "plans",
    seoTitle: (name) => clipSeo(`${name} Plans: Free vs Paid | SoftwareGlimpse`),
    pageTitle: (name) =>
      `${name} Plans: Seats, Hubs, and Qualifying Tiers`,
    summary: (name) =>
      `Choose your ${name} plan by mapping must-haves to qualifying tiers — seats, hubs, pools, and add-ons — not homepage “from” tiles.`,
    heroAlt: (name) =>
      `${name} plans hero: must-haves mapping to qualifying plan tiers — no invented totals.`,
    figureAlt: (name) =>
      `${name} plan anatomy: seats, hub gates, add-ons, billing term into a qualifying plan.`,
    figureCaption: (name) =>
      `Read ${name} pricing from must-have gates upward; confirm numbers on the pricing page.`,
    checklist: [
      {
        id: "musts",
        label: "List day-one must-haves",
        description: "Features that must ship without an unused enterprise tier.",
      },
      {
        id: "qualify",
        label: "Map to a qualifying plan",
        description: "Use researched plan names — not marketing starting tiles.",
      },
      {
        id: "quote",
        label: "Get the qualifying quote in writing",
        description: "Seats, hubs, add-ons, and implementation fees.",
      },
    ],
    nextActionLabel: (name) => `Open ${name} pricing`,
    ctaVariant: "calculator",
  },
  "worth-it": {
    kind: "worth-it",
    topicType: "selection",
    journeyStage: "evaluate",
    knowledgeAreaSlug: "selection",
    relationType: "answers-question-for",
    pathKind: "worth-it",
    seoTitle: (name) => clipSeo(`Is ${name} Worth It? | SoftwareGlimpse`),
    pageTitle: (name) => `Is ${name} Worth It? Fit Scenarios Before You Buy`,
    summary: (name) =>
      `Decide if ${name} is worth it for your team — job-cluster fit, trial proof, and packaging — without invented ROI percentages.`,
    heroAlt: (name) =>
      `${name} worth-it hero: fit vs not-fit decision gates leading to buy, trial, or keep looking.`,
    figureAlt: (name) =>
      `${name} worth-it framework: best-for, not-ideal, evidence from trial, commercial clarity.`,
    figureCaption: (name) =>
      `${name} is “worth it” when outcomes, usability, and qualifying cost align — not when a demo feels exciting.`,
    checklist: [
      {
        id: "fit",
        label: "Match best-for scenarios",
        description: "Your motion should match this product’s Ecommerce job cluster.",
      },
      {
        id: "trial",
        label: "Prove the core loop",
        description: "Non-admin trial evidence beats marketing claims.",
      },
      {
        id: "plan",
        label: "Confirm qualifying plan",
        description: "Must-haves on a real tier before you call it a bargain.",
      },
    ],
    nextActionLabel: (name) => `Read the ${name} review`,
    ctaVariant: "finder",
  },
};

/** Same five kinds as CRM, with AI / LLM / credits language. */
export const AI_PRODUCT_GUIDE_KIND_CONFIG: Record<
  CrmProductGuideKind,
  CrmProductGuideKindConfig
> = {
  implementation: {
    kind: "implementation",
    topicType: "implementation",
    journeyStage: "implement",
    knowledgeAreaSlug: "implementation",
    relationType: "implementation-for",
    pathKind: "implementation",
    seoTitle: (name) =>
      clipSeo(`${name} Implementation Guide | SoftwareGlimpse`),
    pageTitle: (name) =>
      `${name} Implementation: 30/60/90 AI Rollout That Sticks`,
    summary: (name) =>
      `Plan a practical ${name} rollout — owners, core AI loop, training, and adoption checkpoints — so the product becomes how the team actually works.`,
    heroAlt: (name) =>
      `${name} implementation hero: 30/60/90 AI phases with admin owner and adoption gates.`,
    figureAlt: (name) =>
      `${name} implementation walkthrough: freeze outcomes, configure the core loop, train weekly users, review adoption.`,
    figureCaption: (name) =>
      `Treat ${name} implementation as gated phases — not a feature dump in week one.`,
    checklist: [
      {
        id: "outcomes",
        label: "Freeze 90-day outcomes",
        description: "Must-haves and owners before configuration sprawl.",
      },
      {
        id: "admin",
        label: "Name an admin owner",
        description: "Seats, credits, and hygiene need a responsible party.",
      },
      {
        id: "adoption",
        label: "Schedule adoption review",
        description: "Check core-loop usage before adding extras.",
      },
    ],
    nextActionLabel: (name) => `Read the ${name} review`,
    ctaVariant: "finder",
  },
  migration: {
    kind: "migration",
    topicType: "migration",
    journeyStage: "implement",
    knowledgeAreaSlug: "implementation",
    relationType: "migration-for",
    pathKind: "migration",
    seoTitle: (name) => clipSeo(`${name} Migration Guide | SoftwareGlimpse`),
    pageTitle: (name) =>
      `${name} Migration: Move Projects Without Losing Context`,
    summary: (name) =>
      `Migrate into ${name} with an inventory, field map, pilot import, dual-run week, and validation — so prompts, projects, and files survive and operators trust the new system.`,
    heroAlt: (name) =>
      `${name} migration hero: export → map → pilot → validate path into AI software.`,
    figureAlt: (name) =>
      `${name} migration map: objects, field mapping, pilot import, dual-run, cutover.`,
    figureCaption: (name) =>
      `Prove a small ${name} import before you move the whole operation.`,
    checklist: [
      {
        id: "inventory",
        label: "Inventory source objects",
        description: "Projects, prompts, files, or workspaces as relevant.",
      },
      {
        id: "pilot",
        label: "Run a pilot import",
        description: "One segment first; fix mapping before bulk.",
      },
      {
        id: "validate",
        label: "Validate with operators",
        description: "Spot-check records they care about before cutover.",
      },
    ],
    nextActionLabel: (name) => `Open ${name} setup guide`,
    ctaVariant: "generic",
  },
  setup: {
    kind: "setup",
    topicType: "setup",
    journeyStage: "implement",
    knowledgeAreaSlug: "implementation",
    relationType: "implementation-for",
    pathKind: "setup",
    seoTitle: (name) => clipSeo(`${name} Setup Guide | SoftwareGlimpse`),
    pageTitle: (name) =>
      `${name} Setup: Day-Zero Path to a Working AI Loop`,
    summary: (name) =>
      `Set up ${name} for day-zero work — seats or credits, one core loop, required connectors, and non-admin proof — before optional add-ons.`,
    heroAlt: (name) =>
      `${name} setup hero: account → core loop → users → connectors → non-admin proof.`,
    figureAlt: (name) =>
      `${name} setup walkthrough: configure the core job, invite weekly users, complete one real workflow.`,
    figureCaption: (name) =>
      `A working ${name} core loop beats a decorated empty workspace.`,
    checklist: [
      {
        id: "loop",
        label: "Configure one core loop",
        description: "The job this product is actually for — not every AI module.",
      },
      {
        id: "users",
        label: "Invite weekly users",
        description: "Roles and permissions before data entry.",
      },
      {
        id: "core-loop",
        label: "Complete non-admin proof",
        description: "A weekly user can finish the loop without an admin.",
      },
    ],
    nextActionLabel: (name) => `Continue ${name} implementation`,
    ctaVariant: "generic",
  },
  plans: {
    kind: "plans",
    topicType: "pricing-education",
    journeyStage: "choose",
    knowledgeAreaSlug: "pricing",
    relationType: "explains-pricing",
    pathKind: "plans",
    seoTitle: (name) => clipSeo(`${name} Plans: Free vs Paid | SoftwareGlimpse`),
    pageTitle: (name) =>
      `${name} Plans: Seats, Credits, and Qualifying Tiers`,
    summary: (name) =>
      `Choose your ${name} plan by mapping must-haves to qualifying tiers — seats, credits, usage packs, and add-ons — not homepage “from” tiles.`,
    heroAlt: (name) =>
      `${name} plans hero: must-haves mapping to qualifying plan tiers — no invented totals.`,
    figureAlt: (name) =>
      `${name} plan anatomy: seats, credit gates, add-ons, billing term into a qualifying plan.`,
    figureCaption: (name) =>
      `Read ${name} pricing from must-have gates upward; confirm numbers on the pricing page.`,
    checklist: [
      {
        id: "musts",
        label: "List day-one must-haves",
        description: "Features that must ship without an unused enterprise tier.",
      },
      {
        id: "qualify",
        label: "Map to a qualifying plan",
        description: "Use researched plan names — not marketing starting tiles.",
      },
      {
        id: "quote",
        label: "Get the qualifying quote in writing",
        description: "Seats, credits, add-ons, and implementation fees.",
      },
    ],
    nextActionLabel: (name) => `Open ${name} pricing`,
    ctaVariant: "calculator",
  },
  "worth-it": {
    kind: "worth-it",
    topicType: "selection",
    journeyStage: "evaluate",
    knowledgeAreaSlug: "selection",
    relationType: "answers-question-for",
    pathKind: "worth-it",
    seoTitle: (name) => clipSeo(`Is ${name} Worth It? | SoftwareGlimpse`),
    pageTitle: (name) => `Is ${name} Worth It? Fit Scenarios Before You Buy`,
    summary: (name) =>
      `Decide if ${name} is worth it for your team — job-cluster fit, trial proof, and packaging — without invented ROI percentages.`,
    heroAlt: (name) =>
      `${name} worth-it hero: fit vs not-fit decision gates leading to buy, trial, or keep looking.`,
    figureAlt: (name) =>
      `${name} worth-it framework: best-for, not-ideal, evidence from trial, commercial clarity.`,
    figureCaption: (name) =>
      `${name} is “worth it” when outcomes, usability, and qualifying cost align — not when a demo feels exciting.`,
    checklist: [
      {
        id: "fit",
        label: "Match best-for scenarios",
        description: "Your motion should match this product’s AI job cluster.",
      },
      {
        id: "trial",
        label: "Prove the core loop",
        description: "Non-admin trial evidence beats marketing claims.",
      },
      {
        id: "plan",
        label: "Confirm qualifying plan",
        description: "Must-haves on a real tier before you call it a bargain.",
      },
    ],
    nextActionLabel: (name) => `Read the ${name} review`,
    ctaVariant: "finder",
  },
};

/** Same five kinds as CRM, with ITSM / observability / source-control language. */
export const IT_PRODUCT_GUIDE_KIND_CONFIG: Record<
  CrmProductGuideKind,
  CrmProductGuideKindConfig
> = {
  implementation: {
    kind: "implementation",
    topicType: "implementation",
    journeyStage: "implement",
    knowledgeAreaSlug: "implementation",
    relationType: "implementation-for",
    pathKind: "implementation",
    seoTitle: (name) =>
      clipSeo(`${name} Implementation Guide | SoftwareGlimpse`),
    pageTitle: (name) =>
      `${name} Implementation: 30/60/90 IT Rollout That Sticks`,
    summary: (name) =>
      `Plan a practical ${name} rollout — owners, core IT loop, training, and adoption checkpoints — so the product becomes how the team actually operates.`,
    heroAlt: (name) =>
      `${name} implementation hero: 30/60/90 IT phases with admin owner and adoption gates.`,
    figureAlt: (name) =>
      `${name} implementation walkthrough: freeze outcomes, configure the core loop, train weekly operators, review adoption.`,
    figureCaption: (name) =>
      `Treat ${name} implementation as gated phases — not a feature dump in week one.`,
    checklist: [
      {
        id: "outcomes",
        label: "Freeze 90-day outcomes",
        description: "Must-haves and owners before configuration sprawl.",
      },
      {
        id: "admin",
        label: "Name an admin owner",
        description: "Seats, hosts, and hygiene need a responsible party.",
      },
      {
        id: "adoption",
        label: "Schedule adoption review",
        description: "Check core-loop usage before adding extras.",
      },
    ],
    nextActionLabel: (name) => `Read the ${name} review`,
    ctaVariant: "finder",
  },
  migration: {
    kind: "migration",
    topicType: "migration",
    journeyStage: "implement",
    knowledgeAreaSlug: "implementation",
    relationType: "migration-for",
    pathKind: "migration",
    seoTitle: (name) => clipSeo(`${name} Migration Guide | SoftwareGlimpse`),
    pageTitle: (name) =>
      `${name} Migration: Move Tickets and Repos Without Losing Trust`,
    summary: (name) =>
      `Migrate into ${name} with an inventory, field map, pilot import, dual-run week, and validation — so history survives and operators trust the new system.`,
    heroAlt: (name) =>
      `${name} migration hero: export → map → pilot → validate path into IT software.`,
    figureAlt: (name) =>
      `${name} migration map: objects, field mapping, pilot import, dual-run, cutover.`,
    figureCaption: (name) =>
      `Prove a small ${name} import before you move the whole operation.`,
    checklist: [
      {
        id: "inventory",
        label: "Inventory source objects",
        description: "Tickets, repos, monitors, or accounts as relevant.",
      },
      {
        id: "pilot",
        label: "Run a pilot import",
        description: "One segment first; fix mapping before bulk.",
      },
      {
        id: "validate",
        label: "Validate with operators",
        description: "Spot-check records they care about before cutover.",
      },
    ],
    nextActionLabel: (name) => `Open ${name} setup guide`,
    ctaVariant: "generic",
  },
  setup: {
    kind: "setup",
    topicType: "setup",
    journeyStage: "implement",
    knowledgeAreaSlug: "implementation",
    relationType: "implementation-for",
    pathKind: "setup",
    seoTitle: (name) => clipSeo(`${name} Setup Guide | SoftwareGlimpse`),
    pageTitle: (name) =>
      `${name} Setup: Day-Zero Path to a Working IT Loop`,
    summary: (name) =>
      `Set up ${name} for day-zero work — seats or hosts, one core loop, required integrations, and non-admin proof — before optional modules.`,
    heroAlt: (name) =>
      `${name} setup hero: account → core loop → users → integrations → non-admin proof.`,
    figureAlt: (name) =>
      `${name} setup walkthrough: configure the core job, invite weekly operators, complete one real workflow.`,
    figureCaption: (name) =>
      `A working ${name} core loop beats a decorated empty workspace.`,
    checklist: [
      {
        id: "loop",
        label: "Configure one core loop",
        description: "The job this product is actually for — not every IT module.",
      },
      {
        id: "users",
        label: "Invite weekly users",
        description: "Roles and permissions before data entry.",
      },
      {
        id: "core-loop",
        label: "Complete non-admin proof",
        description: "An operator can finish the loop without an admin.",
      },
    ],
    nextActionLabel: (name) => `Continue ${name} implementation`,
    ctaVariant: "generic",
  },
  plans: {
    kind: "plans",
    topicType: "pricing-education",
    journeyStage: "choose",
    knowledgeAreaSlug: "pricing",
    relationType: "explains-pricing",
    pathKind: "plans",
    seoTitle: (name) => clipSeo(`${name} Plans: Free vs Paid | SoftwareGlimpse`),
    pageTitle: (name) =>
      `${name} Plans: Seats, Hosts, and Qualifying Tiers`,
    summary: (name) =>
      `Choose your ${name} plan by mapping must-haves to qualifying tiers — seats, hosts, ingest, and add-ons — not homepage “from” tiles.`,
    heroAlt: (name) =>
      `${name} plans hero: must-haves mapping to qualifying plan tiers — no invented totals.`,
    figureAlt: (name) =>
      `${name} plan anatomy: seats, host gates, add-ons, billing term into a qualifying plan.`,
    figureCaption: (name) =>
      `Read ${name} pricing from must-have gates upward; confirm numbers on the pricing page.`,
    checklist: [
      {
        id: "musts",
        label: "List day-one must-haves",
        description: "Features that must ship without an unused enterprise tier.",
      },
      {
        id: "qualify",
        label: "Map to a qualifying plan",
        description: "Use researched plan names — not marketing starting tiles.",
      },
      {
        id: "quote",
        label: "Get the qualifying quote in writing",
        description: "Seats, hosts, add-ons, and implementation fees.",
      },
    ],
    nextActionLabel: (name) => `Open ${name} pricing`,
    ctaVariant: "calculator",
  },
  "worth-it": {
    kind: "worth-it",
    topicType: "selection",
    journeyStage: "evaluate",
    knowledgeAreaSlug: "selection",
    relationType: "answers-question-for",
    pathKind: "worth-it",
    seoTitle: (name) => clipSeo(`Is ${name} Worth It? | SoftwareGlimpse`),
    pageTitle: (name) => `Is ${name} Worth It? Fit Scenarios Before You Buy`,
    summary: (name) =>
      `Decide if ${name} is worth it for your team — job-cluster fit, trial proof, and packaging — without invented ROI percentages.`,
    heroAlt: (name) =>
      `${name} worth-it hero: fit vs not-fit decision gates leading to buy, trial, or keep looking.`,
    figureAlt: (name) =>
      `${name} worth-it framework: best-for, not-ideal, evidence from trial, commercial clarity.`,
    figureCaption: (name) =>
      `${name} is “worth it” when outcomes, usability, and qualifying cost align — not when a demo feels exciting.`,
    checklist: [
      {
        id: "fit",
        label: "Match best-for scenarios",
        description: "Your motion should match this product’s IT job cluster.",
      },
      {
        id: "trial",
        label: "Prove the core loop",
        description: "Non-admin trial evidence beats marketing claims.",
      },
      {
        id: "plan",
        label: "Confirm qualifying plan",
        description: "Must-haves on a real tier before you call it a bargain.",
      },
    ],
    nextActionLabel: (name) => `Read the ${name} review`,
    ctaVariant: "finder",
  },
};

export function productGuideKindConfig(
  categorySlug: string,
  kind: CrmProductGuideKind,
): CrmProductGuideKindConfig {
  if (categorySlug === "sales-intelligence") {
    return SI_PRODUCT_GUIDE_KIND_CONFIG[kind];
  }
  if (categorySlug === "email-marketing") {
    return EM_PRODUCT_GUIDE_KIND_CONFIG[kind];
  }
  if (categorySlug === "marketing") {
    return MARKETING_PRODUCT_GUIDE_KIND_CONFIG[kind];
  }
  if (categorySlug === "business-communications") {
    return BC_PRODUCT_GUIDE_KIND_CONFIG[kind];
  }
  if (categorySlug === "hr") {
    return HR_PRODUCT_GUIDE_KIND_CONFIG[kind];
  }
  if (categorySlug === "ecommerce") {
    return ECOM_PRODUCT_GUIDE_KIND_CONFIG[kind];
  }
  if (categorySlug === "project-management") {
    return PM_PRODUCT_GUIDE_KIND_CONFIG[kind];
  }
  if (categorySlug === "ai") {
    return AI_PRODUCT_GUIDE_KIND_CONFIG[kind];
  }
  if (categorySlug === "it-development") {
    return IT_PRODUCT_GUIDE_KIND_CONFIG[kind];
  }
  return CRM_PRODUCT_GUIDE_KIND_CONFIG[kind];
}
