import { getSiteUrl } from "@/lib/site";
import { DIGITAL_PR_COMPETITOR_PAIRS } from "@/data/config/seo/digital-pr-competitor-pairs";
import { hostnameOf, targetMatchesUrl } from "./ingest";
import { isExampleOrPlaceholderDomain } from "./validity";
import type { CompetitorLinkGap, CompetitorPagePair, LoadedBacklinkExport } from "./types";

function siteUrl(pathName: string): string {
  return `${getSiteUrl().replace(/\/$/, "")}${pathName}`;
}

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

/**
 * Compute competitor link gaps from an imported backlink export.
 * Returns empty gaps with explanatory notes when no export is available —
 * never fabricates referring domains or authority metrics.
 */
export function computeCompetitorLinkGaps(
  exportData: LoadedBacklinkExport | null,
  pairs: CompetitorPagePair[] = DIGITAL_PR_COMPETITOR_PAIRS,
): CompetitorLinkGap[] {
  if (!exportData || exportData.rows.length === 0) {
    return pairs.map((pair) => ({
      softwareGlimpsePath: pair.softwareGlimpsePath,
      competitorUrl: pair.competitorUrls[0] ?? "",
      domainsLinkingToCompetitor: 0,
      domainsAlsoLinkingToSoftwareGlimpse: 0,
      domainsNotLinkingToSoftwareGlimpse: 0,
      competitorCountReceivingLink: 0,
      topicalRelevance: themeRelevance(pair.theme),
      authorityMetricAverage: null,
      opportunityScore: 0,
      sampleDomains: [],
      notes: [
        "No backlink export loaded — import Ahrefs/Semrush CSV/JSON under data/seo/imports/ before scoring gaps.",
        "Competitor URLs are curated seeds only; link counts are not invented.",
      ],
    }));
  }

  const sgHost = hostnameOf(getSiteUrl()) ?? "softwareglimpse.com";
  const gaps: CompetitorLinkGap[] = [];

  for (const pair of pairs) {
    const sgUrl = siteUrl(pair.softwareGlimpsePath);
    const domainsToSg = new Set(
      exportData.rows
        .filter((r) => targetMatchesUrl(r.targetUrl, sgUrl) || hostIsOurs(r.targetUrl, sgHost))
        .map((r) => r.domain),
    );

    for (const competitorUrl of pair.competitorUrls) {
      const rowsToCompetitor = exportData.rows.filter((r) =>
        targetMatchesUrl(r.targetUrl, competitorUrl),
      );
      const domainsToCompetitor = new Set(rowsToCompetitor.map((r) => r.domain));

      let competitorsReceiving = 0;
      for (const other of pair.competitorUrls) {
        const has = exportData.rows.some((r) =>
          targetMatchesUrl(r.targetUrl, other),
        );
        if (has) competitorsReceiving += 1;
      }

      const notLinking = [...domainsToCompetitor].filter(
        (d) =>
          !domainsToSg.has(d) &&
          !isExampleOrPlaceholderDomain(d) &&
          d !== sgHost &&
          !d.endsWith(`.${sgHost}`),
      );
      const alsoLinking = [...domainsToCompetitor].filter((d) =>
        domainsToSg.has(d),
      );

      const authorityValues = rowsToCompetitor
        .map((r) => r.domainRating ?? r.domainAuthority)
        .filter((n): n is number => typeof n === "number");
      const authorityMetricAverage =
        authorityValues.length > 0
          ? authorityValues.reduce((a, b) => a + b, 0) / authorityValues.length
          : null;

      const topicalRelevance = themeRelevance(pair.theme);
      const opportunityScore = clamp(
        topicalRelevance * 0.45 +
          Math.min(notLinking.length * 3, 35) +
          Math.min(competitorsReceiving * 5, 15) +
          (authorityMetricAverage != null
            ? Math.min(authorityMetricAverage * 0.15, 15)
            : 0) -
          alsoLinking.length * 2,
      );

      gaps.push({
        softwareGlimpsePath: pair.softwareGlimpsePath,
        competitorUrl,
        domainsLinkingToCompetitor: domainsToCompetitor.size,
        domainsAlsoLinkingToSoftwareGlimpse: alsoLinking.length,
        domainsNotLinkingToSoftwareGlimpse: notLinking.length,
        competitorCountReceivingLink: competitorsReceiving,
        topicalRelevance,
        authorityMetricAverage:
          authorityMetricAverage != null
            ? Math.round(authorityMetricAverage * 10) / 10
            : null,
        opportunityScore,
        sampleDomains: notLinking.slice(0, 12),
        notes:
          domainsToCompetitor.size === 0
            ? [
                "Export contains no rows targeting this competitor URL — gap is informational only.",
              ]
            : [
                `${notLinking.length} referring domain(s) link to competitor but not observed linking to SoftwareGlimpse in this export.`,
              ],
      });
    }
  }

  return gaps.sort((a, b) => b.opportunityScore - a.opportunityScore);
}

function hostIsOurs(targetUrl: string, sgHost: string): boolean {
  const h = hostnameOf(targetUrl);
  return Boolean(h && (h === sgHost || h.endsWith(`.${sgHost}`)));
}

function themeRelevance(theme: string): number {
  if (theme.includes("pricing") || theme.includes("history")) return 90;
  if (theme.includes("finder") || theme.includes("calculator")) return 80;
  if (theme.includes("best-") || theme.includes("best")) return 85;
  if (theme.includes("decision-guide")) return 82;
  if (theme.includes("category")) return 78;
  if (theme.includes("methodology")) return 70;
  return 60;
}
