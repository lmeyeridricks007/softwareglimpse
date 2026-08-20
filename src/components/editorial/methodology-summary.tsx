type Props = {
  methodology: string;
  version?: string;
  title?: string;
};

export function MethodologySummary({
  methodology,
  version,
  title = "How we evaluate",
}: Props) {
  return (
    <section aria-labelledby="methodology-heading" className="mb-8">
      <h2
        id="methodology-heading"
        className="font-[family-name:var(--font-display)] text-xl font-semibold"
      >
        {title}
      </h2>
      {version ? (
        <p className="mt-1 text-xs text-[var(--color-fg-muted)]">
          Methodology version {version}
        </p>
      ) : null}
      <p className="mt-3 text-sm text-[var(--color-fg-muted)]">{methodology}</p>
    </section>
  );
}
