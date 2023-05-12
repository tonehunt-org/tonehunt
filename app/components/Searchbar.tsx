import { Form } from "@remix-run/react";
import Button from "~/components/ui/Button";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import type { InputHTMLAttributes } from "react";
import { useId } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> & {
  value?: string;
};

const Searchbar = ({ value, className, ...props }: InputProps) => {
  const id = useId();

  const inputClassNames =
    "w-full lg:max-w-3xl border pl-10 pr-5 py-3 text-sm block p-2.5 bg-transparent border-gray-600 placeholder-gray-400 text-white focus:ring-tonehunt-blue-medium focus:border-tonehunt-blue-medium";

  return (
    <div className="block relative w-full">
      <Form reloadDocument action="/search-results" method="get" className="text-center">
        <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          id={id}
          {...props}
          autoComplete="off"
          style={{ borderRadius: "27px", ...props.style }}
          className={`${inputClassNames} ${className}`}
        />

        <Button className="hidden" type="submit">
          Search
        </Button>
      </Form>
    </div>
  );
};

export default Searchbar;
