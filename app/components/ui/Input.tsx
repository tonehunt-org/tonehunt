import type { InputHTMLAttributes } from "react";
import { useRef } from "react";
import { useState } from "react";
import { useId } from "react";
import { twMerge } from "tailwind-merge";

type InputProps = InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> & {
  label?: string;
  multiline?: boolean;
  invalidMessage?: string;
};

export const inputClassNames =
  "border px-5 py-4 mb-3 text-sm block w-full bg-transparent border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500";

export default function Input({ label, multiline, className, invalidMessage, ...props }: InputProps) {
  const id = useId();
  const [hasFocused, setHasFocused] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  const input = multiline ? (
    <textarea
      id={id}
      {...props}
      style={{ borderRadius: "27px", ...props.style }}
      className={`${inputClassNames} ${className}`}
    />
  ) : (
    <input
      id={id}
      ref={ref}
      {...props}
      onFocus={(e) => {
        setHasFocused(true);
        props.onFocus?.(e);
      }}
      style={{ borderRadius: "27px", ...props.style }}
      className={twMerge(
        inputClassNames,
        hasFocused ? "invalid:border-red-700" : "",
        className,
        props.disabled ? "text-tonehunt-gray-light " : null
      )}
    />
  );

  return label ? (
    <label htmlFor={id}>
      <span className="block pb-2 pl-1">{label}</span>
      {input}
    </label>
  ) : (
    input
  );
}
