import type { ButtonHTMLAttributes } from "react";
import { forwardRef } from "react";
import Loading from "./Loading";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "link";
  loading?: boolean;
};

// eslint-disable-next-line react/display-name
const Button = forwardRef(
  ({ variant = "primary", disabled, className, loading, children, ...props }: ButtonProps, ref) => {
    const base = `relative text-white px-5 py-3 font-medium rounded-full`;
    const primaryClassNames = `${base} bg-[#4000c7] focus:ring-2 focus:outline-none focus:ring-blue-300  text-center hover:bg-[#4E06E7] focus:ring-blue-800`;
    const secondaryClassNames = `${base} hover:bg-gray-800 focus:ring-2 focus:outline-none focus:ring-blue-300  hover:bg-gray-700 focus:ring-blue-800 border border-gray-600`;
    const disabledClassNames = `${base} bg-gray-800 text-gray-700 cursor-not-allowed`;
    const linkClassNames = "p-0 border-0";

    const classNames = () => {
      if (loading || disabled) {
        return disabledClassNames;
      }

      switch (variant) {
        case "primary":
          return primaryClassNames;
        case "secondary":
          return secondaryClassNames;
        case "link":
          return linkClassNames;
      }
    };

    return (
      <button disabled={loading || disabled} ref={ref} {...props} className={`${classNames()} ${className}`}>
        <span className={loading ? "invisible" : ""}>{children}</span>
        {loading ? (
          <span style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
            <Loading size="16" />
          </span>
        ) : null}
      </button>
    );
  }
);

export default Button;
