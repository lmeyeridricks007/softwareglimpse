type Props = {
  onRestart: () => void;
  label?: string;
};

export function RestartFinder({ onRestart, label = "Start over" }: Props) {
  return (
    <button
      type="button"
      onClick={onRestart}
      className="min-h-11 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-4 py-2.5 text-sm font-medium text-[var(--sg-color-text)] transition-colors hover:bg-[var(--sg-color-surface-muted)]"
    >
      {label}
    </button>
  );
}
