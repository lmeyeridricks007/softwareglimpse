#!/usr/bin/env npx tsx
/**
 * Prepare top-10 products for REAL human hands-on testing.
 *
 *   npm run testing:prepare-top-10
 *   npm run testing:prepare-top-10 -- --create-drafts
 *
 * AI NEVER marks tasks complete or fabricates observations.
 * Draft sessions (optional) start with every task NOT_STARTED.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { getSoftwareBySlug } from "@/data";
import { resolveAffectedPages } from "@/services/editorial/dependencies";
import {
  buildProductTestingQueue,
  createTestSession,
  listTestSessionsForProduct,
  resolveProtocolForProduct,
} from "@/services/product-testing";

const ROOT = process.cwd();
const WAVE_DATE = new Date().toISOString().slice(0, 10);

type ManualChecklistArea = { area: string; items: string[] };

type PrepPack = {
  rank: number;
  productSlug: string;
  productName: string;
  categorySlug: string;
  protocolSlug: string;
  evidenceLevel: string;
  priorityScore: number;
  impressions: number;
  comparisonCount: number;
  affiliateEnabled: boolean;
  /** Target human effort for the express (required-task) path */
  estimatedHumanMinutes: { min: number; max: number; note: string };
  protocolTaskCount: number;
  requiredTaskCount: number;
  protocolTasks: Array<{
    id: string;
    slug: string;
    title: string;
    description: string;
    required: boolean;
    evidenceHints: string[];
    screenshotsRequired: boolean;
  }>;
  completionCriteria: string[];
  signupPath: {
    website: string | null;
    httpStatus: number | null;
    reachable: boolean | null;
    notes: string[];
  };
  testObjectives: string[];
  accountRequirements: string[];
  workflows: string[];
  pricingChecks: string[];
  claimsToVerify: string[];
  comparisonQuestions: string[];
  screenshotsRequired: string[];
  strengthPrompts: string[];
  weaknessPrompts: string[];
  /** Explicit human checklist — AI must not complete these. */
  manualChecklist: ManualChecklistArea[];
  dependentPages: Array<{ path: string; pageType: string }>;
  dependentCount: number;
  /** Grouped for post-completion editorial use — do not rewrite until human evidence exists. */
  dependentsByFamily: {
    reviews: string[];
    comparisons: string[];
    best: string[];
    guides: string[];
    other: string[];
  };
  impact: {
    search: string;
    commercial: string;
  };
  draftSessionId: string | null;
};

const SHARED_MANUAL_CHECKLIST: ManualChecklistArea[] = [
  {
    area: "Signup / onboarding",
    items: [
      "Create trial/sandbox account; record plan and verification steps",
      "Complete onboarding wizard; note forced steps and clarity",
      "Time-to-first useful screen",
    ],
  },
  {
    area: "Key workflow tasks",
    items: [
      "Execute the category-core workflow (CRM pipeline / email campaign / SI enrichment)",
      "Import or create sample records",
      "Complete one end-to-end useful outcome",
    ],
  },
  {
    area: "Pricing verification",
    items: [
      "Compare in-app / billing plan labels to the public pricing page",
      "Record seat/contact/credit gates observed",
      "Note trial length and card-required friction",
    ],
  },
  {
    area: "Usability",
    items: [
      "Navigation clarity after first session",
      "Search / find-record quality",
      "Mobile or narrow viewport if available (else NOT_AVAILABLE)",
    ],
  },
  {
    area: "Integrations",
    items: [
      "Open integration catalog or connect one core integration if plan allows",
      "Record gated vs available connectors",
    ],
  },
  {
    area: "Automation",
    items: [
      "Create or inspect one automation/workflow on the tested plan",
      "Note builder clarity and plan gates",
    ],
  },
  {
    area: "Reporting",
    items: [
      "Open or build one report/dashboard relevant to the workflow",
      "Judge usefulness for the intended buyer",
    ],
  },
  {
    area: "Limitations",
    items: [
      "List concrete blockers, missing features, or confusing UX",
      "Separate plan gates from product design limits",
    ],
  },
  {
    area: "Support / help experience",
    items: [
      "Open in-app help, docs, chat, or ticket paths",
      "Record only channels you actually opened — do not invent response times",
    ],
  },
  {
    area: "Screenshots needed",
    items: [
      "Signup/onboarding",
      "Core workflow screen",
      "Automation or reporting",
      "Admin/settings",
      "Public pricing + in-app plan",
    ],
  },
  {
    area: "Comparison observations",
    items: [
      "Answer protocol comparison questions with first-hand notes",
      "Would you recommend for the target buyer on this plan? Why/why not?",
    ],
  },
];

