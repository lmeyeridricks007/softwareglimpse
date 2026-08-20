import type { EditorialPageType, Software } from "@/domain";
import { loadAssessment, loadReview } from "@/data/editorial/store";
import {
  loadEnrichment,
  loadFacts,
  loadManualSources,
} from "@/data/research/store";
import { getSoftwareRelationshipLinks } from "@/services/relationships/software-links";
import { getStaleResearchDomains } from "@/services/research/freshness";
import { evaluatePageQuality } from "@/services/editorial/quality";
import {
  getAllAlternativesUnfiltered,
  getAllBestPagesUnfiltered,
  getAllComparisonsUnfiltered,
  getSoftwareBySlug,
} from "@/data/repositories/catalog";

export type CompletenessStatus = "PASS" | "PARTIAL" | "MISSING" | "FAIL";

export type EditorialCompletenessReport = {
  productSlug: string;
  pageType: EditorialPageType;
  targetSlug: string;
  research: CompletenessStatus;
  editorial: CompletenessStatus;
  seo: CompletenessStatus;
  links: CompletenessStatus;
  freshness: CompletenessStatus;
  publishable: "YES" | "NO";
  failures: string[];
};

/**
 * Build a page-oriented completeness report for editorial publishing decisions.
 */
export function buildEditorialCompletenessReport(input: {
  productSlug: string;
  pageType?: EditorialPageType;
  targetSlug?: string;
}): EditorialCompletenessReport {
  const pageType = input.pageType ?? "software-review";
  const targetSlug = input.targetSlug ?? input.productSlug;
  const software = getSoftwareBySlug(input.productSlug, {
    includeUnpublished: true,
  });
  const facts = loadFacts(input.productSlug);
  const enrichment = loadEnrichment(input.productSlug);
  const sources = loadManualSources(input.productSlug);
  const assessment = loadAssessment(input.productSlug);
  const review = loadReview(input.productSlug);

  const failures: string[] = [];

  const approvedFacts = facts.filter(
    (f) => f.status === "approved" || f.status === "verified",
  );
  const fixtureFacts = approvedFacts.filter((f) => f.isFixture);
  const liveFacts = approvedFacts.filter((f) => !f.isFixture);

  let research: CompletenessStatus = "MISSING";
  if (approvedFacts.length === 0) {
    research = "MISSING";
    failures.push("research-missing-facts");
  } else if (liveFacts.length === 0 && fixtureFacts.length > 0) {
    research = "FAIL";
    failures.push("research-fixture-not-live");
  } else if (liveFacts.length > 0 && fixtureFacts.length > 0) {
    research = "PARTIAL";
    failures.push("research-mixed-fixture-live");
  } else {
    research = "PASS";
  }

  if (sources.some((s) => s.sourceType === "fixture" || s.authority === "fixture")) {
    if (research !== "FAIL") research = research === "PASS" ? "PARTIAL" : research;
    if (!failures.includes("research-fixture-not-live")) {
      failures.push("research-fixture-not-live");
    }
  }

  let editorial: CompletenessStatus = "MISSING";
  if (!assessment) {
    editorial = "MISSING";
    failures.push("editorial-missing-assessment");
  } else if (
    assessment.status === "assessment-in-progress" ||
    assessment.status === "review-required" ||
    assessment.status === "not-assessed"
  ) {
    editorial = "PARTIAL";
    failures.push(`editorial-status:${assessment.status}`);
  } else if (assessment.status === "outdated") {
    editorial = "FAIL";
    failures.push("editorial-outdated");
  } else if (assessment.status === "approved") {
    editorial =
      review?.editorialStatus === "approved" ? "PASS" : "PARTIAL";
    if (review?.editorialStatus !== "approved") {
      failures.push("editorial-review-not-approved");
    }
  }

  let seo: CompletenessStatus = "MISSING";
  if (pageType === "software-review") {
    if (!software) {
      seo = "MISSING";
      failures.push("seo-missing-software");
    } else if (!software.seo.title || software.seo.indexable !== true) {
      seo = software.seo.title ? "PARTIAL" : "MISSING";
      if (!software.seo.indexable) failures.push("seo-not-indexable");
    } else {
      seo = "PASS";
    }
  } else {
    seo = evaluateEntitySeo(pageType, targetSlug, failures);
  }

  let links: CompletenessStatus = "MISSING";
  if (software) {
    const resolved = getSoftwareRelationshipLinks(software);
    if (resolved.length === 0) {
      links = "MISSING";
      failures.push("links-none-resolved");
    } else if (resolved.length < 3) {
      links = "PARTIAL";
    } else {
      links = "PASS";
    }
  }

  let freshness: CompletenessStatus = "MISSING";
  if (!enrichment?.domainCheckedAt || Object.keys(enrichment.domainCheckedAt).length === 0) {
    freshness = "MISSING";
    failures.push("freshness-unchecked");
  } else {
    const stale = getStaleResearchDomains({
      domainCheckedAt: enrichment.domainCheckedAt,
    });
    if (stale.length === 0) freshness = "PASS";
    else if (stale.length <= 2) {
      freshness = "PARTIAL";
      failures.push(`freshness-stale:${stale.join(",")}`);
    } else {
      freshness = "FAIL";
      failures.push(`freshness-stale:${stale.join(",")}`);
    }
  }

  const quality = evaluatePageQualityForReport(pageType, targetSlug, input.productSlug);
  for (const f of quality.failures) {
    if (!failures.includes(f)) failures.push(f);
  }

  const blocking = new Set(
    failures.filter(
      (f) =>
        f === "research-fixture-not-live" ||
        f.startsWith("editorial-") ||
        f === "missing-review" ||
        f === "editorial-not-approved" ||
        f === "assessment-not-approved",
    ),
  );

  const publishable =
    quality.publishable &&
    research !== "FAIL" &&
    editorial === "PASS" &&
    blocking.size === 0
      ? "YES"
      : "NO";

  if (publishable === "NO" && !failures.includes("not-publishable")) {
    failures.push("not-publishable");
  }

  return {
    productSlug: input.productSlug,
    pageType,
    targetSlug,
    research,
    editorial,
    seo,
    links,
    freshness,
    publishable,
    failures,
  };
}

