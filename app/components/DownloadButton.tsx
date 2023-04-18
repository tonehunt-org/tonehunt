import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { twMerge } from "tailwind-merge";
import { formatNumber } from "~/utils/number";
import { useFetcher } from "@remix-run/react";
import Button from "./ui/Button";
import { memo, useEffect, useState } from "react";
import type { ModelDownloadLoaderData } from "~/routes/__layout/models.$Id.download";

type FavoriteButtonProps = {
  className?: string;
  count: number;
  modelId: string;
  modelName: string;
};

const DownloadButton = memo(({ count, className, modelId, modelName }: FavoriteButtonProps) => {
  const downloadFetcher = useFetcher<ModelDownloadLoaderData>();
  const [downloading, setDownloading] = useState(false);

  const downloadFile = () => {
    if (downloadFetcher.data?.downloadUrl) {
      setDownloading(true);

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
        .finally(() => {
          setDownloading(false);
        });
    }
  };

  useEffect(() => {
    if (downloadFetcher.data?.downloadUrl && modelName) {
      downloadFile();
    }
  }, [downloadFetcher.data?.downloadUrl, modelName]);

  const loading = downloadFetcher.state === "loading" || downloading;

  return (
    <Button
      variant="secondary"
      className={className}
      loading={loading}
      onClick={() => {
        if (downloadFetcher.data?.downloadUrl) {
          downloadFile();
        } else {
          // Doing a post to avoid a bad loading state when using a get
          downloadFetcher.submit(new FormData(), {
            method: "post",
            action: `/models/${modelId}/download`,
          });
        }
      }}
    >
      <ArrowDownTrayIcon className="w-5 h-5 inline-block mr-[6px] -translate-y-0.5" />
      <span className={twMerge("inline-block text-sm font-satoshi-bold text-[16px]")}>{formatNumber(count)}</span>
    </Button>
  );
});

export default DownloadButton;
