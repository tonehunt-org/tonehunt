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
      styles={{
        control: (baseStyles, state) => ({
          ...baseStyles,
          borderRadius: "27px",
          paddingTop: "0.5rem",
          paddingBottom: "0.5rem",
          backgroundColor: "transparent",
          border: "0.5px solid #4b5563",
          paddingLeft: "0.3rem",
        }),
        option: (baseStyles, state) => ({
          ...baseStyles,
          backgroundColor: state.isFocused ? "#4000C7" : "rgb(24,24,27)",
          borderRadius: "8px",
          cursor: "pointer",
        }),
        menu: (baseStyles, state) => ({
          ...baseStyles,
          backgroundColor: "rgb(24,24,27)",
          borderRadius: "10px",
          border: "2px solid #fff",
          padding: "5px",
        }),
        multiValue: (baseStyles, state) => ({
          ...baseStyles,
          backgroundColor: "#fff",
          border: "0.5px solid #4b5563",
          borderRadius: "27px",
          padding: "1px 5px",
        }),
        multiValueLabel: (baseStyles, state) => ({
          ...baseStyles,
          color: "#000",
          display: "inline-flex",
          alignItems: "center",
          lineHeight: 1.5,
          fontSize: "15px",
          fontFamily: "Satoshi-Medium",
        }),
        multiValueRemove: (baseStyles, state) => ({
          ...baseStyles,
          backgroundColor: "transparent",
          borderRadius: "27px",
          color: "black",
          ":hover": {
            backgroundColor: "#fff",
            color: "black",
          },
        }),
      }}
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
