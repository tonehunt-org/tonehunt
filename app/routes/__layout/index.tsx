import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { find, startCase } from "lodash";
import { getSession } from "~/auth.server";

import type { User } from "@supabase/supabase-js";
import { getModels } from "~/services/models";
import { getCategories } from "~/services/categories";
import type { ProfileWithSocials } from "~/services/profile";
import { getProfileWithSocials } from "~/services/profile";
import { ModelListCountTitle } from "~/components/routes/ModelListPage";
import type { Category, Counts, Model } from "@prisma/client";
import { db } from "~/utils/db.server";
import { MODELS_LIMIT } from "~/utils/constants";
import ModelList from "~/components/ModelList";

export const meta: MetaFunction<LoaderData> = ({ data, location }) => {
  const d = data as LoaderData;
  const searchParams = new URLSearchParams(location.search);

  const total = d.counts.reduce((total, count) => {
    return total + count.count;
  }, 0);

  const title = searchParams.get("tags")
    ? `#${searchParams.get("tags")} Models | ToneHunt`
    : searchParams.get("filter")
    ? `${startCase(searchParams.get("filter") as string)} Models | ToneHunt`
    : "ToneHunt | Sound Better!";

  const description = `Explore over ${total} Neural Amp Modeler models, including ${
    d.counts.find((count) => count.name === "amps")?.count
  } amps, and ${d.counts.find((count) => count.name === "pedals")?.count} pedals.`;

  // TODO: update this for new layout

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

export type LoaderData = {
  user?: User | null;
  models: Model[];
  profile: ProfileWithSocials | null;
  counts: Counts[];
  total: number;
  page: number;
  categories: Category[];
};

const sortByOptions = [
  { slug: "following", field: "createdAt" },
  { slug: "newest", field: "createdAt" },
  { slug: "popular", field: "popular" },
  { slug: "name", field: "title" },
];

export const loader: LoaderFunction = async ({ request }) => {
  const { session } = await getSession(request);

  const user = session?.user;
  const url = new URL(request.url);

  const profile = await getProfileWithSocials(session);

  // GET PAGE
  let page = +(url.searchParams.get("page") ?? "0");
  const offset = page * MODELS_LIMIT;

  // GET SORT DIRECTION
  const sortDirectionParam = url.searchParams.get("sortDirection") ?? "desc";
  const sortDirection = sortDirectionParam === "asc" || sortDirectionParam === "desc" ? sortDirectionParam : "desc";

  // GET FILTER
  const filter = url.searchParams.get("filter") ?? "all";

  // GET TAGS
  const tagsParam = url.searchParams.get("tags") ?? null;

  // GET CATEGORIES
  const categories = await getCategories();
  const selectedCategory = find(categories, ["slug", filter]);
  const categoryId = selectedCategory?.id ?? null;

  const countsReq = await db.counts.findMany();

  const modelsReq = getModels({
    limit: MODELS_LIMIT,
    next: offset,
    categoryId,
    sortBy: "createdAt",
    sortDirection,
    user,
    tags: tagsParam,
    following: true,
  });

  const [counts, models] = await Promise.all([countsReq, modelsReq]);

  return json<LoaderData>({
    counts,
    user,
    models: models.data,
    total: models.total,
    profile,
    page,
    categories,
  });
};

export default function Index() {
  const data = useLoaderData<LoaderData>();

  return (
    <>
      <ModelListCountTitle counts={data.counts} />

      <ModelList
        data={data.models}
        categories={data.categories}
        total={data.total}
        currentPage={data.page}
        limit={MODELS_LIMIT}
        user={data.user}
        profile={data.profile}
      />
    </>
  );
}
