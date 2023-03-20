import { useId } from "react";
import { inputClassNames } from "./Input";
import { ChevronUpDownIcon } from "@heroicons/react/24/outline";

type Option = {
  value: string;
  description: string;
};

type SelectProps = {
  options: Option[];
  className?: string;
  label?: string;
  name?: string;
  required?: boolean;
};

export default function Select({ options, label, name, className, required }: SelectProps) {
  const id = useId();

  const select = (
    <div className="relative">
      <ChevronUpDownIcon className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2" />

      <select
        name={name}
        className={`${inputClassNames} ${className} appearance-none relative`}
        style={{ borderRadius: "27px" }}
        required={required}
      >
        <option value=""></option>
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
