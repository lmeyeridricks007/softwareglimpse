type Option = {
  value: string;
  label: string;
  description?: string;
};

type Props = {
  name: string;
  options: Option[];
  values: string[];
  onChange: (values: string[]) => void;
  /** When selected, clears other selections (e.g. "none"). */
  exclusiveValue?: string;
};

/** Large-touch multi-select option list. */
export function FinderMultiSelect({
  name,
  options,
  values,
  onChange,
  exclusiveValue,
}: Props) {
  function toggle(value: string) {
    if (exclusiveValue && value === exclusiveValue) {
      onChange(values.includes(value) ? [] : [value]);
      return;
    }

    const withoutExclusive = exclusiveValue
      ? values.filter((v) => v !== exclusiveValue)
      : values;

    if (withoutExclusive.includes(value)) {
      onChange(withoutExclusive.filter((v) => v !== value));
    } else {
      onChange([...withoutExclusive, value]);
    }
  }

  return (
    <div className="grid gap-2 sm:grid-cols-2" role="group" aria-label={name}>
      {options.map((option) => {
        const checked = values.includes(option.value);
        return (
          <label
            key={option.value}
            className={`flex min-h-12 cursor-pointer items-start gap-3 rounded-[var(--sg-radius-md)] border px-4 py-3 transition-colors ${
              checked
                ? "border-[var(--sg-color-primary)] bg-[var(--sg-color-primary-soft)]"
                : "border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] hover:border-[var(--sg-color-primary)]/40"
            }`}
          >
            <input
              type="checkbox"
              name={`${name}-${option.value}`}
              value={option.value}
              checked={checked}
              onChange={() => toggle(option.value)}
              className="mt-1 size-4 shrink-0 accent-[var(--sg-color-primary)]"
            />
            <span className="min-w-0">
              <span className="block text-sm font-medium text-[var(--sg-color-text)]">
                {option.label}
              </span>
              {option.description ? (
                <span className="mt-0.5 block text-sm text-[var(--sg-color-text-muted)]">
                  {option.description}
                </span>
              ) : null}
            </span>
          </label>
        );
      })}
    </div>
  );
}
