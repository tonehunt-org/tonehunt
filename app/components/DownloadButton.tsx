import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { twMerge } from "tailwind-merge";
import { formatNumber } from "~/utils/number";
import { useFetcher } from "@remix-run/react";
import Button from "./ui/Button";
import { useCallback, useEffect, useState } from "react";
import type { ModelDownloadLoaderData } from "~/routes/__layout/models.$Id.download";

type FavoriteButtonProps = {
  className?: string;
  count: number;
  modelId: string;
  modelName: string;
};

export default function DownloadButton({ count, className, modelId, modelName }: FavoriteButtonProps) {
  const downloadFetcher = useFetcher<ModelDownloadLoaderData>();
  const [fetchingDownload, setFetchingDownload] = useState(false);

  const downloadFile = useCallback(() => {
    if (downloadFetcher.data?.downloadUrl) {
      setFetchingDownload(true);
      fetch(downloadFetcher.data.downloadUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");

          a.href = url;
          a.download = `${modelName}.zip`;
          document.body.appendChild(a);

          a.click();
          a.remove();
        })
        .finally(() => setFetchingDownload(false));
    }
  }, [downloadFetcher.data?.downloadUrl, modelName]);

  useEffect(() => {
    downloadFile();
  }, [downloadFetcher.data?.downloadUrl, downloadFile, modelName]);

  const loading = downloadFetcher.state === "loading" || fetchingDownload;

  return (
    <Button
      variant="secondary"
      className={className}
      loading={loading}
      onClick={() => {
        if (downloadFetcher.data?.downloadUrl) {
          downloadFile();
        } else {
          downloadFetcher.load(`/models/${modelId}/download`);
        }
      }}
    >
      <ArrowDownTrayIcon className="w-5 h-5 inline-block mr-[6px] -translate-y-0.5" />
      <span className={twMerge("inline-block text-sm font-satoshi-bold text-[16px]")}>{formatNumber(count)}</span>
    </Button>
  );
}
