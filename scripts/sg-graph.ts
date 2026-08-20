#!/usr/bin/env npx tsx
import { describeProductGraph } from "../src/services/graph/resolve-relationships";
import {
  assessSoftwareCompleteness,
  formatCompletenessReport,
} from "../src/services/completeness/software-completeness";
import { getAllSoftwareUnfiltered } from "../src/data/repositories/catalog";

const slug = process.argv[2];

if (!slug) {
  console.error("Usage: npm run sg:graph -- <software-slug>");
  process.exit(1);
}

console.log(describeProductGraph(slug));
console.log("\n--- Completeness ---\n");

const product = getAllSoftwareUnfiltered().find((item) => item.slug === slug);
if (product) {
  console.log(formatCompletenessReport(assessSoftwareCompleteness(product)));
}
