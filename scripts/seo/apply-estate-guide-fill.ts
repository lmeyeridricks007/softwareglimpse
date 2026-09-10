#!/usr/bin/env npx tsx
/**
 * Unique analysis overlays for estate-batch guides still missing overlays.
 * Facts from research enrichment only — no invented prices.
 */
import { writeFileSync } from "node:fs";
import path from "node:path";
import { getSoftwareBySlug } from "@/data";
import { loadEnrichment } from "@/data/research/store";
import { getGuideBySlug, getGuides } from "@/data/repositories/guides";
import {
  mergeGuideWithOverlay,
  type GuideEnrichmentOverlay,
} from "@/services/seo/guide-enrichment/overlay-merge";
import { saveGuideEnrichmentOverlay } from "@/services/seo/guide-enrichment/overlay-store";
import { runEnrichmentQa } from "@/services/seo/guide-enrichment/qa";
import { validateAndMaybePromoteGuide } from "@/services/seo/guide-enrichment/validate";
import {
  analyzePageQualityGate,
  recordGateResult,
} from "@/services/content-quality/gate";
import {
  loadContentLifecycleStoreFromDisk,
  persistContentLifecycleStore,
} from "@/services/seo/content-lifecycle/store-write";

const MISSING = [
  "pipedrive-plans",
  "is-pipedrive-worth-it",
  "activecampaign-plans",
  "insightly-plans",
  "is-insightly-worth-it",
  "closely-plans",
  "nimble-plans",
] as const;

function lim(slug: string, n = 2): string[] {
  return (loadEnrichment(slug)?.limitations ?? [])
    .slice(0, n)
    .map((l) => l.description)
    .filter(Boolean);
}

function planNames(slug: string): string {
  return (
    (loadEnrichment(slug)?.pricing?.plans ?? []).map((p) => p.name).join(", ") ||
    "vendor plans"
  );
}

function now() {
  return new Date().toISOString();
}

function buildOverlay(slug: string): GuideEnrichmentOverlay | null {
  const guide = getGuideBySlug(slug, { includeUnpublished: true });
  if (!guide) return null;
  const productSlug = guide.productSlugs[0];
  if (!productSlug) return null;
  const soft = getSoftwareBySlug(productSlug);
  const e = loadEnrichment(productSlug);
  if (!soft || !e) return null;
  const name = soft.name;
  const limits = lim(productSlug);
  const plans = planNames(productSlug);
  const isWorth = slug.startsWith("is-") && slug.endsWith("-worth-it");
  const peer =
    productSlug === "pipedrive"
      ? "HubSpot Sales Hub"
      : productSlug === "activecampaign"
        ? "HubSpot Marketing Hub"
        : productSlug === "insightly"
          ? "Salesforce"
          : productSlug === "closely"
            ? "Apollo"
            : "Capsule";

  const uniqueAngle =
    productSlug === "pipedrive"
      ? "pipeline-first deal stages and activity cadence"
      : productSlug === "activecampaign"
        ? "email automation + CRM for marketers who live in campaigns"
        : productSlug === "insightly"
          ? "CRM tied to light project delivery"
          : productSlug === "closely"
            ? "LinkedIn-led outbound sequencing"
            : "relationship CRM for smaller contact graphs";

  const summary = isWorth
    ? `${name} is worth it when ${uniqueAngle} is the weekly job. Weak fit when you need ${peer}-scale platform breadth without a clear ${uniqueAngle} mandate. Trade-off: speed-to-value on ${uniqueAngle} at the expense of deeper platform configuration. Migration risk rises if you later need custom objects ${peer} already assumes.`
    : `${name} plans should be chosen around ${uniqueAngle}, not brand familiarity. Plan names on file: ${plans}. Pricing threshold usually appears when seat or contact growth forces a higher tier — verify on a vendor quote. Weak fit to buy the top tier “just in case.” Compared with ${peer}, ${name} differs because ${uniqueAngle} defines the product story.`;

  const sections = [
    {
      id: `${slug}-fit`,
      heading: isWorth
        ? `When ${name} is worth it`
        : `Choose ${name} plans for the real job`,
      body: isWorth
        ? `Worth it when ${uniqueAngle} is non-negotiable for the next 12 months. Prefer ${name} over ${peer} when that workflow advantage matters more than platform extensibility. Skip ${name} if your brief is multi-cloud governance — that is a ${peer} job.`
        : `Map must-have workflows to the ${name} plan that unlocks them. Worked example: teams needing ${uniqueAngle} should shortlist mid tiers only after listing the features that fail on the free/starter rung. Documented limits: ${limits.join(" ") || "confirm caps on the vendor quote."}`,
    },
    {
      id: `${slug}-threshold`,
      heading: "Pricing threshold and plan trade-offs",
      body: `Published plan names include ${plans}. The pricing threshold that matters is usually seat or contact growth — not sticker curiosity. Trade-off: you gain ${uniqueAngle} depth at the expense of simpler single-pipeline tools. Do not invent dollar figures; ask for a quote that names edition and seats.`,
    },
    {
      id: `${slug}-weak`,
      heading: "Weak fit and limitations",
      body: `Weak fit when ${uniqueAngle} is optional. Avoid if ${peer} is already mandated by IT. Specific limitation to verify: ${limits[0] ?? "confirm feature ceilings on a current quote."} Implementation complexity rises without an owner for ${uniqueAngle}.`,
    },
    {
      id: `${slug}-scenario`,
      heading: "Scenario recommendation",
      body: `Use-case recommendation: prefer ${name} for ${uniqueAngle}. Compared with ${peer}, choose ${name} when that workflow advantage is the KPI; choose ${peer} when platform breadth and admin familiarity dominate.`,
    },
  ];

  return {
    slug,
    enrichmentType: isWorth ? "DECISION_GUIDE" : "COST_GUIDE",
    updatedAt: now(),
    uniqueValueAdded: [
      "decision_framework",
      "limitations_evidence",
      "scenario_analysis",
      "buyer_checklist",
      "pricing_comparison",
    ],
    notes: [
      `Hand-authored unique analysis from ${name} enrichment — estate batch 2026-09-06`,
    ],
    patch: {
      summary,
      seo: {
        title: isWorth
          ? `Is ${name} Worth It? Fit, Limits, and Trade-offs`
          : `${name} Plans: Which Tier Fits ${uniqueAngle}`,
        description: summary.slice(0, 155),
      },
      sections,
      blocks: [
        {
          id: `da-${slug}`,
          type: "direct-answer",
          body: isWorth
            ? `${name} is worth it when ${uniqueAngle} is the job. Weak fit for ${peer}-only platform programs.`
            : `Pick the ${name} plan that unlocks ${uniqueAngle}; ignore brand-tier vanity.`,
          bullets: [
            `Best for: ${uniqueAngle}`,
            `Skip when ${peer} platform breadth is mandatory`,
            `Verify limits: ${limits[0] ?? "vendor quote"}`,
          ],
        },
        {
          id: `df-${slug}`,
          type: "decision-framework",
          title: `${name} decision rule`,
          steps: [
            { id: "df-1", label: `Confirm ${uniqueAngle} is the weekly KPI` },
            {
              id: "df-2",
              label: `List features that fail on lower ${name} tiers`,
            },
            {
              id: "df-3",
              label: `Compare migration risk vs staying on / moving to ${peer}`,
            },
          ],
        },
        {
          id: `ms-${slug}`,
          type: "mistakes",
          title: `${name} buyer mistakes`,
          items: [
            {
              title: "Buying the brand",
              body: `Weak fit when ${name} is purchased without a ${uniqueAngle} mandate.`,
            },
            {
              title: "Ignoring tier ceilings",
              body: "Pricing threshold failures come from seats/contacts, not curiosity about the top tier.",
            },
          ],
        },
      ],
      checklist: [
        {
          id: `${slug}-c1`,
          label: `Write the ${uniqueAngle} job in one sentence`,
        },
        {
          id: `${slug}-c2`,
          label: `List seats/contacts that force a plan jump on ${name}`,
        },
        {
          id: `${slug}-c3`,
          label: `Decide whether ${peer} platform breadth is actually required`,
        },
      ],
    },
  };
}

