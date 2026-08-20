type Props = {
  message: string;
};

export function ResearchStatusBanner({ message }: Props) {
  return (
    <p
      role="status"
      className="mb-6 rounded-[var(--radius-md)] border border-dashed border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3 text-sm text-[var(--color-fg-muted)]"
    >
      {message}
    </p>
  );
}
