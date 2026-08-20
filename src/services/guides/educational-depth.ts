import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { TEACHING_SPECS } from "@/data/seed/guides-teaching-specs";
import {
  GUIDE_MIN_PROSE_WORDS,
  GUIDE_NEAR_COMPLETE_WORDS,
  proseWordsFromBlocks,
} from "./guide-prose";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

function specFor(guide: GuidePage) {
  const slug = guide.categorySlugs[0];
  return TEACHING_SPECS.find((s) => s.categorySlug === slug);
}

function insertBeforeTerminal(
  blocks: GuideBlockInput[],
  extra: GuideBlockInput[],
): GuideBlockInput[] {
  const terminal = blocks.findIndex(
    (b) =>
      b.type === "faq" ||
      b.type === "interactive-cta" ||
      b.type === "related-content",
  );
  if (terminal === -1) return [...blocks, ...extra];
  return [...blocks.slice(0, terminal), ...extra, ...blocks.slice(terminal)];
}

function nextStepNumber(blocks: GuideBlockInput[]): number {
  const steps = blocks.filter((b) => b.type === "step");
  return steps.length + 1;
}

function pillarDepthBlocks(guide: GuidePage): GuideBlockInput[] {
  const spec = specFor(guide);
  const category = spec?.name ?? "this category";
  const chooseSlug = spec?.howToChooseSlug ?? guide.relatedGuideSlugs[0];
  const chooseHref = chooseSlug ? `/guides/${chooseSlug}/` : "/guides/";
  const topic = guide.topicType ?? "explainer";
  const n = nextStepNumber(guide.blocks as GuideBlockInput[]);

  if (topic === "pricing-education") {
    return [
      {
        type: "step",
        id: "depth-quote-compare",
        stepNumber: n,
        heading: "Compare written quotes on the same assumptions",
        body: `For every finalist in ${category}, fill one sheet: headcount or list size, must-have gates, usage units you will actually hit, and integrations that must work on day one. Ask each vendor which plan qualifies — then compare those plans only, not homepage tiles.\n\nWorked example: Harbor Ops models the same seat count and credit band for three AI assistants. Vendor A’s personal tier looks cheaper until Business unlocks connectors; Vendor B’s team pack looks expensive until overage on Vendor A is included. The honest compare is qualifying configuration × usage — documented in writing.`,
        tip: "Screenshot the plan name from the demo — sales teams often show tiers above the “from” tile.",
        scenarios: [
          {
            title: "Same headcount",
            body: "Every quote uses the same people who need access — not a pilot subset.",
          },
          {
            title: "Same usage band",
            body: "Credits, tokens, GPU hours, or send caps modeled at realistic volume.",
          },
          {
            title: "Same gates",
            body: "SSO, agents, stealth modes, or automation depth unlock on named tiers.",
          },
        ],
      },
      {
        type: "step",
        id: "depth-first-quarter",
        stepNumber: n + 1,
        heading: "Budget the first quarter, not the teaser month",
        body: `Starter tiles optimize for sign-up, not your first 90 days at real scale. Include list or seat growth, seasonal spikes, overage triggers, and add-on SKUs (Copilot layers, credit packs, dedicated IP) before you ask finance to approve spend.\n\nWorked example: Northline Studio adds 20% buffer to image-credit usage for a campaign launch and keeps annual vs monthly side by side when GPU spikes are likely.`,
        tip: "If overage kicks in above a threshold, model one busy month — not average usage only.",
      },
      {
        type: "step",
        id: "depth-handoff",
        stepNumber: n + 2,
        heading: "Hand off to selection with frozen assumptions",
        body: `When quotes are comparable, move to the selection framework with must-haves frozen. Rank finalists on fit for the weekly job, governance, and the total you modeled — not affiliate availability or brand familiarity.\n\nNext: ${chooseHref}`,
        tip: "Do not re-open requirements during demos — that resets every quote.",
      },
    ];
  }

  if (topic === "requirements" || topic === "requirements-guide") {
    return [
      {
        type: "step",
        id: "depth-must-nice",
        stepNumber: n,
        heading: "Split must-haves from nice-to-haves in writing",
        body: `List day-one workflows for ${category} in two columns: must work before go-live vs can wait until adoption proves out. Must-haves drive plan gates and integrations; nice-to-haves belong on a phase-two sheet so demos do not inflate scope.\n\nWorked example: Harbor People Ops marks SSO and audit logs as must-have, AI summaries as phase-two. Demos that skip the must column get cut from the shortlist early.`,
        tip: "If a feature is not tied to a weekly ritual, it is probably nice-to-have.",
      },
      {
        type: "step",
        id: "depth-integrations",
        stepNumber: n + 1,
        heading: "Map integrations and data boundaries",
        body: `Name systems that must sync or stay out of scope: identity, payroll, CRM, ecommerce, chat, or data warehouse. For each integration, note whether it is native, API, or manual export — and who owns the connection when it breaks.\n\nWorked example: Northline Finance requires HRIS sync to payroll and refuses tools that need nightly CSV babysitting unless IT signs off.`,
        tip: "An integration marked “available” on a marketing page is not the same as configured in your tenant.",
      },
      {
        type: "step",
        id: "depth-signoff",
        stepNumber: n + 2,
        heading: "Get a one-page sign-off before trials",
        body: `Share the must-have sheet with finance, IT, and the team lead who owns the weekly job. Trials should test the signed sheet — not a fresh wishlist from each demo.\n\nNext: ${chooseHref}`,
        tip: "Unsigned requirements sheets become post-purchase arguments.",
      },
    ];
  }

  if (topic === "evaluation" || topic === "evaluation-guide") {
    return [
      {
        type: "step",
        id: "depth-trial-script",
        stepNumber: n,
        heading: "Run one trial script on every finalist",
        body: `Pick the workflow that blocked work last quarter. Run it on every shortlist tool the same week: same data shape, same users, same success criteria. Score completion, time-to-done, and where an admin had to rescue the task.\n\nWorked example: Harbor Labs runs the same refactor ticket on three coding tools. Tool C fails SSO on the quoted tier and is dropped before a second meeting.`,
        tip: "Ban “coolest AI feature” as agenda item one.",
      },
      {
        type: "step",
        id: "depth-scorecard",
        stepNumber: n + 1,
        heading: "Score on one card the same day",
        body: `Use the same rubric for every vendor: must-have gates, adoption risk, integration fit, and modeled total cost band. Record who attended and which plan tier was shown — demos often run above the tier you can afford.`,
        tip: "Scores written a week later rewrite history.",
      },
      {
        type: "step",
        id: "depth-decision-memo",
        stepNumber: n + 2,
        heading: "Write a one-page decision memo",
        body: `Name the primary job, the qualifying configuration, the winner, and what you are explicitly not buying yet. Link to pricing and requirements guides so finance can audit assumptions later.\n\nNext: ${chooseHref}`,
        tip: "If the memo cannot explain why #2 lost, the trial was not fair.",
      },
    ];
  }

  if (topic === "selection" || topic === "buying-guide") {
    return [
      {
        type: "step",
        id: "depth-shortlist",
        stepNumber: n,
        heading: "Shortlist only inside the same job cluster",
        body: `Compare tools whose core product matches the weekly output you named. Adjacent tools can integrate later — they should not hijack the primary shortlist because of brand familiarity.\n\nWorked example: A team that needs meeting transcripts shortlists Otter-class tools, not a general chat assistant, even if the chat tool also “does meetings.”`,
        tip: "Mixed-cluster shortlists produce mixed demos and no decision.",
      },
      {
        type: "step",
        id: "depth-trial",
        stepNumber: n + 1,
        heading: "Trial the named workflow before signatures",
        body: `Run the same script on two or three finalists. Success is a non-admin completing the weekly output without a rescue — not a polished vendor tour.`,
        tip: "Pilot length should cover one full weekly cycle at minimum.",
      },
    ];
  }

  if (guide.slug.startsWith("how-") && guide.slug.includes("-works")) {
    const loop = spec?.loop ?? [];
    return [
      {
        type: "step",
        id: "depth-loop-walk",
        stepNumber: n,
        heading: "Walk the loop in order",
        body: spec
          ? `${spec.loopBody}\n\nSteps: ${loop.map((s) => s.label).join(" → ")}.`
          : `Walk each step of the operating loop in order before you compare vendors.`,
        tip: spec?.loopTip ?? "Skipping governance or review steps multiplies cost later.",
      },
      {
        type: "step",
        id: "depth-loop-example",
        stepNumber: n + 1,
        heading: "Pressure-test with one worked example",
        body:
          spec?.loopExample ??
          `Worked example: name one team, one weekly output, and where the loop breaks today without software.`,
        tip: "If you cannot name the weekly output, pause buying.",
      },
      {
        type: "step",
        id: "depth-choose-handoff",
        stepNumber: n + 2,
        heading: "Hand off to the selection framework",
        body: `Use the loop to write must-haves, then shortlist in ${chooseHref}.`,
        tip: "The loop is the requirements sheet in plain language.",
      },
    ];
  }

  if (guide.slug.startsWith("types-of-")) {
    const shapes = spec?.shapes ?? [];
    return [
      {
        type: "step",
        id: "depth-pick-shape",
        stepNumber: n,
        heading: "Pick the shape that matches the blocking job",
        body:
          shapes.length > 0
            ? `Common shapes in ${category}:\n${shapes
                .slice(0, 4)
                .map(
                  (s) =>
                    `• ${s.title}: best when ${s.bestFor} Avoid when ${s.avoidWhen}`,
                )
                .join("\n")}`
            : `Name the primary job before comparing shapes in ${category}.`,
        tip: "Two shapes in one purchase usually means two tools — not one “suite.”",
      },
      {
        type: "step",
        id: "depth-shape-proof",
        stepNumber: n + 1,
        heading: "Prove the shape with one workflow",
        body: `Run a single real workflow that only that shape should solve. If the workflow spans two shapes, split the purchase decision.`,
        tip: "Marketing “all-in-one” labels do not change the underlying job cluster.",
      },
    ];
  }

  if (guide.slug.includes("-vs-")) {
    return [
      {
        type: "step",
        id: "depth-vs-decision",
        stepNumber: n,
        heading: "Use a when-this / when-other decision rule",
        body: spec?.vs
          ? `${spec.vs.difference}\n\nChoose ${category} when ${spec.vs.whenThis} Choose ${spec.vs.otherName} when ${spec.vs.whenOther}`
          : `Write one sentence for when each product category is the primary purchase.`,
        tip: "Integration partners are not substitutes for the core job.",
      },
      {
        type: "step",
        id: "depth-vs-example",
        stepNumber: n + 1,
        heading: "Worked example: same company, two purchases",
        body: `Harbor Ops buys customer-service software for ticket SLAs and a separate CRM for pipeline — they integrate, but neither replaces the other's core job.`,
        tip: "If both tools “could work,” you have not named the primary job yet.",
      },
    ];
  }

  // what-is and other explainers
  return [
    {
      type: "step",
      id: "depth-what-is-job",
      stepNumber: n,
      heading: `Name the job ${category} should own`,
      body: spec
        ? `${spec.loopBody}\n\n${spec.loopExample ?? ""}`
        : `Describe the weekly output ${category} must improve before comparing vendors.`,
      tip: spec?.loopTip ?? "Job clarity beats feature checklists.",
    },
    {
      type: "step",
      id: "depth-what-is-next",
      stepNumber: n + 1,
      heading: "Next: freeze requirements and compare fairly",
      body: `Move to ${chooseHref} once the job cluster is clear. Compare finalists with the same assumptions — not affiliate-ordered lists.`,
      tip: "Category fundamentals come before brand shortlists.",
    },
  ];
}

