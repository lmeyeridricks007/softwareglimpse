"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { FeatureEvidenceDrawer } from "@/components/software/hub/feature-evidence-drawer";
import { FeatureMediaCarousel } from "@/components/software/hub/feature-media-carousel";
import {
  SoftwareHubFinderCta,
  SoftwareHubQuickFacts,
} from "@/components/software/hub/software-hub-sidebar";
import { FEATURE_HUB_CATEGORIES } from "@/services/software-review/hub-tabs";
import type { SoftwareReviewModel } from "@/services/software-review";
import { cn } from "@/lib/cn";
import {
  availabilityAssessmentLabel,
  buildFeatureTabMediaMap,
} from "@/services/product-media/feature-tab-media";
import { mediaWhatThisShows } from "@/domain";

type Props = {
  model: SoftwareReviewModel;
};

export function SoftwareHubFeaturesTab({ model }: Props) {
  const software = model.software;
  const plans = model.pricing?.plans ?? [];
  const features = model.features;

  const categories = useMemo(() => {
    const bySlug = new Map(features.map((f) => [f.slug, f]));
    const cats = FEATURE_HUB_CATEGORIES.map((cat) => {
      const items = cat.featureSlugs
        .map((slug) => bySlug.get(slug))
        .filter(Boolean) as typeof features;
      return { ...cat, items, count: items.length };
    }).filter((c) => c.count > 0);

    return [
      {
        id: "all",
        label: "All features",
        featureSlugs: features.map((f) => f.slug),
        items: features,
        count: features.length,
      },
      ...cats,
    ];
  }, [features]);

  const [activeCategory, setActiveCategory] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [evidenceFeatureSlug, setEvidenceFeatureSlug] = useState<string | null>(
    null,
  );

  const active = categories.find((c) => c.id === activeCategory) ?? categories[0]!;

  const filtered = useMemo(() => {
    return active.items.filter((f) => {
      if (query.trim()) {
        const q = query.toLowerCase();
        if (
          !f.name.toLowerCase().includes(q) &&
          !(f.description ?? "").toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      if (availabilityFilter !== "all" && f.availability !== availabilityFilter) {
        return false;
      }
      if (planFilter !== "all") {
        const planSlugs =
          model.enrichment?.featureSupport.find((x) => x.featureSlug === f.slug)
            ?.planSlugs ?? [];
        if (planSlugs.length > 0 && !planSlugs.includes(planFilter)) {
          return false;
        }
      }
      return true;
    });
  }, [
    active.items,
    query,
    availabilityFilter,
    planFilter,
    model.enrichment?.featureSupport,
  ]);

  const mediaByFeature = useMemo(
    () =>
      buildFeatureTabMediaMap({
        media: model.media,
        screenshots: model.screenshots,
        features: filtered.map((f) => ({ slug: f.slug, name: f.name })),
      }),
    [model.media, model.screenshots, filtered],
  );

  const planCounts = plans.map((plan) => {
    const count = features.filter((f) => {
      const support = model.enrichment?.featureSupport.find(
        (x) => x.featureSlug === f.slug,
      );
      if (!support) return false;
      if (support.availability === "not-supported") return false;
      if (support.planSlugs.length === 0) {
        return (
          support.availability === "supported" ||
          support.availability === "limited"
        );
      }
      return support.planSlugs.includes(plan.slug);
    }).length;
    return { slug: plan.slug, name: plan.name, count };
  });

  const evidenceFeature = features.find((f) => f.slug === evidenceFeatureSlug);
  const evidenceBundle = evidenceFeatureSlug
    ? mediaByFeature.get(evidenceFeatureSlug)
    : undefined;
  const evidenceSupport = evidenceFeatureSlug
    ? model.enrichment?.featureSupport.find(
        (x) => x.featureSlug === evidenceFeatureSlug,
      )
    : undefined;
  const evidenceDocs = (evidenceSupport?.sourceIds ?? [])
    .map((id) => model.sources.find((s) => s.id === id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s?.url && s.title))
    .map((s) => ({
      title: s.title!,
      url: s.url!,
      kindLabel: s.kindLabel,
    }));

  return (
    <div className="grid gap-8 lg:grid-cols-[14rem_minmax(0,1fr)_16rem] lg:items-start xl:grid-cols-[15rem_minmax(0,1fr)_17rem]">
      <aside className="space-y-5">
        <Card className="p-4">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            Feature categories
          </h2>
          <ul className="mt-3 space-y-0.5">
            {categories.map((cat) => (
              <li key={cat.id}>
                <button
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-[var(--sg-radius-md)] px-2.5 py-2 text-left text-sm",
                    activeCategory === cat.id
                      ? "bg-[var(--sg-color-primary-soft)] font-medium text-[var(--sg-color-primary)]"
                      : "text-[var(--sg-color-text-muted)] hover:bg-[var(--sg-color-surface-muted)] hover:text-[var(--sg-color-text)]",
                  )}
                >
                  <span>{cat.label}</span>
                  <span className="tabular-nums text-xs opacity-80">
                    {cat.count}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </Card>
        {model.finderHref ? (
          <SoftwareHubFinderCta
            title="Not sure which features you need?"
            href={model.finderHref}
            ctaLabel={model.finderLabel}
          />
        ) : null}
      </aside>

      <div className="min-w-0 space-y-6">
        <div>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
              {active.label}
            </h2>
            <Badge variant="neutral">{filtered.length} features</Badge>
          </div>
          <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
            Official demos appear only beside high-value features where verified
            ResearchMedia is linked — not as a generic video gallery.
          </p>
        </div>

        {filtered.length === 0 ? (
          <Card className="p-6 text-sm text-[var(--sg-color-text-muted)]">
            No features match these filters yet.
          </Card>
        ) : (
          <ul className="space-y-5">
            {filtered.map((feature) => {
              const support = model.enrichment?.featureSupport.find(
                (x) => x.featureSlug === feature.slug,
              );
              const includedPlans = plans.map((plan) => {
                const included =
                  support?.planSlugs.length === 0
                    ? support?.availability === "supported" ||
                      support?.availability === "limited"
                    : Boolean(support?.planSlugs.includes(plan.slug));
                return { ...plan, included: Boolean(included) };
              });
              const entryPlan =
                includedPlans.find((p) => p.included)?.name ??
                feature.planLabel ??
                feature.availabilityLabel;
              const assessment = availabilityAssessmentLabel(feature.availability);
              const bundle = mediaByFeature.get(feature.slug);
              const hasMedia =
                Boolean(bundle?.videos.length) ||
                Boolean(bundle?.screenshots.length);
              const prominent = Boolean(bundle?.prominent);
              const shows = bundle?.videos[0]
                ? mediaWhatThisShows(bundle.videos[0]).slice(0, 4)
                : [];

              const supports: string[] = [];
              if (feature.availability === "supported") {
                supports.push("Listed as available in product packaging");
              }
              if (feature.availability === "limited") {
                supports.push("Available with noted limits in current research");
              }
              if (entryPlan) {
                supports.push(`Entry point: ${entryPlan}`);
              }
              if (feature.description) {
                supports.push(feature.description);
              }

              const limitations: string[] = [];
              if (feature.availability === "higher-plan-only") {
                limitations.push("May require a higher plan than the entry tier");
              }
              if (feature.availability === "add-on") {
                limitations.push("May require an add-on or separate purchase");
              }
              if (feature.editorialNote && feature.editorialNote !== feature.description) {
                limitations.push(feature.editorialNote);
              }

              return (
                <li key={feature.slug} id={`feature-${feature.slug}`}>
                  <Card className="p-5">
                    <div
                      className={cn(
                        "grid gap-5",
                        hasMedia &&
                          "lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start",
                      )}
                    >
                      <div className="min-w-0 space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-semibold uppercase tracking-wide text-[var(--sg-color-text)] sm:text-lg sm:normal-case sm:tracking-normal">
                            {feature.name}
                          </h3>
                          {entryPlan ? (
                            <Badge variant="success">{entryPlan}</Badge>
                          ) : null}
                        </div>

                        <p className="text-sm text-[var(--sg-color-text-muted)]">
                          <span className="font-medium text-[var(--sg-color-text)]">
                            SoftwareGlimpse assessment:{" "}
                          </span>
                          {assessment}
                        </p>

                        {supports.length > 0 ? (
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                              What it supports
                            </p>
                            <ul className="mt-2 space-y-1.5 text-sm text-[var(--sg-color-text-muted)]">
                              {supports.slice(0, 4).map((item) => (
                                <li key={item} className="flex gap-2">
                                  <span
                                    className="text-[var(--sg-color-success)]"
                                    aria-hidden
                                  >
                                    ✓
                                  </span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : null}

                        {limitations.length > 0 ? (
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                              Limitations
                            </p>
                            <ul className="mt-2 space-y-1.5 text-sm text-[var(--sg-color-text-muted)]">
                              {limitations.slice(0, 3).map((item) => (
                                <li key={item} className="flex gap-2">
                                  <span aria-hidden>△</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : null}

                        {plans.length > 0 ? (
                          <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                              Included in
                            </p>
                            <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                              {includedPlans.map((plan) => (
                                <li
                                  key={plan.slug}
                                  className={
                                    plan.included
                                      ? "text-[var(--sg-color-text)]"
                                      : "text-[var(--sg-color-text-muted)] opacity-50"
                                  }
                                >
                                  {plan.included ? "✓ " : "– "}
                                  {plan.name}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : null}

                        {prominent && shows.length > 0 ? (
                          <div className="hidden lg:block">
                            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                              What the demo shows
                            </p>
                            <ul className="mt-2 space-y-1.5 text-sm text-[var(--sg-color-text-muted)]">
                              {shows.map((item) => (
                                <li key={item} className="flex gap-2">
                                  <span aria-hidden>•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                            {bundle?.videos[0]?.sourceOrganization ||
                            bundle?.videos[0]?.channelName ? (
                              <p className="mt-2 text-xs text-[var(--sg-color-text-muted)]">
                                Source: Official{" "}
                                {bundle.videos[0].sourceOrganization ||
                                  bundle.videos[0].channelName}
                              </p>
                            ) : null}
                          </div>
                        ) : null}

                        <button
                          type="button"
                          onClick={() => setEvidenceFeatureSlug(feature.slug)}
                          className="text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sg-color-primary)]"
                        >
                          View evidence
                        </button>
                      </div>

                      {hasMedia && bundle ? (
                        <FeatureMediaCarousel
                          vendorName={software.name}
                          videos={bundle.videos}
                          screenshots={
                            prominent
                              ? bundle.screenshots
                              : bundle.screenshots.slice(0, 1)
                          }
                        />
                      ) : null}
                    </div>
                  </Card>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <aside className="space-y-5">
        <Card className="space-y-3 p-4">
          <h2 className="text-sm font-semibold text-[var(--sg-color-text)]">
            Filter features
          </h2>
          <label className="block text-sm">
            <span className="text-[var(--sg-color-text-muted)]">
              Show features in plan
            </span>
            <select
              className="mt-1 w-full rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-2.5 py-2"
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
            >
              <option value="all">All plans</option>
              {plans.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="text-[var(--sg-color-text-muted)]">
              Feature availability
            </span>
            <select
              className="mt-1 w-full rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-2.5 py-2"
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="supported">Supported</option>
              <option value="limited">Limited</option>
              <option value="higher-plan-only">Higher plan</option>
              <option value="add-on">Add-on</option>
            </select>
          </label>
          <label className="block text-sm">
            <span className="text-[var(--sg-color-text-muted)]">Search</span>
            <input
              type="search"
              placeholder="Search by feature name..."
              className="mt-1 w-full rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-2.5 py-2"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
        </Card>

        <Card className="p-4">
          <h2 className="text-sm font-semibold text-[var(--sg-color-text)]">
            {software.name} feature summary
          </h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-2">
              <dt className="text-[var(--sg-color-text-muted)]">
                Total features
              </dt>
              <dd className="font-medium tabular-nums">{features.length}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-[var(--sg-color-text-muted)]">
                Features with demo
              </dt>
              <dd className="font-medium tabular-nums">
                {[...mediaByFeature.values()].filter((b) => b.prominent).length}
              </dd>
            </div>
            {planCounts.map((p) => (
              <div key={p.slug} className="flex justify-between gap-2">
                <dt className="text-[var(--sg-color-text-muted)]">
                  In {p.name}
                </dt>
                <dd className="font-medium tabular-nums">{p.count}</dd>
              </div>
            ))}
          </dl>
        </Card>

        {model.pros.length > 0 ? (
          <Card className="p-4">
            <h2 className="text-sm font-semibold text-[var(--sg-color-text)]">
              Top strengths
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-[var(--sg-color-text-muted)]">
              {model.pros.slice(0, 5).map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-[var(--sg-color-success)]" aria-hidden>
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        ) : null}

        <SoftwareHubQuickFacts
          facts={model.quickFacts}
          productSlug={software.slug}
          productName={software.name}
        />

        {model.pricing ? (
          <ButtonLink
            href={`/software/${software.slug}/pricing/`}
            variant="outline"
            className="w-full"
          >
            View pricing
          </ButtonLink>
        ) : null}
      </aside>

      {evidenceFeature ? (
        <FeatureEvidenceDrawer
          open={Boolean(evidenceFeatureSlug)}
          onClose={() => setEvidenceFeatureSlug(null)}
          featureName={evidenceFeature.name}
          productName={software.name}
          assessmentLabel={availabilityAssessmentLabel(
            evidenceFeature.availability,
          )}
          videos={evidenceBundle?.videos ?? []}
          screenshots={evidenceBundle?.screenshots ?? []}
          docSources={evidenceDocs}
        />
      ) : null}
    </div>
  );
}
