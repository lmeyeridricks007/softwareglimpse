/**
 * Live HTTP probes for MigrationSEOAuditAgent when BASE_URL is set.
 * Samples legacy redirects, locale cutover, taxonomy 410, and chains/loops.
 */
import { normalizePath } from "@/seo/canonical";
import { normalizeMigrationPath } from "../normalize";
import { makeFinding } from "./findings";
import type { AuditCheckResult, AuditFinding } from "./types";

const UA = "SoftwareGlimpse-migration-seo-audit/1.0 (+live BASE_URL probe)";

export type LiveProbeSample = {
  path: string;
  /** Expected final status after redirects (200 / 301-chain end / 410 / 404). */
  expectFinalStatus: number | number[];
  /** When set, final pathname must match (normalizePath). */
  expectFinalPath?: string;
  /** Expect at least one permanent redirect hop (301/308). */
  expectRedirect?: boolean;
  /** Locale paths must never land as multilingual 200 on a /xx/… URL. */
  forbidLocaleFinal200?: boolean;
  label: string;
};

/** Representative live sample set — not exhaustive crawl. */
export const MIGRATION_LIVE_SAMPLES: LiveProbeSample[] = [
  {
    path: "/5-ways-marketing-apis-boost-your-marketing-operations/",
    expectFinalStatus: 200,
    expectRedirect: true,
    label: "legacy EN root redirect",
  },
  {
    path: "/category/crm/",
    expectFinalStatus: 200,
    expectFinalPath: "/categories/crm/",
    expectRedirect: true,
    label: "legacy WP category → categories hub",
  },
  {
    path: "/fr/mon-histoire/",
    expectFinalStatus: 200,
    expectFinalPath: "/company/my-story/",
    expectRedirect: true,
    forbidLocaleFinal200: true,
    label: "locale mapped permanent redirect",
  },
  {
    path: "/fr/",
    expectFinalStatus: 410,
    forbidLocaleFinal200: true,
    label: "locale root intentional 410",
  },
  {
    path: "/de/",
    expectFinalStatus: 410,
    forbidLocaleFinal200: true,
    label: "locale root intentional 410",
  },
  {
    path: "/tag/pipedrive/",
    expectFinalStatus: 410,
    label: "WP tag taxonomy 410",
  },
  {
    path: "/category/random-thin-tag-xyz/",
    expectFinalStatus: 410,
    label: "unmapped WP category 410",
  },
  {
    path: "/this-page-should-404-seo-audit-xyz/",
    expectFinalStatus: 404,
    label: "true 404 experience",
  },
];

type HopResult = {
  path: string;
  statusCode: number;
  finalUrl: string;
  finalPath: string;
  redirectChain: string[];
  hopStatuses: number[];
  error?: string;
};

