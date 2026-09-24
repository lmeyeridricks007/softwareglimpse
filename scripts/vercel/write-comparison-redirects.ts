/**
 * Writes config/comparison-reverse-redirects.json for next.config redirects().
 * next.config cannot import the catalogue (`@/` aliases are not available there).
 */
import fs from "node:fs";
import path from "node:path";
import { comparisonReverseRedirects } from "../../src/services/comparison-redirects";

const out = path.join(process.cwd(), "config/comparison-reverse-redirects.json");
const rules = comparisonReverseRedirects();
fs.writeFileSync(out, `${JSON.stringify(rules)}\n`);
console.log(`comparison reverse redirects: ${rules.length} → ${out}`);
