import type { InputHTMLAttributes } from "react";
import { useId } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> & {
  label?: string;
  multiline?: boolean;
};

export const inputClassNames =
  "border px-5 py-4 mb-3 text-sm block w-full p-2.5 bg-transparent border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500";

export default function Input({ label, multiline, className, ...props }: InputProps) {
  const id = useId();

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
      {...props}
      style={{ borderRadius: "27px", ...props.style }}
      className={`${inputClassNames} ${className}`}
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
