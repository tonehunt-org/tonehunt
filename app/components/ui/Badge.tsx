import * as React from "react"
import { twMerge } from "tailwind-merge";

type BadgeProps = React.HTMLAttributes<HTMLDivElement>;

const Badge = ({ className, ...props }: BadgeProps) => {
  return (
    <div className={twMerge(
      "px-3 py-1 rounded-full bg-neutral-800 text-gray-400 text-xs uppercase hover:bg-primary/80",
      className
    )} {...props} />
  )
};

export default Badge;
