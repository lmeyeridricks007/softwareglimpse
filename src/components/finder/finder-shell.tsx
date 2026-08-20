type Props = {
  children: React.ReactNode;
  title?: string;
  description?: string;
};

/** Content panel for the active finder wizard step. */
export function FinderShell({ children, title, description }: Props) {
  return (
    <section
      aria-labelledby={title ? "finder-shell-title" : undefined}
      className="rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-5 shadow-[var(--sg-shadow-sm)] sm:p-8"
    >
      {title ? (
        <header className="mb-6">
          <h2
            id="finder-shell-title"
            className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-[var(--sg-color-text)]"
          >
            {title}
          </h2>
          {description ? (
            <p className="mt-2 text-[var(--sg-color-text-muted)]">
              {description}
            </p>
          ) : null}
        </header>
      ) : null}
      {children}
    </section>
  );
}
