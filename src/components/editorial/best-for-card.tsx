type Props = {
  bestFor?: string[];
  notIdealFor?: string[];
  title?: string;
};

export function BestForCard({
  bestFor = [],
  notIdealFor = [],
  title = "Who it is for",
}: Props) {
  if (bestFor.length === 0 && notIdealFor.length === 0) return null;

  return (
    <section aria-labelledby="best-for-heading" className="mb-8">
      <h2
        id="best-for-heading"
        className="font-[family-name:var(--font-display)] text-xl font-semibold"
      >
        {title}
      </h2>
      <div className="mt-4 grid gap-6 sm:grid-cols-2">
        {bestFor.length > 0 ? (
          <div>
            <h3 className="text-sm font-medium">Best for</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--color-fg-muted)]">
              {bestFor.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}
        {notIdealFor.length > 0 ? (
          <div>
            <h3 className="text-sm font-medium">Not ideal for</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--color-fg-muted)]">
              {notIdealFor.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
