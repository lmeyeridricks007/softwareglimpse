import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Stack, Grid } from "@/components/layout/stack";
import type {
  DataValidity,
  GrowthDashboardReport,
  LifecycleBucketCounts,
  MetricValue,
  NorthStarObjectiveStatus,
} from "@/services/seo/growth-dashboard";

function fmt(m: MetricValue): string {
  if (m.kind === "not_connected") return m.label ?? "not connected";
  if (m.kind === "percent") return `${m.value.toFixed(2)}%`;
  if (m.kind === "number") {
    return Number.isInteger(m.value)
      ? m.value.toLocaleString()
      : m.value.toLocaleString(undefined, { maximumFractionDigits: 1 });
  }
  return m.value;
}

function statusBadge(status: string): React.ReactNode {
  const variant =
    status === "connected" ||
    status === "on_track" ||
    status === "REAL" ||
    status === "strong"
      ? "success"
      : status === "partial" ||
          status === "building" ||
          status === "insufficient_trend" ||
          status === "STALE" ||
          status === "FIXTURE"
        ? "warning"
        : status === "behind" || status === "weak" || status === "danger"
          ? "danger"
          : "neutral";
  return <Badge variant={variant}>{status.replace(/_/g, " ")}</Badge>;
}

function pillarVariant(
  status: NorthStarObjectiveStatus,
): "success" | "warning" | "danger" | "neutral" {
  if (status === "on_track") return "success";
  if (status === "building" || status === "insufficient_trend") return "warning";
  if (status === "behind") return "danger";
  return "neutral";
}

function MetricCell({
  label,
  metric,
}: {
  label: string;
  metric: MetricValue;
}) {
  const disconnected = metric.kind === "not_connected";
  return (
    <div className="min-w-0">
      <div className="text-[var(--sg-text-caption)] text-[var(--sg-color-text-muted)]">
        {label}
      </div>
      <div
        className={
          disconnected
            ? "mt-1 text-sm italic text-[var(--sg-color-text-muted)]"
            : "mt-1 text-lg font-semibold tabular-nums"
        }
      >
        {fmt(metric)}
      </div>
      {metric.kind !== "not_connected" && metric.note ? (
        <div className="mt-0.5 text-[11px] text-[var(--sg-color-text-muted)]">
          {metric.note}
        </div>
      ) : null}
    </div>
  );
}

function Section({
  title,
  status,
  validity,
  children,
}: {
  title: string;
  status?: string;
  validity?: DataValidity;
  children: React.ReactNode;
}) {
  return (
    <Card as="section">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <h2 className="text-lg font-semibold">{title}</h2>
        {status ? statusBadge(status) : null}
        {validity ? statusBadge(validity) : null}
      </div>
      {children}
    </Card>
  );
}

function LifecycleGrid({
  label,
  buckets,
}: {
  label: string;
  buckets: LifecycleBucketCounts;
}) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold">{label}</h3>
      <Grid cols={3} gap={3}>
        <MetricCell
          label="Total"
          metric={{ kind: "number", value: buckets.total }}
        />
        <MetricCell
          label="Indexable"
          metric={{ kind: "number", value: buckets.indexable }}
        />
        <MetricCell
          label="Improve"
          metric={{ kind: "number", value: buckets.improve }}
        />
        <MetricCell
          label="Improving"
          metric={{ kind: "number", value: buckets.improving }}
        />
        <MetricCell
          label="Ready for promotion"
          metric={{ kind: "number", value: buckets.readyForPromotion }}
        />
        <MetricCell
          label="Manual review"
          metric={{ kind: "number", value: buckets.manualReview }}
        />
        <MetricCell
          label="Retired"
          metric={{ kind: "number", value: buckets.retired }}
        />
      </Grid>
    </div>
  );
}

