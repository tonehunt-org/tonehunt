import { useState } from "react";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useLocation, useSearchParams } from "@remix-run/react";
// import type { Model } from "~/types/custom";
import type { User } from "@supabase/supabase-js";
import { db } from "~/utils/db.server";

import ModelsListComponent from "~/components/ModelList";

type LoaderData = {
  models: any;
  user?: User | null;
  count?: number;
  page?: number;
  hasMore?: boolean;
};

export const loader: LoaderFunction = async ({ request, context }) => {
  const models = await db.model.findMany({
    include: {
      profile: true,
      category: true,
    },
  });

  console.log(models);

  return json<LoaderData>({
    models: models,
    user: null,
  });
};

export default function Index() {
  const data = useLoaderData<LoaderData>();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  //const page = +(searchParams.get("page") ?? 0);

  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [sort, setSort] = useState<string>("newest");
  const limit = 5;

  // WE ARE MAKING MODEL LIST THE DEFAULT FOR NOW
  return (
    <div className="w-full">
      <div className="flex">
        <h1 className="text-5xl font-bold mb-10">Browse NAM Models</h1>
      </div>
      <div className="flex">
        <div className="w-3/4">
          {loading ? "Loading..." : null}
          {!loading ? <ModelsListComponent data={data} /> : null}
        </div>
        <div className="w-1/4 px-4">
          <div className="w-full text-white rounded-md p-2 mb-8 border border-gray-600">
            <span className="block p-20 text-center">Block 1</span>
          </div>
          <div className="w-full text-white rounded-md p-2 mb-8 border border-gray-600">
            <span className="block p-20 text-center">Block 2</span>
          </div>
          <div className="w-full text-white rounded-md p-2 mb-8 border border-gray-600">
            <span className="block p-20 text-center">Block 3</span>
          </div>
        </div>
      </div>
    </div>
  );
}
