import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { find, startCase } from "lodash";
import { getSession } from "~/auth.server";

import type { User } from "@supabase/supabase-js";
import { getModels } from "~/services/models";
import { getCategories } from "~/services/categories";
import type { ProfileWithSocials } from "~/services/profile";
import { getProfileWithSocials } from "~/services/profile";
import ModelListPage, { ModelListTitle } from "~/components/routes/ModelListPage";
import type { Counts, Model } from "@prisma/client";
import { db } from "~/utils/db.server";
import { MODELS_LIMIT } from "~/utils/constants";
import Loading from "~/components/ui/Loading";
import ModelsList from "~/components/ModelList";
import { formatNumber } from "~/utils/number";

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
  models: Model[];
  profile: ProfileWithSocials | null;
  counts: Counts[];
  total: number;
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
  let page = +(url.searchParams.get("page") ?? "1");
  const offset = (page - 1) * MODELS_LIMIT;

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

  // GET MODELS
  // const modelsReq = db.model.findMany({
  //   where: {
  //     profile: {
  //       followers: {
  //         some: {
  //           profileId: user?.id,
  //           active: true,
  //           deleted: false,
  //         },
  //       },
  //     },
  //   },
  //   select: {
  //     id: true,
  //     title: true,
  //     description: true,
  //     tags: true,
  //     createdAt: true,
  //     updatedAt: true,
  //     filename: true,
  //     filecount: true,
  //     profile: {
  //       select: {
  //         id: true,
  //         username: true,
  //       },
  //     },
  //     category: {
  //       select: {
  //         id: true,
  //         title: true,
  //         slug: true,
  //         pluralTitle: true,
  //       },
  //     },
  //   },
  //   orderBy: {
  //     createdAt: "desc",
  //   },
  //   skip: offset,
  //   take: MODELS_LIMIT,
  // });

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
  });
};

export default function Index() {
  const data = useLoaderData<LoaderData>();

  return (
    <div className="w-full">
      <ModelListCountTitle counts={data.counts} />

      <div className="flex">
        <div className="w-full">
          <ModelsList
            data={data.models}
            total={data.total}
            currentPage={data.page}
            limit={MODELS_LIMIT}
            // handlePageClick={handlePageClick}
            // filterOptions={selectOptions}
            // selectedFilter={selectedFilter}
            // setSelectedFilter={handleFilterChange}
            // selectedSortBy={modelList.sortBy}
            // onSortChange={onSortChange}
            user={data.user}
            profile={data.profile}
          />
        </div>
      </div>
    </div>
  );
}

export const ModelListCountTitle = ({ counts, className }: { className?: string; counts: Counts[] }) => {
  const total = counts.reduce((total, count) => {
    return total + count.count;
  }, 0);

  return (
    <ModelListTitle className={className}>
      Explore over {formatNumber(total)} models, including{" "}
      <Link prefetch="intent" to="/?filter=amp" className="border-tonehunt-green border-b-8 hover:text-tonehunt-green">
        {formatNumber(counts.find((count) => count.name === "amps")?.count ?? 0)}
      </Link>{" "}
      amps, and{" "}
      <Link
        prefetch="intent"
        to="/?filter=pedal"
        className="border-tonehunt-yellow border-b-8 hover:text-tonehunt-yellow"
      >
        {formatNumber(counts.find((count) => count.name === "pedals")?.count ?? 0)}
      </Link>{" "}
      pedals.
    </ModelListTitle>
  );
};
