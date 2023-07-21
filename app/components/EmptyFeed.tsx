import type { ReactElement } from "react";
import ButtonLink from "./ui/ButtonLink";

type EmptyFeedProps = {
  headline: string | ReactElement;
  buttonText?: string;
  buttonHref?: string;
};

export default function EmptyFeed({ headline, buttonText, buttonHref }: EmptyFeedProps) {
  return (
    <div className="w-full text-center flex flex-col gap-10 relative">
      <div className="z-0 relative">
        <div className="flex-1 p-3 bg-tonehunt-gray-medium text-white rounded-xl text-to h-[64px] opacity-50 mb-5" />
        <div className="flex-1 p-3 bg-tonehunt-gray-medium text-white rounded-xl text-to h-[64px] opacity-20 mb-5" />
        <div className="flex-1 p-3 bg-tonehunt-gray-medium text-white rounded-xl text-to h-[64px] opacity-10 mb-5" />
        <div className="flex-1 p-3 bg-tonehunt-gray-medium text-white rounded-xl text-to h-[64px] opacity-5 mb-5" />
      </div>

      <div className="absolute top-[100px] left-1/2 z-10 -translate-x-1/2 text-center w-9/12">
        <div className="text-xl mb-10">{headline}</div>

        {buttonText && buttonHref ? (
          <div>
            <ButtonLink to={buttonHref} variant="button-primary">
              {buttonText}
            </ButtonLink>
          </div>
        ) : null}
      </div>
    </div>
  );
}
