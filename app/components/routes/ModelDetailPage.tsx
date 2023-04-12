import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

export const modelDetailLoader: LoaderFunction = async ({ request }) => {
  return json<{}>({
    user: null,
    username: null,
    modelDetail: {},
  });
};

export default function ModelDetailPage() {
  return <div>TODO: model detail page</div>;
}
