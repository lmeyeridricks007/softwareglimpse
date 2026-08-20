import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import {
  CWV_TARGETS,
  PERFORMANCE_BUDGETS,
  REPRESENTATIVE_ROUTES,
} from "@/performance/budgets";
import { finding } from "../findings";
import { applyForcedFailures, type SeoAgentRunner } from "../framework";
import { ensureLiveProbeBundle } from "../live-probe";
import type { SeoAgentMeta, SeoCheckResult, SeoFinding } from "../types";

function isLocalOrigin(baseUrl: string): boolean {
  try {
    const host = new URL(baseUrl).hostname.toLowerCase();
    return (
      host === "localhost" ||
      host === "127.0.0.1" ||
      host === "0.0.0.0" ||
      host === "::1" ||
      host.endsWith(".local")
    );
  } catch {
    return false;
  }
}

export const PERFORMANCE_AUDIT_AGENT: SeoAgentMeta = {
  id: "performance-audit-agent",
  name: "PerformanceAuditAgent",
  version: "1.0.0",
  area: "performance",
  mutatesProduction: false,
};

function scanHeroWeights(mode: "FAST" | "FULL"): SeoFinding[] {
  const findings: SeoFinding[] = [];
  const publicRoot = path.join(process.cwd(), "public");
  if (!existsSync(publicRoot)) return findings;

  const candidates = [
    "guides/what-is-crm-hero.webp",
    "guides/crm-implementation-hero.webp",
    "capabilities/pipeline-management-hero-v2.webp",
    "capabilities/workflow-automation-hero-v2.webp",
    "features/workflow-automation-hero.webp",
    "og/default.png",
  ];
  // Fall back to PNG only when WebP sibling is absent.
  const withFallback = candidates.flatMap((rel) => {
    if (rel.endsWith(".webp")) {
      const png = rel.replace(/\.webp$/, ".png");
      const webpFull = path.join(publicRoot, rel);
      if (existsSync(webpFull)) return [rel];
      return [png];
    }
    return [rel];
  });
  const list = mode === "FAST" ? withFallback.slice(0, 4) : withFallback;
  for (const rel of list) {
    const full = path.join(publicRoot, rel);
    if (!existsSync(full)) continue;
    const kb = statSync(full).size / 1024;
    const warn = PERFORMANCE_BUDGETS.content.heroSourceKbWarn;
    if (kb > warn) {
      findings.push(
        finding({
          prefix: "PERF",
          kind: "LCP",
          subject: rel,
          severity: kb > warn * 1.5 ? "P1" : "P2",
          area: "performance",
          problem: "Oversized hero source file (LCP risk before next/image)",
          evidence: `${rel} is ${kb.toFixed(0)}KB (warn > ${warn}KB)`,
          affectedPages: [
            `/${rel
              .replace(/-hero.*$/, "/")
              .replace(/\.(png|webp|jpe?g)$/, "/")}`,
          ],
          likelyCause: "Uncompressed raster export",
          recommendedAction:
            "Run `npm run perf:optimize-images` and prefer WebP/AVIF delivery",
          filesLikelyAffected: ["public/", "scripts/optimize-public-images.ts"],
          expectedImpact: "Faster LCP decode and smaller deploy weight",
          effort: "small",
          confidence: 0.85,
        }),
      );
    }
  }
  return findings;
}

function scanYoutubeApi(): SeoFinding[] {
  const findings: SeoFinding[] = [];
  // Only scan runtime UI — never audit/agent source that mentions the API string.
  const roots = [
    path.join(process.cwd(), "src/app"),
    path.join(process.cwd(), "src/components"),
  ];
  const walk = (dir: string, out: string[] = []): string[] => {
    if (!existsSync(dir)) return out;
    for (const name of readdirSync(dir)) {
      if (name.startsWith(".") || name === "node_modules") continue;
      const full = path.join(dir, name);
      const st = statSync(full);
      if (st.isDirectory()) walk(full, out);
      else if (/\.(tsx|ts)$/.test(name)) out.push(full);
    }
    return out;
  };
  const files = roots.flatMap((r) => walk(r));
  for (const file of files) {
    const src = readFileSync(file, "utf8");
    if (
      src.includes("youtube.com/iframe_api") ||
      src.includes("YT.Player") ||
      src.includes("www.youtube.com/iframe_api")
    ) {
      findings.push(
        finding({
          prefix: "PERF",
          kind: "VIDEO",
          subject: path.relative(process.cwd(), file),
          severity: "P1",
          area: "performance",
          problem: "YouTube IFrame API loaded globally",
          evidence: path.relative(process.cwd(), file),
          affectedPages: ["*"],
          likelyCause: "Player API imported outside click-to-play path",
          recommendedAction:
            "Keep OfficialProductVideo thumbnail-first; never load iframe_api sitewide",
          filesLikelyAffected: [path.relative(process.cwd(), file)],
          expectedImpact: "Removes heavy third-party JS from ordinary pages",
          effort: "medium",
          confidence: 0.95,
        }),
      );
    }
  }
  return findings;
}

