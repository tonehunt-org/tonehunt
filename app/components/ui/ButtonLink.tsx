import type { LinkProps } from "@remix-run/react";
import { Link } from "@remix-run/react";
import { twMerge } from "tailwind-merge";
import type { ButtonProps } from "./Button";
import {
  smallClasses,
  base as buttonClasses,
  secondaryClassNames,
  primaryClassNames,
  primaryAltClassNames,
} from "./Button";

type ButtonLinkProps = LinkProps & {
  active?: boolean;
  size?: ButtonProps["size"];
  variant?: "link" | "button" | "button-primary" | "button-primary-alt";
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
        secondaryClassNames,
        variant === "button"
          ? buttonClasses
          : variant === "button-primary"
          ? primaryClassNames
          : variant === "button-primary-alt"
          ? primaryAltClassNames
          : classes,
        "inline-block",
        active ? activeClasses : "",
        size === "small" ? smallClasses : "",
        className
      )}
      prefetch="intent"
      {...props}
    >
      {children}
    </Link>
  );
}
