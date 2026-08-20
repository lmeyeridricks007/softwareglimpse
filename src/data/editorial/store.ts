import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { z } from "zod";
import {
  EditorialBriefSchema,
  EditorialDraftSchema,
  IsoDateTimeSchema,
  MethodologySchema,
  ProductEditorialAssessmentSchema,
  ProductReviewSchema,
  type EditorialBrief,
  type EditorialDraft,
  type EditorialPageType,
  type Methodology,
  type ProductEditorialAssessment,
  type ProductReview,
} from "@/domain";
import { crmMethodology } from "@/data/seed/crm-methodology";
import { salesIntelligenceMethodology } from "@/data/seed/sales-intelligence-methodology";
import { emailMarketingDefinition } from "@/data/category-onboarding/seed/email-marketing";
import { methodologiesSeed } from "@/data/editorial/seed/methodology";
import { listActivatedCategories } from "@/data/category-onboarding/store";

const EDITORIAL_ROOT = path.join(process.cwd(), "src/data/editorial");

const PAGE_TYPES: EditorialPageType[] = [
  "software-review",
  "comparison",
  "alternatives",
  "best",
  "guide",
  "pricing",
  "category-hub",
  "use-case",
];

export const EditorialHistoryEntrySchema = z.object({
  draftId: z.string().min(1),
  approvedAt: IsoDateTimeSchema,
  supersededAt: IsoDateTimeSchema.optional(),
});

export type EditorialHistoryEntry = z.infer<typeof EditorialHistoryEntrySchema>;

function ensureDir(dir: string): void {
  mkdirSync(dir, { recursive: true });
}

function writeJson(filePath: string, data: unknown): void {
  ensureDir(path.dirname(filePath));
  writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function readJsonFile(filePath: string): unknown | null {
  if (!existsSync(filePath)) return null;
  return JSON.parse(readFileSync(filePath, "utf8")) as unknown;
}

function assessmentPath(productSlug: string): string {
  return path.join(EDITORIAL_ROOT, "assessments", `${productSlug}.json`);
}

function reviewPath(productSlug: string): string {
  return path.join(EDITORIAL_ROOT, "reviews", `${productSlug}.json`);
}

function briefPath(pageType: EditorialPageType, targetSlug: string): string {
  return path.join(EDITORIAL_ROOT, "briefs", pageType, `${targetSlug}.json`);
}

function draftDir(pageType: EditorialPageType, targetSlug: string): string {
  return path.join(EDITORIAL_ROOT, "drafts", pageType, targetSlug);
}

function draftPath(
  pageType: EditorialPageType,
  targetSlug: string,
  draftId: string,
): string {
  return path.join(draftDir(pageType, targetSlug), `${draftId}.json`);
}

function historyPath(pageType: EditorialPageType, targetSlug: string): string {
  return path.join(EDITORIAL_ROOT, "history", pageType, `${targetSlug}.json`);
}

export function listMethodologies(): Methodology[] {
  const fromSeed = methodologiesSeed.map((item) =>
    MethodologySchema.parse(item),
  );
  const bySlug = new Map<string, Methodology>();
  bySlug.set(crmMethodology.slug, crmMethodology);
  bySlug.set(salesIntelligenceMethodology.slug, salesIntelligenceMethodology);
  bySlug.set(
    emailMarketingDefinition.editorialMethodology.slug,
    emailMarketingDefinition.editorialMethodology,
  );
  // Activated category methodologies (future category defs)
  try {
    for (const activated of listActivatedCategories()) {
      const m = activated.definition.editorialMethodology;
      bySlug.set(m.slug, m);
    }
  } catch {
    // store may be unavailable in some test contexts
  }
  for (const methodology of fromSeed) {
    if (!bySlug.has(methodology.slug)) {
      bySlug.set(methodology.slug, methodology);
    }
  }
  return [...bySlug.values()];
}

export function getMethodologyBySlug(slug: string): Methodology | null {
  return listMethodologies().find((item) => item.slug === slug) ?? null;
}

export function loadAssessment(
  productSlug: string,
): ProductEditorialAssessment | null {
  const raw = readJsonFile(assessmentPath(productSlug));
  if (raw == null) return null;
  return ProductEditorialAssessmentSchema.parse(raw);
}

export function listAssessments(): ProductEditorialAssessment[] {
  const dir = path.join(EDITORIAL_ROOT, "assessments");
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((name) => name.endsWith(".json"))
    .map((name) =>
      ProductEditorialAssessmentSchema.parse(
        readJsonFile(path.join(dir, name)),
      ),
    )
    .sort((a, b) => a.productSlug.localeCompare(b.productSlug));
}

export function saveAssessment(
  assessment: ProductEditorialAssessment,
): ProductEditorialAssessment {
  const parsed = ProductEditorialAssessmentSchema.parse(assessment);
  writeJson(assessmentPath(parsed.productSlug), parsed);
  return parsed;
}

export function loadReview(productSlug: string): ProductReview | null {
  const raw = readJsonFile(reviewPath(productSlug));
  if (raw == null) return null;
  const parsed = ProductReviewSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(
      `Invalid ProductReview for "${productSlug}": ${parsed.error.message}`,
    );
  }
  return parsed.data;
}

/**
 * Persists a review document. Does not promote drafts — use
 * {@link promoteDraftToApproved} to supersede an approved review from a draft.
 */
export function saveReview(review: ProductReview): ProductReview {
  const parsed = ProductReviewSchema.parse(review);
  writeJson(reviewPath(parsed.productSlug), parsed);
  return parsed;
}

