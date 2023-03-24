import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { LoaderData } from "./ModelListPage";

export const modelDetailLoader: LoaderFunction = async ({ request }) => {
  return json<LoaderData>({
    user: null,
    username: null,
    modelDetail: {},
  });
};

export default function ModelDetailPage() {
  return <div>TODO: model detail page</div>;
}
