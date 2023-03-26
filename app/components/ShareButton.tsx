import { LinkIcon } from "@heroicons/react/24/outline";
import Button from "~/components/ui/Button";

type FavoriteButtonProps = {
  onClick: () => void;
  className?: string;
};

export default function ShareButton({ onClick, className }: FavoriteButtonProps) {
  return (
    <Button
      type="button"
      variant="secondary"
      className={`flex items-center text-white/60 hover:border-white hover:bg-transparent hover:text-white ${className}`}
      onClick={() => onClick()}
    >
      <LinkIcon className="w-5 h-5 inline-block mr-[6px]" />
      <span className="inline-block text-sm font-satoshi-bold text-[16px]">Share</span>
    </Button>
  );
}
