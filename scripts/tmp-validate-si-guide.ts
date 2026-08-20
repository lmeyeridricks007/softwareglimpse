import { existsSync } from "node:fs";
import path from "node:path";
import { GuidePageSchema } from "@/domain";
import {
  getSoftwareBySlug,
} from "@/data";
import {
  getGuideBySlug,
  getGuides,
} from "@/data/repositories/guides";
import { evaluateGuideQuality } from "@/domain/quality-gates";
import { isEntityIndexable } from "@/domain/quality-gates";
import { snapshotFromGuide } from "@/services/content-quality/loaders/guides";
import { howToChooseSalesIntelligenceGuide } from "@/data/seed/guides-how-to-choose-sales-intelligence";
import { tocFromGuideBlocks } from "@/components/guides/guide-blocks-renderer";
import { buildGuideLinkPlan } from "@/services/internal-linking";

const parsed = GuidePageSchema.parse(howToChooseSalesIntelligenceGuide);
console.log("✓ GuidePageSchema.parse OK —", parsed.slug);
console.log("  blocks:", parsed.blocks.length);
console.log("  block types:", parsed.blocks.map((b) => b.type).join(", "));

const fromRegistry = getGuideBySlug("how-to-choose-sales-intelligence");
console.log("✓ getGuideBySlug:", Boolean(fromRegistry), "— published & visible");
console.log("  total published guides:", getGuides().length);

console.log("✓ quality gate:", JSON.stringify(evaluateGuideQuality(parsed)));
console.log(
  "✓ isEntityIndexable:",
  isEntityIndexable({ kind: "guide", entity: parsed }),
);

// Asset existence
const assets = [
  parsed.heroVisual?.src,
  ...parsed.blocks.flatMap((b) => {
    const out: string[] = [];
    if (b.type === "figure") out.push(b.src);
    if ("figure" in b && b.figure?.src) out.push(b.figure.src);
    return out;
  }),
].filter(Boolean) as string[];
for (const src of assets) {
  const file = path.join(process.cwd(), "public", src);
  console.log(existsSync(file) ? `✓ asset ${src}` : `✗ MISSING ${src}`);
}

// Referenced product slugs resolve
const slugs = new Set([
  ...parsed.productSlugs,
  ...parsed.blocks.flatMap((b) =>
    b.type === "product-shortlist" || b.type === "scorecard" ? b.productSlugs : [],
  ),
]);
for (const s of slugs) {
  const soft = getSoftwareBySlug(s, { includeUnpublished: true });
  console.log(soft ? `✓ product ${s}` : `✗ MISSING product ${s}`);
}

// Required links present somewhere in blocks
const REQUIRED = [
  "/best/sales-intelligence-software/",
  "/categories/sales-intelligence/",
  "/software/apollo/",
  "/software/bookyourdata/",
  "/software/reply/",
  "/software/kixie/",
  "/use-cases/prospecting/",
  "/use-cases/sales-engagement/",
];
const serialized = JSON.stringify(parsed);
for (const link of REQUIRED) {
  const inBlocks = serialized.includes(link);
  const viaProduct =
    link.startsWith("/software/") && slugs.has(link.split("/")[2] as string);
  console.log(inBlocks || viaProduct ? `✓ link ${link}` : `✗ MISSING link ${link}`);
}

const snap = snapshotFromGuide(parsed);
console.log("✓ quality snapshot pageType:", snap.pageType);
console.log("  checklist passed:", snap.pageTypeChecklist.passed.join(", "));
console.log("  checklist failed:", snap.pageTypeChecklist.failed.join(", ") || "(none)");
console.log("  teachingVisualCount:", snap.media.teachingVisualCount);
console.log("  missingSections:", snap.missingSections.join(", ") || "(none)");

const toc = tocFromGuideBlocks(parsed.blocks);
console.log("✓ TOC entries:", toc.length);

const plan = buildGuideLinkPlan(parsed);
console.log(
  "✓ link plan — parentHub:",
  plan.parentHub.map((l) => l.href).join(", "),
);
console.log(
  "  relatedGuides:",
  plan.relatedGuides.map((l) => l.href).join(", ") || "(none)",
);
console.log(
  "  recommendedNextStep:",
  plan.recommendedNextStep.map((l) => l.href).join(", ") || "(none)",
);

// publishedAt must be <= now
console.log(
  "✓ publishedAt <= now:",
  new Date(parsed.metadata.publishedAt ?? 0).getTime() <= Date.now(),
);
