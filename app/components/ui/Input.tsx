import type { InputHTMLAttributes } from "react";
import { useId } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export default function Input({ label, className, ...props }: InputProps) {
  const id = useId();

  const input = (
    <input
      id={id}
      {...props}
      // className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${className}`}
      className={`border px-5 py-4 mb-3 text-sm rounded-full block w-full p-2.5 bg-transparent border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500 ${className}`}
    />
  );

  return label ? (
    <label htmlFor={id}>
      <span className="block pb-2">{label}</span>
      {input}
    </label>
  ) : (
    input
  );
}
