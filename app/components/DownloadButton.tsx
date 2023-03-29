import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import Button from "~/components/ui/Button";

type FavoriteButtonProps = {
  onClick: () => void;
  className?: string;
  count: number;
};

export default function DownloadButton({ count, onClick, className }: FavoriteButtonProps) {
  return (
    <Button type="button" variant="secondary" onClick={() => onClick()}>
      <ArrowDownTrayIcon className="w-5 h-5 inline-block mr-[6px]" />
      <span className="inline-block text-sm font-satoshi-bold text-[16px]">{count}</span>
    </Button>
  );
}