function evaluateEntitySeo(
  pageType: EditorialPageType,
  targetSlug: string,
  failures: string[],
): CompletenessStatus {
  if (pageType === "comparison") {
    const entity = getAllComparisonsUnfiltered().find((c) => c.slug === targetSlug);
    if (!entity) {
      failures.push("seo-missing-entity");
      return "MISSING";
    }
    if (!entity.seo.indexable) {
      failures.push("seo-not-indexable");
      return "PARTIAL";
    }
    return entity.seo.title ? "PASS" : "MISSING";
  }
  if (pageType === "alternatives") {
    const entity = getAllAlternativesUnfiltered().find((a) => a.slug === targetSlug);
    if (!entity) {
      failures.push("seo-missing-entity");
      return "MISSING";
    }
    if (!entity.seo.indexable) {
      failures.push("seo-not-indexable");
      return "PARTIAL";
    }
    return entity.seo.title ? "PASS" : "MISSING";
  }
  if (pageType === "best") {
    const entity = getAllBestPagesUnfiltered().find((b) => b.slug === targetSlug);
    if (!entity) {
      failures.push("seo-missing-entity");
      return "MISSING";
    }
    if (!entity.seo.indexable) {
      failures.push("seo-not-indexable");
      return "PARTIAL";
    }
    return entity.seo.title ? "PASS" : "MISSING";
  }
  return "PARTIAL";
}

function evaluatePageQualityForReport(
  pageType: EditorialPageType,
  targetSlug: string,
  productSlug: string,
) {
  if (pageType === "software-review") {
    return evaluatePageQuality({ pageType: "software-review", productSlug });
  }
  if (pageType === "comparison") {
    const entity = getAllComparisonsUnfiltered().find((c) => c.slug === targetSlug);
    if (!entity) {
      return {
        pageType: "comparison" as const,
        ok: false,
        publishable: false,
        failures: ["missing-comparison"],
      };
    }
    return evaluatePageQuality({ pageType: "comparison", entity });
  }
  if (pageType === "alternatives") {
    const entity = getAllAlternativesUnfiltered().find((a) => a.slug === targetSlug);
    if (!entity) {
      return {
        pageType: "alternatives" as const,
        ok: false,
        publishable: false,
        failures: ["missing-alternatives"],
      };
    }
    return evaluatePageQuality({ pageType: "alternatives", entity });
  }
  if (pageType === "best") {
    const entity = getAllBestPagesUnfiltered().find((b) => b.slug === targetSlug);
    if (!entity) {
      return {
        pageType: "best" as const,
        ok: false,
        publishable: false,
        failures: ["missing-best-page"],
      };
    }
    return evaluatePageQuality({ pageType: "best", entity });
  }
  return {
    pageType: "software-review" as const,
    ok: false,
    publishable: false,
    failures: ["unsupported-page-type"],
  };
}

export function formatEditorialCompletenessReport(
  report: EditorialCompletenessReport,
): string {
  return [
    `${report.pageType} ${report.targetSlug}`,
    "",
    `Research     ${report.research}`,
    `Editorial    ${report.editorial}`,
    `SEO          ${report.seo}`,
    `Links        ${report.links}`,
    `Freshness    ${report.freshness}`,
    "",
    `Publishable  ${report.publishable}`,
    ...(report.failures.length
      ? ["", "Failures:", ...report.failures.map((f) => `- ${f}`)]
      : []),
  ].join("\n");
}

/** Convenience for software entities passed from callers. */
export function buildSoftwareEditorialCompleteness(
  software: Software,
): EditorialCompletenessReport {
  return buildEditorialCompletenessReport({
    productSlug: software.slug,
    pageType: "software-review",
    targetSlug: software.slug,
  });
}
