import { LinkIcon } from "@heroicons/react/24/outline";
import { forwardRef } from "react";
import Button from "~/components/ui/Button";

type FavoriteButtonProps = {
  onClick: () => void;
  className?: string;
};

const ShareButton = forwardRef(({ onClick, className }: FavoriteButtonProps, ref) => {
  return (
    <Button
      ref={ref}
      type="button"
      variant="secondary"
      className={`flex items-center text-white/90 hover:border-white hover:bg-transparent hover:text-white ${className}`}
      onClick={() => onClick()}
    >
      <LinkIcon className="w-5 h-5 inline-block mr-[6px]" />
      <span className="inline-block text-sm font-satoshi-bold text-[16px]">Share</span>
    </Button>
  );
});

ShareButton.displayName = "ShareButton";

export default ShareButton;
