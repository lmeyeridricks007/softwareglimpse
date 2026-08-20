import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * Sales intelligence vendor migration — switch SI platforms safely.
 * Template: softwareglimpse-guide-template-v1
 * Published and indexable (editorial gate cleared 2026-08-17).
 */
const salesIntelligenceMigrationBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Switch sales intelligence vendors with a gated path: confirm export rights → plan leftover credits → clean CRM fields → parallel-run a pilot segment → freeze Vendor A → cut over sync to Vendor B → hygiene until Friday trusts the new source. Decision rule: do not firm-wide cutover until export samples work, overwrite rules are remapped, and a pilot proves match/fill without dual write-backs fighting in the CRM.",
    bullets: [
      "Export rights",
      "Credit leftover",
      "CRM field cleanup",
      "Parallel run",
      "Freeze cutover",
      "Hygiene week",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Export rights are a contract question",
        body: "Confirm what you may export and keep before you cancel — do not assume lists survive termination.",
      },
      {
        label: "Credits rarely travel",
        body: "Plan to use, forfeit, or negotiate leftovers explicitly — they usually do not transfer to Vendor B.",
      },
      {
        label: "Clean CRM before rematch",
        body: "Switching SI on a dirty book multiplies duplicates when two enrich engines write back.",
      },
      {
        label: "Parallel run needs a freeze",
        body: "Brief dual running for validation is fine; open-ended dual write-back is not.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "vendor-switch-path",
    title: "SI vendor switch path",
    steps: [
      { id: "rights", label: "Export", short: "Rights & sample" },
      { id: "credits", label: "Credits", short: "Leftover plan" },
      { id: "clean", label: "Clean", short: "CRM fields" },
      { id: "parallel", label: "Parallel", short: "Pilot segment" },
      { id: "cutover", label: "Cutover", short: "Freeze A → B" },
      { id: "hygiene", label: "Hygiene", short: "Trust Friday" },
    ],
    ctaHref: "/best/sales-intelligence-software/",
    ctaLabel: "Best SI software →",
  },
  {
    type: "figure",
    id: "cutover-checklist-visual",
    title: "Cutover checklist",
    src: "/guides/sales-intelligence-migration-guide-cutover.png",
    alt: "Vertical sales intelligence vendor cutover checklist: confirm export rights, document leftover credits, clean CRM fields, parallel-run pilot, freeze Vendor A, cut over sync to Vendor B, hygiene week — with risk callouts for orphaned integrations and overwrite drift.",
    caption:
      "Cutover is a checklist with owners — export, credits, CRM cleanup, parallel proof, freeze, then hygiene — not a weekend uninstall.",
  },
  {
    type: "checklist",
    id: "vendor-switch-ready",
    title: "Vendor-switch readiness checklist",
    copyable: true,
    items: [
      {
        id: "destination-chosen",
        label: "Destination vendor chosen with frozen must-haves",
        description: "Primary job + coverage test done — see how to choose.",
        order: 0,
      },
      {
        id: "export-rights",
        label: "Export rights confirmed in contract / admin docs",
        description: "What formats, what retention after cancel.",
        order: 1,
      },
      {
        id: "credit-plan",
        label: "Leftover credit plan written (use / forfeit / negotiate)",
        description: "Named owner; no surprise empty month mid-switch.",
        order: 2,
      },
      {
        id: "crm-clean",
        label: "Active book cleaned before rematch",
        description: "Dedupe, owners, blank critical fields — CRM hygiene.",
        order: 3,
      },
      {
        id: "field-remap",
        label: "Field map + overwrite rules for Vendor B approved",
        description: "Do not inherit Vendor A’s silent always-update defaults.",
        order: 4,
      },
      {
        id: "parallel-pass",
        label: "Parallel pilot passed (ops + frontline)",
        description: "Match/fill sample; no dual write-back fights.",
        order: 5,
      },
      {
        id: "freeze",
        label: "Freeze window + rollback note scheduled",
        description: "Team knows when Vendor A enrich stops.",
        order: 6,
      },
    ],
  },
  {
    type: "step",
    id: "export-rights",
    stepNumber: 1,
    heading: "Confirm export rights and take a usable export",
    body: "Before you give notice, read what your agreement and admin UI allow: CSV/API export of saved lists, enrichment history, suppression/opt-out lists, and whether exports remain usable after cancellation. Run a sample export now — do not discover broken exports on cancel week. Rank assets as must-keep live, archive-only, or retire.\n\nExample: Harbor Advisory is leaving Vendor A for Vendor B. Ops lead Sam confirms contract language allows CSV export of saved searches and suppression lists during the term, takes a full export of suppression + open-opportunity contact snapshots, and marks Vendor A sequence templates as rebuild-in-B (not migrate). A sample API pull of 50 rows validates fields before any cancel date is set.",
    tip: "If export rights are unclear, escalate to the vendor CSM and your buyer of record before you schedule cutover.",
    figure: {
      src: "/guides/sales-intelligence-migration-guide-hero.png",
      alt: "Sales intelligence vendor migration hero: Vendor A to Vendor B path covering inventory, export rights, leftover credits, CRM field cleanup, parallel run, and freeze cutover with a cutover checklist sidebar.",
      caption:
        "A vendor switch fails when teams only “turn on B” — export rights, credits, and CRM cleanup need their own lanes.",
    },
    scenarios: [
      {
        title: "Lists & suppressions",
        body: "Export what you must keep for compliance and continuity.",
      },
      {
        title: "CRM already has truth",
        body: "Prefer CRM as system of record — SI exports are a backup.",
      },
      {
        title: "Sequences / dialer",
        body: "Often rebuild — do not assume templates port cleanly.",
      },
    ],
  },
  {
    type: "step",
    id: "credits-and-cleanup",
    stepNumber: 2,
    heading: "Plan leftover credits and clean CRM fields",
    body: "Credits almost never transfer. Decide whether to burn remaining credits on a final bounded enrich of open work, leave them unused, or negotiate in writing — then document the choice. In parallel, clean the active CRM book: dedupe, assign owners, fix blank critical fields, and archive junk so Vendor B does not rematch chaos. Pair with CRM data hygiene and the enrichment explained overwrite rules before enabling B’s write-back.\n\nExample: Harbor has unused email credits on A. Sam schedules a final Week enrich only for open retainers (capped), exports results to CRM under fill-blanks rules, and writes “remaining credits forfeited on cancel” in the switch brief. Then a cleaning week merges nickname duplicates and clears ownerless contacts so B’s match keys have a chance.",
    tip: "Never enable Vendor B write-back on a dirty book while Vendor A is still syncing — pick one writer for each field during parallel run.",
    scenarios: [
      {
        title: "Burn with a cap",
        body: "Final enrich of open work only — not the full archive.",
      },
      {
        title: "Forfeit consciously",
        body: "If burn would dirty CRM, leave credits and move on.",
      },
      {
        title: "Field remap",
        body: "Rebuild overwrite policy for B — do not copy A’s defaults blindly.",
      },
    ],
  },
  {
    type: "step",
    id: "parallel-run",
    stepNumber: 3,
    heading: "Parallel-run a pilot segment — one writer per field",
    body: "Connect Vendor B to a sandbox or to CRM with write-back limited to a pilot segment. Compare match/fill on the same ~200 accounts. Keep Vendor A read-only or enrich-off for that segment once B writes. Validate identity keys, overwrite behavior, and credit burn. Have ops and a frontline lead walk records together. Fix maps before firm cutover.\n\nExample: Harbor pilots 40 retainer accounts on B. Three companies mismatch on trading-name vs legal entity; two emails would have overwritten hand corrections until fill-blanks is enforced. A stays disconnected from write-back on those 40. After a clean re-test, Sam schedules freeze Friday for A enrich org-wide.",
    tip: "Parallel run without a field-level writer rule guarantees CRM fights by Tuesday.",
    scenarios: [
      {
        title: "Match sample",
        body: "Same accounts on A vs B — usable email/dial counts.",
      },
      {
        title: "Overwrite sample",
        body: "Confirm B will not clobber owner edits.",
      },
      {
        title: "Integration smoke",
        body: "CRM sync, optional sequencer/dialer — one path each.",
      },
    ],
  },
  {
    type: "step",
    id: "cutover-hygiene",
    stepNumber: 4,
    heading: "Freeze, cut over, then run hygiene",
    body: "Announce when Vendor A enrich/export stops, who takes the final export, and when Vendor B becomes the only SI writer into CRM. Keep the freeze short. Spot-check remapped fields and credit meters on Monday. For 1–2 weeks run a hygiene board: duplicates, blank critical fields, reps still logged into A, integrations still pointing at A. Switch is done when Friday review no longer needs Vendor A.\n\nExample: Harbor freezes A Friday 4pm; final suppression export; Saturday B sync validation; Monday 8am sellers use only B. Sam posts a ten-business-day hygiene board. Two reps still bookmark A until Priya removes SSO access. Cutover complete when Friday pipeline review pulls contact fields from CRM fed by B only.",
    tip: "Do not reconnect every engagement add-on during cutover hour — stabilize CRM write-back and access first.",
    scenarios: [
      {
        title: "Freeze",
        body: "No dual enrich past the cut line.",
      },
      {
        title: "Access",
        body: "Remove A seats/SSO after final export.",
      },
      {
        title: "Hygiene",
        body: "Daily board until B is the trusted source.",
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "SI vendor-switch mistakes",
    items: [
      {
        title: "Canceling before export proof",
        body: "Sample exports after notice is too late if rights or formats fail.",
      },
      {
        title: "Ignoring leftover credits",
        body: "Surprise empty budget mid-quarter kills the new rollout narrative.",
      },
      {
        title: "Rematching a dirty CRM",
        body: "Two vendors’ match engines amplify duplicates.",
      },
      {
        title: "Open-ended parallel write-back",
        body: "A and B overwrite each other; nobody trusts either.",
      },
      {
        title: "Copying overwrite defaults from Vendor A",
        body: "B’s “always update email” may be worse — freeze rules again.",
      },
      {
        title: "Skipping hygiene week",
        body: "Reps keep A bookmarks; Friday still rebuilds contact truth in sheets.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "How do I migrate between sales intelligence tools?",
        answer:
          "Confirm export rights, plan leftover credits, clean CRM fields, parallel-run a pilot with one writer per field, freeze Vendor A, cut over sync to Vendor B, then run hygiene until reviews trust the new source. Use how to choose and Best sales intelligence software before you pick B.",
      },
      {
        question: "Do unused credits transfer to the new vendor?",
        answer:
          "Usually no. Plan to use them on a bounded final job, forfeit them, or negotiate in writing. Do not invent transfer assumptions.",
      },
      {
        question: "Should both tools sync to the CRM during the switch?",
        answer:
          "Only briefly, and with explicit field-level writer rules on a pilot segment. Open-ended dual write-back creates conflicts. Prefer freeze-then-cutover once the pilot passes.",
      },
      {
        question: "What CRM cleanup is required?",
        answer:
          "Dedupe active records, assign owners, fill or accept blanks on critical fields, and archive junk before rematch. Ongoing rhythm lives in CRM data hygiene.",
      },
      {
        question: "How long does an SI vendor switch take?",
        answer:
          "Duration depends on data quality, credit terms, and integration count — not a universal calendar. Prove export + parallel pilot before setting a firm cutover date.",
      },
      {
        question: "What should I do next?",
        answer:
          "Shortlist Vendor B on Best sales intelligence software, freeze export/credit/cleanup owners, run the parallel pilot, then follow the cutover checklist. Re-implement with the SI implementation guide after cutover if seats and budgets need a fresh Week 0–4.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related switch & SI resources",
    links: [
      {
        href: "/categories/sales-intelligence/",
        label: "Sales intelligence category",
        description: "Category hub while you shortlist Vendor B.",
      },
      {
        href: "/best/sales-intelligence-software/",
        label: "Best sales intelligence software",
        description: "Researched shortlist for the destination.",
      },
      {
        href: "/guides/how-to-choose-sales-intelligence/",
        label: "How to choose sales intelligence",
        description: "Confirm primary job before you switch.",
      },
      {
        href: "/guides/sales-intelligence-enrichment-explained/",
        label: "Enrichment explained",
        description: "Match rate and overwrite rules for Vendor B.",
      },
      {
        href: "/guides/sales-intelligence-implementation-guide/",
        label: "SI implementation guide",
        description: "Re-stabilize Week 0–4 after cutover.",
      },
      {
        href: "/guides/crm-data-hygiene/",
        label: "CRM data hygiene",
        description: "Clean before rematch; trust after.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "best-cta",
    title: "Choose Vendor B deliberately",
    body: "Do not switch on brand frustration alone — confirm primary job, coverage on your ICP, credits, and CRM sync on the researched Best sales intelligence software shortlist before you cut over.",
    href: "/best/sales-intelligence-software/",
    ctaLabel: "See Best SI software →",
    variant: "generic",
  },
];

export const salesIntelligenceMigrationGuide: GuidePage = {
  id: "guide-sales-intelligence-migration-guide",
  slug: "sales-intelligence-migration-guide",
  title: "Sales Intelligence Migration Guide: Switch Vendors",
  summary:
    "Switch sales intelligence vendors with export rights, leftover credit planning, CRM field cleanup, parallel run, freeze cutover, and hygiene — without dual write-back fights.",
  categorySlugs: ["sales-intelligence"],
  productSlugs: [],
  topicType: "migration",
  journeyStage: "switch",
  knowledgeAreaSlug: "migration",
  heroVisual: {
    src: "/guides/sales-intelligence-migration-guide-hero.png",
    alt: "Sales intelligence vendor migration hero: Vendor A to Vendor B path covering inventory, export rights, leftover credits, CRM field cleanup, parallel run, and freeze cutover with a cutover checklist sidebar.",
  },
  supports: [
    {
      contentId: "content:category:sales-intelligence",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:best:sales-intelligence-software",
      relationType: "supports-anchor",
      primary: false,
    },
  ],
  nextAction: {
    contentId: "content:best:sales-intelligence-software",
    label: "See Best sales intelligence software",
  },
  relatedGuideSlugs: [
    "how-to-choose-sales-intelligence",
    "sales-intelligence-enrichment-explained",
    "sales-intelligence-implementation-guide",
    "crm-data-hygiene",
  ],
  blocks: salesIntelligenceMigrationBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "export-credits",
      label: "Confirm export rights and leftover credit plan",
      description: "Sample export before cancel.",
      order: 0,
    },
    {
      id: "clean-parallel",
      label: "Clean CRM and pass parallel pilot",
      description: "One writer per field on the segment.",
      order: 1,
    },
    {
      id: "cutover-hygiene",
      label: "Freeze A, cut over B, run hygiene week",
      description: "Remove A access after final export.",
      order: 2,
    },
  ],
  sections: [],
  faq: [],
  freshnessClass: "medium-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-17T07:30:00.000Z",
    publishedAt: "2026-08-17T07:30:00.000Z",
    reviewedAt: "2026-08-17T07:30:00.000Z",
    researchStatus: "complete",
    seoStatus: "draft",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title: "Sales Intelligence Migration Guide: Switch Vendors | SoftwareGlimpse",
    description:
      "How to switch sales intelligence vendors: export rights, leftover credits, CRM field cleanup, parallel run, freeze cutover, and hygiene.",
    canonicalPath: "/guides/sales-intelligence-migration-guide/",
    indexable: true,
  },
};
