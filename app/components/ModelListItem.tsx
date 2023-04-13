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

const ModelListItem = ({ model, profile }: ModelListItemType) => {
  const categoryProfile = getCategoryProfile(model.category.slug, model.filecount ?? undefined);

  return (
    <div
      key={model.id}
      className="transition ease-in-out flex-1 p-3 bg-tonehunt-gray-medium text-white mb-5 rounded-xl text-to"
    >
      <div className="sm:flex flex-row">
        <div className="flex-1 lg:flex-grow">
          <div className="flex flex-row items-start">
            <div className="flex-none items-center">
              <div className="flex h-full items-start lg:items-center">
                <div className="w-10 h-10 sm:w-14 sm:h-14 inline-block mr-4 rounded-xl">
                  <img className="w-full h-auto" src={categoryProfile.icon} alt="cab" title={model.category.title} />
                </div>
              </div>
            </div>

            <div className="flex-grow">
              <div className="flex flex-col">
                <Link
                  prefetch="intent"
                  to={`/${model.profile.username}/${model.id}`}
                  className="flex-1 hover:underline"
                >
                  <h3 className="font-satoshi-bold text-lg sm:text-xl lg:block " title={model.title}>
                    {model.title}
                  </h3>
                </Link>

                <ul className="list-none m-0 p-0 text-[10px] text-tonehunt-gray-lighter hidden lg:flex lg:max-w-[500px] items-center flex-wrap gap-2 uppercase font-satoshi-medium my-1.5">
                  {model.tags.map((tag) => (
                    <li key={tag}>
                      <Link
                        key={tag}
                        to={`/?tags=${tag}`}
                        prefetch="intent"
                        className={`text-[#afafaf] bg-[#383838] rounded-full inline-block px-2 py-[3px] leading-tight hover:underline whitespace-nowrap`}
                      >
                        {`#${tag}`}
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="flex-1 flex gap-4 items-center flex-wrap">
                  {model.filecount && model.filecount > 1 ? (
                    <Link
                      to={`/${model.profile.username}/${model.id}`}
                      className={`font-satoshi-bold uppercase text-xs whitespace-nowrap ${categoryProfile.color} leading-none hover:underline`}
                    >
                      {model.filecount} models
                    </Link>
                  ) : null}

                  <Link to={`/${model.profile.username}`} prefetch="intent" className="leading-none">
                    <span className="text-sm font-satoshi-bold text-tonehunt-gray-lighter hover:underline">
                      {model.profile.username}
                    </span>
                  </Link>

                  <time
                    // @ts-ignore
                    dateTime={model?.createdAt as string}
                    className="text-sm font-satoshi-light text-tonehunt-gray-lighter whitespace-nowrap pr-5 leading-none"
                  >
                    {timeago.format(new Date(model?.createdAt!))}
                  </time>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 lg:flex-none lg:pl-4 block">
          <div className="flex items-center h-full">
            <div className="flex-1">
              <div className="flex ml-[56px] sm:ml-0 sm:justify-end mt-2 lg:mt-0 gap-2">
                <FavoriteButton
                  count={model._count?.favorites}
                  favorited={!!profile?.favorites.find((fav) => fav.modelId === model.id)}
                  modelId={model.id}
                  disabledReason={profile ? undefined : "You must be logged in"}
                  className="px-4 py-[4px] sm:px-5 sm:py-3"
                />
                <DownloadButton
                  count={model._count?.downloads}
                  filename={model.filename}
                  modelId={model.id}
                  className="px-4 py-[4px] sm:px-5 sm:py-3"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelListItem;
