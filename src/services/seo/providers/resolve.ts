import { GoogleSearchConsoleProvider } from "./gsc-provider";
import { FixtureSearchPerformanceProvider } from "./fixture-provider";
import { ImportSearchPerformanceProvider } from "./import-provider";
import type { SearchPerformanceProvider } from "./search-performance-provider";

export function isGscConfigured(): boolean {
  return Boolean(
    process.env.GSC_PROPERTY_URL &&
      (process.env.GSC_CLIENT_EMAIL ||
        process.env.GOOGLE_APPLICATION_CREDENTIALS),
  );
}

export type ResolveSearchPerformanceOptions = {
  /** Force fixture provider. */
  fixture?: boolean | string;
  /** Path to approved GSC-shaped JSON import. */
  importPath?: string;
  /** Prefer live GSC when configured (still stub until client ships). */
  preferGsc?: boolean;
  /** Allow empty GSC response when unconfigured (local pipelines). */
  allowEmptyGsc?: boolean;
};

/**
 * Resolve the approved Search Console / performance data connector.
 *
 * Order:
 * 1. `--import` approved JSON (not scraping)
 * 2. Live GSC when env configured (client may still be unimplemented)
 * 3. Fixture (explicitly synthetic)
 *
 * Never invents credentials. Never scrapes Google Search Console HTML.
 */
export function resolveSearchPerformanceProvider(
  opts: ResolveSearchPerformanceOptions = {},
): {
  provider: SearchPerformanceProvider;
  mode: "import" | "gsc" | "fixture";
  notes: string[];
} {
  const notes: string[] = [];

  if (opts.importPath) {
    notes.push(`Using approved import file: ${opts.importPath}`);
    return {
      provider: new ImportSearchPerformanceProvider(opts.importPath, {
        treatAsLive: true,
      }),
      mode: "import",
      notes,
    };
  }

  if (opts.preferGsc !== false && isGscConfigured() && !opts.fixture) {
    notes.push(
      "GSC env present — using GoogleSearchConsoleProvider (live client required)",
    );
    return {
      provider: new GoogleSearchConsoleProvider({
        allowEmpty: opts.allowEmptyGsc,
      }),
      mode: "gsc",
      notes,
    };
  }

  const fixtureName =
    typeof opts.fixture === "string"
      ? opts.fixture
      : "synthetic-28d-current.json";
  notes.push(
    `Using synthetic fixture ${fixtureName} — not live SoftwareGlimpse GSC`,
  );
  if (!isGscConfigured()) {
    notes.push(
      "GSC not configured (set GSC_PROPERTY_URL + GSC_CLIENT_EMAIL or GOOGLE_APPLICATION_CREDENTIALS)",
    );
  }
  return {
    provider: new FixtureSearchPerformanceProvider(fixtureName),
    mode: "fixture",
    notes,
  };
}

export {
  GoogleSearchConsoleProvider,
  FixtureSearchPerformanceProvider,
  ImportSearchPerformanceProvider,
};
