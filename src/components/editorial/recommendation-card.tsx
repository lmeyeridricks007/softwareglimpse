import Link from "next/link";

type Props = {
  productName: string;
  href?: string;
  badge?: string;
  /** Only show badge when approved. */
  approved?: boolean;
  rationale?: string;
  strengths?: string[];
  tradeOffs?: string[];
  scenarios?: string[];
  /** @deprecated Kept for call-site compat — never rendered as public editorial status. */
  provisional?: boolean;
};

export function RecommendationCard({
  productName,
  href,
  badge,
  approved = false,
  rationale,
  strengths = [],
  tradeOffs = [],
  scenarios = [],
}: Props) {
  const title = href ? (
    <Link href={href} className="underline-offset-2 hover:underline">
      {productName}
    </Link>
  ) : (
    productName
  );

  return (
    <article className="border-b border-[var(--color-border)] py-5 last:border-b-0">
      <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold">
        {approved && badge ? (
          <span className="mr-2 text-sm font-medium text-[var(--color-accent)]">
            {badge}:
          </span>
        ) : null}
        {title}
      </h3>
      {!approved && badge ? (
        <p className="mt-1 text-sm text-[var(--color-fg-muted)]">{badge}</p>
      ) : null}
      {rationale ? (
        <p className="mt-2 text-sm text-[var(--color-fg-muted)]">{rationale}</p>
      ) : null}
      {strengths.length > 0 ? (
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[var(--color-fg-muted)]">
          {strengths.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
      {tradeOffs.length > 0 ? (
        <p className="mt-2 text-sm text-[var(--color-fg-muted)]">
          Tradeoffs: {tradeOffs.join("; ")}
        </p>
      ) : null}
      {scenarios.length > 0 ? (
        <p className="mt-2 text-sm text-[var(--color-fg-muted)]">
          Scenarios: {scenarios.join("; ")}
        </p>
      ) : null}
    </article>
  );
}
