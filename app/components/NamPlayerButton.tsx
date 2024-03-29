import { PlayCircleIcon } from "@heroicons/react/24/outline";
import { twMerge } from "tailwind-merge";
import { useFetcher } from "@remix-run/react";
import Button from "./ui/Button";
import { memo, useEffect, useState } from "react";
import qs from "qs";

import type { ModelDownloadLoaderData } from "~/routes/__layout/models.$Id.download";

type NamPlayerButtonProps = {
  link: string;
  className?: string;
  modelId: string;
  modelName: string;
};

const NamPlayerButton = memo(({ link, className, modelId, modelName }: NamPlayerButtonProps) => {
  const downloadFetcher = useFetcher<ModelDownloadLoaderData>();
  const [downloading, setDownloading] = useState(false);

  const downloadFile = () => {
    if (downloadFetcher.data?.downloadUrl) {
      setDownloading(true);

      fetch(downloadFetcher.data.downloadUrl)
        .then((res) => {
          const query = qs.stringify({
            title: modelName,
            profileUrl: res.url,
          });

          const url = `${link}/?${query}`;
          const is_ios = /iP(ad|od|hone)/i.test(window.navigator.userAgent);
          const is_safari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);

          if (is_ios && is_safari) {
            window.location.href = url;
          } else {
            window.open(url, "_blank");
          }
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
      <PlayCircleIcon className="w-5 h-5 inline-block mr-[6px]" />
      <span className={twMerge("inline-block font-satoshi-bold text-[13px]")}>Try with NAM Online *</span>
    </Button>
  );
});

export default NamPlayerButton;