function groupDependents(
  deps: Array<{ path: string; pageType: string }>,
): PrepPack["dependentsByFamily"] {
  const family: PrepPack["dependentsByFamily"] = {
    reviews: [],
    comparisons: [],
    best: [],
    guides: [],
    other: [],
  };
  for (const d of deps) {
    if (d.pageType === "software-review" || d.pageType === "pricing") {
      family.reviews.push(d.path);
    } else if (d.pageType === "comparison" || d.pageType === "alternatives") {
      family.comparisons.push(d.path);
    } else if (d.pageType === "best") {
      family.best.push(d.path);
    } else if (d.pageType === "guide") {
      family.guides.push(d.path);
    } else {
      family.other.push(d.path);
    }
  }
  return family;
}

function packForCategory(categorySlug: string): {
  objectives: string[];
  account: string[];
  workflows: string[];
  pricing: string[];
  claims: string[];
  comparisons: string[];
  screenshots: string[];
  strengths: string[];
  weaknesses: string[];
  checklist: ManualChecklistArea[];
} {
  if (categorySlug === "email-marketing") {
    return {
      objectives: [
        "Confirm time-to-first useful campaign draft on the trial plan",
        "Verify list import / contact profile quality",
        "Exercise one automation and reporting path",
        "Check deliverability settings and public pricing alignment",
      ],
      account: [
        "Company email preferred (avoid disposable if blocked)",
        "Trial plan with automation access if possible",
        "Optional: spare domain or subdomain for auth settings inspection",
        "Do not send campaigns to real customers during the test",
      ],
      workflows: [
        "Create account → onboarding",
        "Import/create list → inspect contact",
        "Draft campaign → editor/mobile preview",
        "Simple automation",
        "Form/landing if plan allows",
        "Analytics + integration catalog",
        "Deliverability settings",
        "Help/support + pricing verify",
      ],
      pricing: [
        "In-app plan name vs public pricing page",
        "Contact/subscriber tier limits shown in billing",
        "Automation / landing feature gated to higher tiers?",
        "Trial length and card-required friction",
      ],
      claims: [
        "Ease of building first campaign",
        "Automation builder clarity",
        "Reporting usefulness for SMB marketers",
        "Integration breadth claims on marketing site",
      ],
      comparisons: [
        "Vs peer email tools: editor speed and template quality",
        "Vs CRM-bundled email: depth of automation",
        "Would you recommend for a 5–20 person marketing team?",
      ],
      screenshots: [
        "Signup / plan chooser",
        "List import or audience screen",
        "Campaign editor (desktop)",
        "Automation canvas",
        "Analytics/report",
        "Public pricing + in-app billing (side by side)",
      ],
      strengths: [
        "What felt faster or clearer than expected?",
        "Which workflow would you trust for a live send?",
      ],
      weaknesses: [
        "Where did you get stuck or confuse terminology?",
        "What feature felt gated, incomplete, or misleading vs marketing claims?",
      ],
      checklist: SHARED_MANUAL_CHECKLIST,
    };
  }

  if (categorySlug === "sales-intelligence") {
    return {
      objectives: [
        "Confirm search → enrich → list workflow on trial credits",
        "Inspect credit consumption and CRM/export paths",
        "Evaluate browser extension / overlay if offered",
        "Align in-app plan/credits with public pricing",
      ],
      account: [
        "Work email; LinkedIn account if extension required",
        "Trial with enough credits for 1–3 enrichments",
        "Do not spam or message real prospects during the test",
        "Use public/demo profiles only for overlay checks",
      ],
      workflows: [
        "Create account → onboarding",
        "People search with filters",
        "Company search + profile",
        "Enrich one test contact (credit use)",
        "Save list / draft sequence (no live send)",
        "CRM sync or CSV export",
        "Extension overlay if available",
        "Credits meter + help + pricing",
      ],
      pricing: [
        "Seat vs credit model clarity",
        "What actions consume credits",
        "Trial limits vs paid plan labels",
        "Public pricing page match",
      ],
      claims: [
        "Data accuracy of revealed emails/phones (spot-check)",
        "Filter quality for ICP search",
        "CRM export reliability",
        "Ease of getting a usable lead list",
      ],
      comparisons: [
        "Vs other SI tools: credit fairness and UI clarity",
        "Vs CRM native prospecting: data depth",
        "Would you buy for an SDR team of 3–10?",
      ],
      screenshots: [
        "People search results",
        "Company profile",
        "Enrichment / credit spend confirmation",
        "List or sequence builder",
        "Credits/usage meter",
        "Pricing page + in-app plan",
      ],
      strengths: [
        "What search/filter combo produced useful leads fastest?",
        "What felt trustworthy about data quality?",
      ],
      weaknesses: [
        "Where did credits or paywalls block evaluation?",
        "What data looked stale, wrong, or hard to verify?",
      ],
      checklist: SHARED_MANUAL_CHECKLIST,
    };
  }

  // CRM default
  return {
    objectives: [
      "Complete onboarding through first useful pipeline view",
      "Create contact, company, deal and move stages",
      "Configure one automation and one report",
      "Exercise search, admin, support paths, and pricing verify",
    ],
    account: [
      "Business email for trial signup",
      "Prefer plan that includes pipeline + automation (or note gates)",
      "Optional second user for permissions (else NOT_AVAILABLE)",
      "Sandbox/test data only — no production customer PII",
    ],
    workflows: [
      "Create account → onboarding",
      "Import sample contacts",
      "Create company → link contact",
      "Create/customize pipeline → create deal → move stages",
      "Simple automation",
      "Report/dashboard",
      "Email/integration if plan allows",
      "Search → permissions/mobile if available",
      "Admin settings → help/support",
      "Setup friction notes → verify pricing",
    ],
    pricing: [
      "Trial plan name vs public pricing tiers",
      "Seat limits, contact limits, automation gates",
      "Add-on / phone support friction",
      "In-app billing labels vs softwareglimpse pricing facts",
    ],
    claims: [
      "Ease of setup for SMB sales teams",
      "Pipeline UX and deal management clarity",
      "Automation usefulness on the tested plan",
      "Reporting quality",
      "Integration / email sync claims",
    ],
    comparisons: [
      "Vs HubSpot/Pipedrive-class peers: setup speed",
      "Vs spreadsheet/email-only: when is this worth paying for?",
      "Would you recommend for a 3–15 person sales team on this plan?",
    ],
    screenshots: [
      "Signup / onboarding step",
      "Contact list or import result",
      "Company record",
      "Pipeline board with deal",
      "Automation builder",
      "Report/dashboard",
      "Admin/settings",
      "Public pricing + in-app plan",
    ],
    strengths: [
      "What was surprisingly easy after signup?",
      "Which CRM workflow felt production-ready?",
    ],
    weaknesses: [
      "Where did onboarding or pipeline UX create friction?",
      "What important feature was missing, gated, or confusing?",
    ],
    checklist: SHARED_MANUAL_CHECKLIST,
  };
}

