/**
 * Writes config/comparison-reverse-redirects.json for the Edge proxy.
 * next.config cannot hold thousands of redirects (Vercel deploy rejects the
 * routes manifest). Locale cutover already uses the same proxy pattern.
 */
import fs from "node:fs";
import path from "node:path";
import { comparisonReverseRedirects } from "../../src/services/comparison-redirects";

const out = path.join(process.cwd(), "config/comparison-reverse-redirects.json");
const rules = comparisonReverseRedirects();
const map: Record<string, string> = {};
for (const rule of rules) {
  map[rule.source] = rule.destination;
}
fs.writeFileSync(out, `${JSON.stringify(map)}\n`);
console.log(
  `comparison reverse redirects: ${Object.keys(map).length} → ${out}`,
);
