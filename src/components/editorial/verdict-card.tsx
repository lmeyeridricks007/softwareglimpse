type Props = {
  verdict: string;
  title?: string;
  provisional?: boolean;
};

export function VerdictCard({
  verdict,
  title = "SoftwareGlimpse verdict",
  provisional = false,
}: Props) {
  return (
    <section
      aria-labelledby="verdict-heading"
      className="mb-8 border-l-4 border-[var(--color-accent)] pl-4"
    >
      <h2
        id="verdict-heading"
        className="font-[family-name:var(--font-display)] text-xl font-semibold"
      >
        {title}
      </h2>
      {provisional ? (
        <p className="mt-1 text-xs text-[var(--color-fg-muted)]">
          Provisional — awaiting editorial approval
        </p>
      ) : null}
      <p className="mt-3 text-[var(--color-fg-muted)]">{verdict}</p>
    </section>
  );
}