function estimateHumanMinutes(
  categorySlug: string,
  productSlug: string,
): PrepPack["estimatedHumanMinutes"] {
  const heavy = new Set(["hubspot", "salesforce", "activecampaign"]);
  if (heavy.has(productSlug)) {
    return {
      min: 45,
      max: 60,
      note: "Larger product surface — stick to required tasks; mark stretch as NOT_AVAILABLE/BLOCKED if timeboxed.",
    };
  }
  if (categorySlug === "sales-intelligence") {
    return {
      min: 30,
      max: 45,
      note: "Credits + one enrich + list/export is enough for express path.",
    };
  }
  if (categorySlug === "email-marketing") {
    return {
      min: 35,
      max: 50,
      note: "List → draft campaign → one automation → pricing is the core loop.",
    };
  }
  return {
    min: 35,
    max: 55,
    note: "CRM express: signup → contact/company/deal → one automation → admin/help → pricing.",
  };
}

function completionCriteriaFor(
  protocolSlug: string,
  requiredCount: number,
): string[] {
  return [
    `Session status reaches COMPLETE only via Finish (human) — never AI-simulated`,
    `All ${requiredCount} required protocol tasks recorded as PASS, PARTIAL, FAIL, NOT_AVAILABLE, NOT_APPLICABLE, or BLOCKED (none left NOT_STARTED)`,
    "At least one strength or weakness in the final assessment",
    "Human confirmation checkbox checked (I personally completed this test)",
    "Recommend HANDS_ON_TESTED only if the session genuinely supports a hands-on claim",
    "Screenshots uploaded for signup, core workflow, and pricing where possible",
    "setupMinutes / pricingObserved filled when observed",
    "Dependent review/comparison/best pages flagged after completion — do not auto-rewrite until then",
    `Protocol: ${protocolSlug}`,
  ];
}

