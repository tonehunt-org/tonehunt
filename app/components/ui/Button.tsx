import type { ButtonHTMLAttributes } from "react";
import { forwardRef } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "link";
};

// eslint-disable-next-line react/display-name
const Button = forwardRef(({ variant = "primary", className, ...props }: ButtonProps, ref) => {
  const primaryClassNames =
    "text-white bg-[#4000c7] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center hover:bg-blue-700 focus:ring-blue-800";
  const secondaryClassNames =
    "text-white hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2 text-center dark:hover:bg-gray-700 dark:focus:ring-blue-800 border-2 border-white";
  const linkClassNames = "p-0 border-0";

  const classNames = () => {
    switch (variant) {
      case "primary":
        return primaryClassNames;
      case "secondary":
        return secondaryClassNames;
      case "link":
        return linkClassNames;
    }
  };

  return <button ref={ref} {...props} className={`${classNames()} ${className}`} />;
});

export default Button;
