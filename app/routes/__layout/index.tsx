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
  const page = +(searchParams.get("page") ?? 0);

  // WE ARE MAKING MODEL LIST THE DEFAULT FOR NOW
  return <div>{<ModelsListComponent data={data} />}</div>;
}
