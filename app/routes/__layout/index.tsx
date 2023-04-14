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
import ModelListPage, { MODELS_LIMIT } from "~/components/routes/ModelListPage";
import ModelDetailPage from "~/components/routes/ModelDetailPage";
import type { Counts } from "@prisma/client";
import { db } from "~/utils/db.server";

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
  username: string | null;
  modelList?: {
    models: any;
    total: number;
    page: number;
    filter: string;
    categories: any;
    sortBy: string;
    sortDirection: string;
    tags: string | null;
  };
  modelDetail?: {};
  profile: ProfileWithSocials | null;
  counts: Counts[];
};

const sortByOptions = [
  { slug: "following", field: "createdAt" },
  { slug: "newest", field: "createdAt" },
  { slug: "popular", field: "popular" },
  { slug: "name", field: "title" },
];

export const loader: LoaderFunction = async ({ request }) => {
  const { session } = await getSession(request);

  const defaultSortBy = "newest";

  const user = session?.user;
  const url = new URL(request.url);

  const profile = await getProfileWithSocials(session);

  // GET PAGE
  let page = Number(url.searchParams.get("page")) ?? 1;
  if (!page || page === 0) page = 1;
  const offset = (page - 1) * MODELS_LIMIT;

  // GET SORT BY
  const sortByParam = url.searchParams.get("sortBy") || defaultSortBy;
  const selectedSortBy = find(sortByOptions, ["slug", sortByParam]);
  const sortBy = selectedSortBy?.field ?? "createdAt";

  // GET SORT DIRECTION
  const sortDirectionParam = url.searchParams.get("sortDirection") ?? "desc";
  const sortDirection = sortDirectionParam === "asc" || sortDirectionParam === "desc" ? sortDirectionParam : "desc";

  // GET USERNAME
  const usernameParam = url.searchParams.get("username") ?? null;

  // GET FILTER
  const filter = url.searchParams.get("filter") ?? "all";

  // GET TAGS
  const tagsParam = url.searchParams.get("tags") ?? null;

  // GET CATEGORIES
  const categories = await getCategories();
  const selectedCategory = find(categories, ["slug", filter]);
  const categoryId = selectedCategory?.id ?? null;

  const countsReq = await db.counts.findMany();

  // GET MODELS
  const modelsReq = getModels({
    limit: MODELS_LIMIT,
    next: offset,
    categoryId,
    sortBy,
    sortDirection,
    username: usernameParam,
    user,
    tags: tagsParam,
    following: sortByParam === "following",
  });

  const [counts, models] = await Promise.all([countsReq, modelsReq]);

  return json<LoaderData>({
    counts,
    user,
    username: usernameParam,
    modelList: {
      models: models.data,
      total: models.total,
      page: page - 1,
      filter,
      categories,
      sortBy: selectedSortBy?.slug || "following",
      sortDirection,
      tags: tagsParam,
    },
    profile,
  });
};

export default function Index() {
  const data = useLoaderData<LoaderData>();

  if (data.modelList) {
    return <ModelListPage counts={data.counts} />;
  }

  if (data.modelDetail) {
    return <ModelDetailPage />;
  }
}
