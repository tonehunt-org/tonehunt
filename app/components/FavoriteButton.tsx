import { StarIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { useFetcher } from "@remix-run/react";
import { twMerge } from "tailwind-merge";
import type { ButtonProps } from "~/components/ui/Button";
import Button from "~/components/ui/Button";

const starIconClasses = "w-5 h-5 inline-block mr-[6px]";

type FavoriteButtonProps = ButtonProps & {
  favorited?: boolean;
  count: number;
  className?: string;
  modelId: string;
};

export default function FavoriteButton({
  modelId,
  favorited,
  count,
  onClick,
  className,
  ...buttonProps
}: FavoriteButtonProps) {
  const favoriteFetcher = useFetcher();
  return (
    <favoriteFetcher.Form method="post" action="/favorites/add">
      <Button
        type="submit"
        name="modelId"
        value={modelId}
        {...buttonProps}
        variant="secondary"
        className={twMerge(
          "flex items-center",
          className,
          favorited ? "bg-tonehunt-yellow text-black hover:bg-tonehunt-yellow hover:text-black " : ""
        )}
        loading={favoriteFetcher.state === "submitting" || favoriteFetcher.state === "loading"}
      >
        {favorited ? <StarIconSolid className={starIconClasses} /> : <StarIcon className={starIconClasses} />}
        <span className="inline-block text-sm font-satoshi-bold text-[16px]">{count}</span>
      </Button>
    </favoriteFetcher.Form>
  );
}
