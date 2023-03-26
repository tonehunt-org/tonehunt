import { StarIcon } from "@heroicons/react/24/outline";
import Button from "~/components/ui/Button";

type FavoriteButtonProps = {
  favorited?: boolean;
  count: number;
  onClick: () => void;
  className?: string;
};

export default function FavoriteButton({ favorited, count, onClick, className }: FavoriteButtonProps) {
  return (
    <Button
      type="button"
      variant="secondary"
      className={`flex items-center ${
        favorited ? "bg-tonehunt-yellow" : null
      } text-white/60 hover:border-white hover:bg-transparent hover:text-white ${className}`}
      onClick={() => onClick()}
    >
      <StarIcon className="w-5 h-5 inline-block mr-[6px]" />
      <span className="inline-block text-sm font-satoshi-bold text-[16px]">{count}</span>
    </Button>
  );
}
