import fs from "node:fs";
import path from "node:path";
import type { LegacyRedirectsFile } from "./types";

/** In-app aliases used only for destination resolution checks. */
export const PATH_ALIASES_FOR_VALIDATION: Record<string, string> = {
  "/features/call-functionality": "/features/calling/",
  "/features/call-functionality/": "/features/calling/",
  "/features/reporting": "/features/reporting-dashboards/",
  "/features/reporting/": "/features/reporting-dashboards/",
};

export function legacyRedirectsConfigPath(): string {
  return path.join(process.cwd(), "config", "legacy-redirects.json");
}

export function loadLegacyRedirectsFile(
  filePath: string = legacyRedirectsConfigPath(),
): LegacyRedirectsFile {
  const raw = JSON.parse(fs.readFileSync(filePath, "utf8")) as LegacyRedirectsFile;
  return raw;
}

/**
 * Shape consumed by next.config.ts `redirects()`.
 * Emits both slash variants for each source.
 */
export function toNextConfigRedirects(
  file: LegacyRedirectsFile = loadLegacyRedirectsFile(),
): Array<{ source: string; destination: string; permanent: boolean }> {
  const out: Array<{
    source: string;
    destination: string;
    permanent: boolean;
  }> = [];
  const seen = new Set<string>();

  for (const row of file.redirects) {
    const destination = row.destination.endsWith("/")
      ? row.destination
      : `${row.destination}/`;
    const sources =
      row.source === "/"
        ? ["/"]
        : [
            row.source.replace(/\/$/, ""),
            row.source.endsWith("/") ? row.source : `${row.source}/`,
          ];
    for (const source of sources) {
      if (seen.has(source)) continue;
      seen.add(source);
      out.push({
        source,
        destination,
        permanent: row.permanent !== false,
      });
    }
  }
  return out;
}
