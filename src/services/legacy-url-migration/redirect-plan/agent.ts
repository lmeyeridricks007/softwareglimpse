import fs from "node:fs";
import path from "node:path";
import { generateRedirectPlan } from "./generate";
import { renderRedirectManifestMarkdown } from "./report";
import { REDIRECT_PLAN_GENERATOR } from "./types";
import type { UrlMappingRow } from "../mapping-agent/types";

export type RedirectPlanGeneratorOptions = {
  write?: boolean;
  mappingRows?: UrlMappingRow[];
  generatedAt?: string;
};

export type RedirectPlanGeneratorResult = {
  agent: typeof REDIRECT_PLAN_GENERATOR;
  redirects: number;
  manualExcluded: number;
  chainsFlattened: number;
  validationErrors: string[];
  paths: {
    config: string;
    markdown: string;
    manifestJson: string;
  };
};

/**
 * RedirectPlanGenerator — write approved permanent redirects + manifests.
 * Does not invent mappings. Does not implement low-confidence rows.
 */
export function runRedirectPlanGenerator(
  opts: RedirectPlanGeneratorOptions = {},
): RedirectPlanGeneratorResult {
  const write = opts.write !== false;
  const plan = generateRedirectPlan({
    mappingRows: opts.mappingRows,
    generatedAt: opts.generatedAt,
  });

  const paths = {
    config: path.join(process.cwd(), "config", "legacy-redirects.json"),
    markdown: path.join(
      process.cwd(),
      "docs/migration/04-redirect-manifest.md",
    ),
    manifestJson: path.join(
      process.cwd(),
      "docs/migration/data/redirect-manifest.json",
    ),
  };

  if (write) {
    fs.mkdirSync(path.dirname(paths.config), { recursive: true });
    fs.mkdirSync(path.dirname(paths.manifestJson), { recursive: true });
    fs.writeFileSync(
      paths.config,
      `${JSON.stringify(plan.file, null, 2)}\n`,
    );
    fs.writeFileSync(
      paths.manifestJson,
      `${JSON.stringify(plan.manifest, null, 2)}\n`,
    );
    // Mark implemented entries as pass after static validation succeeded
    const manifestForDoc = plan.manifest.map((m) =>
      m.implemented && plan.validationErrors.length === 0
        ? { ...m, testStatus: "pass" as const }
        : m,
    );
    fs.writeFileSync(
      paths.markdown,
      renderRedirectManifestMarkdown({
        file: plan.file,
        manifest: manifestForDoc,
        validationErrors: plan.validationErrors,
      }),
    );
  }

  return {
    agent: REDIRECT_PLAN_GENERATOR,
    redirects: plan.file.stats.redirects,
    manualExcluded: plan.file.stats.manualExcluded,
    chainsFlattened: plan.file.stats.chainsFlattened,
    validationErrors: plan.validationErrors,
    paths,
  };
}