function genericFallbackBlocks(
  guide: GuidePage,
  pass: number,
  startNum: number,
): GuideBlockInput[] {
  const title = guide.title;
  const category = guide.categorySlugs[0] ?? "software";
  return [
    {
      type: "step",
      id: `depth-gen-${pass}-checklist`,
      stepNumber: startNum,
      heading: "Use a one-page checklist before demos",
      body: `For ${title}, list must-haves, owners, integrations, and the weekly ritual this purchase must improve. Share the sheet with finance and IT before you schedule a second demo.\n\n1. Name the primary job in one sentence.\n2. List must-have gates (plans, SSO, data residency, usage caps).\n3. Name integrations that must work on day one.\n4. Assign an admin owner and a weekly user champion.\n5. Define non-admin proof — what a sceptic completes without rescue.\n\nWorked example: Harbor Ops refuses demos until the checklist is signed — cutting evaluation time in half.`,
      tip: "Unsigned checklists become post-purchase arguments.",
    },
    {
      type: "step",
      id: `depth-gen-${pass}-mistakes`,
      stepNumber: startNum + 1,
      heading: "Avoid the usual buying mistakes",
      body: `Common failures in ${category}: buying for brand familiarity, comparing entry tiles across different usage units, skipping a fair trial script, and adding scope before adoption proves out.\n\nRun one trial script on every finalist the same week. Score on the same card. Write a one-paragraph decision memo that names what you are not buying yet.`,
      tip: "If finalists never ran the same workflow, the decision is not fair.",
    },
    {
      type: "step",
      id: `depth-gen-${pass}-handoff`,
      stepNumber: startNum + 2,
      heading: "Hand off to the category shortlist",
      body: `When assumptions are frozen, continue on /best/${category}-software/ with the same headcount, usage band, and must-have gates on every quote.`,
      tip: "Commercial detail lives on pricing pages — not in this teaching guide.",
    },
  ];
}