export function getApprovedReview(productSlug: string): ProductReview | null {
  const review = loadReview(productSlug);
  if (!review || review.editorialStatus !== "approved") return null;
  return review;
}

export function loadBrief(
  pageType: EditorialPageType,
  targetSlug: string,
): EditorialBrief | null {
  const raw = readJsonFile(briefPath(pageType, targetSlug));
  if (raw == null) return null;
  return EditorialBriefSchema.parse(raw);
}

export function saveBrief(brief: EditorialBrief): EditorialBrief {
  const parsed = EditorialBriefSchema.parse(brief);
  const targetSlug =
    parsed.productSlug ??
    parsed.productSlugs[0] ??
    parsed.id.replace(/^brief-/, "");
  writeJson(briefPath(parsed.pageType, targetSlug), parsed);
  return parsed;
}

export function loadDraft(
  pageType: EditorialPageType,
  targetSlug: string,
  draftId: string,
): EditorialDraft | null {
  const raw = readJsonFile(draftPath(pageType, targetSlug, draftId));
  if (raw == null) return null;
  return EditorialDraftSchema.parse(raw);
}

export function saveDraft(draft: EditorialDraft): EditorialDraft {
  const parsed = EditorialDraftSchema.parse(draft);
  writeJson(draftPath(parsed.pageType, parsed.targetSlug, parsed.id), parsed);
  return parsed;
}

export function listDrafts(
  pageType: EditorialPageType,
  targetSlug: string,
): EditorialDraft[] {
  const dir = draftDir(pageType, targetSlug);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((name) => name.endsWith(".json"))
    .map((name) => {
      const raw = readJsonFile(path.join(dir, name));
      return EditorialDraftSchema.parse(raw);
    })
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

/** List every draft under `drafts/{pageType}/{targetSlug}/`. */
export function listAllDrafts(): EditorialDraft[] {
  const root = path.join(EDITORIAL_ROOT, "drafts");
  if (!existsSync(root)) return [];
  const drafts: EditorialDraft[] = [];
  for (const pageType of PAGE_TYPES) {
    const pageDir = path.join(root, pageType);
    if (!existsSync(pageDir)) continue;
    for (const target of readdirSync(pageDir, { withFileTypes: true })) {
      if (!target.isDirectory()) continue;
      drafts.push(...listDrafts(pageType, target.name));
    }
  }
  return drafts.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export function loadHistory(
  pageType: EditorialPageType,
  targetSlug: string,
): EditorialHistoryEntry[] {
  const raw = readJsonFile(historyPath(pageType, targetSlug));
  if (raw == null) return [];
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => EditorialHistoryEntrySchema.parse(item));
}

function saveHistory(
  pageType: EditorialPageType,
  targetSlug: string,
  entries: EditorialHistoryEntry[],
): void {
  const parsed = entries.map((e) => EditorialHistoryEntrySchema.parse(e));
  writeJson(historyPath(pageType, targetSlug), parsed);
}

export type PromoteDraftInput = {
  pageType: EditorialPageType;
  targetSlug: string;
  draftId: string;
  /** Required review payload derived from the draft (caller supplies structured review). */
  review: ProductReview;
  approvedAt?: string;
};

/**
 * Explicitly promote a draft to the approved review. Supersedes any previous
 * approved review/history entry. Never called implicitly from saveDraft.
 */
export function promoteDraftToApproved(
  input: PromoteDraftInput,
): ProductReview {
  const draft = loadDraft(input.pageType, input.targetSlug, input.draftId);
  if (!draft) {
    throw new Error(
      `Draft not found: ${input.pageType}/${input.targetSlug}/${input.draftId}`,
    );
  }

  const approvedAt = input.approvedAt ?? new Date().toISOString();
  const previous = loadReview(input.targetSlug);
  const history = loadHistory(input.pageType, input.targetSlug);

  const nextHistory = history.map((entry) =>
    entry.supersededAt
      ? entry
      : EditorialHistoryEntrySchema.parse({
          ...entry,
          supersededAt: approvedAt,
        }),
  );
  nextHistory.push(
    EditorialHistoryEntrySchema.parse({
      draftId: draft.id,
      approvedAt,
    }),
  );
  saveHistory(input.pageType, input.targetSlug, nextHistory);

  const previousDraftId =
    previous?.draftId ??
    history.find((h) => !h.supersededAt)?.draftId;

  const approvedReview = ProductReviewSchema.parse({
    ...input.review,
    productSlug: input.targetSlug,
    editorialStatus: "approved",
    draftId: draft.id,
    contentVersion: (previous?.contentVersion ?? 0) + 1,
    lastUpdatedAt: approvedAt,
    metadata: {
      ...input.review.metadata,
      status: input.review.metadata?.status ?? "published",
    },
  });

  saveReview(approvedReview);

  saveDraft(
    EditorialDraftSchema.parse({
      ...draft,
      status: "approved",
      previousApprovedDraftId: previousDraftId,
      updatedAt: approvedAt,
    }),
  );

  if (previousDraftId && previousDraftId !== draft.id) {
    const prevDraft = loadDraft(
      input.pageType,
      input.targetSlug,
      previousDraftId,
    );
    if (prevDraft && prevDraft.status === "approved") {
      saveDraft(
        EditorialDraftSchema.parse({
          ...prevDraft,
          status: "superseded",
          updatedAt: approvedAt,
        }),
      );
    }
  }

  return approvedReview;
}
