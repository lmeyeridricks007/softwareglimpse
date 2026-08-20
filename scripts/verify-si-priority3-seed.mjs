#!/usr/bin/env node
/**
 * Verifies SI Priority-3 seed snippet was appended into software.ts
 * and that related catalogue hooks exist.
 *
 * Usage: node scripts/verify-si-priority3-seed.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const SLUGS = ["uplead", "leadiq", "hunter", "snov", "kaspr", "ocean"];
const EXPECTED_OVERALL = {
  uplead: 6.8,
  leadiq: 7,
  hunter: 7.3,
  snov: 7,
  kaspr: 6.3,
  ocean: 6.4,
};

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

function assertIncludes(file, needle, label) {
  if (!file.includes(needle)) {
    throw new Error(`Missing ${label}: ${needle}`);
  }
}

function main() {
  const software = read("src/data/seed/software.ts");
  const category = read(
    "src/data/category-onboarding/seed/sales-intelligence.ts",
  );
  const relationships = read("src/data/seed/relationships.ts");
  const comparisons = read("src/data/seed/comparisons.ts");
  const best = read("src/data/seed/best.ts");
  const snippet = read("scripts/_si-priority3-seed-snippet.ts");

  for (const slug of SLUGS) {
    assertIncludes(software, `slug: "${slug}"`, `software.ts slug ${slug}`);
    assertIncludes(software, `id: "soft-${slug}"`, `software.ts id soft-${slug}`);
    assertIncludes(category, `"${slug}"`, `seedProductSlugs ${slug}`);
    assertIncludes(best, `"${slug}"`, `best.ts eligible ${slug}`);
    assertIncludes(snippet, `slug: "${slug}"`, `seed snippet ${slug}`);

    const assessmentPath = path.join(
      ROOT,
      "src/data/editorial/assessments",
      `${slug}.json`,
    );
    const assessment = JSON.parse(fs.readFileSync(assessmentPath, "utf8"));
    if (assessment.overallScore !== EXPECTED_OVERALL[slug]) {
      throw new Error(
        `${slug} overallScore=${assessment.overallScore} expected=${EXPECTED_OVERALL[slug]}`,
      );
    }

    const enrichment = JSON.parse(
      fs.readFileSync(
        path.join(ROOT, "src/data/research", slug, "enrichment.json"),
        "utf8",
      ),
    );
    console.log(
      `✓ ${slug}  overall=${assessment.overallScore}  media=${(enrichment.media ?? []).length}`,
    );
  }

  assertIncludes(relationships, "SI Priority-3 mesh", "relationships P3 comment");
  assertIncludes(comparisons, "SI Priority-3 approved pairs", "comparisons P3 comment");
  assertIncludes(best, 'productSlug: "hunter"', "best hunter rec");
  assertIncludes(best, 'productSlug: "leadiq"', "best leadiq rec");
  assertIncludes(best, 'productSlug: "snov"', "best snov rec");
  assertIncludes(best, 'productSlug: "uplead"', "best uplead rec");
  assertIncludes(best, 'rank: 16', "best rank 16");
  assertIncludes(best, 'rank: 19', "best rank 19");
  assertIncludes(best, 'productSlug: "kaspr"', "best kaspr decision/landscape");
  assertIncludes(best, 'productSlug: "ocean"', "best ocean decision/landscape");

  const pairChecks = [
    "Hunter vs Apollo",
    "Hunter vs Snov.io",
    "Snov.io vs Apollo",
    "UpLead vs Apollo",
    "UpLead vs Lusha",
    "LeadIQ vs Lusha",
    "LeadIQ vs Seamless.AI",
    "Kaspr vs Cognism",
    "Kaspr vs Lusha",
    "Ocean.io vs Clay",
  ];
  for (const title of pairChecks) {
    assertIncludes(comparisons, title, `comparison ${title}`);
  }

  console.log(`\n✓ SI Priority-3 seed verification passed (${SLUGS.length} products, ${pairChecks.length} comparisons).`);
}

main();
