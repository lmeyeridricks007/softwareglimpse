export type ComparisonTableRow = {
  criterionSlug: string;
  criterionName: string;
  productAValue: string;
  productBValue: string;
  winnerLabel: string;
  notes?: string;
};

type Props = {
  productAName: string;
  productBName: string;
  rows: ComparisonTableRow[];
  caption?: string;
};

/**
 * Semantic, accessible comparison table with a stacked mobile layout.
 */
export function ComparisonTable({
  productAName,
  productBName,
  rows,
  caption = "Criterion-by-criterion comparison",
}: Props) {
  if (rows.length === 0) return null;

  return (
    <section aria-labelledby="comparison-table-heading" className="mb-8">
      <h2
        id="comparison-table-heading"
        className="font-[family-name:var(--font-display)] text-xl font-semibold"
      >
        Comparison table
      </h2>

      {/* Mobile: stacked definition lists */}
      <ul className="mt-4 space-y-4 md:hidden">
        {rows.map((row) => (
          <li
            key={row.criterionSlug}
            className="border-b border-[var(--color-border)] pb-4"
          >
            <h3 className="font-medium">{row.criterionName}</h3>
            <dl className="mt-2 space-y-2 text-sm">
              <div>
                <dt className="text-[var(--color-fg-muted)]">{productAName}</dt>
                <dd>{row.productAValue}</dd>
              </div>
              <div>
                <dt className="text-[var(--color-fg-muted)]">{productBName}</dt>
                <dd>{row.productBValue}</dd>
              </div>
              <div>
                <dt className="text-[var(--color-fg-muted)]">Winner</dt>
                <dd>{row.winnerLabel}</dd>
              </div>
              {row.notes ? (
                <div>
                  <dt className="text-[var(--color-fg-muted)]">Notes</dt>
                  <dd>{row.notes}</dd>
                </div>
              ) : null}
            </dl>
          </li>
        ))}
      </ul>

      {/* Desktop: semantic table */}
      <div className="mt-4 hidden overflow-x-auto md:block">
        <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="border-b border-[var(--color-border)]">
              <th scope="col" className="py-3 pr-4 font-medium">
                Criterion
              </th>
              <th scope="col" className="py-3 pr-4 font-medium">
                {productAName}
              </th>
              <th scope="col" className="py-3 pr-4 font-medium">
                {productBName}
              </th>
              <th scope="col" className="py-3 pr-4 font-medium">
                Winner
              </th>
              <th scope="col" className="py-3 font-medium">
                Notes
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.criterionSlug}
                className="border-b border-[var(--color-border)] align-top"
              >
                <th scope="row" className="py-3 pr-4 font-medium">
                  {row.criterionName}
                </th>
                <td className="py-3 pr-4 text-[var(--color-fg-muted)]">
                  {row.productAValue}
                </td>
                <td className="py-3 pr-4 text-[var(--color-fg-muted)]">
                  {row.productBValue}
                </td>
                <td className="py-3 pr-4">{row.winnerLabel}</td>
                <td className="py-3 text-[var(--color-fg-muted)]">
                  {row.notes || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