async function probeSignupPath(website: string | null): Promise<{
  website: string | null;
  httpStatus: number | null;
  reachable: boolean | null;
  notes: string[];
}> {
  if (!website) {
    return {
      website: null,
      httpStatus: null,
      reachable: null,
      notes: [
        "No catalogue website URL — human must locate signup from vendor marketing site",
        "Prefer official trial/signup; record exact URL in session notes",
      ],
    };
  }
  const notes = [
    `Catalogue website: ${website}`,
    "Human must confirm a working trial/signup path (this probe only checks homepage reachability)",
    "Record plan chooser friction, card-required, and email verification steps in the create-account task",
  ];
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(website, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: { "user-agent": "SoftwareGlimpse-testing-prep/1.0" },
    });
    clearTimeout(timer);
    notes.push(
      res.ok
        ? `Homepage reachable (HTTP ${res.status}) — proceed to locate Trial/Sign up`
        : `Homepage returned HTTP ${res.status} — human may still reach signup; note blocker if blocked`,
    );
    return {
      website,
      httpStatus: res.status,
      reachable: res.ok,
      notes,
    };
  } catch (error) {
    notes.push(
      `Homepage probe failed (${error instanceof Error ? error.message : "error"}) — human verifies signup offline`,
    );
    return {
      website,
      httpStatus: null,
      reachable: false,
      notes,
    };
  }
}