/** Expand thin educational guides to the editorial minimum (~5 min prose). */
export function withEducationalDepth(guide: GuidePage): GuidePage {
  const blocks = [...(guide.blocks ?? [])] as GuideBlockInput[];
  if (proseWordsFromBlocks(blocks, guide.summary) >= GUIDE_MIN_PROSE_WORDS) {
    return guide;
  }

  let expanded = blocks;
  for (let pass = 0; pass < 4; pass += 1) {
    if (proseWordsFromBlocks(expanded, guide.summary) >= GUIDE_MIN_PROSE_WORDS) {
      break;
    }
    const prefix = pass === 0 ? "depth" : `depth-gen-${pass}`;
    if (
      expanded.some(
        (b) =>
          b.type === "step" &&
          String(b.id ?? "").startsWith(
            pass === 0 ? "depth-" : `depth-gen-${pass}-`,
          ),
      )
    ) {
      continue;
    }
    const extra =
      pass === 0
        ? pillarDepthBlocks({ ...guide, blocks: expanded as GuidePage["blocks"] })
        : genericFallbackBlocks(
            guide,
            pass,
            expanded.filter((b) => b.type === "step").length + 1,
          );
    expanded = insertBeforeTerminal(expanded, extra);
  }

  const words = proseWordsFromBlocks(expanded, guide.summary);
  if (
    words >= GUIDE_NEAR_COMPLETE_WORDS &&
    words < GUIDE_MIN_PROSE_WORDS &&
    !expanded.some((b) => b.id === "depth-topup")
  ) {
    expanded = insertBeforeTerminal(expanded, [
      {
        type: "step",
        id: "depth-topup",
        stepNumber: expanded.filter((b) => b.type === "step").length + 1,
        heading: "Before you schedule another demo",
        body: `Freeze the must-have sheet for ${guide.title}, assign an admin owner, and run the same trial script on every finalist. Link commercial detail to category pricing guides and /best/${guide.categorySlugs[0] ?? "software"}-software/ when assumptions are locked.`,
        tip: "Re-opening requirements mid-trial resets every quote.",
      },
      {
        type: "step",
        id: "depth-topup-2",
        stepNumber: expanded.filter((b) => b.type === "step").length + 2,
        heading: "Write the decision memo",
        body: `Name the primary job, the qualifying configuration, and what you are deferring until adoption proves out. One paragraph is enough — if you cannot explain why the #2 finalist lost, rerun the trial fairly.`,
        tip: "Memos beat slide decks for finance and IT review.",
      },
    ]);
  }

  return {
    ...guide,
    blocks: expanded as GuidePage["blocks"],
  };
}
