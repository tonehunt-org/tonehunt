import { useState } from "react";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { User } from "@supabase/supabase-js";
import { getSession } from "~/auth.server";
import { getModels } from "~/services/models";

import ModelsListComponent from "~/components/ModelList";
import Loading from "~/components/ui/Loading";
import { MODELS_LIMIT } from "~/utils/constants";
import type { ProfileWithSocials } from "~/services/profile";
import { getProfileWithSocials } from "~/services/profile";
import { getSortFilter } from "~/utils/loader";

export const meta: MetaFunction = ({ data, location }) => {
  const d = data as LoaderData;

  const title = `"${d.search}" Search Results | ToneHunt`;
  const description = `List of "${d.search}" models for Neural Amp Modeler.`;

  return {
    title,
    description,

    "og:title": title,
    // "og:image": "http://euro-travel-example.com/thumbnail.jpg", // TODO
    "og:url": `${location.pathname}${location.search}`,
    // "twitter:card": "summary_large_image", // TODO

    // <!--  Non-Essential, But Recommended -->
    "og:description": description,
    "twitter:image:alt": description,
  };
};

type LoaderData = {
  models: any;
  user?: User | null | undefined;
  total: number;
  page: number;
  search: string | null;
  profileWithSocials: ProfileWithSocials | null;
  categories: any;
};

export const loader: LoaderFunction = async ({ request, context }) => {
  const { session } = await getSession(request);

  const user = session?.user;
  const url = new URL(request.url);

  // GET SEARCH VALUE
  const searchParam = url.searchParams.get("search") ?? null;

  const { offset, sortDirection, page, categoryId, categories } = await getSortFilter(url);

  // GET MODELS
  const modelsReq =
    searchParam && searchParam !== ""
      ? getModels({
          limit: MODELS_LIMIT,
          next: offset,
          search: searchParam,
          user,
          categoryId,
          sortBy: "createdAt",
          sortDirection,
        })
      : Promise.resolve({
          data: [],
          total: 0,
        });

  const [models, profileWithSocials] = await Promise.all([modelsReq, getProfileWithSocials(session)]);

  return json<LoaderData>({
    models: models.data,
    total: models.total,
    user,
    page,
    search: searchParam,
    profileWithSocials,
    categories,
  });
};

export default function SearchResults() {
  const data = useLoaderData<LoaderData>();
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <div className="w-full">
      <div className="flex items-center gap-5 mb-5">
        <h1 className="text-3xl lg:text-4xl font-satoshi-bold mb-3">Search results for:</h1>
        <h3 className="text-3xl font-satoshi-light pb-3">{data.search}</h3>
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
              data={data.models}
              total={data.total}
              currentPage={data.page}
              limit={MODELS_LIMIT}
              user={data.user}
              profile={data.profileWithSocials}
              categories={data.categories}
              showTitle={false}
              hideSortOrder={true}
              hideCategories={true}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