function impactCopy(input: {
  impressions: number;
  comparisonCount: number;
  dependentCount: number;
  affiliateEnabled: boolean;
  evidenceLevel: string;
}): PrepPack["impact"] {
  const searchBits = [
    `${input.impressions} GSC impressions (demand signal)`,
    `${input.comparisonCount} comparison relationships`,
    `${input.dependentCount} dependent pages can absorb hands-on evidence after completion`,
    `Current evidence: ${input.evidenceLevel} → target hands_on_tested`,
  ];
  const commercialBits = [
    input.affiliateEnabled
      ? "Affiliate enabled — hands-on trust can improve conversion on commercial CTAs without changing ranking logic"
      : "No affiliate today — still high editorial/trust value for reviews and comps",
    "Do not invent revenue impact; prioritize by dependents + demand",
  ];
  return {
    search: searchBits.join(". ") + ".",
    commercial: commercialBits.join(". ") + ".",
  };
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const createDrafts = args.includes("--create-drafts");
  const queue = buildProductTestingQueue(10);

  const packs: PrepPack[] = [];
  for (const item of queue.items) {
    const soft = getSoftwareBySlug(item.productSlug, {
      includeUnpublished: true,
    });
    const categorySlug =
      soft?.primaryCategorySlug ?? item.categorySlug ?? "crm";
    const protocol = resolveProtocolForProduct({ categorySlug });
    const guidance = packForCategory(categorySlug);
    const deps = resolveAffectedPages(item.productSlug).map((d) => ({
      path: d.path,
      pageType: d.pageType,
    }));
    const dependentsByFamily = groupDependents(deps);
    const requiredTaskCount = protocol.tasks.filter(
      (t) => t.required !== false,
    ).length;
    const signupPath = await probeSignupPath(soft?.website ?? null);

    let draftSessionId: string | null = null;
    if (createDrafts) {
      const existing = listTestSessionsForProduct(item.productSlug).find(
        (s) =>
          s.status === "draft" ||
          s.status === "in_progress" ||
          s.status === "blocked",
      );
      if (existing) {
        draftSessionId = existing.id;
      } else {
        const session = createTestSession({
          productSlug: item.productSlug,
          productId: soft?.id,
          protocolSlug: protocol.slug,
          testScenario: `Top-10 hands-on wave ${WAVE_DATE} — human tester only; all tasks start NOT_STARTED`,
          testEnvironment: "To be filled by tester (browser / OS / region)",
        });
        draftSessionId = session.id;
      }
    }

    packs.push({
      rank: item.rank,
      productSlug: item.productSlug,
      productName: soft?.name ?? item.productName,
      categorySlug,
      protocolSlug: protocol.slug,
      evidenceLevel: item.evidenceLevel,
      priorityScore: item.evidencePriorityScore,
      impressions: item.impressions,
      comparisonCount: item.comparisonCount,
      affiliateEnabled: Boolean(soft?.affiliate?.enabled),
      estimatedHumanMinutes: estimateHumanMinutes(
        categorySlug,
        item.productSlug,
      ),
      protocolTaskCount: protocol.tasks.length,
      requiredTaskCount,
      protocolTasks: protocol.tasks.map((t) => ({
        id: t.id,
        slug: t.slug,
        title: t.title,
        description: t.description,
        required: t.required !== false,
        evidenceHints: t.evidenceHints,
        screenshotsRequired: t.evidenceHints.includes("SCREENSHOT"),
      })),
      completionCriteria: completionCriteriaFor(
        protocol.slug,
        requiredTaskCount,
      ),
      signupPath,
      testObjectives: guidance.objectives,
      accountRequirements: guidance.account,
      workflows: guidance.workflows,
      pricingChecks: guidance.pricing,
      claimsToVerify: guidance.claims,
      comparisonQuestions: guidance.comparisons,
      screenshotsRequired: guidance.screenshots,
      strengthPrompts: guidance.strengths,
      weaknessPrompts: guidance.weaknesses,
      manualChecklist: guidance.checklist,
      dependentPages: deps,
      dependentCount: deps.length,
      dependentsByFamily,
      impact: impactCopy({
        impressions: item.impressions,
        comparisonCount: item.comparisonCount,
        dependentCount: deps.length,
        affiliateEnabled: Boolean(soft?.affiliate?.enabled),
        evidenceLevel: item.evidenceLevel,
      }),
      draftSessionId,
    });
  }

  const outDir = path.join(ROOT, "data/editorial/testing/packs", WAVE_DATE);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(
    path.join(outDir, "top-10.json"),
    `${JSON.stringify({ generatedAt: new Date().toISOString(), createDrafts, packs }, null, 2)}\n`,
    "utf8",
  );

  const md: string[] = [
    `# Hands-on testing wave — top 10 (${WAVE_DATE})`,
    "",
    "Human tester only. **AI must never mark tasks complete or fabricate observations.**",
    "HANDS_ON_TESTED is assigned only after a completed human session with all required tasks recorded, strengths/weaknesses filled, and **explicit human confirmation**.",
    "",
    "## Workspace",
    "",
    "1. Open `/dev/product-testing/?secret=$TESTING_SECRET`",
    "2. Pick a product from the **Top 10 queue** panel (or use a prepared draft session)",
    "3. Session: **START** → **IN_PROGRESS** (or **BLOCKED** / Resume) → **COMPLETE** via Finish",
    "4. Per task: PASS / PARTIAL / FAIL / NOT_AVAILABLE / NOT_APPLICABLE / **BLOCKED** (never leave required tasks NOT_STARTED)",
    "5. Capture notes, screenshots, time spent, unexpected findings, strengths, weaknesses, pricing observations",
    "6. Check **I personally completed this test** → **Finish test (human only)**",
    "",
    "No task auto-passes. Incomplete/abandoned/blocked sessions stay private. Dependents are flagged after completion — **do not auto-rewrite** until then.",
    "",
    "## Express path (~30–60 minutes)",
    "",
    "Complete **required** protocol tasks only. Mark stretch tasks NOT_AVAILABLE/BLOCKED when timeboxed. Prefer one clean end-to-end workflow over exhaustive coverage.",
    "",
    "## Selection criteria",
    "",
    "REAL GSC demand · affiliate value · dependent comparisons · category importance · evidence gap.",
    "",
    "| Rank | Product | Priority | Est. min | Protocol | Evidence | GSC | Aff | Dependents | Impact |",
    "| ---: | --- | ---: | --- | --- | --- | ---: | --- | ---: | --- |",
  ];

  for (const p of packs) {
    const impactShort = p.affiliateEnabled
      ? "search+affiliate"
      : "search/trust";
    md.push(
      `| ${p.rank} | [${p.productName}](/software/${p.productSlug}/) | ${Math.round(p.priorityScore)} | ${p.estimatedHumanMinutes.min}–${p.estimatedHumanMinutes.max} | \`${p.protocolSlug}\` (${p.requiredTaskCount}/${p.protocolTaskCount} req) | ${p.evidenceLevel} | ${p.impressions} | ${p.affiliateEnabled ? "yes" : "no"} | ${p.dependentCount} | ${impactShort} |`,
    );
  }

  md.push("", "## Per-product packs", "");

  for (const p of packs) {
    md.push(`### ${p.rank}. ${p.productName} (\`${p.productSlug}\`)`);
    md.push("");
    md.push(
      `Protocol: **${p.protocolSlug}** · Evidence today: **${p.evidenceLevel}** · Est. human time: **${p.estimatedHumanMinutes.min}–${p.estimatedHumanMinutes.max} min** · Draft session: ${p.draftSessionId ?? "_create in workspace_"}`,
    );
    md.push("");
    md.push(`_${p.estimatedHumanMinutes.note}_`);
    md.push("");
    md.push("**Signup / test account path**");
    for (const x of p.signupPath.notes) md.push(`- ${x}`);
    md.push(
      `- Probe: reachable=${String(p.signupPath.reachable)} http=${String(p.signupPath.httpStatus)}`,
    );
    md.push("");
    md.push("**Completion criteria**");
    for (const x of p.completionCriteria) md.push(`- ${x}`);
    md.push("");
    md.push("**Protocol tasks (concrete)**");
    for (const t of p.protocolTasks) {
      md.push(
        `- ${t.required ? "**REQ**" : "opt"} \`${t.slug}\` — ${t.title}: ${t.description}`,
      );
      md.push(
        `  - Evidence: ${t.evidenceHints.join(", ") || "notes"}${t.screenshotsRequired ? " · screenshot required when feasible" : ""}`,
      );
    }
    md.push("");
    md.push("**Test objectives**");
    for (const x of p.testObjectives) md.push(`- ${x}`);
    md.push("");
    md.push("**Account / signup requirements**");
    for (const x of p.accountRequirements) md.push(`- ${x}`);
    md.push("");
    md.push("**Workflows**");
    for (const x of p.workflows) md.push(`- ${x}`);
    md.push("");
    md.push("**Pricing checks**");
    for (const x of p.pricingChecks) md.push(`- ${x}`);
    md.push("");
    md.push("**Important claims to verify**");
    for (const x of p.claimsToVerify) md.push(`- ${x}`);
    md.push("");
    md.push("**Comparison questions / notes prompts**");
    for (const x of p.comparisonQuestions) md.push(`- ${x}`);
    md.push("");
    md.push("**Screenshots required (session-level)**");
    for (const x of p.screenshotsRequired) md.push(`- ${x}`);
    md.push("");
    md.push("**Manual testing checklist (human)**");
    for (const section of p.manualChecklist) {
      md.push(`- **${section.area}**`);
      for (const item of section.items) md.push(`  - ${item}`);
    }
    md.push("");
    md.push("**Strength prompts**");
    for (const x of p.strengthPrompts) md.push(`- ${x}`);
    md.push("");
    md.push("**Weakness / friction prompts**");
    for (const x of p.weaknessPrompts) md.push(`- ${x}`);
    md.push("");
    md.push("**Potential impact (after genuine completion)**");
    md.push(`- Search: ${p.impact.search}`);
    md.push(`- Commercial: ${p.impact.commercial}`);
    md.push("");
    md.push(
      `**Pages that may use hands-on evidence after genuine completion** (${p.dependentCount}) — do **not** rewrite until the human test exists:`,
    );
    md.push(
      `- Reviews / pricing: ${p.dependentsByFamily.reviews.length} — ${p.dependentsByFamily.reviews.slice(0, 8).join(", ") || "_none_"}`,
    );
    md.push(
      `- Comparisons / alternatives: ${p.dependentsByFamily.comparisons.length} — sample: ${p.dependentsByFamily.comparisons.slice(0, 6).join(", ") || "_none_"}`,
    );
    md.push(
      `- Best pages: ${p.dependentsByFamily.best.length} — ${p.dependentsByFamily.best.slice(0, 8).join(", ") || "_none_"}`,
    );
    md.push(
      `- Guides: ${p.dependentsByFamily.guides.length} — sample: ${p.dependentsByFamily.guides.slice(0, 6).join(", ") || "_none_"}`,
    );
    if (p.dependentsByFamily.other.length > 0) {
      md.push(
        `- Other: ${p.dependentsByFamily.other.length} — ${p.dependentsByFamily.other.slice(0, 6).join(", ")}`,
      );
    }
    md.push(
      `- Full list: \`data/editorial/testing/packs/${WAVE_DATE}/top-10.json\` → \`${p.productSlug}\``,
    );
    md.push("");
  }

  md.push("## After genuine completion");
  md.push("");
  md.push(
    "Propagation flags dependent refresh tasks only. Editorial rewrites wait for human evidence — see `docs/editorial/PRODUCT-TESTING-REFRESH-TASKS.md` after finish.",
  );
  md.push("");
  md.push("## Integrity");
  md.push("");
  md.push(
    "- AI must **not** auto-complete, simulate, or fabricate any test result.",
  );
  md.push(
    "- Draft sessions start with every protocol task `NOT_STARTED`; completion requires human PASS/PARTIAL/FAIL/NOT_AVAILABLE/NOT_APPLICABLE/BLOCKED plus strengths/weaknesses plus human confirmation.",
  );
  md.push(
    "- `HANDS_ON_TESTED` is assigned only after a completed human session that recommends the claim **and** confirms personal completion.",
  );
  md.push("");

  const docPath = path.join(
    ROOT,
    "docs/editorial",
    `HANDS-ON-TESTING-WAVE-TOP-10-${WAVE_DATE}.md`,
  );
  writeFileSync(docPath, `${md.join("\n")}\n`, "utf8");

  console.log(`Prepared ${packs.length} products`);
  console.log(`Wrote ${docPath}`);
  console.log(`Wrote ${path.join(outDir, "top-10.json")}`);
  if (createDrafts) {
    console.log(
      `Draft sessions: ${packs.filter((p) => p.draftSessionId).length} (all tasks NOT_STARTED)`,
    );
  } else {
    console.log("No draft sessions created (pass --create-drafts to seed drafts)");
  }

  console.log("\n## Top 10 summary");
  for (const p of packs) {
    console.log(
      `${p.rank}. ${p.productSlug} | ${p.estimatedHumanMinutes.min}-${p.estimatedHumanMinutes.max}m | deps=${p.dependentCount} | signup=${p.signupPath.reachable ? "ok" : "check"} | draft=${p.draftSessionId ?? "none"}`,
    );
  }
}

void main();
