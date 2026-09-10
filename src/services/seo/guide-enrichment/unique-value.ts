import type { GuidePage } from "@/domain/schemas";
import type { EnrichmentGuideType, UniqueValueElement } from "./types";
import { blueprintForType } from "./blueprints";

const GENERIC_FILLER =
  /\b(is a powerful (?:solution|tool|platform)|helps businesses (?:of all sizes|streamline)|comprehensive suite of features|in today's (?:fast-paced|digital) (?:world|landscape)|leverage (?:cutting-edge|robust)|seamless(ly)? (?:integrate|experience)|unlock (?:the full )?potential)\b/i;

function blockTypes(guide: GuidePage): Set<string> {
  return new Set(
    (guide.blocks ?? []).map((b) =>
      b && typeof b === "object" && "type" in b
        ? String((b as { type?: string }).type)
        : "",
    ),
  );
}

function bodyText(guide: GuidePage): string {
  const parts: string[] = [guide.title, guide.summary ?? ""];
  for (const s of guide.sections ?? []) {
    parts.push(s.heading, s.body);
  }
  for (const b of guide.blocks ?? []) {
    parts.push(JSON.stringify(b));
  }
  return parts.join("\n");
}

/**
 * Detect substantive unique-value elements already present on a guide.
 * Used both for planning gaps and for promotion readiness.
 */
export function detectUniqueValueElements(guide: GuidePage): UniqueValueElement[] {
  const types = blockTypes(guide);
  const text = bodyText(guide);
  const found: UniqueValueElement[] = [];

  if (
    types.has("decision-framework") ||
    types.has("comparison-framework") ||
    /decision framework|choose when|pick .+ when/i.test(text)
  ) {
    found.push("decision_framework");
  }
  if (
    types.has("product-shortlist") ||
    types.has("size-match") ||
    /shortlist|candidate (?:product|tool)/i.test(text)
  ) {
    found.push("product_shortlist");
  }
  if (
    types.has("cost-breakdown") ||
    /plan (?:matrix|structure)|free trial|seat.?based|pricing/i.test(text)
  ) {
    found.push("pricing_comparison");
  }
  if (
    types.has("feature-matrix") ||
    types.has("crm-types") ||
    /evaluation criteria|must-have|capability/i.test(text)
  ) {
    found.push("category_criteria");
  }
  if (
    types.has("step") ||
    /scenario|for (?:smb|mid-market|enterprise) teams/i.test(text)
  ) {
    found.push("scenario_analysis");
  }
  if (
    types.has("step") &&
    /implement|rollout|migrate|cutover|setup/i.test(text)
  ) {
    found.push("implementation_workflow");
  }
  if (
    types.has("feature-matrix") ||
    types.has("comparison-framework") ||
    /trade-?off|versus|vs\./i.test(text)
  ) {
    found.push("tradeoff_table");
  }
  if (
    types.has("checklist") ||
    types.has("selection-checklist") ||
    (guide.checklist?.length ?? 0) >= 3
  ) {
    found.push("buyer_checklist");
  }
  if (
    /SoftwareGlimpse|researched|verified pricing|hands-on/i.test(text) ||
    types.has("cost-breakdown")
  ) {
    found.push("sg_original_data");
  }
  if (types.has("mistakes") || /limitation|not (?:ideal|a fit) when/i.test(text)) {
    found.push("limitations_evidence");
  }
  if (
    types.has("related-content") ||
    /alternative|competitor|instead of/i.test(text)
  ) {
    found.push("alternatives_map");
  }

  return [...new Set(found)];
}

export function requiredUniqueValueForType(
  type: EnrichmentGuideType,
): UniqueValueElement[] {
  const blueprint = blueprintForType(type);
  const required: UniqueValueElement[] = ["decision_framework"];
  if (blueprint.requiredSections.includes("candidate_products")) {
    required.push("product_shortlist");
  }
  if (blueprint.requiredSections.includes("pricing_expectations")) {
    required.push("pricing_comparison");
  }
  if (blueprint.requiredSections.includes("checklist")) {
    required.push("buyer_checklist");
  }
  if (blueprint.requiredSections.includes("tradeoffs")) {
    required.push("tradeoff_table");
  }
  if (blueprint.requiredSections.includes("implementation")) {
    required.push("implementation_workflow");
  }
  if (blueprint.requiredSections.includes("limitations")) {
    required.push("limitations_evidence");
  }
  if (blueprint.requiredSections.includes("alternatives")) {
    required.push("alternatives_map");
  }
  if (blueprint.requiredSections.includes("scenario_analysis")) {
    required.push("scenario_analysis");
  }
  if (type === "PRODUCT_EXPLAINER") {
    required.push(
      "decision_framework",
      "limitations_evidence",
      "buyer_checklist",
      "sg_original_data",
    );
  }
  return [...new Set(required)].slice(0, Math.max(blueprint.minUniqueElements, 3));
}

export function hasGenericFiller(guide: GuidePage): boolean {
  return GENERIC_FILLER.test(bodyText(guide));
}

export function uniqueValueGap(
  guide: GuidePage,
  type: EnrichmentGuideType,
): {
  present: UniqueValueElement[];
  required: UniqueValueElement[];
  missing: UniqueValueElement[];
  sufficient: boolean;
} {
  const present = detectUniqueValueElements(guide);
  const required = requiredUniqueValueForType(type);
  const missing = required.filter((r) => !present.includes(r));
  const blueprint = blueprintForType(type);
  return {
    present,
    required,
    missing,
    sufficient:
      present.length >= blueprint.minUniqueElements && missing.length === 0,
  };
}
