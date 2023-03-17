import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getSession } from "~/auth.server";
import uniqBy from "lodash/uniqBy";

export const loader: LoaderFunction = async ({ request, context }) => {
  const { supabase } = await getSession(request);
  const url = new URL(request.url);

  const titleSearch = supabase
    .from("models")
    .select()
    .textSearch("title", url.searchParams.get("query") as string);
  const descriptionSearch = supabase
    .from("models")
    .select()
    .textSearch("description", url.searchParams.get("query") as string);

  // For sure not performant, but Supabase doesn't have a way, I think, to full text search multiple
  // columns without writing SQL. Will revist soon.
  const [byTitle, byDescription] = await Promise.all([titleSearch, descriptionSearch]);
  const items = uniqBy(byTitle.data?.concat(byDescription.data), (item) => item.id);

  return json(items);
};
