type Props = {
  title: string;
  description?: string;
  children?: React.ReactNode;
};

export function PageHero({ title, description, children }: Props) {
  return (
    <header className="mb-8 max-w-3xl">
      <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-5xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-4 text-lg text-[var(--color-fg-muted)]">{description}</p>
      ) : null}
      {children ? <div className="mt-6">{children}</div> : null}
    </header>
  );
}
