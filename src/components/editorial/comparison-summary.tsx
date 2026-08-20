type ChooseIf = {
  productName: string;
  scenarios: string[];
};

type Props = {
  verdict?: string;
  overallLabel?: string;
  chooseA?: ChooseIf;
  chooseB?: ChooseIf;
};

export function ComparisonSummary({
  verdict,
  overallLabel,
  chooseA,
  chooseB,
}: Props) {
  if (!verdict && !chooseA && !chooseB && !overallLabel) return null;

  return (
    <section aria-labelledby="comparison-summary-heading" className="mb-8">
      <h2
        id="comparison-summary-heading"
        className="font-[family-name:var(--font-display)] text-xl font-semibold"
      >
        Quick verdict
      </h2>
      {overallLabel ? (
        <p className="mt-2 text-sm font-medium">{overallLabel}</p>
      ) : null}
      {verdict ? (
        <p className="mt-3 text-[var(--color-fg-muted)]">{verdict}</p>
      ) : null}
      {(chooseA || chooseB) && (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {chooseA ? (
            <div>
              <h3 className="text-sm font-medium">
                Choose {chooseA.productName} if
              </h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--color-fg-muted)]">
                {chooseA.scenarios.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {chooseB ? (
            <div>
              <h3 className="text-sm font-medium">
                Choose {chooseB.productName} if
              </h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--color-fg-muted)]">
                {chooseB.scenarios.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}
