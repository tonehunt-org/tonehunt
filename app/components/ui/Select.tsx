import type { ChangeEvent } from "react";
import { useId } from "react";
import { inputClassNames } from "./Input";
import { ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { twMerge } from "tailwind-merge";

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
  fullWidth?: boolean;
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
  fullWidth = false,
}: SelectProps) {
  const id = useId();

  const select = (
    <div className={twMerge("relative mb-3", fullWidth ? "w-full" : "")}>
      <ChevronUpDownIcon className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-white z-20" />

      <select
        name={name}
        className={twMerge("appearance-none relative", inputClassNames, className, "pr-9", "bg-tonehunt-gray-dark")}
        style={{ borderRadius: "27px", marginBottom: 0 }}
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
