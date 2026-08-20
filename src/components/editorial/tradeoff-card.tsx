type Props = {
  tradeoffs: string[];
  title?: string;
};

export function TradeoffCard({
  tradeoffs,
  title = "Key tradeoffs",
}: Props) {
  if (tradeoffs.length === 0) return null;

  return (
    <section aria-labelledby="tradeoffs-heading" className="mb-8">
      <h2
        id="tradeoffs-heading"
        className="font-[family-name:var(--font-display)] text-xl font-semibold"
      >
        {title}
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[var(--color-fg-muted)]">
        {tradeoffs.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
