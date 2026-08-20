import Link from "next/link";
import { ProductLogo } from "@/components/software/product-logo";
import { ButtonLink } from "@/components/ui/button";
import { Rating } from "@/components/ui/rating";
import type {
  BestPageComparisonColumn,
  BestPageComparisonRow,
} from "@/services/best-page";
import { cn } from "@/lib/cn";

const ROW_LABELS: Record<Exclude<BestPageComparisonColumn, "product">, string> =
  {
    bestFor: "Best for",
    focus: "Focus",
    startingPrice: "Starting price",
    freePlan: "Free plan",
    keyStrength: "Key strength",
    keyLimitation: "Key limitation",
    pipeline: "Pipeline management",
    automation: "Automation",
    email: "Email",
    reporting: "Reporting",
    easeOfUse: "Ease of use",
    rating: "Our rating",
    review: "Review",
    compare: "Compare",
  };

type Props = {
  heading: string;
  columns: BestPageComparisonColumn[];
  rows: BestPageComparisonRow[];
  compareAllHref?: string;
  compareAllLabel?: string;
  className?: string;
};

/** Mockup-style matrix: products as columns, criteria as rows. */
export function BestSoftwareComparisonTable({
  heading,
  columns,
  rows,
  compareAllHref = "/compare/",
  compareAllLabel = "Compare software",
  className,
}: Props) {
  if (rows.length === 0) return null;

  const criteria = columns.filter((c) => c !== "product") as Array<
    Exclude<BestPageComparisonColumn, "product">
  >;

  return (
    <div className={cn(className)}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-navy)]">
          {heading}
        </h2>
        <ButtonLink href={compareAllHref} variant="outline" size="sm">
          {compareAllLabel}
        </ButtonLink>
      </div>

      <div className="mt-5 overflow-x-auto rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] shadow-[var(--sg-shadow-sm)]">
        <table className="min-w-[40rem] w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[var(--sg-color-surface-muted)]">
              <th className="sticky left-0 z-10 bg-[var(--sg-color-surface-muted)] px-4 py-3 text-left font-semibold text-[var(--sg-color-text)]">
                Feature
              </th>
              {rows.map((row) => (
                <th
                  key={row.product.slug}
                  className="min-w-[8.5rem] px-4 py-3 text-center font-semibold text-[var(--sg-color-text)]"
                >
                  <Link
                    href={row.product.href}
                    className="inline-flex flex-col items-center gap-2 hover:text-[var(--sg-color-primary)]"
                  >
                    <ProductLogo
                      name={row.product.name}
                      logo={row.product.logo}
                      size="sm"
                    />
                    <span>{row.product.name}</span>
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {criteria.map((col) => (
              <tr
                key={col}
                className="border-t border-[var(--sg-color-border)]"
              >
                <th className="sticky left-0 z-10 bg-[var(--sg-color-surface)] px-4 py-3 text-left font-medium text-[var(--sg-color-text)]">
                  {ROW_LABELS[col]}
                </th>
                {rows.map((row) => (
                  <td
                    key={`${row.product.slug}-${col}`}
                    className="px-4 py-3 text-center text-[var(--sg-color-text)]"
                  >
                    <CellValue col={col} row={row} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CellValue({
  col,
  row,
}: {
  col: Exclude<BestPageComparisonColumn, "product">;
  row: BestPageComparisonRow;
}) {
  switch (col) {
    case "bestFor":
      return <>{row.bestFor ?? "—"}</>;
    case "focus":
      return (
        <span className="line-clamp-3 text-left text-xs leading-snug">
          {row.focus ?? "—"}
        </span>
      );
    case "startingPrice":
      return <>{row.startingPrice ?? "See pricing"}</>;
    case "freePlan":
      return <>{row.freePlan ?? "—"}</>;
    case "rating":
      return row.rating != null ? (
        <span className="inline-flex justify-center">
          <Rating score={row.rating} showNumeric />
        </span>
      ) : (
        <>—</>
      );
    case "review":
      return (
        <Link
          href={row.reviewHref}
          className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
        >
          Review
        </Link>
      );
    case "keyStrength":
      return <>{row.keyStrength ?? "—"}</>;
    case "keyLimitation":
      return <>{row.keyLimitation ?? "—"}</>;
    case "compare":
      return row.compareHref ? (
        <Link
          href={row.compareHref}
          className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
        >
          Compare
        </Link>
      ) : (
        <>—</>
      );
    case "pipeline":
      return <>{row.pipeline ?? "—"}</>;
    case "automation":
      return <>{row.automation ?? "—"}</>;
    case "email":
      return <>{row.email ?? "—"}</>;
    case "reporting":
      return <>{row.reporting ?? "—"}</>;
    case "easeOfUse":
      return <>{row.easeOfUse ?? "—"}</>;
    default:
      return <>—</>;
  }
}
