import Image from "next/image";
import Link from "next/link";
import {
  BarChart3,
  Building2,
  CheckCircle2,
  CircleDollarSign,
  ClipboardCheck,
  ContactRound,
  Funnel,
  Handshake,
  Lightbulb,
  Puzzle,
  Smile,
  Star,
  Target,
  TrendingUp,
  UserRound,
  UsersRound,
  Zap,
} from "lucide-react";
import type { ComponentType, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { GUIDE_ICON_TONE_CLASSES } from "@/components/guides/guide-template";

export type FrameworkStep = {
  id: string;
  label: string;
  short?: string;
};

const GUIDE_ASSETS = {
  selectionHero: "/guides/crm-selection-framework-hero.png",
} as const;

/** Soft card chrome — full image visible (no crop), width-filling. */
export function GuideFigure({
  src,
  alt,
  className,
  priority,
  aspect = "aspect-[16/10]",
  caption,
  fit = "contain",
  fillHeight = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  aspect?: string;
  caption?: string;
  /** `contain` keeps the full diagram visible; `cover` only for non-critical thumbs. */
  fit?: "contain" | "cover";
  /** Stretch to parent height (hero column). */
  fillHeight?: boolean;
}) {
  return (
    <figure
      className={cn(
        "sg-guide-card overflow-hidden",
        fillHeight && "flex h-full min-h-0 flex-col",
        className,
      )}
    >
      <div
        className={cn(
          "w-full overflow-hidden bg-[var(--sg-color-surface-muted)]",
          // Reserve aspect while the image loads; explicit width/height on
          // <img> also satisfy live SEO CLS checks (fill omits those attrs).
          aspect,
          fillHeight && "min-h-[18rem] flex-1",
        )}
      >
        <Image
          src={src}
          alt={alt}
          width={1536}
          height={1024}
          className={cn(
            "h-full w-full object-center",
            fit === "cover" ? "object-cover" : "object-contain",
          )}
          sizes="(max-width: 1024px) 100vw, 720px"
          priority={priority}
          // Large guide PNGs hang the local/dev image optimizer → blank boxes.
          unoptimized
        />
      </div>
      {caption ? (
        <figcaption className="border-t border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)]/50 px-4 py-2.5 text-sm text-[var(--sg-color-text-muted)]">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

/** Per-guide unique hero illustration — full artwork, natural aspect. */
export function GuideHeroIllustration({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <aside className={cn("w-full", className)} aria-label={alt}>
      <GuideFigure
        src={src}
        alt={alt}
        fit="contain"
        priority
        className="w-full shadow-[0_12px_32px_rgb(37_99_235/0.12)]"
      />
    </aside>
  );
}

/** Hero circular 7-step framework — selection guides only. */
export function CrmSelectionFrameworkVisual({
  className,
}: {
  steps?: FrameworkStep[];
  ctaHref?: string;
  ctaLabel?: string;
  className?: string;
}) {
  return (
    <aside
      className={cn("w-full", className)}
      aria-label="7-step CRM selection framework"
    >
      <GuideFigure
        src={GUIDE_ASSETS.selectionHero}
        alt="7-Step CRM Selection Framework: goals, features, integrations, pricing, ease of use, growth, and decision arranged around a CRM dashboard."
        fit="contain"
        priority
        className="w-full shadow-[0_12px_32px_rgb(37_99_235/0.12)]"
      />
    </aside>
  );
}

/** Mint quick-answer band + factor strip (mockup). */
export function QuickAnswerVisual({
  title = "Quick Answer",
  body,
  factors,
  compact = false,
  id = "quick-answer",
  /** Selection guides show the decision-factor icon strip; fundamentals usually omit it. */
  showFactorStrip = true,
  className,
}: {
  title?: string;
  body: string;
  factors: string[];
  /** Stacked layout for the hero left column beside the framework visual. */
  compact?: boolean;
  id?: string;
  showFactorStrip?: boolean;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "sg-guide-quick-answer scroll-mt-28 overflow-hidden",
        className,
      )}
      aria-labelledby="quick-answer-heading"
    >
      <div className={cn(compact ? "p-4 sm:p-5" : "p-5 sm:p-6")}>
        <h2
          id="quick-answer-heading"
          className="inline-flex items-center gap-2 text-sm font-bold tracking-wide text-[#15803d]"
        >
          <Star className="size-4 fill-[#22c55e] text-[#22c55e]" aria-hidden />
          {title}
        </h2>
        <p
          className={cn(
            "mt-2 leading-relaxed text-[#334155]",
            compact
              ? "text-sm sm:text-[15px]"
              : "text-[length:var(--sg-text-body-lg)]",
          )}
        >
          {body}
        </p>
        {factors.length > 0 ? (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {factors.slice(0, 7).map((f) => (
              <li
                key={f}
                className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-[#64748b] shadow-sm"
              >
                {f}
              </li>
            ))}
          </ul>
        ) : null}
        {showFactorStrip ? (
          <div
            className={cn(
              "mt-4 grid gap-2 border-t border-[#bbf7d0] pt-4",
              compact
                ? "grid-cols-3 sm:grid-cols-6"
                : "grid-cols-3 sm:grid-cols-6",
            )}
          >
            {QUICK_FACTORS.map(({ label, icon: Icon, tone }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-1.5 text-center"
              >
                <span
                  className={cn(
                    "sg-guide-icon-chip bg-white",
                    compact ? "size-9" : "size-11",
                    tone,
                  )}
                >
                  <Icon
                    className={cn(compact ? "size-4" : "size-5")}
                    aria-hidden
                  />
                </span>
                <span className="text-[10px] font-semibold leading-tight text-[#334155]">
                  {label}
                </span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

const QUICK_FACTORS: Array<{
  label: string;
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  tone: string;
}> = [
  { label: "Goals", icon: Target, tone: GUIDE_ICON_TONE_CLASSES.blue },
  {
    label: "Features",
    icon: ClipboardCheck,
    tone: GUIDE_ICON_TONE_CLASSES.teal,
  },
  {
    label: "Integrations",
    icon: Puzzle,
    tone: GUIDE_ICON_TONE_CLASSES.violet,
  },
  {
    label: "Cost",
    icon: CircleDollarSign,
    tone: GUIDE_ICON_TONE_CLASSES.orange,
  },
  {
    label: "Ease of use",
    icon: Smile,
    tone: GUIDE_ICON_TONE_CLASSES.fuchsia,
  },
  { label: "Growth", icon: TrendingUp, tone: GUIDE_ICON_TONE_CLASSES.emerald },
];

export function GuideRoadmapStrip({
  steps,
  title = "Your CRM Selection Roadmap",
  className,
}: {
  steps: FrameworkStep[];
  title?: string;
  className?: string;
}) {
  return (
    <section
      className={cn("space-y-3", className)}
      aria-labelledby="guide-roadmap-heading"
    >
      <h2
        id="guide-roadmap-heading"
        className="font-[family-name:var(--font-display)] text-xl font-semibold text-[#0f172a]"
      >
        {title}
      </h2>
      <ol className="sg-guide-card grid gap-2 p-5 sm:grid-cols-4 lg:grid-cols-7">
        {steps.map((step, i) => {
          const item = ROADMAP_STEPS[i] ?? ROADMAP_STEPS[ROADMAP_STEPS.length - 1]!;
          const Icon = item.icon;
          return (
            <li key={step.id} className="relative">
              <a
                href={`#${step.id}`}
                className="group flex h-full flex-col items-center rounded-lg px-2 py-3 text-center hover:bg-[var(--sg-color-surface-muted)]"
              >
                <span className={cn("text-xs font-bold", item.numberTone)}>
                  {i + 1}
                </span>
                <span
                  className={cn(
                    "sg-guide-icon-chip mt-2 size-11",
                    item.tone,
                  )}
                >
                  <Icon className="size-5" aria-hidden />
                </span>
                <span className="mt-2 text-xs font-semibold leading-tight text-[#334155]">
                  {step.short ?? step.label}
                </span>
              </a>
              {i < steps.length - 1 ? (
                <span
                  className="absolute top-1/2 -right-2 hidden -translate-y-1/2 text-[#93c5fd] lg:block"
                  aria-hidden
                >
                  →
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

const ROADMAP_STEPS: Array<{
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  tone: string;
  numberTone: string;
}> = [
  {
    icon: Target,
    tone: GUIDE_ICON_TONE_CLASSES.blue,
    numberTone: "text-blue-600",
  },
  {
    icon: ClipboardCheck,
    tone: GUIDE_ICON_TONE_CLASSES.teal,
    numberTone: "text-teal-600",
  },
  {
    icon: Puzzle,
    tone: GUIDE_ICON_TONE_CLASSES.violet,
    numberTone: "text-violet-600",
  },
  {
    icon: CircleDollarSign,
    tone: GUIDE_ICON_TONE_CLASSES.orange,
    numberTone: "text-orange-500",
  },
  {
    icon: Smile,
    tone: GUIDE_ICON_TONE_CLASSES.fuchsia,
    numberTone: "text-fuchsia-600",
  },
  {
    icon: TrendingUp,
    tone: GUIDE_ICON_TONE_CLASSES.emerald,
    numberTone: "text-emerald-600",
  },
  {
    icon: CheckCircle2,
    tone: GUIDE_ICON_TONE_CLASSES.sky,
    numberTone: "text-sky-600",
  },
];

export function GoalScenarioCards({
  scenarios,
  className,
}: {
  scenarios: Array<{ title: string; body: string }>;
  className?: string;
}) {
  return (
    <div className={cn("space-y-4", className)}>
      <ul
        className={cn(
          "grid w-full gap-3",
          balancedGuideCardCols(scenarios.length),
        )}
      >
        {scenarios.map((s, i) => {
          const item = GOAL_STEPS[i] ?? GOAL_STEPS[0]!;
          const Icon = item.icon;
          return (
            <li
              key={s.title}
              className="sg-guide-card flex min-h-40 w-full flex-col items-center p-4 text-center shadow-[0_4px_14px_rgb(15_23_42/0.04)]"
            >
              <span
                className={cn(
                  "sg-guide-icon-chip size-12",
                  item.tone,
                )}
              >
                <Icon className="size-6" aria-hidden />
              </span>
              <p className="mt-3 font-semibold text-[#0f172a]">{s.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-[#64748b]">
                {s.body}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * Even card rows: 6→3×2, 5→3+2, 4→2×2, 3→3 — never a lonely leftover in a 5-col row.
 */
export function balancedGuideCardCols(count: number): string {
  if (count <= 1) return "grid-cols-1";
  if (count === 2) return "sm:grid-cols-2";
  if (count === 3) return "sm:grid-cols-2 lg:grid-cols-3";
  if (count === 4) return "sm:grid-cols-2";
  // 5–9: three columns (5→3+2, 6→3+3, 7→3+3+1, 8→3+3+2, 9→3×3)
  if (count <= 9) return "sm:grid-cols-2 lg:grid-cols-3";
  return "sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4";
}

const GOAL_STEPS: Array<{
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  tone: string;
}> = [
  {
    icon: ContactRound,
    tone: GUIDE_ICON_TONE_CLASSES.blue,
  },
  {
    icon: Funnel,
    tone: GUIDE_ICON_TONE_CLASSES.violet,
  },
  {
    icon: Handshake,
    tone: GUIDE_ICON_TONE_CLASSES.amber,
  },
  {
    icon: Zap,
    tone: GUIDE_ICON_TONE_CLASSES.emerald,
  },
  {
    icon: BarChart3,
    tone: GUIDE_ICON_TONE_CLASSES.sky,
  },
];

export function FeatureMatrixVisual({
  rows,
  tip,
  className,
}: {
  rows: Array<{
    feature: string;
    mustHave: boolean;
    niceToHave: boolean;
    notes?: string;
  }>;
  tip?: string;
  className?: string;
}) {
  const mustHave = rows.filter((r) => r.mustHave);
  const niceToHave = rows.filter((r) => r.niceToHave && !r.mustHave);

  return (
    <div
      className={cn(
        "grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(13rem,16rem)] lg:items-stretch",
        className,
      )}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <FeatureListCard
          title="Must-have"
          tone="must"
          items={mustHave.map((r) => r.feature)}
        />
        <FeatureListCard
          title="Nice-to-have"
          tone="nice"
          items={
            niceToHave.length > 0
              ? niceToHave.map((r) => r.feature)
              : rows.filter((r) => r.niceToHave).map((r) => r.feature)
          }
        />
      </div>
      {tip ? (
        <TipCallout tone="success" className="h-full">
          <p className="font-semibold text-[#15803d]">Tip</p>
          <p className="mt-2 text-[#475569]">{tip}</p>
        </TipCallout>
      ) : null}
    </div>
  );
}

function FeatureListCard({
  title,
  tone,
  items,
}: {
  title: string;
  tone: "must" | "nice";
  items: string[];
}) {
  return (
    <div className="sg-guide-card overflow-hidden">
      <div
        className={cn(
          "px-5 py-3.5 text-base font-bold",
          tone === "must" && "sg-guide-must-header",
          tone === "nice" && "sg-guide-nice-header",
        )}
      >
        {title}
      </div>
      <ul className="space-y-3 px-5 py-5">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2.5 text-sm font-medium text-[#1f2937]"
          >
            <span
              className={cn(
                "mt-0.5 shrink-0 text-base leading-none",
                tone === "must" && "font-bold text-[#059669]",
                tone === "nice" && "text-[#7c3aed]",
              )}
              aria-hidden
            >
              {tone === "must" ? "✓" : "•"}
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function IntegrationEcosystemVisual({
  systems,
  className,
}: {
  hubLabel: string;
  systems: Array<{ id: string; label: string }>;
  className?: string;
}) {
  return (
    <div className={cn("space-y-3", className)}>
      <ul className="sg-guide-card grid gap-3 bg-[var(--sg-color-surface-muted)] p-5 sm:grid-cols-4 lg:grid-cols-7">
        {systems.map((s) => (
          <li
            key={s.id}
            className="sg-guide-card flex min-h-28 flex-col items-center justify-center gap-3 p-3 text-center shadow-sm"
          >
            {/* Brand artwork is sourced from each vendor's published site icon. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={INTEGRATION_LOGOS[s.id] ?? "/brands/google-workspace.png"}
              alt=""
              width={40}
              height={40}
              className="size-10 object-contain"
            />
            <span className="text-xs font-semibold leading-tight text-[#334155]">
              {s.label}
            </span>
          </li>
        ))}
      </ul>
      <p className="text-xs text-[#64748b]">
        Verify each workflow in a trial — marketplace logos are not proof of
        fit.
      </p>
    </div>
  );
}

const INTEGRATION_LOGOS: Record<string, string> = {
  google: "/brands/google-workspace.png",
  microsoft: "/brands/microsoft-365.png",
  slack: "/brands/slack.png",
  mailchimp: "/brands/mailchimp.png",
  zoom: "/brands/zoom.png",
  quickbooks: "/brands/quickbooks.png",
  zapier: "/brands/zapier.png",
};

export function CostBreakdownVisual({
  lines,
  calculatorHref,
  calculatorLabel,
  className,
}: {
  lines: Array<{ label: string; description: string }>;
  calculatorHref?: string;
  calculatorLabel?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(13rem,16rem)] lg:items-start",
        className,
      )}
    >
      <div className="space-y-4">
        <div className="sg-guide-card grid items-center gap-6 p-6 sm:grid-cols-[13rem_1fr]">
          <div
            className="relative mx-auto aspect-square w-full max-w-52 rounded-full"
            style={{
              background:
                "conic-gradient(#2563eb 0 61%, #10b981 61% 79%, #f59e0b 79% 91%, #8b5cf6 91% 96%, #e2e8f0 96% 100%)",
            }}
            role="img"
            aria-label="Illustrative CRM cost mix: seats 61%, add-ons 18%, implementation 12%, training 5%, other 4%"
          >
            <div className="absolute inset-[24%] flex items-center justify-center rounded-full bg-white p-2 text-center text-sm font-bold leading-tight text-[#0f172a]">
              Illustrative mix
            </div>
          </div>
          <ul className="space-y-3 text-sm">
            {COST_MIX.map((item) => (
              <li key={item.label} className="flex items-center gap-3">
                <span className={cn("size-3 rounded-full", item.color)} aria-hidden />
                <span className="flex-1 font-medium text-[#334155]">{item.label}</span>
                <span className="font-semibold tabular-nums text-[#64748b]">{item.value}%</span>
              </li>
            ))}
          </ul>
        </div>
        <ul className="grid gap-2 sm:grid-cols-2">
          {lines.map((line) => (
            <li
              key={line.label}
              className="sg-guide-card p-3 text-sm shadow-[0_4px_14px_rgb(15_23_42/0.04)]"
            >
              <p className="font-semibold text-[#0f172a]">{line.label}</p>
              <p className="mt-1 text-[#64748b]">{line.description}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="space-y-3">
        <TipCallout tone="warning">
          <p className="font-semibold text-[#c2410c]">Don’t forget:</p>
          <p className="mt-2 text-[#475569]">
            Setup fees, onboarding, training, and add-ons can significantly
            impact total cost. This mix is educational — not a quote.
          </p>
        </TipCallout>
        {calculatorHref ? (
          <p className="text-sm">
            <Link
              href={calculatorHref}
              className="font-medium text-[#2563eb] underline-offset-2 hover:underline"
            >
              {calculatorLabel ?? "Try our CRM Cost Calculator →"}
            </Link>
          </p>
        ) : null}
      </div>
    </div>
  );
}

const COST_MIX = [
  { label: "Seats", value: 61, color: "bg-[#2563eb]" },
  { label: "Add-ons", value: 18, color: "bg-[#10b981]" },
  { label: "Implementation", value: 12, color: "bg-[#f59e0b]" },
  { label: "Training", value: 5, color: "bg-[#8b5cf6]" },
  { label: "Other", value: 4, color: "bg-[#e2e8f0]" },
];

export function SizeMatchVisual({
  tiers,
  className,
}: {
  tiers: Array<{
    id: string;
    label: string;
    description: string;
    fitHints: string[];
  }>;
  className?: string;
}) {
  return (
    <div className={cn("space-y-4", className)}>
      <ol
        className={cn(
          "grid gap-3",
          balancedGuideCardCols(tiers.length),
        )}
      >
        {tiers.map((tier, i) => (
          <li
            key={tier.id}
            className="sg-guide-card relative overflow-hidden p-5"
          >
            <span
              className={cn(
                "sg-guide-icon-chip size-12 !rounded-xl",
                SIZE_TONES[i] ?? SIZE_TONES[0],
              )}
            >
              {i === 0 ? <UserRound className="size-6" /> : null}
              {i === 1 ? <UsersRound className="size-6" /> : null}
              {i === 2 ? <Building2 className="size-6" /> : null}
              {i >= 3 ? <Building2 className="size-7" /> : null}
            </span>
            <span
              className={cn(
                "absolute top-4 right-4 text-xs font-bold",
                SIZE_NUMBER_TONES[i] ?? SIZE_NUMBER_TONES[0],
              )}
            >
              0{i + 1}
            </span>
            <p className="mt-4 font-semibold text-[#0f172a]">{tier.label}</p>
            <p className="mt-1 text-sm text-[#64748b]">{tier.description}</p>
            <ul className="mt-3 space-y-1.5">
              {tier.fitHints.map((hint) => (
                <li key={hint} className="flex gap-2 text-xs text-[#475569]">
                  <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-[#22c55e]" aria-hidden />
                  {hint}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}

const SIZE_TONES = [
  GUIDE_ICON_TONE_CLASSES.blue,
  GUIDE_ICON_TONE_CLASSES.teal,
  GUIDE_ICON_TONE_CLASSES.violet,
  GUIDE_ICON_TONE_CLASSES.orange,
] as const;

const SIZE_NUMBER_TONES = [
  "text-blue-400",
  "text-teal-400",
  "text-violet-400",
  "text-orange-400",
] as const;

/** Mockup tip/callout: tinted panel with left accent bar + icon. */
export function TipCallout({
  children,
  tone = "info",
  className,
}: {
  children: ReactNode;
  tone?: "info" | "success" | "warning";
  className?: string;
}) {
  return (
    <aside
      data-tone={tone}
      className={cn("sg-guide-tip relative px-4 py-3.5 text-sm", className)}
    >
      <Lightbulb
        className={cn(
          "mb-2 size-4",
          tone === "success" && "text-[#16a34a]",
          tone === "warning" && "text-[#ea580c]",
          tone === "info" && "text-[#2563eb]",
        )}
        aria-hidden
      />
      {children}
    </aside>
  );
}
