import Link from "next/link";
import { createElement } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  XCircle,
} from "lucide-react";
import type { GuideContentBlock } from "@/domain";
import { ProductLogo } from "@/components/software/product-logo";
import { GuideFaq } from "@/components/guides/guide-faq";
import { GuideNextStepsCta } from "@/components/guides/guide-next-steps-cta";
import {
  CopyableChecklist,
  InteractiveScorecard,
  InteractiveSelectionChecklist,
} from "@/components/guides/guide-interactive";
import {
  CostBreakdownVisual,
  FeatureMatrixVisual,
  GoalScenarioCards,
  GuideFigure,
  GuideRoadmapStrip,
  IntegrationEcosystemVisual,
  QuickAnswerVisual,
  SizeMatchVisual,
  TipCallout,
  balancedGuideCardCols,
} from "@/components/guides/guide-visuals";
import { iconForGuideSection, toneForGuideSection } from "@/components/guides/guide-section-icons";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export type GuideBlockProduct = {
  slug: string;
  name: string;
  href: string;
  shortDescription?: string;
  logo?: { src: string; alt: string } | null;
};

type Props = {
  blocks: GuideContentBlock[];
  productsBySlug: Map<string, GuideBlockProduct>;
  guideSlug: string;
  /** Skip blocks already rendered elsewhere (e.g. Quick Answer in hero). */
  omitBlockIds?: Set<string>;
  className?: string;
};

export function GuideBlocksRenderer({
  blocks,
  productsBySlug,
  guideSlug,
  omitBlockIds,
  className,
}: Props) {
  if (blocks.length === 0) return null;

  const visible = omitBlockIds?.size
    ? blocks.filter((b) => !omitBlockIds.has(b.id))
    : blocks;

  if (visible.length === 0) return null;

  return (
    <div className={cn("space-y-12", className)}>
      {visible.map((block) => (
        <GuideBlock
          key={block.id}
          block={block}
          productsBySlug={productsBySlug}
          guideSlug={guideSlug}
        />
      ))}
    </div>
  );
}

