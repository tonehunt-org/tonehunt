import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import type { LoaderData as ModelListPageLoaderData } from "~/components/routes/ModelListPage";
import ModelListPage, { modelListLoader } from "~/components/routes/ModelListPage";
import ModelDetailPage from "~/components/routes/ModelDetailPage";

const modelDetailLoader: LoaderFunction = async ({ request }) => {
  return json<ModelListPageLoaderData>({
    user: null,
    username: null,
    modelDetail: {},
  });
};

export const loader: LoaderFunction = async (loaderArgs) => {
  // Detect if it's a full page load, or Remix fetch() magic.
  const isFullPageLoad = loaderArgs.request.headers.get("sec-fetch-mode") === "navigate";

  if (isFullPageLoad && loaderArgs.params.username && loaderArgs.params.model) {
    return modelDetailLoader(loaderArgs);
  }

  return modelListLoader(loaderArgs);
};

export default function Index() {
  const data = useLoaderData<ModelListPageLoaderData>();

  if (data.modelList) {
    return <ModelListPage />;
  }

  if (data.modelDetail) {
    return <ModelDetailPage />;
  }
}
