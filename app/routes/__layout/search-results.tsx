import { useState } from "react";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { User } from "@supabase/supabase-js";
import { stringify as qs_stringify } from "qs";
import { getSession } from "~/auth.server";
import { getModels } from "~/services/models";

import ModelsListComponent from "~/components/ModelList";
import Loading from "~/components/ui/Loading";

type LoaderData = {
  models: any;
  user?: User | null | undefined;
  total: number;
  page: number;
  search: string | null;
};

// THE AMOUNT OF MODELS PER PAGE
const MODELS_LIMIT = 8;

export const loader: LoaderFunction = async ({ request, context }) => {
  const { session } = await getSession(request);
  const user = session?.user;
  const url = new URL(request.url);

  // GET PAGE
  let page = Number(url.searchParams.get("page")) ?? 1;
  if (!page || page === 0) page = 1;
  const offset = (page - 1) * MODELS_LIMIT;

  // GET SEARCH VALUE
  const searchParam = url.searchParams.get("search") ?? null;

  // GET MODELS
  const models =
    searchParam && searchParam !== ""
      ? await getModels({ limit: MODELS_LIMIT, next: offset, search: searchParam, user })
      : {
          data: [],
          total: 0,
        };

  return json<LoaderData>({
    models: models.data,
    total: models.total,
    user,
    page: page - 1,
    search: searchParam,
  });
};

export default function SearchResults() {
  const data = useLoaderData<LoaderData>();
  const [loading, setLoading] = useState<boolean>(false);

  const handlePageClick = (selectedPage: number) => {
    setLoading(true);
    const params: any = {
      page: selectedPage + 1,
      search: data.search,
    };
    const query = qs_stringify(params);
    window.location.href = `/search-results?${query}`;
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-5 mb-5">
        <h1 className="text-3xl lg:text-4xl font-satoshi-bold mb-3">Search results for:</h1>
        <h3 className="text-3xl font-satoshi-light pb-3">{data.search}</h3>
      </div>
      {/* <div className="flex border-b border-gray-600 mb-10">
        <h3 className="text-3xl font-satoshi-light pb-3">{data.search}</h3>
      </div> */}
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
              handlePageClick={handlePageClick}
              showMenu={false}
              showFilters={false}
              user={data.user}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
