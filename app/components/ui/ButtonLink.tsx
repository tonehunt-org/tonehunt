import type { LinkProps } from "@remix-run/react";
import { Link } from "@remix-run/react";
import { twMerge } from "tailwind-merge";
import type { ButtonProps } from "./Button";
import { smallClasses, base as buttonClasses, secondaryClassNames } from "./Button";

type ButtonLinkProps = LinkProps & {
  active?: boolean;
  size?: ButtonProps["size"];
  variant?: "link" | "button";
};

const classes = `focus:ring-4 focus:outline-none font-medium rounded-lg w-full sm:w-auto px-5 py-2.5 text-center focus:ring-blue-800`;
const activeClasses = "bg-white text-gray-900 hover:bg-white";

export default function ButtonLink({
  size = "default",
  active,
  variant = "link",
  children,
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={twMerge(
        variant === "button" ? buttonClasses : classes,
        secondaryClassNames,
        active ? activeClasses : "",
        size === "small" ? smallClasses : "",
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
