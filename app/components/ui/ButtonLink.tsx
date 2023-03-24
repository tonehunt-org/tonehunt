import type { LinkProps } from "@remix-run/react";
import { Link } from "@remix-run/react";

type ButtonLinkProps = LinkProps & {
  active?: boolean;
  variant?: "link" | "button";
};

export default function ButtonLink({ active, variant = "link", children, className, ...props }: ButtonLinkProps) {
  const classes = `focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg w-full sm:w-auto px-5 py-2.5 text-center hover:bg-gray-700 dark:focus:ring-blue-800`;

  const buttonClassNames = `relative text-white px-5 py-3 font-satoshi-bold rounded-full hover:bg-gray-800 focus:ring-2 focus:outline-none focus:ring-blue-300  hover:bg-gray-700 focus:ring-blue-800 border border-gray-600`;

  const activeClasses = "bg-white text-gray-900 hover:bg-white";

  return (
    <Link
      className={`${variant === "button" ? buttonClassNames : classes} ${className} ${active ? activeClasses : ""}`}
      {...props}
    >
      {children}
    </Link>
  );
}