export function GrowthDashboardView({
  report,
}: {
  report: GrowthDashboardReport;
}) {
  return (
    <Stack gap={6} className="mt-8">
      <Alert variant="info" title="Internal measurement only">
        Strategy: <strong>{report.strategyLabel}</strong>. Unavailable
        integrations show <strong>not connected</strong>. Validity{" "}
        <strong>FIXTURE</strong> never drives production north-star status. No
        single vanity composite score — six primary objectives.
      </Alert>

      <Section title="North-star objectives">
        <Grid cols={3} gap={4}>
          {report.scorecard.map((p) => (
            <Card key={p.id} variant="soft" className="p-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold">{p.label}</h3>
                <Badge variant={pillarVariant(p.status)}>
                  {p.status.replace(/_/g, " ")}
                </Badge>
              </div>
              <p className="mt-1 text-[11px] text-[var(--sg-color-text-muted)]">
                confidence {p.confidence} · freshness {p.dataFreshness ?? "—"} ·
                trend {p.trendAvailability}
              </p>
              <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
                {p.summary}
              </p>
              {p.gaps.length > 0 ? (
                <ul className="mt-2 list-disc space-y-0.5 pl-4 text-xs text-[var(--sg-color-text-muted)]">
                  {p.gaps.map((g) => (
                    <li key={g}>{g}</li>
                  ))}
                </ul>
              ) : null}
            </Card>
          ))}
        </Grid>
      </Section>

      <Section title="Weekly view">
        <Grid cols={2} gap={4}>
          <div>
            <h3 className="mb-2 text-sm font-semibold">What improved</h3>
            <ul className="list-disc space-y-1 pl-4 text-sm">
              {report.weekly.improved.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-semibold">What declined</h3>
            <ul className="list-disc space-y-1 pl-4 text-sm">
              {report.weekly.declined.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-semibold">Top actions</h3>
            <ul className="list-disc space-y-1 pl-4 text-sm">
              {report.weekly.topActions.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-semibold">Major pricing changes</h3>
            <ul className="list-disc space-y-1 pl-4 text-sm">
              {report.weekly.majorPricingChanges.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        </Grid>
      </Section>

      <Section
        title="1. Search visibility"
        status={report.organicSearch.status}
        validity={report.organicSearch.validity}
      >
        <p className="mb-4 text-sm text-[var(--sg-color-text-muted)]">
          {report.organicSearch.sourceLabel ?? "No source"} · Through{" "}
          {report.organicSearch.dataThroughDate ?? "—"}
          {report.organicSearch.synthetic ? " · synthetic" : ""}
        </p>
        <h3 className="mb-2 text-sm font-semibold">Discovery</h3>
        <Grid cols={2} gap={4} className="mb-6">
          <MetricCell
            label="Pages with impressions"
            metric={report.organicSearch.discovery.pagesWithImpressions}
          />
          <MetricCell
            label="Impressions"
            metric={report.organicSearch.discovery.impressions}
          />
        </Grid>
        <h3 className="mb-2 text-sm font-semibold">Ranking</h3>
        <Grid cols={3} gap={4} className="mb-6">
          <MetricCell
            label="Top 10"
            metric={report.organicSearch.ranking.top10}
          />
          <MetricCell
            label="11–20"
            metric={report.organicSearch.ranking.band11to20}
          />
          <MetricCell
            label="21–50"
            metric={report.organicSearch.ranking.band21to50}
          />
          <MetricCell
            label=">50"
            metric={report.organicSearch.ranking.deeperThan50}
          />
          <MetricCell
            label="Weighted position"
            metric={report.organicSearch.ranking.weightedPosition}
          />
        </Grid>
        <h3 className="mb-2 text-sm font-semibold">CTR</h3>
        <Grid cols={2} gap={4} className="mb-4">
          <MetricCell
            label="Site CTR"
            metric={report.organicSearch.ctrDetail.siteCtr}
          />
          <MetricCell
            label="Compared pages"
            metric={report.organicSearch.ctrDetail.comparedPageCount}
          />
        </Grid>
        <p className="mb-2 text-xs text-[var(--sg-color-text-muted)]">
          {report.organicSearch.ctrDetail.note}
        </p>
        {report.organicSearch.ctrDetail.highImpressionLowCtr.length > 0 ? (
          <ul className="mb-6 space-y-1 text-sm">
            {report.organicSearch.ctrDetail.highImpressionLowCtr
              .slice(0, 8)
              .map((r) => (
                <li key={r.path}>
                  <code>{r.path}</code> · {r.impressions} imp · CTR{" "}
                  {r.actualCtr}% vs {r.expectedCtr}% (gap {r.ctrGapPctPoints}
                  pp)
                </li>
              ))}
          </ul>
        ) : (
          <p className="mb-6 text-sm italic text-[var(--sg-color-text-muted)]">
            No high-impression low-CTR opportunities in threshold set
          </p>
        )}
        <h3 className="mb-2 text-sm font-semibold">Traffic</h3>
        <Grid cols={2} gap={4}>
          <MetricCell
            label="Organic clicks"
            metric={report.organicSearch.traffic.organicClicks}
          />
          <MetricCell
            label="Pages with clicks"
            metric={report.organicSearch.traffic.pagesWithClicks}
          />
        </Grid>
      </Section>

      <Section title="2. Content estate" status={report.contentEstate.status}>
        <LifecycleGrid label="Totals" buckets={report.contentEstate.totals} />
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <LifecycleGrid
            label="Guides"
            buckets={report.contentEstate.byType.guides}
          />
          <LifecycleGrid
            label="Comparisons"
            buckets={report.contentEstate.byType.comparisons}
          />
          <LifecycleGrid
            label="Software"
            buckets={report.contentEstate.byType.software}
          />
          <LifecycleGrid
            label="Other"
            buckets={report.contentEstate.byType.other}
          />
        </div>
      </Section>

      <Section
        title={`3. Improvement velocity (${report.improvementVelocity.windowLabel})`}
        status={report.improvementVelocity.status}
      >
        <Grid cols={2} gap={4}>
          <MetricCell
            label="Pages improved"
            metric={report.improvementVelocity.pagesImprovedThisWeek}
          />
          <MetricCell
            label="Promoted to indexable"
            metric={report.improvementVelocity.pagesPromotedToIndexable}
          />
          <MetricCell
            label="Quality score improved"
            metric={report.improvementVelocity.pagesQualityScoreImproved}
          />
          <MetricCell
            label="Rankings improved after upgrade"
            metric={
              report.improvementVelocity.pagesRankingsImprovedAfterUpgrade
            }
          />
        </Grid>
      </Section>

      <Section
        title="4. Indexation"
        status={report.indexing.status}
        validity={report.indexing.validity}
      >
        <Grid cols={3} gap={4}>
          <MetricCell
            label="Sitemap URL count"
            metric={report.indexing.sitemapUrlCount}
          />
          <MetricCell
            label="GSC indexed (Coverage)"
            metric={report.indexing.indexedUrls}
          />
          <MetricCell
            label="Discovered not indexed"
            metric={report.indexing.discoveredNotIndexed}
          />
          <MetricCell
            label="Crawled not indexed"
            metric={report.indexing.crawledNotIndexed}
          />
          <MetricCell
            label="Indexation ratio"
            metric={report.indexing.indexationRatio}
          />
        </Grid>
        <ul className="mt-4 list-disc space-y-1 pl-4 text-xs text-[var(--sg-color-text-muted)]">
          {report.indexing.notes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </Section>

      <Section
        title="5. Opportunity"
        status={report.opportunity.status}
        validity={report.opportunity.validity}
      >
        {report.opportunity.top20.length === 0 ? (
          <p className="text-sm italic text-[var(--sg-color-text-muted)]">
            not connected / empty
          </p>
        ) : (
          <ol className="list-decimal space-y-1 pl-5 text-sm">
            {report.opportunity.top20.slice(0, 15).map((r) => (
              <li key={r.path}>
                <code>{r.path}</code> · score {r.score ?? "—"} ·{" "}
                {r.primaryAction ?? "—"}
              </li>
            ))}
          </ol>
        )}
      </Section>

      <Section
        title="6. Evidence"
        status={report.contentQuality.status}
        validity={report.contentQuality.validity}
      >
        <Grid cols={3} gap={4}>
          <MetricCell
            label="Hands-on tested"
            metric={report.contentQuality.handsOnTested}
          />
          <MetricCell
            label="Data verified"
            metric={report.contentQuality.dataVerified}
          />
          <MetricCell
            label="Research-based"
            metric={report.contentQuality.researchOnly}
          />
        </Grid>
        {report.contentQuality.evidenceTrend.length > 0 ? (
          <ul className="mt-4 space-y-1 text-sm">
            {report.contentQuality.evidenceTrend.map((t) => (
              <li key={t.label}>
                <strong>{t.label}</strong>: hands-on {t.handsOnTested} ·
                data-verified {t.dataVerified} · research {t.researchOnly}
              </li>
            ))}
          </ul>
        ) : null}
      </Section>

      <Section
        title="7. Authority"
        status={report.authority.status}
        validity={report.authority.validity}
      >
        <Grid cols={2} gap={4}>
          <MetricCell
            label="Links earned"
            metric={report.authority.linksEarned}
          />
          <MetricCell
            label="Quality prospects"
            metric={report.authority.qualityProspects}
          />
        </Grid>
      </Section>

      <Section
        title="8. AI Visibility"
        status={report.aiVisibility.status}
        validity={report.aiVisibility.validity}
      >
        <Grid cols={3} gap={4}>
          <MetricCell
            label="Citations"
            metric={report.aiVisibility.citations}
          />
          <MetricCell
            label="Unique cited pages"
            metric={report.aiVisibility.uniqueCitedPages}
          />
          <MetricCell
            label="Platforms"
            metric={report.aiVisibility.platforms}
          />
        </Grid>
      </Section>

      <Section
        title="9. Commercial"
        status={report.commercial.status}
        validity={report.commercial.validity}
      >
        <Grid cols={2} gap={4}>
          <MetricCell
            label="Affiliate clicks"
            metric={report.commercial.affiliateClicks}
          />
          <MetricCell label="Revenue" metric={report.commercial.revenue} />
          <MetricCell
            label="Programme coverage"
            metric={report.commercial.programmeCoverage}
          />
        </Grid>
      </Section>

      <Section title="Source inventory">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--sg-color-border)] text-[var(--sg-color-text-muted)]">
                <th className="py-2 pr-3 font-medium">Source</th>
                <th className="py-2 pr-3 font-medium">Status</th>
                <th className="py-2 pr-3 font-medium">Validity</th>
                <th className="py-2 font-medium">Path</th>
              </tr>
            </thead>
            <tbody>
              {report.sourceInventory.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-[var(--sg-color-border)]/60"
                >
                  <td className="py-2 pr-3">{s.label}</td>
                  <td className="py-2 pr-3">{statusBadge(s.status)}</td>
                  <td className="py-2 pr-3">{statusBadge(s.validity)}</td>
                  <td className="py-2 font-mono text-xs">{s.path ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </Stack>
  );
}