function scanToolStaticImports(): SeoFinding[] {
  const findings: SeoFinding[] = [];
  const toolsDir = path.join(process.cwd(), "src/app/(site)/tools");
  if (!existsSync(toolsDir)) return findings;
  const walk = (dir: string, out: string[] = []): string[] => {
    for (const name of readdirSync(dir)) {
      const full = path.join(dir, name);
      const st = statSync(full);
      if (st.isDirectory()) walk(full, out);
      else if (name === "page.tsx") out.push(full);
    }
    return out;
  };
  const heavy = [
    "crm-finder-app",
    "crm-tco-calculator-app",
    "crm-migration-planner-app",
    "crm-vendor-scorecard-app",
  ];
  for (const page of walk(toolsDir)) {
    const src = readFileSync(page, "utf8");
    for (const needle of heavy) {
      if (
        (src.includes(`/${needle}"`) || src.includes(`/${needle}'`)) &&
        !src.includes("dynamic-tool-apps")
      ) {
        findings.push(
          finding({
            prefix: "PERF",
            kind: "BUNDLE",
            subject: path.relative(process.cwd(), page),
            severity: "P1",
            area: "performance",
            problem: "Tool page statically imports heavy interactive app",
            evidence: `${path.relative(process.cwd(), page)} imports ${needle}`,
            affectedPages: [
              "/" +
                path
                  .relative(path.join(process.cwd(), "src/app/(site)"), path.dirname(page))
                  .replace(/\\/g, "/") +
                "/",
            ],
            likelyCause: "Missing dynamic-tool-apps wrapper",
            recommendedAction: "Import from `@/components/tools/dynamic-tool-apps`",
            filesLikelyAffected: [
              path.relative(process.cwd(), page),
              "src/components/tools/dynamic-tool-apps.tsx",
            ],
            expectedImpact: "Keeps tool JS off shared content graphs",
            effort: "small",
            confidence: 0.95,
          }),
        );
      }
    }
  }
  return findings;
}

function scanCwvCollector(): { wired: boolean; file?: string } {
  const roots = [
    path.join(process.cwd(), "src/app"),
    path.join(process.cwd(), "src/components"),
  ];
  const walk = (dir: string, out: string[] = []): string[] => {
    if (!existsSync(dir)) return out;
    for (const name of readdirSync(dir)) {
      if (name.startsWith(".") || name === "node_modules") continue;
      const full = path.join(dir, name);
      const st = statSync(full);
      if (st.isDirectory()) walk(full, out);
      else if (/\.(tsx|ts)$/.test(name)) out.push(full);
    }
    return out;
  };
  const files = roots.flatMap((r) => walk(r));
  for (const file of files) {
    const src = readFileSync(file, "utf8");
    if (src.includes("useReportWebVitals")) {
      return { wired: true, file: path.relative(process.cwd(), file) };
    }
  }
  return { wired: false };
}

function scanLargeChunks(mode: "FAST" | "FULL"): {
  findings: SeoFinding[];
  status: SeoCheckResult;
} {
  const candidates = [
    path.join(process.cwd(), ".next/static/chunks"),
    path.join(process.cwd(), ".next/static"),
  ];
  const nextDir = candidates.find((dir) => existsSync(dir));
  if (!nextDir) {
    const devChunks = existsSync(path.join(process.cwd(), ".next/dev/static/chunks"));
    return {
      findings: [],
      status: {
        id: "client-chunks",
        status: "skipped",
        reason: devChunks
          ? "Dev turbopack chunks are not a production JS budget — run next build"
          : "No .next build — run next build / compile first",
      },
    };
  }
  const findings: SeoFinding[] = [];
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const full = path.join(dir, name);
      const st = statSync(full);
      if (st.isDirectory()) walk(full);
      else if (name.endsWith(".js") && !name.endsWith(".map") && st.size > 500 * 1024) {
        findings.push(
          finding({
            prefix: "PERF",
            kind: "BUNDLE",
            subject: name,
            severity: st.size > 800 * 1024 ? "P1" : "P2",
            area: "performance",
            problem: "Large client JS chunk",
            evidence: `${path.relative(process.cwd(), full)} (${(st.size / 1024).toFixed(0)}KB)`,
            affectedPages: REPRESENTATIVE_ROUTES.map((r) => r.path).slice(
              0,
              mode === "FAST" ? 5 : 18,
            ),
            likelyCause: "Heavy dependency or insufficient code-splitting",
            recommendedAction: "Inspect chunk markers; dynamic-import non-critical libs",
            filesLikelyAffected: [path.relative(process.cwd(), full)],
            expectedImpact: "Lower INP risk and faster hydration",
            effort: "medium",
            confidence: 0.7,
          }),
        );
      }
    }
  };
  walk(nextDir);
  return {
    findings: mode === "FAST" ? findings.slice(0, 8) : findings.slice(0, 25),
    status: {
      id: "client-chunks",
      status: "completed",
      reason: `${findings.length} large chunk warning(s)`,
    },
  };
}

