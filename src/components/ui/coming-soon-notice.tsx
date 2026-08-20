type Props = {
  message?: string;
};

/** Shown on route shells that are intentionally not yet content-complete. */
export function ComingSoonNotice({
  message = "This section is part of the platform foundation and is not indexable until it has meaningful content.",
}: Props) {
  return (
    <p className="rounded-[var(--radius-md)] border border-dashed border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3 text-sm text-[var(--color-fg-muted)]">
      {message}
    </p>
  );
}