function GuideBlock({
  block,
  productsBySlug,
  guideSlug,
}: {
  block: GuideContentBlock;
  productsBySlug: Map<string, GuideBlockProduct>;
  guideSlug: string;
}) {
  switch (block.type) {
    case "direct-answer":
      return (
        <QuickAnswerVisual
          id={block.id}
          title={block.title ?? "Quick answer"}
          body={block.body}
          factors={block.bullets}
        />
      );

    case "key-takeaways":
      return (
        <section id={block.id} className="scroll-mt-28">
          {block.title ? (
            <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold">
              {block.title}
            </h2>
          ) : null}
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {block.items.map((item) => (
              <li key={item.label} className="flex gap-2 text-sm">
                <CheckCircle2
                  className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-success)]"
                  aria-hidden
                />
                <span>
                  <span className="font-medium text-[var(--sg-color-text)]">
                    {item.label}
                  </span>
                  {item.body ? (
                    <span className="text-[var(--sg-color-text-muted)]">
                      {" "}
                      — {item.body}
                    </span>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
        </section>
      );

    case "decision-framework":
      return (
        <section id={block.id} className="scroll-mt-28 space-y-5">
          <GuideRoadmapStrip
            title={block.title ?? "Your CRM Selection Roadmap"}
            steps={block.steps.map((s) => ({
              id: s.id,
              label: s.label,
              short: s.short,
            }))}
          />
          {block.figure ? (
            <GuideFigure
              src={block.figure.src}
              alt={block.figure.alt}
              caption={block.figure.caption}
            />
          ) : null}
        </section>
      );

    case "figure":
      return (
        <section id={block.id} className="scroll-mt-28">
          {block.title ? (
            <h2 className="mb-4 font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold">
              {block.title}
            </h2>
          ) : null}
          <GuideFigure
            src={block.src}
            alt={block.alt}
            caption={block.caption}
          />
        </section>
      );

    case "step": {
      const Icon = iconForGuideSection(block.id, (block.stepNumber ?? 1) - 1);
      const tone = toneForGuideSection(block.id, (block.stepNumber ?? 1) - 1);
      return (
        <section id={block.id} className="scroll-mt-28">
          <div className="flex gap-4">
            <span
              className={cn(
                "sg-guide-icon-chip mt-1 hidden size-12 shrink-0 sm:inline-flex",
                tone,
              )}
            >
              {createElement(Icon, {
                className: "size-6",
                "aria-hidden": true,
              })}
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
                {block.stepNumber ? `${block.stepNumber}. ` : ""}
                {block.heading}
              </h2>
              {block.figure ? (
                <GuideFigure
                  className="mt-4"
                  src={block.figure.src}
                  alt={block.figure.alt}
                  caption={block.figure.caption}
                />
              ) : null}
              {(block.scenarios?.length ?? 0) > 0 ? (
                <GoalScenarioCards
                  className="mt-5"
                  scenarios={block.scenarios ?? []}
                />
              ) : null}
              <GuideProse body={block.body} />
              {block.tip ? (
                <TipCallout className="mt-5" tone="info">
                  <p className="text-[var(--sg-color-text-muted)]">
                    <span className="font-semibold text-[var(--sg-color-primary)]">
                      Tip:{" "}
                    </span>
                    {block.tip}
                  </p>
                </TipCallout>
              ) : null}
            </div>
          </div>
        </section>
      );
    }

    case "feature-matrix":
      return (
        <section id={block.id} className="scroll-mt-28">
          <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold">
            {block.title ?? "Must-have vs nice-to-have"}
          </h2>
          {block.figure ? (
            <GuideFigure
              className="mt-5"
              src={block.figure.src}
              alt={block.figure.alt}
              caption={block.figure.caption}
            />
          ) : null}
          <FeatureMatrixVisual
            className="mt-5"
            rows={block.rows}
            tip={
              block.id.includes("spreadsheet")
                ? "Use shared ownership and follow-up pain — not feature count — as the tipping point."
                : "Ask each stakeholder for their top two must-haves — then reconcile overlaps before demos."
            }
          />
        </section>
      );

    case "size-match":
      return (
        <section id={block.id} className="scroll-mt-28">
          <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold">
            {block.title ?? "Match CRM to company size"}
          </h2>
          {block.figure ? (
            <GuideFigure
              className="mt-5"
              src={block.figure.src}
              alt={block.figure.alt}
              caption={block.figure.caption}
            />
          ) : null}
          <SizeMatchVisual className="mt-5" tiers={block.tiers} />
        </section>
      );

    case "integration-ecosystem":
      return (
        <section id={block.id} className="scroll-mt-28">
          <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold">
            {block.title ?? "Evaluate integrations"}
          </h2>
          {block.body ? <GuideProse body={block.body} /> : null}
          <IntegrationEcosystemVisual
            className="mt-5"
            hubLabel={block.hubLabel}
            systems={block.systems}
          />
        </section>
      );

    case "cost-breakdown":
      return (
        <section id={block.id} className="scroll-mt-28">
          <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold">
            {block.title ?? "Understand the real cost"}
          </h2>
          {block.body ? <GuideProse body={block.body} /> : null}
          <CostBreakdownVisual
            className="mt-5"
            lines={block.lines}
            calculatorHref={block.calculatorHref}
            calculatorLabel={block.calculatorLabel}
          />
        </section>
      );

    case "comparison-framework":
      return (
        <section id={block.id} className="scroll-mt-28">
          <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold">
            {block.title ?? "CRM comparison framework"}
          </h2>
          <ul className="mt-5 space-y-3">
            {block.criteria.map((c) => (
              <li
                key={c.id}
                className="flex flex-col gap-1 rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-4 sm:flex-row sm:items-start sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-[var(--sg-color-text)]">
                    {c.label}
                  </p>
                  <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                    {c.description}
                  </p>
                </div>
                <span className="shrink-0 rounded-[var(--sg-radius-pill)] bg-[var(--sg-color-primary-soft)] px-3 py-1 text-xs font-semibold text-[var(--sg-color-primary)]">
                  Weight {c.weight}
                </span>
              </li>
            ))}
          </ul>
        </section>
      );

    case "crm-types":
      return (
        <section id={block.id} className="scroll-mt-28">
          <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold">
            {block.title ?? "Which type of CRM should you choose?"}
          </h2>
          <ul
            className={cn(
              "mt-5 grid gap-4",
              balancedGuideCardCols(block.types.length),
            )}
          >
            {block.types.map((t) => (
              <li key={t.id}>
                <Card className="h-full p-4">
                  <p className="font-semibold text-[var(--sg-color-text)]">
                    {t.title}
                  </p>
                  <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
                    <span className="font-medium text-[var(--sg-color-success)]">
                      Best for:{" "}
                    </span>
                    {t.bestFor}
                  </p>
                  <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                    <span className="font-medium text-[var(--sg-color-warning)]">
                      Avoid when:{" "}
                    </span>
                    {t.avoidWhen}
                  </p>
                </Card>
              </li>
            ))}
          </ul>
        </section>
      );

    case "product-shortlist": {
      const products = block.productSlugs
        .map((s) => productsBySlug.get(s))
        .filter(Boolean) as GuideBlockProduct[];
      return (
        <section id={block.id} className="scroll-mt-28">
          <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold">
            {block.title ?? "CRM shortlist from the catalogue"}
          </h2>
          {block.body ? <GuideProse body={block.body} /> : null}
          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            {products.map((p) => (
              <li key={p.slug}>
                <Card className="sg-guide-card group flex h-full flex-col overflow-hidden p-0 transition hover:-translate-y-0.5 hover:border-[var(--sg-guide-tip-info-border)] hover:shadow-[0_12px_28px_rgb(37_99_235/0.10)]">
                  <div className="flex flex-1 gap-4 p-5">
                    <ProductLogo
                      name={p.name}
                      logo={p.logo}
                      size="lg"
                      className="bg-white shadow-sm"
                    />
                    <div className="min-w-0">
                      <Link
                        href={p.href}
                        className="text-base font-bold text-[#0f172a] underline-offset-2 group-hover:text-[#2563eb] group-hover:underline"
                      >
                        {p.name}
                      </Link>
                      <p className="mt-1.5 text-sm leading-relaxed text-[#64748b]">
                        {p.shortDescription ??
                          "CRM catalogue profile for use in your evaluation shortlist."}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={p.href}
                    className="flex items-center justify-between border-t border-[var(--sg-guide-card-border)] bg-[var(--sg-color-surface-muted)] px-5 py-3 text-sm font-semibold text-[var(--sg-color-primary)]"
                  >
                    View CRM profile
                    <span aria-hidden>→</span>
                  </Link>
                </Card>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-[var(--sg-color-text-muted)]">
            {block.disclaimer ??
              "Appearance here is catalogue coverage for evaluation — not an affiliate-ordered ranking."}
          </p>
        </section>
      );
    }

    case "mistakes":
      return (
        <section id={block.id} className="scroll-mt-28">
          <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold">
            {block.title ?? "Common mistakes when choosing a CRM"}
          </h2>
          <ul
            className={cn(
              "mt-5 grid gap-3",
              balancedGuideCardCols(block.items.length),
            )}
          >
            {block.items.map((item) => (
              <li key={item.title}>
                <Card className="h-full border-[var(--sg-color-danger)]/15 p-4">
                  <div className="flex gap-2">
                    <XCircle
                      className="mt-0.5 size-5 shrink-0 text-[var(--sg-color-danger)]"
                      aria-hidden
                    />
                    <div>
                      <p className="font-semibold text-[var(--sg-color-text)]">
                        {item.title}
                      </p>
                      <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        </section>
      );

    case "checklist":
      return (
        <section id={block.id} className="scroll-mt-28">
          <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold">
            {block.title ?? "Checklist"}
          </h2>
          <div className="mt-4">
            {block.copyable ? (
              <CopyableChecklist items={block.items} />
            ) : (
              <ul className="space-y-2">
                {block.items.map((item) => (
                  <li key={item.id} className="flex gap-2 text-sm">
                    <CheckCircle2
                      className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-success)]"
                      aria-hidden
                    />
                    <span>
                      <span className="font-medium">{item.label}</span>
                      {item.description ? (
                        <span className="text-[var(--sg-color-text-muted)]">
                          {" "}
                          — {item.description}
                        </span>
                      ) : null}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      );

    case "selection-checklist":
      return (
        <section id={block.id} className="scroll-mt-28">
          <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold">
            {block.title ?? "Interactive CRM selection checklist"}
          </h2>
          <div className="mt-4">
            <InteractiveSelectionChecklist
              storageKey={`sg-guide-select:${guideSlug}`}
              dimensions={block.dimensions}
            />
          </div>
        </section>
      );

    case "trial-plan":
      return (
        <section id={block.id} className="scroll-mt-28">
          <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold">
            {block.title ?? "How to test a CRM before buying"}
          </h2>
          <ol className="mt-5 space-y-3">
            {block.days.map((day) => (
              <li
                key={day.day}
                className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-4"
              >
                <p className="font-semibold text-[var(--sg-color-text)]">
                  Day {day.day}: {day.focus}
                </p>
                <ul className="mt-2 space-y-1 text-sm text-[var(--sg-color-text-muted)]">
                  {day.tasks.map((t) => (
                    <li key={t} className="flex gap-2">
                      <CheckCircle2
                        className="mt-0.5 size-3.5 shrink-0 text-[var(--sg-color-primary)]"
                        aria-hidden
                      />
                      {t}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </section>
      );

    case "scorecard": {
      const products = (block.productSlugs.length
        ? block.productSlugs
        : []
      )
        .map((s) => productsBySlug.get(s))
        .filter(Boolean)
        .map((p) => ({ slug: p!.slug, name: p!.name }));
      return (
        <section id={block.id} className="scroll-mt-28">
          <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold">
            {block.title ?? "Decision scorecard"}
          </h2>
          {block.body ? <GuideProse body={block.body} /> : null}
          {products.length > 0 ? (
            <InteractiveScorecard
              className="mt-4"
              storageKey={`sg-guide-score:${guideSlug}`}
              criteria={block.criteria}
              products={products}
            />
          ) : (
            <ul className="mt-4 space-y-2 text-sm text-[var(--sg-color-text-muted)]">
              {block.criteria.map((c) => (
                <li key={c.id}>
                  {c.label} (weight {c.weight})
                </li>
              ))}
            </ul>
          )}
        </section>
      );
    }

    case "interactive-cta":
      return (
        <section id={block.id} className="scroll-mt-28">
          <GuideNextStepsCta
            title={block.title ?? "Next step"}
            body={block.body}
            href={block.href}
            ctaLabel={block.ctaLabel}
            variant={block.variant === "finder" ? "finder" : "generic"}
          />
        </section>
      );

    case "expert-tip":
      return (
        <aside
          id={block.id}
          className="scroll-mt-28 flex gap-3 rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-primary)]/20 bg-[var(--sg-color-primary-soft)]/50 px-4 py-4 text-sm"
        >
          <Lightbulb
            className="mt-0.5 size-5 shrink-0 text-[var(--sg-color-warning)]"
            aria-hidden
          />
          <p className="text-[var(--sg-color-text-muted)]">
            <span className="font-semibold text-[var(--sg-color-text)]">
              Expert tip:{" "}
            </span>
            {block.body}
          </p>
        </aside>
      );

    case "callout":
      return (
        <aside
          id={block.id}
          className={cn(
            "scroll-mt-28 flex gap-3 rounded-[var(--sg-radius-lg)] border px-4 py-4 text-sm",
            block.tone === "warning"
              ? "border-[var(--sg-color-warning)]/30 bg-[var(--sg-color-warning-soft)]/60"
              : block.tone === "success"
                ? "border-[var(--sg-color-success)]/30 bg-[var(--sg-color-success-soft)]/60"
                : "border-[var(--sg-color-primary)]/20 bg-[var(--sg-color-primary-soft)]/50",
          )}
        >
          <AlertTriangle
            className="mt-0.5 size-5 shrink-0 text-[var(--sg-color-warning)]"
            aria-hidden
          />
          <p className="text-[var(--sg-color-text-muted)]">{block.body}</p>
        </aside>
      );

    case "faq":
      return (
        <GuideFaq
          items={block.items}
          className="scroll-mt-28"
        />
      );

    case "related-content":
      return (
        <section id={block.id} className="scroll-mt-28">
          <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold">
            {block.title ?? "Related CRM resources"}
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {block.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-4 hover:border-[var(--sg-color-primary)]"
                >
                  <span className="font-semibold text-[var(--sg-color-primary)]">
                    {link.label}
                  </span>
                  {link.description ? (
                    <span className="mt-1 block text-sm text-[var(--sg-color-text-muted)]">
                      {link.description}
                    </span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      );

    default:
      return null;
  }
}

function GuideProse({ body }: { body: string }) {
  const chunks = body
    .split(/\n{2,}/u)
    .map((b) => b.trim())
    .filter(Boolean);

  type Seg =
    | { kind: "p"; text: string }
    | { kind: "ol" | "ul"; items: string[] };

  function segmentsFromChunk(chunk: string): Seg[] {
    const lines = chunk
      .split(/\n/u)
      .map((l) => l.trim())
      .filter(Boolean);
    const segs: Seg[] = [];
    let prose: string[] = [];
    let list: { ordered: boolean; items: string[] } | null = null;

    const flushProse = () => {
      if (prose.length) {
        segs.push({ kind: "p", text: prose.join("\n") });
        prose = [];
      }
    };
    const flushList = () => {
      if (list && list.items.length) {
        segs.push({
          kind: list.ordered ? "ol" : "ul",
          items: list.items,
        });
      }
      list = null;
    };

    for (const line of lines) {
      const m = line.match(/^(?:(\d+)[.)]\s+|[-*•]\s+)(.+)$/u);
      if (m) {
        flushProse();
        const ordered = m[1] != null;
        if (!list || list.ordered !== ordered) {
          flushList();
          list = { ordered, items: [] };
        }
        list.items.push(m[2] as string);
      } else {
        flushList();
        prose.push(line);
      }
    }
    flushProse();
    flushList();
    return segs;
  }

  return (
    <div className="mt-4 space-y-4 text-[length:var(--sg-text-body)] leading-relaxed text-[var(--sg-color-text-muted)]">
      {chunks.flatMap((chunk, i) =>
        segmentsFromChunk(chunk).map((seg, j) => {
          const key = `${i}-${j}`;
          if (seg.kind === "p") {
            return (
              <p key={key} className="whitespace-pre-line">
                {seg.text}
              </p>
            );
          }
          const ListTag = seg.kind === "ol" ? "ol" : "ul";
          return (
            <ListTag
              key={key}
              className={cn(
                "space-y-2.5 pl-5",
                seg.kind === "ol" ? "list-decimal" : "list-disc",
              )}
            >
              {seg.items.map((item, k) => (
                <li
                  key={k}
                  className="pl-1 marker:font-semibold marker:text-[var(--sg-color-primary)]"
                >
                  {item}
                </li>
              ))}
            </ListTag>
          );
        }),
      )}
    </div>
  );
}

/** Build sticky TOC entries from structured blocks. */
export function tocFromGuideBlocks(
  blocks: GuideContentBlock[],
): Array<{ id: string; label: string }> {
  const toc: Array<{ id: string; label: string }> = [];
  for (const block of blocks) {
    if (block.type === "direct-answer") {
      toc.push({ id: block.id, label: block.title ?? "Quick answer" });
    } else if (block.type === "decision-framework") {
      toc.push({ id: block.id, label: block.title ?? "Selection roadmap" });
    } else if (block.type === "step") {
      toc.push({ id: block.id, label: block.heading });
    } else if (
      block.type === "feature-matrix" ||
      block.type === "size-match" ||
      block.type === "integration-ecosystem" ||
      block.type === "cost-breakdown" ||
      block.type === "comparison-framework" ||
      block.type === "crm-types" ||
      block.type === "product-shortlist" ||
      block.type === "mistakes" ||
      block.type === "checklist" ||
      block.type === "selection-checklist" ||
      block.type === "trial-plan" ||
      block.type === "scorecard" ||
      block.type === "related-content" ||
      block.type === "figure"
    ) {
      toc.push({
        id: block.id,
        label: block.title ?? block.type.replace(/-/g, " "),
      });
    } else if (block.type === "faq") {
      toc.push({ id: "faq", label: "FAQ" });
    } else if (block.type === "interactive-cta") {
      toc.push({ id: block.id, label: block.title ?? "Next step" });
    }
  }
  return toc;
}