async function probePath(
  baseUrl: string,
  samplePath: string,
  maxHops = 5,
): Promise<HopResult> {
  const start = `${baseUrl.replace(/\/$/, "")}${normalizeMigrationPath(samplePath)}`;
  const redirectChain: string[] = [];
  const hopStatuses: number[] = [];
  let url = start;

  try {
    for (let hop = 0; hop <= maxHops; hop++) {
      const res = await fetch(url, {
        method: "GET",
        redirect: "manual",
        headers: { Accept: "text/html", "User-Agent": UA },
      });
      hopStatuses.push(res.status);

      if (res.status >= 300 && res.status < 400) {
        const loc = res.headers.get("location");
        if (!loc) {
          return {
            path: samplePath,
            statusCode: res.status,
            finalUrl: url,
            finalPath: normalizePath(new URL(url).pathname),
            redirectChain,
            hopStatuses,
            error: "redirect without Location",
          };
        }
        redirectChain.push(`${res.status}→${loc}`);
        url = new URL(loc, url).toString();
        continue;
      }

      // Drain body so sockets close cleanly
      await res.arrayBuffer().catch(() => undefined);
      const finalPath = normalizePath(new URL(url).pathname);
      return {
        path: samplePath,
        statusCode: res.status,
        finalUrl: url,
        finalPath,
        redirectChain,
        hopStatuses,
      };
    }
    return {
      path: samplePath,
      statusCode: 0,
      finalUrl: url,
      finalPath: normalizePath(new URL(url).pathname),
      redirectChain,
      hopStatuses,
      error: "redirect loop or max hops exceeded",
    };
  } catch (err) {
    return {
      path: samplePath,
      statusCode: 0,
      finalUrl: start,
      finalPath: normalizeMigrationPath(samplePath),
      redirectChain,
      hopStatuses,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

function statusMatches(actual: number, expected: number | number[]): boolean {
  return Array.isArray(expected)
    ? expected.includes(actual)
    : actual === expected;
}

export async function runMigrationLiveProbes(input: {
  baseUrl: string;
  samples?: LiveProbeSample[];
  extraRedirectSources?: Array<{ source: string; destination: string }>;
}): Promise<{ findings: AuditFinding[]; check: AuditCheckResult }> {
  const baseUrl = input.baseUrl.replace(/\/$/, "");
  const findings: AuditFinding[] = [];
  const samples = [...(input.samples ?? MIGRATION_LIVE_SAMPLES)];

  // High-risk / curated redirect samples (cap to keep runtime bounded)
  for (const row of (input.extraRedirectSources ?? []).slice(0, 25)) {
    samples.push({
      path: row.source,
      expectFinalStatus: 200,
      expectFinalPath: normalizePath(row.destination),
      expectRedirect: true,
      forbidLocaleFinal200: row.source.match(/^\/(fr|de|es|nl|zh|ar|hi)\//i)
        ? true
        : undefined,
      label: `configured redirect ${row.source}`,
    });
  }

  const results = await Promise.all(
    samples.map((s) => probePath(baseUrl, s.path)),
  );

  for (let i = 0; i < samples.length; i++) {
    const sample = samples[i]!;
    const result = results[i]!;

    if (result.error || result.statusCode === 0) {
      findings.push(
        makeFinding({
          check: "live_http_probes",
          severity: "P0",
          subject: sample.path,
          problem: `Live probe failed (${sample.label})`,
          evidence: result.error ?? `status=${result.statusCode} chain=${result.redirectChain.join(" | ")}`,
          recommendedAction: "Confirm BASE_URL is reachable and retry",
        }),
      );
      continue;
    }

    if (result.redirectChain.length >= 5 || result.error?.includes("loop")) {
      findings.push(
        makeFinding({
          check: "live_http_probes",
          severity: "P0",
          subject: sample.path,
          problem: "Redirect loop or excessive hop chain",
          evidence: result.redirectChain.join(" | ") || result.error || "max hops",
          recommendedAction: "Break the loop; use a single permanent hop to the canonical",
        }),
      );
    } else if (result.redirectChain.length > 1) {
      findings.push(
        makeFinding({
          check: "live_http_probes",
          severity: "P1",
          subject: sample.path,
          problem: "Redirect chain (>1 hop)",
          evidence: result.redirectChain.join(" | "),
          recommendedAction: "Collapse to a single permanent redirect to the final canonical",
        }),
      );
    }

    if (sample.expectRedirect && result.redirectChain.length === 0) {
      findings.push(
        makeFinding({
          check: "live_http_probes",
          severity: "P1",
          subject: sample.path,
          problem: `Expected permanent redirect (${sample.label}) but got direct ${result.statusCode}`,
          evidence: `final=${result.finalPath} status=${result.statusCode}`,
          recommendedAction: "Restore the configured 301/308 for this legacy URL",
        }),
      );
    }

    if (!statusMatches(result.statusCode, sample.expectFinalStatus)) {
      const severity =
        sample.expectFinalStatus === 410 ||
        (Array.isArray(sample.expectFinalStatus) &&
          sample.expectFinalStatus.includes(410))
          ? "P0"
          : "P1";
      findings.push(
        makeFinding({
          check: "live_http_probes",
          severity,
          subject: sample.path,
          problem: `Unexpected final HTTP status (${sample.label})`,
          evidence: `expected ${JSON.stringify(sample.expectFinalStatus)} got ${result.statusCode}; final=${result.finalPath}; chain=${result.redirectChain.join(" | ") || "none"}`,
          recommendedAction: "Align Proxy/redirects with migration policy",
        }),
      );
    }

    if (
      sample.expectFinalPath &&
      result.finalPath !== normalizePath(sample.expectFinalPath)
    ) {
      findings.push(
        makeFinding({
          check: "live_http_probes",
          severity: "P1",
          subject: sample.path,
          problem: `Redirect landed on wrong destination (${sample.label})`,
          evidence: `expected ${sample.expectFinalPath} got ${result.finalPath}`,
          recommendedAction: "Fix redirect destination to the canonical English page",
        }),
      );
    }

    if (sample.forbidLocaleFinal200) {
      const localeFinal = /^\/(fr|de|es|nl|zh|ar|hi)(\/|$)/i.test(
        result.finalPath,
      );
      if (result.statusCode === 200 && localeFinal) {
        findings.push(
          makeFinding({
            check: "live_http_probes",
            severity: "P0",
            subject: sample.path,
            problem: "Locale URL restored as multilingual 200 (English-only policy)",
            evidence: `final=${result.finalPath} status=200`,
            recommendedAction:
              "Never restore locale pages; 301 to English absorb or keep 410",
          }),
        );
      }
    }
  }

  const check: AuditCheckResult = {
    id: "live_http_probes",
    title: "Live HTTP redirect / 410 / locale probes",
    status:
      findings.length === 0
        ? "pass"
        : findings.some((f) => f.severity === "P0")
          ? "fail"
          : "warn",
    summary:
      findings.length === 0
        ? `Probed ${samples.length} URLs against ${baseUrl} — no issues`
        : `Probed ${samples.length} URLs against ${baseUrl} — ${findings.length} finding(s)`,
    findingCount: findings.length,
  };

  return { findings, check };
}
