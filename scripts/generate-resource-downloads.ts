/**
 * Generate visual PDF + Excel downloads for all CRM resources into public/resources/.
 *
 *   npm run resources:downloads
 */

import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { generateAllResourceDownloads } from "@/services/resource-hub/export-documents";

async function main() {
  const outDir = join(process.cwd(), "public", "resources");
  mkdirSync(outDir, { recursive: true });
  const results = await generateAllResourceDownloads(outDir);
  for (const r of results) {
    console.log(`✓ ${r.slug}`);
    console.log(`    ${r.xlsx}`);
    console.log(`    ${r.pdf}`);
  }
  console.log(`\nGenerated ${results.length} resource Excel + PDF pairs.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