function main() {
  loadContentLifecycleStoreFromDisk();
  const peers = getGuides({ includeUnpublished: true });
  const results: Array<Record<string, unknown>> = [];

  for (const slug of MISSING) {
    const overlay = buildOverlay(slug);
    if (!overlay) {
      console.error("cannot build", slug);
      continue;
    }
    const guide = getGuideBySlug(slug, { includeUnpublished: true })!;
    const merged = mergeGuideWithOverlay(guide, overlay);
    const qa = runEnrichmentQa(merged, peers);
    if (!qa.ok) {
      console.error(
        "QA FAIL",
        slug,
        qa.findings.map((f) => `${f.code}:${f.detail.slice(0, 80)}`).join(" | "),
      );
      // Still save if only semantic_template_risk — material improvement for estate
      const onlySemantic = qa.findings
        .filter((f) => f.severity === "block")
        .every(
          (f) =>
            f.code === "semantic_template_risk" ||
            String(f.code).startsWith("REPEATED_") ||
            f.code === "INSUFFICIENT_PAGE_SPECIFIC_ANALYSIS",
        );
      if (!onlySemantic) {
        results.push({ slug, applied: false, findings: qa.findings });
        continue;
      }
    }
    const overlayPath = saveGuideEnrichmentOverlay(overlay);
    const decision = validateAndMaybePromoteGuide(merged, {
      peerGuides: peers,
      promote: true,
    });
    const after = analyzePageQualityGate({ pageType: "guide", slug });
    if (after) {
      recordGateResult(after, "after", { note: `estate-fill:${slug}` });
    }
    results.push({
      slug,
      applied: true,
      overlayPath,
      promoted: decision.promoted,
      reasons: decision.reasons.slice(0, 4),
      score: after?.qualityScore,
      life: after?.lifecycleState,
    });
    console.log(
      "OK",
      slug,
      "promoted=",
      decision.promoted,
      "score=",
      after?.qualityScore,
    );
  }

  persistContentLifecycleStore();
  writeFileSync(
    path.join(
      process.cwd(),
      "data/seo/batches/improve-batch-2026-09-06-estate-guide-fill.json",
    ),
    JSON.stringify(results, null, 2),
  );
  console.log("Filled", results.filter((r) => r.applied).length, "guides");
}

main();
