type Props = {
  checkedAt?: string;
  label?: string;
  fixture?: boolean;
};

export function ResearchTrustNote({
  checkedAt,
  label = "Product information",
  fixture = false,
}: Props) {
  const checked = checkedAt
    ? new Date(checkedAt).toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <p className="mt-2 text-xs text-[var(--color-fg-muted)]">
      {checked ? `${label} checked: ${checked}. ` : null}
      {fixture
        ? "Shown from fixture research snapshots for pipeline demonstration — not claimed as live vendor pricing."
        : "Verified from recorded research sources where available."}
    </p>
  );
}
