import * as timeago from "timeago.js";
import { Prisma } from "@prisma/client";
import { Link } from "@remix-run/react";
import { getCategoryProfile } from "~/services/categories";
import FavoriteButton from "./FavoriteButton";
import type { ProfileWithFavorites } from "~/services/profile";
import DownloadButton from "./DownloadButton";

const modelWithCategoryAndProfile = Prisma.validator<Prisma.ModelArgs>()({
  include: {
    category: true,
    profile: true,
    favorites: true,
  },
});

type ModelWithCategoryAndProfile = Prisma.ModelGetPayload<typeof modelWithCategoryAndProfile>;

interface ModelListItemType {
  model: ModelWithCategoryAndProfile;
  profile: ProfileWithFavorites | null;
}

const modelName = (title: string, pluralTitle: string, count: number | null) => {
  if (!count) {
    return title;
  }

  if (count === 1) {
    return `1 ${title}`;
  }

  return `${count} ${pluralTitle}`;
};

const ModelListItem = ({ model, profile }: ModelListItemType) => {
  const categoryProfile = getCategoryProfile(model.category.slug);

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
                <img className="w-full h-auto" src={categoryProfile.icon} alt="cab" title={model.category.title} />
              </div>
            </div>
            <div className="flex-grow">
              <div className="flex flex-col align-middle mt-1">
                <Link
                  prefetch="intent"
                  to={`/${model.profile.username}/${model.id}`}
                  className="flex-1 hover:underline"
                >
                  <span className="font-satoshi-bold text-xl">{model.title}</span>
                </Link>

                <div className="flex-1 -mt-1">
                  <span className={`inline-block mr-4 font-satoshi-bold uppercase text-xs ${categoryProfile.color}`}>
                    {modelName(
                      model.category.title,
                      model.category.pluralTitle ?? model.category.title,
                      model.filecount
                    )}
                  </span>

                  <Link to={`/${model.profile.username}`} prefetch="intent">
                    <span className="inline-block mr-4 text-sm font-satoshi-bold text-tonehunt-gray-lighter hover:underline">
                      {model.profile.username}
                    </span>
                  </Link>
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
              <div className="flex justify-center lg:justify-end mt-2 lg:mt-0 gap-2">
                <FavoriteButton
                  count={model._count?.favorites}
                  favorited={!!profile?.favorites.find((fav) => fav.modelId === model.id)}
                  modelId={model.id}
                  disabledReason={profile ? undefined : "You must be logged in"}
                />
                <DownloadButton count={model._count?.downloads} filename={model.filename} modelId={model.id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelListItem;
