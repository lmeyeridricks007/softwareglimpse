"use client";

import {
  CAPABILITY_OPTIONS,
  type FinderOption,
} from "@/components/finder/crm-finder-questions";
import { FinderMultiSelect } from "@/components/finder/finder-multi-select";

type Props = {
  values: string[];
  onChange: (values: string[]) => void;
  options?: FinderOption[];
  legend?: string;
  description?: string;
};

/** Multi-select for canonical capabilities (CRM or SI Finder lists). */
export function FeatureRequirementPicker({
  values,
  onChange,
  options = CAPABILITY_OPTIONS,
  legend = "Required capabilities",
  description = "Select must-haves. We only estimate costs when research supports a plan that covers them — we never invent feature coverage.",
}: Props) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-medium text-[var(--sg-color-text)]">
        {legend}
      </legend>
      <p className="text-sm text-[var(--sg-color-text-muted)]">{description}</p>
      <FinderMultiSelect
        name="required-capabilities"
        options={options}
        values={values}
        onChange={onChange}
      />
    </fieldset>
  );
}
