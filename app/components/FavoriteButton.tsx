import { StarIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { useFetcher } from "@remix-run/react";
import { twMerge } from "tailwind-merge";
import type { ButtonProps } from "~/components/ui/Button";
import Button from "~/components/ui/Button";
import PopperUnstyled from "@mui/base/PopperUnstyled";
import { useState } from "react";
import { formatNumber } from "~/utils/number";

const starIconClasses = "w-5 h-5 inline-block mr-[6px]";

type FavoriteButtonProps = ButtonProps & {
  favorited?: boolean;
  count: number;
  className?: string;
  modelId: string;
  disabledReason?: string;
};

export default function FavoriteButton({
  modelId,
  favorited,
  count,
  onClick,
  className,
  disabledReason,
  ...buttonProps
}: FavoriteButtonProps) {
  const favoriteFetcher = useFetcher();
  const [anchorEl, setAnchorEl] = useState<HTMLFormElement>();

  return (
    <favoriteFetcher.Form
      method="post"
      action="/favorites/add"
      onMouseEnter={(e) => {
        if (disabledReason) {
          setAnchorEl(e.currentTarget);
        }
      }}
      onMouseLeave={() => {
        if (disabledReason) {
          setAnchorEl(undefined);
        }
      }}
    >
      <Button
        type="submit"
        name="modelId"
        value={modelId}
        {...buttonProps}
        variant="secondary"
        className={twMerge(
          "flex items-center",
          className,
          favorited ? "text-tonehunt-yellow hover:text-tonehunt-yellow " : ""
        )}
        loading={favoriteFetcher.state === "submitting" || favoriteFetcher.state === "loading"}
        disabled={!!disabledReason}
      >
        {favorited ? <StarIconSolid className={starIconClasses} /> : <StarIcon className={starIconClasses} />}
        <span className="inline-block text-sm font-satoshi-bold text-[16px]">{formatNumber(count)}</span>
      </Button>

      {/* TODO: refactor into component */}
      <PopperUnstyled open={Boolean(anchorEl)} anchorEl={anchorEl} placement="top">
        <div className=" bg-tonehunt-gray-darker text-white px-3 py-2 z-50 rounded-full relative top-1 border border-white/10">
          You must be logged in to favorite a model
        </div>
      </PopperUnstyled>
    </favoriteFetcher.Form>
  );
}