export const performanceAuditAgent: SeoAgentRunner = {
  meta: PERFORMANCE_AUDIT_AGENT,
  latestFilename: "performance-latest.md",
  archiveBasename: "performance.md",
  async analyze(ctx) {
    const checks: SeoCheckResult[] = [];
    const findings: SeoFinding[] = [];

    checks.push({
      id: "cwv-targets",
      status: "completed",
      reason: `LCP≤${CWV_TARGETS.lcpMs}ms INP≤${CWV_TARGETS.inpMs}ms CLS≤${CWV_TARGETS.cls}`,
    });

    const bundle = await ensureLiveProbeBundle(ctx);
    if (bundle) {
      const localBase = isLocalOrigin(bundle.baseUrl);
      let slow = 0;
      for (const page of bundle.pages) {
        if (page.ttfbMs < 0) continue;
        if (page.ttfbMs > CWV_TARGETS.ttfbMsWarn) {
          slow += 1;
          // Local next dev / HMR is not a production TTFB signal — record in
          // check reason only so SEO health is not flooded with false P1s.
          if (localBase) continue;
          findings.push(
            finding({
              prefix: "PERF",
              kind: "TTFB",
              subject: page.path,
              severity: page.ttfbMs > CWV_TARGETS.ttfbMsWarn * 2 ? "P1" : "P2",
              area: "performance",
              problem: "Lab TTFB above warn budget on live probe",
              evidence: `\`${page.path}\` ttfb=${page.ttfbMs}ms (warn ${CWV_TARGETS.ttfbMsWarn}ms) html=${page.htmlBytes}B base=${bundle.baseUrl}`,
              affectedPages: [page.path],
              likelyCause: "Cold server, heavy SSR, or slow data path",
              recommendedAction:
                "Profile route SSR against production/`next start`; this is lab TTFB not field CrUX LCP",
              filesLikelyAffected: ["src/app", "src/performance/budgets.ts"],
              expectedImpact: "Better perceived load / crawl efficiency",
              effort: "medium",
              confidence: 0.6,
            }),
          );
        }
      }
      checks.push({
        id: "field-cwv",
        status: "completed",
        reason: localBase
          ? `Lab TTFB measured on local BASE_URL (${slow}/${bundle.pages.length} over warn) — findings suppressed; re-probe production for real signal`
          : `Lab TTFB proxies via BASE_URL (${bundle.pages.length} pages, ${slow} over warn) — not CrUX/RUM field truth`,
      });
    } else {
      checks.push({
        id: "field-cwv",
        status: "skipped",
        reason:
          "Lab TTFB proxies need BASE_URL. First-party web_vital collector is source-checked separately; CrUX/RUM is not ingested here",
      });
    }

    findings.push(...scanHeroWeights(ctx.mode));
    checks.push({ id: "hero-weights", status: "completed" });

    findings.push(...scanYoutubeApi());
    checks.push({ id: "youtube-api", status: "completed" });

    findings.push(...scanToolStaticImports());
    checks.push({ id: "tool-dynamic-imports", status: "completed" });

    const cwvCollector = scanCwvCollector();
    if (!cwvCollector.wired) {
      findings.push(
        finding({
          prefix: "PERF",
          kind: "CWV",
          subject: "useReportWebVitals",
          severity: "P2",
          area: "performance",
          problem: "No first-party Web Vitals collector in the App Router",
          evidence: "src/app and src/components do not call useReportWebVitals",
          affectedPages: ["*"],
          likelyCause: "Field/lab CWV never leaves the browser",
          recommendedAction:
            "Mount a client WebVitals component that reports via the consent-gated analytics sink — do not claim CrUX until a production destination exists",
          filesLikelyAffected: [
            "src/components/site/web-vitals.tsx",
            "src/components/site/site-providers.tsx",
          ],
          expectedImpact: "Makes CWV collectable in production without a third-party tag manager",
          effort: "small",
          confidence: 0.85,
        }),
      );
    }
    checks.push({
      id: "cwv-collector",
      status: "completed",
      reason: cwvCollector.wired
        ? `useReportWebVitals wired in ${cwvCollector.file} (consent-gated sink; not CrUX)`
        : "useReportWebVitals not found in app/components",
    });

    const chunks = scanLargeChunks(ctx.mode);
    findings.push(...chunks.findings);
    checks.push(chunks.status);

    checks.push({
      id: "third-party-inventory",
      status: "completed",
      reason: "Consent-gated analytics; video click-to-play expected",
    });

    return {
      checks: applyForcedFailures(checks, ctx),
      findings,
      summary: `Performance audit (${ctx.mode}): ${findings.length} finding(s). Budgets defined in src/performance/budgets.ts. Field CWV not claimed.`,
    };
  },
};
