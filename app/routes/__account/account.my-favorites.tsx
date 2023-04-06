import { useEffect, useState } from "react";
import { db } from "~/utils/db.server";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { stringify as qs_stringify } from "qs";
import { getSession } from "~/auth.server";

import ModelsListComponent from "~/components/ModelList";
import Loading from "~/components/ui/Loading";
import type { User } from "@supabase/supabase-js";
import { getFavorites } from "~/services/favorites";
import { map } from "lodash";
import type { ProfileWithFavorites } from "~/services/profile";
import { getProfileWithFavorites } from "~/services/profile";
import { MODELS_LIMIT } from "~/components/routes/ModelListPage";

export type LoaderData = {
  user: User | null | undefined;
  modelList: {
    models: any;
    total: number;
    page: number;
  };
  profile: ProfileWithFavorites | null;
};

export const loader: LoaderFunction = async ({ request, context, params }) => {
  const { session } = await getSession(request);
  const user = session?.user;
  const url = new URL(request.url);

  const profile = await getProfileWithFavorites(session);

  // GET PAGE
  let page = Number(url.searchParams.get("page")) ?? 1;
  if (!page || page === 0) page = 1;
  const offset = (page - 1) * MODELS_LIMIT;

  // GET MODELS
  const favorites = profile
    ? await getFavorites({ limit: MODELS_LIMIT, next: offset, profileId: profile?.id })
    : {
        data: [],
        total: 0,
      };

  const models = map(favorites.data, (favorite) => favorite.model);

  return json<LoaderData>({
    user,
    modelList: {
      models: models,
      total: favorites.total,
      page: page - 1,
    },
    profile,
  });
};

export default function MyFavoritesPage() {
  const data = useLoaderData();
  const [loading, setLoading] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const { user, modelList } = data;

  const handlePageClick = (selectedPage: number) => {
    setLoading(true);
    searchParams.set("page", String(selectedPage));
    setSearchParams(searchParams);
  };

  useEffect(() => {
    if (modelList) {
      setLoading(false);
    }
  }, [modelList, searchParams]);

  return (
    <div className="w-full">
      <div className="flex">
        <h1 className="w-full text-center text-2xl lg:text-3xl font-satoshi-bold mb-10">My Favorites</h1>
      </div>
      <div className="flex">
        <div className="w-full">
          {loading ? (
            <div className="flex justify-center px-10 py-60">
              <Loading size="48" />
            </div>
          ) : null}
          {!loading ? (
            <ModelsListComponent
              data={modelList.models}
              total={modelList.total}
              currentPage={modelList.page}
              limit={MODELS_LIMIT}
              handlePageClick={handlePageClick}
              showMenu={false}
              showFilters={false}
              user={user}
              profile={data.profile}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
