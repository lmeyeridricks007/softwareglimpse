import { normalizeMigrationPath } from "../normalize";
import {
  CURATED_TOPIC_ABSORBS,
  CURATED_TOPIC_RETIRES,
  STRATEGY_RETIRE_SLUG_RE,
  TAXONOMY_INTENT_KINDS,
} from "./absorbs";
import type {
  BacklinkPathSignals,
  GscPathSignals,
  Locale410Classification,
  Locale410Disposition,
  Locale410TopicRow,
  TopicAbsorb,
} from "./types";

function hasDemand(gsc: GscPathSignals): boolean {
  return gsc.clicks > 0 || gsc.impressions >= 20;
}

function hasLocaleDemand(gsc: GscPathSignals): boolean {
  return gsc.clicks > 0 || gsc.impressions >= 50;
}

function crmishTopic(enPath: string, intentKind: string): boolean {
  if (
    [
      "product_review",
      "product_pricing",
      "product_alternatives",
      "guide",
      "best",
      "comparison",
      "feature",
    ].includes(intentKind)
  ) {
    return true;
  }
  return /(crm|hubspot|pipedrive|zoho|salesforce|keap|insightly|freshsales|copper|agile|monday|nimble|mailchimp|sales|pipeline|lead|tidio)/i.test(
    enPath,
  );
}

export type ClassifyInput = {
  enPath: string;
  localePaths: string[];
  title: string | null;
  category: string | null;
  legacyPageType: string | null;
  lastmod: string | null;
  intentKind: string;
  mappingAction: string | null;
  mappingBasis: string | null;
  mappingReason: string | null;
  /** Destination from mapping agent / backlog when already known. */
  detectedDestination: string | null;
  inventoryHas: (path: string) => boolean;
  enGsc: GscPathSignals;
  localeGsc: GscPathSignals;
  enBacklinks: BacklinkPathSignals;
  curatedAbsorbs?: Record<string, TopicAbsorb>;
  curatedRetires?: Record<string, { reason: string }>;
};

/**
 * Classify one EN topic whose locale alternates are currently 410.
 */
export function classifyLocale410Topic(input: ClassifyInput): Locale410TopicRow {
  const enPath = normalizeMigrationPath(input.enPath);
  const absorbs = input.curatedAbsorbs ?? CURATED_TOPIC_ABSORBS;
  const retires = input.curatedRetires ?? CURATED_TOPIC_RETIRES;
  const notes: string[] = [];

  let proposedDestination: string | null = null;
  let absorbReason: string | null = null;

  const curated = absorbs[enPath];
  if (curated && input.inventoryHas(curated.destination)) {
    proposedDestination = curated.destination;
    absorbReason = curated.reason;
    notes.push("curated_topic_absorb");
  } else if (
    input.detectedDestination &&
    input.detectedDestination !== "/" &&
    input.inventoryHas(input.detectedDestination) &&
    !getLocalePrefixSafe(input.detectedDestination)
  ) {
    proposedDestination = normalizeMigrationPath(input.detectedDestination);
    absorbReason = input.mappingReason ?? "Detected modern estate match";
    notes.push("detected_estate_match");
  }

  const curatedRetire = retires[enPath];
  const isTaxonomy =
    TAXONOMY_INTENT_KINDS.has(input.intentKind) ||
    enPath === "/" ||
    input.mappingBasis === "taxonomy_retire";
  const isStrategyOut =
    Boolean(curatedRetire) ||
    STRATEGY_RETIRE_SLUG_RE.test(enPath) ||
    input.mappingBasis === "strategy_retire";

  let classification: Locale410Classification;
  let disposition: Locale410Disposition;

  // Locale roots: never homepage dump
  if (enPath === "/" || input.intentKind === "home") {
    classification = "TRUE_OBSOLETE";
    disposition = "KEEP_410";
    proposedDestination = null;
    absorbReason = null;
    notes.push("locale_root_or_home_sibling");
  } else if (
    proposedDestination &&
    proposedDestination !== "/" &&
    input.inventoryHas(proposedDestination)
  ) {
    classification = "DUPLICATE_TOPIC";
    disposition = "ADD_301";
  } else if (isTaxonomy) {
    classification = "TAXONOMY_JUNK";
    disposition = "KEEP_410";
    proposedDestination = null;
    absorbReason = null;
  } else if (isStrategyOut) {
    classification = "TRUE_OBSOLETE";
    disposition = "KEEP_410";
    proposedDestination = null;
    absorbReason = curatedRetire?.reason ?? null;
    if (curatedRetire) notes.push("curated_topic_retire");
  } else {
    const valuable =
      hasLocaleDemand(input.localeGsc) ||
      hasDemand(input.enGsc) ||
      (input.enBacklinks.available &&
        (input.enBacklinks.referringDomains ?? 0) > 0) ||
      crmishTopic(enPath, input.intentKind);

    if (valuable) {
      classification = "VALUABLE_TOPIC_CANDIDATE";
      disposition = "EXISTING_ESTATE_GAP_REVIEW";
      notes.push("no_auto_create");
    } else {
      classification = "ENGLISH_EQUIVALENT_MISSING";
      disposition = "KEEP_410";
    }
  }

  return {
    enPath,
    localePaths: [...input.localePaths].sort(),
    localeCount: input.localePaths.length,
    title: input.title,
    category: input.category,
    legacyPageType: input.legacyPageType,
    lastmod: input.lastmod,
    intentKind: input.intentKind,
    mappingAction: input.mappingAction,
    mappingBasis: input.mappingBasis,
    mappingReason: input.mappingReason,
    modernEstateMatch: proposedDestination,
    enGsc: input.enGsc,
    localeGsc: input.localeGsc,
    enBacklinks: input.enBacklinks,
    classification,
    disposition,
    proposedDestination:
      disposition === "ADD_301" ? proposedDestination : null,
    absorbReason:
      disposition === "ADD_301"
        ? absorbReason
        : disposition === "KEEP_410" && curatedRetire
          ? curatedRetire.reason
          : null,
    notes,
  };
}

function getLocalePrefixSafe(p: string): boolean {
  const first = normalizeMigrationPath(p).split("/").filter(Boolean)[0];
  if (!first) return false;
  return [
    "fr",
    "de",
    "es",
    "nl",
    "zh",
    "hi",
    "ar",
    "pt",
    "it",
    "ja",
  ].includes(first.toLowerCase());
}
