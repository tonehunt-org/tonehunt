import type { ChangeEvent } from "react";
import { useId } from "react";
import { inputClassNames } from "./Input";
import { ChevronUpDownIcon } from "@heroicons/react/24/outline";

export type SelectOption = {
  value: string;
  description: string;
};

type SelectProps = {
  options: SelectOption[];
  className?: string;
  label?: string;
  name?: string;
  required?: boolean;
  defaultSelected?: string;
  onChange?: (arg: ChangeEvent<HTMLSelectElement>) => void | undefined;
  showEmptyOption?: boolean;
};

export default function Select({
  options,
  label,
  name,
  className,
  required,
  defaultSelected,
  onChange,
  showEmptyOption = true,
}: SelectProps) {
  const id = useId();

  const select = (
    <div className="relative">
      <ChevronUpDownIcon className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2" />

      <select
        name={name}
        className={`${inputClassNames} ${className} appearance-none relative`}
        style={{ borderRadius: "27px" }}
        required={required}
        value={defaultSelected ?? undefined}
        onChange={onChange ?? undefined}
      >
        {showEmptyOption ? <option value=""></option> : null}
        {options.map((option) => {
          return (
            <option key={option.value} value={option.value}>
              {option.description}
            </option>
          );
        })}
      </select>
    </div>
  );

  return label ? (
    <label htmlFor={id}>
      <span className="block pb-2">{label}</span>
      {select}
    </label>
  ) : (
    select
  );
}
