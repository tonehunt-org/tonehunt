import Select from "react-select";
import type { ActionMeta, MultiValue } from "react-select";
import { useId } from "react";

export type MultiSelectOption = {
  value: string;
  label: string;
};

type MultiSelectProps = {
  options: MultiSelectOption[];
  className?: string;
  label?: string;
  name?: string;
  required?: boolean;
  defaultValue?: MultiSelectOption[];
  onChange?: (newValue: MultiValue<MultiSelectOption>, actionMeta: ActionMeta<MultiSelectOption>) => void | undefined;
};

const MultiSelect = ({ options = [], className, label, name, required, defaultValue, onChange }: MultiSelectProps) => {
  const id = useId();
  const select = (
    <Select
      isMulti
      name={name}
      options={options}
      onChange={onChange ?? undefined}
      required={required}
      defaultValue={defaultValue ?? undefined}
    />
  );

  return label ? (
    <label htmlFor={id}>
      <span className="block pb-2">{label}</span>
      {select}
    </label>
  ) : (
    select
  );
};

export default MultiSelect;
