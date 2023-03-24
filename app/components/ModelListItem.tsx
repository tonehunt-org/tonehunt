import Button from "~/components/ui/Button";
import * as timeago from "timeago.js";
import { StarIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import iconCab from "~/assets/categories_icons/icon-cab.svg";
import iconFullrigPack from "~/assets/categories_icons/icon-fullrig-pack.svg";
import iconPedal from "~/assets/categories_icons/icon-pedal.svg";
import iconIr from "~/assets/categories_icons/icon-ir.svg";
import { Prisma } from "@prisma/client";
import ButtonLink from "./ui/ButtonLink";
import { Link } from "@remix-run/react";
import { useApp } from "~/hooks/useApp";

const modelWithCategoryAndProfile = Prisma.validator<Prisma.ModelArgs>()({
  include: {
    category: true,
    profile: true,
  },
});

type ModelWithCategoryAndProfile = Prisma.ModelGetPayload<typeof modelWithCategoryAndProfile>;

interface ModelListItemType {
  model: ModelWithCategoryAndProfile;
  onFavoriteClick?: (arg1: string, arg2: string | null) => void | undefined;
}

const ModelListItem = ({ model, onFavoriteClick }: ModelListItemType) => {
  const getCategoryProfile = (catSlug: string) => {
    switch (catSlug) {
      case "amps":
      default:
        return {
          icon: iconCab,
          color: "text-tonehunt-green",
        };
      case "packs":
        return {
          icon: iconFullrigPack,
          color: "text-tonehunt-purple",
        };
      case "pedals":
        return {
          icon: iconPedal,
          color: "text-tonehunt-yellow",
        };
      case "irs":
        return {
          icon: iconIr,
          color: "text-tonehunt-orange",
        };
    }
  };

  const categoryProfile = getCategoryProfile(model.category.slug);
  const { openModelPreview } = useApp();

  const handleModelClick = (e: any, modelId: string) => {
    openModelPreview(modelId);
  };

  return (
    <div
      key={model.id}
      className="transition ease-in-out flex-1 p-3 bg-tonehunt-gray-medium text-white mb-5 rounded-xl text-to"
    >
      <div className="flex flex-col lg:flex-row">
        <div className="flex-1 lg:flex-grow">
          <div className="flex flex-row align-middle">
            <div className="flex-none items-center">
              <div className="w-14 h-14 inline-block mr-4 rounded-xl">
                <img className="w-full h-auto" src={categoryProfile.icon} alt="cab" title="cab" />
              </div>
            </div>
            <div className="flex-grow">
              <div className="flex flex-col align-middle mt-1">
                <Link
                  prefetch="intent"
                  to={`/${model.profile.username}/${model.id}`}
                  className="flex-1 hover:underline"
                  onClick={(e) => handleModelClick(e, model.id)}
                >
                  <span className="font-satoshi-bold text-xl">{model.title}</span>
                </Link>
                <div className="flex-1 -mt-1">
                  {model.category.slug === "packs" ? (
                    <span className={`inline-block mr-4 font-satoshi-bold uppercase text-xs ${categoryProfile.color}`}>
                      models collection
                    </span>
                  ) : null}

                  <span className="inline-block mr-4 text-sm font-satoshi-bold text-tonehunt-gray-lighter">
                    {model.profile.username}
                  </span>
                  <span className="inline-block mr-4 text-sm font-satoshi-light text-tonehunt-gray-lighter">
                    {timeago.format(new Date(model?.createdAt!))}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 lg:flex-none lg:pl-4">
          <div className="flex items-center h-full">
            <div className="flex-1">
              <div className="flex justify-center lg:justify-end mt-2 lg:mt-0">
                <Button
                  type="button"
                  variant="secondary"
                  className={`ml-2 ${model.favorites?.length > 0 ? "bg-tonehunt-yellow" : null}`}
                  onClick={() => (onFavoriteClick ? onFavoriteClick(model.id, model.favorites[0]?.id) : null)}
                >
                  <StarIcon className="w-5 h-5 inline-block mr-1" />
                  <span className="inline-block text-sm font-satoshi-light">{model._count.favorites}</span>
                </Button>
                <ButtonLink
                  className="ml-2"
                  variant="button"
                  to={`/models/${model.id}/download`}
                  reloadDocument
                  download={model.filename}
                >
                  <ArrowDownTrayIcon className="w-5 h-5 inline-block mr-1" />
                  <span className="inline-block text-sm font-satoshi-light">{model._count.downloads}</span>
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelListItem;
