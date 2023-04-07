import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { twMerge } from "tailwind-merge";
import ButtonLink from "./ui/ButtonLink";

type FavoriteButtonProps = {
  className?: string;
  count: number;
  modelId: string;
  filename: string | null;
};

export default function DownloadButton({ count, className, modelId, filename }: FavoriteButtonProps) {
  return (
    <ButtonLink
      reloadDocument
      variant="button"
      to={`/models/${modelId}/download`}
      className={className}
      download={filename}
      prefetch="none"
    >
      <ArrowDownTrayIcon className="w-5 h-5 inline-block mr-[6px]" />
      <span className={twMerge("inline-block text-sm font-satoshi-bold text-[16px]")}>{count}</span>
    </ButtonLink>
  );
}
