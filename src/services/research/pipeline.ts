import type { ResearchDomain, ResearchFact, ResearchJob, Software } from "@/domain";
import { getSoftwareBySlug } from "@/data";
import {
  loadEnrichment,
  loadFacts,
  loadFixtureText,
  loadJobs,
  loadManualSources,
  loadSnapshots,
  saveConflicts,
  saveEnrichment,
  saveFacts,
  saveJobs,
  saveSnapshots,
} from "@/data/research/store";
import { detectConflicts, markConflictedFacts } from "./conflicts";
import { FixtureFactExtractor } from "./extractors/fixture-extractor";
import { canOverwriteFact, mergeApprovedFacts } from "./merge";
import { normalizeFact } from "./normalize";
import { FixtureFetcher, toSnapshot } from "./providers/fetcher";
import { ManualSourceProvider } from "./providers/source-provider";
import { nowIso } from "./utils";

export type PipelineOptions = {
  domains?: ResearchDomain[];
  dryRun?: boolean;
  allowFixtures?: boolean;
  /** After extraction, mark normalized facts as approved (dev convenience). */
  autoApprove?: boolean;
  /** Merge approved facts into enrichment (and optionally software patch in memory). */
  merge?: boolean;
  allowFixtureMerge?: boolean;
};

export type PipelineResult = {
  job: ResearchJob;
  product: Software;
  factCount: number;
  conflictCount: number;
  merged?: boolean;
};

const DEFAULT_DOMAINS: ResearchDomain[] = [
  "identity",
  "pricing",
  "plans",
  "free-plan",
  "free-trial",
  "features",
  "ai-capabilities",
  "product-positioning",
];

/**
 * Orchestrates:
 * create job → discover → fetch → extract → normalize → validate conflicts → review
 * Does not auto-write canonical seed files unless merge is requested to enrichment store.
 */
export async function runResearchPipeline(
  productSlug: string,
  options: PipelineOptions = {},
): Promise<PipelineResult> {
  const product = getSoftwareBySlug(productSlug, { includeUnpublished: true });
  if (!product) {
    throw new Error(`Unknown product: ${productSlug}`);
  }

  const domains = options.domains?.length ? options.domains : DEFAULT_DOMAINS;
  const allowFixtures = options.allowFixtures ?? true;
  const dryRun = options.dryRun ?? false;

  const job: ResearchJob = {
    id: `job-${productSlug}-${Date.now()}`,
    productSlug,
    domains,
    status: "queued",
    createdAt: nowIso(),
    dryRun,
    allowFixtures,
    sourceIds: [],
    snapshotIds: [],
    factIds: [],
    conflictIds: [],
    errors: [],
  };

  try {
    job.status = "discovering";
    const sources = loadManualSources(productSlug).filter((source) =>
      allowFixtures ? true : source.sourceType !== "fixture",
    );
    const provider = new ManualSourceProvider(sources);
    const candidates = await provider.discover(product, domains);
    job.sourceIds = sources
      .filter((source) =>
        candidates.some((candidate) => candidate.url === source.url || candidate.url.endsWith(source.id)),
      )
      .map((source) => source.id);
    if (job.sourceIds.length === 0) {
      job.sourceIds = sources.map((source) => source.id);
    }

    job.status = "fetching";
    const fetcher = new FixtureFetcher(loadFixtureText);
    const previousSnapshots = loadSnapshots(productSlug);
    const snapshots = [];

    for (const source of sources.filter((s) => job.sourceIds.includes(s.id))) {
      const fetched = await fetcher.fetch({
        sourceId: source.id,
        productSlug,
        url: source.url,
      });
      const snapshot = toSnapshot({
        id: `snap-${source.id}-${fetched.retrievedAt}`,
        sourceId: source.id,
        productSlug,
        fetch: fetched,
        domains: source.domains,
      });
      const previous = previousSnapshots
        .filter((item) => item.sourceId === source.id)
        .sort((a, b) => b.retrievedAt.localeCompare(a.retrievedAt))[0];
      if (previous && previous.contentHash === snapshot.contentHash) {
        snapshot.metadata = {
          ...snapshot.metadata,
          unchangedSince: previous.id,
        };
      }
      snapshots.push(snapshot);
    }
    job.snapshotIds = snapshots.map((s) => s.id);

    job.status = "extracting";
    const extractor = new FixtureFactExtractor();
    let facts = (
      await Promise.all(
        snapshots.map((snapshot) =>
          extractor.extract(snapshot, { productSlug, domains }),
        ),
      )
    ).flat();

    job.status = "normalizing";
    facts = facts.map(normalizeFact);

    // Preserve higher-trust existing facts
    const existing = loadFacts(productSlug);
    const mergedFacts = [...existing];
    for (const incoming of facts) {
      const index = mergedFacts.findIndex((item) => item.id === incoming.id);
      if (index < 0) {
        mergedFacts.push(incoming);
        continue;
      }
      if (canOverwriteFact(mergedFacts[index], incoming)) {
        mergedFacts[index] = incoming;
      }
    }

    const conflicts = detectConflicts(mergedFacts, sources);
    const withConflicts = markConflictedFacts(mergedFacts, conflicts);
    job.conflictIds = conflicts.map((c) => c.id);
    job.factIds = withConflicts.map((f) => f.id);

    let finalFacts = withConflicts;
    if (options.autoApprove) {
      finalFacts = withConflicts.map((fact) =>
        fact.status === "normalized" || fact.status === "extracted"
          ? {
              ...fact,
              status: "approved" as const,
              approvedAt: nowIso(),
              verifiedAt: nowIso(),
            }
          : fact,
      );
    }

    job.status = conflicts.length > 0 ? "review-required" : "review-required";
    if (finalFacts.every((f) => f.status === "approved" || f.status === "verified")) {
      job.status = "approved";
    }

    if (!dryRun) {
      saveSnapshots(productSlug, [...previousSnapshots, ...snapshots]);
      saveFacts(productSlug, finalFacts);
      saveConflicts(productSlug, conflicts);
      const jobs = loadJobs(productSlug);
      job.updatedAt = nowIso();
      job.completedAt = nowIso();
      saveJobs(productSlug, [...jobs, job]);
    }

    let merged = false;
    if (options.merge && !dryRun) {
      const result = mergeApprovedFacts({
        software: product,
        facts: finalFacts,
        existingEnrichment: loadEnrichment(productSlug) ?? undefined,
        options: {
          allowFixtureMerge: options.allowFixtureMerge ?? false,
          requireApproved: true,
        },
      });
      saveEnrichment(productSlug, result.enrichment);
      merged = result.appliedFactIds.length > 0;
    }

    return {
      job,
      product,
      factCount: finalFacts.length,
      conflictCount: conflicts.length,
      merged,
    };
  } catch (error) {
    job.status = "failed";
    job.errors = [error instanceof Error ? error.message : String(error)];
    job.completedAt = nowIso();
    if (!dryRun) {
      const jobs = loadJobs(productSlug);
      saveJobs(productSlug, [...jobs, job]);
    }
    throw error;
  }
}

export function approveFacts(
  productSlug: string,
  factIds?: string[],
): ResearchFact[] {
  const facts = loadFacts(productSlug).map((fact) => {
    if (factIds && !factIds.includes(fact.id)) return fact;
    if (fact.status === "rejected" || fact.status === "conflict") return fact;
    return {
      ...fact,
      status: "approved" as const,
      approvedAt: nowIso(),
      verifiedAt: nowIso(),
    };
  });
  saveFacts(productSlug, facts);
  return facts;
}
