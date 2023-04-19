import type { PropsWithChildren } from "react";
import { Link } from "@remix-run/react";

import type { Counts } from "@prisma/client";
import { twMerge } from "tailwind-merge";
import { formatNumber } from "~/utils/number";

export const ModelListTitle = ({ children, className }: PropsWithChildren & { className?: string }) => {
  return (
    <h1
      className={twMerge(
        "w-full text-2xl lg:text-[57px] lg:leading-[110%] font-satoshi-bold mb-10 lg:mb-10 lg:mt-5",
        className
      )}
    >
      {children}
    </h1>
  );
};

export const ModelListCountTitle = ({ counts, className }: { className?: string; counts: Counts[] }) => {
  const total = counts.reduce((total, count) => {
    return total + count.count;
  }, 0);

  return (
    <ModelListTitle className={className}>
      Explore over {formatNumber(total)} models, including{" "}
      <Link prefetch="intent" to="/?filter=amp" className="border-tonehunt-green border-b-8 hover:text-tonehunt-green">
        {formatNumber(counts.find((count) => count.name === "amps")?.count ?? 0)}
      </Link>{" "}
      amps, and{" "}
      <Link
        prefetch="intent"
        to="/?filter=pedal"
        className="border-tonehunt-yellow border-b-8 hover:text-tonehunt-yellow"
      >
        {formatNumber(counts.find((count) => count.name === "pedals")?.count ?? 0)}
      </Link>{" "}
      pedals.
    </ModelListTitle>
  );
};
