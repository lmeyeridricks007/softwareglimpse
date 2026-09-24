/**
 * @vitest-environment node
 *
 * Vercel ignoreCommand: exit 0 = skip deploy, exit 1 = build.
 * Official: https://vercel.com/docs/project-configuration/vercel-json
 */
import { execFileSync } from "node:child_process";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  EXIT_BUILD,
  EXIT_SKIP,
  classifyChangedFiles,
  exitCodeForDecision,
  isAlwaysBuildPath,
  isIgnorablePath,
} from "./ignored-build-lib.mjs";

const SCRIPT = path.join(process.cwd(), "scripts/vercel/ignored-build.mjs");

function run(files: string[], env: Record<string, string> = {}) {
  try {
    execFileSync("node", [SCRIPT, "--files", ...files], {
      encoding: "utf8",
      env: { ...process.env, ...env },
    });
    return EXIT_SKIP;
  } catch (error) {
    const status = (error as { status?: number }).status;
    return status ?? EXIT_BUILD;
  }
}

describe("Vercel ignored-build exit codes", () => {
  it("skips with 0 and builds with 1 (not the inverse)", () => {
    expect(EXIT_SKIP).toBe(0);
    expect(EXIT_BUILD).toBe(1);
    expect(EXIT_SKIP).not.toBe(EXIT_BUILD);

    const skip = classifyChangedFiles(["docs/VERCEL-COST-GUARDRAILS.md"]);
    const build = classifyChangedFiles(["src/app/page.tsx"]);
    expect(exitCodeForDecision(skip)).toBe(0);
    expect(exitCodeForDecision(build)).toBe(1);
  });
});

describe("isIgnorablePath", () => {
  it("skips docs, reports, cursor rules, audit outputs, and documentation markdown", () => {
    expect(isIgnorablePath("docs/VERCEL-COST-GUARDRAILS.md")).toBe(true);
    expect(isIgnorablePath("docs/reports/vercel-image-audit.json")).toBe(true);
    expect(isIgnorablePath("reports/vercel-cost-audit/EXECUTIVE-SUMMARY.md")).toBe(
      true,
    );
    expect(isIgnorablePath("reports/vercel-cost-remediation/WAVE-0-RESULT.md")).toBe(
      true,
    );
    expect(isIgnorablePath(".cursor/rules/vercel-cost-guardrails.mdc")).toBe(
      true,
    );
    expect(isIgnorablePath(".github/workflows/engineering-quality.yml")).toBe(
      true,
    );
    expect(isIgnorablePath("content/distribution/medium/README.md")).toBe(true);
    expect(isIgnorablePath("AGENTS.md")).toBe(true);
    expect(isIgnorablePath("README.md")).toBe(true);
    expect(isIgnorablePath("CLAUDE.md")).toBe(true);
  });

  it("does not skip application code, config, dependencies, site content, images, or scripts", () => {
    expect(isAlwaysBuildPath("src/app/page.tsx")).toBe(true);
    expect(isIgnorablePath("src/data/config/site/foundation.ts")).toBe(false);
    expect(isIgnorablePath("data/seo/link-injections.json")).toBe(false);
    expect(isIgnorablePath("config/legacy-redirects.json")).toBe(false);
    expect(isIgnorablePath("public/og/default.svg")).toBe(false);
    expect(isIgnorablePath("scripts/vercel/ignored-build.mjs")).toBe(false);
    expect(isIgnorablePath("package.json")).toBe(false);
    expect(isIgnorablePath("package-lock.json")).toBe(false);
    expect(isIgnorablePath("next.config.ts")).toBe(false);
    expect(isIgnorablePath("vercel.json")).toBe(false);
    expect(isIgnorablePath("tsconfig.json")).toBe(false);
    expect(isIgnorablePath("eslint.config.mjs")).toBe(false);
    expect(isIgnorablePath("vitest.config.mts")).toBe(false);
    expect(isIgnorablePath("postcss.config.mjs")).toBe(false);
  });

  it("builds unknown non-documentation paths (fail-open)", () => {
    expect(isIgnorablePath("mystery/config.yaml")).toBe(false);
  });
});

describe("classifyChangedFiles", () => {
  it("skips when every path is documentation or audit output", () => {
    const decision = classifyChangedFiles([
      "docs/softwareglimpse/README.md",
      "reports/vercel-cost-audit/issues.csv",
      ".cursor/rules/no-speculative-vercel-deploys.mdc",
      "README.md",
    ]);
    expect(decision.skip).toBe(true);
    expect(decision.affecting).toEqual([]);
    expect(exitCodeForDecision(decision)).toBe(EXIT_SKIP);
  });

  it("builds when a docs-only commit also touches app-required data", () => {
    const decision = classifyChangedFiles([
      "docs/seo/notes.md",
      "data/seo/link-injections.json",
    ]);
    expect(decision.skip).toBe(false);
    expect(decision.affecting).toEqual(["data/seo/link-injections.json"]);
    expect(exitCodeForDecision(decision)).toBe(EXIT_BUILD);
  });

  it("builds when src, public images, config, or lockfile change", () => {
    expect(classifyChangedFiles(["src/lib/site.ts"]).skip).toBe(false);
    expect(classifyChangedFiles(["public/brand/mark.svg"]).skip).toBe(false);
    expect(classifyChangedFiles(["config/legacy-redirects.json"]).skip).toBe(
      false,
    );
    expect(classifyChangedFiles(["package-lock.json"]).skip).toBe(false);
  });
});

describe("ignored-build CLI exit codes", () => {
  it("uses Vercel inverted exit codes: 0 skip, 1 build", () => {
    expect(run(["docs/softwareglimpse/README.md", "reports/audits/x.md"])).toBe(
      EXIT_SKIP,
    );
    expect(run(["src/app/page.tsx"])).toBe(EXIT_BUILD);
    expect(run(["docs/foo.md", "package.json"])).toBe(EXIT_BUILD);
    expect(run(["data/seo/link-injections.json"])).toBe(EXIT_BUILD);
    expect(run(["public/og/default.svg"])).toBe(EXIT_BUILD);
    expect(run(["scripts/build-search-index.ts"])).toBe(EXIT_BUILD);
  });

  it("FORCE_VERCEL_BUILD always proceeds", () => {
    expect(run(["docs/softwareglimpse/README.md"], { FORCE_VERCEL_BUILD: "1" })).toBe(
      EXIT_BUILD,
    );
  });
});
